import { describe, it, expect } from 'vitest';
import { TAGS, type Tag } from '../data/tags';
import { buildCompanyStory, parseStory, pickStoryTags, storyToText } from './companyStory';

const ALL_TAGS = Object.keys(TAGS) as Tag[];

describe('textos de tags', () => {
  it.each(ALL_TAGS)('%s tiene description y story bien formados', (tag) => {
    const { description, story } = TAGS[tag];
    expect(description.trim().length).toBeGreaterThan(0);
    expect(story).toMatch(/^[[a-záéíóúñ]/);
    expect(story).not.toMatch(/\.$/);
    // Ningún marcador queda sin cerrar tras el parseo
    expect(storyToText(parseStory(story))).not.toMatch(/[[\]]/);
    expect(parseStory(story).some((s) => s.tone)).toBe(true);
  });
});

describe('parseStory', () => {
  it('separa resaltados positivos y negativos', () => {
    expect(parseStory('salís rápido y [+gastás poco], aunque [-hay asperezas]')).toEqual([
      { text: 'salís rápido y ' },
      { text: 'gastás poco', tone: 'good' },
      { text: ', aunque ' },
      { text: 'hay asperezas', tone: 'bad' },
    ]);
  });
});

describe('pickStoryTags', () => {
  it('prioriza los tags de mayor peso y respeta el límite', () => {
    const picked = pickStoryTags(['socio_alineado', 'conflicto_legal', 'deuda_riesgosa', 'patrimonio', 'inversiones'], 3);
    expect(picked).toEqual(['conflicto_legal', 'deuda_riesgosa', 'inversiones']);
  });

  it('a igual peso elige el más reciente', () => {
    expect(pickStoryTags(['patrimonio', 'inversiones'], 1)).toEqual(['inversiones']);
  });

  it('ignora duplicados', () => {
    expect(pickStoryTags(['patrimonio', 'patrimonio'], 4)).toEqual(['patrimonio']);
  });
});

describe('buildCompanyStory', () => {
  it('sin tags no hay relato', () => {
    expect(buildCompanyStory([])).toEqual([]);
  });

  it('une lo que suma y lo que resta en un texto corrido', () => {
    const text = storyToText(buildCompanyStory(['inversiones', 'patrimonio', 'deuda_riesgosa', 'equipo_sobrecargado']));
    expect(text).toBe(
      'Tenés un colchón propio que te deja dormir más tranquilo. Además, tus inversiones rinden y suman un ingreso extra. ' +
        'Pero debés plata con intereses que no perdonan. Encima, tu equipo hace más de lo que puede y el cansancio se acumula.',
    );
  });

  it('si solo hay aspectos negativos no arranca con "Pero"', () => {
    const text = storyToText(buildCompanyStory(['deuda_riesgosa']));
    expect(text).toBe('Debés plata con intereses que no perdonan.');
  });

  it('capitaliza aunque el fragmento empiece resaltado y mantiene el tono', () => {
    const segments = buildCompanyStory(['red_contactos']);
    expect(segments[0]).toEqual({ text: 'Conocés a la gente indicada', tone: 'good' });
  });

  it('no repite "pero" en la misma oración para ningún tag negativo', () => {
    for (const tag of ALL_TAGS.filter((t) => TAGS[t].tone === 'bad')) {
      const text = storyToText(buildCompanyStory(['red_contactos', tag], 2));
      expect(text.match(/\bpero\b/gi)?.length ?? 0).toBeLessThanOrEqual(1);
    }
  });
});

describe('tiempo pasado (informe final)', () => {
  it.each(ALL_TAGS)('%s tiene storyPast bien formado', (tag) => {
    const { storyPast } = TAGS[tag];
    expect(storyPast).toMatch(/^[[a-záéíóúñ]/);
    expect(storyPast).not.toMatch(/\.$/);
    expect(storyToText(parseStory(storyPast))).not.toMatch(/[[\]]/);
    expect(parseStory(storyPast).some((s) => s.tone)).toBe(true);
  });

  it('usa el fragmento en pasado al pedirlo', () => {
    const text = storyToText(buildCompanyStory(['red_contactos', 'clientes_diversificados'], 4, 'past'));
    expect(text).toBe(
      'Repartiste tus ventas entre muchos clientes. Además, conociste a la gente indicada y tu nombre te abrió puertas.',
    );
  });

  it('por defecto sigue en presente', () => {
    const text = storyToText(buildCompanyStory(['red_contactos']));
    expect(text).toBe('Conocés a la gente indicada y tu nombre te abre puertas.');
  });
});
