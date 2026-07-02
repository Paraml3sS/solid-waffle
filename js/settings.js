  /* =====================================================================
     SETTINGS UI
     ===================================================================== */
  const settingsOverlay = $("settings-overlay");

  settingsBtn.addEventListener("click", openSettings);
  $("settings-close").addEventListener("click", closeSettings);
  $("settings-save-btn").addEventListener("click", () => {
    closeSettings();
    saveState();
    startNewWord();
  });
  settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) {
      closeSettings();
      saveState();
      startNewWord();
    }
  });

  function openSettings() {
    renderThemeList();
    renderCustomWordsInput();
    renderCustomWordsList();
    renderCustomImagesList();
    syncToggles();
    settingsOverlay.classList.add("show");
    settingsOverlay.setAttribute("aria-hidden", "false");
  }
  function closeSettings() {
    settingsOverlay.classList.remove("show");
    settingsOverlay.setAttribute("aria-hidden", "true");
  }

  /* ----- In-page confirm dialog (iOS-safe replacement for window.confirm) ----- */
  const confirmOverlay = $("confirm-overlay");
  const confirmMsg = $("confirm-msg");
  const confirmOk = $("confirm-ok");
  const confirmCancel = $("confirm-cancel");
  let confirmResolver = null;
  let confirmPrevFocus = null;

  function askConfirm(message, okLabel) {
    confirmMsg.textContent = message;
    confirmOk.textContent = okLabel || "Так";
    confirmPrevFocus = document.activeElement;
    confirmOverlay.classList.add("show");
    confirmOverlay.setAttribute("aria-hidden", "false");
    confirmOk.focus();
    return new Promise((resolve) => { confirmResolver = resolve; });
  }
  function settleConfirm(result) {
    if (!confirmOverlay.classList.contains("show")) return; // resolve at most once
    confirmOverlay.classList.remove("show");
    confirmOverlay.setAttribute("aria-hidden", "true");
    const resolve = confirmResolver;
    confirmResolver = null;
    if (confirmPrevFocus && confirmPrevFocus.focus) confirmPrevFocus.focus();
    if (resolve) resolve(result);
  }
  confirmOk.addEventListener("click", () => settleConfirm(true));
  confirmCancel.addEventListener("click", () => settleConfirm(false));
  confirmOverlay.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) settleConfirm(false); // tap outside = cancel
  });
  confirmOverlay.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); settleConfirm(true); }
    else if (e.key === "Escape") { e.preventDefault(); settleConfirm(false); }
  });

  /* ----- Toast (brief feedback; the score chip is hidden behind the open sheet) ----- */
  const toastEl = $("toast");
  let toastTimer = null;
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1600);
  }

  // Tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      $("pane-" + tab.dataset.tab).classList.add("active");
    });
  });

  /* ----- Theme list (with per-category word selection) ----- */

  // state.excludedWords[themeId] holds the words the user DESELECTED within a
  // theme. Absent/empty = every word in the theme is active (so words added in a
  // future version default to on).
  function excludedList(themeId) {
    return state.excludedWords[themeId] || [];
  }
  function isWordExcluded(themeId, word) {
    return excludedList(themeId).indexOf(word) !== -1;
  }
  function setWordExcluded(themeId, word, excluded) {
    const list = state.excludedWords[themeId] ? state.excludedWords[themeId].slice() : [];
    const i = list.indexOf(word);
    if (excluded && i === -1) list.push(word);
    else if (!excluded && i !== -1) list.splice(i, 1);
    if (list.length) state.excludedWords[themeId] = list;
    else delete state.excludedWords[themeId];
  }
  function themeSelectedCount(theme) {
    const ex = excludedList(theme.id);
    return theme.items.reduce((n, it) => n + (ex.indexOf(it.word) === -1 ? 1 : 0), 0);
  }

  function renderThemeList() {
    const list = $("theme-list");
    list.innerHTML = "";
    THEMES.forEach(theme => {
      const item = document.createElement("div");
      item.className = "theme-item";

      const enabled = state.enabledThemes.has(theme.id);
      // build preview from first 3 items
      const previewParts = theme.items.slice(0, 3).map(it => {
        if (it.svg) return it.svg;
        if (it.emoji) return `<span>${it.emoji}</span>`;
        return "";
      }).join(" ");
      const panelId = "theme-words-" + theme.id;

      item.innerHTML = `
        <label class="theme-row">
          <input type="checkbox" ${enabled ? "checked" : ""}>
          <span class="theme-checkbox"></span>
          <span class="theme-name">${theme.icon} ${theme.name}</span>
          <span class="theme-preview">${previewParts}</span>
          <button type="button" class="theme-expand" aria-expanded="false" aria-controls="${panelId}" aria-label="Показати слова">▾</button>
        </label>
        <div class="theme-words" id="${panelId}">
          <div class="theme-words-inner">
            <div class="theme-words-bar">
              <span class="tw-count"></span>
              <button type="button" class="tw-all"></button>
            </div>
            <div class="word-chips"></div>
          </div>
        </div>
      `;

      // Whole-category on/off
      const cb = item.querySelector(".theme-row input");
      cb.addEventListener("change", () => {
        if (cb.checked) state.enabledThemes.add(theme.id);
        else state.enabledThemes.delete(theme.id);
      });

      // Expand / collapse the word selector. The caret is a <button> (interactive
      // content) inside the <label>, so stop it from also toggling the checkbox.
      const expandBtn = item.querySelector(".theme-expand");
      expandBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = item.classList.toggle("expanded");
        expandBtn.setAttribute("aria-expanded", open ? "true" : "false");
        expandBtn.setAttribute("aria-label", open ? "Сховати слова" : "Показати слова");
      });

      const chipsEl = item.querySelector(".word-chips");
      const countEl = item.querySelector(".tw-count");
      const allBtn = item.querySelector(".tw-all");

      function updateBar() {
        const total = theme.items.length;
        const sel = themeSelectedCount(theme);
        countEl.textContent = "Обрано " + sel + " / " + total;
        allBtn.textContent = sel === total ? "Зняти всі" : "Обрати всі";
      }

      function renderChips() {
        chipsEl.innerHTML = "";
        theme.items.forEach(it => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "word-chip";
          chip.setAttribute("aria-pressed", isWordExcluded(theme.id, it.word) ? "false" : "true");
          const visual = it.svg || it.emoji || "";
          chip.innerHTML = `<span class="wc-emoji">${visual}</span><span class="wc-word">${it.word}</span>`;
          chip.addEventListener("click", () => {
            const active = chip.getAttribute("aria-pressed") === "true";
            setWordExcluded(theme.id, it.word, active);   // active → now exclude it
            chip.setAttribute("aria-pressed", active ? "false" : "true");
            updateBar();
          });
          chipsEl.appendChild(chip);
        });
      }

      allBtn.addEventListener("click", () => {
        if (themeSelectedCount(theme) === theme.items.length) {
          state.excludedWords[theme.id] = theme.items.map(it => it.word);  // deselect all
        } else {
          delete state.excludedWords[theme.id];                            // select all
        }
        renderChips();
        updateBar();
      });

      renderChips();
      updateBar();
      list.appendChild(item);
    });
  }

  /* ----- Custom words ----- */
  function renderCustomWordsInput() {
    $("custom-words-input").value = state.customWords.map(w => w.word).join("\n");
    $("custom-words-error").style.display = "none";
  }

  $("custom-words-input").addEventListener("input", (e) => {
    const errorEl = $("custom-words-error");
    const lines = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
    const cleaned = [];
    const invalid = [];
    lines.forEach(line => {
      const upper = line.toUpperCase();
      const valid = [...upper].every(ch => VALID_LETTERS.has(ch));
      if (valid && upper.length >= 2) cleaned.push({ word: upper });
      else if (upper.length > 0) invalid.push(line);
    });
    // dedupe (keep order)
    const seen = new Set();
    state.customWords = cleaned.filter(w => {
      if (seen.has(w.word)) return false;
      seen.add(w.word);
      return true;
    });
    if (invalid.length > 0) {
      errorEl.textContent = "Пропущено (недопустимі літери або < 2 літер): " + invalid.join(", ");
      errorEl.style.display = "block";
    } else {
      errorEl.style.display = "none";
    }
    renderCustomWordsList();
  });

  function renderCustomWordsList() {
    const list = $("custom-words-list");
    list.innerHTML = "";
    if (state.customWords.length === 0) {
      list.innerHTML = `<div class="empty-state">Поки що порожньо</div>`;
      return;
    }
    state.customWords.forEach((w, idx) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <span class="item-thumb">📝</span>
        <span class="item-word">${w.word}</span>
        <button class="item-del" aria-label="Видалити">✕</button>
      `;
      row.querySelector(".item-del").addEventListener("click", () => {
        state.customWords.splice(idx, 1);
        renderCustomWordsInput();
        renderCustomWordsList();
      });
      list.appendChild(row);
    });
  }

  /* ----- Custom images ----- */
  let pendingImageDataUrl = null;
  const imgFileInput = $("image-file");
  const imgFileLabel = $("image-file-label");
  const imgWordInput = $("image-word-input");
  const imgAddBtn = $("image-add-btn");
  const imgErrorEl = $("image-error");

  imgFileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      pendingImageDataUrl = null;
      imgFileLabel.textContent = "📷 Обрати файл…";
      imgFileLabel.classList.remove("has-file");
      updateImgAddBtn();
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showImgError("Файл завеликий (макс. 1.5 МБ). Спробуй менше зображення.");
      imgFileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize if image is large to save localStorage
      shrinkImage(ev.target.result, 320, (smallUrl) => {
        pendingImageDataUrl = smallUrl;
        imgFileLabel.textContent = "✓ " + file.name;
        imgFileLabel.classList.add("has-file");
        updateImgAddBtn();
      });
    };
    reader.readAsDataURL(file);
  });

  function shrinkImage(dataUrl, maxSize, cb) {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => cb(dataUrl);
    img.src = dataUrl;
  }

  imgWordInput.addEventListener("input", () => {
    imgWordInput.value = imgWordInput.value.toUpperCase();
    updateImgAddBtn();
  });

  function updateImgAddBtn() {
    const word = imgWordInput.value.trim();
    const validWord = word.length >= 2 && [...word].every(ch => VALID_LETTERS.has(ch));
    imgAddBtn.disabled = !pendingImageDataUrl || !validWord;
    if (word.length > 0 && !validWord) {
      showImgError("У слові є літера, якої немає на клавіатурі.");
    } else {
      hideImgError();
    }
  }

  function showImgError(msg) {
    imgErrorEl.textContent = msg;
    imgErrorEl.className = "hint error";
    imgErrorEl.style.display = "block";
  }
  function hideImgError() { imgErrorEl.style.display = "none"; }

  imgAddBtn.addEventListener("click", () => {
    const word = imgWordInput.value.trim();
    if (!pendingImageDataUrl || word.length < 2) return;
    state.customImages.push({ word, dataUrl: pendingImageDataUrl });
    // reset form
    pendingImageDataUrl = null;
    imgFileInput.value = "";
    imgWordInput.value = "";
    imgFileLabel.textContent = "📷 Обрати файл…";
    imgFileLabel.classList.remove("has-file");
    updateImgAddBtn();
    hideImgError();
    renderCustomImagesList();
  });

  function renderCustomImagesList() {
    const list = $("custom-images-list");
    list.innerHTML = "";
    if (state.customImages.length === 0) {
      list.innerHTML = `<div class="empty-state">Поки що порожньо</div>`;
      return;
    }
    state.customImages.forEach((img, idx) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <span class="item-thumb"><img src="${img.dataUrl}" alt=""></span>
        <span class="item-word">${img.word}</span>
        <button class="item-del" aria-label="Видалити">✕</button>
      `;
      row.querySelector(".item-del").addEventListener("click", () => {
        state.customImages.splice(idx, 1);
        renderCustomImagesList();
      });
      list.appendChild(row);
    });
  }

  /* ----- Toggles & danger buttons ----- */
  function syncToggles() {
    $("toggle-show-letters").checked = state.showLetters;
    $("toggle-show-visual").checked = state.showVisual;
    $("toggle-highlight-letters").checked = state.highlightLetters;
    $("toggle-finger-zones").checked = state.fingerZones;
  }
  $("toggle-show-letters").addEventListener("change", (e) => {
    state.showLetters = e.target.checked;
  });
  $("toggle-show-visual").addEventListener("change", (e) => {
    state.showVisual = e.target.checked;
  });
  $("toggle-highlight-letters").addEventListener("change", (e) => {
    state.highlightLetters = e.target.checked;
    refreshKeyStates();
  });
  $("toggle-finger-zones").addEventListener("change", (e) => {
    state.fingerZones = e.target.checked;
    refreshKeyStates();
  });
  $("reset-score-btn").addEventListener("click", async () => {
    const ok = await askConfirm("Скинути лічильник слів до 0?", "Скинути");
    if (!ok) return;
    state.score = 0;
    scoreEl.textContent = "0";
    saveState();
    showToast("Лічильник скинуто ✓");
  });
