import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LightBulbCostPerYearCalculator() {
  // Inputs:
  // wattage: number (watts of the bulb)
  // hoursPerDay: number (average daily usage hours)
  // costPerKwh: number (electricity cost per kWh in local currency)
  // bulbType: string ("Incandescent", "CFL", "LED")
  // bulbPrice: number (price per bulb)
  // bulbLifeHours: number (average lifespan in hours)
  // quantity: number (number of bulbs)

  const [inputs, setInputs] = useState({
    wattage: "",
    hoursPerDay: "",
    costPerKwh: "",
    bulbType: "LED",
    bulbPrice: "",
    bulbLifeHours: "",
    quantity: "1",
  });

  const handleInputChange = useCallback((name, value) => {
    // Sanitize numeric inputs to allow only numbers and decimals
    if (
      ["wattage", "hoursPerDay", "costPerKwh", "bulbPrice", "bulbLifeHours", "quantity"].includes(name)
    ) {
      // Allow empty string or valid number
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic:
  // Annual energy consumption per bulb (kWh) = (wattage * hoursPerDay * 365) / 1000
  // Annual energy cost per bulb = energy consumption * costPerKwh
  // Bulb replacement per year = 365 / bulbLifeHours * hoursPerDay (adjusted for usage)
  // Annual bulb cost = bulbPrice * bulbs replaced per year
  // Total annual cost = (energy cost + bulb cost) * quantity

  const results = useMemo(() => {
    const wattage = parseFloat(inputs.wattage);
    const hoursPerDay = parseFloat(inputs.hoursPerDay);
    const costPerKwh = parseFloat(inputs.costPerKwh);
    const bulbPrice = parseFloat(inputs.bulbPrice);
    const bulbLifeHours = parseFloat(inputs.bulbLifeHours);
    const quantity = parseInt(inputs.quantity, 10);

    // Validate inputs
    if (
      isNaN(wattage) || wattage <= 0 ||
      isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24 ||
      isNaN(costPerKwh) || costPerKwh <= 0 ||
      isNaN(bulbPrice) || bulbPrice < 0 ||
      isNaN(bulbLifeHours) || bulbLifeHours <= 0 ||
      isNaN(quantity) || quantity <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers in all fields. Hours per day must be between 0 and 24.",
        formulaUsed: null,
      };
    }

    // Calculate annual energy consumption per bulb in kWh
    const annualEnergyKwh = (wattage * hoursPerDay * 365) / 1000;

    // Annual energy cost per bulb
    const annualEnergyCost = annualEnergyKwh * costPerKwh;

    // Calculate number of bulbs replaced per year
    // Bulb life in hours divided by daily usage hours = lifespan in days
    // Number of replacements per year = 365 / lifespan in days
    // If bulbLifeHours is very large (e.g. LED), replacements may be less than 1 per year
    const lifespanDays = bulbLifeHours / hoursPerDay;
    const bulbsReplacedPerYear = 365 / lifespanDays;

    // Annual bulb cost per bulb
    const annualBulbCost = bulbPrice * bulbsReplacedPerYear;

    // Total annual cost for all bulbs
    const totalAnnualCost = (annualEnergyCost + annualBulbCost) * quantity;

    // Format currency with 2 decimals
    const formattedCost = totalAnnualCost.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Formula explanation
    const formulaUsed = `Total Annual Cost = Quantity × [(Wattage × Hours/Day × 365 ÷ 1000) × Cost per kWh + (Bulb Price × (365 ÷ (Bulb Life Hours ÷ Hours/Day)))]`;

    return {
      value: formattedCost,
      label: `Estimated Annual Cost for ${quantity} Bulb${quantity > 1 ? "s" : ""}`,
      subtext: `Based on your inputs for wattage, usage, electricity cost, bulb price, and lifespan.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does the bulb lifespan affect the annual cost?",
      answer:
        "The lifespan of a bulb determines how often you need to replace it. A bulb with a shorter lifespan requires more frequent replacements, increasing the annual cost. For example, incandescent bulbs typically last around 1,000 hours, while LEDs can last up to 25,000 hours or more. Factoring in replacement costs alongside energy consumption gives a more accurate picture of total yearly expenses.",
    },
    {
      question: "How does wattage impact electricity costs?",
      answer:
        "Wattage indicates the power consumption of a bulb. Higher wattage bulbs consume more electricity per hour, leading to higher energy costs. For instance, a 60-watt incandescent bulb uses more power than a 10-watt LED bulb producing similar brightness. Calculating energy consumption based on wattage and usage hours helps estimate your electricity expenses accurately.",
    },
    {
      question: "Can I use this calculator to compare different bulb types?",
      answer:
        "Absolutely! By inputting the wattage, price, and lifespan for different bulb types such as incandescent, CFL, and LED, you can compare their total annual costs side-by-side. This helps you make informed decisions about which bulb type offers the best balance of energy efficiency, longevity, and cost savings over time.",
    },
    {
      question: "Why is the cost per kWh important in this calculation?",
      answer:
        "The cost per kilowatt-hour (kWh) is the rate your utility company charges for electricity. It varies by location and provider. This value directly affects your energy cost calculation since it multiplies the total energy consumed by your bulbs. Using an accurate cost per kWh ensures your estimated annual cost reflects your actual electricity expenses.",
    },
    {
      question: "How do I find the bulb lifespan and wattage values?",
      answer:
        "Bulb wattage is usually printed on the bulb itself or its packaging. Lifespan information is often provided by the manufacturer and can be found on the box or product specifications online. Typical lifespans vary: incandescent bulbs last about 1,000 hours, CFLs around 8,000-10,000 hours, and LEDs can last 15,000 to 25,000 hours or more.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="wattage" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Bulb Wattage (Watts)
            </Label>
            <Input
              id="wattage"
              type="text"
              placeholder="e.g., 10"
              value={inputs.wattage}
              onChange={(e) => handleInputChange("wattage", e.target.value)}
              aria-describedby="wattage-desc"
            />
            <p id="wattage-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Power consumption of one bulb in watts.
            </p>
          </div>

          <div>
            <Label htmlFor="hoursPerDay" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Average Daily Usage (Hours)
            </Label>
            <Input
              id="hoursPerDay"
              type="text"
              placeholder="e.g., 5"
              value={inputs.hoursPerDay}
              onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
              aria-describedby="hours-desc"
            />
            <p id="hours-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How many hours per day the bulb is typically on (max 24).
            </p>
          </div>

          <div>
            <Label htmlFor="costPerKwh" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Electricity Cost per kWh
            </Label>
            <Input
              id="costPerKwh"
              type="text"
              placeholder="e.g., 0.13"
              value={inputs.costPerKwh}
              onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
              aria-describedby="cost-desc"
            />
            <p id="cost-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your electricity price per kilowatt-hour (e.g., 0.13 USD).
            </p>
          </div>

          <div>
            <Label htmlFor="bulbType" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Bulb Type
            </Label>
            <Select
              value={inputs.bulbType}
              onValueChange={(v) => handleInputChange("bulbType", v)}
              id="bulbType"
              aria-describedby="bulbtype-desc"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bulb type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Incandescent">Incandescent</SelectItem>
                <SelectItem value="CFL">CFL (Compact Fluorescent)</SelectItem>
                <SelectItem value="LED">LED</SelectItem>
              </SelectContent>
            </Select>
            <p id="bulbtype-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose your bulb type to help estimate typical lifespan and price.
            </p>
          </div>

          <div>
            <Label htmlFor="bulbPrice" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Bulb Price (per bulb)
            </Label>
            <Input
              id="bulbPrice"
              type="text"
              placeholder="e.g., 2.50"
              value={inputs.bulbPrice}
              onChange={(e) => handleInputChange("bulbPrice", e.target.value)}
              aria-describedby="price-desc"
            />
            <p id="price-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cost to purchase one bulb of this type.
            </p>
          </div>

          <div>
            <Label htmlFor="bulbLifeHours" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Bulb Lifespan (Hours)
            </Label>
            <Input
              id="bulbLifeHours"
              type="text"
              placeholder="e.g., 25000"
              value={inputs.bulbLifeHours}
              onChange={(e) => handleInputChange("bulbLifeHours", e.target.value)}
              aria-describedby="life-desc"
            />
            <p id="life-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Average lifespan of the bulb in hours before replacement.
            </p>
          </div>

          <div>
            <Label htmlFor="quantity" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Number of Bulbs
            </Label>
            <Input
              id="quantity"
              type="text"
              placeholder="e.g., 1"
              value={inputs.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              aria-describedby="quantity-desc"
            />
            <p id="quantity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How many bulbs you want to calculate the cost for.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate annual cost"
        >
          <DollarSign className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              wattage: "",
              hoursPerDay: "",
              costPerKwh: "",
              bulbType: "LED",
              bulbPrice: "",
              bulbLifeHours: "",
              quantity: "1",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 border p-4 mt-4">
          <CardContent>
            <p className="text-red-800 dark:text-red-300 font-semibold">{results.warning}</p>
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the annual cost of operating a light bulb involves more than just looking at the electricity bill.
          It requires understanding how much power the bulb consumes, how long it is used each day, the cost of electricity in your area,
          and the cost and lifespan of the bulb itself. By combining these factors, you can get a comprehensive estimate of the total yearly expense.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different types of bulbs—incandescent, CFL, and LED—vary widely in energy efficiency and lifespan. Incandescent bulbs typically consume more power and have shorter lifespans, leading to higher energy and replacement costs. LEDs, while often more expensive upfront, use significantly less electricity and last much longer, resulting in substantial savings over time. This calculator helps you quantify those savings by factoring in all relevant variables.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate estimate of your light bulb costs per year, follow these detailed steps to input your data correctly:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the <em>Wattage</em> of your bulb. This is the power consumption in watts and is usually printed on the bulb or packaging.
          </li>
          <li>
            <strong>Step 2:</strong> Input the average number of <em>Hours per Day</em> you use the bulb. This should be between 0 and 24 hours.
          </li>
          <li>
            <strong>Step 3:</strong> Provide your local <em>Electricity Cost per kWh</em>. This rate can be found on your electricity bill or utility provider’s website.
          </li>
          <li>
            <strong>Step 4:</strong> Select the <em>Bulb Type</em> from the dropdown menu. This helps contextualize typical lifespan and price ranges.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the <em>Bulb Price</em> — how much you pay for one bulb of this type.
          </li>
          <li>
            <strong>Step 6:</strong> Enter the <em>Bulb Lifespan</em> in hours. This is how long the bulb typically lasts before needing replacement.
          </li>
          <li>
            <strong>Step 7:</strong> Specify the <em>Number of Bulbs</em> you want to calculate for, if you have multiple bulbs.
          </li>
          <li>
            <strong>Step 8:</strong> Click the <em>Calculate</em> button to see your estimated annual cost. If you want to start over, use the <em>Reset</em> button.
          </li>
        </ul>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Light Bulb Cost per Year Calculator"
      description="Calculate electricity and replacement costs for light bulbs. Compare LED, CFL, and incandescent bulbs to see how much you save on your energy bill annually."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Annual Cost = Quantity × [(Wattage × Hours/Day × 365 ÷ 1000) × Cost per kWh + (Bulb Price × (365 ÷ (Bulb Life Hours ÷ Hours/Day)))]",
        variables: [
          { symbol: "Wattage", description: "Power consumption of one bulb in watts" },
          { symbol: "Hours/Day", description: "Average daily usage hours" },
          { symbol: "Cost per kWh", description: "Electricity cost per kilowatt-hour" },
          { symbol: "Bulb Price", description: "Cost to purchase one bulb" },
          { symbol: "Bulb Life Hours", description: "Average lifespan of the bulb in hours" },
          { symbol: "Quantity", description: "Number of bulbs" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have 3 LED bulbs, each rated at 10 watts, used for 5 hours daily. Electricity costs $0.13 per kWh. Each bulb costs $3 and lasts 25,000 hours. Let's calculate the annual cost.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate annual energy consumption per bulb: (10 watts × 5 hours/day × 365 days) ÷ 1000 = 18.25 kWh.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate annual energy cost per bulb: 18.25 kWh × $0.13 = $2.37.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate bulb replacements per year: 25,000 hours ÷ 5 hours/day = 5,000 days lifespan, so 365 ÷ 5,000 = 0.073 replacements per year.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate annual bulb cost per bulb: $3 × 0.073 = $0.22.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate total annual cost for 3 bulbs: (2.37 + 0.22) × 3 = $7.77.",
          },
        ],
        result: "The total estimated annual cost for 3 LED bulbs is approximately $7.77.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}