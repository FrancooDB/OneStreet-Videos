// Genera index.html del reel OneStreet Cyber Monday a partir del EDL y la transcripción.
// Tiempos de fuente (IMG_6182.mov) -> tiempos editados con el mismo mapa que se usó en el corte.
import { writeFileSync } from 'node:fs';

const FPS = 30;
// EDL en frames de la fuente: [inicio, fin)
const EDL = [[139, 223], [230, 366], [374, 920], [927, 997]];
let acc = 0;
const SEG = EDL.map(([a, b]) => { const s = { a: a / FPS, b: b / FPS, off: acc }; acc += (b - a) / FPS; return s; });
const DUR = +acc.toFixed(4);
const T = (src) => {
  for (const s of SEG) if (src >= s.a - 1e-6 && src < s.b) return +(s.off + src - s.a).toFixed(3);
  const next = SEG.find((s) => s.a > src);
  return next ? +next.off.toFixed(3) : DUR;
};
const LEAD = 2 / FPS; // los subtítulos aparecen 2 frames antes de la palabra

// Subtítulos: 1-3 palabras por frase. accent = cifra de oferta (rust, exclusivo de ofertas).
const CAP = [
  [4.76, 'ARRANCAMOS'], [5.14, 'LA SEMANA'], [5.56, 'EN ONESTREET'], [6.2, 'CON EL'],
  [6.48, 'CYBER MONDAY', 1], [7.92, 'TODOS LOS PEDIDOS'], [9.24, 'FUERON DE ANOCHE'],
  [10.38, 'TENEMOS'], [10.88, '3 Y 6 CUOTAS', 1], [11.72, 'SIN INTERÉS'],
  [12.72, '20% DE DESCUENTO', 1], [13.66, 'EN TRANSFERENCIA'], [14.94, 'Y CON COMPRAS'],
  [15.58, 'DE 90 MIL PESOS', 1], [16.86, 'O MÁS'], [17.46, 'HAY ENVÍO GRATIS', 1],
  [18.2, 'EN TODA ARGENTINA'], [19.62, 'TAMBIÉN APLICAMOS'], [20.16, 'EL DESCUENTO'],
  [20.92, 'EN TODO EL LOCAL'], [22.02, 'TENEMOS BERMUDAS'], [23.28, 'DESDE 24 MIL', 1],
  [24.8, 'REMERAS'], [25.22, 'DESDE 13 MIL', 1], [26.58, 'Y MUCHAS'], [27.18, 'PROMOS MÁS'],
  [28.06, 'ASÍ QUE'], [28.36, 'LOS ESPERAMOS'], [28.96, 'EN CALLE'], [29.34, 'CERVANTES 35'],
  [31.22, 'Y CON ENVÍO'], [31.92, 'A TODO EL PAÍS'],
];
const caps = CAP.map(([src, text, accent], i) => {
  const start = Math.max(0, T(src) - LEAD);
  const end = i + 1 < CAP.length ? Math.max(0, T(CAP[i + 1][0]) - LEAD) : DUR;
  return { id: `cap${i}`, start: +start.toFixed(3), dur: +(end - start).toFixed(3), text, accent: !!accent };
});

// Tarjetas de oferta, ancladas a la palabra que las dice (tiempo de fuente).
const CARDS = [
  { id: 'c-cuotas', from: 10.88, to: 12.66, html: `<div class="big rust">3 Y 6</div><div class="sub">CUOTAS SIN INTERÉS</div>` },
  { id: 'c-transf', from: 12.72, to: 14.88, html: `<div class="big rust">20%</div><div class="sub">OFF EN TRANSFERENCIA</div>` },
  { id: 'c-envio', from: 15.74, to: 19.5, html: `<div class="eyebrow">COMPRAS DE $90.000 O MÁS</div><div class="mid r1">ENVÍO GRATIS</div><div class="sub r2">A TODA ARGENTINA</div>`,
    reveals: [['.r1', 17.66], ['.r2', 18.3]] },
  { id: 'c-local', from: 20.92, to: 21.98, html: `<div class="eyebrow">EL DESCUENTO</div><div class="mid">TAMBIÉN EN EL LOCAL</div>` },
  { id: 'c-bermudas', from: 22.84, to: 24.74, html: `<div class="eyebrow">BERMUDAS</div><div class="price r1">DESDE <span class="rust">$24.000</span></div>`, reveals: [['.r1', 23.28]], tag: true },
  { id: 'c-remeras', from: 24.8, to: 26.5, html: `<div class="eyebrow">REMERAS</div><div class="price r1">DESDE <span class="rust">$13.000</span></div>`, reveals: [['.r1', 25.22]], tag: true },
];

// Cortes reales (jump cuts) en tiempo editado: alternamos el encuadre para disimularlos.
const cutTimes = SEG.slice(1).map((s) => +s.off.toFixed(3));
const SCALE = [1.0, 1.0, 1.12, 1.0];

