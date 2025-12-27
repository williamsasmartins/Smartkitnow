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

export default function ShiftPointRpmDropCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentRpm: "",
    nextGearRatio: "",
    currentGearRatio: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Shift Point RPM Drop Estimator Logic:
   * When shifting gears in a manual or automatic transmission, the RPM drops based on the ratio difference between the current gear and the next gear.
   * RPM Drop = Current RPM * (1 - (Next Gear Ratio / Current Gear Ratio))
   * This formula assumes the engine speed changes proportionally to the gear ratio change.
   */

  const results = useMemo(() => {
    const currentRpm = parseFloat(inputs.currentRpm);
    const currentGearRatio = parseFloat(inputs.currentGearRatio);
    const nextGearRatio = parseFloat(inputs.nextGearRatio);

    if (
      isNaN(currentRpm) || currentRpm <= 0 ||
      isNaN(currentGearRatio) || currentGearRatio <= 0 ||
      isNaN(nextGearRatio) || nextGearRatio <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate RPM drop
    const rpmDrop = currentRpm * (1 - (nextGearRatio / currentGearRatio));
    const rpmAfterShift = currentRpm - rpmDrop;

    // Feedback based on typical RPM drop ranges (manual transmission)
    let feedback = "Standard range";
    if (rpmDrop < 500) feedback = "Very small RPM drop - may cause lugging";
    else if (rpmDrop > 3000) feedback = "Large RPM drop - may cause jerky shifts";

    return {
      primary: rpmDrop.toFixed(0) + " RPM",
      secondary: `RPM after shift: ${rpmAfterShift.toFixed(0)} RPM`,
      details: `Calculated RPM drop based on gear ratios and current RPM.`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the Shift Point RPM Drop?",
      answer:
        "The Shift Point RPM Drop refers to the decrease in engine revolutions per minute (RPM) when shifting from one gear to another. It is influenced by the gear ratios of the current and next gear and the engine speed before shifting. Understanding this drop helps optimize shift timing for smooth driving and performance."
    },
    {
      question: "Why is estimating RPM drop important?",
      answer:
        "Estimating RPM drop is crucial for drivers and engineers to ensure smooth gear transitions, prevent engine lugging or over-revving, and improve fuel efficiency. It also helps in tuning transmissions and selecting optimal shift points for performance or economy."
    },
    {
      question: "How do gear ratios affect RPM drop?",
      answer:
        "Gear ratios determine how engine speed translates to wheel speed. A larger difference between current and next gear ratios results in a bigger RPM drop during shifting. Smaller differences cause smaller RPM drops, which might lead to engine lugging if too low."
    },
    {
      question: "Can this calculator be used for automatic transmissions?",
      answer:
        "Yes, but with caution. Automatic transmissions often have torque converters and different shift characteristics, so RPM drops may not directly correspond to gear ratio changes. This calculator is most accurate for manual or dual-clutch transmissions."
    },
    {
      question: "What units should I use for gear ratios and RPM?",
      answer:
        "Gear ratios are unitless numbers representing the ratio between engine speed and wheel speed. RPM is revolutions per minute. Ensure you input actual engine RPM and gear ratios as decimals or fractions (e.g., 3.5, 2.1) for accurate results."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver is shifting from 2nd gear to 3rd gear in a manual transmission car. The engine speed before shifting is 4000 RPM. The 2nd gear ratio is 2.15, and the 3rd gear ratio is 1.45. The driver wants to estimate the RPM drop after shifting.",
    steps: [
      {
        label: "Step 1: Identify current RPM",
        explanation: "The engine speed before shifting is 4000 RPM."
      },
      {
        label: "Step 2: Note gear ratios",
        explanation: "Current gear ratio (2nd gear) = 2.15, Next gear ratio (3rd gear) = 1.45."
      },
      {
        label: "Step 3: Calculate RPM drop",
        explanation:
          "RPM Drop = 4000 * (1 - (1.45 / 2.15)) = 4000 * (1 - 0.6744) = 4000 * 0.3256 = 1302 RPM."
      },
      {
        label: "Step 4: Calculate RPM after shift",
        explanation: "RPM after shift = 4000 - 1302 = 2698 RPM."
      }
    ],
    result: "The estimated RPM drop is approximately 1300 RPM, and the engine speed after shifting will be about 2700 RPM."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Gear Ratios Affect RPM and Speed",
      description:
        "An in-depth explanation of gear ratios and their impact on engine RPM and vehicle speed.",
      url: "https://www.explainthatstuff.com/how-gearboxes-work.html"
    },
    {
      title: "Manual Transmission Basics",
      description:
        "Overview of manual transmission operation and gear shifting principles.",
      url: "https://www.carsguide.com.au/car-advice/how-does-a-manual-transmission-work-70669"
    },
    {
      title: "RPM Drop and Shift Points",
      description:
        "Technical article on optimizing shift points based on RPM drop for performance driving.",
      url: "https://www.motorsportreg.com/blog/shift-points-and-rpm-drop"
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
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Engine RPM</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 4000"
            value={inputs.currentRpm}
            onChange={(e) => handleInputChange("currentRpm", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 2.15"
            value={inputs.currentGearRatio}
            onChange={(e) => handleInputChange("currentGearRatio", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Next Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1.45"
            value={inputs.nextGearRatio}
            onChange={(e) => handleInputChange("nextGearRatio", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter the current engine RPM before shifting. This is the engine speed at the moment you plan to shift gears.
          </li>
          <li>
            <strong>Step 2:</strong> Input the current gear ratio of the gear you are in. Gear ratios are unitless and typically found in your vehicle’s manual or technical specs.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the gear ratio of the next gear you intend to shift into.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to estimate the RPM drop and the expected engine RPM after shifting.
          </li>
          <li>
            <strong>Step 5:</strong> Review the feedback to understand if the shift is within a smooth and efficient range.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Shift Point RPM Drop Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Shift Point RPM Drop Estimator is a vital tool for automotive engineers, enthusiasts, and drivers who want to understand how engine speed changes during gear shifts. When you shift gears, the engine RPM drops because the gear ratio changes, altering the relationship between engine speed and wheel speed. This drop affects vehicle performance, drivability, and fuel efficiency.
          </p>
          <p>
            The core principle behind the calculation is the proportional relationship between gear ratios and engine RPM. By knowing the current engine RPM and the gear ratios of the current and next gear, you can estimate how much the engine speed will decrease after shifting. This helps in selecting optimal shift points to avoid engine lugging (too low RPM) or over-revving (too high RPM), both of which can harm engine health and reduce efficiency.
          </p>
          <p>
            This calculator is especially useful for manual and dual-clutch transmissions where the driver or control system decides the exact shift points. For automatic transmissions, the RPM drop may be influenced by torque converters and shift logic, so results should be interpreted with caution. Understanding RPM drop also aids in tuning performance vehicles, improving shift smoothness, and enhancing overall driving experience.
          </p>
          <p>
            To use this calculator effectively, ensure you have accurate gear ratio data from your vehicle’s specifications and a reliable RPM reading. The output will give you the estimated RPM drop and the resulting engine speed after the shift, along with feedback on whether the shift is within a typical smooth range.
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
            <strong>1. Using incorrect gear ratios:</strong> Gear ratios must be accurate and correspond to the exact gears involved in the shift. Using approximate or wrong ratios leads to incorrect RPM drop estimates.
          </p>
          <p>
            <strong>2. Ignoring engine RPM limits:</strong> Inputting RPM values outside the engine’s operating range (too low or too high) can produce unrealistic results and misguide shift decisions.
          </p>
          <p>
            <strong>3. Applying the calculator to automatic transmissions without caution:</strong> Automatic transmissions have additional components affecting RPM drop, so this calculator is most accurate for manual or dual-clutch systems.
          </p>
          <p>
            <strong>4. Not considering clutch slip or torque converter effects:</strong> These factors can affect actual RPM drop but are not accounted for in this simplified model.
          </p>
          <p>
            <strong>5. Forgetting units and decimal precision:</strong> Gear ratios are unitless but must be entered as decimals (e.g., 2.15, not 215), and RPM should be a positive integer.
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
      title="Shift Point RPM Drop Estimator"
      description="Professional automotive calculator: Shift Point RPM Drop Estimator. Get accurate estimates, expert advice, and financial insights."
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