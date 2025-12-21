import React from 'react'

type State = { hasError: boolean; error?: unknown }

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('App crashed:', error, info)

    // Handle chunk load failures (version mismatch after deployment)
    const msg = String(error || '');
    const isChunkError = 
      msg.includes("Failed to fetch dynamically imported module") || 
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module");

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('skn-chunk-reload');
      const now = Date.now();
      
      // Reload if we haven't reloaded recently (e.g. within 10 seconds)
      if (!lastReload || (now - parseInt(lastReload, 10) > 10000)) {
          sessionStorage.setItem('skn-chunk-reload', String(now));
          window.location.reload();
          return;
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const msg =
        (this.state.error as any)?.message ??
        (typeof this.state.error === 'string' ? this.state.error : 'An unexpected error occurred.')

      return (
        <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: 16 }}>
            We hit an error while rendering this page.
          </p>
          <pre
            style={{
              background: '#111',
              color: '#0f0',
              padding: 12,
              borderRadius: 8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {String(msg)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
