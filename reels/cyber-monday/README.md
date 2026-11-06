# Reel Cyber Monday (HyperFrames)

Reel vertical 1080×1920 a 30 fps, de 27,9 s, hecho con [HyperFrames](https://hyperframes.heygen.com) y componentes de su registry. Convive con el proyecto Remotion del repo y no lo usa.

## Instalar en una máquina nueva

1. **Node 20.19+, 22.13+ o 24+.**
2. **ffmpeg** en el PATH. En Windows: `winget install Gyan.FFmpeg`, y después reabrí la terminal.
3. Cloná el repo:

   ```bash
   git clone https://github.com/FrancooDB/OneStreet-Videos.git
   cd OneStreet-Videos
   npm install
   ```

4. Si `npm run reel:draft` falla por el navegador, ejecutá `npx hyperframes@0.7.109 doctor`. Te dice qué falta, por ejemplo el Chrome de render.

## Comandos (desde la raíz del repo)

| Comando | Qué hace |
| --- | --- |
| `npm run reel:preview` | Genera la composición y abre el estudio en el navegador |
| `npm run reel:draft` | Render rápido en baja calidad |
| `npm run reel:render` | Render final con el audio masterizado en `renders/cyber-monday.mp4` |

## Cómo está armado

- `build-v2.mjs` concentra todo lo específico de este reel:
  - los cortes (EDL),
  - los textos de la lista y los precios,
  - la dirección y los tiempos del CTA,
  - los efectos de sonido,
  - los movimientos de cámara.

  Genera `index.html` y `compositions/gen/`; esos dos no se editan a mano.
- `reel-lib.mjs` es genérico y sirve para cualquier reel. Mapea los tiempos de la fuente al video editado, convierte la transcripción en subtítulos y crea variantes de los componentes y pistas de audio.
- **Marca:** los colores se leen de `src/brand.ts` y los logos de `public/brand/`. Si cambia la marca, se cambia ahí y se vuelve a renderizar.
- `compositions/` tiene los componentes del registry sin modificar.
- `assets/` tiene el video cortado (`cut.mp4`), la voz (`voice.wav`), la transcripción, la tipografía Poppins (OFL), GSAP y los SFX. Los créditos están en `assets/sfx/CREDITS-media-use.md`.

## Reglas

- No inventes precios, promos ni fechas: confirmalos con OneStreet.
- `rust` es solo para ofertas.
- Subtítulos y CTA tienen que quedar dentro de la zona segura (y entre 200 y 1600).
