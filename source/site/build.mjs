/* KAZA GABON — génère site/index.html, site/assets/site.css, site/assets/app.js et site/assets/config.js à partir de la charte (lib.mjs) et de donnees.mjs.
   Lancer : node source/site/build.mjs   (depuis le dossier kaza)
   Parcours (6 nov. 2026) : une question à l'entrée (cinq onglets de recherche), un panneau de demande unique, chaque bouton mène à une seule action. */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logo, symbole, trajectoire, toits, reliefs, icone, logoAura, echapper, credits, FORET, CITRON, BLANC, GRIS, RELIEF } from '../lib.mjs';
import { CONTACT, DESTINATIONS, POLES, HEBERGEMENTS, EXPERIENCES, SERVICES, TYPES_BIEN, FREQUENCES, BESOINS, PROFILS, VERIFICATION, PARCOURS, PARTENAIRES, COMMENT, MODES, CHOIX } from './donnees.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..', '..');
const SITE = join(RACINE, 'site');
await mkdir(join(SITE, 'assets'), { recursive: true });
const version = Date.now().toString(36);

/* ---------- icônes linéaires (trait 1,8, coins ronds), une seule famille ---------- */
const TRAITS = {
  recherche: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  calendrier: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  voyageurs: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 016 5"/>',
  coche: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  fleche: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  retour: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  fermer: '<path d="M6 6l12 12M18 6L6 18"/>',
  bouclier: '<path d="M12 3l7 3v5c0 5-3.2 8.3-7 10-3.8-1.7-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  recu: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  statut: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  paiement: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18M7 15h3"/>',
  whatsapp: '<path d="M12 2.5a9.5 9.5 0 00-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1012 2.5z"/><path d="M8.6 9.3c0 3.4 2.7 6.1 6.1 6.1l1.6-1.6-2.1-1.1-1 1a4.6 4.6 0 01-3-3l1-1-1.1-2.1z"/>',
  menage: '<path d="M14 3l-1 8"/><path d="M9 11h8l1 7a3 3 0 01-3 3H11a3 3 0 01-3-3z"/><path d="M8 15h10"/>',
  chauffeur: '<path d="M5 13l1.5-5h11L19 13"/><rect x="3" y="13" width="18" height="6" rx="2"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
  linge: '<path d="M12 4a2 2 0 100 .01"/><path d="M12 6v3"/><path d="M3 16l9-7 9 7"/><path d="M4 16h16v3H4z"/>',
  courses: '<path d="M3 5h2l2.2 10h10.6L20 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/>',
  outils: '<path d="M14.5 5.5a4 4 0 00-5 5L4 16l4 4 5.5-5.5a4 4 0 005-5l-2.5 2.5-2-2z"/>',
  rendezvous: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>',
};
const ic = (nom, taille = 22) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:${taille}px;height:${taille}px">${TRAITS[nom]}</svg>`;
const icPole = (cle, taille = 22) => icone(cle, { taille }).replace('<svg ', '<svg class="ico" ');
const coche = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="${FORET}"/><path d="M5.5 10.5l3 3 6-6" fill="none" stroke="${CITRON}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const badge = (grand = false) => `<span class="badge${grand ? ' badge--grand' : ''}">${coche}KAZA Vérifié</span>`;
const badgeAttente = `<span class="badge badge--attente">Vérification en cours</span>`;
const options = (liste, vide = '') => (vide ? `<option value="">${vide}</option>` : '') + liste.map((o) => `<option value="${echapper(o)}">${echapper(o)}</option>`).join('');

/* ---------- images : srcset depuis site/assets/img ---------- */
const CRED = credits();
const img = (slug, { alt, sizes = '(max-width: 640px) 100vw, 50vw', position, eager = false } = {}) => {
  const c = CRED.find((p) => p.slug === slug);
  return `<img src="assets/img/${slug}-960.webp" srcset="assets/img/${slug}-480.webp 480w, assets/img/${slug}-960.webp 960w, assets/img/${slug}-1600.webp 1600w" sizes="${sizes}" width="${c ? c.largeur : 1920}" height="${c ? c.hauteur : 1080}" alt="${echapper(alt ?? (c ? c.legende : slug))}"${position ? ` style="object-position:${position}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
};
/* photos fournies par KAZA (1.jpeg, 2.jpeg, 3.jpeg à la racine, converties par tools/images-client.mjs) */
const PHOTOS_CLIENT = {
  1: { l: 720, h: 1280, tailles: [480, 720], legende: 'La Concorde, Libreville, de nuit', alt: 'Le bâtiment La Concorde illuminé la nuit, à Libreville' },
  2: { l: 720, h: 1280, tailles: [480, 720], legende: 'Plage sous les cocotiers', alt: 'Allée de planches menant à la plage, sous les cocotiers' },
  3: { l: 1024, h: 1280, tailles: [480, 720, 1024], legende: 'L’arbre de bouteilles, Aux berges des 3 Rivières', alt: 'Arbre décoré de bouteilles de Regab devant le restaurant Aux berges des 3 Rivières' },
};
const imgClient = (n, { sizes = '(max-width: 960px) 100vw, 34vw', eager = false } = {}) => { const p = PHOTOS_CLIENT[n]; return `<img src="assets/img/kaza-${n}-${p.tailles[p.tailles.length - 1]}.webp" srcset="${p.tailles.map((t) => `assets/img/kaza-${n}-${t}.webp ${t}w`).join(', ')}" sizes="${sizes}" width="${p.l}" height="${p.h}" alt="${echapper(p.alt)}"${eager ? ' fetchpriority="high"' : ' decoding="async"'}>`; };
const appareil = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const logoBlanc = logo({ couleur: BLANC, accent: CITRON, taille: 100 }).replace(/ style="width:[^"]*"/, '');
const logoMot = logo({ couleur: BLANC, accent: CITRON, sousTitre: '', taille: 100 }).replace(/ style="width:[^"]*"/, '').replace('class="logo"', 'class="logo logo--mot"');
const sitesCredits = [...new Set(CRED.map((p) => `${p.legende} : ${p.auteur}, ${p.licence}`))].join(' · ');

