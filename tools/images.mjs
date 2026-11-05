/* Convertit les photos de charte/assets/photos en WebP (1600, 960 et 480 px de large) dans site/assets/img,
   avec Chrome sans interface (canvas + toDataURL : sharp est bloqué sur ce poste), et copie les crédits.
   Lancer : node tools/images.mjs */
import { spawn } from 'node:child_process';
import { readdir, writeFile, stat, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(RACINE, 'charte', 'assets', 'photos');
const DEST = join(RACINE, 'site', 'assets', 'img');
await mkdir(DEST, { recursive: true });
const fichiers = (await readdir(SOURCE)).filter((f) => f.endsWith('.jpg'));
const port = 9760 + Math.floor(Math.random() * 30);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzimg-${port}`, 'about:blank'], { stdio: 'ignore' });
let cible = null; for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl); await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const att = new Map(); ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && att.has(t.id)) { att.get(t.id)(t); att.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; att.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
await envoyer('Page.navigate', { url: pathToFileURL(join(SOURCE, fichiers[0])).href }); await attendre(500);
let total = 0;
for (const f of fichiers) {
  const base = f.replace(/\.jpg$/, '');
  for (const [largeur, q] of [[1600, 0.8], [960, 0.78], [480, 0.74]]) {
    const donnees = await evaluer(`(async () => { const img = new Image(); img.src = ${JSON.stringify(pathToFileURL(join(SOURCE, f)).href)}; await img.decode(); const w = Math.min(${largeur}, img.naturalWidth); const h = Math.round(img.naturalHeight * w / img.naturalWidth); const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h); return c.toDataURL('image/webp', ${q}).split(',')[1]; })()`);
    const buf = Buffer.from(donnees, 'base64');
    await writeFile(join(DEST, `${base}-${largeur}.webp`), buf);
    total += buf.length;
  }
  const s = await stat(join(SOURCE, f));
  console.log(`${base} : jpg ${Math.round(s.size / 1024)} Ko → webp 1600 / 960 / 480`);
}
await copyFile(join(SOURCE, 'credits.json'), join(DEST, 'credits.json'));
console.log(`total webp : ${Math.round(total / 1024)} Ko (${fichiers.length} photos, crédits copiés)`);
ws.close(); chrome.kill();
