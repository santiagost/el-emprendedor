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
                    learningPill: 'Guerra de Precios: Competir por precio contra un rival con más capital es casi siempre una sentencia de quiebra.',
                    outcomeText: 'Entraste en guerra de precios directa. El competidor tiene espaldas infinitas y tus márgenes se desplomaron hasta quemar la caja a un ritmo alarmante.',
                }
            ),
            defineOption(
                'Pivotar a un nicho de altísima especialización y servicio.',
                { capital: -10, reputacion: +25, bienestar: +5 },
                {
                    learningPill: 'Diferenciación Estratégica: Cuando no podés ganar por escala, ganás por foco, cercanía y propuesta de valor única.',
                    outcomeText: 'Te retiraste de la pelea masiva y te enfocaste en servicio premium hiper-personalizado. Perdiste volumen pero tus clientes leales pagan el doble y te recomiendan.',
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
                    learningPill: 'Estrategia de Salida (Exit): Vender la empresa no es fracasar; monetizar el valor creado es el objetivo de muchos fundadores.',
                    outcomeText: 'Aceptaste la oferta de salida. Depositaste millones en tu cuenta y te retiraste victorioso tras años de esfuerzo, cerrando un ciclo inolvidable.',
                }
            ),
            defineOption(
                'Agotar tus ahorros personales en abogados para pelear por el control.',
                { capital: -35, reputacion: -15, bienestar: -30 },
                {
                    learningPill: 'Poder de Control: El porcentaje accionario define quién toma las decisiones cuando las papas queman.',
                    outcomeText: 'Fuiste a la guerra legal con tus ahorros personales. Frenaste la compra hostil pero quedaste descapitalizado y con heridas profundas en el directorio.',
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
                    learningPill: 'Lifestyle Business: No todas las empresas deben volverse multinacionales; un negocio rentable y autónomo es un triunfo rotundo.',
                    outcomeText: 'Repartiste ganancias y delegaste la dirección diaria. Tenés un negocio rentable y predecible que te da libertad financiera y tiempo para tu familia.',
                }
            ),
            defineOption(
                'Reinvertir el 100% de los dividendos en abrir mercado internacional.',
                { capital: -25, reputacion: +30, bienestar: -15 },
                {
                    addTags: ['expansion_global'],
                    learningPill: 'Internacionalización: Escalar fronteras multiplica el valor potencial, pero reinicia el ciclo de riesgo e incertidumbre.',
                    outcomeText: 'Apostaste todo a abrir mercado en el exterior. La marca ahora compite a nivel regional, asumiendo nuevos desafíos y riesgos de escala.',
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
                    learningPill: 'Compliance y Formalización: La prolijidad fiscal y legal cuesta cara día a día, pero evita catástrofes repentinas.',
                    outcomeText: 'La inspección revisó 3 años de libros y contratos sin hallar irregularidades graves. La inversión en orden fiscal demostró ser tu mejor póliza de seguro.',
                }
            ),
            defineOption(
                'Regularizar desprolijidades pasadas pagando multas e intereses.',
                { capital: -30, reputacion: -35, bienestar: -20 },
                {
                    learningPill: 'Pasivos Ocultos: La informalidad como atajo financiero suele cobrarse con creces cuando la empresa gana visibilidad.',
                    outcomeText: 'Tuviste que pagar multas, recargos y planes de pago para subsanar descuidos pasados. La sangría de fondos golpeó fuerte la caja de la empresa.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_sucesion_operativa',
        phaseId: 4,
        title: 'Soltar la Operación',
        weight: 10,
        description: 'La empresa ya funciona sin vos en el día a día. Podés contratar un gerente general y soltar, o seguir decidiendo cada detalle.',
        options: [
            defineOption(
                'Contratar un gerente general y pasar a un rol estratégico.',
                { capital: -15, reputacion: +10, bienestar: +20 },
                {
                    addTags: ['lifestyle_business'],
                    learningPill: 'Delegación Real: Una empresa que no funciona sin el fundador no es un activo, es un empleo con más estrés.',
                    outcomeText: 'Contrataste a una gerenta general y le diste autonomía real. Al principio costó soltar, pero la empresa ahora crece sin depender de tu presencia diaria.',
                }
            ),
            defineOption(
                'Seguir al mando de cada decisión operativa.',
                { capital: +10, reputacion: -5, bienestar: -20 },
                {
                    learningPill: 'Techo del Fundador: Cuando todo pasa por vos, tu energía se convierte en el límite del crecimiento de la empresa.',
                    outcomeText: 'Mantuviste el control centralizado de cada decisión. Nada se mueve sin tu firma, pero estás agotado y la empresa no puede crecer más allá de tus horas despierto.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_propuesta_franquicia',
        phaseId: 4,
        title: 'Propuesta de Franquicia',
        weight: 10,
        description: 'Un grupo inversor quiere franquiciar tu modelo en todo el país. Escalarías con capital ajeno, pero perderías control sobre la calidad.',
        options: [
            defineOption(
                'Franquiciar el modelo y escalar con capital de terceros.',
                { capital: +20, reputacion: -10, bienestar: -5 },
                {
                    addTags: ['expansion_global'],
                    learningPill: 'Franquicias: Escalar con capital ajeno acelera la expansión, pero cada local descontrolado erosiona la marca.',
                    outcomeText: 'Franquiciaste la marca y abriste decenas de puntos en tiempo récord. El cobro de regalías engrosó tus ingresos, aunque lidias con quejas por locales desalineados.',
                }
            ),
            defineOption(
                'Mantener operación propia y control total de la calidad.',
                { capital: -10, reputacion: +15, bienestar: +5 },
                {
                    addTags: ['calidad_producto'],
                    learningPill: 'Control vs Escala: Crecer con locales propios es lento y caro, pero protege lo que te hizo llegar hasta acá.',
                    outcomeText: 'Rechazaste franquiciar para cuidar cada detalle con locales propios. El crecimiento es más lento, pero la reputación de excelencia se mantiene intacta.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_alianza_estrategica',
        phaseId: 4,
        title: 'Alianza Estratégica',
        weight: 10,
        description: 'Un jugador complementario propone una alianza comercial con exclusividad. Sumarías fuerza de ventas, a cambio de atarte a un solo socio.',
        options: [
            defineOption(
                'Firmar la alianza con exclusividad.',
                { capital: +15, reputacion: +10, bienestar: -10 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Alianzas Comerciales: Un buen socio multiplica tu alcance; la exclusividad define cuánto te cuesta si la relación se enfría.',
                    outcomeText: 'Firmaste una alianza exclusiva con un gigante comercial. Multiplicaste tus canales de venta de inmediato, aunque quedaste atado a sus condiciones contractuales.',
                }
            ),
            defineOption(
                'Rechazar la alianza y competir en todos los frentes.',
                { capital: -10, reputacion: +5, bienestar: +5 },
                {
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Independencia Estratégica: Competir solo preserva tu libertad de movimiento, pero cada batalla se paga con caja propia.',
                    outcomeText: 'Decidiste competir por tu cuenta en todos los frentes. La tracción requiere esfuerzo propio continuo, pero no le debés explicaciones ni exclusividad a nadie.',
                }
            )
        ]
    })
]