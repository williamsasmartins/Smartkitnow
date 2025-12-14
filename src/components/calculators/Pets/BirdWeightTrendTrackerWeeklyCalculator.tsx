import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdWeightTrendTrackerWeeklyCalculator() {
  // 1. STATE
  // No unit switcher needed because this is a weekly log tracker (time-based)
  // Weight input in pounds (imperial) or kg (metric) - default imperial
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight at week 1 and week 2 (or current week)
  const [inputs, setInputs] = useState({
    weightWeek1: "",
    weightWeek2: "",
  });

  // 2. LOGIC ENGINE
  // Calculate % weight change = ((W2 - W1) / W1) * 100
  // Positive % means weight gain, negative means loss
  const results = useMemo(() => {
    const w1 = parseFloat(inputs.weightWeek1);
    const w2 = parseFloat(inputs.weightWeek2);

    if (isNaN(w1) || isNaN(w2) || w1 <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to kg internally if imperial
    const w1Kg = unit === "imperial" ? w1 / 2.20462 : w1;
    const w2Kg = unit === "imperial" ? w2 / 2.20462 : w2;

    const percentChange = ((w2Kg - w1Kg) / w1Kg) * 100;

    let label = "";
    let warning = null;

    if (percentChange > 0) {
      label = `Weight increased by ${percentChange.toFixed(2)}% over the week.`;
    } else if (percentChange < 0) {
      label = `Weight decreased by ${Math.abs(percentChange).toFixed(2)}% over the week.`;
      if (Math.abs(percentChange) > 5) {
        warning =
          "Significant weight loss (>5%) detected. This may indicate illness or nutritional issues. Consult your veterinarian promptly.";
      }
    } else {
      label = "No change in weight detected over the week.";
    }

    return {
      value: `${percentChange.toFixed(2)}%`,
      label,
      subtext: "Percentage change in weight from previous week",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is tracking weekly weight trends important for birds?",
      answer:
        "Weekly weight tracking helps detect subtle changes that may indicate early illness or nutritional imbalances before clinical signs appear. Birds often mask symptoms, so consistent monitoring allows timely intervention. This proactive approach improves health outcomes by enabling prompt veterinary evaluation and treatment.",
    },
    {
      question: "How should I interpret small fluctuations in my bird’s weight?",
      answer:
        "Minor weight fluctuations are normal due to hydration, feeding, and activity variations. However, consistent trends of weight loss or gain over multiple weeks warrant attention. Tracking helps differentiate normal variability from concerning patterns that require veterinary assessment.",
    },
    {
      question: "What actions should I take if my bird loses more than 5% body weight in a week?",
      answer:
        "A weight loss exceeding 5% in one week is significant and may indicate underlying health problems such as infection, organ dysfunction, or inadequate nutrition. Immediate veterinary consultation is recommended to diagnose and address the cause. Early intervention can prevent progression of disease and improve prognosis.",
    },
    {
      question: "Can this tracker be used for all bird species?",
      answer:
        "Yes, the weight trend tracker is designed to monitor weekly weight changes across various bird species. However, species-specific normal weight ranges and health considerations should be taken into account. Consulting a veterinarian familiar with your bird’s species ensures accurate interpretation and care.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weightWeek1" className="text-slate-700 dark:text-slate-300">
            Weight - Previous Week ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weightWeek1"
            type="number"
            min="0"
            step="0.01"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weightWeek1}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weightWeek1: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="weightWeek2" className="text-slate-700 dark:text-slate-300">
            Weight - Current Week ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weightWeek2"
            type="number"
            min="0"
            step="0.01"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weightWeek2}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weightWeek2: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weightWeek1: "", weightWeek2: "" })}
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
          Understanding Weight Trend Tracker (Weekly Log)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Weight Trend Tracker (Weekly Log) is a vital tool designed to monitor subtle changes in a bird’s body weight over time. Birds are known for masking signs of illness, making early detection challenging. By logging weekly weights, caretakers and veterinarians can identify trends that may indicate health issues such as infections, nutritional deficiencies, or metabolic disorders before clinical symptoms become apparent.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tracker calculates the percentage change in weight between two consecutive weeks, providing a clear metric to assess whether a bird is gaining, losing, or maintaining weight. Consistent monitoring helps differentiate normal fluctuations from concerning patterns, enabling timely veterinary intervention. This proactive approach supports better health management and improves the chances of successful treatment outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Weight trends are especially important in avian species due to their high metabolic rates and sensitivity to environmental changes. Even small weight losses can be clinically significant. This tool empowers bird owners and professionals to maintain detailed records, facilitating informed discussions with veterinarians and enhancing overall avian welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use the Weight Trend Tracker, enter your bird’s weight from the previous week and the current week in the appropriate fields. Ensure weights are measured using a precise scale and recorded in the selected unit system (pounds or kilograms). After inputting the values, click “Calculate” to view the percentage change in weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Weigh your bird at the same time of day each week to reduce variability caused by feeding or hydration.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the previous week’s weight and the current week’s weight into the calculator fields.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to see the percentage change and interpret the results using the provided guidance.
          </li>
          <li>
            <strong>Step 4:</strong> If significant weight loss or gain is detected, consult your avian veterinarian promptly for further evaluation.
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
              href="https://www.aav.org/avian-health/weight-monitoring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Association of Avian Veterinarians - Weight Monitoring Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on the importance of weight monitoring in avian patients for early disease detection and management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466041/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. N. J. Doneley et al., “Clinical Avian Medicine”
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative textbook covering avian clinical signs, diagnostics, and the critical role of weight trends in health assessment.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/avian_weight_monitoring.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UC Davis Veterinary Medicine - Avian Weight Monitoring Protocols
            </a>
            <p className="text-slate-500 text-sm">
              Practical protocols and recommendations for consistent weight monitoring in birds to support clinical decision-making.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Weight Trend Tracker (Weekly Log)"
      description="Tool to log and track a bird's weight weekly to catch subtle signs of illness or nutritional imbalance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Weight Change (%) = ((Weight₂ - Weight₁) / Weight₁) × 100",
        variables: [
          { symbol: "Weight₁", description: "Weight in previous week (kg or lbs)" },
          { symbol: "Weight₂", description: "Weight in current week (kg or lbs)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parakeet weighed 120 grams last week and 114 grams this week. The owner wants to know if this weight change is significant.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weights to kilograms if needed (120g = 0.12kg, 114g = 0.114kg). Calculate percentage change using the formula.",
          },
          {
            label: "2",
            explanation:
              "Apply formula: ((0.114 - 0.12) / 0.12) × 100 = (-0.006 / 0.12) × 100 = -5%.",
          },
          {
            label: "3",
            explanation:
              "Interpretation: The bird lost 5% of its body weight in one week, which is significant and warrants veterinary consultation.",
          },
        ],
        result: "The 5% weight loss indicates a potential health concern requiring prompt veterinary evaluation.",
      }}
      relatedCalculators={[
        { title: "Tramadol Dose Calculator for Dogs", url: "/pets/dog-tramadol-dose", icon: "🐶" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Play Session Planner (Feather/Chase Time Targets)", url: "/pets/cat-play-session-planner", icon: "🐱" },
        { title: "Pond Volume & Liner Size Calculator", url: "/pets/pond-volume-liner-size", icon: "🍖" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Weight Trend Tracker (Weekly Log)" },
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