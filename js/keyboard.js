// Builds the on-screen keyboard at load — needs data.js (ROWS) and dom.js (keyboardEl, keyEls) loaded first.
  /* =====================================================================
     BUILD KEYBOARD
     ===================================================================== */
  ROWS.forEach((rowLetters, idx) => {
    const row = document.createElement("div");
    row.className = "row row-" + (idx + 1);
    [...rowLetters].forEach(letter => {
      const btn = document.createElement("button");
      btn.className = "key";
      btn.type = "button";
      btn.textContent = letter;
      btn.setAttribute("aria-label", "Літера " + letter);
      btn.dataset.letter = letter;
      btn.addEventListener("click", () => handlePress(letter, btn));
      row.appendChild(btn);
      keyEls.set(letter, btn);
    });
    keyboardEl.appendChild(row);
  });
