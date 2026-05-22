import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface CalculatorSkeletonProps {
  rows?: number;
  showResult?: boolean;
  className?: string;
  label?: string;
}

export default function CalculatorSkeleton({
  rows = 4,
  showResult = true,
  className,
  label = "Loading calculator",
}: CalculatorSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={className}
    >
      <span className="sr-only">{label}</span>

      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-24" />
        </div>

        {showResult && (
          <CardContent className="mt-8 space-y-4 p-0">
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
