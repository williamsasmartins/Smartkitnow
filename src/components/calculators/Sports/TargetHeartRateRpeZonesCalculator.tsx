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
    rpe: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculates target heart rate zones using the Karvonen formula:
   * Target HR = ((Max HR − Resting HR) × %Intensity) + Resting HR
   * Max HR estimated as 220 - age.
   * RPE zones mapped to %HRmax ranges based on ACSM guidelines.
   */
  const results = useMemo(() => {
    const age = Number(inputs.age);
    const restingHR = Number(inputs.restingHeartRate);
    const rpe = Number(inputs.rpe);

    if (!age || age < 10 || age > 100) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid age between 10 and 100.",
        warning: "Invalid age input.",
        formulaUsed: null,
      };
    }
    if (!restingHR || restingHR < 30 || restingHR > 100) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid resting heart rate between 30 and 100 bpm.",
        warning: "Invalid resting heart rate input.",
        formulaUsed: null,
      };
    }
    if (!rpe || rpe < 6 || rpe > 20) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid RPE between 6 and 20.",
        warning: "Invalid RPE input.",
        formulaUsed: null,
      };
    }

    // Max HR estimate
    const maxHR = 220 - age;

    // RPE to %HRmax mapping based on Borg scale and ACSM guidelines:
    // RPE 6-11: Light intensity (50-60% HRmax)
    // RPE 12-13: Moderate intensity (60-70% HRmax)
    // RPE 14-16: Hard intensity (70-85% HRmax)
    // RPE 17-20: Very hard to maximal (85-95% HRmax)
    let intensityMin, intensityMax, zoneLabel;

    if (rpe >= 6 && rpe <= 11) {
      intensityMin = 0.50;
      intensityMax = 0.60;
      zoneLabel = "Light Intensity Zone";
    } else if (rpe >= 12 && rpe <= 13) {
      intensityMin = 0.60;
      intensityMax = 0.70;
      zoneLabel = "Moderate Intensity Zone";
    } else if (rpe >= 14 && rpe <= 16) {
      intensityMin = 0.70;
      intensityMax = 0.85;
      zoneLabel = "Hard Intensity Zone";
    } else if (rpe >= 17 && rpe <= 20) {
      intensityMin = 0.85;
      intensityMax = 0.95;
      zoneLabel = "Very Hard to Maximal Intensity Zone";
    } else {
      return {
        value: null,
        label: null,
        subtext: "RPE value out of expected range.",
        warning: "Invalid RPE input.",
        formulaUsed: null,
      };
    }

    // Karvonen formula for target HR range
    const targetHRMin = Math.round(((maxHR - restingHR) * intensityMin) + restingHR);
    const targetHRMax = Math.round(((maxHR - restingHR) * intensityMax) + restingHR);

    return {
      value: `${targetHRMin} - ${targetHRMax} bpm`,
      label: zoneLabel,
      subtext: `Based on your age (${age}), resting HR (${restingHR} bpm), and RPE (${rpe}), your target heart rate zone is estimated.`,
      warning: null,
      formulaUsed: `Target HR = ((220 - Age - Resting HR) × Intensity) + Resting HR`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between Target Heart Rate and RPE?",
      answer:
        "Target Heart Rate (THR) is an objective measure of exercise intensity based on heartbeats per minute, while Rate of Perceived Exertion (RPE) is a subjective scale that reflects how hard you feel you are working during exercise. Combining both allows athletes to align physiological data with personal effort perception for optimized training.",
    },
    {
      question: "Why do I need to input my resting heart rate?",
      answer:
        "Resting heart rate is crucial for calculating your heart rate reserve, which personalizes your target heart rate zones more accurately than using maximum heart rate alone. This accounts for individual cardiovascular fitness and improves training precision.",
    },
    {
      question: "How accurate is the 220 - age formula for max heart rate?",
      answer:
        "The 220 - age formula is a widely used estimate but can vary significantly between individuals. For more precise max heart rate, clinical testing or wearable device data is recommended. However, it remains a practical baseline for most recreational athletes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="age" className="mb-1 flex items-center gap-1">
            Age <Info className="w-4 h-4 text-blue-500" />
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={100}
            placeholder="Years"
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
            placeholder="Beats per minute"
            value={inputs.restingHeartRate}
            onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rpe" className="mb-1 flex items-center gap-1">
            Rate of Perceived Exertion (RPE) <Flame className="w-4 h-4 text-orange-500" />
          </Label>
          <Select
            onValueChange={(v) => handleInputChange("rpe", v)}
            value={inputs.rpe}
            id="rpe"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select RPE (6-20)" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(15)].map((_, i) => {
                const val = i + 6;
                return (
                  <SelectItem key={val} value={val.toString()}>
                    {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", restingHeartRate: "", rpe: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">{results.label}</p>
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
            )}
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
          Target Heart Rate (THR) zones are personalized ranges of heartbeats per minute that correspond to different exercise intensities, helping athletes optimize cardiovascular training and improve fitness safely. These zones are often calculated using the Karvonen formula, which incorporates resting heart rate to better reflect individual fitness levels rather than relying solely on age-predicted maximum heart rate. The Rate of Perceived Exertion (RPE) scale, developed by Borg, is a subjective measure that allows athletes to rate their effort on a scale from 6 (no exertion) to 20 (maximal exertion), providing valuable insight into how hard the exercise feels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Combining THR zones with RPE enables athletes and coaches to align objective physiological data with subjective effort, enhancing training precision and preventing overtraining or undertraining. This dual approach is widely endorsed by sports science authorities for its effectiveness in monitoring and adjusting training loads across various sports disciplines.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your target heart rate zone based on your perceived exertion, input your age, resting heart rate, and current RPE value into the calculator. The calculator uses the Karvonen formula to provide a heart rate range that corresponds to your subjective effort level, helping you train within the optimal intensity zone for your fitness goals.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your age in years. This helps estimate your maximum heart rate.</li>
          <li>Step 2: Enter your resting heart rate in beats per minute (bpm). This personalizes your heart rate reserve.</li>
          <li>Step 3: Select your current Rate of Perceived Exertion (RPE) on the 6-20 Borg scale.</li>
          <li>Step 4: Click "Calculate" to see your target heart rate zone corresponding to your RPE.</li>
          <li>Step 5: Use this heart rate zone to guide your training intensity, ensuring alignment between how hard you feel you are working and your physiological response.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitoring both heart rate and RPE allows for a comprehensive understanding of training intensity, which is essential for effective periodization and recovery management. Beginners should focus on training within light to moderate zones (RPE 6-13) to build aerobic base fitness, while more advanced athletes can incorporate higher intensity zones (RPE 14-20) for anaerobic conditioning and performance gains. Always consider external factors such as hydration, temperature, and fatigue, which can affect heart rate and perceived exertion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using wearable heart rate monitors in conjunction with subjective RPE feedback can help detect discrepancies that may indicate overtraining or illness. Adjust training loads accordingly to maintain optimal performance and reduce injury risk. Remember, consistency and gradual progression within your target zones are key to long-term success.
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
          For more information on training science and heart rate zone methodologies, consult the following authoritative sources:
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
              The ACSM provides comprehensive guidelines on exercise testing and prescription, including heart rate training zones and RPE scales.
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
              NSCA offers evidence-based resources on training intensity monitoring and periodization strategies for athletes.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20803156/understanding-the-borg-rpe-scale/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Understanding the Borg RPE Scale <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide explaining how to use the Rate of Perceived Exertion scale to optimize training and prevent injury.
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
        title: "Karvonen Formula",
        formula: "Target HR = ((220 - Age - Resting HR) × Intensity) + Resting HR",
        variables: [
          { symbol: "Age", description: "Your age in years" },
          { symbol: "Resting HR", description: "Your resting heart rate in beats per minute" },
          { symbol: "Intensity", description: "Desired exercise intensity as a decimal (e.g., 0.7 for 70%)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old athlete with a resting heart rate of 60 bpm wants to train at an RPE of 14 (hard intensity).",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate max HR: 220 - 30 = 190 bpm.",
          },
          {
            label: "Step 2",
            explanation: "Determine intensity range for RPE 14: 70% to 85% (0.70 - 0.85).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate target HR range using Karvonen formula: ((190 - 60) × 0.70) + 60 = 151 bpm (min), ((190 - 60) × 0.85) + 60 = 170.5 bpm (max).",
          },
          {
            label: "Step 4",
            explanation: "Train within 151 to 171 bpm to match your perceived exertion.",
          },
        ],
        result: "Target Heart Rate Zone: 151 - 171 bpm",
      }}
      relatedCalculators={[
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
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