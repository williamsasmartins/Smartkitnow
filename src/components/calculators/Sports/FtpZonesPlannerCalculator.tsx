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

export default function FtpZonesPlannerCalculator() {
  const [inputs, setInputs] = useState({ ftp: "", unit: "watts" });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // FTP Zones definitions based on %FTP (classic 7-zone model)
  // Source: Allen & Coggan, 2019; NSCA guidelines
  const ftpZones = useMemo(() => {
    if (!inputs.ftp || isNaN(Number(inputs.ftp)) || Number(inputs.ftp) <= 0) return null;
    const ftp = Number(inputs.ftp);

    // Zones with %FTP ranges and descriptions
    // Zone 1: Active Recovery < 55%
    // Zone 2: Endurance 56-75%
    // Zone 3: Tempo 76-90%
    // Zone 4: Lactate Threshold 91-105%
    // Zone 5: VO2 Max 106-120%
    // Zone 6: Anaerobic Capacity 121-150%
    // Zone 7: Neuromuscular Power > 150%

    return [
      {
        zone: 1,
        name: "Active Recovery",
        range: `&lt; 55% FTP`,
        powerLow: 0,
        powerHigh: Math.round(ftp * 0.55),
        description:
          "Very easy effort, used for recovery rides and warm-ups. Helps promote blood flow without causing fatigue.",
      },
      {
        zone: 2,
        name: "Endurance",
        range: "56% - 75% FTP",
        powerLow: Math.round(ftp * 0.56),
        powerHigh: Math.round(ftp * 0.75),
        description:
          "Steady aerobic pace that can be sustained for hours. Builds aerobic base and fat metabolism efficiency.",
      },
      {
        zone: 3,
        name: "Tempo",
        range: "76% - 90% FTP",
        powerLow: Math.round(ftp * 0.76),
        powerHigh: Math.round(ftp * 0.90),
        description:
          "Moderate to hard effort, sustainable for long durations. Improves muscular endurance and aerobic capacity.",
      },
      {
        zone: 4,
        name: "Lactate Threshold",
        range: "91% - 105% FTP",
        powerLow: Math.round(ftp * 0.91),
        powerHigh: Math.round(ftp * 1.05),
        description:
          "Hard effort near maximal sustainable pace. Enhances ability to clear lactate and sustain high intensity.",
      },
      {
        zone: 5,
        name: "VO2 Max",
        range: "106% - 120% FTP",
        powerLow: Math.round(ftp * 1.06),
        powerHigh: Math.round(ftp * 1.20),
        description:
          "Very hard effort improving maximal oxygen uptake. Typically intervals lasting 3-8 minutes.",
      },
      {
        zone: 6,
        name: "Anaerobic Capacity",
        range: "121% - 150% FTP",
        powerLow: Math.round(ftp * 1.21),
        powerHigh: Math.round(ftp * 1.50),
        description:
          "Short, intense efforts that improve anaerobic energy systems and sprint capacity.",
      },
      {
        zone: 7,
        name: "Neuromuscular Power",
        range: "&gt; 150% FTP",
        powerLow: Math.round(ftp * 1.51),
        powerHigh: null,
        description:
          "Maximum sprint efforts lasting a few seconds. Develops explosive power and neuromuscular coordination.",
      },
    ];
  }, [inputs.ftp]);

  const results = useMemo(() => {
    if (!ftpZones) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: inputs.ftp && isNaN(Number(inputs.ftp)) ? "Please enter a valid number for FTP." : null,
        formulaUsed: null,
      };
    }
    return {
      value: null,
      label: null,
      subtext: null,
      warning: null,
      formulaUsed:
        "Zone power ranges are calculated as percentages of your FTP value: PowerZone = FTP × %FTP range.",
    };
  }, [ftpZones, inputs.ftp]);

  const faqs = [
    {
      question: "What is Functional Threshold Power (FTP)?",
      answer:
        "Functional Threshold Power (FTP) is the highest average power a cyclist can sustain for approximately one hour, measured in watts. It is widely used to set training zones and monitor cycling performance. FTP helps athletes tailor workouts to specific intensity levels for optimal training adaptations.",
    },
    {
      question: "How often should I test my FTP?",
      answer:
        "It is recommended to test your FTP every 6 to 8 weeks to track fitness improvements and adjust training zones accordingly. Testing can be done via structured FTP tests such as a 20-minute maximal effort or ramp test. Regular testing ensures your training zones remain accurate and effective.",
    },
    {
      question: "Can I use this calculator if I don’t know my FTP?",
      answer:
        "This calculator requires an FTP value to generate accurate power zones. If you don’t know your FTP, consider performing an FTP test or estimating it using recent ride data from platforms like Strava or TrainingPeaks. Accurate FTP is essential for effective training zone planning.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="ftp" className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Gauge className="w-5 h-5 text-blue-600" />
            Enter Your FTP (Functional Threshold Power)
          </Label>
          <Input
            id="ftp"
            type="number"
            min="1"
            step="1"
            placeholder="e.g., 250"
            value={inputs.ftp}
            onChange={(e) => handleInputChange("ftp", e.target.value)}
            aria-describedby="ftpHelp"
          />
          <p id="ftpHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your FTP in watts to calculate your training power zones.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate FTP Zones"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" />
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ ftp: "", unit: "watts" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {ftpZones && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent>
            <h3 className="text-center text-2xl font-bold mb-6 text-blue-900 dark:text-white">
              FTP Power Zones (Watts)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ftpZones.map(({ zone, name, range, powerLow, powerHigh, description }) => (
                <div
                  key={zone}
                  className="border border-blue-300 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm"
                  aria-label={`Zone ${zone}: ${name}`}
                >
                  <h4 className="font-semibold text-lg text-blue-700 dark:text-blue-400 mb-1">
                    Zone {zone}: {name}
                  </h4>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Power Range:{" "}
                    {powerHigh
                      ? `${powerLow} W - ${powerHigh} W`
                      : `${powerLow} W &amp; above`}
                    {" "}({range})
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">{description}</p>
                </div>
              ))}
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
          Understanding FTP (Functional Threshold Power) Zones Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Functional Threshold Power (FTP) is a cornerstone metric in cycling performance, representing the highest power output a cyclist can sustain for approximately one hour. This planner helps you translate your FTP value into structured training zones, enabling targeted workouts that optimize endurance, strength, and speed. By training within these zones, athletes can systematically improve their aerobic capacity, lactate threshold, and anaerobic power. Understanding and utilizing FTP zones is essential for effective cycling training and performance progression.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this FTP Zones Planner, simply enter your current FTP value in watts. If you do not know your FTP, consider performing an FTP test or estimating it from recent ride data. Once entered, the calculator will display your personalized power zones based on scientifically validated percentages of your FTP. These zones can then be used to guide your training intensity for various workouts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Step 1: Enter your FTP value in watts into the input field.
          </li>
          <li>
            Step 2: Click the &quot;Calculate&quot; button to generate your power zones.
          </li>
          <li>
            Step 3: Review the power ranges and descriptions for each zone to plan your training sessions.
          </li>
          <li>
            Step 4: Use these zones to structure workouts targeting endurance, threshold, VO2 max, and sprint efforts.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training within your FTP zones allows you to target specific physiological adaptations. For example, spending time in Zone 2 (Endurance) enhances fat metabolism and aerobic efficiency, while Zone 4 (Lactate Threshold) workouts improve your ability to sustain high-intensity efforts. It is important to balance training volume and intensity, ensuring adequate recovery especially after high-intensity intervals &gt; 105% FTP. Regularly updating your FTP value ensures your zones remain accurate as your fitness evolves.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, FTP testing, and power zones, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines.
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
              Authoritative resource on strength and conditioning principles, including endurance training methodologies.
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
              Practical guide on FTP testing protocols and training zone applications.
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
        title: "Formula",
        formula: "Power Zone = FTP × %FTP Range",
        variables: [
          { symbol: "FTP", description: "Functional Threshold Power in watts" },
          { symbol: "%FTP Range", description: "Percentage range defining each training zone" },
          { symbol: "Power Zone", description: "Power output range in watts for the zone" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A cyclist has an FTP of 250 watts and wants to determine their training zones to plan workouts effectively.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter the FTP value of 250 watts into the calculator input field and click Calculate.",
          },
          {
            label: "Step 2",
            explanation:
              "Review the generated power zones, such as Zone 2 (Endurance) ranging from 140 W to 188 W (56% - 75% of FTP).",
          },
          {
            label: "Step 3",
            explanation:
              "Use these zones to structure training sessions, for example, performing long endurance rides in Zone 2 and threshold intervals in Zone 4.",
          },
        ],
        result:
          "The cyclist now has clear power targets for each training zone, enabling precise and effective workout planning.",
      }}
      relatedCalculators={[
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏋️" },
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