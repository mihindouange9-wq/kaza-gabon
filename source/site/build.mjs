/* KAZA GABON — génère site/index.html, site/assets/site.css et site/assets/app.js à partir de la charte (lib.mjs) et de donnees.mjs.
   Lancer : node source/site/build.mjs   (depuis le dossier kaza) */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logo, symbole, trajectoire, toits, reliefs, icone, logoAura, echapper, credits, FORET, CITRON, BLANC, GRIS, RELIEF } from '../lib.mjs';
import { CONTACT, DESTINATIONS, POLES, HEBERGEMENTS, EXPERIENCES, SERVICES, VERIFICATION, PARCOURS, PARTENAIRES, CONFIANCE, RESERVATION_ETAPES } from './donnees.mjs';

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
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  fermer: '<path d="M6 6l12 12M18 6L6 18"/>',
  bouclier: '<path d="M12 3l7 3v5c0 5-3.2 8.3-7 10-3.8-1.7-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  recu: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  statut: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  paiement: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18M7 15h3"/>',
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

const annonce = (h) => `<article class="annonce" data-lieu="${echapper(h.lieu + ' ' + h.zone)}" data-reveal>
  <figure>${img(h.slug, { alt: `${h.titre}, ${h.lieu}`, sizes: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw' })}${h.verifie ? badge() : badgeAttente}</figure>
  <div class="annonce-corps">
    <h3>${echapper(h.titre)}</h3>
    <p class="meta">${echapper(h.lieu)} · ${echapper(h.zone)} · ${echapper(h.type)} · ${echapper(h.capacite)}</p>
    <ul class="details">${h.details.map((d) => `<li>${echapper(d)}</li>`).join('')}</ul>
    <div class="annonce-pied"><p class="tarif">Tarif sur demande<small>Prix détaillé avant tout paiement</small></p><button type="button" class="bouton bouton--petit" data-objet="Hébergement : ${echapper(h.titre)} (${echapper(h.lieu)})" aria-label="Réserver : ${echapper(h.titre)}">Réserver</button></div>
  </div>
</article>`;

const experience = (e, i) => `<article class="experience" data-lieu="${echapper(e.lieu)}" data-reveal>
  <figure>${img(e.slug, { alt: e.titre, sizes: '(max-width: 960px) 100vw, 55vw' })}<figcaption>${echapper(e.lieu)}</figcaption></figure>
  <div class="experience-texte">
    <h3>${echapper(e.titre)}</h3>
    <div class="meta"><span>${ic('calendrier', 16)}${echapper(e.duree)}</span><span>${ic('bouclier', 16)}${echapper(e.format)} vérifié</span></div>
    <p>${echapper(e.texte)}</p>
    <div class="actions"><button type="button" class="bouton" data-objet="Expérience : ${echapper(e.titre)} (${echapper(e.lieu)})">Réserver cette expérience</button></div>
  </div>
</article>`;

const champ = (nom, libelle, type = 'text', { requis = false, aide = '', attrs = '', large = false, placeholder = '' } = {}) => `<label class="champ${large ? ' champ--large' : ''}"><span>${libelle}${requis ? ' <i class="requis" aria-hidden="true">*</i>' : ''}${aide ? ` <i>${aide}</i>` : ''}</span>${type === 'textarea' ? `<textarea name="${nom}" ${requis ? 'required' : ''} ${attrs} placeholder="${placeholder}"></textarea>` : `<input type="${type}" name="${nom}" ${requis ? 'required' : ''} ${attrs} placeholder="${placeholder}" ${type === 'text' || type === 'email' ? 'autocomplete="on"' : ''}>`}<span class="erreur" aria-live="polite"></span></label>`;

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
<link rel="manifest" href="manifest.webmanifest">
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
      <a class="bouton bouton--contour bouton--petit" href="#diaspora">Préparer mon séjour</a>
      <a class="bouton bouton--citron bouton--petit" href="#reservation">Réserver</a>
      <button type="button" class="menu-bouton" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">${ic('menu', 24)}</button>
    </div>
  </div>
