# Catálogo de Eventos y Tags

> Referencia generada a partir de `src/data/events/` y `src/data/tags.ts`.
> Última actualización: 30/10/2026.
> Es una foto del contenido actual: si agregás, quitás o modificás eventos/tags, actualizá este documento.
> No incluye `src/data/events/_template.ts`, que solo contiene plantillas de autoría ignoradas por el validador.

## Resumen

- **39 eventos** escritos: **26 principales**, **3 de crisis**, **7 imprevistos** y **3 de rescate**.
- **9 son versiones por rubro** de eventos que se repiten con otro contexto (6 principales y 3 imprevistos: `f1_mvp_calidad`, `f3_caida_servicio` e `imp_caida_servidores` tienen una versión por cada rubro; ids con sufijo `_comercio`, `_servicios` o `_produccion`): mismas cifras y etiquetas, otro texto. El original queda para Tecnología. Quien juega ve una sola versión de cada uno, según su rubro.
- **78 opciones** (todos los eventos tienen 2 opciones).
- **23 tags** registrados: **5** se usan como condición de entrada, **3** se eliminan desde alguna opción y **2** no tienen uso en eventos.
- **Sin tags prohibidos**: ningún evento usa `when.forbiddenTags` actualmente.
- **Sin eventos programados**: ninguna opción usa `scheduledEvent` actualmente.
- **Cierran la partida** (`endsGame`, victoria inmediata al elegirlas): `f4_intento_compra_hostil` (O1).
- **Hitos** (uno por fase y rubro, salen en el primer año de su fase): `f1_mvp_calidad`, `f1_mvp_calidad_comercio`, `f1_mvp_calidad_servicios`, `f1_mvp_calidad_produccion`, `f2_primera_contratacion`, `f3_ronda_inversion`, `f4_sucesion_operativa`.

### Eventos principales por fase

Lo que ve cada jugador (cualquier rubro tiene el mismo conteo). La duración Completa tiene 15 años y la Corta 10; la columna Años muestra ambas (Completa / Corta).

| Fase | Años | Nombre | Eventos base | Condicionados | Total |
|---:|---:|---|---:|---:|---:|
| 1 | 1–3 / 1–2 | Génesis & Validación | 3 | 0 | 3 |
| 2 | 4–6 / 3–4 | Tracción & Caja | 3 | 1 | 4 |
| 3 | 7–10 / 5–7 | Escala & Crisis | 4 | 2 | 6 |
| 4 | 11–15 / 8–10 | Consolidación & Salida | 5 | 2 | 7 |
| **Total** | **1–15 / 1–10** | — | **15** | **5** | **20** |

Además de los eventos principales, existen **3 crisis**, **7 imprevistos** (4 situaciones distintas, una con versión por rubro) y **3 rescates** que no pertenecen al pool de ninguna fase: se disparan como interrupciones globales.

## Cómo leer la tabla de eventos

- **Fase / Tipo**: `Fase N · Principal` indica el pool de la fase; `· Hito` marca el evento que sale en el primer año de esa fase. `Crisis (global)`, `Imprevisto (global)` y `Rescate (global)` se disparan como interrupción, no por sorteo de fase. En el código, los tres tienen `phaseId: 1` por el valor por defecto de `defineEvent`, pero el motor no los usa desde el pool de fase.
- **Peso**: peso relativo dentro del sorteo ponderado. Solo compite entre los eventos elegibles en ese momento.
- **Tags necesarios**: el evento requiere **todos** los tags listados (AND).
- **Tags prohibidos**: el evento requiere que **ninguno** de los tags listados esté activo. Actualmente todos están vacíos.
- **Otras condiciones**: rubro, condiciones de métricas, arquetipo, financiamiento o `playedBefore`. Hoy solo las crisis usan condiciones de métricas y solo las versiones por rubro (y los 3 originales de Tecnología) usan `Rubro`.
- **Tags que agrega / saca**: se indica la opción que los produce (`O1`, `O2`). Quitar un tag que no está activo no tiene efecto.
- **Opciones**: `O1`/`O2` respetan el orden del código. `C` = Caja/Capital, `R` = Reputación, `B` = Bienestar. Los efectos se aplican antes de los modifiers pasivos de los tags. `minijuego X` indica que la opción dispara ese minijuego.
- **Repetición**: un evento que ya está en `history` no vuelve a salir en la misma partida.
- **Crisis**: después de resolver un evento principal, si alguna métrica quedó en **≤ 25**, el motor elige una crisis elegible (la crisis además exige su métrica en `< 26`) y ocupa la siguiente decisión antes de avanzar de año.
- **Imprevistos**: después de resolver un evento principal, hay **25%** de probabilidad de imprevisto (**45%** desde el año 7 si todavía no salió ninguno), con un máximo de **2 por partida**. Elige uno elegible (por rubro) que no haya salido antes.
- **Rescate**: la primera vez que una métrica llega a 0 no se pierde: tras esa decisión sale, en el mismo año, el rescate de esa métrica (`rescate_capital`, `rescate_bienestar` o `rescate_reputacion`). Es una sola vez por partida; la segunda vez que una métrica llega a 0, la partida termina. Los costos inmediatos son de -5 como máximo y el costo grande queda en un tag.

