import type { CSSProperties } from "react";
import { font, overlay, popup, shape } from "../brand";
import { useOverlayMotion } from "./TimedOverlay";

// Estilos base compartidos: ningún overlay define colores ni fuentes a mano.
const base: CSSProperties = { fontFamily: font.family, color: overlay.ink, textTransform: font.transform };
const anchor = (opacity: number, rise: number): CSSProperties => ({
  position: "absolute",
  top: popup.top,
  left: popup.sideMargin,
  right: popup.sideMargin,
  opacity,
  transform: `translateY(${rise}px)`,
});

/** Degradado de lectura en el borde superior. Reemplaza el contorno del texto. */
const Scrim: React.FC = () => {
  const { opacity } = useOverlayMotion();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: popup.scrimHeight,
        background: overlay.scrim,
        opacity,
      }}
    />
  );
};

/** Texto alineado a la izquierda con filete vertical. Para promos, precios e info. */
export const LowerThird: React.FC<{ eyebrow?: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <>
      <Scrim />
      <div style={{ ...anchor(opacity, rise), display: "flex", gap: 28 }}>
        <div style={{ width: popup.ruleWidth, background: overlay.rule, flexShrink: 0 }} />
        <div style={base}>
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
              fontStyle: popup.titleStyle,
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
                textWrap: "balance",
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

/** Cifra grande + etiqueta. Para descuentos y cuotas. accent = rust, solo para ofertas. */
export const StatBlock: React.FC<{ value: string; label: string; accent?: boolean }> = ({ value, label, accent }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <>
      <Scrim />
      <div style={{ ...anchor(opacity, rise), ...base }}>
        <div
          style={{
            fontStyle: "normal",
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
    </>
  );
};

/** Único bloque sólido del video: banda Moka a ancho completo para el llamado a la acción final. */
export const CtaBanner: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => {
  const { opacity, rise } = useOverlayMotion();
  return (
    <div
      style={{
        position: "absolute",
        top: popup.top,
        left: 0,
        right: 0,
        opacity,
        transform: `translateY(${rise}px)`,
        ...base,
        padding: popup.ctaPadding,
        borderRadius: shape.radiusSharp,
        background: overlay.ctaBg,
        color: overlay.ctaInk,
      }}
    >
      <div
        style={{
          fontStyle: popup.titleStyle,
          fontWeight: font.headingWeight,
          letterSpacing: font.tracking.heading,
          fontSize: popup.titleSizeLong,
          lineHeight: 1.02,
        }}
      >
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
