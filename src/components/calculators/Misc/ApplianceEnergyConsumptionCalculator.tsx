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

const applianceData = {
  Refrigerator: { avgPowerWatts: 150 },
  "Washing Machine": { avgPowerWatts: 500 },
  "Dishwasher": { avgPowerWatts: 1200 },
  "Television": { avgPowerWatts: 100 },
  "Microwave Oven": { avgPowerWatts: 1100 },
  "Air Conditioner": { avgPowerWatts: 3500 },
  "Electric Oven": { avgPowerWatts: 2400 },
  "Ceiling Fan": { avgPowerWatts: 75 },
  "Laptop": { avgPowerWatts: 50 },
  "Light Bulb (LED)": { avgPowerWatts: 10 },
};

export default function ApplianceEnergyConsumptionCalculator() {
  const [inputs, setInputs] = useState({
    appliance: "Refrigerator",
    powerRating: "", // optional override in watts
    hoursPerDay: "",
    daysPerMonth: 30,
    costPerKwh: 0.13,
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate energy consumption and cost
  const results = useMemo(() => {
    const appliance = inputs.appliance;
    const powerRating =
      inputs.powerRating && Number(inputs.powerRating) > 0
        ? Number(inputs.powerRating)
        : applianceData[appliance]?.avgPowerWatts || 0;
    const hoursPerDay = Number(inputs.hoursPerDay);
    const daysPerMonth = Number(inputs.daysPerMonth);
    const costPerKwh = Number(inputs.costPerKwh);

    if (
      powerRating <= 0 ||
      hoursPerDay <= 0 ||
      daysPerMonth <= 0 ||
      costPerKwh <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: <AlertTriangle className="inline-block mr-1" />,
        formulaUsed:
          "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000",
      };
    }

    // Energy in kWh per month
    const energyKwh = (powerRating * hoursPerDay * daysPerMonth) / 1000;
    // Cost in dollars
    const cost = energyKwh * costPerKwh;

    return {
      value: `$${cost.toFixed(2)}`,
      label: `Estimated Monthly Energy Cost for your ${appliance}`,
      subtext: `${energyKwh.toFixed(2)} kWh consumed per month`,
      warning: null,
      formulaUsed:
        "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000; Cost = Energy × Cost per kWh",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimate based on average power ratings and your usage inputs. Actual consumption may vary depending on appliance efficiency, age, and usage patterns. For precise measurements, consider using a plug-in power meter.",
    },
    {
      question: "Can I enter my appliance's exact power rating?",
      answer:
        "Yes, if you know the exact wattage from your appliance label or manual, you can enter it in the 'Power Rating' field to get a more accurate estimate. Otherwise, the calculator uses typical average values for common appliances.",
    },
    {
      question: "Why do I need to enter cost per kWh?",
      answer:
        "Electricity rates vary by location and provider. Entering your local cost per kilowatt-hour ensures the cost estimate reflects your actual utility rates, helping you better manage your energy expenses.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="appliance" className="mb-1 font-semibold flex items-center gap-1">
            Appliance <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.appliance}
            onValueChange={(v) => handleInputChange("appliance", v)}
            id="appliance"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appliance" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(applianceData).map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="powerRating" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Power Rating (Watts) <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            type="number"
            id="powerRating"
            placeholder={`Default: ${applianceData[inputs.appliance]?.avgPowerWatts} W`}
            value={inputs.powerRating}
            onChange={(e) => handleInputChange("powerRating", e.target.value)}
            min={0}
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter exact wattage if known, otherwise leave blank to use average.
          </p>

          <Label htmlFor="hoursPerDay" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Hours Used Per Day <Sun className="w-4 h-4 text-yellow-500" />
          </Label>
          <Input
            type="number"
            id="hoursPerDay"
            placeholder="e.g., 5"
            value={inputs.hoursPerDay}
            onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
            min={0}
            step={0.1}
          />

          <Label htmlFor="daysPerMonth" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Days Used Per Month <Calendar className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            type="number"
            id="daysPerMonth"
            placeholder="e.g., 30"
            value={inputs.daysPerMonth}
            onChange={(e) => handleInputChange("daysPerMonth", e.target.value)}
            min={1}
            max={31}
          />

          <Label htmlFor="costPerKwh" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Electricity Cost per kWh ($) <DollarSign className="w-4 h-4 text-green-600" />
          </Label>
          <Input
            type="number"
            id="costPerKwh"
            placeholder="e.g., 0.13"
            value={inputs.costPerKwh}
            onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
            min={0}
            step={0.001}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed; calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              appliance: "Refrigerator",
              powerRating: "",
              hoursPerDay: "",
              daysPerMonth: 30,
              costPerKwh: 0.13,
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
            <p className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
              {results.label}
            </p>
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-700 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-red-600 flex justify-center items-center gap-1 font-semibold">
                {results.warning} {results.subtext}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Appliance Energy Consumption Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Appliance Energy Consumption Calculator is a powerful tool designed to help you estimate the monthly electricity usage and cost of your household appliances. By inputting the appliance type, estimated power rating, daily usage hours, and your local electricity rate, you can gain a clear understanding of how much energy each device consumes. This insight empowers you to make informed decisions about energy conservation, budgeting, and appliance upgrades. The calculator uses standard formulas based on watts, usage time, and cost per kilowatt-hour to provide accurate and actionable results.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and intuitive. Start by selecting the appliance you want to analyze from the dropdown menu. If you know the exact power rating (in watts) of your appliance, enter it in the provided field; otherwise, the calculator will use an average value for that appliance type. Next, input the average number of hours you use the appliance each day and the number of days per month it operates. Finally, enter your local electricity cost per kilowatt-hour to get a personalized estimate of your monthly energy expenses.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your appliance or enter its power rating manually.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the average daily usage hours and monthly usage days.
          </li>
          <li>
            <strong>Step 3:</strong> Input your local electricity cost per kWh (check your utility bill).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your estimated monthly energy cost and consumption.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to identify high-energy appliances and consider energy-saving measures.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the accuracy and usefulness of this calculator, consider measuring your appliance’s actual power consumption with a plug-in watt meter, which can provide real-time data. Always ensure that your appliances are well-maintained and operating efficiently, as worn or malfunctioning devices can consume more energy. For safety, never attempt to open or modify electrical appliances yourself; consult a qualified technician for repairs or upgrades. Additionally, consider investing in energy-efficient appliances certified by ENERGY STAR or similar programs to reduce your electricity consumption and environmental impact.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.energy.gov/energysaver/save-electricity-and-fuel/appliances-and-electronics"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy Saver - Appliances and Electronics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidance from the U.S. Department of Energy on how appliances consume energy and tips to reduce usage.
            </p>
          </li>
          <li>
            <a
              href="https://www.energystar.gov/products/appliances"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ENERGY STAR Appliances <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Information on energy-efficient appliances certified by ENERGY STAR, helping consumers save energy and money.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA Greenhouse Gas Equivalencies Calculator <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Tool from the Environmental Protection Agency to translate energy savings into environmental impact metrics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Appliance Energy Consumption Calculator"
      description="Calculate appliance energy consumption. Track how much electricity your fridge, TV, and washer use to manage your utility bill."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000; Cost = Energy × Cost per kWh",
        variables: [
          { symbol: "Power (Watts)", description: "The power rating of the appliance in watts" },
          { symbol: "Hours per Day", description: "Average daily usage time in hours" },
          { symbol: "Days per Month", description: "Number of days the appliance is used per month" },
          { symbol: "Cost per kWh", description: "Electricity cost per kilowatt-hour in dollars" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to estimate the monthly cost of running a refrigerator that uses about 150 watts, runs 24 hours a day, every day of the month, with an electricity rate of $0.13 per kWh.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Refrigerator' from the appliance dropdown or enter 150 watts as the power rating.",
          },
          {
            label: "Step 2",
            explanation: "Enter 24 hours for daily usage and 30 days for monthly usage.",
          },
          {
            label: "Step 3",
            explanation: "Input 0.13 as the cost per kWh based on your utility bill.",
          },
          {
            label: "Step 4",
            explanation: "Click 'Calculate' to see the estimated monthly energy cost.",
          },
        ],
        result:
          "The calculator estimates about 112.5 kWh consumed monthly, costing approximately $14.63 per month to run the refrigerator.",
      }}
      relatedCalculators={[
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday/hose-runtime-flow-rate", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday/ice-quantity-beverages", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
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