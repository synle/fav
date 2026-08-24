# TODO.eslint — lint suppressions inventory (oxlint)

Status: **clean** — `npm run lint` (oxlint 1.79.0) exits 0.

Tooling: oxlint, zero-config (no `.oxlintrc.json` / `.eslintrc*` anywhere). Everything below is either an inline suppression or a code change made to satisfy defaults.

Handoff note: goal is to remove every entry here eventually. Each section says what a proper fix looks like.

## Active rule suppressions

### 1. `no-unused-vars` — `getStrongPassword` (`index.js:138`)

```js
// Invoked at runtime from SITE_SCHEMA links (`javascript://getStrongPassword()`),
// not statically referenced.
// oxlint-disable-next-line no-unused-vars
function getStrongPassword(isAlphaNumericOnly = false) {
```

Why: false positive. The function is called by the nav-generator runtime when a user clicks schema links like `strong password | javascript://getStrongPassword()` (`index.js:92-93`). Static analysis cannot see that call path.

Proper fix options (pick one):
- Attach the function to `window` / globalThis explicitly so the intent ("exported to runtime") is visible, and drop the comment.
- Configure oxlint with a globals/allowlist entry for functions referenced from schema strings.
- Move password generation into nav-generator and reference it by URL.

## Code changes made instead of disabling rules

These were real fixes, listed so nobody re-introduces the pattern:

1. **Unused catch bindings removed** — `index.js:195`, `index.js:417`: `catch (err) {}` → `catch {}`. Both are intentional swallow-and-fallback paths (password char loop; URL-porter fetch failure returns empty schema). If someone re-adds a binding, oxlint flags it again.
2. **`url-porter.clean-config.js`** needed no suppressions — its top-level `catch (error)` uses the binding (logs `error.message`).

## Known friction if rules are tightened later

For the next agent enabling stricter rulesets (e.g. `no-empty`, `no-console`, pedantic groups):

- **Empty blocks** `index.js:116,128,131,195,396,417` — deliberate network-parse fallbacks returning `""` / `"[]"`. Correct fix is `catch { /* expected when offline */ }` comments or extracting a `safeFetchJson` helper, not blanket disables.
- **`console.log`** at `index.js:207` (`urlPorterBookmarks` debug line) — decide: keep as intentional diagnostics or drop.
- **Regex-heavy string cleanup** in `getUrlPorterSectionForNav` (`index.js:384-401`) may trip complexity/regex rules; the duplication of scheme-stripping between there and `url-porter.clean-config.js` is a known smell — extract only if both sides change together.
