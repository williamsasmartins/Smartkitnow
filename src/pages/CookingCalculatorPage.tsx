import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import CakeCalculator from "@/components/calculators/CakeCalculator";
import CookingConversionCalculator from "@/components/calculators/CookingConversionCalculator";
import OvenTemperatureConverter from "@/components/calculators/OvenTemperatureConverter";
import CookingTimer from "@/components/calculators/CookingTimer";
import { TurkeyCookingTimeCalculator, TurkeySizeCalculator, TurkeyThawingTimeCalculator } from "@/components/calculators/TurkeyCalculators";
import PizzaCalculator from "@/components/calculators/PizzaCalculator";

const CookingCalculatorPage = () => {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();

  const calculatorComponents = {
    'cake': {
      component: CakeCalculator,
      name: 'Cake Calculator',
      description: 'Calculate the perfect cake size and quantity for your event. Our cake calculator helps you determine how many cakes you need based on guest count and portion size.'
    },
    'cooking-conversion': {
      component: CookingConversionCalculator,
      name: 'Cooking Conversion Calculator',
      description: 'Convert cooking and baking measurements between different units. Perfect for recipe conversions and ingredient scaling.'
    },
    'oven-temperature-conversion': {
      component: OvenTemperatureConverter,
      name: 'Oven Temperature Conversion Calculator',
      description: 'Convert oven temperatures between Fahrenheit and Celsius with our comprehensive conversion chart and calculator.'
    },
    'timer': {
      component: CookingTimer,
      name: 'Cooking Timer',
      description: 'Set precise cooking timers for perfect results. Multiple preset options and custom timing for all your cooking needs.'
    },
    'turkey-cooking-time': {
      component: TurkeyCookingTimeCalculator,
      name: 'Turkey Cooking Time Calculator',
      description: 'Calculate the perfect cooking time for your turkey based on weight and cooking method.'
    },
    'turkey-size': {
      component: TurkeySizeCalculator,
      name: 'Turkey Size Calculator',
      description: 'Determine the right turkey size for your gathering based on guest count and desired leftovers.'
    },
    'turkey-thawing-time': {
      component: TurkeyThawingTimeCalculator,
      name: 'Turkey Thawing Time Calculator',
      description: 'Calculate safe thawing times for your turkey using different thawing methods.'
    },
    'pizza': {
      component: PizzaCalculator,
      name: 'Pizza Calculator',
      description: 'Calculate pizza quantities needed for your party and get pizza dough recipes for homemade pizzas.'
    }
  };

  const currentCalculator = calculator ? calculatorComponents[calculator as keyof typeof calculatorComponents] : null;

  const handleGoBack = () => {
    if (subcategory) {
      navigate(`/cooking/${subcategory}`);
    } else {
      navigate('/cooking');
    }
  };

  if (!currentCalculator) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <main className="pt-20">
          <section className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Calculator Not Found</h1>
              <p className="text-muted-foreground mb-8">The calculator you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/cooking")}>
                Back to Cooking Calculators
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const CalculatorComponent = currentCalculator.component;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleGoBack}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {currentCalculator.name}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Cooking & Baking Tools
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <CalculatorComponent />
          </div>
          
          {/* Calculator Footer */}
          <CalculatorFooter
            calculatorName={currentCalculator.name}
            description={currentCalculator.description}
            formula="Calculation varies based on calculator type"
            sources={[
              { title: "USDA Food Data", url: "https://fdc.nal.usda.gov/" },
              { title: "Culinary Institute Standards", url: "https://www.ciachef.edu/" },
              { title: "Food Network Cooking Guidelines", url: "https://www.foodnetwork.com/" },
              { title: "King Arthur Baking Resources", url: "https://www.kingarthurbaking.com/" }
            ]}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookingCalculatorPage;