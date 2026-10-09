# EL EMPRENDEDOR

## Propuesta conceptual del juego

## Esta propuesta reúne y formaliza una primera interpretación de la idea conversada inicialmente con el docente. Las mecánicas, reglas, duración y contenidos aquí presentados son propuestas preliminares sujetas a validación.

### 1. Idea general

**El Emprendedor** es un juego de simulación y toma de decisiones en el que cada jugador recorre la vida profesional de un emprendedor desde sus primeros pasos hasta la consolidación, venta o fracaso de su empresa.

La propuesta toma como referencia el formato de juegos narrativos de carrera: en lugar de controlar todas las actividades diarias de una empresa, el jugador atraviesa **momentos importantes de su trayectoria** y debe decidir cómo actuar frente a oportunidades, problemas, crisis y dilemas.

La partida está planteada inicialmente en **30 turnos**, comenzando alrededor de los 18 años del personaje y recorriendo distintas etapas de su desarrollo profesional y empresarial.

El objetivo no sería únicamente “ganar dinero”, sino enfrentar al alumno a decisiones relacionadas con:

* formación;
* riesgo;
* crecimiento;
* administración de recursos;
* oportunidades de negocio;
* socios y equipos;
* ética;
* vida personal;
* cambios del mercado;
* adaptación ante crisis.

---

# 2. ¿Qué experiencia vive el jugador?

La experiencia general puede entenderse como un ciclo:

```text
┌──────────────────────┐
│   CREAR PERSONAJE    │
│                      │
│ ¿Estudiar o no?      │
│ ¿Trabajar o          │
│ emprender full-time? │
│ ¿En qué área/rubro?  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│INICIAR EMPRENDIMIENTO│
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│       TURNO          │
│                      │
│ Ocurre una situación │
│ o aparece una        │
│ oportunidad/problema │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│       DECISIÓN       │
│                      │
│ El jugador elige     │
│ cómo actuar          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    CONSECUENCIAS     │
│                      │
│ Cambia su empresa,   │
│ relaciones, recursos │
│ o situación personal │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  EVOLUCIÓN HISTORIA  │
│                      │
│ Lo realizado puede   │
│ afectar futuros      │
│ acontecimientos      │
└──────────┬───────────┘
           ↓
      ¿FIN DE PARTIDA?
        ↙         ↘
      NO           SÍ
      ↓             ↓
 SIGUIENTE      RESULTADO
   TURNO          FINAL
```

La característica central es que **las decisiones no son preguntas aisladas**.

Una decisión tomada al comienzo de la partida puede producir beneficios inmediatos, generar problemas varios turnos después o abrir oportunidades que otro jugador nunca llegará a experimentar.

---

# 3. Punto de partida: diferentes caminos

Al comenzar, el jugador toma decisiones que determinan las condiciones iniciales de su carrera.

Una de las propuestas actuales combina dos decisiones principales:

|                             | Universidad                                                                                                                           | Calle / Formación práctica                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Relación de dependencia** | Trabaja, estudia y desarrolla su emprendimiento simultáneamente. Mayor estabilidad económica, menor disponibilidad de tiempo.         | Trabaja durante el día y desarrolla su negocio en paralelo. Obtiene experiencia práctica e ingresos estables.               |
| **Emprendedor Full-Time**   | Estudia mientras intenta desarrollar su empresa. Tiene acceso a conocimientos y entorno universitario, pero posee recursos limitados. | Se dedica completamente al negocio desde el comienzo. Puede crecer rápidamente, pero asume un riesgo económico mucho mayor. |

Esta matriz actualmente da origen a cuatro perfiles *provicionales* iniciales: **Estratega, Noctámbulo, Académico y Kamikaze**.

No se busca determinar que exista un camino “correcto”.

Cada alternativa ofrece:

* ventajas;
* dificultades;
* oportunidades;
* riesgos;
* tipos de acontecimientos diferentes.

### Esquema

```text
                         INICIO
                           │
                  ¿CÓMO ME FORMO?
                    ↙             ↘
              UNIVERSIDAD         CALLE
                  │                 │
                  └───────┬─────────┘
                          ↓
                  ¿CÓMO ME SOSTENGO?
                    ↙             ↘
             RELACIÓN DE       EMPRENDEDOR
             DEPENDENCIA        FULL-TIME
                    ↓             ↓

              Se genera el perfil inicial
                     del jugador
                          ↓
            Ventajas + Riesgos + Oportunidades
                         ↓
                    COMIENZA LA
                    TRAYECTORIA
```

