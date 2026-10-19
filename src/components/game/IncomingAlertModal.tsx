import { useEffect } from 'react';
import type { GameEvent } from '../../types/game';
import { AlertTriangle, Zap, ArrowRight, ShieldAlert, Radio } from 'lucide-react';

interface IncomingAlertModalProps {
  event: GameEvent;
  onDismiss: () => void;
}

export default function IncomingAlertModal({ event, onDismiss }: IncomingAlertModalProps) {
  const isCrisis = event.kind === 'crisis';

  // Permitir avanzar con tecla Espacio o Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 sm:p-8 text-center space-y-6 shadow-2xl transition-all ${
          isCrisis
            ? 'bg-gradient-to-b from-rose-950/90 via-slate-950 to-slate-950 border-rose-500/80 shadow-rose-950/80'
            : 'bg-gradient-to-b from-amber-950/90 via-slate-950 to-slate-950 border-amber-500/80 shadow-amber-950/80'
        }`}
      >
        {/* Anillos de radar pulsante */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
              isCrisis ? 'bg-rose-500' : 'bg-amber-400'
            }`}
          />
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center border shadow-xl ${
              isCrisis
                ? 'bg-rose-900/60 border-rose-400 text-rose-300 shadow-rose-500/40'
                : 'bg-amber-900/60 border-amber-400 text-amber-300 shadow-amber-500/40'
            }`}
          >
            {isCrisis ? (
              <AlertTriangle className="w-8 h-8 animate-bounce text-rose-300" />
            ) : (
              <Zap className="w-8 h-8 animate-pulse text-amber-300" />
            )}
          </div>
        </div>

        {/* Encabezado y subtexto */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
            isCrisis
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isCrisis ? 'Alerta Crítica Inminente' : 'Suceso Exógeno Imprevisto'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            {isCrisis ? '¡Crisis Operativa en Marcha!' : '¡Alerta de Mercado!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            {isCrisis
              ? 'Una de tus métricas vitales tocó fondo (< 25%). Si no tomás medidas inmediatas, la empresa colapsará.'
              : 'Un cisne negro macroeconómico o técnico acaba de irrumpir en tu operación.'}
          </p>
        </div>

        {/* Tarjeta del evento entrante */}
        <div
          className={`p-4 rounded-xl border text-left space-y-2 ${
            isCrisis
              ? 'bg-rose-950/40 border-rose-800/60'
              : 'bg-amber-950/40 border-amber-800/60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-300" />
            <span>Dilema de Interrupción:</span>
          </div>
          <h3 className="text-base font-bold text-slate-100">
            {event.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Botón de acción para afrontar */}
        <button
          type="button"
          onClick={onDismiss}
          className={`w-full py-3.5 px-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl ${
            isCrisis
              ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-600/30'
              : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-amber-500/30 font-extrabold'
          }`}
        >
          <span>{isCrisis ? 'Afrontar Crisis Ahora' : 'Evaluar y Tomar Decisión'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-500">
          Tip: Podés presionar <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Espacio</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Enter</kbd> para continuar
        </p>
      </div>
    </div>
  );
}
