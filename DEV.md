# synle/fav

Sy's personal favorites — a static single-page bookmarks/launcher served from `index.html` + `index.js`. Vanilla JS / HTML, no framework. Dev-only tooling is Prettier; `http-server` serves the site locally.

Live: https://synle.github.io/fav/

## Quick Start

Install dependencies:

```bash
npm ci || npm install --no-fund --prefer-offline
```

Run the dev server (auto-reload on `.json` / `.scss` / `.jsx` / `.js` changes):

```bash
npm run dev
```

Or run a plain static server on `127.0.0.1`:

```bash
npm start
```

Build (regenerates `index.html` via `build.sh`):

```bash
npm run build
```

Format the codebase with Prettier:

```bash
npm run format
```
