import { copy } from "./brand";
import { CtaBanner, LowerThird, StatBlock } from "./components/Overlays";
import { TimedOverlay } from "./components/TimedOverlay";

// Overlays de ESTE video. Tiempos en la línea original de captions.json (antes del recorte).
// Cada overlay usa un componente de src/components: no definir estilos acá.
export type OverlayDef =
  | { kind: "lower"; fromMs: number; toMs: number; eyebrow?: string; title: string; sub?: string }
  | { kind: "stat"; fromMs: number; toMs: number; value: string; label: string; accent?: boolean }
  | { kind: "cta"; fromMs: number; toMs: number; title: string; sub?: string };

export const POPUPS: OverlayDef[] = [
  { kind: "lower", fromMs: 6400, toMs: 8200, title: "CYBER MONDAY", sub: "Arrancamos la semana" },
  { kind: "stat", fromMs: 10800, toMs: 12600, value: "3 Y 6", label: "CUOTAS SIN INTERÉS", accent: true },
  { kind: "stat", fromMs: 12700, toMs: 15000, value: "20%", label: "OFF PAGANDO CON TRANSFERENCIA", accent: true },
  { kind: "lower", fromMs: 15100, toMs: 19600, title: "ENVÍO GRATIS", sub: "En compras desde $90.000 · Todo el país" },
  { kind: "lower", fromMs: 22800, toMs: 27200, title: "BERMUDAS DESDE $24.000", sub: "Remeras desde $13.000" },
  { kind: "cta", fromMs: 31200, toMs: 33700, title: "ENVÍOS A TODO EL PAÍS", sub: `Te esperamos en ${copy.name}` },
];

const renderOverlay = (def: OverlayDef) => {
  switch (def.kind) {
    case "lower":
      return <LowerThird eyebrow={def.eyebrow} title={def.title} sub={def.sub} />;
    case "stat":
      return <StatBlock value={def.value} label={def.label} accent={def.accent} />;
    case "cta":
      return <CtaBanner title={def.title} sub={def.sub} />;
  }
};

export const Popups: React.FC = () => (
  <>
    {POPUPS.map((def) => (
      <TimedOverlay key={`${def.kind}-${def.fromMs}`} fromMs={def.fromMs} toMs={def.toMs}>
        {renderOverlay(def)}
      </TimedOverlay>
    ))}
  </>
);
