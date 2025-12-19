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

export default function WaterHeaterRecoveryTimeCalculator() {
  /**
   * Inputs:
   * - tankCapacity (gallons)
   * - heatingPower (kW)
   * - temperatureRise (°F)
   * - efficiency (%)
   * 
   * Formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power × Efficiency × 60)
   * Where:
   * - 8.34 = weight of 1 gallon of water in lbs
   * - Heating Power in kW converted to BTU/hr (1 kW = 3412 BTU/hr)
   * 
   * For simplicity, we use the formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60
   * Simplified to:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34 × 60) / (Heating Power × 3412 × Efficiency)
   * 
   * To avoid confusion, we will use the direct formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power × Efficiency × 60)
   * where Heating Power is in kW, Efficiency is decimal (e.g., 0.9)
   * 
   * We'll clarify this in editorial.
   */

  const [inputs, setInputs] = useState({
    tankCapacity: "",
    heatingPower: "",
    temperatureRise: "",
    efficiency: "90",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const tankCapacity = parseFloat(inputs.tankCapacity);
    const heatingPower = parseFloat(inputs.heatingPower);
    const temperatureRise = parseFloat(inputs.temperatureRise);
    const efficiencyPercent = parseFloat(inputs.efficiency);

    if (
      !tankCapacity ||
      tankCapacity <= 0 ||
      !heatingPower ||
      heatingPower <= 0 ||
      !temperatureRise ||
      temperatureRise <= 0 ||
      !efficiencyPercent ||
      efficiencyPercent <= 0 ||
      efficiencyPercent > 100
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs. Efficiency must be between 1 and 100%.",
        formulaUsed: "",
      };
    }

    // Convert efficiency to decimal
    const efficiency = efficiencyPercent / 100;

    // Constants
    const waterWeightPerGallon = 8.34; // lbs
    const heatingPowerBTUperHr = heatingPower * 3412; // kW to BTU/hr

    // Recovery time in hours = (Tank Capacity × Temp Rise × Water Weight) / (Heating Power BTU/hr × Efficiency)
    const recoveryTimeHours = (tankCapacity * temperatureRise * waterWeightPerGallon) / (heatingPowerBTUperHr * efficiency);

    // Convert hours to minutes
    const recoveryTimeMinutes = recoveryTimeHours * 60;

    // Format result with 1 decimal place
    const formattedTime = recoveryTimeMinutes.toFixed(1);

    return {
      value: `${formattedTime} minutes`,
      label: "Estimated Recovery Time",
      subtext: `Based on your inputs, it will take approximately ${formattedTime} minutes for your water heater to recover.`,
      warning: null,
      formulaUsed:
        "Recovery Time (minutes) = (Tank Capacity (gal) × Temperature Rise (°F) × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is water heater recovery time?",
      answer:
        "Water heater recovery time is the duration it takes for a water heater to heat a full tank of water from its current temperature to the desired temperature. This metric helps users understand how quickly their water heater can supply hot water after the tank has been depleted.",
    },
    {
      question: "How does efficiency affect recovery time?",
      answer:
        "Efficiency represents how effectively a water heater converts energy into heat. A higher efficiency means less energy loss and faster heating, resulting in shorter recovery times. Typical efficiencies range from 80% to 95%, depending on the water heater type and condition.",
    },
    {
      question: "Can I improve my water heater’s recovery time?",
      answer:
        "Yes, improving recovery time can be achieved by increasing heating power, reducing temperature rise (setting a lower hot water temperature), improving insulation, or upgrading to a more efficient water heater model. Regular maintenance also ensures optimal performance.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="tankCapacity" className="flex items-center gap-2">
              <Droplets /> Tank Capacity (gallons)
            </Label>
            <Input
              id="tankCapacity"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 40"
              value={inputs.tankCapacity}
              onChange={(e) => handleInputChange("tankCapacity", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heatingPower" className="flex items-center gap-2">
              <Zap /> Heating Power (kW)
            </Label>
            <Input
              id="heatingPower"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 4.5"
              value={inputs.heatingPower}
              onChange={(e) => handleInputChange("heatingPower", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="temperatureRise" className="flex items-center gap-2">
              <Scale /> Temperature Rise (°F)
            </Label>
            <Input
              id="temperatureRise"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 70"
              value={inputs.temperatureRise}
              onChange={(e) => handleInputChange("temperatureRise", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="efficiency" className="flex items-center gap-2">
              <Leaf /> Efficiency (%)
            </Label>
            <Input
              id="efficiency"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 90"
              value={inputs.efficiency}
              onChange={(e) => handleInputChange("efficiency", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              tankCapacity: "",
              heatingPower: "",
              temperatureRise: "",
              efficiency: "90",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2" /> {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Water Heater Recovery Time Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The water heater recovery time estimator calculates how long it takes for your water heater to heat a full tank of water from its current temperature to the desired temperature. This is a critical performance metric that helps homeowners and professionals assess the efficiency and capacity of their water heating system. Recovery time depends on several factors including the tank size, heating element power, temperature difference, and the efficiency of the unit. Understanding this metric can help you optimize your hot water usage, plan for peak demand, and decide if an upgrade or maintenance is necessary.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula used in this calculator is based on thermodynamic principles, converting electrical or gas energy input into heat energy required to raise the water temperature. It accounts for the weight of water per gallon and the efficiency losses inherent in the heating process. By inputting accurate values, users receive a reliable estimate of the recovery time, enabling better household or commercial water heating management.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your water heater’s recovery time, you need to provide four key inputs: the tank capacity in gallons, the heating power of your water heater in kilowatts (kW), the temperature rise in degrees Fahrenheit (the difference between the cold water temperature and the desired hot water temperature), and the efficiency percentage of your water heater. These inputs allow the calculator to determine how quickly your water heater can replenish hot water after depletion.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your water heater’s tank capacity, typically found on the unit’s label or manual.
          </li>
          <li>
            <strong>Step 2:</strong> Input the heating power rating of your water heater. For electric heaters, this is usually in kilowatts (kW). For gas heaters, convert BTU/hr to kW if necessary.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the temperature rise, which is the difference between the incoming cold water temperature and the desired hot water temperature. For example, if your cold water is 50°F and you want 120°F hot water, the rise is 70°F.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the efficiency of your water heater as a percentage. Typical efficiencies range from 80% to 95%. If unknown, 90% is a reasonable default.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to see the estimated recovery time in minutes.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining your water heater is essential for optimal recovery time and safety. Regularly flushing the tank to remove sediment buildup can improve heat transfer efficiency and extend the unit’s lifespan. Insulating your water heater and hot water pipes reduces heat loss, effectively shortening recovery time and saving energy. Always ensure your water heater’s thermostat is set to a safe temperature (typically 120°F) to prevent scalding and reduce energy consumption. If you notice unusually long recovery times, it may indicate a failing heating element or other mechanical issues requiring professional inspection.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          When working with water heaters, always follow manufacturer guidelines and local codes. Turn off power or gas supply before performing maintenance. If unsure, consult a licensed plumber or technician to avoid risks such as electric shock, gas leaks, or water damage.
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
              href="https://www.energy.gov/energysaver/water-heaters"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy Saver - Water Heaters <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide by the U.S. Department of Energy on water heater types, efficiency, and maintenance best practices.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/energy-efficiency-water-heaters"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension - Energy Efficiency of Water Heaters <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource explaining water heater efficiency, recovery rates, and energy-saving tips.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/healthywater/emergency/extreme-heat/water-heaters.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Water Heater Safety <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines on safe water heater temperature settings and preventing scald injuries.
            </p>
          </li>
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
          "Recovery Time (minutes) = (Tank Capacity (gal) × Temperature Rise (°F) × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60",
        variables: [
          { symbol: "Tank Capacity", description: "Volume of water in the tank (gallons)" },
          { symbol: "Temperature Rise", description: "Difference between cold and hot water temperature (°F)" },
          { symbol: "8.34", description: "Weight of one gallon of water (lbs)" },
          { symbol: "Heating Power", description: "Power of heating element (kilowatts)" },
          { symbol: "3412", description: "Conversion factor from kW to BTU/hr" },
          { symbol: "Efficiency", description: "Efficiency of the water heater (decimal)" },
          { symbol: "60", description: "Conversion from hours to minutes" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have a 40-gallon electric water heater with a heating element rated at 4.5 kW. The incoming cold water temperature is 50°F, and you want to heat it to 120°F. The water heater efficiency is approximately 90%.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the temperature rise: 120°F - 50°F = 70°F.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert efficiency to decimal: 90% = 0.9.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: Recovery Time = (40 × 70 × 8.34) / (4.5 × 3412 × 0.9) × 60.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate numerator: 40 × 70 × 8.34 = 23352.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate denominator: 4.5 × 3412 × 0.9 = 13806.6.",
          },
          {
            label: "Step 6",
            explanation:
              "Divide and convert to minutes: (23352 / 13806.6) × 60 ≈ 101.5 minutes.",
          },
        ],
        result: "The estimated recovery time is approximately 101.5 minutes.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
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