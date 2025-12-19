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

export default function BeverageMixEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    guests: "",
    winePreference: "33",
    beerPreference: "33",
    softDrinkPreference: "34",
    averageConsumptionPerGuest: "2", // in drinks per guest
  });

  const handleInputChange = useCallback((name, value) => {
    // Ensure numeric inputs are sanitized and preferences sum to 100%
    if (name === "winePreference" || name === "beerPreference" || name === "softDrinkPreference") {
      // Clamp between 0 and 100
      let val = Number(value);
      if (isNaN(val) || val < 0) val = 0;
      if (val > 100) val = 100;
      setInputs((prev) => {
        const otherKeys = ["winePreference", "beerPreference", "softDrinkPreference"].filter(k => k !== name);
        // Adjust others proportionally if sum > 100
        let othersSum = otherKeys.reduce((acc, k) => acc + Number(prev[k]), 0);
        let newSum = val + othersSum;
        let newState = { ...prev, [name]: val.toString() };
        if (newSum > 100) {
          // Reduce others proportionally
          const scale = (100 - val) / othersSum;
          otherKeys.forEach(k => {
            newState[k] = Math.round(Number(prev[k]) * scale).toString();
          });
        }
        return newState;
      });
    } else if (name === "guests") {
      // Only allow positive integers
      let val = value.replace(/\D/g, "");
      setInputs((prev) => ({ ...prev, [name]: val }));
    } else if (name === "averageConsumptionPerGuest") {
      // Allow decimal numbers, min 0.1 max 10
      let val = value.replace(/[^0-9.]/g, "");
      if (val) {
        let num = parseFloat(val);
        if (num < 0.1) num = 0.1;
        if (num > 10) num = 10;
        val = num.toString();
      }
      setInputs((prev) => ({ ...prev, [name]: val }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const winePct = Number(inputs.winePreference);
    const beerPct = Number(inputs.beerPreference);
    const softDrinkPct = Number(inputs.softDrinkPreference);
    const avgConsumption = Number(inputs.averageConsumptionPerGuest);

    if (!guests || guests <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid number of guests.",
        warning: null,
        formulaUsed: null,
      };
    }
    if (winePct + beerPct + softDrinkPct !== 100) {
      return {
        value: null,
        label: null,
        subtext: "Preferences must sum to 100%.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: null,
      };
    }
    if (!avgConsumption || avgConsumption <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid average consumption per guest.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Total drinks needed
    const totalDrinks = guests * avgConsumption;

    // Calculate each beverage volume in drinks
    const wineDrinks = (winePct / 100) * totalDrinks;
    const beerDrinks = (beerPct / 100) * totalDrinks;
    const softDrinkDrinks = (softDrinkPct / 100) * totalDrinks;

    // Convert drinks to liters (assuming standard drink sizes)
    // Wine: 5 oz (~0.148 L), Beer: 12 oz (~0.355 L), Soft Drink: 12 oz (~0.355 L)
    const wineLiters = wineDrinks * 0.148;
    const beerLiters = beerDrinks * 0.355;
    const softDrinkLiters = softDrinkDrinks * 0.355;

    // Round to 2 decimals
    const wineL = wineLiters.toFixed(2);
    const beerL = beerLiters.toFixed(2);
    const softDrinkL = softDrinkLiters.toFixed(2);

    return {
      value: (
        <div className="space-y-2 text-left">
          <p className="text-xl font-semibold text-blue-900 dark:text-white">Estimated Beverage Volumes:</p>
          <ul className="list-disc pl-5 text-blue-800 dark:text-blue-300">
            <li><strong>Wine:</strong> {wineL} liters (~{wineDrinks.toFixed(0)} drinks)</li>
            <li><strong>Beer:</strong> {beerL} liters (~{beerDrinks.toFixed(0)} drinks)</li>
            <li><strong>Soft Drinks:</strong> {softDrinkL} liters (~{softDrinkDrinks.toFixed(0)} drinks)</li>
          </ul>
          <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">
            * Based on average drink sizes: Wine (5 oz), Beer (12 oz), Soft Drinks (12 oz).
          </p>
        </div>
      ),
      label: "Beverage Volume Estimation",
      subtext: `For ${guests} guests with average consumption of ${avgConsumption} drinks each.`,
      warning: null,
      formulaUsed:
        "Total Drinks = Guests × Average Consumption; Beverage Volume = (Preference % × Total Drinks) × Drink Size (liters)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this beverage mix estimator?",
      answer:
        "This estimator provides a practical approximation based on average drink sizes and consumption rates. Actual consumption can vary depending on guest preferences, event duration, and other factors. It's recommended to add a buffer of 10-15% to accommodate unexpected demand.",
    },
    {
      question: "Can I adjust the drink sizes if my servings differ?",
      answer:
        "Yes, the calculator assumes standard drink sizes (5 oz for wine, 12 oz for beer and soft drinks). If your servings differ, you can manually adjust the average consumption or interpret the results accordingly to better fit your event's serving sizes.",
    },
    {
      question: "Why must the preference percentages sum to 100%?",
      answer:
        "The preference percentages represent the distribution of beverage types among guests. They must sum to 100% to ensure the total beverage volume is correctly allocated without underestimating or overestimating any category.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
                Number of Guests <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="guests"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 50"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="averageConsumptionPerGuest" className="mb-1 flex items-center gap-1">
                Average Drinks per Guest <Droplets className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="averageConsumptionPerGuest"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 2"
                value={inputs.averageConsumptionPerGuest}
                onChange={(e) => handleInputChange("averageConsumptionPerGuest", e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Typical range: 1-4 drinks per guest depending on event duration.
              </p>
            </div>

            <div>
              <Label htmlFor="winePreference" className="mb-1 flex items-center gap-1">
                Wine Preference (%) <WineIcon />
              </Label>
              <Input
                id="winePreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 33"
                value={inputs.winePreference}
                onChange={(e) => handleInputChange("winePreference", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="beerPreference" className="mb-1 flex items-center gap-1">
                Beer Preference (%) <Utensils />
              </Label>
              <Input
                id="beerPreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 33"
                value={inputs.beerPreference}
                onChange={(e) => handleInputChange("beerPreference", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="softDrinkPreference" className="mb-1 flex items-center gap-1">
                Soft Drink Preference (%) <Leaf />
              </Label>
              <Input
                id="softDrinkPreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 34"
                value={inputs.softDrinkPreference}
                onChange={(e) => handleInputChange("softDrinkPreference", e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Preferences must sum to 100%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              winePreference: "33",
              beerPreference: "33",
              softDrinkPreference: "34",
              averageConsumptionPerGuest: "2",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">{results.value}</CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{results.subtext}</p>
          {results.warning && <div className="mt-2">{results.warning}</div>}
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Wine/Beer/Soft Drink Mix Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning beverage quantities for events can be challenging due to varying guest preferences and consumption rates. This estimator helps event planners, hosts, and caterers calculate the approximate volumes of wine, beer, and soft drinks needed based on the number of guests, their beverage preferences, and average consumption per guest. By using standard drink sizes and percentage preferences, it provides a reliable baseline to ensure guests are well-served without excessive waste. This tool is especially useful for weddings, corporate events, parties, and any gathering where beverage planning is critical.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get an accurate estimate, input the total number of guests attending your event. Next, specify the average number of drinks each guest is expected to consume, which varies depending on event length and guest demographics. Then, allocate the percentage preferences for wine, beer, and soft drinks, ensuring they sum up to 100%. Once all inputs are provided, click "Calculate" to see the estimated beverage volumes in liters and approximate drink counts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of guests attending your event.
          </li>
          <li>
            <strong>Step 2:</strong> Input the average number of drinks each guest will consume.
          </li>
          <li>
            <strong>Step 3:</strong> Set the percentage preferences for wine, beer, and soft drinks. Make sure these add up to 100%.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to view your beverage volume estimates.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide your purchasing or catering orders.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning beverages, always consider adding a buffer of 10-15% above the estimated amounts to accommodate unexpected guests or higher consumption. Keep in mind that event duration, time of day, and guest demographics can significantly influence drinking behavior. For safety, ensure responsible alcohol service and provide ample non-alcoholic options. Additionally, consider local laws and regulations regarding alcohol consumption and serving limits. Proper planning not only enhances guest satisfaction but also helps minimize waste and cost.
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
              href="https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Moderate & Binge Drinking (https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides official guidelines on alcohol consumption and standard drink sizes, essential for accurate beverage planning.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/food-safety-and-preservation/estimating-food-and-beverage-quantities"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension - Estimating Food and Beverage Quantities <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers detailed guidance on estimating beverage quantities for events, including consumption patterns and serving sizes.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/buildings/articles/how-much-water-do-you-need-your-home"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - How Much Water Do You Need? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              While focused on water, this resource provides insights into volume estimation and consumption that can be adapted for beverage planning.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Custom Wine Icon for label (using FlaskConical as proxy)
  function WineIcon() {
    return <FlaskConical className="w-4 h-4 text-red-600" />;
  }

  return (
    <CalculatorVerticalLayout
      title="Wine/Beer/Soft Drink Mix Estimator"
      description="Estimate the beverage mix for events. Calculate the ratio of wine, beer, and soft drinks needed based on guest preferences."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Drinks = Guests × Average Consumption; Beverage Volume = (Preference % × Total Drinks) × Drink Size (liters)",
        variables: [
          { symbol: "Guests", description: "Total number of event attendees" },
          { symbol: "Average Consumption", description: "Average drinks consumed per guest" },
          { symbol: "Preference %", description: "Percentage preference for each beverage type" },
          { symbol: "Drink Size", description: "Standard volume per drink in liters" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a party with 100 guests. You expect each guest to consume about 2 drinks on average. Your guests prefer wine 40%, beer 35%, and soft drinks 25%.",
        steps: [
          {
            label: "Step 1",
            explanation: "Multiply guests by average consumption: 100 × 2 = 200 total drinks.",
          },
          {
            label: "Step 2",
            explanation: "Calculate drinks per beverage: Wine = 40% × 200 = 80 drinks; Beer = 35% × 200 = 70 drinks; Soft Drinks = 25% × 200 = 50 drinks.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert drinks to liters: Wine = 80 × 0.148 = 11.84 L; Beer = 70 × 0.355 = 24.85 L; Soft Drinks = 50 × 0.355 = 17.75 L.",
          },
          {
            label: "Step 4",
            explanation: "Order approximately these volumes to meet your guests' preferences and consumption.",
          },
        ],
        result: "Estimated volumes: 11.84 L wine, 24.85 L beer, 17.75 L soft drinks.",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
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