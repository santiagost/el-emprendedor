import { defineEvent, defineOption } from "./builders";

export const fase1Events = [
    defineEvent({
        id: 'f1_mvp_calidad',
        phaseId: 1,
        title: 'El Primer Prototipo',
        description: 'El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado, {nombre}?',
        weight: 10,
        milestone: true,
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
        milestone: true,
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
        milestone: true,
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
        milestone: true,
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
                'Sumar a un amigo de confianza que comparte tu visión.',
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
    }),

    defineEvent({
        id: 'f1_visita_empresa',
        phaseId: 1,
        title: 'La Visita Guiada',
        weight: 10,
        description: 'Una empresa más grande te invita a conocer su oficina para evaluar trabajar juntos. Mientras esperás, queda a tu alcance una computadora desbloqueada con clientes, precios y planes del año.',
        options: [
            defineOption(
                'Echar un vistazo rápido a los archivos mientras nadie mira.',
                { capital: +10, bienestar: -5 },
                {
                    addTags: ['secreto_ajeno'],
                    scheduledEvent: { eventId: 'f2_anfitrion_pregunta', delayTurns: 2 },
                    learningPill: 'Ética y Confidencialidad: La información obtenida sin permiso puede dar ventaja hoy, pero deja un riesgo legal y de reputación que no vence.',
                    outcomeText: 'Viste precios, clientes y planes que no te correspondían y ajustaste tu propuesta con eso. Saliste mejor parado de la reunión, pero con la sensación de que alguien pudo haberte visto.',
                }
            ),
            defineOption(
                'Avisarle a tu anfitrión que la computadora quedó desbloqueada.',
                { bienestar: +5, reputacion: +10 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Confianza como Activo: Ser confiable abre más puertas que cualquier dato obtenido a escondidas.',
                    outcomeText: 'Tu anfitrión agradeció el gesto y se lo contó a su equipo. Te fuiste con un aliado que te recomienda.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_prestamo_familiar',
        phaseId: 1,
        title: 'El Préstamo de la Familia',
        weight: 10,
        description: 'Tu familia quiere ayudarte con sus ahorros para arrancar. Te ofrecen la plata sin papeles y sin plazo: "devolvela cuando puedas".',
        options: [
            defineOption(
                'Aceptar todo lo que te ofrecen, sin papeles.',
                { capital: +20, bienestar: -10 },
                {
                    addTags: ['deuda_familiar'],
                    scheduledEvent: { eventId: 'f2_reclamo_familiar', delayTurns: 2 },
                    learningPill: 'Dinero Informal: Un préstamo sin plazo ni contrato parece gratis, pero ata la relación familiar al resultado del negocio.',
                    outcomeText: 'Arrancaste con un colchón generoso. Nadie te apura, pero cada reunión familiar incluye la pregunta de cómo va el negocio.',
                }
            ),
            defineOption(
                'Aceptar una parte y dejar por escrito monto, plazo y devolución.',
                { capital: +10, bienestar: -3 },
                {
                    learningPill: 'Formalizar la Ayuda: Poner por escrito monto y plazo protege el vínculo y ordena la devolución, aunque la charla incomode.',
                    outcomeText: 'La charla fue más incómoda que recibir la plata, pero todos saben las reglas. Tenés menos capital y la relación quedó a salvo.',
                }
            ),
            defineOption(
                'Agradecer y arrancar solo con tus propios ahorros.',
                { capital: -5, bienestar: +5 },
                {
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Bootstrapping: Crecer sin deberle a nadie da libertad para decidir, aunque limita lo que podés invertir.',
                    outcomeText: 'Arrancaste con lo justo y a tu ritmo. No le debés nada a nadie, pero cada gasto se piensa dos veces.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_sin_factura',
        phaseId: 1,
        title: '¿Facturás o No?',
        weight: 10,
        description: 'Tus primeros clientes te pagan en efectivo y te dicen que "por ahora" no hace falta factura. Inscribirte y facturar te suma costos fijos desde el primer día.',
        options: [
            defineOption(
                'Seguir sin facturar mientras la empresa sea chica.',
                { capital: +8, reputacion: -5 },
                {
                    addTags: ['informalidad'],
                    scheduledEvent: { eventId: 'f2_cliente_exige_factura', delayTurns: 2 },
                    learningPill: 'Informalidad: Ahorrar impuestos al inicio te deja afuera de los clientes grandes y acumula un riesgo que crece con el tiempo.',
                    outcomeText: 'Te quedaste con todo lo que cobraste y la caja respira. Pero sin factura no podés venderle a quien la exige ni demostrar tus ingresos ante un banco.',
                }
            ),
            defineOption(
                'Inscribirte como monotributista y facturar todo desde ya.',
                { capital: -8, bienestar: -3, reputacion: +8 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Formalización: Estar en regla cuesta poco al inicio y abre la puerta a clientes, créditos y contratos que de otro modo no existen.',
                    outcomeText: 'Pagás la cuota y llevás el papeleo, pero tu negocio es visible y ya podés venderle a empresas.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_resena_negativa',
        phaseId: 1,
        title: 'La Primera Queja Pública',
        weight: 10,
        description: 'Un cliente insatisfecho publicó una reseña durísima sobre tu emprendimiento y se está compartiendo en grupos de la zona.',
        options: [
            defineOption(
                'Responder en público, pedir disculpas y ofrecer una solución.',
                { capital: -5, bienestar: -5, reputacion: +10 },
                {
                    learningPill: 'Gestión de Crisis: Responder rápido y con empatía frente a todos convierte una queja en una muestra de seriedad.',
                    outcomeText: 'Tu respuesta tuvo más alcance que la queja. Varios comentaron que les gustó cómo lo resolviste.',
                }
            ),
            defineOption(
                'Escribirle en privado y compensarlo para que borre la reseña.',
                { capital: -10, reputacion: +3 },
                {
                    learningPill: 'Síntoma vs. Causa: Compensar para que borren una queja apaga el incendio, pero no arregla lo que la provocó.',
                    outcomeText: 'El cliente borró la reseña y el tema se calmó. Lo que falló sigue igual, y te costó plata.',
                }
            ),
            defineOption(
                'Ignorarla: es un caso aislado.',
                { bienestar: +3, reputacion: -12 },
                {
                    learningPill: 'Silencio en Redes: No responder una queja pública se lee como indiferencia, y la versión del cliente queda como la única.',
                    outcomeText: 'No dijiste nada y la reseña siguió circulando. Algunos clientes nuevos te preguntaron por eso antes de comprar.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_demanda_antes_que_codigo',
        phaseId: 1,
        title: '¿Construir o Preguntar Primero?',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Armar tu producto digital completo te llevaría un año de trabajo. Antes de escribir una línea de código, podrías probar si alguien lo quiere.',
        options: [
            defineOption(
                'Construir el producto completo y recién después mostrarlo.',
                { capital: -15, bienestar: -10, reputacion: +5 },
                {
                    addTags: ['obsesion_calidad'],
                    learningPill: 'Validación Temprana: Construir sin preguntar es la forma más cara de descubrir que nadie necesita tu producto.',
                    outcomeText: 'Trabajaste meses en silencio y el producto quedó sólido. Recién ahora vas a saber si alguien lo quiere.',
                }
            ),
            defineOption(
                'Publicar un video demo con una lista de espera para medir el interés.',
                { capital: -3, bienestar: -2, reputacion: +10 },
                {
                    addTags: ['cultura_lean'],
                    learningPill: 'Prueba de Demanda: Un video o una página de espera mide el interés real antes de gastar en desarrollo.',
                    outcomeText: 'El video circuló y la lista de espera se llenó más rápido de lo que esperabas. Ahora sabés qué piden y quién lo pide.',
                }
            ),
            defineOption(
                'Venderles una preventa a los primeros diez interesados.',
                { capital: +12, bienestar: -8, reputacion: -5 },
                {
                    addTags: ['promesas_pendientes'],
                    scheduledEvent: { eventId: 'f2_cumplir_preventa', delayTurns: 1 },
                    learningPill: 'Preventa: Cobrar antes de construir confirma que hay quien paga, pero convierte cada promesa en una deuda de entrega.',
                    outcomeText: 'Diez clientes pagaron por algo que todavía no existe. La caja mejoró, y el reloj empezó a correr.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_creditos_nube',
        phaseId: 1,
        title: 'Créditos Gratis en la Nube',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Un proveedor de servicios en la nube te ofrece créditos gratuitos por un tiempo si armás todo tu producto sobre su plataforma.',
        options: [
            defineOption(
                'Aprovechar los créditos y construir todo sobre ese proveedor.',
                { capital: +10, bienestar: +3 },
                {
                    addTags: ['proveedor_dependiente'],
                    scheduledEvent: { eventId: 'f2_creditos_agotados', delayTurns: 3 },
                    learningPill: 'Costo de Cambio (lock-in): Lo que hoy es gratis puede volverse muy caro de abandonar cuando tu producto ya depende de eso.',
                    outcomeText: 'Te ahorraste meses de costos de infraestructura y avanzaste rápido. Tu producto quedó hecho a la medida de ese proveedor.',
                }
            ),
            defineOption(
                'Armar el producto para poder moverlo de proveedor, aunque cueste más trabajo.',
                { capital: -5, bienestar: -8, reputacion: +3 },
                {
                    addTags: ['proveedores_diversificados'],
                    learningPill: 'Portabilidad: Diseñar para poder cambiar de proveedor cuesta más al principio y te da poder de negociación después.',
                    outcomeText: 'Tardaste más y pagaste parte de la infraestructura, pero podés cambiar de proveedor cuando quieras.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_vender_sin_stock',
        phaseId: 1,
        title: 'Vender Antes de Comprar',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Un mayorista te ofrece un precio muy bajo si comprás un lote grande. Pero todavía no sabés qué productos se van a vender de verdad.',
        options: [
            defineOption(
                'Comprar el lote grande para conseguir el mejor precio.',
                { capital: -20, bienestar: -3, reputacion: +3 },
                {
                    addTags: ['stock_inmovilizado'],
                    scheduledEvent: { eventId: 'f2_stock_dormido', delayTurns: 2 },
                    learningPill: 'Capital Inmovilizado: El descuento por volumen solo conviene si la mercadería rota; si no, es plata dormida.',
                    outcomeText: 'Llenaste el depósito a un precio excelente. Ahora falta que la gente compre lo que elegiste.',
                }
            ),
            defineOption(
                'Publicar el catálogo y comprar cada producto recién cuando te lo piden.',
                { capital: +5, bienestar: -5, reputacion: -6 },
                {
                    addTags: ['cultura_lean'],
                    learningPill: 'Validar sin Stock: Vender antes de comprar te muestra qué quiere la gente sin arriesgar capital, a costa de margen y demoras.',
                    outcomeText: 'Cada venta te obliga a correr a comprar y las entregas tardan más, pero no tenés un peso parado.',
                }
            ),
            defineOption(
                'Comprar poco, solo de los dos productos que más te consultan.',
                { capital: -8, reputacion: +2 },
                {
                    learningPill: 'Compra Prudente: Empezar con poco stock de lo más pedido limita el riesgo mientras aprendés qué rota.',
                    outcomeText: 'Pagaste un poco más por unidad, pero vendiste casi todo y ya sabés qué reponer.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_donde_vender',
        phaseId: 1,
        title: '¿Dónde Abrís?',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Un local a la calle te da presencia, pero exige un contrato de varios años con garantía. También podés arrancar vendiendo online o en ferias.',
        options: [
            defineOption(
                'Alquilar el local y firmar el contrato a varios años.',
                { capital: -20, bienestar: -5, reputacion: +12 },
                {
                    addTags: ['alquiler_comprometido'],
                    scheduledEvent: { eventId: 'f2_aumento_alquiler', delayTurns: 2 },
                    learningPill: 'Costos Fijos: Un local da visibilidad, pero el alquiler se paga todos los meses, vendas o no vendas.',
                    outcomeText: 'Abriste tu local y la gente del barrio empezó a conocerte. El alquiler ya es tu gasto más grande.',
                }
            ),
            defineOption(
                'Empezar vendiendo online y por redes.',
                { capital: -3, bienestar: -3, reputacion: -3 },
                {
                    learningPill: 'Canal Digital: Vender online baja la inversión inicial, aunque cuesta más generar confianza sin un lugar físico.',
                    outcomeText: 'Arrancaste con poca inversión. Las ventas llegan de a poco y muchos preguntan si tenés un lugar para ver los productos.',
                }
            ),
            defineOption(
                'Salir a ferias y puestos compartidos los fines de semana.',
                { capital: -6, bienestar: -8, reputacion: +3 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Contacto Directo: Las ferias permiten probar productos y precios cara a cara con muy poca inversión.',
                    outcomeText: 'Pasaste los fines de semana en ferias. Es cansador, pero conociste a tus clientes y a otros emprendedores.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_cobrar_hora_o_proyecto',
        phaseId: 1,
        title: '¿Cuánto Vale tu Tiempo?',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Un cliente te pide presupuesto. Podés cobrar por hora, cerrar un precio por todo el proyecto o proponer un abono mensual.',
        options: [
            defineOption(
                'Cobrar por hora trabajada.',
                { capital: +5, bienestar: -10 },
                {
                    learningPill: 'Vender Tiempo: Cobrar por hora asegura el pago, pero tu ingreso tiene techo: no podés vender más horas que las del día.',
                    outcomeText: 'Cobrás cada hora que trabajás. Para ganar más, la única opción es trabajar más.',
                }
            ),
            defineOption(
                'Cotizar un precio cerrado por todo el proyecto.',
                { capital: +12, bienestar: -5, reputacion: +3 },
                {
                    addTags: ['promesas_pendientes'],
                    scheduledEvent: { eventId: 'f2_cliente_pide_mas', delayTurns: 1 },
                    learningPill: 'Alcance del Proyecto: Un precio cerrado premia la eficiencia y castiga los cambios: lo que no está escrito, lo pagás vos.',
                    outcomeText: 'Cerraste un buen precio y el cliente quedó conforme. Ahora todo depende de que el proyecto no se agrande.',
                }
            ),
            defineOption(
                'Proponer un abono mensual por un servicio acotado.',
                { capital: +8, reputacion: +5 },
                {
                    addTags: ['generacion_ingresos'],
                    learningPill: 'Ingresos Recurrentes: Un abono da previsibilidad a los dos lados y convierte una venta en una relación.',
                    outcomeText: 'El cliente aceptó el abono. No es el mayor ingreso, pero sabés cuánto vas a cobrar cada mes.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_gratis_por_exposicion',
        phaseId: 1,
        title: 'Trabajo Gratis por Visibilidad',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Una marca conocida te propone que le hagas un trabajo sin cobrar: "te damos exposición y después hablamos".',
        options: [
            defineOption(
                'Aceptar: la visibilidad vale más que el pago.',
                { capital: -10, bienestar: -5, reputacion: +12 },
                {
                    addTags: ['precio_devaluado'],
                    scheduledEvent: { eventId: 'f2_cliente_pide_descuento', delayTurns: 2 },
                    learningPill: 'Trabajo Gratis: La exposición no paga las cuentas y le muestra al mercado que tu trabajo puede no tener precio.',
                    outcomeText: 'Tu trabajo apareció en las redes de la marca y te conocieron muchos. El pago prometido nunca llegó.',
                }
            ),
            defineOption(
                'Proponer un trabajo de prueba acotado, a precio reducido.',
                { capital: +3, reputacion: +4 },
                {
                    learningPill: 'Prueba Paga: Una prueba chica y paga demuestra tu valor sin regalarlo.',
                    outcomeText: 'La marca aceptó una prueba chica. Cobraste poco, pero quedó claro que tu trabajo tiene precio.',
                }
            ),
            defineOption(
                'Rechazar y explicar cuánto cuesta tu trabajo.',
                { bienestar: +5, reputacion: -2 },
                {
                    learningPill: 'Valor Percibido: Decir que no a tiempo protege tu precio, aunque a veces cueste una oportunidad.',
                    outcomeText: 'La marca buscó a otra persona. Te quedó la duda, pero también tu tiempo libre para clientes que pagan.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_habilitacion',
        phaseId: 1,
        title: 'Producir en Casa o en Planta',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Podés empezar a producir en tu cocina o tu taller sin habilitación, o alquilar un espacio ya habilitado que cuesta bastante más.',
        options: [
            defineOption(
                'Producir en casa y tramitar la habilitación "más adelante".',
                { capital: +10, bienestar: -5, reputacion: -3 },
                {
                    addTags: ['sin_habilitacion'],
                    scheduledEvent: { eventId: 'f2_clausura_preventiva', delayTurns: 2 },
                    learningPill: 'Riesgo Regulatorio: Producir sin habilitación ahorra al principio, pero una inspección puede frenar todo de un día para el otro.',
                    outcomeText: 'Arrancaste sin gastar en alquiler y vendiste tus primeros lotes. No podés venderle a comercios que piden los papeles en regla.',
                }
            ),
            defineOption(
                'Alquilar un espacio habilitado desde el primer día.',
                { capital: -15, bienestar: +2, reputacion: +10 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Habilitación: Estar habilitado cuesta más, pero te permite venderle a comercios y distribuidores desde el primer día.',
                    outcomeText: 'Pagás un alquiler caro, pero con los papeles en regla ya te compran comercios de la zona.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f1_pedido_minimo',
        phaseId: 1,
        title: 'El Pedido Mínimo',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Tu proveedor de insumos solo vende en cantidades grandes. Si comprás poco, te cobra bastante más por unidad.',
        options: [
            defineOption(
                'Comprar la cantidad mínima y aprovechar el mejor precio por unidad.',
                { capital: -15, bienestar: -2 },
                {
                    addTags: ['stock_inmovilizado'],
                    scheduledEvent: { eventId: 'f2_insumos_vencidos', delayTurns: 2 },
                    learningPill: 'Economía de Escala: Comprar en volumen baja el costo por unidad, pero inmoviliza plata en insumos que todavía no usás.',
                    outcomeText: 'Conseguiste un gran precio por unidad. El depósito está lleno de insumos para varios meses.',
                }
            ),
            defineOption(
                'Comprar poco, aunque pagues más por cada unidad.',
                { capital: -5, bienestar: -3 },
                {
                    learningPill: 'Flexibilidad vs. Margen: Pagar más por unidad reduce tu margen, pero te deja la caja libre para lo que surja.',
                    outcomeText: 'Tu margen por producto es más chico, pero la caja quedó libre y no tenés nada parado.',
                }
            ),
            defineOption(
                'Buscar otro proveedor local que venda por menos cantidad.',
                { capital: -3, bienestar: -8, reputacion: +3 },
                {
                    addTags: ['proveedores_diversificados'],
                    learningPill: 'Diversificar Proveedores: Tener más de un proveedor cuesta tiempo de búsqueda y te da respaldo si uno falla.',
                    outcomeText: 'Recorriste varios proveedores hasta encontrar uno que te vende por menos cantidad. Ahora tenés dos opciones.',
                }
            ),
        ]
    }),
]