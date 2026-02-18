(function () {
  var container = document.getElementById('case-detail-content');
  if (!container || typeof getCaseById === 'undefined') return;

  var params = new URLSearchParams(window.location.search || window.location.hash.slice(1));
  var id = params.get('id');
  var caseData = getCaseById(id);

  if (!caseData) {
    container.innerHTML = '<p class="case-not-found" data-i18n="caseNotFound">Case not found.</p>';
    if (window.applyLang && window.getLang) window.applyLang(window.getLang());
    return;
  }

  var leftBackTitle = caseData.leftBackTitle || 'Case File';
  var pages = caseData.pages || [];

  function getPathForLang(pathEn, pathCz) {
    var lang = typeof getLang === 'function' ? getLang() : 'en';
    return (lang === 'cz' && pathCz) ? pathCz : pathEn;
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function folderThemeStyle(theme) {
    if (!theme || typeof theme !== 'object') return '';
    var s = [];
    if (theme.front) s.push('--folder-front:' + theme.front);
    if (theme.frontLight) s.push('--folder-front-light:' + theme.frontLight);
    if (theme.frontDark) s.push('--folder-front-dark:' + theme.frontDark);
    if (theme.spine) s.push('--folder-spine:' + theme.spine);
    if (theme.spineLight) s.push('--folder-spine-light:' + theme.spineLight);
    if (theme.spineDark) s.push('--folder-spine-dark:' + theme.spineDark);
    if (theme.stamp) s.push('--folder-stamp:' + theme.stamp);
    if (theme.stampBorder) s.push('--folder-stamp-border:' + theme.stampBorder);
    if (theme.back) s.push('--folder-back:' + theme.back);
    if (theme.backLight) s.push('--folder-back-light:' + theme.backLight);
    if (theme.backDark) s.push('--folder-back-dark:' + theme.backDark);
    if (theme.backBorder) s.push('--folder-back-border:' + theme.backBorder);
    if (theme.backText) s.push('--folder-back-text:' + theme.backText);
    if (theme.backMuted) s.push('--folder-back-muted:' + theme.backMuted);
    if (theme.tabText) s.push('--folder-tab-text:' + theme.tabText);
    return s.length ? s.join(';') : '';
  }

  var themeStyle = folderThemeStyle(caseData.folderTheme);
  var html = '<div class="folder"' + (themeStyle ? ' style="' + themeStyle + '"' : '') + '>';
  html += '<div class="left-side">';
  var stampContent = caseData.noStamp ? '' : escapeHtml(caseData.leftFrontTitle || caseData.id);
  var stampClass = 'folder-stamp' + (caseData.noStamp ? ' folder-no-stamp' : '');
  html += '<div class="left-front"><h1 class="' + stampClass + '">' + stampContent + '</h1></div>';
  html += '<div class="left-back"><h1>' + escapeHtml(leftBackTitle) + '</h1><div class="left-back-content" data-src="' + escapeHtml(getPathForLang(caseData.leftBackPath, caseData.leftBackPathCz) || '') + '">...</div></div>';
  html += '</div>';
  html += '<div class="right-side">';
  html += '<div class="spine-label"><span>' + escapeHtml(caseData.tabLabel || caseData.id) + '</span></div>';
  html += '<div class="pages">';
  pages.forEach(function (p, i) {
    html += '<div class="page">';
    html += '<div class="side front" data-src="' + escapeHtml(getPathForLang(p.frontPath, p.frontPathCz) || '') + '">...</div>';
    html += '<div class="side back" data-src="' + escapeHtml(getPathForLang(p.backPath, p.backPathCz) || '') + '">...</div>';
    html += '</div>';
  });
  html += '</div></div></div>';
  html += '<div class="controls">';
  html += '<button type="button" id="openBtn" data-i18n="openFolder">Open Folder</button>';
  html += '<button type="button" id="prevBtn" class="hidden" data-i18n="prevBtn">◀ Back</button>';
  html += '<button type="button" id="closeBtn" class="hidden" data-i18n="closeFolder">Close Folder</button>';
  html += '<button type="button" id="nextBtn" class="hidden" data-i18n="nextBtn">Next ▶</button>';
  html += '</div>';

  container.innerHTML = html;

  function fetchInto(el) {
    var src = el.getAttribute('data-src');
    if (!src) return Promise.resolve();
    var url = new URL(src, document.baseURI || window.location.href).href;
    return fetch(url)
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (text) {
        el.removeAttribute('data-src');
        el.innerHTML = (text && text.trim()) ? text.trim() : '<p class="case-content-empty">—</p>';
      })
      .catch(function () {
        el.removeAttribute('data-src');
        var msg = 'Content could not be loaded.';
        if (window.location.protocol === 'file:') {
          msg += ' Open this site from a local web server (e.g. run a server in the project folder) instead of opening the HTML file directly.';
        }
        el.innerHTML = '<p class="case-content-empty">' + msg + '</p>';
      });
  }

  function applyNoteTilts() {
    container.querySelectorAll('.dossier-note[data-tilt]').forEach(function (el) {
      var deg = el.getAttribute('data-tilt');
      if (deg !== null && deg !== '') el.style.setProperty('--note-rotate', deg + 'deg');
    });
  }

  var targets = container.querySelectorAll('[data-src]');
  var i = 0;
  function runNext() {
    if (i >= targets.length) {
      applyNoteTilts();
      if (window.applyLang && window.getLang) window.applyLang(window.getLang());
      if (caseData.leftBackPathCz || (caseData.pages && caseData.pages[0] && caseData.pages[0].frontPathCz)) {
        document.addEventListener('langchange', reloadContentForLang);
      }
      if (document && document.dispatchEvent) {
        try {
          document.dispatchEvent(new CustomEvent('casedetailcontentloaded', { detail: { id: caseData.id } }));
        } catch (e) {}
      }
      return;
    }
    var el = targets[i];
    i++;
    fetchInto(el).then(runNext);
  }

  function reloadContentForLang() {
    document.removeEventListener('langchange', reloadContentForLang);
    var leftBackEl = container.querySelector('.left-back-content');
    var pageSides = container.querySelectorAll('.page .side');
    var lang = typeof getLang === 'function' ? getLang() : 'en';
    var path = getPathForLang(caseData.leftBackPath, caseData.leftBackPathCz);
    var promises = [];
    if (leftBackEl && path) {
      leftBackEl.setAttribute('data-src', path);
      promises.push(fetchInto(leftBackEl));
    }
    pages.forEach(function (p, idx) {
      var frontEl = pageSides[idx * 2];
      var backEl = pageSides[idx * 2 + 1];
      if (frontEl && (p.frontPath || p.frontPathCz)) {
        frontEl.setAttribute('data-src', getPathForLang(p.frontPath, p.frontPathCz));
        promises.push(fetchInto(frontEl));
      }
      if (backEl && (p.backPath || p.backPathCz)) {
        backEl.setAttribute('data-src', getPathForLang(p.backPath, p.backPathCz));
        promises.push(fetchInto(backEl));
      }
    });
    function onReloadDone() {
      applyNoteTilts();
      if (caseData.leftBackPathCz || (caseData.pages && caseData.pages[0] && caseData.pages[0].frontPathCz)) {
        document.addEventListener('langchange', reloadContentForLang);
      }
      requestAnimationFrame(function () {
        try {
          document.dispatchEvent(new CustomEvent('casedetailcontentloaded', { detail: { id: caseData.id } }));
        } catch (e) {}
      });
    }
    if (promises.length) {
      Promise.all(promises).then(onReloadDone);
    } else {
      onReloadDone();
    }
  }

  runNext();
})();
