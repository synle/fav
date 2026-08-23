# fav — Architecture

Static single-page bookmarks launcher at https://synle.github.io/fav/. No backend, no framework, no runtime deps — vanilla HTML/JS on GitHub Pages. The repo is a configuration payload; rendering, service worker, and search-as-launcher live in `synle/nav-generator`.

## Runtime Model

- `index.html` is a generated shell (see Build) that loads
  `https://synle.github.io/nav-generator/index.js`, which renders the UI and dispatches a `NavBeforeLoad` event.
- `index.js` listens for `NavBeforeLoad`, assembles the schema string (built-in favorites, Android list, URL Porter bookmarks, RVX configs, IP/hosts config), and hands it to the nav generator's `renderSchema`.
- A nav-generator service worker (`sw-nav.js`) provides offline support and hourly update checks.
- URL Porter is two-way: `url-porter.json` is fetched at runtime, and the Chrome extension can inject extra bookmarks via a `urlPorterBookmarks` DOM event at load.

## Files

- `index.js` — The source of truth: `SITE_SCHEMA` (nav mini-DSL), `getStrongPassword`, and the `NavBeforeLoad` handler composing the final schema.
- `index.html` — Generated shell. Never hand-edit; `npm run build`.
- `url-porter.json` — URL Porter extension config: `{ homepage, configs: [[alias, url], ...], bookmarkRules?, ... }`.
- `url-porter.clean-config.js` — Strips comments from `url-porter.json`, normalizes entries into lowercase `[from, to]` pairs, dedupes, rewrites in place. Preserves optional keys.
- `build.sh` — Downloads `index.html` + `dev.sh` templates from nav-generator, runs the cleaner. Idempotent.
- `dev.sh` — curl'd watcher/server script from `synle/workflows`; watches `*.json *.scss *.jsx *.js`, runs `npm start`.
- `.github/workflows/` — Thin wrappers around reusable workflows in `synle/workflows`.

## Build & Release

1. `npm ci` — installs oxfmt (only dev dep).
2. `npm run build` — regenerates `index.html`, refreshes `dev.sh`, cleans `url-porter.json`.

CI (push/PR to main): `build-and-commit-sh.yml@main` runs `build.sh`, commits drift back, deploys GitHub Pages. PR close: artifact cleanup workflow.

Release = merge to main → Pages deploy. `version` in package.json is informational.
