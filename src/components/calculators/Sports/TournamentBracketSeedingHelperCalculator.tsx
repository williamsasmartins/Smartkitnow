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

function generateSeedOrder(numTeams) {
  // Generates a standard single-elimination seeding order for 2^n teams.
  // This method uses the "standard" bracket seeding pattern to ensure top seeds meet in later rounds.
  // For example, for 8 teams: [1,8,5,4,3,6,7,2]
  if (numTeams & (numTeams - 1)) return null; // Not a power of two

  let seeds = [1, 2];
  while (seeds.length < numTeams) {
    const newSeeds = [];
    const length = seeds.length * 2 + 1;
    for (let seed of seeds) {
      newSeeds.push(seed);
      newSeeds.push(length - seed);
    }
    seeds = newSeeds;
  }
  return seeds;
}

export default function TournamentBracketSeedingHelperCalculator() {
  const [inputs, setInputs] = useState({
    numTeams: "",
    seedingMethod: "standard",
    customSeeds: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const numTeams = parseInt(inputs.numTeams, 10);
    if (!numTeams || numTeams < 2) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid number of teams (minimum 2).",
        warning: null,
        formulaUsed: "",
      };
    }
    // Check if numTeams is a power of two
    const isPowerOfTwo = (numTeams & (numTeams - 1)) === 0;
    if (!isPowerOfTwo) {
      return {
        value: null,
        label: "",
        subtext: "Number of teams must be a power of two (e.g., 4, 8, 16, 32).",
        warning: "Non-power-of-two brackets require byes or play-in matches, which this helper does not currently support.",
        formulaUsed: "",
      };
    }

    let seedOrder = [];
    if (inputs.seedingMethod === "standard") {
      seedOrder = generateSeedOrder(numTeams);
      if (!seedOrder) {
        return {
          value: null,
          label: "",
          subtext: "Error generating seed order.",
          warning: null,
          formulaUsed: "",
        };
      }
    } else if (inputs.seedingMethod === "custom") {
      // Parse custom seeds input (comma separated)
      const customSeeds = inputs.customSeeds
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((s) => s > 0 && s <= numTeams);
      if (customSeeds.length !== numTeams) {
        return {
          value: null,
          label: "",
          subtext: `Custom seeds must include exactly ${numTeams} unique seed numbers between 1 and ${numTeams}.`,
          warning: null,
          formulaUsed: "",
        };
      }
      // Validate uniqueness
      const uniqueSeeds = new Set(customSeeds);
      if (uniqueSeeds.size !== numTeams) {
        return {
          value: null,
          label: "",
          subtext: "Custom seeds must be unique.",
          warning: null,
          formulaUsed: "",
        };
      }
      seedOrder = customSeeds;
    }

    // Format the output as pairs for first round matchups
    const matchups = [];
    for (let i = 0; i < seedOrder.length; i += 2) {
      matchups.push(`Seed ${seedOrder[i]} vs Seed ${seedOrder[i + 1]}`);
    }

    return {
      value: (
        <div className="space-y-2">
          <p className="font-semibold text-lg">First Round Matchups:</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto">
            {matchups.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      ),
      label: `Tournament Bracket for ${numTeams} Teams`,
      subtext: "Seeds are arranged to ensure top seeds meet in later rounds, promoting fairness and competitiveness.",
      warning: null,
      formulaUsed:
        "Standard seeding formula: For 2^n teams, seeds are paired such that seed 1 plays seed N, seed 2 plays seed N-1, and so forth, recursively.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why must the number of teams be a power of two?",
      answer:
        "Single-elimination tournaments require the number of participants to be a power of two (e.g., 4, 8, 16) to ensure each round halves the field evenly without byes. If the number is not a power of two, byes or preliminary rounds are necessary to balance the bracket.",
    },
    {
      question: "What is the purpose of seeding in tournaments?",
      answer:
        "Seeding ranks teams or players based on their perceived strength or past performance to ensure that the strongest competitors do not meet until the later rounds. This promotes fairness and maintains spectator interest by potentially having the best matchups in the finals.",
    },
    {
      question: "Can I input custom seedings?",
      answer:
        "Yes, this helper allows custom seed input to accommodate specific tournament rules or preferences. Ensure your custom seeds are unique and cover all participants to avoid conflicts or errors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="numTeams" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Number of Teams <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="numTeams"
          type="number"
          min={2}
          step={1}
          placeholder="e.g. 8, 16, 32"
          value={inputs.numTeams}
          onChange={(e) => handleInputChange("numTeams", e.target.value)}
          aria-describedby="numTeamsHelp"
        />
        <p id="numTeamsHelp" className="text-xs text-slate-500 mt-1">
          Must be a power of two for standard brackets.
        </p>
      </div>

      <div>
        <Label htmlFor="seedingMethod" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Seeding Method <Flag className="w-4 h-4 text-green-600" />
        </Label>
        <Select
          value={inputs.seedingMethod}
          onValueChange={(v) => handleInputChange("seedingMethod", v)}
          id="seedingMethod"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select seeding method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Seeding</SelectItem>
            <SelectItem value="custom">Custom Seeding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputs.seedingMethod === "custom" && (
        <div>
          <Label htmlFor="customSeeds" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            Custom Seeds <Medal className="w-4 h-4 text-yellow-600" />
          </Label>
          <Input
            id="customSeeds"
            type="text"
            placeholder="Comma separated seed numbers, e.g. 1,8,5,4,3,6,7,2"
            value={inputs.customSeeds}
            onChange={(e) => handleInputChange("customSeeds", e.target.value)}
            aria-describedby="customSeedsHelp"
          />
          <p id="customSeedsHelp" className="text-xs text-slate-500 mt-1">
            Enter exactly the number of seeds equal to the number of teams.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already done on input change)
          }}
          aria-label="Calculate Tournament Bracket"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numTeams: "", seedingMethod: "standard", customSeeds: "" })}
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <p className="text-2xl font-bold text-blue-900 dark:text-white">{results.label}</p>
              <p className="text-sm text-blue-800 dark:text-blue-300">{results.subtext}</p>
              {results.warning && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> {results.warning}
                </p>
              )}
            </div>
            <div>{results.value}</div>
            {results.formulaUsed && (
              <p className="mt-6 text-xs italic text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                <Calculator className="inline w-4 h-4 mr-1" />
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Tournament Bracket Seeding Helper</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tournament seeding is a critical process in organizing knockout competitions, designed to rank participants based on skill, past performance, or qualifying results. Proper seeding ensures that the strongest competitors do not face each other in the early rounds, preserving competitive balance and spectator interest throughout the event. This helper calculator assists tournament organizers in generating fair and balanced brackets by calculating seed matchups for any power-of-two number of teams.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The standard seeding method pairs the highest seed with the lowest seed in the first round, the second highest with the second lowest, and so on, recursively. This approach maximizes the chances that top seeds progress to later rounds, aligning with common practices in sports such as NCAA basketball, FIFA knockout stages, and tennis Grand Slams.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator requires you to input the total number of teams participating in the tournament and select the seeding method. The number of teams must be a power of two (e.g., 4, 8, 16, 32) to ensure a balanced bracket without byes. You can choose between standard seeding, which automatically generates matchups, or custom seeding, where you specify the exact seed order.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Enter the total number of teams (must be a power of two).</li>
          <li><strong>Step 2:</strong> Select the seeding method: <em>Standard</em> for automatic seeding or <em>Custom</em> to input your own seed order.</li>
          <li><strong>Step 3:</strong> If using custom seeding, enter the seed numbers separated by commas, ensuring all seeds from 1 to the number of teams are included exactly once.</li>
          <li><strong>Step 4:</strong> Click <em>Calculate</em> to generate the first-round matchups based on your inputs.</li>
          <li><strong>Step 5:</strong> Review the generated bracket matchups and use them to organize your tournament fixtures.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this tool focuses on bracket organization, understanding seeding strategy can enhance tournament fairness and competitiveness. Coaches and athletes should aim to improve their rankings or qualifying results to secure higher seeds, which generally provide an easier path in early rounds. Additionally, tournament organizers should consider transparent and objective seeding criteria to maintain participant trust and tournament integrity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For tournaments with non-power-of-two participants, consider preliminary qualification rounds or byes to balance the bracket. Proper scheduling and rest periods between matches are also essential to maintain athlete performance and reduce injury risk, as recommended by sports science authorities.
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
          For more information on tournament organization, seeding principles, and sports competition standards, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.ncaa.org/sports/2013/11/22/competition-and-seeding.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NCAA - Competition and Seeding Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines on tournament seeding and bracket formation used in collegiate sports.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/technical/football-technology/football-tournament-organisation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FIFA - Tournament Organization <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              FIFA's official documentation on organizing knockout stages and seeding in international football tournaments.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine (ACSM) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Leading authority on sports science, providing research on athlete performance and competition fairness.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tournament Bracket Seeding Helper"
      description="Organize tournament brackets. Seed players or teams correctly to ensure fair matchups in knockout rounds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Standard Seeding Formula",
        formula: "For 2^n teams, seeds are paired so that seed 1 plays seed N, seed 2 plays seed N-1, recursively.",
        variables: [
          { symbol: "N", description: "Total number of teams (power of two)" },
          { symbol: "Seed", description: "Ranking of a team or player" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An 8-team single-elimination basketball tournament needs to be seeded so that the highest-ranked teams do not meet until the later rounds.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the number of teams as 8 and select 'Standard Seeding' method.",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to generate the first-round matchups: Seed 1 vs Seed 8, Seed 4 vs Seed 5, Seed 3 vs Seed 6, and Seed 2 vs Seed 7.",
          },
          {
            label: "Step 3",
            explanation:
              "Use these matchups to schedule the tournament, ensuring balanced competition and fairness.",
          },
        ],
        result:
          "The bracket ensures top seeds are less likely to face each other early, increasing the quality and excitement of later rounds.",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
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