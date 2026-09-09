// 位牌・過去帳・墓誌・写真の裏書きなどを読み取って、家系図の項目に整える。
// 画像もテキストも受け付ける。保存は一切しない（ステートレス）。

const API = "https://api.anthropic.com/v1";

let cachedModel = null;
let cachedAt = 0;

async function pickModel(key) {
  const now = Date.now();
  if (cachedModel && now - cachedAt < 60 * 60 * 1000) return cachedModel;
  try {
    const r = await fetch(`${API}/models?limit=50`, {
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
    });
    if (r.ok) {
      const j = await r.json();
      const ids = (j.data || []).map((m) => m.id);
      const pick =
        ids.find((i) => /sonnet/.test(i)) ||
        ids.find((i) => /opus/.test(i)) ||
        ids.find((i) => /haiku/.test(i)) ||
        ids[0];
      if (pick) {
        cachedModel = pick;
        cachedAt = now;
        return pick;
      }
    }
  } catch (_) {}
  cachedModel = "claude-sonnet-4-5";
  cachedAt = now;
  return cachedModel;
}

const SYSTEM = `あなたは日本の家系図づくりを手伝う、古い記録の読み取り係です。

送られてくるのは、次のいずれかです。
- お位牌の写真（表に戒名、裏に俗名・没年月日・行年が書かれていることが多い）
- 過去帳のページ
- お墓の墓誌・墓誌板（複数人が並んで彫られている）
- 家系図そのもの（家系図作成サービスなどで作られた図。PDFを画像にしたものが送られてくることがある）
- 古い写真の裏書き
- ご家族から聞いた話を書き起こした文章、または話し言葉のメモ

そこから読み取れた人物を、一人ずつ抜き出してください。

読み取りの決まり：
- 書かれていないことは、絶対に補わない。推測しない。空文字にする。
- 元号は元号のまま書き、西暦がわかる場合のみ括弧で添える（例「昭和五十八年十一月三日（1983年11月3日）」）。
- 旧字体は、読み取った字のまま残す。読みが不確かな字は uncertain に入れる。
- 「行年七十九歳」などの年齢は memo に入れる。
- その人の人となり、口ぐせ、好きだったもの、出来事の語りなど、事実の項目に収まらない「話」は story に入れる。話し言葉から聞き取ったときは、ここが主役になる。語り口はご家族の言葉のまま残し、整えすぎない。
- 俗名がわからず戒名だけの場合、name は空のままにする。
- 続柄（父・祖母など）が読み取れる場合のみ relation に入れる。
- 複数人が写っている過去帳・墓誌・家系図では、人数分すべて返す。
- 家系図の図では、線のつながりから読み取れる続柄（○○の父、○○の長女など）を relation に入れる。図に描かれていない関係は足さない。
- 同じ人物が複数の画像にまたがって写っている場合（お位牌の表と裏など）は、一人にまとめる。

必ず次の形の JSON だけを返してください。前置きも説明も、コードブロックの記号も付けないでください。

{
  "people": [
    {
      "name": "俗名（お名前）",
      "kaimyo": "戒名・法名",
      "birth": "生年月日",
      "death": "命日",
      "relation": "続柄",
      "memo": "行年、住まい、仕事など、短い事実",
      "story": "その人がどんな人だったかの語り。書かれて（語られて）いなければ空文字",
      "uncertain": ["読み取りに自信がない字や項目"]
    }
  ],
  "note": "読み取り全体について、依頼者に一言伝えるべきこと（写真が暗い、裏面も撮ってほしい、など）。なければ空文字。"
}`;


