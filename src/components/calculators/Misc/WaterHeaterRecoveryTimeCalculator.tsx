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

export default function WaterHeaterRecoveryTimeCalculator() {
  /*
   * Inputs:
   * - Tank Capacity (gallons)
   * - Temperature Rise (°F) = Desired Hot Water Temp - Incoming Cold Water Temp
   * - Heating Element Power (kW) or BTU/hr (depending on heater type)
   * - Heater Type (Electric or Gas)
   * 
   * Output:
   * - Estimated Recovery Time (minutes)
   * 
   * Formula:
   * For Electric:
   * Recovery Time (minutes) = (Tank Capacity * 8.34 * Temperature Rise) / (Power in Watts * 60)
   * where 8.34 = weight of 1 gallon of water in lbs
   * Power in Watts = kW * 1000
   * 
   * For Gas:
   * Recovery Time (minutes) = (Tank Capacity * 8.34 * Temperature Rise) / (BTU/hr / 60)
   * 
   * Explanation:
   * The formula calculates the energy required to heat the water volume by the temperature rise,
   * then divides by the power output of the heater to find time.
   */

  const [inputs, setInputs] = useState({
    tankCapacity: "", // gallons
    coldWaterTemp: "", // °F
    hotWaterTemp: "", // °F
    heaterType: "electric", // "electric" or "gas"
    powerRating: "", // kW for electric, BTU/hr for gas
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const tankCapacity = parseFloat(inputs.tankCapacity);
    const coldWaterTemp = parseFloat(inputs.coldWaterTemp);
    const hotWaterTemp = parseFloat(inputs.hotWaterTemp);
    const powerRating = parseFloat(inputs.powerRating);
    const heaterType = inputs.heaterType;

    if (
      isNaN(tankCapacity) || tankCapacity <= 0 ||
      isNaN(coldWaterTemp) || coldWaterTemp < 32 || coldWaterTemp > 80 ||
      isNaN(hotWaterTemp) || hotWaterTemp <= coldWaterTemp || hotWaterTemp > 160 ||
      isNaN(powerRating) || powerRating <= 0 ||
      (heaterType !== "electric" && heaterType !== "gas")
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers with hot water temperature greater than cold water temperature.",
        formulaUsed: "",
      };
    }

    const temperatureRise = hotWaterTemp - coldWaterTemp;
    let recoveryTimeMinutes = 0;
    let formulaUsed = "";

    if (heaterType === "electric") {
      // powerRating in kW, convert to Watts
      const powerWatts = powerRating * 1000;
      // Energy needed (BTU or Joules) is not directly used here, use formula:
      // Recovery Time (minutes) = (Tank Capacity * 8.34 * Temperature Rise) / (Power in Watts * 60)
      // Actually, the formula is:
      // Energy (BTU) = gallons * 8.34 lbs/gal * temp rise °F
      // 1 BTU = 1055 Joules, but since power is in Watts (J/s), convert BTU to Joules:
      // Let's use a simplified formula:
      // Time (seconds) = (Tank Capacity * 8.34 * Temperature Rise * 4184) / Power (Watts)
      // 4184 J = 1 kcal, but 1 BTU = 1055 J, so better to use BTU and convert power to BTU/hr
      // Let's use the simplified formula:
      // Recovery Time (minutes) = (Tank Capacity * 8.34 * Temperature Rise) / (Power in kW * 3.412)
      // where 3.412 kW = 1 HP = 3412 BTU/hr
      // But to avoid confusion, use:
      // Energy (BTU) = gallons * 8.34 * temp rise
      // Power (BTU/hr) = kW * 3412
      // Time (hr) = Energy / Power
      // Time (min) = Time(hr) * 60

      const energyBTU = tankCapacity * 8.34 * temperatureRise;
      const powerBTUperHr = powerRating * 3412;
      recoveryTimeMinutes = (energyBTU / powerBTUperHr) * 60;
      formulaUsed = `Recovery Time (min) = (Tank Capacity × 8.34 × Temperature Rise) / (Power (kW) × 3412) × 60`;
    } else if (heaterType === "gas") {
      // powerRating in BTU/hr
      // Time (hr) = Energy (BTU) / Power (BTU/hr)
      // Time (min) = Time(hr) * 60
      const energyBTU = tankCapacity * 8.34 * temperatureRise;
      recoveryTimeMinutes = (energyBTU / powerRating) * 60;
      formulaUsed = `Recovery Time (min) = (Tank Capacity × 8.34 × Temperature Rise) / Power (BTU/hr) × 60`;
    }

    const roundedTime = Math.round(recoveryTimeMinutes * 10) / 10;

    return {
      value: roundedTime > 0 ? `${roundedTime} minutes` : null,
      label: "Estimated Recovery Time",
      subtext: `Based on your inputs and heater type (${heaterType}).`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors affect water heater recovery time?",
      answer:
        "Water heater recovery time depends primarily on the tank capacity, the temperature difference between incoming cold water and desired hot water, and the heating element's power rating. Larger tanks or higher temperature rises require more energy and thus longer recovery times. Additionally, heater type (electric or gas) and efficiency can influence actual recovery speed.",
    },
    {
      question: "Why is the temperature rise important in calculating recovery time?",
      answer:
        "Temperature rise represents how much the water needs to be heated from its incoming cold temperature to the desired hot temperature. A greater temperature rise means more energy is required to heat the water, resulting in a longer recovery time. Accurately knowing both temperatures ensures precise estimation of how long the heater will take to replenish hot water.",
    },
    {
      question: "How accurate is this recovery time estimator?",
      answer:
        "This estimator provides a theoretical calculation based on ideal conditions using standard formulas. Actual recovery times may vary due to factors like heater efficiency, sediment buildup, water usage patterns, and ambient temperature. It is best used as a guideline rather than an exact prediction. For precise diagnostics, consult a professional technician.",
    },
    {
      question: "Can I use this calculator for tankless water heaters?",
      answer:
        "No, this calculator is designed specifically for storage tank water heaters. Tankless (on-demand) water heaters do not have a recovery time in the traditional sense because they heat water instantaneously as it flows. For tankless systems, flow rate and temperature rise are more relevant performance metrics.",
    },
    {
      question: "What units should I use for power rating?",
      answer:
        "For electric water heaters, enter the power rating in kilowatts (kW), which is usually found on the heater label. For gas water heaters, enter the input rating in British Thermal Units per hour (BTU/hr). Using the correct units ensures the calculator applies the appropriate formula and provides accurate recovery time estimates.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tankCapacity">Tank Capacity (gallons)</Label>
            <Input
              id="tankCapacity"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g., 40"
              value={inputs.tankCapacity}
              onChange={(e) => handleInputChange("tankCapacity", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="coldWaterTemp">Incoming Cold Water Temperature (°F)</Label>
            <Input
              id="coldWaterTemp"
              type="number"
              min={32}
              max={80}
              step={0.1}
              placeholder="e.g., 55"
              value={inputs.coldWaterTemp}
              onChange={(e) => handleInputChange("coldWaterTemp", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hotWaterTemp">Desired Hot Water Temperature (°F)</Label>
            <Input
              id="hotWaterTemp"
              type="number"
              min={80}
              max={160}
              step={0.1}
              placeholder="e.g., 120"
              value={inputs.hotWaterTemp}
              onChange={(e) => handleInputChange("hotWaterTemp", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heaterType">Heater Type</Label>
            <Select
              value={inputs.heaterType}
              onValueChange={(v) => handleInputChange("heaterType", v)}
            >
              <SelectTrigger id="heaterType" className="w-full">
                <SelectValue placeholder="Select heater type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="powerRating">
              {inputs.heaterType === "electric"
                ? "Heating Element Power (kW)"
                : "Heating Input Power (BTU/hr)"}
            </Label>
            <Input
              id="powerRating"
              type="number"
              min={0.1}
              step={0.1}
              placeholder={
                inputs.heaterType === "electric"
                  ? "e.g., 4.5"
                  : "e.g., 40000"
              }
              value={inputs.powerRating}
              onChange={(e) => handleInputChange("powerRating", e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation, no special action needed
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              tankCapacity: "",
              coldWaterTemp: "",
              hotWaterTemp: "",
              heaterType: "electric",
              powerRating: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 shadow-md">
          <CardContent className="p-4 text-center text-yellow-800 dark:text-yellow-300 font-semibold">
            <AlertTriangle className="inline mr-2 h-5 w-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 italic">{results.subtext}</p>
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
          Water heater recovery time is the duration it takes for a water heater to heat a full tank of cold water to the desired hot water temperature after the hot water has been depleted. This metric is crucial for homeowners and professionals to understand how quickly a water heater can replenish hot water supply, especially during high-demand periods.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The recovery time depends on several factors including the tank's capacity, the temperature difference between the incoming cold water and the desired hot water temperature, and the power rating of the heating element or burner. Electric and gas water heaters use different energy sources and thus have different recovery characteristics. Understanding these fundamentals helps in choosing the right water heater and managing hot water usage efficiently.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recovery time of your water heater based on your specific setup and usage conditions. To get the most accurate estimate, follow these detailed steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your water heater’s <em>tank capacity</em> in gallons. This is usually printed on the water heater label or in the user manual.
          </li>
          <li>
            <strong>Step 2:</strong> Input the <em>incoming cold water temperature</em>. This varies by location and season but typically ranges between 40°F and 60°F. You can use local water supply data or measure it with a thermometer.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your desired <em>hot water temperature</em>. Most water heaters are set between 120°F and 140°F for safety and comfort.
          </li>
          <li>
            <strong>Step 4:</strong> Select your <em>heater type</em> — either electric or gas — since the calculation differs based on energy source.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the <em>power rating</em> of your heater. For electric heaters, this is the wattage in kilowatts (kW). For gas heaters, enter the input rating in British Thermal Units per hour (BTU/hr). This information is typically found on the heater’s specification label.
          </li>
          <li>
            <strong>Step 6:</strong> Click the <em>Calculate</em> button to see the estimated recovery time displayed below the inputs.
          </li>
          <li>
            <strong>Step 7:</strong> Use the <em>Reset</em> button to clear all inputs and start a new calculation.
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
      title="Water Heater Recovery Time Estimator"
      description="Estimate water heater recovery time. Calculate how long it takes for your tank to provide hot water again after depletion."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Recovery Time (minutes) = (Tank Capacity × 8.34 × Temperature Rise) / Power × 60",
        variables: [
          { symbol: "Tank Capacity", description: "Volume of water in gallons" },
          { symbol: "8.34", description: "Weight of one gallon of water in pounds" },
          { symbol: "Temperature Rise", description: "Difference between hot and cold water temperatures (°F)" },
          { symbol: "Power", description: "Heating power in BTU/hr (gas) or kW converted to BTU/hr (electric)" },
          { symbol: "60", description: "Conversion factor from hours to minutes" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have a 40-gallon electric water heater. The incoming cold water temperature is 55°F, and you want your hot water at 120°F. The heating element is rated at 4.5 kW.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the temperature rise: 120°F - 55°F = 65°F.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the energy needed: 40 gallons × 8.34 lbs/gallon × 65°F = 21,684 BTU.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert electric power to BTU/hr: 4.5 kW × 3412 = 15,354 BTU/hr.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate recovery time in hours: 21,684 BTU ÷ 15,354 BTU/hr ≈ 1.41 hours.",
          },
          {
            label: "Step 5",
            explanation:
              "Convert to minutes: 1.41 hours × 60 = 84.6 minutes.",
          },
        ],
        result: "The estimated recovery time is approximately 85 minutes.",
      }}
      relatedCalculators={[
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday-life/bmi-calculator", icon: "❤️" },
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday-life/mulch-coverage-bag-count", icon: "🌿" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
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