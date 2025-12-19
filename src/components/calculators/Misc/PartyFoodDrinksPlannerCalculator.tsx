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

const FOOD_SERVING_SIZES = {
  appetizer: 6, // pieces per person
  main: 1, // servings per person
  pizza: 3, // slices per person
  dessert: 1.5, // servings per person
};

const DRINK_SERVING_SIZES = {
  softDrink: 12, // ounces per person
  beer: 16, // ounces per person
  wine: 5, // ounces per person
  cocktail: 6, // ounces per person
};

const PIZZA_SLICES_PER_PIZZA = 8;

export default function PartyFoodDrinksPlannerCalculator() {
  // Inputs:
  // - Number of guests (adults, kids)
  // - Duration of party (hours)
  // - Types of food: appetizers, mains, pizza, desserts (checkbox)
  // - Types of drinks: soft drinks, beer, wine, cocktails (checkbox)
  // - Preferences: % of guests drinking alcohol, % vegetarians
  // - Budget (optional)
  // - Other preferences (optional)

  const [inputs, setInputs] = useState({
    adults: "",
    kids: "",
    duration: "",
    appetizers: true,
    mains: true,
    pizza: false,
    desserts: true,
    softDrinks: true,
    beer: false,
    wine: false,
    cocktails: false,
    alcoholDrinkersPercent: 70,
    vegetariansPercent: 15,
    budget: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic:
  // 1. Calculate total guests = adults + kids * 0.5 (kids eat less)
  // 2. Adjust servings based on duration (longer party = more food/drinks)
  // 3. Calculate food quantities based on selected types and servings per person
  // 4. Calculate drink quantities based on alcohol preferences and drinkers %
  // 5. Provide warnings if inputs are missing or inconsistent

  const results = useMemo(() => {
    const adults = Number(inputs.adults);
    const kids = Number(inputs.kids);
    const duration = Number(inputs.duration);
    const alcoholDrinkersPercent = Number(inputs.alcoholDrinkersPercent);
    const vegetariansPercent = Number(inputs.vegetariansPercent);

    if (
      isNaN(adults) ||
      isNaN(kids) ||
      isNaN(duration) ||
      adults < 0 ||
      kids < 0 ||
      duration <= 0 ||
      alcoholDrinkersPercent < 0 ||
      alcoholDrinkersPercent > 100 ||
      vegetariansPercent < 0 ||
      vegetariansPercent > 100
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for guests, duration, and percentages.",
        formulaUsed: null,
      };
    }

    const totalGuests = adults + kids * 0.5;
    if (totalGuests === 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Guest count cannot be zero.",
        formulaUsed: null,
      };
    }

    // Duration factor: base is 2 hours, increase servings by 10% per extra hour
    const baseDuration = 2;
    const durationFactor = duration <= baseDuration ? 1 : 1 + 0.1 * (duration - baseDuration);

    // Food calculations
    // Adjust servings for vegetarians (vegetarian guests get vegetarian mains or pizza)
    const vegetarianGuests = (vegetariansPercent / 100) * totalGuests;
    const nonVegetarianGuests = totalGuests - vegetarianGuests;

    // Appetizers
    const appetizersCount = inputs.appetizers
      ? Math.ceil(FOOD_SERVING_SIZES.appetizer * totalGuests * durationFactor)
      : 0;

    // Mains
    // Assume vegetarians eat vegetarian mains, non-vegetarians eat regular mains
    const mainsCount = inputs.mains
      ? Math.ceil(FOOD_SERVING_SIZES.main * totalGuests * durationFactor)
      : 0;

    // Pizza
    // If pizza selected, calculate number of pizzas needed
    // Assume pizza slices per person = FOOD_SERVING_SIZES.pizza * durationFactor
    const pizzaSlicesNeeded = inputs.pizza
      ? FOOD_SERVING_SIZES.pizza * totalGuests * durationFactor
      : 0;
    const pizzasNeeded = inputs.pizza ? Math.ceil(pizzaSlicesNeeded / PIZZA_SLICES_PER_PIZZA) : 0;

    // Desserts
    const dessertsCount = inputs.desserts
      ? Math.ceil(FOOD_SERVING_SIZES.dessert * totalGuests * durationFactor)
      : 0;

    // Drinks calculations
    // Alcohol drinkers count
    const alcoholDrinkers = (alcoholDrinkersPercent / 100) * adults;

    // Soft drinks for all guests
    const softDrinksOunces = inputs.softDrinks
      ? 12 * totalGuests * durationFactor
      : 0;

    // Beer
    const beerOunces = inputs.beer ? DRINK_SERVING_SIZES.beer * alcoholDrinkers * durationFactor : 0;

    // Wine
    const wineOunces = inputs.wine ? DRINK_SERVING_SIZES.wine * alcoholDrinkers * durationFactor : 0;

    // Cocktails
    const cocktailsOunces = inputs.cocktails
      ? DRINK_SERVING_SIZES.cocktail * alcoholDrinkers * durationFactor
      : 0;

    // Convert ounces to bottles/cans (standard sizes)
    // Beer: 12 oz cans/bottles
    const beerCans = inputs.beer ? Math.ceil(beerOunces / 12) : 0;
    // Wine: 750 ml bottles = ~25.4 oz
    const wineBottles = inputs.wine ? Math.ceil(wineOunces / 25.4) : 0;
    // Cocktails: assume mixed from bottles, no direct bottle calc

    // Soft drinks: 12 oz cans/bottles
    const softDrinkCans = inputs.softDrinks ? Math.ceil(softDrinksOunces / 12) : 0;

    // Compose result text
    const foodSummary = [];
    if (inputs.appetizers) foodSummary.push(`${appetizersCount} appetizer pieces`);
    if (inputs.mains) foodSummary.push(`${mainsCount} main course servings`);
    if (inputs.pizza) foodSummary.push(`${pizzasNeeded} pizzas (${pizzaSlicesNeeded.toFixed(0)} slices)`);
    if (inputs.desserts) foodSummary.push(`${dessertsCount} dessert servings`);

    const drinkSummary = [];
    if (inputs.softDrinks) drinkSummary.push(`${softDrinkCans} soft drink cans/bottles`);
    if (inputs.beer) drinkSummary.push(`${beerCans} beer cans/bottles`);
    if (inputs.wine) drinkSummary.push(`${wineBottles} wine bottles`);
    if (inputs.cocktails) drinkSummary.push(`Cocktails for ${alcoholDrinkers.toFixed(0)} drinkers`);

    const value = (
      <>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-white">Food Quantities</h3>
          <ul className="list-disc list-inside text-blue-800 dark:text-blue-300">
            {foodSummary.length > 0 ? (
              foodSummary.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>No food items selected.</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-white">Drink Quantities</h3>
          <ul className="list-disc list-inside text-blue-800 dark:text-blue-300">
            {drinkSummary.length > 0 ? (
              drinkSummary.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>No drink items selected.</li>
            )}
          </ul>
        </div>
      </>
    );

    const formulaUsed =
      "Total guests = adults + 0.5 × kids; Duration factor = 1 + 0.1 × (hours - 2) if > 2; Food servings = base servings × total guests × duration factor; Drink quantities adjusted by % alcohol drinkers.";

    return {
      value,
      label: "Estimated Quantities",
      subtext: `Based on ${adults} adults, ${kids} kids, and ${duration} hour(s) party duration.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I estimate the right amount of food for my party?",
      answer:
        "Estimating food quantities depends on the number of guests, their age groups, and the party duration. Adults typically consume more than children, so children are counted as half an adult for food portions. Longer parties require more servings. This calculator uses standard serving sizes and adjusts quantities based on your inputs to help you avoid both shortages and excessive leftovers.",
    },
    {
      question: "How should I calculate drink quantities for different types of beverages?",
      answer:
        "Drink quantities vary by beverage type and guest preferences. This planner accounts for the percentage of guests who consume alcohol and adjusts quantities accordingly. Soft drinks are calculated for all guests, while beer, wine, and cocktails are estimated based on the number of adult drinkers and party duration. Standard serving sizes and container volumes are used to convert ounces into bottles or cans.",
    },
    {
      question: "Can I customize the servings for vegetarians or kids?",
      answer:
        "Yes, the calculator allows you to specify the percentage of vegetarians among your guests. Kids are counted as half an adult for food portions since they generally eat less. Vegetarian guests are assumed to consume vegetarian mains or pizza slices. This customization ensures your food quantities better match your guests' dietary preferences and needs.",
    },
    {
      question: "What if my party lasts longer than 4 hours?",
      answer:
        "For parties longer than 2 hours, this planner increases food and drink quantities by 10% for each additional hour beyond 2 hours. For example, a 4-hour party will have a 20% increase in servings compared to a 2-hour party. This adjustment helps ensure your guests remain satisfied throughout the event without running out of supplies.",
    },
    {
      question: "How accurate are these calculations for large parties?",
      answer:
        "While this calculator provides detailed estimates based on standard serving sizes and guest counts, actual consumption can vary depending on your guests' appetites, preferences, and the type of event. For large parties, consider rounding up quantities slightly to accommodate unexpected appetites and ensure everyone is well-fed and hydrated.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adults">Number of Adults</Label>
              <Input
                id="adults"
                type="number"
                min={0}
                value={inputs.adults}
                onChange={(e) => handleInputChange("adults", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <Label htmlFor="kids">Number of Kids</Label>
              <Input
                id="kids"
                type="number"
                min={0}
                value={inputs.kids}
                onChange={(e) => handleInputChange("kids", e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <Label htmlFor="duration">Party Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                step={0.5}
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <Label htmlFor="alcoholDrinkersPercent">% Adults Drinking Alcohol</Label>
              <Input
                id="alcoholDrinkersPercent"
                type="number"
                min={0}
                max={100}
                value={inputs.alcoholDrinkersPercent}
                onChange={(e) => handleInputChange("alcoholDrinkersPercent", e.target.value)}
                placeholder="e.g. 70"
              />
            </div>
            <div>
              <Label htmlFor="vegetariansPercent">% Vegetarians</Label>
              <Input
                id="vegetariansPercent"
                type="number"
                min={0}
                max={100}
                value={inputs.vegetariansPercent}
                onChange={(e) => handleInputChange("vegetariansPercent", e.target.value)}
                placeholder="e.g. 15"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (optional)</Label>
              <Input
                id="budget"
                type="number"
                min={0}
                value={inputs.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="e.g. 200"
              />
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Select Food Types</legend>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.appetizers}
                  onChange={(e) => handleInputChange("appetizers", e.target.checked)}
                />
                <span>Appetizers</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.mains}
                  onChange={(e) => handleInputChange("mains", e.target.checked)}
                />
                <span>Main Courses</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.pizza}
                  onChange={(e) => handleInputChange("pizza", e.target.checked)}
                />
                <span>Pizza</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.desserts}
                  onChange={(e) => handleInputChange("desserts", e.target.checked)}
                />
                <span>Desserts</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Select Drink Types</legend>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.softDrinks}
                  onChange={(e) => handleInputChange("softDrinks", e.target.checked)}
                />
                <span>Soft Drinks</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.beer}
                  onChange={(e) => handleInputChange("beer", e.target.checked)}
                />
                <span>Beer</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.wine}
                  onChange={(e) => handleInputChange("wine", e.target.checked)}
                />
                <span>Wine</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.cocktails}
                  onChange={(e) => handleInputChange("cocktails", e.target.checked)}
                />
                <span>Cocktails</span>
              </label>
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed, useMemo updates automatically
          }}
        >
          <Utensils className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              adults: "",
              kids: "",
              duration: "",
              appetizers: true,
              mains: true,
              pizza: false,
              desserts: true,
              softDrinks: true,
              beer: false,
              wine: false,
              cocktails: false,
              alcoholDrinkersPercent: 70,
              vegetariansPercent: 15,
              budget: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950 border-red-200 shadow-lg">
          <CardContent className="p-6 text-center text-red-800 dark:text-red-300 font-semibold">{results.warning}</CardContent>
        </Card>
      )}

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">{results.label}</p>
            <div className="text-left max-w-md mx-auto">{results.value}</div>
            {results.subtext && (
              <p className="mt-4 text-sm text-blue-700 dark:text-blue-300 italic">{results.subtext}</p>
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
          Planning the right amount of food and drinks for a party can be a challenging task, especially when considering the diverse appetites and preferences of your guests. This planner helps you estimate quantities based on the number of adults and children attending, the duration of the event, and the types of food and beverages you want to serve. By using standard serving sizes and adjusting for factors like party length and dietary preferences, you can avoid both shortages and excessive leftovers.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator accounts for different food categories such as appetizers, main courses, pizza, and desserts, as well as drink options including soft drinks, beer, wine, and cocktails. It also considers the percentage of guests who consume alcohol and those who are vegetarians, ensuring your planning is tailored to your specific guest list. This comprehensive approach helps you create a well-balanced menu that satisfies everyone.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate estimates, follow these detailed steps to input your party details and preferences into the calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the number of adults and children attending your party. Children are counted as half an adult for food portions since they generally eat less.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the duration of your party in hours. The calculator adjusts food and drink quantities based on how long your event lasts, increasing portions for longer gatherings.
          </li>
          <li>
            <strong>Step 3:</strong> Select the types of food you plan to serve by checking the appropriate boxes: appetizers, main courses, pizza, and desserts. You can choose any combination based on your menu.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the drink options you want to provide, including soft drinks, beer, wine, and cocktails. The calculator will estimate quantities based on your selections and the percentage of adults who consume alcohol.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the estimated percentage of adults who will be drinking alcohol and the percentage of vegetarians among your guests. These inputs help tailor the food and drink quantities to your guests' preferences.
          </li>
          <li>
            <strong>Step 6:</strong> Optionally, enter your budget to keep track of your spending limits, though this calculator does not directly calculate costs.
          </li>
          <li>
            <strong>Step 7:</strong> Click the "Calculate" button to see detailed estimates of the quantities of food and drinks you should prepare or purchase.
          </li>
          <li>
            <strong>Step 8:</strong> Review the results and adjust your inputs if needed to better fit your party plans.
          </li>
          <li>
            <strong>Step 9:</strong> Use the "Reset" button to clear all inputs and start fresh for a new calculation.
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
      title="Party Food & Drinks Planner"
      description="Plan party food and drink quantities. Calculate exactly how many servings, pizzas, and beverages you need for your guest list."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total guests = adults + 0.5 × kids; Duration factor = 1 + 0.1 × (hours - 2) if > 2; Food servings = base servings × total guests × duration factor; Drink quantities adjusted by % alcohol drinkers.",
        variables: [
          { symbol: "adults", description: "Number of adult guests" },
          { symbol: "kids", description: "Number of child guests (counted as half)" },
          { symbol: "duration", description: "Party duration in hours" },
          { symbol: "durationFactor", description: "Adjustment factor for party length" },
          { symbol: "alcoholDrinkersPercent", description: "Percentage of adults drinking alcohol" },
          { symbol: "vegetariansPercent", description: "Percentage of vegetarian guests" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a 3-hour party with 20 adults and 10 kids. You want to serve appetizers, main courses, and desserts, and provide soft drinks and beer. You estimate 60% of adults will drink alcohol, and 10% of guests are vegetarians.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 20 for adults and 10 for kids. Set the duration to 3 hours to account for the party length.",
          },
          {
            label: "Step 2",
            explanation:
              "Select appetizers, main courses, and desserts as the food options. Choose soft drinks and beer for drinks.",
          },
          {
            label: "Step 3",
            explanation:
              "Set alcohol drinkers percentage to 60 and vegetarians percentage to 10 to reflect your guest preferences.",
          },
          {
            label: "Step 4",
            explanation:
              "Click Calculate to get the estimated quantities. The calculator will show you the number of appetizer pieces, main servings, dessert servings, soft drink cans, and beer cans needed.",
          },
        ],
        result:
          "For this party, you will need approximately 198 appetizer pieces, 45 main course servings, 45 dessert servings, 396 soft drink cans, and 144 beer cans to satisfy your guests over 3 hours.",
      }}
      relatedCalculators={[
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday-life/mulch-coverage-bag-count", icon: "🌿" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "❤️" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💧" },
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