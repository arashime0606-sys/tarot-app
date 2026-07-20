import { useState, useEffect } from "react";
import { Sparkles, Flame, Droplet, Swords, Coins, RotateCcw, Shuffle, Copy, Check, Star } from "lucide-react";

/* ---------- 大アルカナ（22枚） ---------- */
const MAJOR_NAME = [
  "愚者", "魔術師", "女教皇", "女帝", "皇帝", "教皇", "恋人たち", "戦車", "力", "隠者",
  "運命の輪", "正義", "吊られた男", "死神", "節制", "悪魔", "塔", "星", "月", "太陽", "審判", "世界",
];
const MAJOR_ROMAN = [
  "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
  "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI",
];
const MAJOR_UP = [
  "冒険心・可能性", "知性・はじまり", "洞察力・直感力",
  "母性・豊かさ", "リーダーシップ・プライド", "社交性・誠実",
  "共感・安心", "野望・克服", "信念・忍耐",
  "内観・思慮深い", "好転・チャンス到来", "正当性・バランス",
  "忍耐・献身的", "方向転換・運命", "平和的解決・柔軟性",
  "本能・快楽主義", "浄化・葛藤", "可能性・才能",
  "見えない敵・用心", "成果・解決", "意識改革・復活", "統合・最高地点への到達",
];
const MAJOR_REV = [
  "空回り・怠ける", "優柔不断・無計画", "情緒不安定・偏見",
  "不仲・欠如", "強引・空回り", "不道徳・無慈悲",
  "違和感・気まぐれ", "空回り・独りよがり", "挫ける・依存",
  "闇雲さ・閉じこもる", "翻弄・悪いタイミング", "不正・矛盾",
  "不自由・間違った視点", "思いきれない・堂々巡り", "事なかれ主義・節度がない",
  "解放・断ち切る", "混乱・ショックな気持ち", "停滞・期待はずれ",
  "徐々に好転・次第に落ち着く", "立場を失う・トラブル", "混乱・後悔", "不完全燃焼・行き詰り",
];

/* ---------- 小アルカナ ランク名（14） ---------- */
const RANK_LABEL = ["エース", "2", "3", "4", "5", "6", "7", "8", "9", "10", "従者", "騎士", "女王", "王"];
const RANK_CORNER = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "P", "N", "Q", "K"];

/* ---------- 棒（火） ---------- */
const WANDS_UP = [
  "新しい挑戦・情熱の芽生え・ひらめき", "計画と選択・将来への展望・支配力", "拡大・前進・チームでの成果",
  "安定した喜び・祝祭・帰属", "競争・意見の衝突・切磋琢磨", "勝利・承認・自信の回復",
  "防衛・優位を守る・粘り強さ", "急速な進展・スピード・吉報", "粘り強さ・最後の踏ん張り・回復力",
  "重い責任・やり遂げる重圧・負担", "探求心・新しい情熱の発見・好奇心", "大胆な行動・冒険・勢いある前進",
  "自信・温かいカリスマ・自立した行動力", "リーダーシップ・ビジョンの実現・大胆な統率",
];
const WANDS_REV = [
  "出だしの遅れ・エネルギー切れ・計画の停滞", "迷い・優柔不断・視野の狭さ", "遅延・連携の乱れ・見通しの誤り",
  "不安定な基盤・調和の乱れ・孤立感", "不毛な争い・対立の悪化・協調の欠如", "評価されない努力・傲慢・敗北感",
  "圧倒される・防戦一方・限界", "遅延・空回り・性急さによる失敗", "燃え尽き・頑固さ・あきらめ",
  "重荷からの解放・限界・責任放棄", "計画性のない行動・気まぐれ・空回り", "性急さ・無謀・衝動的な決断",
  "嫉妬・気まぐれ・自信の揺らぎ", "横暴・無謀な決断・権威の濫用",
];

/* ---------- 聖杯（水） ---------- */
const CUPS_UP = [
  "新しい愛・感情の充実・直感の開花", "心の結びつき・相互理解・パートナーシップ", "友情・祝福・喜びの共有",
  "内省・無関心・退屈からの停滞", "後悔・失望・心の痛み", "懐かしさ・無邪気な思い出・再会",
  "選択肢の多さ・夢想・幻想", "探求のための別れ・新たな道への旅立ち", "満足・願いの実現・心の充足",
  "幸福な家庭・心の調和・満たされた関係", "感受性豊かな知らせ・純粋な好奇心", "ロマンス・感情に従う行動・優美な提案",
  "深い直感・優しさ・感情の成熟", "感情の統制・寛容なリーダーシップ・成熟した愛",
];
const CUPS_REV = [
  "感情の抑圧・愛の停滞・空虚感", "すれ違い・不均衡な関係・誤解", "過度な享楽・三角関係・孤立",
  "新たな関心の発見・停滞からの脱却", "過去を乗り越える・再生への気づき", "過去への執着・現実逃避",
  "現実との対峙・選択の明確化", "未練・現状への停滞", "表面的な満足・過剰な自己満足",
  "不和・理想と現実のずれ", "過敏な感情・現実離れした夢想", "移り気・感情に流される・空約束",
  "過度な感受性・自己犠牲・情緒不安定", "感情の操作・気分のむら・冷淡さ",
];

/* ---------- 剣（風） ---------- */
const SWORDS_UP = [
  "明晰な思考・真実の発見・突破口", "葛藤・決断の保留・均衡した緊張", "心の痛み・裏切り・悲しみ",
  "休息・思考の整理・一時的撤退", "勝利のための犠牲・対立・自己中心的な勝ち", "困難からの脱出・移行・前進",
  "戦略・抜け目のなさ・隠れた行動", "制約・自己束縛・行き詰まり感", "不安・悪夢・思考の堂々巡り",
  "苦難の終わり・どん底からの再起点", "鋭い観察力・新しい情報・警戒心", "迅速な行動・決断力・直進する意志",
  "明晰な判断・独立心・率直さ", "知的権威・公正な判断・論理的統率",
];
const SWORDS_REV = [
  "混乱・誤った判断・破壊的な言葉", "情報過多による麻痺・優柔不断", "痛みからの回復・古傷の浄化",
  "焦りからの再起動・休息の不足", "和解・無益な争いの終結", "未解決の問題・足踏み",
  "露見・自己欺瞞からの反省", "束縛からの解放・視野の広がり", "不安の解消・希望の光",
  "再生の始まり・過度な悲観の終息", "誤情報・詮索・軽率な発言", "衝動的・攻撃的・配慮の欠如",
  "冷酷さ・批判的・孤独感", "権威の濫用・冷徹な支配",
];

/* ---------- 貨幣（地） ---------- */
const PENT_UP = [
  "新しい好機・物質的な始まり・実りの種", "やりくり・優先順位の調整・柔軟性", "協力・職人技・着実な積み重ね",
  "安定・保守・所有への執着", "経済的困難・孤立感・試練", "分かち合い・寛容さ・互恵関係",
  "投資・地道な努力・将来への評価", "技術の習得・勤勉・着実な前進", "自立した豊かさ・洗練・成果の享受",
  "繁栄・家族の安定・継承される豊かさ", "学びへの意欲・現実的な好奇心・新しい計画", "着実な努力・忍耐強い前進・責任感",
  "実務的な豊かさ・現実的な優しさ・安定した養育", "物質的成功・現実的な統率・安定した繁栄",
];
const PENT_REV = [
  "好機の逸失・計画の遅れ・準備不足", "バランスの崩れ・管理不足・浪費", "連携不足・質の低下・評価の不一致",
  "過度なしがみつき・物欲・ケチ", "困難からの回復・支援の発見", "不公平な分配・見返りを求める施し",
  "努力の停滞・見通しの誤り", "雑な仕事・モチベーションの低下", "過度な物質主義・孤独な成功",
  "財産争い・基盤の崩れ", "計画性の欠如・現実逃避", "停滞・頑固さ・進歩のなさ",
  "過保護・物質への偏重・自己犠牲", "権威への執着・物欲・頑固な保守",
];

const SUITS = [
  { key: "wands", label: "棒", element: "火", accent: "var(--wand)", Icon: Flame, up: WANDS_UP, rev: WANDS_REV },
  { key: "cups", label: "聖杯", element: "水", accent: "var(--cup)", Icon: Droplet, up: CUPS_UP, rev: CUPS_REV },
  { key: "swords", label: "剣", element: "風", accent: "var(--sword)", Icon: Swords, up: SWORDS_UP, rev: SWORDS_REV },
  { key: "pentacles", label: "貨幣", element: "地", accent: "var(--pentacle)", Icon: Coins, up: PENT_UP, rev: PENT_REV },
];

