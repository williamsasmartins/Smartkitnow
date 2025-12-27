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

function parseFraction(fraction) {
  // fraction format: "numerator/denominator"
  const parts = fraction.split("/");
  if (parts.length !== 2) return null;
  const num = parseFloat(parts[0]);
  const den = parseFloat(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return null;
  return num / den;
}

function formatFraction(decimal) {
  // Convert decimal odds to fractional odds (simplified)
  // decimal = 1 + (num/den)
  // so fractional = decimal - 1
  // We'll approximate fraction with denominator <= 100
  const tolerance = 1e-6;
  let bestNum = 1;
  let bestDen = 1;
  let bestError = Math.abs(decimal - 1 - bestNum / bestDen);
  for (let den = 1; den <= 100; den++) {
    const num = Math.round((decimal - 1) * den);
    if (num < 1) continue;
    const error = Math.abs(decimal - 1 - num / den);
    if (error < bestError) {
      bestError = error;
      bestNum = num;
      bestDen = den;
      if (bestError < tolerance) break;
    }
  }
  return `${bestNum}/${bestDen}`;
}

function moneylineToDecimal(moneyline) {
  // moneyline is a number (positive or negative)
  if (moneyline > 0) {
    return (moneyline / 100) + 1;
  } else if (moneyline < 0) {
    return (100 / Math.abs(moneyline)) + 1;
  }
  return null;
}

function decimalToMoneyline(decimal) {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else if (decimal > 1 && decimal < 2) {
    return Math.round(-100 / (decimal - 1));
  }
  return null;
}

export default function BettingOddsPayoutCalculator() {
  // Inputs:
  // - Odds format: Decimal, Fractional, Moneyline
  // - Odds value
  // - Bet amount (stake)
  // Outputs:
  // - Decimal odds
  // - Fractional odds
  // - Moneyline odds
  // - Potential payout (stake * decimal odds)
  // - Potential profit (payout - stake)

  const [inputs, setInputs] = useState({
    oddsFormat: "decimal",
    oddsValue: "",
    stake: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { oddsFormat, oddsValue, stake } = inputs;

    if (!oddsValue || !stake) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const stakeNum = parseFloat(stake);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive stake amount.",
        formulaUsed: "",
      };
    }

    let decimalOdds = null;
    let warning = null;

    if (oddsFormat === "decimal") {
      const dec = parseFloat(oddsValue);
      if (isNaN(dec) || dec < 1) {
        warning = "Decimal odds must be a number greater than or equal to 1.";
      } else {
        decimalOdds = dec;
      }
    } else if (oddsFormat === "fractional") {
      const frac = oddsValue.trim();
      const fracDecimal = parseFraction(frac);
      if (fracDecimal === null) {
        warning = "Fractional odds must be in the format numerator/denominator (e.g. 5/1).";
      } else {
        decimalOdds = 1 + fracDecimal;
      }
    } else if (oddsFormat === "moneyline") {
      // moneyline can be + or - number
      let ml = oddsValue.trim();
      if (ml.startsWith("+")) ml = ml.slice(1);
      const mlNum = parseInt(ml, 10);
      if (isNaN(mlNum) || mlNum === 0) {
        warning = "Moneyline odds must be a non-zero integer (e.g. +150 or -200).";
      } else {
        decimalOdds = moneylineToDecimal(mlNum);
        if (decimalOdds === null) {
          warning = "Invalid moneyline odds.";
        }
      }
    }

    if (warning) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning,
        formulaUsed: "",
      };
    }

    // Calculate payout and profit
    const payout = stakeNum * decimalOdds;
    const profit = payout - stakeNum;

    // Convert decimal odds to fractional and moneyline for display
    const fractionalOdds = formatFraction(decimalOdds);
    const moneylineOdds = decimalToMoneyline(decimalOdds);

    return {
      value: payout.toFixed(2),
      label: "Potential Payout (Stake + Profit)",
      subtext: `Decimal Odds: ${decimalOdds.toFixed(2)} | Fractional Odds: ${fractionalOdds} | Moneyline Odds: ${
        moneylineOdds > 0 ? "+" + moneylineOdds : moneylineOdds
      }`,
      warning: null,
      formulaUsed: `Payout = Stake × Decimal Odds = ${stakeNum} × ${decimalOdds.toFixed(2)} = ${payout.toFixed(2)}`,
      profit: profit.toFixed(2),
      decimalOdds: decimalOdds.toFixed(2),
      fractionalOdds,
      moneylineOdds: moneylineOdds > 0 ? "+" + moneylineOdds : moneylineOdds.toString(),
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What are the differences between Decimal, Fractional, and Moneyline odds?",
      answer:
        "Decimal odds represent the total payout including the stake, expressed as a decimal number (e.g., 2.50). Fractional odds show the profit relative to the stake as a fraction (e.g., 3/2 means you win $3 for every $2 staked). Moneyline odds are popular in the US and can be positive or negative numbers indicating how much you win on a $100 stake or how much you need to stake to win $100, respectively.",
    },
    {
      question: "How do I calculate my potential profit using this calculator?",
      answer:
        "Enter your bet amount and the odds in your preferred format. The calculator converts the odds to decimal format internally and multiplies it by your stake to give the total payout. Your profit is the payout minus your original stake. This helps you understand how much you stand to win if your bet is successful.",
    },
    {
      question: "Can this calculator help me compare odds from different bookmakers?",
      answer:
        "Yes, by converting odds into a common format (decimal), you can easily compare the potential payouts from different bookmakers even if they use different odds formats. This ensures you get the best value for your bets and make informed decisions.",
    },
    {
      question: "Why is it important to understand different odds formats?",
      answer:
        "Understanding different odds formats allows bettors to interpret betting lines correctly, compare offers across regions, and calculate potential returns accurately. It also helps in managing betting strategies and bankroll effectively, reducing confusion and mistakes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="oddsFormat" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
          Odds Format <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.oddsFormat}
          onValueChange={(v) => handleInputChange("oddsFormat", v)}
          aria-label="Select odds format"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select odds format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="decimal">Decimal (e.g., 2.50)</SelectItem>
            <SelectItem value="fractional">Fractional (e.g., 5/2)</SelectItem>
            <SelectItem value="moneyline">Moneyline (e.g., +150 or -200)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="oddsValue" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
          Odds Value <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="oddsValue"
          type="text"
          placeholder={
            inputs.oddsFormat === "decimal"
              ? "e.g., 2.50"
              : inputs.oddsFormat === "fractional"
              ? "e.g., 5/2"
              : "e.g., +150 or -200"
          }
          value={inputs.oddsValue}
          onChange={(e) => handleInputChange("oddsValue", e.target.value)}
          aria-describedby="oddsValueHelp"
        />
      </div>

      <div>
        <Label htmlFor="stake" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
          Bet Amount (Stake) <Heart className="w-4 h-4 text-red-600" />
        </Label>
        <Input
          id="stake"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter your bet amount"
          value={inputs.stake}
          onChange={(e) => handleInputChange("stake", e.target.value)}
          aria-describedby="stakeHelp"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger re-render, inputs already update on change
          }}
          aria-label="Calculate payout"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oddsFormat: "decimal", oddsValue: "", stake: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700 border shadow-sm">
          <CardContent className="p-4 text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">${results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Betting Odds &amp; Payout Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Betting odds are numerical expressions that represent the likelihood of a particular outcome in a sporting event or other wager. They also determine how much money you can win relative to your stake. There are three primary odds formats used worldwide: Decimal, Fractional, and Moneyline. Each format conveys the same information but in different ways, catering to regional preferences and betting cultures.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Decimal odds are popular in Europe, Canada, and Australia. They represent the total payout (stake plus profit) for every unit staked. For example, decimal odds of 2.50 mean that for every $1 wagered, you receive $2.50 back if you win. Fractional odds, common in the UK and Ireland, show the profit relative to the stake as a fraction, such as 5/2, meaning you win $5 for every $2 wagered. Moneyline odds, prevalent in the United States, use positive and negative numbers to indicate how much you win on a $100 stake or how much you need to stake to win $100.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these odds formats is crucial for bettors to accurately calculate potential payouts and profits. This calculator helps convert between these formats and computes your potential returns based on your stake and the odds provided. Whether you are a novice or an experienced bettor, mastering odds interpretation empowers you to make informed betting decisions and manage your bankroll effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to accommodate all common odds formats. First, select the odds format you have from the dropdown menu: Decimal, Fractional, or Moneyline. Then, enter the odds value in the appropriate format. For example, if you choose Fractional, enter odds like "5/2". Next, input the amount of money you intend to stake on the bet.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering these inputs, click the "Calculate" button to see your potential payout, which includes your original stake plus the profit you would earn if your bet wins. The calculator also displays the equivalent odds in all three formats for your reference. If you want to start over, use the "Reset" button to clear all fields.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your odds format (Decimal, Fractional, or Moneyline).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the odds value in the chosen format.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your bet amount (stake).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your potential payout and profit.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your betting success, it is essential to understand not only how to calculate payouts but also how to interpret odds in the context of value betting. Always compare odds from multiple bookmakers to find the best value. Even small differences in odds can significantly affect your long-term profitability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Practice converting odds between formats manually to build confidence and speed in assessing bets. Use this calculator as a tool to verify your calculations and explore different betting scenarios. Additionally, manage your bankroll wisely by staking only a small percentage of your total funds on any single bet to reduce risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, keep detailed records of your bets, odds, stakes, and outcomes. Analyzing your betting history helps identify strengths and weaknesses in your strategy, allowing you to refine your approach and improve your overall results over time.
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
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.gamblerspick.com/betting-odds-explained"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              GamblersPick: Betting Odds Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide explaining different betting odds formats and how to interpret them effectively.
            </p>
          </li>
          <li>
            <a
              href="https://www.actionnetwork.com/betting-101/how-to-read-betting-odds"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Action Network: How to Read Betting Odds <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanations and examples on reading and converting between decimal, fractional, and moneyline odds.
            </p>
          </li>
          <li>
            <a
              href="https://www.sportsbettingdime.com/guides/betting-odds/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sports Betting Dime: Betting Odds Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An authoritative resource covering odds formats, payout calculations, and betting strategies.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  const formula = {
    title: "Payout Calculation Formula",
    formula: "Payout = Stake × Decimal Odds",
    variables: [
      { symbol: "Payout", description: "Total amount returned including stake" },
      { symbol: "Stake", description: "Amount of money wagered" },
      { symbol: "Decimal Odds", description: "Odds expressed in decimal format" },
    ],
  };

  const example = {
    title: "Real Life Example",
    scenario:
      "You want to bet $50 on a team with fractional odds of 5/2. You want to know your potential payout and profit.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert fractional odds 5/2 to decimal odds: 1 + (5 ÷ 2) = 3.5",
      },
      {
        label: "Step 2",
        explanation: "Multiply your stake by decimal odds: 50 × 3.5 = 175",
      },
      {
        label: "Step 3",
        explanation:
          "Your potential payout is $175, which includes your original $50 stake plus $125 profit.",
      },
    ],
    result: "Potential Payout: $175 (Stake + Profit), Profit: $125",
  };

  return (
    <CalculatorVerticalLayout
      title="Betting Odds &amp; Payout Calculator"
      description="Calculate potential betting payouts. Convert between Decimal, Fractional, and Moneyline odds to see your return."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
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