(function () {
  "use strict";
  var site = window.SITE || {};

  /* ---- repository links and release state (docs/site.config.js) ---- */
  if (site.repoUrl) {
    document.querySelectorAll("[data-repo]").forEach(function (a) { a.href = site.repoUrl; });
    var clone = document.querySelector("[data-clone]");
    if (clone) clone.textContent = "git clone " + site.repoUrl + ".git";
  }
  if (site.codeReleased) {
    document.querySelectorAll("[data-code-tag]").forEach(function (t) { t.hidden = true; });
    document.querySelector('[data-code="soon"]').hidden = true;
    document.querySelector('[data-code="released"]').hidden = false;
  }

  /* ---- equations ---- */
  if (window.renderMathInElement) {
    window.renderMathInElement(document.querySelector("#method"), {
      delimiters: [{ left: "$$", right: "$$", display: true }], throwOnError: false
    });
  }

  /* ---- clips play only while visible; reduced motion gets controls ---- */
  var clips = document.querySelectorAll("video");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    clips.forEach(function (v) { v.controls = true; });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var p = e.target.play();
          if (p) p.catch(function () { e.target.controls = true; });
        } else { e.target.pause(); }
      });
    }, { threshold: 0.25 });
    clips.forEach(function (v) { io.observe(v); });
  }

  /* ---- YouTube loads only on click ---- */
  document.querySelectorAll(".yt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = document.createElement("div");
      box.className = "yt";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.dataset.yt + "?autoplay=1&rel=0";
      f.title = "Supplementary video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.allowFullscreen = true;
      box.appendChild(f);
      btn.replaceWith(box);
      f.focus();
    });
  });

  /* ---- copy BibTeX ---- */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    var label = b.textContent;
    b.addEventListener("click", function () {
      var el = document.querySelector(b.dataset.copy);
      function done() { b.textContent = "Copied"; setTimeout(function () { b.textContent = label; }, 1800); }
      function select() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = "Press Ctrl+C"; setTimeout(function () { b.textContent = label; }, 2500);
      }
      if (navigator.clipboard) navigator.clipboard.writeText(el.textContent).then(done, select); else select();
    });
  });

  /* ---- success-rate chart. Points are read from the vector figure in the paper. ---- */
  var series = [
    { name: "Nonlinear inertia + Coriolis (ours)", end: "Ours, inertia + Coriolis", label: "90%", c: "--c-dec", k: "dec dash", dash: "7 4", w: 2,
      d: [[0,100],[1.6,100],[1.8,99.5],[2.2,99.5],[2.4,98.5],[2.6,98],[2.8,98],[3.2,96],[3.4,96],[3.6,95.5],[4.2,95.5],[4.4,94.5],[4.6,94],[5,94],[5.4,93],[5.6,92.5],[5.8,92],[6,91.5],[6.2,89.5],[10,89.5]] },
    { name: "Nonlinear inertia (ours)", end: "Ours, nonlinear inertia", label: "88%", c: "--c-dec", k: "dec dot", dash: "2 4", w: 2,
      d: [[0,100],[1.2,100],[1.4,99.5],[1.6,99.5],[1.8,99],[2.2,99],[2.6,98],[2.8,96.5],[3,96],[3.2,96],[3.4,95],[3.6,94.5],[3.8,93.5],[4,93],[4.2,93],[4.4,92.5],[4.6,91.5],[4.8,91.5],[5,91],[5.2,91],[5.8,89.5],[6,89],[6.2,89],[6.6,88],[10,88]] },
    { name: "Linearized inertia, 60 Hz (ours)", end: "Ours, 60 Hz on hardware", label: "86%", c: "--c-dec", k: "dec", dash: "", w: 3,
      d: [[0,100],[1.6,100],[1.8,99.5],[2.2,99.5],[2.6,98.5],[2.8,98],[3,97.5],[3.4,95.5],[3.6,94],[3.8,92],[4,89.5],[4.2,88.5],[4.6,88.5],[4.8,88],[5,88],[5.2,87],[6.6,87],[6.8,86.5],[7.2,86.5],[7.4,86],[10,86]] },
    { name: "Kino-centroidal, inverse dyn.", end: "Kino-centroidal, ID", label: "69%", c: "--c-kino", k: "kino", dash: "", w: 2,
      d: [[0,100],[0.2,95],[2,95],[2.2,94.5],[2.4,92.5],[2.6,92],[2.8,91],[3,91],[3.2,89.5],[3.4,89],[3.6,89],[3.8,87],[4,85.5],[4.2,83],[4.6,83],[4.8,80.5],[5,79],[5.2,79],[5.4,78],[5.6,76.5],[5.8,75.5],[6,75],[6.4,74],[6.6,73],[6.8,73],[7,71.5],[7.6,70],[7.8,70],[8,69.5],[10,69.5]] },
    { name: "Whole-body, ProxDDP", end: "Whole-body, ProxDDP", label: "35%", c: "--c-wb", k: "wb", dash: "", w: 2,
      d: [[0,100],[1,100],[1.2,97],[1.4,91],[1.6,84.5],[1.8,80.5],[2,78],[2.2,76.5],[2.6,74.5],[2.8,74],[3,73],[3.2,71],[3.4,70.5],[3.6,69.5],[3.8,67.5],[4.2,67.5],[4.4,66.5],[4.6,65],[4.8,62.5],[5,62],[5.2,60.5],[5.8,57.5],[6,55.5],[6.2,53.5],[6.4,53],[6.6,53],[6.8,51],[7,48.5],[7.2,46.5],[7.4,43],[7.6,40.5],[7.8,39.5],[8,39.5],[8.2,38],[8.4,37.5],[9,37.5],[9.2,36.5],[9.6,35.5],[9.8,35.5],[10,35]] },
    { name: "Kino-centroidal, PD", end: "Kino-centroidal, PD", label: "28%", c: "--c-kino", k: "kino dash", dash: "7 4", w: 2,
      d: [[0,100],[0.4,100],[0.6,99.5],[0.8,99.5],[1,98.99],[1.8,98.99],[2,97.99],[2.2,97.99],[2.4,96.48],[2.6,96.48],[2.8,94.47],[3,92.46],[3.4,87.44],[3.6,82.41],[3.8,80.4],[4,72.86],[4.2,68.84],[4.6,63.82],[4.8,60.8],[5,55.28],[5.2,54.27],[5.4,52.26],[5.6,49.25],[5.8,46.23],[6,44.22],[6.2,42.21],[6.4,41.21],[6.6,39.7],[6.8,38.69],[7,36.68],[7.2,34.67],[7.4,33.17],[7.6,31.16],[7.8,30.65],[8,30.65],[8.2,30.15],[8.4,30.15],[8.6,29.65],[9,29.65],[9.2,29.15],[9.4,28.64],[9.8,27.64],[10,27.64]] }
  ];
  var host = document.getElementById("chart");
  if (!host) return;
  var css = getComputedStyle(document.documentElement);
  function at(d, x) {
    for (var i = 1; i < d.length; i++) if (x <= d[i][0] + 1e-9) {
      var a = d[i - 1], b = d[i], t = (x - a[0]) / (b[0] - a[0]);
      return a[1] + t * (b[1] - a[1]);
    }
    return d[d.length - 1][1];
  }
  function draw() {
    var W = host.clientWidth, wide = W > 640, H = wide ? 400 : 330;
    var m = { l: 46, r: wide ? 214 : 46, t: 14, b: 48 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
    function X(v) { return m.l + v / 10 * pw; }
    function Y(v) { return m.t + (100 - v) / 100 * ph; }
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" height="' + H + '">', i;
    for (i = 0; i <= 100; i += 20) s += '<line class="grid" x1="' + m.l + '" x2="' + X(10) + '" y1="' + Y(i) + '" y2="' + Y(i) + '"/><text x="' + (m.l - 8) + '" y="' + (Y(i) + 4) + '" text-anchor="end">' + i + (i === 100 ? "%" : "") + "</text>";
    for (i = 0; i <= 10; i += 2) s += '<text x="' + X(i) + '" y="' + (Y(0) + 20) + '" text-anchor="middle">' + i + "</text>";
    s += '<line class="axis" x1="' + m.l + '" x2="' + X(10) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    s += '<text x="' + X(5) + '" y="' + (H - 6) + '" text-anchor="middle">Distance traveled (m)</text>';
    /* draw the hardware variant last so it sits on top */
    [0, 1, 3, 4, 5, 2].forEach(function (j) {
      var q = series[j];
      s += '<polyline fill="none" stroke="' + css.getPropertyValue(q.c) + '" stroke-width="' + q.w + '" stroke-linejoin="round"' + (q.dash ? ' stroke-dasharray="' + q.dash + '"' : "") + ' points="' + q.d.map(function (p) { return X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" ") + '"/>';
    });
    /* direct labels, pushed apart to a minimum spacing */
    var ys = series.map(function (q) { return Y(q.d[q.d.length - 1][1]); }), gap = 17;
    ys[0] -= 14; ys[1] = Math.max(ys[1], ys[0] + gap); ys[2] = Math.max(ys[2], ys[1] + gap);
    for (i = 3; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + gap);
    series.forEach(function (q, j) {
      var y0 = Y(q.d[q.d.length - 1][1]), y = ys[j];
      s += '<line stroke="' + css.getPropertyValue(q.c) + '" stroke-opacity=".6" x1="' + (X(10) + 2) + '" y1="' + y0 + '" x2="' + (X(10) + 10) + '" y2="' + y + '"/>';
      s += '<text class="end" x="' + (X(10) + 13) + '" y="' + (y + 4.5) + '">' + q.label + (wide ? " " + q.end : "") + "</text>";
    });
    s += '<line class="cross" y1="' + m.t + '" y2="' + Y(0) + '" visibility="hidden"/><rect x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '" fill="transparent"/></svg><div class="tip" hidden></div>';
    host.innerHTML = s;
    var svg = host.firstChild, cross = svg.querySelector(".cross"), tip = host.querySelector(".tip");
    function move(e) {
      var r = svg.getBoundingClientRect(), px = e.clientX - r.left;
      if (px < m.l - 4 || px > X(10) + 4) return leave();
      var v = Math.max(0, Math.min(10, Math.round((px - m.l) / pw * 50) / 5));
      cross.setAttribute("x1", X(v)); cross.setAttribute("x2", X(v)); cross.setAttribute("visibility", "visible");
      tip.hidden = false;
      tip.innerHTML = "<strong>" + v.toFixed(1) + " m</strong>" + series.map(function (q) {
        return '<div><i class="key ' + q.k + '"></i>' + q.name + "<b>" + at(q.d, v).toFixed(1) + "%</b></div>";
      }).join("");
      var tw = tip.offsetWidth, left = X(v) + 14;
      if (left + tw > W) left = X(v) - tw - 14;
      tip.style.left = Math.max(0, left) + "px";
      tip.style.top = (v < 5 ? ph - tip.offsetHeight + m.t - 8 : ph - tip.offsetHeight + m.t - 8) + "px";
    }
    function leave() { tip.hidden = true; cross.setAttribute("visibility", "hidden"); }
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerdown", move);
    svg.addEventListener("pointerleave", leave);
  }
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  var last = host.clientWidth, timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { if (host.clientWidth !== last) { last = host.clientWidth; draw(); } }, 120);
  });
})();
