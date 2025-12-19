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

export default function WinProbabilityShiftWpsCalculator() {
  // Inputs:
  // prePlayWinProb: Win probability before the play (0-100%)
  // postPlayWinProb: Win probability after the play (0-100%)
  // playDescription: Optional description of the play
  const [inputs, setInputs] = useState({
    prePlayWinProb: "",
    postPlayWinProb: "",
    playDescription: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate Win Probability Shift (WPS)
  // WPS = postPlayWinProb - prePlayWinProb
  // Positive WPS means the play increased the chance of winning, negative means decreased.
  const results = useMemo(() => {
    const pre = parseFloat(inputs.prePlayWinProb);
    const post = parseFloat(inputs.postPlayWinProb);

    if (isNaN(pre) || isNaN(post)) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid numeric probabilities between 0 and 100.",
        warning: "Invalid input",
        formulaUsed: "WPS = Post-Play Win Probability - Pre-Play Win Probability",
      };
    }
    if (pre < 0 || pre > 100 || post < 0 || post > 100) {
      return {
        value: null,
        label: "",
        subtext: "Win probabilities must be between 0 and 100 percent.",
        warning: "Out of range",
        formulaUsed: "WPS = Post-Play Win Probability - Pre-Play Win Probability",
      };
    }

    const wps = post - pre;
    const wpsFormatted = wps.toFixed(2) + "%";

    let interpretation = "";
    if (wps > 0) {
      interpretation = "This play positively shifted the win probability.";
    } else if (wps < 0) {
      interpretation = "This play negatively shifted the win probability.";
    } else {
      interpretation = "This play had no impact on win probability.";
    }

    return {
      value: wpsFormatted,
      label: "Win Probability Shift",
      subtext: interpretation,
      warning: null,
      formulaUsed: "WPS = Post-Play Win Probability - Pre-Play Win Probability",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Win Probability Shift (WPS)?",
      answer:
        "Win Probability Shift quantifies how a specific event or play changes a team's likelihood of winning a game. It is calculated as the difference between the win probability immediately after the play and before the play, expressed as a percentage. This metric helps analysts and coaches understand the impact of critical moments in real-time.",
    },
    {
      question: "How accurate are win probability models?",
      answer:
        "Win probability models rely on historical data, game context, and statistical algorithms to estimate the likelihood of winning. While they provide valuable insights, their accuracy depends on the quality of input data and model assumptions. Continuous refinement and validation against real game outcomes are essential for maintaining reliability.",
    },
    {
      question: "Can WPS be negative?",
      answer:
        "Yes, a negative Win Probability Shift indicates that the play decreased the team's chances of winning. For example, a turnover or missed scoring opportunity typically results in a negative WPS, signaling a detrimental impact on the team's prospects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prePlayWinProb" className="flex items-center gap-1">
                <Gauge className="w-5 h-5 text-blue-600" /> Pre-Play Win Probability (%)
              </Label>
              <Input
                id="prePlayWinProb"
                type="number"
                min={0}
                max={100}
                step={0.01}
                placeholder="e.g. 45.5"
                value={inputs.prePlayWinProb}
                onChange={(e) => handleInputChange("prePlayWinProb", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postPlayWinProb" className="flex items-center gap-1">
                <Gauge className="w-5 h-5 text-green-600" /> Post-Play Win Probability (%)
              </Label>
              <Input
                id="postPlayWinProb"
                type="number"
                min={0}
                max={100}
                step={0.01}
                placeholder="e.g. 52.3"
                value={inputs.postPlayWinProb}
                onChange={(e) => handleInputChange("postPlayWinProb", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="playDescription" className="flex items-center gap-1">
                <Info className="w-5 h-5 text-gray-500" /> Play Description (optional)
              </Label>
              <Input
                id="playDescription"
                type="text"
                placeholder="Describe the play (e.g., 3rd down conversion)"
                value={inputs.playDescription}
                onChange={(e) => handleInputChange("playDescription", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              prePlayWinProb: "",
              postPlayWinProb: "",
              playDescription: "",
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
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
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
          Understanding Win Probability Shift (WPS) Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Win Probability Shift (WPS) is a critical metric in sports analytics that measures the impact of a single play or event on a team's likelihood of winning a game. By comparing the win probability immediately before and after a play, analysts can quantify how pivotal moments influence the game's outcome. This metric is widely used in sports such as football, basketball, and baseball to assess player performance, coaching decisions, and game strategy in real-time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The estimator relies on robust win probability models that incorporate factors like score margin, time remaining, field position, and team strength. These models are typically built using historical play-by-play data and advanced statistical techniques such as logistic regression or machine learning algorithms. Understanding WPS helps coaches and analysts identify momentum shifts, evaluate risk-reward decisions, and optimize game plans.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator provides a straightforward way to estimate WPS by inputting pre- and post-play win probabilities, allowing users to instantly see the effect of any play. It is an essential tool for broadcasters, analysts, coaches, and fans who want to deepen their understanding of game dynamics and decision-making.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate the Win Probability Shift, you need two key inputs: the win probability immediately before the play and the win probability immediately after the play. These probabilities are typically derived from advanced statistical models or live game data feeds. Enter these values as percentages between 0 and 100.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Obtain the pre-play win probability from a reliable source such as a live analytics platform or historical model.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the post-play win probability, reflecting the updated likelihood after the play concludes.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, add a description of the play to contextualize the result.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the Win Probability Shift, which indicates how much the play affected the chance of winning.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to analyze momentum changes and evaluate the significance of specific plays.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Coaches and analysts can leverage Win Probability Shift insights to tailor training and in-game strategies. Identifying plays that consistently generate positive WPS can help reinforce successful tactics and player behaviors. Conversely, recognizing negative shifts allows teams to address weaknesses and minimize costly errors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Integrating WPS analysis into video review sessions can enhance player understanding of situational impact, fostering smarter decision-making under pressure. Additionally, tracking WPS trends over a season can reveal patterns in team performance and inform adjustments to game plans or personnel deployment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For optimal use, combine WPS data with physiological and psychological metrics to develop holistic training programs that improve both physical execution and mental resilience during critical game moments.
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
          For more information on sports analytics, training science, and win probability modeling, consult the following authoritative sources:
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
              Premier organization dedicated to advancing strength and conditioning knowledge, including performance analytics and athlete monitoring.
            </p>
          </li>
          <li>
            <a
              href="https://www.nfl.com/news/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NFL Analytics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official source of advanced football analytics, including win probability models and real-time game impact metrics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Win Probability Shift (WPS) Estimator"
      description="Estimate Win Probability Shift. Analyze how specific plays impact the likelihood of winning a game in real-time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "WPS = Post-Play Win Probability - Pre-Play Win Probability",
        variables: [
          { symbol: "WPS", description: "Win Probability Shift (%)" },
          { symbol: "Post-Play Win Probability", description: "Win probability immediately after the play (%)" },
          { symbol: "Pre-Play Win Probability", description: "Win probability immediately before the play (%)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "During a football game, the home team had a 40% chance of winning before a critical 4th down conversion play. After successfully converting the 4th down, the win probability increased to 55%.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the pre-play win probability as 40%.",
          },
          {
            label: "Step 2",
            explanation: "Input the post-play win probability as 55%.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate the Win Probability Shift: 55% - 40% = +15%. This indicates the play increased the team's chance of winning by 15 percentage points.",
          },
        ],
        result: "The WPS of +15% reflects a significant positive impact of the 4th down conversion on the game's outcome.",
      }}
      relatedCalculators={[
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
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