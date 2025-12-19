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

function calculateWilksCoefficient(gender, bodyweightKg) {
  if (!gender || !bodyweightKg || bodyweightKg <= 0) return null;
  const coeffs = WILKS_COEFFICIENTS[gender];
  if (!coeffs) return null;
  const { a, b, c, d, e, f } = coeffs;
  const bw = bodyweightKg;
  // Wilks denominator polynomial
  const denominator =
    a +
    b * bw +
    c * bw ** 2 +
    d * bw ** 3 +
    e * bw ** 4 +
    f * bw ** 5;
  if (denominator === 0) return null;
  return 500 / denominator;
}

export default function WilksCoefficientCalculator() {
  const [inputs, setInputs] = useState({
    gender: "",
    bodyweight: "",
    totalLifted: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const gender = inputs.gender;
    const bodyweight = parseFloat(inputs.bodyweight);
    const totalLifted = parseFloat(inputs.totalLifted);

    if (!gender || isNaN(bodyweight) || bodyweight <= 0 || isNaN(totalLifted) || totalLifted <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid gender, bodyweight, and total lifted weight.",
        warning: null,
        formulaUsed: "",
      };
    }

    const wilksCoeff = calculateWilksCoefficient(gender, bodyweight);
    if (!wilksCoeff) {
      return {
        value: null,
        label: "",
        subtext: "Bodyweight out of valid range for Wilks calculation.",
        warning: "Ensure bodyweight is within typical competitive ranges.",
        formulaUsed: "",
      };
    }

    const wilksScore = (totalLifted * wilksCoeff).toFixed(2);

    return {
      value: wilksScore,
      label: "Wilks Score",
      subtext:
        "The Wilks Score normalizes your total lifted weight to compare strength across different bodyweights.",
      warning: null,
      formulaUsed:
        "Wilks Score = Total Lifted (kg) × Wilks Coefficient (calculated from bodyweight and gender)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Wilks Coefficient and why is it important?",
      answer:
        "The Wilks Coefficient is a formula used in powerlifting to fairly compare the strength of lifters across different bodyweight categories. It adjusts the total weight lifted by a coefficient based on bodyweight and gender, allowing for equitable competition and ranking.",
    },
    {
      question: "Can I use the Wilks Coefficient for non-powerlifting sports?",
      answer:
        "While primarily designed for powerlifting, the Wilks Coefficient can provide a relative strength comparison in other strength sports. However, other formulas like the IPF Points or Glossbrenner formula may be more appropriate depending on the sport and federation.",
    },
    {
      question: "What are the valid bodyweight ranges for this calculator?",
      answer:
        "The Wilks formula is most accurate within typical competitive bodyweight ranges: approximately 40kg to 200kg for men and 40kg to 150kg for women. Values outside these ranges may produce less reliable coefficients.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 shadow-md rounded-md">
        <div className="space-y-4">
          <div>
            <Label htmlFor="gender" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
              id="gender"
              aria-label="Select Gender"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  Male <Flag className="inline-block ml-1 w-4 h-4 text-blue-600" />
                </SelectItem>
                <SelectItem value="female">
                  Female <Flag className="inline-block ml-1 w-4 h-4 text-pink-600" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bodyweight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Bodyweight (kg)
            </Label>
            <Input
              id="bodyweight"
              type="number"
              min="30"
              max="200"
              step="0.1"
              placeholder="Enter your bodyweight in kilograms"
              value={inputs.bodyweight}
              onChange={(e) => handleInputChange("bodyweight", e.target.value)}
              aria-describedby="bodyweight-help"
            />
            <p id="bodyweight-help" className="text-xs text-slate-500 mt-1">
              Typical competitive range: 40kg to 200kg
            </p>
          </div>

          <div>
            <Label htmlFor="totalLifted" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Total Weight Lifted (kg)
            </Label>
            <Input
              id="totalLifted"
              type="number"
              min="1"
              step="0.5"
              placeholder="Sum of squat, bench press, and deadlift"
              value={inputs.totalLifted}
              onChange={(e) => handleInputChange("totalLifted", e.target.value)}
              aria-describedby="totalLifted-help"
            />
            <p id="totalLifted-help" className="text-xs text-slate-500 mt-1">
              Enter your combined total lifted weight in kilograms
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={() => {
              // Just triggers recalculation, no extra action needed
            }}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            aria-label="Calculate Wilks Score"
          >
            <Trophy className="mr-2 h-5 w-5" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() => setInputs({ gender: "", bodyweight: "", totalLifted: "" })}
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg rounded-md">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 max-w-xl mx-auto">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Wilks Coefficient Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Wilks Coefficient is a scientifically derived formula used extensively in powerlifting to normalize the total weight lifted by an athlete relative to their bodyweight and gender. This coefficient allows for fair comparison of strength across different weight classes by adjusting for the natural advantage heavier lifters have in absolute strength. The formula uses polynomial coefficients specific to males and females, reflecting physiological differences in strength scaling. By multiplying the total weight lifted by the Wilks coefficient, athletes and coaches can objectively assess relative strength performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Developed by Robert Wilks, this method has become a standard in many powerlifting federations worldwide, although newer formulas like IPF Points have emerged. Despite this, the Wilks formula remains a trusted and widely used metric for strength comparison and ranking in competitions. Understanding and utilizing this coefficient is essential for athletes aiming to benchmark their performance fairly against peers of varying bodyweights.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Wilks Coefficient Calculator is straightforward and requires three key inputs: your gender, your current bodyweight in kilograms, and the total weight you have lifted across the three main powerlifting lifts (squat, bench press, and deadlift). The calculator then applies the Wilks formula to compute a coefficient based on your bodyweight and gender, which is multiplied by your total lifted weight to give your Wilks Score.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Select your gender from the dropdown menu to ensure the correct coefficients are applied.</li>
          <li><strong>Step 2:</strong> Enter your bodyweight in kilograms. Ensure this is accurate and within typical competitive ranges for best results.</li>
          <li><strong>Step 3:</strong> Input your total lifted weight (sum of squat, bench press, and deadlift) in kilograms.</li>
          <li><strong>Step 4:</strong> Click the "Calculate" button to see your Wilks Score displayed prominently below the inputs.</li>
          <li><strong>Step 5:</strong> Use the Wilks Score to compare your relative strength against other lifters regardless of bodyweight differences.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your Wilks Score, focus on improving your total lifted weight through structured strength training programs emphasizing progressive overload, technique refinement, and recovery. Since the Wilks formula normalizes strength relative to bodyweight, maintaining an optimal body composition is crucial; excessive weight gain without strength improvements may reduce your score. Conversely, losing bodyweight while maintaining or increasing strength can enhance your Wilks Score, but should be done carefully to avoid performance loss.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate periodization strategies, including hypertrophy, strength, and peaking phases, to systematically increase your lifts. Nutrition, sleep, and injury prevention are equally important to sustain consistent progress. Regularly tracking your Wilks Score can help you objectively evaluate your training effectiveness and make informed adjustments to your regimen.
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
          For more information on strength training science, powerlifting standards, and performance metrics, consult the following authoritative sources:
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
              The ACSM is a global leader in exercise science and sports medicine, providing evidence-based guidelines for strength training and athletic performance.
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
              The NSCA offers comprehensive resources on strength training methodologies, testing protocols, and athlete development strategies.
            </p>
          </li>
          <li>
            <a
              href="https://www.powerlifting-ipf.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Powerlifting Federation (IPF) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The IPF governs international powerlifting competitions and provides official scoring systems, including the Wilks and IPF Points formulas.
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
          "Wilks Score = Total Lifted Weight (kg) × (500 / (a + b×W + c×W² + d×W³ + e×W⁴ + f×W⁵))",
        variables: [
          { symbol: "W", description: "Bodyweight in kilograms" },
          { symbol: "a,b,c,d,e,f", description: "Gender-specific coefficients" },
          { symbol: "Total Lifted Weight", description: "Sum of squat, bench press, and deadlift in kg" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A male lifter weighing 90 kg has a total lift of 600 kg (sum of squat, bench press, and deadlift). Calculate his Wilks Score.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the coefficients for males: a = -216.0475144, b = 16.2606339, c = -0.002388645, d = -0.00113732, e = 7.01863e-06, f = -1.291e-08.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the denominator: a + b×90 + c×90² + d×90³ + e×90⁴ + f×90⁵ ≈ -216.0475144 + 1463.457 + (-193.38) + (-83.01) + 51.5 + (-15.7) ≈ 1006.8 (approximate).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate Wilks coefficient: 500 / 1006.8 ≈ 0.4966.",
          },
          {
            label: "Step 4",
            explanation:
              "Multiply total lifted by coefficient: 600 × 0.4966 ≈ 297.96.",
          },
        ],
        result: "The lifter's Wilks Score is approximately 297.96, allowing comparison against lifters of different bodyweights.",
      }}
      relatedCalculators={[
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "Flame" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "Trophy" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "Trophy" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "Waves" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "Flag" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "Trophy" },
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