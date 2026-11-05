/* KAZA GABON – ÉCO TOURISME — bibliothèque du générateur de charte : couleurs, logo reconstruit en vectoriel,
   symbole, déclinaisons par pôle, système graphique, planches, signature MÉTHODE AURA. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const FORET = '#00291B';   // vert forêt : fonds, navigation, grands aplats, identité principale
export const CITRON = '#C7F974';  // vert citron : boutons d'action, liens, icônes, indicateurs actifs, mots mis en évidence
export const BLANC = '#F7F8F4';   // blanc cassé : textes sur fond sombre, surfaces claires
export const GRIS = '#9AAFA4';    // vert gris : textes secondaires, bordures, séparateurs, états discrets
export const RELIEF = '#143A2B';  // nuance dérivée : vert forêt + 10 % de vert citron, réservée aux fonds (reliefs, cartes sur fond sombre)

export const echapper = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let compteurId = 0;
const id = (p) => `${p}-${(compteurId += 1).toString(36)}`;
const TITRAGE = 'Outfit, Arial, sans-serif';

/* ---------- lettres KAZA : géométrie reconstruite d'après le logo fourni (hauteur de capitale 100, fût 22) ----------
   K : fût et deux bras ; A : triangle sans barre, dont le contre reçoit un triangle vert citron (le « toit ») ; Z : deux barres et une diagonale. */
const K = (x, c) => `<path d="M${x} 0h22v100h-22z" fill="${c}"/><polygon points="${x + 22},60 ${x + 62},0 ${x + 90},0 ${x + 50},60" fill="${c}"/><polygon points="${x + 22},44 ${x + 50},44 ${x + 92},100 ${x + 64},100" fill="${c}"/>`;
const A = (x, c, a) => `<path d="M${x} 100L${x + 50} 0L${x + 100} 100ZM${x + 26} 100L${x + 50} 52L${x + 74} 100Z" fill="${c}" fill-rule="evenodd"/><polygon points="${x + 31},100 ${x + 50},62 ${x + 69},100" fill="${a}"/>`;
const Z = (x, c) => `<path d="M${x} 0h84v22h-84zM${x} 78h84v22h-84z" fill="${c}"/><polygon points="${x + 54},22 ${x + 84},22 ${x + 30},78 ${x},78" fill="${c}"/>`;
export const LARGEUR_MOT = 430;   // K 92 + 18 + A 100 + 18 + Z 84 + 18 + A 100
export function motKaza(c, a) { return K(0, c) + A(110, c, a) + Z(228, c) + A(330, c, a); }

/* avion : silhouette simple (icône « flight » redessinée), pointée vers le haut, puis orientée en montée */
const AVION = 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';
export function avion({ couleur = BLANC, x = 0, y = 0, taille = 60, angle = 62 } = {}) {
  const e = taille / 24;
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${e}) translate(-12 -12)"><path d="${AVION}" fill="${couleur}"/></g>`;
}
/* trajectoire : l'arc vert citron qui part du Z et monte vers l'avion */
export function arc({ couleur = CITRON, epaisseur = 3.6 } = {}) {
  return `<path d="M300 -8 C 340 -40, 372 -58, 392 -66" fill="none" stroke="${couleur}" stroke-width="${epaisseur}" stroke-linecap="round"/>`;
}

/* ---------- logo principal : KAZA + trajectoire + avion + GABON (ou un nom de pôle) ---------- */
export function logo({ couleur = BLANC, accent = CITRON, sousTitre = 'GABON', sousCouleur = null, taille = 100, avionCouleur = null, interne = false } = {}) {
  const sc = sousCouleur || couleur, ac = avionCouleur || couleur;
  const long = sousTitre.length > 6;
  const sous = sousTitre ? `<text x="${LARGEUR_MOT / 2}" y="${long ? 146 : 150}" text-anchor="middle" font-family="${TITRAGE}" font-weight="500" font-size="${long ? 24 : 30}" letter-spacing="${long ? 7 : 14}" fill="${sc}">${echapper(sousTitre)}</text>` : '';
  const contenu = `${motKaza(couleur, accent)}${arc({ couleur: accent })}${avion({ couleur: ac, x: 412, y: -78, taille: 58 })}${sous}`;
  if (interne) return { contenu, largeur: LARGEUR_MOT, haut: -108, bas: sousTitre ? 160 : 100 };
  const w = taille * (LARGEUR_MOT + 40) / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -112 ${LARGEUR_MOT + 40} ${sousTitre ? 282 : 222}" role="img" aria-label="KAZA ${echapper(sousTitre)}" class="logo" style="width:${w}px">${contenu}</svg>`;
}

