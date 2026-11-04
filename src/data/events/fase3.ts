import { defineEvent, defineOption } from "./builders"

export const fase3Events = [
    defineEvent({
        id: 'f3_shock_externo',
        phaseId: 3,
        title: 'Cierre de Importaciones / Devaluación',
        weight: 20,
        description: 'El gobierno impone restricciones cambiarias y aduaneras severas. El mercado está en pánico.',
        options: [
            defineOption(
                'Ajustar precios inmediatamente trasladando el 100% de la inflación.',
                { capital: +10, reputacion: -30, bienestar: -5 },
                {
                    surprise: {
                        effects: { capital: -5, reputacion: -30, bienestar: -5 },
                        outcomeText: 'Trasladaste el aumento de inmediato, pero los clientes no lo convalidaron: muchos se pasaron a la competencia y lo que ganabas por precio lo perdiste en volumen. Encima el clima en el equipo se resintió.',
                    },
                    learningPill: 'Poder de Fijación de Precios (Pricing Power): Trasladar costos sin valor diferencial destruye la fidelidad del cliente.',
                    outcomeText: 'Trasladaste el aumento de inmediato. Salvaste la rentabilidad del mes, pero muchos clientes históricos se sintieron defraudados y migraron a alternativas.',
                }
            ),
            defineOption(
                'Absorber parte del costo para ganar clientes de la competencia.',
                { capital: -25, reputacion: +25, bienestar: -10 },
                {
                    surprise: {
                        effects: { capital: -25, reputacion: -5, bienestar: -10 },
                        outcomeText: 'Absorbiste el impacto y quemaste caja, pero la competencia también absorbió el costo y casi nadie notó tu esfuerzo. Algunos clientes hasta pensaron que estabas bajando la calidad.',
                    },
                    learningPill: 'Estrategia Competitiva en Crisis: Las empresas con caja pueden ganar cuota de mercado sacrificando margen temporal.',
                    outcomeText: 'Absorbiste el impacto reduciendo tu margen temporalmente. Quemaste reservas de caja, pero capturaste una marea de clientes desencantados con la competencia.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_ronda_inversion',
        phaseId: 3,
        title: 'Llega un Fondo de Inversión',
        weight: 10,
        milestone: true,
        description: '{nombre}, un fondo de inversión ofrece 200k USD, pero exige el 35% de la empresa y una silla con derecho a veto en el directorio.',
        options: [
            defineOption(
                'Aceptar la inversión para pisar el acelerador.',
                { capital: +35, reputacion: +15, bienestar: -15 },
                {
                    minigame: {
                        kind: 'timing',
                        tagsByPerformance: { perfect: { removeTags: ['equity_diluido'] } },
                        outcomeTextByPerformance: {
                            perfect: 'Tu pitch dejó al fondo convencido. Cerraste la ronda con mejores condiciones de las que esperabas y sin entregar una dilución dolorosa: capital fresco y los inversores a tu favor.',
                            poor: 'El pitch se te enredó y el fondo notó la duda. Cerraste igual, pero con peores condiciones: más dilución, menos margen de decisión y una relación que arranca desde atrás.',
                        },
                    },
                    addTags: ['inversion_externa', 'equity_diluido'],
                    learningPill: 'Venture Capital: Inyecta velocidad extrema a cambio de perder autonomía sobre el rumbo de tu propia empresa.',
                    outcomeText: 'Ingresó el fondo de VC con capital fresco. Podés acelerar fuerte, pero en cada reunión mensual sentís la presión implacable de los inversores sobre tus decisiones.',
                }
            ),
            defineOption(
                'Rechazar la oferta y continuar autofinanciados (Bootstrapping).',
                { reputacion: +5, bienestar: +10 },
                {
                    minigame: {
                        kind: 'timing',
                        title: 'Defender tu decisión',
                        outcomeTextByPerformance: {
                            perfect: 'Explicaste tu visión con tanta claridad que el fondo te respetó el no. Seguís autofinanciado y, encima, ganaste credibilidad en el ecosistema.',
                            poor: 'Tu explicación no convenció y el rechazo sonó a falta de ambición. Seguís autofinanciado, pero perdiste algo de credibilidad frente al mercado.',
                        },
                        rule: 'Frená la aguja dentro de la zona verde para explicarle al fondo por qué elegís crecer solo. Tres rondas, cada una más rápida.',
                    },
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Bootstrapping: Crecer con tus propios ingresos te da libertad absoluta, pero limita tu velocidad de expansión.',
                    outcomeText: 'Rechazaste ceder capital. Crecés a tu propio ritmo con lo que genera el negocio, conservando la independencia total para decidir el rumbo de tu vida y tu empresa.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_disputa_socios',
        phaseId: 3,
        title: 'Guerra en el Directorio',
        weight: 30,
        when: {
            tags: ['socio_conflictivo']
        },
        description: 'Tu co-fundador quiere cambiar el rumbo del negocio y amenaza con bloquear las decisiones o llevarse clientes. ¿Qué hacés, {nombre}?',
        options: [
            defineOption(
                'Comprar su parte pagando una prima alta para recuperar el control.',
                { capital: -30, reputacion: +10, bienestar: +15 },
                {
                    removeTags: ['socio_conflictivo', 'equity_diluido'],
                    learningPill: 'Disolución Societaria: Un conflicto entre fundadores sin resolver es la principal causa interna de muerte de startups.',
                    outcomeText: 'Compraste las acciones de tu socio saliente con una prima costosa. Quedaste corto de liquidez, pero recuperaste la paz mental y la alineación estratégica al 100%.',
                }
            ),
            defineOption(
                'Llevar el conflicto a la justicia y congelar sus atribuciones.',
                { capital: -15, reputacion: -25, bienestar: -30 },
                {
                    addTags: ['conflicto_legal'],
                    learningPill: 'Seguridad Jurídica: La litigiosidad interna destruye la reputación institucional y espanta clientes e inversores.',
                    outcomeText: 'Iniciaron una batalla judicial descarnada. Los abogados consumen tiempo y dinero, y el rumor del litigio interno frenó negociaciones con clientes corporativos clave.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_crisis_burnout',
        phaseId: 3,
        title: 'El Equipo al Límite',
        weight: 30,
        when: {
            tags: ['equipo_sobrecargado']
        },
        description: '{nombre}, renuncian dos personas clave de tu equipo en plena entrega importante. El resto amenaza con irse.',
        options: [
            defineOption(
                'Hacerte cargo personalmente de todo el trabajo operativo faltante.',
                { reputacion: +10, bienestar: -35 },
                {
                    minigame: {
                        kind: 'tapping',
                        title: 'Crunch nocturno',
                        rule: 'Salen problemas en la entrega y se van solos en poco tiempo: tocá (o hacé clic en) cada uno para resolverlo. Cuantos más elimines, mejor sale; cada vez aparecen más seguidos.',
                        outcomeTextByPerformance: {
                            perfect: 'Te pusiste la empresa al hombro y lo sacaste adelante: entregas impecables y un cliente que lo notó. Pero trabajaste de madrugada durante semanas y quedaste al borde del colapso físico y mental.',
                            poor: 'Quisiste cubrir todo y no llegaste: las entregas se cayeron y perdiste a un cliente. A cambio, te rendiste a tiempo, dormiste y tu salud quedó casi intacta.',
                        },
                        effectsByPerformance: {
                            perfect: { reputacion: +15, bienestar: -38 },
                            poor: { capital: -10, reputacion: -10, bienestar: -15 },
                        },
                    },
                    learningPill: 'Liderazgo y Burnout: El fundador que actúa como bombero permanente termina siendo el cuello de botella de la empresa.',
                    outcomeText: 'Te pusiste la empresa al hombro trabajando 16 horas diarias para tapar los huecos. Cumpliste con las entregas, pero quedaste al borde del colapso físico y mental.',
                }
            ),
            defineOption(
                'Asumir penalidades contractuales, frenar y dar un bono de retención.',
                { capital: -25, reputacion: -10, bienestar: +15 },
                {
                    minigame: {
                        kind: 'balance',
                        title: 'Negociar las penalidades',
                        outcomeTextByPerformance: {
                            perfect: 'Negociaste con firmeza y los clientes aceptaron penalidades mucho más bajas. Frenaste la máquina, diste bonos de respiro al equipo y el margen dolió menos de lo previsto.',
                            poor: 'La negociación se te fue de las manos: los clientes impusieron penalidades más duras. Salvaste a tu gente con el bono de retención, pero el trimestre quedó muy golpeado.',
                        },
                        rule: 'Mantené el cursor dentro del rango aceptable mientras los clientes empujan. Cuanto más tiempo mantengas apretado un botón (o A / D, o las flechas), más fuerte empujás. Cuanta más reputación tengas, más margen.',
                    },
                    removeTags: ['equipo_sobrecargado'],
                    learningPill: 'Retención de Talento: Cuesta hasta 3 veces más reemplazar a un colaborador clave que invertir en su bienestar.',
                    outcomeText: 'Pactaste penalidades con clientes, frenaste la máquina y diste bonos de respiro al equipo. El margen del trimestre dolió, pero salvaste la lealtad del núcleo de tu gente.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_apuesta_crecimiento',
        phaseId: 3,
        title: 'Apuesta de Crecimiento',
        weight: 10,
        description: 'Una agencia propone una campaña agresiva y cara con resultados inciertos. La alternativa es seguir creciendo lento, a puro boca en boca.',
        options: [
            defineOption(
                'Invertir fuerte en la campaña y apostar a un salto de escala.',
                { capital: -20, reputacion: +15 },
                {
                    surprise: {
                        effects: { capital: +10, reputacion: +15 },
                        outcomeText: 'Pusiste una suma importante en pauta y la campaña explotó: las ventas pagaron la inversión antes de fin de mes y además ganaste visibilidad de marca.',
                    },
                    addTags: ['generacion_ingresos'],
                    learningPill: 'CAC y Crecimiento: Pagar por crecer solo funciona si el cliente adquirido deja más de lo que costó conseguirlo.',
                    outcomeText: 'Pusiste una suma importante en pauta publicitaria. El tráfico explotó y conseguiste visibilidad de marca, aunque el costo de conversión resultó más alto de lo proyectado.',
                }
            ),
            defineOption(
                'Crecer orgánico con referidos, lento pero sin quemar caja.',
                { capital: +5, reputacion: +5, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: -5, reputacion: +5, bienestar: +5 },
                        outcomeText: 'Confiaste en el boca a boca, pero los referidos tardaron más de lo previsto y los gastos fijos siguieron corriendo. Los clientes que llegaron lo hicieron convencidos, aunque la caja se resintió.',
                    },
                    addTags: ['clientes_diversificados'],
                    learningPill: 'Crecimiento Orgánico: Los clientes que llegan por recomendación cuestan poco, pagan mejor y se quedan más tiempo.',
                    outcomeText: 'Confiaste en la calidad y en la recomendación boca a boca. El crecimiento es más lento, pero cada cliente nuevo llega convencido y con costo de adquisición prácticamente cero.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_caida_servicio',
        phaseId: 3,
        title: 'Caída del Servicio en Pleno Pico',
        weight: 12,
        when: { rubro: ['r1_tecnologia'] },
        description: 'En el mejor momento de demanda, la plataforma se cae. Los clientes están furiosos y cada hora cuenta.',
        options: [
            defineOption(
                'Frenar las ventas nuevas hasta estabilizar la plataforma.',
                { capital: -10, reputacion: +15 },
                {
                    surprise: {
                        effects: { capital: +5, reputacion: +15 },
                        outcomeText: 'Pausaste las altas para blindar la infraestructura. Los clientes esperaron sin cancelar y, al volver, compraron todo lo que tenían pendiente: la pausa terminó dejando caja.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Deuda Técnica: Frenar para estabilizar duele en el corto plazo, pero operar sobre un sistema roto duele siempre.',
                    outcomeText: 'Pausaste las altas para reescribir código y blindar la infraestructura. Dejaste de facturar unos días, pero la plataforma ahora resiste picos masivos sin pestañear.',
                }
            ),
            defineOption(
                'Aplicar un parche rápido y seguir vendiendo a toda máquina.',
                { capital: +15, reputacion: -25, bienestar: -15 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: -25, bienestar: -15 },
                        outcomeText: 'Pusiste un parche rápido y seguiste vendiendo, pero se cayó en el peor momento: hubo que devolver ventas y pagar soporte de urgencia. Perdiste caja, reputación y la paz del equipo.',
                    },
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: El parche rápido sostiene la facturación hoy y factura el cansancio del equipo mañana.',
                    outcomeText: 'Pusiste un parche rápido y seguiste vendiendo. Salvaguardaste la caja de la semana, pero el equipo vive con el temor constante de que el sistema explote en cualquier momento.',
                }
            )
        ]
    }),

    // Variantes de f3_caida_servicio para los rubros que no son Tecnología: mismas cifras y etiquetas, otro contexto.
    defineEvent({
        id: 'f3_caida_servicio_comercio',
        phaseId: 3,
        title: 'Falla de Stock en Pleno Pico',
        weight: 12,
        when: { rubro: ['r2_comercio'] },
        description: 'En el mejor momento de ventas, el sistema de cobros y stock falla. Hay colas en las cajas, los clientes están furiosos y cada hora cuenta.',
        options: [
            defineOption(
                'Frenar las ventas nuevas hasta ordenar el sistema de stock y cobros.',
                { capital: -10, reputacion: +15 },
                {
                    surprise: {
                        effects: { capital: +5, reputacion: +15 },
                        outcomeText: 'Pausaste las ventas para ordenar el stock y los cobros. Los clientes esperaron sin irse y, al reabrir, compraron todo lo que tenían pendiente: la pausa terminó dejando caja.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Deuda Operativa: Frenar para ordenar duele en el corto plazo, pero vender sobre un sistema desordenado duele siempre.',
                    outcomeText: 'Pausaste las ventas para ordenar el stock y rehacer el sistema de cobros. Dejaste de facturar unos días, pero ahora el negocio resiste los picos de venta sin pestañear.',
                }
            ),
            defineOption(
                'Aplicar un parche rápido y seguir vendiendo a toda máquina.',
                { capital: +15, reputacion: -25, bienestar: -15 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: -25, bienestar: -15 },
                        outcomeText: 'Pusiste un parche rápido y seguiste vendiendo, pero el sistema falló en el peor momento: hubo que devolver ventas y pagar ayuda de urgencia. Perdiste caja, reputación y la paz del equipo.',
                    },
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: El parche rápido sostiene la facturación hoy y factura el cansancio del equipo mañana.',
                    outcomeText: 'Pusiste un parche rápido y seguiste vendiendo. Salvaguardaste la caja de la semana, pero el equipo vive con el temor constante de que el sistema falle otra vez.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_caida_servicio_servicios',
        phaseId: 3,
        title: 'Agenda Desbordada en Pleno Pico',
        weight: 12,
        when: { rubro: ['r3_servicios'] },
        description: 'En el mejor momento de demanda, la agenda se desordena: turnos duplicados, entregas atrasadas y clientes furiosos. Cada hora cuenta.',
        options: [
            defineOption(
                'Frenar la toma de nuevos clientes hasta reordenar la operación.',
                { capital: -10, reputacion: +15 },
                {
                    surprise: {
                        effects: { capital: +5, reputacion: +15 },
                        outcomeText: 'Pausaste la toma de nuevos clientes para reordenar la operación. Los clientes esperaron sin irse y, al reanudar, contrataron todo lo que tenían pendiente: la pausa terminó dejando caja.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Deuda Operativa: Frenar para reordenar duele en el corto plazo, pero trabajar sobre una operación desordenada duele siempre.',
                    outcomeText: 'Pausaste la toma de nuevos clientes para reordenar la agenda y los procesos. Dejaste de facturar unos días, pero ahora la operación resiste los picos de demanda sin pestañear.',
                }
            ),
            defineOption(
                'Improvisar sobre la marcha y seguir tomando trabajo a toda máquina.',
                { capital: +15, reputacion: -25, bienestar: -15 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: -25, bienestar: -15 },
                        outcomeText: 'Improvisaste y seguiste tomando trabajo, pero la agenda se desbordó en el peor momento: hubo que devolver adelantos y compensar a los clientes. Perdiste caja, reputación y la paz del equipo.',
                    },
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: Improvisar sostiene la facturación hoy y factura el cansancio del equipo mañana.',
                    outcomeText: 'Improvisaste y seguiste tomando trabajo. Salvaguardaste la facturación de la semana, pero el equipo vive con el temor constante de que la agenda vuelva a desbordarse.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_caida_servicio_produccion',
        phaseId: 3,
        title: 'Línea Detenida en Pleno Pico',
        weight: 12,
        when: { rubro: ['r4_produccion'] },
        description: 'En el mejor momento de pedidos, una máquina clave se rompe y la línea se frena. Los clientes están furiosos y cada hora cuenta.',
        options: [
            defineOption(
                'Frenar los pedidos nuevos hasta reparar y revisar toda la línea.',
                { capital: -10, reputacion: +15 },
                {
                    surprise: {
                        effects: { capital: +5, reputacion: +15 },
                        outcomeText: 'Pausaste los pedidos para reparar y revisar toda la línea. Los clientes esperaron sin cancelar y, al retomar, compraron todo lo que tenían pendiente: la pausa terminó dejando caja.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Mantenimiento Preventivo: Frenar para reparar duele en el corto plazo, pero producir con una línea averiada duele siempre.',
                    outcomeText: 'Pausaste los pedidos para reparar y revisar toda la línea. Dejaste de despachar unos días, pero ahora la producción resiste los picos de demanda sin pestañear.',
                }
            ),
            defineOption(
                'Hacer una reparación provisoria y seguir produciendo a toda máquina.',
                { capital: +15, reputacion: -25, bienestar: -15 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: -25, bienestar: -15 },
                        outcomeText: 'Hiciste una reparación provisoria y seguiste produciendo, pero la máquina volvió a fallar en el peor momento: hubo que rehacer pedidos y pagar un técnico de urgencia. Perdiste caja, reputación y la paz del equipo.',
                    },
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: Una reparación provisoria sostiene la producción hoy y factura el cansancio del equipo mañana.',
                    outcomeText: 'Hiciste una reparación provisoria y seguiste produciendo. Salvaguardaste los despachos de la semana, pero el equipo vive con el temor constante de que la máquina falle otra vez.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_video_filtrado',
        phaseId: 3,
        title: 'El Video de la Cámara',
        weight: 20,
        when: {
            tags: ['secreto_ajeno'],
            playedBefore: ['f1_visita_empresa'],
        },
        description: 'Circula en grupos del rubro un video de una cámara de seguridad: se te ve revisando una computadora ajena en aquella visita. Los clientes empiezan a preguntar.',
        options: [
            defineOption(
                'Dar la cara: pedir disculpas en público y explicar qué pasó.',
                { capital: -10, bienestar: -5, reputacion: -15 },
                {
                    removeTags: ['secreto_ajeno'],
                    learningPill: 'Gestión de Reputación: Asumir un error en público no lo borra, pero corta la historia; negarlo la alarga.',
                    outcomeText: 'Pediste disculpas y explicaste. Perdiste algunos clientes, pero el tema dejó de circular en pocas semanas.',
                }
            ),
            defineOption(
                'Decir que el video está sacado de contexto y no hablar más.',
                { capital: -5, bienestar: -10, reputacion: -30 },
                {
                    learningPill: 'Efecto Streisand: Negar algo que todos pueden ver multiplica su alcance y le suma la mentira al error.',
                    outcomeText: 'Nadie creyó la explicación y el video se compartió todavía más. Varios clientes cortaron la relación.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_costos_se_comen_margen',
        phaseId: 3,
        title: 'Vendés Más, Ganás Menos',
        weight: 20,
        when: {
            tags: ['margen_ajustado'],
            playedBefore: ['f2_aumentar_precios'],
        },
        description: 'Pasó un año y los costos siguieron subiendo. Mantuviste los precios y hoy vendés más que nunca, pero casi no te queda ganancia por cada venta.',
        options: [
            defineOption(
                'Ajustar los precios ahora, aunque los clientes ya se acostumbraron al valor anterior.',
                { capital: +10, bienestar: -5, reputacion: -10 },
                {
                    removeTags: ['margen_ajustado'],
                    learningPill: 'Efecto Escalera: Posponer ajustes obliga a hacer uno más grande después, y es más difícil de justificar.',
                    outcomeText: 'El ajuste fue grande y varios clientes lo notaron. Tu margen se recompuso, pero te costó explicarlo.',
                }
            ),
            defineOption(
                'Recortar costos y gastos del equipo para sostener el precio.',
                { capital: +5, bienestar: -12 },
                {
                    removeTags: ['margen_ajustado'],
                    learningPill: 'Eficiencia vs. Desgaste: Recortar costos mejora el margen, pero exige más al equipo y a la calidad.',
                    outcomeText: 'Recortaste gastos en todo lo que se pudo. Tu margen mejoró, pero el equipo trabaja con menos recursos.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_amigo_rinde_poco',
        phaseId: 3,
        title: 'El Amigo que Llega Tarde',
        weight: 20,
        when: {
            tags: ['contratacion_por_afecto'],
            playedBefore: ['f2_contratar_amigo'],
        },
        description: 'Tu amigo, que entró sin ningún proceso, llega tarde y no cumple sus tareas. El resto del equipo empieza a notarlo y a preguntarse por qué recibe un trato distinto.',
        options: [
            defineOption(
                'Tener una charla franca y ponerle metas claras por escrito.',
                { bienestar: -8, reputacion: +3 },
                {
                    removeTags: ['contratacion_por_afecto'],
                    learningPill: 'Feedback Claro: Hablar a tiempo y con metas concretas es la mejor forma de salvar un vínculo y un puesto.',
                    outcomeText: 'La charla fue difícil, pero tu amigo entendió. Hoy sabe qué se espera de él y el equipo ve que hay reglas para todos.',
                }
            ),
            defineOption(
                'Dejarlo pasar para no arruinar la amistad.',
                { capital: -8, bienestar: -12, reputacion: -8 },
                {
                    learningPill: 'Costo de Evitar: Postergar una charla difícil la hace más grande y le resta credibilidad al resto del equipo.',
                    outcomeText: 'Evitaste la charla. El problema siguió creciendo y varios del equipo ya piensan que hay reglas distintas según quién seas.',
                }
            ),
            defineOption(
                'Despedirlo.',
                { capital: -5, bienestar: -8, reputacion: -3 },
                {
                    removeTags: ['contratacion_por_afecto'],
                    learningPill: 'Despedir a un Amigo: Es de las decisiones más difíciles de liderar; hacerlo con respeto cuida lo que se pueda cuidar.',
                    outcomeText: 'Lo despediste con respeto y una indemnización justa. La amistad quedó herida, pero el equipo volvió a ordenarse.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_cuota_prestamo',
        phaseId: 3,
        title: 'Los Intereses se Acumulan',
        weight: 20,
        when: {
            tags: ['deuda_riesgosa'],
            playedBefore: ['f2_necesidad_capital'],
        },
        description: 'Los intereses de lo que tomaste prestado siguen creciendo y este año las cuotas se llevan una parte importante de lo que ganás.',
        options: [
            defineOption(
                'Refinanciar la deuda a un plazo más largo.',
                { capital: +5, bienestar: -3, reputacion: -3 },
                {
                    learningPill: 'Refinanciar: Alargar el plazo alivia la cuota de hoy, pero aumenta el costo total de la deuda.',
                    outcomeText: 'Tu cuota mensual bajó y la caja respira. A cambio, vas a pagar intereses por mucho más tiempo.',
                }
            ),
            defineOption(
                'Cancelar la deuda de golpe con tus reservas.',
                { capital: -25, bienestar: +8, reputacion: +3 },
                {
                    removeTags: ['deuda_riesgosa'],
                    learningPill: 'Desendeudarse: Pagar de una sola vez duele en la caja, pero corta el costo de los intereses y te devuelve tranquilidad.',
                    outcomeText: 'Usaste gran parte de tus reservas, pero ya no debés nada. Dormís mucho mejor.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_cliente_corporativo_renegocia',
        phaseId: 3,
        title: 'El Cliente Grande Aprieta',
        weight: 20,
        when: {
            tags: ['cliente_dependencia'],
            rubro: ['r1_tecnologia'],
            playedBefore: ['f2_cliente_corporativo_pide'],
        },
        description: 'Tu cliente grande renueva el contrato, pero amenaza con irse si no le bajás el precio y le sumás más funciones. Representa casi la mitad de tus ingresos.',
        options: [
            defineOption(
                'Aceptar sus condiciones para no perderlo.',
                { capital: -10, bienestar: -10 },
                {
                    learningPill: 'Poder de Negociación: Un cliente que concentra tus ingresos puede dictar las condiciones.',
                    outcomeText: 'Aceptaste las condiciones. Seguís teniéndolo como cliente, pero tu equipo trabaja más por menos plata.',
                }
            ),
            defineOption(
                'Plantarte: ofrecerle solo el producto estándar a precio de lista.',
                { capital: -15, bienestar: +3, reputacion: +3 },
                {
                    surprise: {
                        effects: { capital: +5, bienestar: +3, reputacion: +3 },
                        outcomeText: 'Te plantaste con el producto estándar y el cliente aceptó, porque le costaba más cambiar de proveedor que pagar tu precio. Recuperaste el control de tu producto sin perder ingresos.',
                    },
                    removeTags: ['cliente_dependencia'],
                    learningPill: 'Independencia: Perder a un cliente que te condiciona duele hoy y te devuelve el control de tu producto.',
                    outcomeText: 'El cliente se fue y perdiste una parte enorme de tus ingresos. Tu equipo volvió a trabajar en el producto.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_filtracion_datos',
        phaseId: 3,
        title: 'Los Datos Expuestos',
        weight: 20,
        when: {
            tags: ['falla_oculta'],
            rubro: ['r1_tecnologia'],
            playedBefore: ['f2_falla_seguridad'],
        },
        description: 'Un medio especializado publica que los datos de tus usuarios quedaron expuestos por una falla que ya conocías. Los clientes piden explicaciones.',
        options: [
            defineOption(
                'Admitir que la conocías y pedir disculpas públicas.',
                { capital: -15, bienestar: -10, reputacion: -15 },
                {
                    removeTags: ['falla_oculta'],
                    learningPill: 'Gestión de Incidentes: Reconocer el error de frente no lo borra, pero limita el daño y muestra responsabilidad.',
                    outcomeText: 'Reconociste que la falla ya la conocías y explicaste qué ibas a cambiar. Perdiste usuarios, pero la crisis se calmó en pocas semanas.',
                }
            ),
            defineOption(
                'Decir que fue un ataque inesperado.',
                { capital: -8, bienestar: -8, reputacion: -35 },
                {
                    removeTags: ['falla_oculta'],
                    learningPill: 'Ocultamiento: Cuando se descubre que sabías, el encubrimiento cuesta mucho más que el error original.',
                    outcomeText: 'Dijiste que nadie podía haberlo previsto. Pero alguien filtró que la falla ya estaba reportada y perdiste también la confianza que te quedaba.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_falla_de_la_maquina',
        phaseId: 3,
        title: 'Se Rompió la Máquina',
        weight: 20,
        when: {
            tags: ['maquina_propia'],
            rubro: ['r4_produccion'],
            playedBefore: ['f2_comprar_maquina'],
        },
        description: 'En plena temporada alta, tu máquina se frena por una falla y el repuesto tarda semanas en llegar. Tenés pedidos para entregar.',
        options: [
            defineOption(
                'Pagar la reparación urgente con un técnico especializado.',
                { capital: -12, bienestar: -3, reputacion: +3 },
                {
                    learningPill: 'Mantenimiento: Los costos de un equipo propio no terminan en la compra; una falla en el peor momento sale más cara que el mantenimiento preventivo.',
                    outcomeText: 'Pagaste un técnico y la máquina volvió rápido. Cumpliste con casi todos los pedidos, a un costo alto.',
                }
            ),
            defineOption(
                'Tercerizar la producción mientras llega el repuesto.',
                { capital: -8, bienestar: -8 },
                {
                    learningPill: 'Plan B Operativo: Tener una planta alternativa a quien llamar convierte una parada total en un costo acotado.',
                    outcomeText: 'Mandaste la producción a otra planta. Tu margen se achicó, pero entregaste todos los pedidos.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_cadena_baja_precio',
        phaseId: 3,
        title: 'La Cadena Pide una Rebaja',
        weight: 20,
        when: {
            tags: ['cliente_dependencia'],
            rubro: ['r4_produccion'],
            playedBefore: ['f2_marca_blanca'],
        },
        description: 'La cadena que te compra casi toda tu producción te avisa que, para renovar, necesita un precio 15% menor. Tenés muy poco margen para aceptarlo.',
        options: [
            defineOption(
                'Aceptar el nuevo precio y producir de forma más eficiente.',
                { capital: -10, bienestar: -12 },
                {
                    learningPill: 'Poder de Compra: Quien concentra tus ventas puede exigirte rebajas que erosionan tu margen.',
                    outcomeText: 'Aceptaste el nuevo precio y recortaste en todo lo que pudiste. Seguís produciendo para la cadena, con mucho menos ganancia.',
                }
            ),
            defineOption(
                'Rechazar y buscar otros compradores con la capacidad que se libera.',
                { capital: -18, bienestar: -5, reputacion: +5 },
                {
                    removeTags: ['cliente_dependencia'],
                    learningPill: 'Diversificar: Perder a tu mayor comprador asusta, pero depender de él te deja sin poder de negociación.',
                    outcomeText: 'Perdiste el contrato más grande y tenés capacidad parada, pero empezaste a vender a otros compradores a mejor precio.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_empleado_clave_se_va',
        phaseId: 3,
        title: 'Te Quieren Quitar a tu Mejor Persona',
        weight: 10,
        description: 'Tu empleado más importante, quien conoce clientes y procesos de memoria, recibió una oferta de una empresa grande con un sueldo bastante mayor. Te avisa antes de aceptarla.',
        options: [
            defineOption(
                'Igualar la oferta con un aumento fuerte, solo para esa persona.',
                { capital: -12, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: -12, bienestar: -10, reputacion: -3 },
                        outcomeText: 'Igualaste la oferta, pero a los pocos meses esa persona se fue igual a la otra empresa. Quedaste con un salario más alto, sin su conocimiento y con un equipo que se enteró de todo.',
                    },
                    addTags: ['desigualdad_salarial'],
                    scheduledEvent: { eventId: 'f4_reclamo_aumentos', delayTurns: 3 },
                    learningPill: 'Contraoferta: Retener a alguien con plata, sin cambiar lo que lo hizo buscar otra cosa, suele postergar la salida y no evitarla.',
                    outcomeText: 'Aceptó quedarse y el equipo respiró aliviado. Pero el aumento no pasó desapercibido para los demás.',
                }
            ),
            defineOption(
                'Dejarla ir y pedirle unas semanas de transición para documentar todo.',
                { capital: -8, bienestar: -8 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Gestión del Conocimiento: Documentar lo que sabe una sola persona te protege de depender de ella.',
                    outcomeText: 'Aceptaste su decisión. Dejó todo escrito y capacitó a su reemplazo, aunque fue un período duro.',
                }
            ),
            defineOption(
                'Ofrecerle un rol nuevo con más responsabilidad y una parte de las ganancias.',
                { capital: -6, bienestar: -3, reputacion: +5 },
                {
                    learningPill: 'Retención: Un rol con crecimiento y participación retiene más que el sueldo, porque responde al motivo por el que se quería ir.',
                    outcomeText: 'Le armaste un rol a su medida y le diste participación. Se quedó, con más compromiso que antes.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_expansion_otra_ciudad',
        phaseId: 3,
        title: 'Abrir en Otra Ciudad',
        weight: 10,
        description: 'Tu negocio funciona muy bien en tu ciudad y recibís pedidos de clientes de otra. Podés abrir ya o crecer de a poco, pero estirarse demasiado rápido es una forma común de fracasar.',
        options: [
            defineOption(
                'Abrir una sede propia en la otra ciudad ahora.',
                { capital: -25, bienestar: -12, reputacion: +10 },
                {
                    surprise: {
                        effects: { capital: +10, bienestar: -12, reputacion: +10 },
                        outcomeText: 'La nueva sede arrancó mejor de lo esperado: los clientes que ya te pedían se sumaron el primer día y cubrió sus costos enseguida. A cambio, los viajes y la coordinación te dejaron agotado.',
                    },
                    addTags: ['operacion_dispersa'],
                    scheduledEvent: { eventId: 'f4_calidad_dispareja', delayTurns: 3 },
                    learningPill: 'Expansión Rápida: Abrir una sede nueva multiplica los costos antes de multiplicar los ingresos, y es difícil cuidar la calidad a distancia.',
                    outcomeText: 'Abriste la nueva sede en tiempo récord. Tenés más alcance, pero estás casi siempre viajando y apagando incendios.',
                }
            ),
            defineOption(
                'Asociarte con un socio local que opere en tu nombre.',
                { capital: -8, bienestar: -3 },
                {
                    learningPill: 'Alianzas Locales: Un socio local reduce el riesgo y la inversión, a cambio de ceder control y parte de la ganancia.',
                    outcomeText: 'Un socio local arrancó con tu marca y sus métodos. Invertiste poco, pero ya no controlás cada detalle.',
                }
            ),
            defineOption(
                'Atender esa demanda de forma remota o por pedido, sin abrir nada.',
                { capital: +3, bienestar: -5, reputacion: -3 },
                {
                    learningPill: 'Crecimiento Gradual: Probar la demanda con poca inversión permite expandirse sabiendo que hay clientes.',
                    outcomeText: 'Atendiste a los clientes de la otra ciudad a distancia. Es menos cómodo para ellos, pero ya sabés cuántos son de verdad.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_copia_de_idea',
        phaseId: 3,
        title: 'Alguien Copió tu Idea',
        weight: 10,
        description: 'Un competidor lanzó algo casi idéntico a lo tuyo, con tu mismo estilo y hasta frases de tu sitio. Todavía no registraste tu marca.',
        options: [
            defineOption(
                'Mandarle una carta documento y reclamar por la vía legal.',
                { capital: -15, bienestar: -8, reputacion: +3 },
                {
                    surprise: {
                        effects: { capital: +5, bienestar: -8, reputacion: +3 },
                        outcomeText: 'La carta funcionó: el competidor retiró todo antes de que llegara a juicio y hasta te pagó una compensación para evitar el reclamo.',
                    },
                    learningPill: 'Propiedad Intelectual: Sin registro de tu marca, reclamar es más lento y difícil; la vía legal sirve, pero cuesta tiempo y plata.',
                    outcomeText: 'Contrataste a un abogado y enviaste el reclamo. El competidor se puso a la defensiva y el trámite se alarga.',
                }
            ),
            defineOption(
                'Registrar tu marca ya y avanzar más rápido que el competidor.',
                { capital: -6, bienestar: -6, reputacion: +8 },
                {
                    learningPill: 'Registro de Marca: Registrar tu marca es barato comparado con perderla y te da una base legal para defenderte.',
                    outcomeText: 'Registraste la marca y aceleraste tus lanzamientos. Ahora tenés los papeles y un paso de ventaja.',
                }
            ),
            defineOption(
                'Ignorarlo: que copien es una forma de admiración.',
                { bienestar: +3, reputacion: -10 },
                {
                    learningPill: 'Costo de la Inacción: Dejar pasar una copia sin responder puede diluir tu diferencial frente a los clientes.',
                    outcomeText: 'No hiciste nada. Con el tiempo, algunos clientes ya no sabían cuál de los dos era el original.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_cambio_regulacion',
        phaseId: 3,
        title: 'Cambian las Reglas del Sector',
        weight: 10,
        description: 'Una nueva norma exige cambios en cómo operás: certificados, informes y controles que hoy no hacés. Las empresas que no se adapten podrían ser sancionadas.',
        options: [
            defineOption(
                'Adaptarte de inmediato aunque implique una inversión grande.',
                { capital: -18, bienestar: -8, reputacion: +10 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Compliance: Anticiparse a una norma cuesta, pero convierte una obligación en ventaja frente a quienes llegan tarde.',
                    outcomeText: 'Te adaptaste antes que casi todos. Fue una inversión fuerte, pero ahora eso es parte de tu propuesta de valor.',
                }
            ),
            defineOption(
                'Sumarte a la cámara del sector para negociar plazos y compartir costos.',
                { capital: -6, bienestar: -3, reputacion: +3 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Acción Colectiva: Las cámaras sectoriales ofrecen información y fuerza de negociación que una empresa chica no tiene sola.',
                    outcomeText: 'La cámara consiguió más plazo y capacitaciones compartidas. Conociste a otros empresarios que enfrentan lo mismo.',
                }
            ),
            defineOption(
                'Esperar a ver cómo la hacen cumplir antes de invertir.',
                { capital: +5, bienestar: +3, reputacion: -8 },
                {
                    learningPill: 'Riesgo Regulatorio: Esperar a que fiscalicen ahorra hoy, pero deja la empresa expuesta a multas o clausuras.',
                    outcomeText: 'Seguiste igual y ahorraste la inversión. Pero los clientes que sí exigen la norma ya están preguntando por tu certificado.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_automatizar_soporte',
        phaseId: 3,
        title: 'Automatizar la Atención',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Tu volumen de consultas creció y atenderlas cuesta cada vez más. Una solución de inteligencia artificial podría responder casi todo sin sumar personas.',
        options: [
            defineOption(
                'Automatizar toda la atención con IA y reducir el equipo de soporte.',
                { capital: +15, bienestar: -5, reputacion: -8 },
                {
                    surprise: {
                        effects: { capital: +15, bienestar: +3, reputacion: +5 },
                        outcomeText: 'La automatización funcionó mejor de lo esperado: resolvió casi todo en el primer intento y los clientes lo agradecieron. Bajaste costos sin perder calidad.',
                    },
                    addTags: ['soporte_automatizado'],
                    scheduledEvent: { eventId: 'f4_clientes_extranan_humanos', delayTurns: 3 },
                    learningPill: 'Automatización: La IA baja costos y responde al instante, pero sin un camino hacia una persona, los casos difíciles dejan clientes enojados.',
                    outcomeText: 'Implementaste el sistema y reduciste el equipo de soporte. Los costos bajaron mucho y las respuestas son instantáneas, aunque algunos reclamos quedan sin resolver.',
                }
            ),
            defineOption(
                'Usarla para lo simple y dejar a las personas con los casos difíciles.',
                { capital: +6, bienestar: +3, reputacion: +5 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Humano + Máquina: Automatizar lo repetitivo y dejar lo complejo a personas mejora el servicio y también el trabajo del equipo.',
                    outcomeText: 'La IA resuelve lo repetitivo y el equipo se enfoca en los casos que importan. El servicio mejoró y la gente trabaja con menos estrés.',
                }
            ),
            defineOption(
                'No automatizar: tu servicio humano es parte de tu marca.',
                { capital: -8, bienestar: -8, reputacion: +6 },
                {
                    learningPill: 'Diferenciación: Un servicio humano puede ser una ventaja, siempre que los clientes estén dispuestos a pagarlo.',
                    outcomeText: 'Seguiste con atención 100% humana. Los clientes lo valoran, pero el equipo trabaja al límite y los costos suben.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_plan_gratis',
        phaseId: 3,
        title: 'El Plan Gratis no Convierte',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Tenés muchos usuarios del plan gratuito, pero casi ninguno paga. Mantenerlos cuesta infraestructura y soporte.',
        options: [
            defineOption(
                'Eliminar el plan gratis y obligar a elegir uno pago.',
                { capital: +15, bienestar: -5, reputacion: -15 },
                {
                    surprise: {
                        effects: { capital: -5, bienestar: -5, reputacion: -15 },
                        outcomeText: 'Eliminaste el plan gratis y casi nadie pasó al plan pago: la mayoría se fue a la competencia. Perdiste usuarios y también quien podía recomendarte.',
                    },
                    learningPill: 'Modelo Freemium: Un plan gratis solo funciona si una parte importante termina pagando; cortarlo de golpe pone a prueba el valor real de tu producto.',
                    outcomeText: 'Eliminaste el plan gratis. Algunos pasaron al plan pago y la caja lo notó, pero otros se fueron con comentarios de enojo.',
                }
            ),
            defineOption(
                'Limitar el plan gratis y mostrar mejor las ventajas del plan pago.',
                { capital: +8, bienestar: -3, reputacion: -3 },
                {
                    learningPill: 'Conversión: Limitar lo gratuito y mostrar el valor del plan pago convierte sin expulsar a los usuarios.',
                    outcomeText: 'Pusiste límites razonables y mejoraste cómo se ve el plan pago. La conversión subió de a poco y sin escándalo.',
                }
            ),
            defineOption(
                'Mantenerlo: son tu mejor canal de recomendación.',
                { capital: -10, reputacion: +10 },
                {
                    learningPill: 'Costo de Adquisición: Los usuarios gratis cuestan, pero si te recomiendan, pueden ser tu canal de ventas más barato.',
                    outcomeText: 'Mantuviste el plan gratis. Los costos pesan, pero los usuarios gratuitos traen a otros usuarios que sí pagan.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_faltante_mercaderia',
        phaseId: 3,
        title: 'Faltante de Mercadería',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Los números no cierran: cada mes faltan productos que no figuran como vendidos. Sospechás de alguien del equipo, pero no tenés pruebas.',
        options: [
            defineOption(
                'Instalar cámaras y un control de inventario semanal.',
                { capital: -10, bienestar: -3 },
                {
                    surprise: {
                        effects: { capital: +5, bienestar: +3 },
                        outcomeText: 'El control mostró que el faltante no era un robo: había un error de carga en el sistema y productos mal etiquetados. Corregiste el problema sin acusar a nadie y recuperaste parte de lo perdido.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Control de Inventario: Medir el faltante es el primer paso; las pérdidas por robo, errores y desperdicio suelen ser mayores de lo que se cree.',
                    outcomeText: 'Instalaste cámaras y empezaste a contar semanalmente. Ahora sabés exactamente cuánto falta y de dónde.',
                }
            ),
            defineOption(
                'Confrontar a la persona que sospechás.',
                { capital: +3, bienestar: -12, reputacion: -8 },
                {
                    surprise: {
                        effects: { capital: +6, bienestar: +5, reputacion: +5 },
                        outcomeText: 'La persona lo admitió enseguida, devolvió parte de lo que faltaba y el resto del equipo valoró que lo resolvieras de frente y sin escándalo.',
                    },
                    learningPill: 'Presunción de Inocencia: Acusar sin pruebas suele dañar el clima y la confianza del equipo, aunque tengas razón.',
                    outcomeText: 'Confrontaste sin pruebas. La persona negó todo, se ofendió y varios del equipo se pusieron de su lado.',
                }
            ),
            defineOption(
                'Asumirlo como un costo más del negocio.',
                { capital: -8, bienestar: +3 },
                {
                    surprise: {
                        effects: { capital: -18, bienestar: -8, reputacion: -6 },
                        outcomeText: 'Al no controlar nada, las faltas crecieron mes a mes: lo que parecía un costo chico se volvió un agujero y el equipo notó que a nadie le importaba.',
                    },
                    learningPill: 'Pérdidas Aceptadas: Ignorar un faltante lo normaliza, y el costo crece sin que lo veas.',
                    outcomeText: 'Decidiste no investigar y seguir. Evitaste el conflicto, pero el faltante sigue en tus números.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_cadena_en_el_barrio',
        phaseId: 3,
        title: 'Llega una Cadena a tu Barrio',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Una cadena grande abrió a dos cuadras de tu local, con precios que vos no podés igualar. Tus clientes más sensibles al precio ya se están yendo.',
        options: [
            defineOption(
                'Bajar tus precios para competir de frente.',
                { capital: -15, bienestar: -8, reputacion: -3 },
                {
                    minigame: {
                        kind: 'balance',
                        difficulty: 3,
                        title: 'Guerra de precios',
                        rule: 'Sostené tus precios mientras la cadena presiona: mantené el cursor dentro de la franja para no ceder margen de más.',
                        outcomeTextByPerformance: {
                            perfect: 'Lograste bajar sin regalar margen: la mayoría de los clientes se quedó y el costo fue menor del esperado.',
                            poor: 'La rebaja fue demasiado y la cadena igual te ganó en precio: perdiste margen y clientes.',
                        },
                    },
                    learningPill: 'Guerra de Precios: Competir en precio contra quien compra por volumen es difícil de ganar.',
                    outcomeText: 'Bajaste tus precios. Retuviste a parte de tus clientes, pero tu margen quedó muy finito.',
                }
            ),
            defineOption(
                'Apostar a lo que ellos no tienen: atención personal y productos de nicho.',
                { capital: -8, bienestar: -5, reputacion: +10 },
                {
                    minigame: {
                        kind: 'balance',
                        difficulty: 2,
                        title: 'Cliente fiel',
                        rule: 'Mantené el cursor en la franja: cuanto más tiempo lo sostenés, más clientes ven la diferencia con la cadena.',
                        outcomeTextByPerformance: {
                            perfect: 'Tu atención y tu nicho marcaron la diferencia: los clientes fieles se quedaron y trajeron a otros.',
                            poor: 'No lograste que los clientes valoraran la diferencia y muchos se fueron igual.',
                        },
                    },
                    learningPill: 'Nicho y Servicio: Cuando no podés ganar por precio, ganás por conocer a tu cliente y ofrecer lo que una cadena no puede.',
                    outcomeText: 'Reordenaste tu local con productos que la cadena no tiene y empezaste a llamar a tus clientes por su nombre. Los más fieles se quedaron.',
                }
            ),
            defineOption(
                'Sumar entregas a domicilio y venta por mensajería para tus clientes fieles.',
                { capital: -5, bienestar: -8, reputacion: +6 },
                {
                    minigame: {
                        kind: 'balance',
                        difficulty: 2,
                        title: 'Pedidos a domicilio',
                        rule: 'Mantené el cursor en la franja mientras se acumulan pedidos: cuanto más estable, mejor sale la logística.',
                        outcomeTextByPerformance: {
                            perfect: 'Los pedidos salieron a horario y los clientes quedaron encantados con el servicio.',
                            poor: 'Hubo demoras y errores en las entregas y algunos clientes se fueron con la cadena.',
                        },
                    },
                    learningPill: 'Conveniencia: Una entrega a domicilio y un trato directo ofrecen algo que una cadena grande hace peor.',
                    outcomeText: 'Armaste un sistema de pedidos por mensajería y entrega en el barrio. Es más trabajo, pero tus clientes lo adoran.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_servicio_estandarizado',
        phaseId: 3,
        title: 'Vender Paquetes en Vez de Horas',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Cada proyecto lo armás a medida y eso te consume muchas horas. Podrías ofrecer paquetes cerrados, más simples y repetibles.',
        options: [
            defineOption(
                'Armar tres paquetes estandarizados y dejar de hacer propuestas a medida.',
                { capital: +10, bienestar: +6, reputacion: -5 },
                {
                    surprise: {
                        effects: { capital: -5, bienestar: +6, reputacion: -5 },
                        outcomeText: 'Estandarizaste, pero muchos de tus mejores clientes querían algo a medida y se fueron. Trabajás con menos estrés, pero con ingresos más bajos.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Servicio Productizado: Estandarizar baja el tiempo por proyecto y facilita crecer, pero algunos clientes querrán algo a medida.',
                    outcomeText: 'Armaste tres paquetes claros. Vendés más rápido y trabajás con menos estrés, aunque perdiste a algún cliente que quería algo diferente.',
                }
            ),
            defineOption(
                'Mantener lo a medida y subir el precio por la personalización.',
                { capital: +8, bienestar: -8, reputacion: +5 },
                {
                    surprise: {
                        effects: { capital: -6, bienestar: -12, reputacion: -4 },
                        outcomeText: 'Los clientes aceptaron el aumento, pero tres proyectos a medida se atrasaron a la vez y tuviste que devolver parte de lo cobrado.',
                    },
                    learningPill: 'Posicionamiento Premium: Cobrar más por lo único te mantiene artesanal: más margen, pero tu tiempo sigue siendo el límite.',
                    outcomeText: 'Subiste los precios de lo personalizado. Algunos clientes se fueron y quienes se quedaron valoran tu trabajo, aunque seguís trabajando muchas horas.',
                }
            ),
            defineOption(
                'Ofrecer ambos: paquetes para lo común y proyectos a medida para clientes grandes.',
                { capital: +6, bienestar: -2, reputacion: +3 },
                {
                    surprise: {
                        effects: { capital: +10, bienestar: +6, reputacion: +8 },
                        outcomeText: 'Los paquetes se vendieron solos y financiaron los proyectos a medida: la mezcla te dio caja y tiempo, y tus clientes lo notaron.',
                    },
                    learningPill: 'Segmentación: Combinar lo estandarizado con lo a medida te permite atender a dos tipos de clientes con una misma estructura.',
                    outcomeText: 'Los paquetes cubren a la mayoría y los proyectos grandes van a medida. La estructura es más compleja, pero cubrís más mercado.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_licitacion_publica',
        phaseId: 3,
        title: 'Una Licitación Pública',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Un organismo del Estado abrió una licitación por un contrato enorme comparado con lo que facturás. Preparar la oferta lleva semanas y exige papeles que nunca tuviste que armar.',
        options: [
            defineOption(
                'Presentarte solo y apostar a ganar.',
                { capital: +15, bienestar: -10, reputacion: +5 },
                {
                    addTags: ['contrato_estatal'],
                    scheduledEvent: { eventId: 'f4_cobro_estatal', delayTurns: 3 },
                    learningPill: 'Contratos Públicos: Un contrato con el Estado da volumen y estabilidad, pero exige papeles y suele pagar tarde.',
                    outcomeText: 'Armaste la oferta durante semanas y ganaste la licitación. Tenés el mayor contrato de tu historia.',
                }
            ),
            defineOption(
                'Presentarte junto a otra consultora para compartir la carga.',
                { capital: +8, bienestar: -5, reputacion: +5 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Alianza Estratégica: Unir fuerzas permite acceder a contratos más grandes, a cambio de repartir la ganancia.',
                    outcomeText: 'Se presentaron en conjunto y ganaron. La carga de trabajo y la ganancia se repartieron con tu aliada.',
                }
            ),
            defineOption(
                'No presentarte: es demasiado riesgo para tu tamaño.',
                { bienestar: +5, reputacion: -3 },
                {
                    learningPill: 'Foco: Decir que no a una oportunidad grande evita el riesgo de estirarte más de lo que podés sostener.',
                    outcomeText: 'Descartaste la licitación y seguiste con tus clientes. Dormís tranquilo, aunque te quedó la duda de lo que pudo ser.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_certificacion_calidad',
        phaseId: 3,
        title: 'La Certificación que Piden los Grandes',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Una cadena importante quiere comprarte, pero exige una certificación de buenas prácticas de producción que hoy no tenés. Tramitarla lleva tiempo y dinero.',
        options: [
            defineOption(
                'Certificar toda la planta.',
                { capital: -18, bienestar: -8, reputacion: +12 },
                {
                    surprise: {
                        effects: { capital: -25, bienestar: -12, reputacion: -5 },
                        outcomeText: 'La auditoría encontró muchas más fallas de las que esperabas. Hubo que rehacer parte de la planta y la certificación se demoró. Gastaste mucho más y las ventas se postergaron.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Certificaciones: Una certificación abre mercados grandes, pero exige cumplir y documentar todo, todos los días.',
                    outcomeText: 'Certificaste toda la planta. Fue un esfuerzo grande, pero ahora podés venderle a los grandes y tu proceso quedó ordenado.',
                }
            ),
            defineOption(
                'Certificar solo la línea que le vendés a esa cadena.',
                { capital: -8, bienestar: -5, reputacion: +5 },
                {
                    surprise: {
                        effects: { capital: +8, bienestar: +4, reputacion: +8 },
                        outcomeText: 'La cadena duplicó el pedido apenas se certificó esa línea y el volumen pagó el trámite en pocos meses.',
                    },
                    learningPill: 'Inversión Focalizada: Certificar solo lo que necesitás reduce el costo y abre el cliente que te interesa.',
                    outcomeText: 'Certificaste la línea que pide la cadena. Costó bastante menos y ya podés venderle.',
                }
            ),
            defineOption(
                'Postergar el trámite y seguir vendiéndole a tus clientes actuales.',
                { capital: +3, bienestar: +3, reputacion: -6 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: -8, reputacion: -14 },
                        outcomeText: 'La cadena no esperó: cerró con otro proveedor ya certificado y, además, tus clientes actuales empezaron a pedir lo mismo.',
                    },
                    learningPill: 'Costo de Oportunidad: Dejar para después una certificación te deja sin acceso a los clientes que la exigen.',
                    outcomeText: 'Pospusiste el trámite. Ahorraste plata hoy, pero la cadena le compró a otro productor.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_lote_defectuoso',
        phaseId: 3,
        title: 'Un Lote Sale Defectuoso',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Controlando un lote que ya salió a la venta, encontrás un defecto que puede afectar a quienes lo usen. Una parte ya llegó a los clientes.',
        options: [
            defineOption(
                'Retirar el lote del mercado y avisar a todos los clientes.',
                { capital: -20, bienestar: -8, reputacion: +10 },
                {
                    minigame: {
                        kind: 'tapping',
                        difficulty: 1,
                        title: 'Inspección del lote',
                        rule: 'Revisá cada unidad del lote y descartá las defectuosas antes de que se esparzan.',
                        outcomeTextByPerformance: {
                            perfect: 'La inspección encontró todos los defectos y el retiro fue ordenado y rápido.',
                            poor: 'Se te escaparon varias unidades defectuosas y el retiro tardó más de lo debido.',
                        },
                    },
                    learningPill: 'Retiro de Producto: Retirar a tiempo duele en la caja, pero protege a los clientes y a tu marca.',
                    outcomeText: 'Retiraste todo el lote y avisaste a cada cliente. Fue caro, pero la gente valoró que pusieras su seguridad primero.',
                }
            ),
            defineOption(
                'Revisar y reemplazar solo los productos que reclamen.',
                { capital: -8, bienestar: -5, reputacion: -3 },
                {
                    minigame: {
                        kind: 'tapping',
                        difficulty: 2,
                        title: 'Revisión por muestreo',
                        rule: 'Revisá parte del lote y descartá las unidades defectuosas que encuentres.',
                        outcomeTextByPerformance: {
                            perfect: 'El muestreo encontró casi todo lo defectuoso y evitaste la mayoría de los reclamos.',
                            poor: 'El muestreo no detectó el problema y los reclamos fueron más de los esperados.',
                        },
                    },
                    learningPill: 'Gestión de Reclamos: Reemplazar solo a quien se queja ahorra costos, pero depende de que el cliente note el problema a tiempo.',
                    outcomeText: 'Reemplazaste los productos de quienes reclamaron. El costo fue chico, pero no sabés cuántos productos defectuosos siguen en circulación.',
                }
            ),
            defineOption(
                'Seguir vendiendo lo que quede y esperar que nadie lo note.',
                { capital: +5, bienestar: +3, reputacion: -10 },
                {
                    minigame: {
                        kind: 'tapping',
                        difficulty: 3,
                        title: 'Revisión superficial',
                        rule: 'Revisá el lote lo más rápido posible y vendé lo que pase la vista.',
                        outcomeTextByPerformance: {
                            perfect: 'La revisión rápida filtró casi todo lo grave y el riesgo quedó acotado.',
                            poor: 'La revisión rápida dejó pasar unidades defectuosas que ya están en manos de los clientes.',
                        },
                    },
                    addTags: ['falla_oculta'],
                    learningPill: 'Riesgo de Ocultar: Vender un producto que sabés defectuoso transforma un error de calidad en un problema legal y de reputación.',
                    outcomeText: 'Seguiste vendiendo y esperaste que nadie se quejara. La caja respira, pero cada venta es una apuesta.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f3_credito_sin_historial',
        phaseId: 3,
        title: 'El Crédito que no Pudiste Pedir',
        weight: 20,
        when: {
            tags: ['informalidad'],
            playedBefore: ['f1_sin_factura'],
        },
        description: 'Para financiar tu próximo paso, el banco te pide declaraciones y facturas que demuestren tus ventas. Una parte importante de lo que vendiste nunca quedó registrada.',
        options: [
            defineOption(
                'Regularizarte ahora y volver a pedir el crédito el año que viene.',
                { capital: -8, bienestar: -5, reputacion: +6 },
                {
                    removeTags: ['informalidad'],
                    learningPill: 'Historial Crediticio: Sin facturas no hay historial, y sin historial no hay crédito formal; regularizarse tarde es empezar de cero.',
                    outcomeText: 'Empezaste a facturar y ordenar todo. El crédito tendrá que esperar, pero ya construís el historial que te piden.',
                }
            ),
            defineOption(
                'Conseguir la plata por fuera, con prestamistas y adelantos caros.',
                { capital: +12, bienestar: -10, reputacion: -5 },
                {
                    addTags: ['deuda_riesgosa'],
                    learningPill: 'Crédito Informal: Cuando el sistema formal te cierra la puerta, lo informal cobra mucho más caro.',
                    outcomeText: 'Conseguiste la plata, pero a tasas altísimas. Los intereses ya pesan en cada cierre de mes.',
                }
            ),
        ]
    }),
]