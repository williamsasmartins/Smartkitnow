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
  /*
    This calculator estimates body fat percentage for athletes using the Jackson & Pollock 3-site skinfold formula,
    which is widely accepted for athletic populations due to its accuracy and practicality.
    The formula differs for males and females and requires skinfold measurements in millimeters.
  */

  // Inputs: gender, age, skinfolds (3 sites)
  // Male sites: Chest, Abdomen, Thigh
  // Female sites: Triceps, Suprailiac, Thigh

  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    sf1: "",
    sf2: "",
    sf3: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper to parse float safely
  const parseInput = (val) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? null : n;
  };

  const results = useMemo(() => {
    const gender = inputs.gender;
    const age = parseInput(inputs.age);
    const sf1 = parseInput(inputs.sf1);
    const sf2 = parseInput(inputs.sf2);
    const sf3 = parseInput(inputs.sf3);

    if (!gender || !age || sf1 === null || sf2 === null || sf3 === null) {
      return {
        value: "",
        label: "",
        subtext: "Please enter all required fields with valid values.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Sum of skinfolds
    const sumSF = sf1 + sf2 + sf3;

    // Body Density calculation using Jackson & Pollock 3-site formula
    // Source: Jackson, A.S., Pollock, M.L. (1978). Generalized equations for predicting body density of men.
    // For males:
    // BD = 1.10938 - 0.0008267 * sumSF + 0.0000016 * sumSF^2 - 0.0002574 * age
    // For females:
    // BD = 1.0994921 - 0.0009929 * sumSF + 0.0000023 * sumSF^2 - 0.0001392 * age

    let bodyDensity = 0;
    let formulaUsed = "";
    if (gender === "male") {
      bodyDensity =
        1.10938 -
        0.0008267 * sumSF +
        0.0000016 * sumSF * sumSF -
        0.0002574 * age;
      formulaUsed =
        "Body Density = 1.10938 - 0.0008267 × sum of skinfolds + 0.0000016 × (sum of skinfolds)² - 0.0002574 × age";
    } else if (gender === "female") {
      bodyDensity =
        1.0994921 -
        0.0009929 * sumSF +
        0.0000023 * sumSF * sumSF -
        0.0001392 * age;
      formulaUsed =
        "Body Density = 1.0994921 - 0.0009929 × sum of skinfolds + 0.0000023 × (sum of skinfolds)² - 0.0001392 × age";
    } else {
      return {
        value: "",
        label: "",
        subtext: "Invalid gender selected.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Siri equation to convert body density to body fat percentage:
    // BF% = (495 / Body Density) - 450
    const bodyFatPercentage = (495 / bodyDensity) - 450;

    // Validation and warnings
    let warning = null;
    if (bodyFatPercentage < 2) {
      warning =
        "Warning: Calculated body fat percentage is extremely low and may be inaccurate.";
    } else if (bodyFatPercentage > 60) {
      warning =
        "Warning: Calculated body fat percentage is unusually high and may be inaccurate.";
    }

    const value = `${bodyFatPercentage.toFixed(2)}%`;
    const label = "Estimated Body Fat Percentage";
    const subtext =
      "Calculated using Jackson & Pollock 3-site skinfold formula and Siri equation.";

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do athletes need a specialized body fat calculator?",
      answer:
        "Athletes typically have different body compositions compared to the general population, including higher muscle mass and lower fat mass. Using formulas validated specifically for athletic populations, such as the Jackson & Pollock skinfold method, provides more accurate and relevant body fat estimates. This helps athletes track performance and optimize training and nutrition plans effectively.",
    },
    {
      question: "How accurate are skinfold measurements for body fat estimation?",
      answer:
        "Skinfold measurements can be very accurate when performed by trained professionals using calibrated calipers. However, accuracy depends on proper technique, consistent measurement sites, and the athlete's hydration and recent exercise status. While not as precise as DEXA scans, skinfold methods offer a practical and cost-effective way to monitor body composition changes over time.",
    },
    {
      question: "Can I use this calculator if I don't have skinfold measurements?",
      answer:
        "This calculator requires skinfold measurements at specific sites to estimate body fat percentage accurately. If you do not have access to calipers or trained personnel, consider alternative methods such as bioelectrical impedance analysis or professional body composition assessments. Always consult with a sports scientist or health professional for best results.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="mb-1 block font-semibold">
                Gender
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
                aria-label="Select gender"
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
              <Label htmlFor="age" className="mb-1 block font-semibold">
                Age (years)
              </Label>
              <Input
                type="number"
                id="age"
                min={10}
                max={80}
                step={1}
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                aria-describedby="age-desc"
              />
              <p id="age-desc" className="text-xs text-slate-500 mt-1">
                Enter your age between 10 and 80 years.
              </p>
            </div>

            {/* Skinfold inputs */}
            {inputs.gender === "male" && (
              <>
                <div>
                  <Label htmlFor="sf1" className="mb-1 block font-semibold">
                    Chest Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf1"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 10.5"
                    value={inputs.sf1}
                    onChange={(e) => handleInputChange("sf1", e.target.value)}
                    aria-describedby="sf1-desc"
                  />
                  <p id="sf1-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the chest site.
                  </p>
                </div>
                <div>
                  <Label htmlFor="sf2" className="mb-1 block font-semibold">
                    Abdomen Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf2"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 12.0"
                    value={inputs.sf2}
                    onChange={(e) => handleInputChange("sf2", e.target.value)}
                    aria-describedby="sf2-desc"
                  />
                  <p id="sf2-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the abdomen site.
                  </p>
                </div>
                <div>
                  <Label htmlFor="sf3" className="mb-1 block font-semibold">
                    Thigh Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf3"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 15.0"
                    value={inputs.sf3}
                    onChange={(e) => handleInputChange("sf3", e.target.value)}
                    aria-describedby="sf3-desc"
                  />
                  <p id="sf3-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the thigh site.
                  </p>
                </div>
              </>
            )}

            {inputs.gender === "female" && (
              <>
                <div>
                  <Label htmlFor="sf1" className="mb-1 block font-semibold">
                    Triceps Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf1"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 18.0"
                    value={inputs.sf1}
                    onChange={(e) => handleInputChange("sf1", e.target.value)}
                    aria-describedby="sf1-desc"
                  />
                  <p id="sf1-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the triceps site.
                  </p>
                </div>
                <div>
                  <Label htmlFor="sf2" className="mb-1 block font-semibold">
                    Suprailiac Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf2"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 20.0"
                    value={inputs.sf2}
                    onChange={(e) => handleInputChange("sf2", e.target.value)}
                    aria-describedby="sf2-desc"
                  />
                  <p id="sf2-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the suprailiac site.
                  </p>
                </div>
                <div>
                  <Label htmlFor="sf3" className="mb-1 block font-semibold">
                    Thigh Skinfold (mm)
                  </Label>
                  <Input
                    type="number"
                    id="sf3"
                    min={0}
                    step={0.1}
                    placeholder="e.g. 22.0"
                    value={inputs.sf3}
                    onChange={(e) => handleInputChange("sf3", e.target.value)}
                    aria-describedby="sf3-desc"
                  />
                  <p id="sf3-desc" className="text-xs text-slate-500 mt-1">
                    Skinfold thickness at the thigh site.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate body fat percentage"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ gender: "", age: "", sf1: "", sf2: "", sf3: "" })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                {results.warning}
              </p>
            )}
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
          Body fat percentage is a critical metric for athletes as it provides
          insight into their body composition, distinguishing fat mass from lean
          mass. Unlike simple weight measurements, body fat percentage offers a
          more nuanced understanding of fitness and health, helping athletes
          optimize performance and reduce injury risk. This calculator uses the
          Jackson & Pollock 3-site skinfold method, a validated and widely used
          approach tailored for athletic populations, ensuring accurate and
          reliable estimates.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Skinfold measurements involve pinching specific sites on the body to
          assess subcutaneous fat thickness. These measurements are then used in
          regression equations to estimate body density, which is converted to
          body fat percentage using the Siri equation. This method balances
          accuracy with practicality, making it ideal for regular monitoring in
          training environments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your body fat percentage helps guide nutrition,
          training intensity, and recovery strategies. Maintaining an optimal
          body fat range can enhance endurance, strength, and overall athletic
          performance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate body fat percentage estimate, you need to input
          your gender, age, and three skinfold measurements taken at specific
          anatomical sites. These sites differ between males and females to
          reflect typical fat distribution patterns. Ensure measurements are
          taken using calibrated skinfold calipers by a trained professional
          for best results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your gender from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age in years (between 10 and 80).
          </li>
          <li>
            <strong>Step 3:</strong> Input the skinfold thickness (in
            millimeters) for the three required sites:
            <ul className="list-disc pl-5 mt-1">
              {inputs.gender === "male" ? (
                <>
                  <li>Chest</li>
                  <li>Abdomen</li>
                  <li>Thigh</li>
                </>
              ) : inputs.gender === "female" ? (
                <>
                  <li>Triceps</li>
                  <li>Suprailiac</li>
                  <li>Thigh</li>
                </>
              ) : (
                <li>Please select gender to see required sites.</li>
              )}
            </ul>
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see your
            estimated body fat percentage.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to inform your training and
            nutrition plans, and retest periodically to track progress.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an optimal body fat percentage is essential for athletic
          performance, injury prevention, and overall health. Athletes should
          aim to balance fat loss with muscle preservation, especially during
          cutting phases. Incorporate resistance training and adequate protein
          intake to support lean mass retention while reducing fat mass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly monitoring body fat percentage allows for timely adjustments
          in training intensity and nutrition. Avoid drastic changes that may
          impair performance or recovery. Hydration status and measurement
          consistency are crucial for accurate skinfold assessments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Collaborate with sports scientists or coaches to interpret results and
          develop personalized strategies. Remember, body fat percentage is one
          of many metrics that contribute to athletic success.
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
          For more information on training science and body composition
          assessment, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research,
              providing guidelines on body composition assessment.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers evidence-based resources on athlete training and body
              composition evaluation.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Fédération Internationale de Football Association (FIFA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides performance standards and fitness assessment protocols
              for elite athletes.
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
          "Body Density (Male) = 1.10938 - 0.0008267 × sumSF + 0.0000016 × sumSF² - 0.0002574 × age; " +
          "Body Density (Female) = 1.0994921 - 0.0009929 × sumSF + 0.0000023 × sumSF² - 0.0001392 × age; " +
          "Body Fat % = (495 / Body Density) - 450",
        variables: [
          { symbol: "sumSF", description: "Sum of 3 skinfold measurements (mm)" },
          { symbol: "age", description: "Age in years" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 25-year-old male athlete measures his chest, abdomen, and thigh skinfolds as 10 mm, 12 mm, and 15 mm respectively. He wants to estimate his body fat percentage to monitor his cutting phase progress.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Sum the skinfold measurements: 10 + 12 + 15 = 37 mm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate body density using the male formula: 1.10938 - 0.0008267 × 37 + 0.0000016 × 37² - 0.0002574 × 25 = 1.0667 (approx).",
          },
          {
            label: "Step 3",
            explanation:
              "Convert body density to body fat percentage using Siri equation: (495 / 1.0667) - 450 = 16.5%.",
          },
        ],
        result:
          "The athlete's estimated body fat percentage is approximately 16.5%, indicating a lean and athletic physique.",
      }}
      relatedCalculators={[
        {
          title: "VO2max Estimator (Cooper/Rockport Test)",
          url: "/sports/vo2max-estimator-cooper-rockport",
          icon: "🏆",
        },
        {
          title: "Fantasy Team Points Projections Calculator",
          url: "/sports/fantasy-team-points-projections",
          icon: "🏆",
        },
        {
          title: "Baseball OPS / SLG / OBP Calculator",
          url: "/sports/baseball-ops-slg-obp",
          icon: "⚽",
        },
        {
          title: "Ground Ball to Fly Ball Ratio (GB/FB)",
          url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb",
          icon: "⚽",
        },
        {
          title: "Heart-Rate Zones Calculator (Karvonen Method)",
          url: "/sports/heart-rate-zones-karvonen",
          icon: "🔥",
        },
        {
          title: "FINA Points Calculator",
          url: "/sports/fina-points-calculator",
          icon: "🏊",
        },
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