// Crée (ou retrouve) le site statique KAZA GABON sur Render par l'API publique, sans passer par le tableau de bord,
// puis suit le déploiement jusqu'à l'état « live ».
//
// Usage : RENDER_API_KEY=rnd_xxx node tools/render-deploy.mjs
//    ou : RENDER_KEY_FILE=chemin/vers/un/fichier/hors/du/dépôt node tools/render-deploy.mjs
// La clé se crée dans Render → Account Settings → API Keys (https://dashboard.render.com/u/settings#api-keys).
// Elle n'est jamais écrite dans le dépôt : environnement du processus ou fichier hors du dépôt uniquement.
// Un push sur main ne redéploie pas forcément (l'application GitHub de Render n'est pas installée) :
// relancer cet outil après chaque mise à jour, il demande alors un nouveau déploiement.

import { readFileSync } from "node:fs";

const API = "https://api.render.com/v1";
const KEY = process.env.RENDER_API_KEY || (process.env.RENDER_KEY_FILE ? readFileSync(process.env.RENDER_KEY_FILE, "utf8").trim() : "");
if (!KEY) {
  console.error("RENDER_API_KEY (ou RENDER_KEY_FILE) manquante dans l'environnement.");
  process.exit(1);
}

const REPO = "https://github.com/mihindouange9-wq/kaza-gabon";
const NAME = "kaza-gabon";
const URL_FINALE = "https://kaza-gabon.onrender.com"; // adresse souhaitée ; Render peut en attribuer une autre si le nom est pris

const header = (path, name, value) => ({ path, name, value });
const SERVICE = {
  type: "static_site",
  name: NAME,
  repo: REPO,
  branch: "main",
  autoDeploy: "yes",
  envVars: [],
  serviceDetails: {
    buildCommand: "",
    publishPath: "site",
    pullRequestPreviewsEnabled: "no",
    headers: [
      header("/assets/vendor/*", "Cache-Control", "public, max-age=31536000, immutable"),
      header("/assets/img/*", "Cache-Control", "public, max-age=2592000"),
      header("/assets/fonts/*", "Cache-Control", "public, max-age=31536000, immutable"),
      header("/*", "X-Content-Type-Options", "nosniff"),
      header("/*", "X-Frame-Options", "DENY"),
      header("/*", "Referrer-Policy", "strict-origin-when-cross-origin"),
      header("/*", "Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"),
      header("/*", "Strict-Transport-Security", "max-age=31536000; includeSubDomains"),
      header(
        "/*",
        "Content-Security-Policy",
        // aucun script en ligne (intro.js et config.js sont des fichiers) ; styles en ligne nécessaires (SVG, grilles) ;
        // les formulaires ne naviguent jamais (WhatsApp s'ouvre par window.open, autorisé par le navigateur, hors CSP)
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
      ),
    ],
  },
};

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, Accept: "application/json", "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = typeof data === "object" && data && data.message ? data.message : text;
    throw new Error(`${method} ${path} → ${res.status} ${message}`);
  }
  return data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const owners = await api("GET", "/owners?limit=20");
  const list = owners.map((o) => o.owner);
  if (!list.length) throw new Error("Aucun espace de travail visible avec cette clé.");
  const owner = list.find((o) => o.type === "user") || list[0];
  console.log(`Espace de travail : ${owner.name} (${owner.id}, ${owner.type})`);

  const existing = (await api("GET", `/services?name=${NAME}&ownerId=${owner.id}&limit=20`)).map((s) => s.service);
  let service = existing.find((s) => s.name === NAME && s.type === "static_site");
  let deployId;

  if (service) {
    console.log(`Service existant : ${service.id} → ${service.serviceDetails?.url ?? ""}`);
    await api("PATCH", `/services/${service.id}`, { serviceDetails: { headers: SERVICE.serviceDetails.headers, publishPath: SERVICE.serviceDetails.publishPath, buildCommand: SERVICE.serviceDetails.buildCommand } });
    const deploy = await api("POST", `/services/${service.id}/deploys`, { clearCache: "do_not_clear" });
    deployId = deploy.id;
    console.log(`Nouveau déploiement demandé : ${deployId}`);
  } else {
    console.log(`Création du site statique « ${NAME} » depuis ${REPO} (branche main)…`);
    const created = await api("POST", "/services", { ...SERVICE, ownerId: owner.id });
    service = created.service;
    deployId = created.deployId;
    console.log(`Service créé : ${service.id}`);
    console.log(`Adresse : ${service.serviceDetails?.url ?? "(en attente)"}`);
    console.log(`Premier déploiement : ${deployId}`);
  }

  const started = Date.now();
  let status = "";
  while (Date.now() - started < 15 * 60 * 1000) {
    const deploy = await api("GET", `/services/${service.id}/deploys/${deployId}`);
    if (deploy.status !== status) {
      status = deploy.status;
      console.log(`  ${new Date().toLocaleTimeString("fr-FR")}  ${status}`);
    }
    if (status === "live") break;
    if (/failed|canceled|deactivated/.test(status)) {
      throw new Error(`Déploiement terminé en état « ${status} ». Journal : https://dashboard.render.com/static/${service.id}/deploys/${deployId}`);
    }
    await sleep(8000);
  }
  if (status !== "live") throw new Error("Délai dépassé : le déploiement n'a pas atteint l'état « live » en 15 minutes.");

  const url = service.serviceDetails?.url ?? URL_FINALE;
  console.log(`\nEn ligne : ${url}`);
  console.log(`Tableau de bord : https://dashboard.render.com/static/${service.id}`);
}

main().catch((error) => {
  console.error(`\nÉchec : ${error.message}`);
  if (/repo|repository|github|access|permission/i.test(error.message)) {
    console.error(
      "Render n'a pas accès au dépôt. Le rendre public (gh repo edit mihindouange9-wq/kaza-gabon --visibility public)\nou autoriser l'application GitHub de Render : https://github.com/apps/render/installations/new",
    );
  }
  process.exit(1);
});
