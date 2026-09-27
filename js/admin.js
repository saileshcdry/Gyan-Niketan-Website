/* =========================================================
   admin.js — GitHub-backed admin + CSV/Excel exam schedule
   ========================================================= */
(function () {
  'use strict';

  var LS_TOKEN = 'gn-gh-token';
  var LS_REPO  = 'gn-gh-repo';
  var BRANCH   = 'main';
  var NOTICES_PATH = 'data/notices.json';
  var GALLERY_PATH = 'data/gallery.json';
  var SHEETJS_URL  = 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js';

  /* Allowed category values — kept in sync with the <select> options
     in admin.html and with the whitelist in main.js / i18n.js. */
  var NOTICE_CATS  = ['general', 'exam', 'holiday', 'event'];
  var GALLERY_CATS = ['school', 'classroom', 'lab', 'sports', 'event'];

  var state = { notices: [], gallery: [], noticesSha: null, gallerySha: null, pendingSchedule: null };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); };

  /* ---------- auth ---------- */
  function getCreds() {
    return {
      token: localStorage.getItem(LS_TOKEN) || '',
      repo:  localStorage.getItem(LS_REPO)  || ''
    };
  }
  function isSignedIn() { var c = getCreds(); return !!(c.token && c.repo); }
  function signIn(token, repo) {
    localStorage.setItem(LS_TOKEN, token.trim());
    localStorage.setItem(LS_REPO, repo.trim().replace(/\.git$/, '').replace(/^https?:\/\/github\.com\//, ''));
  }
  function signOut() {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_REPO);
  }

  /* ---------- GitHub REST ---------- */
  function ghFetch(method, path, body) {
    var c = getCreds();
    var url = 'https://api.github.com/repos/' + c.repo + '/contents/' + path + (method === 'GET' ? '?ref=' + BRANCH : '');
    var headers = {
      'Authorization': 'Bearer ' + c.token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (body) headers['Content-Type'] = 'application/json';
    return fetch(url, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 404) return null;
      if (r.status === 401 || r.status === 403) throw new Error('Authentication failed. Check your token and its permissions (Contents: Read and write).');
      if (r.status === 409) throw new Error('Conflict: the file was modified elsewhere since you loaded it. Reload the admin page and try again.');
      if (r.status === 422) throw new Error('GitHub rejected the request (422). This usually means the file content or branch name is invalid.');
      if (!r.ok) return r.text().then(function (txt) { throw new Error('GitHub API ' + r.status + ': ' + txt); });
      return r.json();
    });
  }

  function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64decode(str) { return decodeURIComponent(escape(atob(str))); }

  function readJSONFile(path) {
    return ghFetch('GET', path).then(function (res) {
      if (!res) return { data: [], sha: null };
      return { data: JSON.parse(b64decode(res.content) || '[]'), sha: res.sha };
    });
  }

  function writeJSONFile(path, data, sha, message) {
    var body = { message: message, content: b64encode(JSON.stringify(data, null, 2)), branch: BRANCH };
    if (sha) body.sha = sha;
    return ghFetch('PUT', path, body);
  }

  function readImageAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = reader.result || '';
        var idx = result.indexOf(',');
        resolve({ base64: result.slice(idx + 1), dataUrl: result });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function uploadImageToRepo(folder, filename, base64) {
    return ghFetch('GET', folder + '/' + filename).then(function (existing) {
      var body = { message: 'Upload ' + filename, content: base64, branch: BRANCH };
      if (existing && existing.sha) body.sha = existing.sha;
      return ghFetch('PUT', folder + '/' + filename, body);
    });
  }

  /* ---------- status ---------- */
  function status(msg, kind) {
    var el = $('status');
    if (!el) return;
    if (!msg) { el.hidden = true; return; }
    el.hidden = false;
    el.className = 'admin-status ' + (kind || 'ok');
    el.textContent = msg;
    if (kind === 'ok') setTimeout(function () { el.hidden = true; }, 4500);
  }

  /* ---------- load / navigation ---------- */
  function showDash() { $('login-view').hidden = true; $('dash-view').hidden = false; loadAll(); }
  function showLogin() { $('login-view').hidden = false; $('dash-view').hidden = true; }

  function loadAll() {
    status('Loading data…', 'ok');
    Promise.all([readJSONFile(NOTICES_PATH), readJSONFile(GALLERY_PATH)])
      .then(function (res) {
        state.notices = res[0].data || [];
        state.noticesSha = res[0].sha;
        state.gallery = res[1].data || [];
        state.gallerySha = res[1].sha;
        state.notices.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
        renderNotices();
        renderGallery();
        status('');
      })
      .catch(function (err) { status(err.message, 'error'); });
  }

  /* ---------- notices list ---------- */
  function renderNotices() {
    var host = $('notices-list');
    if (!host) return;
    if (!state.notices.length) { host.innerHTML = '<p class="hint">No notices yet. Click "+ Add Notice" to create one.</p>'; return; }
    host.innerHTML = state.notices.map(function (n) {
      var hasSchedule = Array.isArray(n.schedule) && n.schedule.length > 0;
      return '<div class="admin-row" data-id="' + esc(n.id) + '">' +
        '<div>' +
          '<div class="title">' + esc(n.title_en || n.title_np || '(untitled)') + '</div>' +
          '<div class="meta">' + esc(n.date) + ' · ' + esc(n.cat) +
            (hasSchedule ? ' · 📅 ' + n.schedule.length + ' schedule rows' : '') +
          '</div>' +
        '</div>' +
        '<div class="actions">' +
          '<button type="button" data-act="edit">Edit</button>' +
          '<button type="button" class="danger" data-act="del">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- notice modal ---------- */
  function openNoticeModal(notice) {
    $('notice-modal-title').textContent = notice ? 'Edit Notice' : 'Add Notice';
    $('n-id').value = notice ? notice.id : '';
    $('n-date').value = notice ? notice.date : new Date().toISOString().slice(0, 10);
    $('n-cat').value = notice ? notice.cat : 'general';
    $('n-title-en').value = notice ? (notice.title_en || '') : '';
    $('n-title-np').value = notice ? (notice.title_np || '') : '';
    $('n-ex-en').value = notice ? (notice.excerpt_en || '') : '';
    $('n-ex-np').value = notice ? (notice.excerpt_np || '') : '';
    state.pendingSchedule = notice && Array.isArray(notice.schedule) ? notice.schedule.slice() : null;
    updateScheduleUI();
    $('notice-modal').hidden = false;
  }
  function closeNoticeModal() {
    $('notice-modal').hidden = true;
    state.pendingSchedule = null;
    var fi = $('n-schedule-file'); if (fi) fi.value = '';
    var prev = $('n-schedule-preview'); if (prev) prev.innerHTML = '';
  }

  function updateScheduleUI() {
    var cat = $('n-cat').value;
    var isExam = (cat === 'exam');
    var wrap = $('n-schedule-wrap');
    if (wrap) wrap.hidden = !isExam;
    var prev = $('n-schedule-preview');
    if (!prev) return;
    if (!isExam) { prev.innerHTML = ''; return; }
    if (!state.pendingSchedule || !state.pendingSchedule.length) {
      prev.innerHTML = '<p class="hint" style="margin:0;">No schedule attached yet. Upload a CSV or Excel file below.</p>';
      return;
    }
    var rows = state.pendingSchedule;
    var head = '<tr><th>Date</th><th>Time</th><th>Subject</th><th>Grade</th></tr>';
    var body = rows.map(function (r) {
      return '<tr><td>' + esc(r.date || '') + '</td><td>' + esc(r.time || '') + '</td>' +
             '<td>' + esc(r.subject || '') + '</td><td>' + esc(r.grade || '') + '</td></tr>';
    }).join('');
    prev.innerHTML =
      '<div style="margin-top:10px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
          '<strong style="font-size:.85rem;">' + rows.length + ' schedule rows attached</strong>' +
          '<button type="button" id="clear-schedule-btn" style="font-size:.8rem; color:#b91c1c; background:transparent; border:0; cursor:pointer;">Remove</button>' +
        '</div>' +
        '<div style="max-height:220px; overflow:auto; border:1px solid var(--gray-200); border-radius:8px;">' +
          '<table class="info-table" style="font-size:.82rem;"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
        '</div>' +
      '</div>';
    var clearBtn = $('clear-schedule-btn');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      state.pendingSchedule = null;
      var fi = $('n-schedule-file'); if (fi) fi.value = '';
      updateScheduleUI();
    });
  }

  /* ---------- CSV / Excel parsing ---------- */
  function loadSheetJS() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = SHEETJS_URL;
      s.onload = function () { resolve(window.XLSX); };
      s.onerror = function () { reject(new Error('Could not load spreadsheet parser. Check your internet connection.')); };
      document.head.appendChild(s);
    });
  }

  function parseCSV(text) {
    var rows = [], row = [], cur = '', inQ = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ',') { row.push(cur); cur = ''; }
        else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
        else if (c === '\r') { /* skip */ }
        else cur += c;
      }
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return String(c).trim(); }); });
  }

  function normaliseHeader(h) {
    var s = String(h || '').toLowerCase().trim().replace(/[^a-z]/g, '');
    if (s.indexOf('date') !== -1) return 'date';
    if (s.indexOf('time') !== -1) return 'time';
    if (s.indexOf('subject') !== -1 || s.indexOf('paper') !== -1) return 'subject';
    if (s.indexOf('grade') !== -1 || s.indexOf('class') !== -1) return 'grade';
    return null;
  }

  function normalizeSchedule(rows) {
    if (!rows.length) return [];
    var header = rows[0];
    var mapped = header.map(normaliseHeader);
    var hasHeader = mapped.some(function (m) { return m; });
    var startIdx = hasHeader ? 1 : 0;
    var cols = hasHeader ? mapped : ['date', 'time', 'subject', 'grade'];
    var out = [];
    for (var i = startIdx; i < rows.length; i++) {
      var r = rows[i];
      var obj = { date: '', time: '', subject: '', grade: '' };
      for (var j = 0; j < r.length; j++) {
        var key = cols[j];
        if (key) obj[key] = String(r[j] || '').trim();
      }
      if (obj.date || obj.subject) out.push(obj);
    }
    return out;
  }

  function parseScheduleFile(file) {
    var name = file.name.toLowerCase();
    if (name.endsWith('.csv') || name.endsWith('.txt')) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { try { resolve(normalizeSchedule(parseCSV(String(r.result || '')))); } catch (e) { reject(e); } };
        r.onerror = function () { reject(new Error('Could not read the file.')); };
        r.readAsText(file);
      });
    }
    // Excel
    return loadSheetJS().then(function (XLSX) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () {
          try {
            var wb = XLSX.read(new Uint8Array(r.result), { type: 'array' });
            var ws = wb.Sheets[wb.SheetNames[0]];
            var rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
            resolve(normalizeSchedule(rows.filter(function (row) { return row.some(function (c) { return String(c).trim(); }); })));
          } catch (e) { reject(new Error('Could not parse the Excel file.')); }
        };
        r.onerror = function () { reject(new Error('Could not read the file.')); };
        r.readAsArrayBuffer(file);
      });
    });
  }

  /* ---------- save notice ---------- */
  function saveNotice(e) {
    e.preventDefault();
    var id = $('n-id').value || ('n-' + Date.now());
    var catRaw = $('n-cat').value;
    var cat = (NOTICE_CATS.indexOf(catRaw) >= 0) ? catRaw : 'general';
    var entry = {
      id: id,
      date: $('n-date').value,
      cat: cat,
      title_en: $('n-title-en').value.trim(),
      title_np: $('n-title-np').value.trim(),
      excerpt_en: $('n-ex-en').value.trim(),
      excerpt_np: $('n-ex-np').value.trim()
    };
    if (cat === 'exam' && state.pendingSchedule && state.pendingSchedule.length) {
      entry.schedule = state.pendingSchedule;
    }
    var idx = state.notices.findIndex(function (n) { return n.id === id; });
    if (idx >= 0) state.notices[idx] = entry; else state.notices.unshift(entry);
    state.notices.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    status('Publishing notice…', 'ok');
    writeJSONFile(NOTICES_PATH, state.notices, state.noticesSha, (idx >= 0 ? 'Update notice: ' : 'Add notice: ') + entry.title_en)
      .then(function (res) {
        state.noticesSha = res.content.sha;
        renderNotices();
        closeNoticeModal();
        status('Notice published. The live site will update in ~1 minute.', 'ok');
      })
      .catch(function (err) { status(err.message, 'error'); });
  }

  function deleteNotice(id) {
    if (!confirm('Delete this notice? This will be published immediately.')) return;
    var idx = state.notices.findIndex(function (n) { return n.id === id; });
    if (idx < 0) return;
    var removed = state.notices[idx];
    state.notices.splice(idx, 1);
    status('Deleting…', 'ok');
    writeJSONFile(NOTICES_PATH, state.notices, state.noticesSha, 'Delete notice: ' + removed.title_en)
      .then(function (res) { state.noticesSha = res.content.sha; renderNotices(); status('Notice deleted.', 'ok'); })
      .catch(function (err) { state.notices.splice(idx, 0, removed); renderNotices(); status(err.message, 'error'); });
  }

  /* ---------- gallery ---------- */
  function renderGallery() {
    var host = $('gallery-list');
    if (!host) return;
    if (!state.gallery.length) { host.innerHTML = '<p class="hint">No photos yet. Click "+ Upload Photo".</p>'; return; }
    host.innerHTML = state.gallery.map(function (g) {
      return '<div class="thumb" data-id="' + esc(g.id) + '">' +
        '<img src="' + esc(g.src) + '" alt="">' +
        '<div class="cap">' +
          '<span>' + esc(g.title_en || '') + '</span>' +
          '<span>' +
            '<button type="button" data-act="edit">Edit</button>' +
            ' <button type="button" data-act="del">Delete</button>' +
          '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function openPhotoModal(item) {
    $('photo-modal-title').textContent = item ? 'Edit Photo' : 'Upload Photo';
    $('p-id').value = item ? item.id : '';
    $('p-existing-src').value = item ? item.src : '';
    $('p-cat').value = item ? item.cat : 'school';
    $('p-title-en').value = item ? (item.title_en || '') : '';
    $('p-title-np').value = item ? (item.title_np || '') : '';
    $('p-file').value = '';
    $('p-file-hint').textContent = item ? '(leave blank to keep existing photo)' : '(JPG/PNG, max ~2 MB)';
    $('photo-modal').hidden = false;
  }
  function closePhotoModal() { $('photo-modal').hidden = true; }

  function slugify(str) {
    return String(str || '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'photo';
  }

  function savePhoto(e) {
    e.preventDefault();
    var id = $('p-id').value || ('g-' + Date.now());
    var existingSrc = $('p-existing-src').value;
    var catRaw = $('p-cat').value;
    var cat = (GALLERY_CATS.indexOf(catRaw) >= 0) ? catRaw : 'school';
    var fileInput = $('p-file');
    var file = fileInput.files && fileInput.files[0];

    function finish(src) {
      var entry = {
        id: id,
        cat: cat,
        title_en: $('p-title-en').value.trim(),
        title_np: $('p-title-np').value.trim(),
        src: src
      };
      var idx = state.gallery.findIndex(function (g) { return g.id === id; });
      if (idx >= 0) state.gallery[idx] = entry; else state.gallery.push(entry);

      writeJSONFile(GALLERY_PATH, state.gallery, state.gallerySha, (idx >= 0 ? 'Update photo: ' : 'Add photo: ') + entry.title_en)
        .then(function (res) { state.gallerySha = res.content.sha; renderGallery(); closePhotoModal(); status('Photo published. The live site will update in ~1 minute.', 'ok'); })
        .catch(function (err) { status(err.message, 'error'); });
    }

    if (!file) {
      if (!existingSrc) { status('Please choose a photo file.', 'error'); return; }
      finish(existingSrc);
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) { status('Photo is too large. Please compress it below 2 MB.', 'error'); return; }

    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    var filename = slugify($('p-title-en').value) + '-' + Date.now() + '.' + ext;

    status('Uploading photo…', 'ok');
    readImageAsBase64(file)
      .then(function (b) { return uploadImageToRepo('assets/gallery', filename, b.base64); })
      .then(function () { finish('assets/gallery/' + filename); })
      .catch(function (err) { status('Upload failed: ' + err.message, 'error'); });
  }

  function deletePhoto(id) {
    if (!confirm('Remove this photo from the gallery? (The image file will stay in the repo.)')) return;
    var idx = state.gallery.findIndex(function (g) { return g.id === id; });
    if (idx < 0) return;
    var removed = state.gallery[idx];
    state.gallery.splice(idx, 1);
    status('Deleting…', 'ok');
    writeJSONFile(GALLERY_PATH, state.gallery, state.gallerySha, 'Delete photo: ' + removed.title_en)
      .then(function (res) { state.gallerySha = res.content.sha; renderGallery(); status('Photo removed from gallery.', 'ok'); })
      .catch(function (err) { state.gallery.splice(idx, 0, removed); renderGallery(); status(err.message, 'error'); });
  }

  /* ---------- wire up ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (isSignedIn()) showDash(); else showLogin();

    $('login-btn').addEventListener('click', function () {
      var token = $('token').value.trim();
      var repo  = $('repo').value.trim();
      if (!token || !repo) { $('login-status').hidden = false; $('login-status').className = 'admin-status error'; $('login-status').textContent = 'Please fill both fields.'; return; }
      signIn(token, repo);
      showDash();
    });
    $('signout-btn').addEventListener('click', function () { signOut(); showLogin(); $('token').value = ''; });

    // tabs
    document.querySelectorAll('.admin-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.admin-tabs button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        $('tab-notices').hidden = (b.dataset.tab !== 'notices');
        $('tab-gallery').hidden = (b.dataset.tab !== 'gallery');
      });
    });

    // notices
    $('add-notice-btn').addEventListener('click', function () { openNoticeModal(null); });
    $('notice-cancel').addEventListener('click', closeNoticeModal);
    $('notice-form').addEventListener('submit', saveNotice);
    $('n-cat').addEventListener('change', updateScheduleUI);

    var fileInput = $('n-schedule-file');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) return;
        status('Reading schedule file…', 'ok');
        parseScheduleFile(f)
          .then(function (rows) {
            if (!rows.length) throw new Error('No rows found. Expected columns: Date, Time, Subject, Grade.');
            state.pendingSchedule = rows;
            updateScheduleUI();
            status('Loaded ' + rows.length + ' schedule rows.', 'ok');
          })
          .catch(function (err) { status(err.message, 'error'); });
      });
    }

    $('notices-list').addEventListener('click', function (e) {
      var btn = e.target.closest('button'); if (!btn) return;
      var row = e.target.closest('.admin-row'); if (!row) return;
      var id = row.dataset.id;
      if (btn.dataset.act === 'edit') openNoticeModal(state.notices.find(function (n) { return n.id === id; }));
      if (btn.dataset.act === 'del')  deleteNotice(id);
    });

    // gallery
    $('add-photo-btn').addEventListener('click', function () { openPhotoModal(null); });
    $('photo-cancel').addEventListener('click', closePhotoModal);
    $('photo-form').addEventListener('submit', savePhoto);
    $('gallery-list').addEventListener('click', function (e) {
      var btn = e.target.closest('button'); if (!btn) return;
      var thumb = e.target.closest('.thumb'); if (!thumb) return;
      var id = thumb.dataset.id;
      if (btn.dataset.act === 'edit') openPhotoModal(state.gallery.find(function (g) { return g.id === id; }));
      if (btn.dataset.act === 'del')  deletePhoto(id);
    });
  });
})();