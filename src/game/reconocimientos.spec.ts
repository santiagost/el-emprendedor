import { describe, expect, it } from 'vitest';
import { TAGS, type Tag } from '../data/tags';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import { RECONOCIMIENTOS, buildVitrina, diffVitrina } from './reconocimientos';

const ALL = Object.keys(TAGS) as Tag[];

describe('reconocimientos', () => {
  it('cubre todos los tags y solo esos', () => {
    expect(Object.keys(RECONOCIMIENTOS).sort()).toEqual([...ALL].sort());
  });

  it('son frentes los tags malos y ninguno de los buenos', () => {
    for (const tag of ALL) {
      const tipo = RECONOCIMIENTOS[tag].tipo;
      expect(tipo === 'frente').toBe(TAGS[tag].tone === 'bad');
    }
  });

  it('reparte los trofeos en 5, 3 y 3 por estante', () => {
    const v = buildVitrina([]);
    expect(v.estantes.map((e) => e.total)).toEqual([5, 3, 3]);
    expect(v.total).toBe(11);
    expect(v.ganados).toBe(0);
  });

  it('cuenta ganados, vacíos, hito, herencia y frentes ordenados por peso', () => {
    const v = buildVitrina(['cultura_lean', 'socio_alineado', 'inversiones', 'equity_diluido', 'deuda_riesgosa', 'salida_exitosa_venta']);
    expect(v.ganados).toBe(2);
    expect(v.estantes[0]).toMatchObject({ id: 'negocio', ganados: ['cultura_lean'], vacios: 4 });
    expect(v.herencia).toEqual(['inversiones']);
    expect(v.hito).toBe('salida_exitosa_venta');
    expect(v.frentes).toEqual(['deuda_riesgosa', 'equity_diluido']);
  });

  it('los tags que dan el perfil y el financiamiento tienen un lugar en la vitrina', () => {
    for (const item of [...ARCHETYPES, ...FINANCINGS]) {
      for (const tag of item.tags ?? []) expect(RECONOCIMIENTOS[tag]).toBeDefined();
    }
  });

  it('diffVitrina separa trofeos, frentes abiertos y frentes cerrados', () => {
    const d = diffVitrina(['socio_conflictivo', 'cultura_lean'], ['cultura_lean', 'socio_alineado', 'deuda_riesgosa', 'inversiones']);
    expect(d).toEqual({
      trofeos: ['socio_alineado'],
      frentesAbiertos: ['deuda_riesgosa'],
      frentesCerrados: ['socio_conflictivo'],
    });
  });
});
