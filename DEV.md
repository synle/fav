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
| `npm run lint`         | Lint with oxlint                                          |
| `npm run lint:fix`     | Lint and auto-fix                                         |
| `npm test`             | Run Vitest once, including inline snapshots               |
| `npm run test:update`  | Regenerate snapshots intentionally                        |

## Tests

`url-porter.clean-config.test.mjs` runs the cleaner CLI in unique temporary directories, without modifying repository bookmark data. Inline snapshots characterize normalized output and preserved settings.

To refresh only this file, run `npm run test:update -- url-porter.clean-config.test.mjs`. Review the resulting diff before committing; snapshot updates accept current output, not proof of correctness.

Run `npm test && npm run format:check && npm run lint` before committing test changes.
