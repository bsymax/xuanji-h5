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

/**
 * 玄机九宫 - 解读引擎
 *
 * 四层解读架构：
 * L1: 单位置解读（牌 × 宫位）
 * L2: 五行互动分析
 * L3: 牌间特殊组合
 * L4: 整体运势评估
 */

// ==================== L1: 单位置解读 ====================

/**
 * 解读单个位置（一张牌落在某个宫位）
 */
function interpretPosition(card, bagua) {
  // 五行互动
  const elemRel = elementRelation(card.element, bagua.element);

  // 契合度计算
  const fitScore = calculateFit(card, bagua);

  // 综合吉凶评分 (五行分 + 契合分)
  const rawScore = elemRel.score + fitScore;
  let fortune = '平';
  let fortuneColor = '#e8d5a3';
  if (rawScore >= 2) {
    fortune = '吉';
    fortuneColor = '#5a9e6f';
  } else if (rawScore <= -1) {
    fortune = '凶';
    fortuneColor = '#d4534a';
  }

  // 生成解读文本
  const interpretation = generatePositionText(card, bagua, elemRel, fortune);

  return {
    seq: bagua.position,
    card: card,
    bagua: bagua,
    elementRelation: {
      cardElement: card.element,
      baguaElement: bagua.element,
      relation: elemRel.relation,
      score: elemRel.score
    },
    fitScore: fitScore,
    totalScore: rawScore,
    fortune: fortune,
    fortuneColor: fortuneColor,
    text: interpretation
  };
}

/**
 * 计算牌与宫位的契合度
 */
function calculateFit(card, bagua) {
  let matchCount = 0;
  for (const trait of card.traits) {
    for (const angle of bagua.angles) {
      if (angle.includes(trait) || trait.includes(angle.substring(0, 2))) {
        matchCount += 1;
      }
    }
  }
  if (matchCount >= 5) return 2;
  if (matchCount >= 3) return 1;
  if (matchCount >= 1) return 0;
  return -1;
}

/**
 * 生成单位置的解读文本
 */
function generatePositionText(card, bagua, elemRel, fortune) {
  const baguaName = bagua.name;
  const element = card.element;
  const baguaElement = bagua.element;
  const rel = elemRel.relation;

  // 段落1: 宫位卦象引入
  const introPool = [
    `此位为${baguaName}，${bagua.xiang}`,
    `${card.name}落于${baguaName}，${bagua.hexagram}卦主事。${bagua.xiang}`,
    `第${bagua.position}宫${baguaName}，${bagua.direction}方${baguaElement}位。${bagua.xiang}`
  ];
  const intro = introPool[bagua.position % introPool.length];

  // 段落2: 当前状态
  const angle = bagua.angles[bagua.position % bagua.angles.length];
  const statePool = [
    `${card.name}坐镇此宫，其${card.traits.slice(0, 2).join('、')}之特质，投射于${angle}之域，暗示当前阶段你在这方面正处在${fortune === '吉' ? '积极向上的发展期' : fortune === '凶' ? '需要审慎应对的考验期' : '稳定过渡的调整期'}。${card.description.personality}`,
    `从${baguaName}的能量来看，${card.name}的${element}行之气与宫位的${baguaElement}行形成了「${rel}」的互动格局。${card.description.personality}`,
    `${card.name}的性格底色——${card.traits[0]}——在此宫位中显现出独特的力量。结合${baguaName}所掌的${angle}之域，${card.description.personality}`
  ];
  const state = statePool[card.id % statePool.length];

  // 段落3: 关键忠告
  const advicePool = [
    `${card.name}于此位的启示是：${card.description.cultivation}`,
    `${baguaName}之象提示——${card.description.cultivation}`,
    `此宫位${fortune === '吉' ? '运势上扬' : fortune === '凶' ? '压力较大' : '运势平稳'}，谨记${card.name}的忠告：${card.description.cultivation}`
  ];
  const advice = advicePool[(card.id + bagua.position) % advicePool.length];

  // 段落4: 五行互动
  const elementText = generateElementText(element, baguaElement, rel);

  // 段落5: 吉凶总结
  const fortunePool = {
    '吉': ['此宫位天时地利与牌性相合，运势向上，宜顺势而为。', '吉星高照此宫，诸事有望顺利推进。', '此位得气运加持，当把握良机、积极进取。'],
    '平': ['此宫位运势平稳，守成待变，不急不躁方为上策。', '此位气运中和，无大起大落，宜稳扎稳打。', '平顺之势，不贪不惧，持中守正即可。'],
    '凶': ['此宫位承压较重，当以守为攻，避免轻举妄动。', '运势在此处遇阻，宜内省自修，静待时机。', '此位之气与牌性相冲，需格外审慎，莫强求。']
  };
  const fortuneText = fortunePool[fortune][bagua.position % 3];

  const parts = [intro, state, advice, elementText];
  parts.push(fortuneText);
  return parts.join('\n\n');
}

