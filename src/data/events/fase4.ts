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
                    surprise: {
                        effects: { capital: -30, reputacion: +10, bienestar: -20 },
                        outcomeText: 'Entraste en guerra de precios y la caja se desplomó, pero los clientes celebraron los precios bajos y tu marca ganó fama de defender el bolsillo del consumidor.',
                    },
                    learningPill: 'Guerra de Precios: Competir por precio contra un rival con más capital es casi siempre una sentencia de quiebra.',
                    outcomeText: 'Entraste en guerra de precios directa. El competidor tiene espaldas infinitas y tus márgenes se desplomaron hasta quemar la caja a un ritmo alarmante.',
                }
            ),
            defineOption(
                'Pivotar a un nicho de altísima especialización y servicio.',
                { capital: -10, reputacion: +25, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: +10, reputacion: +25, bienestar: +5 },
                        outcomeText: 'Te enfocaste en servicio premium hiper-personalizado y el nicho pagaba precios altos desde el primer mes: el pivote se financió solo y tus clientes leales te recomiendan.',
                    },
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
        description: '{nombre}, un competidor se alió en secreto con tus inversores externos y te ofrecen comprar tu parte obligadamente.',
        options: [
            defineOption(
                'Vender tus acciones y aceptar un cheque millonario para retirarte.',
                { capital: +30, bienestar: +5 },
                {
                    addTags: ['salida_exitosa_venta'],
                    endsGame: true,
                    learningPill: 'Estrategia de Salida (Exit): Vender la empresa no es fracasar; monetizar el valor creado es el objetivo de muchos fundadores.',
                    outcomeText: 'Aceptaste la oferta de salida. Depositaste millones en tu cuenta y te retiraste victorioso tras años de esfuerzo, cerrando un ciclo inolvidable.',
                }
            ),
            defineOption(
                'Agotar tus ahorros personales en abogados para pelear por el control.',
                { capital: -35, reputacion: -15, bienestar: -30 },
                {
                    surprise: {
                        effects: { capital: -35, reputacion: +10, bienestar: -30 },
                        outcomeText: 'Fuiste a la guerra legal con tus ahorros y quedaste descapitalizado y agotado. Pero la prensa contó la pelea como David contra Goliat y el mercado se puso de tu lado.',
                    },
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
                    surprise: {
                        effects: { capital: +20, reputacion: -5, bienestar: +30 },
                        outcomeText: 'Repartiste ganancias y delegaste la dirección diaria: tenés libertad financiera y tiempo. Pero el mercado leyó tu paso al costado como falta de ambición y algunos clientes grandes dudaron.',
                    },
                    addTags: ['lifestyle_business'],
                    learningPill: 'Lifestyle Business: No todas las empresas deben volverse multinacionales; un negocio rentable y autónomo es un triunfo rotundo.',
                    outcomeText: 'Repartiste ganancias y delegaste la dirección diaria. Tenés un negocio rentable y predecible que te da libertad financiera y tiempo para tu familia.',
                }
            ),
            defineOption(
                'Reinvertir el 100% de los dividendos en abrir mercado internacional.',
                { capital: -25, reputacion: +30, bienestar: -15 },
                {
                    surprise: {
                        effects: { capital: -25, reputacion: -5, bienestar: -15 },
                        outcomeText: 'Apostaste todo a abrir mercado afuera, pero allá nadie te conocía: el lanzamiento pasó sin pena ni gloria y el tropiezo se notó también acá.',
                    },
                    addTags: ['expansion_global'],
                    learningPill: 'Internacionalización: Escalar fronteras multiplica el valor potencial, pero reinicia el ciclo de riesgo e incertidumbre.',
                    outcomeText: 'Apostaste todo a abrir mercado en el exterior. La marca ahora compite a nivel regional, asumiendo nuevos desafíos y riesgos de escala.',
                }
            ),
            defineOption(
                'Armar un fondo de reserva para los años difíciles.',
                { capital: +10, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: +5 },
                        outcomeText: 'Guardaste la reserva en pesos y la inflación se la fue comiendo: cuando la necesitaste, alcanzaba para bastante menos de lo que habías calculado.',
                    },
                    learningPill: 'Colchón Financiero: Una reserva equivalente a varios meses de gastos no da rendimiento, pero es lo que te deja decidir con calma cuando llega el próximo golpe.',
                    outcomeText: 'Guardaste una reserva equivalente a varios años de gastos. Ya no te asusta el próximo golpe.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_auditoria_afip',
        phaseId: 4,
        title: 'Auditoría Fiscal General',
        weight: 8,
        when: {
            tags: ['informalidad']
        },
        description: 'Los inspectores revisan minuciosamente tus libros contables y contrataciones de los últimos 3 años.',
        options: [
            defineOption(
                'Presentar los libros de lo que sí facturaste y regularizar lo demás.',
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
        id: 'f4_auditoria_rutina',
        phaseId: 4,
        title: 'Auditoría Fiscal de Rutina',
        weight: 8,
        when: {
            forbiddenTags: ['informalidad']
        },
        description: 'Te llega una inspección de rutina: los inspectores piden los libros contables y las contrataciones de los últimos 3 años.',
        options: [
            defineOption(
                'Presentar los libros ordenados y colaborar.',
                { capital: -5, reputacion: +15, bienestar: +5 },
                {
                    learningPill: 'Compliance y Formalización: Tener todo en orden convierte una inspección en un trámite, y no en una amenaza.',
                    outcomeText: 'Entregaste los libros al día y respondiste cada pedido. La inspección cerró sin observaciones y quedó a la vista que la empresa trabaja en regla.',
                }
            ),
            defineOption(
                'Pedir una prórroga para reunir papeles.',
                { capital: -5, reputacion: -5, bienestar: -10 },
                {
                    learningPill: 'Orden Administrativo: Aunque no haya deudas, no poder mostrar los papeles a tiempo desgasta al equipo y despierta sospechas.',
                    outcomeText: 'No tenías los papeles a mano y pediste más tiempo. Pasaste semanas rearmando carpetas y el inspector quedó con la duda de qué más podía faltar.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_sucesion_operativa',
        phaseId: 4,
        title: 'Soltar la Operación',
        weight: 10,
        milestone: true,
        description: 'La empresa ya funciona sin vos en el día a día, {nombre}. Podés contratar un gerente general y soltar, o seguir decidiendo cada detalle.',
        options: [
            defineOption(
                'Contratar un gerente general y pasar a un rol estratégico.',
                { capital: -15, reputacion: +10, bienestar: +20 },
                {
                    surprise: {
                        effects: { capital: -15, reputacion: +10, bienestar: -10 },
                        outcomeText: 'Contrataste a una gerenta general, pero no encajó con el equipo: terminaste mediando en cada conflicto y descansaste menos que antes, aunque la empresa ganó orden hacia afuera.',
                    },
                    addTags: ['lifestyle_business'],
                    learningPill: 'Delegación Real: Una empresa que no funciona sin el fundador no es un activo, es un empleo con más estrés.',
                    outcomeText: 'Contrataste a una gerenta general y le diste autonomía real. Al principio costó soltar, pero la empresa ahora crece sin depender de tu presencia diaria.',
                }
            ),
            defineOption(
                'Seguir al mando de cada decisión operativa.',
                { capital: +10, reputacion: -5, bienestar: -20 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: -5, bienestar: -20 },
                        outcomeText: 'Mantuviste el control de cada decisión y te volviste el cuello de botella: un contrato grande se cayó esperando tu firma y estás agotado.',
                    },
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
        description: 'Un grupo inversor quiere franquiciar o licenciar tu modelo en todo el país. Escalarías con capital ajeno, pero perderías control sobre la calidad.',
        options: [
            defineOption(
                'Franquiciar o licenciar el modelo y escalar con capital de terceros.',
                { capital: +20, reputacion: -10, bienestar: -5 },
                {
                    surprise: {
                        effects: { capital: -5, reputacion: -10, bienestar: -5 },
                        outcomeText: 'Franquiciaste la marca, pero los primeros franquiciados no llegaron a los números y tuviste que salir a sostenerlos con tu caja, además de lidiar con locales desalineados.',
                    },
                    addTags: ['expansion_global'],
                    learningPill: 'Franquicias: Escalar con capital ajeno acelera la expansión, pero cada local descontrolado erosiona la marca.',
                    outcomeText: 'Franquiciaste la marca y abriste decenas de puntos en tiempo récord. El cobro de regalías engrosó tus ingresos, aunque lidias con quejas por locales desalineados.',
                }
            ),
            defineOption(
                'Mantener operación propia y control total de la calidad.',
                { capital: -10, reputacion: +15, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: -10, reputacion: +15, bienestar: -10 },
                        outcomeText: 'Rechazaste franquiciar para cuidar cada detalle y la reputación de excelencia se mantiene. Pero controlar cada local en persona te hizo vivir arriba del auto.',
                    },
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
                    surprise: {
                        effects: { capital: -10, reputacion: +10, bienestar: -10 },
                        outcomeText: 'Firmaste una alianza exclusiva, pero el aliado no cumplió los volúmenes prometidos y la exclusividad te ató las manos con otros clientes.',
                    },
                    addTags: ['red_contactos'],
                    learningPill: 'Alianzas Comerciales: Un buen socio multiplica tu alcance; la exclusividad define cuánto te cuesta si la relación se enfría.',
                    outcomeText: 'Firmaste una alianza exclusiva con un gigante comercial. Multiplicaste tus canales de venta de inmediato, aunque quedaste atado a sus condiciones contractuales.',
                }
            ),
            defineOption(
                'Rechazar la alianza y competir en todos los frentes.',
                { capital: -10, reputacion: +5, bienestar: +5 },
                {
                    surprise: {
                        effects: { capital: +10, reputacion: +5, bienestar: +5 },
                        outcomeText: 'Decidiste competir por tu cuenta y te fue mejor de lo esperado: ganaste clientes que el aliado nunca iba a atender, y no le debés exclusividad a nadie.',
                    },
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Independencia Estratégica: Competir solo preserva tu libertad de movimiento, pero cada batalla se paga con caja propia.',
                    outcomeText: 'Decidiste competir por tu cuenta en todos los frentes. La tracción requiere esfuerzo propio continuo, pero no le debés explicaciones ni exclusividad a nadie.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f4_reclamo_aumentos',
        phaseId: 4,
        title: 'Se Enteraron del Aumento',
        weight: 20,
        when: {
            tags: ['desigualdad_salarial'],
            playedBefore: ['f3_empleado_clave_se_va'],
        },
        description: 'En el equipo circuló lo que cobra tu persona clave tras la contraoferta. Varios piden revisar sus sueldos y algunos ya miran otras ofertas.',
        options: [
            defineOption(
                'Revisar los sueldos de todo el equipo con criterios claros.',
                { capital: -15, bienestar: +8, reputacion: +6 },
                {
                    removeTags: ['desigualdad_salarial'],
                    learningPill: 'Equidad Interna: Sueldos con criterios transparentes evitan que cada aumento genere un conflicto con el resto.',
                    outcomeText: 'Armaste una escala con criterios claros y ajustaste varios sueldos. Costó plata, pero el clima mejoró mucho.',
                }
            ),
            defineOption(
                'Explicar que fue una excepción por el riesgo de perderla.',
                { bienestar: -10, reputacion: -8 },
                {
                    removeTags: ['desigualdad_salarial'],
                    learningPill: 'Comunicación de Excepciones: Explicar una excepción sin cambiar nada rara vez conforma a quien se siente injustamente tratado.',
                    outcomeText: 'Explicaste tus motivos. Algunos lo entendieron, pero otros sienten que hay reglas distintas para cada uno.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_calidad_dispareja',
        phaseId: 4,
        title: 'La Sede Nueva no Rinde Igual',
        weight: 20,
        when: {
            tags: ['operacion_dispersa'],
            playedBefore: ['f3_expansion_otra_ciudad'],
        },
        description: 'Los clientes de la otra ciudad se quejan: el servicio no es el mismo que en tu sede original. Tu marca ya se asocia a las dos.',
        options: [
            defineOption(
                'Centralizar los procesos y capacitar a la sede nueva.',
                { capital: -12, bienestar: -8, reputacion: +8 },
                {
                    addTags: ['procesos_solidos'],
                    removeTags: ['operacion_dispersa'],
                    learningPill: 'Estandarización: Cuando la operación se reparte, lo que no está escrito y medido se degrada.',
                    outcomeText: 'Llevaste a tu equipo de siempre a capacitar y escribiste los procesos. Ahora las dos sedes funcionan igual.',
                }
            ),
            defineOption(
                'Cerrar la sede nueva y volver a concentrarte en la original.',
                { capital: -15, bienestar: +5, reputacion: -5 },
                {
                    removeTags: ['operacion_dispersa'],
                    learningPill: 'Salir a Tiempo: Cerrar una operación que no rinde duele, pero evita que arrastre a toda la empresa.',
                    outcomeText: 'Cerraste la sede nueva. Perdiste lo invertido, pero volviste a ser una empresa más simple.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_clientes_extranan_humanos',
        phaseId: 4,
        title: 'Nadie Responde a un Humano',
        weight: 20,
        when: {
            tags: ['soporte_automatizado'],
            rubro: ['r1_tecnologia'],
            playedBefore: ['f3_automatizar_soporte'],
        },
        description: 'Los clientes se quejan de que tu soporte automático da vueltas sin resolver y de que nunca consiguen hablar con una persona. Se nota en las bajas.',
        options: [
            defineOption(
                'Volver a sumar personas al soporte para los casos complicados.',
                { capital: -10, bienestar: +3, reputacion: +8 },
                {
                    removeTags: ['soporte_automatizado'],
                    learningPill: 'Servicio al Cliente: Automatizar sin dejar una salida a una persona ahorra costos, pero pierde a quienes más valoran el trato.',
                    outcomeText: 'Reincorporaste personas para los casos difíciles. Costó más, pero las quejas bajaron y los clientes volvieron.',
                }
            ),
            defineOption(
                'Mejorar el sistema automático y seguir sin personas.',
                { capital: -6, bienestar: -5, reputacion: -5 },
                {
                    learningPill: 'Mejora Continua: Un sistema automático puede mejorar, pero mientras tanto los clientes insatisfechos pasan a la competencia.',
                    outcomeText: 'Mejoraste las respuestas y sumaste más opciones, pero los clientes siguen pidiendo hablar con alguien.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_cobro_estatal',
        phaseId: 4,
        title: 'El Estado Paga Tarde',
        weight: 20,
        when: {
            tags: ['contrato_estatal'],
            rubro: ['r3_servicios'],
            playedBefore: ['f3_licitacion_publica'],
        },
        description: 'Cumpliste con el contrato de la licitación, pero el organismo acumula atrasos: ya pasaron más de 200 días desde tu última factura y todavía no cobrás.',
        options: [
            defineOption(
                'Seguir cumpliendo el contrato y esperar el pago.',
                { capital: -15, bienestar: -8, reputacion: +3 },
                {
                    learningPill: 'Riesgo de Cobranza: Financiar a un cliente que no paga convierte tu empresa en su banco.',
                    outcomeText: 'Seguiste trabajando sin cobrar. La caja se vació y tuviste que financiar todo con tu plata.',
                }
            ),
            defineOption(
                'Suspender el servicio hasta que regularicen el pago.',
                { capital: -5, bienestar: -5, reputacion: -10 },
                {
                    removeTags: ['contrato_estatal'],
                    learningPill: 'Poder de Negociación: Frenar el servicio presiona al cliente, pero daña la relación y puede costarte el contrato.',
                    outcomeText: 'Frenaste el servicio y el organismo reclamó. Después de semanas cobraste una parte, pero la relación quedó dañada.',
                }
            ),
            defineOption(
                'Vender las facturas a una financiera con descuento.',
                { capital: -8, bienestar: +3 },
                {
                    removeTags: ['contrato_estatal'],
                    learningPill: 'Factoring: Vender facturas con descuento te da la plata hoy, a cambio de resignar parte de lo que cobrarías.',
                    outcomeText: 'Vendiste tus facturas a una financiera con un descuento importante. Perdiste parte de la ganancia, pero la caja volvió a funcionar.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_denuncia_consumidor',
        phaseId: 4,
        title: 'La Denuncia de un Consumidor',
        weight: 20,
        when: {
            tags: ['falla_oculta'],
            rubro: ['r4_produccion'],
            playedBefore: ['f3_lote_defectuoso'],
        },
        description: 'Un consumidor te denunció porque un producto de aquel lote defectuoso le hizo daño. El tema llegó a un medio local.',
        options: [
            defineOption(
                'Reconocer el problema, indemnizar y retirar lo que quede.',
                { capital: -18, bienestar: -8, reputacion: -10 },
                {
                    removeTags: ['falla_oculta'],
                    learningPill: 'Responsabilidad del Fabricante: Reconocer un defecto y reparar el daño cuesta, pero es mucho menos que defender lo indefendible.',
                    outcomeText: 'Reconociste el problema, indemnizaste y retiraste lo que quedaba. Perdiste plata y prestigio, pero cerraste el caso.',
                }
            ),
            defineOption(
                'Defenderte diciendo que cumplís con todos los controles.',
                { capital: -5, bienestar: -10, reputacion: -25 },
                {
                    removeTags: ['falla_oculta'],
                    learningPill: 'Ocultamiento: Defender lo que sabés que está mal convierte un error de calidad en un escándalo público.',
                    outcomeText: 'Dijiste que cumplías con todo. Después se supo que ya sabías del defecto y tu credibilidad quedó por el piso.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_cansancio_fundador',
        phaseId: 4,
        title: 'Cerrar un Ciclo',
        weight: 10,
        description: 'Pasaron los años, la empresa funciona y mirás para atrás con orgullo. Pero estás cansado y empezás a preguntarte para qué seguís. Hay maneras distintas de cerrar un ciclo.',
        options: [
            defineOption(
                'Venderle la empresa a tu equipo directivo y retirarte.',
                { capital: +25, bienestar: +15, reputacion: +5 },
                {
                    endsGame: true,
                    addTags: ['salida_exitosa_venta'],
                    learningPill: 'Venta a la Gerencia (MBO): Venderle la empresa a quienes mejor la conocen asegura continuidad, aunque suele cerrarse a un precio menor que con un tercero.',
                    outcomeText: 'Le vendiste la empresa a tu equipo directivo, con un plan de pagos a varios años. Te fuiste sabiendo que quedaba en buenas manos, aunque por menos plata que la de un comprador externo.',
                }
            ),
            defineOption(
                'Achicar el ritmo, quedarte con los clientes más rentables y vivir de la empresa.',
                { capital: +15, bienestar: +25 },
                {
                    endsGame: true,
                    addTags: ['lifestyle_business'],
                    learningPill: 'Lifestyle Business: Una empresa más chica que financia tu vida y tu tiempo no es un fracaso: es otro modelo de éxito.',
                    outcomeText: 'Redujiste la empresa a su núcleo más rentable. Ganás menos que antes, pero tu tiempo volvió a ser tuyo y nadie te apura.',
                }
            ),
            defineOption(
                'Seguir adelante: todavía hay mucho por construir.',
                { capital: +5, bienestar: -15, reputacion: +8 },
                {
                    learningPill: 'Costo del Cansancio: Seguir por inercia, sin querer, desgasta a quien conduce y también a la empresa.',
                    outcomeText: 'Decidiste seguir. La empresa crece, pero te levantás con menos ganas cada mañana y lo notás en cada decisión.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_oferta_del_exterior',
        phaseId: 4,
        title: 'Una Oferta del Exterior',
        weight: 10,
        description: 'Una empresa extranjera quiere comprar tu operación y convertirla en su base regional. Te ofrece quedarte al frente, con más recursos y con metas que ya no controlarías.',
        options: [
            defineOption(
                'Aceptar: tu empresa pasa a ser su base para toda la región.',
                { capital: +20, bienestar: -10, reputacion: +15 },
                {
                    endsGame: true,
                    addTags: ['expansion_global'],
                    learningPill: 'Adquisición Estratégica: Ser comprado por una empresa global da recursos y alcance, a cambio de perder el control de las decisiones.',
                    outcomeText: 'Aceptaste la oferta. Tu empresa se volvió el centro de operaciones de una compañía internacional. Tenés más recursos y más alcance, aunque ya no decidís todo.',
                }
            ),
            defineOption(
                'Rechazar y seguir independiente.',
                { capital: -5, bienestar: +5, reputacion: +5 },
                {
                    addTags: ['autonomia_estrategica'],
                    learningPill: 'Independencia: Rechazar una compra a tiempo conserva el control, y también todo el riesgo.',
                    outcomeText: 'Dijiste que no. Tu empresa sigue siendo tuya, con todo lo bueno y lo difícil que eso implica.',
                }
            ),
            defineOption(
                'Proponer una alianza de distribución en lugar de una venta.',
                { capital: +8, bienestar: -5, reputacion: +8 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Alianza Comercial: Una alianza da acceso a nuevos mercados sin entregar el control, aunque el socio tendrá su propia agenda.',
                    outcomeText: 'Armaron un acuerdo para que distribuyan tu producto en la región. Ganás alcance sin vender, y a cambio le debés lealtad a un socio poderoso.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_modernizar_gestion',
        phaseId: 4,
        title: 'La Gestión Quedó Chica',
        weight: 10,
        description: 'La forma en que manejás la empresa (sistemas, planillas y procesos) quedó chica. Los errores se acumulan y cada vez cuesta más entender los números.',
        options: [
            defineOption(
                'Reemplazar todo por un sistema nuevo de gestión.',
                { capital: -20, bienestar: -12, reputacion: +8 },
                {
                    surprise: {
                        effects: { capital: -30, bienestar: -15, reputacion: -10 },
                        outcomeText: 'La migración salió mal: se perdieron datos, hubo errores de facturación y clientes molestos. Tardaste meses en recuperar el orden, y salió bastante más caro de lo previsto.',
                    },
                    addTags: ['procesos_solidos'],
                    learningPill: 'Transformación Digital: Un sistema nuevo ordena la empresa, pero la migración es un proyecto riesgoso que exige tiempo de todo el equipo.',
                    outcomeText: 'Implementaste un sistema nuevo para toda la empresa. Fue un año complicado, pero ahora tenés los números al día.',
                }
            ),
            defineOption(
                'Seguir parchando lo que hay.',
                { capital: -5, bienestar: -8, reputacion: -3 },
                {
                    learningPill: 'Deuda de Procesos: Postergar la modernización parece barato, pero cada parche vuelve más caro el cambio que de todas formas vas a tener que hacer.',
                    outcomeText: 'Sumaste parches y planillas. La empresa funciona, pero depende de la memoria de unas pocas personas.',
                }
            ),
            defineOption(
                'Tercerizar la administración a un estudio especializado.',
                { capital: -10, bienestar: +3 },
                {
                    addTags: ['proveedor_dependiente'],
                    learningPill: 'Tercerización: Un estudio especializado te da orden y experiencia sin armar un área propia, pero te deja dependiente de un tercero.',
                    outcomeText: 'Un estudio se encargó de tus números. La empresa quedó más ordenada y vos con menos preocupaciones administrativas.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_plataforma_abierta',
        phaseId: 4,
        title: 'Abrir tu Producto a Terceros',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Otras empresas te piden poder conectarse a tu producto y construir cosas encima. Abrirlo puede multiplicar tu alcance, pero también tus riesgos y tu soporte.',
        options: [
            defineOption(
                'Abrir una API pública con documentación y soporte.',
                { capital: +8, bienestar: -10, reputacion: +10 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: -10, reputacion: +10 },
                        outcomeText: 'Abriste la API y varios terceros construyeron productos que competían con el tuyo. Ganaste alcance, pero perdiste clientes y gastaste mucho en reordenar tu hoja de ruta.',
                    },
                    addTags: ['red_contactos'],
                    learningPill: 'Efecto Plataforma: Abrir tu producto a terceros genera valor que no podés construir solo, pero exige soporte y control.',
                    outcomeText: 'Abriste una API pública. Otros empezaron a construir sobre tu producto y tu alcance creció, aunque el equipo de soporte se llenó de consultas.',
                }
            ),
            defineOption(
                'Dar acceso solo a unos pocos socios seleccionados.',
                { capital: +6, bienestar: -4, reputacion: +4 },
                {
                    learningPill: 'Ecosistema Controlado: Abrir de a poco y con socios de confianza reduce el riesgo, aunque limita el alcance.',
                    outcomeText: 'Le diste acceso a tres socios. Funciona sin sobresaltos, aunque el alcance es más acotado.',
                }
            ),
            defineOption(
                'Mantener todo cerrado para controlarlo mejor.',
                { bienestar: +3, reputacion: -5 },
                {
                    learningPill: 'Control vs. Alcance: Un producto cerrado es más fácil de manejar, pero deja afuera a quienes querían construir sobre él.',
                    outcomeText: 'Dijiste que no. El equipo siguió enfocado en su producto, y algunas empresas buscaron alternativas más abiertas.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_venta_de_datos',
        phaseId: 4,
        title: 'Vender los Datos de tus Usuarios',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Una red de anunciantes ofrece pagarte bien por los datos de uso de tus usuarios, "anonimizados". Sería el ingreso extra más fácil que podrías conseguir.',
        options: [
            defineOption(
                'Vender los datos anonimizados a los anunciantes.',
                { capital: +20, reputacion: -20 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: -10, reputacion: -25 },
                        outcomeText: 'Se descubrió que los datos no estaban bien anonimizados. Hubo una investigación, una sanción y titulares muy negativos. El ingreso extra costó mucho más de lo que dejó.',
                    },
                    learningPill: 'Privacidad de Datos: Vender datos de usuarios sin su consentimiento transforma tu activo más valioso en un riesgo legal y de confianza.',
                    outcomeText: 'Cerraste el trato y la caja se llenó. Algunos usuarios se enteraron y no se lo tomaron bien.',
                }
            ),
            defineOption(
                'Pedirles permiso a tus usuarios y ofrecer el servicio con su consentimiento.',
                { capital: +8, bienestar: -3, reputacion: +3 },
                {
                    learningPill: 'Consentimiento: Pedir permiso reduce el volumen de datos, pero convierte la monetización en un acuerdo transparente.',
                    outcomeText: 'Les pediste permiso y una parte aceptó. Ganaste menos, pero tu negocio de datos es legal y transparente.',
                }
            ),
            defineOption(
                'No monetizar los datos: tu ventaja es la confianza de tus usuarios.',
                { capital: -5, bienestar: +3, reputacion: +10 },
                {
                    learningPill: 'Confianza como Diferencial: Renunciar a un ingreso fácil puede ser una ventaja competitiva cuando todos los demás venden datos.',
                    outcomeText: 'Dijiste que no y lo comunicaste. Los usuarios valoraron tu postura, aunque el ingreso extra se esfumó.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_linea_propia',
        phaseId: 4,
        title: 'Lanzar tu Propia Línea',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Hace años revendés productos de otras marcas. Un fabricante te propone producir una línea con tu nombre, con mejor margen pero con inversión y riesgo.',
        options: [
            defineOption(
                'Lanzar la línea propia con una compra grande inicial.',
                { capital: -18, bienestar: -8, reputacion: +10 },
                {
                    learningPill: 'Marca Propia: Una línea propia da más margen y diferencia, pero exige capital y asumir el riesgo de inventario que antes tenía otro.',
                    outcomeText: 'Compraste un lote grande de productos con tu marca. Tu comercio ahora tiene identidad propia, y una apuesta importante en el depósito.',
                }
            ),
            defineOption(
                'Probar con un solo producto estrella.',
                { capital: -8, bienestar: -3, reputacion: +5 },
                {
                    surprise: {
                        effects: { capital: +10, bienestar: +5, reputacion: +10 },
                        outcomeText: 'El producto estrella se agotó en semanas y los clientes pidieron más: la prueba se pagó sola y te dio argumentos para negociar mejor con el fabricante.',
                    },
                    learningPill: 'Prueba de Mercado: Lanzar un único producto permite aprender sin comprometer demasiado capital.',
                    outcomeText: 'Lanzaste un producto con tu marca. Se vende bien y te dio información para decidir el próximo paso.',
                }
            ),
            defineOption(
                'Seguir revendiendo: fabricar no es lo tuyo.',
                { capital: +5, bienestar: +3, reputacion: -3 },
                {
                    surprise: {
                        effects: { capital: -8, bienestar: -4, reputacion: -6 },
                        outcomeText: 'Una de las marcas que revendías abrió su propia tienda online con precios más bajos que los tuyos: seguir igual te dejó sin margen.',
                    },
                    learningPill: 'Foco: Quedarte en lo que mejor hacés evita riesgos, aunque renuncies a una parte del margen que otros capturan.',
                    outcomeText: 'Decidiste no meterte en el negocio del fabricante. Seguís vendiendo lo que mejor sabés vender.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_logistica_margen',
        phaseId: 4,
        title: 'La Logística se Come el Margen',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Las ventas online crecieron, pero cada envío cuesta cada vez más y los clientes esperan entregas rápidas y gratis.',
        options: [
            defineOption(
                'Armar tu propia logística con vehículos y depósito.',
                { capital: -18, bienestar: -10, reputacion: +8 },
                {
                    learningPill: 'Logística Propia: Controlar los envíos mejora el servicio, pero convierte tu comercio en una empresa de transporte.',
                    outcomeText: 'Armaste tu propio sistema de entregas. Los clientes están más conformes, pero ahora gestionás vehículos, choferes y rutas.',
                }
            ),
            defineOption(
                'Tercerizar con un operador logístico.',
                { capital: -6, bienestar: +3, reputacion: -3 },
                {
                    learningPill: 'Tercerización Logística: Un operador logístico convierte un costo fijo en uno variable, a cambio de depender de su calidad.',
                    outcomeText: 'Contrataste a un operador que se ocupa de las entregas. Perdiste control, pero ganaste tiempo y previsibilidad.',
                }
            ),
            defineOption(
                'Cobrar el envío a los clientes.',
                { capital: +5, reputacion: -8 },
                {
                    learningPill: 'Traslado de Costos: Cobrar el envío protege tu margen, pero hace que los clientes comparen con quien lo ofrece gratis.',
                    outcomeText: 'Empezaste a cobrar el envío. Tu margen mejoró, pero algunos clientes se fueron a comprar donde es gratis.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_profesional_independiza',
        phaseId: 4,
        title: 'Tu Mejor Profesional Quiere Abrir lo Suyo',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Quien lleva años a tu lado y atiende a tus mejores clientes te avisa que quiere abrir su propio estudio. Los clientes lo conocen a él casi tanto como a vos.',
        options: [
            defineOption(
                'Apoyarlo y volverte su aliado: derivarse clientes mutuamente.',
                { capital: -5, bienestar: +3, reputacion: +8 },
                {
                    addTags: ['red_contactos'],
                    learningPill: 'Alianza con ex Colaboradores: Convertir a quien se va en un aliado conserva la relación y multiplica tus oportunidades.',
                    outcomeText: 'Lo ayudaste a arrancar y acordaron derivarse clientes. Perdiste a un gran profesional, pero ganaste a un socio comercial.',
                }
            ),
            defineOption(
                'Pedirle que firme una cláusula de no competencia antes de irse.',
                { capital: +3, bienestar: -8, reputacion: -5 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: -12, reputacion: -10 },
                        outcomeText: 'La cláusula terminó en una discusión legal: se fue igual, con parte de tus clientes, y los gastos de abogados superaron lo que querías proteger.',
                    },
                    learningPill: 'No Competencia: Una cláusula protege tu cartera, pero tensa la relación y no siempre puede hacerse valer.',
                    outcomeText: 'Firmaron la cláusula y la despedida fue fría. Tus clientes están protegidos, pero el clima quedó tenso.',
                }
            ),
            defineOption(
                'Ofrecerle una sociedad para que desarrolle su propia unidad dentro de la empresa.',
                { capital: -10, bienestar: -3, reputacion: +5 },
                {
                    surprise: {
                        effects: { capital: +8, bienestar: +6, reputacion: +8 },
                        outcomeText: 'La nueva unidad despegó más rápido de lo previsto y a los pocos meses ya aportaba más de lo que habías invertido.',
                    },
                    learningPill: 'Intraemprendimiento: Dar participación y autonomía retiene el talento, a cambio de compartir las decisiones y las ganancias.',
                    outcomeText: 'Le ofreciste una unidad propia con participación en las ganancias. Aceptó, y ahora tenés un socio que antes era un empleado.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_nombre_es_la_empresa',
        phaseId: 4,
        title: 'Tu Nombre es la Empresa',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Los clientes te contratan a vos, no a tu empresa. Si te enfermás o te vas, buena parte del negocio se va con vos.',
        options: [
            defineOption(
                'Construir una marca institucional y un equipo que sostenga la empresa sin vos.',
                { capital: -12, bienestar: -5, reputacion: +10 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Riesgo de Persona Clave: Una empresa que depende de una sola persona vale menos, porque no se puede transferir ni sostener sin ella.',
                    outcomeText: 'Empezaste a mostrar a tu equipo y a tu marca en lugar de a vos. Los clientes empiezan a confiar en la empresa y no solo en tu nombre.',
                }
            ),
            defineOption(
                'Seguir apoyándote en tu nombre: te funciona.',
                { capital: +8, bienestar: -10, reputacion: +5 },
                {
                    learningPill: 'Marca Personal: Tu nombre es un activo potente, pero no se puede vender ni descansar de él.',
                    outcomeText: 'Seguiste con tu nombre al frente. Los clientes confían, pero no podés tomarte ni una semana libre.',
                }
            ),
            defineOption(
                'Vender tu cartera de clientes a una firma más grande y retirarte.',
                { capital: +25, bienestar: +15, reputacion: -5 },
                {
                    endsGame: true,
                    addTags: ['salida_exitosa_venta'],
                    learningPill: 'Venta de Cartera: Venderle tus clientes a una firma mayor te da liquidez y un cierre, a cambio de renunciar a lo que construiste.',
                    outcomeText: 'Le vendiste tu cartera a una firma más grande. Hiciste una transición cuidadosa con tus clientes y te retiraste con un buen cierre.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_exportar',
        phaseId: 4,
        title: 'Una Oportunidad de Exportar',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Un comprador del exterior quiere tu producto. Exportar abre un mercado enorme, pero exige papeles, certificaciones y manejar los riesgos de cambio y de cobro.',
        options: [
            defineOption(
                'Exportar directo, armando tu propia área de comercio exterior.',
                { capital: -20, bienestar: -10, reputacion: +12 },
                {
                    surprise: {
                        effects: { capital: +10, bienestar: -10, reputacion: +12 },
                        outcomeText: 'El primer comprador pagó por adelantado y el tipo de cambio jugó a tu favor. Lo que parecía una inversión enorme se recuperó con el primer envío.',
                    },
                    learningPill: 'Comercio Exterior: Exportar directo da más margen y control, pero exige conocimiento, trámites y asumir los riesgos de cambio y cobranza.',
                    outcomeText: 'Armaste un área de comercio exterior y mandaste tu primer envío. Es mucho trabajo y mucho riesgo, pero tu producto ya está en otro país.',
                }
            ),
            defineOption(
                'Vender a través de un intermediario o una comercializadora.',
                { capital: +8, bienestar: -3, reputacion: +3 },
                {
                    learningPill: 'Intermediarios: Un intermediario simplifica los trámites y el riesgo, a cambio de quedarse con parte del margen.',
                    outcomeText: 'Una comercializadora se encargó de los trámites y del cobro. Ganaste menos por unidad, pero sin complicaciones.',
                }
            ),
            defineOption(
                'No exportar: concentrarte en el mercado local.',
                { bienestar: +5, reputacion: -3 },
                {
                    learningPill: 'Foco Local: Quedarte en tu mercado reduce riesgos, aunque dejás pasar una oportunidad de crecer.',
                    outcomeText: 'Decidiste no meterte en exportaciones. El negocio sigue estable y simple, con una oportunidad menos.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_automatizar_planta',
        phaseId: 4,
        title: 'Automatizar la Línea de Producción',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Una máquina nueva podría hacer el trabajo de varias personas de tu planta, más rápido y con menos errores. Es una inversión grande y un cambio que afecta a todo el equipo.',
        options: [
            defineOption(
                'Automatizar y reducir el personal de planta.',
                { capital: +15, bienestar: -10, reputacion: -10 },
                {
                    surprise: {
                        effects: { capital: -10, bienestar: -10, reputacion: -10 },
                        outcomeText: 'La máquina tuvo fallas durante meses y tuviste que pagar horas extras para sostener la producción mientras ya habías reducido el equipo. Terminaste pagando más y con menos gente.',
                    },
                    learningPill: 'Automatización: Automatizar baja el costo y los errores, pero tiene un costo humano que también impacta en el clima y la marca.',
                    outcomeText: 'Instalaste la máquina y reduciste el personal. La eficiencia subió, pero el equipo que quedó trabaja con miedo.',
                }
            ),
            defineOption(
                'Automatizar y reubicar a tu equipo en tareas nuevas, capacitándolo.',
                { capital: -12, bienestar: +5, reputacion: +8 },
                {
                    learningPill: 'Capacitación: Reubicar y capacitar cuesta más hoy, pero conserva el conocimiento del equipo y su compromiso.',
                    outcomeText: 'Capacitaste a tu equipo para operar y mantener las máquinas. Costó más tiempo y plata, pero conservaste a tu gente.',
                }
            ),
            defineOption(
                'No automatizar: la producción artesanal es tu marca.',
                { capital: -5, bienestar: -5, reputacion: +5 },
                {
                    learningPill: 'Valor Artesanal: Producir a mano puede ser un diferencial, siempre que los clientes paguen por eso.',
                    outcomeText: 'Decidiste mantener el proceso artesanal. Es más lento y más caro, pero lo que los clientes compran es eso.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f4_proveedor_quiebra',
        phaseId: 4,
        title: 'Tu Proveedor Entra en Quiebra',
        weight: 20,
        when: {
            tags: ['proveedor_dependiente'],
            playedBefore: ['f2_proveedor_critico'],
        },
        description: 'El proveedor al que le comprabas casi todo entró en convocatoria de acreedores y dejó de entregar. Tenés poco stock y clientes esperando.',
        options: [
            defineOption(
                'Comprar urgente a proveedores alternativos, aunque pagues más.',
                { capital: -18, bienestar: -8 },
                {
                    addTags: ['proveedores_diversificados'],
                    removeTags: ['proveedor_dependiente'],
                    learningPill: 'Diversificación Tardía: Armar una red de proveedores en plena crisis sale mucho más caro que haberlo hecho cuando todo andaba bien.',
                    outcomeText: 'Conseguiste otros proveedores a las corridas, a precios más altos. Cumpliste con los clientes, pero a un costo importante.',
                }
            ),
            defineOption(
                'Pausar los pedidos y esperar a ver cómo se resuelve.',
                { capital: -5, bienestar: -5, reputacion: -20 },
                {
                    removeTags: ['proveedor_dependiente'],
                    learningPill: 'Riesgo de Concentración: Depender de un único proveedor te deja sin opciones cuando falla.',
                    outcomeText: 'Esperaste. Los clientes no pudieron esperar y varios compraron en otro lado.',
                }
            ),
        ]
    }),
]