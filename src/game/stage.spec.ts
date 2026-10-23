import { describe, it, expect } from 'vitest';
import { actAt, STAGE_BY_EVENT, stageFor, stageTimeline } from './stage';
import { GAME_EVENTS } from '../data/events';

describe('stageFor', () => {
  it('returns null for regular dilemmas', () => {
    expect(stageFor({ id: 'f1_lo_que_sea', kind: 'main' })).toBeNull();
    expect(stageFor({ id: 'f1_sin_kind', kind: undefined })).toBeNull();
    expect(stageFor(null)).toBeNull();
  });

  it('falls back to the style of its kind for events without a variant', () => {
    expect(stageFor({ id: 'crisis_nueva', kind: 'crisis' })).toMatchObject({ tone: 'crisis', stamp: 'CRISIS' });
    expect(stageFor({ id: 'imp_nuevo', kind: 'unforeseen' })).toMatchObject({ tone: 'unforeseen', stamp: 'IMPREVISTO' });
  });

  it('applies the per-event variant over the default', () => {
    const viral = stageFor({ id: 'imp_viralizacion_inesperada', kind: 'unforeseen' });
    expect(viral).toMatchObject({ tone: 'opportunity', stamp: '¡VIRAL!', ribbon: 'Tendencia' });
    const quiebra = stageFor({ id: 'crisis_quiebra_inminente', kind: 'crisis' });
    expect(quiebra).toMatchObject({ tone: 'crisis', stamp: 'QUIEBRA', ribbon: 'Último momento' });
  });

  it('gives every crisis and unforeseen event in the catalog a stage with a short stamp and a ticker', () => {
    GAME_EVENTS.filter((e) => e.kind === 'crisis' || e.kind === 'unforeseen').forEach((e) => {
      const stage = stageFor(e);
      expect(stage, e.id).not.toBeNull();
      expect(stage!.stamp.length, e.id).toBeLessThanOrEqual(14);
      expect(stage!.ticker.length, e.id).toBeGreaterThan(0);
    });
  });

  it('only has variants for events that exist and are interruptions', () => {
    Object.keys(STAGE_BY_EVENT).forEach((id) => {
      const event = GAME_EVENTS.find((e) => e.id === id);
      expect(event, `${id} no existe en el catálogo`).toBeDefined();
      expect(['crisis', 'unforeseen'], id).toContain(event!.kind);
    });
  });
});

describe('stageTimeline / actAt', () => {
  it('reaches the reading act in about 2 seconds, skippable from the suspense act', () => {
    const t = stageTimeline('crisis', false);
    expect(t.acts[3]).toBeGreaterThanOrEqual(2000);
    expect(t.acts[3]).toBeLessThanOrEqual(2500);
    expect(t.skippableAt).toBe(t.acts[2]);
  });

  it('makes unforeseen events and opportunities reach the reading act sooner than crises', () => {
    expect(stageTimeline('unforeseen', false).acts[3]).toBeLessThan(stageTimeline('crisis', false).acts[3]);
    expect(stageTimeline('opportunity', false).acts[3]).toBeLessThan(stageTimeline('crisis', false).acts[3]);
  });

  it('shows everything at once and is skippable from the start with reduced motion', () => {
    const t = stageTimeline('crisis', true);
    expect(actAt(t, 0)).toBe(3);
    expect(t.skippableAt).toBe(0);
    expect(actAt(t, t.acts[3])).toBe(4);
  });

  it('walks through the acts in order', () => {
    const t = stageTimeline('crisis', false);
    expect([0, 149, 150, 899, 900, 1300, 2299, 2300, 5000].map((ms) => actAt(t, ms))).toEqual([0, 0, 1, 1, 2, 3, 3, 4, 4]);
  });
});
