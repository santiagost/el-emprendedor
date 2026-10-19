import { defineEvent, defineOption } from "./builders";

export const fase2Events = [
    defineEvent({
        id: 'f2_crisis_cobro',
        phaseId: 2,
        title: 'El Gran Cliente Demora el Pago',
        weight: 25,
        when: {
            tags: ['cliente_dependencia']
        },
        description: 'Tu cliente corporativo postergó su liquidación 45 días más. No alcanzás a cubrir los costos fijos del mes.',
        options: [
            defineOption(
                'Tomar un crédito rápido a tasa usurera.',
                { capital: +15, bienestar: -20 },
                {
                    addTags: ['deuda_riesgosa'],
                    learningPill: 'Apalancamiento Tóxico: Endeudarse caro para cubrir costos corrientes suele iniciar una espiral de insolvencia.',
                    outcomeText: 'Obtuviste liquidez al instante con un préstamo usurero. Pudiste pagar sueldos hoy, pero las cuotas de intereses se devoran la ganancia de los próximos meses.',
                }
            ),
            defineOption(
                'Renegociar plazos con proveedores y congelar retiros propios.',
                { capital: -5, reputacion: -25, bienestar: -15 },
                {
                    learningPill: 'Gestión de Liquidez: En momentos de estrés de caja, la transparencia con la cadena comercial evita la quiebra.',
                    outcomeText: 'Hablaste cara a cara con tus proveedores y acordaron un cronograma de pago. La reputación sufrió un rasguño, pero evitaste la trampa de la deuda financiera.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_proveedor_critico',
        phaseId: 2,
        title: 'El Dilema de Abastecimiento',
        weight: 10,
        description: 'Podés importar insumos/servicios clave a mitad de precio de un solo proveedor, o mantener varios proveedores locales más caros.',
        options: [
            defineOption(
                'Importar con el proveedor único para maximizar margen.',
                { capital: +20, reputacion: -10 },
                {
                    addTags: ['proveedor_dependiente'],
                    learningPill: 'Riesgo de Cadena de Suministro: Optimizar solo por costo te vuelve vulnerable a aduanas y devaluaciones.',
                    outcomeText: 'Concentraste el 100% de tus compras en el proveedor más barato. Tus márgenes son récord, pero si una entrega aduanera se frena, tu operación se paraliza por completo.',
                }
            ),
            defineOption(
                'Mantener la red local diversificada.',
                { capital: -10, reputacion: +10, bienestar: +5 },
                {
                    addTags: ['proveedores_diversificados'],
                    learningPill: 'Resiliencia Operativa: Pagar una prima por proveedores confiables es una póliza de seguro contra crisis.',
                    outcomeText: 'Mantuviste proveedores locales diversificados. Tu margen es algo más ajustado, pero nunca te quedás sin stock ni dependés de los vaivenes de una sola frontera.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_sobrecarga_equipo',
        phaseId: 2,
        title: 'Pico de Demanda y Cuello de Botella',
        weight: 10,
        description: 'Las ventas crecieron un 60%, pero el equipo no da abasto. Hay quejas de clientes por demoras.',
        options: [
            defineOption(
                'Exigir horas extras y redoblar el esfuerzo sin sumar gente.',
                { capital: +15, reputacion: -25, bienestar: -25 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Deuda Operativa: Forzar la capacidad instalada genera fallas de calidad y rotación no deseada de talento.',
                    outcomeText: 'Exprimiste al equipo con horas extras para despachar los pedidos. Facturaste más, pero el cansancio provocó errores en entregas y el clima interno quedó muy tenso.',
                }
            ),
            defineOption(
                'Frenar nuevas ventas y contratar ayuda de inmediato.',
                { capital: -20, reputacion: +15, bienestar: +10 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Crecimiento Sostenible: Escalar antes de estabilizar las operaciones suele romper el negocio.',
                    outcomeText: 'Frenaste la captación de nuevos clientes para estabilizar las entregas y contrataste refuerzos. Menos caja inmediata, pero clientes conformes y equipo protegido.',
                }
            )
        ]
    }),

    defineEvent({
        id: 'f2_primera_contratacion',
        phaseId: 2,
        title: 'La Primera Contratación Clave',
        weight: 10,
        description: 'La demanda supera lo que podés sostener solo. Necesitás sumar a alguien fuerte al equipo, pero cada perfil implica una apuesta distinta.',
        options: [
            defineOption(
                'Contratar un perfil senior caro que ordene la operación desde el día uno.',
                { capital: -15, reputacion: +10, bienestar: +5 },
                {
                    addTags: ['procesos_solidos'],
                    learningPill: 'Contratación Clave: Un senior caro que resuelve de inmediato suele salir más barato que meses de improvisación.',
                    outcomeText: 'Sumaste a un profesional experimentado. Aunque su salario pesa en la nómina, estructuró procesos clave y te liberó 15 horas semanales de micro-gestión.',
                }
            ),
            defineOption(
                'Apostar por talento junior con potencial y formarlo mientras operás.',
                { capital: +10, reputacion: -15, bienestar: -10 },
                {
                    addTags: ['equipo_sobrecargado'],
                    learningPill: 'Costo de Formación: Formar talento interno es barato en dinero pero caro en tiempo y energía del fundador.',
                    outcomeText: 'Contrataste a un perfil junior con ganas. El costo es bajo, pero pasás la mitad del día supervisándolo y corrigiendo errores normales de la inexperiencia.',
                }
            )
        ]
    })
]