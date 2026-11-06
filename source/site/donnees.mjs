/* KAZA — contenu de la vitrine. Aucun prix n'est affiché (tarifs à confirmer par la fondatrice) ; les hébergements et
   expériences sont des exemples de démonstration, présentés comme tels sur la page.
   Parcours simplifié (6 nov. 2026) : une question à l'entrée (« Que cherchez-vous ? », cinq onglets), un seul panneau
   de demande qui s'ouvre avec les bons champs, chaque bouton mène à une seule action. */

export const CONTACT = {
  whatsapp: '24177985553',           // WhatsApp de KAZA (077 98 55 53, fourni par le client le 5 nov. 2026), format international sans « + »
  whatsappAffiche: '077 98 55 53',
  courriel: '',                      // repli si le numéro était vide
  site: 'kaza.ga',                   // domaine d'exemple, à remplacer
};

export const DESTINATIONS = ['Libreville', 'Akanda', 'Pointe-Denis', 'Nyonié', 'Loango', 'Lopé', 'Pongara', 'Ivindo', 'Port-Gentil', 'Franceville', 'Lambaréné', 'Mayumba'];

/* Les cinq pôles, dans l'ordre fixé par la fondatrice. `mode` = panneau de demande ouvert par l'action ; sinon l'action mène à la section. */
export const POLES = [
  { cle: 'immo', ancre: 'immo', nom: 'IMMO & VÉRIFIÉ', titre: 'Louer ou acheter', court: 'Louer ou acheter', action: 'Décrire le bien que je cherche', mode: 'immo', texte: 'Maisons, appartements, studios, terrains : vente et location longue durée, annonces et propriétaires vérifiés.' },
  { cle: 'stay', ancre: 'stay', nom: 'STAY', titre: 'Dormir quelques nuits', court: 'Dormir', action: 'Voir les hébergements', mode: null, texte: 'Appartements meublés, villas, bungalows et lodges partenaires, pour une nuit ou un mois.' },
  { cle: 'tourisme', ancre: 'tourisme', nom: 'TOURISME', titre: 'Explorer le Gabon', court: 'Explorer', action: 'Voir les expériences', mode: null, texte: 'Parcs nationaux, lagunes, plages et visites guidées, avec des opérateurs partenaires vérifiés.' },
  { cle: 'conciergerie', ancre: 'conciergerie', nom: 'CONCIERGERIE', titre: 'Un service au quotidien', court: 'Un service', action: 'Demander un service', mode: 'conciergerie', texte: 'Ménage, chauffeur et transferts, blanchisserie, courses, entretien : une fois ou chaque semaine.' },
  { cle: 'diaspora', ancre: 'diaspora', nom: 'DIASPORA', titre: 'Revenir au pays', court: 'Revenir au pays', action: 'Préparer mon retour', mode: 'diaspora', texte: 'Vous vivez à l’étranger : un séjour organisé de bout en bout, avec un seul interlocuteur.' },
];

export const HEBERGEMENTS = [
  { slug: 'loango-lodge', titre: 'Lodge sur la lagune', lieu: 'Loango', zone: 'Parc national de Loango', type: 'Bungalow entier', capacite: '2 voyageurs', details: ['Ponton privé', 'Petit-déjeuner', 'Accès en bateau'], verifie: true },
  { slug: 'libreville-mer', titre: 'Appartement meublé face à la mer', lieu: 'Libreville', zone: 'Bord de mer', type: 'Appartement entier', capacite: '4 voyageurs', details: ['2 chambres', 'Climatisation', 'Wi-Fi'], verifie: true },
  { slug: 'plage-nyonie', titre: 'Bungalow entre savane et plage', lieu: 'Nyonié', zone: 'Estuaire', type: 'Bungalow', capacite: '2 voyageurs', details: ['Plage à 50 m', 'Transfert en bateau', 'Pension complète'], verifie: true },
  { slug: 'libreville-front', titre: 'Studio au centre-ville', lieu: 'Libreville', zone: 'Centre', type: 'Studio', capacite: '2 voyageurs', details: ['Front de mer à pied', 'Groupe électrogène', 'Wi-Fi'], verifie: false },
];

