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

export default function BrakePadWearEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentPadThickness: "", // in mm or inches
    minPadThickness: "", // in mm or inches (manufacturer spec)
    currentRotorThickness: "", // in mm or inches
    minRotorThickness: "", // in mm or inches (manufacturer spec)
    pricePerPadSet: "", // in $ or local currency
    pricePerRotorSet: "" // in $ or local currency
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const padCurrent = parseFloat(inputs.currentPadThickness);
    const padMin = parseFloat(inputs.minPadThickness);
    const rotorCurrent = parseFloat(inputs.currentRotorThickness);
    const rotorMin = parseFloat(inputs.minRotorThickness);
    const padPrice = parseFloat(inputs.pricePerPadSet);
    const rotorPrice = parseFloat(inputs.pricePerRotorSet);

    if (
      isNaN(padCurrent) || isNaN(padMin) || isNaN(rotorCurrent) || isNaN(rotorMin) ||
      padCurrent <= 0 || padMin <= 0 || rotorCurrent <= 0 || rotorMin <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers for thickness values.",
        feedback: "Error"
      };
    }

    // Calculate wear percentage for pads and rotors
    // Wear % = ((Current Thickness - Min Thickness) / (Typical New Thickness - Min Thickness)) * 100
    // Since new thickness is not given, assume typical new thickness:
    // Pads: 12 mm (0.47 in), Rotors: 30 mm (1.18 in) - common average values
    // If unit is imperial, convert typical new thickness accordingly

    const typicalPadNewThickness = inputs.unit === "imperial" ? 0.47 : 12; // inches or mm
    const typicalRotorNewThickness = inputs.unit === "imperial" ? 1.18 : 30; // inches or mm

    // Validate typical new thickness > min thickness
    if (padMin >= typicalPadNewThickness || rotorMin >= typicalRotorNewThickness) {
      return {
        primary: "Invalid specs",
        secondary: "",
        details: "Minimum thickness must be less than typical new thickness.",
        feedback: "Error"
      };
    }

    // Calculate pad wear %
    const padWearPercent = ((typicalPadNewThickness - padCurrent) / (typicalPadNewThickness - padMin)) * 100;
    // Calculate rotor wear %
    const rotorWearPercent = ((typicalRotorNewThickness - rotorCurrent) / (typicalRotorNewThickness - rotorMin)) * 100;

    // Clamp values between 0 and 100
    const padWearClamped = Math.min(Math.max(padWearPercent, 0), 100);
    const rotorWearClamped = Math.min(Math.max(rotorWearPercent, 0), 100);

    // Estimate replacement cost if wear > 80%
    const padNeedsReplacement = padWearClamped >= 80;
    const rotorNeedsReplacement = rotorWearClamped >= 80;

    let totalCost = 0;
    if (padNeedsReplacement && !isNaN(padPrice)) totalCost += padPrice;
    if (rotorNeedsReplacement && !isNaN(rotorPrice)) totalCost += rotorPrice;

    // Feedback message
    let feedback = "Brake components are in good condition.";
    if (padNeedsReplacement && rotorNeedsReplacement) {
      feedback = "Both brake pads and rotors need replacement soon.";
    } else if (padNeedsReplacement) {
      feedback = "Brake pads need replacement soon.";
    } else if (rotorNeedsReplacement) {
      feedback = "Brake rotors need replacement soon.";
    } else if (padWearClamped >= 50 || rotorWearClamped >= 50) {
      feedback = "Brake components show moderate wear; monitor regularly.";
    }

    // Format results
    const primary = `Pads: ${padWearClamped.toFixed(1)}% worn, Rotors: ${rotorWearClamped.toFixed(1)}% worn`;
    const secondary = totalCost > 0 ? `Estimated replacement cost: $${totalCost.toFixed(2)}` : "No immediate replacement needed";
    const details = `Pad thickness: ${padCurrent} / Min: ${padMin}, Rotor thickness: ${rotorCurrent} / Min: ${rotorMin}`;

    return {
      primary,
      secondary,
      details,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How often should I check my brake pads and rotors?",
      answer:
        "Brake pads and rotors should be inspected at least every 10,000 to 15,000 miles or during regular vehicle maintenance. Frequent checks are especially important if you drive in heavy traffic or mountainous areas, as these conditions accelerate wear. Regular inspections help prevent costly repairs and ensure your vehicle's braking system remains safe and effective."
    },
    {
      question: "What does minimum thickness mean for brake pads and rotors?",
      answer:
        "Minimum thickness is the manufacturer-specified limit below which brake pads or rotors should not be used. Operating below this thickness compromises braking performance and safety, increasing the risk of brake failure. It is essential to replace components before they reach this minimum to maintain optimal braking efficiency."
    },
    {
      question: "Can I replace only the brake pads without replacing the rotors?",
      answer:
        "In many cases, brake pads can be replaced independently if the rotors are still within their minimum thickness and show no signs of damage like warping or deep grooves. However, if rotors are worn or damaged, replacing both pads and rotors together is recommended to ensure even braking and prolong component life."
    },
    {
      question: "How does driving style affect brake pad and rotor wear?",
      answer:
        "Aggressive driving, such as frequent hard braking, rapid acceleration, and driving downhill without engine braking, significantly increases wear on brake pads and rotors. Conversely, smooth and gradual braking extends their lifespan. Understanding your driving habits can help you anticipate maintenance needs and reduce replacement costs."
    },
    {
      question: "Why do brake rotors sometimes need replacement more often than pads?",
      answer:
        "Brake rotors can wear unevenly or warp due to excessive heat, heavy braking, or poor maintenance, which may necessitate replacement even if pads are still usable. Rotors are also subject to corrosion and physical damage. Regular inspection and proper brake system care help maximize rotor life."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver wants to estimate the wear on their brake pads and rotors to decide if replacement is needed. They measure the current thickness and know the minimum thickness specs and replacement costs.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the current pad thickness as 4 mm, minimum pad thickness as 2 mm, current rotor thickness as 25 mm, and minimum rotor thickness as 22 mm. Prices are $120 for a pad set and $200 for a rotor set."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate pad wear %: ((12 - 4) / (12 - 2)) * 100 = (8 / 10) * 100 = 80%. Calculate rotor wear %: ((30 - 25) / (30 - 22)) * 100 = (5 / 8) * 100 = 62.5%."
      },
      {
        label: "Step 3",
        explanation:
          "Since pad wear is 80%, pads need replacement. Rotor wear is 62.5%, so rotors do not need immediate replacement but should be monitored."
      },
      {
        label: "Step 4",
        explanation:
          "Estimated replacement cost is $120 for pads only."
      }
    ],
    result: "Brake pads are 80% worn and need replacement. Rotors are 62.5% worn and can be monitored. Estimated replacement cost: $120."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Brake Pad and Rotor Maintenance Guide - NHTSA",
      description: "Comprehensive guide on brake system maintenance and safety from the National Highway Traffic Safety Administration."
    },
    {
      title: "How to Measure Brake Pad Thickness - YourMechanic",
      description: "Step-by-step instructions on measuring brake pad thickness and understanding wear indicators."
    },
    {
      title: "Brake Rotor Replacement Guide - Advance Auto Parts",
      description: "Detailed explanation of rotor wear, replacement criteria, and cost considerations."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Brake Pad Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.currentPadThickness}
            onChange={(e) => handleInputChange("currentPadThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.16" : "e.g. 4"}
          />
        </div>
        <div className="space-y-2">
          <Label>Minimum Brake Pad Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.minPadThickness}
            onChange={(e) => handleInputChange("minPadThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.08" : "e.g. 2"}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Rotor Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.currentRotorThickness}
            onChange={(e) => handleInputChange("currentRotorThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.98" : "e.g. 25"}
          />
        </div>
        <div className="space-y-2">
          <Label>Minimum Rotor Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.minRotorThickness}
            onChange={(e) => handleInputChange("minRotorThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.87" : "e.g. 22"}
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Brake Pad Set ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.pricePerPadSet}
            onChange={(e) => handleInputChange("pricePerPadSet", e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Rotor Set ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.pricePerRotorSet}
            onChange={(e) => handleInputChange("pricePerRotorSet", e.target.value)}
            placeholder="e.g. 200"
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
            <p className="mt-3 font-semibold text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred measurement unit: Imperial (inches) or Metric (millimeters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the current thickness of your brake pads and rotors as measured with a caliper or gauge.
          </li>
          <li>
            <strong>Step 3:</strong> Input the minimum thickness specifications for your brake pads and rotors, usually found in your vehicle’s manual or manufacturer’s website.
          </li>
          <li>
            <strong>Step 4:</strong> Provide the current market price for a set of brake pads and rotors to estimate replacement costs.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to see the estimated wear percentages and whether replacement is recommended, along with an approximate cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Brake Pad/Rotors Wear Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Brake pads and rotors are critical components of your vehicle’s braking system, responsible for safely slowing and stopping your car. Over time, these parts wear down due to friction and heat generated during braking. Monitoring their thickness is essential to maintain optimal braking performance and ensure safety on the road. This calculator helps estimate the wear level of your brake pads and rotors based on current and minimum thickness measurements, providing a clear indication of when replacement is necessary.
          </p>
          <p>
            The wear percentage is calculated by comparing the current thickness against the typical new thickness and the minimum allowable thickness specified by manufacturers. For brake pads, a typical new thickness is around 12 mm (0.47 inches), while rotors usually start at about 30 mm (1.18 inches). When the wear exceeds 80%, it is generally recommended to replace the component to avoid brake failure or damage to other parts. This tool also estimates the replacement cost based on your input prices, helping you plan financially for maintenance.
          </p>
          <p>
            Regular inspection and timely replacement of brake pads and rotors not only enhance safety but also improve vehicle performance and reduce long-term repair costs. Aggressive driving, frequent braking, and harsh road conditions can accelerate wear, so it’s important to check these components more often under such circumstances. Using this estimator, you can make informed decisions about brake maintenance, ensuring your vehicle remains safe and reliable.
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
            <strong>1. Incorrect Thickness Measurement:</strong> Using improper tools or measuring at the wrong spot can lead to inaccurate thickness readings, resulting in wrong wear estimates. Always use a calibrated caliper and measure at multiple points.
          </p>
          <p>
            <strong>2. Ignoring Minimum Thickness Specs:</strong> Some users enter unrealistic minimum thickness values or omit them altogether. Always refer to your vehicle’s manual or manufacturer data for accurate minimum thickness.
          </p>
          <p>
            <strong>3. Not Considering Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can cause errors. Ensure all inputs are in the same unit system selected.
          </p>
          <p>
            <strong>4. Overlooking Rotor Condition:</strong> Thickness alone doesn’t tell the full story; warped or cracked rotors need replacement regardless of thickness. Visual inspection is crucial.
          </p>
          <p>
            <strong>5. Delaying Replacement:</strong> Waiting too long to replace worn pads or rotors can damage other brake components and increase repair costs. Use this estimator proactively.
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
      title="Brake Pad/Rotors Wear Estimator"
      description="Professional automotive calculator: Brake Pad/Rotors Wear Estimator. Get accurate estimates, expert advice, and financial insights."
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