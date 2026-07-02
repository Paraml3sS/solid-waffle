  /* =====================================================================
     STATE & PERSISTENCE
     ===================================================================== */
  const STORAGE_KEY = "kate-keyboard-game-v1";
  const DEFAULT_ENABLED = ["fruits", "vegetables", "animals", "family"];

  const state = {
    enabledThemes: new Set(DEFAULT_ENABLED),
    customWords: [],          // [{word}]
    customImages: [],         // [{word, dataUrl}]
    showLetters: true,
    showVisual: true,
    highlightKeys: true,
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
      if (typeof data.showLetters === "boolean") state.showLetters = data.showLetters;
      if (typeof data.showVisual === "boolean") state.showVisual = data.showVisual;
      if (typeof data.highlightKeys === "boolean") state.highlightKeys = data.highlightKeys;
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
        showLetters: state.showLetters,
        showVisual: state.showVisual,
        highlightKeys: state.highlightKeys,
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
        t.items.forEach(it => {
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
