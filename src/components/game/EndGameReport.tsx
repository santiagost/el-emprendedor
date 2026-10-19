import { useState } from 'react';
import type { GameState, Archetype, Financing } from '../../types/game';
import { TAGS } from '../../data/tags';
import {
  DollarSign,
  Award,
  Heart,
  RefreshCw,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface EndGameReportProps {
  gameState: GameState;
  arquetipo: Archetype;
  financiamiento: Financing;
  onRestart: () => void;
  onResetToSetup: () => void;
}

export default function EndGameReport({
  gameState,
  arquetipo,
  financiamiento,
  onRestart,
  onResetToSetup,
}: EndGameReportProps) {
  const { status, metrics, activeTags, decisionLog } = gameState;
  const [showLog, setShowLog] = useState(false);
  const [showCtaModal, setShowCtaModal] = useState(false);

  const getEpilogue = () => {
    if (status === 'victory') {
      if (activeTags.includes('salida_exitosa_venta')) {
        return {
          title: '🦄 El Unicornio Adquirido',
          subtitle: 'Venta exitosa a un gigante corporativo',
          description:
            'Vendiste tu empresa por millones a un conglomerado internacional. Monetizaste con creces el valor creado, aunque tu creación ahora responderá a nuevos dueños.',
          color: 'text-emerald-400',
        };
      }
      if (activeTags.includes('lifestyle_business')) {
        return {
          title: '🌿 El Negocio Sostenible (Lifestyle Business)',
          subtitle: 'Rentabilidad, autonomía y calidad de vida',
          description:
            'No construiste una corporación titánica, pero tenés un negocio sólido, predecible y altamente rentable que opera sin depender de tus horas de sueño.',
          color: 'text-indigo-400',
        };
      }
      if (activeTags.includes('expansion_global')) {
        return {
          title: '🌍 La Expansión Global',
          subtitle: 'Presencia internacional consolidada',
          description:
            'Llevaste la bandera de tu empresa a nuevos mercados en el mundo. Superaste la barrera local y jugás de igual a igual en las grandes ligas.',
          color: 'text-blue-400',
        };
      }
      if (activeTags.includes('equity_diluido') && !activeTags.includes('autonomia_estrategica')) {
        return {
          title: '👔 El Fundador Desplazado',
          subtitle: 'Empresa millonaria, control ajeno',
          description:
            'Tu empresa vale una fortuna, pero el directorio y los inversores externos se quedaron con el control y te desplazaron de tu rol de CEO. Una lección de dilución.',
          color: 'text-amber-400',
        };
      }
      return {
        title: '🏆 Empresa Consolidada',
        subtitle: 'Maduración completa de negocio',
        description:
          'Superaste con temple todas las fases de maduración con caja, reputación y bienestar intactos. Construiste una verdadera compañía.',
        color: 'text-emerald-400',
      };
    }

    if (status === 'game_over_capital') {
      return {
        title: '📉 Quiebra de Liquidez (Lección Forzosa)',
        subtitle: 'Caja agotada antes de consolidar el modelo',
        description:
          'Te quedaste sin liquidez y la empresa cayó en insolvencia. "El 80% de los emprendedores exitosos fracasó en su primer intento. Volvé a intentarlo con lo aprendido."',
        color: 'text-rose-400',
      };
    }

    if (status === 'game_over_bienestar') {
      return {
        title: '🔥 Colapso por Burnout',
        subtitle: 'El equipo y tu salud no dieron más',
        description:
          'Las horas extras infinitas y la deuda operativa pasaron factura. La salud del fundador y el clima del equipo colapsaron. Sin personas no hay negocio.',
        color: 'text-rose-400',
      };
    }

    if (status === 'game_over_reputacion') {
      return {
        title: '⚡ Crisis Terminal de Reputación',
        subtitle: 'Pérdida absoluta de credibilidad',
        description:
          'Perdiste toda confianza de tus clientes, proveedores e inversores. En el mundo de los negocios, la reputación tarda años en construirse y segundos en destruirse.',
        color: 'text-rose-400',
      };
    }

    return {
      title: '🏁 Trayectoria Completada',
      subtitle: 'Fin del recorrido disponible',
      description:
        'Has completado todos los acontecimientos posibles para las condiciones y el perfil seleccionado en esta partida.',
      color: 'text-slate-300',
    };
  };

  const epilogue = getEpilogue();
  const isVictory = status === 'victory';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-8 animate-in fade-in">
      {/* Header del resultado */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="inline-flex p-3 rounded-full bg-slate-800/80 mb-1">
          {isVictory ? (
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
          ) : status === 'ended_early' ? (
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
          ) : (
            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400" />
          )}
        </div>

        <div className="space-y-1">
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${epilogue.color}`}>
            {epilogue.title}
          </h2>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-400 font-semibold">
            {epilogue.subtitle}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          {epilogue.description}
        </p>

        {/* Perfil Inicial Jugado */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
          <span>Perfil: <strong className="text-slate-200">{arquetipo.titulo}</strong></span>
          <span>•</span>
          <span>Financiamiento: <strong className="text-slate-200">{financiamiento.titulo}</strong></span>
        </div>
      </div>

      {/* Grid Responsive de 2 columnas en Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Métricas, Tags y Botones */}
        <div className="lg:col-span-6 space-y-5">
          {/* Métricas Finales */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Métricas Finales de la Trayectoria
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="flex flex-col items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="flex items-center text-xs sm:text-sm text-emerald-400 font-black mb-1">
                  <DollarSign className="w-3.5 h-3.5 mr-0.5" /> {metrics.capital}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Capital</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="flex items-center text-xs sm:text-sm text-blue-400 font-black mb-1">
                  <Award className="w-3.5 h-3.5 mr-0.5" /> {metrics.reputacion}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Reputación</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="flex items-center text-xs sm:text-sm text-rose-400 font-black mb-1">
                  <Heart className="w-3.5 h-3.5 mr-0.5" /> {metrics.bienestar}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Bienestar</span>
              </div>
            </div>
          </div>

          {/* Tags adquiridos */}
          {activeTags.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2.5 shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cultura & Rasgos Incorporados ({activeTags.length})
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-indigo-900/40 text-indigo-300"
                  >
                    {TAGS[tag]?.label ?? tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 transition-colors gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
            <button
              onClick={onResetToSetup}
              className="inline-flex items-center justify-center px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors gap-2 shadow-md shadow-indigo-600/25"
            >
              <RotateCcw className="w-4 h-4" /> Cambiar Perfil
            </button>
          </div>
        </div>

        {/* Columna Derecha: Acordeón de Decisiones y CTA Simulador */}
        <div className="lg:col-span-6 space-y-5">
          {/* Registro de Decisiones (Acordeón) */}
          {decisionLog && decisionLog.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => setShowLog(!showLog)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                <span>Historial de Decisiones ({decisionLog.length})</span>
                {showLog ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
              </button>

              {showLog && (
                <div className="p-4 pt-0 space-y-2.5 border-t border-slate-800/60 max-h-80 overflow-y-auto">
                  {decisionLog.map((log, index) => (
                    <div key={index} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                        <span className="text-indigo-400 font-bold">Turno {log.turn}</span>
                        <span className="truncate max-w-[220px] text-slate-300">{log.eventTitle}</span>
                      </div>
                      <p className="text-xs text-slate-200">"{log.optionText}"</p>
                      {log.outcomeText && (
                        <p className="text-[11px] text-slate-400 pt-0.5 leading-snug">
                          {log.outcomeText}
                        </p>
                      )}
                      {log.learningPill && (
                        <p className="text-[10px] text-indigo-300/80 italic pt-1">
                          💡 {log.learningPill}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA al Simulador Comercial (GDD §10) */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-900/40 border border-indigo-700/50 rounded-2xl space-y-3.5 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Siguiente Nivel: El Mercado Real</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dominaste el camino del fundador. Ahora es momento de entrar a la arena comercial: competí definiendo precio, calidad, distribución y posicionamiento de producto en vivo.
            </p>
            <button
              onClick={() => setShowCtaModal(true)}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <span>Conocer el Simulador Comercial</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal informativo CTA */}
      {showCtaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-indigo-950 border border-indigo-700/60 rounded-full flex items-center justify-center mx-auto text-indigo-300">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Simulador de Estrategia Comercial
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-left">
              En este segundo juego por equipos, gestionarás variables reales de mercado: estructura de costos fijos y variables, estrategia de precios elásticos y conquista de segmentos de mercado.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 text-left">
              📌 <strong>Disponible en la plataforma TID:</strong> consultá con tu facilitador o docente para participar de la próxima simulación en vivo.
            </div>
            <button
              onClick={() => setShowCtaModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
