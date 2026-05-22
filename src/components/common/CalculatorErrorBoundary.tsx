import React, { Component, type ErrorInfo, type ReactNode } from "react";
import CalculatorErrorState from "./CalculatorErrorState";

export interface CalculatorErrorBoundaryProps {
  children: ReactNode;
  calculatorName?: string;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export default class CalculatorErrorBoundary extends Component<
  CalculatorErrorBoundaryProps,
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { calculatorName, onError } = this.props;
    const label = calculatorName ? `[${calculatorName}]` : "[Calculator]";
    console.error(`${label} render error:`, error, info.componentStack);
    if (onError) onError(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback, calculatorName } = this.props;

    if (!error) return children;

    if (fallback) return fallback(error, this.reset);

    const isDev =
      typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

    return (
      <CalculatorErrorState
        title={
          calculatorName
            ? `${calculatorName} couldn't render`
            : "Calculator couldn't render"
        }
        message="An unexpected error occurred while displaying this calculator. Try again, or refresh the page."
        details={isDev ? `${error.name}: ${error.message}` : undefined}
        onRetry={this.reset}
      />
    );
  }
}
