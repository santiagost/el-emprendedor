import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import type { GameEvent } from '../../types/game';
import { actAt, stageTimeline, type EventStage, type StageTone } from '../../game/stage';
import { useReducedMotion } from '../../lib/motion';
import { confetti, vibrate } from '../../lib/fx';
import { playSound } from '../../lib/sound';
import { EventKindIcon } from '../common/EventKindIcon';

interface InterruptionStageProps {
  /** Evento ya personalizado (título y descripción con el nombre resuelto). */
  event: GameEvent;
  stage: EventStage;
  /** Se llama al terminar la coreografía (o al saltarla): la carta del evento queda a la vista. */
  onDone: () => void;
}

const TONE_UI: Record<StageTone, { backdrop: string; edge: string; ribbon: string; label: string; stamp: string; bar: string }> = {
  crisis: {
    backdrop: 'bg-black/80',
    edge: 'shadow-[inset_0_0_140px_rgba(244,63,94,0.55)]',
    ribbon: 'bg-rose-600 text-white',
    label: 'bg-rose-900 text-white',
    stamp: 'border-rose-500 text-rose-400 bg-rose-950/40',
    bar: 'bg-rose-500',
  },
  unforeseen: {
    backdrop: 'bg-black/70',
    edge: 'shadow-[inset_0_0_120px_rgba(245,158,11,0.4)]',
    ribbon: 'bg-amber-500 text-slate-950',
    label: 'bg-amber-700 text-white',
    stamp: 'border-amber-400 text-amber-300 bg-amber-950/40',
    bar: 'bg-amber-400',
  },
  opportunity: {
    backdrop: 'bg-emerald-950/75',
    edge: 'shadow-[inset_0_0_140px_rgba(52,211,153,0.45)]',
    ribbon: 'bg-emerald-500 text-emerald-950',
    label: 'bg-emerald-800 text-white',
    stamp: 'border-emerald-400 text-emerald-300 bg-emerald-950/40',
    bar: 'bg-emerald-400',
  },
};

/**
 * Coreografía de una interrupción en 4 actos: corte, cintilla, sello y suspenso.
 * El quinto momento es de lectura: el texto se desenfoca y queda a la vista hasta que el jugador sigue
 * (Espacio, Enter o clic). Recién ahí el overlay se desvanece y Game revela la carta.
 */
