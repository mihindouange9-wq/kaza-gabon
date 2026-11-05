/* 03 Couleurs, 04 Typographie, 05 Système graphique, 06 Photographie. */
import { planche, logo, symbole, trajectoire, toits, reliefs, badgeVerifie, photo, credit, cmyk, rgb, contraste, FORET, CITRON, BLANC, GRIS, RELIEF } from '../lib.mjs';

const S3 = '03 — Couleurs', S4 = '04 — Typographie', S5 = '05 — Système graphique', S6 = '06 — Photographie';
export default function () {
  const planches = [];

  /* 03 — palette */
  const val = (hex) => `<div class="valeurs"><span><b>HEX</b>${hex}</span><span><b>RGB</b>${rgb(hex)}</span><span><b>CMJN (indicatif)</b>${cmyk(hex)}</span></div>`;
  planches.push(planche({ section: S3, titre: 'Quatre couleurs, extraites des références de la fondatrice', sur: 'Palette chromatique', corps: `
    <div class="pastilles">
      <div class="pastille pastille--foret"><div><p class="etiquette">01 · Dominante</p><h3>Vert forêt</h3><p style="margin-top:10px;max-width:34ch">Fonds, navigation, grands aplats, identité principale. La profondeur de la forêt gabonaise ; le calme et le sérieux de la marque.</p></div><div><p class="part">55 %</p>${val(FORET)}</div></div>
      <div class="pastille pastille--citron"><div><p class="etiquette">02 · Accent</p><h3>Vert citron</h3><p style="margin-top:10px">Boutons d’action, liens importants, icônes, indicateurs actifs, mots mis en évidence, toits du logo.</p></div><div><p class="part">10 %</p>${val(CITRON)}</div></div>
      <div class="pastille pastille--blanc"><div><p class="etiquette">03 · Clarté</p><h3>Blanc cassé</h3><p style="margin-top:10px">Textes sur fond sombre, surfaces claires, fonds de pages et de fiches, cartes.</p></div><div><p class="part">30 %</p>${val(BLANC)}</div></div>
      <div class="pastille pastille--gris"><div><p class="etiquette">04 · Discret</p><h3>Vert gris</h3><p style="margin-top:10px">Textes secondaires sur fond sombre, bordures, séparateurs, états désactivés, légendes.</p></div><div><p class="part">5 %</p>${val(GRIS)}</div></div>
    </div>` }));

  /* 03 — combinaisons */
  const combi = (fond, texte, nom) => { const c = contraste(fond, texte); const ok = c >= 4.5; return `<div class="combinaison" style="background:${fond};color:${texte};border-color:${fond === BLANC ? '#DCE3DF' : fond}"><p class="grand">${nom}</p><small>Texte ${texte} sur ${fond}</small><p class="verdict">Contraste ${String(c).replace('.', ',')}:1 · ${ok ? 'texte courant autorisé' : c >= 3 ? 'grands titres seulement' : 'pas de texte'}</p></div>`; };
  planches.push(planche({ section: S3, titre: 'Combinaisons et contrastes', sur: 'Ce qui se lit, ce qui ne se lit pas', corps: `
    <div class="grille-2-1">
      <div class="colonne">
        <div class="combinaisons">
          ${combi(FORET, BLANC, 'Blanc cassé sur vert forêt')}${combi(FORET, CITRON, 'Vert citron sur vert forêt')}${combi(FORET, GRIS, 'Vert gris sur vert forêt')}${combi(CITRON, FORET, 'Vert forêt sur vert citron')}
          ${combi(BLANC, FORET, 'Vert forêt sur blanc cassé')}${combi(BLANC, GRIS, 'Vert gris sur blanc cassé')}${combi(BLANC, CITRON, 'Vert citron sur blanc cassé')}${combi(GRIS, FORET, 'Vert forêt sur vert gris')}
        </div>
        <div class="repartition"><div style="flex:55;background:${FORET};color:${BLANC}">Vert forêt · 55 %</div><div style="flex:30;background:${BLANC};color:${FORET};border:1px solid #DCE3DF">Blanc cassé · 30 %</div><div style="flex:10;background:${CITRON};color:${FORET}">10 %</div><div style="flex:5;background:${GRIS};color:${FORET}">5</div></div>
        <p class="legende">Répartition indicative d’un écran ou d’un support : le vert forêt structure, le blanc cassé aère et porte le texte, le vert citron déclenche l’action, le vert gris sépare. Un support majoritairement vert citron est réservé aux temps forts (lancement, promotion, événement).</p>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Règles</h3>
          <ul class="liste">
            <li>Le vert citron ne porte jamais de texte sur fond clair, et aucun texte ne se pose en vert citron sur blanc cassé : c’est une couleur d’action et d’accent, lue sur le vert forêt.</li>
            <li>Le vert gris sur blanc cassé ne suffit pas pour du texte (2,2:1) : sur fond clair, il sert aux bordures, aux icônes inactives et aux séparateurs ; le texte secondaire y est en vert forêt à 70 % d’opacité.</li>
            <li>Pas de cinquième couleur, pas de dégradé entre couleurs. Une seule nuance dérivée est admise pour les fonds : le <b>vert relief</b> ${RELIEF} (vert forêt + 10 % de vert citron), pour les cartes posées sur vert forêt et les reliefs du système graphique.</li>
            <li>Les voiles sur photo sont toujours en vert forêt, de 0 à 95 % d’opacité, jamais noirs ni colorés.</li>
            <li>Les couleurs d’état (réussite, erreur), si un support en a besoin, restent hors de la communication : vert citron pour la réussite, un rouge brique sobre réservé aux erreurs.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 04 — Outfit */
  planches.push(planche({ section: S4, titre: 'Outfit, la voix des titres', sur: 'Typographie principale', corps: `
    <div class="grille-2-1">
      <div class="colonne">
        <p class="alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        <p class="alphabet" style="font-weight:500">abcdefghijklmnopqrstuvwxyz</p>
        <p class="alphabet" style="font-weight:300">0123456789 &amp; ! ? € FCFA → « » @</p>
        <div class="specimen">
          <div class="ligne"><small>600 · SemiBold</small><p style="font-family:var(--titrage);font-weight:600;font-size:30px">Votre séjour commence ici.</p></div>
          <div class="ligne"><small>500 · Medium</small><p style="font-family:var(--titrage);font-weight:500;font-size:30px">Villa à Pointe-Denis, 4 voyageurs</p></div>
          <div class="ligne"><small>300 · Light</small><p style="font-family:var(--titrage);font-weight:300;font-size:30px">Libreville, Gabon</p></div>
        </div>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Pourquoi Outfit</h3>
          <p>Une géométrique contemporaine, aux capitales larges et aux formes rondes, qui prolonge le dessin des lettres KAZA. Elle compose la ligne GABON du logo, les noms des pôles, les titres, les boutons et les étiquettes.</p>
          <h4 style="margin-top:8px">Réglages</h4>
          <ul class="liste">
            <li>Titres en 600, approche −1,5 %, interlignage 1,05 à 1,1. Jamais en 700 : la marque reste légère.</li>
            <li>Capitales espacées (+8 à +14 %) réservées aux noms de pôles et aux étiquettes courtes.</li>
            <li>Jamais en dessous de 13 px à l’écran.</li>
            <li>Police libre (licence SIL OFL), fournie dans le dossier des polices.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 04 — Plus Jakarta Sans + hiérarchie */
  planches.push(planche({ section: S4, titre: 'Plus Jakarta Sans pour lire, et une hiérarchie en six niveaux', sur: 'Typographie secondaire et échelle', corps: `
    <div class="grille-2">
      <div class="colonne">
        <p class="alphabet alphabet--texte">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
        <div class="bloc" style="flex:1">
          <h3>Plus Jakarta Sans</h3>
          <p>Descriptions de logements et d’expériences, conditions, prix, messages, notifications, formulaires, mentions légales. Très lisible à petite taille sur mobile, chaleureuse sans être ronde.</p>
          <ul class="liste">
            <li>Corps de texte 16 à 17 px, interlignage 1,55 ; 14 px minimum pour les mentions, 13 px pour les légendes.</li>
            <li>Graisses : 400 pour le texte, 500 pour les libellés, 600 pour les prix et les mises en avant.</li>
            <li>Chiffres tabulaires pour les prix, les dates et les récapitulatifs.</li>
            <li>Pas d’italique dans l’interface ; l’italique est réservé aux citations dans les contenus éditoriaux.</li>
          </ul>
        </div>
      </div>
      <div class="colonne echelle">
        <div class="specimen">
          <div class="ligne"><small>T1 · 72 / 1 · Outfit 600</small><p class="t1">Loango</p></div>
          <div class="ligne"><small>T2 · 44 / 1,05 · 600</small><p class="t2">Trois nuits au bord de la lagune</p></div>
          <div class="ligne"><small>T3 · 26 / 1,2 · 500</small><p class="t3">Villa entière · 4 voyageurs · 2 chambres</p></div>
          <div class="ligne"><small>T4 · 17 / 1,55 · Jakarta 400</small><p class="t4">Le récapitulatif détaille le prix, les frais éventuels, les conditions d’annulation et le montant total avant tout paiement.</p></div>
          <div class="ligne"><small>T5 · 14 / 1,5 · Jakarta 400</small><p class="t5">Réservation soumise à la validation du partenaire sous 24 heures.</p></div>
          <div class="ligne"><small>T6 · 13 · Outfit 600</small><p class="t6">KAZA STAY · Vérifié · Nouveau</p></div>
        </div>
      </div>
    </div>` }));

  /* 04 — en situation */
  planches.push(planche({ section: S4, titre: 'La typographie en situation', corps: `
    <div class="grille-3">
      <div class="bloc bloc--foret" style="justify-content:space-between">
        <div><p class="etiquette">Bannière</p><p class="enorme" style="color:${BLANC};font-size:64px;margin-top:10px">Vivre<br>le Gabon.</p></div>
        <div><p style="font-family:var(--titrage);font-weight:500;font-size:22px;color:${CITRON}">Logement, séjour, expériences, services</p><p style="font-size:15px;opacity:.85;margin-top:6px;color:${GRIS}">Un seul compte pour tout préparer, tout réserver, tout suivre.</p></div>
      </div>
      <div class="bloc">
        <p class="etiquette">Fiche descriptive</p>
        <h3 style="font-size:28px">Villa Pointe-Denis</h3>
        <p style="font-size:15px;color:var(--gris-doc)">Villa entière · 4 voyageurs · 2 chambres · plage à 50 m</p>
        <p style="font-size:16px">Terrasse face à la mer, cuisine équipée, groupe électrogène, transfert en bateau organisé par KAZA CONCIERGERIE.</p>
        <p style="font-family:var(--titrage);font-weight:600;font-size:30px;font-variant-numeric:tabular-nums">85 000 <span style="font-size:15px;font-weight:500;color:var(--gris-doc)">FCFA / nuit</span></p>
        <p class="note">Prix d’exemple pour la mise en page, à remplacer par les tarifs réels des partenaires.</p>
        <div>${badgeVerifie()}</div>
      </div>
      <div class="bloc bloc--citron" style="justify-content:space-between">
        <div><p class="etiquette">Temps fort</p><p class="enorme" style="font-size:60px;margin-top:10px">Les parcs<br>nationaux</p></div>
        <div><p style="font-family:var(--titrage);font-weight:600;font-size:18px">Loango · Lopé · Pongara · Ivindo</p><p style="font-size:15px;margin-top:4px">Excursions guidées avec des opérateurs partenaires, du vendredi au dimanche.</p></div>
      </div>
    </div>` }));

  /* 05 — trajectoire */
  planches.push(planche({ section: S5, titre: 'La trajectoire : le départ, le retour, le lien', sur: 'Système graphique · élément 1', sombre: true, corps: `
    <div class="grille-2-1">
      <div class="logo-cadre" style="background:${RELIEF};padding:60px">${trajectoire({ largeur: 900, hauteur: 330 })}</div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Principe</h3>
          <p>L’arc du logo, agrandi et prolongé : un trait vert citron qui part du bas à gauche, monte vers la droite et se termine en pointillé sous l’avion. Il raconte le voyage avant le voyage, le retour au pays, la liaison entre les pôles.</p>
          <h4 style="margin-top:8px">Règles</h4>
          <ul class="liste">
            <li>Toujours montante de gauche à droite, comme dans le logo ; jamais descendante, jamais en boucle.</li>
            <li>Un trait plein puis un pointillé ; épaisseur de 3 à 6 px selon le format ; l’avion à l’extrémité, en blanc cassé.</li>
            <li>Une seule trajectoire par support, dans la moitié haute ou le long d’un bord ; elle ne traverse jamais un texte ni un visage.</li>
            <li>Vert citron sur vert forêt ou sur photo voilée ; vert forêt sur blanc cassé ou vert citron.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 05 — toits et reliefs */
  planches.push(planche({ section: S5, titre: 'Toits et reliefs : le rythme du A, la ligne du paysage', sur: 'Système graphique · éléments 2 et 3', corps: `
    <div class="grille-2">
      <div class="colonne">
        <div class="logo-cadre logo-cadre--foret" style="flex:1;padding:40px;grid-template-rows:auto auto;gap:36px">${toits({ largeur: 700, hauteur: 90, n: 11 })}${toits({ largeur: 700, hauteur: 90, n: 11, plein: false, graine: 9 })}</div>
        <div class="bloc"><h4>Les toits</h4><p>Une rangée de triangles au rythme du A, pleins ou en trait, de hauteurs variées comme une ligne de toits ou de cimes. Bordure basse d’un support, séparateur entre deux sections, fond d’une bannière. Jamais sous du texte, jamais plus de 25 % de la hauteur.</p></div>
      </div>
      <div class="colonne">
        <div class="logo-cadre logo-cadre--foret" style="flex:1;padding:0;overflow:hidden;align-items:end">${reliefs({ largeur: 700, hauteur: 260 })}</div>
        <div class="bloc"><h4>Les reliefs</h4><p>Deux lignes de collines boisées, en vert relief et en vert gris léger, posées en bas d’un fond vert forêt : la silhouette du paysage gabonais sans illustration ni dessin figuratif. Réservés aux fonds d’écrans d’accueil, de couvertures et de stories ; ils laissent toujours le tiers haut libre pour le texte.</p></div>
      </div>
    </div>` }));

  /* 05 — badge KAZA Vérifié */
  planches.push(planche({ section: S5, titre: 'Le badge KAZA Vérifié : une seule forme, un seul sens', sur: 'Système graphique · élément 4', corps: `
    <div class="grille-2-1">
      <div class="colonne">
        <div class="logo-cadre logo-cadre--foret" style="flex:1;grid-template-rows:auto auto;gap:34px;align-content:center">
          ${badgeVerifie({ taille: 'geant' })}
          <div style="display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap">${badgeVerifie({ taille: 'grand' })}${badgeVerifie()}<span class="pastille-ui" style="background:${RELIEF};color:${GRIS};border:1px solid ${GRIS}">Vérification en cours</span></div>
        </div>
        <div class="logo-cadre logo-cadre--blanc" style="padding:26px;grid-template-columns:repeat(3,auto);gap:30px;justify-content:center">${badgeVerifie({ taille: 'grand' })}${badgeVerifie()}<span class="pastille-ui">Vérification en cours</span></div>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Ce qu’il veut dire</h3>
          <p>Le profil, les documents et les informations du bien ou du partenaire ont été contrôlés par l’équipe KAZA selon la procédure de vérification. C’est la promesse de confiance de la marque ; il distingue ce qui est vérifié de ce qui ne l’est pas.</p>
          <h4 style="margin-top:8px">Règles</h4>
          <ul class="liste">
            <li>Une seule forme : pastille arrondie vert citron, coche dans un disque vert forêt, texte « KAZA Vérifié » en Outfit 600. Identique sur fond sombre et sur fond clair.</li>
            <li>Jamais recoloré, renommé, décliné (« Premium », « Gold ») ni posé sur un bien ou un partenaire non vérifié.</li>
            <li>L’état intermédiaire s’écrit « Vérification en cours », en pastille vert forêt discrète, jamais en vert citron.</li>
            <li>Il accompagne les autocollants partenaires, les fiches imprimées, les affiches et, plus tard, les annonces de la plateforme ; les critères d’attribution sont fixés par la fondatrice.</li>
          </ul>
        </div>
      </div>
    </div>` }));

  /* 05 — compositions */
  planches.push(planche({ section: S5, titre: 'Compositions : la photo d’abord, la marque ensuite', sur: 'Règles d’assemblage', corps: `
    <div class="grille-2">
      <div class="grille-2" style="gap:16px">
        <div class="compo compo--foret">${photo('plaine-nyonie')}<div class="voile"></div><p class="titre-compo" style="color:${BLANC}">La plaine de Nyonié, à deux heures de Libreville.</p></div>
        <div class="compo compo--foret">${trajectoire({ largeur: 600, hauteur: 220 })}<p class="titre-compo" style="color:${BLANC}">Préparer<br>son retour.</p></div>
        <div class="compo compo--citron">${toits({ largeur: 600, hauteur: 70, n: 10, graine: 5, couleur: FORET })}<p class="titre-compo" style="bottom:auto;top:24px">Villa à Pointe-Denis</p></div>
        <div class="compo compo--foret">${reliefs({ largeur: 600, hauteur: 220 })}<p class="titre-compo" style="color:${BLANC};bottom:auto;top:24px">Vivre le Gabon.</p></div>
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1;gap:14px">
          <h3>Règles d’assemblage</h3>
          <div class="regle"><b>1</b><p>Une grande photo du Gabon quand on en a une vraie ; sinon un aplat vert forêt avec un seul élément graphique (trajectoire, toits ou reliefs).</p></div>
          <div class="regle"><b>2</b><p>Sur photo, un voile vert forêt monte du bas pour porter le texte ; le haut de l’image reste visible.</p></div>
          <div class="regle"><b>3</b><p>Le texte occupe la zone calme, en Outfit 600 ; le logo ou le symbole se pose dans un angle, dans sa zone de protection.</p></div>
          <div class="regle"><b>4</b><p>Un seul élément graphique par support ; deux sur les grands formats (kakémono, bâche, écran d’accueil).</p></div>
          <div class="regle"><b>5</b><p>Le vert citron apparaît une fois : le bouton, le mot clé ou la trajectoire. Pas les trois.</p></div>
          <div class="regle"><b>6</b><p>Les motifs sont livrés en vectoriel ; on les recadre, on ne les déforme pas, on ne les recolore pas.</p></div>
        </div>
        ${credit('plaine-nyonie')}
      </div>
    </div>` }));

  /* 06 — direction photo */
  const cadre = (slug, titre, texte, position = 'center') => `<div class="cadre-photo">${photo(slug, { position })}<p class="photo-legende">${titre}<small>${texte}</small></p></div>`;
  planches.push(planche({ section: S6, titre: 'Le Gabon réel, en grand', sur: 'Direction photographique', corps: `
    <div class="grille-2-1">
      <div class="grille-photos">
        ${cadre('baie-nyonie', 'Côtes et lagunes', 'Baie de Nyonié, vue de la forêt', '55% center')}
        ${cadre('loango-lodge', 'Hébergements réels', 'Lodge du parc national de Loango')}
        ${cadre('loango-elephants', 'Faune et parcs', 'Éléphants, parc national de Loango')}
        ${cadre('libreville-front', 'La ville', 'Front de mer de Libreville')}
        ${cadre('mangrove-nyonie', 'Nature', 'Mangrove de Nyonié')}
        ${cadre('plage-nyonie', 'Lumière', 'Plage de Nyonié au coucher du soleil')}
      </div>
      <div class="colonne">
        <div class="bloc" style="flex:1">
          <h3>Ce qu’on photographie</h3>
          <p>De grandes photographies du Gabon : paysages, forêts, côtes, lagunes, parcs, villes, hébergements et expériences réels. Les lieux sont nommés. Les logements montrés sont ceux des partenaires, photographiés sur place ; les expériences, celles qui sont réellement proposées.</p>
          <h4 style="margin-top:8px">Ce qu’on évite</h4>
          <p>Banques d’images génériques et illustrations qui ne représentent pas le Gabon, retouches lisses, filtres colorés, ciels remplacés, photos de logements trompeuses, visages sans autorisation.</p>
          <p class="note">Les images de cette charte proviennent de Wikimedia Commons sous licences libres, avec crédit obligatoire (ci-dessous) ; elles servent de référence de direction. La plateforme utilisera ses propres prises de vues et celles de ses partenaires.</p>
        </div>
      </div>
    </div>
    ${credit('baie-nyonie', 'loango-lodge', 'loango-elephants', 'libreville-front', 'mangrove-nyonie', 'plage-nyonie')}` }));

  /* 06 — cadrage, lumière, traitement */
  planches.push(planche({ section: S6, titre: 'Cadrage, lumière, traitement', corps: `
    <div class="grille-3">
      <div class="colonne"><div class="cadre-photo" style="flex:1">${photo('riviere-nyonie')}<p class="photo-legende">Vue aérienne, rivière de Nyonié</p></div><div class="bloc"><p class="etiquette">Cadrage</p><h3 style="font-size:20px">Large, horizontal, une zone calme</h3><ul class="liste" style="font-size:15px"><li>Vues larges et aériennes pour les lieux ; plans moyens pour les logements, détails pour les équipements.</li><li>Formats : 16:9 et 3:2 pour le site, 4:5 et 9:16 pour les réseaux, carré pour les vignettes.</li><li>Laisser du ciel, de l’eau ou un mur uni pour poser un titre.</li></ul></div></div>
      <div class="colonne"><div class="cadre-photo" style="flex:1">${photo('plage-nyonie')}<p class="photo-legende">Lumière de fin de journée, Nyonié</p></div><div class="bloc"><p class="etiquette">Lumière</p><h3 style="font-size:20px">Naturelle, tôt ou tard dans la journée</h3><ul class="liste" style="font-size:15px"><li>Lumière du matin ou de fin d’après-midi ; midi seulement pour les vues aériennes.</li><li>Intérieurs : lumière du jour, rideaux ouverts, pas de flash direct.</li><li>Nuit : réservée à la ville, sans néons dominants.</li></ul></div></div>
      <div class="colonne"><div class="cadre-photo" style="flex:1">${photo('libreville-mer')}<p class="photo-legende">Libreville, bord de mer</p></div><div class="bloc"><p class="etiquette">Traitement</p><h3 style="font-size:20px">Couleurs vraies, verts profonds</h3><ul class="liste" style="font-size:15px"><li>Contraste modéré, blancs propres, verts riches sans saturation artificielle.</li><li>Pas de filtre orangé ni de teinte froide ; pas de vignettage.</li><li>Le voile vert forêt est le seul traitement de marque, appliqué dans les gabarits, jamais dans la photo.</li></ul></div></div>
    </div>
    ${credit('riviere-nyonie', 'plage-nyonie', 'libreville-mer')}` }));

  return planches;
}
