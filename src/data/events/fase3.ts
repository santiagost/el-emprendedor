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
    })
]