import { describe, it, expect } from 'vitest';
import { parseSavedProfile } from './savedSession';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';

const save = (gameState: Record<string, unknown>) => JSON.stringify({ gameState, step: 'decision', seed: 1 });

describe('parseSavedProfile', () => {
  it('returns the archetype and financing of a game in progress', () => {
    const profile = parseSavedProfile(
      save({ status: 'playing', archetypeId: ARCHETYPES[1].id, financingId: FINANCINGS[2].id })
    );
    expect(profile?.arquetipo).toBe(ARCHETYPES[1]);
    expect(profile?.financiamiento).toBe(FINANCINGS[2]);
  });

  it('returns null when there is no save', () => {
    expect(parseSavedProfile(null)).toBeNull();
    expect(parseSavedProfile('')).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    expect(parseSavedProfile('{not json')).toBeNull();
    expect(parseSavedProfile('null')).toBeNull();
  });

  it('returns null when the game is not in progress', () => {
    expect(
      parseSavedProfile(save({ status: 'victory', archetypeId: ARCHETYPES[0].id, financingId: FINANCINGS[0].id }))
    ).toBeNull();
  });

  it('returns null when the save references unknown ids (old saves)', () => {
    expect(parseSavedProfile(save({ status: 'playing', archetypeId: 'nope', financingId: FINANCINGS[0].id }))).toBeNull();
    expect(parseSavedProfile(save({ status: 'playing', archetypeId: ARCHETYPES[0].id }))).toBeNull();
  });
});
