# Design

Monde visuel établi par la charte graphique KAZA (`charte/`, 32 planches, novembre 2026, réalisée par MÉTHODE AURA). Ce fichier en est le résumé opérationnel pour tout écran ou support ; en cas de doute, la charte prime.

## Direction

Premium, naturelle, tropicale, élégante, épurée, immersive. Le vert forêt structure, le blanc cassé porte les contenus, le vert citron déclenche l'action (une fois par écran), le vert gris sépare. Les photos du Gabon sont réelles et nommées ; sur une photo, seul un voile vert forêt porte le texte. Pas de dégradé entre couleurs, pas d'illustration générique, pas d'ombre dure.

## Jetons

```css
--foret: #00291B;      /* dominante : fonds, navigation, grands aplats */
--citron: #C7F974;     /* accent : action principale, mot mis en évidence, toits du logo */
--blanc: #F7F8F4;      /* clarté : surfaces, texte sur fond sombre */
--gris: #9AAFA4;       /* discret : texte secondaire sur fond sombre, bordures, séparateurs */
--relief: #143A2B;     /* seule nuance dérivée : cartes sur vert forêt, reliefs */
--encre-2: rgba(0,41,27,.72);  /* texte secondaire sur fond clair (le vert gris ne suffit pas : 2,2:1) */
--filet: #DCE3DF;      /* filets sur fond clair */
--surface: #FFFFFF;    /* cartes sur blanc cassé */
--ombre: 0 18px 40px -22px rgba(0,41,27,.35);
--rayon-carte: 16px; --rayon-champ: 12px; --rayon-bouton: 999px;
--titrage: "Outfit"; --texte: "Plus Jakarta Sans";
```

Contrastes mesurés : blanc cassé / vert forêt 14,8 ; vert citron / vert forêt 12,9 ; vert gris / vert forêt 6,8 ; vert forêt / vert citron 12,9 ; vert forêt / blanc cassé 14,8. Interdits : vert citron sur blanc cassé (1,1), vert gris sur blanc cassé pour du texte (2,2).

## Typographie

Outfit 600 pour les titres (jamais 700), approche −1,5 %, interlignage 1,05 à 1,1 ; capitales espacées (+8 à +14 %) réservées aux noms de pôles et aux étiquettes courtes. Plus Jakarta Sans 400 / 500 / 600 pour le texte, 16 à 17 px, interlignage 1,55 ; 14 px minimum pour les mentions, 13 px pour les légendes ; chiffres tabulaires pour les prix et les dates. Échelle : T1 72 / T2 44 / T3 26 / T4 17 / T5 14 / T6 13.

## Signes de la marque

- **Logo** : KAZA + toits vert citron + trajectoire + avion + ligne GABON (ou nom du pôle). Zone de protection = hauteur du toit. Minimum 160 px (complet), 120 px (mot seul), sinon le symbole (le A sur tuile, rayon 22 %).
- **Trajectoire** : arc vert citron montant de gauche à droite, trait plein puis pointillé, avion à l'extrémité ; une seule par support, jamais sur du texte.
- **Toits** : rangée de triangles au rythme du A ; bordure, séparateur, fond de bannière ; jamais sous du texte, 25 % de la hauteur au plus.
- **Reliefs** : deux lignes de collines (vert relief, vert gris à 18 %) en bas des fonds vert forêt ; tiers haut libre pour le texte.
- **Badge KAZA Vérifié** : pastille vert citron, coche dans un disque vert forêt, Outfit 600 ; une seule forme ; état intermédiaire « Vérification en cours » en pastille vert forêt.

## Composants (vitrine)

Boutons pilule (hauteur 48 px, 44 minimum sur mobile) : principal vert citron sur fond sombre, vert forêt sur fond clair ; secondaire en contour ; un seul plein par écran. Cartes à bordure 1 px filet, rayon 16 px, photo 4:3 en haut, ombre douce avec décalage au survol. Champs à bordure vert gris, rayon 12 px, libellé au-dessus, état actif vert forêt. Icônes linéaires trait 1,8 px, coins ronds, une seule famille. Transitions 150 à 300 ms, sortie exponentielle, pas de rebond.

## Sobriété (vitrine, 6 nov. 2026 : retrait des marqueurs d'interface générée)

Règles ajoutées à la demande du client (« retirer tout ce qui s'apparente à une interface IA ») : pas de carte « tuile-icône + titre + texte » en série (les listes s'organisent en colonnes ou rangées séparées par des filets, avec un numéral Outfit 300 quand un ordre existe) ; pas de sur-titre avec tiret ni d'icône devant les noms de section (le nom du pôle seul, Outfit 500, capitales espacées à 8 %) ; pas de pastille numérotée (numéraux nus, 01 02 03) ; pas de puces-pastilles pour des listes d'attributs (texte séparé par « · ») ; pas de brillance ni de soulèvement au survol (les boutons foncent, les cartes changent de bordure, les titres de liste se soulignent) ; pas de verre dépoli ni de flou (en-tête vert forêt plein, fond du panneau teinté sans flou, révélations sans flou) ; légendes photo en rectangle vert forêt plein. Les icônes des pôles restent dans la navigation, le menu, le dock et les onglets de recherche uniquement. Conservé car imposé par le cahier des charges : boutons arrondis vert citron, Outfit et Plus Jakarta Sans, badge KAZA Vérifié.

