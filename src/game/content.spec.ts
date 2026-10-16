import { describe, it, expect } from 'vitest';
import { GAME_EVENTS } from '../data/events';
import { PHASES } from './phases';
import { _templateBaseEvent, _templateGatedEvent } from '../data/events/_template';

import {
  validateEventIds,
  validateOptionsAndPills,
  validateTagsIntegrity,
  validatePhasePacing,
  validateScheduledEvents,
  detectOrphanTags,
  detectDuplicateImpacts,
} from './validation';

describe('Integridad de Contenido (Content Spec)', () => {
  it('todos los eventos tienen IDs únicos y prefijo correcto de fase', () => {
    const errors = validateEventIds(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('todas las opciones tienen 2-3 opciones y learningPill obligatoria', () => {
    const errors = validateOptionsAndPills(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('todos los tags referenciados existen en el registry TAGS', () => {
    const errors = validateTagsIntegrity(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('los eventos programados (schedule) apuntan a IDs existentes', () => {
    const errors = validateScheduledEvents(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('cada fase tiene suficientes eventos base para sus turnos', () => {
    const errors = validatePhasePacing(GAME_EVENTS, PHASES);
    expect(errors).toEqual([]);
  });

  it('el template de autoría produce eventos válidos', () => {
    const errors = [
      ...validateEventIds([_templateBaseEvent, _templateGatedEvent]),
      ...validateOptionsAndPills([_templateBaseEvent, _templateGatedEvent]),
      ...validateTagsIntegrity([_templateBaseEvent, _templateGatedEvent]),
      ...validateScheduledEvents([_templateBaseEvent, _templateGatedEvent]),
    ];
    expect(errors).toEqual([]);
  });
});

describe('Balance de Contenido (warnings informativos)', () => {
  it('reporta tags huérfanos (no bloquea)', () => {
    const warnings = detectOrphanTags(GAME_EVENTS);
    if (warnings.length > 0) {
      console.log('\nTags huérfanos:');
      warnings.forEach((w) => console.log(`  - ${w}`));
    }
    expect(warnings).toBeDefined();
  });

  it('reporta impactos numéricos repetidos entre opciones (no bloquea)', () => {
    const warnings = detectDuplicateImpacts(GAME_EVENTS);
    if (warnings.length > 0) {
      console.log('\nImpactos repetidos:');
      warnings.forEach((w) => console.log(`  - ${w}`));
    }
    expect(warnings).toBeDefined();
  });
});
