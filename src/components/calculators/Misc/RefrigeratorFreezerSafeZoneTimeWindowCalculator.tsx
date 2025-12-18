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

export default function RefrigeratorFreezerSafeZoneTimeWindowCalculator() {
  /**
   * Inputs:
   * - applianceType: "refrigerator" | "freezer"
   * - powerOutageDuration: number (hours)
   * - initialTemperature: number (°F or °C)
   * - ambientTemperature: number (°F or °C)
   * - temperatureUnit: "F" | "C"
   * 
   * Outputs:
   * - safeTimeRemaining: time in hours that food remains safe without power
   * - warning: if power outage duration exceeds safe time
   * 
   * Methodology:
   * Based on USDA and FDA guidelines:
   * - Refrigerator safe zone: 40°F (4°C) or below
   * - Freezer safe zone: 0°F (-18°C) or below
   * 
   * Food safety time windows depend on how long the appliance can maintain safe temperatures without power.
   * 
   * Approximate safe times without power:
   * - Refrigerator: 4 hours if unopened, up to 6 hours if full and unopened
   * - Freezer: 24-48 hours if full and unopened, 24 hours if half-full
   * 
   * This calculator estimates safe time remaining based on inputs and warns if exceeded.
   */

  const [inputs, setInputs] = useState({
    applianceType: "refrigerator",
    powerOutageDuration: "",
    initialTemperature: "",
    ambientTemperature: "",
    temperatureUnit: "F",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper to convert °C to °F
  const cToF = (c) => (c * 9) / 5 + 32;
  // Helper to convert °F to °C
  const fToC = (f) => ((f - 32) * 5) / 9;

  // Calculate safe time remaining based on inputs
  const results = useMemo(() => {
    const {
      applianceType,
      powerOutageDuration,
      initialTemperature,
      ambientTemperature,
      temperatureUnit,
    } = inputs;

    // Validate inputs
    if (
      !applianceType ||
      powerOutageDuration === "" ||
      initialTemperature === "" ||
      ambientTemperature === "" ||
      !temperatureUnit
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    const outageHours = Number(powerOutageDuration);
    const initTempRaw = Number(initialTemperature);
    const ambientTempRaw = Number(ambientTemperature);

    if (
      isNaN(outageHours) ||
      isNaN(initTempRaw) ||
      isNaN(ambientTempRaw) ||
      outageHours < 0
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid numeric values.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert all temps to Fahrenheit internally for consistency
    const initTempF =
      temperatureUnit === "C" ? cToF(initTempRaw) : initTempRaw;
    const ambientTempF =
      temperatureUnit === "C" ? cToF(ambientTempRaw) : ambientTempRaw;

    // USDA safe temps
    const safeTempF = applianceType === "refrigerator" ? 40 : 0;

    // Approximate cooling capacity and insulation effect:
    // Full freezer holds temp longer than half-full.
    // Refrigerator safe time ~ 4-6 hours without power.
    // Freezer safe time ~ 24-48 hours without power.

    // We'll estimate safe time remaining based on:
    // - Initial temp (should be at or below safe temp)
    // - Ambient temp (higher ambient temp reduces safe time)
    // - Appliance type

    // Base safe times (hours) when appliance is full and unopened
    const baseSafeTime = applianceType === "refrigerator" ? 6 : 48;

    // Adjust safe time based on ambient temperature:
    // For every 10°F above 70°F ambient, reduce safe time by 10%
    // For ambient below 70°F, increase safe time by 5% per 10°F cooler (max +20%)
    let ambientAdjustment = 1;
    if (ambientTempF > 70) {
      ambientAdjustment = 1 - 0.1 * Math.floor((ambientTempF - 70) / 10);
      if (ambientAdjustment < 0.5) ambientAdjustment = 0.5; // minimum 50%
    } else if (ambientTempF < 70) {
      ambientAdjustment = 1 + 0.05 * Math.floor((70 - ambientTempF) / 10);
      if (ambientAdjustment > 1.2) ambientAdjustment = 1.2; // max +20%
    }

    // Adjust safe time based on initial temperature:
    // If initial temp is above safe temp, safe time is zero
    if (initTempF > safeTempF) {
      return {
        value: "0 hours",
        label: "Unsafe initial temperature",
        subtext:
          "Initial temperature is above the safe zone; food safety cannot be guaranteed.",
        warning: "Do not consume perishable food stored above safe temperature.",
        formulaUsed:
          "Safe time = 0 because initial temperature exceeds safe threshold.",
      };
    }

    // Calculate adjusted safe time
    let safeTimeRemaining = baseSafeTime * ambientAdjustment;

    // Adjust for refrigerator vs freezer specifics:
    // Refrigerator safe time max 6 hours, freezer max 48 hours
    // If initial temperature is significantly below safe temp, add 10% bonus time
    if (initTempF < safeTempF - 5) {
      safeTimeRemaining *= 1.1;
    }

    // Round to nearest 0.1 hour
    safeTimeRemaining = Math.round(safeTimeRemaining * 10) / 10;

    // Calculate remaining safe time after outage duration
    const remainingSafeTime = safeTimeRemaining - outageHours;

    // Prepare warning if outage exceeds safe time
    let warning = null;
    if (remainingSafeTime <= 0) {
      warning =
        "Warning: The power outage duration exceeds the safe time window. Food may no longer be safe to consume.";
    }

    // Format result string
    const value = `${remainingSafeTime > 0 ? remainingSafeTime : 0} hours`;
    const label = "Estimated Safe Time Remaining Without Power";
    const subtext = `Based on appliance type, initial temperature, ambient temperature, and outage duration.`;

    const formulaUsed =
      "Safe Time Remaining = Base Safe Time × Ambient Temperature Adjustment - Power Outage Duration";

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question:
        "What does 'safe zone time window' mean for refrigerators and freezers?",
      answer:
        "The 'safe zone time window' refers to the estimated duration that food stored in a refrigerator or freezer remains at a safe temperature during a power outage. This window is critical because once the temperature rises above safe levels (40°F for refrigerators, 0°F for freezers), the risk of bacterial growth and food spoilage increases significantly, potentially causing foodborne illnesses.",
    },
    {
      question:
        "How does ambient temperature affect the safe time window during a power outage?",
      answer:
        "Ambient temperature plays a significant role in how quickly the temperature inside your refrigerator or freezer rises during a power outage. Higher ambient temperatures cause the appliance to warm up faster, reducing the safe time window. Conversely, cooler ambient temperatures slow down the warming process, extending the time food remains safe. This calculator adjusts safe time estimates based on your ambient temperature input.",
    },
    {
      question:
        "Why is the initial temperature of the appliance important in this calculation?",
      answer:
        "The initial temperature indicates how cold your refrigerator or freezer was before the power outage began. If the appliance was colder than the safe threshold, it has more thermal inertia and can maintain safe temperatures longer during an outage. If it was already above the safe temperature, the food safety window is effectively zero, meaning food may already be unsafe to consume.",
    },
    {
      question:
        "Can I trust the calculator's estimate for all types of refrigerators and freezers?",
      answer:
        "This calculator provides an estimate based on typical appliance performance and USDA guidelines. However, actual safe times can vary depending on factors like appliance insulation quality, how full the appliance is, door openings during the outage, and specific food types. Always use your best judgment and check food for signs of spoilage when in doubt.",
    },
    {
      question:
        "What should I do if the power outage exceeds the safe zone time window?",
      answer:
        "If the outage duration surpasses the safe time window, it's safest to discard perishable foods that have been stored above safe temperatures to avoid foodborne illness. Non-perishable items or those stored in sealed containers may still be safe. When power returns, check for ice crystals in frozen foods and odors or textures in refrigerated items before consuming.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="applianceType" className="mb-1 font-semibold">
              Appliance Type
            </Label>
            <Select
              value={inputs.applianceType}
              onValueChange={(v) => handleInputChange("applianceType", v)}
              id="applianceType"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appliance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refrigerator">
                  Refrigerator
                </SelectItem>
                <SelectItem value="freezer">Freezer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperatureUnit" className="mb-1 font-semibold">
              Temperature Unit
            </Label>
            <Select
              value={inputs.temperatureUnit}
              onValueChange={(v) => handleInputChange("temperatureUnit", v)}
              id="temperatureUnit"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                <SelectItem value="C">Celsius (°C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="initialTemperature" className="mb-1 font-semibold">
              Initial Appliance Temperature ({inputs.temperatureUnit})
            </Label>
            <Input
              type="number"
              id="initialTemperature"
              placeholder={`e.g. ${
                inputs.temperatureUnit === "F" ? "38" : "3"
              }`}
              value={inputs.initialTemperature}
              onChange={(e) =>
                handleInputChange("initialTemperature", e.target.value)
              }
              min={inputs.temperatureUnit === "F" ? 0 : -20}
              max={inputs.temperatureUnit === "F" ? 50 : 10}
            />
          </div>

          <div>
            <Label htmlFor="ambientTemperature" className="mb-1 font-semibold">
              Ambient Temperature ({inputs.temperatureUnit})
            </Label>
            <Input
              type="number"
              id="ambientTemperature"
              placeholder={`e.g. ${
                inputs.temperatureUnit === "F" ? "75" : "24"
              }`}
              value={inputs.ambientTemperature}
              onChange={(e) =>
                handleInputChange("ambientTemperature", e.target.value)
              }
              min={inputs.temperatureUnit === "F" ? 30 : 0}
              max={inputs.temperatureUnit === "F" ? 120 : 50}
            />
          </div>

          <div>
            <Label htmlFor="powerOutageDuration" className="mb-1 font-semibold">
              Power Outage Duration (hours)
            </Label>
            <Input
              type="number"
              id="powerOutageDuration"
              placeholder="e.g. 3"
              value={inputs.powerOutageDuration}
              onChange={(e) =>
                handleInputChange("powerOutageDuration", e.target.value)
              }
              min={0}
              max={72}
              step={0.1}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate safe time remaining"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              applianceType: "refrigerator",
              powerOutageDuration: "",
              initialTemperature: "",
              ambientTemperature: "",
              temperatureUnit: "F",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">
              {results.label}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-4 text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {results.warning}
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
          Understanding the Basics
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When the power goes out, one of the biggest concerns is how long your
          refrigerator or freezer can keep food safe without electricity. The
          "safe zone time window" is the estimated duration during which the
          internal temperature of your appliance remains within a range that
          prevents harmful bacterial growth and food spoilage. This window is
          crucial for preventing foodborne illnesses and minimizing food waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Refrigerators are designed to keep food at or below 40°F (4°C), while
          freezers maintain temperatures at or below 0°F (-18°C). During a power
          outage, the temperature inside these appliances gradually rises,
          influenced by factors such as the initial temperature, ambient room
          temperature, how full the appliance is, and how often the door is
          opened. Understanding these factors helps estimate how long your food
          will remain safe.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the remaining safe time your food
          can stay in your refrigerator or freezer during a power outage. To
          get the most accurate estimate, follow these detailed steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your appliance type — either
            refrigerator or freezer — as they have different safe temperature
            thresholds and safe time windows.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the temperature unit you prefer,
            Fahrenheit (°F) or Celsius (°C), to enter temperature values.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the initial temperature inside your
            appliance before the power outage began. This should be the
            temperature when the power was last on.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the ambient temperature of the room
            where your appliance is located. Higher room temperatures reduce the
            safe time window.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the duration of the power outage in
            hours. This is how long your appliance has been without power.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to see the
            estimated safe time remaining for your food. If the outage duration
            exceeds this time, a warning will be displayed.
          </li>
          <li>
            <strong>Step 7:</strong> Use the results to make informed decisions
            about food safety and whether to discard perishable items.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Refrigerator/Freezer Safe Zone Time Window"
      description="Track food safety during power outages. Estimate how long food stays safe in your refrigerator or freezer without power."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Safe Time Remaining = Base Safe Time × Ambient Temperature Adjustment - Power Outage Duration",
        variables: [
          {
            symbol: "Base Safe Time",
            description:
              "Typical safe time in hours for a full appliance with power off (6 hours for refrigerator, 48 hours for freezer).",
          },
          {
            symbol: "Ambient Temperature Adjustment",
            description:
              "Multiplier adjusting safe time based on ambient temperature (reduces safe time if ambient is hot, increases if cool).",
          },
          {
            symbol: "Power Outage Duration",
            description:
              "Elapsed time in hours since power was lost.",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine a family refrigerator that lost power during a summer afternoon when the ambient temperature was 85°F (29°C). The initial temperature inside the refrigerator was 38°F (3°C), and the power outage lasted for 3 hours.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Refrigerator' as the appliance type and 'Fahrenheit' as the temperature unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Input the initial temperature as 38°F and the ambient temperature as 85°F.",
          },
          {
            label: "Step 3",
            explanation:
              "Enter the power outage duration as 3 hours.",
          },
          {
            label: "Step 4",
            explanation:
              "Click 'Calculate' to see the estimated safe time remaining.",
          },
        ],
        result:
          "The calculator estimates approximately 3.6 hours of safe time remaining, indicating that food is still safe but the window is closing quickly due to the high ambient temperature.",
      }}
      relatedCalculators={[
        {
          title: "Hydration Reminder Interval Planner",
          url: "/everyday-life/hydration-reminder-interval",
          icon: "💡",
        },
        {
          title: "Wine/Beer/Soft Drink Mix Estimator",
          url: "/everyday-life/beverage-mix-estimator",
          icon: "🎉",
        },
        {
          title: "Fertilizer Application Calculator",
          url: "/everyday-life/fertilizer-application-calculator",
          icon: "💡",
        },
        {
          title: "Screen Time Budget / Pomodoro Planner",
          url: "/everyday-life/screen-time-pomodoro-planner",
          icon: "💡",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday-life/bmr-calculator",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday-life/coffee-urn-yield-strength",
          icon: "💡",
        },
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