# DONE.eslint — lint suppressions inventory (oxlint)

Status: **resolved** — `npm run lint` (oxlint 1.79.0) exits 0 with **zero suppressions and zero config files**. Every item from the original TODO list is addressed below; nothing left for a follow-up agent except the one declined item at the bottom.

## Resolved items

### 1. `no-unused-vars` on `getStrongPassword` — FIXED, suppression removed

The inline `oxlint-disable-next-line` is gone (`index.js`). The function is now explicitly exported to the runtime:

```js
// Exposed for SITE_SCHEMA links (`javascript://getStrongPassword()`), which
// the nav-generator evaluates at page runtime — invisible to static analysis.
window.getStrongPassword = getStrongPassword;
```

The assignment counts as a static reference, so the rule passes without any disable. Behavior unchanged: schema links resolve through `window`.

### 2. Empty catch blocks — DOCUMENTED INTENT

All intentional fallback paths now carry a why-comment instead of bare `catch {}`:

- `getUrlPorterConfigs` — config unreachable/invalid → `"[]"`
- `fetchAndFormatJson` — non-JSON payload passed through raw; unreachable → `""`
- `getUrlPorterSectionForNav` outer catch — omit bookmarks grid
- `decodeURIComponent` guard — keep raw string on malformed percent-encoding
- `console.log("URL Porter bookmarks:", ...)` — kept deliberately as injection diagnostics, comment added

### 3. Dead try/catch + latent infinite loop in password generator — REAL BUG FIXED

Addressing the old `catch {}` inside `_getPassword` surfaced an actual defect:

- `_getRandomOption(choices)` used inclusive upper bound `choices.length`, so it could index out of bounds and return `""`. Appending `""` never grows the password → the growth loop could spin forever (~1/(len+1) odds per iteration). The surrounding `try/catch` was dead (nothing throws) and masked the smell.
- Fix: exclusive bound via `choices.length - 1`, `try/catch` deleted. Verified: 500/500 generated passwords ≥ 20 chars, mixed alphanumeric/special modes, no hangs.

## Declined (with reason)

- **Scheme-stripping duplication** between `getUrlPorterSectionForNav` (`index.js`) and `url-porter.clean-config.js` — still duplicated, but extraction would couple a build-time Node script to page code that changes on different schedules. Revisit only if both sides need the same normalization change.

## Rules / config state

- oxlint runs zero-config (no `.oxlintrc.json`, no `.eslintrc*`).
- No rule exclusions anywhere; grep for `oxlint-disable` / `eslint-disable` returns nothing.
