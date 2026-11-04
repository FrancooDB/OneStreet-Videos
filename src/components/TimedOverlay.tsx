import { createContext, useContext } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { motion, popup } from "../brand";
import { spanFrames, toTrimmedFrame } from "./timing";

// Duración del intervalo activo: la lee useOverlayMotion sin que cada overlay la pase a mano.
const SpanContext = createContext(0);

/** Muestra su contenido solo entre fromMs y toMs (línea original del video). */
export const TimedOverlay: React.FC<{ fromMs: number; toMs: number; children: React.ReactNode }> = ({
  fromMs,
  toMs,
  children,
}) => {
  const from = toTrimmedFrame(fromMs);
  const durationInFrames = spanFrames(fromMs, toMs);
  if (from + durationInFrames <= 0) {
    return null;
  }
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <SpanContext.Provider value={durationInFrames}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </SpanContext.Provider>
    </Sequence>
  );
};

/** Entrada y salida suaves para cualquier overlay dentro de un TimedOverlay. */
export const useOverlayMotion = () => {
  const frame = useCurrentFrame();
  const duration = useContext(SpanContext);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const enter = interpolate(frame, [0, motion.enterFrames], [0, 1], clamp);
  const exit = interpolate(frame, [duration - motion.popupExitFrames, duration], [1, 0], clamp);
  return { opacity: Math.min(enter, exit), rise: (1 - enter) * popup.rise };
};
