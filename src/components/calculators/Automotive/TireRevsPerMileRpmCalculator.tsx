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

export default function TireRevsPerMileRpmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // default to imperial for tire calc (miles, inches)
    tireDiameter: "", // in inches or mm depending on unit
    speed: "", // in mph or kph
    waste: "0", // waste not really applicable but keep for UI consistency
    pricePerTire: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const diameter = parseFloat(inputs.tireDiameter);
    const speed = parseFloat(inputs.speed);
    const price = parseFloat(inputs.pricePerTire);
    const unit = inputs.unit;

    if (isNaN(diameter) || diameter <= 0 || isNaN(speed) || speed <= 0) {
      return {
        mainQty: "0",
        unitLabel: "Revs/Mile",
        cost: "$0.00",
        details: "Please enter valid positive numbers for tire diameter and speed.",
        wasteInfo: "",
      };
    }

    // Convert diameter to feet for imperial or meters for metric
    // Tire circumference = π * diameter
    // For imperial: diameter in inches -> feet = inches / 12
    // For metric: diameter in mm -> meters = mm / 1000

    let circumferenceFeet = 0;
    let circumferenceMeters = 0;
    if (unit === "imperial") {
      circumferenceFeet = Math.PI * (diameter / 12);
    } else {
      circumferenceMeters = Math.PI * (diameter / 1000);
    }

    // Calculate revolutions per mile or km
    // 1 mile = 5280 feet, 1 km = 1000 meters
    let revsPerDistance = 0;
    if (unit === "imperial") {
      revsPerDistance = 5280 / circumferenceFeet;
    } else {
      revsPerDistance = 1000 / circumferenceMeters;
    }

    // Calculate RPM at given speed
    // speed in mph or kph
    // RPM = (speed * revs per mile) / 60 (minutes per hour)
    const rpm = (speed * revsPerDistance) / 60;

    // Cost is optional, just show price per tire if given
    const cost = price && price > 0 ? `$${price.toFixed(2)}` : "N/A";

    return {
      mainQty: revsPerDistance.toFixed(2),
      unitLabel: unit === "imperial" ? "Revs/Mile" : "Revs/Km",
      cost,
      details: `At ${speed} ${unit === "imperial" ? "mph" : "kph"}, the tire rotates at approximately ${rpm.toFixed(2)} RPM.`,
      wasteInfo: "",
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is the significance of calculating tire revolutions per mile and RPM at speed?",
      answer:
        "Calculating tire revolutions per mile and RPM at speed is critical for vehicle dynamics, speedometer calibration, and drivetrain design. The tire circumference directly affects how many times the tire rotates over a given distance, influencing speed readings and engine load calculations. Accurate calculations ensure proper gear ratios, fuel efficiency, and safety compliance. Misestimating these values can lead to incorrect speedometer readings, increased wear on drivetrain components, and compromised vehicle performance.",
    },
    {
      question: "How does tire diameter affect revolutions per mile and RPM calculations?",
      answer:
        "Tire diameter is the primary factor determining the tire's circumference, which in turn dictates the number of revolutions per mile. Larger diameter tires have a greater circumference, resulting in fewer revolutions per mile, while smaller tires rotate more frequently. This affects the RPM at a given speed, impacting engine load and transmission behavior. Precise measurement of tire diameter, including tire wear and inflation effects, is essential for accurate calculations and vehicle calibration.",
    },
    {
      question: "Why is it important to consider unit systems (imperial vs metric) in these calculations?",
      answer:
        "Unit consistency is vital when calculating tire revolutions and RPM to avoid errors that can propagate through vehicle systems. Imperial units typically use inches and miles, while metric uses millimeters and kilometers. Mixing units without proper conversion leads to incorrect circumference and revolution values, affecting speedometer accuracy and engine tuning. Ensuring all inputs are in the same unit system maintains calculation integrity and supports international vehicle standards.",
    },
    {
      question: "Can environmental factors influence tire revolution calculations?",
      answer:
        "Environmental factors such as temperature and tire pressure can affect tire diameter slightly by causing expansion or contraction of the tire material. Changes in tire pressure alter the effective rolling radius, impacting revolutions per mile and RPM calculations. While these variations are generally minor, for precision applications like racing or heavy-duty vehicles, accounting for environmental conditions ensures optimal performance and safety margins.",
    },
    {
      question: "How do these calculations impact vehicle maintenance and safety?",
      answer:
        "Accurate tire revolution and RPM calculations inform maintenance schedules, tire replacement timing, and safety checks. Incorrect RPM readings can mask engine or transmission issues, while miscalculated revolutions per mile can lead to improper speedometer calibration, risking speeding violations or unsafe driving conditions. Understanding these metrics helps technicians diagnose drivetrain wear, optimize fuel consumption, and maintain structural integrity of tires and suspension components.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "SAE International - Tire and Wheel Standards",
      description:
        "Comprehensive standards for tire dimensions, performance testing, and safety requirements used globally in automotive engineering.",
      url: "https://www.sae.org/standards/",
    },
    {
      title: "Federal Motor Vehicle Safety Standards (FMVSS)",
      description:
        "Regulations governing vehicle safety including tire performance and speedometer accuracy in the United States.",
      url: "https://www.nhtsa.gov/laws-regulations/fmvss",
    },
    {
      title: "ISO 4000 - Road Vehicles — Tires",
      description:
        "International standards specifying tire dimensions, load ratings, and testing procedures to ensure global compatibility and safety.",
      url: "https://www.iso.org/standard/4000.html",
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
            <SelectItem value="metric">Metric (mm, kph)</SelectItem>
            <SelectItem value="imperial">Imperial (inches, mph)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 28" : "e.g. 700"}
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Speed ({inputs.unit === "imperial" ? "mph" : "kph"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 60" : "e.g. 100"}
            value={inputs.speed}
            onChange={(e) => handleInputChange("speed", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Price per Tire (optional)</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 150.00"
          value={inputs.pricePerTire}
          onChange={(e) => handleInputChange("pricePerTire", e.target.value)}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Tire Revolutions per Distance</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Price per Tire: {results.cost}</div>
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
            <strong>Step 1: Select Unit System:</strong> Choose between Metric (millimeters and kilometers per hour) or Imperial (inches and miles per hour) units to match your tire and speed measurements.
          </li>
          <li>
            <strong>Step 2: Enter Tire Diameter:</strong> Measure the tire diameter accurately including the tire tread. Input the value in the selected unit system to ensure precise calculations.
          </li>
          <li>
            <strong>Step 3: Input Vehicle Speed:</strong> Enter the speed at which the vehicle will be traveling. This speed is used to calculate the tire's RPM at that velocity.
          </li>
          <li>
            <strong>Step 4: Optional Price Entry:</strong> Input the price per tire if you want to estimate cost implications related to tire selection or replacement.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to view the tire revolutions per mile or kilometer and the RPM at the entered speed.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Tire Revolutions per Mile & RPM @ Speed
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Understanding tire revolutions per mile and RPM at speed is fundamental in automotive engineering and vehicle maintenance. The tire's circumference, derived from its diameter, determines how many times it rotates over a given distance. This rotation frequency directly impacts speedometer accuracy, drivetrain efficiency, and overall vehicle performance. Precision in these calculations ensures that speed readings are reliable and that mechanical components operate within their designed parameters, preventing premature wear or failure.
          </p>
          <p>
            Tires are composed of various materials including rubber compounds, reinforcing fabrics, and steel belts, each contributing to the tire's structural integrity and performance characteristics. The effective diameter can vary slightly due to tire pressure, load, and temperature, which affect the tire's deformation and rolling radius. Accurate measurement and consideration of these factors are essential, especially in high-performance or commercial vehicles where small deviations can lead to significant operational impacts.
          </p>
          <p>
            Economically, precise calculation of tire revolutions and RPM helps avoid costly errors such as incorrect speedometer calibration or drivetrain mismatches. Overestimating tire size can cause under-reporting of speed, while underestimating can lead to over-speeding and increased fuel consumption. Additionally, understanding these metrics aids in selecting appropriate tires for specific applications, optimizing maintenance schedules, and ensuring safety compliance. Efficient use of this data supports budget management by reducing unnecessary tire replacements and improving vehicle longevity.
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
            <strong>1. Incorrect Diameter Measurement:</strong> Measuring the tire diameter without accounting for tire wear, inflation pressure, or load can lead to inaccurate circumference calculations, skewing revolutions per mile and RPM results.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Using a mix of metric and imperial units without proper conversion causes calculation errors. Always ensure consistent units for diameter and speed inputs.
          </p>
          <p>
            <strong>3. Ignoring Environmental Effects:</strong> Temperature and pressure changes affect tire dimensions slightly. Neglecting these can cause minor but critical errors in precision applications.
          </p>
          <p>
            <strong>4. Overlooking Tire Deformation:</strong> Under load, tires deform, reducing effective diameter. Calculations based solely on static measurements may not reflect real-world conditions.
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
      title="Tire Revolutions per Mile & RPM @ Speed"
      description="Calculate Tire Revolutions per Mile & RPM @ Speed with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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