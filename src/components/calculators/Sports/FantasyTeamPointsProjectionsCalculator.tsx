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
    name: "Football (NFL)",
    scoring: {
      passingYards: 0.04, // 1 point per 25 yards
      passingTD: 4,
      rushingYards: 0.1, // 1 point per 10 yards
      rushingTD: 6,
      receivingYards: 0.1,
      receivingTD: 6,
      receptions: 1, // PPR league
      interceptionsThrown: -2,
      fumblesLost: -2,
      fieldGoalMade: 3,
      extraPointMade: 1,
      defensiveSack: 1,
      defensiveInterception: 2,
      defensiveFumbleRecovery: 2,
      defensiveTD: 6,
      kickoffReturnTD: 6,
      puntReturnTD: 6,
    },
  },
  basketball: {
    name: "Basketball (NBA)",
    scoring: {
      points: 1,
      rebounds: 1.2,
      assists: 1.5,
      steals: 3,
      blocks: 3,
      turnovers: -1,
      threePointersMade: 0.5,
    },
  },
  soccer: {
    name: "Soccer (Fantasy)",
    scoring: {
      goals: 5,
      assists: 3,
      cleanSheet: 4,
      yellowCard: -1,
      redCard: -3,
      saves: 1,
      penaltySave: 5,
      penaltyMiss: -2,
    },
  },
};

function calculateFantasyPoints(inputs) {
  const { sport, players } = inputs;
  if (!sport || !players || players.length === 0) return null;

  const scoring = scoringSystems[sport]?.scoring;
  if (!scoring) return null;

  let totalPoints = 0;

  players.forEach((player) => {
    let playerPoints = 0;
    switch (sport) {
      case "football":
        playerPoints += (player.passingYards || 0) * scoring.passingYards;
        playerPoints += (player.passingTD || 0) * scoring.passingTD;
        playerPoints += (player.rushingYards || 0) * scoring.rushingYards;
        playerPoints += (player.rushingTD || 0) * scoring.rushingTD;
        playerPoints += (player.receivingYards || 0) * scoring.receivingYards;
        playerPoints += (player.receivingTD || 0) * scoring.receivingTD;
        playerPoints += (player.receptions || 0) * scoring.receptions;
        playerPoints += (player.interceptionsThrown || 0) * scoring.interceptionsThrown;
        playerPoints += (player.fumblesLost || 0) * scoring.fumblesLost;
        playerPoints += (player.fieldGoalMade || 0) * scoring.fieldGoalMade;
        playerPoints += (player.extraPointMade || 0) * scoring.extraPointMade;
        playerPoints += (player.defensiveSack || 0) * scoring.defensiveSack;
        playerPoints += (player.defensiveInterception || 0) * scoring.defensiveInterception;
        playerPoints += (player.defensiveFumbleRecovery || 0) * scoring.defensiveFumbleRecovery;
        playerPoints += (player.defensiveTD || 0) * scoring.defensiveTD;
        playerPoints += (player.kickoffReturnTD || 0) * scoring.kickoffReturnTD;
        playerPoints += (player.puntReturnTD || 0) * scoring.puntReturnTD;
        break;
      case "basketball":
        playerPoints += (player.points || 0) * scoring.points;
        playerPoints += (player.rebounds || 0) * scoring.rebounds;
        playerPoints += (player.assists || 0) * scoring.assists;
        playerPoints += (player.steals || 0) * scoring.steals;
        playerPoints += (player.blocks || 0) * scoring.blocks;
        playerPoints += (player.turnovers || 0) * scoring.turnovers;
        playerPoints += (player.threePointersMade || 0) * scoring.threePointersMade;
        break;
      case "soccer":
        playerPoints += (player.goals || 0) * scoring.goals;
        playerPoints += (player.assists || 0) * scoring.assists;
        playerPoints += (player.cleanSheet ? 1 : 0) * scoring.cleanSheet;
        playerPoints += (player.yellowCard || 0) * scoring.yellowCard;
        playerPoints += (player.redCard || 0) * scoring.redCard;
        playerPoints += (player.saves || 0) * scoring.saves;
        playerPoints += (player.penaltySave || 0) * scoring.penaltySave;
        playerPoints += (player.penaltyMiss || 0) * scoring.penaltyMiss;
        break;
      default:
        break;
    }
    totalPoints += playerPoints;
  });

  return totalPoints.toFixed(2);
}

