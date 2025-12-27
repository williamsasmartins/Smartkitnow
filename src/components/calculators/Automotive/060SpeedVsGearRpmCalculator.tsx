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
   * Speed (mph) = (RPM × Tire Diameter (in) × π) / (Gear Ratio × Final Drive Ratio × 1056)
   * 1056 is a constant to convert inches per minute to mph.
   * 
   * We solve for speed given gear ratio, final drive ratio, tire diameter, and RPM.
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

    // Calculate speed in mph
    const speedMph = (rpm * tireDiameter * Math.PI) / (gearRatio * finalDriveRatio * 1056);

    // Convert to km/h if metric
    const speedKph = speedMph * 1.60934;

    const speed = inputs.unit === "imperial" ? speedMph : speedKph;
    const unitLabel = inputs.unit === "imperial" ? "mph" : "km/h";

    return {
      primary: speed.toFixed(2),
      secondary: `${unitLabel}`,
      details: `Calculated speed at ${rpm} RPM in gear ratio ${gearRatio} with final drive ${finalDriveRatio} and tire diameter ${tireDiameter} inches.`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does gear ratio affect the 0–60 speed calculation?",
      answer:
        "Gear ratio directly influences the speed at a given engine RPM. A higher gear ratio means the engine turns more times for each wheel rotation, resulting in lower vehicle speed at the same RPM. Conversely, a lower gear ratio increases speed at the same RPM. This calculator uses gear ratio along with final drive and tire size to estimate speed accurately."
    },
    {
      question: "Why is tire diameter important in this calculation?",
      answer:
        "Tire diameter determines the distance the vehicle travels per wheel revolution. Larger tires cover more ground per rotation, increasing vehicle speed at a given RPM and gear ratio. Using the correct tire diameter ensures the speed estimate reflects real-world conditions accurately."
    },
    {
      question: "Can I use this calculator for both manual and automatic transmissions?",
      answer:
        "Yes, this calculator applies to any transmission type as long as you know the gear ratio for the gear in question and the final drive ratio. It calculates the theoretical speed at a given RPM in that gear, regardless of transmission type."
    },
    {
      question: "What units should I use for tire diameter?",
      answer:
        "Tire diameter should be entered in inches for this calculator. If you know your tire size in metric units, convert it to inches before inputting. This ensures the formula calculates speed correctly."
    },
    {
      question: "Why does the calculator use a constant of 1056 in the formula?",
      answer:
        "The constant 1056 converts the units from inches per minute to miles per hour. It accounts for the circumference of the tire and the conversion factors between inches, feet, miles, and minutes, enabling the formula to output speed in mph."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the vehicle speed at 4000 RPM in 3rd gear of a sports car with a 3.5:1 gear ratio, 3.91 final drive ratio, and 26-inch diameter tires.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation:
          "Gear Ratio = 3.5, Final Drive Ratio = 3.91, Tire Diameter = 26 inches, RPM = 4000"
      },
      {
        label: "Step 2: Apply the formula",
        explanation:
          "Speed (mph) = (RPM × Tire Diameter × π) / (Gear Ratio × Final Drive Ratio × 1056)"
      },
      {
        label: "Step 3: Calculate numerator",
        explanation:
          "4000 × 26 × 3.1416 = 326,725.44"
      },
      {
        label: "Step 4: Calculate denominator",
        explanation:
          "3.5 × 3.91 × 1056 = 14,468.16"
      },
      {
        label: "Step 5: Calculate speed",
        explanation:
          "Speed = 326,725.44 / 14,468.16 ≈ 22.59 mph"
      }
    ],
    result: "Final Result: At 4000 RPM in 3rd gear, the car travels approximately 22.59 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Gear Ratios Affect Vehicle Speed",
      description: "Detailed explanation of gear ratios and their impact on speed and acceleration.",
      url: "https://www.engineeringtoolbox.com/gear-ratios-d_1849.html"
    },
    {
      title: "Tire Size Calculator and Speedometer Correction",
      description: "Resource for calculating tire diameter and its effect on vehicle speed.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=43"
    },
    {
      title: "RPM to Speed Calculator",
      description: "Online tools and formulas for converting engine RPM to vehicle speed.",
      url: "https://www.omnicalculator.com/physics/rpm-to-speed"
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
            <SelectItem value="imperial">Imperial (mph)</SelectItem>
            <SelectItem value="metric">Metric (km/h)</SelectItem>
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
          <Label>Tire Diameter (inches)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
            placeholder="Enter tire diameter"
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
            placeholder="Enter engine RPM"
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (mph) or Metric (km/h).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the gear ratio of the gear you want to analyze (e.g., 3.5 for 3rd gear).
          </li>
          <li>
            <strong>Step 3:</strong> Input the final drive ratio of your vehicle’s differential (e.g., 3.91).
          </li>
          <li>
            <strong>Step 4:</strong> Provide the tire diameter in inches. This can be measured or calculated from tire specs.
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
            Understanding the relationship between engine RPM, gear ratios, and vehicle speed is fundamental for automotive engineers and enthusiasts alike. The gear ratio determines how many times the engine turns for each rotation of the wheels. Combined with the final drive ratio, which is the gear reduction in the differential, these ratios define how engine power translates into wheel speed.
          </p>
          <p>
            Tire diameter plays a crucial role because it affects the circumference of the wheel, which directly impacts the distance traveled per wheel revolution. Larger tires cover more ground per rotation, increasing vehicle speed at a given RPM and gear ratio. This calculator uses a well-established formula to estimate vehicle speed based on these parameters, allowing users to predict how fast a car will be traveling at a specific engine speed in a given gear.
          </p>
          <p>
            This tool is particularly useful for tuning, performance analysis, and understanding how modifications such as changing tire size or gear ratios affect vehicle dynamics. By inputting accurate values, users can gain insights into their vehicle’s behavior without needing expensive testing equipment.
          </p>
          <p>
            Remember, this calculation assumes no wheel slip and ideal conditions. Real-world factors like tire wear, road conditions, and drivetrain losses can affect actual speed.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Tire Diameter:</strong> Using the tire width or rim diameter instead of the full tire diameter leads to inaccurate speed calculations. Always use the overall tire diameter including the tire sidewall height.
          </p>
          <p>
            <strong>2. Confusing Gear Ratios:</strong> Mixing up gear ratio and final drive ratio or entering them incorrectly can skew results. Verify each value carefully from your vehicle’s specifications.
          </p>
          <p>
            <strong>3. Ignoring Units:</strong> Tire diameter must be in inches for this calculator. Using centimeters or millimeters without conversion will produce wrong speeds.
          </p>
          <p>
            <strong>4. Assuming Constant RPM:</strong> Engine RPM varies during acceleration; this calculator estimates speed at a fixed RPM, not the full 0–60 acceleration time.
          </p>
          <p>
            <strong>5. Overlooking Real-World Factors:</strong> This model assumes no wheel slip, perfect traction, and no drivetrain losses, which is rarely the case in practice.
          </p>
        </div>
      </section>

      {/* 4. REAL WORLD EXAMPLE */}
      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          {example.steps.map((step, i) => (
            <div key={i}>
              <h3 className="font-semibold">{step.label}</h3>
              <p>{step.explanation}</p>
            </div>
          ))}
          <p className="font-bold">{example.result}</p>
        </div>
      </section>

      {/* 5. FAQ */}
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

      {/* 6. REFERENCES */}
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