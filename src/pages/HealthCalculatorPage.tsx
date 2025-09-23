import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import health calculator components
import { BMICalculator } from "@/components/calculators/BMICalculator";
import { BMRCalculator } from "@/components/calculators/BMRCalculator";
import { CalorieCalculator } from "@/components/calculators/CalorieCalculator";
import { BodyFatCalculator } from "@/components/calculators/BodyFatCalculator";
import { TDEECalculator } from "@/components/calculators/TDEECalculator";
import { CaloriesToKilogramsCalculator } from "@/components/calculators/CaloriesToKilogramsCalculator";

const HealthCalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const calculator = location.state?.calculator;
  const subCategory = location.state?.subCategory;

  if (!calculator) {
    navigate('/health');
    return null;
  }

  const renderCalculator = () => {
    const calculatorKey = calculator.key;
    
    // Map calculator keys to components
    switch (calculatorKey) {
      case 'bmi':
      case 'child-teen-bmi':
        return <BMICalculator />;
      case 'bmr':
      case 'harris-benedict':
      case 'mifflin-st-jeor':
        return <BMRCalculator />;
      case 'calories-burned':
      case 'calorie-intake':
      case 'maintenance-calorie':
        return <CalorieCalculator />;
      case 'body-fat':
      case 'army-body-fat':
      case 'navy-body-fat':
        return <BodyFatCalculator />;
      case 'tdee':
        return <TDEECalculator />;
        case 'calories-to-kg':
        return <CaloriesToKilogramsCalculator />;
      default:
        return (
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">{calculator.name}</h3>
            <p className="text-muted-foreground mb-6">
              This calculator is coming soon. We're working on implementing all health calculators.
            </p>
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                Calculator Key: <code className="bg-muted px-2 py-1 rounded">{calculatorKey}</code>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Category: {subCategory}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {calculator.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                Category: {subCategory}
              </p>
            </div>
          </div>
          
          {renderCalculator()}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HealthCalculatorPage;