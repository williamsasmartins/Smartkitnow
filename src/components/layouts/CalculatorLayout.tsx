// src/components/layouts/CalculatorLayout.tsx
import React from "react";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

/**
 * Layout LIMPO para páginas de CALCULADORA.
 * - Sem AdSlot, sem banners/rails.
 * - Mantém apenas um container central responsivo.
 * - Mantém named export e default export para compatibilidade.
 */
type CalculatorLayoutProps = {
  children: React.ReactNode; // conteúdo da calculadora
  // Mantemos ids opcional apenas para compatibilidade futura; não é usado aqui.
  ids?: Record<string, string>;
};

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto max-w-[680px] px-4 xl:pr-6 py-8">
      {children}
    </div>
  );
};

export default CalculatorLayout;
