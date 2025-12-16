import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle, Calculator } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentOfTotalCalculator() {
  const [inputs, setInputs] = useState({ 
     part: "",
     total: ""
  });
  
  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const part = parseFloat(inputs.part);
    const total = parseFloat(inputs.total);

    if (isNaN(part) || isNaN(total) || total === 0) {
        return { 
            value: "Aguardando dados...", 
            label: "Insira a Parte e o Total.", 
            subtext: "", 
            warning: null, 
            formulaUsed: null 
        };
    }

    // Calculation: (Part / Total) * 100
    const percentage = (part / total) * 100;

    return { 
       value: `${percentage.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`, 
       label: `${part} é ${percentage.toFixed(2)}% de ${total}`, 
       subtext: "Cálculo preciso de porcentagem simples.",
       warning: null,
       formulaUsed: "Fórmula: (Parte ÷ Total) × 100"
    };
  }, [inputs]);

  const faqs = [
    { question: "Como calculo a porcentagem de um total?", answer: "Divida a parte pelo total e multiplique o resultado por 100. Por exemplo, 20 dividido por 50 é 0,4. Multiplicando por 100, temos 40%." },
    { question: "O total pode ser menor que a parte?", answer: "Sim. Se a parte for maior que o total, a porcentagem será maior que 100% (ex: 150 é 150% de 100)." },
    { question: "Para que serve este cálculo?", answer: "É essencial para finanças (impostos, descontos), estatísticas e situações cotidianas como calcular gorjetas ou notas de provas." },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Parte (Valor Menor)</Label>
            <Input 
                type="number" 
                value={inputs.part} 
                onChange={(e) => handleInputChange("part", e.target.value)}
                placeholder="Ex: 25"
            />
          </div>
          <div>
            <Label>Total (Valor Maior)</Label>
            <Input 
                type="number" 
                value={inputs.total} 
                onChange={(e) => handleInputChange("total", e.target.value)}
                placeholder="Ex: 100"
            />
          </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Sigma className="mr-2 h-4 w-4" /> Calcular
        </Button>
        <Button variant="outline" onClick={() => setInputs({ part: "", total: "" })} className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw className="mr-2 h-4 w-4" /> Limpar
        </Button>
      </div>

      {results.value !== "Aguardando dados..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed}</p>
                 <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              </CardContent>
           </Card>
           <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
              <Calculator className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                 <strong>Dica:</strong> Se o resultado for maior que 100%, significa que a parte excede o total original.
              </p>
           </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Percent of Total</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Calculating the "percent of total" is one of the most fundamental skills in mathematics and daily life. It allows us to express a portion of a whole as a fraction of 100, making comparisons easier and intuitive.
         </p>
      </section>
      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
         <ul className="space-y-6">
            {faqs.map((item, i) => (
              <li key={i} className="border-b border-slate-200 pb-4">
                <h3 className="font-bold text-xl mb-2">{item.question}</h3>
                <p className="text-slate-600">{item.answer}</p>
              </li>
            ))}
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent of Total Calculator"
      description="Calculate what percentage one number is of another instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Percentage Formula", 
        formula: "P = (part / total) × 100", 
        variables: [{ symbol: "P", description: "Percentage" }, { symbol: "part", description: "The portion" }, { symbol: "total", description: "The whole amount" }] 
      }}
      example={{ 
        title: "Example", 
        scenario: "What percent is 20 of 50?",
        steps: [{ label: "1", explanation: "20 ÷ 50 = 0.4" }, { label: "2", explanation: "0.4 × 100 = 40%" }],
        result: "40%"
      }}
      relatedCalculators={[]}
      onThisPage={[{id: "what-is", label: "Understanding"}, {id: "faq", label: "FAQ"}]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
