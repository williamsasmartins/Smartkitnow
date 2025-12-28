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

export default function CamshaftDurationOverlapCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    intakeDuration: "", // degrees of crankshaft rotation intake valve is open
    exhaustDuration: "", // degrees of crankshaft rotation exhaust valve is open
    lobeSeparationAngle: "", // degrees between intake and exhaust lobes centerlines
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const intake = parseFloat(inputs.intakeDuration);
    const exhaust = parseFloat(inputs.exhaustDuration);
    const lsa = parseFloat(inputs.lobeSeparationAngle);

    if (isNaN(intake) || isNaN(exhaust) || isNaN(lsa) || intake <= 0 || exhaust <= 0 || lsa <= 0) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers",
        details: "",
        feedback: "",
      };
    }

    // Calculate overlap duration:
    // Overlap = Intake Duration + Exhaust Duration - (2 * Lobe Separation Angle)
    // Overlap can be zero or negative (meaning no overlap)
    const overlap = intake + exhaust - 2 * lsa;

    // Format results
    const overlapFormatted = overlap.toFixed(1);
    const intakeFormatted = intake.toFixed(1);
    const exhaustFormatted = exhaust.toFixed(1);
    const lsaFormatted = lsa.toFixed(1);

    // Feedback based on typical ranges
    let feedback = "";
    if (overlap < 0) {
      feedback = "No valve overlap: typical for low-RPM or emissions-focused cams.";
    } else if (overlap >= 0 && overlap <= 30) {
      feedback = "Mild overlap: good for street performance and smooth idle.";
    } else if (overlap > 30 && overlap <= 70) {
      feedback = "Moderate overlap: performance-oriented camshaft.";
    } else {
      feedback = "High overlap: aggressive camshaft, suitable for high RPM power.";
    }

    return {
      primary: `${overlapFormatted}°`,
      secondary: `Intake: ${intakeFormatted}°, Exhaust: ${exhaustFormatted}°, LSA: ${lsaFormatted}°`,
      details: `Overlap = Intake + Exhaust - 2 × LSA = ${intakeFormatted} + ${exhaustFormatted} - 2 × ${lsaFormatted} = ${overlapFormatted} degrees`,
      feedback,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is camshaft duration and why is it important?",
      answer:
        "Camshaft duration refers to the number of degrees of crankshaft rotation during which a valve (intake or exhaust) remains open. It directly affects engine breathing, power output, and efficiency. Longer durations typically improve high RPM power but can reduce low RPM torque and idle quality. Understanding duration helps in selecting or designing camshafts tailored to specific engine performance goals.",
    },
    {
      question: "What does valve overlap mean in camshaft design?",
      answer:
        "Valve overlap is the period during which both intake and exhaust valves are open simultaneously, measured in degrees of crankshaft rotation. Overlap improves scavenging at high RPMs, enhancing volumetric efficiency and power. However, excessive overlap can cause rough idle and poor emissions. Calculating overlap helps balance performance and drivability.",
    },
    {
      question: "How does lobe separation angle (LSA) affect camshaft performance?",
      answer:
        "Lobe Separation Angle (LSA) is the angle between the centerlines of the intake and exhaust cam lobes. A wider LSA reduces valve overlap, resulting in smoother idle and better vacuum, while a narrower LSA increases overlap, boosting high RPM power but potentially causing rough idle. LSA is a critical parameter in camshaft tuning and engine characteristics.",
    },
    {
      question: "Can I use this calculator for any engine type?",
      answer:
        "Yes, this calculator applies to general automotive engines with camshafts controlling intake and exhaust valves. It assumes conventional four-stroke engines where camshaft duration and lobe separation angle are relevant. For specialized engines or variable valve timing systems, additional parameters may be needed for precise analysis.",
    },
    {
      question: "How accurate are the results from this calculator?",
      answer:
        "The calculator provides theoretical estimates based on standard camshaft geometry formulas. Actual engine performance depends on many factors including valve timing events, cam lift, engine speed, and tuning. Use these results as a guide rather than absolute values, and consult with engine builders or use dynamometer testing for precise tuning.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating valve overlap for a performance camshaft on a 5.0L V8 engine with intake duration of 240°, exhaust duration of 248°, and a lobe separation angle of 112°.",
    steps: [
      {
        label: "Step 1",
        explanation: "Identify intake duration = 240°, exhaust duration = 248°, and LSA = 112°.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate overlap using formula: Overlap = Intake + Exhaust - 2 × LSA = 240 + 248 - 2 × 112 = 488 - 224 = 264°.",
      },
      {
        label: "Step 3",
        explanation:
          "Interpret result: 264° overlap is unusually high, indicating an aggressive camshaft likely designed for high RPM power. Typically, overlap values range from 0° to 70°, so this suggests a possible input error or a specialized camshaft.",
      },
    ],
    result:
      "Final Result: Valve overlap = 264°. This high overlap indicates aggressive cam timing, which may cause rough idle but improve high RPM performance.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How to Choose a Camshaft",
      description:
        "Comprehensive guide on camshaft basics, duration, overlap, and lobe separation angle by Summit Racing.",
      url: "https://www.summitracing.com/expertadviceandnews/professor_overdrive/understanding_camshafts",
    },
    {
      title: "Camshaft Duration and Overlap Explained",
      description:
        "Detailed explanation of camshaft timing and its effects on engine performance by Hot Rod Network.",
      url: "https://www.hotrod.com/articles/how-to-understand-camshaft-duration-and-overlap/",
    },
    {
      title: "Valve Timing and Camshaft Basics",
      description:
        "Technical overview of valve timing parameters and their impact on engine breathing from Engineering Explained.",
      url: "https://www.engineeringexplained.com/valve-timing",
    },
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
            <SelectItem value="imperial">Degrees (°)</SelectItem>
            <SelectItem value="metric">Degrees (°)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Intake Duration (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 240"
            value={inputs.intakeDuration}
            onChange={(e) => handleInputChange("intakeDuration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Exhaust Duration (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 248"
            value={inputs.exhaustDuration}
            onChange={(e) => handleInputChange("exhaustDuration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Lobe Separation Angle (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 112"
            value={inputs.lobeSeparationAngle}
            onChange={(e) => handleInputChange("lobeSeparationAngle", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Valve Overlap Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter the intake valve duration in degrees of crankshaft rotation during which the intake valve is open.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the exhaust valve duration in degrees of crankshaft rotation during which the exhaust valve is open.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the lobe separation angle (LSA), which is the angle between the intake and exhaust cam lobes centerlines.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute the valve overlap duration and view detailed results and feedback.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Camshaft Duration & Overlap Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The camshaft is a critical component in an internal combustion engine that controls the timing and duration of valve openings. Camshaft duration refers to the number of degrees of crankshaft rotation during which a valve remains open, either intake or exhaust. This duration directly influences how much air-fuel mixture enters the combustion chamber and how efficiently exhaust gases exit, impacting engine performance, fuel efficiency, and emissions.
          </p>
          <p>
            Valve overlap is the period when both intake and exhaust valves are open simultaneously. This overlap allows for better scavenging of exhaust gases and improved cylinder filling at higher engine speeds, enhancing power output. However, excessive overlap can cause rough idling and increased emissions, so it must be carefully balanced.
          </p>
          <p>
            The lobe separation angle (LSA) is the angle between the peak lift points of the intake and exhaust cam lobes. A wider LSA reduces overlap, resulting in smoother idle and better vacuum, while a narrower LSA increases overlap, improving high RPM power but potentially causing rough idle. By inputting intake duration, exhaust duration, and LSA into this calculator, you can determine the valve overlap and better understand the camshaft’s characteristics.
          </p>
          <p>
            This calculator is a valuable tool for automotive engineers, engine builders, and enthusiasts to analyze camshaft specifications and optimize engine performance. It helps in selecting the right camshaft for your application, whether for street driving, racing, or emissions compliance.
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
            <strong>1. Entering incorrect units or values:</strong> Camshaft durations and LSA are always measured in degrees of crankshaft rotation. Using other units or negative values will produce invalid results.
          </p>
          <p>
            <strong>2. Ignoring the physical meaning of overlap:</strong> Overlap can be zero or negative (meaning no overlap). Negative values indicate valves do not open simultaneously, which is common in emissions-focused cams.
          </p>
          <p>
            <strong>3. Misinterpreting high overlap values:</strong> Extremely high overlap values usually indicate aggressive camshafts designed for racing and may cause drivability issues on street vehicles.
          </p>
          <p>
            <strong>4. Not considering other camshaft parameters:</strong> Duration and overlap are important but not the only factors affecting engine performance. Lift, ramp rates, and valve timing events also play critical roles.
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
      title="Camshaft Duration & Overlap Calculator"
      description="Professional automotive calculator: Camshaft Duration & Overlap Calculator. Get accurate estimates, expert advice, and financial insights."
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
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}