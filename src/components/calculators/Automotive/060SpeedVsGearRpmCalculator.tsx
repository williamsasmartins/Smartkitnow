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
    gearRatio: "", // Gear ratio of the selected gear
    tireDiameter: "", // Tire diameter in inches or mm
    rpm: "", // Engine RPM at that gear
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Speed (mph) = (RPM × Tire Diameter (inches) × π) / (Gear Ratio × 1056)
   * For metric: Speed (km/h) = (RPM × Tire Diameter (mm) × π) / (Gear Ratio × 30000)
   * 
   * 1056 and 30000 are constants derived from unit conversions.
   * 
   * This formula estimates vehicle speed at a given gear and engine RPM.
   */

  const results = useMemo(() => {
    const gearRatio = parseFloat(inputs.gearRatio);
    const tireDiameter = parseFloat(inputs.tireDiameter);
    const rpm = parseFloat(inputs.rpm);
    const unit = inputs.unit;

    if (!gearRatio || !tireDiameter || !rpm) {
      return {
        primary: "0",
        secondary: unit === "imperial" ? "mph" : "km/h",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting input"
      };
    }
    if (gearRatio <= 0 || tireDiameter <= 0 || rpm <= 0) {
      return {
        primary: "0",
        secondary: unit === "imperial" ? "mph" : "km/h",
        details: "Inputs must be greater than zero.",
        feedback: "Invalid input"
      };
    }

    let speed = 0;
    if (unit === "imperial") {
      // Speed in mph
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 1056);
    } else {
      // Metric: tireDiameter in mm, speed in km/h
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 30000);
    }

    const speedRounded = speed.toFixed(2);

    return {
      primary: speedRounded,
      secondary: unit === "imperial" ? "mph" : "km/h",
      details: `At ${rpm} RPM, gear ratio ${gearRatio}, tire diameter ${tireDiameter} ${unit === "imperial" ? "in" : "mm"}`,
      feedback: "Calculated speed at given gear and RPM"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does gear ratio affect the 0–60 speed calculation?",
      answer:
        "Gear ratio directly influences the vehicle's speed at a given engine RPM. A lower gear ratio means the wheels turn fewer times per engine revolution, resulting in lower speed but higher torque, ideal for acceleration. Conversely, a higher gear ratio increases speed but reduces torque. This calculator uses gear ratio to estimate speed at specific RPMs, helping understand performance characteristics."
    },
    {
      question: "Why is tire diameter important in this calculation?",
      answer:
        "Tire diameter affects the distance the vehicle travels with each wheel revolution. Larger tires cover more ground per revolution, increasing speed at the same RPM and gear ratio. Accurately inputting tire diameter ensures precise speed estimates. Using incorrect tire size can lead to significant errors in speed calculation."
    },
    {
      question: "Can this calculator estimate actual 0–60 mph times?",
      answer:
        "No, this calculator estimates vehicle speed at a given gear and RPM, not acceleration times. Actual 0–60 mph times depend on many factors including engine power, vehicle weight, traction, and driver skill. This tool helps understand speed potential at specific engine speeds but should not replace real-world testing or detailed performance modeling."
    },
    {
      question: "What units should I use for tire diameter?",
      answer:
        "Use inches for tire diameter if you select the imperial unit system, and millimeters if you select metric. Ensure the tire diameter corresponds to the actual rolling diameter of the tire, not just the rim size. Accurate tire diameter input is critical for precise speed calculations."
    },
    {
      question: "How can I use this calculator for different gears?",
      answer:
        "Input the gear ratio for the gear you want to analyze along with the engine RPM and tire diameter. The calculator will output the estimated speed at that gear and RPM. Repeat for other gears to compare speeds and understand how gear ratios affect vehicle performance across the transmission."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the vehicle speed at 4000 RPM in 3rd gear for a car with a gear ratio of 1.5 and tire diameter of 26 inches (imperial units).",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation:
          "Gear ratio = 1.5, Tire diameter = 26 inches, RPM = 4000, Unit = imperial (mph)."
      },
      {
        label: "Step 2: Apply formula",
        explanation:
          "Speed (mph) = (RPM × Tire Diameter × π) / (Gear Ratio × 1056) = (4000 × 26 × 3.1416) / (1.5 × 1056)"
      },
      {
        label: "Step 3: Calculate numerator",
        explanation: "4000 × 26 × 3.1416 = 326,725.44"
      },
      {
        label: "Step 4: Calculate denominator",
        explanation: "1.5 × 1056 = 1584"
      },
      {
        label: "Step 5: Divide numerator by denominator",
        explanation: "326,725.44 / 1584 ≈ 206.22 mph"
      }
    ],
    result: "Final Result: At 4000 RPM in 3rd gear with a 1.5 gear ratio and 26-inch tires, the vehicle speed is approximately 206.22 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How to Calculate Vehicle Speed from RPM and Gear Ratio",
      description:
        "Detailed explanation of speed calculation formulas based on gear ratios and tire sizes.",
      url: "https://www.engineeringtoolbox.com/vehicle-speed-rpm-d_1863.html"
    },
    {
      title: "Understanding Gear Ratios and Their Effect on Speed",
      description:
        "Comprehensive guide on how gear ratios impact vehicle performance and speed.",
      url: "https://www.carthrottle.com/post/understanding-gear-ratios/"
    },
    {
      title: "Tire Size and Its Effect on Speedometer Accuracy",
      description:
        "Explains how tire diameter affects speedometer readings and vehicle speed calculations.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=40"
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
          <Label>Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1.5"
            value={inputs.gearRatio}
            onChange={(e) => handleInputChange("gearRatio", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder={inputs.unit === "imperial" ? "e.g. 26" : "e.g. 660"}
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input
            type="number"
            min="0"
            step="10"
            placeholder="e.g. 4000"
            value={inputs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
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
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary} {results.secondary}
            </div>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (inches and mph) or Metric (millimeters and km/h).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the gear ratio for the gear you want to analyze. This is typically found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 3:</strong> Input the tire diameter. For imperial units, use inches; for metric, use millimeters. Ensure this is the actual rolling diameter.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the engine RPM at which you want to calculate the speed.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to see the estimated vehicle speed at the given gear and RPM.
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
            Understanding the relationship between vehicle speed, gear ratios, engine RPM, and tire size is fundamental for automotive engineers and enthusiasts alike. The speed of a vehicle at a given engine speed depends primarily on the gear ratio selected and the size of the tires. Gear ratios determine how many times the wheels turn for each revolution of the engine, while tire diameter affects the distance covered per wheel revolution.
          </p>
          <p>
            This calculator uses a well-established formula to estimate the vehicle speed based on these parameters. By inputting the gear ratio, tire diameter, and engine RPM, you can quickly determine the speed at which the vehicle will be traveling. This is particularly useful for tuning, performance analysis, and understanding how changes in gearing or tire size affect vehicle dynamics.
          </p>
          <p>
            It is important to note that this tool estimates speed at a given RPM and gear, not acceleration times such as 0–60 mph. Acceleration depends on many other factors including engine power, vehicle weight, traction, and transmission efficiency. However, this calculator provides valuable insight into the mechanical relationship between engine speed and vehicle velocity.
          </p>
          <p>
            When using this calculator, ensure that you input accurate gear ratios and tire diameters. Tire diameter should reflect the actual rolling diameter, which can differ from the nominal tire size due to tire wear or inflation pressure. Selecting the correct unit system is also crucial for accurate results.
          </p>
          <p>
            Overall, this tool is a practical resource for automotive professionals and enthusiasts to analyze and optimize vehicle performance characteristics related to gearing and speed.
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
            <strong>1. Incorrect Tire Diameter:</strong> Using the rim diameter instead of the full tire diameter leads to inaccurate speed calculations. Always use the rolling diameter, which includes the tire sidewall height.
          </p>
          <p>
            <strong>2. Wrong Units:</strong> Mixing imperial and metric units without switching the unit system causes errors. Ensure your inputs match the selected unit system.
          </p>
          <p>
            <strong>3. Ignoring Gear Ratios:</strong> Using final drive ratio or overall ratio instead of the specific gear ratio for the gear in question can misrepresent the speed.
          </p>
          <p>
            <strong>4. Overlooking RPM Limits:</strong> Calculating speed at RPMs beyond the engine’s redline or practical operating range can produce unrealistic results.
          </p>
          <p>
            <strong>5. Assuming Speed Equals Acceleration:</strong> This calculator estimates speed at a given RPM and gear, not acceleration times like 0–60 mph, which depend on many other factors.
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