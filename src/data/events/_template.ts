import { defineEvent, defineOption } from './builders';
import type { GameEvent } from '../../types/game';

// ============================================================================
// PERSONALIZACIÓN: token opcional {nombre}
// Se puede usar en title, description, option.text, outcomeText y learningPill.
// Se resuelve en el render (el motor guarda el texto crudo) y el texto debe leerse
// bien CON y SIN nombre. Convención:
//   - Al inicio de una oración: '{nombre}, un inversor pide una reunión.'
//     (sin nombre queda 'Un inversor pide una reunión.')
//   - Al final, antes de la puntuación: '¿Cómo salís al mercado, {nombre}?'
//   - O entre comas: 'Mirá, {nombre}, esto cambia todo.'
// Evitar género ("bienvenido/a"): usar voseo neutro. content.spec.ts valida la convención.
// ============================================================================

// ============================================================================
// PLANTILLA 1: Evento Base (sin condiciones de entrada)
// Aporta al cupo mínimo obligatorio de la fase para evitar softlocks.
// ============================================================================
export const _templateBaseEvent: GameEvent = defineEvent({
  // Convención obligatoria: f<fase>_<nombre_descriptivo>
  id: 'f1_nombre_del_dilema',
  phase: 1, // 1 | 2 | 3 | 4
  title: 'Título Claro del Dilema',
  description: 'Descripción concisa de la situación o encrucijada en 2 o 3 oraciones.',
  weight: 10, // Opcional (10 por defecto). Subir a 15-25 si querés mayor frecuencia.
  options: [
    defineOption(
      'Opción A: Primera alternativa de acción.',
      { capital: 10, reputacion: -10, bienestar: 0 },
      {
        addTags: ['cultura_lean'], // Opcional: deben existir en TAGS
        learningPill: 'Concepto Clave: Frase didáctica que explica la consecuencia de la decisión.',
      }
    ),
    defineOption(
      'Opción B: Segunda alternativa de acción.',
      { capital: -15, reputacion: 15, bienestar: -5 },
      {
        learningPill: 'Costo de Oportunidad: Lección práctica sobre la contrapartida de este camino.',
      }
    ),
  ],
});

// ============================================================================
// PLANTILLA 2: Evento Condicionado (con gating 'when')
// Solo puede salir sorteado si el jugador cumple los requisitos de tags.
// ============================================================================
export const _templateGatedEvent: GameEvent = defineEvent({
  id: 'f2_crisis_cliente_moroso',
  phase: 2,
  title: 'Facturas Impagas',
  description: 'Un cliente clave acumula 60 días de mora y pone en riesgo el flujo de caja.',
  weight: 25, // Mayor peso para que tenga prioridad al desbloquearse
  when: {
    tags: ['cliente_dependencia'],      // Requiere TODOS estos tags activos
    forbiddenTags: ['socio_alineado'], // No debe tener NINGUNO de estos tags
  },
  options: [
    defineOption(
      'Frenar el servicio hasta que regularice el pago.',
      { capital: -10, reputacion: -5, bienestar: 5 },
      {
        removeTags: ['cliente_dependencia'],
        // Opcional, solo fases 3 y 4, eventos principales y sin minijuego: desenlace que a veces sale en vez del normal
        // y contradice la flecha de la opción. Ver docs/EVENTOS.md, sección 8.
        // surprise: { effects: { capital: 5, reputacion: -5, bienestar: 5 }, outcomeText: 'Texto autosuficiente.' },
        learningPill: 'Poder de Negociación: Cortar servicios a clientes morosos frena la sangría de recursos.',
      }
    ),
    defineOption(
      'Ofrecer descuento por pronto pago y absorber la pérdida.',
      { capital: 15, reputacion: 5, bienestar: -10 },
      {
        learningPill: 'Liquidez vs Margen: En crisis, el flujo de caja diario manda sobre la rentabilidad teórica.',
      }
    ),
  ],
});

