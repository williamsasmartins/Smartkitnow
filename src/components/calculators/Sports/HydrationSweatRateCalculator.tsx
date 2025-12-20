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
  const [inputs, setInputs] = useState({
    preWeight: "",
    postWeight: "",
    exerciseDuration: "",
    fluidConsumed: "",
    unit: "metric",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Sweat rate calculation logic:
  // Sweat Rate (L/hr) = ((Pre-exercise body mass - Post-exercise body mass) + Fluid consumed) / Exercise duration (hours)
  // Body mass in kg or lbs, fluid in liters or ounces, duration in minutes converted to hours.
  // Convert units accordingly.

  const results = useMemo(() => {
    const {
      preWeight,
      postWeight,
      exerciseDuration,
      fluidConsumed,
      unit,
    } = inputs;

    // Validate inputs
    if (
      !preWeight ||
      !postWeight ||
      !exerciseDuration ||
      !fluidConsumed ||
      Number(preWeight) <= 0 ||
      Number(postWeight) <= 0 ||
      Number(exerciseDuration) <= 0 ||
      Number(fluidConsumed) < 0
    ) {
      return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    // Parse numbers
    const preW = Number(preWeight);
    const postW = Number(postWeight);
    const durationMin = Number(exerciseDuration);
    const fluid = Number(fluidConsumed);

    // Convert duration to hours
    const durationHr = durationMin / 60;

    // Convert weights and fluids to metric units (kg and liters) for calculation
    // 1 lb = 0.453592 kg
    // 1 fl oz = 0.0295735 liters
    let preWeightKg = preW;
    let postWeightKg = postW;
    let fluidLiters = fluid;

    if (unit === "imperial") {
      preWeightKg = preW * 0.453592;
      postWeightKg = postW * 0.453592;
      fluidLiters = fluid * 0.0295735;
    }

    // Calculate sweat loss in liters
    // Sweat loss = (pre-exercise mass - post-exercise mass) + fluid consumed
    // Note: mass difference in kg approximates liters lost (1 kg ≈ 1 L water)
    const sweatLossLiters = (preWeightKg - postWeightKg) + fluidLiters;

    // Sweat rate L/hr
    const sweatRate = sweatLossLiters / durationHr;

    // Warning if sweat rate is negative or unrealistic
    let warning = null;
    if (sweatRate < 0) {
      warning = "Warning: Negative sweat rate calculated. Check your inputs for accuracy.";
    } else if (sweatRate > 3) {
      warning = "High sweat rate detected. Ensure adequate hydration during exercise.";
    }

    // Format result to 2 decimals
    const sweatRateFormatted = sweatRate.toFixed(2);

    // Display units accordingly
    const displayUnit = "L/hr";

    return {
      value: `${sweatRateFormatted} ${displayUnit}`,
      label: "Estimated Sweat Rate",
      subtext: "This is the volume of fluid lost per hour during exercise.",
      warning,
      formulaUsed:
        "Sweat Rate (L/hr) = ((Pre-exercise body mass - Post-exercise body mass) + Fluid consumed) / Exercise duration (hours)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to calculate sweat rate?",
      answer:
        "Calculating sweat rate helps athletes understand their individual fluid loss during exercise. This knowledge allows for tailored hydration strategies to prevent dehydration, optimize performance, and reduce the risk of heat-related illnesses. Sweat rates vary widely between individuals and conditions, so personalized data is essential.",
    },
    {
      question: "How accurate is the sweat rate calculation?",
      answer:
        "The sweat rate calculation provides an estimate based on body mass changes and fluid intake during exercise. Accuracy depends on precise measurements of body weight before and after exercise, accurate recording of fluid consumed, and consistent exercise conditions. Environmental factors and clothing can also affect results.",
    },
    {
      question: "Can I use this calculator for all types of exercise?",
      answer:
        "This calculator is most accurate for steady-state endurance activities where sweat loss is the primary fluid loss. For activities with frequent breaks or variable intensity, results may be less precise. Always consider environmental conditions and individual variability when interpreting results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preWeight">
                Pre-exercise Body Weight{" "}
                <Info className="inline-block w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="preWeight"
                type="number"
                min="0"
                step="any"
                placeholder={`e.g. ${inputs.unit === "metric" ? "70 (kg)" : "154 (lbs)"}`}
                value={inputs.preWeight}
                onChange={(e) => handleInputChange("preWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postWeight">
                Post-exercise Body Weight{" "}
                <Info className="inline-block w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="postWeight"
                type="number"
                min="0"
                step="any"
                placeholder={`e.g. ${inputs.unit === "metric" ? "69 (kg)" : "152 (lbs)"}`}
                value={inputs.postWeight}
                onChange={(e) => handleInputChange("postWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="exerciseDuration">
                Exercise Duration (minutes){" "}
                <Timer className="inline-block w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="exerciseDuration"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 60"
                value={inputs.exerciseDuration}
                onChange={(e) => handleInputChange("exerciseDuration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fluidConsumed">
                Fluid Consumed During Exercise{" "}
                <Waves className="inline-block w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="fluidConsumed"
                type="number"
                min="0"
                step="any"
                placeholder={`e.g. ${inputs.unit === "metric" ? "0.5 (L)" : "16 (fl oz)"}`}
                value={inputs.fluidConsumed}
                onChange={(e) => handleInputChange("fluidConsumed", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="unit">Units</Label>
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
              >
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, liters)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, fl oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              preWeight: "",
              postWeight: "",
              exerciseDuration: "",
              fluidConsumed: "",
              unit: "metric",
            })
          }
          className="flex-1 h-11"
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
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
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
          Understanding Hydration / Sweat Rate Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Hydration / Sweat Rate Calculator is an essential tool for athletes,
          coaches, and sports scientists aiming to optimize hydration strategies
          during endurance exercise. Sweat rate quantifies the volume of fluid lost
          through sweating per hour, which varies based on exercise intensity,
          environmental conditions, and individual physiology. Understanding your
          sweat rate allows you to tailor fluid intake to maintain optimal hydration,
          prevent dehydration, and sustain performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses pre- and post-exercise body weight measurements,
          along with fluid consumed and exercise duration, to estimate sweat loss.
          The formula assumes that changes in body mass primarily reflect fluid loss,
          and accounts for fluid intake during exercise. Accurate measurements and
          consistent conditions improve the reliability of the results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By regularly monitoring sweat rate, athletes can adjust hydration plans
          to match their unique needs, reducing risks of heat illness and improving
          recovery. This calculator supports evidence-based hydration practices
          recommended by leading sports science organizations.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your sweat rate, you will need to measure your
          body weight immediately before and after exercise, record the duration
          of your workout, and track the amount of fluid consumed during exercise.
          Ensure you use consistent units throughout the process, either metric or
          imperial, and select the appropriate unit system in the calculator.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Step 1: Measure your pre-exercise body weight using a calibrated scale,
            ideally in minimal clothing and after voiding your bladder.
          </li>
          <li>
            Step 2: Record the total duration of your exercise session in minutes.
          </li>
          <li>
            Step 3: Track the volume of fluid you consume during exercise in liters
            or fluid ounces.
          </li>
          <li>
            Step 4: Immediately after exercise, measure your post-exercise body
            weight under similar conditions as the pre-exercise measurement.
          </li>
          <li>
            Step 5: Input all values into the calculator, select your preferred unit
            system, and click &quot;Calculate&quot; to obtain your sweat rate.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining proper hydration is critical for endurance performance and
          safety. Aim to replace fluid losses during exercise to keep body mass
          changes within ±2%. Drinking &gt; sweat rate can cause discomfort and
          hyponatremia, while drinking &lt; sweat rate risks dehydration and heat
          stress. Use your sweat rate to guide fluid intake plans tailored to your
          exercise intensity, duration, and environmental conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember to hydrate before exercise begins, and consider electrolyte
          replacement for sessions lasting longer than 60 minutes or in hot,
          humid environments. Regularly reassess your sweat rate under different
          conditions to refine your hydration strategy. Always listen to your body
          and adjust fluid intake accordingly.
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
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on hydration, sweat rate, and sports performance,
          consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science,
              providing evidence-based guidelines on hydration and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA){" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers research and position statements on hydration strategies
              and athlete safety during training and competition.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/heattolerance.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention (CDC) - Heat Stress and Hydration{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The CDC provides practical guidance on hydration and heat-related illness
              prevention for athletes and active individuals.
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
        title: "Formula",
        formula:
          "Sweat Rate (L/hr) = ((Pre-exercise body mass - Post-exercise body mass) + Fluid consumed) / Exercise duration (hours)",
        variables: [
          {
            symbol: "Pre-exercise body mass",
            description: "Body weight before exercise (kg or lbs)",
          },
          {
            symbol: "Post-exercise body mass",
            description: "Body weight after exercise (kg or lbs)",
          },
          {
            symbol: "Fluid consumed",
            description: "Volume of fluid consumed during exercise (liters or fluid ounces)",
          },
          {
            symbol: "Exercise duration",
            description: "Duration of exercise in hours",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete weighs 70 kg before a 90-minute run and 69 kg immediately after. During the run, they consumed 0.5 liters of water. Calculate their sweat rate.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the body mass loss: 70 kg - 69 kg = 1 kg (equivalent to 1 liter of fluid lost).",
          },
          {
            label: "Step 2",
            explanation:
              "Add fluid consumed: 1 L + 0.5 L = 1.5 L total fluid lost.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert exercise duration to hours: 90 minutes ÷ 60 = 1.5 hours.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate sweat rate: 1.5 L ÷ 1.5 hours = 1.0 L/hr.",
          },
        ],
        result:
          "The athlete's sweat rate is 1.0 liters per hour, indicating the volume of fluid they lose through sweat during exercise.",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
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