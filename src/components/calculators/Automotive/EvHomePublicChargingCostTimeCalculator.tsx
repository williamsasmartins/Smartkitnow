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

export default function EvHomePublicChargingCostTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    homeRate: "", // $/kWh
    publicRate: "", // $/kWh
    homeChargePower: "", // kW (charging speed at home)
    publicChargePower: "", // kW (charging speed at public station)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const homeRate = parseFloat(inputs.homeRate);
    const publicRate = parseFloat(inputs.publicRate);
    const homePower = parseFloat(inputs.homeChargePower);
    const publicPower = parseFloat(inputs.publicChargePower);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(homeRate) || homeRate <= 0 ||
      isNaN(publicRate) || publicRate <= 0 ||
      isNaN(homePower) || homePower <= 0 ||
      isNaN(publicPower) || publicPower <= 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all inputs.",
        details: "",
        feedback: ""
      };
    }

    // Calculate cost to fully charge at home and public
    const homeCost = battery * homeRate;
    const publicCost = battery * publicRate;

    // Calculate time to fully charge at home and public (hours)
    // Time = Battery Capacity (kWh) / Charging Power (kW)
    const homeTime = battery / homePower;
    const publicTime = battery / publicPower;

    return {
      primary: `Home: ${homeTime.toFixed(2)} hrs | Public: ${publicTime.toFixed(2)} hrs`,
      secondary: `Cost - Home: $${homeCost.toFixed(2)} | Public: $${publicCost.toFixed(2)}`,
      details: `Charging ${battery} kWh battery at ${homePower} kW (home) and ${publicPower} kW (public).`,
      feedback: `Home charging is ${homeCost < publicCost ? "cheaper" : "more expensive"} and ${homeTime < publicTime ? "faster" : "slower"} than public charging.`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors affect the cost difference between home and public EV charging?",
      answer:
        "The cost difference primarily depends on the electricity rates at home versus public charging stations. Home electricity rates are usually lower, but some public chargers may offer competitive pricing or discounts. Additionally, public chargers often have higher power outputs, reducing charging time but sometimes at a premium cost per kWh. Taxes, fees, and membership plans can also influence the final cost."
    },
    {
      question: "How does charging power impact the total charging time?",
      answer:
        "Charging power, measured in kilowatts (kW), directly affects how quickly an EV battery can be replenished. Higher charging power means faster charging times. For example, a 50 kW public charger can charge a 50 kWh battery in about one hour, whereas a 7 kW home charger would take over seven hours. However, the vehicle's onboard charger and battery management system also limit maximum charging speeds."
    },
    {
      question: "Can I use this calculator for any EV model?",
      answer:
        "Yes, this calculator is designed to be flexible for any EV model as long as you know the battery capacity in kWh and the charging rates. However, keep in mind that actual charging times may vary based on the vehicle's maximum charging rate and battery state of charge. Always refer to your EV's specifications for the most accurate estimates."
    },
    {
      question: "Why is public charging sometimes more expensive despite faster charging?",
      answer:
        "Public charging stations often charge a premium for faster charging due to infrastructure costs and convenience. They may also include additional fees or membership costs. While the higher power output reduces charging time, the cost per kWh can be significantly higher than residential electricity rates, making public charging more expensive overall."
    },
    {
      question: "How can I reduce my EV charging costs at home?",
      answer:
        "To reduce home charging costs, consider charging during off-peak hours when electricity rates are lower if your utility offers time-of-use pricing. Installing solar panels can also offset electricity costs. Additionally, using a smart charger that schedules charging sessions can optimize costs and battery health."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 60 kWh electric SUV with a home electricity rate of $0.13/kWh and public charging rate of $0.30/kWh. Home charger power is 7 kW, and public fast charger power is 50 kW.",
    steps: [
      {
        label: "Step 1: Calculate home charging cost",
        explanation: "60 kWh battery × $0.13/kWh = $7.80"
      },
      {
        label: "Step 2: Calculate public charging cost",
        explanation: "60 kWh battery × $0.30/kWh = $18.00"
      },
      {
        label: "Step 3: Calculate home charging time",
        explanation: "60 kWh ÷ 7 kW = 8.57 hours"
      },
      {
        label: "Step 4: Calculate public charging time",
        explanation: "60 kWh ÷ 50 kW = 1.20 hours"
      },
      {
        label: "Result",
        explanation:
          "Charging at home costs $7.80 and takes about 8.57 hours, while public charging costs $18.00 and takes about 1.20 hours."
      }
    ],
    result: "Home charging is significantly cheaper but slower compared to public charging."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on electric vehicle charging and costs.",
      url: "https://afdc.energy.gov/fuels/electricity_cost.html"
    },
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and charging info.",
      url: "https://www.fueleconomy.gov/feg/evtech.shtml"
    },
    {
      title: "ChargePoint - EV Charging Network",
      description: "Information on public charging stations and pricing.",
      url: "https://www.chargepoint.com/"
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
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Home Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.homeRate}
            onChange={(e) => handleInputChange("homeRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Public Charging Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.30"
            value={inputs.publicRate}
            onChange={(e) => handleInputChange("publicRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Home Charging Power (kW)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 7"
            value={inputs.homeChargePower}
            onChange={(e) => handleInputChange("homeChargePower", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Public Charging Power (kW)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 50"
            value={inputs.publicChargePower}
            onChange={(e) => handleInputChange("publicChargePower", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 italic text-sm text-slate-700 dark:text-slate-400">{results.feedback}</p>
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
            <strong>Enter your EV's battery capacity</strong> in kilowatt-hours (kWh). This is typically found in your vehicle's specifications.
          </li>
          <li>
            <strong>Input your home electricity rate</strong> in dollars per kWh. Check your utility bill or provider's website for accurate rates.
          </li>
          <li>
            <strong>Enter the public charging rate</strong> you expect to pay per kWh at public stations. Rates vary by provider and location.
          </li>
          <li>
            <strong>Provide the charging power</strong> (in kW) for both your home charger and the public charger you plan to use. This affects charging time.
          </li>
          <li>
            <strong>Click "Calculate"</strong> to see the estimated cost and time for charging your EV at home versus public stations.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Home vs Public Charging Cost & Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) offer a cleaner alternative to traditional gasoline-powered cars, but understanding the costs and time involved in charging them is essential for budgeting and convenience. This calculator helps you compare the cost and time of charging your EV at home versus using public charging stations by considering your battery size, electricity rates, and charging speeds.
          </p>
          <p>
            The battery capacity, measured in kilowatt-hours (kWh), represents the total energy storage of your EV. Charging costs are calculated by multiplying this capacity by the electricity rate you pay, either at home or at public stations. Home electricity rates are generally lower, making home charging more economical, but public chargers often provide faster charging speeds.
          </p>
          <p>
            Charging power, expressed in kilowatts (kW), determines how quickly your EV battery can be replenished. Home chargers typically range from 3.7 kW to 11 kW, while public fast chargers can deliver 50 kW or more. Faster charging reduces wait times but may come at a higher cost per kWh.
          </p>
          <p>
            By inputting your specific values, this calculator provides a clear comparison of both cost and time, helping you make informed decisions about when and where to charge your EV. Whether you prioritize saving money or minimizing charging time, understanding these factors can enhance your EV ownership experience.
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
            <strong>1. Ignoring charging power limits:</strong> Many users forget that their EV or charger may have maximum charging power limits, which can affect charging time. Always check your vehicle's maximum AC and DC charging rates.
          </p>
          <p>
            <strong>2. Using average rates without checking:</strong> Electricity rates vary by location and time of day. Using inaccurate rates can lead to misleading cost estimates.
          </p>
          <p>
            <strong>3. Assuming full battery charge every time:</strong> Most EV owners rarely charge from 0% to 100%. Partial charges affect cost and time differently.
          </p>
          <p>
            <strong>4. Not accounting for charging efficiency:</strong> Some energy is lost during charging due to heat and battery management, typically around 10%. This calculator assumes ideal conditions.
          </p>
          <p>
            <strong>5. Overlooking additional fees:</strong> Public charging stations may have session fees or membership costs not included in per kWh rates.
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
      title="EV Home vs Public Charging Cost & Time Calculator"
      description="Professional automotive calculator: EV Home vs Public Charging Cost & Time Calculator. Get accurate estimates, expert advice, and financial insights."
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