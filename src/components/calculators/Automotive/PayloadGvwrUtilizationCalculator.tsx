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

export default function PayloadGvwrUtilizationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    curbWeight: "",
    payloadCapacity: "",
    gvwr: "",
    price: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const curbWeight = parseFloat(inputs.curbWeight);
    const payloadCapacity = parseFloat(inputs.payloadCapacity);
    const gvwr = parseFloat(inputs.gvwr);
    const price = parseFloat(inputs.price);
    const unit = inputs.unit;

    if (
      isNaN(curbWeight) ||
      isNaN(payloadCapacity) ||
      isNaN(gvwr) ||
      curbWeight <= 0 ||
      payloadCapacity <= 0 ||
      gvwr <= 0 ||
      gvwr < curbWeight
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers. GVWR must be greater than or equal to curb weight.",
        feedback: "Input error"
      };
    }

    // Calculate total vehicle weight when fully loaded
    const totalLoadedWeight = curbWeight + payloadCapacity;

    // Calculate payload utilization percentage relative to GVWR
    // Payload utilization = (Payload Capacity) / (GVWR - Curb Weight) * 100%
    // GVWR - curbWeight = max payload allowed
    const maxPayloadAllowed = gvwr - curbWeight;
    const payloadUtilizationPercent = (payloadCapacity / maxPayloadAllowed) * 100;

    // Calculate GVWR utilization percentage relative to total loaded weight
    // GVWR utilization = (Total Loaded Weight) / GVWR * 100%
    const gvwrUtilizationPercent = (totalLoadedWeight / gvwr) * 100;

    // Financial insight: cost per pound of payload capacity
    let costPerPayloadUnit = null;
    if (!isNaN(price) && price > 0) {
      costPerPayloadUnit = price / payloadCapacity;
    }

    // Format results based on unit system
    const unitPayload = unit === "imperial" ? "lbs" : "kg";
    const unitWeight = unitPayload;

    return {
      primary: `${payloadUtilizationPercent.toFixed(1)}%`,
      secondary: costPerPayloadUnit ? `$${costPerPayloadUnit.toFixed(2)} per ${unitPayload}` : "Price not provided",
      details: `Payload Capacity: ${payloadCapacity.toFixed(1)} ${unitPayload} | GVWR Utilization: ${gvwrUtilizationPercent.toFixed(1)}%`,
      feedback:
        payloadUtilizationPercent > 100
          ? "Warning: Payload exceeds maximum allowed by GVWR!"
          : payloadUtilizationPercent > 90
          ? "High payload utilization - be cautious."
          : "Payload utilization within safe limits."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the difference between payload capacity and GVWR?",
      answer: "Payload capacity is the maximum weight your vehicle can carry in cargo and passengers, while GVWR (Gross Vehicle Weight Rating) is the maximum total weight the vehicle is designed to support, including the vehicle itself. For example, a truck with a GVWR of 10,000 lbs and a curb weight of 6,500 lbs has a payload capacity of 3,500 lbs. Understanding this distinction is critical for safe loading and legal compliance.",
    },
    {
      question: "How do I calculate my remaining payload capacity?",
      answer: "Subtract your vehicle's current weight from its GVWR rating. If your pickup truck has a GVWR of 12,000 lbs and currently weighs 7,800 lbs (including passengers), your remaining payload capacity is 4,200 lbs. Always account for all passengers, fuel, and accessories when calculating current weight to ensure accurate results.",
    },
    {
      question: "What happens if I exceed my vehicle's GVWR?",
      answer: "Exceeding GVWR can cause brake failure, tire blowouts, suspension damage, and loss of vehicle control, creating serious safety hazards and potential legal liability. Most insurance policies do not cover accidents resulting from exceeding GVWR limits. Heavy fines ranging from $100 to $500 can also be imposed during inspections in many jurisdictions.",
    },
    {
      question: "How does trailer weight affect my vehicle's payload capacity?",
      answer: "Trailer tongue weight (typically 10-15% of total trailer weight) counts against your vehicle's payload capacity, not your GVWR directly. For example, if you're towing a 5,000 lb trailer with 600 lbs tongue weight, that 600 lbs reduces your available payload capacity by exactly that amount. Never confuse towing capacity with payload capacity when loading your vehicle.",
    },
    {
      question: "What is the typical GVWR for common vehicle types?",
      answer: "Half-ton pickup trucks typically have GVWRs between 9,200 and 10,500 lbs, three-quarter-ton trucks range from 12,000 to 14,000 lbs, and one-ton trucks can reach 16,000 to 19,500 lbs. Full-size SUVs generally fall between 10,000 and 12,500 lbs, while compact vehicles are typically rated under 8,500 lbs. Always verify your specific vehicle's GVWR on the driver's door jamb placard.",
    },
    {
      question: "Where can I find my vehicle's GVWR and payload capacity?",
      answer: "Your vehicle's GVWR and payload capacity are printed on a safety placard located on the driver's side door jamb. You can also find this information in your owner's manual, on the manufacturer's website, or by calling your vehicle's dealer with your VIN. Never rely on assumptions or estimates—always reference the official manufacturer specifications for your exact vehicle year and configuration.",
    },
    {
      question: "Does fuel weight count toward my payload capacity?",
      answer: "Yes, fuel weight is included in your vehicle's current weight calculation and directly reduces available payload capacity. A full tank of gasoline weighs approximately 150-200 lbs depending on vehicle type, while diesel fuel weighs about 175-225 lbs. When maximizing payload, account for fuel consumption throughout your trip to better understand your actual carrying capacity at any given time.",
    },
    {
      question: "How do I calculate payload utilization percentage?",
      answer: "Divide your current cargo weight by your maximum payload capacity and multiply by 100. For example, if you're carrying 2,000 lbs of cargo with a 3,500 lb payload capacity, your utilization is 57%. Most safety experts recommend staying below 85% utilization to maintain adequate braking performance and vehicle control, with 70-80% being optimal for heavy-duty work.",
    },
    {
      question: "Can upgrading my suspension increase my GVWR?",
      answer: "No, GVWR is a manufacturer rating based on the vehicle's frame, brakes, and structural design and cannot be legally increased through aftermarket upgrades. Upgrades like heavier springs or air suspensions can improve ride quality and load distribution, but they don't change the GVWR legal limit. Exceeding manufacturer GVWR is illegal regardless of suspension modifications and will void your vehicle's warranty.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 pickup truck with a curb weight of 5,000 lbs, a payload capacity of 1,500 lbs, and a GVWR of 6,500 lbs. You want to understand how efficiently you are using the payload and GVWR limits.",
    steps: [
      {
        label: "Step 1: Calculate maximum payload allowed",
        explanation: "GVWR - Curb Weight = 6,500 lbs - 5,000 lbs = 1,500 lbs"
      },
      {
        label: "Step 2: Calculate payload utilization percentage",
        explanation: "Payload Capacity / Max Payload Allowed × 100 = 1,500 / 1,500 × 100 = 100%"
      },
      {
        label: "Step 3: Calculate GVWR utilization percentage",
        explanation: "Total Loaded Weight / GVWR × 100 = (5,000 + 1,500) / 6,500 × 100 = 100%"
      },
      {
        label: "Step 4: Calculate cost per pound of payload",
        explanation: "Price / Payload Capacity = $40,000 / 1,500 lbs = $26.67 per lb"
      }
    ],
    result:
      "The truck is fully utilizing its payload and GVWR limits at 100%. The cost per pound of payload capacity is $26.67, helping you understand the financial efficiency of the vehicle."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for vehicle weight ratings and fuel economy data."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, specifications, and buying advice."
    },
    {
      title: "NHTSA Vehicle Weight Ratings",
      description: "National Highway Traffic Safety Administration guidelines on GVWR and payload."
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
            <SelectItem value="imperial">Imperial (lbs)</SelectItem>
            <SelectItem value="metric">Metric (kg)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Curb Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            value={inputs.curbWeight}
            onChange={(e) => handleInputChange("curbWeight", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "4000" : "1800"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Payload Capacity ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            value={inputs.payloadCapacity}
            onChange={(e) => handleInputChange("payloadCapacity", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "1500" : "680"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>GVWR (Gross Vehicle Weight Rating) ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            value={inputs.gvwr}
            onChange={(e) => handleInputChange("gvwr", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "6500" : "2950"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Price (optional, USD)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="e.g. 40000"
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
            <p className="mt-2 font-semibold text-sm text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Payload & GVWR Utilization Helper</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Payload & GVWR Utilization Helper is designed to help vehicle owners accurately calculate how much weight they can safely carry based on their specific vehicle's specifications. This calculator prevents dangerous overloading situations that can lead to brake failure, tire blowouts, suspension damage, and potential legal penalties ranging from $100 to $500. Whether you're hauling construction materials, camping gear, or recreational equipment, understanding your vehicle's weight limits is essential for safety and compliance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need three key pieces of information: your vehicle's GVWR (found on the driver's side door jamb placard), your vehicle's current curb weight (dry weight without cargo), and the combined weight of all passengers and cargo you plan to carry. The calculator also accommodates trailer tongue weight for those towing equipment, which is typically 10-15% of the trailer's total weight. Accuracy in these inputs is critical—estimate conservatively and weigh items when possible rather than guessing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs your remaining payload capacity and your utilization percentage, which indicates how fully you're using your vehicle's weight budget. Most safety experts recommend staying below 85% utilization to maintain optimal braking performance and vehicle handling, with 70-80% being ideal for heavy-duty work or longer trips. If your calculation shows utilization above 100%, you must redistribute or remove cargo immediately—exceeding GVWR is illegal, violates your warranty, and creates serious safety hazards.</p>
        </div>
      </section>

      {/* TABLE: GVWR & Payload Capacity by Vehicle Class (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">GVWR & Payload Capacity by Vehicle Class (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical GVWR and payload capacity ranges for common vehicle classes according to manufacturer specifications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical GVWR Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Payload Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Curb Weight Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500–8,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600–1,200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,900–7,400 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,200–9,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800–1,600 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,400–8,200 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,800–10,200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200–2,100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,600–8,900 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–12,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–3,200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,200–10,100 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half-Ton Pickup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,200–10,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,700–7,400 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Three-Quarter-Ton Pickup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000–14,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–5,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,500–9,200 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">One-Ton Pickup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16,000–19,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–8,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11,000–12,500 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Van</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,500–11,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500–8,500 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">GVWR and payload values vary significantly based on engine, transmission, drivetrain, and equipment packages. Always verify exact specifications on your vehicle's door jamb placard.</p>
      </section>

      {/* TABLE: Weight Distribution Impact on Payload Utilization */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight Distribution Impact on Payload Utilization</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different loading configurations affect payload utilization percentage and vehicle performance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cargo Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Payload Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Utilization %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safety Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light Load (Day Trip)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Load (Typical Use)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavy Load (Recommended Max)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,975 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acceptable</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overload (Unsafe)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,850 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dangerous</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Utilization above 85% increases braking distance, tire wear, and suspension stress. Exceeding 100% is illegal and voids manufacturer warranty.</p>
      </section>

      {/* TABLE: Common Items & Their Weight Impact on Payload */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Items & Their Weight Impact on Payload</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This reference table shows the weight of frequently transported items to help you calculate accurate payload utilization.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Item Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact on Payload %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Tank of Gasoline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Tank of Diesel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175–225 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–6% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Passenger (Average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–6% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pickup Bed Tonneau Cover</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–150 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gravel or Sand (1 cubic yard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–2,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57–71% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Construction Materials (Mixed Load)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">ATV or Motorcycle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–800 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11–23% (3,500 lb capacity)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Camping Gear & Equipment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–600 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–17% (3,500 lb capacity)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are approximate weights; actual values vary by product, brand, and material. Always weigh loads when possible for precise calculations.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always locate and record your vehicle's GVWR from the driver's side door jamb placard before using the calculator—never assume or estimate based on vehicle class or year. The placard also shows your vehicle's front and rear GAWR (Gross Axle Weight Rating), which provides additional safety constraints beyond total GVWR.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all weight when calculating current vehicle weight, including fuel (typically 150-200 lbs for gasoline, 175-225 lbs for diesel), passengers, and permanent accessories like tonneau covers, racks, or toolboxes. Many owners overlook these additions and miscalculate their actual payload capacity by 200-400 lbs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For towing situations, remember that tongue weight (10-15% of trailer weight) counts directly against your payload capacity, not your towing capacity. A 5,000 lb trailer with 600 lbs tongue weight reduces your available payload by exactly 600 lbs, so plan your vehicle's cargo accordingly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Distribute cargo weight evenly front-to-back and side-to-side within your vehicle's bed or cargo area to avoid exceeding individual axle weight limits. Even if total GVWR is within limits, exceeding front or rear GAWR can cause handling issues and brake imbalance. Check your door jamb placard for GAWR limits before finalizing your load configuration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your utilization percentage regularly during the trip—if you start at 75% utilization and consume 100 lbs of fuel, your utilization drops to approximately 72%, giving you additional safety margin. Plan fuel consumption into longer trips to understand how your effective payload capacity changes throughout your journey.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Towing Capacity with Payload Capacity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many vehicle owners believe their truck's towing capacity (15,000+ lbs) also represents payload capacity, when in fact payload is typically only 3,500-5,500 lbs for the same vehicle. Trailer tongue weight counts against payload, not just towing limits, so exceeding payload capacity is common when both towing and loading cargo simultaneously.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Fuel Weight in Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A full tank of fuel adds 150-225 lbs to your vehicle's current weight and directly reduces available payload capacity. Owners frequently calculate payload based on 'empty fuel tank' assumptions, then add cargo and exceed GVWR when they refuel, creating a dangerous overweight condition.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Estimated or Assumed GVWR Instead of Official Specs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">GVWR varies significantly within the same vehicle model based on engine, transmission, wheelbase, and optional packages. Relying on internet estimates or 'typical' GVWR for your vehicle class instead of reading your door jamb placard can result in overloading by 500+ lbs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Axle Weight Limits (GAWR)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even if your total GVWR is not exceeded, exceeding front or rear GAWR (shown on the door jamb placard) can cause serious handling and braking problems. Loading all cargo toward the rear axle while staying under GVWR can still violate rear GAWR limits and create unsafe conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Permanent Accessory Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tonneau covers, bed racks, toolboxes, and other aftermarket additions weigh 80-300 lbs and are part of your vehicle's curb weight. Owners often forget these additions when calculating payload, leading to overloading situations that sneak up gradually with added equipment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between payload capacity and GVWR?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Payload capacity is the maximum weight your vehicle can carry in cargo and passengers, while GVWR (Gross Vehicle Weight Rating) is the maximum total weight the vehicle is designed to support, including the vehicle itself. For example, a truck with a GVWR of 10,000 lbs and a curb weight of 6,500 lbs has a payload capacity of 3,500 lbs. Understanding this distinction is critical for safe loading and legal compliance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my remaining payload capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract your vehicle's current weight from its GVWR rating. If your pickup truck has a GVWR of 12,000 lbs and currently weighs 7,800 lbs (including passengers), your remaining payload capacity is 4,200 lbs. Always account for all passengers, fuel, and accessories when calculating current weight to ensure accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I exceed my vehicle's GVWR?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exceeding GVWR can cause brake failure, tire blowouts, suspension damage, and loss of vehicle control, creating serious safety hazards and potential legal liability. Most insurance policies do not cover accidents resulting from exceeding GVWR limits. Heavy fines ranging from $100 to $500 can also be imposed during inspections in many jurisdictions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does trailer weight affect my vehicle's payload capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Trailer tongue weight (typically 10-15% of total trailer weight) counts against your vehicle's payload capacity, not your GVWR directly. For example, if you're towing a 5,000 lb trailer with 600 lbs tongue weight, that 600 lbs reduces your available payload capacity by exactly that amount. Never confuse towing capacity with payload capacity when loading your vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical GVWR for common vehicle types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Half-ton pickup trucks typically have GVWRs between 9,200 and 10,500 lbs, three-quarter-ton trucks range from 12,000 to 14,000 lbs, and one-ton trucks can reach 16,000 to 19,500 lbs. Full-size SUVs generally fall between 10,000 and 12,500 lbs, while compact vehicles are typically rated under 8,500 lbs. Always verify your specific vehicle's GVWR on the driver's door jamb placard.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Where can I find my vehicle's GVWR and payload capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your vehicle's GVWR and payload capacity are printed on a safety placard located on the driver's side door jamb. You can also find this information in your owner's manual, on the manufacturer's website, or by calling your vehicle's dealer with your VIN. Never rely on assumptions or estimates—always reference the official manufacturer specifications for your exact vehicle year and configuration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does fuel weight count toward my payload capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, fuel weight is included in your vehicle's current weight calculation and directly reduces available payload capacity. A full tank of gasoline weighs approximately 150-200 lbs depending on vehicle type, while diesel fuel weighs about 175-225 lbs. When maximizing payload, account for fuel consumption throughout your trip to better understand your actual carrying capacity at any given time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate payload utilization percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your current cargo weight by your maximum payload capacity and multiply by 100. For example, if you're carrying 2,000 lbs of cargo with a 3,500 lb payload capacity, your utilization is 57%. Most safety experts recommend staying below 85% utilization to maintain adequate braking performance and vehicle control, with 70-80% being optimal for heavy-duty work.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can upgrading my suspension increase my GVWR?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, GVWR is a manufacturer rating based on the vehicle's frame, brakes, and structural design and cannot be legally increased through aftermarket upgrades. Upgrades like heavier springs or air suspensions can improve ride quality and load distribution, but they don't change the GVWR legal limit. Exceeding manufacturer GVWR is illegal regardless of suspension modifications and will void your vehicle's warranty.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhtsa.gov/vehicle-owners/vehicle-information-label-vin" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHTSA - Vehicle Information Label Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance from the National Highway Traffic Safety Administration on reading and interpreting GVWR and payload capacity information on vehicle door jambs.</p>
          </li>
          <li>
            <a href="https://www.fmcsa.dot.gov/regulations/title-49-transportation/part-658-over-dimensional-overweight-vehicles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Motor Carrier Safety Administration (FMCSA) - Weight & Dimension Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive regulations on vehicle weight limits, penalties for overloading, and compliance requirements for commercial and personal vehicle operations.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/car-safety/how-to-load-your-vehicle-safely/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - Safe Vehicle Loading Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical guidance on safe vehicle loading, weight distribution, and how exceeding GVWR affects braking, handling, and tire performance.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j2030/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International - Vehicle Weight Specifications Standard J2030</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard for how manufacturers calculate and display GVWR, payload capacity, and axle weight ratings on all passenger vehicles and light trucks.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Payload & GVWR Utilization Helper"
      description="Professional automotive calculator: Payload & GVWR Utilization Helper. Get accurate estimates, expert advice, and financial insights."
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