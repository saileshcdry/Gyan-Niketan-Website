/* data.js — loads notices + gallery from /data/*.json.
   Falls back to legacy window.NOTICES / window.GALLERY if fetch fails (file://).

   Both datasets are normalised on the way in, so legacy-shaped entries
   (old admin schema, old gallery categories, nested titles) still render
   correctly. No-op on clean data.

   Notice schema (public):  { id, date, cat, title_en, title_np, excerpt_en, excerpt_np }
   Gallery schema (public): { id, cat, title_en, title_np, src }
   Gallery categories:      school · classroom · lab · sports · event       */
(function () {
  var cache = null;

  function fetchJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* Coerce a notice into the public shape. */
  function normalizeNotice(n) {
    if (!n) return n;
    if (!n.cat && n.category) n.cat = n.category;
    if (!n.excerpt_en && n.message_en) n.excerpt_en = n.message_en;
    if (!n.excerpt_np && n.message_np) n.excerpt_np = n.message_np;
    return n;
  }

  /* Coerce a gallery item into the public shape.
     Handles: legacy `campus` category, legacy nested `title: { en, np }`,
     and missing `id`. */
  var GALLERY_CAT_ALIASES = { campus: 'school' };
  var GALLERY_CAT_CANON   = ['school', 'classroom', 'lab', 'sports', 'event'];

  function normalizeGallery(g) {
    if (!g) return g;

    /* category alias + fallback */
    if (g.cat && GALLERY_CAT_ALIASES[g.cat]) g.cat = GALLERY_CAT_ALIASES[g.cat];
    if (GALLERY_CAT_CANON.indexOf(g.cat) === -1) g.cat = 'school';

    /* nested title -> flat title_* */
    if (!g.title_en && g.title && g.title.en) g.title_en = g.title.en;
    if (!g.title_np && g.title && g.title.np) g.title_np = g.title.np;

    /* stable-ish id for legacy entries */
    if (!g.id) g.id = 'g-legacy-' + Math.random().toString(36).slice(2, 9);

    return g;
  }

  window.loadGNData = function () {
    if (cache) return Promise.resolve(cache);

    var noticesP = fetchJSON('data/notices.json')
      .then(function (arr) { return (arr || []).map(normalizeNotice); })
      .catch(function () {
        return Array.isArray(window.NOTICES)
          ? window.NOTICES.map(normalizeNotice)
          : [];
      });

    var galleryP = fetchJSON('data/gallery.json')
      .then(function (arr) { return (arr || []).map(normalizeGallery); })
      .catch(function () {
        return Array.isArray(window.GALLERY)
          ? window.GALLERY.map(normalizeGallery)
          : [];
      });

    return Promise.all([noticesP, galleryP]).then(function (arr) {
      cache = { notices: arr[0], gallery: arr[1] };
      return cache;
    });
  };

  window.invalidateGNData = function () { cache = null; };
})();