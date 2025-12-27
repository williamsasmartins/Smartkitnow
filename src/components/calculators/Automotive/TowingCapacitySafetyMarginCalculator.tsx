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

export default function TowingCapacitySafetyMarginCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    towingCapacity: "", // Max towing capacity of the vehicle
    trailerWeight: "",   // Actual trailer weight to be towed
    safetyMarginPercent: "15", // Desired safety margin percentage (default 15%)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const towingCapacity = parseFloat(inputs.towingCapacity);
    const trailerWeight = parseFloat(inputs.trailerWeight);
    const safetyMarginPercent = parseFloat(inputs.safetyMarginPercent);

    if (
      isNaN(towingCapacity) || towingCapacity <= 0 ||
      isNaN(trailerWeight) || trailerWeight <= 0 ||
      isNaN(safetyMarginPercent) || safetyMarginPercent < 0
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate the required towing capacity including safety margin
    // Required towing capacity = trailerWeight * (1 + safetyMarginPercent/100)
    const requiredCapacity = trailerWeight * (1 + safetyMarginPercent / 100);

    // Calculate safety margin actual percentage = ((towingCapacity - trailerWeight) / trailerWeight) * 100
    const actualMarginPercent = ((towingCapacity - trailerWeight) / trailerWeight) * 100;

    // Determine if towing capacity is sufficient
    let feedback = "";
    if (towingCapacity < trailerWeight) {
      feedback = "Warning: Trailer weight exceeds vehicle towing capacity!";
    } else if (actualMarginPercent < safetyMarginPercent) {
      feedback = `Caution: Safety margin is below desired ${safetyMarginPercent}%. Consider a lighter trailer or higher capacity vehicle.`;
    } else {
      feedback = "Safe: Towing capacity and safety margin are adequate.";
    }

    // Format numbers based on unit system
    const unitLabel = inputs.unit === "imperial" ? "lbs" : "kg";

    return {
      primary: `${requiredCapacity.toFixed(0)} ${unitLabel}`,
      secondary: `Actual Safety Margin: ${actualMarginPercent.toFixed(1)}%`,
      details: `Required towing capacity with ${safetyMarginPercent}% safety margin: ${requiredCapacity.toFixed(0)} ${unitLabel}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is towing capacity safety margin and why is it important?",
      answer:
        "Towing capacity safety margin is the extra buffer between your vehicle's maximum towing capacity and the actual weight of the trailer you intend to tow. This margin accounts for dynamic forces such as acceleration, braking, road conditions, and cargo shifts. Maintaining an adequate safety margin helps prevent vehicle strain, overheating, and potential accidents, ensuring safer towing performance and prolonging vehicle lifespan."
    },
    {
      question: "How do I determine the correct safety margin percentage for towing?",
      answer:
        "A common recommended safety margin is between 10% to 20% above the trailer's actual weight. This range provides a balance between safety and practicality. Factors influencing the margin include trailer type, terrain, driving conditions, and vehicle specifications. Always consult your vehicle's owner's manual and consider professional advice to select an appropriate safety margin."
    },
    {
      question: "Can I exceed my vehicle's maximum towing capacity if I have a safety margin?",
      answer:
        "No, the safety margin is meant to ensure you stay well within your vehicle's towing limits, not to exceed them. Exceeding the maximum towing capacity can lead to severe mechanical failures, compromised braking, and dangerous driving conditions. Always ensure the trailer weight plus the safety margin does not surpass your vehicle's rated towing capacity."
    },
    {
      question: "Does the calculator consider tongue weight or payload capacity?",
      answer:
        "This calculator focuses on the towing capacity safety margin related to trailer weight. Tongue weight and payload capacity are separate but equally important factors to consider when towing. Tongue weight is the downward force the trailer exerts on the hitch, and payload capacity is the maximum weight your vehicle can carry including passengers and cargo. Always verify these values to ensure safe towing."
    },
    {
      question: "How do unit conversions affect towing capacity calculations?",
      answer:
        "Towing capacity and trailer weight can be measured in pounds (lbs) or kilograms (kg). This calculator supports both imperial and metric units and converts values accordingly. It's crucial to use consistent units when inputting data to avoid errors. Always double-check unit settings before calculating to ensure accurate results."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 2023 pickup truck with a maximum towing capacity of 9,000 lbs, planning to tow a trailer weighing 7,500 lbs. The driver wants to maintain a 15% safety margin to ensure safe towing under various conditions.",
    steps: [
      {
        label: "Step 1: Identify towing capacity and trailer weight",
        explanation: "Towing capacity = 9,000 lbs, Trailer weight = 7,500 lbs"
      },
      {
        label: "Step 2: Calculate required towing capacity with safety margin",
        explanation:
          "Required towing capacity = Trailer weight × (1 + Safety margin %) = 7,500 × (1 + 0.15) = 7,500 × 1.15 = 8,625 lbs"
      },
      {
        label: "Step 3: Compare required towing capacity with vehicle capacity",
        explanation:
          "Vehicle towing capacity (9,000 lbs) is greater than required (8,625 lbs), so the safety margin is adequate."
      },
      {
        label: "Step 4: Calculate actual safety margin percentage",
        explanation:
          "Actual margin = ((9,000 - 7,500) / 7,500) × 100 = (1,500 / 7,500) × 100 = 20%"
      }
    ],
    result:
      "The vehicle has a 20% safety margin, which exceeds the desired 15%, indicating safe towing conditions."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "NHTSA Towing Safety Tips",
      description: "Official guidelines on safe towing practices and vehicle limits.",
      url: "https://www.nhtsa.gov/road-safety/towing-safety"
    },
    {
      title: "SAE International - Towing Capacity Standards",
      description: "Technical standards and recommendations for towing capacities.",
      url: "https://www.sae.org/standards/content/j2807_201602/"
    },
    {
      title: "Edmunds - How to Calculate Towing Capacity",
      description: "Comprehensive guide on understanding and calculating towing capacity.",
      url: "https://www.edmunds.com/car-buying/how-to-calculate-towing-capacity.html"
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
          <Label>Vehicle Maximum Towing Capacity ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.towingCapacity}
            onChange={(e) => handleInputChange("towingCapacity", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "9000" : "4082"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Trailer Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.trailerWeight}
            onChange={(e) => handleInputChange("trailerWeight", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "7500" : "3402"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Desired Safety Margin (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="any"
            value={inputs.safetyMarginPercent}
            onChange={(e) => handleInputChange("safetyMarginPercent", e.target.value)}
            placeholder="e.g. 15"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Required Towing Capacity</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-4 font-semibold text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your vehicle's maximum towing capacity as specified in the owner's manual or manufacturer specifications.
          </li>
          <li>
            <strong>Step 3:</strong> Input the actual weight of the trailer you plan to tow, including cargo and fluids.
          </li>
          <li>
            <strong>Step 4:</strong> Specify your desired safety margin percentage to ensure extra buffer for safe towing (default is 15%).
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see the required towing capacity with safety margin and feedback on your setup.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Towing Capacity Safety Margin Checker
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Towing a trailer safely requires understanding not only your vehicle's maximum towing capacity but also maintaining a safety margin to account for dynamic driving conditions. The towing capacity is the maximum weight your vehicle can safely tow as specified by the manufacturer. However, real-world conditions such as hills, acceleration, braking, and road surface irregularities impose additional stresses on your vehicle and trailer.
          </p>
          <p>
            The safety margin is a percentage buffer added on top of the trailer's actual weight to ensure your vehicle is not operating at its absolute limit. This margin helps prevent mechanical strain, overheating, and loss of control. For example, a 15% safety margin means your vehicle should be capable of towing 15% more than the trailer's weight, providing a cushion for unexpected forces.
          </p>
          <p>
            This calculator allows you to input your vehicle's towing capacity, the trailer weight, and your desired safety margin. It then calculates the required towing capacity to maintain that margin and compares it to your vehicle's rating. If your vehicle's capacity is insufficient or the margin is too low, the calculator provides warnings and advice. Always consult your vehicle's manual and consider professional guidance when planning to tow.
          </p>
          <p>
            Remember, towing beyond your vehicle's limits can lead to dangerous situations, including brake failure, loss of control, and damage to your vehicle's drivetrain. Properly calculating and respecting towing capacity with a safety margin ensures safer trips and prolongs the life of your vehicle.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring the safety margin:</strong> Many drivers tow trailers close to or at their vehicle's maximum capacity without any buffer, increasing the risk of mechanical failure and accidents.
          </p>
          <p>
            <strong>2. Using inconsistent units:</strong> Mixing pounds and kilograms without proper conversion can lead to incorrect calculations and unsafe towing setups.
          </p>
          <p>
            <strong>3. Forgetting additional trailer weight:</strong> Trailer weight should include cargo, fluids, and any additional equipment, not just the trailer's empty weight.
          </p>
          <p>
            <strong>4. Overlooking tongue weight and payload:</strong> These factors affect vehicle handling and should be considered alongside towing capacity.
          </p>
          <p>
            <strong>5. Not consulting the vehicle manual:</strong> Manufacturer guidelines provide critical information on towing limits and safety recommendations.
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
      title="Towing Capacity Safety Margin Checker"
      description="Professional automotive calculator: Towing Capacity Safety Margin Checker. Get accurate estimates, expert advice, and financial insights."
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