function buildMajorList() {
  return MAJOR_NAME.map((name, i) => ({
    id: `major-${i}`,
    name,
    corner: MAJOR_ROMAN[i],
    sub: "大アルカナ",
    up: MAJOR_UP[i],
    rev: MAJOR_REV[i],
  }));
}

function buildMinorList() {
  const list = [];
  SUITS.forEach((suit) => {
    RANK_LABEL.forEach((rank, i) => {
      list.push({
        id: `${suit.key}-${i}`,
        name: `${suit.label}の${rank}`,
        corner: RANK_CORNER[i],
        sub: `小アルカナ・${suit.label}（${suit.element}）`,
        accent: suit.accent,
        Icon: suit.Icon,
        up: suit.up[i],
        rev: suit.rev[i],
      });
    });
  });
  return list;
}

const MAJOR_LIST = buildMajorList(); // 22枚
const MINOR_LIST = buildMinorList(); // 56枚

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool(list) {
  // シャッフルした時点で各カードの正位置・逆位置を確定させる（後から決め直さない）
  return shuffle(list).map((c) => ({
    ...c,
    rot: (Math.random() * 8 - 4).toFixed(1),
    reversed: Math.random() < 0.5,
  }));
}

const POSITION_LABELS = ["過去", "現在", "未来"];
const PHASE_ORDER = ["idle", "major-spread", "major-resolving", "minor-spread", "minor-resolving", "minor-revealed", "major-revealed"];

function fallbackMinorReading(results) {
  return results
    .map((r, i) => {
      const o = r.reversed ? "逆位置" : "正位置";
      const kw = r.reversed ? r.card.rev : r.card.up;
      return `${POSITION_LABELS[i]}は「${r.card.name}」（${o}）。${kw}という流れが見えます。`;
    })
    .join("");
}
function fallbackMajorReading(major) {
  const o = major.reversed ? "逆位置" : "正位置";
  const kw = major.reversed ? major.card.rev : major.card.up;
  return `テーマカードは「${major.card.name}」（${o}）。${kw}が、これまでの3つの出来事を貫く大きな意味として浮かび上がります。`;
}

function buildMinorPrompt(results, question, userName) {
  const cardLines = results
    .map((r, i) => {
      const o = r.reversed ? "逆位置" : "正位置";
      const kw = r.reversed ? r.card.rev : r.card.up;
      return `【${POSITION_LABELS[i]}】「${r.card.name}」（${o}）\n  スート: ${r.card.sub}\n  キーワード: ${kw}`;
    })
    .join("\n\n");
  const questionLine = question
    ? `相談者が占ってほしいことは「${question}」です。この文脈で各カードを解釈してください。\n\n`
    : "";
  const nameLine = userName ? `相談者の名前は「${userName}」さんです。鑑定文の冒頭で一度だけ自然に名前で呼びかけてください。\n\n` : "";
  return `あなたは経験豊かなタロット占い師です。${nameLine}${questionLine}相談者が引いた3枚の小アルカナを読み解いてください。

${cardLines}

【厳守事項】
- 「過去」「現在」「未来」の3枚それぞれについて、必ずカード名とそのカード固有の意味に具体的に言及すること。「○○のカードは〜を示しています」という形で各カードを個別に取り上げること。
- 「努力が実る」「心のままに進む」のような、どのカードにも当てはまる一般論・精神論で3枚をまとめて処理しないこと。
- 各カードのスートとキーワードから読み取れる具体的な状況や傾向を述べること。
- 日本語の地の文のみ。見出し・マークダウン記号・箇条書き不使用。
- 250字程度、占い師として相談者に語りかける口調。
- 最後の一文で「この3枚の奥にある大きなテーマがまだ隠れている」とほのめかし、続きへの期待を持たせること。`;
}

function buildMajorPrompt(major, results, reading1, question) {
  const minorSummary = results
    .map((r, i) => `${POSITION_LABELS[i]}:「${r.card.name}」(${r.reversed ? "逆位置" : "正位置"})`)
    .join("、");
  const o = major.reversed ? "逆位置" : "正位置";
  const kw = major.reversed ? major.card.rev : major.card.up;
  const questionLine = question ? `相談者が占ってほしいことは「${question}」です。これを踏まえて結論をまとめてください。\n\n` : "";
  return `あなたはタロット占い師です。${questionLine}相談者はまず大アルカナを1枚伏せたまま選び、その後に小アルカナ3枚（${minorSummary}）を引いて鑑定を受けました。そのときの鑑定文は次の通りです：「${reading1}」\n\nそして今、伏せていたテーマカードが開かれました。\n\nテーマカード: 「${major.card.name}」（${o}） キーワード: ${kw}\n\n条件:\n- 日本語の地の文のみ。見出しやマークダウン記号、箇条書きは使わない。\n- 150字程度で、占い師としての締めくくりの結論を語る。\n- このテーマカードが、先の3枚の出来事すべてを貫く大きな意味としてどう響くかを伝える。\n- 押しつけがましくなく、相談者を励ますニュアンスで終える。`;
}

