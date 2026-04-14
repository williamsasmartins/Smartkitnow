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

export default function CompressionRatioCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    clearanceVolume: "", // Clearance volume (cc or cubic inches)
    sweptVolume: "", // Swept volume (cc or cubic inches)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const clearanceVol = parseFloat(inputs.clearanceVolume);
    const sweptVol = parseFloat(inputs.sweptVolume);

    if (
      isNaN(clearanceVol) ||
      isNaN(sweptVol) ||
      clearanceVol <= 0 ||
      sweptVol <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid positive numbers for volumes.",
        feedback: "Invalid input"
      };
    }

    // Compression Ratio = (Swept Volume + Clearance Volume) / Clearance Volume
    const compressionRatio = (sweptVol + clearanceVol) / clearanceVol;

    // Feedback based on typical compression ratio ranges
    let feedback = "";
    if (compressionRatio < 7) {
      feedback = "Very low compression ratio - typical for old or diesel engines.";
    } else if (compressionRatio >= 7 && compressionRatio < 9) {
      feedback = "Low compression ratio - common in older gasoline engines.";
    } else if (compressionRatio >= 9 && compressionRatio < 11) {
      feedback = "Standard compression ratio - typical for modern gasoline engines.";
    } else if (compressionRatio >= 11 && compressionRatio < 13) {
      feedback = "High compression ratio - performance or efficiency oriented engines.";
    } else {
      feedback = "Very high compression ratio - often found in racing or specialized engines.";
    }

    return {
      primary: compressionRatio.toFixed(2) + ":1",
      secondary: "",
      details: `Calculated Compression Ratio = (Swept Volume + Clearance Volume) / Clearance Volume = (${sweptVol.toFixed(2)} + ${clearanceVol.toFixed(2)}) / ${clearanceVol.toFixed(2)} = ${compressionRatio.toFixed(2)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is compression ratio and why does it matter?",
      answer: "Compression ratio is the volume of the cylinder when the piston is at the bottom divided by the volume when at the top. Higher ratios improve fuel efficiency and power output but require higher-octane fuel to prevent knocking.",
    },
    {
      question: "How do I measure cylinder volume for this calculator?",
      answer: "Measure bore diameter and stroke length in millimeters or inches. Multiply bore² × stroke × π ÷ 4 to get displacement, then divide by number of cylinders for single-cylinder volume.",
    },
    {
      question: "What compression ratio is safe for my engine?",
      answer: "Most naturally aspirated gasoline engines safely run 8:1 to 10:1 ratios with 87-91 octane fuel. Turbocharged engines typically handle 7:1 to 9:1, while high-performance engines may reach 12:1+ with premium fuel.",
    },
    {
      question: "Does compression ratio affect fuel octane requirements?",
      answer: "Yes—higher compression ratios require higher octane fuel to prevent pre-ignition and detonation. A 10:1 ratio typically needs 91 octane minimum, while 12:1 requires 98+ octane premium fuel.",
    },
    {
      question: "How does head gasket thickness impact compression ratio?",
      answer: "Thinner head gaskets increase compression ratio by reducing combustion chamber volume. Each 0.5mm reduction in gasket thickness can raise the ratio by approximately 0.3 to 0.5 points.",
    },
    {
      question: "Can I calculate compression ratio with just engine displacement?",
      answer: "No—you need both swept volume (displacement) and clearance volume (combustion chamber, head gasket, piston dome) to calculate an accurate compression ratio.",
    },
    {
      question: "What's the difference between static and dynamic compression ratio?",
      answer: "Static ratio is measured at TDC with valves closed, while dynamic ratio accounts for valve overlap and timing. Dynamic is always lower and better reflects real-world engine behavior.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the compression ratio of a 2.0L inline-4 gasoline engine with a clearance volume of 50 cc and a swept volume of 500 cc per cylinder.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the clearance volume (Vc) and swept volume (Vs) for one cylinder. Here, Vc = 50 cc and Vs = 500 cc."
      },
      {
        label: "Step 2",
        explanation:
          "Apply the compression ratio formula: CR = (Vs + Vc) / Vc = (500 + 50) / 50 = 550 / 50 = 11."
      },
      {
        label: "Step 3",
        explanation:
          "The compression ratio is 11:1, which is typical for a modern performance gasoline engine."
      }
    ],
    result: "Final Result: Compression Ratio = 11:1"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "HowStuffWorks: Compression Ratio",
      description:
        "An easy-to-understand explanation of compression ratio and its impact on engine performance.",
      url: "https://auto.howstuffworks.com/engine.htm"
    },
    {
      title: "Engineering Explained: Compression Ratio",
      description:
        "Detailed video and articles explaining compression ratio and its effects on engines.",
      url: "https://www.engineeringexplained.com/compression-ratio"
    },
    {
      title: "SAE International - Engine Fundamentals",
      description:
        "Technical papers and resources on engine design and compression ratios.",
      url: "https://www.sae.org/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => setInputs(prev => ({ ...prev, unit: v }))}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (cubic inches)</SelectItem>
            <SelectItem value="metric">Metric (cc)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Clearance Volume ({inputs.unit === "metric" ? "cc" : "cubic inches"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.clearanceVolume}
            onChange={(e) => handleInputChange("clearanceVolume", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Swept Volume ({inputs.unit === "metric" ? "cc" : "cubic inches"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 500"
            value={inputs.sweptVolume}
            onChange={(e) => handleInputChange("sweptVolume", e.target.value)}
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
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Compression Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your engine's compression ratio by analyzing swept volume (displacement) and clearance volume. A higher compression ratio means more air-fuel mixture is squeezed before ignition, improving efficiency and power.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your engine's bore diameter, stroke length, number of cylinders, and combustion chamber volume (clearance volume). Clearance volume includes the head gasket thickness, piston dome/dish, and quench area—measure or obtain these values from your engine manufacturer.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns your static compression ratio and provides fuel octane recommendations. Compare your result against your engine's specifications and fuel grade to ensure safe operation without pre-ignition or detonation.</p>
        </div>
      </section>

      {/* TABLE: Compression Ratio by Engine Type and Fuel Grade */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Compression Ratio by Engine Type and Fuel Grade</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical compression ratios for different engine configurations with recommended fuel octane ratings.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical CR Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Octane</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Output Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Naturally Aspirated Gasoline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8:1 to 10:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87-91 RON</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline power</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Turbocharged Gasoline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7:1 to 9:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91-95 RON</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate boost friendly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Performance NA</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11:1 to 12:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">98+ RON</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak efficiency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Supercharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5:1 to 8:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91-95 RON</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High boost tolerance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diesel Engines</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14:1 to 18:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cetane fuel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High efficiency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Race/Competition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12:1 to 15:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100+ Octane</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum power</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">RON = Research Octane Number; actual ratios vary by manufacturer and application.</p>
      </section>

      {/* TABLE: Compression Ratio Impact on Performance Metrics */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Compression Ratio Impact on Performance Metrics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">How compression ratio changes affect engine efficiency, power, and torque delivery.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">CR Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Thermal Efficiency Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Power Effect</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Knock Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:1 to 9:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+5-8% torque</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9:1 to 10:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+4-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+8-12% horsepower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:1 to 11:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+5-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+12-15% power</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11:1 to 12:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+6-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15-20% output</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:1+ ratio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+7%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gains assume proper fuel octane and ignition timing; values are approximate and vary with design.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use actual measurements or factory specifications; estimated values lead to incorrect compression ratio calculations and improper fuel selection.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for piston dome shape—domed pistons increase compression ratio while dish-shaped pistons decrease it significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Higher compression ratios require fuel with higher octane ratings; using lower-octane fuel risks engine knock and damage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check valve timing and overlap when calculating dynamic compression ratio, as late intake valve closure lowers effective ratio by 1-3 points.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Clearance Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many users calculate only swept volume and forget combustion chamber volume, resulting in inflated compression ratio estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Incorrect Head Gasket Measurement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring gasket thickness in the wrong units or using compressed vs. uncompressed thickness causes significant calculation errors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Wrong Bore/Stroke Values</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Confusing millimeter and inch measurements or using aftermarket bore sizes without verifying actual cylinder dimensions leads to false ratios.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Piston Dome Effects</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for piston geometry (flat, domed, or dish-shaped) underestimates or overestimates compression by up to 2 points.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is compression ratio and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Compression ratio is the volume of the cylinder when the piston is at the bottom divided by the volume when at the top. Higher ratios improve fuel efficiency and power output but require higher-octane fuel to prevent knocking.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure cylinder volume for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure bore diameter and stroke length in millimeters or inches. Multiply bore² × stroke × π ÷ 4 to get displacement, then divide by number of cylinders for single-cylinder volume.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What compression ratio is safe for my engine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most naturally aspirated gasoline engines safely run 8:1 to 10:1 ratios with 87-91 octane fuel. Turbocharged engines typically handle 7:1 to 9:1, while high-performance engines may reach 12:1+ with premium fuel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does compression ratio affect fuel octane requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—higher compression ratios require higher octane fuel to prevent pre-ignition and detonation. A 10:1 ratio typically needs 91 octane minimum, while 12:1 requires 98+ octane premium fuel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does head gasket thickness impact compression ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Thinner head gaskets increase compression ratio by reducing combustion chamber volume. Each 0.5mm reduction in gasket thickness can raise the ratio by approximately 0.3 to 0.5 points.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I calculate compression ratio with just engine displacement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—you need both swept volume (displacement) and clearance volume (combustion chamber, head gasket, piston dome) to calculate an accurate compression ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between static and dynamic compression ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Static ratio is measured at TDC with valves closed, while dynamic ratio accounts for valve overlap and timing. Dynamic is always lower and better reflects real-world engine behavior.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International - Engine Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SAE standards for measuring and reporting engine compression ratio and performance metrics.</p>
          </li>
          <li>
            <a href="https://www.edelbrock.com/pages/compression-ratio-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edelbrock Compression Ratio Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical guide explaining compression ratio effects on engine performance and fuel requirements.</p>
          </li>
          <li>
            <a href="https://www.chevroletperformance.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Chevrolet Performance Engineering Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer specifications and technical resources for compression ratios across engine families.</p>
          </li>
          <li>
            <a href="https://www.popularmechanics.com/cars/how-to/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Popular Mechanics - Compression Ratio Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of compression ratio, its measurement, and real-world engine applications.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Compression Ratio Calculator"
      description="Professional automotive calculator: Compression Ratio Calculator. Get accurate estimates, expert advice, and financial insights."
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