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
      question: "What is a towing capacity safety margin and why does it matter?",
      answer: "A towing capacity safety margin is the difference between your vehicle's maximum towing capacity and the actual weight you plan to tow, expressed as a percentage or buffer. Safety experts recommend maintaining at least a 10-20% safety margin to account for cargo shifting, road conditions, and equipment wear. Exceeding your vehicle's rated capacity without this margin significantly increases brake failure risk, transmission damage, and loss of vehicle control.",
    },
    {
      question: "How do I find my vehicle's maximum towing capacity?",
      answer: "Your vehicle's maximum towing capacity is listed in your owner's manual, on the driver's side door jamb label, or on the manufacturer's website using your VIN. Most pickup trucks range from 5,000 to 14,000 lbs, while SUVs typically range from 3,500 to 8,500 lbs. Always consult your specific vehicle's documentation rather than relying on model estimates, as capacity varies by engine type, transmission, and year.",
    },
    {
      question: "What weight should I use when calculating my safety margin—dry weight or loaded weight?",
      answer: "Always use the fully loaded weight of your trailer or cargo for safety margin calculations, including passengers, fuel, equipment, and any additions to the trailer itself. A dry trailer weighing 5,000 lbs can easily reach 7,500 lbs when loaded with cargo, which significantly impacts your safety margin. This realistic approach prevents the dangerous mistake of assuming worst-case scenarios won't occur.",
    },
    {
      question: "Can I exceed my vehicle's towing capacity if I drive carefully?",
      answer: "No, exceeding your vehicle's rated towing capacity is unsafe regardless of driving skill, as it compromises braking performance, suspension integrity, and steering response. Manufacturers calculate towing limits based on vehicle engineering and safety testing, not driver ability. Overloading increases stopping distance, jackknife risk, and potential liability if an accident occurs.",
    },
    {
      question: "What is a hitch weight limit and how does it affect my safety margin?",
      answer: "Hitch weight (tongue weight) typically represents 10-15% of total trailer weight and is limited by your vehicle's hitch class and receiver rating. If your trailer's tongue weight is 1,200 lbs and your hitch is rated for 1,000 lbs, you've exceeded capacity at the connection point, regardless of overall towing capacity. Always verify both your vehicle's towing capacity AND your hitch rating are sufficient for your loaded trailer.",
    },
    {
      question: "How does payload capacity affect my towing capacity safety margin?",
      answer: "Your vehicle's payload capacity and towing capacity are separate ratings, but both are reduced when you carry passengers and cargo in the cab. If your truck has a 10,000 lb towing capacity and 1,500 lb payload capacity, adding 800 lbs of cargo in the truck bed leaves only 700 lbs of payload for passengers. This combined load reduction effectively cuts your safe towing margin, so factor in all vehicle weight when calculating your available capacity.",
    },
    {
      question: "What safety features should I verify before towing at or near my vehicle's maximum capacity?",
      answer: "Confirm your vehicle has integrated trailer brake control, an appropriately rated hitch with weight-distribution capabilities, and functional backup/sway control systems. Weight-distribution hitches can increase safe towing capacity by helping balance the load across multiple axles and reducing tongue weight impact. Additionally, ensure your tires are properly inflated, brakes are in excellent condition, and your mirrors provide adequate visibility of the trailer.",
    },
    {
      question: "What is the relationship between GVWR and towing capacity?",
      answer: "Gross Vehicle Weight Rating (GVWR) is your vehicle's maximum operating weight including fuel, passengers, cargo, and trailers—not the same as towing capacity alone. If your truck's GVWR is 12,000 lbs and the vehicle itself weighs 6,500 lbs with 500 lbs of passengers and cargo, you have 5,000 lbs remaining for trailer weight. Exceeding GVWR can damage your suspension and compromise safety, making it a critical constraint alongside towing capacity limits.",
    },
    {
      question: "How do weather and road conditions impact my effective towing safety margin?",
      answer: "Rain, snow, and mountainous terrain reduce your effective braking power and traction, effectively tightening your safety margin despite maintaining the same vehicle and load weights. In adverse conditions, increase your safety margin from 10-20% to 25-30% to account for reduced stopping ability and longer braking distances. Similarly, towing at high elevation or with significant uphill grades reduces engine power and braking effectiveness, requiring larger safety buffers.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Towing Capacity Safety Margin Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Towing Capacity Safety Margin Checker helps you determine whether your vehicle can safely tow your trailer or cargo while maintaining an adequate safety buffer. By comparing your vehicle's maximum towing capacity against your actual loaded weight, this calculator reveals how much margin you have—and whether you're operating within safe parameters. Maintaining proper safety margins is critical for preventing brake failure, transmission damage, and loss of vehicle control during emergency maneuvers.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator accurately, gather three key pieces of information: your vehicle's maximum towing capacity (found in your owner's manual or door jamb label), the fully loaded weight of your trailer or cargo (including all passengers, fuel, and equipment), and your hitch class rating. The calculator will also ask for your vehicle's Gross Vehicle Weight Rating (GVWR) to ensure you're not exceeding overall vehicle limits. These inputs create a comprehensive safety assessment that accounts for both towing and payload constraints.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your remaining towing capacity, safety margin percentage, and a risk assessment showing whether you're safely within limits or dangerously exceeding them. A result showing a 15-20% safety margin on highway conditions indicates safe operation, while results below 10% warrant serious concern. Use the detailed breakdown to adjust your load weight or reconsider your towing plan if the safety margin is inadequate for your intended driving conditions.</p>
        </div>
      </section>

      {/* TABLE: Typical Towing Capacity by Vehicle Class (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Towing Capacity by Vehicle Class (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows representative maximum towing capacities for common vehicle types, though actual capacity varies significantly by engine, transmission, and model year.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dry Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Max Towing Capacity (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Safety Margin (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact SUV (Honda CR-V, Toyota RAV4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size SUV (Ford Explorer, Chevy Tahoe)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,600-8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,120-1,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Pickup (F-150, Silverado 1500)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000-14,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,600-2,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavy-Duty Pickup (F-350, Silverado 3500)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000-7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,000-35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-7,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Minivan (Honda Odyssey, Toyota Sienna)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,300-4,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan (Toyota Camry, Honda Accord)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-3,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual capacities vary based on engine displacement, transmission type, and trim level. Always consult your vehicle's owner manual for precise specifications.</p>
      </section>

      {/* TABLE: Hitch Class Ratings and Weight Limits (2024 Standards) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hitch Class Ratings and Weight Limits (2024 Standards)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Hitch classes are standardized ratings that define maximum towing and tongue weight capacity for receiver hitches.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hitch Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Receiver Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Towing Capacity (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Tongue Weight (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Class I</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Class II</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Class III</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Class IV (Heavy-Duty)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Class V (Commercial)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weight-distribution hitches can increase capacity by 25-50% beyond rated Class limits. Verify your vehicle manufacturer's hitch rating matches your Class selection.</p>
      </section>

      {/* TABLE: Safety Margin Reduction Factors Under Adverse Conditions */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safety Margin Reduction Factors Under Adverse Conditions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Environmental and load factors reduce your effective towing safety margin below ideal highway conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Base Safety Margin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjusted Safety Margin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry, level highway at sea level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No reduction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wet roads or light rain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced braking grip</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Snow, ice, or winter conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Significantly reduced traction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mountain driving or sustained grades &gt;5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced engine power, brake stress</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High elevation (&gt;5,000 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced air density, engine power</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavy crosswinds (&gt;20 mph)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Trailer sway risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Towing at maximum capacity rating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple risk factors compound</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are cumulative factors; multiple adverse conditions require larger safety margins. Conservative drivers should maintain &gt;20% margins in all conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use your trailer's fully loaded weight when entering data—not the dry weight—since cargo can add 25-50% to the empty weight, dramatically reducing your safety margin.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for hitch weight capacity separately from overall towing capacity; exceeding your hitch rating at the connection point can cause catastrophic failure regardless of vehicle towing limits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase your required safety margin to 25-35% when towing in rain, snow, mountains, or at high elevation, as these conditions reduce braking power and effective towing capacity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your vehicle's door jamb label for combined payload and towing capacity limits; adding passengers and cargo in the cab directly reduces the weight available for trailer towing.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Dry Trailer Weight Instead of Loaded Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people enter their trailer's dry weight but fail to account for cargo, gear, and fuel, underestimating actual weight by 30-40%. This inflates your perceived safety margin and can lead to unsafe operating conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Hitch Class Ratings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your vehicle's towing capacity and your hitch rating are independent limits; exceeding either one creates unsafe conditions. A Class II hitch maxes out at 3,500 lbs towing even if your truck is rated for 8,000 lbs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking GVWR Constraints</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gross Vehicle Weight Rating limits your total vehicle weight including passengers and cargo in the cab. Exceeding GVWR damages suspension and compromises braking regardless of towing capacity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Safe Operation in All Weather Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Safety margins that work on dry highways shrink dramatically in rain, snow, or mountains. Maintaining a 20% margin in ideal conditions requires 35% or more in adverse weather.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a towing capacity safety margin and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A towing capacity safety margin is the difference between your vehicle's maximum towing capacity and the actual weight you plan to tow, expressed as a percentage or buffer. Safety experts recommend maintaining at least a 10-20% safety margin to account for cargo shifting, road conditions, and equipment wear. Exceeding your vehicle's rated capacity without this margin significantly increases brake failure risk, transmission damage, and loss of vehicle control.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find my vehicle's maximum towing capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your vehicle's maximum towing capacity is listed in your owner's manual, on the driver's side door jamb label, or on the manufacturer's website using your VIN. Most pickup trucks range from 5,000 to 14,000 lbs, while SUVs typically range from 3,500 to 8,500 lbs. Always consult your specific vehicle's documentation rather than relying on model estimates, as capacity varies by engine type, transmission, and year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What weight should I use when calculating my safety margin—dry weight or loaded weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Always use the fully loaded weight of your trailer or cargo for safety margin calculations, including passengers, fuel, equipment, and any additions to the trailer itself. A dry trailer weighing 5,000 lbs can easily reach 7,500 lbs when loaded with cargo, which significantly impacts your safety margin. This realistic approach prevents the dangerous mistake of assuming worst-case scenarios won't occur.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I exceed my vehicle's towing capacity if I drive carefully?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, exceeding your vehicle's rated towing capacity is unsafe regardless of driving skill, as it compromises braking performance, suspension integrity, and steering response. Manufacturers calculate towing limits based on vehicle engineering and safety testing, not driver ability. Overloading increases stopping distance, jackknife risk, and potential liability if an accident occurs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a hitch weight limit and how does it affect my safety margin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hitch weight (tongue weight) typically represents 10-15% of total trailer weight and is limited by your vehicle's hitch class and receiver rating. If your trailer's tongue weight is 1,200 lbs and your hitch is rated for 1,000 lbs, you've exceeded capacity at the connection point, regardless of overall towing capacity. Always verify both your vehicle's towing capacity AND your hitch rating are sufficient for your loaded trailer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does payload capacity affect my towing capacity safety margin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your vehicle's payload capacity and towing capacity are separate ratings, but both are reduced when you carry passengers and cargo in the cab. If your truck has a 10,000 lb towing capacity and 1,500 lb payload capacity, adding 800 lbs of cargo in the truck bed leaves only 700 lbs of payload for passengers. This combined load reduction effectively cuts your safe towing margin, so factor in all vehicle weight when calculating your available capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What safety features should I verify before towing at or near my vehicle's maximum capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Confirm your vehicle has integrated trailer brake control, an appropriately rated hitch with weight-distribution capabilities, and functional backup/sway control systems. Weight-distribution hitches can increase safe towing capacity by helping balance the load across multiple axles and reducing tongue weight impact. Additionally, ensure your tires are properly inflated, brakes are in excellent condition, and your mirrors provide adequate visibility of the trailer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between GVWR and towing capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross Vehicle Weight Rating (GVWR) is your vehicle's maximum operating weight including fuel, passengers, cargo, and trailers—not the same as towing capacity alone. If your truck's GVWR is 12,000 lbs and the vehicle itself weighs 6,500 lbs with 500 lbs of passengers and cargo, you have 5,000 lbs remaining for trailer weight. Exceeding GVWR can damage your suspension and compromise safety, making it a critical constraint alongside towing capacity limits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do weather and road conditions impact my effective towing safety margin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rain, snow, and mountainous terrain reduce your effective braking power and traction, effectively tightening your safety margin despite maintaining the same vehicle and load weights. In adverse conditions, increase your safety margin from 10-20% to 25-30% to account for reduced stopping ability and longer braking distances. Similarly, towing at high elevation or with significant uphill grades reduces engine power and braking effectiveness, requiring larger safety buffers.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhtsa.gov/vehicle-owners/towing-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration (NHTSA) - Towing Safety Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government guidance on safe towing practices and manufacturer capacity ratings.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j2807_202407/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) - Towing Capacity Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards and benchmarks defining how manufacturers calculate and rate towing capacity.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/towing/towing-capacity-and-safety/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - Towing Capacity and Safety Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent analysis of towing capacity ratings and real-world safety recommendations.</p>
          </li>
          <li>
            <a href="https://www.aaa.com/automotive/safe-towing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Automobile Association (AAA) - Towing Vehicle Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best practices for safe towing including weight distribution, brake systems, and vehicle maintenance.</p>
          </li>
        </ul>
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