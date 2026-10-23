import { useMemo, useState } from 'react';
import { GAME_EVENTS } from '../../data/events/index';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { TAGS, type Tag } from '../../data/tags';
import { startGame, applyDecision } from '../../game/engine';
import MinigameStage from '../game/minigames/MinigameStage';
import { PERFORMANCE_LABEL } from '../../game/minigames/performance';
import type { GameEvent, GameOption, GameState, Metrics, Performance } from '../../types/game';
import Button from '../common/Button';

/**
 * Laboratorio de minijuegos (solo `pnpm dev`, en /dev/minijuegos): juega cada opción con minijuego
 * del contenido real, con métricas y tags a mano. No toca la partida guardada.
 */

interface LabOption {
  key: string;
  eventId: string;
  eventTitle: string;
  eventKind: GameEvent['kind'];
  index: number;
  option: GameOption;
}

const LAB_OPTIONS: LabOption[] = GAME_EVENTS.flatMap((ev) =>
  ev.options.flatMap((option, index) =>
    option.minigame
      ? [{ key: `${ev.id}#${index}`, eventId: ev.id, eventTitle: ev.title, eventKind: ev.kind, index, option }]
      : []
  )
);

const METRIC_LABELS: Record<keyof Metrics, string> = { capital: 'Capital', reputacion: 'Reputación', bienestar: 'Bienestar' };
const TIERS: Performance[] = ['perfect', 'good', 'poor'];
const TIER_HEADERS: Record<Performance, string> = { perfect: 'Perfecto', good: 'Sólido', poor: 'Flojo' };
const ALL_TAGS = Object.keys(TAGS) as Tag[];

const signed = (n: number | undefined) => (n === undefined || n === 0 ? '0' : `${n > 0 ? '+' : ''}${n}`);

const randomSeed = () => Math.floor(Math.random() * 100000);

export default function MinigameLab() {
  const [optionKey, setOptionKey] = useState(LAB_OPTIONS[0].key);
  const [seed, setSeed] = useState(52);
  const [metrics, setMetrics] = useState<Metrics>({ capital: 50, reputacion: 50, bienestar: 50 });
  const [tags, setTags] = useState<Tag[]>([]);
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState<{ performance: Performance; skipped: boolean } | null>(null);

  const lab = LAB_OPTIONS.find((o) => o.key === optionKey) ?? LAB_OPTIONS[0];
  const spec = lab.option.minigame!;

  const state: GameState = useMemo(
    () => ({ ...startGame(ARCHETYPES[0], FINANCINGS[0]), metrics, activeTags: tags }),
    [metrics, tags]
  );

  // Qué pasa con cada rendimiento: efectos, métricas resultantes y tags que cambian
  const preview = TIERS.map((tier) => {
    const next = applyDecision(state, lab.option, lab.eventId, lab.eventTitle, lab.index, lab.eventKind, tier);
    const added = next.activeTags.filter((t) => !state.activeTags.includes(t));
    const removed = state.activeTags.filter((t) => !next.activeTags.includes(t));
    return { tier, effects: next.lastDecision?.effects ?? {}, metrics: next.metrics, status: next.status, added, removed };
  });

  const toggleTag = (tag: Tag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const restart = () => {
    setResult(null);
    setRunId((n) => n + 1);
  };

  return (
    <main className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-5 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-night-sunken min-h-screen">
      <header className="space-y-1">
        <p className="text-2xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Solo desarrollo</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Laboratorio de minijuegos</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Juega las opciones con minijuego del contenido real. No toca la partida guardada.
        </p>
      </header>

      <section className="space-y-3 p-4 rounded-xl bg-white dark:bg-night-raised border border-slate-200 dark:border-slate-700">
        <label className="block space-y-1">
          <span className="text-xs font-semibold">Opción</span>
          <select
            value={optionKey}
            onChange={(e) => {
              setOptionKey(e.target.value);
              restart();
            }}
            className="w-full p-2 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
          >
            {LAB_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.eventTitle} · opción {o.index + 1}: {o.option.text.slice(0, 48)}… [{o.option.minigame!.kind}]
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold">Semilla</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => {
                setSeed(Number(e.target.value) || 0);
                restart();
              }}
              className="w-28 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </label>
          <Button
            onClick={() => {
              setSeed(randomSeed());
              restart();
            }}
            variant="secondary"
            className="px-3 py-2 rounded-lg text-xs"
          >
            Otra semilla
          </Button>
          <Button
            onClick={restart}
            className="px-3 py-2 rounded-lg text-xs"
          >
            Reiniciar ronda
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((key) => (
            <label key={key} className="space-y-1">
              <span className="text-xs font-semibold">
                {METRIC_LABELS[key]}: {metrics[key]}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={metrics[key]}
                onChange={(e) => setMetrics((m) => ({ ...m, [key]: Number(e.target.value) }))}
                className="w-full accent-brand-cobalt"
              />
            </label>
          ))}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold">Tags activos ({tags.length})</span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((tag) => {
              const on = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded-md text-2xs font-medium border ${
                    on
                      ? 'bg-brand-cobalt text-white border-brand-cobalt'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {TAGS[tag].label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold">Qué hace cada rendimiento</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-night-raised">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="p-2 font-semibold">Efecto</th>
                {preview.map((p) => (
                  <th key={p.tier} className="p-2 font-semibold">{TIER_HEADERS[p.tier]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((key) => (
                <tr key={key} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-2">{METRIC_LABELS[key]}</td>
                  {preview.map((p) => (
                    <td key={p.tier} className="p-2">
                      {signed(p.effects[key])} → {p.metrics[key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-2">Tags</td>
                {preview.map((p) => (
                  <td key={p.tier} className="p-2 space-y-0.5">
                    {p.added.map((t) => (
                      <div key={`+${t}`} className="text-emerald-600 dark:text-emerald-400">+ {TAGS[t].label}</div>
                    ))}
                    {p.removed.map((t) => (
                      <div key={`-${t}`} className="text-rose-600 dark:text-rose-400">− {TAGS[t].label}</div>
                    ))}
                    {p.added.length === 0 && p.removed.length === 0 && <span className="text-slate-400">sin cambios</span>}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-2">Estado</td>
                {preview.map((p) => (
                  <td key={p.tier} className="p-2">{p.status === 'playing' ? 'sigue' : p.status}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <MinigameStage
          key={`${runId}-${optionKey}-${seed}`}
          spec={spec}
          seed={seed}
          reputation={metrics.reputacion}
          activeTags={tags}
          onResolve={(performance) => setResult({ performance, skipped: false })}
          onSkip={() => setResult({ performance: 'good', skipped: true })}
        />

        {result && (
          <div className="p-4 rounded-xl bg-white dark:bg-night-raised border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {PERFORMANCE_LABEL[result.performance]}
              {result.skipped && <span className="font-normal text-slate-500 dark:text-slate-400"> (saltado)</span>}
            </p>
            <Button
              onClick={restart}
              className="px-4 py-2 rounded-lg text-sm"
            >
              Jugar de nuevo
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
