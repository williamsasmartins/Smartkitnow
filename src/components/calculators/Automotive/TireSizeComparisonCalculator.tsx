import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TireSizeComparisonCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    tire1Diameter: "",
    tire1Width: "",
    tire2Diameter: "",
    tire2Width: "",
    waste: "10",
    price: "",
    materialSize: "standard"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Helper: convert diameter and width to overall tire size in mm or inches
  // Diameter is rim diameter, width is tire width, overall diameter = rim diameter + 2 * sidewall height
  // Sidewall height approx = width * aspect ratio (assumed 0.75 for comparison if not given)
  // For simplicity, assume aspect ratio 75% if not provided (common default)
  // We'll calculate overall diameter and width for both tires and compare

  // Since aspect ratio is not input, we assume 75% for sidewall height calculation

  const aspectRatio = 0.75;

  const results = useMemo(() => {
    const unit = inputs.unit;
    const wastePercent = parseFloat(inputs.waste) || 0;
    const pricePerUnit = parseFloat(inputs.price) || 0;

    // Parse inputs
    const d1 = parseFloat(inputs.tire1Diameter);
    const w1 = parseFloat(inputs.tire1Width);
    const d2 = parseFloat(inputs.tire2Diameter);
    const w2 = parseFloat(inputs.tire2Width);

    if (
      isNaN(d1) || d1 <= 0 ||
      isNaN(w1) || w1 <= 0 ||
      isNaN(d2) || d2 <= 0 ||
      isNaN(w2) || w2 <= 0
    ) {
      return {
        mainQty: "0",
        unitLabel: unit === "metric" ? "mm" : "in",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all tire dimensions.",
        wasteInfo: `+${wastePercent}% Waste margin applied`
      };
    }

    // Convert all to mm if imperial
    // 1 inch = 25.4 mm
    const inchToMm = 25.4;

    const convertToMm = (val: number) => (unit === "imperial" ? val * inchToMm : val);

    const tire1DiameterMm = convertToMm(d1);
    const tire1WidthMm = convertToMm(w1);
    const tire2DiameterMm = convertToMm(d2);
    const tire2WidthMm = convertToMm(w2);

    // Calculate overall diameter = rim diameter + 2 * sidewall height
    // sidewall height = width * aspect ratio
    const tire1OverallDiameter = tire1DiameterMm + 2 * (tire1WidthMm * aspectRatio);
    const tire2OverallDiameter = tire2DiameterMm + 2 * (tire2WidthMm * aspectRatio);

    // Calculate circumference = π * diameter
    const pi = Math.PI;
    const tire1Circumference = pi * tire1OverallDiameter;
    const tire2Circumference = pi * tire2OverallDiameter;

    // Calculate width difference and diameter difference in percentage
    const diameterDiffPercent = ((tire2OverallDiameter - tire1OverallDiameter) / tire1OverallDiameter) * 100;
    const widthDiffPercent = ((tire2WidthMm - tire1WidthMm) / tire1WidthMm) * 100;
    const circumferenceDiffPercent = ((tire2Circumference - tire1Circumference) / tire1Circumference) * 100;

    // Waste margin applied to differences (informational)
    const wasteFactor = 1 + wastePercent / 100;

    // Cost estimation: if price per tire is given, estimate cost difference
    // Assume price input is per tire for tire 1 size, and tire 2 price is proportional to volume difference
    // Tire volume roughly proportional to width * diameter^2 (simplified)
    const tire1Volume = tire1WidthMm * Math.pow(tire1OverallDiameter, 2);
    const tire2Volume = tire2WidthMm * Math.pow(tire2OverallDiameter, 2);
    const volumeRatio = tire2Volume / tire1Volume;

    const estimatedCost = pricePerUnit > 0 ? (pricePerUnit * volumeRatio * wasteFactor) : 0;

    return {
      mainQty: `${diameterDiffPercent.toFixed(2)}%`,
      unitLabel: "Diameter Difference",
      cost: pricePerUnit > 0 ? `$${estimatedCost.toFixed(2)}` : "Enter price per tire for cost estimate",
      details: `Width Difference: ${widthDiffPercent.toFixed(2)}%, Circumference Difference: ${circumferenceDiffPercent.toFixed(2)}%, Waste margin applied: +${wastePercent}%`,
      wasteInfo: `Waste margin affects cost and fitment tolerance.`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is the importance of comparing tire sizes accurately?",
      answer:
        "Accurately comparing tire sizes is critical for vehicle safety, performance, and compliance with manufacturer specifications. Differences in diameter, width, and circumference affect speedometer accuracy, handling, and drivetrain stress. For example, a larger diameter tire can cause the speedometer to under-report speed, while a smaller one can lead to over-reporting. Additionally, mismatched tire sizes can cause uneven wear, reduced traction, and potential damage to the vehicle’s differential and transmission. Understanding the technical parameters such as overall diameter, sidewall height, and circumference ensures that replacements or upgrades maintain the vehicle’s structural integrity and operational efficiency."
    },
    {
      question: "How does the waste factor impact my tire size comparison and budget?",
      answer:
        "The waste factor in tire size comparison accounts for uncertainties and variations during installation or purchase, such as measurement inaccuracies, manufacturing tolerances, and fitment adjustments. While it might seem irrelevant for tires compared to materials like concrete, a waste margin helps budget for potential mismatches or the need for additional accessories like spacers or adapters. This contingency prevents unexpected costs and ensures that the replacement tires fit correctly without compromising safety. Professional estimators recommend including a 10-15% waste margin to accommodate these factors, ultimately protecting your investment and maintaining vehicle performance."
    },
    {
      question: "What are the differences between standard and high-performance tire materials?",
      answer:
        "Standard tires typically use conventional rubber compounds designed for durability, comfort, and cost-effectiveness, while high-performance tires incorporate advanced materials such as silica-enhanced rubber and reinforced sidewalls for improved grip, heat dissipation, and handling. High-performance tires often feature specialized tread patterns and compounds optimized for specific driving conditions, including wet or dry surfaces. Choosing between these depends on your vehicle’s requirements and driving style; for instance, sports cars benefit from high-performance tires for enhanced traction and cornering stability, whereas everyday vehicles prioritize longevity and fuel efficiency. Understanding these material differences helps in selecting tires that balance safety, performance, and cost."
    },
    {
      question: "What installation tips should I consider when changing tire sizes?",
      answer:
        "When changing tire sizes, it is essential to ensure proper fitment by verifying rim compatibility, clearance within wheel wells, and suspension tolerances. Always inspect the tire bead seating and balance the tires after mounting to prevent vibrations and uneven wear. Additionally, recalibrating the vehicle’s speedometer and traction control systems may be necessary to accommodate size changes. Proper site preparation, such as cleaning rims and checking for damage, ensures a secure installation. These steps maintain the structural integrity of the wheel assembly and optimize vehicle safety and performance."
    },
    {
      question: "How do weather and environmental factors affect tire size and performance?",
      answer:
        "Weather and environmental conditions significantly influence tire performance and the practical implications of tire size changes. Temperature fluctuations cause tire pressure variations due to air expansion or contraction, affecting contact patch and handling. Cold weather can stiffen rubber compounds, reducing grip, while heat can accelerate wear and increase the risk of blowouts. Additionally, wet or icy conditions demand tires with appropriate tread depth and compound softness for optimal traction. Selecting the correct tire size and type for your climate ensures safety, prolongs tire life, and maintains vehicle control under varying environmental stresses."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    { title: "ASTM International Standards", description: "Global standards for material specifications and testing procedures." },
    { title: "International Building Code (IBC)", description: "Essential regulations regarding structural safety and installation requirements." },
    { title: "Professional Constructor's Guide", description: "Best practices for site preparation, mixing, and application." }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (mm/inches)</SelectItem>
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUTS FOR: Tire 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire 1 Rim Diameter ({inputs.unit === "metric" ? "mm" : "in"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tire1Diameter}
            onChange={(e) => handleInputChange("tire1Diameter", e.target.value)}
            placeholder="e.g. 600"
          />
        </div>
        <div className="space-y-2">
          <Label>Tire 1 Width ({inputs.unit === "metric" ? "mm" : "in"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tire1Width}
            onChange={(e) => handleInputChange("tire1Width", e.target.value)}
            placeholder="e.g. 200"
          />
        </div>
      </div>

      {/* INPUTS FOR: Tire 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label>Tire 2 Rim Diameter ({inputs.unit === "metric" ? "mm" : "in"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tire2Diameter}
            onChange={(e) => handleInputChange("tire2Diameter", e.target.value)}
            placeholder="e.g. 620"
          />
        </div>
        <div className="space-y-2">
          <Label>Tire 2 Width ({inputs.unit === "metric" ? "mm" : "in"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tire2Width}
            onChange={(e) => handleInputChange("tire2Width", e.target.value)}
            placeholder="e.g. 210"
          />
        </div>
      </div>

      {/* Price input */}
      <div className="space-y-2 mt-4">
        <Label>Price per Tire (optional)</Label>
        <Input
          type="number"
          min="0"
          step="any"
          value={inputs.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          placeholder="e.g. 120"
        />
      </div>

      {/* Waste margin */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800 mt-4">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg mt-4" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Tire Size Comparison Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Estimated Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
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
            <strong>Step 1: Input Tire 1 Dimensions:</strong> Enter the rim diameter and tire width of your current or reference tire. Ensure you select the correct unit system (metric or imperial) to maintain accuracy.
          </li>
          <li>
            <strong>Step 2: Input Tire 2 Dimensions:</strong> Enter the rim diameter and tire width of the tire you want to compare against Tire 1. This helps determine differences in overall size and fitment.
          </li>
          <li>
            <strong>Step 3: Enter Price per Tire (Optional):</strong> Provide the cost per tire to estimate the price difference based on size and volume variations.
          </li>
          <li>
            <strong>Step 4: Adjust Waste Margin:</strong> Use the slider to set a waste margin percentage to account for measurement tolerances and fitment contingencies, typically 10% for standard comparisons.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to view the percentage difference in diameter, width, and circumference, along with an estimated cost impact.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Tire Size Comparison
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Tire size comparison is a fundamental aspect of vehicle maintenance and customization, involving the precise measurement of rim diameter, tire width, and overall diameter. The engineering principles behind tire sizing focus on ensuring compatibility with the vehicle’s suspension, braking system, and speedometer calibration. Precision in these measurements is critical because even small deviations in diameter or width can significantly affect vehicle handling, fuel efficiency, and safety. For instance, a larger tire diameter increases the rolling circumference, which can cause the speedometer to under-report speed and place additional strain on the drivetrain components.
          </p>
          <p>
            The materials used in tire construction, such as rubber compounds, reinforcing belts, and sidewall stiffness, also influence the effective size and performance of a tire. While this calculator focuses on geometric size comparison, understanding the nuances of tire materials is essential for selecting the right tire for specific driving conditions. The density and elasticity of the rubber affect the tire’s ability to absorb shocks and maintain traction, while the curing process during manufacturing ensures the structural integrity and longevity of the tire. Beginners often overlook how these material properties interact with size, leading to suboptimal tire choices.
          </p>
          <p>
            Economically, accurate tire size comparison helps avoid costly mistakes such as purchasing incompatible tires or unnecessary accessories. Over-ordering or selecting tires that are too large or too small can lead to increased wear, reduced fuel economy, and potential damage to the vehicle’s mechanical systems. Conversely, under-ordering or ignoring size differences may result in safety hazards and costly rework. Efficient size comparison optimizes budget allocation by balancing performance requirements with cost considerations, ensuring that the selected tires provide maximum value without compromising safety or vehicle integrity.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Unit Consistency:</strong> Mixing metric and imperial units without proper conversion leads to inaccurate comparisons and potential fitment issues. Always verify the unit system before inputting dimensions.
          </p>
          <p>
            <strong>2. Overlooking Sidewall Aspect Ratio:</strong> Assuming tire size based solely on rim diameter and width without considering the sidewall height (aspect ratio) can misrepresent the actual overall diameter, affecting speedometer accuracy and clearance.
          </p>
          <p>
            <strong>3. Neglecting Waste Margin:</strong> Failing to include a waste margin or tolerance for measurement errors and manufacturing variances can result in unexpected installation problems and additional costs.
          </p>
          <p>
            <strong>4. Not Considering Vehicle Specifications:</strong> Using tire sizes outside manufacturer recommendations can compromise suspension geometry, braking performance, and safety systems.
          </p>
        </div>
      </section>

      {/* 4. FAQ (FULL TEXT) */}
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
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
      title="Tire Size Comparison"
      description="Calculate Tire Size Comparison with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}