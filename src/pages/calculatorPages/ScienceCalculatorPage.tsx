import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import { DensityCalculator } from '@/components/calculators/science/DensityCalculator';
import { ForceCalculator } from '@/components/calculators/science/ForceCalculator';
import { MolarityCalculator } from '@/components/calculators/science/MolarityCalculator';
import { MolarMassCalculator } from '@/components/calculators/science/MolarMassCalculator';
import { VelocityCalculator } from '@/components/calculators/science/VelocityCalculator';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'density': DensityCalculator,
  'force': ForceCalculator,
  'molarity': MolarityCalculator,
  'molar-mass': MolarMassCalculator,
  'velocity': VelocityCalculator,
};

export default function ScienceCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}