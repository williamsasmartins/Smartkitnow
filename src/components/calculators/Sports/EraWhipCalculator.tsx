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

export default function EraWhipCalculator() {
  const [inputs, setInputs] = useState({
    earnedRuns: "",
    inningsPitched: "",
    walks: "",
    hits: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const ER = parseFloat(inputs.earnedRuns);
    const IP = parseFloat(inputs.inningsPitched);
    const BB = parseFloat(inputs.walks);
    const H = parseFloat(inputs.hits);

    // Validate inputs
    if (
      isNaN(ER) ||
      isNaN(IP) ||
      isNaN(BB) ||
      isNaN(H) ||
      IP === 0
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid numeric values greater than zero for innings pitched.",
        formulaUsed: "",
      };
    }

    // ERA Calculation: (Earned Runs * 9) / Innings Pitched
    const era = (ER * 9) / IP;

    // WHIP Calculation: (Walks + Hits) / Innings Pitched
    const whip = (BB + H) / IP;

    return {
      value: (
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-lg text-blue-800 dark:text-blue-300">ERA:</span>{" "}
            <span className="text-3xl font-extrabold text-blue-900 dark:text-white">{era.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-semibold text-lg text-indigo-800 dark:text-indigo-300">WHIP:</span>{" "}
            <span className="text-3xl font-extrabold text-indigo-900 dark:text-white">{whip.toFixed(3)}</span>
          </div>
        </div>
      ),
      label: "Pitching Performance Metrics",
      subtext: "ERA and WHIP are key indicators of a pitcher's effectiveness.",
      warning: null,
      formulaUsed:
        "ERA = (Earned Runs × 9) ÷ Innings Pitched; WHIP = (Walks + Hits) ÷ Innings Pitched",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Earned Run Average (ERA)?",
      answer:
        "ERA is a pitching statistic that calculates the average number of earned runs a pitcher allows per nine innings pitched. It provides insight into a pitcher's effectiveness in preventing scoring, with a lower ERA indicating better performance.",
    },
    {
      question: "How is WHIP calculated and why is it important?",
      answer:
        "WHIP stands for Walks plus Hits per Inning Pitched. It measures the average number of base runners a pitcher allows per inning, combining walks and hits. A lower WHIP suggests better control and fewer opponents reaching base, which is critical for limiting scoring opportunities.",
    },
    {
      question: "Can this calculator handle partial innings pitched?",
      answer:
        "Yes, innings pitched can be entered as decimals to represent partial innings (e.g., 5.2 innings means 5 innings and 2 outs). This allows for precise calculation of ERA and WHIP reflecting actual game situations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="earnedRuns" className="flex items-center gap-1">
                Earned Runs <Info className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                id="earnedRuns"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 3"
                value={inputs.earnedRuns}
                onChange={(e) => handleInputChange("earnedRuns", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="inningsPitched" className="flex items-center gap-1">
                Innings Pitched <Info className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                id="inningsPitched"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 7.2"
                value={inputs.inningsPitched}
                onChange={(e) => handleInputChange("inningsPitched", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="walks" className="flex items-center gap-1">
                Walks Allowed (BB) <Info className="w-4 h-4 text-indigo-500" />
              </Label>
              <Input
                id="walks"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 2"
                value={inputs.walks}
                onChange={(e) => handleInputChange("walks", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hits" className="flex items-center gap-1">
                Hits Allowed (H) <Info className="w-4 h-4 text-indigo-500" />
              </Label>
              <Input
                id="hits"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 5"
                value={inputs.hits}
                onChange={(e) => handleInputChange("hits", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate ERA and WHIP"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              earnedRuns: "",
              inningsPitched: "",
              walks: "",
              hits: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">{results.value}</CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{results.subtext}</p>
          <p className="text-xs italic text-slate-500 dark:text-slate-600 mt-1">{results.formulaUsed}</p>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding ERA & WHIP Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Earned Run Average (ERA) and Walks plus Hits per Inning Pitched (WHIP) are two of the most
          critical pitching metrics used in baseball analytics to evaluate a pitcher's performance. ERA
          quantifies the average number of earned runs a pitcher allows over nine innings, providing a
          standardized measure of run prevention. WHIP, on the other hand, measures how many base runners
          a pitcher allows per inning, combining walks and hits to assess control and effectiveness in
          limiting opponents' opportunities. Together, these statistics offer a comprehensive view of
          pitching quality and are widely used by coaches, analysts, and scouts to make informed decisions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator enables users to input their pitching data and instantly compute ERA and WHIP,
          facilitating performance tracking and comparison. It supports decimal inputs for innings pitched,
          accommodating partial innings and ensuring precise calculations that reflect real-game scenarios.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your ERA and WHIP, enter the total earned runs allowed, innings pitched,
          walks allowed, and hits allowed into the respective fields. Make sure to input innings pitched
          as a decimal to represent partial innings (for example, 7.1 innings means 7 innings and 1 out).
          Once all fields are filled with valid numbers, click the "Calculate" button to view your results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total earned runs you have allowed in the "Earned Runs" field.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total innings pitched, including partial innings, in the "Innings Pitched" field.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the number of walks allowed (BB) in the "Walks Allowed" field.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total hits allowed in the "Hits Allowed" field.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to compute your ERA and WHIP.
          </li>
          <li>
            <strong>Step 6:</strong> Review the results displayed below the inputs, including formulas used.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your ERA and WHIP requires a combination of physical conditioning, pitching mechanics,
          and mental strategy. Focus on developing consistent control to reduce walks, as limiting free
          passes directly lowers WHIP. Enhancing pitch variety and deception can help reduce hits allowed,
          thereby improving both WHIP and ERA. Additionally, maintaining peak physical fitness through
          strength and endurance training supports sustained performance throughout games and seasons.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly tracking your ERA and WHIP using this calculator can help identify trends and areas
          for improvement. Collaborate with coaches to analyze game footage and refine pitching techniques,
          aiming to minimize earned runs and base runners. Remember, a lower ERA and WHIP not only reflect
          better pitching but also contribute significantly to team success.
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
          For more information on pitching metrics, baseball analytics, and training science, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athlete performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.mlb.com/glossary/standard-stats/earned-run-average"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Major League Baseball (MLB) Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official definitions and explanations of baseball statistics including ERA and WHIP.
            </p>
          </li>
          <li>
            <a
              href="https://ncesc.com/baseball-analytics/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Collegiate Scouting Association (NCSA) Baseball Analytics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resources on baseball scouting and performance metrics used at the collegiate level.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="ERA & WHIP Calculator"
      description="Calculate pitcher stats. Determine Earned Run Average (ERA) and Walks Plus Hits Per Inning Pitched (WHIP)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "ERA = (Earned Runs × 9) ÷ Innings Pitched; WHIP = (Walks + Hits) ÷ Innings Pitched",
        variables: [
          { symbol: "ERA", description: "Earned Run Average" },
          { symbol: "WHIP", description: "Walks plus Hits per Inning Pitched" },
          { symbol: "Earned Runs", description: "Runs scored without errors or passed balls" },
          { symbol: "Innings Pitched", description: "Total innings pitched (including partial innings)" },
          { symbol: "Walks", description: "Bases on balls allowed" },
          { symbol: "Hits", description: "Hits allowed" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A pitcher has allowed 4 earned runs, pitched 6.2 innings, walked 3 batters, and allowed 7 hits in a game.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert innings pitched to decimal: 6.2 innings means 6 innings and 2 outs, which is 6 + 2/3 = 6.6667 innings.",
          },
          {
            label: "Step 2",
            explanation: "Calculate ERA: (4 earned runs × 9) ÷ 6.6667 innings = 36 ÷ 6.6667 ≈ 5.40 ERA.",
          },
          {
            label: "Step 3",
            explanation: "Calculate WHIP: (3 walks + 7 hits) ÷ 6.6667 innings = 10 ÷ 6.6667 ≈ 1.50 WHIP.",
          },
        ],
        result: "The pitcher's ERA is approximately 5.40 and WHIP is approximately 1.50 for this game.",
      }}
      relatedCalculators={[
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
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