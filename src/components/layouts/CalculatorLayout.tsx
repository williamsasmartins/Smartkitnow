import React from "react";

// Layout limpo: sem Footer aqui (Footer fica no App layout raíz)
// Sem "Related / How it works / Sources" genéricos.
// Sem "Ad Rail" para calculators (padrão SKN).

type Props = { children: React.ReactNode };

export default function CalculatorLayout({ children }: Props) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      {children}
    </main>
  );
}
