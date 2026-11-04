import type { CSSProperties } from "react";
import { font, overlay, popup, shape } from "../brand";
import { useOverlayMotion } from "./TimedOverlay";

// Estilos base compartidos: ningún overlay define colores ni fuentes a mano.
const base: CSSProperties = { fontFamily: font.family, color: overlay.ink, textTransform: font.transform };
const outlined: CSSProperties = {
  WebkitTextStroke: `${overlay.strokeWidth}px ${overlay.stroke}`,
  paintOrder: "stroke fill",
};
const anchor = (opacity: number, rise: number): CSSProperties => ({
  position: "absolute",
  top: popup.top,
  left: popup.sideMargin,
  right: popup.sideMargin,
  opacity,
  transform: `translateY(${rise}px)`,
});

/** Texto alineado a la izquierda con filete vertical. Sin caja. Para promos, precios e info. */
export const LowerThird: React.FC<{ eyebrow?: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <div style={{ ...anchor(opacity, rise), display: "flex", gap: 28 }}>
      <div style={{ width: popup.ruleWidth, background: overlay.rule, flexShrink: 0 }} />
      <div style={{ ...base, ...outlined }}>
        {eyebrow ? (
          <div
            style={{
              fontStyle: "normal",
              fontWeight: font.bodyWeight,
              letterSpacing: font.tracking.editorial,
              fontSize: popup.eyebrowSize,
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontStyle: font.style,
            fontWeight: font.headingWeight,
            letterSpacing: font.tracking.heading,
            fontSize: title.length > 18 ? popup.titleSizeLong : popup.titleSize,
            lineHeight: 1.02,
          }}
        >
          {title}
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 14,
              fontStyle: "normal",
              fontWeight: font.bodyWeight,
              letterSpacing: font.tracking.editorial,
              fontSize: popup.subSize,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Cifra grande + etiqueta. Para descuentos y cuotas. accent = rust, solo para ofertas. */
export const StatBlock: React.FC<{ value: string; label: string; accent?: boolean }> = ({ value, label, accent }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <div style={{ ...anchor(opacity, rise), ...base, ...outlined }}>
      <div
        style={{
          fontStyle: font.style,
          fontWeight: font.headingWeight,
          fontSize: popup.statSize,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          color: accent ? overlay.accent : overlay.ink,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 18,
          fontStyle: "normal",
          fontWeight: font.bodyWeight,
          letterSpacing: font.tracking.editorial,
          fontSize: popup.subSize,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Único bloque sólido del video. Para el llamado a la acción final. */
export const CtaBanner: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <div
      style={{
        ...anchor(opacity, rise),
        ...base,
        padding: popup.ctaPadding,
        borderRadius: shape.radiusPill,
        background: overlay.ctaBg,
        color: overlay.ctaInk,
      }}
    >
      <div style={{ fontStyle: font.style, fontWeight: font.headingWeight, letterSpacing: font.tracking.heading, fontSize: popup.titleSizeLong, lineHeight: 1.02 }}>
        {title}
      </div>
      {sub ? (
        <div style={{ marginTop: 12, fontStyle: "normal", fontWeight: font.bodyWeight, letterSpacing: font.tracking.editorial, fontSize: popup.subSize }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};
