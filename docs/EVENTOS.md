# Manual de Autoría de Eventos — "El Emprendedor"

Guía para diseñar, redactar y balancear eventos respetando el motor y las suites de prueba automáticas.

> **Vocabulario:** en pantalla el jugador ve **años** ("Año 3 / 15"); en el código, los tests y esta guía se sigue hablando de **turno** (`currentTurn`, `delayTurns`). Es lo mismo: cada turno es un año de la empresa. En los textos de los eventos no nombres el paso del tiempo con "turno"; los plazos puntuales ("dos meses de retraso", "60 días de mora") pueden seguir en meses, semanas o días, y no hace falta que sumen un año.

---

## 1. Reglas de Oro (Validación Estática)

El validador de contenido (`pnpm test`) rechaza cualquier evento que viole estas reglas:

1. **Prefijo de ID obligatorio**: los eventos principales comienzan con `f<fase>_` (ej. `f1_primer_mvp`, `f3_quiebre_stock`). Las crisis usan `crisis_`, los imprevistos `imp_` y los rescates `rescate_`.
2. **2 o 3 opciones**: no se admiten eventos de opción única ni más de 3.
3. **Píldora obligatoria**: cada opción debe tener `learningPill` con texto no vacío.
   - Formato sugerido: `[Concepto de Negocio]: [Explicación de la consecuencia real]`.
4. **Tags tipados**: cualquier tag en `addTags`, `removeTags`, `when.tags` o `when.forbiddenTags` debe estar registrado en `src/data/tags.ts`. Un typo es un error de compilación, no un bug silencioso.
5. **Presupuesto mínimo de eventos base**:
   - El jugador elige entre dos duraciones, y cada fase dura una cantidad fija de años según cuál (`src/game/phases.ts`):

     | Fase | Completa (15 años) | Corta (10 años) |
     |---|---|---|
     | 1 Génesis & Validación | años 1 a 3 | años 1 a 2 |
     | 2 Tracción & Caja | años 4 a 6 | años 3 a 4 |
     | 3 Escala & Crisis | años 7 a 10 | años 5 a 7 |
     | 4 Consolidación & Salida | años 11 a 15 | años 8 a 10 |

   - Debe haber **como mínimo tantos eventos base (sin `when.tags`, `when.archetype` ni `when.financing`) como años dura la fase en la duración más larga**, **para cada rubro**: ≥ 3 en la fase 1, ≥ 3 en la 2, ≥ 4 en la 3 y ≥ 5 en la 4. Un evento con `when.rubro` solo cuenta para los rubros que nombra.
   - *Objetivo recomendado para rejugabilidad*: apuntar a 1.5 a 2 eventos base por año.
6. **scheduledEvent válido**: si una opción programa un evento diferido, el `eventId` debe existir y `delayTurns >= 1`.
7. **Un solo hito por fase y rubro**: ver sección 10 (`validateMilestones`).
8. **Rubros válidos**: todo id en `when.rubro` debe existir en `src/data/rubros.ts` (`validateConditionIds`).
9. **Cierres con etiqueta de salida**: una opción con `endsGame` va en un evento principal, suma una etiqueta de salida y no tiene minijuego ni evento programado (`validateEndingOptions`, sección 12).

---

## 2. API de Builders

Nunca escribas objetos en crudo ni `impactPreview` manual. Usá los helpers de `src/data/events/builders.ts`:

- `defineOption(text, effects, extra)`:
  - `text`: texto del botón.
  - `effects`: `{ capital?, bienestar?, reputacion? }` (sugerido entre -30 y +30 para mantener el balance).
  - `extra`: `{ addTags?, removeTags?, learningPill, scheduledEvent?, minigame?, surprise?, endsGame? }`. `endsGame: true` hace que elegir esa opción termine la partida con victoria (sección 12).
  - El `impactPreview` (↑ ↓ →) se deriva solo del signo de `effects`. La interfaz lo muestra en el setup inicial y, desde la fase 3, como "Tu intuición:" en los botones de decisión (ver sección 8).
- `defineEvent({ id, phaseId, title, description, weight?, milestone?, when?, options })`:
  - `phaseId`: 1 | 2 | 3 | 4. El id debe empezar con `f<phaseId>_`.
  - `milestone: true`: marca el evento como el hito de su fase (sección 10).
  - `weight`: probabilidad relativa en el sorteo (por defecto 10). Subir a 20-30 para eventos de crisis o consecuencias inmediatas.
  - `when`: `{ tags?, forbiddenTags?, archetype?, financing?, rubro?, metrics?, playedBefore? }`. Un evento **base** es el que no tiene condiciones restrictivas de entrada.
  - Asserts en dev: id con prefijo de fase, 2-3 opciones, `learningPill` en todas.