export const EXPERIENCES = [
  { slug: 'loango-elephants', titre: 'Loango, les éléphants de plage', lieu: 'Parc national de Loango', duree: 'Journée', format: 'Guide partenaire', texte: 'Observation des éléphants de forêt et de la faune du parc avec un opérateur partenaire vérifié ; programme, inclusions et conditions détaillés avant toute demande.' },
  { slug: 'savane-nyonie', titre: 'Nyonié, savane et plage', lieu: 'Nyonié, Estuaire', duree: '2 jours', format: 'Lodge partenaire', texte: 'Au départ de Libreville, en bateau : la savane, la plage et la forêt sur un même séjour, avec un hébergement partenaire sur place.' },
  { slug: 'mangrove-nyonie', titre: 'La mangrove de Nyonié', lieu: 'Nyonié, Estuaire', duree: 'Demi-journée', format: 'Guide partenaire', texte: 'Découverte guidée de la mangrove et de ses rivières, à ajouter à un séjour KAZA STAY ou à réserver seule.' },
];

export const SERVICES = [
  { icone: 'menage', nom: 'Ménage et nettoyage', texte: 'Avant une arrivée, après un départ ou chaque semaine.' },
  { icone: 'chauffeur', nom: 'Chauffeur privé et transferts', texte: 'Aéroport, port, déplacements en ville ou vers un site.' },
  { icone: 'linge', nom: 'Lessive, repassage et blanchisserie', texte: 'Collecte et retour au logement.' },
  { icone: 'courses', nom: 'Courses et commissions', texte: 'Le premier jour, puis sur demande.' },
  { icone: 'outils', nom: 'Entretien et petits travaux', texte: 'Via des prestataires qualifiés, avec devis.' },
  { icone: 'rendezvous', nom: 'Services récurrents', texte: 'Prise de rendez-vous et suivi dans votre espace.' },
];

export const TYPES_BIEN = ['Appartement', 'Maison ou villa', 'Studio', 'Terrain', 'Bureau ou commerce'];
export const FREQUENCES = ['Une fois', 'Chaque semaine', 'Chaque mois'];
export const BESOINS = ['Hébergement', 'Transferts et chauffeur', 'Excursions', 'Services du quotidien'];
export const PROFILS = ['Propriétaire', 'Agence immobilière', 'Gestionnaire d’hébergements', 'Guide, agence ou opérateur touristique', 'Prestataire de services'];

export const VERIFICATION = [
  { titre: 'Un profil vérifié', texte: 'L’identité du propriétaire, de l’agence ou du prestataire est contrôlée avant toute publication.' },
  { titre: 'Des documents contrôlés', texte: 'Titre, mandat et justificatifs sont examinés par l’équipe KAZA ; les critères sont publiés avec le lancement.' },
  { titre: 'Un bien documenté', texte: 'Photos, description, prix, localisation, caractéristiques et conditions : la fiche dit ce que vous trouverez sur place.' },
];

export const PARCOURS = [
  { pole: 'KAZA DIASPORA', titre: 'Vous décrivez votre séjour', texte: 'Pays de départ, dates, nombre de voyageurs, besoins et budget indicatif. L’équipe KAZA prend le relais.' },
  { pole: 'KAZA STAY', titre: 'Nous proposons un hébergement', texte: 'Appartement meublé, villa ou lodge partenaire, avec récapitulatif du prix et conditions avant tout paiement.' },
  { pole: 'KAZA TOURISME', titre: 'Vous choisissez vos expériences', texte: 'Parcs nationaux, lagunes, visites guidées, activités culturelles : des fiches claires, des partenaires identifiés.' },
  { pole: 'KAZA CONCIERGERIE', titre: 'Les services sont organisés', texte: 'Chauffeur à l’arrivée, ménage, courses : tout dans le même récapitulatif, suivi depuis votre espace.' },
];

export const PARTENAIRES = [
  { titre: 'Propriétaires et agences', texte: 'Biens à la vente ou à la location, annonces et échanges.' },
  { titre: 'Gestionnaires d’hébergements', texte: 'Tarifs, disponibilités et réservations dans un espace dédié.' },
  { titre: 'Guides, agences et opérateurs', texte: 'Fiches d’expérience complètes et demandes suivies.' },
  { titre: 'Prestataires de services', texte: 'Zone desservie, disponibilités, évaluations.' },
];

/* Comment ça marche : une seule explication pour toute la plateforme (remplace « Réservez en trois étapes » et « Nos engagements »). */
export const COMMENT = [
  { titre: 'Vous choisissez et vous envoyez', texte: 'Un hébergement, une expérience, un bien, un service ou un séjour complet : le message part sur le WhatsApp de KAZA, déjà rédigé. Aucun paiement sur le site.' },
  { titre: 'Une responsable KAZA vous répond', texte: 'Disponibilité, prix détaillé, frais et conditions d’annulation, par écrit, avant toute décision.' },
  { titre: 'Vous payez en confiance', texte: 'Airtel Money, Moov Money, virement ou carte, selon ce qui vous convient. Profils, documents et biens sont vérifiés.' },
];

