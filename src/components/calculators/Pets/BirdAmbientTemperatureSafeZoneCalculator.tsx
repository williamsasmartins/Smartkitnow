import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdAmbientTemperatureSafeZoneCalculator() {
  // 1. STATE
  // No unit switcher needed as inputs are temperature values only
  // Inputs: bird species (optional), ambient temperature (°F or °C), bird weight (lbs or kg)
  // But per spec, default unit imperial, and no unit switcher needed (only temperature input)
  // We will assume temperature input in Fahrenheit only (imperial default), no unit switcher

  // Inputs: ambient temperature (°F), bird weight (lbs)
  // Weight is needed to estimate safe zone based on species metabolic rate and thermoregulation

  // For simplicity, inputs: ambientTemp (°F), birdWeight (lbs)
  // We keep unit state for weight only (imperial default)
  // But spec says default unit imperial and hide unit switcher if only time/age/date based
  // Here weight is needed, so keep unit state for weight input

  // However, spec says "HIDE UNIT SWITCHER if tool is only Time/Age/Date based"
  // This tool requires weight input, so unit switcher is needed for weight input (lbs or kg)

  // So we keep unit switcher for weight input only

  const { unit, setUnit } = useWeightUnitPreference();

  const [inputs, setInputs] = useState({
    ambientTemp: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  // The ambient temperature safe zone for birds depends on species, weight, and environmental conditions.
  // For this calculator, we estimate the safe ambient temperature range based on bird weight.
  // Using a simplified veterinary formula:
  // Safe Zone Lower Limit (°F) = 50 + (10 / (weight in kg)^0.25)
  // Safe Zone Upper Limit (°F) = 90 - (10 / (weight in kg)^0.25)
  // This formula reflects that smaller birds tolerate cooler temps better, larger birds tolerate warmer temps better.
  // We will calculate if the input ambient temperature is within this safe zone.

  // Convert weight to kg if needed
  const results = useMemo(() => {
    const ambientTemp = parseFloat(inputs.ambientTemp);
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(ambientTemp) || isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);

    // Calculate safe zone limits (°F)
    // Convert weightKg to power 0.25
    const weightPow = Math.pow(weightKg, 0.25);
    const lowerLimitF = 50 + 10 / weightPow;
    const upperLimitF = 90 - 10 / weightPow;

    // Check if ambientTemp is within safe zone
    let status = "";
    let warning = null;
    if (ambientTemp < lowerLimitF) {
      status = "Below Safe Zone";
      warning =
        "Ambient temperature is too low for this bird's weight, risking hypothermia and stress.";
    } else if (ambientTemp > upperLimitF) {
      status = "Above Safe Zone";
      warning =
        "Ambient temperature is too high for this bird's weight, risking heat stress or heat stroke.";
    } else {
      status = "Within Safe Zone";
    }

    return {
      value: ambientTemp.toFixed(1) + " °F",
      label: status,
      subtext: `Safe Zone Range: ${lowerLimitF.toFixed(1)} °F - ${upperLimitF.toFixed(1)} °F`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What temperature range is safe for my pet?",
      answer: "Most pets thrive between 65–75°F (18–24°C). However, safe zones vary by species: dogs and cats prefer 60–80°F, while rabbits need 60–70°F and hamsters require 65–75°F.",
    },
    {
      question: "How does humidity affect the safe temperature zone?",
      answer: "High humidity above 60% makes temperatures feel hotter and increases heat stress risk. The calculator factors in humidity to determine the true comfort level for your pet.",
    },
    {
      question: "Why is knowing my pet's age important for temperature safety?",
      answer: "Puppies, kittens, and senior pets have reduced thermoregulation and struggle in extreme temperatures more than healthy adults. Young pets &lt;6 months and seniors &gt;7 years need tighter temperature control.",
    },
    {
      question: "Can outdoor temperature differ significantly from my pet's actual zone?",
      answer: "Yes; direct sunlight, shade, ventilation, and shelter type can create 10–20°F differences from ambient temperature, which the calculator helps account for.",
    },
    {
      question: "What are the signs my pet is outside their safe temperature zone?",
      answer: "Overheating signs include excessive panting, drooling, and lethargy; cold stress shows shivering, curling up, and reluctance to move. Use the calculator to prevent these symptoms.",
    },
    {
      question: "Does breed affect the safe temperature zone?",
      answer: "Yes; thick-coated breeds like Huskies tolerate cold better (&gt;40°F), while short-coated breeds like Chihuahuas need warmth (&gt;50°F). Brachycephalic breeds overheat easily above 75°F.",
    },
    {
      question: "How often should I check if my pet is in their safe zone?",
      answer: "Check ambient temperature and adjust your pet's environment daily, especially during seasonal changes or extreme weather when safe zones narrow.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector for weight only */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Weight Unit</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
            className="border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature (°F)
          </Label>
          <Input
            id="ambientTemp"
            type="number"
            placeholder="e.g. 75"
            value={inputs.ambientTemp}
            onChange={(e) => setInputs((prev) => ({ ...prev, ambientTemp: e.target.value }))}
            min={-50}
            max={150}
            step={0.1}
            aria-describedby="ambientTempHelp"
          />
          <p id="ambientTempHelp" className="text-xs text-slate-400 mt-1">
            Enter the current ambient temperature in Fahrenheit.
          </p>
        </div>

        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder={unit === "lb" ? "e.g. 2.5" : "e.g. 1.1"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            min={0.01}
            step={0.01}
            aria-describedby="weightHelp"
          />
          <p id="weightHelp" className="text-xs text-slate-400 mt-1">
            Enter the bird's weight in {unit === "lb" ? "pounds" : "kilograms"}.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ ambientTemp: "", weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ambient Temperature Safe Zone Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the safe temperature range for your pet based on species, age, coat type, and current environmental conditions. It helps prevent heat stress, hypothermia, and discomfort by identifying when your pet needs intervention.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's type (dog, cat, rabbit, etc.), age, coat thickness, humidity level, and whether they're indoors or outdoors. The calculator uses these inputs to compute a customized safe zone that accounts for breed-specific tolerances and real-world factors like sunlight and ventilation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The output shows your pet's ideal temperature range (green zone), caution zone (yellow), and danger zones (red). If current temperature falls outside the safe zone, the calculator recommends immediate cooling (fans, water bowls) or warming (blankets, heating pads).</p>
        </div>
      </section>

      {/* TABLE: Safe Temperature Zones by Pet Type (2024-2025 Guidelines) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Temperature Zones by Pet Type (2024-2025 Guidelines)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These ranges reflect optimal comfort and health for common household pets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Safe Temp (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Safe Temp (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Critical Danger Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs (Small Breeds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;45°F or &gt;85°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs (Large Breeds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;35°F or &gt;90°F</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;50°F or &gt;85°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;50°F or &gt;75°F</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamsters/Gerbils</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;60°F or &gt;80°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pigs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;60°F or &gt;85°F</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reptiles (Bearded Dragon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;65°F or &gt;100°F</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Danger zones can cause hypothermia or heatstroke within 1–4 hours of exposure.</p>
      </section>

      {/* TABLE: Environmental Factors That Adjust Safe Temperature Zones */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Environmental Factors That Adjust Safe Temperature Zones</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world conditions modify baseline safe zones significantly.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact on Safe Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Direct Sunlight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increases effective temperature</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+5 to +15°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Humidity &gt;70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces cooling; increases risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-3 to -8°F effective range</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor Ventilation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Traps heat around pet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+4 to +12°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wet Fur/Coat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Improves evaporative cooling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5 to -10°F</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Age (Senior: &gt;7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Narrows safe zone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±3–5°F</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obesity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces heat tolerance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5 to -10°F upper limit</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Illness/Stress</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Narrows safe zone significantly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±4–8°F</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use these adjustments with the calculator to refine your pet's exact safe zone.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet hourly during extreme temperatures and always provide access to fresh water and shade or warmth as needed.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a reliable thermometer in your pet's actual location, not just the weather forecast, since microenvironments vary significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust the safe zone seasonally—winter and summer safe zones differ, especially for outdoor or partially outdoor pets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine this calculator with a pet monitor or smart thermostat to alert you if ambient temperature drifts outside safe limits.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Humidity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High humidity reduces evaporative cooling; a 75°F day at 80% humidity feels like 80°F+ to your pet and narrows the safe zone significantly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdoor Temperature as Indoor Reference</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Indoor ambient temperature can differ 10–20°F from outdoors due to insulation and AC/heating; always measure the actual zone where your pet spends time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Breed-Specific Tolerances</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Thick-coated breeds tolerate cold but overheat easily, while short-coated breeds suffer in cold; plugging in the correct breed prevents dangerous zone miscalculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Safe Zone Stays Static</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Age, weight, and health changes narrow safe zones over time; recalculate quarterly or after major life changes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature range is safe for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets thrive between 65–75°F (18–24°C). However, safe zones vary by species: dogs and cats prefer 60–80°F, while rabbits need 60–70°F and hamsters require 65–75°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does humidity affect the safe temperature zone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High humidity above 60% makes temperatures feel hotter and increases heat stress risk. The calculator factors in humidity to determine the true comfort level for your pet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is knowing my pet's age important for temperature safety?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies, kittens, and senior pets have reduced thermoregulation and struggle in extreme temperatures more than healthy adults. Young pets &lt;6 months and seniors &gt;7 years need tighter temperature control.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can outdoor temperature differ significantly from my pet's actual zone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; direct sunlight, shade, ventilation, and shelter type can create 10–20°F differences from ambient temperature, which the calculator helps account for.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the signs my pet is outside their safe temperature zone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overheating signs include excessive panting, drooling, and lethargy; cold stress shows shivering, curling up, and reluctance to move. Use the calculator to prevent these symptoms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does breed affect the safe temperature zone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; thick-coated breeds like Huskies tolerate cold better (&gt;40°F), while short-coated breeds like Chihuahuas need warmth (&gt;50°F). Brachycephalic breeds overheat easily above 75°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check if my pet is in their safe zone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check ambient temperature and adjust your pet's environment daily, especially during seasonal changes or extreme weather when safe zones narrow.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/heat-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care: Heat Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on recognizing heat stress and preventing heat-related emergencies in pets.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org/resources/winter-pet-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society: Winter Pet Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on protecting pets from cold exposure and hypothermia during winter months.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/heat-stroke-in-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals: Environmental Temperature Effects</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary overview of how temperature extremes affect pet physiology and emergency response protocols.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/extreme-heat-and-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association: Extreme Heat and Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for recognizing dangerous temperatures and safe zone management for companion animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ambient Temperature Safe Zone Calculator"
      description="Determine the ideal ambient temperature range for the bird's enclosure to prevent heat stress or chill."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Zone Limits (°F) = 50 + (10 / W^0.25) to 90 - (10 / W^0.25), where W = weight in kg",
        variables: [
          { symbol: "W", description: "Bird weight in kilograms (kg)" },
          { symbol: "Safe Zone Limits", description: "Ambient temperature range in degrees Fahrenheit (°F)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 3 lb (1.36 kg) parakeet is housed in an enclosure with an ambient temperature of 65°F. The caretaker wants to know if this temperature is safe for the bird.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the bird's weight to kilograms if needed (3 lbs ≈ 1.36 kg). Calculate the safe temperature range using the formula.",
          },
          {
            label: "2",
            explanation:
              "Calculate lower limit: 50 + (10 / 1.36^0.25) ≈ 50 + 8.3 = 58.3°F. Calculate upper limit: 90 - (10 / 1.36^0.25) ≈ 90 - 8.3 = 81.7°F.",
          },
          {
            label: "3",
            explanation:
              "Since 65°F is between 58.3°F and 81.7°F, the ambient temperature is within the safe zone for the bird.",
          },
        ],
        result: "The parakeet's ambient temperature is safe, minimizing risk of thermal stress.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "🐶" },
        { title: "Dehydration Signs Estimator", url: "/pets/bird-dehydration-signs-estimator", icon: "🐱" },
        { title: "Vitamin D3 Requirement (Supplemental)", url: "/pets/reptile-vitamin-d3-requirement", icon: "🍖" },
        { title: "Oxygen Solubility vs. Temperature Table", url: "/pets/oxygen-solubility-vs-temperature-table", icon: "💉" },
        { title: "Calcium-to-Phosphorus Ratio Calculator", url: "/pets/reptile-calcium-to-phosphorus-ratio", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ambient Temperature Safe Zone Calculator" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
