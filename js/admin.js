/**
 * admin.js — Gyan Niketan admin panel
 * Matches admin.html element IDs. Uses `hidden` attribute for view toggling.
 *
 * Schedule parser handles 3 layouts:
 *   A) header row with field names: Date | Time | Subject | Grade
 *   B) transposed: field names in column 0, data across columns
 *   C) matrix: column 0 = Class/Grade, other columns = dates, cells = subjects.
 *      Multiple matrix sections in one file are supported (separated by blank rows
 *      or by another "Class | dates..." header row).
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

  /* ---------- state ---------- */

  var state = {
    notices: [],
    gallery: [],
    noticesSha: null,
    gallerySha: null
  };

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
      state.notices    = r[0].data || [];
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
      var div = document.createElement('div');
      div.className = 'admin-item';
      div.innerHTML =
        '<div class="admin-item-info">' +
          '<strong>' + esc(n.title_en || n.title_np || 'Untitled') + '</strong>' +
          '<span>' + esc(n.date || '') + ' · ' + esc(n.category || '') + '</span>' +
        '</div>' +
        '<div class="admin-item-actions">' +
          '<button type="button" class="btn btn-outline edit-notice" data-id="' + esc(n.id) + '">Edit</button>' +
          '<button type="button" class="btn btn-outline delete-notice" data-id="' + esc(n.id) + '">Delete</button>' +
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

  function openNoticeModal() { show($('notice-modal')); }
  function closeNoticeModal() {
    hide($('notice-modal'));
    var f = $('notice-form'); if (f) f.reset();
    if ($('n-id')) $('n-id').value = '';
    if ($('notice-modal-title')) $('notice-modal-title').textContent = 'Add Notice';
    hide($('n-schedule-wrap'));
    if ($('n-schedule-preview')) $('n-schedule-preview').innerHTML = '';
  }
  function toggleSchedule() {
    if ($('n-cat') && $('n-cat').value === 'exam') show($('n-schedule-wrap'));
    else hide($('n-schedule-wrap'));
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
    $('n-cat').value = n.category || 'general';
    $('n-title-en').value = n.title_en || '';
    $('n-title-np').value = n.title_np || '';
    $('n-ex-en').value = n.message_en || '';
    $('n-ex-np').value = n.message_np || '';
    toggleSchedule();
    openNoticeModal();
  }

  function saveNotice(e) {
    if (e) e.preventDefault();
    var id = $('n-id').value || 'n-' + Date.now();
    var notice = {
      id: id,
      date: $('n-date').value,
      category: $('n-cat').value,
      title_en: $('n-title-en').value.trim(),
      title_np: $('n-title-np').value.trim(),
      message_en: $('n-ex-en').value,
      message_np: $('n-ex-np').value
    };
    if (!notice.title_en && !notice.title_np) { alert('Title is required.'); return; }
    if (NOTICE_CATS.indexOf(notice.category) === -1) { alert('Invalid category.'); return; }

    for (var i = 0; i < state.notices.length; i++) {
      if (state.notices[i].id === id && state.notices[i].schedule) {
        notice.schedule = state.notices[i].schedule;
        break;
      }
    }

    var fileInput = $('n-schedule-file');
    if (notice.category === 'exam' && fileInput && fileInput.files && fileInput.files[0]) {
      parseScheduleFile(fileInput.files[0]).then(function (rows) {
        notice.schedule = rows;
        commitNotice(notice);
      }).catch(function (err) {
        alert('Schedule parse error: ' + err.message);
      });
      return;
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
      div.className = 'admin-gallery-item';
      div.innerHTML =
        '<img src="' + esc(g.src) + '" alt="" onerror="this.style.opacity=0.3">' +
        '<div class="admin-gallery-meta">' +
          '<strong>' + esc(g.title_en || g.title_np || 'Untitled') + '</strong>' +
          '<span>' + esc(g.cat || '') + '</span>' +
        '</div>' +
        '<div class="admin-item-actions">' +
          '<button type="button" class="btn btn-outline edit-photo" data-id="' + esc(g.id) + '">Edit</button>' +
          '<button type="button" class="btn btn-outline delete-photo" data-id="' + esc(g.id) + '">Delete</button>' +
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

  /* ============================================================
     CSV / Excel schedule parser — 3 layouts
     ============================================================ */

  function loadSheetJS() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = function () { resolve(window.XLSX); };
      s.onerror = function () { reject(new Error('Failed to load SheetJS')); };
      document.head.appendChild(s);
    });
  }

  function parseScheduleFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () {
          try { resolve(normalizeSchedule(parseCSV(r.result))); }
          catch (e) { reject(e); }
        };
        r.onerror = function () { reject(new Error('File read error')); };
        r.readAsText(file);
      });
    }
    return loadSheetJS().then(function (XLSX) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () {
          try {
            var data = new Uint8Array(r.result);
            var wb = XLSX.read(data, { type: 'array', cellDates: false });
            var ws = wb.Sheets[wb.SheetNames[0]];
            var rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false, blankrows: true });
            resolve(normalizeSchedule(rows));
          } catch (e) { reject(e); }
        };
        r.onerror = function () { reject(new Error('File read error')); };
        r.readAsArrayBuffer(file);
      });
    });
  }

  /* RFC-4180-ish CSV parser */
  function parseCSV(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var rows = [], cur = [], field = '', inQ = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += ch;
      } else {
        if (ch === '"') inQ = true;
        else if (ch === ',') { cur.push(field); field = ''; }
        else if (ch === '\r') { /* skip */ }
        else if (ch === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
        else field += ch;
      }
    }
    if (field.length || cur.length) { cur.push(field); rows.push(cur); }
    return rows;
  }

  function normHeader(s) {
    return String(s == null ? '' : s)
      .replace(/\uFEFF/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  var FIELD_ALIASES = {
    date:    ['date','examdate','examday','miti','datebs','datead','datebsad'],
    time:    ['time','examtime','samaya','shift','slot'],
    subject: ['subject','subjectname','paper','sub','vishay','visay','topic'],
    grade:   ['grade','class','classname','level','kaksha','std','standard','section']
  };

  function findCol(headers, aliases) {
    var i, j;
    for (i = 0; i < headers.length; i++) {
      for (j = 0; j < aliases.length; j++) if (headers[i] === aliases[j]) return i;
    }
    for (i = 0; i < headers.length; i++) {
      if (!headers[i]) continue;
      for (j = 0; j < aliases.length; j++) if (headers[i].indexOf(aliases[j]) !== -1) return i;
    }
    return -1;
  }

  function whichField(normalized) {
    var keys = Object.keys(FIELD_ALIASES);
    for (var i = 0; i < keys.length; i++) {
      var list = FIELD_ALIASES[keys[i]];
      for (var j = 0; j < list.length; j++) if (normalized === list[j]) return keys[i];
    }
    return null;
  }

  function cellStr(v) {
    if (v == null) return '';
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v).trim();
  }

  function looksLikeDate(v) {
    if (v instanceof Date) return true;
    var s = cellStr(v);
    if (!s) return false;
    return /^\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/.test(s);
  }

  function normalizeSchedule(rows) {
    if (!rows || !rows.length) return [];
    var a = tryRowHeaders(rows);    if (a) return a;
    var b = tryColumnHeaders(rows); if (b) return b;
    var c = tryMatrix(rows);        if (c) return c;
    var preview = rows.slice(0, 4).map(function (r) { return (r || []).join(' | '); }).join('  //  ');
    throw new Error('Could not detect a known layout. First rows: ' + preview);
  }

  /* --- A: header row with field names --- */
  function tryRowHeaders(rows) {
    for (var r = 0; r < Math.min(rows.length, 5); r++) {
      var headers = (rows[r] || []).map(normHeader);
      var nonEmpty = headers.filter(function (x) { return x; });
      if (nonEmpty.length < 2) continue;

      var iD = findCol(headers, FIELD_ALIASES.date);
      var iT = findCol(headers, FIELD_ALIASES.time);
      var iS = findCol(headers, FIELD_ALIASES.subject);
      var iG = findCol(headers, FIELD_ALIASES.grade);
      if (iD === -1 || iS === -1 || iG === -1) continue;

      var out = [];
      for (var i = r + 1; i < rows.length; i++) {
        var row = rows[i] || [];
        var date    = cellStr(row[iD]);
        var time    = iT !== -1 ? cellStr(row[iT]) : '';
        var subject = cellStr(row[iS]);
        var grade   = cellStr(row[iG]);
        if (!date && !time && !subject && !grade) continue;
        out.push({ date: date, time: time, subject: subject, grade: grade });
      }
      if (out.length) {
        log('Schedule (A: row-headers): ' + out.length + ' rows');
        return out;
      }
    }
    return null;
  }

  /* --- B: field names in column 0, data across columns --- */
  function tryColumnHeaders(rows) {
    var fieldRow = {};
    var scan = Math.min(rows.length, 10);
    for (var r = 0; r < scan; r++) {
      var first = normHeader((rows[r] || [])[0]);
      if (!first) continue;
      var f = whichField(first);
      if (f && fieldRow[f] == null) fieldRow[f] = r;
    }
    if (fieldRow.date == null || fieldRow.subject == null || fieldRow.grade == null) return null;

    var maxCols = 0;
    Object.keys(fieldRow).forEach(function (k) {
      var len = (rows[fieldRow[k]] || []).length;
      if (len > maxCols) maxCols = len;
    });

    var out = [];
    for (var c = 1; c < maxCols; c++) {
      var date    = cellStr((rows[fieldRow.date]    || [])[c]);
      var time    = fieldRow.time != null ? cellStr((rows[fieldRow.time] || [])[c]) : '';
      var subject = cellStr((rows[fieldRow.subject] || [])[c]);
      var grade   = cellStr((rows[fieldRow.grade]   || [])[c]);
      if (!date && !time && !subject && !grade) continue;
      out.push({ date: date, time: time, subject: subject, grade: grade });
    }
    if (out.length) {
      log('Schedule (B: transposed): ' + out.length + ' rows');
      return out;
    }
    return null;
  }

  /* --- C: matrix ---
       Class   | 2083/06/22 | 2083/06/23 | ...
       Nine    | Nepali     | Math       | ...
       (blank row or another "Class | dates" header starts a new section)
     Time labels are captured if a lone row above a section contains a time-like value. */
  function tryMatrix(rows) {
    var out = [];
    var currentTime = '';
    var i = 0;

    while (i < rows.length) {
      var row = rows[i] || [];

      var t = detectTimeLabel(row);
      if (t) { currentTime = t; i++; continue; }

      if (isMatrixHeaderRow(row)) {
        var dateCols = extractDateColsFromHeader(row);
        if (dateCols.length) {
          i++;
          while (i < rows.length) {
            var drow = rows[i] || [];

            if (!rowHasData(drow)) { i++; continue; }
            if (isMatrixHeaderRow(drow)) break;
            if (detectTimeLabel(drow)) break;

            var grade = cellStr(drow[0]);
            if (grade) {
              for (var d = 0; d < dateCols.length; d++) {
                var dc = dateCols[d];
                var subj = cellStr(drow[dc.col]);
                if (!subj) continue;
                out.push({ date: dc.date, time: currentTime, subject: subj, grade: grade });
              }
            }
            i++;
          }
          continue;
        }
      }
      i++;
    }

    if (out.length) {
      log('Schedule (C: matrix): ' + out.length + ' rows');
      return out;
    }
    return null;
  }

  function rowHasData(row) {
    if (!row) return false;
    for (var x = 0; x < row.length; x++) {
      if (cellStr(row[x])) return true;
    }
    return false;
  }

  function isMatrixHeaderRow(row) {
    if (!row || row.length < 2) return false;
    var first = normHeader(row[0]);
    if (!first) return false;
    for (var k = 0; k < FIELD_ALIASES.grade.length; k++) {
      if (first === FIELD_ALIASES.grade[k]) return true;
    }
    return false;
  }

  function extractDateColsFromHeader(row) {
    var cols = [];
    for (var c = 1; c < row.length; c++) {
      if (looksLikeDate(row[c])) cols.push({ col: c, date: cellStr(row[c]) });
    }
    return cols;
  }

  function detectTimeLabel(row) {
    if (!row || !row.length) return '';
    var nonEmpty = [];
    for (var i = 0; i < row.length; i++) {
      var v = cellStr(row[i]);
      if (v) nonEmpty.push(v);
    }
    if (!nonEmpty.length || nonEmpty.length > 2) return '';
    var joined = nonEmpty.join(' ').trim();

    var m = joined.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/);
    if (m) return m[1].toUpperCase().replace(/\s+/g, ' ');

    if (/^(morning|afternoon|evening|primary|secondary|basic|pre.?primary|shift\s*\d+|time\s*\d*|first\s*shift|second\s*shift|third\s*shift)$/i.test(joined)) {
      return joined;
    }
    return '';
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

      if ($('n-cat')) $('n-cat').addEventListener('change', toggleSchedule);

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
