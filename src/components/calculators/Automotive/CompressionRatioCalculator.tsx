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

export default function CompressionRatioCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    clearanceVolume: "", // Clearance volume (cc or cubic inches)
    sweptVolume: "", // Swept volume (cc or cubic inches)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const clearanceVol = parseFloat(inputs.clearanceVolume);
    const sweptVol = parseFloat(inputs.sweptVolume);

    if (
      isNaN(clearanceVol) ||
      isNaN(sweptVol) ||
      clearanceVol <= 0 ||
      sweptVol <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid positive numbers for volumes.",
        feedback: "Invalid input"
      };
    }

    // Compression Ratio = (Swept Volume + Clearance Volume) / Clearance Volume
    const compressionRatio = (sweptVol + clearanceVol) / clearanceVol;

    // Feedback based on typical compression ratio ranges
    let feedback = "";
    if (compressionRatio < 7) {
      feedback = "Very low compression ratio - typical for old or diesel engines.";
    } else if (compressionRatio >= 7 && compressionRatio < 9) {
      feedback = "Low compression ratio - common in older gasoline engines.";
    } else if (compressionRatio >= 9 && compressionRatio < 11) {
      feedback = "Standard compression ratio - typical for modern gasoline engines.";
    } else if (compressionRatio >= 11 && compressionRatio < 13) {
      feedback = "High compression ratio - performance or efficiency oriented engines.";
    } else {
      feedback = "Very high compression ratio - often found in racing or specialized engines.";
    }

    return {
      primary: compressionRatio.toFixed(2) + ":1",
      secondary: "",
      details: `Calculated Compression Ratio = (Swept Volume + Clearance Volume) / Clearance Volume = (${sweptVol.toFixed(2)} + ${clearanceVol.toFixed(2)}) / ${clearanceVol.toFixed(2)} = ${compressionRatio.toFixed(2)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is compression ratio in an engine?",
      answer:
        "Compression ratio is the ratio of the total volume of the cylinder when the piston is at the bottom of its stroke (bottom dead center) to the volume when the piston is at the top of its stroke (top dead center). It is a key factor in engine efficiency and performance, affecting power output, fuel consumption, and emissions."
    },
    {
      question: "How do I measure clearance and swept volume?",
      answer:
        "Clearance volume is the volume of the combustion chamber when the piston is at top dead center, including the space above the piston head. Swept volume is the volume displaced by the piston as it moves from top dead center to bottom dead center. These can be measured in cubic centimeters (cc) or cubic inches, often using engine specs or physical measurements."
    },
    {
      question: "Why is compression ratio important?",
      answer:
        "Compression ratio influences the thermal efficiency of an engine. Higher compression ratios generally improve efficiency and power but require higher octane fuel to avoid knocking. Lower compression ratios are safer for lower quality fuels but sacrifice some efficiency."
    },
    {
      question: "Can I use this calculator for diesel engines?",
      answer:
        "Yes, this calculator can be used for diesel engines as well. Diesel engines typically have higher compression ratios than gasoline engines, often ranging from 14:1 to 22:1, due to their different combustion process."
    },
    {
      question: "What units should I use for volume inputs?",
      answer:
        "You can use either cubic centimeters (cc) or cubic inches depending on your preference or the engine specifications you have. Just ensure both clearance volume and swept volume are in the same units for accurate calculation."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the compression ratio of a 2.0L inline-4 gasoline engine with a clearance volume of 50 cc and a swept volume of 500 cc per cylinder.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the clearance volume (Vc) and swept volume (Vs) for one cylinder. Here, Vc = 50 cc and Vs = 500 cc."
      },
      {
        label: "Step 2",
        explanation:
          "Apply the compression ratio formula: CR = (Vs + Vc) / Vc = (500 + 50) / 50 = 550 / 50 = 11."
      },
      {
        label: "Step 3",
        explanation:
          "The compression ratio is 11:1, which is typical for a modern performance gasoline engine."
      }
    ],
    result: "Final Result: Compression Ratio = 11:1"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "HowStuffWorks: Compression Ratio",
      description:
        "An easy-to-understand explanation of compression ratio and its impact on engine performance.",
      url: "https://auto.howstuffworks.com/engine.htm"
    },
    {
      title: "Engineering Explained: Compression Ratio",
      description:
        "Detailed video and articles explaining compression ratio and its effects on engines.",
      url: "https://www.engineeringexplained.com/compression-ratio"
    },
    {
      title: "SAE International - Engine Fundamentals",
      description:
        "Technical papers and resources on engine design and compression ratios.",
      url: "https://www.sae.org/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => setInputs(prev => ({ ...prev, unit: v }))}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (cubic inches)</SelectItem>
            <SelectItem value="metric">Metric (cc)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Clearance Volume ({inputs.unit === "metric" ? "cc" : "cubic inches"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.clearanceVolume}
            onChange={(e) => handleInputChange("clearanceVolume", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Swept Volume ({inputs.unit === "metric" ? "cc" : "cubic inches"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 500"
            value={inputs.sweptVolume}
            onChange={(e) => handleInputChange("sweptVolume", e.target.value)}
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
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Metric in cc or Imperial in cubic inches) using the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the clearance volume of the combustion chamber (the volume above the piston at top dead center) in the selected units.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the swept volume (displacement volume) of the cylinder, which is the volume displaced by the piston moving from top to bottom dead center.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute the compression ratio.
          </li>
          <li>
            <strong>Step 5:</strong> Review the calculated compression ratio and the feedback provided to understand the engine's compression characteristics.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Compression Ratio Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The compression ratio of an internal combustion engine is a fundamental parameter that significantly influences engine performance, fuel efficiency, and emissions. It is defined as the ratio between the total volume of the cylinder when the piston is at the bottom of its stroke (bottom dead center) and the volume when the piston is at the top of its stroke (top dead center). This ratio determines how much the air-fuel mixture is compressed before ignition.
          </p>
          <p>
            To calculate the compression ratio, you need two key volumes: the clearance volume and the swept volume. The clearance volume is the space remaining in the cylinder above the piston when it is at the top of its stroke. This includes the combustion chamber and any space in the cylinder head. The swept volume, also known as displacement volume, is the volume displaced by the piston as it moves from top dead center to bottom dead center. It is calculated based on the bore and stroke of the cylinder.
          </p>
          <p>
            The formula for compression ratio is: <em>Compression Ratio = (Swept Volume + Clearance Volume) / Clearance Volume</em>. This means the total volume when the piston is at bottom dead center divided by the clearance volume. Engines with higher compression ratios generally achieve better thermal efficiency and power output but require higher octane fuel to prevent knocking. Conversely, lower compression ratios are safer for lower quality fuels but may sacrifice some efficiency.
          </p>
          <p>
            This calculator allows you to input the clearance and swept volumes in either metric (cubic centimeters) or imperial (cubic inches) units. It then computes the compression ratio and provides feedback on typical ranges found in various engine types, from older low-compression engines to modern high-performance engines. Understanding your engine's compression ratio can help in tuning, maintenance, and selecting the appropriate fuel.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Mixing units:</strong> Entering clearance volume and swept volume in different units (e.g., clearance in cc and swept volume in cubic inches) will produce incorrect results. Always use the same unit system for both inputs.
          </p>
          <p>
            <strong>2. Using zero or negative values:</strong> Clearance and swept volumes must be positive numbers. Zero or negative inputs are invalid and will not yield meaningful compression ratios.
          </p>
          <p>
            <strong>3. Misunderstanding clearance volume:</strong> Clearance volume is often confused with combustion chamber volume only. It includes all space above the piston at top dead center, including gasket thickness and piston dome volume if applicable.
          </p>
          <p>
            <strong>4. Forgetting to convert units:</strong> If you have measurements in different units (e.g., cc and liters), convert them properly before inputting to avoid calculation errors.
          </p>
          <p>
            <strong>5. Ignoring engine modifications:</strong> Changes like aftermarket pistons or cylinder heads can alter clearance volume, so always use updated measurements for accurate compression ratio calculations.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
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

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
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
      title="Compression Ratio Calculator"
      description="Professional automotive calculator: Compression Ratio Calculator. Get accurate estimates, expert advice, and financial insights."
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