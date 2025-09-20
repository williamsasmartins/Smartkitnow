import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { MolarMassCalculator } from "@/components/calculators/MolarMassCalculator";
import { MolarityCalculator } from "@/components/calculators/MolarityCalculator";
import { DensityCalculator } from "@/components/calculators/DensityCalculator";
import { ForceCalculator } from "@/components/calculators/ForceCalculator";
import { VelocityCalculator } from "@/components/calculators/VelocityCalculator";

export default function ScienceCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

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
            <Button onClick={() => navigate("/science")}>
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
          onClick={() => navigate("/science")}
          className="mb-6 hover:bg-muted/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Science Calculators
        </Button>

        {/* Calculator Component */}
        {getCalculatorComponent()}
      </main>

      <Footer />
    </div>
  );
}