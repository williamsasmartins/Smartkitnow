import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '../../data/calculatorRegistry'; // Named import
import { CalculatorLayout } from '../../components/calculators/common/CalculatorLayout'; // Named import

const ScienceCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();
  const calcInfo = calculatorRegistry[calculator || ''];

  if (!calcInfo) {
    return <div>Calculadora não encontrada. Tente outra na categoria de science. Verifique se o URL está correto ou adicione a entrada no registry.</div>; // Fallback informativo
  }

  // Derive nome do componente dinamicamente (ex.: 'density' -> 'DensityCalculator')
  const componentName = calculator
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Calculator';

  const CalculatorComponent = lazy(() => import(`@/components/calculators/science/${componentName}`)); // Path com alias @/ para Vite

  // Meta tags dinâmicas para SEO (baseadas no registry)
  const pageTitle = `${calcInfo.name} Calculator | Smart Kit Now`;
  const pageDescription = `Use our professional ${calcInfo.name} calculator to ${calcInfo.description.toLowerCase()}. Includes step-by-step instructions, practical examples, and trusted references for accurate scientific calculations.`;
  const pageKeywords = `${calcInfo.tags.join(', ')}, science calculators, physics tools, online calculator, smart kit now`;

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
      {/* Exemplo: <section className="mt-8"><h2>How to Use</h2><p>Enter mass and volume to calculate density.</p></section> */}
      {/* <section className="mt-8"><h2>Practical Examples</h2><ul><li>Example: Water at 1 g/cm³.</li></ul></section> */}
      {/* Affiliate: <a href="https://amazon.com/science-kits?tag=youraffid" target="_blank">Buy Science Kits on Amazon</a> */}
    </CalculatorLayout>
  );
};

export default ScienceCalculatorPage;