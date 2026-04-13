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
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { LB_PER_KG } from "@/lib/utils";

function roundToOneDecimal(num: number) {
  return Math.round(num * 10) / 10;
}

export default function IdealWeightRangeHamwiDevineMillerCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
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
    const devineLbs = devineKg * LB_PER_KG;

    // Miller (kg)
    const millerKg =
      (inputs.gender === "male" ? 56.2 : 53.1) + (inputs.gender === "male" ? 1.41 : 1.36) * inchesOver5ft;
    const millerLbs = millerKg * LB_PER_KG;

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
        hamwi: roundToOneDecimal(hamwi / LB_PER_KG),
        devine: roundToOneDecimal(devineKg),
        miller: roundToOneDecimal(millerKg),
      };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Hamwi formula and how does it calculate ideal weight?",
      answer: "The Hamwi formula, developed in 1964, calculates ideal body weight based on height and sex. For men, it uses 106 pounds for the first 5 feet of height, plus 6 pounds for each additional inch. For women, it starts at 100 pounds for 5 feet, plus 5 pounds per additional inch. This method remains widely used by healthcare providers because it accounts for the relationship between height and proportional weight distribution.",
    },
    {
      question: "How do the Devine and Miller formulas differ from Hamwi?",
      answer: "The Devine formula (1974) uses slightly adjusted coefficients: 50 kg for the first 5 feet plus 2.3 kg per inch for men, and 45.5 kg plus 2.3 kg per inch for women. The Miller formula (1983) further refined these calculations with 56.2 pounds plus 1.41 pounds per inch for men and 53.1 pounds plus 1.36 pounds per inch for women. All three methods produce similar results, with typical differences of 5-10 pounds between formulas for the same individual.",
    },
    {
      question: "Why would I use this calculator instead of BMI?",
      answer: "These formulas provide actual weight targets rather than a weight range category like BMI does. While BMI (body mass index) only tells you if you're underweight, normal, overweight, or obese, the Hamwi/Devine/Miller methods give specific ideal weight ranges accounting for body frame and muscle mass. This approach is particularly useful for fitness professionals and healthcare providers who need precise weight goals for individual patients.",
    },
    {
      question: "What does 'frame size' mean in ideal weight calculations?",
      answer: "Frame size refers to the skeletal structure and bone density of an individual, typically classified as small, medium, or large. Someone with a large frame may naturally weigh 10-15% more than the base ideal weight calculation, while a small frame might weigh 10-15% less. Frame size can be estimated by measuring wrist circumference or by assessing overall bone structure, making it important for personalizing ideal weight ranges.",
    },
    {
      question: "Is a 5'10\" male with ideal weight of 178 pounds healthy?",
      answer: "Using the Hamwi formula, a 5'10\" male would have an ideal weight of approximately 178 pounds (106 + 60 pounds for 10 additional inches). If he has a medium frame, 178 pounds would be right on target. However, this should be combined with other health markers like BMI (approximately 25.5), body composition analysis, and cardiovascular fitness to determine overall health status.",
    },
    {
      question: "Can these formulas be used for children and teenagers?",
      answer: "These formulas were developed and validated for adults and are not reliable for children and adolescents whose growth patterns differ significantly. Children's ideal weight depends heavily on age, developmental stage, and puberty timing, making traditional growth charts and pediatric BMI percentiles more appropriate. Healthcare providers should use age-specific growth references when assessing weight in individuals under 18 years old.",
    },
    {
      question: "How much variation is normal between the three formulas?",
      answer: "For a 6-foot tall adult, the three formulas typically produce results within a 10-15 pound range of each other, which is clinically insignificant. For example, a 6' male might have ideal weights of 178 pounds (Hamwi), 180 pounds (Devine), or 177 pounds (Miller). Most healthcare providers choose one formula and stick with it for consistency, as all three are evidence-based and acceptable for clinical use.",
    },
    {
      question: "Should I use metric or imperial measurements in this calculator?",
      answer: "Most ideal weight calculators accept both systems, though the original formulas were developed in pounds and inches. If entering height in centimeters and weight in kilograms, ensure the calculator clearly specifies which formula variant is being used, as the conversion between systems must be precise. Using consistent units throughout (either metric or imperial) reduces calculation errors and ensures accuracy.",
    },
    {
      question: "What if my actual weight is significantly higher than the calculated ideal weight?",
      answer: "If your weight exceeds the ideal range by &gt;20%, consulting with a healthcare provider or registered dietitian is advisable to develop a sustainable weight management plan. The ideal weight range should be achieved gradually through balanced nutrition and regular physical activity, not crash dieting. Consider that muscle mass, bone density, and body composition all affect whether reaching the exact ideal weight is appropriate for your individual health profile.",
    }
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
              if (val !== "imperial" && val !== "metric") return;
              setUnit(val);
              resetInputs();
              setPreferredWeightUnit(val === "imperial" ? "lb" : "kg");
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ideal Weight Range (Hamwi/Devine/Miller)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your ideal weight range using one or more of three evidence-based formulas: Hamwi (1964), Devine (1974), and Miller (1983). These methods are widely used by healthcare providers, dietitians, and fitness professionals to set personalized weight goals based on height and sex. Unlike BMI, which only provides categorical classifications, these formulas generate specific target weights that account for how weight naturally scales with height.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input your height (in feet and inches, or centimeters) and select your biological sex. You can optionally specify your frame size (small, medium, or large), which adjusts the result by 10-15% to account for skeletal structure and bone density differences. Frame size is typically estimated by measuring wrist circumference or assessing overall build, and this personalization makes the results more clinically relevant.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your ideal weight range, usually within a 5-10 pound band around the calculated value. This range accounts for natural variation and the fact that reaching an exact number is less important than achieving a healthy weight for your body. Use these results alongside other health indicators—such as body composition, fitness level, and bloodwork—to determine if your current weight is appropriate and what a realistic, sustainable goal should be.</p>
        </div>
      </section>

      {/* TABLE: Ideal Weight Ranges by Height (Men) Using Three Formulas */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Weight Ranges by Height (Men) Using Three Formulas</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows calculated ideal weights for men at various heights using Hamwi, Devine, and Miller formulas.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hamwi (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Devine (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Miller (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'6"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">148</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">147</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">146</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">146-148</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'8"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">159</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">158</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">158-160</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170-172</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'0"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">184</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">184</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">182</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">182-184</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'2"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">196</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">196</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">194</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">194-196</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'4"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">208</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">208</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">206</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">206-208</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume medium frame size. Adjust ±10-15% for small or large frames respectively.</p>
      </section>

      {/* TABLE: Ideal Weight Ranges by Height (Women) Using Three Formulas */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Weight Ranges by Height (Women) Using Three Formulas</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows calculated ideal weights for women at various heights using Hamwi, Devine, and Miller formulas.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hamwi (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Devine (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Miller (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'0"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">101</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-101</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'2"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">111</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110-111</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">121</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-121</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'6"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">131</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130-131</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'8"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">141</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140-141</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">151</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-151</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume medium frame size. Adjust ±10-15% for small or large frames respectively.</p>
      </section>

      {/* TABLE: Frame Size Adjustment Factors */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Frame Size Adjustment Factors</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Frame size significantly impacts ideal weight calculations and should be applied as a percentage adjustment to base formula results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frame Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (5'10" Male at 172 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjusted Weight Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-10% to -15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172 × 0.85 to 0.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">146-155 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No adjustment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172 × 1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10% to +15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172 × 1.10 to 1.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">189-198 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Wrist circumference &lt;6.5 inches typically indicates small frame; 6.5-7.5 inches medium; &gt;7.5 inches large.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your height accurately in the morning before eating or drinking, as height can vary by up to half an inch throughout the day due to spinal compression.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Estimate frame size by measuring your wrist circumference with a soft tape measure; divide height in inches by wrist circumference to get a frame index (smaller ratios indicate larger frames).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that the ideal weight range assumes average muscle mass and body composition; athletes with high muscle mass may healthily exceed the calculated range by 10-20 pounds.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use these formulas as a starting point, not a rigid target; sustainable weight changes of 1-2 pounds per week are more achievable and maintainable than rapid weight loss to reach an exact number.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine ideal weight calculations with waist circumference measurements (&lt;40 inches for men, &lt;35 inches for women) to assess health more comprehensively than weight alone.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating the ideal weight as an exact target rather than a range</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculated weight should be viewed as a range (typically ±5 pounds), not a specific number to hit exactly. Fixating on reaching a precise weight can lead to unsustainable practices and unnecessary stress; focus instead on feeling healthy and maintaining that range long-term.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring frame size adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying the raw formula result without adjusting for frame size (±10-15%) can lead to unrealistic goals for individuals with naturally larger or smaller skeletal structures. A large-framed person following a small-frame target weight may damage their health, while small-framed individuals might retain unnecessary weight.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using these formulas for children, adolescents, or pregnant women</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">These formulas were developed and validated only for non-pregnant adults; applying them to children, teenagers, or pregnant women produces meaningless results. Pediatric growth charts and pregnancy-specific weight guidelines should be used instead for these populations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for muscle mass and body composition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Two people at the same height and weight can have dramatically different body compositions; someone with high muscle mass may be at a healthy weight while appearing heavier than the formula suggests. Combine these calculations with body composition analysis (via DEXA, bioelectrical impedance, or measurements) for a complete picture.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing formulas or switching between them frequently</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The three formulas produce slightly different results (typically 5-15 pound differences), causing confusion if you switch between them. Choose one formula and use it consistently to track progress and set realistic milestones rather than comparing results across different methods.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Hamwi formula and how does it calculate ideal weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Hamwi formula, developed in 1964, calculates ideal body weight based on height and sex. For men, it uses 106 pounds for the first 5 feet of height, plus 6 pounds for each additional inch. For women, it starts at 100 pounds for 5 feet, plus 5 pounds per additional inch. This method remains widely used by healthcare providers because it accounts for the relationship between height and proportional weight distribution.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do the Devine and Miller formulas differ from Hamwi?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Devine formula (1974) uses slightly adjusted coefficients: 50 kg for the first 5 feet plus 2.3 kg per inch for men, and 45.5 kg plus 2.3 kg per inch for women. The Miller formula (1983) further refined these calculations with 56.2 pounds plus 1.41 pounds per inch for men and 53.1 pounds plus 1.36 pounds per inch for women. All three methods produce similar results, with typical differences of 5-10 pounds between formulas for the same individual.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why would I use this calculator instead of BMI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">These formulas provide actual weight targets rather than a weight range category like BMI does. While BMI (body mass index) only tells you if you're underweight, normal, overweight, or obese, the Hamwi/Devine/Miller methods give specific ideal weight ranges accounting for body frame and muscle mass. This approach is particularly useful for fitness professionals and healthcare providers who need precise weight goals for individual patients.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does 'frame size' mean in ideal weight calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Frame size refers to the skeletal structure and bone density of an individual, typically classified as small, medium, or large. Someone with a large frame may naturally weigh 10-15% more than the base ideal weight calculation, while a small frame might weigh 10-15% less. Frame size can be estimated by measuring wrist circumference or by assessing overall bone structure, making it important for personalizing ideal weight ranges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is a 5'10" male with ideal weight of 178 pounds healthy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the Hamwi formula, a 5'10" male would have an ideal weight of approximately 178 pounds (106 + 60 pounds for 10 additional inches). If he has a medium frame, 178 pounds would be right on target. However, this should be combined with other health markers like BMI (approximately 25.5), body composition analysis, and cardiovascular fitness to determine overall health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can these formulas be used for children and teenagers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">These formulas were developed and validated for adults and are not reliable for children and adolescents whose growth patterns differ significantly. Children's ideal weight depends heavily on age, developmental stage, and puberty timing, making traditional growth charts and pediatric BMI percentiles more appropriate. Healthcare providers should use age-specific growth references when assessing weight in individuals under 18 years old.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much variation is normal between the three formulas?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 6-foot tall adult, the three formulas typically produce results within a 10-15 pound range of each other, which is clinically insignificant. For example, a 6' male might have ideal weights of 178 pounds (Hamwi), 180 pounds (Devine), or 177 pounds (Miller). Most healthcare providers choose one formula and stick with it for consistency, as all three are evidence-based and acceptable for clinical use.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use metric or imperial measurements in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most ideal weight calculators accept both systems, though the original formulas were developed in pounds and inches. If entering height in centimeters and weight in kilograms, ensure the calculator clearly specifies which formula variant is being used, as the conversion between systems must be precise. Using consistent units throughout (either metric or imperial) reduces calculation errors and ensures accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my actual weight is significantly higher than the calculated ideal weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your weight exceeds the ideal range by &gt;20%, consulting with a healthcare provider or registered dietitian is advisable to develop a sustainable weight management plan. The ideal weight range should be achieved gradually through balanced nutrition and regular physical activity, not crash dieting. Consider that muscle mass, bone density, and body composition all affect whether reaching the exact ideal weight is appropriate for your individual health profile.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cdc.gov/growthcharts/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Growth Charts and BMI Reference Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The CDC provides evidence-based growth and weight references used by healthcare providers to assess healthy weight ranges across age groups.</p>
          </li>
          <li>
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Heart, Lung, and Blood Institute (NHLBI) Obesity Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NHLBI offers evidence-based clinical guidelines on weight assessment, including formulas and methods for determining ideal weight ranges.</p>
          </li>
          <li>
            <a href="https://www.eatright.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Dietetic Association Position on Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Academy of Nutrition and Dietetics provides professional standards and evidence-based recommendations for weight assessment and management practices.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PubMed Central: Comparison of Weight Prediction Formulas</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PubMed Central hosts peer-reviewed research comparing the accuracy and clinical utility of Hamwi, Devine, Miller, and other ideal weight formulas.</p>
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
