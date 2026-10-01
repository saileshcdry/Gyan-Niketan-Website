/**
 * admin.js - Gyan Niketan admin panel
 * Corrected: no applyLanguage, no main.js dependency.
 */
(function () {
  'use strict';

  var TOKEN_KEY = 'gn-gh-token';
  var REPO_KEY = 'gn-gh-repo';
  var NOTICE_CATS = ['general', 'exam', 'holiday', 'event'];
  var GALLERY_CATS = ['school', 'classroom', 'lab', 'sports', 'event'];
  var API = 'https://api.github.com/repos/';

  function showFatalError(err) {
    console.error('[ADMIN] Fatal error:', err);
    var el = document.getElementById('admin-error');
    if (!el) {
      el = document.createElement('div');
      el.id = 'admin-error';
      el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#b00020;color:#fff;padding:12px;z-index:9999;font-family:monospace;white-space:pre-wrap;';
      document.body.appendChild(el);
    }
    el.textContent = 'Admin error: ' + (err && err.message ? err.message : String(err));
  }

  function log() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[ADMIN]');
    console.log.apply(console, args);
  }

  function getCreds() {
    return {
      token: localStorage.getItem(TOKEN_KEY) || '',
      repo: localStorage.getItem(REPO_KEY) || ''
    };
  }

  function isSignedIn() {
    var c = getCreds();
    return !!(c.token && c.repo);
  }

  function signIn(e) {
    if (e) e.preventDefault();
    var tokenEl = document.getElementById('token');
    var repoEl = document.getElementById('repo');
    if (!tokenEl || !repoEl) {
      showFatalError(new Error('Missing #token or #repo input'));
      return;
    }
    var token = tokenEl.value.trim();
    var repo = repoEl.value.trim();
    if (!token || !repo) {
      alert('Please enter both GitHub token and repository (owner/repo).');
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REPO_KEY, repo);
    log('Signed in as repo:', repo);
    showDash();
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REPO_KEY);
    log('Signed out');
    showLogin();
  }

  function showLogin() {
    var loginView = document.getElementById('login-view');
    var dashView = document.getElementById('dash-view');
    if (loginView) loginView.style.display = '';
    if (dashView) dashView.style.display = 'none';
  }

  function showDash() {
    var loginView = document.getElementById('login-view');
    var dashView = document.getElementById('dash-view');
    if (loginView) loginView.style.display = 'none';
    if (dashView) dashView.style.display = '';
    loadData();
  }

  function ghFetch(method, path, body) {
    var c = getCreds();
    if (!c.token || !c.repo) {
      return Promise.reject(new Error('Not signed in'));
    }
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
    log('GitHub API', method, path);
    return fetch(url, opts).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (err) {
          var msg = err.message || res.statusText;
          if (res.status === 409) msg = 'Conflict: ' + msg + ' (refresh and try again)';
          if (res.status === 422) msg = 'Unprocessable: ' + msg;
          throw new Error(msg);
        });
      }
      return res.json();
    });
  }

  function b64encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function b64decode(str) {
    return decodeURIComponent(escape(atob(str.replace(/\s/g, ''))));
  }

  function readJSONFile(path) {
    return ghFetch('GET', path + '?ref=main').then(function (data) {
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

  var state = {
    notices: [],
    gallery: [],
    noticesSha: null,
    gallerySha: null,
    editingNoticeId: null,
    editingPhotoId: null
  };

  function loadData() {
    log('Loading data...');
    Promise.all([
      readJSONFile('data/notices.json').catch(function (e) {
        log('Notices load error', e);
        return { data: [], sha: null };
      }),
      readJSONFile('data/gallery.json').catch(function (e) {
        log('Gallery load error', e);
        return { data: [], sha: null };
      })
    ]).then(function (results) {
      state.notices = results[0].data || [];
      state.noticesSha = results[0].sha;
      state.gallery = results[1].data || [];
      state.gallerySha = results[1].sha;
      renderNotices();
      renderGallery();
    }).catch(function (err) {
      showFatalError(err);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function renderNotices() {
    var list = document.getElementById('notices-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.notices.length) {
      list.innerHTML = '<p>No notices yet.</p>';
      return;
    }
    state.notices.forEach(function (n) {
      var div = document.createElement('div');
      div.className = 'admin-item';
      div.innerHTML = '<strong>' + escapeHtml(n.title_en || n.title_np || 'Untitled') + '</strong>' +
        '<span> ' + escapeHtml(n.date || '') + ' · ' + escapeHtml(n.category || '') + '</span>' +
        '<button data-id="' + n.id + '" class="edit-notice">Edit</button>' +
        '<button data-id="' + n.id + '" class="delete-notice">Delete</button>';
      list.appendChild(div);
    });
    Array.prototype.forEach.call(list.querySelectorAll('.edit-notice'), function (btn) {
      btn.addEventListener('click', function () {
        editNotice(btn.getAttribute('data-id'));
      });
    });
    Array.prototype.forEach.call(list.querySelectorAll('.delete-notice'), function (btn) {
      btn.addEventListener('click', function () {
        deleteNotice(btn.getAttribute('data-id'));
      });
    });
  }

  function renderGallery() {
    var list = document.getElementById('gallery-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.gallery.length) {
      list.innerHTML = '<p>No photos yet.</p>';
      return;
    }
    state.gallery.forEach(function (g) {
      var div = document.createElement('div');
      div.className = 'admin-item';
      div.innerHTML = '<img src="' + escapeHtml(g.src) + '" style="max-width:80px;vertical-align:middle;"> ' +
        '<strong>' + escapeHtml(g.title_en || g.title_np || 'Untitled') + '</strong>' +
        '<span> ' + escapeHtml(g.cat || '') + '</span>' +
        '<button data-id="' + g.id + '" class="edit-photo">Edit</button>' +
        '<button data-id="' + g.id + '" class="delete-photo">Delete</button>';
      list.appendChild(div);
    });
    Array.prototype.forEach.call(list.querySelectorAll('.edit-photo'), function (btn) {
      btn.addEventListener('click', function () {
        editPhoto(btn.getAttribute('data-id'));
      });
    });
    Array.prototype.forEach.call(list.querySelectorAll('.delete-photo'), function (btn) {
      btn.addEventListener('click', function () {
        deletePhoto(btn.getAttribute('data-id'));
      });
    });
  }

  function editNotice(id) {
    var n = null;
    for (var i = 0; i < state.notices.length; i++) {
      if (state.notices[i].id === id) { n = state.notices[i]; break; }
    }
    if (!n) return;
    state.editingNoticeId = id;
    var f = {
      id: document.getElementById('notice-id'),
      date: document.getElementById('notice-date'),
      cat: document.getElementById('notice-category'),
      titleEn: document.getElementById('notice-title-en'),
      titleNp: document.getElementById('notice-title-np'),
      msgEn: document.getElementById('notice-message-en'),
      msgNp: document.getElementById('notice-message-np')
    };
    if (f.id) f.id.value = n.id || '';
    if (f.date) f.date.value = n.date || '';
    if (f.cat) f.cat.value = n.category || 'general';
    if (f.titleEn) f.titleEn.value = n.title_en || '';
    if (f.titleNp) f.titleNp.value = n.title_np || '';
    if (f.msgEn) f.msgEn.value = n.message_en || '';
    if (f.msgNp) f.msgNp.value = n.message_np || '';
    var form = document.getElementById('notice-form');
    if (form) form.style.display = '';
  }

  function deleteNotice(id) {
    if (!confirm('Delete this notice?')) return;
    var next = state.notices.filter(function (n) { return n.id !== id; });
    writeJSONFile('data/notices.json', next, state.noticesSha, 'Delete notice ' + id)
      .then(function () {
        log('Notice deleted:', id);
        loadData();
      })
      .catch(showFatalError);
  }

  function saveNotice(e) {
    if (e) e.preventDefault();
    var id = document.getElementById('notice-id') ? document.getElementById('notice-id').value : '';
    var date = document.getElementById('notice-date') ? document.getElementById('notice-date').value : '';
    var cat = document.getElementById('notice-category') ? document.getElementById('notice-category').value : 'general';
    var titleEn = document.getElementById('notice-title-en') ? document.getElementById('notice-title-en').value : '';
    var titleNp = document.getElementById('notice-title-np') ? document.getElementById('notice-title-np').value : '';
    var msgEn = document.getElementById('notice-message-en') ? document.getElementById('notice-message-en').value : '';
    var msgNp = document.getElementById('notice-message-np') ? document.getElementById('notice-message-np').value : '';
    if (!titleEn && !titleNp) { alert('Title is required.'); return; }
    if (NOTICE_CATS.indexOf(cat) === -1) { alert('Invalid notice category.'); return; }

    var notice = {
      id: id || 'n-' + Date.now(),
      date: date,
      category: cat,
      title_en: titleEn,
      title_np: titleNp,
      message_en: msgEn,
      message_np: msgNp
    };

    // If exam category, try to parse schedule file
    if (cat === 'exam') {
      var fileInput = document.getElementById('notice-schedule-file');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        parseScheduleFile(fileInput.files[0]).then(function (rows) {
          notice.schedule = rows;
          commitNotice(notice);
        }).catch(function (err) {
          alert('Schedule parse error: ' + err.message);
        });
        return;
      }
    }
    commitNotice(notice);
  }

  function commitNotice(notice) {
    var existing = state.notices.slice();
    var idx = -1;
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].id === notice.id) { idx = i; break; }
    }
    if (idx >= 0) existing[idx] = notice;
    else existing.push(notice);

    writeJSONFile('data/notices.json', existing, state.noticesSha, 'Save notice ' + notice.id)
      .then(function () {
        log('Notice saved:', notice.id);
        state.editingNoticeId = null;
        var form = document.getElementById('notice-form');
        if (form) form.reset();
        loadData();
      })
      .catch(showFatalError);
  }

  function editPhoto(id) {
    var g = null;
    for (var i = 0; i < state.gallery.length; i++) {
      if (state.gallery[i].id === id) { g = state.gallery[i]; break; }
    }
    if (!g) return;
    state.editingPhotoId = id;
    var f = {
      id: document.getElementById('photo-id'),
      cat: document.getElementById('photo-category'),
      titleEn: document.getElementById('photo-title-en'),
      titleNp: document.getElementById('photo-title-np')
    };
    if (f.id) f.id.value = g.id || '';
    if (f.cat) f.cat.value = g.cat || 'school';
    if (f.titleEn) f.titleEn.value = g.title_en || '';
    if (f.titleNp) f.titleNp.value = g.title_np || '';
    var form = document.getElementById('photo-form');
    if (form) form.style.display = '';
  }

  function deletePhoto(id) {
    if (!confirm('Delete this photo?')) return;
    var next = state.gallery.filter(function (g) { return g.id !== id; });
    writeJSONFile('data/gallery.json', next, state.gallerySha, 'Delete photo ' + id)
      .then(function () {
        log('Photo deleted:', id);
        loadData();
      })
      .catch(showFatalError);
  }

  function savePhoto(e) {
    if (e) e.preventDefault();
    var id = document.getElementById('photo-id') ? document.getElementById('photo-id').value : '';
    var cat = document.getElementById('photo-category') ? document.getElementById('photo-category').value : 'school';
    var titleEn = document.getElementById('photo-title-en') ? document.getElementById('photo-title-en').value : '';
    var titleNp = document.getElementById('photo-title-np') ? document.getElementById('photo-title-np').value : '';
    var fileInput = document.getElementById('photo-file');
    if (!titleEn && !titleNp) { alert('Title is required.'); return; }
    if (GALLERY_CATS.indexOf(cat) === -1) { alert('Invalid gallery category.'); return; }
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      if (!id) { alert('Please choose a photo.'); return; }
      // Editing without new file: just update metadata
      updateGalleryEntry(id, cat, titleEn, titleNp, null);
      return;
    }
    var file = fileInput.files[0];
    if (file.size > 2 * 1024 * 1024) { alert('Photo must be under 2 MB.'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var base64 = reader.result.split(',')[1];
      var ext = file.name.split('.').pop().toLowerCase();
      var newId = id || 'g-' + Date.now();
      var filename = newId + '.' + ext;
      var path = 'assets/gallery/' + filename;
      ghFetch('PUT', path, {
        message: 'Upload gallery photo ' + filename,
        content: base64,
        branch: 'main'
      }).then(function () {
        updateGalleryEntry(newId, cat, titleEn, titleNp, path);
      }).catch(showFatalError);
    };
    reader.readAsDataURL(file);
  }

  function updateGalleryEntry(id, cat, titleEn, titleNp, src) {
    var existing = state.gallery.slice();
    var idx = -1;
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].id === id) { idx = i; break; }
    }
    var entry = {
      id: id,
      cat: cat,
      title_en: titleEn,
      title_np: titleNp,
      src: src || (idx >= 0 ? existing[idx].src : '')
    };
    if (!entry.src) { alert('Photo source missing.'); return; }
    if (idx >= 0) existing[idx] = entry;
    else existing.push(entry);

    writeJSONFile('data/gallery.json', existing, state.gallerySha, 'Save gallery photo ' + id)
      .then(function () {
        log('Gallery saved:', id);
        state.editingPhotoId = null;
        var form = document.getElementById('photo-form');
        if (form) form.reset();
        loadData();
      })
      .catch(showFatalError);
  }

  /* ---------- CSV / SheetJS schedule parsing ---------- */

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
        var reader = new FileReader();
        reader.onload = function () {
          try {
            resolve(normalizeSchedule(parseCSV(reader.result)));
          } catch (e) { reject(e); }
        };
        reader.onerror = function () { reject(new Error('File read error')); };
        reader.readAsText(file);
      });
    }
    return loadSheetJS().then(function (XLSX) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data, { type: 'array' });
            var ws = wb.Sheets[wb.SheetNames[0]];
            var rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            resolve(normalizeSchedule(rows));
          } catch (e) { reject(e); }
        };
        reader.onerror = function () { reject(new Error('File read error')); };
        reader.readAsArrayBuffer(file);
      });
    });
  }

  function parseCSV(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    var rows = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var cells = [];
      var cur = '';
      var inQuotes = false;
      for (var j = 0; j < line.length; j++) {
        var ch = line[j];
        if (ch === '"') {
          if (inQuotes && line[j + 1] === '"') { cur += '"'; j++; }
          else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          cells.push(cur.trim()); cur = '';
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      rows.push(cells);
    }
    return rows;
  }

  function normalizeSchedule(rows) {
    if (!rows || !rows.length) return [];
    var header = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
    var idx = {
      date: header.indexOf('date'),
      time: header.indexOf('time'),
      subject: header.indexOf('subject'),
      grade: header.indexOf('grade')
    };
    if (idx.date === -1 || idx.time === -1 || idx.subject === -1 || idx.grade === -1) {
      throw new Error('CSV must have columns: Date, Time, Subject, Grade');
    }
    var out = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r || r.length < 4) continue;
      out.push({
        date: String(r[idx.date] || '').trim(),
        time: String(r[idx.time] || '').trim(),
        subject: String(r[idx.subject] || '').trim(),
        grade: String(r[idx.grade] || '').trim()
      });
    }
    return out;
  }

  /* ---------- Init ---------- */

  function init() {
    log('Script starting...');
    try {
      var required = ['login-btn', 'repo', 'token', 'dash-view', 'login-view'];
      var missing = required.filter(function (id) { return !document.getElementById(id); });
      if (missing.length) {
        log('Missing required elements:', missing);
      }

      var loginBtn = document.getElementById('login-btn');
      if (loginBtn) loginBtn.addEventListener('click', signIn);

      var logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.addEventListener('click', signOut);

      var noticeForm = document.getElementById('notice-form');
      if (noticeForm) noticeForm.addEventListener('submit', saveNotice);

      var photoForm = document.getElementById('photo-form');
      if (photoForm) photoForm.addEventListener('submit', savePhoto);

      var addNoticeBtn = document.getElementById('add-notice-btn');
      if (addNoticeBtn) {
        addNoticeBtn.addEventListener('click', function () {
          state.editingNoticeId = null;
          var form = document.getElementById('notice-form');
          if (form) { form.reset(); form.style.display = ''; }
        });
      }

      var addPhotoBtn = document.getElementById('add-photo-btn');
      if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function () {
          state.editingPhotoId = null;
          var form = document.getElementById('photo-form');
          if (form) { form.reset(); form.style.display = ''; }
        });
      }

      if (isSignedIn()) {
        showDash();
      } else {
        showLogin();
      }
    } catch (err) {
      showFatalError(err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();