/* schéma de construction : limites du mot, zone de protection égale à la hauteur du toit (t = 38 = hauteur du triangle vert citron) */
export function construction({ couleur = FORET, accent = CITRON, repere = GRIS } = {}) {
  const m = logo({ couleur, accent, interne: true });
  const x = 38, l = LARGEUR_MOT, h0 = -108, h1 = 160;
  const g = (a, b, c, d, coul = repere, tiret = '6 6') => `<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="none" stroke="${coul}" stroke-width="1.5" stroke-dasharray="${tiret}"/>`;
  const cote = (cx, cy, t) => `<text x="${cx}" y="${cy}" text-anchor="middle" font-family="${TITRAGE}" font-size="15" fill="${accent === CITRON && couleur === FORET ? '#4C6B5E' : accent}">${t}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-x - 50} ${h0 - x - 40} ${l + 2 * x + 100} ${h1 - h0 + 2 * x + 90}" role="img" aria-label="Construction du logo" class="logo logo-construction">
    ${g(-x, h0 - x, l + 2 * x, h1 - h0 + 2 * x, repere, '8 6')}${g(0, h0, l, h1 - h0, repere, '3 5')}
    <line x1="0" y1="0" x2="${l}" y2="0" stroke="${repere}" stroke-width="1" stroke-dasharray="3 5"/><line x1="0" y1="100" x2="${l}" y2="100" stroke="${repere}" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="${-x}" y1="${h0 - x / 2}" x2="0" y2="${h0 - x / 2}" stroke="${repere}" stroke-width="1.5"/>${cote(-x / 2, h0 - x / 2 - 8, 't')}
    <line x1="${l}" y1="${h0 - x / 2}" x2="${l + x}" y2="${h0 - x / 2}" stroke="${repere}" stroke-width="1.5"/>${cote(l + x / 2, h0 - x / 2 - 8, 't')}
    <line x1="${l + x / 2}" y1="${h0}" x2="${l + x / 2}" y2="${h1}" stroke="${repere}" stroke-width="1.5"/>${cote(l + x / 2 + 16, (h0 + h1) / 2 + 5, 't')}
    <line x1="${-x / 2}" y1="${h1}" x2="${-x / 2}" y2="${h1 + x}" stroke="${repere}" stroke-width="1.5"/>${cote(-x / 2 - 16, h1 + x / 2 + 5, 't')}
    <line x1="${l + 10}" y1="62" x2="${l + 10}" y2="100" stroke="${accent}" stroke-width="2"/>${cote(l + 26, 86, 't')}
    ${m.contenu}
    ${cote(l / 2, h1 + x + 34, 'zone de protection = t = hauteur du toit vert citron (38 % de la hauteur de capitale)')}
  </svg>`;
}

