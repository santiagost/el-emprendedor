import { TAGS, type Tag } from '../data/tags';
import { GAME_EVENTS } from '../data/events';
import type { GameEvent, GameOption, Metrics, Performance } from '../types/game';

type MetricKey = keyof Metrics;
type Sign = 'up' | 'down';

/** Desde este valor absoluto el efecto se cuenta con una frase más fuerte. */
const STRONG = 25;

/**
 * Cláusulas en condicional por métrica y signo: [normales, fuertes].
 * Arrancan en minúscula y cada variante usa otra forma de condicional, para poder rotarlas.
 */
const CLAUSES: Record<MetricKey, Record<Sign, [string[], string[]]>> = {
  capital: {
    up: [
      ['podría darte aire en la caja', 'capaz que entre algo de plata', 'la caja quizás respire un poco'],
      ['podría entrar mucha plata de golpe', 'capaz que la caja engorde fuerte', 'tal vez te llene la caja rápido'],
    ],
    down: [
      ['puede costarte caja ahora', 'capaz que la caja se resienta', 'quizás se coma parte de tus reservas', 'corrés el riesgo de quedarte corto de caja'],
      ['puede vaciarte buena parte de la caja', 'corrés el riesgo de quedarte casi sin reservas', 'capaz que te deje la caja muy corta'],
    ],
  },
  reputacion: {
    up: [
      ['puede sumarte prestigio', 'quizás hablen bien de vos', 'capaz que tu imagen mejore'],
      ['podría ponerte en boca de todo el mercado', 'tal vez tu marca gane mucho peso', 'capaz que te ganes la confianza de muchos clientes'],
    ],
    down: [
      ['algunos clientes podrían mirarte de reojo', 'capaz que tu imagen se resienta', 'corrés el riesgo de perder algo de confianza'],
      ['tu reputación puede quedar muy golpeada', 'corrés el riesgo de que muchos clientes te den la espalda', 'quizás te cueste mucha confianza en el mercado'],
    ],
  },
  bienestar: {
    up: [
      ['podría darte un respiro', 'capaz que el equipo afloje la presión', 'quizás duermas más tranquilo'],
      ['puede devolverte la calma', 'tal vez el equipo recupere mucha energía', 'capaz que te saques un peso enorme de encima'],
    ],
    down: [
      ['puede costarte horas de sueño', 'capaz que el desgaste se haga sentir', 'corrés el riesgo de cargar de más al equipo'],
      ['puede dejarte al límite de tus fuerzas', 'corrés el riesgo de quemar al equipo', 'quizás te desgaste muchísimo'],
    ],
  },
};

/** Aperturas según la etapa: se usan en algunas opciones para que no arranquen todas igual. */
const OPENERS: Record<'1' | '2' | '3' | '4' | 'crisis' | 'unforeseen', string[]> = {
  '1': ['De entrada, '],
  '2': ['Mientras crecés, ', 'En plena tracción, '],
  '3': ['En plena escala, ', 'Con la empresa creciendo, '],
  '4': ['A esta altura, ', 'Con la empresa ya armada, '],
  crisis: ['En plena urgencia, ', 'Para salir del paso, '],
  unforeseen: ['Sobre la marcha, ', 'Para salir del paso, '],
};

/** Conectores entre la métrica principal y la frase del tag: contraste o suma. */
const CONTRAST_AFTER_COST = [', pero ', '. A cambio, '];
const CONTRAST_AFTER_GAIN = [', pero ', ', aunque ', '. Eso sí, '];
const ADD_BAD = [' y ', '. Encima, '];
const ADD_GOOD = [' y ', '. Además, '];

/** Cierre de la fase 1, solo en algunas opciones. */
const BEGINNER_NOTE = 'Estás empezando: pensá bien tus opciones.';

/** Aviso para opciones con repercusión futura. */
const FUTURE_NOTICES = [
  'Esta decisión puede tener consecuencias más adelante.',
  'Ojo: esto quizás vuelva más adelante.',
  'Capaz que esto no termine acá.',
  'Lo que elijas acá tal vez pese más adelante.',
];

/** Lo que una etiqueta deja por turno, según sus modificadores: [suma, resta]. */
const LASTING: Record<MetricKey, [string, string]> = {
  capital: ['caja', 'caja'],
  reputacion: ['prestigio', 'prestigio'],
  bienestar: ['tranquilidad', 'energía'],
};

