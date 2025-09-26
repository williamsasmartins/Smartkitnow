import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import OhmsLawCalculator from '@/components/calculators/electrical/OhmsLawCalculator';
import ElectricalConversionCalculator from '@/components/calculators/conversion/ElectricalConversionCalculator';
import WireSizeCalculator from '@/components/calculators/electrical/WireSizeCalculator';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'ohms-law': OhmsLawCalculator,
  'electrical-conversion': ElectricalConversionCalculator,
  'wire-size': WireSizeCalculator,
};

export default function ElectricalCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}