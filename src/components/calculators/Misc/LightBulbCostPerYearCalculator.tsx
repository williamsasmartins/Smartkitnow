import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LightBulbCostPerYearCalculator() {
  const [inputs, setInputs] = useState({
    wattage: "",
    hoursPerDay: "",
    costPerKwh: "",
    quantity: "1",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic:
  // Annual Energy Consumption (kWh) = (Wattage * Hours per day * 365) / 1000
  // Annual Cost = Annual Energy Consumption * Cost per kWh * Quantity

  const results = useMemo(() => {
    const wattage = parseFloat(inputs.wattage);
    const hoursPerDay = parseFloat(inputs.hoursPerDay);
    const costPerKwh = parseFloat(inputs.costPerKwh);
    const quantity = parseInt(inputs.quantity);

    if (
      isNaN(wattage) || wattage <= 0 ||
      isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24 ||
      isNaN(costPerKwh) || costPerKwh <= 0 ||
      isNaN(quantity) || quantity <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all fields. Hours per day must be between 1 and 24.",
        formulaUsed: "Annual Cost = ((Wattage × Hours per day × 365) / 1000) × Cost per kWh × Quantity",
      };
    }

    const annualEnergyKwh = (wattage * hoursPerDay * 365) / 1000;
    const annualCost = annualEnergyKwh * costPerKwh * quantity;

    return {
      value: `$${annualCost.toFixed(2)}`,
      label: "Estimated Annual Electricity Cost",
      subtext: `Based on ${quantity} bulb${quantity > 1 ? "s" : ""} at ${wattage}W used ${hoursPerDay} hours/day.`,
      warning: null,
      formulaUsed: "Annual Cost = ((Wattage × Hours per day × 365) / 1000) × Cost per kWh × Quantity",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does the wattage of a bulb affect its electricity cost?",
      answer:
        "Wattage indicates the power consumption of a light bulb. Higher wattage bulbs consume more electricity per hour, increasing your energy costs. For example, a 60W incandescent bulb uses more energy than a 10W LED bulb for the same amount of light output, resulting in higher annual costs.",
    },
    {
      question: "Why is the cost per kWh important in this calculation?",
      answer:
        "The cost per kilowatt-hour (kWh) is the rate your utility company charges for electricity. This value varies by location and provider. Using your actual cost per kWh ensures the calculator provides an accurate estimate of your annual lighting expenses.",
    },
    {
      question: "Can I use this calculator to compare LED and incandescent bulbs?",
      answer:
        "Absolutely. By inputting the wattage and usage hours for different bulb types, you can compare their annual electricity costs side-by-side. This helps in making informed decisions about energy-efficient lighting upgrades.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wattage" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Bulb Wattage (Watts)
            </Label>
            <Input
              id="wattage"
              type="number"
              min="1"
              step="any"
              placeholder="e.g., 10 for LED, 60 for incandescent"
              value={inputs.wattage}
              onChange={(e) => handleInputChange("wattage", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="hoursPerDay" className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-400" /> Average Hours Used Per Day
            </Label>
            <Input
              id="hoursPerDay"
              type="number"
              min="1"
              max="24"
              step="any"
              placeholder="e.g., 5"
              value={inputs.hoursPerDay}
              onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="costPerKwh" className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Electricity Cost per kWh ($)
            </Label>
            <Input
              id="costPerKwh"
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g., 0.13"
              value={inputs.costPerKwh}
              onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Number of Bulbs
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              placeholder="e.g., 1"
              value={inputs.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs to current inputs
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              wattage: "",
              hoursPerDay: "",
              costPerKwh: "",
              quantity: "1",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-600">
          <CardContent className="text-center text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{results.warning}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Light Bulb Cost per Year Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Light Bulb Cost per Year Calculator is a practical tool designed to estimate the annual electricity expense associated with using one or more light bulbs in your home or workplace. By inputting the wattage of the bulb, average daily usage hours, your local electricity rate, and the number of bulbs, you receive a clear picture of how much energy your lighting consumes and what it costs you annually. This calculator empowers consumers to make informed decisions about lighting choices, encouraging energy-efficient upgrades that can lead to significant savings over time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the cost implications of different bulb types, such as incandescent, CFL, or LED, helps in selecting options that balance brightness, longevity, and energy consumption. This tool also highlights the impact of usage patterns and electricity rates on your overall lighting costs, making it an essential resource for budgeting and sustainability efforts.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only a few key pieces of information. First, identify the wattage of your light bulb, which is usually printed on the bulb itself or its packaging. Next, estimate how many hours per day the bulb is typically turned on. Then, enter your local electricity cost per kilowatt-hour (kWh), which can be found on your utility bill or provider's website. Finally, specify how many bulbs you want to calculate for.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the wattage of your light bulb (e.g., 10W for LED, 60W for incandescent).
          </li>
          <li>
            <strong>Step 2:</strong> Input the average number of hours the bulb is used daily (between 1 and 24).
          </li>
          <li>
            <strong>Step 3:</strong> Provide your electricity cost per kWh, which varies by location and provider.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the number of bulbs you want to calculate for to get total cost.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see your estimated annual electricity cost for lighting.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When selecting light bulbs, consider not only the wattage but also the lumens, which indicate brightness. Opting for LED bulbs can drastically reduce your energy consumption and costs due to their high efficiency and long lifespan. Additionally, always ensure bulbs are compatible with your fixtures and dimmers to avoid electrical hazards. Regularly check for any flickering or unusual heat, which can indicate a faulty bulb or wiring issue that should be addressed promptly by a qualified electrician.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          To maximize savings, turn off lights when not in use and consider installing timers or motion sensors in frequently unoccupied areas. Also, keep bulbs and fixtures clean, as dust can reduce light output and efficiency. By combining smart usage habits with energy-efficient bulbs, you can significantly lower your lighting costs while contributing to environmental sustainability.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.energy.gov/energysaver/save-electricity-and-fuel/lighting-choices-save-you-money"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy Saver - Lighting Choices Save You Money <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide by the U.S. Department of Energy on how different lighting options affect energy consumption and costs.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/energy/green-tips-lighting"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA Green Tips: Lighting <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Environmental Protection Agency's tips on energy-efficient lighting and how it contributes to cost savings and environmental benefits.
            </p>
          </li>
          <li>
            <a
              href="https://extension.usu.edu/energy/energy-efficiency/lighting"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Utah State University Extension - Energy Efficient Lighting <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource explaining lighting efficiency, cost calculations, and practical advice for consumers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Light Bulb Cost per Year Calculator"
      description="Calculate electricity costs for light bulbs. Compare LED vs. incandescent usage to see how much you save on your energy bill."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Annual Cost = ((Wattage × Hours per day × 365) / 1000) × Cost per kWh × Quantity",
        variables: [
          { symbol: "Wattage", description: "Power consumption of the bulb in watts (W)" },
          { symbol: "Hours per day", description: "Average daily usage time in hours" },
          { symbol: "365", description: "Number of days in a year" },
          { symbol: "1000", description: "Conversion factor from watts to kilowatts" },
          { symbol: "Cost per kWh", description: "Electricity cost per kilowatt-hour in dollars" },
          { symbol: "Quantity", description: "Number of bulbs used" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have 5 LED bulbs rated at 10 watts each, used for 6 hours daily, and your electricity cost is $0.13 per kWh.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate annual energy consumption per bulb: (10W × 6h × 365) / 1000 = 21.9 kWh",
          },
          {
            label: "Step 2",
            explanation: "Calculate annual cost per bulb: 21.9 kWh × $0.13 = $2.85",
          },
          {
            label: "Step 3",
            explanation: "Calculate total cost for 5 bulbs: $2.85 × 5 = $14.25 per year",
          },
        ],
        result: "The total annual electricity cost for 5 LED bulbs is approximately $14.25.",
      }}
      relatedCalculators={[
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}