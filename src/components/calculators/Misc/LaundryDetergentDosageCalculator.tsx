import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ FIX: Ícones
import {
  Home,
  AlertTriangle,
  RotateCcw,
  Info,
  Droplets,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const LOAD_SIZES = [
  { label: "Small (up to 3 kg)", value: "small", dosage: 30 },
  { label: "Medium (3 - 6 kg)", value: "medium", dosage: 60 },
  { label: "Large (6 - 9 kg)", value: "large", dosage: 90 },
  { label: "Extra Large (9+ kg)", value: "xlarge", dosage: 120 },
];

export default function LaundryDetergentDosageCalculator() {
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentConcentration: "standard",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { loadSize, detergentConcentration } = inputs;

    if (!loadSize) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please select a load size to calculate dosage.",
        formulaUsed: null,
      };
    }

    const concentrationFactors: Record<string, number> = {
      standard: 1,
      concentrated: 0.7,
      ultraConcentrated: 0.5,
    };

    if (!detergentConcentration || !(detergentConcentration in concentrationFactors)) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please select a valid detergent concentration type.",
        formulaUsed: null,
      };
    }

    const baseDosage = LOAD_SIZES.find((l) => l.value === loadSize)?.dosage;

    if (!baseDosage) return { value: "", label: "", warning: "Invalid load size.", subtext: "", formulaUsed: null };

    const factor = concentrationFactors[detergentConcentration];
    const dosageMl = Math.round(baseDosage * factor);

    let warning = null;
    // ⚠️ FIX: Usando < e > matemáticos, não HTML entities
    if (dosageMl < 10) {
      warning = "Dosage is very low; ensure detergent is suitable for small loads.";
    }
    if (dosageMl > 150) {
      warning = "Dosage is quite high; consider splitting the load.";
    }

    return {
      value: `${dosageMl} ml`,
      label: "Recommended Detergent Dosage",
      subtext: "Dosage adjusted based on load size and concentration.",
      warning,
      formulaUsed: "Dosage (ml) = Base Dosage × Concentration Factor",
    };
  }, [inputs]);

  const faqs = [
    { question: "How do I know which load size to select?", answer: "Small loads are up to 3kg, Medium 3-6kg, Large 6-9kg. Use your machine's capacity as a guide." },
    { question: "Why does concentration matter?", answer: "Concentrated detergents are stronger, so you need less volume to achieve the same cleaning power." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block font-semibold">Select Load Size</Label>
        <Select value={inputs.loadSize} onValueChange={(v) => handleInputChange("loadSize", v)}>
          <SelectTrigger><SelectValue placeholder="Choose load size" /></SelectTrigger>
          <SelectContent>
            {LOAD_SIZES.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block font-semibold">
          Detergent Concentration <Info className="inline ml-1 h-4 w-4 text-blue-600" />
        </Label>
        <Select value={inputs.detergentConcentration} onValueChange={(v) => handleInputChange("detergentConcentration", v)}>
          <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="concentrated">Concentrated</SelectItem>
            <SelectItem value="ultraConcentrated">Ultra-Concentrated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ loadSize: "", detergentConcentration: "standard" })} className="flex-1 h-11">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed}</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">Using the right detergent dosage saves money and protects clothes. This calculator adjusts for load size and concentration.</p>
      </section>
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 pb-4"><h3 className="font-bold text-xl mb-2">{item.question}</h3><p className="text-slate-600">{item.answer}</p></li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laundry Detergent Dosage"
      description="Calculate the exact detergent amount needed."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ title: "Formula", formula: "Dosage = Base × Factor", variables: [] }}
      example={{ title: "Example", scenario: "Medium load, concentrated.", steps: [], result: "42ml" }}
      relatedCalculators={[]}
      onThisPage={[{ id: "what-is", label: "Understanding" }, { id: "faq", label: "FAQ" }]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
