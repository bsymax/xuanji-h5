function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */

// ==================== ES5 Polyfills ====================
// Minimal Set polyfill for very old browsers (iOS 8, Android 4.4)
// Only implements the methods used in this app: new Set(), .add(), .has(), .size, .delete()
if (typeof Set === 'undefined') {
  window.Set = function() {
    this._values = [];
    this.size = 0;
  };
  window.Set.prototype.add = function(value) {
    if (this._values.indexOf(value) === -1) {
      this._values.push(value);
      this.size = this._values.length;
    }
    return this;
  };
  window.Set.prototype.has = function(value) {
    return this._values.indexOf(value) !== -1;
  };
  window.Set.prototype.delete = function(value) {
    var idx = this._values.indexOf(value);
    if (idx !== -1) {
      this._values.splice(idx, 1);
      this.size = this._values.length;
      return true;
    }
    return false;
  };
  window.Set.prototype.clear = function() {
    this._values = [];
    this.size = 0;
  };
}

// Array.from polyfill - needed for querySelectorAll on old browsers
if (!Array.from) {
  Array.from = function(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };
}

 var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/*
 * ============================================================
 * 郑重声明（宁可信其有，不可信其无）：
 *
 * 本程序为纯算法驱动的娱乐工具，所有解读均为规则自动组合生成，
 * 不含任何人工算命介入。开发者仅编写代码与数据，不参与占卜行为，
 * 不窥探天机。本程序的开发与维护不损开发者白诗雨的任何福德、阴德、
 * 运势、健康、寿命或其他任何层面的利益。
 *
 * 使用者所见的九宫格与解读，本质是计算机随机排列与模板组合，
 * 仅供使用者自行参考娱乐。一切因果、决策、心理影响，皆由使用者
 * 自身承担。使用者使用本程序即视为同意以上声明。
 * ============================================================
 */

// ==================== 工具函数 ====================

function shuffle(arr) {
  var a = _toConsumableArray(arr);
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }
  return a;
}
function drawId() {
  var now = new Date();
  var ds = now.toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
  var rand = Math.random().toString(36).substring(2, 6);
  return "".concat(ds, "_").concat(rand);
}

// ==================== 页面状态管理 ====================

var AppState = {
  screen: 'home',
  cardPool: [],
  // 洗牌后的60张（牌堆，末尾是栈顶）
  drawnCards: [],
  // 已放入宫位的牌 [{seq, card, bagua}]
  drawCount: 0,
  maxDraw: 9,
  result: null,
  audioCtx: null,
  soundEnabled: true,
  musicEnabled: true,
  // 拖拽状态
  draggingCard: null,
  // 当前被拖拽的牌对象 {card, element, poolIndex}
  dragElement: null,
  // 跟随鼠标的 DOM
  dragOffsetX: 0,
  dragOffsetY: 0,
  dragStartX: 0,
  dragStartY: 0,
  isDragging: false,
  // 扇形牌面
  drawnPoolIndices: new Set(),
  // 已抽取的 cardPool 索引
  hoveredFanIndex: null,
  // 鼠标悬停的牌索引
  touchPreviewIndex: null,
  // 触屏预选的牌索引
  touchStartX: 0,
  touchStartY: 0,
  touchStartCardIndex: null,
  // 触屏按下时的牌索引
  showFan: false,
  // 扇形是否可见（洗牌动画后才显示）
  animatingSpread: false // 铺开动画进行中
};

// ==================== 音效系统 ====================

function initAudio() {
  try {
    AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    AppState.soundEnabled = false;
    AppState.musicEnabled = false;
  }
}
function playNote(freq, duration) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sine';
  if (!AppState.soundEnabled || !AppState.audioCtx) return;
  try {
    var osc = AppState.audioCtx.createOscillator();
    var gain = AppState.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, AppState.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, AppState.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(AppState.audioCtx.destination);
    osc.start();
    osc.stop(AppState.audioCtx.currentTime + duration);
  } catch (e) {/* ignore */}
}
function playDrawSound() {
  playNote(880, 0.2, 'sine');
  setTimeout(function () {
    return playNote(1100, 0.3, 'sine');
  }, 80);
}
function playSnapSound() {
  playNote(660, 0.15, 'triangle');
  setTimeout(function () {
    return playNote(880, 0.25, 'triangle');
  }, 100);
}
function playCompleteSound() {
  var notes = [523, 659, 784, 1047];
  notes.forEach(function (n, i) {
    return setTimeout(function () {
      return playNote(n, 0.45, 'triangle');
    }, i * 150);
  });
}

// ==================== DOM 工具 ====================

var homeEl, drawEl, resultEl;
function $(sel) {
  return document.querySelector(sel);
}

// ==================== 页面切换 ====================

function showScreen(screen) {
  AppState.screen = screen;
  [homeEl, drawEl, resultEl].forEach(function (el) {
    return el.style.display = 'none';
  });
  if (screen === 'home') homeEl.style.display = 'flex';
  if (screen === 'draw') drawEl.style.display = 'block';
  if (screen === 'result') resultEl.style.display = 'block';
  window.scrollTo(0, 0);
}

// ==================== 首页 ====================

function initHome() {
  var startBtn = $('#start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      playNote(660, 0.2);
      startDraw();
    });
  }
}

// ==================== 抽牌页 ====================

