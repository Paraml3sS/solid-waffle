# CLAUDE.md

Guidance for working in this repository.

## Communication

**Always work and reply in English.** The maintainer may write to you in
Ukrainian (or mix languages) — understand it fine, but respond in English.
This applies only to chat/commit messages/explanations. It does **not** change
the product: all in-app UI copy stays Ukrainian and child-friendly (see below).

## What this is

**"Складай слова!"** (Ukrainian: *"Build words!"*) — a browser word-building
game that teaches young children the Ukrainian alphabet. A word is shown with a
picture (emoji, inline SVG, or a user-uploaded image), and the child taps the
letters **in order** on an on-screen Ukrainian keyboard. The next letter to
press is highlighted; a correct tap advances, a wrong tap shakes. Completing a
word triggers a confetti celebration and increments a score counter.

The app is plain, self-contained static files — no build step, no package
manager, no framework, no external network requests. **`KeyboardGame.html`** is
the entry point (markup + `<link>`/`<script>` tags); the CSS lives in
`css/*.css` and the JS in `js/*.js`, loaded as **classic (non-module) scripts**
that share one global scope. The UI is entirely in Ukrainian and mobile-first
(touch-optimized, safe-area insets, `viewport-fit=cover`).

## Run / develop

Just open `KeyboardGame.html` in a browser — it works offline over `file://`:

```
start KeyboardGame.html      # Windows
```

