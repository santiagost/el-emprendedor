import type { StorySegment } from '../../game/companyStory';

const TONE_CLASS = {
  good: 'font-semibold text-emerald-600 dark:text-emerald-400',
  bad: 'font-semibold text-rose-600 dark:text-rose-400',
} as const;

interface CompanyStoryProps {
  segments: StorySegment[];
  className?: string;
}

/** Relato del estado de la empresa con lo que suma en verde y lo que resta en rojo. */
export default function CompanyStory({ segments, className = '' }: CompanyStoryProps) {
  return (
    <p className={`leading-relaxed text-slate-600 dark:text-slate-300 ${className}`}>
      {segments.map((segment, i) =>
        segment.tone ? (
          <strong key={i} className={TONE_CLASS[segment.tone]}>
            {segment.text}
          </strong>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