/* ---------- gabarits ---------- */
const navLiens = POLES.map((p) => `<a href="#${p.ancre}">${p.nom}</a>`).join('');
const dock = POLES.map((p) => `<a href="#${p.ancre}">${icPole(p.cle, 24)}<span>${p.cle === 'immo' ? 'Immo' : p.nom.charAt(0) + p.nom.slice(1).toLowerCase()}</span></a>`).join('');
/* l'action d'un pôle : la section (lien) ou le panneau de demande (bouton) */
const actionPole = (p, classe = 'lien') => p.mode ? `<button type="button" class="${classe}" data-demande="${p.mode}">${p.action} ${ic('fleche', 18)}</button>` : `<a class="${classe}" href="#${p.ancre}">${p.action} ${ic('fleche', 18)}</a>`;

const annonce = (h) => `<article class="annonce" data-lieu="${echapper(h.lieu + ' ' + h.zone)}" data-reveal>
  <figure>${img(h.slug, { alt: `${h.titre}, ${h.lieu}`, sizes: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw' })}${h.verifie ? badge() : badgeAttente}</figure>
  <div class="annonce-corps">
    <h3>${echapper(h.titre)}</h3>
    <p class="meta">${echapper(h.lieu)} · ${echapper(h.zone)} · ${echapper(h.type)} · ${echapper(h.capacite)}</p>
    <ul class="details">${h.details.map((d) => `<li>${echapper(d)}</li>`).join('')}</ul>
    <div class="annonce-pied"><p class="tarif">Tarif sur demande<small>Prix détaillé avant tout paiement</small></p><button type="button" class="bouton bouton--petit" data-demande="stay" data-objet="${h.slug}" aria-label="Réserver : ${echapper(h.titre)}">Réserver</button></div>
  </div>
</article>`;

const experience = (e) => `<article class="experience" data-lieu="${echapper(e.lieu)}" data-reveal>
  <figure>${img(e.slug, { alt: e.titre, sizes: '(max-width: 960px) 100vw, 55vw' })}<figcaption>${echapper(e.lieu)}</figcaption></figure>
  <div class="experience-texte">
    <h3>${echapper(e.titre)}</h3>
    <div class="meta"><span>${ic('calendrier', 16)}${echapper(e.duree)}</span><span>${ic('bouclier', 16)}${echapper(e.format)} vérifié</span></div>
    <p>${echapper(e.texte)}</p>
    <div class="actions"><button type="button" class="bouton" data-demande="tourisme" data-objet="${e.slug}" aria-label="Réserver : ${echapper(e.titre)}">Réserver cette expérience</button></div>
  </div>
</article>`;

