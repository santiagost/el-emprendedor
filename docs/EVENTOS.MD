# Manual de Autoría de Eventos — "El Emprendedor"

Guía para diseñar, redactar y balancear eventos respetando el motor y las suites de prueba automáticas.

---

## 1. Reglas de Oro (Validación Estática)

El validador de contenido (`pnpm test`) rechaza cualquier evento que viole estas reglas:

1. **Prefijo de ID obligatorio**: debe comenzar con `f<fase>_` (ej. `f1_primer_mvp`, `f3_quiebre_stock`).
2. **2 o 3 opciones**: no se admiten opciones únicas ni más de 3.
3. **Píldora obligatoria**: cada opción debe tener `learningPill` con texto no vacío.
   - Formato sugerido: `[Concepto de Negocio]: [Explicación de la consecuencia real]`.
4. **Tags tipados**: cualquier tag en `addTags`, `removeTags`, `when.tags` o `when.forbiddenTags` debe estar registrado en `src/data/tags.ts`.
5. **Presupuesto mínimo de eventos base**:
   - Cada fase dura una cantidad fija de turnos.
   - Debe haber **como mínimo tantos eventos base (sin `when.tags`) como turnos dura la fase**:
     - **Fase 1** (Turnos 1 a 3): $\ge 3$ eventos base.
     - **Fase 2** (Turnos 4 a 6): $\ge 3$ eventos base.
     - **Fase 3** (Turnos 7 a 10): $\ge 4$ eventos base.
     - **Fase 4** (Turnos 11 a 15): $\ge 5$ eventos base.
   - *Objetivo recomendado para rejugabilidad*: apuntar a 1.5 a 2 eventos base por turno.

---

## 2. API de Builders

Nunca escribas objetos en crudo ni `impactPreview` manual. Usá los helpers de `src/data/events/builders.ts`:

- `defineOption(text, effects, extra)`:
  - `text`: texto del botón.
  - `effects`: `{ capital?, bienestar?, reputacion? }` (valores entre -30 y +30).
  - `extra`: `{ addTags?, removeTags?, learningPill, scheduledEvent? }`.
- `defineEvent({ id, phase, title, description, weight?, when?, options })`:
  - `weight`: probabilidad relativa en el sorteo (por defecto 10). Subir a 20-30 para eventos de crisis o consecuencias inmediatas.

---

## 3. ¿Cuándo usar `when` vs `scheduledEvent`?

- **Usá `when` (Probabilístico / Estado)**:
  - Cuando la consecuencia dependa de una condición general que el jugador construyó (ej. tener `deuda_riesgosa` o `equipo_sobrecargado`).
  - El evento entra al bolillero de su fase y compite por probabilidad mientras el tag siga activo.
- **Usá `scheduledEvent` (Determinista / Retardo fijo)**:
  - Cuando una opción puntual detona un hecho inevitable en $N$ turnos (ej. "Pedís un préstamo express a 3 turnos" $\to$ programa la visita del prestamista en `delayTurns: 3`).
  - Al cumplirse el plazo, el evento tiene prioridad absoluta en la selección.

---

## 4. Flujo de Trabajo

1. Para agregar eventos a la fase $N$, edita `src/data/events/faseN.ts`.
2. Si inventás un tag nuevo, agregalo primero en `src/data/tags.ts` con su label y modifier pasivo.
3. Ejecutá en la terminal:
   ```bash
   pnpm test