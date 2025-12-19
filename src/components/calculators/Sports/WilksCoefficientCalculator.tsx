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

const WILKS_COEFFICIENTS = {
  male: {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863e-06,
    f: -1.291e-08,
  },
  female: {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582e-05,
    f: -9.054e-08,
  },
};

export default function WilksCoefficientCalculator() {
  const [inputs, setInputs] = useState({
    gender: "male",
    bodyWeight: "",
    totalLifted: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation of Wilks Coefficient and Wilks Score
  const results = useMemo(() => {
    const gender = inputs.gender;
    const bw = parseFloat(inputs.bodyWeight);
    const total = parseFloat(inputs.totalLifted);

    if (!gender || isNaN(bw) || isNaN(total) || bw <= 0 || total <= 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const coeffs = WILKS_COEFFICIENTS[gender];
    // Wilks formula denominator calculation
    // denominator = a + b*x + c*x^2 + d*x^3 + e*x^4 + f*x^5
    const x = bw;
    const denominator =
      coeffs.a +
      coeffs.b * x +
      coeffs.c * Math.pow(x, 2) +
      coeffs.d * Math.pow(x, 3) +
      coeffs.e * Math.pow(x, 4) +
      coeffs.f * Math.pow(x, 5);

    if (denominator <= 0) {
      return {
        value: "",
        label: "",
        subtext: "Bodyweight out of valid range for Wilks calculation.",
        warning: "Please enter a realistic bodyweight value.",
        formulaUsed: "Wilks coefficient denominator ≤ 0",
      };
    }

    const wilksCoefficient = 500 / denominator;
    const wilksScore = wilksCoefficient * total;

    return {
      value: wilksScore.toFixed(2),
      label: "Wilks Score",
      subtext:
        "The Wilks Score normalizes total lifted weight across bodyweights to compare strength fairly.",
      warning: null,
      formulaUsed:
        "Wilks Score = (500 / (a + b×BW + c×BW² + d×BW³ + e×BW⁴ + f×BW⁵)) × Total Lifted",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Wilks Coefficient and why is it important?",
      answer:
        "The Wilks Coefficient is a formula used in powerlifting to compare the strength of lifters across different bodyweight categories. It provides a fair metric by normalizing the total weight lifted relative to bodyweight, allowing athletes and coaches to assess performance regardless of size. This is crucial for ranking lifters in competitions where bodyweight classes differ.",
    },
    {
      question: "How accurate is the Wilks formula for comparing lifters?",
      answer:
        "While the Wilks formula is widely accepted and used internationally, it is an estimation and has some limitations, especially at extreme bodyweights. It was developed based on statistical analysis of competition data and provides a reasonable balance between simplicity and fairness. Alternative formulas like the IPF Points have been developed, but Wilks remains popular for its historical significance and ease of use.",
    },
    {
      question: "Can I use this calculator for both male and female lifters?",
      answer:
        "Yes, this calculator supports both male and female lifters by applying gender-specific coefficients in the Wilks formula. Since physiological differences affect strength-to-weight ratios, separate coefficients ensure the calculation remains fair and accurate for each gender category.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gender" className="mb-1 inline-block font-semibold">
                Gender
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
                aria-label="Select gender"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bodyWeight" className="mb-1 inline-block font-semibold">
                Bodyweight (kg)
              </Label>
              <Input
                id="bodyWeight"
                type="number"
                min="1"
                step="0.1"
                placeholder="Enter your bodyweight in kilograms"
                value={inputs.bodyWeight}
                onChange={(e) => handleInputChange("bodyWeight", e.target.value)}
                aria-describedby="bodyWeightHelp"
              />
              <p id="bodyWeightHelp" className="text-xs text-slate-500 mt-1">
                Enter your current bodyweight in kilograms. Must be &gt; 0.
              </p>
            </div>

            <div>
              <Label htmlFor="totalLifted" className="mb-1 inline-block font-semibold">
                Total Weight Lifted (kg)
              </Label>
              <Input
                id="totalLifted"
                type="number"
                min="1"
                step="0.1"
                placeholder="Enter total weight lifted (sum of squat, bench, deadlift)"
                value={inputs.totalLifted}
                onChange={(e) => handleInputChange("totalLifted", e.target.value)}
                aria-describedby="totalLiftedHelp"
              />
              <p id="totalLiftedHelp" className="text-xs text-slate-500 mt-1">
                Sum of your best squat, bench press, and deadlift lifts in kilograms. Must be &gt; 0.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; results update automatically
          }}
          aria-label="Calculate Wilks Score"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              gender: "male",
              bodyWeight: "",
              totalLifted: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold" role="alert">
                <AlertTriangle className="inline-block mr-1 h-4 w-4" aria-hidden="true" />
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
          Understanding Wilks Coefficient Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Wilks Coefficient Calculator is a powerful tool designed to help powerlifters, coaches, and sports scientists objectively compare strength performances across different bodyweight categories. Since heavier lifters can typically lift more weight, the Wilks formula normalizes total lifted weight relative to bodyweight, providing a fair and standardized score. This score enables meaningful comparisons between athletes of varying sizes, making it invaluable for competition rankings, talent identification, and training progress evaluation. The calculator uses gender-specific coefficients to ensure accuracy and fairness for both male and female lifters.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula is based on a polynomial equation with coefficients derived from extensive statistical analysis of powerlifting competition data. By applying this formula, the calculator outputs a Wilks Score, which represents the lifter's strength relative to their bodyweight. This score is widely recognized and used in powerlifting federations worldwide.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Wilks Coefficient Calculator is straightforward and requires only three inputs: gender, bodyweight, and total weight lifted. The total weight lifted is the sum of your best squat, bench press, and deadlift lifts, typically recorded during a competition or training session. Once you input these values, the calculator automatically computes your Wilks Score, allowing you to compare your strength performance fairly with others.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your gender from the dropdown menu. This ensures the correct coefficients are applied for the calculation.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your current bodyweight in kilograms. Ensure this value is accurate and greater than zero for a valid result.
          </li>
          <li>
            <strong>Step 3:</strong> Input the total weight lifted (sum of squat, bench press, and deadlift) in kilograms. This should be your best recorded lifts.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to generate your Wilks Score. The result will appear below the inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear all inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your Wilks Score, focus on balanced strength development across the three main lifts: squat, bench press, and deadlift. Consistent progressive overload, proper technique, and adequate recovery are essential components of effective training. Additionally, managing your bodyweight strategically can influence your Wilks Score; some lifters aim to optimize strength-to-weight ratio by adjusting bodyweight within their competition class limits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Nutrition, sleep, and injury prevention also play critical roles in sustaining long-term progress. Working with a qualified coach or sports scientist can help tailor your training program to your individual needs and goals, ensuring you improve your Wilks Score safely and effectively.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, powerlifting standards, and strength assessment methodologies, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for strength training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.powerlifting.sport/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Powerlifting Federation (IPF) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official governing body for international powerlifting competitions, offering rules, rankings, and performance standards.
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
              Leading organization for strength and conditioning professionals, providing research and education on strength assessment and training.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Wilks Coefficient Calculator"
      description="Calculate your Wilks Score. Compare powerlifting strength across different body weight categories fairly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Wilks Formula",
        formula:
          "Wilks Score = (500 / (a + b×BW + c×BW² + d×BW³ + e×BW⁴ + f×BW⁵)) × Total Lifted",
        variables: [
          { symbol: "BW", description: "Bodyweight in kilograms" },
          { symbol: "Total Lifted", description: "Sum of squat, bench press, and deadlift in kilograms" },
          { symbol: "a, b, c, d, e, f", description: "Gender-specific coefficients" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A male lifter weighs 90 kg and has a total lift of 600 kg (sum of squat, bench press, and deadlift). Calculate his Wilks Score to compare his strength with lifters of other bodyweights.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the coefficients for males: a = -216.0475144, b = 16.2606339, c = -0.002388645, d = -0.00113732, e = 7.01863e-06, f = -1.291e-08.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the denominator: a + b×90 + c×90² + d×90³ + e×90⁴ + f×90⁵.",
          },
          {
            label: "Step 3",
            explanation:
              "Compute Wilks coefficient: 500 divided by the denominator.",
          },
          {
            label: "Step 4",
            explanation:
              "Multiply the Wilks coefficient by total lifted weight (600 kg) to get the Wilks Score.",
          },
        ],
        result: "The Wilks Score is approximately 381.45, indicating the lifter's strength relative to bodyweight.",
      }}
      relatedCalculators={[
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
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