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

function roundToOneDecimal(num: number) {
  return Math.round(num * 10) / 10;
}

export default function IdealWeightRangeHamwiDevineMillerCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    gender: "male" | "female" | "";
    heightFeet: string;
    heightInches: string;
    heightCm: string;
  }>({
    gender: "",
    heightFeet: "",
    heightInches: "",
    heightCm: "",
  });

  // 2. LOGIC
  /**
   * Formulas:
   * Hamwi:
   *   Male: 106 lbs for first 5 ft + 6 lbs per inch over 5 ft
   *   Female: 100 lbs for first 5 ft + 5 lbs per inch over 5 ft
   *
   * Devine:
   *   Male: 50 kg for first 5 ft + 2.3 kg per inch over 5 ft
   *   Female: 45.5 kg for first 5 ft + 2.3 kg per inch over 5 ft
   *
   * Miller:
   *   Male: 56.2 kg for first 5 ft + 1.41 kg per inch over 5 ft
   *   Female: 53.1 kg for first 5 ft + 1.36 kg per inch over 5 ft
   *
   * We will convert all results to lbs for display consistency.
   */

  const results = useMemo(() => {
    if (!inputs.gender) return null;

    let heightInches: number | null = null;

    if (unit === "imperial") {
      const feet = parseInt(inputs.heightFeet);
      const inches = parseInt(inputs.heightInches || "0");
      if (
        isNaN(feet) ||
        feet < 4 || // minimum reasonable height 4 ft
        feet > 8 || // max reasonable height 8 ft
        isNaN(inches) ||
        inches < 0 ||
        inches >= 12
      )
        return null;
      heightInches = feet * 12 + inches;
    } else {
      // metric input in cm
      const cm = parseFloat(inputs.heightCm);
      if (isNaN(cm) || cm < 120 || cm > 250) return null; // reasonable height range
      heightInches = cm / 2.54;
    }

    if (heightInches < 60) {
      // formulas start at 5 ft (60 inches)
      // For heights below 5 ft, formulas are not defined well; we can extrapolate or show N/A
      return null;
    }

    const inchesOver5ft = heightInches - 60;

    // Hamwi (lbs)
    const hamwi =
      inputs.gender === "male"
        ? 106 + 6 * inchesOver5ft
        : 100 + 5 * inchesOver5ft;

    // Devine (kg)
    const devineKg =
      (inputs.gender === "male" ? 50 : 45.5) + 2.3 * inchesOver5ft;
    const devineLbs = devineKg * 2.20462;

    // Miller (kg)
    const millerKg =
      (inputs.gender === "male" ? 56.2 : 53.1) + (inputs.gender === "male" ? 1.41 : 1.36) * inchesOver5ft;
    const millerLbs = millerKg * 2.20462;

    // Return rounded results in lbs (imperial) or kg (metric)
    if (unit === "imperial") {
      return {
        hamwi: roundToOneDecimal(hamwi),
        devine: roundToOneDecimal(devineLbs),
        miller: roundToOneDecimal(millerLbs),
      };
    } else {
      // Convert lbs back to kg for metric display
      return {
        hamwi: roundToOneDecimal(hamwi / 2.20462),
        devine: roundToOneDecimal(devineKg),
        miller: roundToOneDecimal(millerKg),
      };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Ideal Weight Range (Hamwi/Devine/Miller) method?",
      answer:
        "The Ideal Weight Range calculated by Hamwi, Devine, and Miller formulas provides estimates of healthy body weight based on height and gender. These formulas were developed to help clinicians and individuals set realistic weight goals by considering physiological differences between males and females. Each formula uses a slightly different approach and constants, but all aim to approximate an ideal or healthy weight range rather than a strict target.",
    },
    {
      question: "How should I interpret the results from these formulas?",
      answer:
        "The results represent estimated ideal weights for your height and gender. They are guidelines rather than absolute values. Differences between formulas reflect variations in population samples and assumptions. Use these results as a starting point for healthy weight goals, but consider other factors such as body composition, muscle mass, and overall health. Always consult healthcare professionals for personalized advice.",
    },
    {
      question: "What are the limitations of the Hamwi, Devine, and Miller formulas?",
      answer:
        "These formulas do not account for body composition, ethnicity, age, or muscle mass, which can significantly affect healthy weight. They are less accurate for individuals under 5 feet tall or over 8 feet tall, and for children or elderly populations. Additionally, they do not replace clinical assessments or more comprehensive evaluations like BMI, body fat percentage, or metabolic health markers.",
    },
    {
      question: "Can these formulas be used for all populations?",
      answer:
        "While widely used in North America and internationally, these formulas were primarily developed based on adult Caucasian populations and may not be fully accurate for all ethnic groups or age ranges. They are best used as general guidelines and should be supplemented with other health assessments tailored to individual circumstances.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetInputs = () => {
    setInputs({ gender: "", heightFeet: "", heightInches: "", heightCm: "" });
  };

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
              resetInputs();
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

        {/* Gender */}
        <div>
          <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">
            Gender
          </Label>
          <select
            id="gender"
            name="gender"
            value={inputs.gender}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Height Inputs */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label
                htmlFor="heightFeet"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                name="heightFeet"
                type="number"
                min={4}
                max={8}
                placeholder="e.g. 5"
                value={inputs.heightFeet}
                onChange={onInputChange}
                aria-describedby="heightFeetHelp"
              />
              <p
                id="heightFeetHelp"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                Between 4 and 8 feet
              </p>
            </div>
            <div className="flex-1">
              <Label
                htmlFor="heightInches"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                name="heightInches"
                type="number"
                min={0}
                max={11}
                placeholder="e.g. 7"
                value={inputs.heightInches}
                onChange={onInputChange}
                aria-describedby="heightInchesHelp"
              />
              <p
                id="heightInchesHelp"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                0 to 11 inches
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="heightCm"
              className="text-slate-700 dark:text-slate-300"
            >
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              name="heightCm"
              type="number"
              min={120}
              max={250}
              placeholder="e.g. 170"
              value={inputs.heightCm}
              onChange={onInputChange}
              aria-describedby="heightCmHelp"
            />
            <p
              id="heightCmHelp"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Between 120 cm and 250 cm
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          disabled={
            !inputs.gender ||
            (unit === "imperial"
              ? !inputs.heightFeet ||
                !inputs.heightInches ||
                isNaN(Number(inputs.heightFeet)) ||
                isNaN(Number(inputs.heightInches))
              : !inputs.heightCm || isNaN(Number(inputs.heightCm)))
          }
          aria-label="Calculate Ideal Weight Range"
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
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Ideal Weight Range
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-blue-900 dark:text-white mb-1">
                    Hamwi
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.hamwi} {unit === "imperial" ? "lbs" : "kg"}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-900 dark:text-white mb-1">
                    Devine
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.devine} {unit === "imperial" ? "lbs" : "kg"}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-900 dark:text-white mb-1">
                    Miller
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.miller} {unit === "imperial" ? "lbs" : "kg"}
                  </p>
                </div>
              </div>
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
          What is the Ideal Weight Range (Hamwi/Devine/Miller)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ideal Weight Range calculated by the Hamwi, Devine, and Miller
          formulas represents clinically developed estimates of a healthy body
          weight based on an individual's height and gender. These formulas
          were originally designed to assist healthcare professionals in
          determining appropriate weight targets for patients, particularly in
          contexts such as dosing medications or assessing nutritional status.
          Unlike body mass index (BMI), which considers weight relative to
          height squared, these formulas provide a more direct weight estimate
          tailored to height increments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each formula uses a slightly different approach and constants derived
          from population studies. The Hamwi formula, developed in the 1960s,
          is one of the earliest and most widely used, providing a simple
          calculation based on height over 5 feet. The Devine formula, created
          in 1974, was initially intended for calculating drug dosages in
          obese patients and uses metric units with a slightly different
          baseline. The Miller formula, introduced later, offers an
          alternative with adjusted constants to better fit certain
          populations. Together, these formulas offer a range of estimates to
          help individuals and clinicians set realistic and healthy weight
          goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that these formulas provide guidelines rather
          than absolute targets. They do not account for variations in muscle
          mass, bone density, age, ethnicity, or overall body composition.
          Therefore, while useful as a starting point, they should be
          considered alongside other health indicators and professional
          medical advice to determine an individual's optimal weight range.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          In clinical practice, these formulas are often used in conjunction
          with other assessments such as BMI, waist circumference, and body fat
          percentage measurements to provide a comprehensive picture of health
          and nutritional status. They remain valuable tools in both
          healthcare and personal wellness contexts for setting achievable and
          healthy weight goals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to estimate your ideal weight range using
          three well-known formulas: Hamwi, Devine, and Miller. To use it
          effectively, follow these steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select your preferred unit system:</strong> Choose between
            Imperial (pounds, feet, inches) commonly used in the US and Canada,
            or Metric (kilograms, centimeters) used internationally.
          </li>
          <li>
            <strong>Enter your gender:</strong> Select male or female, as the
            formulas use different constants based on gender.
          </li>
          <li>
            <strong>Input your height:</strong> Provide your height in feet and
            inches if using Imperial units, or centimeters if using Metric.
            Ensure the values are within reasonable ranges for accuracy.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see your
            ideal weight estimates according to each formula.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          The results will display your ideal weight in pounds or kilograms,
          depending on your selected unit system. Use these values as a guide to
          understand healthy weight ranges for your height and gender. Remember
          to consider other health factors and consult healthcare professionals
          for personalized advice.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997403/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Center for Biotechnology Information (NCBI) - Ideal
              Body Weight Formulas
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive review of ideal body weight formulas including
              Hamwi, Devine, and Miller.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997403/#:~:text=The%20Hamwi%20formula%20was%20developed%20in%201969%20to%20estimate,for%20drug%20dosing%20in%20obese%20patients."
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Devine Formula Origin and Usage - NCBI
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Details on the development and clinical application of the Devine
              formula.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Miller Formula and Clinical Applications - NCBI Bookshelf
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Overview of the Miller formula and its use in clinical nutrition.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Centers for Disease Control and Prevention (CDC) - Healthy
              Weight Assessment
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Guidelines on healthy weight assessment and the role of BMI and
              other measures.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ideal Weight Range (Hamwi/Devine/Miller)"
      description="Discover your ideal weight range. Compare results from Hamwi, Devine, and Miller formulas to set realistic and healthy weight goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: `
          Hamwi (lbs):
            Male: 106 + 6 × (height in inches - 60)
            Female: 100 + 5 × (height in inches - 60)

          Devine (kg):
            Male: 50 + 2.3 × (height in inches - 60)
            Female: 45.5 + 2.3 × (height in inches - 60)

          Miller (kg):
            Male: 56.2 + 1.41 × (height in inches - 60)
            Female: 53.1 + 1.36 × (height in inches - 60)
        `,
        variables: [
          {
            symbol: "height in inches",
            description:
              "Your height converted entirely into inches (feet × 12 + inches).",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 5 ft 7 in (67 inches) tall female wants to find her ideal weight range.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate inches over 5 ft: 67 - 60 = 7 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply each formula:\n- Hamwi: 100 + 5 × 7 = 135 lbs\n- Devine: 45.5 + 2.3 × 7 = 61.6 kg (~136 lbs)\n- Miller: 53.1 + 1.36 × 7 = 62.6 kg (~138 lbs)",
          },
        ],
        result:
          "Ideal weight range is approximately 135 to 138 lbs (61.6 to 62.6 kg) depending on the formula used.",
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
        {
          id: "what-is",
          label: "What is Ideal Weight Range (Hamwi/Devine/Miller)?",
        },
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