import io
# ---- api/video.js ----
p="api/video.js"; s=io.open(p,encoding="utf-8").read()

old_neg = '''  const negative =
    "色をつける, カラー化, 別人になる, 帽子や眼鏡や持ち物が消える, 文字, 字幕, 透かし, ロゴ, 枠, 分割画面, 急なカット, 大きく動く";
'''
new_neg = '''  // 白黒のまま残すか、色を入れるか
  const wantColor = body.color === true || body.color === "color";
  const keepBW = "色をつける, カラー化, ";
  const common =
    "別人になる, 顔が変わる, 帽子や眼鏡や持ち物が消える, 文字, 字幕, 透かし, ロゴ, 枠, 分割画面, 急なカット, 大きく動く";
  const negative = wantColor
    ? "けばけばしい色, 彩度が高すぎる, ネオン, 塗り絵のような色, " + common
    : keepBW + common;
'''
assert old_neg in s
s = s.replace(old_neg, new_neg, 1)

old_pr = '''  const prompt = (body.prompt || "").toString().slice(0, 2000).trim() ||
    "古い記念写真が、静かに動きはじめる。写っている人だけが、ほんの数秒ぶんの時間を過ごす。";
'''
new_pr = '''  let prompt = (body.prompt || "").toString().slice(0, 2000).trim() ||
    "古い記念写真が、静かに動きはじめる。写っている人だけが、ほんの数秒ぶんの時間を過ごす。";
'''
assert old_pr in s
s = s.replace(old_pr, new_pr, 1)

anchor = '''  const payload = {
    image_url: image,'''
add = '''  if (wantColor) {
    prompt += "\\n\\nはじめの三秒ほどで、白黒の画面にゆっくりと自然な色が入っていく。落ち着いた、色あせた古いカラー写真のような色みで、けばけばしくしない。肌の色は自然に。顔立ち・服装・持ちものは、白黒のときと同じまま変えない。";
  } else {
    prompt += "\\n\\n白黒のまま。色はつけない。";
  }

  const payload = {
    image_url: image,'''
assert anchor in s
s = s.replace(anchor, add, 1)
io.open(p,"w",encoding="utf-8").write(s)
print("api patched")

# ---- tsukuru.html ----
p="tsukuru.html"; s=io.open(p,encoding="utf-8").read()

# 生成UIの上に、色の選び方を置く
a = '''function drawMvGen(){
  const box = $("mvGen");
  if (!mvPhotos.length) { box.innerHTML = ""; return; }
  box.innerHTML = mvPhotos.map((x, i) => {'''
b = '''let mvColor = "bw";   // "bw" = 白黒のまま / "color" = 色を入れる
function drawMvGen(){
  const box = $("mvGen");
  if (!mvPhotos.length) { box.innerHTML = ""; return; }
  const pick = `<div class="colorpick">
      <span class="cp-t">仕上がりの色</span>
      <label><input type="radio" name="mvcolor" value="bw"${mvColor === "bw" ? " checked" : ""}> 白黒のまま</label>
      <label><input type="radio" name="mvcolor" value="color"${mvColor === "color" ? " checked" : ""}> 色を入れる</label>
      <p class="cp-n">「色を入れる」は、白黒からゆっくり色が入る形にします。お顔や服装は変わりません。<br>お写真そのものを塗り替えるわけではないので、記録としての白黒も残ります。</p>
    </div>`;
  box.innerHTML = pick + mvPhotos.map((x, i) => {'''
assert a in s
s = s.replace(a, b, 1)

c = '''  box.querySelectorAll("button[data-g]").forEach(b => {'''
d = '''  box.querySelectorAll('input[name="mvcolor"]').forEach(r => {
    r.onchange = () => { mvColor = r.value; };
  });
  box.querySelectorAll("button[data-g]").forEach(b => {'''
assert c in s
s = s.replace(c, d, 1)

css = '''
.colorpick{margin:0 0 18px;padding:14px 16px;border:1px solid rgba(173,138,63,.28);border-radius:10px;background:rgba(255,255,255,.5)}
.colorpick .cp-t{display:block;margin-bottom:8px;font-size:13px;letter-spacing:.1em;color:#8A6D2E}
.colorpick label{display:inline-flex;align-items:center;gap:6px;margin-right:20px;font-size:14.5px;cursor:pointer}
.colorpick .cp-n{margin:10px 0 0;font-size:12px;color:#7a8090;line-height:1.7}
'''
s = s.replace("</style>", css + "</style>", 1)
io.open(p,"w",encoding="utf-8").write(s)
print("tsukuru patched")
