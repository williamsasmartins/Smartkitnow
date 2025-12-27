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

export default function EvPreconditioningCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    preconditioningTime: "", // Preconditioning time in minutes
    rate: "", // Electricity rate in $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const preconditioningTime = parseFloat(inputs.preconditioningTime);
    const rate = parseFloat(inputs.rate);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(preconditioningTime) || preconditioningTime <= 0 ||
      isNaN(rate) || rate <= 0
    ) {
      return {
        primary: "0 kWh",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Assumptions:
    // EV preconditioning typically uses about 1.5 kW to 3 kW power depending on vehicle and climate.
    // We'll assume average power draw of 2 kW for preconditioning.
    // Energy used = Power (kW) * Time (hours)
    // Cost = Energy used * rate ($/kWh)

    const powerDraw = 2; // kW average power draw for preconditioning
    const timeHours = preconditioningTime / 60; // convert minutes to hours
    const energyUsed = powerDraw * timeHours; // kWh energy used during preconditioning

    // Ensure energy used does not exceed battery capacity (cannot precondition more energy than battery capacity)
    const energyUsedCapped = energyUsed > batteryCapacity ? batteryCapacity : energyUsed;

    const cost = energyUsedCapped * rate;

    return {
      primary: `${energyUsedCapped.toFixed(2)} kWh`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Energy used: ${energyUsedCapped.toFixed(2)} kWh at $${rate.toFixed(3)}/kWh for ${preconditioningTime} minutes.`,
      feedback: energyUsedCapped > batteryCapacity * 0.5 ? "High preconditioning energy use" : "Standard preconditioning energy use"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does EV preconditioning affect battery energy consumption?",
      answer:
        "EV preconditioning uses the vehicle's battery to heat or cool the cabin before driving, which consumes additional energy. The amount depends on outside temperature, preconditioning duration, and vehicle efficiency. Typically, preconditioning draws about 1.5 to 3 kW of power, impacting the overall battery range and energy cost."
    },
    {
      question: "Can preconditioning energy consumption exceed the battery capacity?",
      answer:
        "No, the energy consumed during preconditioning cannot exceed the total battery capacity. The calculator caps the estimated energy use at the battery's capacity to ensure realistic results. If inputs suggest otherwise, it indicates an input error or unrealistic preconditioning duration."
    },
    {
      question: "Why is the electricity rate important in this calculator?",
      answer:
        "Electricity rates vary widely depending on location, time of day, and provider. Using an accurate rate ($/kWh) helps estimate the true cost of energy consumed during preconditioning. This allows EV owners to budget and optimize charging and preconditioning schedules for cost savings."
    },
    {
      question: "Does preconditioning energy consumption affect EV range?",
      answer:
        "Yes, energy used for preconditioning reduces the battery charge available for driving, effectively lowering the EV's driving range. However, preconditioning can improve efficiency by warming or cooling the battery and cabin, potentially offsetting some energy loss during driving."
    },
    {
      question: "How can I reduce the cost of EV preconditioning?",
      answer:
        "To reduce costs, precondition your EV while it is still plugged in to use grid power instead of battery power. Also, schedule preconditioning during off-peak electricity hours when rates are lower. Using shorter preconditioning times and efficient climate control settings can further minimize energy consumption."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $45,000 electric sedan with a 75 kWh battery, you want to estimate the cost of preconditioning your EV for 30 minutes before driving. Your local electricity rate is $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate energy used during preconditioning",
        explanation:
          "Assuming an average power draw of 2 kW, energy used = 2 kW × (30 minutes ÷ 60) = 1 kWh."
      },
      {
        label: "Step 2: Calculate cost of energy used",
        explanation:
          "Cost = 1 kWh × $0.13/kWh = $0.13."
      }
    ],
    result: "Final Result: Preconditioning uses approximately 1.00 kWh, costing about $0.13 for 30 minutes."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle energy consumption and efficiency ratings."
    },
    {
      title: "U.S. Department of Energy - EV Energy Consumption",
      description: "Comprehensive information on electric vehicle energy use and charging."
    },
    {
      title: "EnergySage - How Much Does It Cost to Charge an Electric Car?",
      description: "Detailed guide on EV charging costs and factors affecting them."
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
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 75"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Preconditioning Time (minutes)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30"
            value={inputs.preconditioningTime}
            onChange={(e) => handleInputChange("preconditioningTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 text-sm font-medium text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This information is usually found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input the estimated preconditioning time in minutes. This is how long you plan to heat or cool your vehicle before driving.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your local electricity rate in dollars per kilowatt-hour ($/kWh). Check your utility bill or provider's website for accurate rates.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see the estimated energy consumption and cost of preconditioning your EV.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and use them to plan your preconditioning habits for optimal energy use and cost savings.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Preconditioning Energy & Cost Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicle (EV) preconditioning is the process of heating or cooling the vehicle's cabin and battery before driving, typically while the vehicle is still plugged in. This feature improves comfort and battery efficiency, especially in extreme weather conditions. However, preconditioning consumes additional energy, which impacts the overall battery charge and operating cost.
          </p>
          <p>
            This calculator estimates the energy consumed and cost incurred during EV preconditioning based on three key inputs: battery capacity, preconditioning duration, and electricity rate. The battery capacity (in kWh) represents the total energy storage of your EV's battery pack. Preconditioning time (in minutes) is how long you plan to run the heating or cooling system before driving. The electricity rate ($/kWh) is the cost you pay for electricity from your utility provider.
          </p>
          <p>
            The calculator assumes an average power draw of 2 kW during preconditioning, which is typical for many EVs. It calculates energy consumption by multiplying this power by the preconditioning time converted to hours. The cost is then derived by multiplying the energy used by your electricity rate. The calculator also ensures that the estimated energy consumption does not exceed the battery's total capacity, providing realistic and practical results.
          </p>
          <p>
            Understanding the energy and cost implications of preconditioning helps EV owners optimize their charging and climate control habits. For example, preconditioning while plugged in uses grid power instead of battery power, preserving driving range and potentially reducing costs if done during off-peak hours. By using this calculator, you can make informed decisions to balance comfort, efficiency, and cost.
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
            <strong>1. Entering unrealistic preconditioning times:</strong> Inputting excessively long preconditioning durations can lead to energy estimates that exceed your battery capacity, which is not physically possible. Always use typical preconditioning times (usually 10-30 minutes).
          </p>
          <p>
            <strong>2. Using incorrect electricity rates:</strong> Make sure to use your actual local electricity rate in $/kWh. Using national averages or outdated rates can skew cost estimates.
          </p>
          <p>
            <strong>3. Ignoring vehicle-specific power draw:</strong> The calculator uses an average power draw of 2 kW, but some EVs may consume more or less during preconditioning. For precise estimates, refer to your vehicle’s manual or manufacturer data.
          </p>
          <p>
            <strong>4. Not considering preconditioning while plugged in:</strong> Preconditioning while connected to the grid uses external power and does not drain the battery, which can reduce costs and preserve range.
          </p>
          <p>
            <strong>5. Forgetting to convert units properly:</strong> Ensure you enter battery capacity in kWh and time in minutes as specified to avoid calculation errors.
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
      title="EV Preconditioning Energy & Cost Estimator"
      description="Professional automotive calculator: EV Preconditioning Energy & Cost Estimator. Get accurate estimates, expert advice, and financial insights."
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