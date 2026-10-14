# Taste
- Communicates in Spanish (Argentine/Rioplatense register, informal "vos" imperatives like "corregime"/"decime"). Reply in Spanish. Confidence: 0.95
- When asking for a fix, wants the root cause explained afterward ("decime por qué estaban ahí"), not just the applied fix — expects a diagnosis of why the problem existed. Confidence: 0.8
- Prefers pnpm as the package manager (uses `pnpm exec`, `pnpm build`). Confidence: 0.7
- Works in Vite + React + TypeScript projects with Tailwind CSS. Confidence: 0.65
- Asks for critical, opinion-driven analysis ("dame tu visión", "qué opinás") on architecture and scalability — wants honest assessment of what's wrong and what to improve, not just execution. Confidence: 0.6
- Works directly on the `main` branch ("voy a trabajar siempre sobre main"); treats variant default branches like `master` as mistakes to clean up rather than keep. Confidence: 0.85
- Works from saved plans (Command Code plan mode, stored under `~/.commandcode/plans`) with labeled steps (e.g. A1/A2/A3) and asks the agent to verify what has actually been implemented against the plan, step by step. Confidence: 0.6
- Values a clean, linear git history: authorized deleting the stray `master` branch (local + remote) and squashing/rewriting `main` with `--force-with-lease` to untangle messy merges — as long as the agent verifies content is preserved and explains what was destroyed/preserved. Confidence: 0.6
- Requests self-contained "context handoff" documents describing the current state of the code, written so another LLM (not just themselves) can pick up the project — wants an exhaustive, paste-ready summary covering stack, architecture, files, domain model, current WIP/broken state, and git history. Confidence: 0.75
