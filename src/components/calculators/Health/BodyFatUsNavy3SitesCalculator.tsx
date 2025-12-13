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

export default function BodyFatUsNavy3SitesCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    gender: "male", // male or female
    height: "", // inches or cm
    neck: "", // inches or cm
    waist: "", // inches or cm
    hip: "", // inches or cm (only for female)
  });

  // Helper: convert to cm if imperial
  const toCm = (value: number) => (unit === "imperial" ? value * 2.54 : value);

  // 2. LOGIC
  const results = useMemo(() => {
    const { gender, height, neck, waist, hip } = inputs;
    if (
      !gender ||
      !height ||
      !neck ||
      !waist ||
      (gender === "female" && !hip)
    )
      return { value: 0, label: "", category: "" };

    // Parse inputs as floats
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hi = parseFloat(hip);

    if (
      isNaN(h) ||
      isNaN(n) ||
      isNaN(w) ||
      (gender === "female" && isNaN(hi)) ||
      h <= 0 ||
      n <= 0 ||
      w <= 0 ||
      (gender === "female" && hi <= 0)
    )
      return { value: 0, label: "", category: "" };

    // Convert all to cm for formula
    const heightCm = toCm(h);
    const neckCm = toCm(n);
    const waistCm = toCm(w);
    const hipCm = gender === "female" ? toCm(hi) : 0;

    // US Navy Body Fat % formulas:
    // Male: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    // Female: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387

    // Use Math.log10 for log base 10
    let bodyFat = 0;
    try {
      if (gender === "male") {
        const val = 86.010 * Math.log10(waistCm - neckCm) -
          70.041 * Math.log10(heightCm) +
          36.76;
        bodyFat = val;
      } else {
        const val = 163.205 * Math.log10(waistCm + hipCm - neckCm) -
          97.684 * Math.log10(heightCm) -
          78.387;
        bodyFat = val;
      }
    } catch {
      return { value: 0, label: "", category: "" };
    }

    // Clamp result between 2% and 60% for sanity
    const bfPercent = Math.min(Math.max(bodyFat, 2), 60);

    // Categorize body fat % based on American Council on Exercise (ACE) ranges
    // Male categories:
    // Essential fat: 2-5%
    // Athletes: 6-13%
    // Fitness: 14-17%
    // Average: 18-24%
    // Obese: 25%+
    // Female categories:
    // Essential fat: 10-13%
    // Athletes: 14-20%
    // Fitness: 21-24%
    // Average: 25-31%
    // Obese: 32%+

    let category = "";
    if (gender === "male") {
      if (bfPercent <= 5) category = "Essential Fat";
      else if (bfPercent <= 13) category = "Athletes";
      else if (bfPercent <= 17) category = "Fitness";
      else if (bfPercent <= 24) category = "Average";
      else category = "Obese";
    } else {
      if (bfPercent <= 13) category = "Essential Fat";
      else if (bfPercent <= 20) category = "Athletes";
      else if (bfPercent <= 24) category = "Fitness";
      else if (bfPercent <= 31) category = "Average";
      else category = "Obese";
    }

    return {
      value: bfPercent.toFixed(1),
      label: "Body Fat Percentage",
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the US Navy 3-site Body Fat % method?",
      answer:
        "The US Navy 3-site method estimates body fat percentage using circumference measurements of specific body sites combined with height. It uses logarithmic formulas developed by the US Navy to provide a practical, non-invasive way to estimate body fat without expensive equipment. This method is widely used in military and fitness settings for its balance of accuracy and convenience.",
    },
    {
      question: "How do I interpret my body fat percentage result?",
      answer:
        "Body fat percentage indicates the proportion of fat mass relative to total body weight. Lower percentages generally indicate leaner body composition, while higher percentages suggest more fat mass. The results are categorized into essential fat, athlete, fitness, average, and obese ranges, which help contextualize your health and fitness status. Keep in mind that ideal ranges vary by gender and age.",
    },
    {
      question: "What are the limitations of the US Navy method?",
      answer:
        "While practical and accessible, the US Navy method has limitations. It assumes consistent fat distribution patterns and may be less accurate for individuals with atypical body shapes, very muscular builds, or certain medical conditions. Measurement errors, especially in waist and neck circumferences, can also affect accuracy. For clinical or precise assessments, more advanced methods like DEXA scans are recommended.",
    },
    {
      question: "Why is the hip measurement required only for females?",
      answer:
        "The US Navy formula for females includes the hip circumference because women typically store fat differently than men, especially around the hips and thighs. Including the hip measurement improves the accuracy of the body fat estimate for females by accounting for this fat distribution pattern, which is not as prominent in males.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({
      gender: "male",
      height: "",
      neck: "",
      waist: "",
      hip: "",
    });
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

        {/* Gender */}
        <div>
          <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Gender
          </Label>
          <select
            id="gender"
            name="gender"
            value={inputs.gender}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Height ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="height"
            name="height"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 178"}
            value={inputs.height}
            onChange={handleInputChange}
            aria-describedby="height-help"
          />
          <p id="height-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your total height.
          </p>
        </div>

        {/* Neck */}
        <div>
          <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Neck Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="neck"
            name="neck"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 15" : "e.g. 38"}
            value={inputs.neck}
            onChange={handleInputChange}
            aria-describedby="neck-help"
          />
          <p id="neck-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure just below the larynx (Adam's apple), perpendicular to the neck axis.
          </p>
        </div>

        {/* Waist */}
        <div>
          <Label htmlFor="waist" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Waist Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="waist"
            name="waist"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 34" : "e.g. 86"}
            value={inputs.waist}
            onChange={handleInputChange}
            aria-describedby="waist-help"
          />
          <p id="waist-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure at the narrowest point or at the level of the navel, depending on gender.
          </p>
        </div>

        {/* Hip (only for female) */}
        {inputs.gender === "female" && (
          <div>
            <Label htmlFor="hip" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
              Hip Circumference ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="hip"
              name="hip"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "imperial" ? "e.g. 38" : "e.g. 97"}
              value={inputs.hip}
              onChange={handleInputChange}
              aria-describedby="hip-help"
            />
            <p id="hip-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Measure at the widest point of the hips/buttocks.
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Calculation is automatic on input change, so no action needed here.
            // But we can force re-render by setting inputs to same state (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate Body Fat Percentage"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}%
              </p>
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
          What is the Body Fat % (US Navy / 3-sites)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Body Fat Percentage (US Navy / 3-sites) method is a widely used technique to estimate an individual's body fat percentage using simple circumference measurements combined with height. Developed by the United States Navy, this method provides a practical and non-invasive way to assess body composition without the need for expensive or specialized equipment. It relies on measuring specific body sites — the neck, waist, and for females, the hips — and applying logarithmic formulas to estimate the proportion of fat mass relative to total body weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This method is particularly popular in military, fitness, and health settings because it balances accuracy with ease of use. Unlike methods such as hydrostatic weighing or DEXA scans, which require specialized tools and facilities, the US Navy method can be performed quickly with just a tape measure and a calculator. It is especially useful for tracking changes in body composition over time, helping individuals and professionals monitor fitness progress and health risks associated with excess body fat.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The method differentiates between males and females due to differences in fat distribution patterns. For males, the formula uses measurements of the neck and waist, while for females, the hip measurement is also included to account for typically higher fat storage in the hip and thigh regions. The resulting body fat percentage can then be categorized into ranges such as essential fat, athlete, fitness, average, and obese, providing meaningful context for health and fitness assessments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While the US Navy method is convenient and generally reliable, it is important to recognize its limitations. Factors such as measurement technique, body shape variations, and extreme muscularity can affect accuracy. Nonetheless, it remains a trusted tool for many health professionals and fitness enthusiasts in Canada, the US, and internationally.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your body fat percentage using the US Navy 3-site method. To get an accurate result, follow these steps carefully:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select your unit system:</strong> Choose Imperial (inches, pounds) if you are in the US or Canada, or Metric (centimeters, kilograms) for international measurements.
          </li>
          <li>
            <strong>Choose your gender:</strong> The formula differs for males and females due to different fat distribution patterns.
          </li>
          <li>
            <strong>Enter your height:</strong> Measure your total height accurately.
          </li>
          <li>
            <strong>Measure your neck circumference:</strong> Measure just below the larynx (Adam's apple), keeping the tape perpendicular to the neck axis.
          </li>
          <li>
            <strong>Measure your waist circumference:</strong> For males, measure at the narrowest point of the waist or at the navel level. For females, measure at the narrowest point.
          </li>
          <li>
            <strong>Measure your hip circumference (females only):</strong> Measure at the widest point of the hips/buttocks.
          </li>
          <li>
            <strong>Enter all measurements into the calculator and click Calculate.</strong> The calculator will provide your estimated body fat percentage along with a category to help interpret your result.
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
              href="https://www.navyfitness.org/body-fat-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. US Navy Body Fat Calculator Official Guide
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official US Navy resource explaining the body fat calculation method and measurement instructions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4045293/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Comparison of Body Fat Measurement Methods (NCBI)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Peer-reviewed article comparing the US Navy method with other body composition techniques.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.acefitness.org/education-and-resources/lifestyle/tools-calculators/body-fat-percentage-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. ACE Fitness Body Fat Percentage Calculator & Guide
            </a>
            <p className="text-slate-500 text-sm mt-1">
              American Council on Exercise resource detailing body fat categories and measurement methods.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. CDC Healthy Weight - Assessing Your Weight
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Centers for Disease Control and Prevention overview of body composition and health implications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Fat % (US Navy / 3-sites)"
      description="Estimate your body fat percentage using the US Navy method. Track your body composition progress accurately without expensive equipment."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Male: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76\nFemale: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
        variables: [
          { symbol: "waist", description: "Waist circumference (cm)" },
          { symbol: "neck", description: "Neck circumference (cm)" },
          { symbol: "hip", description: "Hip circumference (cm) — females only" },
          { symbol: "height", description: "Height (cm)" },
          { symbol: "log10", description: "Base-10 logarithm function" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John is a 30-year-old male who wants to estimate his body fat percentage. He measures his height as 70 inches, neck circumference as 16 inches, and waist circumference as 34 inches.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert measurements to centimeters: height = 177.8 cm, neck = 40.64 cm, waist = 86.36 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the formula: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate: log10(86.36 - 40.64) = log10(45.72) ≈ 1.660, log10(177.8) ≈ 2.250",
          },
          {
            label: "Step 4",
            explanation:
              "Body Fat % = 86.010 × 1.660 - 70.041 × 2.250 + 36.76 ≈ 142.77 - 157.59 + 36.76 = 21.94%",
          },
        ],
        result: "John's estimated body fat percentage is approximately 21.9%, categorized as 'Average' for males.",
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
        { id: "what-is", label: "What is Body Fat % (US Navy / 3-sites)?" },
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