// 洛书九宫显示顺序（传统布局 4-9-2 / 3-5-7 / 8-1-6）
// 但用户抽牌按 BAGUA 顺序：坎1→坤2→震3→巽4→中5→乾6→兑7→艮8→离9
// 即 fillOrder: 用户在视觉上按 1→2→3→4→5→6→7→8→9 的顺序拖放
// 屏幕上宫位以洛书布局展示，宫位内标注填写序号

var FILL_ORDER = BAGUA.map(function (b) {
  return b.position;
}); // [1,2,3,4,5,6,7,8,9]
// 九宫格显示顺序（洛书布局）
var DISPLAY_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
// position → 宫位数据
var BAGUA_MAP = {};
BAGUA.forEach(function (b) {
  BAGUA_MAP[b.position] = b;
});

// ==================== 扇形牌面布局计算 ====================

/**
 * 计算60张牌的扇形布局
 * 弧口朝下：圆心在容器底部中心，牌面在圆心上方辐射展开
 * @param {number} cw - 容器宽度
 * @param {number} ch - 容器高度
 * @returns {Array<{x: number, y: number, rotation: number, zIndex: number}>}
 */
function computeFanLayout(cw, ch) {
  var totalCards = 60;
  var cx = cw / 2;
  var cy = ch; // 圆心在容器底部
  var radius = ch * 0.80; // 半径以容器高度为基准
  var arcAngle = 100; // ~100° 较窄弧度，牌面重叠少
  var startAngle = 90 - arcAngle / 2; // 40°
  var endAngle = startAngle + arcAngle; // 140°
  var deg2rad = Math.PI / 180;
  var layouts = [];
  for (var i = 0; i < totalCards; i++) {
    var angleDeg = startAngle + i / (totalCards - 1) * arcAngle;
    var angleRad = angleDeg * deg2rad;
    var x = cx + radius * Math.cos(angleRad);
    var y = cy - radius * Math.sin(angleRad);
    var rotation = 90 - angleDeg;
    // 物理正确的层叠：右侧（i大）在上，左侧（i小）在下被压
    // 即后一张牌压前一张牌，符合真实发牌（从左到右翻牌，右边在上）
    var zIndex = 5 + i;
    layouts.push({
      x: x,
      y: y,
      rotation: rotation,
      zIndex: zIndex
    });
  }
  return layouts;
}
function startDraw() {
  AppState.cardPool = shuffle(CARDS);
  AppState.drawnCards = [];
  AppState.drawCount = 0;
  AppState.result = null;
  AppState.draggingCard = null;
  AppState.drawnPoolIndices = new Set();
  AppState.hoveredFanIndex = null;
  AppState.touchPreviewIndex = null;
  AppState.showFan = false;
  AppState.animatingSpread = false;

  // 第一步：渲染洗牌动画页面（九宫格不可见，牌扇不可见）
  renderDrawPage();
  showScreen('draw');

  // 第二步：洗牌动画 ~2s 后，展开扇形
  setTimeout(function () {
    startFanSpread();
  }, 2000);
}

/**
 * 洗牌结束：从右端开始铺开扇形
 * 动画：所有牌从最右端（index=59）的位置出发，依次延迟铺到各自位置
 */
