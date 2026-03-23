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

const hardinessZones = [
  { label: "Zone 1 (Coldest)", value: 1 },
  { label: "Zone 2", value: 2 },
  { label: "Zone 3", value: 3 },
  { label: "Zone 4", value: 4 },
  { label: "Zone 5", value: 5 },
  { label: "Zone 6", value: 6 },
  { label: "Zone 7", value: 7 },
  { label: "Zone 8", value: 8 },
  { label: "Zone 9", value: 9 },
  { label: "Zone 10", value: 10 },
  { label: "Zone 11", value: 11 },
  { label: "Zone 12 (Warmest)", value: 12 },
];

// Average last frost dates by USDA Hardiness Zone (approximate, Northern Hemisphere spring)
// Source: National Gardening Association and University Extensions
const frostDatesByZone = {
  1: "June 15",
  2: "May 15",
  3: "May 1",
  4: "April 15",
  5: "April 1",
  6: "March 15",
  7: "March 1",
  8: "February 15",
  9: "February 1",
  10: "January 15",
  11: "January 1",
  12: "December 15",
};

// Typical days before/after last frost to plant various seed types
const seedTypeOffsets = {
  "Cool-season vegetable": -14, // 14 days before last frost
  "Warm-season vegetable": 14,  // 14 days after last frost
  "Herbs": 7,                   // 7 days after last frost
  "Flowers": 7,                 // 7 days after last frost
  "Perennials": 30,             // 30 days after last frost
};

function parseDate(monthDayStr) {
  // Parses "Month Day" string to Date object in current year
  const currentYear = new Date().getFullYear();
  return new Date(`${monthDayStr} ${currentYear}`);
}

