(function () {
  var container = document.querySelector('.case-detail-content');
  if (!container) return;

  var activeTrigger = null;
  container.addEventListener('click', function (e) {
    var img = e.target && e.target.closest && e.target.closest('img');
    if (!img || !img.src || img.closest('.photo-overlay')) return;
    var rect = img.getBoundingClientRect();
    var overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    var overlayImg = document.createElement('img');
    overlayImg.src = img.src;
    overlayImg.alt = img.alt || '';
    overlayImg.style.position = 'fixed';
    overlayImg.style.left = rect.left + 'px';
    overlayImg.style.top = rect.top + 'px';
    overlayImg.style.width = rect.width + 'px';
    overlayImg.style.height = rect.height + 'px';
    overlayImg.style.objectFit = 'contain';
    overlayImg.style.background = '#fff';
    overlay.appendChild(overlayImg);
    document.body.appendChild(overlay);
    activeTrigger = img;
    overlay.offsetHeight;
    overlay.classList.add('is-open');
    requestAnimationFrame(function () {
      overlayImg.classList.add('is-expanded');
    });
    function closeOverlay() {
      overlay.removeEventListener('click', closeOverlay);
      var r = activeTrigger ? activeTrigger.getBoundingClientRect() : rect;
      overlayImg.style.left = r.left + 'px';
      overlayImg.style.top = r.top + 'px';
      overlayImg.style.width = r.width + 'px';
      overlayImg.style.height = r.height + 'px';
      overlayImg.style.transform = 'none';
      overlayImg.classList.remove('is-expanded');
      overlayImg.addEventListener('transitionend', function onEnd() {
        overlayImg.removeEventListener('transitionend', onEnd);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      });
    }
    overlay.addEventListener('click', closeOverlay);
  });

  var leftSide = container.querySelector('.left-side');
  var pages = Array.from(container.querySelectorAll('.page'));
  var openBtn = container.querySelector('#openBtn');
  var closeBtn = container.querySelector('#closeBtn');
  var nextBtn = container.querySelector('#nextBtn');
  var prevBtn = container.querySelector('#prevBtn');

  if (!leftSide || !pages.length) return;

  var current = 0;
  var isOpen = false;

  var fanOffsets = pages.map(function (_, i) {
    return {
      x: 220 + i * 15,
      y: 35 + i * 15,
      rot: -4 + i * 1.2
    };
  });

  pages.forEach(function (p, i) {
    p.style.zIndex = pages.length - i;
  });

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      leftSide.classList.add('opened');
      isOpen = true;
      openBtn.classList.add('hidden');
      setTimeout(function () {
        leftSide.classList.add('lowered');
        if (prevBtn) prevBtn.classList.remove('hidden');
        if (closeBtn) closeBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.remove('hidden');
      }, 1500);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      var pagesToReturn = current;
      var i = 0;
      function returnNext() {
        if (i >= pagesToReturn) {
          pages.forEach(function (p, idx) {
            p.style.zIndex = pages.length - idx;
          });
          if (prevBtn) prevBtn.classList.add('hidden');
          if (closeBtn) closeBtn.classList.add('hidden');
          if (nextBtn) nextBtn.classList.add('hidden');
          setTimeout(function () {
            leftSide.classList.remove('lowered');
            setTimeout(function () {
              leftSide.classList.remove('opened');
              isOpen = false;
              setTimeout(function () {
                if (openBtn) openBtn.classList.remove('hidden');
              }, 1500);
            }, 100);
          }, 600);
          return;
        }
        current--;
        var pg = pages[current];
        pg.style.zIndex = pages.length - current;
        pg.style.transform = 'rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)';
        i++;
        setTimeout(returnNext, 250);
      }
      returnNext();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (current < pages.length) {
        var pg = pages[current];
        var o = fanOffsets[current];
        pg.style.zIndex = pages.length + current + 1;
        pg.style.transform = 'rotateY(-180deg) rotateZ(' + o.rot + 'deg) translateX(' + o.x + 'px) translateY(' + o.y + 'px)';
        current++;
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (current > 0) {
        current--;
        var pg = pages[current];
        pg.style.zIndex = pages.length - current;
        pg.style.transform = 'rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)';
      }
      if (document && document.dispatchEvent) {
        try {
          document.dispatchEvent(new CustomEvent('redstringreset'));
        } catch (e) {}
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (document && document.dispatchEvent) {
        try {
          document.dispatchEvent(new CustomEvent('redstringreset'));
        } catch (e) {}
      }
    });
  }
})();