## Eventos

| Fase / Tipo | ID | Evento | Descripción | Peso | Tags necesarios | Tags prohibidos | Otras condiciones | Tags que agrega | Tags que saca | Opciones |
|---|---|---|---:|---|---|---|---|---|---|---|
| Fase 1 · Principal · Hito | `f1_mvp_calidad` | **El Primer Prototipo** | El producto funciona pero tiene fallas visuales y bugs menores. ¿Cómo salís al mercado? | 10 | — | — | Rubro: Tecnología | `cultura_lean` (O1)<br>`obsesion_calidad` (O2) | — | **O1** Lanzar ya mismo para validar con usuarios reales. · `C +10 · R -20 · B 0` · agrega `cultura_lean` · minijuego roulette<br>**O2** Retrasar el lanzamiento 2 meses hasta que esté impecable. · `C -15 · R +15 · B -10` · agrega `obsesion_calidad` · minijuego roulette |
| Fase 1 · Principal · Hito | `f1_mvp_calidad_comercio` | **La Primera Apertura** | Tu local está casi listo, pero la vidriera está a medio armar, algunos precios están mal cargados y faltan productos del surtido. ¿Cómo abrís al público? | 10 | — | — | Rubro: Comercio | `cultura_lean` (O1)<br>`obsesion_calidad` (O2) | — | **O1** Abrir ya mismo para validar con clientes reales. · `C +10 · R -20 · B 0` · agrega `cultura_lean` · minijuego roulette<br>**O2** Retrasar la apertura 2 meses hasta que todo esté impecable. · `C -15 · R +15 · B -10` · agrega `obsesion_calidad` · minijuego roulette |
| Fase 1 · Principal · Hito | `f1_mvp_calidad_servicios` | **El Primer Servicio** | Tu servicio funciona, pero la propuesta tiene detalles sin pulir: materiales a medio terminar y procesos que todavía improvisás. ¿Cómo salís a ofrecerlo? | 10 | — | — | Rubro: Servicios | `cultura_lean` (O1)<br>`obsesion_calidad` (O2) | — | **O1** Ofrecerlo ya mismo para validar con clientes reales. · `C +10 · R -20 · B 0` · agrega `cultura_lean` · minijuego roulette<br>**O2** Retrasar el lanzamiento 2 meses hasta que el servicio esté impecable. · `C -15 · R +15 · B -10` · agrega `obsesion_calidad` · minijuego roulette |
| Fase 1 · Principal · Hito | `f1_mvp_calidad_produccion` | **El Primer Lote** | El primer lote salió con terminaciones irregulares y algunos defectos menores. ¿Cómo salís a vender? | 10 | — | — | Rubro: Producción | `cultura_lean` (O1)<br>`obsesion_calidad` (O2) | — | **O1** Vender ya mismo el primer lote para validar con clientes reales. · `C +10 · R -20 · B 0` · agrega `cultura_lean` · minijuego roulette<br>**O2** Retrasar la salida 2 meses hasta que el proceso esté impecable. · `C -15 · R +15 · B -10` · agrega `obsesion_calidad` · minijuego roulette |
| Fase 1 · Principal | `f1_primer_socio` | **La Elección del Co-Fundador** | Necesitás complementar tus habilidades. Aparecen dos personas interesadas en sumarse. | 10 | — | — | — | `socio_alineado` (O1)<br>`socio_conflictivo` (O2)<br>`equity_diluido` (O2) | — | **O1** Sumar a un amigo de confianza técnica que comparte tu visión. · `C 0 · R +5 · B +15` · agrega `socio_alineado`<br>**O2** Sumar a un perfil comercial agresivo que exige el 40% del capital. · `C +15 · R 0 · B -10` · agrega `socio_conflictivo`, `equity_diluido` |
| Fase 1 · Principal | `f1_primer_cliente_grande` | **Contrato Tentador** | Una empresa consolidada quiere contratarte, pero exige pagar a 120 días y exclusividad operativa. | 8 | — | — | — | `cliente_dependencia` (O1)<br>`clientes_diversificados` (O2) | — | **O1** Aceptar el contrato para ganar nombre y volumen. · `C -15 · R +20 · B -10` · agrega `cliente_dependencia`<br>**O2** Rechazar y priorizar múltiples clientes chicos con pago al contado. · `C +10 · R +5 · B 0` · agrega `clientes_diversificados` |
| Fase 2 · Principal | `f2_crisis_cobro` | **El Gran Cliente Demora el Pago** | Tu cliente corporativo postergó su liquidación 45 días más. No alcanzás a cubrir los costos fijos del mes. | 25 | `cliente_dependencia` | — | — | `deuda_riesgosa` (O1) | — | **O1** Tomar un crédito rápido a tasa usurera. · `C +15 · R 0 · B -20` · agrega `deuda_riesgosa`<br>**O2** Renegociar plazos con proveedores y congelar retiros propios. · `C -5 · R -25 · B -15` |
| Fase 2 · Principal | `f2_proveedor_critico` | **El Dilema de Abastecimiento** | Podés importar insumos/servicios clave a mitad de precio de un solo proveedor, o mantener varios proveedores locales más caros. | 10 | — | — | — | `proveedor_dependiente` (O1)<br>`proveedores_diversificados` (O2) | — | **O1** Importar con el proveedor único para maximizar margen. · `C +20 · R -10 · B 0` · agrega `proveedor_dependiente`<br>**O2** Mantener la red local diversificada. · `C -10 · R +10 · B +5` · agrega `proveedores_diversificados` |
| Fase 2 · Principal | `f2_sobrecarga_equipo` | **Pico de Demanda y Cuello de Botella** | Las ventas crecieron un 60%, pero el equipo no da abasto. Hay quejas de clientes por demoras. | 10 | — | — | — | `equipo_sobrecargado` (O1)<br>`procesos_solidos` (O2) | — | **O1** Exigir horas extras y redoblar el esfuerzo sin sumar gente. · `C +15 · R -25 · B -25` · agrega `equipo_sobrecargado`<br>**O2** Frenar nuevas ventas y contratar ayuda de inmediato. · `C -20 · R +15 · B +10` · agrega `procesos_solidos` |
| Fase 2 · Principal · Hito | `f2_primera_contratacion` | **La Primera Contratación Clave** | La demanda supera lo que podés sostener solo. Necesitás sumar a alguien fuerte al equipo, pero cada perfil implica una apuesta distinta. | 10 | — | — | — | `procesos_solidos` (O1)<br>`equipo_sobrecargado` (O2) | — | **O1** Contratar un perfil senior caro que ordene la operación desde el día uno. · `C -15 · R +10 · B +5` · agrega `procesos_solidos`<br>**O2** Apostar por talento junior con potencial y formarlo mientras operás. · `C +10 · R -15 · B -10` · agrega `equipo_sobrecargado` |
| Fase 3 · Principal | `f3_shock_externo` | **Cierre de Importaciones / Devaluación** | El gobierno impone restricciones cambiarias y aduaneras severas. El mercado está en pánico. | 20 | — | — | — | — | — | **O1** Ajustar precios inmediatamente trasladando el 100% de la inflación. · `C +10 · R -30 · B -5`<br>**O2** Absorber parte del costo para ganar clientes de la competencia. · `C -25 · R +25 · B -10` |
| Fase 3 · Principal · Hito | `f3_ronda_inversion` | **Llega un Fondo de Inversión** | Un fondo de Venture Capital ofrece 200k USD, pero exige el 35% de la empresa y una silla con derecho a veto en el directorio. | 10 | — | — | — | `inversion_externa` (O1)<br>`equity_diluido` (O1)<br>`autonomia_estrategica` (O2) | — | **O1** Aceptar la inversión para pisar el acelerador. · `C +35 · R +15 · B -15` · agrega `inversion_externa`, `equity_diluido` · minijuego timing<br>**O2** Rechazar la oferta y continuar autofinanciados (Bootstrapping). · `C 0 · R +5 · B +10` · agrega `autonomia_estrategica` · minijuego timing |
| Fase 3 · Principal | `f3_disputa_socios` | **Guerra en el Directorio** | Tu co-fundador quiere cambiar el rumbo del negocio y amenaza con bloquear las decisiones o llevarse clientes. ¿Qué hacés? | 30 | `socio_conflictivo` | — | — | `conflicto_legal` (O2) | `socio_conflictivo` (O1)<br>`equity_diluido` (O1) | **O1** Comprar su parte pagando una prima alta para recuperar el control. · `C -30 · R +10 · B +15` · saca `socio_conflictivo`, `equity_diluido`<br>**O2** Llevar el conflicto a la justicia y congelar sus atribuciones. · `C -15 · R -25 · B -30` · agrega `conflicto_legal` |
| Fase 3 · Principal | `f3_crisis_burnout` | **El Equipo al Límite** | Renuncian dos personas clave de tu equipo en plena entrega importante. El resto amenaza con irse. | 30 | `equipo_sobrecargado` | — | — | — | `equipo_sobrecargado` (O2) | **O1** Hacerte cargo personalmente de todo el trabajo operativo faltante. · `C 0 · R +10 · B -35` · minijuego tapping<br>**O2** Asumir penalidades contractuales, frenar y dar un bono de retención. · `C -25 · R -10 · B +15` · saca `equipo_sobrecargado` · minijuego balance |
| Fase 3 · Principal | `f3_apuesta_crecimiento` | **Apuesta de Crecimiento** | Una agencia propone una campaña agresiva y cara con resultados inciertos. La alternativa es seguir creciendo lento, a puro boca en boca. | 10 | — | — | — | `generacion_ingresos` (O1)<br>`clientes_diversificados` (O2) | — | **O1** Invertir fuerte en la campaña y apostar a un salto de escala. · `C -20 · R +15 · B 0` · agrega `generacion_ingresos`<br>**O2** Crecer orgánico con referidos, lento pero sin quemar caja. · `C +5 · R +5 · B +5` · agrega `clientes_diversificados` |
| Fase 3 · Principal | `f3_caida_servicio` | **Caída del Servicio en Pleno Pico** | En el mejor momento de demanda, la plataforma se cae. Los clientes están furiosos y cada hora cuenta. | 12 | — | — | Rubro: Tecnología | `procesos_solidos` (O1)<br>`equipo_sobrecargado` (O2) | — | **O1** Frenar las ventas nuevas hasta estabilizar la plataforma. · `C -10 · R +15 · B 0` · agrega `procesos_solidos`<br>**O2** Aplicar un parche rápido y seguir vendiendo a toda máquina. · `C +15 · R -25 · B -15` · agrega `equipo_sobrecargado` |
| Fase 3 · Principal | `f3_caida_servicio_comercio` | **Falla de Stock en Pleno Pico** | En el mejor momento de ventas, el sistema de cobros y stock falla. Hay colas en las cajas, los clientes están furiosos y cada hora cuenta. | 12 | — | — | Rubro: Comercio | `procesos_solidos` (O1)<br>`equipo_sobrecargado` (O2) | — | **O1** Frenar las ventas nuevas hasta ordenar el sistema de stock y cobros. · `C -10 · R +15 · B 0` · agrega `procesos_solidos`<br>**O2** Aplicar un parche rápido y seguir vendiendo a toda máquina. · `C +15 · R -25 · B -15` · agrega `equipo_sobrecargado` |
| Fase 3 · Principal | `f3_caida_servicio_servicios` | **Agenda Desbordada en Pleno Pico** | En el mejor momento de demanda, la agenda se desordena: turnos duplicados, entregas atrasadas y clientes furiosos. Cada hora cuenta. | 12 | — | — | Rubro: Servicios | `procesos_solidos` (O1)<br>`equipo_sobrecargado` (O2) | — | **O1** Frenar la toma de nuevos clientes hasta reordenar la operación. · `C -10 · R +15 · B 0` · agrega `procesos_solidos`<br>**O2** Improvisar sobre la marcha y seguir tomando trabajo a toda máquina. · `C +15 · R -25 · B -15` · agrega `equipo_sobrecargado` |
| Fase 3 · Principal | `f3_caida_servicio_produccion` | **Línea Detenida en Pleno Pico** | En el mejor momento de pedidos, una máquina clave se rompe y la línea se frena. Los clientes están furiosos y cada hora cuenta. | 12 | — | — | Rubro: Producción | `procesos_solidos` (O1)<br>`equipo_sobrecargado` (O2) | — | **O1** Frenar los pedidos nuevos hasta reparar y revisar toda la línea. · `C -10 · R +15 · B 0` · agrega `procesos_solidos`<br>**O2** Hacer una reparación provisoria y seguir produciendo a toda máquina. · `C +15 · R -25 · B -15` · agrega `equipo_sobrecargado` |
| Fase 4 · Principal | `f4_competidor_gigante` | **Ataque Corporativo** | El líder del mercado copió tu producto estrella y lo ofrece a pérdida gracias a su espalda financiera. | 10 | — | — | — | — | — | **O1** Bajar los precios para entrar en guerra tarifaria directa. · `C -30 · R 0 · B -20`<br>**O2** Pivotar a un nicho de altísima especialización y servicio. · `C -10 · R +25 · B +5` |
| Fase 4 · Principal | `f4_intento_compra_hostil` | **Oferta de Compra Hostil** | Un competidor se alió en secreto con tus inversores externos y te ofrecen comprar tu parte obligadamente. | 25 | `equity_diluido` | — | — | `salida_exitosa_venta` (O1) | — | **O1** Vender tus acciones y aceptar un cheque millonario para retirarte. · `C +50 · R +10 · B +20` · agrega `salida_exitosa_venta` · **cierra la partida**<br>**O2** Agotar tus ahorros personales en abogados para pelear por el control. · `C -35 · R -15 · B -30` |
| Fase 4 · Principal | `f4_legado_sostenible` | **El Dilema del Dividendo** | La empresa es rentable, predecible y sólida. ¿Qué hacés con las ganancias acumuladas? | 15 | `autonomia_estrategica` | — | — | `lifestyle_business` (O1)<br>`expansion_global` (O2) | — | **O1** Repartir dividendos y pasar a un rol de presidente de directorio. · `C +20 · R +15 · B +30` · agrega `lifestyle_business`<br>**O2** Reinvertir el 100% de los dividendos en abrir mercado internacional. · `C -25 · R +30 · B -15` · agrega `expansion_global` |
| Fase 4 · Principal | `f4_auditoria_afip` | **Auditoría Fiscal General** | Los inspectores revisan minuciosamente tus libros contables y contrataciones de los últimos 3 años. | 8 | — | — | — | — | — | **O1** Presentar libros limpios (gastaste previamente en orden fiscal). · `C -10 · R +20 · B +10`<br>**O2** Regularizar desprolijidades pasadas pagando multas e intereses. · `C -30 · R -35 · B -20` |
| Fase 4 · Principal · Hito | `f4_sucesion_operativa` | **Soltar la Operación** | La empresa ya funciona sin vos en el día a día. Podés contratar un gerente general y soltar, o seguir decidiendo cada detalle. | 10 | — | — | — | `lifestyle_business` (O1) | — | **O1** Contratar un gerente general y pasar a un rol estratégico. · `C -15 · R +10 · B +20` · agrega `lifestyle_business`<br>**O2** Seguir al mando de cada decisión operativa. · `C +10 · R -5 · B -20` |
| Fase 4 · Principal | `f4_propuesta_franquicia` | **Propuesta de Franquicia** | Un grupo inversor quiere franquiciar tu modelo en todo el país. Escalarías con capital ajeno, pero perderías control sobre la calidad. | 10 | — | — | — | `expansion_global` (O1)<br>`calidad_producto` (O2) | — | **O1** Franquiciar el modelo y escalar con capital de terceros. · `C +20 · R -10 · B -5` · agrega `expansion_global`<br>**O2** Mantener operación propia y control total de la calidad. · `C -10 · R +15 · B +5` · agrega `calidad_producto` |
| Fase 4 · Principal | `f4_alianza_estrategica` | **Alianza Estratégica** | Un jugador complementario propone una alianza comercial con exclusividad. Sumarías fuerza de ventas, a cambio de atarte a un solo socio. | 10 | — | — | — | `red_contactos` (O1)<br>`autonomia_estrategica` (O2) | — | **O1** Firmar la alianza con exclusividad. · `C +15 · R +10 · B -10` · agrega `red_contactos`<br>**O2** Rechazar la alianza y competir en todos los frentes. · `C -10 · R +5 · B +5` · agrega `autonomia_estrategica` |
| Crisis (global) | `crisis_quiebra_inminente` | **Alerta Roja: Caja en Zona de Quiebra** | Tus reservas de liquidez cayeron por debajo del 25%. Quedan días antes de que los pagos reboten y no puedas cubrir los costos fijos. Es necesaria una medida extrema. | 40 | — | — | Caja < 26 | — | — | **O1** Inyectar ahorros personales de emergencia para comprar oxígeno. · `C +20 · R 0 · B -20`<br>**O2** Frenar gastos no esenciales y renegociar plazos con proveedores. · `C +15 · R -15 · B 0` |
| Crisis (global) | `crisis_burnout_extremo` | **Alerta Roja: Colapso por Burnout** | El bienestar del equipo y tu salud tocaron fondo (< 25%). La sobrecarga permanente generó renuncias inminentes y errores graves por fatiga. | 40 | — | — | Bienestar < 26 | — | — | **O1** Frenar la operación 3 días, postergar entregas y dar descanso real. · `C -15 · R -10 · B +25`<br>**O2** Pagar bonos extraordinarios y contratar apoyo temporal sin frenar. · `C -20 · R 0 · B +15` |
| Crisis (global) | `crisis_reputacion_fuga` | **Alerta Roja: Crisis de Confianza en el Mercado** | Tu reputación cayó a niveles críticos (< 25%). Clientes corporativos amenazan con rescindir contratos y en redes sociales hay un aluvión de quejas abiertas. | 40 | — | — | Reputación < 26 | — | — | **O1** Carta pública del fundador asumiendo errores y reembolsando a afectados. · `C -20 · R +25 · B +5`<br>**O2** Contratar una agencia de comunicación de crisis para blindar la marca. · `C -15 · R +15 · B 0` |
| Imprevisto (global) | `imp_salto_inflacionario` | **Salto Inflacionario Imprevisto** | Un shock macroeconómico disparó los costos de insumos, servicios y alquileres un 35% de golpe. El presupuesto del mes quedó desactualizado. | 15 | — | — | — | — | — | **O1** Actualizar tarifas de inmediato para proteger los márgenes. · `C +10 · R -15 · B -5`<br>**O2** Absorber el aumento temporalmente renegociando plazos con proveedores. · `C -15 · R +10 · B +5` |
| Imprevisto (global) | `imp_caida_servidores` | **Caída Crítica de Servidores** | Una falla técnica imprevista en la nube dejó tus sistemas caídos durante 6 horas en pleno horario de mayor demanda. Clientes molestos inundan soporte. | 15 | — | — | Rubro: Tecnología | — | — | **O1** Invertir en infraestructura redundante y soporte enterprise 24/7. · `C -15 · R +15 · B +5`<br>**O2** Restaurar con backups internos y bonificar la cuota del mes a los afectados. · `C -10 · R +5 · B -10` |
| Imprevisto (global) | `imp_corte_cobros` | **Corte de Cobros en Horario Pico** | Una falla imprevista dejó caído tu sistema de cobros durante 6 horas, en pleno horario de mayor demanda. Clientes molestos se acumulan en las cajas. | 15 | — | — | Rubro: Comercio | — | — | **O1** Invertir en un sistema de cobros con respaldo y soporte técnico 24/7. · `C -15 · R +15 · B +5`<br>**O2** Cobrar a mano con lo que haya y bonificar la compra a los afectados. · `C -10 · R +5 · B -10` |
| Imprevisto (global) | `imp_caida_agenda` | **Caída de la Agenda y las Herramientas** | Una falla imprevista dejó fuera de servicio durante 6 horas la agenda y las herramientas con las que trabajás, en pleno horario de mayor demanda. Clientes molestos llaman sin parar. | 15 | — | — | Rubro: Servicios | — | — | **O1** Invertir en herramientas con respaldo y soporte técnico 24/7. · `C -15 · R +15 · B +5`<br>**O2** Reconstruir la agenda a mano y bonificar el próximo servicio a los afectados. · `C -10 · R +5 · B -10` |
| Imprevisto (global) | `imp_corte_energia` | **Corte de Energía en la Planta** | Un corte de energía imprevisto frenó tu planta durante 6 horas, en pleno horario de mayor demanda. Los pedidos se atrasan y los clientes reclaman. | 15 | — | — | Rubro: Producción | — | — | **O1** Invertir en un generador propio y en mantenimiento preventivo permanente. · `C -15 · R +15 · B +5`<br>**O2** Reprogramar la producción con turnos extra y bonificar a los clientes afectados. · `C -10 · R +5 · B -10` |
| Imprevisto (global) | `imp_viralizacion_inesperada` | **Viralización Inesperada en Redes** | Un referente de tu nicho recomendó espontáneamente tu producto ante 200.000 seguidores. El tráfico y las altas se dispararon un 500% en un día. | 12 | — | — | — | — | — | **O1** Habilitar lista de espera para asegurar que cada nuevo usuario tenga una experiencia impecable. · `C 0 · R +20 · B +5`<br>**O2** Abrir las puertas a todo el tráfico y absorber la mayor cantidad de clientes posible. · `C +25 · R -10 · B -20` |
| Imprevisto (global) | `imp_inspeccion_sorpresa` | **Inspección Impositiva y Laboral Sorpresiva** | Inspectores del organismo regulador se presentan en tus oficinas para una auditoría sorpresa de encuadre laboral, contratos y facturación. | 12 | — | — | — | — | — | **O1** Acompañar con asesoría contable profesional y presentar libros limpios. · `C -10 · R +15 · B +5`<br>**O2** Solicitar prórroga administrativa para emprolijar inconsistencias con asesor legal. · `C -5 · R -10 · B -15` |
| Rescate (global) | `rescate_capital` | **Sin un peso: la última oportunidad** | La caja llegó a cero. No hay con qué pagar sueldos ni proveedores y la empresa está a un paso de cerrar. Todavía hay una salida, pero solo una, y no sale gratis. | 10 | — | — | — | `deuda_riesgosa` (O2) | — | **O1** Vender equipos y pedirle un adelanto a tus mejores clientes para pagar lo urgente. · `C +30 · R -5 · B 0`<br>**O2** Aceptar un préstamo de emergencia, caro pero rápido. · `C +35 · R 0 · B -5` · agrega `deuda_riesgosa` |
| Rescate (global) | `rescate_bienestar` | **El equipo no da más: la última oportunidad** | El cansancio llegó al límite. Hay gente que renuncia, errores todos los días y un clima que ya no se aguanta. Todavía podés darlo vuelta, pero solo esta vez. | 10 | — | — | — | `equity_diluido` (O2) | — | **O1** Frenar una semana entera y devolverle al equipo el descanso que le debías. · `C -5 · R -5 · B +30`<br>**O2** Ofrecerles una parte de la empresa a las personas clave para que se queden. · `C -5 · R 0 · B +30` · agrega `equity_diluido` |
| Rescate (global) | `rescate_reputacion` | **Tu nombre en el piso: la última oportunidad** | Nadie confía en tu empresa. Los clientes se van, los proveedores piden pago adelantado y tu nombre circula en malos comentarios. Todavía hay una forma de remontar, pero solo una. | 10 | — | — | — | `socio_conflictivo` (O2) | — | **O1** Pedir disculpas públicas, devolver el dinero y rehacer lo que falló. · `C -5 · R +30 · B 0`<br>**O2** Aliarte con un socio conocido que ponga su nombre junto al tuyo. · `C 0 · R +25 · B -5` · agrega `socio_conflictivo` |

