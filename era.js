/* 時代背景 —— 生没年から「その人が生きた時代」を引く。
   ここに載せているのは、年表として広く知られている日本の出来事だけ。
   その人個人の暮らしを勝手に決めつけないよう、あくまで「世の中はこうだった」に留める。 */

const GENGO = [
  { name: "明治", start: 1868, end: 1912 },
  { name: "大正", start: 1912, end: 1926 },
  { name: "昭和", start: 1926, end: 1989 },
  { name: "平成", start: 1989, end: 2019 },
  { name: "令和", start: 2019, end: 9999 },
];

/* 年 → 元号表記（境目の年は両方ありうるので、代表的な方を返す） */
function toGengo(y) {
  const g = GENGO.find((g) => y >= g.start && y <= g.end);
  if (!g) return "";
  const n = y - g.start + 1;
  return `${g.name}${n === 1 ? "元" : n}年`;
}

/* その年に起きたこと（広く知られているものだけ） */
const EVENTS = {
  1904: "日露戦争がはじまった年",
  1912: "明治が終わり、大正になった年",
  1914: "第一次世界大戦がはじまった年",
  1918: "米騒動が全国に広がった年",
  1923: "関東大震災があった年",
  1925: "ラジオ放送がはじまった年",
  1926: "大正が終わり、昭和になった年",
  1931: "満州事変が起きた年",
  1937: "日中戦争がはじまった年",
  1941: "太平洋戦争がはじまった年",
  1945: "日本が終戦を迎えた年",
  1946: "日本国憲法が公布された年",
  1947: "日本国憲法が施行された年",
  1950: "朝鮮戦争がはじまり、特需に沸いた年",
  1951: "サンフランシスコ講和条約が結ばれた年",
  1953: "テレビ放送がはじまった年",
  1956: "経済白書に「もはや戦後ではない」と書かれた年",
  1958: "東京タワーが完成した年",
  1959: "皇太子ご成婚に日本中が沸いた年",
  1964: "東京オリンピックが開かれ、東海道新幹線が走りはじめた年",
  1968: "日本の国民総生産が世界第二位になった年",
  1970: "大阪万博が開かれた年",
  1972: "沖縄が日本に復帰した年",
  1973: "オイルショックで物がなくなった年",
  1979: "はじめての東京サミットが開かれた年",
  1983: "東京ディズニーランドが開園した年",
  1985: "日航機墜落事故があった年",
  1989: "昭和が終わり、平成になった年",
  1991: "バブル経済がはじけた年",
  1995: "阪神・淡路大震災があった年",
  1998: "長野オリンピックが開かれた年",
  2011: "東日本大震災があった年",
  2019: "平成が終わり、令和になった年",
  2020: "新型コロナウイルスが世界に広がった年",
};

/* 暮らしぶり（その頃、日本の家はどうだったか） */
const LIVING = [
  { from: 1868, to: 1911, label: "明治の暮らし",
    text: "多くの人が農業で暮らし、村の中で一生を過ごすのがふつうだった。灯りはランプ、着るものは着物。" },
  { from: 1912, to: 1925, label: "大正の暮らし",
    text: "都市に電灯とガスが広がり、洋服を着る人が増えはじめた。ラジオはまだなく、新聞と口伝えが世の中との窓だった。" },
  { from: 1926, to: 1936, label: "昭和のはじめ",
    text: "ラジオが家に入りはじめ、都市では洋装が当たり前になっていった。一方で農村は不況が続き、暮らしは楽ではなかった。" },
  { from: 1937, to: 1945, label: "戦中",
    text: "配給と統制の時代。金物も着るものも足りず、若い男は次々と出征していった。空襲を避けて疎開した家も多い。" },
  { from: 1946, to: 1954, label: "戦後の復興期",
    text: "焼け跡と食糧難。闇市で食べものを買い、着るものはつぎはぎだった。それでも学校が再開し、子どもが増えていった。" },
  { from: 1955, to: 1963, label: "高度成長のはじまり",
    text: "白黒テレビ・洗濯機・冷蔵庫が「三種の神器」と呼ばれ、少しずつ家に入ってきた。地方から都会へ、集団就職の列車が走った。" },
  { from: 1964, to: 1972, label: "高度成長のさなか",
    text: "団地が建ち、カラーテレビ・クーラー・自家用車が新しい憧れになった。舗装道路が伸び、家族で出かけるようになった。" },
  { from: 1973, to: 1984, label: "安定成長期",
    text: "オイルショックを越えて、暮らしは落ち着いていった。核家族が当たり前になり、子どもは自分の部屋を持ちはじめた。" },
  { from: 1985, to: 1990, label: "バブルのころ",
    text: "地価と株価が上がり続け、街に物と灯りがあふれた。旅行も外食も、それまでになく身近になった。" },
  { from: 1991, to: 2000, label: "バブルのあと",
    text: "景気が冷え込み、終身雇用が揺らぎはじめた。携帯電話とパソコンが、家の中に入ってきた頃でもある。" },
  { from: 2001, to: 2010, label: "二千年代",
    text: "携帯電話が一人一台になり、写真がフィルムからデータに変わっていった。" },
  { from: 2011, to: 2099, label: "近年",
    text: "スマートフォンが暮らしの中心になり、家族の写真もその中に収まるようになった。" },
];

function livingOf(y) {
  return LIVING.find((l) => y >= l.from && y <= l.to) || null;
}