- **Panel de Resultado**: al decidir, el jugador ve los deltas numéricos aplicados (+XX / -XX), los efectos pasivos de tags y la micro-píldora antes de avanzar de año.
- `src/data/events/_template.ts` tiene plantillas listas para copiar: evento base, condicionado por tags, versión por rubro, hito, rescate y opción que cierra la partida. El validador ignora los exports con prefijo `_`.

---

## 3. ¿Cuándo usar `when` vs `scheduledEvent`?

- **Usá `when` (Probabilístico / Estado)**:
  - Cuando la consecuencia dependa de una condición general que el jugador construyó (ej. tener `deuda_riesgosa` o `equipo_sobrecargado`).
  - El evento entra al bolillero de su fase y compite por probabilidad mientras los tags sigan activos.
  - `tags`: requiere TODOS presentes. `forbiddenTags`: bloquea con CUALQUIERA presente.
- **Usá `scheduledEvent` (Determinista / Retardo fijo)**:
  - Cuando una opción puntual detona un hecho inevitable en N años (ej. "Pedís un préstamo a 2 años" → programa la visita del prestamista con `delayTurns: 2`).
  - Al cumplirse el plazo (`currentTurn >= triggerTurn`), el evento tiene prioridad absoluta en la selección.
  - El disparo verifica además las condiciones del evento destino: si no se cumplen en el año programado, el evento queda en cola y salta con prioridad apenas las condiciones cambien.
- **Regla de pulgar**: crónica de un estado ("estás endeudado") = `when`. Factura con vencimiento ("la deuda vence en 2 años") = `scheduledEvent`.

---

## 4. Tags: consumo y tags del setup

- Todo tag que nace en una opción debería ser **consumido** por un `when`, un `schedule` o un modifier pasivo. El detector de tags huérfanos (`detectOrphanTags`) avisa los que nadie usa.
- Los tags del setup (arquetipo + financiamiento) entran activos desde el año 1: `calidad_producto`, `generacion_ingresos`, `red_contactos`, `inversiones`, `patrimonio`, `autonomia_estrategica`, `deuda_riesgosa`, `equity_diluido`.
- Hoy `inversiones` y `patrimonio` (los del arquetipo Inversionista) no los consume ningún evento: el detector los reporta como huérfanos. Son candidatos naturales para los primeros eventos condicionados por perfil (Etapa C1).
- `modifiers` en `src/data/tags.ts` son beneficios/costos pasivos: la suma de los modifiers de todos los tags activos se aplica al resolver cada decisión (una vez por año), después de los `effects` de la opción y antes del chequeo de derrota.

---

## 5. Personalización con el nombre del jugador (`{nombre}`)

El jugador puede cargar su nombre (opcional) en el Setup. Los textos de contenido pueden usar el token `{nombre}`: se resuelve **en el render** (`src/lib/personalize.ts`), no en el motor, así que el `decisionLog` y las partidas guardadas conservan el texto crudo.

- **Dónde se puede usar:** `title`, `description`, `option.text`, `outcomeText` y `learningPill`.
- **Tiene que leerse bien con y sin nombre.** Sin nombre, `personalize` quita el token y arregla puntuación y mayúscula inicial, pero solo para estas formas:
  - Al inicio de una oración: `'{nombre}, un inversor pide una reunión.'` → sin nombre: *"Un inversor pide una reunión."*
  - Al final, antes de la puntuación: `'¿Cómo salís al mercado, {nombre}?'` → *"¿Cómo salís al mercado?"*
  - Entre comas: `'Mirá, {nombre}, esto cambia todo.'` → *"Mirá, esto cambia todo."*
- **Evitá marcas de género** ("bienvenido/a"): usá voseo neutro.
- **Un solo token permitido:** `{nombre}`. Cualquier otra llave falla en `content.spec.ts`, que además verifica con y sin nombre que no queden llaves, dobles espacios ni minúscula inicial de oración.
- No hace falta tocar todos los eventos: `content.spec.ts` exige que cada rubro vea entre 8 y 10 eventos con el token (para que no se vuelva muletilla). Los rescates no lo usan.

---

## 6. Puesta en escena de crisis e imprevistos

Los eventos con `kind: 'crisis'`, `kind: 'unforeseen'` o `kind: 'rescue'` no se muestran de golpe: entran con una coreografía (corte, cintilla de noticias, sello y suspenso) definida en `src/game/stage.ts`. Es solo capa visual; el motor no la usa.

- **Sin hacer nada**, un evento nuevo usa el estilo de su tipo: sello "CRISIS" en rojo, "IMPREVISTO" en ámbar o "AL LÍMITE" (rescate, con la cintilla "Última oportunidad").
- **Para darle identidad propia**, agregá su id en `STAGE_BY_EVENT` con el sello (una palabra corta, en mayúsculas) y las frases del ticker:
  ```ts
  imp_corte_de_luz: { stamp: 'APAGÓN', ticker: ['Sin servicio en la zona', 'Último momento'] },
  ```
- **Oportunidades** (un imprevisto bueno, como la viralización): sumá `tone: 'opportunity'` y `ribbon: 'Tendencia'`. Usan verde, más saturación y confeti en lugar de grises.
- **El ticker no adelanta el contenido:** frases de clima ("Mercados en alerta"), nunca la consecuencia.
- `stage.spec.ts` falla si una entrada de `STAGE_BY_EVENT` apunta a un id que no existe o que no es una interrupción, y si un sello pasa de 14 caracteres.

---

## 7. Minijuegos en las opciones

Una opción puede llevar un minijuego que modula la **ejecución**: la opción define el efecto base (es el resultado "sólido") y el minijuego lo mejora o lo empeora. El motor no cambia: el minijuego solo produce un tier (`perfect`, `good`, `poor`).

```ts
defineOption('Texto', { capital: +35 }, {
    minigame: {
        kind: 'timing',            // 'timing' | 'tapping' | 'balance' | 'roulette'
        title: 'Título opcional',  // si el contexto de la opción lo pide
        rule: 'Regla en una línea.',
        // Todo lo siguiente es opcional:
        effectsByPerformance: { perfect: { reputacion: +15 }, poor: { capital: -10 } }, // reemplaza el escalado de ese tier
        tagsByPerformance: { perfect: { removeTags: ['equity_diluido'] } },
        outcomeTextByPerformance: { perfect: '...', poor: '...' },                      // la consecuencia cambia con la ejecución
        riskBias: 0.12,            // solo 'roulette': positivo = opción más riesgosa
    },
    learningPill: '...',
});
```

- **Si un evento tiene minijuego en una opción, lo tiene en todas** (un test lo exige): si solo una lo tuviera, el jugador la elegiría por curiosidad y no por la decisión.
- Sin `effectsByPerformance`, los efectos escalan solos: los positivos x1,25 / x1 / x0,6 y los negativos x0,6 / x1 / x1,25 (perfecto / sólido / flojo).
- Un `poor` nunca causa un game over que un `good` no hubiera causado: si lo provocara, se aplica `good`.
- Los tipos: `timing` (frenar una aguja, 3 rondas), `tapping` (cazar bugs que aparecen cada vez más seguidos y se van solos; el rendimiento es eliminados sobre aparecidos), `balance` (mantener un cursor en un rango móvil con botones o A / D / flechas: cuanto más tiempo mantenés apretado, más fuerza; el margen crece con la Reputación) y `roulette` (ruleta que gira sin parar y se frena en seco con un toque; el tamaño de cada segmento sale de los tags activos y es la dificultad, y se ve en pantalla).
- El jugador elige cuándo empezar y siempre puede saltar (resultado sólido) o activar el modo asistido.
- Si querés dar más peso a un tag en la ruleta, listalo en `LAUNCH_TAILWINDS` o `LAUNCH_HEADWINDS` (`game/minigames/roulette.ts`).

## 8. Sorpresas: la tendencia que a veces falla

Desde la **fase 3** cada cada opción de un evento principal muestra la tendencia de sus efectos ("Tu intuición:", las flechas del `impactPreview`). Al cierre de la fase 2 el resumen avisa que es intuición y no certeza. Para que no se pueda optimizar mirando solo las flechas, algunas opciones llevan un **desenlace alternativo** (`surprise`) que a veces sale en lugar del normal.

```ts
defineOption('Ajustar precios trasladando el 100% de la inflación.', { capital: +10, reputacion: -30, bienestar: -5 }, {
    surprise: {
        effects: { capital: -5, reputacion: -30, bienestar: -5 },  // efectos COMPLETOS, no un delta
        outcomeText: 'Los clientes no lo convalidaron y se pasaron a la competencia...',
    },
    learningPill: '...',
    outcomeText: 'Trasladaste el aumento de inmediato...',
});
```