</header>
<nav class="menu sombre" id="menu" aria-label="Menu">
  <ul>${POLES.map((p) => `<li><a href="#${p.ancre}">${icPole(p.cle, 24)}KAZA ${p.nom}</a></li>`).join('')}<li><a href="#diaspora">${icPole('diaspora', 24)}Préparer mon séjour</a></li><li><a href="#partenaires">${ic('bouclier', 24)}Devenir partenaire</a></li></ul>
  <a class="bouton bouton--citron" href="#reservation">Réserver</a>
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
    <p class="heros-intro">Logement, hébergement, expériences et services du quotidien, depuis un seul espace, avec des partenaires vérifiés. Et un accompagnement dédié si vous revenez de l’étranger.</p>
    <ul class="heros-poles" aria-label="Accès direct aux pôles">${POLES.map((p) => `<li><a href="#${p.ancre}">${icPole(p.cle, 18)}${p.nom}</a></li>`).join('')}</ul>
  </div>
  <div class="conteneur heros-pied">
    <a class="heros-defiler" href="#poles"><span>Faire défiler</span><i aria-hidden="true"></i></a>
    <p class="heros-legende">${appareil}<span data-legende>${PHOTOS_CLIENT[2].legende}</span><b class="heros-compteur">01 / 03</b></p>
  </div>
</section>
<div class="recherche-bande">
  <div class="conteneur">
    <form class="recherche" id="recherche" role="search" aria-label="Rechercher un hébergement">
      <label><span>Destination</span><input type="text" name="destination" list="lieux" placeholder="Libreville, Loango, Nyonié…" autocomplete="off"></label>
      <label><span>Arrivée</span><input type="date" name="arrivee"></label>
      <label><span>Départ</span><input type="date" name="depart"></label>
      <label><span>Voyageurs</span><input type="number" name="voyageurs" min="1" max="20" inputmode="numeric" placeholder="2"></label>
      <button type="submit" class="bouton bouton--citron">${ic('recherche', 20)}Rechercher</button>
      <datalist id="lieux">${DESTINATIONS.map((d) => `<option value="${d}">`).join('')}</datalist>
    </form>
    <ul class="reassurance"><li>${ic('bouclier', 16)}Profils, documents et biens vérifiés</li><li>${ic('recu', 16)}Prix détaillé avant paiement</li><li>${ic('paiement', 16)}Réservation sur WhatsApp, paiement avec une responsable</li></ul>
  </div>
</div>
<div class="toits-bande" aria-hidden="true">${toits({ largeur: 1600, hauteur: 44, n: 40, graine: 5 }).replace(/<(polygon|polyline) /g, (m, t, i, s) => `<${t} style="--i:${(s.slice(0, i).match(/<(polygon|polyline) /g) || []).length}" `)}</div>

<section class="poles sombre" id="poles" aria-labelledby="titre-poles">
  <div class="conteneur">
    <h2 id="titre-poles" class="visuellement-cache">Les cinq pôles KAZA</h2>
    <ul class="poles-liste">${POLES.map((p, i) => `<li class="pole" data-reveal style="--delai:${i * .06}s"><div class="ic">${icPole(p.cle, 26)}</div><h3><small>KAZA</small>${p.nom}</h3><p>${p.texte}</p><a class="lien" href="#${p.ancre}">${p.titre} ${ic('fleche', 18)}</a></li>`).join('')}</ul>
  </div>
</section>

