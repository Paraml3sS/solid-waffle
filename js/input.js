  /* =====================================================================
     INPUT HANDLING
     ===================================================================== */
  function handlePress(letter, btn) {
    if (isComplete || !currentItem) return;
    const expected = currentItem.word[cursor];
    if (letter === expected) {
      cursor++;
      btn.classList.remove("target", "shaking");
      btn.classList.add("bouncing");
      setTimeout(() => btn.classList.remove("bouncing"), 360);
      renderWord();
      if (cursor >= currentItem.word.length) {
        isComplete = true;
        state.score++;
        scoreEl.textContent = state.score;
        saveState();
        keyEls.forEach(k => k.classList.remove("highlighted", "target"));
        setTimeout(showCelebration, 320);
      } else {
        refreshKeyStates();
      }
    } else {
      if (btn.classList.contains("shaking")) return;
      btn.classList.add("shaking");
      setTimeout(() => btn.classList.remove("shaking"), 420);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (settingsOverlay.classList.contains("show")) return;
    if (celebration.classList.contains("show")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hideCelebrationAndAdvance();
      }
      return;
    }
    const k = (e.key || "").toUpperCase();
    if (k.length === 1 && keyEls.has(k)) {
      e.preventDefault();
      handlePress(k, keyEls.get(k));
    }
  });
