/* =========================================================
   main.js — Page logic for all pages
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* 1. Inject header & footer */
  var activePage = document.body.dataset.page || 'home';
  var headerMount = document.getElementById('header-mount');
  var footerMount = document.getElementById('footer-mount');
  if (headerMount && window.GN_LAYOUT) headerMount.innerHTML = window.GN_LAYOUT.headerHTML(activePage);
  if (footerMount && window.GN_LAYOUT) footerMount.innerHTML = window.GN_LAYOUT.footerHTML();

  /* 2. Language */
  applyLanguage(typeof currentLang !== 'undefined' ? currentLang : 'en');

  /* 3. Mobile nav */
  (function () {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('primary-nav');
    var backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !nav) return;
    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (backdrop) { backdrop.classList.remove('is-open'); backdrop.hidden = true; }
    }
    function open() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add('is-open'); }); }
    }
    toggle.addEventListener('click', function () { nav.classList.contains('is-open') ? close() : open(); });
    if (backdrop) backdrop.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 980) close(); });
  })();

  /* 4. Language toggle button */
  (function () {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () { applyLanguage(currentLang === 'en' ? 'np' : 'en'); });
  })();

  /* 5. Sticky header */
  (function () {
    var header = document.getElementById('site-header');
    if (!header) return;
    function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  })();

  /* 6. Counters */
  (function () {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var start = performance.now();
      function step(now) {
        var p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.4 });
      nums.forEach(function (n) { io.observe(n); });
    } else nums.forEach(animate);
  })();

  /* 7. Reveal on scroll */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* 8. Back to top */
  (function () {
    var btn = document.getElementById('to-top');
    if (!btn) return;
    function onScroll() { btn.classList.toggle('is-visible', window.scrollY > 500); }
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); onScroll();
  })();

  /* 9. Year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* 10. Data-driven rendering */
  function formatDate(iso, lang) {
    var d = new Date(iso + 'T00:00:00');
    var months = {
      en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      np: ['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर']
    };
    var m = months[lang] || months.en;
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }

  function noticeCardHTML(n, lang) {
    var catLabel = {
      exam:    (lang === 'np') ? 'परीक्षा'   : 'Examination',
      holiday: (lang === 'np') ? 'बिदा'      : 'Holiday',
      event:   (lang === 'np') ? 'कार्यक्रम' : 'Event',
      general: (lang === 'np') ? 'सामान्य'   : 'General'
    }[n.cat] || 'General';
    var title   = n['title_' + lang]   || n.title_en   || '';
    var excerpt = n['excerpt_' + lang] || n.excerpt_en || '';
    var readMore = (lang === 'np') ? 'थप पढ्नुहोस्' : 'Read more';
    return '' +
      '<article class="notice-card">' +
        '<div class="notice-meta">' +
          '<span class="notice-cat notice-cat-' + n.cat + '">' + catLabel + '</span>' +
          '<time datetime="' + n.date + '">' + formatDate(n.date, lang) + '</time>' +
        '</div>' +
        '<h3>' + title + '</h3>' +
        '<p>' + excerpt + '</p>' +
        '<a href="notices.html" class="link-arrow"><span>' + readMore + '</span><svg class="ic"><use href="#i-arrow"/></svg></a>' +
      '</article>';
  }

  var homeList = document.getElementById('notice-list');
  var noticesGrid = document.getElementById('notices-grid');
  var galleryGrid = document.getElementById('gallery-grid');
  var allNotices = [];
  var allGallery = [];

  function renderHomeNotices() {
    if (!homeList) return;
    var limit = parseInt(homeList.dataset.limit, 10) || 4;
    homeList.innerHTML = allNotices.slice(0, limit).map(function (n) { return noticeCardHTML(n, currentLang); }).join('')
      || '<p class="notices-empty">—</p>';
  }

  function renderNoticesPage() {
    if (!noticesGrid) return;
    var searchInput = document.getElementById('notices-search');
    var filterBtns = document.querySelectorAll('[data-notice-filter]');
    var activeFilter = 'all';
    var query = '';

    function draw() {
      var q = query.trim().toLowerCase();
      var list = allNotices.filter(function (n) {
        if (activeFilter !== 'all' && n.cat !== activeFilter) return false;
        if (!q) return true;
        var blob = [n.title_en, n.title_np, n.excerpt_en, n.excerpt_np].join(' ').toLowerCase();
        return blob.indexOf(q) !== -1;
      });
      noticesGrid.innerHTML = list.length
        ? list.map(function (n) { return noticeCardHTML(n, currentLang); }).join('')
        : '<p class="notices-empty">' + ((currentLang === 'np') ? 'कुनै सूचना भेटिएन।' : 'No notices match your search.') + '</p>';
    }

    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        activeFilter = b.dataset.noticeFilter;
        draw();
      });
    });
    if (searchInput) searchInput.addEventListener('input', function () { query = searchInput.value; draw(); });
    draw();
    document.addEventListener('languagechange', draw);
  }

  function renderGallery() {
    if (!galleryGrid) return;
    var filterBtns = document.querySelectorAll('[data-gallery-filter]');
    var activeFilter = 'all';
    function draw() {
      var list = allGallery.filter(function (g) { return activeFilter === 'all' || g.cat === activeFilter; });
      galleryGrid.innerHTML = list.length ? list.map(function (g) {
        var title = g['title_' + currentLang] || g.title_en || '';
        return '<figure class="gallery-item"><div class="gallery-thumb">' +
          '<img src="' + g.src + '" alt="' + title + '" loading="lazy">' +
          '</div><figcaption>' + title + '</figcaption></figure>';
      }).join('') : '<p class="gallery-empty">' + t('gal.empty') + '</p>';
    }
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        activeFilter = b.dataset.galleryFilter;
        draw();
      });
    });
    draw();
    document.addEventListener('languagechange', draw);
  }

  // Kick off data load
  if (window.loadGNData) {
    window.loadGNData().then(function (data) {
      allNotices = (data.notices || []).slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      allGallery = data.gallery || [];
      renderHomeNotices();
      renderNoticesPage();
      renderGallery();
      document.addEventListener('languagechange', renderHomeNotices);
    });
  }

  /* 11. Forms */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successEl = form.querySelector('.form-success');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '...'; }
      setTimeout(function () {
        if (successEl) {
          successEl.textContent = (currentLang === 'np')
            ? ((form.dataset.form === 'admission') ? 'धन्यवाद! तपाईंको जिज्ञासा प्राप्त भयो। हामी चाँडै सम्पर्क गर्नेछौं।' : 'धन्यवाद! तपाईंको सन्देश पठाइयो। हामी चाँडै सम्पर्क गर्नेछौं।')
            : ((form.dataset.form === 'admission') ? 'Thank you! Your enquiry has been received. We will contact you soon.' : 'Thank you! Your message has been sent. We will be in touch soon.');
          successEl.hidden = false;
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = (form.dataset.form === 'admission') ? t('admis.form.submit') : t('cont.form.submit');
        }
      }, 600);
    });
  });
});