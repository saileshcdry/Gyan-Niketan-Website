/* =========================================================
   layout.js — Injects the same header & footer on every page.
   Marks the active nav link via <body data-page="about"> etc.
   ========================================================= */
(function () {
  const NAV = [
    { href: 'index.html',      key: 'nav.home',       page: 'home' },
    { href: 'about.html',      key: 'nav.about',      page: 'about' },
    { href: 'academics.html',  key: 'nav.academics',  page: 'academics' },
    { href: 'admissions.html', key: 'nav.admissions', page: 'admissions' },
    { href: 'gallery.html',    key: 'nav.gallery',    page: 'gallery' },
    { href: 'notices.html',    key: 'nav.notices',    page: 'notices' },
    { href: 'contact.html',    key: 'nav.contact',    page: 'contact' }
  ];

  function headerHTML(active) {
    const links = NAV.map(function (n) {
      const cls = (n.page === active) ? ' class="is-active"' : '';
      return '<li><a href="' + n.href + '"' + cls + ' data-i18n="' + n.key + '">' + n.key + '</a></li>';
    }).join('');

    return '' +
      '<div class="topbar">' +
        '<div class="container topbar-inner">' +
          '<a href="tel:+9779800000000" class="topbar-item"><svg class="ic"><use href="#i-phone"/></svg><span>+977-9800000000</span></a>' +
          '<a href="mailto:info@gyanniketan.edu.np" class="topbar-item"><svg class="ic"><use href="#i-mail"/></svg><span>info@gyanniketan.edu.np</span></a>' +
          '<span class="topbar-item topbar-hide"><svg class="ic"><use href="#i-pin"/></svg><span data-i18n="top.address">Badan Nagar, Parsa-32, Nepal</span></span>' +
          '<a href="admin.html" class="topbar-item topbar-admin" title="Staff login">' +
            '<svg class="ic"><use href="#i-shield"/></svg><span>Admin</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
      '<div class="container header-inner">' +
        '<a class="brand" href="index.html">' +
          '<img class="brand-logo" src="GNlogo.jpg" alt="Gyan Niketan English Secondary School logo" width="52" height="52">' +
          '<span class="brand-text">' +
            '<strong>Gyan Niketan</strong>' +
            '<small data-i18n="brand.sub">English Secondary School</small>' +
          '</span>' +
        '</a>' +
        '<nav class="nav" id="primary-nav" aria-label="Main navigation">' +
          '<ul class="nav-list">' + links + '</ul>' +
          '<a href="admissions.html" class="btn btn-gold nav-cta-mobile" data-i18n="cta.apply">Apply for Admission</a>' +
        '</nav>' +
        '<div class="header-actions">' +
          '<button class="lang-toggle" id="lang-toggle" type="button" aria-label="Switch language">' +
            '<svg class="ic lang-flag"><use href="#i-flag-np"/></svg>' +
            '<svg class="ic lang-globe" hidden><use href="#i-globe"/></svg>' +
            '<span id="lang-label">नेपाली</span>' +
          '</button>' +
          '<a href="admissions.html" class="btn btn-gold header-cta" data-i18n="cta.apply">Apply for Admission</a>' +
          '<button class="nav-toggle" id="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">' +
            '<svg class="ic icon-menu"><use href="#i-menu"/></svg>' +
            '<svg class="ic icon-close"><use href="#i-close"/></svg>' +
          '</button>' +
        '</div>';
  }

  function footerHTML() {
    return '' +
      '<div class="container footer-grid">' +
        '<div class="footer-col">' +
          '<a class="brand brand-footer" href="index.html">' +
            '<img class="brand-logo" src="GNlogo.jpg" alt="" width="52" height="52">' +
            '<span class="brand-text"><strong>Gyan Niketan</strong><small data-i18n="brand.sub">English Secondary School</small></span>' +
          '</a>' +
          '<p data-i18n="footer.about">An English-medium secondary school in Badan Nagar, Parsa-32, dedicated to academic excellence, discipline and holistic growth.</p>' +
          '<div class="socials"><a href="https://www.facebook.com/gyanniketan" aria-label="Facebook" target="_blank" rel="noopener"><svg class="ic"><use href="#i-fb"/></svg></a></div>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4 data-i18n="footer.quicklinks">Quick Links</h4>' +
          '<ul class="footer-links">' +
            '<li><a href="about.html" data-i18n="nav.about">About Us</a></li>' +
            '<li><a href="academics.html" data-i18n="nav.academics">Academics</a></li>' +
            '<li><a href="admissions.html" data-i18n="nav.admissions">Admissions</a></li>' +
            '<li><a href="gallery.html" data-i18n="nav.gallery">Gallery</a></li>' +
            '<li><a href="notices.html" data-i18n="nav.notices">Notices</a></li>' +
            '<li><a href="admin.html">Admin Login</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4 data-i18n="footer.contact">Contact</h4>' +
          '<ul class="footer-contact">' +
            '<li><svg class="ic"><use href="#i-pin"/></svg><span data-i18n="footer.address">Badan Nagar, Parsa-32, Madhesh Province, Nepal</span></li>' +
            '<li><svg class="ic"><use href="#i-phone"/></svg><a href="tel:+9779800000000">+977-9800000000</a></li>' +
            '<li><svg class="ic"><use href="#i-mail"/></svg><a href="mailto:info@gyanniketan.edu.np">info@gyanniketan.edu.np</a></li>' +
            '<li><svg class="ic"><use href="#i-clock"/></svg><span data-i18n="footer.hours">Sun–Fri: 7:00 AM – 4:00 PM</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4 data-i18n="footer.findus">Find Us</h4>' +
          '<div class="map-embed">' +
            '<iframe title="Location map" src="https://www.google.com/maps?q=Parsa-32,Badan+Nagar,Nepal&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom"><div class="container footer-bottom-inner">' +
        '<p>© <span id="year"></span> Gyan Niketan English Secondary School. <span data-i18n="footer.rights">All rights reserved.</span></p>' +
        '<p><a href="notices.html" data-i18n="footer.notices">Notice Board</a> · <a href="contact.html" data-i18n="nav.contact">Contact</a></p>' +
      '</div></div>';
  }

  window.GN_LAYOUT = { headerHTML: headerHTML, footerHTML: footerHTML };
})();
