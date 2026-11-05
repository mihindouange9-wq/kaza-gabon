/* KAZA GABON – vitrine : menu mobile, recherche (filtre des exemples), révélations, formulaires → WhatsApp / courriel / copie. */
(function () {
  'use strict';
  var CONTACT = window.KAZA_CONTACT || { whatsapp: '', courriel: '' };
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- révélations au défilement, avec filet de sécurité ---------- */
  var reveals = $$('[data-reveal]');
  if (reduit || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) { el.style.setProperty('--delai', ((i % 4) * 0.07) + 's'); io.observe(el); });
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('visible'); }); }, 1500);
  }

  /* ---------- menu mobile ---------- */
  var bouton = $('.menu-bouton'), menu = $('.menu');
  function fermer() { if (!menu) return; menu.removeAttribute('data-ouvert'); bouton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-ouvert'); }
  if (bouton && menu) {
    bouton.addEventListener('click', function () {
      var ouvert = menu.hasAttribute('data-ouvert');
      if (ouvert) fermer(); else { menu.setAttribute('data-ouvert', ''); bouton.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-ouvert'); }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', fermer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
  }

  /* ---------- section courante dans la navigation et le dock ---------- */
  var sections = $$('main section[id]');
  var liens = $$('.nav-principale a, .dock a');
  if ('IntersectionObserver' in window && sections.length) {
    var courant = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        liens.forEach(function (a) { if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(function (s) { courant.observe(s); });
  }

  /* ---------- recherche : filtre les exemples par destination ---------- */
  var normaliser = function (t) { return (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); };
  var recherche = $('#recherche');
  var resultat = $('#resultat');
  var memoire = {};
  if (recherche) {
    recherche.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = normaliser(recherche.destination.value);
      memoire = { destination: recherche.destination.value, arrivee: recherche.arrivee.value, depart: recherche.depart.value, voyageurs: recherche.voyageurs.value };
      var cartes = $$('.annonce[data-lieu]');
      var exp = $$('.experience[data-lieu]');
      var n = 0;
      cartes.forEach(function (c) { var ok = !d || normaliser(c.getAttribute('data-lieu')).indexOf(d) !== -1; c.hidden = !ok; if (ok) n += 1; });
      exp.forEach(function (c) { var ok = !d || normaliser(c.getAttribute('data-lieu')).indexOf(d) !== -1; c.hidden = !ok; });
      if (resultat) {
        var periode = memoire.arrivee && memoire.depart ? ' du ' + dateFr(memoire.arrivee) + ' au ' + dateFr(memoire.depart) : '';
        var voy = memoire.voyageurs ? ', ' + memoire.voyageurs + ' voyageur' + (memoire.voyageurs > 1 ? 's' : '') : '';
        var texte = d ? '<b>' + n + ' hébergement' + (n > 1 ? 's' : '') + '</b> pour « ' + echapper(memoire.destination) + ' »' + periode + voy + '.' : '<b>' + n + ' hébergements</b>' + periode + voy + '.';
        if (!n) texte += ' Aucun logement partenaire ici pour l’instant : décrivez votre séjour, l’équipe KAZA vous répond.';
        resultat.innerHTML = '<span>' + texte + '</span><a class="lien" href="#' + (n ? 'reservation' : 'diaspora') + '">' + (n ? 'Réserver' : 'Décrire mon séjour à l’équipe KAZA') + ' ' + fleche + '</a>';
        resultat.setAttribute('data-visible', '');
        prefiller();
        aller(document.getElementById('stay'));
      }
    });
  }
  function aller(el) { if (window.kazaAller) window.kazaAller(el); else el.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' }); }
  var fleche = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function dateFr(v) { var p = v.split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v; }
  function echapper(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function prefiller() {
    [$('#demande'), $('#reserver')].forEach(function (f) {
      if (!f) return;
      if (memoire.arrivee && !f.arrivee.value) f.arrivee.value = memoire.arrivee;
      if (memoire.depart && !f.depart.value) f.depart.value = memoire.depart;
      if (memoire.voyageurs && !f.voyageurs.value) f.voyageurs.value = memoire.voyageurs;
      if (memoire.destination && f.id === 'demande' && !f.message.value) f.message.value = 'Destination souhaitée : ' + memoire.destination + '.';
    });
  }
  /* boutons « Réserver » des exemples : sélectionnent l'objet et amènent au formulaire de réservation */
  $$('[data-objet]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = $('#reserver'); if (!f) return;
      var valeur = b.getAttribute('data-objet');
      var existe = Array.prototype.some.call(f.objet.options, function (o) { return o.value === valeur; });
      f.objet.value = existe ? valeur : 'Autre demande';
      if (!existe) f.message.value = valeur;
      f.objet.removeAttribute('aria-invalid');
      prefiller();
      aller(document.getElementById('reservation'));
      setTimeout(function () { (f.objet.value ? f.arrivee : f.objet).focus({ preventScroll: true }); }, reduit ? 0 : 600);
    });
  });

  /* ---------- formulaires ---------- */
  function valider(f) {
    var ok = true;
    $$('[required]', f).forEach(function (c) {
      var champ = c.closest('.champ'); var err = champ && champ.querySelector('.erreur');
      var vide = c.type === 'checkbox' ? !c.checked : !c.value.trim();
      var mauvais = (!vide && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value)) || (!vide && c.type === 'tel' && !/^\+?[0-9 ().-]{8,}$/.test(c.value));
      if (vide || mauvais) { ok = false; c.setAttribute('aria-invalid', 'true'); if (err) { err.textContent = vide ? 'Ce champ est nécessaire pour vous répondre.' : (c.type === 'tel' ? 'Indiquez un numéro WhatsApp complet, avec l’indicatif.' : 'Cette adresse ne semble pas valide.'); err.setAttribute('data-visible', ''); } }
      else { c.removeAttribute('aria-invalid'); if (err) err.removeAttribute('data-visible'); }
    });
    if (!ok) { var premier = $('[aria-invalid="true"]', f); if (premier) premier.focus(); }
    return ok;
  }
  function envoyer(f, titre, lignes, suite) {
    var statut = $('.statut', f);
    var texte = titre + '\n' + lignes.filter(Boolean).join('\n');
    if (CONTACT.whatsapp) {
      var url = 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(texte);
      var fenetre = window.open(url, '_blank', 'noopener');
      statut.setAttribute('data-etat', 'ok');
      statut.innerHTML = (fenetre ? 'WhatsApp s’ouvre avec votre message : envoyez-le, il arrive directement chez KAZA (' + (CONTACT.whatsappAffiche || CONTACT.whatsapp) + '). ' : 'Votre message est prêt. ') + (suite || '') + ' <a href="' + url + '" target="_blank" rel="noopener">Ouvrir WhatsApp</a>';
      f.dispatchEvent(new CustomEvent('kaza:envoye', { bubbles: true }));
      return;
    }
    if (CONTACT.courriel) {
      window.location.href = 'mailto:' + CONTACT.courriel + '?subject=' + encodeURIComponent(titre) + '&body=' + encodeURIComponent(texte);
      statut.setAttribute('data-etat', 'ok'); statut.textContent = 'Votre messagerie s’ouvre avec la demande prête à envoyer à ' + CONTACT.courriel + '.';
      return;
    }
    var copie = function (reussi) {
      statut.setAttribute('data-etat', 'copie');
      statut.innerHTML = (reussi ? 'Demande copiée. ' : '') + 'Le canal de réception (WhatsApp ou courriel) sera activé au lancement : voici votre message, à envoyer à l’équipe KAZA.<pre></pre>';
      statut.querySelector('pre').textContent = texte;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(function () { copie(true); }, function () { copie(false); });
    else copie(false);
  }
  var demande = $('#demande');
  if (demande) {
    demande.addEventListener('submit', function (e) {
      e.preventDefault(); if (!valider(demande)) return;
      var besoins = $$('input[name="besoins"]:checked', demande).map(function (c) { return c.value; });
      envoyer(demande, 'Demande KAZA DIASPORA', [
        'Nom : ' + demande.nom.value.trim(), 'Contact : ' + demande.contact.value.trim(), 'Pays de départ : ' + demande.pays.value.trim(),
        demande.arrivee.value ? 'Arrivée : ' + dateFr(demande.arrivee.value) : '', demande.depart.value ? 'Départ : ' + dateFr(demande.depart.value) : '',
        demande.voyageurs.value ? 'Voyageurs : ' + demande.voyageurs.value : '', besoins.length ? 'Besoins : ' + besoins.join(', ') : '',
        demande.budget.value.trim() ? 'Budget indicatif : ' + demande.budget.value.trim() : '', demande.message.value.trim() ? 'Message : ' + demande.message.value.trim() : '',
      ]);
      $('.statut', demande).scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'nearest' });
    });
    $$('[required]', demande).forEach(function (c) { c.addEventListener('input', function () { if (c.value.trim()) { c.removeAttribute('aria-invalid'); var err = c.closest('.champ').querySelector('.erreur'); if (err) err.removeAttribute('data-visible'); } }); });
  }
  var reserver = $('#reserver');
  if (reserver) {
    reserver.addEventListener('submit', function (e) {
      e.preventDefault(); if (!valider(reserver)) return;
      envoyer(reserver, 'Réservation KAZA', [
        'Objet : ' + reserver.objet.value, 'Arrivée : ' + dateFr(reserver.arrivee.value), 'Départ : ' + dateFr(reserver.depart.value), 'Voyageurs : ' + reserver.voyageurs.value,
        'Nom : ' + reserver.nom.value.trim(), 'WhatsApp : ' + reserver.contact.value.trim(), reserver.message.value.trim() ? 'Précisions : ' + reserver.message.value.trim() : '',
      ], 'Une responsable KAZA vous répond avec la disponibilité et les conditions de paiement.');
      $('.statut', reserver).scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'nearest' });
    });
    $$('[required]', reserver).forEach(function (c) { c.addEventListener('input', function () { if (c.value.trim()) { c.removeAttribute('aria-invalid'); var err = c.closest('.champ').querySelector('.erreur'); if (err) err.removeAttribute('data-visible'); } }); c.addEventListener('change', function () { if (c.value) { c.removeAttribute('aria-invalid'); var err = c.closest('.champ').querySelector('.erreur'); if (err) err.removeAttribute('data-visible'); } }); });
  }
  var partenaire = $('#partenaire');
  if (partenaire) {
    partenaire.addEventListener('submit', function (e) {
      e.preventDefault(); if (!valider(partenaire)) return;
      envoyer(partenaire, 'Demande de partenariat KAZA', [
        'Profil : ' + partenaire.profil.value, 'Nom : ' + partenaire.nom.value.trim(), 'Structure : ' + (partenaire.structure.value.trim() || '—'),
        'Contact : ' + partenaire.contact.value.trim(), 'Zone : ' + (partenaire.zone.value.trim() || '—'), partenaire.message.value.trim() ? 'Message : ' + partenaire.message.value.trim() : '',
      ]);
    });
    $$('[required]', partenaire).forEach(function (c) { c.addEventListener('input', function () { if (c.value.trim()) { c.removeAttribute('aria-invalid'); var err = c.closest('.champ').querySelector('.erreur'); if (err) err.removeAttribute('data-visible'); } }); });
  }

  /* dates : l'arrivée ne peut pas être avant aujourd'hui, le départ pas avant l'arrivée */
  $$('input[type="date"][name="arrivee"]').forEach(function (a) {
    var f = a.form, d = f && f.depart; var aujourdhui = new Date().toISOString().slice(0, 10);
    a.min = aujourdhui; if (d) { d.min = aujourdhui; a.addEventListener('change', function () { d.min = a.value || aujourdhui; if (d.value && d.value < d.min) d.value = ''; }); }
  });
})();
