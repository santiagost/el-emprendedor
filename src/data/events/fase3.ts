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
                { capital: +10, reputacion: -20, bienestar: -5 },
                {
                    learningPill: 'Poder de Fijación de Precios (Pricing Power): Trasladar costos sin valor diferencial destruye la fidelidad del cliente.'
                }
            ),
            defineOption(
                'Absorber parte del costo para ganar clientes de la competencia.',
                { capital: -25, reputacion: +25, bienestar: -10 },
                {
                    learningPill: 'Estrategia Competitiva en Crisis: Las empresas con caja pueden ganar cuota de mercado sacrificando margen temporal.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f3_ronda_inversion',
        phaseId: 3,
        title: 'Llega un Fondo de Inversión',
        weight: 10,
        description: 'Un fondo de Venture Capital ofrece 200k USD, pero exige el 35% de la empresa y una silla con derecho a veto en el directorio.',
        options: [
            defineOption(
                'Aceptar la inversión para pisar el acelerador.',
                { capital: +35, reputacion: +15, bienestar: -15 },
                {
                    addTags: ['inversion_externa', 'equity_diluido'],
                    learningPill: 'Venture Capital: Inyecta velocidad extrema a cambio de perder autonomía sobre el rumbo de tu propia empresa.'
                }
            ),
            defineOption(
                'Rechazar la oferta y continuar autofinanciados (Bootstrapping).',
                { reputacion: +5, bienestar: +10 },
                {
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Bootstrapping: Crecer con tus propios ingresos te da libertad absoluta, pero limita tu velocidad de expansión.'
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
        description: 'Tu co-fundador quiere cambiar el rumbo del negocio y amenaza con bloquear las decisiones o llevarse clientes.',
        options: [
            defineOption(
                'Comprar su parte pagando una prima alta para recuperar el control.',
                { capital: -30, reputacion: +10, bienestar: +15 },
                {
                    removeTags: ['socio_conflictivo', 'equity_diluido'],
                    learningPill: 'Disolución Societaria: Un conflicto entre fundadores sin resolver es la principal causa interna de muerte de startups.'
                }
            ),
            defineOption(
                'Llevar el conflicto a la justicia y congelar sus atribuciones.',
                { capital: -15, reputacion: -25, bienestar: -30 },
                {
                    addTags: ['conflicto_legal'],
                    learningPill: 'Seguridad Jurídica: La litigiosidad interna destruye la reputación institucional y espanta clientes e inversores.'
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
        description: 'Renuncian dos personas clave de tu equipo en plena entrega importante. El resto amenaza con irse.',
        options: [
            defineOption(
                'Hacerte cargo personalmente de todo el trabajo operativo faltante.',
                { reputacion: +10, bienestar: -35 },
                {
                    learningPill: 'Liderazgo y Burnout: El fundador que actúa como bombero permanente termina siendo el cuello de botella de la empresa.'
                }
            ),
            defineOption(
                'Asumir penalidades contractuales, frenar y dar un bono de retención.',
                { capital: -25, reputacion: -10, bienestar: +15 },
                {
                    removeTags: ['equipo_sobrecargado'],
                    learningPill: 'Retención de Talento: Cuesta hasta 3 veces más reemplazar a un colaborador clave que invertir en su bienestar.'
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
                    learningPill: 'CAC y Crecimiento: Pagar por crecer solo funciona si el cliente adquirido deja más de lo que costó conseguirlo.'
                }
            ),
            defineOption(
                'Crecer orgánico con referidos, lento pero sin quemar caja.',
                { capital: +5, reputacion: +5, bienestar: +5 },
                {
                    addTags: ['clientes_diversificados'],
                    learningPill: 'Crecimiento Orgánico: Los clientes que llegan por recomendación cuestan poco, pagan mejor y se quedan más tiempo.'
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
                    learningPill: 'Deuda Técnica: Frenar para estabilizar duele en el corto plazo, pero operar sobre un sistema roto duele siempre.'
                }
            ),
            defineOption(
                'Aplicar un parche rápido y seguir vendiendo a toda máquina.',
                { capital: +15, reputacion: -15, bienestar: -10 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de la Improvisación: El parche rápido sostiene la facturación hoy y factura el cansancio del equipo mañana.'
                }
            )
        ]
    })
]