Dentro del camino universitario se plantea, además, que el jugador pueda seleccionar diferentes ingenierías, mientras que el camino no universitario podría presentar distintos rubros u oficios empresariales equivalentes.

Este punto debe ser **validado y profundizado**.

---

# 4. ¿Qué ocurre durante una partida?

La partida representa la evolución del jugador y de su emprendimiento.

No todos los jugadores deberían atravesar exactamente las mismas situaciones.

Los acontecimientos que aparecen pueden depender de:

```text
DECISIONES ANTERIORES
        +
SITUACIÓN ACTUAL
        +
CAMINO ELEGIDO
        +
ETAPA DE LA PARTIDA
        +
FACTORES EXTERNOS
        ↓
 ACONTECIMIENTO
```

Esto permite generar diferentes historias utilizando un conjunto común de situaciones.

### Ejemplo

Un jugador decidió asociarse con una persona muy ambiciosa.

```text
Turno 5
El jugador acepta al socio
        ↓
La empresa crece
        ↓
Pasan varios turnos
        ↓
La empresa adquiere mucho valor
        ↓
Puede aparecer:
"Tu socio quiere tomar el control
de la empresa"
```

Otro jugador que nunca eligió ese socio simplemente no tendría esa situación.

Por lo tanto, el juego genera una **historia que responde a las decisiones realizadas anteriormente**.

---

# 5. Estructura conceptual de un turno

La versión inicial del proyecto propone que cada turno represente un momento relevante en la evolución del emprendimiento.

Una posible estructura es:

```text
┌──────────────────────────────┐
│      SITUACIÓN ACTUAL        │
│                              │
│ Estado de la empresa         │
│ + situación personal         │
│ + contexto externo           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        ACONTECIMIENTO        │
│                              │
│ Problema / oportunidad /     │
│ crisis / propuesta           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│          DECISIÓN            │
│                              │
│ Opción A                     │
│ Opción B                     │
│ Otras opciones posibles      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       CONSECUENCIAS          │
│                              │
│ Empresa                      │
│ Personas                     │
│ Recursos                     │
│ Reputación                   │
│ Situaciones futuras          │
└──────────────┬───────────────┘
               ↓
          SIGUIENTE TURNO
```

En el desarrollo informal también surgió la posibilidad de incorporar dentro de cada turno una elección de foco y una mejora progresiva de capacidades, además del acontecimiento narrativo.

La forma definitiva del turno es uno de los aspectos a **validar**.

---

# 6. Indicadores principales

Actualmente se *proponen inicialmente* tres dimensiones que permiten representar la situación general del jugador:

### Capital

Representa los recursos económicos disponibles para mantener y desarrollar el emprendimiento.

### Reputación

Representa la imagen construida frente a clientes, inversores, empleados, instituciones y mercado.

### Moral / Burnout

Representa el impacto personal y humano que genera sostener el emprendimiento y las decisiones adoptadas.

Estas tres variables forman actualmente la base del equilibrio de la partida.

Visualmente podrían mostrarse permanentemente:

```text
CAPITAL
████████████████░░░░  78 %

REPUTACIÓN
██████████████░░░░░░  67 %

BIENESTAR
██████████░░░░░░░░░░  49 %
```

La lógica buscada es que maximizar una sola dimensión no garantice el éxito.

Por ejemplo:

```text
          CRECIMIENTO
             /\
            /  \
           /    \
          /      \
         /        \
REPUTACIÓN ------ BIENESTAR
```

El jugador debe administrar los distintos aspectos de su trayectoria y enfrentar las consecuencias de los desequilibrios.

---

# 7. Tipos de acontecimientos

Para evitar que la partida sea únicamente una sucesión de situaciones aleatorias, se propone trabajar con diferentes clases de acontecimientos.

### A. Acontecimientos normales

Situaciones propias de administrar una empresa:

* conseguir un cliente;
* perder una venta;
* contratar una persona;
* invertir;
* obtener financiamiento;
* tener problemas de producción;
* negociar con proveedores;
* enfrentar competencia.

### B. Acontecimientos derivados de decisiones anteriores

Solamente aparecen porque previamente sucedió algo.

```text
DECISIÓN ANTERIOR
        ↓
CONSECUENCIA FUTURA
```

Ejemplo:

```text
Aceptaste un gran cliente
con condiciones desfavorables
        ↓
Años después representa
el 70 % de tus ingresos
        ↓
Amenaza con abandonar
la empresa
```

### C. Acontecimientos personales

