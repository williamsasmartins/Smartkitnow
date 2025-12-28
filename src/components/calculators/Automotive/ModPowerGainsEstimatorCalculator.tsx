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
      question: "Are these horsepower gains guaranteed?",
      answer: "No, these estimates are based on industry averages for typical vehicles. The actual gain depends on your specific engine's condition, the quality of the part, the accuracy of the installation, and environmental factors. For example, a turbocharged car often gains more from an ECU tune than a naturally aspirated one."
    },
    {
      question: "Why does modification level matter?",
      answer: "Parts come in different 'aggressiveness' levels. A 'Mild' street cam offers smooth idle but less power, while an 'Aggressive' race cam offers massive top-end power but poor low-end torque. This calculator scales the potential gain based on the level you select to reflect these trade-offs."
    },
    {
      question: "Can I simply add up gains from multiple mods?",
      answer: "Generally, no. Power gains are rarely purely additive. For instance, if an intake adds 10hp and an exhaust adds 10hp, installing both might only yield 15-18hp total because the factory ECU might not compensate, or one part might still be a bottleneck. Diminishing returns are common without professional tuning."
    },
    {
      question: "Does this calculator account for tuning?",
      answer: "The 'Performance ECU Tune' option accounts for tuning gains directly. For other mechanical parts (like headers or cams), the estimates assume the car is running optimally. In reality, most mechanical upgrades require a supporting ECU tune to realize their full potential and run safely."
    },
    {
      question: "What is 'Cost per HP' and why is it useful?",
      answer: "Cost per Horsepower is a metric used to evaluate the value of a modification. It tells you how much money you are spending for every single unit of power gained. Lower is better. Nitrous kits often have excellent cost/hp, while naturally aspirated engine builds can have very high cost/hp."
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
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li><strong>Step 1:</strong> Enter your car's stock power (Baseline).</li>
          <li><strong>Step 2:</strong> Choose the modification you plan to add.</li>
          <li><strong>Step 3:</strong> Select the aggressiveness level.</li>
          <li><strong>Step 4:</strong> (Optional) Enter the cost to check value for money.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Modification Gains
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Modifying a vehicle is an exciting journey to unlock potential performance hidden by the factory. Manufacturers often detune engines for fuel economy, noise regulations, or longevity. Aftermarket parts aim to optimize airflow, fueling, and spark timing to recover this power.
          </p>
          <p>
            However, expecting massive gains from simple bolt-ons can lead to disappointment. A cold air intake alone might add only 5-10 hp on a modern, efficient engine. Real power usually comes from a combination of parts (system) and, crucially, the <strong>Engine Control Unit (ECU) tuning</strong> to tell the engine how to use that extra air and fuel.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5"/> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. "Stacking" Gains:</strong> If an intake claims +10hp and exhaust +10hp, installing both rarely equals +20hp. They share the same airflow system limitations.</p>
          <p><strong>2. Ignoring Tune:</strong> Installing high-flow parts without re-tuning the ECU can actually cause the car to run lean and <em>lose</em> power or damage the engine.</p>
        </div>
      </section>

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

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500"/> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a href={ref.url} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                {ref.title} <ExternalLink className="w-3 h-3"/>
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
