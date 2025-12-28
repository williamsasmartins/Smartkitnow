import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings, BookOpen, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// NOME DA FUNÇÃO CORRIGIDO (Não pode começar com número)
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
      details: `At ${rpm} RPM in selected gear`,
      feedback: "Calculated theoretical speed"
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does gear ratio affect speed?",
      answer: "A lower numerical gear ratio (taller gear) results in higher potential speed at the same RPM, while a higher ratio (shorter gear) increases acceleration but lowers top speed in that gear."
    },
    {
      question: "Why does tire size matter?",
      answer: "Larger diameter tires cover more ground per revolution. Increasing tire size will increase actual vehicle speed at a given RPM, though it may make the speedometer read lower than actual speed."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "Calculating speed in 4th gear (1.1 ratio) at 3000 RPM with 25-inch tires.",
    steps: [
      { label: "1. Formula", explanation: "Speed = (3000 * 25 * 3.1416) / (1.1 * 1056)" },
      { label: "2. Numerator", explanation: "235,620" },
      { label: "3. Denominator", explanation: "1,161.6" },
      { label: "4. Result", explanation: "202.8 mph (Theoretical)" }
    ],
    result: "202.8 mph"
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (in/mph)</SelectItem>
            <SelectItem value="metric">Metric (mm/km/h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Gear Ratio</Label>
          <Input type="number" value={inputs.gearRatio} onChange={(e) => handleInputChange("gearRatio", e.target.value)} placeholder="e.g. 3.55" />
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate Speed
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Speed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary} {results.secondary}
            </div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Guide
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>This calculator determines the theoretical speed of a vehicle based on mechanical ratios. It does not account for wind resistance, friction, or power limitations.</p>
        </div>
      </section>
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300">Using rim diameter instead of tire diameter. You must use the full height of the tire.</p>
      </section>
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 pb-5">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="0–60 Speed vs Gear/RPM"
      description="Calculate theoretical vehicle speed based on gear ratio, tire size, and engine RPM."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[{ id: "guide", label: "Guide" }, { id: "faq", label: "FAQ" }]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
