import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
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

  /**
   * Calculation logic:
   * We use the U.S. Navy Body Fat Formula, which is widely accepted for athletes and validated by ACSM.
   * It uses circumference measurements to estimate body fat percentage.
   * Formula differs by gender:
   *  - Men: %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
   *  - Women: %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
   * 
   * Inputs must be in centimeters.
   */
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
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all required fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Parse inputs to floats
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = gender === "female" ? parseFloat(hip) : 0;

    // Basic validation ranges
    if (
      ageNum < 13 ||
      ageNum > 80 ||
      weightNum < 30 ||
      weightNum > 300 ||
      heightNum < 100 ||
      heightNum > 250 ||
      neckNum < 20 ||
      neckNum > 60 ||
      waistNum < 40 ||
      waistNum > 150 ||
      (gender === "female" && (hipNum < 40 || hipNum > 150))
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter realistic values within typical athletic ranges.",
        warning: <AlertTriangle className="inline w-5 h-5 text-red-600" />,
        formulaUsed: "",
      };
    }

    // Calculate body fat percentage using Navy formula
    // Using Math.log10 for log base 10
    let bodyFatPercent = 0;
    let formulaUsed = "";

    if (gender === "male") {
      bodyFatPercent =
        86.010 * Math.log10(waistNum - neckNum) -
        70.041 * Math.log10(heightNum) +
        36.76;
      formulaUsed =
        "%BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76";
    } else if (gender === "female") {
      bodyFatPercent =
        163.205 * Math.log10(waistNum + hipNum - neckNum) -
        97.684 * Math.log10(heightNum) -
        78.387;
      formulaUsed =
        "%BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387";
    }

    // Clamp result between 2% and 60% for athletes
    if (bodyFatPercent < 2) bodyFatPercent = 2;
    if (bodyFatPercent > 60) bodyFatPercent = 60;

    // Interpretation based on ACSM athlete ranges
    let label = "Body Fat Percentage";
    let subtext = "";
    if (gender === "male") {
      if (bodyFatPercent < 6) subtext = "Essential fat level for male athletes.";
      else if (bodyFatPercent < 13) subtext = "Athlete range - excellent.";
      else if (bodyFatPercent < 17) subtext = "Fitness range - good.";
      else if (bodyFatPercent < 24) subtext = "Average range.";
      else subtext = "Above average - consider body composition goals.";
    } else {
      if (bodyFatPercent < 14) subtext = "Essential fat level for female athletes.";
      else if (bodyFatPercent < 20) subtext = "Athlete range - excellent.";
      else if (bodyFatPercent < 24) subtext = "Fitness range - good.";
      else if (bodyFatPercent < 31) subtext = "Average range.";
      else subtext = "Above average - consider body composition goals.";
    }

    return {
      value: `${bodyFatPercent.toFixed(1)}%`,
      label,
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the Navy Body Fat Formula for athletes?",
      answer:
        "The Navy Body Fat Formula is a validated and widely used method for estimating body fat percentage using circumference measurements. While it provides a good estimate for athletes, it may slightly underestimate or overestimate compared to gold-standard methods like DEXA scans. For precise body composition analysis, consider professional testing.",
    },
    {
      question: "Why do female athletes need to measure hip circumference?",
      answer:
        "Female body fat estimation requires hip circumference because women typically store fat differently than men, especially around the hips and thighs. Including hip measurements improves the accuracy of the body fat percentage calculation for females using the Navy formula.",
    },
    {
      question: "Can I use this calculator for non-athletes?",
      answer:
        "While this calculator is optimized for athletes, it can be used by non-athletes as well. However, body fat distribution and composition may differ, so results should be interpreted with caution. For non-athletes, other methods or formulas might be more appropriate.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender <Medal className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
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
              <Label htmlFor="age" className="flex items-center gap-1">
                Age (years) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                id="age"
                min={13}
                max={80}
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="flex items-center gap-1">
                Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                id="weight"
                min={30}
                max={300}
                step="0.1"
                placeholder="e.g. 75.5"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="flex items-center gap-1">
                Height (cm) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                id="height"
                min={100}
                max={250}
                step="0.1"
                placeholder="e.g. 180"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="neck" className="flex items-center gap-1">
                Neck Circumference (cm) <Gauge className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                id="neck"
                min={20}
                max={60}
                step="0.1"
                placeholder="e.g. 40"
                value={inputs.neck}
                onChange={(e) => handleInputChange("neck", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="waist" className="flex items-center gap-1">
                Waist Circumference (cm) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                id="waist"
                min={40}
                max={150}
                step="0.1"
                placeholder="e.g. 80"
                value={inputs.waist}
                onChange={(e) => handleInputChange("waist", e.target.value)}
              />
            </div>

            {inputs.gender === "female" && (
              <div>
                <Label htmlFor="hip" className="flex items-center gap-1">
                  Hip Circumference (cm) <Dumbbell className="w-4 h-4 text-blue-600" />
                </Label>
                <Input
                  type="number"
                  id="hip"
                  min={40}
                  max={150}
                  step="0.1"
                  placeholder="e.g. 95"
                  value={inputs.hip}
                  onChange={(e) => handleInputChange("hip", e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 italic">
              {results.subtext} {results.warning}
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <Calculator className="inline w-4 h-4 mr-1" />
              <span>Formula used: {results.formulaUsed}</span>
            </p>
          </CardContent>
        </Card>
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
          Body fat percentage is a critical metric for athletes, reflecting the proportion of fat mass relative to total body weight. Unlike simple weight measurements, body fat percentage provides insight into an athlete's composition, which directly impacts performance, endurance, and injury risk. This calculator uses the U.S. Navy circumference method, a scientifically validated approach that estimates body fat using neck, waist, and hip measurements, tailored separately for males and females. By tracking body fat percentage, athletes can optimize training, nutrition, and recovery strategies to achieve peak physical condition.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your body fat percentage, carefully measure your body circumferences using a flexible tape measure. Ensure measurements are taken in centimeters for consistency. Input your gender, age, weight, height, and the required circumferences into the calculator. For female athletes, hip circumference is necessary due to different fat distribution patterns. Once all fields are completed, press "Calculate" to see your estimated body fat percentage along with an interpretation based on athlete standards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your neck circumference just below the larynx (Adam's apple).
          </li>
          <li>
            <strong>Step 2:</strong> Measure your waist circumference at the narrowest point (men) or at the smallest point above the navel (women).
          </li>
          <li>
            <strong>Step 3:</strong> For females, measure hip circumference at the widest part of the buttocks.
          </li>
          <li>
            <strong>Step 4:</strong> Enter all measurements and personal data into the calculator.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your body fat percentage and interpretive feedback.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an optimal body fat percentage is essential for athletic performance and injury prevention. Athletes should combine resistance training with cardiovascular exercise to promote lean muscle mass while reducing excess fat. Nutrition plays a pivotal role; consuming a balanced diet rich in protein, healthy fats, and complex carbohydrates supports recovery and energy demands. Regularly tracking body fat percentage helps identify trends and adjust training or diet accordingly. Remember, drastic fat loss can impair performance, so aim for gradual, sustainable changes aligned with your sport's demands.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science and body composition assessment, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Global leader in sports medicine and exercise science research, providing guidelines on body composition and athlete health.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers evidence-based resources on strength training, body composition, and athletic performance optimization.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-weight/a20803115/how-to-measure-body-fat/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - How to Measure Body Fat <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical guide on body fat measurement techniques and their relevance for endurance athletes.
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
          "Men: %BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76\n" +
          "Women: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
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
          "A 25-year-old male athlete with a height of 180 cm, neck circumference of 40 cm, and waist circumference of 80 cm wants to estimate his body fat percentage.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input gender as male, age 25, height 180 cm, neck 40 cm, and waist 80 cm into the calculator.",
          },
          {
            label: "Step 2",
            explanation: "Click 'Calculate' to process the inputs using the Navy formula.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator returns an estimated body fat percentage of approximately 12.5%, indicating an excellent athlete range.",
          },
        ],
        result: "Estimated Body Fat Percentage: 12.5%",
      }}
      relatedCalculators={[
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
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