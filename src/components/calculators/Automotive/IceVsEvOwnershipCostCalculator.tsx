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

export default function IceVsEvOwnershipCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    annualMileage: "15000",
    fuelPrice: "1.5", // $/liter or $/gallon
    electricityPrice: "0.13", // $/kWh
    iceFuelEfficiency: "8", // L/100km or MPG (converted)
    evEfficiency: "15", // kWh/100km
    icePurchasePrice: "30000",
    evPurchasePrice: "40000",
    iceMaintenanceCost: "1000", // per year
    evMaintenanceCost: "500", // per year
    years: "5"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const unit = inputs.unit;
    const years = parseFloat(inputs.years);
    const annualMileage = parseFloat(inputs.annualMileage);
    const fuelPrice = parseFloat(inputs.fuelPrice);
    const electricityPrice = parseFloat(inputs.electricityPrice);
    const iceFuelEfficiency = parseFloat(inputs.iceFuelEfficiency);
    const evEfficiency = parseFloat(inputs.evEfficiency);
    const icePurchasePrice = parseFloat(inputs.icePurchasePrice);
    const evPurchasePrice = parseFloat(inputs.evPurchasePrice);
    const iceMaintenanceCost = parseFloat(inputs.iceMaintenanceCost);
    const evMaintenanceCost = parseFloat(inputs.evMaintenanceCost);

    if (
      isNaN(years) || isNaN(annualMileage) || isNaN(fuelPrice) || isNaN(electricityPrice) ||
      isNaN(iceFuelEfficiency) || isNaN(evEfficiency) || isNaN(icePurchasePrice) || isNaN(evPurchasePrice) ||
      isNaN(iceMaintenanceCost) || isNaN(evMaintenanceCost) ||
      years <= 0 || annualMileage <= 0 || fuelPrice <= 0 || electricityPrice <= 0 ||
      iceFuelEfficiency <= 0 || evEfficiency <= 0 || icePurchasePrice <= 0 || evPurchasePrice <= 0 ||
      iceMaintenanceCost < 0 || evMaintenanceCost < 0
    ) {
      return {
        mainQty: "-",
        unitLabel: "",
        cost: "Please enter valid positive numbers for all fields.",
        details: "",
        wasteInfo: ""
      };
    }

    // Convert fuel efficiency if imperial units
    // ICE fuel efficiency: L/100km (metric) or MPG (imperial)
    // EV efficiency: kWh/100km (metric) or kWh/100 miles (imperial)
    // For simplicity, convert all to metric internally

    let iceFuelLitersPer100km = iceFuelEfficiency;
    let evKwhPer100km = evEfficiency;
    let mileageKm = annualMileage;
    let fuelCostPerLiter = fuelPrice;
    let electricityCostPerKwh = electricityPrice;

    if (unit === "imperial") {
      // Convert MPG to L/100km: L/100km = 235.215 / MPG
      iceFuelLitersPer100km = 235.215 / iceFuelEfficiency;
      // Convert miles to km: 1 mile = 1.60934 km
      mileageKm = annualMileage * 1.60934;
      // EV efficiency: kWh/100 miles to kWh/100 km: divide by 1.60934
      evKwhPer100km = evEfficiency / 1.60934;
      // Fuel price per gallon to per liter: 1 gallon = 3.78541 liters
      fuelCostPerLiter = fuelPrice / 3.78541;
      // Electricity price assumed same unit ($/kWh)
    }

    // Calculate total fuel consumption over ownership period (liters)
    const totalIceFuelLiters = (iceFuelLitersPer100km * mileageKm * years) / 100;
    // Calculate total electricity consumption over ownership period (kWh)
    const totalEvKwh = (evKwhPer100km * mileageKm * years) / 100;

    // Calculate fuel cost over ownership period
    const totalIceFuelCost = totalIceFuelLiters * fuelCostPerLiter;
    const totalEvElectricityCost = totalEvKwh * electricityCostPerKwh;

    // Calculate maintenance cost over ownership period
    const totalIceMaintenance = iceMaintenanceCost * years;
    const totalEvMaintenance = evMaintenanceCost * years;

    // Total ownership cost = purchase price + fuel/electricity + maintenance
    const totalIceCost = icePurchasePrice + totalIceFuelCost + totalIceMaintenance;
    const totalEvCost = evPurchasePrice + totalEvElectricityCost + totalEvMaintenance;

    // Format currency
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return {
      mainQty: "",
      unitLabel: "",
      cost: "",
      details: "",
      wasteInfo: "",
      iceTotalCost: formatter.format(totalIceCost),
      evTotalCost: formatter.format(totalEvCost),
      iceFuelCost: formatter.format(totalIceFuelCost),
      evElectricityCost: formatter.format(totalEvElectricityCost),
      iceMaintenanceCost: formatter.format(totalIceMaintenance),
      evMaintenanceCost: formatter.format(totalEvMaintenance)
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What factors influence the total ownership cost comparison between ICE and EV vehicles over 5 years?",
      answer:
        "The total ownership cost over five years for Internal Combustion Engine (ICE) and Electric Vehicles (EV) depends on several critical factors. These include the initial purchase price, fuel or electricity consumption rates, maintenance expenses, and depreciation. ICE vehicles typically incur higher fuel costs due to gasoline or diesel consumption, which fluctuates with market prices and vehicle fuel efficiency measured in liters per 100 kilometers or miles per gallon. EVs, while often more expensive upfront, benefit from lower energy costs measured in kilowatt-hours per 100 kilometers and reduced maintenance due to fewer moving parts and no oil changes. Additionally, government incentives, charging infrastructure availability, and battery degradation rates can impact the long-term cost-effectiveness of EV ownership. Accurate estimation of these variables is essential for a reliable cost comparison."
    },
    {
      question: "How does annual mileage affect the cost efficiency between ICE and EV ownership?",
      answer:
        "Annual mileage is a pivotal factor in determining the cost efficiency between ICE and EV ownership. Higher mileage increases fuel consumption for ICE vehicles, leading to proportionally higher fuel expenses, which can significantly impact total ownership costs. Conversely, EVs tend to have more stable and often lower energy costs per kilometer, making them more economical as mileage increases. However, battery wear and potential replacement costs should be considered for very high mileage scenarios. Additionally, driving patterns, such as frequent short trips versus long-distance travel, influence energy efficiency and maintenance needs. Therefore, understanding your typical annual mileage helps in accurately forecasting and comparing the total cost of ownership over a five-year period."
    },
    {
      question: "Why is maintenance cost generally lower for EVs compared to ICE vehicles?",
      answer:
        "Electric Vehicles (EVs) generally incur lower maintenance costs than Internal Combustion Engine (ICE) vehicles due to their simpler mechanical design. EVs lack components such as oil filters, spark plugs, exhaust systems, and complex transmissions, which require regular servicing and replacement in ICE vehicles. The electric motor and battery system have fewer moving parts, reducing wear and tear and the likelihood of mechanical failures. Additionally, regenerative braking in EVs decreases brake wear, further lowering maintenance expenses. However, EVs may require specialized battery maintenance and software updates, but these costs are typically less frequent and less expensive than traditional ICE vehicle maintenance. This fundamental difference contributes significantly to the total cost of ownership advantage of EVs over a five-year span."
    },
    {
      question: "How do fuel and electricity prices impact the ownership cost comparison?",
      answer:
        "Fuel and electricity prices are dynamic variables that substantially impact the ownership cost comparison between ICE and EV vehicles. Gasoline and diesel prices are subject to geopolitical events, refining capacity, and seasonal demand fluctuations, often leading to volatility in fuel costs. In contrast, electricity prices tend to be more stable but can vary based on regional energy sources, grid demand, and time-of-use rates. Higher fuel prices increase the operational cost of ICE vehicles, making EVs more economically attractive, especially in regions with low-cost or renewable electricity. Conversely, in areas with expensive electricity or limited charging infrastructure, the cost advantage of EVs may diminish. Therefore, accurate and region-specific pricing data is crucial for precise ownership cost calculations."
    },
    {
      question: "What role does vehicle efficiency play in calculating ownership costs?",
      answer:
        "Vehicle efficiency is a fundamental parameter in calculating ownership costs as it directly influences energy consumption and associated expenses. For ICE vehicles, fuel efficiency is commonly expressed in liters per 100 kilometers (L/100km) or miles per gallon (MPG), indicating how much fuel is consumed over a distance. Higher efficiency means less fuel consumption and lower operating costs. For EVs, efficiency is measured in kilowatt-hours per 100 kilometers (kWh/100km), reflecting the electric energy used. Efficient EVs consume less electricity, reducing charging costs and extending driving range. Variations in driving conditions, vehicle load, and maintenance can affect efficiency. Accurate efficiency metrics ensure precise estimation of fuel or electricity costs, which are significant components of total ownership expenses."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on fuel economy, vehicle technologies, and cost comparisons for ICE and EV vehicles.",
      url: "https://afdc.energy.gov/"
    },
    {
      title: "International Energy Agency (IEA) - Global EV Outlook",
      description: "Annual report providing insights into electric vehicle market trends, costs, and policies worldwide.",
      url: "https://www.iea.org/reports/global-ev-outlook-2023"
    },
    {
      title: "Consumer Reports - Electric Vehicle Ownership Costs",
      description: "Detailed analysis of EV vs ICE ownership costs including maintenance, fuel, and depreciation.",
      url: "https://www.consumerreports.org/hybrids-evs/electric-vehicle-ownership-costs/"
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
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUTS FOR: ICE vs EV OWNERSHIP COST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Annual Mileage ({inputs.unit === "metric" ? "km" : "miles"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Years of Ownership</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "metric" ? "Fuel Price ($/liter)" : "Fuel Price ($/gallon)"}</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Price ($/kWh)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={inputs.electricityPrice}
            onChange={(e) => handleInputChange("electricityPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "metric" ? "ICE Fuel Efficiency (L/100km)" : "ICE Fuel Efficiency (MPG)"}</Label>
          <Input
            type="number"
            min={0}
            step={0.1}
            value={inputs.iceFuelEfficiency}
            onChange={(e) => handleInputChange("iceFuelEfficiency", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "metric" ? "EV Efficiency (kWh/100km)" : "EV Efficiency (kWh/100 miles)"}</Label>
          <Input
            type="number"
            min={0}
            step={0.1}
            value={inputs.evEfficiency}
            onChange={(e) => handleInputChange("evEfficiency", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>ICE Vehicle Purchase Price ($)</Label>
          <Input
            type="number"
            min={0}
            step={100}
            value={inputs.icePurchasePrice}
            onChange={(e) => handleInputChange("icePurchasePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Purchase Price ($)</Label>
          <Input
            type="number"
            min={0}
            step={100}
            value={inputs.evPurchasePrice}
            onChange={(e) => handleInputChange("evPurchasePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>ICE Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min={0}
            step={10}
            value={inputs.iceMaintenanceCost}
            onChange={(e) => handleInputChange("iceMaintenanceCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min={0}
            step={10}
            value={inputs.evMaintenanceCost}
            onChange={(e) => handleInputChange("evMaintenanceCost", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => { /* No explicit action needed, calculation is reactive */ }}
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {typeof results.cost === "string" && results.cost.startsWith("Please") ? (
        <Card className="mt-6 bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 shadow-md">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-300 font-semibold">
            {results.cost}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase mb-4 block">
              Estimated Total Ownership Cost (5 years)
            </span>
            <div className="grid grid-cols-2 gap-6 text-left max-w-md mx-auto">
              <div>
                <h3 className="font-bold text-lg text-blue-600 mb-1 flex items-center gap-2">
                  <Box className="w-5 h-5" /> ICE Vehicle
                </h3>
                <p className="text-xl font-extrabold">{results.iceTotalCost}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Fuel: {results.iceFuelCost} <br />
                  Maintenance: {results.iceMaintenanceCost}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-600 mb-1 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" /> EV
                </h3>
                <p className="text-xl font-extrabold">{results.evTotalCost}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Electricity: {results.evElectricityCost} <br />
                  Maintenance: {results.evMaintenanceCost}
                </p>
              </div>
            </div>
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
            <strong>Step 1: Select Units</strong> - Choose between Metric (kilometers, liters) or Imperial (miles, gallons) units to match your local standards.
          </li>
          <li>
            <strong>Step 2: Enter Annual Mileage and Ownership Duration</strong> - Input your expected yearly driving distance and how many years you plan to own the vehicle.
          </li>
          <li>
            <strong>Step 3: Input Fuel and Electricity Prices</strong> - Provide current local prices for gasoline/diesel and electricity per unit to ensure accurate operational cost estimates.
          </li>
          <li>
            <strong>Step 4: Enter Vehicle Efficiency and Costs</strong> - Fill in fuel efficiency for ICE (L/100km or MPG), EV energy consumption (kWh/100km or kWh/100 miles), purchase prices, and annual maintenance costs.
          </li>
          <li>
            <strong>Step 5: Calculate</strong> - Click the calculate button to view a detailed comparison of total ownership costs over the selected period.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to ICE vs EV Ownership Cost (5 years)
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Comparing the ownership costs of Internal Combustion Engine (ICE) vehicles and Electric Vehicles (EVs) over a five-year period requires a comprehensive understanding of multiple engineering and economic factors. The initial purchase price, while important, is only one component of total cost. Operational expenses such as fuel or electricity consumption, maintenance, and depreciation significantly influence the overall financial impact. Precise calculations are essential to avoid underestimating costs, which can affect budgeting and long-term financial planning. This calculator uses standard construction calculation logic adapted for automotive cost analysis, ensuring reliable and actionable results.
          </p>
          <p>
            The materials in this context refer to the energy sources and vehicle components. ICE vehicles rely on fossil fuels, with fuel efficiency measured in liters per 100 kilometers or miles per gallon, which directly affects fuel consumption and emissions. EVs utilize electrical energy stored in batteries, with efficiency expressed in kilowatt-hours per 100 kilometers or miles. Understanding these efficiency metrics is crucial, as they dictate the energy cost component of ownership. Maintenance considerations also differ; ICE vehicles require regular oil changes, exhaust system repairs, and engine tune-ups, whereas EVs benefit from fewer moving parts and regenerative braking, reducing wear and tear.
          </p>
          <p>
            Economically, over-ordering or underestimating costs can lead to budget overruns or missed savings opportunities. Overestimating fuel prices or maintenance costs may discourage EV adoption despite potential savings, while underestimating them can result in unexpected expenses. Accurate data input and understanding of local market conditions, such as fluctuating fuel prices or electricity tariffs, are vital. This ensures that the cost comparison reflects real-world scenarios, enabling consumers and fleet managers to make informed decisions that optimize efficiency, reduce environmental impact, and enhance financial outcomes.
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
            <strong>1. Ignoring Unit Conversions:</strong> Mixing metric and imperial units without proper conversion leads to inaccurate fuel efficiency and cost calculations, skewing the ownership cost comparison.
          </p>
          <p>
            <strong>2. Using Outdated or Regional Average Prices:</strong> Fuel and electricity prices vary widely by location and time. Using generic or outdated prices can misrepresent actual costs, affecting decision-making.
          </p>
          <p>
            <strong>3. Overlooking Maintenance Differences:</strong> Assuming maintenance costs are equal for ICE and EV vehicles ignores the significant savings EVs offer due to fewer mechanical components and less frequent servicing.
          </p>
          <p>
            <strong>4. Neglecting Driving Patterns:</strong> Not accounting for annual mileage or driving habits can cause under- or overestimation of energy consumption, impacting total cost projections.
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
      title="ICE vs EV Ownership Cost (5 years)"
      description="Calculate ICE vs EV Ownership Cost (5 years) with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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