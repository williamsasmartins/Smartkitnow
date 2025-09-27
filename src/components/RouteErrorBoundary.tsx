import React from "react";

type Props = React.PropsWithChildren;

type State = {
  hasError: boolean;
  message?: string;
};

export class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown) {
    // Logue como preferir (Sentry, console, etc.)
    console.error("Route error:", err);
  }

  handleBackHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Algo deu errado</h1>
            <p className="text-muted-foreground mb-4">
              Não conseguimos carregar esta página agora.
            </p>
            <button
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
              onClick={this.handleBackHome}
            >
              Voltar para a Home
            </button>
            {process.env.NODE_ENV !== "production" && this.state.message ? (
              <pre className="mt-4 text-left text-xs opacity-70 overflow-auto">
                {this.state.message}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
