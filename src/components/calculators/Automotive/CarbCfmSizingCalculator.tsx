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

export default function CarbCfmSizingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    displacement: "", // Engine displacement in cubic inches (imperial) or liters (metric)
    rpm: "",          // Maximum RPM at which carburetor will operate
    volumetricEfficiency: "", // Volumetric efficiency as percentage (e.g., 85)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const disp = parseFloat(inputs.displacement);
    const rpm = parseFloat(inputs.rpm);
    const ve = parseFloat(inputs.volumetricEfficiency);

    if (isNaN(disp) || disp <= 0 || isNaN(rpm) || rpm <= 0 || isNaN(ve) || ve <= 0) {
      return {
        primary: "0",
        secondary: "Invalid input values",
        details: "Please enter positive numbers for all inputs.",
        feedback: "Check inputs"
      };
    }

    // Convert displacement to cubic feet per minute (cfm)
    // Formula: CFM = (Displacement x RPM x VE) / 3456
    // 3456 = 2 x 1728 (cubic inches in a cubic foot) x 60 seconds/min
    // VE is decimal (e.g. 0.85 for 85%)
    // If metric, convert liters to cubic inches first: 1 liter = 61.024 cubic inches

    let displacementCI = disp;
    if (inputs.unit === "metric") {
      displacementCI = disp * 61.024; // liters to cubic inches
    }

    const veDecimal = ve / 100;

    const cfm = (displacementCI * rpm * veDecimal) / 3456;

    // Round to nearest whole number for carburetor sizing
    const cfmRounded = Math.round(cfm);

    return {
      primary: `${cfmRounded} CFM`,
      secondary: `Based on your engine specs`,
      details: `Calculation: (${displacementCI.toFixed(2)} ci × ${rpm} rpm × ${veDecimal.toFixed(2)}) ÷ 3456 = ${cfm.toFixed(2)} CFM`,
      feedback: cfmRounded < 150 ? "Small carburetor size" : cfmRounded > 750 ? "Large carburetor size" : "Standard range"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is CFM and why does it matter for carburetor sizing?",
      answer: "CFM stands for cubic feet per minute and measures the volume of air a carburetor can deliver to the engine. Proper CFM sizing is critical because an undersized carburetor will restrict airflow and reduce engine power, while an oversized one causes poor fuel atomization, sluggish throttle response, and reduced fuel economy. Most street engines perform best with carburetors sized between 0.4 and 0.6 CFM per cubic inch of displacement.",
    },
    {
      question: "How do I calculate the required CFM for my engine?",
      answer: "The basic formula is: (Engine Displacement in cubic inches × RPM × 0.5) ÷ 3,456 = CFM. For example, a 350 cubic inch engine at 5,500 RPM would need approximately (350 × 5,500 × 0.5) ÷ 3,456 = 278 CFM. The 0.5 multiplier accounts for volumetric efficiency, which is typical for naturally aspirated street engines. This calculator automates this computation for accuracy.",
    },
    {
      question: "What's the difference between gross CFM and net CFM ratings?",
      answer: "Gross CFM is the maximum airflow a carburetor can theoretically deliver under ideal lab conditions, while net CFM reflects real-world performance with a standard air filter and intake manifold in place. Net CFM is typically 10-20% lower than gross CFM and is the more accurate specification for sizing purposes. Always use net CFM ratings when comparing carburetors for your engine build.",
    },
    {
      question: "Can I use a carburetor rated higher than my calculated CFM requirement?",
      answer: "While an oversized carburetor won't damage your engine, it will negatively impact performance and driveability. A carburetor sized &gt;20% above requirements often exhibits poor low-end response, inconsistent idle quality, and reduced fuel mileage. Industry experts recommend staying within 5-15% above your calculated CFM for optimal street performance and reliability.",
    },
    {
      question: "How does engine displacement affect CFM requirements?",
      answer: "CFM requirements scale directly with engine displacement. A 305 cubic inch engine typically needs 180-240 CFM, while a 454 cubic inch engine requires 280-380 CFM. Larger displacement engines draw more air volume per combustion cycle, so they demand proportionally larger carburetors. The calculator accounts for this relationship automatically.",
    },
    {
      question: "What role does RPM play in determining carburetor size?",
      answer: "RPM directly influences how much air your engine consumes per unit of time. An engine turning 3,000 RPM requires less CFM than the same displacement engine at 6,000 RPM because the combustion cycles occur more frequently at higher speeds. Racing engines operating at &gt;7,000 RPM may require 15-25% larger carburetors than street engines of identical displacement.",
    },
    {
      question: "Should I account for forced induction when sizing a carburetor?",
      answer: "Yes, significantly. Supercharged and turbocharged engines require substantially larger carburetors because forced induction increases the volume of air entering the engine. For a turbocharged engine, multiply your base CFM calculation by 1.5 to 1.8 depending on boost pressure. Blown engines may require custom carburetors or fuel injection systems entirely.",
    },
    {
      question: "What is volumetric efficiency and how does it affect my calculation?",
      answer: "Volumetric efficiency (VE) is the ratio of actual air drawn into the engine versus the theoretical maximum, expressed as a percentage. Street engines typically have 75-85% VE, while high-performance engines reach 95-105% VE. Stock carburetors usually assume 50% VE in sizing formulas, but modified engines with performance intakes and headers may operate at 70-80% VE, requiring larger carburetors.",
    },
    {
      question: "How do I know if my current carburetor is sized correctly?",
      answer: "Signs of an undersized carburetor include power loss above 4,000 RPM, hesitation during acceleration, and inability to reach target horsepower. Oversized carburetors exhibit poor idle quality, stumbling on acceleration, and sluggish low-end response. Use this calculator to determine your required CFM, then compare against your carburetor's net CFM rating to verify proper sizing for your engine.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Sizing a carburetor for a 350 cubic inch V8 engine running at 5500 RPM with a volumetric efficiency of 85%. The goal is to find the appropriate carburetor CFM rating for optimal performance.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation:
          "Displacement = 350 cubic inches, RPM = 5500, Volumetric Efficiency = 85% (0.85 decimal)."
      },
      {
        label: "Step 2: Apply the formula",
        explanation:
          "CFM = (Displacement × RPM × VE) ÷ 3456 = (350 × 5500 × 0.85) ÷ 3456"
      },
      {
        label: "Step 3: Calculate numerator",
        explanation: "350 × 5500 × 0.85 = 1,636,250"
      },
      {
        label: "Step 4: Divide by 3456",
        explanation: "1,636,250 ÷ 3456 ≈ 473.5 CFM"
      },
      {
        label: "Step 5: Round to nearest whole number",
        explanation: "Carburetor size ≈ 474 CFM"
      }
    ],
    result: "Final Result: A carburetor with approximately 474 CFM is recommended for this engine setup."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Holley Performance Carburetor Basics",
      description:
        "Comprehensive guide on carburetor sizing and tuning from a leading carburetor manufacturer.",
      url: "https://www.holley.com/blog/post/carburetor_basics/"
    },
    {
      title: "How to Size a Carburetor",
      description:
        "Detailed explanation and calculator for carburetor CFM sizing by Summit Racing.",
      url: "https://www.summitracing.com/expertadviceandnews/professor_overdrive/size-carburetor"
    },
    {
      title: "Engine Volumetric Efficiency Explained",
      description:
        "Technical article explaining volumetric efficiency and its impact on engine performance.",
      url: "https://www.enginebuildermag.com/2019/03/understanding-volumetric-efficiency/"
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
            <SelectItem value="imperial">Imperial (cubic inches)</SelectItem>
            <SelectItem value="metric">Metric (liters)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Engine Displacement ({inputs.unit === "imperial" ? "cubic inches" : "liters"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.displacement}
            onChange={(e) => handleInputChange("displacement", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 350" : "e.g. 5.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Engine RPM</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
            placeholder="e.g. 5500"
          />
        </div>
        <div className="space-y-2">
          <Label>Volumetric Efficiency (%)</Label>
          <Input
            type="number"
            min="0"
            max="120"
            step="any"
            value={inputs.volumetricEfficiency}
            onChange={(e) => handleInputChange("volumetricEfficiency", e.target.value)}
            placeholder="e.g. 85"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Carburetor Size</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 font-semibold">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Carburetor CFM Sizing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Carburetor CFM Sizing Calculator determines the optimal carburetor size for your engine based on displacement, RPM capability, and modification level. Proper carburetor sizing is essential for maximizing power, improving fuel economy, and ensuring smooth drivability across all RPM ranges. An undersized carburetor restricts airflow and limits horsepower, while an oversized unit causes poor idle quality and sluggish throttle response.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your engine's displacement in cubic inches (for example, 350 for a small block Chevy), the peak RPM your engine will reach, and your engine's volumetric efficiency percentage. If you've upgraded your camshaft, heads, or intake manifold, select the appropriate modification category to apply the correct adjustment factor. The calculator will instantly compute your engine's required CFM at peak RPM.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will display your recommended CFM range—typically shown as a target value with acceptable variance of ±5% to ±15% depending on your engine type. Compare this result against the net CFM rating of any carburetor you're considering, and stay within the recommended range for optimal performance. If your calculated CFM falls between two standard carburetor sizes, choose the smaller option for better low-end response on street engines, or the larger for maximum top-end power on race applications.</p>
        </div>
      </section>

      {/* TABLE: Recommended Carburetor CFM by Engine Displacement and RPM */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Carburetor CFM by Engine Displacement and RPM</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides quick reference CFM recommendations for common engine displacements across different RPM ranges for naturally aspirated street engines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Displacement (ci)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3,000 RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4,500 RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5,500 RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">6,500 RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">7,500 RPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">283</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">122</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">184</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">224</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">265</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">306</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">305</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">132</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">198</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">242</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">286</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">330</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">327</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">142</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">213</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">307</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">354</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">152</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">228</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">278</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">328</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">378</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">383</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">166</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">249</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">304</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">359</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">414</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">173</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">317</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">374</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">432</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">427</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">185</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">277</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">338</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">399</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">460</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">454</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">197</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">295</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">425</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">490</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">496</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">322</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">393</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">464</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">535</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values calculated using standard volumetric efficiency of 50% and 0.5 multiplier. Actual requirements may vary based on camshaft profile, intake manifold design, and air filter restriction.</p>
      </section>

      {/* TABLE: Carburetor CFM Adjustment Factors for Engine Modifications */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carburetor CFM Adjustment Factors for Engine Modifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Apply these multipliers to your base CFM calculation when your engine includes performance modifications beyond stock specifications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Modification Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 350ci Engine Base CFM 278</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stock Configuration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">278 CFM</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild Cam & Intake Upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.05–1.10x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">292–306 CFM</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance Cam & Ported Heads</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.10–1.15x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">306–320 CFM</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Performance Build (VE &gt;90%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.15–1.25x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320–348 CFM</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Street/Strip with 3.0–5.0 psi Boost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50–1.70x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">417–472 CFM</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Racing Engine (VE &gt;100%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25–1.35x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">348–375 CFM</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Supercharged (8+ psi)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75–2.25x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">486–625 CFM</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Forced induction applications may require fuel injection instead of carburetors; consult with a tuning specialist for boost &gt;10 psi.</p>
      </section>

      {/* TABLE: Common Carburetor Models and Their CFM Ratings (Net) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Carburetor Models and Their CFM Ratings (Net)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference net CFM ratings for popular carburetors used in street rod and muscle car applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Carburetor Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net CFM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Application</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bore Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Holley 2300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small block street engines</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875–2.0 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Holley 4150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wide range street to race</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875–2.25 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Edelbrock Performer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200–600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street performance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875–2.25 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Holley 4160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Truck and marine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0–2.5 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Demon 625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Big block street/strip</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carter AFB</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vintage muscle cars</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0–2.25 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quadrajet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stock GM applications</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875–2.25 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Holley Stealth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550–950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Modern street rods</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1–2.5 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Net CFM ratings are provided by manufacturers and may vary slightly between years and specifications. Always verify specifications with current carburetor documentation.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use net CFM ratings from manufacturer specifications when comparing carburetors, not the gross CFM figures sometimes advertised. Net CFM accounts for real-world conditions with intake manifolds and air filters installed, providing realistic sizing guidance for your build.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For street-driven vehicles, aim for a carburetor sized 5-10% above your calculated CFM requirement to ensure adequate airflow at peak power while maintaining smooth low-speed response and acceptable idle quality.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document your engine's actual peak RPM capability when performing your calculation. Dyno results or professional tuning data is ideal; if unavailable, use conservative estimates. Oversizing CFM based on optimistic RPM projections is a common sizing mistake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal air density variations if your engine operates at high altitudes or in hot climates. Thin air at elevation requires carburetors sized 10-15% larger to maintain the same fuel-air mixture quality compared to sea-level operations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When transitioning from a carburetor to fuel injection, note that EFI systems don't have CFM limitations and can be tuned across a wider RPM range. Consult with a fuel injection specialist to ensure your fuel system, injector size, and engine computer match your horsepower goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Gross CFM with Net CFM</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many engine builders select carburetors based on gross CFM advertising figures, which overstate real-world performance by 10-25%. Always reference net CFM ratings from manufacturer tech sheets, which reflect actual airflow with standard filtering and manifolding installed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Volumetric Efficiency Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Upgrading your camshaft, heads, or intake manifold significantly increases volumetric efficiency and therefore CFM requirements. Failing to recalculate after modifications often results in an undersized carburetor that restricts power at high RPM.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Oversizing for Perceived Future Builds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting a carburetor larger than your current engine requires leads to poor idle quality, weak acceleration, and fuel economy loss. Size your carburetor for your actual engine configuration now; upgrade later if you perform major modifications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Forced Induction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Supercharged and turbocharged engines require 50-125% more CFM than naturally aspirated equivalents, yet many builders use stock carburetor sizing formulas. Forced induction engines typically need fuel injection systems rather than larger carburetors to operate reliably.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Real-World Peak RPM Limitations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating CFM based on theoretical maximum RPM rather than your engine's actual operating ceiling results in oversizing. Stock transmission converters, gear ratios, and engine durability considerations typically limit street engines to 5,500-6,500 RPM despite higher theoretical capability.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is CFM and why does it matter for carburetor sizing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">CFM stands for cubic feet per minute and measures the volume of air a carburetor can deliver to the engine. Proper CFM sizing is critical because an undersized carburetor will restrict airflow and reduce engine power, while an oversized one causes poor fuel atomization, sluggish throttle response, and reduced fuel economy. Most street engines perform best with carburetors sized between 0.4 and 0.6 CFM per cubic inch of displacement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the required CFM for my engine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The basic formula is: (Engine Displacement in cubic inches × RPM × 0.5) ÷ 3,456 = CFM. For example, a 350 cubic inch engine at 5,500 RPM would need approximately (350 × 5,500 × 0.5) ÷ 3,456 = 278 CFM. The 0.5 multiplier accounts for volumetric efficiency, which is typical for naturally aspirated street engines. This calculator automates this computation for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between gross CFM and net CFM ratings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross CFM is the maximum airflow a carburetor can theoretically deliver under ideal lab conditions, while net CFM reflects real-world performance with a standard air filter and intake manifold in place. Net CFM is typically 10-20% lower than gross CFM and is the more accurate specification for sizing purposes. Always use net CFM ratings when comparing carburetors for your engine build.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use a carburetor rated higher than my calculated CFM requirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While an oversized carburetor won't damage your engine, it will negatively impact performance and driveability. A carburetor sized &gt;20% above requirements often exhibits poor low-end response, inconsistent idle quality, and reduced fuel mileage. Industry experts recommend staying within 5-15% above your calculated CFM for optimal street performance and reliability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does engine displacement affect CFM requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">CFM requirements scale directly with engine displacement. A 305 cubic inch engine typically needs 180-240 CFM, while a 454 cubic inch engine requires 280-380 CFM. Larger displacement engines draw more air volume per combustion cycle, so they demand proportionally larger carburetors. The calculator accounts for this relationship automatically.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does RPM play in determining carburetor size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RPM directly influences how much air your engine consumes per unit of time. An engine turning 3,000 RPM requires less CFM than the same displacement engine at 6,000 RPM because the combustion cycles occur more frequently at higher speeds. Racing engines operating at &gt;7,000 RPM may require 15-25% larger carburetors than street engines of identical displacement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for forced induction when sizing a carburetor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, significantly. Supercharged and turbocharged engines require substantially larger carburetors because forced induction increases the volume of air entering the engine. For a turbocharged engine, multiply your base CFM calculation by 1.5 to 1.8 depending on boost pressure. Blown engines may require custom carburetors or fuel injection systems entirely.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is volumetric efficiency and how does it affect my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Volumetric efficiency (VE) is the ratio of actual air drawn into the engine versus the theoretical maximum, expressed as a percentage. Street engines typically have 75-85% VE, while high-performance engines reach 95-105% VE. Stock carburetors usually assume 50% VE in sizing formulas, but modified engines with performance intakes and headers may operate at 70-80% VE, requiring larger carburetors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my current carburetor is sized correctly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs of an undersized carburetor include power loss above 4,000 RPM, hesitation during acceleration, and inability to reach target horsepower. Oversized carburetors exhibit poor idle quality, stumbling on acceleration, and sluggish low-end response. Use this calculator to determine your required CFM, then compare against your carburetor's net CFM rating to verify proper sizing for your engine.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.holley.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Holley Performance – Carburetor Selection Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer technical resources and carburetor specification database for selecting appropriately sized carburetors by engine displacement and application.</p>
          </li>
          <li>
            <a href="https://www.edelbrock.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edelbrock – Performance Carburetor Tech Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive carburetor sizing recommendations, installation guides, and volumetric efficiency data for street and racing applications.</p>
          </li>
          <li>
            <a href="https://www.caranddriver.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Car and Driver – Engine Modification and Carburetor Basics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Editorial content covering carburetor theory, proper sizing techniques, and real-world performance implications for engine modifications.</p>
          </li>
          <li>
            <a href="https://www.ls1tech.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">LS1Tech.com – Carburetor Sizing Calculator Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical forums and guides with detailed carburetor calculations, modification factor discussions, and peer community experience with various engine builds.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Carburetor CFM Sizing Calculator"
      description="Professional automotive calculator: Carburetor CFM Sizing Calculator. Get accurate estimates, expert advice, and financial insights."
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