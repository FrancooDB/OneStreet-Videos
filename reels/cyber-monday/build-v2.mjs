// Reel OneStreet Cyber Monday — v2 con componentes del registry de HyperFrames.
// Reutiliza de la v1: assets/cut.mp4, assets/voice.wav, EDL, transcripción y logos.
import { writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { timeMap, editedWords, Project, mount, audioTags, f3, readBrandColors } from './reel-lib.mjs';
import captionsSrc from './assets/transcript-source.json' with { type: 'json' };

const P = new Project(new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const EDL = [[139, 223], [230, 366], [374, 920], [927, 997]]; // invariante (v1)
const M = timeMap(EDL, 30);
const { T, dur: DUR, cuts } = M;

// ── Marca: colores de src/brand.ts y logos de public/brand (fuente única del repo) ──
const ROOT = join(P.dir, '../..');
const B = readBrandColors(join(ROOT, 'src/brand.ts'));
mkdirSync(join(P.dir, 'assets/brand'), { recursive: true });
for (const f of ['logo-wordmark.png', 'logo-isotype.png']) copyFileSync(join(ROOT, 'public/brand', f), join(P.dir, 'assets/brand', f));
const FONT = "'Poppins', sans-serif";

const SFX = { // archivo, duración, offset del pico
  whoosh: ['assets/sfx/whoosh-short.mp3', 0.575, 0.16], bass: ['assets/sfx/impact-bass-1.mp3', 2.116, 0.073],
  bass2: ['assets/sfx/impact-bass-2.mp3', 2.592, 0.08], click: ['assets/sfx/click-soft.mp3', 0.366, 0.071],
  pop: ['assets/sfx/pop.mp3', 0.72, 0.117], key: ['assets/sfx/key-press.mp3', 0.4, 0.079],
  ping: ['assets/sfx/ping.mp3', 1.32, 0.323], sparkle: ['assets/sfx/sparkle.mp3', 1.802, 0.025],
};
const cues = [];
const hit = (name, at, vol) => { const [file, d, peak] = SFX[name]; cues.push({ file, dur: d, t: at - peak, vol }); };

const html = []; const tl = [];

// ── 1. Subtítulos: caption-pill-karaoke (palabra activa) ──
const OFFER = /\d|CYBER|MONDAY|GRATIS|CUOTAS|%/;
const words = editedWords(captionsSrc, M, { accent: (w) => OFFER.test(w.text) });
const ctaIn = T(28.62) - 0.05;
const capRel = P.variant('compositions/components/caption-pill-karaoke.html', 'captions', [
  [/<link[^>]*fonts\.g[^>]*>\s*/g, ''],
  ['width: 1920px;', 'width: 1080px;'], ['height: 1080px;', 'height: 1920px;'],
  ['bottom: 100px;', 'bottom: 380px;'], ['width: 1600px;', 'width: 900px;'],
  ['background: #e7e5e7;', `background: rgba(29, 24, 21, 0.9); border: 2px solid rgba(247, 247, 237, 0.35);`],
  ['box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);', 'box-shadow: none;'],
  ['padding: 18px 60px 20px;', 'padding: 10px 40px 14px;'],
  ['font-weight: 700;\n        line-height: 1.16;', 'font-weight: 800;\n        font-style: italic;\n        line-height: 1.16;'],
  ['data-width="1920"', 'data-width="1080"'], ['data-height="1080"', 'data-height="1920"'], ['data-duration="8"', `data-duration="${DUR}"`],
  ['var DURATION = 8;', `var DURATION = ${DUR};`], ['var SAFE_ZONE_WIDTH = 1400;', 'var SAFE_ZONE_WIDTH = 900;'],
  ['var PILL_MAX_WIDTH = 1400;', 'var PILL_MAX_WIDTH = 900;'], ['var FONT_WEIGHT = "700";', 'var FONT_WEIGHT = "italic 800";'],
  ['var BASE_FONT_SIZE = 72;', 'var BASE_FONT_SIZE = 60;'], ['var MIN_FONT_SIZE = 52;', 'var MIN_FONT_SIZE = 44;'],
  ['var MAX_WORDS_PER_GROUP = 4;', 'var MAX_WORDS_PER_GROUP = 3;'], ['var PAUSE_THRESHOLD = 0.1;', 'var PAUSE_THRESHOLD = 0.25;'],
  ['var COLOR_INACTIVE = "#A6A6A6";', 'var COLOR_INACTIVE = "rgba(247, 247, 237, 0.45)";'],
  ['var COLOR_ACTIVE = "#1C1E1D";', `var COLOR_ACTIVE = "${B.cream}";`],
  [/var TRANSCRIPT = \[[\s\S]*?\];/, `var TRANSCRIPT = ${JSON.stringify(words.map(({ text, start, end, accent }) => ({ text, start, end, accent })))};\n      var RAISE_AT = ${f3(ctaIn)};`],
  ['text: text,\n', 'text: text,\n              accent: !!item.accent,\n'],
  [/\.toLowerCase\(\)/g, '.toUpperCase()'],
  ['pillEl.className = "caption-pill";', `pillEl.className = "caption-pill";\n          if (group.words.some(function (w) { return w.accent; })) pillEl.style.background = "${B.rust}";`],
]);
html.push(mount({ id: 'm-captions', comp: 'caption-pill-karaoke', src: capRel, start: 0, dur: DUR, track: 8, box: [0, 0, 1080, 1920], z: 9 }));

// ── 2. Apertura: logo-sting con el wordmark real ──
const logoRel = P.variant('compositions/components/logo-sting.html', 'logo-sting', [
  ['wordmark.textContent = wordmarkText;', `wordmark.innerHTML = '<span style="display:inline-flex;background:${B.cream};border-radius:50px;padding:3.5cqh 7cqw"><img src="assets/brand/logo-wordmark.png" alt="OneStreet" style="height:38cqh;display:block"></span>';`],
  ['background: #ffffff;', 'background: transparent;'], // sin flash blanco: la caja es chica y parpadea como un rectángulo
  ['data-fps="30">', 'data-fps="30" data-width="600" data-height="150">'], [/data-duration="2.2"/g, `data-duration="${f3(cuts[0] - 0.315)}"`],
]);
const whipAt = 0.04, CUT_AT = whipAt + 0.275;
html.push(mount({ id: 'm-logo', comp: 'logo-sting', src: logoRel, start: 0, dur: cuts[0] - CUT_AT, track: 2, box: [240, 50, 600, 150],
  tokens: { '--bg': 'transparent', '--brand': B.cream }, vars: { wordmark: 'OneStreet', accent: 'green' }, z: 5 }));
hit('pop', 0.55, 0.35);

// ── 3. Golpe "CYBER MONDAY": beat-accent ──
const cyber = T(6.48);
html.push(mount({ id: 'm-cyber', comp: 'beat-accent', src: 'compositions/components/beat-accent.html', start: cyber - 0.25, dur: 1.3, track: 3,
  box: [0, 150, 1080, 320], tokens: { '--bg': 'transparent', '--fg': B.cream, '--accent': B.rust, '--font-display': FONT, 'font-style': 'italic' },
  vars: { text: 'CYBER MONDAY', flashColor: 'accent', intensity: 1 }, z: 6 }));
hit('bass', cyber, 0.5);

// ── 4. Barridos en los jump cuts: whip-pan-cut con el propio video en los dos slots ──
cuts.forEach((c, i) => {
  const s = c - CUT_AT;
  const vid = (k) => `<video id="wpc${i}-${k}" src="assets/cut.mp4" data-start="0" data-duration="0.7" data-media-start="${f3(s)}" data-track-index="${k === 'a' ? 1 : 2}" muted playsinline></video>`;
  const rel = P.variant('compositions/components/whip-pan-cut.html', `whip-${i}`, [
    [/whip-pan-cut/g, `whip-pan-cut-${i}`], [/wpc-blur(?!-node)/g, `wpc-blur-${i}`],
    ['data-duration="1.2" data-fps="30">', 'data-duration="1.2" data-fps="30" data-width="1080" data-height="1920">'],
    // el video no puede vivir dentro de un div temporizado: el clip interno pasa a ser un wrapper sin tiempo
    [/class="wpc-clip clip"\s*data-start="0"\s*data-duration="1.2"\s*data-track-index="0"/, 'class="wpc-clip"'],
    [/(<div class="wpc-slot" data-slot="before">)[\s\S]*?(<\/div>\s*<\/section>)/, `$1${vid('a')}$2`],
    [/(<div class="wpc-slot" data-slot="after">)[\s\S]*?(<\/div>\s*<\/section>)/, `$1${vid('b')}$2`],
  ]);
  html.push(mount({ id: `m-whip${i}`, comp: `whip-pan-cut-${i}`, src: rel, start: s, dur: 0.7, track: 1, box: [0, 0, 1080, 1920],
    tokens: { '--bg': '#000', '--brand': B.cream }, vars: { direction: i % 2 ? 'right' : 'left', whip_at: whipAt, accent: 'green', exit: 'none' }, z: 2 }));
  hit('whoosh', c, 0.45);
});

// ── 5. Lista de ofertas: mk-specs-list (filas borrosas = loop abierto, se revelan al decirlas) ──
const listStart = T(10.88) - 0.2, listEnd = T(19.5);
const rows = [
  { label: '3 Y 6 CUOTAS', value: 'SIN INTERÉS', at: T(10.88) },
  { label: '20% OFF', value: 'EN TRANSFERENCIA', at: T(12.72) },
  { label: 'ENVÍO GRATIS', value: 'DESDE $90.000', at: T(17.66) },
];
const LD = listEnd - listStart;
const listRel = P.variant('compositions/mk-specs-list.html', 'offers-list', [
  ['width: 1920px;\n        height: 1080px;', 'width: 1080px;\n        height: 1920px;'],
  ['--mk-font: "Inter", -apple-system, sans-serif;', `--mk-font: ${FONT};`], ['--mk-ink: #1d1d1f;', `--mk-ink: ${B.charcoal};`],
  ['--mk-ink-dim: #6e6e73;', `--mk-ink-dim: ${B.pewter};`], ['--mk-accent: #0071e3;', `--mk-accent: ${B.rust};`],
  ['flex-direction: column;\n      }', `flex-direction: column;\n        width: 900px;\n        padding: 38px 46px 42px;\n        border-radius: 36px;\n        background: ${B.cream};\n      }`],
  ['font-weight: 600;\n        font-size: 46px;', 'font-weight: 800;\n        font-style: italic;\n        font-size: 52px;'],
  ['font-weight: 400;\n        font-size: 40px;', 'font-weight: 800;\n        font-size: 30px;\n        letter-spacing: 0.06em;'],
  [/data-duration="8"/g, `data-duration="${f3(LD)}"`], ['data-width="1920"', 'data-width="1080"'], ['data-height="1080"', 'data-height="1920"'],
  [/rows: \[[\s\S]*?\],\n/, `rows: ${JSON.stringify(rows.map((r) => ({ label: r.label, value: r.value, at: +(r.at - listStart).toFixed(3) })))},\n`],
  ['lineWidth: 660,', 'lineWidth: 808,'], ['x: 160,', 'x: 90,'], ['rowGap: 44,', 'rowGap: 30,'],
  ['var DUR = 8;', `var DUR = ${f3(LD)};`],
  ['Math.round((1080 - colH) / 2) + "px"', '"960px"'],
  ['var t0 = (CONFIG.animationIn ? 0.3 : 0) + i * CONFIG.stagger;', 'var t0 = r.at;'],
  ['gsap.set(row, { opacity: 0, x: -36 });', 'gsap.set(row, { opacity: 0.35, x: 0, filter: "blur(12px)" });'],
  ['tl.to(row, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, t0);', 'tl.to(row, { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power2.out" }, t0 - 0.04);'],
  ['var tl = gsap.timeline({ paused: true });', 'var tl = gsap.timeline({ paused: true });\n        tl.from(col, { y: 80, rotation: -3, opacity: 0, duration: 0.35, ease: "back.out(1.6)" }, 0);'],
]);
html.push(mount({ id: 'm-list', comp: 'mk-specs-list', src: listRel, start: listStart, dur: LD, track: 4, box: [0, 0, 1080, 1920], z: 6 }));
rows.forEach((r) => hit('click', r.at, 0.55));
hit('sparkle', rows[2].at, 0.3);

// ── 6. Precios: count-up dentro de una etiqueta ──
const countVariant = (id) => P.variant('compositions/components/count-up.html', `count-up-${id}`, [
  [/count-up/g, `count-up-${id}`],
  ['data-duration="3" data-fps="30">', 'data-duration="3" data-fps="30" data-width="760" data-height="270">'],
  ['return Math.round(value).toLocaleString("en-US");', 'return "\u200B" + Math.round(value).toLocaleString("es-AR");'],
  ['var IN_BASE = 2.05;', 'var IN_BASE = 0.7;'], ['var COUNT_BASE = 1.72;', 'var COUNT_BASE = 0.45;'],
]);
const prices = [
  { id: 'berm', label: 'BERMUDAS DESDE', value: 24000, cardFrom: T(22.84) - 0.05, countAt: T(23.28), to: T(24.74) },
  { id: 'rem', label: 'REMERAS DESDE', value: 13000, cardFrom: T(24.8) - 0.05, countAt: T(25.22), to: T(27.7) },
];
for (const p of prices) {
  html.push(`<div id="card-${p.id}" class="clip pcard" data-start="${f3(p.cardFrom)}" data-duration="${f3(p.to - p.cardFrom)}" data-track-index="5"><div class="pc-in"><div class="pc-label">${p.label}</div></div></div>`);
  tl.push(`tl.from('#card-${p.id} .pc-in',{y:90,rotation:-6,scale:.85,opacity:0,duration:.34,ease:'back.out(1.7)'},${f3(p.cardFrom)});`);
  tl.push(`tl.to('#card-${p.id} .pc-in',{y:30,scale:.92,opacity:0,duration:.2,ease:'power2.in'},${f3(p.to - 0.2)});`);
  tl.push(`tl.set('#card-${p.id} .pc-in',{opacity:0},${f3(p.to)});`);
  const cdur = p.to - p.countAt;
  html.push(mount({ id: `m-${p.id}`, comp: `count-up-${p.id}`, src: countVariant(p.id), start: p.countAt, dur: cdur, track: 7, box: [160, 1050, 760, 270],
    tokens: { '--brand': B.rust, '--fg': B.charcoal, '--font-display': FONT, 'font-style': 'italic' },
    vars: { start: 0, end: p.value, prefix: '$', suffix: '', accent: 'green', glow: false, exit: 'none' }, z: 7 }));
  const count = 0.45 * Math.min(1, cdur / 0.7); // COUNT con la compresión del componente (IN 0.7, sin OUT)
  hit('pop', p.cardFrom + 0.05, 0.3);
  for (let t = 0; t < count - 0.05; t += 0.09) hit('key', p.countAt + t, 0.16);
  hit('ping', p.countAt + count, 0.32);
}

// ── 7. Camera: helpers de yt-camera-move sobre el video ──
const camHelpers = P.read('compositions/components/yt-camera-move.html').match(/\/\/ ---- copy these helpers into the host script ----([\s\S]*?)\/\/ Self-preview timeline/)[1];
const O = "'50% 32%'";
const cam = [
  `ytCameraMove(tl,'#frame',0,{zoom:.05,dur:${f3(cuts[0] - CUT_AT)},ease:'none',origin:${O}});`,
  `tl.set('#frame',{scale:1,x:0,y:0,rotationX:0,rotationY:0},${f3(cuts[0])});`,
  `ytCameraMove(tl,'#frame',${f3(T(10.38))},{zoom:.1,tilt:2,dur:.5,ease:'power3.out',origin:${O}});`,
  `ytDefocusPulse(tl,'#defocus',${f3(T(10.38))},.5);`,
  `tl.set('#frame',{scale:1,x:0,y:0,rotationX:0,rotationY:0},${f3(cuts[1])});`,
  `ytCameraMove(tl,'#frame',${f3(T(12.72))},{zoom:.08,dur:.3,ease:'power3.out',origin:${O}});`,
  `ytCameraReset(tl,'#frame',${f3(T(14.94))},{dur:.6});`,
  `ytCameraMove(tl,'#frame',${f3(T(17.66))},{zoom:.06,pan:-2,dur:.5,ease:'power3.out',origin:${O}});`,
  `ytCameraReset(tl,'#frame',${f3(T(19.62))},{dur:.8});`,
  `ytCameraMove(tl,'#frame',${f3(T(22.84))},{zoom:.07,pan:3,dur:1.4,ease:'sine.inOut',origin:${O}});`,
  `ytDefocusPulse(tl,'#defocus',${f3(T(22.84))},1.2);`,
  `ytCameraReset(tl,'#frame',${f3(T(24.8))},{dur:.6});`,
  `tl.set('#frame',{scale:1,x:0,y:0,rotationX:0,rotationY:0},${f3(cuts[2])});`,
  `ytCameraMove(tl,'#frame',${f3(cuts[2])},{zoom:.06,dur:${f3(DUR - cuts[2])},ease:'none',origin:${O}});`,
];

// ── 8. CTA: banda moka + cta-lockup ──
html.push(`<div id="cta-band" class="clip" data-start="${f3(ctaIn)}" data-duration="${f3(DUR - ctaIn)}" data-track-index="6"></div>`);
tl.push(`tl.from('#cta-band',{yPercent:110,duration:.4,ease:'power3.out'},${f3(ctaIn)});`);
const ctaRel = P.variant('compositions/components/cta-lockup.html', 'cta-lockup', [
  ['font-size: min(10cqw, 14cqh);', 'font-size: 64px;'], ['margin: 0 0 6.5cqh;', 'margin: 0 0 22px;'],
  ['font-size: min(4.3cqw, 6.8cqh);', 'font-size: 46px;'], ['padding: 3.2cqh 5.5cqw;', 'padding: 18px 44px;'],
  ['margin: 0 0 3.8cqh;', 'margin: 0 0 18px;'], ['font-size: min(3cqw, 4.2cqh);', 'font-size: 34px;'],
  ['width: min(88cqw, 150cqh);', 'width: 1000px;'],
  [/data-duration="4"/g, `data-duration="${f3(DUR - ctaIn - 0.15)}"`],
  ['data-fps="30">', 'data-fps="30" data-width="1080" data-height="370">'],
]);
html.push(mount({ id: 'm-cta', comp: 'cta-lockup', src: ctaRel, start: ctaIn + 0.15, dur: DUR - ctaIn - 0.15, track: 9,
  box: [0, 990, 1080, 370], tokens: { '--fg': B.cream, '--brand': B.cream, '--muted': 'rgba(247,247,237,0.82)', '--font-display': FONT, '--font-body': FONT, 'font-style': 'italic' },
  vars: { action_line: 'LOS ESPERAMOS EN', button_label: 'CALLE CERVANTES 35', microcopy: 'ENVÍO A TODO EL PAÍS', accent: 'green' }, z: 8 }));
hit('bass2', ctaIn + 0.3, 0.4);
hit('pop', ctaIn + 0.75, 0.3);

// ── Composición raíz ──
const out = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>OneStreet Cyber Monday v2</title>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:'Poppins';font-weight:800;font-style:normal;src:url(assets/fonts/Poppins-ExtraBold.ttf)}
@font-face{font-family:'Poppins';font-weight:800;font-style:italic;src:url(assets/fonts/Poppins-ExtraBoldItalic.ttf)}
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000;font-family:${FONT}}
#reel{position:relative;width:1080px;height:1920px;overflow:hidden;background:#000}
#frame{position:absolute;inset:0;transform-origin:50% 32%}
#frame video{width:1080px;height:1920px;object-fit:cover;display:block}
.yt-cm-defocus{position:absolute;inset:0;pointer-events:none;opacity:0;z-index:1;backdrop-filter:blur(7px);-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,transparent 58%,rgba(0,0,0,.85) 92%);mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,transparent 58%,rgba(0,0,0,.85) 92%)}
.pcard{position:absolute;left:140px;top:990px;width:800px;height:340px;z-index:6}
.pc-in{width:100%;height:100%;background:${B.cream};border-radius:28px;border-left:18px solid ${B.moka};padding-top:30px;text-align:center}
.pc-label{font-weight:800;font-size:38px;letter-spacing:.1em;color:${B.pewter}}
#cta-band{position:absolute;left:0;right:0;top:990px;height:370px;background:${B.moka};z-index:7}
</style></head><body>
<div id="reel" data-composition-id="reel" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
<div id="frame"><video id="v" src="assets/cut.mp4" data-start="0" data-duration="${DUR}" data-track-index="0" muted playsinline></video></div>
<div id="defocus" class="yt-cm-defocus"></div>
<audio id="voice" src="assets/voice.wav" data-start="0" data-duration="${DUR}" data-track-index="10" data-volume="1"></audio>
${audioTags(cues)}
${html.join('\n')}
</div>
<script>
${camHelpers}
const tl=gsap.timeline({paused:true});
${cam.join('\n')}
${tl.join('\n')}
window.__timelines=window.__timelines||{};window.__timelines['reel']=tl;
</script></body></html>
`;
writeFileSync(new URL('./index.html', import.meta.url), out);
writeFileSync(new URL('./assets/plan-v2.json', import.meta.url), JSON.stringify({ duration: DUR, cuts, ctaIn, rows, prices, sfx: cues }, null, 2));
console.log('v2 ok', { DUR, cuts, palabras: words.length, sfx: cues.length });
