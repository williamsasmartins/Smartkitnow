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

export default function CarbCfmSizingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    displacement: "", // Engine displacement in cubic inches (imperial) or liters (metric)
    rpm: "",          // Maximum RPM at which carburetor will operate
    volumetricEfficiency: "", // Volumetric efficiency as percentage (e.g., 85)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const disp = parseFloat(inputs.displacement);
    const rpm = parseFloat(inputs.rpm);
    const ve = parseFloat(inputs.volumetricEfficiency);

    if (isNaN(disp) || disp <= 0 || isNaN(rpm) || rpm <= 0 || isNaN(ve) || ve <= 0) {
      return {
        primary: "0",
        secondary: "Invalid input values",
        details: "Please enter positive numbers for all inputs.",
        feedback: "Check inputs"
      };
    }

    // Convert displacement to cubic feet per minute (cfm)
    // Formula: CFM = (Displacement x RPM x VE) / 3456
    // 3456 = 2 x 1728 (cubic inches in a cubic foot) x 60 seconds/min
    // VE is decimal (e.g. 0.85 for 85%)
    // If metric, convert liters to cubic inches first: 1 liter = 61.024 cubic inches

    let displacementCI = disp;
    if (inputs.unit === "metric") {
      displacementCI = disp * 61.024; // liters to cubic inches
    }

    const veDecimal = ve / 100;

    const cfm = (displacementCI * rpm * veDecimal) / 3456;

    // Round to nearest whole number for carburetor sizing
    const cfmRounded = Math.round(cfm);

    return {
      primary: `${cfmRounded} CFM`,
      secondary: `Based on your engine specs`,
      details: `Calculation: (${displacementCI.toFixed(2)} ci × ${rpm} rpm × ${veDecimal.toFixed(2)}) ÷ 3456 = ${cfm.toFixed(2)} CFM`,
      feedback: cfmRounded < 150 ? "Small carburetor size" : cfmRounded > 750 ? "Large carburetor size" : "Standard range"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What does CFM mean in carburetor sizing?",
      answer:
        "CFM stands for Cubic Feet per Minute and measures the volume of air a carburetor can flow. Proper carburetor sizing ensures the engine receives the correct air-fuel mixture for optimal performance. An undersized carburetor restricts airflow, limiting power, while an oversized one can cause poor throttle response and fuel economy."
    },
    {
      question: "How does volumetric efficiency affect carburetor CFM sizing?",
      answer:
        "Volumetric efficiency (VE) represents how effectively an engine fills its cylinders with air compared to its theoretical maximum. Higher VE means more air intake, requiring a larger carburetor CFM rating. Using VE in calculations helps tailor carburetor size to real engine breathing capabilities, improving accuracy."
    },
    {
      question: "Can I use this calculator for both imperial and metric units?",
      answer:
        "Yes, this calculator supports both imperial (cubic inches) and metric (liters) units for engine displacement. It automatically converts liters to cubic inches internally to maintain consistency in calculations. Just select your preferred unit system before entering values."
    },
    {
      question: "Why is RPM important in determining carburetor size?",
      answer:
        "RPM (revolutions per minute) indicates how fast the engine runs and directly impacts airflow demand. Higher RPM engines require carburetors with greater CFM to supply sufficient air for combustion. Including RPM in sizing ensures the carburetor matches the engine's operating speed range."
    },
    {
      question: "What happens if I choose a carburetor with too high or too low CFM?",
      answer:
        "Selecting a carburetor with too low CFM restricts airflow, causing power loss and poor engine response. Conversely, too high CFM can lead to poor fuel atomization, rough idling, and inefficient fuel consumption. Proper sizing balances airflow and fuel delivery for optimal engine performance."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Sizing a carburetor for a 350 cubic inch V8 engine running at 5500 RPM with a volumetric efficiency of 85%. The goal is to find the appropriate carburetor CFM rating for optimal performance.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation:
          "Displacement = 350 cubic inches, RPM = 5500, Volumetric Efficiency = 85% (0.85 decimal)."
      },
      {
        label: "Step 2: Apply the formula",
        explanation:
          "CFM = (Displacement × RPM × VE) ÷ 3456 = (350 × 5500 × 0.85) ÷ 3456"
      },
      {
        label: "Step 3: Calculate numerator",
        explanation: "350 × 5500 × 0.85 = 1,636,250"
      },
      {
        label: "Step 4: Divide by 3456",
        explanation: "1,636,250 ÷ 3456 ≈ 473.5 CFM"
      },
      {
        label: "Step 5: Round to nearest whole number",
        explanation: "Carburetor size ≈ 474 CFM"
      }
    ],
    result: "Final Result: A carburetor with approximately 474 CFM is recommended for this engine setup."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Holley Performance Carburetor Basics",
      description:
        "Comprehensive guide on carburetor sizing and tuning from a leading carburetor manufacturer.",
      url: "https://www.holley.com/blog/post/carburetor_basics/"
    },
    {
      title: "How to Size a Carburetor",
      description:
        "Detailed explanation and calculator for carburetor CFM sizing by Summit Racing.",
      url: "https://www.summitracing.com/expertadviceandnews/professor_overdrive/size-carburetor"
    },
    {
      title: "Engine Volumetric Efficiency Explained",
      description:
        "Technical article explaining volumetric efficiency and its impact on engine performance.",
      url: "https://www.enginebuildermag.com/2019/03/understanding-volumetric-efficiency/"
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
            <SelectItem value="imperial">Imperial (cubic inches)</SelectItem>
            <SelectItem value="metric">Metric (liters)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Engine Displacement ({inputs.unit === "imperial" ? "cubic inches" : "liters"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.displacement}
            onChange={(e) => handleInputChange("displacement", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 350" : "e.g. 5.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Engine RPM</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
            placeholder="e.g. 5500"
          />
        </div>
        <div className="space-y-2">
          <Label>Volumetric Efficiency (%)</Label>
          <Input
            type="number"
            min="0"
            max="120"
            step="any"
            value={inputs.volumetricEfficiency}
            onChange={(e) => handleInputChange("volumetricEfficiency", e.target.value)}
            placeholder="e.g. 85"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Carburetor Size</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 font-semibold">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (cubic inches) or Metric (liters) for engine displacement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your engine's displacement value in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the maximum RPM at which your engine will operate or peak power RPM.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the volumetric efficiency (VE) percentage of your engine. If unknown, use a typical value between 80-90%.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to get the recommended carburetor CFM size.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Carburetor CFM Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Carburetor sizing is a critical aspect of engine tuning and performance optimization. The carburetor controls the air and fuel mixture entering the engine, and its capacity is measured in cubic feet per minute (CFM) of airflow. Selecting the right carburetor size ensures the engine breathes efficiently, maximizing power output while maintaining drivability and fuel economy.
          </p>
          <p>
            The fundamental formula used in this calculator is: <em>CFM = (Displacement × RPM × Volumetric Efficiency) ÷ 3456</em>. Here, displacement is the total volume of all engine cylinders, RPM is the engine speed, and volumetric efficiency (VE) is a measure of how effectively the engine fills its cylinders with air. The constant 3456 converts the units to cubic feet per minute.
          </p>
          <p>
            Volumetric efficiency varies depending on engine design, camshaft profile, intake and exhaust systems, and tuning. Typical naturally aspirated engines have VE values between 80% and 90%, while performance engines can exceed 100% with forced induction or tuned intake systems. Accurately estimating VE improves carburetor sizing precision.
          </p>
          <p>
            Using this calculator, you can input your engine's displacement, maximum RPM, and VE to determine the ideal carburetor CFM rating. This helps avoid common pitfalls such as undersized carburetors that restrict airflow or oversized carburetors that cause poor throttle response and inefficient fuel atomization. Proper carburetor sizing is essential for balanced engine performance, fuel efficiency, and emissions control.
          </p>
          <p>
            Remember, this calculator provides an estimate. Final carburetor selection should consider additional factors like intended use (street, racing), fuel type, and tuning preferences. Consulting with a professional tuner or engine builder is recommended for custom applications.
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
            <strong>1. Ignoring Volumetric Efficiency:</strong> Using a default VE of 100% without considering engine specifics can lead to inaccurate carburetor sizing. Always estimate VE based on engine condition and modifications.
          </p>
          <p>
            <strong>2. Using Peak RPM Instead of Cruise RPM:</strong> Sizing carburetors based on maximum RPM only may cause poor drivability at lower speeds. Consider the engine's typical operating RPM range.
          </p>
          <p>
            <strong>3. Mixing Units Incorrectly:</strong> Ensure displacement units match the selected system (imperial or metric). Incorrect unit conversion leads to wrong CFM calculations.
          </p>
          <p>
            <strong>4. Oversizing Carburetors:</strong> Bigger is not always better. Oversized carburetors can cause poor throttle response, rough idle, and increased fuel consumption.
          </p>
          <p>
            <strong>5. Neglecting Other Engine Factors:</strong> Carburetor sizing is one part of tuning. Intake manifold design, camshaft profile, and exhaust system also affect airflow and performance.
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
      title="Carburetor CFM Sizing Calculator"
      description="Professional automotive calculator: Carburetor CFM Sizing Calculator. Get accurate estimates, expert advice, and financial insights."
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