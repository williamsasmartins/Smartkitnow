import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/data/calculatorRegistry";
import { useParams, useNavigate } from "react-router-dom";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { CountdownCalculator } from "@/components/calculators/CountdownCalculator";
import { TimeConverter } from "@/components/calculators/TimeConverter";
import { DateCalculator } from "@/components/calculators/DateCalculator";
import { DurationCalculator } from "@/components/calculators/DurationCalculator";
import { computeBackPath } from "@/lib/navigation";

export default function TimeCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  // Compute dynamic back path using centralized utility
  const backPath = computeBackPath(calculator, "time");

  const getCalculatorComponent = () => {
    switch (calculator) {
      case "age":
        return <AgeCalculator />;
      case "countdown-timer":
        return <CountdownCalculator />;
      case "days-until":
        return <CountdownCalculator />;
      case "christmas-countdown":
        return <CountdownCalculator />;
      case "24-to-12-hour":
        return <TimeConverter />;
      case "military-time":
        return <TimeConverter />;
      case "time-to-decimal":
        return <TimeConverter />;
      case "date-calculator":
        return <DateCalculator />;
      case "day-counter":
        return <DateCalculator />;
      case "time-duration":
        return <DurationCalculator />;
      case "hours-calculator":
        return <DurationCalculator />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Calculator Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The {calculator?.replace(/-/g, ' ')} calculator is under development.
            </p>
            {/* Removed button */}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Calculator Component */}
        {getCalculatorComponent()}
      </main>

    </div>
  );
}