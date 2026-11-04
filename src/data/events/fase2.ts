import { defineEvent, defineOption } from "./builders";

export const fase2Events = [
    defineEvent({
        id: 'f2_crisis_cobro',
        phaseId: 2,
        title: 'El Gran Cliente Demora el Pago',
        weight: 25,
        when: {
            tags: ['cliente_dependencia']
        },
        description: 'Tu cliente corporativo postergó su liquidación 45 días más. {nombre}, no alcanzás a cubrir los costos fijos del mes.',
        options: [
            defineOption(
                'Tomar un crédito rápido a tasa usurera.',
                { capital: +15, bienestar: -20 },
                {
                    addTags: ['deuda_riesgosa'],
                    learningPill: 'Apalancamiento Tóxico: Endeudarse caro para cubrir costos corrientes suele iniciar una espiral de insolvencia.',
                    outcomeText: 'Obtuviste liquidez al instante con un préstamo usurero. Pudiste pagar sueldos hoy, pero las cuotas de intereses se devoran la ganancia de los próximos meses.',
                }
            ),
            defineOption(
                'Renegociar plazos con proveedores y congelar retiros propios.',
                { capital: -5, reputacion: -25, bienestar: -15 },
                {
                    learningPill: 'Gestión de Liquidez: En momentos de estrés de caja, la transparencia con la cadena comercial evita la quiebra.',
                    outcomeText: 'Hablaste cara a cara con tus proveedores y acordaron un cronograma de pago. La reputación sufrió un rasguño, pero evitaste la trampa de la deuda financiera.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_proveedor_critico',
        phaseId: 2,
        title: 'El Dilema de Abastecimiento',
        weight: 10,
        description: 'Podés comprarle casi todo a un único proveedor del exterior a mitad de precio, o mantener varios proveedores locales más caros.',
        options: [
            defineOption(
                'Comprarle todo al proveedor único para maximizar margen.',
                { capital: +20, reputacion: -10 },
                {
                    addTags: ['proveedor_dependiente'],
                    learningPill: 'Riesgo de Cadena de Suministro: Optimizar solo por costo te vuelve vulnerable a aduanas y devaluaciones.',
                    outcomeText: 'Concentraste el 100% de tus compras en el proveedor más barato. Tus márgenes son récord, pero si una entrega se frena, tu operación se paraliza por completo.',
                }
            ),
            defineOption(
                'Mantener la red local diversificada.',
                { capital: -10, reputacion: +10, bienestar: +5 },
                {
                    addTags: ['proveedores_diversificados'],
                    learningPill: 'Resiliencia Operativa: Pagar una prima por proveedores confiables es una póliza de seguro contra crisis.',
                    outcomeText: 'Mantuviste proveedores locales diversificados. Tu margen es algo más ajustado, pero nunca te quedás sin stock ni dependés de los vaivenes de una sola frontera.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_sobrecarga_equipo',
        phaseId: 2,
        title: 'Pico de Demanda y Cuello de Botella',
        weight: 10,
        description: 'Las ventas crecieron un 60%, pero el equipo no da abasto. Hay quejas de clientes por demoras.',
        options: [
            defineOption(
                'Exigir horas extras y redoblar el esfuerzo sin sumar gente.',
                { capital: +15, reputacion: -25, bienestar: -25 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Deuda Operativa: Forzar la capacidad instalada genera fallas de calidad y rotación no deseada de talento.',
                    outcomeText: 'Exprimiste al equipo con horas extras para despachar los pedidos. Facturaste más, pero el cansancio provocó errores en entregas y el clima interno quedó muy tenso.',
                }
            ),
            defineOption(
                'Frenar nuevas ventas y contratar ayuda de inmediato.',
                { capital: -20, reputacion: +15, bienestar: +10 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Crecimiento Sostenible: Escalar antes de estabilizar las operaciones suele romper el negocio.',
                    outcomeText: 'Frenaste la captación de nuevos clientes para estabilizar las entregas y contrataste refuerzos. Menos caja inmediata, pero clientes conformes y equipo protegido.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_primera_contratacion',
        phaseId: 2,
        title: 'La Primera Contratación Clave',
        weight: 10,
        milestone: true,
        description: 'La demanda supera lo que podés sostener solo, {nombre}. Necesitás sumar a alguien fuerte al equipo, pero cada perfil implica una apuesta distinta.',
        options: [
            defineOption(
                'Contratar un perfil senior caro que ordene la operación desde el día uno.',
                { capital: -15, reputacion: +10, bienestar: +5 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Contratación Clave: Un senior caro que resuelve de inmediato suele salir más barato que meses de improvisación.',
                    outcomeText: 'Sumaste a un profesional experimentado. Aunque su salario pesa en la nómina, estructuró procesos clave y te liberó 15 horas semanales de micro-gestión.',
                }
            ),
            defineOption(
                'Apostar por talento junior con potencial y formarlo mientras operás.',
                { capital: +10, reputacion: -15, bienestar: -10 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de Formación: Formar talento interno es barato en dinero pero caro en tiempo y energía del fundador.',
                    outcomeText: 'Contrataste a un perfil junior con ganas. El costo es bajo, pero pasás la mitad del día supervisándolo y corrigiendo errores normales de la inexperiencia.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_anfitrion_pregunta',
        phaseId: 2,
        title: 'Una Pregunta Incómoda',
        weight: 20,
        when: {
            tags: ['secreto_ajeno'],
            playedBefore: ['f1_visita_empresa'],
        },
        description: 'La empresa que visitaste está haciendo una auditoría interna. El gerente te escribe: "Cuando estuviste en la oficina, ¿pudiste ver algo de la computadora que quedó abierta?".',
        options: [
            defineOption(
                'Contar lo que viste y pedir disculpas.',
                { capital: -5, bienestar: +10, reputacion: -5 },
                {
                    removeTags: ['secreto_ajeno'],
                    learningPill: 'Responsabilidad: Reconocer un error a tiempo duele, pero lo achica; esconderlo lo deja crecer.',
                    outcomeText: 'El gerente valoró la honestidad, aunque la relación se enfrió. Te sacaste un peso de encima.',
                }
            ),
            defineOption(
                'Negar todo y decir que no viste nada.',
                { bienestar: -8 },
                {
                    learningPill: 'Mentira Comprobable: Negar algo que otros pueden comprobar es apostar tu reputación a que nadie lo descubra.',
                    outcomeText: 'El gerente no insistió. El tema quedó ahí, por ahora.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_reclamo_familiar',
        phaseId: 2,
        title: 'La Familia Necesita la Plata',
        weight: 20,
        when: {
            tags: ['deuda_familiar'],
            playedBefore: ['f1_prestamo_familiar'],
        },
        description: 'Un familiar que te prestó plata tiene una urgencia y necesita que se la devuelvas este año. Nunca se firmó nada.',
        options: [
            defineOption(
                'Devolver todo ahora, aunque la caja quede justa.',
                { capital: -20, bienestar: +5 },
                {
                    removeTags: ['deuda_familiar'],
                    learningPill: 'Deuda sin Contrato: Sin plazos escritos, la devolución depende de las urgencias del otro, no de tu flujo de caja.',
                    outcomeText: 'Devolviste todo y la relación quedó bien. La empresa siente el golpe.',
                }
            ),
            defineOption(
                'Proponer devolverla en cuotas a lo largo del año.',
                { capital: -8, bienestar: -10 },
                {
                    removeTags: ['deuda_familiar'],
                    learningPill: 'Reestructurar una Deuda: Un plan de pagos alivia la caja, pero cuando el acreedor es la familia, también tensa el vínculo.',
                    outcomeText: 'Aceptaron las cuotas, aunque no les gustó. Las reuniones familiares están más tensas.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cliente_exige_factura',
        phaseId: 2,
        title: 'El Cliente que Pide Factura',
        weight: 20,
        when: {
            tags: ['informalidad'],
            playedBefore: ['f1_sin_factura'],
        },
        description: 'Una empresa grande quiere contratarte por un monto importante, pero solo paga con factura y te pide tu constancia de inscripción.',
        options: [
            defineOption(
                'Inscribirte ahora y facturar desde hoy.',
                { capital: -8, bienestar: -5, reputacion: +10 },
                {
                    removeTags: ['informalidad'],
                    learningPill: 'Formalizarse a Tiempo: Regularizarse cuando aparece la oportunidad cuesta trámites, pero abre el mercado de las empresas.',
                    outcomeText: 'Hiciste los trámites a las corridas y cerraste el contrato. Ya no tenés que esconder nada.',
                }
            ),
            defineOption(
                'Rechazar el contrato y seguir como estás.',
                { capital: -5, reputacion: -5 },
                {
                    learningPill: 'Costo de la Informalidad: Lo que ahorrás en impuestos lo perdés en los clientes a los que no les podés vender.',
                    outcomeText: 'La empresa contrató a otro. Seguís sin facturar y con un techo claro para crecer.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cumplir_preventa',
        phaseId: 2,
        title: 'Lo que Prometiste',
        weight: 20,
        when: {
            tags: ['promesas_pendientes'],
            rubro: ['r1_tecnologia'],
            playedBefore: ['f1_demanda_antes_que_codigo'],
        },
        description: 'Pasó el plazo de la preventa y los clientes preguntan por su producto. Todavía faltan funciones que dijiste que ya estaban.',
        options: [
            defineOption(
                'Trabajar a contrarreloj, fines de semana incluidos, para cumplir.',
                { bienestar: -15, reputacion: +8 },
                {
                    removeTags: ['promesas_pendientes'],
                    learningPill: 'Compromiso de Entrega: Cumplir lo prometido construye confianza, aunque el costo lo pague tu descanso.',
                    outcomeText: 'Entregaste todo lo prometido, agotado pero a tiempo. Los primeros clientes ya te recomiendan.',
                }
            ),
            defineOption(
                'Devolverle la plata a quien la pida y reordenar el plan.',
                { capital: -12, bienestar: +3, reputacion: -5 },
                {
                    removeTags: ['promesas_pendientes'],
                    learningPill: 'Reembolso: Devolver el dinero a tiempo limita el daño reputacional de una promesa que no podés cumplir.',
                    outcomeText: 'Algunos pidieron la devolución y otros decidieron esperar. Perdiste caja, pero el plan ahora es realista.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_creditos_agotados',
        phaseId: 2,
        title: 'Se Terminaron los Créditos',
        weight: 20,
        when: {
            tags: ['proveedor_dependiente'],
            rubro: ['r1_tecnologia'],
            playedBefore: ['f1_creditos_nube'],
        },
        description: 'Se acabaron los créditos gratis de la nube y la factura mensual se multiplicó. Migrar a otro proveedor tomaría semanas de trabajo.',
        options: [
            defineOption(
                'Pagar la factura y negociar un descuento por volumen.',
                { capital: -15 },
                {
                    learningPill: 'Lock-in: Cuando cambiar es caro, el proveedor tiene el poder de fijar el precio.',
                    outcomeText: 'Conseguiste un descuento chico. La nube ya es uno de tus gastos más grandes.',
                }
            ),
            defineOption(
                'Frenar todo y migrar a otro proveedor.',
                { capital: -8, bienestar: -12, reputacion: -3 },
                {
                    removeTags: ['proveedor_dependiente'],
                    learningPill: 'Costo de Migración: Cambiar de proveedor libera costos a futuro, pero frena el producto mientras dura la mudanza.',
                    outcomeText: 'Fueron semanas duras y hubo algunas caídas, pero ya no dependés de un solo proveedor.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_stock_dormido',
        phaseId: 2,
        title: 'Mercadería que No Rota',
        weight: 20,
        when: {
            tags: ['stock_inmovilizado'],
            rubro: ['r2_comercio'],
            playedBefore: ['f1_vender_sin_stock'],
        },
        description: 'Parte del lote que compraste no se vende: ocupa lugar en el depósito y la plata sigue ahí parada.',
        options: [
            defineOption(
                'Liquidar con descuentos fuertes.',
                { capital: +8, reputacion: -5 },
                {
                    removeTags: ['stock_inmovilizado'],
                    learningPill: 'Rotación de Stock: Vender con pérdida libera caja; guardar mercadería que no rota la sigue desvalorizando.',
                    outcomeText: 'Recuperaste parte de la plata y liberaste el depósito. Algunos clientes ahora esperan descuentos.',
                }
            ),
            defineOption(
                'Guardarla y esperar la próxima temporada.',
                { capital: -5, bienestar: -3 },
                {
                    learningPill: 'Costo de Almacenamiento: Guardar stock también cuesta: lugar, tiempo y el riesgo de que pase de moda.',
                    outcomeText: 'Guardaste todo y seguís pagando el espacio. Tal vez el año que viene se venda.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_aumento_alquiler',
        phaseId: 2,
        title: 'El Alquiler se Dispara',
        weight: 20,
        when: {
            tags: ['alquiler_comprometido'],
            rubro: ['r2_comercio'],
            playedBefore: ['f1_donde_vender'],
        },
        description: 'El contrato del local se ajusta por inflación y el aumento supera lo que crecieron tus ventas. El dueño no acepta renegociar.',
        options: [
            defineOption(
                'Pagar el aumento y recortar otros gastos.',
                { capital: -10, bienestar: -8 },
                {
                    learningPill: 'Costos Fijos Indexados: Un costo que se ajusta solo, mientras tus precios no, se come el margen año tras año.',
                    outcomeText: 'Seguís en el local, pero recortaste en todo lo demás para pagarlo.',
                }
            ),
            defineOption(
                'Rescindir el contrato, pagar la penalidad y pasarte a algo más chico.',
                { capital: -15, bienestar: +3, reputacion: -5 },
                {
                    removeTags: ['alquiler_comprometido'],
                    learningPill: 'Salir de un Contrato: Pagar para cortar un costo fijo a tiempo puede salir más barato que sostenerlo.',
                    outcomeText: 'Pagaste la penalidad y te mudaste a un lugar más chico. Algunos clientes tardaron en encontrarte.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cliente_pide_mas',
        phaseId: 2,
        title: '"Es Solo un Detalle"',
        weight: 20,
        when: {
            tags: ['promesas_pendientes'],
            rubro: ['r3_servicios'],
            playedBefore: ['f1_cobrar_hora_o_proyecto'],
        },
        description: 'El cliente del precio cerrado te pide cambios todas las semanas. Ya trabajaste el doble de horas de lo que presupuestaste.',
        options: [
            defineOption(
                'Cobrar los cambios como trabajo adicional.',
                { capital: +10, bienestar: -3, reputacion: -5 },
                {
                    removeTags: ['promesas_pendientes'],
                    learningPill: 'Control de Alcance: Poner por escrito qué incluye un precio cerrado es lo que te permite cobrar el resto.',
                    outcomeText: 'Al cliente no le gustó, pero aceptó pagar los cambios. Desde ahora, cada pedido nuevo tiene precio.',
                }
            ),
            defineOption(
                'Absorber los cambios para no perder al cliente.',
                { capital: -8, bienestar: -12, reputacion: +5 },
                {
                    removeTags: ['promesas_pendientes'],
                    learningPill: 'Scope Creep: Aceptar cambios sin cobrarlos convierte un buen proyecto en uno que pierde plata.',
                    outcomeText: 'El cliente quedó encantado. Vos trabajaste el doble por la misma plata.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cliente_pide_descuento',
        phaseId: 2,
        title: '"Si a Ellos les Hiciste Gratis..."',
        weight: 20,
        when: {
            tags: ['precio_devaluado'],
            rubro: ['r3_servicios'],
            playedBefore: ['f1_gratis_por_exposicion'],
        },
        description: 'Un cliente nuevo se enteró de que trabajaste gratis para una marca conocida y te pide un descuento fuerte.',
        options: [
            defineOption(
                'Hacer el descuento para no perderlo.',
                { capital: -8, bienestar: -5, reputacion: +3 },
                {
                    learningPill: 'Anclaje de Precio: El primer precio que muestra el mercado se vuelve la referencia de todos los que siguen.',
                    outcomeText: 'Cerraste el trabajo, otra vez por debajo de lo que vale.',
                }
            ),
            defineOption(
                'Mantener tu precio y mostrar lo que hiciste.',
                { capital: +3, bienestar: +3, reputacion: -6 },
                {
                    removeTags: ['precio_devaluado'],
                    learningPill: 'Defender el Precio: Sostener tu tarifa con resultados concretos educa al cliente sobre lo que vale tu trabajo.',
                    outcomeText: 'El cliente dudó, pero aceptó tu precio. Ese trabajo gratis ya no te define.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_clausura_preventiva',
        phaseId: 2,
        title: 'La Inspección',
        weight: 20,
        when: {
            tags: ['sin_habilitacion'],
            rubro: ['r4_produccion'],
            playedBefore: ['f1_habilitacion'],
        },
        description: 'Inspectores municipales detectan que producís sin habilitación y suspenden la producción hasta que regularices.',
        options: [
            defineOption(
                'Frenar la producción y tramitar la habilitación completa.',
                { capital: -18, bienestar: -5, reputacion: +3 },
                {
                    removeTags: ['sin_habilitacion'],
                    learningPill: 'Regularizarse: Ponerse en regla después de una inspección cuesta más que haberlo hecho desde el principio.',
                    outcomeText: 'Estuviste semanas sin producir, pero ahora tenés todos los papeles en regla.',
                }
            ),
            defineOption(
                'Alquilar por horas una planta habilitada mientras tramitás.',
                { capital: -12, bienestar: -8 },
                {
                    removeTags: ['sin_habilitacion'],
                    learningPill: 'Plan de Contingencia: Tercerizar la producción mantiene las ventas, a costa de margen y de mucha coordinación.',
                    outcomeText: 'Seguiste vendiendo con producción alquilada. Fueron meses de corridas, pero no perdiste clientes.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_insumos_vencidos',
        phaseId: 2,
        title: 'Insumos por Vencer',
        weight: 20,
        when: {
            tags: ['stock_inmovilizado'],
            rubro: ['r4_produccion'],
            playedBefore: ['f1_pedido_minimo'],
        },
        description: 'Parte de los insumos que compraste en volumen se acerca a su vencimiento y tu producción no llega a usarlos.',
        options: [
            defineOption(
                'Producir de más con una oferta para usarlos a tiempo.',
                { capital: +5, bienestar: -10, reputacion: -3 },
                {
                    removeTags: ['stock_inmovilizado'],
                    learningPill: 'Gestión de Inventario: Producir para no perder insumos sirve si después podés vender lo que fabricaste.',
                    outcomeText: 'Hiciste horas extra y salió una oferta que se vendió bien. Por un tiempo, tu precio quedó asociado a la promo.',
                }
            ),
            defineOption(
                'Descartar lo vencido y absorber la pérdida.',
                { capital: -12 },
                {
                    removeTags: ['stock_inmovilizado'],
                    learningPill: 'Costo Hundido: Lo que ya se gastó no vuelve; seguir decidiendo por eso solo agranda la pérdida.',
                    outcomeText: 'Tiraste lo que no llegaste a usar. Dolió, pero ahora comprás según lo que producís.',
                }
            ),
        ]
    }),
]