**Cómo funciona**
- Solo cuenta si el evento es **principal** y de **fase 3 o 4**. En crisis e imprevistos no se muestran las flechas pero nunca falla.
- **Probabilidad:** 25 %. En la fase 4, si todavía no salieron 3 sorpresas, sube a *sorpresas que faltan ÷ años que quedan* (año 11 de 15 con 0 sorpresas: 60 %; en la partida corta, la fase 4 arranca en el año 8 y el valor llega a 100 %), con piso de 25 %. Con 6 sorpresas ya no sale ninguna (`surpriseChance` en `game/engine.ts`; constantes `SURPRISE_*`).
- El **mínimo de 3 no está garantizado**: una sorpresa solo sale si el jugador elige una opción que la tenga. En la simulación, entre 18 y 24 % de las partidas ganadas terminan con menos de 3 (promedio cercano a 2,9).
- El sorteo lo hace `useGameEngine.decide` (`rollSurprise`) con el RNG de la partida y se lo pasa a `applyDecision`; el motor sigue siendo puro. Se cuenta en `GameState.surprisesPlayed` y se marca en el `decisionLog` (`surprised`).
- Si sale, la carta de resultado muestra antes del texto "Esta vez tu intuición falló: esperabas ganar Capital, pero perdiste." (`game/intuition.ts`). Si sale lo esperado no se dice nada.
- Los **tags** son los de la opción (`addTags` / `removeTags`); la sorpresa solo cambia efectos y texto.
- Igual que un `poor`, una sorpresa **nunca causa un game over** que el desenlace normal no hubiera causado: si lo provocara, se aplica el normal.

**Cómo escribir una**
- Los `effects` de la sorpresa tienen que **contradecir la flecha** de al menos una métrica (por ejemplo, una opción con Capital ↑ cuya sorpresa deja Capital negativo). `content.spec.ts` lo valida; si no, el mensaje "tu intuición falló" mentiría.
- Lo más claro es invertir **una sola métrica** y dejar las otras iguales.
- El `outcomeText` de la sorpresa reemplaza al normal: tiene que ser **autosuficiente** y coherente con todos los efectos (los que no cambian también).
- Conviene en opciones donde sea creíble que falle (ajustar precios, franquiciar, firmar una exclusividad). No en costos obvios (pagar una multa, un senior caro, vender la empresa).
- **Las opciones con minijuego no llevan `surprise`**: el desvío ya sale del rendimiento y no se muestra el mensaje de intuición (el motor ignora la sorpresa si hay minijuego, y un test lo exige).
- Hoy hay **17 sorpresas** (6 mejores que lo esperado, 11 peores); el detalle está en `CATALOGO_EVENTOS.md`.
- Para subir la frecuencia, el camino es sumar sorpresa a más opciones o adelantar el ajuste de probabilidad a la fase 3.

---

## 9. Rubros: el mismo dilema en cada rubro

Al empezar, el jugador elige un **rubro** (Tecnología, Comercio, Servicios o Producción; `src/data/rubros.ts`). El rubro **no cambia métricas ni tags**: solo decide qué eventos pueden salir, con `when.rubro`.

- **Evento para cualquier rubro**: no pongas `when.rubro`. El texto no puede nombrar nada propio de un rubro (servidores, local, stock, planta).
- **Evento de un rubro**: `when: { rubro: ['r2_comercio'] }`. Si es un evento que tiene que aparecer siempre, necesita su versión en **cada** rubro.
- **Versiones de un mismo evento** (lo que hoy hacen `f1_mvp_calidad`, `f3_caida_servicio` e `imp_caida_servidores`): el original queda para Tecnología y cada versión usa el sufijo `_comercio`, `_servicios` o `_produccion`. **Mismas cifras, mismas etiquetas y mismos minijuegos**: solo cambia el texto. Un test (`content.spec.ts`) compara las cifras de la familia. Si el evento tiene puesta en escena (crisis o imprevisto), cada versión necesita su entrada en `STAGE_BY_EVENT`.
- Los eventos con `when.rubro` solo cuentan para el presupuesto de eventos base (regla 5) de los rubros que nombran.
- Para sumar un rubro nuevo: agregalo en `src/data/rubros.ts` (y su ícono en `CHOICE_ICONS`) y escribí su versión de cada evento que hoy tenga una. `validatePhasePacing` y `validateMilestones` van a decir qué fase le falta.
- La plantilla `_templateRubroVariantEvent` en `_template.ts` es el punto de partida.

