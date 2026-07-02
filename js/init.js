// Bootstraps the game. MUST be the last script loaded.
  /* =====================================================================
     INIT
     ===================================================================== */
  document.addEventListener("dblclick", (e) => e.preventDefault());

  loadState();
  scoreEl.textContent = state.score;
  startNewWord();
