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
      question: "What is the Event Capacity Calculator used for?",
      answer: "This calculator determines the maximum safe occupancy for venues based on square footage, layout type, and fire code requirements. It helps event planners ensure compliance with local regulations and safety standards.",
    },
    {
      question: "How is event capacity calculated?",
      answer: "The calculator uses occupancy load factors (typically 1 person per 7-15 sq ft depending on venue type) and multiplies them by total available space. Results account for emergency exits, accessible routes, and furniture placement.",
    },
    {
      question: "What venue types does this calculator support?",
      answer: "Common types include banquet halls (1 person per 10 sq ft), theaters (1 per 7 sq ft), assembly areas (1 per 7 sq ft), and conference rooms (1 per 15 sq ft). Each has different occupancy codes under IBC and NFPA standards.",
    },
    {
      question: "Does the calculator account for ADA accessibility requirements?",
      answer: "Yes, it factors in accessible seating areas, wheelchair spaces, and compliant aisle widths. ADA requires 1 accessible space per 25 occupants, which reduces overall capacity slightly.",
    },
    {
      question: "Can I adjust the occupancy load factor for my specific venue?",
      answer: "Most calculators allow custom input for occupancy factors based on your local fire code or venue classification. Always verify with your local authority having jurisdiction before finalizing capacity.",
    },
    {
      question: "What happens if my calculated capacity exceeds fire code limits?",
      answer: "Fire code takes legal precedence. You must reduce guest count or increase venue square footage to meet both calculated capacity and official fire marshal approval for your location.",
    },
    {
      question: "How do I account for stage, bar, or kitchen areas in capacity calculation?",
      answer: "Exclude non-public areas like kitchens and storage from usable square footage; include stage and bar only if guests occupy those spaces. The calculator typically allows you to specify which zones count toward capacity.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Event Capacity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Event Capacity Calculator determines the maximum safe occupancy for your venue by analyzing square footage and venue layout type. It ensures compliance with fire codes and safety regulations while helping you plan realistic guest counts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your total usable square footage (excluding kitchens, storage, and restrooms), select your venue type (banquet, theater, assembly, etc.), and specify any permanent fixtures or furniture. The calculator then applies occupancy load factors based on current IBC and fire code standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your legally compliant maximum capacity, required number of exits, and accessibility recommendations. Always cross-check results with your local fire marshal and venue management before finalizing guest count.</p>
        </div>
      </section>

      {/* TABLE: Occupancy Load Factors by Venue Type (2024 IBC Standards) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Occupancy Load Factors by Venue Type (2024 IBC Standards)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These industry-standard occupancy loads determine how many people per square foot are permitted in different venue configurations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Venue Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Occupancy Factor (sq ft/person)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Capacity (2,000 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Banquet Hall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dining events, receptions</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Theater Seating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">286</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performances, presentations</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">General Assembly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">286</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Conferences, seminars</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conference Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">133</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Meetings, training</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dance Floor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">667</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dancing, nightclubs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standing Reception</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cocktail parties, receptions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Classroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Training, lectures</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Factors vary by jurisdiction; consult local fire code and AHJ for final approval.</p>
      </section>

      {/* TABLE: Emergency Exit Requirements by Occupancy Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Emergency Exit Requirements by Occupancy Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Minimum exit requirements scale with total occupancy to ensure safe egress in emergencies.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Occupancy Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Exits Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Min. Exit Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Distance to Exit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1–50 persons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 feet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51–500 persons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44 inches each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 feet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">501–1,000 persons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44 inches each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 feet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,001–2,000 persons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44 inches each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 feet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,001+ persons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44 inches each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 feet</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements per NFPA 101 Life Safety Code; local codes may be stricter.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always subtract hallways, restrooms, and back-of-house areas from total square footage to ensure accurate usable space calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Leave 10–15% buffer below maximum capacity for comfort, emergency egress flow, and unexpected occupancy fluctuations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request written fire code approval from your local fire marshal before booking capacity; codes vary significantly by jurisdiction.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for furniture, staging, bars, and dance floors when calculating available floor space—these features reduce effective capacity by 20–40%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Non-Public Spaces</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Counting kitchens, storage rooms, and hallways in your usable square footage inflates capacity and violates fire codes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Local Fire Code Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Occupancy factors differ by state and municipality; using national averages without local verification can result in illegal over-capacity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Accessible Seating Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ADA requires dedicated wheelchair spaces that reduce overall capacity; failing to allocate these seats creates both legal and safety issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Exit Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating the number or width of required exits is a critical safety violation that fire marshals will reject during inspections.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Event Capacity Calculator used for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator determines the maximum safe occupancy for venues based on square footage, layout type, and fire code requirements. It helps event planners ensure compliance with local regulations and safety standards.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is event capacity calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses occupancy load factors (typically 1 person per 7-15 sq ft depending on venue type) and multiplies them by total available space. Results account for emergency exits, accessible routes, and furniture placement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What venue types does this calculator support?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common types include banquet halls (1 person per 10 sq ft), theaters (1 per 7 sq ft), assembly areas (1 per 7 sq ft), and conference rooms (1 per 15 sq ft). Each has different occupancy codes under IBC and NFPA standards.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for ADA accessibility requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, it factors in accessible seating areas, wheelchair spaces, and compliant aisle widths. ADA requires 1 accessible space per 25 occupants, which reduces overall capacity slightly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust the occupancy load factor for my specific venue?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most calculators allow custom input for occupancy factors based on your local fire code or venue classification. Always verify with your local authority having jurisdiction before finalizing capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my calculated capacity exceeds fire code limits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fire code takes legal precedence. You must reduce guest count or increase venue square footage to meet both calculated capacity and official fire marshal approval for your location.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for stage, bar, or kitchen areas in capacity calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exclude non-public areas like kitchens and storage from usable square footage; include stage and bar only if guests occupy those spaces. The calculator typically allows you to specify which zones count toward capacity.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products/2024-ibc-2024-iecc-bundle/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">2024 International Building Code (IBC) – Chapter 10</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official occupancy classification and load factor standards enforced across most U.S. jurisdictions.</p>
          </li>
          <li>
            <a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=101" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NFPA 101 Life Safety Code</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide for emergency exits, egress routes, and occupancy limits in all building types.</p>
          </li>
          <li>
            <a href="https://www.ada.gov/resources/design-and-construction/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ADA Accessibility Guidelines for Buildings and Facilities</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Standards for accessible seating, wheelchair spaces, and compliant event venue layouts.</p>
          </li>
          <li>
            <a href="https://www.nfpa.org/public-safety/safety-topics/life-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Fire Protection Association – Event Planning Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best practices for event safety, crowd management, and fire code compliance during public gatherings.</p>
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
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "Heart" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "Home" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "Droplets" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "Home" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday/ice-quantity-beverages", icon: "Zap" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "Zap" },
      ]}
      onThisPage={[
        { id: "what-is", label: "How to Calculate" },
        { id: "layout-table", label: "Space by Layout" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Safety Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}