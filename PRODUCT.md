# Product

<!-- impeccable:product-schema 1 -->

Source : `kaza ideas.pdf` (cahier des charges fonctionnel fourni par la fondatrice) et `kaza logo.jpeg`. Les faits marqués *(inféré)* ne viennent pas d'un échange avec la fondatrice : ils sont déduits du cahier des charges et restent à confirmer. Aucun entretien n'a été mené (le client a demandé une livraison autonome).

## Platform

web

## Stack

delegated : HTML, CSS et JavaScript statiques générés par Node (`source/site/build.mjs` → `site/`), sans dépendance ni étape de compilation, ouvrables par double-clic et hébergeables sur un service statique (Render, comme les autres sites du studio). Raison : les binaires npm (Vite, esbuild) sont bloqués par Smart App Control sur le poste de production, et la vitrine n'a pas besoin d'un framework. L'application elle-même (comptes, réservations, paiements, back-office) n'est pas encore conçue ; cette vitrine est sa page publique.

## Users

- Voyageurs et résidents au Gabon qui cherchent un logement (achat, location longue durée), un hébergement de courte durée, une expérience touristique ou un service du quotidien.
- Gabonais de l'étranger qui préparent un retour, un séjour ou une installation au Gabon et veulent un interlocuteur unique.
- Propriétaires, agences, gestionnaires de logements, guides, agences et opérateurs touristiques, prestataires de conciergerie : les partenaires qui publient et exécutent les prestations.
- L'équipe KAZA (back-office séparé, hors périmètre de la vitrine).

## Product Purpose

KAZA GABON – ÉCO TOURISME est une plateforme numérique gabonaise qui centralise logement, hébergement, tourisme et conciergerie, avec un accompagnement dédié à la diaspora. Elle doit permettre de trouver un logement, réserver un hébergement de courte durée, organiser des expériences et commander des services pratiques depuis un même espace. Vision : être le point d'entrée fiable pour préparer, organiser et vivre un séjour au Gabon. Succès *(inféré)* : des demandes et réservations qui aboutissent, des partenaires vérifiés actifs, des utilisateurs de la diaspora accompagnés de bout en bout.

## Positioning

Cinq pôles reliés par un compte unique et un récapitulatif de séjour commun : KAZA IMMO & VÉRIFIÉ, KAZA STAY, KAZA TOURISME, KAZA CONCIERGERIE, KAZA DIASPORA. La confiance est le mécanisme : vérification des profils, des documents et des biens, matérialisée par le badge « KAZA Vérifié » ; prix détaillé, frais et conditions d'annulation affichés avant tout paiement ; priorité à l'écotourisme et au patrimoine naturel et culturel du Gabon.

## Operating Context

- Usage principalement sur téléphone, connexions mobiles parfois limitées (le cahier des charges impose l'optimisation des performances et des images).
- Paiements prévus à terme : Airtel Money, Moov Money et cartes bancaires, sous réserve d'intégration ; en attendant, conditions de paiement données par une responsable sur WhatsApp après la réservation.
- Commission touristique communiquée : 35 % KAZA / 65 % partenaire ; autres taux et abonnements professionnels (35 000, 45 000, 25 000, 50 000 FCFA évoqués) à confirmer avant tout affichage : la vitrine ne publie aucun tarif.
- Interface en français, architecture prévue pour l'anglais.

## Capabilities and Constraints

- Les cinq pôles sont fixés par la fondatrice ; aucun pôle supplémentaire sans validation.
- Fonctionnalités cibles de la plateforme : compte unique, recherche multicritère, favoris, fiches détaillées, messagerie traçable, demandes et réservations avec statuts, notifications, avis et signalements, espace propriétaire / gestionnaire, back-office.
- Non encore réalisés : l'application, ses écrans, la prise de paiement, les comptes. La vitrine ne doit donc pas montrer d'écrans d'application ni promettre une réservation en ligne immédiate ; elle oriente vers une demande (formulaire → WhatsApp ou courriel).
- Points à valider avant lancement : conditions d'annulation et de remboursement, tarifs, documents exigés pour la vérification et critères du badge, zones couvertes, partenaires disponibles, prestataire de paiement, politique de confidentialité et CGU.
- Canal de réservation (décision du client, 5 nov. 2026) : les API Airtel Money et bancaires prendront du temps ; le client réserve sur le site, le message part sur le WhatsApp de KAZA **077 98 55 53** (`24177985553` dans `source/site/donnees.mjs`), et une responsable donne les conditions de paiement. Adresse courriel et domaine : non fournis.

## Brand Commitments

- Nom : KAZA GABON – ÉCO TOURISME ; « KAZA » seul dans l'usage courant ; noms de pôles en capitales avec le préfixe KAZA.
- Logo fourni par la fondatrice (reconstruit en vectoriel dans `logos/` et `source/lib.mjs`), jamais modifié.
- Charte graphique livrée le 5 novembre 2026 (`charte/`, 32 planches) : couleurs, typographies, système graphique, photographie, applications. Elle fait autorité ; `DESIGN.md` la résume en jetons.
- Ton : vouvoiement, phrases courtes et concrètes, précision plutôt que superlatifs, lieux nommés.
- Signature proposée par MÉTHODE AURA, non validée : « Préparer. Organiser. Vivre le Gabon. »

## Evidence on Hand

- Cahier des charges `kaza ideas.pdf` (6 pages) et logo `kaza logo.jpeg`.
- Dix photographies réelles du Gabon sous licences libres avec crédits (`charte/assets/photos/credits.json`) ; aucune photo de logement partenaire, aucun témoignage, aucun chiffre d'activité : la vitrine ne doit pas en fabriquer. Les hébergements et expériences affichés sont des exemples de démonstration, présentés comme tels.

## Product Principles

1. Un seul point d'entrée : chaque pôle est joignable depuis l'accueil, dans le même ordre, avec la même identité.
2. La confiance se montre : vérification expliquée, badge unique, prix et conditions avant paiement, statuts lisibles.
3. Le Gabon réel : lieux nommés, photos réelles, pas d'illustration générique.
4. Rien n'est promis que la plateforme ne tient pas encore : demande plutôt que réservation tant que l'application n'existe pas.
5. Le téléphone d'abord : lisible et rapide sur une connexion mobile limitée.

## Accessibility & Inclusion

Contraste minimal 4,5:1 pour le texte courant (le vert citron ne porte jamais de texte sur fond clair), cibles tactiles d'au moins 44 px, navigation au clavier avec focus visible, respect de `prefers-reduced-motion`, formulaires avec libellés visibles et erreurs nommées.
