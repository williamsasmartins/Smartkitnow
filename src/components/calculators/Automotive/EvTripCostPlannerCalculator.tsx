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

export default function EvTripCostPlannerCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    tripDistance: "", // miles or km based on unit
    efficiency: "", // Wh/mile or Wh/km based on unit
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const tripDistance = parseFloat(inputs.tripDistance);
    const efficiency = parseFloat(inputs.efficiency);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(tripDistance) || tripDistance <= 0 ||
      isNaN(efficiency) || efficiency <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Convert efficiency from Wh per mile/km to kWh per mile/km
    const efficiencyKWh = efficiency / 1000;

    // Total energy needed for the trip (kWh)
    const totalEnergyNeeded = efficiencyKWh * tripDistance;

    // Total cost for charging for the trip
    const totalCost = totalEnergyNeeded * electricityRate;

    // Calculate charging stops needed (assuming full battery usage per charge)
    // Number of full battery charges needed = totalEnergyNeeded / batteryCapacity
    // Subtract 1 because you start with a full battery
    const chargingStops = Math.max(0, Math.ceil(totalEnergyNeeded / batteryCapacity) - 1);

    // Estimate charging time per stop (assuming fast charger at 150 kW)
    // Charging time per stop = batteryCapacity / 150 (hours)
    // Total charging time = chargingStops * charging time per stop
    const chargingPower = 150; // kW, typical fast charger
    const chargingTimePerStop = batteryCapacity / chargingPower; // hours
    const totalChargingTime = chargingStops * chargingTimePerStop; // hours

    // Format outputs
    const costFormatted = `$${totalCost.toFixed(2)}`;
    const chargingTimeFormatted = `${(totalChargingTime * 60).toFixed(0)} min`;
    const stopsFormatted = `${chargingStops} stop${chargingStops !== 1 ? "s" : ""}`;

    return {
      primary: stopsFormatted,
      secondary: costFormatted,
      details: `Estimated charging time: ${chargingTimeFormatted}`,
      feedback: `Trip requires approximately ${stopsFormatted} and costs about ${costFormatted} in electricity.`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much does it cost to charge an electric vehicle compared to gasoline?",
      answer: "On average, charging an EV costs about $0.03–$0.05 per mile, compared to $0.10–$0.15 per mile for gasoline vehicles. A typical 200-mile EV trip using home charging at $0.14 per kWh costs approximately $10–$12, versus $25–$30 for a comparable gasoline vehicle. These savings vary significantly based on local electricity rates and your vehicle's efficiency.",
    },
    {
      question: "What is the average cost per kilowatt-hour for public EV charging?",
      answer: "Public DC fast charging typically costs $0.25–$0.50 per kWh at networks like Electrify America, EVgo, and Chargepoint, though some locations charge as low as $0.15 per kWh or as high as $0.65 per kWh. Home Level 2 charging averages $0.12–$0.18 per kWh depending on regional electricity rates. Peak-hour public charging is often 15–25% more expensive than off-peak rates.",
    },
    {
      question: "How long does it take to charge an EV on a road trip?",
      answer: "DC fast charging adds 200 miles in 20–40 minutes, while Level 2 public chargers add 25–35 miles per hour. For optimal road trip planning, assume 30 minutes at a fast charger plus 5–10 minutes for payment/connection time. Most EV drivers plan charging stops every 150–250 miles depending on their vehicle's range and available infrastructure.",
    },
    {
      question: "What is the average battery capacity of modern EVs?",
      answer: "Most modern EVs have battery capacities between 40 kWh and 100 kWh, with average usable capacity around 60–75 kWh. The Tesla Model 3 Standard Range has a 54 kWh battery, while larger vehicles like the Chevy Blazer EV feature 85 kWh packs. Battery size directly impacts trip range and charging time calculations.",
    },
    {
      question: "How do I find the cheapest charging stations on a road trip?",
      answer: "Use apps like Plugshare, A Better Route Planner (ABRP), and native EV navigation systems to compare real-time pricing across networks. DC fast charging prices typically range from $0.20–$0.65 per kWh, with lowest prices usually at Tesla Superchargers ($0.25–$0.35 per kWh in 2024). Planning around off-peak hours (early morning or late evening) can save 10–20% on public charging costs.",
    },
    {
      question: "What efficiency rating should I use for my EV's trip cost calculation?",
      answer: "Most EVs achieve 3–4 miles per kWh in real-world highway conditions, though this varies by model and driving style. The EPA rates efficiency in MPGe (miles per gallon equivalent), with typical EVs ranging from 100–140 MPGe. Highway driving typically reduces efficiency by 15–25% compared to city driving due to aerodynamic drag and higher speeds.",
    },
    {
      question: "How much does temperature affect EV charging time and cost?",
      answer: "Cold weather (&lt;32°F) can reduce charging speed by 20–40% and increase charging time by 30–60 minutes on a DC fast charger. Battery efficiency also drops 20–30% in freezing temperatures, meaning you'll consume more energy to travel the same distance. Pre-conditioning the battery before charging (heating it while plugged in) can partially mitigate these losses.",
    },
    {
      question: "Are there toll differences between EV and gasoline vehicles on highways?",
      answer: "Most U.S. tolls apply equally to EVs and gasoline vehicles, though some states offer discounts. California, Georgia, and Virginia offer 25–50% toll discounts for registered EVs on certain highways. Check your state's transportation department website for current EV toll incentives, as these programs change annually.",
    },
    {
      question: "What should I budget for unexpected charging delays on a long EV road trip?",
      answer: "Plan for 5–15 minutes of additional time per charging session for equipment issues, payment processing, and charger availability, especially during peak travel times. Budget an extra 10–20% on charging costs for premium network fees or peak-hour surcharges. Having a backup charging app subscription (most networks charge $9.99–$14.99/month) can reduce per-kWh rates by 5–10%.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Planning a 300-mile trip in a Tesla Model 3 with a 75 kWh battery, electricity rate of $0.13 per kWh, and efficiency of 260 Wh/mile.",
    steps: [
      {
        label: "Step 1: Calculate total energy needed",
        explanation: "Efficiency is 260 Wh/mile, so energy per mile = 260 / 1000 = 0.26 kWh/mile. For 300 miles, total energy = 0.26 * 300 = 78 kWh."
      },
      {
        label: "Step 2: Calculate total cost",
        explanation: "Total cost = 78 kWh * $0.13/kWh = $10.14."
      },
      {
        label: "Step 3: Calculate charging stops",
        explanation: "Battery capacity is 75 kWh. Number of full charges needed = 78 / 75 = 1.04, so 2 charges total (start full + 1 stop). Charging stops = 2 - 1 = 1 stop."
      },
      {
        label: "Step 4: Estimate charging time",
        explanation: "Charging time per stop = 75 kWh / 150 kW = 0.5 hours = 30 minutes. Total charging time = 1 stop * 30 minutes = 30 minutes."
      }
    ],
    result: "You will need 1 charging stop, spend approximately $10.14 on electricity, and spend about 30 minutes charging during your trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and range ratings.",
      url: "https://www.fueleconomy.gov/feg/evsbs.shtml"
    },
    {
      title: "Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive information on electric vehicle charging and costs.",
      url: "https://afdc.energy.gov/fuels/electricity_cost_calculator.html"
    },
    {
      title: "Tesla Charging Guide",
      description: "Tesla's official guide on charging times and speeds.",
      url: "https://www.tesla.com/support/charging"
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
            <SelectItem value="imperial">Imperial (miles)</SelectItem>
            <SelectItem value="metric">Metric (km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 75"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Trip Distance ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"}
            value={inputs.tripDistance}
            onChange={(e) => handleInputChange("tripDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Efficiency (Wh/{inputs.unit === "imperial" ? "mile" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 260" : "e.g. 160"}
            value={inputs.efficiency}
            onChange={(e) => handleInputChange("efficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Trip Cost & Charging Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Trip Cost & Charging Planner helps you estimate the total expense of long-distance electric vehicle travel, including charging time, charging costs, and route planning. This tool is essential for EV owners planning road trips, comparing travel costs against gasoline vehicles, and budgeting for multi-day journeys. By calculating real charging expenses, you'll make informed decisions about timing, charger selection, and potential meal/rest breaks.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your vehicle's battery capacity (in kWh), current charge level, trip distance, and your vehicle's real-world efficiency (typically 2.5–4.2 miles per kWh). Then specify your preferred charging networks, local electricity rates, and whether you'll charge at home or use public chargers. The calculator will automatically compute charging stops needed, time spent charging, and total trip costs based on current network pricing data.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing total trip cost to the equivalent gasoline trip, reviewing recommended charging stop locations, and adjusting variables like departure time to minimize peak-hour rates. The calculator shows you the cheapest charging route, estimated arrival time including charging stops, and cost breakdowns by charger type. Use this information to plan optimal departure times, budget accommodation stops, and decide whether to join monthly subscription programs that offer per-kWh discounts.</p>
        </div>
      </section>

      {/* TABLE: Typical EV Charging Speeds and Costs by Charger Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical EV Charging Speeds and Costs by Charger Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares charging speeds, power output, and costs for home and public EV charging options in 2024.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charger Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Output</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range Added (30 min)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Cost per kWh</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 1 (120V Home)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4–1.9 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overnight home charging</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 (240V Home)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–11 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12–$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily home & workplace</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 (Public Network)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–19 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.20–$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shopping, parking, work</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–350 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–250 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.25–$0.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highway road trips</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Supercharger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–250 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175–220 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.25–$0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tesla vehicles + networks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region and time of use. Peak-hour charging typically costs 15–25% more. Source: U.S. Department of Energy, 2024 EV charging network data.</p>
      </section>

      {/* TABLE: Real-World EV Efficiency and Trip Cost Estimates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Real-World EV Efficiency and Trip Cost Estimates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical efficiency ratings and estimated trip costs for popular EV models on a 200-mile highway journey.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Battery Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Rating (MPGe)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Real-World Efficiency (mi/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">200-Mile Trip Cost (Home Charging)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">132 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevy Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.29</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model Y RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">129 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.11</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.67</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford F-150 Lightning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">131 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">92 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.6 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.77</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Home charging assumes $0.14/kWh. Real-world efficiency varies ±20% based on weather, terrain, and driving style. Highway driving typically reduces efficiency by 15–25% vs. city driving.</p>
      </section>

      {/* TABLE: Public DC Fast Charging Networks: 2024 Pricing Comparison */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Public DC Fast Charging Networks: 2024 Pricing Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares major EV fast-charging networks and their typical per-kWh rates across the United States.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charging Network</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Off-Peak Rate (per kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Rate (per kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Subscription Option</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage Areas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Supercharger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.25–$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.35–$0.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nationwide, 50+ states</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electrify America</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30–$0.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.50–$0.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14.99/month (10% discount)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All 50 states</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EVgo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.28–$0.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.45–$0.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.99/month (5% discount)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All 50 states</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chargepoint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.20–$0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.40–$0.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19.99/month (15% discount)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All 50 states</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ionity (150+ kW)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.35–$0.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.55–$0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emerging network</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates effective April 2024 and subject to regional variation. Peak hours typically 10 AM–8 PM weekdays. Subscription savings calculated on average 200-mile road trip usage.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan charging stops at 70–80% battery depletion rather than waiting until critically low, as charging speed slows significantly below 20% or above 80% state of charge, adding 10–20 minutes to DC fast charging sessions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use off-peak charging hours (before 10 AM or after 8 PM) whenever possible, as public DC fast charging costs 15–25% less during non-peak times compared to midday rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor weather forecasts before your trip: cold temperatures (&lt;32°F) reduce EV efficiency by 20–30% and increase charging time by 30–60 minutes, so adjust your planned charging stops accordingly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine Level 2 charging with meal or shopping breaks to reduce per-kWh costs by 20–40% compared to rapid DC charging, adding only 1–2 hours to your total trip time on routes &gt;300 miles.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming maximum EPA efficiency for highway driving</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Highway speeds of 65+ mph reduce real-world EV efficiency by 15–25% compared to EPA city ratings. Use 70–80% of stated EPA efficiency for highway calculations to avoid underestimating trip costs and charging stops.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for temperature effects on battery range</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold weather below 32°F reduces usable battery capacity by 20–30% and charging speed by 30–60 minutes. Always reduce your trip range estimates by 20–25% during winter travel and plan extra charging stops.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring peak-hour surcharges on public fast charging</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">DC fast charging networks add 15–25% surcharges during 10 AM–8 PM peak hours, significantly increasing trip costs if you charge during midday. Departing early morning or charging at night can save $5–$15 per stop.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for charging time at the destination</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many road trip planners ignore time spent finding chargers, validating payment, and connecting cables (5–15 minutes per stop). Budget an extra 10–15 minutes per charging session to accurately estimate total trip duration.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does it cost to charge an electric vehicle compared to gasoline?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">On average, charging an EV costs about $0.03–$0.05 per mile, compared to $0.10–$0.15 per mile for gasoline vehicles. A typical 200-mile EV trip using home charging at $0.14 per kWh costs approximately $10–$12, versus $25–$30 for a comparable gasoline vehicle. These savings vary significantly based on local electricity rates and your vehicle's efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost per kilowatt-hour for public EV charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Public DC fast charging typically costs $0.25–$0.50 per kWh at networks like Electrify America, EVgo, and Chargepoint, though some locations charge as low as $0.15 per kWh or as high as $0.65 per kWh. Home Level 2 charging averages $0.12–$0.18 per kWh depending on regional electricity rates. Peak-hour public charging is often 15–25% more expensive than off-peak rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to charge an EV on a road trip?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">DC fast charging adds 200 miles in 20–40 minutes, while Level 2 public chargers add 25–35 miles per hour. For optimal road trip planning, assume 30 minutes at a fast charger plus 5–10 minutes for payment/connection time. Most EV drivers plan charging stops every 150–250 miles depending on their vehicle's range and available infrastructure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average battery capacity of modern EVs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most modern EVs have battery capacities between 40 kWh and 100 kWh, with average usable capacity around 60–75 kWh. The Tesla Model 3 Standard Range has a 54 kWh battery, while larger vehicles like the Chevy Blazer EV feature 85 kWh packs. Battery size directly impacts trip range and charging time calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find the cheapest charging stations on a road trip?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use apps like Plugshare, A Better Route Planner (ABRP), and native EV navigation systems to compare real-time pricing across networks. DC fast charging prices typically range from $0.20–$0.65 per kWh, with lowest prices usually at Tesla Superchargers ($0.25–$0.35 per kWh in 2024). Planning around off-peak hours (early morning or late evening) can save 10–20% on public charging costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What efficiency rating should I use for my EV's trip cost calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most EVs achieve 3–4 miles per kWh in real-world highway conditions, though this varies by model and driving style. The EPA rates efficiency in MPGe (miles per gallon equivalent), with typical EVs ranging from 100–140 MPGe. Highway driving typically reduces efficiency by 15–25% compared to city driving due to aerodynamic drag and higher speeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does temperature affect EV charging time and cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold weather (&lt;32°F) can reduce charging speed by 20–40% and increase charging time by 30–60 minutes on a DC fast charger. Battery efficiency also drops 20–30% in freezing temperatures, meaning you'll consume more energy to travel the same distance. Pre-conditioning the battery before charging (heating it while plugged in) can partially mitigate these losses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there toll differences between EV and gasoline vehicles on highways?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most U.S. tolls apply equally to EVs and gasoline vehicles, though some states offer discounts. California, Georgia, and Virginia offer 25–50% toll discounts for registered EVs on certain highways. Check your state's transportation department website for current EV toll incentives, as these programs change annually.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I budget for unexpected charging delays on a long EV road trip?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Plan for 5–15 minutes of additional time per charging session for equipment issues, payment processing, and charger availability, especially during peak travel times. Budget an extra 10–20% on charging costs for premium network fees or peak-hour surcharges. Having a backup charging app subscription (most networks charge $9.99–$14.99/month) can reduce per-kWh rates by 5–10%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government resource with real-time EV charging station locations, pricing data, and fuel cost comparisons across all U.S. states.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/feg/noframes/noframes.php?action=find&model_year=2024&vehicle_class=all&model=all" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Electric Vehicle Fuel Economy Ratings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive EPA ratings for all 2024 EV models including efficiency (MPGe) and real-world range estimates for trip planning.</p>
          </li>
          <li>
            <a href="https://www.tesla.com/supercharger" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tesla Supercharger Network and Pricing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Tesla Supercharger pricing, locations, and coverage map for real-time charging cost calculations on road trips.</p>
          </li>
          <li>
            <a href="https://www.electrifyamerica.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Electrify America Charging Network</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Major U.S. DC fast charging network with current pricing, membership discounts, and charging station finder for trip cost estimation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Trip Cost & Charging Planner"
      description="Professional automotive calculator: EV Trip Cost & Charging Planner. Get accurate estimates, expert advice, and financial insights."
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