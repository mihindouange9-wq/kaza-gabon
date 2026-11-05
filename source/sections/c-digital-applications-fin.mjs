/* 07 Réseaux sociaux, 08 Applications, 09 À faire / à éviter, fin, crédit MÉTHODE AURA. */
import { planche, logo, symbole, trajectoire, toits, reliefs, badgeVerifie, icone, POLES, photo, credit, logoAura, FORET, CITRON, BLANC, GRIS, RELIEF } from '../lib.mjs';

const S7 = '07 — Réseaux sociaux', S8 = '08 — Applications', S9 = '09 — À faire, à éviter';
export default function () {
  const planches = [];

  /* 07 — réseaux sociaux */
  planches.push(planche({ section: S7, titre: 'Réseaux sociaux : la photo, le voile, le titre', sur: 'Publication, story, profil', corps: `
    <div class="grille-3">
      <div class="colonne" style="gap:10px">
        <div class="post post--foret">${photo('loango-elephants')}<div class="voile"></div>${logo({ couleur: BLANC, accent: CITRON, sousTitre: '', taille: 20 })}<p class="etiquette-post" style="color:${CITRON}">KAZA TOURISME</p><p class="titre-post">Loango, les éléphants de plage</p><p class="sous-post">Journée guidée avec un opérateur partenaire vérifié.</p></div>
        <p class="mockup-legende">Publication carrée : photo pleine, voile vert forêt par le bas, titre Outfit 600, logo en haut à droite, nom du pôle en vert citron.</p>
      </div>
      <div class="colonne" style="gap:10px">
        <div class="story">${photo('plage-nyonie', { position: '40% center' })}<div class="voile"></div><div class="barre-story"><i></i><i></i><i></i></div>${logo({ couleur: BLANC, accent: CITRON, sousTitre: '', taille: 20 })}<p class="titre-post">Un week-end à <span style="color:${CITRON}">Nyonié</span></p><p class="sous-post" style="color:${BLANC}">Savane, plage, lodge partenaire.</p></div>
        <p class="mockup-legende">Story : même construction en 9:16 ; le logo seul en haut, le lieu en titre, un seul mot en vert citron.</p>
      </div>
      <div class="colonne" style="gap:10px">
        <div class="profil">
          <div class="profil-tete">${symbole({ taille: 84 })}<div><p style="font-family:var(--titrage);font-weight:600;font-size:18px">kaza.gabon</p><p style="font-size:13px;color:var(--gris-doc)">KAZA GABON – ÉCO TOURISME · Logement, séjour, expériences, services</p><div class="profil-stats"><span><b>—</b>publications</span><span><b>—</b>abonnés</span></div></div></div>
          <div class="profil-grille">
            <div class="post post--foret">${photo('baie-nyonie')}<div class="voile"></div><p class="titre-post" style="color:${BLANC}">Côtes</p></div>
            <div class="post post--citron"><p class="titre-post">Villa à Pointe-Denis</p></div>
            <div class="post post--foret">${photo('libreville-front')}<div class="voile"></div><p class="titre-post" style="color:${BLANC}">Libreville</p></div>
            <div class="post post--foret">${reliefs({ largeur: 300, hauteur: 160 }).replace('class="reliefs"', 'class="reliefs" style="position:absolute;left:0;right:0;bottom:0;width:100%;height:55%"')}<p class="titre-post" style="color:${BLANC}">Diaspora</p></div>
            <div class="post post--foret">${photo('mangrove-nyonie')}<div class="voile"></div><p class="titre-post" style="color:${BLANC}">Mangrove</p></div>
            <div class="post post--blanc"><p class="titre-post">Conciergerie</p></div>
          </div>
        </div>
        <p class="mockup-legende">Profil : le symbole en avatar ; une grille qui alterne photos voilées, aplats vert citron et blanc cassé. Rien de criard, un rythme.</p>
      </div>
    </div>
    ${credit('loango-elephants', 'plage-nyonie', 'baie-nyonie', 'libreville-front', 'mangrove-nyonie')}` }));

  /* 08 — carte de visite et signature */
  planches.push(planche({ section: S8, titre: 'Carte de visite et signature de courriel', sur: 'Papeterie', corps: `
    <div class="grille-3">
      <div class="colonne">
        <div class="carte-visite carte-visite--foret">${trajectoire({ largeur: 600, hauteur: 220 })}${logo({ couleur: BLANC, accent: CITRON, taille: 32 })}<p><b>Prénom Nom</b>Fonction · KAZA GABON<br>+241 00 00 00 00 · prenom@kaza.ga</p></div>
        <p class="mockup-legende">Recto : vert forêt, logo, trajectoire dans l’angle, coordonnées en blanc cassé.</p>
      </div>
      <div class="colonne">
        <div class="carte-visite carte-visite--blanc">${symbole({ taille: 54 })}<p><b>KAZA GABON – ÉCO TOURISME</b>Logement · Hébergement · Tourisme · Conciergerie · Diaspora<br>kaza.ga</p></div>
        <p class="mockup-legende">Verso : blanc cassé, symbole, les cinq pôles en une ligne, adresse du site. Format 85 × 55 mm, papier mat 350 g.</p>
      </div>
      <div class="colonne">
        <div class="signature-mail">${symbole({ taille: 70 })}<div><b>Prénom Nom</b><small>Fonction · KAZA GABON – ÉCO TOURISME</small><small>+241 00 00 00 00 · prenom@kaza.ga · kaza.ga</small></div></div>
        <p class="mockup-legende">Signature de courriel : symbole à gauche, trois lignes, aucune image lourde, aucune couleur hors charte. Les coordonnées sont des gabarits à remplacer.</p>
        <div class="bloc"><h4>Règle</h4><p>Sur tout support imprimé, le logo complet apparaît une fois, dans sa zone de protection ; le symbole remplace le logo sur les petits formats. Les domaines et numéros figurant ici sont des exemples.</p></div>
      </div>
    </div>` }));

  /* 08 — kakémono, affiche, autocollant */
  planches.push(planche({ section: S8, titre: 'Kakémono, affiche, autocollant partenaire', sur: 'Supports d’événement et de terrain', corps: `
    <div class="grille-4" style="grid-template-columns:1fr 1.4fr 1fr 1fr">
      <div class="colonne"><div class="kakemono">${photo('baie-nyonie', { position: '30% center' })}<div class="voile"></div>${logo({ couleur: BLANC, accent: CITRON, taille: 32 })}<p class="titre-affiche">Préparer.<br>Organiser.<br>Vivre<br>le Gabon.</p><div class="infos"><b>Logement · Séjour · Expériences · Services</b><span>kaza.ga</span></div></div><p class="mockup-legende">Kakémono 85 × 200 cm : photo en tête, voile vers le bas, titre en bas.</p></div>
      <div class="colonne"><div class="affiche">${photo('loango-elephants')}<div class="voile"></div>${logo({ couleur: BLANC, accent: CITRON, sousTitre: 'TOURISME', sousCouleur: CITRON, taille: 28 })}<p class="titre-affiche">Les parcs nationaux, guidés.</p><div class="infos"><b>Loango · Lopé · Pongara · Ivindo</b><span>Excursions avec des opérateurs partenaires vérifiés</span><span>kaza.ga</span></div></div><p class="mockup-legende">Affiche 50 × 70 cm : logo du pôle en haut à gauche, zone calme en bas.</p></div>
      <div class="colonne" style="justify-content:center;gap:24px">
        <div class="sticker sticker--citron">${symbole({ fond: CITRON, lettre: FORET, accent: FORET, tuile: false, taille: 60 })}<span>Partenaire<br>KAZA Vérifié</span></div>
        <div class="sticker sticker--foret">${symbole({ lettre: BLANC, accent: CITRON, tuile: false, taille: 60 })}<span>Logement<br>KAZA STAY</span></div>
        <p class="mockup-legende" style="text-align:center">Autocollants de porte et de vitrine pour les partenaires vérifiés, 8 cm.</p>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1"><h4>Règles des grands formats</h4><ul class="liste" style="font-size:15px"><li>Une photo réelle et nommée, jamais une image de banque.</li><li>Le voile vert forêt porte le texte ; le haut reste visible.</li><li>Un titre court en Outfit 600, une ligne d’information, l’adresse du site.</li><li>Deux éléments graphiques au maximum (logo + trajectoire, ou logo + toits).</li><li>Impression : vert forêt en quadri (C100 M69 J82 N78 indicatif) ou Pantone à faire valider sur épreuve.</li></ul></div>
      </div>
    </div>
    ${credit('baie-nyonie', 'loango-elephants')}` }));

  /* 08 — récapitulatif */
  const apps = ['Logo principal', 'Logo sur fond clair', 'Monochromes', 'Symbole et icône', 'Cinq logos de pôle', 'Trajectoire', 'Toits', 'Reliefs', 'Badge KAZA Vérifié', 'Publication', 'Story', 'Profil', 'Carte de visite', 'Signature de courriel', 'Kakémono', 'Affiche', 'Autocollants partenaires', 'Favicon'];
  const ou = ['02', '02', '02', '02', '02', '05', '05', '05', '05', '07', '07', '07', '08', '08', '08', '08', '08', '02'];
  planches.push(planche({ section: S8, titre: 'Les dix-huit applications, et où les trouver', corps: `
    <ol class="sommaire" style="grid-template-columns:repeat(3,1fr);gap:6px 40px">${apps.map((a, i) => `<li style="font-size:17px;padding:9px 0"><b>${String(i + 1).padStart(2, '0')}</b>${a}<small>chapitre ${ou[i]}</small></li>`).join('')}</ol>
    <p class="note" style="margin-top:18px">Les maquettes de cette charte fixent les règles ; les photos des partenaires et les supports réels les remplaceront au fil de la production. Les écrans de la plateforme feront l’objet d’un chapitre à part, une fois l’application conçue. Les supports non prévus ici (bâche, véhicule, uniforme) suivent les règles d’assemblage du chapitre 05.</p>` }));

  /* 09 — do / don't (1) */
  const generique = `<svg viewBox="0 0 120 90" style="width:60%" aria-hidden="true"><circle cx="92" cy="22" r="12" fill="#F2C94C"/><polygon points="0,90 40,30 70,70 85,52 120,90" fill="#2E8B57"/><polygon points="20,90 55,45 90,90" fill="#3CB371"/></svg>`;
  planches.push(planche({ section: S9, titre: 'À faire, à éviter (1/2)', corps: `
    <div class="oui-non">
      <div class="cas cas--oui"><div class="visuel" style="background:${FORET}">${logo({ couleur: BLANC, accent: CITRON, taille: 60 })}</div><p>Logo principal sur vert forêt, zone de protection respectée.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:${FORET}">${photo('mangrove-nyonie')}${logo({ couleur: BLANC, accent: CITRON, taille: 60 }).replace('class="logo"', 'class="logo" style="position:relative"')}</div><p>Logo posé sur une photo chargée, sans voile ni zone calme.</p></div>
      <div class="cas cas--oui"><div class="visuel post--foret" style="align-content:end;justify-items:start;padding:18px">${photo('plaine-nyonie')}<div class="voile" style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,41,27,.9),rgba(0,41,27,0) 70%)"></div><p class="enorme" style="color:${BLANC};position:relative;font-size:28px">Nyonié</p></div><p>Photo, voile vert forêt, titre dans la zone calme.</p></div>
      <div class="cas cas--non"><div class="visuel post--foret" style="place-items:center;padding:18px">${photo('plaine-nyonie')}${trajectoire({ largeur: 300, hauteur: 110 }).replace('class="trajectoire"', 'class="trajectoire" style="position:absolute;left:0;top:0;width:100%"')}${toits({ largeur: 300, hauteur: 40 }).replace('class="toits"', 'class="toits" style="position:absolute;left:0;right:0;bottom:0;width:100%"')}<p class="enorme" style="color:${CITRON};position:relative;font-size:28px;text-align:center;text-shadow:0 2px 4px #000">NYONIÉ</p></div><p>Pas de voile, deux motifs, titre vert citron ombré au centre.</p></div>
      <div class="cas cas--oui"><div class="visuel" style="background:${FORET}"><p class="enorme" style="color:${BLANC};font-size:34px;text-align:center">Vivre<br>le <span style="color:${CITRON}">Gabon</span>.</p></div><p>Vert citron pour un seul mot mis en évidence, sur vert forêt.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:${BLANC};border:1px solid #DCE3DF"><p style="color:${CITRON};font-family:var(--titrage);font-weight:600;font-size:22px;text-align:center">Réservez votre séjour dès maintenant</p></div><p>Texte vert citron sur blanc cassé : illisible.</p></div>
      <div class="cas cas--oui"><div class="visuel" style="background:${RELIEF}">${logo({ couleur: BLANC, accent: CITRON, sousTitre: 'STAY', sousCouleur: CITRON, taille: 60 })}</div><p>Un pôle, un logo, la ligne GABON remplacée par le nom du pôle.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:${RELIEF}">${logo({ couleur: BLANC, accent: CITRON, sousTitre: 'STAY · TOURISME', sousCouleur: CITRON, taille: 60 })}</div><p>Deux pôles sur le même logo.</p></div>
    </div>` }));

  /* 09 — do / don't (2) */
  planches.push(planche({ section: S9, titre: 'À faire, à éviter (2/2)', corps: `
    <div class="oui-non">
      <div class="cas cas--oui"><div class="visuel">${photo('savane-nyonie')}<p style="position:absolute;left:14px;bottom:12px;color:${BLANC};font-family:var(--titrage);font-weight:500;font-size:14px;text-shadow:0 1px 6px rgba(0,41,27,.9)">Savane de Nyonié</p></div><p>Une photo réelle du Gabon, lieu nommé.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:#E8F5E9">${generique}</div><p>Illustration générique qui ne représente pas le Gabon.</p></div>
      <div class="cas cas--oui"><div class="visuel" style="background:#fff;border:1px solid #DCE3DF">${badgeVerifie({ taille: 'grand' })}</div><p>Le badge KAZA Vérifié, une seule forme.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:#fff;border:1px solid #DCE3DF"><span class="badge-verifie badge-verifie--grand" style="background:#F2C94C;color:#7A4B00;border-radius:6px">★ Vérifié Premium</span></div><p>Badge recoloré, renommé, réinterprété.</p></div>
      <div class="cas cas--oui"><div class="visuel" style="background:${BLANC};border:1px solid #DCE3DF"><p class="enorme" style="font-size:34px;text-align:center">Trois nuits<br>à Loango.</p></div><p>Un titre court, Outfit 600, deux lignes.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:${BLANC};border:1px solid #DCE3DF"><p style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:26px;text-align:center;color:#2E8B57">Trois nuits de rêve<br><span style="font-family:Impact,sans-serif;font-style:normal;color:#C0392B">à LOANGO !!!</span></p></div><p>Polices étrangères, couleurs hors charte, superlatifs.</p></div>
      <div class="cas cas--oui"><div class="visuel" style="background:#fff;border:1px solid #DCE3DF;grid-template-columns:repeat(3,auto);gap:18px">${symbole({ taille: 48 })}${symbole({ taille: 32 })}${symbole({ taille: 24, rayon: 6 })}</div><p>Le symbole pour les petits formats.</p></div>
      <div class="cas cas--non"><div class="visuel" style="background:#fff;border:1px solid #DCE3DF">${logo({ couleur: FORET, accent: CITRON, taille: 12 })}</div><p>Le logo complet écrasé à 56 px : plus rien n’est lisible.</p></div>
    </div>
    ${credit('savane-nyonie')}` }));

  /* fin */
  planches.push(`<section class="planche planche--citron" data-section="Fin">
  <header class="planche-tete"><span class="planche-section">Fichiers livrés</span><span class="planche-marque">KAZA GABON · Charte graphique</span><span class="planche-num" data-num></span></header>
  <div class="planche-titre"><h2>Tout ce qu’il faut pour produire</h2></div>
  <div class="planche-corps grille-2">
    <div class="colonne">
      <div class="bloc" style="background:rgba(247,248,244,.55);border-color:rgba(0,41,27,.2);flex:1">
        <h3>Fichiers livrés avec cette charte</h3>
        <ul class="liste">
          <li><b>logos/</b> : logo principal (blanc cassé, vert forêt), monochromes, mot seul, symbole (tuiles et sans tuile), cinq logos de pôle en deux versions, en SVG avec la police Outfit embarquée.</li>
          <li><b>charte/</b> : ce document (HTML hors ligne) et sa version PDF.</li>
          <li><b>charte/assets/fonts/</b> : Outfit et Plus Jakarta Sans (licence SIL Open Font License), prêtes pour les supports à venir.</li>
          <li><b>charte/assets/photos/</b> : les photographies de référence et leur fichier de crédits (auteur, licence, source).</li>
          <li><b>source/</b> : le générateur du document ; on modifie les sources, jamais le HTML à la main.</li>
        </ul>
        <p class="note" style="color:${FORET}">Les SVG embarquent la police pour s’afficher partout ; pour la broderie et la signalétique, faire vectoriser GABON et les noms de pôles par le prestataire à partir de ces fichiers. Le fichier source du logo d’origine, s’il existe, reste à réclamer à son auteur.</p>
      </div>
    </div>
    <div class="colonne" style="justify-content:space-between">
      ${logo({ couleur: FORET, accent: FORET, taille: 100 })}
      <div><p class="enorme" style="font-size:60px">Préparer.<br>Organiser.<br>Vivre le Gabon.</p><p style="margin-top:14px">Libreville, Gabon · version 1.0 · novembre 2026</p></div>
    </div>
  </div>
</section>`);

  /* crédit et co-branding */
  planches.push(`<section class="planche" data-section="Crédit">
  <header class="planche-tete"><span class="planche-section">Une charte signée MÉTHODE AURA</span><span class="planche-marque">KAZA GABON · Charte graphique</span><span class="planche-num" data-num></span></header>
  <div class="planche-titre"><p class="planche-sur">Collaboration</p><h2>Réalisée par MÉTHODE AURA</h2></div>
  <div class="planche-corps colonne" style="justify-content:space-between">
    <div class="partenariat" style="flex:1">
      ${logo({ couleur: FORET, accent: CITRON, taille: 100 })}
      <span class="croix" aria-hidden="true">×</span>
      ${logoAura({ couleur: '#0B0B0D' })}
    </div>
    <div class="credit">
      <div>
        <p class="signature">KAZA GABON × MÉTHODE AURA</p>
        <p style="margin-top:10px">Cette charte graphique a été conçue et réalisée par MÉTHODE AURA, studio de marque, à partir des références visuelles et du cahier des charges fournis par la fondatrice de KAZA : reconstruction vectorielle du logo, système graphique, typographie, réseaux sociaux, supports imprimés et direction photographique.</p>
      </div>
      <div style="text-align:right">
        <p class="signature">Du concept à l’impact.</p>
        <p class="note" style="margin-top:10px">Version 1.0 · novembre 2026 · Libreville, Gabon. Les logos et polices de MÉTHODE AURA restent la propriété du studio ; ceux de KAZA sont livrés à la marque. Photographies : Wikimedia Commons, auteurs et licences indiqués sur chaque planche.</p>
      </div>
    </div>
  </div>
</section>`);

  return planches;
}
