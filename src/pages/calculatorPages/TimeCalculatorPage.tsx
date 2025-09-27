import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry';
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout';

const TimeCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculadora não encontrada. Verifique o URL ou adicione a entrada no registry.</div>;
  }

  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  const CalculatorComponent = lazy(() => /* @vite-ignore */ import(`@/components/calculators/time/${componentName}.js`));

  return (
    <CalculatorLayout
      title={`${calcInfo.name} Calculator | Smart Kit Now`}
      description={`Use our ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}. Accurate time and date calculations.`}
      keywords={`${calcInfo.tags.join(', ')}, time calculators, date tools, online calculator`}
      calculatorName={calcInfo.name}
      formula={calcInfo.formula}
      sources={calcInfo.sources || []}
    >
      <Suspense fallback={<div className="text-center py-10">Carregando calculadora...</div>}>
        <CalculatorComponent />
      </Suspense>
    </CalculatorLayout>
  );
};

export default TimeCalculatorPage;
