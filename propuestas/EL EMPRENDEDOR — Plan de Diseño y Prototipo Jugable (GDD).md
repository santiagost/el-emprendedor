# EL EMPRENDEDOR — Plan de Diseño y Prototipo Jugable (GDD)

> **Documento de Especificación de Juego (Single-Player)**
> **Estado:** Base para desarrollo de prototipo jugable (MVP)
> **Objetivo:** Experiencia lúdica, individual y dinámica sobre el camino de emprender, invertir y gestionar recursos, funcionando como introducción y gancho conceptual a la estrategia de negocios.

---

## 1. Visión y Propósito del Juego

**El Emprendedor** es un simulador narrativo y de toma de decisiones donde el jugador experimenta la montaña rusa de fundar, financiar, escalar y defender un negocio propio.

* **Público y Formato:** Un jugador (Single-Player), sesión ágil de **10 a 15 minutos** (15 a 20 turnos).
* **Sensación de Juego:** Rápido, con dilemas constantes, riesgo financiero real y consecuencias acumulativas (estilo *Reigns* cruzado con simulador de carrera empresarial).
* **Rol en el Ecosistema:** Funciona como **embudo de entrada** (*lead-in*). Es un juego atractivo y rejugable que despierta curiosidad sobre cómo manejar variables comerciales complejas, invitando al jugador a dar el salto al *Simulador de Estrategia Comercial*.

---

## 2. Diferencias Clave con la Versión Anterior

| Elemento | Versión Anterior (Propuesta) | Nueva Versión (Plan de Juego) |
| --- | --- | --- |
| **Audiencia / Modo** | Híbrido Individual + Modo Aula grupal. | **100% Individual (en solitario).** Cero fricción de salas o docente en vivo. |
| **Carga Educativa** | Debates teóricos extensos. | **Micro-píldoras conceptuales** (1-2 líneas post-decisión). |
| **Duración** | 30 turnos largos. | **15 a 20 turnos ágiles** pensados para rejugabilidad inmediata. |
| **Foco Temático** | Vida del fundador + dilemas cotidianos. | **Toma de riesgo, inversiones, supervivencia y tracción.** |

---

## 3. Núcleo Jugable (Core Loop)

El ciclo de juego es continuo, directo y sin tiempos muertos:

```text
┌────────────────────────────────────────────────────────┐
│                   INICIO DE TURNO                      │
│   Se presenta un Acontecimiento / Oportunidad / Crisis │
│   (Viene condicionado por la etapa y los Tags ocultos) │
└──────────────────────────┬─────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│                   TOMA DE DECISIÓN                     │
│        El jugador evalúa 2 o 3 opciones claras:        │
│    (Se muestra tendencia cualitativa del impacto)      │
└──────────────────────────┬─────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│                RESOLUCIÓN Y FEEDBACK                   │
│   • Variación visible de métricas                      │
│   • Asignación/Retiro de Tags Ocultos                  │
│   • "Bocado de Aprendizaje" (Concepto breve aplicado)  │
└──────────────────────────┬─────────────────────────────┘
                           ↓
       ¿Métricas en 0? ──► SÍ ──► QUIEBRA / BURNOUT 
              │
              NO
              ↓
  ¿Turno final completado? ──► SÍ ──► EPÍLOGO & RESULTADO
              │
              NO ──► [Siguiente Turno]

```

---

## 4. Las 4 Fases del Emprendimiento (Sin límite etario)

En lugar de avanzar por cumpleaños, la partida avanza según la maduración del negocio:

```text
FASE 1: GÉNESIS & VALIDACIÓN (Turnos 1 a 4)
  └─ De la idea al primer producto. Conseguir primeros clientes.
  
FASE 2: TRACCIÓN & FLUJO DE FONDOS (Turnos 5 a 9)
  └─ El negocio funciona, pero falta caja. Dilemas de contratación y proveedores.
  
FASE 3: ESCALA & COMPETENCIA (Turnos 10 a 15)
  └─ Presión del mercado, rondas de inversión, delegar o perder el control.
  
FASE 4: CONSOLIDACIÓN & SALIDA (Turnos 16 a 20)
  └─ Adquisición hostil, venta millonaria, salida a bolsa o empresa sustentable.

```

---

## 5. Configuración Inicial de la Partida

El setup inicial toma menos de 30 segundos mediante dos elecciones rápidas:

### A. Arquetipo del Fundador (Condiciones de partida)

1. **El Técnico / Creador:** Alto conocimiento del producto, red comercial baja. Empieza con producto validado rápido, pero sufre en ventas.
2. **El Comercial / Negociador:** Gran reputación y contactos iniciales, poco control técnico. Gasta más en desarrollo.
3. **El Inversor / Ahorrista:** Mayor capital inicial, pero alta aversión al riesgo o menor empatía con el equipo.

### B. Origen del Financiamiento Inicial

* **Bootstrapping (Fondos propios):** 100% autonomía, capital muy ajustado.
* **Préstamo / Deuda:** Buen capital de arranque, presión constante por intereses.
* **Socio Capitalista / Inversor ángel:** Capital holgado, pero cede porcentaje y capacidad de decidir solo.

---

## 6. Sistema de Métricas y Motor de Tags

### Métricas Visibles (Barras de Supervivencia: 0 a 100)

