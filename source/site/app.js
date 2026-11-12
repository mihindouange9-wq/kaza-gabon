/* KAZA GABON – vitrine : menu mobile, recherche à cinq onglets, panneau de demande unique (six variantes) → WhatsApp / courriel / copie.
   Parcours (6 nov. 2026) : une question à l'entrée, chaque bouton [data-demande] ouvre le panneau avec les bons champs et l'objet déjà choisi. */
(function () {
  'use strict';
  var CONTACT = window.KAZA_CONTACT || { whatsapp: '', courriel: '' };
  var OBJETS = window.KAZA_OBJETS || {};
  var MODES = window.KAZA_MODES || {};
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fleche = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function dateFr(v) { var p = (v || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v; }
  function echapper(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function normaliser(t) { return (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function aller(el) { if (!el) return; if (window.kazaAller) window.kazaAller(el); else el.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' }); }
  function visible(el) { return el.getClientRects().length > 0; }

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
  function fermerMenu() { if (!menu) return; menu.removeAttribute('data-ouvert'); bouton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-ouvert'); }
  if (bouton && menu) {
    bouton.addEventListener('click', function () {
      var ouvert = menu.hasAttribute('data-ouvert');
      if (ouvert) fermerMenu(); else { menu.setAttribute('data-ouvert', ''); bouton.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-ouvert'); }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', fermerMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.hasAttribute('data-ouvert')) fermerMenu(); });
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

  /* ---------- recherche : cinq onglets, un geste chacun ---------- */
  var recherche = $('#recherche');
  var onglets = $$('.recherche-onglets [data-onglet]');
  var libelleRecherche = $('[data-libelle-recherche]');
  var LIBELLES = { stay: 'Voir les hébergements', tourisme: 'Voir les expériences', immo: 'Décrire ma recherche', conciergerie: 'Demander ce service', diaspora: 'Préparer mon retour' };
  var memoire = {};
  var rangee = $('.recherche-onglets');
  function ombres() { if (!rangee) return; var max = rangee.scrollWidth - rangee.clientWidth; var g = rangee.scrollLeft > 6, d = rangee.scrollLeft < max - 6; rangee.setAttribute('data-ombre', max <= 6 ? '' : g && d ? 'les-deux' : g ? 'gauche' : 'droite'); }
  function modeRecherche(m, focus) {
    recherche.setAttribute('data-mode', m);
    onglets.forEach(function (b) {
      var actif = b.getAttribute('data-onglet') === m; b.setAttribute('aria-selected', actif ? 'true' : 'false'); b.tabIndex = actif ? 0 : -1;
      if (actif && focus) b.focus({ preventScroll: true });
      /* la rangée défile sur téléphone : l'onglet actif est ramené dans la zone visible seulement s'il en sort, sans bouger la page */
      if (actif && rangee && rangee.scrollWidth > rangee.clientWidth + 6) {
        var rb = b.getBoundingClientRect(), rr = rangee.getBoundingClientRect();
        if (rb.left < rr.left + 4 || rb.right > rr.right - 4) rangee.scrollTo({ left: rb.left - rr.left + rangee.scrollLeft - 10, behavior: focus && !reduit ? 'smooth' : 'auto' });
      }
    });
    if (libelleRecherche) libelleRecherche.textContent = LIBELLES[m] || 'Rechercher';
    ombres();
  }
  if (rangee) { rangee.addEventListener('scroll', ombres, { passive: true }); window.addEventListener('resize', ombres); }
  onglets.forEach(function (b, i) {
    b.addEventListener('click', function () { modeRecherche(b.getAttribute('data-onglet')); });
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
      e.preventDefault(); modeRecherche(onglets[(i + k + onglets.length) % onglets.length].getAttribute('data-onglet'), true);
    });
  });
  /* un filtre change la hauteur de la page : les repères de défilement (galerie épinglée, révélations) sont recalculés avant de descendre */
  function recaler() { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }
  function filtrer(selecteur, d) { var n = 0; $$(selecteur).forEach(function (c) { var ok = !d || normaliser(c.getAttribute('data-lieu')).indexOf(d) !== -1; c.hidden = !ok; if (ok) n += 1; }); return n; }
  function montrerResultat(el, texte, action, mode, prefill) {
    el.innerHTML = '<span>' + texte + '</span><button type="button" class="lien-texte" data-demande="' + mode + '">' + action + '</button>';
    var b = $('[data-demande]', el); b.kazaPrefill = prefill;
    el.setAttribute('data-visible', '');
  }
  if (recherche) {
    modeRecherche(recherche.getAttribute('data-mode') || 'stay');
    recherche.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = recherche.getAttribute('data-mode');
      var v = function (nom) { var c = recherche.elements[nom]; return c && c.value ? c.value.trim() : ''; };
      if (m === 'stay') {
        var d = normaliser(v('destination'));
        memoire = { destination: v('destination'), arrivee: v('arrivee'), depart: v('depart'), voyageurs: v('voyageurs') };
        var n = filtrer('.annonce[data-lieu]', d);
        var periode = memoire.arrivee && memoire.depart ? ' du ' + dateFr(memoire.arrivee) + ' au ' + dateFr(memoire.depart) : '';
        var voy = memoire.voyageurs ? ', ' + memoire.voyageurs + ' voyageur' + (memoire.voyageurs > 1 ? 's' : '') : '';
        var texte = (d ? '<b>' + n + ' hébergement' + (n > 1 ? 's' : '') + '</b> pour « ' + echapper(memoire.destination) + ' »' : '<b>' + n + ' hébergements</b>') + periode + voy + '.';
        texte += n ? ' Choisissez-en un et appuyez sur Réserver.' : ' Aucun logement partenaire ici pour l’instant.';
        montrerResultat($('#resultat'), texte, n ? 'Conseillez-moi' : 'Décrire mon séjour à l’équipe KAZA', 'stay', { message: memoire.destination ? 'Destination souhaitée : ' + memoire.destination + '.' : '' });
        recaler(); aller($('#stay'));
      } else if (m === 'tourisme') {
        var dt = normaliser(v('destination'));
        memoire = { destination: v('destination'), date: v('date'), participants: v('participants') };
        var nt = filtrer('.experience[data-lieu]', dt);
        var quand = memoire.date ? ' le ' + dateFr(memoire.date) : '';
        var part = memoire.participants ? ', ' + memoire.participants + ' participant' + (memoire.participants > 1 ? 's' : '') : '';
        var tt = (dt ? '<b>' + nt + ' expérience' + (nt > 1 ? 's' : '') + '</b> pour « ' + echapper(memoire.destination) + ' »' : '<b>' + nt + ' expériences</b>') + quand + part + '.';
        tt += nt ? ' Choisissez-en une et appuyez sur Réserver.' : ' Aucune expérience partenaire ici pour l’instant.';
        montrerResultat($('#resultat-tourisme'), tt, nt ? 'Conseillez-moi' : 'Décrire l’expérience que je cherche', 'tourisme', { message: memoire.destination ? 'Destination souhaitée : ' + memoire.destination + '.' : '' });
        recaler(); aller($('#tourisme'));
      } else if (m === 'immo') {
        ouvrir('immo', { prefill: { transaction: v('transaction'), typeBien: v('typeBien'), ville: v('ville') }, ouvreur: recherche.querySelector('[type="submit"]') });
      } else if (m === 'conciergerie') {
        ouvrir('conciergerie', { prefill: { service: v('service'), quartier: v('quartier'), dateService: v('dateService') }, ouvreur: recherche.querySelector('[type="submit"]') });
      } else if (m === 'diaspora') {
        ouvrir('diaspora', { prefill: { pays: v('pays'), arrivee: v('arriveeDiaspora'), voyageurs: v('voyageursDiaspora') }, ouvreur: recherche.querySelector('[type="submit"]') });
      }
    });
  }

  /* ---------- panneau de demande ---------- */
  var panneau = $('#demande'), fond = $('.demande-fond'), form = $('#formulaire');
  var etapes = { choix: $('[data-etape="choix"]', panneau), form: form, fin: $('[data-etape="fin"]', panneau) };
  var titre = $('#demande-titre'), poleEl = $('[data-pole]', panneau), introEl = $('[data-intro]', panneau), boutonEl = $('[data-bouton]', panneau), retour = $('[data-demande-retour]', panneau);
  var resume = $('[data-objet-resume]', panneau);
  var corps = $('.demande-corps', panneau);
  var ouvert = false, ouvreur = null, mode = '', objetCle = '', depuisChoix = false, minuterie = null, yOuverture = 0, aRetablir = false;
  /* le retour d'historique qui ferme le panneau peut ramener la page à l'ancre de l'adresse (#stay…) : on repose la position d'ouverture */
  function retablir() {
    aRetablir = false;
    var y = yOuverture;
    var poser = function () { if (ouvert || Math.abs(window.scrollY - y) < 2) return; if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo({ top: y, behavior: 'instant' }); };
    poser(); requestAnimationFrame(poser); setTimeout(poser, 80); setTimeout(poser, 300);
  }
  function surTouche(e) {
    if (e.key === 'Escape') { e.preventDefault(); fermer(); return; }
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', panneau).filter(visible);
    if (!f.length) return;
    var premier = f[0], dernier = f[f.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  }
  function etape(nom) {
    Object.keys(etapes).forEach(function (k) { etapes[k].hidden = k !== nom; });
    corps.scrollTop = 0;
    if (nom === 'choix') { titre.textContent = 'Que souhaitez-vous ?'; poleEl.textContent = ''; retour.hidden = true; }
    else retour.hidden = !depuisChoix || nom === 'fin';
  }
  function focaliser() {
    var cible = $$('button, input, select, textarea, a[href]', corps).filter(function (el) { return visible(el) && !el.closest('.demande-objet'); })[0];
    if (cible) setTimeout(function () { cible.focus({ preventScroll: true }); }, reduit ? 0 : 420);
  }
  function remplir(valeurs) {
    Object.keys(valeurs || {}).forEach(function (nom) {
      var val = valeurs[nom]; if (val == null || val === '') return;
      var c = form.elements[nom]; if (!c) return;
      if (c instanceof RadioNodeList) { c.value = val; return; }
      if (c.tagName === 'SELECT') {
        var existe = Array.prototype.some.call(c.options, function (o) { return o.value === val; });
        if (existe) c.value = val; else { var autre = Array.prototype.filter.call(c.options, function (o) { return /^Autre/.test(o.value); })[0]; if (autre) c.value = autre.value; if (!form.message.value) form.message.value = val; }
        return;
      }
      if (c.type === 'checkbox') return;
      if (!c.value) c.value = val;
    });
  }
  function ouvrir(m, o) {
    o = o || {};
    if (!panneau) return;
    clearTimeout(minuterie);
    if (!ouvert) {
      ouvreur = o.ouvreur || document.activeElement;
      yOuverture = window.scrollY;
      panneau.hidden = false; fond.hidden = false;
      requestAnimationFrame(function () { panneau.classList.add('est-ouvert'); fond.classList.add('est-ouvert'); });
      document.body.classList.add('demande-ouverte');
      if (window.lenis) window.lenis.stop();
      try { history.pushState({ kazaDemande: true }, ''); } catch (err) { /* sans historique */ }
      document.addEventListener('keydown', surTouche);
      ouvert = true; depuisChoix = false;
      fermerMenu();
    }
    if (!m) { depuisChoix = true; etape('choix'); focaliser(); return; }
    if (o.depuisChoix) depuisChoix = true;
    var def = MODES[m]; if (!def) return;
    mode = m;
    form.reset();
    $$('[aria-invalid]', form).forEach(function (c) { c.removeAttribute('aria-invalid'); });
    $$('.erreur[data-visible]', form).forEach(function (e) { e.removeAttribute('data-visible'); });
    form.setAttribute('data-mode', m);
    var objet = o.objet && OBJETS[o.objet] ? OBJETS[o.objet] : null;
    objetCle = objet ? o.objet : '';
    if (objet) {
      form.setAttribute('data-objet', o.objet);
      $('.demande-objet-image', resume).innerHTML = '<img src="' + echapper(objet.image) + '" alt="" width="72" height="54" decoding="async">';
      $('[data-objet-type]', resume).textContent = objet.type; $('[data-objet-titre]', resume).textContent = objet.titre; $('[data-objet-lieu]', resume).textContent = objet.lieu;
      resume.hidden = false;
    } else { form.removeAttribute('data-objet'); resume.hidden = true; }
    /* champs obligatoires de la variante (les champs cachés ne sont jamais exigés) */
    $$('input, select, textarea', form).forEach(function (c) { c.required = def.requis.indexOf(c.name) !== -1; });
    $('[data-libelle="contact"]', form).textContent = def.contact;
    form.contact.setAttribute('inputmode', m === 'diaspora' || m === 'partenaire' ? 'text' : 'tel'); /* « WhatsApp ou courriel » : le pavé téléphonique n'a pas d'arobase */
    $('[data-libelle="message"]', form).textContent = def.message;
    form.message.placeholder = def.aide || '';
    titre.textContent = def.titre; poleEl.textContent = def.pole; introEl.textContent = def.intro; boutonEl.textContent = def.bouton;
    remplir(memoire); remplir(o.prefill);
    etape('form'); focaliser();
  }
  function fermer(viaHistorique) {
    if (!ouvert) return;
    ouvert = false;
    panneau.classList.remove('est-ouvert'); fond.classList.remove('est-ouvert');
    document.body.classList.remove('demande-ouverte');
    if (window.lenis) window.lenis.start();
    document.removeEventListener('keydown', surTouche);
    minuterie = setTimeout(function () { panneau.hidden = true; fond.hidden = true; }, reduit ? 0 : 450);
    if (viaHistorique) retablir();
    else if (history.state && history.state.kazaDemande) { aRetablir = true; try { history.back(); } catch (err) { aRetablir = false; } }
    if (ouvreur && ouvreur.focus && document.contains(ouvreur)) ouvreur.focus({ preventScroll: true });
    depuisChoix = false;
  }
  window.addEventListener('popstate', function () { if (ouvert) fermer(true); else if (aRetablir) retablir(); });
  window.kazaDemande = { ouvrir: ouvrir, fermer: fermer };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-demande]');
    if (b) {
      e.preventDefault();
      ouvrir(b.getAttribute('data-demande'), { objet: b.getAttribute('data-objet'), prefill: b.kazaPrefill || { service: b.getAttribute('data-service'), profil: b.getAttribute('data-profil') }, ouvreur: b, depuisChoix: !!b.closest('[data-etape="choix"]') });
      return;
    }
    if (e.target.closest('[data-demande-fermer]')) { e.preventDefault(); fermer(); return; }
    if (e.target.closest('[data-demande-retour]')) { e.preventDefault(); etape('choix'); focaliser(); return; }
    if (e.target.closest('[data-objet-changer]')) { e.preventDefault(); var objet = OBJETS[objetCle]; fermer(); aRetablir = false; aller($('#' + (objet ? objet.pole : 'stay'))); }
  });

  /* ---------- validation ---------- */
  function valider(f) {
    var ok = true;
    var souple = mode === 'diaspora' || mode === 'partenaire'; /* WhatsApp ou courriel */
    var tel = /^\+?[0-9 ().-]{8,}$/, courriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $$('[required]', f).forEach(function (c) {
      if (!visible(c)) return;
      var champ = c.closest('.champ'); var err = champ && champ.querySelector('.erreur');
      var vide = c.type === 'checkbox' ? !c.checked : !c.value.trim();
      var mauvais = false, message = '';
      if (!vide && c.name === 'contact') { mauvais = souple ? !(tel.test(c.value) || courriel.test(c.value)) : !tel.test(c.value); message = souple ? 'Indiquez un numéro WhatsApp avec l’indicatif, ou une adresse de courriel.' : 'Indiquez un numéro WhatsApp complet, avec l’indicatif.'; }
      if (!vide && c.name === 'depart' && f.arrivee.value && c.value < f.arrivee.value) { mauvais = true; message = 'Le départ ne peut pas précéder l’arrivée.'; }
      if (!vide && !mauvais && c.validity && (c.validity.rangeUnderflow || c.validity.rangeOverflow)) { mauvais = true; message = c.type === 'date' ? 'Choisissez une date à venir.' : 'Indiquez un nombre entre ' + c.min + ' et ' + c.max + '.'; }
      if (vide || mauvais) { ok = false; c.setAttribute('aria-invalid', 'true'); if (err) { err.textContent = vide ? 'Ce champ est nécessaire pour vous répondre.' : message; err.setAttribute('data-visible', ''); } }
      else { c.removeAttribute('aria-invalid'); if (err) err.removeAttribute('data-visible'); }
    });
    if (!ok) { var premier = $('[aria-invalid="true"]', f); if (premier) premier.focus(); }
    return ok;
  }
  $$('input, select, textarea', form).forEach(function (c) {
    var lever = function () { if (c.value && c.value.trim()) { c.removeAttribute('aria-invalid'); var champ = c.closest('.champ'); var err = champ && champ.querySelector('.erreur'); if (err) err.removeAttribute('data-visible'); } };
    c.addEventListener('input', lever); c.addEventListener('change', lever);
  });
  /* dates : pas avant aujourd'hui, le départ pas avant l'arrivée */
  var aujourdhui = new Date().toISOString().slice(0, 10);
  $$('input[type="date"]').forEach(function (d) { d.min = aujourdhui; });
  $$('input[name="arrivee"]').forEach(function (a) { var f = a.form, d = f && f.depart; if (!d) return; a.addEventListener('change', function () { d.min = a.value || aujourdhui; if (d.value && d.value < d.min) d.value = ''; }); });

  /* ---------- composition du message et envoi ---------- */
  function val(nom) { var c = form.elements[nom]; if (!c) return ''; if (c instanceof RadioNodeList) return c.value; return (c.value || '').trim(); }
  function ligne(libelle, v) { return v ? libelle + ' : ' + v : ''; }
  function composer() {
    var objet = OBJETS[objetCle];
    var l = [];
    if (mode === 'stay') l = [ligne('Hébergement', objet ? objet.libelle : val('hebergement')), ligne('Arrivée', dateFr(val('arrivee'))), ligne('Départ', dateFr(val('depart'))), ligne('Voyageurs', val('voyageurs'))];
    else if (mode === 'tourisme') l = [ligne('Expérience', objet ? objet.libelle : val('experience')), ligne('Date', dateFr(val('date'))), ligne('Participants', val('participants'))];
    else if (mode === 'immo') l = [ligne('Je veux', val('transaction')), ligne('Type de bien', val('typeBien')), ligne('Ville ou quartier', val('ville')), ligne('Budget indicatif', val('budget'))];
    else if (mode === 'conciergerie') l = [ligne('Service', val('service')), ligne('Quartier ou adresse', val('quartier')), ligne('Date souhaitée', dateFr(val('dateService'))), ligne('Fréquence', val('frequence'))];
    else if (mode === 'diaspora') { var besoins = $$('input[name="besoins"]:checked', form).map(function (c) { return c.value; }); l = [ligne('Pays de départ', val('pays')), ligne('Arrivée', dateFr(val('arrivee'))), ligne('Départ', dateFr(val('depart'))), ligne('Voyageurs', val('voyageurs')), ligne('Besoins', besoins.join(', ')), ligne('Budget indicatif', val('budget'))]; }
    else if (mode === 'partenaire') l = [ligne('Profil', val('profil')), ligne('Structure', val('structure')), ligne('Zone', val('zone'))];
    l.push(ligne('Nom', val('nom')), ligne(mode === 'diaspora' || mode === 'partenaire' ? 'Contact' : 'WhatsApp', val('contact')), ligne(mode === 'partenaire' ? 'Ce que je propose' : mode === 'diaspora' ? 'Attentes' : 'Précisions', val('message')));
    return l.filter(Boolean);
  }
  function envoyer(sujet, lignes) {
    var texte = sujet + '\n' + lignes.join('\n');
    var finTexte = $('[data-fin-texte]', etapes.fin), finLien = $('[data-fin-lien]', etapes.fin);
    if (CONTACT.whatsapp) {
      var url = 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(texte);
      var fenetre = window.open(url, '_blank', 'noopener');
      finTexte.setAttribute('data-etat', 'ok');
      finTexte.textContent = (fenetre ? 'WhatsApp s’ouvre avec votre message : envoyez-le, il arrive directement chez KAZA (' + (CONTACT.whatsappAffiche || CONTACT.whatsapp) + ').' : 'Votre message est rédigé : ouvrez WhatsApp pour l’envoyer à KAZA (' + (CONTACT.whatsappAffiche || CONTACT.whatsapp) + ').');
      finLien.href = url; finLien.hidden = false;
    } else if (CONTACT.courriel) {
      window.location.href = 'mailto:' + CONTACT.courriel + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(texte);
      finTexte.setAttribute('data-etat', 'ok'); finTexte.textContent = 'Votre messagerie s’ouvre avec la demande prête à envoyer à ' + CONTACT.courriel + '.'; finLien.hidden = true;
    } else {
      finTexte.setAttribute('data-etat', 'copie'); finLien.hidden = true;
      var copie = function (reussi) { finTexte.innerHTML = (reussi ? 'Demande copiée. ' : '') + 'Le canal de réception (WhatsApp ou courriel) sera activé au lancement : voici votre message, à envoyer à l’équipe KAZA.<pre></pre>'; finTexte.querySelector('pre').textContent = texte; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(function () { copie(true); }, function () { copie(false); }); else copie(false);
    }
    etape('fin');
    etapes.fin.dispatchEvent(new CustomEvent('kaza:envoye', { bubbles: true }));
    setTimeout(function () { var b = $('.bouton', etapes.fin); if (b && !b.hidden) b.focus({ preventScroll: true }); }, 50);
  }
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); if (!valider(form)) return; envoyer(MODES[mode].sujet, composer()); });
})();
