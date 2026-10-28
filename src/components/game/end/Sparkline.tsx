const W = 100;
const H = 40;

interface SparklineProps {
  values: number[];
  stroke: string;
  label: string;
  /** Posiciones de la serie donde termina una fase: se dibujan como líneas verticales. */
  breaks?: number[];
  className?: string;
}

/** Curva de una métrica (0-100). El SVG se estira al ancho disponible; el trazo no se deforma. */
export default function Sparkline({ values, stroke, label, breaks = [], className = 'h-16 lg:h-20' }: SparklineProps) {
  const last = values.length - 1;
  const step = last > 0 ? W / last : 0;
  const points = values.map((v, i) => [i * step, H - 3 - (Math.max(0, Math.min(100, v)) / 100) * (H - 6)] as const);
  const end = points[points.length - 1];
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`w-full overflow-visible ${className}`}
      role="img"
      aria-label={`Recorrido de ${label} durante la partida: de ${values[0]} a ${values[last]}`}
    >
      {breaks.map((b) => (
        <line
          key={b}
          x1={b * step}
          x2={b * step}
          y1={0}
          y2={H}
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeWidth={1}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <polygon points={`0,${H} ${line} ${end[0]},${H}`} style={{ fill: stroke }} opacity={0.1} />
      <polyline points={line} fill="none" style={{ stroke }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <polyline
        points={`${end[0]},${end[1]} ${end[0]},${end[1]}`}
        fill="none"
        style={{ stroke }}
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
