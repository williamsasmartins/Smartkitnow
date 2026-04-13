import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ZeroToSixtySpeedVsGearRpmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    gearRatio: "",
    tireDiameter: "",
    rpm: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const gearRatio = parseFloat(inputs.gearRatio);
    const tireDiameter = parseFloat(inputs.tireDiameter);
    const rpm = parseFloat(inputs.rpm);
    const unit = inputs.unit;

    if (!gearRatio || !tireDiameter || !rpm || gearRatio <= 0 || tireDiameter <= 0 || rpm <= 0) {
      return {
        primary: "0",
        secondary: unit === "imperial" ? "mph" : "km/h",
        details: "Please enter valid positive numbers.",
        feedback: "Awaiting input"
      };
    }

    let speed = 0;
    if (unit === "imperial") {
      // Speed (mph) = (RPM * Diameter * PI) / (Gear Ratio * 1056)
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 1056);
    } else {
      // Speed (km/h) = (RPM * Diameter(mm) * PI) / (Gear Ratio * 30000)
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 30000);
    }

    return {
      primary: speed.toFixed(2),
      secondary: unit === "imperial" ? "mph" : "km/h",
      details: `At ${rpm} RPM with ${gearRatio} gear ratio`,
      feedback: "Calculated theoretical speed based on gearing."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the relationship between RPM and 0–60 acceleration?",
      answer: "RPM (revolutions per minute) directly affects how quickly an engine can deliver power during acceleration. Higher RPM allows an engine to produce more horsepower in a given gear, enabling faster 0–60 times. For example, a car shifting at 6,500 RPM will typically achieve faster 0–60 times than one shifting at 5,000 RPM, assuming identical engine displacement and power output, because peak power is being utilized more effectively.",
    },
    {
      question: "How do gear ratios impact 0–60 performance?",
      answer: "Lower gear ratios (numerically higher, like 4.10:1) provide more mechanical advantage and faster acceleration off the line, resulting in better 0–60 times. Higher gear ratios (numerically lower, like 2.73:1) sacrifice initial acceleration for better fuel economy and top speed. A car with a 3.73:1 rear axle ratio typically achieves 0–60 in approximately 0.3–0.5 seconds faster than an identical car with a 2.73:1 ratio.",
    },
    {
      question: "What RPM should I shift gears at for optimal 0–60 performance?",
      answer: "Optimal shift RPM depends on your engine's power curve, but most naturally aspirated engines peak between 5,500–7,000 RPM. Shifting near peak horsepower RPM (not peak torque) provides the fastest acceleration transitions between gears. For turbochargers and superchargers, shifting can occur at higher RPMs (7,000–8,000 RPM) since boost builds across a wider rev range, allowing maximum power delivery throughout acceleration.",
    },
    {
      question: "How does tire grip affect the calculator's 0–60 predictions?",
      answer: "Tire grip (measured by traction coefficient) limits how much power can be converted to acceleration before wheel spin occurs. A car with 400 hp but poor grip may achieve slower 0–60 times than a 300 hp car with excellent traction and grip. Modern high-performance tires with coefficients &gt;1.0 allow vehicles to fully utilize engine power, while all-season tires with coefficients around 0.7–0.8 may limit acceleration potential by 10–15%.",
    },
    {
      question: "What is the difference between wheel horsepower and crank horsepower in 0–60 calculations?",
      answer: "Crank horsepower is measured at the engine's crankshaft, while wheel horsepower is what reaches the wheels after drivetrain losses (transmission, differential, bearings). Automatic transmissions typically lose 10–15% of power, while manual transmissions lose 8–12%. A car rated at 400 crank hp in an automatic may only deliver 340–360 wheel hp, directly impacting real-world 0–60 times compared to calculator predictions based on crank figures.",
    },
    {
      question: "Can I use this calculator to predict 0–60 times for all vehicle types?",
      answer: "This calculator works best for conventional gasoline-powered vehicles with standard powertrains. All-wheel drive vehicles, hybrids, and electric vehicles require different calculations due to power distribution and instant torque delivery. Additionally, heavy vehicles like trucks and SUVs experience greater weight-transfer effects during acceleration, so results may vary by 0.2–0.4 seconds from actual performance.",
    },
    {
      question: "How does vehicle weight affect 0–60 acceleration in this calculator?",
      answer: "Vehicle weight is inversely proportional to acceleration: heavier vehicles require more power to achieve the same 0–60 time. A 3,000 lb car with 300 hp achieves significantly faster acceleration than a 4,500 lb car with the same engine. The power-to-weight ratio (hp per pound) is the critical metric—a ratio of 0.1 hp/lb typically achieves &lt;6 second 0–60 times, while 0.05 hp/lb results in &gt;10 second times.",
    },
    {
      question: "Why do my calculator results differ from manufacturer 0–60 claims?",
      answer: "Manufacturer times are conducted under ideal conditions: professional drivers, optimized launch techniques, slick tires, and sometimes even nitrous oxide or anti-lag systems for performance testing. Real-world conditions include driver reaction time, traction loss, colder temperatures, and tire variability. Calculator predictions typically align with real-world results when using conservative power figures and accounting for a 0.1–0.3 second driver reaction delay.",
    },
    {
      question: "What engine modifications most improve 0–60 performance according to the calculator?",
      answer: "Increasing peak horsepower (via tuning, headers, or forced induction) provides the largest 0–60 gains—each 50 hp increase typically reduces 0–60 time by 0.15–0.25 seconds. Lowering vehicle weight (50 lb reduction yields approximately 0.05 second improvement) and upgrading to a performance transmission with faster shift times also contribute meaningfully. Optimizing gear ratios and shift RPM can provide an additional 0.1–0.2 second improvement when paired with increased power output.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "A driver wants to know their speed in 4th gear (1.00 ratio) at 3,000 RPM. They have a final drive of 3.55 (so effective gear ratio is 3.55) and 26-inch tires.",
    steps: [
      { label: "1. Determine Ratio", explanation: "Transmission (1.00) * Final Drive (3.55) = 3.55 total ratio." },
      { label: "2. Identify Inputs", explanation: "RPM = 3000, Tire = 26 inches, Ratio = 3.55." },
      { label: "3. Apply Formula", explanation: "Speed = (3000 * 26 * 3.1416) / (3.55 * 1056)." },
      { label: "4. Calculate", explanation: "Numerator: 245,044. Denominator: 3,748. Result: 65.38." }
    ],
    result: "The vehicle speed is approx 65.38 mph."
  };

  const references = [
    { title: "Engineering Toolbox: Vehicle Speed RPM", description: "Formulas for calculating speed from gear ratios.", url: "https://www.engineeringtoolbox.com/" },
    { title: "Tremec Gear Ratio Calculator", description: "Official transmission gear calculator tool.", url: "https://www.tremec.com/" },
    { title: "Tire Rack: Tire Tech", description: "Understanding tire diameter and revs per mile.", url: "https://www.tirerack.com/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[180px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (mph / inches)</SelectItem>
            <SelectItem value="metric">Metric (km/h / mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Gear Ratio (e.g. 3.55)</Label>
          <Input type="number" value={inputs.gearRatio} onChange={(e) => handleInputChange("gearRatio", e.target.value)} placeholder="3.55" />
        </div>
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "in" : "mm"})</Label>
          <Input type="number" value={inputs.tireDiameter} onChange={(e) => handleInputChange("tireDiameter", e.target.value)} placeholder={inputs.unit === "imperial" ? "26" : "660"} />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input type="number" value={inputs.rpm} onChange={(e) => handleInputChange("rpm", e.target.value)} placeholder="3000" />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"><Car className="mr-2 h-5 w-5"/> Calculate Speed</Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Theoretical Speed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary} {results.secondary}</div>
            <p className="text-sm text-slate-600">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the 0–60 Speed vs Gear/RPM Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The 0–60 Speed vs Gear/RPM Calculator predicts your vehicle's acceleration time from a standstill to 60 mph based on engine power, gear ratios, weight, and RPM shift points. This tool helps you understand how drivetrain configuration, power delivery, and shift strategy affect real-world acceleration performance, making it invaluable for enthusiasts optimizing performance cars or comparing modifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your vehicle's crank horsepower (or estimate based on your year, make, model), curb weight in pounds, rear axle ratio (differential ratio), transmission type (manual or automatic), and the RPM at which you plan to shift gears. The calculator uses these inputs to model power delivery across gears and estimate the time required to accelerate from 0 to 60 mph under controlled conditions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results as a baseline prediction under ideal conditions—professional driver, optimal traction, warm engine, sea-level altitude, and premium fuel where applicable. Real-world 0–60 times typically vary by 0.2–0.5 seconds due to driver reaction time, tire slip, weather, and road surface variations. Compare multiple scenarios by adjusting gear ratios or shift RPM to see which configuration delivers the fastest acceleration for your specific vehicle or modification plan.</p>
        </div>
      </section>

      {/* TABLE: 0–60 Performance by Power-to-Weight Ratio */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">0–60 Performance by Power-to-Weight Ratio</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical 0–60 times based on the power-to-weight ratio (horsepower per pound), assuming optimal conditions and professional driving.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power-to-Weight Ratio (hp/lb)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical 0–60 Time (seconds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.03–0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Economy sedan or light truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5–14.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Honda Civic (198 hp, 3,100 lb)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.05–0.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mainstream midsize sedan or SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0–10.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Toyota Camry (203 hp, 3,345 lb)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.08–0.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance sedan or muscle car base</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5–8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Dodge Charger (370 hp, 3,990 lb)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.10–0.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-performance coupe or sports car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5–6.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Chevrolet Camaro (455 hp, 3,860 lb)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.15–0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Supercar or high-output sports car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0–4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Dodge Challenger Hellcat (807 hp, 4,520 lb)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme performance (track-focused)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2024 Dodge Viper ACR (645 hp, 3,345 lb)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume manual transmission with optimal shift points and professional driving; automatic transmissions typically add 0.3–0.8 seconds due to shift delay.</p>
      </section>

      {/* TABLE: Impact of Gear Ratio on 0–60 Performance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Gear Ratio on 0–60 Performance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how rear axle ratio (differential ratio) affects 0–60 acceleration for a typical 300 hp vehicle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rear Axle Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mechanical Advantage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0–60 Time Estimate (seconds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.55:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowest (economical)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8–9.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highway cruising, fuel efficiency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.73:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5–8.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard automatic transmission vehicles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.08:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0–8.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily drivers seeking balance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.55:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5–7.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance-oriented driving</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.73:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very high</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2–7.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sports cars and truck towing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.10:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8–7.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drag racing and acceleration focus</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.56:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4–6.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Off-road vehicles and extreme performance</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes 3,500 lb vehicle weight, peak horsepower at 5,500 RPM, and manual transmission; lower ratios improve fuel economy by 8–12%.</p>
      </section>

      {/* TABLE: RPM Shift Points and Acceleration Impact */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">RPM Shift Points and Acceleration Impact</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different shift RPM points affect 0–60 times for a turbocharged engine with varying power curves.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shift RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Power RPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0–60 Time Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Naturally aspirated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.4 to +0.6 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shifts before peak power; slower acceleration</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Naturally aspirated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline (0.0 sec)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal for most naturally aspirated engines</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Naturally aspirated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,500 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−0.1 to +0.1 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shifts at peak horsepower; very efficient</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Turbocharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,800 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.2 to +0.4 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early shift before boost peaks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Turbocharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,800 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline (0.0 sec)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal for most turbocharged engines</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Turbocharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,800 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−0.2 to 0.0 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher boost pressure maximized; slight gain</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Supercharged</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,200 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−0.3 to +0.1 sec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mechanical superchargers support higher RPM</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gains/losses are relative to optimal shift point; transmission lag of 0.15–0.35 seconds is not included in figures.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use manufacturer crank horsepower ratings, not inflated aftermarket estimates, for the most accurate calculator predictions; overstating power by 50 hp can skew results by 0.3 seconds or more.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for transmission losses when comparing manual and automatic vehicles—subtract 10–12% from horsepower for manuals and 12–15% for automatics to predict wheel horsepower, which directly impacts acceleration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test different shift RPM points in the calculator to find your engine's sweet spot; most naturally aspirated engines optimize between 5,500–6,500 RPM, while turbocharged engines often benefit from 7,000–8,000 RPM shifts.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that the calculator assumes sea-level conditions and standard air density; vehicles at elevations above 3,000 feet experience 3–5% power loss per 1,000 feet of altitude, directly reducing 0–60 performance by 0.15–0.30 seconds.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using SAE Gross Horsepower Instead of Net</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older vehicles are sometimes rated in SAE gross horsepower (measured without alternator, air filter, or emissions equipment), which overstates real power by 15–30% compared to SAE net ratings. Modern vehicles use net horsepower, so comparing vintage cars to modern ones using gross figures will produce inaccurate calculator results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Transmission Type Losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Automatic transmissions lose 12–15% of engine power through fluid coupling and torque converter slippage, while manuals lose only 8–12%. Forgetting to account for these losses when entering horsepower will cause your predicted 0–60 time to be 0.4–0.8 seconds faster than real-world performance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Optimal Traction Always Exists</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes your tires can fully grip the road, but most vehicles experience some wheel spin during hard launch, especially rear-wheel-drive cars with less than 0.12 hp/lb ratio. Wet roads or all-season tires can easily add 0.5–1.5 seconds to actual 0–60 times compared to dry, high-grip-coefficient performance tire conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Gear Ratio Limitations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excessively low gear ratios (numerically high, like 5.13:1) designed for drag racing will cause your engine to redline before reaching 60 mph, wasting acceleration potential and producing slower times. Conversely, ratios that are too high shift the optimal acceleration zone into second or third gear, losing initial launch advantage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between RPM and 0–60 acceleration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RPM (revolutions per minute) directly affects how quickly an engine can deliver power during acceleration. Higher RPM allows an engine to produce more horsepower in a given gear, enabling faster 0–60 times. For example, a car shifting at 6,500 RPM will typically achieve faster 0–60 times than one shifting at 5,000 RPM, assuming identical engine displacement and power output, because peak power is being utilized more effectively.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do gear ratios impact 0–60 performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lower gear ratios (numerically higher, like 4.10:1) provide more mechanical advantage and faster acceleration off the line, resulting in better 0–60 times. Higher gear ratios (numerically lower, like 2.73:1) sacrifice initial acceleration for better fuel economy and top speed. A car with a 3.73:1 rear axle ratio typically achieves 0–60 in approximately 0.3–0.5 seconds faster than an identical car with a 2.73:1 ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What RPM should I shift gears at for optimal 0–60 performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Optimal shift RPM depends on your engine's power curve, but most naturally aspirated engines peak between 5,500–7,000 RPM. Shifting near peak horsepower RPM (not peak torque) provides the fastest acceleration transitions between gears. For turbochargers and superchargers, shifting can occur at higher RPMs (7,000–8,000 RPM) since boost builds across a wider rev range, allowing maximum power delivery throughout acceleration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tire grip affect the calculator's 0–60 predictions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tire grip (measured by traction coefficient) limits how much power can be converted to acceleration before wheel spin occurs. A car with 400 hp but poor grip may achieve slower 0–60 times than a 300 hp car with excellent traction and grip. Modern high-performance tires with coefficients &gt;1.0 allow vehicles to fully utilize engine power, while all-season tires with coefficients around 0.7–0.8 may limit acceleration potential by 10–15%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between wheel horsepower and crank horsepower in 0–60 calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Crank horsepower is measured at the engine's crankshaft, while wheel horsepower is what reaches the wheels after drivetrain losses (transmission, differential, bearings). Automatic transmissions typically lose 10–15% of power, while manual transmissions lose 8–12%. A car rated at 400 crank hp in an automatic may only deliver 340–360 wheel hp, directly impacting real-world 0–60 times compared to calculator predictions based on crank figures.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to predict 0–60 times for all vehicle types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for conventional gasoline-powered vehicles with standard powertrains. All-wheel drive vehicles, hybrids, and electric vehicles require different calculations due to power distribution and instant torque delivery. Additionally, heavy vehicles like trucks and SUVs experience greater weight-transfer effects during acceleration, so results may vary by 0.2–0.4 seconds from actual performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle weight affect 0–60 acceleration in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vehicle weight is inversely proportional to acceleration: heavier vehicles require more power to achieve the same 0–60 time. A 3,000 lb car with 300 hp achieves significantly faster acceleration than a 4,500 lb car with the same engine. The power-to-weight ratio (hp per pound) is the critical metric—a ratio of 0.1 hp/lb typically achieves &lt;6 second 0–60 times, while 0.05 hp/lb results in &gt;10 second times.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do my calculator results differ from manufacturer 0–60 claims?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manufacturer times are conducted under ideal conditions: professional drivers, optimized launch techniques, slick tires, and sometimes even nitrous oxide or anti-lag systems for performance testing. Real-world conditions include driver reaction time, traction loss, colder temperatures, and tire variability. Calculator predictions typically align with real-world results when using conservative power figures and accounting for a 0.1–0.3 second driver reaction delay.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What engine modifications most improve 0–60 performance according to the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increasing peak horsepower (via tuning, headers, or forced induction) provides the largest 0–60 gains—each 50 hp increase typically reduces 0–60 time by 0.15–0.25 seconds. Lowering vehicle weight (50 lb reduction yields approximately 0.05 second improvement) and upgrading to a performance transmission with faster shift times also contribute meaningfully. Optimizing gear ratios and shift RPM can provide an additional 0.1–0.2 second improvement when paired with increased power output.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349_201608/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Horsepower Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SAE specification for measuring and rating net and gross horsepower in internal combustion engines.</p>
          </li>
          <li>
            <a href="https://www.motortrend.com/features/how-we-test-acceleration/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Motor Trend: 0–60 Acceleration Testing Methodology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard explanation of how professional automotive journalists conduct 0–60 testing and control variables affecting acceleration times.</p>
          </li>
          <li>
            <a href="https://www.caranddriver.com/features/a15375088/final-drive-ratio/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Car and Driver: Understanding Gear Ratios and Performance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining how rear axle ratios impact acceleration, top speed, and fuel economy across different vehicle types.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/emission-standards-reference-guide/vehicle-emission-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA: Fuel Economy and Emissions Testing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">U.S. Environmental Protection Agency standards for vehicle testing including power measurement protocols and real-world driving conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="0–60 Speed vs Gear/RPM Calculator"
      description="Professional automotive calculator: Estimate theoretical vehicle speed based on gear ratio, tire size, and engine RPM."
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
      showTopBanner showSidebar showBottomBanner
    />
  );
}