<section class="section pourquoi" id="pourquoi" aria-labelledby="titre-pourquoi">
  <div class="conteneur">
    <div class="pourquoi-texte">
      <p class="pole-nom" data-reveal>Pourquoi KAZA</p>
      <h2 id="titre-pourquoi">Le Gabon en vrai&#8239;: la capitale, les plages, les berges, et des partenaires qui y vivent.</h2>
      <p class="secondaire" data-reveal>KAZA réunit en un seul espace ce qui se cherchait jusqu’ici à plusieurs endroits&#8239;: un logement à louer ou à acheter, un hébergement pour quelques nuits, une expérience guidée, un service du quotidien. Chaque partenaire est vérifié, chaque prix est écrit avant la demande.</p>
      <p class="secondaire" data-reveal>Vous arrivez de l’étranger, vous habitez Libreville ou vous recevez de la famille&#8239;: le parcours est le même, et une équipe vous répond sur WhatsApp.</p>
      <ol class="temps">
        <li data-reveal style="--delai:0s"><small>01</small><div><b>Préparer</b><p>Un bien à louer ou à acheter, un hébergement, un séjour complet, depuis Libreville ou depuis l’étranger. KAZA IMMO &amp; VÉRIFIÉ, KAZA DIASPORA.</p><i class="temps-trait" aria-hidden="true"></i></div></li>
        <li data-reveal style="--delai:.08s"><small>02</small><div><b>Organiser</b><p>Dates, voyageurs, transferts, ménage, courses, rendez-vous&#8239;: tout se réserve depuis un seul espace. KAZA STAY, KAZA CONCIERGERIE.</p><i class="temps-trait" aria-hidden="true"></i></div></li>
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
      <div><p class="pole-nom">${icPole('stay', 20)}KAZA STAY</p><h2 id="titre-stay">Des hébergements vérifiés, du studio en ville au lodge sur la lagune</h2><p class="secondaire">Appartements meublés, villas, bungalows et résidences partenaires. Chaque fiche affiche l’équipement, les règles, les disponibilités et le prix complet avant toute demande.</p></div>
      <a class="lien" href="#reservation">Réserver un hébergement ${ic('fleche', 18)}</a>
    </div>
    <div class="resultat" id="resultat" role="status" aria-live="polite"></div>
    <div class="annonces">${HEBERGEMENTS.map(annonce).join('')}</div>
    <p class="note-demo">Sélection de démonstration : les logements partenaires et leurs tarifs seront publiés à l’ouverture de la plateforme.</p>
  </div>
</section>

<section class="section sombre" id="tourisme" aria-labelledby="titre-tourisme">
  <div class="conteneur">
    <div class="section-tete" data-reveal>
      <div><p class="pole-nom" style="color:${CITRON}">${icPole('tourisme', 20)}KAZA TOURISME</p><h2 id="titre-tourisme">Les parcs, les lagunes et les plages, avec des guides qui les connaissent</h2><p class="secondaire">L’écotourisme d’abord : parcs nationaux, forêts, côtes et lagunes, visites culturelles et gastronomiques, avec des opérateurs partenaires vérifiés. Programme, durée, inclusions et conditions sont écrits avant toute demande.</p></div>
    </div>
    <div class="experiences">${EXPERIENCES.map(experience).join('')}</div>
    <p class="note-demo">Exemples d’expériences ; les fiches réelles des partenaires les remplaceront à l’ouverture.</p>
  </div>
</section>

<section class="section reservation" id="reservation" aria-labelledby="titre-reservation">
  <div class="conteneur">
    <div data-reveal>
      <h2 id="titre-reservation">Réservez en trois étapes, le paiement se règle avec une responsable</h2>
      <p class="secondaire" style="margin-top:14px;max-width:52ch;font-size:17px">Le paiement en ligne arrive plus tard. En attendant, votre réservation part sur le WhatsApp de KAZA (${CONTACT.whatsappAffiche}) et une responsable vous répond avec les conditions de paiement.</p>
      <ol class="etapes" style="margin-top:28px">${RESERVATION_ETAPES.map((e) => `<li><div><b>${e.titre}</b><p class="secondaire">${e.texte}</p></div></li>`).join('')}</ol>
    </div>
    <form class="formulaire" id="reserver" novalidate data-reveal>
      <h3>Valider ma réservation</h3>
      <p class="intro">Tous les champs marqués <i class="requis" style="font-style:normal;color:#8F3129;font-weight:600">*</i> sont nécessaires pour vous répondre. WhatsApp s’ouvre ensuite avec votre message.</p>
      <div class="champs">
        <label class="champ champ--large"><span>Ce que vous réservez <i class="requis" aria-hidden="true">*</i></span><select name="objet" required><option value="">Choisir…</option><optgroup label="Hébergements">${HEBERGEMENTS.map((h) => `<option value="Hébergement : ${echapper(h.titre)} (${echapper(h.lieu)})">${echapper(h.titre)} · ${echapper(h.lieu)}</option>`).join('')}</optgroup><optgroup label="Expériences">${EXPERIENCES.map((e) => `<option value="Expérience : ${echapper(e.titre)} (${echapper(e.lieu)})">${echapper(e.titre)}</option>`).join('')}</optgroup><optgroup label="Autre"><option value="Service de conciergerie">Service de conciergerie</option><option value="Recherche d’un bien (achat ou location longue durée)">Recherche d’un bien (achat ou location longue durée)</option><option value="Autre demande">Autre demande</option></optgroup></select><span class="erreur" aria-live="polite"></span></label>
        ${champ('arrivee', 'Arrivée', 'date', { requis: true })}
        ${champ('depart', 'Départ', 'date', { requis: true })}
        ${champ('voyageurs', 'Nombre de voyageurs', 'number', { requis: true, attrs: 'min="1" max="20" inputmode="numeric"', placeholder: '2' })}
        ${champ('nom', 'Votre nom', 'text', { requis: true, placeholder: 'Prénom et nom' })}
        ${champ('contact', 'Votre numéro WhatsApp', 'tel', { requis: true, placeholder: '+241 … ou +33 …', large: true })}
        ${champ('message', 'Précisions', 'textarea', { placeholder: 'Heure d’arrivée, enfants, demandes particulières…', large: true })}
      </div>
      <div class="actions"><button type="submit" class="bouton bouton--citron">${ic('coche', 20)}Valider ma réservation</button><p class="mention">Aucun paiement sur le site. La responsable KAZA vous écrit sur WhatsApp.</p></div>
      <div class="statut" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>

