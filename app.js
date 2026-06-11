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
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawId() {
  const now = new Date();
  const ds = now.toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
  const rand = Math.random().toString(36).substring(2, 6);
  return `${ds}_${rand}`;
}

// ==================== 页面状态管理 ====================

const AppState = {
  screen: 'home',
  cardPool: [],             // 洗牌后的60张（牌堆，末尾是栈顶）
  drawnCards: [],           // 已放入宫位的牌 [{seq, card, bagua}]
  drawCount: 0,
  maxDraw: 9,
  result: null,
  audioCtx: null,
  soundEnabled: true,
  musicEnabled: true,

  // 拖拽状态
  draggingCard: null,       // 当前被拖拽的牌对象 {card, element, poolIndex}
  dragElement: null,        // 跟随鼠标的 DOM
  dragOffsetX: 0,
  dragOffsetY: 0,
  dragStartX: 0,
  dragStartY: 0,
  isDragging: false,

  // 扇形牌面
  drawnPoolIndices: new Set(),  // 已抽取的 cardPool 索引
  hoveredFanIndex: null,        // 鼠标悬停的牌索引
  touchPreviewIndex: null,      // 触屏预选的牌索引
  touchStartX: 0,
  touchStartY: 0,
  touchStartCardIndex: null,    // 触屏按下时的牌索引
  showFan: false,               // 扇形是否可见（洗牌动画后才显示）
  animatingSpread: false,       // 铺开动画进行中
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

function playNote(freq, duration, type = 'sine') {
  if (!AppState.soundEnabled || !AppState.audioCtx) return;
  try {
    const osc = AppState.audioCtx.createOscillator();
    const gain = AppState.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, AppState.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, AppState.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(AppState.audioCtx.destination);
    osc.start();
    osc.stop(AppState.audioCtx.currentTime + duration);
  } catch (e) { /* ignore */ }
}

function playDrawSound() {
  playNote(880, 0.2, 'sine');
  setTimeout(() => playNote(1100, 0.3, 'sine'), 80);
}

function playSnapSound() {
  playNote(660, 0.15, 'triangle');
  setTimeout(() => playNote(880, 0.25, 'triangle'), 100);
}

function playCompleteSound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => setTimeout(() => playNote(n, 0.45, 'triangle'), i * 150));
}

// ==================== DOM 工具 ====================

let homeEl, drawEl, resultEl;
function $(sel) { return document.querySelector(sel); }

// ==================== 页面切换 ====================

function showScreen(screen) {
  AppState.screen = screen;
  [homeEl, drawEl, resultEl].forEach(el => el.style.display = 'none');
  if (screen === 'home') homeEl.style.display = 'flex';
  if (screen === 'draw') drawEl.style.display = 'block';
  if (screen === 'result') resultEl.style.display = 'block';
  window.scrollTo(0, 0);
}

// ==================== 首页 ====================

