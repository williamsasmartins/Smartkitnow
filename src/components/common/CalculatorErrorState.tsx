import { AlertTriangle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface CalculatorErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function CalculatorErrorState({
  title = "Something went wrong",
  message = "We couldn't complete this calculation. Please check your inputs and try again.",
  details,
  onRetry,
  retryLabel = "Try again",
  className,
}: CalculatorErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      role="alert"
      aria-live="assertive"
      className={className}
    >
      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        {details && (
          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-2 text-xs font-mono text-destructive/90">
            {details}
          </pre>
        )}
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            {retryLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
