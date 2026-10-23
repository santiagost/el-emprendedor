# Sistema Visual — "El Emprendedor"

Guía corta para agregar pantallas o piezas de UI sin romper la consistencia visual. Los valores viven en `src/index.css` (bloque `@theme`) y los componentes en `src/components/common`.

---

## 1. Tokens

No escribas colores en hex dentro de las clases (`bg-[#0052CC]`): usá el token. Cambiar un token cambia todo el juego.

| Token | Valor | Uso |
| --- | --- | --- |
| `brand-navy` | `#0A2540` | Botón primario en modo claro, textos de marca |
| `brand-navy-press` | `#081C30` | Botón primario presionado |
| `brand-cobalt` | `#0052CC` | Hover del primario en claro, primario en oscuro, acentos, anillos de foco |
| `brand-cobalt-hover` | `#0047B3` | Hover del primario en oscuro |
| `brand-canvas` | `#F4F7FB` | Fondo de página en claro |
| `night-canvas` | `#071322` | Fondo de página en oscuro |
| `night-surface` | `#0B1E33` | Tarjetas en oscuro (en claro son `bg-white`) |
| `night-raised` | `#0E243A` | Opciones del dilema y minijuegos en oscuro |
| `night-raised-hover` / `-press` | `#14304D` / `#18395B` | Hover y presionado de `night-raised` |
| `night-selected` | `#0E2C52` | Tarjeta elegida en Setup, en oscuro |
| `night-sunken` | `#0A1B2E` | Fondos hundidos (laboratorio de minijuegos) |
| `metric-capital` / `-reputacion` / `-bienestar` | `#0F9D58` / `#1B68D2` / `#FF9800` | Color de cada métrica en claro |

Textos chicos: `text-2xs` (11 px) y `text-3xs` (10 px). Desde 12 px se usa la escala de Tailwind (`text-xs`, `text-sm`…). Los textos de 8 y 9 px del HUD quedan como valores sueltos hasta el rediseño de esa pantalla.

Fuera de las clases quedan algunos hex en código: el trazo de las curvas de métricas (`PhaseRecap`, `EndMetricsPanel`), los colores del confeti (`lib/fx.ts`) y los patrones SVG de la ruleta. Si cambia un color de métrica, cambialo también ahí.

---

## 2. Componentes comunes

| Componente | Cuándo usarlo |
| --- | --- |
| `Button` | Cualquier botón de acción. Variantes: `primary` (la acción principal de la pantalla), `secondary` (alternativa: cambiar perfil, seguir jugando, saltar), `danger` (salir de la partida), `toolbar` (botones chicos del encabezado). Tamaños: `sm`, `md`, `lg`. |
| `IconButton` | Botón cuadrado de solo ícono, como los interruptores de sonido, efectos y tema. Los colores de cada estado van en `tone`. |
| `Card` | Tarjeta blanca (`night-surface` en oscuro) con borde y radio de tarjeta. `shadow`: `flat` (por defecto), `raised` (carta del dilema), `hero` (resultado final). |
| `Modal` | Ventanas sobre el juego. Se cierran con Escape o tocando afuera y bloquean el scroll. `placement`: `center`, `sheet` (sube desde abajo en móvil) o `left` (drawer). |

Regla de `className`: suma ancho, márgenes, layout, animación o estado `disabled`, pero no repite color, padding, radio ni sombra que el componente ya pone. Tailwind no decide por orden de clases, así que dos clases en conflicto dan un resultado impredecible. Si necesitás otra combinación, agregá una variante o un tamaño.

---

## 3. Pantalla de juego

`Game.tsx` orquesta la partida (motor, atajos de teclado, secuencias) y delega la UI:

- `GameHeader`: turno y fase, herramientas, línea de turnos y métricas.
- `EventCard`: carta del dilema, suspenso "Calculando…" y resultado por capas.
- `OptionList`: alternativas del dilema.
- `OutcomeActions`: "Procesando…", "Saltar animación" o el botón para avanzar.
- `CompanyDrawer` y `ExitConfirmModal`: ventanas sobre el juego.
- `useOutcomeReveal` (hook): suspenso, deltas del HUD, sonido, vibración y confeti de métricas.

---

## 4. Verificación visual

Antes y después de un cambio de estilo, sacá capturas de las mismas pantallas (Setup, dilema, crisis, resultado, resumen de fase, cierre, un minijuego) en claro y oscuro, escritorio y móvil, con una semilla fija (`?seed=52`), y compará. Un cambio de tokens o componentes que no busca cambiar el look tiene que dar capturas idénticas.
