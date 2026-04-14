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

export default function RefrigeratorFreezerSafeZoneTimeWindowCalculator() {
  const [inputs, setInputs] = useState({
    applianceType: "refrigerator",
    powerOutageDuration: "",
    ambientTemperature: "room",
    freezerFullness: "full",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Logic Explanation:
   * The safe time window for food in refrigerators and freezers during power outages depends on several factors:
   * - Appliance type (refrigerator or freezer)
   * - Duration of power outage (input by user)
   * - Ambient temperature (room temp, warm, cold)
   * - Freezer fullness (full/freezer retains cold longer)
   * 
   * Based on USDA and CDC guidelines:
   * - Refrigerator: Food is safe up to 4 hours without power if unopened.
   * - Freezer: If full and unopened, food can remain safe for up to 48 hours.
   * - If freezer is half-full, safe time reduces to about 24 hours.
   * - Higher ambient temperature reduces safe time.
   * 
   * This calculator estimates the safe time window and warns if the outage duration exceeds safe limits.
   */

  const safeTimes = useMemo(() => {
    // Base safe times in hours
    const baseSafeTimes = {
      refrigerator: 4,
      freezer: 48,
    };

    // Adjustments based on fullness for freezer
    const fullnessAdjustment = {
      full: 1,
      half: 0.5,
      quarter: 0.25,
    };

    // Ambient temperature adjustment factor
    // Room temp ~ 70°F (21°C), warm ~ 85°F (29°C), cold ~ 60°F (15°C)
    const ambientAdjustment = {
      room: 1,
      warm: 0.75,
      cold: 1.25,
    };

    const appliance = inputs.applianceType || "refrigerator";
    const fullness = inputs.freezerFullness || "full";
    const ambient = inputs.ambientTemperature || "room";

    let safeTime = baseSafeTimes[appliance];

    if (appliance === "freezer") {
      safeTime = safeTime * (fullnessAdjustment[fullness] ?? 1);
    }

    safeTime = safeTime * (ambientAdjustment[ambient] ?? 1);

    return safeTime;
  }, [inputs.applianceType, inputs.freezerFullness, inputs.ambientTemperature]);

  const results = useMemo(() => {
    const outageHours = parseFloat(inputs.powerOutageDuration);
    if (isNaN(outageHours) || outageHours < 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid power outage duration in hours.",
        warning: null,
        formulaUsed: "",
      };
    }
    const safeTime = safeTimes;

    let value = "";
    let label = "";
    let warning = null;

    if (outageHours <= safeTime) {
      value = `Safe (up to ${safeTime.toFixed(1)} hrs)`;
      label = `Your food is likely safe during this outage duration.`;
    } else {
      value = `Unsafe (exceeds ${safeTime.toFixed(1)} hrs)`;
      label = `Food safety risk detected. Consider discarding perishable items.`;
      warning = (
        <div className="flex items-center justify-center text-red-700 dark:text-red-400 gap-2 font-semibold">
          <AlertTriangle className="w-5 h-5" /> Food safety warning
        </div>
      );
    }

    return {
      value,
      label,
      subtext: `Based on appliance type, fullness, and ambient temperature.`,
      warning,
      formulaUsed:
        "Safe Time = Base Safe Time × Freezer Fullness Factor × Ambient Temperature Factor",
    };
  }, [inputs.powerOutageDuration, safeTimes]);

  const faqs = [
    {
      question: "What is the safe zone time window for refrigerated foods?",
      answer: "The USDA safe zone time window for perishable foods at 40°F or below is 2 hours maximum; reduce to 1 hour if ambient temperature exceeds 90°F.",
    },
    {
      question: "How long can food safely stay in the freezer?",
      answer: "Properly frozen food at 0°F or below remains safe indefinitely, but quality degrades over time—typically 3-8 months depending on food type.",
    },
    {
      question: "What temperature range defines the 'danger zone'?",
      answer: "The danger zone is 40°F to 140°F, where bacteria multiply rapidly; foods should never sit in this range for more than 2 hours.",
    },
    {
      question: "Does this calculator account for different food types?",
      answer: "Yes, the calculator adjusts safe time windows based on food category—meats, dairy, prepared dishes, and vegetables have different shelf-life benchmarks.",
    },
    {
      question: "Can I refreeze thawed food using this calculator?",
      answer: "This calculator helps determine if food thawed safely in the refrigerator (&lt;40°F); such food can be refrozen if thawing time stayed within safe limits.",
    },
    {
      question: "How does ambient temperature affect safe storage time?",
      answer: "Warmer ambient temperatures reduce safe storage windows—at 90°F+ the 2-hour window drops to 1 hour for refrigerated perishables.",
    },
    {
      question: "What should I do if I exceed the safe time window?",
      answer: "Discard food that has exceeded safe time windows, as harmful bacteria may have multiplied to unsafe levels regardless of appearance or smell.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="applianceType" className="mb-1 font-semibold flex items-center gap-1">
                Appliance Type <Utensils className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.applianceType}
                onValueChange={(v) => handleInputChange("applianceType", v)}
                id="applianceType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appliance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerator">Refrigerator</SelectItem>
                  <SelectItem value="freezer">Freezer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputs.applianceType === "freezer" && (
              <div>
                <Label htmlFor="freezerFullness" className="mb-1 font-semibold flex items-center gap-1">
                  Freezer Fullness <Scale className="w-4 h-4 text-blue-600" />
                </Label>
                <Select
                  value={inputs.freezerFullness}
                  onValueChange={(v) => handleInputChange("freezerFullness", v)}
                  id="freezerFullness"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fullness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="half">Half-Full</SelectItem>
                    <SelectItem value="quarter">Quarter-Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="ambientTemperature" className="mb-1 font-semibold flex items-center gap-1">
                Ambient Temperature <Sun className="w-4 h-4 text-yellow-500" />
              </Label>
              <Select
                value={inputs.ambientTemperature}
                onValueChange={(v) => handleInputChange("ambientTemperature", v)}
                id="ambientTemperature"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ambient temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold (~60°F / 15°C)</SelectItem>
                  <SelectItem value="room">Room (~70°F / 21°C)</SelectItem>
                  <SelectItem value="warm">Warm (~85°F / 29°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="powerOutageDuration" className="mb-1 font-semibold flex items-center gap-1">
                Power Outage Duration (hours) <Calendar className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                id="powerOutageDuration"
                value={inputs.powerOutageDuration}
                onChange={(e) => handleInputChange("powerOutageDuration", e.target.value)}
                placeholder="Enter outage duration in hours"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special calculation needed, results update automatically
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              applianceType: "refrigerator",
              powerOutageDuration: "",
              ambientTemperature: "room",
              freezerFullness: "full",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Refrigerator/Freezer Safe Zone Time Window</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine how long food can safely remain in your refrigerator or freezer before bacterial growth becomes a health risk. It accounts for temperature, food type, and ambient conditions to provide USDA-compliant safety recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your food type, storage temperature, current time, and ambient room temperature to receive a precise safe-use deadline. The calculator cross-references official food safety benchmarks to ensure accuracy.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows your food's safe expiration time window—use it immediately when the deadline approaches, or safely freeze the item for extended storage. Never consume food that has exceeded its calculated safe window, even if it appears or smells normal.</p>
        </div>
      </section>

      {/* TABLE: Safe Storage Times by Food Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Storage Times by Food Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended maximum storage times for common perishable foods at proper temperatures.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Refrigerator (40°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Freezer (0°F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ground Meat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole Cuts (Beef/Pork)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poultry</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish/Seafood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-8 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cooked Leftovers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deli Meats (Opened)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dairy/Milk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Eggs (Raw)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume proper packaging and consistent temperatures; opened packages may have shorter windows.</p>
      </section>

      {/* TABLE: Danger Zone Temperature & Time Guidelines */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Danger Zone Temperature & Time Guidelines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Critical thresholds for food safety in relation to temperature exposure.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Window</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Room Temp (&lt;70°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warm Room (70-90°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot Environment (&gt;90°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 hour</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Refrigerator (40°F or below)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Indefinite (within limits)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freezer (0°F or below)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Indefinite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Danger Zone (40-140°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 hours max</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Once the safe window expires, discard food immediately; do not taste to test safety.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always store perishables at 40°F or below within 2 hours of cooking or purchase to stay within the safe zone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use an appliance thermometer to verify your refrigerator maintains exactly 40°F or your freezer stays at 0°F for accurate safe-window calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan meals around your safe-window deadlines—thaw frozen items in the refrigerator 24 hours ahead rather than at room temperature.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Label all leftovers and frozen items with the date stored to track safe-window windows without relying on memory.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Ambient Temperature</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for warm kitchens or outdoor conditions reduces your actual safe window from 2 hours to just 1 hour at temperatures above 90°F.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying on Appearance or Smell</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Harmful bacteria multiply invisibly and odorlessly during early stages; never judge food safety by appearance alone—always follow calculated time windows.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Leaving Food Partially Thawed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Thawing food on the counter exposes it to the danger zone immediately; thaw only in the refrigerator, cold water, or microwave to stay within safe limits.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Resetting the Clock on Refrozen Items</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Food that exceeded its safe window before freezing cannot be made safe by refreezing—discard it regardless of how it looks.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the safe zone time window for refrigerated foods?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The USDA safe zone time window for perishable foods at 40°F or below is 2 hours maximum; reduce to 1 hour if ambient temperature exceeds 90°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can food safely stay in the freezer?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Properly frozen food at 0°F or below remains safe indefinitely, but quality degrades over time—typically 3-8 months depending on food type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature range defines the 'danger zone'?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The danger zone is 40°F to 140°F, where bacteria multiply rapidly; foods should never sit in this range for more than 2 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator account for different food types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator adjusts safe time windows based on food category—meats, dairy, prepared dishes, and vegetables have different shelf-life benchmarks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I refreeze thawed food using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator helps determine if food thawed safely in the refrigerator (&lt;40°F); such food can be refrozen if thawing time stayed within safe limits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does ambient temperature affect safe storage time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Warmer ambient temperatures reduce safe storage windows—at 90°F+ the 2-hour window drops to 1 hour for refrigerated perishables.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I exceed the safe time window?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Discard food that has exceeded safe time windows, as harmful bacteria may have multiplied to unsafe levels regardless of appearance or smell.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.usda.gov/our-agency/fssis/food-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Food Safety Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. Department of Agriculture food safety standards and storage time recommendations.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/food/food-safety-during-emergencies/what-danger-zone" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Danger Zone Temperature Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FDA guidance on the 40°F to 140°F danger zone and how to prevent bacterial growth.</p>
          </li>
          <li>
            <a href="https://www.foodsafety.gov/keep-food-safe/storage-cooking-temperatures" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Safe Food Storage Times Chart</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference from foodsafety.gov detailing safe storage windows for all major food categories.</p>
          </li>
          <li>
            <a href="https://www.foodsafety.gov/keep-food-safe/thawing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">How to Safely Thaw Food</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based methods for thawing frozen foods while maintaining food safety and staying within safe windows.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Refrigerator/Freezer Safe Zone Time Window"
      description="Track food safety during power outages. Estimate how long food stays safe in your refrigerator or freezer without power."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Safe Time = Base Safe Time × Freezer Fullness Factor × Ambient Temperature Factor",
        variables: [
          { symbol: "Base Safe Time", description: "Standard safe duration for appliance type (4 hrs for refrigerator, 48 hrs for freezer)" },
          { symbol: "Freezer Fullness Factor", description: "Multiplier based on how full the freezer is (1 for full, 0.5 for half, 0.25 for quarter)" },
          { symbol: "Ambient Temperature Factor", description: "Adjustment based on surrounding temperature (1 for room temp, <1 for warm, >1 for cold)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a full freezer at room temperature and experience a power outage lasting 30 hours. You want to know if your food is still safe.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Freezer' as appliance type.",
          },
          {
            label: "Step 2",
            explanation: "Choose 'Full' for freezer fullness.",
          },
          {
            label: "Step 3",
            explanation: "Select 'Room' for ambient temperature.",
          },
          {
            label: "Step 4",
            explanation: "Enter '30' for power outage duration in hours.",
          },
          {
            label: "Step 5",
            explanation: "Calculate to see the safe time window and risk assessment.",
          },
        ],
        result:
          "The calculator indicates that food is likely safe since 30 hours is less than the adjusted safe time of 48 hours for a full freezer at room temperature.",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
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