/* symbole : le A au toit vert citron, seul ; sur une tuile arrondie pour les icônes d'application et les avatars */
export function symbole({ fond = FORET, lettre = BLANC, accent = CITRON, taille = 100, tuile = true, rayon = 22 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Symbole KAZA" class="symbole" style="width:${taille}px;height:${taille}px">
    ${tuile ? `<rect width="100" height="100" rx="${rayon}" fill="${fond}"/>` : ''}
    <g transform="translate(19 19) scale(0.62)">${A(0, lettre, accent)}</g>
  </svg>`;
}

/* ---------- système graphique ---------- */
/* trajectoire seule : un grand arc et son avion, pour les couvertures, les cartes et les fonds */
export function trajectoire({ couleur = CITRON, avionCouleur = BLANC, largeur = 800, hauteur = 300, epaisseur = 4, avec_avion = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largeur} ${hauteur}" class="trajectoire" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <path d="M0 ${hauteur * 0.92} C ${largeur * 0.3} ${hauteur * 0.9}, ${largeur * 0.62} ${hauteur * 0.55}, ${largeur * 0.86} ${hauteur * 0.2}" fill="none" stroke="${couleur}" stroke-width="${epaisseur}" stroke-linecap="round" stroke-dasharray="0.1 ${epaisseur * 2.6}" opacity=".9"/>
    <path d="M0 ${hauteur * 0.92} C ${largeur * 0.3} ${hauteur * 0.9}, ${largeur * 0.62} ${hauteur * 0.55}, ${largeur * 0.86} ${hauteur * 0.2}" fill="none" stroke="${couleur}" stroke-width="${epaisseur}" stroke-linecap="round" stroke-dasharray="${largeur * 0.55} ${largeur}"/>
    ${avec_avion ? avion({ couleur: avionCouleur, x: largeur * 0.9, y: hauteur * 0.16, taille: hauteur * 0.26, angle: 58 }) : ''}
  </svg>`;
}

/* toits : une rangée de triangles vert citron, rythme du A ; motif de bordure ou de fond, jamais sous du texte */
export function toits({ couleur = CITRON, n = 12, largeur = 600, hauteur = 60, plein = true, graine = 3 } = {}) {
  let g = graine; const alea = () => { g = (g * 9301 + 49297) % 233280; return g / 233280; };
  const pas = largeur / n; let out = '';
  for (let i = 0; i < n; i++) {
    const x = i * pas, h = hauteur * (0.55 + alea() * 0.45);
    out += plein && alea() > 0.3
      ? `<polygon points="${x + pas * 0.08},${hauteur} ${x + pas / 2},${hauteur - h} ${x + pas * 0.92},${hauteur}" fill="${couleur}"/>`
      : `<polyline points="${x + pas * 0.08},${hauteur} ${x + pas / 2},${hauteur - h} ${x + pas * 0.92},${hauteur}" fill="none" stroke="${couleur}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largeur} ${hauteur}" class="toits" aria-hidden="true" preserveAspectRatio="none">${out}</svg>`;
}

/* reliefs : deux lignes de collines boisées, en nuance de relief et en vert gris léger ; fond des grands aplats */
export function reliefs({ largeur = 1600, hauteur = 400, avant = RELIEF, arriere = GRIS, opaciteArriere = .18 } = {}) {
  const ligne = (y, amp, graine) => { let g = graine; const alea = () => { g = (g * 9301 + 49297) % 233280; return g / 233280; }; let d = `M0 ${hauteur} L0 ${y}`; const n = 9; for (let i = 1; i <= n; i++) { const x = (i / n) * largeur, yy = y - amp * (0.3 + alea() * 0.7); const cx = x - largeur / n / 2; d += ` S ${cx} ${yy}, ${x} ${y + (alea() - .5) * amp * .6}`; } return d + ` L${largeur} ${hauteur} Z`; };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largeur} ${hauteur}" class="reliefs" aria-hidden="true" preserveAspectRatio="none"><path d="${ligne(hauteur * 0.55, hauteur * 0.5, 5)}" fill="${arriere}" opacity="${opaciteArriere}"/><path d="${ligne(hauteur * 0.75, hauteur * 0.45, 11)}" fill="${avant}"/></svg>`;
}

/* badge « KAZA Vérifié » : pastille arrondie vert citron, coche et texte */
export function badgeVerifie({ taille = 'normal' } = {}) {
  return `<span class="badge-verifie badge-verifie--${taille}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="${FORET}"/><path d="M5.5 10.5l3 3 6-6" fill="none" stroke="${CITRON}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>KAZA Vérifié</span>`;
}

/* icônes linéaires des cinq pôles (trait 2, coins ronds) */
export const ICONES = {
  immo: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  stay: '<path d="M3 18V8a2 2 0 012-2h14a2 2 0 012 2v10"/><path d="M3 14h18"/><path d="M7 10h4v4H7z"/><path d="M3 18v2M21 18v2"/>',
  tourisme: '<circle cx="12" cy="12" r="9"/><path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18M3 12h18"/>',
  conciergerie: '<path d="M12 4v2"/><path d="M4 17a8 8 0 0116 0z"/><path d="M2 20h20"/>',
  diaspora: '<path d="M3 13c3-1 5-4 8-4s5 3 10 2"/><path d="M4 7l3 1 4-3 1 4 5 1-2 3"/><circle cx="12" cy="12" r="9"/>',
};
export function icone(nom, { couleur = 'currentColor', taille = 28 } = {}) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:${taille}px;height:${taille}px">${ICONES[nom]}</svg>`;
}
export const POLES = [
  { cle: 'immo', nom: 'IMMO & VÉRIFIÉ', titre: 'Immobilier et confiance', texte: 'Vente et location de maisons, appartements, studios et terrains ; annonces vérifiées, badge KAZA Vérifié, mise en relation avec propriétaires et agences.' },
  { cle: 'stay', nom: 'STAY', titre: 'Hébergement de courte durée', texte: 'Appartements meublés, studios, villas, maisons de vacances et résidences partenaires ; calendrier, réservation, avis, espace propriétaire.' },
  { cle: 'tourisme', nom: 'TOURISME', titre: 'Expériences et écotourisme', texte: 'Excursions, circuits, visites guidées, parcs nationaux, forêts, plages et lagunes ; guides, agences et opérateurs partenaires.' },
  { cle: 'conciergerie', nom: 'CONCIERGERIE', titre: 'Services du quotidien', texte: 'Ménage, chauffeur et transferts, blanchisserie, courses, entretien et petits travaux, à la demande ou en récurrence.' },
  { cle: 'diaspora', nom: 'DIASPORA', titre: 'Préparer son retour, son séjour, son installation', texte: 'Un parcours intégré pour les Gabonais de l’étranger : préparation du séjour, hébergement, mobilité, expériences, suivi centralisé.' },
];

