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

export default function WaistToHeightRatioCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    waistInches?: number;
    waistCm?: number;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
  }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    let waistCm: number | undefined;
    let heightCm: number | undefined;

    if (unit === "imperial") {
      if (
        inputs.waistInches === undefined ||
        inputs.heightFeet === undefined ||
        inputs.heightInches === undefined
      )
        return { value: 0, label: "", category: "" };

      waistCm = inputs.waistInches * 2.54;
      heightCm = (inputs.heightFeet * 12 + inputs.heightInches) * 2.54;
    } else {
      if (inputs.waistCm === undefined || inputs.heightCm === undefined)
        return { value: 0, label: "", category: "" };

      waistCm = inputs.waistCm;
      heightCm = inputs.heightCm;
    }

    if (waistCm <= 0 || heightCm <= 0) return { value: 0, label: "", category: "" };

    const ratio = waistCm / heightCm;
    const roundedRatio = Math.round(ratio * 1000) / 1000; // 3 decimals

    // Interpretation based on WHtR cutoffs (adults)
    // Common thresholds:
    // <0.40 = underweight (not typical)
    // 0.40–0.49 = healthy/low risk
    // 0.50–0.59 = increased risk
    // ≥0.60 = high risk
    // Source: Ashwell et al., 2012; WHO guidelines

    let label = "";
    let category = "";

    if (roundedRatio < 0.40) {
      label = "Below typical healthy range";
      category = "Underweight / Low Risk";
    } else if (roundedRatio >= 0.40 && roundedRatio < 0.50) {
      label = "Healthy waist-to-height ratio";
      category = "Low Risk";
    } else if (roundedRatio >= 0.50 && roundedRatio < 0.60) {
      label = "Increased health risk";
      category = "Moderate Risk";
    } else if (roundedRatio >= 0.60) {
      label = "High health risk";
      category = "High Risk";
    } else {
      label = "Invalid result";
      category = "";
    }

    return {
      value: roundedRatio.toFixed(3),
      label,
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Waist-to-Height Ratio and why is it important?",
      answer:
        "The Waist-to-Height Ratio (WHtR) is a simple measurement that compares your waist circumference to your height. It serves as an indicator of central obesity, which is the accumulation of fat around the abdomen. This ratio is a strong predictor of cardiovascular and metabolic health risks, often outperforming Body Mass Index (BMI) in identifying individuals at risk for conditions like heart disease, type 2 diabetes, and hypertension. Maintaining a healthy WHtR can help reduce these risks and promote overall well-being.",
    },
    {
      question: "How do I interpret my Waist-to-Height Ratio result?",
      answer:
        "A WHtR below 0.50 is generally considered healthy and indicates a lower risk of cardiovascular and metabolic diseases. Ratios between 0.50 and 0.59 suggest increased health risks, while a ratio of 0.60 or higher indicates a high risk of obesity-related health problems. These thresholds apply broadly to adults regardless of gender or ethnicity, making WHtR a versatile screening tool. However, always consult healthcare professionals for personalized assessments.",
    },
    {
      question: "Are there any limitations to using Waist-to-Height Ratio?",
      answer:
        "While WHtR is a valuable screening tool, it does not replace comprehensive health evaluations. It does not account for muscle mass, bone density, or fat distribution nuances beyond the waist area. Additionally, it may be less accurate for certain populations such as pregnant women, children, or individuals with specific medical conditions. It is best used alongside other assessments and clinical judgment for a full picture of health.",
    },
    {
      question: "Can Waist-to-Height Ratio be used for children and adolescents?",
      answer:
        "WHtR can be used for children and adolescents, but interpretation requires age- and sex-specific percentiles due to growth and development variations. Research suggests that a WHtR cutoff of around 0.50 may also indicate increased risk in youth, but pediatric-specific guidelines should be followed. Always consult pediatric healthcare providers for accurate assessment and guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field:
      | "waistInches"
      | "waistCm"
      | "heightFeet"
      | "heightInches"
      | "heightCm",
    value: string
  ) {
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) || num < 0 ? undefined : num,
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
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
          <>
            <div>
              <Label htmlFor="waistInches" className="text-slate-700 dark:text-slate-300">
                Waist Circumference (inches)
              </Label>
              <Input
                id="waistInches"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 32.5"
                value={inputs.waistInches ?? ""}
                onChange={(e) => handleInputChange("waistInches", e.target.value)}
                aria-describedby="waistHelp"
              />
              <p
                id="waistHelp"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                Measure around your natural waist, just above the belly button.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                  Height (feet)
                </Label>
                <Input
                  id="heightFeet"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="e.g. 5"
                  value={inputs.heightFeet ?? ""}
                  onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                  Height (inches)
                </Label>
                <Input
                  id="heightInches"
                  type="number"
                  min={0}
                  max={11}
                  step={0.1}
                  placeholder="e.g. 10"
                  value={inputs.heightInches ?? ""}
                  onChange={(e) => handleInputChange("heightInches", e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="waistCm" className="text-slate-700 dark:text-slate-300">
                Waist Circumference (cm)
              </Label>
              <Input
                id="waistCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 82.5"
                value={inputs.waistCm ?? ""}
                onChange={(e) => handleInputChange("waistCm", e.target.value)}
                aria-describedby="waistHelpMetric"
              />
              <p
                id="waistHelpMetric"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                Measure around your natural waist, just above the belly button.
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
                step={0.1}
                placeholder="e.g. 178"
                value={inputs.heightCm ?? ""}
                onChange={(e) => handleInputChange("heightCm", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Waist-to-Height Ratio"
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
          What is the Waist-to-Height Ratio Checker?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Waist-to-Height Ratio (WHtR) Checker is a specialized health tool designed to assess the distribution of body fat, particularly around the abdomen, by comparing the circumference of your waist to your height. Unlike Body Mass Index (BMI), which only considers weight relative to height, WHtR focuses on central obesity, a key risk factor for cardiovascular diseases, type 2 diabetes, and metabolic syndrome. This ratio provides a more direct insight into fat accumulation in the abdominal area, which is strongly linked to adverse health outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          WHtR is calculated by dividing waist circumference by height, both measured in the same units. This simple metric has gained prominence because it is easy to measure, does not require expensive equipment, and offers a reliable indicator of health risks across different populations, ages, and ethnicities. Research has shown that WHtR often outperforms BMI and waist circumference alone in predicting cardiovascular risk, making it a valuable screening tool in clinical and public health settings.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The checker uses thresholds to categorize your health risk based on your WHtR value. Generally, a ratio below 0.50 is considered healthy, while higher values indicate increasing risk levels. These cutoffs are supported by extensive epidemiological studies and are applicable to both men and women, simplifying health messaging and risk stratification. By monitoring your WHtR, you can gain actionable insights into your health and take steps to reduce risk through lifestyle changes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is particularly useful for individuals who want a quick, accurate assessment of their central obesity risk without complex calculations or clinical tests. It complements other health metrics and should be used as part of a comprehensive approach to health management, including regular medical check-ups, diet, exercise, and other lifestyle factors.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Waist-to-Height Ratio Checker is straightforward and requires only two measurements: your waist circumference and your height. Follow these steps to ensure accurate results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Measure Your Waist Circumference:</strong> Use a flexible tape measure to measure around your natural waist, which is typically located just above the belly button and below the rib cage. Ensure the tape is snug but not compressing the skin, and measure at the end of a normal exhalation.
          </li>
          <li>
            <strong>Measure Your Height:</strong> Stand straight against a wall without shoes, and measure your height using a tape measure or stadiometer. For imperial units, input your height in feet and inches; for metric, input in centimeters.
          </li>
          <li>
            <strong>Select Your Unit System:</strong> Choose between Imperial (inches, feet) or Metric (centimeters) units using the dropdown selector. The calculator will automatically convert and compute your WHtR accordingly.
          </li>
          <li>
            <strong>Calculate and Interpret:</strong> Click the "Calculate" button to see your Waist-to-Height Ratio along with an interpretation of your health risk category. Use this information to guide lifestyle choices or consult a healthcare professional for further evaluation.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3506223/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Ashwell M, Gibson S. Waist-to-height ratio as an indicator of 'early health risk': simpler and more predictive than using a 'matrix' based on BMI and waist circumference. BMJ Open. 2016;6(3):e010159.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              This study highlights the predictive power of WHtR over BMI and waist circumference for early health risk detection.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.who.int/publications/i/item/9789241501491"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. World Health Organization. Waist Circumference and Waist–Hip Ratio: Report of a WHO Expert Consultation. 2011.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              WHO expert consultation report providing guidelines on waist circumference and WHtR for assessing obesity-related health risks.
            </p>
          </li>
          <li className="block">
            <a
              href="https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1106086"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Schneider HJ, et al. The predictive value of different measures of obesity for incident cardiovascular events and mortality. JAMA Intern Med. 2010;170(14):1281-1287.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              This paper compares WHtR with other obesity measures in predicting cardiovascular events and mortality.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/obesity/adult/defining.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Centers for Disease Control and Prevention (CDC). Defining Adult Overweight and Obesity. 2023.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official CDC resource defining obesity metrics and their health implications in the US context.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Waist-to-Height Ratio Checker"
      description="Calculate your Waist-to-Height Ratio (WHtR). Use this simple yet effective metric to assess central obesity and cardiovascular health risks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "WHtR = Waist Circumference ÷ Height",
        variables: [
          {
            symbol: "Waist Circumference",
            description:
              "The measurement around your natural waist, typically just above the belly button, in the same units as height.",
          },
          {
            symbol: "Height",
            description:
              "Your total height measured in the same units as waist circumference.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John is 5 feet 10 inches tall and has a waist circumference of 34 inches. He wants to know his Waist-to-Height Ratio to assess his health risk.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert John's height to inches: (5 × 12) + 10 = 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate WHtR: Waist (34 inches) ÷ Height (70 inches) = 0.486.",
          },
        ],
        result:
          "John's WHtR is 0.486, which falls within the healthy range (<0.50), indicating a low risk of central obesity-related health issues.",
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
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Waist-to-Height Ratio Checker?" },
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