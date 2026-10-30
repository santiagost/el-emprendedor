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
];
