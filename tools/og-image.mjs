/* Image de partage (Open Graph) 1200 × 630 : le triptyque des trois photos KAZA sous un voile Dark Forest, le logo et la signature.
   Rendue par Chrome sans interface (JPEG qualité 86) → site/assets/og.jpg.  Lancer : node tools/og-image.mjs */
import { spawn } from 'node:child_process';
import { writeFile, access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';
import { logo } from '../source/lib.mjs';
import { FORET, CITRON, BLANC, GRIS } from '../source/site/palette.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const woff = (await readFile(join(RACINE, 'charte', 'assets', 'fonts', 'Outfit-latin.woff2'))).toString('base64');
const img = (n) => pathToFileURL(join(RACINE, 'site', 'assets', 'img', `kaza-${n}-720.webp`)).href;
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face { font-family: Outfit; src: url(data:font/woff2;base64,${woff}) format("woff2"); font-weight: 300 700; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${FORET}; font-family: Outfit, sans-serif; }
.scene { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr 1fr; }
.scene img { width: 100%; height: 100%; object-fit: cover; display: block; }
.voile { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(21,54,17,.95) 0%, rgba(21,54,17,.8) 34%, rgba(21,54,17,.35) 62%, rgba(21,54,17,.15) 100%), linear-gradient(0deg, rgba(21,54,17,.9) 0%, rgba(21,54,17,0) 50%); }
.copie { position: absolute; left: 72px; top: 96px; right: 72px; color: ${BLANC}; }
.copie .logo { width: 300px; height: auto; }
h1 { margin: 44px 0 0; font-size: 64px; font-weight: 600; line-height: 1.05; letter-spacing: -.015em; max-width: 12ch; }
h1 em { font-style: normal; color: ${CITRON}; }
p { margin: 22px 0 0; font-size: 24px; font-weight: 400; color: ${GRIS}; letter-spacing: .04em; }
</style></head><body>
<div class="scene"><img src="${img(2)}"><img src="${img(1)}"><img src="${img(3)}"></div><div class="voile"></div>
<div class="copie">${logo({ couleur: BLANC, accent: CITRON, taille: 100 }).replace(/ style="width:[^"]*"/, '')}<h1>Préparer, organiser et vivre <em>le Gabon</em>.</h1><p>Logement · Hébergement · Tourisme · Conciergerie · Diaspora</p></div>
</body></html>`;
const page = join(RACINE, 'tools', 'audit', 'og.html'); await writeFile(page, html);
const chromes = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'];
let CHROME = null; for (const c of chromes) { try { await access(c); CHROME = c; break; } catch { /* suivant */ } }
const port = 9600 + Math.floor(Math.random() * 60);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--disable-extensions', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzog-${port}`, '--window-size=1200,630', 'about:blank'], { stdio: 'ignore' });
let cible = null; for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl); await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map(); ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
await envoyer('Page.enable'); await envoyer('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await envoyer('Page.navigate', { url: pathToFileURL(page).href }); await attendre(2500);
const { data } = (await envoyer('Page.captureScreenshot', { format: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } })).result;
const sortie = join(RACINE, 'site', 'assets', 'og.jpg'); await writeFile(sortie, Buffer.from(data, 'base64'));
console.log(`og.jpg : ${(Buffer.from(data, 'base64').length / 1024).toFixed(0)} Ko → site/assets/og.jpg`);
try { ws.close(); } catch { /* fermé */ } chrome.kill();