// Sonido: pocos efectos, sólo donde algo aterriza.
const SFX = [
  { id: 's-logo', file: 'hit', t: 0.03, vol: 0.28 },
  { id: 's-cyber', file: 'whoosh', t: T(6.48) - 0.22, vol: 0.3 },
  { id: 's-cuotas', file: 'hit', t: T(10.88), vol: 0.35 },
  { id: 's-transf', file: 'whoosh', t: T(12.72) - 0.22, vol: 0.3 },
  { id: 's-envio', file: 'ding', t: T(17.66), vol: 0.22 },
  { id: 's-berm', file: 'hit', t: T(23.28), vol: 0.3 },
  { id: 's-rem', file: 'whoosh', t: T(24.8) - 0.22, vol: 0.26 },
  { id: 's-cta', file: 'ding', t: T(29.34), vol: 0.22 },
];
const SFXDUR = { hit: 0.35, whoosh: 0.55, ding: 0.9 };

const f = (n) => (+n).toFixed(3);
const tl = [];
// Encuadre: empuje lento + saltos de escala en cada corte.
let prev = 0;
SEG.forEach((s, i) => {
  const st = +s.off.toFixed(3); const en = i + 1 < SEG.length ? +SEG[i + 1].off.toFixed(3) : DUR;
  tl.push(`tl.set('#frame',{scale:${SCALE[i]}},${f(st)});`);
  tl.push(`tl.to('#frame',{scale:${(SCALE[i] + 0.03).toFixed(2)},duration:${f(en - st)},ease:'none'},${f(st)});`);
  prev = en;
});
// Logo + Cyber Monday
const cyber = T(6.48), logoOut = T(7.92) - 0.25;
tl.push(`tl.from('#logo .pill',{y:-40,opacity:0,duration:.35,ease:'back.out(1.6)'},0);`);
tl.push(`tl.from('#logo .badge',{y:-24,rotation:-6,scale:.7,opacity:0,duration:.32,ease:'back.out(2)'},${f(cyber - 0.05)});`);
tl.push(`tl.to('#logo',{y:-60,opacity:0,duration:.25,ease:'power2.in'},${f(logoOut)});`);
// Tarjetas
for (const c of CARDS) {
  const a = T(c.from) - 0.05, b = T(c.to);
  tl.push(`tl.from('#${c.id} .card',{y:80,rotation:${c.tag ? -8 : -4},scale:.85,opacity:0,duration:.34,ease:'back.out(1.7)'},${f(a)});`);
  for (const [sel, t] of c.reveals || []) tl.push(`tl.from('#${c.id} ${sel}',{y:20,opacity:0,duration:.22,ease:'power2.out'},${f(T(t) - 0.04)});`);
  tl.push(`tl.to('#${c.id} .card',{y:30,scale:.92,opacity:0,duration:.2,ease:'power2.in'},${f(b - 0.2)});`);
  tl.push(`tl.set('#${c.id} .card',{opacity:0},${f(b)});`);
}
// CTA
const ctaIn = T(28.62) - 0.05;
tl.push(`tl.from('#cta .band',{yPercent:110,duration:.4,ease:'power3.out'},${f(ctaIn)});`);
tl.push(`tl.from('#cta .addr',{y:30,opacity:0,duration:.3,ease:'power2.out'},${f(T(29.06) - 0.04)});`);
tl.push(`tl.from('#cta .ship',{y:20,opacity:0,duration:.25,ease:'power2.out'},${f(T(31.7) - 0.04)});`);
tl.push(`tl.from('#cta .wm',{scale:.8,opacity:0,duration:.3,ease:'back.out(1.6)'},${f(ctaIn + 0.15)});`);

const cardDivs = CARDS.map((c, i) => {
  const a = T(c.from) - 0.05, b = T(c.to);
  return `<div id="${c.id}" class="clip cardwrap" data-start="${f(a)}" data-duration="${f(b - a)}" data-track-index="3"><div class="card${c.tag ? ' tag' : ''}">${c.html}</div></div>`;
}).join('\n');
const capDivs = caps.filter((c) => !(c.start >= ctaIn)).map((c) =>
  `<div id="${c.id}" class="clip capwrap" data-start="${f(c.start)}" data-duration="${f(c.dur)}" data-track-index="4"><span class="cap${c.accent ? ' accent' : ''}">${c.text}</span></div>`).join('\n');
// Durante el CTA los subtítulos suben por encima de la banda.
const capCta = caps.filter((c) => c.start >= ctaIn).map((c) =>
  `<div id="${c.id}" class="clip capwrap high" data-start="${f(c.start)}" data-duration="${f(c.dur)}" data-track-index="4"><span class="cap${c.accent ? ' accent' : ''}">${c.text}</span></div>`).join('\n');
