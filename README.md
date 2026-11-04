# OneStreet — Video de marca (Remotion + Claude Code)

Repo para editar videos verticales de OneStreet usando **Claude Code** (desde la app de escritorio) y **Remotion**.

## Requisitos

1. **Claude Code** (app de escritorio) con tu suscripción de Claude.
2. **Node.js LTS** — https://nodejs.org (solo para la vista previa y el render).

## Primeros pasos

1. Descargá o cloná este repo en tu computadora.
2. Abrí la carpeta en Claude Code (desktop) como proyecto.
3. Doble clic en `iniciar-studio.bat` para ver el video en el navegador (http://localhost:3000).
4. Pedile cambios a Claude en lenguaje natural. Claude lee `CLAUDE.md` y las skills de Remotion automáticamente.

## Ejemplos de pedidos

- "Cambiá el popup de envío gratis para que diga 'ENVÍO GRATIS DESDE $100.000'."
- "Agregá un popup nuevo a los 35 segundos con la dirección."
- "Renderizá el video final."

## Estructura

Ver la sección *Estructura* en [CLAUDE.md](CLAUDE.md).

## Render final

```bash
npm run render
```

El video queda en `out/video.mp4`.

## Licencia de Remotion

Algunas entidades necesitan licencia de empresa de Remotion. Revisá los términos en https://github.com/remotion-dev/remotion/blob/main/LICENSE.md.
