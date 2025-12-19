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

export default function GolfExpectedPuttsPerRoundCalculator() {
  const [inputs, setInputs] = useState({
    puttsPerHole: "",
    holesPlayed: "18",
    greenInRegulation: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * Expected Putts per Round is influenced by:
   * - Average putts per hole (direct input)
   * - Holes played (usually 18)
   * - Greens in Regulation (GIR) percentage, which affects approach shots and thus putting difficulty.
   * 
   * Formula used here is a simplified model based on PGA Tour stats:
   * Expected Putts = (Putts per Hole) * (Holes Played)
   * 
   * For advanced users, adjusting putts per hole by GIR% can indicate potential improvement.
   */

  const results = useMemo(() => {
    const puttsPerHole = parseFloat(inputs.puttsPerHole);
    const holesPlayed = parseInt(inputs.holesPlayed);
    const girPercent = parseFloat(inputs.greenInRegulation);

    if (
      isNaN(puttsPerHole) ||
      puttsPerHole <= 0 ||
      isNaN(holesPlayed) ||
      holesPlayed <= 0 ||
      (inputs.greenInRegulation !== "" && (isNaN(girPercent) || girPercent < 0 || girPercent > 100))
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers. GIR% must be between 0 and 100 if provided.",
        formulaUsed: "",
      };
    }

    // Base expected putts calculation
    let expectedPutts = puttsPerHole * holesPlayed;

    // Adjust expected putts based on GIR% if provided
    // Research shows higher GIR correlates with fewer putts per hole.
    // Approximate adjustment: for every 10% increase in GIR, reduce putts per hole by 0.05
    if (!isNaN(girPercent)) {
      const girAdjustment = ((100 - girPercent) / 10) * 0.05 * holesPlayed;
      expectedPutts += girAdjustment; // Add putts if GIR is low, subtract if high
    }

    // Round to two decimals
    expectedPutts = Math.max(0, expectedPutts);
    const roundedPutts = expectedPutts.toFixed(2);

    return {
      value: roundedPutts,
      label: "Expected Putts per Round",
      subtext: `Based on your inputs${inputs.greenInRegulation !== "" ? " and GIR adjustment" : ""}.`,
      warning: null,
      formulaUsed: `Expected Putts = Putts per Hole × Holes Played ${inputs.greenInRegulation !== "" ? "+ GIR Adjustment" : ""}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Expected Putts per Round in golf?",
      answer:
        "Expected Putts per Round is a statistical estimate of how many putts a golfer is likely to take over a full round, based on their average putts per hole and other factors like greens in regulation. It helps golfers understand their putting efficiency and identify areas for improvement in their short game.",
    },
    {
      question: "How does Greens in Regulation (GIR) affect putting performance?",
      answer:
        "Greens in Regulation (GIR) measures the percentage of holes where a golfer reaches the green in the expected number of strokes. Higher GIR percentages typically lead to easier putts and fewer putts per hole, as the golfer has better approach shots and more opportunities for one- or two-putt finishes.",
    },
    {
      question: "Can this calculator help improve my golf training?",
      answer:
        "Yes, by tracking your expected putts per round and comparing it to actual performance, you can identify trends and set realistic goals. Combining this data with GIR and other stats allows you to tailor your practice sessions to focus on putting or approach shots, optimizing your overall scoring potential.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="puttsPerHole" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Average Putts per Hole
          </Label>
          <Input
            id="puttsPerHole"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1.8"
            value={inputs.puttsPerHole}
            onChange={(e) => handleInputChange("puttsPerHole", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="holesPlayed" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Holes Played
          </Label>
          <Select
            value={inputs.holesPlayed}
            onValueChange={(v) => handleInputChange("holesPlayed", v)}
          >
            <SelectTrigger aria-label="Select holes played">
              <SelectValue placeholder="Select holes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9 Holes</SelectItem>
              <SelectItem value="18">18 Holes</SelectItem>
              <SelectItem value="27">27 Holes</SelectItem>
              <SelectItem value="36">36 Holes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="greenInRegulation" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Greens in Regulation (%) <Info className="inline-block ml-1 w-4 h-4 text-blue-500" />
          </Label>
          <Input
            id="greenInRegulation"
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="Optional"
            value={inputs.greenInRegulation}
            onChange={(e) => handleInputChange("greenInRegulation", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ puttsPerHole: "", holesPlayed: "18", greenInRegulation: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>}
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Golf Expected Putts per Round</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Expected Putts per Round is a key metric in golf analytics that estimates the total number of putts a golfer is likely to take during a full round, typically 18 holes. This metric is derived from the average putts per hole and adjusted by factors such as greens in regulation (GIR), which reflects the golfer's ability to reach the green in the expected number of strokes. Tracking this statistic helps golfers identify strengths and weaknesses in their short game, enabling targeted practice to reduce strokes and improve scoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The importance of putting cannot be overstated, as it accounts for nearly 40% of all strokes in a round. By understanding your expected putts, you can benchmark your performance against professional standards and amateur averages, setting realistic goals for improvement. This calculator provides a data-driven approach to quantify putting efficiency and its impact on overall round performance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your expected putts per round, input your average putts per hole, the number of holes you plan to play, and optionally your greens in regulation percentage. The calculator will compute an adjusted expected total putts, helping you understand your putting performance in the context of your overall game.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your average putts per hole, which can be tracked during practice rounds or competitions.
          </li>
          <li>
            <strong>Step 2:</strong> Select the number of holes you intend to play (commonly 9 or 18).
          </li>
          <li>
            <strong>Step 3 (Optional):</strong> Input your greens in regulation percentage to refine the estimate, as better approach shots typically reduce putts.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your expected putts per round and use this insight to guide your training focus.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your putting performance requires a combination of technical skill development, mental focus, and course management. Regularly practicing distance control, green reading, and stroke consistency can significantly reduce your average putts per hole. Incorporate drills that simulate on-course pressure to build confidence and adaptability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, enhancing your greens in regulation percentage through better approach shots will create more makeable putts and reduce three-putts. Combining these elements in your training regimen will yield the greatest improvements in your expected putts per round and overall scoring.
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
          For more information on golf performance metrics, putting analysis, and sports science principles, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.pgatour.com/stats.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              PGA Tour Stats <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive statistical database on professional golf performance, including putting and greens in regulation metrics.
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
              Provides research and practical applications for strength, conditioning, and performance enhancement in sports including golf.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Golf Expected Putts per Round"
      description="Estimate expected putts per round. Track putting performance against benchmarks to improve your short game."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Expected Putts = (Putts per Hole × Holes Played) + GIR Adjustment",
        variables: [
          { symbol: "Putts per Hole", description: "Average number of putts taken per hole" },
          { symbol: "Holes Played", description: "Number of holes played in the round" },
          { symbol: "GIR Adjustment", description: "Adjustment based on Greens in Regulation percentage" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A golfer averages 1.8 putts per hole, plays 18 holes, and has a greens in regulation percentage of 65%.",
        steps: [
          {
            label: "Step 1",
            explanation: "Multiply average putts per hole by holes played: 1.8 × 18 = 32.4 putts.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate GIR adjustment: (100 - 65) / 10 × 0.05 × 18 = 3.15 additional putts.",
          },
          {
            label: "Step 3",
            explanation: "Add adjustment to base putts: 32.4 + 3.15 = 35.55 expected putts per round.",
          },
        ],
        result: "Expected Putts per Round = 35.55",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
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