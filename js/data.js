/* data.js — loads notices + gallery from /data/*.json.
   Falls back to legacy window.NOTICES / window.GALLERY if fetch fails (file://). */
(function () {
  var cache = null;

  function fetchJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  window.loadGNData = function () {
    if (cache) return Promise.resolve(cache);
    var noticesP = fetchJSON('data/notices.json').catch(function () {
      return Array.isArray(window.NOTICES) ? window.NOTICES : [];
    });
    var galleryP = fetchJSON('data/gallery.json').catch(function () {
      return Array.isArray(window.GALLERY) ? window.GALLERY : [];
    });
    return Promise.all([noticesP, galleryP]).then(function (arr) {
      cache = { notices: arr[0], gallery: arr[1] };
      return cache;
    });
  };

  window.invalidateGNData = function () { cache = null; };
})();