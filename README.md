# Gyan Niketan English Secondary School — Website

Official website for **Gyan Niketan English Secondary School**, Badan Nagar, Parsa-32, Madhesh Province, Nepal.

🌐 **Live site:** [saleshcdry.github.io/Gyan-Niketan-Website](https://saleshcdry.github.io/Gyan-Niketan-Website/)

A fast, dependency-free static site — plain HTML, CSS, and vanilla JavaScript. No framework, no build step, no npm. Hosted free on GitHub Pages. Content (notices and gallery) is managed through a built-in GitHub-backed admin panel.

---

## Features

- **Bilingual** — English and Nepali, toggled with one click. Preference persists per browser.
- **Self-contained layout** — header and footer are injected from `js/layout.js` on every page, so they're always identical.
- **Inline SVG icon sprite** — 24 custom icons, no external icon library, no webfont.
- **Dynamic notices** — loaded from `data/notices.json`, searchable and categorised (Exam / Holiday / Event / General).
- **Printable notice letterhead** — clicking a notice opens a formal letterhead modal with a schedule table (when attached) and a Print button.
- **Photo gallery** — filterable by category with a full-screen lightbox (keyboard-navigable).
- **Admin panel** — `admin.html` signs in with a GitHub Personal Access Token and writes notices/photos directly to this repository via the GitHub API. No backend, no database.
- **CSV / Excel upload** — exam schedules can be uploaded as `.csv`, `.xlsx`, or `.xls` and are auto-parsed into the notice.
- **Accessible** — skip link, ARIA labels, keyboard navigation on modals and lightbox.
- **Fast** — no runtime dependencies, no bundler. Total JS weight under 60 KB.

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
| Spreadsheet parsing | [SheetJS](https://sheetjs.com/) — loaded on demand from unpkg CDN |

**No build step. No `package.json`. No `node_modules`.** Clone the repo, open `index.html`, and it runs.

---

## Project structure
