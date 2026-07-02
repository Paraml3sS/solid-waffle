  /* =====================================================================
     STATE & PERSISTENCE
     ===================================================================== */
  const STORAGE_KEY = "kate-keyboard-game-v1";
  const DEFAULT_ENABLED = ["fruits", "vegetables", "animals", "family"];

  const state = {
    enabledThemes: new Set(DEFAULT_ENABLED),
    customWords: [],          // [{word}]
    customImages: [],         // [{word, dataUrl}]
    excludedWords: {},        // { [themeId]: [word, ...] } — words deselected within a built-in theme
    showLetters: true,
    showVisual: true,
    highlightLetters: true,   // glow the current word's letters + pulse the next one
    fingerZones: true,        // colour the keyboard by touch-typing finger zone
    score: 0
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.enabledThemes)) state.enabledThemes = new Set(data.enabledThemes);
      if (Array.isArray(data.customWords)) state.customWords = data.customWords.filter(w => w && w.word);
      if (Array.isArray(data.customImages)) state.customImages = data.customImages.filter(w => w && w.word && w.dataUrl);
      if (data.excludedWords && typeof data.excludedWords === "object" && !Array.isArray(data.excludedWords)) {
        const clean = {};
        Object.keys(data.excludedWords).forEach(themeId => {
          const words = data.excludedWords[themeId];
          if (Array.isArray(words)) {
            const arr = words.filter(w => typeof w === "string");
            if (arr.length) clean[themeId] = arr;
          }
        });
        state.excludedWords = clean;
      }
      if (typeof data.showLetters === "boolean") state.showLetters = data.showLetters;
      if (typeof data.showVisual === "boolean") state.showVisual = data.showVisual;
      if (typeof data.highlightLetters === "boolean") state.highlightLetters = data.highlightLetters;
      if (typeof data.fingerZones === "boolean") state.fingerZones = data.fingerZones;
      else if (typeof data.highlightKeys === "boolean") state.fingerZones = data.highlightKeys; // migrate old single flag
      if (typeof data.score === "number") state.score = data.score;
    } catch (e) {
      console.warn("Failed to load saved state:", e);
    }
  }

  function saveState() {
    try {
      const data = {
        enabledThemes: [...state.enabledThemes],
        customWords: state.customWords,
        customImages: state.customImages,
        excludedWords: state.excludedWords,
        showLetters: state.showLetters,
        showVisual: state.showVisual,
        highlightLetters: state.highlightLetters,
        fingerZones: state.fingerZones,
        score: state.score
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save state (storage may be full):", e);
      alert("Не вдалося зберегти дані. Можливо, у браузері закінчилося місце. Спробуй видалити кілька картинок.");
    }
  }

  /* =====================================================================
     ACTIVE WORD POOL
     Combines: items from enabled themes + custom words + custom images.
     ===================================================================== */
  function buildPool() {
    const pool = [];
    THEMES.forEach(t => {
      if (state.enabledThemes.has(t.id)) {
        const excluded = state.excludedWords[t.id];
        t.items.forEach(it => {
          if (excluded && excluded.indexOf(it.word) !== -1) return;  // user deselected this word
          pool.push({
            word: it.word,
            emoji: it.emoji || null,
            svg: it.svg || null,
            verb: t.id === "verbs"
          });
        });
      }
    });
    state.customWords.forEach(w => {
      pool.push({ word: w.word, emoji: null, svg: null, verb: false });
    });
    state.customImages.forEach(w => {
      pool.push({ word: w.word, image: w.dataUrl, emoji: null, svg: null, verb: false });
    });
    return pool;
  }
