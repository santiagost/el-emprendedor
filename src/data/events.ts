import type {GameEvent} from '../types/game'

export const GAME_EVENTS: GameEvent[] = [
  // ==========================================
  // FASE 1: GÉNESIS & VALIDACIÓN (Turnos 1 a 4)
  // ==========================================
  {
    id: 'f1_mvp_calidad',
    phaseId: 1,
    title: 'El Primer Prototipo',
    weight: 10,
    description: 'El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado?',
    options: [
      {
        text: 'Lanzar ya mismo para validar con usuarios reales.',
        impactPreview: { capital: 'up', reputacion: 'down', bienestar: 'neutral' },
        effects: { capital: +10, reputacion: -10, bienestar: 0 },
        addTags: ['cultura_lean'],
        learningPill: 'Metodología Lean: Lanzar un MVP imperfecto ahorra meses de desarrollo en ideas que nadie quiere.'
      },
      {
        text: 'Retrasar el lanzamiento 2 meses hasta que esté impecable.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'down' },
        effects: { capital: -15, reputacion: +15, bienestar: -10 },
        addTags: ['obsesion_calidad'],
        learningPill: 'Costo de Oportunidad: Perfeccionar un producto sin feedback temprano quema caja sin validar demanda.'
      }
    ]
  },
  {
    id: 'f1_primer_socio',
    phaseId: 1,
    title: 'La Elección del Co-Fundador',
    weight: 10,
    description: 'Necesitás complementar tus habilidades. Aparecen dos personas interesadas en sumarse.',
    options: [
      {
        text: 'Sumar a un amigo de confianza técnica que comparte tu visión.',
        impactPreview: { capital: 'neutral', reputacion: 'neutral', bienestar: 'up' },
        effects: { capital: 0, reputacion: +5, bienestar: +15 },
        addTags: ['socio_alineado'],
        learningPill: 'Alineación de Socios: En etapas tempranas, los valores compartidos y la resiliencia pesan más que el CV.'
      },
      {
        text: 'Sumar a un perfil comercial agresivo que exige el 40% del capital.',
        impactPreview: { capital: 'up', reputacion: 'neutral', bienestar: 'down' },
        effects: { capital: +15, reputacion: 0, bienestar: -10 },
        addTags: ['socio_conflictivo', 'equity_diluido'],
        learningPill: 'Pactos de Socios (Vesting): Ceder porcentajes fijos al inicio sin metas de permanencia es un riesgo crítico.'
      }
    ]
  },
  {
    id: 'f1_primer_cliente_grande',
    phaseId: 1,
    title: 'Contrato Tentador',
    weight: 8,
    description: 'Una empresa consolidada quiere contratarte, pero exige pagar a 120 días y exclusividad operativa.',
    options: [
      {
        text: 'Aceptar el contrato para ganar nombre y volumen.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'down' },
        effects: { capital: -15, reputacion: +20, bienestar: -10 },
        addTags: ['cliente_dependencia'],
        learningPill: 'Capital de Trabajo: Muchas empresas quiebran siendo rentables por no tener caja mientras esperan cobrar.'
      },
      {
        text: 'Rechazar y priorizar múltiples clientes chicos con pago al contado.',
        impactPreview: { capital: 'up', reputacion: 'neutral', bienestar: 'neutral' },
        effects: { capital: +10, reputacion: +5, bienestar: 0 },
        addTags: ['clientes_diversificados'],
        learningPill: 'Diversificación de Clientes: Ningún cliente debería representar más del 20% de tu facturación total.'
      }
    ]
  },

  // ==========================================
  // FASE 2: TRACCIÓN & CAJA (Turnos 5 a 8)
  // ==========================================
  {
    id: 'f2_crisis_cobro',
    phaseId: 2,
    title: 'El Gran Cliente Demora el Pago',
    weight: 25, // Muy probable si tenés el tag
    requiredTags: ['cliente_dependencia'],
    description: 'Tu cliente corporativo postergó su liquidación 45 días más. No alcanzás a cubrir los costos fijos del mes.',
    options: [
      {
        text: 'Tomar un crédito rápido a tasa usurera.',
        impactPreview: { capital: 'up', reputacion: 'neutral', bienestar: 'down' },
        effects: { capital: +15, reputacion: 0, bienestar: -20 },
        addTags: ['deuda_riesgosa'],
        learningPill: 'Apalancamiento Tóxico: Endeudarse caro para cubrir costos corrientes suele iniciar una espiral de insolvencia.'
      },
      {
        text: 'Renegociar plazos con proveedores y congelar retiros propios.',
        impactPreview: { capital: 'down', reputacion: 'down', bienestar: 'down' },
        effects: { capital: -5, reputacion: -15, bienestar: -15 },
        learningPill: 'Gestión de Liquidez: En momentos de estrés de caja, la transparencia con la cadena comercial evita la quiebra.'
      }
    ]
  },
  {
    id: 'f2_proveedor_critico',
    phaseId: 2,
    title: 'El Dilema de Abastecimiento',
    weight: 10,
    description: 'Podés importar insumos/servicios clave a mitad de precio de un solo proveedor, o mantener varios proveedores locales más caros.',
    options: [
      {
        text: 'Importar con el proveedor único para maximizar margen.',
        impactPreview: { capital: 'up', reputacion: 'neutral', bienestar: 'neutral' },
        effects: { capital: +20, reputacion: 0, bienestar: 0 },
        addTags: ['proveedor_dependiente'],
        learningPill: 'Riesgo de Cadena de Suministro: Optimizar solo por costo te vuelve vulnerable a aduanas y devaluaciones.'
      },
      {
        text: 'Mantener la red local diversificada.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'up' },
        effects: { capital: -10, reputacion: +10, bienestar: +5 },
        addTags: ['proveedores_diversificados'],
        learningPill: 'Resiliencia Operativa: Pagar una prima por proveedores confiables es una póliza de seguro contra crisis.'
      }
    ]
  },
  {
    id: 'f2_sobrecarga_equipo',
    phaseId: 2,
    title: 'Pico de Demanda y Cuello de Botella',
    weight: 10,
    description: 'Las ventas crecieron un 60%, pero el equipo no da abasto. Hay quejas de clientes por demoras.',
    options: [
      {
        text: 'Exigir horas extras y redoblar el esfuerzo sin sumar gente.',
        impactPreview: { capital: 'up', reputacion: 'down', bienestar: 'down' },
        effects: { capital: +15, reputacion: -10, bienestar: -25 },
        addTags: ['equipo_sobrecargado'],
        learningPill: 'Deuda Operativa: Forzar la capacidad instalada genera fallas de calidad y rotación no deseada de talento.'
      },
      {
        text: 'Frenar nuevas ventas y contratar ayuda de inmediato.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'up' },
        effects: { capital: -20, reputacion: +15, bienestar: +10 },
        addTags: ['procesos_solidos'],
        learningPill: 'Crecimiento Sostenible: Escalar antes de estabilizar las operaciones suele romper el negocio.'
      }
    ]
  },
  // ==========================================
  // FASE 3: ESCALA & CRISIS (Turnos 9 a 12)
  // ==========================================
  {
    id: 'f3_shock_externo',
    phaseId: 3,
    title: 'Cierre de Importaciones / Devaluación',
    weight: 20, // Ruleta contextual
    description: 'El gobierno impone restricciones cambiarias y aduaneras severas. El mercado está en pánico.',
    options: [
      {
        text: 'Ajustar precios inmediatamente trasladando el 100% de la inflación.',
        impactPreview: { capital: 'up', reputacion: 'down', bienestar: 'neutral' },
        effects: { capital: +10, reputacion: -20, bienestar: -5 },
        learningPill: 'Poder de Fijación de Precios (Pricing Power): Trasladar costos sin valor diferencial destruye la fidelidad del cliente.'
      },
      {
        text: 'Absorber parte del costo para ganar clientes de la competencia.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'down' },
        effects: { capital: -25, reputacion: +25, bienestar: -10 },
        learningPill: 'Estrategia Competitiva en Crisis: Las empresas con caja pueden ganar cuota de mercado sacrificando margen temporal.'
      }
    ]
  },
  {
    id: 'f3_ronda_inversion',
    phaseId: 3,
    title: 'Llega un Fondo de Inversión',
    weight: 10,
    description: 'Un fondo de Venture Capital ofrece 200k USD, pero exige el 35% de la empresa y una silla con derecho a veto en el directorio.',
    options: [
      {
        text: 'Aceptar la inversión para pisar el acelerador.',
        impactPreview: { capital: 'up', reputacion: 'up', bienestar: 'down' },
        effects: { capital: +35, reputacion: +15, bienestar: -15 },
        addTags: ['inversion_externa', 'equity_diluido'],
        learningPill: 'Venture Capital: Inyecta velocidad extrema a cambio de perder autonomía sobre el rumbo de tu propia empresa.'
      },
      {
        text: 'Rechazar la oferta y continuar autofinanciados (Bootstrapping).',
        impactPreview: { capital: 'neutral', reputacion: 'neutral', bienestar: 'up' },
        effects: { capital: 0, reputacion: +5, bienestar: +10 },
        addTags: ['autonomia_estrategica'],
        learningPill: 'Bootstrapping: Crecer con tus propios ingresos te da libertad absoluta, pero limita tu velocidad de expansión.'
      }
    ]
  },
  {
    id: 'f3_disputa_socios',
    phaseId: 3,
    title: 'Guerra en el Directorio',
    weight: 30, // Se activa si elegiste al socio conflictivo
    requiredTags: ['socio_conflictivo'],
    description: 'Tu co-fundador quiere cambiar el rumbo del negocio y amenaza con bloquear las decisiones o llevarse clientes.',
    options: [
      {
        text: 'Comprar su parte pagando una prima alta para recuperar el control.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'up' },
        effects: { capital: -30, reputacion: +10, bienestar: +15 },
        removeTags: ['socio_conflictivo', 'equity_diluido'],
        learningPill: 'Disolución Societaria: Un conflicto entre fundadores sin resolver es la principal causa interna de muerte de startups.'
      },
      {
        text: 'Llevar el conflicto a la justicia y congelar sus atribuciones.',
        impactPreview: { capital: 'down', reputacion: 'down', bienestar: 'down' },
        effects: { capital: -15, reputacion: -25, bienestar: -30 },
        addTags: ['conflicto_legal'],
        learningPill: 'Seguridad Jurídica: La litigiosidad interna destruye la reputación institucional y espanta clientes e inversores.'
      }
    ]
  },
  {
    id: 'f3_crisis_burnout',
    phaseId: 3,
    title: 'El Equipo al Límite',
    weight: 30,
    requiredTags: ['equipo_sobrecargado'],
    description: 'Renuncian dos personas clave de tu equipo en plena entrega importante. El resto amenaza con irse.',
    options: [
      {
        text: 'Hacerte cargo personalmente de todo el trabajo operativo faltante.',
        impactPreview: { capital: 'neutral', reputacion: 'up', bienestar: 'down' },
        effects: { capital: 0, reputacion: +10, bienestar: -35 },
        learningPill: 'Liderazgo y Burnout: El fundador que actúa como bombero permanente termina siendo el cuello de botella de la empresa.'
      },
      {
        text: 'Asumir penalidades contractuales, frenar y dar un bono de retención.',
        impactPreview: { capital: 'down', reputacion: 'down', bienestar: 'up' },
        effects: { capital: -25, reputacion: -10, bienestar: +15 },
        removeTags: ['equipo_sobrecargado'],
        learningPill: 'Retención de Talento: Cuesta hasta 3 veces más reemplazar a un colaborador clave que invertir en su bienestar.'
      }
    ]
  },

  // ==========================================
  // FASE 4: CONSOLIDACIÓN & SALIDA (Turnos 13 a 15)
  // ==========================================
  {
    id: 'f4_competidor_gigante',
    phaseId: 4,
    title: 'Ataque Corporativo',
    weight: 10,
    description: 'El líder del mercado copió tu producto estrella y lo ofrece a pérdida gracias a su espalda financiera.',
    options: [
      {
        text: 'Bajar los precios para entrar en guerra tarifaria directa.',
        impactPreview: { capital: 'down', reputacion: 'neutral', bienestar: 'down' },
        effects: { capital: -30, reputacion: 0, bienestar: -20 },
        learningPill: 'Guerra de Precios: Competir por precio contra un rival con más capital es casi siempre una sentencia de quiebra.'
      },
      {
        text: 'Pivotar a un nicho de altísima especialización y servicio.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'up' },
        effects: { capital: -10, reputacion: +25, bienestar: +5 },
        learningPill: 'Diferenciación Estratégica: Cuando no podés ganar por escala, ganás por foco, cercanía y propuesta de valor única.'
      }
    ]
  },
  {
    id: 'f4_intento_compra_hostil',
    phaseId: 4,
    title: 'Oferta de Compra Hostil',
    weight: 25,
    requiredTags: ['equity_diluido'],
    description: 'Un competidor se alió en secreto con tus inversores externos y te ofrecen comprar tu parte obligadamente.',
    options: [
      {
        text: 'Vender tus acciones y aceptar un cheque millonario para retirarte.',
        impactPreview: { capital: 'up', reputacion: 'neutral', bienestar: 'up' },
        effects: { capital: +50, reputacion: +10, bienestar: +20 },
        addTags: ['salida_exitosa_venta'],
        learningPill: 'Estrategia de Salida (Exit): Vender la empresa no es fracasar; monetizar el valor creado es el objetivo de muchos fundadores.'
      },
      {
        text: 'Agotar tus ahorros personales en abogados para pelear por el control.',
        impactPreview: { capital: 'down', reputacion: 'down', bienestar: 'down' },
        effects: { capital: -35, reputacion: -15, bienestar: -30 },
        learningPill: 'Poder de Control: El porcentaje accionario define quién toma las decisiones cuando las papas queman.'
      }
    ]
  },
  {
    id: 'f4_legado_sostenible',
    phaseId: 4,
    title: 'El Dilema del Dividendo',
    weight: 15,
    requiredTags: ['autonomia_estrategica'],
    description: 'La empresa es rentable, predecible y sólida. ¿Qué hacés con las ganancias acumuladas?',
    options: [
      {
        text: 'Repartir dividendos y pasar a un rol de presidente de directorio.',
        impactPreview: { capital: 'up', reputacion: 'up', bienestar: 'up' },
        effects: { capital: +20, reputacion: +15, bienestar: +30 },
        addTags: ['lifestyle_business'],
        learningPill: 'Lifestyle Business: No todas las empresas deben volverse multinacionales; un negocio rentable y autónomo es un triunfo rotundo.'
      },
      {
        text: 'Reinvertir el 100% de los dividendos en abrir mercado internacional.',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'down' },
        effects: { capital: -25, reputacion: +30, bienestar: -15 },
        addTags: ['expansion_global'],
        learningPill: 'Internacionalización: Escalar fronteras multiplica el valor potencial, pero reinicia el ciclo de riesgo e incertidumbre.'
      }
    ]
  },
  {
    id: 'f4_auditoria_afip',
    phaseId: 4,
    title: 'Auditoría Fiscal General',
    weight: 8, // Cisne negro
    description: 'Los inspectores revisan minuciosamente tus libros contables y contrataciones de los últimos 3 años.',
    options: [
      {
        text: 'Presentar libros limpios (gastaste previamente en orden fiscal).',
        impactPreview: { capital: 'down', reputacion: 'up', bienestar: 'up' },
        effects: { capital: -10, reputacion: +20, bienestar: +10 },
        learningPill: 'Compliance y Formalización: La prolijidad fiscal y legal cuesta cara día a día, pero evita catástrofes repentinas.'
      },
      {
        text: 'Regularizar desprolijidades pasadas pagando multas e intereses.',
        impactPreview: { capital: 'down', reputacion: 'down', bienestar: 'down' },
        effects: { capital: -30, reputacion: -20, bienestar: -20 },
        learningPill: 'Pasivos Ocultos: La informalidad como atajo financiero suele cobrarse con creces cuando la empresa gana visibilidad.'
      }
    ]
  }
];