---

## 10. Hitos: una decisión que abre cada fase

Un evento principal con `milestone: true` es el **hito de su fase**: sale en el **primer año** de esa fase, antes que cualquier otro evento (incluso que uno diferido). En la fase 1 el primer año es el primer evento de la partida. El resto de los años se sortea como siempre.

- **Hoy:** `f1_mvp_calidad` (y sus versiones por rubro), `f2_primera_contratacion`, `f3_ronda_inversion` y `f4_sucesion_operativa`.
- **Uno por fase y rubro, exactamente** (`validateMilestones`): 0 hitos o 2 hitos en la misma fase y rubro rompen el test.
- **Sin condiciones de entrada** salvo el rubro: ni tags, ni perfil, ni financiamiento, ni métricas, ni eventos previos. Tiene que poder salir siempre en ese año.
- **Tiene que ser un evento principal** (no crisis, imprevisto ni rescate).
- Pensalo como la decisión que define la etapa: la que más pesa o la que abre los caminos de la fase (por ejemplo, la ronda de inversión en la fase 3). Hoy solo cambia **cuándo** sale; el hito se ve igual que el resto de los eventos.
- Para tener más de un hito por fase (por ejemplo, uno por camino elegido antes), habría que ampliar la regla del motor y del validador: no alcanza con marcar otro evento.
- La plantilla `_templateMilestoneEvent` es el punto de partida.

---

## 11. Rescate, crisis e imprevistos

Tres mecanismos de interrupción, todos fuera del pool de la fase:

- **Crisis** (`crisis_*`, `kind: 'crisis'`): después de resolver un evento principal, si alguna métrica quedó en **25 o menos**, sale una crisis elegible (cada crisis exige su métrica en `< 26`). Cada una tiene que dar una salida; la de caja (`crisis_quiebra_inminente`) tiene una opción que **no** toca el Bienestar, para no empujar al jugador a un burnout.
- **Imprevistos** (`imp_*`, `kind: 'unforeseen'`): después de un evento principal hay **25 %** de probabilidad de imprevisto (**45 %** desde el año 7 si todavía no salió ninguno). **Máximo 2 por partida** (`MAX_UNFORESEEN` en `game/engine.ts`).
- **Rescate** (`rescate_capital`, `rescate_bienestar`, `rescate_reputacion`, `kind: 'rescue'`): **una vez por partida**. La primera vez que una métrica llega a 0 no se pierde: la partida sigue con esa métrica en 0 y, en el mismo año, sale el rescate de esa métrica. La segunda vez que una métrica llega a 0 (incluso la misma), la partida termina. Si pasa en el último año, el rescate sale antes de la victoria.
  - Estado: `GameState.rescueUsed` (ya se usó) y `rescuePending` (la métrica que espera su rescate); `selectRescueEvent` en `game/engine.ts`. Ambos son opcionales, así que los guardados viejos funcionan.
  - **Reglas de contenido:** un evento por métrica con id `rescate_<métrica>` (el motor lo busca por el nombre); sin `when`, sin `weight` y sin sorpresas; las opciones suben esa métrica **25 puntos o más** y los costos inmediatos son de **-5 como máximo**. El costo grande va en un **tag** (hoy `deuda_riesgosa`, `equity_diluido`, `socio_conflictivo`), así el rescate no mata a la empresa por otro lado. Los tests validan las cifras.
  - Si dos métricas llegan a 0 a la vez, se atiende primero la caja; la otra termina la partida si sigue en 0 después del rescate.
  - Los rescates no usan `{nombre}` (cuentan para el tope de la sección 5).
  - La plantilla `_templateRescueEvent` es el punto de partida.

---

## 12. Opciones que cierran la partida

Una opción puede terminar la partida en el acto, aunque queden años por jugar: vender la empresa, retirarse, cerrar un ciclo. Se marca con `endsGame: true` en `defineOption`:

```ts
defineOption(
  'Vender tus acciones y aceptar el cheque para retirarte.',
  { capital: +50, reputacion: +10, bienestar: +20 },
  {
    addTags: ['salida_exitosa_venta'],
    endsGame: true,
    learningPill: 'Estrategia de Salida (Exit): …',
    outcomeText: 'Aceptaste la oferta y te retiraste, cerrando un ciclo.',
  }
)
```

