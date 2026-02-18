(function () {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  var TRANSLATIONS = {
    en: {
      navAbout: 'About',
      navCaseFiles: 'Case Files',
      sidebarTitle: 'Case Files',
      sidebarDesc: 'Scroll or click the front folder to cycle. Click a file below and use Choose to open.',
      searchPlaceholder: 'Search cases...',
      chooseBtn: 'Choose',
      openFolder: 'Open Folder',
      prevBtn: '◀ Back',
      closeFolder: 'Close Folder',
      nextBtn: 'Next ▶',
      caseNotFound: 'Case not found.'
    },
    cz: {
      navAbout: 'O projektu',
      navCaseFiles: 'Spisy',
      sidebarTitle: 'Spisy',
      sidebarDesc: 'Listujte kolečkem nebo klikněte na přední složku. Klikněte na soubor níže nebo použijte Otevřít.',
      searchPlaceholder: 'Hledat spisy...',
      chooseBtn: 'Otevřít',
      openFolder: 'Otevřít složku',
      prevBtn: '◀ Zpět',
      closeFolder: 'Zavřít složku',
      nextBtn: 'Další ▶',
      caseNotFound: 'Spis nenalezen.'
    }
  };

  function getLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return (stored && TRANSLATIONS[stored]) ? stored : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    document.documentElement.lang = lang === 'cz' ? 'cs' : lang;
    applyLang(lang);
  }

  function applyLang(lang) {
    var t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.placeholder !== undefined) el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('[data-lang-set]');
    if (!btn) return;
    var l = btn.getAttribute('data-lang-set');
    if (!l || !TRANSLATIONS[l]) return;
    e.preventDefault();
    setLang(l);
    var details = btn.closest('details');
    if (details) details.removeAttribute('open');
  });

  function initLang() {
    var lang = getLang();
    document.documentElement.lang = lang === 'cz' ? 'cs' : lang;
    applyLang(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }

  window.getLang = getLang;
  window.setLang = setLang;
  window.applyLang = applyLang;
})();
