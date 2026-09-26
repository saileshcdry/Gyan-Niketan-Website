/* =========================================================
   admin.js — GitHub-backed admin for notices & gallery
   ========================================================= */
(function () {
  'use strict';

  var LS_TOKEN = 'gn-gh-token';
  var LS_REPO  = 'gn-gh-repo';
  var BRANCH   = 'main';
  var NOTICES_PATH = 'data/notices.json';
  var GALLERY_PATH = 'data/gallery.json';

  var state = { notices: [], gallery: [], noticesSha: null, gallerySha: null };

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
    return fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + c.token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 404) return null;
      if (r.status === 401 || r.status === 403) throw new Error('Authentication failed. Check your token and its permissions (Contents: Read and write).');
      if (!r.ok) return r.text().then(function (t) { throw new Error('GitHub API ' + r.status + ': ' + t); });
      return r.json();
    });
  }

  function b64encode(str) {
    // UTF-8 safe base64
    return btoa(unescape(encodeURIComponent(str)));
  }
  function b64decode(str) {
    return decodeURIComponent(escape(atob(str)));
  }

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

  /* ---------- UI ---------- */
  function status(msg, kind) {
    var el = $('status');
    if (!el) return;
    if (!msg) { el.hidden = true; return; }
    el.hidden = false;
    el.className = 'admin-status ' + (kind || 'ok');
    el.textContent = msg;
    if (kind === 'ok') setTimeout(function () { el.hidden = true; }, 4000);
  }

  function showDash() {
    $('login-view').hidden = true;
    $('dash-view').hidden = false;
    loadAll();
  }
  function showLogin() {
    $('login-view').hidden = false;
    $('dash-view').hidden = true;
  }

  /* ---------- load ---------- */
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

  /* ---------- notices ---------- */
  function renderNotices() {
    var host = $('notices-list');
    if (!host) return;
    if (!state.notices.length) { host.innerHTML = '<p class="hint">No notices yet. Click "+ Add Notice" to create one.</p>'; return; }
    host.innerHTML = state.notices.map(function (n) {
      return '<div class="admin-row" data-id="' + esc(n.id) + '">' +
        '<div>' +
          '<div class="title">' + esc(n.title_en || n.title_np || '(untitled)') + '</div>' +
          '<div class="meta">' + esc(n.date) + ' · ' + esc(n.cat) + '</div>' +
        '</div>' +
        '<div class="actions">' +
          '<button type="button" data-act="edit">Edit</button>' +
          '<button type="button" class="danger" data-act="del">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function openNoticeModal(notice) {
    $('notice-modal-title').textContent = notice ? 'Edit Notice' : 'Add Notice';
    $('n-id').value = notice ? notice.id : '';
    $('n-date').value = notice ? notice.date : new Date().toISOString().slice(0, 10);
    $('n-cat').value = notice ? notice.cat : 'general';
    $('n-title-en').value = notice ? (notice.title_en || '') : '';
    $('n-title-np').value = notice ? (notice.title_np || '') : '';
    $('n-ex-en').value = notice ? (notice.excerpt_en || '') : '';
    $('n-ex-np').value = notice ? (notice.excerpt_np || '') : '';
    $('notice-modal').hidden = false;
  }
  function closeNoticeModal() { $('notice-modal').hidden = true; }

  function saveNotice(e) {
    e.preventDefault();
    var id = $('n-id').value || ('n-' + Date.now());
    var entry = {
      id: id,
      date: $('n-date').value,
      cat: $('n-cat').value,
      title_en: $('n-title-en').value.trim(),
      title_np: $('n-title-np').value.trim(),
      excerpt_en: $('n-ex-en').value.trim(),
      excerpt_np: $('n-ex-np').value.trim()
    };
    var idx = state.notices.findIndex(function (n) { return n.id === id; });
    if (idx >= 0) state.notices[idx] = entry; else state.notices.unshift(entry);
    state.notices.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    status('Publishing notice…', 'ok');
    writeJSONFile(NOTICES_PATH, state.notices, state.noticesSha, (idx >= 0 ? 'Update notice: ' : 'Add notice: ') + entry.title_en)
      .then(function (res) { state.noticesSha = res.content.sha; renderNotices(); closeNoticeModal(); status('Notice published. The live site will update in ~1 minute.', 'ok'); })
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
    $('p-cat').value = item ? item.cat : 'campus';
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
    var fileInput = $('p-file');
    var file = fileInput.files && fileInput.files[0];

    function finish(src) {
      var entry = {
        id: id,
        cat: $('p-cat').value,
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

    $('signout-btn').addEventListener('click', function () {
      signOut(); showLogin(); $('token').value = '';
    });

    // tabs
    document.querySelectorAll('.admin-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.admin-tabs button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        $('tab-notices').hidden = (b.dataset.tab !== 'notices');
        $('tab-gallery').hidden = (b.dataset.tab !== 'gallery');
      });
    });

    // notice actions
    $('add-notice-btn').addEventListener('click', function () { openNoticeModal(null); });
    $('notice-cancel').addEventListener('click', closeNoticeModal);
    $('notice-form').addEventListener('submit', saveNotice);
    $('notices-list').addEventListener('click', function (e) {
      var btn = e.target.closest('button'); if (!btn) return;
      var row = e.target.closest('.admin-row'); if (!row) return;
      var id = row.dataset.id;
      if (btn.dataset.act === 'edit') openNoticeModal(state.notices.find(function (n) { return n.id === id; }));
      if (btn.dataset.act === 'del')  deleteNotice(id);
    });

    // photo actions
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