import { defineEvent, defineOption } from "./builders";

export const fase1Events = [
    defineEvent({
        id: 'f1_mvp_calidad',
        phaseId: 1,
        title: 'El Primer Prototipo',
        description: 'El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado, {nombre}?',
        weight: 10,
        when: { rubro: ['r1_tecnologia'] },
        options: [
            defineOption(
                'Lanzar ya mismo para validar con usuarios reales.',
                { capital: 10, reputacion: -20 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Lanzamiento beta',
                        rule: 'Salís sin estar del todo listo. Frená la ruleta con un toque: cuanto más cuidado fue tu producto, más grande el verde, pero cae donde apunte la flecha.',
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
                        rule: 'Esperaste dos meses para salir mejor preparado: hay mucho más verde, pero igual tenés que frenar la ruleta en el lugar justo.',
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

    // Variantes de f1_mvp_calidad para los rubros que no son Tecnología: mismas cifras y etiquetas, otro contexto.
    defineEvent({
        id: 'f1_mvp_calidad_comercio',
        phaseId: 1,
        title: 'La Primera Apertura',
        description: 'Tu local está casi listo, pero la vidriera está a medio armar, algunos precios están mal cargados y faltan productos del surtido. ¿Cómo abrís al público, {nombre}?',
        weight: 10,
        when: { rubro: ['r2_comercio'] },
        options: [
            defineOption(
                'Abrir ya mismo para validar con clientes reales.',
                { capital: 10, reputacion: -20 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Apertura a medias',
                        rule: 'Abrís sin tener todo listo. Frená la ruleta con un toque: cuanto más cuidado estuvo tu negocio, más grande el verde, pero cae donde apunte la flecha.',
                        outcomeTextByPerformance: {
                            perfect: 'Abriste rápido y, contra todo pronóstico, casi sin tropiezos. Los primeros clientes compraron, la demanda quedó confirmada y los detalles sin terminar pasaron desapercibidos.',
                            poor: 'Abriste rápido y la apertura salió mal: precios equivocados, estantes vacíos y clientes que se fueron sin comprar. Aun así aprendiste en semanas lo que otros tardan meses.',
                        },
                    },
                    addTags: ['cultura_lean'],
                    learningPill: 'Metodología Lean: Abrir con una versión imperfecta ahorra meses de preparación en un negocio que quizás nadie quiere.',
                    outcomeText: 'Abriste rápido con la vidriera a medio armar y algunos precios mal cargados. Recibiste quejas por los desajustes, pero los primeros clientes compraron y confirmaron que la demanda existe.',
                }
            ),
            defineOption(
                'Retrasar la apertura 2 meses hasta que todo esté impecable.',
                { capital: -15, reputacion: +15, bienestar: -10 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: -0.2,
                        title: 'Apertura cuidada',
                        rule: 'Esperaste dos meses para abrir mejor preparado: hay mucho más verde, pero igual tenés que frenar la ruleta en el lugar justo.',
                        outcomeTextByPerformance: {
                            perfect: 'El local abrió impecable y generó elogios desde el primer día. Pagaste dos meses de alquiler sin vender nada, pero la apertura valió cada uno.',
                            poor: 'Pese a los dos meses de preparación, apareció un problema que nadie previó. Pagaste alquiler sin ingresos y encima la apertura salió torcida: el peor de los dos mundos.',
                        },
                    },
                    addTags: ["obsesion_calidad"],
                    learningPill: 'Costo de Oportunidad: Perfeccionar un negocio sin feedback temprano quema caja sin validar demanda.',
                    outcomeText: 'Puliste cada detalle del local. La apertura salió impecable y generó elogios de los primeros clientes, aunque pagaste dos meses de alquiler antes de vender un solo producto.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_mvp_calidad_servicios',
        phaseId: 1,
        title: 'El Primer Servicio',
        description: 'Tu servicio funciona, pero la propuesta tiene detalles sin pulir: materiales a medio terminar y procesos que todavía improvisás. ¿Cómo salís a ofrecerlo, {nombre}?',
        weight: 10,
        when: { rubro: ['r3_servicios'] },
        options: [
            defineOption(
                'Ofrecerlo ya mismo para validar con clientes reales.',
                { capital: 10, reputacion: -20 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Primer servicio a medias',
                        rule: 'Salís sin tener todo pulido. Frená la ruleta con un toque: cuanto más cuidado fue tu servicio, más grande el verde, pero cae donde apunte la flecha.',
                        outcomeTextByPerformance: {
                            perfect: 'Saliste rápido y, contra todo pronóstico, casi sin tropiezos. Los primeros clientes pagaron, la necesidad quedó confirmada y lo que faltaba pulir pasó desapercibido.',
                            poor: 'Saliste rápido y el servicio falló en manos de los primeros clientes. Hubo reclamos y devoluciones, aunque aprendiste en semanas lo que otros tardan meses.',
                        },
                    },
                    addTags: ['cultura_lean'],
                    learningPill: 'Metodología Lean: Ofrecer una primera versión imperfecta ahorra meses de preparación para un servicio que nadie quiere.',
                    outcomeText: 'Saliste rápido con un servicio sin pulir. Recibiste reclamos por los detalles que faltaban, pero los primeros clientes pagaron y confirmaron que la necesidad existe.',
                }
            ),
            defineOption(
                'Retrasar el lanzamiento 2 meses hasta que el servicio esté impecable.',
                { capital: -15, reputacion: +15, bienestar: -10 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: -0.2,
                        title: 'Primer servicio cuidado',
                        rule: 'Esperaste dos meses para salir mejor preparado: hay mucho más verde, pero igual tenés que frenar la ruleta en el lugar justo.',
                        outcomeTextByPerformance: {
                            perfect: 'El servicio salió impecable y generó elogios desde el primer día. Pasaste dos meses sin facturar, pero el lanzamiento valió cada uno.',
                            poor: 'Pese a los dos meses de preparación, apareció un fallo que nadie previó. Gastaste ahorros sin facturar y encima el lanzamiento salió torcido: el peor de los dos mundos.',
                        },
                    },
                    addTags: ["obsesion_calidad"],
                    learningPill: 'Costo de Oportunidad: Perfeccionar un servicio sin feedback temprano quema caja sin validar demanda.',
                    outcomeText: 'Puliste cada detalle del servicio. Salió impecable y generó elogios de los primeros clientes, aunque pasaste dos meses sin facturar un solo peso.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_mvp_calidad_produccion',
        phaseId: 1,
        title: 'El Primer Lote',
        description: 'El primer lote salió con terminaciones irregulares y algunos defectos menores. ¿Cómo salís a vender, {nombre}?',
        weight: 10,
        when: { rubro: ['r4_produccion'] },
        options: [
            defineOption(
                'Vender ya mismo el primer lote para validar con clientes reales.',
                { capital: 10, reputacion: -20 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Primer lote a medias',
                        rule: 'Salís sin que el lote esté del todo logrado. Frená la ruleta con un toque: cuanto más cuidado fue tu proceso, más grande el verde, pero cae donde apunte la flecha.',
                        outcomeTextByPerformance: {
                            perfect: 'Saliste rápido y, contra todo pronóstico, casi sin reclamos. Los primeros clientes compraron, la demanda quedó confirmada y los defectos menores pasaron desapercibidos.',
                            poor: 'Saliste rápido y varios productos fallaron en manos de los primeros clientes. Hubo reclamos y devoluciones, aunque aprendiste en semanas lo que otros tardan meses.',
                        },
                    },
                    addTags: ['cultura_lean'],
                    learningPill: 'Metodología Lean: Vender una primera tanda imperfecta ahorra meses de producción de algo que nadie quiere.',
                    outcomeText: 'Saliste rápido con un lote con defectos menores. Recibiste reclamos por las terminaciones, pero los primeros clientes compraron y confirmaron que la demanda existe.',
                }
            ),
            defineOption(
                'Retrasar la salida 2 meses hasta que el proceso esté impecable.',
                { capital: -15, reputacion: +15, bienestar: -10 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: -0.2,
                        title: 'Primer lote cuidado',
                        rule: 'Esperaste dos meses para producir mejor: hay mucho más verde, pero igual tenés que frenar la ruleta en el lugar justo.',
                        outcomeTextByPerformance: {
                            perfect: 'El lote salió impecable y generó elogios desde el primer día. Quemaste dos meses de ahorros en ajustar el proceso, pero la salida valió cada uno.',
                            poor: 'Pese a los dos meses de ajustes, apareció un defecto que nadie previó. Quemaste ahorros y encima el lote salió torcido: el peor de los dos mundos.',
                        },
                    },
                    addTags: ["obsesion_calidad"],
                    learningPill: 'Costo de Oportunidad: Perfeccionar un producto sin feedback temprano quema caja sin validar demanda.',
                    outcomeText: 'Ajustaste cada detalle del proceso. El lote salió impecable y generó elogios de los primeros clientes, aunque quemaste dos meses de ahorros antes de vender una sola unidad.',
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