Relacionan la actividad profesional con la vida del emprendedor:

* agotamiento;
* familia;
* tiempo disponible;
* estrés;
* conflictos personales.

La idea original ya contempla el burnout como una consecuencia acumulativa de priorizar permanentemente el negocio.

### D. Dilemas éticos

El jugador puede encontrar caminos que ofrecen una ventaja inmediata a cambio de tomar una decisión incorrecta.

La propuesta actual contempla que esas decisiones puedan generar consecuencias negativas posteriores, aunque el jugador no necesariamente conozca cuándo ocurrirán.

### E. Acontecimientos externos

Representan situaciones que el emprendedor no controla:

* inflación;
* recesión;
* cambios regulatorios;
* escasez de insumos;
* nuevas tecnologías;
* cambios en el mercado;
* crisis económicas;
* oportunidades extraordinarias.

Estos acontecimientos permiten transmitir una idea central:

> **El resultado de una empresa no depende exclusivamente de las decisiones internas. También debe adaptarse al contexto.**

---

# 8. Una misma situación puede afectar de manera diferente

Uno de los principios más importantes del juego sería que el contexto externo sea común, pero sus consecuencias dependan de las características de cada emprendimiento.

### Ejemplo: aumento de inflación

```text
                   INFLACIÓN
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   EMPRESA A       EMPRESA B       EMPRESA C
   Importadora     Exportadora     Servicios
        │              │              │
        ↓              ↓              ↓
 Suben mucho      Puede obtener    Impacto
 sus costos       una oportunidad   moderado
```

Por lo tanto:

**Mismo acontecimiento ≠ misma consecuencia.**

Esto resulta especialmente importante para el modo aula.

---

# 9. Evolución de la trayectoria

La partida puede dividirse conceptualmente en distintas etapas.

```text
INICIO
  │
  ▼
FORMACIÓN Y
PRIMER NEGOCIO
  │
  ▼
SUPERVIVENCIA
Y VALIDACIÓN
  │
  ▼
CRECIMIENTO
  │
  ▼
ESCALAMIENTO
Y CRISIS
  │
  ▼
CONSOLIDACIÓN
  │
  ▼
DECISIONES
FINALES
  │
  ▼
RESULTADO DE
LA TRAYECTORIA
```

Las dificultades cambian con el crecimiento.

Al principio el problema puede ser:

> “¿Cómo consigo mi primer cliente?”

Más adelante:

> “¿Cómo consigo los recursos para cumplir con todos mis clientes?”

Y finalmente:

> “¿Debo vender la empresa, expandirme, incorporar inversores o mantener el control?”

El diseño informal ya propone una evolución desde supervivencia hacia crecimiento, problemas de escala y finalmente decisiones de consolidación o salida.

---

# 10. Personajes y relaciones

La empresa no evoluciona de manera aislada.

Durante la partida pueden aparecer personajes relevantes:

```text
                EMPRENDEDOR
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
     SOCIOS       EMPLEADOS      CLIENTES
       │                           │
       ├──────── INVERSORES ───────┤
       │                           │
       ↓                           ↓
   COMPETIDORES               CONTACTOS
```

Estos personajes pueden:

* ayudar;
* generar oportunidades;
* abandonar la empresa;
* exigir cambios;
* entrar en conflicto;
* reaparecer años después;
* recordar, mediante el desarrollo de la historia, decisiones anteriores.

Dentro de la idea inicial ya aparece, por ejemplo, la elección de distintos tipos de socio y la posibilidad de que esa elección genere situaciones posteriores.

El objetivo es que el jugador no solamente vea cambiar números, sino que construya **una trayectoria personal y empresarial**.

---

# 11. Modo individual

En el modo individual cada jugador desarrolla su propia trayectoria.

```text
JUGADOR
   ↓
CREA SU PERFIL
   ↓
DESARROLLA SU EMPRESA
   ↓
TOMA DECISIONES
   ↓
ENFRENTA CONSECUENCIAS
   ↓
LLEGA A UN RESULTADO
```

Cada partida puede diferenciarse por:

* decisiones;
* acontecimientos;
* carrera o rubro;
* socios;
* evolución de la empresa;
* situación económica;
* oportunidades;
* errores cometidos.

Esto permite que dos alumnos puedan comenzar de forma similar y terminar con historias completamente diferentes.

---

# 12. Modo Aula

Además del juego individual, se propone un modo en el cual todos los estudiantes participan simultáneamente dentro de una misma sesión.

El profesor actúa como **director del contexto**.

