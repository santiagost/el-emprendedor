import { describe, it, expect } from 'vitest';
import { GAME_EVENTS } from '../../data/events/index';

describe('Contenido con minijuegos', () => {
  it('si un evento tiene minijuego en una opción, lo tiene en todas (para no condicionar la elección)', () => {
    const mixed = GAME_EVENTS.filter((ev) => {
      const withGame = ev.options.filter((o) => o.minigame).length;
      return withGame > 0 && withGame < ev.options.length;
    });
    expect(mixed.map((ev) => ev.id)).toEqual([]);
  });
});
