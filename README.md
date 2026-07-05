# Складай слова! 🎈

*"Build Words!"* — a browser game that teaches young children the Ukrainian
alphabet. A word is shown with a picture, and the child taps the letters **in
order** on an on-screen Ukrainian keyboard. Correct taps advance and light up
the next letter; a wrong tap shakes. Finishing a word sets off a confetti
celebration and bumps the score.

The whole app is plain, self-contained static files — no build step, no
dependencies, no framework, no network requests. It runs offline straight from
the filesystem.

## Features

- 🇺🇦 On-screen Ukrainian **ЙЦУКЕН** keyboard, plus physical-keyboard input
- 📚 8 built-in themes — fruits, vegetables, animals, transport, family, nature,
  food, and verbs
- ✏️ Add your **own words** and upload your **own pictures**
- 🎚️ Four difficulty toggles — hide letters, hide the picture, turn off the
  next-letter highlight, and colour keys by touch-typing finger zone
- 🎉 Confetti celebration and a running score
- 💾 Progress, settings, and custom content saved in the browser (localStorage)
- 📱 Mobile-first and touch-optimized; works fully **offline**

## Run locally

No install, no server, no build. Just open the entry point in a browser:

```
start index.html      # Windows
open index.html       # macOS
```

Or double-click `index.html`. Keep `index.html` together with the `css/` and
`js/` folders — the relative paths break if they're separated.

## Project structure

```
index.html      # the shell: markup + <link>/<script> tags
css/            # base · topbar · word-tiles · keyboard · celebration · settings · responsive
js/             # data · state · dom · keyboard · game · input · celebration · settings · init
```

The JS files are classic (non-module) scripts sharing one global scope, loaded
in a specific order. See [`CLAUDE.md`](CLAUDE.md) for the full developer guide
(data model, load-order rules, and common tasks).

## Deployment

Currently hosted on **GitHub Pages** (served from `index.html` at the repo
root). A `staticwebapp.config.json` is included for an eventual move to **Azure
Static Web Apps** (cache + security headers, with a slot ready for
authentication).

## Tech

Plain HTML, CSS, and JavaScript. No framework, no bundler, no package manager.
UI copy is entirely in Ukrainian and child-friendly.
