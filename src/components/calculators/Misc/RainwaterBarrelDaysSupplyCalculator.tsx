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

export default function RainwaterBarrelDaysSupplyCalculator() {
  /**
   * Inputs:
   * - barrelVolume: volume of rainwater barrel in gallons
   * - dailyUsage: estimated daily water usage in gallons (e.g., garden irrigation)
   * - rainfallFrequency: average days between rain events (optional, for context)
   */
  const [inputs, setInputs] = useState({
    barrelVolume: "",
    dailyUsage: "",
    rainfallFrequency: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * Days of supply = barrelVolume / dailyUsage
   * - If dailyUsage is zero or invalid, result is not computable.
   * - Warn if dailyUsage is zero or barrelVolume is zero.
   */
  const results = useMemo(() => {
    const barrelVolume = parseFloat(inputs.barrelVolume);
    const dailyUsage = parseFloat(inputs.dailyUsage);
    const rainfallFrequency = parseFloat(inputs.rainfallFrequency);

    if (isNaN(barrelVolume) || barrelVolume <= 0) {
      return {
        value: null,
        label: "Invalid Barrel Volume",
        subtext: "Please enter a positive number for barrel volume.",
        warning: "Barrel volume must be greater than zero.",
        formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
      };
    }
    if (isNaN(dailyUsage) || dailyUsage <= 0) {
      return {
        value: null,
        label: "Invalid Daily Usage",
        subtext: "Please enter a positive number for daily water usage.",
        warning: "Daily water usage must be greater than zero.",
        formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
      };
    }

    const daysSupply = barrelVolume / dailyUsage;
    let subtext = `Based on your inputs, your rainwater barrel can supply water for approximately ${daysSupply.toFixed(
      1
    )} days without replenishment.`;

    if (!isNaN(rainfallFrequency) && rainfallFrequency > 0) {
      subtext += ` Considering an average rainfall frequency of every ${rainfallFrequency} days, this helps you plan your irrigation schedule effectively.`;
    }

    return {
      value: `${daysSupply.toFixed(1)} days`,
      label: "Estimated Days of Supply",
      subtext,
      warning: null,
      formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is 'Days of Supply' in the context of rainwater barrels?",
      answer:
        "Days of Supply refers to the number of days your stored rainwater will last based on your average daily water usage. It helps gardeners and homeowners understand how long their rainwater reserves can sustain irrigation or other uses during dry periods.",
    },
    {
      question: "How can I estimate my daily water usage for irrigation?",
      answer:
        "Estimating daily water usage depends on factors such as garden size, plant types, and climate. A general guideline is that most gardens require about 0.5 to 1 inch of water per week, which translates to roughly 0.62 gallons per square foot per week. Dividing this by seven gives a daily average. For precise measurement, consider using a water meter or tracking irrigation volumes.",
    },
    {
      question: "Can this calculator help me decide the size of rainwater barrels I need?",
      answer:
        "Yes, by inputting your estimated daily water usage and desired days of supply, you can reverse-engineer the required barrel volume. This helps in planning and purchasing the appropriate rainwater storage capacity for your needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="barrelVolume" className="flex items-center gap-2">
                <Droplets /> Rainwater Barrel Volume (gallons)
              </Label>
              <Input
                id="barrelVolume"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 50"
                value={inputs.barrelVolume}
                onChange={(e) => handleInputChange("barrelVolume", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dailyUsage" className="flex items-center gap-2">
                <Leaf /> Estimated Daily Water Usage (gallons)
              </Label>
              <Input
                id="dailyUsage"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 5"
                value={inputs.dailyUsage}
                onChange={(e) => handleInputChange("dailyUsage", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rainfallFrequency" className="flex items-center gap-2">
                <Calendar /> Average Days Between Rainfall (optional)
              </Label>
              <Input
                id="rainfallFrequency"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 7"
                value={inputs.rainfallFrequency}
                onChange={(e) => handleInputChange("rainfallFrequency", e.target.value)}
              />
            </div>
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
          onClick={() => setInputs({ barrelVolume: "", dailyUsage: "", rainfallFrequency: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Rainwater Barrel Days of Supply</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The concept of "Days of Supply" for a rainwater barrel is a critical metric for gardeners, homeowners, and sustainability enthusiasts who rely on harvested rainwater for irrigation or other non-potable uses. It quantifies how long the stored water in your barrel will last given your typical daily consumption. This measure helps in planning water usage during dry spells, ensuring that your plants or garden receive adequate hydration without exhausting your reserves prematurely. By understanding this, you can optimize your rainwater harvesting system, avoid overuse, and contribute to water conservation efforts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating days of supply involves two main factors: the total volume of water stored in your barrel and your average daily water usage. The ratio of these two values gives a straightforward estimate of supply duration. However, real-world factors such as rainfall frequency, evaporation, and seasonal water needs can influence this estimate. This calculator provides a foundational estimate to guide your water management decisions effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get an accurate estimate of how long your rainwater barrel will supply water, you need to input three key pieces of information. First, enter the total volume of your rainwater barrel in gallons. This is typically marked on the barrel or available from the manufacturer. Second, estimate your average daily water usage in gallons, which might include watering plants, washing, or other outdoor uses. Lastly, optionally provide the average number of days between rainfall events to contextualize how often your barrel is replenished.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or find out your rain barrel's capacity in gallons.
          </li>
          <li>
            <strong>Step 2:</strong> Estimate your daily water usage by considering your garden size and watering habits.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, input the average days between rainfall to understand replenishment frequency.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see how many days your stored rainwater will last.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to plan irrigation schedules and water conservation strategies.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When managing rainwater barrels, it is essential to maintain water quality and ensure safety. Always cover your barrels to prevent mosquito breeding and debris contamination. Regularly clean your barrels and gutters to avoid algae growth and sediment buildup, which can reduce water quality and storage capacity. Additionally, consider installing a first-flush diverter to prevent contaminants from the initial runoff from entering your barrel. Monitoring water usage and adjusting irrigation based on weather conditions can maximize the utility of your stored rainwater.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          From a professional standpoint, sizing your rainwater storage to match your garden's needs and local rainfall patterns is crucial. Oversized barrels may lead to stagnant water, while undersized barrels might not provide sufficient supply during dry spells. Use this calculator as a guide but complement it with local extension service advice and weather data for optimal results.
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
              href="https://www.epa.gov/soakuptherain/soak-rain-rain-barrels"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA - Soak Up The Rain: Rain Barrels <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidance on rainwater harvesting, barrel maintenance, and water conservation best practices from the U.S. Environmental Protection Agency.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/water-management/rainwater-harvesting"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension - Rainwater Harvesting <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed educational resources on rainwater harvesting techniques, system sizing, and water usage estimation tailored for residential and community gardens.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/water-heating"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov - Water Use and Conservation <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              While focused on energy, this resource provides valuable insights into water usage patterns and conservation strategies applicable to rainwater harvesting.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rainwater Barrel Days of Supply"
      description="Estimate rainwater supply duration. Calculate how long your rain barrel will last during dry spells based on garden usage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Days of Supply = Barrel Volume (gallons) ÷ Daily Water Usage (gallons/day)",
        variables: [
          { symbol: "Barrel Volume", description: "Total water storage capacity of your rain barrel in gallons." },
          { symbol: "Daily Water Usage", description: "Average amount of water you use daily for irrigation or other purposes, in gallons." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have a 50-gallon rainwater barrel and estimate that your garden uses about 5 gallons of water daily. You want to know how many days your stored water will last without rain replenishment.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the barrel volume as 50 gallons.",
          },
          {
            label: "Step 2",
            explanation: "Input the daily water usage as 5 gallons.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get the days of supply.",
          },
        ],
        result: "The calculator will show that your rainwater barrel can supply water for approximately 10 days (50 ÷ 5 = 10).",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
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