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
    "Turbocharger / Supercharger": 0.40,
    "Headers": 0.10,
    "High-Flow Fuel Injectors": 0.08,
    "Camshaft Upgrade": 0.12,
    "Intercooler Upgrade": 0.05,
    "Throttle Body Upgrade": 0.04,
    "Nitrous Oxide System": 0.30
  };

  const modLevelMultipliers: Record<string, number> = {
    "Mild": 0.75,
    "Moderate": 1,
    "Aggressive": 1.25
  };

  const results = useMemo(() => {
    const baselinePower = parseFloat(inputs.baselinePower);
    const price = parseFloat(inputs.price);
    const modType = inputs.modType;
    const modLevel = inputs.modLevel || "Moderate";

    if (!baselinePower || baselinePower <= 0 || !modType || !(modType in modPowerGainFactors)) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid baseline power and select a modification type.",
        feedback: "Input required"
      };
    }

    const baseGainFactor = modPowerGainFactors[modType];
    const levelMultiplier = modLevelMultipliers[modLevel] || 1;
    const powerGain = baselinePower * baseGainFactor * levelMultiplier;
    const newPower = baselinePower + powerGain;

    let costPerHp = 0;
    if (price && price > 0) {
      costPerHp = price / powerGain;
    }

    const primary = newPower.toFixed(1) + (inputs.unit === "imperial" ? " hp" : " kW");
    const secondary = price && price > 0 ? `$${price.toFixed(2)} (Cost per hp: $${costPerHp.toFixed(2)})` : "Price not provided";
    const details = `Baseline: ${baselinePower.toFixed(1)}${inputs.unit === "imperial" ? " hp" : " kW"}, Gain: +${powerGain.toFixed(1)}${inputs.unit === "imperial" ? " hp" : " kW"} (${(baseGainFactor * 100 * levelMultiplier).toFixed(1)}%)`;

    let feedback = "Estimated power gain within typical range.";
    if (powerGain / baselinePower > 0.5) feedback = "Significant power gain expected; ensure supporting mods.";
    else if (powerGain / baselinePower < 0.03) feedback = "Minimal power gain expected.";

    return { primary, secondary, details, feedback };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate are these estimates?",
      answer: "These are average gains based on typical results. Actual gains vary by vehicle and installation quality. Use as a guide."
    },
    {
      question: "Can I combine multiple mods?",
      answer: "Yes, but gains aren't always additive. Diminishing returns occur. Consult a tuner for complex builds."
    },
    {
      question: "What is modification level?",
      answer: "It scales the expected gain (e.g. Mild tune vs Aggressive race tune)."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "2015 Subaru WRX (268 hp) adding a Moderate ECU Tune ($800).",
    steps: [
      { label: "Step 1", explanation: "Baseline: 268 hp" },
      { label: "Step 2", explanation: "Mod: ECU Tune (15% gain)" },
      { label: "Step 3", explanation: "Gain: 268 * 0.15 = 40.2 hp" },
      { label: "Step 4", explanation: "New Power: 308.2 hp" }
    ],
    result: "New Power: 308.2 hp (+40.2 hp). Cost Efficiency: ~$20/hp."
  };

  const references = [
    { title: "EPA Fuel Economy Guide", description: "Official efficiency data." },
    { title: "Dynojet Research", description: "Performance measurement standards." }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (hp)</SelectItem>
            <SelectItem value="metric">Metric (kW)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Baseline Power</Label>
          <Input type="number" value={inputs.baselinePower} onChange={(e) => handleInputChange("baselinePower", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Modification Type</Label>
          <Select value={inputs.modType} onValueChange={(v) => handleInputChange("modType", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              {Object.keys(modPowerGainFactors).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Modification Level</Label>
          <Select value={inputs.modLevel} onValueChange={(v) => handleInputChange("modLevel", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              {Object.keys(modLevelMultipliers).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cost ($)</Label>
          <Input type="number" value={inputs.price} onChange={(e) => handleInputChange("price", e.target.value)} />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-2 font-medium text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Complete Guide</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>Estimating power gains helps prioritize upgrades. This tool uses industry averages for common mods.</p>
        </div>
      </section>
      <section id="mistakes" className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-lg mb-3">Common Mistakes</h3>
        <p>Adding percentages blindly often overestimates results. Gains are rarely purely additive.</p>
      </section>
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-5">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="references">
        <h2 className="text-2xl font-bold mb-4">References & additional resources</h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <p className="font-semibold">{ref.title}</p>
              <p className="text-sm">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Power Gains from Modifications Estimator"
      description="Professional automotive calculator: Power Gains from Modifications Estimator."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "mistakes", label: "Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
