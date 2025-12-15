import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseSeleniumToxicityThresholdCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Horse weight and Selenium intake (mg/day)
  const [inputs, setInputs] = useState({
    weight: "",
    seleniumIntake: "",
  });

  // 2. LOGIC ENGINE
  // Reference toxicity threshold: ~2 mg Se/kg dry matter intake (DMI) is toxic,
  // but here we calculate ppm in diet based on intake and weight.
  // Assume average DMI = 2% of body weight (kg)
  // ppm Se = (selenium intake mg/day) / (DMI kg/day) * 1000 (mg/kg = ppm)
  // DMI = 0.02 * weightKg
  // ppmSe = seleniumIntake / DMI

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const seleniumIntakeNum = parseFloat(inputs.seleniumIntake);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(seleniumIntakeNum) ||
      seleniumIntakeNum < 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate Dry Matter Intake (DMI) in kg/day (2% BW)
    const dmiKg = 0.02 * weightKg;

    // Calculate Selenium concentration in ppm (mg/kg)
    const seleniumPpm = seleniumIntakeNum / dmiKg;

    // Toxicity threshold reference: >5 ppm considered toxic for horses
    // Provide warning if above threshold
    const toxicityThreshold = 5; // ppm

    return {
      value: seleniumPpm.toFixed(2),
      label: "Estimated Selenium Concentration (ppm) in Diet",
      subtext:
        seleniumPpm > toxicityThreshold
          ? "Warning: Selenium concentration exceeds typical toxicity threshold (>5 ppm). Consult a veterinarian immediately."
          : "Selenium concentration is within typical safe limits (<5 ppm).",
      warning:
        seleniumPpm > toxicityThreshold
          ? "High selenium intake can cause toxicity in horses, leading to severe health issues including hair loss, hoof problems, and neurological signs."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the significance of selenium toxicity threshold in horses?",
      answer:
        "Selenium is an essential trace mineral for horses but has a narrow margin between deficiency and toxicity. The toxicity threshold indicates the maximum safe concentration in the diet to avoid adverse effects. Understanding this threshold helps prevent chronic selenium poisoning, which can cause symptoms like hair loss, hoof deformities, and neurological problems.",
    },
    {
      question: "How does selenium intake relate to parts per million (ppm) in the diet?",
      answer:
        "Parts per million (ppm) expresses the concentration of selenium in the horse’s feed relative to the dry matter intake. By calculating selenium intake in mg per kg of dry matter consumed, we can assess if the diet exceeds safe limits. This approach accounts for variations in feed consumption and body weight, providing a more accurate toxicity risk estimate.",
    },
    {
      question: "Why is dry matter intake (DMI) estimated as 2% of body weight?",
      answer:
        "Dry matter intake is commonly estimated as 2% of a horse’s body weight to approximate daily feed consumption excluding water content. This standard estimate allows calculation of nutrient concentrations like selenium on a consistent basis. While individual intake may vary, 2% is a widely accepted average for maintenance horses.",
    },
    {
      question: "What are the clinical signs of selenium toxicity in horses?",
      answer:
        "Clinical signs of selenium toxicity, or selenosis, include hair loss especially in the mane and tail, hoof abnormalities such as cracking or sloughing, lethargy, and neurological deficits like weakness or incoordination. Chronic exposure to high selenium levels damages multiple organ systems, making early detection and prevention critical for equine health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>

        <div>
          <Label
            htmlFor="seleniumIntake"
            className="text-slate-700 dark:text-slate-300"
          >
            Selenium Intake (mg/day)
          </Label>
          <Input
            id="seleniumIntake"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={inputs.seleniumIntake}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, seleniumIntake: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", seleniumIntake: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} ppm
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
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
          Understanding Horse Selenium Toxicity Threshold (ppm)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Selenium is a vital trace mineral necessary for antioxidant defense and
          thyroid hormone metabolism in horses. However, its therapeutic window is
          narrow, meaning that the difference between beneficial and toxic levels is
          small. The toxicity threshold, expressed in parts per million (ppm), defines
          the maximum safe concentration of selenium in the horse’s diet to prevent
          adverse health effects.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Toxicity occurs when selenium intake exceeds the horse’s ability to
          metabolize and excrete it, leading to accumulation in tissues. Chronic
          selenium poisoning, or selenosis, manifests as hair loss, hoof deformities,
          and neurological symptoms. Monitoring selenium concentration in feed using
          ppm values helps caretakers maintain safe dietary levels and avoid toxicity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the selenium concentration in parts per million
          based on the horse’s weight and daily selenium intake. It assumes an
          average dry matter intake of 2% of body weight, a standard estimate for
          maintenance horses. By comparing the calculated ppm to known toxicity
          thresholds, users can assess the risk of selenium poisoning and take
          preventive measures.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this tool, input the horse’s body weight and the estimated daily
          selenium intake in milligrams. Select the appropriate unit system for the
          weight (imperial or metric). The calculator will then estimate the selenium
          concentration in the diet expressed in parts per million (ppm), which is
          the standard unit for mineral concentration in feed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the horse’s weight in pounds or kilograms
            depending on the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total daily selenium intake in
            milligrams, considering all feed and supplements.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the estimated selenium
            concentration in ppm and assess if it exceeds toxicity thresholds.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to adjust feed or supplements to
            maintain safe selenium levels and consult a veterinarian if toxicity is
            suspected.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11104644/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Selenium Toxicity in Horses: Clinical and Pathological Features
            </a>
            <p className="text-slate-500 text-sm">
              This study details the clinical signs and pathological findings of
              selenium toxicity in equines, providing foundational knowledge for safe
              dietary limits.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/minerals/selenium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Selenium
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of selenium’s role, requirements, and toxicity in
              veterinary species including horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5372951/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Nutritional Requirements of Horses (NRC 2007)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on equine nutrition including trace mineral
              recommendations and toxicity thresholds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Selenium Toxicity Threshold (ppm)"
      description="Calculate the safe upper limit and potential toxicity risk of **Selenium** intake in parts per million (ppm)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Selenium ppm = (Selenium Intake mg/day) ÷ (Dry Matter Intake kg/day)",
        variables: [
          {
            symbol: "Selenium Intake",
            description: "Total selenium consumed daily in milligrams",
          },
          {
            symbol: "Dry Matter Intake",
            description: "Estimated daily feed intake in kilograms (2% of body weight)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse consumes 12 mg of selenium daily from feed and supplements. Calculate the selenium concentration in ppm to assess toxicity risk.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 1100 lb ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Estimate dry matter intake: 2% × 499 kg = 9.98 kg feed/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate selenium ppm: 12 mg ÷ 9.98 kg = 1.20 ppm selenium in diet.",
          },
        ],
        result:
          "The selenium concentration is 1.20 ppm, which is below the toxicity threshold of 5 ppm, indicating a safe intake level.",
      }}
      relatedCalculators={[
        {
          title: "Hand-Feeding Formula Amount (Chicks)",
          url: "/pets/bird-hand-feeding-formula-amount-chicks",
          icon: "🐾",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🐶",
        },
        {
          title: "Horse Protein & Lysine Requirement Calculator",
          url: "/pets/horse-protein-lysine-requirement",
          icon: "🐎",
        },
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "💉",
        },
        {
          title: "Calcium Intake Limit (Bladder Stone Prevention)",
          url: "/pets/small-mammal-calcium-intake-limit",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Selenium Toxicity Threshold (ppm)" },
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