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

export default function IceQuantityBeveragesCalculator() {
  // Inputs: number of guests, duration (hours), type of event (affects ice usage), drink type (optional)
  const [inputs, setInputs] = useState({
    guests: "",
    duration: "",
    eventType: "casual",
    drinkType: "mixed",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * Ice quantity depends on:
   * - Number of guests
   * - Duration of event (hours)
   * - Event type (casual, formal, party)
   * - Drink type (mixed drinks, beer/wine, soft drinks)
   *
   * Typical ice usage estimates from hospitality industry sources:
   * - Casual event: 1.5 lbs ice per guest per hour
   * - Formal event: 1.0 lbs ice per guest per hour
   * - Party: 2.0 lbs ice per guest per hour
   *
   * Adjustments based on drink type:
   * - Mixed drinks require more ice (baseline)
   * - Beer/wine requires less ice (reduce by 20%)
   * - Soft drinks require moderate ice (reduce by 10%)
   *
   * Bags of ice typically weigh 10 lbs.
   */

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const duration = Number(inputs.duration);
    const eventType = inputs.eventType;
    const drinkType = inputs.drinkType;

    if (!guests || guests <= 0 || !duration || duration <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for guests and duration.",
        formulaUsed: "",
      };
    }

    // Base ice usage per guest per hour (lbs)
    let baseIcePerGuestPerHour = 1.5; // casual default

    if (eventType === "formal") baseIcePerGuestPerHour = 1.0;
    else if (eventType === "party") baseIcePerGuestPerHour = 2.0;

    // Adjust for drink type
    let adjustmentFactor = 1.0;
    if (drinkType === "beer_wine") adjustmentFactor = 0.8;
    else if (drinkType === "soft_drinks") adjustmentFactor = 0.9;

    const icePerGuestPerHour = baseIcePerGuestPerHour * adjustmentFactor;

    // Total ice in pounds
    const totalIceLbs = guests * duration * icePerGuestPerHour;

    // Convert to bags (10 lbs per bag)
    const bagsOfIce = Math.ceil(totalIceLbs / 10);

    return {
      value: `${bagsOfIce} bag${bagsOfIce > 1 ? "s" : ""} (~${totalIceLbs.toFixed(1)} lbs)`,
      label: "Estimated Ice Quantity",
      subtext: `Based on ${guests} guests, ${duration} hour(s), ${eventType} event, and ${drinkType.replace("_", " ")}.`,
      warning: null,
      formulaUsed:
        "Ice (lbs) = Guests × Duration (hours) × Base Ice per Guest per Hour × Drink Type Adjustment; Bags = Ice (lbs) ÷ 10 (lbs per bag)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much ice should I plan per guest for a casual party?",
      answer:
        "For casual events, a good rule of thumb is about 1.5 pounds of ice per guest per hour. This accounts for ice used in drinks and for keeping beverages cold. Adjustments may be needed based on drink types and ambient temperature.",
    },
    {
      question: "Why does the type of event affect ice quantity?",
      answer:
        "Different event types influence drinking habits and ice usage. Formal events tend to use less ice as drinks are served more conservatively, while parties often require more ice due to higher consumption and the need for chilling multiple beverages simultaneously.",
    },
    {
      question: "Can I reuse leftover ice from a previous event?",
      answer:
        "Reusing ice is generally not recommended due to hygiene and quality concerns. Ice melts and refreezes can introduce contaminants and affect taste. It's best to use fresh ice for each event to ensure safety and optimal beverage quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                placeholder="e.g., 50"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Event Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min={0.5}
                step={0.5}
                placeholder="e.g., 4"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="eventType">Type of Event</Label>
              <Select
                value={inputs.eventType}
                onValueChange={(v) => handleInputChange("eventType", v)}
              >
                <SelectTrigger id="eventType" className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="drinkType">Primary Drink Type</Label>
              <Select
                value={inputs.drinkType}
                onValueChange={(v) => handleInputChange("drinkType", v)}
              >
                <SelectTrigger id="drinkType" className="w-full">
                  <SelectValue placeholder="Select drink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Drinks</SelectItem>
                  <SelectItem value="beer_wine">Beer/Wine</SelectItem>
                  <SelectItem value="soft_drinks">Soft Drinks</SelectItem>
                </SelectContent>
              </Select>
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
          onClick={() =>
            setInputs({ guests: "", duration: "", eventType: "casual", drinkType: "mixed" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <p className="text-red-600 font-semibold mt-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-4 text-sm italic text-blue-700 dark:text-blue-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Ice Quantity for Beverages Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Estimating the right amount of ice for beverages is a critical component of successful event planning,
          ensuring drinks stay chilled without waste or shortage. This calculator leverages industry-standard
          hospitality metrics to provide a tailored estimate based on your guest count, event duration, and
          beverage preferences. Ice usage varies significantly depending on the type of event and drinks served,
          making a one-size-fits-all approach ineffective. By considering these factors, this tool helps you
          optimize ice quantity, balancing cost, convenience, and guest satisfaction.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get an accurate estimate of the ice quantity needed for your event, input the number of guests attending,
          the expected duration of the event in hours, the type of event, and the primary type of drinks being served.
          The calculator will then apply proven formulas to estimate the total pounds of ice required and convert that
          into the number of standard 10-pound ice bags to purchase.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of guests expected to attend your event.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the duration of your event in hours, including any cocktail or reception time.
          </li>
          <li>
            <strong>Step 3:</strong> Select the type of event from casual, formal, or party, as this influences ice consumption rates.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the primary drink type served, such as mixed drinks, beer/wine, or soft drinks.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the estimated ice quantity needed, including the number of bags.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning ice quantities, always consider ambient temperature and event location, as warmer environments
          increase ice melt rates and consumption. It's prudent to purchase a small surplus of ice to accommodate
          unexpected guests or extended event duration. For safety and hygiene, use clean ice from reputable sources,
          and avoid reusing melted or refrozen ice. Additionally, store ice in insulated coolers or ice bins to
          maintain quality throughout the event. Proper ice management not only enhances guest experience but also
          reduces waste and cost.
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
              href="https://extension.psu.edu/estimating-ice-quantities-for-events"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Estimating Ice Quantities for Events - Penn State Extension <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide from Penn State Extension detailing methods to estimate ice needs for various event types.
            </p>
          </li>
          <li>
            <a
              href="https://www.foodsafety.gov/food-safety-charts/food-storage-charts"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Food Safety and Storage Guidelines - Foodsafety.gov <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official U.S. government resource providing best practices for ice handling and storage to ensure safety.
            </p>
          </li>
          <li>
            <a
              href="https://www.servsafe.com/ServSafe-Food-Safety-Training/Resources/Articles/How-Much-Ice-Do-I-Need"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How Much Ice Do I Need? - ServSafe <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Industry expert advice on calculating ice quantities for foodservice and event planning.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ice Quantity for Beverages Calculator"
      description="Calculate ice needed for parties. Estimate bags of ice required for drinks and cooling based on guest count and duration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Ice (lbs) = Guests × Duration (hours) × Base Ice per Guest per Hour × Drink Type Adjustment; Bags = Ice (lbs) ÷ 10 (lbs per bag)",
        variables: [
          { symbol: "Guests", description: "Number of guests attending the event" },
          { symbol: "Duration", description: "Event duration in hours" },
          {
            symbol: "Base Ice per Guest per Hour",
            description:
              "Ice consumption rate depending on event type (1.0 - 2.0 lbs per guest per hour)",
          },
          {
            symbol: "Drink Type Adjustment",
            description:
              "Multiplier based on primary drink type (e.g., 1.0 for mixed drinks, 0.8 for beer/wine)",
          },
          { symbol: "Bags", description: "Number of 10-pound ice bags to purchase" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a casual party with 50 guests for 4 hours, serving mostly mixed drinks.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Start with the base ice usage of 1.5 lbs per guest per hour for a casual event.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply by the number of guests and duration: 1.5 × 50 × 4 = 300 lbs of ice.",
          },
          {
            label: "Step 3",
            explanation:
              "Since mixed drinks are the primary beverage, no adjustment is needed (factor 1.0).",
          },
          {
            label: "Step 4",
            explanation:
              "Divide total ice by 10 lbs per bag: 300 ÷ 10 = 30 bags of ice needed.",
          },
        ],
        result: "You should purchase approximately 30 bags of ice to keep drinks chilled throughout the event.",
      }}
      relatedCalculators={[
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
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