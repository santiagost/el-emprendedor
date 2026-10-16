import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startGame, getInitialEvent, selectNextEvent, applyDecision, advanceTurn } from './engine';
import { createRng } from './rng';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import type { GameState, GameEvent, GameOption } from '../types/game';

type Strategy = 'random' | 'maxSum' | 'maxMin';

interface SimResult {
  victory: number;
  game_over_capital: number;
  game_over_bienestar: number;
  game_over_reputacion: number;
  ended_early: number;
}

// Selector de opción según estrategia
function pickOption(
  event: GameEvent,
  state: GameState,
  strategy: Strategy,
  rng: ReturnType<typeof createRng>
): GameOption {
  if (strategy === 'random') {
    const idx = Math.floor(rng.nextFloat(0, 1) * event.options.length);
    return event.options[idx];
  }

  return event.options.reduce((best, option) => {
    const cap = state.metrics.capital + (option.effects.capital ?? 0);
    const bien = state.metrics.bienestar + (option.effects.bienestar ?? 0);
    const rep = state.metrics.reputacion + (option.effects.reputacion ?? 0);

    if (strategy === 'maxSum') {
      const bestCap = state.metrics.capital + (best.effects.capital ?? 0);
      const bestBien = state.metrics.bienestar + (best.effects.bienestar ?? 0);
      const bestRep = state.metrics.reputacion + (best.effects.reputacion ?? 0);
      return cap + bien + rep > bestCap + bestBien + bestRep ? option : best;
    }

    // maxMin: defiende la métrica más baja
    const currentMin = Math.min(cap, bien, rep);
    const bestMin = Math.min(
      state.metrics.capital + (best.effects.capital ?? 0),
      state.metrics.bienestar + (best.effects.bienestar ?? 0),
      state.metrics.reputacion + (best.effects.reputacion ?? 0)
    );
    return currentMin > bestMin ? option : best;
  }, event.options[0]);
}

// Corre una partida completa hasta su desenlace
function simulateGame(strategy: Strategy, seed: number): GameState['status'] {
  const rng = createRng(seed);
  const arquetipo = ARCHETYPES[0];
  const financiamiento = FINANCINGS[0];

  let state = startGame(arquetipo, financiamiento);
  let currentEvent: GameEvent | null = getInitialEvent(rng);

  while (state.status === 'playing' && currentEvent) {
    const option = pickOption(currentEvent, state, strategy, rng);
    state = applyDecision(state, option, currentEvent.id);

    if (state.status !== 'playing') break;

    // Replica exactamente el advance() del hook: primero avanza el turno, después sortea
    const { nextTurn, nextPhaseId } = advanceTurn(state.currentTurn, state.maxTurns);
    const advanced: GameState = { ...state, currentTurn: nextTurn, phaseId: nextPhaseId };

    const selection = selectNextEvent(advanced, rng);
    if (selection.endedEarly) {
      state = { ...advanced, status: 'ended_early', pendingEvents: selection.remainingPending };
      break;
    }

    state = { ...advanced, pendingEvents: selection.remainingPending };
    currentEvent = selection.event;
  }

  return state.status;
}

// Ejecuta N corridas para una estrategia
function runBatch(strategy: Strategy, runs = 10000): SimResult {
  const tally: SimResult = {
    victory: 0,
    game_over_capital: 0,
    game_over_bienestar: 0,
    game_over_reputacion: 0,
    ended_early: 0,
  };

  for (let i = 0; i < runs; i++) {
    const outcome = simulateGame(strategy, 1000 + i);
    if (outcome in tally) {
      tally[outcome as keyof SimResult]++;
    }
  }

  return tally;
}

describe('Simulación de Completabilidad (Monte Carlo)', () => {
  const STRATEGIES: Strategy[] = ['random', 'maxSum', 'maxMin'];

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(STRATEGIES)(
    'estrategia "%s" no produce softlocks (0 ended_early) y permite victoria (> 0%)',
    (strategy) => {
      const runs = 2000; // 2.000 por estrategia en test suite mantiene ejecución rápida
      const results = runBatch(strategy, runs);

      console.log(`\nDistribución [${strategy}] (${runs} partidas):`);
      console.table(results);

      // Criterios de aceptación del plan
      expect(results.ended_early, `Softlocks detectados en estrategia ${strategy}`).toBe(0);
      expect(results.victory, `Victoria inalcanzable en estrategia ${strategy}`).toBeGreaterThan(0);
    }
  );
});