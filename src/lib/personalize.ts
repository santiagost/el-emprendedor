import type { GameEvent } from '../types/game';

export const NAME_TOKEN = '{nombre}';
/** Únicos tokens permitidos en los textos de contenido (los valida content.spec.ts). */
export const KNOWN_TOKENS: readonly string[] = [NAME_TOKEN];
export const MAX_PLAYER_NAME_LENGTH = 20;

/**
 * Normaliza el nombre ingresado: sin llaves (evita tokens anidados), sin caracteres de control,
 * espacios colapsados y recortado a 20 caracteres. Devuelve undefined si queda vacío.
 */
export function sanitizePlayerName(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[{}\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_PLAYER_NAME_LENGTH).trim();
  return cleaned || undefined;
}

/**
 * Quita el token cuando no hay nombre, cuidando puntuación y mayúscula inicial.
 * Convención de autoría: el token va al inicio de una oración ("{nombre}, ..."),
 * al final antes de la puntuación (", {nombre}.") o entre comas.
 */
function stripNameToken(text: string): string {
  return text
    // ", {nombre}" seguido de puntuación o fin del texto
    .replace(/,\s*\{nombre\}(?=\s*[,.;:!?)]|\s*$)/g, '')
    // "{nombre}, ..." al inicio de una oración: se capitaliza lo que sigue
    .replace(/(^|[.!?]\s+|[¡¿])\{nombre\},\s*([¿¡]?)(\p{L})/gu, (_m, pre: string, inv: string, ch: string) => pre + inv + ch.toUpperCase())
    .replace(/\{nombre\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

/**
 * Resuelve los tokens de un texto de contenido en el render (el motor guarda los textos crudos).
 * Sin nombre, el texto se lee igual de bien sin el token.
 */
export function personalize(text: string, name?: string): string {
  if (!text.includes(NAME_TOKEN)) return text;
  const clean = sanitizePlayerName(name);
  // split/join en vez de replace: el nombre no se interpreta como patrón ($&, $1...)
  return clean ? text.split(NAME_TOKEN).join(clean) : stripNameToken(text);
}

/**
 * Devuelve el evento con todos sus textos personalizados. Si ningún texto usa tokens,
 * devuelve el mismo objeto (referencia estable para useMemo).
 */
export function localizeEvent(event: GameEvent, name?: string): GameEvent {
  const hasToken = (s?: string) => Boolean(s && s.includes(NAME_TOKEN));
  const needsWork =
    hasToken(event.title) ||
    hasToken(event.description) ||
    event.options.some((o) => hasToken(o.text) || hasToken(o.outcomeText) || hasToken(o.learningPill));
  if (!needsWork) return event;

  const p = (s?: string) => (s === undefined ? s : personalize(s, name));
  return {
    ...event,
    title: personalize(event.title, name),
    description: personalize(event.description, name),
    options: event.options.map((o) => ({
      ...o,
      text: personalize(o.text, name),
      outcomeText: p(o.outcomeText),
      learningPill: p(o.learningPill),
    })) as GameEvent['options'],
  };
}
