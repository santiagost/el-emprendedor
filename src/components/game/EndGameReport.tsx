import { useMemo, useState } from 'react';
import { ExternalLink, Pin, Sparkles } from 'lucide-react';
import { INLINE_ICON_CLASS } from '../common/iconStyles';
import type { GameState, Archetype, Financing } from '../../types/game';
import { buildJourney } from '../../game/recap';
import { buildRetrospective } from '../../game/retrospective';
import { buildCompanyStory } from '../../game/companyStory';
import { buildEpilogue, buildMetricCurves, buildOutlook, buildTimeline, buildWhyLine } from '../../game/endReport';
import CompanyStory from './CompanyStory';
import EndResultCard from './end/EndResultCard';
import EndMetricsPanel from './end/EndMetricsPanel';
import KeyMomentCard from './end/KeyMomentCard';
import PhaseTimeline from './end/PhaseTimeline';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import SoundToggle from '../common/SoundToggle';
import { useSoundToggle } from '../../lib/sound';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

interface EndGameReportProps {
  gameState: GameState;
  arquetipo: Archetype;
  financiamiento: Financing;
  onRestart: () => void;
  onResetToSetup: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  fxEnabled?: boolean;
  onToggleFx?: () => void;
}

export default function EndGameReport({
  gameState,
  arquetipo,
  financiamiento,
  onRestart,
  onResetToSetup,
  theme,
  onToggleTheme,
  fxEnabled,
  onToggleFx,
}: EndGameReportProps) {
  const { status, metrics, activeTags, playerName } = gameState;
  const journey = useMemo(() => buildJourney(gameState, playerName), [gameState, playerName]);
  const retrospective = useMemo(() => buildRetrospective(gameState, playerName), [gameState, playerName]);
  const verdictByLogIndex = useMemo(() => new Map(retrospective.analyses.map((a) => [a.logIndex, a.verdict])), [retrospective]);
  const timeline = useMemo(
    () => buildTimeline(gameState, journey, verdictByLogIndex, playerName),
    [gameState, journey, verdictByLogIndex, playerName]
  );
  const curves = useMemo(() => buildMetricCurves(gameState), [gameState]);
  const epilogue = useMemo(() => buildEpilogue(status, activeTags), [status, activeTags]);
  const why = useMemo(() => buildWhyLine(gameState), [gameState]);
  const outlook = useMemo(() => buildOutlook(gameState, retrospective), [gameState, retrospective]);
  const storySegments = useMemo(() => buildCompanyStory(activeTags, 5, 'past'), [activeTags]);

  const { soundEnabled, toggleSound } = useSoundToggle();
  const [showCtaModal, setShowCtaModal] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-7 pb-8 animate-in fade-in">
      {(theme || fxEnabled !== undefined) && (
        <div className="flex justify-end items-center gap-2">
          <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
          {fxEnabled !== undefined && onToggleFx && <EffectsToggle fxEnabled={fxEnabled} onToggle={onToggleFx} />}
          {theme && onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
        </div>
      )}

      <EndResultCard
        epilogue={epilogue}
        why={why}
        arquetipo={arquetipo}
        financiamiento={financiamiento}
        onRestart={onRestart}
        onResetToSetup={onResetToSetup}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-5 items-stretch">
        <EndMetricsPanel metrics={metrics} curves={curves} />

        <Card as="section" aria-label="Cómo queda tu empresa" className="p-4 sm:p-6 flex flex-col gap-4 min-w-0">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Cómo queda tu empresa</h3>
          {storySegments.length > 0 ? (
            <>
              <CompanyStory segments={storySegments} className="text-base lg:text-lg leading-8 lg:leading-9 my-auto" highlight />
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-600 dark:border-emerald-400" aria-hidden="true" /> Lo que sumó
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-dashed border-rose-600 dark:border-rose-400" aria-hidden="true" /> Lo que restó
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic my-auto">
              Cerraste el recorrido sin acumular rasgos pasivos permanentes en tu empresa.
            </p>
          )}
        </Card>
      </div>

      <KeyMomentCard retrospective={retrospective} outlook={outlook} lost={status.startsWith('game_over')} />

      <PhaseTimeline phases={timeline} />

      {/* CTA al Simulador Comercial (GDD §10) */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 dark:from-indigo-950/80 dark:via-slate-900 dark:to-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl space-y-3.5 shadow-sm dark:shadow-lg">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          <span>Siguiente nivel: el mercado real</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Dominaste el camino del fundador. Ahora es momento de entrar a la arena comercial: competí definiendo precio, calidad, distribución y posicionamiento de producto en vivo.
        </p>
        <Button
          onClick={() => setShowCtaModal(true)}
          className="w-full sm:w-auto py-3 px-5 text-sm rounded-xl shadow-md"
        >
          <span>Conocer el Simulador Comercial</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>

      {showCtaModal && (
        <Modal
          onClose={() => setShowCtaModal(false)}
          labelledBy="cta-simulador-titulo"
          panelClassName="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl"
        >
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-700/60 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-brand-cobalt dark:text-indigo-400" />
            </div>
            <h3 id="cta-simulador-titulo" className="text-base font-bold text-slate-900 dark:text-slate-100">Simulador de Estrategia Comercial</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
              En este segundo juego por equipos, gestionarás variables reales de mercado: estructura de costos fijos y variables, estrategia de precios elásticos y conquista de segmentos de mercado.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 text-left">
              <Pin className={INLINE_ICON_CLASS} aria-hidden="true" /> <strong>Disponible en la plataforma TID:</strong> consultá con tu facilitador o docente para participar de la próxima simulación en vivo.
            </div>
            <Button size="sm" onClick={() => setShowCtaModal(false)} className="w-full">
              Entendido
            </Button>
          
        </Modal>
      )}
    </div>
  );
}
