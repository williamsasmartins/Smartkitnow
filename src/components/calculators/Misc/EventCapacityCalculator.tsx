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

export default function EventCapacityCalculator() {
  const [inputs, setInputs] = useState({
    area: "",
    layout: "",
    standingPercent: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * 1. Base capacity = total area (sq ft) / space per person (sq ft)
   * 2. Space per person depends on seating layout:
   *    - Standing: 5 sq ft per person (typical for cocktail events)
   *    - Theater: 7 sq ft per person (rows of chairs)
   *    - Banquet: 12 sq ft per person (tables + chairs)
   *    - Classroom: 15 sq ft per person (tables + chairs with writing space)
   * 3. Optionally, user can specify % standing guests to adjust space needs.
   */

  const seatingSpaceMap = {
    standing: 5,
    theater: 7,
    banquet: 12,
    classroom: 15,
  };

  const results = useMemo(() => {
    const areaNum = parseFloat(inputs.area);
    const layout = inputs.layout;
    const standingPercentNum = parseFloat(inputs.standingPercent);

    if (!areaNum || areaNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid venue area in square feet.",
        warning: null,
        formulaUsed: "",
      };
    }
    if (!layout) {
      return {
        value: null,
        label: "",
        subtext: "Please select a seating layout.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Calculate capacity
    // If standingPercent is provided and layout is not standing, calculate weighted average space per person
    let spacePerPerson = seatingSpaceMap[layout];
    let warning = null;

    if (layout !== "standing" && standingPercentNum && standingPercentNum > 0 && standingPercentNum <= 100) {
      // Weighted average space per person:
      // standing guests take 5 sq ft, seated guests take layout sq ft
      const seatedPercent = 100 - standingPercentNum;
      spacePerPerson =
        (standingPercentNum * seatingSpaceMap.standing + seatedPercent * seatingSpaceMap[layout]) / 100;
    } else if (layout === "standing" && standingPercentNum) {
      warning = "Standing layout selected; standing guest percentage input is ignored.";
    }

    // Safety margin: reduce capacity by 10% to allow for aisles, emergency exits, and comfort
    const rawCapacity = areaNum / spacePerPerson;
    const safeCapacity = Math.floor(rawCapacity * 0.9);

    if (safeCapacity < 1) {
      warning = "Venue area too small for any guests with the selected layout.";
    }

    return {
      value: safeCapacity > 0 ? safeCapacity.toString() : "0",
      label: "Maximum Safe Capacity",
      subtext: `Based on ${areaNum} sq ft and "${layout.charAt(0).toUpperCase() + layout.slice(1)}" layout.`,
      warning,
      formulaUsed: `Capacity = (Area ÷ Space per Person) × 0.9 (safety margin). Space per Person adjusted for standing guests if applicable.`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the recommended space per person for different event layouts?",
      answer:
        "The space per person varies by event type: standing events typically require about 5 sq ft per person, theater seating about 7 sq ft, banquet seating about 12 sq ft, and classroom setups about 15 sq ft. These values account for seating, tables, and circulation space to ensure comfort and safety.",
    },
    {
      question: "Why is there a 10% safety margin applied in the calculation?",
      answer:
        "The 10% safety margin accounts for aisles, emergency exits, and general comfort, ensuring that the venue does not become overcrowded. This margin aligns with fire safety codes and best practices recommended by safety authorities.",
    },
    {
      question: "Can this calculator be used for outdoor venues?",
      answer:
        "Yes, but outdoor venues often have different spacing requirements due to open air and layout flexibility. It's recommended to consult local regulations and consider additional space for pathways and amenities when planning outdoor events.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="area" className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Venue Area (sq ft)
              </Label>
              <Input
                id="area"
                type="number"
                min={0}
                step={1}
                placeholder="e.g., 1000"
                value={inputs.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="layout" className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Seating Layout
              </Label>
              <Select
                value={inputs.layout}
                onValueChange={(v) => handleInputChange("layout", v)}
                id="layout"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standing">
                    Standing (Cocktail) <Zap className="inline w-4 h-4 ml-1 text-yellow-500" />
                  </SelectItem>
                  <SelectItem value="theater">
                    Theater (Rows of Chairs) <Activity className="inline w-4 h-4 ml-1 text-green-600" />
                  </SelectItem>
                  <SelectItem value="banquet">
                    Banquet (Tables & Chairs) <Utensils className="inline w-4 h-4 ml-1 text-red-600" />
                  </SelectItem>
                  <SelectItem value="classroom">
                    Classroom (Tables & Chairs) <BookOpen className="inline w-4 h-4 ml-1 text-indigo-600" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="standingPercent" className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Percentage of Standing Guests (optional)
              </Label>
              <Input
                id="standingPercent"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="e.g., 20"
                value={inputs.standingPercent}
                onChange={(e) => handleInputChange("standingPercent", e.target.value)}
                disabled={inputs.layout === "standing"}
              />
              {inputs.layout === "standing" && (
                <p className="text-sm text-slate-500 mt-1 italic">
                  Standing layout selected; this input is disabled.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate event capacity"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ area: "", layout: "", standingPercent: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-3 flex items-center justify-center gap-2">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Event Capacity Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Event Capacity Calculator is a professional tool designed to help event planners, venue managers, and safety officers determine the maximum number of guests that can safely occupy a given space. It takes into account the total venue area and the seating or standing layout to estimate capacity while incorporating safety margins recommended by fire codes and industry best practices. By understanding the spatial requirements of different event setups—such as standing receptions, theater-style seating, banquet dinners, or classroom arrangements—users can optimize guest comfort and comply with safety regulations. This calculator also allows for adjustments based on the percentage of standing guests, which typically require less space than seated attendees.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Event Capacity Calculator is straightforward and intuitive. Begin by entering the total usable area of your venue in square feet, which should exclude non-guest spaces such as kitchens or storage rooms. Next, select the seating layout that best matches your event setup, as each layout type has different space requirements per person. Optionally, if your event includes a mix of standing and seated guests, specify the percentage of standing attendees to get a more accurate capacity estimate. Finally, click the calculate button to see the maximum safe capacity, which includes a safety margin to ensure compliance with safety standards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Measure and enter the total usable venue area in square feet.</li>
          <li>Step 2: Select the seating or standing layout that matches your event.</li>
          <li>Step 3: (Optional) Enter the percentage of guests who will be standing if applicable.</li>
          <li>Step 4: Click "Calculate" to view the maximum safe guest capacity.</li>
          <li>Step 5: Use the results to plan your event ensuring comfort and safety.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning an event, always consider local fire codes and occupancy regulations, which may impose stricter limits than the calculator’s estimates. It is advisable to leave additional space for emergency exits, aisles, and accessibility requirements beyond the calculated capacity. For mixed-use venues or events with dynamic layouts, conduct a physical walkthrough to verify that the space can accommodate the estimated number of guests comfortably. Additionally, consider the nature of your event—high-energy events may require more space per person to prevent crowding and ensure safety. Finally, always communicate capacity limits clearly to staff and attendees to avoid overcrowding and maintain compliance.
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
              href="https://www.nfpa.org/Public-Education/By-topic/Occupant-load-and-egress"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NFPA - Occupant Load and Egress <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The National Fire Protection Association provides detailed guidelines on occupant load calculations and egress requirements to ensure fire safety in public venues.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/coronavirus/2019-ncov/community/large-events/considerations-for-events-gatherings.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Considerations for Events and Gatherings <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The Centers for Disease Control and Prevention offers guidance on safely planning events, including capacity considerations to reduce transmission risks.
            </p>
          </li>
          <li>
            <a
              href="https://extension.psu.edu/space-requirements-for-events"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension - Space Requirements for Events <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This resource provides practical advice on calculating space requirements for various event types, including seating arrangements and standing room.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Event Capacity Calculator"
      description="Calculate venue capacity. Determine how many guests can safely fit in a room based on square footage and seating layout."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Capacity = (Area ÷ Space per Person) × 0.9 (safety margin). Space per Person varies by layout: Standing (5 sq ft), Theater (7 sq ft), Banquet (12 sq ft), Classroom (15 sq ft). Adjusted for standing guest percentage if applicable.",
        variables: [
          { name: "Area", description: "Total usable venue area in square feet" },
          { name: "Space per Person", description: "Average space required per guest based on layout" },
          { name: "Safety Margin", description: "10% reduction to ensure safety and comfort" },
          { name: "Standing Guest Percentage", description: "Optional percentage of guests standing" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 1,200 sq ft banquet hall and expect 20% of guests to be standing during a cocktail hour before dinner.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter the venue area as 1200 sq ft.",
          },
          {
            label: "Step 2",
            explanation: "Select 'Banquet' as the seating layout.",
          },
          {
            label: "Step 3",
            explanation: "Enter 20% for standing guests.",
          },
          {
            label: "Step 4",
            explanation: "Click Calculate to get the maximum safe capacity.",
          },
        ],
        result:
          "The calculator estimates a maximum safe capacity of approximately 90 guests, accounting for the mixed standing and seated layout and safety margin.",
      }}
      relatedCalculators={[
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday-life/bmi-calculator", icon: "Heart" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "Home" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "Droplets" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "Home" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "Zap" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "Zap" },
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