export default function InterruptionStage({ event, stage, onDone }: InterruptionStageProps) {
  const reducedMotion = useReducedMotion();
  const [timeline] = useState(() => stageTimeline(stage.tone, reducedMotion));
  const [act, setAct] = useState(() => actAt(timeline, 0));
  const finishedRef = useRef(false);
  // onDone puede cambiar en cada render del padre: se lee por ref para no reiniciar los timers
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const ui = TONE_UI[stage.tone];

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDoneRef.current();
  }, []);

  // Un timer por acto. No hay cierre automático: el jugador decide cuándo seguir.
  useEffect(() => {
    const timers = timeline.acts.map((at, i) => setTimeout(() => setAct((a) => Math.max(a, i + 1)), at));
    return () => timers.forEach(clearTimeout);
  }, [timeline]);

  const [leaving, setLeaving] = useState(false);
  // Saltar durante el suspenso lleva a la lectura; una vez en la lectura, sigue el juego
  const advance = useCallback(() => {
    if (act < 4) setAct(4);
    else setLeaving(true);
  }, [act]);

  // El fundido de salida dura lo mismo que la transición CSS
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(finish, reducedMotion ? 0 : 300);
    return () => clearTimeout(t);
  }, [leaving, finish, reducedMotion]);

  const canSkip = act >= 4 || actAt(timeline, timeline.skippableAt) <= act;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (canSkip) advance();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canSkip, advance]);

  // La oportunidad celebra en el sello (confetti() ya respeta reduced motion y suena el hito)
  useEffect(() => {
    if (act === 2 && stage.tone === 'opportunity') confetti('gold');
  }, [act, stage.tone]);

  // A4: háptica del sello. Crisis, golpe fuerte; imprevisto, uno suave. Sin vibración en la oportunidad.
  useEffect(() => {
    if (act !== 2 || stage.tone === 'opportunity') return;
    vibrate(stage.tone === 'crisis' ? [120, 60, 120] : 60);
  }, [act, stage.tone]);

  // Sonido por acto (A3): golpe al cortar, sello, latido en el suspenso y acorde al leer.
  // La oportunidad no usa golpes: celebra con el hito del sello.
  useEffect(() => {
    const opportunity = stage.tone === 'opportunity';
    if (act === 0 && !opportunity) playSound('thud');
    if (act === 2 && !opportunity) playSound('stamp');
    if (act === 3 && stage.tone === 'crisis') playSound('heartbeat');
    if (act === 4) playSound('reveal');
  }, [act, stage.tone]);

  const shakeClass = act === 2 ? (stage.tone === 'crisis' ? 'stage-shake' : 'stage-shake-soft') : '';
  const tickerText = [...stage.ticker, ...stage.ticker, ...stage.ticker].join('  ·  ');
  const suspenseMs = timeline.acts[3] - timeline.acts[2];

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={`${stage.stamp}: ${event.title}`}
      onClick={() => canSkip && advance()}
      className={`fixed inset-0 z-50 overflow-hidden select-none ${leaving ? 'stage-leave' : 'stage-fade-in'} ${
        canSkip ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`absolute inset-0 ${ui.backdrop}`} />
      <div aria-hidden="true" className={`absolute inset-0 pointer-events-none stage-edge ${ui.edge}`} />

      <div className={`relative h-full flex flex-col items-center justify-center px-4 ${shakeClass}`}>
        {/* Acto 1: cintilla con ticker */}
        {act >= 1 && (
          <div aria-hidden="true" className={`absolute left-0 right-0 top-[18%] flex items-stretch shadow-2xl stage-ribbon ${ui.ribbon}`}>
            <span className={`shrink-0 px-3 sm:px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-[0.2em] ${ui.label}`}>
              {stage.ribbon}
            </span>
            <div className="overflow-hidden flex-1 py-2">
              <div className="stage-ticker whitespace-nowrap text-xs sm:text-sm font-bold uppercase tracking-wider w-max">
                <span className="pr-8">{tickerText}</span>
                <span className="pr-8">{tickerText}</span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-lg flex flex-col items-center gap-10 text-center">
          {/* Acto 2: sello */}
          {act >= 2 && (
            <div
              aria-hidden="true"
              className={`stage-stamp -rotate-[8deg] mb-4 px-5 sm:px-7 py-2 rounded-xl border-4 text-3xl sm:text-5xl font-black uppercase tracking-[0.15em] ${ui.stamp}`}
            >
              {stage.stamp}
            </div>
          )}

          {/* Acto 3: suspenso, con el título a la vista y el resto difuminado. Acto 4: lectura, sin apuro. */}
          {act >= 3 && (
            <div className="w-full space-y-3 stage-fade-in">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                <EventKindIcon kind={event.kind} />
                {event.title}
              </h2>
              {act < 4 ? (
                <>
                  <p aria-hidden="true" className="text-sm sm:text-base text-slate-200 leading-relaxed blur-[6px] line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2 text-2xs font-bold uppercase tracking-widest text-slate-300">
                    <Activity className="w-4 h-4 stage-heartbeat" />
                    <span>Analizando impacto…</span>
                  </div>
                  <div className="mx-auto h-1 w-40 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className={`h-full ${ui.bar} stage-progress`}
                      style={{ '--stage-suspense': `${suspenseMs}ms` } as React.CSSProperties}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed stage-reveal">{event.description}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      advance();
                    }}
                    className={`mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-xl stage-fade-in ${ui.ribbon}`}
                  >
                    <span>Ver alternativas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-2xs text-slate-400 hidden sm:block">
                    o presioná <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono">Espacio</kbd>
                  </p>
                </>
              )}
              {act === 3 && canSkip && (
                <p className="text-2xs text-slate-400 pt-1 hidden sm:block">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono">Espacio</kbd> para saltar
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
