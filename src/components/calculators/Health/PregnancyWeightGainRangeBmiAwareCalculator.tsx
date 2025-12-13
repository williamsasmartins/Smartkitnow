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
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Inputs = {
  heightFt?: number;
  heightIn?: number;
  weightLbs?: number;
  prePregnancyWeightLbs?: number;
  heightCm?: number;
  weightKg?: number;
  prePregnancyWeightKg?: number;
};

export default function PregnancyWeightGainRangeBmiAwareCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<Inputs>({});

  // Helper: Convert height ft/in to meters
  function heightToMeters(ft?: number, inch?: number) {
    if (ft == null && inch == null) return undefined;
    const totalInches = (ft ?? 0) * 12 + (inch ?? 0);
    return totalInches * 0.0254;
  }

  // Helper: Convert lbs to kg
  function lbsToKg(lbs?: number) {
    if (lbs == null) return undefined;
    return lbs * 0.45359237;
  }

  // Helper: Convert kg to lbs
  function kgToLbs(kg?: number) {
    if (kg == null) return undefined;
    return kg / 0.45359237;
  }

  // 2. LOGIC
  /**
   * Pregnancy Weight Gain Recommendations by Pre-pregnancy BMI (Institute of Medicine 2009):
   * 
   * BMI Categories (kg/m²) and Recommended Total Weight Gain (lbs):
   * - Underweight (<18.5): 28-40 lbs (12.5-18 kg)
   * - Normal weight (18.5-24.9): 25-35 lbs (11.5-16 kg)
   * - Overweight (25-29.9): 15-25 lbs (7-11.5 kg)
   * - Obese (≥30): 11-20 lbs (5-9 kg)
   * 
   * This calculator uses pre-pregnancy BMI to recommend a healthy total pregnancy weight gain range.
   */

  const results = useMemo(() => {
    // Validate inputs
    let heightM: number | undefined;
    let prePregWeightKg: number | undefined;

    if (unit === "imperial") {
      heightM = heightToMeters(inputs.heightFt, inputs.heightIn);
      prePregWeightKg = lbsToKg(inputs.prePregnancyWeightLbs);
    } else {
      heightM = inputs.heightCm ? inputs.heightCm / 100 : undefined;
      prePregWeightKg = inputs.prePregnancyWeightKg;
    }

    if (!heightM || !prePregWeightKg) {
      return { value: 0, label: "Please enter valid height and pre-pregnancy weight.", category: "" };
    }

    // Calculate BMI
    const bmi = prePregWeightKg / (heightM * heightM);

    // Determine category and weight gain range (lbs)
    let gainMinLbs = 0;
    let gainMaxLbs = 0;
    let category = "";

    if (bmi < 18.5) {
      gainMinLbs = 28;
      gainMaxLbs = 40;
      category = "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      gainMinLbs = 25;
      gainMaxLbs = 35;
      category = "Normal weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
      gainMinLbs = 15;
      gainMaxLbs = 25;
      category = "Overweight";
    } else if (bmi >= 30) {
      gainMinLbs = 11;
      gainMaxLbs = 20;
      category = "Obese";
    } else {
      return { value: 0, label: "BMI out of range for recommendations.", category: "" };
    }

    // Format result string with range
    const resultStr = `${gainMinLbs} - ${gainMaxLbs} lbs`;

    return {
      value: resultStr,
      label: `Recommended Total Pregnancy Weight Gain for BMI ${bmi.toFixed(1)} (${category})`,
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Pregnancy Weight-Gain Range (BMI-aware)?",
      answer:
        "The Pregnancy Weight-Gain Range (BMI-aware) calculator provides personalized recommendations for total weight gain during pregnancy based on a woman's pre-pregnancy Body Mass Index (BMI). This approach recognizes that healthy weight gain varies depending on whether a woman is underweight, normal weight, overweight, or obese before pregnancy. By tailoring guidance to BMI categories, it helps optimize maternal and fetal health outcomes.",
    },
    {
      question: "How should I interpret the recommended weight gain range?",
      answer:
        "The recommended weight gain range represents the total amount of weight a woman should ideally gain throughout her entire pregnancy. Staying within this range supports fetal growth and development while minimizing risks such as gestational diabetes, hypertension, and delivery complications. It is important to consult healthcare providers for personalized advice and to monitor weight gain progress regularly.",
    },
    {
      question: "Are there limitations to using BMI for pregnancy weight gain recommendations?",
      answer:
        "Yes, BMI is a useful but imperfect measure that does not distinguish between muscle and fat mass or account for body composition variations. Additionally, factors such as age, ethnicity, metabolic health, and multiple pregnancies can influence optimal weight gain. Therefore, while BMI-based guidelines provide a valuable framework, individualized clinical assessment remains essential.",
    },
    {
      question: "Can I use this calculator if I am pregnant with twins or multiples?",
      answer:
        "This calculator is designed for singleton pregnancies and does not account for the increased nutritional and weight gain needs associated with twins or higher-order multiples. Women expecting multiples typically require higher weight gain targets. It is recommended to consult a healthcare provider for tailored guidance in such cases.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Inputs
  ) {
    const val = e.target.value;
    if (val === "") {
      setInputs((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      setInputs((prev) => ({ ...prev, [field]: num }));
    }
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
          <Select
            value={unit}
            onValueChange={(val) => {
              setUnit(val as "imperial" | "metric");
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
          <>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300">
                  Height (ft)
                </Label>
                <Input
                  id="heightFt"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="5"
                  value={inputs.heightFt ?? ""}
                  onChange={(e) => onInputChange(e, "heightFt")}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300">
                  Height (in)
                </Label>
                <Input
                  id="heightIn"
                  type="number"
                  min={0}
                  max={11}
                  step={1}
                  placeholder="6"
                  value={inputs.heightIn ?? ""}
                  onChange={(e) => onInputChange(e, "heightIn")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="prePregnancyWeightLbs" className="text-slate-700 dark:text-slate-300">
                Pre-pregnancy Weight (lbs)
              </Label>
              <Input
                id="prePregnancyWeightLbs"
                type="number"
                min={0}
                step={0.1}
                placeholder="140"
                value={inputs.prePregnancyWeightLbs ?? ""}
                onChange={(e) => onInputChange(e, "prePregnancyWeightLbs")}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
                Height (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="170"
                value={inputs.heightCm ?? ""}
                onChange={(e) => onInputChange(e, "heightCm")}
              />
            </div>
            <div>
              <Label htmlFor="prePregnancyWeightKg" className="text-slate-700 dark:text-slate-300">
                Pre-pregnancy Weight (kg)
              </Label>
              <Input
                id="prePregnancyWeightKg"
                type="number"
                min={0}
                step={0.1}
                placeholder="63.5"
                value={inputs.prePregnancyWeightKg ?? ""}
                onChange={(e) => onInputChange(e, "prePregnancyWeightKg")}
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
            // Just trigger re-render, calculation is memoized on inputs
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
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
          What is the Pregnancy Weight-Gain Range (BMI-aware)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pregnancy Weight-Gain Range (BMI-aware) is a guideline that helps expectant mothers understand the optimal amount of weight they should gain during pregnancy based on their pre-pregnancy Body Mass Index (BMI). BMI is a widely used measure that relates weight to height and categorizes individuals as underweight, normal weight, overweight, or obese. This calculator uses these BMI categories to provide personalized recommendations for healthy weight gain during pregnancy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Weight gain during pregnancy is essential to support the growth and development of the fetus, placenta, amniotic fluid, and maternal tissues. However, gaining too little or too much weight can lead to adverse outcomes such as low birth weight, preterm birth, gestational diabetes, hypertension, and delivery complications. The Institute of Medicine (IOM) and Health Canada have established evidence-based guidelines that recommend different weight gain ranges depending on a woman’s BMI before pregnancy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For example, women who are underweight before pregnancy are advised to gain more weight to support fetal growth, while women who are obese are recommended to gain less to reduce risks associated with excessive weight gain. This BMI-aware approach ensures that weight gain recommendations are tailored to individual health profiles, promoting better outcomes for both mother and baby.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator provides a simple and accessible way to estimate your recommended total pregnancy weight gain range based on your height and pre-pregnancy weight. It is important to remember that these are general guidelines and that individual circumstances may vary. Regular prenatal care and consultation with healthcare providers are essential for personalized advice and monitoring.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Pregnancy Weight-Gain Range calculator is straightforward and requires only a few key pieces of information. Follow these steps to get your personalized recommended weight gain range:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select your preferred unit system:</strong> Choose between Imperial (feet, inches, pounds) or Metric (centimeters, kilograms) units based on your familiarity and location.
          </li>
          <li>
            <strong>Enter your height:</strong> Provide your height before pregnancy. In Imperial units, enter feet and inches separately; in Metric, enter centimeters.
          </li>
          <li>
            <strong>Enter your pre-pregnancy weight:</strong> Input your weight before becoming pregnant. Use pounds for Imperial or kilograms for Metric.
          </li>
          <li>
            <strong>Calculate:</strong> Click the Calculate button to see your recommended total pregnancy weight gain range based on your BMI category.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Remember that this calculator provides general guidance. It does not replace professional medical advice. Regular prenatal visits are crucial to monitor your health and weight gain progress throughout pregnancy.
        </p>
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
              href="https://www.nichd.nih.gov/health/topics/pregnancy/conditioninfo/weight-gain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on pregnancy weight gain and maternal health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/reproductivehealth/maternalinfanthealth/pregnancy-weight-gain.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - Pregnancy Weight Gain
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Evidence-based recommendations and risks associated with pregnancy weight gain.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.canada.ca/en/public-health/services/pregnancy/weight-gain-during-pregnancy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Government of Canada - Weight Gain During Pregnancy
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Canadian guidelines and advice on healthy weight gain during pregnancy.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2907136/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Institute of Medicine (IOM) Report - Weight Gain During Pregnancy: Reexamining the Guidelines (2009)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative scientific report establishing BMI-based pregnancy weight gain recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pregnancy Weight-Gain Range (BMI-aware)"
      description="Monitor healthy pregnancy weight gain. Get recommended weight ranges based on your pre-pregnancy BMI for a healthy baby and mom."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight (kg)", description: "Pre-pregnancy weight in kilograms" },
          { symbol: "height (m)", description: "Height in meters" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A woman who is 5 ft 6 in tall and weighs 140 lbs before pregnancy wants to know her recommended pregnancy weight gain range.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to meters: 5 ft 6 in = 66 inches × 0.0254 = 1.68 m",
          },
          {
            label: "Step 2",
            explanation:
              "Convert weight to kilograms: 140 lbs × 0.4536 = 63.5 kg",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate BMI: 63.5 / (1.68)² = 22.5 (Normal weight category)",
          },
          {
            label: "Step 4",
            explanation:
              "Recommended weight gain range: 25 - 35 lbs based on BMI category",
          },
        ],
        result:
          "The woman should aim to gain between 25 and 35 lbs during her pregnancy for optimal health outcomes.",
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
        { id: "what-is", label: "What is Pregnancy Weight-Gain Range (BMI-aware)?" },
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