function formatDate(date) {
  // Formats Date object to "Month Day" string
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

export default function PlantingCalendarFrostDateCalculator() {
  const [inputs, setInputs] = useState({
    zone: null,
    seedType: null,
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { zone, seedType } = inputs;
    if (!zone || !seedType) {
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    const lastFrostStr = frostDatesByZone[zone];
    if (!lastFrostStr) {
      return { value: null, label: "", subtext: "Invalid hardiness zone selected.", warning: AlertTriangle, formulaUsed: "" };
    }

    const lastFrostDate = parseDate(lastFrostStr);
    const offsetDays = seedTypeOffsets[seedType];
    if (offsetDays === undefined) {
      return { value: null, label: "", subtext: "Invalid seed type selected.", warning: AlertTriangle, formulaUsed: "" };
    }

    // Calculate planting date by adding offset days to last frost date
    const plantingDate = new Date(lastFrostDate);
    plantingDate.setDate(plantingDate.getDate() + offsetDays);

    // Determine label based on offset sign
    const label = offsetDays < 0 ? "Plant Before Last Frost" : "Plant After Last Frost";

    // Warning if planting date is before current date (past date)
    const today = new Date();
    let warning = null;
    if (plantingDate < today) {
      warning = AlertTriangle;
    }

    return {
      value: formatDate(plantingDate),
      label,
      subtext: `Based on USDA Hardiness Zone ${zone} and seed type "${seedType}". Last frost date is approximately ${lastFrostStr}.`,
      warning,
      formulaUsed: `Planting Date = Last Frost Date (${lastFrostStr}) + Offset Days (${offsetDays})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a frost date and why is it important for planting?",
      answer:
        "A frost date refers to the average date of the last or first frost in a given area, which is critical for gardeners to know when to safely plant seeds or seedlings without risk of frost damage. Planting too early can kill tender plants, while planting too late can shorten the growing season and reduce yields. Using frost dates helps optimize planting schedules for successful harvests.",
    },
    {
      question: "How do I determine my USDA Hardiness Zone?",
      answer:
        "The USDA Hardiness Zone is determined based on the average annual minimum winter temperature of your location. You can find your zone by entering your zip code or location on official USDA or university extension websites. Knowing your zone helps select plants that are most likely to thrive in your climate.",
    },
    {
      question: "Can frost dates vary year to year?",
      answer:
        "Yes, frost dates are averages calculated over many years and can vary annually due to weather fluctuations and climate change. It's always wise to monitor local weather forecasts and use frost dates as a guideline rather than an absolute rule.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zone" className="flex items-center gap-2">
                <Leaf /> USDA Hardiness Zone
              </Label>
              <Select
                value={inputs.zone ?? ""}
                onValueChange={(v) => handleInputChange("zone", Number(v))}
                id="zone"
                aria-label="Select USDA Hardiness Zone"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your zone" />
                </SelectTrigger>
                <SelectContent>
                  {hardinessZones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value.toString()}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seedType" className="flex items-center gap-2">
                <SeedIcon /> Seed Type
              </Label>
              <Select
                value={inputs.seedType ?? ""}
                onValueChange={(v) => handleInputChange("seedType", v)}
                id="seedType"
                aria-label="Select seed type"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seed type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(seedTypeOffsets).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
          aria-label="Calculate planting date"
        >
          <Calendar className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ zone: null, seedType: null })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card
          className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg ${
            results.warning ? "border-red-400" : ""
          }`}
          role="region"
          aria-live="polite"
          aria-atomic="true"
        >
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <div className="mt-4 flex justify-center items-center text-red-600 dark:text-red-400">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <span>Warning: The calculated planting date may be in the past. Please verify local conditions.</span>
              </div>
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
          Understanding Planting Calendar & Frost Date Finder
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Planting Calendar & Frost Date Finder is an essential tool for gardeners and farmers aiming to optimize their planting schedules based on local climate conditions. By leveraging USDA Hardiness Zones and average frost dates, this calculator helps determine the safest and most effective times to sow various types of seeds. Understanding frost dates is crucial because frost can damage or kill young plants, especially tender seedlings. This tool integrates scientific data and horticultural best practices to provide personalized planting recommendations that maximize growth potential and minimize risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The USDA Hardiness Zone system categorizes regions based on their average minimum winter temperatures, which directly influence the timing of frost events. By selecting your zone and seed type, you receive a tailored planting date that accounts for the typical last frost date in your area and the specific needs of your plants. This approach ensures that your garden thrives by aligning planting activities with natural climatic cycles.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide accurate planting dates with minimal input. First, identify your USDA Hardiness Zone, which can be found through local agricultural extensions or online zone maps. Next, select the type of seed or plant you intend to grow, as different plants have varying tolerances to frost and optimal planting windows. Once these inputs are selected, the calculator computes the recommended planting date by adjusting the average last frost date with scientifically established offsets for each seed type.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Determine your USDA Hardiness Zone using official maps or local extension services.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the seed type you plan to plant from the provided options.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate your personalized planting date.
          </li>
          <li>
            <strong>Step 4:</strong> Review the planting date and accompanying notes to plan your gardening activities accordingly.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear inputs and calculate for different zones or seed types.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this calculator provides scientifically grounded planting dates, gardeners should always consider local microclimates and weather variations. It is advisable to monitor local weather forecasts closely around the planting period, as unexpected late frosts can still occur. Using protective measures such as frost cloths or cold frames can safeguard young plants during uncertain weather. Additionally, soil temperature is a critical factor for seed germination; ensure the soil has warmed sufficiently before planting warm-season crops. Finally, keep detailed records of planting dates and outcomes to refine your gardening strategy year after year.
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
              href="https://planthardiness.ars.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA Plant Hardiness Zone Map <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official USDA resource providing detailed maps and information on plant hardiness zones across the United States, essential for understanding local climate conditions.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/planting-and-growing-guides/planting-dates-and-frost-dates"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension: Planting Dates and Frost Dates <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidance on frost dates, planting schedules, and best practices for gardeners, backed by university research and extension expertise.
            </p>
          </li>
          <li>
            <a
              href="https://www.almanac.com/gardening/frostdates"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Old Farmer's Almanac: Frost Dates and Planting Calendar <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A trusted source for historical frost date data and planting calendars, offering practical advice for gardeners across North America.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Custom icon for seed type label (using Leaf icon as placeholder)
  function SeedIcon() {
    return <Leaf className="inline-block w-4 h-4" />;
  }

  return (
    <CalculatorVerticalLayout
      title="Planting Calendar & Frost Date Finder"
      description="Find your planting dates. Determine the best time to sow seeds based on local frost dates and your hardiness zone."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Planting Date = Last Frost Date + Offset Days (based on seed type)",
        variables: [
          { symbol: "Last Frost Date", description: "Average last frost date for your USDA Hardiness Zone" },
          { symbol: "Offset Days", description: "Number of days before or after last frost to plant seeds, depending on seed type" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A gardener in USDA Hardiness Zone 5 wants to plant warm-season vegetables like tomatoes. The average last frost date for Zone 5 is April 1. Warm-season vegetables are typically planted 14 days after the last frost.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select Zone 5 as your hardiness zone.",
          },
          {
            label: "Step 2",
            explanation: "Choose 'Warm-season vegetable' as the seed type.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate the planting date by adding 14 days to April 1, resulting in April 15 as the recommended planting date.",
          },
        ],
        result: "The gardener should plant warm-season vegetables around April 15 to avoid frost damage and ensure optimal growth.",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
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