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

export default function PartyFoodDrinksPlannerCalculator() {
  // Inputs: number of guests, duration (hours), party type (casual, formal), food preferences (veg/non-veg/mixed), drink preferences (alcoholic/non-alcoholic/mixed)
  const [inputs, setInputs] = useState({
    guests: "",
    duration: "",
    partyType: "casual",
    foodPreference: "mixed",
    drinkPreference: "mixed",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - Food quantity depends on guests, duration, party type, and food preference.
   * - Drinks quantity depends on guests, duration, and drink preference.
   * 
   * Food servings per guest:
   * - Casual: 1.5 servings per hour
   * - Formal: 1.0 servings per hour (lighter portions)
   * 
   * Food serving size:
   * - Vegetarian: 1 serving = 150g
   * - Non-veg: 1 serving = 200g
   * - Mixed: average 175g
   * 
   * Drinks per guest per hour:
   * - Alcoholic: 2 drinks
   * - Non-alcoholic: 3 drinks
   * - Mixed: 2.5 drinks
   * 
   * Drink serving size:
   * - Alcoholic: 150ml per drink
   * - Non-alcoholic: 250ml per drink
   * - Mixed: average 200ml
   * 
   * Pizza calculation (optional):
   * - 1 pizza = 8 slices
   * - 2 slices per guest average
   * 
   * Warning if inputs missing or unrealistic.
   */

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const duration = Number(inputs.duration);
    const partyType = inputs.partyType;
    const foodPref = inputs.foodPreference;
    const drinkPref = inputs.drinkPreference;

    if (!guests || guests < 1) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid number of guests (at least 1).",
        warning: "Invalid guests input",
        formulaUsed: "",
      };
    }
    if (!duration || duration < 1) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid party duration (at least 1 hour).",
        warning: "Invalid duration input",
        formulaUsed: "",
      };
    }

    // Food servings per guest per hour
    const servingsPerHour = partyType === "formal" ? 1.0 : 1.5;

    // Serving size in grams
    let servingSizeGrams = 175;
    if (foodPref === "vegetarian") servingSizeGrams = 150;
    else if (foodPref === "non-vegetarian") servingSizeGrams = 200;

    // Total food grams
    const totalFoodGrams = guests * duration * servingsPerHour * servingSizeGrams;

    // Convert grams to kilograms for easier reading
    const totalFoodKg = totalFoodGrams / 1000;

    // Drinks per guest per hour
    let drinksPerHour = 2.5;
    if (drinkPref === "alcoholic") drinksPerHour = 2;
    else if (drinkPref === "non-alcoholic") drinksPerHour = 3;

    // Drink serving size in ml
    let drinkServingMl = 200;
    if (drinkPref === "alcoholic") drinkServingMl = 150;
    else if (drinkPref === "non-alcoholic") drinkServingMl = 250;

    // Total drinks volume in liters
    const totalDrinkMl = guests * duration * drinksPerHour * drinkServingMl;
    const totalDrinkL = totalDrinkMl / 1000;

    // Pizza calculation: assume 2 slices per guest, 8 slices per pizza
    const totalSlices = guests * 2;
    const pizzasNeeded = Math.ceil(totalSlices / 8);

    // Formula summary
    const formulaUsed = `
      Food (kg) = guests × duration (hrs) × servings/hr × serving size (g) ÷ 1000
      Drinks (L) = guests × duration (hrs) × drinks/hr × serving size (ml) ÷ 1000
      Pizzas = ceil((guests × 2 slices) ÷ 8 slices per pizza)
    `;

    return {
      value: (
        <>
          <p>
            <strong>Food:</strong> {totalFoodKg.toFixed(2)} kg total ({(guests * duration * servingsPerHour).toFixed(0)} servings)
          </p>
          <p>
            <strong>Drinks:</strong> {totalDrinkL.toFixed(2)} liters total ({(guests * duration * drinksPerHour).toFixed(0)} drinks)
          </p>
          <p>
            <strong>Pizzas:</strong> {pizzasNeeded} pizzas (8 slices each)
          </p>
        </>
      ),
      label: "Estimated Quantities for Your Party",
      subtext: `Based on ${guests} guests, ${duration} hours, ${partyType} party, ${foodPref} food, and ${drinkPref} drinks.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I estimate food quantities for different types of parties?",
      answer:
        "Food quantities vary depending on the party type. Casual parties typically require more servings per guest per hour (about 1.5), while formal events tend to have lighter portions (around 1.0). Adjusting for vegetarian or non-vegetarian preferences also affects serving sizes, with vegetarian servings generally smaller in weight.",
    },
    {
      question: "How can I calculate drink amounts to avoid shortages or waste?",
      answer:
        "Estimate drinks based on guest count, party duration, and drink preferences. Alcoholic drinks average about 2 per guest per hour, while non-alcoholic drinks average 3. Mixed preferences fall in between. Always consider providing a variety of beverages and some buffer to ensure guests stay hydrated and satisfied.",
    },
    {
      question: "Why is pizza included in the planner?",
      answer:
        "Pizza is a popular party food and serves as a convenient way to estimate portions for casual gatherings. Assuming 2 slices per guest and 8 slices per pizza helps you order the right number of pizzas without excess or shortage.",
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
                <Users className="w-4 h-4" /> Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min={1}
                placeholder="e.g., 20"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="mb-1 flex items-center gap-1">
                <ClockIcon className="w-4 h-4" /> Duration (hours)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                placeholder="e.g., 4"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partyType" className="mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Party Type
              </Label>
              <Select
                value={inputs.partyType}
                onValueChange={(v) => handleInputChange("partyType", v)}
              >
                <SelectTrigger id="partyType" className="w-full">
                  <SelectValue placeholder="Select party type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="foodPreference" className="mb-1 flex items-center gap-1">
                <Utensils className="w-4 h-4" /> Food Preference
              </Label>
              <Select
                value={inputs.foodPreference}
                onValueChange={(v) => handleInputChange("foodPreference", v)}
              >
                <SelectTrigger id="foodPreference" className="w-full">
                  <SelectValue placeholder="Select food preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="drinkPreference" className="mb-1 flex items-center gap-1">
                <Droplets className="w-4 h-4" /> Drink Preference
              </Label>
              <Select
                value={inputs.drinkPreference}
                onValueChange={(v) => handleInputChange("drinkPreference", v)}
              >
                <SelectTrigger id="drinkPreference" className="w-full">
                  <SelectValue placeholder="Select drink preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alcoholic">Alcoholic</SelectItem>
                  <SelectItem value="non-alcoholic">Non-Alcoholic</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              duration: "",
              partyType: "casual",
              foodPreference: "mixed",
              drinkPreference: "mixed",
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
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-2xl font-semibold text-blue-900 dark:text-white">{results.label}</p>
            <div className="text-lg text-slate-800 dark:text-slate-300">{results.value}</div>
            <p className="text-sm italic text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
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
          Understanding Party Food & Drinks Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning the right amount of food and drinks for a party is crucial to ensure your guests are satisfied without excessive waste. This planner uses proven serving size guidelines and consumption rates based on party type, duration, and guest preferences to provide accurate estimates. By considering factors such as vegetarian or non-vegetarian food choices and alcoholic or non-alcoholic drink preferences, it tailors recommendations to your unique event. Additionally, it includes pizza calculations, a popular party staple, to help you order the perfect quantity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to be flexible and adaptable for various party scenarios, from casual backyard barbecues to formal dinners. It helps hosts avoid the common pitfalls of under or overestimating quantities, saving money and reducing food waste while keeping guests happy and well-fed.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this planner is straightforward and intuitive. Begin by entering the number of guests attending your party and the expected duration in hours. Next, select the type of party you are hosting—casual or formal—as this affects portion sizes. Then, specify your guests' food preferences, choosing between vegetarian, non-vegetarian, or a mix of both. Finally, select the drink preferences, which influence the quantity and type of beverages needed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of guests expected to attend.
          </li>
          <li>
            <strong>Step 2:</strong> Input the duration of your event in hours.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the party type to adjust serving sizes accordingly.
          </li>
          <li>
            <strong>Step 4:</strong> Select food preferences to tailor the food quantity.
          </li>
          <li>
            <strong>Step 5:</strong> Select drink preferences to estimate beverage needs.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to view your personalized food and drink quantities.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning food and drinks for your party, always consider the diversity of your guests' dietary needs and preferences. Offering a variety of options, including vegetarian and non-alcoholic beverages, ensures inclusivity and satisfaction. Keep in mind that longer events may require additional servings to keep guests comfortable and energized. Additionally, practicing safe food handling and storage is essential to prevent foodborne illnesses; keep cold foods refrigerated and hot foods properly heated.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For alcoholic beverages, encourage responsible consumption and provide plenty of water and non-alcoholic options. Consider local regulations and guidelines regarding alcohol service. Lastly, always prepare a little extra to accommodate unexpected guests or larger appetites, but avoid excessive over-purchasing to minimize waste and environmental impact.
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
              href="https://www.cdc.gov/foodsafety/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC Food Safety (https://www.cdc.gov/foodsafety/index.html) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on safe food handling and preparation to prevent foodborne illnesses during events.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/food-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension - Food Safety (https://extension.umn.edu/food-safety) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert advice on food safety practices and portion planning for gatherings and events.
            </p>
          </li>
          <li>
            <a
              href="https://www.eatright.org/food/planning-and-prep/food-labels-and-packaging/portion-control"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Academy of Nutrition and Dietetics - Portion Control (https://www.eatright.org/food/planning-and-prep/food-labels-and-packaging/portion-control) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative resource on understanding serving sizes and portion control to optimize food planning.
            </p>
          </li>
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
        formula: `
          Food (kg) = guests × duration (hrs) × servings/hr × serving size (g) ÷ 1000
          Drinks (L) = guests × duration (hrs) × drinks/hr × serving size (ml) ÷ 1000
          Pizzas = ceil((guests × 2 slices) ÷ 8 slices per pizza)
        `,
        variables: [
          { name: "guests", description: "Number of guests attending the party" },
          { name: "duration", description: "Duration of the party in hours" },
          { name: "servings/hr", description: "Average food servings per guest per hour" },
          { name: "serving size (g)", description: "Weight of one serving of food in grams" },
          { name: "drinks/hr", description: "Average drinks per guest per hour" },
          { name: "serving size (ml)", description: "Volume of one drink serving in milliliters" },
          { name: "slices per guest", description: "Average pizza slices consumed per guest" },
          { name: "slices per pizza", description: "Number of slices in one pizza" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a casual 4-hour party with 30 guests. The group prefers mixed food options and mixed drinks.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input 30 guests and 4 hours duration.",
          },
          {
            label: "Step 2",
            explanation: "Select 'Casual' for party type, 'Mixed' for food and drink preferences.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get the estimated food and drink quantities.",
          },
        ],
        result:
          "The planner estimates approximately 31.5 kg of food, 6.0 liters of drinks, and 8 pizzas needed to satisfy your guests.",
      }}
      relatedCalculators={[
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "💡" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Plant Spacing Calculator", url: "/everyday-life/plant-spacing-calculator", icon: "🌿" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
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

// Additional icon for clock (not in original list, so use Info icon as substitute)
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}