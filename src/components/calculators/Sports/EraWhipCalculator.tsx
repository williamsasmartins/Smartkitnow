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

export default function EraWhipCalculator() {
  // Inputs: innings pitched, earned runs, hits allowed, walks allowed
  const [inputs, setInputs] = useState({
    inningsPitched: "",
    earnedRuns: "",
    hitsAllowed: "",
    walksAllowed: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Parse inputs as floats for calculation
  const inningsPitched = parseFloat(inputs.inningsPitched);
  const earnedRuns = parseFloat(inputs.earnedRuns);
  const hitsAllowed = parseFloat(inputs.hitsAllowed);
  const walksAllowed = parseFloat(inputs.walksAllowed);

  // Calculation logic
  const results = useMemo(() => {
    if (
      isNaN(inningsPitched) ||
      inningsPitched <= 0 ||
      isNaN(earnedRuns) ||
      earnedRuns < 0 ||
      isNaN(hitsAllowed) ||
      hitsAllowed < 0 ||
      isNaN(walksAllowed) ||
      walksAllowed < 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid non-negative numbers. Innings pitched must be greater than zero.",
        formulaUsed: null,
      };
    }

    // ERA = (Earned Runs * 9) / Innings Pitched
    const era = (earnedRuns * 9) / inningsPitched;

    // WHIP = (Walks + Hits) / Innings Pitched
    const whip = (walksAllowed + hitsAllowed) / inningsPitched;

    return {
      value: (
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white">ERA: {era.toFixed(2)}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Earned Run Average</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-indigo-900 dark:text-indigo-300">WHIP: {whip.toFixed(3)}</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">Walks plus Hits per Inning Pitched</p>
          </div>
        </div>
      ),
      label: "Pitching Performance Metrics",
      subtext: "Calculated based on your inputs for innings pitched, earned runs, hits, and walks.",
      warning: null,
      formulaUsed:
        "ERA = (Earned Runs × 9) ÷ Innings Pitched; WHIP = (Walks + Hits) ÷ Innings Pitched",
    };
  }, [inningsPitched, earnedRuns, hitsAllowed, walksAllowed]);

  const faqs = [
    {
      question: "What does ERA indicate about a pitcher's performance?",
      answer:
        "ERA, or Earned Run Average, measures the average number of earned runs a pitcher allows per nine innings pitched. A lower ERA indicates better pitching performance, as it means the pitcher gives up fewer runs. It is a key statistic used to evaluate a pitcher's effectiveness and consistency over time.",
    },
    {
      question: "How is WHIP different from ERA and why is it important?",
      answer:
        "WHIP stands for Walks plus Hits per Inning Pitched and measures how many base runners a pitcher allows per inning. Unlike ERA, which focuses on runs allowed, WHIP focuses on the pitcher's ability to prevent batters from reaching base. A lower WHIP suggests better control and fewer opportunities for opponents to score.",
    },
    {
      question: "Can this calculator be used for partial innings pitched?",
      answer:
        "Yes, this calculator accepts fractional innings pitched, such as 5.2 innings (5 and 2/3 innings). Simply enter the innings pitched as a decimal value. This allows for precise calculations reflecting actual game situations where pitchers may not complete full innings.",
    },
    {
      question: "Why is it important to track both ERA and WHIP together?",
      answer:
        "Tracking both ERA and WHIP provides a more comprehensive view of a pitcher's performance. ERA shows how many runs a pitcher allows, while WHIP indicates how many batters reach base. A pitcher with a low ERA but high WHIP might be benefiting from good defense or luck, so considering both stats helps in evaluating true pitching skill.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 border border-blue-200 dark:border-indigo-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="inningsPitched" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Timer className="w-4 h-4" /> Innings Pitched
            </Label>
            <Input
              id="inningsPitched"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 7.2"
              value={inputs.inningsPitched}
              onChange={(e) => handleInputChange("inningsPitched", e.target.value)}
              aria-describedby="inningsHelp"
            />
            <p id="inningsHelp" className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Enter total innings pitched (e.g., 7.2 for 7 and 2/3 innings).
            </p>
          </div>

          <div>
            <Label htmlFor="earnedRuns" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Flame className="w-4 h-4" /> Earned Runs Allowed
            </Label>
            <Input
              id="earnedRuns"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 3"
              value={inputs.earnedRuns}
              onChange={(e) => handleInputChange("earnedRuns", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="hitsAllowed" className="flex items-center gap-1 mb-1 font-semibold text-indigo-900 dark:text-indigo-300">
              <Activity className="w-4 h-4" /> Hits Allowed
            </Label>
            <Input
              id="hitsAllowed"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5"
              value={inputs.hitsAllowed}
              onChange={(e) => handleInputChange("hitsAllowed", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="walksAllowed" className="flex items-center gap-1 mb-1 font-semibold text-indigo-900 dark:text-indigo-300">
              <Flag className="w-4 h-4" /> Walks Allowed
            </Label>
            <Input
              id="walksAllowed"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2"
              value={inputs.walksAllowed}
              onChange={(e) => handleInputChange("walksAllowed", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed, results update automatically
            }}
          >
            <Trophy className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                inningsPitched: "",
                earnedRuns: "",
                hitsAllowed: "",
                walksAllowed: "",
              })
            }
            className="flex-1 h-11"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        {results.warning && (
          <p className="mt-4 text-red-700 dark:text-red-400 flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </p>
        )}

        {results.value && !results.warning && (
          <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              {results.value}
              <p className="mt-4 text-sm text-blue-800 dark:text-blue-300 italic">{results.subtext}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                <Calculator className="inline w-4 h-4 mr-1" />
                Formula used: <code>{results.formulaUsed}</code>
              </p>
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding ERA &amp; WHIP Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The ERA &amp; WHIP Calculator is a specialized tool designed to help baseball coaches, players, and analysts accurately assess a pitcher's performance. ERA, or Earned Run Average, quantifies the average number of earned runs a pitcher allows per nine innings pitched, serving as a critical indicator of pitching effectiveness. WHIP, which stands for Walks plus Hits per Inning Pitched, measures how many base runners a pitcher allows per inning, reflecting control and the ability to limit opposing batters' opportunities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting key pitching statistics such as innings pitched, earned runs, hits allowed, and walks allowed, this calculator instantly computes both ERA and WHIP. These metrics are essential for evaluating a pitcher's consistency, stamina, and overall impact on the game. Understanding these numbers helps teams make informed decisions on pitching rotations, training focus, and game strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          ERA is particularly useful for gauging how well a pitcher prevents scoring, while WHIP provides insight into how often batters reach base, which can lead to runs. Together, they offer a comprehensive picture of pitching performance, balancing run prevention with control and command on the mound.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is designed to be user-friendly and precise, accommodating fractional innings pitched to reflect real game scenarios. Whether you are a seasoned analyst or a player tracking your progress, this tool provides authoritative and reliable calculations to support your baseball analytics needs.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the ERA &amp; WHIP Calculator is straightforward and requires only a few key inputs from your pitching performance data. Begin by entering the total innings pitched, which can include fractional innings (e.g., 7.2 for seven and two-thirds innings). This precision ensures the calculations accurately reflect your actual game time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, input the number of earned runs allowed during those innings. Earned runs are runs that result directly from the pitcher's actions, excluding errors or passed balls. Then, enter the total hits and walks allowed, which are combined to calculate WHIP. These inputs should be non-negative numbers to ensure valid results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering all values, click the "Calculate" button to generate your ERA and WHIP. The results will display prominently, showing your pitching effectiveness and control. If any inputs are invalid or missing, the calculator will prompt you to correct them.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter innings pitched as a decimal (e.g., 6.1 for six and one-third innings).
          </li>
          <li>
            <strong>Step 2:</strong> Input earned runs allowed (non-negative integer).
          </li>
          <li>
            <strong>Step 3:</strong> Enter hits allowed (non-negative integer).
          </li>
          <li>
            <strong>Step 4:</strong> Enter walks allowed (non-negative integer).
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your ERA and WHIP.
          </li>
          <li>
            <strong>Step 6:</strong> Use the "Reset" button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve your ERA and WHIP, focus on developing consistent pitching mechanics that minimize walks and hits allowed. Control and command are paramount; work on your ability to locate pitches precisely within the strike zone to reduce free passes and hard contact.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate drills that enhance pitch variety and deception, such as changing speeds and locations, to keep hitters off balance. Conditioning and stamina training will help maintain effectiveness deep into games, reducing late-inning runs and base runners.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Analyze your pitching data regularly using this calculator to identify trends and areas for improvement. For example, a rising WHIP might indicate control issues, while an increasing ERA could suggest problems with pitch selection or fatigue.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Collaborate with coaches and teammates to develop game strategies that leverage your strengths and mitigate weaknesses. Mental preparation and focus during games are equally important to maintain consistency and composure on the mound.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.mlb.com/glossary/standard-stats/earned-run-average"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              MLB Glossary: Earned Run Average (ERA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official Major League Baseball explanation of ERA, its calculation, and significance in evaluating pitchers.
            </p>
          </li>
          <li>
            <a
              href="https://www.baseball-reference.com/about/whip.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball-Reference: WHIP Statistic <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed overview of WHIP, including its formula, historical context, and usage in player evaluation.
            </p>
          </li>
          <li>
            <a
              href="https://www.sports-reference.com/blog/2010/03/understanding-advanced-pitching-stats/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sports Reference Blog: Understanding Advanced Pitching Stats <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful article explaining ERA, WHIP, and other advanced pitching metrics for deeper baseball analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="ERA &amp; WHIP Calculator"
      description="Calculate pitcher stats. Determine Earned Run Average (ERA) and Walks Plus Hits Per Inning Pitched (WHIP)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "ERA = (Earned Runs × 9) ÷ Innings Pitched; WHIP = (Walks + Hits) ÷ Innings Pitched",
        variables: [
          { symbol: "ERA", description: "Earned Run Average" },
          { symbol: "WHIP", description: "Walks plus Hits per Inning Pitched" },
          { symbol: "Earned Runs", description: "Runs scored without errors or passed balls" },
          { symbol: "Walks", description: "Bases on balls allowed" },
          { symbol: "Hits", description: "Hits allowed" },
          { symbol: "Innings Pitched", description: "Total innings pitched (can be fractional)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A pitcher throws 7.2 innings, allows 3 earned runs, 5 hits, and 2 walks. Calculate ERA and WHIP.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert innings pitched to decimal: 7.2 innings means 7 and 2/3 innings, which is 7.6667 innings.",
          },
          {
            label: "Step 2",
            explanation: "Calculate ERA: (3 earned runs × 9) ÷ 7.6667 innings = 3.52 ERA.",
          },
          {
            label: "Step 3",
            explanation: "Calculate WHIP: (5 hits + 2 walks) ÷ 7.6667 innings = 0.91 WHIP.",
          },
        ],
        result: "ERA: 3.52, WHIP: 0.91",
      }}
      relatedCalculators={[
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🏆" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
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