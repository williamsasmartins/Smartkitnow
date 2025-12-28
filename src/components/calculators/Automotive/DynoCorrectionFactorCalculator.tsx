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

export default function DynoCorrectionFactorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    atmosphericPressure: "",
    temperature: "",
    humidity: "",
    correctionFactorType: "SAE",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { unit, atmosphericPressure, temperature, humidity, correctionFactorType } = inputs;
    const patmRaw = parseFloat(atmosphericPressure);
    const tempRaw = parseFloat(temperature);
    const humRaw = parseFloat(humidity);

    if (isNaN(patmRaw) || patmRaw <= 0 || isNaN(tempRaw) || isNaN(humRaw) || humRaw < 0 || humRaw > 100) {
      return { primary: "N/A", secondary: "", details: "Please enter valid inputs.", feedback: "Invalid input" };
    }

    let patmInHg = patmRaw;
    let tempF = tempRaw;

    if (unit === "metric") {
      patmInHg = patmRaw / 3.38639;
      tempF = (tempRaw * 9) / 5 + 32;
    }

    let Pstd = 29.23;
    let Tstd = 77;

    if (correctionFactorType === "STD") {
      Pstd = 29.92;
      Tstd = 59;
    }

    const TactualRankine = tempF + 459.67;
    const TstdRankine = Tstd + 459.67;

    let correctionFactor = Math.sqrt((Pstd / patmInHg) * (TactualRankine / TstdRankine));
    const humidityCorrection = 1 - (humRaw * 0.001);
    correctionFactor *= humidityCorrection;
    correctionFactor = Math.min(Math.max(correctionFactor, 0.7), 1.3);

    return {
      primary: correctionFactor.toFixed(3),
      secondary: `Correction Factor (${correctionFactorType})`,
      details: `Based on: ${patmInHg.toFixed(2)} inHg, ${tempF.toFixed(1)}°F, ${humRaw.toFixed(1)}%`,
      feedback: correctionFactor >= 0.95 && correctionFactor <= 1.05 ? "Standard range" : "Adjusted for conditions"
    };
  }, [inputs]);

  const faqs = [
    { question: "What is a dyno correction factor?", answer: "A multiplier to adjust power readings to standard atmospheric conditions." },
    { question: "SAE vs STD?", answer: "SAE is modern standard (J1349). STD is older and often shows higher numbers." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "Testing on a hot day: 28.50 inHg, 95°F, 40% Humidity.",
    steps: [
      { label: "Step 1", explanation: "Standard SAE: 29.23 inHg, 77°F" },
      { label: "Step 2", explanation: "Temp Ratio: (95+460)/(77+460) = 1.03" },
      { label: "Step 3", explanation: "Pressure Ratio: 29.23/28.50 = 1.025" },
      { label: "Step 4", explanation: "Result: CF = 0.987" }
    ],
    result: "Correction Factor: 0.987"
  };

  const references = [
    { title: "SAE J1349 Standard", description: "Official power test code." }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pressure</Label>
          <Input type="number" value={inputs.atmosphericPressure} onChange={(e) => handleInputChange("atmosphericPressure", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Temperature</Label>
          <Input type="number" value={inputs.temperature} onChange={(e) => handleInputChange("temperature", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Humidity (%)</Label>
          <Input type="number" value={inputs.humidity} onChange={(e) => handleInputChange("humidity", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Standard</Label>
          <Select value={inputs.correctionFactorType} onValueChange={(v) => handleInputChange("correctionFactorType", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAE">SAE J1349</SelectItem>
              <SelectItem value="STD">STD (DIN)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
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
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Complete Guide</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>Dyno correction factors allow for fair comparisons between runs done in different weather conditions.</p>
        </div>
      </section>
      <section id="mistakes" className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-lg mb-3">Common Mistakes</h3>
        <p>Mixing SAE and STD numbers is the most common error. STD reads higher but is less realistic.</p>
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
        <h2 className="text-2xl font-bold mb-4">References</h2>
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
      title="Dyno Correction Factor Calculator"
      description="Professional automotive calculator: Dyno Correction Factor Calculator."
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
