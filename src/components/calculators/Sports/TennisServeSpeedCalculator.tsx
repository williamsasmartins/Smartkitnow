import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// ⚠️ FULL ICON IMPORT
import {
  Timer,
  TrendingUp,
  Trophy,
  Flag,
  Zap,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Gauge,
  ArrowRightLeft,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// ── Pro player benchmark data ─────────────────────────────────────
const PRO_BENCHMARKS = [
  { player: "John Isner",      country: "🇺🇸", kmh: 253, category: "ATP Record",  gender: "Men"   },
  { player: "Sam Groth",       country: "🇦🇺", kmh: 263, category: "Fastest Ever", gender: "Men"   },
  { player: "Novak Djokovic",  country: "🇷🇸", kmh: 220, category: "Top 10 ATP",  gender: "Men"   },
  { player: "Roger Federer",   country: "🇨🇭", kmh: 215, category: "Top 10 ATP",  gender: "Men"   },
  { player: "Rafael Nadal",    country: "🇪🇸", kmh: 217, category: "Top 10 ATP",  gender: "Men"   },
  { player: "Average ATP Pro", country: "🏆",  kmh: 193, category: "ATP Average", gender: "Men"   },
  { player: "Sabine Lisicki",  country: "🇩🇪", kmh: 211, category: "WTA Record",  gender: "Women" },
  { player: "Serena Williams", country: "🇺🇸", kmh: 207, category: "Top WTA",     gender: "Women" },
  { player: "Average WTA Pro", country: "🏆",  kmh: 163, category: "WTA Average", gender: "Women" },
  { player: "Club Player",     country: "🎾",  kmh: 130, category: "Amateur",     gender: "Both"  },
];

// ── Conversion helpers ───────────────────────────────────────────
const mToFt = (m: number) => m * 3.28084;
const ftToM = (ft: number) => ft / 3.28084;
const kmhToMph = (kmh: number) => kmh * 0.621371;

// ── Speedometer SVG (pure SVG, no lib) ───────────────────────────
function Speedometer({ speedKmh, maxKmh = 300 }: { speedKmh: number; maxKmh?: number }) {
  const clampedKmh = Math.min(speedKmh, maxKmh);
  const pct = clampedKmh / maxKmh;          // 0–1
  const START_ANGLE = -220;                  // degrees (left side)
  const SWEEP       = 260;                   // total arc degrees
  const angle       = START_ANGLE + pct * SWEEP;
  const cx = 110, cy = 110, r = 85;

  // Arc path helper
  const polarToXY = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const startPt = polarToXY(START_ANGLE, r);
  const endPt   = polarToXY(START_ANGLE + SWEEP, r);
  const needlePt = polarToXY(angle, r - 12);

  // Speed colour: green → yellow → red
  const speedColor =
    pct < 0.4 ? "#4ade80"
    : pct < 0.65 ? "#facc15"
    : pct < 0.85 ? "#fb923c"
    : "#ef4444";

  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-[280px] mx-auto select-none">
      {/* Background arc (grey) */}
      <path
        d={`M ${startPt.x} ${startPt.y} A ${r} ${r} 0 1 1 ${endPt.x} ${endPt.y}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Coloured filled arc */}
      {pct > 0 && (
        <path
          d={`M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${needlePt.x} ${needlePt.y}`}
          fill="none"
          stroke={speedColor}
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* Needle dot */}
      <circle cx={needlePt.x} cy={needlePt.y} r="7" fill={speedColor} />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#94a3b8" />
      {/* Speed text */}
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="22" fontWeight="800" fill={speedColor}>
        {speedKmh.toFixed(0)}
      </text>
      <text x={cx} y={cy + 44} textAnchor="middle" fontSize="10" fill="#94a3b8">
        km/h
      </text>
      <text x={cx} y={cy + 58} textAnchor="middle" fontSize="9" fill="#94a3b8">
        {kmhToMph(speedKmh).toFixed(0)} mph
      </text>
      {/* Min/Max labels */}
      <text x="22" y="148" fontSize="9" fill="#94a3b8">0</text>
      <text x="185" y="148" fontSize="9" fill="#94a3b8">{maxKmh}</text>
    </svg>
  );
}

// ── Comparison bar chart ──────────────────────────────────────────
function ComparisonChart({ userKmh }: { userKmh: number }) {
  const MAX = 280;
  const rows = [
    { label: "Fastest Ever (Sam Groth)", kmh: 263, color: "#ef4444" },
    { label: "Serena Williams (WTA Rec.)", kmh: 207, color: "#a855f7" },
    { label: "Top ATP Average",           kmh: 193, color: "#f97316" },
    { label: "Your Serve",               kmh: userKmh, color: "#22c55e" },
    { label: "Average Club Player",       kmh: 130, color: "#64748b" },
  ].sort((a, b) => b.kmh - a.kmh);

  return (
    <div className="space-y-3 mt-4">
      {rows.map((row) => {
        const barPct = Math.min((row.kmh / MAX) * 100, 100);
        const isUser = row.label === "Your Serve";
        return (
          <div key={row.label}>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className={isUser ? "text-green-600 dark:text-green-400 font-bold" : "text-slate-600 dark:text-slate-400"}>
                {isUser ? "⚡ " : ""}{row.label}
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {row.kmh.toFixed(0)} km/h · {kmhToMph(row.kmh).toFixed(0)} mph
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{ width: `${barPct}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function TennisServeSpeedCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState({ distance: "", time: "" });
  const handleInputChange = useCallback((n: string, v: string) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const rawDist = parseFloat(inputs.distance);
    const time    = parseFloat(inputs.time);

    if (isNaN(rawDist) || isNaN(time) || rawDist <= 0 || time <= 0) {
      return { kmh: null, mph: null, warning: "Please enter valid positive numbers for distance and time." };
    }

    const distMeters = unit === "imperial" ? ftToM(rawDist) : rawDist;
    const speedMs    = distMeters / time;
    const kmh        = speedMs * 3.6;
    const mph        = kmhToMph(kmh);
    return { kmh, mph, warning: null };
  }, [inputs, unit]);

  // Speed tier label
  const speedTier = useMemo(() => {
    if (!results.kmh) return null;
    if (results.kmh >= 240) return { label: "🔥 Monster Serve!", color: "text-red-500" };
    if (results.kmh >= 200) return { label: "⚡ Pro-Level!", color: "text-orange-500" };
    if (results.kmh >= 170) return { label: "💪 Advanced", color: "text-yellow-500" };
    if (results.kmh >= 130) return { label: "🎾 Club Player", color: "text-green-600" };
    return { label: "🌱 Keep Training!", color: "text-blue-500" };
  }, [results.kmh]);

  // Percentile vs ATP
  const percentile = useMemo(() => {
    if (!results.kmh) return null;
    if (results.kmh >= 240) return 99;
    if (results.kmh >= 220) return 95;
    if (results.kmh >= 200) return 85;
    if (results.kmh >= 185) return 70;
    if (results.kmh >= 160) return 50;
    if (results.kmh >= 130) return 25;
    return 10;
  }, [results.kmh]);

  const distLabel = unit === "metric" ? "meters (m)" : "feet (ft)";
  const distPlaceholder = unit === "metric" ? "e.g. 18.3" : "e.g. 60";

  const faqs = [
    {
      question: "How accurate is the Tennis Serve Speed Calculator?",
      answer:
        "The calculator provides an estimate based on the distance the ball travels and the time it takes. Factors like ball spin, air resistance, and measurement precision can affect accuracy. For professional precision, radar guns or high-speed cameras are recommended.",
    },
    {
      question: "What is the fastest tennis serve ever recorded?",
      answer:
        "Sam Groth (Australia) holds the official record at 263.4 km/h (163.7 mph), set in 2012. John Isner's 253 km/h remains the fastest in Grand Slam competition. On the women's side, Sabine Lisicki recorded 211 km/h (131 mph).",
    },
    {
      question: "Can I use feet instead of meters for the distance?",
      answer:
        "Yes! Toggle the unit switch to Imperial to enter distance in feet. The calculator automatically converts feet to meters internally to compute the correct speed in both km/h and mph.",
    },
    {
      question: "What is the average serve speed on the ATP Tour?",
      answer:
        "The average first serve speed on the ATP Tour is approximately 185–200 km/h (115–124 mph). On the WTA Tour, the average is around 155–165 km/h (96–103 mph). Club-level players typically serve between 100–140 km/h (62–87 mph).",
    },
    {
      question: "How do I measure my serve time accurately?",
      answer:
        "The most accurate method is slow-motion video analysis. Film your serve at 120fps or higher, count frames from ball impact to bounce, then divide by frame rate to get time in seconds. Free apps like Ubersense or Coach's Eye can help.",
    },
    {
      question: "What is a good serve speed for a recreational player?",
      answer:
        "For recreational players, 100–140 km/h (62–87 mph) is typical. Breaking 160 km/h (100 mph) is considered strong for an amateur. Consistent placement and spin are often more valuable than raw speed at the club level.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Tennis court header banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#2d6a4f] via-[#40916c] to-[#52b788] p-5 text-white shadow-inner">
        {/* Court lines decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
          <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white" />
          <div className="absolute top-1/3 left-1/4 right-1/4 h-px bg-white" />
        </div>
        <div className="relative flex items-center gap-3">
          <span className="text-4xl" aria-hidden>🎾</span>
          <div>
            <p className="font-extrabold text-lg leading-tight">Tennis Serve Speed Calculator</p>
            <p className="text-green-100 text-sm">Results in both km/h and mph · Compare vs. the pros</p>
          </div>
        </div>
      </div>

      {/* Unit toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Unit system:</span>
        <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <button
            id="unit-metric"
            onClick={() => { setUnit("metric"); setInputs({ distance: "", time: "" }); }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              unit === "metric"
                ? "bg-[#40916c] text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Metric (m · km/h)
          </button>
          <button
            id="unit-imperial"
            onClick={() => { setUnit("imperial"); setInputs({ distance: "", time: "" }); }}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              unit === "imperial"
                ? "bg-[#40916c] text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <ArrowRightLeft className="inline w-3 h-3 mr-1" />Imperial (ft · mph)
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distance" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Flag className="w-4 h-4 text-[#40916c]" /> Distance ({distLabel})
          </Label>
          <Input
            id="distance"
            type="number"
            min="0"
            step="0.01"
            placeholder={distPlaceholder}
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            aria-describedby="distance-desc"
            className="border-slate-300 focus:border-[#40916c] focus:ring-[#40916c]"
          />
          <p id="distance-desc" className="text-xs text-slate-500 mt-1">
            Straight-line distance from serve impact to first bounce.
          </p>
        </div>
        <div>
          <Label htmlFor="time" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Timer className="w-4 h-4 text-[#40916c]" /> Time (seconds)
          </Label>
          <Input
            id="time"
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.35"
            value={inputs.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            aria-describedby="time-desc"
            className="border-slate-300 focus:border-[#40916c] focus:ring-[#40916c]"
          />
          <p id="time-desc" className="text-xs text-slate-500 mt-1">
            Time from serve impact to first bounce.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          id="calculate-btn"
          className="flex-1 h-11 bg-[#40916c] hover:bg-[#2d6a4f] text-white shadow-md"
          onClick={() => setInputs((p) => ({ ...p }))}
          aria-label="Calculate serve speed"
        >
          <Gauge className="mr-2 h-4 w-4" /> Calculate Speed
        </Button>
        <Button
          id="reset-btn"
          variant="outline"
          onClick={() => setInputs({ distance: "", time: "" })}
          className="flex-1 h-11 border-slate-300"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Warning */}
      {results.warning && (
        <p className="text-amber-600 dark:text-amber-400 font-semibold mt-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}

      {/* Results */}
      {results.kmh !== null && !results.warning && (
        <div className="space-y-6 mt-2">
          {/* Speed readout cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-[#40916c]/30 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] dark:from-[#1b4332] dark:to-[#2d6a4f] shadow-lg">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-bold text-[#2d6a4f] dark:text-green-300 uppercase tracking-widest mb-1">
                  km/h
                </p>
                <p className="text-5xl font-extrabold text-[#1b4332] dark:text-white leading-none">
                  {results.kmh.toFixed(1)}
                </p>
                <p className="text-xs text-[#40916c] dark:text-green-400 mt-1 font-semibold">kilometers/hour</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300/50 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-950 dark:to-sky-900 shadow-lg">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">
                  mph
                </p>
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white leading-none">
                  {results.mph!.toFixed(1)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">miles/hour</p>
              </CardContent>
            </Card>
          </div>

          {/* Tier badge */}
          {speedTier && (
            <div className="text-center">
              <span className={`text-2xl font-extrabold ${speedTier.color}`}>{speedTier.label}</span>
              {percentile !== null && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Faster than approximately <strong>{percentile}%</strong> of all tennis players
                </p>
              )}
            </div>
          )}

          {/* Speedometer */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <Gauge className="inline w-3 h-3 mr-1" />Speed Gauge
            </p>
            <Speedometer speedKmh={results.kmh} maxKmh={300} />
          </div>

          {/* Comparison bar chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#40916c]" /> How do you compare?
            </p>
            <p className="text-xs text-slate-500 mb-3">Your speed vs. professional benchmarks</p>
            <ComparisonChart userKmh={results.kmh} />
          </div>
        </div>
      )}
    </div>
  );

  // ── Benchmark table ─────────────────────────────────────────────
  const benchmarkTable = (
    <section id="benchmark-table" className="scroll-mt-32">
      <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Trophy className="w-7 h-7 text-[#40916c]" /> Pro Player Speed Benchmarks
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
        See how your calculated serve speed stacks up against the world's top players. All values are official
        tournament or validated measurements.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#2d6a4f] text-white">
              <th className="text-left px-4 py-3 font-bold rounded-tl-2xl">Player</th>
              <th className="text-center px-4 py-3 font-bold">Flag</th>
              <th className="text-center px-4 py-3 font-bold">Category</th>
              <th className="text-right px-4 py-3 font-bold">km/h</th>
              <th className="text-right px-4 py-3 font-bold rounded-tr-2xl">mph</th>
            </tr>
          </thead>
          <tbody>
            {PRO_BENCHMARKS.sort((a, b) => b.kmh - a.kmh).map((row, i) => (
              <tr
                key={row.player}
                className={`border-t border-slate-100 dark:border-slate-800 transition-colors hover:bg-[#d8f3dc] dark:hover:bg-[#1b4332]/40 ${
                  i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.player}</td>
                <td className="px-4 py-3 text-center text-lg">{row.country}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    row.category.includes("Record") || row.category.includes("Ever")
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      : row.category.includes("Average")
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : row.category.includes("Amateur")
                      ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                  }`}>
                    {row.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-[#2d6a4f] dark:text-[#74c69d]">
                  {row.kmh}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">
                  {kmhToMph(row.kmh).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3 italic">
        * Sources: ATP/WTA official records, Tennis Abstract, Sports Reference. Values may vary slightly across measurements.
      </p>
    </section>
  );

  const editorial = (
    <div className="space-y-12">
      {/* Benchmark table inside editorial */}
      {benchmarkTable}

      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Tennis Serve Speed
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Tennis Serve Speed Calculator estimates the velocity of a tennis serve using two measurements:
          the distance the ball travels from impact to first bounce, and the time taken to cover that distance.
          Serve speed is a critical performance metric — it determines how much time the opponent has to react,
          directly affecting point win probability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator supports both <strong>metric</strong> (meters, km/h) and <strong>imperial</strong>{" "}
          (feet, mph) units. American players and coaches typically use mph — the same unit displayed on
          Hawk-Eye systems at US Open and ATP events in the United States.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For reference, professional ATP players average around 193 km/h (120 mph) on first serves, while
          the all-time record stands at 263 km/h (163 mph) set by Sam Groth in 2012. A good club player
          typically serves between 100–140 km/h (62–87 mph).
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You need two measurements: the distance the ball traveled (in meters <em>or</em> feet) and the time
          in seconds from ball impact to first bounce. Both can be obtained from slow-motion video or a
          stopwatch and tape measure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Choose your unit system — Metric (m) for international, Imperial (ft) for US.</li>
          <li><strong>Step 2:</strong> Measure the distance from the serve impact point to where the ball first bounces.</li>
          <li><strong>Step 3:</strong> Record the time from ball contact to bounce (slow-motion video recommended).</li>
          <li><strong>Step 4:</strong> Enter both values and click <strong>Calculate Speed</strong>.</li>
          <li><strong>Step 5:</strong> Read your speed in <strong>both km/h and mph</strong>, and compare vs. the benchmarks.</li>
        </ul>
        <div className="mt-5 p-4 bg-[#d8f3dc] dark:bg-[#1b4332]/60 border border-[#95d5b2] dark:border-[#40916c] rounded-xl text-sm text-[#1b4332] dark:text-green-100">
          <strong>🎾 Pro tip:</strong> On a standard service box, the distance from the baseline to the service
          line is 18.29 m (60 ft). Use this as your reference distance to calibrate your measurements.
        </div>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips to Increase Serve Speed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[
            { icon: "💪", title: "Leg Drive", desc: "80% of serve power originates in the legs and core. Practice knee bend and explosive jump mechanics." },
            { icon: "🔄", title: "Hip Rotation", desc: "Maximize hip-to-shoulder separation (kinetic chain). Yoga and rotational exercises help open this range." },
            { icon: "🎯", title: "Contact Point", desc: "Strike the ball at full extension above your dominant shoulder. A higher contact point increases angle and speed." },
            { icon: "📏", title: "Track Progress", desc: "Use this calculator regularly during practice. Even 5 km/h (3 mph) gains per month add up significantly over a season." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{tip.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
        <ul className="space-y-4">
          {[
            {
              href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3761736/",
              title: "Biomechanics of the Tennis Serve",
              desc: "Comprehensive NIH study on the biomechanics of tennis serves and factors affecting velocity.",
            },
            {
              href: "https://www.itftennis.com/en/news-and-media/articles/tennis-serve-speed-how-to-improve-your-serve/",
              title: "ITF Tennis: How to Improve Your Serve Speed",
              desc: "Expert training advice from the International Tennis Federation.",
            },
            {
              href: "https://www.sportsci.org/jour/9804/wilson.html",
              title: "Physics of Tennis Ball Speed",
              desc: "Academic article on the physics principles governing tennis ball velocity.",
            },
          ].map((ref) => (
            <li key={ref.href}>
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#40916c] hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-500 mt-1">{ref.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tennis Serve Speed Calculator"
      description="Calculate your tennis serve speed in km/h and mph. Compare your result with ATP & WTA pros using our benchmark table and visual speed gauge."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Speed (km/h) = (Distance (m) ÷ Time (s)) × 3.6",
        variables: [
          { symbol: "Distance (m)", description: "Straight-line distance from serve impact to ball bounce in meters (convert feet ÷ 3.281 if using imperial)" },
          { symbol: "Time (s)",     description: "Time elapsed from serve impact to ball bounce in seconds" },
          { symbol: "Speed (km/h)", description: "Estimated average serve speed in km/h; divide by 1.609 to get mph" },
        ],
      }}
      example={{
        title: "Real Life Example (Imperial)",
        scenario:
          "A player serves the ball and it travels 60 feet (≈ 18.3 m) before bouncing. The slow-motion video shows 0.35 seconds from impact to bounce.",
        steps: [
          { label: "Step 1", explanation: "Convert distance: 60 ft ÷ 3.281 = 18.29 m." },
          { label: "Step 2", explanation: "Time measured: 0.35 seconds." },
          { label: "Step 3", explanation: "Speed (m/s) = 18.29 ÷ 0.35 = 52.26 m/s." },
          { label: "Step 4", explanation: "Speed (km/h) = 52.26 × 3.6 = 188.1 km/h." },
          { label: "Step 5", explanation: "Speed (mph) = 188.1 ÷ 1.609 = 116.9 mph." },
        ],
        result: "Serve speed ≈ 188 km/h · 117 mph — Advanced club / lower ATP level.",
      }}
      relatedCalculators={[
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🎾" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Fantasy Team Points Projections", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏋️" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏀" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "⚾" },
      ]}
      onThisPage={[
        { id: "benchmark-table", label: "🏆 Pro Benchmarks" },
        { id: "what-is",        label: "Understanding Serve Speed" },
        { id: "how-to",         label: "How to Use" },
        { id: "tips",           label: "Training Tips" },
        { id: "faq",            label: "FAQ" },
        { id: "references",     label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}