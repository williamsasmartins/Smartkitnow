import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry';
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout';

const FinancialCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculator not found. Check the URL or add the entry to the registry.</div>;
  }

  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  const CalculatorComponent = lazy(() => /* @vite-ignore */ import(`@/components/calculators/financial/${componentName}.tsx`));

  return (
    <CalculatorLayout
      title={`${calcInfo.name} Calculator | Smart Kit Now`}
      description={`Use our ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}.`}
      keywords={`${calcInfo.tags.join(', ')}, financial calculators, online calculator`}
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

export default FinancialCalculatorPage;