/* ---------- photos (téléchargées par tools/photos.mjs, crédits obligatoires) ---------- */
const ICI = dirname(fileURLToPath(import.meta.url));
let CREDITS = [];
try { CREDITS = JSON.parse(readFileSync(join(ICI, '..', 'charte', 'assets', 'photos', 'credits.json'), 'utf8')); } catch { CREDITS = []; }
export function photo(slug, { classe = '', position = 'center' } = {}) {
  const c = CREDITS.find((p) => p.slug === slug);
  const alt = c ? c.legende : slug;
  return `<img class="photo ${classe}" src="assets/photos/${slug}.jpg" alt="${echapper(alt)}" style="object-position:${position}">`;
}
export function credit(...slugs) {
  const parts = slugs.map((s) => { const c = CREDITS.find((p) => p.slug === s); return c ? `${c.legende} : ${c.auteur}, ${c.licence}` : s; });
  return `<p class="credit-photo">Photos (Wikimedia Commons) — ${parts.join(' · ')}.</p>`;
}
export const credits = () => CREDITS;

/* ---------- planche ---------- */
export function planche({ section, titre, sur = '', corps, classe = '', sombre = false, sansTitre = false }) {
  return `<section class="planche ${sombre ? 'planche--foret' : ''} ${classe}" data-section="${echapper(section)}">
  <header class="planche-tete"><span class="planche-section">${echapper(section)}</span><span class="planche-marque">KAZA GABON · Charte graphique</span><span class="planche-num" data-num></span></header>
  ${sansTitre ? '' : `<div class="planche-titre">${sur ? `<p class="planche-sur">${sur}</p>` : ''}<h2>${titre}</h2></div>`}
  <div class="planche-corps">${corps}</div>
</section>`;
}

