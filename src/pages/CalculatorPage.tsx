import React, { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEntry } from "@/data/calculatorRegistry";

function createLazyFromLoader(loader: () => Promise<any>, namedExport?: string) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: namedExport ? mod[namedExport] : (mod.default ?? Object.values(mod)[0]) };
  });
  return Lazy;
}

export default function CalculatorPage() {
  const { calculator, slug } = useParams();
  
  const calcSlug = (calculator ?? slug ?? "").toLowerCase();
  
  // --- A MUDANÇA MÁGICA ---
  // Antes: Só era "Wide" se fosse financeiro.
  // Agora: É SEMPRE "Wide". Isso garante o fundo azul em tela cheia para TODOS.
  const isWide = true; 
  // ------------------------
  
  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#5c82ee]">Calculator not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find this calculator. Please use the site menu.</p>
      </div>
    );
  }

  const LazyCalc = createLazyFromLoader(entry.loader, entry.namedExport);

  // Container Classes: Sempre usamos o padrão simétrico (Wide)
  // O controle de margem superior (padding-top) agora é responsabilidade exclusiva 
  // do componente CalculatorVerticalLayout, evitando duplicação de espaços.
  const containerClasses = "w-full px-4 md:px-8 lg:px-10";

  return (
    <div className={containerClasses}>
      {/* max-w-none permite que o CalculatorVerticalLayout controle a largura interna */}
      <div className="max-w-none">
        <Suspense fallback={<div className="py-10 text-muted-foreground text-center">Loading Calculator...</div>}>
          <main className="min-w-0">
            <LazyCalc />
          </main>
        </Suspense>
      </div>
    </div>
  );
}