- **Qué pasa:** se aplican los efectos y las etiquetas de la opción, el jugador ve su resultado y el botón pasa a "Ver Desenlace Final". La partida termina con **victoria** en ese año (`applyDecision` en `game/engine.ts`) y el registro de la decisión queda con `endsGame: true`. Las otras opciones del evento siguen la partida normalmente.
- **Cuándo no gana:** si los efectos de esa misma decisión dejan una métrica en 0, manda la regla de siempre (rescate la primera vez, derrota la segunda). El cierre solo gana si la partida seguía en pie.
- **Etiqueta de salida obligatoria:** la opción tiene que sumar `salida_exitosa_venta`, `lifestyle_business` o `expansion_global`. De ella salen el título y el relato del final (`buildEpilogue`) y cuenta para el objetivo "Llegar a la salida" (sección 13).
- **Dónde va:** solo en eventos principales (no crisis, imprevistos ni rescates), sin `minigame` ni `scheduledEvent` en la misma opción. `validateEndingOptions` lo verifica y el test falla si no se cumple.
- **El final se adapta solo:** el informe dice "Cerraste tu historia en el año N de M, antes del final del recorrido" y la fase en la que cerraste no figura como incompleta.
- **Para escribir el evento:** el `outcomeText` es la última escena, así que va en pasado y sin dejar cosas abiertas. Y no pongas una opción de cierre en una fase temprana sin pensar el balance: es una victoria inmediata, tiene que costar algo (dilemas como "monetizar ahora o seguir creciendo").
- **Hoy hay una sola:** vender en `f4_intento_compra_hostil`. Los efectos todavía no se recalibraron: queda para el ajuste de balance posterior a la carga masiva de eventos.
- La plantilla `_templateEndingEvent` es el punto de partida.

---

## 13. Objetivos: qué evalúa el informe

Al empezar, el jugador elige un **objetivo** (`src/data/objetivos.ts`) y el informe final dice si lo cumplió. **No cambia los eventos ni el motor**: se evalúa al final con `evaluateObjective` (`game/objectives.ts`). Perder es no cumplir.

| Objetivo | Se cumple si |
|---|---|
| Hacer caja | Capital ≥ 70 |
| Marca reconocida | Reputación ≥ 90 |
| Empresa sana | las tres métricas ≥ 70 |
| Llegar a la salida | algún tag de salida: `salida_exitosa_venta`, `lifestyle_business` o `expansion_global` |
| Empresa modelo (muy difícil) | las tres métricas ≥ 90 |

- **Los mínimos salen de simular partidas** y dependen del contenido: cuando se carguen muchos eventos hay que **recalibrarlos** (los números están en `objetivos.ts`; la simulación de la sección 14 sirve de base).
- **Reputación** casi siempre termina cerca de 100 en las partidas que se ganan, por lo que "Marca reconocida" casi equivale a ganar sin sacrificarla: vigilarlo al sumar eventos (si muchas opciones suben Reputación, el objetivo deja de discriminar).
- **Llegar a la salida** exige que haya opciones que agreguen un tag de salida en la fase 4. Si se retiran o se suman eventos de salida, revisar `EXIT_TAGS` en `game/objectives.ts`.

---

## 14. Flujo de Trabajo

1. Para agregar eventos a la fase N, editá `src/data/events/faseN.ts`.
2. Si inventás un tag nuevo, agregalo primero en `src/data/tags.ts` con su label y modifier pasivo.
3. Copiá la estructura de `src/data/events/_template.ts` si necesitás arrancar de cero.
4. Ejecutá en la terminal:
   ```bash
   pnpm test
   ```
   - Los errores **bloquean** (el test falla): ids, opciones, píldoras, tags, pacing por rubro, schedule, rubros inexistentes, hitos (uno por fase y rubro) y opciones de cierre.
   - Los warnings **informan** (se imprimen, no bloquean): tags huérfanos e impactos repetidos. Revisalos igual: un tag huérfano es contenido muerto.
5. La simulación de Monte Carlo (`completability.spec.ts`) corre miles de partidas con 3 estrategias, en las dos duraciones (10 y 15 años) y rotando el rubro, e imprime la distribución de finales:
   - `ended_early` debe ser 0: si sube, falta un evento base en alguna fase o un gated bloquea el pool.
   - `victory` debe ser > 0: si cae a 0, el balance es demasiado letal.
   - Si toda una estrategia termina en `game_over_capital`, los costos de esa ruta están desbalanceados.

Comandos útiles:

```bash
pnpm test        # corre toda la suite una vez (validador + motor + simulación)
pnpm test:watch  # modo watch para iterar mientras escribís eventos
```
