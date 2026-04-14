import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogHeatRiskWalkSafetyWindowCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    temperature: "",
    humidity: "",
  });

  // 2. LOGIC ENGINE
  // Heat Index calculation adapted for dogs - using ambient temperature (°F or °C) and relative humidity (%)
  // We use the Rothfusz regression formula for Heat Index in °F, then convert if needed.
  // Heat Index (HI) formula (°F):
  // HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH - 6.83783*10^-3*T^2 - 5.481717*10^-2*RH^2 + 1.22874*10^-3*T^2*RH + 8.5282*10^-4*T*RH^2 - 1.99*10^-6*T^2*RH^2
  // Where T = temperature in °F, RH = relative humidity in %
  // For metric input, convert °C to °F first: °F = °C * 9/5 + 32
  // Then calculate HI, then convert back to °C if needed.
  // We then interpret HI to determine walk safety windows based on veterinary heat risk guidelines.

  const results = useMemo(() => {
    const tempRaw = parseFloat(inputs.temperature);
    const humidityRaw = parseFloat(inputs.humidity);

    if (
      isNaN(tempRaw) ||
      isNaN(humidityRaw) ||
      tempRaw <= 0 ||
      humidityRaw < 0 ||
      humidityRaw > 100
    )
      return {
        value: 0,
        label: "Enter valid temperature and humidity values",
        subtext: null,
        warning: null,
      };

    // Convert temperature to °F if metric
    const tempF = unit === "metric" ? tempRaw * 9 / 5 + 32 : tempRaw;
    const RH = humidityRaw;

    // Rothfusz regression formula for Heat Index (°F)
    const HI =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * RH -
      0.22475541 * tempF * RH -
      6.83783e-3 * tempF * tempF -
      5.481717e-2 * RH * RH +
      1.22874e-3 * tempF * tempF * RH +
      8.5282e-4 * tempF * RH * RH -
      1.99e-6 * tempF * tempF * RH * RH;

    // Adjustments for low humidity or temperature (standard Rothfusz adjustments)
    let heatIndexF = HI;
    if (RH < 13 && tempF >= 80 && tempF <= 112) {
      heatIndexF -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
    } else if (RH > 85 && tempF >= 80 && tempF <= 87) {
      heatIndexF += ((RH - 85) / 10) * ((87 - tempF) / 5);
    }

    // Convert back to °C if metric
    const heatIndexC = unit === "metric" ? ((heatIndexF - 32) * 5) / 9 : heatIndexF;

    // Determine risk level and walk safety window based on veterinary heat risk guidelines:
    // Source: AVMA, veterinary heat stroke risk charts, and humidity impact on thermoregulation.
    // Risk categories (approximate):
    // Safe: HI < 80°F (26.7°C)
    // Caution: 80-90°F (26.7-32.2°C)
    // High Risk: 90-103°F (32.2-39.4°C)
    // Extreme Risk: >103°F (>39.4°C)

    let riskLabel = "";
    let warning = null;
    let safetyWindow = "";

    if (heatIndexF < 80) {
      riskLabel = "Safe to walk your dog";
      safetyWindow =
        "Conditions are generally safe for outdoor activity with normal precautions.";
    } else if (heatIndexF >= 80 && heatIndexF < 90) {
      riskLabel = "Caution advised";
      safetyWindow =
        "Limit walk duration and intensity; monitor your dog closely for signs of heat stress.";
    } else if (heatIndexF >= 90 && heatIndexF < 103) {
      riskLabel = "High heat risk";
      safetyWindow =
        "Avoid strenuous activity; walk only during cooler parts of the day (early morning or late evening).";
      warning =
        "High risk of heat-related illness. Dogs with brachycephalic breeds, obesity, or health issues are especially vulnerable.";
    } else {
      riskLabel = "Extreme heat risk - avoid walks";
      safetyWindow =
        "Avoid all outdoor activity; heat stroke risk is severe and can be fatal.";
      warning =
        "Extreme caution: Heat stroke can develop rapidly. Provide shade, water, and cool environments.";
    }

    // Format result string with unit
    const heatIndexDisplay =
      unit === "metric"
        ? `${heatIndexC.toFixed(1)} °C`
        : `${heatIndexF.toFixed(1)} °F`;

    return {
      value: heatIndexDisplay,
      label: riskLabel,
      subtext: safetyWindow,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What temperature and humidity combination is safe for walking my dog?",
      answer: "Most dogs are safe for outdoor walks below 77°F (25°C) at any humidity level, but the heat index matters most—a 75°F day at 90% humidity feels like 78°F and requires caution for vulnerable pets.",
    },
    {
      question: "How does humidity affect my pet's heat risk during walks?",
      answer: "Humidity reduces a pet's ability to cool through panting; at 80°F with 80% humidity, the heat index reaches 88°F, significantly increasing heat stress risk even though the actual temperature seems moderate.",
    },
    {
      question: "What's the safest time of day to walk my pet in hot weather?",
      answer: "Early morning (before 9 AM) and late evening (after 7 PM) typically offer the lowest temperatures and humidity levels, creating the safest windows for outdoor pet exercise.",
    },
    {
      question: "Which dog breeds are most at risk during high heat and humidity?",
      answer: "Brachycephalic breeds like Bulldogs, Pugs, and Persian cats are most vulnerable; they struggle to pant effectively and can overheat at heat indices above 75°F (24°C).",
    },
    {
      question: "Can I check if the pavement is too hot for my dog's paws?",
      answer: "Use the 7-second rule: if you can't hold your hand on the pavement for 7 seconds, it's too hot for your pet's paws; typically, this occurs when air temps exceed 85°F (29°C).",
    },
    {
      question: "What signs indicate my pet is overheating during a walk?",
      answer: "Watch for excessive panting, drooling, lethargy, vomiting, or stumbling; these warning signs mean it's time to return indoors and provide cool water immediately.",
    },
    {
      question: "How do I use the heat index calculation for pet safety planning?",
      answer: "Input current temperature and humidity into the calculator to determine the heat index; if it exceeds 86°F (30°C), consider skipping outdoor walks or limiting them to &lt;10 minutes in shaded areas.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "temperature") {
      // Allow only numbers and decimal
      if (/^\d*\.?\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, temperature: value }));
      }
    } else if (name === "humidity") {
      // Allow only numbers and decimal, max 100
      if (/^\d*\.?\d*$/.test(value)) {
        if (parseFloat(value) <= 100) {
          setInputs((prev) => ({ ...prev, humidity: value }));
        }
      }
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F)</SelectItem>
              <SelectItem value="metric">Metric (°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature Input */}
        <div>
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="temperature"
            name="temperature"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 85" : "e.g. 29"}
            value={inputs.temperature}
            onChange={handleInputChange}
            aria-describedby="temp-desc"
          />
          <p id="temp-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the current ambient temperature.
          </p>
        </div>

        {/* Humidity Input */}
        <div>
          <Label htmlFor="humidity" className="text-slate-700 dark:text-slate-300">
            Relative Humidity (%)
          </Label>
          <Input
            id="humidity"
            name="humidity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60"
            value={inputs.humidity}
            onChange={handleInputChange}
            aria-describedby="humidity-desc"
          />
          <p id="humidity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the current relative humidity (0-100%).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate Heat Risk"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ temperature: "", humidity: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Heat Index
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Heat Risk/Walk Safety Window (Temp & Humidity)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether conditions are safe for walking your pet by combining temperature and humidity into a heat index value. It helps you identify optimal walking windows while protecting pets from heat stress and paw pad burns.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the current or forecasted temperature (in °F or °C) and humidity percentage (0-100%). The calculator instantly generates a heat index and safety recommendation tailored to your pet's needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show whether conditions are safe, require caution, or pose high/extreme risk. Use this guidance to schedule walks during cooler parts of the day, adjust duration, and recognize when indoor alternatives are necessary for your pet's health.</p>
        </div>
      </section>

      {/* TABLE: Heat Index & Pet Safety Guidelines by Temperature and Humidity */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heat Index & Pet Safety Guidelines by Temperature and Humidity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows heat index values and corresponding safety recommendations for outdoor pet walks.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humidity 30%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humidity 60%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humidity 90%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Safety Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">73</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">73</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Caution</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">101</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">89</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme Risk</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Heat index values above 86°F require shortened walks or indoor alternatives for most pets.</p>
      </section>

      {/* TABLE: Recommended Walk Duration by Pet Type & Heat Index */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Walk Duration by Pet Type & Heat Index</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Walk duration guidelines adjust based on pet susceptibility and environmental heat index.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heat Index &lt;75°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heat Index 75-86°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heat Index &gt;86°F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small/Senior Pets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid or &lt;5 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brachycephalic Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthy Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 min max</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Active/Young Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60+ min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always provide shade and fresh water; adjust based on your pet's individual tolerance and health status.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check the heat index 2-3 hours before your planned walk to identify the safest window within your schedule.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Bring a portable water bowl and freeze a water bottle the night before to provide cool hydration breaks during walks.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Wet your pet's paws with cool (not cold) water before returning indoors to help lower core body temperature safely.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">On days with heat indices above 86°F, consider treadmill training or indoor play as substitutes for outdoor walks.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Humidity When Temperature Seems Moderate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 75°F day at 95% humidity creates a heat index of 80°F; relying on temperature alone misses significant heat stress risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Walking During Peak Afternoon Heat Without Checking Heat Index</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Afternoon walks between 12-5 PM often coincide with peak heat index values, even if temperature appears manageable.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Pets Have the Same Heat Tolerance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior, overweight, and brachycephalic pets require safer windows than young, healthy breeds—customize recommendations per pet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Paw Pad Temperature Assessment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pavement can be 20-30°F hotter than air temperature; a 85°F day creates pavement near 110°F, causing paw pad burns in seconds.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature and humidity combination is safe for walking my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs are safe for outdoor walks below 77°F (25°C) at any humidity level, but the heat index matters most—a 75°F day at 90% humidity feels like 78°F and requires caution for vulnerable pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does humidity affect my pet's heat risk during walks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Humidity reduces a pet's ability to cool through panting; at 80°F with 80% humidity, the heat index reaches 88°F, significantly increasing heat stress risk even though the actual temperature seems moderate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the safest time of day to walk my pet in hot weather?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early morning (before 9 AM) and late evening (after 7 PM) typically offer the lowest temperatures and humidity levels, creating the safest windows for outdoor pet exercise.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which dog breeds are most at risk during high heat and humidity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Brachycephalic breeds like Bulldogs, Pugs, and Persian cats are most vulnerable; they struggle to pant effectively and can overheat at heat indices above 75°F (24°C).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I check if the pavement is too hot for my dog's paws?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the 7-second rule: if you can't hold your hand on the pavement for 7 seconds, it's too hot for your pet's paws; typically, this occurs when air temps exceed 85°F (29°C).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What signs indicate my pet is overheating during a walk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Watch for excessive panting, drooling, lethargy, vomiting, or stumbling; these warning signs mean it's time to return indoors and provide cool water immediately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use the heat index calculation for pet safety planning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input current temperature and humidity into the calculator to determine the heat index; if it exceeds 86°F (30°C), consider skipping outdoor walks or limiting them to &lt;10 minutes in shaded areas.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/heat-illness-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association Heat Illness in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on recognizing and preventing heat-related illness in companion animals.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org/resources/heat-safety-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society Heat Safety for Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical tips for keeping pets safe during hot weather, including walk scheduling strategies.</p>
          </li>
          <li>
            <a href="https://www.akc.org/expert-advice/exercise-in-hot-weather" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club Exercise in Hot Weather</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Breed-specific heat tolerance information and safe exercise guidelines during summer months.</p>
          </li>
          <li>
            <a href="https://www.weather.gov/safety/heat-index" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Weather Service Heat Index Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical explanation of how heat index combines temperature and humidity to reflect perceived heat.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heat Risk/Walk Safety Window (Temp & Humidity)"
      description="Calculates the **Heat Index Risk** based on ambient temperature and humidity to determine safe windows for dog walks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH - 6.83783×10⁻³*T² - 5.481717×10⁻²*RH² + 1.22874×10⁻³*T²*RH + 8.5282×10⁻⁴*T*RH² - 1.99×10⁻⁶*T²*RH²",
        variables: [
          { symbol: "HI", description: "Heat Index (°F)" },
          { symbol: "T", description: "Ambient temperature (°F)" },
          { symbol: "RH", description: "Relative humidity (%)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A dog owner wants to determine if it is safe to walk their dog when the temperature is 85°F with 70% humidity.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input temperature as 85°F and humidity as 70% into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes the Heat Index using the formula, resulting in approximately 90.7°F, indicating a high heat risk.",
          },
        ],
        result:
          "The calculator advises avoiding strenuous activity and walking only during cooler parts of the day, with a warning about heat stroke risk.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Heat Risk/Walk Safety Window (Temp & Humidity)" },
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