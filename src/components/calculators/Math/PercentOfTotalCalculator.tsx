import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle, SquareRoot } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentOfTotalCalculator() {
  // Inputs: part and total values (both numbers)
  const [inputs, setInputs] = useState<{ part?: string; total?: string }>({});

  // Handle input changes
  const handleInputChange = useCallback((name: "part" | "total", value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic and validation
  const results = useMemo(() => {
    const partNum = parseFloat(inputs.part ?? "");
    const totalNum = parseFloat(inputs.total ?? "");

    // Validation: Check if inputs are valid numbers
    if (isNaN(partNum) || isNaN(totalNum)) {
      return {
        value: "Aguardando dados...",
        label: "Insira os valores iniciais.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Validation: total cannot be zero or negative for percentage calculation
    if (totalNum === 0) {
      return {
        value: "Erro",
        label: "O valor total não pode ser zero.",
        subtext: "",
        warning: "Divisão por zero não é permitida.",
        formulaUsed: "Percent of Total Formula",
      };
    }
    if (totalNum < 0) {
      return {
        value: "Erro",
        label: "O valor total deve ser positivo.",
        subtext: "",
        warning: "Valor total negativo não é válido para cálculo percentual.",
        formulaUsed: "Percent of Total Formula",
      };
    }

    // Calculation: Percent of total = (part / total) * 100
    const percent = (partNum / totalNum) * 100;

    // Round to 4 significant decimal places
    // Using toFixed(4) but also parseFloat to remove trailing zeros
    const roundedPercent = parseFloat(percent.toFixed(4));

    // Prepare display strings
    const displayValue = `${roundedPercent}%`;
    const labelText = `Percentual que ${partNum} representa de ${totalNum}`;
    const subtext = `Cálculo baseado na fórmula: (Parte ÷ Total) × 100`;
    const warningMsg = null;
    const formulaUsed = "Percent of Total Formula";

    return {
      value: displayValue,
      label: labelText,
      subtext: subtext,
      warning: warningMsg,
      formulaUsed: formulaUsed,
    };
  }, [inputs]);

  // FAQs for SEO and user help
  const faqs = [
    {
      question: "O que é este cálculo?",
      answer:
        "O cálculo de 'Percent of Total' determina qual porcentagem uma parte representa em relação a um todo. É fundamental para entender proporções e distribuições em diversas áreas, como finanças, estatística e análise de dados.",
    },
    {
      question: "Qual a importância da precisão decimal?",
      answer:
        "A precisão decimal garante que os resultados sejam confiáveis e úteis para tomadas de decisão. Arredondar para pelo menos quatro casas decimais evita erros significativos, especialmente em contextos científicos e financeiros.",
    },
    {
      question: "Onde esta fórmula é mais usada?",
      answer:
        "Esta fórmula é amplamente usada em finanças para calcular participação de mercado, em estatística para análise de dados percentuais, e em engenharia para determinar proporções e eficiências relativas.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget with inputs, buttons, and results display
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="part-input" className="mb-1 block font-semibold">
            Parte (Valor Parcial)
          </Label>
          <Input
            id="part-input"
            type="number"
            step="any"
            placeholder="Ex: 25"
            value={inputs.part ?? ""}
            onChange={(e) => handleInputChange("part", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="total-input" className="mb-1 block font-semibold">
            Total (Valor Total)
          </Label>
          <Input
            id="total-input"
            type="number"
            step="any"
            placeholder="Ex: 200"
            value={inputs.total ?? ""}
            onChange={(e) => handleInputChange("total", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calcular Percentual"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calcular
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Limpar campos"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Limpar
        </Button>
      </div>

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== "Aguardando dados..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Resultado Matemático"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <SquareRoot className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Dica de Álgebra:</strong> Para obter o percentual, sempre divida a parte pelo total e multiplique por 100.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content with detailed explanations
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding the Percent of Total Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Percent of Total Calculator is a fundamental mathematical tool used to determine what fraction or portion a specific part represents of a whole. This concept is essential in various fields such as finance, statistics, and everyday problem-solving. By converting a ratio into a percentage, it provides an intuitive way to understand proportions and comparisons.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation involves dividing the part by the total and then multiplying by 100 to convert the decimal into a percentage. This process allows users to quickly assess contributions, shares, or distributions relative to a complete set or amount.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          In practical applications, this calculator helps in budgeting to understand expense categories, in sales to analyze market shares, and in data analysis to interpret survey results or statistical data. Its simplicity and clarity make it an indispensable tool for both professionals and students.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core formula used in this calculator is straightforward and widely recognized:
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto text-slate-800 dark:text-slate-200 text-lg font-mono">
          {`\\[
\\text{Percent of Total} = \\left( \\frac{\\text{Part}}{\\text{Total}} \\right) \\times 100
\\]`}
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          This formula calculates the ratio of the part to the total and expresses it as a percentage by multiplying by 100. It is important to ensure that the total is not zero to avoid division errors.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Mathematics FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://mathworld.wolfram.com/Percentage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Percentage - Wolfram MathWorld
            </a>
            <p className="text-slate-500 text-sm">Comprehensive explanation of percentage calculations and applications.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/arith-review-percent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Percentages
            </a>
            <p className="text-slate-500 text-sm">Educational resource covering the basics and applications of percentages.</p>
          </li>
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
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Key Formula",
        formula: "\\[ \\text{Percent of Total} = \\left( \\frac{\\text{Part}}{\\text{Total}} \\right) \\times 100 \\]",
        variables: [
          { symbol: "Part", description: "The portion or subset value" },
          { symbol: "Total", description: "The whole or total value" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Calculate what percentage 50 is of 200.",
        steps: [
          { label: "1", explanation: "Identify the part and total values: Part = 50, Total = 200." },
          { label: "2", explanation: "Apply the formula: (50 ÷ 200) × 100." },
          { label: "3", explanation: "Calculate the division: 0.25 × 100." },
          { label: "4", explanation: "Multiply to get the percentage: 25%." },
        ],
        result: "50 represents 25% of 200.",
      }}
      relatedCalculators={[
        { title: "GCF / GCD Calculator", url: "/math/gcf-gcd-calculator", icon: "🔢" },
        { title: "Percent Increase/Decrease Calculator", url: "/math/percent-increase-decrease", icon: "📈" },
        { title: "Log / Antilog (base 10/e) Calculator", url: "/math/log-antilog-calculator", icon: "🧮" },
        { title: "Permutations & Combinations", url: "/math/permutations-combinations", icon: "📊" },
        { title: "System of Equations Solver", url: "/math/system-of-equations-solver", icon: "🔢" },
        { title: "Trig Functions (sin/cos/tan) Angle/Side Finder", url: "/math/trig-functions-finder", icon: "📐" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding the Percent of Total Calculator" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "faq", label: "Mathematics FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}