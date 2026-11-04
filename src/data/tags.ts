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
  /** Cláusula en condicional (minúscula, sin punto) para el texto bajo las opciones que agregan el tag. */
  hint: string;
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
    hint: 'salir rápido te puede enseñar en semanas lo que a otros les lleva meses',
    tone: 'good',
  },
  obsesion_calidad: {
    label: 'Obsesión por la Calidad',
    modifiers: { capital: -2, reputacion: 1, bienestar: -1 },
    description: 'No lanzás nada hasta que esté impecable. Tu marca gana prestigio, a costa de plata y de horas de sueño.',
    story: 'no lanzás nada hasta que esté impecable: [+tu marca gana prestigio] a costa de [-plata y horas de sueño]',
    storyPast: 'no lanzaste nada hasta que estuviera impecable: [+tu marca ganó prestigio] a costa de [-plata y horas de sueño]',
    hint: 'esperar a que todo esté impecable quizás te cueste más tiempo y plata de lo que pensás',
    tone: 'bad',
  },
  socio_alineado: {
    label: 'Socio Alineado',
    modifiers: { reputacion: 1, bienestar: 1 },
    description: 'Tu socio comparte tu visión y se reparte la carga con vos. Decidir juntos es más fácil, y se nota afuera.',
    story: 'tu socio comparte tu visión y [+se reparte la carga con vos]',
    storyPast: 'tu socio compartió tu visión y [+se repartió la carga con vos]',
    hint: 'tener a alguien que comparte tu visión podría repartirte la carga',
    tone: 'good',
  },
  socio_conflictivo: {
    label: 'Socio Conflictivo',
    modifiers: {},
    description: 'Tu socio aporta talento, pero tiran para lados distintos. Por ahora conviven; tarde o temprano va a haber que hablarlo.',
    story: 'tu socio [-tira para otro lado] y tarde o temprano va a haber que hablarlo',
    storyPast: 'tu socio [-tiró para otro lado] y tarde o temprano hubo que hablarlo',
    hint: 'capaz que con este socio terminen tirando para lados distintos',
    tone: 'bad',
  },
  equity_diluido: {
    label: 'Equity Diluido',
    modifiers: {},
    description: 'Ya no sos dueño de toda la empresa. Otros tienen voz sobre su futuro y pueden hacerla valer cuando menos lo esperás.',
    story: '[-ya no sos dueño de toda la empresa] y otros tienen voz sobre su futuro',
    storyPast: '[-dejaste de ser dueño de toda la empresa] y otros tuvieron voz sobre su futuro',
    hint: 'ceder parte de la empresa puede darles voz a otros sobre su futuro',
    tone: 'bad',
  },
  cliente_dependencia: {
    label: 'Dependencia de Cliente',
    modifiers: {},
    description: 'Buena parte de tus ingresos depende de un solo cliente. Mientras pague a tiempo, todo bien; si se atrasa, te arrastra.',
    story: '[-dependés de un solo cliente]: si se atrasa, te arrastra',
    storyPast: '[-dependiste de un solo cliente]: cuando se atrasó, te arrastró',
    hint: 'depender de un solo cliente quizás te deje expuesto si se atrasa',
    tone: 'bad',
  },
  clientes_diversificados: {
    label: 'Clientes Diversificados',
    modifiers: { capital: 1, reputacion: 1 },
    description: 'Tus ventas están repartidas entre muchos clientes. Si uno se cae, el resto te sostiene.',
    story: 'tus ventas están [+repartidas entre muchos clientes]',
    storyPast: '[+repartiste tus ventas entre muchos clientes]',
    hint: 'repartir las ventas entre muchos clientes podría sostenerte si uno se cae',
    tone: 'good',
  },

  // Tags de arquetipos (setup inicial)
  calidad_producto: {
    label: 'Calidad de Producto',
    modifiers: { capital: -1, reputacion: 2 },
    description: 'Tu producto es sólido y se nota. Los clientes te recomiendan, aunque sostener ese nivel cuesta plata.',
    story: 'tu producto es sólido y [+los clientes te recomiendan]',
    storyPast: 'tu producto fue sólido y [+los clientes te recomendaron]',
    hint: 'un producto sólido puede hacer que los clientes te recomienden',
    tone: 'good',
  },
  generacion_ingresos: {
    label: 'Generación de Ingresos',
    modifiers: { capital: 2 },
    description: 'Sabés vender y cerrar tratos. La caja se mueve todos los meses.',
    story: 'sabés vender, así que [+la caja se mueve todos los meses]',
    storyPast: 'supiste vender, así que [+la caja se movió todos los meses]',
    hint: 'capaz que la caja empiece a moverse todos los meses',
    tone: 'good',
  },
  red_contactos: {
    label: 'Red de Contactos',
    modifiers: { reputacion: 2 },
    description: 'Conocés a la gente indicada. Tu nombre circula y te abre puertas.',
    story: '[+conocés a la gente indicada] y tu nombre te abre puertas',
    storyPast: '[+conociste a la gente indicada] y tu nombre te abrió puertas',
    hint: 'conocer a la gente indicada podría abrirte puertas',
    tone: 'good',
  },
  inversiones: {
    label: 'Inversiones',
    modifiers: { capital: 2 },
    description: 'Tu plata no está quieta: tus inversiones rinden y suman un ingreso extra cada año.',
    story: '[+tus inversiones rinden] y suman un ingreso extra',
    storyPast: '[+tus inversiones rindieron] y sumaron un ingreso extra',
    hint: 'tener la plata trabajando quizás te sume un ingreso extra',
    tone: 'good',
  },
  patrimonio: {
    label: 'Patrimonio',
    modifiers: { capital: 1, bienestar: 1 },
    description: 'Tenés un colchón propio. No te salva de todo, pero te deja dormir más tranquilo.',
    story: 'tenés [+un colchón propio] que te deja dormir más tranquilo',
    storyPast: 'tuviste [+un colchón propio] que te dejó dormir más tranquilo',
    hint: 'un colchón propio puede dejarte dormir más tranquilo',
    tone: 'good',
  },

  // Fase 2: Tracción & Caja
  deuda_riesgosa: {
    label: 'Deuda Riesgosa',
    modifiers: { capital: -3, bienestar: -1 },
    description: 'Debés plata con intereses que no perdonan. Cada mes la cuota se come parte de la caja y te quita el sueño.',
    story: 'debés [-plata con intereses que no perdonan]',
    storyPast: 'tomaste [-deuda con intereses que no perdonaron]',
    hint: 'los intereses podrían comerse la caja de los próximos meses',
    tone: 'bad',
  },
  proveedor_dependiente: {
    label: 'Proveedor Dependiente',
    modifiers: { capital: 2 },
    description: 'Le comprás todo a un único proveedor barato. Ganás margen, pero si él falla, fallás vos.',
    story: 'comprarle todo a un solo proveedor [+te deja buen margen], aunque [-si falla, fallás vos]',
    storyPast: 'comprarle todo a un solo proveedor [+te dejó buen margen], aunque [-si falló, fallaste vos]',
    hint: 'comprarle todo a un solo proveedor puede dejarte buen margen, aunque si falla, fallás vos',
    tone: 'good',
  },
  proveedores_diversificados: {
    label: 'Proveedores Diversificados',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
    description: 'Trabajás con varios proveedores locales. Pagás un poco más y a cambio tenés respaldo y tranquilidad.',
    story: 'trabajar con varios proveedores [+te da respaldo y tranquilidad]',
    storyPast: 'trabajar con varios proveedores [+te dio respaldo y tranquilidad]',
    hint: 'tener varios proveedores quizás te dé respaldo cuando algo falle',
    tone: 'good',
  },
  equipo_sobrecargado: {
    label: 'Equipo Sobrecargado',
    modifiers: {},
    description: 'Tu equipo hace más de lo que puede. Por ahora aguanta, pero el cansancio se va acumulando.',
    story: 'tu equipo [-hace más de lo que puede] y el cansancio se acumula',
    storyPast: 'tu equipo [-hizo más de lo que podía] y el cansancio se acumuló',
    hint: 'capaz que el equipo empiece a cargar más de lo que puede',
    tone: 'bad',
  },
  procesos_solidos: {
    label: 'Procesos Sólidos',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
    description: 'Ordenaste cómo se trabaja. Mantenerlo cuesta, pero el equipo rinde mejor y los clientes lo notan.',
    story: '[+ordenaste cómo se trabaja] y el equipo rinde mejor',
    storyPast: '[+ordenaste cómo se trabajaba] y el equipo rindió mejor',
    hint: 'ordenar cómo se trabaja podría hacer rendir más al equipo',
    tone: 'good',
  },

  // Fase 3: Escala & Crisis
  inversion_externa: {
    label: 'Inversión Externa',
    modifiers: { capital: 2, reputacion: 1, bienestar: -1 },
    description: 'Un fondo apostó por vos. Hay más recursos y más visibilidad, y también alguien que te pide resultados.',
    story: 'un fondo apostó por vos: [+hay más recursos], aunque [-alguien te pide resultados]',
    storyPast: 'un fondo apostó por vos: [+tuviste más recursos], aunque [-alguien te pidió resultados]',
    hint: 'tener un fondo detrás puede darte recursos, y también a alguien que te pida resultados',
    tone: 'good',
  },
  autonomia_estrategica: {
    label: 'Autonomía Estratégica',
    modifiers: {},
    description: 'Las decisiones son tuyas y de nadie más. Crecés a tu ritmo, sin pedir permiso, pero también sin red.',
    story: '[+las decisiones son tuyas] y crecés a tu ritmo',
    storyPast: '[+las decisiones fueron tuyas] y creciste a tu ritmo',
    hint: 'decidir sin socios externos quizás te deje crecer a tu ritmo, aunque sin red',
    tone: 'good',
  },
  conflicto_legal: {
    label: 'Conflicto Legal',
    modifiers: { capital: -2, reputacion: -2, bienestar: -2 },
    description: 'Estás en juicio con tu ex socio. Abogados, tiempo y rumores te desgastan en todos los frentes.',
    story: 'estás [-en juicio con tu ex socio] y eso te desgasta en todos los frentes',
    storyPast: 'estuviste [-en juicio con tu ex socio] y eso te desgastó en todos los frentes',
    hint: 'un juicio podría desgastarte en todos los frentes',
    tone: 'bad',
  },

  // Fase 4: Consolidación & Salida
  salida_exitosa_venta: {
    label: 'Salida Exitosa por Venta',
    modifiers: { capital: 4, reputacion: 1, bienestar: 2 },
    description: 'Vendiste la empresa en buenos términos. Años de trabajo se convirtieron en capital.',
    story: '[+vendiste la empresa en buenos términos]',
    storyPast: '[+vendiste la empresa en buenos términos]',
    hint: 'vender en buenos términos puede convertir años de trabajo en capital',
    tone: 'good',
  },
  lifestyle_business: {
    label: 'Lifestyle Business',
    modifiers: { capital: 1, reputacion: 1, bienestar: 2 },
    description: 'Elegiste una empresa a tu medida: rentable, estable y con tiempo para tu vida.',
    story: 'tenés [+una empresa a tu medida], rentable y con tiempo para tu vida',
    storyPast: 'armaste [+una empresa a tu medida], rentable y con tiempo para tu vida',
    hint: 'capaz que te quede una empresa a tu medida, con tiempo para tu vida',
    tone: 'good',
  },
  expansion_global: {
    label: 'Expansión Global',
    modifiers: { capital: -2, reputacion: 2, bienestar: -1 },
    description: 'Saliste a otros mercados. Tu marca crece afuera, mientras la inversión y los viajes pesan.',
    story: '[+tu marca crece en otros mercados], aunque [-la inversión y los viajes pesan]',
    storyPast: '[+tu marca creció en otros mercados], aunque [-la inversión y los viajes pesaron]',
    hint: 'salir a otros mercados podría hacer crecer tu marca afuera, con viajes e inversión de por medio',
    tone: 'good',
  },
  informalidad: {
    label: 'Informalidad',
    modifiers: { capital: +1, reputacion: -1 },
    description: 'Cobrás sin facturar. Ahorrás impuestos, pero quedás afuera de los clientes grandes y acumulás un riesgo.',
    story: 'cobrás sin facturar: [+ahorrás impuestos] y [-quedás afuera de los clientes grandes]',
    storyPast: 'cobraste sin facturar: [+ahorraste impuestos] y [-quedaste afuera de los clientes grandes]',
    hint: 'trabajar sin facturar podría cerrarte puertas más adelante',
    tone: 'bad',
  },
  secreto_ajeno: {
    label: 'Secreto Ajeno',
    modifiers: { bienestar: -1 },
    description: 'Miraste información de otra empresa sin permiso. Te dio ventaja, pero si se sabe, pega fuerte.',
    story: 'usaste información ajena que [-nadie te dio permiso de ver]',
    storyPast: 'usaste información ajena que [-nadie te había dado permiso de ver]',
    hint: 'mirar lo que no te corresponde podría volver en el peor momento',
    tone: 'bad',
  },
  deuda_familiar: {
    label: 'Deuda Familiar',
    modifiers: { bienestar: -1 },
    description: 'Tu familia te prestó plata sin papeles ni plazo. Nadie te apura, pero el negocio quedó atado a la relación.',
    story: 'le debés plata a tu familia y [-cada reunión incluye la pregunta de cómo va el negocio]',
    storyPast: 'le debiste plata a tu familia y [-cada reunión incluyó la pregunta de cómo iba el negocio]',
    hint: 'la plata de la familia sin papeles quizás te cueste más que la de un banco',
    tone: 'bad',
  },
  promesas_pendientes: {
    label: 'Promesas Pendientes',
    modifiers: { bienestar: -1 },
    description: 'Cobraste o cerraste un precio por algo que todavía tenés que entregar. Cada día que pasa, la promesa pesa más.',
    story: 'cobraste por adelantado y [-todavía tenés que cumplir lo que prometiste]',
    storyPast: 'cobraste por adelantado y [-tuviste que correr para cumplir lo que prometiste]',
    hint: 'comprometer una entrega antes de tenerla podría apretarte más adelante',
    tone: 'bad',
  },
  sin_habilitacion: {
    label: 'Sin Habilitación',
    modifiers: { capital: +1, reputacion: -1 },
    description: 'Producís sin la habilitación correspondiente. Ahorrás el alquiler de una planta, pero una inspección puede frenarte.',
    story: 'producís sin habilitación: [+ahorrás costos] y [-una inspección puede frenarte]',
    storyPast: 'produjiste sin habilitación: [+ahorraste costos] y [-una inspección pudo frenarte]',
    hint: 'producir sin habilitación podría salir caro si llega una inspección',
    tone: 'bad',
  },
  stock_inmovilizado: {
    label: 'Stock Inmovilizado',
    modifiers: { capital: -1 },
    description: 'Tenés mercadería o insumos de más guardados. Es plata que no circula y que puede perder valor.',
    story: 'tenés [-plata dormida en mercadería que no rota]',
    storyPast: 'tuviste [-plata dormida en mercadería que no rotaba]',
    hint: 'comprar de más podría dejarte plata dormida en el depósito',
    tone: 'bad',
  },
  alquiler_comprometido: {
    label: 'Alquiler Comprometido',
    modifiers: { capital: -1, reputacion: +1 },
    description: 'Firmaste un alquiler a varios años. El local te da presencia, pero el costo fijo corre vendas o no vendas.',
    story: 'tu local [+te da presencia] y [-el alquiler corre vendas o no vendas]',
    storyPast: 'tu local [+te dio presencia] y [-el alquiler corrió vendieras o no]',
    hint: 'un contrato largo podría pesarte si las ventas no acompañan',
    tone: 'bad',
  },
  precio_devaluado: {
    label: 'Precio Devaluado',
    modifiers: { capital: -1 },
    description: 'Trabajaste gratis o muy barato para ganar visibilidad. Ahora a algunos clientes les cuesta pagarte lo que valés.',
    story: 'trabajaste gratis para ganar visibilidad y [-ahora te cuesta cobrar lo que valés]',
    storyPast: 'trabajaste gratis para ganar visibilidad y [-después te costó cobrar lo que valías]',
    hint: 'trabajar gratis quizás le enseñe a tus clientes que tu trabajo no vale',
    tone: 'bad',
  },
  margen_ajustado: {
    label: 'Margen Ajustado',
    modifiers: { capital: -1 },
    description: 'Mantuviste tus precios mientras subían tus costos. Vendés igual, pero ganás menos por cada venta.',
    story: 'mantuviste tus precios y [-cada venta te deja menos ganancia]',
    storyPast: 'mantuviste tus precios y [-cada venta te dejó menos ganancia]',
    hint: 'no subir los precios podría dejarte vendiendo más, pero ganando menos',
    tone: 'bad',
  },
  contratacion_por_afecto: {
    label: 'Contratación por Afecto',
    modifiers: { reputacion: -1 },
    description: 'Sumaste a un amigo sin un proceso claro. El clima es cálido, pero nadie definió qué se espera de él.',
    story: 'sumaste a un amigo sin proceso y [-nadie definió qué se espera de su trabajo]',
    storyPast: 'sumaste a un amigo sin proceso y [-nadie definió qué se esperaba de su trabajo]',
    hint: 'sumar a un amigo sin proceso podría mezclar la amistad con el trabajo',
    tone: 'bad',
  },
  falla_oculta: {
    label: 'Falla sin Resolver',
    modifiers: {  },
    description: 'Conocés un problema serio de tu producto y lo dejaste para más adelante. Mientras no lo arregles, sigue ahí.',
    story: 'hay una falla seria que [-conocés y todavía no arreglaste]',
    storyPast: 'hubo una falla seria que [-conociste y no arreglaste a tiempo]',
    hint: 'postergar una falla seria podría salir caro si se hace pública',
    tone: 'bad',
  },
  maquina_propia: {
    label: 'Máquina Propia',
    modifiers: { capital: -1, reputacion: +1 },
    description: 'Comprás tu propio equipo y producís con él. Tenés capacidad y control, pero también costos de mantenimiento.',
    story: 'tu máquina propia [+te da capacidad y control] y [-suma mantenimiento]',
    storyPast: 'tu máquina propia [+te dio capacidad y control] y [-sumó mantenimiento]',
    hint: 'tener tu propia máquina podría darte capacidad, aunque con costos de mantenimiento',
    tone: 'bad',
  },
} satisfies Record<string, TagConfig>;

export type Tag = keyof typeof TAGS;
