import { Component, type ErrorInfo, type ReactNode } from "react";
import CalculatorErrorState from "@/components/common/CalculatorErrorState";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  calculatorName?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { calculatorName, onError } = this.props;
    console.error(
      `[ErrorBoundary]${calculatorName ? ` ${calculatorName}` : ""}:`,
      error,
      info.componentStack,
    );
    onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback, calculatorName, showDetails } = this.props;

    if (!error) return children;

    if (typeof fallback === "function") return fallback(error, this.reset);
    if (fallback !== undefined) return fallback;

    return (
      <CalculatorErrorState
        title={
          calculatorName
            ? `${calculatorName} failed to load`
            : "This calculator failed to load"
        }
        message="An unexpected error occurred while rendering this calculator. You can try again, or refresh the page if the issue persists."
        details={showDetails ? `${error.name}: ${error.message}` : undefined}
        onRetry={this.reset}
        retryLabel="Reload calculator"
      />
    );
  }
}
