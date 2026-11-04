import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PopupTone, copy, font, motion, popup, popupTone, shape } from "./brand";

export type PopupDef = {
  fromMs: number;
  toMs: number;
  emoji: string;
  title: string;
  sub?: string;
  tone: PopupTone;
};

// Popups de ESTE video. Tiempos sincronizados con src/data/captions.json.
// Estilo, colores y tipografía vienen de src/brand.ts (no definirlos acá).
export const POPUPS: PopupDef[] = [
  { fromMs: 6400, toMs: 8200, emoji: "🔥", title: "CYBER MONDAY", sub: "Arrancamos la semana", tone: "offer" },
  { fromMs: 10800, toMs: 12600, emoji: copy.announcements.installments.emoji, title: "3 Y 6 CUOTAS", sub: "SIN INTERÉS", tone: "offer" },
  { fromMs: 12700, toMs: 15000, emoji: "💸", title: "20% OFF", sub: "Pagando con transferencia", tone: "offer" },
  { fromMs: 15100, toMs: 19600, emoji: copy.announcements.shipping.emoji, title: "ENVÍO GRATIS", sub: "En compras desde $90.000 · Todo el país", tone: "offer" },
  { fromMs: 19800, toMs: 22000, emoji: "🏬", title: "DESCUENTO EN TODO EL LOCAL", tone: "info" },
  { fromMs: 22800, toMs: 24700, emoji: "🩳", title: "BERMUDAS DESDE $24.000", tone: "info" },
  { fromMs: 24800, toMs: 27200, emoji: "👕", title: "REMERAS DESDE $13.000", sub: "Y muchas promos más", tone: "info" },
  { fromMs: 28900, toMs: 31000, emoji: "📍", title: copy.address.toUpperCase(), sub: "Vení a visitarnos", tone: "info" },
  { fromMs: 31200, toMs: 33700, emoji: "📦", title: "ENVÍOS A TODO EL PAÍS", sub: `Te esperamos en ${copy.name}`, tone: "cta" },
];

const Popup: React.FC<{ def: PopupDef; durationInFrames: number }> = ({ def, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: motion.popupSpring });
  const exit = interpolate(frame, [durationInFrames - motion.popupExitFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const emojiBounce = Math.sin(frame / 4) * 6;
  const { bg, fg } = popupTone[def.tone];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: popup.top,
          left: popup.sideMargin,
          right: popup.sideMargin,
          padding: "30px 46px",
          borderRadius: shape.radiusPill,
          background: bg,
          color: fg,
          border: popup.border,
          boxShadow: shape.shadow,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: exit,
          transform: `translateY(${(1 - enter) * -60}px) scale(${enter * (0.7 + 0.3 * exit)})`,
          fontFamily: font.family,
        }}
      >
        <div style={{ fontSize: popup.emojiSize, lineHeight: 1, transform: `translateY(${emojiBounce}px)` }}>{def.emoji}</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontStyle: font.style,
              fontWeight: font.headingWeight,
              textTransform: font.transform,
              letterSpacing: font.tracking.productName,
              fontSize: def.title.length > 18 ? popup.titleSizeLong : popup.titleSize,
              lineHeight: 1.05,
            }}
          >
            {def.title}
          </div>
          {def.sub ? (
            <div
              style={{
                marginTop: 10,
                fontStyle: font.style,
                fontWeight: font.navWeight,
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
      </div>
    </AbsoluteFill>
  );
};

export const Popups: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {POPUPS.map((def, i) => {
        const from = Math.round((def.fromMs / 1000) * fps);
        const durationInFrames = Math.round(((def.toMs - def.fromMs) / 1000) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <Popup def={def} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
