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
      question: "How does the calculator determine annual light bulb cost?",
      answer: "The calculator multiplies wattage by hours used per year and your local electricity rate ($/kWh) to estimate yearly energy cost for a single bulb.",
    },
    {
      question: "What's the difference between incandescent and LED bulb costs?",
      answer: "LED bulbs use 75-80% less energy than incandescent bulbs; a 60W incandescent costs ~$6.50/year while an equivalent 9W LED costs ~$0.97/year at $0.12/kWh.",
    },
    {
      question: "Should I include bulb replacement cost in the calculator?",
      answer: "The calculator focuses on energy costs; however, LEDs last 25,000+ hours while incandescent bulbs last only 1,000 hours, making total ownership cost significantly lower for LEDs.",
    },
    {
      question: "How do I find my local electricity rate for the calculator?",
      answer: "Check your electric bill for the per-kilowatt-hour (kWh) rate, typically between $0.10–$0.18 depending on your region and utility provider.",
    },
    {
      question: "Can I use this calculator for outdoor or commercial lighting?",
      answer: "Yes, the calculator works for any bulb type; just enter the wattage, daily usage hours, and your electricity rate for accurate cost estimates.",
    },
    {
      question: "How does bulb brightness (lumens) affect operating cost?",
      answer: "Lumens (brightness) don't directly affect cost—only wattage consumption does; higher-efficiency bulbs deliver more lumens per watt, lowering costs.",
    },
    {
      question: "What's the payback period for switching from incandescent to LED?",
      answer: "LED bulbs typically pay for themselves within 1-3 years through energy savings, despite higher upfront costs of $3-5 per bulb versus $0.50 for incandescent.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Light Bulb Cost per Year Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates the annual energy cost of operating a light bulb based on its power consumption, daily usage, and your local electricity rate. Use it to compare costs across different bulb types and make informed purchasing decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter three key inputs: the bulb's wattage (found on the package or bulb itself), average daily hours used, and your electricity rate in $/kWh (check your utility bill). The calculator automatically multiplies these values to project yearly costs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows your annual operating expense for that single bulb. Multiply this by the number of bulbs in your home to estimate total lighting costs, and compare incandescent, CFL, and LED options to identify savings opportunities.</p>
        </div>
      </section>

      {/* TABLE: Annual Energy Cost by Bulb Type (Based on 3 Hours Daily Use) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Energy Cost by Bulb Type (Based on 3 Hours Daily Use)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows yearly operating costs for common bulb types at the average US rate of $0.12/kWh.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bulb Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wattage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual kWh Used</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Incandescent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.88</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Halogen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">47.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.64</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CFL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">LED</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.19</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smart LED</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.32</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 365 days/year × 3 hours/day. Actual costs vary by electricity rate and usage patterns.</p>
      </section>

      {/* TABLE: Impact of Daily Usage Hours on Annual LED Cost */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Daily Usage Hours on Annual LED Cost</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">LED bulb annual operating costs increase proportionally with daily usage hours at $0.12/kWh.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Hours Used</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual kWh (9W LED)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 hour</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.03</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.97</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 hours (continuous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.46</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.79</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Continuous operation at 24 hours/day is unrealistic for most household bulbs but included for reference.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your electric bill for the exact per-kWh rate rather than using national averages, as rates vary significantly by region.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">LED bulbs have lower wattage but similar brightness output; compare lumens (brightness) not watts to find true equivalents.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate total cost of ownership by adding bulb purchase price to annual energy costs, favoring LEDs' 25,000+ hour lifespan.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator when evaluating smart bulbs, color-changing LEDs, and specialty lighting to compare against standard bulbs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Lumens Instead of Wattage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lumens measure brightness, not energy consumption; always enter the bulb's wattage for accurate cost calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Update Electricity Rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using an outdated or incorrect $/kWh rate can skew results by 20-40%; verify your current rate from your latest utility bill.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Bulbs With Same Brightness Cost the Same</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 60W incandescent and 9W LED both produce ~800 lumens but cost $7.88 and $1.19 annually—efficiency matters more than perceived equivalence.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Seasonal Usage Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator uses a fixed daily average; winter months with shorter daylight may require more artificial light, increasing actual costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine annual light bulb cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator multiplies wattage by hours used per year and your local electricity rate ($/kWh) to estimate yearly energy cost for a single bulb.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between incandescent and LED bulb costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">LED bulbs use 75-80% less energy than incandescent bulbs; a 60W incandescent costs ~$6.50/year while an equivalent 9W LED costs ~$0.97/year at $0.12/kWh.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include bulb replacement cost in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator focuses on energy costs; however, LEDs last 25,000+ hours while incandescent bulbs last only 1,000 hours, making total ownership cost significantly lower for LEDs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find my local electricity rate for the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check your electric bill for the per-kilowatt-hour (kWh) rate, typically between $0.10–$0.18 depending on your region and utility provider.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for outdoor or commercial lighting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for any bulb type; just enter the wattage, daily usage hours, and your electricity rate for accurate cost estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does bulb brightness (lumens) affect operating cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lumens (brightness) don't directly affect cost—only wattage consumption does; higher-efficiency bulbs deliver more lumens per watt, lowering costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the payback period for switching from incandescent to LED?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">LED bulbs typically pay for themselves within 1-3 years through energy savings, despite higher upfront costs of $3-5 per bulb versus $0.50 for incandescent.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Electricity Prices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for average US electricity rates by state and region updated monthly.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/products/lighting_fans/light_bulbs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ENERGY STAR - Light Bulb Comparison Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource comparing energy consumption, lifespan, and cost savings across bulb types certified by ENERGY STAR.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/how-save-money-lighting" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FTC - Shopping for Light Bulbs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Trade Commission guidance on understanding lighting labels, energy costs, and calculating long-term savings.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/energysaver/led-lighting" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Department of Energy - LED Lighting Facts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">DOE resource providing technical specifications, efficiency data, and consumer information on LED technology and benefits.</p>
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