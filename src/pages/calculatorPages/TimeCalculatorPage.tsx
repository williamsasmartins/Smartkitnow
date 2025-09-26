import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import { AgeCalculator } from '@/components/calculators/time/AgeCalculator';
import { CountdownCalculator } from '@/components/calculators/time/CountdownCalculator';
import { DateCalculator } from '@/components/calculators/time/DateCalculator';
import { DurationCalculator } from '@/components/calculators/time/DurationCalculator';
import { TimeConverter } from '@/components/calculators/time/TimeConverter';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'age': AgeCalculator,
  'countdown': CountdownCalculator,
  'date': DateCalculator,
  'duration': DurationCalculator,
  'time-converter': TimeConverter,
};

export default function TimeCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}