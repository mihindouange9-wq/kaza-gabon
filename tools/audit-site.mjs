/* Audit frontal complet de la vitrine KAZA dans Chrome sans interface, sur huit formats.
   Console et réseau, poids des ressources, images (alt, cassées, surdimensionnées), plan des titres, repères (landmarks),
   noms accessibles, identifiants en double, ordre de tabulation et piège de focus du panneau, chevauchements du héros,
   panneau en paysage, métadonnées, puis les six variantes de demande de bout en bout (message WhatsApp réellement composé).
   Lancer : node tools/audit-site.mjs  → tools/audit/rapport.md et captures dans tools/audit/ */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, access, stat, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as attendre } from 'node:timers/promises';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = join(RACINE, 'tools', 'audit'); await mkdir(SORTIE, { recursive: true });
const chromes = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'];
let CHROME = null; for (const c of chromes) { try { await access(c); CHROME = c; break; } catch { /* suivant */ } }
const port = 9700 + Math.floor(Math.random() * 60);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--disable-extensions', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/chrome-kzaudit-${port}`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let cible = null;
for (let i = 0; i < 60 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map(); let journal = []; const urls = new Map(); let reseau = [];
ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); return; }
  if (t.method === 'Runtime.exceptionThrown') journal.push('exception : ' + (t.params.exceptionDetails?.exception?.description || t.params.exceptionDetails?.text || '').split('\n')[0]);
  if (t.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(t.params.type)) journal.push(t.params.type + ' : ' + t.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200));
  if (t.method === 'Network.requestWillBeSent') urls.set(t.params.requestId, t.params.request.url);
  if (t.method === 'Network.loadingFinished') reseau.push({ url: urls.get(t.params.requestId) || '', octets: t.params.encodedDataLength });
  if (t.method === 'Network.loadingFailed') journal.push('chargement échoué : ' + t.params.errorText + ' ' + (urls.get(t.params.requestId) || '').split('/').pop()); };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (e) => { const r = await envoyer('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); return r.result?.exceptionDetails ? 'ERREUR ' + r.result.exceptionDetails.exception?.description : r.result?.result?.value; };
await envoyer('Page.enable'); await envoyer('Runtime.enable'); await envoyer('Network.enable');
const capturer = async (nom) => { const { data } = (await envoyer('Page.captureScreenshot', { format: 'png' })).result; await writeFile(join(SORTIE, nom + '.png'), Buffer.from(data, 'base64')); };
const touche = async (key, code, fois = 1) => { for (let i = 0; i < fois; i++) { await envoyer('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: key === 'Tab' ? 9 : key === 'Escape' ? 27 : 0 }); await envoyer('Input.dispatchKeyEvent', { type: 'keyUp', key, code }); } };
const rapport = []; const dire = (t) => { rapport.push(t); console.log(t); };
const url = pathToFileURL(join(RACINE, 'site', 'index.html')).href;

/* ---------- poids des fichiers servis ---------- */
async function poids(dossier, prefixe = '') { let total = 0; const lignes = []; for (const e of await readdir(dossier, { withFileTypes: true })) { const p = join(dossier, e.name); if (e.isDirectory()) { const r = await poids(p, prefixe + e.name + '/'); total += r.total; lignes.push(...r.lignes); } else { const s = (await stat(p)).size; total += s; lignes.push([prefixe + e.name, s]); } } return { total, lignes }; }
const p = await poids(join(RACINE, 'site'));
dire(`## Poids du dossier site/ : ${(p.total / 1024).toFixed(0)} Ko`);
for (const [f, s] of p.lignes.sort((a, b) => b[1] - a[1]).slice(0, 12)) dire(`- ${f} : ${(s / 1024).toFixed(0)} Ko`);

/* ---------- formats ---------- */
const FORMATS = [['pc-1920', 1920, 1080, false], ['pc-1440', 1440, 900, false], ['pc-1280', 1280, 720, false], ['pc-1024', 1024, 768, false], ['tablette-820', 820, 1180, true], ['tel-390', 390, 844, true], ['tel-360', 360, 740, true], ['tel-paysage-844', 844, 390, true]];
for (const [nom, largeur, hauteur, tactile] of FORMATS) {
  journal = []; reseau = [];
  await envoyer('Emulation.setDeviceMetricsOverride', { width: largeur, height: hauteur, deviceScaleFactor: 1, mobile: tactile });
  await envoyer('Emulation.setTouchEmulationEnabled', { enabled: tactile });
  await envoyer('Page.navigate', { url }); await attendre(5500);
  const pb = [];
  /* console, réseau */
  const octets = reseau.reduce((s, r) => s + (r.octets || 0), 0);
  /* structure */
  const s = await evaluer(`(() => {
    const out = {};
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); out.doublons = ids.filter((v, i) => ids.indexOf(v) !== i);
    out.titres = [...document.querySelectorAll('h1,h2,h3,h4')].filter((h) => !h.closest('[hidden]')).map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 40));
    out.h1 = document.querySelectorAll('h1').length;
    out.reperes = [...document.querySelectorAll('header,nav,main,footer,aside,[role]')].map((e) => e.tagName.toLowerCase() + (e.getAttribute('aria-label') ? '[' + e.getAttribute('aria-label') + ']' : '') + (e.getAttribute('role') ? '{' + e.getAttribute('role') + '}' : ''));
    out.sansNom = [...document.querySelectorAll('a,button')].filter((e) => !e.closest('[hidden]') && !(e.textContent.trim() || e.getAttribute('aria-label') || e.getAttribute('title'))).map((e) => e.outerHTML.slice(0, 80));
    out.liensVides = [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length;
    out.ancresCassees = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h));
    out.images = [...document.images].map((i) => ({ src: i.currentSrc.split('/').pop(), alt: i.hasAttribute('alt'), ok: !(i.complete && i.naturalWidth === 0), nat: i.naturalWidth, aff: Math.round(i.getBoundingClientRect().width * devicePixelRatio), lazy: i.loading }));
    out.champsSansLibelle = [...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter((c) => !c.closest('[hidden]') && !(c.labels && c.labels.length) && !c.getAttribute('aria-label') && !c.getAttribute('aria-labelledby')).map((c) => c.name || c.type);
    out.svgSansAria = [...document.querySelectorAll('svg')].filter((s) => !s.closest('[hidden]') && !s.getAttribute('aria-hidden') && !s.getAttribute('role') && !s.getAttribute('aria-label')).length;
    out.meta = { titre: document.title.length, description: (document.querySelector('meta[name=description]')?.content || '').length, ogImage: !!document.querySelector('meta[property="og:image"]'), canonical: !!document.querySelector('link[rel=canonical]'), lang: document.documentElement.lang, viewport: document.querySelector('meta[name=viewport]')?.content };
    out.inlineScripts = document.querySelectorAll('script:not([src])').length;
    out.onclick = document.querySelectorAll('[onclick],[onload],[onsubmit]').length;
    out.tabindexPositif = document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').length;
    /* héros : la copie ne doit pas chevaucher la légende ni la bande de recherche */
    const copie = document.querySelector('.heros-copie').getBoundingClientRect(), pied = document.querySelector('.heros-pied').getBoundingClientRect(), bande = document.querySelector('.recherche-bande .recherche').getBoundingClientRect();
    out.heros = { copieBas: Math.round(copie.bottom), piedHaut: Math.round(pied.top), bandeHaut: Math.round(bande.top), chevauchePied: copie.bottom > pied.top + 2, chevaucheBande: copie.bottom > bande.top + 2 };
    /* textes coupés (ellipsis ou overflow hidden sur un élément de texte) */
    out.coupes = [...document.querySelectorAll('h1,h2,h3,p,li,span,b,small,button,a,label')].filter((e) => { if (e.closest('[hidden],svg,.visuellement-cache,.menu,.nuages-voile,.mot')) return false; const cs = getComputedStyle(e); return e.children.length === 0 && e.textContent.trim().length > 3 && cs.overflow !== 'visible' && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2); }).map((e) => (e.className || e.tagName) + ' « ' + e.textContent.trim().slice(0, 30) + ' »').slice(0, 6);
    return out; })()`);
  if (s.doublons.length) pb.push('identifiants en double : ' + s.doublons.join(', '));
  if (s.h1 !== 1) pb.push(`${s.h1} h1`);
  if (s.sansNom.length) pb.push('contrôles sans nom accessible : ' + s.sansNom.join(' | '));
  if (s.liensVides) pb.push(`${s.liensVides} lien(s) sans href`);
  if (s.ancresCassees.length) pb.push('ancres cassées : ' + s.ancresCassees.join(', '));
  const cassees = s.images.filter((i) => !i.ok), sansAlt = s.images.filter((i) => !i.alt), grosses = s.images.filter((i) => i.aff > 0 && i.nat > i.aff * 2.2);
  if (cassees.length) pb.push('images cassées : ' + cassees.map((i) => i.src).join(', '));
  if (sansAlt.length) pb.push(`${sansAlt.length} image(s) sans alt`);
  if (grosses.length) pb.push('images surdimensionnées (> 2,2× l’affichage) : ' + grosses.map((i) => `${i.src} ${i.nat}/${i.aff}`).join(', '));
  if (s.champsSansLibelle.length) pb.push('champs sans libellé : ' + s.champsSansLibelle.join(', '));
  if (s.svgSansAria) pb.push(`${s.svgSansAria} svg sans aria-hidden/role`);
  if (s.meta.titre > 65) pb.push(`titre de ${s.meta.titre} caractères (> 65)`);
  if (s.meta.description > 160) pb.push(`description de ${s.meta.description} caractères (> 160)`);
  if (!s.meta.ogImage) pb.push('pas d’og:image');
  if (!s.meta.canonical) pb.push('pas de canonical');
  if (s.inlineScripts) pb.push(`${s.inlineScripts} script(s) en ligne (CSP)`);
  if (s.onclick) pb.push('gestionnaires en ligne');
  if (s.tabindexPositif) pb.push('tabindex positif');
  if (s.heros.chevauchePied) pb.push(`héros : la copie (bas ${s.heros.copieBas}) chevauche la légende (haut ${s.heros.piedHaut})`);
  if (s.heros.chevaucheBande) pb.push(`héros : la copie (bas ${s.heros.copieBas}) chevauche la recherche (haut ${s.heros.bandeHaut})`);
  if (s.coupes.length) pb.push('textes coupés : ' + s.coupes.join(' | '));
  /* ordre de tabulation : dix premiers éléments focalisés */
  await evaluer('window.scrollTo(0,0); if (window.lenis) window.lenis.scrollTo(0, { immediate: true }); document.activeElement.blur();');
  const ordre = []; for (let i = 0; i < 9; i++) { await touche('Tab', 'Tab'); ordre.push(await evaluer(`(() => { const a = document.activeElement; return a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(' ')[0] : '') + ' ' + (a.getAttribute('aria-label') || a.textContent.trim().slice(0, 18)); })()`)); }
  const premier = ordre[0] || '';
  if (!/evitement/.test(premier)) pb.push('la première tabulation n’atteint pas le lien d’évitement : ' + premier);
  /* panneau : focus piégé, Échap ferme, bouton d'envoi visible, défilement interne */
  const panneau = await evaluer(`(() => { window.kazaDemande.ouvrir('diaspora'); return new Promise((ok) => setTimeout(() => { const p = document.getElementById('demande'); const c = p.querySelector('.demande-corps'); const b = p.querySelector('.demande-pied .bouton').getBoundingClientRect(); const tete = p.querySelector('.demande-tete').getBoundingClientRect(); ok({ ouvert: !p.hidden && p.classList.contains('est-ouvert'), boutonVisible: b.bottom <= innerHeight + 1 && b.top >= tete.bottom - 1, defile: c.scrollHeight > c.clientHeight, focusDedans: p.contains(document.activeElement), largeur: Math.round(p.getBoundingClientRect().width), debord: p.scrollWidth > p.clientWidth + 1 }); }, 700)); })()`);
  if (!panneau.ouvert) pb.push('panneau : ne s’ouvre pas');
  if (!panneau.boutonVisible) pb.push('panneau : bouton d’envoi hors écran à l’ouverture');
  if (!panneau.focusDedans) pb.push('panneau : le focus n’est pas dedans');
  if (panneau.debord) pb.push('panneau : débordement horizontal');
  await touche('Tab', 'Tab', 40);
  const piege = await evaluer(`document.getElementById('demande').contains(document.activeElement)`);
  if (!piege) pb.push('panneau : le focus s’échappe après 40 tabulations');
  await capturer(`${nom}-panneau-diaspora`);
  await touche('Escape', 'Escape'); await attendre(600);
  const ferme = await evaluer(`document.getElementById('demande').hidden && !document.body.classList.contains('demande-ouverte')`);
  if (!ferme) pb.push('panneau : Échap ne ferme pas');
  /* historique : ouverture puis retour navigateur */
  const histo = await evaluer(`(() => { window.kazaDemande.ouvrir('immo'); return new Promise((ok) => setTimeout(() => { history.back(); setTimeout(() => ok(document.getElementById('demande').hidden ? 'ok' : 'reste ouvert'), 600); }, 300)); })()`);
  if (histo !== 'ok') pb.push('panneau : le bouton retour du navigateur ne ferme pas (' + histo + ')');
  await attendre(400);
  /* captures de contrôle : haut, recherche, bas */
  await evaluer('window.scrollTo(0,0); if (window.lenis) window.lenis.scrollTo(0, { immediate: true });'); await attendre(400); await capturer(`${nom}-haut`);
  await evaluer(`(() => { const y = document.querySelector('.recherche-bande').getBoundingClientRect().top + scrollY - 40; if (window.lenis) window.lenis.scrollTo(y, { immediate: true }); window.scrollTo(0, y); })()`); await attendre(500); await capturer(`${nom}-recherche`);
  await evaluer(`(() => { const y = document.documentElement.scrollHeight; if (window.lenis) window.lenis.scrollTo(y, { immediate: true }); window.scrollTo(0, y); })()`); await attendre(500); await capturer(`${nom}-bas`);
  pb.push(...journal.filter((l) => !/favicon|ERR_ABORTED|manifest\.json/.test(l)));
  dire(`\n## ${nom} (${largeur}×${hauteur}) — ${(octets / 1024).toFixed(0)} Ko transférés, titres : ${s.titres.length}, premier focus : ${premier}`);
  if (nom === 'pc-1440') { dire('Plan des titres : ' + s.titres.join(' › ')); dire('Repères : ' + s.reperes.join(', ')); dire('Images : ' + s.images.map((i) => `${i.src} ${i.nat}px pour ${i.aff}px${i.lazy === 'lazy' ? ' (lazy)' : ''}`).join(' ; ')); }
  if (pb.length) pb.forEach((x) => dire('- ✗ ' + x)); else dire('- ✓ aucun problème');
}

/* ---------- fonctionnel : les six variantes composent un message WhatsApp complet ---------- */
await envoyer('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await envoyer('Page.navigate', { url }); await attendre(4500);
dire('\n## Variantes de demande (message WhatsApp composé)');
const CAS = [
  ['stay', { objet: 'loango-lodge' }, { arrivee: '2026-12-20', depart: '2026-12-27', voyageurs: '2', nom: 'Awa Ndong', contact: '+241 77 00 00 00', message: 'Arrivée tardive' }, ['Réservation KAZA STAY', 'Lodge sur la lagune', '20/12/2026', '27/12/2026', 'Awa Ndong', 'Arrivée tardive']],
  ['tourisme', { objet: 'mangrove-nyonie' }, { date: '2026-12-22', participants: '3', nom: 'Awa Ndong', contact: '+33 6 12 34 56 78' }, ['Réservation KAZA TOURISME', 'La mangrove de Nyonié', '22/12/2026', 'Participants : 3']],
  ['immo', {}, { transaction: 'Acheter', typeBien: 'Terrain', ville: 'Akanda', budget: '30 millions FCFA', nom: 'Awa Ndong', contact: '+241 77 00 00 00' }, ['Recherche KAZA IMMO', 'Je veux : Acheter', 'Terrain', 'Akanda', '30 millions']],
  ['conciergerie', {}, { service: 'Ménage et nettoyage', quartier: 'Louis', dateService: '2026-12-21', frequence: 'Chaque semaine', nom: 'Awa Ndong', contact: '+241 77 00 00 00' }, ['Service KAZA CONCIERGERIE', 'Ménage et nettoyage', 'Louis', '21/12/2026', 'Chaque semaine']],
  ['diaspora', {}, { pays: 'France', arrivee: '2026-12-18', voyageurs: '4', besoins: ['Hébergement', 'Excursions'], budget: '3 000 €', nom: 'Awa Ndong', contact: 'awa@exemple.com' }, ['Demande KAZA DIASPORA', 'France', '18/12/2026', 'Hébergement, Excursions', '3 000', 'awa@exemple.com']],
  ['partenaire', {}, { profil: 'Guide, agence ou opérateur touristique', structure: 'Nyonié Tours', zone: 'Estuaire', nom: 'Awa Ndong', contact: '+241 77 00 00 00', message: 'Excursions en bateau' }, ['Demande de partenariat KAZA', 'Guide, agence', 'Nyonié Tours', 'Estuaire', 'Excursions en bateau']],
];
for (const [mode, o, valeurs, attendus] of CAS) {
  const r = await evaluer(`(() => { let url = ''; window.open = (u) => { url = u; return { focus() {} }; }; window.kazaDemande.ouvrir(${JSON.stringify(mode)}, ${JSON.stringify(o)}); const f = document.getElementById('formulaire'); const v = ${JSON.stringify(valeurs)}; for (const k in v) { if (k === 'besoins') { v[k].forEach((b) => { f.querySelector('input[name=besoins][value="' + b + '"]').checked = true; }); continue; } const c = f.elements[k]; if (c instanceof RadioNodeList) c.value = v[k]; else c.value = v[k]; } f.requestSubmit(); const inv = f.querySelectorAll('[aria-invalid=true]').length; const fin = !document.querySelector('[data-etape=fin]').hidden; const texte = decodeURIComponent((url.split('text=')[1] || '')); window.kazaDemande.fermer(); return { inv, fin, texte, url: url.split('?')[0] }; })()`);
  await attendre(500);
  const manquants = attendus.filter((a) => !r.texte.includes(a));
  if (r.inv || !r.fin || manquants.length || !/wa\.me\/24177985553/.test(r.url)) dire(`- ✗ ${mode} : ${r.inv} champ(s) invalide(s), écran final ${r.fin}, manquants : ${manquants.join(' / ') || 'aucun'}, url ${r.url}`);
  else dire(`- ✓ ${mode} : message complet (${r.texte.split('\n').length} lignes) vers ${r.url}`);
}
/* champs cachés jamais exigés : un formulaire vide en mode conciergerie ne doit signaler que ses champs */
const vide = await evaluer(`(() => { window.kazaDemande.ouvrir('conciergerie'); const f = document.getElementById('formulaire'); f.requestSubmit(); const inv = [...f.querySelectorAll('[aria-invalid=true]')].map((c) => c.name); window.kazaDemande.fermer(); return inv; })()`);
dire((JSON.stringify(vide) === JSON.stringify(['service', 'quartier', 'nom', 'contact']) ? '- ✓ ' : '- ✗ ') + 'conciergerie vide : champs exigés ' + vide.join(', '));
/* recherche : destination inconnue → zéro résultat et proposition ; tourisme filtré ; onglet diaspora préremplit */
const rech = await evaluer(`(() => { const f = document.getElementById('recherche'); f.destination.value = 'Franceville'; f.requestSubmit(); const r = document.getElementById('resultat'); const zero = [...document.querySelectorAll('.annonce')].every((a) => a.hidden) && /Aucun logement/.test(r.textContent) && r.querySelector('[data-demande=stay]'); f.destination.value = ''; f.requestSubmit(); const tous = [...document.querySelectorAll('.annonce')].every((a) => !a.hidden); document.querySelector('[data-onglet=tourisme]').click(); f.destination.value = 'Loango'; f.requestSubmit(); const exp = [...document.querySelectorAll('.experience')].filter((e) => !e.hidden).length; f.destination.value = ''; f.requestSubmit(); document.querySelector('[data-onglet=diaspora]').click(); f.pays.value = 'Canada'; f.arriveeDiaspora.value = '2026-12-01'; f.voyageursDiaspora.value = '3'; f.requestSubmit(); const p = document.getElementById('formulaire'); const ok = p.getAttribute('data-mode') === 'diaspora' && p.pays.value === 'Canada' && p.arrivee.value === '2026-12-01' && p.voyageurs.value === '3'; window.kazaDemande.fermer(); document.querySelector('[data-onglet=stay]').click(); return { zero: !!zero, tous, exp, ok }; })()`);
dire((rech.zero && rech.tous && rech.exp === 1 && rech.ok ? '- ✓ ' : '- ✗ ') + `recherche : zéro résultat ${rech.zero}, retour à tous ${rech.tous}, Loango → ${rech.exp} expérience, onglet diaspora → panneau prérempli ${rech.ok}`);

await writeFile(join(SORTIE, 'rapport.md'), '# Audit frontal KAZA — ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + '\n\n' + rapport.join('\n') + '\n');
console.log('\nrapport : tools/audit/rapport.md');
try { ws.close(); } catch { /* fermé */ }
chrome.kill();
