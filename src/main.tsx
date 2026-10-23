import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Laboratorio de minijuegos: solo en `pnpm dev`, en /dev/minijuegos. En build no se incluye en la entrada.
const MinigameLab = import.meta.env.DEV && window.location.pathname === '/dev/minijuegos'
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
