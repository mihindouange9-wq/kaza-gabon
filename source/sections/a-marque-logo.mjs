/* Couverture, sommaire, 01 La marque, 02 Logo. */
import { planche, logo, symbole, construction, trajectoire, toits, reliefs, icone, POLES, photo, credit, FORET, CITRON, BLANC, GRIS, RELIEF } from '../lib.mjs';

const S1 = '01 — La marque', S2 = '02 — Logo';
export default function () {
  const planches = [];

  /* couverture : immersion immédiate dans les signes de la marque, sans photo */
  planches.push(`<section class="planche planche--foret couverture couverture--signes" data-section="Couverture">
  <div class="couverture-fond" aria-hidden="true">
    ${reliefs({ largeur: 1600, hauteur: 440 })}
  </div>
  <header class="planche-tete"><span class="planche-section">Charte graphique · version 1.0 · novembre 2026</span><span class="planche-marque">KAZA GABON – ÉCO TOURISME</span><span class="planche-num" data-num></span></header>
  <div class="planche-corps couverture-corps">
    ${logo({ couleur: BLANC, accent: CITRON, taille: 100 })}
    ${toits({ largeur: 520, hauteur: 46, n: 12, graine: 5 })}
    <p class="grand couverture-accroche">Préparer, organiser et vivre un séjour au Gabon.</p>
    <p class="couverture-poles">Immo &amp; Vérifié · Stay · Tourisme · Conciergerie · Diaspora</p>
  </div>
  <footer class="planche-tete" style="border:0;border-top:1px solid rgba(154,175,164,.3);padding:14px 0 0"><span>Document de référence</span><span>Réalisée par MÉTHODE AURA</span><span>Diffusion : équipe, partenaires, imprimeurs</span></footer>
</section>`);

  /* sommaire */
  planches.push(planche({ section: 'Sommaire', titre: 'Neuf chapitres, une seule marque', sur: 'Ce que contient cette charte', corps: `
    <ol class="sommaire">
      <li><b>01</b> La marque <small>projet, mission, vision, valeurs, les cinq pôles, parcours, personnalité, ton</small></li>
      <li><b>02</b> Logo <small>logo principal, construction, versions, symbole, déclinaisons par pôle, tailles, interdits</small></li>
      <li><b>03</b> Couleurs <small>quatre couleurs, valeurs HEX / RGB / CMJN, proportions, combinaisons et contrastes</small></li>
      <li><b>04</b> Typographie <small>Outfit, Plus Jakarta Sans, hiérarchie en six niveaux, mise en situation</small></li>
      <li><b>05</b> Système graphique <small>trajectoire, toits, reliefs, badge KAZA Vérifié, règles d’assemblage</small></li>
      <li><b>06</b> Photographie <small>direction, sujets, cadrage, lumière, traitement, crédits</small></li>
      <li><b>07</b> Réseaux sociaux <small>publication, story, profil</small></li>
      <li><b>08</b> Applications <small>carte de visite, signature, kakémono, affiche, autocollant partenaire</small></li>
      <li><b>09</b> À faire, à éviter <small>seize cas concrets</small></li>
      <li><b>—</b> Fichiers et crédits <small>logos livrés, polices, photos, signature MÉTHODE AURA</small></li>
    </ol>` }));

  /* 01 — le projet */
  planches.push(planche({ section: S1, titre: 'Un seul point d’entrée pour le Gabon', sur: 'Le projet', corps: `
    <div class="grille-2">
      <div class="colonne">
        <p class="intro">KAZA GABON – ÉCO TOURISME est une plateforme numérique gabonaise qui centralise des solutions de logement, d’hébergement, de tourisme et de conciergerie, avec un accompagnement dédié à la diaspora.</p>
        <p>Depuis un même espace, l’utilisateur trouve un logement, réserve un hébergement de courte durée, organise des expériences touristiques et commande des services pratiques. La marque doit donc être lisible dans cinq univers de service différents, et rester une seule et même voix.</p>
        <dl class="cles">
          <dt>Nom</dt><dd>KAZA GABON – ÉCO TOURISME ; « KAZA » seul dans l’usage courant</dd>
          <dt>Nature</dt><dd>Plateforme multiservices intégrée : application web responsive, puis mobile</dd>
          <dt>Public</dt><dd>Voyageurs, résidents, propriétaires et gestionnaires, prestataires, Gabonais de l’étranger</dd>
          <dt>Priorité</dt><dd>L’écotourisme et la découverte du patrimoine naturel et culturel du Gabon</dd>
          <dt>Référence</dt><dd>Les visuels fournis par la fondatrice : leurs couleurs, leur logo et leur ambiance sont la source de cette charte</dd>
        </dl>
      </div>
      <div class="cadre-photo">${photo('savane-nyonie')}<p class="photo-legende">Savane de Nyonié<small>Ce que la marque promet : le Gabon réel, accessible, bien organisé.</small></p></div>
    </div>
    ${credit('savane-nyonie')}` }));

  /* 01 — mission, vision, valeurs */
  planches.push(planche({ section: S1, titre: 'Mission, vision, valeurs', corps: `
    <div class="grille-3">
      <div class="bloc">
        <p class="etiquette">Mission</p>
        <h3>Rendre simple ce qui ne l’était pas</h3>
        <p>Permettre à chacun de trouver un logement, de réserver un hébergement, d’organiser ses expériences et de commander les services du quotidien depuis un seul espace, avec des annonces vérifiées et des partenaires engagés.</p>
      </div>
      <div class="bloc">
        <p class="etiquette">Vision</p>
        <h3>Le point d’entrée fiable pour préparer, organiser et vivre un séjour au Gabon</h3>
        <p>Faciliter aussi l’accès aux services immobiliers et aux prestations du quotidien, pour les résidents comme pour ceux qui reviennent.</p>
      </div>
      <div class="colonne">
        <div class="bloc bloc--foret" style="flex:1">
          <p class="etiquette">Valeurs</p>
          <ul class="liste liste--sans">
            <li><b>Confiance.</b> Des profils, des documents et des biens vérifiés ; un badge qui dit ce qu’il veut dire.</li>
            <li><b>Hospitalité.</b> On accueille, on accompagne, on répond.</li>
            <li><b>Nature.</b> L’écotourisme d’abord : forêts, plages, lagunes, parcs, patrimoine.</li>
            <li><b>Clarté.</b> Prix détaillé avant paiement, conditions affichées, statuts lisibles.</li>
            <li><b>Proximité.</b> Un lien gardé avec ceux qui vivent loin et veulent rentrer, séjourner ou s’installer.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 01 — les cinq pôles */
  planches.push(planche({ section: S1, titre: 'Cinq pôles, un compte, une expérience', sur: 'Architecture officielle', sombre: true, corps: `
    <div class="colonne"><div class="poles-grille" style="flex:1;height:auto">
      ${POLES.map((p) => `<div class="pole"><div class="ic">${icone(p.cle, { taille: 28 })}</div><h3><small>KAZA</small>${p.nom}</h3><p>${p.texte}</p>${logo({ couleur: BLANC, accent: CITRON, sousTitre: p.nom, sousCouleur: CITRON, taille: 40 })}</div>`).join('')}
    </div>
    <p class="note">Les cinq pôles sont fixés par la fondatrice. Aucun pôle autonome supplémentaire n’est créé sans sa validation ; chaque pôle garde le préfixe KAZA et la même identité.</p></div>` }));

  /* 01 — parcours transversal */
  planches.push(planche({ section: S1, titre: 'Les pôles se répondent : l’exemple d’un retour au pays', sur: 'Parcours utilisateur transversal', corps: `
    <div class="colonne" style="justify-content:space-between">
      <div class="parcours">
        <div class="etape-p"><b>Étape 1 · KAZA DIASPORA</b><h4>Préparer le séjour</h4><p>Une personne vivant à l’étranger renseigne son pays de départ, ses dates, le nombre de voyageurs, ses besoins et un budget indicatif. L’équipe KAZA prend le relais.</p></div>
        <div class="etape-p"><b>Étape 2 · KAZA STAY</b><h4>Réserver un hébergement</h4><p>Un appartement meublé ou une villa pour trois semaines, avec galerie, équipements, règles, disponibilités et récapitulatif du prix avant paiement.</p></div>
        <div class="etape-p"><b>Étape 3 · KAZA TOURISME</b><h4>Choisir des expériences</h4><p>Parc national, lagune, visite guidée, activité culturelle : des fiches claires, des partenaires identifiés, une demande puis une confirmation.</p></div>
        <div class="etape-p"><b>Étape 4 · KAZA CONCIERGERIE</b><h4>Commander les services</h4><p>Un chauffeur à l’arrivée, un ménage en milieu de séjour, des courses le premier jour. Tout dans le même récapitulatif de séjour.</p></div>
      </div>
      <div style="flex:1;display:grid;place-items:center;min-height:0">${trajectoire({ couleur: FORET, avionCouleur: FORET, largeur: 1400, hauteur: 300, epaisseur: 5 }).replace('class="trajectoire"', 'class="trajectoire" style="max-height:100%;width:auto"')}</div>
      <div class="grille-3" style="height:auto">
        <div class="bloc bloc--clair"><h4>Un compte unique</h4><p>Un profil commun, un espace personnel qui regroupe demandes, réservations, paiements, messages et historique.</p></div>
        <div class="bloc bloc--clair"><h4>Des statuts lisibles</h4><p>Demande reçue, validation, paiement, confirmation, rappel, modification : chaque étape est notifiée, dans le même vocabulaire et les mêmes couleurs.</p></div>
        <div class="bloc bloc--clair"><h4>Une identité continue</h4><p>Le voyageur passe d’un pôle à l’autre sans changer d’univers : même logo, même palette, mêmes composants, seul le nom du pôle change.</p></div>
      </div>
    </div>` }));

  /* 01 — personnalité, ton, positionnement */
  planches.push(planche({ section: S1, titre: 'Premium, naturelle, épurée', sur: 'Personnalité et ton de voix', corps: `
    <div class="grille-2">
      <div class="colonne">
        <p class="etiquette">La marque est</p>
        <div class="mots-cles"><span>premium</span><span>naturelle</span><span>tropicale</span><span>élégante</span><span>épurée</span><span>immersive</span><span>fiable</span><span>accueillante</span><span>précise</span><span>gabonaise</span></div>
        <p class="etiquette" style="margin-top:14px">Elle n’est pas</p>
        <div class="mots-cles"><span class="non">criarde</span><span class="non">surchargée</span><span class="non">générique</span><span class="non">froide</span><span class="non">improvisée</span><span class="non">« petites annonces »</span></div>
        <hr class="filet">
        <p class="etiquette">Ton de voix</p>
        <p>Vouvoiement partout. Des phrases courtes, concrètes, qui disent ce qui va se passer et quand. On rassure par la précision (prix, conditions, délais, statuts), jamais par des superlatifs. On nomme les lieux : Loango, Lopé, Nyonié, Pointe-Denis, Libreville. Pas de jargon technique, pas d’anglicismes inutiles ; les noms de pôles restent en capitales.</p>
      </div>
      <div class="colonne">
        <div class="bloc bloc--foret" style="flex:1;justify-content:center">
          <p class="etiquette">Positionnement</p>
          <p class="enorme" style="font-size:56px;color:${BLANC}">Le point d’entrée fiable pour préparer, organiser et vivre un séjour au Gabon.</p>
        </div>
        <div class="bloc">
          <h4>Signature proposée</h4>
          <p class="grand" style="font-size:28px">Préparer. Organiser. Vivre le Gabon.</p>
          <p class="note">Proposition de MÉTHODE AURA à valider par la fondatrice ; aucune signature n’est imposée par le cahier des charges.</p>
        </div>
      </div>
    </div>` }));

  /* 02 — logo principal */
  planches.push(planche({ section: S2, titre: 'Le logo : un mot, deux toits, une trajectoire', sur: 'Logo principal', sombre: true, corps: `
    <div class="grille-2-1">
      <div class="logo-cadre logo-cadre--foret" style="border:1px solid rgba(154,175,164,.25)">${logo({ couleur: BLANC, accent: CITRON, taille: 100 })}</div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Anatomie</h3>
          <ul class="liste liste--sans">
            <li><b>KAZA</b> en capitales géométriques, sans empattement, lettres larges et fût épais : la solidité d’une adresse.</li>
            <li><b>Les deux A</b> n’ont pas de barre ; leur contre reçoit un triangle vert citron, le « toit ». Il évoque la maison et la tente, le logement et le voyage.</li>
            <li><b>La trajectoire</b> part du Z et monte vers l’avion : le départ, le retour, le lien avec la diaspora.</li>
            <li><b>GABON</b> en lettres espacées, sous le mot : l’ancrage. Cette ligne devient le nom du pôle dans les déclinaisons (chapitre 02).</li>
          </ul>
          <p class="note">Le logo fourni par la fondatrice a été reconstruit en vectoriel sans en changer le dessin : mêmes proportions, mêmes couleurs, mêmes éléments. Les fichiers SVG livrés remplacent l’image d’origine pour tous les usages.</p>
        </div>
      </div>
    </div>` }));

  /* 02 — construction */
  planches.push(planche({ section: S2, titre: 'Construction et zone de protection', corps: `
    <div class="grille-2-1">
      <div class="logo-cadre logo-cadre--blanc" style="padding:20px">${construction()}</div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Règles de construction</h3>
          <ul class="liste">
            <li>Hauteur de capitale = 100 unités ; fût des lettres = 22 ; toit vert citron = 38 de haut, posé sur la ligne de base.</li>
            <li>Rapport fixe entre KAZA, la trajectoire, l’avion et la ligne GABON : on ne déplace aucun élément, on ne change aucune proportion.</li>
            <li>Zone de protection <b>t</b> autour du logo = hauteur du toit (38 % de la hauteur de capitale). Rien n’entre dans cette zone : texte, photo chargée, bord de support, autre logo.</li>
            <li>Le logo s’aligne sur la ligne de base de KAZA ou sur le bord gauche du K, jamais sur l’avion.</li>
            <li>Sur une photo, il est posé dans une zone calme (ciel, eau, mur) ou sur un voile vert forêt (chapitre 06).</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 02 — versions */
  planches.push(planche({ section: S2, titre: 'Quatre versions, un seul dessin', sur: 'Versions du logo', corps: `
    <div class="grille-2" style="grid-template-rows:1fr 1fr;gap:20px">
      <div class="colonne" style="gap:10px"><div class="logo-cadre logo-cadre--foret" style="flex:1">${logo({ couleur: BLANC, accent: CITRON, taille: 100 })}</div><p class="legende"><b>Principale.</b> Blanc cassé et toits vert citron sur vert forêt : la version de référence, celle de l’application, des réseaux et des supports sombres.</p></div>
      <div class="colonne" style="gap:10px"><div class="logo-cadre logo-cadre--blanc" style="flex:1">${logo({ couleur: FORET, accent: CITRON, taille: 100 })}</div><p class="legende"><b>Sur fond clair.</b> Vert forêt et toits vert citron sur blanc cassé : documents, factures, fonds photo clairs, co-branding.</p></div>
      <div class="colonne" style="gap:10px"><div class="logo-cadre" style="flex:1;background:${RELIEF}">${logo({ couleur: BLANC, accent: BLANC, taille: 100 })}</div><p class="legende"><b>Monochrome blanc.</b> Gravure, broderie, tampon, filigrane, fond photo sombre sans accent : tout en blanc cassé.</p></div>
      <div class="colonne" style="gap:10px"><div class="logo-cadre logo-cadre--gris" style="flex:1">${logo({ couleur: FORET, accent: FORET, taille: 100 })}</div><p class="legende"><b>Monochrome vert forêt.</b> Impression une couleur, fonds vert gris ou vert citron, documents administratifs.</p></div>
    </div>` }));

  /* 02 — symbole */
  planches.push(planche({ section: S2, titre: 'Le symbole : le A au toit vert citron', sur: 'Icône, avatar, favicon', corps: `
    <div class="grille-2-1">
      <div class="colonne">
        <div class="logo-cadre logo-cadre--blanc" style="flex:1;grid-template-columns:repeat(4,auto);gap:36px">
          ${symbole({ fond: FORET, lettre: BLANC, accent: CITRON, taille: 180 })}${symbole({ fond: CITRON, lettre: FORET, accent: FORET, taille: 180 })}${symbole({ fond: BLANC, lettre: FORET, accent: CITRON, taille: 180 }).replace('class="symbole"', 'class="symbole" data-bord')}${symbole({ lettre: FORET, accent: CITRON, tuile: false, taille: 180 })}
        </div>
        <div class="tailles" style="justify-content:center;gap:48px">
          <div>${symbole({ taille: 96 })}<span>96 px · écran d’accueil</span></div>
          <div>${symbole({ taille: 64 })}<span>64 px · avatar</span></div>
          <div>${symbole({ taille: 32 })}<span>32 px · favicon</span></div>
          <div>${symbole({ taille: 24, rayon: 6 })}<span>24 px · minimum</span></div>
        </div>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Usage</h3>
          <p>Le A seul, avec son toit, représente la marque quand le mot complet ne tient pas : icône d’application, avatar des réseaux, favicon, puce de liste, marqueur de carte, cachet sur une photo.</p>
          <ul class="liste">
            <li>Sur tuile arrondie (rayon 22 % du côté) : vert forêt avec lettre blanc cassé, vert citron avec lettre vert forêt, ou blanc cassé.</li>
            <li>Sans tuile : vert forêt ou blanc cassé selon le fond, toit vert citron.</li>
            <li>Jamais à côté du logo complet sur le même support, jamais déformé ni tourné.</li>
            <li>Taille minimale : 24 px à l’écran, 8 mm imprimé.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 02 — déclinaisons par pôle */
  planches.push(planche({ section: S2, titre: 'Un logo par pôle : la ligne GABON devient le nom du pôle', sur: 'Déclinaisons', sombre: true, corps: `
    <div class="poles-logos">
      ${POLES.map((p) => `<div class="logo-cadre" style="background:${RELIEF}">${logo({ couleur: BLANC, accent: CITRON, sousTitre: p.nom, sousCouleur: CITRON, taille: 80 })}</div>`).join('')}
      <div class="bloc" style="justify-content:center"><h4>Règles</h4><ul class="liste" style="font-size:14px"><li>Le nom du pôle remplace GABON, en vert citron sur fond sombre, en vert forêt sur fond clair.</li><li>Un seul pôle par support ; le logo GABON revient dès que la communication est institutionnelle ou multi-pôles.</li><li>Même police, même espacement, même position : les fichiers sont livrés, on ne les recompose pas.</li></ul></div>
    </div>` }));

  /* 02 — tailles et interdits */
  const interdit = (svg, texte, fond = FORET) => `<div class="interdit"><div class="logo-cadre" style="background:${fond}">${svg}</div><p>${texte}</p></div>`;
  planches.push(planche({ section: S2, titre: 'Tailles minimales et interdits', corps: `
    <div class="grille-1-2">
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Tailles minimales</h3>
          <div class="tailles" style="align-items:flex-start;gap:28px;margin:6px 0 10px">
            <div style="justify-items:start">${logo({ couleur: FORET, accent: CITRON, taille: 34 })}<span>160 px · 40 mm</span></div>
            <div style="justify-items:start">${logo({ couleur: FORET, accent: CITRON, taille: 26, sousTitre: '' })}<span>120 px · 30 mm (mot seul)</span></div>
          </div>
          <ul class="liste">
            <li>Logo complet avec GABON : 160 px de large à l’écran, 40 mm imprimé.</li>
            <li>Mot KAZA seul (sans ligne GABON) : 120 px, 30 mm ; en dessous, utiliser le symbole.</li>
            <li>Trajectoire et avion disparaissent en dessous de 120 px : seul le mot reste.</li>
          </ul>
        </div>
      </div>
      <div class="interdits">
        ${interdit(logo({ couleur: '#F2C94C', accent: '#E0592A', taille: 70 }), 'Recolorer : aucune autre couleur que celles de la palette.')}
        ${interdit(logo({ couleur: BLANC, accent: CITRON, taille: 70 }).replace('class="logo"', 'class="logo" style="transform:scaleX(1.35)"'), 'Déformer, étirer, écraser, incliner.')}
        ${interdit(logo({ couleur: BLANC, accent: CITRON, taille: 70 }), 'Poser sur un dégradé ou une couleur hors charte.', 'linear-gradient(135deg,#0EA5E9,#EA580C)')}
        ${interdit(logo({ couleur: BLANC, accent: CITRON, taille: 70 }).replace('class="logo"', 'class="logo" style="filter:drop-shadow(0 8px 10px rgba(0,0,0,.8))"'), 'Ajouter une ombre, un relief, un contour.')}
        ${interdit(logo({ couleur: BLANC, accent: CITRON, sousTitre: 'Gabon', taille: 70 }).replace('font-weight="500"', 'font-weight="300" font-family="Georgia, serif" font-style="italic"'), 'Changer la police ou la casse de GABON.')}
        ${interdit(`<div style="display:grid;place-items:center">${symbole({ taille: 110 })}</div>`, 'Mettre le symbole à la place du mot quand la place existe.', RELIEF)}
      </div>
    </div>` }));

  return planches;
}
