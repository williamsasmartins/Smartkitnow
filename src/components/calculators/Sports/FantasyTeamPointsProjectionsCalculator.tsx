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

const scoringSystems = {
  football: {
    name: "Fantasy Football",
    description: "Standard scoring system for fantasy football leagues, including points for touchdowns, yards, receptions, and turnovers.",
    variables: [
      { name: "passingYards", label: "Passing Yards", icon: Activity },
      { name: "passingTDs", label: "Passing Touchdowns", icon: Trophy },
      { name: "interceptions", label: "Interceptions Thrown", icon: AlertTriangle },
      { name: "rushingYards", label: "Rushing Yards", icon: Flame },
      { name: "rushingTDs", label: "Rushing Touchdowns", icon: Medal },
      { name: "receptions", label: "Receptions", icon: Dumbbell },
      { name: "receivingYards", label: "Receiving Yards", icon: Zap },
      { name: "receivingTDs", label: "Receiving Touchdowns", icon: Heart },
      { name: "fumblesLost", label: "Fumbles Lost", icon: RotateCcw },
    ],
    formula: (inputs) => {
      // Standard PPR (Points Per Reception) scoring example
      // Passing: 1 point per 25 yards, 4 points per passing TD, -2 per interception
      // Rushing: 1 point per 10 yards, 6 points per rushing TD
      // Receiving: 1 point per reception, 1 point per 10 yards, 6 points per receiving TD
      // Fumbles lost: -2 points each
      const {
        passingYards = 0,
        passingTDs = 0,
        interceptions = 0,
        rushingYards = 0,
        rushingTDs = 0,
        receptions = 0,
        receivingYards = 0,
        receivingTDs = 0,
        fumblesLost = 0,
      } = inputs;

      const points =
        passingYards / 25 +
        passingTDs * 4 -
        interceptions * 2 +
        rushingYards / 10 +
        rushingTDs * 6 +
        receptions * 1 +
        receivingYards / 10 +
        receivingTDs * 6 -
        fumblesLost * 2;

      return Math.max(points, 0).toFixed(2);
    },
  },
  basketball: {
    name: "Fantasy Basketball",
    description: "Typical fantasy basketball scoring including points, rebounds, assists, steals, blocks, turnovers.",
    variables: [
      { name: "points", label: "Points Scored", icon: Flame },
      { name: "rebounds", label: "Rebounds", icon: Medal },
      { name: "assists", label: "Assists", icon: Zap },
      { name: "steals", label: "Steals", icon: Heart },
      { name: "blocks", label: "Blocks", icon: ShieldIcon },
      { name: "turnovers", label: "Turnovers", icon: RotateCcw },
    ],
    formula: (inputs) => {
      // Typical fantasy basketball scoring:
      // Points: 1 pt each
      // Rebounds: 1.2 pts each
      // Assists: 1.5 pts each
      // Steals: 3 pts each
      // Blocks: 3 pts each
      // Turnovers: -1 pt each
      const {
        points = 0,
        rebounds = 0,
        assists = 0,
        steals = 0,
        blocks = 0,
        turnovers = 0,
      } = inputs;

      const totalPoints =
        points * 1 +
        rebounds * 1.2 +
        assists * 1.5 +
        steals * 3 +
        blocks * 3 -
        turnovers * 1;

      return Math.max(totalPoints, 0).toFixed(2);
    },
  },
  soccer: {
    name: "Fantasy Soccer",
    description: "Fantasy soccer scoring including goals, assists, clean sheets, yellow/red cards.",
    variables: [
      { name: "goals", label: "Goals Scored", icon: Trophy },
      { name: "assists", label: "Assists", icon: Zap },
      { name: "cleanSheets", label: "Clean Sheets", icon: ShieldIcon },
      { name: "yellowCards", label: "Yellow Cards", icon: AlertTriangle },
      { name: "redCards", label: "Red Cards", icon: AlertTriangle },
      { name: "minutesPlayed", label: "Minutes Played", icon: Timer },
    ],
    formula: (inputs) => {
      // Example scoring:
      // Goals: 5 points each
      // Assists: 3 points each
      // Clean Sheets (defenders/goalkeepers): 4 points each
      // Yellow Card: -1 point
      // Red Card: -3 points
      // Minutes Played: 1 point if played 60+ minutes
      const {
        goals = 0,
        assists = 0,
        cleanSheets = 0,
        yellowCards = 0,
        redCards = 0,
        minutesPlayed = 0,
      } = inputs;

      const minutesPoints = minutesPlayed >= 60 ? 1 : 0;

      const points =
        goals * 5 +
        assists * 3 +
        cleanSheets * 4 -
        yellowCards * 1 -
        redCards * 3 +
        minutesPoints;

      return Math.max(points, 0).toFixed(2);
    },
  },
};

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  // Simple shield icon fallback for soccer clean sheets
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 2L3 7v5c0 5 3.5 9 9 10 5.5-1 9-5 9-10V7l-9-5z" />
    </svg>
  );
}

