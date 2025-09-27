import React from 'react';
import { Helmet } from 'react-helmet'; // Para meta tags SEO
import { Header } from '../../Header'; // Named import
import { Footer } from '../../Footer'; // Named import
import { CalculatorFooter } from '../../CalculatorFooter'; // Named import
// Outros imports se existirem (ex.: para ads ou share)

interface CalculatorLayoutProps {
  title: string; // Para SEO
  description: string; // Para SEO e footer
  keywords?: string; // Para SEO
  calculatorName: string; // Para footer
  formula: string; // Para footer
  sources: { title: string; url: string }[]; // Para footer (referências)
  children: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  keywords = 'calculators, online tools, smart kit now, free calculators, health fitness, financial planning',
  calculatorName,
  formula,
  sources,
  children,
}) => {
  return (
    <>
      <Helmet>
        <title>{title} - Smart Kit Now</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
        {/* Seções para AdSense/SEO: instructions, examples */}
      </main>
      <CalculatorFooter
        calculatorName={calculatorName}
        description={description}
        formula={formula}
        sources={sources} // Limpo, sem vírgula extra ou spread incompleto
      />
      <Footer />
    </>
  );
};
