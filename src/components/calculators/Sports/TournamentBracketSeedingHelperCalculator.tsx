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
  // Generates seeding order for single-elimination bracket using standard "snake" seeding
  // Works for any power of two bracket size
  // Algorithm: recursively pair seeds to balance bracket fairness
  function helper(n) {
    if (n === 1) return [1];
    const prev = helper(n / 2);
    const result = [];
    for (let seed of prev) {
      result.push(seed);
      result.push(n + 1 - seed);
    }
    return result;
  }
  return helper(numTeams);
}

export default function TournamentBracketSeedingHelperCalculator() {
  const [inputs, setInputs] = useState({
    numTeams: "",
    seedingMethod: "standard",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const numTeams = parseInt(inputs.numTeams, 10);
    if (!numTeams || numTeams < 2) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter a valid number of teams (2 or more).",
        formulaUsed: null,
      };
    }
    // Check if numTeams is power of two
    const isPowerOfTwo = (numTeams & (numTeams - 1)) === 0;
    if (!isPowerOfTwo) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Number of teams must be a power of two (e.g., 4, 8, 16, 32).",
        formulaUsed: null,
      };
    }

    // Generate seed order based on method
    let seedOrder = [];
    if (inputs.seedingMethod === "standard") {
      seedOrder = generateSeedOrder(numTeams);
    } else {
      // Future expansion for other methods
      seedOrder = generateSeedOrder(numTeams);
    }

    // Format output as string with pairs
    const pairs = [];
    for (let i = 0; i < seedOrder.length; i += 2) {
      pairs.push(`Seed ${seedOrder[i]} vs Seed ${seedOrder[i + 1]}`);
    }

    return {
      value: `${numTeams}-Team Bracket`,
      label: "Matchups (First Round)",
      subtext: pairs.join(", "),
      warning: null,
      formulaUsed: "Recursive pairing: seed pairs sum to (N + 1) to balance matchups",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why must the number of teams be a power of two?",
      answer:
        "Tournament brackets are most balanced and fair when the number of teams is a power of two (e.g., 4, 8, 16, 32). This ensures every round halves the number of competitors without byes, maintaining competitive integrity and simplifying scheduling. If the number is not a power of two, byes or preliminary rounds are needed, complicating the bracket.",
    },
    {
      question: "How does seeding affect tournament fairness?",
      answer:
        "Seeding ranks teams based on skill or past performance to prevent top competitors from meeting early. Proper seeding ensures that the strongest teams face each other in later rounds, making the tournament more competitive and fair. This calculator uses a standard seeding method where seed pairs sum to (N + 1), balancing matchups across the bracket.",
    },
    {
      question: "Can I use this tool for double-elimination or round-robin tournaments?",
      answer:
        "This calculator is designed specifically for single-elimination tournament brackets. Double-elimination and round-robin formats have different structures and seeding requirements. For those formats, specialized calculators or software are recommended to handle their unique complexities.",
    },
    {
      question: "How can I handle tournaments with non-power-of-two teams?",
      answer:
        "For tournaments with non-power-of-two participants, organizers typically assign byes to top seeds or hold preliminary qualification rounds to reduce the field to a power of two. This calculator does not currently support bye assignments but can be used once the bracket size is adjusted accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="numTeams" className="mb-1 flex items-center gap-1">
          Number of Teams <Flag className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="numTeams"
          type="number"
          min={2}
          step={1}
          placeholder="Enter number of teams (e.g., 8, 16)"
          value={inputs.numTeams}
          onChange={(e) => handleInputChange("numTeams", e.target.value)}
          aria-describedby="numTeamsHelp"
        />
        <p id="numTeamsHelp" className="text-sm text-slate-500 mt-1">
          Must be a power of two for balanced brackets.
        </p>
      </div>

      <div>
        <Label htmlFor="seedingMethod" className="mb-1 flex items-center gap-1">
          Seeding Method <Scale className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.seedingMethod}
          onValueChange={(v) => handleInputChange("seedingMethod", v)}
          id="seedingMethod"
          aria-label="Select seeding method"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select seeding method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Snake Seeding</SelectItem>
            {/* Future methods can be added here */}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just triggers recalculation via state update
            setInputs((p) => ({ ...p }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate tournament bracket seeding"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numTeams: "", seedingMethod: "standard" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-4 whitespace-pre-wrap">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-6 text-xs italic text-slate-500 dark:text-slate-400">
                <Calculator className="inline w-4 h-4 mr-1" aria-hidden="true" />
                {results.formulaUsed}
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
          Understanding Tournament Bracket Seeding Helper
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tournament bracket seeding is a critical process in organizing knockout competitions, ensuring that teams or players are matched fairly based on their relative strengths or rankings. Proper seeding prevents top competitors from facing each other in early rounds, maintaining excitement and competitive balance throughout the event. This calculator helps organizers generate the optimal first-round matchups for single-elimination brackets.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The most common and fair method for seeding is to pair the highest seed with the lowest seed, the second highest with the second lowest, and so forth. This approach balances the bracket so that stronger teams are less likely to be eliminated early, preserving the quality of later rounds. The calculator uses a recursive algorithm to generate these seed pairings for any power-of-two number of teams.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that the number of teams must be a power of two (e.g., 4, 8, 16, 32) to create a perfectly balanced bracket without byes. If your tournament has a different number of participants, preliminary rounds or byes are necessary, which this tool does not currently support.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this seeding helper, tournament organizers can save time and reduce errors in bracket creation, ensuring a smooth and fair competition for all participants.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Tournament Bracket Seeding Helper is straightforward and designed for ease of use by tournament organizers of all experience levels. Begin by entering the total number of teams or players participating in your single-elimination tournament. Remember, this number must be a power of two to ensure a balanced bracket.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, select the seeding method. Currently, the calculator supports the standard snake seeding method, which pairs the highest seed with the lowest seed, the second highest with the second lowest, and so on. This method is widely accepted for its fairness and balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After inputting your data, click the "Calculate" button to generate the first-round matchups. The results will display the bracket size and a list of seed pairings for the initial round. If your input is invalid, such as a non-power-of-two number, the calculator will provide a clear warning message.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the inputs anytime by clicking the "Reset" button to start over or adjust your tournament parameters. This tool streamlines the seeding process, helping you organize your tournament efficiently and fairly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
          <li>Step 1: Enter the total number of teams (must be a power of two).</li>
          <li>Step 2: Select the seeding method (currently only standard snake seeding).</li>
          <li>Step 3: Click "Calculate" to generate first-round matchups.</li>
          <li>Step 4: Review the matchups and use them to organize your tournament bracket.</li>
          <li>Step 5: Use "Reset" to clear inputs and start a new calculation if needed.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Effective tournament preparation goes beyond just seeding; it involves strategic training and mental readiness. For seeded players or teams, understanding your potential path through the bracket can help tailor your training to focus on likely opponents and match scenarios.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Focus on maintaining peak physical condition and honing skills that exploit common weaknesses in opponents you expect to face based on seeding. Use video analysis and scouting reports to prepare for specific styles of play or tactics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Mental toughness is equally important. Practice visualization techniques and stress management to stay calm and focused during high-pressure matches. Remember, early rounds can set the tone for your tournament, so start strong and conserve energy for later rounds.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, communicate with your coaching staff and teammates to adapt strategies dynamically as the tournament progresses. Flexibility and resilience often distinguish champions from the rest.
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
              href="https://en.wikipedia.org/wiki/Single-elimination_tournament"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Single-elimination tournament <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of single-elimination tournament formats, seeding principles, and bracket structures.
            </p>
          </li>
          <li>
            <a
              href="https://www.usab.com/youth/development/seedings.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Basketball: Tournament Seeding Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines and best practices for seeding youth basketball tournaments, applicable to many sports.
            </p>
          </li>
          <li>
            <a
              href="https://www.sports-reference.com/blog/2017/03/how-to-seed-a-tournament/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How to Seed a Tournament - Sports Reference Blog <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical insights into seeding strategies and their impact on tournament fairness and excitement.
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
        title: "Seeding Formula",
        formula: "Seed pairs sum to (N + 1), where N is the number of teams",
        variables: [
          { symbol: "N", description: "Total number of teams (power of two)" },
          { symbol: "Seed_i", description: "Seed number i" },
          { symbol: "Seed_j", description: "Seed paired with Seed_i such that Seed_i + Seed_j = N + 1" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario: "Organizing an 8-team single-elimination tournament with standard seeding.",
        steps: [
          { label: "Step 1", explanation: "Enter 8 as the number of teams." },
          { label: "Step 2", explanation: "Select 'Standard Snake Seeding' as the seeding method." },
          { label: "Step 3", explanation: "Click 'Calculate' to generate matchups." },
          {
            label: "Step 4",
            explanation:
              "Review the first-round matchups: Seed 1 vs Seed 8, Seed 4 vs Seed 5, Seed 3 vs Seed 6, Seed 2 vs Seed 7, ensuring balanced competition.",
          },
        ],
        result: "The calculator outputs the balanced first-round matchups for the bracket.",
      }}
      relatedCalculators={[
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
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