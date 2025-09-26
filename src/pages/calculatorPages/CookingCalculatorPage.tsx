import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import CakeCalculator from '@/components/calculators/cooking/CakeCalculator';
import CookingConversionCalculator from '@/components/calculators/cooking/CookingConversionCalculator';
import OvenTemperatureConverter from '@/components/calculators/cooking/OvenTemperatureConverter';
import PizzaCalculator from '@/components/calculators/cooking/PizzaCalculator';
import { RecipeScalingCalculator } from '@/components/calculators/cooking/RecipeScalingCalculator';
import { TurkeySizeCalculator } from '@/components/calculators/cooking/TurkeyCalculators';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'cake': CakeCalculator,
  'cooking-conversion': CookingConversionCalculator,
  'oven-temperature-converter': OvenTemperatureConverter,
  'pizza': PizzaCalculator,
  'recipe-scaling': RecipeScalingCalculator,
  'turkey': TurkeySizeCalculator,
};

export default function CookingCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}