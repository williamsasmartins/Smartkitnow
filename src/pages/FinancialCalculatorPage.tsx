import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import { AdjustedGrossIncomeCalculator } from '@/components/calculators/financial/AdjustedGrossIncomeCalculator';
import { AnnualIncomeCalculator } from '@/components/calculators/financial/AnnualIncomeCalculator';
import { BiweeklyPayCalculator } from '@/components/calculators/financial/BiweeklyPayCalculator';
import { DebtToIncomeCalculator } from '@/components/calculators/financial/DebtToIncomeCalculator';
import { DiscountCalculator } from '@/components/calculators/financial/DiscountCalculator';
import NotFound from './NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'adjusted-gross-income': AdjustedGrossIncomeCalculator,
  'annual-income': AnnualIncomeCalculator,
  'biweekly-pay': BiweeklyPayCalculator,
  'debt-to-income': DebtToIncomeCalculator,
  'discount': DiscountCalculator,
};

export default function FinancialCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}