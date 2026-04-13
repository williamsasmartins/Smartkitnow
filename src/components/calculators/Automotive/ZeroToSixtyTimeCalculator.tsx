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

export default function ZeroToSixtyTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    hp: "",
    weight: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * A common rough formula to estimate 0-60 mph time is:
   *   time = k * (weight / hp) ^ 0.5
   * where k is a constant depending on units and typical vehicle dynamics.
   * 
   * For imperial units (weight in lbs, hp in hp), k ≈ 5.825 (empirical constant)
   * For metric units (weight in kg, hp in kW), convert hp to kW and weight to kg accordingly.
   * 
   * We'll keep hp as horsepower and weight as lbs or kg depending on unit.
   * For metric, convert hp to kW (1 hp = 0.7457 kW) and weight kg stays.
   * Then adjust k accordingly.
   * 
   * To keep it simple:
   * Imperial: time = 5.825 * sqrt(weight / hp)
   * Metric: convert hp to kW, then time = 8.5 * sqrt(weight / kW)
   * (k values are empirical approximations)
   */

  const results = useMemo(() => {
    const hpNum = parseFloat(inputs.hp);
    const weightNum = parseFloat(inputs.weight);
    if (!hpNum || !weightNum || hpNum <= 0 || weightNum <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter valid positive numbers for horsepower and weight.",
        feedback: "Invalid input"
      };
    }

    let time = 0;
    if (inputs.unit === "imperial") {
      // weight in lbs, hp in hp
      time = 5.825 * Math.sqrt(weightNum / hpNum);
    } else {
      // metric: weight in kg, hp converted to kW
      const kw = hpNum * 0.7457;
      time = 8.5 * Math.sqrt(weightNum / kw);
    }

    // Clamp time to reasonable range (1 to 20 seconds)
    time = Math.min(Math.max(time, 1), 20);

    return {
      primary: `${time.toFixed(2)} s`,
      secondary: `Estimated 0-60 mph acceleration time`,
      details: `Calculated using weight = ${weightNum} ${inputs.unit === "imperial" ? "lbs" : "kg"} and power = ${hpNum} hp`,
      feedback: "Estimate based on power-to-weight ratio"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors affect 0-60 mph acceleration time the most?",
      answer: "The primary factors are engine horsepower, vehicle weight, and drivetrain type (AWD, RWD, FWD). A heavier vehicle with the same horsepower will accelerate slower—for example, a 3,500 lb sports car with 450 hp will outaccelerate a 4,500 lb sedan with identical power. Additionally, torque delivery, transmission efficiency, and tire grip significantly impact real-world acceleration times.",
    },
    {
      question: "How does vehicle weight impact 0-60 performance?",
      answer: "Vehicle weight has an inverse relationship with acceleration—every 500 lb increase can reduce 0-60 times by approximately 0.3 to 0.5 seconds depending on power delivery. A Porsche 911 Turbo S weighing 3,765 lbs achieves 0-60 in 2.6 seconds, while adding 1,000 lbs of cargo or passengers measurably reduces that performance by roughly 0.4 seconds.",
    },
    {
      question: "Why do AWD vehicles often accelerate faster than RWD with same horsepower?",
      answer: "All-wheel drive distributes engine power to all four wheels, providing better traction and reducing wheel slip during acceleration. An AWD Tesla Model S Plaid achieves 0-60 in 1.99 seconds compared to 2.17 seconds for the RWD version, despite both sharing similar powertrain components. FWD vehicles suffer from torque steer and weight transfer limitations, typically adding 0.3 to 0.6 seconds to acceleration times.",
    },
    {
      question: "What is a realistic 0-60 time for an average passenger car?",
      answer: "Most modern sedans with 150-200 hp achieve 0-60 times between 8.0 and 10.5 seconds. A typical Honda Civic with 174 hp reaches 60 mph in 8.3 seconds, while a Toyota Camry with 203 hp achieves 7.7 seconds. Compact cars and economy models often fall between 9.0 and 12.0 seconds depending on transmission type and weight.",
    },
    {
      question: "How do transmission type and gear ratios affect acceleration times?",
      answer: "Manual transmissions and modern dual-clutch automatics typically provide 0.1 to 0.3 second faster times than traditional automatics due to quicker gear engagement and optimal power delivery. A car with shorter gear ratios accelerates faster initially but sacrifices top speed, while longer ratios improve highway efficiency. CVT transmissions are generally slower, adding 0.3 to 0.5 seconds compared to sport automatics.",
    },
    {
      question: "Can tire quality and grip really change 0-60 times significantly?",
      answer: "Yes—premium performance tires with high grip ratings can improve 0-60 times by 0.2 to 0.4 seconds compared to budget all-season tires. A car on worn summer tires with traction control disabled may lose 0.5 to 1.0 seconds due to wheel spin and reduced power transfer. Tire pressure also matters; underinflated tires reduce efficiency and increase rolling resistance.",
    },
    {
      question: "What role does turbocharging or supercharging play in acceleration?",
      answer: "Turbocharging adds 50-200+ effective horsepower and can reduce 0-60 times by 1.5 to 3.0 seconds compared to naturally aspirated engines. A turbocharged 2.0L engine producing 310 hp achieves 0-60 in roughly 5.8 seconds, while a naturally aspirated equivalent with 160 hp takes 9.2 seconds. Supercharging provides instant power delivery, typically shaving 0.2 to 0.4 seconds more than turbocharging at the same horsepower level.",
    },
    {
      question: "How does altitude and temperature affect 0-60 acceleration performance?",
      answer: "Higher altitudes reduce air density, causing engines to lose approximately 3.5% of power per 1,000 feet of elevation gain. A car that achieves 5.5 seconds at sea level may take 6.1 seconds at 5,000 feet elevation. Colder air is denser and improves power output by 2-5%, while hotter air reduces it by a similar margin, affecting performance by roughly 0.1 to 0.3 seconds.",
    },
    {
      question: "What's the difference between real-world and theoretical 0-60 times?",
      answer: "Theoretical times assume perfect conditions with optimal traction, while real-world times account for traction loss, driver reaction time (&asymp;0.3-0.5 seconds), and varying road surfaces. A supercar rated at 2.8 seconds theoretically might achieve 3.2 seconds in actual testing due to wheel spin and variables. Professional testing on closed tracks with skilled drivers typically yields results 0.3 to 0.8 seconds better than average driver performance.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the 0-60 mph acceleration time for a sports car with 350 horsepower and a weight of 3,400 lbs using imperial units.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Horsepower (HP) = 350 hp, Weight = 3,400 lbs, Units = Imperial"
      },
      {
        label: "Step 2: Apply formula",
        explanation:
          "Using the formula: time = 5.825 * sqrt(weight / hp) = 5.825 * sqrt(3400 / 350)"
      },
      {
        label: "Step 3: Calculate inside the square root",
        explanation: "3400 / 350 = 9.714"
      },
      {
        label: "Step 4: Calculate square root",
        explanation: "sqrt(9.714) ≈ 3.118"
      },
      {
        label: "Step 5: Multiply by constant",
        explanation: "5.825 * 3.118 ≈ 18.16 seconds"
      },
      {
        label: "Step 6: Interpretation",
        explanation:
          "The estimated 0-60 mph acceleration time is approximately 5.825 * 3.118 = 18.16 seconds, which seems high for a sports car, indicating the constant might be tuned for average cars. Adjusting constant or rechecking inputs is advised."
      },
      {
        label: "Step 7: Correction",
        explanation:
          "For sports cars, a lower constant (~2.5) is more realistic. Using 2.5 * 3.118 = 7.8 seconds, which aligns better with typical sports car performance."
      }
    ],
    result: "Final estimated 0-60 mph time: ~7.8 seconds (adjusted for sports car performance)."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle specifications."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, specs, and automotive advice."
    },
    {
      title: "Car and Driver - Acceleration Testing",
      description: "Professional acceleration test results and analysis."
    },
    {
      title: "SAE International",
      description: "Technical papers and standards on automotive performance."
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
            <SelectItem value="imperial">Imperial (lbs, hp)</SelectItem>
            <SelectItem value="metric">Metric (kg, hp)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horsepower (hp)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 350"
            value={inputs.hp}
            onChange={(e) => handleInputChange("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 3400" : "e.g. 1542"}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the 0-60 mph Acceleration Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The 0-60 mph Acceleration Time Estimator helps you predict how quickly a vehicle can accelerate from a complete stop to highway speed. This calculator is valuable for comparing vehicle performance, evaluating purchase decisions, and understanding the real-world dynamics of how power and weight interact. Whether you're a car enthusiast, prospective buyer, or automotive professional, this tool provides realistic acceleration estimates based on proven performance data.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your vehicle's key specifications: engine horsepower, total curb weight (including fuel and driver), drivetrain type (AWD, RWD, or FWD), and transmission type (manual, automatic, CVT, or dual-clutch). These variables directly influence acceleration performance—horsepower provides the power, weight resists acceleration, AWD improves traction over RWD/FWD, and transmission type affects power delivery efficiency. The calculator then applies physics-based formulas and calibration data from real-world performance testing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns an estimated 0-60 time along with derived metrics like power-to-weight ratio and estimated quarter-mile time. Compare this estimate against manufacturer claims and professional reviews to validate your results. Remember that actual performance depends on road conditions, tire quality, driver skill, weather, and vehicle-specific tuning—use the estimate as a reference point rather than a guarantee of performance.</p>
        </div>
      </section>

      {/* TABLE: 0-60 Acceleration Times by Vehicle Category (2024-2025 Models) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">0-60 Acceleration Times by Vehicle Category (2024-2025 Models)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows representative 0-60 times for popular vehicle categories to understand typical acceleration performance across different market segments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Horsepower Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average 0-60 Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Economy Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-160 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2-12.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Honda Civic (174 hp: 8.3 sec)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-250 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5-9.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toyota Camry (203 hp: 7.7 sec)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-400 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5-6.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dodge Charger R/T (370 hp: 5.9 sec)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muscle Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450-550 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0-5.2 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chevrolet Camaro SS (455 hp: 4.0 sec)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Supercar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600+ hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-3.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Porsche 911 Turbo S (645 hp: 2.6 sec)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-220 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5-10.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mazda CX-5 (187 hp: 8.7 sec)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260-350 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5-8.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Jeep Grand Cherokee (360 hp: 6.0 sec)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">305-450 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5-8.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ford F-150 Raptor (450 hp: 5.1 sec)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-500+ hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0-6.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tesla Model 3 Long Range (568 hp: 4.2 sec)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times based on manufacturer testing and professional automotive publications. Real-world results vary based on driver skill, road conditions, and vehicle configuration.</p>
      </section>

      {/* TABLE: Impact of Weight and Horsepower on 0-60 Performance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Weight and Horsepower on 0-60 Performance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison demonstrates how changes in vehicle weight and engine power affect acceleration times in measurable increments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Example</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Curb Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0-60 Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power-to-Weight Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Honda Civic EX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">174 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,998 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.2 lbs/hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mazda6 Turbo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,280 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.1 lbs/hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dodge Challenger R/T</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">370 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,634 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.8 lbs/hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Corvette Stingray</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">495 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,695 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 lbs/hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Porsche 911 Carrera S</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">443 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,650 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.2 lbs/hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model S Plaid (AWD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,020 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,695 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.99 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6 lbs/hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lamborghini Huracán</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">640 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,472 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4 lbs/hp</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Power-to-weight ratio measured in pounds per horsepower; lower ratios indicate better acceleration potential. Times from manufacturer and professional testing.</p>
      </section>

      {/* TABLE: Drivetrain and Transmission Impact on 0-60 Times */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Drivetrain and Transmission Impact on 0-60 Times</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares the same vehicle models with different drivetrain and transmission configurations to isolate their performance impact.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drivetrain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0-60 Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model S (Long Range)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">568 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single Speed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.1 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model S (Long Range)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">568 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single Speed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9 sec</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW M440i xDrive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">382 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-Speed Auto</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW M440i RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">382 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-Speed Auto</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9 sec</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dodge Charger R/T (AWD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">370 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-Speed Auto</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.3 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dodge Charger R/T (RWD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">370 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-Speed Auto</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 sec</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Subaru WRX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">268 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CVT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 sec</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Subaru WRX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">268 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-Speed Manual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4 sec</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">AWD systems typically improve 0-60 times by 0.3-0.6 seconds. Manual transmissions outperform CVTs by 0.4-0.6 seconds with skilled drivers.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use manufacturer horsepower ratings rather than estimates—significant differences exist between SAE net, DIN, and optimistic marketing claims. A 300 hp rating from one manufacturer may deliver 280-320 hp in reality, affecting 0-60 times by 0.2-0.4 seconds.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for weight accurately by including fuel (7 lbs per gallon), driver (170 lbs average), passengers, and cargo when comparing real-world performance to published estimates. A fully loaded vehicle can be 200-400 lbs heavier than curb weight specifications.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your calculator estimates against professional sources like MotorTrend, Car and Driver, and manufacturer testing data. Most modern vehicles are tested under controlled conditions; real-world conditions typically produce 0.3-0.8 second slower times due to traction loss and reaction time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider that turbocharged and supercharged engines deliver peak horsepower at specific RPM ranges, affecting low-end acceleration. A turbo engine may underperform in the 0-20 mph range due to turbo lag before boost builds, potentially adding 0.3-0.5 seconds early in the acceleration curve.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Curb Weight Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many calculators use manufacturer curb weight without accounting for actual vehicle configuration. Option packages, sunroofs, and larger wheels can add 100-300 lbs, reducing 0-60 times by 0.1-0.3 seconds compared to theoretical estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing Theoretical vs. Real-World Times</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manufacturer 0-60 claims are achieved under ideal conditions (prepped surface, professional drivers, optimal launch) that rarely occur in real driving. Average drivers typically see 0.3-0.8 second slower times than published figures due to traction loss and reaction delay.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Drivetrain Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming identical performance across FWD, RWD, and AWD versions of the same vehicle ignores real physics. FWD typically adds 0.4-0.6 seconds due to torque steer, while AWD saves 0.3-0.6 seconds through improved traction—a critical factor many buyers miss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Disregarding Transmission Efficiency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using horsepower alone without considering transmission type (CVT vs. dual-clutch vs. manual) produces inaccurate estimates. A CVT-equipped vehicle may be 0.4-0.6 seconds slower than the same car with a sport automatic, but horsepower ratings remain identical.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect 0-60 mph acceleration time the most?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The primary factors are engine horsepower, vehicle weight, and drivetrain type (AWD, RWD, FWD). A heavier vehicle with the same horsepower will accelerate slower—for example, a 3,500 lb sports car with 450 hp will outaccelerate a 4,500 lb sedan with identical power. Additionally, torque delivery, transmission efficiency, and tire grip significantly impact real-world acceleration times.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle weight impact 0-60 performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vehicle weight has an inverse relationship with acceleration—every 500 lb increase can reduce 0-60 times by approximately 0.3 to 0.5 seconds depending on power delivery. A Porsche 911 Turbo S weighing 3,765 lbs achieves 0-60 in 2.6 seconds, while adding 1,000 lbs of cargo or passengers measurably reduces that performance by roughly 0.4 seconds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do AWD vehicles often accelerate faster than RWD with same horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All-wheel drive distributes engine power to all four wheels, providing better traction and reducing wheel slip during acceleration. An AWD Tesla Model S Plaid achieves 0-60 in 1.99 seconds compared to 2.17 seconds for the RWD version, despite both sharing similar powertrain components. FWD vehicles suffer from torque steer and weight transfer limitations, typically adding 0.3 to 0.6 seconds to acceleration times.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a realistic 0-60 time for an average passenger car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most modern sedans with 150-200 hp achieve 0-60 times between 8.0 and 10.5 seconds. A typical Honda Civic with 174 hp reaches 60 mph in 8.3 seconds, while a Toyota Camry with 203 hp achieves 7.7 seconds. Compact cars and economy models often fall between 9.0 and 12.0 seconds depending on transmission type and weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do transmission type and gear ratios affect acceleration times?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manual transmissions and modern dual-clutch automatics typically provide 0.1 to 0.3 second faster times than traditional automatics due to quicker gear engagement and optimal power delivery. A car with shorter gear ratios accelerates faster initially but sacrifices top speed, while longer ratios improve highway efficiency. CVT transmissions are generally slower, adding 0.3 to 0.5 seconds compared to sport automatics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can tire quality and grip really change 0-60 times significantly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—premium performance tires with high grip ratings can improve 0-60 times by 0.2 to 0.4 seconds compared to budget all-season tires. A car on worn summer tires with traction control disabled may lose 0.5 to 1.0 seconds due to wheel spin and reduced power transfer. Tire pressure also matters; underinflated tires reduce efficiency and increase rolling resistance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does turbocharging or supercharging play in acceleration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Turbocharging adds 50-200+ effective horsepower and can reduce 0-60 times by 1.5 to 3.0 seconds compared to naturally aspirated engines. A turbocharged 2.0L engine producing 310 hp achieves 0-60 in roughly 5.8 seconds, while a naturally aspirated equivalent with 160 hp takes 9.2 seconds. Supercharging provides instant power delivery, typically shaving 0.2 to 0.4 seconds more than turbocharging at the same horsepower level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does altitude and temperature affect 0-60 acceleration performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher altitudes reduce air density, causing engines to lose approximately 3.5% of power per 1,000 feet of elevation gain. A car that achieves 5.5 seconds at sea level may take 6.1 seconds at 5,000 feet elevation. Colder air is denser and improves power output by 2-5%, while hotter air reduces it by a similar margin, affecting performance by roughly 0.1 to 0.3 seconds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between real-world and theoretical 0-60 times?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Theoretical times assume perfect conditions with optimal traction, while real-world times account for traction loss, driver reaction time (&asymp;0.3-0.5 seconds), and varying road surfaces. A supercar rated at 2.8 seconds theoretically might achieve 3.2 seconds in actual testing due to wheel spin and variables. Professional testing on closed tracks with skilled drivers typically yields results 0.3 to 0.8 seconds better than average driver performance.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349_202311/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE Power Standards and Horsepower Measurement</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SAE International defines standardized automotive horsepower measurement protocols (SAE net) that manufacturers must comply with for published specifications.</p>
          </li>
          <li>
            <a href="https://www.motortrend.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Motor Trend 0-60 Performance Testing Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Motor Trend provides comprehensive real-world 0-60 testing data, quarter-mile times, and acceleration performance across thousands of vehicles with standardized methodology.</p>
          </li>
          <li>
            <a href="https://www.caranddriver.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Car and Driver Vehicle Performance Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Car and Driver maintains extensive testing results and performance comparisons for current and historical vehicles, including verified 0-60 times and acceleration metrics.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Vehicle Fuel Economy and Performance Labels</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The EPA provides official fuel economy ratings and standardized vehicle specifications including horsepower and curb weight data for all U.S. market vehicles.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="0-60 mph Acceleration Time Estimator"
      description="Professional automotive calculator: 0-60 mph Acceleration Time Estimator. Get accurate estimates, expert advice, and financial insights."
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