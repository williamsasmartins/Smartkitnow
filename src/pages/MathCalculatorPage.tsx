import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { GPACalculator } from "@/components/calculators/GPACalculator";
import { FractionCalculator } from "@/components/calculators/FractionCalculator";
import { AreaCalculator } from "@/components/calculators/AreaCalculator";
import { SlopeCalculator } from "@/components/calculators/SlopeCalculator";

export default function MathCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  const getCalculatorComponent = () => {
    switch (calculator) {
      case "percentage":
        return <PercentageCalculator />;
      case "gpa":
        return <GPACalculator />;
      case "fraction-to-decimal":
        return <FractionCalculator />;
      case "area":
        return <AreaCalculator />;
      case "slope":
        return <SlopeCalculator />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Calculator Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The {calculator?.replace(/-/g, ' ')} calculator is under development.
            </p>
            <Button onClick={() => navigate("/math")}>
              Browse Other Calculators
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/math")}
          className="mb-6 hover:bg-muted/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Math Calculators
        </Button>

        {/* Calculator Component */}
        {getCalculatorComponent()}
      </main>

      <Footer />
    </div>
  );
}