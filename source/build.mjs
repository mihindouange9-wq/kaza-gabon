/* KAZA GABON — génère charte/index.html, charte/assets/style.css et les logos SVG autonomes.
   Lancer : node source/build.mjs   (depuis le dossier kaza) */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logo, symbole, POLES, FORET, CITRON, BLANC } from './lib.mjs';
import a from './sections/a-marque-logo.mjs';
import b from './sections/b-couleurs-typo-systeme-photo.mjs';
import c from './sections/c-digital-applications-fin.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const CHARTE = join(RACINE, 'charte');
await mkdir(join(CHARTE, 'assets'), { recursive: true });
await mkdir(join(RACINE, 'logos'), { recursive: true });

/* ---------- feuille de style ---------- */
const fonts = await readFile(join(ICI, 'fonts.css'), 'utf8');
const style = await readFile(join(ICI, 'style.css'), 'utf8');
await writeFile(join(CHARTE, 'assets', 'style.css'), fonts + '\n' + style);

/* ---------- planches ---------- */
const planches = [...a(), ...b(), ...c()];
const sections = [...new Set(planches.map((p) => /data-section="([^"]+)"/.exec(p)[1]))].filter((s) => /^\d\d/.test(s));
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KAZA GABON — Charte graphique</title>
<meta name="description" content="Charte graphique de KAZA GABON – ÉCO TOURISME, plateforme de logement, d’hébergement, de tourisme, de conciergerie et d’accompagnement de la diaspora : logo, couleurs, typographie, système graphique, photographie, applications.">
<link rel="stylesheet" href="assets/style.css">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
</head>
<body>
<div class="barre-lecteur">
  <strong>KAZA GABON · Charte graphique</strong>
  <nav aria-label="Chapitres">${sections.map((s, i) => `<a href="#s-${i + 1}">${s.replace(/ — /, ' ')}</a>`).join('')}</nav>
  <a class="telecharger" href="KAZA-charte.pdf" download>PDF</a>
</div>
<main class="lecteur">
${planches.map((p, i) => { const s = /data-section="([^"]+)"/.exec(p)[1]; const k = sections.indexOf(s); const ancre = k >= 0 && planches.findIndex((q) => /data-section="([^"]+)"/.exec(q)[1] === s) === i ? ` id="s-${k + 1}"` : ''; return `<div class="planche-cadre"${ancre}>${p.replace('data-num></span>', `data-num>${String(i + 1).padStart(2, '0')} / ${planches.length}</span>`)}</div><div class="planche-espace" aria-hidden="true"></div>`; }).join('\n')}
</main>
<script>
(function () {
  /* met les planches (1600 × 1000) à l'échelle de la fenêtre et réserve leur hauteur réelle */
  var cadres = document.querySelectorAll('.planche-cadre'), espaces = document.querySelectorAll('.planche-espace');
  function ajuster() {
    var e = Math.min(1, (window.innerWidth - 32) / 1600);
    document.documentElement.style.setProperty('--echelle', e);
    for (var i = 0; i < cadres.length; i++) { cadres[i].style.marginBottom = (-1000 * (1 - e)) + 'px'; }
  }
  ajuster(); window.addEventListener('resize', ajuster);
})();
</script>
</body>
</html>`;
await writeFile(join(CHARTE, 'index.html'), html);

/* ---------- favicon et logos autonomes (police Outfit embarquée pour GABON et les noms de pôles) ---------- */
const woff = (await readFile(join(CHARTE, 'assets', 'fonts', 'Outfit-latin.woff2'))).toString('base64');
const embarquer = (svg) => svg.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/(<svg[^>]*>)/, `$1<style>@font-face{font-family:"Outfit";src:url(data:font/woff2;base64,${woff}) format("woff2");font-weight:300 700}</style>`).replace(/ class="[^"]*"/, '').replace(/ style="width:[^"]*"/, '');
const logos = {
  'kaza-principal-blanc.svg': logo({ couleur: BLANC, accent: CITRON }),
  'kaza-principal-vert-foret.svg': logo({ couleur: FORET, accent: CITRON }),
  'kaza-mono-blanc.svg': logo({ couleur: BLANC, accent: BLANC }),
  'kaza-mono-vert-foret.svg': logo({ couleur: FORET, accent: FORET }),
  'kaza-mono-vert-citron.svg': logo({ couleur: CITRON, accent: CITRON }),
  'kaza-mot-seul-blanc.svg': logo({ couleur: BLANC, accent: CITRON, sousTitre: '' }),
  'kaza-mot-seul-vert-foret.svg': logo({ couleur: FORET, accent: CITRON, sousTitre: '' }),
  'kaza-symbole-tuile-vert-foret.svg': symbole({ fond: FORET, lettre: BLANC, accent: CITRON }),
  'kaza-symbole-tuile-vert-citron.svg': symbole({ fond: CITRON, lettre: FORET, accent: FORET }),
  'kaza-symbole-tuile-blanc.svg': symbole({ fond: BLANC, lettre: FORET, accent: CITRON }),
  'kaza-symbole-sans-tuile-blanc.svg': symbole({ lettre: BLANC, accent: CITRON, tuile: false }),
  'kaza-symbole-sans-tuile-vert-foret.svg': symbole({ lettre: FORET, accent: CITRON, tuile: false }),
};
for (const p of POLES) {
  logos[`kaza-pole-${p.cle}-blanc.svg`] = logo({ couleur: BLANC, accent: CITRON, sousTitre: p.nom, sousCouleur: CITRON });
  logos[`kaza-pole-${p.cle}-vert-foret.svg`] = logo({ couleur: FORET, accent: CITRON, sousTitre: p.nom, sousCouleur: FORET });
}
for (const [nom, svg] of Object.entries(logos)) await writeFile(join(RACINE, 'logos', nom), embarquer(svg) + '\n');
await writeFile(join(CHARTE, 'assets', 'favicon.svg'), embarquer(symbole({ fond: FORET, lettre: BLANC, accent: CITRON })) + '\n');
console.log(`généré : charte/index.html (${planches.length} planches), charte/assets/style.css, ${Object.keys(logos).length} logos SVG`);
