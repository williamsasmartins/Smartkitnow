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

export default function TripFuelCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (liters/km) or imperial (gallons/miles)
    distance: "",
    fuelEfficiency: "",
    fuelPrice: "",
    waste: "10", // waste margin in %
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const distance = parseFloat(inputs.distance);
    const fuelEfficiency = parseFloat(inputs.fuelEfficiency);
    const fuelPrice = parseFloat(inputs.fuelPrice);
    const wastePercent = parseFloat(inputs.waste);

    if (
      isNaN(distance) || distance <= 0 ||
      isNaN(fuelEfficiency) || fuelEfficiency <= 0 ||
      isNaN(fuelPrice) || fuelPrice <= 0 ||
      isNaN(wastePercent) || wastePercent < 0
    ) {
      return {
        mainQty: "0",
        unitLabel: inputs.unit === "metric" ? "Liters" : "Gallons",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: `+${inputs.waste}% Waste margin included for contingencies.`,
      };
    }

    // Calculation logic:
    // Fuel needed = Distance / Fuel Efficiency
    // Add waste margin: multiply by (1 + wastePercent/100)
    // Cost = Fuel needed * Fuel Price

    // Units:
    // Metric: distance in kilometers, fuel efficiency in km/liter, price per liter
    // Imperial: distance in miles, fuel efficiency in miles/gallon, price per gallon

    const rawFuelNeeded = distance / fuelEfficiency;
    const totalFuelNeeded = rawFuelNeeded * (1 + wastePercent / 100);
    const totalCost = totalFuelNeeded * fuelPrice;

    // Format results
    const mainQty = totalFuelNeeded.toFixed(2);
    const cost = totalCost.toLocaleString(undefined, { style: "currency", currency: "USD" });
    const unitLabel = inputs.unit === "metric" ? "Liters" : "Gallons";
    const details = `Raw Fuel Needed: ${rawFuelNeeded.toFixed(2)} ${unitLabel}`;

    return {
      mainQty,
      unitLabel,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste margin included for contingencies.`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "How does the Trip Fuel Cost Calculator ensure accurate budgeting for construction projects?",
      answer:
        "The Trip Fuel Cost Calculator integrates key engineering and logistical principles to provide precise fuel consumption estimates for construction vehicle trips. By factoring in distance, vehicle fuel efficiency, and fuel price, it calculates the raw fuel requirement. Additionally, it incorporates a waste margin to account for unforeseen variables such as idling, detours, or traffic delays, which can increase fuel consumption. Accurate budgeting is critical in construction projects to maintain financial control and ensure uninterrupted operations, as fuel costs can significantly impact overall project expenses. This calculator helps project managers anticipate fuel needs, optimize route planning, and avoid costly overruns caused by underestimating fuel consumption.",
    },
    {
      question: "How does the waste factor impact my fuel budget and project planning?",
      answer:
        "The waste factor in the Trip Fuel Cost Calculator is not merely an arbitrary buffer but a crucial contingency allowance that accounts for real-world inefficiencies. Factors such as traffic congestion, vehicle idling during loading/unloading, route deviations, and environmental conditions can increase fuel consumption beyond theoretical calculations. Including a waste margin—typically between 10% to 15%—ensures that the estimated fuel quantity covers these operational variances, preventing budget shortfalls. Ignoring this factor can lead to under-provisioning fuel, causing delays and increased costs due to emergency refueling or trip rescheduling. Hence, professional estimators always incorporate a waste margin to safeguard project timelines and financial integrity.",
    },
    {
      question: "What types of fuel efficiency measurements should I use for different construction vehicles?",
      answer:
        "Fuel efficiency varies significantly across construction vehicle types, influenced by engine size, load capacity, and operational conditions. For light vehicles such as pickup trucks, fuel efficiency is often measured in miles per gallon (mpg) or kilometers per liter (km/l). Heavy machinery like excavators or dump trucks typically have lower fuel efficiency due to higher power demands and are best measured using gallons or liters per hour under load. When using the Trip Fuel Cost Calculator, it is essential to input the correct fuel efficiency metric corresponding to the vehicle and unit system selected. Using inaccurate or generic values can skew fuel cost estimates, impacting project budgeting and operational planning.",
    },
    {
      question: "What are some installation tips to optimize fuel consumption during construction trips?",
      answer:
        "Optimizing fuel consumption during construction trips involves both vehicle operation and logistical planning. Firstly, maintaining vehicles in optimal mechanical condition—such as regular engine tune-ups, proper tire inflation, and clean air filters—improves fuel efficiency by reducing engine strain. Secondly, planning routes to minimize idling and avoid congested areas reduces unnecessary fuel burn. Thirdly, scheduling trips during off-peak hours can prevent delays and excessive fuel use. Lastly, training drivers on fuel-efficient driving techniques, such as smooth acceleration and deceleration, can significantly lower consumption. Implementing these practices complements the Trip Fuel Cost Calculator’s estimates by reducing actual fuel usage and costs.",
    },
    {
      question: "How do weather and environmental factors affect fuel consumption in construction projects?",
      answer:
        "Weather and environmental conditions play a pivotal role in fuel consumption for construction vehicle trips. Cold temperatures increase engine warm-up times and reduce fuel efficiency due to denser air and increased rolling resistance on icy or snowy surfaces. Conversely, hot weather can cause engine overheating, requiring additional cooling and potentially increasing fuel use. Rain and muddy conditions increase vehicle drag and rolling resistance, forcing engines to work harder and consume more fuel. Wind resistance, especially strong headwinds, also elevates fuel consumption. The Trip Fuel Cost Calculator’s waste margin helps accommodate these environmental impacts, but project managers should also consider seasonal adjustments and vehicle maintenance to mitigate adverse effects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Fuel Economy Guide",
      description:
        "Comprehensive resource providing detailed fuel efficiency data and tips for various vehicle types, including heavy-duty construction equipment.",
      url: "https://www.fueleconomy.gov/feg/maintain.shtml",
    },
    {
      title: "International Energy Agency - Construction Equipment Fuel Efficiency",
      description:
        "Reports and standards on fuel consumption benchmarks and best practices for construction machinery worldwide.",
      url: "https://www.iea.org/reports/fuel-efficiency-in-construction",
    },
    {
      title: "Occupational Safety and Health Administration (OSHA) - Vehicle Safety and Maintenance",
      description:
        "Guidelines on maintaining construction vehicles to ensure safety and optimal fuel efficiency during operations.",
      url: "https://www.osha.gov/vehicle-safety",
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
            <SelectItem value="metric">Metric (km, liters)</SelectItem>
            <SelectItem value="imperial">Imperial (miles, gallons)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Distance ({inputs.unit === "metric" ? "Kilometers" : "Miles"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            placeholder={`Enter trip distance in ${inputs.unit === "metric" ? "km" : "miles"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Efficiency ({inputs.unit === "metric" ? "km per liter" : "miles per gallon"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder={`Enter vehicle fuel efficiency (${inputs.unit === "metric" ? "km/l" : "mpg"})`}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Fuel Price ({inputs.unit === "metric" ? "per liter" : "per gallon"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={`Enter fuel price in ${inputs.unit === "metric" ? "USD/liter" : "USD/gallon"}`}
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

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No action needed, calculation is reactive
        }}
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Fuel Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
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
          <li>
            <strong>Step 1: Input Distance:</strong> Enter the total trip distance your construction vehicle will cover, in kilometers or miles depending on your unit selection.
          </li>
          <li>
            <strong>Step 2: Enter Fuel Efficiency:</strong> Provide the vehicle's fuel efficiency rating, such as kilometers per liter or miles per gallon, reflecting real-world operating conditions.
          </li>
          <li>
            <strong>Step 3: Set Fuel Price:</strong> Input the current fuel price per liter or gallon to calculate the total fuel cost accurately.
          </li>
          <li>
            <strong>Step 4: Adjust Waste Margin:</strong> Use the slider to add a waste margin percentage to cover inefficiencies like idling, detours, or traffic delays.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to view the estimated total fuel needed and the associated cost for your trip.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Trip Fuel Cost Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Trip Fuel Cost Calculator is an essential tool designed to estimate the fuel consumption and cost for construction vehicle trips with precision. In construction logistics, fuel represents a significant operational expense, and accurate estimation is vital to maintain project budgets and timelines. The calculator applies fundamental engineering principles by considering the total trip distance and the vehicle's fuel efficiency, which is influenced by engine performance, load, and driving conditions. Incorporating a waste margin accounts for real-world variables such as traffic delays, idling, and route changes, ensuring the estimate reflects practical usage rather than ideal conditions.
          </p>
          <p>
            Fuel efficiency varies widely depending on vehicle type, engine size, and operational load. For instance, light trucks may achieve higher kilometers per liter or miles per gallon, while heavy machinery consumes more fuel per hour of operation. Understanding these nuances is critical when inputting data into the calculator. Additionally, fuel prices fluctuate based on market conditions and geographic location, impacting overall trip costs. The calculator allows users to input current fuel prices, providing dynamic and localized cost estimates. This adaptability helps project managers make informed decisions about vehicle deployment and fuel procurement.
          </p>
          <p>
            Overestimating fuel needs can lead to unnecessary budget allocation and excess fuel storage, which may degrade over time or increase safety risks. Conversely, underestimating fuel consumption risks project delays, emergency refueling costs, and operational disruptions. By balancing these factors, the Trip Fuel Cost Calculator promotes efficient resource management and cost control. Accurate fuel cost estimation supports sustainable construction practices by minimizing waste and optimizing vehicle utilization. Ultimately, this tool empowers construction professionals to plan trips effectively, reduce environmental impact, and uphold structural project integrity through reliable logistical support.
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
            <strong>1. Using Manufacturer’s Fuel Efficiency Instead of Real-World Data:</strong> Manufacturer ratings often reflect ideal conditions. Construction sites involve heavy loads, frequent stops, and idling, which reduce fuel efficiency. Always use actual operational data or conservative estimates to avoid under-budgeting fuel costs.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste margin overlooks practical inefficiencies such as traffic delays, detours, and idling. This can cause fuel shortages mid-project, leading to costly delays and emergency refueling.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Confusing metric and imperial units (e.g., entering miles with liters) leads to incorrect calculations. Always ensure consistency in distance, fuel efficiency, and fuel price units to maintain calculation accuracy.
          </p>
          <p>
            <strong>4. Not Updating Fuel Prices:</strong> Fuel prices fluctuate frequently. Using outdated prices can cause significant budget variances. Regularly update fuel price inputs to reflect current market conditions.
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
      title="Trip Fuel Cost Calculator"
      description="Calculate Trip Fuel Cost Calculator with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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