/* un champ du panneau ; `pour` = variantes qui l'affichent (« * » = toutes) */
const champ = (nom, libelle, type = 'text', { pour = '*', aide = '', attrs = '', large = false, placeholder = '', classe = '' } = {}) => `<label class="champ${large ? ' champ--large' : ''}${classe ? ' ' + classe : ''}" data-pour="${pour}"><span><b data-libelle="${nom}">${libelle}</b><i class="requis" aria-hidden="true">*</i>${aide ? ` <i>${aide}</i>` : ''}</span>${type === 'textarea' ? `<textarea name="${nom}" ${attrs} placeholder="${placeholder}"></textarea>` : type === 'select' ? `<select name="${nom}" ${attrs}>${placeholder}</select>` : `<input type="${type}" name="${nom}" ${attrs} placeholder="${placeholder}" ${type === 'text' || type === 'email' ? 'autocomplete="on"' : ''}>`}<span class="erreur" aria-live="polite"></span></label>`;

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>KAZA GABON – Logement, hébergement, tourisme, conciergerie et diaspora au Gabon</title>
<meta name="description" content="KAZA GABON – ÉCO TOURISME : un seul point d’entrée pour trouver un logement, réserver un hébergement, organiser des expériences et commander des services au Gabon, avec un accompagnement dédié à la diaspora.">
<meta name="theme-color" content="${FORET}">
<meta property="og:title" content="KAZA GABON – Préparer, organiser et vivre un séjour au Gabon">
<meta property="og:description" content="Logement, hébergement, tourisme, conciergerie et accompagnement de la diaspora : cinq pôles, un compte, des partenaires vérifiés.">
<meta property="og:type" content="website">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/icons/icon-180.png">
<link rel="manifest" href="manifest.json">
<meta name="application-name" content="KAZA">
<meta name="apple-mobile-web-app-title" content="KAZA">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="stylesheet" href="assets/site.css?v=${version}">
<script src="assets/intro.js?v=${version}"></script>
</head>
<body>
<div id="intro" aria-hidden="true"><div class="intro-logo">${logo({ couleur: BLANC, accent: CITRON, sousTitre: '', taille: 100 }).replace(/ style="width:[^"]*"/, '')}</div><p class="intro-ligne">Préparer · Organiser · Vivre le Gabon</p></div>
<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="entete sombre">
  <div class="conteneur">
    <a href="#haut" aria-label="KAZA GABON, accueil">${logoBlanc}${logoMot}</a>
    <nav class="nav-principale" aria-label="Les cinq pôles">${navLiens}</nav>
    <div class="entete-actions">
      <button type="button" class="bouton bouton--citron bouton--petit" data-demande="">Réserver</button>
      <button type="button" class="menu-bouton" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">${ic('menu', 24)}</button>
    </div>
  </div>
</header>
<nav class="menu sombre" id="menu" aria-label="Menu">
  <ul>${POLES.map((p) => `<li><a href="#${p.ancre}">${icPole(p.cle, 24)}<span>KAZA ${p.nom}<small>${p.titre}</small></span></a></li>`).join('')}<li><button type="button" data-demande="partenaire">${ic('bouclier', 24)}<span>Devenir partenaire</span></button></li></ul>
  <button type="button" class="bouton bouton--citron" data-demande="">Réserver</button>
</nav>

<main id="contenu">
<svg id="vol" aria-hidden="true" focusable="false"><path class="vol-trace" d="M0 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><g class="vol-avion"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/></g></svg>
<section class="heros sombre" id="haut" aria-labelledby="titre-heros">
  <div class="heros-scene">
    <figure class="panneau panneau--plage est-actif" data-legende="${PHOTOS_CLIENT[2].legende}">${imgClient(2, { eager: true })}</figure>
    <figure class="panneau panneau--ville" data-legende="${PHOTOS_CLIENT[1].legende}">${imgClient(1)}</figure>
    <figure class="panneau panneau--berges" data-legende="${PHOTOS_CLIENT[3].legende}">${imgClient(3)}</figure>
  </div>
  <div class="heros-voile" aria-hidden="true"></div>
  <div class="heros-fond" aria-hidden="true">${trajectoire({ largeur: 900, hauteur: 420, epaisseur: 4 })}</div>
  <div class="conteneur heros-copie">
    <p class="heros-sur">Bienvenue chez KAZA</p>
    <h1 id="titre-heros">Préparer, organiser et vivre <em>le Gabon</em>.</h1>
    <p class="heros-intro">Logement, hébergement, expériences et services du quotidien, avec des partenaires vérifiés. Dites-nous ce que vous cherchez&#8239;: une équipe vous répond sur WhatsApp.</p>
  </div>
  <div class="conteneur heros-pied">
    <a class="heros-defiler" href="#poles"><span>Faire défiler</span><i aria-hidden="true"></i></a>
    <p class="heros-legende">${appareil}<span data-legende>${PHOTOS_CLIENT[2].legende}</span><b class="heros-compteur">01 / 03</b></p>
  </div>
</section>
<div class="recherche-bande">
  <div class="conteneur">
    <form class="recherche" id="recherche" data-mode="stay" aria-labelledby="recherche-question">
      <div class="recherche-haut">
        <p class="recherche-question" id="recherche-question">Que cherchez-vous&#8239;?</p>
        <div class="recherche-onglets" role="tablist" aria-label="Type de recherche">${POLES.map((p) => `<button type="button" role="tab" id="onglet-${p.cle}" aria-selected="${p.cle === 'stay' ? 'true' : 'false'}" aria-controls="recherche-champs" tabindex="${p.cle === 'stay' ? '0' : '-1'}" data-onglet="${p.cle}">${icPole(p.cle, 18)}<span>${p.nom}</span><small>${p.court}</small></button>`).join('')}</div>
      </div>
      <div class="recherche-champs" id="recherche-champs" role="tabpanel">
        <label data-pour="stay tourisme"><span>Destination</span><input type="text" name="destination" list="lieux" placeholder="Libreville, Loango, Nyonié…" autocomplete="off"></label>
        <label data-pour="stay"><span>Arrivée</span><input type="date" name="arrivee"></label>
        <label data-pour="stay"><span>Départ</span><input type="date" name="depart"></label>
        <label data-pour="stay"><span>Voyageurs</span><input type="number" name="voyageurs" min="1" max="20" inputmode="numeric" placeholder="2"></label>
        <label data-pour="tourisme"><span>Date</span><input type="date" name="date"></label>
        <label data-pour="tourisme"><span>Participants</span><input type="number" name="participants" min="1" max="30" inputmode="numeric" placeholder="2"></label>
        <label data-pour="immo"><span>Je veux</span><select name="transaction">${options(['Louer', 'Acheter'])}</select></label>
        <label data-pour="immo"><span>Type de bien</span><select name="typeBien">${options(TYPES_BIEN, 'Choisir…')}</select></label>
        <label data-pour="immo"><span>Ville ou quartier</span><input type="text" name="ville" list="lieux" placeholder="Libreville, Akanda…" autocomplete="off"></label>
        <label data-pour="conciergerie"><span>Service</span><select name="service">${options(SERVICES.map((s) => s.nom).concat('Autre service'), 'Choisir…')}</select></label>
        <label data-pour="conciergerie"><span>Quartier</span><input type="text" name="quartier" placeholder="Louis, Akanda, Glass…"></label>
        <label data-pour="conciergerie"><span>Date souhaitée</span><input type="date" name="dateService"></label>
        <label data-pour="diaspora"><span>Pays de départ</span><input type="text" name="pays" placeholder="France, Canada, Sénégal…"></label>
        <label data-pour="diaspora"><span>Arrivée prévue</span><input type="date" name="arriveeDiaspora"></label>
        <label data-pour="diaspora"><span>Voyageurs</span><input type="number" name="voyageursDiaspora" min="1" max="20" inputmode="numeric" placeholder="2"></label>
        <button type="submit" class="bouton bouton--citron">${ic('recherche', 20)}<span data-libelle-recherche>Voir les hébergements</span></button>
      </div>
      <datalist id="lieux">${DESTINATIONS.map((d) => `<option value="${d}">`).join('')}</datalist>
    </form>
    <ul class="reassurance"><li>${ic('bouclier', 16)}Partenaires, documents et biens vérifiés</li><li>${ic('recu', 16)}Prix détaillé avant tout paiement</li><li>${ic('whatsapp', 16)}Une responsable vous répond sur WhatsApp</li></ul>
  </div>
</div>
<div class="toits-bande" aria-hidden="true">${toits({ largeur: 1600, hauteur: 44, n: 40, graine: 5 }).replace(/<(polygon|polyline) /g, (m, t, i, s) => `<${t} style="--i:${(s.slice(0, i).match(/<(polygon|polyline) /g) || []).length}" `)}</div>

<section class="poles sombre" id="poles" aria-labelledby="titre-poles">
  <div class="conteneur">
    <h2 id="titre-poles" class="visuellement-cache">Les cinq pôles KAZA</h2>
    <ul class="poles-liste">${POLES.map((p, i) => `<li class="pole" data-reveal style="--delai:${i * .06}s"><div class="ic">${icPole(p.cle, 26)}</div><h3><small>KAZA</small>${p.nom}</h3><p>${p.texte}</p>${actionPole(p)}</li>`).join('')}</ul>
  </div>
</section>

<section class="section pourquoi" id="pourquoi" aria-labelledby="titre-pourquoi">
  <div class="conteneur">
    <div class="pourquoi-texte">
      <p class="pole-nom" data-reveal>Pourquoi KAZA</p>
      <h2 id="titre-pourquoi">Le Gabon en vrai&#8239;: la capitale, les plages, les berges, et des partenaires qui y vivent.</h2>
      <p class="secondaire" data-reveal>Un logement, un hébergement pour quelques nuits, une expérience guidée, un service du quotidien&#8239;: tout se demande au même endroit, à des partenaires vérifiés, et une équipe vous répond sur WhatsApp. Que vous arriviez de l’étranger, que vous habitiez Libreville ou que vous receviez de la famille.</p>
      <ol class="temps">
        <li data-reveal style="--delai:0s"><small>01</small><div><b>Préparer</b><p>Un bien à louer ou à acheter, un séjour complet depuis l’étranger. KAZA IMMO &amp; VÉRIFIÉ, KAZA DIASPORA.</p><i class="temps-trait" aria-hidden="true"></i></div></li>
        <li data-reveal style="--delai:.08s"><small>02</small><div><b>Organiser</b><p>Dates, voyageurs, transferts, ménage, courses&#8239;: tout se réserve depuis un seul espace. KAZA STAY, KAZA CONCIERGERIE.</p><i class="temps-trait" aria-hidden="true"></i></div></li>
        <li data-reveal style="--delai:.16s"><small>03</small><div><b>Vivre</b><p>Les parcs, les lagunes, les plages et la ville, avec des guides et des opérateurs vérifiés. KAZA TOURISME.</p><i class="temps-trait" aria-hidden="true"></i></div></li>
      </ol>
    </div>
    <div class="pourquoi-visuel">
      <figure class="grande">${imgClient(3, { sizes: '(max-width: 960px) 100vw, 40vw' })}<figcaption>${appareil}<span>Aux berges des 3 Rivières</span></figcaption></figure>
      <figure class="petite">${imgClient(1, { sizes: '(max-width: 960px) 46vw, 18vw' })}<figcaption>${appareil}<span>La Concorde, Libreville</span></figcaption></figure>
    </div>
  </div>
</section>

<section class="section" id="stay" aria-labelledby="titre-stay">
  <div class="conteneur">
    <div class="section-tete" data-reveal>
      <div><p class="pole-nom">${icPole('stay', 20)}KAZA STAY</p><h2 id="titre-stay">Des hébergements vérifiés, du studio en ville au lodge sur la lagune</h2><p class="secondaire">Choisissez un hébergement, appuyez sur Réserver, indiquez vos dates&#8239;: une responsable KAZA vous confirme la disponibilité et le prix sur WhatsApp.</p></div>
    </div>
    <div class="resultat" id="resultat" role="status" aria-live="polite"></div>
    <div class="annonces">${HEBERGEMENTS.map(annonce).join('')}</div>
    <p class="note-demo">Sélection de démonstration&#8239;: les logements partenaires et leurs tarifs seront publiés à l’ouverture de la plateforme. <button type="button" class="lien-texte" data-demande="stay">Aucun ne vous convient&#8239;? Décrivez ce que vous cherchez.</button></p>
  </div>
</section>

<section class="section sombre" id="tourisme" aria-labelledby="titre-tourisme">
  <div class="conteneur">
    <div class="section-tete" data-reveal>
      <div><p class="pole-nom" style="color:${CITRON}">${icPole('tourisme', 20)}KAZA TOURISME</p><h2 id="titre-tourisme">Les parcs, les lagunes et les plages, avec des guides qui les connaissent</h2><p class="secondaire">L’écotourisme d’abord&#8239;: parcs nationaux, forêts, côtes et lagunes, visites culturelles, avec des opérateurs partenaires vérifiés. Programme, durée et conditions sont écrits avant toute demande.</p></div>
    </div>
    <div class="resultat resultat--sombre" id="resultat-tourisme" role="status" aria-live="polite"></div>
    <div class="experiences">${EXPERIENCES.map(experience).join('')}</div>
    <p class="note-demo">Exemples d’expériences&#8239;; les fiches réelles des partenaires les remplaceront à l’ouverture. <button type="button" class="lien-texte" data-demande="tourisme">Une autre envie&#8239;? Dites-nous laquelle.</button></p>
  </div>
</section>

<section class="comment" id="comment" aria-labelledby="titre-comment">
  <div class="conteneur">
    <div class="comment-tete" data-reveal><h2 id="titre-comment">Comment ça marche</h2><p>Trois étapes, les mêmes pour les cinq pôles. Aucun paiement sur le site.</p></div>
    <ol class="comment-etapes">${COMMENT.map((c, i) => `<li data-reveal style="--delai:${i * .08}s"><span class="numero">${i + 1}</span><b>${c.titre}</b><p>${c.texte}</p></li>`).join('')}</ol>
    <div class="comment-action" data-reveal><button type="button" class="bouton" data-demande="">${ic('whatsapp', 20)}Réserver maintenant</button><p>WhatsApp KAZA&#8239;: ${CONTACT.whatsappAffiche}</p></div>
  </div>
</section>

<section class="section" id="immo" aria-labelledby="titre-immo">
  <div class="conteneur verification">
    <div data-reveal>
      <p class="pole-nom section-tete-pole">${icPole('immo', 20)}KAZA IMMO &amp; VÉRIFIÉ</p>
      <h2 id="titre-immo">Acheter ou louer longtemps, sans mauvaise surprise</h2>
      <p class="secondaire" style="margin:14px 0 26px;max-width:52ch;font-size:17px">Maisons, appartements, studios et terrains, à la vente ou en location longue durée, en relation directe avec des propriétaires et des agences vérifiés. Décrivez le bien que vous cherchez, l’équipe KAZA vous propose des biens contrôlés.</p>
      <ol class="etapes etapes--clair">${VERIFICATION.map((v) => `<li><div><b>${v.titre}</b><p class="secondaire">${v.texte}</p></div></li>`).join('')}</ol>
      <div class="actions-ligne"><button type="button" class="bouton" data-demande="immo">Décrire le bien que je cherche</button><button type="button" class="bouton bouton--contour" data-demande="partenaire" data-profil="Propriétaire">Déposer une annonce</button></div>
    </div>
    <div class="verif-visuel sombre" data-reveal>
      <span class="grand-badge">${coche}KAZA Vérifié</span>
      <p>Un seul badge, une seule forme. Il distingue les annonces vérifiées des autres&#8239;; une annonce en cours de contrôle l’indique clairement.</p>
      <div class="ligne"><span>Profil contrôlé</span><span>Documents examinés</span><span>Bien documenté</span><span>Signalement possible</span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">${badge()}${badgeAttente}</div>
    </div>
  </div>
</section>

<section class="section" id="conciergerie" aria-labelledby="titre-conciergerie" style="background:var(--surface-2)">
  <div class="conteneur">
    <div class="section-tete" data-reveal>
      <div><p class="pole-nom">${icPole('conciergerie', 20)}KAZA CONCIERGERIE</p><h2 id="titre-conciergerie">Les services du quotidien, seuls ou ajoutés à votre séjour</h2><p class="secondaire">Choisissez un service&#8239;: vous indiquez le quartier et la date, un prestataire qualifié vous envoie un devis écrit.</p></div>
    </div>
    <ul class="services">${SERVICES.map((s, i) => `<li data-reveal style="--delai:${(i % 3) * .06}s"><button type="button" class="service" data-demande="conciergerie" data-service="${echapper(s.nom)}"><span class="ic">${ic(s.icone, 24)}</span><span class="service-texte"><b>${s.nom}</b><span>${s.texte}</span></span><span class="service-fleche">${ic('fleche', 20)}</span></button></li>`).join('')}</ul>
  </div>
</section>

<section class="section diaspora sombre" id="diaspora" aria-labelledby="titre-diaspora">
  <div class="fond-reliefs" aria-hidden="true">${reliefs({ largeur: 1600, hauteur: 300, opaciteArriere: .12 })}</div>
  <div class="conteneur">
    <div data-reveal>
      <p class="pole-nom" style="color:${CITRON}">${icPole('diaspora', 20)}KAZA DIASPORA</p>
      <h2 id="titre-diaspora">Vous vivez à l’étranger&#8239;? Préparez votre retour, votre séjour ou votre installation.</h2>
      <p class="secondaire" style="margin-top:14px;max-width:52ch;font-size:17px">Un seul interlocuteur ouvre les autres pôles&#8239;: hébergement, transferts, expériences, services, et un suivi centralisé de vos demandes, confirmations et documents.</p>
      <div class="actions-ligne"><button type="button" class="bouton" data-demande="diaspora">Préparer mon retour</button><p class="mention-claire">Réponse personnalisée de l’équipe KAZA. Aucun paiement à cette étape.</p></div>
    </div>
    <ol class="parcours" data-reveal>${PARCOURS.map((p) => `<li><small>${p.pole}</small><b>${p.titre}</b><p>${p.texte}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section partenaires" id="partenaires" aria-labelledby="titre-partenaires">
  <div class="conteneur">
    <div data-reveal>
      <h2 id="titre-partenaires">Vous louez, vous guidez, vous rendez service&#8239;? Rejoignez KAZA.</h2>
      <p class="secondaire" style="margin-top:14px;max-width:52ch;font-size:17px">Un espace pour vos annonces, vos tarifs, vos disponibilités et vos demandes, et le badge KAZA Vérifié pour ceux qui passent la vérification. Conditions d’abonnement et de commission communiquées à l’ouverture.</p>
      <div class="actions-ligne"><button type="button" class="bouton" data-demande="partenaire">Devenir partenaire</button><p class="mention-claire">Vérification obligatoire avant toute publication.</p></div>
    </div>
    <ul class="profils" data-reveal>${PARTENAIRES.map((p) => `<li><b>${p.titre}</b><p>${p.texte}</p></li>`).join('')}</ul>
  </div>
</section>
</main>

<footer class="pied sombre">
  <div class="conteneur">
    <div class="pied-haut">
      <div>${logoBlanc}<p>KAZA GABON – ÉCO TOURISME. Le point d’entrée fiable pour préparer, organiser et vivre un séjour au Gabon.</p></div>
      <div><h3>Les pôles</h3><ul>${POLES.map((p) => `<li><a href="#${p.ancre}">KAZA ${p.nom}</a></li>`).join('')}</ul></div>
      <div><h3>Pour vous</h3><ul><li><a href="https://wa.me/${CONTACT.whatsapp}" rel="noopener">WhatsApp KAZA&#8239;: ${CONTACT.whatsappAffiche}</a></li><li><button type="button" data-demande="">Réserver</button></li><li><button type="button" data-demande="diaspora">Préparer mon retour</button></li><li><button type="button" data-demande="partenaire">Devenir partenaire</button></li><li><a href="#immo">Comprendre la vérification</a></li><li><span>Conditions générales et confidentialité&#8239;: à la publication</span></li></ul></div>
      <div><h3>Paiement</h3><ul><li><span>Conditions données par une responsable, sur WhatsApp</span></li><li><span>Airtel Money</span></li><li><span>Moov Money</span></li><li><span>Virement ou carte selon le cas</span></li></ul></div>
    </div>
    <div class="pied-bas">
      <div class="collab"><span>Une collaboration</span>${logoAura({ couleur: BLANC })}<span>Identité et vitrine réalisées par <a href="https://methode-aura.onrender.com" rel="noopener">MÉTHODE AURA</a>, studio de marque. Du concept à l’impact.</span></div>
      <p class="credits">Photographies du héros et de « Pourquoi KAZA » fournies par KAZA (droits réservés). Autres photographies (Wikimedia Commons)&#8239;: ${echapper(sitesCredits)}. Hébergements et expériences présentés à titre de démonstration&#8239;; les tarifs sont communiqués par la responsable KAZA lors de la réservation.</p>
      <p>© KAZA GABON – ÉCO TOURISME, ${new Date().getFullYear()}.</p>
    </div>
  </div>
</footer>
<nav class="dock" aria-label="Pôles (navigation mobile)">${dock}</nav>

<!-- le panneau de demande : un seul formulaire, six variantes, ouvert par tout bouton [data-demande] -->
<div class="demande-fond" data-demande-fermer hidden></div>
<aside class="demande" id="demande" role="dialog" aria-modal="true" aria-labelledby="demande-titre" hidden data-lenis-prevent>
  <div class="demande-tete">
    <button type="button" class="demande-icone" data-demande-retour aria-label="Revenir au choix" hidden>${ic('retour', 22)}</button>
    <div class="demande-titres"><p class="demande-pole" data-pole></p><h2 id="demande-titre">Que souhaitez-vous&#8239;?</h2></div>
    <button type="button" class="demande-icone" data-demande-fermer aria-label="Fermer">${ic('fermer', 22)}</button>
  </div>
  <div class="demande-corps">
    <div class="demande-choix" data-etape="choix">
      ${CHOIX.map((c) => `<button type="button" class="choix" data-demande="${c.mode}"><span class="ic">${icPole(c.cle, 24)}</span><span class="choix-texte"><b>${c.titre}</b><span>${c.texte}</span></span>${ic('fleche', 20)}</button>`).join('')}
      <p class="demande-aide">Vous louez, vous guidez, vous rendez service&#8239;? <button type="button" class="lien-texte" data-demande="partenaire">Devenir partenaire</button></p>
    </div>
    <form class="demande-form" id="formulaire" novalidate data-etape="form" data-mode="stay" hidden>
      <p class="demande-intro" data-intro></p>
      <div class="demande-objet" data-objet-resume hidden><span class="demande-objet-image" aria-hidden="true"></span><div><small data-objet-type></small><b data-objet-titre></b><span data-objet-lieu></span></div><button type="button" class="lien-texte" data-objet-changer>Changer</button></div>
      <div class="champs">
        ${champ('hebergement', 'Hébergement souhaité', 'select', { pour: 'stay', large: true, classe: 'sans-objet', placeholder: options(HEBERGEMENTS.map((h) => `${h.titre} · ${h.lieu}`).concat('Conseillez-moi'), 'Choisir…') })}
        ${champ('experience', 'Expérience', 'select', { pour: 'tourisme', large: true, classe: 'sans-objet', placeholder: options(EXPERIENCES.map((e) => e.titre).concat('Conseillez-moi'), 'Choisir…') })}
        ${champ('pays', 'Pays de départ', 'text', { pour: 'diaspora', large: true, placeholder: 'France, Canada, Sénégal…' })}
        ${champ('arrivee', 'Arrivée', 'date', { pour: 'stay diaspora' })}
        ${champ('depart', 'Départ', 'date', { pour: 'stay diaspora' })}
        ${champ('voyageurs', 'Nombre de voyageurs', 'number', { pour: 'stay diaspora', attrs: 'min="1" max="20" inputmode="numeric"', placeholder: '2' })}
        ${champ('date', 'Date souhaitée', 'date', { pour: 'tourisme' })}
        ${champ('participants', 'Participants', 'number', { pour: 'tourisme', attrs: 'min="1" max="30" inputmode="numeric"', placeholder: '2' })}
        <fieldset class="champ champ--large" data-pour="immo"><legend><span><b>Je veux</b></span></legend><div class="segment">${['Louer', 'Acheter'].map((v, i) => `<label><input type="radio" name="transaction" value="${v}"${i === 0 ? ' checked' : ''}>${v}</label>`).join('')}</div></fieldset>
        ${champ('typeBien', 'Type de bien', 'select', { pour: 'immo', placeholder: options(TYPES_BIEN, 'Choisir…') })}
        ${champ('ville', 'Ville ou quartier', 'text', { pour: 'immo', placeholder: 'Libreville, Akanda…', attrs: 'list="lieux"' })}
        ${champ('service', 'Service', 'select', { pour: 'conciergerie', large: true, placeholder: options(SERVICES.map((s) => s.nom).concat('Autre service'), 'Choisir…') })}
        ${champ('quartier', 'Quartier ou adresse', 'text', { pour: 'conciergerie', placeholder: 'Louis, Akanda, Glass…' })}
        ${champ('dateService', 'Date souhaitée', 'date', { pour: 'conciergerie' })}
        ${champ('frequence', 'Fréquence', 'select', { pour: 'conciergerie', large: true, placeholder: options(FREQUENCES) })}
        <fieldset class="champ champ--large" data-pour="diaspora"><legend><span><b>Vos besoins</b></span></legend><div class="cases">${BESOINS.map((b) => `<label><input type="checkbox" name="besoins" value="${b}">${b}</label>`).join('')}</div></fieldset>
        ${champ('budget', 'Budget indicatif', 'text', { pour: 'immo diaspora', large: true, placeholder: 'En FCFA ou en euros, même approximatif' })}
        ${champ('profil', 'Vous êtes', 'select', { pour: 'partenaire', large: true, placeholder: options(PROFILS, 'Choisir…') })}
        ${champ('structure', 'Structure', 'text', { pour: 'partenaire', placeholder: 'Agence, lodge, entreprise' })}
        ${champ('zone', 'Zone d’activité', 'text', { pour: 'partenaire', placeholder: 'Libreville, Akanda, Loango…' })}
        ${champ('nom', 'Votre nom', 'text', { placeholder: 'Prénom et nom' })}
        ${champ('contact', 'Votre numéro WhatsApp', 'text', { placeholder: '+241 … ou +33 …', attrs: 'inputmode="tel" autocomplete="tel"' })}
        ${champ('message', 'Précisions', 'textarea', { large: true, placeholder: '' })}
      </div>
      <div class="demande-pied">
        <button type="submit" class="bouton bouton--citron">${ic('whatsapp', 20)}<span data-bouton>Envoyer sur WhatsApp</span></button>
        <p class="mention">Le message s’ouvre dans WhatsApp, vous l’envoyez d’un geste. Aucun paiement sur le site.</p>
      </div>
    </form>
    <div class="demande-fin" data-etape="fin" hidden>
      <span class="demande-fin-ic">${ic('coche', 30)}</span>
      <h3>Votre message est prêt</h3>
      <p class="statut" data-etat="ok" data-fin-texte></p>
      <a class="bouton bouton--citron" data-fin-lien href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">${ic('whatsapp', 20)}Ouvrir WhatsApp</a>
      <ol class="demande-suite"><li>Une responsable KAZA vous répond avec la disponibilité, le prix détaillé et les conditions.</li><li>Vous payez par Airtel Money, Moov Money, virement ou carte, selon ce qui vous convient.</li></ol>
      <button type="button" class="lien-texte" data-demande-fermer>Revenir au site</button>
    </div>
  </div>
</aside>
<script src="assets/config.js?v=${version}"></script>
<script src="assets/app.js?v=${version}" defer></script>
<script src="assets/vendor/gsap.min.js" defer></script>
<script src="assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/vendor/liquide.js" defer></script>
<script src="assets/effets.js?v=${version}" defer></script>
</body>
</html>
`;

await writeFile(join(SITE, 'index.html'), html);
/* scripts en fichiers (pas de script en ligne : la politique de sécurité du site n'autorise que 'self') */
await copyFile(join(ICI, 'intro.js'), join(SITE, 'assets', 'intro.js'));
const OBJETS = {};
for (const h of HEBERGEMENTS) OBJETS[h.slug] = { type: 'Hébergement', pole: 'stay', titre: h.titre, lieu: `${h.lieu} · ${h.zone}`, image: `assets/img/${h.slug}-480.webp`, libelle: `${h.titre} · ${h.lieu}` };
for (const e of EXPERIENCES) OBJETS[e.slug] = { type: 'Expérience', pole: 'tourisme', titre: e.titre, lieu: e.lieu, image: `assets/img/${e.slug}-480.webp`, libelle: e.titre };
await writeFile(join(SITE, 'assets', 'config.js'), `window.KAZA_CONTACT = ${JSON.stringify(CONTACT)};\nwindow.KAZA_OBJETS = ${JSON.stringify(OBJETS)};\nwindow.KAZA_MODES = ${JSON.stringify(MODES)};\n`);
await copyFile(join(ICI, 'site.css'), join(SITE, 'assets', 'site.css'));
await copyFile(join(ICI, 'app.js'), join(SITE, 'assets', 'app.js'));
await copyFile(join(ICI, 'effets.js'), join(SITE, 'assets', 'effets.js'));
await writeFile(join(SITE, 'assets', 'favicon.svg'), symbole({ fond: FORET, lettre: BLANC, accent: CITRON }).replace(/ class="[^"]*"/, '').replace(/ style="[^"]*"/, '') + '\n');
console.log('généré : site/index.html, site/assets/site.css, site/assets/app.js, site/assets/config.js, site/assets/favicon.svg');
