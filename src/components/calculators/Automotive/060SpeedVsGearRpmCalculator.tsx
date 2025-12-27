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
    gearRatio: "",
    finalDriveRatio: "",
    tireDiameter: "",
    rpm: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 0-60 speed (mph or km/h) at given gear and RPM can be estimated by:
   * Speed = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 63360)
   * For imperial units (mph):
   * - Tire circumference in inches = π × tire diameter (inches)
   * - 63360 = inches per mile
   * For metric units (km/h):
   * - Tire circumference in meters = π × tire diameter (meters)
   * - 1000 meters per km, 3600 seconds per hour
   * 
   * We will calculate speed at given RPM and gear ratios.
   */

  const results = useMemo(() => {
    const gearRatio = parseFloat(inputs.gearRatio);
    const finalDriveRatio = parseFloat(inputs.finalDriveRatio);
    const tireDiameter = parseFloat(inputs.tireDiameter);
    const rpm = parseFloat(inputs.rpm);

    if (
      isNaN(gearRatio) || gearRatio <= 0 ||
      isNaN(finalDriveRatio) || finalDriveRatio <= 0 ||
      isNaN(tireDiameter) || tireDiameter <= 0 ||
      isNaN(rpm) || rpm <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter positive numeric values for all inputs.",
        feedback: "Input error"
      };
    }

    let speed = 0;
    let details = "";

    if (inputs.unit === "imperial") {
      // Tire circumference in inches
      const tireCircumferenceInches = Math.PI * tireDiameter;
      // Speed in mph
      speed = (rpm * tireCircumferenceInches * 60) / (gearRatio * finalDriveRatio * 63360);
      details = `Speed (mph) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 63360) = (${rpm} × ${tireCircumferenceInches.toFixed(2)} × 60) / (${gearRatio} × ${finalDriveRatio} × 63360)`;
    } else {
      // Metric units: tireDiameter in meters
      // Tire circumference in meters
      const tireCircumferenceMeters = Math.PI * tireDiameter;
      // Speed in km/h
      speed = (rpm * tireCircumferenceMeters * 60) / (gearRatio * finalDriveRatio * 1000);
      details = `Speed (km/h) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 1000) = (${rpm} × ${tireCircumferenceMeters.toFixed(2)} × 60) / (${gearRatio} × ${finalDriveRatio} × 1000)`;
    }

    return {
      primary: speed.toFixed(2),
      secondary: inputs.unit === "imperial" ? "mph" : "km/h",
      details,
      feedback: "Calculated speed at given gear and RPM"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does gear ratio affect the 0-60 speed calculation?",
      answer:
        "The gear ratio directly influences the vehicle's speed at a given engine RPM. A higher gear ratio means the engine turns more times for each wheel rotation, resulting in lower speed at the same RPM. Conversely, a lower gear ratio increases speed but reduces torque. This calculator uses gear ratio along with final drive and tire size to estimate speed accurately."
    },
    {
      question: "Why is tire diameter important in this calculation?",
      answer:
        "Tire diameter determines the circumference, which affects how far the vehicle travels per wheel revolution. Larger tires cover more ground per rotation, increasing speed at a given RPM and gear ratio. Ignoring tire size can lead to inaccurate speed estimations, so it is crucial to input the correct tire diameter."
    },
    {
      question: "Can this calculator estimate 0-60 acceleration time?",
      answer:
        "No, this calculator estimates vehicle speed at a specific gear and RPM, not acceleration time. 0-60 acceleration depends on many factors including engine power, vehicle weight, traction, and aerodynamics. This tool helps understand speed potential at given engine speeds and gearing."
    },
    {
      question: "What units should I use for tire diameter?",
      answer:
        "Use inches for tire diameter if you select Imperial units, and meters if you select Metric units. Ensure consistency between the unit system and tire diameter input to get accurate results. Typical passenger car tires range from about 22 to 30 inches in diameter."
    },
    {
      question: "How do final drive ratios influence vehicle speed?",
      answer:
        "The final drive ratio is the last gear reduction before power reaches the wheels. A higher final drive ratio reduces speed but increases torque, improving acceleration. A lower final drive ratio increases top speed but can reduce acceleration. This calculator factors in final drive ratio to provide realistic speed estimates."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the speed of a car in 3rd gear at 4000 RPM with known gear ratios and tire size.",
    steps: [
      {
        label: "Step 1: Gather inputs",
        explanation:
          "Assume the 3rd gear ratio is 1.5, final drive ratio is 3.9, tire diameter is 26 inches, and engine speed is 4000 RPM."
      },
      {
        label: "Step 2: Calculate tire circumference",
        explanation:
          "Tire circumference = π × tire diameter = 3.1416 × 26 = 81.68 inches."
      },
      {
        label: "Step 3: Apply speed formula (Imperial units)",
        explanation:
          "Speed (mph) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 63360) = (4000 × 81.68 × 60) / (1.5 × 3.9 × 63360) ≈ 53.1 mph."
      }
    ],
    result: "Final Result: The vehicle speed at 4000 RPM in 3rd gear is approximately 53.1 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Gear Ratios Affect Performance",
      description: "Detailed explanation of gear ratios and their impact on vehicle speed and acceleration."
    },
    {
      title: "Tire Size and Its Effect on Speedometer Accuracy",
      description: "Understanding how tire diameter influences speed and distance measurements."
    },
    {
      title: "Automotive Engineering Fundamentals",
      description: "Comprehensive resource on vehicle dynamics, gearing, and powertrain."
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
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Gear Ratio</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={inputs.gearRatio}
            onChange={(e) => handleInputChange("gearRatio", e.target.value)}
            placeholder="e.g. 1.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Final Drive Ratio</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={inputs.finalDriveRatio}
            onChange={(e) => handleInputChange("finalDriveRatio", e.target.value)}
            placeholder="e.g. 3.9"
          />
        </div>
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "inches" : "meters"})</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 26" : "e.g. 0.66"}
          />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input
            type="number"
            step="1"
            min="0"
            value={inputs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
            placeholder="e.g. 4000"
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles, inches) or Metric (kilometers, meters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the gear ratio of the gear you want to analyze (e.g., 1.5 for 3rd gear).
          </li>
          <li>
            <strong>Step 3:</strong> Input the final drive ratio of your vehicle’s differential (e.g., 3.9).
          </li>
          <li>
            <strong>Step 4:</strong> Provide the tire diameter in the selected units (inches for Imperial, meters for Metric).
          </li>
          <li>
            <strong>Step 5:</strong> Enter the engine speed in RPM at which you want to calculate the vehicle speed.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see the estimated vehicle speed at the given gear and RPM.
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
            Understanding the relationship between vehicle speed, gear ratios, and engine RPM is fundamental for automotive engineers and enthusiasts alike. The speed a vehicle achieves at a given engine RPM depends on the gear ratio selected, the final drive ratio, and the size of the tires. Each gear ratio determines how many times the engine turns for one rotation of the wheels, while the final drive ratio further reduces this rotation before power reaches the wheels. Tire diameter affects how far the vehicle travels with each wheel revolution.
          </p>
          <p>
            This calculator estimates the vehicle speed at a specific gear and engine RPM by combining these factors. The formula used takes the engine RPM, multiplies it by the tire circumference and converts it into distance traveled per minute, then divides by the product of gear and final drive ratios to find the actual wheel speed. This speed is then converted into miles per hour or kilometers per hour depending on the unit system selected.
          </p>
          <p>
            While this tool does not calculate acceleration times like 0-60 mph, it provides valuable insight into how gearing and tire size influence vehicle speed at various engine speeds. This information is crucial when tuning transmissions, selecting tires, or optimizing performance for specific driving conditions.
          </p>
          <p>
            Always ensure accurate inputs for gear ratios, final drive ratios, tire diameter, and RPM to get reliable results. Remember that real-world factors such as drivetrain losses, tire slip, and aerodynamic drag are not accounted for in this simplified calculation.
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
            <strong>1. Mixing Units:</strong> Entering tire diameter in inches while using metric units or vice versa will cause incorrect speed calculations. Always match tire diameter units with the selected measurement system.
          </p>
          <p>
            <strong>2. Incorrect Gear Ratios:</strong> Using approximate or incorrect gear ratios can lead to misleading results. Verify gear and final drive ratios from reliable sources such as vehicle manuals or manufacturer specifications.
          </p>
          <p>
            <strong>3. Ignoring Tire Wear or Modifications:</strong> Tire diameter can change due to wear or aftermarket modifications, affecting speed calculations. Measure actual tire diameter for best accuracy.
          </p>
          <p>
            <strong>4. Assuming This Calculates Acceleration:</strong> This calculator estimates speed at a given RPM and gear, not acceleration times. Acceleration depends on many other factors including engine torque, vehicle mass, and traction.
          </p>
          <p>
            <strong>5. Overlooking Drivetrain Losses:</strong> Real-world speed may be slightly less due to drivetrain losses and tire slip, which are not accounted for in this simplified model.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
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