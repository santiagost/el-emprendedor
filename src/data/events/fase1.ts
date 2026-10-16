import { defineEvent, defineOption } from "./builders";

export const fase1Events = [
    defineEvent({
        id: 'f1_mvp_calidad',
        phaseId: 1,
        title: 'El Primer Prototipo',
        description: 'El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado?',
        weight: 10,
        options: [
            defineOption(
                'Lanzar ya mismo para validar con usuarios reales.',
                { capital: 10, reputacion: -10 },
                {
                    addTags: ['cultura_lean'],
                    learningPill: 'Metodología Lean: Lanzar un MVP imperfecto ahorra meses de desarrollo en ideas que nadie quiere.'
                }
            ),
            defineOption(
                'Retrasar el lanzamiento 2 meses hasta que esté impecable.',
                { capital: -15, reputacion: +15, bienestar: -10 },
                {
                    addTags: ["obsesion_calidad"],
                    learningPill: 'Costo de Oportunidad: Perfeccionar un producto sin feedback temprano quema caja sin validar demanda.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_primer_socio',
        phaseId: 1,
        title: 'La Elección del Co-Fundador',
        weight: 10,
        description: 'Necesitás complementar tus habilidades. Aparecen dos personas interesadas en sumarse.',
        options: [
            defineOption(
                'Sumar a un amigo de confianza técnica que comparte tu visión.',
                { reputacion: +5, bienestar: +15 },
                {
                    addTags: ['socio_alineado'],
                    learningPill: 'Alineación de Socios: En etapas tempranas, los valores compartidos y la resiliencia pesan más que el CV.'
                }
            ),
            defineOption(
                'Sumar a un perfil comercial agresivo que exige el 40% del capital.',
                { capital: +15, bienestar: -10 },
                {
                    addTags: ['socio_conflictivo', 'equity_diluido'],
                    learningPill: 'Pactos de Socios (Vesting): Ceder porcentajes fijos al inicio sin metas de permanencia es un riesgo crítico.'
                }
            )
        ]
    }),

    defineEvent({
        id: 'f1_primer_cliente_grande',
        phaseId: 1,
        title: 'Contrato Tentador',
        weight: 8,
        description: 'Una empresa consolidada quiere contratarte, pero exige pagar a 120 días y exclusividad operativa.',
        options: [
            defineOption(
                'Aceptar el contrato para ganar nombre y volumen.',
                { capital: -15, reputacion: +20, bienestar: -10 },
                {
                    addTags: ['cliente_dependencia'],
                    learningPill: 'Capital de Trabajo: Muchas empresas quiebran siendo rentables por no tener caja mientras esperan cobrar.'
                }
            ),
            defineOption(
                'Rechazar y priorizar múltiples clientes chicos con pago al contado.',
                { capital: +10, reputacion: +5 },
                {
                    addTags: ['clientes_diversificados'],
                    learningPill: 'Diversificación de Clientes: Ningún cliente debería representar más del 20% de tu facturación total.'
                }
            )
        ]
    })
]