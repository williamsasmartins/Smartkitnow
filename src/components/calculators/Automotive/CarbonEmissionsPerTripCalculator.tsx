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

export default function CarbonEmissionsPerTripCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (km) or imperial (miles)
    distance: "", // trip distance
    vehicleType: "medium_diesel", // vehicle type for emission factor
    loadWeight: "", // load weight in tons or lbs
    waste: "10", // waste margin in %
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Emission factors (kg CO2e per ton-km or ton-mile) based on vehicle type.
   * Source: Typical construction transport emission factors.
   */
  const emissionFactors = {
    metric: {
      small_diesel: 0.12, // kg CO2e per ton-km
      medium_diesel: 0.15,
      large_diesel: 0.20,
      electric: 0.05,
    },
    imperial: {
      small_diesel: 0.19, // kg CO2e per ton-mile (converted approx)
      medium_diesel: 0.24,
      large_diesel: 0.32,
      electric: 0.08,
    },
  };

  const vehicleLabels = {
    small_diesel: "Small Diesel Truck",
    medium_diesel: "Medium Diesel Truck",
    large_diesel: "Large Diesel Truck",
    electric: "Electric Truck",
  };

  const results = useMemo(() => {
    const dist = parseFloat(inputs.distance);
    const weight = parseFloat(inputs.loadWeight);
    const wastePercent = parseFloat(inputs.waste);

    if (
      isNaN(dist) || dist <= 0 ||
      isNaN(weight) || weight <= 0 ||
      isNaN(wastePercent) || wastePercent < 0
    ) {
      return {
        carbonEmission: "0",
        unitLabel: "kg CO₂e",
        details: "Please enter valid positive numbers for distance and load weight.",
      };
    }

    // Add waste margin to load weight (e.g. extra material transported)
    const adjustedWeight = weight * (1 + wastePercent / 100);

    // Get emission factor based on unit and vehicle type
    const factor = emissionFactors[inputs.unit][inputs.vehicleType] || 0.15;

    // Calculate carbon emissions: emission factor * adjusted weight * distance
    // Units: kg CO2e = (kg CO2e/ton-km) * tons * km
    const carbonEmission = factor * adjustedWeight * dist;

    return {
      carbonEmission: carbonEmission.toFixed(2),
      unitLabel: "kg CO₂e",
      details: `Distance: ${dist} ${inputs.unit === "metric" ? "km" : "miles"}, Load Weight (incl. waste): ${adjustedWeight.toFixed(2)} ${inputs.unit === "metric" ? "tons" : "tons (US)"}, Vehicle: ${vehicleLabels[inputs.vehicleType]}`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What factors influence the carbon emissions per trip in construction logistics?",
      answer:
        "Carbon emissions per trip in construction logistics are influenced by several critical factors including vehicle type, load weight, trip distance, and waste margin. The vehicle's fuel type and efficiency directly affect emission factors, with diesel trucks typically emitting more CO₂e than electric vehicles. Load weight impacts the total emissions proportionally, as heavier loads require more fuel consumption. Additionally, the trip distance determines the total travel emissions, while waste margin accounts for extra material transported due to spillage or over-ordering, increasing the carbon footprint. Understanding these variables is essential for accurate emissions estimation and sustainable project planning.",
    },
    {
      question: "How does the waste margin affect carbon emissions and project budgeting?",
      answer:
        "The waste margin represents the additional material transported beyond the exact project requirements to account for spillage, cutting losses, or unforeseen site conditions. This margin increases the total load weight, thereby elevating the carbon emissions per trip since more material means more fuel consumption during transport. From a budgeting perspective, an underestimated waste margin can lead to material shortages and costly delays, while an excessive margin inflates both material costs and environmental impact unnecessarily. Professional estimators typically recommend a waste margin between 10-15% to balance efficiency, cost control, and sustainability.",
    },
    {
      question: "What are the differences between vehicle types in terms of carbon emissions for construction trips?",
      answer:
        "Vehicle types vary significantly in their carbon emissions due to differences in fuel efficiency, engine size, and fuel source. Small diesel trucks generally emit less CO₂e per ton-kilometer compared to medium or large diesel trucks, which consume more fuel due to heavier loads and larger engines. Electric trucks, while still emerging in the construction sector, offer substantially lower emissions as they rely on cleaner energy sources and regenerative braking. Selecting the appropriate vehicle type based on load and distance can optimize emissions and operational costs, contributing to greener construction logistics.",
    },
    {
      question: "What are some best practices for minimizing carbon emissions during material transport in construction?",
      answer:
        "Minimizing carbon emissions during material transport involves strategic planning and operational efficiency. Best practices include optimizing load sizes to reduce the number of trips, selecting fuel-efficient or electric vehicles, and planning routes to avoid congestion and reduce travel distance. Additionally, coordinating deliveries to align with site readiness prevents idle waiting times that increase fuel consumption. Regular vehicle maintenance ensures optimal engine performance and lower emissions. Implementing these practices supports sustainable construction goals and reduces the overall carbon footprint of projects.",
    },
    {
      question: "How do environmental conditions affect carbon emissions during construction material transport?",
      answer:
        "Environmental conditions such as temperature, terrain, and weather can significantly impact carbon emissions during material transport. For example, cold temperatures increase engine warm-up times and reduce fuel efficiency, leading to higher emissions. Hilly or uneven terrain requires more engine power and fuel consumption compared to flat routes. Adverse weather conditions like rain or snow can cause slower travel speeds and idling, further increasing emissions. Understanding these factors allows project managers to plan transport schedules and vehicle selection to mitigate environmental impacts effectively.",
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
    {
      title: "UK Government Greenhouse Gas Reporting: Conversion Factors",
      description: "Official emission factors for transport and construction activities.",
      url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
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
            <SelectItem value="metric">Metric (km, tons)</SelectItem>
            <SelectItem value="imperial">Imperial (miles, tons)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Trip Distance ({inputs.unit === "metric" ? "km" : "miles"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            placeholder={`Enter distance in ${inputs.unit === "metric" ? "kilometers" : "miles"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Load Weight ({inputs.unit === "metric" ? "tons" : "tons (US)"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.loadWeight}
            onChange={(e) => handleInputChange("loadWeight", e.target.value)}
            placeholder={`Enter load weight in ${inputs.unit === "metric" ? "metric tons" : "US tons"}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Type</Label>
        <Select value={inputs.vehicleType} onValueChange={(v) => handleInputChange("vehicleType", v)}>
          <SelectTrigger className="w-full">
            <TruckIcon className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small_diesel">Small Diesel Truck</SelectItem>
            <SelectItem value="medium_diesel">Medium Diesel Truck</SelectItem>
            <SelectItem value="large_diesel">Large Diesel Truck</SelectItem>
            <SelectItem value="electric">Electric Truck</SelectItem>
          </SelectContent>
        </Select>
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Carbon Emissions</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.carbonEmission} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
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
            <strong>Step 1: Input Trip Distance:</strong> Enter the total one-way distance of the material transport trip in kilometers or miles, depending on your selected unit system.
          </li>
          <li>
            <strong>Step 2: Enter Load Weight:</strong> Provide the weight of the material being transported per trip in metric tons or US tons. This should include the actual material weight without waste.
          </li>
          <li>
            <strong>Step 3: Select Vehicle Type:</strong> Choose the type of vehicle used for transport. Different vehicles have varying fuel efficiencies and emission factors.
          </li>
          <li>
            <strong>Step 4: Adjust Waste Margin:</strong> Use the slider to set the waste margin percentage to account for additional material transported due to spillage or over-ordering.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to estimate the total carbon emissions for the trip, factoring in distance, load, vehicle type, and waste margin.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Carbon Emissions per Trip
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating carbon emissions per trip in construction logistics is a critical component of sustainable project management and environmental compliance. This process involves quantifying the greenhouse gas emissions generated by transporting construction materials from suppliers to the site. The calculation is grounded in engineering principles that consider the vehicle's fuel consumption rate, load weight, and travel distance. Precision in these measurements is essential to ensure accurate emissions reporting, which influences project sustainability ratings and regulatory adherence.
          </p>
          <p>
            The materials transported often vary in density and weight, affecting the load carried by transport vehicles. For example, aggregates and concrete have different mass-to-volume ratios, impacting fuel consumption during transit. Additionally, the type of vehicle used—ranging from small diesel trucks to electric-powered vehicles—plays a significant role in determining emission factors. Understanding the nuances of these materials and vehicle specifications is vital for accurate carbon footprint estimation and optimizing logistics to reduce environmental impact.
          </p>
          <p>
            From an economic standpoint, overestimating emissions or material loads can lead to inflated project costs and inefficient resource allocation, while underestimating them risks non-compliance with environmental standards and potential project delays. Balancing these factors through precise calculations enhances operational efficiency, reduces unnecessary expenditures, and supports the structural integrity and safety of the construction process by ensuring timely and adequate material delivery. Ultimately, accurate carbon emissions calculations contribute to greener construction practices and improved corporate social responsibility.
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
            <strong>1. Ignoring Waste Margin:</strong> Failing to include a waste margin leads to underestimating the total load weight, which results in inaccurate carbon emission calculations and potential material shortages on site.
          </p>
          <p>
            <strong>2. Using Incorrect Emission Factors:</strong> Applying generic or outdated emission factors without considering vehicle type or fuel source can skew results, compromising the reliability of sustainability reports.
          </p>
          <p>
            <strong>3. Neglecting Return Trips:</strong> Some calculations omit the carbon emissions from return trips, which, although often empty, still consume fuel and contribute to the overall footprint.
          </p>
          <p>
            <strong>4. Overlooking Unit Consistency:</strong> Mixing metric and imperial units without proper conversion can cause significant errors in distance, weight, and emission factor inputs.
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

  // Custom icon for truck (since lucide-react does not have Truck icon by default)
  function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }

  return (
    <CalculatorVerticalLayout
      title="Carbon Emissions per Trip"
      description="Calculate Carbon Emissions per Trip with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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