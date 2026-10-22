# Manual de Autoría de Eventos — "El Emprendedor"

Guía para diseñar, redactar y balancear eventos respetando el motor y las suites de prueba automáticas.

---

## 1. Reglas de Oro (Validación Estática)

El validador de contenido (`pnpm test`) rechaza cualquier evento que viole estas reglas:

1. **Prefijo de ID obligatorio**: debe comenzar con `f<fase>_` (ej. `f1_primer_mvp`, `f3_quiebre_stock`).
2. **2 o 3 opciones**: no se admiten eventos de opción única ni más de 3.
3. **Píldora obligatoria**: cada opción debe tener `learningPill` con texto no vacío.
   - Formato sugerido: `[Concepto de Negocio]: [Explicación de la consecuencia real]`.
4. **Tags tipados**: cualquier tag en `addTags`, `removeTags`, `when.tags` o `when.forbiddenTags` debe estar registrado en `src/data/tags.ts`. Un typo es un error de compilación, no un bug silencioso.
5. **Presupuesto mínimo de eventos base**:
   - Cada fase dura una cantidad fija de turnos.
   - Debe haber **como mínimo tantos eventos base (sin `when.tags`) como turnos dura la fase**:
     - **Fase 1** (Turnos 1 a 3): ≥ 3 eventos base.
     - **Fase 2** (Turnos 4 a 6): ≥ 3 eventos base.
     - **Fase 3** (Turnos 7 a 10): ≥ 4 eventos base.
     - **Fase 4** (Turnos 11 a 15): ≥ 5 eventos base.
   - *Objetivo recomendado para rejugabilidad*: apuntar a 1.5 a 2 eventos base por turno.
6. **scheduledEvent válido**: si una opción programa un evento diferido, el `eventId` debe existir y `delayTurns >= 1`.

---

## 2. API de Builders

Nunca escribas objetos en crudo ni `impactPreview` manual. Usá los helpers de `src/data/events/builders.ts`:

- `defineOption(text, effects, extra)`:
  - `text`: texto del botón.
  - `effects`: `{ capital?, bienestar?, reputacion? }` (sugerido entre -30 y +30 para mantener el balance).
  - `extra`: `{ addTags?, removeTags?, learningPill, scheduledEvent? }`.
  - El `impactPreview` (↑ ↓ →) se deriva solo del signo de `effects` y la interfaz lo renderiza automáticamente en los botones de decisión y en el setup inicial (`ImpactBadges`).
- `defineEvent({ id, phaseId, title, description, weight?, when?, options })`:
  - `phaseId`: 1 | 2 | 3 | 4. El id debe empezar con `f<phaseId>_`.
  - `weight`: probabilidad relativa en el sorteo (por defecto 10). Subir a 20-30 para eventos de crisis o consecuencias inmediatas.
  - `when`: `{ tags?, forbiddenTags?, archetype?, financing?, metrics?, playedBefore? }`. Un evento **base** es el que no tiene condiciones restrictivas de entrada.
  - Asserts en dev: id con prefijo de fase, 2-3 opciones, `learningPill` en todas.
- **Panel de Resultado**: al decidir, el jugador ve los deltas numéricos aplicados (+XX / -XX), los efectos pasivos de tags y la micro-píldora antes de avanzar de turno.
- `src/data/events/_template.ts` tiene plantillas listas para copiar: evento base y evento condicionado. El validador ignora los exports con prefijo `_`.

---

## 3. ¿Cuándo usar `when` vs `scheduledEvent`?

- **Usá `when` (Probabilístico / Estado)**:
  - Cuando la consecuencia dependa de una condición general que el jugador construyó (ej. tener `deuda_riesgosa` o `equipo_sobrecargado`).
  - El evento entra al bolillero de su fase y compite por probabilidad mientras los tags sigan activos.
  - `tags`: requiere TODOS presentes. `forbiddenTags`: bloquea con CUALQUIERA presente.
