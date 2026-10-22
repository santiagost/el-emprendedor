import type { StorySegment } from '../../game/companyStory';

const TONE_CLASS = {
  good: 'font-semibold text-emerald-600 dark:text-emerald-400',
  bad: 'font-semibold text-rose-600 dark:text-rose-400',
} as const;

/** Variante con marcador: lo que suma con fondo verde y lo que resta con fondo rojo y subrayado punteado (no depende solo del color). */
const HIGHLIGHT_CLASS = {
  good: 'font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md px-0.5 py-0.5 [box-decoration-break:clone]',
  bad: 'font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-md px-0.5 py-0.5 underline decoration-dashed decoration-rose-600 dark:decoration-rose-400 underline-offset-4 [box-decoration-break:clone]',
} as const;

interface CompanyStoryProps {
  segments: StorySegment[];
  className?: string;
  highlight?: boolean;
}

/** Relato del estado de la empresa con lo que suma en verde y lo que resta en rojo. */
export default function CompanyStory({ segments, className = '', highlight = false }: CompanyStoryProps) {
  return (
    <p className={`leading-relaxed text-slate-600 dark:text-slate-300 ${className}`}>
      {segments.map((segment, i) =>
        segment.tone ? (
          <strong key={i} className={(highlight ? HIGHLIGHT_CLASS : TONE_CLASS)[segment.tone]}>
            {segment.text}
          </strong>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
