import { describe, expect, it } from 'vitest';
import { GAME_EVENTS } from '../data/events';
import { buildOptionHint, buildOutcomeForecast } from './optionHint';
import type { GameEvent } from '../types/game';

const MODAL = /\b(puede|pueda|pueden|podría|podrías|podrían|quizás|capaz|tal vez|riesgo)\b/gi;

describe('buildOptionHint', () => {
  it('es estable: el mismo evento da siempre el mismo texto', () => {
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((_, i) => expect(buildOptionHint(ev, i)).toBe(buildOptionHint(ev, i)));
    }
  });

  it('genera un texto no vacío para cada opción del catálogo', () => {
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((_, i) => expect(buildOptionHint(ev, i).length, `${ev.id}[${i}]`).toBeGreaterThan(0));
    }
  });

  it('no acumula más de tres condicionales por oración', () => {
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((_, i) => {
        for (const sentence of buildOptionHint(ev, i).split(/(?<=\.)\s/)) {
          expect((sentence.match(MODAL) ?? []).length, `${ev.id}[${i}]: ${sentence}`).toBeLessThanOrEqual(3);
        }
      });
    }
  });

  it('el hint manual de la opción gana sobre el generado', () => {
    const ev = structuredClone(GAME_EVENTS[0]) as GameEvent;
    ev.options[0].hint = 'Texto a mano.';
    expect(buildOptionHint(ev, 0)).toBe('Texto a mano.');
  });

  it('avisa consecuencias futuras cuando la opción agrega un tag latente', () => {
    const ev = GAME_EVENTS.find((e) => e.id === 'f1_primer_socio')!;
    expect(buildOptionHint(ev, 1)).toMatch(/más adelante|no termine acá/);
  });
});

describe('buildOutcomeForecast', () => {
  it('nunca afirma certezas: usa condicional o "puede que"', () => {
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((_, i) => {
        const text = buildOutcomeForecast(ev, i);
        if (text) expect(text, `${ev.id}[${i}]`).toMatch(/puede|capaz|quizás|podría/i);
      });
    }
  });
});