- **Usá `scheduledEvent` (Determinista / Retardo fijo)**:
  - Cuando una opción puntual detona un hecho inevitable en N turnos (ej. "Pedís un préstamo express a 3 turnos" → programa la visita del prestamista con `delayTurns: 3`).
  - Al cumplirse el plazo (`currentTurn >= triggerTurn`), el evento tiene prioridad absoluta en la selección.
  - El disparo verifica además las condiciones del evento destino: si no se cumplen en el turno programado, el evento queda en cola y salta con prioridad apenas las condiciones cambien.
- **Regla de pulgar**: crónica de un estado ("estás endeudado") = `when`. Factura con vencimiento ("la deuda vence en 2 turnos") = `scheduledEvent`.

---

## 4. Tags: consumo y tags del setup

- Todo tag que nace en una opción debería ser **consumido** por un `when`, un `schedule` o un modifier pasivo. El detector de tags huérfanos (`detectOrphanTags`) avisa los que nadie usa.
- Los tags del setup (arquetipo + financiamiento) entran activos desde el turno 1: `calidad_producto`, `generacion_ingresos`, `red_contactos`, `inversiones`, `patrimonio`, `autonomia_estrategica`, `deuda_riesgosa`, `equity_diluido`.
- Hoy `inversiones` y `patrimonio` (los del arquetipo Inversionista) no los consume ningún evento: el detector los reporta como huérfanos. Son candidatos naturales para los primeros eventos condicionados por perfil (Etapa C1).
- `modifiers` en `src/data/tags.ts` son beneficios/costos pasivos: la suma de los modifiers de todos los tags activos se aplica al resolver cada decisión (una vez por turno), después de los `effects` de la opción y antes del chequeo de derrota.

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
- No hace falta tocar todos los eventos: hoy 10 eventos clave lo usan (socios, inversores, crisis).

---

## 6. Puesta en escena de crisis e imprevistos

Los eventos con `kind: 'crisis'` o `kind: 'unforeseen'` no se muestran de golpe: entran con una coreografía (corte, cintilla de noticias, sello y suspenso) definida en `src/game/stage.ts`. Es solo capa visual; el motor no la usa.

- **Sin hacer nada**, un evento nuevo usa el estilo de su tipo: sello "CRISIS" en rojo o "IMPREVISTO" en ámbar.
- **Para darle identidad propia**, agregá su id en `STAGE_BY_EVENT` con el sello (una palabra corta, en mayúsculas) y las frases del ticker:
  ```ts
  imp_corte_de_luz: { stamp: 'APAGÓN', ticker: ['Sin servicio en la zona', 'Último momento'] },
  ```
- **Oportunidades** (un imprevisto bueno, como la viralización): sumá `tone: 'opportunity'` y `ribbon: 'Tendencia'`. Usan verde, más saturación y confeti en lugar de grises.
- **El ticker no adelanta el contenido:** frases de clima ("Mercados en alerta"), nunca la consecuencia.
- `stage.spec.ts` falla si una entrada de `STAGE_BY_EVENT` apunta a un id que no existe o que no es una interrupción, y si un sello pasa de 14 caracteres.

---

## 7. Flujo de Trabajo

1. Para agregar eventos a la fase N, editá `src/data/events/faseN.ts`.
2. Si inventás un tag nuevo, agregalo primero en `src/data/tags.ts` con su label y modifier pasivo.
3. Copiá la estructura de `src/data/events/_template.ts` si necesitás arrancar de cero.
4. Ejecutá en la terminal:
   ```bash
   pnpm test
   ```
   - Los errores **bloquean** (el test falla): ids, opciones, píldoras, tags, pacing, schedule.
   - Los warnings **informan** (se imprimen, no bloquean): tags huérfanos e impactos repetidos. Revisalos igual: un tag huérfano es contenido muerto.
5. La simulación de Monte Carlo corre miles de partidas con 3 estrategias e imprime la distribución de finales:
   - `ended_early` debe ser 0: si sube, falta un evento base en alguna fase o un gated bloquea el pool.
   - `victory` debe ser > 0: si cae a 0, el balance es demasiado letal.
   - Si toda una estrategia termina en `game_over_capital`, los costos de esa ruta están desbalanceados.

Comandos útiles:

```bash
pnpm test        # corre toda la suite una vez (validador + motor + simulación)
pnpm test:watch  # modo watch para iterar mientras escribís eventos
```