const SYSTEM_PHOTO = `あなたは、古い写真を三十秒の追憶映像にするための下調べをする人です。

送られてくるのは、これから映像にする写真（多くは白黒）と、ご家族から聞いた話です。
写真に「写っているもの」だけを、見たままに書き出してください。写っていないことは、絶対に書かない。

見るところ：
- 何人写っているか。それぞれの見た目（年格好、髪、服装、持ち物、履物）と、立ち方・視線。
- 場所。背景に写っているもの（建物、木、乗り物、道具）。屋内か屋外か。季節や時間帯の手がかり。
- 年代の手がかり（服装の型、車の型、看板の字など）。断定はせず「〜の頃と思われる」と書く。
- 写真そのものの状態（傷、折れ、色あせ、ふちの写り込み、暗さ）。
- 映像にするとき、この写真なら自然に足せそうな動き（視線、うなずき、まばたき、風、衣の揺れ）。派手な動きは挙げない。
- 逆に、足してはいけないもの（写っていない人、写っていない背景、色）。特に、途中で消えたり変わったりしやすい持ち物（帽子、眼鏡、数珠、鞄）は必ず挙げる。

必ず次の形の JSON だけを返してください。前置きも説明も、コードブロックの記号も付けないでください。

{
  "subjects": ["写っている人ひとりずつの説明"],
  "setting": "場所と背景",
  "era_hints": "年代の手がかり（断定しない）",
  "condition": "写真の状態と、撮り直したほうがよい点",
  "motion": ["自然に足せる動き"],
  "keep": ["途中で消してはいけないもの"],
  "avoid": ["足してはいけないもの"],
  "note": "依頼者に一言伝えるべきこと。なければ空文字"
}`;

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST してください" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res
      .status(500)
      .json({ error: "サーバーの設定が未完了です（ANTHROPIC_API_KEY）" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_) {
      return res.status(400).json({ error: "リクエストの形式が不正です" });
    }
  }
  body = body || {};

  const content = [];
  if (Array.isArray(body.images)) {
    for (const img of body.images.slice(0, 6)) {
      const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(img || "");
      if (!m) continue;
      content.push({
        type: "image",
        source: { type: "base64", media_type: m[1], data: m[2] },
      });
    }
  }
  const mode = body.mode === "photo" ? "photo" : "record";
  const text = (body.text || "").toString().slice(0, 4000).trim();
  if (text) {
    content.push({ type: "text", text: mode === "photo"
      ? `ご家族から聞いている話です。写真を見るときの参考にしてください。\n\n${text}`
      : `次の内容から読み取ってください。\n\n${text}` });
  }
  if (!content.length) {
    return res.status(400).json({ error: "写真か文章を送ってください" });
  }
  if (!text) {
    content.push({ type: "text", text: mode === "photo"
      ? "この写真を見て、書き出してください。" : "この画像から読み取ってください。" });
  }
  if (mode === "photo" && !body.images) {
    return res.status(400).json({ error: "動かす写真を送ってください" });
  }

  try {
    const model = await pickModel(key);
    const r = await fetch(`${API}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: mode === "photo" ? SYSTEM_PHOTO : SYSTEM,
        messages: [{ role: "user", content }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return res
        .status(502)
        .json({ error: "読み取りに失敗しました", detail: detail.slice(0, 400) });
    }

    const j = await r.json();
    const raw = (j.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) {
        return res
          .status(502)
          .json({ error: "読み取り結果を整えられませんでした", detail: raw.slice(0, 400) });
      }
      parsed = JSON.parse(m[0]);
    }

    if (mode === "photo") {
      const arr = (v) => (Array.isArray(v) ? v.map((x) => String(x)) : []);
      return res.status(200).json({
        photo: {
          subjects: arr(parsed.subjects),
          setting: parsed.setting || "",
          era_hints: parsed.era_hints || "",
          condition: parsed.condition || "",
          motion: arr(parsed.motion),
          keep: arr(parsed.keep),
          avoid: arr(parsed.avoid),
        },
        note: parsed.note || "",
        model,
      });
    }

    const people = Array.isArray(parsed.people) ? parsed.people : [];
    return res.status(200).json({
      people: people.map((p) => ({
        name: p.name || "",
        kaimyo: p.kaimyo || "",
        birth: p.birth || "",
        death: p.death || "",
        relation: p.relation || "",
        memo: p.memo || "",
        story: p.story || "",
        uncertain: Array.isArray(p.uncertain) ? p.uncertain : [],
      })),
      note: parsed.note || "",
      model,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "読み取り中に問題が起きました", detail: String(e).slice(0, 300) });
  }
};
