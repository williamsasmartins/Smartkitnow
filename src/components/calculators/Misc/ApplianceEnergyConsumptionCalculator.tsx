import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Home,
  Heart,
  Utensils,
  Leaf,
  Calendar,
  DollarSign,
  Droplets,
  Activity,
  Moon,
  Sun,
  Users,
  Paintbrush,
  Wrench,
  Info,
  RotateCcw,
  AlertTriangle,
  FlaskConical,
  Scale,
  Waves,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const applianceOptions = [
  {
    label: "Refrigerator",
    powerWatts: 150,
    typicalHoursPerDay: 24,
    description:
      "A refrigerator typically runs continuously to keep food cold, cycling on and off to maintain temperature. Average power consumption is around 150 watts when running.",
  },
  {
    label: "Television (LED/LCD)",
    powerWatts: 100,
    typicalHoursPerDay: 5,
    description:
      "Modern LED/LCD TVs consume about 100 watts when turned on. Usage varies widely depending on viewing habits.",
  },
  {
    label: "Washing Machine",
    powerWatts: 500,
    typicalHoursPerDay: 1,
    description:
      "Washing machines use high power during operation but only run for short periods, typically about an hour per day or less.",
  },
  {
    label: "Microwave Oven",
    powerWatts: 1200,
    typicalHoursPerDay: 0.25,
    description:
      "Microwaves consume high power but are used for short durations, often just a few minutes per day.",
  },
  {
    label: "Air Conditioner (Window Unit)",
    powerWatts: 1000,
    typicalHoursPerDay: 8,
    description:
      "Window air conditioners consume significant power and are typically used several hours a day during hot seasons.",
  },
  {
    label: "Laptop Computer",
    powerWatts: 60,
    typicalHoursPerDay: 6,
    description:
      "Laptops are energy-efficient devices, consuming around 60 watts during use, often for several hours daily.",
  },
  {
    label: "Ceiling Fan",
    powerWatts: 75,
    typicalHoursPerDay: 8,
    description:
      "Ceiling fans use moderate power and are often run for many hours to circulate air and cool rooms.",
  },
  {
    label: "Electric Oven",
    powerWatts: 2400,
    typicalHoursPerDay: 1,
    description:
      "Electric ovens consume high power but are used intermittently, usually about an hour per day.",
  },
];

function formatKWh(value: number) {
  return `${value.toFixed(2)} kWh`;
}