No server, no install, no compile. Classic `<script>`/`<link>` tags load fine
over `file://` (only ES `type="module"` would be blocked there — we deliberately
don't use it). Keep `KeyboardGame.html` and the `css/` + `js/` folders together;
the relative paths break if the HTML is separated from them. Edit the relevant
`css/*.css` or `js/*.js` file and reload the page.

**We do not do tests here.** Do not write, add, or run any tests — no unit tests,
no test harness, no jsdom/Playwright/Puppeteer, no `package.json`/`node_modules`.
Verify changes **by hand in a browser** instead (test both mouse/on-screen taps and
physical-keyboard input, and check `max-height: 600px` and `min-width: 700px`
layouts). A quick `node --check` on any `js/*.js` file for syntax is fine, but
keep the repo free of any test tooling.

## File structure

`KeyboardGame.html` is just the shell: `<head>` with seven `<link>` tags, the
`<body>` markup (game shell, celebration overlay, settings sheet, in-page confirm
dialog, toast), and nine `<script>` tags at the end. All CSS and JS live in
sibling files.

**`css/`** — loaded in this order (the cascade depends on it; `responsive.css`
must stay last): `base` · `topbar` · `word-tiles` · `keyboard` · `celebration` ·
`settings` · `responsive`. Key animated states are CSS classes toggled from JS:
`.tile.done/.current/.hidden-letter`, `.key.zone-pinky/-ring/-middle/-index`
(touch-typing finger colours) and `.key.highlighted/.target/.bouncing/.shaking`.

**`js/`** — loaded in this order (see "Why classic scripts" below):

- `js/data.js` — `ROWS`/`VALID_LETTERS`, `VERB_SVG`, `THEMES` (+ defensive filter).
- `js/state.js` — `STORAGE_KEY`, `state`, `loadState`/`saveState`, `buildPool`.
- `js/dom.js` — the `$` helper, cached element refs, and the mutable session vars
  (`currentItem`, `cursor`, `lastWord`, `isComplete`, `keyEls`).
- `js/keyboard.js` — builds the on-screen keyboard from `ROWS` at load.
- `js/game.js` — `pickItem`/`renderVisual`/`renderWord`/`refreshKeyStates`/`startNewWord`.
- `js/input.js` — `handlePress` + the global `keydown` handler.
- `js/celebration.js` — win overlay + confetti; `next`/`reload` button listeners.
- `js/settings.js` — settings sheet (themes, custom words, custom images, mode
  toggles) plus the in-page confirm dialog and toast.
- `js/init.js` — bootstrap; **must load last** (`loadState` + `startNewWord`).

**Why classic scripts, not ES modules:** classic `<script>` files share one
global lexical scope, so top-level `const`/`let`/`function` in one file are
visible to later files — no `import`/`export`, no bundler, and it still runs over
`file://` (ES modules do **not**, due to the `file://` CORS rule). The trade-off:
**script load order is the dependency graph.** A symbol used at *load time* must
be declared in an earlier-loaded file (or higher in the same file); cross-file
calls made inside event handlers/callbacks resolve at event time, so their order
doesn't matter. In practice only `keyboard.js` (needs `data.js` + `dom.js`) and
`init.js` (needs `state.js` + `dom.js` + `game.js`, and must be last) have
load-time cross-file dependencies. If you add a file, insert its `<script>` tag
in the right slot and mind what it needs at load time.

## Core data & the letter constraint

- **`ROWS`** (`js/data.js`) — the Ukrainian ЙЦУКЕН keyboard, 3 rows.
  **`VALID_LETTERS`** is derived from it (`new Set([...ROWS.join("")])`). This is
  the single source of truth for allowed characters. Note it **excludes `Ґ`,
  spaces, apostrophes, and hyphens**.
- **Every word must consist only of `VALID_LETTERS`** (uppercase). This is enforced
  in three places: a defensive filter on built-in `THEMES` (`js/data.js`), and
  custom-word parsing + image-word validation (both in `js/settings.js`). Words
  that violate it are **silently dropped**, so a new theme word with an off-keyboard
  letter will just never appear. Words are uppercased everywhere.
- **`THEMES`** (`js/data.js`) — 8 built-in categories, each `{ id, name, icon,
  items: [{ word, emoji? | svg? }] }`. Fruits, vegetables, animals, transport,
  family, nature, food, verbs.
- **`VERB_SVG`** (`js/data.js`) — inline black-pictogram SVGs used only by the
  `verbs` theme (verbs have no natural emoji). Referenced as `svg: VERB_SVG.walk`, etc.

## State & persistence

- Single localStorage key: **`STORAGE_KEY = "kate-keyboard-game-v1"`**
  (`js/state.js`). Bumping the `-v1` suffix invalidates all saved user data.
- **`state`** shape (`js/state.js`): `enabledThemes` (Set of theme ids),
  `customWords` (`[{word}]`), `customImages` (`[{word, dataUrl}]`), `excludedWords`
  (`{ [themeId]: [word…] }` — words deselected within a built-in theme), `showLetters`,
  `showVisual`, `highlightLetters`, `fingerZones`, `score`. `DEFAULT_ENABLED` = fruits,
  vegetables, animals, family.
- `loadState`/`saveState` are defensively wrapped in try/catch. Saving can fail if
  localStorage is full (custom images are stored as data URLs) → user gets an alert.
- **`buildPool()`** (`js/state.js`) merges items from enabled themes + custom words
  + custom images into the live word pool.

## Game flow

`startNewWord` → `pickItem` (random, avoids repeating the immediately-previous
word) → `renderVisual` + `renderWord` + `refreshKeyStates`. `handlePress`
(`js/input.js`) compares the tapped letter to `currentItem.word[cursor]`; on match
it advances the cursor and re-renders, on the last letter it bumps the score,
saves, and shows the celebration. Input arrives from both on-screen key clicks and
a global `keydown` handler (`js/input.js`) that uppercases the key and maps it onto
`keyEls`.

Four difficulty toggles (Mode tab), all default on: `showLetters` off renders empty
(`.hidden-letter`) tiles; `showVisual` off hides the picture. The two keyboard aids are
independent, both applied by `refreshKeyStates`: `highlightLetters` glows the current
word's letters (`.highlighted`) and pulses the next key (`.target`); `fingerZones`
colours every key by its touch-typing finger zone (`FINGER_ZONE` in `js/data.js` →
`.key.zone-*`). Both off = plain keyboard, no hints (hardest).

## Custom images

Uploads are capped at 1.5 MB, then shrunk to max 320 px via an off-screen canvas
and re-encoded as JPEG q0.82 (`shrinkImage` in `js/settings.js`) before being
stored as a data URL — this keeps localStorage from filling up.

## Common tasks

- **Add a word to a theme** — append `{ word: "…", emoji: "…" }` to that theme's
  `items` in `js/data.js`. Use only `VALID_LETTERS` (uppercase, no `Ґ`), or it
  will be filtered out.
- **Add a whole theme** — push a new `{ id, name, icon, items }` onto `THEMES`
  (`js/data.js`) with a unique `id`; add the id to `DEFAULT_ENABLED` (`js/state.js`)
  if it should be on by default.
- **Add a verb** — add an SVG to `VERB_SVG`, then add `{ word: "…", svg:
  VERB_SVG.newVerb }` to the `verbs` theme (both in `js/data.js`).
- **Change the keyboard** — edit `ROWS` (`js/data.js`); `VALID_LETTERS` updates
  automatically.

## Conventions & gotchas

- No framework/bundler — edit the `css/*.css` and `js/*.js` files directly. Keep
  the JS as classic (non-`module`) scripts sharing one global scope, mind the
  script load order in `KeyboardGame.html`, and keep everything self-contained
  (offline-first, no network requests).
- All UI copy is Ukrainian — match the existing tone (child-friendly).
- The off-keyboard-letter constraint fails **silently** — if a word doesn't show,
  check it against `VALID_LETTERS` first.

## Repo

GitHub: `Paraml3sS/solid-waffle`, default branch `main`. History is minimal
(uploaded snapshots), so there's little to mine from git log.