function startFanSpread() {
  AppState.showFan = true;
  AppState.animatingSpread = true;

  // 重新渲染：此时 showFan=true，扇形 HTML 出现，但初始时每张牌都在最右端
  renderDrawPage();

  // 计算最终布局
  var container = document.getElementById('card-fan-container');
  if (!container) {
    AppState.animatingSpread = false;
    bindDrawEvents();
    return;
  }
  var cw = container.offsetWidth;
  var ch = container.offsetHeight;
  var finalLayouts = computeFanLayout(cw, ch);
  var totalCards = AppState.cardPool.length;

  // 先设置 wrapper translate 为最右端位置（index 59），再加 transition 逐个展开
  var lastLayout = finalLayouts[totalCards - 1];
  for (var i = 0; i < totalCards; i++) {
    var wrapEl = document.getElementById('fan-wrap-' + i);
    if (!wrapEl) continue;
    // 初始：所有牌叠在最右端
    wrapEl.style.transform = 'translate(' + lastLayout.x + 'px, ' + lastLayout.y + 'px) rotate(' + lastLayout.rotation + 'deg)';
    wrapEl.style.zIndex = finalLayouts[i].zIndex;
  }

  // 给 wrapper 设置 transition 以便后续逐个展开
  var staggerDelay = 1800 / totalCards; // 约 30ms 每张，总周期 ~1.8s
  var _loop = function _loop() {
    var wrapEl = document.getElementById('fan-wrap-' + _i);
    if (!wrapEl) return 1; // continue
    var layout = finalLayouts[_i];
    var delay = (totalCards - 1 - _i) * staggerDelay;
    setTimeout(function () {
      wrapEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wrapEl.style.transform = 'translate(' + layout.x + 'px, ' + layout.y + 'px) rotate(' + layout.rotation + 'deg)';
    }, delay);
  };
  for (var _i = totalCards - 1; _i >= 0; _i--) {
    if (_loop()) continue;
  }

  // 铺开完成后移除 transition 并绑定事件
  setTimeout(function () {
    AppState.animatingSpread = false;
    for (var _i2 = 0; _i2 < totalCards; _i2++) {
      var _wrapEl = document.getElementById('fan-wrap-' + _i2);
      if (_wrapEl) _wrapEl.style.transition = '';
    }
    bindDrawEvents();
  }, 2000);
}
function renderDrawPage() {
  var nextPos = AppState.drawCount + 1;
  var nextBagua = BAGUA_MAP[nextPos];
  var remaining = AppState.cardPool.length - AppState.drawnPoolIndices.size;

  // 生成3×3虚框
  var cellsHTML = '';
  var _iterator = _createForOfIteratorHelper(DISPLAY_ORDER),
    _step;
  try {
    var _loop2 = function _loop2() {
      var pos = _step.value;
      var bagua = BAGUA_MAP[pos];
      var placed = AppState.drawnCards.find(function (d) {
        return d.seq === pos;
      });
      var isNext = pos === nextPos;
      var fillNum = placed ? '' : pos;
      if (placed) {
        cellsHTML += "\n        <div class=\"grid-slot filled\" data-pos=\"".concat(pos, "\">\n          <span class=\"slot-bagua-name\">").concat(bagua.name, "</span>\n          <span class=\"slot-symbol\">").concat(bagua.symbol, "</span>\n          <span class=\"slot-card-name\">").concat(placed.card.name, "</span>\n          <span class=\"slot-element\">").concat(placed.card.element, "\u884C</span>\n        </div>");
      } else {
        cellsHTML += "\n        <div class=\"grid-slot empty ".concat(isNext ? 'next-target' : '', "\" data-pos=\"").concat(pos, "\" id=\"slot-").concat(pos, "\">\n          <span class=\"slot-bagua-name\">").concat(bagua.name, "</span>\n          <span class=\"slot-symbol\">").concat(bagua.symbol, "</span>\n          <span class=\"slot-hint\">").concat(fillNum, "</span>\n          <span class=\"slot-direction\">").concat(bagua.direction, "</span>\n        </div>");
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop2();
    }

    // 九宫格容器样式：洗牌阶段不可见
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var jiugonggeStyle = AppState.showFan ? '' : 'opacity: 0; transition: opacity 0.6s ease;';
  var jiugonggeClass = AppState.showFan ? 'jiugongge-draw jiugongge-visible' : 'jiugongge-draw';

  // 扇形牌面 HTML
  var fanAreaHTML = '';
  if (AppState.showFan) {
    var fanCardsHTML = renderFanCardsInner();
    fanAreaHTML = "\n      <div class=\"card-fan-area\" id=\"card-fan-area\">\n        <div class=\"card-fan-container\" id=\"card-fan-container\">\n          ".concat(fanCardsHTML, "\n        </div>\n        <div class=\"fan-info-row\">\n          <span class=\"fan-remaining\" id=\"fan-remaining\">\u7075\u724C \xB7 \u5269 <strong>").concat(remaining, "</strong>/60 \u5F20</span>\n          <span class=\"deck-hint\" id=\"deck-hint\">\n            \u62D6\u81F3\u300C<strong>").concat(nextBagua.name, "</strong>\u300D").concat(nextBagua.symbol, "\n          </span>\n        </div>\n      </div>\n    ");
  } else {
    fanAreaHTML = "\n      <div class=\"card-fan-area\" id=\"card-fan-area\">\n        <div class=\"card-fan-container shuffle-stage\" id=\"card-fan-container\">\n          <div class=\"shuffle-deck\" id=\"shuffle-deck\">\n            <div class=\"shuffle-card\" style=\"--s:0;\"></div>\n            <div class=\"shuffle-card\" style=\"--s:1;\"></div>\n            <div class=\"shuffle-card\" style=\"--s:2;\"></div>\n            <div class=\"shuffle-card\" style=\"--s:3;\"></div>\n          </div>\n        </div>\n        <div class=\"fan-info-row\">\n          <span class=\"fan-remaining\">\u6D17\u724C\u4E2D\u2026</span>\n        </div>\n      </div>\n    ";
  }
  drawEl.innerHTML = "\n    <div class=\"draw-container\">\n      <div class=\"draw-header\">\n        <div class=\"draw-title\">\u7384\u673A\u4E5D\u5BAB</div>\n        <div class=\"draw-subtitle\">\u8F7B\u89E6\u7075\u724C \xB7 \u62D6\u5165\u4E5D\u5BAB</div>\n      </div>\n\n      <div class=\"order-banner\" id=\"order-banner\">\n        <span class=\"order-icon\">\u2630</span>\n        <span class=\"order-text\">\n          \u6D1B\u4E66\u6B21\u7B2C \xB7 \u5F53\u524D\u5E94\u586B <strong>".concat(nextBagua.name, "</strong>\uFF08").concat(nextBagua.direction, "\u65B9 \xB7 ").concat(nextBagua.element, "\u884C\uFF09\n        </span>\n        <span class=\"order-icon\">\u2637</span>\n      </div>\n\n      <div class=\"").concat(jiugonggeClass, "\" id=\"jiugongge-draw\" style=\"").concat(jiugonggeStyle, "\">\n        ").concat(cellsHTML, "\n      </div>\n\n      ").concat(fanAreaHTML, "\n\n      <button class=\"btn-reset\" id=\"btn-reset\" style=\"display:none;\">\u91CD\u65B0\u62BD\u724C</button>\n    </div>\n  ");

  // 扇形布局 & 九宫格显隐
  if (AppState.showFan) {
    setTimeout(function () {
      return layoutFanCards();
    }, 0);
    // 九宫格淡入
    setTimeout(function () {
      var jg = document.getElementById('jiugongge-draw');
      if (jg) jg.style.opacity = '1';
    }, 100);
  }

  // 只在不铺开时绑定事件
  if (!AppState.animatingSpread) {
    bindDrawEvents();
  }
  updateNextTargetHighlight();
}

/**
 * 生成扇形牌面内部 HTML（不含容器）
 */
function renderFanCardsInner() {
  var html = '';
  for (var i = 0; i < AppState.cardPool.length; i++) {
    var drawn = AppState.drawnPoolIndices.has(i);
    var dragging = AppState.draggingCard && AppState.draggingCard.poolIndex === i;
    var cls = 'fan-card';
    if (drawn) cls += ' fan-card--drawn';
    if (dragging) cls += ' fan-card--dragging';
    var card = AppState.cardPool[i];
    html += "\n      <div class=\"fan-card-wrap\" id=\"fan-wrap-".concat(i, "\">\n        <div class=\"").concat(cls, "\" id=\"fan-card-").concat(i, "\" data-pool-index=\"").concat(i, "\">\n          <div class=\"fan-card-inner\">\n            <span class=\"fan-card-label\">\u7075\u724C</span>\n          </div>\n        </div>\n      </div>");
  }
  return html;
}

/**
 * 根据容器实际尺寸计算扇形布局并应用到每张牌的 wrapper 上
 */
function layoutFanCards() {
  var container = document.getElementById('card-fan-container');
  if (!container) return;
  var cw = container.offsetWidth;
  var ch = container.offsetHeight;
  var layouts = computeFanLayout(cw, ch);
  for (var i = 0; i < AppState.cardPool.length; i++) {
    var wrapEl = document.getElementById('fan-wrap-' + i);
    if (!wrapEl) continue;
    // wrapper: translate 定位 + rotate 方向
    wrapEl.style.transform = "translate(".concat(layouts[i].x, "px, ").concat(layouts[i].y, "px) rotate(").concat(layouts[i].rotation, "deg)");
    wrapEl.style.zIndex = layouts[i].zIndex;
  }
}
function bindDrawEvents() {
  var fanContainer = document.getElementById('card-fan-container');
  if (!fanContainer) return;

  // 牌扇：鼠标事件
  fanContainer.addEventListener('mousedown', onFanMouseDown);
  fanContainer.addEventListener('mousemove', onFanMouseMove);
  fanContainer.addEventListener('mouseleave', onFanMouseLeave);

  // 牌扇：触屏事件
  fanContainer.addEventListener('touchstart', onFanTouchStart, {
    passive: false
  });
  fanContainer.addEventListener('touchmove', onFanTouchMove, {
    passive: false
  });

  // 全局移动/释放事件（拖拽过程中）
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onTouchMove, {
    passive: false
  });
  document.addEventListener('touchend', onTouchEnd);

  // 重置按钮
  var resetBtn = $('#btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetDraw);
  }
  if (AppState.drawCount > 0 && resetBtn) {
    resetBtn.style.display = 'block';
  }
}

// ========== 扇形牌面交互：桌面端 ==========

/**
 * 找到鼠标/触摸点下的牌元素
 */
function getFanCardFromPoint(x, y) {
  // 先隐藏拖拽元素以避免干扰
  var dragEl = AppState.dragElement;
  var dragDisplay = '';
  if (dragEl) {
    dragDisplay = dragEl.style.display;
    dragEl.style.display = 'none';
  }
  var el = document.elementFromPoint(x, y);
  if (dragEl) dragEl.style.display = dragDisplay;
  if (el) {
    var fanCard = el.closest('.fan-card');
    if (fanCard) return fanCard;
  }
  // 备选：如果 elementFromPoint 找不到（可能因为 transform），遍历牌卡判断
  return null;
}
function onFanMouseMove(e) {
  // 如果正在拖拽，跳过 hover 处理
  if (AppState.isDragging) return;
  var card = getFanCardFromPoint(e.clientX, e.clientY);

  // 清除上一个 hover
  if (AppState.hoveredFanIndex !== null) {
    var prevEl = document.getElementById('fan-card-' + AppState.hoveredFanIndex);
    if (prevEl && prevEl !== card) {
      prevEl.classList.remove('fan-card--hover');
    }
    AppState.hoveredFanIndex = null;
  }
  if (card) {
    var idx = parseInt(card.dataset.poolIndex);
    if (!isNaN(idx) && !AppState.drawnPoolIndices.has(idx)) {
      card.classList.add('fan-card--hover');
      AppState.hoveredFanIndex = idx;
    }
  }
}
function onFanMouseLeave() {
  // 清除 hover 状态
  if (AppState.hoveredFanIndex !== null) {
    var prevEl = document.getElementById('fan-card-' + AppState.hoveredFanIndex);
    if (prevEl) prevEl.classList.remove('fan-card--hover');
    AppState.hoveredFanIndex = null;
  }
}
function onFanMouseDown(e) {
  e.preventDefault();
  if (AppState.drawCount >= AppState.maxDraw) return;
  var card = getFanCardFromPoint(e.clientX, e.clientY);
  if (!card) return;
  var poolIndex = parseInt(card.dataset.poolIndex);
  if (isNaN(poolIndex) || AppState.drawnPoolIndices.has(poolIndex)) return;

  // 标记预选动画移除
  card.classList.remove('fan-card--hover');
  AppState.hoveredFanIndex = null;

  // 开始拖拽
  startDragFromFan(e.clientX, e.clientY, poolIndex, 'mouse');
}

// ========== 扇形牌面交互：移动端 ==========

function onFanTouchStart(e) {
  e.preventDefault();
  if (AppState.drawCount >= AppState.maxDraw) return;
  var t = e.touches[0];
  var card = getFanCardFromPoint(t.clientX, t.clientY);
  if (!card) return;
  var poolIndex = parseInt(card.dataset.poolIndex);
  if (isNaN(poolIndex) || AppState.drawnPoolIndices.has(poolIndex)) return;

  // 记录初始触摸位置
  AppState.touchStartX = t.clientX;
  AppState.touchStartY = t.clientY;
  AppState.touchStartCardIndex = poolIndex;

  // 清除之前的预览
  if (AppState.touchPreviewIndex !== null) {
    var prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
    if (prevEl) prevEl.classList.remove('fan-card--hover');
    AppState.touchPreviewIndex = null;
  }

  // 显示预选
  card.classList.add('fan-card--hover');
  AppState.touchPreviewIndex = poolIndex;

  // 开始拖拽
  startDragFromFan(t.clientX, t.clientY, poolIndex, 'touch');
}
function onFanTouchMove(e) {
  e.preventDefault();

  // 如果已经在拖拽，更新拖拽位置
  if (AppState.isDragging && AppState.draggingCard) {
    var _t = e.touches[0];
    moveDrag(_t.clientX, _t.clientY);
    return;
  }

  // 还没开始拖拽（手指在滑动预览），更新预览
  var t = e.touches[0];
  var card = getFanCardFromPoint(t.clientX, t.clientY);

  // 清除上一个预览
  if (AppState.touchPreviewIndex !== null) {
    var prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
    if (prevEl && prevEl !== card) {
      prevEl.classList.remove('fan-card--hover');
    }
    AppState.touchPreviewIndex = null;
  }
  if (card) {
    var idx = parseInt(card.dataset.poolIndex);
    if (!isNaN(idx) && !AppState.drawnPoolIndices.has(idx)) {
      card.classList.add('fan-card--hover');
      AppState.touchPreviewIndex = idx;
    }
  }
}
function onFanTouchEnd(e) {
  // 清除预览
  if (AppState.touchPreviewIndex !== null) {
    var prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
    if (prevEl) prevEl.classList.remove('fan-card--hover');
    AppState.touchPreviewIndex = null;
  }
  AppState.touchStartCardIndex = null;
}

// ========== 拖拽逻辑：从扇形牌面取出 ==========

function startDragFromFan(x, y, poolIndex, type) {
  if (AppState.cardPool.length === 0) return;
  if (AppState.drawnPoolIndices.has(poolIndex)) return;
  var card = AppState.cardPool[poolIndex];

  // 创建拖拽跟随元素
  var dragEl = document.createElement('div');
  dragEl.className = 'drag-card';
  dragEl.innerHTML = "\n    <div class=\"drag-card-inner\">\n      <div class=\"drag-card-name\">?</div>\n      <div class=\"drag-card-label\">\u7075\u724C</div>\n    </div>";
  Object.assign(dragEl.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    zIndex: '1000',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)'
  });
  document.body.appendChild(dragEl);

  // 立刻把牌放到鼠标位置
  dragEl.style.left = x + 'px';
  dragEl.style.top = y + 'px';
  AppState.draggingCard = {
    card: card,
    element: dragEl,
    poolIndex: poolIndex
  };
  AppState.isDragging = true;

  // 标记原位为"正在被拖拽"（淡化但留空隙）
  var fanCardEl = document.getElementById('fan-card-' + poolIndex);
  if (fanCardEl) {
    fanCardEl.classList.add('fan-card--dragging');
  }

  // 高亮目标宫位
  var nextPos = AppState.drawCount + 1;
  var targetSlot = document.getElementById('slot-' + nextPos);
  if (targetSlot) targetSlot.classList.add('drag-over');
  playNote(440, 0.1);
}
function onMouseMove(e) {
  if (!AppState.isDragging || !AppState.draggingCard) return;
  e.preventDefault();
  moveDrag(e.clientX, e.clientY);
}
function onTouchMove(e) {
  if (!AppState.isDragging || !AppState.draggingCard) return;
  e.preventDefault();
  var t = e.touches[0];
  moveDrag(t.clientX, t.clientY);
}
function moveDrag(x, y) {
  var el = AppState.draggingCard.element;
  // 牌居中跟随鼠标
  el.style.left = x + 'px';
  el.style.top = y + 'px';

  // 检测是否悬停在目标宫位上
  var nextPos = AppState.drawCount + 1;
  var targetSlot = $("#slot-".concat(nextPos));
  if (targetSlot) {
    var rect = targetSlot.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    var threshold = Math.min(rect.width, rect.height) * 0.45;
    if (dist < threshold) {
      targetSlot.classList.add('drag-over');
    } else {
      targetSlot.classList.remove('drag-over');
    }
  }
}
function onMouseUp(e) {
  if (!AppState.isDragging) return;
  endDrag(e.clientX, e.clientY);
}
function onTouchEnd(e) {
  // 如果没在拖拽，清理扇形触屏状态
  if (!AppState.isDragging) {
    onFanTouchEnd(e);
    return;
  }
  AppState.touchStartCardIndex = null;
  // touchend 没有坐标，取 changedTouches 中的最后位置
  var t = e.changedTouches[0];
  endDrag(t ? t.clientX : 0, t ? t.clientY : 0);
}
function endDrag(x, y) {
  var dragging = AppState.draggingCard;
  if (!dragging) return;
  var draggedPoolIndex = dragging.poolIndex;
  AppState.isDragging = false;
  AppState.draggingCard = null;

  // 移除拖拽元素
  if (dragging.element && dragging.element.parentNode) {
    dragging.element.remove();
  }

  // 移除牌扇上的 dragging 状态（保留空格）—— 放牌成功则标 drawn，放牌失败则恢复
  if (draggedPoolIndex != null) {
    var fanCardEl = document.getElementById('fan-card-' + draggedPoolIndex);
    if (fanCardEl) fanCardEl.classList.remove('fan-card--dragging');
  }

  // 清除所有高亮
  document.querySelectorAll('.drag-over').forEach(function (el) {
    return el.classList.remove('drag-over');
  });

  // 检测是否放入正确位置
  var nextPos = AppState.drawCount + 1;
  var targetSlot = document.getElementById('slot-' + nextPos);
  var snapped = false;
  if (targetSlot) {
    var rect = targetSlot.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    var threshold = Math.min(rect.width, rect.height) * 0.45;
    if (dist < threshold) {
      snapped = true;
    }
  }
  if (snapped) {
    // 磁吸成功！
    doPlaceCard(nextPos, targetSlot, draggedPoolIndex);
  } else {
    // 没放对位置，牌回到扇形原位（移除 dragging 状态即可恢复）
    playNote(220, 0.2, 'square');
  }
}