// ============================================================================
// PLANTILLA 3: Versión por rubro de un evento existente
// El mismo dilema contado en otro rubro: MISMAS cifras, etiquetas y minijuegos que el original, otro texto.
// El original (el de Tecnología) lleva `when: { rubro: ['r1_tecnologia'] }` y cada versión el suyo, con sufijo
// _comercio / _servicios / _produccion (ids en src/data/rubros.ts). content.spec.ts compara las cifras.
// Un evento SIN `when.rubro` sale para cualquier rubro: usalo solo si el texto no nombra nada de un rubro.
// ============================================================================
export const _templateRubroVariantEvent: GameEvent = defineEvent({
  id: 'f1_nombre_del_dilema_comercio',
  phase: 1,
  title: 'Título del Dilema en Comercio',
  description: 'La misma situación, contada con el vocabulario del rubro (stock, local, clientes de mostrador).',
  weight: 10,
  when: { rubro: ['r2_comercio'] },
  options: [
    defineOption(
      'Opción A: Primera alternativa, con el mismo efecto que el original.',
      { capital: 10, reputacion: -10, bienestar: 0 },
      {
        addTags: ['cultura_lean'],
        learningPill: 'Concepto Clave: Frase didáctica que explica la consecuencia de la decisión.',
      }
    ),
    defineOption(
      'Opción B: Segunda alternativa, con el mismo efecto que el original.',
      { capital: -15, reputacion: 15, bienestar: -5 },
      {
        learningPill: 'Costo de Oportunidad: Lección práctica sobre la contrapartida de este camino.',
      }
    ),
  ],
});

// ============================================================================
// PLANTILLA 4: Hito de la fase
// Sale en el primer año de su fase, antes que cualquier otro evento. Tiene que haber UNO por fase y rubro:
// content.spec.ts (validateMilestones) falla con 0 o con 2. Solo puede tener condición de rubro: sin tags,
// perfil, financiamiento, métricas ni eventos previos, porque tiene que poder salir siempre.
// ============================================================================
export const _templateMilestoneEvent: GameEvent = defineEvent({
  id: 'f2_nombre_del_hito',
  phase: 2,
  title: 'La Decisión que Define la Fase',
  description: 'Una decisión de peso que marca el paso a esta etapa de la empresa.',
  weight: 10,
  milestone: true,
  options: [
    defineOption(
      'Opción A: Camino que abre una consecuencia fuerte.',
      { capital: -10, reputacion: 15, bienestar: 0 },
      {
        learningPill: 'Concepto Clave: Frase didáctica que explica la consecuencia de la decisión.',
      }
    ),
    defineOption(
      'Opción B: Camino alternativo.',
      { capital: 10, reputacion: -10, bienestar: 0 },
      {
        learningPill: 'Costo de Oportunidad: Lección práctica sobre la contrapartida de este camino.',
      }
    ),
  ],
});

// ============================================================================
// PLANTILLA 5: Rescate
// Sale una sola vez por partida, cuando una métrica llega a 0 por primera vez. Hay UNO por métrica y el id es
// `rescate_<capital|bienestar|reputacion>` (el motor lo busca por ese nombre). Las opciones tienen que subir esa
// métrica (>= +25), con costos inmediatos de -5 como máximo: el costo grande va en un tag (addTags).
// Sin `when`, sin `weight` y sin sorpresas: no entra a ningún sorteo.
// ============================================================================
export const _templateRescueEvent: GameEvent = defineEvent({
  id: 'rescate_capital',
  title: 'Sin un Peso: la Última Oportunidad',
  description: 'Qué pasó, por qué es el límite y que todavía hay una salida, pero solo una y no sale gratis.',
  options: [
    defineOption(
      'Opción A: Salida con costo inmediato chico.',
      { capital: 30, reputacion: -5 },
      {
        learningPill: 'Concepto Clave: Qué enseña esta salida de emergencia.',
        outcomeText: 'Qué pasó al elegirla y qué costo queda.',
      }
    ),
    defineOption(
      'Opción B: Salida que deja una deuda o condición para más adelante.',
      { capital: 35, bienestar: -5 },
      {
        addTags: ['deuda_riesgosa'],
        learningPill: 'Concepto Clave: Por qué esta salida condiciona los años siguientes.',
        outcomeText: 'Qué pasó al elegirla y qué costo queda.',
      }
    ),
  ],
});
