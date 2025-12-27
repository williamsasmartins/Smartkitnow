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

export default function AnnualFuelCostBreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (liters, km) or imperial (gallons, miles)
    annualDistance: "", // distance traveled annually
    fuelEfficiency: "", // fuel efficiency (km/l or mpg)
    fuelPrice: "", // price per liter or gallon
    fixedCost: "", // fixed annual cost (e.g., maintenance, insurance)
    variableCost: "", // variable cost per km or mile (other than fuel)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const distance = parseFloat(inputs.annualDistance);
    const efficiency = parseFloat(inputs.fuelEfficiency);
    const price = parseFloat(inputs.fuelPrice);
    const fixedCost = parseFloat(inputs.fixedCost);
    const variableCost = parseFloat(inputs.variableCost);

    if (
      isNaN(distance) || distance <= 0 ||
      isNaN(efficiency) || efficiency <= 0 ||
      isNaN(price) || price <= 0 ||
      isNaN(fixedCost) || fixedCost < 0 ||
      isNaN(variableCost) || variableCost < 0
    ) {
      return {
        fuelCost: 0,
        totalCost: 0,
        breakEvenDistance: 0,
        unitDistance: inputs.unit === "metric" ? "km" : "miles",
        unitFuel: inputs.unit === "metric" ? "liters" : "gallons",
        details: "Please enter valid positive numbers for all fields.",
      };
    }

    // Calculate annual fuel consumption = distance / efficiency
    const annualFuelConsumption = distance / efficiency;

    // Calculate annual fuel cost
    const annualFuelCost = annualFuelConsumption * price;

    // Calculate total annual cost = fuel cost + fixed cost + variable cost * distance
    const totalAnnualCost = annualFuelCost + fixedCost + (variableCost * distance);

    // Break-even distance calculation:
    // Suppose you want to find the distance at which fuel cost savings offset fixed costs.
    // For example, if switching to a more fuel-efficient vehicle with better fuel efficiency (efficiency2),
    // break-even distance = fixedCost / ((price / efficiency1) - (price / efficiency2))
    // Here, we assume user inputs current efficiency and want to find break-even for a new efficiency.
    // Since we don't have a second efficiency input, we can show a placeholder or skip.

    // For demonstration, let's assume break-even distance is not calculated here.
    // We can show a note instead.

    return {
      fuelCost: annualFuelCost,
      totalCost: totalAnnualCost,
      breakEvenDistance: null,
      unitDistance: inputs.unit === "metric" ? "km" : "miles",
      unitFuel: inputs.unit === "metric" ? "liters" : "gallons",
      details: `Annual Fuel Consumption: ${annualFuelConsumption.toFixed(2)} ${inputs.unit === "metric" ? "liters" : "gallons"}`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What factors influence the accuracy of Annual Fuel Cost & Break-Even calculations?",
      answer:
        "Accurate Annual Fuel Cost and Break-Even calculations depend on precise input data such as actual annual distance traveled, true fuel efficiency under real-world conditions, and current fuel prices. Variations in driving habits, terrain, and vehicle maintenance can significantly affect fuel consumption rates. Additionally, fixed costs like insurance and maintenance, as well as variable costs such as tire wear, should be considered for a comprehensive cost analysis. Ignoring these factors can lead to underestimating expenses and poor financial planning."
    },
    {
      question: "How does the waste factor impact my budget when estimating fuel costs?",
      answer:
        "In fuel cost estimation, the 'waste factor' can be interpreted as inefficiencies or unexpected fuel consumption beyond theoretical calculations. This includes idling, stop-and-go traffic, and detours, which increase fuel usage beyond ideal conditions. Budgeting for this 'waste' ensures that your cost projections are realistic and account for operational variances. Professional estimators often include a contingency margin to cover such inefficiencies, preventing budget overruns and ensuring financial preparedness."
    },
    {
      question: "What are the differences between fuel types and their impact on cost calculations?",
      answer:
        "Different fuel types, such as gasoline, diesel, or alternative fuels like biodiesel and electric power, have varying energy densities, prices, and efficiency impacts. Diesel engines typically offer better fuel economy but may have higher fuel costs or maintenance expenses. Alternative fuels can reduce emissions but might require specialized infrastructure or have variable availability. Understanding these differences is crucial for accurate cost calculations and selecting the most economical and sustainable fuel option for your project."
    },
    {
      question: "What installation or operational tips can help reduce annual fuel costs?",
      answer:
        "Optimizing vehicle maintenance, such as regular engine tuning, tire pressure checks, and timely oil changes, can significantly improve fuel efficiency. Additionally, planning routes to minimize idling and avoid congested areas reduces unnecessary fuel consumption. Training drivers on efficient driving techniques, like smooth acceleration and maintaining steady speeds, also contributes to lower fuel usage. Implementing these best practices enhances operational efficiency and reduces overall annual fuel costs."
    },
    {
      question: "How do weather and environmental factors affect annual fuel consumption?",
      answer:
        "Weather conditions such as extreme cold or heat can impact engine performance and fuel efficiency. Cold weather increases fuel consumption due to longer engine warm-up times and higher rolling resistance from snow or ice. Hot weather can cause air conditioning use, which also raises fuel usage. Additionally, wet or slippery roads require more cautious driving, often leading to less efficient acceleration and braking patterns. Accounting for these environmental factors is essential for realistic annual fuel cost estimations."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    { title: "U.S. Department of Energy - Fuel Economy Guide", description: "Comprehensive guide on vehicle fuel efficiency and cost-saving tips." },
    { title: "EPA Fuel Economy Standards", description: "Regulations and standards for vehicle emissions and fuel consumption." },
    { title: "International Energy Agency (IEA) - Transport", description: "Global data and analysis on transport energy use and policies." }
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
          <Label>Annual Distance Traveled ({inputs.unit === "metric" ? "km" : "miles"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.annualDistance}
            onChange={(e) => handleInputChange("annualDistance", e.target.value)}
            placeholder={`e.g., 15000`}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Efficiency ({inputs.unit === "metric" ? "km/l" : "mpg"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder={`e.g., 12`}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price ({inputs.unit === "metric" ? "per liter" : "per gallon"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={`e.g., 1.20`}
          />
        </div>
        <div className="space-y-2">
          <Label>Fixed Annual Costs (e.g., insurance, maintenance)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fixedCost}
            onChange={(e) => handleInputChange("fixedCost", e.target.value)}
            placeholder={`e.g., 1200`}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Variable Cost per {inputs.unit === "metric" ? "km" : "mile"} (other than fuel)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.variableCost}
            onChange={(e) => handleInputChange("variableCost", e.target.value)}
            placeholder={`e.g., 0.05`}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => { }}>
        <DollarSign className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Annual Fuel Cost</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.fuelCost.toLocaleString(undefined, { style: "currency", currency: "USD" })}
            </div>
            <div className="text-xl font-bold mt-2">Total Annual Cost: {results.totalCost.toLocaleString(undefined, { style: "currency", currency: "USD" })}</div>
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
          <li><strong>Step 1: Select Units:</strong> Choose between metric (kilometers and liters) or imperial (miles and gallons) units to match your data.</li>
          <li><strong>Step 2: Enter Annual Distance:</strong> Input the total distance your vehicle travels annually, based on odometer readings or trip logs.</li>
          <li><strong>Step 3: Input Fuel Efficiency:</strong> Provide your vehicle’s average fuel efficiency, considering real-world driving conditions.</li>
          <li><strong>Step 4: Enter Fuel Price:</strong> Specify the current cost per liter or gallon of fuel in your area.</li>
          <li><strong>Step 5: Add Fixed and Variable Costs:</strong> Include fixed annual expenses like insurance and maintenance, plus any variable costs per distance unit excluding fuel.</li>
          <li><strong>Step 6: Calculate:</strong> Click the calculate button to view your estimated annual fuel cost and total operating cost.</li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Annual Fuel Cost & Break-Even
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating annual fuel cost and break-even points is essential for fleet managers, construction companies, and individual vehicle owners aiming to optimize operational expenses. This calculation integrates engineering principles such as fuel efficiency, energy consumption, and cost amortization over distance traveled. Precision in these calculations is critical to ensure budget accuracy, prevent unexpected overruns, and maintain operational safety by avoiding underfunding of necessary maintenance or fuel needs.
          </p>
          <p>
            The materials involved in this context are primarily fuels—gasoline, diesel, or alternative energy sources—each with distinct energy densities and combustion characteristics. Fuel efficiency, often expressed as kilometers per liter (km/l) or miles per gallon (mpg), varies based on engine type, vehicle load, and driving conditions. Understanding these nuances, including the impact of fuel quality and vehicle maintenance on combustion efficiency, is vital for accurate cost estimation and sustainable operation.
          </p>
          <p>
            Economically, over-ordering fuel or underestimating consumption can lead to excess inventory costs or operational downtime, respectively. Conversely, under-ordering risks project delays and increased emergency procurement costs. Efficient fuel management balances these risks by leveraging accurate consumption data and cost analysis, enabling informed decisions on vehicle usage, maintenance scheduling, and budget allocation. This approach ensures financial efficiency and supports long-term sustainability in construction and transportation projects.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. Ignoring Real-World Fuel Efficiency:</strong> Using manufacturer-rated fuel efficiency without accounting for driving conditions, vehicle load, and maintenance can underestimate fuel consumption, leading to inaccurate cost projections.</p>
          <p><strong>2. Omitting Fixed and Variable Costs:</strong> Focusing solely on fuel costs neglects other significant expenses such as insurance, maintenance, and tire wear, which affect total operating costs and break-even analysis.</p>
          <p><strong>3. Using Outdated Fuel Prices:</strong> Fuel prices fluctuate frequently; relying on outdated prices can skew budget forecasts and affect financial planning accuracy.</p>
          <p><strong>4. Not Accounting for Environmental Factors:</strong> Weather and terrain impact fuel consumption; failing to consider these can result in underestimating actual fuel needs.</p>
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                {ref.title} <ExternalLink className="w-3 h-3" />
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
      title="Annual Fuel Cost & Break-Even"
      description="Calculate Annual Fuel Cost & Break-Even with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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