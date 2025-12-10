import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen, DollarSign, TrendingUp } from "lucide-react";

function secondsToHMS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    h > 0 ? h.toString().padStart(2, "0") : null,
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
}

function hmsToSeconds(hms: string) {
  const parts = hms.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return NaN;
}

function formatPace(secondsPerKm: number) {
  if (secondsPerKm <= 0 || isNaN(secondsPerKm)) return "--:--";
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parsePace(input: string) {
  // Accept formats like "5:00", "5:00/km", "5:00 min/km"
  const pace = input.trim().toLowerCase().replace(/min\/?km/, "").replace(/\/?km/, "").trim();
  return hmsToSeconds(pace);
}

function parseTime(input: string) {
  // Accept formats like "1:30:00", "90:00", "90"
  return hmsToSeconds(input.trim());
}

export default function RunningPaceSplitFinishTimeCalculator() {
  const [distance, setDistance] = useState<string>("10");
  const [distanceUnit, setDistanceUnit] = useState<"km" | "mi">("km");
  const [pace, setPace] = useState<string>("5:00");
  const [splitDistance, setSplitDistance] = useState<string>("1");
  const [splitDistanceUnit, setSplitDistanceUnit] = useState<"km" | "mi">("km");
  const [finishTime, setFinishTime] = useState<string>("");
  const [mode, setMode] = useState<"pace" | "finishTime">("pace");
  const [error, setError] = useState<string>("");

  const distanceNum = useMemo(() => parseFloat(distance), [distance]);
  const splitDistanceNum = useMemo(() => parseFloat(splitDistance), [splitDistance]);

  const paceSeconds = useMemo(() => {
    if (mode !== "pace") return NaN;
    return parsePace(pace);
  }, [pace, mode]);

  const finishTimeSeconds = useMemo(() => {
    if (mode !== "finishTime") return NaN;
    return parseTime(finishTime);
  }, [finishTime, mode]);

  const totalDistanceMeters = useMemo(() => {
    if (distanceNum <= 0 || isNaN(distanceNum)) return NaN;
    if (distanceUnit === "km") return distanceNum * 1000;
    return distanceNum * 1609.344;
  }, [distanceNum, distanceUnit]);

  const splitDistanceMeters = useMemo(() => {
    if (splitDistanceNum <= 0 || isNaN(splitDistanceNum)) return NaN;
    if (splitDistanceUnit === "km") return splitDistanceNum * 1000;
    return splitDistanceNum * 1609.344;
  }, [splitDistanceNum, splitDistanceUnit]);

  const calculatedFinishTimeSeconds = useMemo(() => {
    if (mode !== "pace") return NaN;
    if (isNaN(paceSeconds) || isNaN(totalDistanceMeters)) return NaN;
    if (paceSeconds <= 0 || totalDistanceMeters <= 0) return NaN;
    // paceSeconds is seconds per km, convert totalDistanceMeters to km
    const totalKm = totalDistanceMeters / 1000;
    return paceSeconds * totalKm;
  }, [mode, paceSeconds, totalDistanceMeters]);

  const calculatedPaceSeconds = useMemo(() => {
    if (mode !== "finishTime") return NaN;
    if (isNaN(finishTimeSeconds) || isNaN(totalDistanceMeters)) return NaN;
    if (finishTimeSeconds <= 0 || totalDistanceMeters <= 0) return NaN;
    const totalKm = totalDistanceMeters / 1000;
    return finishTimeSeconds / totalKm;
  }, [mode, finishTimeSeconds, totalDistanceMeters]);

  const splits = useMemo(() => {
    if (isNaN(totalDistanceMeters) || isNaN(splitDistanceMeters)) return [];
    if (splitDistanceMeters <= 0) return [];
    if (splitDistanceMeters > totalDistanceMeters) return [];
    const numSplits = Math.ceil(totalDistanceMeters / splitDistanceMeters);
    const paceSec = mode === "pace" ? paceSeconds : calculatedPaceSeconds;
    if (isNaN(paceSec) || paceSec <= 0) return [];
    const splitsArr = [];
    for (let i = 1; i <= numSplits; i++) {
      const dist = Math.min(i * splitDistanceMeters, totalDistanceMeters);
      const distKm = dist / 1000;
      const timeSec = paceSec * distKm;
      splitsArr.push({
        splitNumber: i,
        distanceMeters: dist,
        distanceDisplay:
          splitDistanceUnit === "km"
            ? (dist / 1000).toFixed(2)
            : (dist / 1609.344).toFixed(2),
        timeSeconds: timeSec,
        timeDisplay: secondsToHMS(timeSec),
      });
    }
    return splitsArr;
  }, [totalDistanceMeters, splitDistanceMeters, paceSeconds, calculatedPaceSeconds, mode, splitDistanceUnit]);

  const handleCalculate = () => {
    setError("");
    if (distanceNum <= 0 || isNaN(distanceNum)) {
      setError("Please enter a valid total distance greater than zero.");
      return;
    }
    if (splitDistanceNum <= 0 || isNaN(splitDistanceNum)) {
      setError("Please enter a valid split distance greater than zero.");
      return;
    }
    if (splitDistanceNum > distanceNum) {
      setError("Split distance cannot be greater than total distance.");
      return;
    }
    if (mode === "pace") {
      if (isNaN(paceSeconds) || paceSeconds <= 0) {
        setError("Please enter a valid pace in mm:ss format.");
        return;
      }
    } else {
      if (isNaN(finishTimeSeconds) || finishTimeSeconds <= 0) {
        setError("Please enter a valid finish time in hh:mm:ss or mm:ss format.");
        return;
      }
    }
  };

  const handleReset = () => {
    setDistance("10");
    setDistanceUnit("km");
    setPace("5:00");
    setSplitDistance("1");
    setSplitDistanceUnit("km");
    setFinishTime("");
    setMode("pace");
    setError("");
  };

  const relatedCalculators = [
    { emoji: "🐕", title: "Dog Calorie Needs Calculator", slug: "dog-calorie-needs" },
    { emoji: "💰", title: "Loan Payment Calculator", slug: "loan-payment" },
    { emoji: "💊", title: "Body Mass Index Calculator", slug: "bmi" },
    { emoji: "🐾", title: "Pet Age to Human Age Calculator", slug: "pet-age-human-age" },
    { emoji: "📈", title: "Investment Growth Calculator", slug: "investment-growth" },
    { emoji: "❤️", title: "Heart Rate Zone Calculator", slug: "heart-rate-zone" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Running Pace / Split / Finish Time Calculator"
      slug="running-pace-split-finish-time"
      category="sports"
      subcategory="Running, Cycling & Triathlon Performance"
      icon={<Activity className="mr-2 h-6 w-6" />}
      relatedCalculators={relatedCalculators}
    >
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-sky-500" />
            Input Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="distance" className="mb-1 block font-semibold">
              Total Distance
            </Label>
            <div className="flex gap-2">
              <Input
                id="distance"
                type="number"
                min={0}
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 10"
              />
              <select
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as "km" | "mi")}
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Calculate by</Label>
            <div className="flex gap-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="pace"
                  checked={mode === "pace"}
                  onChange={() => setMode("pace")}
                  className="mr-2"
                />
                Pace (min/km or min/mi)
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="finishTime"
                  checked={mode === "finishTime"}
                  onChange={() => setMode("finishTime")}
                  className="mr-2"
                />
                Finish Time (hh:mm:ss)
              </label>
            </div>
          </div>

          {mode === "pace" && (
            <div>
              <Label htmlFor="pace" className="mb-1 block font-semibold">
                Pace (min:ss per {distanceUnit})
              </Label>
              <Input
                id="pace"
                type="text"
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                placeholder="e.g. 5:00"
              />
            </div>
          )}

          {mode === "finishTime" && (
            <div>
              <Label htmlFor="finishTime" className="mb-1 block font-semibold">
                Finish Time (hh:mm:ss or mm:ss)
              </Label>
              <Input
                id="finishTime"
                type="text"
                value={finishTime}
                onChange={(e) => setFinishTime(e.target.value)}
                placeholder="e.g. 1:30:00"
              />
            </div>
          )}

          <div>
            <Label htmlFor="splitDistance" className="mb-1 block font-semibold">
              Split Distance
            </Label>
            <div className="flex gap-2">
              <Input
                id="splitDistance"
                type="number"
                min={0}
                step="any"
                value={splitDistance}
                onChange={(e) => setSplitDistance(e.target.value)}
                placeholder="e.g. 1"
              />
              <select
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                value={splitDistanceUnit}
                onChange={(e) => setSplitDistanceUnit(e.target.value as "km" | "mi")}
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-4">
            <Button onClick={handleCalculate} variant="default">
              Calculate
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {(mode === "pace" && !isNaN(calculatedFinishTimeSeconds) && calculatedFinishTimeSeconds > 0) ||
      (mode === "finishTime" && !isNaN(calculatedPaceSeconds) && calculatedPaceSeconds > 0) ? (
        <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <Activity className="h-6 w-6" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              {mode === "pace" && (
                <>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {secondsToHMS(calculatedFinishTimeSeconds)}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Estimated Finish Time
                  </p>
                </>
              )}
              {mode === "finishTime" && (
                <>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPace(calculatedPaceSeconds)} / {distanceUnit}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Required Pace
                  </p>
                </>
              )}
            </div>

            {splits.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Split #</TableHead>
                      <TableHead>Distance ({splitDistanceUnit})</TableHead>
                      <TableHead>Time (hh:mm:ss)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {splits.map(({ splitNumber, distanceDisplay, timeDisplay }) => (
                      <TableRow key={splitNumber}>
                        <TableCell>{splitNumber}</TableCell>
                        <TableCell>{distanceDisplay}</TableCell>
                        <TableCell>{timeDisplay}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      ) : null}

      <section id="how-to-use" className="prose max-w-none mb-12">
        <h2>How to Use the Running Pace / Split / Finish Time Calculator</h2>
        <p>
          This calculator helps runners, cyclists, and triathletes determine their pace, split times, or finish time for a given distance. You can calculate your estimated finish time based on your pace, or find out what pace you need to maintain to finish in a target time. Additionally, it breaks down your race into splits for easier pacing.
        </p>
        <p>
          To use the calculator, enter your total race distance and select the unit (kilometers or miles). Choose whether you want to calculate by pace or finish time. Enter your pace (in minutes and seconds per kilometer or mile) or your target finish time (in hours, minutes, and seconds). Specify your preferred split distance to see detailed split times.
        </p>
        <p>
          Click "Calculate" to see your results. Use the "Reset" button to clear all inputs and start over.
        </p>
        <p>
          This tool is ideal for race planning, pacing strategies, and training preparation.
        </p>
      </section>

      <section id="formula" className="prose max-w-none mb-12">
        <h2>Formula and Calculations</h2>
        <p>
          The core calculations are based on the relationship between distance, pace, and time:
        </p>
        <ul>
          <li><strong>Finish Time</strong> = Pace × Distance</li>
          <li><strong>Pace</strong> = Finish Time ÷ Distance</li>
          <li><strong>Split Times</strong> are calculated by multiplying the pace by each split distance increment.</li>
        </ul>
        <p>
          <strong>Pace</strong> is expressed as the time taken to cover one unit of distance (e.g., minutes per kilometer or mile). It is converted internally to seconds per kilometer or mile for precise calculations.
        </p>
        <p>
          <strong>Finish Time</strong> is the total time to complete the race, calculated by multiplying the pace by the total distance.
        </p>
        <p>
          <strong>Splits</strong> provide intermediate times at regular intervals (e.g., every kilometer or mile) to help monitor pacing during training or races.
        </p>
      </section>

      <section id="example" className="prose max-w-none mb-12">
        <h2>Example Calculation</h2>
        <p>
          Suppose you plan to run a 10 kilometer race and want to maintain a pace of 5 minutes per kilometer.
        </p>
        <ol>
          <li>Enter <code>10</code> for the total distance and select <code>km</code>.</li>
          <li>Select the "Pace" mode.</li>
          <li>Enter <code>5:00</code> for your pace.</li>
          <li>Set the split distance to <code>1</code> kilometer.</li>
          <li>Click "Calculate".</li>
        </ol>
        <p>
          The calculator will show an estimated finish time of <strong>00:50:00</strong> and split times for each kilometer, helping you track your progress during the race.
        </p>
        <p>
          Alternatively, if you have a target finish time of 45 minutes, you can switch to "Finish Time" mode, enter <code>0:45:00</code>, and the calculator will tell you the pace you need to maintain.
        </p>
      </section>

      <section id="mistakes" className="prose max-w-none mb-12">
        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li>
            <strong>Incorrect time format:</strong> Ensure pace is entered as <code>mm:ss</code> and finish time as <code>hh:mm:ss</code> or <code>mm:ss</code>. Avoid using decimals or other formats.
          </li>
          <li>
            <strong>Unit mismatch:</strong> Make sure your distance and split distance units match your pace units (km or mi).
          </li>
          <li>
            <strong>Split distance too large:</strong> The split distance should be smaller than or equal to the total distance.
          </li>
          <li>
            <strong>Negative or zero values:</strong> Inputs must be positive numbers.
          </li>
          <li>
            <strong>Ignoring rest or terrain:</strong> This calculator assumes steady pace on flat terrain without breaks.
          </li>
          <li>
            <strong>Not resetting inputs:</strong> Use the reset button to clear previous values before starting a new calculation.
          </li>
        </ul>
      </section>

      <section id="faq" className="prose max-w-none mb-12">
        <h2>Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3>Q1: Can I use this calculator for cycling or triathlon?</h3>
            <p>
              Yes, as long as you know your pace (time per kilometer or mile) or finish time and distance, this calculator can be used for any endurance sport.
            </p>
          </div>
          <div>
            <h3>Q2: How do I enter pace if I only know my speed?</h3>
            <p>
              Pace is the inverse of speed. For example, if you run at 12 km/h, your pace is 5 minutes per kilometer (60 ÷ 12 = 5).
            </p>
          </div>
          <div>
            <h3>Q3: What if my splits are uneven?</h3>
            <p>
              This calculator assumes even splits based on a constant pace. For uneven splits, you would need to calculate each segment separately.
            </p>
          </div>
          <div>
            <h3>Q4: Can I enter finish time without hours?</h3>
            <p>
              Yes, you can enter finish time as mm:ss if the duration is less than an hour.
            </p>
          </div>
          <div>
            <h3>Q5: Why does the calculator show an error?</h3>
            <p>
              Errors usually occur due to invalid inputs like negative numbers, zero, or incorrect time formats. Please check your inputs and try again.
            </p>
          </div>
          <div>
            <h3>Q6: Can I use miles instead of kilometers?</h3>
            <p>
              Yes, you can select miles as your unit for distance and split distance. Make sure to enter pace accordingly (min/mile).
            </p>
          </div>
          <div>
            <h3>Q7: How accurate are the split times?</h3>
            <p>
              Split times are calculated based on a constant pace and may vary in real-world conditions due to terrain, fatigue, or strategy.
            </p>
          </div>
          <div>
            <h3>Q8: Can I use this calculator for ultra-distance events?</h3>
            <p>
              Yes, but keep in mind that pacing strategies for ultra-distance events may be more complex and variable.
            </p>
          </div>
          <div>
            <h3>Q9: What does the split distance mean?</h3>
            <p>
              Split distance is the interval at which you want to see intermediate times, such as every 1 km or 1 mile.
            </p>
          </div>
          <div>
            <h3>Q10: Can I calculate pace if I know finish time and distance?</h3>
            <p>
              Yes, switch to "Finish Time" mode, enter your finish time and distance, and the calculator will compute the required pace.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="prose max-w-none mb-12">
        <h2>
          <BookOpen className="inline-block mr-2 h-6 w-6 text-sky-600" />
          References
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a href="https://www.runnersworld.com/uk/training/beginners/a776520/how-to-calculate-running-pace/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              How to Calculate Running Pace - Runner's World
            </a>
          </li>
          <li>
            <a href="https://www.trainingpeaks.com/blog/how-to-calculate-run-pace/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              How to Calculate Run Pace - TrainingPeaks
            </a>
          </li>
          <li>
            <a href="https://www.active.com/running/articles/how-to-calculate-race-pace" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              How to Calculate Race Pace - Active.com
            </a>
          </li>
          <li>
            <a href="https://www.runnersconnect.net/running-pace-calculator/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              Running Pace Calculator - Runners Connect
            </a>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Pace_(running)" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              Pace (running) - Wikipedia
            </a>
          </li>
          <li>
            <a href="https://www.brianmac.co.uk/pace.htm" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              Running Pace Calculator - Brian Mac
            </a>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}