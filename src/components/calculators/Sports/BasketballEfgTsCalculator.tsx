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

export default function BasketballEfgTsCalculator() {
  // Inputs: FGM = Field Goals Made, FGA = Field Goals Attempted,
  // 3PM = Three Pointers Made, FTM = Free Throws Made, FTA = Free Throws Attempted
  const [inputs, setInputs] = useState({
    fgm: "",
    fga: "",
    threepm: "",
    ftm: "",
    fta: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals, empty string allowed
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const fgm = parseFloat(inputs.fgm);
    const fga = parseFloat(inputs.fga);
    const threepm = parseFloat(inputs.threepm);
    const ftm = parseFloat(inputs.ftm);
    const fta = parseFloat(inputs.fta);

    // Validate inputs
    if (
      isNaN(fgm) || isNaN(fga) || isNaN(threepm) || isNaN(ftm) || isNaN(fta) ||
      fga <= 0 || fta < 0 || fgm < 0 || threepm < 0 || ftm < 0 ||
      fgm > fga || threepm > fgm || ftm > fta
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid non-negative numbers with logical relationships (e.g., FGM ≤ FGA).",
        warning: "Invalid input values.",
        formulaUsed: null,
      };
    }

    // Effective Field Goal Percentage (eFG%) formula:
    // eFG% = (FGM + 0.5 * 3PM) / FGA
    const efg = ((fgm + 0.5 * threepm) / fga) * 100;

    // True Shooting Percentage (TS%) formula:
    // TS% = Points Scored / (2 * (FGA + 0.44 * FTA))
    // Points Scored = 2*(FGM - 3PM) + 3*3PM + FTM
    const pointsScored = 2 * (fgm - threepm) + 3 * threepm + ftm;
    const denominator = 2 * (fga + 0.44 * fta);
    const ts = denominator > 0 ? (pointsScored / denominator) * 100 : null;

    return {
      value: (
        <>
          <div className="text-3xl font-semibold mb-2 text-blue-900 dark:text-white">
            Effective Field Goal % (eFG%):{" "}
            <span className="font-extrabold">{efg.toFixed(2)}%</span>
          </div>
          <div className="text-3xl font-semibold text-indigo-900 dark:text-indigo-300">
            True Shooting % (TS%):{" "}
            <span className="font-extrabold">{ts !== null ? ts.toFixed(2) + "%" : "N/A"}</span>
          </div>
        </>
      ),
      label: "Basketball Shooting Efficiency Metrics",
      subtext:
        "eFG% accounts for the added value of three-pointers, while TS% incorporates free throws for a comprehensive scoring efficiency measure.",
      warning: null,
      formulaUsed:
        "eFG% = (FGM + 0.5 × 3PM) / FGA; TS% = Points / (2 × (FGA + 0.44 × FTA))",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Effective Field Goal Percentage (eFG%)?",
      answer:
        "Effective Field Goal Percentage (eFG%) adjusts traditional field goal percentage by giving extra weight to three-point shots, recognizing their higher scoring value. It provides a more accurate measure of shooting efficiency by accounting for the fact that three-pointers are worth 1.5 times more than two-pointers.",
    },
    {
      question: "How does True Shooting Percentage (TS%) differ from eFG%?",
      answer:
        "True Shooting Percentage (TS%) is a more comprehensive metric that factors in free throws along with field goals, reflecting overall scoring efficiency. Unlike eFG%, TS% considers all points scored relative to shooting attempts, including free throws, providing a holistic view of a player's scoring effectiveness.",
    },
    {
      question: "Why is the factor 0.44 used in the TS% formula for free throw attempts?",
      answer:
        "The 0.44 multiplier accounts for the fact that not all free throw attempts result in two shots (e.g., and-ones, technical fouls). This empirical factor adjusts free throw attempts to better estimate their impact on scoring opportunities, ensuring the TS% formula accurately reflects true shooting efficiency.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fgm" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Field Goals Made (FGM) <Calculator className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="fgm"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 7"
              value={inputs.fgm}
              onChange={(e) => handleInputChange("fgm", e.target.value)}
              aria-describedby="fgm-desc"
            />
            <p id="fgm-desc" className="text-xs text-slate-400 mt-1">
              Total field goals successfully made.
            </p>
          </div>
          <div>
            <Label htmlFor="fga" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Field Goals Attempted (FGA) <Calculator className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="fga"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 15"
              value={inputs.fga}
              onChange={(e) => handleInputChange("fga", e.target.value)}
              aria-describedby="fga-desc"
            />
            <p id="fga-desc" className="text-xs text-slate-400 mt-1">
              Total field goal attempts.
            </p>
          </div>
          <div>
            <Label htmlFor="threepm" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Three Pointers Made (3PM) <Trophy className="w-4 h-4 text-indigo-600" />
            </Label>
            <Input
              id="threepm"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 3"
              value={inputs.threepm}
              onChange={(e) => handleInputChange("threepm", e.target.value)}
              aria-describedby="threepm-desc"
            />
            <p id="threepm-desc" className="text-xs text-slate-400 mt-1">
              Number of successful three-point shots.
            </p>
          </div>
          <div>
            <Label htmlFor="ftm" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Free Throws Made (FTM) <Flame className="w-4 h-4 text-red-600" />
            </Label>
            <Input
              id="ftm"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 5"
              value={inputs.ftm}
              onChange={(e) => handleInputChange("ftm", e.target.value)}
              aria-describedby="ftm-desc"
            />
            <p id="ftm-desc" className="text-xs text-slate-400 mt-1">
              Number of free throws successfully made.
            </p>
          </div>
          <div>
            <Label htmlFor="fta" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Free Throws Attempted (FTA) <Zap className="w-4 h-4 text-yellow-500" />
            </Label>
            <Input
              id="fta"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 6"
              value={inputs.fta}
              onChange={(e) => handleInputChange("fta", e.target.value)}
              aria-describedby="fta-desc"
            />
            <p id="fta-desc" className="text-xs text-slate-400 mt-1">
              Total free throw attempts.
            </p>
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, results update automatically
          }}
          aria-label="Calculate eFG% and TS%"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              fgm: "",
              fga: "",
              threepm: "",
              ftm: "",
              fta: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            {results.value}
            {results.subtext && (
              <p className="mt-4 text-sm text-blue-900 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 font-semibold">{results.warning}</p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-700 dark:text-slate-400">
                <Calculator className="inline-block w-4 h-4 mr-1" />
                <strong>Formula Used:</strong> {results.formulaUsed}
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
          Understanding Basketball eFG% & TS% Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Effective Field Goal Percentage (eFG%) and True Shooting Percentage (TS%) are advanced basketball metrics designed to provide a more nuanced understanding of a player's scoring efficiency than traditional field goal percentage. eFG% adjusts for the fact that three-point shots are worth more than two-point shots by giving them extra weight, thus offering a better reflection of shooting effectiveness. TS% further expands on this by incorporating free throws into the calculation, accounting for all scoring attempts and providing a comprehensive measure of a player's ability to score efficiently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          These metrics are widely used by coaches, analysts, and sports scientists to evaluate player performance, inform training strategies, and optimize game tactics. By understanding and applying these percentages, teams can better assess shooting quality and make data-driven decisions to improve offensive efficiency.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your basketball shooting efficiency, input the relevant shooting statistics from a game or practice session. This includes the number of field goals made and attempted, three-pointers made, free throws made, and free throws attempted. The calculator will then compute both eFG% and TS%, providing you with a clear picture of your scoring effectiveness.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total Field Goals Made (FGM) and Field Goals Attempted (FGA).
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of Three Pointers Made (3PM) — this should be less than or equal to FGM.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the Free Throws Made (FTM) and Free Throws Attempted (FTA).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your Effective Field Goal Percentage and True Shooting Percentage.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to analyze your shooting performance and identify areas for improvement.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your eFG% and TS% requires a combination of skill development, shot selection, and physical conditioning. Focus on practicing high-percentage shots and increasing your three-point shooting accuracy, as these directly impact your eFG%. Additionally, work on drawing fouls and converting free throws to boost your TS%. Conditioning and stamina are crucial to maintain shooting form late in games, which can significantly affect your efficiency metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate drills that simulate game pressure and fatigue to better prepare for real-game scenarios. Video analysis can also help identify tendencies and areas where shot selection can be optimized. Remember, consistent practice combined with strategic shot choices will lead to meaningful improvements in your shooting efficiency.
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
          For more information on basketball performance metrics, training science, and sports analytics, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and training.
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
              Provides research and certifications focused on strength training, conditioning, and performance optimization for athletes.
            </p>
          </li>
          <li>
            <a
              href="https://stats.nba.com/help/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NBA Stats Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official glossary and explanations of advanced basketball statistics used in professional analysis.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basketball eFG% & TS% Calculator"
      description="Calculate Effective Field Goal and True Shooting percentage. Measure basketball scoring efficiency accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas",
        formula:
          "eFG% = (FGM + 0.5 × 3PM) / FGA; TS% = Points Scored / (2 × (FGA + 0.44 × FTA))",
        variables: [
          { symbol: "FGM", description: "Field Goals Made" },
          { symbol: "FGA", description: "Field Goals Attempted" },
          { symbol: "3PM", description: "Three Pointers Made" },
          { symbol: "FTM", description: "Free Throws Made" },
          { symbol: "FTA", description: "Free Throws Attempted" },
          { symbol: "Points Scored", description: "2 × (FGM - 3PM) + 3 × 3PM + FTM" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player made 7 field goals out of 15 attempts, including 3 three-pointers, and made 5 free throws out of 6 attempts during a game.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the player's stats: FGM = 7, FGA = 15, 3PM = 3, FTM = 5, FTA = 6.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate eFG%: (7 + 0.5 × 3) / 15 = (7 + 1.5) / 15 = 8.5 / 15 = 0.5667 or 56.67%.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate points scored: 2 × (7 - 3) + 3 × 3 + 5 = 2 × 4 + 9 + 5 = 8 + 9 + 5 = 22 points.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate TS%: 22 / (2 × (15 + 0.44 × 6)) = 22 / (2 × (15 + 2.64)) = 22 / (2 × 17.64) = 22 / 35.28 = 0.6239 or 62.39%.",
          },
        ],
        result:
          "The player's eFG% is 56.67%, and TS% is 62.39%, indicating efficient scoring performance.",
      }}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
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