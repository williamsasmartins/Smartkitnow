import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry'; // Named import
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout'; // Named import

const FinancialCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculadora não encontrada. Tente outra na categoria de financial. Verifique se o URL está correto ou adicione a entrada no registry.</div>;
  }

  // Derive nome do componente dinamicamente (ex.: 'mortgage' -> 'MortgageCalculator')
  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  // Use alias '@/' para path confiável no Vite (corrige erro de import)
  const CalculatorComponent = lazy(() => import(`@/components/calculators/financial/${componentName}`));

  const pageTitle = `${calcInfo.name} Calculator | Smart Kit Now`;
  const pageDescription = `Use our professional ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}. Includes step-by-step instructions, practical examples, and trusted references for accurate financial planning.`;
  const pageKeywords = `${calcInfo.tags.join(', ')}, financial calculators, money tools, online calculator, smart kit now`;

  return (
    <CalculatorLayout
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
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

export default FinancialCalculatorPage;