## Sorpresas (la tendencia que a veces falla)

Opciones de fase 3 y 4 con un desenlace alternativo (`surprise`) que contradice su tendencia. Las reglas están en `docs/EVENTOS.md`, sección 8. **17 sorpresas por rubro** en 9 eventos (la versión por rubro de `f3_caida_servicio` tiene las mismas; la tabla lista el original) (6 mejores que lo esperado, 11 peores); las opciones con minijuego no tienen.

| Evento | Opción | Efectos normales | Efectos con sorpresa | Qué contradice |
|---|---|---|---|---|
| `f3_shock_externo` | O1 | `C +10 · R -30 · B -5` | `C -5 · R -30 · B -5` | Capital ↑ → baja |
| `f3_shock_externo` | O2 | `C -25 · R +25 · B -10` | `C -25 · R -5 · B -10` | Reputación ↑ → baja |
| `f3_apuesta_crecimiento` | O1 | `C -20 · R +15 · B 0` | `C +10 · R +15 · B 0` | Capital ↓ → sube |
| `f3_apuesta_crecimiento` | O2 | `C +5 · R +5 · B +5` | `C -5 · R +5 · B +5` | Capital ↑ → baja |
| `f3_caida_servicio` | O1 | `C -10 · R +15 · B 0` | `C +5 · R +15 · B 0` | Capital ↓ → sube |
| `f3_caida_servicio` | O2 | `C +15 · R -25 · B -15` | `C -10 · R -25 · B -15` | Capital ↑ → baja |
| `f4_competidor_gigante` | O1 | `C -30 · R 0 · B -20` | `C -30 · R +10 · B -20` | Reputación → → sube |
| `f4_competidor_gigante` | O2 | `C -10 · R +25 · B +5` | `C +10 · R +25 · B +5` | Capital ↓ → sube |
| `f4_intento_compra_hostil` | O2 | `C -35 · R -15 · B -30` | `C -35 · R +10 · B -30` | Reputación ↓ → sube |
| `f4_legado_sostenible` | O1 | `C +20 · R +15 · B +30` | `C +20 · R -5 · B +30` | Reputación ↑ → baja |
| `f4_legado_sostenible` | O2 | `C -25 · R +30 · B -15` | `C -25 · R -5 · B -15` | Reputación ↑ → baja |
| `f4_sucesion_operativa` | O1 | `C -15 · R +10 · B +20` | `C -15 · R +10 · B -10` | Bienestar ↑ → baja |
| `f4_sucesion_operativa` | O2 | `C +10 · R -5 · B -20` | `C -10 · R -5 · B -20` | Capital ↑ → baja |
| `f4_propuesta_franquicia` | O1 | `C +20 · R -10 · B -5` | `C -5 · R -10 · B -5` | Capital ↑ → baja |
| `f4_propuesta_franquicia` | O2 | `C -10 · R +15 · B +5` | `C -10 · R +15 · B -10` | Bienestar ↑ → baja |
| `f4_alianza_estrategica` | O1 | `C +15 · R +10 · B -10` | `C -10 · R +10 · B -10` | Capital ↑ → baja |
| `f4_alianza_estrategica` | O2 | `C -10 · R +5 · B +5` | `C +10 · R +5 · B +5` | Capital ↓ → sube |

