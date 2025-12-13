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

export default function BmiBodyMassIndexCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weightLbs?: string;
    heightFt?: string;
    heightIn?: string;
    weightKg?: string;
    heightCm?: string;
  }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    let bmiValue = 0;
    let label = "";
    let category = "";

    if (unit === "imperial") {
      const weight = parseFloat(inputs.weightLbs || "");
      const heightFt = parseFloat(inputs.heightFt || "");
      const heightIn = parseFloat(inputs.heightIn || "");
      if (
        !isNaN(weight) &&
        weight > 0 &&
        !isNaN(heightFt) &&
        heightFt >= 0 &&
        !isNaN(heightIn) &&
        heightIn >= 0
      ) {
        const totalInches = heightFt * 12 + heightIn;
        if (totalInches > 0) {
          bmiValue = (weight / (totalInches * totalInches)) * 703;
        }
      }
    } else {
      // metric
      const weight = parseFloat(inputs.weightKg || "");
      const heightCm = parseFloat(inputs.heightCm || "");
      if (
        !isNaN(weight) &&
        weight > 0 &&
        !isNaN(heightCm) &&
        heightCm > 0
      ) {
        const heightM = heightCm / 100;
        bmiValue = weight / (heightM * heightM);
      }
    }

    if (bmiValue > 0) {
      bmiValue = Math.round(bmiValue * 10) / 10; // 1 decimal place

      // BMI Categories (CDC/WHO)
      if (bmiValue < 18.5) {
        label = "Underweight";
        category = "Underweight";
      } else if (bmiValue < 25) {
        label = "Normal weight";
        category = "Healthy";
      } else if (bmiValue < 30) {
        label = "Overweight";
        category = "Overweight";
      } else {
        label = "Obese";
        category = "Obese";
      }
    }

    return { value: bmiValue, label, category };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "Body Mass Index (BMI) is a numerical value derived from an individual's weight and height. It provides a simple, widely-used method to categorize weight status and assess potential health risks associated with underweight, overweight, or obesity. While BMI does not directly measure body fat, it correlates with more direct measures and helps identify individuals who may benefit from further health evaluation or lifestyle changes.",
    },
    {
      question: "How do I interpret my BMI result?",
      answer:
        "BMI results fall into categories that indicate weight status: underweight (BMI < 18.5), normal or healthy weight (18.5–24.9), overweight (25–29.9), and obese (30 or greater). These categories help assess risk for conditions such as cardiovascular disease, diabetes, and certain cancers. However, BMI is a screening tool and should be interpreted alongside other health indicators and clinical assessments.",
    },
    {
      question: "What are the limitations of BMI?",
      answer:
        "BMI does not differentiate between muscle and fat mass, so very muscular individuals may be misclassified as overweight or obese. It also does not account for fat distribution, age, sex, or ethnicity differences. Therefore, BMI should not be used as the sole diagnostic tool but rather as part of a comprehensive health evaluation.",
    },
    {
      question: "Are there specific considerations for Canadian and US populations?",
      answer:
        "BMI categories are generally consistent across Canada and the US, following guidelines from health authorities like the CDC and Health Canada. However, some ethnic groups may have different health risk thresholds at given BMI values. For example, certain Asian populations may experience health risks at lower BMI values. It's important to consult healthcare providers for personalized assessment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    setInputs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

  // Calculate button triggers recalculation by updating state (no form submit)
  // Here, calculation is done on every render via useMemo, so no explicit trigger needed.

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit(value);
              setInputs({});
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
                value={inputs.weightLbs || ""}
                onChange={(e) => handleInputChange(e, "weightLbs")}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                value={inputs.heightFt || ""}
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
                placeholder="e.g. 7"
                value={inputs.heightIn || ""}
                onChange={(e) => handleInputChange(e, "heightIn")}
                aria-describedby="heightHelp"
              />
              <p id="heightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your height in feet and inches.
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
                value={inputs.weightKg || ""}
                onChange={(e) => handleInputChange(e, "weightKg")}
                aria-describedby="weightKgHelp"
              />
              <p id="weightKgHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                placeholder="e.g. 170"
                value={inputs.heightCm || ""}
                onChange={(e) => handleInputChange(e, "heightCm")}
                aria-describedby="heightCmHelp"
              />
              <p id="heightCmHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
            // No explicit action needed, calculation is reactive
            // But we can force a re-render by resetting inputs to current inputs
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate BMI"
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
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
          What is the BMI — Body Mass Index Calculator?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Body Mass Index (BMI) Calculator is a widely used tool that estimates an individual's body fat based on their weight and height. It provides a numerical value that helps categorize weight status into underweight, normal weight, overweight, or obese. This calculator uses either imperial units (pounds, feet, and inches) or metric units (kilograms and centimeters) to accommodate users primarily in the US and Canada, as well as internationally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          BMI is a simple, non-invasive screening method endorsed by major health organizations such as the Centers for Disease Control and Prevention (CDC) and Health Canada. While it does not directly measure body fat percentage, BMI correlates strongly with more precise body composition measurements and is an effective indicator of potential health risks associated with weight. It is commonly used in clinical settings, public health surveillance, and personal health monitoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator categorizes BMI values into ranges that reflect health risk levels. These categories help individuals and healthcare providers identify those who may be at increased risk for conditions like cardiovascular disease, type 2 diabetes, hypertension, and certain cancers. However, BMI should be interpreted alongside other health metrics and clinical evaluations for a comprehensive assessment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is especially relevant in Canada and the US, where obesity rates have been rising, contributing to increased healthcare burdens. By providing immediate feedback on BMI, this calculator empowers users to make informed decisions about their lifestyle, diet, and physical activity, promoting better long-term health outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this BMI calculator is straightforward and designed to accommodate your preferred measurement system. By default, it uses the imperial system (pounds, feet, and inches), which is common in the US and Canada. You can switch to metric units if desired. Follow these steps to calculate your BMI:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select Unit System:</strong> Choose between Imperial (lbs/ft/in) or Metric (kg/cm) using the dropdown at the top.
          </li>
          <li>
            <strong>Enter Weight:</strong> Input your current weight in pounds or kilograms, depending on the selected unit system.
          </li>
          <li>
            <strong>Enter Height:</strong> For imperial units, enter your height in feet and inches separately. For metric units, enter your height in centimeters.
          </li>
          <li>
            <strong>Calculate:</strong> Click the "Calculate" button to compute your BMI. The result will display your BMI value along with the corresponding weight category.
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
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Centers for Disease Control and Prevention (CDC) - About Adult BMI
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official CDC resource explaining BMI, its calculation, and interpretation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.canada.ca/en/public-health/services/health-promotion/healthy-living/your-health/bmi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Government of Canada - Body Mass Index (BMI)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Health Canada’s overview of BMI and its role in health assessment.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. World Health Organization (WHO) - Obesity and Overweight Fact Sheet
            </a>
            <p className="text-slate-500 text-sm mt-1">
              WHO’s global perspective on obesity, BMI categories, and health implications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://jamanetwork.com/journals/jama/fullarticle/1105944"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. JAMA - Clinical Guidelines on BMI and Health Risks
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Peer-reviewed article discussing BMI’s clinical utility and limitations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "BMI = (Weight / Height²) × Conversion Factor",
        variables: [
          {
            symbol: "Weight",
            description:
              "Your body weight (lbs in imperial, kg in metric).",
          },
          {
            symbol: "Height",
            description:
              "Your height (inches in imperial, meters in metric).",
          },
          {
            symbol: "Conversion Factor",
            description:
              "703 for imperial units to adjust for inches and pounds; 1 for metric units.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A person weighs 180 lbs and is 5 feet 10 inches tall. They want to know their BMI to assess their weight status.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to total inches: (5 × 12) + 10 = 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the BMI formula: BMI = (180 / 70²) × 703 = (180 / 4900) × 703 ≈ 25.8.",
          },
        ],
        result:
          "The BMI is approximately 25.8, which falls into the 'Overweight' category.",
      }}
      relatedCalculators={[
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "⚖️",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "❤️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "💧",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🥗",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is BMI — Body Mass Index Calculator?" },
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