<section class="section" id="immo" aria-labelledby="titre-immo">
  <div class="conteneur verification">
    <div data-reveal>
      <p class="pole-nom section-tete-pole">${icPole('immo', 20)}KAZA IMMO &amp; VÉRIFIÉ</p>
      <h2 id="titre-immo">Acheter ou louer longtemps, sans mauvaise surprise</h2>
      <p class="secondaire" style="margin:14px 0 26px;max-width:52ch;font-size:17px">Maisons, appartements, studios et terrains, à la vente ou en location longue durée, avec une mise en relation directe avec les propriétaires et les agences. Le badge KAZA Vérifié dit ce qui a été contrôlé.</p>
      <ol class="etapes etapes--clair">${VERIFICATION.map((v) => `<li><div><b>${v.titre}</b><p class="secondaire">${v.texte}</p></div></li>`).join('')}</ol>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:28px"><button type="button" class="bouton" data-objet="Recherche d’un bien (achat ou location longue durée)">Chercher un bien</button><a class="bouton bouton--contour" href="#partenaires">Déposer une annonce</a></div>
    </div>
    <div class="verif-visuel sombre" data-reveal>
      <span class="grand-badge">${coche}KAZA Vérifié</span>
      <p>Un seul badge, une seule forme. Il distingue les annonces vérifiées des autres ; une annonce en cours de contrôle l’indique clairement.</p>
      <div class="ligne"><span>Profil contrôlé</span><span>Documents examinés</span><span>Bien documenté</span><span>Signalement possible</span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">${badge()}${badgeAttente}</div>
    </div>
  </div>
</section>

<section class="section" id="conciergerie" aria-labelledby="titre-conciergerie" style="background:var(--surface-2)">
  <div class="conteneur">
    <div class="section-tete" data-reveal>
      <div><p class="pole-nom">${icPole('conciergerie', 20)}KAZA CONCIERGERIE</p><h2 id="titre-conciergerie">Les services du quotidien, seuls ou ajoutés à votre séjour</h2><p class="secondaire">Pour les voyageurs, les résidents et les propriétaires de logements : des prestataires qualifiés, une zone desservie, des disponibilités et des évaluations. Un service ponctuel ou récurrent, avec prise de rendez-vous.</p></div>
      <button type="button" class="bouton" data-objet="Service de conciergerie">Commander un service</button>
    </div>
    <ul class="services">${SERVICES.map((s, i) => `<li class="service" data-reveal style="--delai:${(i % 3) * .06}s"><div class="ic">${ic(s.icone, 24)}</div><div><b>${s.nom}</b><p>${s.texte}</p></div></li>`).join('')}</ul>
  </div>
</section>

