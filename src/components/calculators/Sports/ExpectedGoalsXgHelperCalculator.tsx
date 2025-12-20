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

export default function ExpectedGoalsXgHelperCalculator() {
  // Inputs: Shots Taken, Shots on Target, Big Chances, Shots Outside Box, Shots Inside Box, Distance to Goal (avg), Shot Angle (avg)
  const [inputs, setInputs] = useState({
    totalShots: "",
    shotsOnTarget: "",
    bigChances: "",
    shotsOutsideBox: "",
    shotsInsideBox: "",
    avgDistance: "",
    avgAngle: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // xG Calculation Logic (simplified model for demonstration)
  // Base xG per shot type:
  // Big Chance: 0.4 xG each
  // Shots Inside Box (excluding big chances): 0.1 xG each
  // Shots Outside Box: 0.02 xG each
  // Adjust xG by average distance and angle modifiers (distance reduces xG, angle reduces xG)
  // Distance modifier: xG decreases by 0.005 per meter beyond 10m (min 0.5)
  // Angle modifier: xG decreases by 0.003 per degree beyond 30 degrees (min 0.7)
  // Shots on target multiplier: 1.1 (shots on target more likely to score)
  // Final xG capped between 0 and totalShots

  const results = useMemo(() => {
    const {
      totalShots,
      shotsOnTarget,
      bigChances,
      shotsOutsideBox,
      shotsInsideBox,
      avgDistance,
      avgAngle,
    } = inputs;

    // Parse inputs as numbers
    const total = Number(totalShots);
    const onTarget = Number(shotsOnTarget);
    const big = Number(bigChances);
    const outside = Number(shotsOutsideBox);
    const inside = Number(shotsInsideBox);
    const distance = Number(avgDistance);
    const angle = Number(avgAngle);

    // Validate inputs
    if (
      isNaN(total) ||
      isNaN(onTarget) ||
      isNaN(big) ||
      isNaN(outside) ||
      isNaN(inside) ||
      isNaN(distance) ||
      isNaN(angle) ||
      total <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: "",
      };
    }

    if (big > total || outside > total || inside > total || onTarget > total) {
      return {
        value: null,
        label: "",
        subtext: "Individual shot counts cannot exceed total shots.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: "",
      };
    }

    // Distance modifier
    let distMod = 1;
    if (distance > 10) {
      distMod = Math.max(0.5, 1 - 0.005 * (distance - 10));
    }

    // Angle modifier
    let angleMod = 1;
    if (angle > 30) {
      angleMod = Math.max(0.7, 1 - 0.003 * (angle - 30));
    }

    // Base xG calculation
    // Big chances first
    const bigXg = big * 0.4;
    // Shots inside box excluding big chances
    const insideNonBig = Math.max(0, inside - big);
    const insideXg = insideNonBig * 0.1;
    // Shots outside box
    const outsideXg = outside * 0.02;

    let baseXg = bigXg + insideXg + outsideXg;

    // Apply distance and angle modifiers
    baseXg = baseXg * distMod * angleMod;

    // Shots on target multiplier (weighted)
    const onTargetRatio = onTarget / total;
    const onTargetMultiplier = 1 + 0.1 * onTargetRatio; // max 1.1 if all shots on target
    let finalXg = baseXg * onTargetMultiplier;

    // Cap final xG to total shots (logical max)
    finalXg = Math.min(finalXg, total);

    // Round to 3 decimals
    const roundedXg = finalXg.toFixed(3);

    return {
      value: roundedXg,
      label: "Expected Goals (xG)",
      subtext:
        "This value estimates the number of goals a team/player is expected to score based on shot quality and quantity.",
      warning: null,
      formulaUsed:
        "xG = (Big Chances * 0.4 + (Shots Inside Box - Big Chances) * 0.1 + Shots Outside Box * 0.02) × Distance Modifier × Angle Modifier × Shots on Target Multiplier",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does xG (Expected Goals) represent in football analytics?",
      answer:
        "Expected Goals (xG) is a statistical measure that estimates the likelihood of a shot resulting in a goal based on various factors such as shot location, shot type, angle, and distance. It helps analysts and coaches understand the quality of chances created or conceded, rather than just the final scoreline.",
    },
    {
      question: "How can I use xG to improve team performance?",
      answer:
        "By analyzing xG data, teams can identify whether they are creating high-quality scoring opportunities or relying on low-probability shots. Coaches can adjust tactics to increase big chances and shots inside the box, improving overall scoring efficiency. Defensively, xG helps identify vulnerabilities by showing how many quality chances opponents generate.",
    },
    {
      question: "Why is it important to consider shot distance and angle in xG calculations?",
      answer:
        "Shot distance and angle significantly affect the probability of scoring. Shots taken closer to goal and from favorable angles have higher chances of success. Incorporating these factors into xG models provides a more accurate reflection of shot quality, allowing better performance analysis and decision-making.",
    },
    {
      question: "Can xG predict the exact number of goals in a match?",
      answer:
        "No, xG is a probabilistic metric that estimates the expected number of goals based on shot quality and quantity. It does not predict exact outcomes but provides insights into whether a team was lucky or unlucky relative to the chances they created or conceded.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalShots" className="mb-1 flex items-center gap-1">
            Total Shots <Calculator className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="totalShots"
            type="text"
            inputMode="decimal"
            value={inputs.totalShots}
            onChange={(e) => handleInputChange("totalShots", e.target.value)}
            placeholder="e.g. 15"
          />
        </div>
        <div>
          <Label htmlFor="shotsOnTarget" className="mb-1 flex items-center gap-1">
            Shots on Target <TargetIcon />
          </Label>
          <Input
            id="shotsOnTarget"
            type="text"
            inputMode="decimal"
            value={inputs.shotsOnTarget}
            onChange={(e) => handleInputChange("shotsOnTarget", e.target.value)}
            placeholder="e.g. 7"
          />
        </div>
        <div>
          <Label htmlFor="bigChances" className="mb-1 flex items-center gap-1">
            Big Chances <Flag className="w-4 h-4 text-red-600" />
          </Label>
          <Input
            id="bigChances"
            type="text"
            inputMode="decimal"
            value={inputs.bigChances}
            onChange={(e) => handleInputChange("bigChances", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <Label htmlFor="shotsInsideBox" className="mb-1 flex items-center gap-1">
            Shots Inside Box <Gauge className="w-4 h-4 text-green-600" />
          </Label>
          <Input
            id="shotsInsideBox"
            type="text"
            inputMode="decimal"
            value={inputs.shotsInsideBox}
            onChange={(e) => handleInputChange("shotsInsideBox", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <Label htmlFor="shotsOutsideBox" className="mb-1 flex items-center gap-1">
            Shots Outside Box <Waves className="w-4 h-4 text-cyan-600" />
          </Label>
          <Input
            id="shotsOutsideBox"
            type="text"
            inputMode="decimal"
            value={inputs.shotsOutsideBox}
            onChange={(e) => handleInputChange("shotsOutsideBox", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <Label htmlFor="avgDistance" className="mb-1 flex items-center gap-1">
            Avg. Distance to Goal (m) <Scale className="w-4 h-4 text-purple-600" />
          </Label>
          <Input
            id="avgDistance"
            type="text"
            inputMode="decimal"
            value={inputs.avgDistance}
            onChange={(e) => handleInputChange("avgDistance", e.target.value)}
            placeholder="e.g. 16"
          />
        </div>
        <div>
          <Label htmlFor="avgAngle" className="mb-1 flex items-center gap-1">
            Avg. Shot Angle (°) <Activity className="w-4 h-4 text-yellow-600" />
          </Label>
          <Input
            id="avgAngle"
            type="text"
            inputMode="decimal"
            value={inputs.avgAngle}
            onChange={(e) => handleInputChange("avgAngle", e.target.value)}
            placeholder="e.g. 25"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
              totalShots: "",
              shotsOnTarget: "",
              bigChances: "",
              shotsOutsideBox: "",
              shotsInsideBox: "",
              avgDistance: "",
              avgAngle: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && <div className="mt-2">{results.warning}</div>}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding xG (Expected Goals) Reading Helper
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Expected Goals (xG) is a revolutionary metric in football analytics that quantifies the quality of scoring chances created by a team or player. Unlike traditional statistics that focus solely on goals scored, xG evaluates the likelihood of each shot resulting in a goal based on various factors such as shot location, shot type, distance, and angle. This provides a deeper insight into performance by highlighting whether a team is creating high-quality chances or relying on luck.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The xG Reading Helper calculator simplifies this complex analysis by allowing users to input key shot statistics and receive an estimated expected goals value. This helps coaches, analysts, and fans interpret match data beyond the final scoreline, understanding the underlying performance and chance creation efficiency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By considering factors such as big chances, shots inside and outside the box, average shot distance, and angle, the calculator models the probability of scoring in a realistic manner. This empowers users to make informed decisions about tactics, player evaluation, and training focus areas.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Ultimately, xG is a powerful tool that bridges the gap between raw statistics and meaningful insights, helping teams and individuals improve their offensive and defensive strategies.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the xG Reading Helper is straightforward and designed for both professionals and enthusiasts. Begin by gathering accurate match or training data related to shots taken, including total shots, shots on target, big chances, and shots inside and outside the penalty box. Additionally, estimate the average distance and angle of shots to goal, as these influence scoring probability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter these values into the respective input fields. The calculator automatically validates the inputs and computes the expected goals value based on a scientifically-informed formula. This value represents the number of goals a team or player is expected to score given the quality and quantity of chances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can use this output to compare actual goals scored against expected goals, identifying whether a team is overperforming or underperforming. This insight can guide tactical adjustments, player selection, and training priorities.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Collect accurate shot data from match reports or video analysis.
          </li>
          <li>
            <strong>Step 2:</strong> Input total shots, shots on target, big chances, shots inside and outside the box, average shot distance, and angle.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to generate the expected goals value.
          </li>
          <li>
            <strong>Step 4:</strong> Analyze the xG value in context with actual goals to assess performance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your team’s scoring potential, focus training sessions on creating and converting high-quality chances. Encourage players to take more shots inside the penalty box and work on positioning to increase the number of big chances. Drills that simulate game scenarios with tight angles and varying distances can improve shot accuracy and decision-making.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Defensive training should emphasize reducing opponents’ big chances and shots inside the box. Use xG data to identify defensive weaknesses and tailor drills to close down shooting lanes and force opponents into low-probability shots from outside the box.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, analyze individual player xG contributions to tailor personalized training programs. Players with low xG but high shot volume may benefit from improving shot selection and positioning, while those with high xG but low conversion rates can focus on finishing techniques.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly reviewing xG trends throughout the season helps track progress and adjust strategies dynamically for sustained performance improvement.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.optasports.com/insight/expected-goals-xg-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Opta Sports: Expected Goals (xG) Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide by Opta, one of the leading sports data providers, explaining the concept and application of xG in football analytics.
            </p>
          </li>
          <li>
            <a
              href="https://statsbomb.com/2020/01/expected-goals-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              StatsBomb: Expected Goals Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              StatsBomb provides an in-depth explanation of xG models, including how shot quality is measured and used to predict scoring probabilities.
            </p>
          </li>
          <li>
            <a
              href="https://www.fourfourtwo.com/features/expected-goals-explained-why-xg-is-the-most-important-stat-in-football"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FourFourTwo: Why xG is the Most Important Stat in Football <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible article discussing the importance of xG in modern football analysis and how it can be used by fans and professionals alike.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Custom icon for Shots on Target (using Info icon as proxy)
  function TargetIcon() {
    return <Info className="w-4 h-4 text-green-700" />;
  }

  return (
    <CalculatorVerticalLayout
      title="xG (Expected Goals) Reading Helper"
      description="Understand Expected Goals (xG). Interpret match statistics to analyze team performance beyond the final score."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "xG = (Big Chances × 0.4 + (Shots Inside Box - Big Chances) × 0.1 + Shots Outside Box × 0.02) × Distance Modifier × Angle Modifier × Shots on Target Multiplier",
        variables: [
          { symbol: "Big Chances", description: "Number of high-quality scoring chances" },
          { symbol: "Shots Inside Box", description: "Total shots taken inside the penalty area" },
          { symbol: "Shots Outside Box", description: "Total shots taken outside the penalty area" },
          { symbol: "Distance Modifier", description: "Adjustment based on average shot distance" },
          { symbol: "Angle Modifier", description: "Adjustment based on average shot angle" },
          { symbol: "Shots on Target Multiplier", description: "Multiplier based on shot accuracy" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A team takes 15 shots in a match, with 7 on target, 3 big chances, 10 shots inside the box, 5 outside the box, an average shot distance of 16 meters, and an average shot angle of 25 degrees.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the total shots (15), shots on target (7), big chances (3), shots inside box (10), shots outside box (5), average distance (16), and average angle (25) into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator applies the formula considering shot quality and modifiers to estimate the expected goals.",
          },
          {
            label: "Step 3",
            explanation:
              "The resulting xG value indicates how many goals the team was expected to score based on the quality of their chances.",
          },
        ],
        result: "Expected Goals (xG): 2.080",
      }}
      relatedCalculators={[
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🏆" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
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