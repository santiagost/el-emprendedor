import { defineEvent, defineOption } from "./builders";

export const fase4Events = [
    defineEvent({
        id: 'f4_competidor_gigante',
        phaseId: 4,
        title: 'Ataque Corporativo',
        weight: 10,
        description: 'El líder del mercado copió tu producto estrella y lo ofrece a pérdida gracias a su espalda financiera.',
        options: [
            defineOption(
                'Bajar los precios para entrar en guerra tarifaria directa.',
                { capital: -30, bienestar: -20 },
                {
                    learningPill: 'Guerra de Precios: Competir por precio contra un rival con más capital es casi siempre una sentencia de quiebra.'
                }
            ),
            defineOption(
                'Pivotar a un nicho de altísima especialización y servicio.',
                { capital: -10, reputacion: +25, bienestar: +5 },
                {
                    learningPill: 'Diferenciación Estratégica: Cuando no podés ganar por escala, ganás por foco, cercanía y propuesta de valor única.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_intento_compra_hostil',
        phaseId: 4,
        title: 'Oferta de Compra Hostil',
        weight: 25,
        when: {
            tags: ['equity_diluido']
        },
        description: 'Un competidor se alió en secreto con tus inversores externos y te ofrecen comprar tu parte obligadamente.',
        options: [
            defineOption(
                'Vender tus acciones y aceptar un cheque millonario para retirarte.',
                { capital: +50, reputacion: +10, bienestar: +20 },
                {
                    addTags: ['salida_exitosa_venta'],
                    learningPill: 'Estrategia de Salida (Exit): Vender la empresa no es fracasar; monetizar el valor creado es el objetivo de muchos fundadores.'
                }
            ),
            defineOption(
                'Agotar tus ahorros personales en abogados para pelear por el control.',
                { capital: -35, reputacion: -15, bienestar: -30 },
                {
                    learningPill: 'Poder de Control: El porcentaje accionario define quién toma las decisiones cuando las papas queman.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_legado_sostenible',
        phaseId: 4,
        title: 'El Dilema del Dividendo',
        weight: 15,
        when: {
            tags: ['autonomia_estrategica']
        },
        description: 'La empresa es rentable, predecible y sólida. ¿Qué hacés con las ganancias acumuladas?',
        options: [
            defineOption(
                'Repartir dividendos y pasar a un rol de presidente de directorio.',
                { capital: +20, reputacion: +15, bienestar: +30 },
                {
                    addTags: ['lifestyle_business'],
                    learningPill: 'Lifestyle Business: No todas las empresas deben volverse multinacionales; un negocio rentable y autónomo es un triunfo rotundo.'
                }
            ),
            defineOption(
                'Reinvertir el 100% de los dividendos en abrir mercado internacional.',
                { capital: -25, reputacion: +30, bienestar: -15 },
                {
                    addTags: ['expansion_global'],
                    learningPill: 'Internacionalización: Escalar fronteras multiplica el valor potencial, pero reinicia el ciclo de riesgo e incertidumbre.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_auditoria_afip',
        phaseId: 4,
        title: 'Auditoría Fiscal General',
        weight: 8,
        description: 'Los inspectores revisan minuciosamente tus libros contables y contrataciones de los últimos 3 años.',
        options: [
            defineOption(
                'Presentar libros limpios (gastaste previamente en orden fiscal).',
                { capital: -10, reputacion: +20, bienestar: +10 },
                {
                    learningPill: 'Compliance y Formalización: La prolijidad fiscal y legal cuesta cara día a día, pero evita catástrofes repentinas.'
                }
            ),
            defineOption(
                'Regularizar desprolijidades pasadas pagando multas e intereses.',
                { capital: -30, reputacion: -20, bienestar: -20 },
                {
                    learningPill: 'Pasivos Ocultos: La informalidad como atajo financiero suele cobrarse con creces cuando la empresa gana visibilidad.'
                }
            )
        ]
    })
]