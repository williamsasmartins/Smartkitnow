import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/data/calculatorRegistry";
import { useParams, useNavigate } from "react-router-dom";
import { MolarMassCalculator } from "@/components/calculators/MolarMassCalculator";
import { MolarityCalculator } from "@/components/calculators/MolarityCalculator";
import { DensityCalculator } from "@/components/calculators/DensityCalculator";
import { ForceCalculator } from "@/components/calculators/ForceCalculator";
import { VelocityCalculator } from "@/components/calculators/VelocityCalculator";
import { computeBackPath } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export default function ScienceCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  // Compute dynamic back path using centralized utility
  const backPath = computeBackPath(calculator, "science");

  const getCalculatorComponent = () => {
    switch (calculator) {
      case "molar-mass":
        return <MolarMassCalculator />;
      case "molarity":
        return <MolarityCalculator />;
      case "density":
        return <DensityCalculator />;
      case "force":
        return <ForceCalculator />;
      case "velocity":
        return <VelocityCalculator />;
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