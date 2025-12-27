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

export default function 060SpeedVsGearRpmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    gearRatio: "", // Gear ratio of selected gear
    finalDriveRatio: "", // Final drive ratio
    tireDiameter: "", // Tire diameter (inches or cm)
    rpm: "", // Engine RPM at which speed is measured
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Speed (mph) = (RPM × Tire Circumference (inches)) / (Gear Ratio × Final Drive Ratio × 1056)
   * 1056 is a constant to convert inches per minute to mph.
   * For metric: Speed (km/h) = (RPM × Tire Circumference (cm)) / (Gear Ratio × Final Drive Ratio × 336)
   * 336 converts cm/min to km/h.
   */

  const results = useMemo(() => {
    const gearRatio = parseFloat(inputs.gearRatio);
    const finalDriveRatio = parseFloat(inputs.finalDriveRatio);
    const rpm = parseFloat(inputs.rpm);
    let tireDiameter = parseFloat(inputs.tireDiameter);

    if (
      isNaN(gearRatio) || gearRatio <= 0 ||
      isNaN(finalDriveRatio) || finalDriveRatio <= 0 ||
      isNaN(rpm) || rpm <= 0 ||
      isNaN(tireDiameter) || tireDiameter <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate tire circumference
    // circumference = π × diameter
    let tireCircumference;
    if (inputs.unit === "imperial") {
      // diameter in inches, circumference in inches
      tireCircumference = Math.PI * tireDiameter;
      // Speed in mph
      // speed = (RPM × tireCircumference) / (gearRatio × finalDriveRatio × 1056)
      // 1056 = 12 (inches/ft) * 88 (ft/min per mph)
      const speedMph = (rpm * tireCircumference) / (gearRatio * finalDriveRatio * 1056);
      return {
        primary: speedMph.toFixed(2) + " mph",
        secondary: `At ${rpm} RPM in gear ratio ${gearRatio} with final drive ${finalDriveRatio}`,
        details: `Tire circumference: ${tireCircumference.toFixed(2)} inches`,
        feedback: "Calculated speed based on inputs"
      };
    } else {
      // metric: diameter in cm, circumference in cm
      tireCircumference = Math.PI * tireDiameter;
      // Speed in km/h
      // speed = (RPM × tireCircumference) / (gearRatio × finalDriveRatio × 336)
      // 336 converts cm/min to km/h
      const speedKph = (rpm * tireCircumference) / (gearRatio * finalDriveRatio * 336);
      return {
        primary: speedKph.toFixed(2) + " km/h",
        secondary: `At ${rpm} RPM in gear ratio ${gearRatio} with final drive ${finalDriveRatio}`,
        details: `Tire circumference: ${tireCircumference.toFixed(2)} cm`,
        feedback: "Calculated speed based on inputs"
      };
    }
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does gear ratio affect the 0–60 speed calculation?",
      answer:
        "Gear ratio directly influences the speed at a given engine RPM. A lower gear ratio means the wheels turn faster per engine revolution, increasing speed. Conversely, a higher gear ratio reduces speed but increases torque. This calculator uses gear ratio along with final drive and tire size to estimate vehicle speed at a specific RPM."
    },
    {
      question: "Why is tire diameter important in this calculation?",
      answer:
        "Tire diameter determines the circumference, which affects how far the vehicle travels per wheel revolution. Larger tires cover more ground per revolution, increasing speed at the same RPM and gear ratio. Accurately inputting tire diameter ensures precise speed estimation."
    },
    {
      question: "Can I use this calculator for both manual and automatic transmissions?",
      answer:
        "Yes, this calculator works for any transmission type as long as you know the gear ratio for the gear in question and the final drive ratio. These values are essential to relate engine RPM to wheel speed, regardless of transmission type."
    },
    {
      question: "What units should I use for tire diameter?",
      answer:
        "Use inches if you select the Imperial unit system or centimeters for Metric. Consistency in units is crucial because the calculation constants differ between unit systems to convert circumference and RPM into speed."
    },
    {
      question: "Does this calculator estimate 0–60 mph time?",
      answer:
        "No, this calculator estimates the vehicle speed at a given gear and RPM, not the acceleration time from 0 to 60 mph. However, understanding speed at certain RPMs and gears can help analyze performance characteristics and gear effectiveness."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the speed at 3000 RPM in 3rd gear for a car with a 3.5:1 gear ratio, a 3.91 final drive ratio, and 26-inch diameter tires (Imperial units).",
    steps: [
      {
        label: "Step 1: Calculate tire circumference",
        explanation: `Tire circumference = π × diameter = 3.1416 × 26 = 81.68 inches`
      },
      {
        label: "Step 2: Apply speed formula",
        explanation:
          "Speed (mph) = (RPM × Tire Circumference) / (Gear Ratio × Final Drive Ratio × 1056) = (3000 × 81.68) / (3.5 × 3.91 × 1056)"
      },
      {
        label: "Step 3: Calculate denominator",
        explanation: "3.5 × 3.91 × 1056 = 14472.96"
      },
      {
        label: "Step 4: Calculate numerator",
        explanation: "3000 × 81.68 = 245040"
      },
      {
        label: "Step 5: Calculate speed",
        explanation: "Speed = 245040 / 14472.96 ≈ 16.93 mph"
      }
    ],
    result: "Final Result: At 3000 RPM in 3rd gear, the vehicle speed is approximately 16.93 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Gear Ratios Affect Vehicle Speed and Performance",
      description:
        "An in-depth article explaining the relationship between gear ratios, engine RPM, and vehicle speed.",
      url: "https://www.engineeringtoolbox.com/gear-ratio-d_1840.html"
    },
    {
      title: "Tire Size and Circumference Calculator",
      description:
        "Tool and explanation for calculating tire circumference based on diameter and width.",
      url: "https://tiresize.com/calculator/"
    },
    {
      title: "Understanding Final Drive Ratios",
      description:
        "Comprehensive guide on how final drive ratios impact vehicle dynamics and speed.",
      url: "https://www.motortrend.com/how-to/understanding-final-drive-ratios/"
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
            <SelectItem value="metric">Metric (cm, km/h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Gear Ratio (e.g., 3.5)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={inputs.gearRatio}
            onChange={(e) => handleInputChange("gearRatio", e.target.value)}
            placeholder="Enter gear ratio"
          />
        </div>
        <div className="space-y-2">
          <Label>Final Drive Ratio (e.g., 3.91)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={inputs.finalDriveRatio}
            onChange={(e) => handleInputChange("finalDriveRatio", e.target.value)}
            placeholder="Enter final drive ratio"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Tire Diameter ({inputs.unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
            placeholder={`Enter tire diameter in ${inputs.unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input
            type="number"
            step="10"
            min="0"
            value={inputs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
            placeholder="Enter engine RPM"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (inches and mph) or Metric (centimeters and km/h).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the gear ratio for the gear you want to analyze (e.g., 3.5 for 3rd gear).
          </li>
          <li>
            <strong>Step 3:</strong> Input the final drive ratio of your vehicle’s differential (e.g., 3.91).
          </li>
          <li>
            <strong>Step 4:</strong> Provide the tire diameter in the selected unit (inches or centimeters).
          </li>
          <li>
            <strong>Step 5:</strong> Enter the engine RPM at which you want to calculate the vehicle speed.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see the estimated speed at the given RPM and gear.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to 0–60 Speed vs Gear/RPM
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between engine RPM, gear ratios, and vehicle speed is fundamental in automotive engineering and performance tuning. The gear ratio of a transmission gear determines how many times the engine turns for one revolution of the wheels. Combined with the final drive ratio, which further reduces or increases rotational speed, these ratios dictate the speed output at the wheels for a given engine speed.
          </p>
          <p>
            Tire diameter plays a crucial role because it translates rotational speed into linear speed. Larger tires cover more distance per revolution, increasing vehicle speed at the same RPM and gear ratio. This calculator uses these inputs to estimate the vehicle’s speed at a specific engine RPM and gear, providing valuable insights for gear selection, performance tuning, and understanding vehicle dynamics.
          </p>
          <p>
            While this tool does not calculate acceleration times like 0–60 mph, it helps visualize how gear ratios and RPM affect speed. For example, lower gears with higher ratios provide more torque but lower speed, while higher gears with lower ratios allow higher speeds at lower engine RPMs. This balance is critical for optimizing performance and fuel efficiency.
          </p>
          <p>
            Always ensure accurate input values, especially tire diameter, as variations can significantly affect results. Tire wear, inflation, and aftermarket modifications can change effective diameter. Use manufacturer specifications or measure tires directly for best accuracy.
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
            <strong>1. Incorrect units:</strong> Mixing imperial and metric units for tire diameter or speed constants leads to inaccurate results. Always select the correct unit system and input consistent values.
          </p>
          <p>
            <strong>2. Using nominal tire size instead of actual diameter:</strong> Tire sizes on sidewalls (e.g., 225/45R17) require conversion to diameter. Using nominal sizes without conversion causes errors.
          </p>
          <p>
            <strong>3. Ignoring final drive ratio:</strong> Omitting or misentering the final drive ratio will skew speed calculations since it significantly affects wheel speed.
          </p>
          <p>
            <strong>4. Inputting unrealistic RPM or gear ratios:</strong> Values outside typical automotive ranges can produce nonsensical speeds. Verify inputs against manufacturer specs.
          </p>
          <p>
            <strong>5. Expecting acceleration times:</strong> This calculator estimates speed at a given RPM, not acceleration or 0–60 times. Use specialized tools for acceleration metrics.
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
      title="0–60 Speed vs Gear/RPM"
      description="Professional automotive calculator: 0–60 Speed vs Gear/RPM. Get accurate estimates, expert advice, and financial insights."
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