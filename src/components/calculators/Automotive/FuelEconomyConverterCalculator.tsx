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

export default function FuelEconomyConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (L/100km) or imperial (mpg)
    fuelAmount: "", // fuel consumed (liters or gallons)
    distance: "", // distance traveled (km or miles)
    waste: "0", // waste margin, usually 0% for fuel but kept for consistency
    pricePerUnit: "", // price per liter or gallon
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fuel = parseFloat(inputs.fuelAmount);
    const dist = parseFloat(inputs.distance);
    const wastePercent = parseFloat(inputs.waste);
    const price = parseFloat(inputs.pricePerUnit);

    if (isNaN(fuel) || fuel <= 0 || isNaN(dist) || dist <= 0) {
      return {
        mainQty: "0",
        unitLabel: inputs.unit === "metric" ? "L/100km" : "mpg",
        cost: "$0.00",
        details: "Please enter valid positive numbers for fuel and distance.",
        wasteInfo: "Waste margin is not typically applied for fuel economy calculations."
      };
    }

    // Calculate fuel economy
    // Metric: L/100km = (fuel / distance) * 100
    // Imperial: mpg = distance / fuel
    let economy = 0;
    let unitLabel = "";
    if (inputs.unit === "metric") {
      economy = (fuel / dist) * 100;
      unitLabel = "L/100km";
    } else {
      economy = dist / fuel;
      unitLabel = "mpg";
    }

    // Waste margin is not typical for fuel economy but if user inputs, adjust fuel amount accordingly
    const adjustedFuel = fuel * (1 + wastePercent / 100);

    // Calculate cost if price per unit is provided
    let cost = 0;
    if (!isNaN(price) && price > 0) {
      cost = adjustedFuel * price;
    }

    return {
      mainQty: economy.toFixed(2),
      unitLabel,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Fuel consumed: ${fuel.toFixed(2)} ${inputs.unit === "metric" ? "liters" : "gallons"}, Distance traveled: ${dist.toFixed(2)} ${inputs.unit === "metric" ? "kilometers" : "miles"}.`,
      wasteInfo: wastePercent > 0 ? `Adjusted fuel with ${wastePercent}% margin: ${adjustedFuel.toFixed(2)} ${inputs.unit === "metric" ? "liters" : "gallons"}` : "No waste margin applied."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is fuel economy and why is it important in construction projects?",
      answer:
        "Fuel economy measures how efficiently a vehicle or machinery consumes fuel over a given distance, typically expressed as liters per 100 kilometers (L/100km) or miles per gallon (mpg). In construction, accurate fuel economy calculations are critical for budgeting and operational planning, as machinery and transport vehicles consume significant fuel volumes. Understanding fuel economy helps optimize equipment usage, reduce operational costs, and minimize environmental impact by lowering carbon emissions. Additionally, precise fuel consumption estimates ensure that fuel procurement aligns with project timelines, avoiding costly delays or excess inventory."
    },
    {
      question: "How does the waste factor impact fuel economy calculations and budgeting?",
      answer:
        "While waste margins are common in material estimations to account for spillage or overuse, applying a waste factor to fuel economy calculations is less typical but can be relevant in specific contexts. For example, fuel loss due to evaporation, leakage, or inefficient machinery operation can increase actual consumption beyond theoretical calculations. Including a small waste margin (usually 0-5%) helps project managers budget for these inefficiencies, ensuring fuel availability without unexpected shortages. Ignoring such factors can lead to underestimating fuel needs, causing operational interruptions and increased costs."
    },
    {
      question: "What types of fuels and machinery affect fuel economy in construction?",
      answer:
        "Construction projects utilize various fuels such as diesel, gasoline, and increasingly, biodiesel or electric power. Each fuel type has distinct energy densities and combustion characteristics influencing fuel economy. Heavy machinery like excavators, bulldozers, and generators have different fuel consumption rates based on engine size, load, and operating conditions. For instance, diesel engines typically offer better fuel economy and torque for heavy-duty tasks compared to gasoline engines. Selecting the appropriate fuel and machinery type is essential for optimizing fuel efficiency, reducing emissions, and maintaining project timelines."
    },
    {
      question: "What are some best practices for improving fuel economy on construction sites?",
      answer:
        "Improving fuel economy on construction sites involves several strategies including regular maintenance of machinery to ensure optimal engine performance and prevent fuel leaks. Operators should be trained in efficient driving and equipment handling techniques to minimize idling and unnecessary acceleration. Implementing telematics and fuel monitoring systems can provide real-time data to identify inefficiencies and schedule preventive maintenance. Additionally, planning logistics to reduce travel distances and load optimization can significantly lower fuel consumption. These practices not only reduce operational costs but also enhance sustainability by lowering greenhouse gas emissions."
    },
    {
      question: "How do environmental factors influence fuel economy in construction equipment?",
      answer:
        "Environmental conditions such as temperature, terrain, and altitude significantly impact fuel economy in construction equipment. Cold weather increases fuel consumption due to longer engine warm-up times and denser air requiring richer fuel mixtures for combustion. Rough or uneven terrain demands more power and fuel to operate machinery effectively, while high altitudes reduce engine efficiency because of lower oxygen levels. Additionally, wet or muddy conditions can increase rolling resistance, further elevating fuel use. Understanding these factors allows project managers to adjust fuel estimates accurately and implement mitigation strategies like pre-warming engines or selecting appropriate equipment."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "ASTM International Standards",
      description: "Global standards for material specifications and testing procedures, including fuel quality and engine performance."
    },
    {
      title: "International Building Code (IBC)",
      description: "Essential regulations regarding structural safety and installation requirements that indirectly affect fuel usage in construction."
    },
    {
      title: "Professional Constructor's Guide",
      description: "Best practices for site preparation, machinery operation, and fuel management to optimize construction efficiency."
    }
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
            <SelectItem value="metric">Metric (L/100km)</SelectItem>
            <SelectItem value="imperial">Imperial (mpg)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fuel Consumed ({inputs.unit === "metric" ? "Liters" : "Gallons"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelAmount}
            onChange={(e) => handleInputChange("fuelAmount", e.target.value)}
            placeholder={`Enter fuel amount in ${inputs.unit === "metric" ? "liters" : "gallons"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Distance Traveled ({inputs.unit === "metric" ? "Kilometers" : "Miles"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            placeholder={`Enter distance in ${inputs.unit === "metric" ? "kilometers" : "miles"}`}
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin (%)</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste) || 0]}
          min={0}
          max={5}
          step={1}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Waste margin accounts for fuel loss due to evaporation or inefficiencies. Typically 0-5%.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Fuel Price per {inputs.unit === "metric" ? "Liter" : "Gallon"}</Label>
        <Input
          type="number"
          min="0"
          step="any"
          value={inputs.pricePerUnit}
          onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
          placeholder={`Enter price per ${inputs.unit === "metric" ? "liter" : "gallon"}`}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Fuel Economy</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Est. Fuel Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-500 mt-1 italic">{results.wasteInfo}</p>
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
            <strong>Step 1: Select Unit System:</strong> Choose between Metric (liters per 100 kilometers) or Imperial (miles per gallon) depending on your region or preference.
          </li>
          <li>
            <strong>Step 2: Enter Fuel Consumed:</strong> Input the total amount of fuel used during the project or operation in liters or gallons.
          </li>
          <li>
            <strong>Step 3: Enter Distance Traveled:</strong> Provide the total distance covered by the vehicle or machinery in kilometers or miles.
          </li>
          <li>
            <strong>Step 4: Adjust Waste Margin:</strong> Use the slider to add a small percentage margin for fuel loss due to evaporation or inefficiencies, typically 0-5%.
          </li>
          <li>
            <strong>Step 5: Enter Fuel Price:</strong> Input the current price per liter or gallon to estimate the total fuel cost.
          </li>
          <li>
            <strong>Step 6: Calculate:</strong> Click the calculate button to view your fuel economy and estimated fuel cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Fuel Economy Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Fuel economy is a critical metric in construction and heavy machinery operations, representing the efficiency with which fuel is consumed relative to distance traveled. This calculator helps quantify fuel consumption in either metric units (liters per 100 kilometers) or imperial units (miles per gallon), allowing project managers and operators to monitor and optimize fuel usage. Precision in these calculations is essential because fuel costs often constitute a significant portion of operational expenses, and inaccurate estimates can lead to budget overruns or project delays. Understanding fuel economy also supports sustainability goals by reducing unnecessary fuel consumption and emissions.
          </p>
          <p>
            The materials involved in fuel economy calculations are primarily the fuels themselves—diesel, gasoline, biodiesel, or alternative fuels—each with distinct energy densities and combustion properties. For example, diesel fuel typically provides higher energy content per liter than gasoline, resulting in better fuel economy for diesel-powered machinery. Additionally, factors such as engine type, load, terrain, and environmental conditions influence actual fuel consumption. Beginners often overlook these nuances, leading to inaccurate estimates. This calculator simplifies the process by focusing on core inputs—fuel consumed and distance traveled—while allowing adjustments for waste or inefficiencies.
          </p>
          <p>
            Economically, accurate fuel economy calculations help balance the risks of over-ordering and under-ordering fuel. Overestimating fuel needs ties up capital in unused fuel and increases storage risks, while underestimating can cause costly downtime and emergency purchases at premium prices. Efficient fuel management enhances project profitability and operational reliability. By using this calculator, construction professionals can make informed decisions, optimize fuel procurement, and implement best practices that improve overall project sustainability and safety.
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
            <strong>1. Ignoring Environmental Conditions:</strong> Failing to account for temperature, terrain, and altitude can lead to inaccurate fuel economy estimates. Cold weather increases fuel consumption due to longer engine warm-up times, while rough terrain demands more power, both affecting efficiency.
          </p>
          <p>
            <strong>2. Overlooking Fuel Losses:</strong> Not including a waste margin for evaporation, leakage, or inefficient machinery operation can underestimate actual fuel needs, causing budget shortfalls and operational delays.
          </p>
          <p>
            <strong>3. Mixing Unit Systems:</strong> Inputting fuel and distance in different unit systems (e.g., liters with miles) without conversion leads to erroneous calculations. Always ensure consistency in units before calculating.
          </p>
          <p>
            <strong>4. Neglecting Maintenance Impact:</strong> Poorly maintained equipment consumes more fuel. Ignoring this factor can result in optimistic fuel economy figures that do not reflect real-world consumption.
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
      title="Fuel Economy Converter"
      description="Calculate Fuel Economy Converter with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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