/**
 * admin.js — Gyan Niketan admin panel
 * Matches admin.html element IDs. Uses `hidden` attribute for view toggling.
 * Notices use the public schema: { id, date, cat, title_en, title_np, excerpt_en, excerpt_np, schedule? }
 * Markup emitted here matches the selectors in css/admin.css.
 *
 * Exam routines (schedules) can be uploaded as CSV or Excel and are
 * stored on the notice as { type: 'matrix', dateLabel, classes, rows }.
 */
(function () {
  'use strict';

  var TOKEN_KEY  = 'gn-gh-token';
  var REPO_KEY   = 'gn-gh-repo';
  var NOTICE_CATS  = ['general', 'exam', 'holiday', 'event'];
  var GALLERY_CATS = ['school', 'classroom', 'lab', 'sports', 'event'];
  var API = 'https://api.github.com/repos/';

  /* ---------- helpers ---------- */

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[ADMIN]');
    console.log.apply(console, a);
  }
  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.hidden = false; }
  function hide(el) { if (el) el.hidden = true; }
  function setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
    el.className = 'admin-status' + (type ? ' is-' + type : '');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* ---------- auth ---------- */

  function getCreds() {
    return {
      token: localStorage.getItem(TOKEN_KEY) || '',
      repo:  localStorage.getItem(REPO_KEY)  || ''
    };
  }
  function isSignedIn() {
    var c = getCreds();
    return !!(c.token && c.repo);
  }
  function signIn() {
    var token = (($('token') || {}).value || '').trim();
    var repo  = (($('repo')  || {}).value || '').trim();
    if (!token || !repo) {
      setStatus($('login-status'), 'Please enter both repository and token.', 'error');
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REPO_KEY, repo);
    log('Signing in with repo=' + repo);
    showDash();
  }
  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REPO_KEY);
    log('Sign out clicked');
    showLogin();
  }
  function showLogin() {
    show($('login-view'));
    hide($('dash-view'));
    setStatus($('login-status'), '', '');
  }
  function showDash() {
    hide($('login-view'));
    show($('dash-view'));
    loadData();
  }

  /* ---------- GitHub API ---------- */

  function ghFetch(method, path, body) {
    var c = getCreds();
    if (!c.token || !c.repo) return Promise.reject(new Error('Not signed in'));
    var url = API + c.repo + '/contents/' + path;
    var opts = {
      method: method,
      headers: {
        'Authorization': 'token ' + c.token,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    log('GitHub API ' + method + ' ' + path);
    return fetch(url, opts).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          var msg = data.message || res.statusText;
          if (res.status === 409) msg = 'Conflict: ' + msg + ' (refresh and retry)';
          if (res.status === 422) msg = 'Unprocessable: ' + msg;
          throw new Error(msg);
        }
        return data;
      });
    });
  }
  function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64decode(str) { return decodeURIComponent(escape(atob(str.replace(/\s/g, '')))); }
  function readJSONFile(path) {
    return ghFetch('GET', path).then(function (data) {
      return { data: JSON.parse(b64decode(data.content)), sha: data.sha };
    });
  }
  function writeJSONFile(path, data, sha, message) {
    var body = {
      message: message || 'Update ' + path,
      content: b64encode(JSON.stringify(data, null, 2)),
      branch: 'main'
    };
    if (sha) body.sha = sha;
    return ghFetch('PUT', path, body);
  }

  /* ---------- schema normalisation ---------- */
  function normalizeNotice(n) {
    if (!n) return n;
    if (!n.cat && n.category) n.cat = n.category;
    if (!n.excerpt_en && n.message_en) n.excerpt_en = n.message_en;
    if (!n.excerpt_np && n.message_np) n.excerpt_np = n.message_np;
    return n;
  }

  /* ---------- state ---------- */

  var state = {
    notices: [],
    gallery: [],
    noticesSha: null,
    gallerySha: null
  };

  /* Schedule currently attached to the notice being edited/created.
     null = none. Object with { type: 'matrix', ... } = attached. */
  var currentSchedule = null;

  function loadData() {
    setStatus($('status'), 'Loading…', 'info');
    Promise.all([
      readJSONFile('data/notices.json').catch(function (e) {
        log('Notices load error: ' + e.message);
        return { data: [], sha: null };
      }),
      readJSONFile('data/gallery.json').catch(function (e) {
        log('Gallery load error: ' + e.message);
        return { data: [], sha: null };
      })
    ]).then(function (r) {
      state.notices    = (r[0].data || []).map(normalizeNotice);
      state.noticesSha = r[0].sha;
      state.gallery    = r[1].data || [];
      state.gallerySha = r[1].sha;
      setStatus($('status'), '', '');
      renderNotices();
      renderGallery();
    }).catch(function (err) {
      log('Load error: ' + err.message);
      setStatus($('status'), 'Failed to load data: ' + err.message, 'error');
    });
  }

  /* ---------- notices ---------- */

  function renderNotices() {
    var list = $('notices-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.notices.length) {
      list.innerHTML = '<p>No notices yet. Click "+ Add Notice" to create one.</p>';
      return;
    }
    state.notices.forEach(function (n) {
      var hasSched = !!(n.schedule && (
        (n.schedule.type === 'matrix' && n.schedule.rows && n.schedule.rows.length) ||
        (Array.isArray(n.schedule) && n.schedule.length)
      ));
      var div = document.createElement('div');
      div.className = 'admin-row';
      div.innerHTML =
        '<div>' +
          '<div class="title">' + esc(n.title_en || n.title_np || 'Untitled') + '</div>' +
          '<div class="meta">' + esc(n.date || '') + ' · ' + esc(n.cat || '') +
            (hasSched ? ' · 📅 routine attached' : '') +
          '</div>' +
        '</div>' +
        '<div class="actions">' +
          '<button type="button" class="edit-notice" data-id="' + esc(n.id) + '">Edit</button>' +
          '<button type="button" class="danger delete-notice" data-id="' + esc(n.id) + '">Delete</button>' +
        '</div>';
      list.appendChild(div);
    });
    Array.prototype.forEach.call(list.querySelectorAll('.edit-notice'), function (b) {
      b.addEventListener('click', function () { editNotice(b.getAttribute('data-id')); });
    });
    Array.prototype.forEach.call(list.querySelectorAll('.delete-notice'), function (b) {
      b.addEventListener('click', function () { deleteNotice(b.getAttribute('data-id')); });
    });
  }

  function openNoticeModal() {
    show($('notice-modal'));
    currentSchedule = null;
    var fileInput = $('n-schedule-file');
    if (fileInput) fileInput.value = '';
    updateScheduleStatus();
  }
  function closeNoticeModal() {
    hide($('notice-modal'));
    var f = $('notice-form'); if (f) f.reset();
    if ($('n-id')) $('n-id').value = '';
    if ($('notice-modal-title')) $('notice-modal-title').textContent = 'Add Notice';
    currentSchedule = null;
    var fileInput = $('n-schedule-file');
    if (fileInput) fileInput.value = '';
    updateScheduleStatus();
  }

  function editNotice(id) {
    var n = null;
    for (var i = 0; i < state.notices.length; i++) {
      if (state.notices[i].id === id) { n = state.notices[i]; break; }
    }
    if (!n) return;
    $('notice-modal-title').textContent = 'Edit Notice';
    $('n-id').value = n.id || '';
    $('n-date').value = n.date || '';
    $('n-cat').value = n.cat || n.category || 'general';
    $('n-title-en').value = n.title_en || '';
    $('n-title-np').value = n.title_np || '';
    $('n-ex-en').value = n.excerpt_en || n.message_en || '';
    $('n-ex-np').value = n.excerpt_np || n.message_np || '';

    /* Load existing schedule into the preview */
    currentSchedule = (n.schedule && (
      (n.schedule.type === 'matrix' && n.schedule.rows && n.schedule.rows.length) ||
      (Array.isArray(n.schedule) && n.schedule.length)
    )) ? n.schedule : null;
    var fileInput = $('n-schedule-file');
    if (fileInput) fileInput.value = '';
    updateScheduleStatus();

    openNoticeModal();
  }

  function saveNotice(e) {
    if (e) e.preventDefault();
    var id = $('n-id').value || 'n-' + Date.now();
    var notice = {
      id: id,
      date: $('n-date').value,
      cat: $('n-cat').value,
      title_en: $('n-title-en').value.trim(),
      title_np: $('n-title-np').value.trim(),
      excerpt_en: $('n-ex-en').value,
      excerpt_np: $('n-ex-np').value
    };
    if (!notice.title_en && !notice.title_np) { alert('Title is required.'); return; }
    if (NOTICE_CATS.indexOf(notice.cat) === -1) { alert('Invalid category.'); return; }

    /* Attach schedule if one is present */
    if (currentSchedule) {
      notice.schedule = currentSchedule;
    }

    commitNotice(notice);
  }

  function commitNotice(notice) {
    var list = state.notices.slice();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === notice.id) { idx = i; break; }
    }
    if (idx >= 0) list[idx] = notice; else list.push(notice);
    setStatus($('status'), 'Saving notice…', 'info');
    writeJSONFile('data/notices.json', list, state.noticesSha, 'Save notice ' + notice.id)
      .then(function () {
        log('Notice saved: ' + notice.id);
        closeNoticeModal();
        setStatus($('status'), 'Notice saved.', 'ok');
        loadData();
      })
      .catch(function (err) {
        log('Save failed: ' + err.message);
        setStatus($('status'), 'Save failed: ' + err.message, 'error');
      });
  }

  function deleteNotice(id) {
    if (!confirm('Delete this notice?')) return;
    var list = state.notices.filter(function (n) { return n.id !== id; });
    setStatus($('status'), 'Deleting notice…', 'info');
    writeJSONFile('data/notices.json', list, state.noticesSha, 'Delete notice ' + id)
      .then(function () { setStatus($('status'), 'Notice deleted.', 'ok'); loadData(); })
      .catch(function (err) { setStatus($('status'), 'Delete failed: ' + err.message, 'error'); });
  }

  /* ---------- schedule parsing ---------- */

  /* Detect delimiter by inspecting the first line.
     Returns a string (',' or '\t') or the regex /\s{2,}/. */
  function detectDelimiter(text) {
    var firstLine = (text.split(/\r?\n/)[0] || '');
    if (firstLine.indexOf('\t') !== -1) return '\t';
    if (firstLine.indexOf(',')  !== -1) return ',';
    return /\s{2,}/;
  }

  /* Parse CSV text into a 2-D array. Handles quoted fields when the
     delimiter is a single character; falls back to regex split for
     double-space-delimited files. */
  function parseCSVText(text) {
    if (!text || !text.trim()) return [];
    var delim = detectDelimiter(text);

    if (typeof delim !== 'string') {
      /* Regex split — no quote handling (fine for well-formatted tables) */
      return text.split(/\r?\n/)
        .filter(function (l) { return l.trim().length; })
        .map(function (l) { return l.trim().split(delim).map(function (c) { return c.trim(); }); });
    }

    var rows = [];
    var row = [];
    var cur = '';
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; }
          else inQuotes = false;
        } else {
          cur += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === delim) { row.push(cur); cur = ''; }
        else if (c === '\n') {
          row.push(cur);
          if (row.some(function (x) { return x !== ''; })) rows.push(row);
          row = []; cur = '';
        }
        else if (c === '\r') { /* skip */ }
        else cur += c;
      }
    }
    if (cur !== '' || row.length) {
      row.push(cur);
      if (row.some(function (x) { return x !== ''; })) rows.push(row);
    }
    return rows;
  }

  /* Convert a 2-D rows array (header + data rows) into a matrix schedule. */
  function rowsToSchedule(rows) {
    if (!rows || rows.length < 2) return null;
    var header = rows[0].map(function (c) { return String(c == null ? '' : c).trim(); });
    var dateLabel = header[0] || 'Date';

    /* Strip optional leading "Class " prefix from each column header */
    var classes = header.slice(1).map(function (c) {
      var s = c.replace(/^Class\s+/i, '').trim();
      return s || '—';
    });
    if (!classes.length) return null;

    var dataRows = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r || !r.length) continue;
      var date = String(r[0] == null ? '' : r[0]).trim();
      if (!date) continue;
      var subjects = [];
      for (var j = 0; j < classes.length; j++) {
        var v = String(r[j + 1] == null ? '' : r[j + 1]).trim();
        subjects.push(v || '—');
      }
      dataRows.push({ date: date, subjects: subjects });
    }
    if (!dataRows.length) return null;

    return {
      type: 'matrix',
      dateLabel: dateLabel,
      classes: classes,
      rows: dataRows
    };
  }

  /* Lazy-load SheetJS for .xlsx / .xls parsing */
  function loadSheetJS() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = function () { window.XLSX ? resolve(window.XLSX) : reject(new Error('XLSX failed to load')); };
      s.onerror = function () { reject(new Error('Could not load XLSX parser')); };
      document.head.appendChild(s);
    });
  }

  /* File input change handler — reads the file and parses to a schedule. */
  function handleScheduleFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var ext = (file.name.split('.').pop() || '').toLowerCase();

    function fail(msg) { alert('Could not parse file: ' + msg); }

    if (ext === 'csv' || ext === 'txt') {
      file.text().then(function (text) {
        var rows = parseCSVText(text);
        var schedule = rowsToSchedule(rows);
        if (!schedule) { fail('No data rows found.'); return; }
        applySchedule(schedule);
      }).catch(function (err) { fail(err.message); });

    } else if (ext === 'xlsx' || ext === 'xls') {
      loadSheetJS().then(function (XLSX) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          try {
            var wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
            var sheet = wb.Sheets[wb.SheetNames[0]];
            var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: '' });
            var schedule = rowsToSchedule(rows);
            if (!schedule) { fail('No data rows found.'); return; }
            applySchedule(schedule);
          } catch (err) { fail(err.message); }
        };
        reader.onerror = function () { fail('Could not read file.'); };
        reader.readAsArrayBuffer(file);
      }).catch(function (err) { fail(err.message); });

    } else {
      fail('Unsupported file type. Use .csv, .xlsx or .xls.');
    }
  }

  function applySchedule(schedule) {
    currentSchedule = schedule;
    updateScheduleStatus();
  }

  function clearSchedule() {
    currentSchedule = null;
    var fileInput = $('n-schedule-file');
    if (fileInput) fileInput.value = '';
    updateScheduleStatus();
  }

  function updateScheduleStatus() {
    var el = $('n-schedule-status');
    var clearBtn = $('n-schedule-clear');
    if (!el) return;
    if (currentSchedule && currentSchedule.type === 'matrix') {
      var rowCount = currentSchedule.rows.length;
      var colCount = currentSchedule.classes.length;
      el.textContent = '📅 Exam routine attached — ' + rowCount + ' date' +
                       (rowCount === 1 ? '' : 's') + ' × ' + colCount + ' classes.';
      el.hidden = false;
      if (clearBtn) clearBtn.hidden = false;
    } else if (Array.isArray(currentSchedule) && currentSchedule.length) {
      el.textContent = '📅 Legacy routine attached — ' + currentSchedule.length + ' rows.';
      el.hidden = false;
      if (clearBtn) clearBtn.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
      if (clearBtn) clearBtn.hidden = true;
    }
  }

  /* ---------- gallery ---------- */

  function renderGallery() {
    var list = $('gallery-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.gallery.length) {
      list.innerHTML = '<p>No photos yet. Click "+ Upload Photo" to add one.</p>';
      return;
    }
    state.gallery.forEach(function (g) {
      var div = document.createElement('div');
      div.className = 'thumb';
      div.innerHTML =
        '<img src="' + esc(g.src) + '" alt="" onerror="this.style.opacity=0.3">' +
        '<div class="cap">' +
          '<span class="cap-title">' + esc(g.title_en || g.title_np || 'Untitled') + '</span>' +
          '<span class="cap-actions">' +
            '<button type="button" class="edit-photo" data-id="' + esc(g.id) + '">Edit</button>' +
            '<button type="button" class="delete-photo" data-id="' + esc(g.id) + '">Delete</button>' +
          '</span>' +
        '</div>';
      list.appendChild(div);
    });
    Array.prototype.forEach.call(list.querySelectorAll('.edit-photo'), function (b) {
      b.addEventListener('click', function () { editPhoto(b.getAttribute('data-id')); });
    });
    Array.prototype.forEach.call(list.querySelectorAll('.delete-photo'), function (b) {
      b.addEventListener('click', function () { deletePhoto(b.getAttribute('data-id')); });
    });
  }

  function openPhotoModal() { show($('photo-modal')); }
  function closePhotoModal() {
    hide($('photo-modal'));
    var f = $('photo-form'); if (f) f.reset();
    if ($('p-id')) $('p-id').value = '';
    if ($('p-existing-src')) $('p-existing-src').value = '';
    if ($('photo-modal-title')) $('photo-modal-title').textContent = 'Upload Photo';
  }

  function editPhoto(id) {
    var g = null;
    for (var i = 0; i < state.gallery.length; i++) {
      if (state.gallery[i].id === id) { g = state.gallery[i]; break; }
    }
    if (!g) return;
    $('photo-modal-title').textContent = 'Edit Photo';
    $('p-id').value = g.id || '';
    $('p-existing-src').value = g.src || '';
    $('p-cat').value = g.cat || 'school';
    $('p-title-en').value = g.title_en || '';
    $('p-title-np').value = g.title_np || '';
    openPhotoModal();
  }

  function savePhoto(e) {
    if (e) e.preventDefault();
    var id = $('p-id').value || 'g-' + Date.now();
    var cat = $('p-cat').value;
    var titleEn = $('p-title-en').value.trim();
    var titleNp = $('p-title-np').value.trim();
    var existingSrc = $('p-existing-src').value;
    var fileInput = $('p-file');

    if (!titleEn && !titleNp) { alert('Title is required.'); return; }
    if (GALLERY_CATS.indexOf(cat) === -1) { alert('Invalid category.'); return; }

    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      if (!existingSrc) { alert('Please choose a photo.'); return; }
      updateGalleryEntry(id, cat, titleEn, titleNp, existingSrc);
      return;
    }

    var file = fileInput.files[0];
    if (file.size > 2 * 1024 * 1024) { alert('Photo must be under 2 MB.'); return; }

    var reader = new FileReader();
    reader.onload = function () {
      var base64 = reader.result.split(',')[1];
      var ext = file.name.split('.').pop().toLowerCase();
      var filename = id + '.' + ext;
      var path = 'assets/gallery/' + filename;
      setStatus($('status'), 'Uploading photo…', 'info');
      ghFetch('PUT', path, {
        message: 'Upload gallery photo ' + filename,
        content: base64,
        branch: 'main'
      }).then(function () {
        updateGalleryEntry(id, cat, titleEn, titleNp, path);
      }).catch(function (err) {
        setStatus($('status'), 'Upload failed: ' + err.message, 'error');
      });
    };
    reader.readAsDataURL(file);
  }

  function updateGalleryEntry(id, cat, titleEn, titleNp, src) {
    var list = state.gallery.slice();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { idx = i; break; }
    }
    var entry = { id: id, cat: cat, title_en: titleEn, title_np: titleNp, src: src };
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    setStatus($('status'), 'Saving gallery…', 'info');
    writeJSONFile('data/gallery.json', list, state.gallerySha, 'Save gallery photo ' + id)
      .then(function () {
        closePhotoModal();
        setStatus($('status'), 'Photo saved.', 'ok');
        loadData();
      })
      .catch(function (err) {
        setStatus($('status'), 'Save failed: ' + err.message, 'error');
      });
  }

  function deletePhoto(id) {
    if (!confirm('Delete this photo?')) return;
    var list = state.gallery.filter(function (g) { return g.id !== id; });
    setStatus($('status'), 'Deleting photo…', 'info');
    writeJSONFile('data/gallery.json', list, state.gallerySha, 'Delete photo ' + id)
      .then(function () { setStatus($('status'), 'Photo deleted.', 'ok'); loadData(); })
      .catch(function (err) { setStatus($('status'), 'Delete failed: ' + err.message, 'error'); });
  }

  /* ---------- tabs ---------- */

  function setupTabs() {
    var tabs = document.querySelectorAll('.admin-tabs button[data-tab]');
    Array.prototype.forEach.call(tabs, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var name = btn.getAttribute('data-tab');
        Array.prototype.forEach.call(document.querySelectorAll('[id^="tab-"]'), function (el) { el.hidden = true; });
        var panel = document.getElementById('tab-' + name);
        if (panel) panel.hidden = false;
      });
    });
  }

  /* ---------- init ---------- */

  function init() {
    log('Script starting…');
    try {
      var required = ['login-btn', 'repo', 'token', 'dash-view', 'login-view'];
      var missing = required.filter(function (id) { return !document.getElementById(id); });
      if (missing.length) log('Missing elements: ' + missing.join(', '));
      log('DOMContentLoaded — wiring up UI');

      if ($('login-btn'))   $('login-btn').addEventListener('click', signIn);
      if ($('signout-btn')) $('signout-btn').addEventListener('click', signOut);

      if ($('notice-form')) $('notice-form').addEventListener('submit', saveNotice);
      if ($('photo-form'))  $('photo-form').addEventListener('submit', savePhoto);

      if ($('add-notice-btn')) $('add-notice-btn').addEventListener('click', openNoticeModal);
      if ($('add-photo-btn'))  $('add-photo-btn').addEventListener('click', openPhotoModal);
      if ($('notice-cancel'))  $('notice-cancel').addEventListener('click', closeNoticeModal);
      if ($('photo-cancel'))   $('photo-cancel').addEventListener('click', closePhotoModal);

      /* Schedule file input + clear button */
      if ($('n-schedule-file'))  $('n-schedule-file').addEventListener('change', handleScheduleFile);
      if ($('n-schedule-clear')) $('n-schedule-clear').addEventListener('click', clearSchedule);

      setupTabs();

      log('All event listeners attached. Ready.');

      if (isSignedIn()) {
        log('Found saved credentials — showing dashboard');
        showDash();
      } else {
        showLogin();
      }
    } catch (err) {
      log('Fatal error: ' + err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();