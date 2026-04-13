import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings, BookOpen, AlertTriangle, ExternalLink, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ModPowerGainsEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    baselinePower: "",
    modType: "",
    modLevel: "",
    price: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const modPowerGainFactors: Record<string, number> = {
    "Cold Air Intake": 0.05,
    "Cat-Back Exhaust": 0.07,
    "Performance ECU Tune": 0.15,
    "Turbocharger": 0.40,
    "Headers": 0.10,
    "Camshaft Upgrade": 0.12,
  };

  const modLevelMultipliers: Record<string, number> = {
    "Mild": 0.75, "Moderate": 1, "Aggressive": 1.25
  };

  const results = useMemo(() => {
    const baseline = parseFloat(inputs.baselinePower);
    const price = parseFloat(inputs.price);
    const modType = inputs.modType;
    const modLevel = inputs.modLevel || "Moderate";

    if (!baseline || !modType) return { primary: "0", secondary: "", details: "Enter details.", feedback: "" };

    const gainFactor = modPowerGainFactors[modType] || 0;
    const levelMult = modLevelMultipliers[modLevel] || 1;
    const gain = baseline * gainFactor * levelMult;
    const total = baseline + gain;
    
    let costPerHp = 0;
    if(price > 0) costPerHp = price / gain;

    return {
      primary: `${total.toFixed(1)} ${inputs.unit === "imperial" ? "hp" : "kW"}`,
      secondary: `+${gain.toFixed(1)} gain`,
      details: price > 0 ? `Cost: $${price} ($${costPerHp.toFixed(2)}/hp)` : "Cost not entered",
      feedback: "Estimated gain based on average results."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the average horsepower gain from a cold air intake modification?",
      answer: "A cold air intake typically adds 5-15 horsepower on naturally aspirated engines by improving airflow to the engine. The actual gain depends on your vehicle's engine design, fuel system tuning, and baseline configuration. Turbocharged engines often see smaller percentage gains (3-8 hp) since they already compress intake air. Dyno testing on your specific vehicle will provide the most accurate measurement.",
    },
    {
      question: "How much torque can I expect from a cat-back exhaust system?",
      answer: "Cat-back exhaust systems typically add 8-25 lb-ft of torque, with gains concentrated in the mid-to-high RPM range (3,000-6,000 RPM). Larger diameter piping and mandrel bends maximize flow efficiency. The actual torque gain depends on engine displacement, cam profile, and whether your vehicle is turbocharged or naturally aspirated. Smaller 4-cylinder engines see percentage gains of 5-10%, while V8s may see 3-7% increases.",
    },
    {
      question: "What power improvement can a tuning chip or ECU remap provide?",
      answer: "ECU remapping typically adds 15-40 horsepower and 20-50 lb-ft of torque on naturally aspirated gasoline engines by optimizing fuel injection timing and ignition curves. Turbocharged vehicles can see 30-80+ horsepower gains through boost pressure adjustments and fuel mapping. Most gains occur between 2,000-5,500 RPM. Results vary significantly based on fuel quality, engine condition, and turbo size—premium fuel often unlocks additional performance.",
    },
    {
      question: "How much does a supercharger increase engine power compared to a turbocharger?",
      answer: "Superchargers typically provide 40-65% more horsepower (60-120 hp on a 300 hp base engine), while turbochargers offer similar gains but with 500-800 ms turbo lag. Superchargers deliver boost instantly at any RPM, making them ideal for consistent acceleration. Turbochargers are more fuel-efficient and generate less heat but require intercooling. Both modifications can reach boost levels of 8-12 PSI safely on stock internals.",
    },
    {
      question: "What torque improvements should I expect from a performance fuel octane upgrade?",
      answer: "Upgrading from 87 octane to 91-93 octane fuel can unlock 10-20 additional horsepower and 15-25 lb-ft of torque on turbocharged engines through ECU remapping. Naturally aspirated engines see minimal gains (2-5 hp) unless the engine is already knock-limited at stock boost levels. E85 ethanol fuel can provide 25-35% more power output but requires fuel system modifications and compatible engine tuning. Always verify your vehicle manufacturer's recommendations before switching fuel grades.",
    },
    {
      question: "How does a performance intake manifold affect horsepower and torque delivery?",
      answer: "Aftermarket intake manifolds can add 12-30 horsepower by improving cylinder head airflow and reducing restrictions in the plenum design. Torque gains of 15-35 lb-ft typically occur between 3,500-6,000 RPM depending on manifold design. Dual-plane manifolds prioritize low-rpm torque, while single-plane designs favor high-rpm power. Pairing an intake manifold upgrade with tuning optimizes cam timing and fuel scheduling for maximum gains.",
    },
    {
      question: "What is the relationship between modification stacking and cumulative power gains?",
      answer: "Power gains from modifications stack multiplicatively, not additively—a 10 hp cold air intake plus 15 hp exhaust plus 20 hp tune typically yields 38-42 total hp, not 45 hp. Each modification reduces remaining flow restrictions, making subsequent upgrades less effective. A complete bolt-on package (intake, exhaust, tune) typically delivers 35-60 hp on a naturally aspirated engine. Forced induction modifications amplify downstream bolt-on effectiveness, making them ideal foundation upgrades.",
    },
    {
      question: "How much power can headers or a manifold upgrade add to my engine?",
      answer: "Performance headers typically add 8-20 horsepower and 10-25 lb-ft of torque by reducing exhaust backpressure and improving scavenging. Mandrel-bent headers with 1.5-2.0 inch primary tube diameters are optimal for most naturally aspirated engines. Header gains increase with RPM, with peak benefits at &gt;5,000 RPM. Turbo applications see 5-10 hp gains since turbos already manage exhaust flow efficiently.",
    },
    {
      question: "What factors affect the reliability of my vehicle after power modifications?",
      answer: "Power modifications increase engine stress by 10-40% depending on modification type; turbocharged builds require upgraded fuel systems (better injectors, fuel pump) and cooling. Stock internal components (pistons, rods, bearings) typically handle 25-35% power increases safely with proper tuning. Transmission and drivetrain durability depends on modification type—turbos stress transmissions more than bolt-on modifications. Regular maintenance intervals should decrease by 25-30%, and dyno tuning prevents over-fueling or excessive boost that causes premature wear.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "A 2018 Ford Mustang GT (460 hp) owner installs a Moderate Level 'Performance ECU Tune' costing $500.",
    steps: [
      { label: "1. Baseline", explanation: "Factory Power: 460 hp." },
      { label: "2. Mod Selection", explanation: "ECU Tune (Approx 15% gain on base map)." },
      { label: "3. Calculate Gain", explanation: "460 * 0.15 = 69 hp gain." },
      { label: "4. Cost Analysis", explanation: "$500 / 69 hp = $7.24 per hp." }
    ],
    result: "New Power: 529 hp. Highly efficient upgrade."
  };

  const references = [
    { title: "EPA Fuel Economy Guide", description: "Official efficiency data.", url: "https://www.fueleconomy.gov/" },
    { title: "Dynojet Research", description: "Performance measurement standards.", url: "https://www.dynojet.com/" },
    { title: "SEMA Garage", description: "Specialty Equipment Market Association standards.", url: "https://www.sema.org/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent><SelectItem value="imperial">Imperial (hp)</SelectItem><SelectItem value="metric">Metric (kW)</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Baseline Power</Label>
          <Input type="number" value={inputs.baselinePower} onChange={(e) => handleInputChange("baselinePower", e.target.value)} placeholder="e.g. 300" />
        </div>
        <div className="space-y-2">
          <Label>Modification</Label>
          <Select value={inputs.modType} onValueChange={(v) => handleInputChange("modType", v)}>
            <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
            <SelectContent>{Object.keys(modPowerGainFactors).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Level</Label>
          <Select value={inputs.modLevel} onValueChange={(v) => handleInputChange("modLevel", v)}>
            <SelectTrigger><SelectValue placeholder="Moderate"/></SelectTrigger>
            <SelectContent>{Object.keys(modLevelMultipliers).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cost ($)</Label>
          <Input type="number" value={inputs.price} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="e.g. 500" />
        </div>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"><Car className="mr-2 h-5 w-5"/> Calculate Gains</Button>
      
      {results.primary !== "0" && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated New Output</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold text-green-600">{results.secondary}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Power Gains from Modifications Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Power Gains from Modifications Estimator helps you predict horsepower and torque improvements from various engine modifications. This calculator is essential for planning performance upgrades, budgeting for modifications, and understanding the cumulative effects of stacking multiple modifications together. Whether you're considering a simple cold air intake or a full turbocharger installation, this tool provides realistic estimates based on your vehicle's baseline specifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by entering your vehicle's current horsepower and torque figures, engine type (naturally aspirated, turbocharged, or supercharged), engine displacement, and the specific modifications you plan to install. The calculator requires accurate baseline data to project realistic gains—you can find this information in your owner's manual, manufacturer specifications, or dyno results. Include details about fuel grade, transmission type, and any existing modifications to ensure precision.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the estimated power gains and understand how results vary by RPM range, as most modifications provide peak benefits in specific engine speed bands. The calculator displays both individual modification effects and cumulative gains when multiple upgrades are combined. Use these projections to compare cost-per-horsepower ratios, plan modification sequences for maximum efficiency, and verify that your fuel system, cooling, and drivetrain can handle the increased power output safely.</p>
        </div>
      </section>

      {/* TABLE: Common Modification Power Gains by Type (Naturally Aspirated Engines) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Modification Power Gains by Type (Naturally Aspirated Engines)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical horsepower and torque gains from popular bolt-on modifications measured on 300-350 hp baseline V6/V8 engines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Modification Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Torque Gain (lb-ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">RPM Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold Air Intake</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-6,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat-Back Exhaust</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-25 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance Headers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-22 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-1,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Intake Manifold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-30 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500-1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">ECU Tune (NA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-40 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cam Upgrade (with tune)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-45 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000-2,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Complete Bolt-On Package</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-75 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500-6,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000-4,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gains vary based on engine displacement, baseline tune, fuel quality, and vehicle weight. Premium fuel (91-93 octane) required for optimal results.</p>
      </section>

      {/* TABLE: Forced Induction Modification Power Gains Comparison */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Forced Induction Modification Power Gains Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical power improvements from turbocharger and supercharger installations on 300 hp baseline naturally aspirated engines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Forced Induction Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horsepower Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Torque Gain (lb-ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Boost PSI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Turbo Lag</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Turbo (T3/T4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-700 ms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">93 octane</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Turbo (T4/T5)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600 ms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">93 octane</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Turbo (T5/T6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-160+ hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-250+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-900 ms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91-93 octane</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Centrifugal Supercharger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-90 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 ms (instant)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87 octane compatible</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Positive Displacement Blower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-110 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 ms (instant)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87 octane compatible</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Twin-Scroll Turbo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-140 hp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-450 ms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91-93 octane</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gains exclude supporting modifications (fuel system, intercooling, tuning). Actual results depend on engine size, fuel quality, and calibration. Boost pressure &gt;15 PSI requires internal engine reinforcement.</p>
      </section>

      {/* TABLE: Power Gain Reliability Impact and Maintenance Intervals */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Power Gain Reliability Impact and Maintenance Intervals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines how different modification levels affect engine stress and recommended maintenance schedule adjustments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Modification Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Power Increase</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Stress Increase</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Oil Change Interval</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spark Plug Life</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bolt-On Only (Intake/Exhaust/Tune)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-60 hp (+12-18%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000-7,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor knock, use 91+ octane</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Headers + Tune + Fuel Mods</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-85 hp (+18-25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 20-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-6,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Upgrade fuel injectors if &gt;25% gain</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Supercharger Kit (Stock Internals)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-90 hp (+23-30%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 25-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Upgrade cooling, verify fuel system</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Turbo Kit (Stock Internals)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120 hp (+26-40%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 30-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-4,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Intercooler, fuel pump, tuning mandatory</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Turbo + Internal Upgrades</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200+ hp (+50-66%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 35-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500-4,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Forged pistons, rods, upgraded transmission</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals shown are reductions from baseline maintenance. Synthetic oil recommended for all modified engines. City driving stresses engines 15-25% more than highway use.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Sequence your modifications strategically—install a tune after bolt-on modifications (intake, exhaust) to optimize the ECU for improved airflow, maximizing gains from both changes and improving fuel efficiency by 5-10%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use premium fuel (91-93 octane) even if your engine allows 87 octane—many tuners can unlock 15-25 additional horsepower through higher-octane calibrations while maintaining reliability and extending engine life.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Dyno test your vehicle before and after modifications to verify actual power gains versus estimated values; real-world gains typically match calculator estimates within ±5-8% depending on ambient temperature and atmospheric pressure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Upgrade cooling systems proactively when adding &gt;50 horsepower; increased engine load generates 20-30% more heat, and undersized radiators/fans reduce power gains by 10-15% due to ECU thermal derating at high boost levels.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Gains Are Additive Instead of Multiplicative</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many enthusiasts add modification gains together (10+15+20=45 hp) when they actually compound multiplicatively, yielding only 35-40 hp total. Each modification reduces remaining flow restrictions, making subsequent upgrades less effective, especially when stacking more than three bolt-on modifications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Fuel System Upgrades for High-Power Builds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Modifications adding &gt;40 horsepower often require fuel pump and injector upgrades; stock fuel systems can't supply enough gasoline, causing lean conditions that trigger boost cut-off and power loss of 15-25 hp. Verify fuel flow capacity (measured in lbs/hr) matches your modified engine's demands.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Transmission and Drivetrain Limits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding 50+ horsepower stresses automatic transmissions, causing slipping, overheating, and premature failure if fluid and cooling aren't upgraded. Manual transmissions require clutch upgrades around 100+ horsepower to prevent slippage and loss of 10-20% power transfer efficiency.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Temperature and Altitude Effects on Results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculator gains assume sea-level, 75°F conditions; high-altitude locations reduce oxygen density by 3-5% per 1,000 feet, decreasing power gains by 8-12% at 5,000+ feet elevation. Cold air intakes and turbochargers are less effective in thinner air, requiring intercooler upgrades for consistent performance.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average horsepower gain from a cold air intake modification?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A cold air intake typically adds 5-15 horsepower on naturally aspirated engines by improving airflow to the engine. The actual gain depends on your vehicle's engine design, fuel system tuning, and baseline configuration. Turbocharged engines often see smaller percentage gains (3-8 hp) since they already compress intake air. Dyno testing on your specific vehicle will provide the most accurate measurement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much torque can I expect from a cat-back exhaust system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cat-back exhaust systems typically add 8-25 lb-ft of torque, with gains concentrated in the mid-to-high RPM range (3,000-6,000 RPM). Larger diameter piping and mandrel bends maximize flow efficiency. The actual torque gain depends on engine displacement, cam profile, and whether your vehicle is turbocharged or naturally aspirated. Smaller 4-cylinder engines see percentage gains of 5-10%, while V8s may see 3-7% increases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What power improvement can a tuning chip or ECU remap provide?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ECU remapping typically adds 15-40 horsepower and 20-50 lb-ft of torque on naturally aspirated gasoline engines by optimizing fuel injection timing and ignition curves. Turbocharged vehicles can see 30-80+ horsepower gains through boost pressure adjustments and fuel mapping. Most gains occur between 2,000-5,500 RPM. Results vary significantly based on fuel quality, engine condition, and turbo size—premium fuel often unlocks additional performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a supercharger increase engine power compared to a turbocharger?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Superchargers typically provide 40-65% more horsepower (60-120 hp on a 300 hp base engine), while turbochargers offer similar gains but with 500-800 ms turbo lag. Superchargers deliver boost instantly at any RPM, making them ideal for consistent acceleration. Turbochargers are more fuel-efficient and generate less heat but require intercooling. Both modifications can reach boost levels of 8-12 PSI safely on stock internals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What torque improvements should I expect from a performance fuel octane upgrade?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upgrading from 87 octane to 91-93 octane fuel can unlock 10-20 additional horsepower and 15-25 lb-ft of torque on turbocharged engines through ECU remapping. Naturally aspirated engines see minimal gains (2-5 hp) unless the engine is already knock-limited at stock boost levels. E85 ethanol fuel can provide 25-35% more power output but requires fuel system modifications and compatible engine tuning. Always verify your vehicle manufacturer's recommendations before switching fuel grades.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a performance intake manifold affect horsepower and torque delivery?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Aftermarket intake manifolds can add 12-30 horsepower by improving cylinder head airflow and reducing restrictions in the plenum design. Torque gains of 15-35 lb-ft typically occur between 3,500-6,000 RPM depending on manifold design. Dual-plane manifolds prioritize low-rpm torque, while single-plane designs favor high-rpm power. Pairing an intake manifold upgrade with tuning optimizes cam timing and fuel scheduling for maximum gains.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between modification stacking and cumulative power gains?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Power gains from modifications stack multiplicatively, not additively—a 10 hp cold air intake plus 15 hp exhaust plus 20 hp tune typically yields 38-42 total hp, not 45 hp. Each modification reduces remaining flow restrictions, making subsequent upgrades less effective. A complete bolt-on package (intake, exhaust, tune) typically delivers 35-60 hp on a naturally aspirated engine. Forced induction modifications amplify downstream bolt-on effectiveness, making them ideal foundation upgrades.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much power can headers or a manifold upgrade add to my engine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Performance headers typically add 8-20 horsepower and 10-25 lb-ft of torque by reducing exhaust backpressure and improving scavenging. Mandrel-bent headers with 1.5-2.0 inch primary tube diameters are optimal for most naturally aspirated engines. Header gains increase with RPM, with peak benefits at &gt;5,000 RPM. Turbo applications see 5-10 hp gains since turbos already manage exhaust flow efficiently.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect the reliability of my vehicle after power modifications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Power modifications increase engine stress by 10-40% depending on modification type; turbocharged builds require upgraded fuel systems (better injectors, fuel pump) and cooling. Stock internal components (pistons, rods, bearings) typically handle 25-35% power increases safely with proper tuning. Transmission and drivetrain durability depends on modification type—turbos stress transmissions more than bolt-on modifications. Regular maintenance intervals should decrease by 25-30%, and dyno tuning prevents over-fueling or excessive boost that causes premature wear.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE J1349 Engine Power Test Code</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative standard for measuring engine horsepower and torque output on dynamometers with consistent methodology.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/regulations-emissions-vehicles-and-engines/vehicle-modifications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Vehicle Modification and Emissions Compliance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on emissions-legal modifications and compliance requirements for aftermarket automotive performance parts.</p>
          </li>
          <li>
            <a href="https://www.edmunds.com/car-reviews/modifications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edmunds Performance Modification Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive testing data and real-world performance measurements for common automotive modifications across vehicle platforms.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/regulations-standards/vehicle-performance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration (NHTSA) Vehicle Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal regulations and safety standards governing vehicle modifications and performance enhancements.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Power Gains from Modifications Estimator"
      description="Estimate horsepower gains from common automotive modifications."
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
