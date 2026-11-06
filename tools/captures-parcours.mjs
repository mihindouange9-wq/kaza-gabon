/* Captures ciblées du parcours KAZA (recherche à onglets, panneau de demande, écran final, choix, variantes, menu) : ordinateur 1440 et téléphone 390.
   Lancer : node tools/captures-parcours.mjs  → tools/captures-site/parcours/ */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = join(RACINE, 'tools', 'captures-site', 'parcours');
await mkdir(SORTIE, { recursive: true });
const chromes = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'];
let CHROME = null; for (const c of chromes) { try { await access(c); CHROME = c; break; } catch { /* suivant */ } }
const port = 9900 + Math.floor(Math.random() * 60);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--disable-extensions', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzcap-${port}`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let cible = null;
for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map(); const journal = [];
ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); return; } if (t.method === 'Runtime.exceptionThrown') journal.push('exception : ' + (t.params.exceptionDetails?.exception?.description || '').split('\n')[0]); if (t.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(t.params.type)) journal.push(t.params.type + ' : ' + t.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 160)); };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); return r.result?.exceptionDetails ? 'ERREUR ' + r.result.exceptionDetails.exception?.description : r.result?.result?.value; };
await envoyer('Page.enable'); await envoyer('Runtime.enable');
const capturer = async (nom) => { const { data } = (await envoyer('Page.captureScreenshot', { format: 'png' })).result; await writeFile(join(SORTIE, nom + '.png'), Buffer.from(data, 'base64')); };
const defiler = async (expr) => { await evaluer(`(() => { const y = ${expr}; if (window.lenis) window.lenis.scrollTo(y, { immediate: true }); window.scrollTo(0, y); })()`); await attendre(900); };

for (const [nom, largeur, hauteur, tactile] of [['bureau', 1440, 900, false], ['telephone', 390, 844, true]]) {
  await envoyer('Emulation.setDeviceMetricsOverride', { width: largeur, height: hauteur, deviceScaleFactor: 1, mobile: tactile });
  await envoyer('Emulation.setTouchEmulationEnabled', { enabled: tactile });
  await envoyer('Page.navigate', { url: pathToFileURL(join(RACINE, 'site', 'index.html')).href });
  await attendre(5200);
  /* 1. la bande de recherche, onglet STAY */
  await defiler(`document.querySelector('.recherche-bande').getBoundingClientRect().top + scrollY - ${tactile ? 120 : 260}`);
  await capturer(`${nom}-1-recherche-stay`);
  /* 2. onglet CONCIERGERIE dans la recherche */
  await evaluer(`document.querySelector('[data-onglet="conciergerie"]').click()`); await attendre(400);
  await capturer(`${nom}-2-recherche-conciergerie`);
  await evaluer(`document.querySelector('[data-onglet="stay"]').click()`);
  /* 3. la section STAY et une carte */
  await defiler(`document.querySelector('#stay').getBoundingClientRect().top + scrollY - 70`);
  await capturer(`${nom}-3-stay`);
  /* 4. le panneau ouvert depuis la première carte */
  await evaluer(`document.querySelector('.annonce [data-demande="stay"][data-objet]').click()`); await attendre(900);
  await capturer(`${nom}-4-panneau-stay`);
  await evaluer(`(() => { const f = document.getElementById('formulaire'); f.arrivee.value = '2026-12-20'; f.depart.value = '2026-12-27'; f.voyageurs.value = '2'; f.nom.value = 'Awa Ndong'; f.contact.value = '+241 77 00 00 00'; })()`);
  await attendre(200); await capturer(`${nom}-4b-panneau-stay-rempli`);
  /* 5. l'écran final (window.open est neutralisé) */
  await evaluer(`window.open = () => null; document.getElementById('formulaire').requestSubmit()`); await attendre(900);
  await capturer(`${nom}-5-panneau-fin`);
  await evaluer(`window.kazaDemande.fermer()`); await attendre(600);
  /* 6. l'écran « Que souhaitez-vous ? » depuis l'en-tête */
  await defiler('0'); await attendre(300);
  await evaluer(`document.querySelector('.entete-actions [data-demande]').click()`); await attendre(900);
  await capturer(`${nom}-6-panneau-choix`);
  /* 7. variante IMMO depuis le choix (bouton retour visible) */
  await evaluer(`document.querySelector('.demande-choix [data-demande="immo"]').click()`); await attendre(700);
  await capturer(`${nom}-7-panneau-immo`);
  await evaluer(`window.kazaDemande.fermer()`); await attendre(600);
  /* 8. comment ça marche */
  await defiler(`document.querySelector('#comment').getBoundingClientRect().top + scrollY - 40`);
  await capturer(`${nom}-8-comment`);
  /* 9. conciergerie */
  await defiler(`document.querySelector('#conciergerie').getBoundingClientRect().top + scrollY - 40`);
  await capturer(`${nom}-9-conciergerie`);
  /* 10. diaspora + partenaires */
  await defiler(`document.querySelector('#diaspora').getBoundingClientRect().top + scrollY - 40`);
  await capturer(`${nom}-10-diaspora`);
  await defiler(`document.querySelector('#partenaires').getBoundingClientRect().top + scrollY - 40`);
  await capturer(`${nom}-11-partenaires`);
  /* 12. diaspora panel on phone (long form) scrolled to bottom to check sticky submit */
  await evaluer(`window.kazaDemande.ouvrir('diaspora')`); await attendre(800);
  await evaluer(`document.querySelector('.demande-corps').scrollTop = 9999`); await attendre(300);
  await capturer(`${nom}-12-panneau-diaspora-bas`);
  await evaluer(`window.kazaDemande.fermer()`); await attendre(600);
  if (tactile) {
    /* menu mobile */
    await defiler('0'); await evaluer(`document.querySelector('.menu-bouton').click()`); await attendre(500);
    await capturer(`${nom}-13-menu`);
  }
}
console.log(journal.length ? 'console :\n' + journal.join('\n') : 'console propre');
try { ws.close(); } catch { /* fermé */ }
chrome.kill();
