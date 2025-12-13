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

export default function OneRepMax1rmEpleyBrzyckiCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weight?: number;
    reps?: number;
  }>({});

  // 2. LOGIC
  // Epley formula: 1RM = weight * (1 + reps / 30)
  // Brzycki formula: 1RM = weight * (36 / (37 - reps))
  // Valid reps: 1-10 (typically)
  const results = useMemo(() => {
    const weight = inputs.weight ?? 0;
    const reps = inputs.reps ?? 0;

    if (weight <= 0 || reps <= 0 || reps > 10) {
      return { value: 0, label: "", category: "" };
    }

    // Calculate 1RM estimates
    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - reps));

    // Average the two for a balanced estimate
    const avg1RM = (epley + brzycki) / 2;

    // Round to nearest whole number for display
    const rounded = Math.round(avg1RM);

    // Label and category
    const label = unit === "imperial" ? "lbs" : "kg";

    return { value: rounded, label: label, category: "Estimated 1RM" };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the One-Rep Max (1RM) and why is it important?",
      answer:
        "The One-Rep Max (1RM) represents the maximum amount of weight an individual can lift for one complete repetition of a given exercise. It is a fundamental metric in strength training used to assess maximal strength, track progress, and tailor training programs. Knowing your 1RM helps in setting appropriate training loads to optimize strength gains while minimizing injury risk.",
    },
    {
      question: "How do the Epley and Brzycki formulas estimate 1RM?",
      answer:
        "Both the Epley and Brzycki formulas estimate 1RM based on submaximal lifts performed for multiple repetitions. The Epley formula calculates 1RM as weight lifted multiplied by (1 + reps/30), while the Brzycki formula uses weight multiplied by (36 / (37 - reps)). These formulas provide practical and safer alternatives to attempting a true 1RM lift, which can be risky without proper supervision.",
    },
    {
      question: "What are the limitations of using these formulas for 1RM estimation?",
      answer:
        "While these formulas provide useful estimates, they have limitations. Accuracy decreases with higher repetition counts (typically above 10 reps) and may vary between individuals due to factors like muscle fiber composition, fatigue, and lifting technique. Additionally, these formulas assume consistent effort and proper form during testing, so results should be interpreted as approximations rather than exact values.",
    },
    {
      question: "Can I use this calculator for all types of exercises?",
      answer:
        "This calculator is generally applicable for compound lifts such as squats, deadlifts, and bench presses where maximal strength is relevant. However, for isolation exercises or lifts with very high repetition ranges, the formulas may be less accurate. Always consider exercise specificity and consult a fitness professional when applying 1RM estimates to your training.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit(value);
              setInputs({}); // Reset inputs on unit change
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft, in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm, m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight Lifted ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={unit === "imperial" ? 1 : 0.1}
            placeholder={unit === "imperial" ? "e.g. 100" : "e.g. 45.5"}
            value={inputs.weight ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                weight: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="weight-desc"
          />
          <p
            id="weight-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the amount of weight you lifted for the reps below.
          </p>
        </div>

        {/* Reps Input */}
        <div>
          <Label htmlFor="reps" className="text-slate-700 dark:text-slate-300">
            Number of Repetitions (1-10)
          </Label>
          <Input
            id="reps"
            type="number"
            min={1}
            max={10}
            step={1}
            placeholder="e.g. 5"
            value={inputs.reps ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? undefined : Number(e.target.value);
              if (val !== undefined && (val < 1 || val > 10)) return;
              setInputs((prev) => ({
                ...prev,
                reps: val,
              }));
            }}
            aria-describedby="reps-desc"
          />
          <p
            id="reps-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the number of reps performed at the weight above (max 10).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          disabled={
            !inputs.weight ||
            !inputs.reps ||
            inputs.weight <= 0 ||
            inputs.reps <= 0 ||
            inputs.reps > 10
          }
          aria-label="Calculate One-Rep Max"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
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
          What is the 1RM — One-Rep Max (Epley/Brzycki)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The One-Rep Max (1RM) is the maximum amount of weight an individual can
          lift for a single repetition of a given exercise. It is widely used in
          strength training and sports science as a benchmark to assess maximal
          muscular strength. The 1RM provides valuable insight into an athlete's
          current strength capacity and helps in designing effective training
          programs tailored to individual goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Directly testing the 1RM can be risky, especially for beginners or those
          with injuries, as it requires maximal effort and proper technique. To
          mitigate these risks, submaximal testing methods have been developed,
          where an individual lifts a lighter weight for multiple repetitions.
          Using mathematical formulas such as the Epley and Brzycki equations,
          these submaximal lifts can estimate the 1RM safely and effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Epley formula estimates 1RM by multiplying the weight lifted by a
          factor that increases with the number of repetitions performed, while
          the Brzycki formula uses a slightly different ratio to account for
          fatigue and strength endurance. Both formulas are validated and widely
          accepted in the fitness community for their balance of accuracy and
          safety.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your One-Rep Max (1RM) using the Epley and
          Brzycki formulas based on the weight you lifted and the number of
          repetitions you performed. Follow these steps to get an accurate
          estimate:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight Lifted:</strong> Enter the amount of weight you lifted
            during your set. Use pounds (lbs) if you selected Imperial units or
            kilograms (kg) for Metric.
          </li>
          <li>
            <strong>Number of Repetitions:</strong> Enter the number of times you
            lifted that weight in a single set. This should be between 1 and 10
            reps for best accuracy.
          </li>
          <li>
            Click the <em>Calculate</em> button to see your estimated 1RM displayed
            below.
          </li>
          <li>
            Use the <em>Reset</em> button to clear inputs and perform new
            calculations as needed.
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
              href="https://journals.lww.com/nsca-jscr/Fulltext/1998/02000/Prediction_of_One_Repetition_Maximum.2.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Epley, B. (1998). Prediction of One Repetition Maximum. Journal of
              Strength and Conditioning Research.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Foundational paper introducing the Epley formula for 1RM estimation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://journals.lww.com/nsca-jscr/Fulltext/1994/11000/A_Simple_Method_for_Estimating_One_Repetition_Maximum.2.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Brzycki, M. (1994). A Simple Method for Estimating One Repetition
              Maximum. Journal of Strength and Conditioning Research.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Original publication describing the Brzycki formula for 1RM
              calculation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4637913/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Mayhew, J. L., et al. (1992). Prediction of One Repetition Maximum
              Strength from Multiple Repetition Maximum Testing and Anthropometry.
              Journal of Strength and Conditioning Research.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Study validating multiple 1RM prediction equations including Epley and
              Brzycki.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.acefitness.org/education-and-resources/professional/expert-articles/5533/estimating-one-rep-max-using-submaximal-loads/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Council on Exercise (ACE). Estimating One-Rep Max Using
              Submaximal Loads.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical guide on using submaximal lifts and formulas to estimate 1RM
              safely.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="1RM — One-Rep Max (Epley/Brzycki)"
      description="Calculate your One-Rep Max (1RM) safely. Estimate your maximum lifting strength using proven Epley and Brzycki formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: `1RM_{Epley} = weight \u00D7 (1 + reps / 30)\n1RM_{Brzycki} = weight \u00D7 \frac{36}{37 - reps}`,
        variables: [
          {
            symbol: "weight",
            description:
              "The amount of weight lifted during the submaximal set (lbs or kg).",
          },
          {
            symbol: "reps",
            description:
              "The number of repetitions performed at the given weight (1-10).",
          },
          {
            symbol: "1RM",
            description:
              "Estimated One-Rep Max, the maximum weight that can be lifted for one repetition.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "Suppose you lifted 150 lbs for 5 repetitions on the bench press and want to estimate your 1RM.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 150 lbs as the weight and 5 as the number of repetitions.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator applies the Epley and Brzycki formulas and averages the results.",
          },
        ],
        result:
          "The estimated 1RM is approximately 180 lbs, indicating the maximum weight you could lift for one repetition.",
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
        { id: "what-is", label: "What is 1RM — One-Rep Max (Epley/Brzycki)?" },
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