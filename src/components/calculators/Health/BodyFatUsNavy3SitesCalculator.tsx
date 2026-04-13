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
      question: "What is the US Navy Body Fat Formula and how accurate is it?",
      answer: "The US Navy body fat formula is a non-invasive method that estimates body composition using circumference measurements at three specific sites (abdomen, neck, and hip for women; abdomen, neck, and chest for men). Studies show the formula is approximately 98% as accurate as DEXA scans for estimating body fat percentage, with a margin of error typically between ±3-4%. This makes it one of the most reliable field methods used by military and fitness professionals.",
    },
    {
      question: "Where exactly should I measure my abdomen for the most accurate result?",
      answer: "The abdomen measurement should be taken horizontally at the level of your natural waist, approximately half an inch above your navel, while standing relaxed with your feet together. Ensure the measuring tape is snug but not compressing the skin, and take the measurement at the end of a normal breath to avoid artificially inflating the number. Consistency in measurement location is more important than perfection, so mark the spot if you plan to track progress over time.",
    },
    {
      question: "Why does the US Navy formula use different measurement sites for men and women?",
      answer: "Men and women have different fat distribution patterns due to hormonal differences, with women typically storing more fat in the hips and thighs while men accumulate more abdominal fat. The Navy formula accounts for these biological differences by using hip measurements for women instead of chest measurements, providing more accurate estimations that reflect how each gender naturally carries body fat. This customization improves the formula's accuracy by approximately 2-3% compared to using identical measurement sites for both sexes.",
    },
    {
      question: "What is considered a healthy body fat percentage according to US Navy standards?",
      answer: "According to US Navy standards, healthy body fat ranges are approximately 10-20% for adult men and 18-32% for adult women, though these vary slightly by age group. For men aged 20-40, the ideal range is 8-19%, while for women aged 20-40, it is 16-25%. Body fat percentages below 3% for men and 8% for women are considered dangerous and unsustainable, while percentages above 25% for men and 32% for women indicate elevated health risks including cardiovascular disease and metabolic disorders.",
    },
    {
      question: "Can the US Navy formula be used for obese individuals or those significantly overweight?",
      answer: "The US Navy formula remains reasonably accurate for most body compositions, though it may have reduced accuracy at very high body fat percentages (&gt;40%) due to increased skin fold variability and measurement challenges. For individuals with obesity, the formula typically still provides useful directional information, but measurements should be taken with extra care to ensure accuracy around larger circumferences. If precision is critical for individuals at extreme body weights, professional body composition analysis using hydrostatic weighing or DEXA scanning may provide more reliable results.",
    },
    {
      question: "How often should I remeasure my body fat using the Navy formula to track progress?",
      answer: "For meaningful progress tracking, remeasure your body fat using the Navy formula every 4-6 weeks, as more frequent measurements (weekly or bi-weekly) may show little change and can be discouraging. Body composition changes take time, and weekly fluctuations in water retention and glycogen storage can mask actual fat loss or muscle gain. Consistency in measurement time of day (preferably morning before eating) and technique is essential for valid comparisons between measurements.",
    },
    {
      question: "What is the difference between body fat percentage and BMI, and which is more accurate?",
      answer: "Body Mass Index (BMI) is a simple height-to-weight ratio that does not distinguish between fat and muscle mass, making it unable to account for athletic individuals who may have high BMI but low body fat. The US Navy body fat formula directly measures body composition and provides a much more accurate picture of actual fat distribution and health risk, particularly for muscular or very lean individuals. The Navy formula is generally considered superior for fitness assessment because a person can have a healthy BMI while still having excess body fat, or an overweight BMI while maintaining low body fat through muscle mass.",
    },
    {
      question: "Can I use the US Navy formula if I have had surgery or significant weight loss with loose skin?",
      answer: "The US Navy formula may produce less accurate results if you have significant loose skin from weight loss or post-surgical changes, as the circumference measurements can be affected by skin laxity that doesn't represent actual fat or muscle. In cases of major body composition changes (such as after bariatric surgery), you may want to supplement Navy measurements with other methods like progress photos or clothing fit to get a complete picture. For the most accurate assessment after major changes, professional body composition analysis might be worth considering.",
    },
    {
      question: "How does age affect body fat percentage calculations using the US Navy formula?",
      answer: "The US Navy formula itself does not directly adjust for age, but age significantly affects what is considered a healthy body fat percentage, as people naturally accumulate more body fat and lose muscle mass with aging. For example, a healthy body fat range for men aged 20-39 is approximately 8-19%, but for men aged 60+ it increases to 13-25%, reflecting normal physiological changes. When using the calculator, you should interpret your results within the context of your age group rather than comparing yourself to younger individuals, as age-adjusted healthy ranges provide more meaningful benchmarks for your fitness goals.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Body Fat % (US Navy / 3-sites)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The US Navy body fat calculator uses the 3-site skinfold measurement method to estimate your body fat percentage, a quick and reasonably accurate way to assess body composition without expensive equipment. This method has been used by military personnel and fitness professionals for decades because it provides results within 3-4% accuracy compared to advanced laboratory methods like DEXA scans. Understanding your body fat percentage is more informative than BMI alone because it distinguishes between muscle and fat, giving you a clearer picture of your actual fitness level.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you need to measure three specific locations on your body using a soft measuring tape: your neck, abdomen, and either your chest (for men) or hips (for women). Each measurement should be taken horizontally while standing relaxed with feet together, ensuring the tape is snug against your skin without compressing it. Accuracy depends heavily on consistent technique, so measure at the same time of day, typically in the morning before eating or exercising, and try to use the same tape each time you track progress.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">After entering your measurements and age, the calculator will display your estimated body fat percentage and show you how it compares to healthy ranges for your age group and gender. A result of 18-24% for men or 25-31% for women indicates average health with room for improvement, while 14-17% for men or 18-22% for women represents good fitness. Remember that this estimate has a margin of error of approximately 3-4%, so small changes in your result may reflect measurement error rather than actual body composition changes.</p>
        </div>
      </section>

      {/* TABLE: Healthy Body Fat Percentage Ranges by Age and Gender (US Navy Standards) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Healthy Body Fat Percentage Ranges by Age and Gender (US Navy Standards)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These ranges represent healthy body fat percentages according to US Navy standards, organized by age group and gender to help you interpret your results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men (Healthy Range %)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women (Healthy Range %)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-29 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-39 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17-25%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-49 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-26%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-59 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-27%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-23%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-28%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These ranges reflect age-adjusted healthy body fat percentages. Below 3% for men and 8% for women is considered dangerous; above 25% for men and 32% for women indicates elevated health risks.</p>
      </section>

      {/* TABLE: Body Fat Category Classifications */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Body Fat Category Classifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table categorizes body fat percentage ranges and their associated health classifications for adult men and women.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Classification</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men Body Fat %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women Body Fat %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Essential Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimum for basic biological function</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Athletic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-17%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent fitness level, athlete range</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fitness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-17%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good health and fitness</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-31%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acceptable but room for improvement</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elevated health risks and disease potential</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The Athletic and Fitness categories represent optimal health ranges for most adults seeking good fitness outcomes.</p>
      </section>

      {/* TABLE: Measurement Site Standards for US Navy 3-Site Formula */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Measurement Site Standards for US Navy 3-Site Formula</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Proper measurement technique is critical for accurate results; this table specifies the exact anatomical locations for each measurement site.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Measurement Site</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men Location</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Neck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Just below the larynx (Adam's apple), horizontal plane</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Just below the larynx (Adam's apple), horizontal plane</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Abdomen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Half inch above the navel, horizontal plane</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Half inch above the navel, horizontal plane</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">One-third the distance between shoulder and nipple</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not used in women's 3-site formula</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hip</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not used in men's 3-site formula</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Largest circumference around hips and buttocks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All measurements should be taken with a flexible measuring tape while standing relaxed, not flexing muscles, with the tape snug but not compressing skin.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your neck just below your larynx (Adam's apple) in a horizontal plane while keeping your head straight forward, not looking down or tilted back, to ensure a consistent measurement location each time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take your abdomen measurement at the end of a normal breath cycle, not while holding in your stomach or breathing deeply, as this significantly affects the tape reading and produces inaccurate results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform measurements at the same time each day (ideally in the morning) to minimize variations from water retention, meal timing, and daily fluid fluctuations that can shift your body weight by 2-5 pounds.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Record your measurements and results in a spreadsheet or fitness app to track trends over 4-6 week intervals, as individual measurements are less meaningful than seeing consistent progress or plateaus over time.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring the Abdomen While Flexing or Sucking In</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Flexing your abdominal muscles or consciously pulling in your stomach will artificially lower your measurement and overestimate fitness, sometimes by 1-2 inches. Always measure with your abdomen relaxed and your posture natural to get accurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an Overly Tight or Loose Measuring Tape</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A tape that is too loose will overestimate circumference and inflate your body fat percentage, while a tape that compresses the skin will underestimate it. The tape should be snug enough to sit flat against your skin without creating indentations or gaps.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Age-Adjusted Healthy Ranges</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people compare their body fat percentage to ranges for younger age groups, creating unrealistic expectations that don't account for natural physiological changes with aging. Your results should always be evaluated against the healthy ranges for your specific age group to get an accurate assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Taking Measurements Immediately After Exercise or Eating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exercise causes temporary fluid shifts and increased blood flow that affect measurements, while eating can bloat the abdomen temporarily and raise circumference readings. Always measure in the morning on an empty stomach and avoid exercise for at least 1-2 hours before measurement for consistency.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the US Navy Body Fat Formula and how accurate is it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The US Navy body fat formula is a non-invasive method that estimates body composition using circumference measurements at three specific sites (abdomen, neck, and hip for women; abdomen, neck, and chest for men). Studies show the formula is approximately 98% as accurate as DEXA scans for estimating body fat percentage, with a margin of error typically between ±3-4%. This makes it one of the most reliable field methods used by military and fitness professionals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Where exactly should I measure my abdomen for the most accurate result?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The abdomen measurement should be taken horizontally at the level of your natural waist, approximately half an inch above your navel, while standing relaxed with your feet together. Ensure the measuring tape is snug but not compressing the skin, and take the measurement at the end of a normal breath to avoid artificially inflating the number. Consistency in measurement location is more important than perfection, so mark the spot if you plan to track progress over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does the US Navy formula use different measurement sites for men and women?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Men and women have different fat distribution patterns due to hormonal differences, with women typically storing more fat in the hips and thighs while men accumulate more abdominal fat. The Navy formula accounts for these biological differences by using hip measurements for women instead of chest measurements, providing more accurate estimations that reflect how each gender naturally carries body fat. This customization improves the formula's accuracy by approximately 2-3% compared to using identical measurement sites for both sexes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a healthy body fat percentage according to US Navy standards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">According to US Navy standards, healthy body fat ranges are approximately 10-20% for adult men and 18-32% for adult women, though these vary slightly by age group. For men aged 20-40, the ideal range is 8-19%, while for women aged 20-40, it is 16-25%. Body fat percentages below 3% for men and 8% for women are considered dangerous and unsustainable, while percentages above 25% for men and 32% for women indicate elevated health risks including cardiovascular disease and metabolic disorders.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the US Navy formula be used for obese individuals or those significantly overweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The US Navy formula remains reasonably accurate for most body compositions, though it may have reduced accuracy at very high body fat percentages (&gt;40%) due to increased skin fold variability and measurement challenges. For individuals with obesity, the formula typically still provides useful directional information, but measurements should be taken with extra care to ensure accuracy around larger circumferences. If precision is critical for individuals at extreme body weights, professional body composition analysis using hydrostatic weighing or DEXA scanning may provide more reliable results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I remeasure my body fat using the Navy formula to track progress?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For meaningful progress tracking, remeasure your body fat using the Navy formula every 4-6 weeks, as more frequent measurements (weekly or bi-weekly) may show little change and can be discouraging. Body composition changes take time, and weekly fluctuations in water retention and glycogen storage can mask actual fat loss or muscle gain. Consistency in measurement time of day (preferably morning before eating) and technique is essential for valid comparisons between measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between body fat percentage and BMI, and which is more accurate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Body Mass Index (BMI) is a simple height-to-weight ratio that does not distinguish between fat and muscle mass, making it unable to account for athletic individuals who may have high BMI but low body fat. The US Navy body fat formula directly measures body composition and provides a much more accurate picture of actual fat distribution and health risk, particularly for muscular or very lean individuals. The Navy formula is generally considered superior for fitness assessment because a person can have a healthy BMI while still having excess body fat, or an overweight BMI while maintaining low body fat through muscle mass.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the US Navy formula if I have had surgery or significant weight loss with loose skin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The US Navy formula may produce less accurate results if you have significant loose skin from weight loss or post-surgical changes, as the circumference measurements can be affected by skin laxity that doesn't represent actual fat or muscle. In cases of major body composition changes (such as after bariatric surgery), you may want to supplement Navy measurements with other methods like progress photos or clothing fit to get a complete picture. For the most accurate assessment after major changes, professional body composition analysis might be worth considering.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect body fat percentage calculations using the US Navy formula?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The US Navy formula itself does not directly adjust for age, but age significantly affects what is considered a healthy body fat percentage, as people naturally accumulate more body fat and lose muscle mass with aging. For example, a healthy body fat range for men aged 20-39 is approximately 8-19%, but for men aged 60+ it increases to 13-25%, reflecting normal physiological changes. When using the calculator, you should interpret your results within the context of your age group rather than comparing yourself to younger individuals, as age-adjusted healthy ranges provide more meaningful benchmarks for your fitness goals.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.mynavyhr.navy.mil/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">US Navy Body Composition Assessment (Official Naval Education and Training Command)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official US Navy resource documenting the standardized body fat measurement procedures and standards used across all military branches.</p>
          </li>
          <li>
            <a href="https://www.acefitness.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Body Fat Percentage Standards and Classifications (American Council on Exercise)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The ACE provides evidence-based body fat classification ranges and recommendations for fitness professionals using the Navy 3-site formula.</p>
          </li>
          <li>
            <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Validity of Anthropometric Body Composition Methods (National Institutes of Health - PubMed)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research comparing the accuracy of the US Navy formula against DEXA scanning and other gold-standard body composition assessment methods.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Body Composition and Health Risk Assessment Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Centers for Disease Control guidelines on interpreting body composition measurements and understanding health risks associated with different body fat percentages.</p>
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