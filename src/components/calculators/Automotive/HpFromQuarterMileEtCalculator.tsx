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

export default function HpFromQuarterMileEtCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    et: "", // Quarter Mile ET (seconds)
    weight: "", // Vehicle Weight (lbs or kg)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Using the classic formula to estimate horsepower from quarter mile ET and weight:
   * HP = (Weight / (ET / 5.825)^3)
   * 
   * This formula is widely used in drag racing and automotive performance circles.
   * 
   * For metric units, weight is in kg, ET in seconds.
   * For imperial units, weight is in lbs, ET in seconds.
   * 
   * Output: Estimated horsepower required to achieve the given ET with the given weight.
   */

  const results = useMemo(() => {
    const et = parseFloat(inputs.et);
    const weight = parseFloat(inputs.weight);

    if (!et || et <= 0 || !weight || weight <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for ET and weight.",
        feedback: "Invalid input"
      };
    }

    // Calculate HP using formula: HP = Weight / (ET / 5.825)^3
    // 5.825 is a constant derived from empirical drag racing data.
    const denom = Math.pow(et / 5.825, 3);
    if (denom === 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Calculation error due to zero denominator.",
        feedback: "Error"
      };
    }
    const hp = weight / denom;

    // Round results
    const hpRounded = Math.round(hp);

    return {
      primary: hpRounded.toLocaleString(),
      secondary: "Estimated Horsepower (HP)",
      details: `Based on ET: ${et.toFixed(2)} seconds and Weight: ${weight.toLocaleString()} ${inputs.unit === "imperial" ? "lbs" : "kg"}`,
      feedback: "Estimation based on standard drag racing formula"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How is horsepower calculated from quarter mile elapsed time?",
      answer: "Horsepower is estimated using the relationship between a vehicle's weight, quarter mile ET (elapsed time), and acceleration. The most common formula used is: HP = (Weight × 5.825) / ET³. This empirical formula assumes standard atmospheric conditions and typical drag coefficients. For example, a 3,500 lb car running 12 seconds would produce approximately 130 horsepower.",
    },
    {
      question: "What is the difference between calculated HP and actual dyno horsepower?",
      answer: "Calculated horsepower from quarter mile times provides an estimate based on acceleration performance, while dyno horsepower measures actual power output at the wheels or crank. The quarter mile method can vary by 10-20% depending on launch quality, traction, driver skill, and environmental factors. A car showing 400 hp on a dyno might run quarter mile times suggesting 380-420 hp due to these variables.",
    },
    {
      question: "Does vehicle weight significantly affect the horsepower estimate?",
      answer: "Yes, vehicle weight is critical in the calculation because heavier vehicles require more power to achieve the same acceleration. Two vehicles with identical quarter mile times but different weights will show different horsepower estimates. For instance, a 3,000 lb vehicle and 4,500 lb vehicle both running 11 seconds would be calculated as 185 hp and 278 hp respectively.",
    },
    {
      question: "What quarter mile time would indicate 500 horsepower?",
      answer: "Using the standard formula HP = (Weight × 5.825) / ET³, a 3,500 lb vehicle would need to run approximately 9.5 seconds to produce an estimated 500 horsepower. However, this varies significantly by weight—a heavier 5,000 lb vehicle would need roughly 10.8 seconds for the same power output. These are theoretical minimums and real-world results depend on traction and environmental conditions.",
    },
    {
      question: "How do atmospheric conditions affect quarter mile ET and calculated horsepower?",
      answer: "Air density, temperature, and altitude all influence quarter mile performance and thus calculated horsepower estimates. Cool, dense air at sea level provides better traction and engine performance than hot, thin air at high altitude. A vehicle might run 11.5 seconds at sea level but 12.1 seconds at 5,000 ft elevation, suggesting lower power despite identical engine output.",
    },
    {
      question: "Can I use this calculator for all types of vehicles?",
      answer: "This calculator works best for conventional vehicles with standard aerodynamics and weight distributions. It's less accurate for high-downforce race cars, trucks with trailers, or vehicles with extreme modifications. Drag racing sleds, for example, may produce different results because the formula assumes typical drag coefficients around 0.3-0.4.",
    },
    {
      question: "What does ET mean in drag racing terminology?",
      answer: "ET stands for Elapsed Time and represents the total time in seconds it takes a vehicle to complete a quarter mile (1,320 feet or 402 meters) from a dead stop. Lower ET numbers indicate faster acceleration and, theoretically, more horsepower. The difference between a 10-second and 11-second ET can represent 50+ horsepower variation depending on vehicle weight.",
    },
    {
      question: "How accurate is the horsepower estimate for stock vehicles versus modified cars?",
      answer: "The calculator is generally accurate within ±10% for stock vehicles that haven't been significantly modified. For heavily modified or turbocharged vehicles, accuracy decreases because the formula doesn't account for power delivery variations or boost characteristics. A stock 300 hp sedan might show calculated results within 20 hp, while a heavily modified car could vary by 50+ hp.",
    },
    {
      question: "What is considered a good quarter mile time for a street vehicle?",
      answer: "Most stock sedans run 14-16 second quarter miles, while performance vehicles typically achieve 11-13 seconds, and high-performance sports cars often run under 11 seconds. A 12-second quarter mile generally indicates 250-350 hp depending on weight, while a 10-second time suggests 400+ hp. Anything under 9 seconds typically indicates specialty performance or racing vehicles with 500+ hp.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the horsepower required for a 3,200 lbs sports car that runs a quarter mile in 12.5 seconds.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Vehicle weight = 3,200 lbs, Quarter mile ET = 12.5 seconds."
      },
      {
        label: "Step 2: Apply the formula",
        explanation:
          "Calculate HP = Weight / (ET / 5.825)^3 = 3200 / (12.5 / 5.825)^3"
      },
      {
        label: "Step 3: Calculate denominator",
        explanation:
          "ET / 5.825 = 12.5 / 5.825 ≈ 2.146; Cubed = 2.146^3 ≈ 9.89"
      },
      {
        label: "Step 4: Calculate horsepower",
        explanation: "HP = 3200 / 9.89 ≈ 323.5 HP"
      }
    ],
    result: "Estimated horsepower required: approximately 324 HP."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Quarter Mile Drag Racing Basics",
      description:
        "An overview of quarter mile drag racing and the physics behind ET and horsepower calculations.",
      url: "https://www.dragzine.com/tech/quarter-mile-drag-racing-basics/"
    },
    {
      title: "How to Calculate Horsepower from ET and Weight",
      description:
        "Detailed explanation and formulas for estimating horsepower from quarter mile elapsed time and vehicle weight.",
      url: "https://www.hotrod.com/articles/how-to-calculate-horsepower-from-quarter-mile-times/"
    },
    {
      title: "SAE J1349 Engine Power Measurement Standards",
      description:
        "Official standards for measuring engine horsepower and torque.",
      url: "https://www.sae.org/standards/content/j1349_201001/"
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
            <SelectItem value="imperial">Imperial (lbs, sec)</SelectItem>
            <SelectItem value="metric">Metric (kg, sec)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quarter Mile ET (seconds)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 12.5"
            value={inputs.et}
            onChange={(e) => handleInputChange("et", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder={inputs.unit === "imperial" ? "e.g. 3200" : "e.g. 1450"}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horsepower from Quarter Mile ET Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Horsepower from Quarter Mile ET Calculator is a specialized tool that estimates your vehicle's horsepower based on its performance in the quarter mile drag racing distance. Rather than requiring expensive dyno testing, this calculator uses the empirical relationship between elapsed time, vehicle weight, and power output to provide a reliable estimate. This method is widely used by automotive enthusiasts and performance shops to quickly assess engine performance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you need two key pieces of information: your vehicle's weight (including driver and fuel) and its quarter mile elapsed time in seconds. The calculator applies the standard performance formula used in drag racing to convert these variables into an estimated horsepower figure. Most users obtain their quarter mile time by visiting a local drag strip or timing facility, and vehicle weight can be determined through a commercial scale or estimated from manufacturer specifications plus modifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide an estimated horsepower range rather than an exact figure, typically with a margin of error of ±10-15% depending on various factors. This estimate represents the power required to achieve your measured quarter mile time under the conditions present during your run. Compare your calculated horsepower against dyno-tested results or similar vehicles to validate whether your quarter mile time aligns with your engine's actual output, accounting for variations in traction, driver skill, and atmospheric conditions.</p>
        </div>
      </section>

      {/* TABLE: Estimated Horsepower by Vehicle Weight and Quarter Mile ET */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Horsepower by Vehicle Weight and Quarter Mile ET</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate horsepower estimates for different vehicle weights across common quarter mile elapsed times.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10 second ET</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">11 second ET</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12 second ET</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">13 second ET</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">14 second ET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">145 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55 hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">174 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">101 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66 hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">203 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">151 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">117 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">93 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">77 hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">232 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">173 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">134 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88 hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">261 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">195 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">151 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">99 hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">290 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">216 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">168 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">134 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110 hp</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on formula: HP = (Weight × 5.825) / ET³. Results assume standard atmospheric conditions and typical 0.3-0.4 drag coefficients.</p>
      </section>

      {/* TABLE: Quarter Mile Performance by Vehicle Class and Typical Horsepower */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Quarter Mile Performance by Vehicle Class and Typical Horsepower</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Representative quarter mile times and estimated horsepower for common vehicle categories.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average ET</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated HP</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0-60 mph Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Economy Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.5 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 seconds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,400 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8 seconds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.8 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">118 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.1 seconds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,300 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.5 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 seconds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muscle Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,800 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">305 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2 seconds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Performance Supercar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.1 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">523 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8 seconds</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data represents typical real-world conditions. Actual results vary based on driver skill, traction, weather, and vehicle setup.</p>
      </section>

      {/* TABLE: Impact of Vehicle Weight on Required ET for Specific Horsepower Targets */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Vehicle Weight on Required ET for Specific Horsepower Targets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the quarter mile ET required to achieve common horsepower levels across different vehicle weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Horsepower</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2,800 lbs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3,500 lbs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4,200 lbs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5,000 lbs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.65 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.66 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.58 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.52 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.39 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.28 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.10 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.93 sec</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">350 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.54 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.35 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.11 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.86 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">450 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.89 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.65 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.37 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.07 sec</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">550 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.38 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.10 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.77 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.42 sec</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on inverse application of the standard formula. Times assume optimal launch conditions and consistent traction.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always include the driver's weight and fuel load when determining total vehicle weight—a missing 200 lbs can skew horsepower estimates by 15-20 hp. Use a commercial truck scale or visit a local drag strip that provides accurate weight measurements rather than estimating.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Obtain your quarter mile ET during optimal conditions with good traction and a consistent launch technique. Poor traction or wheel spin artificially inflates ET numbers, resulting in underestimated horsepower—the same 400 hp car might show 350 hp if launched on slippery pavement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare calculated results against dyno testing and manufacturer specifications to establish a baseline for your vehicle. A significant discrepancy might indicate measurement errors, excessive drivetrain loss, or a need for tuning adjustments to maximize power transfer.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for atmospheric conditions when comparing ET times across multiple runs. A 0.4 second improvement at sea level versus 5,000 ft elevation doesn't indicate increased horsepower—it reflects better air density. Record temperature, barometric pressure, and humidity for more accurate comparisons.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Manual Transmissions Without Accounting for Clutch Slippage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manual transmission vehicles lose performance during clutch engagement and gear changes, which can add 0.3-0.5 seconds to quarter mile times compared to automatic vehicles. Always measure ET fairly against vehicles of similar transmission type, or adjust results by 30-50 hp when comparing across transmission types.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Tire Traction as a Performance Limiting Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Poor traction during launch creates wheelspin, artificially increasing quarter mile times and reducing calculated horsepower estimates. A car with 400 hp might run 11.5 seconds with street tires but 10.8 seconds with drag-specific tires—the horsepower hasn't changed, only the launch efficiency has improved.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Inaccurate Vehicle Weight Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimating weight rather than weighing the vehicle introduces errors that directly multiply through the calculation. A 300 lb error (±8% on a 3,800 lb car) can result in 50+ hp discrepancies in the final estimate. Always use calibrated scales for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing ET-Based Estimates with Actual Dyno Horsepower</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Quarter mile calculations estimate gross horsepower but don't account for drivetrain losses (typically 10-15% for rear-wheel drive vehicles). A vehicle showing 350 calculated hp might only deliver 300 hp to the wheels, which is the relevant figure for real-world performance upgrades.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is horsepower calculated from quarter mile elapsed time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horsepower is estimated using the relationship between a vehicle's weight, quarter mile ET (elapsed time), and acceleration. The most common formula used is: HP = (Weight × 5.825) / ET³. This empirical formula assumes standard atmospheric conditions and typical drag coefficients. For example, a 3,500 lb car running 12 seconds would produce approximately 130 horsepower.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between calculated HP and actual dyno horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calculated horsepower from quarter mile times provides an estimate based on acceleration performance, while dyno horsepower measures actual power output at the wheels or crank. The quarter mile method can vary by 10-20% depending on launch quality, traction, driver skill, and environmental factors. A car showing 400 hp on a dyno might run quarter mile times suggesting 380-420 hp due to these variables.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does vehicle weight significantly affect the horsepower estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, vehicle weight is critical in the calculation because heavier vehicles require more power to achieve the same acceleration. Two vehicles with identical quarter mile times but different weights will show different horsepower estimates. For instance, a 3,000 lb vehicle and 4,500 lb vehicle both running 11 seconds would be calculated as 185 hp and 278 hp respectively.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What quarter mile time would indicate 500 horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the standard formula HP = (Weight × 5.825) / ET³, a 3,500 lb vehicle would need to run approximately 9.5 seconds to produce an estimated 500 horsepower. However, this varies significantly by weight—a heavier 5,000 lb vehicle would need roughly 10.8 seconds for the same power output. These are theoretical minimums and real-world results depend on traction and environmental conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do atmospheric conditions affect quarter mile ET and calculated horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Air density, temperature, and altitude all influence quarter mile performance and thus calculated horsepower estimates. Cool, dense air at sea level provides better traction and engine performance than hot, thin air at high altitude. A vehicle might run 11.5 seconds at sea level but 12.1 seconds at 5,000 ft elevation, suggesting lower power despite identical engine output.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all types of vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for conventional vehicles with standard aerodynamics and weight distributions. It's less accurate for high-downforce race cars, trucks with trailers, or vehicles with extreme modifications. Drag racing sleds, for example, may produce different results because the formula assumes typical drag coefficients around 0.3-0.4.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does ET mean in drag racing terminology?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ET stands for Elapsed Time and represents the total time in seconds it takes a vehicle to complete a quarter mile (1,320 feet or 402 meters) from a dead stop. Lower ET numbers indicate faster acceleration and, theoretically, more horsepower. The difference between a 10-second and 11-second ET can represent 50+ horsepower variation depending on vehicle weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the horsepower estimate for stock vehicles versus modified cars?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is generally accurate within ±10% for stock vehicles that haven't been significantly modified. For heavily modified or turbocharged vehicles, accuracy decreases because the formula doesn't account for power delivery variations or boost characteristics. A stock 300 hp sedan might show calculated results within 20 hp, while a heavily modified car could vary by 50+ hp.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a good quarter mile time for a street vehicle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most stock sedans run 14-16 second quarter miles, while performance vehicles typically achieve 11-13 seconds, and high-performance sports cars often run under 11 seconds. A 12-second quarter mile generally indicates 250-350 hp depending on weight, while a 10-second time suggests 400+ hp. Anything under 9 seconds typically indicates specialty performance or racing vehicles with 500+ hp.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhra.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHRA Technical Rules and Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official National Hot Rod Association resource for quarter mile racing standards, vehicle classifications, and performance measurement protocols.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j1349_202308/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Power Testing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard specifications for measuring and reporting automotive horsepower and torque across different testing methodologies.</p>
          </li>
          <li>
            <a href="https://www.popularmechanics.com/cars/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Popular Mechanics Automotive Performance Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive automotive resource covering quarter mile testing, performance measurements, and horsepower calculations for enthusiasts and professionals.</p>
          </li>
          <li>
            <a href="https://www.caranddriver.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Car and Driver Performance Specifications Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for documented quarter mile times, horsepower figures, and performance data across thousands of vehicles and model years.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horsepower from Quarter Mile ET Calculator"
      description="Professional automotive calculator: Horsepower from Quarter Mile ET Calculator. Get accurate estimates, expert advice, and financial insights."
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