// ========== 放置牌到宫位 ==========

function doPlaceCard(pos, slotEl, poolIndex) {
  // 从 cardPool 指定位置取出
  var card = AppState.cardPool[poolIndex];
  var bagua = BAGUA_MAP[pos];

  // 标记为已抽取
  AppState.drawnPoolIndices.add(poolIndex);
  AppState.drawnCards.push({
    seq: pos,
    card: card,
    bagua: bagua
  });
  AppState.drawCount++;

  // 音效
  playSnapSound();

  // 扇形牌面：标记为 drawn
  var fanCardEl = document.getElementById('fan-card-' + poolIndex);
  if (fanCardEl) {
    fanCardEl.classList.remove('fan-card--dragging');
    fanCardEl.classList.add('fan-card--drawn');
  }

  // 更新剩余牌数
  updateFanRemaining();

  // Step 5: 宫位闪绿光 + 翻牌入位
  if (slotEl) {
    slotEl.classList.add('snap-in');
    // 短暂闪烁后替换内容
    setTimeout(function () {
      slotEl.classList.remove('empty', 'drag-over', 'snap-in');
      slotEl.classList.add('filled');
      slotEl.innerHTML = "\n        <span class=\"slot-bagua-name\">".concat(bagua.name, "</span>\n        <span class=\"slot-symbol\">").concat(bagua.symbol, "</span>\n        <span class=\"slot-card-name\">").concat(card.name, "</span>\n        <span class=\"slot-element\">").concat(card.element, "\u884C</span>\n      ");
    }, 200);
  }

  // Step 5.5: 弹出卡牌内容覆盖层 —— 等比例大卡
  showCardOverlay(card, bagua, pos);
}
function updateFanRemaining() {
  var remaining = AppState.cardPool.length - AppState.drawnPoolIndices.size;
  var remainEl = document.getElementById('fan-remaining');
  if (remainEl) {
    remainEl.innerHTML = '灵牌 · 剩 <strong>' + remaining + '</strong>/60 张';
  }
}
function showCardOverlay(card, bagua, pos) {
  // 移除旧覆盖层（如果有）
  var old = document.querySelector('.card-overlay');
  if (old) old.remove();
  var overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = "\n    <div class=\"card-overlay-bg\"></div>\n    <div class=\"card-overlay-card\">\n      <div class=\"card-overlay-pos\">".concat(bagua.name, " ").concat(bagua.symbol, " \xB7 \u7B2C").concat(pos, "\u5F20</div>\n      <div class=\"card-overlay-element\">").concat(card.element, "\u884C</div>\n      <div class=\"card-overlay-name\">").concat(card.name, "</div>\n      <div class=\"card-overlay-divider\"></div>\n      <div class=\"card-overlay-gist\">").concat(card.fortune_gist, "</div>\n      <div class=\"card-overlay-hint\">\u70B9\u51FB\u4EFB\u610F\u5904\u7EE7\u7EED</div>\n    </div>");

  // 点击任意处关闭
  overlay.addEventListener('click', function (e) {
    overlay.classList.add('overlay-fade-out');
    setTimeout(function () {
      overlay.remove();
      // 牌堆计数更新 + 检查是否满9张
      updateDeckCount();
      updateNextTargetHighlight();
      updateResetButton();
      if (AppState.drawCount >= AppState.maxDraw) {
        setTimeout(function () {
          completeDraw();
        }, 800);
      }
    }, 250);
  });

  // 阻止卡牌本身点击冒泡
  overlay.querySelector('.card-overlay-card').addEventListener('click', function (e) {
    e.stopPropagation();
    // 点卡牌本身也算关闭
    overlay.click();
  });
  document.body.appendChild(overlay);
}
function updateDeckCount() {
  // 扇形牌面：剩余牌数更新
  updateFanRemaining();
}
function updateNextTargetHighlight() {
  if (AppState.drawCount >= AppState.maxDraw) {
    // 更新提示
    var _hintEl = $('#deck-hint');
    if (_hintEl) _hintEl.innerHTML = '✨ 九宫已满 · 正在解读天机…';
    var _banner = $('#order-banner');
    if (_banner) _banner.innerHTML = '<span class="order-icon">◎</span><span class="order-text">九宫已满</span><span class="order-icon">◎</span>';
    return;
  }
  var nextPos = AppState.drawCount + 1;
  // 清除旧的 next-target
  document.querySelectorAll('.grid-slot.next-target').forEach(function (el) {
    el.classList.remove('next-target');
  });

  // 设置新的 next-target
  var nextSlot = $("#slot-".concat(nextPos));
  if (nextSlot) {
    nextSlot.classList.add('next-target');
  }

  // 更新提示文字
  var nextBagua = BAGUA_MAP[nextPos];
  var hintEl = $('#deck-hint');
  if (hintEl && nextBagua) {
    hintEl.innerHTML = '拖至「<strong>' + nextBagua.name + '</strong>」' + nextBagua.symbol;
  }
  var banner = $('#order-banner');
  if (banner && nextBagua) {
    banner.innerHTML = "\n      <span class=\"order-icon\">\u2630</span>\n      <span class=\"order-text\">\u6D1B\u4E66\u6B21\u7B2C \xB7 \u5F53\u524D\u5E94\u586B <strong>".concat(nextBagua.name, "</strong>\uFF08").concat(nextBagua.direction, "\u65B9 \xB7 ").concat(nextBagua.element, "\u884C\uFF09</span>\n      <span class=\"order-icon\">\u2637</span>");
  }
}
function updateResetButton() {
  var btn = $('#btn-reset');
  if (btn) btn.style.display = 'block';
}
function resetDraw() {
  AppState.cardPool = shuffle(CARDS);
  AppState.drawnCards = [];
  AppState.drawCount = 0;
  AppState.result = null;
  AppState.draggingCard = null;
  AppState.isDragging = false;
  AppState.drawnPoolIndices = new Set();
  AppState.hoveredFanIndex = null;
  AppState.touchPreviewIndex = null;
  AppState.showFan = false;
  AppState.animatingSpread = false;
  renderDrawPage();

  // 洗牌动画后展开扇形
  setTimeout(function () {
    startFanSpread();
  }, 2000);
}

