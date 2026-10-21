import { describe, it, expect } from 'vitest';
import { personalize, localizeEvent, sanitizePlayerName } from './personalize';
import type { GameEvent } from '../types/game';

describe('sanitizePlayerName', () => {
  it('trims, collapses spaces and limits to 20 characters', () => {
    expect(sanitizePlayerName('  Ana   María  ')).toBe('Ana María');
    expect(sanitizePlayerName('x'.repeat(30))).toBe('x'.repeat(20));
  });

  it('removes braces so tokens cannot be nested', () => {
    expect(sanitizePlayerName('{nombre}')).toBe('nombre');
    expect(sanitizePlayerName('Sa{nti}ago')).toBe('Santiago');
  });

  it('returns undefined for empty or blank input', () => {
    expect(sanitizePlayerName('')).toBeUndefined();
    expect(sanitizePlayerName('   ')).toBeUndefined();
    expect(sanitizePlayerName('{}')).toBeUndefined();
    expect(sanitizePlayerName(null)).toBeUndefined();
    expect(sanitizePlayerName(undefined)).toBeUndefined();
  });
});

describe('personalize', () => {
  it('leaves text without token untouched', () => {
    expect(personalize('Sin token.', 'Santi')).toBe('Sin token.');
    expect(personalize('Sin token.')).toBe('Sin token.');
  });

  it('replaces every token with the name (and does not interpret $ patterns)', () => {
    expect(personalize('{nombre}, hola. Chau, {nombre}.', 'Santi')).toBe('Santi, hola. Chau, Santi.');
    expect(personalize('{nombre}, hola.', '$&')).toBe('$&, hola.');
  });

  it('drops a leading token and capitalizes the sentence', () => {
    expect(personalize('{nombre}, un inversor pide una reunión.')).toBe('Un inversor pide una reunión.');
    expect(personalize('{nombre}, ¿qué hacés?')).toBe('¿Qué hacés?');
  });

  it('drops a token at the start of a later sentence and capitalizes it', () => {
    expect(personalize('Tu cliente demoró el pago. {nombre}, no alcanzás a cubrir costos.')).toBe(
      'Tu cliente demoró el pago. No alcanzás a cubrir costos.'
    );
  });

  it('drops a trailing token before punctuation', () => {
    expect(personalize('¿Cómo salís al mercado, {nombre}?')).toBe('¿Cómo salís al mercado?');
    expect(personalize('Es tu decisión, {nombre}.')).toBe('Es tu decisión.');
    expect(personalize('Es tu decisión, {nombre}')).toBe('Es tu decisión');
  });

  it('drops a token between commas', () => {
    expect(personalize('Mirá, {nombre}, esto cambia todo.')).toBe('Mirá, esto cambia todo.');
  });

  it('never leaves braces, double spaces or spaces before punctuation', () => {
    const samples = ['{nombre}, hola', 'hola {nombre} chau', 'hola, {nombre}!', '{nombre}'];
    for (const s of samples) {
      const out = personalize(s);
      expect(out).not.toMatch(/[{}]/);
      expect(out).not.toMatch(/\s{2,}/);
      expect(out).not.toMatch(/\s[,.;:!?]/);
    }
  });
});

describe('localizeEvent', () => {
  const baseEvent = {
    id: 'f1_test',
    phaseId: 1,
    title: 'Título',
    description: '{nombre}, decidí rápido.',
    options: [
      { text: 'Sí, {nombre}.', impactPreview: { capital: 'up', bienestar: 'neutral', reputacion: 'neutral' }, effects: {}, outcomeText: '{nombre}, salió bien.', learningPill: 'Lección.' },
      { text: 'No.', impactPreview: { capital: 'down', bienestar: 'neutral', reputacion: 'neutral' }, effects: {} },
    ],
  } as unknown as GameEvent;

  it('personalizes every text field and keeps the rest of the event', () => {
    const named = localizeEvent(baseEvent, 'Santi');
    expect(named.description).toBe('Santi, decidí rápido.');
    expect(named.options[0].text).toBe('Sí, Santi.');
    expect(named.options[0].outcomeText).toBe('Santi, salió bien.');
    expect(named.options[1].outcomeText).toBeUndefined();
    expect(named.id).toBe(baseEvent.id);
  });

  it('removes tokens cleanly without a name', () => {
    const anon = localizeEvent(baseEvent);
    expect(anon.description).toBe('Decidí rápido.');
    expect(anon.options[0].text).toBe('Sí.');
    expect(anon.options[0].outcomeText).toBe('Salió bien.');
  });

  it('returns the same reference when no text uses tokens', () => {
    const plain = { ...baseEvent, description: 'Sin token.', options: [baseEvent.options[1], baseEvent.options[1]] } as unknown as GameEvent;
    expect(localizeEvent(plain, 'Santi')).toBe(plain);
  });
});
