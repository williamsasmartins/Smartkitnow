import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry';
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout';

const HealthCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculator not found. Try another in the health category. Check if the URL is correct or add the entry to the registry.</div>; // Informative fallback
  }

  // Derive component name dynamically with logic for upper acronyms (e.g., 'bmi' -> 'BMICalculator', 'calories-to-kilograms' -> 'CaloriesToKilogramsCalculator')
  const words = calculator.split('-');
  const componentName = words
    .map((word) => {
      if (word.length <= 4 && word === word.toLowerCase()) {
        return word.toUpperCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    })
    .join('') + 'Calculator';

  // Import with alias '@/' and .js (fixes Vite warning for dynamic imports)
  const CalculatorComponent = lazy(() => import(`@/components/calculators/health/${componentName}.js`));

  const pageTitle = `${calcInfo.name} Calculator | Smart Kit Now`;
  const pageDescription = `Use our professional ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}. Includes step-by-step instructions, practical examples, and trusted references for accurate results.`;
  const pageKeywords = `${calcInfo.tags.join(', ')}, health calculators, fitness tools, online calculator, smart kit now`;

  return (
    <CalculatorLayout
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      calculatorName={calcInfo.name}
      formula={calcInfo.formula}
      sources={calcInfo.sources || []}
    >
      <Suspense fallback={<div className="text-center py-10">Loading calculator...</div>}>
        <CalculatorComponent />
      </Suspense>
    </CalculatorLayout>
  );
};

export default HealthCalculatorPage;