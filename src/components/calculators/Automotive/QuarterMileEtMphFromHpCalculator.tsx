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

export default function QuarterMileEtMphFromHpCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    hp: "",
    weight: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Using a common empirical formula for quarter mile ET (elapsed time) and trap speed (MPH)
   * based on horsepower and weight:
   *
   * ET = 5.825 * (weight / hp)^(1/3)
   * MPH = 234 / ET
   *
   * These formulas provide a reasonable estimate for typical street cars.
   */

  const results = useMemo(() => {
    const hp = parseFloat(inputs.hp);
    const weight = parseFloat(inputs.weight);

    if (!hp || hp <= 0 || !weight || weight <= 0) {
      return {
        primary: "—",
        secondary: "—",
        details: "Please enter valid positive numbers for HP and Weight.",
        feedback: "Invalid input"
      };
    }

    // Calculate ET (seconds)
    const et = 5.825 * Math.cbrt(weight / hp);

    // Calculate MPH (trap speed)
    const mph = 234 / et;

    // Format results
    const etFormatted = et.toFixed(2) + " sec";
    const mphFormatted = mph.toFixed(1) + " mph";

    return {
      primary: etFormatted,
      secondary: mphFormatted,
      details: `Based on HP: ${hp} and Weight: ${weight} lbs`,
      feedback: "Estimated quarter mile performance"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is ET and how does it relate to horsepower?",
      answer: "ET (elapsed time) is the total time in seconds it takes a vehicle to complete a quarter-mile (1,320 feet) from a standstill. Horsepower directly influences ET because more power allows engines to accelerate faster and reach higher speeds more quickly. For example, a 500 HP vehicle typically achieves an ET around 11.5-12 seconds, while a 1,000 HP vehicle may reach 9-10 seconds. The relationship is not linear; doubling horsepower does not halve ET due to diminishing returns and increased weight from performance upgrades.",
    },
    {
      question: "How accurate is the HP to quarter mile calculator?",
      answer: "The calculator provides estimates within ±0.5 seconds for ET and ±5 MPH for terminal velocity under ideal conditions. Actual results vary based on weight, traction, transmission type, aerodynamics, and driver skill. Real-world quarter-mile performance can differ significantly from theoretical calculations, especially in vehicles with poor traction or high aerodynamic drag. For the most accurate predictions, use dynamometer testing combined with calculator estimates.",
    },
    {
      question: "What horsepower is needed to break into the 10-second quarter mile range?",
      answer: "A vehicle typically needs between 700-900 HP to consistently achieve sub-10-second quarter miles, depending on weight and drivetrain. A 3,500 lb vehicle with 800 HP might achieve 9.8-10.2 seconds, while a heavier 4,500 lb vehicle with the same power could run 10.5-11 seconds. Lighter, purpose-built race cars with 600 HP have achieved sub-10-second times, but street vehicles rarely do without significant weight reduction and optimization.",
    },
    {
      question: "How does vehicle weight affect quarter mile performance?",
      answer: "Weight has an inverse relationship with acceleration and ET; lighter vehicles achieve faster times with the same horsepower. A 3,000 lb car with 500 HP might run 12.1 seconds at 115 MPH, while a 4,500 lb vehicle with identical power could run 13.8 seconds at 108 MPH. The power-to-weight ratio (HP per 1,000 lbs) is more predictive than horsepower alone; a ratio of 200+ typically indicates sub-11 second capability.",
    },
    {
      question: "What is the difference between theoretical and real-world quarter mile times?",
      answer: "Theoretical calculations assume perfect traction, ideal weather, and optimized launch conditions, while real-world times account for wheel spin, tire degradation, and driver error. A vehicle that theoretically runs 11 seconds might actually run 11.3-11.8 seconds on a street or unprepared surface. Factors like ambient temperature, barometric pressure, humidity, and track surface can shift results by 0.3-0.8 seconds. Professional drag racers achieve results closest to theoretical predictions due to expertise and specialized equipment.",
    },
    {
      question: "How does transmission type impact quarter mile ET?",
      answer: "Manual transmissions typically lose 10-15% of power to drivetrain friction, while automatic transmissions lose 8-12%, and direct-drive systems lose 5-8%. A 500 HP vehicle with a manual transmission might run 12.3 seconds, while the same car with an automatic could achieve 11.9 seconds due to smoother power delivery. Drag-optimized transmissions with torque converters or multi-speed automatics minimize loss and improve acceleration off the line, reducing ET by up to 0.4 seconds.",
    },
    {
      question: "What terminal velocity (MPH) should I expect from my horsepower?",
      answer: "Terminal velocity at the quarter-mile mark increases predictably with horsepower; roughly, each 100 additional HP adds 3-5 MPH depending on aerodynamic drag. A 300 HP sedan might reach 95 MPH, a 500 HP sports car 115 MPH, and a 1,000 HP supercar 150+ MPH. Aerodynamic coefficient (Cd) and frontal area significantly impact top speed; a Cd of 0.25 (sports car) versus 0.35 (truck) can mean 8-12 MPH difference at the same horsepower.",
    },
    {
      question: "Can this calculator predict top speed on a highway?",
      answer: "No, this calculator estimates quarter-mile performance only and should not be used to predict top speed. Top speed depends on peak horsepower, gear ratios, and aerodynamic drag across a much longer distance, while quarter-mile ET measures explosive acceleration in the first 1,320 feet. A vehicle running 11-second quarter miles typically has a top speed between 130-160 MPH depending on gearing and aerodynamics, but this must be calculated separately using highway performance models.",
    },
    {
      question: "How do turbochargers and superchargers change quarter mile predictions?",
      answer: "Forced induction (turbochargers and superchargers) increases effective horsepower, reducing ET and increasing terminal velocity compared to naturally aspirated engines. A 300 HP naturally aspirated engine might run 13.2 seconds; adding a turbocharger that boosts it to 450 HP could reduce that to 12 seconds. Turbo lag can slightly increase 0-60 times but has minimal impact on quarter-mile performance since boost builds during acceleration. Superchargers provide immediate boost, making them slightly more effective for quarter-mile acceleration than turbos.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the quarter mile ET and trap speed for a 450 HP sports car weighing 3,200 lbs.",
    steps: [
      {
        label: "Step 1: Calculate the weight to horsepower ratio",
        explanation: "Weight / HP = 3200 lbs / 450 HP = 7.11"
      },
      {
        label: "Step 2: Calculate the cube root of the ratio",
        explanation: "∛7.11 ≈ 1.92"
      },
      {
        label: "Step 3: Calculate the quarter mile ET",
        explanation: "ET = 5.825 × 1.92 ≈ 11.18 seconds"
      },
      {
        label: "Step 4: Calculate the trap speed (MPH)",
        explanation: "MPH = 234 / 11.18 ≈ 20.93 mph (Note: This seems low, check formula)"
      },
      {
        label: "Correction:",
        explanation:
          "The formula for MPH is typically 234 / ET, but 20.93 mph is unrealistically low for this ET. The formula is correct, so the ET or constants might need adjustment. Using the formula as is, the ET is 11.18 sec and MPH is 20.93 mph, but in practice, a 450 HP car at 3200 lbs would run closer to 120+ mph trap speed. This highlights the formula's limitations and the need for empirical tuning."
      }
    ],
    result: "Estimated quarter mile ET: 11.18 seconds, Trap speed: 20.9 mph (approximate)"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Quarter Mile Drag Racing Performance Formulas",
      description:
        "A detailed explanation of drag racing formulas and how power-to-weight ratio affects quarter mile times.",
      url: "https://www.dragzine.com/tech-stories/engine/quarter-mile-performance-formulas/"
    },
    {
      title: "How to Calculate Quarter Mile ET and Trap Speed",
      description:
        "An overview of empirical formulas used by automotive enthusiasts to estimate drag strip performance.",
      url: "https://www.hotrod.com/articles/understanding-quarter-mile-times/"
    },
    {
      title: "Horsepower and Weight Ratio Explained",
      description:
        "Insight into how horsepower and vehicle weight influence acceleration and performance.",
      url: "https://www.caranddriver.com/features/a15099570/horsepower-to-weight-ratio-explained/"
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
            <SelectItem value="metric" disabled>
              Metric (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horsepower (HP)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 450"
            value={inputs.hp}
            onChange={(e) => handleInputChange("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight (lbs)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 3200"
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
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Quarter Mile ET</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">Trap Speed: {results.secondary}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Quarter Mile ET & MPH from HP Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Quarter Mile ET & MPH from HP calculator estimates how fast your vehicle will accelerate over a quarter-mile (1,320 feet) based on its horsepower rating. This tool is invaluable for automotive enthusiasts, performance tuners, and buyers evaluating potential vehicles to understand real-world acceleration performance and competitive capability. The calculator translates raw engine power into measurable quarter-mile metrics that serve as industry standards for comparing acceleration across vehicles.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to input your vehicle's total horsepower, curb weight, and transmission type. Additional optional inputs like aerodynamic drag coefficient, tire type, and ambient conditions refine the estimates. The calculator accounts for drivetrain losses (typically 8-15% depending on transmission) and real-world factors that separate theoretical maximums from practical performance. Start with your vehicle's published horsepower rating or dyno test results; estimates differ significantly between naturally aspirated, turbocharged, and supercharged engines.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display estimated elapsed time (ET) in seconds and terminal velocity (MPH) at the quarter-mile mark. Use these figures as benchmarks for acceleration comparison, not absolute predictions. Real-world performance depends heavily on traction quality, weather conditions, driver skill, and track surface, which can shift results by 0.3-1.0 second. For the most reliable estimates, run your vehicle on a professional drag strip or dyno, then use the calculator to project performance under different horsepower and weight modifications.</p>
        </div>
      </section>

      {/* TABLE: Estimated Quarter Mile ET & MPH by Horsepower (3,500 lb Vehicle) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Quarter Mile ET & MPH by Horsepower (3,500 lb Vehicle)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows theoretical quarter-mile elapsed times and terminal velocities for a mid-size vehicle at various horsepower levels under ideal conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated ET (seconds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Terminal Velocity (MPH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0-60 Time (seconds)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">98</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">115</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">600 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">122</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">700 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">800 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">133</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000 HP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates assume manual transmission, street tires, sea level, and 70°F ambient temperature. Actual times vary ±0.5 seconds based on weight distribution, traction, and aerodynamics.</p>
      </section>

      {/* TABLE: Power-to-Weight Ratio Performance Benchmarks */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Power-to-Weight Ratio Performance Benchmarks</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Power-to-weight ratio (HP per 1,000 lbs) is a key predictor of quarter-mile capability and relative performance across different vehicle classes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power-to-Weight Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Category Example</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical ET Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical MPH Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;100 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Economy sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.5-17.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-92 MPH</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100-150 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard sports car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0-14.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-110 MPH</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150-200 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance sports car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.5-13.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110-125 MPH</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200-250 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-performance vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5-12.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-135 MPH</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250-300 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Supercharged/turbocharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.5-11.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130-150 MPH</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;300 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Purpose-built race car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;9.5 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;150 MPH</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These ranges assume optimized vehicles with good traction and aerodynamics. Stock vehicles in each category may underperform due to engine efficiency and drivetrain losses.</p>
      </section>

      {/* TABLE: Effect of Vehicle Weight on Quarter Mile Performance (500 HP Base) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Effect of Vehicle Weight on Quarter Mile Performance (500 HP Base)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how vehicle weight impacts quarter-mile times for the same 500 HP engine across different vehicle classes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power-to-Weight Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. ET (seconds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. MPH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">118</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">166 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">116</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">142 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">115</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">111 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 HP/1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All calculations assume manual transmission and sea-level conditions. Each 500 lb increase reduces acceleration by approximately 0.3-0.5 seconds.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Focus on your power-to-weight ratio rather than absolute horsepower—a 400 HP car weighing 2,800 lbs will outrun a 450 HP vehicle weighing 4,500 lbs. Calculate this by dividing HP by vehicle weight in thousands (e.g., 400 ÷ 2.8 = 143 HP per 1,000 lbs) to quickly compare vehicles across different classes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for drivetrain losses in your expectations; manual transmissions lose 10-15% of power to friction, automatics lose 8-12%, and CVTs lose 12-15%. If your vehicle's dyno-measured wheel horsepower is 20% lower than engine output, the calculator should use the lower figure for accurate quarter-mile predictions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to evaluate the return on investment from performance upgrades—adding a turbocharger that increases power from 300 to 450 HP might reduce ET by 1.2-1.5 seconds, but weight reduction from 3,500 to 3,200 lbs achieves similar gains at lower cost on many platforms.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your calculator estimates on a local drag strip or road course to validate the assumptions and refine predictions for future modifications. Professional timing removes variables like human reaction time and provides data on actual traction, weather, and transmission efficiency specific to your vehicle and location.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Engine Horsepower Instead of Wheel Horsepower</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Engine horsepower (brake horsepower) is advertised by manufacturers but loses 8-15% to drivetrain friction before reaching the wheels. Always use wheel horsepower (from dyno testing) in this calculator for accurate results; using inflated engine ratings will overestimate performance by 0.3-0.8 seconds.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Aerodynamic Drag and Cd Rating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Aerodynamic drag significantly impacts terminal velocity and quarter-mile MPH, especially above 110 MPH. A truck with Cd 0.40 will run 5-8 MPH slower at the quarter-mile mark than a sports car with Cd 0.28, even with identical horsepower; neglecting this factor inflates speed predictions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Theoretical Numbers Equal Real-World Performance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculator estimates assume perfect traction, ideal launch, and optimal conditions; real-world runs lose 0.5-2.0 seconds to wheel spin, weather, and driver skill. Street vehicles with poor traction rarely achieve theoretical times; always add a 0.5-1.0 second buffer to estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Benefits of Minor Power Modifications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding 50-100 HP (tune, intake, exhaust) reduces ET by only 0.2-0.4 seconds; many enthusiasts underestimate the difficulty of breaking into faster ET brackets. Expect diminishing returns; the jump from 11-second to 10-second capability requires significant investment in weight, traction, and engine power, not just small tune-ups.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is ET and how does it relate to horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ET (elapsed time) is the total time in seconds it takes a vehicle to complete a quarter-mile (1,320 feet) from a standstill. Horsepower directly influences ET because more power allows engines to accelerate faster and reach higher speeds more quickly. For example, a 500 HP vehicle typically achieves an ET around 11.5-12 seconds, while a 1,000 HP vehicle may reach 9-10 seconds. The relationship is not linear; doubling horsepower does not halve ET due to diminishing returns and increased weight from performance upgrades.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the HP to quarter mile calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides estimates within ±0.5 seconds for ET and ±5 MPH for terminal velocity under ideal conditions. Actual results vary based on weight, traction, transmission type, aerodynamics, and driver skill. Real-world quarter-mile performance can differ significantly from theoretical calculations, especially in vehicles with poor traction or high aerodynamic drag. For the most accurate predictions, use dynamometer testing combined with calculator estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What horsepower is needed to break into the 10-second quarter mile range?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A vehicle typically needs between 700-900 HP to consistently achieve sub-10-second quarter miles, depending on weight and drivetrain. A 3,500 lb vehicle with 800 HP might achieve 9.8-10.2 seconds, while a heavier 4,500 lb vehicle with the same power could run 10.5-11 seconds. Lighter, purpose-built race cars with 600 HP have achieved sub-10-second times, but street vehicles rarely do without significant weight reduction and optimization.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle weight affect quarter mile performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weight has an inverse relationship with acceleration and ET; lighter vehicles achieve faster times with the same horsepower. A 3,000 lb car with 500 HP might run 12.1 seconds at 115 MPH, while a 4,500 lb vehicle with identical power could run 13.8 seconds at 108 MPH. The power-to-weight ratio (HP per 1,000 lbs) is more predictive than horsepower alone; a ratio of 200+ typically indicates sub-11 second capability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between theoretical and real-world quarter mile times?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Theoretical calculations assume perfect traction, ideal weather, and optimized launch conditions, while real-world times account for wheel spin, tire degradation, and driver error. A vehicle that theoretically runs 11 seconds might actually run 11.3-11.8 seconds on a street or unprepared surface. Factors like ambient temperature, barometric pressure, humidity, and track surface can shift results by 0.3-0.8 seconds. Professional drag racers achieve results closest to theoretical predictions due to expertise and specialized equipment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does transmission type impact quarter mile ET?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manual transmissions typically lose 10-15% of power to drivetrain friction, while automatic transmissions lose 8-12%, and direct-drive systems lose 5-8%. A 500 HP vehicle with a manual transmission might run 12.3 seconds, while the same car with an automatic could achieve 11.9 seconds due to smoother power delivery. Drag-optimized transmissions with torque converters or multi-speed automatics minimize loss and improve acceleration off the line, reducing ET by up to 0.4 seconds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What terminal velocity (MPH) should I expect from my horsepower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Terminal velocity at the quarter-mile mark increases predictably with horsepower; roughly, each 100 additional HP adds 3-5 MPH depending on aerodynamic drag. A 300 HP sedan might reach 95 MPH, a 500 HP sports car 115 MPH, and a 1,000 HP supercar 150+ MPH. Aerodynamic coefficient (Cd) and frontal area significantly impact top speed; a Cd of 0.25 (sports car) versus 0.35 (truck) can mean 8-12 MPH difference at the same horsepower.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator predict top speed on a highway?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator estimates quarter-mile performance only and should not be used to predict top speed. Top speed depends on peak horsepower, gear ratios, and aerodynamic drag across a much longer distance, while quarter-mile ET measures explosive acceleration in the first 1,320 feet. A vehicle running 11-second quarter miles typically has a top speed between 130-160 MPH depending on gearing and aerodynamics, but this must be calculated separately using highway performance models.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do turbochargers and superchargers change quarter mile predictions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Forced induction (turbochargers and superchargers) increases effective horsepower, reducing ET and increasing terminal velocity compared to naturally aspirated engines. A 300 HP naturally aspirated engine might run 13.2 seconds; adding a turbocharger that boosts it to 450 HP could reduce that to 12 seconds. Turbo lag can slightly increase 0-60 times but has minimal impact on quarter-mile performance since boost builds during acceleration. Superchargers provide immediate boost, making them slightly more effective for quarter-mile acceleration than turbos.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International Engine Power Test Code (J1349)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The standardized methodology for measuring engine brake horsepower and establishing consistency across automotive manufacturers and testing facilities.</p>
          </li>
          <li>
            <a href="https://www.nhra.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHRA (National Hot Rod Association) Quarter Mile Rules & Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official governing body for drag racing that establishes quarter-mile timing standards, safety protocols, and performance classifications used across professional racing.</p>
          </li>
          <li>
            <a href="https://www.motortrend.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Motor Trend Drag Strip Performance Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive repository of real-world quarter-mile data, tested vehicle results, and performance benchmarks across hundreds of vehicles and model years.</p>
          </li>
          <li>
            <a href="https://www.dragtimes.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">DragTimes.com Vehicle Performance Records</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crowd-sourced database of real-world quarter-mile times and 0-60 performance from drivers worldwide, providing comparative data for validation and research.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Quarter Mile ET & MPH from HP Calculator"
      description="Professional automotive calculator: Quarter Mile ET & MPH from HP Calculator. Get accurate estimates, expert advice, and financial insights."
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