<section class="section diaspora sombre" id="diaspora" aria-labelledby="titre-diaspora">
  <div class="fond-reliefs" aria-hidden="true">${reliefs({ largeur: 1600, hauteur: 300, opaciteArriere: .12 })}</div>
  <div class="conteneur">
    <div data-reveal>
      <p class="pole-nom" style="color:${CITRON}">${icPole('diaspora', 20)}KAZA DIASPORA</p>
      <h2 id="titre-diaspora">Vous vivez à l’étranger&#8239;? Préparez votre retour, votre séjour ou votre installation.</h2>
      <p class="secondaire" style="margin-top:14px;max-width:52ch;font-size:17px">Un parcours intégré qui ouvre les autres pôles : hébergement, mobilité, expériences, services, et un suivi centralisé de vos demandes, confirmations et documents.</p>
      <ol class="parcours">${PARCOURS.map((p) => `<li><small>${p.pole}</small><b>${p.titre}</b><p>${p.texte}</p></li>`).join('')}</ol>
    </div>
    <form class="formulaire" id="demande" novalidate data-reveal>
      <h3>Décrivez votre séjour</h3>
      <p class="intro">L’équipe KAZA vous répond avec une proposition personnalisée. Aucun paiement à cette étape. Les champs marqués <i class="requis" style="font-style:normal;color:#8F3129;font-weight:600">*</i> sont nécessaires.</p>
      <div class="champs">
        ${champ('nom', 'Votre nom', 'text', { requis: true, placeholder: 'Prénom et nom' })}
        ${champ('contact', 'WhatsApp ou courriel', 'text', { requis: true, placeholder: '+33 6… ou vous@exemple.com' })}
        ${champ('pays', 'Pays de départ', 'text', { requis: true, placeholder: 'France, Canada, Sénégal…' })}
        ${champ('voyageurs', 'Nombre de voyageurs', 'number', { attrs: 'min="1" max="20" inputmode="numeric"', placeholder: '2' })}
        ${champ('arrivee', 'Arrivée', 'date')}
        ${champ('depart', 'Départ', 'date')}
        <fieldset class="champ champ--large" style="border:0;padding:0;margin:0"><legend><span>Vos besoins</span></legend><div class="cases">${['Hébergement', 'Transferts et chauffeur', 'Excursions', 'Services du quotidien'].map((b) => `<label><input type="checkbox" name="besoins" value="${b}">${b}</label>`).join('')}</div></fieldset>
        ${champ('budget', 'Budget indicatif', 'text', { placeholder: 'Pour le séjour complet, hors vols', large: true })}
        ${champ('message', 'Ce que vous attendez de ce séjour', 'textarea', { placeholder: 'Dates souples, quartier souhaité, personnes à mobilité réduite, enfants…', large: true })}
      </div>
      <div class="actions"><button type="submit" class="bouton bouton--citron">Envoyer ma demande</button><p class="mention">Réponse personnalisée de l’équipe KAZA. Vos informations ne sont utilisées que pour cette demande.</p></div>
      <div class="statut" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>

<section class="confiance" aria-labelledby="titre-confiance">
  <div class="conteneur">
    <h2 id="titre-confiance" class="visuellement-cache">Nos engagements</h2>
    <ul class="confiance-liste">${CONFIANCE.map((c, i) => `<li data-reveal style="--delai:${i * .06}s"><div class="ic">${ic(['recu', 'statut', 'paiement'][i], 22)}</div><div><b>${c.titre}</b><p>${c.texte}</p></div></li>`).join('')}</ul>
  </div>
</section>

<section class="section partenaires" id="partenaires" aria-labelledby="titre-partenaires">
  <div class="conteneur">
    <div data-reveal>
      <h2 id="titre-partenaires">Vous louez, vous guidez, vous rendez service&#8239;? Rejoignez KAZA.</h2>
      <p class="secondaire" style="margin-top:14px;max-width:52ch;font-size:17px">Un espace pour gérer vos annonces, vos tarifs, vos disponibilités et vos demandes, et le badge KAZA Vérifié pour ceux qui passent la vérification. Les conditions d’abonnement et de commission sont communiquées à l’ouverture.</p>
      <ul class="profils">${PARTENAIRES.map((p) => `<li><b>${p.titre}</b><p>${p.texte}</p></li>`).join('')}</ul>
    </div>
    <form class="formulaire" id="partenaire" novalidate data-reveal>
      <h3>Demander à devenir partenaire</h3>
      <p class="intro">Dites-nous qui vous êtes ; l’équipe KAZA vous explique la vérification et les prochaines étapes. Les champs marqués <i class="requis" style="font-style:normal;color:#8F3129;font-weight:600">*</i> sont nécessaires.</p>
      <div class="champs">
        <label class="champ champ--large"><span>Vous êtes <i class="requis" aria-hidden="true">*</i></span><select name="profil" required><option value="Propriétaire">Propriétaire</option><option value="Agence immobilière">Agence immobilière</option><option value="Gestionnaire d’hébergements">Gestionnaire d’hébergements</option><option value="Guide, agence ou opérateur touristique">Guide, agence ou opérateur touristique</option><option value="Prestataire de services">Prestataire de services</option></select><span class="erreur" aria-live="polite"></span></label>
        ${champ('nom', 'Votre nom', 'text', { requis: true, placeholder: 'Prénom et nom' })}
        ${champ('structure', 'Structure', 'text', { placeholder: 'Nom de l’agence, du lodge, de l’entreprise' })}
        ${champ('contact', 'WhatsApp ou courriel', 'text', { requis: true, placeholder: '+241 … ou vous@exemple.com' })}
        ${champ('zone', 'Zone d’activité', 'text', { placeholder: 'Libreville, Akanda, Loango…' })}
        ${champ('message', 'Ce que vous proposez', 'textarea', { placeholder: 'Type de biens, d’hébergements, d’expériences ou de services', large: true })}
      </div>
      <div class="actions"><button type="submit" class="bouton">Envoyer ma demande</button><p class="mention">Vérification obligatoire avant toute publication.</p></div>
      <div class="statut" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>
