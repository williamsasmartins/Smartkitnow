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

const panSizes = [
  { label: "Full Size Pan (20\" x 12\")", length: 20, width: 12, volumeQuarts: 8, typicalCapacityServings: 50 },
  { label: "Half Size Pan (12\" x 10\")", length: 12, width: 10, volumeQuarts: 4, typicalCapacityServings: 25 },
  { label: "Third Size Pan (12\" x 6.5\")", length: 12, width: 6.5, volumeQuarts: 2.7, typicalCapacityServings: 15 },
  { label: "Quarter Size Pan (10\" x 6.5\")", length: 10, width: 6.5, volumeQuarts: 2, typicalCapacityServings: 12 },
  { label: "Sixth Size Pan (6.5\" x 6\")", length: 6.5, width: 6, volumeQuarts: 1.5, typicalCapacityServings: 8 },
  { label: "Ninth Size Pan (6.5\" x 4\")", length: 6.5, width: 4, volumeQuarts: 1, typicalCapacityServings: 6 },
];

export default function BuffetPanCapacityCountCalculator() {
  const [inputs, setInputs] = useState({
    guests: "",
    servingsPerGuest: "1",
    panSize: panSizes[0].label,
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total servings needed and pans required
  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const servingsPerGuest = Number(inputs.servingsPerGuest);
    const pan = panSizes.find((p) => p.label === inputs.panSize);

    if (!guests || guests <= 0 || !servingsPerGuest || servingsPerGuest <= 0 || !pan) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for guests and servings per guest.",
        formulaUsed: "",
      };
    }

    // Total servings needed
    const totalServingsNeeded = guests * servingsPerGuest;

    // Number of pans needed (round up)
    const pansNeeded = Math.ceil(totalServingsNeeded / pan.typicalCapacityServings);

    return {
      value: `${pansNeeded} ${pansNeeded === 1 ? "pan" : "pans"}`,
      label: `Number of ${pan.label} required`,
      subtext: `Each pan serves approximately ${pan.typicalCapacityServings} servings.`,
      warning: null,
      formulaUsed: `Pans Needed = Total Servings Needed ÷ Servings per Pan = (${guests} × ${servingsPerGuest}) ÷ ${pan.typicalCapacityServings}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a buffet serving pan and why is its capacity important?",
      answer:
        "A buffet serving pan, often called a hotel pan, is a standardized container used in food service to hold and serve food in buffets or catering. Knowing its capacity helps caterers and event planners estimate how many pans are needed to serve a specific number of guests without running out or wasting food.",
    },
    {
      question: "How do pan sizes affect food quantity planning?",
      answer:
        "Pan sizes vary in dimensions and volume, affecting how much food they can hold. Larger pans hold more servings but may be harder to manage, while smaller pans allow for variety and easier replenishment. Choosing the right pan size depends on the type of food, serving style, and guest count.",
    },
    {
      question: "Can I use this calculator for different types of food?",
      answer:
        "Yes, but keep in mind that serving sizes vary by food type (e.g., salads vs. entrees). The calculator uses typical serving estimates for buffet-style meals. For more precise planning, adjust servings per guest based on the specific menu and portion sizes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
            <Users className="w-4 h-4" /> Number of Guests
          </Label>
          <Input
            id="guests"
            type="number"
            min={1}
            placeholder="e.g., 100"
            value={inputs.guests}
            onChange={(e) => handleInputChange("guests", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="servingsPerGuest" className="mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4" /> Servings per Guest
          </Label>
          <Input
            id="servingsPerGuest"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g., 1"
            value={inputs.servingsPerGuest}
            onChange={(e) => handleInputChange("servingsPerGuest", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="panSize" className="mb-1 flex items-center gap-1">
            <Scale className="w-4 h-4" /> Pan Size
          </Label>
          <Select value={inputs.panSize} onValueChange={(v) => handleInputChange("panSize", v)} id="panSize">
            <SelectTrigger>
              <SelectValue placeholder="Select pan size" />
            </SelectTrigger>
            <SelectContent>
              {panSizes.map((pan) => (
                <SelectItem key={pan.label} value={pan.label}>
                  {pan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra action needed
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ guests: "", servingsPerGuest: "1", panSize: panSizes[0].label })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Buffet Serving Pan Capacity & Count</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Buffet serving pans, commonly known as hotel pans, are standardized containers used extensively in catering and buffet setups to hold and serve food efficiently. These pans come in various sizes, each designed to fit into steam tables or chafing dishes, facilitating easy food warming and presentation. Understanding the capacity of each pan size is crucial for event planners and caterers to accurately estimate how many pans are needed to serve a given number of guests, ensuring there is enough food without excessive waste. This calculator helps translate guest count and serving size into the exact number of pans required, optimizing both food preparation and service logistics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The most common pan sizes include full, half, third, quarter, sixth, and ninth pans, each with specific dimensions and typical serving capacities. These sizes are standardized to fit into buffet setups seamlessly, but the actual servings per pan can vary depending on the type of food and portion sizes. For example, a full-size pan typically holds about 8 quarts and serves approximately 50 people, assuming standard buffet serving portions. This calculator uses these typical serving estimates to provide a reliable count of pans needed for your event.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to help you determine the number of buffet serving pans required based on your guest count, servings per guest, and preferred pan size. By inputting these values, you can quickly estimate how many pans to prepare, ensuring you have enough food for everyone without over-preparing. The calculator uses typical serving sizes per pan to provide an accurate recommendation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of guests attending your event. This should be a positive whole number representing all individuals you plan to serve.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the average number of servings each guest is expected to consume. For most buffet events, this is typically 1 serving per guest, but you can adjust based on your menu or guest appetite.
          </li>
          <li>
            <strong>Step 3:</strong> Select the buffet pan size you intend to use. Each size has a typical serving capacity, which the calculator uses to determine how many pans you need.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see the recommended number of pans required to serve your guests adequately.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to plan your food preparation and buffet setup efficiently.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning buffet serving pans, always consider the type of food being served, as denser or heavier foods may require smaller portions per pan compared to lighter items like salads or vegetables. It’s also wise to prepare a few extra pans beyond the calculated amount to accommodate unexpected guests or larger appetites. Maintaining proper food safety is paramount; ensure hot foods are kept at or above 140°F (60°C) and cold foods below 40°F (4°C) to prevent bacterial growth. Using chafing dishes or steam tables with the pans helps maintain these temperatures during service.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, consider the logistics of replenishing pans during the event. Smaller pans allow for quicker replacement and variety but may require more frequent monitoring. Label pans clearly to avoid cross-contamination, especially for guests with allergies or dietary restrictions. Finally, always clean and sanitize pans thoroughly before and after use to maintain hygiene standards.
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
              href="https://www.cdc.gov/foodsafety/communication/buffet-food-safety.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Buffet Food Safety <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the Centers for Disease Control and Prevention on safe food handling and temperature control for buffet service.
            </p>
          </li>
          <li>
            <a
              href="https://extension.psu.edu/hotel-pans-and-food-service-equipment"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension - Hotel Pans and Food Service Equipment <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource detailing standard hotel pan sizes, capacities, and their applications in food service.
            </p>
          </li>
          <li>
            <a
              href="https://www.foodsafety.gov/food-safety-charts/food-storage-charts"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FoodSafety.gov - Food Storage and Serving Temperature Charts <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive charts and guidelines on safe food storage and serving temperatures to prevent foodborne illness during buffet service.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Buffet Serving Pan Capacity & Count"
      description="Plan buffet quantities. Calculate how much food fits in standard hotel pans to ensure you feed everyone without running out."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Pans Needed = (Number of Guests × Servings per Guest) ÷ Servings per Pan",
        variables: [
          { symbol: "Number of Guests", description: "Total guests attending the event" },
          { symbol: "Servings per Guest", description: "Average servings each guest will consume" },
          { symbol: "Servings per Pan", description: "Typical servings one pan size can hold" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario: "You are catering a buffet for 120 guests, expecting each guest to have 1.5 servings. You plan to use half size pans.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate total servings needed: 120 guests × 1.5 servings = 180 servings.",
          },
          {
            label: "Step 2",
            explanation: "Determine servings per half size pan: approximately 25 servings per pan.",
          },
          {
            label: "Step 3",
            explanation: "Calculate pans needed: 180 ÷ 25 = 7.2, round up to 8 pans.",
          },
        ],
        result: "You will need 8 half size pans to adequately serve 120 guests with 1.5 servings each.",
      }}
      relatedCalculators={[
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday-life/mulch-coverage-bag-count", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
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