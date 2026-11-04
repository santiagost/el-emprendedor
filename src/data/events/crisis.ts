import { defineEvent, defineOption } from './builders';

export const crisisEvents = [
  defineEvent({
    id: 'crisis_quiebra_inminente',
    title: 'Alerta Roja: Caja en Zona de Quiebra',
    kind: 'crisis',
    description:
      '{nombre}, tus reservas de liquidez cayeron por debajo del 25%. Quedan días antes de que los pagos reboten y no puedas cubrir los costos fijos. Es necesaria una medida extrema.',
    weight: 40,
    when: {
      metrics: { capital: { lt: 26 } },
    },
    options: [
      defineOption(
        'Inyectar ahorros personales de emergencia para comprar oxígeno.',
        { capital: 20, bienestar: -20 },
        {
          learningPill:
            'Aporte de Socios en Crisis: Usar ahorros personales es un parche temporal que solo sirve si se corrigen las causas estructurales de la pérdida.',
          outcomeText:
            'Rescataste la caja del mes con tu propio bolsillo. La empresa sigue respirando, pero el desgaste familiar y la presión personal aumentaron al máximo.',
        }
      ),
      defineOption(
        'Frenar gastos no esenciales y renegociar plazos con proveedores.',
        { capital: 15, reputacion: -15 },
        {
          learningPill:
            'Ajuste Rápido de Runway: Ante una crisis de liquidez inminente, frenar gastos y estirar los pagos compra tiempo sin tocar al equipo, a costa de la confianza de los proveedores.',
          outcomeText:
            'Frenar gastos y estirar plazos estabilizó las cuentas por unos meses. El equipo no sintió el golpe, pero los proveedores empezaron a mirar tu empresa con desconfianza.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'crisis_burnout_extremo',
    title: 'Alerta Roja: Colapso por Burnout',
    kind: 'crisis',
    description:
      'El bienestar del equipo y tu salud tocaron fondo (< 25%). La sobrecarga permanente generó renuncias inminentes y errores graves por fatiga.',
    weight: 40,
    when: {
      metrics: { bienestar: { lt: 26 } },
    },
    options: [
      defineOption(
        'Frenar la operación 3 días, postergar entregas y dar descanso real.',
        { capital: -15, reputacion: -10, bienestar: 25 },
        {
          learningPill:
            'Gestión de Energía del Equipo: Un equipo quemado produce a un tercio de su capacidad y comete errores caros. Parar a tiempo suele ser la decisión más rentable.',
          outcomeText:
            'La pausa obligada evitó renuncias masivas y recuperó la moral, a costa de algunas quejas de clientes por entregas reprogramadas.',
        }
      ),
      defineOption(
        'Pagar bonos extraordinarios y contratar apoyo temporal sin frenar.',
        { capital: -20, bienestar: 15 },
        {
          learningPill:
            'Compensación vs Carga: El dinero alivia el descontento temporalmente, pero no reemplaza la necesidad de procesos sostenibles y descanso.',
          outcomeText:
            'Los bonos calmaron las aguas y el refuerzo alivió cuellos de botella, pero consumieron una parte sustancial de la caja acumulada.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'crisis_reputacion_fuga',
    title: 'Alerta Roja: Crisis de Confianza en el Mercado',
    kind: 'crisis',
    description:
      'Tu reputación cayó a niveles críticos (< 25%). Clientes corporativos amenazan con rescindir contratos y en redes sociales hay un aluvión de quejas abiertas.',
    weight: 40,
    when: {
      metrics: { reputacion: { lt: 26 } },
    },
    options: [
      defineOption(
        'Carta pública del fundador asumiendo errores y reembolsando a afectados.',
        { capital: -20, reputacion: 25, bienestar: 5 },
        {
          learningPill:
            'Humildad y Gestión de Crisis: Asumir responsabilidades con transparencia y resarcimiento económico frena el daño reputacional y recupera clientes leales.',
          outcomeText:
            'La carta fue aplaudida por su honestidad. Costó caja pagar los reembolsos, pero frenaste en seco la sangría de cancelaciones.',
        }
      ),
      defineOption(
        'Contratar una agencia de comunicación de crisis para blindar la marca.',
        { capital: -15, reputacion: 15 },
        {
          learningPill:
            'Comunicación Institucional: En crisis de imagen, una vocería profesional evita declaraciones desafortunadas que agraven el conflicto.',
          outcomeText:
            'La agencia ordenó los comunicados y mitigó la cobertura negativa en prensa, logrando estabilizar la imagen pública.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'crisis_deuda_ahoga',
    title: 'Alerta Roja: La Deuda te Ahoga',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['deuda_riesgosa'],
      metrics: { capital: { lt: 26 } },
    },
    description: 'Los intereses de lo que debés ya consumen casi todo lo que ingresa. Si no hacés algo ya, el próximo vencimiento no vas a poder pagarlo.',
    options: [
      defineOption(
        'Renegociar con los acreedores a un plazo más largo.',
        { capital: +15, bienestar: -10, reputacion: -5 },
        {
          removeTags: ['deuda_riesgosa'],
          learningPill: 'Reestructuración de Deuda: Renegociar a tiempo es mejor que caer en mora, aunque alarga el costo total y daña tu historial.',
          outcomeText: 'Lograste estirar los plazos y bajar la cuota. La caja respira, pero vas a pagar intereses durante mucho más tiempo.',
        }
      ),
      defineOption(
        'Vender equipos, stock o proyectos para pagar parte de la deuda.',
        { capital: +20, bienestar: -5, reputacion: -10 },
        {
          removeTags: ['deuda_riesgosa'],
          learningPill: 'Desinversión: Vender activos para pagar deuda libera caja de inmediato, a costa de capacidad futura.',
          outcomeText: 'Vendiste lo que no era esencial y pagaste una parte importante. La deuda es manejable, pero la empresa quedó más chica.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_alquiler_ahoga',
    title: 'Alerta Roja: El Alquiler no se Puede Pagar',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['alquiler_comprometido'],
      rubro: ['r2_comercio'],
      metrics: { capital: { lt: 26 } },
    },
    description: 'El alquiler del local se come casi todo lo que vendés y la caja no da más. El propietario te reclama los meses atrasados.',
    options: [
      defineOption(
        'Subalquilar una parte del local a otro comercio.',
        { capital: +15, bienestar: -8 },
        {
          learningPill: 'Subalquiler: Compartir el espacio baja el costo fijo, a cambio de convivir con otro negocio y de la autorización del propietario.',
          outcomeText: 'Le alquilaste una parte del local a otro comercio. El alquiler ya no te ahoga, aunque compartís el espacio con alguien más.',
        }
      ),
      defineOption(
        'Negociar una quita con el propietario a cambio de extender el contrato.',
        { capital: +15, bienestar: -5, reputacion: -3 },
        {
          learningPill: 'Negociación de Contratos: Un propietario con un local vacío suele preferir una quita a perder un inquilino, a cambio de más compromiso.',
          outcomeText: 'El propietario aceptó una quita y vos te comprometiste a más años. Respiraste, pero quedaste más atado al local.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_stock_parado',
    title: 'Alerta Roja: La Plata Está Parada en el Depósito',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['stock_inmovilizado'],
      rubro: ['r2_comercio', 'r4_produccion'],
      metrics: { capital: { lt: 26 } },
    },
    description: 'La mercadería parada ya no entra en el depósito y no tenés caja para pagar a los proveedores. Cada día que pasa, tu stock vale menos.',
    options: [
      defineOption(
        'Liquidar todo a precio de remate.',
        { capital: +20, reputacion: -12 },
        {
          removeTags: ['stock_inmovilizado'],
          learningPill: 'Liquidación: Vender a pérdida libera caja rápido, pero enseña a tus clientes a esperar descuentos y daña tu imagen.',
          outcomeText: 'Remataste el stock en pocos días. Recuperaste caja, aunque con una imagen de oferta permanente.',
        }
      ),
      defineOption(
        'Canjear mercadería por servicios o insumos con otros comercios.',
        { capital: +15, bienestar: -8 },
        {
          removeTags: ['stock_inmovilizado'],
          learningPill: 'Trueque Comercial: Intercambiar stock por bienes o servicios mueve inventario sin necesidad de caja, aunque lleva mucho trabajo.',
          outcomeText: 'Armaste canjes con varios comercios de la zona. Fue un trabajo tedioso, pero convertiste lo parado en lo que necesitabas.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_embargo',
    title: 'Alerta Roja: Te Embargaron la Cuenta',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['informalidad'],
      metrics: { capital: { lt: 26 } },
    },
    description: 'El organismo fiscal te embargó la cuenta por impuestos que no pagaste. No podés pagarle a nadie hasta que se resuelva.',
    options: [
      defineOption(
        'Acordar un plan de pagos con el fisco.',
        { capital: +15, bienestar: -8 },
        {
          removeTags: ['informalidad'],
          learningPill: 'Plan de Pagos: Regularizar con un plan de pagos levanta el embargo, pero compromete tu flujo de caja por años.',
          outcomeText: 'Firmaste un plan de pagos y te liberaron la cuenta. Tus gastos fijos ahora incluyen una cuota que no esperabas.',
        }
      ),
      defineOption(
        'Pedir un préstamo urgente para levantar el embargo.',
        { capital: +15, bienestar: -10, reputacion: -5 },
        {
          addTags: ['deuda_riesgosa'],
          removeTags: ['informalidad'],
          learningPill: 'Deuda para Cubrir Deuda: Pagar una deuda con otra, más cara, solo mueve el problema.',
          outcomeText: 'Conseguiste un préstamo con una tasa altísima. Levantaste el embargo, pero ahora le debés a otro.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_cliente_unico_se_va',
    title: 'Alerta Roja: Tu Cliente Principal se Fue',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['cliente_dependencia'],
      metrics: { capital: { lt: 26 } },
    },
    description: 'El cliente que representaba casi todos tus ingresos decidió irse, y la caja quedó en el límite. Quedan pocas semanas de margen.',
    options: [
      defineOption(
        'Salir a conseguir muchos clientes chicos con descuentos de entrada.',
        { capital: +15, bienestar: -10, reputacion: -5 },
        {
          removeTags: ['cliente_dependencia'],
          learningPill: 'Diversificación Forzada: Armar una cartera de clientes chicos en plena urgencia es posible, pero a costa de márgenes bajos.',
          outcomeText: 'Ofreciste descuentos fuertes y cerraste varios clientes chicos. La caja se recuperó, aunque ya no dependés de uno solo.',
        }
      ),
      defineOption(
        'Pedirles un crédito puente a tus proveedores mientras buscás clientes.',
        { capital: +15, bienestar: -8, reputacion: -8 },
        {
          learningPill: 'Crédito Comercial: Los proveedores pueden financiarte un tiempo, pero cada día de atraso daña la confianza.',
          outcomeText: 'Tus proveedores te dieron un plazo extra. Ganaste tiempo para buscar clientes, pero a cambio de mucha presión.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_socio_se_va',
    title: 'Alerta Roja: La Sociedad se Rompe',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['socio_conflictivo'],
      metrics: { bienestar: { lt: 26 } },
    },
    description: 'La relación con tu socio llegó a un punto de no retorno. Las discusiones son diarias, nadie en el equipo sabe a quién obedecer y vos no dormís.',
    options: [
      defineOption(
        'Contratar a un mediador para resolver el conflicto.',
        { capital: -10, bienestar: +15 },
        {
          removeTags: ['socio_conflictivo'],
          learningPill: 'Mediación: Un tercero neutral puede reordenar roles y expectativas antes de llegar a una ruptura.',
          outcomeText: 'La mediación fue difícil, pero lograron acordar roles claros. Todavía hay cosas por resolver, pero ya no es una guerra.',
        }
      ),
      defineOption(
        'Separarte de tu socio comprando su parte.',
        { capital: -15, bienestar: +20, reputacion: -5 },
        {
          removeTags: ['socio_conflictivo'],
          learningPill: 'Pacto de Socios: Comprar la parte de un socio cuesta caro, pero evita que un conflicto paralice la empresa.',
          outcomeText: 'Compraste la parte de tu socio y cada uno siguió por su lado. Fue caro y doloroso, pero volviste a decidir en paz.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_equipo_agotado',
    title: 'Alerta Roja: Licencias por Agotamiento',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['equipo_sobrecargado'],
      metrics: { bienestar: { lt: 26 } },
    },
    description: 'Varias personas de tu equipo presentan licencias médicas por agotamiento al mismo tiempo. Las que quedan no llegan a cubrirlo todo, y vos tampoco.',
    options: [
      defineOption(
        'Reunirte con todo el equipo, ordenar las cargas y frenar lo que no es urgente.',
        { capital: -8, bienestar: +15 },
        {
          removeTags: ['equipo_sobrecargado'],
          learningPill: 'Gestión de la Carga: Frenar lo que no es urgente y repartir mejor el trabajo es la única forma de frenar el agotamiento.',
          outcomeText: 'Hablaste con todo el equipo y redefinieron prioridades. Se frenaron proyectos, pero el equipo volvió a respirar.',
        }
      ),
      defineOption(
        'Sumar personal temporal de inmediato, aunque cueste más.',
        { capital: -15, bienestar: +15, reputacion: +3 },
        {
          removeTags: ['equipo_sobrecargado'],
          learningPill: 'Costo del Agotamiento: Cubrir el hueco con personal temporal cuesta caro, pero alivia al equipo que queda y evita más bajas.',
          outcomeText: 'Contrataste personal temporal para cubrir las licencias. El equipo se alivió, aunque la nómina salió más cara.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_promesas_incumplidas',
    title: 'Alerta Roja: Reclamos por Todos Lados',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['promesas_pendientes'],
      metrics: { reputacion: { lt: 26 } },
    },
    description: 'Lo que prometiste y no entregaste a tiempo explotó: tus clientes reclaman en público y varios piden la devolución.',
    options: [
      defineOption(
        'Cumplir todo lo prometido, aunque te lleve semanas sin descanso.',
        { capital: -10, bienestar: -15, reputacion: +20 },
        {
          removeTags: ['promesas_pendientes'],
          learningPill: 'Reparar la Confianza: Cumplir con retraso no borra el error, pero muestra que tu palabra vale, y los clientes lo recuerdan.',
          outcomeText: 'Trabajaste sin parar hasta entregar todo. Los clientes lo valoraron, pero quedaste agotado.',
        }
      ),
      defineOption(
        'Devolver el dinero a quienes lo pidan y pedir disculpas públicas.',
        { capital: -15, reputacion: +15 },
        {
          removeTags: ['promesas_pendientes'],
          learningPill: 'Reembolso Voluntario: Devolver el dinero sin discusión cuesta caja, pero frena el daño a la reputación.',
          outcomeText: 'Devolviste el dinero a todos los que lo pidieron y te disculpaste en público. Perdiste plata, pero frenaste el ruido.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'crisis_escandalo_secreto',
    title: 'Alerta Roja: El Escándalo Estalla',
    kind: 'crisis',
    weight: 50,
    when: {
      tags: ['secreto_ajeno'],
      metrics: { reputacion: { lt: 26 } },
    },
    description: 'Lo que hiciste con información que no era tuya salió a la luz y ahora todo el sector habla de eso.',
    options: [
      defineOption(
        'Dar la cara y pedir disculpas públicas.',
        { capital: -10, bienestar: -10, reputacion: +15 },
        {
          removeTags: ['secreto_ajeno'],
          learningPill: 'Responsabilidad Pública: Asumir un error en público no lo borra, pero evita que otros cuenten la historia por vos.',
          outcomeText: 'Pediste disculpas sin excusas. Hubo críticas duras, pero con el tiempo el tema se fue apagando.',
        }
      ),
      defineOption(
        'Contratar a una consultora de comunicación de crisis.',
        { capital: -15, reputacion: +15 },
        {
          removeTags: ['secreto_ajeno'],
          learningPill: 'Comunicación de Crisis: Un especialista ordena el mensaje y los tiempos, pero no reemplaza hacerte cargo.',
          outcomeText: 'La consultora armó un plan de comunicación. El daño se acotó, aunque siempre quedó la duda de qué tan sincero fue.',
        }
      ),
    ]
  }),
];
