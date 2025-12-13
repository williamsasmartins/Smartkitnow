import { useState, useMemo } from "react";
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
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodySurfaceAreaBsaCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weightLbs?: number;
    heightFt?: number;
    heightIn?: number;
    weightKg?: number;
    heightCm?: number;
  }>({});

  // 2. LOGIC
  // Use Mosteller formula (widely accepted, simple, and accurate)
  // BSA (m²) = sqrt([height(cm) x weight(kg)] / 3600)
  // Convert imperial inputs to metric for calculation

  const results = useMemo(() => {
    let weightKg: number | undefined;
    let heightCm: number | undefined;

    if (unit === "imperial") {
      if (
        inputs.weightLbs === undefined ||
        inputs.heightFt === undefined ||
        inputs.heightIn === undefined
      )
        return { value: 0, label: "", category: "" };
      weightKg = inputs.weightLbs * 0.45359237;
      heightCm = (inputs.heightFt * 12 + inputs.heightIn) * 2.54;
    } else {
      if (inputs.weightKg === undefined || inputs.heightCm === undefined)
        return { value: 0, label: "", category: "" };
      weightKg = inputs.weightKg;
      heightCm = inputs.heightCm;
    }

    if (weightKg <= 0 || heightCm <= 0)
      return { value: 0, label: "", category: "" };

    const bsa = Math.sqrt((heightCm * weightKg) / 3600);

    // Round to 2 decimals
    const bsaRounded = Math.round(bsa * 100) / 100;

    return {
      value: bsaRounded,
      label: "Body Surface Area (m²)",
      category: "",
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Body Surface Area (BSA) Calculator used for?",
      answer:
        "The Body Surface Area (BSA) Calculator estimates the total surface area of the human body, expressed in square meters (m²). BSA is a critical parameter in clinical settings, especially for determining appropriate drug dosages, assessing renal function, and calculating metabolic rates. Unlike body weight alone, BSA provides a more accurate representation of physiological functions that scale with body size. This calculator uses the Mosteller formula, which balances simplicity and accuracy, making it widely accepted in both Canadian and US healthcare contexts.",
    },
    {
      question: "How should I interpret my BSA result?",
      answer:
        "Your BSA value represents the approximate external surface area of your body. Typical adult BSA values range from about 1.5 to 2.5 m², depending on height and weight. Clinicians use BSA to individualize medication dosages, especially for chemotherapy and other potent drugs, to reduce toxicity and improve efficacy. Additionally, BSA is used in calculating cardiac index and glomerular filtration rate (GFR). It is important to note that BSA is a calculated estimate and should be interpreted alongside other clinical parameters.",
    },
    {
      question: "What are the limitations of the BSA Calculator?",
      answer:
        "While the Mosteller formula is widely used, it is still an estimation and may not perfectly represent all body types, such as those with extreme obesity, edema, or cachexia. The formula assumes a relatively average body shape and composition. Additionally, BSA does not account for variations in body fat distribution or muscle mass. For pediatric patients or those with unusual body proportions, alternative formulas or direct measurement methods may be preferred. Always consult healthcare professionals for clinical decisions.",
    },
    {
      question: "Why does the calculator default to imperial units first?",
      answer:
        "This calculator defaults to imperial units (pounds, feet, inches) to align with common measurement systems used in the United States and Canada, where these units are prevalent in clinical and everyday contexts. However, the calculator also supports metric units (kilograms, centimeters) to accommodate international users and healthcare settings that use the metric system. Users can easily switch between unit systems without losing entered data, ensuring accessibility and convenience.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const value = e.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : Number(value),
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

  // Calculate button triggers no special action because calculation is dynamic on input change
  // But we keep the button for UX consistency

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              // Convert inputs when switching units
              if (value === unit) return;
              if (value === "metric") {
                // Convert imperial to metric if possible
                if (
                  inputs.weightLbs !== undefined &&
                  inputs.heightFt !== undefined &&
                  inputs.heightIn !== undefined
                ) {
                  const weightKg = inputs.weightLbs * 0.45359237;
                  const heightCm = (inputs.heightFt * 12 + inputs.heightIn) * 2.54;
                  setInputs({
                    weightKg: Math.round(weightKg * 100) / 100,
                    heightCm: Math.round(heightCm * 100) / 100,
                  });
                } else {
                  setInputs({});
                }
              } else {
                // Convert metric to imperial if possible
                if (
                  inputs.weightKg !== undefined &&
                  inputs.heightCm !== undefined
                ) {
                  const weightLbs = inputs.weightKg / 0.45359237;
                  const totalInches = inputs.heightCm / 2.54;
                  const heightFt = Math.floor(totalInches / 12);
                  const heightIn = Math.round(totalInches - heightFt * 12);
                  setInputs({
                    weightLbs: Math.round(weightLbs * 100) / 100,
                    heightFt,
                    heightIn,
                  });
                } else {
                  setInputs({});
                }
              }
              setUnit(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        {unit === "imperial" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weightLbs" className="text-slate-700 dark:text-slate-300">
                Weight (lbs)
              </Label>
              <Input
                id="weightLbs"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 150"
                value={inputs.weightLbs ?? ""}
                onChange={(e) => handleInputChange(e, "weightLbs")}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-xs text-slate-400 mt-1">
                Enter your weight in pounds.
              </p>
            </div>
            <div>
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300">
                Height (ft)
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFt ?? ""}
                onChange={(e) => handleInputChange(e, "heightFt")}
                aria-describedby="heightHelp"
              />
            </div>
            <div>
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300">
                Height (in)
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="e.g. 8"
                value={inputs.heightIn ?? ""}
                onChange={(e) => handleInputChange(e, "heightIn")}
                aria-describedby="heightHelp"
              />
              <p id="heightHelp" className="text-xs text-slate-400 mt-1">
                Enter remaining inches (0-11).
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weightKg" className="text-slate-700 dark:text-slate-300">
                Weight (kg)
              </Label>
              <Input
                id="weightKg"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 68"
                value={inputs.weightKg ?? ""}
                onChange={(e) => handleInputChange(e, "weightKg")}
                aria-describedby="weightKgHelp"
              />
              <p id="weightKgHelp" className="text-xs text-slate-400 mt-1">
                Enter your weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
                Height (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 173"
                value={inputs.heightCm ?? ""}
                onChange={(e) => handleInputChange(e, "heightCm")}
                aria-describedby="heightCmHelp"
              />
              <p id="heightCmHelp" className="text-xs text-slate-400 mt-1">
                Enter your height in centimeters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is live
          }}
          aria-label="Calculate Body Surface Area"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Body Surface Area (BSA) Calculator?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Body Surface Area (BSA) Calculator is a clinical tool used to estimate the total external surface area of the human body, expressed in square meters (m²). BSA is a fundamental physiological parameter that correlates with various metabolic processes, including heat exchange, oxygen consumption, and renal function. Unlike body weight or height alone, BSA provides a more comprehensive measure of body size, which is crucial for accurate medical assessments and interventions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator employs the Mosteller formula, a widely accepted and validated method for estimating BSA. The formula calculates BSA by taking the square root of the product of height (in centimeters) and weight (in kilograms) divided by 3600. Its simplicity and accuracy have made it the preferred choice in many healthcare settings across Canada, the United States, and internationally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          BSA is extensively used in clinical practice to tailor drug dosages, particularly for chemotherapeutic agents and other medications with narrow therapeutic indices. It also plays a role in calculating cardiac output indices, assessing renal function through glomerular filtration rate (GFR) adjustments, and evaluating metabolic rates. By providing a standardized measure of body size, the BSA Calculator helps healthcare professionals optimize treatment plans and improve patient safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator defaults to imperial units (pounds, feet, inches) to accommodate users in the US and Canada, but it also supports metric units (kilograms, centimeters) for international users. This flexibility ensures accessibility and ease of use across diverse healthcare environments.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Body Surface Area Calculator is straightforward and requires only two inputs: your weight and height. Follow these steps to obtain an accurate BSA estimate:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select the Unit System:</strong> Choose between Imperial (pounds, feet, inches) or Metric (kilograms, centimeters) units using the dropdown menu. The calculator will automatically convert values if you switch units after entering data.
          </li>
          <li>
            <strong>Enter Your Weight:</strong> Input your weight in the selected unit system. For imperial units, enter pounds; for metric, enter kilograms. Ensure the value is positive and accurate.
          </li>
          <li>
            <strong>Enter Your Height:</strong> For imperial units, provide your height in feet and inches separately. For metric units, enter your height in centimeters. Accurate height measurement is essential for precise BSA calculation.
          </li>
          <li>
            <strong>Calculate:</strong> Click the "Calculate" button to compute your BSA. The result will display in square meters (m²) with two decimal precision.
          </li>
          <li>
            <strong>Reset:</strong> Use the "Reset" button to clear all inputs and start a new calculation.
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
          Trusted References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4289444/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987 Oct 22;317(17):1098.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              The original publication introducing the Mosteller formula for BSA calculation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK538336/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Body Surface Area Calculator - Medscape
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of BSA and its clinical applications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cancer.gov/about-cancer/treatment/drugs/dose-calculation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Cancer Institute - Drug Dose Calculations
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Explanation of how BSA is used to calculate chemotherapy dosages.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kidney.org/atoz/content/gfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Kidney Foundation - Glomerular Filtration Rate (GFR)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Discusses the role of BSA in adjusting kidney function measurements.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Surface Area (BSA) Calculator"
      description="Calculate Body Surface Area (BSA) accurately. Essential for determining medical dosages and assessing metabolic parameters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "BSA (m²) = √([Height(cm) × Weight(kg)] / 3600)",
        variables: [
          {
            symbol: "Height(cm)",
            description: "Height in centimeters",
          },
          {
            symbol: "Weight(kg)",
            description: "Weight in kilograms",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 5 ft 8 in (68 inches) tall adult weighing 150 lbs wants to calculate their BSA.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to centimeters: 68 inches × 2.54 = 172.72 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.45359237 = 68.04 kg.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the Mosteller formula: √((172.72 × 68.04) / 3600) ≈ √(3,717.5 / 3600) ≈ √1.0326 ≈ 1.02 m².",
          },
        ],
        result: "The individual's estimated BSA is approximately 1.02 m².",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Body Surface Area (BSA) Calculator?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}