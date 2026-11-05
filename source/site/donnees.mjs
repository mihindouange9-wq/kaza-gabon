/* KAZA — contenu de la vitrine. Aucun prix n'est affiché (tarifs à confirmer par la fondatrice) ; les hébergements et
   expériences sont des exemples de démonstration, présentés comme tels sur la page. */

export const CONTACT = {
  whatsapp: '24177985553',           // WhatsApp de KAZA (077 98 55 53, fourni par le client le 5 nov. 2026), format international sans « + »
  whatsappAffiche: '077 98 55 53',
  courriel: '',                      // repli si le numéro était vide
  site: 'kaza.ga',                   // domaine d'exemple, à remplacer
};

export const DESTINATIONS = ['Libreville', 'Akanda', 'Pointe-Denis', 'Nyonié', 'Loango', 'Lopé', 'Pongara', 'Ivindo', 'Port-Gentil', 'Franceville', 'Lambaréné', 'Mayumba'];

export const POLES = [
  { cle: 'immo', ancre: 'immo', nom: 'IMMO & VÉRIFIÉ', titre: 'Immobilier et confiance', texte: 'Vente et location longue durée : maisons, appartements, studios, terrains. Annonces, profils et documents vérifiés.' },
  { cle: 'stay', ancre: 'stay', nom: 'STAY', titre: 'Hébergement de courte durée', texte: 'Appartements meublés, studios, villas, maisons de vacances et résidences partenaires, avec calendrier et avis.' },
  { cle: 'tourisme', ancre: 'tourisme', nom: 'TOURISME', titre: 'Expériences et écotourisme', texte: 'Excursions, circuits, visites guidées, parcs nationaux, forêts, plages et lagunes, avec des opérateurs partenaires.' },
  { cle: 'conciergerie', ancre: 'conciergerie', nom: 'CONCIERGERIE', titre: 'Services du quotidien', texte: 'Ménage, chauffeur et transferts, blanchisserie, courses, entretien : à la demande ou en récurrence.' },
  { cle: 'diaspora', ancre: 'diaspora', nom: 'DIASPORA', titre: 'Préparer son retour', texte: 'Un parcours intégré pour les Gabonais de l’étranger : séjour, hébergement, mobilité, expériences, suivi centralisé.' },
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
  { titre: 'Propriétaires et agences', texte: 'Publiez vos biens à la vente ou à la location, gérez vos annonces et vos échanges.' },
  { titre: 'Gestionnaires d’hébergements', texte: 'Appartements meublés, villas, résidences : tarifs, disponibilités et réservations dans un espace dédié.' },
  { titre: 'Guides, agences et opérateurs', texte: 'Excursions, circuits, visites : des fiches d’expérience complètes et des demandes suivies.' },
  { titre: 'Prestataires de services', texte: 'Ménage, transport, blanchisserie, entretien : zone desservie, disponibilités, évaluations.' },
];

export const CONFIANCE = [
  { titre: 'Le prix avant le paiement', texte: 'Détail du prix, frais éventuels, conditions d’annulation et montant total, toujours affichés avant de payer.' },
  { titre: 'Des statuts lisibles', texte: 'Demande reçue, validation, paiement, confirmation, rappel : vous savez où en est chaque étape.' },
  { titre: 'Le paiement avec une responsable', texte: 'Votre réservation arrive sur le WhatsApp de KAZA ; une responsable vous donne les conditions de paiement (Airtel Money, Moov Money, virement ou carte).' },
];

export const RESERVATION_ETAPES = [
  { titre: 'Vous validez votre réservation sur le site', texte: 'Le logement ou l’expérience, vos dates, le nombre de voyageurs, votre nom et votre WhatsApp. Aucun paiement à cette étape.' },
  { titre: 'Votre demande arrive sur le WhatsApp de KAZA', texte: 'WhatsApp s’ouvre avec le message déjà rédigé ; vous l’envoyez d’un geste. Il arrive directement chez l’équipe KAZA.' },
  { titre: 'Une responsable vous répond avec les conditions de paiement', texte: 'Disponibilité confirmée, prix détaillé, conditions d’annulation et moyen de paiement : Airtel Money, Moov Money, virement ou carte.' },
];
