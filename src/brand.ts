/**
 * ONESTREET — SSOT DE MARCA PARA VIDEO
 *
 * Única fuente de verdad visual y de copy para todos los videos de Remotion.
 * NO hardcodear colores, fuentes, radios ni textos fijos en las composiciones:
 * importar desde acá. Si la marca cambia, se cambia SOLO este archivo.
 *
 * Origen (verificado contra la tienda real):
 *  - Design system oficial: OneStreet\onestreet-design-system.md (V1.0 - 2026)
 *  - Tema Tiendanube en vivo: OneStreet\config\settings_data.json (mismos valores)
 *  - Contexto/invariantes:   OneStreet\fdb-marketing\CONTEXT.md
 *  - Logos:                  OneStreet\static\images\marca_sinfondo.png
 *
 * OBSOLETO (NO USAR): "Análisis Legacy" (azul #0c255e, dorado #d1a153, Outfit/Montserrat,
 * estética oscura glass). Fue el tema default previo; la marca real hoy es Moka + Crema + Poppins.
 */
import { staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

// ───────────────────────── 1. COLOR ─────────────────────────
export const color = {
  moka: "#3F2B24", // Signature: botones, isotipo, acentos de marca (muestreado del logo)
  mokaHover: "#593E34",
  mokaDeep: "#2A1D18",
  mokaTint: "rgba(63, 43, 36, 0.06)",
  cream: "#F7F7ED", // Vellum Cream / Bone White: fondo editorial y texto sobre Moka/Charcoal
  charcoal: "#1D1815", // Texto principal, topbar, footer
  pewter: "#7D736E", // Texto secundario, precios tachados
  rust: "#B24A3B", // ÚNICO acento: badges de oferta (descuentos, 3x2) y destacados
  white: "#FFFFFF", // Solo texto de subtítulos sobre video (con trazo charcoal)
} as const;

// ───────────────────────── 2. TIPOGRAFÍA ─────────────────────────
// Poppins Bold Italic en títulos/botones/ofertas; recto 400/500 para lectura.
const poppins = loadFont("italic", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] });
const poppinsRegular = loadFont("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const font = {
  family: `${poppins.fontFamily}, ${poppinsRegular.fontFamily}, "Segoe UI Emoji", sans-serif`,
  headingWeight: 700, // h1-h5, botones: Bold Italic
  navWeight: 600, // navegación / topbar: Semi-bold Italic
  bodyWeight: 500, // texto de lectura (recto)
  style: "italic" as const,
  transform: "uppercase" as const,
  tracking: {
    heading: "-0.01em",
    productName: "0.04em",
    ui: "0.08em", // botones
    editorial: "0.10em", // topbar / etiquetas
  },
} as const;

// ───────────────────────── 3. FORMAS ─────────────────────────
export const shape = {
  radiusPill: 50, // CTAs, badges, cards de popup
  radiusSharp: 0, // bandas editoriales de overlays (CTA a ancho completo)
  radiusImage: 15, // fotografía de producto
  borderMoka: `2px solid ${color.moka}`,
  divider: "1px solid rgba(63, 43, 36, 0.08)",
  // Diseño plano: SIN sombras de tarjeta. Profundidad por contraste de superficie.
  shadow: "none",
} as const;

// ───────────────────────── 4. LOGOS ─────────────────────────
export const logo = {
  wordmark: staticFile("brand/logo-wordmark.png"), // "OneStreet" + isotipo, Moka sobre transparente (4167x933)
  isotype: staticFile("brand/logo-isotype.png"), // solo la estrella (3374x1866)
  wordmarkAspect: 4167 / 933,
  // Moka sobre fondos claros. Sobre video/oscuro: usar dentro de una píldora crema.
} as const;

// ───────────────────────── 5. COPY DE MARCA ─────────────────────────
export const copy = {
  name: "OneStreet",
  tagline: "STREETWEAR EDITORIAL",
  // Anuncios oficiales de la topbar de la tienda (reusar tal cual en videos)
  announcements: {
    shipping: { emoji: "🚚", text: "ENVÍO GRATIS A TODO EL PAÍS" },
    installments: { emoji: "💳", text: "3 Y 6 CUOTAS SIN INTERÉS" },
    exchange: { emoji: "🔄", text: "30 DÍAS DE CAMBIO SIN CARGO" },
  },
  address: "Calle Cervantes 35",
  voice: "Directo, urbano, seguro. Sin humo ni ofertas desesperadas estilo spam (CONTEXT.md §8.2).",
} as const;

