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
                    learningPill: 'Poder de Fijación de Precios (Pricing Power): Trasladar costos sin valor diferencial destruye la fidelidad del cliente.',
                    outcomeText: 'Trasladaste el aumento de inmediato. Salvaste la rentabilidad del mes, pero muchos clientes históricos se sintieron defraudados y migraron a alternativas.',
                }
            ),
            defineOption(
                'Absorber parte del costo para ganar clientes de la competencia.',
                { capital: -25, reputacion: +25, bienestar: -10 },
                {
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
        description: '{nombre}, un fondo de Venture Capital ofrece 200k USD, pero exige el 35% de la empresa y una silla con derecho a veto en el directorio.',
        options: [
            defineOption(
                'Aceptar la inversión para pisar el acelerador.',
                { capital: +35, reputacion: +15, bienestar: -15 },
                {
                    addTags: ['inversion_externa', 'equity_diluido'],
                    learningPill: 'Venture Capital: Inyecta velocidad extrema a cambio de perder autonomía sobre el rumbo de tu propia empresa.',
                    outcomeText: 'Ingresó el fondo de VC con capital fresco. Podés acelerar fuerte, pero en cada reunión mensual sentís la presión implacable de los inversores sobre tus decisiones.',
                }
            ),
            defineOption(
                'Rechazar la oferta y continuar autofinanciados (Bootstrapping).',
                { reputacion: +5, bienestar: +10 },
                {
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
                    learningPill: 'Liderazgo y Burnout: El fundador que actúa como bombero permanente termina siendo el cuello de botella de la empresa.',
                    outcomeText: 'Te pusiste la empresa al hombro trabajando 16 horas diarias para tapar los huecos. Cumpliste con las entregas, pero quedaste al borde del colapso físico y mental.',
                }
            ),
            defineOption(
                'Asumir penalidades contractuales, frenar y dar un bono de retención.',
                { capital: -25, reputacion: -10, bienestar: +15 },
                {
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
                    addTags: ['generacion_ingresos'],
                    learningPill: 'CAC y Crecimiento: Pagar por crecer solo funciona si el cliente adquirido deja más de lo que costó conseguirlo.',
                    outcomeText: 'Pusiste una suma importante en pauta publicitaria. El tráfico explotó y conseguiste visibilidad de marca, aunque el costo de conversión resultó más alto de lo proyectado.',
                }
            ),
            defineOption(
                'Crecer orgánico con referidos, lento pero sin quemar caja.',
                { capital: +5, reputacion: +5, bienestar: +5 },
                {
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
        description: 'En el mejor momento de demanda, la plataforma se cae. Los clientes están furiosos y cada hora cuenta.',
        options: [
            defineOption(
                'Frenar las ventas nuevas hasta estabilizar la plataforma.',
                { capital: -10, reputacion: +15 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Deuda Técnica: Frenar para estabilizar duele en el corto plazo, pero operar sobre un sistema roto duele siempre.',
                    outcomeText: 'Pausaste las altas para reescribir código y blindar la infraestructura. Dejaste de facturar unos días, pero la plataforma ahora resiste picos masivos sin pestañear.',
                }
            ),
            defineOption(
                'Aplicar un parche rápido y seguir vendiendo a toda máquina.',
                { capital: +15, reputacion: -25, bienestar: -15 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: El parche rápido sostiene la facturación hoy y factura el cansancio del equipo mañana.',
                    outcomeText: 'Pusiste un parche rápido y seguiste vendiendo. Salvaguardaste la caja de la semana, pero el equipo vive con el temor constante de que el sistema explote en cualquier momento.',
                }
            )
        ]
    })
]