  /* =====================================================================
     KEYBOARD LAYOUT
     ===================================================================== */
  const ROWS = [
    "ЙЦУКЕНГШЩЗХЇ",
    "ФІВАПРОЛДЖЄ",
    "ЯЧСМИТЬБЮ"
  ];
  const VALID_LETTERS = new Set([...ROWS.join("")]);

  /* =====================================================================
     VERB SVG ICONS (black pictograms)
     Simple inline SVGs; rendered via innerHTML.
     ===================================================================== */
  const VERB_SVG = {
    walk: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="5" r="2.6" fill="#222"/><path d="M17 8 L14 17"/><path d="M14 13 L9 14 M14 13 L20 16"/><path d="M14 17 L10 26 M14 17 L20 26"/></svg>`,
    run: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="5" r="2.6" fill="#222"/><path d="M22 8 L18 17"/><path d="M19 13 L11 11 M19 13 L24 17"/><path d="M18 17 L9 21 M18 17 L24 27"/></svg>`,
    sleep: `<svg viewBox="0 0 32 32" fill="#222" stroke="#222" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M3 23 Q3 16 11 16 Q19 16 19 23 L19 27 L3 27 Z"/><path d="M11 16 a4 4 0 1 0 0 -8 a4 4 0 0 0 0 8 Z"/><g fill="none"><path d="M21 9 L27 9 L21 16 L27 16"/><path d="M22 5 L26 5 L22 9 L26 9" stroke-width="1.4"/></g></svg>`,
    eat: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 V13 M6 4 V11 M12 4 V11"/><path d="M9 13 V28"/><ellipse cx="22" cy="9" rx="3.5" ry="6" fill="#222"/><path d="M22 15 V28"/></svg>`,
    read: `<svg viewBox="0 0 32 32" fill="#fff" stroke="#222" stroke-width="2" stroke-linejoin="round"><path d="M4 8 Q10 6 16 9 Q22 6 28 8 V25 Q22 23 16 26 Q10 23 4 25 Z"/><path d="M16 9 V26" fill="none"/></svg>`,
    write: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M21 4 L28 11 L11 28 L4 28 L4 21 Z"/><path d="M18 7 L25 14"/><path d="M4 28 L11 28" stroke-width="2"/></svg>`,
    sing: `<svg viewBox="0 0 32 32" fill="#222" stroke="#222" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M13 6 V21" fill="none"/><path d="M24 4 V18" fill="none"/><path d="M13 6 L24 4" fill="none"/><ellipse cx="10" cy="22" rx="4" ry="3"/><ellipse cx="21" cy="19" rx="4" ry="3"/></svg>`,
    play: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round"><circle cx="16" cy="16" r="11"/><path d="M5 16 H27 M16 5 V27" stroke-width="1.4"/><path d="M8 9 L24 23 M24 9 L8 23" stroke-width="1.4"/></svg>`,
    fly: `<svg viewBox="0 0 32 32" fill="#222" stroke="#222" stroke-width="1.5" stroke-linejoin="round"><path d="M3 18 L29 6 L20 17 L26 18 L14 28 L15 21 L3 18 Z"/></svg>`,
    swim: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="2.6" fill="#222"/><path d="M11 11 L18 14 L22 11"/><path d="M3 22 Q7 19 11 22 T19 22 T27 22 T35 22"/><path d="M3 27 Q7 24 11 27 T19 27 T27 27" opacity="0.5"/></svg>`,
    cry: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="15" r="11"/><circle cx="12" cy="13" r="1.2" fill="#222"/><circle cx="20" cy="13" r="1.2" fill="#222"/><path d="M12 21 Q16 18 20 21"/><path d="M11 16 L9 22 L13 22 Z" fill="#7BB7E6" stroke="#7BB7E6"/></svg>`,
    laugh: `<svg viewBox="0 0 32 32" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="11"/><path d="M11 12 L13 14 M21 12 L19 14" stroke-width="2.4"/><path d="M9 18 Q16 26 23 18 Z" fill="#222"/></svg>`
  };

  /* =====================================================================
     BUILT-IN THEMES
     Each theme: {id, name, items: [{word, emoji?|svg?}]}
     All words use only VALID_LETTERS.
     ===================================================================== */
  const THEMES = [
    {
      id: "fruits", name: "Фрукти", icon: "🍎",
      items: [
        { word: "ЯБЛУКО", emoji: "🍎" },
        { word: "БАНАН", emoji: "🍌" },
        { word: "ГРУША", emoji: "🍐" },
        { word: "ВИНОГРАД", emoji: "🍇" },
        { word: "ПЕРСИК", emoji: "🍑" },
        { word: "КАВУН", emoji: "🍉" },
        { word: "ЛИМОН", emoji: "🍋" },
        { word: "ПОЛУНИЦЯ", emoji: "🍓" },
        { word: "КІВІ", emoji: "🥝" },
        { word: "ВИШНЯ", emoji: "🍒" },
        { word: "АНАНАС", emoji: "🍍" }
      ]
    },
    {
      id: "vegetables", name: "Овочі", icon: "🥕",
      items: [
        { word: "МОРКВА", emoji: "🥕" },
        { word: "ОГІРОК", emoji: "🥒" },
        { word: "ПОМІДОР", emoji: "🍅" },
        { word: "КАРТОПЛЯ", emoji: "🥔" },
        { word: "КУКУРУДЗА", emoji: "🌽" },
        { word: "ЦИБУЛЯ", emoji: "🧅" },
        { word: "КАПУСТА", emoji: "🥬" },
        { word: "ПЕРЕЦЬ", emoji: "🌶️" },
        { word: "БАКЛАЖАН", emoji: "🍆" },
        { word: "ГРИБ", emoji: "🍄" }
      ]
    },
    {
      id: "animals", name: "Тварини", icon: "🐶",
      items: [
        { word: "СОБАКА", emoji: "🐶" },
        { word: "КІТ", emoji: "🐱" },
        { word: "МИША", emoji: "🐭" },
        { word: "ЗАЄЦЬ", emoji: "🐰" },
        { word: "ВЕДМІДЬ", emoji: "🐻" },
        { word: "ЛИСИЦЯ", emoji: "🦊" },
        { word: "КОРОВА", emoji: "🐮" },
        { word: "СВИНЯ", emoji: "🐷" },
        { word: "КУРКА", emoji: "🐔" },
        { word: "КІНЬ", emoji: "🐴" },
        { word: "ВІВЦЯ", emoji: "🐑" },
        { word: "ЖАБА", emoji: "🐸" },
        { word: "РИБА", emoji: "🐟" },
        { word: "ПТАХ", emoji: "🐦" }
      ]
    },
    {
      id: "transport", name: "Транспорт", icon: "🚗",
      items: [
        { word: "МАШИНА", emoji: "🚗" },
        { word: "АВТОБУС", emoji: "🚌" },
        { word: "ПОЇЗД", emoji: "🚂" },
        { word: "ЛІТАК", emoji: "✈️" },
        { word: "КОРАБЕЛЬ", emoji: "🚢" },
        { word: "ВЕЛОСИПЕД", emoji: "🚲" },
        { word: "РАКЕТА", emoji: "🚀" },
        { word: "ТРАКТОР", emoji: "🚜" }
      ]
    },
    {
      id: "family", name: "Сім'я", icon: "👨‍👩‍👧",
      items: [
        { word: "МАМА", emoji: "👩" },
        { word: "ТАТО", emoji: "👨" },
        { word: "БАБА", emoji: "👵" },
        { word: "ДІД", emoji: "👴" },
        { word: "СИН", emoji: "👦" },
        { word: "ДОНЯ", emoji: "👧" },
        { word: "МАЛЯ", emoji: "👶" },
        { word: "БРАТ", emoji: "🧒" }
      ]
    },
    {
      id: "nature", name: "Природа", icon: "🌳",
      items: [
        { word: "СОНЦЕ", emoji: "☀️" },
        { word: "МІСЯЦЬ", emoji: "🌙" },
        { word: "ЗІРКА", emoji: "⭐" },
        { word: "ХМАРА", emoji: "☁️" },
        { word: "ДОЩ", emoji: "🌧️" },
        { word: "СНІГ", emoji: "❄️" },
        { word: "ДЕРЕВО", emoji: "🌳" },
        { word: "КВІТКА", emoji: "🌸" },
        { word: "ВЕСЕЛКА", emoji: "🌈" },
        { word: "ВОГОНЬ", emoji: "🔥" }
      ]
    },
    {
      id: "food", name: "Їжа", icon: "🍞",
      items: [
        { word: "ХЛІБ", emoji: "🍞" },
        { word: "СИР", emoji: "🧀" },
        { word: "ЯЙЦЕ", emoji: "🥚" },
        { word: "МОЛОКО", emoji: "🥛" },
        { word: "ПИРІГ", emoji: "🥧" },
        { word: "СУП", emoji: "🍲" },
        { word: "ТОРТ", emoji: "🍰" },
        { word: "ЦУКЕРКА", emoji: "🍬" },
        { word: "МОРОЗИВО", emoji: "🍦" }
      ]
    },
    {
      id: "verbs", name: "Дієслова", icon: "🏃",
      items: [
        { word: "ІДЕ", svg: VERB_SVG.walk },
        { word: "БІЖИТЬ", svg: VERB_SVG.run },
        { word: "СПИТЬ", svg: VERB_SVG.sleep },
        { word: "ЇСТЬ", svg: VERB_SVG.eat },
        { word: "ЧИТАЄ", svg: VERB_SVG.read },
        { word: "ПИШЕ", svg: VERB_SVG.write },
        { word: "СПІВАЄ", svg: VERB_SVG.sing },
        { word: "ГРАЄ", svg: VERB_SVG.play },
        { word: "ЛЕТИТЬ", svg: VERB_SVG.fly },
        { word: "ПЛАВАЄ", svg: VERB_SVG.swim },
        { word: "ПЛАЧЕ", svg: VERB_SVG.cry },
        { word: "СМІЄТЬСЯ", svg: VERB_SVG.laugh }
      ]
    }
  ];

  // sanity-filter: drop any item with letters not on the keyboard (defensive)
  THEMES.forEach(t => {
    t.items = t.items.filter(it => [...it.word].every(ch => VALID_LETTERS.has(ch)));
  });
