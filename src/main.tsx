// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/theme.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { HelmetProvider } from 'react-helmet-async'
import { initWebVitals } from '@/lib/webvitals'

// Inicializa o Sentry somente se explicitamente habilitado e com DSN válido fora de localhost
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN?.trim()
const ENABLE_SENTRY = (import.meta.env.VITE_ENABLE_SENTRY?.trim() === 'true')
const IS_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.endsWith('.local')
const IS_SMARTKIT_DOMAIN = window.location.hostname === 'smartkitnow.com' || window.location.hostname === 'www.smartkitnow.com'
if (ENABLE_SENTRY && SENTRY_DSN && SENTRY_DSN !== "REPLACE_WITH_YOUR_SENTRY_DSN" && !IS_LOCAL && !IS_SMARTKIT_DOMAIN) {
  // Import dinâmico para evitar carregar Sentry em localhost
  import('@sentry/react')
    .then((Sentry) => {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.2,
        environment: import.meta.env.MODE,
        release: import.meta.env.VITE_RELEASE,
      })
    })
    .catch(() => {
      // Silencia qualquer erro de inicialização em ambientes não críticos
    })
}

// Injeta Speed Insights somente se explicitamente habilitado e fora de localhost
const ENABLE_SPEED_INSIGHTS = (import.meta.env.VITE_ENABLE_SPEED_INSIGHTS?.trim() === 'true')
if (ENABLE_SPEED_INSIGHTS && !IS_LOCAL && !IS_SMARTKIT_DOMAIN) {
  // Dynamic import to prevent bundling when disabled
  import('@vercel/speed-insights')
    .then(mod => {
      try { mod.injectSpeedInsights?.() } catch {}
    })
    .catch(() => {})
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Provider de tema no topo do app */}
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HelmetProvider>
        <BrowserRouter basename="/">
          {/* Renderiza o App diretamente (sem Sentry.ErrorBoundary em localhost) */}
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
)

// Inicializa Web Vitals unificado (CLS, LCP, INP) em produção
// Inicializa Web Vitals somente em produção e fora de localhost
if (import.meta.env.PROD && !IS_LOCAL) {
  initWebVitals({
    debug: false,
    beaconUrl: "/metrics/web-vitals",
    onFinal: (m) => {
      console.log("[WebVitals]", m)
      // @ts-ignore
      window.gtag?.("event", "web_vital", {
        event_category: "Web Vitals",
        event_label: "CLS",
        value: Math.round((m.CLS ?? 0) * 1000),
        non_interaction: true,
      })
      // @ts-ignore
      window.gtag?.("event", "web_vital", {
        event_category: "Web Vitals",
        event_label: "LCP",
        value: Math.round((m.LCP ?? 0)),
        non_interaction: true,
      })
      // @ts-ignore
      window.gtag?.("event", "web_vital", {
        event_category: "Web Vitals",
        event_label: "INP",
        value: Math.round((m.INP ?? 0)),
        non_interaction: true,
      })
    },
  })
}


