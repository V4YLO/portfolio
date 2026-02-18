(function () {
  var placeholder = document.getElementById('site-header-placeholder');
  if (!placeholder) return;

  function getBaseUrl() {
    var href = window.location.href;
    var lastSlash = href.lastIndexOf('/');
    return lastSlash === -1 ? href : href.substring(0, lastSlash + 1);
  }

  function rewriteIconSrc(html) {
    var base = getBaseUrl();
    return html.replace(/src="\/resources\//g, 'src="' + base + 'resources/');
  }

  function injectHeader() {
    fetch(getBaseUrl() + 'partials/header.html')
      .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error(r.status)); })
      .then(function (html) { placeholder.outerHTML = rewriteIconSrc(html); initTheme(); if (window.applyLang && window.getLang) window.applyLang(window.getLang()); })
      .catch(function () {
        var base = getBaseUrl();
        var fallback = '<header class="site-header"><nav class="main-nav" aria-label="Main navigation"><ul class="nav-list">';
        fallback += '<li><a href="index.html" class="nav-link" data-i18n="navAbout">About</a></li><li><a href="case-files.html" class="nav-link" data-i18n="navCaseFiles">Case Files</a></li>';
        fallback += '<li><div class="theme-switch-wrap"><button type="button" class="theme-toggle" aria-label="Switch to dark theme" title="Toggle theme"><span class="theme-icon" aria-hidden="true">☀</span><span class="theme-icon theme-icon-dark" aria-hidden="true" hidden>☽</span></button></div></li>';
        fallback += '<li><div class="lang-switch-wrap"><details class="lang-details"><summary class="lang-switch-btn" aria-label="Select language">';
        fallback += '<img src="' + base + 'resources/language.svg" alt="" width="24" height="24"></summary><ul class="lang-dropdown" role="menu">';
        fallback += '<li role="none"><button type="button" role="menuitem" data-lang-set="en"><img src="' + base + 'resources/flag-en.png" alt="" width="24" height="24" class="lang-option-icon">EN</button></li>';
        fallback += '<li role="none"><button type="button" role="menuitem" data-lang-set="cz"><img src="' + base + 'resources/flag-cz.png" alt="" width="24" height="24" class="lang-option-icon">CZ</button></li></ul></details></div></li></ul></nav></header>';
        placeholder.outerHTML = fallback;
        initTheme();
        if (window.applyLang && window.getLang) window.applyLang(window.getLang());
      });
  }

  if (document.readyState === 'complete') {
    injectHeader();
  } else {
    window.addEventListener('load', injectHeader);
  }

  function initTheme() {
    var el = document.documentElement;
    var stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
    if (stored === 'dark') el.setAttribute('data-theme', 'dark');
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      function updateThemeUI() {
        var isDark = el.getAttribute('data-theme') === 'dark';
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        var light = btn.querySelector('.theme-icon-light');
        var dark = btn.querySelector('.theme-icon-dark');
        if (light) light.hidden = isDark;
        if (dark) dark.hidden = !isDark;
      }
      updateThemeUI();
      btn.addEventListener('click', function () {
        var isDark = el.getAttribute('data-theme') === 'dark';
        el.setAttribute('data-theme', isDark ? '' : 'dark');
        if (typeof localStorage !== 'undefined') localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateThemeUI();
      });
    }
  }
})();
