// 簡易レートリミット（サーバーレス関数のインスタンス内メモリ、完全ではないが連打の大半を防ぐ）
const requestLog = new Map(); // ip -> [timestamps]
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分間
const RATE_LIMIT_MAX = 10; // 1分間に10回まで

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 全体の元栓（Vercelの環境変数 AI_ENABLED=false でいつでも即停止できる）
  if (process.env.AI_ENABLED === 'false') {
    return res.status(200).json({ text: '' }); // 空文字を返し、フロント側のフォールバック文に自然に切り替える
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    const model = 'gemini-3-flash-preview'; // Google AI Studioで実際に選べたモデル
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Geminiがエラーを返した場合、内容をログに出して原因を特定できるようにする
      console.error('Gemini API error:', response.status, JSON.stringify(data));
      return res.status(200).json({ text: '', debug: data.error ? data.error.message : 'unknown error' });
    }

    const text =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.map((p) => p.text || '').join('').trim()) ||
      '';

    if (!text) {
      console.error('Gemini returned no text:', JSON.stringify(data));
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error('fortune.js caught error:', error.message);
    res.status(500).json({ error: 'API error', message: error.message });
  }
}
