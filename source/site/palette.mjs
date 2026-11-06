/* Palette du site KAZA choisie par le client le 6 nov. 2026 (image « new PC.png » à la racine) :
   Eggshell, Pastel Green, Sage Green, Dark Forest Green. Les noms des jetons (foret, citron, blanc, gris, relief)
   sont conservés dans le code pour ne pas renommer toute la feuille de style ; seules les valeurs changent.
   La charte imprimée (charte/) reste sur la palette d'origine tant que la fondatrice ne demande pas sa mise à jour. */
export const FORET = '#153611';   // Dark Forest Green : fonds, navigation, texte sur fond clair
export const CITRON = '#BAD2AB';  // Pastel Green : action principale sur fond sombre, mot mis en évidence, toits du logo
export const BLANC = '#F0F3E5';   // Eggshell : clarté, texte sur fond sombre
export const GRIS = '#82A577';    // Sage Green : texte secondaire sur fond sombre (4,9:1), bordures, nuages
export const RELIEF = '#254720';  // dérivé : Dark Forest + 15 % de Sage, cartes et reliefs sur fond sombre
/* nappes de nuages (canvas et voiles) : les quatre couleurs en RVB */
export const NUAGES = { eggshell: [240, 243, 229], pastel: [186, 210, 171], sage: [130, 165, 119], foret: [21, 54, 17] };
