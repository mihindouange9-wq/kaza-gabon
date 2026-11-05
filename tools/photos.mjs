// Télécharge les photographies du Gabon retenues pour la charte depuis Wikimedia Commons (licences libres),
// en 1920 px de large, dans charte/assets/photos/, avec leurs crédits dans charte/assets/photos/credits.json.
// Lancer : node tools/photos.mjs
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = join(RACINE, "charte", "assets", "photos");
mkdirSync(DOSSIER, { recursive: true });
const UA = "kaza-charte/1.0 (contact@methodeaura.com)";
const CHOIX = [
  ["savane-nyonie", "File:Éléphant dans la savane de Nyonié au Gabon. DJI 0084 CVIGNA.jpg", "Éléphant dans la savane de Nyonié"],
  ["baie-nyonie", "File:Baie de Nyonié vue de la forêt au Gabon.jpg", "Baie de Nyonié vue de la forêt"],
  ["mangrove-nyonie", "File:La mangrove Nyonié au Gabon.jpg", "Mangrove de Nyonié"],
  ["plage-nyonie", "File:Coucher de Soleil sud de la plage de Nyonié.jpg", "Plage de Nyonié au coucher du soleil"],
  ["riviere-nyonie", "File:Rivière de Nyonié, Gabon.jpg", "Rivière de Nyonié"],
  ["plaine-nyonie", "File:La plaine aux images Nyonié Gabon.DJI 0020 CVIGNA.jpg", "Plaine de Nyonié"],
  ["libreville-mer", "File:Libreville bord de mer.jpg", "Libreville, bord de mer"],
  ["libreville-front", "File:Libreville frond de mer.jpg", "Front de mer de Libreville"],
  ["loango-lodge", "File:Gabon Loango National Park View of Lodge from water.jpeg", "Lodge du parc national de Loango"],
  ["loango-elephants", "File:Gabon Loango National Park Elephant with offspring.jpeg", "Éléphants du parc national de Loango"],
];
const credits = [];
for (const [slug, titre, legende] of CHOIX) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titre)}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1920&format=json`;
  const j = await (await fetch(u, { headers: { "User-Agent": UA } })).json();
  const p = Object.values(j.query.pages)[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) { console.log("introuvable :", titre); continue; }
  const m = ii.extmetadata || {};
  const auteur = (m.Artist?.value || "").replace(/<[^>]+>/g, "").trim();
  const licence = m.LicenseShortName?.value || "";
  const fichier = join(DOSSIER, `${slug}.jpg`);
  if (!existsSync(fichier)) {
    const buf = Buffer.from(await (await fetch(ii.thumburl, { headers: { "User-Agent": UA } })).arrayBuffer());
    writeFileSync(fichier, buf);
  }
  credits.push({ slug, legende, titre: titre.slice(5), auteur, licence, source: ii.descriptionurl, largeur: ii.thumbwidth, hauteur: ii.thumbheight });
  console.log(`${slug}.jpg ← ${auteur} · ${licence} · ${ii.thumbwidth}×${ii.thumbheight}`);
}
writeFileSync(join(DOSSIER, "credits.json"), JSON.stringify(credits, null, 2));
console.log(credits.length, "photos, crédits écrits");
