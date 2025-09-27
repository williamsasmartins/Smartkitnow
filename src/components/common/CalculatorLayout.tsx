import React, { ReactNode } from "react";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  formula: string;
  example?: string; // <- propriedade opcional adicionada
  children: ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  formula,
  example,
  children,
}) => {
  return (
    <div className="calculator-layout p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="mb-2">{description}</p>
      <pre className="mb-4 bg-gray-100 p-2 rounded">{formula}</pre>
      {example && (
        <div className="mb-4 p-2 bg-yellow-50 border-l-4 border-yellow-400">
          <strong>Example:</strong>
          <pre>{example}</pre>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
