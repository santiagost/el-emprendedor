import type { Archetype, Financing } from '../types/game';

export const ARCHETYPES: Archetype[] = [
    {
        id: "a1_tecnico",
        titulo: "Técnico / Especialista",
        descripcion: "Eres un experto en tu campo, con habilidades técnicas avanzadas y un enfoque en la calidad y precisión.",
        impactPreview: {    
            capital: "down",
            bienestar: "up",
            reputacion: "neutral"
        },
        effects: {
            capital: -10,
            bienestar: 5,
            reputacion: 0
        },
        tags: ["calidad_producto"]
    },
    {
        id: "a2_comercial",
        titulo: "Comercial / Ventas",
        descripcion: "Tienes un talento natural para las ventas y la negociación, y te enfocas en generar ingresos y expandir el mercado.",
        impactPreview: {
            capital: "down",
            bienestar: "neutral",
            reputacion: "up"
        },
        effects: {
            capital: -10,
            bienestar: 0,
            reputacion: 8
        },
        tags: ["generacion_ingresos", "red_contactos"]
    },
    {
        id: "a3_inversionista",
        titulo: "Inversionista / Ahorrista",
        descripcion: "Eres un inversor estratégico que busca maximizar el rendimiento de tus inversiones y construir un patrimonio sostenible.",
        impactPreview: {
            capital: "up",
            bienestar: "down",
            reputacion: "neutral"
        },
        effects: {
            capital: 15,
            bienestar: -5,
            reputacion: 0
        },
        tags: ["inversiones", "patrimonio"]
    }
]


export const FINANCINGS: Financing[] = [
    {
        id: "f1_bootstrap",
        titulo: "Bootstrapping",
        descripcion: "Financia tu empresa con tus propios recursos y ahorros, manteniendo el control total sobre tu negocio.",
        impactPreview: {
            capital: "down",
            bienestar: "neutral",
            reputacion: "neutral"
        },
        effects: {
            capital: -10,
            bienestar: 0,
            reputacion: 0
        },
        tags: ["autonomia_estrategica"]
    },
    {
        id: "f2_prestamo_bancario",
        titulo: "Préstamo Bancario",
        descripcion: "Obtén un préstamo de una institución financiera para financiar tu empresa, con la obligación de devolverlo con intereses.",
        impactPreview: {
            capital: "up",
            bienestar: "down",
            reputacion: "neutral"
        },
        effects: {
            capital: 25,
            bienestar: -5,
            reputacion: 0
        },
        tags: ["deuda_riesgosa"]
    },
    {
        id: "f3_socio_angel",
        titulo: "Socio Ángel",
        descripcion: "Incorpora a un inversor ángel que aporte capital y experiencia, a cambio de participación en la empresa.",
        impactPreview: {
            capital: "up",
            bienestar: "neutral",
            reputacion: "up"
        },
        effects: {
            capital: 20,
            bienestar: 0,
            reputacion: 10
        },
        tags: ["equity_diluido"]
    }
]