// ───────────────────────── 6. SUBTÍTULOS ─────────────────────────
export const captions = {
  fontSize: 54, // una sola línea, 2-3 palabras: acompaña, no compite con el presentador
  textColor: color.white,
  activeColor: color.rust, // palabra activa resaltada en el acento de marca
  strokeColor: color.charcoal,
  strokeWidth: 6,
  switchEveryMs: 450,
  paddingBottom: 400, // zona segura: por encima de la UI de Reels/TikTok
} as const;

// ───────────────────────── 7. POPUPS / CARDS ─────────────────────────
// Superposiciones sobre video: texto directo, sin cajas por defecto.
// El trazo oscuro da legibilidad sobre cualquier fondo (mismo criterio que los subtítulos).
export const overlay = {
  ink: color.cream, // texto principal sobre video: crema, no blanco puro
  accent: color.rust, // SOLO cifras de oferta (3 y 6, 20%)
  rule: color.cream, // filete vertical de los lower thirds (rust queda para cifras)
  // Degradado oscuro en el borde superior: da contraste sin contorno ni caja.
  scrim: `linear-gradient(180deg, rgba(29, 24, 21, 0.62) 0%, rgba(29, 24, 21, 0.3) 60%, rgba(29, 24, 21, 0) 100%)`,
  ctaBg: color.moka, // único bloque sólido: llamado a la acción final
  ctaInk: color.cream,
  logoBg: color.cream, // píldora del logo al inicio
} as const;

export const popup = {
  top: 170, // zona segura superior (debajo de la UI de la app)
  scrimHeight: 760, // alto del degradado de lectura
  sideMargin: 70,
  eyebrowSize: 30,
  titleSize: 96,
  titleSizeLong: 70, // títulos de más de 18 caracteres
  titleStyle: "normal" as const, // recto: el italic quedó asociado a sticker
  subSize: 34,
  statSize: 300, // cifras grandes (3 y 6, 20%)
  ruleWidth: 6,
  ctaPadding: "44px 70px", // banda a ancho completo, alineada al margen
  rise: 24, // entrada vertical suave, sin rebote
  logoWidth: 620,
  logoPadding: "36px 70px",
  logoFrames: 45, // el logo aparece solo al inicio, antes del primer overlay
} as const;

// Pastillas (src/components/Pills.tsx): formato por tipo de mensaje.
// "offer" es el único tono con Rust (acento exclusivo de ofertas).
export const pillTone = {
  offer: { bg: color.rust, fg: color.cream, border: `2px solid ${color.cream}` }, // descuentos, cuotas
  info: { bg: color.cream, fg: color.moka, border: `2px solid ${color.moka}` }, // envío, precios, datos
  cta: { bg: color.moka, fg: color.cream, border: `2px solid ${color.cream}` }, // llamado a la acción final
} as const;
export type PillTone = keyof typeof pillTone;

export const pill = {
  padding: "20px 44px",
  titleSize: 56, // sticker estándar (una línea)
  heroSize: 110, // dato clave (ej. 20% OFF)
  noteSize: 28,
  cardRadius: 15,
  cardPadding: "26px 40px",
  cardMinWidth: 560,
  priceLabelSize: 32,
  priceValueSize: 58,
  ctaPadding: "26px 40px",
  ctaSize: 48,
  slide: 70, // desplazamiento lateral de entrada
} as const;

// ───────────────────────── 8. MOVIMIENTO ─────────────────────────
export const motion = {
  fps: 30,
  enterFrames: 12,
  popupExitFrames: 8,
  punchScale: 0.015, // zoom casi imperceptible: sobrio
  punchFrames: 18,
} as const;

// Efectos de sonido por tipo de overlay (archivos en public/sfx). Volumen bajo: la voz manda.
export const sfx = {
  lower: { src: staticFile("sfx/whoosh.wav"), volume: 0.22 },
  stat: { src: staticFile("sfx/hit.wav"), volume: 0.3 },
  cta: { src: staticFile("sfx/ding.wav"), volume: 0.25 },
} as const;

// ───────────────────────── 9. FORMATO ─────────────────────────
export const format = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// ───────────────────────── 10. LINEA DE TIEMPO ─────────────────────────
// Recorte de apertura: el video original arranca con charla antes del anuncio.
// Los popups, subtítulos y el video se corren juntos desde este punto.
export const timeline = {
  trimStartMs: 4700,
  trimStartFrames: 141, // trimStartMs en frames a format.fps
  durationFrames: 872, // 1013 originales - 141 recortados
} as const;
