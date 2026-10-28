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
| `brand-canvas` | `#EEF2F7` | Mesa (fondo de página) en claro |
| `night-canvas` | `#0A111D` | Mesa (fondo de página) en oscuro: sin bordes, ahí viven el HUD y la navegación |
| `night-surface` | `#111A29` | Fichas y paneles en oscuro (en claro son `bg-white`) |
| `night-card` | `#18233A` | Carta del turno en oscuro: la única pieza con sombra (`shadow-carta`) |
| `night-raised` | `#111A29` | Opciones del dilema y minijuegos en oscuro (fichas) |
| `night-raised-hover` / `-press` | `#18233A` / `#1E2B45` | Hover y presionado de `night-raised` |
| `night-selected` | `#14233F` | Tarjeta elegida en Setup, en oscuro |
| `night-sunken` | `#0D1522` | Fondos hundidos (laboratorio de minijuegos) |
| `metric-capital` / `-reputacion` / `-bienestar` | claro `#0B8A5C` / `#6D4FD6` / `#A86200`; oscuro `#3DDC97` / `#A78BFA` / `#FFB547` | Color de cada métrica. Un color, un significado: Reputación es violeta y el azul queda para la acción. Las subidas usan el color de su métrica con flecha y signo |
| `metric-peligro` | claro `#C8372C`; oscuro `#FF6B5E` | Bajas de métricas (coral, con borde punteado en los chips) |

Tipografía: `font-sans` es Figtree (texto) y `font-display` es Bricolage Grotesque (títulos `h1`–`h3`, cifras del HUD y sellos). Las cifras llevan `tabular-nums`.

Tamaño mínimo: 12 px (`text-xs`). No hay tamaños más chicos. Los textos de ayuda usan `text-slate-500` en claro y `dark:text-slate-400` en oscuro para pasar AA.

Los tokens `metric-*` cambian solos entre claro y oscuro (se redefinen en `.dark`). Las curvas de métricas (`PhaseRecap`, `EndMetricsPanel`) los toman con `var(--color-metric-…)`. Fuera de las clases quedan algunos hex en código: los colores del confeti (`lib/fx.ts`) y los patrones SVG de la ruleta. Si cambia un color de métrica, cambialo también ahí.

---

## 2. Componentes comunes

| Componente | Cuándo usarlo |
| --- | --- |
| `Button` | Cualquier botón de acción. Variantes: `primary` (la acción principal de la pantalla), `secondary` (alternativa: cambiar perfil, seguir jugando, saltar), `danger` (salir de la partida), `toolbar` (botones chicos del encabezado). Tamaños: `sm`, `md`, `lg`. |
| `IconButton` | Botón cuadrado de solo ícono, como los interruptores de sonido, efectos y tema. Los colores de cada estado van en `tone`. |
| `Card` | Tarjeta blanca con borde. `shadow`: `flat` (por defecto: ficha o panel, `night-surface` en oscuro, sin sombra), `raised` (carta del dilema) y `hero` (resultado final), que son cartas: `night-card` en oscuro, radio de 20 px y `shadow-carta`. Tres superficies: mesa, carta y ficha; una sola sombra por pantalla y sin tarjetas dentro de tarjetas. |
| `Modal` | Ventanas sobre el juego. Se cierran con Escape o tocando afuera y bloquean el scroll. `placement`: `center`, `sheet` (sube desde abajo en móvil) o `left` (drawer). |

Regla de `className`: suma ancho, márgenes, layout, animación o estado `disabled`, pero no repite color, padding, radio ni sombra que el componente ya pone. Tailwind no decide por orden de clases, así que dos clases en conflicto dan un resultado impredecible. Si necesitás otra combinación, agregá una variante o un tamaño.

---

## 3. Pantalla de juego

`Game.tsx` orquesta la partida (motor, atajos de teclado, secuencias) y delega la UI:

- Distribución: en escritorio (`lg`) hay dos columnas, el tablero a la izquierda (`MetricCard` con `layout="row"` y `CompanyStatusCard`, fijos al hacer scroll) y la carta a la derecha. En móvil y tablet las métricas van en el header y "Mi empresa" se abre como drawer.
- `GameHeader`: turno y fase, herramientas, línea de turnos y métricas (estas solo debajo de `lg`).
- `MetricCard`: métrica del HUD. `layout`: `tile` (header) o `row` (columna de escritorio, valor grande a la derecha).
- `CompanyStatusCard`: "Mi empresa": relato del estado, "Tu punto de partida" y la vitrina de reconocimientos (sin cifras ni efectos).
- `EventCard`: carta del dilema, suspenso "Calculando…" y resultado por capas. Al mostrar el resultado la carta se da vuelta (`card-flip`) y los chips de delta entran de a uno (`delta-chip-in`).
- `OptionList`: alternativas del dilema. Al elegir, la ficha sube (`is-picked`) y las otras se apagan (`is-dimmed`) durante 150 ms antes de decidir.
- `OutcomeActions`: "Procesando…", "Saltar animación" o el botón para avanzar.
- `CompanyDrawer`, `GameMenu` (menú de partida en móvil: sonido, efectos, tema y Reiniciar) y `ExitConfirmModal`: ventanas sobre el juego.
- `useOutcomeReveal` (hook): suspenso, deltas del HUD, sonido, vibración y confeti de métricas.

Vitrina de reconocimientos: los tags se muestran como trofeos en tres estantes (Negocio, Mercado, Equipo), con lugares bloqueados que no dicen qué falta, y como frentes abiertos (hasta 3 en el panel). La tabla de presentación está en `src/game/reconocimientos.ts` y no toca el motor ni el log: cada tag es trofeo, hito de salida, herencia del perfil o frente. Al tocar un trofeo no pasa nada. Lo nuevo se anuncia comparando los tags antes y después (`diffVitrina`): "Nuevo reconocimiento", "Nuevo frente abierto" y "Frente cerrado" en la carta de resultado, y "Tu vitrina en esta fase" en el resumen de fase. El informe final muestra la vitrina completa y el hito de salida. Componentes: `Vitrina`, `VitrinaMoments`.

Movimiento reducido (preferencia del sistema o efectos apagados): las entradas (carta, chips, sello, cinta y "Para llevarte") pasan a un fundido de 150 ms, sin giro, rebote ni temblor, y la elección no espera.

Setup ("elegí tu fundador"): progreso "1 de 2" en el header, nombre arriba, "Lo que tenés que cuidar", un ícono por perfil y financiamiento, y el botón fijo abajo en móvil.

Cierre (`EndGameReport`): por capítulos con un índice fijo arriba (Resumen, Momento clave, Tu empresa, Fase por fase, Siguiente nivel) que en pantallas medianas suma Reintentar y Cambiar perfil. El héroe (`EndResultCard`) muestra las cifras finales con su cambio en la partida y el marcador de decisiones; las acciones se repiten al final.

---

## 4. Verificación visual

Antes y después de un cambio de estilo, sacá capturas de las mismas pantallas (Setup, dilema, crisis, resultado, resumen de fase, cierre, un minijuego) en claro y oscuro, escritorio y móvil, con una semilla fija (`?seed=52`), y compará. Un cambio de tokens o componentes que no busca cambiar el look tiene que dar capturas idénticas.
