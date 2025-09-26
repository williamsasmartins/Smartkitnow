import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry';
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout';

const HealthCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculadora não encontrada. Tente outra na categoria de health & fitness. Verifique se o URL está correto ou adicione a entrada no registry.</div>; // Melhorado: Mais informativo
  }

  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  const CalculatorComponent = lazy(() => import(`../../components/calculators/health/${componentName}.tsx`));

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
      sources={calcInfo.sources || []} // Usa sources do registry para referências no footer
    >
      <Suspense fallback={<div className="text-center py-10">Carregando calculadora...</div>}>
        <CalculatorComponent />
      </Suspense>
    </CalculatorLayout>
  );
};

export default HealthCalculatorPage;