# El Emprendedor 🚀

Juego de estrategia y toma de decisiones para fundadores de startups y negocios. El jugador asume el rol de un emprendedor a lo largo de 15 turnos divididos en 4 fases de maduración empresarial:
1. **Génesis & Validación** (Turnos 1 a 3)
2. **Tracción & Caja** (Turnos 4 a 6)
3. **Escala & Crisis** (Turnos 7 a 10)
4. **Consolidación & Salida** (Turnos 11 a 15)

---

## 🎮 Mecánica de Juego

- **Métricas Vitales (0-100)**:
  - 💵 **Capital**: Liquidez y supervivencia financiera. Llegar a 0 provoca quiebra inmediata.
  - 🏆 **Reputación**: Confianza del mercado, inversores y clientes. Llegar a 0 destruye la viabilidad comercial.
  - ❤️ **Bienestar**: Salud mental, energía personal y clima de equipo. Llegar a 0 causa colapso por burnout.
- **Micro-Píldoras Didácticas**: Cada alternativa enseña un principio de negocio real (Lean Startup, CAC, LTV, Vesting, Pricing Power, etc.).
- **Tags y Modificadores Pasivos**: Decisiones clave fijan tags en la cultura de la empresa (ej. `deuda_riesgosa`, `cultura_lean`, `socio_conflictivo`), que disparan consecuencias diferidas (`scheduledEvent`) o cobran costos pasivos cada turno.
- **Epílogos Múltiples (GDD §9)**: Desenlaces narrativos según las decisiones y tags acumulados (*El Unicornio Adquirido*, *Lifestyle Business*, *La Expansión Global*, *El Fundador Desplazado*, etc.).
- **CTA al Simulador Comercial (GDD §10)**: Puente educativo hacia el simulador de mercado multijugador.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript (Strict Mode) + Vite 8
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/vite`) + Lucide Icons
- **Motor del Juego**: Funciones puras desacopladas en `src/game/engine.ts` con RNG determinista (Mulberry32).
- **Testing & Validación**: Vitest con suites de integridad estática de contenido y simulación Monte Carlo (6.000+ partidas por corrida).

---

## 🚀 Comandos

```bash
pnpm dev          # Iniciar servidor de desarrollo local
pnpm test         # Ejecutar suite completa (validador + motor + simulación Monte Carlo)
pnpm test:watch   # Modo observador durante la autoría de eventos
pnpm build        # Compilación de TypeScript estricto y bundle de producción
pnpm lint         # Análisis estático con ESLint
```

### Reproducibilidad de Partidas (`?seed=`)
Para reproducir una partida idéntica (útil para balance o debugging), se puede especificar una semilla en la URL:
```
http://localhost:5173/?seed=123456
```

---

## ✍️ Autoría de Nuevos Eventos

Para agregar o modificar eventos, consultar el manual detallado en:
📖 [Manual de Autoría de Eventos](docs/EVENTOS.md)
y la plantilla en `src/data/events/_template.ts`.