async function callClaude(prompt) {
  try {
    const response = await fetch("/api/fortune", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    if (!data.text) throw new Error("empty response");
    return data.text;
  } catch (error) {
    console.error("callClaude failed:", error);
    throw error;
  }
}

function buildCopyText(majorCard, minorResults, reading1, reading2, stats, question) {
  const lines = [];
  lines.push("【タロット占いの結果】");
  lines.push("");
  if (question) {
    lines.push(`占ってほしいこと: ${question}`);
    lines.push("");
  }
  lines.push(`テーマカード（大アルカナ）: ${majorCard.card.name}（${majorCard.reversed ? "逆位置" : "正位置"}）`);
  lines.push(`キーワード: ${majorCard.reversed ? majorCard.card.rev : majorCard.card.up}`);
  lines.push("");
  lines.push("直近の出来事（小アルカナ3枚）:");
  minorResults.forEach((r, i) => {
    const o = r.reversed ? "逆位置" : "正位置";
    const kw = r.reversed ? r.card.rev : r.card.up;
    lines.push(`・${POSITION_LABELS[i]}: ${r.card.name}（${o}） - ${kw}`);
  });
  lines.push("");
  lines.push("今回の運勢（6個満点・0.5刻み）:");
  STAT_CATEGORIES.forEach((cat, i) => {
    lines.push(`・${cat.label}: ${stats[i]} / 6`);
  });
  lines.push("");
  lines.push("【AIによる鑑定（小アルカナ3枚について）】");
  lines.push(reading1 || "（未生成）");
  lines.push("");
  lines.push("【結論（テーマカード開封後）】");
  lines.push(reading2 || "（未生成）");
  lines.push("");
  lines.push("上記のタロット占いの結果について、伝統的なタロットの解釈も踏まえて、さらに詳しく占ってください。");
  return lines.join("\n");
}

// スコア順序: [人運, 金運, 感情, 気力, 仕事, 変化, 行動, 加護]
// 元素対応: 火=行動・気力 / 風=変化・人運 / 水=加護・感情 / 地=仕事・金運
const STAT_CATEGORIES = [
  { key: "people",     label: "人運", element: "風" },
  { key: "money",      label: "金運", element: "地" },
  { key: "emotion",    label: "感情", element: "水" },
  { key: "energy",     label: "気力", element: "火" },
  { key: "work",       label: "仕事", element: "地" },
  { key: "change",     label: "変化", element: "風" },
  { key: "action",     label: "行動", element: "火" },
  { key: "blessing",   label: "加護", element: "水" },
];

//                          人運  金運  感情  気力  仕事  変化  行動  加護
const STAT_WEIGHTS = {
  // 小アルカナ（スート × 元素）
  wands:      [0.3,  0.1,  0.2,  1.0,  0.5,  0.6,  1.0,  0.1],  // 火
  cups:       [0.7,  0.1,  1.0,  0.2,  0.2,  0.3,  0.1,  0.9],  // 水
  swords:     [0.9,  0.2,  0.5,  0.5,  0.5,  0.9,  0.4,  0.2],  // 風
  pentacles:  [0.3,  1.0,  0.1,  0.4,  0.9,  0.1,  0.3,  0.4],  // 地

  // 大アルカナ（22枚個別）
  // 0愚者: 正=冒険心・可能性 / 逆=空回り・怠ける → 行動・変化が核、金運は低め
  major_0:   [0.3,  0.2,  0.3,  0.6,  0.2,  0.8,  0.8,  0.3],  // 計3.5
  // 1魔術師: 正=知性・はじまり / 逆=優柔不断・無計画 → 仕事・行動・気力
  major_1:   [0.4,  0.5,  0.3,  0.6,  0.8,  0.4,  0.8,  0.3],  // 計4.1
  // 2女教皇: 正=洞察力・直感力 / 逆=情緒不安定・偏見 → 感情・加護・人運
  major_2:   [0.5,  0.2,  0.8,  0.2,  0.2,  0.4,  0.2,  0.8],  // 計3.3
  // 3女帝: 正=母性・豊かさ / 逆=不仲・欠如 → 人運・感情・金運・加護
  major_3:   [0.8,  0.6,  0.7,  0.3,  0.3,  0.3,  0.3,  0.7],  // 計4.0
  // 4皇帝: 正=リーダーシップ・プライド / 逆=強引・空回り → 仕事・行動・金運
  major_4:   [0.5,  0.7,  0.2,  0.5,  0.8,  0.3,  0.8,  0.3],  // 計4.1
  // 5法王: 正=社交性・誠実 / 逆=不道徳・無慈悲 → 人運・加護・仕事
  major_5:   [0.8,  0.3,  0.4,  0.3,  0.6,  0.3,  0.2,  0.7],  // 計3.6
  // 6恋人たち: 正=共感・安心 / 逆=違和感・気まぐれ → 人運・感情・加護
  major_6:   [0.8,  0.2,  0.8,  0.3,  0.2,  0.3,  0.3,  0.7],  // 計3.6
  // 7戦車: 正=野望・克服 / 逆=空回り・独りよがり → 行動・気力・変化
  major_7:   [0.3,  0.4,  0.2,  0.8,  0.6,  0.5,  0.8,  0.3],  // 計3.9
  // 8力: 正=信念・忍耐 / 逆=挫ける・依存 → 気力・行動・感情
  major_8:   [0.5,  0.3,  0.6,  0.8,  0.4,  0.3,  0.7,  0.5],  // 計4.1
  // 9隠者: 正=内観・思慮深い / 逆=闇雲さ・閉じこもる → 感情・加護（静的）
  major_9:   [0.3,  0.3,  0.7,  0.3,  0.4,  0.3,  0.2,  0.7],  // 計3.2
  // 10運命の輪: 正=好転・チャンス到来 / 逆=翻弄・悪いタイミング → 変化・金運・気力
  major_10:  [0.5,  0.6,  0.4,  0.5,  0.5,  0.8,  0.4,  0.5],  // 計4.2
  // 11正義: 正=正当性・バランス / 逆=不正・矛盾 → 仕事・人運・加護
  major_11:  [0.6,  0.5,  0.4,  0.3,  0.8,  0.3,  0.4,  0.7],  // 計4.0
  // 12吊された男: 正=忍耐・献身的 / 逆=不自由・間違った視点 → 加護・変化、行動低め
  major_12:  [0.3,  0.3,  0.5,  0.2,  0.3,  0.7,  0.2,  0.7],  // 計3.2
  // 13死神: 正=方向転換・運命 / 逆=思いきれない・堂々巡り → 変化・感情
  major_13:  [0.2,  0.3,  0.6,  0.3,  0.3,  0.8,  0.4,  0.3],  // 計3.2
  // 14節制: 正=平和的解決・柔軟性 / 逆=事なかれ主義・節度がない → 感情・加護・変化
  major_14:  [0.5,  0.4,  0.7,  0.4,  0.4,  0.5,  0.3,  0.7],  // 計3.9
  // 15悪魔: 正=本能・快楽主義 / 逆=解放・断ち切る → 逆が前向きなので変化・行動も担保
  major_15:  [0.3,  0.7,  0.3,  0.5,  0.4,  0.5,  0.5,  0.2],  // 計3.4
  // 16塔: 正=浄化・葛藤 / 逆=混乱・ショックな気持ち → 変化・行動、加護は低め
  major_16:  [0.2,  0.3,  0.5,  0.3,  0.2,  0.8,  0.6,  0.2],  // 計3.1
  // 17星: 正=可能性・才能 / 逆=停滞・期待はずれ → 感情・加護・変化
  major_17:  [0.5,  0.4,  0.8,  0.4,  0.3,  0.5,  0.3,  0.8],  // 計4.0
  // 18月: 正=見えない敵・用心 / 逆=徐々に好転・次第に落ち着く → 感情高め、逆は加護回復方向
  major_18:  [0.3,  0.2,  0.8,  0.3,  0.2,  0.6,  0.2,  0.6],  // 計3.2
  // 19太陽: 正=成果・解決 / 逆=立場を失う・トラブル → 気力・行動・仕事・感情
  major_19:  [0.6,  0.5,  0.7,  0.8,  0.6,  0.4,  0.7,  0.5],  // 計4.8
  // 20審判: 正=意識改革・復活 / 逆=混乱・後悔 → 変化・感情・行動
  major_20:  [0.5,  0.4,  0.7,  0.5,  0.5,  0.8,  0.6,  0.4],  // 計4.4
  // 21世界: 正=統合・最高地点 / 逆=不完全燃焼・行き詰り → 全分野充実
  major_21:  [0.6,  0.7,  0.6,  0.6,  0.7,  0.5,  0.6,  0.6],  // 計4.9
};

function suitKeyOf(card) {
  const base = card.id.split("-")[0];
  // 大アルカナは "major-N" → "major_N" でカード固有ウェイトを引く
  if (base === "major") return "major_" + card.id.split("-")[1];
  return base;
}

// カテゴリ番号: 人運=0 金運=1 感情=2 気力=3 仕事=4 変化=5 行動=6 加護=7
// 元素: 火=行動(6)・気力(3) / 風=変化(5)・人運(0) / 水=加護(7)・感情(2) / 地=仕事(4)・金運(1)
//
// 各カードの強制分野定義:
//   upMax   = 正位置で必ず★6になる分野インデックスの配列
//   upMin   = 正位置でも必ず★1になる分野（悪魔・死神・塔のみ）
//   revMax  = 逆位置で必ず★6になる分野
//   revMin  = 逆位置で必ず★1になる分野
//
// 16枚（標準）: upMax×1, upMin×0, revMax×1(=upMax), revMin×1  ← 全8分野に均等2枚ずつ
// 悪魔・死神・塔: upMax×2, upMin×2, revMax×1, revMin×2        ← 極端
// 女帝・太陽・世界: upMax×2, upMin×0, revMax×2(=upMax), revMin×1 ← 良い

const CARD_FORCE = [
  /* 0  愚者    行動★(風冒険→地の仕事が逆で停滞)*/ { upMax:[6],   upMin:[],   revMax:[6],   revMin:[4]   },
  /* 1  魔術師  仕事★(地の技術→水の感情が逆で乱れ)*/ { upMax:[4],   upMin:[],   revMax:[4],   revMin:[2]   },
  /* 2  女教皇  加護★(水の直感→風の変化が逆で偏見)*/ { upMax:[7],   upMin:[],   revMax:[7],   revMin:[5]   },
  /* 3  女帝    人運+感情★(風+水の豊かさ→地の金運が逆で欠如)*/ { upMax:[0,2], upMin:[],   revMax:[0,2], revMin:[1]   },
  /* 4  皇帝    金運★(地の財力→風の変化が逆で空回り)*/ { upMax:[1],   upMin:[],   revMax:[1],   revMin:[5]   },
  /* 5  法王    人運★(風の社交→水の加護が逆で失う)*/ { upMax:[0],   upMin:[],   revMax:[0],   revMin:[7]   },
  /* 6  恋人たち 感情★(水の共感→風の人運が逆で気まぐれ)*/ { upMax:[2],   upMin:[],   revMax:[2],   revMin:[0]   },
  /* 7  戦車    行動★(火の克服→地の金運が逆で消耗)*/ { upMax:[6],   upMin:[],   revMax:[6],   revMin:[1]   },
  /* 8  力      気力★(火の忍耐→水の加護が逆で依存)*/ { upMax:[3],   upMin:[],   revMax:[3],   revMin:[7]   },
  /* 9  隠者    金運★(地の保全→火の行動が逆で閉じこもる)*/ { upMax:[1],   upMin:[],   revMax:[1],   revMin:[6]   },
  /* 10 運命の輪 変化★(風の転機→地の仕事が逆で停滞)*/ { upMax:[5],   upMin:[],   revMax:[5],   revMin:[4]   },
  /* 11 正義    人運★(風の公正→水の感情が逆で不正)*/ { upMax:[0],   upMin:[],   revMax:[0],   revMin:[2]   },
  /* 12 吊された男 仕事★(地の献身→火の気力が逆で不自由)*/ { upMax:[4],   upMin:[],   revMax:[4],   revMin:[3]   },
  /* 13 死神    変化+感情★ / 仕事+行動★1(正) / 感情★6+変化+行動★1(逆) */
               { upMax:[5,2], upMin:[4,6], revMax:[2],   revMin:[5,6] },
  /* 14 節制    気力★(火の安定→地の金運が逆で節度なし)*/ { upMax:[3],   upMin:[],   revMax:[3],   revMin:[1]   },
  /* 15 悪魔    金運+気力★ / 加護+変化★1(正) / 変化★6+金運+加護★1(逆) */
               { upMax:[1,3], upMin:[7,5], revMax:[5],   revMin:[1,7] },
  /* 16 塔      変化+行動★ / 加護+金運★1(正) / 感情★6+変化+金運★1(逆) */
               { upMax:[5,6], upMin:[7,1], revMax:[2],   revMin:[5,1] },
  /* 17 星      加護★(水の希望→風の人運が逆で停滞)*/ { upMax:[7],   upMin:[],   revMax:[7],   revMin:[0]   },
  /* 18 月      感情★(水の用心→火の行動が逆で抑制)*/ { upMax:[2],   upMin:[],   revMax:[2],   revMin:[6]   },
  /* 19 太陽    仕事+気力★(地+火の成果→風の人運が逆で立場失う)*/ { upMax:[4,3], upMin:[],   revMax:[4,3], revMin:[0]   },
  /* 20 審判    変化★(風の復活→火の気力が逆で後悔)*/ { upMax:[5],   upMin:[],   revMax:[5],   revMin:[3]   },
  /* 21 世界    仕事+感情★(地+水の統合→風の変化が逆で行き詰り)*/ { upMax:[4,2], upMin:[],   revMax:[4,2], revMin:[5]   },
];

// { scores: number[], maxIndices: number[], minIndices: number[] }
// { scores: number[], maxIndices: number[], minIndices: number[] }
// 小アルカナが階段パターン（連続する3つの数字）か判定
function isStairPattern(minorResults) {
  if (minorResults.length !== 3) return false;
  const numbers = minorResults.map((r) => {
    const cardNum = parseInt(r.card.id.split("-")[1]);
    return cardNum;
  });
  const sorted = numbers.slice().sort((a, b) => a - b);
  // 連続する3つの数が揃っているか
  return sorted[1] - sorted[0] === 1 && sorted[2] - sorted[1] === 1;
}

// 大アルカナ2枚から1-22のスコアを算出（各カードを1-11にマップ）
function calcFortuneScore(card1, card2) {
  const idx1 = parseInt(card1.id.split("-")[1]);
  const idx2 = parseInt(card2.id.split("-")[1]);
  // 各カードは0～21なので、1～11スケールに正規化
  const score1 = (idx1 % 11) + 1;
  const score2 = (idx2 % 11) + 1;
  return score1 + score2; // 2～22
}

function detectJackpot(minorCards) {
  if (minorCards.length !== 3) return null;
  // minorCardsは [{card, reversed}] 形式
  // card.idは "wands-1", "cups-10" など
  const numbers = minorCards.map((r) => {
    const idx = parseInt(r.card.id.split("-")[1]);
    return idx; // 1～10
  });
  
  // 全部同じ数字か確認
  const allSame = numbers[0] === numbers[1] && numbers[1] === numbers[2];
  if (!allSame) return null;

  const num = numbers[0];
  if (num === 1) return "all_1";      // ALL★1（Ace×3）
  if (num === 10) return "all_6";     // ALL★6（10×3）
  if (num >= 2 && num <= 9) return "all_5"; // ALL★5（2～9×3）
  return null;
}

function calcStats(majorCard, minorResults) {
  const N = 8;
  const baseline = 3.5;
  const scores = Array(N).fill(baseline);
  const addCard = (card, reversed) => {
    const w = STAT_WEIGHTS[suitKeyOf(card)] || Array(N).fill(0);
    const v = reversed ? -1 : 1;
    for (let i = 0; i < N; i++) scores[i] += w[i] * v;
  };
  addCard(majorCard.card, majorCard.reversed);
  minorResults.forEach((r) => addCard(r.card, r.reversed));

  const raw = scores.map((s) => Math.min(6, Math.max(1, Math.round(s * 2) / 2)));

  const cardIdx = parseInt(majorCard.card.id.split("-")[1]);
  const f = CARD_FORCE[cardIdx];

  // 極端カード（悪魔13→15、死神13、塔16）と良いカード（女帝3、太陽19、世界21）は
  // 自然スコアからランダムに最大・最小を決める
  const EXTREME_CARDS = new Set([13, 15, 16]);
  const GOOD_CARDS    = new Set([3, 19, 21]);

  if (EXTREME_CARDS.has(cardIdx)) {
    // 正位置: 上位2分野★6、下位2分野★1
    // 逆位置: 上位1分野★6、下位2分野★1
    const sorted = [...raw.map((v, i) => ({ v, i }))].sort((a, b) => b.v - a.v);
    const maxCount = majorCard.reversed ? 1 : 2;
    const minCount = 2;
    const maxIndices = sorted.slice(0, maxCount).map((x) => x.i);
    const minIndices = sorted.slice(-minCount).map((x) => x.i);
    maxIndices.forEach((i) => { raw[i] = 6; });
    minIndices.forEach((i) => { raw[i] = 1; });
    
    // 階段パターンボーナス
    if (isStairPattern(minorResults)) {
      const maxSet = new Set(maxIndices);
      const availableFields = [];
      for (let i = 0; i < 8; i++) if (!maxSet.has(i)) availableFields.push(i);
      if (availableFields.length > 0) {
        const bonusField = availableFields[Math.floor(Math.random() * availableFields.length)];
        raw[bonusField] = 6;
        maxIndices.push(bonusField);
      }
    }
    return { scores: raw, maxIndices, minIndices };
  }

  if (GOOD_CARDS.has(cardIdx)) {
    // 正位置: 上位2分野★6、★1なし
    // 逆位置: 上位2分野★6、下位1分野★1
    const sorted = [...raw.map((v, i) => ({ v, i }))].sort((a, b) => b.v - a.v);
    const maxIndices = sorted.slice(0, 2).map((x) => x.i);
    const minIndices = majorCard.reversed ? [sorted[sorted.length - 1].i] : [];
    maxIndices.forEach((i) => { raw[i] = 6; });
    minIndices.forEach((i) => { raw[i] = 1; });
    
    // 階段パターンボーナス
    if (isStairPattern(minorResults)) {
      const maxSet = new Set(maxIndices);
      const availableFields = [];
      for (let i = 0; i < 8; i++) if (!maxSet.has(i)) availableFields.push(i);
      if (availableFields.length > 0) {
        const bonusField = availableFields[Math.floor(Math.random() * availableFields.length)];
        raw[bonusField] = 6;
        maxIndices.push(bonusField);
      }
    }
    return { scores: raw, maxIndices, minIndices };
  }

  // 標準16枚: 固定インデックスで決定論的に適用
  if (majorCard.reversed) {
    f.revMax.forEach((i) => { raw[i] = 6; });
    f.revMin.forEach((i) => { raw[i] = 1; });
    const maxIndices = f.revMax.slice();
    
    // 階段パターンボーナス
    if (isStairPattern(minorResults)) {
      const maxSet = new Set(maxIndices);
      const availableFields = [];
      for (let i = 0; i < 8; i++) if (!maxSet.has(i)) availableFields.push(i);
      if (availableFields.length > 0) {
        const bonusField = availableFields[Math.floor(Math.random() * availableFields.length)];
        raw[bonusField] = 6;
        maxIndices.push(bonusField);
      }
    }
    return { scores: raw, maxIndices, minIndices: f.revMin };
  } else {
    f.upMax.forEach((i) => { raw[i] = 6; });
    f.upMin.forEach((i) => { raw[i] = 1; });
    const maxIndices = f.upMax.slice();
    
    // 階段パターンボーナス
    if (isStairPattern(minorResults)) {
      const maxSet = new Set(maxIndices);
      const availableFields = [];
      for (let i = 0; i < 8; i++) if (!maxSet.has(i)) availableFields.push(i);
      if (availableFields.length > 0) {
        const bonusField = availableFields[Math.floor(Math.random() * availableFields.length)];
        raw[bonusField] = 6;
        maxIndices.push(bonusField);
      }
    }
    return { scores: raw, maxIndices, minIndices: f.upMin };
  }
}

// variant: "max" = 大アルカナ由来の6（明るい黄色）
//          "min" = 大アルカナ逆位置由来の1（くすんだ黄色）
//          null  = 通常
function StarRating({ score, variant }) {
  const slots = [1, 2, 3, 4, 5, 6];
  const fillColor =
    variant === "max" ? "var(--star-max)" :
    variant === "min" ? "var(--star-min)" :
    "var(--gold)";
  return (
    <span className={`stats-stars ${variant === "max" ? "stars-max" : ""}`}>
      {slots.map((slot) => {
        const ratio = Math.max(0, Math.min(1, score - (slot - 1)));
        return (
          <span
            className="star-wrap"
            key={slot}
            style={variant === "max" ? { animationDelay: `${(slot - 1) * 0.1}s` } : {}}
          >
            <Star size={15} className="star-bg" fill="currentColor" stroke="none" />
            {ratio > 0 && (
              <span className="star-fill" style={{ width: `${ratio * 100}%`, color: fillColor }}>
                <Star size={15} fill="currentColor" stroke="none" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}


const FREE_DRAWS_PER_DAY = 3;
const FREE_REDRAWS = 1;
const MAX_HISTORY = 10;
const LS_NAME_KEY = "tarot_user_name";
const LS_COUNT_KEY = "tarot_draw_log";
const LS_HISTORY_KEY = "tarot_history";

function loadUserName() {
  try { return localStorage.getItem(LS_NAME_KEY) || ""; } catch { return ""; }
}
function saveUserName(name) {
  try { localStorage.setItem(LS_NAME_KEY, name); } catch {}
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function loadTodayCount() {
  try {
    const raw = localStorage.getItem(LS_COUNT_KEY);
    if (!raw) return 0;
    const log = JSON.parse(raw);
    return log.date === todayStr() ? (log.count || 0) : 0;
  } catch { return 0; }
}
function incrementTodayCount() {
  try {
    const next = { date: todayStr(), count: loadTodayCount() + 1 };
    localStorage.setItem(LS_COUNT_KEY, JSON.stringify(next));
    return next.count;
  } catch { return 0; }
}
function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveHistory(entry) {
  try {
    const history = loadHistory();
    const next = [entry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(next));
  } catch {}
}

export default function TarotDraw() {
  const [mode, setMode] = useState("normal"); // ランキング機能を非表示にするため常にnormal
  const [phase, setPhase] = useState("idle");
  const [question, setQuestion] = useState("");
  const [userName, setUserName] = useState(loadUserName());
  const [todayCount, setTodayCount] = useState(loadTodayCount());
  const [redrawCount, setRedrawCount] = useState(0);
  const [history, setHistory] = useState(loadHistory());
  const [showHistory, setShowHistory] = useState(false);

  const [majorPool, setMajorPool] = useState([]);
  const [majorSelectedId, setMajorSelectedId] = useState(null);
  const [majorCard, setMajorCard] = useState(null); // { card, reversed }

  const [minorPool, setMinorPool] = useState([]);
  const [minorSelectedIds, setMinorSelectedIds] = useState([]);
  const [minorResults, setMinorResults] = useState([]); // [{card,reversed}] x3

  const [reading1, setReading1] = useState("");
  const [reading1Loading, setReading1Loading] = useState(false);

  const [reading2, setReading2] = useState("");
  const [reading2Loading, setReading2Loading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [userOrientationChoice, setUserOrientationChoice] = useState(null); // false=正, true=逆

  // ランキングチャレンジ用state
  const [rankingMajorCards, setRankingMajorCards] = useState([]);
  const [rankingMinorCards, setRankingMinorCards] = useState([]);
  const [jackpotType, setJackpotType] = useState(null); // "all_1" | "all_6" | "all_5" | null
  const [fortuneScore, setFortuneScore] = useState(0);

  const atLeast = (p) => PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(p);

  useEffect(() => {
    // reading2が完成し、majorCardとminorResultsが揃ったら履歴に保存
    if (
      reading2 &&
      !reading2Loading &&
      majorCard &&
      minorResults.length === 3 &&
      phase === "major-revealed"
    ) {
      const { scores } = calcStats(majorCard, minorResults);
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("ja-JP"),
        time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
        userName: userName.trim(),
        question,
        majorCard: {
          name: majorCard.card.name,
          reversed: majorCard.reversed,
          kw: majorCard.reversed ? majorCard.card.rev : majorCard.card.up,
        },
        minorResults: minorResults.map((r) => ({ name: r.card.name, reversed: r.reversed })),
        scores,
        reading1,
        reading2,
      };
      saveHistory(entry);
      setHistory(loadHistory());
    }
  }, [reading2, reading2Loading, majorCard, minorResults, phase, userName, question, reading1]);

  const canDraw = todayCount < FREE_DRAWS_PER_DAY;

  const start = () => {
    if (!canDraw) return; // 制限チェック
    // 名前を保存し、当日の占い回数を記録
    if (userName.trim()) saveUserName(userName.trim());
    setTodayCount(incrementTodayCount());
    setRedrawCount(0);
    setMajorPool(buildPool(MAJOR_LIST));
    setMajorSelectedId(null);
    setMajorCard(null);
    setMinorPool([]);
    setMinorSelectedIds([]);
    setMinorResults([]);
    setReading1("");
    setReading1Loading(false);
    setReading2("");
    setReading2Loading(false);
    setCopied(false);
    setUserOrientationChoice(null);
    setPhase("major-spread");
  };

  const reset = () => {
    setQuestion("");
    setMajorPool([]);
    setMajorSelectedId(null);
    setMajorCard(null);
    setMinorPool([]);
    setMinorSelectedIds([]);
    setMinorResults([]);
    setReading1("");
    setReading1Loading(false);
    setReading2("");
    setReading2Loading(false);
    setCopied(false);
    setUserOrientationChoice(null);
    setRankingMajorCards([]);
    setRankingMinorCards([]);
    setJackpotType(null);
    setFortuneScore(0);
    setMode("normal");
    setPhase("idle");
    // 履歴を最新の状態に更新（新しく保存された履歴を読み込む）
    setHistory(loadHistory());
    setShowHistory(false);
  };

  const canRedraw = redrawCount < FREE_REDRAWS;

  const handleRedraw = () => {
    if (!canRedraw) return;
    setRedrawCount(redrawCount + 1);
    setMinorPool(buildPool(MINOR_LIST));
    setMinorSelectedIds([]);
    setMinorResults([]);
    setReading1("");
    setReading1Loading(false);
    setReading2("");
    setReading2Loading(false);
    setUserOrientationChoice(null);
    setPhase("minor-spread");
  };

  const startNormal = () => {
    setMode("normal");
    start();
  };

  const startRanking = () => {
    setMode("ranking");
    // ランキング用大アルカナ3枚をシャッフルして準備
    const shuffled = shuffle(MAJOR_LIST);
    setRankingMajorCards(shuffled.slice(0, 3));
    setPhase("ranking-major-select");
  };

  const onPickMajor = (card) => {
    if (phase !== "major-spread") return;
    setMajorSelectedId(card.id);
    setMajorCard({ card, reversed: card.reversed });
    setPhase("major-resolving");
    setTimeout(() => {
      setMinorPool(buildPool(MINOR_LIST));
      setPhase("minor-spread");
    }, 480);
  };

  const fetchReading1 = async (results) => {
    setReading1Loading(true);
    try {
      const text = await callClaude(buildMinorPrompt(results, question, userName.trim()));
      setReading1(text);
    } catch (e) {
      setReading1(fallbackMinorReading(results));
    } finally {
      setReading1Loading(false);
    }
  };

  const onPickMinor = (card) => {
    if (phase !== "minor-spread") return;
    if (minorSelectedIds.includes(card.id)) {
      setMinorSelectedIds(minorSelectedIds.filter((id) => id !== card.id));
      return;
    }
    if (minorSelectedIds.length >= 3) return;
    const next = [...minorSelectedIds, card.id];
    setMinorSelectedIds(next);
    if (next.length === 3) {
      const results = next.map((id) => {
        const c = minorPool.find((cc) => cc.id === id);
        return { card: c, reversed: c.reversed };
      });
      setMinorResults(results);
      setPhase("minor-resolving");
      setTimeout(() => {
        setPhase("minor-revealed");
        fetchReading1(results);
      }, 480);
    }
  };

  const fetchReading2 = async (resolvedMajor) => {
    setReading2Loading(true);
    try {
      const text = await callClaude(buildMajorPrompt(resolvedMajor, minorResults, reading1, question));
      setReading2(text);
    } catch (e) {
      setReading2(fallbackMajorReading(resolvedMajor));
    } finally {
      setReading2Loading(false);
    }
  };

  const openMajor = (flip) => {
    // flip=false: 運命の向きをそのまま受け入れる
    // flip=true:  向きを反転して修正する
    setUserOrientationChoice(flip); // trueなら「反転した」記録
    const resolvedMajor = flip
      ? { ...majorCard, reversed: !majorCard.reversed }
      : majorCard;
    setMajorCard(resolvedMajor);
    setPhase("major-revealed");
    fetchReading2(resolvedMajor);
  };

  const handleCopy = async () => {
    const { scores: stats } = calcStats(majorCard, minorResults);    const text = buildCopyText(majorCard, minorResults, reading1, reading2, stats, question);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
      } catch (e2) {
        setCopied(false);
      }
    }
    setTimeout(() => setCopied(false), 2200);
  };

  const showMajorGrid = phase === "major-spread" || phase === "major-resolving";
  const showMinorGrid = phase === "minor-spread" || phase === "minor-resolving";
  const showHeldChip = atLeast("minor-spread") && phase !== "major-revealed" && majorCard;

  return (
    <div className="tarot-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&family=Cinzel:wght@500;600&display=swap');

        .tarot-root {
          --bg-deep: #120f24;
          --bg-mid: #1c1640;
          --surface: #241c4d;
          --gold: #c9a24b;
          --gold-soft: #e7cf99;
          --parchment: #f1ead8;
          --muted: #a99bc9;
          --rose: #c97a92;
          --wand: #d97a3f;
          --cup: #6fb0c4;
          --sword: #98a1c9;
          --pentacle: #a3b466;
          --star-max: #ffe94d;
          --star-min: #6b6b7a;
          position: relative;
          min-height: 600px;
          background: radial-gradient(circle at 18% -10%, #2c2368 0%, var(--bg-deep) 55%), var(--bg-deep);
          color: var(--parchment);
          font-family: 'Noto Sans JP', sans-serif;
          padding: 40px 20px 56px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(201,162,75,0.15) inset;
        }
        .tarot-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.85;
          background-image:
            radial-gradient(1.6px 1.6px at 10% 18%, rgba(241,234,216,0.35) 0, transparent 50%),
            radial-gradient(1.6px 1.6px at 82% 12%, rgba(241,234,216,0.28) 0, transparent 50%),
            radial-gradient(1.3px 1.3px at 62% 72%, rgba(241,234,216,0.3) 0, transparent 50%),
            radial-gradient(1.3px 1.3px at 28% 86%, rgba(241,234,216,0.22) 0, transparent 50%),
            radial-gradient(1.6px 1.6px at 92% 58%, rgba(241,234,216,0.25) 0, transparent 50%),
            radial-gradient(1.3px 1.3px at 45% 30%, rgba(241,234,216,0.2) 0, transparent 50%);
        }
        .tarot-header { text-align: center; position: relative; z-index: 1; margin-bottom: 22px; }
        .eyebrow { display: inline-flex; align-items: center; gap: 6px; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.18em; color: var(--gold); margin-bottom: 10px; }
        .tarot-header h1 { font-family: 'Shippori Mincho', serif; font-size: 30px; font-weight: 700; margin: 0 0 10px; letter-spacing: 0.04em; }
        .tarot-header p { font-size: 12.5px; color: var(--muted); margin: 0 auto; line-height: 1.75; max-width: 460px; }

        .controls { position: relative; z-index: 1; display: flex; justify-content: center; margin-bottom: 18px; }

        .mode-select { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .mode-label { font-family: 'Shippori Mincho', serif; font-size: 14px; color: var(--gold-soft); letter-spacing: 0.08em; }
        .mode-buttons { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .mode-btn { font-size: 13.5px; padding: 13px 26px; }
        .mode-btn.normal { border-color: var(--gold); color: var(--gold-soft); }
        .mode-btn.ranking { border-color: var(--star-max); color: var(--star-max); background: linear-gradient(180deg, rgba(255,233,77,0.18), rgba(255,233,77,0.04)); }

        .question-field { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 360px; }
        .question-field label { font-size: 11.5px; color: var(--muted); letter-spacing: 0.04em; }
        .question-field input {
          width: 100%; box-sizing: border-box; font-family: 'Noto Sans JP', sans-serif; font-size: 13.5px;
          padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(201,162,75,0.4);
          background: rgba(255,255,255,0.04); color: var(--parchment); text-align: center;
        }
        .question-field input::placeholder { color: rgba(169,155,201,0.55); }
        .question-field input:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; border-color: var(--gold); }

        .question-banner { position: relative; z-index: 1; text-align: center; font-family: 'Shippori Mincho', serif; font-size: 12.5px; color: var(--gold-soft); margin: 0 0 20px; }
        .draw-btn {
          display: inline-flex; align-items: center; gap: 8px; font-family: 'Shippori Mincho', serif; font-size: 15px;
          padding: 12px 28px; border-radius: 999px; border: 1px solid var(--gold);
          background: linear-gradient(180deg, rgba(201,162,75,0.22), rgba(201,162,75,0.06));
          color: var(--gold-soft); cursor: pointer; transition: transform .2s ease, box-shadow .2s ease;
        }
        .draw-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,162,75,0.18); }
        .draw-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .draw-btn:disabled { opacity: 0.45; cursor: default; }
        .climax-btn { animation: glowPulse 2.2s ease-in-out infinite; }

        .open-choice { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .open-choice-label { font-family: 'Shippori Mincho', serif; font-size: 13px; color: var(--gold-soft); margin: 0; letter-spacing: 0.04em; }
        .open-choice-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .choice-up  { border-color: var(--gold);  color: var(--gold-soft); }
        .choice-rev { border-color: var(--rose);  color: var(--rose);
          background: linear-gradient(180deg, rgba(201,122,146,0.18), rgba(201,122,146,0.04)); }
        .choice-rev:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(201,122,146,0.18); }
        .copy-btn { font-size: 13px; padding: 11px 22px; }
        .copy-btn:disabled { opacity: 0.4; cursor: default; animation: none; }

        .reset-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); background: none; border: 1px solid rgba(169,155,201,0.3); padding: 8px 18px; border-radius: 999px; cursor: pointer; }
        .reset-btn:hover { color: var(--gold-soft); border-color: var(--gold); }
        .reset-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

        .round-label { position: relative; z-index: 1; text-align: center; font-family: 'Shippori Mincho', serif; font-size: 13.5px; color: var(--gold-soft); margin: 0 0 16px; line-height: 1.7; }

        .held-chip { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; justify-content: center; margin: 0 auto 24px; padding: 8px 16px; border: 1px dashed rgba(201,162,75,0.5); border-radius: 999px; width: fit-content; color: var(--gold-soft); font-size: 11.5px; background: rgba(201,162,75,0.06); animation: glowPulse 2.4s ease-in-out infinite; }
        .held-chip .mini-back { width: 26px; height: 38px; border-radius: 4px; border: 1px solid var(--gold); background: linear-gradient(160deg, var(--surface), var(--bg-mid)); display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 11px; color: var(--gold); flex-shrink: 0; }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,75,0); } 50% { box-shadow: 0 0 16px 2px rgba(201,162,75,0.22); } }

        .spread-grid { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; max-width: 760px; margin: 0 auto 28px; }
        .mini-card { position: relative; width: 40px; height: 60px; border-radius: 6px; border: 1px solid rgba(201,162,75,0.45); background: linear-gradient(160deg, var(--surface), var(--bg-mid)); display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; font: inherit; transform: rotate(var(--rot, 0deg)); transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .mini-card:hover:not(:disabled) { transform: rotate(var(--rot, 0deg)) translateY(-4px) scale(1.08); box-shadow: 0 6px 16px rgba(201,162,75,0.25); border-color: var(--gold); }
        .mini-card:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .mini-card:disabled { cursor: default; }
        .mini-card.chosen { transform: scale(1.18) translateY(-6px); box-shadow: 0 0 0 2px var(--gold), 0 0 18px rgba(201,162,75,0.5); border-color: var(--gold); z-index: 2; }
        .mini-card.vanish { animation: vanishCard .45s ease forwards; }
        @keyframes vanishCard { to { opacity: 0; transform: scale(0.35) translateY(10px); } }
        .mini-emblem { font-family: 'Cinzel', serif; font-size: 12px; color: var(--gold); opacity: 0.65; }
        .mini-badge { position: absolute; top: -7px; right: -7px; width: 17px; height: 17px; border-radius: 50%; background: var(--gold); color: var(--bg-deep); font-size: 9.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; }

        .result-area { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 22px; animation: popIn .5s ease; margin-bottom: 10px; }
        .cards-row { display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; }
        .card-slot { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 140px; }
        .position-label { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; color: var(--gold); }

        .static-card { width: 130px; height: 194px; border-radius: 12px; border: 1px solid var(--gold); background: linear-gradient(160deg, #1a1440, var(--surface)); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .static-card.big { width: 168px; height: 252px; }
        .card-face { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; padding: 14px 8px; text-align: center; }
        .card-face.reversed { transform: rotate(180deg); }
        .card-corner { font-family: 'Cinzel', serif; font-size: 13px; color: var(--accent, var(--gold)); letter-spacing: 0.1em; }
        .card-icon { color: var(--accent, var(--gold)); display: flex; }
        .card-name { font-family: 'Shippori Mincho', serif; font-size: 15px; font-weight: 600; color: var(--parchment); line-height: 1.3; }
        .card-sub { font-size: 9.5px; color: var(--muted); letter-spacing: 0.03em; }

        .orientation { display: inline-block; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.12em; padding: 3px 10px; border-radius: 999px; }
        .orientation.up { background: rgba(201,162,75,0.15); color: var(--gold-soft); border: 1px solid rgba(201,162,75,0.4); }
        .orientation.rev { background: rgba(201,122,146,0.15); color: var(--rose); border: 1px solid rgba(201,122,146,0.4); }

        .ai-reading { width: 100%; max-width: 480px; margin: 4px auto 0; padding: 18px 22px; border-radius: 14px; border: 1px solid rgba(201,162,75,0.35); background: linear-gradient(160deg, rgba(36,28,77,0.65), rgba(18,15,36,0.65)); box-sizing: border-box; }
        .ai-label { display: flex; align-items: center; gap: 6px; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em; color: var(--gold); margin-bottom: 10px; }
        .ai-reading p { font-size: 13px; line-height: 1.85; color: var(--parchment); margin: 0; }
        .loading-dots { display: inline-flex; gap: 4px; margin-left: 6px; vertical-align: middle; }
        .loading-dots span { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); display: inline-block; animation: dotPulse 1.1s ease-in-out infinite; }
        .loading-dots span:nth-child(2) { animation-delay: .15s; }
        .loading-dots span:nth-child(3) { animation-delay: .3s; }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: .25; transform: scale(.8); } 40% { opacity: 1; transform: scale(1); } }

        .major-stage { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 8px; padding-top: 28px; border-top: 1px solid rgba(201,162,75,0.2); animation: popIn .55s ease; }
        .major-keywords { font-size: 12.5px; color: var(--muted); text-align: center; max-width: 320px; margin: 0; }
        .intuition-msg { font-family: 'Shippori Mincho', serif; font-size: 12px; text-align: center; margin: 2px 0 0; letter-spacing: 0.04em; }
        .intuition-msg.hit  { color: var(--star-max); }
        .intuition-msg.miss { color: var(--muted); font-style: italic; }

        .stats-panel { width: 100%; max-width: 360px; margin: 6px auto 0; padding: 14px 20px; border-radius: 14px; border: 1px solid rgba(201,162,75,0.3); background: rgba(36,28,77,0.4); box-sizing: border-box; }
        .stats-title { display: flex; align-items: center; gap: 6px; justify-content: center; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em; color: var(--gold); margin-bottom: 10px; }
        .stats-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 0; }
        .stats-row + .stats-row { border-top: 1px solid rgba(201,162,75,0.12); }
        .stats-label { font-family: 'Shippori Mincho', serif; font-size: 13px; color: var(--parchment); width: 44px; flex-shrink: 0; }
        .stats-stars { display: flex; gap: 2px; }
        .star-wrap { position: relative; width: 15px; height: 15px; display: inline-block; flex-shrink: 0; }
        .star-bg { position: absolute; top: 0; left: 0; color: rgba(201,162,75,0.22); }
        .star-fill { position: absolute; top: 0; left: 0; overflow: hidden; color: var(--gold); display: block; height: 15px; }
        .stats-value { font-family: 'Cinzel', serif; font-size: 10.5px; color: var(--muted); width: 26px; text-align: right; flex-shrink: 0; }

        .stars-max .star-wrap { animation: starPop 0.55s cubic-bezier(.2,1.6,.4,1) both; }
        .stars-max .star-fill { animation: starShimmer 2.4s ease-in-out 0.6s infinite; }
        .stats-row.row-max { background: rgba(255,233,77,0.05); border-radius: 8px; }
        .stats-row.row-min { opacity: 0.65; }

        @keyframes starPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.25) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes starShimmer {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0px var(--star-max)); }
          50%       { filter: brightness(1.45) drop-shadow(0 0 5px var(--star-max)); }
        }
        @keyframes popIn { from { opacity: 0; transform: scale(0.88) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        @media (prefers-reduced-motion: reduce) {
          .mini-card, .draw-btn, .climax-btn, .held-chip, .result-area, .major-stage, .mini-card.vanish { animation: none !important; transition: none !important; }
        }
        @media (max-width: 520px) {
          .tarot-header h1 { font-size: 24px; }
          .mini-card { width: 32px; height: 48px; }
          .static-card { width: 108px; height: 160px; }
          .static-card.big { width: 140px; height: 208px; }
          .card-slot { width: 116px; }
        }
      `}</style>

      <div className="tarot-bg" />

      <header className="tarot-header">
        <div className="eyebrow">
          <Sparkles size={14} />
          <span>ARCANA DRAW</span>
        </div>
        <h1>タロット占い</h1>
        <p>
          まず大アルカナ22枚から、全体のテーマを表す1枚を選びます（このカードはすぐには開きません）。
          続いて小アルカナ56枚から3枚を選ぶと、過去・現在・未来が一度に開かれ、AIが鑑定します。
          最後にテーマカードが開かれ、結論が導かれます。
        </p>
      </header>

      <div className="controls">
        {phase === "idle" && mode === "select" ? (
          <div className="mode-select">
            <p className="mode-label">どのモードで占いますか？</p>
            <div className="mode-buttons">
              <button className="draw-btn mode-btn normal" onClick={startNormal}>
                <Sparkles size={16} />
                通常の占い
              </button>
              <button className="draw-btn mode-btn ranking" onClick={startRanking}>
                <Star size={16} />
                ランキングに挑戦
              </button>
            </div>
          </div>
        ) : phase === "idle" && mode === "normal" ? (
          <div className="question-field">
            <label htmlFor="tarot-name">お名前（ニックネームでOK）</label>
            <input
              id="tarot-name"
              type="text"
              maxLength={20}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例：アキ"
            />
            <label htmlFor="tarot-question">占ってほしいことを一言で（任意）</label>
            <input
              id="tarot-question"
              type="text"
              maxLength={60}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例：来月の恋愛運が知りたい"
            />
            {canDraw ? (
              <button className="draw-btn" onClick={start}>
                <Shuffle size={16} />
                占いを始める
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--rose)", fontSize: "13px", margin: "0 0 8px" }}>
                  今日の無料占いは{FREE_DRAWS_PER_DAY}回使いました
                </p>
                <p style={{ color: "var(--muted)", fontSize: "11px", margin: "0 0 12px" }}>
                  明日またお越しください ✦
                </p>
              </div>
            )}
            {todayCount > 0 && canDraw && (
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>
                今日はあと{FREE_DRAWS_PER_DAY - todayCount}回占えます
              </p>
            )}

            {history.length > 0 && (
              <button className="reset-btn" onClick={() => setShowHistory(!showHistory)} style={{ marginTop: "8px" }}>
                <RotateCcw size={14} />
                過去の占い履歴（{history.length}件）
              </button>
            )}

            {showHistory && (
              <div style={{ width: "100%", maxWidth: "400px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {history.map((h) => (
                  <div key={h.id} style={{ background: "rgba(36,28,77,0.7)", border: "1px solid rgba(201,162,75,0.25)", borderRadius: "10px", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>{h.date} {h.time}</span>
                      {h.userName && <span style={{ fontSize: "11px", color: "var(--gold-soft)" }}>{h.userName}</span>}
                    </div>
                    {h.question && <p style={{ fontSize: "12px", color: "var(--gold-soft)", margin: "0 0 6px" }}>「{h.question}」</p>}
                    <p style={{ fontSize: "13px", fontFamily: "'Shippori Mincho',serif", margin: "0 0 6px" }}>
                      ✦ {h.majorCard.name}（{h.majorCard.reversed ? "逆" : "正"}位置）
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                      {["過去","現在","未来"].map((pos, i) => (
                        <span key={i} style={{ fontSize: "10px", color: "var(--muted)", background: "rgba(201,162,75,0.08)", padding: "2px 7px", borderRadius: "999px" }}>
                          {pos}:{h.minorResults[i]?.name}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {STAT_CATEGORIES.map((cat, i) => (
                        <span key={i} style={{ fontSize: "10px", color: h.scores[i] >= 5 ? "var(--star-max)" : h.scores[i] <= 1 ? "var(--star-min)" : "var(--muted)" }}>
                          {cat.label}:{h.scores[i]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button className="reset-btn" onClick={reset}>
            <RotateCcw size={14} />
            やり直す
          </button>
        )}
      </div>

      {phase !== "idle" && question && <p className="question-banner">占ってほしいこと:「{question}」</p>}

      {showMajorGrid && (
        <>
          <p className="round-label">
            大アルカナから、いちばん気になる1枚を選んでください。<br />
            これは後で開く「テーマカード」になります。
          </p>
          <div className="spread-grid">
            {majorPool.map((card) => {
              const cls = card.id === majorSelectedId ? "chosen" : phase === "major-resolving" ? "vanish" : "";
              return (
                <button
                  key={card.id}
                  className={`mini-card ${cls}`}
                  style={{ "--rot": `${card.rot}deg` }}
                  onClick={() => onPickMajor(card)}
                  disabled={phase === "major-resolving"}
                  aria-label="カードを選ぶ"
                >
                  <span className="mini-emblem">✦</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {showHeldChip && (
        <div className="held-chip">
          <span className="mini-back">✦</span>
          <span>テーマカードを1枚伏せて保留中・あとで開きます</span>
        </div>
      )}

      {showMinorGrid && (
        <>
          <p className="round-label">
            直近の出来事を表す小アルカナを3枚選んでください（あと{3 - minorSelectedIds.length}枚）。
          </p>
          <div className="spread-grid">
            {minorPool.map((card) => {
              const idx = minorSelectedIds.indexOf(card.id);
              const cls = idx >= 0 ? "chosen" : phase === "minor-resolving" ? "vanish" : "";
              return (
                <button
                  key={card.id}
                  className={`mini-card ${cls}`}
                  style={{ "--rot": `${card.rot}deg` }}
                  onClick={() => onPickMinor(card)}
                  disabled={phase === "minor-resolving"}
                  aria-label="カードを選ぶ"
                >
                  <span className="mini-emblem">✦</span>
                  {idx >= 0 && <span className="mini-badge">{idx + 1}</span>}
                </button>
              );
            })}
          </div>
        </>
      )}

      {atLeast("minor-revealed") && minorResults.length === 3 && (
        <div className="result-area">
          <div className="cards-row">
            {minorResults.map((d, i) => (
              <div className="card-slot" key={d.card.id}>
                <span className="position-label">{POSITION_LABELS[i]}</span>
                <div className="static-card">
                  <div className={`card-face ${d.reversed ? "reversed" : ""}`} style={{ "--accent": d.card.accent || "var(--gold)" }}>
                    <div className="card-corner">{d.card.corner}</div>
                    <div className="card-icon">{d.card.Icon ? <d.card.Icon size={24} /> : <Sparkles size={24} />}</div>
                    <div className="card-name">{d.card.name}</div>
                    <div className="card-sub">{d.card.sub}</div>
                  </div>
                </div>
                <span className={`orientation ${d.reversed ? "rev" : "up"}`}>{d.reversed ? "逆位置" : "正位置"}</span>
              </div>
            ))}
          </div>

          <div className="ai-reading" aria-live="polite">
            <div className="ai-label">
              <Sparkles size={12} /> AIによる鑑定
            </div>
            {reading1Loading ? (
              <p>
                占い師が読み解いています
                <span className="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              </p>
            ) : (
              <p>{reading1}</p>
            )}
          </div>

          {phase === "minor-revealed" && (
            <div className="open-choice">
              <p className="open-choice-label">テーマカードを開く前に、向きを修正できます。</p>
              <div className="open-choice-btns">
                <button
                  className="draw-btn climax-btn choice-up"
                  onClick={() => openMajor(false)}
                  disabled={reading1Loading}
                >
                  <Sparkles size={15} />
                  そのまま開く
                </button>
                <button
                  className="draw-btn climax-btn choice-rev"
                  onClick={() => openMajor(true)}
                  disabled={reading1Loading}
                >
                  <RotateCcw size={15} />
                  向きを反転して開く
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "major-revealed" && majorCard && (
        <div className="major-stage">
          <span className="position-label">テーマ・結論</span>
          <div className="static-card big">
            <div className={`card-face ${majorCard.reversed ? "reversed" : ""}`} style={{ "--accent": "var(--gold)" }}>
              <div className="card-corner">{majorCard.card.corner}</div>
              <div className="card-icon">
                <Sparkles size={30} />
              </div>
              <div className="card-name">{majorCard.card.name}</div>
              <div className="card-sub">{majorCard.card.sub}</div>
            </div>
          </div>
          <span className={`orientation ${majorCard.reversed ? "rev" : "up"}`}>{majorCard.reversed ? "逆位置" : "正位置"}</span>
          <p className="major-keywords">{majorCard.reversed ? majorCard.card.rev : majorCard.card.up}</p>

          {userOrientationChoice !== null && (
            <p className={`intuition-msg ${userOrientationChoice ? "miss" : "hit"}`}>
              {userOrientationChoice
                ? "◈ あなたはカードの向きを修正して開きました"
                : "✦ あなたはカードの運命をそのまま受け入れました"}
            </p>
          )}

          <div className="stats-panel">
            <div className="stats-title">
              <Sparkles size={12} /> 今回の運勢（ぱっと見）
            </div>
            {(() => {
              const { scores, maxIndices, minIndices } = calcStats(majorCard, minorResults);
              return STAT_CATEGORIES.map((cat, i) => {
                const isMax = maxIndices.includes(i);
                const isMin = minIndices.includes(i);
                const variant = isMax ? "max" : isMin ? "min" : null;
                return (
                  <div className={`stats-row${isMax ? " row-max" : isMin ? " row-min" : ""}`} key={cat.key}>
                    <span className="stats-label">{cat.label}</span>
                    <StarRating score={scores[i]} variant={variant} />
                    <span className="stats-value" style={variant ? { color: isMax ? "var(--star-max)" : "var(--star-min)" } : {}}>
                      {scores[i]}
                    </span>
                  </div>
                );
              });
            })()}
          </div>

          <div className="ai-reading" aria-live="polite">
            <div className="ai-label">
              <Sparkles size={12} /> 結論
            </div>
            {reading2Loading ? (
              <p>
                テーマを読み解いています
                <span className="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              </p>
            ) : (
              <p>{reading2}</p>
            )}
          </div>

          <button className="draw-btn copy-btn" onClick={handleCopy} disabled={reading2Loading}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "コピーしました" : "結果をコピーする（外部AIで詳しく占う用）"}
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            {canRedraw ? (
              <button className="reset-btn" onClick={handleRedraw} style={{ color: "var(--gold-soft)", borderColor: "rgba(201,162,75,0.5)" }}>
                <Shuffle size={14} />
                小アルカナを引き直す（あと{FREE_REDRAWS - redrawCount}回）
              </button>
            ) : (
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0, textAlign: "center" }}>
                引き直しは今回使い切りました ✦ 明日また挑戦できます
              </p>
            )}
            <button className="reset-btn" onClick={reset}>
              <RotateCcw size={14} />
              もう一度占う（今日あと{Math.max(0, FREE_DRAWS_PER_DAY - todayCount)}回）
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