Sin sorpresa: `f3_ronda_inversion` y `f3_crisis_burnout` (minijuegos), `f3_disputa_socios`, `f4_auditoria_afip` y la opción de vender en `f4_intento_compra_hostil` (O1), además de las crisis y los imprevistos.

## Tags

Los tags son estado persistente de la partida. Los **modifiers** de todos los tags activos se suman al resolver cada decisión (una vez por año), después de aplicar los `effects` de la opción y antes de evaluar derrota.

| Tag | Nombre | Grupo | Modificadores pasivos | Origen en setup | Lo agrega | Lo quita | Lo requiere | Lo prohíbe | Estado |
|---|---|---:|---|---|---|---|---|---|---|
| `cultura_lean` | Cultura Lean | Fase 1 | C +1 · R -1 | — | f1_mvp_calidad* (O1) | — | — | — | Solo pasivo |
| `obsesion_calidad` | Obsesión por la Calidad | Fase 1 | C -2 · R +1 · B -1 | — | f1_mvp_calidad* (O2) | — | — | — | Solo pasivo |
| `socio_alineado` | Socio Alineado | Fase 1 | R +1 · B +1 | — | f1_primer_socio (O1) | — | — | — | Solo pasivo |
| `socio_conflictivo` | Socio Conflictivo | Fase 1 | — | — | f1_primer_socio (O2)<br>rescate_reputacion (O2) | f3_disputa_socios (O1) | f3_disputa_socios | — | Gating |
| `equity_diluido` | Equity Diluido | Fase 1 | — | Financiamiento Socio Ángel | f1_primer_socio (O2)<br>f3_ronda_inversion (O1)<br>rescate_bienestar (O2) | f3_disputa_socios (O1) | f4_intento_compra_hostil | — | Gating |
| `cliente_dependencia` | Dependencia de Cliente | Fase 1 | — | — | f1_primer_cliente_grande (O1) | — | f2_crisis_cobro | — | Gating |
| `clientes_diversificados` | Clientes Diversificados | Fase 1 | C +1 · R +1 | — | f1_primer_cliente_grande (O2)<br>f3_apuesta_crecimiento (O2) | — | — | — | Solo pasivo |
| `calidad_producto` | Calidad de Producto | Setup | C -1 · R +2 | Arquetipo Técnico / Especialista | f4_propuesta_franquicia (O2) | — | — | — | Solo pasivo |
| `generacion_ingresos` | Generación de Ingresos | Setup | C +2 | Arquetipo Comercial / Ventas | f3_apuesta_crecimiento (O1) | — | — | — | Solo pasivo |
| `red_contactos` | Red de Contactos | Setup | R +2 | Arquetipo Comercial / Ventas | f4_alianza_estrategica (O1) | — | — | — | Solo pasivo |
| `inversiones` | Inversiones | Setup | C +2 | Arquetipo Inversionista / Ahorrista | — | — | — | — | Huérfano |
| `patrimonio` | Patrimonio | Setup | C +1 · B +1 | Arquetipo Inversionista / Ahorrista | — | — | — | — | Huérfano |
| `deuda_riesgosa` | Deuda Riesgosa | Fase 2 | C -3 · B -1 | Financiamiento Préstamo Bancario | f2_crisis_cobro (O1)<br>rescate_capital (O2) | — | — | — | Solo pasivo |
| `proveedor_dependiente` | Proveedor Dependiente | Fase 2 | C +2 | — | f2_proveedor_critico (O1) | — | — | — | Solo pasivo |
| `proveedores_diversificados` | Proveedores Diversificados | Fase 2 | C -1 · R +1 · B +1 | — | f2_proveedor_critico (O2) | — | — | — | Solo pasivo |
| `equipo_sobrecargado` | Equipo Sobrecargado | Fase 2 | — | — | f2_sobrecarga_equipo (O1)<br>f2_primera_contratacion (O2)<br>f3_caida_servicio* (O2) | f3_crisis_burnout (O2) | f3_crisis_burnout | — | Gating |
| `procesos_solidos` | Procesos Sólidos | Fase 2 | C -1 · R +1 · B +1 | — | f2_sobrecarga_equipo (O2)<br>f2_primera_contratacion (O1)<br>f3_caida_servicio* (O1) | — | — | — | Solo pasivo |
| `inversion_externa` | Inversión Externa | Fase 3 | C +2 · R +1 · B -1 | — | f3_ronda_inversion (O1) | — | — | — | Solo pasivo |
| `autonomia_estrategica` | Autonomía Estratégica | Fase 3 | — | Financiamiento Bootstrapping | f3_ronda_inversion (O2)<br>f4_alianza_estrategica (O2) | — | f4_legado_sostenible | — | Gating |
| `conflicto_legal` | Conflicto Legal | Fase 3 | C -2 · R -2 · B -2 | — | f3_disputa_socios (O2) | — | — | — | Solo pasivo |
| `salida_exitosa_venta` | Salida Exitosa por Venta | Fase 4 | C +4 · R +1 · B +2 | — | f4_intento_compra_hostil (O1) | — | — | — | Solo pasivo |
| `lifestyle_business` | Lifestyle Business | Fase 4 | C +1 · R +1 · B +2 | — | f4_legado_sostenible (O1)<br>f4_sucesion_operativa (O1) | — | — | — | Solo pasivo |
| `expansion_global` | Expansión Global | Fase 4 | C -2 · R +2 · B -1 | — | f4_legado_sostenible (O2)<br>f4_propuesta_franquicia (O1) | — | — | — | Solo pasivo |

