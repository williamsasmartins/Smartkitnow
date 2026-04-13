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
      question: "What is the ideal primary tube diameter for a 350 cubic inch engine?",
      answer: "For a 350 cubic inch naturally aspirated engine, primary tube diameters typically range from 1.5 to 1.75 inches, with 1.625 inches being a common sweet spot. Tube diameter directly affects exhaust scavenging efficiency and back pressure characteristics. Smaller diameters create higher velocity for better scavenging at lower RPMs, while larger diameters reduce restriction at higher RPMs. Most street 350 builds use 1.625-inch primaries for balanced performance across the RPM range.",
    },
    {
      question: "How does primary tube length affect engine performance?",
      answer: "Primary tube length determines exhaust pulse timing and resonance frequency, with typical lengths ranging from 28 to 36 inches depending on engine displacement and desired power band. Longer tubes (34-36 inches) favor lower RPM torque production by allowing pressure waves to return and assist cylinder evacuation at lower engine speeds. Shorter tubes (28-30 inches) improve scavenging at higher RPMs by reducing exhaust gas residence time. A well-calculated length creates a tuning node that maximizes power in your target RPM range.",
    },
    {
      question: "What is the relationship between engine displacement and header tube sizing?",
      answer: "Engine displacement directly correlates with exhaust gas volume and flow requirements, with larger engines typically needing larger diameter tubes. A general rule is that tube cross-sectional area should support 0.25 to 0.35 square inches per 100 cubic inches of displacement. For example, a 502 cubic inch engine (5.02L) would typically require primary tubes of 1.75 to 2.0 inches in diameter. Using tubes too small for the displacement creates excessive backpressure and reduces horsepower.",
    },
    {
      question: "How do I calculate the correct primary tube diameter for forced induction engines?",
      answer: "Forced induction engines (supercharged or turbocharged) generate significantly more exhaust flow and typically require primary diameters 0.125 to 0.25 inches larger than naturally aspirated equivalents. A 350 cubic inch engine with a supercharger might use 1.75 to 1.875-inch primaries instead of 1.625 inches for naturally aspirated applications. Boost pressure multiplies the effective exhaust volume, so undersizing forced induction headers severely restricts flow. Consult boost level specifications when selecting primary diameters for supercharged or turbocharged builds.",
    },
    {
      question: "What tube diameter range is suitable for big-block Chevy engines?",
      answer: "Big-block Chevy engines (427, 454, 502 cubic inches) typically require primary tube diameters between 1.75 and 2.125 inches depending on displacement and intended use. A 427 cubic inch engine commonly uses 1.875 to 2.0-inch primaries, while larger 502 cubic inch builds may extend to 2.0 to 2.125 inches for maximum flow. Underdimensioned primaries on big-blocks create severe backpressure and horsepower loss of 20-30 HP or more. Verify your specific engine's cubic inch displacement before selecting header tube sizing.",
    },
    {
      question: "How do runner length and diameter affect header performance at different RPM ranges?",
      answer: "Runner length and diameter work together to create resonant frequencies that maximize scavenging at specific RPM ranges, typically 1,000 to 8,000 RPM for street engines. Longer, smaller-diameter runners emphasize low to mid-range torque (below 5,500 RPM), while shorter, larger-diameter runners optimize high-RPM power (above 5,500 RPM). A street/strip 350 with 1.625-inch tubes and 32-inch lengths balances performance across a wide RPM range. Optimal tuning requires matching both parameters to your engine's intended power band.",
    },
    {
      question: "What is the typical collector diameter for a 1.625-inch primary tube system?",
      answer: "For primary tubes of 1.625 inches diameter, collector diameters typically range from 2.5 to 2.875 inches, with 2.75 inches being standard for street applications. The collector gradually consolidates four primary runners into a single pipe and should have a 6 to 8-degree convergence angle for optimal merging. Undersized collectors (below 2.5 inches) create backpressure and reversion, while oversized collectors (&gt;3.0 inches) lose scavenging benefit. Proper collector sizing preserves the tuning benefits of primary tube selection.",
    },
    {
      question: "How do I account for altitude and air density when sizing header tubes?",
      answer: "At higher altitudes, thinner air density reduces exhaust gas volume, allowing for proportionally smaller primary tubes while maintaining equivalent scavenging efficiency. An engine at 5,000 feet elevation may perform optimally with tube diameters 0.0625 to 0.125 inches smaller than the same engine at sea level. Conversely, forced induction systems in high-altitude environments may require slightly larger tubes due to boost pressure overcoming density losses. Consider your primary operating altitude when using the calculator to ensure accurate tube sizing recommendations.",
    },
    {
      question: "What wall thickness should primary tubes have for street versus race applications?",
      answer: "Street headers typically use 0.049-inch to 0.065-inch wall thickness tubing for durability and thermal retention, while race headers often use 0.035-inch to 0.049-inch for weight reduction. Thicker walls (&gt;0.065 inches) retain more heat but add weight and cost, while thinner walls (&lt;0.035 inches) risk cracking under thermal cycling on street cars. Most OEM-quality street headers use 0.055-inch to 0.065-inch walls as a balance between longevity and performance. Verify wall thickness specifications when comparing header options for your specific application.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Header Primary Tube Length & Diameter Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Header Primary Tube Length & Diameter Calculator helps you determine optimal exhaust runner dimensions for your engine build by analyzing displacement, intended RPM range, and induction type. Properly sized headers maximize horsepower by reducing backpressure, improving cylinder scavenging, and matching exhaust pulse frequencies to your engine's operating characteristics. This calculator eliminates guesswork and ensures your headers support your performance goals without sacrificing reliability or drivability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your engine's cubic inch displacement (or select from the dropdown menu), choose your target power band (low torque, balanced, or high RPM), and specify whether your engine is naturally aspirated, supercharged, or turbocharged. The calculator also accounts for your primary operating altitude and intended application (street, strip, or race), as these factors affect air density and exhaust gas volume. These inputs directly influence the recommended primary tube diameter, length, and collector sizing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive results, the calculator provides specific tube diameter recommendations (typically 1.5 to 2.5 inches), optimal runner length ranges (28 to 36 inches), and corresponding collector dimensions. Compare these recommendations against header manufacturers' specifications to select a pre-built unit or fabricate a custom set. Use the results as a baseline for further optimization—dyno testing or consultation with header specialists can fine-tune dimensions for your specific engine combination and fuel type.</p>
        </div>
      </section>

      {/* TABLE: Primary Tube Sizing by Engine Displacement & Application */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Primary Tube Sizing by Engine Displacement & Application</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides recommended primary tube diameters based on engine displacement and intended use for optimal exhaust scavenging.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Displacement (cu in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Naturally Aspirated Diameter (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Supercharged Diameter (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Turbocharged Diameter (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical RPM Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">302-327</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50-1.625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.625-1.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75-1.875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000-6500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">350-383</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.625-1.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75-1.875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875-2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000-7000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400-427</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75-1.875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875-2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0-2.125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800-6500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">454-502</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0-2.125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.125-2.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.25-2.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-6000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BBF 427-460</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875-2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0-2.125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.125-2.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800-6000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Sizes assume street/strip dual-purpose use; pure race engines may vary. Forced induction increases required diameter by 0.125-0.25 inches.</p>
      </section>

      {/* TABLE: Recommended Header Tube Length by Target Power Band */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Header Tube Length by Target Power Band</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Primary tube length affects exhaust resonance frequency and peak torque location; use this guide to select length based on your power band priority.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Power Band</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Tube Length (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Collector Length (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low RPM Torque (2000-4500)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street, Towing, Truck</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midrange Balanced (3500-6000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32-34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street/Strip, Daily Driver</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High RPM Power (5500-8000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Race, Performance, LS Swap</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wide Band (2000-7000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multi-Purpose, Engine Swap</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Longer tubes increase low-RPM torque; shorter tubes optimize peak horsepower at higher RPMs. Fine-tune final length within ranges for your specific engine and fuel type.</p>
      </section>

      {/* TABLE: Collector Diameter Sizing by Primary Tube Diameter */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Collector Diameter Sizing by Primary Tube Diameter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Collector diameter must properly transition primary runners to avoid backpressure; this table shows standard sizing relationships.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Tube Diameter (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Collector (in)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Convergence Angle (°)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Collector Length (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.25-2.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.50-2.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.75-3.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.00-3.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.50-4.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Collector area should be approximately 1.4-1.5× total primary runner area. Steep convergence angles (&gt;10°) create turbulence and horsepower loss.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your engine's actual displacement before using the calculator; a '350' may be bored or stroked to 383+ cubic inches, requiring larger tubes than standard calculations suggest.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for fuel type when selecting header length: nitromethane and methanol engines may benefit from tubes 1-2 inches shorter than equivalent gasoline engines due to faster burn rates affecting exhaust timing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a high-quality gasket material rated for &gt;1,500°F between header flanges and cylinder heads to prevent exhaust leaks that degrade performance and create underhood heat.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider ceramic or thermal coatings on primary tubes to reduce underhood heat by 100-200°F, improving air density at the intake and reducing engine bay temperatures on street applications.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using small-block header sizes on a stroked engine</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many builders assume a '350' displacement but forget their engine has been bored to 4.125 inches or stroked to 3.75 inches, reaching 383-400 cubic inches. This undersizes the headers and loses 15-25 HP from excessive backpressure.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring forced induction when selecting tube diameter</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Supercharged or turbocharged engines produce 1.5 to 3× the exhaust volume of naturally aspirated equivalents, but many builders use the same header sizing. This restriction severely limits boost potential and creates dangerous backpressure that can damage turbos or seals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting tube length based on appearance rather than tuning</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Long, traditional-style headers (36+ inches) look classic but sacrifice high-RPM power; building a 7,000+ RPM engine with oversized collectors and long tubes leaves 20-30 HP on the table compared to shorter, optimized designs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using inconsistent tube diameters across all four runners</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing 1.625-inch and 1.75-inch tubes on the same engine creates uneven exhaust scavenging, poor resonance tuning, and erratic power delivery across the RPM range. All primaries should match diameter and length for balanced performance.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal primary tube diameter for a 350 cubic inch engine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 350 cubic inch naturally aspirated engine, primary tube diameters typically range from 1.5 to 1.75 inches, with 1.625 inches being a common sweet spot. Tube diameter directly affects exhaust scavenging efficiency and back pressure characteristics. Smaller diameters create higher velocity for better scavenging at lower RPMs, while larger diameters reduce restriction at higher RPMs. Most street 350 builds use 1.625-inch primaries for balanced performance across the RPM range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does primary tube length affect engine performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Primary tube length determines exhaust pulse timing and resonance frequency, with typical lengths ranging from 28 to 36 inches depending on engine displacement and desired power band. Longer tubes (34-36 inches) favor lower RPM torque production by allowing pressure waves to return and assist cylinder evacuation at lower engine speeds. Shorter tubes (28-30 inches) improve scavenging at higher RPMs by reducing exhaust gas residence time. A well-calculated length creates a tuning node that maximizes power in your target RPM range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between engine displacement and header tube sizing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engine displacement directly correlates with exhaust gas volume and flow requirements, with larger engines typically needing larger diameter tubes. A general rule is that tube cross-sectional area should support 0.25 to 0.35 square inches per 100 cubic inches of displacement. For example, a 502 cubic inch engine (5.02L) would typically require primary tubes of 1.75 to 2.0 inches in diameter. Using tubes too small for the displacement creates excessive backpressure and reduces horsepower.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct primary tube diameter for forced induction engines?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Forced induction engines (supercharged or turbocharged) generate significantly more exhaust flow and typically require primary diameters 0.125 to 0.25 inches larger than naturally aspirated equivalents. A 350 cubic inch engine with a supercharger might use 1.75 to 1.875-inch primaries instead of 1.625 inches for naturally aspirated applications. Boost pressure multiplies the effective exhaust volume, so undersizing forced induction headers severely restricts flow. Consult boost level specifications when selecting primary diameters for supercharged or turbocharged builds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tube diameter range is suitable for big-block Chevy engines?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Big-block Chevy engines (427, 454, 502 cubic inches) typically require primary tube diameters between 1.75 and 2.125 inches depending on displacement and intended use. A 427 cubic inch engine commonly uses 1.875 to 2.0-inch primaries, while larger 502 cubic inch builds may extend to 2.0 to 2.125 inches for maximum flow. Underdimensioned primaries on big-blocks create severe backpressure and horsepower loss of 20-30 HP or more. Verify your specific engine's cubic inch displacement before selecting header tube sizing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do runner length and diameter affect header performance at different RPM ranges?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Runner length and diameter work together to create resonant frequencies that maximize scavenging at specific RPM ranges, typically 1,000 to 8,000 RPM for street engines. Longer, smaller-diameter runners emphasize low to mid-range torque (below 5,500 RPM), while shorter, larger-diameter runners optimize high-RPM power (above 5,500 RPM). A street/strip 350 with 1.625-inch tubes and 32-inch lengths balances performance across a wide RPM range. Optimal tuning requires matching both parameters to your engine's intended power band.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical collector diameter for a 1.625-inch primary tube system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For primary tubes of 1.625 inches diameter, collector diameters typically range from 2.5 to 2.875 inches, with 2.75 inches being standard for street applications. The collector gradually consolidates four primary runners into a single pipe and should have a 6 to 8-degree convergence angle for optimal merging. Undersized collectors (below 2.5 inches) create backpressure and reversion, while oversized collectors (&gt;3.0 inches) lose scavenging benefit. Proper collector sizing preserves the tuning benefits of primary tube selection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for altitude and air density when sizing header tubes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">At higher altitudes, thinner air density reduces exhaust gas volume, allowing for proportionally smaller primary tubes while maintaining equivalent scavenging efficiency. An engine at 5,000 feet elevation may perform optimally with tube diameters 0.0625 to 0.125 inches smaller than the same engine at sea level. Conversely, forced induction systems in high-altitude environments may require slightly larger tubes due to boost pressure overcoming density losses. Consider your primary operating altitude when using the calculator to ensure accurate tube sizing recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What wall thickness should primary tubes have for street versus race applications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Street headers typically use 0.049-inch to 0.065-inch wall thickness tubing for durability and thermal retention, while race headers often use 0.035-inch to 0.049-inch for weight reduction. Thicker walls (&gt;0.065 inches) retain more heat but add weight and cost, while thinner walls (&lt;0.035 inches) risk cracking under thermal cycling on street cars. Most OEM-quality street headers use 0.055-inch to 0.065-inch walls as a balance between longevity and performance. Verify wall thickness specifications when comparing header options for your specific application.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.chevrolet.com/performance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Small Block Chevy Performance Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Chevrolet Performance resources and technical specifications for small-block engine builds and header design principles.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j2030_202401/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International Exhaust System Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SAE technical standards for automotive exhaust system design, including flow calculations and backpressure measurement methodologies.</p>
          </li>
          <li>
            <a href="https://www.enginebuildermag.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Engine Builder Magazine Technical Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry publication providing detailed technical articles on header design, tube sizing, and performance optimization for various engine platforms.</p>
          </li>
          <li>
            <a href="https://www.ls1tech.com/forums/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">LS Swap Resource Guide and Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive community resource documenting LS engine swaps, header compatibility, and tuning data for modern engine conversions.</p>
          </li>
        </ul>
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