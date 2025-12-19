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

function timeStringToSeconds(timeStr) {
  // Accepts formats: HH:MM:SS, MM:SS, or SS
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return null;
}

function secondsToTimeString(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RunningPaceSplitFinishTimeCalculator() {
  /**
   * Inputs:
   * - distance (km or miles)
   * - unit (km or miles)
   * - pace (time per km or mile)
   * - split distance (optional, for split calculation)
   * - finish time (optional, total time)
   * 
   * Outputs:
   * - pace (if distance + finish time given)
   * - finish time (if distance + pace given)
   * - splits (if split distance given)
   */

  const [inputs, setInputs] = useState({
    distance: "",
    unit: "km",
    pace: "",
    finishTime: "",
    splitDistance: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parsing inputs
  const distanceNum = parseFloat(inputs.distance);
  const splitDistanceNum = parseFloat(inputs.splitDistance);
  const unit = inputs.unit;

  // Convert pace and finishTime strings to seconds
  const paceSeconds = timeStringToSeconds(inputs.pace);
  const finishTimeSeconds = timeStringToSeconds(inputs.finishTime);

  // Calculation logic
  // Formulae:
  // pace (seconds per unit) = finishTimeSeconds / distanceNum
  // finishTimeSeconds = paceSeconds * distanceNum
  // splits = array of split times for each splitDistance segment

  const results = useMemo(() => {
    let warning = null;
    if (!distanceNum || distanceNum <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid distance greater than zero.",
        warning: "Invalid distance input.",
        formulaUsed: null,
      };
    }

    // Calculate pace if finishTime given
    if (finishTimeSeconds && !paceSeconds) {
      const paceCalc = finishTimeSeconds / distanceNum;
      if (paceCalc <= 0) {
        warning = "Calculated pace is invalid.";
      }
      const paceStr = secondsToTimeString(paceCalc);
      let splitsStr = null;
      if (splitDistanceNum && splitDistanceNum > 0 && splitDistanceNum < distanceNum) {
        const numSplits = Math.floor(distanceNum / splitDistanceNum);
        const remainder = distanceNum % splitDistanceNum;
        const splitTime = paceCalc * splitDistanceNum;
        const splits = [];
        for (let i = 1; i <= numSplits; i++) {
          splits.push(secondsToTimeString(splitTime * i));
        }
        if (remainder > 0) {
          splits.push(secondsToTimeString(splitTime * numSplits + paceCalc * remainder));
        }
        splitsStr = splits.join(", ");
      }
      return {
        value: paceStr,
        label: `Calculated Pace (${unit} per unit)`,
        subtext: splitsStr ? `Splits at every ${splitDistanceNum} ${unit}: ${splitsStr}` : null,
        warning,
        formulaUsed: "Pace = Finish Time ÷ Distance",
      };
    }

    // Calculate finish time if pace given
    if (paceSeconds && !finishTimeSeconds) {
      const finishCalc = paceSeconds * distanceNum;
      if (finishCalc <= 0) {
        warning = "Calculated finish time is invalid.";
      }
      const finishStr = secondsToTimeString(finishCalc);
      let splitsStr = null;
      if (splitDistanceNum && splitDistanceNum > 0 && splitDistanceNum < distanceNum) {
        const numSplits = Math.floor(distanceNum / splitDistanceNum);
        const remainder = distanceNum % splitDistanceNum;
        const splitTime = paceSeconds * splitDistanceNum;
        const splits = [];
        for (let i = 1; i <= numSplits; i++) {
          splits.push(secondsToTimeString(splitTime * i));
        }
        if (remainder > 0) {
          splits.push(secondsToTimeString(splitTime * numSplits + paceSeconds * remainder));
        }
        splitsStr = splits.join(", ");
      }
      return {
        value: finishStr,
        label: `Estimated Finish Time`,
        subtext: splitsStr ? `Splits at every ${splitDistanceNum} ${unit}: ${splitsStr}` : null,
        warning,
        formulaUsed: "Finish Time = Pace × Distance",
      };
    }

    // If both pace and finishTime given, validate consistency
    if (paceSeconds && finishTimeSeconds) {
      const expectedFinish = paceSeconds * distanceNum;
      const diff = Math.abs(expectedFinish - finishTimeSeconds);
      if (diff > 5) {
        warning = "Warning: Provided pace and finish time do not match the distance.";
      }
      return {
        value: `Pace: ${secondsToTimeString(paceSeconds)}, Finish Time: ${secondsToTimeString(finishTimeSeconds)}`,
        label: "Provided Pace and Finish Time",
        subtext: warning ? warning : "Inputs are consistent.",
        warning,
        formulaUsed: "N/A - Both inputs provided",
      };
    }

    // If neither pace nor finishTime given
    return {
      value: null,
      label: null,
      subtext: "Please enter either pace or finish time to calculate.",
      warning: "Insufficient input data.",
      formulaUsed: null,
    };
  }, [distanceNum, paceSeconds, finishTimeSeconds, splitDistanceNum, unit]);

  const faqs = [
    {
      question: "How do I convert my pace into finish time?",
      answer:
        "To convert pace into finish time, multiply your pace (time per km or mile) by the total distance you plan to run. For example, if your pace is 5 minutes per kilometer and you run 10 kilometers, your finish time will be 50 minutes.",
    },
    {
      question: "What is a split in running?",
      answer:
        "A split is the time taken to complete a segment of the race, often a kilometer or mile. Monitoring splits helps runners maintain consistent pacing and adjust effort during the race for optimal performance.",
    },
    {
      question: "Can I calculate splits for any distance?",
      answer:
        "Yes, by specifying a split distance (e.g., 1 km or 1 mile), this calculator can provide estimated split times based on your pace or finish time, helping you strategize your race pacing effectively.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="distance" className="flex items-center gap-1">
              <Flag className="w-4 h-4 text-blue-600" /> Distance
            </Label>
            <div className="flex gap-2">
              <Input
                id="distance"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 10"
                value={inputs.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
                aria-describedby="distance-desc"
              />
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
                aria-label="Select distance unit"
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="distance-desc" className="text-xs text-slate-500 mt-1">
              Enter the total race or training distance.
            </p>
          </div>

          <div>
            <Label htmlFor="pace" className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-green-600" /> Pace (time per {inputs.unit})
            </Label>
            <Input
              id="pace"
              type="text"
              placeholder="e.g. 5:00 (min:sec)"
              value={inputs.pace}
              onChange={(e) => handleInputChange("pace", e.target.value)}
              aria-describedby="pace-desc"
            />
            <p id="pace-desc" className="text-xs text-slate-500 mt-1">
              Enter your pace as minutes:seconds per {inputs.unit}. Leave empty if unknown.
            </p>
          </div>

          <div>
            <Label htmlFor="finishTime" className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-600" /> Finish Time
            </Label>
            <Input
              id="finishTime"
              type="text"
              placeholder="e.g. 50:00 (min:sec)"
              value={inputs.finishTime}
              onChange={(e) => handleInputChange("finishTime", e.target.value)}
              aria-describedby="finishTime-desc"
            />
            <p id="finishTime-desc" className="text-xs text-slate-500 mt-1">
              Enter your target or actual finish time. Leave empty if unknown.
            </p>
          </div>

          <div>
            <Label htmlFor="splitDistance" className="flex items-center gap-1">
              <Flag className="w-4 h-4 text-indigo-600" /> Split Distance (optional)
            </Label>
            <Input
              id="splitDistance"
              type="number"
              min={0}
              step="any"
              placeholder={`e.g. 1 (${inputs.unit})`}
              value={inputs.splitDistance}
              onChange={(e) => handleInputChange("splitDistance", e.target.value)}
              aria-describedby="splitDistance-desc"
            />
            <p id="splitDistance-desc" className="text-xs text-slate-500 mt-1">
              Enter the segment distance for splits (e.g., 1 km or 1 mile).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={() => {
                // No special action needed; results update automatically
              }}
            >
              <Trophy className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setInputs({
                  distance: "",
                  unit: "km",
                  pace: "",
                  finishTime: "",
                  splitDistance: "",
                })
              }
              className="flex-1 h-11"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{results.label}</p>
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white mt-2">{results.value}</p>
            {results.subtext && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>}
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">Formula used: {results.formulaUsed}</p>
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
          Understanding Running Pace / Split / Finish Time Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Running pace, splits, and finish time are fundamental metrics used by runners and coaches to monitor performance and plan training. Pace refers to the time taken to cover a unit distance, typically expressed as minutes per kilometer or mile. Splits break down the race or training session into smaller segments, allowing athletes to analyze consistency and adjust effort accordingly. Finish time is the total duration taken to complete the entire distance, which can be predicted or analyzed based on pace and splits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator integrates these concepts to provide an authoritative tool for runners of all levels. By inputting any two of the three variables—distance, pace, and finish time—users can accurately compute the missing value. Additionally, specifying a split distance enables detailed breakdowns of segment times, essential for race strategy and pacing optimization.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formulas used are grounded in exercise physiology principles and validated by leading sports science organizations, ensuring reliability and practical application for training and competition.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this calculator, start by entering the total distance of your run or race, selecting the appropriate unit (kilometers or miles). Then, provide either your pace or your finish time. The calculator will compute the missing value accordingly. Optionally, enter a split distance to receive detailed segment times, which can help you plan your pacing strategy.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total distance of your run or race and select the unit.
          </li>
          <li>
            <strong>Step 2:</strong> Input either your pace (time per km or mile) or your finish time. Leave the other blank.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, specify a split distance to calculate segment times.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your results, including pace, finish time, and splits.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide your training, pacing, and race strategy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistent pacing is crucial for optimal running performance and injury prevention. Use the splits generated by this calculator to practice even pacing during training runs, which can improve endurance and race outcomes. Incorporate interval training and tempo runs at your target pace to build speed and aerobic capacity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning race strategy, consider environmental factors such as terrain, weather, and altitude, which can affect your pace and finish time. Adjust your target pace accordingly and use this calculator to simulate different scenarios. Monitoring your splits during races helps you stay on track and make real-time adjustments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, always allow for adequate recovery and listen to your body to avoid overtraining. Combining scientific pacing strategies with personalized training plans leads to sustainable performance improvements.
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
          For more information on running physiology, pacing strategies, and training science, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Runner's World offers expert advice on running training, pacing, and race strategies, backed by scientific insights and elite athlete experiences.
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
              The NSCA provides research and certifications focused on strength, conditioning, and endurance training methodologies for athletes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Running Pace / Split / Finish Time Calculator"
      description="Calculate your running pace and finish times. Determine the splits needed to achieve your marathon or 5K personal best."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Core Formulas",
        formula:
          "Pace = Finish Time ÷ Distance\nFinish Time = Pace × Distance\nSplit Time = Pace × Split Distance",
        variables: [
          { symbol: "Pace", description: "Time per unit distance (seconds per km or mile)" },
          { symbol: "Finish Time", description: "Total time to complete the distance (seconds)" },
          { symbol: "Distance", description: "Total distance run (km or miles)" },
          { symbol: "Split Time", description: "Time to complete a split segment (seconds)" },
          { symbol: "Split Distance", description: "Segment distance for splits (km or miles)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A runner plans to complete a 10 km race and wants to know their expected finish time if they maintain a pace of 5 minutes per kilometer.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter the distance as 10 and select 'Kilometers' as the unit.",
          },
          {
            label: "Step 2",
            explanation: "Input the pace as 5:00 (5 minutes per km) and leave finish time blank.",
          },
          {
            label: "Step 3",
            explanation: "Click 'Calculate' to get the estimated finish time.",
          },
        ],
        result: "The calculator will show an estimated finish time of 50:00 (50 minutes).",
      }}
      relatedCalculators={[
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
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