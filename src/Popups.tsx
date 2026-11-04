import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PopupTone, copy, font, motion, popup, popupTone, shape, timeline } from "./brand";

export type PopupDef = {
  fromMs: number;
  toMs: number;
  kicker: string; // etiqueta editorial superior (reemplaza los emojis)
  title: string;
  sub?: string;
  tone: PopupTone;
};

// Popups de ESTE video. Tiempos en la línea original de captions.json (antes del recorte).
// Estilo, colores y tipografía vienen de src/brand.ts (no definirlos acá).
export const POPUPS: PopupDef[] = [
  { fromMs: 6400, toMs: 8200, kicker: "PROMO ESPECIAL", title: "CYBER MONDAY", sub: "Arrancamos la semana", tone: "offer" },
  { fromMs: 10800, toMs: 12600, kicker: "MEDIOS DE PAGO", title: "3 Y 6 CUOTAS", sub: "SIN INTERÉS", tone: "offer" },
  { fromMs: 12700, toMs: 15000, kicker: "OFERTA", title: "20% OFF", sub: "Pagando con transferencia", tone: "offer" },
  { fromMs: 15100, toMs: 19600, kicker: "BENEFICIO", title: "ENVÍO GRATIS", sub: "En compras desde $90.000 · Todo el país", tone: "offer" },
  { fromMs: 19800, toMs: 22000, kicker: "EN EL LOCAL", title: "DESCUENTO EN TODO EL LOCAL", tone: "info" },
  { fromMs: 22800, toMs: 24700, kicker: "PRECIOS", title: "BERMUDAS DESDE $24.000", tone: "info" },
  { fromMs: 24800, toMs: 27200, kicker: "PRECIOS", title: "REMERAS DESDE $13.000", sub: "Y muchas promos más", tone: "info" },
  { fromMs: 28900, toMs: 31000, kicker: "VISITANOS", title: copy.address.toUpperCase(), sub: "Vení a visitarnos", tone: "info" },
  { fromMs: 31200, toMs: 33700, kicker: "ENVÍOS", title: "ENVÍOS A TODO EL PAÍS", sub: `Te esperamos en ${copy.name}`, tone: "cta" },
];

const Popup: React.FC<{ def: PopupDef; durationInFrames: number }> = ({ def, durationInFrames }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [durationInFrames - motion.popupExitFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { bg, fg, border } = popupTone[def.tone];
  const titleSize = def.title.length > 18 ? popup.titleSizeLong : popup.titleSize;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: popup.top,
          left: popup.sideMargin,
          right: popup.sideMargin,
          padding: popup.padding,
          borderRadius: popup.radius,
          background: bg,
          color: fg,
          border,
          boxShadow: shape.shadow,
          opacity: Math.min(enter, exit),
          transform: `translateY(${(1 - enter) * popup.rise}px)`,
          fontFamily: font.family,
        }}
      >
        <div
          style={{
            fontStyle: "normal",
            fontWeight: font.bodyWeight,
            textTransform: font.transform,
            letterSpacing: font.tracking.editorial,
            fontSize: popup.kickerSize,
            opacity: 0.8,
            marginBottom: 14,
          }}
        >
          {def.kicker}
        </div>
        <div style={{ height: 1, background: fg, opacity: 0.35, marginBottom: 18 }} />
        <div
          style={{
            fontStyle: font.style,
            fontWeight: font.headingWeight,
            textTransform: font.transform,
            letterSpacing: font.tracking.heading,
            fontSize: titleSize,
            lineHeight: 1.05,
          }}
        >
          {def.title}
        </div>
        {def.sub ? (
          <div
            style={{
              marginTop: 14,
              fontStyle: "normal",
              fontWeight: font.bodyWeight,
              textTransform: font.transform,
              letterSpacing: font.tracking.editorial,
              fontSize: popup.subSize,
              opacity: 0.92,
            }}
          >
            {def.sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Popups: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {POPUPS.map((def, i) => {
        const from = Math.round(((def.fromMs - timeline.trimStartMs) / 1000) * fps);
        const durationInFrames = Math.round(((def.toMs - def.fromMs) / 1000) * fps);
        if (from + durationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <Popup def={def} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
