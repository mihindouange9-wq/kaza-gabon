/* Icônes d'application (écran d'accueil iPhone et Android) et manifeste : le A de KAZA sur tuile vert forêt, en PNG
   180 (apple-touch-icon), 192 et 512 (manifeste), 512 « maskable » (lettre dans la zone sûre), rendus par Chrome (canvas).
   Lancer : node tools/icones-app.mjs   (écrit site/assets/icons/*.png et site/manifest.webmanifest) */
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';
import { symbole, FORET, BLANC, CITRON } from '../source/lib.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(RACINE, 'site', 'assets', 'icons');
await mkdir(DEST, { recursive: true });

/* carré plein (les systèmes appliquent leur propre masque) ; « echelle » = part de la largeur occupée par la lettre */
const carre = (echelle) => {
  const lettre = symbole({ fond: FORET, lettre: BLANC, accent: CITRON, tuile: false }).replace(/ style="[^"]*"/, '').replace(/ class="[^"]*"/, '').replace(/ role="img" aria-label="[^"]*"/, '');
  const marge = (1 - echelle) / 2 * 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${FORET}"/><svg x="${marge}" y="${marge}" width="${echelle * 100}" height="${echelle * 100}" viewBox="0 0 100 100">${lettre.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg></svg>`;
};
const ICONES = [
  ['icon-180.png', 180, carre(.82)],
  ['icon-192.png', 192, carre(.82)],
  ['icon-512.png', 512, carre(.82)],
  ['icon-maskable-512.png', 512, carre(.62)],
];

const port = 9680 + Math.floor(Math.random() * 20);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzico-${port}`, 'about:blank'], { stdio: 'ignore' });
let cible = null; for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl); await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const att = new Map(); ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && att.has(t.id)) { att.get(t.id)(t); att.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; att.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
for (const [nom, taille, svg] of ICONES) {
  const donnees = await evaluer(`(async () => { const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(${JSON.stringify(svg)}); await img.decode(); const c = document.createElement('canvas'); c.width = ${taille}; c.height = ${taille}; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, ${taille}, ${taille}); return c.toDataURL('image/png').split(',')[1]; })()`);
  const buf = Buffer.from(donnees, 'base64');
  await writeFile(join(DEST, nom), buf);
  console.log(`${nom} : ${taille}×${taille}, ${Math.round(buf.length / 1024)} Ko`);
}
const manifeste = {
  name: 'KAZA GABON – ÉCO TOURISME',
  short_name: 'KAZA',
  description: 'Préparer, organiser et vivre un séjour au Gabon : logement, hébergement, tourisme, conciergerie, diaspora.',
  lang: 'fr',
  start_url: './?source=app',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: FORET,
  theme_color: FORET,
  icons: [
    { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
await writeFile(join(RACINE, 'site', 'manifest.webmanifest'), JSON.stringify(manifeste, null, 2) + '\n');
console.log('site/manifest.webmanifest écrit');
ws.close(); chrome.kill();
