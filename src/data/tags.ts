export const TAGS = {
  // Fase 1: Génesis & Validación
  cultura_lean: {
    label: 'Cultura Lean',
    modifiers: { capital: 1, reputacion: -1 },
  },
  obsesion_calidad: {
    label: 'Obsesión por la Calidad',
    modifiers: { capital: -2, reputacion: 1, bienestar: -1 },
  },
  socio_alineado: {
    label: 'Socio Alineado',
    modifiers: { reputacion: 1, bienestar: 1 },
  },
  socio_conflictivo: {
    label: 'Socio Conflictivo',
    modifiers: {},
  },
  equity_diluido: {
    label: 'Equity Diluido',
    modifiers: {},
  },
  cliente_dependencia: {
    label: 'Dependencia de Cliente',
    modifiers: {},
  },
  clientes_diversificados: {
    label: 'Clientes Diversificados',
    modifiers: { capital: 1, reputacion: 1 },
  },

  // Tags de arquetipos (setup inicial)
  calidad_producto: {
    label: 'Calidad de Producto',
    modifiers: { capital: -1, reputacion: 2 },
  },
  generacion_ingresos: {
    label: 'Generación de Ingresos',
    modifiers: { capital: 2 },
  },
  red_contactos: {
    label: 'Red de Contactos',
    modifiers: { reputacion: 2 },
  },
  inversiones: {
    label: 'Inversiones',
    modifiers: { capital: 2 },
  },
  patrimonio: {
    label: 'Patrimonio',
    modifiers: { capital: 1, bienestar: 1 },
  },

  // Fase 2: Tracción & Caja
  deuda_riesgosa: {
    label: 'Deuda Riesgosa',
    modifiers: { capital: -3, bienestar: -1 },
  },
  proveedor_dependiente: {
    label: 'Proveedor Dependiente',
    modifiers: { capital: 2 },
  },
  proveedores_diversificados: {
    label: 'Proveedores Diversificados',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
  },
  equipo_sobrecargado: {
    label: 'Equipo Sobrecargado',
    modifiers: {},
  },
  procesos_solidos: {
    label: 'Procesos Sólidos',
    modifiers: { capital: -1, reputacion: 1, bienestar: 1 },
  },

  // Fase 3: Escala & Crisis
  inversion_externa: {
    label: 'Inversión Externa',
    modifiers: { capital: 2, reputacion: 1, bienestar: -1 },
  },
  autonomia_estrategica: {
    label: 'Autonomía Estratégica',
    modifiers: {},
  },
  conflicto_legal: {
    label: 'Conflicto Legal',
    modifiers: { capital: -2, reputacion: -2, bienestar: -2 },
  },

  // Fase 4: Consolidación & Salida
  salida_exitosa_venta: {
    label: 'Salida Exitosa por Venta',
    modifiers: { capital: 4, reputacion: 1, bienestar: 2 },
  },
  lifestyle_business: {
    label: 'Lifestyle Business',
    modifiers: { capital: 1, reputacion: 1, bienestar: 2 },
  },
  expansion_global: {
    label: 'Expansión Global',
    modifiers: { capital: -2, reputacion: 2, bienestar: -1 },
  },
} as const;

export type Tag = keyof typeof TAGS;