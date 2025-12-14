import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatBmiBodyIndexEducationalCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs, inches)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and length (body length from nose to base of tail)
  const [inputs, setInputs] = useState({
    weight: "",
    length: "",
  });

  // 2. LOGIC ENGINE
  // Cat Body Condition Score (BCS) Index (educational proxy) calculated as:
  // Body Index = Weight (kg) / Length (m)^2
  // This is NOT BMI but a simplified educational index to show body condition trends.
  // Weight converted from lbs to kg if needed, length from inches to meters.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const lengthRaw = parseFloat(inputs.length);

    if (
      isNaN(weightRaw) ||
      isNaN(lengthRaw) ||
      weightRaw <= 0 ||
      lengthRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to metric
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const lengthM = unit === "imperial" ? lengthRaw * 0.0254 : lengthRaw;

    // Calculate Body Index (kg/m^2)
    const bodyIndex = weightKg / (lengthM * lengthM);

    // Interpretation based on rough ranges (educational only)
    let label = "";
    let warning = null;
    if (bodyIndex < 30) {
      label = "Underweight - Possible malnutrition or illness";
      warning =
        "If your cat's body index is low, consult a veterinarian to rule out health issues.";
    } else if (bodyIndex >= 30 && bodyIndex <= 45) {
      label = "Ideal weight range - Healthy body condition";
    } else if (bodyIndex > 45) {
      label = "Overweight - Risk of obesity-related health problems";
      warning =
        "High body index may indicate obesity. Consider veterinary advice for weight management.";
    }

    return {
      value: bodyIndex.toFixed(1),
      label,
      subtext:
        "This index is an educational tool and not a diagnostic measure. Consult your vet for health assessments.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the difference between Cat BMI and Body Condition Score?",
      answer:
        "Cat BMI is a simplified mathematical index calculated from weight and length, but it is not widely used in veterinary medicine due to feline body shape variability. The Body Condition Score (BCS) is a hands-on assessment by veterinarians that evaluates fat coverage and muscle mass. BCS provides a more accurate health status, while BMI-like indices serve only as educational approximations.",
    },
    {
      question: "Why is the formula using weight and length instead of height?",
      answer:
        "Unlike humans, cats have a horizontal body shape, so height is not a relevant measurement for body condition. Instead, body length from nose to base of tail is used as a proxy to normalize weight. This helps create an index that roughly accounts for size differences between cats of varying lengths.",
    },
    {
      question: "Can this calculator diagnose obesity or malnutrition in cats?",
      answer:
        "No, this tool is strictly educational and cannot replace professional veterinary diagnosis. It provides an estimated body index to help owners understand weight relative to size, but many factors affect a cat's health. Always consult a veterinarian for accurate assessment and personalized advice.",
    },
    {
      question: "How often should I measure my cat’s weight and length for tracking?",
      answer:
        "Regular monitoring every 1-3 months is recommended to track changes in your cat’s body condition over time. Frequent measurements help detect gradual weight gain or loss early, allowing timely intervention. Consistency in measurement technique and timing improves reliability of tracking progress.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChangeInput(field: "weight" | "length", value: string) {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              <SelectItem value="metric">Metric (kg, meters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={(e) => onChangeInput("weight", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Body Length (nose to base of tail) ({unit === "imperial" ? "inches" : "meters"})
          </Label>
          <Input
            id="length"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 18" : "e.g. 0.46"}
            value={inputs.length}
            onChange={(e) => onChangeInput("length", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", length: "" })}
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
                Estimated Body Index
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
          Understanding Cat BMI/Body Index (educational)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The concept of a Cat BMI or Body Index is an educational tool designed to help pet owners understand the relationship between a cat’s weight and body size. Unlike humans, cats have a horizontal body shape, making traditional BMI calculations inaccurate for assessing feline health. Instead, veterinarians rely on Body Condition Scores (BCS), which involve physical examination of fat coverage and muscle mass. This calculator uses a simplified formula based on weight and body length to provide a rough estimate of body condition trends, not a diagnostic measure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This index is calculated by dividing the cat’s weight (in kilograms) by the square of its body length (in meters), measured from the nose to the base of the tail. While this does not replace professional veterinary assessment, it offers a quantitative way for owners to track changes in their cat’s body condition over time. Understanding this index can help identify potential underweight or overweight conditions early, prompting timely veterinary consultation. Remember, many factors such as breed, age, and muscle mass influence a cat’s ideal body condition.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to measure your cat’s weight and body length accurately. Weight can be measured using a pet scale or a human scale by weighing yourself holding the cat and subtracting your weight. Body length should be measured from the tip of the nose to the base of the tail using a soft measuring tape while your cat is relaxed. Enter these values into the calculator in either imperial or metric units, then click “Calculate” to see the estimated body index.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight in pounds or kilograms.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your cat’s body length in inches or meters.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated body index and interpretation.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results as a guide and consult your veterinarian for a comprehensive health evaluation.
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
              href="https://www.aaha.org/guidelines/canine-obesity/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Canine and Feline Obesity Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on assessing and managing obesity in pets, including body condition scoring methods.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149307/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Journal: Body Condition Scoring in Cats
            </a>
            <p className="text-slate-500 text-sm">
              A peer-reviewed article discussing the clinical relevance of body condition scoring and its correlation with health outcomes in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/obesity-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Obesity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource on causes, risks, and management of obesity in cats from a veterinary hospital network.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat BMI/Body Index (educational)"
      description="Educational tool to understand the concept of a feline body mass index for health tracking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Body Index = Weight (kg) / Length (m)²",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Length (m)", description: "Body length from nose to base of tail in meters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A domestic cat weighs 10 lbs and measures 18 inches from nose to base of tail. The owner wants to estimate the cat’s body index to monitor health.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg. Convert length to meters: 18 inches × 0.0254 = 0.457 m.",
          },
          {
            label: "2",
            explanation:
              "Calculate body index: 4.54 kg ÷ (0.457 m)² = 4.54 ÷ 0.209 = 21.7 (rounded).",
          },
          {
            label: "3",
            explanation:
              "Interpretation: A body index of 21.7 suggests the cat is underweight based on this educational index, prompting a vet consultation.",
          },
        ],
        result: "Estimated Body Index: 21.7 (Underweight range)",
      }}
      relatedCalculators={[
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
        { title: "Play Session Planner (Feather/Chase Time Targets)", url: "/pets/cat-play-session-planner", icon: "🍖" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "💉" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat BMI/Body Index (educational)" },
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