</main>

<footer class="pied sombre">
  <div class="conteneur">
    <div class="pied-haut">
      <div>${logoBlanc}<p>KAZA GABON – ÉCO TOURISME. Le point d’entrée fiable pour préparer, organiser et vivre un séjour au Gabon.</p></div>
      <div><h3>Les pôles</h3><ul>${POLES.map((p) => `<li><a href="#${p.ancre}">KAZA ${p.nom}</a></li>`).join('')}</ul></div>
      <div><h3>Pour vous</h3><ul><li><a href="https://wa.me/${CONTACT.whatsapp}" rel="noopener">WhatsApp KAZA : ${CONTACT.whatsappAffiche}</a></li><li><a href="#reservation">Réserver</a></li><li><a href="#diaspora">Préparer mon séjour</a></li><li><a href="#partenaires">Devenir partenaire</a></li><li><a href="#immo">Comprendre la vérification</a></li><li><span>Conditions générales et confidentialité : à la publication</span></li></ul></div>
      <div><h3>Paiement</h3><ul><li><span>Conditions données par une responsable, sur WhatsApp</span></li><li><span>Airtel Money</span></li><li><span>Moov Money</span></li><li><span>Virement ou carte selon le cas</span></li></ul></div>
    </div>
    <div class="pied-bas">
      <div class="collab"><span>Une collaboration</span>${logoAura({ couleur: BLANC })}<span>Identité et vitrine réalisées par <a href="https://methode-aura.onrender.com" rel="noopener">MÉTHODE AURA</a>, studio de marque. Du concept à l’impact.</span></div>
      <p class="credits">Photographies du héros et de « Pourquoi KAZA » fournies par KAZA (droits réservés). Autres photographies (Wikimedia Commons) : ${echapper(sitesCredits)}. Hébergements et expériences présentés à titre de démonstration ; les tarifs sont communiqués par la responsable KAZA lors de la réservation.</p>
      <p>© KAZA GABON – ÉCO TOURISME, ${new Date().getFullYear()}.</p>
    </div>
  </div>
</footer>
<nav class="dock" aria-label="Pôles (navigation mobile)">${dock}</nav>
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
await writeFile(join(SITE, 'assets', 'config.js'), 'window.KAZA_CONTACT = ' + JSON.stringify(CONTACT) + ';');
await copyFile(join(ICI, 'site.css'), join(SITE, 'assets', 'site.css'));
await copyFile(join(ICI, 'app.js'), join(SITE, 'assets', 'app.js'));
await copyFile(join(ICI, 'effets.js'), join(SITE, 'assets', 'effets.js'));
const woff = (await readFile(join(RACINE, 'charte', 'assets', 'fonts', 'Outfit-latin.woff2'))).toString('base64');
await writeFile(join(SITE, 'assets', 'favicon.svg'), symbole({ fond: FORET, lettre: BLANC, accent: CITRON }).replace(/ class="[^"]*"/, '').replace(/ style="[^"]*"/, '') + '\n');
console.log('généré : site/index.html, site/assets/site.css, site/assets/app.js, site/assets/favicon.svg');