// ==================== 完成抽牌 → 解读 ====================

function completeDraw() {
  playCompleteSound();
  var drawResult = {
    draw_id: drawId(),
    timestamp: new Date().toLocaleString('zh-CN'),
    positions: AppState.drawnCards
  };
  var interpreted = interpretResult(drawResult);
  AppState.result = interpreted;
  renderResultPage();
  showScreen('result');
}

// ==================== 结果页 ====================

function renderResultPage() {
  var r = AppState.result;
  if (!r) return;
  var getScoreClass = function getScoreClass(score) {
    if (score >= 2) return 'ji';
    if (score <= -1) return 'xiong';
    return 'ping';
  };
  var html = "\n    <div class=\"result-container\">\n      <div class=\"result-header\">\n        <div class=\"result-title\">\u7384\u673A\u4E5D\u5BAB</div>\n        <div class=\"result-overall\">\n          <div class=\"overall-score ".concat(r.overall.level === '大吉' || r.overall.level === '吉' ? 'score-ji' : r.overall.level === '大凶' || r.overall.level === '凶' ? 'score-xiong' : 'score-ping', "\">\n            <div class=\"score-number\">").concat(r.overall.score, "</div>\n            <div class=\"score-label\">\u8FD0\u52BF</div>\n          </div>\n          <div class=\"overall-level ").concat(r.overall.level === '大吉' || r.overall.level === '吉' ? 'text-ji' : r.overall.level === '大凶' || r.overall.level === '凶' ? 'text-xiong' : 'text-ping', "\">").concat(r.overall.level, "</div>\n        </div>\n        <div class=\"result-stats\">\n          <span class=\"stat stat-ji\">\u5409 ").concat(r.overall.ji, "</span>\n          <span class=\"stat stat-ping\">\u5E73 ").concat(r.overall.ping, "</span>\n          <span class=\"stat stat-xiong\">\u51F6 ").concat(r.overall.xiong, "</span>\n        </div>\n      </div>\n\n      <div class=\"jiugongge\">\n  ");
  var posMap = {};
  r.positions.forEach(function (p) {
    posMap[p.seq] = p;
  });
  var _iterator2 = _createForOfIteratorHelper(DISPLAY_ORDER),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var num = _step2.value;
      var pos = posMap[num];
      if (!pos) continue;
      var sc = getScoreClass(pos.totalScore);
      html += "\n      <div class=\"grid-cell ".concat(sc, "\" ").concat(pos.seq === 5 ? 'id="center-cell"' : '', ">\n        <div class=\"cell-bagua-name\">").concat(pos.bagua.name, "</div>\n        <div class=\"cell-symbol\">").concat(pos.bagua.symbol, "</div>\n        <div class=\"cell-card-name\">").concat(pos.card.name, "</div>\n        <div class=\"cell-element\">").concat(pos.card.element, " ").concat(pos.elementRelation.relation, "</div>\n        <div class=\"cell-tag ").concat(sc, "\">").concat(pos.fortune, "</div>\n      </div>\n    ");
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  html += "</div>";
  if (r.interactions.combos.length > 0) {
    html += "<div class=\"combos-section\"><div class=\"section-title\">\u7279\u6B8A\u5929\u8C61</div>";
    r.interactions.combos.forEach(function (c) {
      html += "<div class=\"combo-item\"><span class=\"combo-name\">\u3010".concat(c.name, "\u3011</span>").concat(c.text, "</div>");
    });
    html += "</div>";
  }
  if (r.interactions.balanceText) {
    html += "<div class=\"balance-section\"><div class=\"section-title\">\u4E94\u884C\u63D0\u70B9</div><div class=\"balance-text\">".concat(r.interactions.balanceText, "</div></div>");
  }
  html += "<div class=\"positions-section\"><div class=\"section-title\">\u5404\u5BAB\u8BE6\u89E3</div>";
  r.positions.forEach(function (pos, i) {
    html += "\n      <div class=\"position-card ".concat(getScoreClass(pos.totalScore), "\">\n        <div class=\"pos-header\">\n          <span class=\"pos-num\">").concat(pos.seq, "</span>\n          <span class=\"pos-bagua-name\">").concat(pos.bagua.name, " ").concat(pos.bagua.symbol, "</span>\n          <span class=\"pos-fortune ").concat(getScoreClass(pos.totalScore), "\">").concat(pos.fortune, "</span>\n        </div>\n        <div class=\"pos-card-name\">").concat(pos.card.name, "\uFF08").concat(pos.card.element, "\u884C\uFF09\u2014 ").concat(pos.elementRelation.relation, "</div>\n        <div class=\"pos-text\">").concat(pos.text.replace(/\n\n/g, '</p><p class="pos-text-p">'), "</div>\n      </div>\n    ");
  });
  html += "</div>";
  html += "\n    <div class=\"summary-section\">\n      <div class=\"section-title\">\u6574\u4F53\u8FD0\u52BF\u603B\u7ED3</div>\n      <div class=\"summary-text\">".concat(r.overall.summary.replace(/\n\n/g, '<br><br>'), "</div>\n    </div>\n    <div class=\"result-actions\">\n      <button class=\"btn-restart\" id=\"btn-restart\">\u518D\u62BD\u4E00\u6B21</button>\n      <button class=\"btn-save\" id=\"btn-save\">\u4FDD\u5B58\u7ED3\u679C\u56FE</button>\n    </div>\n  </div>\n  ");
  resultEl.innerHTML = html;

  // 再抽一次
  var restartBtn = $('#btn-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      AppState.cardPool = shuffle(CARDS);
      AppState.drawnCards = [];
      AppState.drawCount = 0;
      AppState.result = null;
      AppState.drawnPoolIndices = new Set();
      AppState.hoveredFanIndex = null;
      AppState.touchPreviewIndex = null;
      AppState.draggingCard = null;
      AppState.isDragging = false;
      AppState.showFan = false;
      AppState.animatingSpread = false;
      renderDrawPage();
      showScreen('draw');
      setTimeout(function () {
        startFanSpread();
      }, 2000);
    });
  }

  // 保存结果图
  var saveBtn = $('#btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      saveResultImage();
    });
  }
}

