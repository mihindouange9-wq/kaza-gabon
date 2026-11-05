/* Vérification de la vitrine dans Chrome sans interface : bureau 1440, tablette 820, téléphone 390 (tactile).
   Console, images chargées, débordement horizontal, textes trop petits, contrastes, cibles tactiles, formulaires,
   puis défilement en dix positions avec captures dans tools/captures-site/.  Lancer : node tools/site-verifier.mjs [--sans-captures] */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const captures = !process.argv.includes('--sans-captures');
const chromes = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', process.env.CHROME_PATH].filter(Boolean);
let CHROME = null; for (const c of chromes) { try { await access(c); CHROME = c; break; } catch { /* suivant */ } }
const port = 9820 + Math.floor(Math.random() * 60);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--disable-extensions', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzsite-${port}`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let cible = null;
for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map(); let journal = []; const urls = new Map();
ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); return; } if (t.method === 'Runtime.exceptionThrown') journal.push('exception : ' + (t.params.exceptionDetails?.exception?.description || t.params.exceptionDetails?.text || '').split('\n')[0]); if (t.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(t.params.type)) journal.push(t.params.type + ' : ' + t.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200)); if (t.method === 'Network.requestWillBeSent') urls.set(t.params.requestId, t.params.request.url); if (t.method === 'Network.loadingFailed') journal.push('chargement échoué : ' + t.params.errorText + ' ' + (urls.get(t.params.requestId) || '').split('/').pop()); };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); return r.result?.exceptionDetails ? 'ERREUR ' + r.result.exceptionDetails.exception?.description : r.result?.result?.value; };
await envoyer('Page.enable'); await envoyer('Runtime.enable'); await envoyer('Network.enable');
const dossier = join(RACINE, 'tools', 'captures-site'); if (captures) await mkdir(dossier, { recursive: true });
let anomalies = 0;
for (const [nom, largeur, hauteur, tactile] of [['bureau', 1440, 900, false], ['tablette', 820, 1180, true], ['telephone', 390, 844, true]]) {
  journal = [];
  await envoyer('Emulation.setDeviceMetricsOverride', { width: largeur, height: hauteur, deviceScaleFactor: 1, mobile: tactile });
  await envoyer('Emulation.setTouchEmulationEnabled', { enabled: tactile });
  await envoyer('Page.navigate', { url: pathToFileURL(join(RACINE, 'site', 'index.html')).href });
  await attendre(5200);
  const problemes = []; const petits = new Set(), faibles = new Set(), cibles = new Set();
  const positions = [0, .1, .2, .32, .45, .58, .7, .82, .93, 1];
  for (const p of positions) {
    await evaluer(`(() => { const y = (document.documentElement.scrollHeight - innerHeight) * ${p}; if (window.lenis) window.lenis.scrollTo(y, { immediate: true }); window.scrollTo(0, y); })()`);
    await attendre(p === 0 ? 300 : 700);
    const m = await evaluer(`(() => { const de = document.documentElement; return { largeurDoc: de.scrollWidth, deb: [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); if (!(r.right > ${largeur} + 2 && r.width > 0 && r.height > 0)) return false; if (getComputedStyle(el).position === 'fixed' || el.closest('.menu, #vol')) return false; let p = el.parentElement; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o !== 'visible' && p.getBoundingClientRect().right <= ${largeur} + 2) return false; p = p.parentElement; } return true; }).slice(0, 3).map((el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '')) }; })()`);
    const textes = await evaluer(`(() => { const petits = [], faibles = [], cibles = []; const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }; const rgb = (s) => (s.match(/[\\d.]+/g) || []).map(Number); const fondCorps = rgb(getComputedStyle(document.body).backgroundColor);
      document.querySelectorAll('p, li, a, span, small, dt, dd, label, h3, b, button, figcaption, legend').forEach((el) => { if (!el.offsetParent || el.closest('svg, .visuellement-cache, .menu, [hidden]')) return; const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.width === 0) return; const t = el.textContent.trim(); if (t.length < 12 || el.children.length > 2) return; const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize); if (fs < 13) petits.push((el.className.split(' ')[0] || el.tagName) + ' ' + fs); if (parseFloat(cs.opacity) < .5) return; let fond = null, pa = el; while (pa && pa !== document.documentElement) { if (pa.classList.contains('entete')) { fond = [0, 41, 27]; break; } const b = rgb(getComputedStyle(pa).backgroundColor); if (b.length >= 3 && (b.length === 3 || b[3] > .9)) { fond = b; break; } pa = pa.parentElement; } if (!fond) fond = fondCorps; const c = rgb(cs.color); if (c.length >= 3 && fond.length >= 3 && !(c.length === 4 && c[3] < .5) && !el.closest('.voile, .legende, figcaption, .vignette')) { const l1 = lum(c[0], c[1], c[2]), l2 = lum(fond[0], fond[1], fond[2]); const ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); const gras = parseInt(cs.fontWeight) >= 600 && fs >= 18.66; if (ratio < 4.5 && fs < 24 && !gras) faibles.push((el.className.split(' ')[0] || el.tagName) + ' ' + ratio.toFixed(1) + ' « ' + t.slice(0, 28) + ' »'); } });
      if (${tactile}) document.querySelectorAll('a, button, input:not([type="checkbox"]), select, textarea, .cases label').forEach((el) => { if (!el.offsetParent || el.closest('.menu, [hidden], .visuellement-cache')) return; const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.width === 0) return; if (getComputedStyle(el).display === 'inline' && el.closest('p, span')) return; if (r.height < 40 || r.width < 40) cibles.push((el.className.split(' ')[0] || el.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); });
      return { petits, faibles, cibles }; })()`);
    textes.petits.forEach((x) => petits.add(x)); textes.faibles.forEach((x) => faibles.add(x)); textes.cibles.forEach((x) => cibles.add(x));
    if (m.largeurDoc > largeur + 2) problemes.push(`débordement ${m.largeurDoc}px à ${Math.round(p * 100)} % (${m.deb.join(', ')})`);
    if (captures) { const { data } = (await envoyer('Page.captureScreenshot', { format: 'png' })).result; await writeFile(join(dossier, `${nom}-${String(Math.round(p * 100)).padStart(3, '0')}.png`), Buffer.from(data, 'base64')); }
  }
  const images = await evaluer(`(() => { const l = [...document.images]; return { total: l.length, cassees: l.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc.split('/').pop()).slice(0, 5), sansAlt: l.filter((i) => !i.hasAttribute('alt')).length }; })()`);
  if (images.cassees.length) problemes.push(`images cassées : ${images.cassees.join(', ')}`);
  if (images.sansAlt) problemes.push(`${images.sansAlt} image(s) sans alt`);
  if (petits.size) problemes.push(`textes < 13 px : ${[...petits].slice(0, 4).join(', ')}`);
  if (faibles.size) problemes.push(`contrastes < 4,5 : ${[...faibles].slice(0, 6).join(', ')}`);
  if (cibles.size) problemes.push(`cibles < 40 px : ${[...cibles].slice(0, 6).join(', ')}`);
  const reveals = await evaluer(`[...document.querySelectorAll('[data-reveal]')].filter((el) => !el.classList.contains('visible') || parseFloat(getComputedStyle(el).opacity) < .9).length`);
  if (reveals) problemes.push(`${reveals} élément(s) jamais révélé(s)`);
  /* formulaires : la validation bloque un envoi vide et nomme l'erreur */
  const form = await evaluer(`(() => { const f = document.getElementById('demande'); if (!f) return 'absent'; f.requestSubmit(); const err = f.querySelector('.erreur[data-visible]'); const inv = f.querySelectorAll('[aria-invalid="true"]').length; return err && inv ? 'ok ' + inv : 'validation muette'; })()`);
  if (!/^ok/.test(form)) problemes.push('formulaire : ' + form);
  const reservation = await evaluer(`(() => { const f = document.getElementById('reserver'); if (!f) return 'absent'; f.requestSubmit(); const inv = f.querySelectorAll('[aria-invalid="true"]').length; return inv >= 6 ? 'ok' : 'validation incomplète ' + inv; })()`);
  if (reservation !== 'ok') problemes.push('réservation : ' + reservation);
  const recherche = await evaluer(`(() => { const f = document.getElementById('recherche'); f.destination.value = 'Libreville'; f.requestSubmit(); const res = document.getElementById('resultat'); const vis = [...document.querySelectorAll('.annonce')].filter((a) => !a.hidden).length; return res.hasAttribute('data-visible') && vis === 2 ? 'ok' : 'résultat ' + res.textContent.slice(0, 40) + ' / ' + vis + ' visibles'; })()`);
  if (recherche !== 'ok') problemes.push('recherche : ' + recherche);
  problemes.push(...journal.filter((l) => !/favicon|ERR_ABORTED/.test(l)));
  const polices = await evaluer(`[document.fonts.check('600 20px Outfit'), document.fonts.check('400 20px "Plus Jakarta Sans"')]`);
  if (!(polices[0] && polices[1])) problemes.push('polices non chargées ' + JSON.stringify(polices));
  if (problemes.length) { anomalies += problemes.length; console.log(`✗ ${nom} ${largeur}px : ${problemes.join(' | ')}`); }
  else console.log(`✓ ${nom} ${largeur}px : défilement, images (${images.total}), textes, contrastes, cibles, révélations, formulaire, recherche, console`);
}
console.log(anomalies ? `\n${anomalies} anomalie(s)` : '\naucune anomalie');
try { ws.close(); } catch { /* fermé */ }
chrome.kill();
process.exit(anomalies ? 1 : 0);
