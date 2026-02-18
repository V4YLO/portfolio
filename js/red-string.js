(function () {
  var instances = [];

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function RedString(container, options) {
    this.container = container;
    this.options = options || {};
    this.numSegments = this.options.segments || 20;
    this.gravity = this.options.gravity || 0.3;
    this.gravityEnabled = this.options.gravityEnabled !== false;
    this.damping = 0.98;
    this.pins = [];
    this.segments = [];
    this.initialPins = null;
    this.draggedPin = null;
    this.resetStartTime = null;
    this.resetStartPins = null;
    this.resetDuration = 420;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.className = 'red-string-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '5';
    this.pinHitEls = [];
    this.container.style.position = this.container.style.position || 'relative';
    this.container.appendChild(this.canvas);
    this.resize();
    this.initPinsFromPhotos();
    this.createPinHitElements();
    this.initAllSegments();
    this.bindEvents();
    this.animate();
  }

  RedString.prototype.createPinHitElements = function () {
    var size = 28;
    for (var i = 0; i < this.pins.length; i++) {
      var el = document.createElement('div');
      el.className = 'red-string-pin-hit';
      el.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;margin-left:-' + (size / 2) + 'px;margin-top:-' + (size / 2) + 'px;cursor:move;pointer-events:auto;z-index:6;';
      el.style.left = this.pins[i].x + 'px';
      el.style.top = this.pins[i].y + 'px';
      el._pinIndex = i;
      this.container.appendChild(el);
      this.pinHitEls.push(el);
    }
  };

  RedString.prototype.resize = function () {
    var w = this.container.offsetWidth || 0;
    var h = this.container.offsetHeight || 0;
    this.canvas.width = w;
    this.canvas.height = h;
  };

  RedString.prototype.initPinsFromPhotos = function () {
    var wraps = this.container.querySelectorAll('.dossier-photo-wrap');
    var attr = (this.container.getAttribute('data-red-string') || '1,2').split(',');
    var indices = [];
    for (var i = 0; i < attr.length; i++) {
      var idx = parseInt(attr[i].trim(), 10);
      if (!isNaN(idx)) indices.push(Math.max(1, Math.min(wraps.length, idx)) - 1);
    }
    if (indices.length < 2) indices = [0, Math.min(1, wraps.length - 1)];
    var cw = this.container.offsetWidth || 300;
    var ch = this.container.offsetHeight || 400;
    function centerOf(el) {
      return {
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 4
      };
    }
    this.pins = [];
    for (var j = 0; j < indices.length; j++) {
      var wrap = wraps[indices[j]];
      var pos = wrap ? centerOf(wrap) : { x: cw * (0.2 + j * 0.3), y: ch * 0.3 };
      this.pins.push({ x: pos.x, y: pos.y, dragging: false });
    }
    this.initialPins = this.pins.map(function (p) { return { x: p.x, y: p.y }; });
  };

  RedString.prototype.initAllSegments = function () {
    this.segments = [];
    for (var i = 0; i < this.pins.length - 1; i++) {
      var p1 = this.pins[i];
      var p2 = this.pins[i + 1];
      var dx = (p2.x - p1.x) / this.numSegments;
      var dy = (p2.y - p1.y) / this.numSegments;
      var points = [];
      for (var j = 0; j <= this.numSegments; j++) {
        var x = p1.x + dx * j;
        var y = p1.y + dy * j;
        points.push({ x: x, y: y, oldX: x, oldY: y });
      }
      var len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      this.segments.push({ points: points, segmentLength: len / this.numSegments });
    }
  };

  RedString.prototype.updatePhysics = function () {
    var anyDragging = this.pins.some(function (p) { return p.dragging; });
    for (var s = 0; s < this.segments.length; s++) {
      var seg = this.segments[s];
      var pts = seg.points;
      for (var i = 1; i < pts.length - 1; i++) {
        var p = pts[i];
        var vx = (p.x - p.oldX) * this.damping;
        var vy = (p.y - p.oldY) * this.damping;
        p.oldX = p.x;
        p.oldY = p.y;
        p.x += vx;
        p.y += vy;
        if (this.gravityEnabled) p.y += this.gravity;
      }
      for (var iter = 0; iter < 5; iter++) {
        pts[0].x = this.pins[s].x;
        pts[0].y = this.pins[s].y;
        pts[pts.length - 1].x = this.pins[s + 1].x;
        pts[pts.length - 1].y = this.pins[s + 1].y;
        for (var k = 0; k < pts.length - 1; k++) {
          var a = pts[k];
          var b = pts[k + 1];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var diff = (seg.segmentLength - dist) / dist;
          var offX = dx * diff * 0.5;
          var offY = dy * diff * 0.5;
          if (k !== 0) { a.x -= offX; a.y -= offY; }
          if (k !== pts.length - 2) { b.x += offX; b.y += offY; }
        }
      }
    }
    if (anyDragging && this.segments.length) {
      for (var t = 0; t < this.segments.length; t++) {
        var pA = this.pins[t];
        var pB = this.pins[t + 1];
        var totalDist = Math.hypot(pB.x - pA.x, pB.y - pA.y) || 1;
        this.segments[t].segmentLength = totalDist / this.numSegments;
      }
    }
  };

  RedString.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = '#dc143c';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (var s = 0; s < this.segments.length; s++) {
      var pts = this.segments[s].points;
      if (!pts.length) continue;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    for (var j = 0; j < this.pins.length; j++) {
      var pin = this.pins[j];
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = pin.dragging ? '#ff4444' : '#dc143c';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    for (var k = 0; k < this.pinHitEls.length; k++) {
      var pin = this.pins[k];
      var hit = this.pinHitEls[k];
      hit.style.left = pin.x + 'px';
      hit.style.top = pin.y + 'px';
    }
  };

  RedString.prototype.animate = function () {
    var self = this;
    function frame() {
      if (self.resetStartTime !== null && self.resetStartPins) {
        var elapsed = (Date.now() - self.resetStartTime) / self.resetDuration;
        if (elapsed >= 1) {
          for (var i = 0; i < self.pins.length; i++) {
            self.pins[i].x = self.initialPins[i].x;
            self.pins[i].y = self.initialPins[i].y;
          }
          self.initAllSegments();
          self.resetStartTime = null;
          self.resetStartPins = null;
        } else {
          var t = easeOutCubic(elapsed);
          for (var j = 0; j < self.pins.length; j++) {
            var pin = self.pins[j];
            var start = self.resetStartPins[j];
            var init = self.initialPins[j];
            pin.x = start.x + (init.x - start.x) * t;
            pin.y = start.y + (init.y - start.y) * t;
          }
          self.initAllSegments();
        }
      } else {
        self.updatePhysics();
      }
      self.draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  RedString.prototype.bindEvents = function () {
    var self = this;
    function onDocMouseMove(e) {
      if (!self.draggedPin) return;
      var rect = self.canvas.getBoundingClientRect();
      var scaleX = self.canvas.width / rect.width;
      var scaleY = self.canvas.height / rect.height;
      var x = (e.clientX - rect.left) * scaleX;
      var y = (e.clientY - rect.top) * scaleY;
      var margin = 10;
      x = Math.max(margin, Math.min(self.canvas.width - margin, x));
      y = Math.max(margin, Math.min(self.canvas.height - margin, y));
      self.draggedPin.x = x;
      self.draggedPin.y = y;
      for (var s = 0; s < self.segments.length; s++) {
        var pA = self.pins[s];
        var pB = self.pins[s + 1];
        var totalDist = Math.hypot(pB.x - pA.x, pB.y - pA.y) || 1;
        self.segments[s].segmentLength = totalDist / self.numSegments;
      }
    }
    function endDrag() {
      if (self.draggedPin) {
        self.draggedPin.dragging = false;
        self.draggedPin = null;
      }
      document.removeEventListener('mousemove', onDocMouseMove);
      document.removeEventListener('mouseup', endDrag);
    }
    function onPinMouseDown(e) {
      if (self.resetStartTime !== null) return;
      e.preventDefault();
      var idx = e.currentTarget._pinIndex;
      if (idx >= 0 && idx < self.pins.length) {
        self.draggedPin = self.pins[idx];
        self.pins[idx].dragging = true;
        document.addEventListener('mousemove', onDocMouseMove);
        document.addEventListener('mouseup', endDrag);
      }
    }
    this.pinHitEls.forEach(function (el) {
      el.addEventListener('mousedown', onPinMouseDown);
    });
  };

  RedString.prototype.reset = function () {
    if (!this.initialPins || this.pins.length !== this.initialPins.length) return;
    this.resetStartPins = this.pins.map(function (p) { return { x: p.x, y: p.y }; });
    this.resetStartTime = Date.now();
  };

  function initAll() {
    instances.length = 0;
    var containers = document.querySelectorAll('.page-photos-wired[data-red-string]');
    containers.forEach(function (c) {
      if (c._redStringAttached) return;
      c._redStringAttached = true;
      var seg = parseInt(c.getAttribute('data-red-string-fragments'), 10) || 20;
      var inst = new RedString(c, { segments: seg, gravityEnabled: true });
      instances.push(inst);
    });
  }

  if (document && document.addEventListener) {
    document.addEventListener('casedetailcontentloaded', function () {
      initAll();
    });
    document.addEventListener('redstringreset', function () {
      instances.forEach(function (inst) { inst.reset(); });
    });
  }
})();
