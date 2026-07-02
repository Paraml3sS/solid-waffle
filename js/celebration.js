  /* =====================================================================
     CELEBRATION
     ===================================================================== */
  function showCelebration() {
    celebrationWord.textContent = currentItem.word;
    celebration.classList.add("show");
    celebration.setAttribute("aria-hidden", "false");
    spawnConfetti();
  }
  function hideCelebrationAndAdvance() {
    celebration.classList.remove("show");
    celebration.setAttribute("aria-hidden", "true");
    clearConfetti();
    startNewWord();
  }
  function spawnConfetti() {
    clearConfetti();
    const count = 36;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
      piece.style.animationDelay = (Math.random() * 0.4) + "s";
      piece.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      piece.style.width = (6 + Math.random() * 8) + "px";
      piece.style.height = (10 + Math.random() * 8) + "px";
      celebration.appendChild(piece);
    }
  }
  function clearConfetti() {
    celebration.querySelectorAll(".confetti-piece").forEach(p => p.remove());
  }

  nextBtn.addEventListener("click", hideCelebrationAndAdvance);
  reloadBtn.addEventListener("click", () => {
    if (celebration.classList.contains("show")) return;
    startNewWord();
  });