export default function FantasyTeamPointsProjectionsCalculator() {
  const [inputs, setInputs] = useState({});
  const [selectedSport, setSelectedSport] = useState("football");

  const handleInputChange = useCallback((name, value) => {
    // Ensure numeric inputs are parsed as numbers or zero
    const parsedValue = value === "" ? "" : Number(value);
    if (isNaN(parsedValue) && value !== "") return; // Ignore invalid input
    setInputs((prev) => ({ ...prev, [name]: parsedValue }));
  }, []);

  const currentScoring = scoringSystems[selectedSport];

  const results = useMemo(() => {
    if (!currentScoring) return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };
    const value = currentScoring.formula(inputs);
    return {
      value,
      label: `${currentScoring.name} Projected Points`,
      subtext: `Based on your input stats and the ${currentScoring.name} scoring system.`,
      warning: null,
      formulaUsed: "See scoring breakdown in editorial content.",
    };
  }, [inputs, currentScoring]);

  const faqs = [
    {
      question: "How accurate are fantasy points projections?",
      answer:
        "Fantasy points projections are estimates based on historical player performance and scoring rules. Actual points can vary due to game conditions, player health, and coaching decisions. Using up-to-date stats and realistic assumptions improves projection accuracy.",
    },
    {
      question: "Can I customize scoring rules in this calculator?",
      answer:
        "Currently, this calculator supports standard scoring systems for football, basketball, and soccer. Custom scoring rules are not supported but may be added in future updates to accommodate league-specific variations.",
    },
    {
      question: "Why do some stats have negative points?",
      answer:
        "Negative points are assigned to stats like turnovers, interceptions, or cards to penalize actions that harm team performance. This balances the scoring system and encourages strategic player selection.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sport" className="mb-1 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
          <Calculator className="w-5 h-5" /> Select Sport / Scoring System
        </Label>
        <Select
          value={selectedSport}
          onValueChange={(v) => {
            setSelectedSport(v);
            setInputs({});
          }}
        >
          <SelectTrigger aria-label="Select sport scoring system">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(scoringSystems).map(([key, val]) => (
              <SelectItem key={key} value={key}>
                {val.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-white">{currentScoring.name} Inputs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentScoring.variables.map(({ name, label, icon: Icon }) => (
            <div key={name} className="flex flex-col">
              <Label htmlFor={name} className="mb-1 flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {label}
              </Label>
              <Input
                id={name}
                type="number"
                min={0}
                step="any"
                value={inputs[name] ?? ""}
                onChange={(e) => handleInputChange(name, e.target.value)}
                placeholder="0"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, results update automatically
          }}
          aria-label="Calculate fantasy points"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fantasy Team Points Projections Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fantasy sports have revolutionized how fans engage with their favorite games by allowing them to create virtual teams composed of real players. This calculator provides an authoritative method to project fantasy points based on player statistics and established scoring systems for football, basketball, and soccer. By inputting player performance metrics, users can estimate their fantasy team's potential score, aiding in strategic decisions such as drafting, trading, or setting lineups. The projections rely on standardized scoring formulas widely adopted in competitive fantasy leagues, ensuring relevance and accuracy.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Begin by selecting the sport corresponding to your fantasy league to load the appropriate scoring system and input fields. Enter the relevant player statistics such as yards, touchdowns, assists, or goals, depending on the sport. Once all inputs are entered, click the "Calculate" button to generate the projected fantasy points for your team. Use the "Reset" button to clear all inputs and start a new calculation. This tool is designed to be intuitive and flexible for both casual and competitive fantasy players.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Select your sport from the dropdown menu to load the correct scoring system.</li>
          <li>Step 2: Input your players' projected or actual statistics into the provided fields.</li>
          <li>Step 3: Click "Calculate" to see your team's projected fantasy points based on entered stats.</li>
          <li>Step 4: Use the results to inform your lineup decisions or trade evaluations.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your fantasy team's success, focus on players with consistent performance and high usage rates, as variability can drastically affect point totals. Monitor injury reports and player matchups weekly to adjust your roster accordingly. Incorporate advanced metrics such as player efficiency ratings or opponent defensive rankings to refine projections beyond raw statistics. Regularly updating your inputs with the latest data ensures your projections remain accurate and actionable throughout the season.
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
          For more information on sports science, fantasy scoring, and performance metrics, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and training.
            </p>
          </li>
          <li>
            <a
              href="https://www.nfhs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Federation of State High School Associations (NFHS) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NFHS provides official rules and standards for high school sports, including scoring systems and player statistics tracking.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Fédération Internationale de Football Association (FIFA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              FIFA is the international governing body of soccer, providing official rules, player statistics, and performance metrics used in fantasy soccer leagues worldwide.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fantasy Team Points Projections Calculator"
      description="Project fantasy sports points. Estimate team scores based on player stats for football, basketball, or soccer leagues."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scoring Formulas Overview",
        formula:
          "Football: Points = (Passing Yards / 25) + (Passing TDs * 4) - (Interceptions * 2) + (Rushing Yards / 10) + (Rushing TDs * 6) + (Receptions * 1) + (Receiving Yards / 10) + (Receiving TDs * 6) - (Fumbles Lost * 2)\n" +
          "Basketball: Points = (Points Scored * 1) + (Rebounds * 1.2) + (Assists * 1.5) + (Steals * 3) + (Blocks * 3) - (Turnovers * 1)\n" +
          "Soccer: Points = (Goals * 5) + (Assists * 3) + (Clean Sheets * 4) - (Yellow Cards * 1) - (Red Cards * 3) + (Minutes Played >= 60 ? 1 : 0)",
        variables: [
          { name: "passingYards", description: "Total passing yards by player" },
          { name: "passingTDs", description: "Passing touchdowns thrown" },
          { name: "interceptions", description: "Interceptions thrown" },
          { name: "rushingYards", description: "Rushing yards gained" },
          { name: "rushingTDs", description: "Rushing touchdowns scored" },
          { name: "receptions", description: "Number of receptions caught" },
          { name: "receivingYards", description: "Receiving yards gained" },
          { name: "receivingTDs", description: "Receiving touchdowns scored" },
          { name: "fumblesLost", description: "Fumbles lost to opposing team" },
          { name: "points", description: "Points scored by basketball player" },
          { name: "rebounds", description: "Total rebounds grabbed" },
          { name: "assists", description: "Total assists made" },
          { name: "steals", description: "Total steals made" },
          { name: "blocks", description: "Total blocks made" },
          { name: "turnovers", description: "Total turnovers committed" },
          { name: "goals", description: "Goals scored in soccer" },
          { name: "assists", description: "Assists made in soccer" },
          { name: "cleanSheets", description: "Number of clean sheets kept" },
          { name: "yellowCards", description: "Yellow cards received" },
          { name: "redCards", description: "Red cards received" },
          { name: "minutesPlayed", description: "Minutes played in match" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Projecting fantasy football points for a quarterback who throws for 300 yards, 2 passing touchdowns, 1 interception, rushes for 40 yards and 1 rushing touchdown, with 3 receptions for 25 yards and no fumbles lost.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the player's passing yards (300), passing touchdowns (2), interceptions (1), rushing yards (40), rushing touchdowns (1), receptions (3), receiving yards (25), receiving touchdowns (0), and fumbles lost (0).",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to compute the projected fantasy points using the football scoring formula.",
          },
          {
            label: "Step 3",
            explanation:
              "Review the projected points (e.g., 300/25 + 2*4 - 1*2 + 40/10 + 1*6 + 3*1 + 25/10 + 0*6 - 0*2 = 12 + 8 - 2 + 4 + 6 + 3 + 2.5 + 0 - 0 = 33.5 points).",
          },
        ],
        result: "The projected fantasy points for this player is 33.5 points.",
      }}
      relatedCalculators={[
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
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