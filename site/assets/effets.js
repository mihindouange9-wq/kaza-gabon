/* KAZA GABON – couche d'effets (inspiration : sites de voyage immersifs type Fitzroy Travel).
   Intro, défilement fluide (Lenis), héros en triptyque photo (diaporama plein écran sur téléphone), révélations
   typographiques, parallaxes, galerie des expériences épinglée, fil de vol, tampon KAZA Vérifié, décollage à l'envoi.
   Tout se dégrade : mouvement réduit → page statique ; tactile ou petit écran → version sobre et légère. */
(function () {
  'use strict';
  var html = document.documentElement;
  var reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fin = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if (reduit || !window.gsap || !window.ScrollTrigger) { html.classList.remove('intro'); var i0 = $('#intro'); if (i0) i0.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('effets');
  if (fin) html.classList.add('pointeur-fin');
  var EASE = 'expo.out';
  var large = function () { return innerWidth >= 1100 && innerHeight >= 680; };
  var mobile = function () { return innerWidth < 960; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- défilement fluide ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  window.kazaAller = function (el, offset) {
    var decalage = offset == null ? -84 : offset;
    if (lenis) lenis.scrollTo(el, { offset: decalage, duration: 1.3, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href'); if (id.length < 2) return; var cible = $(id); if (!cible) return;
      ev.preventDefault(); window.kazaAller(cible, id === '#haut' ? 0 : -84); history.replaceState(null, '', id);
    });
  });
  var menu = $('.menu'), menuBouton = $('.menu-bouton');
  if (menuBouton && lenis) menuBouton.addEventListener('click', function () { setTimeout(function () { if (menu.hasAttribute('data-ouvert')) lenis.stop(); else lenis.start(); }, 0); });
  if (menu && lenis) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { lenis.start(); }); });

  /* ---------- découpe des titres en mots masqués ---------- */
  function decouper(el) {
    if (el.dataset.decoupe) return $$('.mot > span', el);
    var frag = document.createDocumentFragment();
    function poser(texte, classe) {
      /* seules les espaces ordinaires séparent les mots : les espaces insécables (fines ou non) restent collées au mot */
      texte.split(/([ \t\r\n]+)/).forEach(function (t) {
        if (!t) return;
        if (/^[ \t\r\n]+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
        var m = document.createElement('span'); m.className = 'mot' + (classe ? ' ' + classe : ''); var i = document.createElement('span'); i.textContent = t; m.appendChild(i); frag.appendChild(m);
      });
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) poser(n.nodeValue);
      else if (n.nodeType === 1 && n.tagName === 'BR') frag.appendChild(document.createElement('br'));
      else if (n.nodeType === 1) poser(n.textContent, n.tagName === 'EM' ? 'mot--accent' : '');
    });
    el.innerHTML = ''; el.appendChild(frag); el.dataset.decoupe = '1';
    return $$('.mot > span', el);
  }
  function revelerTitre(el, delai) {
    var mots = decouper(el);
    gsap.set(mots, { yPercent: 110 });
    return gsap.to(mots, { yPercent: 0, duration: 1.15, ease: EASE, stagger: .04, delay: delai || 0, overwrite: true });
  }

  /* ---------- intro : le logo s'écrit, les toits s'allument, l'avion décolle, le rideau se lève ---------- */
  var intro = $('#intro');
  var depart = 0;
  if (intro && html.classList.contains('intro')) {
    if (lenis) lenis.stop();
    var svg = $('svg', intro);
    var toitsIntro = $$('polygon[fill="#C7F974"]', svg), arc = $('path[stroke]', svg), avion = $('g', svg);
    gsap.set(toitsIntro, { scale: 0, transformOrigin: '50% 100%' });
    if (arc) { var lg = arc.getTotalLength(); gsap.set(arc, { strokeDasharray: lg, strokeDashoffset: lg }); }
    gsap.set(avion, { opacity: 0 });
    gsap.timeline()
      .to('.intro-logo', { clipPath: 'inset(0 0% 0 0)', duration: .75, ease: EASE }, 0)
      .to(toitsIntro, { scale: 1, duration: .55, ease: 'back.out(1.7)', stagger: .12 }, .35)
      .to(arc, { strokeDashoffset: 0, duration: .6, ease: 'power2.out' }, .55)
      .to(avion, { opacity: 1, duration: .2 }, .95)
      .fromTo('.intro-ligne', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: EASE }, .8)
      .to(avion, { x: 320, y: -260, duration: .7, ease: 'power2.in' }, 1.2)
      .to(avion, { opacity: 0, duration: .2 }, 1.7)
      .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: .95, ease: 'expo.inOut', onComplete: function () { html.classList.remove('intro'); intro.remove(); if (lenis) lenis.start(); } }, 1.55);
    depart = 1.75;
  } else { html.classList.remove('intro'); if (intro) intro.remove(); }

  /* ---------- héros : triptyque photo (ordinateur) ou diaporama plein écran (téléphone) ---------- */
  var heros = $('.heros'), panneaux = $$('.heros-scene .panneau'), legende = $('.heros-legende [data-legende]'), compteur = $('.heros-compteur');
  var actif = 0, cycle = null, herosVisible = true;
  function activer(i) {
    actif = (i + panneaux.length) % panneaux.length;
    panneaux.forEach(function (p, k) { p.classList.toggle('est-actif', k === actif); });
    if (legende) legende.textContent = panneaux[actif].getAttribute('data-legende');
    if (compteur) compteur.textContent = pad(actif + 1) + ' / ' + pad(panneaux.length);
    if (mobile()) gsap.fromTo($('img', panneaux[actif]), { scale: 1.14 }, { scale: 1, duration: 7, ease: 'none', overwrite: true });
  }
  function relancer() { clearInterval(cycle); cycle = setInterval(function () { if (herosVisible && !document.hidden) activer(actif + 1); }, mobile() ? 5200 : 4600); }
  if (heros && panneaux.length) {
    activer(0); relancer();
    panneaux.forEach(function (p, k) {
      if (fin) p.addEventListener('mouseenter', function () { activer(k); relancer(); });
    });
    var x0 = null;
    heros.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    heros.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) { activer(actif + (dx < 0 ? 1 : -1)); relancer(); } }, { passive: true });
    ScrollTrigger.create({ trigger: heros, start: 'top bottom', end: 'bottom top', onToggle: function (st) { herosVisible = st.isActive; } });

    var h1 = $('h1', heros);
    var th = gsap.timeline({ delay: depart });
    var imgs = panneaux.map(function (p) { return $('img', p); });
    if (!mobile()) {
      gsap.set(panneaux, { clipPath: 'inset(100% 0 0 0)' });
      th.to(panneaux, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: EASE, stagger: .12, clearProps: 'clipPath' }, 0)
        .fromTo(imgs, { scale: 1.25 }, { scale: 1, duration: 2.2, ease: EASE, stagger: .12 }, 0);
    } else {
      th.fromTo(panneaux[0], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out', clearProps: 'opacity' }, 0);
    }
    th.from('.heros-voile', { opacity: 0, duration: 1.4, ease: 'power2.out' }, .2)
      .from('.entete .logo, .entete .logo--mot, .nav-principale a, .entete-actions > *', { y: -12, opacity: 0, duration: .9, ease: EASE, stagger: .05 }, .5)
      .from('.heros-sur', { x: -24, opacity: 0, duration: .9, ease: EASE }, .55)
      .add(revelerTitre(h1), .65)
      .from('.heros-intro', { y: 24, opacity: 0, duration: 1, ease: EASE }, .95)
      .from('.heros-poles li', { y: 16, opacity: 0, duration: .8, ease: EASE, stagger: .05 }, 1.1)
      .from('.heros-pied > *', { y: 16, opacity: 0, duration: .9, ease: EASE, stagger: .1 }, 1.2)
      .from('.recherche-bande .recherche', { y: 40, opacity: 0, duration: 1.1, ease: EASE }, 1.1)
      .from('.recherche-bande .reassurance li', { y: 12, opacity: 0, duration: .8, ease: EASE, stagger: .05 }, 1.35);
    /* parallaxe : chaque panneau glisse à sa vitesse, le texte s'éloigne */
    if (!mobile()) {
      imgs.forEach(function (img, k) { gsap.to(img, { yPercent: 5 + k * 2.5, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: 'bottom top', scrub: true } }); });
    } else {
      gsap.to('.heros-scene', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: 'bottom top', scrub: true } });
    }
    gsap.to('.heros-copie', { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: '70% top', scrub: true } });
    gsap.to('.heros-pied', { opacity: 0, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: '35% top', scrub: true } });
    /* inclinaison au pointeur et matière liquide sur la plage (ordinateur) */
    if (fin && !mobile()) {
      var scene = $('.heros-scene');
      var sx = gsap.quickTo(scene, 'x', { duration: 1.2, ease: 'power3.out' }), sy = gsap.quickTo(scene, 'y', { duration: 1.2, ease: 'power3.out' });
      heros.addEventListener('mousemove', function (e) { var px = e.clientX / innerWidth - .5, py = e.clientY / innerHeight - .5; sx(-px * 14); sy(-py * 10); }, { passive: true });
      heros.addEventListener('mouseleave', function () { sx(0); sy(0); });
      var plage = $('.panneau--plage', heros), photoPlage = plage && $('img', plage);
      if (window.KAZA_LIQUIDE && KAZA_LIQUIDE.supported() && plage && photoPlage) {
        var lancer = function () { setTimeout(function () { var liq = KAZA_LIQUIDE.liquid(plage, photoPlage, { pointerTarget: plage, focal: [.5, .5], dpr: 1.25, flowSize: 160, radius: .22, dissipate: .96, strength: 1, amount: .05, chroma: .012, ripple: .0035, onReady: function () { plage.classList.add('liquide-pret'); }, onFail: function () { plage.classList.remove('liquide-pret'); } }); if (!liq) plage.classList.remove('liquide-pret'); }, (depart + 2.4) * 1000); };
        if (photoPlage.complete) lancer(); else photoPlage.addEventListener('load', lancer, { once: true });
      }
    }
  }

  /* ---------- en-tête : transparent sur le héros, verre dépoli ensuite, se range quand on descend ---------- */
  var entete = $('.entete'), dernierY = 0;
  ScrollTrigger.create({ onUpdate: function (st) { var y = st.scroll(); entete.classList.toggle('est-reduit', y > 60); entete.classList.toggle('est-cache', y > 420 && y > dernierY + 2 && !document.body.classList.contains('menu-ouvert')); dernierY = y; } });

  /* ---------- bande de toits : légère dérive ---------- */
  gsap.fromTo('.toits-bande svg', { x: -40 }, { x: 40, ease: 'none', scrollTrigger: { trigger: '.toits-bande', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- révélations au défilement ---------- */
  var reveals = $$('[data-reveal]').filter(function (el) { return !el.closest('.heros'); });
  reveals.forEach(function (el) { el.classList.add('visible'); });
  gsap.set(reveals, { y: 44, opacity: 0, filter: fin ? 'blur(10px)' : 'none' });
  ScrollTrigger.batch(reveals, { start: 'top 90%', once: true, onEnter: function (lot) { gsap.to(lot, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: EASE, stagger: .08, clearProps: 'filter' }); } });
  $$('.section-tete h2, .pourquoi h2, .verification h2, .diaspora h2, .reservation h2, .partenaires h2').forEach(function (h) {
    decouper(h); gsap.set($$('.mot > span', h), { yPercent: 110 });
    ScrollTrigger.create({ trigger: h, start: 'top 86%', once: true, onEnter: function () { revelerTitre(h); } });
  });
  /* photos : rideau qui se lève et zoom qui se pose */
  function rideau(f, rayon) {
    var img = $('img', f);
    gsap.set(f, { clipPath: 'inset(0 0 100% 0 round ' + rayon + 'px)' }); if (img) gsap.set(img, { scale: 1.16 });
    ScrollTrigger.create({ trigger: f, start: 'top 88%', once: true, onEnter: function () { gsap.to(f, { clipPath: 'inset(0 0 0% 0 round ' + rayon + 'px)', duration: 1.3, ease: EASE, clearProps: 'clipPath' }); if (img) gsap.to(img, { scale: 1, duration: 1.6, ease: EASE }); } });
  }
  $$('.annonce figure').forEach(function (f) { rideau(f, 16); });
  $$('.verif-visuel').forEach(function (f) { rideau(f, 24); });
  if (fin) $$('.annonce figure img').forEach(function (img) { gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: true } }); });

  /* ---------- Pourquoi KAZA : grande image lente, petite image rapide, traits des temps ---------- */
  var pourquoi = $('.pourquoi');
  if (pourquoi) {
    var grande = $('.pourquoi-visuel .grande', pourquoi), petite = $('.pourquoi-visuel .petite', pourquoi);
    if (grande) { rideau(grande, 20); gsap.fromTo($('img', grande), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: pourquoi, start: 'top bottom', end: 'bottom top', scrub: true } }); }
    if (petite) {
      gsap.set(petite, { y: 40, opacity: 0, rotate: -4 });
      ScrollTrigger.create({ trigger: petite, start: 'top 92%', once: true, onEnter: function () { gsap.to(petite, { y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: EASE, delay: .35, clearProps: 'rotate,opacity' }); } });
      gsap.fromTo($('img', petite), { yPercent: 7 }, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: pourquoi, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    $$('.temps li', pourquoi).forEach(function (li) {
      var trait = $('.temps-trait', li); if (!trait) return;
      ScrollTrigger.create({ trigger: li, start: 'top 85%', once: true, onEnter: function () { gsap.fromTo(trait, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE, transformOrigin: 'left center' }); } });
    });
  }

  /* ---------- expériences : galerie épinglée qui glisse à l'horizontale (ordinateur) ---------- */
  var tourisme = $('#tourisme'), piste = $('#tourisme .experiences');
  if (tourisme && piste && large()) {
    tourisme.classList.add('est-piste');
    var nExp = $$('.experience', piste).length;
    var progres = document.createElement('div'); progres.className = 'piste-progres'; progres.setAttribute('aria-hidden', 'true');
    progres.innerHTML = '<b class="piste-compteur">01 / ' + pad(nExp) + '</b><svg viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M4 20H396" stroke="currentColor" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/></svg><span class="piste-avion"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" transform="rotate(90 12 12)"/></svg></span>';
    $('.section-tete', tourisme).appendChild(progres);
    var avionPiste = $('.piste-avion', progres), compteurPiste = $('.piste-compteur', progres);
    var deplacement = function () { return Math.max(0, piste.scrollWidth - piste.clientWidth); };
    gsap.to(piste, { x: function () { return -deplacement(); }, ease: 'none', scrollTrigger: { trigger: tourisme, start: 'top top', end: function () { return '+=' + (deplacement() + innerHeight * .25); }, scrub: .8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: function (st) { gsap.set(avionPiste, { x: st.progress * (progres.clientWidth - 70 - 28) }); compteurPiste.textContent = pad(Math.min(nExp, 1 + Math.floor(st.progress * nExp * .999))) + ' / ' + pad(nExp); } } });
    $$('.experience', piste).forEach(function (e) { var img = $('img', e); if (img) gsap.fromTo(img, { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: tourisme, start: 'top top', end: function () { return '+=' + (deplacement() + innerHeight * .25); }, scrub: true } }); });
  } else {
    $$('.experience figure').forEach(function (f) { rideau(f, 20); });
  }

  /* ---------- tampon KAZA Vérifié ---------- */
  var tampon = $('.verif-visuel .grand-badge');
  if (tampon) {
    gsap.set(tampon, { scale: 1.9, rotate: -14, opacity: 0 });
    ScrollTrigger.create({ trigger: tampon, start: 'top 82%', once: true, onEnter: function () {
      gsap.to(tampon, { scale: 1, rotate: 0, opacity: 1, duration: .75, ease: 'back.out(1.9)', delay: .3 });
      gsap.fromTo('.verif-visuel', { boxShadow: '0 0 0 0 rgba(199,249,116,.55)' }, { boxShadow: '0 0 0 34px rgba(199,249,116,0)', duration: 1.2, ease: 'power2.out', delay: .55, clearProps: 'boxShadow' });
    } });
  }

  /* ---------- fil de vol : un avion suit la lecture le long de la marge droite (grand écran) ---------- */
  var vol = $('#vol');
  if (vol && fin && innerWidth >= 1300) {
    var trace = $('.vol-trace', vol), avionVol = $('.vol-avion', vol), main = $('main');
    var longueur = 0, dernierP = 0, sections = $$('main section');
    function construire() {
      var H = main.offsetHeight, W = innerWidth, gouttiere = Math.max(60, (W - 1200) / 2);
      var x0 = W - gouttiere / 2, pointDepart;
      var herosTrace = $('.heros-fond .trajectoire g');
      if (herosTrace) { var r = herosTrace.getBoundingClientRect(), m = main.getBoundingClientRect(); pointDepart = [r.left + r.width / 2 - m.left, r.top + r.height / 2 - m.top]; } else pointDepart = [x0, 80];
      var d = 'M' + pointDepart[0].toFixed(1) + ' ' + pointDepart[1].toFixed(1);
      var pas = 520, y = pointDepart[1], i = 0;
      while (y < H - 120) {
        var y2 = Math.min(H - 120, y + pas); var cx = x0 + Math.sin(i * 1.7) * 34, cy = (y + y2) / 2;
        d += ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + (x0 + Math.sin((i + 1) * 1.1) * 18).toFixed(1) + ' ' + y2.toFixed(1);
        y = y2; i++;
      }
      vol.setAttribute('viewBox', '0 0 ' + W + ' ' + H); vol.setAttribute('width', W); vol.setAttribute('height', H);
      trace.setAttribute('d', d); longueur = trace.getTotalLength();
      trace.setAttribute('stroke-dasharray', '3 11'); placer(dernierP);
    }
    function placer(p) {
      dernierP = p; if (!longueur) return;
      var l = Math.min(longueur, Math.max(0, p * longueur)); var pt = trace.getPointAtLength(l), pt2 = trace.getPointAtLength(Math.min(longueur, l + 6));
      var angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      avionVol.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + (angle - 90).toFixed(1) + ') scale(1.5) translate(-12 -12)');
      trace.setAttribute('stroke-dashoffset', (-p * 900).toFixed(1));
      var mr = main.getBoundingClientRect(); var yAbs = pt.y + mr.top + scrollY; var clair = true;
      for (var s = 0; s < sections.length; s++) { var r = sections[s].getBoundingClientRect(); var top = r.top + scrollY; if (yAbs >= top && yAbs < top + r.height) { clair = !sections[s].classList.contains('sombre') && !sections[s].classList.contains('confiance'); break; } }
      vol.classList.toggle('vol--clair', clair);
      vol.classList.toggle('vol--visible', p > .03);
    }
    construire();
    var heroAvion = $('.heros-fond .trajectoire g'); if (heroAvion) gsap.to(heroAvion, { opacity: 0, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: '12% top', scrub: true } });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (st) { placer(st.progress); } });
    ScrollTrigger.addEventListener('refresh', construire);
    var attente; window.addEventListener('resize', function () { clearTimeout(attente); attente = setTimeout(construire, 200); });
  } else if (vol) vol.remove();

  /* ---------- décollage à l'envoi d'un formulaire ---------- */
  document.addEventListener('kaza:envoye', function (e) {
    var statut = $('.statut', e.target); if (!statut) return;
    var av = document.createElement('span'); av.className = 'statut-avion'; av.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/></svg>';
    statut.appendChild(av);
    gsap.fromTo(av, { x: -10, y: 26, opacity: 0, rotate: 60 }, { x: statut.clientWidth - 30, y: -34, opacity: 1, rotate: 40, duration: 1.4, ease: 'power2.inOut', onComplete: function () { gsap.to(av, { opacity: 0, duration: .3, onComplete: function () { av.remove(); } }); } });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
