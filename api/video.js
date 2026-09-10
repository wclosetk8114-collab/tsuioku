// 写真から実際に動画を生成する。fal.ai のキュー API を叩くだけの薄い中継。
// 必要な環境変数：FAL_KEY（Vercel の Settings → Environment Variables で登録）

const ENDPOINTS = {
  "kling-o3-pro": "fal-ai/kling-video/o3/pro/image-to-video",
  "kling-25-pro": "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
  "seedance-20": "bytedance/seedance-2.0/image-to-video",
};

const QUEUE = "https://queue.fal.run";

function endpointOf(model) {
  return ENDPOINTS[model] || ENDPOINTS["kling-o3-pro"];
}

async function readBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return null; }
  }
  return body || {};
}

module.exports = async function handler(req, res) {
  const key = process.env.FAL_KEY;
  if (!key) {
    return res.status(503).json({
      error: "動画をつくる設定がまだです",
      detail: "Vercel の Settings → Environment Variables に FAL_KEY を登録すると、この画面から動画がつくれるようになります。",
      needsSetup: true,
    });
  }
  const auth = { Authorization: "Key " + key };

  // ---- 状況を見にいく ----
  if (req.method === "GET") {
    const id = req.query && req.query.id;
    const model = (req.query && req.query.model) || "kling-o3-pro";
    if (!id) return res.status(400).json({ error: "id がありません" });
    const ep = endpointOf(model);
    try {
      const st = await fetch(`${QUEUE}/${ep}/requests/${id}/status`, { headers: auth });
      const sj = await st.json().catch(() => ({}));
      const state = sj.status || sj.state || "UNKNOWN";
      if (state !== "COMPLETED") {
        return res.status(200).json({ state, queue: sj.queue_position });
      }
      const rr = await fetch(`${QUEUE}/${ep}/requests/${id}`, { headers: auth });
      const rj = await rr.json().catch(() => ({}));
      const url =
        (rj.video && rj.video.url) ||
        (rj.videos && rj.videos[0] && rj.videos[0].url) ||
        (rj.output && rj.output.video && rj.output.video.url) ||
        null;
      if (!url) {
        return res.status(502).json({
          error: "できあがった動画の場所が分かりませんでした",
          detail: JSON.stringify(rj).slice(0, 500),
        });
      }
      return res.status(200).json({ state: "COMPLETED", url });
    } catch (e) {
      return res.status(500).json({ error: "様子を見にいけませんでした", detail: String(e).slice(0, 300) });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "POST してください" });

  // ---- 生成をお願いする ----
  const body = await readBody(req);
  if (!body) return res.status(400).json({ error: "リクエストの形式が不正です" });

  const image = body.image;
  if (!image || !/^data:image\/(jpeg|png|webp);base64,/.test(image)) {
    return res.status(400).json({ error: "写真を送ってください" });
  }
  const model = body.model || "kling-o3-pro";
  const seconds = body.seconds === 5 ? 5 : 10;
  const prompt = (body.prompt || "").toString().slice(0, 2000).trim() ||
    "古い記念写真が、静かに動きはじめる。写っている人だけが、ほんの数秒ぶんの時間を過ごす。";

  const negative =
    "色をつける, カラー化, 別人になる, 帽子や眼鏡や持ち物が消える, 文字, 字幕, 透かし, ロゴ, 枠, 分割画面, 急なカット, 大きく動く";

  const payload = {
    image_url: image,
    prompt,
    duration: String(seconds),
    negative_prompt: negative,
  };

  const ep = endpointOf(model);
  try {
    const r = await fetch(`${QUEUE}/${ep}`, {
      method: "POST",
      headers: Object.assign({ "content-type": "application/json" }, auth),
      body: JSON.stringify(payload),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(502).json({
        error: "生成をお願いできませんでした",
        detail: (typeof j === "object" ? JSON.stringify(j) : String(j)).slice(0, 600),
      });
    }
    const id = j.request_id || j.requestId;
    if (!id) {
      return res.status(502).json({ error: "受付番号が返ってきませんでした", detail: JSON.stringify(j).slice(0, 400) });
    }
    return res.status(200).json({ id, model, seconds });
  } catch (e) {
    return res.status(500).json({ error: "生成の依頼中に問題が起きました", detail: String(e).slice(0, 300) });
  }
};