// ==================== 保存结果图 ====================
function saveResultImage() {
  return _saveResultImage.apply(this, arguments);
} // ==================== 初始化 ====================
function _saveResultImage() {
  _saveResultImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var el, origOverflow, origMaxH, canvas, link, _t2;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          el = resultEl.querySelector('.result-container');
          if (el) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          playNote(880, 0.15);
          _context.p = 2;
          if (!(typeof html2canvas === 'undefined')) {
            _context.n = 3;
            break;
          }
          _context.n = 3;
          return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        case 3:
          // 短暂去掉滚动条、固定宽度供截图
          origOverflow = el.style.overflow;
          origMaxH = el.style.maxHeight;
          el.style.overflow = 'visible';
          el.style.maxHeight = 'none';
          _context.n = 4;
          return html2canvas(el, {
            backgroundColor: '#0d0a1e',
            scale: 2,
            useCORS: true,
            logging: false
          });
        case 4:
          canvas = _context.v;
          el.style.overflow = origOverflow;
          el.style.maxHeight = origMaxH;

          // 下载
          link = document.createElement('a');
          link.download = "\u7384\u673A\u4E5D\u5BAB_".concat(AppState.result.draw_id, ".png");
          link.href = canvas.toDataURL('image/png');
          link.click();
          playNote(1100, 0.3);
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t2 = _context.v;
          console.error('截图失败:', _t2);
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[2, 5]]);
  }));
  return _saveResultImage.apply(this, arguments);
}
document.addEventListener('DOMContentLoaded', function () {
  homeEl = $('#home-page');
  drawEl = $('#draw-page');
  resultEl = $('#result-page');
  initAudio();
  initHome();
  showScreen('home');
  document.body.addEventListener('click', function () {
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }
  }, {
    once: true
  });
});