/* 文字列から西暦4桁を拾う。「昭和五十八年」「昭和58年」「1983年」いずれも。 */
const KANJI_NUM = { 〇:0, 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9 };
function kanjiToNum(s) {
  if (!s) return NaN;
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  let total = 0, cur = 0, seen = false;
  for (const ch of s) {
    if (ch in KANJI_NUM) { cur = cur * 10 + KANJI_NUM[ch]; seen = true; }
    else if (ch === "十") { total += (cur === 0 ? 1 : cur) * 10; cur = 0; seen = true; }
    else if (ch === "百") { total += (cur === 0 ? 1 : cur) * 100; cur = 0; seen = true; }
    else continue;
  }
  total += cur;
  return seen ? total : NaN;
}

function yearOf(str) {
  if (!str) return null;
  const s = String(str);
  const west = s.match(/(1[5-9]\d{2}|20\d{2})\s*年?/);
  if (west) return parseInt(west[1], 10);
  const g = s.match(/(明治|大正|昭和|平成|令和)\s*(元|[0-9０-９一二三四五六七八九十百]+)\s*年/);
  if (g) {
    const era = GENGO.find((x) => x.name === g[1]);
    if (!era) return null;
    const raw = g[2] === "元" ? 1
      : kanjiToNum(g[2].replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)));
    if (!isFinite(raw) || raw < 1) return null;
    const y = era.start + raw - 1;
    return y <= era.end ? y : null;
  }
  return null;
}

/* 近い年の出来事を拾う（±1年まで。無理に結びつけない） */
function eventNear(y) {
  for (const d of [0, 1, -1]) {
    if (EVENTS[y + d]) return { year: y + d, text: EVENTS[y + d], exact: d === 0 };
  }
  return null;
}

/* 人物 → 時代背景 */
function eraFor(person) {
  const by = yearOf(person.birth);
  const dy = yearOf(person.death);
  if (!by && !dy) return null;

  const lines = [];
  const chips = [];

  if (by) {
    chips.push(`${by}年（${toGengo(by)}）生まれ`);
    const e = eventNear(by);
    if (e && e.exact) lines.push(`生まれたのは、${e.text}。`);
    else if (e) lines.push(`生まれた${by > e.year ? "前年" : "翌年"}は、${e.text}。`);
    const l = livingOf(by);
    if (l) lines.push(`${l.label}——${l.text}`);
  }

  if (by) {
    const usedLiving = new Set([livingOf(by)]);
    for (const age of [10, 20, 30]) {
      const y = by + age;
      if (dy && y > dy) break;
      if (y > new Date().getFullYear()) break;
      const e = eventNear(y);
      const l = livingOf(y);
      const bits = [];
      if (e && e.exact) bits.push(e.text + "。");
      if (l && !usedLiving.has(l)) { bits.push(l.text); usedLiving.add(l); }
      if (bits.length) lines.push(`${age}歳のころ（${y}年）は、${bits.join(" ")}`);
      if (lines.length >= 5) break;
    }
  }

  if (dy) {
    chips.push(`${dy}年（${toGengo(dy)}）に亡くなる`);
    const e = eventNear(dy);
    if (e && e.exact) lines.push(`亡くなったのは、${e.text}。`);
    if (by) chips.push(`${dy - by}年の生涯`);
  }

  return { birthYear: by, deathYear: dy, chips, lines };
}

/* 動画の指示文の下書き */
function videoBrief(person, era) {
  const name = person.name || person.kaimyo || "この方";
  const out = [];
  out.push(`■ ${name}${person.relation ? `（${person.relation}）` : ""}`);
  if (era) {
    out.push(era.chips.join(" ／ "));
    out.push("");
    out.push("【時代の記録】");
    era.lines.forEach((l) => out.push("・" + l));
  }
  if (person.memo) {
    out.push("");
    out.push("【ご家族が覚えていること】");
    out.push("・" + person.memo);
  }
  if (person.story && person.story.trim()) {
    out.push("");
    out.push("【ものがたり（ご家族の言葉）】");
    person.story.trim().split(/\n+/).forEach((l) => out.push("・" + l.trim()));
    out.push("");
    out.push("※ ナレーションは、まずこの言葉から書く。時代の記録は、その背景として一行だけ添える。");
    out.push("※ ここに書かれていないことは、足さない。");
  }
  out.push("");
  out.push("【映像への反映】");
  out.push("・写真に写っている範囲は、いっさい作り変えない。服装も背景も持ち物も、写っているまま。");
  out.push("・足すのは、写真が撮られた数秒の時間の流れだけ（表情・視線・呼吸・わずかな風）。");
  out.push("・白黒はそのまま。カラー化しない。");
  out.push("");
  out.push("【ナレーションへの反映】");
  if (era && era.lines.length) {
    out.push("・冒頭に、この方が生きた時代を一行だけ置く。例：");
    out.push("　「" + era.lines[0].replace(/^生まれたのは、/, "").replace(/。$/, "") + "、その年に生まれた人です。」");
    out.push("・暮らしぶりは、断定せずに世の中の話として添える。「その頃、家にはまだテレビがなかった」のように。");
  } else {
    out.push("・生没年がわかると、ここに時代の一行を入れられます。");
  }
  out.push("");
  out.push("【エンドカードへの反映】");
  out.push("・お名前・お戒名・生没年の下に、時代の一行を小さく置く。");
  if (era && era.birthYear) {
    const e = eventNear(era.birthYear);
    if (e && e.exact) out.push(`　例：「${era.birthYear}年（${toGengo(era.birthYear)}）— ${e.text}に生まれる」`);
  }
  return out.join("\n");
}

window.Era = { eraFor, videoBrief, yearOf, toGengo };
