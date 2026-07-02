# CLAUDE.md

Guidance for working in this repository.

## What this is

**"Складай слова!"** (Ukrainian: *"Build words!"*) — a browser word-building
game that teaches young children the Ukrainian alphabet. A word is shown with a
picture (emoji, inline SVG, or a user-uploaded image), and the child taps the
letters **in order** on an on-screen Ukrainian keyboard. The next letter to
press is highlighted; a correct tap advances, a wrong tap shakes. Completing a
word triggers a confetti celebration and increments a score counter.

The entire app is a single self-contained file: **`KeyboardGame.html`**. There
is no build step, no package manager, no framework, and no external network
requests — HTML + CSS + one vanilla-JS IIFE. The UI is entirely in Ukrainian and
mobile-first (touch-optimized, safe-area insets, `viewport-fit=cover`).

## Run / develop

Just open the file in a browser — it works offline over `file://`:

```
start KeyboardGame.html      # Windows
```

No server, no install, no compile. Edit `KeyboardGame.html` and reload the page.
There are **no automated tests** — verify changes by hand in a browser (test both
mouse/on-screen taps and physical-keyboard input, and check `max-height: 600px`
and `min-width: 700px` layouts).

## File structure (all inside `KeyboardGame.html`)

- **`<style>`** (~lines 8–697) — all CSS. Warm pastel kid theme; tiles, keyboard,
  celebration overlay, and settings sheet. Key animated states are CSS classes
  toggled from JS: `.tile.done/.current/.hidden-letter`, `.key.highlighted/
  .target/.bouncing/.shaking`.
- **`<body>`** (~700–802) — three regions: the game shell (`.app` = topbar +
  `.word-area` + `.keyboard`), the `.celebration` overlay, and the
  `.settings-overlay` bottom-sheet with three tabs (Words, Images, Mode).
- **`<script>`** (~804–1517) — one IIFE holding all logic. Sections are marked
  with banner comments (KEYBOARD LAYOUT, VERB SVG ICONS, BUILT-IN THEMES, STATE &
  PERSISTENCE, ACTIVE WORD POOL, GAME RENDERING, INPUT HANDLING, CELEBRATION,
  SETTINGS UI, INIT).

## Core data & the letter constraint

- **`ROWS`** (line ~809) — the Ukrainian ЙЦУКЕН keyboard, 3 rows. **`VALID_LETTERS`**
  is derived from it (`new Set([...ROWS.join("")])`). This is the single source of
  truth for allowed characters. Note it **excludes `Ґ`, spaces, apostrophes, and
  hyphens**.
- **Every word must consist only of `VALID_LETTERS`** (uppercase). This is enforced
  in three places: a defensive filter on built-in `THEMES` (~966), custom-word
  parsing (~1327), and image-word validation (~1428). Words that violate it are
  **silently dropped**, so a new theme word with an off-keyboard letter will just
  never appear. Words are uppercased everywhere.
- **`THEMES`** (~840) — 8 built-in categories, each `{ id, name, icon, items:
  [{ word, emoji? | svg? }] }`. Fruits, vegetables, animals, transport, family,
  nature, food, verbs.
- **`VERB_SVG`** (~820) — inline black-pictogram SVGs used only by the `verbs`
  theme (verbs have no natural emoji). Referenced as `svg: VERB_SVG.walk`, etc.

## State & persistence

- Single localStorage key: **`STORAGE_KEY = "kate-keyboard-game-v1"`** (~973).
  Bumping the `-v1` suffix invalidates all saved user data.
- **`state`** shape (~976): `enabledThemes` (Set of theme ids), `customWords`
  (`[{word}]`), `customImages` (`[{word, dataUrl}]`), `showLetters`, `showVisual`,
  `score`. `DEFAULT_ENABLED` = fruits, vegetables, animals, family.
- `loadState`/`saveState` are defensively wrapped in try/catch. Saving can fail if
  localStorage is full (custom images are stored as data URLs) → user gets an alert.
- **`buildPool()`** (~1022) merges items from enabled themes + custom words +
  custom images into the live word pool.

## Game flow

`startNewWord` → `pickItem` (random, avoids repeating the immediately-previous
word) → `renderVisual` + `renderWord` + `refreshKeyStates`. `handlePress` (~1157)
compares the tapped letter to `currentItem.word[cursor]`; on match it advances the
cursor and re-renders, on the last letter it bumps the score, saves, and shows the
celebration. Input arrives from both on-screen key clicks and a global `keydown`
handler (~1183) that uppercases the key and maps it onto `keyEls`.

Two difficulty toggles (Mode tab): `showLetters` off renders empty
(`.hidden-letter`) tiles; `showVisual` off hides the picture.

## Custom images

Uploads are capped at 1.5 MB, then shrunk to max 320 px via an off-screen canvas
and re-encoded as JPEG q0.82 (`shrinkImage`, ~1406) before being stored as a data
URL — this keeps localStorage from filling up.

## Common tasks

- **Add a word to a theme** — append `{ word: "…", emoji: "…" }` to that theme's
  `items`. Use only `VALID_LETTERS` (uppercase, no `Ґ`), or it will be filtered out.
- **Add a whole theme** — push a new `{ id, name, icon, items }` onto `THEMES`
  with a unique `id`; add the id to `DEFAULT_ENABLED` if it should be on by default.
- **Add a verb** — add an SVG to `VERB_SVG`, then add `{ word: "…", svg:
  VERB_SVG.newVerb }` to the `verbs` theme.
- **Change the keyboard** — edit `ROWS`; `VALID_LETTERS` updates automatically.

## Conventions & gotchas

- No framework/bundler — edit the single HTML file directly; keep everything inline
  and self-contained (offline-first).
- All UI copy is Ukrainian — match the existing tone (child-friendly).
- The off-keyboard-letter constraint fails **silently** — if a word doesn't show,
  check it against `VALID_LETTERS` first.

## Repo

GitHub: `Paraml3sS/solid-waffle`, default branch `main`. History is minimal
(uploaded snapshots), so there's little to mine from git log.