const sfxTags = SFX.map((s, i) => `<audio id="${s.id}" src="assets/sfx/${s.file}.wav" data-start="${f(Math.max(0, s.t))}" data-duration="${SFXDUR[s.file]}" data-track-index="${11 + (i % 3)}" data-volume="${s.vol}"></audio>`).join('\n');

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>OneStreet Cyber Monday</title>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:'Poppins';font-weight:800;font-style:normal;src:url(assets/fonts/Poppins-ExtraBold.ttf)}
@font-face{font-family:'Poppins';font-weight:800;font-style:italic;src:url(assets/fonts/Poppins-ExtraBoldItalic.ttf)}
:root{--moka:#3F2B24;--cream:#F7F7ED;--charcoal:#1D1815;--rust:#B24A3B;--pewter:#7D736E}
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000;font-family:'Poppins',sans-serif}
#reel{position:relative;width:1080px;height:1920px;overflow:hidden;background:#000}
#frame{position:absolute;inset:0;transform-origin:50% 30%}
#frame video{width:1080px;height:1920px;object-fit:cover;display:block}
#logo{position:absolute;left:0;right:0;top:120px;display:flex;flex-direction:column;align-items:center;gap:18px;z-index:5}
#logo .pill{background:var(--cream);border-radius:50px;padding:20px 44px;display:flex}
#logo .pill img{height:62px;display:block}
#logo .badge{background:var(--rust);color:var(--cream);font-style:italic;font-weight:800;font-size:44px;letter-spacing:.04em;padding:10px 30px;border-radius:50px}
.cardwrap{position:absolute;left:0;right:0;top:1000px;display:flex;justify-content:center;z-index:6}
.card{background:var(--cream);color:var(--charcoal);border-radius:36px;padding:34px 56px 38px;text-align:center;min-width:600px;max-width:900px}
.card.tag{border-radius:22px;border-left:18px solid var(--moka)}
.big{font-style:italic;font-weight:800;font-size:200px;line-height:.95;letter-spacing:-.02em}
.mid{font-style:italic;font-weight:800;font-size:86px;line-height:1.05}
.price{font-style:italic;font-weight:800;font-size:92px;line-height:1.05}
.sub{font-weight:800;font-size:44px;letter-spacing:.04em;margin-top:8px}
.eyebrow{font-weight:800;font-size:36px;letter-spacing:.1em;color:var(--pewter);margin-bottom:6px}
.rust{color:var(--rust)}
.capwrap{position:absolute;left:90px;right:90px;top:1460px;display:flex;justify-content:center;z-index:7}
.capwrap.high{top:1000px}
.cap{background:rgba(29,24,21,.9);border:2px solid rgba(247,247,237,.35);color:var(--cream);font-style:italic;font-weight:800;font-size:62px;line-height:1.1;padding:10px 28px 14px;border-radius:18px;white-space:nowrap}
.cap.accent{background:var(--rust);border-color:rgba(247,247,237,.55)}
#cta{position:absolute;left:0;right:0;bottom:0;height:1920px;z-index:6}
#cta .band{position:absolute;left:0;right:0;top:1160px;height:440px;background:var(--moka);color:var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
#cta .wm{background:var(--cream);border-radius:50px;padding:16px 38px;display:flex}
#cta .wm img{height:54px;display:block}
#cta .addr{font-style:italic;font-weight:800;font-size:84px;line-height:1}
#cta .ship{font-weight:800;font-size:38px;letter-spacing:.08em;opacity:.85}
</style></head><body>
<div id="reel" data-composition-id="reel" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
<div id="frame"><video id="v" src="assets/cut.mp4" data-start="0" data-duration="${DUR}" data-track-index="0" muted playsinline></video></div>
<audio id="voice" src="assets/voice.wav" data-start="0" data-duration="${DUR}" data-track-index="10" data-volume="1"></audio>
${sfxTags}
<div id="logo" class="clip" data-start="0" data-duration="${f(logoOut + 0.3)}" data-track-index="2"><div class="pill"><img src="assets/brand/logo-wordmark.png" alt="OneStreet"></div><div class="badge">CYBER MONDAY</div></div>
${cardDivs}
${capDivs}
${capCta}
<div id="cta" class="clip" data-start="${f(ctaIn)}" data-duration="${f(DUR - ctaIn)}" data-track-index="5"><div class="band"><div class="wm"><img src="assets/brand/logo-wordmark.png" alt="OneStreet"></div><div class="addr">CALLE CERVANTES 35</div><div class="ship">ENVÍO A TODO EL PAÍS</div></div></div>
</div>
<script>
const tl=gsap.timeline({paused:true});
${tl.join('\n')}
window.__timelines=window.__timelines||{};window.__timelines['reel']=tl;
</script></body></html>
`;
writeFileSync(new URL('./index.html', import.meta.url), html);
writeFileSync(new URL('./assets/edl.json', import.meta.url), JSON.stringify({ fps: FPS, source: 'IMG_6182.mov', segmentsFrames: EDL, duration: DUR, cuts: cutTimes }, null, 2));
console.log('index.html ok, duración', DUR, 'cortes', cutTimes);
