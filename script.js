(function () {
  'use strict';

  // The GitHub links are wired up but switched OFF: the repositories are private, so a link would just
  // show visitors a 404. When you make them public (after the safety checklist is done), change
  // REPOS_PUBLIC to true and every "soon" badge turns into a real link.
  var REPOS_PUBLIC = false;
  var GITHUB = 'https://github.com/HKugz11';
  var LINKS = {
    xenon: { source: GITHUB + '/xenon', desktop: GITHUB + '/xenon/releases/latest' },
    support: { donate: '' } // needs a payment account set up with a parent first
  };
  if (!REPOS_PUBLIC) { LINKS.xenon = { source: '', desktop: '' }; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // download / source buttons
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var p = el.getAttribute('data-link').split('.');
    var url = (LINKS[p[0]] || {})[p[1]];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.insertAdjacentHTML('beforeend', '<span class="soon">soon</span>');
    }
  });

  // nav: background on scroll + mobile menu
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menuBtn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // skin toggle (modern / terminal)
  var demo = document.getElementById('skinDemo');
  if (demo) {
    var tabs = demo.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        demo.setAttribute('data-skin', t.getAttribute('data-skin'));
        tabs.forEach(function (o) { o.setAttribute('aria-selected', String(o === t)); });
      });
    });
  }

  // accent picker: recolors the whole page (and remembers it on this device)
  var ACCENTS = ['teal', 'mint', 'sky', 'blue', 'violet', 'orchid', 'coral', 'silver'];
  var swBtns = document.querySelectorAll('button.sw[data-accent]');
  var setAccent = function (name, save) {
    if (ACCENTS.indexOf(name) < 0) return;
    document.documentElement.setAttribute('data-accent', name);
    swBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-accent') === name)); });
    if (save) { try { localStorage.setItem('nbl_accent', name); } catch (e) { /* private mode */ } }
  };
  try {
    var savedAccent = localStorage.getItem('nbl_accent');
    setAccent(savedAccent === 'rose' ? 'coral' : savedAccent, false); // "rose" was renamed to "coral"
  } catch (e) { /* no storage */ }
  swBtns.forEach(function (b) {
    b.addEventListener('click', function () { setAccent(b.getAttribute('data-accent'), true); });
  });

  // copy buttons on the setup guide's command boxes
  document.querySelectorAll('pre.cmd').forEach(function (pre) {
    // grab the commands now, before the button is added (and drop the grey "# comments")
    var text = pre.innerText.replace(/[ \t]*#.*$/gm, '').trim();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy these commands');
    btn.addEventListener('click', function () {
      var done = function () { btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { btn.textContent = 'Press Ctrl+C'; });
      } else { btn.textContent = 'Press Ctrl+C'; }
    });
    pre.appendChild(btn);
  });

  // gentle tilt on the hero mock-ups (mouse only)
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-2px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
