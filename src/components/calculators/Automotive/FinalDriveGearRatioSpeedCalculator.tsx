import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FinalDriveGearRatioSpeedCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tireDiameter: "", // in inches or mm depending on unit
    finalDriveRatio: "", // numeric ratio, e.g. 3.91
    gearRatio: "", // numeric ratio of selected gear, e.g. 1.00 for direct drive
    engineRPM: "" // engine speed in RPM
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Speed (mph or km/h) = (Engine RPM * Tire Circumference) / (Gear Ratio * Final Drive Ratio * 1056)
   * 1056 is a constant to convert units properly for mph when tire diameter is in inches.
   * For metric (tire diameter in mm), convert circumference to meters and adjust constant accordingly.
   */

  const results = useMemo(() => {
    const tireDiameterNum = parseFloat(inputs.tireDiameter);
    const finalDriveRatioNum = parseFloat(inputs.finalDriveRatio);
    const gearRatioNum = parseFloat(inputs.gearRatio);
    const engineRPMNum = parseFloat(inputs.engineRPM);

    if (
      isNaN(tireDiameterNum) || tireDiameterNum <= 0 ||
      isNaN(finalDriveRatioNum) || finalDriveRatioNum <= 0 ||
      isNaN(gearRatioNum) || gearRatioNum <= 0 ||
      isNaN(engineRPMNum) || engineRPMNum <= 0
    ) {
      return {
        primary: "0",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for all inputs.",
        feedback: "Check your inputs."
      };
    }

    let speed = 0;
    let details = "";

    if (inputs.unit === "imperial") {
      // Tire diameter in inches
      // Tire circumference = diameter * pi (inches)
      // Speed (mph) = (RPM * Tire Circumference) / (Gear Ratio * Final Drive Ratio * 1056)
      // 1056 = 12 (inches/ft) * 5280 (ft/mile) / 60 (min/hr)
      const tireCircumferenceInches = tireDiameterNum * Math.PI;
      speed = (engineRPMNum * tireCircumferenceInches) / (gearRatioNum * finalDriveRatioNum * 1056);
      details = `Speed (mph) = (RPM × Tire Circumference) / (Gear Ratio × Final Drive Ratio × 1056) = (${engineRPMNum} × ${tireCircumferenceInches.toFixed(2)}) / (${gearRatioNum} × ${finalDriveRatioNum} × 1056)`;
    } else {
      // Metric: tire diameter in mm
      // Convert diameter to meters: mm / 1000
      // Tire circumference in meters = diameter_m * pi
      // Speed (km/h) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 1000)
      // 60 sec/min to hr, 1000 m/km
      const tireDiameterMeters = tireDiameterNum / 1000;
      const tireCircumferenceMeters = tireDiameterMeters * Math.PI;
      speed = (engineRPMNum * tireCircumferenceMeters * 60) / (gearRatioNum * finalDriveRatioNum * 1000);
      details = `Speed (km/h) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 1000) = (${engineRPMNum} × ${tireCircumferenceMeters.toFixed(3)} × 60) / (${gearRatioNum} × ${finalDriveRatioNum} × 1000)`;
    }

    return {
      primary: speed.toFixed(2),
      secondary: inputs.unit === "imperial" ? "mph" : "km/h",
      details,
      feedback: speed > 0 ? "Calculation successful" : "Check inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the final drive ratio and why is it important?",
      answer:
        "The final drive ratio is the gear ratio of the last set of gears in the drivetrain, typically in the differential. It determines how many times the driveshaft turns for each rotation of the wheels. This ratio significantly affects vehicle acceleration, top speed, and fuel efficiency. A higher final drive ratio means more torque to the wheels but lower top speed, while a lower ratio favors higher speed but less torque."
    },
    {
      question: "How does the gear ratio affect vehicle speed?",
      answer:
        "The gear ratio of a specific gear in the transmission determines how engine RPM translates to wheel RPM. Lower gears have higher ratios, providing more torque but less speed, while higher gears have lower ratios, allowing higher speeds at lower engine RPM. The combination of gear ratio and final drive ratio directly influences the vehicle's speed at a given engine RPM."
    },
    {
      question: "Why do I need to input tire diameter for this calculation?",
      answer:
        "Tire diameter affects the circumference of the tire, which determines how far the vehicle travels with each wheel rotation. Larger tires cover more distance per rotation, increasing vehicle speed for the same engine RPM and gear ratios. Accurate tire diameter input ensures precise speed calculations."
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both imperial (inches, mph) and metric (millimeters, km/h) units. Simply select your preferred unit system, and input the tire diameter accordingly. The calculator will automatically adjust the formulas and output the speed in the correct units."
    },
    {
      question: "What engine RPM should I use for this calculation?",
      answer:
        "You should input the engine RPM at which you want to know the vehicle speed, such as the engine speed at a certain throttle position or cruising RPM. This allows you to estimate the vehicle speed at that engine speed and gear combination, useful for performance tuning or understanding driving characteristics."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the vehicle speed of a car with a 26-inch tire diameter, a final drive ratio of 3.91, in 4th gear with a gear ratio of 1.00, at an engine speed of 3000 RPM.",
    steps: [
      {
        label: "Step 1: Calculate tire circumference",
        explanation: "Tire circumference = tire diameter × π = 26 in × 3.1416 = 81.68 inches"
      },
      {
        label: "Step 2: Apply speed formula for imperial units",
        explanation:
          "Speed (mph) = (Engine RPM × Tire Circumference) / (Gear Ratio × Final Drive Ratio × 1056) = (3000 × 81.68) / (1.00 × 3.91 × 1056) = 245040 / 4129.0 = 59.34 mph"
      }
    ],
    result: "Final Result: The vehicle speed is approximately 59.34 mph at 3000 RPM in 4th gear."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Final Drive Ratios Affect Performance",
      description: "An in-depth article explaining the impact of final drive ratios on vehicle dynamics.",
      url: "https://www.engineeringtoolbox.com/final-drive-ratio-d_1788.html"
    },
    {
      title: "Tire Size and Speedometer Accuracy",
      description: "Explains how tire diameter affects speedometer readings and vehicle speed.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=46"
    },
    {
      title: "Understanding Gear Ratios",
      description: "A comprehensive guide on gear ratios and their effect on vehicle performance.",
      url: "https://www.carthrottle.com/post/understanding-gear-ratios/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (inches, mph)</SelectItem>
            <SelectItem value="metric">Metric (mm, km/h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 26" : "e.g. 660"}
          />
        </div>
        <div className="space-y-2">
          <Label>Final Drive Ratio</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.finalDriveRatio}
            onChange={(e) => handleInputChange("finalDriveRatio", e.target.value)}
            placeholder="e.g. 3.91"
          />
        </div>
        <div className="space-y-2">
          <Label>Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.gearRatio}
            onChange={(e) => handleInputChange("gearRatio", e.target.value)}
            placeholder="e.g. 1.00"
          />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.engineRPM}
            onChange={(e) => handleInputChange("engineRPM", e.target.value)}
            placeholder="e.g. 3000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Speed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the tire diameter in inches (imperial) or millimeters (metric). This is typically found on the tire sidewall or vehicle specs.
          </li>
          <li>
            <strong>Step 3:</strong> Input the final drive ratio of your vehicle’s differential. This is usually a decimal number like 3.91 or 4.10.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the gear ratio for the gear you want to calculate speed for, such as 1.00 for direct drive or 0.75 for overdrive.
          </li>
          <li>
            <strong>Step 5:</strong> Input the engine RPM at which you want to calculate the vehicle speed.
          </li>
          <li>
            <strong>Step 6:</strong> Click the <em>Calculate</em> button to see the estimated vehicle speed displayed below.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Final Drive & Gear Ratio Speed Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding how your vehicle’s speed relates to engine RPM, gear ratios, and tire size is essential for automotive engineers, enthusiasts, and anyone interested in vehicle performance. The final drive ratio and gear ratio together determine how many times the wheels turn for each revolution of the engine. The tire diameter then translates wheel rotations into distance traveled, allowing us to calculate speed.
          </p>
          <p>
            The final drive ratio is the gear reduction in the differential, which multiplies torque but reduces speed. A higher final drive ratio means the engine turns more times to rotate the wheels once, resulting in better acceleration but lower top speed. Conversely, a lower final drive ratio favors higher top speed but less torque multiplication.
          </p>
          <p>
            Gear ratios in the transmission further modify engine speed before it reaches the differential. Lower gears have higher ratios, providing torque multiplication for acceleration or climbing, while higher gears have lower ratios for cruising efficiency and speed.
          </p>
          <p>
            Tire diameter affects the distance traveled per wheel revolution. Larger tires cover more ground per rotation, increasing speed for a given engine RPM and gear setup. However, changing tire size also affects speedometer accuracy and vehicle dynamics.
          </p>
          <p>
            This calculator combines these factors to estimate vehicle speed at a given engine RPM and gear. It supports both imperial and metric units, making it versatile for global users. By inputting your vehicle’s tire diameter, final drive ratio, gear ratio, and engine RPM, you can quickly determine your speed, aiding in tuning, diagnostics, or educational purposes.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect units for tire diameter:</strong> Entering tire diameter in the wrong unit system (e.g., inches when metric is selected) will produce inaccurate results. Always verify your unit selection matches your input.
          </p>
          <p>
            <strong>2. Using nominal tire size instead of actual diameter:</strong> Tire sizes printed on the sidewall (e.g., 225/45R17) need to be converted to actual diameter. Using nominal or partial sizes leads to errors.
          </p>
          <p>
            <strong>3. Forgetting to include both gear ratio and final drive ratio:</strong> Both ratios multiply to affect speed. Omitting one or entering zero will invalidate the calculation.
          </p>
          <p>
            <strong>4. Inputting unrealistic engine RPM values:</strong> Engine speeds beyond typical operating ranges can produce misleading speeds. Use realistic RPM values for meaningful results.
          </p>
          <p>
            <strong>5. Not accounting for tire wear or inflation:</strong> Tire diameter changes with wear and inflation pressure, affecting circumference and speed. For precise work, measure actual tire diameter.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Final Drive & Gear Ratio Speed Calculator"
      description="Professional automotive calculator: Final Drive & Gear Ratio Speed Calculator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}