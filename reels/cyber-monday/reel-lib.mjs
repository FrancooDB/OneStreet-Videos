// Librería genérica para reels verticales con componentes del registry de HyperFrames.
// Lee los componentes instalados (compositions/...), genera variantes por instancia en
// compositions/gen/ y deja intactos los originales. Nada de acá es específico de OneStreet.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const f3 = (n) => (+n).toFixed(3);

// ── Tiempo: EDL en frames de la fuente -> tiempo editado ──
export function timeMap(edl, fps) {
  let acc = 0;
  const segs = edl.map(([a, b]) => { const s = { a: a / fps, b: b / fps, off: acc }; acc += (b - a) / fps; return s; });
  const dur = +acc.toFixed(4);
  const T = (src) => {
    for (const s of segs) if (src >= s.a - 1e-6 && src < s.b) return +(s.off + src - s.a).toFixed(3);
    const next = segs.find((s) => s.a > src);
    return next ? +next.off.toFixed(3) : dur;
  };
  return { T, dur, segs, cuts: segs.slice(1).map((s) => +s.off.toFixed(3)) };
}

// ── Transcripción palabra a palabra (formato @remotion/captions) -> palabras editadas ──
export function editedWords(captions, map, { accent = () => false } = {}) {
  const out = [];
  for (const c of captions) {
    const raw = c.text;
    const glued = !/^\s/.test(raw) && out.length; // "%" pegado a la palabra anterior
    const src = c.startMs / 1000;
    if (src < map.segs[0].a - 0.05) continue; // antes del recorte de apertura
    const text = raw.trim().replace(/[.,]$/, '').toUpperCase();
    const prev = out[out.length - 1];
    // cifras: "24"+"MIL", "3"+"Y 6" y "20"+"%" van juntas en el mismo subtítulo
    const afterNumber = prev && /\d$/.test(prev.text) && /^(MIL|Y \d+)$/.test(text);
    if (glued || afterNumber) { prev.text += afterNumber ? ` ${text}` : text; prev.end = map.T(c.endMs / 1000); continue; }
    out.push({ text, start: map.T(src), end: map.T(c.endMs / 1000), src });
  }
  for (const w of out) w.accent = accent(w);
  return out;
}

// ── Marca: lee el objeto `color` de src/brand.ts (fuente única) sin importar Remotion ──
export function readBrandColors(brandTsPath) {
  const src = readFileSync(brandTsPath, 'utf8');
  const block = src.match(/export const color = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error(`${brandTsPath}: no encuentro "export const color"`);
  const colors = Object.fromEntries([...block[1].matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
  for (const k of ['moka', 'cream', 'charcoal', 'pewter', 'rust']) if (!colors[k]) throw new Error(`brand.ts: falta color.${k}`);
  return colors;
}

// ── Variantes de componentes ──
export class Project {
  constructor(dir) { this.dir = dir; mkdirSync(join(dir, 'compositions/gen'), { recursive: true }); }
  read(rel) { return readFileSync(join(this.dir, rel), 'utf8'); }
  // Copia un componente con reemplazos exactos; falla si un reemplazo no aplica (evita adaptaciones silenciosas).
  variant(srcRel, outName, replacements) {
    let s = this.read(srcRel);
    for (const [from, to] of replacements) {
      if (from instanceof RegExp) { if (!from.test(s)) throw new Error(`${srcRel}: no matchea ${from}`); s = s.replace(from, to); }
      else { if (!s.includes(from)) throw new Error(`${srcRel}: no encuentra «${from.slice(0, 60)}»`); s = s.split(from).join(to); }
    }
    const rel = `compositions/gen/${outName}.html`;
    writeFileSync(join(this.dir, rel), s);
    return rel;
  }
}

// Monta un sub-componente: div host con caja, tokens CSS y variables por instancia.
export function mount({ id, comp, src, start, dur, track, box, tokens = {}, vars, z = 5, w = 1080, h = 1920 }) {
  const style = [`position:absolute`, `left:${box[0]}px`, `top:${box[1]}px`, `width:${box[2]}px`, `height:${box[3]}px`, `z-index:${z}`,
    ...Object.entries(tokens).map(([k, v]) => `${k}:${v}`)].join(';');
  const v = vars ? ` data-variable-values='${JSON.stringify(vars).replace(/'/g, '&#39;')}'` : '';
  return `<div id="${id}" data-composition-id="${comp}" data-composition-src="${src}" data-start="${f3(start)}" data-duration="${f3(dur)}" data-track-index="${track}" data-width="${w}" data-height="${h}" style="${style}"${v}></div>`;
}

// ── Audio: reparte efectos en pistas sin solaparse ──
export function audioTags(cues, firstTrack = 11) {
  const ends = [];
  return cues.sort((a, b) => a.t - b.t).map((c, i) => {
    const t = Math.max(0, c.t);
    let k = ends.findIndex((e) => e <= t - 0.01);
    if (k < 0) { k = ends.length; ends.push(0); }
    ends[k] = t + c.dur;
    return `<audio id="sfx${i}" src="${c.file}" data-start="${f3(t)}" data-duration="${f3(c.dur)}" data-track-index="${firstTrack + k}" data-volume="${c.vol}"></audio>`;
  }).join('\n');
}
