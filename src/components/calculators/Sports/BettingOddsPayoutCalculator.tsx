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

function parseFraction(fraction) {
  // Parses fractional odds string like "5/1" or "7/4" into decimal number
  if (!fraction) return null;
  const parts = fraction.split("/");
  if (parts.length !== 2) return null;
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

export default function BettingOddsPayoutCalculator() {
  // Inputs: oddsType, oddsValue, stake
  const [inputs, setInputs] = useState({
    oddsType: "decimal",
    oddsValue: "",
    stake: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion helpers
  // Decimal odds to fractional odds (string)
  function decimalToFractional(decimal) {
    if (decimal < 1) return null;
    // fractional = decimal - 1
    // convert fractional decimal to fraction string approx
    const frac = decimal - 1;
    // Use simple fraction approximation (max denominator 100)
    const tolerance = 1.0E-6;
    let h1 = 1,
      h2 = 0,
      k1 = 0,
      k2 = 1,
      b = frac;
    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(frac - h1 / k1) > frac * tolerance);

    return `${h1}/${k1}`;
  }

  // Decimal odds to moneyline odds (number)
  function decimalToMoneyline(decimal) {
    if (decimal >= 2) {
      return Math.round((decimal - 1) * 100);
    } else if (decimal > 1) {
      return Math.round(-100 / (decimal - 1));
    }
    return null;
  }

  // Moneyline odds to decimal
  function moneylineToDecimal(moneyline) {
    const ml = parseFloat(moneyline);
    if (isNaN(ml)) return null;
    if (ml > 0) {
      return (ml / 100) + 1;
    } else if (ml < 0) {
      return (100 / Math.abs(ml)) + 1;
    }
    return null;
  }

  // Fractional odds to decimal
  function fractionalToDecimal(fraction) {
    const frac = parseFraction(fraction);
    if (frac === null) return null;
    return frac + 1;
  }

  // Calculate payout and profit given decimal odds and stake
  function calculatePayout(decimalOdds, stake) {
    if (decimalOdds === null || stake === null) return null;
    return decimalOdds * stake;
  }
  function calculateProfit(decimalOdds, stake) {
    if (decimalOdds === null || stake === null) return null;
    return (decimalOdds - 1) * stake;
  }

  // Parse inputs
  const oddsType = inputs.oddsType;
  let oddsValueRaw = inputs.oddsValue.trim();
  let stakeRaw = inputs.stake.trim();

  // Parse stake
  const stake = parseFloat(stakeRaw);
  const stakeValid = !isNaN(stake) && stake > 0;

  // Parse odds to decimal
  let decimalOdds = null;
  let oddsValid = false;
  if (oddsType === "decimal") {
    const val = parseFloat(oddsValueRaw);
    if (!isNaN(val) && val >= 1.01) {
      decimalOdds = val;
      oddsValid = true;
    }
  } else if (oddsType === "fractional") {
    const val = fractionalToDecimal(oddsValueRaw);
    if (val !== null && val >= 1.01) {
      decimalOdds = val;
      oddsValid = true;
    }
  } else if (oddsType === "moneyline") {
    const val = moneylineToDecimal(oddsValueRaw);
    if (val !== null && val >= 1.01) {
      decimalOdds = val;
      oddsValid = true;
    }
  }

  // Calculate results if valid
  const results = useMemo(() => {
    if (!oddsValid || !stakeValid) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: (!oddsValid ? "Please enter valid odds." : !stakeValid ? "Please enter a valid stake amount." : null),
        formulaUsed: null,
      };
    }

    // Calculate payout and profit
    const payout = calculatePayout(decimalOdds, stake);
    const profit = calculateProfit(decimalOdds, stake);

    // Convert odds to all formats for display
    const fractional = decimalToFractional(decimalOdds);
    const moneyline = decimalToMoneyline(decimalOdds);

    return {
      value: (
        <>
          <p className="text-3xl font-semibold mb-2">Potential Payout: <span className="text-green-700">${payout.toFixed(2)}</span></p>
          <p className="text-xl font-medium mb-1">Profit: <span className="text-blue-700">${profit.toFixed(2)}</span></p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Stake: ${stake.toFixed(2)}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Odds Formats:</p>
          <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300">
            <li>Decimal: {decimalOdds.toFixed(2)}</li>
            <li>Fractional: {fractional}</li>
            <li>Moneyline: {moneyline > 0 ? `+${moneyline}` : moneyline}</li>
          </ul>
        </>
      ),
      label: "Calculation Results",
      subtext: "Calculated based on your input odds and stake.",
      warning: null,
      formulaUsed: "Payout = Odds × Stake; Profit = Payout - Stake",
    };
  }, [decimalOdds, oddsValid, stake, stakeValid]);

  const faqs = [
    {
      question: "What are the different types of betting odds?",
      answer:
        "Betting odds come in three main formats: Decimal, Fractional, and Moneyline. Decimal odds represent the total payout including stake, fractional odds show the profit relative to stake, and moneyline odds indicate how much you need to bet or will win on a $100 stake. Understanding these formats helps bettors compare and calculate potential returns accurately.",
    },
    {
      question: "How do I calculate my potential payout?",
      answer:
        "To calculate your potential payout, multiply your stake by the decimal odds. For example, a $50 stake at decimal odds of 2.5 yields a payout of $125. The profit is the payout minus the original stake. This calculator automates these conversions and calculations for ease of use.",
    },
    {
      question: "Can I convert between odds formats?",
      answer:
        "Yes, this calculator converts between decimal, fractional, and moneyline odds seamlessly. This is essential for bettors who encounter different odds formats depending on the sportsbook or region, ensuring clarity and informed betting decisions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="oddsType" className="mb-1 flex items-center gap-1 font-semibold">
                Odds Format <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.oddsType}
                onValueChange={(v) => handleInputChange("oddsType", v)}
                aria-label="Select odds format"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select odds format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">Decimal (e.g., 2.50)</SelectItem>
                  <SelectItem value="fractional">Fractional (e.g., 3/2)</SelectItem>
                  <SelectItem value="moneyline">Moneyline (e.g., +150 or -200)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="oddsValue" className="mb-1 flex items-center gap-1 font-semibold">
                Odds Value <Info className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="oddsValue"
                type="text"
                placeholder={
                  inputs.oddsType === "decimal"
                    ? "e.g., 2.50"
                    : inputs.oddsType === "fractional"
                    ? "e.g., 3/2"
                    : "e.g., +150 or -200"
                }
                value={inputs.oddsValue}
                onChange={(e) => handleInputChange("oddsValue", e.target.value)}
                aria-describedby="oddsValueHelp"
              />
              <p id="oddsValueHelp" className="text-xs text-slate-500 mt-1">
                Enter the odds in the selected format.
              </p>
            </div>

            <div>
              <Label htmlFor="stake" className="mb-1 flex items-center gap-1 font-semibold">
                Stake Amount ($) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="stake"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 50"
                value={inputs.stake}
                onChange={(e) => handleInputChange("stake", e.target.value)}
                aria-describedby="stakeHelp"
              />
              <p id="stakeHelp" className="text-xs text-slate-500 mt-1">
                Enter the amount you want to bet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers re-render, calculation is memoized
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate payout"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oddsType: "decimal", oddsValue: "", stake: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700">
          <CardContent className="p-4 text-center font-semibold">{results.warning}</CardContent>
        </Card>
      )}

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">{results.value}</CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Betting Odds & Payout Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Betting odds are numerical expressions that represent the probability of a particular outcome in a sporting event and determine the potential payout for a winning bet. They come in three primary formats: decimal, fractional, and moneyline, each favored in different regions and sportsbooks. Decimal odds represent the total return for every unit staked, fractional odds show the profit relative to the stake, and moneyline odds indicate how much you need to bet to win $100 or how much you win on a $100 stake. This calculator provides an authoritative tool to convert between these formats and accurately compute potential payouts and profits based on your stake.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these odds formats and their conversions is essential for bettors to make informed decisions and manage their bankroll effectively. This calculator integrates the mathematical principles behind odds conversion and payout calculation, ensuring precision and clarity for users across all betting markets.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for both novice and experienced bettors. First, select the odds format you have from the dropdown menu — Decimal, Fractional, or Moneyline. Then, enter the odds value exactly as provided by your sportsbook, ensuring correct formatting for fractional (e.g., 5/2) or moneyline odds (e.g., +150 or -200). Finally, input the amount of money you intend to stake on the bet.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the odds format that matches your betting slip.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the odds value carefully, respecting the format conventions.
          </li>
          <li>
            <strong>Step 3:</strong> Input your stake amount in dollars or your preferred currency.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your potential payout and profit, along with the odds converted into all three formats for clarity.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear inputs and perform new calculations.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this calculator focuses on the mathematical aspect of betting, successful sports betting also requires strategic bankroll management and understanding of the sports and markets you bet on. Always set a budget for your betting activities and avoid chasing losses. Use the payout calculator to evaluate the risk-reward ratio of different bets and compare odds across sportsbooks to find the best value. Additionally, consider the implied probability from odds to assess if a bet offers a positive expected value.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember that no calculator can predict outcomes, but by using this tool to understand payouts and odds conversions, you can make more informed decisions and improve your overall betting discipline and strategy.
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
          For more information on sports betting principles, odds formats, and responsible gambling, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.gamblingcommission.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              UK Gambling Commission <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Regulates gambling and betting activities in the UK, promoting fairness and responsible gambling.
            </p>
          </li>
          <li>
            <a
              href="https://www.igamingbusiness.com/education/betting-odds-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              iGaming Business - Betting Odds Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on different betting odds formats and how to calculate payouts.
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
              While focused on sports science, NSCA provides insights into performance metrics relevant to sports betting analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Betting Odds & Payout Calculator"
      description="Calculate potential betting payouts. Convert between Decimal, Fractional, and Moneyline odds to see your return."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Payout = Odds × Stake; Profit = Payout - Stake",
        variables: [
          { symbol: "Odds", description: "Decimal odds representing total return per unit stake" },
          { symbol: "Stake", description: "Amount of money wagered" },
          { symbol: "Payout", description: "Total amount returned including stake" },
          { symbol: "Profit", description: "Net gain after subtracting stake" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to bet $50 on a team with fractional odds of 5/2. You want to know your potential payout and profit.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert fractional odds 5/2 to decimal odds: 5 ÷ 2 + 1 = 3.5 decimal odds.",
          },
          {
            label: "Step 2",
            explanation: "Calculate payout: 3.5 × $50 = $175 total payout.",
          },
          {
            label: "Step 3",
            explanation: "Calculate profit: $175 - $50 = $125 net profit.",
          },
        ],
        result: "Your potential payout is $175, with a profit of $125 on a $50 stake.",
      }}
      relatedCalculators={[
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
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