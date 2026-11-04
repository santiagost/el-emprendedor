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

    defineEvent({
        id: 'f2_aumentar_precios',
        phaseId: 2,
        title: 'Los Costos Subieron',
        weight: 10,
        description: 'Tus proveedores aumentaron sus precios varias veces este año y tu margen se achicó. Subir los precios puede espantar clientes; no subirlos te deja trabajando casi sin ganancia.',
        options: [
            defineOption(
                'Subir todos los precios de golpe y avisar con una semana de anticipación.',
                { capital: +12, bienestar: -3, reputacion: -10 },
                {
                    learningPill: 'Poder de Fijación de Precios: Subir de golpe recupera el margen rápido, pero pone a prueba cuánto valoran tu producto tus clientes.',
                    outcomeText: 'Recuperaste margen enseguida. Algunos clientes se quejaron y un par se fue, pero la mayoría se quedó.',
                }
            ),
            defineOption(
                'Subir de a poco y explicarle a cada cliente el porqué.',
                { capital: +6, bienestar: -6, reputacion: +3 },
                {
                    learningPill: 'Comunicación de Precios: Explicar un aumento da trabajo, pero reduce el rechazo y fortalece la relación con el cliente.',
                    outcomeText: 'Hablaste con tus clientes uno por uno. Fue lento y cansador, pero casi nadie se fue.',
                }
            ),
            defineOption(
                'Mantener los precios para no perder clientes.',
                { capital: -10, bienestar: -3, reputacion: +6 },
                {
                    addTags: ['margen_ajustado'],
                    scheduledEvent: { eventId: 'f3_costos_se_comen_margen', delayTurns: 3 },
                    learningPill: 'Erosión del Margen: Sostener precios mientras suben tus costos regala margen: vendés lo mismo, pero ganás menos por cada venta.',
                    outcomeText: 'Nadie se quejó y seguiste vendiendo igual, pero cada venta te deja menos ganancia que antes.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_contratar_amigo',
        phaseId: 2,
        title: 'Un Amigo Quiere Trabajar con Vos',
        weight: 10,
        description: 'Un amigo de toda la vida está sin trabajo y te pide sumarse a tu equipo. No tiene la experiencia ideal, pero lo conocés y confiás en él.',
        options: [
            defineOption(
                'Contratarlo ya, sin entrevista ni período de prueba.',
                { capital: -8, bienestar: +8 },
                {
                    addTags: ['contratacion_por_afecto'],
                    scheduledEvent: { eventId: 'f3_amigo_rinde_poco', delayTurns: 2 },
                    learningPill: 'Contratar por Afecto: Contratar sin proceso mezcla amistad y trabajo; cuando hay que corregir o despedir, se complican las dos relaciones.',
                    outcomeText: 'Tu amigo se sumó con muchas ganas y el clima mejoró. Pero nadie definió qué se espera de su trabajo.',
                }
            ),
            defineOption(
                'Hacerle el mismo proceso de selección que a cualquier candidato.',
                { capital: -5, bienestar: -3, reputacion: +5 },
                {
                    learningPill: 'Proceso de Selección: Evaluar a todos con el mismo criterio protege el trabajo y la amistad: si entra, entra por mérito.',
                    outcomeText: 'Hizo el proceso y lo hizo bien. Entró, y en el equipo todos saben que no fue un favor.',
                }
            ),
            defineOption(
                'Explicarle que por ahora no hay lugar y ayudarlo a buscar en otro lado.',
                { bienestar: -5 },
                {
                    learningPill: 'Límites Claros: Decir que no a un amigo es incómodo, pero evita mezclar un vínculo personal con una relación de jefe y empleado.',
                    outcomeText: 'Fue una charla incómoda. Tu amigo lo entendió, aunque tardó en volver a escribirte.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cuotas_sin_interes',
        phaseId: 2,
        title: 'Cuotas sin Interés',
        weight: 10,
        description: 'Tus clientes piden pagar en cuotas con tarjeta. Si las ofrecés sin interés vendés más, pero la plata te llega meses después y la tarjeta te cobra una comisión.',
        options: [
            defineOption(
                'Ofrecer 6 cuotas sin interés y absorber el costo financiero.',
                { capital: -10, reputacion: +10 },
                {
                    learningPill: 'Costo Financiero: Vender en cuotas sin interés sube las ventas, pero cobrás más tarde y la comisión la pagás vos.',
                    outcomeText: 'Las ventas subieron bastante. La plata entra más tarde y parte se va en comisiones, así que en la caja casi no se nota.',
                }
            ),
            defineOption(
                'Ofrecer cuotas con recargo para cubrir el costo.',
                { capital: +6, reputacion: -5 },
                {
                    learningPill: 'Traslado de Costos: Cobrar el financiamiento protege tu margen, pero vendés menos porque el cliente compara con quien lo ofrece gratis.',
                    outcomeText: 'Cubriste el costo, pero varios clientes se fueron a comprar donde las cuotas no tenían recargo.',
                }
            ),
            defineOption(
                'Vender solo al contado o con débito, con un descuento por pagar así.',
                { capital: +8, bienestar: +3, reputacion: -3 },
                {
                    learningPill: 'Liquidez: Cobrar al instante mejora tu caja, aunque perdés a los clientes que necesitan financiar la compra.',
                    outcomeText: 'Cobrás al momento y la caja respira. Algunos clientes no pudieron comprar sin cuotas.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_necesidad_capital',
        phaseId: 2,
        title: 'La Caja se Queda Corta',
        weight: 10,
        description: 'Las ventas crecen, pero cobrás a 60 días y pagás a tus proveedores a 30. Para seguir creciendo necesitás plata ahora.',
        options: [
            defineOption(
                'Descontar cheques y pedir adelantos en cuenta corriente.',
                { capital: +15, bienestar: -8 },
                {
                    addTags: ['deuda_riesgosa'],
                    scheduledEvent: { eventId: 'f3_cuota_prestamo', delayTurns: 3 },
                    learningPill: 'Costo del Dinero: El crédito rápido sirve para un apuro, pero con tasas altas se vuelve un costo fijo que se come el crecimiento.',
                    outcomeText: 'Conseguiste la plata en el día. Pero las tasas son altas y los intereses empezaron a pesar en cada balance.',
                }
            ),
            defineOption(
                'Pedir un préstamo para pymes con tasa más baja, aunque tarde y exija papeles.',
                { capital: +10, bienestar: -8, reputacion: +5 },
                {
                    learningPill: 'Financiamiento Formal: Los créditos para pymes son más baratos, pero exigen balances, garantías y paciencia.',
                    outcomeText: 'Tardaste semanas en reunir los papeles, pero conseguiste una tasa razonable. Mostrar tus números también ordenó tu empresa.',
                }
            ),
            defineOption(
                'Negociar con tus proveedores pagarles a 60 días.',
                { capital: +5, bienestar: -3, reputacion: -8 },
                {
                    learningPill: 'Capital de Trabajo: Alargar los pagos a proveedores financia la operación sin intereses, a costa de la relación con ellos.',
                    outcomeText: 'Algunos proveedores aceptaron y otros te pidieron pago adelantado. Ganaste aire, pero cambió cómo te ven.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_cliente_corporativo_pide',
        phaseId: 2,
        title: 'El Cliente Grande Pide su Propia Versión',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Una empresa grande quiere contratar tu producto, pero solo si le agregás funciones a medida. Es el contrato más grande que viste y le dedicarías a eso casi todo el equipo.',
        options: [
            defineOption(
                'Aceptar y construir todo lo que pida.',
                { capital: +20, bienestar: -10, reputacion: +5 },
                {
                    addTags: ['cliente_dependencia'],
                    scheduledEvent: { eventId: 'f3_cliente_corporativo_renegocia', delayTurns: 3 },
                    learningPill: 'Trampa de la Consultora: Construirle un producto a un solo cliente te da ingresos hoy y te saca del rumbo de tu propio producto.',
                    outcomeText: 'Firmaste el contrato más grande hasta ahora. Tu equipo trabaja casi solo para ese cliente y tu producto no avanza.',
                }
            ),
            defineOption(
                'Aceptar solo lo que también le sirva al resto de tus clientes.',
                { capital: +8, bienestar: -3, reputacion: +3 },
                {
                    learningPill: 'Hoja de Ruta: Priorizar lo que sirve a muchos clientes mantiene coherente tu producto y enfocado a tu equipo.',
                    outcomeText: 'El cliente aceptó una parte y se llevó mejoras que también usan los demás. El contrato es más chico, pero el producto avanza.',
                }
            ),
            defineOption(
                'Cobrar las funciones a medida como un servicio aparte.',
                { capital: +12, bienestar: -8 },
                {
                    learningPill: 'Servicios Profesionales: Cobrar la personalización por separado financia el desarrollo sin atar el producto a un solo cliente.',
                    outcomeText: 'Armaste un servicio aparte con otro equipo y otro precio. Da más trabajo, pero ese ingreso extra no frena tu producto.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_falla_seguridad',
        phaseId: 2,
        title: 'Una Falla de Seguridad',
        weight: 10,
        when: {
            rubro: ['r1_tecnologia'],
        },
        description: 'Un usuario te escribe en privado: encontró una falla que permite ver datos de otros clientes. Que vos sepas, nadie la usó todavía de forma maliciosa.',
        options: [
            defineOption(
                'Corregirla en silencio, sin avisarle a nadie.',
                { capital: -3, bienestar: -5 },
                {
                    learningPill: 'Divulgación Responsable: Corregir sin avisar resuelve el problema técnico, pero si alguien ya accedió a los datos, los usuarios tienen derecho a saberlo.',
                    outcomeText: 'Pasaste unos días corrigiendo y la falla quedó cerrada. Nadie se enteró, y vos tampoco sabés si alguien llegó a verla.',
                }
            ),
            defineOption(
                'Corregirla y avisarles a todos los usuarios con un comunicado.',
                { capital: -8, bienestar: -8, reputacion: +8 },
                {
                    learningPill: 'Transparencia: Avisar de una falla a tiempo cuesta reputación en el corto plazo y construye confianza para el largo.',
                    outcomeText: 'Algunos usuarios se preocuparon, pero la mayoría valoró que se lo contaras antes de que lo supieran por otro lado.',
                }
            ),
            defineOption(
                'Dejarla para después: tenés otras prioridades.',
                { capital: +3, bienestar: +3 },
                {
                    addTags: ['falla_oculta'],
                    learningPill: 'Deuda de Seguridad: Postergar una falla de seguridad no la elimina; la deja esperando el peor momento.',
                    outcomeText: 'Seguiste con tu plan como si nada. La falla sigue ahí, y alguien más podría encontrarla.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_hot_sale',
        phaseId: 2,
        title: 'El Evento de Descuentos',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'Se acerca un evento de descuentos online y todos los comercios se preparan. Las ventas pueden multiplicarse en pocos días, pero también el riesgo de comprar de más o de no dar abasto.',
        options: [
            defineOption(
                'Comprar stock de más y bajar los precios fuerte.',
                { capital: +18, bienestar: -8, reputacion: +5 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: 0.12,
                        title: 'Gran promoción',
                        rule: 'Apostaste fuerte: la ruleta decide si la demanda estuvo a la altura del stock que compraste.',
                        outcomeTextByPerformance: {
                            perfect: 'La promo explotó: vendiste casi todo el stock en pocos días y sumaste clientes nuevos.',
                            poor: 'La demanda no estuvo a la altura del stock: te quedó mucha mercadería y tuviste que rebajar todavía más.',
                        },
                    },
                    learningPill: 'Riesgo de Inventario: Apostar fuerte puede multiplicar las ventas, pero si la demanda no llega, el stock se vuelve un costo.',
                    outcomeText: 'Armaste una promo agresiva con mucho stock. Salió lo que tenía que salir y quedaste con otra imagen de tu comercio.',
                }
            ),
            defineOption(
                'Participar con tu stock normal y tres productos gancho a buen precio.',
                { capital: +10, bienestar: -3, reputacion: +4 },
                {
                    minigame: {
                        kind: 'roulette',
                        title: 'Promoción medida',
                        rule: 'Participaste con stock normal y productos gancho: la ruleta decide cuántos clientes se quedaron con el resto del catálogo.',
                        outcomeTextByPerformance: {
                            perfect: 'Los ganchos funcionaron y la gente compró mucho más que lo que fue a buscar.',
                            poor: 'La gente se llevó solo los productos baratos y ya casi no compró nada más.',
                        },
                    },
                    learningPill: 'Productos Gancho: Unos pocos productos muy baratos atraen tráfico y permiten vender el resto a precio normal.',
                    outcomeText: 'Los productos gancho llevaron gente a tu tienda y el resto del catálogo se vendió a buen ritmo.',
                }
            ),
            defineOption(
                'Participar solo con descuentos en la mercadería que ya tenías guardada.',
                { capital: +5, reputacion: +2 },
                {
                    minigame: {
                        kind: 'roulette',
                        riskBias: -0.2,
                        title: 'Liquidación segura',
                        rule: 'Participaste solo con lo que ya tenías: poco riesgo, pero la ruleta decide cuánto se vendió.',
                        outcomeTextByPerformance: {
                            perfect: 'Se vendió casi todo lo que tenías guardado y liberaste espacio y caja.',
                            poor: 'La gente pasó de largo y solo se llevó lo más barato de lo viejo.',
                        },
                    },
                    learningPill: 'Rotación de Stock: Un evento masivo es una buena oportunidad para liquidar stock viejo sin comprar nada nuevo.',
                    outcomeText: 'Sacaste mercadería parada sin gastar un peso en stock nuevo. El volumen no fue récord, pero sin riesgo.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_plataforma_comisiones',
        phaseId: 2,
        title: 'La Plataforma te Cobra Más',
        weight: 10,
        when: {
            rubro: ['r2_comercio'],
        },
        description: 'La plataforma donde vendés casi todo subió sus comisiones. Dejarla te haría perder tráfico, pero cada venta te deja menos ganancia.',
        options: [
            defineOption(
                'Seguir en la plataforma y subir tus precios para cubrir la comisión.',
                { capital: +5, reputacion: -6 },
                {
                    learningPill: 'Dependencia de Canal: Cuando un solo canal concentra tus ventas, quien lo controla puede cambiar las reglas.',
                    outcomeText: 'Mantuviste las ventas con precios algo más altos. Tus clientes siguen ahí, pero comparando con la competencia en la misma plataforma.',
                }
            ),
            defineOption(
                'Armar tu tienda online propia y llevar de a poco a tus clientes.',
                { capital: -12, bienestar: -8, reputacion: +6 },
                {
                    addTags: ['clientes_diversificados'],
                    learningPill: 'Canal Propio: Una tienda propia cuesta y tarda en rendir, pero te da control sobre los precios y los datos de tus clientes.',
                    outcomeText: 'Armaste tu tienda propia con bastante esfuerzo. Todavía vende poco, pero los clientes que llegan son tuyos.',
                }
            ),
            defineOption(
                'Dividir tus ventas entre la plataforma y un canal propio en redes.',
                { capital: -3, bienestar: -5, reputacion: +2 },
                {
                    learningPill: 'Diversificar Canales: Vender por más de un canal reduce el riesgo, a cambio de más trabajo operativo.',
                    outcomeText: 'Ahora atendés dos canales. Es más trabajo, pero ya no dependés de uno solo.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_turnos_cancelados',
        phaseId: 2,
        title: 'Turnos que se Caen',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Cada semana varios clientes cancelan a último momento o directamente no se presentan. Perdés horas que no podés recuperar.',
        options: [
            defineOption(
                'Pedir una seña para reservar y cobrarla si cancelan tarde.',
                { capital: +10, bienestar: +3, reputacion: -6 },
                {
                    learningPill: 'Política de Cancelación: Una seña protege tu tiempo y filtra a clientes comprometidos, aunque algunos la sienten como desconfianza.',
                    outcomeText: 'Las ausencias bajaron casi a cero. Un par de clientes se quejó por la seña, pero la mayoría lo entendió.',
                }
            ),
            defineOption(
                'Mandar recordatorios automáticos y dejar todo como está.',
                { capital: +3, bienestar: -3, reputacion: +3 },
                {
                    learningPill: 'Reducir Fricción: Un recordatorio es barato y baja las ausencias sin cambiar la relación con el cliente.',
                    outcomeText: 'Las ausencias bajaron algo. Seguís perdiendo horas, pero la relación con los clientes no cambió.',
                }
            ),
            defineOption(
                'Aceptar overbooking: agendar más gente de la que podés atender.',
                { capital: +8, bienestar: -12, reputacion: -4 },
                {
                    learningPill: 'Overbooking: Agendar de más compensa las ausencias, pero el día que vienen todos, la calidad y el equipo pagan el costo.',
                    outcomeText: 'La agenda se llenó y los ingresos subieron. Los días en que se presenta todo el mundo, la atención se resiente.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_pago_por_resultados',
        phaseId: 2,
        title: 'Pago por Resultados',
        weight: 10,
        when: {
            rubro: ['r3_servicios'],
        },
        description: 'Un cliente te propone pagarte un monto fijo bajo y un porcentaje de lo que venda su empresa gracias a tu trabajo.',
        options: [
            defineOption(
                'Aceptar el esquema: apostar a tus resultados.',
                { capital: +5, bienestar: -8, reputacion: +5 },
                {
                    learningPill: 'Ingreso Variable: Cobrar por resultados puede pagar mucho más, pero asumís el riesgo de factores que no controlás.',
                    outcomeText: 'Aceptaste el trato. Si el cliente vende, vas a ganar más que con tu tarifa. Si no, habrás trabajado casi gratis.',
                }
            ),
            defineOption(
                'Pedir un fijo más alto y un porcentaje más chico.',
                { capital: +10, bienestar: -3 },
                {
                    learningPill: 'Reparto de Riesgo: Un fijo razonable cubre tus costos y un variable chico alinea incentivos sin apostar todo.',
                    outcomeText: 'Negociaron y quedaron en un punto medio. Tu costo está cubierto y todavía tenés algo de ganancia extra si le va bien.',
                }
            ),
            defineOption(
                'Rechazar y cobrar solo tu tarifa de siempre.',
                { capital: +3, bienestar: +3 },
                {
                    learningPill: 'Previsibilidad: Una tarifa fija es menos emocionante, pero te permite planificar la caja.',
                    outcomeText: 'Seguiste con tu esquema de siempre. Sabés cuánto vas a cobrar y el cliente se quedó igual.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_comprar_maquina',
        phaseId: 2,
        title: 'Comprar una Máquina',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Tu producción ya no alcanza con el equipo actual. Una máquina nueva duplicaría tu capacidad, pero cuesta casi todo lo que tenés en caja.',
        options: [
            defineOption(
                'Comprar la máquina nueva a crédito.',
                { capital: -20, bienestar: -5, reputacion: +8 },
                {
                    addTags: ['maquina_propia'],
                    scheduledEvent: { eventId: 'f3_falla_de_la_maquina', delayTurns: 3 },
                    learningPill: 'Inversión en Activos: Una máquina propia baja el costo por unidad en el largo plazo, pero inmoviliza capital y suma mantenimiento.',
                    outcomeText: 'La máquina llegó y tu capacidad se duplicó. Ahora hay cuotas que pagar y un equipo del que depende toda tu producción.',
                }
            ),
            defineOption(
                'Alquilar horas de máquina en otra planta cuando hay picos.',
                { capital: -8, bienestar: -8 },
                {
                    learningPill: 'Capacidad Flexible: Alquilar capacidad cuesta más por unidad, pero evita inmovilizar capital hasta confirmar que la demanda es estable.',
                    outcomeText: 'Cubrís los picos con horas alquiladas. Es más caro por unidad y requiere coordinar, pero no te endeudaste.',
                }
            ),
            defineOption(
                'Comprar una máquina usada y reacondicionarla.',
                { capital: -10, bienestar: -10, reputacion: +3 },
                {
                    addTags: ['maquina_propia'],
                    scheduledEvent: { eventId: 'f3_falla_de_la_maquina', delayTurns: 2 },
                    learningPill: 'Equipo Usado: Una máquina usada baja la inversión inicial, pero trae más riesgo de fallas y gastos de puesta a punto.',
                    outcomeText: 'Conseguiste una máquina usada a buen precio. Hubo que ajustarla y los primeros lotes salieron con algunos errores.',
                }
            ),
        ]
    }),

    defineEvent({
        id: 'f2_marca_blanca',
        phaseId: 2,
        title: 'Producir para Otra Marca',
        weight: 10,
        when: {
            rubro: ['r4_produccion'],
        },
        description: 'Una cadena de supermercados quiere que le produzcas con su propia marca, en cantidades grandes y a un precio bajo. Es un volumen que nunca imaginaste.',
        options: [
            defineOption(
                'Aceptar el contrato por toda tu capacidad.',
                { capital: +20, bienestar: -10, reputacion: -8 },
                {
                    addTags: ['cliente_dependencia'],
                    scheduledEvent: { eventId: 'f3_cadena_baja_precio', delayTurns: 3 },
                    learningPill: 'Marca Blanca: Producir para otra marca da volumen y ocupa tu capacidad, pero tu cliente pasa a decidir el precio.',
                    outcomeText: 'Tu fábrica trabaja a pleno y la caja se llenó. Pero casi toda tu producción tiene el nombre de otro.',
                }
            ),
            defineOption(
                'Aceptar un lote chico y seguir creciendo con tu propia marca.',
                { capital: +8, bienestar: -3 },
                {
                    learningPill: 'Diversificar Ventas: Combinar marca propia y marca blanca aprovecha capacidad ociosa sin depender de un solo comprador.',
                    outcomeText: 'Aceptaste un lote acotado. Es un ingreso extra que ocupa capacidad que sobraba, y tu marca sigue creciendo.',
                }
            ),
            defineOption(
                'Rechazar y apostar a construir tu marca.',
                { capital: -5, reputacion: +8 },
                {
                    learningPill: 'Marca Propia: Tu marca da más margen y más valor, pero tarda años en construirse.',
                    outcomeText: 'Dijiste que no a un contrato enorme. Tu volumen es chico, pero cada producto que vendés tiene tu nombre y tu margen.',
                }
            ),
        ]
    }),
]