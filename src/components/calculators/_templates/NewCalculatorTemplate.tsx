import React from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";

/**
 * NewCalculatorTemplate — arquivo base para criar novas calculadoras.
 * Como usar:
 * 1) Copie este arquivo para a pasta da categoria, ex.: src/components/calculators/Financial/MyNewCalculator.tsx
 * 2) Renomeie o componente default export para o nome da sua calculadora.
 * 3) Substitua o conteúdo de `editorial` e `widget` pelo seu conteúdo real.
 * 4) (Opcional) Ajuste o JSON-LD em `jsonLd` para SEO.
 * 5) Registre no `src/data/calculatorRegistry.ts` com `loader: () => import("@/components/calculators/<Categoria>/<Nome>")`.
 */

export default function NewCalculatorTemplate() {
  // Exemplo mínimo de JSON-LD (SoftwareApplication + WebPage)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Example Calculator",
      applicationCategory: "FinanceApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      operatingSystem: "Web",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Example Calculator",
      description:
        "Calculate example values. Replace with a concise, keyword-rich description.",
      isPartOf: { "@type": "WebSite", name: "SmartKit" },
    },
  ];

  // Conteúdo editorial (esquerda, em telas largas)
  const Editorial = (
    <article className="rounded-2xl p-4 border">
      <h2 className="text-xl font-semibold mb-3">How this calculator works</h2>
      <p className="mb-4">
        Use this area to explain the logic, formulas, examples, and any caveats
        about your calculator. Keep it concise and helpful.
      </p>
      <h3 className="text-lg font-semibold mb-2">Formula</h3>
      <pre className="bg-muted rounded p-3 overflow-x-auto">
        {`result = inputA * inputB // replace with your formula`}
      </pre>

      <h3 className="text-lg font-semibold mt-4 mb-2">Examples</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Example 1: inputA = 10, inputB = 2 → result = 20</li>
        <li>Example 2: inputA = 5, inputB = 3 → result = 15</li>
      </ul>
    </article>
  );

  // Widget da calculadora (sticky ao centro/direita, em telas largas)
  const Widget = (
    <div className="rounded-2xl p-4 border">
      <form className="space-y-3">
        <div>
          <label htmlFor="inputA" className="block text-sm font-medium mb-1">
            Input A
          </label>
          <input
            id="inputA"
            type="number"
            className="w-full rounded border px-3 py-2"
            placeholder="Enter a number"
          />
        </div>
        <div>
          <label htmlFor="inputB" className="block text-sm font-medium mb-1">
            Input B
          </label>
          <input
            id="inputB"
            type="number"
            className="w-full rounded border px-3 py-2"
            placeholder="Enter a number"
          />
        </div>
        <button type="button" className="rounded bg-primary text-white px-4 py-2">
          Calculate
        </button>
      </form>
    </div>
  );

  // Rail direito (opcional): anúncios ou conteúdo adicional
  const RailRight = (
    <aside className="rounded-2xl p-4 border text-sm">
      <div className="mb-3 font-semibold">Sponsored</div>
      <p className="text-muted-foreground">Ad space or helpful links.</p>
    </aside>
  );

  return (
    <CalculatorUnifiedLayout
      title="Example Calculator"
      editorial={Editorial}
      widget={Widget}
      railRight={RailRight}
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      jsonLd={jsonLd}
      showTopBanner={true}
      topBannerHeight={90}
    />
  );
}