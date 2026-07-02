  /* =====================================================================
     ELEMENTS
     ===================================================================== */
  const $ = id => document.getElementById(id);
  const wordDisplay = $("word-display");
  const visualEl = $("visual");
  const keyboardEl = $("keyboard");
  const scoreEl = $("score");
  const reloadBtn = $("reload-btn");
  const settingsBtn = $("settings-btn");
  const celebration = $("celebration");
  const celebrationWord = $("celebration-word");
  const nextBtn = $("next-btn");

  const CONFETTI_COLORS = ["#FFC857", "#FF8A66", "#9DDFB7", "#A8C8FF", "#D4B3FF", "#FFB3C6"];

  const keyEls = new Map();
  let currentItem = null;       // {word, emoji, svg, image, verb}
  let cursor = 0;
  let lastWord = "";
  let isComplete = false;
