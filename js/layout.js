/* =========================================================
   layout.js — injects the SVG icon sprite, header and footer
   onto every page. Marks the active nav link from
   <body data-page="about"> etc.
   Self-contained: does NOT require js/icons.js.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. SVG ICON SPRITE
        Injected immediately so <use href="#i-..."> works
        the instant the header is built.
     --------------------------------------------------------- */
  var SPRITE = ''
    + '<svg class="sprite" aria-hidden="true" focusable="false" '
    +      'style="position:absolute!important;width:0!important;height:0!important;overflow:hidden!important">'
    + '<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>'
    + '<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>'
    + '<symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5z"/><path d="M8 3v18"/></symbol>'
    + '<symbol id="i-flask" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v5.2L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-3L14 8.2V3"/><path d="M7.5 14h9"/></symbol>'
    + '<symbol id="i-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H5a2 2 0 0 0 0 4h2M17 6h2a2 2 0 0 1 0 4h-2"/></symbol>'
    + '<symbol id="i-bus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 11h18M7 17v2M17 17v2"/><circle cx="7.5" cy="14" r=".8"/><circle cx="16.5" cy="14" r=".8"/></symbol>'
    + '<symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></symbol>'
    + '<symbol id="i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17 5.2a3.4 3.4 0 0 1 0 6.6M18.5 20a6.6 6.6 0 0 0-2.6-5.2"/></symbol>'
    + '<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></symbol>'
    + '<symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4.5" width="20" height="15" rx="2"/><path d="M2.5 7l9.5 6 9.5-6"/></symbol>'
    + '<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5s6.8-6.1 6.8-11.5a6.8 6.8 0 1 0-13.6 0C5.2 15.4 12 21.5 12 21.5z"/><circle cx="12" cy="10" r="2.4"/></symbol>'
    + '<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/></symbol>'
    + '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>'
    + '<symbol id="i-fb" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></symbol>'
    + '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></symbol>'
    + '<symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></symbol>'
    + '<symbol id="i-flag-np" viewBox="0 0 24 24">'
    +   '<path d="M4 2 L4 22 L11 22 L7.5 16.5 L13 16.5 L9 11 L14 11 Z" fill="#DC143C" stroke="#003893" stroke-width="0.9" stroke-linejoin="round"/>'
    +   '<circle cx="7.5" cy="7" r="1.6" fill="#FFFFFF"/>'
    +   '<circle cx="9.2" cy="14" r="1.3" fill="#FFFFFF"/>'
    + '</symbol>'
    + '<symbol id="i-chev-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></symbol>'
    + '<symbol id="i-chev-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></symbol>'
    + '<symbol id="i-print" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/></symbol>'
    + '<symbol id="i-file" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></symbol>'
    + '<symbol id="i-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 9l6 6 6-6M4 21h16"/></symbol>'
    + '<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol>'
    + '<symbol id="i-zoom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></symbol>'
    + '</svg>';

  function ensureSprite() {
    var existing = document.querySelector('svg.sprite');

    // A real sprite contains <symbol> children. An empty placeholder does not.
    // If a real sprite is already present, do nothing.
    if (existing && existing.querySelector('symbol')) return;

    // If an empty / stale svg.sprite placeholder is present, remove it
    // so it cannot shadow the real sprite.
    if (existing) existing.remove();

    var tmp = document.createElement('div');
    tmp.innerHTML = SPRITE;
    var node = tmp.firstElementChild;
    if (document.body && document.body.firstChild) {
      document.body.insertBefore(node, document.body.firstChild);
    } else if (document.body) {
      document.body.appendChild(node);
    }
  }

  // Injects now (body exists since this script is loaded inside <body>)
  ensureSprite();
  // Belt-and-braces — in case the script was loaded before <body> finished
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureSprite, { once: true });
  }

  /* ---------------------------------------------------------
     2. NAVIGATION MODEL
     --------------------------------------------------------- */
  var NAV = [
    { href: 'index.html',      key: 'nav.home',       page: 'home' },
    { href: 'about.html',      key: 'nav.about',      page: 'about' },
    { href: 'academics.html',  key: 'nav.academics',  page: 'academics' },
    { href: 'admissions.html', key: 'nav.admissions', page: 'admissions' },
    { href: 'gallery.html',    key: 'nav.gallery',    page: 'gallery' },
    { href: 'notices.html',    key: 'nav.notices',    page: 'notices' },
    { href: 'contact.html',    key: 'nav.contact',    page: 'contact' }
  ];

  /* ---------------------------------------------------------
     3. HEADER HTML
     --------------------------------------------------------- */
  function headerHTML(active) {
    var links = NAV.map(function (n) {
      var cls = (n.page === active) ? ' class="is-active"' : '';
      return '<li><a href="' + n.href + '"' + cls +
             ' data-i18n="' + n.key + '">' + n.key + '</a></li>';
    }).join('');

    return ''
      /* ---------- Top bar ---------- */
      + '<div class="topbar">'
      +   '<div class="container topbar-inner">'
      +     '<a href="tel:+9779800000000" class="topbar-item">'
      +       '<svg class="ic"><use href="#i-phone"/></svg>'
      +       '<span>+977-9800000000</span>'
      +     '</a>'
      +     '<a href="mailto:info@gyanniketan.edu.np" class="topbar-item">'
      +       '<svg class="ic"><use href="#i-mail"/></svg>'
      +       '<span>info@gyanniketan.edu.np</span>'
      +     '</a>'
      +     '<span class="topbar-item topbar-hide">'
      +       '<svg class="ic"><use href="#i-pin"/></svg>'
      +       '<span data-i18n="top.address">Badan Nagar, Parsa-32, Nepal</span>'
      +     '</span>'
      +     '<a href="admin.html" class="topbar-item topbar-admin" title="Staff login">'
      +       '<svg class="ic"><use href="#i-shield"/></svg>'
      +       '<span>Admin</span>'
      +     '</a>'
      +   '</div>'
      + '</div>'

      /* ---------- Main header row ---------- */
      + '<div class="container header-inner">'
      +   '<a class="brand" href="index.html">'
      +     '<img class="brand-logo" src="GNlogo.jpg" '
      +       'alt="Gyan Niketan English Secondary School logo" '
      +       'width="52" height="52">'
      +     '<span class="brand-text">'
      +       '<strong>Gyan Niketan</strong>'
      +       '<small data-i18n="brand.sub">English Secondary School</small>'
      +     '</span>'
      +   '</a>'

      +   '<nav class="nav" id="primary-nav" aria-label="Main navigation">'
      +     '<ul class="nav-list">' + links + '</ul>'
      +     '<a href="admissions.html" class="btn btn-gold nav-cta-mobile" '
      +       'data-i18n="cta.apply">Apply for Admission</a>'
      +   '</nav>'

      +   '<div class="header-actions">'
      +     '<button class="lang-toggle" id="lang-toggle" type="button" aria-label="Switch language">'
      +       '<svg class="ic lang-flag"><use href="#i-flag-np"/></svg>'
      +       '<svg class="ic lang-globe" hidden><use href="#i-globe"/></svg>'
      +       '<span id="lang-label">नेपाली</span>'
      +     '</button>'
      +     '<a href="admissions.html" class="btn btn-gold header-cta" '
      +       'data-i18n="cta.apply">Apply for Admission</a>'
      +     '<button class="nav-toggle" id="nav-toggle" type="button" '
      +       'aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">'
      +       '<svg class="ic icon-menu"><use href="#i-menu"/></svg>'
      +       '<svg class="ic icon-close"><use href="#i-close"/></svg>'
      +     '</button>'
      +   '</div>'
      + '</div>';
  }

  /* ---------------------------------------------------------
     4. FOOTER HTML
     --------------------------------------------------------- */
  function footerHTML() {
    return ''
      + '<div class="container footer-grid">'

      +   '<div class="footer-col">'
      +     '<a class="brand brand-footer" href="index.html">'
      +       '<img class="brand-logo" src="GNlogo.jpg" alt="" width="52" height="52">'
      +       '<span class="brand-text">'
      +         '<strong>Gyan Niketan</strong>'
      +         '<small data-i18n="brand.sub">English Secondary School</small>'
      +       '</span>'
      +     '</a>'
      +     '<p data-i18n="footer.about">An English-medium secondary school in Badan Nagar, Parsa-32, dedicated to academic excellence, discipline and holistic growth.</p>'
      +     '<div class="socials">'
      +       '<a href="https://www.facebook.com/gyanniketan" aria-label="Facebook" '
      +         'target="_blank" rel="noopener">'
      +         '<svg class="ic"><use href="#i-fb"/></svg>'
      +       '</a>'
      +     '</div>'
      +   '</div>'

      +   '<div class="footer-col">'
      +     '<h4 data-i18n="footer.quicklinks">Quick Links</h4>'
      +     '<ul class="footer-links">'
      +       '<li><a href="about.html" data-i18n="nav.about">About Us</a></li>'
      +       '<li><a href="academics.html" data-i18n="nav.academics">Academics</a></li>'
      +       '<li><a href="admissions.html" data-i18n="nav.admissions">Admissions</a></li>'
      +       '<li><a href="gallery.html" data-i18n="nav.gallery">Gallery</a></li>'
      +       '<li><a href="notices.html" data-i18n="nav.notices">Notices</a></li>'
      +       '<li><a href="admin.html">Admin Login</a></li>'
      +     '</ul>'
      +   '</div>'

      +   '<div class="footer-col">'
      +     '<h4 data-i18n="footer.contact">Contact</h4>'
      +     '<ul class="footer-contact">'
      +       '<li>'
      +         '<svg class="ic"><use href="#i-pin"/></svg>'
      +         '<span data-i18n="footer.address">Badan Nagar, Parsa-32, Madhesh Province, Nepal</span>'
      +       '</li>'
      +       '<li>'
      +         '<svg class="ic"><use href="#i-phone"/></svg>'
      +         '<a href="tel:+9779800000000">+977-9800000000</a>'
      +       '</li>'
      +       '<li>'
      +         '<svg class="ic"><use href="#i-mail"/></svg>'
      +         '<a href="mailto:info@gyanniketan.edu.np">info@gyanniketan.edu.np</a>'
      +       '</li>'
      +       '<li>'
      +         '<svg class="ic"><use href="#i-clock"/></svg>'
      +         '<span data-i18n="footer.hours">Sun–Fri: 7:00 AM – 4:00 PM</span>'
      +       '</li>'
      +     '</ul>'
      +   '</div>'

      +   '<div class="footer-col">'
      +     '<h4 data-i18n="footer.findus">Find Us</h4>'
      +     '<div class="map-embed">'
      +       '<iframe title="Location map" '
      +         'src="https://www.google.com/maps?q=Gyan+Niketan+English+Secondary+School+Badan+Nagar+Parsa+Nepal&output=embed" '
      +         'loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
      +     '</div>'
      +     '<p style="margin-top:8px;"><a href="https://maps.app.goo.gl/JFNNdnxB9uMehbCT9" target="_blank" rel="noopener">View larger map</a></p>'
      +   '</div>'

      + '</div>'

      + '<div class="footer-bottom">'
      +   '<div class="container footer-bottom-inner">'
      +     '<p>© <span id="year"></span> Gyan Niketan English Secondary School. '
      +       '<span data-i18n="footer.rights">All rights reserved.</span></p>'
      +     '<p>'
      +       '<a href="notices.html" data-i18n="footer.notices">Notice Board</a>'
      +       ' · '
      +       '<a href="contact.html" data-i18n="nav.contact">Contact</a>'
      +     '</p>'
      +   '</div>'
      + '</div>';
  }

  /* ---------------------------------------------------------
     5. EXPOSE THE API
     --------------------------------------------------------- */
  window.GN_LAYOUT = {
    headerHTML: headerHTML,
    footerHTML: footerHTML
  };
})();