### Lectura de la tabla de tags

- Un `*` junto a un evento significa que el tag también lo agrega, requiere o quita su versión por rubro (por ejemplo `f1_mvp_calidad*` incluye `f1_mvp_calidad_comercio`).
- **Grupo**: bloque de `src/data/tags.ts` al que pertenece el tag; `Setup` indica que nace desde arquetipo o financiamiento.
- **Modificadores pasivos**: `C` = Caja/Capital, `R` = Reputación, `B` = Bienestar. Se aplican en cada decisión mientras el tag esté activo.
- **Origen en setup**: arquetipo o financiamiento que otorga el tag desde el año 1.
- **Lo agrega / quita / requiere / prohíbe**: eventos que interactúan con el tag. En `Lo agrega` y `Lo quita` se indica la opción exacta.
- **Estado**:
  - `Gating`: el tag se usa para habilitar un evento o se elimina desde una opción.
  - `Solo pasivo`: solo aporta modifiers; ningún evento lo exige ni lo elimina.
  - `Huérfano`: ningún evento lo agrega, quita, requiere ni prohíbe.

### Tags que otorga el setup

- **Técnico / Especialista** (`a1_tecnico`): `calidad_producto`
- **Comercial / Ventas** (`a2_comercial`): `generacion_ingresos`, `red_contactos`
- **Inversionista / Ahorrista** (`a3_inversionista`): `inversiones`, `patrimonio`
- **Bootstrapping** (`f1_bootstrap`): `autonomia_estrategica`
- **Préstamo Bancario** (`f2_prestamo_bancario`): `deuda_riesgosa`
- **Socio Ángel** (`f3_socio_angel`): `equity_diluido`

### Notas

- Los tags **huérfanos** son `inversiones` y `patrimonio` (arquetipo Inversionista): no los usa ningún evento, solo aportan modifiers pasivos.
- Los tags **puramente de estado** (sin modifiers) son `socio_conflictivo`, `equity_diluido`, `cliente_dependencia`, `equipo_sobrecargado` y `autonomia_estrategica`.
- Los tags que se **eliminan** desde alguna opción son `socio_conflictivo`, `equity_diluido` y `equipo_sobrecargado`.
- Para agregar un tag nuevo hay que registrarlo primero en `src/data/tags.ts`; el tipo `Tag` se deriva de ese objeto.
