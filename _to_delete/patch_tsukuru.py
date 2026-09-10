import io, sys
p = "tsukuru.html"
s = io.open(p, encoding="utf-8").read()

anchor = '''    <p class="lede">撮る。選ぶ。話す。書く。下の四つから、どれでも。</p>
'''
block = anchor + '''
    <div class="sample-box">
      <p class="sample-cap">できあがりの見本</p>
      <div class="sample-vids">
        <figure>
          <video src="/assets/tsuioku_16x9.mp4" poster="/assets/poster.jpg" controls playsinline preload="metadata"></video>
          <figcaption>横向き ─ ご家族に見せる・法要で流す</figcaption>
        </figure>
        <figure class="tate">
          <video src="/assets/tsuioku_9x16.mp4" controls playsinline preload="metadata"></video>
          <figcaption>縦向き ─ スマホ・SNS</figcaption>
        </figure>
      </div>
      <p class="sample-note">お写真の中のお姿はそのまま。山・店・囲炉裏の情景は、当時の記録をもとにAIで描いたイメージです。</p>
    </div>
'''
assert anchor in s, "anchor not found"
s = s.replace(anchor, block, 1)

css = '''
.sample-box{margin:28px 0 34px;padding:22px 20px;border:1px solid rgba(173,138,63,.28);border-radius:12px;background:rgba(255,255,255,.55)}
.sample-cap{margin:0 0 14px;font-family:"Shippori Mincho",serif;font-size:15px;letter-spacing:.14em;color:#8A6D2E}
.sample-vids{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;align-items:start}
.sample-vids figure{margin:0}
.sample-vids video{width:100%;display:block;border-radius:8px;background:#0c0f1a}
.sample-vids figcaption{margin-top:8px;font-size:12.5px;color:#5a6070;line-height:1.6}
.sample-note{margin:14px 0 0;font-size:12px;color:#7a8090;line-height:1.7}
@media(max-width:720px){.sample-vids{grid-template-columns:1fr;gap:18px}.sample-vids .tate video{max-width:280px;margin:0 auto}}
'''
s = s.replace("</style>", css + "</style>", 1)
io.open(p, "w", encoding="utf-8").write(s)
print("tsukuru patched")
