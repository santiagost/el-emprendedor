import { defineEvent, defineOption } from './builders';

export const unforeseenEvents = [
  defineEvent({
    id: 'imp_salto_inflacionario',
    title: '⚡ Salto Inflacionario Imprevisto',
    kind: 'unforeseen',
    description:
      'Un shock macroeconómico disparó los costos de insumos, servicios y alquileres un 35% de golpe. El presupuesto del mes quedó desactualizado.',
    weight: 15,
    options: [
      defineOption(
        'Actualizar tarifas de inmediato para proteger los márgenes.',
        { capital: 10, reputacion: -15, bienestar: -5 },
        {
          learningPill:
            'Inflación y Pricing: En contextos inflacionarios, demorar el ajuste de precios descapitaliza la empresa en cuestión de semanas.',
          outcomeText:
            'Ajustaste tarifas rápidamente. Aunque perdiste algunos clientes descontentos, protegiste el margen operativo de la empresa.',
        }
      ),
      defineOption(
        'Absorber el aumento temporalmente renegociando plazos con proveedores.',
        { capital: -15, reputacion: 10, bienestar: 5 },
        {
          learningPill:
            'Relación con Proveedores: Usar la buena reputación comercial permite ganar aire financiero renegociando condiciones de pago en momentos de shock.',
          outcomeText:
            'Tus proveedores aceptaron mantener condiciones por tu historial intachable. La caja sintió el golpe, pero tus clientes valoraron el esfuerzo.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_caida_servidores',
    title: '⚡ Caída Crítica de Servidores',
    kind: 'unforeseen',
    description:
      'Una falla técnica imprevista en la nube dejó tus sistemas caídos durante 6 horas en pleno horario de mayor demanda. Clientes molestos inundan soporte.',
    weight: 15,
    options: [
      defineOption(
        'Invertir en infraestructura redundante y soporte enterprise 24/7.',
        { capital: -15, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Disponibilidad y SLA: Invertir en robustez técnica cuesta dinero, pero cada caída de servicio erosiona la confianza del cliente y acelera cancelaciones.',
          outcomeText:
            'Migraste a una infraestructura blindada. El costo fue alto, pero nunca más sufriste una caída prolongada.',
        }
      ),
      defineOption(
        'Restaurar con backups internos y bonificar la cuota del mes a los afectados.',
        { capital: -10, reputacion: 5, bienestar: -10 },
        {
          learningPill:
            'Compensación al Cliente: Reconocer fallas operativas con bonificaciones concretas transforma una mala experiencia en lealtad a largo plazo.',
          outcomeText:
            'El equipo técnico pasó la noche en vela para restaurar la base. Las bonificaciones calmaron los ánimos de los usuarios clave.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_viralizacion_inesperada',
    title: '⚡ Viralización Inesperada en Redes',
    kind: 'unforeseen',
    description:
      'Un referente de tu nicho recomendó espontáneamente tu producto ante 200.000 seguidores. El tráfico y las altas se dispararon un 500% en un día.',
    weight: 12,
    options: [
      defineOption(
        'Habilitar lista de espera para asegurar que cada nuevo usuario tenga una experiencia impecable.',
        { reputacion: 20, bienestar: 5 },
        {
          learningPill:
            'Calidad vs Volumen: Crecer más rápido que tu capacidad de atención suele destruir la propuesta de valor. La exclusividad cuidada fideliza mejor.',
          outcomeText:
            'La lista de espera generó curiosidad y deseo de exclusividad. Cada cliente atendido se convirtió en embajador de la marca.',
        }
      ),
      defineOption(
        'Abrir las puertas a todo el tráfico y absorber la mayor cantidad de clientes posible.',
        { capital: 25, reputacion: -10, bienestar: -20 },
        {
          learningPill:
            'Escala Prematura: Capturar una ola masiva de demanda sin la estructura lista satura la atención y genera una oleada de críticas.',
          outcomeText:
            'Facturaste récord en una semana, pero el equipo colapsó de agotamiento y varias quejas de soporte aparecieron en redes.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_inspeccion_sorpresa',
    title: '⚡ Inspección Impositiva y Laboral Sorpresiva',
    kind: 'unforeseen',
    description:
      'Inspectores del organismo regulador se presentan en tus oficinas para una auditoría sorpresa de encuadre laboral, contratos y facturación.',
    weight: 12,
    options: [
      defineOption(
        'Acompañar con asesoría contable profesional y presentar libros limpios.',
        { capital: -10, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Costo de Compliance: Operar en regla cuesta dinero día a día, pero te protege de clausuras o multas confiscatorias ante auditorías sorpresa.',
          outcomeText:
            'La auditoría concluyó sin objeciones graves. La formalidad fiscal demostró ser tu mejor escudo protector.',
        }
      ),
      defineOption(
        'Solicitar prórroga administrativa para emprolijar inconsistencias con asesor legal.',
        { capital: -5, reputacion: -10, bienestar: -15 },
        {
          learningPill:
            'Riesgo Regulatorio: La informalidad como mecanismo de ahorro genera contingencias legales que estallan en el peor momento.',
          outcomeText:
            'La prórroga te dio tiempo para emprolijar contratos, pero la inspección quedó abierta y el estrés en el equipo se hizo notar.',
        }
      ),
    ],
  }),
];
