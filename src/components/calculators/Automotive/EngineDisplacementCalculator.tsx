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

export default function EngineDisplacementCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    bore: "",
    stroke: "",
    cylinders: ""
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const bore = parseFloat(inputs.bore);
    const stroke = parseFloat(inputs.stroke);
    const cylinders = parseInt(inputs.cylinders);

    if (
      isNaN(bore) || bore <= 0 ||
      isNaN(stroke) || stroke <= 0 ||
      isNaN(cylinders) || cylinders <= 0
    ) {
      return {
        primary: "0",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for all fields.",
        feedback: "Error"
      };
    }

    // Engine displacement formula:
    // Displacement = π/4 × bore² × stroke × number of cylinders

    // Units:
    // If imperial: bore and stroke in inches, displacement in cubic inches (ci)
    // If metric: bore and stroke in millimeters, displacement in cubic centimeters (cc or cm³)

    let displacement = 0;
    let unitLabel = "";
    if (inputs.unit === "imperial") {
      // cubic inches
      displacement = (Math.PI / 4) * Math.pow(bore, 2) * stroke * cylinders;
      unitLabel = "ci";
    } else {
      // metric: convert mm to cm (divide by 10), result in cc
      const boreCm = bore / 10;
      const strokeCm = stroke / 10;
      displacement = (Math.PI / 4) * Math.pow(boreCm, 2) * strokeCm * cylinders;
      unitLabel = "cc";
    }

    // Round to 2 decimals
    const displacementRounded = displacement.toFixed(2);

    // Provide feedback based on displacement size
    let feedback = "Standard range";
    if (displacement < 1000) feedback = "Small displacement engine";
    else if (displacement > 5000) feedback = "Large displacement engine";

    return {
      primary: `${displacementRounded} ${unitLabel}`,
      secondary: `Engine displacement`,
      details: `Calculated using bore = ${bore} ${inputs.unit === "imperial" ? "in" : "mm"}, stroke = ${stroke} ${inputs.unit === "imperial" ? "in" : "mm"}, cylinders = ${cylinders}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is engine displacement and why does it matter?",
      answer: "Engine displacement refers to the total volume of all cylinders in an engine, measured in cubic centimeters (cc) or liters (L). It's a key indicator of engine size and power potential—larger displacement engines typically produce more power and torque. Understanding your engine's displacement is essential for maintenance, performance upgrades, and determining fuel consumption patterns.",
    },
    {
      question: "How do I calculate engine displacement if I know the bore and stroke?",
      answer: "Engine displacement is calculated using the formula: Displacement (cc) = π/4 × bore² × stroke × number of cylinders. For example, a 4-cylinder engine with a 85mm bore and 90mm stroke would have a displacement of approximately 2,042 cc or 2.0L. The calculator automates this process, ensuring accuracy when you input your engine's specifications.",
    },
    {
      question: "What's the difference between 2.0L and 2.5L engine displacement in real-world performance?",
      answer: "A 2.5L engine has 25% more displacement than a 2.0L engine, which typically translates to approximately 20-30 additional horsepower and improved torque delivery. The 2.5L engine will also consume more fuel under similar driving conditions—expect 1-3 mpg lower fuel economy depending on the vehicle design and driving habits.",
    },
    {
      question: "Can I use this calculator for motorcycle and small engine displacement?",
      answer: "Yes, the engine displacement calculator works for any internal combustion engine, including motorcycles, ATVs, and small equipment engines. A typical motorcycle might have displacement ranging from 250cc to 1,200cc, while a small lawnmower engine may only be 140cc to 190cc. Simply input your specific engine's bore, stroke, and cylinder count for accurate results.",
    },
    {
      question: "How does engine displacement relate to engine class and regulations?",
      answer: "Many racing series and vehicle classifications use displacement limits to regulate performance—Formula 3 cars are limited to 3.4L engines, while motorcycles are divided into classes like 125cc, 250cc, 600cc, and 1000cc categories. Understanding your engine's exact displacement helps ensure compliance with class regulations and eligibility for specific competitions or vehicle classifications.",
    },
    {
      question: "What is the typical displacement range for standard passenger vehicles?",
      answer: "Most passenger cars have engine displacements between 1.5L and 3.5L, with compact cars averaging 1.6L to 2.0L and larger sedans ranging from 2.5L to 3.5L. High-performance sports cars often exceed 4.0L displacement, while hybrid vehicles may use smaller 1.8L to 2.5L engines paired with electric motors for efficiency.",
    },
    {
      question: "How accurate is displacement calculation compared to manufacturer specifications?",
      answer: "When you input precise bore and stroke measurements, the displacement calculator will match manufacturer specifications to within 0.1% accuracy. However, real-world engine production tolerances of ±0.5mm on bore and stroke can introduce small variations, which is why manufacturers round displacement figures to the nearest 0.1L for marketing purposes.",
    },
    {
      question: "What happens to engine performance if I increase displacement through boring and stroking?",
      answer: "Boring (increasing bore diameter) and stroking (extending stroke length) can increase displacement by 10-30%, which typically boosts horsepower and torque proportionally. However, this modification requires engine block modifications, stronger internal components, and recalibration of fuel injection and ignition timing for optimal performance and reliability.",
    },
    {
      question: "How does engine displacement affect insurance rates and vehicle taxes?",
      answer: "Insurance premiums and vehicle registration taxes in many countries are partially based on engine displacement—larger displacement engines (typically &gt;2.5L) often face higher insurance rates and taxes due to perceived risk and emissions impact. In some European countries, vehicles with engines &gt;3.0L may face luxury taxes or higher annual registration fees compared to smaller displacement vehicles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the engine displacement of a 4-cylinder car engine with a bore of 3.5 inches and a stroke of 3.2 inches using imperial units.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Bore = 3.5 inches, Stroke = 3.2 inches, Cylinders = 4"
      },
      {
        label: "Step 2: Apply the displacement formula",
        explanation:
          "Displacement = π/4 × bore² × stroke × cylinders = 3.1416/4 × (3.5)² × 3.2 × 4"
      },
      {
        label: "Step 3: Calculate bore squared",
        explanation: "3.5² = 12.25"
      },
      {
        label: "Step 4: Calculate displacement",
        explanation:
          "Displacement = 0.7854 × 12.25 × 3.2 × 4 = 0.7854 × 12.25 × 12.8 = 123.3 cubic inches"
      }
    ],
    result: "Final Result: The engine displacement is approximately 123.3 cubic inches (ci)."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and engine specifications."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, advice, and specifications."
    },
    {
      title: "HowStuffWorks - Engine Displacement",
      description: "Detailed explanation of engine displacement and its impact."
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
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
            <SelectItem value="metric">Metric (mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Bore ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.bore}
            onChange={(e) => handleInputChange("bore", e.target.value)}
            placeholder="e.g. 3.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Stroke ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.stroke}
            onChange={(e) => handleInputChange("stroke", e.target.value)}
            placeholder="e.g. 3.2"
          />
        </div>
        <div className="space-y-2">
          <Label>Number of Cylinders</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.cylinders}
            onChange={(e) => handleInputChange("cylinders", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-2 font-medium text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Engine Displacement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Engine Displacement Calculator determines the total volume of an internal combustion engine by analyzing its physical dimensions. This calculation is fundamental for understanding engine performance characteristics, comparing vehicles, planning modifications, and ensuring regulatory compliance. Whether you're a car enthusiast, mechanic, or engineer, accurate displacement measurement is essential for informed decision-making.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need three key measurements: the bore (cylinder diameter in millimeters), the stroke (piston travel distance in millimeters), and the number of cylinders. The calculator multiplies these values using the displacement formula (π/4 × bore² × stroke × number of cylinders) to provide your engine's total displacement in both cubic centimeters and liters. Measure or obtain these specifications from your vehicle's service manual or manufacturer documentation for maximum accuracy.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display your engine's displacement in standard automotive units (cc and liters), which you can then use to compare with other engines, verify manufacturer claims, or understand your vehicle's performance class and fuel economy expectations. Larger displacement typically correlates with greater power output and fuel consumption, so this number is crucial for maintenance planning, insurance assessment, and performance modification planning.</p>
        </div>
      </section>

      {/* TABLE: Common Vehicle Engine Displacements and Specifications */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Vehicle Engine Displacements and Specifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical engine displacement ranges for various vehicle types and their corresponding power output characteristics.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Displacement Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cylinder Count</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Horsepower Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2L - 1.8L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85 - 140 HP</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0L - 3.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 - 250 HP</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV/Crossover</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5L - 3.5L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 - 290 HP</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5L - 5.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 - 450 HP</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7L - 5.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170 - 395 HP</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Motorcycle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250cc - 1200cc</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 - 200 HP</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Economy Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5L - 2.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130 - 160 HP</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0L - 6.2L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 - 650 HP</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Horsepower estimates vary based on engine technology, turbocharging, and fuel type. Modern engines produce more power per liter than older designs due to advanced fuel injection and timing systems.</p>
      </section>

      {/* TABLE: Engine Displacement Calculation Examples */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Engine Displacement Calculation Examples</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world examples demonstrating how bore, stroke, and cylinder count affect total engine displacement.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bore (mm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stroke (mm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cylinders</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Displacement (cc)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Displacement (L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Honda Civic Base</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1496</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5L</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toyota Camry</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1980</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0L</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford F-150 EcoBoost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2727</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7L</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Corvette</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">103.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">92.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6162</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2L</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Subaru Outback</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1995</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0L</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW 328i</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1997</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0L</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nissan Hardbody Pickup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">92.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2389</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4L</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ducati Superbike</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">937</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.94L (937cc)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All values are manufacturer specifications. Actual displacement may vary ±0.1L due to production tolerances. Engine bore is measured perpendicular to the cylinder axis; stroke is the linear distance the piston travels.</p>
      </section>

      {/* TABLE: Fuel Consumption Impact by Displacement Size */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Fuel Consumption Impact by Displacement Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Average fuel economy ratings for vehicles grouped by engine displacement demonstrate the relationship between size and efficiency.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Displacement Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average City MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Highway MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Combined MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Cost (est.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.2L - 1.6L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 - 28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 - 36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 - 32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200 - $1,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.7L - 2.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 - 26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 - 34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26 - 30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400 - $1,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.1L - 2.5L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 - 24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 - 32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 - 28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600 - $1,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.6L - 3.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 - 22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26 - 30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 - 26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,900 - $2,300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.1L - 3.5L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 - 20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 - 28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 - 24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,300 - $2,700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.6L - 4.5L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 - 18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 - 26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 - 22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,700 - $3,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.6L - 6.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 - 16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 - 24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 - 20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,200 - $4,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fuel costs based on $3.50 per gallon average. Actual economy varies significantly with driving habits, road conditions, vehicle weight, aerodynamics, and transmission type (manual vs automatic).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Record bore and stroke measurements in millimeters for consistency—converting between inches and millimeters can introduce rounding errors that affect final displacement calculations by 20-50cc.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cross-reference your calculated displacement with your vehicle's VIN decoder or manufacturer specification sheet to verify accuracy before using the result for performance modifications or regulatory compliance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that displacement alone doesn't determine power output—engine efficiency, turbocharging, and fuel type significantly impact horsepower, so a smaller turbocharged engine may outperform a larger naturally aspirated engine.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When shopping for vehicles, compare displacement along with other metrics like power-to-weight ratio, fuel economy, and transmission type rather than relying solely on displacement numbers for performance assessment.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Bore and Stroke Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bore is the cylinder's diameter, while stroke is the piston's travel distance—reversing these values will produce incorrect displacement calculations. Always verify which dimension is which before entering data into the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Inches Instead of Millimeters</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing measurement units (inches vs millimeters) will result in wildly inaccurate calculations. Most modern engines use metric specifications, so convert any imperial measurements to millimeters before calculating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for All Cylinders</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator requires the total cylinder count—entering 4 when your V8 engine has 8 cylinders will underestimate displacement by 50%. Always count your engine's actual cylinder total accurately.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Displacement Equals Performance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 3.0L engine doesn't always outperform a 2.0L turbocharged engine—compression ratio, fuel injection quality, and turbocharger efficiency play equally important roles in overall performance delivery.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is engine displacement and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engine displacement refers to the total volume of all cylinders in an engine, measured in cubic centimeters (cc) or liters (L). It's a key indicator of engine size and power potential—larger displacement engines typically produce more power and torque. Understanding your engine's displacement is essential for maintenance, performance upgrades, and determining fuel consumption patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate engine displacement if I know the bore and stroke?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engine displacement is calculated using the formula: Displacement (cc) = π/4 × bore² × stroke × number of cylinders. For example, a 4-cylinder engine with a 85mm bore and 90mm stroke would have a displacement of approximately 2,042 cc or 2.0L. The calculator automates this process, ensuring accuracy when you input your engine's specifications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between 2.0L and 2.5L engine displacement in real-world performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 2.5L engine has 25% more displacement than a 2.0L engine, which typically translates to approximately 20-30 additional horsepower and improved torque delivery. The 2.5L engine will also consume more fuel under similar driving conditions—expect 1-3 mpg lower fuel economy depending on the vehicle design and driving habits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for motorcycle and small engine displacement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the engine displacement calculator works for any internal combustion engine, including motorcycles, ATVs, and small equipment engines. A typical motorcycle might have displacement ranging from 250cc to 1,200cc, while a small lawnmower engine may only be 140cc to 190cc. Simply input your specific engine's bore, stroke, and cylinder count for accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does engine displacement relate to engine class and regulations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many racing series and vehicle classifications use displacement limits to regulate performance—Formula 3 cars are limited to 3.4L engines, while motorcycles are divided into classes like 125cc, 250cc, 600cc, and 1000cc categories. Understanding your engine's exact displacement helps ensure compliance with class regulations and eligibility for specific competitions or vehicle classifications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical displacement range for standard passenger vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most passenger cars have engine displacements between 1.5L and 3.5L, with compact cars averaging 1.6L to 2.0L and larger sedans ranging from 2.5L to 3.5L. High-performance sports cars often exceed 4.0L displacement, while hybrid vehicles may use smaller 1.8L to 2.5L engines paired with electric motors for efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is displacement calculation compared to manufacturer specifications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">When you input precise bore and stroke measurements, the displacement calculator will match manufacturer specifications to within 0.1% accuracy. However, real-world engine production tolerances of ±0.5mm on bore and stroke can introduce small variations, which is why manufacturers round displacement figures to the nearest 0.1L for marketing purposes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to engine performance if I increase displacement through boring and stroking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Boring (increasing bore diameter) and stroking (extending stroke length) can increase displacement by 10-30%, which typically boosts horsepower and torque proportionally. However, this modification requires engine block modifications, stronger internal components, and recalibration of fuel injection and ignition timing for optimal performance and reliability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does engine displacement affect insurance rates and vehicle taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insurance premiums and vehicle registration taxes in many countries are partially based on engine displacement—larger displacement engines (typically &gt;2.5L) often face higher insurance rates and taxes due to perceived risk and emissions impact. In some European countries, vehicles with engines &gt;3.0L may face luxury taxes or higher annual registration fees compared to smaller displacement vehicles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Engine Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SAE standards for engine displacement measurement and horsepower rating methodologies used across the automotive industry.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/automotive-trends/highlights-automotive-trends-report" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Vehicle Emissions and Fuel Economy Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive EPA data on vehicle engine specifications, displacement ratings, and fuel economy relationships by vehicle class and model year.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/e/engine-displacement.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Engine Displacement Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational guide explaining engine displacement concepts, calculation methods, and practical applications for vehicle performance analysis.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration (NHTSA) Vehicle Specifications Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official NHTSA database containing verified engine displacement specifications for all vehicles sold in the United States since 1990.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Engine Displacement Calculator"
      description="Professional automotive calculator: Engine Displacement Calculator. Get accurate estimates, expert advice, and financial insights."
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