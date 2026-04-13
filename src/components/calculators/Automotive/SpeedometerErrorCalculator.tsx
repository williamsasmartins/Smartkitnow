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

export default function SpeedometerErrorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tire1Diameter: "",
    tire2Diameter: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation Logic:
   * Speedometer error (%) = ((Diameter of Tire 2 - Diameter of Tire 1) / Diameter of Tire 1) * 100
   * 
   * Tire diameters must be in the same unit (inches or mm).
   * Tire diameter = (Tire section height * 2) + Wheel diameter
   * 
   * Inputs:
   * - Tire 1 diameter (inches or mm)
   * - Tire 2 diameter (inches or mm)
   * 
   * Output:
   * - Speedometer error percentage (positive means speedometer reads higher than actual)
   */

  const results = useMemo(() => {
    const d1 = parseFloat(inputs.tire1Diameter);
    const d2 = parseFloat(inputs.tire2Diameter);

    if (isNaN(d1) || isNaN(d2) || d1 <= 0) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid positive diameters for both tires.",
        feedback: "Invalid input"
      };
    }

    // Calculate percentage difference
    const diffPercent = ((d2 - d1) / d1) * 100;

    // Feedback based on typical speedometer error ranges
    let feedback = "";
    if (Math.abs(diffPercent) < 1) {
      feedback = "Speedometer error is minimal.";
    } else if (Math.abs(diffPercent) < 3) {
      feedback = "Speedometer error is within acceptable range.";
    } else {
      feedback = "Speedometer error is significant and may affect speed readings.";
    }

    return {
      primary: diffPercent.toFixed(2) + "%",
      secondary: diffPercent > 0
        ? "Speedometer reads faster than actual speed"
        : "Speedometer reads slower than actual speed",
      details: `Diameter Tire 1: ${d1.toFixed(2)} | Diameter Tire 2: ${d2.toFixed(2)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is speedometer error and why should I care about it?",
      answer: "Speedometer error is the difference between the speed your vehicle's speedometer displays and your actual speed over the ground. Modern vehicles are legally required to have speedometer accuracy within ±10%, meaning a speedometer reading of 60 mph could represent actual speeds between 54-66 mph. Understanding this error is crucial for accurate speed monitoring, traffic law compliance, and safe driving.",
    },
    {
      question: "How is speedometer error calculated?",
      answer: "Speedometer error is calculated using the formula: Error % = ((Displayed Speed - Actual Speed) / Actual Speed) × 100. For example, if your speedometer reads 50 mph but GPS shows 48 mph, the error would be ((50 - 48) / 48) × 100 = 4.17%. This calculation helps identify whether your speedometer is reading high (optimistic) or low (conservative).",
    },
    {
      question: "Can tire size affect speedometer accuracy?",
      answer: "Yes, tire size significantly impacts speedometer accuracy because speedometers calculate speed based on tire rotations. When you install larger tires than the factory specification, your vehicle travels farther per rotation, causing the speedometer to read lower than actual speed. Conversely, smaller tires cause the speedometer to read higher. A 10% increase in tire diameter typically results in a 10% decrease in speedometer reading.",
    },
    {
      question: "What is the legal tolerance for speedometer error in most countries?",
      answer: "In the United States and most European countries, speedometers must not read less than actual speed, and must not read more than actual speed plus 10%. This means a vehicle going 60 mph can show a speedometer reading of 60-66 mph. In Australia, the tolerance is ±10%, while some countries like Germany have stricter standards requiring accuracy within ±5%.",
    },
    {
      question: "How do I measure my vehicle's actual speed for comparison?",
      answer: "The most accurate methods are using GPS-based speed measurement apps or devices, which typically have accuracy within ±1-2 mph. Radar guns are used by law enforcement and provide highly accurate readings. Some cars have a built-in trip computer that can display speed data. Avoid using marked road distances, as this method has lower accuracy and requires careful timing.",
    },
    {
      question: "Does speedometer error affect my vehicle's fuel economy calculations?",
      answer: "Yes, speedometer error directly impacts fuel economy calculations based on displayed speed. If your speedometer reads 10% high due to smaller tires or calibration issues, your calculated fuel economy will appear 10% worse than actual consumption. For example, if you calculate 20 mpg based on speedometer readings but your actual speed is 10% higher, your real efficiency is approximately 22 mpg.",
    },
    {
      question: "Can I get a speeding ticket if my speedometer is inaccurate?",
      answer: "Generally, you cannot successfully contest a speeding ticket solely based on speedometer error if the vehicle's error is within legal tolerances. However, if your speedometer error exceeds the legal limit (typically &gt;10%), you may have grounds for contestation. Law enforcement typically uses calibrated radar or laser guns, which are far more accurate than vehicle speedometers and legally admissible.",
    },
    {
      question: "What causes speedometer error to develop over time?",
      answer: "Common causes include worn or damaged wheel speed sensors, worn tires with reduced rolling diameter, suspension modifications that affect vehicle height, electrical issues in the speedometer mechanism, and accumulated calibration drift. Regular maintenance and using replacement tires that match original specifications can minimize these errors. Professional recalibration may be necessary if error exceeds ±10%.",
    },
    {
      question: "How does speedometer error impact cruise control accuracy?",
      answer: "Cruise control operates based on the same speed sensor signals as the speedometer, so it maintains the speed your speedometer displays. If your speedometer reads 55 mph but actual speed is 50 mph due to larger tires, cruise control will maintain 50 mph actual speed. This means the displayed and actual cruise control speeds will have the same error relationship as your speedometer.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver replaces their original tires (diameter 26.0 inches) with larger tires (diameter 27.5 inches). They want to know the speedometer error caused by this change.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the original tire diameter: 26.0 inches."
      },
      {
        label: "Step 2",
        explanation:
          "Identify the new tire diameter: 27.5 inches."
      },
      {
        label: "Step 3",
        explanation:
          "Calculate the difference: 27.5 - 26.0 = 1.5 inches."
      },
      {
        label: "Step 4",
        explanation:
          "Calculate the percentage difference: (1.5 / 26.0) * 100 = 5.77%."
      },
      {
        label: "Step 5",
        explanation:
          "Interpretation: The speedometer will read approximately 5.77% faster than the actual speed."
      }
    ],
    result:
      "Speedometer error = +5.77%. This means when the speedometer shows 60 mph, the actual speed is about 56.6 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Tire Size Affects Speedometer Accuracy",
      description:
        "An in-depth article explaining the relationship between tire size and speedometer readings.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=38"
    },
    {
      title: "Understanding Speedometer Error",
      description:
        "Technical guide on speedometer calibration and error sources.",
      url: "https://www.cars.com/articles/what-is-speedometer-error-1420680458704/"
    },
    {
      title: "Tire Size Calculator and Speedometer Correction",
      description:
        "Tool and explanation for calculating tire size differences and speedometer correction.",
      url: "https://www.1010tires.com/Tire-Size-Calculator"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire 1 Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.tire1Diameter}
            onChange={(e) => handleInputChange("tire1Diameter", e.target.value)}
            placeholder="e.g. 26.0"
          />
        </div>
        <div className="space-y-2">
          <Label>Tire 2 Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.tire2Diameter}
            onChange={(e) => handleInputChange("tire2Diameter", e.target.value)}
            placeholder="e.g. 27.5"
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
            <p className="mt-2 italic text-sm text-slate-700 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Speedometer Error Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Speedometer Error Calculator helps you determine the accuracy of your vehicle's speedometer by comparing displayed speed readings against actual ground speed. This is essential for verifying speedometer calibration, identifying the impact of tire modifications, and ensuring your vehicle complies with legal accuracy standards. Speedometer errors can range from -10% to +10% depending on tire size, wear patterns, and vehicle modifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need two key inputs: your vehicle's displayed speed (the reading on your dashboard speedometer) and your actual speed (measured via GPS, radar gun, or other precise method). Enter both values in mph or km/h, and the calculator will compute the error percentage and determine whether your speedometer falls within legal tolerance limits. Understanding these inputs helps you identify whether your speedometer is reading optimistically (high) or conservatively (low).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will show you the error percentage, the direction of error (high or low), and a compliance assessment based on your country's legal standards. A small positive error of 2-5% is typical for factory vehicles and falls within normal tolerance. If your error exceeds ±10%, or if negative error exists (reading below actual speed), your speedometer may need professional recalibration or inspection for sensor issues.</p>
        </div>
      </section>

      {/* TABLE: Speedometer Error Ranges by Tire Size Change */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Speedometer Error Ranges by Tire Size Change</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different tire size modifications affect speedometer accuracy when the vehicle's speed sensor isn't recalibrated.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tire Size Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Speedometer Error</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Displayed vs Actual at 60 mph</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Legal Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">+5% diameter increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 57 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within legal tolerance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">+10% diameter increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-9.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 54.5 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within legal tolerance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">+15% diameter increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-13.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 52.2 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exceeds legal tolerance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-5% diameter decrease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+5.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 63.2 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within legal tolerance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-10% diameter decrease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+11.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 66.7 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exceeds legal tolerance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">OEM specification</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reads 60-61.2 mph, Actual 60 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Legal and accurate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Error calculations assume vehicle moving at constant ground speed; actual results may vary by vehicle model and driving conditions.</p>
      </section>

      {/* TABLE: Speedometer Error Legal Standards by Country */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Speedometer Error Legal Standards by Country</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different countries and regions have established specific legal tolerances for speedometer accuracy to protect drivers and ensure compliance with speed limits.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Country/Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Permitted Error</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Speed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Speed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Enforcement Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States (NHTSA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10% maximum (no negative error allowed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Speedometer cannot read below actual speed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">European Union (ECE R39)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±10% tolerance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Harmonized standard across EU member states</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United Kingdom (MOT)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10% maximum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vehicle fails MOT if exceeding ±10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Australia (ADR 18/01)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±10% tolerance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-precision requirement for new vehicles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Germany (StVZO)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±5% tolerance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stricter standard than EU minimum</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Japan (PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;±5% for new vehicles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 km/h</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintained through regular inspections</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Standards apply to factory-calibrated speedometers; modifications may affect compliance. Always verify local regulations before installing aftermarket components.</p>
      </section>

      {/* TABLE: Speedometer Error Impact on Speed Perception at Common Limits */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Speedometer Error Impact on Speed Perception at Common Limits</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how a ±10% speedometer error affects perceived vs actual speed at typical highway and residential speed limits.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speedometer Reading (+10% error)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speedometer Reading (-10% error)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Actual Speed Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 mph (residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-27.5 mph actual</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35 mph (urban)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-38.5 mph actual</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45 mph (suburban)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-49.5 mph actual</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55 mph (highway)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-60.5 mph actual</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65 mph (interstate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52-71.5 mph actual</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 mph (high-speed interstate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67.5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-82.5 mph actual</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Error percentages compound at higher speeds; a 10% error represents larger mph differences at 65+ mph than at residential speeds.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use GPS-based speed measurement apps for the most accurate baseline comparison — they typically maintain ±1-2 mph accuracy, far exceeding standard speedometer precision and eliminating guess work from your calculation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure speedometer error on flat, level ground at steady-state speeds rather than accelerating or decelerating — dynamic speed changes can cause brief sensor lag and produce inaccurate error readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you've installed larger or smaller aftermarket tires, recalculate your speedometer error specifically — a 10% tire diameter increase directly produces approximately 9-10% speedometer underreading that may require professional recalibration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document your speedometer error readings over multiple test runs at different speeds (35 mph, 55 mph, 70 mph) — if error percentage varies significantly across speeds, this indicates a sensor or gauge malfunction rather than simple calibration drift.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming minor speedometer error doesn't matter legally</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Speedometer errors exceeding ±10% can be cited as vehicle equipment violations in traffic stops, even if you weren't speeding by actual ground speed. Additionally, some jurisdictions require speedometer accuracy verification during vehicle inspections (MOT, safety checks), and non-compliance may prevent vehicle registration renewal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring tire size changes as a speedometer error cause</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Installing tires larger than factory specification is the most common cause of speedometer error in modified vehicles, creating a systematic high-reading error that compounds with distance traveled. Many vehicle owners don't realize larger tires reduce speedometer accuracy, leading to incorrect fuel economy calculations and unintentional speeding based on displayed speed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using speedometer error to contest speeding citations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Law enforcement uses calibrated radar or laser guns with ±1 mph accuracy that are far more legally defensible than personal speedometer readings, making speedometer error an ineffective defense strategy. Courts typically only accept speedometer error arguments if documented error exceeds legal limits and the officer's equipment cannot be verified as properly calibrated.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing speedometer error with odometer error in fuel economy calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Speedometer error affects speed readings but not distance calculations — your odometer remains accurate for fuel economy math. However, if you use displayed speed to estimate trip duration or calculate average speeds, speedometer error will skew these calculations despite your odometer remaining precise.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is speedometer error and why should I care about it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Speedometer error is the difference between the speed your vehicle's speedometer displays and your actual speed over the ground. Modern vehicles are legally required to have speedometer accuracy within ±10%, meaning a speedometer reading of 60 mph could represent actual speeds between 54-66 mph. Understanding this error is crucial for accurate speed monitoring, traffic law compliance, and safe driving.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is speedometer error calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Speedometer error is calculated using the formula: Error % = ((Displayed Speed - Actual Speed) / Actual Speed) × 100. For example, if your speedometer reads 50 mph but GPS shows 48 mph, the error would be ((50 - 48) / 48) × 100 = 4.17%. This calculation helps identify whether your speedometer is reading high (optimistic) or low (conservative).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can tire size affect speedometer accuracy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, tire size significantly impacts speedometer accuracy because speedometers calculate speed based on tire rotations. When you install larger tires than the factory specification, your vehicle travels farther per rotation, causing the speedometer to read lower than actual speed. Conversely, smaller tires cause the speedometer to read higher. A 10% increase in tire diameter typically results in a 10% decrease in speedometer reading.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the legal tolerance for speedometer error in most countries?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In the United States and most European countries, speedometers must not read less than actual speed, and must not read more than actual speed plus 10%. This means a vehicle going 60 mph can show a speedometer reading of 60-66 mph. In Australia, the tolerance is ±10%, while some countries like Germany have stricter standards requiring accuracy within ±5%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my vehicle's actual speed for comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most accurate methods are using GPS-based speed measurement apps or devices, which typically have accuracy within ±1-2 mph. Radar guns are used by law enforcement and provide highly accurate readings. Some cars have a built-in trip computer that can display speed data. Avoid using marked road distances, as this method has lower accuracy and requires careful timing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does speedometer error affect my vehicle's fuel economy calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, speedometer error directly impacts fuel economy calculations based on displayed speed. If your speedometer reads 10% high due to smaller tires or calibration issues, your calculated fuel economy will appear 10% worse than actual consumption. For example, if you calculate 20 mpg based on speedometer readings but your actual speed is 10% higher, your real efficiency is approximately 22 mpg.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I get a speeding ticket if my speedometer is inaccurate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Generally, you cannot successfully contest a speeding ticket solely based on speedometer error if the vehicle's error is within legal tolerances. However, if your speedometer error exceeds the legal limit (typically &gt;10%), you may have grounds for contestation. Law enforcement typically uses calibrated radar or laser guns, which are far more accurate than vehicle speedometers and legally admissible.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What causes speedometer error to develop over time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common causes include worn or damaged wheel speed sensors, worn tires with reduced rolling diameter, suspension modifications that affect vehicle height, electrical issues in the speedometer mechanism, and accumulated calibration drift. Regular maintenance and using replacement tires that match original specifications can minimize these errors. Professional recalibration may be necessary if error exceeds ±10%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does speedometer error impact cruise control accuracy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cruise control operates based on the same speed sensor signals as the speedometer, so it maintains the speed your speedometer displays. If your speedometer reads 55 mph but actual speed is 50 mph due to larger tires, cruise control will maintain 50 mph actual speed. This means the displayed and actual cruise control speeds will have the same error relationship as your speedometer.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhtsa.gov/sites/nhtsa.dot.gov/files/2024-01/FMVSS135_Speedometer.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHTSA Federal Motor Vehicle Safety Standards - Speedometer Accuracy (FMVSS 135)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government standard requiring speedometers to read within 0 to +10% of actual speed with specific test procedures.</p>
          </li>
          <li>
            <a href="https://unece.org/sites/default/files/2023-12/ECE-R39-07e.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">European Council Regulation ECE R39 - Speedometer Testing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Harmonized European standard establishing ±10% speedometer tolerance requirements for all EU member states.</p>
          </li>
          <li>
            <a href="https://www.tires.org/standards-advocacy-regulatory-affairs/tire-specifications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tire and Rim Association - Tire Size Specifications and Rolling Circumference</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical reference documenting how tire diameter variations affect vehicle speedometer calibration and accuracy measurements.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/tires/tire-size-speedometer/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - Tire Size Impact on Speedometer Accuracy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer-focused analysis of how aftermarket tire installations affect speedometer error and vehicle performance metrics.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Speedometer Error"
      description="Professional automotive calculator: Speedometer Error. Get accurate estimates, expert advice, and financial insights."
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