import { Audio } from "remotion";
import { PillTone, copy, sfx } from "./brand";
import { CtaBar, PriceCard, Side, Sticker } from "./components/Pills";
import { TimedOverlay } from "./components/TimedOverlay";

// Popups de ESTE video. Tiempos en la línea original de captions.json (antes del recorte).
// Una sola idea por popup, con un formato distinto según el tipo de mensaje.
// Estilos en src/components/Pills.tsx y src/brand.ts: no definirlos acá.
export type OverlayDef =
  | { kind: "sticker"; fromMs: number; toMs: number; side: Side; tone: PillTone; title: string; note?: string; hero?: boolean }
  | { kind: "price"; fromMs: number; toMs: number; side: Side; kicker?: string; rows: { label: string; value: string }[] }
  | { kind: "cta"; fromMs: number; toMs: number; title: string; sub?: string };

export const POPUPS: OverlayDef[] = [
  { kind: "sticker", fromMs: 6400, toMs: 8000, side: "left", tone: "offer", title: "CYBER MONDAY" },
  { kind: "sticker", fromMs: 10800, toMs: 12500, side: "right", tone: "info", title: "3 Y 6 CUOTAS S/ INTERÉS" },
  { kind: "sticker", fromMs: 12700, toMs: 14500, side: "left", tone: "offer", title: "20% OFF", note: "Con transferencia", hero: true },
  { kind: "sticker", fromMs: 15100, toMs: 17000, side: "right", tone: "info", title: "ENVÍO GRATIS", note: "Desde $90.000" },
  {
    kind: "price",
    fromMs: 22800,
    toMs: 27000,
    side: "left",
    kicker: "Desde",
    rows: [
      { label: "BERMUDAS", value: "$24.000" },
      { label: "REMERAS", value: "$13.000" },
    ],
  },
  { kind: "cta", fromMs: 28900, toMs: 33400, title: copy.address.toUpperCase(), sub: "Envíos a todo el país" },
];

// Efecto de sonido por popup (ver sfx en brand.ts): el dato clave suena distinto.
const soundOf = (def: OverlayDef) => (def.kind === "cta" ? sfx.cta : def.kind === "sticker" && def.hero ? sfx.stat : sfx.lower);

const renderOverlay = (def: OverlayDef) => {
  switch (def.kind) {
    case "sticker":
      return <Sticker title={def.title} note={def.note} tone={def.tone} side={def.side} hero={def.hero} />;
    case "price":
      return <PriceCard rows={def.rows} side={def.side} kicker={def.kicker} />;
    case "cta":
      return <CtaBar title={def.title} sub={def.sub} />;
  }
};

export const Popups: React.FC = () => (
  <>
    {POPUPS.map((def) => {
      const sound = soundOf(def);
      return (
        <TimedOverlay key={`${def.kind}-${def.fromMs}`} fromMs={def.fromMs} toMs={def.toMs}>
          <Audio src={sound.src} volume={sound.volume} />
          {renderOverlay(def)}
        </TimedOverlay>
      );
    })}
  </>
);
