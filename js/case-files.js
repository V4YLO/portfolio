(function () {
  var cases = typeof CASE_FILES !== 'undefined' ? CASE_FILES : [];
  var folderStrip = document.querySelector('.folder-strip');
  var chooseLink = document.getElementById('choose-case-link');
  var stripActions = document.getElementById('folder-strip-actions');
  var fileList = document.getElementById('sidebar-file-list');
  var searchInput = document.getElementById('case-search');

  if (!folderStrip || !chooseLink || !stripActions || !fileList || cases.length === 0) {
    if (stripActions) stripActions.hidden = true;
    return;
  }

  var items = [];

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
    if (theme.tabText) s.push('--folder-tab-text:' + theme.tabText);
    return s.length ? s.join(';') : '';
  }

  function buildFolderItem(caseData, index) {
    var div = document.createElement('div');
    div.className = 'folder-item';
    div.setAttribute('data-case-id', caseData.id);
    div.setAttribute('data-case-index', String(index));
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '-1');
    var themeStyle = folderThemeStyle(caseData.folderTheme);
    if (themeStyle) div.setAttribute('style', themeStyle);
    var body = document.createElement('div');
    body.className = 'folder-body';
    var label = document.createElement('span');
    label.className = 'folder-stamp';
    if (caseData.noStamp) {
      label.textContent = '';
      div.classList.add('folder-no-stamp');
    } else {
      label.textContent = caseData.leftFrontTitle || caseData.id;
    }
    body.appendChild(label);
    var tab = document.createElement('div');
    tab.className = 'folder-tab';
    tab.setAttribute('aria-hidden', 'true');
    var tabSpan = document.createElement('span');
    tabSpan.textContent = caseData.tabLabel || caseData.id;
    tab.appendChild(tabSpan);
    div.appendChild(body);
    div.appendChild(tab);
    return div;
  }

  function buildSidebarList() {
    fileList.innerHTML = '';
    cases.forEach(function (c, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sidebar-file-btn';
      btn.setAttribute('data-case-index', String(i));
      btn.textContent = c.tabLabel || c.id;
      li.appendChild(btn);
      fileList.appendChild(li);
    });
  }

  cases.forEach(function (c, i) {
    folderStrip.appendChild(buildFolderItem(c, i));
  });
  items = Array.from(folderStrip.querySelectorAll('.folder-item'));
  buildSidebarList();

  var total = items.length;
  var currentIndex = 0;

  function getDepth(index) {
    return (index - currentIndex + total) % total;
  }

  function applyStack() {
    var frontId = items[currentIndex].getAttribute('data-case-id');
    items.forEach(function (item, i) {
      var depth = getDepth(i);
      var isFront = depth === 0;
      item.classList.toggle('stack-front', isFront);
      item.setAttribute('tabindex', isFront ? '0' : '-1');
      item.setAttribute('data-depth', depth);
      var offset = depth * 18;
      var scale = 1 - depth * 0.025;
      if (scale < 0.72) scale = 0.72;
      var blurPx = depth * 1.2;
      item.style.zIndex = (total - depth).toString();
      item.style.transform = 'translate(' + offset + 'px, ' + offset + 'px) scale(' + scale + ')';
      item.style.filter = isFront ? 'none' : 'blur(' + blurPx + 'px)';
    });
    chooseLink.href = 'case-detail.html?id=' + encodeURIComponent(frontId);
    stripActions.hidden = false;
    updateSidebarCurrent();
  }

  function updateSidebarCurrent() {
    var btns = fileList.querySelectorAll('.sidebar-file-btn');
    btns.forEach(function (btn) {
      btn.classList.toggle('is-current', parseInt(btn.getAttribute('data-case-index'), 10) === currentIndex);
    });
  }

  function goToIndex(index) {
    if (index < 0 || index >= total) return;
    currentIndex = index;
    applyStack();
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % total;
    applyStack();
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + total) % total;
    applyStack();
  }

  fileList.addEventListener('click', function (e) {
    var btn = e.target.closest('.sidebar-file-btn');
    if (!btn || btn.closest('li').classList.contains('is-hidden')) return;
    var index = parseInt(btn.getAttribute('data-case-index'), 10);
    goToIndex(index);
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = (this.value || '').trim().toLowerCase();
      var lis = fileList.querySelectorAll('li');
      lis.forEach(function (li) {
        var b = li.querySelector('.sidebar-file-btn');
        var text = (b && b.textContent) ? b.textContent.trim().toLowerCase() : '';
        li.classList.toggle('is-hidden', q.length > 0 && text.indexOf(q) === -1);
      });
    });
  }

  folderStrip.addEventListener('click', function (e) {
    var item = e.target.closest('.folder-item');
    if (!item || !item.classList.contains('stack-front')) return;
    e.preventDefault();
    window.location.href = chooseLink.href;
  });

  folderStrip.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaY > 0) goNext();
    else if (e.deltaY < 0) goPrev();
  }, { passive: false });

  folderStrip.addEventListener('keydown', function (e) {
    var front = folderStrip.querySelector('.folder-item.stack-front');
    if (!front || document.activeElement !== front) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goPrev();
    }
  });

  applyStack();
})();
