import { TAGS, type Tag, type TagTone } from '../data/tags';

export interface StorySegment {
  text: string;
  /** Resaltado: verde si suma, rojo si resta. Sin tono = texto común. */
  tone?: TagTone;
}

/** Presente para el panel (cómo está hoy), pasado para el informe final (lo que ya hiciste). */
export type StoryTense = 'present' | 'past';

/** Los tags sin modificadores (latentes) pesan en el relato porque anticipan eventos futuros. */
const LATENT_BONUS = 2;

const GOOD_LEADS = ['', 'Además, ', 'Y '];
const BAD_LEADS_AFTER_GOOD = ['Pero ', 'Encima, ', 'Y '];
const BAD_LEADS_ALONE = ['', 'Encima, ', 'Y '];

function relevance(tag: Tag): number {
  const mods = Object.values(TAGS[tag].modifiers) as number[];
  if (mods.length === 0) return LATENT_BONUS;
  return mods.reduce((acc, value) => acc + Math.abs(value), 0);
}

/**
 * Elige los tags más relevantes para el relato.
 * Orden: mayor peso de modificadores (latentes cuentan como 2); a igual peso, el más reciente primero.
 */
export function pickStoryTags(activeTags: Tag[], limit: number): Tag[] {
  const unique = Array.from(new Set(activeTags)).filter((tag) => tag in TAGS);
  const recency = new Map(unique.map((tag) => [tag, activeTags.lastIndexOf(tag)]));
  return unique
    .sort((a, b) => relevance(b) - relevance(a) || recency.get(b)! - recency.get(a)!)
    .slice(0, limit);
}

/** Convierte "[+texto]" / "[-texto]" en segmentos resaltados. */
export function parseStory(fragment: string): StorySegment[] {
  const segments: StorySegment[] = [];
  const pattern = /\[([+-])([^\]]+)\]/g;
  let last = 0;
  for (const match of fragment.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ text: fragment.slice(last, start) });
    segments.push({ text: match[2], tone: match[1] === '+' ? 'good' : 'bad' });
    last = start + match[0].length;
  }
  if (last < fragment.length) segments.push({ text: fragment.slice(last) });
  return segments;
}

function fragmentOf(tag: Tag, tense: StoryTense): string {
  return tense === 'past' ? TAGS[tag].storyPast : TAGS[tag].story;
}

function sentence(lead: string, fragment: string): StorySegment[] {
  const segments = parseStory(fragment);
  if (lead) return [{ text: lead }, ...segments, { text: '.' }];
  const [first, ...rest] = segments;
  const capitalized = { ...first, text: first.text.charAt(0).toUpperCase() + first.text.slice(1) };
  return [capitalized, ...rest, { text: '.' }];
}

/**
 * Relato corto de cómo está la empresa, uniendo los fragmentos de hasta `limit` tags:
 * primero lo que suma, después lo que resta, con conectores para que se lea de corrido.
 */
export function buildCompanyStory(activeTags: Tag[], limit = 4, tense: StoryTense = 'present'): StorySegment[] {
  const picked = pickStoryTags(activeTags, limit);
  const good = picked.filter((tag) => TAGS[tag].tone === 'good');
  const bad = picked.filter((tag) => TAGS[tag].tone === 'bad');
  const badLeads = good.length > 0 ? BAD_LEADS_AFTER_GOOD : BAD_LEADS_ALONE;

  const sentences = [
    ...good.map((tag, i) => sentence(GOOD_LEADS[Math.min(i, GOOD_LEADS.length - 1)], fragmentOf(tag, tense))),
    ...bad.map((tag, i) => sentence(badLeads[Math.min(i, badLeads.length - 1)], fragmentOf(tag, tense))),
  ];

  return sentences.flatMap((segments, i) => (i === 0 ? segments : [{ text: ' ' }, ...segments]));
}

/** Texto plano del relato (tests y lectores de pantalla). */
export function storyToText(segments: StorySegment[]): string {
  return segments.map((s) => s.text).join('');
}
