import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TargetHeartRateRpeZonesCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    restingHeartRate: "",
    maxHeartRateMethod: "ageBased",
    rpe: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate Max Heart Rate based on selected method
  const maxHeartRate = useMemo(() => {
    const ageNum = Number(inputs.age);
    if (!ageNum || ageNum <= 0) return null;

    switch (inputs.maxHeartRateMethod) {
      case "ageBased":
        // Traditional formula: 220 - age
        return 220 - ageNum;
      case "tanaka":
        // Tanaka formula: 208 - 0.7 * age
        return 208 - 0.7 * ageNum;
      case "gellish":
        // Gellish formula: 207 - 0.7 * age
        return 207 - 0.7 * ageNum;
      default:
        return 220 - ageNum;
    }
  }, [inputs.age, inputs.maxHeartRateMethod]);

  // Calculate Heart Rate Reserve (HRR)
  const heartRateReserve = useMemo(() => {
    const rhr = Number(inputs.restingHeartRate);
    if (!maxHeartRate || !rhr || rhr <= 0) return null;
    if (rhr >= maxHeartRate) return null;
    return maxHeartRate - rhr;
  }, [maxHeartRate, inputs.restingHeartRate]);

  // Calculate Target Heart Rate Zones based on HRR and RPE
  // RPE zones mapped to %HRR ranges (approximate)
  // RPE 6-7: 50-60% HRR (Light)
  // RPE 8-9: 60-70% HRR (Moderate)
  // RPE 10-11: 70-80% HRR (Hard)
  // RPE 12-13: 80-90% HRR (Very Hard)
  // RPE 14-15: 90-100% HRR (Max Effort)
  // Source: Borg Scale and ACSM guidelines

  const rpeZones = useMemo(() => {
    if (!heartRateReserve || !maxHeartRate) return null;

    // Define zones with RPE ranges and %HRR ranges
    const zones = [
      {
        label: "Light",
        rpeRange: "6-7",
        hrrPercentRange: [0.50, 0.60],
      },
      {
        label: "Moderate",
        rpeRange: "8-9",
        hrrPercentRange: [0.60, 0.70],
      },
      {
        label: "Hard",
        rpeRange: "10-11",
        hrrPercentRange: [0.70, 0.80],
      },
      {
        label: "Very Hard",
        rpeRange: "12-13",
        hrrPercentRange: [0.80, 0.90],
      },
      {
        label: "Max Effort",
        rpeRange: "14-15",
        hrrPercentRange: [0.90, 1.00],
      },
    ];

    // Calculate target HR ranges for each zone
    const zonesWithHR = zones.map((zone) => {
      const lower = Math.round(heartRateReserve * zone.hrrPercentRange[0] + Number(inputs.restingHeartRate));
      const upper = Math.round(heartRateReserve * zone.hrrPercentRange[1] + Number(inputs.restingHeartRate));
      return {
        ...zone,
        targetHRRange: [lower, upper],
      };
    });

    return zonesWithHR;
  }, [heartRateReserve, maxHeartRate, inputs.restingHeartRate]);

  // Calculate target heart rate for specific RPE input if valid
  const targetHeartRateForRPE = useMemo(() => {
    const rpeNum = Number(inputs.rpe);
    if (!heartRateReserve || !maxHeartRate) return null;
    if (!rpeNum || rpeNum < 6 || rpeNum > 15) return null;

    // Map RPE 6-15 linearly to 50%-100% HRR
    // %HRR = 0.50 + ((RPE - 6) / 9) * 0.50
    const percentHRR = 0.5 + ((rpeNum - 6) / 9) * 0.5;
    const targetHR = Math.round(heartRateReserve * percentHRR + Number(inputs.restingHeartRate));
    return targetHR;
  }, [inputs.rpe, heartRateReserve, maxHeartRate, inputs.restingHeartRate]);

  // Validation and warnings
  const warnings = useMemo(() => {
    const w = [];
    const ageNum = Number(inputs.age);
    const rhrNum = Number(inputs.restingHeartRate);
    const rpeNum = Number(inputs.rpe);

    if (inputs.age && (ageNum < 10 || ageNum > 100)) {
      w.push("Age should be between 10 and 100 years for accurate calculations.");
    }
    if (inputs.restingHeartRate && (rhrNum < 30 || rhrNum > 100)) {
      w.push("Resting Heart Rate should be between 30 and 100 bpm.");
    }
    if (inputs.rpe && (rpeNum < 6 || rpeNum > 15)) {
      w.push("RPE should be between 6 and 15 according to the Borg scale.");
    }
    if (heartRateReserve !== null && heartRateReserve <= 0) {
      w.push("Resting Heart Rate must be less than Max Heart Rate.");
    }
    return w.length > 0 ? w : null;
  }, [inputs.age, inputs.restingHeartRate, inputs.rpe, heartRateReserve]);

  // FAQ content
  const faqs = [
    {
      question: "What is the Target Heart Rate and why is it important?",
      answer:
        "Target Heart Rate (THR) represents the ideal heart rate range during exercise to achieve specific training goals such as fat burning, endurance, or high-intensity performance. Training within your THR zones ensures you are exercising at an intensity that is safe and effective, optimizing cardiovascular benefits without overexertion. It helps athletes and fitness enthusiasts monitor and adjust their effort levels accurately.",
    },
    {
      question: "How does Rate of Perceived Exertion (RPE) relate to heart rate zones?",
      answer:
        "RPE is a subjective measure of exercise intensity based on how hard you feel your body is working, typically rated on a scale from 6 to 20 or 0 to 10. This calculator aligns RPE values with objective heart rate zones, allowing users to correlate their perceived effort with physiological data. This dual approach helps in self-regulating training intensity, especially when heart rate monitors are unavailable or unreliable.",
    },
    {
      question: "Why do different formulas exist for calculating Max Heart Rate?",
      answer:
        "Max Heart Rate (MHR) varies individually and can be estimated using different formulas based on population studies. The traditional formula (220 - age) is widely used but can be less accurate for some individuals. Alternatives like the Tanaka or Gellish formulas provide refined estimates based on more recent research. Selecting the appropriate formula can improve the accuracy of heart rate zone calculations.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="mb-1 flex items-center gap-1">
            Age (years) <Info className="w-4 h-4 text-blue-500" />
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={100}
            placeholder="e.g. 30"
            value={inputs.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="restingHeartRate" className="mb-1 flex items-center gap-1">
            Resting Heart Rate (bpm) <Heart className="w-4 h-4 text-red-500" />
          </Label>
          <Input
            id="restingHeartRate"
            type="number"
            min={30}
            max={100}
            placeholder="e.g. 60"
            value={inputs.restingHeartRate}
            onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="maxHeartRateMethod" className="mb-1 flex items-center gap-1">
            Max Heart Rate Formula <Calculator className="w-4 h-4 text-green-600" />
          </Label>
          <Select
            value={inputs.maxHeartRateMethod}
            onValueChange={(v) => handleInputChange("maxHeartRateMethod", v)}
          >
            <SelectTrigger id="maxHeartRateMethod" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ageBased">220 - Age (Traditional)</SelectItem>
              <SelectItem value="tanaka">208 - 0.7 × Age (Tanaka)</SelectItem>
              <SelectItem value="gellish">207 - 0.7 × Age (Gellish)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rpe" className="mb-1 flex items-center gap-1">
            Rate of Perceived Exertion (RPE) <Flame className="w-4 h-4 text-orange-500" />
          </Label>
          <Input
            id="rpe"
            type="number"
            min={6}
            max={15}
            placeholder="6 to 15"
            value={inputs.rpe}
            onChange={(e) => handleInputChange("rpe", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo handles updates
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              restingHeartRate: "",
              maxHeartRateMethod: "ageBased",
              rpe: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {warnings && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border rounded-md p-4">
          <CardContent>
            <AlertTriangle className="inline-block mr-2 text-yellow-700 dark:text-yellow-400" />
            <ul className="list-disc list-inside text-yellow-800 dark:text-yellow-300">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {maxHeartRate && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-blue-900 dark:text-white mb-2">Estimated Max Heart Rate</p>
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{Math.round(maxHeartRate)} bpm</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 italic">
              Formula used:{" "}
              {inputs.maxHeartRateMethod === "ageBased"
                ? "220 - Age"
                : inputs.maxHeartRateMethod === "tanaka"
                ? "208 - 0.7 × Age"
                : "207 - 0.7 × Age"}
            </p>
          </CardContent>
        </Card>
      )}

      {rpeZones && (
        <Card className="border border-slate-300 dark:border-slate-700 rounded-md p-6">
          <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Target Heart Rate Zones (Based on HRR)
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                <th className="py-2 px-3">Zone</th>
                <th className="py-2 px-3">RPE Range</th>
                <th className="py-2 px-3">Target Heart Rate (bpm)</th>
              </tr>
            </thead>
            <tbody>
              {rpeZones.map((zone, i) => (
                <tr
                  key={i}
                  className="odd:bg-slate-100 dark:odd:bg-slate-800 even:bg-transparent dark:even:bg-transparent"
                >
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{zone.label}</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{zone.rpeRange}</td>
                  <td className="py-2 px-3 text-slate-900 dark:text-slate-200">
                    {zone.targetHRRange[0]} - {zone.targetHRRange[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-400">
            Note: Target heart rate zones are calculated using the Heart Rate Reserve (HRR) method, which accounts for resting heart rate for more individualized training zones.
          </p>
        </Card>
      )}

      {targetHeartRateForRPE && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 border-green-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-green-900 dark:text-white mb-2">
              Target Heart Rate for RPE {inputs.rpe}
            </p>
            <p className="text-5xl font-extrabold text-green-900 dark:text-white">{targetHeartRateForRPE} bpm</p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1 italic">
              Estimated from RPE to %HRR linear mapping.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Target Heart Rate / RPE Zones</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Target Heart Rate (THR) zones are specific ranges of heartbeats per minute that correspond to different exercise intensities. These zones help athletes and fitness enthusiasts train effectively by aligning cardiovascular effort with desired outcomes such as fat burning, endurance building, or peak performance. The Rate of Perceived Exertion (RPE) scale complements heart rate data by providing a subjective measure of how hard an individual feels they are working, allowing for a holistic approach to training intensity. By combining objective heart rate zones with subjective RPE, users can better tailor their workouts to their fitness levels and goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Heart Rate Reserve (HRR) method, used in this calculator, adjusts target zones based on resting heart rate, offering a more personalized and accurate reflection of cardiovascular capacity than simple percentage of maximum heart rate. Different formulas exist to estimate maximum heart rate, reflecting variations in population data and individual physiology. Understanding these concepts empowers users to train smarter, avoid overtraining, and maximize performance gains.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, input your age and resting heart rate, then select the formula you prefer for estimating your maximum heart rate. Optionally, enter your current Rate of Perceived Exertion (RPE) to find the corresponding target heart rate. The calculator will display your estimated maximum heart rate, heart rate reserve, and detailed target heart rate zones aligned with RPE ranges. These zones help you understand the intensity levels appropriate for different training goals.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years. This is essential for estimating your maximum heart rate using validated formulas.
          </li>
          <li>
            <strong>Step 2:</strong> Input your resting heart rate, ideally measured first thing in the morning for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the maximum heart rate formula that best suits your needs or preference.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, enter your current RPE to see the target heart rate corresponding to your perceived effort.
          </li>
          <li>
            <strong>Step 5:</strong> Review the calculated target heart rate zones and use them to guide your training intensity.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training within your target heart rate zones ensures that you are exercising at an intensity that matches your fitness goals, whether it is fat burning, aerobic endurance, or high-intensity interval training. Use the RPE scale alongside heart rate data to listen to your body and adjust effort accordingly, especially when external factors like heat, fatigue, or hydration affect your performance. Consistent monitoring and gradual progression through zones can help prevent overtraining and reduce injury risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember to warm up and cool down properly, and consider periodic re-assessment of your resting heart rate and maximum heart rate estimates as your fitness improves. Combining objective data with subjective feedback creates a balanced and effective training regimen.
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
          For more information on training science and rules, consult the following sources:
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
              Global leader in sports medicine and exercise science research.
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
              Authoritative source for strength and conditioning standards and education.
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
              Provides guidelines on athlete monitoring and performance metrics in football.
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
          "Max Heart Rate (MHR) = 220 - Age (Traditional) OR 208 - 0.7 × Age (Tanaka) OR 207 - 0.7 × Age (Gellish)\n" +
          "Heart Rate Reserve (HRR) = MHR - Resting Heart Rate\n" +
          "Target HR = Resting Heart Rate + (%HRR × HRR)\n" +
          "RPE mapped linearly from 6 (50% HRR) to 15 (100% HRR)",
        variables: [
          { symbol: "MHR", description: "Maximum Heart Rate (beats per minute)" },
          { symbol: "HRR", description: "Heart Rate Reserve (beats per minute)" },
          { symbol: "RPE", description: "Rate of Perceived Exertion (6-15 scale)" },
          { symbol: "%HRR", description: "Percentage of Heart Rate Reserve" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old athlete with a resting heart rate of 60 bpm wants to train in the 'Hard' zone and knows their RPE is about 11.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate Max Heart Rate using the traditional formula: 220 - 30 = 190 bpm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate Heart Rate Reserve: 190 - 60 = 130 bpm.",
          },
          {
            label: "Step 3",
            explanation:
              "Determine target heart rate range for 'Hard' zone (70-80% HRR): 60 + (0.70 × 130) = 151 bpm to 60 + (0.80 × 130) = 164 bpm.",
          },
          {
            label: "Step 4",
            explanation:
              "For RPE 11, estimate target heart rate: linear mapping gives approximately 75% HRR, so target HR ≈ 60 + (0.75 × 130) = 158 bpm.",
          },
        ],
        result: "The athlete should aim to keep their heart rate between 151 and 164 bpm during training, with a target around 158 bpm for RPE 11.",
      }}
      relatedCalculators={[
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
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