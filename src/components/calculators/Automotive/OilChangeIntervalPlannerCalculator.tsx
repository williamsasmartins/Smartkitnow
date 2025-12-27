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

export default function OilChangeIntervalPlannerCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentMileage: "",
    lastOilChangeMileage: "",
    recommendedInterval: "",
    oilChangeCost: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const {
      currentMileage,
      lastOilChangeMileage,
      recommendedInterval,
      oilChangeCost,
      unit
    } = inputs;

    // Parse inputs to numbers
    const currMile = parseFloat(currentMileage);
    const lastMile = parseFloat(lastOilChangeMileage);
    const recInterval = parseFloat(recommendedInterval);
    const cost = parseFloat(oilChangeCost);

    // Validation
    if (
      isNaN(currMile) || currMile < 0 ||
      isNaN(lastMile) || lastMile < 0 ||
      isNaN(recInterval) || recInterval <= 0 ||
      isNaN(cost) || cost < 0 ||
      lastMile > currMile
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers. Last oil change mileage must be less than or equal to current mileage.",
        feedback: "Error"
      };
    }

    // Calculate miles/kilometers since last oil change
    const distanceSinceLastChange = currMile - lastMile;

    // Calculate remaining distance until next oil change
    const remainingDistance = recInterval - distanceSinceLastChange;

    // Calculate percentage of interval used
    const percentUsed = (distanceSinceLastChange / recInterval) * 100;

    // Calculate estimated cost per mile/km for oil changes
    // Assuming cost per interval = oilChangeCost, cost per mile = oilChangeCost / recInterval
    const costPerDistance = cost / recInterval;

    // Calculate estimated cost until next oil change
    const estimatedCostUntilNextChange = remainingDistance > 0 ? costPerDistance * remainingDistance : 0;

    // Format numbers
    const formatDistance = (val: number) => {
      if (unit === "imperial") return `${val.toFixed(0)} miles`;
      else return `${val.toFixed(0)} km`;
    };

    const formatCurrency = (val: number) => {
      return `$${val.toFixed(2)}`;
    };

    // Feedback message based on usage
    let feedback = "Standard range";
    if (percentUsed < 50) feedback = "You can wait longer before next oil change.";
    else if (percentUsed >= 50 && percentUsed < 90) feedback = "Approaching recommended oil change interval.";
    else if (percentUsed >= 90 && remainingDistance > 0) feedback = "Oil change due soon.";
    else if (remainingDistance <= 0) feedback = "Oil change overdue! Please change immediately.";

    return {
      primary: remainingDistance > 0 ? formatDistance(remainingDistance) : "0",
      secondary: formatCurrency(estimatedCostUntilNextChange),
      details: `Distance since last oil change: ${formatDistance(distanceSinceLastChange)}. Recommended interval: ${formatDistance(recInterval)}.`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How often should I change my car's oil?",
      answer:
        "Oil change intervals vary depending on the vehicle, oil type, and driving conditions. Most manufacturers recommend changing oil every 3,000 to 7,500 miles (or 5,000 to 12,000 kilometers). Synthetic oils often allow longer intervals. Always consult your owner's manual for the recommended interval specific to your car."
    },
    {
      question: "Can I extend the oil change interval to save money?",
      answer:
        "While extending oil change intervals can save money upfront, it may risk engine wear if done excessively. Modern synthetic oils and advanced engines allow longer intervals, but ignoring manufacturer recommendations can lead to costly repairs. Use this planner to balance cost savings with engine health."
    },
    {
      question: "What factors affect oil change intervals?",
      answer:
        "Driving habits, climate, and vehicle type affect oil change frequency. Frequent short trips, stop-and-go traffic, towing, or extreme temperatures can degrade oil faster. Adjust intervals accordingly and monitor oil condition regularly."
    },
    {
      question: "Is it safe to use synthetic oil for longer intervals?",
      answer:
        "Yes, synthetic oils are designed to last longer and provide better engine protection under various conditions. They resist breakdown and maintain viscosity better than conventional oils, allowing extended oil change intervals recommended by many manufacturers."
    },
    {
      question: "How does oil change cost impact overall vehicle maintenance?",
      answer:
        "Regular oil changes are a relatively low-cost maintenance task that prevents expensive engine damage. Skipping or delaying oil changes can lead to sludge buildup, reduced engine efficiency, and costly repairs. Budgeting for timely oil changes helps maintain vehicle reliability and resale value."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "John owns a 2018 sedan and wants to plan his next oil change. His current mileage is 45,000 miles, and his last oil change was at 40,000 miles. The manufacturer recommends an oil change every 5,000 miles. Each oil change costs him $50.",
    steps: [
      {
        label: "Step 1: Calculate miles since last oil change",
        explanation: "45,000 miles (current) - 40,000 miles (last) = 5,000 miles driven since last oil change."
      },
      {
        label: "Step 2: Calculate remaining miles until next oil change",
        explanation: "5,000 miles (recommended interval) - 5,000 miles (driven) = 0 miles remaining; oil change is due now."
      },
      {
        label: "Step 3: Calculate estimated cost until next oil change",
        explanation: "Since the oil change is due now, estimated cost until next oil change is $0."
      }
    ],
    result: "John should perform an oil change immediately to maintain engine health and avoid damage."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle maintenance tips."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing, including maintenance cost estimates."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, maintenance advice, and automotive calculators."
    },
    {
      title: "Your Vehicle Owner's Manual",
      description: "Manufacturer's recommended maintenance schedule and oil change intervals."
    },
    {
      title: "Car Care Council",
      description: "Nonprofit organization providing vehicle maintenance education and tips."
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
          <Label>Current Mileage</Label>
          <Input
            type="number"
            min="0"
            value={inputs.currentMileage}
            onChange={(e) => handleInputChange("currentMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 45000 miles" : "e.g. 72000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Oil Change Mileage</Label>
          <Input
            type="number"
            min="0"
            value={inputs.lastOilChangeMileage}
            onChange={(e) => handleInputChange("lastOilChangeMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 40000 miles" : "e.g. 64000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Recommended Oil Change Interval</Label>
          <Input
            type="number"
            min="1"
            value={inputs.recommendedInterval}
            onChange={(e) => handleInputChange("recommendedInterval", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 5000 miles" : "e.g. 8000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Cost per Oil Change</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.oilChangeCost}
            onChange={(e) => handleInputChange("oilChangeCost", e.target.value)}
            placeholder="$50.00"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Remaining Distance</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">Estimated Cost Until Next Oil Change: {results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles) or Metric (kilometers).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your vehicle's current mileage or kilometers driven.
          </li>
          <li>
            <strong>Step 3:</strong> Input the mileage or kilometers at which you last changed your oil.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the recommended oil change interval as specified by your vehicle manufacturer.
          </li>
          <li>
            <strong>Step 5:</strong> Provide the cost you typically pay for an oil change.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see the remaining distance until your next oil change and the estimated cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Oil Change Interval Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Regular oil changes are critical to maintaining your vehicle's engine health and performance. Oil lubricates engine components, reduces friction, and helps dissipate heat. Over time, oil degrades and becomes contaminated, reducing its effectiveness. Changing oil at recommended intervals ensures your engine runs smoothly and prevents costly repairs.
          </p>
          <p>
            This planner helps you determine how far you can drive before your next oil change based on your current mileage, last oil change, and manufacturer recommendations. It also estimates the cost you will incur for the upcoming oil change, helping you budget maintenance expenses effectively. Remember, driving conditions such as frequent short trips, extreme temperatures, or heavy towing may require more frequent oil changes.
          </p>
          <p>
            Always refer to your vehicle’s owner manual for specific oil change intervals and oil type recommendations. Using synthetic oil can extend intervals, but never exceed the maximum recommended mileage. This tool empowers you to plan maintenance proactively, ensuring your vehicle remains reliable and efficient.
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
            <strong>1. Ignoring manufacturer recommendations:</strong> Using generic intervals without consulting your vehicle’s manual can lead to premature engine wear or unnecessary oil changes.
          </p>
          <p>
            <strong>2. Using incorrect units:</strong> Mixing miles and kilometers in inputs causes inaccurate calculations. Always select and use consistent units.
          </p>
          <p>
            <strong>3. Forgetting to update mileage:</strong> Not updating current or last oil change mileage results in misleading interval estimates.
          </p>
          <p>
            <strong>4. Overextending oil change intervals:</strong> Driving beyond recommended intervals can cause sludge buildup and engine damage.
          </p>
          <p>
            <strong>5. Neglecting oil quality:</strong> Using low-quality or incorrect oil type reduces protection and shortens oil life.
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
      title="Oil Change Interval Planner"
      description="Professional automotive calculator: Oil Change Interval Planner. Get accurate estimates, expert advice, and financial insights."
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