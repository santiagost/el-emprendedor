import { defineEvent, defineOption } from './builders';

/**
 * Eventos de rescate: salen una sola vez por partida, cuando una métrica toca 0 por primera vez, en vez de perder.
 * Hay uno por métrica (id `rescate_<métrica>`); la métrica vuelve a un nivel bajo y el costo queda en las otras o en un tag.
 * Los costos inmediatos son chicos a propósito: el rescate no tiene que matar a la empresa por otro lado.
 */
export const rescueEvents = [
  defineEvent({
    id: 'rescate_capital',
    title: 'Sin un peso: la última oportunidad',
    description:
      'La caja llegó a cero. No hay con qué pagar sueldos ni proveedores y la empresa está a un paso de cerrar. Todavía hay una salida, pero solo una, y no sale gratis.',
    options: [
      defineOption(
        'Vender equipos y pedirle un adelanto a tus mejores clientes para pagar lo urgente.',
        { capital: 30, reputacion: -5 },
        {
          learningPill:
            'Liquidez de Emergencia: Cuando la caja se agota, convertir activos y adelantar cobros compra tiempo, pero deja menos margen para crecer y expone la relación con los clientes.',
          outcomeText:
            'Con el dinero de los equipos y los adelantos cubriste lo más urgente. Algunos clientes no escondieron su fastidio, pero la empresa sigue en pie.',
        }
      ),
      defineOption(
        'Aceptar un préstamo de emergencia, caro pero rápido.',
        { capital: 35, bienestar: -5 },
        {
          addTags: ['deuda_riesgosa'],
          learningPill:
            'Deuda de Último Recurso: Un préstamo caro resuelve hoy y condiciona los meses siguientes, porque los intereses se pagan aunque las ventas no lleguen.',
          outcomeText:
            'El préstamo entró en 48 horas y la empresa respiró. Ahora cada mes sale una parte de la caja para pagar los intereses, y eso se nota en el ánimo del equipo.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'rescate_bienestar',
    title: 'El equipo no da más: la última oportunidad',
    description:
      'El cansancio llegó al límite. Hay gente que renuncia, errores todos los días y un clima que ya no se aguanta. Todavía podés darlo vuelta, pero solo esta vez.',
    options: [
      defineOption(
        'Frenar una semana entera y devolverle al equipo el descanso que le debías.',
        { bienestar: 30, capital: -5, reputacion: -5 },
        {
          learningPill:
            'Recuperación del Equipo: Parar a tiempo cuesta entregas y algo de caja, pero un equipo agotado produce poco y comete errores que cuestan más.',
          outcomeText:
            'La semana de pausa retrasó entregas y se notó en la caja. A cambio, el equipo volvió con energía y las renuncias se frenaron.',
        }
      ),
      defineOption(
        'Ofrecerles una parte de la empresa a las personas clave para que se queden.',
        { bienestar: 30, capital: -5 },
        {
          addTags: ['equity_diluido'],
          learningPill:
            'Equity como Retención: Repartir participación ancla a las personas clave, pero cada porcentaje que cedés es control y ganancias que no vuelven.',
          outcomeText:
            'Las personas clave aceptaron quedarse con una parte de la empresa. El clima mejoró de inmediato, aunque ahora tus decisiones se comparten con más gente.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'rescate_reputacion',
    title: 'Tu nombre en el piso: la última oportunidad',
    description:
      'Nadie confía en tu empresa. Los clientes se van, los proveedores piden pago adelantado y tu nombre circula en malos comentarios. Todavía hay una forma de remontar, pero solo una.',
    options: [
      defineOption(
        'Pedir disculpas públicas, devolver el dinero y rehacer lo que falló.',
        { reputacion: 30, capital: -5 },
        {
          learningPill:
            'Gestión de Crisis de Reputación: Reconocer el error y repararlo a tu costo es lo que más rápido devuelve la confianza, aunque duela en la caja.',
          outcomeText:
            'Dar la cara y devolver el dinero dolió, pero los clientes que se quedaron lo valoraron. Empezaste a recuperar tu nombre.',
        }
      ),
      defineOption(
        'Aliarte con un socio conocido que ponga su nombre junto al tuyo.',
        { reputacion: 25, bienestar: -5 },
        {
          addTags: ['socio_conflictivo'],
          learningPill:
            'Reputación Prestada: Apoyarte en un nombre conocido devuelve confianza rápido, pero esa confianza depende del socio, que además va a querer opinar.',
          outcomeText:
            'Con un socio conocido al lado, el mercado volvió a escucharte. A cambio, ahora tenés a alguien que opina sobre cada paso y no siempre coincide con vos.',
        }
      ),
    ],
  }),
];
