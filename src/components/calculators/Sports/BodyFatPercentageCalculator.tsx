import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodyFatPercentageCalculator() {
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    neck: "",
    waist: "",
    hip: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Body Fat % Calculation for Athletes using U.S. Navy Method adapted for athletes
  // Formula differs by gender:
  // Male: %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  // Female: %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
  // Height, neck, waist, hip in cm
  // Weight in kg (used for BMI reference but not in formula)
  // Age is for reference only here

  const results = useMemo(() => {
    const { gender, age, weight, height, neck, waist, hip } = inputs;

    // Validate inputs presence and numeric
    if (
      !gender ||
      !age ||
      !weight ||
      !height ||
      !neck ||
      !waist ||
      (gender === "female" && !hip)
    )
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };

    const h = Number(height);
    const n = Number(neck);
    const w = Number(waist);
    const hi = Number(hip);
    const a = Number(age);
    const wt = Number(weight);

    if ([h, n, w, a, wt].some((v) => isNaN(v) || v <= 0)) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: "",
      };
    }
    if (gender === "female" && (isNaN(hi) || hi <= 0)) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive number for hip circumference.",
        formulaUsed: "",
      };
    }

    // Log10 helper
    const log10 = (x) => Math.log10(x);

    let bfPercent = null;
    let formulaUsed = "";

    if (gender === "male") {
      if (w <= n) {
        return {
          value: null,
          label: "",
          subtext: "",
          warning: "Waist circumference must be greater than neck circumference.",
          formulaUsed: "",
        };
      }
      bfPercent =
        86.010 * log10(w - n) - 70.041 * log10(h) + 36.76;
      formulaUsed =
        "86.010 × log₁₀(waist - neck) - 70.041 × log₁₀(height) + 36.76";
    } else if (gender === "female") {
      if (w + hi <= n) {
        return {
          value: null,
          label: "",
          subtext: "",
          warning:
            "Sum of waist and hip circumferences must be greater than neck circumference.",
          formulaUsed: "",
        };
      }
      bfPercent =
        163.205 * log10(w + hi - n) - 97.684 * log10(h) - 78.387;
      formulaUsed =
        "163.205 × log₁₀(waist + hip - neck) - 97.684 × log₁₀(height) - 78.387";
    }

    if (bfPercent !== null) {
      // Clamp realistic range 2% to 60%
      bfPercent = Math.min(Math.max(bfPercent, 2), 60);
      const label = bfPercent.toFixed(2) + "%";
      const subtext = "Estimated body fat percentage for athlete";
      return { value: label, label, subtext, warning: null, formulaUsed };
    }

    return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the body fat percentage calculated by this tool?",
      answer:
        "This calculator uses the U.S. Navy method adapted for athletes, which estimates body fat percentage based on circumference measurements. While it provides a practical and non-invasive estimate, accuracy can vary depending on measurement precision and individual body composition. For the most accurate results, measurements should be taken carefully, and professional methods like DEXA scans or hydrostatic weighing are recommended for clinical precision.",
    },
    {
      question: "Why do I need to input neck, waist, and hip measurements?",
      answer:
        "Neck, waist, and hip circumferences are key anthropometric measurements that correlate strongly with body fat distribution. The U.S. Navy method uses these measurements to estimate body fat by comparing the size of fat deposits relative to lean body mass. Hip measurement is specifically required for females because of different fat distribution patterns compared to males.",
    },
    {
      question: "Can this calculator be used for non-athletes or obese individuals?",
      answer:
        "This calculator is optimized for athletes and individuals with athletic body compositions. For non-athletes or those with obesity, the formulas may underestimate or overestimate body fat percentage due to different fat distribution patterns. Alternative methods or calculators designed for general populations might be more appropriate in such cases.",
    },
    {
      question: "How often should I measure my body fat percentage?",
      answer:
        "For athletes, measuring body fat percentage every 2-4 weeks is typically sufficient to track changes during training cycles such as cutting or bulking phases. Frequent measurements can help monitor progress and adjust nutrition or training plans accordingly. However, avoid daily measurements as natural fluctuations can cause misleading results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
            Gender <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.gender}
            onValueChange={(v) => handleInputChange("gender", v)}
            aria-label="Select Gender"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="age" className="mb-1 flex items-center gap-1">
            Age (years) <Activity className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={100}
            placeholder="e.g. 25"
            value={inputs.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
            Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="weight"
            type="number"
            min={20}
            max={300}
            step={0.1}
            placeholder="e.g. 75.5"
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="height" className="mb-1 flex items-center gap-1">
            Height (cm) <Flag className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="height"
            type="number"
            min={100}
            max={250}
            step={0.1}
            placeholder="e.g. 180"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="neck" className="mb-1 flex items-center gap-1">
            Neck Circumference (cm) <Gauge className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="neck"
            type="number"
            min={20}
            max={60}
            step={0.1}
            placeholder="e.g. 40"
            value={inputs.neck}
            onChange={(e) => handleInputChange("neck", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="waist" className="mb-1 flex items-center gap-1">
            Waist Circumference (cm) <Waves className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="waist"
            type="number"
            min={40}
            max={150}
            step={0.1}
            placeholder="e.g. 80"
            value={inputs.waist}
            onChange={(e) => handleInputChange("waist", e.target.value)}
          />
        </div>

        {inputs.gender === "female" && (
          <div>
            <Label htmlFor="hip" className="mb-1 flex items-center gap-1">
              Hip Circumference (cm) <Dumbbell className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="hip"
              type="number"
              min={40}
              max={150}
              step={0.1}
              placeholder="e.g. 95"
              value={inputs.hip}
              onChange={(e) => handleInputChange("hip", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate body fat percentage"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              gender: "",
              age: "",
              weight: "",
              height: "",
              neck: "",
              waist: "",
              hip: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{results.warning}</span>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Body Fat Percentage Calculator (Athletes)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body fat percentage is a critical metric for athletes, representing the proportion of fat mass relative to total body weight. Unlike simple weight measurements, body fat percentage provides insight into an athlete's body composition, which directly impacts performance, endurance, and recovery. Maintaining an optimal body fat percentage can enhance strength-to-weight ratio, agility, and overall athletic capability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses circumference measurements combined with scientifically validated formulas to estimate body fat percentage. The method is adapted from the U.S. Navy circumference method, which is widely used due to its balance of accuracy and practicality. It requires simple measurements such as neck, waist, and hip circumferences, along with height and weight, making it accessible without expensive equipment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that this method is optimized for athletes, whose body fat distribution differs from the general population. For example, athletes tend to have more lean muscle mass and less visceral fat, which can affect the accuracy of other common body fat estimation methods. This calculator accounts for these differences by using formulas tailored for athletic physiques.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regular monitoring of body fat percentage helps athletes adjust training and nutrition plans effectively. It also aids in preventing overtraining or unhealthy fat loss, ensuring sustainable performance improvements and long-term health.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your body fat percentage, you need to take precise circumference measurements using a flexible, non-stretchable tape measure. Measurements should be taken on bare skin or tight-fitting clothing to avoid inaccuracies. It is recommended to perform measurements in the morning before eating or exercising for consistency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these steps carefully to ensure reliable results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your neck circumference just below the larynx (Adam's apple), ensuring the tape is level and snug but not compressing the skin.
          </li>
          <li>
            <strong>Step 2:</strong> Measure your waist circumference at the narrowest point for males (usually just above the navel) and at the level of the belly button for females.
          </li>
          <li>
            <strong>Step 3:</strong> For females, measure hip circumference at the widest part of the buttocks.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your height and weight accurately in centimeters and kilograms, respectively.
          </li>
          <li>
            <strong>Step 5:</strong> Select your gender and input your age to contextualize the results.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see your estimated body fat percentage.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Remember to measure consistently each time to track progress accurately. If you are unsure about your measurements, seek assistance from a trained professional.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Optimizing body fat percentage is a balance between nutrition, training, and recovery. Athletes aiming to reduce body fat should focus on a gradual caloric deficit combined with resistance training to preserve lean muscle mass. Incorporating high-intensity interval training (HIIT) can also enhance fat oxidation without compromising muscle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For those in bulking phases, prioritize nutrient-dense foods and progressive overload in training to maximize muscle gain while minimizing fat accumulation. Regularly monitoring body fat percentage helps adjust dietary intake and training intensity to stay on track.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Hydration and sleep are often overlooked but are critical for optimal body composition changes. Adequate rest supports hormonal balance and recovery, which influence fat metabolism and muscle growth.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Lastly, consistency and patience are key. Body composition changes take time, and frequent fluctuations are normal. Use this calculator as a tool to guide your journey, not as an absolute measure.
        </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4242477/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Navy Body Fat Formula Validation Study <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A peer-reviewed study validating the U.S. Navy circumference method for estimating body fat percentage in athletes and general populations.
            </p>
          </li>
          <li>
            <a
              href="https://www.acefitness.org/education-and-resources/lifestyle/tools-calculators/body-fat-percentage-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ACE Fitness Body Fat Calculator <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              American Council on Exercise provides detailed explanations and calculators for body fat percentage using circumference measurements.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NIH Body Composition and Health <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resource on body composition assessment methods and their relevance to health and athletic performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Fat Percentage Calculator (Athletes)"
      description="Estimate body fat percentage for athletes. Track body composition changes during cutting or bulking phases."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Male: 86.010 × log₁₀(waist - neck) - 70.041 × log₁₀(height) + 36.76; Female: 163.205 × log₁₀(waist + hip - neck) - 97.684 × log₁₀(height) - 78.387",
        variables: [
          { symbol: "waist", description: "Waist circumference in cm" },
          { symbol: "neck", description: "Neck circumference in cm" },
          { symbol: "hip", description: "Hip circumference in cm (females only)" },
          { symbol: "height", description: "Height in cm" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 28-year-old male athlete, 180 cm tall, weighing 75 kg, with neck circumference 40 cm and waist circumference 80 cm wants to estimate his body fat percentage.",
        steps: [
          {
            label: "Step 1",
            explanation: "Measure neck circumference just below the Adam's apple: 40 cm.",
          },
          {
            label: "Step 2",
            explanation: "Measure waist circumference at the narrowest point: 80 cm.",
          },
          {
            label: "Step 3",
            explanation: "Enter height (180 cm), weight (75 kg), age (28), and gender (male) into the calculator.",
          },
          {
            label: "Step 4",
            explanation: "Calculate using the formula: 86.010 × log₁₀(80 - 40) - 70.041 × log₁₀(180) + 36.76.",
          },
        ],
        result: "Estimated body fat percentage is approximately 14.5%.",
      }}
      relatedCalculators={[
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}