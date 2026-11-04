import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  Boxes,
  Coins,
  Compass,
  Globe,
  HeartHandshake,
  ListChecks,
  Network,
  PiggyBank,
  Rocket,
  Store,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { TAGS, type Tag } from '../data/tags';

/**
 * Presentación de los tags como "vitrina de reconocimientos". Solo cambia cómo se muestran:
 * los tags, el motor y el log siguen igual, y no se muestran cifras ni efectos.
 *  - trofeo: tag que suma; va a un estante según lo que empuja.
 *  - hito: cómo se cierra la historia (un tag de salida de la fase 4).
 *  - herencia: viene del perfil de fundador; va en "Tu punto de partida".
 *  - frente: algo que pesa y sigue abierto hasta que se resuelva.
 */
export type Estante = 'negocio' | 'mercado' | 'equipo';

export type Reconocimiento =
  | { tipo: 'trofeo'; titulo: string; icono: LucideIcon; estante: Estante }
  | { tipo: 'hito'; titulo: string; icono: LucideIcon }
  | { tipo: 'herencia'; titulo: string; icono: LucideIcon }
  | { tipo: 'frente'; titulo: string };

export const RECONOCIMIENTOS: Record<Tag, Reconocimiento> = {
  // Negocio: la caja y la forma de crecer
  cultura_lean: { tipo: 'trofeo', titulo: 'Cultura Lean', icono: Zap, estante: 'negocio' },
  generacion_ingresos: { tipo: 'trofeo', titulo: 'Ventas que fluyen', icono: TrendingUp, estante: 'negocio' },
  proveedor_dependiente: { tipo: 'trofeo', titulo: 'Proveedor clave', icono: Truck, estante: 'negocio' },
  inversion_externa: { tipo: 'trofeo', titulo: 'Fondo que apuesta', icono: Rocket, estante: 'negocio' },
  autonomia_estrategica: { tipo: 'trofeo', titulo: 'Decisiones propias', icono: Compass, estante: 'negocio' },
  // Mercado: clientes, marca y contactos
  clientes_diversificados: { tipo: 'trofeo', titulo: 'Cartera diversificada', icono: Users, estante: 'mercado' },
  calidad_producto: { tipo: 'trofeo', titulo: 'Producto recomendado', icono: BadgeCheck, estante: 'mercado' },
  red_contactos: { tipo: 'trofeo', titulo: 'Red que abre puertas', icono: Network, estante: 'mercado' },
  // Equipo: socios, proveedores y forma de trabajar
  socio_alineado: { tipo: 'trofeo', titulo: 'Sociedad alineada', icono: HeartHandshake, estante: 'equipo' },
  proveedores_diversificados: { tipo: 'trofeo', titulo: 'Cadena resiliente', icono: Boxes, estante: 'equipo' },
  procesos_solidos: { tipo: 'trofeo', titulo: 'Equipo ordenado', icono: ListChecks, estante: 'equipo' },

  salida_exitosa_venta: { tipo: 'hito', titulo: 'Gran salida', icono: Trophy },
  lifestyle_business: { tipo: 'hito', titulo: 'Empresa a tu medida', icono: Store },
  expansion_global: { tipo: 'hito', titulo: 'Salto internacional', icono: Globe },

  inversiones: { tipo: 'herencia', titulo: 'Cartera que rinde', icono: Coins },
  patrimonio: { tipo: 'herencia', titulo: 'Colchón propio', icono: PiggyBank },

  obsesion_calidad: { tipo: 'frente', titulo: 'Perfeccionismo caro' },
  socio_conflictivo: { tipo: 'frente', titulo: 'Socio en tensión' },
  equity_diluido: { tipo: 'frente', titulo: 'Control compartido' },
  cliente_dependencia: { tipo: 'frente', titulo: 'Un solo cliente' },
  deuda_riesgosa: { tipo: 'frente', titulo: 'Deuda que aprieta' },
  equipo_sobrecargado: { tipo: 'frente', titulo: 'Equipo al límite' },
  conflicto_legal: { tipo: 'frente', titulo: 'Juicio abierto' },
  informalidad: { tipo: 'frente', titulo: 'Ventas sin facturar' },
  margen_ajustado: { tipo: 'frente', titulo: 'Margen finito' },
  contratacion_por_afecto: { tipo: 'frente', titulo: 'Amigo sin proceso' },
  falla_oculta: { tipo: 'frente', titulo: 'Falla escondida' },
  maquina_propia: { tipo: 'frente', titulo: 'Máquina a mantener' },
  secreto_ajeno: { tipo: 'frente', titulo: 'Secreto sin revelar' },
  deuda_familiar: { tipo: 'frente', titulo: 'Deuda con la familia' },
  promesas_pendientes: { tipo: 'frente', titulo: 'Promesas sin cumplir' },
  sin_habilitacion: { tipo: 'frente', titulo: 'Sin habilitación' },
  stock_inmovilizado: { tipo: 'frente', titulo: 'Stock parado' },
  alquiler_comprometido: { tipo: 'frente', titulo: 'Alquiler a cuestas' },
  precio_devaluado: { tipo: 'frente', titulo: 'Precio por el piso' },
};

