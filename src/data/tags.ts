type Modifiers = {
  capital?: number;
  bienestar?: number;
  reputacion?: number;
};

/** Cómo pesa el tag en el relato de la empresa: a favor o en contra. */
export type TagTone = 'good' | 'bad';

interface TagConfig {
  label: string;
  modifiers: Modifiers;
  /** Frase completa para el tooltip del chip. */
  description: string;
  /**
   * Fragmento para el relato "Cómo está tu empresa" (presente): cláusula en minúscula y sin punto final.
   * [+texto] se resalta como positivo y [-texto] como negativo.
   */
  story: string;
  /** Mismo fragmento en pasado, para el informe final: lo que el jugador ya hizo. */
  storyPast: string;
  tone: TagTone;
}

export const TAGS = {
  // Fase 1: Génesis & Validación
  cultura_lean: {
    label: 'Cultura Lean',
    modifiers: { capital: 1, reputacion: -1 },
    description: 'Salís rápido y corregís sobre la marcha. Gastás poco, pero algunos clientes notan las asperezas.',
    story: 'salís rápido y [+gastás poco], aunque [-algunos clientes notan las asperezas]',
    storyPast: 'supiste salir rápido y [+gastar poco], aunque [-algunos clientes supieron notar las asperezas]',
    tone: 'good',
  },
  obsesion_calidad: {
    label: 'Obsesión por la Calidad',
    modifiers: { capital: -2, reputacion: 1, bienestar: -1 },
    description: 'No lanzás nada hasta que esté impecable. Tu marca gana prestigio, a costa de plata y de horas de sueño.',
    story: 'no lanzás nada hasta que esté impecable: [+tu marca gana prestigio] a costa de [-plata y horas de sueño]',
    storyPast: 'no lanzaste nada hasta que estuviera impecable: [+tu marca ganó prestigio] a costa de [-plata y horas de sueño]',
    tone: 'bad',
  },
  socio_alineado: {
    label: 'Socio Alineado',
    modifiers: { reputacion: 1, bienestar: 1 },
    description: 'Tu socio comparte tu visión y se reparte la carga con vos. Decidir juntos es más fácil, y se nota afuera.',
    story: 'tu socio comparte tu visión y [+se reparte la carga con vos]',
    storyPast: 'tu socio compartió tu visión y [+se repartió la carga con vos]',
    tone: 'good',
  },
  socio_conflictivo: {
    label: 'Socio Conflictivo',
    modifiers: {},
    description: 'Tu socio aporta talento, pero tiran para lados distintos. Por ahora conviven; tarde o temprano va a haber que hablarlo.',
    story: 'tu socio [-tira para otro lado] y tarde o temprano va a haber que hablarlo',
    storyPast: 'tu socio [-tiró para otro lado] y tarde o temprano hubo que hablarlo',
    tone: 'bad',
  },
  equity_diluido: {
    label: 'Equity Diluido',
    modifiers: {},
    description: 'Ya no sos dueño de toda la empresa. Otros tienen voz sobre su futuro y pueden hacerla valer cuando menos lo esperás.',
    story: '[-ya no sos dueño de toda la empresa] y otros tienen voz sobre su futuro',
    storyPast: '[-dejaste de ser dueño de toda la empresa] y otros tuvieron voz sobre su futuro',
    tone: 'bad',
  },
  cliente_dependencia: {
    label: 'Dependencia de Cliente',
    modifiers: {},
    description: 'Buena parte de tus ingresos depende de un solo cliente. Mientras pague a tiempo, todo bien; si se atrasa, te arrastra.',
    story: '[-dependés de un solo cliente]: si se atrasa, te arrastra',
    storyPast: '[-dependiste de un solo cliente]: cuando se atrasó, te arrastró',
    tone: 'bad',
  },
  clientes_diversificados: {
    label: 'Clientes Diversificados',
    modifiers: { capital: 1, reputacion: 1 },
    description: 'Tus ventas están repartidas entre muchos clientes. Si uno se cae, el resto te sostiene.',
    story: 'tus ventas están [+repartidas entre muchos clientes]',
    storyPast: '[+repartiste tus ventas entre muchos clientes]',
    tone: 'good',
  },

  // Tags de arquetipos (setup inicial)
  calidad_producto: {
    label: 'Calidad de Producto',
    modifiers: { capital: -1, reputacion: 2 },
    description: 'Tu producto es sólido y se nota. Los clientes te recomiendan, aunque sostener ese nivel cuesta plata.',
    story: 'tu producto es sólido y [+los clientes te recomiendan]',
    storyPast: 'tu producto fue sólido y [+los clientes te recomendaron]',
    tone: 'good',
  },
  generacion_ingresos: {
    label: 'Generación de Ingresos',
    modifiers: { capital: 2 },
    description: 'Sabés vender y cerrar tratos. La caja se mueve todos los meses.',
    story: 'sabés vender, así que [+la caja se mueve todos los meses]',
    storyPast: 'supiste vender, así que [+la caja se movió todos los meses]',
    tone: 'good',
  },
  red_contactos: {
    label: 'Red de Contactos',
    modifiers: { reputacion: 2 },
    description: 'Conocés a la gente indicada. Tu nombre circula y te abre puertas.',
    story: '[+conocés a la gente indicada] y tu nombre te abre puertas',
    storyPast: '[+conociste a la gente indicada] y tu nombre te abrió puertas',
    tone: 'good',
  },
  inversiones: {
    label: 'Inversiones',
    modifiers: { capital: 2 },
    description: 'Tu plata no está quieta: tus inversiones rinden y suman un ingreso extra cada turno.',
    story: '[+tus inversiones rinden] y suman un ingreso extra',
    storyPast: '[+tus inversiones rindieron] y sumaron un ingreso extra',
    tone: 'good',
  },
  patrimonio: {
    label: 'Patrimonio',
    modifiers: { capital: 1, bienestar: 1 },
    description: 'Tenés un colchón propio. No te salva de todo, pero te deja dormir más tranquilo.',
    story: 'tenés [+un colchón propio] que te deja dormir más tranquilo',
    storyPast: 'tuviste [+un colchón propio] que te dejó dormir más tranquilo',
    tone: 'good',
  },

  // Fase 2: Tracción & Caja
  deuda_riesgosa: {
    label: 'Deuda Riesgosa',
    modifiers: { capital: -3, bienestar: -1 },
    description: 'Debés plata con intereses que no perdonan. Cada mes la cuota se come parte de la caja y te quita el sueño.',
    story: 'debés [-plata con intereses que no perdonan]',
    storyPast: 'tomaste [-deuda con intereses que no perdonaron]',
    tone: 'bad',
  },
  proveedor_dependiente: {
    label: 'Proveedor Dependiente',
    modifiers: { capital: 2 },
    description: 'Le comprás todo a un único proveedor barato. Ganás margen, pero si él falla, fallás vos.',
    story: 'comprarle todo a un solo proveedor [+te deja buen margen], aunque [-si falla, fallás vos]',
    storyPast: 'comprarle todo a un solo proveedor [+te dejó buen margen], aunque [-si falló, fallaste vos]',
    tone: 'good',
  },
  proveedores_diversificados: {
    label: 'Proveedores Diversificados',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
    description: 'Trabajás con varios proveedores locales. Pagás un poco más y a cambio tenés respaldo y tranquilidad.',
    story: 'trabajar con varios proveedores [+te da respaldo y tranquilidad]',
    storyPast: 'trabajar con varios proveedores [+te dio respaldo y tranquilidad]',
    tone: 'good',
  },
  equipo_sobrecargado: {
    label: 'Equipo Sobrecargado',
    modifiers: {},
    description: 'Tu equipo hace más de lo que puede. Por ahora aguanta, pero el cansancio se va acumulando.',
    story: 'tu equipo [-hace más de lo que puede] y el cansancio se acumula',
    storyPast: 'tu equipo [-hizo más de lo que podía] y el cansancio se acumuló',
    tone: 'bad',
  },
  procesos_solidos: {
    label: 'Procesos Sólidos',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
    description: 'Ordenaste cómo se trabaja. Mantenerlo cuesta, pero el equipo rinde mejor y los clientes lo notan.',
    story: '[+ordenaste cómo se trabaja] y el equipo rinde mejor',
    storyPast: '[+ordenaste cómo se trabajaba] y el equipo rindió mejor',
    tone: 'good',
  },

  // Fase 3: Escala & Crisis
  inversion_externa: {
    label: 'Inversión Externa',
    modifiers: { capital: 2, reputacion: 1, bienestar: -1 },
    description: 'Un fondo apostó por vos. Hay más recursos y más visibilidad, y también alguien que te pide resultados.',
    story: 'un fondo apostó por vos: [+hay más recursos], aunque [-alguien te pide resultados]',
    storyPast: 'un fondo apostó por vos: [+tuviste más recursos], aunque [-alguien te pidió resultados]',
    tone: 'good',
  },
  autonomia_estrategica: {
    label: 'Autonomía Estratégica',
    modifiers: {},
    description: 'Las decisiones son tuyas y de nadie más. Crecés a tu ritmo, sin pedir permiso, pero también sin red.',
    story: '[+las decisiones son tuyas] y crecés a tu ritmo',
    storyPast: '[+las decisiones fueron tuyas] y creciste a tu ritmo',
    tone: 'good',
  },
  conflicto_legal: {
    label: 'Conflicto Legal',
    modifiers: { capital: -2, reputacion: -2, bienestar: -2 },
    description: 'Estás en juicio con tu ex socio. Abogados, tiempo y rumores te desgastan en todos los frentes.',
    story: 'estás [-en juicio con tu ex socio] y eso te desgasta en todos los frentes',
    storyPast: 'estuviste [-en juicio con tu ex socio] y eso te desgastó en todos los frentes',
    tone: 'bad',
  },

  // Fase 4: Consolidación & Salida
  salida_exitosa_venta: {
    label: 'Salida Exitosa por Venta',
    modifiers: { capital: 4, reputacion: 1, bienestar: 2 },
    description: 'Vendiste la empresa en buenos términos. Años de trabajo se convirtieron en capital.',
    story: '[+vendiste la empresa en buenos términos]',
    storyPast: '[+vendiste la empresa en buenos términos]',
    tone: 'good',
  },
  lifestyle_business: {
    label: 'Lifestyle Business',
    modifiers: { capital: 1, reputacion: 1, bienestar: 2 },
    description: 'Elegiste una empresa a tu medida: rentable, estable y con tiempo para tu vida.',
    story: 'tenés [+una empresa a tu medida], rentable y con tiempo para tu vida',
    storyPast: 'armaste [+una empresa a tu medida], rentable y con tiempo para tu vida',
    tone: 'good',
  },
  expansion_global: {
    label: 'Expansión Global',
    modifiers: { capital: -2, reputacion: 2, bienestar: -1 },
    description: 'Saliste a otros mercados. Tu marca crece afuera, mientras la inversión y los viajes pesan.',
    story: '[+tu marca crece en otros mercados], aunque [-la inversión y los viajes pesan]',
    storyPast: '[+tu marca creció en otros mercados], aunque [-la inversión y los viajes pesaron]',
    tone: 'good',
  },
} satisfies Record<string, TagConfig>;

export type Tag = keyof typeof TAGS;