/**
 * 生成五行互动文本
 */
function generateElementText(cardElement, baguaElement, relation) {
  const pool = {
    '生': [
      `${cardElement}行牌入${baguaElement}行宫，${cardElement}生${baguaElement}，如春风化雨，牌气滋养宫位，运势顺势而升。`,
      `${cardElement}生${baguaElement}，牌之能量自然流向宫位，${cardElement}行之力主动助益${baguaElement}行，此消此长间，机遇在酝酿。`
    ],
    '被生': [
      `${cardElement}行牌入${baguaElement}行宫，${baguaElement}生${cardElement}，宫位之气反哺牌面，如大地滋养万物，根基稳固而有成长之力。`,
      `${baguaElement}生${cardElement}，宫位为牌提供滋养，${cardElement}行得外力加持，根基愈固，向上之力渐显。`
    ],
    '克': [
      `${cardElement}行牌入${baguaElement}行宫，${cardElement}克${baguaElement}，牌气克制宫位，虽能主导局势，但难免消耗自身，当注意节奏把控。`,
      `${cardElement}克${baguaElement}，牌在此宫有主导之力，但克制即消耗，${cardElement}行之气不可久持，需张弛有度。`
    ],
    '被克': [
      `${cardElement}行牌入${baguaElement}行宫，${baguaElement}克${cardElement}，宫位压制牌气，此位承压，${cardElement}行之优势难以施展，以守为进。`,
      `${baguaElement}克${cardElement}，宫位之气凌驾牌面之上，${cardElement}行受制，当前不宜强求，退一步海阔天空。`
    ],
    '中和': [
      `${cardElement}行牌入${baguaElement}行宫，五行相同则气场相合，${cardElement}气与宫位浑然一体，运势平稳顺畅。`,
      `${cardElement}与${baguaElement}同气连枝，此位能量纯粹，牌面特质得以最本真地展现。`
    ]
  };
  const options = pool[relation] || pool['中和'];
  return options[Math.floor(Math.random() * options.length)];
}

// ==================== L2+L3: 五行互动 + 牌间互动 ====================

/**
 * 分析9个位置之间的五行分布和牌间特殊组合
 */
function analyzeInteractions(positions) {
  // 五行分布统计
  const elementCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  positions.forEach(p => {
    elementCount[p.card.element]++;
  });

  // 检测特殊组合
  const combos = detectCombos(elementCount, positions);

  // 五行平衡分析
  const balanceText = analyzeElementBalance(elementCount);

  return {
    elementCount: elementCount,
    combos: combos,
    balanceText: balanceText
  };
}

/**
 * 检测牌间特殊组合
 */
function detectCombos(elementCount, positions) {
  const combos = [];

  if (elementCount['金'] >= 3) combos.push({ name: '三金聚气', text: '金气汇聚，决断之力旺盛。金多则刚，当心刚极易折、言辞如刃伤及亲近之人。宜以水泄金气，多一份柔和与变通。' });
  if (elementCount['木'] >= 3) combos.push({ name: '三木成林', text: '木德昌隆，生机勃发之势。木多则繁，宜把握当前发展良机，然当注意不可蔓枝太多分散精力，聚焦核心方向方能参天。' });
  if (elementCount['水'] >= 3) combos.push({ name: '三水归源', text: '水性至深，智慧暗涌之象。水多则寒，静水流深自有回响，然当防思虑过重、行动迟疑。宜借土制水，多一分行动力。' });
  if (elementCount['火'] >= 3) combos.push({ name: '三火燎原', text: '火德炽盛，热情行动之期。火多则燥，当防急躁冒进、言行失度。宜以水制火，遇事冷静三思而后行。' });
  if (elementCount['土'] >= 3) combos.push({ name: '三土载物', text: '土德厚重，稳中求进之势。土多则滞，根基牢固可图长远，然当心过于保守错失良机，宜借木疏土，增添几分开拓锐气。' });

  const allFive = ['金', '木', '水', '火', '土'].every(e => elementCount[e] >= 1);
  if (allFive) combos.push({ name: '五行俱全', text: '五行俱全，气运流转圆融无碍。此局极为罕见，金木水火土各安其位，诸事得中和之力，是大吉之象。当前人生诸领域能量均衡，正是全面发展的好时机。' });

  const centerPos = positions[4];
  if (centerPos && centerPos.fortune === '吉') {
    combos.push({ name: '中宫得吉', text: '中宫得吉星坐镇，全局运势昂扬向上。中宫为九宫之枢，此位吉祥则四方之气皆得调和，当前所谋之事有核心力量支撑。' });
  } else if (centerPos && centerPos.fortune === '凶') {
    combos.push({ name: '中宫受困', text: '中宫受困，全局运势承压。中宫为九宫之核，此处气运不畅则四方受影响。当前宜稳守待时，不宜贸然做重大决定，以静制动为上策。' });
  }

  return combos;
}

