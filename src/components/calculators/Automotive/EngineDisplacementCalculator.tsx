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

export default function EngineDisplacementCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    bore: "",
    stroke: "",
    cylinders: ""
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const bore = parseFloat(inputs.bore);
    const stroke = parseFloat(inputs.stroke);
    const cylinders = parseInt(inputs.cylinders);

    if (
      isNaN(bore) || bore <= 0 ||
      isNaN(stroke) || stroke <= 0 ||
      isNaN(cylinders) || cylinders <= 0
    ) {
      return {
        primary: "0",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for all fields.",
        feedback: "Error"
      };
    }

    // Engine displacement formula:
    // Displacement = π/4 × bore² × stroke × number of cylinders

    // Units:
    // If imperial: bore and stroke in inches, displacement in cubic inches (ci)
    // If metric: bore and stroke in millimeters, displacement in cubic centimeters (cc or cm³)

    let displacement = 0;
    let unitLabel = "";
    if (inputs.unit === "imperial") {
      // cubic inches
      displacement = (Math.PI / 4) * Math.pow(bore, 2) * stroke * cylinders;
      unitLabel = "ci";
    } else {
      // metric: convert mm to cm (divide by 10), result in cc
      const boreCm = bore / 10;
      const strokeCm = stroke / 10;
      displacement = (Math.PI / 4) * Math.pow(boreCm, 2) * strokeCm * cylinders;
      unitLabel = "cc";
    }

    // Round to 2 decimals
    const displacementRounded = displacement.toFixed(2);

    // Provide feedback based on displacement size
    let feedback = "Standard range";
    if (displacement < 1000) feedback = "Small displacement engine";
    else if (displacement > 5000) feedback = "Large displacement engine";

    return {
      primary: `${displacementRounded} ${unitLabel}`,
      secondary: `Engine displacement`,
      details: `Calculated using bore = ${bore} ${inputs.unit === "imperial" ? "in" : "mm"}, stroke = ${stroke} ${inputs.unit === "imperial" ? "in" : "mm"}, cylinders = ${cylinders}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is engine displacement and why is it important?",
      answer:
        "Engine displacement refers to the total volume swept by all the pistons inside the cylinders of an internal combustion engine. It is usually measured in cubic centimeters (cc) or cubic inches (ci). This measurement is important because it directly correlates with the engine's power output and fuel consumption characteristics. Larger displacement engines generally produce more power but may consume more fuel."
    },
    {
      question: "How do I measure bore and stroke for this calculator?",
      answer:
        "The bore is the diameter of the engine's cylinder, and the stroke is the distance the piston travels inside the cylinder. These measurements can be found in the vehicle's service manual or manufacturer specifications. Accurate measurements are crucial for precise displacement calculation, so use reliable sources or tools like calipers if measuring manually."
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both metric and imperial units. For imperial units, input bore and stroke in inches, and the displacement will be calculated in cubic inches. For metric units, input bore and stroke in millimeters, and the result will be in cubic centimeters (cc). Make sure to select the correct unit system before entering values."
    },
    {
      question: "Why does engine displacement affect vehicle performance?",
      answer:
        "Engine displacement affects the amount of air and fuel mixture that can be combusted in the engine cylinders. Larger displacement engines can burn more fuel-air mixture per cycle, producing more power and torque. However, this also often leads to higher fuel consumption. Displacement is one of several factors influencing overall vehicle performance."
    },
    {
      question: "Is engine displacement the only factor determining engine power?",
      answer:
        "No, engine displacement is just one factor. Other elements like engine design, forced induction (turbocharging or supercharging), fuel type, valve timing, and engine tuning also significantly impact power output. Displacement provides a baseline estimate of engine size but does not alone define performance."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the engine displacement of a 4-cylinder car engine with a bore of 3.5 inches and a stroke of 3.2 inches using imperial units.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Bore = 3.5 inches, Stroke = 3.2 inches, Cylinders = 4"
      },
      {
        label: "Step 2: Apply the displacement formula",
        explanation:
          "Displacement = π/4 × bore² × stroke × cylinders = 3.1416/4 × (3.5)² × 3.2 × 4"
      },
      {
        label: "Step 3: Calculate bore squared",
        explanation: "3.5² = 12.25"
      },
      {
        label: "Step 4: Calculate displacement",
        explanation:
          "Displacement = 0.7854 × 12.25 × 3.2 × 4 = 0.7854 × 12.25 × 12.8 = 123.3 cubic inches"
      }
    ],
    result: "Final Result: The engine displacement is approximately 123.3 cubic inches (ci)."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and engine specifications."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, advice, and specifications."
    },
    {
      title: "HowStuffWorks - Engine Displacement",
      description: "Detailed explanation of engine displacement and its impact."
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
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
            <SelectItem value="metric">Metric (mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Bore ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.bore}
            onChange={(e) => handleInputChange("bore", e.target.value)}
            placeholder="e.g. 3.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Stroke ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.stroke}
            onChange={(e) => handleInputChange("stroke", e.target.value)}
            placeholder="e.g. 3.2"
          />
        </div>
        <div className="space-y-2">
          <Label>Number of Cylinders</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.cylinders}
            onChange={(e) => handleInputChange("cylinders", e.target.value)}
            placeholder="e.g. 4"
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
            <p className="mt-2 font-medium text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (inches) or Metric (millimeters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bore (cylinder diameter) value in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the stroke (piston travel length) value in the chosen unit.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total number of cylinders in your engine.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see the engine displacement result.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Engine Displacement Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Engine displacement is a fundamental specification that defines the total volume displaced by all the pistons inside an engine's cylinders during one complete cycle. It is a key indicator of engine size and potential power output. This calculator helps you determine the engine displacement by inputting three critical parameters: bore, stroke, and the number of cylinders.
          </p>
          <p>
            The bore is the diameter of each cylinder, while the stroke is the distance the piston travels within the cylinder. Both measurements must be consistent in units—either inches for imperial or millimeters for metric. The number of cylinders is simply how many cylinders the engine contains, which can range from 2 in small motorcycles to 12 or more in high-performance cars.
          </p>
          <p>
            The formula used is: Displacement = π/4 × bore² × stroke × number of cylinders. For metric inputs, bore and stroke are converted from millimeters to centimeters to yield displacement in cubic centimeters (cc). For imperial inputs, the result is in cubic inches (ci). Understanding engine displacement is crucial for automotive engineers, enthusiasts, and buyers as it influences engine power, fuel efficiency, and vehicle classification.
          </p>
          <p>
            This calculator provides a quick and accurate way to estimate engine displacement without needing complex tools or manuals. It is especially useful when comparing engines, tuning vehicles, or verifying manufacturer specifications. Always ensure your input values are accurate and consistent for the best results.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Mixing units:</strong> Entering bore and stroke in different units (e.g., bore in inches and stroke in millimeters) will produce incorrect results. Always select the correct unit system and enter all measurements accordingly.
          </p>
          <p>
            <strong>2. Incorrect number of cylinders:</strong> Using the wrong cylinder count will drastically affect the displacement calculation. Verify the exact number of cylinders for your engine model.
          </p>
          <p>
            <strong>3. Using rounded or estimated measurements:</strong> Bore and stroke values should be as precise as possible. Rounding too much can lead to inaccurate displacement values.
          </p>
          <p>
            <strong>4. Forgetting unit conversion:</strong> For metric inputs, bore and stroke must be converted from millimeters to centimeters internally. Do not manually convert before inputting; just select metric and enter millimeters.
          </p>
          <p>
            <strong>5. Ignoring engine modifications:</strong> Aftermarket modifications such as stroker kits or oversized pistons change bore or stroke dimensions. Use updated specs for accurate displacement.
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Engine Displacement Calculator"
      description="Professional automotive calculator: Engine Displacement Calculator. Get accurate estimates, expert advice, and financial insights."
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