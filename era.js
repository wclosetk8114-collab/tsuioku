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

/* 近い年の出来事を拾う（±1年まで。無理に結びつけない）
   history.js があればそちらを優先し、なければ上の簡易表を使う。 */
function textOf(y) {
  if (window.History) {
    const e = window.History.topOf(y);
    if (e) return e.t.replace(/た$/, "た年").replace(/だ$/, "だ年");
  }
  return EVENTS[y] || null;
}
function eventNear(y) {
  for (const d of [0, 1, -1]) {
    const t = textOf(y + d);
    if (t) return { year: y + d, text: t, exact: d === 0 };
  }
  return null;
}

/* その人が生きたあいだの、大きな出来事の並び（年齢つき） */
function timeline(by, dy, maxW) {
  if (!by || !window.History) return [];
  const end = dy || new Date().getFullYear();
  return window.History.between(by, end, maxW || 1).map((e) => ({
    year: e.y,
    age: e.y - by,
    text: e.t,
    w: e.w,
  }));
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

  const place = person.place || person.birthplace || person.memo || "";
  const region = window.Regions ? window.Regions.regionFor(place) : null;
  const sub = region && window.Regions ? window.Regions.subareaFor(region, place) : null;
  const stages = region && window.Regions ? window.Regions.lifeStages(region, by, dy) : [];

  return { birthYear: by, deathYear: dy, chips, lines, timeline: timeline(by, dy, 1), region, sub, stages };
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
    if (era.timeline && era.timeline.length) {
      out.push("");
      out.push("【この方が生きたあいだに、世の中で起きたこと】");
      era.timeline.slice(0, 30).forEach((e) =>
        out.push(`・${e.year}年（${toGengo(e.year)}）${e.age}歳　${e.text}`));
      if (era.timeline.length > 30) out.push(`・ほか${era.timeline.length - 30}件`);
      out.push("");
      out.push("※ この年表は、ナレーションとエンドカードのためのもの。");
      out.push("※ 画にはしない。写真に写っていない出来事を、背景として描き足さない。");
    }
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
  if (era && era.region) {
    const R = window.Regions;
    out.push("");
    out.push(`【暮らしの実像 —— ${era.region.label}${era.sub ? "（" + era.sub.name + "）" : ""}】`);
    out.push("※ 全国の年表だけで描くと「明治の日本人」という、どこにもいない平均像になる。");
    out.push("※ 東京の近代化は、同じ速さでこの土地には届いていない。届いた年が、この人の一生を決めている。");
    if (era.sub) out.push(`・${era.sub.name}：${era.sub.note}`);
    out.push("");
    era.stages.filter((s) => !s.repeat).forEach((s) => {
      out.push(`◆ ${s.label}（${s.year}年・${s.age}歳）── ${s.era.label}：${s.era.head}`);
      s.era.life.forEach((l) => out.push("　" + l));
      out.push("　［この時期の画に出せるもの］" + s.era.visual.join("・"));
      if (s.era.caution) out.push("　［注意］" + s.era.caution);
      out.push("");
    });

    if (era.birthYear) {
      const ng = R.anachronisms(era.region, era.birthYear + 20);
      const half = R.partial(era.region, era.birthYear + 20);
      out.push(`【${era.birthYear + 20}年（二十代）の場面で、画に出してはいけないもの】`);
      if (ng.length) {
        ng.forEach((a) => out.push(`・${a.what}（この土地に届くのは${a.from}年ごろから）`));
        out.push("　" + ng[0].note);
      } else {
        out.push("・特になし");
      }
      if (half.length) {
        out.push("");
        out.push("【まだ「入りはじめ」のもの（全戸にあるように描かない）】");
        half.forEach((a) => out.push(`・${a.what}：${a.note}`));
      }
    }

    if (era.birthYear && era.deathYear) {
      const a0 = era.stages[0], a1 = era.stages[era.stages.length - 1];
      if (a0 && a1 && a0.era !== a1.era) {
        out.push("");
        out.push("【この一生で起きた変化（物語の軸にする）】");
        out.push(`・${a0.year}年：${a0.era.head}`);
        out.push(`・${a1.year}年：${a1.era.head}`);
        out.push("・一人の人間が、文明の変わりめを丸ごと通り抜けている。「昔の人」ではなく、そこを描く。");
      }
    }

    const pe = (era.region.prefEvents || []).filter(
      (e) => e.y >= (era.birthYear || 0) && e.y <= (era.deathYear || 9999));
    if (pe.length) {
      out.push("");
      out.push(`【${era.region.pref}で起きたこと（全国年表には出てこない）】`);
      pe.forEach((e) => out.push(`・${e.y}年（${toGengo(e.y)}）${era.birthYear ? e.y - era.birthYear + "歳　" : ""}${e.t}`));
    }

    if (era.region.contrasts && era.region.contrasts.length) {
      out.push("");
      out.push("【同じ県のなかの時差 —— ここが物語になる】");
      era.region.contrasts.forEach((c) => {
        out.push(`・${c.what}：${c.city}年 ${c.cityNote} ／ ${c.village}年 ${c.villageNote}`);
        out.push("　" + c.line);
      });
    }

    out.push("");
    out.push("【出典】");
    era.region.sources.forEach((s) => out.push(`・${s.title} ${s.url}`));
  }

  if (window.Yomi) {
    const src = [person.name, person.kaimyo, person.place, person.memo, person.story,
                 person.birth, person.death].filter(Boolean).join(" ");
    const y = window.Yomi.check(src);
    if (y.known.length || y.ambiguous.length) {
      out.push("");
      out.push("【読みの注意（ナレーション用）】");
      y.known.forEach((k) => out.push(`・${k.word} → ${k.yomi}`));
      y.ambiguous.forEach((a) => {
        out.push(`・${a.word} … 読みが割れる（${a.cands.join(" ／ ")}）`);
        out.push("　　前後を含めた言い回しで読みを決める。");
      });
      out.push("※ ここに無い固有名詞は、コトバンク（kotobank.jp）と Weblio（weblio.jp）で確かめて、辞書に足す。");
    }
  }

  out.push("");
  out.push("【映像への反映】");
  out.push("・写真に写っている範囲は、いっさい作り変えない。服装も背景も持ち物も、写っているまま。");
  out.push("・足すのは、写真が撮られた数秒の時間の流れだけ（表情・視線・呼吸・わずかな風）。");
  out.push("・カラー化する場合は、写真そのものを塗り替えるのではなく、映像のなかで白黒から色が入る形にする（お顔が保てる）。");
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