const LATENT_FORECASTS = [
  'Por ahora no se nota, pero esto quizás vuelva a cruzarse en tu camino.',
  'Hoy no cambia nada, aunque capaz que traiga novedades más adelante.',
  'Puede que esto no termine acá.',
];

const RELIEF_FORECASTS = [
  'Con esto quizás cerraste un frente que venía abierto.',
  'Puede que te hayas sacado un problema de encima.',
];

/** Formas de condicional: se cuentan para no repetir la misma dentro de un texto. */
const MODALS: [string, RegExp][] = [
  ['poder', /\b(puede|pueda|puedan|pueden|podría|podrías|podrían)\b/i],
  ['quizas', /\bquizás\b/i],
  ['capaz', /\bcapaz\b/i],
  ['tal vez', /\btal vez\b/i],
  ['riesgo', /\briesgo\b/i],
];

const modalsOf = (text: string) => MODALS.filter(([, re]) => re.test(text)).map(([name]) => name);

/** Hash estable para elegir variantes sin azar: el mismo texto en cada partida. */
function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

const pick = <T,>(list: T[], seed: number): T => list[seed % list.length];

/** Como `pick`, pero salta las variantes cuya forma de condicional ya se usó en el texto. */
function pickFresh(list: string[], seed: number, used: Set<string>): string {
  for (let i = 0; i < list.length; i++) {
    const candidate = list[(seed + i) % list.length];
    if (!modalsOf(candidate).some((m) => used.has(m))) return candidate;
  }
  return pick(list, seed);
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Une palabras: "a", "a y b", "a, b y c". */
function joinAnd(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`;
}

/** Etiquetas que habilitan o bloquean algún evento: tienen repercusión futura. */
function gatingTags(events: GameEvent[]): Set<Tag> {
  const gating = new Set<Tag>();
  for (const ev of events) {
    for (const tag of ev.when?.tags ?? ev.requiredTags ?? []) gating.add(tag);
    for (const tag of ev.when?.forbiddenTags ?? ev.forbiddenTags ?? []) gating.add(tag);
  }
  return gating;
}

const GATING_TAGS = gatingTags(GAME_EVENTS);

const isLatent = (tag: Tag) => Object.keys(TAGS[tag].modifiers).length === 0;

/** La opción deja algo que puede volver: un evento diferido, una etiqueta latente o una que abre o cierra eventos. */
export function hasFutureImpact(option: GameOption, gating: Set<Tag> = GATING_TAGS): boolean {
  if (option.scheduledEvent) return true;
  const performanceTags = Object.values(option.minigame?.tagsByPerformance ?? {}).flatMap((t) => t?.addTags ?? []);
  return [...(option.addTags ?? []), ...performanceTags].some((tag) => isLatent(tag) || gating.has(tag));
}

/** El efecto que más pesa de la opción (a igual tamaño, el costo primero). */
function mainEffect(effects: Partial<Metrics>): { key: MetricKey; value: number } | null {
  const sorted = (Object.entries(effects) as [MetricKey, number][])
    .filter(([, value]) => value !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[1] - b[1]);
  return sorted.length > 0 ? { key: sorted[0][0], value: sorted[0][1] } : null;
}

/**
 * Descripción en condicional de una opción, armada a partir de sus datos:
 * el efecto que más pesa, la frase del tag que agrega (si hay) y un aviso si deja consecuencias para más adelante.
 * La fase cambia la apertura. Si la opción trae `hint`, se usa ese texto tal cual (override manual).
 */
export function buildOptionHint(event: GameEvent, optionIndex: number): string {
  const option = event.options[optionIndex];
  if (option.hint) return option.hint;

  const seed = hash(`${event.id}:${optionIndex}`);
  const used = new Set<string>();
  const note = (text: string) => modalsOf(text).forEach((m) => used.add(m));

  const tag = option.addTags?.[0];
  const tagClause = tag ? TAGS[tag].hint : null;
  if (tagClause) note(tagClause);

  const main = mainEffect(option.effects);
  let metricClause: string | null = null;
  if (main) {
    const [normal, strong] = CLAUSES[main.key][main.value > 0 ? 'up' : 'down'];
    metricClause = pickFresh(Math.abs(main.value) >= STRONG ? strong : normal, seed, used);
    note(metricClause);
  }

  let body: string | null = metricClause;
  if (metricClause && tag && tagClause) {
    const isCost = main!.value < 0;
    const tagGood = TAGS[tag].tone === 'good';
    const connectors = isCost
      ? (tagGood ? CONTRAST_AFTER_COST : ADD_BAD)
      : (tagGood ? ADD_GOOD : CONTRAST_AFTER_GAIN);
    body = `${metricClause}${pick(connectors, seed >>> 3)}${tagClause}`;
  } else if (!body) {
    body = tagClause;
  }

  // La apertura de etapa va en la mitad de las opciones, para que no arranquen todas igual
  const stage = event.kind === 'crisis' || event.kind === 'unforeseen' ? event.kind : String(event.phaseId);
  const opener = (seed >>> 1) % 2 === 0 ? pick(OPENERS[stage as keyof typeof OPENERS], seed >>> 2) : '';
  const sentence = body ? (opener ? `${opener}${body}.` : `${capitalize(body)}.`) : '';

  const notice = hasFutureImpact(option) ? pickFresh(FUTURE_NOTICES, seed, used) : '';
  // En la fase 1 solo una de cada tres opciones lleva el cierre, para que no se vuelva muletilla
  const beginner = event.kind === undefined || event.kind === 'main' ? (event.phaseId === 1 && (seed >>> 4) % 3 === 0 ? BEGINNER_NOTE : '') : '';
  return [sentence, notice, beginner].filter(Boolean).join(' ');
}

/** Etiquetas que deja la opción según el rendimiento en su minijuego (lo que el rendimiento quita gana). */
function tagsAfter(option: GameOption, performance?: Performance) {
  const extra = performance ? option.minigame?.tagsByPerformance?.[performance] : undefined;
  const added = [...(option.addTags ?? []), ...(extra?.addTags ?? [])].filter((t) => !extra?.removeTags?.includes(t));
  const removed = [...(option.removeTags ?? []), ...(extra?.removeTags ?? [])];
  return { added, removed };
}

function lastingForecast(tag: Tag): string | null {
  const mods = Object.entries(TAGS[tag].modifiers) as [MetricKey, number][];
  const gains = mods.filter(([, v]) => v > 0).map(([k]) => LASTING[k][0]);
  const losses = mods.filter(([, v]) => v < 0).map(([k]) => LASTING[k][1]);
  if (gains.length > 0 && losses.length > 0) {
    return `Mientras dure, puede seguir sumándote ${joinAnd(gains)}, aunque también quitándote ${joinAnd(losses)}.`;
  }
  if (gains.length > 0) return `Mientras dure, puede seguir sumándote ${joinAnd(gains)}.`;
  if (losses.length > 0) return `Mientras no lo resuelvas, capaz que te siga quitando ${joinAnd(losses)}.`;
  return null;
}

/**
 * "Qué podría venir" tras elegir: lo que la decisión deja instalado para los próximos turnos.
 * Nunca es una certeza; null si la decisión no deja nada pendiente.
 */
export function buildOutcomeForecast(event: GameEvent, optionIndex: number, performance?: Performance): string | null {
  const option = event.options[optionIndex];
  const seed = hash(`${event.id}:${optionIndex}`);
  const { added, removed } = tagsAfter(option, performance);
  const used = new Set<string>();

  const sentences: string[] = [];
  // La etiqueta nueva con más peso por turno cuenta lo que puede seguir pasando
  const lasting = added
    .map((tag) => ({ tag, weight: (Object.values(TAGS[tag].modifiers) as number[]).reduce((a, v) => a + Math.abs(v), 0) }))
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => b.weight - a.weight)[0];
  if (lasting) {
    const text = lastingForecast(lasting.tag)!;
    sentences.push(text);
    modalsOf(text).forEach((m) => used.add(m));
  }

  if (option.scheduledEvent || added.some((tag) => isLatent(tag) || GATING_TAGS.has(tag))) {
    sentences.push(pickFresh(LATENT_FORECASTS, seed, used));
  } else if (removed.length > 0) {
    sentences.push(pickFresh(RELIEF_FORECASTS, seed, used));
  }

  return sentences.length > 0 ? sentences.join(' ') : null;
}
