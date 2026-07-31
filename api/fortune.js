/**
 * /api/fortune
 *
 * 【この制限が守っているもの】
 * 製品ルール（無料は1日3回）を強制するためのものではない。それはフロント側の
 * localStorage が担っており、破られても体験が壊れるだけで金銭的な実害はない。
 *
 * ここで守るのは「一晩で請求が跳ね上がる事態」だけである。
 * 狙っている市場（台湾・タイ・フィリピン・インドネシア・ベトナム）はモバイル中心で、
 * CGNAT により数百人が同一のグローバルIPに見えることがある。
 * 職場や学校のWi-Fiも同様。したがってIP単位の制限を製品ルールと同じ値にすると、
 * 無関係な利用者を巻き込んで誤爆する。
 * 「普通の人が絶対に届かないが、スクリプトなら数秒で届く」水準に置くのが正しい。
 *
 * 【本命の防波堤は別にある】
 * Google AI Studio のプロジェクト支出上限。コード不要で、最悪ケースの金額を確定できる。
 * ここのコードは、その上限に達する前に気づくための緩衝材という位置づけ。
 */

// ---- 上限値 ----
const BURST_WINDOW_MS = 60 * 1000;      // 1分
const BURST_MAX = 40;                   // 1IPあたり1分40回（＝占い10回相当。CGNATを考慮して緩め）
const SUSTAIN_WINDOW_MS = 60 * 60 * 1000; // 1時間
const SUSTAIN_MAX = 300;                // 1IPあたり1時間300回（＝占い75回相当）
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;  // 1時間
const GLOBAL_MAX = Number(process.env.GLOBAL_HOURLY_MAX || 2000); // 全体で1時間2000回

const MAX_TRACKED_IPS = 5000;           // メモリ上限（超えたら古い順に捨てる）

const requestLog = new Map(); // ip -> number[]（新しい順ではなく昇順のtimestamp）
let globalLog = [];           // 全体のtimestamp

/**
 * クライアントIPを取り出す。
 *
 * x-forwarded-for は "client, proxy1, proxy2" というリストで届き、
 * かつクライアントが自由に付けられるヘッダなので、値をそのままキーにすると
 * 毎回別のキーを作られて制限を素通りされる。
 * Vercel が信頼できる形で付ける x-real-ip を優先し、無ければ先頭要素だけを使う。
 */
function getClientIp(req) {
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return real.trim();
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function pruneAndCount(list, now, windowMs) {
  let i = 0;
  while (i < list.length && now - list[i] >= windowMs) i++;
  if (i > 0) list.splice(0, i);
  return list.length;
}

/** 制限に触れたら理由を返す。触れていなければ null */
function checkLimits(ip) {
  const now = Date.now();

  // 全体の元栓
  pruneAndCount(globalLog, now, GLOBAL_WINDOW_MS);
  if (globalLog.length >= GLOBAL_MAX) return 'global';

  // IPを追いすぎないようにする（放置すると増え続けてメモリを食う）
  if (requestLog.size > MAX_TRACKED_IPS) {
    const cutoff = requestLog.size - MAX_TRACKED_IPS;
    let n = 0;
    for (const key of requestLog.keys()) {
      requestLog.delete(key);
      if (++n >= cutoff) break;
    }
  }

  const list = requestLog.get(ip) || [];
  pruneAndCount(list, now, SUSTAIN_WINDOW_MS);
  if (list.length >= SUSTAIN_MAX) { requestLog.set(ip, list); return 'sustain'; }

  const burst = list.filter((t) => now - t < BURST_WINDOW_MS).length;
  if (burst >= BURST_MAX) { requestLog.set(ip, list); return 'burst'; }

  list.push(now);
  requestLog.set(ip, list);
  globalLog.push(now);
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 全体の元栓（Vercelの環境変数 AI_ENABLED=false でいつでも即停止できる）
  if (process.env.AI_ENABLED === 'false') {
    return res.status(200).json({ text: '' }); // 空文字でフロントの定型文に自然に切り替わる
  }

  const ip = getClientIp(req);
  const limited = checkLimits(ip);
  if (limited) {
    // 全体上限に達した場合は、429ではなく空文字を返して定型文に落とす。
    // 「混んでいるのでエラー」より「AIなしの鑑定が出る」方が体験の毀損が小さい。
    if (limited === 'global') {
      console.error('global rate limit reached');
      return res.status(200).json({ text: '' });
    }
    console.warn('rate limited:', limited, ip);
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { prompt, maxTokens } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.length > 8000) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }
  const outputTokens = Number.isFinite(maxTokens) ? Math.min(Math.max(maxTokens, 100), 4000) : 500;

  try {
    const model = 'gemini-3-flash-preview';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000); // 25秒で打ち切る

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: outputTokens,
            thinkingConfig: { thinkingBudget: 0 }, // 思考トークンを使わず出力に全振り
          },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', response.status, JSON.stringify(data));
      return res.status(200).json({ text: '' });
    }

    const text =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.map((p) => p.text || '').join('').trim()) ||
      '';

    const finishReason = data.candidates && data.candidates[0] && data.candidates[0].finishReason;
    if (finishReason && finishReason !== 'STOP') {
      console.error('Gemini finishReason:', finishReason, 'textLength:', text.length);
    }
    if (!text) console.error('Gemini returned no text:', JSON.stringify(data));

    res.status(200).json({ text });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Gemini timeout');
      return res.status(200).json({ text: '' });
    }
    console.error('fortune.js caught error:', error.message);
    res.status(500).json({ error: 'API error' });
  }
};
