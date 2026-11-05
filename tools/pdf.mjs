/* Export PDF de la charte via Chrome sans interface (une planche par page, 1600 × 1000 px).
   Lancer : node tools/pdf.mjs   → charte/KAZA-charte.pdf */
import { spawn } from 'node:child_process';
import { writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const chromes = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', process.env.CHROME_PATH].filter(Boolean);
let CHROME = null; for (const c of chromes) { try { await access(c); CHROME = c; break; } catch { /* suivant */ } }
const port = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--disable-extensions', '--allow-file-access-from-files', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzpdf-${port}`, 'about:blank'], { stdio: 'ignore' });
let cible = null;
for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map();
ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
await envoyer('Page.enable'); await envoyer('Runtime.enable');
await envoyer('Emulation.setEmulatedMedia', { media: 'print' });
await envoyer('Page.navigate', { url: pathToFileURL(join(RACINE, 'charte', 'index.html')).href });
await attendre(2500);
await envoyer('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
await envoyer('Runtime.evaluate', { expression: 'Promise.all([...document.images].map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))', awaitPromise: true });
/* 1600 × 1000 px = 16.667 × 10.417 pouces à 96 dpi */
const r = await envoyer('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, paperWidth: 16.667, paperHeight: 10.417, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, scale: 1 });
if (!r.result?.data) { console.error('export impossible', r.error); chrome.kill(); process.exit(1); }
const sortie = join(RACINE, 'charte', 'KAZA-charte.pdf');
await writeFile(sortie, Buffer.from(r.result.data, 'base64'));
console.log(`PDF écrit : ${sortie} (${Math.round(Buffer.byteLength(r.result.data, 'base64') / 1024)} Ko)`);
try { ws.close(); } catch { /* fermé */ }
chrome.kill();
