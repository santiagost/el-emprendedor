import { defineEvent, defineOption } from "./builders";

export const fase1Events = [
    defineEvent({
        id: 'f1_mvp_calidad',
        phaseId: 1,
        title: 'El Primer Prototipo',
        description: 'El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado, {nombre}?',
        weight: 10,
        options: [
            defineOption(
                'Lanzar ya mismo para validar con usuarios reales.',
                { capital: 10, reputacion: -20 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Lanzamiento beta',
                        rule: 'Salís sin estar del todo listo: la ruleta decide cómo sale. Cuanto más cuidado fue tu producto, más grande el verde.',
                        outcomeTextByPerformance: {
                            perfect: 'Saliste rápido y, contra todo pronóstico, casi sin fallas. Los primeros clientes pagaron, la necesidad quedó confirmada y los pocos detalles feos pasaron desapercibidos.',
                            poor: 'Saliste rápido y el producto falló fuerte en manos de los primeros usuarios. Hubo críticas duras y reembolsos, aunque aprendiste en semanas lo que otros tardan meses.',
                        },
                    },
                    addTags: ['cultura_lean'],
                    learningPill: 'Metodología Lean: Lanzar un MVP imperfecto ahorra meses de desarrollo en ideas que nadie quiere.',
                    outcomeText: 'Saliste rápido a la cancha con un producto con bugs. Recibiste críticas duras por fallas visuales, pero los primeros clientes pagaron y confirmaron que la necesidad existe.',
                }
            ),
            defineOption(
                'Retrasar el lanzamiento 2 meses hasta que esté impecable.',
                { capital: -15, reputacion: +15, bienestar: -10 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: -0.2,
                        title: 'Lanzamiento pulido',
                        rule: 'Esperaste dos meses para salir mejor preparado: la ruleta tiene mucho más verde, pero igual puede salir mal.',
                        outcomeTextByPerformance: {
                            perfect: 'El producto salió impecable y generó elogios desde el primer día. Quemaste dos meses de ahorros, pero el lanzamiento valió cada uno.',
                            poor: 'Pese a los dos meses de pulido, apareció un fallo que nadie previó. Quemaste ahorros y encima el lanzamiento salió torcido: el peor de los dos mundos.',
                        },
                    },
                    addTags: ["obsesion_calidad"],
                    learningPill: 'Costo de Oportunidad: Perfeccionar un producto sin feedback temprano quema caja sin validar demanda.',
                    outcomeText: 'Puliste cada detalle técnico. El producto salió impecable y generó elogios de los primeros usuarios, aunque quemaste dos meses de ahorros antes de ingresar un solo centavo.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_primer_socio',
        phaseId: 1,
        title: 'La Elección del Co-Fundador',
        weight: 10,
        description: '{nombre}, necesitás complementar tus habilidades. Aparecen dos personas interesadas en sumarse.',
        options: [
            defineOption(
                'Sumar a un amigo de confianza técnica que comparte tu visión.',
                { reputacion: +5, bienestar: +15 },
                {
                    addTags: ['socio_alineado'],
                    learningPill: 'Alineación de Socios: En etapas tempranas, los valores compartidos y la resiliencia pesan más que el CV.',
                    outcomeText: 'Sumaste a alguien con quien compartís valores y ética de trabajo. La velocidad de desarrollo se duplicó y el respaldo emocional reduce la soledad del emprendedor.',
                }
            ),
            defineOption(
                'Sumar a un perfil comercial agresivo que exige el 40% del capital.',
                { capital: +15, bienestar: -10 },
                {
                    addTags: ['socio_conflictivo', 'equity_diluido'],
                    learningPill: 'Pactos de Socios (Vesting): Ceder porcentajes fijos al inicio sin metas de permanencia es un riesgo crítico.',
                    outcomeText: 'Entró un comercial voraz que trajo los primeros contratos rápidamente, pero desde el día uno presiona por dividendos y cuestiona tus decisiones operativas.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_primer_cliente_grande',
        phaseId: 1,
        title: 'Contrato Tentador',
        weight: 8,
        description: 'Una empresa consolidada quiere contratarte, pero exige pagar a 120 días y exclusividad operativa.',
        options: [
            defineOption(
                'Aceptar el contrato para ganar nombre y volumen.',
                { capital: -15, reputacion: +20, bienestar: -10 },
                {
                    addTags: ['cliente_dependencia'],
                    learningPill: 'Capital de Trabajo: Muchas empresas quiebran siendo rentables por no tener caja mientras esperan cobrar.',
                    outcomeText: 'Cerraste un cliente de renombre que viste tu portfolio. El equipo trabaja al 100% para ellos, pero tus reservas de caja sufren porque no verás un peso hasta dentro de cuatro meses.',
                }
            ),
            defineOption(
                'Rechazar y priorizar múltiples clientes chicos con pago al contado.',
                { capital: +10, reputacion: +5 },
                {
                    addTags: ['clientes_diversificados'],
                    learningPill: 'Diversificación de Clientes: Ningún cliente debería representar más del 20% de tu facturación total.',
                    outcomeText: 'Te mantuviste firme con pagos al contado. Cobrás semana a semana y ningún cliente puede amenazar la supervivencia de tu empresa si decide rescindir.',
                }
            )
        ]
    })
]