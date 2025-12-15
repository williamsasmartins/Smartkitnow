import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FerretProteinFatRatioCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Protein % and Fat % of diet
  const [inputs, setInputs] = useState({
    proteinPercent: "",
    fatPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const protein = parseFloat(inputs.proteinPercent);
    const fat = parseFloat(inputs.fatPercent);

    if (
      isNaN(protein) ||
      isNaN(fat) ||
      protein <= 0 ||
      fat <= 0 ||
      protein > 100 ||
      fat > 100
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid percentages between 0 and 100.",
        warning: null,
      };
    }

    // Calculate protein to fat ratio (protein % / fat %)
    const ratio = protein / fat;

    // Interpretation based on veterinary nutrition for ferrets:
    // Ferrets require a high protein and fat diet, typically protein:fat ratio ~1.5 to 2.5
    // Ratios below 1.5 may indicate insufficient protein relative to fat
    // Ratios above 3 may indicate excessive protein relative to fat, which can stress kidneys

    let warning = null;
    if (ratio < 1.5) {
      warning =
        "Protein is low relative to fat. Ferrets need a high protein diet to maintain muscle mass and energy.";
    } else if (ratio > 3) {
      warning =
        "Protein is very high relative to fat. Excessive protein can strain kidneys and cause metabolic imbalance.";
    }

    return {
      value: ratio.toFixed(2),
      label: "Protein/Fat Ratio",
      subtext:
        "Ideal range for ferrets is approximately 1.5 to 2.5 for optimal health.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the protein to fat ratio important for ferrets?",
      answer:
        "Ferrets are obligate carnivores requiring diets rich in both protein and fat to support their high metabolism and energy needs. The protein to fat ratio ensures they receive adequate amino acids for muscle maintenance and sufficient fat for energy. An improper ratio can lead to health issues such as muscle wasting or metabolic imbalances.",
    },
    {
      question: "How do I measure protein and fat percentages in ferret food?",
      answer:
        "Protein and fat percentages are typically listed on commercial ferret food labels as crude protein and crude fat. For homemade diets, laboratory nutrient analysis or consulting a veterinary nutritionist is recommended. Accurate measurement ensures the diet meets ferrets’ strict nutritional requirements.",
    },
    {
      question: "What happens if the protein/fat ratio is too low or too high?",
      answer:
        "A low protein/fat ratio means insufficient protein relative to fat, which can cause muscle loss and poor immune function in ferrets. Conversely, a very high ratio may overload the kidneys and cause metabolic stress due to excess protein. Maintaining a balanced ratio supports overall health and longevity.",
    },
    {
      question: "Can this calculator replace veterinary advice?",
      answer:
        "This tool is designed for educational purposes to help understand ferret diet composition but cannot replace professional veterinary consultation. Individual ferrets may have unique health needs requiring tailored nutrition plans. Always consult a veterinarian or veterinary nutritionist for diagnosis and diet formulation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (%)</SelectItem>
              <SelectItem value="metric">Metric (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="proteinPercent" className="text-slate-700 dark:text-slate-300">
            Protein Percentage (%)
          </Label>
          <Input
            id="proteinPercent"
            type="number"
            min={0}
            max={100}
            step="0.1"
            placeholder="e.g. 40"
            value={inputs.proteinPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, proteinPercent: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="fatPercent" className="text-slate-700 dark:text-slate-300">
            Fat Percentage (%)
          </Label>
          <Input
            id="fatPercent"
            type="number"
            min={0}
            max={100}
            step="0.1"
            placeholder="e.g. 20"
            value={inputs.fatPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, fatPercent: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ proteinPercent: "", fatPercent: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
          Understanding Ferret Protein/Fat Ratio Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ferrets are obligate carnivores with unique dietary needs that require a high intake of both protein and fat. Unlike omnivorous pets, ferrets rely heavily on animal-based proteins and fats to maintain their rapid metabolism and overall health. The protein to fat ratio in their diet is a critical factor that influences muscle maintenance, energy levels, and organ function. This checker helps evaluate whether a given diet meets these essential nutritional parameters.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an appropriate protein to fat ratio is vital because ferrets metabolize nutrients differently than other animals. Too little protein relative to fat can lead to muscle wasting, immune deficiencies, and poor coat condition. Conversely, an excessively high protein ratio may strain the kidneys and disrupt metabolic balance. This tool provides a straightforward way to assess the balance, ensuring the diet supports optimal health and longevity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is designed for both pet owners and veterinary professionals to quickly analyze ferret diets based on protein and fat percentages. By inputting the crude protein and crude fat values from food labels or nutritional analyses, users receive an immediate ratio and interpretive guidance. This empowers informed decisions about diet formulation, supplementation, or commercial food selection tailored to ferret-specific needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is simple and intuitive, designed to provide quick insights into the nutritional balance of your ferret’s diet. Begin by gathering the crude protein and crude fat percentages from your ferret food packaging or nutritional analysis report. These values represent the proportion of protein and fat by weight in the diet.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric). Both represent percentages, so this is for user preference only.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the crude protein percentage in the first input field. This should be a value between 0 and 100.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the crude fat percentage in the second input field, also between 0 and 100.
          </li>
          <li>
            <strong>Step 4:</strong> Click the “Calculate” button to compute the protein to fat ratio. The result will display the ratio and provide interpretive feedback.
          </li>
          <li>
            <strong>Step 5:</strong> Use the warnings and guidance to adjust the diet if necessary, and consult your veterinarian for personalized advice.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/ferrets/nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Ferret Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of ferret dietary requirements emphasizing protein and fat needs for optimal health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aavpt.org/page/ferret-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Association of Veterinary Parasitologists: Ferret Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Detailed nutritional recommendations for ferrets including macronutrient ratios and feeding strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149729/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health: Nutritional Requirements of Ferrets
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed research article discussing the metabolic and dietary needs of ferrets as obligate carnivores.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ferret Protein/Fat Ratio Checker"
      description="Check the diet to ensure it meets the high protein and fat requirements for obligate carnivores like ferrets."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Protein/Fat Ratio = Protein % ÷ Fat %",
        variables: [
          { symbol: "Protein %", description: "Crude protein percentage in diet" },
          { symbol: "Fat %", description: "Crude fat percentage in diet" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A ferret food label shows 40% crude protein and 20% crude fat. The owner wants to verify if this diet is balanced for their pet.",
        steps: [
          {
            label: "1",
            explanation:
              "Input protein percentage as 40 and fat percentage as 20 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the protein/fat ratio: 40 ÷ 20 = 2.0, which falls within the ideal range.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result: A ratio of 2.0 indicates a balanced diet suitable for ferret health.",
          },
        ],
        result: "Protein/Fat Ratio = 2.0 (Ideal range: 1.5 to 2.5)",
      }}
      relatedCalculators={[
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐶",
        },
        {
          title: "Horse Body Condition Score Helper (Henneke 1–9)",
          url: "/pets/horse-body-condition-score-henneke",
          icon: "🐎",
        },
        {
          title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
          url: "/pets/horse-toxic-plant-exposure-risk",
          icon: "🐎",
        },
        {
          title: "Horse Feeding Rate Calculator (Forage + Concentrate)",
          url: "/pets/horse-feeding-rate-forage-concentrate",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ferret Protein/Fat Ratio Checker" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}