```text
                   PROFESOR
                      │
                      │
              Genera un evento
                      │
                      ▼
        ┌───────────────────────────┐
        │   CONTEXTO COMPARTIDO     │
        │                           │
        │ "Aumenta la inflación"    │
        │ "Cambian regulaciones"    │
        │ "Crisis de importaciones" │
        └─────────────┬─────────────┘
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   JUGADOR A       JUGADOR B       JUGADOR C
       │              │              │
       ↓              ↓              ↓
   Consecuencia    Consecuencia   Consecuencia
      según           según          según
   su situación    su situación   su situación
```

Cada alumno continúa administrando su propia empresa, pero todos comparten determinados acontecimientos del contexto.

Esto permite posteriormente discutir en clase:

* por qué una empresa resistió mejor una crisis;
* qué decisiones anteriores influyeron;
* qué riesgos asumió cada jugador;
* qué estrategias diferentes aparecieron;
* qué alternativas existían.

---

# 13. Rol del profesor

En el modo aula, el docente no sería solamente un espectador.

Podría actuar como quien modifica el contexto de negocios.

Conceptualmente:

```text
PROFESOR
   │
   ├── Inicia una partida
   │
   ├── Observa la evolución de los alumnos
   │
   ├── Introduce acontecimientos globales
   │
   ├── Analiza resultados
   │
   └── Utiliza las situaciones para generar discusión
```

Entre los acontecimientos que podría introducir podrían existir:

* inflación;
* devaluación;
* nueva regulación;
* crisis energética;
* escasez de determinado recurso;
* reducción del crédito;
* aparición de nueva tecnología;
* programas de incentivo;
* apertura de importaciones;
* crisis de demanda.

El objetivo no sería necesariamente “perjudicar” a los jugadores, sino **modificar el entorno y observar cómo distintas empresas responden ante la misma situación**.

---

# 14. Posibles resultados de una partida

No necesariamente debería existir solamente:

```text
GANASTE / PERDISTE
```

El resultado puede representar la trayectoria construida.

Por ejemplo:

```text
              FINAL DE PARTIDA
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
  Empresa        Empresa        Empresa
  vendida        consolidada     quebrada
       │             │             │
       └───────┬─────┴─────┬───────┘
               ↓           ↓
          Reputación    Bienestar
               ↓           ↓
            RESULTADO GLOBAL
             DE LA CARRERA
```

La idea inicial también contempla acontecimientos especiales de final de partida, como ofertas de adquisición o intentar mantener la independencia y continuar creciendo.

La definición exacta de qué significa “ganar” es uno de los puntos que debe **validarse**.

---

# 15. Ejemplo resumido de una trayectoria

Una partida podría verse así:

```text
18 AÑOS
│
├─ Decide estudiar Ingeniería Industrial
│
├─ Consigue un trabajo de medio tiempo
│
▼
21 AÑOS
│
├─ Inicia un pequeño emprendimiento logístico
│
├─ Aparece un posible socio
│
└─ Decide incorporarlo
│
▼
25 AÑOS
│
├─ Termina sus estudios
│
├─ Consigue su primer gran contrato
│
└─ Decide expandirse rápidamente
│
▼
30 AÑOS
│
├─ Crisis económica
│
├─ Tiene demasiados costos fijos
│
└─ Debe reducir operaciones
│
▼
34 AÑOS
│
├─ Aparece nuevamente un antiguo cliente
│
├─ Surge oportunidad de expansión
│
└─ Obtiene financiamiento
│
▼
40 AÑOS
│
├─ La empresa ya tiene gran tamaño
│
├─ Conflicto con su socio inicial
│
└─ Debe negociar el control de la compañía
│
▼
47 AÑOS
│
├─ Una corporación ofrece comprar la empresa
│
└─ Decide vender / continuar
│
▼
RESULTADO FINAL
```

Lo importante es que esta historia **no está escrita completamente de antemano**.

Las situaciones que aparecen dependen de la trayectoria construida.

---

# 16. Idea central a validar

En síntesis, el concepto propuesto es:

> **Un simulador narrativo de trayectoria emprendedora en el que cada alumno toma decisiones frente a problemas y oportunidades. Las decisiones modifican tanto la situación inmediata como las posibilidades futuras, generando diferentes historias empresariales.**

En el modo individual, el jugador enfrenta su propia trayectoria.

En el modo aula, todos desarrollan empresas diferentes dentro de un contexto compartido que el profesor puede modificar mediante acontecimientos globales.