/* Le panneau de demande : un seul formulaire, six variantes. `requis` = champs obligatoires de la variante (les champs cachés ne sont jamais exigés). */
export const MODES = {
  stay: { pole: 'KAZA STAY', titre: 'Réserver un hébergement', intro: 'Vos dates et vos coordonnées suffisent. Une responsable KAZA confirme la disponibilité, le prix détaillé et le moyen de paiement sur WhatsApp.', bouton: 'Envoyer ma réservation sur WhatsApp', sujet: 'Réservation KAZA STAY', requis: ['hebergement', 'arrivee', 'depart', 'voyageurs', 'nom', 'contact'], contact: 'Votre numéro WhatsApp', message: 'Précisions', aide: 'Heure d’arrivée, enfants, demandes particulières…' },
  tourisme: { pole: 'KAZA TOURISME', titre: 'Réserver une expérience', intro: 'La date et le nombre de participants suffisent. Une responsable KAZA confirme le programme, le prix et le moyen de paiement sur WhatsApp.', bouton: 'Envoyer ma réservation sur WhatsApp', sujet: 'Réservation KAZA TOURISME', requis: ['experience', 'date', 'participants', 'nom', 'contact'], contact: 'Votre numéro WhatsApp', message: 'Précisions', aide: 'Niveau de marche, enfants, point de départ…' },
  immo: { pole: 'KAZA IMMO & VÉRIFIÉ', titre: 'Décrire le bien que je cherche', intro: 'L’équipe KAZA vous propose des biens dont le propriétaire, les documents et la fiche ont été contrôlés.', bouton: 'Envoyer ma recherche sur WhatsApp', sujet: 'Recherche KAZA IMMO & VÉRIFIÉ', requis: ['typeBien', 'ville', 'nom', 'contact'], contact: 'Votre numéro WhatsApp', message: 'Précisions', aide: 'Nombre de chambres, quartier préféré, date d’entrée…' },
  conciergerie: { pole: 'KAZA CONCIERGERIE', titre: 'Demander un service', intro: 'Un prestataire qualifié et un devis écrit avant toute intervention.', bouton: 'Envoyer ma demande sur WhatsApp', sujet: 'Service KAZA CONCIERGERIE', requis: ['service', 'quartier', 'nom', 'contact'], contact: 'Votre numéro WhatsApp', message: 'Précisions', aide: 'Surface, horaires, accès au logement…' },
  diaspora: { pole: 'KAZA DIASPORA', titre: 'Préparer mon retour au Gabon', intro: 'Décrivez votre séjour : l’équipe KAZA revient vers vous avec une proposition complète, hébergement, transferts, expériences et services.', bouton: 'Envoyer ma demande sur WhatsApp', sujet: 'Demande KAZA DIASPORA', requis: ['pays', 'nom', 'contact'], contact: 'WhatsApp ou courriel', message: 'Ce que vous attendez de ce séjour', aide: 'Dates souples, quartier souhaité, enfants, personnes à mobilité réduite…' },
  partenaire: { pole: 'Partenaires', titre: 'Devenir partenaire KAZA', intro: 'Dites-nous qui vous êtes : l’équipe KAZA vous explique la vérification et les prochaines étapes.', bouton: 'Envoyer ma demande sur WhatsApp', sujet: 'Demande de partenariat KAZA', requis: ['profil', 'nom', 'contact'], contact: 'WhatsApp ou courriel', message: 'Ce que vous proposez', aide: 'Type de biens, d’hébergements, d’expériences ou de services' },
};

/* L'écran « Que souhaitez-vous ? » du panneau (quand on arrive par le bouton Réserver de l'en-tête). */
export const CHOIX = [
  { mode: 'stay', cle: 'stay', titre: 'Dormir quelques nuits', texte: 'Appartement, villa, bungalow ou lodge partenaire' },
  { mode: 'tourisme', cle: 'tourisme', titre: 'Vivre une expérience', texte: 'Parcs, lagunes, plages, visites guidées' },
  { mode: 'immo', cle: 'immo', titre: 'Louer ou acheter un logement', texte: 'Longue durée, biens et propriétaires vérifiés' },
  { mode: 'conciergerie', cle: 'conciergerie', titre: 'Un service au quotidien', texte: 'Ménage, chauffeur, courses, entretien' },
  { mode: 'diaspora', cle: 'diaspora', titre: 'Revenir au pays', texte: 'Un séjour organisé de bout en bout, depuis l’étranger' },
];
