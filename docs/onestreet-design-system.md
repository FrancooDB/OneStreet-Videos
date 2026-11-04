# 🏛️ ONESTREET EDITORIAL DESIGN SYSTEM (V1.0 - 2026) — SSOT OFICIAL

> **Manifiesto**: Galería editorial streetwear sobre lienzo hueso y crema. La marca opera como un lookbook impreso de alta gama: fotografía limpia, tipografía mayúscula con tracking amplio, contraste cromático dominado por el **Moka OneStreet (#3F2B24)** y una arquitectura puramente **Mobile-First**.

---

## 🎨 1. TOKENS — PALETA CROMÁTICA MATEMÁTICA (Hue Base $\theta = 16^\circ$)

| Nombre Token | Hexadecimal | Variable CSS | Rol & Aplicación en la Interfaz | Relación con el Logo |
| :--- | :--- | :--- | :--- | :--- |
| **OneStreet Moka** | `#3F2B24` | `--color-brand-moka` | **Signature Brand Color**: Botones primarios (Pills), isotipo, hover primario y acentos de marca. | **Muestreo exacto del logo.** |
| **Moka Hover** | `#593E34` | `--color-moka-hover` | Estado hover suave de botones e interactivos (+9% luminancia). | Derivado ($\Delta L + 9\%$). |
| **Moka Deep** | `#2A1D18` | `--color-moka-deep` | Estado active/pressed al clic o tap en móviles (-6% luminancia). | Derivado ($\Delta L - 6\%$). |
| **Moka Tint** | `rgba(63, 43, 36, 0.06)` | `--color-moka-tint` | Divisores sutiles de `1px` estilo imprenta y fondos de tarjeta inactivos. | Opacidad $\alpha = 0.06$. |
| **Vellum Cream** | `#F7F7ED` | `--color-vellum-cream` | Escenario editorial cálido para fondo de tienda, bloques hero, banners y texto sobre Moka/Charcoal. | **Muestreo exacto del isotipo invertido.** |
| **Bone White** | `#F7F7ED` | `--color-bone-white` | Lienzo base unificado con Vellum Cream para tarjetas de producto y fondos. | Base cálida editorial. |
| **Charcoal Core** | `#1D1815` | `--color-charcoal` | Texto principal de lectura en títulos y párrafos, barra superior (Marquee) y fondo del footer (WCAG AAA). | Negro tintado en matiz moka ($16^\circ$). |
| **Pewter Muted** | `#7D736E` | `--color-pewter` | Precios tachados, SKU, divisores y selectores de talles inactivos. | Gris cálido en matiz $16^\circ$. |
| **Terracotta Rust**| `#B24A3B` | `--color-rust` | Acento exclusivo para badges de oferta (*3x2*, Descuento) y pestaña destacada `NOVEDADES`. | Armonía análoga cálida ($H=8^\circ$). |

---

## 🔤 2. TOKENS — TIPOGRAFÍA Y LENGUAJE EDITORIAL

### Fuentería: Poppins (Bold Italic Dinámico — Coherencia con el Logo OneStreet)
- **Títulos y Encabezados (`h1` a `h5`)**: `"Poppins", sans-serif` en **Bold Italic (`700`)** con tracking cerrado (`-0.01em`).
- **Nombres de Producto (`.item-name`)**: **Bold Italic (`700`)** en **MAYÚSCULAS** con tracking `0.04em`.
- **Navegación del Header (`.nav-list-link`)**: **Semi-bold Italic (`600`)** en **MAYÚSCULAS** con tracking `0.08em`.
- **Botones de Acción Primarios (`.btn-primary`)**: **Bold Italic (`700`)** en **MAYÚSCULAS** con tracking `0.08em`.
- **Párrafos, descripciones y precios**: Regular (`400`/`500`) normal (recto) para máxima legibilidad.

---

## 📐 3. MORFOLOGÍA Y COMPONENTES (SHAPES)

### A. Botones Píldora (Pill CTAs)
- **Border Radius**: `50px` (`--radius-pill`).
- **Primario**: Relleno OneStreet Moka (`#3F2B24`), texto Vellum Cream (`#F7F7ED`), fuente Italic Bold.
- **Hover**: Relleno Moka Hover (`#593E34`), elevación suave `translateY(-1px)`.
- **Secundario / Outline**: Borde `1px` Moka (`#3F2B24`), fondo `#F7F7ED`, texto `#3F2B24`.

### B. Tarjeta de Producto (Product Grid Tile)
- **Radio de Fotografía**: `15px` (`--radius-product-img`).
- **Cero Sombras**: Diseño completamente plano, profundidad lograda por contraste de superficie.
- **Selector de Talles Inline**: Botones píldora de talles (`S M L XL XXL`) con estado activo en Moka `#3F2B24`.

### C. Barra Promocional Superior (Marquee / Topbar)
- **Fondo**: Charcoal Core (`#1D1815`).
- **Texto**: Mayúsculas crema de `11px`, tracking `0.10em`, peso 600 Italic.
- **3 Anuncios Clave**:
  1. `🚚 ENVÍO GRATIS A TODO EL PAÍS`
  2. `💳 3 Y 6 CUOTAS SIN INTERÉS`
  3. `🔄 30 DÍAS DE CAMBIO SIN CARGO`

---

## 🏛️ 4. ARQUITECTURA DE NAVEGACIÓN Y ESTRUCTURA DE MENÚS

### A. Encabezado (Header Monoline Minimalista — 100% Venta)
- **Fila Única Compacta**: Logo a la izquierda (36-42px), menú de navegación centrado, utilidades minimalistas a la derecha (Lupa + Bolsa `bag` con píldora Moka).
- **Sticky Header**: Fijo al hacer scroll con fondo `#F7F7ED` y divisor sutil de `1px` (`rgba(63, 43, 36, 0.08)`).
- **Pestañas de Venta Pura**:
  1. `NOVEDADES` *(Pestaña destacada en Terracotta Rust #B24A3B)*
  2. `PRODUCTOS`
  3. `REMERAS`
  4. `HOODIES & BUZOS`
  5. `PANTS / ACCESORIOS`

### B. Pie de Página (Footer Lookbook Centrado — Soporte, Confianza y Legal)
- **Fondo**: Charcoal Core (`#1D1815`) y texto en Vellum Cream (`#F7F7ED`).
- **Estructura**:
  1. Marca institucional: `ONESTREET • STREETWEAR EDITORIAL`.
  2. Iconos sociales centrados geométricamente (`gap: 18px`).
  3. Menú de soporte institucional: `CONTACTO`, `POLÍTICA DE CAMBIO O DEVOLUCIÓN`, `GUÍA DE TALLES`, `PREGUNTAS FRECUENTES`.
  4. Bloque legal y reclamos.

---

## 📱 5. DIRECTRICES MOBILE-FIRST

- **Touch Target Mínimo**: `44px x 44px` en cualquier selector o botón.
- **Grilla Móvil Dual**: 2 productos por fila en smartphones con esquinas de fotos de `15px`.
- **Sticky CTA**: Botón de "Agregar al Carrito" accesible para compra con un pulgar.


