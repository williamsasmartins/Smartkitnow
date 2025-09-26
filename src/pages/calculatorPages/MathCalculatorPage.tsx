import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import AreaCalculator from '@/components/calculators/math/AreaCalculator';
import FractionCalculator from '@/components/calculators/math/FractionCalculator';
import GPACalculator from '@/components/calculators/math/GPACalculator';
import PercentageCalculator from '@/components/calculators/math/PercentageCalculator';
import SlopeCalculator from '@/components/calculators/math/SlopeCalculator';
import NotFound from '../NotFound';  // Corrigido para '../NotFound'

const calculatorComponents: Record<string, React.ComponentType> = {
  'area': AreaCalculator,
  'fraction': FractionCalculator,
  'gpa': GPACalculator,
  'percentage': PercentageCalculator,
  'slope': SlopeCalculator,
  // Adicione mais se houver outras calcs em math/
};

export default function MathCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}