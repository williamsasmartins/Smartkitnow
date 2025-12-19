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

export default function HydrationSweatRateCalculator() {
  /**
   * Inputs:
   * - Pre-exercise body weight (kg or lbs)
   * - Post-exercise body weight (kg or lbs)
   * - Exercise duration (minutes)
   * - Fluid consumed during exercise (ml or oz)
   * - Unit system (metric or imperial)
   */

  const [inputs, setInputs] = useState({
    unitSystem: "metric",
    preWeight: "",
    postWeight: "",
    duration: "",
    fluidConsumed: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion helpers
  const lbsToKg = (lbs) => lbs / 2.20462;
  const ozToMl = (oz) => oz * 29.5735;

  // Sweat rate calculation logic
  // Sweat Rate (L/hr) = ((Pre-exercise weight - Post-exercise weight) + Fluid consumed) / Exercise duration (hours)
  // Weight difference and fluid consumed must be in liters (kg ~ L for water)
  const results = useMemo(() => {
    const {
      unitSystem,
      preWeight,
      postWeight,
      duration,
      fluidConsumed,
    } = inputs;

    // Validate inputs
    if (
      !preWeight ||
      !postWeight ||
      !duration ||
      !fluidConsumed ||
      Number(preWeight) <= 0 ||
      Number(postWeight) <= 0 ||
      Number(duration) <= 0 ||
      Number(fluidConsumed) < 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: "",
      };
    }

    // Parse inputs
    let preW = Number(preWeight);
    let postW = Number(postWeight);
    let dur = Number(duration);
    let fluid = Number(fluidConsumed);

    // Convert to metric if imperial
    if (unitSystem === "imperial") {
      preW = lbsToKg(preW);
      postW = lbsToKg(postW);
      fluid = ozToMl(fluid);
    }

    // Convert fluid from ml to liters
    const fluidLiters = fluid / 1000;

    // Weight loss in kg ~ liters of sweat lost
    const weightLoss = preW - postW;

    if (weightLoss < 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning:
          "Post-exercise weight cannot be greater than pre-exercise weight. Please check your inputs.",
        formulaUsed: "",
      };
    }

    // Duration in hours
    const durationHours = dur / 60;

    // Sweat rate in L/hr
    const sweatRate = (weightLoss + fluidLiters) / durationHours;

    // Hydration recommendation: ACSM suggests matching sweat rate with fluid intake to avoid dehydration.
    const hydrationAdvice =
      sweatRate > 1.5
        ? "High sweat rate detected. Ensure adequate fluid intake before, during, and after exercise."
        : "Sweat rate within typical range. Maintain regular hydration.";

    return {
      value: sweatRate.toFixed(2) + " L/hr",
      label: "Estimated Sweat Rate",
      subtext: hydrationAdvice,
      warning: null,
      formulaUsed:
        "Sweat Rate (L/hr) = ((Pre-exercise weight - Post-exercise weight) + Fluid consumed) / Exercise duration (hours)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is calculating sweat rate important for athletes?",
      answer:
        "Calculating sweat rate helps athletes understand their individual fluid loss during exercise, enabling them to tailor hydration strategies to prevent dehydration, optimize performance, and reduce the risk of heat-related illnesses.",
    },
    {
      question: "Can sweat rate vary between different types of exercise?",
      answer:
        "Yes, sweat rate varies depending on exercise intensity, duration, environmental conditions, and individual physiology. For example, running in hot weather typically results in higher sweat rates than cycling in cooler conditions.",
    },
    {
      question: "How often should I measure my sweat rate?",
      answer:
        "It is recommended to measure sweat rate periodically, especially when training conditions change (e.g., temperature, humidity) or when preparing for endurance events to adjust hydration plans accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitSystem" className="mb-1 flex items-center gap-1">
                Unit System <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.unitSystem}
                onValueChange={(v) => handleInputChange("unitSystem", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, ml)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preWeight" className="mb-1 flex items-center gap-1">
                Pre-exercise Body Weight{" "}
                <Scale className="w-4 h-4 text-green-600" />
              </Label>
              <Input
                id="preWeight"
                type="number"
                min="0"
                step="any"
                placeholder={inputs.unitSystem === "metric" ? "kg" : "lbs"}
                value={inputs.preWeight}
                onChange={(e) => handleInputChange("preWeight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="postWeight" className="mb-1 flex items-center gap-1">
                Post-exercise Body Weight{" "}
                <Scale className="w-4 h-4 text-red-600" />
              </Label>
              <Input
                id="postWeight"
                type="number"
                min="0"
                step="any"
                placeholder={inputs.unitSystem === "metric" ? "kg" : "lbs"}
                value={inputs.postWeight}
                onChange={(e) => handleInputChange("postWeight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="duration" className="mb-1 flex items-center gap-1">
                Exercise Duration{" "}
                <Timer className="w-4 h-4 text-orange-600" />
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                step="any"
                placeholder="minutes"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fluidConsumed" className="mb-1 flex items-center gap-1">
                Fluid Consumed During Exercise{" "}
                <Waves className="w-4 h-4 text-blue-400" />
              </Label>
              <Input
                id="fluidConsumed"
                type="number"
                min="0"
                step="any"
                placeholder={inputs.unitSystem === "metric" ? "ml" : "oz"}
                value={inputs.fluidConsumed}
                onChange={(e) => handleInputChange("fluidConsumed", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers re-render, calculation is memoized
            setInputs((p) => ({ ...p }));
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unitSystem: "metric",
              preWeight: "",
              postWeight: "",
              duration: "",
              fluidConsumed: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 mt-4">
          <CardContent className="p-4 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-4">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Formula used: {results.formulaUsed}
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
          Understanding Hydration / Sweat Rate Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Hydration / Sweat Rate Calculator is an essential tool for athletes,
          coaches, and sports scientists aiming to optimize hydration strategies
          during training and competition. Sweat rate quantifies the amount of fluid
          lost through sweating per hour of exercise, which varies widely among
          individuals depending on factors such as exercise intensity, environmental
          conditions, clothing, and individual physiology. Understanding your sweat
          rate allows for precise fluid replacement, reducing the risk of dehydration,
          heat illness, and performance decline.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses pre- and post-exercise body weight measurements along
          with fluid intake and exercise duration to estimate sweat loss. Since 1 kg
          of weight loss roughly equals 1 liter of sweat lost, this method provides a
          practical and accurate assessment of hydration needs tailored to your
          specific conditions.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your sweat rate, follow these steps carefully.
          First, measure your body weight immediately before exercise without clothes
          or with minimal clothing to reduce measurement error. Next, record your
          body weight immediately after exercise, again under similar conditions.
          Ensure you measure the total duration of exercise in minutes and track the
          volume of fluid consumed during the session.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Metric or
            Imperial).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your pre-exercise body weight in kg or
            lbs.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your post-exercise body weight in the same
            units.
          </li>
          <li>
            <strong>Step 4:</strong> Input the total exercise duration in minutes.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the total fluid volume consumed during
            exercise in ml or oz.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see your estimated sweat
            rate in liters per hour.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Use this information to tailor your hydration strategy, aiming to replace
          fluids at a rate close to your sweat loss to maintain optimal hydration
          status.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Hydration strategies should be individualized based on your sweat rate,
          environmental conditions, and exercise demands. Begin by drinking fluids
          before you feel thirsty to maintain hydration. During prolonged exercise,
          aim to consume fluids at a rate that approximates your sweat loss, but avoid
          overhydration, which can lead to hyponatremia.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Consider electrolyte replacement, especially during long-duration or high-
          intensity exercise in hot environments, as sweat contains sodium and other
          minerals. Regularly monitor your body weight and urine color as practical
          indicators of hydration status. Finally, practice your hydration plan during
          training to ensure gastrointestinal comfort and effectiveness on race day.
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
          For more information on hydration, sweat rate, and exercise science, consult
          the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/read-research/resource-library"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine (ACSM) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              ACSM provides comprehensive guidelines on exercise hydration, sweat rate
              assessment, and sports nutrition based on cutting-edge research.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/contentassets/2b2a7e1b7d3b4e7a8f8d9c7f3a7c9d9a/nsca-position-stands.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              NSCA position stands and articles provide evidence-based recommendations
              on hydration strategies and sweat rate monitoring for athletes.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20803183/how-to-calculate-your-sweat-rate/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World: How to Calculate Your Sweat Rate <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical guide for runners on measuring sweat rate and adjusting hydration
              plans accordingly.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hydration / Sweat Rate Calculator"
      description="Calculate your sweat rate. Determine exactly how much fluid you need to drink to stay hydrated during endurance events."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Sweat Rate Formula",
        formula:
          "Sweat Rate (L/hr) = ((Pre-exercise weight - Post-exercise weight) + Fluid consumed) / Exercise duration (hours)",
        variables: [
          { symbol: "Pre-exercise weight", description: "Body weight before exercise (kg or lbs)" },
          { symbol: "Post-exercise weight", description: "Body weight after exercise (kg or lbs)" },
          { symbol: "Fluid consumed", description: "Volume of fluid consumed during exercise (L or oz)" },
          { symbol: "Exercise duration", description: "Duration of exercise in hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete weighs 70.0 kg before a 90-minute run and 68.5 kg after. During the run, they consumed 500 ml of water.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate weight loss: 70.0 kg - 68.5 kg = 1.5 kg (equivalent to 1.5 liters sweat loss).",
          },
          {
            label: "Step 2",
            explanation:
              "Add fluid consumed: 1.5 L + 0.5 L = 2.0 L total fluid lost.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert exercise duration to hours: 90 minutes = 1.5 hours.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate sweat rate: 2.0 L / 1.5 hours = 1.33 L/hr.",
          },
        ],
        result:
          "The athlete's sweat rate is 1.33 liters per hour, indicating their hydration needs during similar exercise conditions.",
      }}
      relatedCalculators={[
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
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