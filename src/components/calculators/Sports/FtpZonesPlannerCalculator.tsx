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

const FTP_ZONES = [
  { label: "Zone 1: Active Recovery", min: 0, max: 0.55 },
  { label: "Zone 2: Endurance", min: 0.56, max: 0.75 },
  { label: "Zone 3: Tempo", min: 0.76, max: 0.90 },
  { label: "Zone 4: Lactate Threshold", min: 0.91, max: 1.05 },
  { label: "Zone 5: VO2 Max", min: 1.06, max: 1.20 },
  { label: "Zone 6: Anaerobic Capacity", min: 1.21, max: 1.50 },
  { label: "Zone 7: Neuromuscular Power", min: 1.51, max: Infinity },
];

export default function FtpZonesPlannerCalculator() {
  const [inputs, setInputs] = useState({ ftp: "" });
  const [calculatedZones, setCalculatedZones] = useState(null);
  const [warning, setWarning] = useState(null);

  const handleInputChange = useCallback((n, v) => {
    if (n === "ftp") {
      // Accept only numbers and decimals
      if (v === "" || /^[0-9]*\.?[0-9]*$/.test(v)) {
        setInputs((p) => ({ ...p, [n]: v }));
      }
    } else {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  const calculateZones = useCallback(() => {
    const ftpValue = parseFloat(inputs.ftp);
    if (isNaN(ftpValue) || ftpValue <= 0) {
      setWarning("Please enter a valid FTP value greater than zero.");
      setCalculatedZones(null);
      return;
    }
    setWarning(null);

    // Calculate power zones based on FTP
    const zones = FTP_ZONES.map((zone) => {
      const minPower = +(ftpValue * zone.min).toFixed(1);
      const maxPower = zone.max === Infinity ? "and above" : +(ftpValue * zone.max).toFixed(1);
      return {
        label: zone.label,
        minPower,
        maxPower,
      };
    });
    setCalculatedZones(zones);
  }, [inputs.ftp]);

  const faqs = [
    {
      question: "What is Functional Threshold Power (FTP)?",
      answer:
        "Functional Threshold Power (FTP) is the highest average power output a cyclist can sustain for approximately one hour, measured in watts. It serves as a benchmark for training intensity and helps define training zones for structured workouts.",
    },
    {
      question: "How often should I test my FTP?",
      answer:
        "It is recommended to test your FTP every 6 to 8 weeks to track fitness progress and adjust training zones accordingly. Consistent testing ensures your training remains effective and tailored to your current fitness level.",
    },
    {
      question: "Can I use this calculator without an FTP test?",
      answer:
        "While you can estimate FTP using various field tests or power meter data, an accurate FTP test is essential for precise zone calculations. Using estimated FTP values may lead to less effective training prescriptions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="ftp" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Gauge className="w-5 h-5 text-blue-600" /> Enter Your FTP (Watts)
        </Label>
        <Input
          id="ftp"
          type="text"
          placeholder="e.g., 250"
          value={inputs.ftp}
          onChange={(e) => handleInputChange("ftp", e.target.value)}
          aria-describedby="ftp-help"
          className="max-w-xs"
        />
        <p id="ftp-help" className="text-xs text-slate-500 mt-1">
          Your Functional Threshold Power in watts (W).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={calculateZones}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate FTP Zones"
        >
          <Calculator className="mr-2 h-5 w-5" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ ftp: "" });
            setCalculatedZones(null);
            setWarning(null);
          }}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </div>

      {warning && (
        <div className="text-red-600 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {warning}
        </div>
      )}

      {calculatedZones && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-white text-center">
              FTP Power Zones (Watts)
            </h3>
            <ul className="divide-y divide-blue-200 dark:divide-slate-700">
              {calculatedZones.map((zone, i) => (
                <li key={i} className="py-2 flex justify-between text-blue-900 dark:text-white font-medium">
                  <span>{zone.label}</span>
                  <span>
                    {zone.minPower} - {zone.maxPower}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-center text-slate-700 dark:text-slate-300 italic">
              Zones are calculated as percentages of your FTP value.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding FTP (Functional Threshold Power) Zones Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Functional Threshold Power (FTP) is a critical metric in cycling performance, representing the maximum power a cyclist can sustain for about one hour without fatigue. It is widely used by coaches and athletes to tailor training programs, monitor progress, and optimize race strategies. FTP zones break down training intensities into specific ranges, each targeting different physiological adaptations such as endurance, lactate threshold, and anaerobic capacity. By planning workouts around these zones, cyclists can train more effectively and efficiently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The FTP Zones Planner calculates power ranges based on your FTP value, allowing you to identify the appropriate intensity for each training zone. These zones are standardized in the cycling community and supported by scientific research, ensuring your training is aligned with best practices. Understanding and applying these zones can significantly enhance your training outcomes and help prevent overtraining or injury.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this FTP Zones Planner, you need to input your current Functional Threshold Power (FTP) in watts. This value can be obtained from a formal FTP test or estimated from recent ride data using a power meter. Once entered, click "Calculate" to generate your personalized power zones. These zones will guide your training intensities for various workouts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Perform an FTP test or obtain your current FTP value from your cycling software or power meter.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your FTP value in watts into the input field.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see your FTP power zones.
          </li>
          <li>
            <strong>Step 4:</strong> Use these zones to structure your training sessions, focusing on the desired physiological adaptations.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training within specific FTP zones allows cyclists to target distinct energy systems and physiological adaptations. For example, spending time in Zone 2 (Endurance) builds aerobic capacity and fat metabolism, while Zone 4 (Lactate Threshold) improves your ability to sustain high-intensity efforts. It is important to balance training across zones to avoid overtraining and maximize performance gains. Incorporate recovery days and regularly retest your FTP to adjust zones as your fitness evolves.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, consider periodizing your training by focusing on different zones during base, build, and peak phases. Use power meters and heart rate monitors in conjunction with FTP zones for more precise control. Remember, consistency and gradual progression are key to long-term success in cycling performance.
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
          For more information on training science, FTP testing, and power zone methodologies, consult the following authoritative sources:
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
              href="https://www.trainingpeaks.com/blog/ftp-what-it-is-and-how-to-test-it/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              TrainingPeaks: FTP - What It Is and How to Test It <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              TrainingPeaks offers expert insights into FTP testing protocols and how to use FTP for structured training.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/education/articles/kinetic-select/functional-threshold-power-and-training-zones/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NSCA: Functional Threshold Power and Training Zones <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The National Strength and Conditioning Association provides scientific analysis on FTP and its application in training zone development.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="FTP (Functional Threshold Power) Zones Planner"
      description="Plan your cycling training zones. Calculate power zones based on your Functional Threshold Power (FTP) for structured workouts."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "FTP Zone Calculation Formula",
        formula: "Zone Power Range = FTP × Zone Percentage Range",
        variables: [
          { symbol: "FTP", description: "Functional Threshold Power in watts" },
          { symbol: "Zone Percentage Range", description: "Lower and upper bounds of each training zone as a decimal" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A cyclist has an FTP of 250 watts and wants to determine their training zones to structure workouts effectively.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the FTP value of 250 watts into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to generate the power zones based on standard FTP percentages.",
          },
          {
            label: "Step 3",
            explanation:
              "Review the zones, for example, Zone 2 (Endurance) will be 140 to 188 watts (56% to 75% of FTP).",
          },
          {
            label: "Step 4",
            explanation:
              "Use these zones to guide training intensity during rides and workouts.",
          },
        ],
        result:
          "The cyclist now has clear power ranges for each training zone, enabling targeted and effective training sessions.",
      }}
      relatedCalculators={[
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
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