/* ---------- MÉTHODE AURA : lockup horizontal (marque tracée + MÉTHODE en Sora 300, AURA en Sora 800) ---------- */
const MARQUE_AURA = `<path d="M2964 4857 c-56 -95 -147 -251 -204 -347 -56 -96 -134 -229 -173 -295 -39 -66 -104 -176 -145 -245 -345 -572 -428 -709 -487 -805 -70 -113 -372 -612 -800 -1320 -132 -220 -346 -573 -474 -785 -180 -297 -536 -888 -568 -942 -2 -5 238 -8 534 -7 l538 0 67 102 c293 449 599 924 935 1452 128 201 678 1085 868 1395 76 124 190 308 253 410 64 102 127 205 142 230 15 25 68 112 119 193 80 131 89 151 79 170 -6 12 -56 96 -111 187 -55 91 -121 201 -147 245 -26 44 -91 152 -145 240 -54 88 -115 188 -136 223 -20 35 -39 65 -41 67 -2 2 -49 -73 -104 -168z"/><path d="M5206 4913 c-38 -60 -86 -135 -106 -168 -20 -33 -89 -143 -152 -245 -63 -102 -149 -241 -191 -310 -45 -72 -75 -131 -72 -139 3 -8 95 -164 204 -346 180 -301 334 -560 721 -1210 75 -126 170 -286 210 -355 40 -69 116 -199 170 -290 53 -91 134 -230 180 -310 46 -80 111 -192 145 -250 34 -58 80 -136 102 -175 118 -208 475 -814 531 -902 l64 -103 569 0 c313 0 569 4 569 8 0 10 -107 198 -225 397 -46 77 -154 262 -241 410 -86 149 -193 331 -237 405 -141 240 -211 359 -412 705 -109 187 -219 376 -245 420 -244 418 -508 869 -675 1155 -111 190 -245 419 -297 510 -325 564 -525 900 -537 900 -4 0 -38 -48 -75 -107z"/><path d="M4099 2337 c-36 -56 -100 -154 -141 -217 -41 -63 -121 -187 -178 -275 -56 -88 -123 -190 -147 -228 -74 -115 -76 -94 22 -268 48 -85 109 -190 135 -234 26 -44 82 -143 125 -220 109 -194 245 -436 334 -592 42 -72 84 -145 93 -162 l17 -31 576 0 c316 0 575 3 575 6 0 8 -114 218 -185 339 -29 50 -78 135 -110 190 -160 277 -465 803 -525 905 -37 63 -109 187 -160 275 -52 88 -139 237 -195 330 -56 94 -116 196 -134 228 -18 31 -33 57 -34 57 -1 0 -32 -46 -68 -103z"/>`;
export function logoAura({ couleur = '#0B0B0D' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 300" role="img" aria-label="MÉTHODE AURA" class="logo-aura">
    <g transform="translate(0 0) scale(0.6104)"><g transform="translate(-11.314923,502.531334) scale(0.1,-0.1)" fill="${couleur}">${MARQUE_AURA}</g></g>
    <text x="560" y="98" font-family="Sora, Arial, sans-serif" font-weight="300" font-size="72" letter-spacing="14" fill="${couleur}">MÉTHODE</text>
    <text x="552" y="280" font-family="Sora, Arial, sans-serif" font-weight="800" font-size="196" letter-spacing="-2" fill="${couleur}">AURA</text>
  </svg>`;
}

export const cmyk = (hex) => {
  const v = parseInt(hex.slice(1), 16), r = ((v >> 16) & 255) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255;
  const k = 1 - Math.max(r, g, b); if (k === 1) return 'C0 M0 J0 N100';
  return `C${Math.round(((1 - r - k) / (1 - k)) * 100)} M${Math.round(((1 - g - k) / (1 - k)) * 100)} J${Math.round(((1 - b - k) / (1 - k)) * 100)} N${Math.round(k * 100)}`;
};
export const rgb = (hex) => { const v = parseInt(hex.slice(1), 16); return `${(v >> 16) & 255} / ${(v >> 8) & 255} / ${v & 255}`; };
const lum = (hex) => { const v = parseInt(hex.slice(1), 16); const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f((v >> 16) & 255) + 0.7152 * f((v >> 8) & 255) + 0.0722 * f(v & 255); };
export const contraste = (a, b) => { const l1 = lum(a), l2 = lum(b); const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); return Math.round(r * 10) / 10; };
