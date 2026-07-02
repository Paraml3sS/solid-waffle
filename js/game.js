  /* =====================================================================
     GAME RENDERING
     ===================================================================== */
  function pickItem() {
    const pool = buildPool();
    if (pool.length === 0) {
      return { word: "ВКЛЮЧИ", emoji: "⚙️", svg: null, image: null, verb: false, _emptyPool: true };
    }
    let it;
    let attempts = 0;
    do {
      it = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    } while (it.word === lastWord && pool.length > 1 && attempts < 5);
    lastWord = it.word;
    return it;
  }

  function renderVisual() {
    visualEl.innerHTML = "";
    visualEl.classList.remove("verb");
    if (!state.showVisual || !currentItem) return;
    if (currentItem.image) {
      const img = document.createElement("img");
      img.src = currentItem.image;
      img.alt = "";
      visualEl.appendChild(img);
    } else if (currentItem.svg) {
      visualEl.classList.add("verb");
      visualEl.innerHTML = currentItem.svg;
    } else if (currentItem.emoji) {
      visualEl.textContent = currentItem.emoji;
    }
  }

  function renderWord() {
    wordDisplay.innerHTML = "";
    wordDisplay.style.setProperty("--count", currentItem.word.length);
    [...currentItem.word].forEach((ch, i) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = ch;
      if (i < cursor) tile.classList.add("done");
      else if (i === cursor) tile.classList.add("current");
      if (!state.showLetters && i >= cursor) tile.classList.add("hidden-letter");
      wordDisplay.appendChild(tile);
    });
  }

  function refreshKeyStates() {
    const uniqueLetters = new Set(currentItem.word);
    const nextLetter = cursor < currentItem.word.length ? currentItem.word[cursor] : null;
    keyEls.forEach((btn, letter) => {
      btn.classList.remove("target", "highlighted", "zone-pinky", "zone-ring", "zone-middle", "zone-index");
      // Two independent aids (see Mode tab): finger-zone colours and letter highlighting.
      if (state.fingerZones) btn.classList.add("zone-" + FINGER_ZONE[letter]);
      if (state.highlightLetters) {
        if (uniqueLetters.has(letter)) btn.classList.add("highlighted");   // letters in this word
        if (letter === nextLetter) btn.classList.add("target");            // pulse the next one
      }
    });
  }

  function startNewWord() {
    isComplete = false;
    currentItem = pickItem();
    cursor = 0;
    renderVisual();
    renderWord();
    refreshKeyStates();
  }
