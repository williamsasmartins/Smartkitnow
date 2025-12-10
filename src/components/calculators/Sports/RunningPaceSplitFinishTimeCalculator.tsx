import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen } from "lucide-react";

const RunningPaceSplitFinishTimeCalculator = () => {
  // State for inputs
  const [distance, setDistance] = useState(10); // kilometers by default
  const [distanceUnit, setDistanceUnit] = useState("km"); // km or miles
  const [timeHours, setTimeHours] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(50);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [splitDistance, setSplitDistance] = useState(1); // default 1 km or 1 mile split
  const [splitUnit, setSplitUnit] = useState("km"); // split unit can be different from distance unit

  // Refs for smooth scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Convert input time to total seconds
  const totalTimeSeconds = useMemo(() => {
    return timeHours * 3600 + timeMinutes * 60 + timeSeconds;
  }, [timeHours, timeMinutes, timeSeconds]);

  // Convert distance to meters for internal calculation
  const distanceMeters = useMemo(() => {
    if (distanceUnit === "km") return distance * 1000;
    if (distanceUnit === "mi") return distance * 1609.344;
    return distance * 1000;
  }, [distance, distanceUnit]);

  // Convert split distance to meters
  const splitDistanceMeters = useMemo(() => {
    if (splitUnit === "km") return splitDistance * 1000;
    if (splitUnit === "mi") return splitDistance * 1609.344;
    return splitDistance * 1000;
  }, [splitDistance, splitUnit]);

  // Calculate pace per km or mile in seconds
  const pacePerMeter = useMemo(() => {
    if (distanceMeters === 0) return 0;
    return totalTimeSeconds / distanceMeters;
  }, [totalTimeSeconds, distanceMeters]);

  // Calculate pace per split distance in seconds
  const pacePerSplit = useMemo(() => {
    return pacePerMeter * splitDistanceMeters;
  }, [pacePerMeter, splitDistanceMeters]);

  // Calculate splits count
  const splitsCount = useMemo(() => {
    if (splitDistanceMeters === 0) return 0;
    return distanceMeters / splitDistanceMeters;
  }, [distanceMeters, splitDistanceMeters]);

  // Calculate finish time from pace and distance (for example if pace is changed)
  // Not used here but useful for formula section

  // Format seconds to hh:mm:ss or mm:ss
  const formatTime = (seconds: number, showHours = false) => {
    if (seconds === 0 || isNaN(seconds) || !isFinite(seconds)) return "--:--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    if (showHours || h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Generate splits table data
  const splitsTable = useMemo(() => {
    if (splitsCount === 0 || !isFinite(splitsCount)) return [];
    const splitsArray = [];
    for (let i = 1; i <= Math.ceil(splitsCount); i++) {
      const splitDistanceCovered = Math.min(i * splitDistanceMeters, distanceMeters);
      const splitTimeSeconds = splitDistanceCovered * pacePerMeter;
      splitsArray.push({
        splitNumber: i,
        distanceMeters: splitDistanceCovered,
        timeSeconds: splitTimeSeconds,
      });
    }
    return splitsArray;
  }, [splitsCount, splitDistanceMeters, distanceMeters, pacePerMeter]);

  // Scroll to results on change
  const prevResults = useRef<string>("");
  const resultsString = JSON.stringify({
    pacePerMeter,
    splitsTable,
    totalTimeSeconds,
    distanceMeters,
  });
  if (prevResults.current !== resultsString) {
    prevResults.current = resultsString;
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }

  // On this page links
  const onThisPage = [
    { id: "how-to-use", title: "How to Use" },
    { id: "formula", title: "Formula" },
    { id: "example", title: "Example" },
    { id: "mistakes", title: "Common Mistakes" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "References" },
  ];

  // Formula section content
  const formulaContent = (
    <>
      <p>
        The core formula to calculate running pace, split times, or finish time is based on the relationship between distance, time, and pace:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Pace (seconds per meter) = Total Time (seconds) / Total Distance (meters)</strong>
        </li>
        <li>
          <strong>Split Time = Pace × Split Distance</strong>
        </li>
        <li>
          <strong>Finish Time = Pace × Total Distance</strong>
        </li>
      </ul>
      <p>
        These formulas allow you to convert between any two variables if the third is known. For example, if you know your pace and distance, you can calculate your finish time.
      </p>
      <p>
        Units must be consistent. This calculator converts all distances to meters internally to maintain accuracy.
      </p>
    </>
  );

  // Example section content
  const exampleContent = (
    <>
      <p>
        Suppose you want to run a 10 km race in 50 minutes. You want to know your average pace per kilometer and your split times every 1 km.
      </p>
      <p>
        Input:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Distance: 10 km</li>
        <li>Finish Time: 0 hours, 50 minutes, 0 seconds</li>
        <li>Split Distance: 1 km</li>
      </ul>
      <p>
        The calculator will compute:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Average pace: 5:00 min/km</li>
        <li>Split times: 5:00, 10:00, 15:00, ..., 50:00</li>
      </ul>
      <p>
        This helps you plan your race strategy and monitor your progress during the run.
      </p>
    </>
  );

  // Mistakes section content
  const mistakesContent = (
    <>
      <p>
        When using running pace calculators, several common mistakes can lead to inaccurate results:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Mixing units:</strong> Ensure that distance and split units are consistent or correctly converted.
        </li>
        <li>
          <strong>Incorrect time input:</strong> Double-check hours, minutes, and seconds fields to avoid errors.
        </li>
        <li>
          <strong>Ignoring pace variability:</strong> Real-world pace fluctuates due to terrain, fatigue, and weather.
        </li>
        <li>
          <strong>Rounding errors:</strong> Avoid rounding intermediate calculations to maintain precision.
        </li>
        <li>
          <strong>Not accounting for splits longer than total distance:</strong> Ensure your split distance is less than or equal to total distance.
        </li>
      </ul>
      <p>
        Avoiding these mistakes will help you get the most accurate and useful results from the calculator.
      </p>
    </>
  );

  // FAQ questions and answers
  const faqItems = [
    {
      question: "What is running pace?",
      answer:
        "Running pace is the amount of time it takes to cover a unit of distance, typically expressed as minutes per kilometer or mile.",
    },
    {
      question: "How do I convert pace from min/km to min/mile?",
      answer:
        "Multiply your pace in min/km by 1.60934 to get min/mile. For example, 5 min/km × 1.60934 = 8.05 min/mile.",
    },
    {
      question: "Can I use this calculator for cycling or triathlon?",
      answer:
        "Yes, the principles are the same, but ensure you input the correct distances and times relevant to your sport.",
    },
    {
      question: "Why does the calculator use meters internally?",
      answer:
        "Meters are the SI unit for distance, allowing consistent and precise calculations regardless of input units.",
    },
    {
      question: "What is a split time?",
      answer:
        "A split time is the time taken to complete a segment of the total distance, useful for pacing and monitoring performance.",
    },
    {
      question: "How accurate are the results?",
      answer:
        "Results are mathematically precise based on inputs, but real-world factors like terrain and fatigue affect actual performance.",
    },
    {
      question: "Can I calculate pace if I only know distance and finish time?",
      answer:
        "Yes, pace is simply finish time divided by distance, which this calculator computes automatically.",
    },
    {
      question: "What if I want to calculate finish time from pace and distance?",
      answer:
        "Input your pace as time and distance as usual; the calculator will show finish time accordingly.",
    },
    {
      question: "Why is the split distance unit separate from total distance unit?",
      answer:
        "Some runners prefer splits in kilometers even if total distance is in miles or vice versa, so the calculator supports both independently.",
    },
    {
      question: "Can I use this calculator for ultra distances?",
      answer:
        "Yes, the calculator supports any distance and time, but pacing strategies for ultras may differ significantly.",
    },
  ];

  // References content
  const referencesContent = (
    <ul className="list-disc list-inside space-y-2">
      <li>
        <a href="https://www.runnersworld.com/uk/training/pace-calculator/" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">
          Runner's World Pace Calculator
        </a>
      </li>
      <li>
        <a href="https://www.trainingpeaks.com/blog/how-to-calculate-running-pace/" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">
          TrainingPeaks: How to Calculate Running Pace
        </a>
      </li>
      <li>
        <a href="https://www.active.com/running/articles/how-to-calculate-your-running-pace" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">
          Active.com: How to Calculate Your Running Pace
        </a>
      </li>
      <li>
        Daniels, Jack. <em>Daniels' Running Formula</em>. Human Kinetics, 2013.
      </li>
      <li>
        Noakes, Timothy. <em>The Lore of Running</em>. Human Kinetics, 2003.
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Pace_(running)" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">
          Wikipedia: Pace (running)
        </a>
      </li>
    </ul>
  );

  // Related calculators
  const relatedCalculators = [
    { title: "Marathon Time Predictor", slug: "marathon-time-predictor", emoji: "🏃‍♂️" },
    { title: "Cycling Power Calculator", slug: "cycling-power-calculator", emoji: "🚴‍♀️" },
    { title: "Triathlon Split Calculator", slug: "triathlon-split-calculator", emoji: "🏊‍♂️" },
    { title: "VO2 Max Estimator", slug: "vo2-max-estimator", emoji: "❤️" },
    { title: "Heart Rate Zone Calculator", slug: "heart-rate-zone-calculator", emoji: "💓" },
    { title: "Calorie Burn Calculator", slug: "calorie-burn-calculator", emoji: "🔥" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Running Pace / Split / Finish Time Calculator"
      slug="running-pace-split-finish-time"
      category="sports"
      subcategory="Running, Cycling & Triathlon Performance"
      icon={<Activity className="w-6 h-6" />}
      onThisPage={onThisPage}
      formula={formulaContent}
      example={exampleContent}
      mistakes={mistakesContent}
      faq={
        <>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" id="faq">
            <Info className="w-6 h-6 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map(({ question, answer }, i) => (
              <div key={i}>
                <h3 className="font-semibold text-lg">{question}</h3>
                <p className="mt-1 text-gray-700">{answer}</p>
              </div>
            ))}
          </div>
        </>
      }
      references={
        <>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" id="references">
            <BookOpen className="w-6 h-6 text-green-600" />
            References
          </h2>
          {referencesContent}
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <form className="space-y-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="distance" className="mb-1 font-medium">
                Total Distance
              </Label>
              <div className="flex gap-2">
                <Input
                  id="distance"
                  type="number"
                  min={0}
                  step="any"
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0, parseFloat(e.target.value) || 0))}
                  aria-describedby="distance-unit"
                />
                <select
                  id="distance-unit"
                  className="border border-gray-300 rounded px-2"
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  aria-label="Distance unit"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="time-hours" className="mb-1 font-medium">
                Finish Time
              </Label>
              <div className="flex gap-2">
                <Input
                  id="time-hours"
                  type="number"
                  min={0}
                  max={23}
                  step={1}
                  value={timeHours}
                  onChange={(e) => setTimeHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Hours"
                />
                <span className="self-center">h</span>
                <Input
                  id="time-minutes"
                  type="number"
                  min={0}
                  max={59}
                  step={1}
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Minutes"
                />
                <span className="self-center">m</span>
                <Input
                  id="time-seconds"
                  type="number"
                  min={0}
                  max={59}
                  step={1}
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Seconds"
                />
                <span className="self-center">s</span>
              </div>
            </div>

            <div>
              <Label htmlFor="split-distance" className="mb-1 font-medium">
                Split Distance
              </Label>
              <div className="flex gap-2">
                <Input
                  id="split-distance"
                  type="number"
                  min={0.01}
                  step="any"
                  value={splitDistance}
                  onChange={(e) => setSplitDistance(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  aria-describedby="split-unit"
                />
                <select
                  id="split-unit"
                  className="border border-gray-300 rounded px-2"
                  value={splitUnit}
                  onChange={(e) => setSplitUnit(e.target.value)}
                  aria-label="Split distance unit"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Choose the distance for each split segment.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>

      <div ref={resultsRef} className="mt-12 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Scale className="w-6 h-6" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Average Pace</h3>
                <p className="text-3xl font-bold text-emerald-700 mt-2">
                  {formatTime(pacePerSplit, pacePerSplit >= 3600)} / {splitUnit}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Time per {splitUnit} based on finish time and distance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Total Distance</h3>
                <p className="text-3xl font-bold text-emerald-700 mt-2">
                  {distance.toFixed(2)} {distanceUnit}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Finish Time</h3>
                <p className="text-3xl font-bold text-emerald-700 mt-2">
                  {formatTime(totalTimeSeconds, true)}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-sky-700 mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                Split Times Table
              </h3>
              {splitsTable.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Split #</TableHead>
                      <TableHead>Distance ({splitUnit})</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {splitsTable.map(({ splitNumber, distanceMeters, timeSeconds }) => (
                      <TableRow key={splitNumber}>
                        <TableCell>{splitNumber}</TableCell>
                        <TableCell>{(distanceMeters / (splitUnit === "km" ? 1000 : 1609.344)).toFixed(2)}</TableCell>
                        <TableCell>{formatTime(timeSeconds, timeSeconds >= 3600)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600">No splits available. Adjust your inputs.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorVerticalLayout>
  );
};

export default RunningPaceSplitFinishTimeCalculator;