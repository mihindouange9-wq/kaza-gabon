# KAZA GABON – ÉCO TOURISME · Charte graphique

Charte graphique professionnelle réalisée par MÉTHODE AURA (novembre 2026) à partir des deux fichiers fournis : `kaza logo.jpeg` (logo de référence) et `kaza ideas.pdf` (cahier des charges fonctionnel, cinq pôles, couleurs, direction artistique).

## Livrables

| Dossier / fichier | Contenu |
|---|---|
| `charte/index.html` | La charte complète : 32 planches 1600 × 1000 dans un lecteur à l'échelle (ouvrir par double-clic, hors ligne). |
| `charte/KAZA-charte.pdf` | La même charte en PDF, une planche par page, à envoyer et à imprimer. |
| `logos/` | 22 logos SVG autonomes (police Outfit embarquée) : principal blanc cassé / vert forêt, monochromes, mot seul, symbole (tuiles vert forêt, vert citron, blanc cassé, sans tuile), cinq logos de pôle en deux versions. |
| `charte/assets/fonts/` | Outfit (titres, GABON, noms de pôles) et Plus Jakarta Sans (texte), licence SIL OFL, sous-ensembles latin + latin-ext ; Sora pour la signature MÉTHODE AURA. |
| `charte/assets/photos/` | Dix photographies réelles du Gabon (Wikimedia Commons, licences CC BY / CC BY-SA) et `credits.json` (auteur, licence, source). Les crédits figurent sur chaque planche qui les utilise. |
| `charte/assets/favicon.svg` | Le symbole sur tuile vert forêt. |

## Ce que fixe la charte

