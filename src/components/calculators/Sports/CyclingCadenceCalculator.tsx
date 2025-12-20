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

export default function CyclingCadenceCalculator() {
  // Inputs: wheel diameter (inches or mm), gear teeth front, gear teeth rear, speed (km/h or mph), units
  const [inputs, setInputs] = useState({
    wheelDiameter: "",
    wheelUnit: "inches",
    frontTeeth: "",
    rearTeeth: "",
    speed: "",
    speedUnit: "km/h",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants for unit conversions
  const INCH_TO_METER = 0.0254;
  const MM_TO_METER = 0.001;
  const MPH_TO_KMH = 1.609344;

  /**
   * Calculate cadence (RPM) from speed, gear ratio, and wheel diameter.
   * Formula:
   * Cadence (RPM) = (Speed (m/min) × Rear Teeth) / (Wheel Circumference (m) × Front Teeth)
   * 
   * Where:
   * - Speed (m/min) = speed (m/s) × 60
   * - Wheel Circumference = π × wheel diameter (m)
   */
  const results = useMemo(() => {
    const wd = parseFloat(inputs.wheelDiameter);
    const ft = parseInt(inputs.frontTeeth);
    const rt = parseInt(inputs.rearTeeth);
    const spd = parseFloat(inputs.speed);

    if (
      isNaN(wd) || wd <= 0 ||
      isNaN(ft) || ft <= 0 ||
      isNaN(rt) || rt <= 0 ||
      isNaN(spd) || spd <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed: "",
      };
    }

    // Convert wheel diameter to meters
    let wheelDiameterMeters = 0;
    if (inputs.wheelUnit === "inches") {
      wheelDiameterMeters = wd * INCH_TO_METER;
    } else if (inputs.wheelUnit === "mm") {
      wheelDiameterMeters = wd * MM_TO_METER;
    }

    // Convert speed to meters per minute
    let speedMetersPerMin = 0;
    if (inputs.speedUnit === "km/h") {
      speedMetersPerMin = (spd * 1000) / 60; // km/h to m/min
    } else if (inputs.speedUnit === "mph") {
      speedMetersPerMin = (spd * MPH_TO_KMH * 1000) / 60; // mph to km/h to m/min
    }

    // Calculate wheel circumference
    const wheelCircumference = Math.PI * wheelDiameterMeters; // meters

    // Cadence formula
    // cadence = (speed (m/min) * rearTeeth) / (wheelCircumference * frontTeeth)
    const cadence = (speedMetersPerMin * rt) / (wheelCircumference * ft);

    // Round cadence to nearest whole number
    const cadenceRounded = Math.round(cadence);

    return {
      value: `${cadenceRounded} RPM`,
      label: "Estimated Cycling Cadence",
      subtext: "Cadence calculated based on gear ratio, wheel size, and speed.",
      warning: null,
      formulaUsed: "Cadence (RPM) = (Speed (m/min) × Rear Teeth) / (Wheel Circumference (m) × Front Teeth)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is cycling cadence and why is it important?",
      answer:
        "Cycling cadence refers to the number of pedal revolutions per minute (RPM). Maintaining an optimal cadence improves pedaling efficiency, reduces muscle fatigue, and enhances endurance. Most cyclists aim for a cadence between 80 and 100 RPM for optimal performance.",
    },
    {
      question: "How does gear ratio affect cadence?",
      answer:
        "Gear ratio, defined by the number of teeth on the front chainring divided by the rear sprocket, directly influences cadence. A higher gear ratio means more distance covered per pedal revolution, resulting in lower cadence at a given speed, while a lower gear ratio increases cadence.",
    },
    {
      question: "Can I use this calculator for different wheel sizes?",
      answer:
        "Yes, this calculator allows you to input wheel diameter in inches or millimeters. Accurate wheel size input is crucial because it affects the wheel circumference, which directly impacts cadence calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wheelDiameter" className="mb-1 flex items-center gap-1">
                Wheel Diameter{" "}
                <Info className="w-4 h-4 text-blue-600" title="Diameter of your bike wheel" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="wheelDiameter"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g., 27"
                  value={inputs.wheelDiameter}
                  onChange={(e) => handleInputChange("wheelDiameter", e.target.value)}
                />
                <Select
                  value={inputs.wheelUnit}
                  onValueChange={(v) => handleInputChange("wheelUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inches">Inches</SelectItem>
                    <SelectItem value="mm">Millimeters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="frontTeeth" className="mb-1 flex items-center gap-1">
                Front Chainring Teeth{" "}
                <GearIcon className="w-4 h-4 text-blue-600" title="Number of teeth on front chainring" />
              </Label>
              <Input
                id="frontTeeth"
                type="number"
                min="1"
                step="1"
                placeholder="e.g., 52"
                value={inputs.frontTeeth}
                onChange={(e) => handleInputChange("frontTeeth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="rearTeeth" className="mb-1 flex items-center gap-1">
                Rear Sprocket Teeth{" "}
                <GearIcon className="w-4 h-4 text-blue-600" title="Number of teeth on rear sprocket" />
              </Label>
              <Input
                id="rearTeeth"
                type="number"
                min="1"
                step="1"
                placeholder="e.g., 16"
                value={inputs.rearTeeth}
                onChange={(e) => handleInputChange("rearTeeth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="speed" className="mb-1 flex items-center gap-1">
                Speed{" "}
                <Waves className="w-4 h-4 text-blue-600" title="Cycling speed" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="speed"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g., 30"
                  value={inputs.speed}
                  onChange={(e) => handleInputChange("speed", e.target.value)}
                />
                <Select
                  value={inputs.speedUnit}
                  onValueChange={(v) => handleInputChange("speedUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km/h">km/h</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              wheelDiameter: "",
              wheelUnit: "inches",
              frontTeeth: "",
              rearTeeth: "",
              speed: "",
              speedUnit: "km/h",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            {results.subtext && (
              <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">{results.subtext}</p>
            )}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cycling Cadence Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cycling cadence is the number of pedal revolutions per minute (RPM) a cyclist performs. It is a critical metric for optimizing cycling performance, as cadence influences muscle fatigue, cardiovascular load, and overall efficiency. This calculator estimates cadence based on your bike's gear ratio, wheel size, and current speed, providing insights to help you find your ideal pedaling rhythm.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The gear ratio, determined by the number of teeth on the front chainring and rear sprocket, affects how far your bike travels with each pedal revolution. Wheel diameter impacts the distance covered per wheel rotation. By combining these factors with your cycling speed, this tool calculates the cadence you are maintaining, allowing you to adjust your gearing or pedaling rate for optimal performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and monitoring cadence can help prevent overuse injuries and improve endurance by promoting efficient muscle use. Many professional cyclists aim for a cadence between 80 and 100 RPM, but individual preferences and terrain can influence optimal cadence.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, input your bike's wheel diameter, the number of teeth on your front chainring and rear sprocket, and your current cycling speed. Select the appropriate units for each input to ensure accurate calculations. Once all inputs are entered, click &quot;Calculate&quot; to see your estimated cycling cadence in revolutions per minute (RPM).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Measure your wheel diameter accurately, either in inches or millimeters, depending on your preference or bike specifications.
          </li>
          <li>
            Enter the number of teeth on your front chainring and rear sprocket. These values are usually printed on the components or available in your bike&apos;s specifications.
          </li>
          <li>
            Input your current cycling speed and select the correct unit (km/h or mph).
          </li>
          <li>
            Press &quot;Calculate&quot; to view your cadence. Use this information to adjust your pedaling rate or gear selection for improved efficiency.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an optimal cadence is essential for maximizing cycling performance and minimizing fatigue. Most cyclists benefit from a cadence range of 80&ndash;100 RPM, which balances muscular and cardiovascular demands. Training to increase your cadence can improve your pedaling efficiency and reduce the risk of injury caused by excessive force on the pedals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When riding uphill or into strong winds, your cadence may naturally drop below your target range. In these situations, consider shifting to a lower gear to maintain a higher cadence and reduce muscle strain. Conversely, on flat terrain or descents, you can increase gear size to maintain cadence while increasing speed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use cadence sensors or this calculator regularly to monitor your pedaling rate and adjust your training accordingly. Incorporating cadence drills, such as high-cadence intervals, can enhance neuromuscular coordination and cycling economy.
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
          For more information on cycling physiology, training science, and performance optimization, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletes and coaches.
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
              The NSCA offers comprehensive resources on strength and conditioning principles, including cycling-specific training methodologies.
            </p>
          </li>
          <li>
            <a
              href="https://www.cyclinguk.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Cycling UK <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A leading UK cycling organization providing practical advice on cycling techniques, training, and safety.
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
          "Cadence (RPM) = (Speed (m/min) × Rear Teeth) / (Wheel Circumference (m) × Front Teeth)",
        variables: [
          { symbol: "Speed (m/min)", description: "Cycling speed converted to meters per minute" },
          { symbol: "Rear Teeth", description: "Number of teeth on the rear sprocket" },
          { symbol: "Wheel Circumference (m)", description: "Wheel diameter × π, in meters" },
          { symbol: "Front Teeth", description: "Number of teeth on the front chainring" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A cyclist rides a bike with a 27-inch wheel diameter, a 52-tooth front chainring, and a 16-tooth rear sprocket at a speed of 30 km/h.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the wheel diameter to meters: 27 inches × 0.0254 = 0.6858 m.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the wheel circumference: 0.6858 m × π ≈ 2.154 m.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert speed to meters per minute: 30 km/h = 30,000 m / 60 min = 500 m/min.",
          },
          {
            label: "Step 4",
            explanation:
              "Apply the formula: Cadence = (500 m/min × 16) / (2.154 m × 52) ≈ 71.7 RPM.",
          },
        ],
        result: "The cyclist's estimated cadence is approximately 72 RPM.",
      }}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
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

// Dummy GearIcon component for gear teeth labels (using Gear icon from lucide-react)
function GearIcon(props: React.SVGProps<SVGSVGElement>) {
  // Using Dumbbell icon as a placeholder for gear since Gear is not in the import list
  // But per instructions, only import icons from the given list, so use Dumbbell as a proxy
  return <Dumbbell {...props} />;
}