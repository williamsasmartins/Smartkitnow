// src/components/layouts/CalculatorLayout.tsx
import React from "react";

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
    <div className="mx-auto max-w-5xl px-4 py-8">
      {children}
    </div>
  );
};

export default CalculatorLayout;
