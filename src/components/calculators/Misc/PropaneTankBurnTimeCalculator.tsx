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

const PROPANE_ENERGY_CONTENT_BTU_PER_GALLON = 91600; // BTU per gallon of propane
const PROPANE_DENSITY_LB_PER_GALLON = 4.24; // Pounds per gallon of propane
const PROPANE_BTU_PER_LB = 21400; // BTU per pound of propane

// Common tank sizes in pounds and gallons
const TANK_SIZES = [
  { label: "1 lb (Disposable Cylinder)", pounds: 1, gallons: 1 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "5 lb (Small Grill Tank)", pounds: 5, gallons: 5 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "10 lb (Portable Grill Tank)", pounds: 10, gallons: 10 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "20 lb (Standard BBQ Tank)", pounds: 20, gallons: 20 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "30 lb (Large Grill Tank)", pounds: 30, gallons: 30 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "40 lb (Large Heater Tank)", pounds: 40, gallons: 40 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "100 lb (Small Home Tank)", pounds: 100, gallons: 100 / PROPANE_DENSITY_LB_PER_GALLON },
  { label: "420 lb (Standard Home Tank)", pounds: 420, gallons: 420 / PROPANE_DENSITY_LB_PER_GALLON },
];

export default function PropaneTankBurnTimeCalculator() {
  // Inputs:
  // tankWeightPounds: number (tank propane weight in pounds)
  // btuUsagePerHour: number (BTU consumption rate per hour)
  // efficiencyPercent: number (optional, default 100%)
  // tankSizePreset: string (optional, selects a preset tank size)
  const [inputs, setInputs] = useState({
    tankWeightPounds: "",
    btuUsagePerHour: "",
    efficiencyPercent: "100",
    tankSizePreset: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate burn time in hours
  // Formula:
  // Burn Time (hours) = (Propane Energy Content * Tank Weight * Efficiency) / BTU Usage per Hour
  // Using BTU per pound = 21,400 BTU/lb
  // Efficiency is a percentage (e.g., 85%)
  const results = useMemo(() => {
    const tankWeight = parseFloat(inputs.tankWeightPounds);
    const btuUsage = parseFloat(inputs.btuUsagePerHour);
    const efficiency = parseFloat(inputs.efficiencyPercent);

    if (
      isNaN(tankWeight) ||
      tankWeight <= 0 ||
      isNaN(btuUsage) ||
      btuUsage <= 0 ||
      isNaN(efficiency) ||
      efficiency <= 0 ||
      efficiency > 100
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs. Efficiency must be between 1 and 100.",
        formulaUsed:
          "Burn Time (hours) = (Tank Weight (lbs) × 21,400 BTU/lb × Efficiency %) ÷ BTU Usage per Hour",
      };
    }

    // Calculate burn time in hours
    const burnTimeHours = (tankWeight * PROPANE_BTU_PER_LB * (efficiency / 100)) / btuUsage;

    // Format result to hours and minutes
    const hours = Math.floor(burnTimeHours);
    const minutes = Math.round((burnTimeHours - hours) * 60);

    const formattedResult =
      hours > 0
        ? `${hours} hour${hours !== 1 ? "s" : ""}${minutes > 0 ? ` and ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}`
        : `${minutes} minute${minutes !== 1 ? "s" : ""}`;

    return {
      value: formattedResult,
      label: "Estimated Burn Time",
      subtext: `Based on tank weight of ${tankWeight} lbs, BTU usage of ${btuUsage} BTU/hr, and ${efficiency}% efficiency.`,
      warning: null,
      formulaUsed:
        "Burn Time (hours) = (Tank Weight (lbs) × 21,400 BTU/lb × Efficiency %) ÷ BTU Usage per Hour",
    };
  }, [inputs]);

  // When user selects a tank size preset, update tankWeightPounds accordingly
  const handleTankSizePresetChange = useCallback(
    (value) => {
      handleInputChange("tankSizePreset", value);
      const preset = TANK_SIZES.find((t) => t.label === value);
      if (preset) {
        handleInputChange("tankWeightPounds", preset.pounds.toString());
      } else {
        handleInputChange("tankWeightPounds", "");
      }
    },
    [handleInputChange]
  );

  const faqs = [
    {
      question: "What factors affect the burn time of a propane tank?",
      answer:
        "Several factors influence how long a propane tank will last, including the size of the tank (measured in pounds or gallons), the BTU consumption rate of the appliance using the propane, and the efficiency of the appliance. Environmental conditions such as temperature can also affect propane pressure and burn time, but this calculator focuses on the primary factors for estimation.",
    },
    {
      question: "Why is appliance efficiency important in calculating burn time?",
      answer:
        "Appliance efficiency represents how effectively the propane's energy is converted into useful heat or work. A less efficient appliance wastes some energy, reducing the effective burn time. Including efficiency in calculations provides a more realistic estimate of how long your propane supply will last under actual operating conditions.",
    },
    {
      question: "How do I know the BTU rating of my propane appliance?",
      answer:
        "The BTU rating is typically found in the appliance’s user manual, on a label or specification plate, or in product documentation. It represents the amount of heat energy the appliance consumes per hour. If you cannot find it, contacting the manufacturer or checking online resources for your specific model can help.",
    },
    {
      question: "Can I use this calculator for propane tanks measured in gallons?",
      answer:
        "Yes, but you need to convert gallons to pounds first. Propane weighs approximately 4.24 pounds per gallon. Multiply the number of gallons by 4.24 to get the weight in pounds, then input that value into the calculator for accurate burn time estimation.",
    },
    {
      question: "Does temperature affect propane burn time?",
      answer:
        "Yes, temperature can influence propane pressure inside the tank, which can affect flow rate and burn time. Colder temperatures may reduce pressure, causing appliances to burn less efficiently or shut off. However, this calculator assumes standard conditions and does not adjust for temperature variations.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="space-y-4">
          <Label htmlFor="tankSizePreset" className="font-semibold text-blue-900 dark:text-white">
            Select Propane Tank Size (Optional)
          </Label>
          <Select
            value={inputs.tankSizePreset}
            onValueChange={handleTankSizePresetChange}
            aria-label="Select propane tank size"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a tank size preset" />
            </SelectTrigger>
            <SelectContent>
              {TANK_SIZES.map((tank) => (
                <SelectItem key={tank.label} value={tank.label}>
                  {tank.label} (~{tank.pounds} lbs)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="tankWeightPounds" className="font-semibold text-blue-900 dark:text-white">
            Propane Tank Weight (lbs)
          </Label>
          <Input
            id="tankWeightPounds"
            type="number"
            min="0"
            step="any"
            placeholder="Enter propane weight in pounds"
            value={inputs.tankWeightPounds}
            onChange={(e) => handleInputChange("tankWeightPounds", e.target.value)}
            aria-describedby="tankWeightHelp"
          />
          <p id="tankWeightHelp" className="text-sm text-slate-600 dark:text-slate-400">
            Enter the weight of propane in your tank. Use the preset above or enter manually.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="btuUsagePerHour" className="font-semibold text-blue-900 dark:text-white">
            Appliance BTU Usage per Hour
          </Label>
          <Input
            id="btuUsagePerHour"
            type="number"
            min="0"
            step="any"
            placeholder="Enter BTU consumption per hour"
            value={inputs.btuUsagePerHour}
            onChange={(e) => handleInputChange("btuUsagePerHour", e.target.value)}
            aria-describedby="btuUsageHelp"
          />
          <p id="btuUsageHelp" className="text-sm text-slate-600 dark:text-slate-400">
            Find this value on your appliance label or manual. It represents energy consumption per hour.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="efficiencyPercent" className="font-semibold text-blue-900 dark:text-white">
            Appliance Efficiency (%)
          </Label>
          <Input
            id="efficiencyPercent"
            type="number"
            min="1"
            max="100"
            step="any"
            placeholder="Enter efficiency percentage (default 100%)"
            value={inputs.efficiencyPercent}
            onChange={(e) => handleInputChange("efficiencyPercent", e.target.value)}
            aria-describedby="efficiencyHelp"
          />
          <p id="efficiencyHelp" className="text-sm text-slate-600 dark:text-slate-400">
            Efficiency accounts for energy loss. Default is 100%. Typical values range from 70% to 95%.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed; calculation is reactive
            }}
            aria-label="Calculate burn time"
          >
            <Home className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                tankWeightPounds: "",
                btuUsagePerHour: "",
                efficiencyPercent: "100",
                tankSizePreset: "",
              })
            }
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-400">{results.warning}</p>
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
          Propane is a popular fuel source used in grills, heaters, generators, and other appliances due to its portability and high energy content. Understanding how long a propane tank will last under specific usage conditions is essential for planning and safety. The burn time depends primarily on the amount of propane available and the rate at which your appliance consumes energy, measured in British Thermal Units (BTUs) per hour.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Propane is typically measured by weight (pounds) or volume (gallons), but energy content is best understood in BTUs. One pound of propane contains approximately 21,400 BTUs of energy. By knowing your tank’s propane weight and your appliance’s BTU consumption rate, you can estimate how long your propane supply will last. Additionally, appliance efficiency affects this calculation, as not all energy is converted into useful heat or work.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the burn time of your propane tank based on your tank size, appliance energy consumption, and efficiency. Follow these detailed steps to get an accurate estimate:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select a Tank Size Preset (Optional):</strong> Choose from common propane tank sizes to automatically fill in the tank weight. This is useful if you know your tank size but not the exact propane weight.
          </li>
          <li>
            <strong>Enter Propane Tank Weight:</strong> Input the weight of propane in your tank in pounds. If you selected a preset, this field will auto-fill, but you can adjust it if you know the exact weight.
          </li>
          <li>
            <strong>Enter Appliance BTU Usage per Hour:</strong> Find your appliance’s BTU rating (usually on a label or manual) and enter it here. This number represents how much energy your appliance consumes each hour.
          </li>
          <li>
            <strong>Enter Appliance Efficiency Percentage:</strong> This accounts for energy lost during combustion or conversion. If unknown, leave it at 100% for a basic estimate. Typical efficiencies range from 70% to 95%.
          </li>
          <li>
            <strong>Calculate:</strong> Click the Calculate button to see your estimated burn time displayed in hours and minutes.
          </li>
          <li>
            <strong>Reset:</strong> Use the Reset button to clear all inputs and start fresh.
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

  const example = {
    title: "Real Life Example",
    scenario:
      "You have a standard 20-pound propane tank connected to a gas grill that consumes 30,000 BTUs per hour. You want to estimate how long the grill will run if the appliance operates at 85% efficiency.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the propane tank weight: The tank holds 20 pounds of propane. This is the amount of fuel available for combustion.",
      },
      {
        label: "Step 2",
        explanation:
          "Determine the appliance BTU usage per hour: The grill consumes 30,000 BTUs each hour it runs.",
      },
      {
        label: "Step 3",
        explanation:
          "Account for appliance efficiency: The grill operates at 85% efficiency, meaning only 85% of the propane’s energy is effectively used.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate burn time using the formula: Burn Time = (Tank Weight × 21,400 BTU/lb × Efficiency) ÷ BTU Usage per Hour.",
      },
      {
        label: "Step 5",
        explanation:
          "Plug in the numbers: Burn Time = (20 × 21,400 × 0.85) ÷ 30,000 = 12.13 hours approximately.",
      },
    ],
    result: "The grill will run for about 12 hours and 8 minutes on a full 20-pound propane tank at 85% efficiency.",
  };

  return (
    <CalculatorVerticalLayout
      title="Propane Tank Burn Time Estimator"
      description="Estimate propane tank burn time. Calculate how long your grill, heater, or generator will run based on tank size and BTU usage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Burn Time (hours) = (Tank Weight (lbs) × 21,400 BTU/lb × Efficiency %) ÷ BTU Usage per Hour",
        variables: [
          { symbol: "Tank Weight (lbs)", description: "Weight of propane fuel in pounds" },
          { symbol: "21,400 BTU/lb", description: "Energy content of propane per pound" },
          { symbol: "Efficiency %", description: "Appliance efficiency as a decimal (e.g., 0.85 for 85%)" },
          { symbol: "BTU Usage per Hour", description: "Energy consumption rate of the appliance in BTUs per hour" },
        ],
      }}
      example={example}
      relatedCalculators={[
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
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