function initHome() {
  const startBtn = $('#start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
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

const FILL_ORDER = BAGUA.map(b => b.position); // [1,2,3,4,5,6,7,8,9]
// 九宫格显示顺序（洛书布局）
const DISPLAY_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
// position → 宫位数据
const BAGUA_MAP = {};
BAGUA.forEach(b => { BAGUA_MAP[b.position] = b; });

// ==================== 扇形牌面布局计算 ====================

/**
 * 计算60张牌的扇形布局
 * 弧口朝下：圆心在容器底部中心，牌面在圆心上方辐射展开
 * @param {number} cw - 容器宽度
 * @param {number} ch - 容器高度
 * @returns {Array<{x: number, y: number, rotation: number, zIndex: number}>}
 */
function computeFanLayout(cw, ch) {
  const totalCards = 60;
  const cx = cw / 2;
  const cy = ch;                              // 圆心在容器底部
  const radius = ch * 0.80;                   // 半径以容器高度为基准
  const arcAngle = 100;                       // ~100° 较窄弧度，牌面重叠少
  const startAngle = (90 - arcAngle / 2);     // 40°
  const endAngle = startAngle + arcAngle;     // 140°
  const deg2rad = Math.PI / 180;

  const layouts = [];
  for (let i = 0; i < totalCards; i++) {
    const angleDeg = startAngle + (i / (totalCards - 1)) * arcAngle;
    const angleRad = angleDeg * deg2rad;
    const x = cx + radius * Math.cos(angleRad);
    const y = cy - radius * Math.sin(angleRad);
    const rotation = 90 - angleDeg;
    // 物理正确的层叠：右侧（i大）在上，左侧（i小）在下被压
    // 即后一张牌压前一张牌，符合真实发牌（从左到右翻牌，右边在上）
    const zIndex = 5 + i;
    layouts.push({ x, y, rotation, zIndex });
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
  setTimeout(() => {
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
  const container = document.getElementById('card-fan-container');
  if (!container) {
    AppState.animatingSpread = false;
    bindDrawEvents();
    return;
  }
  const cw = container.offsetWidth;
  const ch = container.offsetHeight;
  const finalLayouts = computeFanLayout(cw, ch);
  const totalCards = AppState.cardPool.length;

  // 先设置 wrapper translate 为最右端位置（index 59），再加 transition 逐个展开
  const lastLayout = finalLayouts[totalCards - 1];
  for (let i = 0; i < totalCards; i++) {
    const wrapEl = document.getElementById('fan-wrap-' + i);
    if (!wrapEl) continue;
    // 初始：所有牌叠在最右端
    wrapEl.style.transform = 'translate(' + lastLayout.x + 'px, ' + lastLayout.y + 'px) rotate(' + lastLayout.rotation + 'deg)';
    wrapEl.style.zIndex = finalLayouts[i].zIndex;
  }

  // 给 wrapper 设置 transition 以便后续逐个展开
  const staggerDelay = 1800 / totalCards; // 约 30ms 每张，总周期 ~1.8s
  for (let i = totalCards - 1; i >= 0; i--) {
    const wrapEl = document.getElementById('fan-wrap-' + i);
    if (!wrapEl) continue;
    const layout = finalLayouts[i];
    const delay = (totalCards - 1 - i) * staggerDelay;
    setTimeout(() => {
      wrapEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wrapEl.style.transform = 'translate(' + layout.x + 'px, ' + layout.y + 'px) rotate(' + layout.rotation + 'deg)';
    }, delay);
  }

  // 铺开完成后移除 transition 并绑定事件
  setTimeout(() => {
    AppState.animatingSpread = false;
    for (let i = 0; i < totalCards; i++) {
      const wrapEl = document.getElementById('fan-wrap-' + i);
      if (wrapEl) wrapEl.style.transition = '';
    }
    bindDrawEvents();
  }, 2000);
}

function renderDrawPage() {
  const nextPos = AppState.drawCount + 1;
  const nextBagua = BAGUA_MAP[nextPos];
  const remaining = AppState.cardPool.length - AppState.drawnPoolIndices.size;

  // 生成3×3虚框
  let cellsHTML = '';
  for (const pos of DISPLAY_ORDER) {
    const bagua = BAGUA_MAP[pos];
    const placed = AppState.drawnCards.find(d => d.seq === pos);
    const isNext = (pos === nextPos);
    const fillNum = placed ? '' : pos;

    if (placed) {
      cellsHTML += `
        <div class="grid-slot filled" data-pos="${pos}">
          <span class="slot-bagua-name">${bagua.name}</span>
          <span class="slot-symbol">${bagua.symbol}</span>
          <span class="slot-card-name">${placed.card.name}</span>
          <span class="slot-element">${placed.card.element}行</span>
        </div>`;
    } else {
      cellsHTML += `
        <div class="grid-slot empty ${isNext ? 'next-target' : ''}" data-pos="${pos}" id="slot-${pos}">
          <span class="slot-bagua-name">${bagua.name}</span>
          <span class="slot-symbol">${bagua.symbol}</span>
          <span class="slot-hint">${fillNum}</span>
          <span class="slot-direction">${bagua.direction}</span>
        </div>`;
    }
  }

  // 九宫格容器样式：洗牌阶段不可见
  const jiugonggeStyle = AppState.showFan ? '' : 'opacity: 0; transition: opacity 0.6s ease;';
  const jiugonggeClass = AppState.showFan ? 'jiugongge-draw jiugongge-visible' : 'jiugongge-draw';

  // 扇形牌面 HTML
  let fanAreaHTML = '';
  if (AppState.showFan) {
    const fanCardsHTML = renderFanCardsInner();
    fanAreaHTML = `
      <div class="card-fan-area" id="card-fan-area">
        <div class="card-fan-container" id="card-fan-container">
          ${fanCardsHTML}
        </div>
        <div class="fan-info-row">
          <span class="fan-remaining" id="fan-remaining">灵牌 · 剩 <strong>${remaining}</strong>/60 张</span>
          <span class="deck-hint" id="deck-hint">
            拖至「<strong>${nextBagua.name}</strong>」${nextBagua.symbol}
          </span>
        </div>
      </div>
    `;
  } else {
    fanAreaHTML = `
      <div class="card-fan-area" id="card-fan-area">
        <div class="card-fan-container shuffle-stage" id="card-fan-container">
          <div class="shuffle-deck" id="shuffle-deck">
            <div class="shuffle-card" style="--s:0;"></div>
            <div class="shuffle-card" style="--s:1;"></div>
            <div class="shuffle-card" style="--s:2;"></div>
            <div class="shuffle-card" style="--s:3;"></div>
          </div>
        </div>
        <div class="fan-info-row">
          <span class="fan-remaining">洗牌中…</span>
        </div>
      </div>
    `;
  }

  drawEl.innerHTML = `
    <div class="draw-container">
      <div class="draw-header">
        <div class="draw-title">玄机九宫</div>
        <div class="draw-subtitle">轻触灵牌 · 拖入九宫</div>
      </div>

      <div class="order-banner" id="order-banner">
        <span class="order-icon">☰</span>
        <span class="order-text">
          洛书次第 · 当前应填 <strong>${nextBagua.name}</strong>（${nextBagua.direction}方 · ${nextBagua.element}行）
        </span>
        <span class="order-icon">☷</span>
      </div>

      <div class="${jiugonggeClass}" id="jiugongge-draw" style="${jiugonggeStyle}">
        ${cellsHTML}
      </div>

      ${fanAreaHTML}

      <button class="btn-reset" id="btn-reset" style="display:none;">重新抽牌</button>
    </div>
  `;

  // 扇形布局 & 九宫格显隐
  if (AppState.showFan) {
    setTimeout(() => layoutFanCards(), 0);
    // 九宫格淡入
    setTimeout(() => {
      const jg = document.getElementById('jiugongge-draw');
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
  let html = '';
  for (let i = 0; i < AppState.cardPool.length; i++) {
    const drawn = AppState.drawnPoolIndices.has(i);
    const dragging = AppState.draggingCard && AppState.draggingCard.poolIndex === i;
    let cls = 'fan-card';
    if (drawn) cls += ' fan-card--drawn';
    if (dragging) cls += ' fan-card--dragging';
    const card = AppState.cardPool[i];
    html += `
      <div class="fan-card-wrap" id="fan-wrap-${i}">
        <div class="${cls}" id="fan-card-${i}" data-pool-index="${i}">
          <div class="fan-card-inner">
            <span class="fan-card-label">灵牌</span>
          </div>
        </div>
      </div>`;
  }
  return html;
}

/**
 * 根据容器实际尺寸计算扇形布局并应用到每张牌的 wrapper 上
 */
function layoutFanCards() {
  const container = document.getElementById('card-fan-container');
  if (!container) return;
  const cw = container.offsetWidth;
  const ch = container.offsetHeight;
  const layouts = computeFanLayout(cw, ch);

  for (let i = 0; i < AppState.cardPool.length; i++) {
    const wrapEl = document.getElementById('fan-wrap-' + i);
    if (!wrapEl) continue;
    // wrapper: translate 定位 + rotate 方向
    wrapEl.style.transform = `translate(${layouts[i].x}px, ${layouts[i].y}px) rotate(${layouts[i].rotation}deg)`;
    wrapEl.style.zIndex = layouts[i].zIndex;
  }
}

function bindDrawEvents() {
  const fanContainer = document.getElementById('card-fan-container');
  if (!fanContainer) return;

  // 牌扇：鼠标事件
  fanContainer.addEventListener('mousedown', onFanMouseDown);
  fanContainer.addEventListener('mousemove', onFanMouseMove);
  fanContainer.addEventListener('mouseleave', onFanMouseLeave);

  // 牌扇：触屏事件
  fanContainer.addEventListener('touchstart', onFanTouchStart, { passive: false });
  fanContainer.addEventListener('touchmove', onFanTouchMove, { passive: false });

  // 全局移动/释放事件（拖拽过程中）
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);

  // 重置按钮
  const resetBtn = $('#btn-reset');
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
  const dragEl = AppState.dragElement;
  let dragDisplay = '';
  if (dragEl) {
    dragDisplay = dragEl.style.display;
    dragEl.style.display = 'none';
  }
  const el = document.elementFromPoint(x, y);
  if (dragEl) dragEl.style.display = dragDisplay;

  if (el) {
    const fanCard = el.closest('.fan-card');
    if (fanCard) return fanCard;
  }
  // 备选：如果 elementFromPoint 找不到（可能因为 transform），遍历牌卡判断
  return null;
}

function onFanMouseMove(e) {
  // 如果正在拖拽，跳过 hover 处理
  if (AppState.isDragging) return;

  const card = getFanCardFromPoint(e.clientX, e.clientY);

  // 清除上一个 hover
  if (AppState.hoveredFanIndex !== null) {
    const prevEl = document.getElementById('fan-card-' + AppState.hoveredFanIndex);
    if (prevEl && prevEl !== card) {
      prevEl.classList.remove('fan-card--hover');
    }
    AppState.hoveredFanIndex = null;
  }

  if (card) {
    const idx = parseInt(card.dataset.poolIndex);
    if (!isNaN(idx) && !AppState.drawnPoolIndices.has(idx)) {
      card.classList.add('fan-card--hover');
      AppState.hoveredFanIndex = idx;
    }
  }
}

function onFanMouseLeave() {
  // 清除 hover 状态
  if (AppState.hoveredFanIndex !== null) {
    const prevEl = document.getElementById('fan-card-' + AppState.hoveredFanIndex);
    if (prevEl) prevEl.classList.remove('fan-card--hover');
    AppState.hoveredFanIndex = null;
  }
}

function onFanMouseDown(e) {
  e.preventDefault();
  if (AppState.drawCount >= AppState.maxDraw) return;

  const card = getFanCardFromPoint(e.clientX, e.clientY);
  if (!card) return;

  const poolIndex = parseInt(card.dataset.poolIndex);
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

  const t = e.touches[0];
  const card = getFanCardFromPoint(t.clientX, t.clientY);

  if (!card) return;

  const poolIndex = parseInt(card.dataset.poolIndex);
  if (isNaN(poolIndex) || AppState.drawnPoolIndices.has(poolIndex)) return;

  // 记录初始触摸位置
  AppState.touchStartX = t.clientX;
  AppState.touchStartY = t.clientY;
  AppState.touchStartCardIndex = poolIndex;

  // 清除之前的预览
  if (AppState.touchPreviewIndex !== null) {
    const prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
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
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
    return;
  }

  // 还没开始拖拽（手指在滑动预览），更新预览
  const t = e.touches[0];
  const card = getFanCardFromPoint(t.clientX, t.clientY);

  // 清除上一个预览
  if (AppState.touchPreviewIndex !== null) {
    const prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
    if (prevEl && prevEl !== card) {
      prevEl.classList.remove('fan-card--hover');
    }
    AppState.touchPreviewIndex = null;
  }

  if (card) {
    const idx = parseInt(card.dataset.poolIndex);
    if (!isNaN(idx) && !AppState.drawnPoolIndices.has(idx)) {
      card.classList.add('fan-card--hover');
      AppState.touchPreviewIndex = idx;
    }
  }
}

function onFanTouchEnd(e) {
  // 清除预览
  if (AppState.touchPreviewIndex !== null) {
    const prevEl = document.getElementById('fan-card-' + AppState.touchPreviewIndex);
    if (prevEl) prevEl.classList.remove('fan-card--hover');
    AppState.touchPreviewIndex = null;
  }
  AppState.touchStartCardIndex = null;
}

// ========== 拖拽逻辑：从扇形牌面取出 ==========

function startDragFromFan(x, y, poolIndex, type) {
  if (AppState.cardPool.length === 0) return;
  if (AppState.drawnPoolIndices.has(poolIndex)) return;

  const card = AppState.cardPool[poolIndex];

  // 创建拖拽跟随元素
  const dragEl = document.createElement('div');
  dragEl.className = 'drag-card';
  dragEl.innerHTML = `
    <div class="drag-card-inner">
      <div class="drag-card-name">?</div>
      <div class="drag-card-label">灵牌</div>
    </div>`;
  Object.assign(dragEl.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    zIndex: '1000',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
  });
  document.body.appendChild(dragEl);

  // 立刻把牌放到鼠标位置
  dragEl.style.left = x + 'px';
  dragEl.style.top = y + 'px';

  AppState.draggingCard = { card, element: dragEl, poolIndex: poolIndex };
  AppState.isDragging = true;

  // 标记原位为"正在被拖拽"（淡化但留空隙）
  const fanCardEl = document.getElementById('fan-card-' + poolIndex);
  if (fanCardEl) {
    fanCardEl.classList.add('fan-card--dragging');
  }

  // 高亮目标宫位
  const nextPos = AppState.drawCount + 1;
  const targetSlot = document.getElementById('slot-' + nextPos);
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
  const t = e.touches[0];
  moveDrag(t.clientX, t.clientY);
}

function moveDrag(x, y) {
  const el = AppState.draggingCard.element;
  // 牌居中跟随鼠标
  el.style.left = x + 'px';
  el.style.top = y + 'px';

  // 检测是否悬停在目标宫位上
  const nextPos = AppState.drawCount + 1;
  const targetSlot = $(`#slot-${nextPos}`);
  if (targetSlot) {
    const rect = targetSlot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const threshold = Math.min(rect.width, rect.height) * 0.45;
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
  const t = e.changedTouches[0];
  endDrag(t ? t.clientX : 0, t ? t.clientY : 0);
}

function endDrag(x, y) {
  const dragging = AppState.draggingCard;
  if (!dragging) return;

  const draggedPoolIndex = dragging.poolIndex;
  AppState.isDragging = false;
  AppState.draggingCard = null;

  // 移除拖拽元素
  if (dragging.element && dragging.element.parentNode) {
    dragging.element.remove();
  }

  // 移除牌扇上的 dragging 状态（保留空格）—— 放牌成功则标 drawn，放牌失败则恢复
  if (draggedPoolIndex != null) {
    const fanCardEl = document.getElementById('fan-card-' + draggedPoolIndex);
    if (fanCardEl) fanCardEl.classList.remove('fan-card--dragging');
  }

  // 清除所有高亮
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

  // 检测是否放入正确位置
  const nextPos = AppState.drawCount + 1;
  const targetSlot = document.getElementById('slot-' + nextPos);
  let snapped = false;
  if (targetSlot) {
    const rect = targetSlot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const threshold = Math.min(rect.width, rect.height) * 0.45;
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
  const card = AppState.cardPool[poolIndex];
  const bagua = BAGUA_MAP[pos];

  // 标记为已抽取
  AppState.drawnPoolIndices.add(poolIndex);
  AppState.drawnCards.push({ seq: pos, card, bagua });
  AppState.drawCount++;

  // 音效
  playSnapSound();

  // 扇形牌面：标记为 drawn
  const fanCardEl = document.getElementById('fan-card-' + poolIndex);
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
    setTimeout(() => {
      slotEl.classList.remove('empty', 'drag-over', 'snap-in');
      slotEl.classList.add('filled');
      slotEl.innerHTML = `
        <span class="slot-bagua-name">${bagua.name}</span>
        <span class="slot-symbol">${bagua.symbol}</span>
        <span class="slot-card-name">${card.name}</span>
        <span class="slot-element">${card.element}行</span>
      `;
    }, 200);
  }

  // Step 5.5: 弹出卡牌内容覆盖层 —— 等比例大卡
  showCardOverlay(card, bagua, pos);
}

function updateFanRemaining() {
  const remaining = AppState.cardPool.length - AppState.drawnPoolIndices.size;
  const remainEl = document.getElementById('fan-remaining');
  if (remainEl) {
    remainEl.innerHTML = '灵牌 · 剩 <strong>' + remaining + '</strong>/60 张';
  }
}

function showCardOverlay(card, bagua, pos) {
  // 移除旧覆盖层（如果有）
  const old = document.querySelector('.card-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = `
    <div class="card-overlay-bg"></div>
    <div class="card-overlay-card">
      <div class="card-overlay-pos">${bagua.name} ${bagua.symbol} · 第${pos}张</div>
      <div class="card-overlay-element">${card.element}行</div>
      <div class="card-overlay-name">${card.name}</div>
      <div class="card-overlay-divider"></div>
      <div class="card-overlay-gist">${card.fortune_gist}</div>
      <div class="card-overlay-hint">点击任意处继续</div>
    </div>`;

  // 点击任意处关闭
  overlay.addEventListener('click', (e) => {
    overlay.classList.add('overlay-fade-out');
    setTimeout(() => {
      overlay.remove();
      // 牌堆计数更新 + 检查是否满9张
      updateDeckCount();
      updateNextTargetHighlight();
      updateResetButton();
      if (AppState.drawCount >= AppState.maxDraw) {
        setTimeout(() => { completeDraw(); }, 800);
      }
    }, 250);
  });

  // 阻止卡牌本身点击冒泡
  overlay.querySelector('.card-overlay-card').addEventListener('click', (e) => {
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
    const hintEl = $('#deck-hint');
    if (hintEl) hintEl.innerHTML = '✨ 九宫已满 · 正在解读天机…';
    const banner = $('#order-banner');
    if (banner) banner.innerHTML = '<span class="order-icon">◎</span><span class="order-text">九宫已满</span><span class="order-icon">◎</span>';
    return;
  }

  const nextPos = AppState.drawCount + 1;
  // 清除旧的 next-target
  document.querySelectorAll('.grid-slot.next-target').forEach(el => {
    el.classList.remove('next-target');
  });

  // 设置新的 next-target
  const nextSlot = $(`#slot-${nextPos}`);
  if (nextSlot) {
    nextSlot.classList.add('next-target');
  }

  // 更新提示文字
  const nextBagua = BAGUA_MAP[nextPos];
  const hintEl = $('#deck-hint');
  if (hintEl && nextBagua) {
    hintEl.innerHTML = '拖至「<strong>' + nextBagua.name + '</strong>」' + nextBagua.symbol;
  }
  const banner = $('#order-banner');
  if (banner && nextBagua) {
    banner.innerHTML = `
      <span class="order-icon">☰</span>
      <span class="order-text">洛书次第 · 当前应填 <strong>${nextBagua.name}</strong>（${nextBagua.direction}方 · ${nextBagua.element}行）</span>
      <span class="order-icon">☷</span>`;
  }
}

function updateResetButton() {
  const btn = $('#btn-reset');
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
  setTimeout(() => {
    startFanSpread();
  }, 2000);
}

// ==================== 完成抽牌 → 解读 ====================

function completeDraw() {
  playCompleteSound();

  const drawResult = {
    draw_id: drawId(),
    timestamp: new Date().toLocaleString('zh-CN'),
    positions: AppState.drawnCards
  };

  const interpreted = interpretResult(drawResult);
  AppState.result = interpreted;
  renderResultPage();
  showScreen('result');
}

// ==================== 结果页 ====================

function renderResultPage() {
  const r = AppState.result;
  if (!r) return;

  const getScoreClass = (score) => {
    if (score >= 2) return 'ji';
    if (score <= -1) return 'xiong';
    return 'ping';
  };

  let html = `
    <div class="result-container">
      <div class="result-header">
        <div class="result-title">玄机九宫</div>
        <div class="result-overall">
          <div class="overall-score ${r.overall.level === '大吉' || r.overall.level === '吉' ? 'score-ji' : r.overall.level === '大凶' || r.overall.level === '凶' ? 'score-xiong' : 'score-ping'}">
            <div class="score-number">${r.overall.score}</div>
            <div class="score-label">运势</div>
          </div>
          <div class="overall-level ${r.overall.level === '大吉' || r.overall.level === '吉' ? 'text-ji' : r.overall.level === '大凶' || r.overall.level === '凶' ? 'text-xiong' : 'text-ping'}">${r.overall.level}</div>
        </div>
        <div class="result-stats">
          <span class="stat stat-ji">吉 ${r.overall.ji}</span>
          <span class="stat stat-ping">平 ${r.overall.ping}</span>
          <span class="stat stat-xiong">凶 ${r.overall.xiong}</span>
        </div>
      </div>

      <div class="jiugongge">
  `;

  const posMap = {};
  r.positions.forEach(p => { posMap[p.seq] = p; });

  for (const num of DISPLAY_ORDER) {
    const pos = posMap[num];
    if (!pos) continue;
    const sc = getScoreClass(pos.totalScore);
    html += `
      <div class="grid-cell ${sc}" ${pos.seq === 5 ? 'id="center-cell"' : ''}>
        <div class="cell-bagua-name">${pos.bagua.name}</div>
        <div class="cell-symbol">${pos.bagua.symbol}</div>
        <div class="cell-card-name">${pos.card.name}</div>
        <div class="cell-element">${pos.card.element} ${pos.elementRelation.relation}</div>
        <div class="cell-tag ${sc}">${pos.fortune}</div>
      </div>
    `;
  }

  html += `</div>`;

  if (r.interactions.combos.length > 0) {
    html += `<div class="combos-section"><div class="section-title">特殊天象</div>`;
    r.interactions.combos.forEach(c => {
      html += `<div class="combo-item"><span class="combo-name">【${c.name}】</span>${c.text}</div>`;
    });
    html += `</div>`;
  }

  if (r.interactions.balanceText) {
    html += `<div class="balance-section"><div class="section-title">五行提点</div><div class="balance-text">${r.interactions.balanceText}</div></div>`;
  }

  html += `<div class="positions-section"><div class="section-title">各宫详解</div>`;
  r.positions.forEach((pos, i) => {
    html += `
      <div class="position-card ${getScoreClass(pos.totalScore)}">
        <div class="pos-header">
          <span class="pos-num">${pos.seq}</span>
          <span class="pos-bagua-name">${pos.bagua.name} ${pos.bagua.symbol}</span>
          <span class="pos-fortune ${getScoreClass(pos.totalScore)}">${pos.fortune}</span>
        </div>
        <div class="pos-card-name">${pos.card.name}（${pos.card.element}行）— ${pos.elementRelation.relation}</div>
        <div class="pos-text">${pos.text.replace(/\n\n/g, '</p><p class="pos-text-p">')}</div>
      </div>
    `;
  });
  html += `</div>`;

  html += `
    <div class="summary-section">
      <div class="section-title">整体运势总结</div>
      <div class="summary-text">${r.overall.summary.replace(/\n\n/g, '<br><br>')}</div>
    </div>
    <div class="result-actions">
      <button class="btn-restart" id="btn-restart">再抽一次</button>
      <button class="btn-save" id="btn-save">保存结果图</button>
    </div>
  </div>
  `;

  resultEl.innerHTML = html;

  // 再抽一次
  const restartBtn = $('#btn-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
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

      setTimeout(() => {
        startFanSpread();
      }, 2000);
    });
  }

  // 保存结果图
  const saveBtn = $('#btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveResultImage();
    });
  }
}

// ==================== 保存结果图 ====================

async function saveResultImage() {
  const el = resultEl.querySelector('.result-container');
  if (!el) return;

  playNote(880, 0.15);
  try {
    // 动态加载 html2canvas
    if (typeof html2canvas === 'undefined') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // 短暂去掉滚动条、固定宽度供截图
    const origOverflow = el.style.overflow;
    const origMaxH = el.style.maxHeight;
    el.style.overflow = 'visible';
    el.style.maxHeight = 'none';

    const canvas = await html2canvas(el, {
      backgroundColor: '#0d0a1e',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    el.style.overflow = origOverflow;
    el.style.maxHeight = origMaxH;

    // 下载
    const link = document.createElement('a');
    link.download = `玄机九宫_${AppState.result.draw_id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    playNote(1100, 0.3);
  } catch (err) {
    console.error('截图失败:', err);
  }
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
  homeEl = $('#home-page');
  drawEl = $('#draw-page');
  resultEl = $('#result-page');

  initAudio();
  initHome();
  showScreen('home');

  document.body.addEventListener('click', () => {
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }
  }, { once: true });
});
