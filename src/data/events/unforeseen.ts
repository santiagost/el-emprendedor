import { defineEvent, defineOption } from './builders';

export const unforeseenEvents = [
  defineEvent({
    id: 'imp_salto_inflacionario',
    title: 'Salto Inflacionario Imprevisto',
    kind: 'unforeseen',
    description:
      'Un shock macroeconómico disparó los costos de insumos, servicios y alquileres un 35% de golpe. El presupuesto del mes quedó desactualizado.',
    weight: 8,
    options: [
      defineOption(
        'Actualizar tarifas de inmediato para proteger los márgenes.',
        { capital: 10, reputacion: -15, bienestar: -5 },
        {
          learningPill:
            'Inflación y Pricing: En contextos inflacionarios, demorar el ajuste de precios descapitaliza la empresa en cuestión de semanas.',
          outcomeText:
            'Ajustaste tarifas rápidamente. Aunque perdiste algunos clientes descontentos, protegiste el margen operativo de la empresa.',
        }
      ),
      defineOption(
        'Absorber el aumento temporalmente renegociando plazos con proveedores.',
        { capital: -15, reputacion: 10, bienestar: 5 },
        {
          learningPill:
            'Relación con Proveedores: Usar la buena reputación comercial permite ganar aire financiero renegociando condiciones de pago en momentos de shock.',
          outcomeText:
            'Tus proveedores aceptaron mantener condiciones por tu historial intachable. La caja sintió el golpe, pero tus clientes valoraron el esfuerzo.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_caida_servidores',
    title: 'Caída Crítica de Servidores',
    kind: 'unforeseen',
    description:
      'Una falla técnica imprevista en la nube dejó tus sistemas caídos durante 6 horas en pleno horario de mayor demanda. Clientes molestos inundan soporte.',
    weight: 15,
    when: { rubro: ['r1_tecnologia'] },
    options: [
      defineOption(
        'Invertir en infraestructura redundante y soporte enterprise 24/7.',
        { capital: -15, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Disponibilidad y SLA: Invertir en robustez técnica cuesta dinero, pero cada caída de servicio erosiona la confianza del cliente y acelera cancelaciones.',
          outcomeText:
            'Migraste a una infraestructura blindada. El costo fue alto, pero nunca más sufriste una caída prolongada.',
        }
      ),
      defineOption(
        'Restaurar con backups internos y bonificar la cuota del mes a los afectados.',
        { capital: -10, reputacion: 5, bienestar: -10 },
        {
          learningPill:
            'Compensación al Cliente: Reconocer fallas operativas con bonificaciones concretas transforma una mala experiencia en lealtad a largo plazo.',
          outcomeText:
            'El equipo técnico pasó la noche en vela para restaurar la base. Las bonificaciones calmaron los ánimos de los usuarios clave.',
        }
      ),
    ],
  }),

  // Variantes de imp_caida_servidores para los rubros que no son Tecnología: mismas cifras, otro contexto.
  defineEvent({
    id: 'imp_corte_cobros',
    title: 'Corte de Cobros en Horario Pico',
    kind: 'unforeseen',
    description:
      'Una falla imprevista dejó caído tu sistema de cobros durante 6 horas, en pleno horario de mayor demanda. Clientes molestos se acumulan en las cajas.',
    weight: 15,
    when: { rubro: ['r2_comercio'] },
    options: [
      defineOption(
        'Invertir en un sistema de cobros con respaldo y soporte técnico 24/7.',
        { capital: -15, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Continuidad Operativa: Invertir en respaldo cuesta dinero, pero cada caída del sistema de cobros erosiona la confianza del cliente y acelera las ventas perdidas.',
          outcomeText:
            'Instalaste un sistema de cobros con respaldo. El costo fue alto, pero nunca más sufriste una caída prolongada en las cajas.',
        }
      ),
      defineOption(
        'Cobrar a mano con lo que haya y bonificar la compra a los afectados.',
        { capital: -10, reputacion: 5, bienestar: -10 },
        {
          learningPill:
            'Compensación al Cliente: Reconocer las fallas con bonificaciones concretas transforma una mala experiencia en lealtad a largo plazo.',
          outcomeText:
            'El equipo cobró a mano toda la tarde y concilió las cuentas de noche. Las bonificaciones calmaron los ánimos de los clientes que más esperaron.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_caida_agenda',
    title: 'Caída de la Agenda y las Herramientas',
    kind: 'unforeseen',
    description:
      'Una falla imprevista dejó fuera de servicio durante 6 horas la agenda y las herramientas con las que trabajás, en pleno horario de mayor demanda. Clientes molestos llaman sin parar.',
    weight: 15,
    when: { rubro: ['r3_servicios'] },
    options: [
      defineOption(
        'Invertir en herramientas con respaldo y soporte técnico 24/7.',
        { capital: -15, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Continuidad del Servicio: Invertir en respaldo cuesta dinero, pero cada caída del servicio erosiona la confianza del cliente y acelera las cancelaciones.',
          outcomeText:
            'Pasaste la agenda y las herramientas a una plataforma con respaldo. El costo fue alto, pero nunca más sufriste una caída prolongada.',
        }
      ),
      defineOption(
        'Reconstruir la agenda a mano y bonificar el próximo servicio a los afectados.',
        { capital: -10, reputacion: 5, bienestar: -10 },
        {
          learningPill:
            'Compensación al Cliente: Reconocer las fallas con bonificaciones concretas transforma una mala experiencia en lealtad a largo plazo.',
          outcomeText:
            'El equipo pasó la noche en vela reconstruyendo agenda y pedidos. Las bonificaciones calmaron los ánimos de los clientes clave.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_corte_energia',
    title: 'Corte de Energía en la Planta',
    kind: 'unforeseen',
    description:
      'Un corte de energía imprevisto frenó tu planta durante 6 horas, en pleno horario de mayor demanda. Los pedidos se atrasan y los clientes reclaman.',
    weight: 15,
    when: { rubro: ['r4_produccion'] },
    options: [
      defineOption(
        'Invertir en un generador propio y en mantenimiento preventivo permanente.',
        { capital: -15, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Continuidad Operativa: Invertir en respaldo cuesta dinero, pero cada parada de la planta erosiona la confianza del cliente y acelera las cancelaciones.',
          outcomeText:
            'Instalaste un generador y un plan de mantenimiento. El costo fue alto, pero nunca más sufriste una parada prolongada.',
        }
      ),
      defineOption(
        'Reprogramar la producción con turnos extra y bonificar a los clientes afectados.',
        { capital: -10, reputacion: 5, bienestar: -10 },
        {
          learningPill:
            'Compensación al Cliente: Reconocer las fallas con bonificaciones concretas transforma una mala experiencia en lealtad a largo plazo.',
          outcomeText:
            'El equipo hizo turnos extra durante días para recuperar el atraso. Las bonificaciones calmaron los ánimos de los clientes con pedidos demorados.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_viralizacion_inesperada',
    title: 'Viralización Inesperada en Redes',
    kind: 'unforeseen',
    description:
      'Un referente de tu nicho recomendó espontáneamente tu producto ante 200.000 seguidores. El tráfico y las altas se dispararon un 500% en un día.',
    weight: 12,
    options: [
      defineOption(
        'Habilitar lista de espera para asegurar que cada nuevo usuario tenga una experiencia impecable.',
        { reputacion: 20, bienestar: 5 },
        {
          learningPill:
            'Calidad vs Volumen: Crecer más rápido que tu capacidad de atención suele destruir la propuesta de valor. La exclusividad cuidada fideliza mejor.',
          outcomeText:
            'La lista de espera generó curiosidad y deseo de exclusividad. Cada cliente atendido se convirtió en embajador de la marca.',
        }
      ),
      defineOption(
        'Abrir las puertas a todo el tráfico y absorber la mayor cantidad de clientes posible.',
        { capital: 25, reputacion: -10, bienestar: -20 },
        {
          learningPill:
            'Escala Prematura: Capturar una ola masiva de demanda sin la estructura lista satura la atención y genera una oleada de críticas.',
          outcomeText:
            'Facturaste récord en una semana, pero el equipo colapsó de agotamiento y varias quejas de soporte aparecieron en redes.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_inspeccion_sorpresa',
    title: 'Inspección Impositiva y Laboral Sorpresiva',
    kind: 'unforeseen',
    description:
      'Inspectores del organismo regulador se presentan en tus oficinas para una auditoría sorpresa de encuadre laboral, contratos y facturación.',
    weight: 12,
    options: [
      defineOption(
        'Acompañar con asesoría contable profesional y presentar libros limpios.',
        { capital: -10, reputacion: 15, bienestar: 5 },
        {
          learningPill:
            'Costo de Compliance: Operar en regla cuesta dinero día a día, pero te protege de clausuras o multas confiscatorias ante auditorías sorpresa.',
          outcomeText:
            'La auditoría concluyó sin objeciones graves. La formalidad fiscal demostró ser tu mejor escudo protector.',
        }
      ),
      defineOption(
        'Solicitar prórroga administrativa para emprolijar inconsistencias con asesor legal.',
        { capital: -5, reputacion: -10, bienestar: -15 },
        {
          learningPill:
            'Riesgo Regulatorio: La informalidad como mecanismo de ahorro genera contingencias legales que estallan en el peor momento.',
          outcomeText:
            'La prórroga te dio tiempo para emprolijar contratos, pero la inspección quedó abierta y el estrés en el equipo se hizo notar.',
        }
      ),
    ],
  }),

  defineEvent({
    id: 'imp_paro_transporte',
    title: 'Paro de Transporte',
    weight: 12,
    description: 'Un paro de transporte deja a media ciudad sin poder moverse. Tu equipo y tus clientes no llegan, y las entregas están frenadas.',
    options: [
      defineOption(
        'Pasar el día a modo remoto y reorganizar tareas.',
        { capital: -3, bienestar: +3, reputacion: +3 },
        {
          learningPill: 'Continuidad Operativa: Una empresa que puede trabajar a distancia absorbe mejor los imprevistos de movilidad.',
          outcomeText: 'Reorganizaste el día a distancia. Se perdió algo de productividad, pero nadie quedó varado.',
        }
      ),
      defineOption(
        'Exigir presencia a quienes puedan llegar como sea.',
        { capital: +3, bienestar: -10, reputacion: -5 },
        {
          learningPill: 'Clima Laboral: Exigir un esfuerzo extraordinario por un problema ajeno desgasta la confianza del equipo.',
          outcomeText: 'Pediste que fueran igual. Algunos llegaron agotados y otros se sintieron maltratados.',
        }
      ),
      defineOption(
        'Cerrar el día y recuperar las horas después.',
        { capital: -10, bienestar: +5, reputacion: -5 },
        {
          learningPill: 'Costo de Parar: Frenar un día completo cuesta ventas, pero cuida al equipo si después se recupera con criterio.',
          outcomeText: 'Cerraste el día. Perdiste ventas y algunos clientes se quejaron, pero tu equipo lo agradeció.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_cliente_quiebra',
    title: 'Un Cliente Entra en Quiebra',
    weight: 12,
    description: 'Uno de tus clientes se presentó en convocatoria de acreedores y te debe facturas pendientes. No sabés cuánto vas a poder cobrar.',
    options: [
      defineOption(
        'Presentarte como acreedor y reclamar formalmente.',
        { capital: -8, bienestar: -5 },
        {
          learningPill: 'Concurso de Acreedores: Reclamar formalmente te da un lugar en la fila, aunque se cobra tarde y poco.',
          outcomeText: 'Presentaste tus facturas al proceso. Vas a cobrar algo, pero dentro de mucho tiempo y con un abogado de por medio.',
        }
      ),
      defineOption(
        'Aceptar una quita y cobrar rápido una parte.',
        { capital: -12, bienestar: +3 },
        {
          learningPill: 'Quita Negociada: Cobrar menos pero rápido suele convenir más que esperar un concurso incierto.',
          outcomeText: 'Aceptaste una quita fuerte. Perdiste parte de lo que te debían, pero recuperaste caja enseguida.',
        }
      ),
      defineOption(
        'Pasarlo a pérdida y no gastar más energía.',
        { capital: -20, bienestar: +5 },
        {
          learningPill: 'Pérdida Reconocida: A veces cortar la pérdida es lo más sano, pero sale muy caro si podías cobrar algo.',
          outcomeText: 'Decidiste dar la deuda por perdida. Te sacaste el tema de encima, aunque a un costo alto.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_mail_urgente',
    title: 'Un Mail Urgente del "Dueño"',
    weight: 12,
    description: 'Alguien de administración recibe un mail que parece tuyo: pide una transferencia urgente y confidencial a una cuenta nueva. La persona te consulta antes de pagar.',
    options: [
      defineOption(
        'Frenar el pago, verificar por otro canal y capacitar al equipo.',
        { capital: -3, bienestar: -3, reputacion: +3 },
        {
          addTags: ['procesos_solidos'],
          learningPill: 'Seguridad y Procesos: Verificar por un segundo canal cualquier pedido de transferencia es la defensa más barata contra el fraude.',
          outcomeText: 'Descubrieron que el mail era falso. Aprovechaste para armar un protocolo de verificación para pagos.',
        }
      ),
      defineOption(
        'Pagar: parece urgente y de confianza.',
        { capital: -25, bienestar: -10, reputacion: -5 },
        {
          learningPill: 'Fraude del Falso Directivo: Estas estafas funcionan porque combinan urgencia, autoridad y confidencialidad; ceder es lo que buscan.',
          outcomeText: 'Se hizo la transferencia y el mail era falso. Perdiste una suma importante que difícilmente recuperes.',
        }
      ),
      defineOption(
        'Ignorarlo y no avisar a nadie.',
        { bienestar: +3, reputacion: -3 },
        {
          learningPill: 'Cultura de Alerta: No avisar de un intento de fraude deja al resto sin saber que el próximo mail puede ser real.',
          outcomeText: 'No pasó nada esta vez, pero nadie más sabe que existe el intento y el equipo sigue expuesto.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_integrante_enfermo',
    title: 'Una Persona Clave se Enferma',
    weight: 12,
    description: 'Una persona clave de tu equipo se enferma y estará varias semanas sin poder trabajar. Nadie más sabe hacer lo que hacía.',
    options: [
      defineOption(
        'Cubrir su trabajo vos mismo mientras tanto.',
        { bienestar: -15 },
        {
          learningPill: 'Dependencia de Personas: Cuando solo una persona sabe hacer algo, cada baja se paga con el tiempo y la energía de los demás.',
          outcomeText: 'Hiciste su trabajo además del tuyo. Todo siguió funcionando, pero terminaste exhausto.',
        }
      ),
      defineOption(
        'Contratar un reemplazo temporal.',
        { capital: -10, reputacion: +3 },
        {
          learningPill: 'Contingencia de Personal: Un reemplazo temporal cuesta, pero evita que la empresa dependa del agotamiento de alguien.',
          outcomeText: 'Sumaste a una persona por unas semanas. Costó plata, pero la operación no se resintió.',
        }
      ),
      defineOption(
        'Pausar los proyectos que dependen de esa persona.',
        { capital: -5, bienestar: +3, reputacion: -10 },
        {
          learningPill: 'Costo de Esperar: Frenar proyectos protege al equipo, pero los clientes que esperan lo notan.',
          outcomeText: 'Frenaste lo que dependía de esa persona. El equipo respiró, pero hubo clientes que esperaron más de lo que querían.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_nuevo_impuesto',
    title: 'Una Nueva Retención en tus Cobros',
    weight: 12,
    description: 'Una nueva retención reduce lo que realmente recibís en cada cobro. Tu contador dice que hay que tomar una decisión sobre cómo manejarla.',
    options: [
      defineOption(
        'Contratar un asesor fiscal para ordenar tu situación.',
        { capital: -8, bienestar: +3, reputacion: +3 },
        {
          addTags: ['procesos_solidos'],
          learningPill: 'Planificación Fiscal: Un buen asesor puede encontrar herramientas para reducir el impacto de un cambio impositivo.',
          outcomeText: 'Un asesor revisó tu situación y encontró cómo pagar menos. Costó plata, pero ordenó tus papeles.',
        }
      ),
      defineOption(
        'Trasladar el costo a tus precios.',
        { capital: +8, bienestar: -3, reputacion: -8 },
        {
          learningPill: 'Traslado de Impuestos: Trasladar un costo impositivo al precio protege tu margen, pero algunos clientes lo notan y se quejan.',
          outcomeText: 'Subiste los precios para compensar. Tu margen se mantuvo, aunque algunos clientes no lo tomaron bien.',
        }
      ),
      defineOption(
        'Absorber el costo por ahora.',
        { capital: -15, reputacion: +3 },
        {
          learningPill: 'Costo Oculto: Absorber un impuesto sin cambiar nada protege tu relación con el cliente, pero va comiendo tu margen.',
          outcomeText: 'Decidiste no tocar los precios. Los clientes lo agradecieron, y tu rentabilidad quedó más finita.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_nota_en_medio',
    title: 'Un Periodista Quiere Entrevistarte',
    weight: 12,
    description: 'Un periodista de un medio del sector quiere entrevistarte para una nota sobre emprendedores. Es visibilidad gratis, pero implica tiempo y exponerte.',
    options: [
      defineOption(
        'Aceptar y prepararte bien.',
        { capital: +3, bienestar: -5, reputacion: +20 },
        {
          learningPill: 'Prensa como Activo: Una nota bien preparada da visibilidad que no se compra con publicidad.',
          outcomeText: 'Te preparaste, diste la entrevista y la nota salió muy bien. Varios clientes nuevos mencionaron que te vieron en el medio.',
        }
      ),
      defineOption(
        'Mandar a alguien de tu equipo a hablar por la empresa.',
        { bienestar: -2, reputacion: +8 },
        {
          learningPill: 'Delegar la Voz: Que otra persona hable por la empresa distribuye el reconocimiento, aunque pierde algo de impacto.',
          outcomeText: 'Tu persona de confianza dio la entrevista. La nota fue correcta y dejó buena imagen, sin tanta exposición para vos.',
        }
      ),
      defineOption(
        'Declinar: no es el momento.',
        { bienestar: +3 },
        {
          learningPill: 'Costo de Oportunidad: Decir que no a la prensa protege tu tiempo, pero deja pasar una visibilidad que quizás no vuelva.',
          outcomeText: 'Dijiste que no. Seguiste con lo tuyo y la oportunidad pasó.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_referido_inesperado',
    title: 'Una Recomendación te Abre una Puerta',
    weight: 12,
    when: {
      tags: ['red_contactos'],
    },
    description: 'Alguien de tu red te recomendó a un cliente muy grande y te pide una propuesta para la semana que viene.',
    options: [
      defineOption(
        'Dejar todo y preparar la mejor propuesta posible.',
        { capital: +20, bienestar: -12, reputacion: +8 },
        {
          learningPill: 'Capital Social: Una buena red te trae oportunidades que no se compran, pero aprovecharlas exige estar listo para ejecutarlas.',
          outcomeText: 'Pasaste varios días preparando una propuesta impecable. El cliente quedó impresionado y cerró casi sin negociar.',
        }
      ),
      defineOption(
        'Responder con una propuesta rápida con lo que ya tenés.',
        { capital: +10, bienestar: -3, reputacion: +3 },
        {
          learningPill: 'Eficiencia: Reutilizar material ya armado permite responder rápido, aunque la propuesta resulta menos a medida.',
          outcomeText: 'Mandaste una propuesta a partir de lo que ya tenías. El cliente la aceptó, aunque con menos entusiasmo.',
        }
      ),
      defineOption(
        'Derivarlo a otro profesional de tu red y cobrar una comisión.',
        { capital: +6, bienestar: +3, reputacion: +5 },
        {
          learningPill: 'Referidos: Derivar a quien está mejor posicionado fortalece tu red y deja un ingreso con poco esfuerzo.',
          outcomeText: 'Le pasaste el cliente a un colega de confianza. Cobraste una comisión y tu colega quedó agradecido.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_competidor_cierra',
    title: 'Un Competidor Baja la Persiana',
    weight: 12,
    description: 'Un competidor del rubro cierra sin aviso. Sus clientes buscan alternativas y su equipo quedó en la calle.',
    options: [
      defineOption(
        'Ofrecerte a sus clientes con una propuesta especial.',
        { capital: +12, bienestar: -8, reputacion: +3 },
        {
          learningPill: 'Captura de Mercado: Los clientes de un competidor que cierra buscan opciones de inmediato; quien llega primero, gana.',
          outcomeText: 'Contactaste a los clientes que quedaron sin proveedor con una oferta de bienvenida. Varios se quedaron para siempre.',
        }
      ),
      defineOption(
        'Contratar a las mejores personas de su equipo.',
        { capital: -12, bienestar: -3, reputacion: +8 },
        {
          learningPill: 'Talento Disponible: Un cierre libera talento que suele ser difícil de conseguir, aunque sumarlo cuesta.',
          outcomeText: 'Contrataste a dos personas de gran nivel. Tu equipo creció y ganó experiencia, aunque la nómina se encareció.',
        }
      ),
      defineOption(
        'Comprar a bajo precio sus equipos y stock.',
        { capital: -6, bienestar: -5, reputacion: +2 },
        {
          learningPill: 'Compra de Activos en Liquidación: Un cierre puede dejar equipos y stock a precio de remate, si realmente los necesitás.',
          outcomeText: 'Compraste equipos y stock a precio muy bajo. Algunos te sirvieron y otros quedaron en el depósito.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_politica_plataforma',
    title: 'La Plataforma Cambia las Reglas',
    weight: 12,
    when: {
      rubro: ['r1_tecnologia'],
    },
    description: 'La plataforma donde distribuís tu producto cambió sus políticas: exige nuevos permisos y se queda con una comisión más alta. Tenés pocos días para adaptarte.',
    options: [
      defineOption(
        'Adaptarte rápido a las nuevas reglas.',
        { capital: -10, bienestar: -8, reputacion: +3 },
        {
          learningPill: 'Dependencia de Plataformas: Quien controla la distribución puede cambiar las reglas, y vos tenés que adaptarte o salir.',
          outcomeText: 'Hiciste los cambios a contrarreloj. Seguís dentro de la plataforma, con una comisión más alta.',
        }
      ),
      defineOption(
        'Trasladar la comisión a tus precios.',
        { capital: +5, bienestar: -3, reputacion: -10 },
        {
          learningPill: 'Traslado de Comisiones: Subir el precio protege tu margen, pero te vuelve menos competitivo frente a quienes absorben el costo.',
          outcomeText: 'Subiste tus precios. Tu margen se mantuvo, aunque algunos usuarios se fueron a alternativas más baratas.',
        }
      ),
      defineOption(
        'Buscar otras formas de llegar a tus usuarios.',
        { capital: -6, bienestar: -10, reputacion: +5 },
        {
          learningPill: 'Canales Propios: Construir tu propio canal reduce la dependencia, pero lleva tiempo y esfuerzo.',
          outcomeText: 'Empezaste a trabajar en un canal propio. Es un camino más largo, pero te da más control.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_vulnerabilidad_libreria',
    title: 'Falla Crítica en una Herramienta',
    weight: 12,
    when: {
      rubro: ['r1_tecnologia'],
    },
    description: 'Se descubre una falla crítica en una librería que usa tu producto y todo el mundo está parcheando a las apuradas. Si no actuás hoy, tus clientes quedan expuestos.',
    options: [
      defineOption(
        'Parchear de inmediato, con todo el equipo.',
        { capital: -5, bienestar: -12, reputacion: +8 },
        {
          learningPill: 'Respuesta a Incidentes: Parchear rápido reduce la exposición, aunque exige frenar todo lo demás.',
          outcomeText: 'Todo el equipo trabajó toda la noche. A la mañana el producto estaba parcheado y ningún cliente tuvo problemas.',
        }
      ),
      defineOption(
        'Parchear y avisar a tus clientes qué pasó.',
        { capital: -8, bienestar: -10, reputacion: +12 },
        {
          learningPill: 'Transparencia: Avisar a los clientes de un incidente, aun resuelto, construye una confianza que no se compra.',
          outcomeText: 'Parcheaste y mandaste un comunicado claro. Varios clientes escribieron para agradecerte que los mantuvieras informados.',
        }
      ),
      defineOption(
        'Esperar a que salga una versión estable del parche.',
        { bienestar: +3, reputacion: -12 },
        {
          learningPill: 'Exposición Innecesaria: Esperar con una falla crítica conocida es apostar a que nadie la aproveche primero.',
          outcomeText: 'Esperaste a la versión estable. Hubo algunos intentos de explotar la falla y clientes que se enteraron por otro lado.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_robo_local',
    title: 'Entraron a tu Local',
    weight: 12,
    when: {
      rubro: ['r2_comercio'],
    },
    description: 'Entraron a robar a tu local durante la noche. Se llevaron mercadería y dañaron la persiana.',
    options: [
      defineOption(
        'Hacer la denuncia y reclamar al seguro.',
        { capital: -8, bienestar: -8 },
        {
          learningPill: 'Seguro Comercial: Un seguro bien contratado transforma un golpe en un costo manejable, aunque cobrar lleva tiempo.',
          outcomeText: 'Hiciste la denuncia y presentaste el reclamo. El seguro te cubrirá una parte, pero tardará semanas en pagar.',
        }
      ),
      defineOption(
        'Reforzar la seguridad y reponer todo de inmediato.',
        { capital: -15, bienestar: -5, reputacion: +3 },
        {
          learningPill: 'Prevención: Invertir en seguridad después de un robo evita el siguiente, aunque cuesta caja en un mal momento.',
          outcomeText: 'Pusiste rejas y alarma y repusiste la mercadería. Tu local está más seguro, pero la caja quedó golpeada.',
        }
      ),
      defineOption(
        'Reponer lo justo y seguir como si nada.',
        { capital: -10, bienestar: -3, reputacion: -3 },
        {
          learningPill: 'Riesgo Asumido: No reforzar la seguridad deja a tu comercio expuesto a que vuelva a pasar.',
          outcomeText: 'Repusiste lo imprescindible y seguiste. Algunos clientes notaron que no cambió nada y quedaron con dudas.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_producto_agotado',
    title: 'Un Producto se Agota por una Moda',
    weight: 12,
    when: {
      rubro: ['r2_comercio'],
    },
    description: 'Un producto tuyo se puso de moda de un día para el otro y se agota en horas. Los clientes te piden que repongas ya.',
    options: [
      defineOption(
        'Reponer ya con un pedido urgente, pagando más.',
        { capital: +10, bienestar: -10, reputacion: +5 },
        {
          learningPill: 'Reposición Urgente: Reponer a las apuradas aprovecha la moda, aunque a un costo mayor y con riesgo de quedar con exceso.',
          outcomeText: 'Hiciste un pedido urgente y a un precio más caro. Vendiste mucho, aunque la moda se enfrió antes de terminar el stock.',
        }
      ),
      defineOption(
        'Armar una lista de espera con precio normal.',
        { capital: +6, bienestar: -3, reputacion: +8 },
        {
          learningPill: 'Escasez Cuidada: Una lista de espera mantiene el interés y la buena imagen sin comprar a ciegas.',
          outcomeText: 'Armaste una lista de espera. Algunos clientes se fueron a otro lado, pero los que esperaron valoraron tu seriedad.',
        }
      ),
      defineOption(
        'Subir el precio mientras dure la moda.',
        { capital: +15, reputacion: -12 },
        {
          learningPill: 'Precios Dinámicos: Subir el precio durante una moda da margen, pero deja a los clientes con la sensación de que te aprovechaste.',
          outcomeText: 'Subiste los precios. Ganaste mucho en pocos días, pero hubo críticas en redes por el aumento.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_reclamo_profesional',
    title: 'Un Reclamo Formal de un Cliente',
    weight: 12,
    when: {
      rubro: ['r3_servicios'],
    },
    description: 'Un cliente te envía un reclamo formal: dice que tu trabajo le causó un perjuicio y pide una compensación.',
    options: [
      defineOption(
        'Revisar el caso con tu documentación y negociar un acuerdo.',
        { capital: -12, bienestar: -8, reputacion: +3 },
        {
          learningPill: 'Documentación: Tener todo por escrito (alcance, cambios y aprobaciones) es la mejor defensa ante un reclamo.',
          outcomeText: 'Revisaste cada correo y cada entrega. Con eso, negociaste un acuerdo razonable y la relación no se cortó.',
        }
      ),
      defineOption(
        'Rechazar el reclamo y defender tu trabajo.',
        { capital: -5, bienestar: -12, reputacion: -5 },
        {
          learningPill: 'Escalar un Conflicto: Defender tu trabajo sin negociar puede ser justo, pero un juicio cuesta tiempo, plata y estrés.',
          outcomeText: 'Rechazaste el reclamo con firmeza. El cliente insistió y empezaste a recibir cartas de abogados.',
        }
      ),
      defineOption(
        'Pagar lo que pide para cerrar el tema.',
        { capital: -22, bienestar: +3 },
        {
          learningPill: 'Costo de Evitar el Conflicto: Pagar sin discutir cierra el tema rápido, pero puede invitar a otros reclamos.',
          outcomeText: 'Pagaste lo que pedían. El tema se cerró enseguida, aunque la plata duele.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_cliente_cancela',
    title: 'Tu Mayor Cliente No Renueva',
    weight: 12,
    when: {
      rubro: ['r3_servicios'],
    },
    description: 'Tu cliente más grande decide no renovar su abono porque recortó presupuesto. Representa una parte importante de tus ingresos mensuales.',
    options: [
      defineOption(
        'Ofrecerle un plan reducido para conservarlo.',
        { capital: -5, bienestar: -5, reputacion: +3 },
        {
          learningPill: 'Retención de Clientes: Ofrecer una versión más chica puede conservar la relación mientras el cliente se recupera.',
          outcomeText: 'Le ofreciste una versión reducida del servicio. Aceptó, y sigue siendo cliente aunque pague bastante menos.',
        }
      ),
      defineOption(
        'Salir a buscar rápido clientes que lo reemplacen.',
        { capital: -12, bienestar: -10, reputacion: +5 },
        {
          learningPill: 'Reposición de Cartera: Reemplazar a un cliente grande exige un esfuerzo comercial fuerte y sostenido.',
          outcomeText: 'Te pusiste a vender como al principio. Conseguiste algunos clientes nuevos, a costa de muchas horas.',
        }
      ),
      defineOption(
        'Recortar gastos para absorber la pérdida.',
        { capital: -8, bienestar: -12 },
        {
          learningPill: 'Ajuste de Costos: Recortar gastos protege la caja, pero también el crecimiento y el ánimo del equipo.',
          outcomeText: 'Recortaste gastos en todo lo que se pudo. La caja aguantó, pero el equipo trabaja con más presión.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_materia_prima_dispara',
    title: 'Se Dispara el Insumo Principal',
    weight: 12,
    when: {
      rubro: ['r4_produccion'],
    },
    description: 'El insumo principal de tu producción duplicó su precio por un problema en el mercado internacional. Tu margen se evapora.',
    options: [
      defineOption(
        'Cambiar la receta o el insumo por una alternativa más barata.',
        { capital: +5, bienestar: -8, reputacion: -10 },
        {
          learningPill: 'Sustitución de Insumos: Cambiar un insumo ahorra costos, pero puede afectar la calidad que tus clientes ya conocen.',
          outcomeText: 'Reformulaste con un insumo alternativo. El costo bajó, aunque algunos clientes notaron la diferencia.',
        }
      ),
      defineOption(
        'Trasladar el aumento a tus precios.',
        { capital: +10, bienestar: -3, reputacion: -12 },
        {
          learningPill: 'Traslado de Costos: Subir precios protege el margen, pero hay que ver si tus clientes lo aceptan.',
          outcomeText: 'Subiste los precios para compensar. Tu margen se salvó, aunque perdiste algunos clientes sensibles al precio.',
        }
      ),
      defineOption(
        'Absorberlo y recortar otros costos.',
        { capital: -15, bienestar: -8, reputacion: +3 },
        {
          learningPill: 'Compresión de Margen: Absorber un aumento fuerte sin cambiar nada exige recortar en otro lado, y se nota.',
          outcomeText: 'Absorbiste el golpe y ajustaste otros gastos. Mantuviste tus precios y tu calidad, a costa de tu margen.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_pedido_urgente',
    title: 'Un Pedido Enorme y Urgente',
    weight: 12,
    when: {
      rubro: ['r4_produccion'],
    },
    description: 'Un cliente te hace un pedido enorme para entregar en pocas semanas, el triple de lo que producís normalmente.',
    options: [
      defineOption(
        'Aceptar todo y producir a máxima capacidad.',
        { capital: +20, bienestar: -18, reputacion: +5 },
        {
          learningPill: 'Capacidad de Producción: Aceptar un pedido muy por encima de tu capacidad da ingresos hoy, pero lleva a tu equipo y a tus máquinas al límite.',
          outcomeText: 'Aceptaste todo y trabajaron a máxima capacidad. Entregaste, aunque el equipo quedó agotado.',
        }
      ),
      defineOption(
        'Aceptar una parte y entregarla bien.',
        { capital: +10, bienestar: -5, reputacion: +8 },
        {
          learningPill: 'Calidad antes que Volumen: Aceptar solo lo que podés hacer bien protege tu reputación frente al cliente.',
          outcomeText: 'Aceptaste una parte del pedido y la entregaste impecable. El cliente valoró la seriedad y volvió a pedirte.',
        }
      ),
      defineOption(
        'Declinar: no llegás con la calidad que exigís.',
        { bienestar: +3, reputacion: -3 },
        {
          learningPill: 'Decir que No: Declinar un pedido que no podés cumplir evita problemas, pero deja pasar un ingreso.',
          outcomeText: 'Dijiste que no. Tu producción siguió normal, aunque el cliente le compró a otro.',
        }
      ),
    ]
  }),

  defineEvent({
    id: 'imp_tormenta_deposito',
    title: 'Una Tormenta Inunda el Depósito',
    weight: 12,
    when: {
      rubro: ['r2_comercio', 'r4_produccion'],
    },
    description: 'Una fuerte tormenta inundó tu depósito. Parte de la mercadería y de los insumos se arruinaron.',
    options: [
      defineOption(
        'Reclamar al seguro y esperar la inspección.',
        { capital: -8, bienestar: -8 },
        {
          learningPill: 'Seguro Patrimonial: Un seguro cubre una parte del daño, pero la inspección y el cobro suelen tardar más de lo que la caja resiste.',
          outcomeText: 'Presentaste el reclamo y esperaste. Pasaron semanas hasta cobrar, y mientras tanto tuviste que operar con poco stock.',
        }
      ),
      defineOption(
        'Reparar y reponer con tus propios fondos.',
        { capital: -18, bienestar: -5, reputacion: +3 },
        {
          learningPill: 'Reserva de Emergencia: Una reserva permite reponerte rápido, pero cada peso gastado deja menos margen para lo demás.',
          outcomeText: 'Reparaste y repusiste todo enseguida. La operación no se frenó, pero la caja lo sintió mucho.',
        }
      ),
      defineOption(
        'Mudar el depósito a un lugar más seguro.',
        { capital: -12, bienestar: -10, reputacion: +5 },
        {
          learningPill: 'Gestión del Riesgo: Mudarte a un lugar seguro es una inversión que evita repetir el problema.',
          outcomeText: 'Cambiaste de depósito a un lugar elevado y seco. Costó y fue un caos, pero no vas a volver a tener este problema.',
        }
      ),
    ]
  }),
];
