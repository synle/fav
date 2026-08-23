# synle/fav

Sy's personal favorites — static single-page bookmarks/launcher (`index.html` + `index.js`). Vanilla JS / HTML, no framework.

Live: https://synle.github.io/fav/

## Quick Start

```bash
npm ci || npm install --no-fund --prefer-offline
```

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Watcher + server; reloads on `.json`/`.scss`/`.jsx`/`.js` |
| `npm start`            | Plain static server on `127.0.0.1`                        |
| `npm run build`        | Regenerates `index.html` via `build.sh`                   |
| `npm run format`       | Format with oxfmt                                         |
| `npm run format:check` | Check formatting only                                     |
