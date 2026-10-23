import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Laboratorio de minijuegos, en /dev/minijuegos: en `pnpm dev`, o en un build con VITE_MINIGAME_LAB=true (p. ej. Vercel).
const labEnabled = import.meta.env.DEV || import.meta.env.VITE_MINIGAME_LAB === 'true';
const MinigameLab = labEnabled && window.location.pathname === '/dev/minijuegos'
  ? lazy(() => import('./components/dev/MinigameLab'))
  : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {MinigameLab ? (
      <Suspense fallback={null}>
        <MinigameLab />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
