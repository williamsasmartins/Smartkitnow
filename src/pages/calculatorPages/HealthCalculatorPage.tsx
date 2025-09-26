import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import { BMICalculator } from '@/components/calculators/health/BMICalculator';
import { BMRCalculator } from '@/components/calculators/health/BMRCalculator';
import { BodyFatCalculator } from '@/components/calculators/health/BodyFatCalculator';
import { CalorieCalculator } from '@/components/calculators/health/CalorieCalculator';
import { CaloriesToKilogramsCalculator } from '@/components/calculators/health/CaloriesToKilogramsCalculator';
import IMCCalculator from '@/components/calculators/health/IMCCalculator';  // Corrigido: default import (sem { })
import { TDEECalculator } from '@/components/calculators/health/TDEECalculator';
import { AdjustedBodyWeightCalculator } from '@/components/calculators/health/AdjustedBodyWeightCalculator';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'bmi': BMICalculator,
  'bmr': BMRCalculator,
  'body-fat': BodyFatCalculator,
  'calorie': CalorieCalculator,
  'calories-to-kilograms': CaloriesToKilogramsCalculator,
  'imc': IMCCalculator,
  'tdee': TDEECalculator,
  'adjusted-body-weight': AdjustedBodyWeightCalculator,
};

export default function HealthCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}