export const ESTANTES: { id: Estante; label: string }[] = [
  { id: 'negocio', label: 'Negocio' },
  { id: 'mercado', label: 'Mercado' },
  { id: 'equipo', label: 'Equipo' },
];

const TAG_IDS = Object.keys(RECONOCIMIENTOS) as Tag[];

export const tituloDe = (tag: Tag): string => RECONOCIMIENTOS[tag].titulo;

/** Cuánto pesa un frente: lo que más resta en total va primero; a igual peso, el orden de la tabla. */
const pesoDe = (tag: Tag): number => {
  const mods = Object.values(TAGS[tag].modifiers) as number[];
  return mods.reduce((sum, v) => sum + v, 0);
};

export interface EstanteVitrina {
  id: Estante;
  label: string;
  /** Trofeos ganados, en el orden de la tabla. */
  ganados: Tag[];
  /** Lugares todavía vacíos: no dicen qué falta. */
  vacios: number;
  total: number;
}

export interface Vitrina {
  estantes: EstanteVitrina[];
  /** Cómo se cerró la historia, si ya se definió. */
  hito: Tag | null;
  herencia: Tag[];
  /** Frentes abiertos, del que más pesa al que menos. */
  frentes: Tag[];
  ganados: number;
  total: number;
}

/** Arma la vitrina a partir de los tags activos. */
export function buildVitrina(activeTags: readonly Tag[]): Vitrina {
  const activos = new Set(activeTags);
  const estantes = ESTANTES.map(({ id, label }) => {
    const todos = TAG_IDS.filter((t) => {
      const r = RECONOCIMIENTOS[t];
      return r.tipo === 'trofeo' && r.estante === id;
    });
    const ganados = todos.filter((t) => activos.has(t));
    return { id, label, ganados, vacios: todos.length - ganados.length, total: todos.length };
  });
  const frentes = TAG_IDS.filter((t) => RECONOCIMIENTOS[t].tipo === 'frente' && activos.has(t));
  frentes.sort((a, b) => pesoDe(a) - pesoDe(b));

  return {
    estantes,
    hito: TAG_IDS.find((t) => RECONOCIMIENTOS[t].tipo === 'hito' && activos.has(t)) ?? null,
    herencia: TAG_IDS.filter((t) => RECONOCIMIENTOS[t].tipo === 'herencia' && activos.has(t)),
    frentes,
    ganados: estantes.reduce((sum, e) => sum + e.ganados.length, 0),
    total: estantes.reduce((sum, e) => sum + e.total, 0),
  };
}

export interface CambiosVitrina {
  /** Trofeos que se suman a la vitrina. */
  trofeos: Tag[];
  /** Frentes que se abren. */
  frentesAbiertos: Tag[];
  /** Frentes que se cierran. */
  frentesCerrados: Tag[];
}

/** Qué cambió en la vitrina entre dos listas de tags (por ejemplo, antes y después de una decisión). */
export function diffVitrina(antes: readonly Tag[], despues: readonly Tag[]): CambiosVitrina {
  const antesSet = new Set(antes);
  const despuesSet = new Set(despues);
  const nuevos = despues.filter((t) => !antesSet.has(t) && t in RECONOCIMIENTOS);
  const quitados = antes.filter((t) => !despuesSet.has(t) && t in RECONOCIMIENTOS);
  return {
    trofeos: nuevos.filter((t) => RECONOCIMIENTOS[t].tipo === 'trofeo'),
    frentesAbiertos: nuevos.filter((t) => RECONOCIMIENTOS[t].tipo === 'frente'),
    frentesCerrados: quitados.filter((t) => RECONOCIMIENTOS[t].tipo === 'frente'),
  };
}

export const hayCambios = (c: CambiosVitrina): boolean =>
  c.trofeos.length + c.frentesAbiertos.length + c.frentesCerrados.length > 0;

/** Estante de un trofeo, para pintar su color. */
export const estanteDe = (tag: Tag): Estante | null => {
  const r = RECONOCIMIENTOS[tag];
  return r.tipo === 'trofeo' ? r.estante : null;
};

