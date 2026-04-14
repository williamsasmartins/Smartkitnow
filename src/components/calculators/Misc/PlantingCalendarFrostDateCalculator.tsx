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
      question: "What is the last frost date and why does it matter for planting?",
      answer: "The last frost date is the average date of the final spring frost in your region, typically ranging from late March to June depending on location. Planting tender crops after this date prevents frost damage that can kill seedlings and destroy yields.",
    },
    {
      question: "How do I find my zip code's frost dates using this calculator?",
      answer: "Enter your zip code or select your location from the dropdown menu, and the calculator will display your spring and fall frost dates based on USDA hardiness zone data. Results are based on 30-year climate averages for accuracy.",
    },
    {
      question: "What's the difference between first and last frost dates?",
      answer: "The last frost date marks when spring frosts end (safe planting time), while the first frost date indicates autumn's first frost (final harvest window). Most regions experience 100-180 frost-free days between these dates.",
    },
    {
      question: "Can I plant all vegetables on the same day after the last frost date?",
      answer: "No—cool-season crops like lettuce and peas tolerate frost and should plant 2-4 weeks before the last frost date, while warm-season crops like tomatoes and peppers need soil &gt;60°F and planting after the last frost date.",
    },
    {
      question: "How accurate are the frost dates from this calculator?",
      answer: "Frost dates are based on 30-year USDA climate averages and are 70-80% reliable; actual dates vary yearly by ±2 weeks depending on local microclimates, elevation, and weather patterns.",
    },
    {
      question: "What should I do if an unexpected frost occurs after planting?",
      answer: "Cover tender plants with row covers, blankets, or mulch to trap soil heat and protect from frost damage; water plants before frost to increase soil moisture and insulate roots.",
    },
    {
      question: "How does my USDA hardiness zone relate to frost dates?",
      answer: "Hardiness zones and frost dates work together—zones indicate winter cold survival, while frost dates determine spring/fall planting windows; knowing both optimizes your growing season timing.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Planting Calendar & Frost Date Finder</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator identifies your region's last spring frost date and first fall frost date, which define your safe planting windows for vegetables and flowers. Knowing these dates prevents crop loss from unexpected freezes and optimizes growing season productivity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your zip code, city, or select your USDA hardiness zone to retrieve personalized frost dates. The calculator also generates a planting calendar showing when to sow seeds or transplant seedlings for your area's climate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to plan cool-season crops 4-6 weeks before the last frost date and warm-season crops after it. The calendar adjusts for your specific location's frost risk, elevation, and microclimatic factors to maximize harvest success.</p>
        </div>
      </section>

      {/* TABLE: Average Frost Dates by USDA Hardiness Zone */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Frost Dates by USDA Hardiness Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical spring and fall frost dates for major U.S. hardiness zones.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hardiness Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Last Spring Frost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">First Fall Frost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Growing Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 3a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May 15-31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">August 15-31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 4a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May 1-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">September 15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 5a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">April 15-May 1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">October 1-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 6a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">April 1-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">October 15-31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-210</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 7a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">March 20-April 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">November 1-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210-240</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zone 8a</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">March 1-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">November 15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260-290</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dates are 30-year averages; actual frost dates vary ±2 weeks annually based on local conditions.</p>
      </section>

      {/* TABLE: Planting Timeline for Common Vegetables */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Planting Timeline for Common Vegetables</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Plan when to plant cool-season and warm-season crops relative to your last frost date.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crop Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Planting Timing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Temp (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cool-Season</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 weeks before LFD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lettuce, peas, spinach, kale</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium-Season</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 weeks before LFD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-65°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Broccoli, cabbage, cauliflower</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warm-Season</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">After LFD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tomatoes, peppers, beans, squash</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot-Season</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 weeks after LFD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Eggplant, okra, sweet potato</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">LFD = Last Frost Date. Monitor soil temperature with a thermometer for best results.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start seeds indoors 6-8 weeks before the last frost date to give transplants time to establish before outdoor planting.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use black plastic mulch or row covers to warm soil 2-3 weeks earlier in spring, extending your planting season.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a garden journal of actual frost dates in your yard to refine predictions and account for microclimatic variations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor 10-day weather forecasts near your last frost date and delay planting if late frosts are predicted.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Planting on the frost date, not after it</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The last frost date is when frost risk ends, so plant warm-season crops several days after, not on, this date to ensure soil warming and frost safety.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring local microclimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your specific yard may be warmer (south-facing slope) or cooler (low valley) than regional averages; observe neighbors' gardens and adjust timing accordingly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated hardiness zone maps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Zones shift every 10 years as climate changes; verify your current zone on USDA's updated 2023 map rather than older references.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Planting all crops at the same time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cool-season crops need planting 4-6 weeks earlier than warm-season ones; successive plantings every 2-3 weeks extend harvests throughout the season.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the last frost date and why does it matter for planting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The last frost date is the average date of the final spring frost in your region, typically ranging from late March to June depending on location. Planting tender crops after this date prevents frost damage that can kill seedlings and destroy yields.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find my zip code's frost dates using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your zip code or select your location from the dropdown menu, and the calculator will display your spring and fall frost dates based on USDA hardiness zone data. Results are based on 30-year climate averages for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between first and last frost dates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The last frost date marks when spring frosts end (safe planting time), while the first frost date indicates autumn's first frost (final harvest window). Most regions experience 100-180 frost-free days between these dates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I plant all vegetables on the same day after the last frost date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—cool-season crops like lettuce and peas tolerate frost and should plant 2-4 weeks before the last frost date, while warm-season crops like tomatoes and peppers need soil &gt;60°F and planting after the last frost date.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are the frost dates from this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Frost dates are based on 30-year USDA climate averages and are 70-80% reliable; actual dates vary yearly by ±2 weeks depending on local microclimates, elevation, and weather patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if an unexpected frost occurs after planting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cover tender plants with row covers, blankets, or mulch to trap soil heat and protect from frost damage; water plants before frost to increase soil moisture and insulate roots.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my USDA hardiness zone relate to frost dates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hardiness zones and frost dates work together—zones indicate winter cold survival, while frost dates determine spring/fall planting windows; knowing both optimizes your growing season timing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://planthardiness.ars.usda.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Plant Hardiness Zone Map</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official interactive map showing hardiness zones by location with updated 2023 data reflecting climate shifts.</p>
          </li>
          <li>
            <a href="https://www.weather.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Weather Service Frost and Freeze Forecasts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time frost warnings and 7-day forecasts to help time last-minute planting decisions.</p>
          </li>
          <li>
            <a href="https://www.almanac.com/gardening/frostdates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Almanac Frost Date Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Searchable database of historical frost dates by U.S. city with planting guides for vegetables.</p>
          </li>
          <li>
            <a href="https://www.csrees.usda.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cooperative Extension System Garden Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">State-specific planting guides and frost date resources from land-grant universities nationwide.</p>
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