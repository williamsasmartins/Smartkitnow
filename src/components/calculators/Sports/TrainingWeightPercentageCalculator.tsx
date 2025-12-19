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

export default function TrainingWeightPercentageCalculator() {
  // Inputs: 1RM (one-rep max), desired percentage (e.g. 75%), unit (kg/lbs)
  const [inputs, setInputs] = useState({
    oneRepMax: "",
    percentage: "",
    unit: "kg",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic:
  // Training Weight = 1RM * (percentage / 100)
  // Validate inputs: 1RM > 0, percentage between 1 and 100
  const results = useMemo(() => {
    const oneRepMax = parseFloat(inputs.oneRepMax);
    const percentage = parseFloat(inputs.percentage);

    if (isNaN(oneRepMax) || oneRepMax <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid positive 1RM value.",
        warning: "Invalid 1RM input",
        formulaUsed: "Training Weight = 1RM × (Percentage / 100)",
      };
    }
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid percentage between 1 and 100.",
        warning: "Invalid percentage input",
        formulaUsed: "Training Weight = 1RM × (Percentage / 100)",
      };
    }

    const trainingWeight = oneRepMax * (percentage / 100);
    // Round to nearest 0.5 for practical weight increments
    const roundedWeight = Math.round(trainingWeight * 2) / 2;

    return {
      value: `${roundedWeight} ${inputs.unit}`,
      label: "Training Weight",
      subtext: `Calculated as ${percentage}% of your 1RM (${oneRepMax} ${inputs.unit}).`,
      warning: null,
      formulaUsed: "Training Weight = 1RM × (Percentage / 100)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Training Weight Percentage and why is it important?",
      answer:
        "Training Weight Percentage refers to the portion of your one-repetition maximum (1RM) used during a workout set. It is crucial for programming training loads to target specific adaptations such as hypertrophy, strength, or power. Using percentages helps athletes train within optimal intensity zones, reducing injury risk and maximizing performance gains.",
    },
    {
      question: "How do I accurately determine my 1RM?",
      answer:
        "Your 1RM is the maximum weight you can lift for one complete repetition with proper form. It can be estimated through submaximal testing protocols or directly tested under supervision. Accurate 1RM measurement is essential for effective percentage-based training prescriptions.",
    },
    {
      question: "Can I use this calculator for different units of measurement?",
      answer:
        "Yes, this calculator supports both kilograms (kg) and pounds (lbs). Ensure that your 1RM and desired training weights are in the same unit for accurate calculations.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="oneRepMax" className="flex items-center gap-2">
                <Dumbbell /> One-Rep Max (1RM)
              </Label>
              <Input
                id="oneRepMax"
                type="number"
                min="0"
                step="any"
                placeholder="Enter your 1RM"
                value={inputs.oneRepMax}
                onChange={(e) => handleInputChange("oneRepMax", e.target.value)}
                aria-describedby="oneRepMaxHelp"
              />
              <p id="oneRepMaxHelp" className="text-sm text-slate-500 mt-1">
                The maximum weight you can lift for one repetition.
              </p>
            </div>

            <div>
              <Label htmlFor="percentage" className="flex items-center gap-2">
                <Gauge /> Training Weight Percentage (%)
              </Label>
              <Input
                id="percentage"
                type="number"
                min="1"
                max="100"
                step="any"
                placeholder="Enter desired percentage"
                value={inputs.percentage}
                onChange={(e) => handleInputChange("percentage", e.target.value)}
                aria-describedby="percentageHelp"
              />
              <p id="percentageHelp" className="text-sm text-slate-500 mt-1">
                The percentage of your 1RM you want to train at (e.g., 75).
              </p>
            </div>

            <div>
              <Label htmlFor="unit" className="flex items-center gap-2">
                <Scale /> Unit
              </Label>
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
                id="unit"
                aria-label="Select weight unit"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
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
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate training weight"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oneRepMax: "", percentage: "", unit: "kg" })}
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
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mt-2">
          <AlertTriangle />
          <p>{results.warning}</p>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Training Weight Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Training Weight Percentage Calculator is a vital tool for athletes and coaches aiming to optimize strength training programs. It calculates the exact training load based on a percentage of an individual's one-repetition maximum (1RM), which is the maximal weight that can be lifted once with proper technique. This approach allows for precise load management tailored to specific training goals such as hypertrophy, maximal strength, or power development. By using percentages, athletes can systematically progress their training intensity while minimizing injury risk and ensuring recovery.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The concept of training percentages is grounded in exercise science and widely adopted in periodization models. For example, training at 60-75% of 1RM typically targets muscular endurance and hypertrophy, while 80-95% is used for maximal strength development. Power training often involves lower percentages with higher velocity movements. This calculator simplifies the process of determining these weights, making it accessible for all levels of athletes.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two key inputs: your one-repetition maximum (1RM) and the desired training percentage. The 1RM should be your most recent and accurate maximum lift for the exercise you plan to train. The percentage corresponds to the intensity level you want to train at, expressed as a percent of your 1RM.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your 1RM value in kilograms or pounds, depending on your preference.
          </li>
          <li>
            <strong>Step 2:</strong> Input the training percentage you want to calculate (e.g., 75 for 75%).
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit of measurement (kg or lbs) to match your inputs.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the training weight corresponding to your inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the calculated weight to guide your training session load.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize training effectiveness, it is essential to align your training weight percentages with your specific goals. For hypertrophy, training at 65-75% of your 1RM for 8-12 repetitions per set is commonly recommended. Strength-focused training often involves 80-90% of 1RM for lower reps (3-6). Power training requires explosive movements at 30-60% of 1RM with maximal velocity. Always incorporate proper warm-up sets and progressively increase load to avoid injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, regularly reassessing your 1RM every 4-6 weeks ensures your training percentages remain accurate and effective. Combining this calculator with periodized training plans can help you systematically improve strength and performance over time. Remember to listen to your body and adjust loads if you experience excessive fatigue or discomfort.
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
          For more information on training science and rules, consult the following sources:
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
              Global leader in sports medicine and exercise science research, providing guidelines on strength training and periodization.
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
              Authoritative source on strength training principles, 1RM testing protocols, and programming strategies.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20865697/how-to-calculate-your-1-rep-max/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World: How to Calculate Your 1-Rep Max <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical guide on estimating and testing your 1RM safely for effective training load management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Training Weight Percentage Calculator"
      description="Calculate training weights. Determine specific percentages of your 1RM to plan hypertrophy, strength, or power workouts."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Training Weight = 1RM × (Percentage / 100)",
        variables: [
          { symbol: "1RM", description: "One-Repetition Maximum weight" },
          { symbol: "Percentage", description: "Desired training intensity as a percentage of 1RM" },
          { symbol: "Training Weight", description: "Calculated training load" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete has a 1RM bench press of 100 kg and wants to train at 75% intensity for hypertrophy.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter 100 as the 1RM value in kilograms.",
          },
          {
            label: "Step 2",
            explanation: "Input 75 as the training percentage.",
          },
          {
            label: "Step 3",
            explanation: "Select 'kg' as the unit.",
          },
          {
            label: "Step 4",
            explanation: "Click 'Calculate' to get the training weight.",
          },
        ],
        result: "The calculator outputs 75 kg, which is the weight to use for training at 75% intensity.",
      }}
      relatedCalculators={[
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
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