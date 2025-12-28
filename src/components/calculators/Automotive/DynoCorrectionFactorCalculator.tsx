import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Settings, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DynoCorrectionFactorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    atmosphericPressure: "", // in inHg or kPa
    temperature: "", // in °F or °C
    humidity: "", // in %
    correctionFactorType: "SAE", // SAE or STD
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { unit, atmosphericPressure, temperature, humidity, correctionFactorType } = inputs;

    // Validate inputs
    const patmRaw = parseFloat(atmosphericPressure);
    const tempRaw = parseFloat(temperature);
    const humRaw = parseFloat(humidity);

    if (
      isNaN(patmRaw) || patmRaw <= 0 ||
      isNaN(tempRaw) ||
      isNaN(humRaw) || humRaw < 0 || humRaw > 100
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid inputs for all fields.",
        feedback: "Invalid input"
      };
    }

    // Convert inputs to imperial units for calculation if needed
    let patmInHg = patmRaw;
    let tempF = tempRaw;

    if (unit === "metric") {
      // Convert kPa to inHg
      patmInHg = patmRaw / 3.38639;
      // Convert °C to °F
      tempF = (tempRaw * 9) / 5 + 32;
    }

    // Define standard conditions based on correction factor type
    let Pstd = 29.23; // SAE default inHg
    let Tstd = 77; // SAE default °F

    if (correctionFactorType === "STD") {
      Pstd = 29.92;
      Tstd = 59;
    }

    // Calculate correction factor using SAE formula
    // CF = sqrt( (Pstd / Patm) * ((Tactual + 459.67) / (Tstd + 459.67)) )
    const TactualRankine = tempF + 459.67;
    const TstdRankine = Tstd + 459.67;

    let correctionFactor = Math.sqrt((Pstd / patmInHg) * (TactualRankine / TstdRankine));

    // Apply humidity correction (approximate: 0.1% per 10% humidity)
    const humidityCorrection = 1 - (humRaw * 0.001); 
    correctionFactor *= humidityCorrection;

    // Clamp correction factor to reasonable range
    correctionFactor = Math.min(Math.max(correctionFactor, 0.7), 1.3);

    return {
      primary: correctionFactor.toFixed(3),
      secondary: `Correction Factor (${correctionFactorType})`,
      details: `Based on: ${patmInHg.toFixed(2)} inHg, ${tempF.toFixed(1)}°F, ${humRaw.toFixed(1)}%`,
      feedback: correctionFactor >= 0.95 && correctionFactor <= 1.05 ? "Standard range" : "Adjusted for conditions"
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a Dyno Correction Factor and why is it used?",
      answer: "Engines produce less power in hot, humid, or high-altitude conditions due to lower air density. A correction factor is a mathematical multiplier applied to raw dyno numbers to simulate what the engine *would* have produced under 'standard' atmospheric conditions. This allows for fair comparisons between runs performed on different days or in different locations."
    },
    {
      question: "What is the difference between SAE and STD correction?",
      answer: "SAE (J1349) is the modern industry standard used by manufacturers. It assumes 77°F, 29.23 inHg, and 0% humidity. STD (Standard) uses older, more optimistic conditions: 60°F and 29.92 inHg. STD numbers are typically 2-4% higher than SAE numbers, which is why some shops prefer them for 'marketing' purposes, but SAE is more realistic for modern vehicles."
    },
    {
      question: "Does humidity significantly affect power?",
      answer: "While less critical than temperature or pressure, humidity displaces oxygen in the air, reducing combustion efficiency. High humidity reduces power. Most correction formulas apply a small penalty for humidity to accurately reflect the reduced oxygen content available to the engine."
    },
    {
      question: "Why is 'Uncorrected' power important?",
      answer: "'Uncorrected' is the actual power your engine is making *right now* in the current weather. While corrected numbers are good for comparison, uncorrected numbers are essential for tuning fuel and ignition maps, as the engine needs to be tuned for the actual air it is breathing, not a theoretical standard."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "A tuner is testing a car on a hot summer day in Denver (high altitude). The raw dyno reading is 400 HP. Conditions are: 24.50 inHg Pressure, 95°F Temperature, 20% Humidity.",
    steps: [
      { label: "1. Standard SAE", explanation: "Reference: 29.23 inHg, 77°F." },
      { label: "2. Pressure Ratio", explanation: "29.23 / 24.50 = 1.193 (Air is thin, massive correction needed)." },
      { label: "3. Temp Ratio", explanation: "(95 + 460) / (77 + 460) = 1.033." },
      { label: "4. Calculation", explanation: "CF ≈ 1.21 (Simplified). The engine would make ~21% more power at sea level." }
    ],
    result: "Corrected Power: 400 * 1.21 = 484 HP (SAE)."
  };

  const references = [
    { title: "SAE J1349 Standard", description: "Official engine power test code for net power rating.", url: "https://www.sae.org/" },
    { title: "Dynojet Research", description: "Understanding dyno graphs and environmental correction.", url: "https://www.dynojet.com/" },
    { title: "Hot Rod Magazine", description: "The truth about dyno numbers and correction factors.", url: "https://www.motortrend.com/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (inHg, °F)</SelectItem>
            <SelectItem value="metric">Metric (kPa, °C)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Atmospheric Pressure</Label>
          <Input type="number" value={inputs.atmosphericPressure} onChange={(e) => handleInputChange("atmosphericPressure", e.target.value)} placeholder={inputs.unit === "imperial" ? "29.23" : "99.0"} />
        </div>
        <div className="space-y-2">
          <Label>Ambient Temperature</Label>
          <Input type="number" value={inputs.temperature} onChange={(e) => handleInputChange("temperature", e.target.value)} placeholder={inputs.unit === "imperial" ? "77" : "25"} />
        </div>
        <div className="space-y-2">
          <Label>Relative Humidity (%)</Label>
          <Input type="number" value={inputs.humidity} onChange={(e) => handleInputChange("humidity", e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Correction Standard</Label>
          <Select value={inputs.correctionFactorType} onValueChange={(v) => handleInputChange("correctionFactorType", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAE">SAE J1349 (Modern Standard)</SelectItem>
              <SelectItem value="STD">STD / DIN (Optimistic)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate Factor
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Correction Multiplier</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
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
          <li><strong>Step 1:</strong> Check your local weather or dyno room sensors for Pressure, Temp, and Humidity.</li>
          <li><strong>Step 2:</strong> Select your preferred units (Imperial/Metric).</li>
          <li><strong>Step 3:</strong> Enter the environmental values.</li>
          <li><strong>Step 4:</strong> Select the standard (SAE is recommended for modern comparison).</li>
          <li><strong>Step 5:</strong> Apply the resulting factor to your uncorrected horsepower number (Uncorrected HP * Factor = Corrected HP).</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500"/> Complete Guide to Dyno Correction
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Internal combustion engines are essentially air pumps. Their performance relies heavily on the density of the air they ingest. Cold, dry air at sea level is dense and rich in oxygen, leading to maximum power. Hot, humid air at high altitude is thin, leading to significant power loss.
          </p>
          <p>
            Without correction factors, a car tested in winter would appear to have gained 20+ horsepower compared to the same car tested in summer, even if no modifications were made. This calculator levels the playing field by mathematical normalizing the environment variables to a set standard.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5"/> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. Comparing SAE to STD:</strong> Never compare a dyno sheet using SAE correction to one using STD. STD numbers will almost always be higher, creating a false sense of gain.</p>
          <p><strong>2. Using Absolute Pressure vs Station Pressure:</strong> Ensure you are using the actual station pressure (barometric pressure at your altitude), not the "corrected to sea level" pressure reported by weather apps.</p>
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
      title="Dyno Correction Factor Calculator"
      description="Professional automotive calculator: Calculate SAE and STD correction factors for engine dyno testing."
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