## Parcours (vitrine, 6 nov. 2026)

Une question à l'entrée, une action par bouton, un seul endroit pour demander. Références : Airbnb (onglets Logements / Expériences au-dessus de la recherche, panneau de réservation qui s'ouvre sur place), Booking (« que cherchez-vous ? » avant tout), GetYourGuide / Evaneos (demande guidée pour un séjour sur mesure).

- **Onglets de recherche** : pilules Outfit 600 13 px espacées, icône du pôle + nom du pôle + sous-titre en langage courant (Plus Jakarta 13 px) ; actif = vert forêt plein, texte blanc cassé, sous-titre vert gris ; rangée défilante sur téléphone avec fondu de 40 px sur le bord où il reste des onglets. Les champs changent avec l'onglet ; un seul bouton vert citron dont le libellé dit l'action (« Voir les hébergements », « Demander ce service », « Préparer mon retour »).
- **Panneau de demande** : tiroir de 520 px à droite sur ordinateur (fond vert forêt à 60 %, sans flou), plein écran sur téléphone ; en-tête avec nom du pôle (12 px espacé), titre Outfit 600 22 px, croix et retour en pastilles de 44 px ; corps défilant seul ; pied collant avec le bouton d'envoi vert citron pleine largeur et une mention 13 px. Résumé de l'objet choisi : vignette 72 × 54, type en capitales espacées, titre, lieu, « Changer ». Écran de choix : cinq rangées séparées par des filets vert gris (nom du pôle 12 px espacé, titre 18 px, sous-titre 14 px, flèche), survol = titre souligné. Écran final : titre 26 px, bloc vert citron, bouton « Ouvrir WhatsApp », les deux étapes suivantes.
- **Segment Louer / Acheter** : deux cases dans un cadre vert gris, l'active en vert forêt plein.
- **Services** : liste en deux colonnes séparée par des filets vert gris, chaque ligne est un bouton (nom 18 px, phrase 14 px, flèche), survol = nom souligné et flèche décalée.
- **Pôles** : index en cinq colonnes séparées par des filets, numéral 01–05 Outfit 300 vert citron, « KAZA » en vert gris, nom du pôle, phrase, action ; sur téléphone, une liste à filets avec le numéral en marge.
- **Comment ça marche** : bande vert citron, titre à gauche, trois colonnes à filet haut avec numéraux 1 2 3 Outfit 300 40 px, un bouton vert forêt « Réserver maintenant ».

## Héros immersif (vitrine, 5 nov. 2026)

Référence : sites de voyage plein écran (fitzroy-travel.com), transposée sans quitter la charte. Triptyque des trois photos fournies par KAZA sur ordinateur (panneau actif éclairé, les autres à 74 % de luminosité, rotation toutes les 4,6 s, survol = actif), diaporama plein écran sur téléphone (fondu 1,1 s, zoom lent, balayage). Voile vert forêt : fort à gauche et en bas, léger en haut (sous l'en-tête transparent). Accroche en Outfit 600 de 44 à 108 px, approche −3 %, « le Gabon » en vert citron ; eyebrow 14 px espacé à 20 % avec trait ; « Faire défiler » 13 px espacé avec ligne animée ; légende photo (icône appareil) + compteur 01 / 03 en vert citron. Bande de recherche blanche flottante à cheval sur le bas du héros, sur fond vert forêt. Légendes limitées à ce que la photo montre.

## Mouvement

Deux niveaux. Sans JavaScript ou avec `prefers-reduced-motion` : tout est visible, rien ne bouge (en-tête collant opaque). Avec la couche d'effets (`effets.js`) : intro à chaque chargement de la page (le logo s'écrit, les toits s'allument, l'avion part, rideau 0,95 s), défilement fluide Lenis (lerp 0,085), en-tête fixe transparent qui devient verre dépoli après 60 px et se range quand on descend, titres révélés mot à mot (masques, sortie exponentielle 1,15 s, décalage 40 ms), révélations 44 px + flou 10 px sur pointeur fin, rideaux clip-path sur les photos avec zoom 1,16 → 1, parallaxes de 5 à 9 % toujours rognées par leur conteneur, galerie TOURISME épinglée à l'horizontale avec avion et compteur (≥ 1100 px), fil de vol pointillé dans la marge droite (≥ 1300 px, vert citron sur sombre, vert forêt sur clair), tampon KAZA Vérifié en retour élastique, avion qui décolle à l'envoi d'un formulaire, matière liquide au pointeur sur la photo de plage (WebGL, ordinateur, abandon propre sans WebGL). Pas de curseur personnalisé, pas de défilé de texte, un seul épinglage par page.

## Surfaces du navigateur

Sélection de texte vert citron sur vert forêt, caret vert forêt, focus visible en anneau vert citron (3 px) sur fond sombre et vert forêt sur fond clair, soulignement décalé de 3 px, barre de défilement fine aux couleurs de la marque.
