import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, Calculator, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentOfTotalCalculator() {
  const [inputs, setInputs] = useState({
    part: "",
    total: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers, decimal point, and minus sign for input
    if (/^-?\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const partRaw = inputs.part.trim();
    const totalRaw = inputs.total.trim();

    // Validation
    if (partRaw === "" || totalRaw === "") {
      return {
        value: "Aguardando...",
        label: "Insira os valores para calcular",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const part = Number(partRaw);
    const total = Number(totalRaw);

    if (isNaN(part) || isNaN(total)) {
      return {
        value: "Erro",
        label: "Valores inválidos",
        subtext: "Por favor, insira números válidos.",
        warning: "Entrada não numérica detectada.",
        formulaUsed: null,
      };
    }

    if (total === 0) {
      return {
        value: "Erro",
        label: "Divisão por zero",
        subtext: "O valor total não pode ser zero.",
        warning: "Divisão por zero não é permitida.",
        formulaUsed: null,
      };
    }

    // Calculation: Percent of Total = (part / total) * 100
    const percent = (part / total) * 100;

    // Format result to 4 decimal places
    const formattedPercent = percent.toFixed(4);

    return {
      value: `${formattedPercent}%`,
      label: `${part} é ${formattedPercent}% de ${total}`,
      subtext: "Percentual calculado com precisão de 4 casas decimais.",
      warning: null,
      formulaUsed: "Percent of Total = (Part ÷ Total) × 100",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "O que significa 'Percent of Total'?",
      answer:
        "É a porcentagem que uma parte representa do valor total. Por exemplo, se você tem 20 de um total de 100, isso representa 20%.",
    },
    {
      question: "Posso usar números negativos?",
      answer:
        "Sim, o cálculo funciona com números negativos, mas o resultado pode não fazer sentido em contextos práticos.",
    },
    {
      question: "O que acontece se o total for zero?",
      answer:
        "A divisão por zero não é permitida, e o cálculo exibirá um erro para evitar resultados inválidos.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="part">Parte (valor específico)</Label>
          <Input
            id="part"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 25"
            value={inputs.part}
            onChange={(e) => handleInputChange("part", e.target.value)}
            aria-describedby="part-desc"
          />
          <p id="part-desc" className="text-sm text-slate-500 mt-1">
            Insira o valor da parte que deseja calcular o percentual.
          </p>
        </div>
        <div>
          <Label htmlFor="total">Total (valor total)</Label>
          <Input
            id="total"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 200"
            value={inputs.total}
            onChange={(e) => handleInputChange("total", e.target.value)}
            aria-describedby="total-desc"
          />
          <p id="total-desc" className="text-sm text-slate-500 mt-1">
            Insira o valor total para referência.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; calculation is reactive
          }}
          aria-label="Calcular percentual"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calcular
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ part: "", total: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Limpar entradas"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Limpar
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Aguardando..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              {results.formulaUsed && (
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                  {results.formulaUsed}
                </p>
              )}
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 border-red-200 rounded flex gap-2" role="alert">
                  <AlertTriangle className="w-5 h-5" /> {results.warning}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ⚠️ FIX: Use Calculator icon here, NOT SquareRoot */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Calculator className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Math Tip:</strong> Always double check your input units.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Percent of Total Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine what percentage a specific part represents of a total value.
          It is useful in many contexts such as finance, statistics, and everyday calculations.
          Simply input the part and the total, and the tool will compute the percentage with high precision.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono">
          {"Percent of Total (%) = (Part ÷ Total) × 100"}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent of Total Calculator"
      description="Calculate the percentage of a total value. Quickly determine what part of the whole a specific number represents."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "Percent of Total (%) = (Part ÷ Total) × 100",
        variables: [
          { symbol: "Part", description: "The specific part or portion value" },
          { symbol: "Total", description: "The total or whole value" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You want to find what percentage 50 is of 200.",
        steps: [
          { label: "1", explanation: "Identify the part: 50" },
          { label: "2", explanation: "Identify the total: 200" },
          { label: "3", explanation: "Apply the formula: (50 ÷ 200) × 100" },
          { label: "4", explanation: "Calculate: 0.25 × 100 = 25%" },
        ],
        result: "50 is 25% of 200.",
      }}
      relatedCalculators={[
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Quadratic Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}