import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PillTone, color, font, pill, pillTone, popup, shape } from "../brand";
import { useOverlayMotion } from "./TimedOverlay";

export type Side = "left" | "right";

// Entrada con resorte corto: 0 → 1. Se usa para deslizar y escalar.
const useEnter = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, config: { damping: 16, stiffness: 180 }, durationInFrames: 14 });
};

const sideStyle = (side: Side): CSSProperties => (side === "left" ? { left: popup.sideMargin } : { right: popup.sideMargin });
const slideFrom = (side: Side, enter: number) => (side === "left" ? -1 : 1) * (1 - enter) * pill.slide;

/** Pastilla corta con un dato (y una nota opcional). Para ofertas, cuotas, envío. */
export const Sticker: React.FC<{ title: string; note?: string; tone: PillTone; side: Side; hero?: boolean }> = ({
  title,
  note,
  tone,
  side,
  hero,
}) => {
  const { opacity } = useOverlayMotion();
  const enter = useEnter();
  const { bg, fg, border } = pillTone[tone];
  return (
    <div
      style={{
        position: "absolute",
        top: popup.top,
        ...sideStyle(side),
        padding: pill.padding,
        borderRadius: shape.radiusPill,
        background: bg,
        color: fg,
        border,
        opacity,
        transform: `translateX(${slideFrom(side, enter)}px) scale(${0.88 + 0.12 * enter})`,
        transformOrigin: `${side} center`,
        fontFamily: font.family,
        textAlign: side,
      }}
    >
      <div
        style={{
          fontStyle: font.style,
          fontWeight: font.headingWeight,
          textTransform: font.transform,
          letterSpacing: font.tracking.heading,
          fontSize: hero ? pill.heroSize : pill.titleSize,
          lineHeight: 1.05,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      {note ? (
        <div
          style={{
            fontStyle: "normal",
            fontWeight: font.bodyWeight,
            textTransform: font.transform,
            letterSpacing: font.tracking.editorial,
            fontSize: pill.noteSize,
            opacity: 0.9,
            marginTop: 4,
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};

/** Tarjeta de precios: etiqueta a la izquierda, valor a la derecha. */
export const PriceCard: React.FC<{ rows: { label: string; value: string }[]; side: Side; kicker?: string }> = ({
  rows,
  side,
  kicker,
}) => {
  const { opacity } = useOverlayMotion();
  const enter = useEnter();
  const { bg, fg, border } = pillTone.info;
  return (
    <div
      style={{
        position: "absolute",
        top: popup.top,
        ...sideStyle(side),
        minWidth: pill.cardMinWidth,
        padding: pill.cardPadding,
        borderRadius: pill.cardRadius,
        background: bg,
        color: fg,
        border,
        opacity,
        transform: `translateX(${slideFrom(side, enter)}px)`,
        fontFamily: font.family,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontWeight: font.bodyWeight,
            textTransform: font.transform,
            letterSpacing: font.tracking.editorial,
            fontSize: pill.noteSize,
            opacity: 0.7,
            marginBottom: 6,
          }}
        >
          {kicker}
        </div>
      ) : null}
      {rows.map((row) => (
        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 40 }}>
          <span
            style={{
              fontWeight: font.bodyWeight,
              letterSpacing: font.tracking.editorial,
              fontSize: pill.priceLabelSize,
              textTransform: font.transform,
            }}
          >
            {row.label}
          </span>
          <span
            style={{
              fontStyle: font.style,
              fontWeight: font.headingWeight,
              letterSpacing: font.tracking.heading,
              fontSize: pill.priceValueSize,
              color: color.rust,
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/** Barra ancha Moka para el llamado a la acción final. */
export const CtaBar: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => {
  const { opacity } = useOverlayMotion();
  const enter = useEnter();
  const { bg, fg, border } = pillTone.cta;
  return (
    <div
      style={{
        position: "absolute",
        top: popup.top,
        left: popup.sideMargin,
        right: popup.sideMargin,
        padding: pill.ctaPadding,
        borderRadius: shape.radiusPill,
        background: bg,
        color: fg,
        border,
        textAlign: "center",
        opacity,
        transform: `translateY(${(1 - enter) * -50}px)`,
        fontFamily: font.family,
        textTransform: font.transform,
      }}
    >
      <div
        style={{
          fontStyle: font.style,
          fontWeight: font.headingWeight,
          letterSpacing: font.tracking.ui,
          fontSize: pill.ctaSize,
        }}
      >
        {title}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 6,
            fontWeight: font.bodyWeight,
            letterSpacing: font.tracking.editorial,
            fontSize: pill.noteSize,
            opacity: 0.9,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
