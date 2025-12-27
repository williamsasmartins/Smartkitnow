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

export default function WheelOffsetBackspacingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (mm) or imperial (inches)
    wheelWidth: "",
    wheelOffset: "",
    backspacing: "",
    waste: "0", // waste not typically used here but kept for consistency
    price: "",
    materialSize: "standard"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Wheel Offset (mm or inches) = Distance from wheel mounting surface to wheel centerline.
   * Backspacing (mm or inches) = Distance from mounting surface to back edge of the wheel.
   * Wheel Width (mm or inches) = Total width of the wheel.
   * 
   * Relationships:
   * Offset = (Wheel Width / 2) - Backspacing
   * Backspacing = (Wheel Width / 2) - Offset
   * Wheel Width = 2 * (Offset + Backspacing)
   * 
   * This calculator allows input of any two values to calculate the third.
   * If user inputs wheelWidth and offset, backspacing is calculated.
   * If user inputs wheelWidth and backspacing, offset is calculated.
   * If user inputs offset and backspacing, wheelWidth is calculated.
   * 
   * Units conversion: 
   * Metric inputs are in millimeters (mm).
   * Imperial inputs are in inches (in).
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.wheelWidth);
    const o = parseFloat(inputs.wheelOffset);
    const b = parseFloat(inputs.backspacing);
    const unit = inputs.unit;

    // Validate inputs - at least two must be provided
    const provided = [!isNaN(w), !isNaN(o), !isNaN(b)].filter(Boolean).length;
    if (provided < 2) {
      return {
        mainQty: "-",
        unitLabel: unit === "metric" ? "mm" : "in",
        cost: "-",
        details: "Please enter at least two values to calculate the third.",
        wasteInfo: ""
      };
    }

    let calcWheelWidth = w;
    let calcOffset = o;
    let calcBackspacing = b;

    // Calculate missing value
    if (isNaN(w)) {
      // Calculate wheel width
      calcWheelWidth = 2 * (o + b);
    } else if (isNaN(o)) {
      // Calculate offset
      calcOffset = (w / 2) - b;
    } else if (isNaN(b)) {
      // Calculate backspacing
      calcBackspacing = (w / 2) - o;
    }

    // Format results with 2 decimals
    const fmt = (num: number) => num.toFixed(2);

    // Cost estimation is not typical here, but we can show a placeholder or skip
    // We keep cost empty as this is a dimensional calculator, no material cost involved.
    return {
      mainQty: `${fmt(calcBackspacing)}`,
      unitLabel: unit === "metric" ? "mm" : "in",
      cost: "-",
      details: `Wheel Width: ${fmt(calcWheelWidth)} ${unit === "metric" ? "mm" : "in"}, Offset: ${fmt(calcOffset)} ${unit === "metric" ? "mm" : "in"}`,
      wasteInfo: "Note: Waste margin is not applicable for this calculation."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    { 
      question: "What is the difference between wheel offset and backspacing, and why is it important to calculate them accurately?", 
      answer: "Wheel offset is the distance from the wheel's mounting surface to its centerline, while backspacing measures from the mounting surface to the back edge of the wheel. Accurate calculation of these parameters is critical because they directly affect vehicle handling, suspension geometry, and clearance with brake components or fenders. Incorrect offset or backspacing can cause excessive tire wear, poor steering response, or even mechanical interference, compromising safety and performance. Precision ensures the wheel fits properly without causing stress on wheel bearings or suspension parts, maintaining structural integrity and ride quality."
    },
    { 
      question: "How does unit selection (metric vs imperial) impact the precision of wheel offset and backspacing calculations?", 
      answer: "Choosing between metric (millimeters) and imperial (inches) units affects the precision and ease of measurement. Metric units, being smaller and decimal-based, allow for finer granularity and are preferred in engineering contexts for accuracy. Imperial units, often fractional, can introduce rounding errors if not carefully converted. Using consistent units throughout the calculation prevents misinterpretation and ensures that the resulting offset or backspacing values maintain structural and functional integrity. Professionals often convert imperial measurements to metric for detailed analysis to leverage the higher resolution."
    },
    { 
      question: "Can wheel offset or backspacing affect vehicle safety and performance?", 
      answer: "Absolutely. Wheel offset and backspacing influence the track width and wheel positioning relative to suspension and body components. Incorrect offset can lead to poor handling characteristics such as understeer or oversteer, increased stress on suspension arms, and premature wear of wheel bearings. Backspacing that is too large or too small may cause the wheel to rub against the fender or suspension parts, risking damage or failure. Proper calculation and selection ensure optimal tire contact patch, balanced load distribution, and compliance with manufacturer specifications, all essential for maintaining vehicle safety and performance."
    },
    { 
      question: "What are common mistakes when measuring wheel offset and backspacing, and how can they be avoided?", 
      answer: "Common mistakes include measuring from incorrect reference points, using inconsistent units, or failing to account for wheel width variations. For example, measuring offset from the wheel face instead of the mounting surface leads to inaccurate results. Another error is neglecting to measure wheel width at the bead seat rather than the outer rim edge. To avoid these, always use precise tools like calipers, confirm unit consistency, and understand the definitions of offset and backspacing. Cross-checking measurements and consulting manufacturer specs further reduce errors, ensuring reliable calculations."
    },
    { 
      question: "How do environmental factors like temperature affect wheel offset and backspacing measurements?", 
      answer: "Environmental factors such as temperature can cause slight expansion or contraction of metal wheel components due to thermal expansion, potentially affecting precise measurements. While these dimensional changes are typically minimal, in high-precision applications or extreme climates, they can influence fitment and clearances. Measuring wheels at ambient temperature and allowing them to stabilize before taking readings ensures accuracy. Additionally, temperature fluctuations can affect tire pressure and suspension behavior, indirectly impacting the effective wheel positioning, so considering environmental conditions during installation is prudent."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    { title: "SAE International - Wheel and Rim Standards", description: "Technical standards defining wheel dimensions, offset, and backspacing for automotive applications." },
    { title: "Tire and Rim Association (TRA) Guidelines", description: "Industry guidelines for wheel fitment, safety, and performance considerations." },
    { title: "Automotive Engineering Fundamentals", description: "Comprehensive resource on vehicle dynamics and wheel-suspension interactions." }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
            <SelectTrigger className="w-[140px]"><Ruler className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
            <SelectContent>
               <SelectItem value="metric">Metric (mm)</SelectItem>
               <SelectItem value="imperial">Imperial (in)</SelectItem>
            </SelectContent>
         </Select>
      </div>

      {/* INPUTS FOR: Wheel Width, Offset, Backspacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="space-y-2">
            <Label>Wheel Width ({inputs.unit === "metric" ? "mm" : "in"})</Label>
            <Input 
              type="number" 
              placeholder="e.g. 200" 
              value={inputs.wheelWidth} 
              onChange={(e) => handleInputChange("wheelWidth", e.target.value)} 
              aria-label="Wheel Width"
            />
         </div>
         <div className="space-y-2">
            <Label>Wheel Offset ({inputs.unit === "metric" ? "mm" : "in"})</Label>
            <Input 
              type="number" 
              placeholder="e.g. 35" 
              value={inputs.wheelOffset} 
              onChange={(e) => handleInputChange("wheelOffset", e.target.value)} 
              aria-label="Wheel Offset"
            />
         </div>
         <div className="space-y-2">
            <Label>Backspacing ({inputs.unit === "metric" ? "mm" : "in"})</Label>
            <Input 
              type="number" 
              placeholder="e.g. 100" 
              value={inputs.backspacing} 
              onChange={(e) => handleInputChange("backspacing", e.target.value)} 
              aria-label="Backspacing"
            />
         </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
         <div className="flex justify-between">
            <Label>Waste Margin</Label>
            <span className="font-bold text-blue-600">{inputs.waste}%</span>
         </div>
         <Slider value={[parseInt(inputs.waste)]} min={0} max={25} step={5} onValueChange={(v) => handleInputChange("waste", v[0].toString())} disabled />
         <p className="text-xs text-slate-500 mt-1 italic">Waste margin is not applicable for this calculator.</p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
         <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
           <CardContent className="p-6 text-center">
              <span className="text-sm font-semibold text-slate-500 uppercase">Calculated Backspacing</span>
              <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span></div>
              <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
              <p className="text-xs text-slate-500 mt-2">{results.details}</p>
              <p className="text-xs text-slate-400 mt-1 italic">{results.wasteInfo}</p>
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
            <li><strong>Step 1: Choose Units:</strong> Select either Metric (millimeters) or Imperial (inches) depending on your measurement system.</li>
            <li><strong>Step 2: Enter Two Known Values:</strong> Input any two of the following: Wheel Width, Wheel Offset, or Backspacing. Leave the third blank for calculation.</li>
            <li><strong>Step 3: Calculate:</strong> Click the Calculate button to compute the missing value based on the standard relationship between these parameters.</li>
            <li><strong>Step 4: Review Results:</strong> The calculator will display the calculated value along with the other inputs for verification.</li>
         </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <BookOpen className="w-6 h-6 text-blue-500"/> Complete Guide to Wheel Offset/Backspacing Calculator
         </h2>
         <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Wheel offset and backspacing are fundamental measurements in wheel design and vehicle fitment engineering. Wheel offset refers to the distance between the wheel's mounting surface and its centerline, while backspacing measures from the mounting surface to the rear edge of the wheel. These parameters determine how the wheel sits relative to the suspension and fender, affecting vehicle handling, tire clearance, and overall safety. Precision in these measurements is critical to avoid mechanical interference, uneven tire wear, and compromised suspension geometry.
            </p>
            <p>
              The materials used in wheel manufacturing, typically aluminum alloys or steel, have specific dimensional tolerances and structural properties that influence offset and backspacing. Aluminum wheels, for example, offer lighter weight and can be manufactured with tighter tolerances, enhancing performance and fuel efficiency. Understanding these material characteristics alongside accurate measurements ensures the wheel maintains its structural integrity under load and during dynamic driving conditions. Additionally, proper calculation helps in selecting wheels compatible with brake calipers and suspension components, preventing costly modifications or failures.
            </p>
            <p>
              Economically, accurate calculation of wheel offset and backspacing prevents costly mistakes such as ordering incompatible wheels or requiring expensive adjustments. Overestimating dimensions can lead to purchasing wheels that do not fit, while underestimating can cause safety hazards and premature wear. Efficient fitment reduces installation time and avoids warranty claims or liability issues. This calculator streamlines the process by providing precise values based on your inputs, helping you make informed decisions that balance cost, safety, and performance.
            </p>
         </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
         <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5"/> Common Mistakes
         </h3>
         <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>1. Using Incorrect Reference Points:</strong> Measuring offset or backspacing from the wrong surface, such as the wheel face instead of the mounting surface, leads to inaccurate results and improper fitment.</p>
            <p><strong>2. Mixing Units:</strong> Switching between metric and imperial units without proper conversion causes calculation errors and can compromise safety due to incorrect wheel positioning.</p>
            <p><strong>3. Ignoring Wheel Width Variations:</strong> Measuring wheel width at the outer rim instead of the bead seat can distort offset and backspacing calculations, affecting clearance and handling.</p>
            <p><strong>4. Overlooking Manufacturer Specifications:</strong> Not consulting OEM or aftermarket wheel specifications can result in incompatible wheel fitment and void warranties.</p>
         </div>
      </section>

      {/* 4. FAQ (FULL TEXT) */}
      <section id="faq">
         <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
         <div className="space-y-6">
            {faqs.map((faq, i) => (
               <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                     {faq.answer}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <BookOpen className="w-5 h-5 text-blue-500"/> References & additional resources
         </h2>
         <div className="space-y-4">
            {references.map((ref, i) => (
               <div key={i}>
                  <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                     {ref.title} <ExternalLink className="w-3 h-3"/>
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                     {ref.description}
                  </p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Wheel Offset/Backspacing Calculator"
      description="Calculate Wheel Offset and Backspacing with precision. Expert guide on measurement, fitment, installation tips, and vehicle safety."
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
      showTopBanner showSidebar showBottomBanner
    />
  );
}