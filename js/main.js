/* =========================================================
   main.js — Page logic + letterhead modal + gallery lightbox
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Inject header & footer ---------- */
  var activePage = document.body.dataset.page || 'home';
  var headerMount = document.getElementById('header-mount');
  var footerMount = document.getElementById('footer-mount');
  if (headerMount && window.GN_LAYOUT) headerMount.innerHTML = window.GN_LAYOUT.headerHTML(activePage);
  if (footerMount && window.GN_LAYOUT) footerMount.innerHTML = window.GN_LAYOUT.footerHTML();

  /* ---------- 2. Language ---------- */
  applyLanguage(typeof currentLang !== 'undefined' ? currentLang : 'en');

  /* ---------- 3. Mobile nav ---------- */
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

  /* ---------- 4. Language toggle ---------- */
  (function () {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () { applyLanguage(currentLang === 'en' ? 'np' : 'en'); });
  })();

  /* ---------- 5. Sticky header ---------- */
  (function () {
    var header = document.getElementById('site-header');
    if (!header) return;
    function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  })();

  /* ---------- 6. Counters ---------- */
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

  /* ---------- 7. Reveal on scroll ---------- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 8. Back to top ---------- */
  (function () {
    var btn = document.getElementById('to-top');
    if (!btn) return;
    function onScroll() { btn.classList.toggle('is-visible', window.scrollY > 500); }
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    onScroll();
  })();

  /* ---------- 9. Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* =========================================================
     10. Notice + gallery data
     ========================================================= */
  var allNotices = [];
  var allGallery = [];
  var currentGalleryList = [];
  var currentGalleryIndex = -1;

  function formatDate(iso, lang) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    var months = {
      en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      np: ['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर']
    };
    var m = months[lang] || months.en;
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }

  function categoryLabel(cat, lang) {
    return ({
      exam:    (lang === 'np') ? 'परीक्षा'   : 'Examination',
      holiday: (lang === 'np') ? 'बिदा'      : 'Holiday',
      event:   (lang === 'np') ? 'कार्यक्रम' : 'Event',
      general: (lang === 'np') ? 'सामान्य'   : 'General'
    })[cat] || 'General';
  }

  /* ---------- Notice card ---------- */
  function noticeCardHTML(n, lang) {
    var title   = n['title_' + lang]   || n.title_en   || '';
    var excerpt = n['excerpt_' + lang] || n.excerpt_en || '';
    var readMore = (lang === 'np') ? 'थप हेर्नुहोस्' : 'View notice';
    var hasSchedule = Array.isArray(n.schedule) && n.schedule.length > 0;
    var badge = hasSchedule
      ? '<span class="notice-badge"><svg class="ic"><use href="#i-calendar"/></svg>' +
        ((lang === 'np') ? 'तालिका' : 'Schedule') + '</span>'
      : '';
    /* Whitelist category so it cannot inject into the class attribute. */
    var safeCat = (['exam','holiday','event','general'].indexOf(n.cat) >= 0) ? n.cat : 'general';
    /* Escape every value that lands in markup. */
    var safeId    = escapeHtml(n.id);
    var safeTitle = escapeHtml(title);
    var safeExc   = escapeHtml(excerpt);
    return '' +
      '<article class="notice-card" data-notice-id="' + safeId + '" tabindex="0" role="button" aria-label="' + safeTitle + '">' +
        '<div class="notice-meta">' +
          '<span class="notice-cat notice-cat-' + safeCat + '">' + categoryLabel(safeCat, lang) + '</span>' +
          '<time datetime="' + escapeHtml(n.date) + '">' + escapeHtml(formatDate(n.date, lang)) + '</time>' +
          badge +
        '</div>' +
        '<h3>' + safeTitle + '</h3>' +
        '<p>' + safeExc + '</p>' +
        '<span class="link-arrow"><span>' + readMore + '</span><svg class="ic"><use href="#i-arrow"/></svg></span>' +
      '</article>';
  }

  /* ---------- Letterhead HTML ---------- */
  function letterheadHTML(n, lang) {
    var title   = n['title_' + lang]   || n.title_en   || '';
    var excerpt = n['excerpt_' + lang] || n.excerpt_en || '';
    var refNum  = 'GN/' + (n.date || '').replace(/-/g, '/');
    var dateStr = formatDate(n.date, lang);
    var schedule = Array.isArray(n.schedule) ? n.schedule : [];

    var scheduleHTML = '';
    if (schedule.length) {
      var cols = ['date','time','subject','grade'];
      var labels = {
        date:    (lang === 'np') ? 'मिति'       : 'Date',
        time:    (lang === 'np') ? 'समय'        : 'Time',
        subject: (lang === 'np') ? 'विषय'       : 'Subject',
        grade:   (lang === 'np') ? 'कक्षा'      : 'Grade'
      };
      scheduleHTML =
        '<div class="letterhead-schedule-wrap">' +
          '<table class="letterhead-schedule">' +
            '<thead><tr>' +
              cols.map(function (c) { return '<th>' + labels[c] + '</th>'; }).join('') +
            '</tr></thead>' +
            '<tbody>' +
              schedule.map(function (row) {
                return '<tr>' + cols.map(function (c) {
                  return '<td>' + escapeHtml(row[c] || '') + '</td>';
                }).join('') + '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>';
    }

    return '' +
      '<div class="letterhead letterhead-printable">' +
        '<header class="letterhead-head">' +
          '<img class="letterhead-logo" src="GNlogo.jpg" alt="School logo">' +
          '<div class="letterhead-school">' +
            '<h1>Gyan Niketan English Secondary School</h1>' +
            '<p>Badan Nagar, Parsa-32, Madhesh Province, Nepal</p>' +
            '<p>Phone: +977-9800000000 &nbsp;·&nbsp; Email: info@gyanniketan.edu.np</p>' +
            '<p class="est">Estd. 2003</p>' +
          '</div>' +
          '<div></div>' +
        '</header>' +
        '<div class="letterhead-rule"></div>' +
        '<div class="letterhead-rule thin"></div>' +
        '<div class="letterhead-ref">' +
          '<span>Ref: ' + escapeHtml(refNum) + '</span>' +
          '<span>Date: ' + escapeHtml(dateStr) + '</span>' +
        '</div>' +
        '<h2 class="letterhead-title">' + ((lang === 'np') ? 'सूचना' : 'Notice') + '</h2>' +
        '<h3 class="letterhead-subject">' + escapeHtml(title) + '</h3>' +
        '<div class="letterhead-body">' +
          (excerpt ? '<p>' + escapeHtml(excerpt) + '</p>' : '') +
          scheduleHTML +
          (schedule.length
            ? '<p class="letterhead-note">' +
              ((lang === 'np')
                ? 'सबै विद्यार्थीहरूले तोकिएको समयमा परीक्षा केन्द्रमा उपस्थित हुनुपर्नेछ। परीक्षा तालिकामा कुनै परिवर्तन भएमा विद्यालयले जानकारी गराउनेछ।'
                : 'All students must be present at the examination hall at the scheduled time. Any change to this routine will be notified by the school office.') +
              '</p>'
            : '') +
        '</div>' +
        '<footer class="letterhead-sign">' +
          '<div class="sign-block">' +
            '<span class="sign-line"></span>' +
            '<strong>Class Teacher</strong>' +
            '<span>Gyan Niketan</span>' +
          '</div>' +
          '<div class="sign-block">' +
            '<span class="sign-line"></span>' +
            '<strong>Mr. Ram Prasad Yadav</strong>' +
            '<span>Principal</span>' +
          '</div>' +
        '</footer>' +
        '<p class="letterhead-footnote">' +
          'This is a computer-generated notice from Gyan Niketan English Secondary School. ' +
          'For queries, please contact the school office during working hours.' +
        '</p>' +
      '</div>';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* ---------- Notice modal ---------- */
  function ensureNoticeModal() {
    var existing = document.getElementById('gn-notice-modal');
    if (existing) return existing;
    var div = document.createElement('div');
    div.className = 'gn-modal';
    div.id = 'gn-notice-modal';
    div.hidden = true;
    div.innerHTML =
      '<div class="gn-modal-backdrop" data-close="1"></div>' +
      '<div class="gn-modal-body" role="dialog" aria-modal="true" aria-labelledby="gn-notice-title">' +
        '<button type="button" class="gn-modal-close" data-close="1" aria-label="Close">' +
          '<svg class="ic"><use href="#i-close"/></svg>' +
        '</button>' +
        '<div class="gn-modal-actions">' +
          '<button type="button" id="gn-print-btn">' +
            '<svg class="ic"><use href="#i-print"/></svg><span id="gn-print-label">Print</span>' +
          '</button>' +
        '</div>' +
        '<div class="gn-modal-content" id="gn-notice-content"></div>' +
      '</div>';
    document.body.appendChild(div);

    div.addEventListener('click', function (e) {
      if (e.target.closest('[data-close="1"]')) closeNoticeModal();
    });
    div.querySelector('#gn-print-btn').addEventListener('click', function () { window.print(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !div.hidden) closeNoticeModal();
    });
    return div;
  }

  function openNoticeModal(notice) {
    var modal = ensureNoticeModal();
    var content = modal.querySelector('#gn-notice-content');
    var printLabel = modal.querySelector('#gn-print-label');
    if (printLabel) printLabel.textContent = (currentLang === 'np') ? 'प्रिन्ट' : 'Print';
    content.innerHTML = letterheadHTML(notice, currentLang);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var body = modal.querySelector('.gn-modal-content');
    if (body) body.scrollTop = 0;
  }
  function closeNoticeModal() {
    var modal = document.getElementById('gn-notice-modal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  /* ---------- Gallery lightbox ---------- */
  function ensureLightbox() {
    var existing = document.getElementById('gn-lightbox');
    if (existing) return existing;
    var div = document.createElement('div');
    div.className = 'gn-lightbox';
    div.id = 'gn-lightbox';
    div.hidden = true;
    div.innerHTML =
      '<div class="gn-lightbox-backdrop" data-close="1"></div>' +
      '<button type="button" class="gn-lb-close" data-close="1" aria-label="Close">' +
        '<svg class="ic"><use href="#i-close"/></svg>' +
      '</button>' +
      '<button type="button" class="gn-lb-prev" aria-label="Previous">' +
        '<svg class="ic"><use href="#i-chev-left"/></svg>' +
      '</button>' +
      '<button type="button" class="gn-lb-next" aria-label="Next">' +
        '<svg class="ic"><use href="#i-chev-right"/></svg>' +
      '</button>' +
      '<div class="gn-lightbox-content">' +
        '<div class="gn-lb-image-wrap"><img id="gn-lb-img" alt=""></div>' +
        '<p class="gn-lb-caption" id="gn-lb-caption"></p>' +
        '<span class="gn-lb-counter" id="gn-lb-counter"></span>' +
      '</div>';
    document.body.appendChild(div);

    div.addEventListener('click', function (e) {
      if (e.target.closest('[data-close="1"]')) closeLightbox();
    });
    div.querySelector('.gn-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); showGalleryAt(currentGalleryIndex - 1); });
    div.querySelector('.gn-lb-next').addEventListener('click', function (e) { e.stopPropagation(); showGalleryAt(currentGalleryIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (div.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft')  showGalleryAt(currentGalleryIndex - 1);
      else if (e.key === 'ArrowRight') showGalleryAt(currentGalleryIndex + 1);
    });
    return div;
  }

  function openLightbox(list, index) {
    currentGalleryList = list;
    ensureLightbox();
    showGalleryAt(index);
    document.body.style.overflow = 'hidden';
  }
  function showGalleryAt(idx) {
    if (!currentGalleryList.length) return;
    if (idx < 0) idx = currentGalleryList.length - 1;
    if (idx >= currentGalleryList.length) idx = 0;
    currentGalleryIndex = idx;
    var item = currentGalleryList[idx];
    var box = document.getElementById('gn-lightbox');
    if (!box) return;
    box.hidden = false;
    var img = box.querySelector('#gn-lb-img');
    var cap = box.querySelector('#gn-lb-caption');
    var cnt = box.querySelector('#gn-lb-counter');
    img.src = item.src;
    img.alt = item['title_' + currentLang] || item.title_en || '';
    cap.textContent = item['title_' + currentLang] || item.title_en || '';
    cnt.textContent = (idx + 1) + ' / ' + currentGalleryList.length;
  }
  function closeLightbox() {
    var box = document.getElementById('gn-lightbox');
    if (!box) return;
    box.hidden = true;
    document.body.style.overflow = '';
  }

  /* ---------- Render helpers ---------- */
  var homeList = document.getElementById('notice-list');
  var noticesGrid = document.getElementById('notices-grid');
  var galleryGrid = document.getElementById('gallery-grid');

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

  var currentGalleryFilter = 'all';
  function renderGallery() {
    if (!galleryGrid) return;
    var filterBtns = document.querySelectorAll('[data-gallery-filter]');
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        currentGalleryFilter = b.dataset.galleryFilter;
        drawGallery();
      });
    });
    function drawGallery() {
      var list = allGallery.filter(function (g) { return currentGalleryFilter === 'all' || g.cat === currentGalleryFilter; });
      galleryGrid.innerHTML = list.length ? list.map(function (g) {
        var title = g['title_' + currentLang] || g.title_en || '';
        return '<figure class="gallery-item" data-gallery-id="' + g.id + '" tabindex="0" role="button" aria-label="' + escapeHtml(title) + '">' +
          '<div class="gallery-thumb">' +
            '<img src="' + g.src + '" alt="' + escapeHtml(title) + '" loading="lazy">' +
          '</div>' +
          '<figcaption>' + escapeHtml(title) + '</figcaption>' +
        '</figure>';
      }).join('') : '<p class="gallery-empty">' + t('gal.empty') + '</p>';
    }
    drawGallery();
    document.addEventListener('languagechange', drawGallery);
  }

  /* ---------- Delegated click handlers ---------- */
  document.addEventListener('click', function (e) {
    var noticeEl = e.target.closest('[data-notice-id]');
    if (noticeEl) {
      var id = noticeEl.dataset.noticeId;
      var notice = allNotices.find(function (n) { return n.id === id; });
      if (notice) { openNoticeModal(notice); return; }
    }
    var galEl = e.target.closest('[data-gallery-id]');
    if (galEl) {
      var gid = galEl.dataset.galleryId;
      var list = allGallery.filter(function (g) { return currentGalleryFilter === 'all' || g.cat === currentGalleryFilter; });
      var idx = list.findIndex(function (g) { return g.id === gid; });
      if (idx >= 0) openLightbox(list, idx);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var el = document.activeElement;
      if (el && (el.dataset.noticeId || el.dataset.galleryId)) {
        e.preventDefault(); el.click();
      }
    }
  });

  /* ---------- Data load ---------- */
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

  /* ---------- Forms ---------- */
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