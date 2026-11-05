/* Convertit les photos fournies par KAZA (1.jpeg, 2.jpeg, 3.jpeg à la racine du dossier) en WebP dans site/assets/img
   (kaza-1-480/720, kaza-2-480/720, kaza-3-480/720/1024), avec Chrome sans interface (canvas : sharp est bloqué sur ce poste).
   Lancer : node tools/images-client.mjs */
import { spawn } from 'node:child_process';
import { writeFile, stat, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(RACINE, 'site', 'assets', 'img');
await mkdir(DEST, { recursive: true });
const PHOTOS = [
  { fichier: '1.jpeg', base: 'kaza-1', tailles: [480, 720] },
  { fichier: '2.jpeg', base: 'kaza-2', tailles: [480, 720] },
  { fichier: '3.jpeg', base: 'kaza-3', tailles: [480, 720, 1024] },
];
const port = 9700 + Math.floor(Math.random() * 30);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzcli-${port}`, 'about:blank'], { stdio: 'ignore' });
let cible = null; for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl); await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const att = new Map(); ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && att.has(t.id)) { att.get(t.id)(t); att.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; att.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
await envoyer('Page.navigate', { url: pathToFileURL(join(RACINE, PHOTOS[0].fichier)).href }); await attendre(500);
let total = 0;
for (const p of PHOTOS) {
  const src = pathToFileURL(join(RACINE, p.fichier)).href;
  for (const largeur of p.tailles) {
    const q = largeur >= 1024 ? 0.82 : largeur >= 720 ? 0.8 : 0.74;
    const donnees = await evaluer(`(async () => { const img = new Image(); img.src = ${JSON.stringify(src)}; await img.decode(); const w = Math.min(${largeur}, img.naturalWidth); const h = Math.round(img.naturalHeight * w / img.naturalWidth); const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h); return [w, h, c.toDataURL('image/webp', ${q}).split(',')[1]]; })()`);
    const buf = Buffer.from(donnees[2], 'base64');
    await writeFile(join(DEST, `${p.base}-${largeur}.webp`), buf);
    total += buf.length;
    console.log(`${p.base}-${largeur}.webp : ${donnees[0]}×${donnees[1]}, ${Math.round(buf.length / 1024)} Ko`);
  }
  const s = await stat(join(RACINE, p.fichier));
  console.log(`${p.fichier} (${Math.round(s.size / 1024)} Ko) → ${p.tailles.length} WebP`);
}
console.log(`total : ${Math.round(total / 1024)} Ko`);
ws.close(); chrome.kill();