* **Capital (Caja / Liquidez):** Si llega a **0**, la empresa quiebra.
* **Reputación (Confianza de Mercado / Marca):** Si llega a **0**, nadie te compra ni te financia.
* **Bienestar (Energía / Sostenibilidad del Emprendedor):** Si llega a **0**, el fundador colapsa por burnout.

> *Regla de diseño:* Si el jugador solo maximiza Capital destruyendo Bienestar o Reputación, pierde igual. Emprender exige equilibrio.

### Motor de Tags Ocultos (Lógica sin árboles rígidos)

Los Tags son etiquetas internas que no se muestran como números, pero registran decisiones pasadas para desencadenar eventos futuros:

* `[deuda_riesgosa]`: Habilitará eventos de corrida financiera en Fase 3 si la economía tambalea.
* `[socio_alineado]` vs. `[socio_conflictivo]`: Define si en una crisis el socio te rescata o te intenta quitar la empresa.
* `[calidad_sacrificada]`: Aumenta margen a corto plazo, pero detona un evento de cancelación de contratos más adelante.
* `[equity_diluido]`: Reduce tus opciones en la votación final de venta de la empresa.

---

## 7. Decisiones con Micro-Píldoras de Aprendizaje

Para que el juego enseñe **sin aburrir ni cortar el ritmo**, la teoría se presenta en cápsulas de una oración directamente ligadas a lo que acaba de ocurrir:

### Ejemplo de Turno (Fase 2)

> **Evento:** Un cliente corporativo enorme quiere contratarte, pero exige 120 días de plazo para pagar y exclusividad total de tu capacidad.
> * **Opción A: Aceptar el contrato.** (+Reputación alta, +Caja futura diferida, añade tag `[cliente_dependencia]`).
> * **Opción B: Rechazar y priorizar clientes chicos con pago al contado.** (+Caja inmediata moderada, -Reputación inmediata, añade tag `[clientes_diversificados]`).
> * **Opción C: Negociar anticipo del 30% a riesgo de que se caiga la propuesta.** (Tirada de riesgo según tu Reputación actual).
> 
> 

**Feedback en pantalla al elegir Opción A:**

* *Métricas:* Capital -$15.000 (costo operativo inmediato) | Reputación +25.
* **Micro-Píldora:** *"Cuidado con el Capital de Trabajo: muchas empresas quiebran siendo rentables en los papeles simplemente porque se quedan sin caja mientras esperan cobrar."*

---

## 8. Catálogo Base de Dilemas y Acontecimientos

1. **Inversión y Dilución:** Ceder el 30% de la empresa a un fondo VC para acelerar el crecimiento vs. crecer orgánicamente a paso lento.
2. **Proveedores y Operaciones:** Proveedor único barato del exterior vs. red local diversificada más cara pero inmune a aduanas y devaluaciones.
3. **Talento y Cultura:** Contratar a un "rockstar" carísimo y conflictivo vs. formar talento junior leal pero lento.
4. **Dilemas Éticos y Atajos:** Copiar una patente desprotegida o usar datos de usuarios sin consentimiento para traccionar métricas rápido.

---

## 9. Epílogos y Condiciones de Victoria

No existe un único final de "Ganaste". Al terminar el turno 20 (o al quebrar), el juego emite un **informe de perfil emprendedor** y un desenlace narrativo:

* **El Unicornio Adquirido:** Vendiste tu empresa a un gigante por millones, pero tu creación ya no te pertenece.
* **El Negocio Sostenible (Lifestyle Business):** No sos multimillonario, pero construiste una empresa sólida, rentable y con tiempo libre de calidad.
* **El Fundador Desplazado:** Tu empresa vale una fortuna, pero el directorio te echó de tu propio puesto de CEO por dilución excesiva.
* **Quiebra Temprana (Lección Forzosa):** Te quedaste sin liquidez en la fase de validación. *"El 80% de los emprendedores exitosos fracasó en su primer intento. Volvé a intentarlo con lo aprendido."*

---

## 10. Conexión con el Juego de Estrategia Comercial (El "Gancho")

Al finalizar la partida de *El Emprendedor*, la pantalla de cierre muestra:

> **"Dominaste el camino del fundador. Ahora es momento de entrar al mercado real."**
> *"En el simulador comercial vas a competir equipo contra equipo definiendo precio, calidad, distribución y posicionamiento de producto. ¿Tenés la estrategia para ganar la cuota de mercado?"*
> `[Botón: Conocer el Simulador Comercial]`

---

## 11. Plan de Desarrollo para el Prototipo Jugable (MVP)

Para llegar a la reunión con Fran con una demo en mano, el alcance técnico se acota a:

* **Arquitectura:** Web app simple (React / Next.js o Vite), 100% responsiva (se juega impecable en celular).
* **Volumen del MVP:**
* 12 a 15 turnos preconfigurados.
* 2 arquetipos iniciales.
* 3 métricas funcionales (Capital, Reputación, Bienestar).
* 6 tags ocultos que alteren 2 eventos clave.
* 3 epílogos posibles.


* **Hito de Validación:** Que el docente pueda agarrar el teléfono, jugar 8 minutos, experimentar una crisis financiera provocada por una decisión previa, y ver cómo el juego explica el concepto en una sola frase contundente.