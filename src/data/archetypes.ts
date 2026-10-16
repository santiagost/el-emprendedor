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
        "Eres un experto en tu campo, con habilidades técnicas avanzadas y un enfoque en la calidad y precisión.",
        { capital: -10, bienestar: 5, reputacion: 0 },
        ["calidad_producto"]
    ),
    defineArchetype(
        "a2_comercial",
        "Comercial / Ventas",
        "Tienes un talento natural para las ventas y la negociación, y te enfocas en generar ingresos y expandir el mercado.",
        { capital: -10, bienestar: 0, reputacion: 8 },
        ["generacion_ingresos", "red_contactos"]
    ),
    defineArchetype(
        "a3_inversionista",
        "Inversionista / Ahorrista",
        "Eres un inversor estratégico que busca maximizar el rendimiento de tus inversiones y construir un patrimonio sostenible.",
        { capital: 15, bienestar: -5, reputacion: 0 },
        ["inversiones", "patrimonio"]
    ),
];

export const FINANCINGS: Financing[] = [
    defineFinancing(
        "f1_bootstrap",
        "Bootstrapping",
        "Financia tu empresa con tus propios recursos y ahorros, manteniendo el control total sobre tu negocio.",
        { capital: -10, bienestar: 0, reputacion: 0 },
        ["autonomia_estrategica"]
    ),
    defineFinancing(
        "f2_prestamo_bancario",
        "Préstamo Bancario",
        "Obtén un préstamo de una institución financiera para financiar tu empresa, con la obligación de devolverlo con intereses.",
        { capital: 25, bienestar: -5, reputacion: 0 },
        ["deuda_riesgosa"]
    ),
    defineFinancing(
        "f3_socio_angel",
        "Socio Ángel",
        "Incorpora a un inversor ángel que aporte capital y experiencia, a cambio de participación en la empresa.",
        { capital: 20, bienestar: 0, reputacion: 10 },
        ["equity_diluido"]
    ),
];