/**
 * 五行平衡分析
 */
function analyzeElementBalance(elementCount) {
  const maxCount = Math.max(...Object.values(elementCount));
  const minCount = Math.min(...Object.values(elementCount));
  const maxElement = Object.keys(elementCount).find(k => elementCount[k] === maxCount);
  const minElement = Object.keys(elementCount).find(k => elementCount[k] === minCount);

  if (maxCount >= 4) {
    const deficiencyText = minCount === 0
      ? `且${minElement}行完全缺失，气场有所偏颇`
      : `且${minElement}行偏弱(${minCount}张)，气场略有失衡`;
    return `五行分布中${maxElement}行过旺(${maxCount}张)，${deficiencyText}。${maxElement}盛则相关领域需多加关注。`;
  }

  if (minCount === 0) {
    return `五行之中${minElement}行缺失，${minElement}行相关的运势领域可能出现空白或阻力，可以有意在这些方面加以关注和弥补。`;
  }

  return '';
}

// ==================== L4: 整体运势评估 ====================

/**
 * 计算整体运势评分（百分制）
 */
function calculateOverallScore(positions, interactions) {
  let totalScore = 0;
  positions.forEach(p => { totalScore += p.totalScore; });
  const avgScore = totalScore / 9;

  let normalized = ((avgScore + 3) / 6) * 100;
  normalized = Math.max(0, Math.min(100, normalized));

  if (interactions.combos.some(c => c.name === '五行俱全')) normalized = Math.min(100, normalized + 10);
  if (interactions.combos.some(c => c.name === '中宫得吉')) normalized = Math.min(100, normalized + 8);
  if (interactions.combos.some(c => c.name === '中宫受困')) normalized = Math.max(0, normalized - 10);

  return Math.round(normalized);
}

/**
 * 生成整体运势总结
 */
function generateSummary(positions, interactions, overallScore) {
  const ji = positions.filter(p => p.fortune === '吉').length;
  const ping = positions.filter(p => p.fortune === '平').length;
  const xiong = positions.filter(p => p.fortune === '凶').length;

  let level = '';
  if (overallScore >= 80) level = '大吉';
  else if (overallScore >= 65) level = '吉';
  else if (overallScore >= 45) level = '平';
  else if (overallScore >= 30) level = '凶';
  else level = '大凶';

  let summary = `此局九宫之中，吉位${ji}处，平位${ping}处，凶位${xiong}处。整体运势评级：${level}（${overallScore}分）。`;

  const sorted = [...positions].sort((a, b) => b.totalScore - a.totalScore);
  const best = sorted[0];
  const worst = sorted[8];

  summary += `\n\n最佳宫位为${best.bagua.name}（${best.card.name}坐镇），${best.fortune}气最旺，是你的优势领域。`;
  if (worst.fortune === '凶') {
    summary += `\n\n需重点关注${worst.bagua.name}（${worst.card.name}坐镇），此处运势承压，${worst.bagua.angles[0]}方面宜谨慎行事。`;
  }

  if (interactions.combos.length > 0) {
    summary += '\n\n特殊天象：';
    interactions.combos.forEach(c => {
      summary += `\n【${c.name}】${c.text}`;
    });
  }

  if (interactions.balanceText) {
    summary += `\n\n五行提点：${interactions.balanceText}`;
  }

  summary += `\n\n——玄机九宫 · ${new Date().toLocaleDateString('zh-CN')}——`;

  return summary;
}

// ==================== 主导出函数 ====================

/**
 * 完整解读一次占卜结果
 */
function interpretResult(drawResult) {
  // L1: 逐位置解读
  const interpretedPositions = drawResult.positions.map(pos => {
    return interpretPosition(pos.card, pos.bagua);
  });

  // L2+L3: 五行互动 + 牌间组合
  const interactions = analyzeInteractions(interpretedPositions);

  // L4: 整体运势
  const overallScore = calculateOverallScore(interpretedPositions, interactions);
  const summary = generateSummary(interpretedPositions, interactions, overallScore);

  return {
    draw_id: drawResult.draw_id,
    timestamp: drawResult.timestamp,
    positions: interpretedPositions,
    interactions: interactions,
    overall: {
      score: overallScore,
      level: overallScore >= 80 ? '大吉' : overallScore >= 65 ? '吉' : overallScore >= 45 ? '平' : overallScore >= 30 ? '凶' : '大凶',
      ji: interpretedPositions.filter(p => p.fortune === '吉').length,
      ping: interpretedPositions.filter(p => p.fortune === '平').length,
      xiong: interpretedPositions.filter(p => p.fortune === '凶').length,
      summary: summary
    }
  };
}
