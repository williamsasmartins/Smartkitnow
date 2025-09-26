import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry'; // Named import
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout'; // Named import

const ElectricalCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculadora não encontrada. Tente outra na categoria de electrical. Verifique se o URL está correto ou adicione a entrada no registry.</div>; // Fallback informativo
  }

  // Derive nome do componente dinamicamente (ex.: 'ohms-law' -> 'OhmsLawCalculator')
  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  const CalculatorComponent = lazy(() => import(`@/components/calculators/electrical/${componentName}`)); // Path com alias @/ para Vite

  // Meta tags dinâmicas para SEO (baseadas no registry)
  const pageTitle = `${calcInfo.name} Calculator | Smart Kit Now`;
  const pageDescription = `Use our professional ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}. Includes step-by-step instructions, practical examples, and trusted references for accurate electrical calculations.`;
  const pageKeywords = `${calcInfo.tags.join(', ')}, electrical calculators, engineering tools, online calculator, smart kit now`;

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
      {/* Seções opcionais para AdSense/SEO: instructions, examples, affiliates */}
      {/* Exemplo: <section className="mt-8"><h2>How to Use</h2><p>Enter voltage and resistance to calculate current.</p></section> */}
      {/* <section className="mt-8"><h2>Practical Examples</h2><ul><li>Example: 12V / 4Ω = 3A current.</li></ul></section> */}
      {/* Affiliate: <a href="https://amazon.com/electrical-tools?tag=youraffid" target="_blank">Buy Electrical Tools on Amazon</a> */}
    </CalculatorLayout>
  );
};

export default ElectricalCalculatorPage;