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

export default function HpToTorqueConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    hp: "",
    weight: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation Logic:
   * Given Horsepower (HP) and Vehicle Weight (lbs or kg),
   * estimate 0-60 mph time (seconds) and approximate speed (mph).
   *
   * Formula for 0-60 time estimate (empirical):
   * 0-60 time ≈ 5.825 * (weight / hp)^(1/3)
   *
   * Approximate torque (lb-ft or Nm) from HP and RPM:
   * Torque = (HP * 5252) / RPM
   * 
   * Since RPM is unknown, we estimate torque at peak HP RPM ~ 5000 rpm:
   * Torque ≈ (HP * 5252) / 5000 ≈ HP * 1.05 (lb-ft)
   * For metric: Torque (Nm) = Torque (lb-ft) * 1.3558
   *
   * Output:
   * - Estimated 0-60 mph time (seconds)
   * - Estimated torque (lb-ft or Nm)
   * - Estimated speed (mph or km/h) at peak power (approximate)
   */

  const results = useMemo(() => {
    const hpNum = parseFloat(inputs.hp);
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(hpNum) || hpNum <= 0 || isNaN(weightNum) || weightNum <= 0) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "",
        feedback: "Please enter positive numeric values for horsepower and weight."
      };
    }

    // Calculate 0-60 time estimate (seconds)
    // Empirical formula: t = 5.825 * (weight/hp)^(1/3)
    const zeroToSixty = 5.825 * Math.cbrt(weightNum / hpNum);

    // Estimate torque at 5000 rpm
    // Torque (lb-ft) = (HP * 5252) / RPM
    // RPM assumed 5000 for peak power
    const torque = (hpNum * 5252) / 5000; // lb-ft

    // Convert units if metric
    let torqueDisplay = torque;
    let speedDisplay = 60; // mph or km/h for 0-60 mph or 0-100 km/h approx
    let zeroToSixtyDisplay = zeroToSixty;

    if (inputs.unit === "metric") {
      // Convert weight lbs to kg if needed (assuming input is kg)
      // Assume input weight is in kg, so no conversion needed for weight here.
      // Convert torque lb-ft to Nm
      torqueDisplay = torque * 1.3558;
      // Convert speed mph to km/h
      speedDisplay = 96.56; // 0-60 mph ~ 0-100 km/h
      // Adjust zeroToSixty to 0-100 km/h time approx (multiply by 1.15)
      zeroToSixtyDisplay = zeroToSixty * 1.15;
    }

    return {
      primary: zeroToSixtyDisplay.toFixed(2) + (inputs.unit === "imperial" ? " sec (0-60 mph)" : " sec (0-100 km/h)"),
      secondary: torqueDisplay.toFixed(1) + (inputs.unit === "imperial" ? " lb-ft torque" : " Nm torque"),
      details: `Estimated torque calculated at ~5000 RPM. Weight: ${weightNum} ${inputs.unit === "imperial" ? "lbs" : "kg"}, Horsepower: ${hpNum} HP.`,
      feedback: "This is an estimate based on typical vehicle performance formulas."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does horsepower relate to torque in a vehicle?",
      answer:
        "Horsepower and torque are closely related but measure different aspects of engine performance. Torque measures the rotational force the engine produces, while horsepower measures how quickly that work is done. Generally, horsepower is derived from torque and engine speed (RPM). Understanding both helps in evaluating a vehicle's acceleration and towing capabilities."
    },
    {
      question: "Why is vehicle weight important in estimating acceleration?",
      answer:
        "Vehicle weight significantly affects acceleration because heavier vehicles require more force to move. The power-to-weight ratio (horsepower divided by weight) is a key factor in determining how quickly a car can accelerate. Lighter cars with the same horsepower will generally accelerate faster than heavier ones."
    },
    {
      question: "Can this calculator predict exact 0-60 mph times?",
      answer:
        "No, this calculator provides an estimate based on empirical formulas and typical vehicle behavior. Actual 0-60 mph times depend on many factors including drivetrain efficiency, traction, aerodynamics, transmission, and driver skill. Use this tool as a guideline rather than an exact measurement."
    },
    {
      question: "What units should I use for weight and torque?",
      answer:
        "You can select between imperial and metric units. For imperial, weight is in pounds (lbs) and torque in pound-feet (lb-ft). For metric, weight is in kilograms (kg) and torque in Newton-meters (Nm). Ensure you input weight in the selected unit system for accurate results."
    },
    {
      question: "Why is torque estimated at 5000 RPM?",
      answer:
        "Torque varies with engine speed (RPM). Since peak horsepower usually occurs around 5000 RPM for many engines, this calculator estimates torque at that RPM to provide a consistent reference point. Actual peak torque RPM may differ by engine design."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the estimated 0-60 mph time and torque for a 300 HP sports car weighing 3500 lbs using imperial units.",
    steps: [
      {
        label: "Step 1: Input Horsepower and Weight",
        explanation: "Horsepower (HP) = 300, Weight = 3500 lbs"
      },
      {
        label: "Step 2: Calculate 0-60 mph time",
        explanation:
          "Using the formula: 0-60 time ≈ 5.825 * (weight / hp)^(1/3)\n" +
          "Calculate (3500 / 300) = 11.67\n" +
          "Cube root of 11.67 ≈ 2.28\n" +
          "Multiply by 5.825: 5.825 * 2.28 ≈ 13.28 seconds (estimate)"
      },
      {
        label: "Step 3: Estimate torque at 5000 RPM",
        explanation:
          "Torque (lb-ft) = (HP * 5252) / RPM\n" +
          "Torque = (300 * 5252) / 5000 = 315.12 lb-ft"
      }
    ],
    result: "Estimated 0-60 mph time: 13.28 seconds, Estimated torque: 315.1 lb-ft"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle performance data."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, specifications, and automotive advice."
    },
    {
      title: "How Horsepower and Torque Work",
      description: "Detailed explanation of engine power metrics by Popular Mechanics."
    },
    {
      title: "SAE International",
      description: "Standards and technical papers on automotive engineering."
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
          <Label>Horsepower (HP)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 300"
            value={inputs.hp}
            onChange={(e) => handleInputChange("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 3500" : "e.g. 1587"}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (horsepower in HP, weight in pounds) or Metric (horsepower in HP, weight in kilograms).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the engine's horsepower value in the Horsepower (HP) input field.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the vehicle's weight in the appropriate unit (lbs or kg) in the Vehicle Weight input field.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to get the estimated 0-60 mph (or 0-100 km/h) acceleration time and the approximate torque at 5000 RPM.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results displayed below the button for performance insights.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Horsepower to Torque Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between horsepower and torque is fundamental for automotive engineers, enthusiasts, and financial analysts alike. Horsepower (HP) measures the engine's ability to perform work over time, while torque quantifies the twisting force the engine generates. Together, these metrics define a vehicle's performance characteristics, including acceleration, towing capacity, and overall drivability.
          </p>
          <p>
            This calculator estimates the vehicle's 0-60 mph (or 0-100 km/h) acceleration time based on the input horsepower and vehicle weight. The formula used is an empirical approximation derived from observed performance data across various vehicles. It calculates the acceleration time by considering the power-to-weight ratio, which is a critical factor influencing how quickly a vehicle can accelerate.
          </p>
          <p>
            Additionally, the calculator estimates the engine's torque at approximately 5000 RPM, a common peak power engine speed. Torque is calculated using the formula Torque = (Horsepower × 5252) / RPM, where 5252 is a constant derived from the relationship between horsepower, torque, and RPM. This estimate provides insight into the engine's twisting force, which affects acceleration and load-carrying capabilities.
          </p>
          <p>
            It is important to note that these calculations provide estimates and should be used as guidelines. Real-world performance depends on many factors including drivetrain efficiency, aerodynamics, tire grip, transmission type, and environmental conditions. Nonetheless, this tool offers a quick and practical way to understand how horsepower and weight influence vehicle acceleration and torque.
          </p>
          <p>
            For financial analysts, understanding these performance metrics can aid in evaluating vehicle value, market positioning, and cost-benefit analyses related to automotive investments or fleet management.
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
            <strong>1. Incorrect Unit Selection:</strong> Entering weight in pounds while the calculator is set to metric units (kilograms) or vice versa will lead to inaccurate results. Always ensure the unit system matches your input values.
          </p>
          <p>
            <strong>2. Ignoring Real-World Factors:</strong> The calculator provides estimates based on simplified formulas. Factors like drivetrain losses, tire traction, and aerodynamics are not accounted for, so actual acceleration times may vary.
          </p>
          <p>
            <strong>3. Using Peak Torque RPM Incorrectly:</strong> Torque is estimated at 5000 RPM, but actual peak torque RPM varies by engine design. Using this estimate for engines with significantly different peak torque RPMs can mislead performance expectations.
          </p>
          <p>
            <strong>4. Overlooking Vehicle Condition:</strong> Vehicle modifications, maintenance, and load can affect performance. Always consider these when comparing calculated estimates to real-world data.
          </p>
          <p>
            <strong>5. Inputting Zero or Negative Values:</strong> Entering zero or negative horsepower or weight will cause calculation errors or invalid results. Always input positive numeric values.
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Horsepower to Torque Converter"
      description="Professional automotive calculator: Horsepower to Torque Converter. Get accurate estimates, expert advice, and financial insights."
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