- **Logo** reconstruit en vectoriel d'après le JPEG, sans modification du dessin : lettres KAZA en polygones (fût 22 / 100), toits vert citron dans les A, trajectoire et avion, ligne GABON en Outfit. Construction, zone de protection (hauteur du toit), quatre versions, symbole (le A), déclinaisons par pôle (la ligne GABON devient IMMO & VÉRIFIÉ, STAY, TOURISME, CONCIERGERIE, DIASPORA), tailles minimales, six interdits.
- **Couleurs** : les quatre du cahier des charges (vert forêt #00291B, vert citron #C7F974, blanc cassé #F7F8F4, vert gris #9AAFA4), proportions 55 / 10 / 30 / 5, huit combinaisons avec contraste mesuré, une seule nuance dérivée (vert relief #143A2B) réservée aux fonds.
- **Typographie** : Outfit 600 pour les titres, Plus Jakarta Sans pour le texte, hiérarchie en six niveaux.
- **Système graphique** : trajectoire, toits, reliefs, badge KAZA Vérifié, six règles d'assemblage.
- **Photographie** : le Gabon réel et nommé, voile vert forêt, cadrage / lumière / traitement.
- **Réseaux sociaux** : publication, story, profil.
- **Applications** : carte de visite, signature de courriel, kakémono, affiche, autocollants partenaires (18 applications récapitulées).
- **À faire / à éviter** : seize cas.
- **Couverture** : immersion immédiate dans les signes de la marque (vert forêt, logo grand format, rangée de toits, reliefs, les cinq pôles), sans photo.
- **Hors périmètre, à la demande du client (5 nov. 2026)** : aucun écran ni composant d'application, l'application n'étant pas encore conçue ; ses écrans feront l'objet d'un chapitre à part le moment venu.

## Vitrine de l'application web (site/)

`site/index.html` (+ `site/assets/`) : la page publique de la plateforme, responsive (ordinateur, tablette, téléphone avec dock des cinq pôles), ouvrable par double-clic et hébergeable sur un service statique. Générée par `source/site/build.mjs` à partir de `source/site/donnees.mjs` (contenu), `site.css`, `app.js` et de la charte (`source/lib.mjs`).

- **Direction immersive (5 nov. 2026, référence : fitzroy-travel.com)** : héros plein écran en triptyque des trois photos fournies par KAZA (`1.jpeg` La Concorde de nuit, `2.jpeg` plage sous les cocotiers, `3.jpeg` l’arbre de bouteilles Aux berges des 3 Rivières ; converties en WebP par `tools/images-client.mjs`), accroche en très grand corps, « Faire défiler », légende photo avec compteur 01 / 03 ; sur téléphone les trois photos défilent plein écran (fondu, zoom lent, balayage au doigt). Section « Pourquoi KAZA » (grande image verticale + petite image en chevauchement, trois temps Préparer / Organiser / Vivre). Couche d’effets `source/site/effets.js` (GSAP + ScrollTrigger + Lenis vendorisés dans `site/assets/vendor/`, moteur `liquide.js`) : intro (le logo s’écrit à chaque chargement de la page, demande du client), défilement fluide, en-tête transparent puis verre dépoli, titres révélés mot à mot, rideaux sur les photos, parallaxes, galerie des expériences épinglée à l’horizontale avec compteur (ordinateur), fil de vol dans la marge droite (grand écran), tampon KAZA Vérifié, avion qui décolle à l’envoi d’un formulaire, matière liquide au pointeur sur la plage (ordinateur, en http seulement). Tout est statique si le système demande moins de mouvement.
- **Parcours simplifié (6 nov. 2026, demande : « l’utilisateur ne doit pas être perdu, chaque bouton doit le mener où il souhaite vraiment aller », en s’inspirant d’Airbnb, Booking, GetYourGuide et Evaneos)** :
  - **Une question à l’entrée** : la bande de recherche pose « Que cherchez-vous ? » avec cinq onglets (IMMO & VÉRIFIÉ · Louer ou acheter, STAY · Dormir, TOURISME · Explorer, CONCIERGERIE · Un service, DIASPORA · Revenir au pays). Chaque onglet montre ses propres champs et un seul bouton : STAY et TOURISME filtrent les exemples et descendent à la section ; IMMO, CONCIERGERIE et DIASPORA ouvrent directement le panneau de demande avec les champs déjà remplis. Sur téléphone la rangée défile à l’horizontale (onglet actif ramené au bord, fondu sur les bords).
  - **Un seul panneau de demande** (`<aside class="demande">`, tiroir à droite sur ordinateur, plein écran sur téléphone, bouton d’envoi toujours visible) avec six variantes : hébergement, expérience, bien immobilier, service, retour au pays, partenaire. Il s’ouvre depuis n’importe quel bouton `[data-demande]` avec l’objet déjà choisi (vignette, titre, lieu, « Changer »), les champs utiles à cette variante seulement, les dates et voyageurs repris de la recherche. Le bouton « Réserver » de l’en-tête ouvre l’écran « Que souhaitez-vous ? » (cinq choix) puis la variante, avec un bouton retour. Fermeture par la croix, le fond, Échap ou le bouton retour du téléphone (historique). Plus aucun formulaire dans la page.
  - **Chaque bouton mène à une seule chose** : « Réserver » d’une carte → réservation de cette carte ; un service cliqué → demande de ce service ; « Décrire le bien que je cherche » → variante immobilier (louer / acheter, type, ville, budget) ; « Déposer une annonce » → variante partenaire avec le profil Propriétaire ; « Préparer mon retour » → variante diaspora ; « Devenir partenaire » → variante partenaire.
  - Sections, dans l’ordre : héros, recherche à onglets, les cinq pôles (une action chacun), Pourquoi KAZA (raccourci), KAZA STAY (cartes → Réserver), KAZA TOURISME (expériences → Réserver), **Comment ça marche** (trois étapes communes aux cinq pôles, remplace « Réservez en trois étapes » et « Nos engagements »), KAZA IMMO & VÉRIFIÉ, KAZA CONCIERGERIE (six services cliquables), KAZA DIASPORA (texte + bouton + parcours), partenaires (texte + bouton + profils), pied de page.
- **Sobriété (6 nov. 2026, demande : « retirer tout ce qui s’apparente à une interface IA », passée au crible ui-ux-pro-max et impeccable)** : plus de cartes « tuile-icône + titre + texte » en série (pôles, services, choix du panneau, parcours diaspora, profils partenaires deviennent des listes à filets, numéraux nus quand un ordre existe), plus de sur-titres à tiret ni d’icônes devant les noms de section, plus de pastilles numérotées ni de puces-pastilles d’équipements, plus de brillance ni de soulèvement au survol, plus de verre dépoli ni de flou (en-tête, panneau, révélations, légendes photo). Les détails sont consignés dans `DESIGN.md` (section Sobriété). Conservé car imposé par le cahier des charges : boutons arrondis vert citron, Outfit et Plus Jakarta Sans (seul signalement restant du détecteur impeccable), badge KAZA Vérifié, icônes des pôles dans la navigation.
- **Palette et nuages (6 nov. 2026, demande du client avec `new PC.png`)** : le site passe aux quatre couleurs choisies (Eggshell #F0F3E5, Pastel Green #BAD2AB, Sage Green #82A577, Dark Forest Green #153611) définies dans `source/site/palette.mjs` ; les icônes d’application et le manifeste sont regénérés (`node tools/icones-app.mjs`). Des nuages de ces couleurs dérivent derrière la page (`source/site/nuages.js`, canvas fixe) et dans le héros, les sections sombres et le pied (voiles CSS). La charte imprimée reste sur la palette d’origine jusqu’à nouvel ordre. Typographie remise d’équerre sur la charte (Outfit 600, échelle 72/44/26/17/14/13, capitales espacées 8–14 %, chiffres tabulaires), « Faire défiler » retiré.
- **Réservation → WhatsApp (décision du client, 5 nov. 2026)** : une fois les champs remplis et validés, WhatsApp s'ouvre avec le message complet adressé au **077 98 55 53** (`24177985553` dans `donnees.mjs`) ; le panneau affiche alors l’écran « Votre message est prêt » (lien de secours « Ouvrir WhatsApp », les deux étapes suivantes). Une responsable KAZA répond avec la disponibilité et les conditions de paiement. Le même canal sert aux six variantes. Le message n'est pas envoyé sans le geste du client : une remise sans action nécessiterait l'API WhatsApp Business (Meta), payante et soumise à validation.
- Aucun prix affiché, aucun écran d’application : les hébergements et expériences sont des exemples signalés comme tels ; leurs photos sont celles de la charte (WebP 1600 / 960 / 480 générés par `tools/images.mjs`), celles du héros et de « Pourquoi KAZA » sont les trois photos fournies par KAZA (légendes limitées à ce que l’image montre : les lieux non identifiables ne sont pas nommés).
- Contrôle : `node tools/site-verifier.mjs` (bureau 1440, tablette 820, téléphone 390 : débordements, images, textes < 13 px, contrastes, cibles tactiles, révélations, console, puis le parcours : panneau ouvert depuis une carte avec l’objet repris et cinq champs exigés, bouton d’envoi visible, fermeture, service repris, variante diaspora, recherche STAY, onglet IMMO → panneau prérempli ; captures dans `tools/captures-site/`). Captures ciblées du parcours (recherche, panneau, écran final, choix, variantes, menu) : `node tools/captures-parcours.mjs` → `tools/captures-site/parcours/`. Détecteur impeccable : les signalements restants sont des faux positifs (`clamp()` non lu, police imposée par la charte, fonds décoratifs volontairement rognés).
- Pièges du parcours : une rangée d’onglets `white-space: nowrap` dans une grille élargit toute la page tant que chaque niveau n’a pas `min-width: 0` ; en colonne (téléphone) `flex: 1 1 0` écrase la rangée à zéro de hauteur → `flex: 0 0 auto` ; un `<img src="">` dans le panneau compte comme image cassée → la vignette est créée au moment de l’ouverture ; un bouton `display: inline` reste `inline-block` dans Chrome → zone tactile étendue par `::after` ; le panneau porte `data-lenis-prevent` pour défiler seul sous Lenis ; `history.pushState` à l’ouverture pour que le bouton retour du téléphone ferme le panneau.
- Pour modifier : `node source/site/build.mjs && node tools/site-verifier.mjs` (zéro anomalie sur les trois formats le 5 nov. 2026). Nouvelles photos du client : les déposer à la racine puis `node tools/images-client.mjs`. Les fichiers `PRODUCT.md` et `DESIGN.md` à la racine décrivent le produit et les jetons de design.

## Publication

- **En ligne : https://kaza-gabon.onrender.com** (site statique Render, service `kaza-gabon` créé par l’API le 5 nov. 2026, dossier publié `site/`, sans commande de construction).
- **Dépôt public : https://github.com/mihindouange9-wq/kaza-gabon** (branche `main`, commits signés MÉTHODE AURA). Le cahier des charges `kaza ideas.pdf` et les captures de contrôle sont exclus par `.gitignore` et ne sont jamais publiés.
- Mise à jour : modifier `source/`, `node source/site/build.mjs && node tools/site-verifier.mjs`, puis `git commit` et `git push`. **Un push ne redéploie pas forcément** (l’application GitHub de Render n’est pas installée) : relancer `RENDER_API_KEY=… node tools/render-deploy.mjs` (ou `RENDER_KEY_FILE=` vers un fichier hors du dépôt), qui demande un nouveau déploiement et le suit jusqu’à « live ». La clé ne doit jamais être écrite dans le dépôt.
- En-têtes servis par Render (définis dans `tools/render-deploy.mjs`) : politique de sécurité stricte (scripts et polices du site seulement, aucun script en ligne, d’où `assets/intro.js` et `assets/config.js`), pas d’intégration dans une autre page, HSTS, cache long sur les bibliothèques et les polices.
- Domaine `kaza.ga` ou autre : à ajouter dans Render (Custom Domains) le jour venu ; l’adresse Render reste valable.
- **Icône d’application (écran d’accueil iPhone et Android, 5 nov. 2026)** : `site/manifest.json` (nom KAZA, mode plein écran « standalone », couleur vert forêt) et `site/assets/icons/` (le A de KAZA sur tuile vert forêt en 180 px pour Apple, 192 et 512 px pour Android, 512 px « maskable »), générés par `node tools/icones-app.mjs`. Le `<head>` déclare `apple-touch-icon`, `apple-mobile-web-app-title`, le mode application et `viewport-fit=cover` ; l’en-tête, le menu et le héros réservent la zone de l’encoche (`env(safe-area-inset-top)`), le dock celle du bas. Sur iPhone : Partager → « Sur l’écran d’accueil » ; sur Android : menu Chrome → « Ajouter à l’écran d’accueil » ou « Installer l’application ».

## Fichiers de travail

| Fichier | Rôle |
|---|---|
| `source/lib.mjs` | Couleurs, construction du logo (polygones), symbole, motifs, badge, icônes des pôles, photos et crédits, planche, logo MÉTHODE AURA, conversions CMJN / RGB / contraste. |
| `source/sections/a-marque-logo.mjs`, `b-couleurs-typo-systeme-photo.mjs`, `c-digital-applications-fin.mjs` | Les 32 planches. |
| `source/style.css`, `source/fonts.css` | Mise en page du document et déclarations des polices. |
| `source/build.mjs` | Génère `charte/index.html`, `charte/assets/style.css`, les logos SVG et le favicon : `node source/build.mjs`. |
| `tools/verifier.mjs` | Contrôle chaque planche dans Chrome (débordements, textes trop petits, polices, images, console) et capture `tools/captures/planche-NN.png` : `node tools/verifier.mjs`. |
| `tools/pdf.mjs` | Export PDF : `node tools/pdf.mjs`. |
| `tools/fetch-font.mjs` | Téléchargement d'une police Google Fonts (latin + latin-ext) et ajout des `@font-face`. |
| `tools/photos.mjs` | Téléchargement des photos retenues et écriture des crédits. |

Pour modifier : éditer `source/`, puis `node source/build.mjs && node tools/verifier.mjs && node tools/pdf.mjs`. Ne jamais modifier `charte/index.html` à la main.

## À valider par la fondatrice

- La signature proposée « Préparer. Organiser. Vivre le Gabon. » (planche 07) ; aucune signature n'était imposée.
- Les coordonnées des maquettes (kaza.ga, numéros) sont des gabarits ; les prix affichés sont des exemples de mise en page.
- Le fichier source du logo d'origine, s'il existe, reste à réclamer à son auteur ; les SVG livrés le remplacent pour tous les usages courants.
