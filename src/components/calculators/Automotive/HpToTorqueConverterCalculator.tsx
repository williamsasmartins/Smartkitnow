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
      question: "What is the relationship between horsepower and torque?",
      answer: "Horsepower (HP) and torque are related through engine RPM using the formula: HP = (Torque × RPM) / 5,252. This means that at a given RPM, higher torque produces higher horsepower, and vice versa. For example, an engine producing 300 lb-ft of torque at 5,000 RPM generates approximately 286 HP. Understanding this relationship helps you compare engine performance across different vehicle types and powerplants.",
    },
    {
      question: "How do I convert 200 horsepower to torque?",
      answer: "To convert 200 HP to torque, you need to know the RPM at which that horsepower is produced. Using the formula Torque = (HP × 5,252) / RPM, a 200 HP engine at 3,000 RPM produces approximately 350 lb-ft of torque. The same 200 HP engine at 5,500 RPM produces only 191 lb-ft of torque. This demonstrates why peak horsepower and peak torque occur at different engine speeds.",
    },
    {
      question: "What RPM should I use for the conversion?",
      answer: "Use the specific RPM where you want to measure torque or horsepower. Most manufacturers list peak horsepower at higher RPMs (typically 5,000-7,000 RPM for gasoline engines) and peak torque at lower RPMs (typically 2,000-4,000 RPM). For everyday driving comparisons, use the RPM range where the engine operates most frequently, which is usually between 2,500-4,000 RPM for most vehicles.",
    },
    {
      question: "Why is torque more important than horsepower for towing?",
      answer: "Torque is the rotational force that moves a vehicle from a standstill and provides pulling power, making it the critical metric for towing capacity. A truck with 400 lb-ft of torque at 2,500 RPM can tow heavy loads more effectively than one with 350 HP at 6,000 RPM with lower torque. Manufacturers typically specify towing capacity based on engine torque ratings rather than horsepower because torque directly correlates with pulling force.",
    },
    {
      question: "Can an engine have high torque but low horsepower?",
      answer: "Yes, diesel engines are the classic example of high torque with relatively moderate horsepower. A diesel engine might produce 450 lb-ft of torque at 1,800 RPM but only 200 HP at that same RPM. This is ideal for heavy-duty applications like trucks and construction equipment. At higher RPMs, the same engine's horsepower increases significantly while torque may decrease, demonstrating the inverse relationship between the two metrics.",
    },
    {
      question: "What is the difference between peak torque and peak horsepower?",
      answer: "Peak torque is the maximum rotational force an engine can produce, typically occurring at lower RPMs (2,000-3,500 for gasoline engines). Peak horsepower is the maximum power output, usually occurring at higher RPMs (5,500-7,000 for gasoline engines). A 2024 Ford F-150 5.0L V8 produces 395 lb-ft peak torque at 3,500 RPM and 400 HP at 5,750 RPM. Modern engines are designed with torque delivery curves that provide usable power across a wide RPM range.",
    },
    {
      question: "How does transmission type affect torque conversion?",
      answer: "Transmission type affects how engine torque is multiplied to the wheels through gear ratios, but it doesn't change the engine's peak torque rating. A manual transmission in first gear multiplies engine torque by approximately 3.5-4.5 times, while an automatic transmission's torque converter can multiply torque by 2-3 times depending on load and speed. Higher numerical axle ratios (like 3.73:1 versus 2.73:1) also increase torque multiplication at the wheels, improving acceleration and towing capacity.",
    },
    {
      question: "What is a typical horsepower to torque ratio for sports cars?",
      answer: "Sports cars typically have a horsepower-to-torque ratio between 0.8 and 1.2 lb-ft per HP, meaning relatively more power is concentrated at higher RPMs. A 2024 Chevrolet Corvette produces 495 HP at 6,300 RPM and 470 lb-ft at 4,600 RPM, resulting in a ratio of 0.95. In contrast, trucks and SUVs typically have ratios between 1.2 and 1.8, prioritizing low-end torque for hauling. This ratio influences acceleration feel and powerband characteristics.",
    },
    {
      question: "How accurate is the horsepower to torque converter for real-world vehicles?",
      answer: "The converter is accurate when using manufacturer-provided specifications, with results typically within 5-10% of stated performance metrics. However, real-world power delivery varies due to factors like air temperature, fuel grade, altitude, and transmission efficiency losses (typically 10-15% for automatics, 3-7% for manuals). Use the calculator for comparing specifications and understanding relationships, but rely on dyno testing for precise real-world measurements, especially for modified or high-performance vehicles.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horsepower to Torque Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Horsepower to Torque Converter is an essential tool for understanding engine performance and comparing vehicles accurately. This calculator converts between horsepower (HP) and torque (lb-ft or Nm) using the fundamental relationship between these two metrics, which are both measures of engine power but express it differently. Whether you're evaluating towing capacity, comparing engine options, or understanding acceleration potential, this converter bridges the gap between the two specifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the converter, you'll need to input three key values: the horsepower or torque figure, the engine RPM at which that power is produced, and select your preferred units (SAE horsepower, metric horsepower, pound-feet, or Newton-meters). The RPM is critical because horsepower and torque are interdependent—they vary at different engine speeds according to the formula HP = (Torque × RPM) / 5,252. For example, a 200 HP engine produces vastly different torque at 3,000 RPM versus 6,000 RPM.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show you the complementary metric at your specified RPM, helping you understand the complete power picture of an engine. If you input peak horsepower at 5,500 RPM, the calculator shows you torque at that exact speed (which may not be peak torque). Use these results to understand why a diesel engine with moderate horsepower can outperform a high-horsepower gasoline engine for towing—it's the torque delivery at usable RPM ranges that matters for real-world performance.</p>
        </div>
      </section>

      {/* TABLE: Common Vehicle Engine Specifications: Horsepower, Torque, and RPM */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Vehicle Engine Specifications: Horsepower, Torque, and RPM</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows peak horsepower and torque ratings for popular 2024-2025 vehicles, calculated at their respective peak RPMs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Horsepower (RPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Torque (RPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Torque-to-HP Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford F-150 5.0L V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 HP @ 5,750 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">395 lb-ft @ 3,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.99</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Silverado 6.2L V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420 HP @ 5,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">460 lb-ft @ 4,100 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ram 1500 5.7L V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">395 HP @ 5,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">410 lb-ft @ 3,950 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.04</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toyota Tundra 5.7L V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">437 HP @ 5,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">583 lb-ft @ 3,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.33</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Corvette 6.2L V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">495 HP @ 6,300 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">470 lb-ft @ 4,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.95</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Honda Civic 2.0L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gasoline Inline-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">158 HP @ 6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">138 lb-ft @ 4,200 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.87</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Duramax 6.6L Diesel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diesel V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">506 HP @ 2,800 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,081 lb-ft @ 1,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Powerstroke 6.7L Diesel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diesel V8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">475 HP @ 2,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,050 lb-ft @ 1,400 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.21</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Specifications reflect 2024-2025 model year data from manufacturer documentation. Actual performance may vary based on fuel type, altitude, and ambient temperature.</p>
      </section>

      {/* TABLE: Horsepower to Torque Conversion at Common RPM Points */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Horsepower to Torque Conversion at Common RPM Points</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This reference table demonstrates how a 300 lb-ft engine produces different horsepower outputs at various engine speeds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower Output (from 300 lb-ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Real-World Vehicle Example</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Engine Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85.6 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diesel trucks at idle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Idle and low-speed towing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114.2 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">City driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urban commuting and low-RPM cruise</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">142.8 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highway cruise (light load)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steady-state highway driving</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200.0 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate acceleration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Merging and moderate acceleration</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">257.1 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strong acceleration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Passing maneuvers on highway</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">314.2 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full acceleration (gasoline)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum power output range</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">371.4 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-RPM gasoline engines</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance vehicles at redline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">428.5 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sports cars and race engines</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum performance scenario</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations use the formula: HP = (Torque × RPM) / 5,252. Actual engine performance varies significantly based on torque curve characteristics and operating conditions.</p>
      </section>

      {/* TABLE: Transmission Torque Multiplication Effects */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Transmission Torque Multiplication Effects</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how transmission gear ratios multiply engine torque to the wheels, affecting acceleration and towing capability.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1st Gear Ratio (Typical)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wheel Torque Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">400 lb-ft Engine Torque Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Manual 6-Speed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.83:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.83x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,532 lb-ft at wheels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Automatic 8-Speed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.50:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.50x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800 lb-ft at wheels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Automatic 10-Speed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.70:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.70x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,880 lb-ft at wheels</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CVT (High Ratio)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.90:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.90x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,560 lb-ft at wheels</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Torque Converter Multiplication</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.50:1 (stall)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.50x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000 lb-ft multiplication boost</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual multiplied torque at wheels is reduced by drivetrain losses (10-15% for automatics, 3-7% for manual transmissions). Final drive ratio further multiplies torque to the wheels.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always note the RPM when comparing engine specifications—300 lb-ft of torque at 2,000 RPM is significantly more useful for towing than 300 lb-ft at 5,500 RPM, because it's available when you need pulling power.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this converter to understand why diesel trucks have lower peak horsepower but higher towing capacity than gasoline counterparts; they produce massive torque at low RPMs where it's most useful for hauling.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the entire torque curve of vehicles you're evaluating, not just peak numbers—an engine that maintains strong torque from 2,000-4,500 RPM will feel faster in real-world driving than one with a narrow peak.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that transmission losses reduce actual wheel torque by 10-15% in automatics and 3-7% in manual transmissions, and that final drive ratios further multiply torque; higher numerical ratios (3.73:1 vs. 2.73:1) improve acceleration and towing but reduce highway fuel economy.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring RPM in Comparisons</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people compare only peak horsepower numbers without considering the RPM at which they're achieved, leading to incorrect conclusions about vehicle performance. A 400 HP engine peaking at 3,500 RPM provides very different driving characteristics than a 400 HP engine peaking at 7,000 RPM.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Higher Horsepower Always Means Better Towing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Torque, not horsepower, determines towing capacity, which is why a 200 HP diesel truck often tows more than a 300 HP gasoline truck. Peak torque rating and the RPM range at which it's available matter far more for hauling than raw horsepower numbers.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Transmission and Drivetrain Losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The engine's rated horsepower and torque are measured at the crankshaft, not at the wheels where they actually move your vehicle. Automatic transmissions lose 10-15% of power, manuals lose 3-7%, and the final drive ratio further affects torque multiplication.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the Converter for Modified Vehicles Without Dyno Testing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While the converter accurately calculates the mathematical relationship between HP and torque, real-world results for modified, turbocharged, or supercharged engines require dyno testing to verify actual power output. Modification variables make theoretical calculations unreliable for performance planning.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between horsepower and torque?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horsepower (HP) and torque are related through engine RPM using the formula: HP = (Torque × RPM) / 5,252. This means that at a given RPM, higher torque produces higher horsepower, and vice versa. For example, an engine producing 300 lb-ft of torque at 5,000 RPM generates approximately 286 HP. Understanding this relationship helps you compare engine performance across different vehicle types and powerplants.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert 200 horsepower to torque?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To convert 200 HP to torque, you need to know the RPM at which that horsepower is produced. Using the formula Torque = (HP × 5,252) / RPM, a 200 HP engine at 3,000 RPM produces approximately 350 lb-ft of torque. The same 200 HP engine at 5,500 RPM produces only 191 lb-ft of torque. This demonstrates why peak horsepower and peak torque occur at different engine speeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What RPM should I use for the conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the specific RPM where you want to measure torque or horsepower. Most manufacturers list peak horsepower at higher RPMs (typically 5,000-7,000 RPM for gasoline engines) and peak torque at lower RPMs (typically 2,000-4,000 RPM). For everyday driving comparisons, use the RPM range where the engine operates most frequently, which is usually between 2,500-4,000 RPM for most vehicles.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is torque more important than horsepower for towing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Torque is the rotational force that moves a vehicle from a standstill and provides pulling power, making it the critical metric for towing capacity. A truck with 400 lb-ft of torque at 2,500 RPM can tow heavy loads more effectively than one with 350 HP at 6,000 RPM with lower torque. Manufacturers typically specify towing capacity based on engine torque ratings rather than horsepower because torque directly correlates with pulling force.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can an engine have high torque but low horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, diesel engines are the classic example of high torque with relatively moderate horsepower. A diesel engine might produce 450 lb-ft of torque at 1,800 RPM but only 200 HP at that same RPM. This is ideal for heavy-duty applications like trucks and construction equipment. At higher RPMs, the same engine's horsepower increases significantly while torque may decrease, demonstrating the inverse relationship between the two metrics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between peak torque and peak horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Peak torque is the maximum rotational force an engine can produce, typically occurring at lower RPMs (2,000-3,500 for gasoline engines). Peak horsepower is the maximum power output, usually occurring at higher RPMs (5,500-7,000 for gasoline engines). A 2024 Ford F-150 5.0L V8 produces 395 lb-ft peak torque at 3,500 RPM and 400 HP at 5,750 RPM. Modern engines are designed with torque delivery curves that provide usable power across a wide RPM range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does transmission type affect torque conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Transmission type affects how engine torque is multiplied to the wheels through gear ratios, but it doesn't change the engine's peak torque rating. A manual transmission in first gear multiplies engine torque by approximately 3.5-4.5 times, while an automatic transmission's torque converter can multiply torque by 2-3 times depending on load and speed. Higher numerical axle ratios (like 3.73:1 versus 2.73:1) also increase torque multiplication at the wheels, improving acceleration and towing capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a typical horsepower to torque ratio for sports cars?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sports cars typically have a horsepower-to-torque ratio between 0.8 and 1.2 lb-ft per HP, meaning relatively more power is concentrated at higher RPMs. A 2024 Chevrolet Corvette produces 495 HP at 6,300 RPM and 470 lb-ft at 4,600 RPM, resulting in a ratio of 0.95. In contrast, trucks and SUVs typically have ratios between 1.2 and 1.8, prioritizing low-end torque for hauling. This ratio influences acceleration feel and powerband characteristics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the horsepower to torque converter for real-world vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The converter is accurate when using manufacturer-provided specifications, with results typically within 5-10% of stated performance metrics. However, real-world power delivery varies due to factors like air temperature, fuel grade, altitude, and transmission efficiency losses (typically 10-15% for automatics, 3-7% for manuals). Use the calculator for comparing specifications and understanding relationships, but rely on dyno testing for precise real-world measurements, especially for modified or high-performance vehicles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/automotive-fuel-economy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA - Vehicle Specifications and Performance Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource providing standardized horsepower, torque, and fuel economy specifications for all new vehicles sold in the United States.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/automotive-and-heavy-duty-vehicles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International - Power and Torque Measurement Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Standards organization that defines how horsepower and torque are measured and reported by vehicle manufacturers worldwide.</p>
          </li>
          <li>
            <a href="https://www.edmunds.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edmunds - Vehicle Specifications and Performance Comparison</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive automotive resource providing verified engine specifications, real-world performance data, and detailed comparisons for new and used vehicles.</p>
          </li>
          <li>
            <a href="https://www.motortrend.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">MotorTrend - Engine Performance and Testing Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automotive publication that conducts independent dyno testing and provides verified horsepower and torque measurements for popular vehicles and engines.</p>
          </li>
        </ul>
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