# OneStreet — Proyecto de video (Remotion)

Este repo sirve para editar y renderizar videos verticales de OneStreet con Remotion. Trabajá siempre en español con el usuario.

## Antes de tocar nada

1. Leé `src/brand.ts`. Es la **única fuente de verdad** de colores, tipografía, formas, logos, copy de marca y movimiento. No hardcodees colores, fuentes ni textos fijos en las composiciones: importalos desde ahí.
2. Leé `docs/onestreet-design-system.md` si vas a cambiar algo visual.
3. Usá las skills de Remotion de `.claude/skills/` (empezá por `remotion-best-practices`, que es el router). Cargá la sub-skill que corresponda a la tarea (crear video, markup, captions, render, studio, etc.).

## Estructura

- `src/brand.ts`: marca (color, font, shape, logo, copy, captions, popups, motion, format).
- `src/Composition.tsx`: composición principal `MyComp` (1080×1920, 30 fps).
- `src/Popups.tsx`: popups de oferta/info/CTA con sus tiempos (`fromMs`, `toMs`).
- `src/Captions.tsx`: subtítulos estilo TikTok desde `src/data/captions.json`.
- `public/`: video base y logos. Los archivos estáticos se referencian con `staticFile()`.
- `scripts/transcribe.mts`: transcripción local de audio para generar subtítulos.
- `reels/<nombre>/`: reels hechos con HyperFrames (no Remotion). Toman colores de `src/brand.ts` y logos de `public/brand/`. Ver `reels/cyber-monday/README.md` (`npm run reel:preview|draft|render`).

## Reglas de trabajo

- **Sincronía:** si cambiás tiempos de popups o subtítulos, mantené `Popups.tsx` alineado con `captions.json`. La duración total de `MyComp` debe cubrir el último popup.
- **Voz de marca:** directa, urbana, segura. Sin ofertas desesperadas ni tono de spam.
- **Acento:** el color `rust` es exclusivo de ofertas (`popupTone.offer`).
- **Zona segura:** dejá espacio inferior para la UI de Reels/TikTok (`captions.paddingBottom`).
- **No inventes precios, promos ni datos.** Si falta un dato, preguntá.
- **No agregues credenciales ni tokens** al repo.

## Comandos

- Vista previa: `npm run dev` (o doble clic en `iniciar-studio.bat`).
- Render final: `npm run render` (genera `out/video.mp4`).
- Chequeo de tipos: `npx tsc --noEmit`.

## Antes de dar algo por terminado

- Corré `npx tsc --noEmit` y confirmá que no hay errores.
- Revisá el preview en Studio cuando cambies algo visual o de tiempos.
