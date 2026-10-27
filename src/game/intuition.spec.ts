import { describe, it, expect } from 'vitest';
import { intuitionMissMessage } from './intuition';
import { trendsOf } from '../data/events/builders';

describe('intuitionMissMessage', () => {
  const expected = trendsOf({ capital: 10, reputacion: -10 });

  it('avisa cuando se esperaba ganar y se perdió', () => {
    expect(intuitionMissMessage(expected, { capital: -5, reputacion: -10 })).toBe(
      'Esta vez tu intuición falló: esperabas ganar Capital, pero perdiste.'
    );
  });

  it('avisa cuando se esperaba perder y se ganó', () => {
    expect(intuitionMissMessage(expected, { capital: 10, reputacion: 5 })).toBe(
      'Esta vez tu intuición falló: esperabas perder Reputación, pero ganaste.'
    );
  });

  it('avisa cuando no se esperaba movimiento', () => {
    expect(intuitionMissMessage(expected, { capital: 10, reputacion: -10, bienestar: -5 })).toBe(
      'Esta vez tu intuición falló: no esperabas que Bienestar se moviera, pero bajó.'
    );
  });

  it('no dice nada si el resultado coincide con la tendencia', () => {
    expect(intuitionMissMessage(expected, { capital: 20, reputacion: -3 })).toBeNull();
  });
});
