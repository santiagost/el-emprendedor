import { describe, it, expect } from 'vitest';
import { GAME_EVENTS } from '../data/events';
import { PHASES } from './phases';

import {
  validateEventIds,
  validateOptionsAndPills,
  validateTagsIntegrity,
  validatePhasePacing,
  validateScheduledEvents,
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
});