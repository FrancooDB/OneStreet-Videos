import { format, timeline } from "../brand";

/** Milisegundos (línea original del video) → frames. */
export const msToFrames = (ms: number) => Math.round((ms / 1000) * format.fps);

/** Frame dentro de la composición recortada para un tiempo de la línea original. */
export const toTrimmedFrame = (originalMs: number) => msToFrames(originalMs - timeline.trimStartMs);

/** Duración en frames de un intervalo de la línea original. */
export const spanFrames = (fromMs: number, toMs: number) => msToFrames(toMs - fromMs);