export default function FantasyTeamPointsProjectionsCalculator() {
  const [inputs, setInputs] = useState({
    sport: "football",
    players: [
      {
        name: "",
        passingYards: 0,
        passingTD: 0,
        rushingYards: 0,
        rushingTD: 0,
        receivingYards: 0,
        receivingTD: 0,
        receptions: 0,
        interceptionsThrown: 0,
        fumblesLost: 0,
        fieldGoalMade: 0,
        extraPointMade: 0,
        defensiveSack: 0,
        defensiveInterception: 0,
        defensiveFumbleRecovery: 0,
        defensiveTD: 0,
        kickoffReturnTD: 0,
        puntReturnTD: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        threePointersMade: 0,
        goals: 0,
        cleanSheet: false,
        yellowCard: 0,
        redCard: 0,
        saves: 0,
        penaltySave: 0,
        penaltyMiss: 0,
      },
    ],
  });

  const handleSportChange = useCallback(
    (sport) => {
      // Reset players array to default for selected sport
      let defaultPlayer = {};
      switch (sport) {
        case "football":
          defaultPlayer = {
            name: "",
            passingYards: 0,
            passingTD: 0,
            rushingYards: 0,
            rushingTD: 0,
            receivingYards: 0,
            receivingTD: 0,
            receptions: 0,
            interceptionsThrown: 0,
            fumblesLost: 0,
            fieldGoalMade: 0,
            extraPointMade: 0,
            defensiveSack: 0,
            defensiveInterception: 0,
            defensiveFumbleRecovery: 0,
            defensiveTD: 0,
            kickoffReturnTD: 0,
            puntReturnTD: 0,
          };
          break;
        case "basketball":
          defaultPlayer = {
            name: "",
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            threePointersMade: 0,
          };
          break;
        case "soccer":
          defaultPlayer = {
            name: "",
            goals: 0,
            assists: 0,
            cleanSheet: false,
            yellowCard: 0,
            redCard: 0,
            saves: 0,
            penaltySave: 0,
            penaltyMiss: 0,
          };
          break;
        default:
          defaultPlayer = { name: "" };
      }
      setInputs({ sport, players: [defaultPlayer] });
    },
    [setInputs]
  );

  const handlePlayerChange = useCallback(
    (index, field, value) => {
      setInputs((prev) => {
        const newPlayers = [...prev.players];
        if (field === "cleanSheet") {
          newPlayers[index][field] = value === "true";
        } else if (field === "name") {
          newPlayers[index][field] = value;
        } else {
          newPlayers[index][field] = Number(value);
        }
        return { ...prev, players: newPlayers };
      });
    },
    [setInputs]
  );

  const addPlayer = useCallback(() => {
    setInputs((prev) => {
      const sport = prev.sport;
      let defaultPlayer = {};
      switch (sport) {
        case "football":
          defaultPlayer = {
            name: "",
            passingYards: 0,
            passingTD: 0,
            rushingYards: 0,
            rushingTD: 0,
            receivingYards: 0,
            receivingTD: 0,
            receptions: 0,
            interceptionsThrown: 0,
            fumblesLost: 0,
            fieldGoalMade: 0,
            extraPointMade: 0,
            defensiveSack: 0,
            defensiveInterception: 0,
            defensiveFumbleRecovery: 0,
            defensiveTD: 0,
            kickoffReturnTD: 0,
            puntReturnTD: 0,
          };
          break;
        case "basketball":
          defaultPlayer = {
            name: "",
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            threePointersMade: 0,
          };
          break;
        case "soccer":
          defaultPlayer = {
            name: "",
            goals: 0,
            assists: 0,
            cleanSheet: false,
            yellowCard: 0,
            redCard: 0,
            saves: 0,
            penaltySave: 0,
            penaltyMiss: 0,
          };
          break;
        default:
          defaultPlayer = { name: "" };
      }
      return { ...prev, players: [...prev.players, defaultPlayer] };
    });
  }, [setInputs]);

  const removePlayer = useCallback(
    (index) => {
      setInputs((prev) => {
        const newPlayers = prev.players.filter((_, i) => i !== index);
        return { ...prev, players: newPlayers.length ? newPlayers : prev.players };
      });
    },
    [setInputs]
  );

  const results = useMemo(() => {
    const points = calculateFantasyPoints(inputs);
    return {
      value: points ? `${points} Points` : null,
      label: "Projected Fantasy Points",
      subtext: inputs.sport ? `Based on ${scoringSystems[inputs.sport].name} scoring rules` : "",
      warning: null,
      formulaUsed: "Sum of (Player Stat × Scoring Multiplier) across all players",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate are the fantasy points projections?",
      answer:
        "The projections are based on standard scoring systems and player statistics you input. While they provide a solid estimate, actual fantasy points can vary due to in-game factors such as player performance, injuries, and coaching decisions. Always consider these projections as a guide rather than a guarantee.",
    },
    {
      question: "Can I customize scoring rules for my league?",
      answer:
        "Currently, this calculator supports standard scoring systems for football, basketball, and soccer. Custom scoring rules are not supported yet, but we plan to add this feature in future updates to better accommodate diverse league settings.",
    },
    {
      question: "How many players can I add to my fantasy team?",
      answer:
        "You can add as many players as you want to your team within this calculator. However, keep in mind that most fantasy leagues have roster limits. This tool is designed to help you project total points based on your selected players and their stats.",
    },
    {
      question: "Why do some stats have negative points?",
      answer:
        "Negative points are assigned to stats that typically harm your fantasy team's performance, such as turnovers, interceptions, or penalties. These deductions help balance the scoring and reflect the real impact of these events on your team's success.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sport" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Select Sport <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.sport}
          onValueChange={handleSportChange}
          aria-label="Select sport"
          id="sport"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sport" />
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

      <div>
        <Label className="mb-2 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Players & Stats <Activity className="w-4 h-4 text-green-600" />
        </Label>
        {inputs.players.map((player, i) => (
          <Card key={i} className="mb-4 border border-slate-300 dark:border-slate-700 shadow-sm">
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor={`player-name-${i}`} className="font-semibold text-slate-800 dark:text-slate-200">
                  Player #{i + 1} Name
                </Label>
                {inputs.players.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removePlayer(i)}
                    aria-label={`Remove player ${i + 1}`}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id={`player-name-${i}`}
                type="text"
                placeholder="Player name"
                value={player.name}
                onChange={(e) => handlePlayerChange(i, "name", e.target.value)}
                className="mb-3"
              />

              {/* Render inputs based on sport */}
              {inputs.sport === "football" && (
                <div className="grid grid-cols-2 gap-3">
                  <InputStat label="Passing Yards" id={`passingYards-${i}`} value={player.passingYards} onChange={(v) => handlePlayerChange(i, "passingYards", v)} />
                  <InputStat label="Passing TDs" id={`passingTD-${i}`} value={player.passingTD} onChange={(v) => handlePlayerChange(i, "passingTD", v)} />
                  <InputStat label="Rushing Yards" id={`rushingYards-${i}`} value={player.rushingYards} onChange={(v) => handlePlayerChange(i, "rushingYards", v)} />
                  <InputStat label="Rushing TDs" id={`rushingTD-${i}`} value={player.rushingTD} onChange={(v) => handlePlayerChange(i, "rushingTD", v)} />
                  <InputStat label="Receiving Yards" id={`receivingYards-${i}`} value={player.receivingYards} onChange={(v) => handlePlayerChange(i, "receivingYards", v)} />
                  <InputStat label="Receiving TDs" id={`receivingTD-${i}`} value={player.receivingTD} onChange={(v) => handlePlayerChange(i, "receivingTD", v)} />
                  <InputStat label="Receptions" id={`receptions-${i}`} value={player.receptions} onChange={(v) => handlePlayerChange(i, "receptions", v)} />
                  <InputStat label="Interceptions Thrown" id={`interceptionsThrown-${i}`} value={player.interceptionsThrown} onChange={(v) => handlePlayerChange(i, "interceptionsThrown", v)} />
                  <InputStat label="Fumbles Lost" id={`fumblesLost-${i}`} value={player.fumblesLost} onChange={(v) => handlePlayerChange(i, "fumblesLost", v)} />
                  <InputStat label="Field Goals Made" id={`fieldGoalMade-${i}`} value={player.fieldGoalMade} onChange={(v) => handlePlayerChange(i, "fieldGoalMade", v)} />
                  <InputStat label="Extra Points Made" id={`extraPointMade-${i}`} value={player.extraPointMade} onChange={(v) => handlePlayerChange(i, "extraPointMade", v)} />
                  <InputStat label="Defensive Sacks" id={`defensiveSack-${i}`} value={player.defensiveSack} onChange={(v) => handlePlayerChange(i, "defensiveSack", v)} />
                  <InputStat label="Defensive Interceptions" id={`defensiveInterception-${i}`} value={player.defensiveInterception} onChange={(v) => handlePlayerChange(i, "defensiveInterception", v)} />
                  <InputStat label="Defensive Fumble Recoveries" id={`defensiveFumbleRecovery-${i}`} value={player.defensiveFumbleRecovery} onChange={(v) => handlePlayerChange(i, "defensiveFumbleRecovery", v)} />
                  <InputStat label="Defensive TDs" id={`defensiveTD-${i}`} value={player.defensiveTD} onChange={(v) => handlePlayerChange(i, "defensiveTD", v)} />
                  <InputStat label="Kickoff Return TDs" id={`kickoffReturnTD-${i}`} value={player.kickoffReturnTD} onChange={(v) => handlePlayerChange(i, "kickoffReturnTD", v)} />
                  <InputStat label="Punt Return TDs" id={`puntReturnTD-${i}`} value={player.puntReturnTD} onChange={(v) => handlePlayerChange(i, "puntReturnTD", v)} />
                </div>
              )}
              {inputs.sport === "basketball" && (
                <div className="grid grid-cols-2 gap-3">
                  <InputStat label="Points" id={`points-${i}`} value={player.points} onChange={(v) => handlePlayerChange(i, "points", v)} />
                  <InputStat label="Rebounds" id={`rebounds-${i}`} value={player.rebounds} onChange={(v) => handlePlayerChange(i, "rebounds", v)} />
                  <InputStat label="Assists" id={`assists-${i}`} value={player.assists} onChange={(v) => handlePlayerChange(i, "assists", v)} />
                  <InputStat label="Steals" id={`steals-${i}`} value={player.steals} onChange={(v) => handlePlayerChange(i, "steals", v)} />
                  <InputStat label="Blocks" id={`blocks-${i}`} value={player.blocks} onChange={(v) => handlePlayerChange(i, "blocks", v)} />
                  <InputStat label="Turnovers" id={`turnovers-${i}`} value={player.turnovers} onChange={(v) => handlePlayerChange(i, "turnovers", v)} />
                  <InputStat label="3-Pointers Made" id={`threePointersMade-${i}`} value={player.threePointersMade} onChange={(v) => handlePlayerChange(i, "threePointersMade", v)} />
                </div>
              )}
              {inputs.sport === "soccer" && (
                <div className="grid grid-cols-2 gap-3">
                  <InputStat label="Goals" id={`goals-${i}`} value={player.goals} onChange={(v) => handlePlayerChange(i, "goals", v)} />
                  <InputStat label="Assists" id={`assists-${i}`} value={player.assists} onChange={(v) => handlePlayerChange(i, "assists", v)} />
                  <div className="flex flex-col">
                    <Label htmlFor={`cleanSheet-${i}`} className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Clean Sheet <Flag className="w-4 h-4 text-green-600" />
                    </Label>
                    <Select
                      id={`cleanSheet-${i}`}
                      value={player.cleanSheet ? "true" : "false"}
                      onValueChange={(v) => handlePlayerChange(i, "cleanSheet", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <InputStat label="Yellow Cards" id={`yellowCard-${i}`} value={player.yellowCard} onChange={(v) => handlePlayerChange(i, "yellowCard", v)} />
                  <InputStat label="Red Cards" id={`redCard-${i}`} value={player.redCard} onChange={(v) => handlePlayerChange(i, "redCard", v)} />
                  <InputStat label="Saves" id={`saves-${i}`} value={player.saves} onChange={(v) => handlePlayerChange(i, "saves", v)} />
                  <InputStat label="Penalty Saves" id={`penaltySave-${i}`} value={player.penaltySave} onChange={(v) => handlePlayerChange(i, "penaltySave", v)} />
                  <InputStat label="Penalty Misses" id={`penaltyMiss-${i}`} value={player.penaltyMiss} onChange={(v) => handlePlayerChange(i, "penaltyMiss", v)} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Button onClick={addPlayer} variant="outline" className="w-full" aria-label="Add player">
          Add Player
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate fantasy points"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleSportChange(inputs.sport);
          }}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg text-blue-800 dark:text-blue-300 mt-2">{results.subtext}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">{results.formulaUsed}</p>
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
          The Fantasy Team Points Projections Calculator is a powerful tool designed to help fantasy sports enthusiasts estimate the total points their team is likely to score based on individual player statistics. By inputting projected or actual player performance metrics, users can gain insights into how their fantasy team might perform in upcoming matches or over a season.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator supports multiple sports including football (NFL), basketball (NBA), and soccer, each with their own unique scoring systems. The scoring multipliers are based on widely accepted fantasy league standards, ensuring that projections are realistic and relevant to most competitive leagues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By aggregating the points from all players on your roster, the tool provides a comprehensive projection of your team’s potential output. This helps in making informed decisions about player selection, trades, and weekly lineups, ultimately enhancing your chances of success in fantasy leagues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a casual player or a seasoned fantasy manager, understanding how each player’s stats contribute to your overall score is crucial. This calculator demystifies the scoring process and empowers you with data-driven insights.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get started, select the sport for which you want to project fantasy points. The calculator currently supports football, basketball, and soccer, each with tailored input fields reflecting the relevant statistics for that sport.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, add players to your fantasy team by clicking the "Add Player" button. For each player, enter their projected or actual statistics in the provided fields. These stats include passing yards, touchdowns, assists, goals, and more, depending on the sport selected.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once all player stats are entered, click the "Calculate" button to see the total projected fantasy points for your team. You can add or remove players at any time to adjust your projections and experiment with different lineups or scenarios.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your sport from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Add players and input their relevant stats.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to view your team’s projected points.
          </li>
          <li>
            <strong>Step 4:</strong> Use the projections to optimize your fantasy lineup and strategy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your fantasy team’s potential, focus on understanding the scoring system of your league and how different player stats translate into points. Prioritize players who consistently produce high-value stats such as touchdowns, assists, or clean sheets.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use this calculator regularly to simulate different lineup combinations and identify which players provide the best return on investment. Pay attention to matchups, player form, and injury reports to adjust your projections accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate advanced metrics and trends into your analysis, such as yards after catch in football or usage rate in basketball, to gain an edge over competitors. Remember that consistency often trumps occasional big performances in fantasy scoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, stay flexible and be ready to adapt your strategy as the season progresses. Use the projections to identify undervalued players and potential breakout stars before your opponents do.
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
            <a href="https://www.espn.com/fantasy/football/story/_/id/25569022/fantasy-football-scoring-explained" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              ESPN Fantasy Football Scoring Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide to standard fantasy football scoring rules and how points are calculated.
            </p>
          </li>
          <li>
            <a href="https://www.rotowire.com/basketball/fantasy-basketball-scoring.php" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              RotoWire Fantasy Basketball Scoring <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanation of fantasy basketball scoring categories and multipliers used in popular leagues.
            </p>
          </li>
          <li>
            <a href="https://fantasy.premierleague.com/help/scoring" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Fantasy Premier League Scoring Rules <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official scoring system for the Fantasy Premier League, including points for goals, assists, clean sheets, and cards.
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
        title: "Formula",
        formula: "Fantasy Points = Σ (Player Stat × Scoring Multiplier)",
        variables: [
          { symbol: "Player Stat", description: "Individual player statistics such as yards, points, goals, etc." },
          { symbol: "Scoring Multiplier", description: "Points assigned per unit of each statistic based on league rules." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a football fantasy team with two players: a quarterback with 250 passing yards and 2 passing touchdowns, and a running back with 80 rushing yards and 1 rushing touchdown. You want to estimate your team's total fantasy points.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the quarterback's stats: 250 passing yards and 2 passing touchdowns.",
          },
          {
            label: "Step 2",
            explanation:
              "Input the running back's stats: 80 rushing yards and 1 rushing touchdown.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to sum the points: (250 × 0.04) + (2 × 4) + (80 × 0.1) + (1 × 6) = 10 + 8 + 8 + 6 = 32 points.",
          },
        ],
        result: "Projected Fantasy Points: 32",
      }}
      relatedCalculators={[
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🏆" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
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

function InputStat({ label, id, value, onChange }) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min={0}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        aria-label={label}
      />
    </div>
  );
}