function formatCost(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function ApplianceEnergyConsumptionCalculator() {
  // Inputs: appliance, power rating (watts), hours used per day, days per month, cost per kWh
  const [inputs, setInputs] = useState({
    appliance: "",
    powerWatts: "",
    hoursPerDay: "",
    daysPerMonth: "30",
    costPerKWh: "0.13",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse inputs safely
  const powerWattsNum = Number(inputs.powerWatts);
  const hoursPerDayNum = Number(inputs.hoursPerDay);
  const daysPerMonthNum = Number(inputs.daysPerMonth);
  const costPerKWhNum = Number(inputs.costPerKWh);

  // Calculate energy consumption and cost
  const results = useMemo(() => {
    if (
      !powerWattsNum ||
      powerWattsNum <= 0 ||
      !hoursPerDayNum ||
      hoursPerDayNum <= 0 ||
      !daysPerMonthNum ||
      daysPerMonthNum <= 0 ||
      !costPerKWhNum ||
      costPerKWhNum <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: null,
      };
    }

    // Energy consumption in kilowatt-hours (kWh)
    // Formula: (Power in watts × hours per day × days per month) / 1000
    const energyKWh = (powerWattsNum * hoursPerDayNum * daysPerMonthNum) / 1000;

    // Cost = energy consumption × cost per kWh
    const cost = energyKWh * costPerKWhNum;

    return {
      value: formatKWh(energyKWh),
      label: "Estimated Monthly Energy Consumption",
      subtext: `Estimated monthly cost: ${formatCost(cost)} (based on $${costPerKWhNum.toFixed(
        2
      )} per kWh)`,
      warning: null,
      formulaUsed:
        "Energy (kWh) = (Power (W) × Hours per day × Days per month) ÷ 1000; Cost = Energy × Cost per kWh",
    };
  }, [powerWattsNum, hoursPerDayNum, daysPerMonthNum, costPerKWhNum]);

  // When appliance changes, auto-fill typical power and hours
  const handleApplianceChange = useCallback(
    (value) => {
      const appliance = applianceOptions.find((a) => a.label === value);
      if (appliance) {
        setInputs((prev) => ({
          ...prev,
          appliance: appliance.label,
          powerWatts: appliance.powerWatts.toString(),
          hoursPerDay: appliance.typicalHoursPerDay.toString(),
        }));
      } else {
        setInputs((prev) => ({
          ...prev,
          appliance: value,
          powerWatts: "",
          hoursPerDay: "",
        }));
      }
    },
    [setInputs]
  );

  const faqs = [
    {
      question: "What is energy consumption and why is it measured in kilowatt-hours?",
      answer:
        "Energy consumption refers to the amount of electrical energy an appliance uses over time. It is measured in kilowatt-hours (kWh), which represents the energy used by a device consuming 1000 watts for one hour. This unit helps quantify electricity usage in a way that relates directly to your utility bill, making it easier to understand and manage your energy costs.",
    },
    {
      question: "How can I find the power rating (watts) of my appliance?",
      answer:
        "The power rating is usually found on the appliance’s label or in the user manual. It is often listed in watts (W) or amps and volts, which can be multiplied to find watts (Watts = Amps × Volts). If you cannot find this information, you can look up typical power ratings online for your appliance model or use the default values provided in this calculator.",
    },
    {
      question: "Why do I need to input hours of use per day and days per month?",
      answer:
        "Electricity consumption depends not only on the power rating but also on how long the appliance is used. Hours per day and days per month help estimate the total operational time, which directly affects energy consumption. Accurately estimating these values ensures the calculator provides a realistic estimate of your monthly energy use and cost.",
    },
    {
      question: "How accurate are the estimates from this calculator?",
      answer:
        "The calculator provides an estimate based on average power ratings and usage times. Actual consumption may vary due to appliance efficiency, usage patterns, and power fluctuations. For precise measurements, consider using a plug-in power meter. However, this tool is excellent for understanding general energy consumption trends and identifying high-energy appliances.",
    },
    {
      question: "Can this calculator help me reduce my electricity bill?",
      answer:
        "Yes, by identifying which appliances consume the most energy, you can make informed decisions about usage habits, maintenance, or upgrading to more energy-efficient models. Tracking consumption helps prioritize changes that will have the greatest impact on reducing your electricity bill.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 shadow-md rounded-md">
        <div className="space-y-4">
          <Label htmlFor="appliance" className="font-semibold text-slate-700 dark:text-slate-300">
            Select Appliance
          </Label>
          <Select
            value={inputs.appliance}
            onValueChange={handleApplianceChange}
            aria-label="Select appliance"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an appliance" />
            </SelectTrigger>
            <SelectContent>
              {applianceOptions.map((appl) => (
                <SelectItem key={appl.label} value={appl.label}>
                  {appl.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {inputs.appliance && (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {
                applianceOptions.find((a) => a.label === inputs.appliance)?.description ||
                "Custom appliance selected."
              }
            </p>
          )}
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="powerWatts" className="font-semibold text-slate-700 dark:text-slate-300">
            Power Rating (Watts)
          </Label>
          <Input
            id="powerWatts"
            type="number"
            min={1}
            step={1}
            value={inputs.powerWatts}
            onChange={(e) => handleInputChange("powerWatts", e.target.value)}
            placeholder="e.g., 150"
            aria-describedby="powerWattsHelp"
          />
          <p id="powerWattsHelp" className="text-xs text-slate-500 dark:text-slate-400">
            Enter the power consumption of the appliance in watts (W).
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="hoursPerDay" className="font-semibold text-slate-700 dark:text-slate-300">
            Hours Used Per Day
          </Label>
          <Input
            id="hoursPerDay"
            type="number"
            min={0}
            step={0.1}
            value={inputs.hoursPerDay}
            onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
            placeholder="e.g., 5"
            aria-describedby="hoursPerDayHelp"
          />
          <p id="hoursPerDayHelp" className="text-xs text-slate-500 dark:text-slate-400">
            Average number of hours the appliance is used daily.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="daysPerMonth" className="font-semibold text-slate-700 dark:text-slate-300">
            Days Used Per Month
          </Label>
          <Input
            id="daysPerMonth"
            type="number"
            min={1}
            max={31}
            step={1}
            value={inputs.daysPerMonth}
            onChange={(e) => handleInputChange("daysPerMonth", e.target.value)}
            placeholder="e.g., 30"
            aria-describedby="daysPerMonthHelp"
          />
          <p id="daysPerMonthHelp" className="text-xs text-slate-500 dark:text-slate-400">
            Number of days the appliance is used in a month.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="costPerKWh" className="font-semibold text-slate-700 dark:text-slate-300">
            Electricity Cost per kWh ($)
          </Label>
          <Input
            id="costPerKWh"
            type="number"
            min={0}
            step={0.01}
            value={inputs.costPerKWh}
            onChange={(e) => handleInputChange("costPerKWh", e.target.value)}
            placeholder="e.g., 0.13"
            aria-describedby="costPerKWhHelp"
          />
          <p id="costPerKWhHelp" className="text-xs text-slate-500 dark:text-slate-400">
            Enter your electricity rate per kilowatt-hour (check your utility bill).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed, results update automatically
            }}
            aria-label="Calculate energy consumption"
          >
            <Home className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                appliance: "",
                powerWatts: "",
                hoursPerDay: "",
                daysPerMonth: "30",
                costPerKWh: "0.13",
              })
            }
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
            )}
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
          Electricity consumption is a fundamental concept that helps us understand how much energy our household appliances use over time. It is measured in kilowatt-hours (kWh), which quantifies the amount of energy consumed by a device operating at a power of 1000 watts for one hour. This unit is the standard measurement used by utility companies to calculate your electricity bill.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different appliances consume electricity at different rates depending on their power rating (watts) and how long they are used. For example, a refrigerator runs almost continuously but at a moderate power level, while a microwave uses a high amount of power but only for a few minutes. Understanding these factors allows you to estimate your energy consumption and identify opportunities to save on your electricity bill.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the monthly energy consumption and cost of any appliance by entering its power rating, usage time, and your electricity rate. By tracking and managing your appliance usage, you can make informed decisions to reduce energy waste and lower your utility expenses.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Appliance Energy Consumption Calculator is straightforward and designed to provide you with accurate estimates based on your inputs. Follow these detailed steps to get the most out of the tool:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1: Select an Appliance</strong> – Choose an appliance from the dropdown list. This will auto-fill typical power consumption and usage hours for common household devices. If your appliance is not listed, you can manually enter the details.
          </li>
          <li>
            <strong>Step 2: Enter Power Rating</strong> – Input the power rating of your appliance in watts (W). This information is usually found on the appliance label or manual. If unknown, use typical values or look them up online.
          </li>
          <li>
            <strong>Step 3: Specify Usage Time</strong> – Enter the average number of hours per day you use the appliance. Be as accurate as possible to get a realistic estimate.
          </li>
          <li>
            <strong>Step 4: Enter Days Used Per Month</strong> – Specify how many days in a month the appliance is used. Most users can leave this at 30 for a monthly estimate.
          </li>
          <li>
            <strong>Step 5: Input Electricity Cost</strong> – Enter your electricity rate per kilowatt-hour (kWh), which you can find on your utility bill. This allows the calculator to estimate your monthly cost.
          </li>
          <li>
            <strong>Step 6: Calculate</strong> – Click the Calculate button to see your estimated monthly energy consumption and cost. If you want to start over, use the Reset button to clear all inputs.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          By following these steps, you can quickly assess the energy impact of any appliance and make informed decisions to optimize your household energy use.
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
          "Energy (kWh) = (Power (W) × Hours per day × Days per month) ÷ 1000; Cost = Energy × Cost per kWh",
        variables: [
          { symbol: "Power (W)", description: "Power rating of the appliance in watts" },
          { symbol: "Hours per day", description: "Average daily usage time in hours" },
          { symbol: "Days per month", description: "Number of days appliance is used monthly" },
          { symbol: "Cost per kWh", description: "Electricity cost per kilowatt-hour in dollars" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you want to estimate the monthly energy consumption of your refrigerator to understand its impact on your electricity bill.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Refrigerator' from the appliance dropdown. The calculator auto-fills the typical power rating (150 W) and usage hours (24 hours per day).",
          },
          {
            label: "Step 2",
            explanation:
              "Confirm or adjust the power rating and hours used per day if you have more accurate information.",
          },
          {
            label: "Step 3",
            explanation:
              "Enter the number of days the refrigerator runs per month, typically 30, and input your electricity cost per kWh, for example, $0.13.",
          },
          {
            label: "Step 4",
            explanation:
              "Click Calculate to see the estimated monthly energy consumption and cost. For a refrigerator running 24 hours daily at 150 watts, the calculator estimates about 108 kWh per month, costing approximately $14.04.",
          },
        ],
        result:
          "This estimate helps you understand how much your refrigerator contributes to your electricity bill and can guide decisions about energy-saving measures or appliance upgrades.",
      }}
      relatedCalculators={[
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/proane-tank-burn-time", icon: "💡" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday-life/mulch-coverage-bag-count", icon: "🌿" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
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