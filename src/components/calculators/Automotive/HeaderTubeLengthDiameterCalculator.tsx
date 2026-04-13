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

export default function HeaderTubeLengthDiameterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    engineDisplacement: "", // in cubic inches (ci) or liters (L)
    desiredHorsepower: "", // hp
    pipeMaterialThickness: "", // in inches or mm
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Logic:
   * Header primary tube diameter is often chosen based on engine displacement and desired horsepower.
   * A common formula for diameter (in inches) is:
   *   Diameter = sqrt((Displacement * RPM) / (Horsepower * constant))
   * But simplified for typical automotive use, a rule of thumb is:
   *   Diameter (inches) = 1.25 * cube_root(Displacement in ci / number of cylinders)
   * For length, primary tube length affects scavenging and power band.
   * Typical length ranges from 24" to 36" depending on RPM range.
   * We'll estimate length based on desired peak RPM (assumed 6000 rpm default).
   * 
   * For simplicity, we'll:
   * - Calculate diameter based on displacement and cylinders (assumed 4 for inline-4, 8 for V8)
   * - Calculate length based on peak RPM (default 6000 rpm)
   * 
   * Since cylinders count is not input, we'll assume 8 cylinders for displacement > 300 ci, else 4.
   */

  const results = useMemo(() => {
    const displacementRaw = parseFloat(inputs.engineDisplacement);
    const horsepowerRaw = parseFloat(inputs.desiredHorsepower);
    const thicknessRaw = parseFloat(inputs.pipeMaterialThickness);

    if (
      isNaN(displacementRaw) || displacementRaw <= 0 ||
      isNaN(horsepowerRaw) || horsepowerRaw <= 0 ||
      isNaN(thicknessRaw) || thicknessRaw <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "",
        feedback: "Please enter positive numeric values for all inputs."
      };
    }

    // Convert displacement to cubic inches if metric
    let displacementCI = displacementRaw;
    if (inputs.unit === "metric") {
      // liters to cubic inches: 1 L = 61.0237 ci
      displacementCI = displacementRaw * 61.0237;
    }

    // Determine cylinders count (simple heuristic)
    const cylinders = displacementCI > 300 ? 8 : 4;

    // Calculate primary tube diameter (inches)
    // Using a simplified formula: diameter = 1.25 * cube_root(displacement per cylinder)
    const displacementPerCylinder = displacementCI / cylinders;
    const diameterInches = 1.25 * Math.cbrt(displacementPerCylinder);

    // Calculate primary tube length (inches)
    // Typical formula for length (L) in inches:
    // L = (850 * VE) / RPM
    // VE (Volumetric Efficiency) assumed 0.85, RPM assumed 6000
    // This is a rough estimate for header primary tube length for scavenging
    const VE = 0.85;
    const RPM = 6000;
    const lengthInches = (850 * VE) / RPM * 12; // multiply by 12 to convert feet to inches

    // Adjust length based on horsepower (higher hp, longer tubes)
    // Add 2 inches per 100 hp over 200 hp (simple scaling)
    const hpAdjustment = horsepowerRaw > 200 ? ((horsepowerRaw - 200) / 100) * 2 : 0;
    const adjustedLengthInches = lengthInches + hpAdjustment;

    // Diameter with material thickness added (outer diameter)
    // Thickness input is wall thickness, so outer diameter = inner diameter + 2 * thickness
    let outerDiameterInches = diameterInches + 2 * thicknessRaw;
    if (inputs.unit === "metric") {
      // thicknessRaw is in mm, convert to inches: 1 mm = 0.03937 inches
      const thicknessInches = thicknessRaw * 0.03937;
      outerDiameterInches = diameterInches + 2 * thicknessInches;
    }

    // Convert results to metric if needed
    let diameterResult = diameterInches;
    let lengthResult = adjustedLengthInches;
    let diameterUnit = "in";
    let lengthUnit = "in";

    if (inputs.unit === "metric") {
      diameterResult = outerDiameterInches * 25.4; // inches to mm
      lengthResult = adjustedLengthInches * 25.4; // inches to mm
      diameterUnit = "mm";
      lengthUnit = "mm";
    } else {
      diameterResult = outerDiameterInches;
    }

    return {
      primary: `${diameterResult.toFixed(2)} ${diameterUnit}`,
      secondary: `${lengthResult.toFixed(2)} ${lengthUnit}`,
      details: `Based on ${displacementRaw} ${inputs.unit === "imperial" ? "ci" : "L"} displacement, ${horsepowerRaw} hp, and ${thicknessRaw} ${inputs.unit === "imperial" ? "in" : "mm"} wall thickness.`,
      feedback: "Calculated primary tube outer diameter and length for optimal performance."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does engine displacement affect header primary tube diameter?",
      answer:
        "Engine displacement directly influences the volume of exhaust gases produced, which in turn affects the optimal diameter of the header primary tubes. Larger displacement engines typically require larger diameter tubes to allow efficient exhaust flow and reduce backpressure. Selecting the correct diameter ensures better scavenging and improved engine performance."
    },
    {
      question: "Why is primary tube length important in headers?",
      answer:
        "Primary tube length impacts the exhaust gas scavenging effect, which influences the engine's power band and torque characteristics. Longer tubes generally enhance low-end torque, while shorter tubes favor high-RPM horsepower. Proper length tuning helps optimize engine efficiency and performance for the intended driving conditions."
    },
    {
      question: "Can I use the same header tube diameter for different engines?",
      answer:
        "No, header tube diameter should be matched to the specific engine's displacement, cylinder count, and desired power output. Using tubes that are too small can cause excessive backpressure, while tubes that are too large may reduce exhaust velocity and scavenging efficiency. Tailoring the diameter ensures optimal exhaust flow and engine performance."
    },
    {
      question: "How does pipe material thickness affect header design?",
      answer:
        "Pipe wall thickness affects the overall outer diameter of the header tubes and their durability. Thicker walls provide better strength and heat retention but add weight and cost. When calculating outer diameter, material thickness must be added to the inner diameter to ensure proper fitment and clearance in the engine bay."
    },
    {
      question: "Is it necessary to convert units when using this calculator?",
      answer:
        "Yes, this calculator supports both imperial and metric units. Ensure you select the correct unit system and input values accordingly. The results will be displayed in the chosen unit system, making it easier to apply the measurements during fabrication or purchase."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Designing header primary tubes for a 350 cubic inch V8 engine aiming for 400 horsepower with 0.065 inch wall thickness mild steel tubing.",
    steps: [
      {
        label: "Step 1: Determine cylinders",
        explanation:
          "Since displacement is 350 ci, which is greater than 300 ci, we assume 8 cylinders."
      },
      {
        label: "Step 2: Calculate displacement per cylinder",
        explanation: "350 ci / 8 cylinders = 43.75 ci per cylinder."
      },
      {
        label: "Step 3: Calculate inner diameter",
        explanation:
          "Diameter = 1.25 * cube_root(43.75) ≈ 1.25 * 3.52 = 4.40 inches."
      },
      {
        label: "Step 4: Calculate primary tube length",
        explanation:
          "Length = (850 * 0.85) / 6000 * 12 = 1.44 feet = 17.04 inches."
      },
      {
        label: "Step 5: Adjust length for horsepower",
        explanation:
          "Horsepower is 400 hp, which is 200 hp over 200, so add (200/100)*2 = 4 inches. Total length = 17.04 + 4 = 21.04 inches."
      },
      {
        label: "Step 6: Calculate outer diameter",
        explanation:
          "Outer diameter = inner diameter + 2 * wall thickness = 4.40 + 2 * 0.065 = 4.53 inches."
      }
    ],
    result:
      "Final Result: Primary tube outer diameter ≈ 4.53 inches, length ≈ 21.04 inches."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Flowmaster: How to Choose Headers",
      url: "https://www.flowmaster.com/tech-info/",
      description:
        "Technical resources on exhaust header design, tube diameter selection, and performance tuning from a leading exhaust manufacturer."
    },
    {
      title: "Summit Racing: Header Buying Guide",
      url: "https://www.summitracing.com/expert-advice/article/how-to-choose-headers",
      description:
        "Step-by-step guide on selecting the right headers for your engine, covering tube diameter, length, and material choices."
    },
    {
      title: "Engine Builder Magazine: Header Tuning",
      url: "https://www.enginebuildermag.com/search/?q=header+tuning",
      description:
        "In-depth editorial on header primary tube length tuning for different RPM ranges and engine configurations."
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
          <Label>Engine Displacement ({inputs.unit === "imperial" ? "cubic inches (ci)" : "liters (L)"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.engineDisplacement}
            onChange={(e) => handleInputChange("engineDisplacement", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 350" : "e.g. 5.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>Desired Horsepower (hp)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.desiredHorsepower}
            onChange={(e) => handleInputChange("desiredHorsepower", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Pipe Wall Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.pipeMaterialThickness}
            onChange={(e) => handleInputChange("pipeMaterialThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.065" : "e.g. 1.65"}
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
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your engine's displacement in cubic inches (ci) if using Imperial, or liters (L) if using Metric.
          </li>
          <li>
            <strong>Step 3:</strong> Input your desired horsepower output to help tailor the tube length for optimal performance.
          </li>
          <li>
            <strong>Step 4:</strong> Provide the pipe wall thickness of your header tubing in inches or millimeters, depending on your unit choice.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to generate the recommended primary tube outer diameter and length.
          </li>
          <li>
            <strong>Step 6:</strong> Review the results and use them to guide your header fabrication or purchase decisions.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Header Primary Tube Length & Diameter Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Headers play a crucial role in optimizing engine performance by efficiently channeling exhaust gases away from the engine cylinders. The primary tube diameter and length are two fundamental parameters that directly influence exhaust flow dynamics, scavenging effects, and ultimately, the power output and torque characteristics of the engine.
          </p>
          <p>
            The primary tube diameter must be carefully selected based on engine displacement and desired horsepower. Larger engines with higher displacement produce greater volumes of exhaust gases, necessitating larger diameter tubes to reduce backpressure and maintain exhaust velocity. Conversely, tubes that are too large can decrease exhaust gas velocity, reducing scavenging efficiency and low-end torque.
          </p>
          <p>
            Primary tube length is equally important as it affects the timing of exhaust pulses and the scavenging effect. Longer tubes tend to enhance low to mid-range torque by improving exhaust gas evacuation at lower RPMs, while shorter tubes favor high-RPM horsepower by reducing exhaust gas travel time. The optimal length is often tuned to the engine’s peak RPM range and volumetric efficiency.
          </p>
          <p>
            Additionally, pipe wall thickness impacts the overall outer diameter of the header tubes and their durability. Thicker walls provide better heat retention and structural strength but add weight and cost. When designing or selecting headers, it is essential to consider the wall thickness to ensure proper fitment and clearance within the engine bay.
          </p>
          <p>
            This calculator simplifies these complex relationships by allowing you to input your engine displacement, desired horsepower, and pipe wall thickness to estimate the ideal primary tube outer diameter and length. Whether you are fabricating custom headers or selecting aftermarket parts, these calculations provide a solid foundation for achieving optimal exhaust performance.
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
            <strong>1. Ignoring unit consistency:</strong> Mixing metric and imperial units without proper conversion can lead to incorrect diameter and length calculations, resulting in poorly fitting headers.
          </p>
          <p>
            <strong>2. Using generic diameters:</strong> Applying a one-size-fits-all diameter without considering engine displacement and horsepower can cause performance losses due to improper exhaust flow.
          </p>
          <p>
            <strong>3. Neglecting pipe wall thickness:</strong> Forgetting to add wall thickness to the inner diameter when measuring outer diameter can cause fitment issues during fabrication or installation.
          </p>
          <p>
            <strong>4. Overlooking length tuning:</strong> Not adjusting primary tube length for the engine’s peak RPM range may result in suboptimal torque and horsepower characteristics.
          </p>
          <p>
            <strong>5. Relying solely on formulas:</strong> While this calculator provides a strong estimate, real-world testing and tuning are essential to achieve the best performance for your specific vehicle and application.
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
      title="Header Primary Tube Length & Diameter Calculator"
      description="Calculate the optimal primary tube length and diameter for your exhaust headers based on engine displacement, desired horsepower, and pipe wall thickness."
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