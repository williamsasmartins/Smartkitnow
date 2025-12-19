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

const gearRatios = [
  { label: "1.0 (e.g. 39T front / 39T rear)", value: 1.0 },
  { label: "1.2 (e.g. 48T front / 40T rear)", value: 1.2 },
  { label: "1.5 (e.g. 50T front / 33T rear)", value: 1.5 },
  { label: "1.8 (e.g. 52T front / 28T rear)", value: 1.8 },
  { label: "2.0 (e.g. 53T front / 26T rear)", value: 2.0 },
];

export default function CyclingCadenceCalculator() {
  const [inputs, setInputs] = useState({
    speedKmh: "",
    wheelDiameterInches: "27", // default wheel size approx 700c road wheel
    gearRatio: "1.5",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Formula Explanation:
   * Cadence (RPM) = (Speed (km/h) * 1000) / (Wheel Circumference (m) * 60) / Gear Ratio
   * 
   * Wheel Circumference (m) = π * Wheel Diameter (m)
   * Wheel Diameter (m) = Wheel Diameter (inches) * 0.0254
   * 
   * This formula calculates how many times the pedals must turn per minute to maintain the given speed,
   * considering the gear ratio and wheel size.
   */

  const results = useMemo(() => {
    const speed = parseFloat(inputs.speedKmh);
    const wheelInches = parseFloat(inputs.wheelDiameterInches);
    const gearRatio = parseFloat(inputs.gearRatio);

    if (!speed || !wheelInches || !gearRatio || gearRatio <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed: "",
      };
    }

    // Convert wheel diameter to meters
    const wheelDiameterMeters = wheelInches * 0.0254;
    // Calculate wheel circumference in meters
    const wheelCircumferenceMeters = Math.PI * wheelDiameterMeters;

    // Calculate cadence in RPM
    // speed (km/h) to m/min = speed * 1000 / 60
    const speedMetersPerMin = (speed * 1000) / 60;

    // Pedal cadence RPM = wheel RPM / gear ratio
    // wheel RPM = speedMetersPerMin / wheelCircumferenceMeters
    const wheelRPM = speedMetersPerMin / wheelCircumferenceMeters;
    const cadenceRPM = wheelRPM / gearRatio;

    const cadenceRounded = Math.round(cadenceRPM);

    return {
      value: cadenceRounded,
      label: "Estimated Pedal Cadence (RPM)",
      subtext: `Based on speed ${speed} km/h, wheel diameter ${wheelInches}" and gear ratio ${gearRatio.toFixed(2)}.`,
      warning: null,
      formulaUsed:
        "Cadence (RPM) = (Speed (km/h) × 1000 / 60) ÷ (π × Wheel Diameter (m)) ÷ Gear Ratio",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is cycling cadence and why is it important?",
      answer:
        "Cycling cadence refers to the number of pedal revolutions per minute (RPM). Maintaining an optimal cadence improves pedaling efficiency, reduces muscle fatigue, and enhances endurance. Most trained cyclists aim for a cadence between 80-100 RPM during steady-state riding to balance power output and energy expenditure.",
    },
    {
      question: "How does gear ratio affect cadence?",
      answer:
        "Gear ratio determines how many wheel rotations occur per pedal revolution. A higher gear ratio means more distance covered per pedal stroke but requires more force, resulting in a lower cadence for the same speed. Conversely, a lower gear ratio allows for a higher cadence with less force but covers less distance per stroke. Adjusting gear ratio helps cyclists optimize cadence for terrain and fitness.",
    },
    {
      question: "Can I use this calculator for different wheel sizes?",
      answer:
        "Yes, this calculator allows you to input your wheel diameter in inches to accommodate various wheel sizes such as 700c road wheels (~27 inches), mountain bike wheels, or smaller training wheels. Accurate wheel size input ensures precise cadence estimation.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="speedKmh" className="flex items-center gap-2">
              <Activity /> Speed (km/h)
            </Label>
            <Input
              id="speedKmh"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 30"
              value={inputs.speedKmh}
              onChange={(e) => handleInputChange("speedKmh", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="wheelDiameterInches" className="flex items-center gap-2">
              <Gauge /> Wheel Diameter (inches)
            </Label>
            <Input
              id="wheelDiameterInches"
              type="number"
              min="10"
              max="40"
              step="0.1"
              placeholder="e.g. 27"
              value={inputs.wheelDiameterInches}
              onChange={(e) => handleInputChange("wheelDiameterInches", e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-1">
              Typical road bike wheel is ~27 inches (700c).
            </p>
          </div>

          <div>
            <Label htmlFor="gearRatio" className="flex items-center gap-2">
              <Calculator /> Gear Ratio
            </Label>
            <Select
              value={inputs.gearRatio}
              onValueChange={(v) => handleInputChange("gearRatio", v)}
              id="gearRatio"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gear ratio" />
              </SelectTrigger>
              <SelectContent>
                {gearRatios.map((gr) => (
                  <SelectItem key={gr.value} value={gr.value.toString()}>
                    {gr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-1">
              Ratio = Front chainring teeth / Rear sprocket teeth.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((p) => ({ ...p }));
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              speedKmh: "",
              wheelDiameterInches: "27",
              gearRatio: "1.5",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} RPM</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cycling Cadence Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cycling cadence is a critical metric that measures how many times a cyclist pedals per minute, commonly expressed as revolutions per minute (RPM). This metric directly influences cycling efficiency, muscular fatigue, and overall endurance. By calculating cadence based on your riding speed, wheel size, and gear ratio, cyclists can optimize their pedaling technique to match their fitness level and terrain conditions. This calculator uses biomechanical principles to estimate cadence, helping riders find their ideal pedaling rhythm.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The cadence calculation incorporates the gear ratio, which is the ratio of the number of teeth on the front chainring to the rear sprocket, and the wheel circumference, derived from the wheel diameter. These factors determine how far the bike travels per pedal revolution. Understanding and adjusting cadence can improve power output and reduce injury risk, making it a fundamental aspect of cycling training and performance analysis.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your cycling cadence, input your current riding speed in kilometers per hour, select or enter your wheel diameter in inches, and choose the gear ratio that corresponds to your bike's front and rear sprockets. The calculator then computes the pedal revolutions per minute required to maintain that speed with the given gear and wheel size.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cycling speed in km/h. This is the speed you want to analyze or maintain.
          </li>
          <li>
            <strong>Step 2:</strong> Input your wheel diameter in inches. Common road bike wheels are around 27 inches (700c).
          </li>
          <li>
            <strong>Step 3:</strong> Select your gear ratio from the dropdown or calculate it by dividing the number of teeth on your front chainring by the rear sprocket.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your estimated pedal cadence in RPM.
          </li>
          <li>
            <strong>Step 5:</strong> Use this information to adjust your pedaling technique or gear selection for optimal performance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an optimal cadence is essential for efficient cycling and injury prevention. Most endurance cyclists target a cadence between 80 and 100 RPM during steady-state rides to balance muscular endurance and cardiovascular efficiency. Training to increase cadence can improve neuromuscular coordination and reduce the risk of overuse injuries caused by excessive force on the pedals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate cadence drills into your training by alternating periods of high cadence (90-110 RPM) with lower cadence efforts to build both speed and strength. Use a cadence sensor or this calculator to monitor your pedaling rate and adjust your gear selection accordingly. Remember that terrain, fatigue, and riding style will influence your ideal cadence, so adapt your strategy based on conditions and goals.
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
          For more information on cycling biomechanics, training principles, and performance optimization, consult the following authoritative sources:
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
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers comprehensive resources on strength training, conditioning, and biomechanics relevant to cycling performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.britishcycling.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              British Cycling <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for cycling in the UK, providing training programs, coaching advice, and performance insights.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cycling Cadence Calculator"
      description="Calculate cycling cadence. Measure your RPM (revolutions per minute) based on gear ratio and speed to improve pedaling efficiency."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Cadence (RPM) = (Speed (km/h) × 1000 / 60) ÷ (π × Wheel Diameter (m)) ÷ Gear Ratio",
        variables: [
          { symbol: "Speed (km/h)", description: "Cycling speed in kilometers per hour" },
          { symbol: "Wheel Diameter (m)", description: "Diameter of the wheel in meters" },
          { symbol: "Gear Ratio", description: "Ratio of front chainring teeth to rear sprocket teeth" },
          { symbol: "π", description: "Mathematical constant Pi (~3.1416)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A cyclist rides at 30 km/h with a 27-inch wheel and a gear ratio of 1.5 (e.g., 50 teeth front chainring and 33 teeth rear sprocket).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert wheel diameter to meters: 27 inches × 0.0254 = 0.6858 meters.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate wheel circumference: π × 0.6858 m ≈ 2.154 meters.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate speed in meters per minute: 30 km/h × 1000 / 60 = 500 m/min.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate wheel RPM: 500 m/min ÷ 2.154 m ≈ 232.2 RPM.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate pedal cadence: 232.2 RPM ÷ 1.5 ≈ 154.8 RPM.",
          },
        ],
        result: "The estimated pedal cadence is approximately 155 RPM.",
      }}
      relatedCalculators={[
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "⚽" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
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