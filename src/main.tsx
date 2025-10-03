// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/theme.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { injectSpeedInsights } from '@vercel/speed-insights'
import * as Sentry from '@sentry/react'

// Inicializa o Sentry somente se o DSN existir nas variáveis de ambiente
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN?.trim()
if (SENTRY_DSN && SENTRY_DSN !== "REPLACE_WITH_YOUR_SENTRY_DSN") {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_RELEASE,
  })
}

injectSpeedInsights()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Provider de tema no topo do app */}
    <ThemeProvider attribute="class" defaultTheme="system">
      <BrowserRouter basename="/">
        {/* ErrorBoundary captura erros de runtime e reporta ao Sentry */}
        <Sentry.ErrorBoundary fallback={<div>Ocorreu um erro inesperado.</div>}>
          <App />
        </Sentry.ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)


