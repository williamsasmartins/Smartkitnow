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
      question: "What is payload capacity and why is it important?",
      answer:
        "Payload capacity is the maximum weight a vehicle can safely carry, including passengers and cargo. It is crucial because exceeding this limit can compromise vehicle handling, braking, and safety. Properly understanding payload capacity helps prevent damage and ensures compliance with safety regulations."
    },
    {
      question: "How does GVWR relate to payload capacity?",
      answer:
        "GVWR (Gross Vehicle Weight Rating) is the maximum total weight a vehicle can safely handle, including its own weight (curb weight) plus payload. Payload capacity is essentially the difference between GVWR and curb weight. Staying within GVWR ensures the vehicle operates safely without overloading."
    },
    {
      question: "Can I convert payload and GVWR between imperial and metric units?",
      answer:
        "Yes, payload and GVWR can be converted between pounds and kilograms. 1 pound equals approximately 0.4536 kilograms. This calculator supports both unit systems, allowing you to input and view results in your preferred measurement system."
    },
    {
      question: "What happens if I exceed the GVWR or payload capacity?",
      answer:
        "Exceeding GVWR or payload capacity can lead to severe safety risks such as reduced braking efficiency, tire failure, suspension damage, and loss of vehicle control. It also may void warranties and violate legal weight limits, potentially resulting in fines or penalties."
    },
    {
      question: "How can I use this calculator to make financial decisions?",
      answer:
        "By inputting the vehicle price and payload capacity, this calculator estimates the cost per unit of payload capacity. This helps you evaluate the value proposition of different vehicles or configurations, aiding in budgeting and purchasing decisions based on payload efficiency."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your vehicle's curb weight, which is the weight of the vehicle without passengers or cargo.
          </li>
          <li>
            <strong>Step 3:</strong> Input the payload capacity, representing the maximum weight of passengers and cargo your vehicle can carry.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the GVWR (Gross Vehicle Weight Rating), the maximum total weight your vehicle can safely handle.
          </li>
          <li>
            <strong>Step 5:</strong> Optionally, enter the vehicle price to calculate cost efficiency per unit of payload.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to see your payload and GVWR utilization percentages along with financial insights.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Payload & GVWR Utilization Helper
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding your vehicle's payload and GVWR utilization is essential for safe and efficient operation. The payload capacity indicates how much weight your vehicle can carry in terms of passengers and cargo, while the GVWR represents the maximum total weight including the vehicle itself. By calculating the utilization percentages, you can ensure that you are not overloading your vehicle, which could lead to mechanical failures, unsafe driving conditions, and legal issues.
          </p>
          <p>
            This calculator helps you analyze these critical parameters by taking your vehicle's curb weight, payload capacity, and GVWR as inputs. It computes the payload utilization as a percentage of the maximum allowable payload (GVWR minus curb weight) and the GVWR utilization as a percentage of the total loaded weight relative to the GVWR. Additionally, if you provide the vehicle price, it calculates the cost per unit of payload capacity, offering financial insight into the value you are getting for your investment.
          </p>
          <p>
            Whether you are a fleet manager, automotive engineer, or a vehicle buyer, this tool aids in making informed decisions about vehicle loading and purchasing. It helps prevent common mistakes such as overloading, which can cause premature wear and safety hazards. By regularly assessing your payload and GVWR utilization, you maintain vehicle integrity, comply with regulations, and optimize operational costs.
          </p>
          <p>
            Remember to always consult your vehicle’s manual or manufacturer specifications for exact weight ratings and limits. This calculator is a helpful guide but should be used alongside professional advice and real-world measurements.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring GVWR limits:</strong> Many users mistakenly assume payload capacity alone is sufficient, but exceeding GVWR can cause serious safety issues even if payload is within limits.
          </p>
          <p>
            <strong>2. Confusing curb weight with gross weight:</strong> Curb weight is the vehicle’s weight without load; mixing these values leads to incorrect calculations.
          </p>
          <p>
            <strong>3. Not converting units properly:</strong> Mixing imperial and metric units without proper conversion can cause errors in payload and GVWR assessments.
          </p>
          <p>
            <strong>4. Overlooking optional equipment weight:</strong> Additional accessories or modifications add weight and reduce payload capacity but are often forgotten.
          </p>
          <p>
            <strong>5. Using outdated or incorrect vehicle data:</strong> Always verify your vehicle’s specifications from reliable sources to ensure accurate calculations.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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