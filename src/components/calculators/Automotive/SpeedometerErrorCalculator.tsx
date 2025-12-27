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

export default function SpeedometerErrorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    actualDistance: "",
    indicatedDistance: "",
    waste: "10",
    pricePerUnit: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const actual = parseFloat(inputs.actualDistance);
    const indicated = parseFloat(inputs.indicatedDistance);
    const wastePercent = parseFloat(inputs.waste);
    const price = parseFloat(inputs.pricePerUnit);

    if (
      isNaN(actual) ||
      isNaN(indicated) ||
      actual <= 0 ||
      indicated <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25
    ) {
      return {
        mainQty: "0",
        unitLabel: "Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for distances and waste margin.",
      };
    }

    // Speedometer Error Calculation:
    // Error (%) = ((Indicated Distance - Actual Distance) / Actual Distance) * 100
    const errorPercent = ((indicated - actual) / actual) * 100;

    // Adjusted distance including waste margin
    const adjustedDistance = indicated * (1 + wastePercent / 100);

    // Cost calculation if price per unit is provided
    const totalCost = price && price > 0 ? adjustedDistance * price : 0;

    return {
      mainQty: adjustedDistance.toFixed(2),
      unitLabel: inputs.unit === "metric" ? "km" : "miles",
      cost: totalCost > 0 ? `$${totalCost.toFixed(2)}` : "N/A",
      details: `Speedometer Error: ${errorPercent.toFixed(2)}%. Adjusted distance with waste margin: ${adjustedDistance.toFixed(
        2
      )} ${inputs.unit === "metric" ? "km" : "miles"}.`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is Speedometer Error and why does it occur?",
      answer:
        "Speedometer error refers to the discrepancy between the distance indicated by a vehicle's speedometer and the actual distance traveled. This error arises due to factors such as tire wear, tire pressure variations, wheel size changes, and calibration inaccuracies. Understanding this error is critical for applications requiring precise distance measurements, such as vehicle diagnostics, navigation, and legal speed enforcement. Engineers analyze speedometer error to ensure compliance with safety standards and to maintain vehicle performance integrity.",
    },
    {
      question: "How does the waste factor impact my speedometer error calculations?",
      answer:
        "The waste factor in speedometer error calculations accounts for uncertainties and variations in measurement conditions, such as road surface irregularities, tire slippage, and environmental influences. Including a waste margin ensures that estimations are conservative, preventing underestimation of actual distances or errors. This buffer is essential for budgeting calibration adjustments or compensating for unexpected deviations during testing. Professional assessments typically include a 10-15% waste margin to maintain accuracy and reliability.",
    },
    {
      question: "What materials or tools are needed to accurately measure speedometer error?",
      answer:
        "Accurate measurement of speedometer error requires precise distance measurement tools such as calibrated GPS devices, measuring wheels, or certified odometers. Additionally, environmental conditions must be controlled or accounted for, as temperature and tire pressure can affect readings. Using standardized test tracks or known distance markers enhances measurement reliability. Proper calibration of measurement instruments is essential to maintain the structural integrity of the data and to ensure compliance with engineering standards.",
    },
    {
      question: "What are some installation tips for minimizing speedometer error?",
      answer:
        "To minimize speedometer error, ensure that tires are inflated to manufacturer-recommended pressures and are of the correct size and type. Regularly calibrate the vehicle’s speedometer system using certified equipment and standardized procedures. Site preparation, such as selecting flat and consistent test surfaces, reduces measurement variability. Additionally, avoid modifications that alter wheel circumference without recalibrating the speedometer, as these can introduce significant errors.",
    },
    {
      question: "How do weather and environmental factors affect speedometer error?",
      answer:
        "Weather conditions such as rain, snow, or extreme temperatures can influence tire traction and pressure, leading to variations in wheel rotation and thus speedometer readings. Cold weather can reduce tire pressure, increasing rolling resistance and causing underestimation of distance. Conversely, hot weather may increase tire pressure, affecting circumference and speedometer accuracy. Environmental factors like road surface texture and slope also impact measurement precision, necessitating adjustments or compensations during error calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "ASTM International Standards",
      description: "Global standards for material specifications and testing procedures.",
      url: "https://www.astm.org/",
    },
    {
      title: "International Building Code (IBC)",
      description: "Essential regulations regarding structural safety and installation requirements.",
      url: "https://codes.iccsafe.org/content/IBC2021",
    },
    {
      title: "Professional Constructor's Guide",
      description: "Best practices for site preparation, mixing, and application.",
      url: "https://www.constructconnect.com/blog/professional-constructor-guide",
    },
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
            <SelectItem value="metric">Metric (km)</SelectItem>
            <SelectItem value="imperial">Imperial (miles)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUTS FOR SPEEDOMETER ERROR CALCULATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Actual Distance Travelled ({inputs.unit === "metric" ? "km" : "miles"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.actualDistance}
            onChange={(e) => handleInputChange("actualDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Indicated Distance on Speedometer ({inputs.unit === "metric" ? "km" : "miles"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 105"
            value={inputs.indicatedDistance}
            onChange={(e) => handleInputChange("indicatedDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Unit Distance ({inputs.unit === "metric" ? "per km" : "per mile"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Optional"
            value={inputs.pricePerUnit}
            onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Distance with Waste</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
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
            <strong>Step 1: Input Actual Distance:</strong> Enter the true distance traveled, measured using a reliable method such as GPS or a certified measuring wheel. Ensure units match your selection (km or miles).
          </li>
          <li>
            <strong>Step 2: Input Indicated Distance:</strong> Enter the distance shown on your vehicle’s speedometer for the same trip. This value is typically higher or lower than the actual distance due to calibration errors.
          </li>
          <li>
            <strong>Step 3: Adjust Waste Margin:</strong> Use the slider to add a waste margin percentage. This accounts for measurement uncertainties and environmental factors affecting accuracy.
          </li>
          <li>
            <strong>Step 4: Optional Price Input:</strong> Enter the cost per unit distance if you want to estimate the financial impact of speedometer error corrections or calibrations.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to view the speedometer error percentage, adjusted distance including waste, and estimated cost if applicable.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Speedometer Error
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Speedometer error is a critical parameter in automotive engineering that quantifies the difference between the distance a vehicle’s speedometer indicates and the actual distance traveled. This discrepancy arises from multiple engineering factors including tire circumference variations, wheel slip, calibration offsets, and environmental influences. Precision in calculating speedometer error is essential for vehicle safety, regulatory compliance, and accurate navigation. Engineers rely on standardized measurement techniques and error analysis to ensure that speedometers provide reliable data, which is vital for speed enforcement and fuel efficiency calculations.
          </p>
          <p>
            Measuring speedometer error involves using precise instruments such as GPS devices, calibrated odometers, or measuring wheels. The materials and tools used must maintain structural integrity and calibration accuracy to avoid compounding errors. Factors like tire wear, inflation pressure, and temperature affect the effective rolling radius of tires, which in turn influences speedometer readings. Understanding these material and environmental nuances allows technicians to apply corrections or recalibrations that maintain the vehicle’s performance and safety standards.
          </p>
          <p>
            Economically, accurate speedometer error calculation prevents costly overcorrections or underestimations. Over-ordering calibration services or replacement parts due to inaccurate error assessments can inflate budgets unnecessarily. Conversely, underestimating error risks non-compliance with safety regulations and potential liability. Incorporating a waste margin in calculations accounts for uncertainties and ensures that estimations are both efficient and reliable. This balance between precision and contingency is fundamental for optimizing resource allocation and maintaining operational safety.
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
            <strong>1. Ignoring Tire Condition:</strong> Tire wear and incorrect tire pressure significantly affect the rolling circumference, leading to inaccurate speedometer readings. Always ensure tires are properly maintained and inflated to manufacturer specifications before measuring speedometer error.
          </p>
          <p>
            <strong>2. Using Single Point Measurements:</strong> Measuring distance at only one point or under non-standard conditions can introduce large errors. Use multiple measurements and average results to improve accuracy and reliability.
          </p>
          <p>
            <strong>3. Neglecting Environmental Factors:</strong> Temperature, road surface, and slope can influence tire behavior and speedometer readings. Failing to account for these can skew error calculations and lead to improper calibrations.
          </p>
          <p>
            <strong>4. Omitting Waste Margin:</strong> Not including a waste margin or contingency buffer can cause underestimation of error, risking non-compliance and safety issues. Always include a reasonable waste percentage to cover uncertainties.
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
      title="Speedometer Error"
      description="Calculate Speedometer Error with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}