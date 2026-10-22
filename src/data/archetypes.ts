import type { Archetype, Financing, Metrics } from '../types/game';
import type { Tag } from './tags';
import { trendsOf } from './events/builders';

const defineArchetype = (
    id: string,
    titulo: string,
    descripcion: string,
    effects: Partial<Metrics>,
    tags: Tag[],
): Archetype => ({
    id,
    titulo,
    descripcion,
    effects,
    impactPreview: trendsOf(effects),
    tags,
});

const defineFinancing = (
    id: string,
    titulo: string,
    descripcion: string,
    effects: Partial<Metrics>,
    tags: Tag[],
): Financing => ({
    id,
    titulo,
    descripcion,
    effects,
    impactPreview: trendsOf(effects),
    tags,
});

export const ARCHETYPES: Archetype[] = [
    defineArchetype(
        "a1_tecnico",
        "Técnico / Especialista",
        "Sos experto en tu campo, con habilidades técnicas avanzadas y foco en la calidad y la precisión.",
        { capital: -10, bienestar: 5, reputacion: 0 },
        ["calidad_producto"]
    ),
    defineArchetype(
        "a2_comercial",
        "Comercial / Ventas",
        "Tenés un talento natural para las ventas y la negociación, y te enfocás en generar ingresos y ampliar el mercado.",
        { capital: -10, bienestar: 0, reputacion: 8 },
        ["generacion_ingresos", "red_contactos"]
    ),
    defineArchetype(
        "a3_inversionista",
        "Inversionista / Ahorrista",
        "Sos un inversor estratégico: buscás maximizar el rendimiento de tus inversiones y construir un patrimonio sostenible.",
        { capital: 15, bienestar: -5, reputacion: 0 },
        ["inversiones", "patrimonio"]
    ),
];

export const FINANCINGS: Financing[] = [
    defineFinancing(
        "f1_bootstrap",
        "Bootstrapping",
        "Financiás tu empresa con tus propios recursos y ahorros, y mantenés el control total sobre tu negocio.",
        { capital: -10, bienestar: 0, reputacion: 0 },
        ["autonomia_estrategica"]
    ),
    defineFinancing(
        "f2_prestamo_bancario",
        "Préstamo Bancario",
        "Pedís un préstamo a un banco para financiar tu empresa, con la obligación de devolverlo con intereses.",
        { capital: 25, bienestar: -5, reputacion: 0 },
        ["deuda_riesgosa"]
    ),
    defineFinancing(
        "f3_socio_angel",
        "Socio Ángel",
        "Sumás a un inversor ángel que aporta capital y experiencia, a cambio de una parte de la empresa.",
        { capital: 20, bienestar: 0, reputacion: 10 },
        ["equity_diluido"]
    ),
];
