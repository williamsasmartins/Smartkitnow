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

export default function ExpectedGoalsXgHelperCalculator() {
  const [inputs, setInputs] = useState({
    shots: "",
    shotsOnTarget: "",
    bigChances: "",
    shotDistance: "",
    shotAngle: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * xG (Expected Goals) is a complex metric derived from historical shot data,
   * factoring in shot location, shot type, assist type, defensive pressure, and other contextual variables.
   * This calculator provides an approximate xG reading helper based on user-input shot statistics.
   * 
   * Note: This is a simplified model for educational and analytical purposes only.
   */
  const results = useMemo(() => {
    const shots = Number(inputs.shots);
    const shotsOnTarget = Number(inputs.shotsOnTarget);
    const bigChances = Number(inputs.bigChances);
    const shotDistance = Number(inputs.shotDistance);
    const shotAngle = Number(inputs.shotAngle);

    if (
      !shots || shots <= 0 ||
      shotsOnTarget < 0 || shotsOnTarget > shots ||
      bigChances < 0 || bigChances > shots ||
      shotDistance <= 0 || shotDistance > 50 ||
      shotAngle <= 0 || shotAngle > 180
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid inputs within realistic ranges.",
        warning: "Invalid input detected.",
        formulaUsed: "",
      };
    }

    /**
     * Simplified xG estimation formula:
     * Base xG per shot decreases with distance and angle difficulty.
     * Big chances have a higher base xG.
     * Shots on target increase likelihood of scoring.
     * 
     * Formula (approximate):
     * xG = (bigChances * 0.4) + ((shots - bigChances) * baseChance)
     * baseChance = max(0.05, (0.3 - (shotDistance * 0.005) - ((shotAngle / 180) * 0.1)))
     * Adjusted by shots on target ratio: xG * (shotsOnTarget / shots)
     */
    const baseChance = Math.max(0.05, 0.3 - (shotDistance * 0.005) - ((shotAngle / 180) * 0.1));
    let xGraw = (bigChances * 0.4) + ((shots - bigChances) * baseChance);
    const onTargetRatio = shotsOnTarget / shots;
    const xGfinal = +(xGraw * onTargetRatio).toFixed(3);

    return {
      value: xGfinal,
      label: "Estimated xG",
      subtext: `Based on ${shots} shots, ${shotsOnTarget} on target, ${bigChances} big chances, average shot distance ${shotDistance}m, and shot angle ${shotAngle}°.`,
      warning: null,
      formulaUsed: "xG ≈ (Big Chances × 0.4 + (Shots - Big Chances) × baseChance) × (Shots On Target / Shots)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Expected Goals (xG) in football?",
      answer:
        "Expected Goals (xG) is a statistical measure that estimates the likelihood of a shot resulting in a goal based on various factors such as shot location, shot type, and game context. It helps quantify the quality of scoring chances beyond just goals scored, providing deeper insight into team and player performance.",
    },
    {
      question: "How accurate is this xG Reading Helper calculator?",
      answer:
        "This calculator provides an approximate xG value based on simplified inputs and assumptions. Professional xG models use extensive historical data and machine learning algorithms to account for many more variables. Use this tool as a guide rather than a definitive measure.",
    },
    {
      question: "Can xG help improve team tactics and training?",
      answer:
        "Yes, analyzing xG data allows coaches and analysts to identify strengths and weaknesses in attacking and defensive play. It helps in optimizing shot selection, positioning, and overall strategy to increase scoring efficiency and reduce conceding high-quality chances.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shots" className="flex items-center gap-1">
                Total Shots <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="shots"
                type="number"
                min={1}
                max={100}
                value={inputs.shots}
                onChange={e => handleInputChange("shots", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <Label htmlFor="shotsOnTarget" className="flex items-center gap-1">
                Shots on Target <TargetIcon />
              </Label>
              <Input
                id="shotsOnTarget"
                type="number"
                min={0}
                max={inputs.shots || 100}
                value={inputs.shotsOnTarget}
                onChange={e => handleInputChange("shotsOnTarget", e.target.value)}
                placeholder="e.g. 6"
              />
            </div>
            <div>
              <Label htmlFor="bigChances" className="flex items-center gap-1">
                Big Chances <Trophy className="w-4 h-4 text-yellow-600" />
              </Label>
              <Input
                id="bigChances"
                type="number"
                min={0}
                max={inputs.shots || 100}
                value={inputs.bigChances}
                onChange={e => handleInputChange("bigChances", e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <Label htmlFor="shotDistance" className="flex items-center gap-1">
                Avg. Shot Distance (meters) <Scale className="w-4 h-4 text-green-600" />
              </Label>
              <Input
                id="shotDistance"
                type="number"
                min={1}
                max={50}
                value={inputs.shotDistance}
                onChange={e => handleInputChange("shotDistance", e.target.value)}
                placeholder="e.g. 14"
              />
            </div>
            <div>
              <Label htmlFor="shotAngle" className="flex items-center gap-1">
                Avg. Shot Angle (degrees) <Gauge className="w-4 h-4 text-red-600" />
              </Label>
              <Input
                id="shotAngle"
                type="number"
                min={1}
                max={180}
                value={inputs.shotAngle}
                onChange={e => handleInputChange("shotAngle", e.target.value)}
                placeholder="e.g. 45"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo updates automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              shots: "",
              shotsOnTarget: "",
              bigChances: "",
              shotDistance: "",
              shotAngle: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-600">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding xG (Expected Goals) Reading Helper</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Expected Goals (xG) is a cutting-edge football analytics metric designed to quantify the quality of scoring chances created by a team or player during a match. Unlike traditional statistics that only count goals scored, xG evaluates every shot based on factors such as shot location, angle, distance, and the type of chance, providing a probabilistic estimate of whether the shot should have resulted in a goal. This metric helps analysts, coaches, and fans understand performance beyond the final scoreline by highlighting how well a team created or prevented high-quality opportunities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The xG Reading Helper calculator simplifies this complex model by allowing users to input key shot statistics—total shots, shots on target, big chances, average shot distance, and shot angle—to estimate an expected goals value. While professional xG models use vast datasets and machine learning, this tool offers an accessible approximation to help interpret match data and improve tactical insights.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To utilize this calculator effectively, gather your team's or player's shot statistics from a match or training session. Input the total number of shots taken, how many were on target, the count of big chances (clear goal-scoring opportunities), the average distance from goal for these shots, and the average shot angle relative to the goal. These inputs collectively influence the likelihood of scoring, which the calculator uses to estimate the xG value.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Enter the total shots taken during the match or session.</li>
          <li><strong>Step 2:</strong> Input how many of those shots were on target, indicating shot accuracy.</li>
          <li><strong>Step 3:</strong> Specify the number of big chances, representing high-quality scoring opportunities.</li>
          <li><strong>Step 4:</strong> Provide the average shot distance in meters, as shots closer to goal generally have higher scoring probability.</li>
          <li><strong>Step 5:</strong> Enter the average shot angle in degrees; shots from narrower angles are typically harder to convert.</li>
          <li><strong>Step 6:</strong> Click "Calculate" to see the estimated xG value, which reflects the expected number of goals from the given shot profile.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use xG data to identify areas where your team can improve shot quality and decision-making. For example, if your xG is significantly higher than actual goals scored, focus on finishing drills and composure under pressure to convert chances more effectively. Conversely, if xG is low despite many shots, work on creating better shooting opportunities through improved positioning, passing, and movement off the ball.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Coaches should incorporate xG analysis into tactical planning by emphasizing shot selection and encouraging players to take higher percentage shots closer to goal and from better angles. Defensive training can also benefit by reducing opponents’ big chances and forcing shots from low-probability areas, effectively lowering their xG.
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
          For more information on football analytics, training science, and performance metrics, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fifa.com/technical/football-analytics" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              FIFA Football Analytics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official insights and research on football performance metrics and analytics from the global governing body.
            </p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Leading organization providing research and guidelines on sports science, exercise physiology, and performance optimization.
            </p>
          </li>
          <li>
            <a href="https://www.nsca.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative body on strength and conditioning practices, including training methods to improve athletic performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Dummy icon for Shots on Target (not in lucide-react), using Flag as substitute
  function TargetIcon() {
    return <Flag className="w-4 h-4 text-purple-600" />;
  }

  return (
    <CalculatorVerticalLayout
      title="xG (Expected Goals) Reading Helper"
      description="Understand Expected Goals (xG). Interpret match statistics to analyze team performance beyond the final score."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Simplified xG Estimation Formula",
        formula:
          "xG ≈ (Big Chances × 0.4 + (Shots - Big Chances) × baseChance) × (Shots On Target / Shots), where baseChance = max(0.05, 0.3 - 0.005 × Distance - 0.1 × (Angle / 180))",
        variables: [
          { symbol: "Shots", description: "Total shots taken" },
          { symbol: "Shots On Target", description: "Shots that were on target" },
          { symbol: "Big Chances", description: "High-quality scoring opportunities" },
          { symbol: "Distance", description: "Average shot distance in meters" },
          { symbol: "Angle", description: "Average shot angle in degrees" },
          { symbol: "baseChance", description: "Base probability of scoring per shot" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A team took 12 shots in a match, with 7 on target and 4 classified as big chances. The average shot distance was 16 meters, and the average shot angle was 40 degrees.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the total shots (12), shots on target (7), and big chances (4).",
          },
          {
            label: "Step 2",
            explanation: "Enter the average shot distance (16m) and shot angle (40°).",
          },
          {
            label: "Step 3",
            explanation: "Calculate the baseChance: 0.3 - (16 × 0.005) - (40/180 × 0.1) = 0.3 - 0.08 - 0.022 ≈ 0.198.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate raw xG: (4 × 0.4) + (8 × 0.198) = 1.6 + 1.584 = 3.184.",
          },
          {
            label: "Step 5",
            explanation: "Adjust by shots on target ratio: 3.184 × (7/12) ≈ 1.857 xG.",
          },
        ],
        result: "The estimated xG for this team in the match is approximately 1.86 goals.",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
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