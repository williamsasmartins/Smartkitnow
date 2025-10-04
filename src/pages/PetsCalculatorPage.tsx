import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/data/calculatorRegistry";
import { computeBackPath } from "@/lib/navigation";
import { useParams, useNavigate } from "react-router-dom";
import { DogAgeCalculator } from "@/components/calculators/DogAgeCalculator";
import { DogCalorieCalculator } from "@/components/calculators/DogCalorieCalculator";
import { CatAgeCalculator } from "@/components/calculators/CatAgeCalculator";
import { AquariumVolumeCalculator } from "@/components/calculators/AquariumVolumeCalculator";
import { AquariumWeightCalculator } from "@/components/calculators/AquariumWeightCalculator";

export default function PetsCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  // Compute dynamic back path using centralized utility
  const backPath = computeBackPath(calculator ?? undefined, "pets");

  const getCalculatorComponent = () => {
    switch (calculator) {
      case "dog-age":
        return <DogAgeCalculator />;
      case "dog-calorie":
        return <DogCalorieCalculator />;
      case "cat-age":
        return <CatAgeCalculator />;
      case "aquarium-volume":
        return <AquariumVolumeCalculator />;
      case "aquarium-weight":
        return <AquariumWeightCalculator />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Calculator Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The {calculator?.replace(/-/g, ' ')} calculator is under development.
            </p>
            <Button onClick={() => navigate(backPath)}>
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
          onClick={() => navigate(backPath)}
          className="mb-6 hover:bg-muted/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pet Calculators
        </Button>

        {/* Calculator Component */}
        {getCalculatorComponent()}
      </main>

      <Footer />
    </div>
  );
}