/* KAZA – nuages de couleur : des nappes des quatre couleurs de la palette (Eggshell, Pastel Green, Sage Green,
   Dark Forest Green) qui se mélangent et dérivent lentement derrière toute la page. Canvas de 240 × 135 étiré sur
   l'écran (le lissage fait le dégradé), redessiné à 30 images/s au plus, figé si le mouvement est réduit, en pause
   quand l'onglet est caché. Aucune dépendance. */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  canvas.className = 'nuages'; canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  document.body.insertBefore(canvas, document.body.firstChild);
  var W = 240, H = 135; canvas.width = W; canvas.height = H;
  var EGGSHELL = [240, 243, 229], PASTEL = [186, 210, 171], SAGE = [130, 165, 119], FORET = [21, 54, 17];
  /* chaque nappe : couleur, opacité au centre, rayon (en fraction de la largeur), trajectoire sinusoïdale propre */
  var nappes = [
    { c: PASTEL, a: .85, r: .62, vx: .11, vy: .09, px: 0.0, py: 1.2 },
    { c: SAGE, a: .62, r: .5, vx: .07, vy: .13, px: 2.1, py: 0.4 },
    { c: EGGSHELL, a: .9, r: .55, vx: .09, vy: .06, px: 4.0, py: 2.6 },
    { c: PASTEL, a: .7, r: .45, vx: .14, vy: .1, px: 1.3, py: 3.3 },
    { c: FORET, a: .16, r: .42, vx: .06, vy: .08, px: 5.2, py: 1.9 },
    { c: SAGE, a: .5, r: .58, vx: .1, vy: .07, px: 3.4, py: 5.1 },
    { c: EGGSHELL, a: .8, r: .4, vx: .12, vy: .11, px: 0.7, py: 4.4 },
    { c: PASTEL, a: .6, r: .66, vx: .05, vy: .12, px: 2.8, py: 0.9 },
  ];
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function dessiner(t) {
    ctx.fillStyle = rgba(EGGSHELL, 1); ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < nappes.length; i++) {
      var n = nappes[i];
      var x = W * (.5 + .48 * Math.sin(t * n.vx + n.px)), y = H * (.5 + .5 * Math.cos(t * n.vy + n.py));
      var r = W * n.r * (1 + .12 * Math.sin(t * .2 + n.px));
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(n.c, n.a)); g.addColorStop(.55, rgba(n.c, n.a * .45)); g.addColorStop(1, rgba(n.c, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  }
  var depart = performance.now() * .001 + Math.random() * 100, dernier = 0, actif = true;
  function boucle(now) {
    if (!actif) return;
    if (now - dernier >= 33) { dernier = now; dessiner(now * .001 + depart); }
    requestAnimationFrame(boucle);
  }
  dessiner(depart);
  if (reduit) return;
  requestAnimationFrame(boucle);
  document.addEventListener('visibilitychange', function () { var visible = !document.hidden; if (visible && !actif) { actif = true; requestAnimationFrame(boucle); } else if (!visible) actif = false; });
})();
