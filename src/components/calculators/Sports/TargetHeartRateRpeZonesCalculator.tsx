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

export default function TargetHeartRateRpeZonesCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    restingHeartRate: "",
    method: "karvonen",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Calculate Max Heart Rate (MHR) using common formulas
  // Karvonen method uses HRrest, others use MHR only
  // RPE zones mapped to %HRmax or %HRR depending on method

  // Heart Rate Reserve (HRR) = MHR - HRrest
  // Target HR = HRrest + % * HRR (Karvonen)
  // Target HR = % * MHR (Straight % method)

  // RPE zones (Borg 6-20 scale) roughly correspond to HR zones:
  // Zone 1: 6-10 (Very light) ~ 50-60% HRmax
  // Zone 2: 11-12 (Light) ~ 60-70%
  // Zone 3: 13-14 (Somewhat hard) ~ 70-80%
  // Zone 4: 15-16 (Hard) ~ 80-90%
  // Zone 5: 17-20 (Very hard) ~ 90-100%

  // Provide zones with HR ranges and RPE ranges

  const age = Number(inputs.age);
  const restingHR = Number(inputs.restingHeartRate);
  const method = inputs.method;

  // Validate inputs
  const validAge = age > 0 && age < 120;
  const validRestingHR = restingHR > 30 && restingHR < 120;

  // Max Heart Rate formulas
  // Common: 220 - age
  // Tanaka: 208 - 0.7 * age (more accurate for adults)
  // For simplicity, use Tanaka here

  const maxHR = validAge ? 208 - 0.7 * age : null;
  const HRR = maxHR !== null && validRestingHR ? maxHR - restingHR : null;

  // Zones definitions
  // %HRmax zones (straight %)
  const zonesPercent = [
    { label: "Zone 1 (Very Light)", rpe: "6-10", percentMin: 50, percentMax: 60 },
    { label: "Zone 2 (Light)", rpe: "11-12", percentMin: 60, percentMax: 70 },
    { label: "Zone 3 (Moderate)", rpe: "13-14", percentMin: 70, percentMax: 80 },
    { label: "Zone 4 (Hard)", rpe: "15-16", percentMin: 80, percentMax: 90 },
    { label: "Zone 5 (Very Hard)", rpe: "17-20", percentMin: 90, percentMax: 100 },
  ];

  // Calculate HR zones based on method
  // Karvonen: Target HR = HRrest + % * HRR
  // Straight %: Target HR = % * MHR

  const zones = useMemo(() => {
    if (!maxHR) return null;

    return zonesPercent.map(zone => {
      let minHR, maxHRzone;
      if (method === "karvonen" && HRR !== null) {
        minHR = Math.round(restingHR + (zone.percentMin / 100) * HRR);
        maxHRzone = Math.round(restingHR + (zone.percentMax / 100) * HRR);
      } else {
        minHR = Math.round((zone.percentMin / 100) * maxHR);
        maxHRzone = Math.round((zone.percentMax / 100) * maxHR);
      }
      return {
        label: zone.label,
        rpe: zone.rpe,
        minHR,
        maxHR: maxHRzone,
        percentMin: zone.percentMin,
        percentMax: zone.percentMax,
      };
    });
  }, [maxHR, restingHR, HRR, method]);

  const results = useMemo(() => {
    if (!validAge) {
      return { value: null, label: null, subtext: "Please enter a valid age between 1 and 119.", warning: true, formulaUsed: null };
    }
    if (method === "karvonen" && !validRestingHR) {
      return { value: null, label: null, subtext: "Please enter a valid resting heart rate between 31 and 119 bpm.", warning: true, formulaUsed: null };
    }
    if (!zones) {
      return { value: null, label: null, subtext: "Insufficient data to calculate zones.", warning: true, formulaUsed: null };
    }

    return {
      value: "Target Heart Rate / RPE Zones",
      label: "Based on your inputs, here are your calculated zones:",
      subtext: null,
      warning: null,
      formulaUsed:
        method === "karvonen"
          ? "Target HR = Resting HR + % × (Max HR − Resting HR) (Karvonen Formula)"
          : "Target HR = % × Max HR (Straight % Method)",
    };
  }, [validAge, validRestingHR, zones, method]);

  const faqs = [
    {
      question: "What is the difference between the Karvonen method and the straight percentage method for calculating target heart rate zones?",
      answer:
        "The Karvonen method accounts for your resting heart rate (HRrest) and calculates target zones based on heart rate reserve (HRR), which is the difference between your maximum heart rate (MHR) and resting heart rate. This method provides a more individualized training intensity. The straight percentage method calculates target zones as a percentage of your maximum heart rate alone, which is simpler but less personalized. The Karvonen method is generally preferred for more accurate training prescriptions.",
    },
    {
      question: "How does the Rate of Perceived Exertion (RPE) scale relate to heart rate zones?",
      answer:
        "The RPE scale is a subjective measure of exercise intensity, typically ranging from 6 (no exertion) to 20 (maximal exertion). It correlates well with heart rate zones, allowing athletes to gauge their effort without a heart rate monitor. For example, an RPE of 12-14 corresponds roughly to moderate intensity (70-80% HRmax), while an RPE of 17-20 indicates very hard effort (90-100% HRmax). Combining RPE with heart rate data helps optimize training and prevent overtraining.",
    },
    {
      question: "Why is it important to know your target heart rate zones during training?",
      answer:
        "Knowing your target heart rate zones helps you train at the appropriate intensity to meet specific fitness goals, such as fat burning, endurance building, or high-intensity performance. Training within the correct zones improves cardiovascular efficiency, reduces injury risk, and ensures recovery. It also allows for better monitoring of progress and adjustment of training loads based on physiological responses.",
    },
    {
      question: "Can medications or health conditions affect heart rate zone calculations?",
      answer:
        "Yes, certain medications like beta-blockers and health conditions such as cardiovascular disease can affect your heart rate response to exercise, making standard formulas less accurate. In such cases, it is essential to consult a healthcare professional or exercise physiologist for personalized assessment and target zone determination, possibly relying more on RPE or other physiological markers.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="age" className="mb-1 flex items-center gap-1">
          Age (years) <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="age"
          type="number"
          min={1}
          max={119}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={e => handleInputChange("age", e.target.value)}
          aria-describedby="age-desc"
        />
        <p id="age-desc" className="text-sm text-slate-500 mt-1">
          Enter your age to estimate maximum heart rate.
        </p>
      </div>

      <div>
        <Label htmlFor="restingHeartRate" className="mb-1 flex items-center gap-1">
          Resting Heart Rate (bpm) <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="restingHeartRate"
          type="number"
          min={30}
          max={120}
          placeholder="e.g. 60"
          value={inputs.restingHeartRate}
          onChange={e => handleInputChange("restingHeartRate", e.target.value)}
          aria-describedby="restingHR-desc"
          disabled={inputs.method === "straight"}
        />
        <p id="restingHR-desc" className="text-sm text-slate-500 mt-1">
          Your resting heart rate is required for the Karvonen method. Disabled if using straight % method.
        </p>
      </div>

      <div>
        <Label htmlFor="method" className="mb-1 flex items-center gap-1">
          Calculation Method <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.method}
          onValueChange={v => handleInputChange("method", v)}
          id="method"
          aria-describedby="method-desc"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="karvonen">Karvonen Method (HR Reserve)</SelectItem>
            <SelectItem value="straight">Straight % of Max HR</SelectItem>
          </SelectContent>
        </Select>
        <p id="method-desc" className="text-sm text-slate-500 mt-1">
          Choose the formula to calculate your target heart rate zones.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", restingHeartRate: "", method: "karvonen" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-400 shadow-md">
          <CardContent className="p-4 text-center font-semibold">{results.subtext}</CardContent>
        </Card>
      )}

      {!results.warning && zones && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white mb-4">{results.value}</p>
            <p className="mb-6 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="italic mb-8 text-sm text-blue-700 dark:text-blue-400">{results.formulaUsed}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-blue-200 dark:bg-blue-800">
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2">Zone</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2">RPE Range</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2">Heart Rate Range (bpm)</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2">% Max HR</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-blue-50 dark:bg-slate-800" : "bg-white dark:bg-slate-900"}
                    >
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">{zone.label}</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">{zone.rpe}</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">
                        {zone.minHR} &lt;= HR &lt;= {zone.maxHR}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">
                        {zone.percentMin}% - {zone.percentMax}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Target Heart Rate / RPE Zones
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Target heart rate zones are ranges of heartbeats per minute that correspond to different levels of exercise intensity.
          These zones help athletes and fitness enthusiasts train effectively by aligning their cardiovascular effort with specific fitness goals,
          such as fat burning, endurance improvement, or high-intensity performance. The zones are typically expressed as percentages of your maximum heart rate (MHR),
          which is the highest number of beats your heart can achieve during maximal exertion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Rate of Perceived Exertion (RPE) scale is a subjective measure of how hard you feel you are working during exercise,
          usually ranging from 6 (no exertion) to 20 (maximal exertion). RPE correlates well with heart rate zones, allowing you to gauge your effort without a heart rate monitor.
          Combining heart rate data with RPE provides a comprehensive understanding of your training intensity, helping to optimize workouts and prevent overtraining.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          There are different methods to calculate your target heart rate zones. The Karvonen method uses your resting heart rate to personalize zones based on your heart rate reserve,
          which is the difference between your maximum and resting heart rates. Alternatively, the straight percentage method calculates zones as a simple percentage of your maximum heart rate.
          Understanding these methods and how to apply them ensures you train safely and effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurately identifying your target zones allows you to tailor your training sessions to your fitness level and goals,
          improving cardiovascular health, endurance, and performance while minimizing injury risk.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, start by entering your age, which is essential for estimating your maximum heart rate using the Tanaka formula (208 − 0.7 × age).
          Then, input your resting heart rate if you choose the Karvonen method, which personalizes your target zones based on your heart rate reserve.
          If you prefer a simpler approach, select the straight percentage method, which calculates zones as percentages of your maximum heart rate alone.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your data and selecting the calculation method, click the Calculate button to generate your target heart rate zones.
          The results will display five zones, each with a corresponding RPE range, heart rate range in beats per minute, and percentage of your maximum heart rate.
          These zones help you understand the intensity levels for different training purposes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use the zones as a guide during your workouts by monitoring your heart rate with a wearable device or by assessing your perceived exertion.
          Training within the appropriate zone ensures you are working at the right intensity to meet your fitness goals, whether it is recovery, endurance, or high-intensity training.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember to reset the inputs if you want to calculate zones for a different individual or to adjust your data as your fitness level changes over time.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
          <li>Step 1: Enter your age in years.</li>
          <li>Step 2: Enter your resting heart rate (required for Karvonen method).</li>
          <li>Step 3: Select the calculation method (Karvonen or Straight %).</li>
          <li>Step 4: Click Calculate to view your target heart rate and RPE zones.</li>
          <li>Step 5: Use the zones to guide your training intensity.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training with heart rate zones, it is important to warm up properly to gradually increase your heart rate and prepare your body for exercise.
          Start your session in Zone 1 or 2 to promote blood flow and reduce injury risk. Use Zone 3 for building aerobic endurance and improving cardiovascular fitness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate intervals in Zones 4 and 5 to enhance anaerobic capacity, speed, and power. These high-intensity efforts should be balanced with adequate recovery periods to avoid overtraining.
          Monitoring your RPE alongside heart rate can help you adjust intensity on days when external factors like fatigue or heat affect your performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistency is key: regularly training within your target zones will improve your fitness over time.
          Periodically reassess your resting heart rate and maximum heart rate to update your zones as your fitness level changes.
          Always listen to your body and consult a healthcare professional if you experience unusual symptoms during exercise.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, combine heart rate zone training with other metrics like power output, pace, or perceived exertion for a holistic approach to performance optimization.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Tanaka, Monahan & Seals (2001) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This study proposes the Tanaka formula for estimating maximum heart rate, which is more accurate across adult ages than the traditional 220-age formula.
            </p>
          </li>
          <li>
            <a
              href="https://www.verywellfit.com/karvonen-formula-3120081"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Verywell Fit: Karvonen Formula Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed explanation of the Karvonen method for calculating target heart rate zones using heart rate reserve and resting heart rate.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/heartrate.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC: Measuring Heart Rate <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines on how to measure heart rate and use heart rate zones for safe and effective physical activity.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Target Heart Rate / RPE Zones"
      description="Match heart rate to Perceived Exertion (RPE). Align subjective training intensity with objective heart rate data."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "Karvonen: Target HR = Resting HR + % × (Max HR − Resting HR)\nStraight %: Target HR = % × Max HR\nMax HR (Tanaka): 208 − 0.7 × Age",
        variables: [
          { symbol: "HRrest", description: "Resting Heart Rate (bpm)" },
          { symbol: "MHR", description: "Maximum Heart Rate (bpm)" },
          { symbol: "HRR", description: "Heart Rate Reserve (MHR − HRrest)" },
          { symbol: "%", description: "Percentage of HRR or MHR depending on method" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old athlete with a resting heart rate of 60 bpm wants to calculate target heart rate zones using the Karvonen method.",
        steps: [
          { label: "Step 1", explanation: "Calculate Max HR: 208 − 0.7 × 30 = 187 bpm." },
          { label: "Step 2", explanation: "Calculate HRR: 187 − 60 = 127 bpm." },
          {
            label: "Step 3",
            explanation:
              "Calculate Zone 2 lower limit: 60 + 0.6 × 127 = 136 bpm; upper limit: 60 + 0.7 × 127 = 149 bpm.",
          },
          {
            label: "Step 4",
            explanation:
              "Repeat for other zones to get full range of target heart rates corresponding to RPE zones.",
          },
        ],
        result:
          "Zone 2 target heart rate range is approximately 136 to 149 bpm, corresponding to an RPE of 11-12 (light effort).",
      }}
      relatedCalculators={[
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏆" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
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