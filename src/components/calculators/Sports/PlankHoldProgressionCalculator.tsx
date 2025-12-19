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

export default function PlankHoldProgressionCalculator() {
  /**
   * Inputs:
   * - currentHold: current max plank hold time in seconds
   * - trainingFrequency: days per week dedicated to plank training
   * - trainingDurationWeeks: number of weeks planned for progression
   * 
   * Output:
   * - projectedHold: projected max plank hold time after trainingDurationWeeks
   * - weeklyIncrement: recommended weekly increment in seconds
   * - notes: warnings or advice
   */

  const [inputs, setInputs] = useState({
    currentHold: "",
    trainingFrequency: "3",
    trainingDurationWeeks: "8",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const currentHold = parseFloat(inputs.currentHold);
    const trainingFrequency = parseInt(inputs.trainingFrequency, 10);
    const trainingDurationWeeks = parseInt(inputs.trainingDurationWeeks, 10);

    if (
      isNaN(currentHold) ||
      currentHold <= 0 ||
      isNaN(trainingFrequency) ||
      trainingFrequency <= 0 ||
      trainingFrequency > 7 ||
      isNaN(trainingDurationWeeks) ||
      trainingDurationWeeks <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs. Training frequency must be between 1 and 7 days per week.",
        formulaUsed: "",
      };
    }

    /**
     * Scientific basis:
     * Progressive overload for isometric holds like planks typically recommends increasing hold time by about 5-10% per week,
     * depending on frequency and recovery. Excessive increments risk injury or burnout.
     * 
     * Formula:
     * projectedHold = currentHold * (1 + weeklyIncrement) ^ trainingDurationWeeks
     * weeklyIncrement = baseIncrement adjusted by frequency factor
     * 
     * Frequency factor:
     * - 1-2 days/week: 5% weekly increment
     * - 3-4 days/week: 7% weekly increment
     * - 5-7 days/week: 10% weekly increment (only for advanced trainees)
     * 
     * We cap increments to avoid unrealistic projections.
     */

    let baseIncrement = 0.05; // 5%
    if (trainingFrequency >= 3 && trainingFrequency <= 4) {
      baseIncrement = 0.07;
    } else if (trainingFrequency >= 5) {
      baseIncrement = 0.10;
    }

    // Cap max hold time at 10 minutes (600 seconds) for safety and realism
    const maxHoldTime = 600;

    // Calculate projected hold time
    let projectedHold = currentHold * Math.pow(1 + baseIncrement, trainingDurationWeeks);
    if (projectedHold > maxHoldTime) projectedHold = maxHoldTime;

    // Weekly increment in seconds (approximate)
    const weeklyIncrementSeconds = currentHold * baseIncrement;

    // Format results nicely
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      if (mins > 0) return `${mins}m ${secs}s`;
      return `${secs}s`;
    };

    // Warning if current hold is very low or very high
    let warning = null;
    if (currentHold < 10) {
      warning =
        "Your current hold time is quite low. Focus on building basic core endurance before aggressive progression.";
    } else if (currentHold > 300) {
      warning =
        "Your current hold time is advanced. Consider consulting a professional to tailor your progression safely.";
    }

    return {
      value: formatTime(projectedHold),
      label: "Projected Max Plank Hold Time",
      subtext: `Based on a weekly increment of approx. ${weeklyIncrementSeconds.toFixed(
        1
      )} seconds (${(baseIncrement * 100).toFixed(0)}%)`,
      warning,
      formulaUsed:
        "Projected Hold = Current Hold × (1 + Weekly Increment) ^ Number of Weeks, where Weekly Increment depends on training frequency.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How often should I train planks to see progression?",
      answer:
        "Training planks 3-4 times per week is optimal for most individuals to balance progression and recovery. Training too frequently without rest can lead to fatigue and injury, while training too infrequently may slow progress. Adjust frequency based on your fitness level and recovery capacity.",
    },
    {
      question: "Is it better to hold one long plank or multiple shorter planks?",
      answer:
        "Both approaches have benefits. Holding one long plank builds endurance and mental toughness, while multiple shorter sets can improve form and reduce fatigue. A combination of both, progressively increasing total hold time, is recommended for balanced core development.",
    },
    {
      question: "Can I use this calculator if I am a beginner?",
      answer:
        "Yes, but beginners should start with manageable hold times and focus on proper form. The calculator provides projections based on your current hold time and training frequency, but always listen to your body and avoid pushing beyond safe limits.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentHold" className="flex items-center gap-2">
                <Timer className="w-4 h-4" /> Current Max Hold Time (seconds)
              </Label>
              <Input
                id="currentHold"
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 60"
                value={inputs.currentHold}
                onChange={(e) => handleInputChange("currentHold", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="trainingFrequency" className="flex items-center gap-2">
                <Activity className="w-4 h-4" /> Training Frequency (days/week)
              </Label>
              <Select
                value={inputs.trainingFrequency}
                onValueChange={(v) => handleInputChange("trainingFrequency", v)}
                id="trainingFrequency"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trainingDurationWeeks" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Training Duration (weeks)
              </Label>
              <Input
                id="trainingDurationWeeks"
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 8"
                value={inputs.trainingDurationWeeks}
                onChange={(e) => handleInputChange("trainingDurationWeeks", e.target.value)}
              />
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
              currentHold: "",
              trainingFrequency: "3",
              trainingDurationWeeks: "8",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-4 text-sm text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Plank / Hold Time Progression
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The plank is a fundamental isometric exercise that targets core musculature, including the rectus abdominis,
          transverse abdominis, and obliques, as well as the lower back and shoulders. Progression in plank hold time is
          a key indicator of improved core endurance and stability, which are essential for athletic performance and injury
          prevention. However, progression must be gradual to avoid overtraining and maintain proper form, which is critical
          to maximize benefits and minimize injury risk. This calculator helps you plan a scientifically grounded progression
          based on your current ability, training frequency, and duration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Research suggests that increasing hold times by approximately 5-10% per week, adjusted for training frequency,
          is optimal for most individuals. This approach balances progressive overload with adequate recovery, ensuring
          sustainable improvements in core strength and endurance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, input your current maximum plank hold time in seconds, select how many days
          per week you plan to train planks, and specify the number of weeks you intend to follow this training plan. The
          calculator will then project your expected maximum hold time at the end of the training period, based on evidence-based
          progression rates.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your current maximum plank hold time with proper form and enter it in seconds.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your planned training frequency, ideally between 3 to 5 days per week for optimal
            progression.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the number of weeks you plan to follow this progression program.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your projected plank hold time and recommended weekly increments.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide your training, ensuring gradual increases and adequate recovery.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistency and proper technique are paramount when progressing plank hold times. Always prioritize maintaining a
          neutral spine and avoid sagging hips or elevated buttocks, as poor form reduces effectiveness and increases injury risk.
          Incorporate rest days to allow muscular recovery, especially if training frequency is high. Additionally, complement
          plank training with dynamic core exercises and mobility work to enhance overall core function and prevent imbalances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you experience pain or excessive fatigue, reduce hold times or frequency and consult a qualified professional.
          Remember that progression is individual; listen to your body and adjust accordingly. Tracking your progress regularly
          will help you stay motivated and make informed adjustments to your training plan.
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
              Global leader in sports medicine and exercise science research.
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
              Authoritative source on strength training and conditioning best practices.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/football-development/medical/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FIFA Medical and Research Centre <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights into athlete conditioning and injury prevention protocols.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Custom Calendar icon for training duration input (lucide-react does not have Calendar by default)
  function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  return (
    <CalculatorVerticalLayout
      title="Plank / Hold Time Progression"
      description="Track core strength progression. Log and plan plank hold times to gradually build abdominal endurance and stability."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Projected Hold = Current Hold × (1 + Weekly Increment) ^ Number of Weeks, where Weekly Increment depends on training frequency.",
        variables: [
          { symbol: "Current Hold", description: "Your current maximum plank hold time (seconds)" },
          { symbol: "Weekly Increment", description: "Recommended weekly increase rate (5-10%) based on training frequency" },
          { symbol: "Number of Weeks", description: "Duration of your training plan in weeks" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete currently holds a plank for 60 seconds and plans to train 4 days per week for 8 weeks, aiming to improve core endurance.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input current hold time as 60 seconds, training frequency as 4 days/week, and duration as 8 weeks.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator applies a 7% weekly increment based on frequency, projecting the hold time after 8 weeks.",
          },
          {
            label: "Step 3",
            explanation:
              "Result shows a projected hold time of approximately 105 seconds (1m 45s), guiding training progression.",
          },
        ],
        result: "Projected max plank hold time: 1m 45s after 8 weeks of consistent training.",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
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