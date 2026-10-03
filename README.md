# Gyan Niketan English Secondary School — Website

Official website for **Gyan Niketan English Secondary School**, Badan Nagar, Parsa-32, Madhesh Province, Nepal.

🌐 **Live site:** [saileshcdry.github.io/Gyan-Niketan-Website](https://saileshcdry.github.io/Gyan-Niketan-Website/)

A fast, dependency-free static site — plain HTML, CSS, and vanilla JavaScript. No framework, no build step, no npm. Hosted free on GitHub Pages. Content (notices and gallery) is managed through a built-in GitHub-backed admin panel.

---

## Features

- **Bilingual** — English and Nepali, toggled with one click. Preference persists per browser.
- **Self-contained layout** — header and footer are injected from `js/layout.js` on every page, so they're always identical.
- **Inline SVG icon sprite** — 24 custom icons, no external icon library, no webfont.
- **Dynamic notices** — loaded from `data/notices.json`, searchable and categorised (Exam / Holiday / Event / General).
- **Printable notice letterhead** — clicking a notice opens a formal letterhead modal with a Print button and automatic paper-size detection (A5 for short notices, A4 for longer ones). Notices that carry a `schedule` array render it as a formatted table inside the letterhead.
- **Photo gallery** — filterable by category with a full-screen lightbox (keyboard-navigable).
- **Admin panel** — `admin.html` signs in with a GitHub Personal Access Token and writes notices/photos directly to this repository via the GitHub API. No backend, no database.
- **Accessible** — skip link, ARIA labels, keyboard navigation on modals and lightbox.
- **Fast** — no runtime dependencies, no bundler.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES5-compatible syntax, no transpiler) |
| Hosting | GitHub Pages |
| Content | JSON files in `/data` |
| Admin | GitHub REST API (Contents endpoint) |

**No build step. No `package.json`. No `node_modules`.** Clone the repo, open `index.html`, and it runs.

---

## Project structure

```
.
├── index.html              Homepage
├── about.html              About Us
├── academics.html          Academics
├── admissions.html         Admissions
├── gallery.html            Photo Gallery
├── notices.html            Notice Board
├── contact.html            Contact
├── admin.html              Admin panel (GitHub-token auth)
├── README.md
├── Homepage.jpg            Hero photo
├── GNlogo.jpg              School logo (also used on letterheads)
│
├── assets/
│   ├── favicon.svg
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── gallery/            Gallery photos
│   └── team/               Faculty photos
│
├── css/
│   ├── style.css           Global styles, tokens, header, footer, modals
│   ├── pages.css           Inner-page layouts (cards, forms, tables)
│   └── admin.css           Admin dashboard styles
│
├── js/
│   ├── layout.js           Injects SVG sprite + header + footer
│   ├── data.js             Loads and normalises /data/*.json
│   ├── i18n.js             EN/NP translations + language runtime
│   ├── main.js             Page logic, letterhead modal, lightbox
│   ├── admin.js            Admin panel — GitHub Contents API
│   └── gallery-data.js     Legacy fallback (window.GALLERY)
│
└── data/
    ├── notices.json        Notice board content
    └── gallery.json        Gallery content
```

---

## Admin panel — setup

The admin panel at `/admin.html` lets you add, edit and delete notices and gallery photos without touching the repo. It talks directly to GitHub's Contents API using a Personal Access Token.

### 1. Create a fine-grained token

1. Go to **[github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)**
2. Click **Generate new token**
3. Name it `gyan-niketan-admin`, set an expiry (e.g. 90 days)
4. **Repository access** → *Only select repositories* → pick this repo
5. **Permissions** → *Contents: Read and write*
6. Generate, copy the token

### 2. Sign in

1. Open `/admin.html`
2. Repository: `saileshcdry/Gyan-Niketan-Website`
3. Paste the token
4. Click **Sign in**

The token is stored **only in `localStorage` on this browser**. Click **Sign out** when using a shared computer.

### 3. Manage content

**Notices tab** — add/edit/delete notices with English and Nepali titles and bodies. Category is one of: General, Exam, Holiday, Event.

**Gallery tab** — upload/edit/delete photos (JPG/PNG/WebP, max 2 MB). Category is one of: School, Classroom, Lab, Sports, Event.

Every save is a real commit to `main`. If the site is deployed via GitHub Pages, changes go live in ~1 minute.

---

## Local development

No build step, no server required for reading. Just open `index.html` in a browser — the site will use the `window.GALLERY` fallback for gallery data if the JSON cannot be fetched.

> **Note:** most browsers block `fetch()` on the `file://` protocol. For an accurate local preview with live JSON loading, serve over HTTP instead:
>
> ```bash
> # Python 3
> python3 -m http.server 8000
>
> # or Node
> npx serve .
> ```
>
> Then open [http://localhost:8000](http://localhost:8000).

---

## Deployment

Hosted on **GitHub Pages**, serving from the `main` branch root.

To deploy your own copy:

1. Fork or clone this repo
2. Push to `main`
3. Repo **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save
4. Wait ~1 minute; the site appears at `https://<user>.github.io/<repo>/`

If you use a different repo name, update:
- The repository placeholder in `admin.html`'s login field
- The `canonical` and `og:url` meta tags in `index.html`

---

## Editing content manually

Both JSON files live in `/data/` and are safe to edit by hand — the admin panel is just a convenience.

### `data/notices.json`

An array of notice objects:

```json
{
  "id": "n-2026-04-02-1",
  "date": "2026-04-02",
  "cat": "holiday",
  "title_en": "Dashain & Tihar Holiday Notice",
  "title_np": "दशैं र तिहार बिदा सूचना",
  "excerpt_en": "The school will remain closed for the festive season.",
  "excerpt_np": "चाडपर्वको अवसरमा विद्यालय बन्द रहनेछ।"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique. Any stable string works. |
| `date` | string | ISO `YYYY-MM-DD`. Notices are sorted by this, newest first. |
| `cat` | string | One of `general`, `exam`, `holiday`, `event`. |
| `title_en` / `title_np` | string | Shown on the card, and in the letterhead heading. |
| `excerpt_en` / `excerpt_np` | string | Body text (plain text). |
| `schedule` | array *(optional)* | Legacy field. If present, rendered as a table inside the letterhead modal. |

**`schedule` row shape** — for exam-routine-style notices:

```json
{ "date": "2026-06-22", "time": "10:00 AM", "subject": "English", "grade": "Class 5" }
```

Notices saved through the admin panel do **not** create or modify a `schedule` array. Schedules can only be added by editing the JSON directly.

### `data/gallery.json`

An array of gallery items:

```json
{
  "id": "g-1",
  "cat": "school",
  "title_en": "Main School Building",
  "title_np": "मुख्य विद्यालय भवन",
  "src": "assets/gallery/campus-1.jpg"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique. |
| `cat` | string | One of `school`, `classroom`, `lab`, `sports`, `event`. |
| `title_en` / `title_np` | string | Caption shown in the grid and lightbox. |
| `src` | string | Relative path under `assets/gallery/`. |

---

## Accessibility

- Skip-to-content link on every page.
- Modals trap focus and respond to <kbd>Esc</kbd>.
- Gallery lightbox is keyboard-navigable (<kbd>←</kbd> / <kbd>→</kbd> / <kbd>Esc</kbd>).
- Colour contrast meets WCAG AA for body text.
- All interactive elements have visible focus rings.

---

## Credits

Built and maintained for Gyan Niketan English Secondary School.

Fonts: [Inter](https://fonts.google.com/specimen/Inter) and [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts.