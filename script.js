(function () {
  'use strict';

  // Fill these in as releases are published. Empty = the button shows a "soon" badge instead of a dead link.
  var LINKS = {
    xenon: { source: '', desktop: '' },
    iridium: { source: '' },
    support: { donate: '' }
  };

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
  var ACCENTS = ['teal', 'mint', 'sky', 'blue', 'violet', 'orchid', 'rose', 'silver'];
  var swBtns = document.querySelectorAll('button.sw[data-accent]');
  var setAccent = function (name, save) {
    if (ACCENTS.indexOf(name) < 0) return;
    document.documentElement.setAttribute('data-accent', name);
    swBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-accent') === name)); });
    if (save) { try { localStorage.setItem('nbl_accent', name); } catch (e) { /* private mode */ } }
  };
  try { setAccent(localStorage.getItem('nbl_accent'), false); } catch (e) { /* no storage */ }
  swBtns.forEach(function (b) {
    b.addEventListener('click', function () { setAccent(b.getAttribute('data-accent'), true); });
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
