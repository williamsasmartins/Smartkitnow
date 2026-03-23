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

export default function EventBudgetCalculator() {
  // Inputs state with default values for controlled inputs
  const [inputs, setInputs] = useState({
    guests: "",
    venueCost: "",
    cateringCostPerGuest: "",
    entertainmentCost: "",
    decorationCost: "",
    miscCost: "",
  });

  // Handle input changes with proper parsing for numbers
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic for total event budget
  const results = useMemo(() => {
    const guests = parseFloat(inputs.guests) || 0;
    const venueCost = parseFloat(inputs.venueCost) || 0;
    const cateringCostPerGuest = parseFloat(inputs.cateringCostPerGuest) || 0;
    const entertainmentCost = parseFloat(inputs.entertainmentCost) || 0;
    const decorationCost = parseFloat(inputs.decorationCost) || 0;
    const miscCost = parseFloat(inputs.miscCost) || 0;

    // Total catering cost scales with guests
    const totalCatering = guests * cateringCostPerGuest;

    // Sum all costs for total budget
    const totalBudget = venueCost + totalCatering + entertainmentCost + decorationCost + miscCost;

    // Warning if guests or costs are zero or negative
    let warning = null;
    if (guests <= 0) warning = "Number of guests should be greater than zero.";
    else if (totalBudget <= 0) warning = "Please enter valid costs to calculate the budget.";

    return {
      value: totalBudget > 0 ? `$${totalBudget.toFixed(2)}` : null,
      label: "Estimated Total Event Budget",
      subtext: `Includes venue, catering, entertainment, decoration, and miscellaneous expenses.`,
      warning,
      formulaUsed:
        "Total Budget = Venue Cost + (Guests × Catering Cost per Guest) + Entertainment Cost + Decoration Cost + Miscellaneous Cost",
    };
  }, [inputs]);

  // FAQ data for structured FAQ section and JSON-LD
  const faqs = [
    {
      question: "How do I estimate catering costs accurately?",
      answer:
        "Catering costs typically depend on the number of guests and the menu selected. It's best to get quotes from multiple caterers and consider dietary preferences to avoid surprises.",
    },
    {
      question: "What miscellaneous expenses should I consider?",
      answer:
        "Miscellaneous expenses can include permits, insurance, transportation, gratuities, and unexpected costs. Allocating a buffer of 10-15% of your total budget is recommended.",
    },
    {
      question: "Can I use this calculator for different types of events?",
      answer:
        "Yes, this calculator is flexible and can be adapted for weddings, corporate events, birthday parties, and more by adjusting the input costs accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI with inputs and buttons
  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-600" /> Number of Guests
              </Label>
              <Input
                id="guests"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 100"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="venueCost" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-blue-600" /> Venue Cost ($)
              </Label>
              <Input
                id="venueCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 2000"
                value={inputs.venueCost}
                onChange={(e) => handleInputChange("venueCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cateringCostPerGuest" className="mb-1 flex items-center gap-1">
                <Utensils className="w-4 h-4 text-blue-600" /> Catering Cost per Guest ($)
              </Label>
              <Input
                id="cateringCostPerGuest"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 25"
                value={inputs.cateringCostPerGuest}
                onChange={(e) => handleInputChange("cateringCostPerGuest", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="entertainmentCost" className="mb-1 flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-600" /> Entertainment Cost ($)
              </Label>
              <Input
                id="entertainmentCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 500"
                value={inputs.entertainmentCost}
                onChange={(e) => handleInputChange("entertainmentCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="decorationCost" className="mb-1 flex items-center gap-1">
                <Paintbrush className="w-4 h-4 text-blue-600" /> Decoration Cost ($)
              </Label>
              <Input
                id="decorationCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 300"
                value={inputs.decorationCost}
                onChange={(e) => handleInputChange("decorationCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="miscCost" className="mb-1 flex items-center gap-1">
                <Wrench className="w-4 h-4 text-blue-600" /> Miscellaneous Cost ($)
              </Label>
              <Input
                id="miscCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 200"
                value={inputs.miscCost}
                onChange={(e) => handleInputChange("miscCost", e.target.value)}
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
          <DollarSign className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              venueCost: "",
              cateringCostPerGuest: "",
              entertainmentCost: "",
              decorationCost: "",
              miscCost: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border shadow-md">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
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

  // Editorial content with rich, authoritative explanations and guidance
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Event Budget Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning an event involves juggling numerous expenses, from securing a venue to catering and entertainment. An event budget calculator is an essential tool that helps organizers estimate the total cost by aggregating all anticipated expenses. This calculator provides a structured approach to budgeting, ensuring no critical cost is overlooked and helping to avoid unexpected financial surprises. By inputting key cost components such as the number of guests, venue fees, catering per guest, entertainment, decorations, and miscellaneous expenses, users can obtain a comprehensive estimate tailored to their event’s scale and style.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your event budget, begin by entering the expected number of guests, as this directly influences catering and other per-person costs. Next, input the fixed costs such as venue rental and entertainment fees. Include decoration expenses and any miscellaneous costs you anticipate, such as permits or transportation. Once all fields are completed, click "Calculate" to see the total estimated budget. Use the "Reset" button to clear inputs and start a new calculation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter the number of guests attending your event.</li>
          <li>Step 2: Input the venue rental cost, which is usually a fixed fee.</li>
          <li>Step 3: Provide the catering cost per guest to calculate total food expenses.</li>
          <li>Step 4: Add entertainment and decoration costs based on your plans.</li>
          <li>Step 5: Include any miscellaneous expenses to cover additional needs.</li>
          <li>Step 6: Click "Calculate" to view your total estimated event budget.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When budgeting for an event, always allocate a contingency fund of at least 10-15% of your total estimated costs to cover unforeseen expenses. Obtain multiple quotes for catering and venue services to ensure competitive pricing and quality. Consider the timing of your event, as off-peak dates may offer discounts. Additionally, ensure you factor in safety-related costs such as insurance, permits, and compliance with local regulations to avoid legal issues. Keeping detailed records of all expenses will help you stay on track and make adjustments as needed.
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
              href="https://www.cdc.gov/nceh/ehs/Topics/event-planning.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Event Planning and Safety <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on planning safe and healthy events, including budgeting considerations for public health compliance.
            </p>
          </li>
          <li>
            <a
              href="https://extension.psu.edu/how-to-create-a-budget-for-your-event"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension - How to Create a Budget for Your Event <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed guide on event budgeting best practices, including cost categories and tips for accurate estimation.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/buildings/articles/how-save-energy-and-money-your-event"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov - How to Save Energy and Money at Your Event <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights on reducing energy costs during events, which can be a significant part of the overall budget.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Event Budget Calculator"
      description="Create a comprehensive event budget. Track expenses for venue, food, and entertainment to keep your party planning on track."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Budget = Venue Cost + (Number of Guests × Catering Cost per Guest) + Entertainment Cost + Decoration Cost + Miscellaneous Cost",
        variables: [
          { name: "Venue Cost", description: "Fixed cost for renting the event venue." },
          { name: "Number of Guests", description: "Total expected attendees." },
          { name: "Catering Cost per Guest", description: "Average food and beverage cost per person." },
          { name: "Entertainment Cost", description: "Fees for performers, DJs, or other entertainment." },
          { name: "Decoration Cost", description: "Expenses for event decor and ambiance." },
          { name: "Miscellaneous Cost", description: "Additional expenses such as permits, insurance, and transportation." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you are planning a wedding with 150 guests. The venue rental is $3,000, catering costs $30 per guest, entertainment is $1,200, decorations cost $800, and miscellaneous expenses are estimated at $500.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter 150 as the number of guests.",
          },
          {
            label: "Step 2",
            explanation: "Input $3,000 for venue cost.",
          },
          {
            label: "Step 3",
            explanation: "Set catering cost per guest to $30.",
          },
          {
            label: "Step 4",
            explanation: "Add $1,200 for entertainment and $800 for decorations.",
          },
          {
            label: "Step 5",
            explanation: "Include $500 for miscellaneous expenses.",
          },
          {
            label: "Step 6",
            explanation: "Calculate to find the total estimated budget.",
          },
        ],
        result: "Total Budget = 3000 + (150 × 30) + 1200 + 800 + 500 = $10,000",
      }}
      relatedCalculators={[
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
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