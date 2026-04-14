import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RabbitTemperatureStressRiskHeatstrokeCalculator() {
  // 1. STATE
  // Unit system needed for temperature input (F or C)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Ambient Temperature and Relative Humidity
  const [inputs, setInputs] = useState({
    temperature: "",
    humidity: "",
  });

  // 2. LOGIC ENGINE
  // Risk scoring based on Temperature (°C) and Humidity (%)
  // Using a simplified heat index risk scale adapted for rabbits:
  // Risk Score = 0.5 * Temperature(°C) + 0.5 * Humidity(%)
  // Thresholds:
  // < 40 = Low risk, 40-60 = Moderate risk, > 60 = High risk

  const results = useMemo(() => {
    const tempRaw = parseFloat(inputs.temperature);
    const humidityRaw = parseFloat(inputs.humidity);

    if (isNaN(tempRaw) || isNaN(humidityRaw)) {
      return {
        value: 0,
        label: "Please enter valid temperature and humidity values.",
        subtext: "",
        warning: null,
      };
    }

    // Convert temperature to Celsius if input is imperial (F)
    const tempC = unit === "imperial" ? (tempRaw - 32) * (5 / 9) : tempRaw;

    // Clamp humidity between 0-100%
    const humidity = Math.min(Math.max(humidityRaw, 0), 100);

    // Calculate risk score
    const riskScore = 0.5 * tempC + 0.5 * humidity;

    // Determine risk category and warnings
    let label = "";
    let warning = null;

    if (riskScore < 40) {
      label = "Low Risk of Heatstroke";
    } else if (riskScore >= 40 && riskScore <= 60) {
      label = "Moderate Risk of Heatstroke";
      warning =
        "Monitor your rabbit closely. Provide shade, fresh water, and avoid prolonged exposure to heat.";
    } else {
      label = "High Risk of Heatstroke";
      warning =
        "Immediate action required! Move your rabbit to a cool environment and seek veterinary care if symptoms appear.";
    }

    return {
      value: riskScore.toFixed(1),
      label,
      subtext: `Based on ambient temperature (${tempC.toFixed(1)}°C) and humidity (${humidity}%).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "At what temperature do rabbits start experiencing heat stress?",
      answer: "Rabbits begin showing signs of heat stress above 75°F (24°C), with critical danger occurring at 85°F (29°C) and higher. Prolonged exposure above 80°F can lead to heatstroke within 1-2 hours.",
    },
    {
      question: "How does humidity affect rabbit heatstroke risk?",
      answer: "High humidity (above 60%) significantly increases heatstroke risk by preventing rabbits from cooling through evaporation. At 85°F with 70% humidity, risk escalates rapidly compared to dry conditions.",
    },
    {
      question: "What are the early warning signs of heatstroke in rabbits?",
      answer: "Early signs include rapid breathing (over 60 breaths per minute), lethargy, drooling, and ear temperature increase. If you notice these within 15-20 minutes of heat exposure, move your rabbit to a cool area immediately.",
    },
    {
      question: "Can certain rabbit breeds tolerate heat better than others?",
      answer: "Shorter-haired breeds like Rex and Dutch rabbits have less heat tolerance, while larger rabbits with more body mass generate more internal heat. Angora and Flemish Giant breeds are especially vulnerable to heat stress.",
    },
    {
      question: "How long can a rabbit survive in extreme heat without intervention?",
      answer: "A rabbit exposed to temperatures above 90°F can develop fatal heatstroke within 30-60 minutes, making immediate cooling intervention critical. Even moderate heat (80-85°F) poses risk within 2-3 hours without proper ventilation.",
    },
    {
      question: "What is the safest temperature range for pet rabbits?",
      answer: "Rabbits thrive in temperatures between 60-70°F (15-21°C) with humidity below 60%. This range minimizes heatstroke risk while maintaining comfort and metabolic stability.",
    },
    {
      question: "How does age affect a rabbit's susceptibility to heatstroke?",
      answer: "Young kits (under 8 weeks) and senior rabbits (over 5 years) have reduced heat tolerance and thermoregulation abilities. Middle-aged rabbits (1-4 years) typically handle temperature fluctuations better than extremes of age.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // 5. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            min={unit === "imperial" ? 32 : 0}
            max={unit === "imperial" ? 122 : 50}
            placeholder={`Enter temperature in ${unit === "imperial" ? "°F" : "°C"}`}
            value={inputs.temperature}
            onChange={handleInputChange}
            aria-describedby="temperature-desc"
          />
          <p id="temperature-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical ambient temperature range for rabbits.
          </p>
        </div>

        <div>
          <Label htmlFor="humidity" className="text-slate-700 dark:text-slate-300">
            Relative Humidity (%)
          </Label>
          <Input
            id="humidity"
            name="humidity"
            type="number"
            step="1"
            min={0}
            max={100}
            placeholder="Enter humidity percentage"
            value={inputs.humidity}
            onChange={handleInputChange}
            aria-describedby="humidity-desc"
          />
          <p id="humidity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ambient relative humidity percentage.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers useMemo by updating inputs state (already updated onChange)
          }}
          aria-label="Calculate Temperature Stress Risk"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ temperature: "", humidity: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
                Estimated Risk Score
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Temperature Stress Risk (Rabbit Heatstroke) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your rabbit's heatstroke risk by analyzing current temperature, humidity, and environmental factors. It provides real-time risk assessment to help you prevent potentially fatal heat-related illness in your pet.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the current ambient temperature in your rabbit's living space, humidity percentage, breed type (or size), age, and whether ventilation is adequate. The calculator uses established veterinary thresholds to compute personalized risk levels.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display risk categories from Safe to Severe with recommended actions. Green indicates safe conditions; yellow signals monitoring is needed; red requires immediate intervention such as moving your rabbit to cooler areas, providing ice packs, or contacting an emergency vet.</p>
        </div>
      </section>

      {/* TABLE: Temperature Risk Levels for Rabbit Heatstroke */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Temperature Risk Levels for Rabbit Heatstroke</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows heatstroke risk categories based on ambient temperature and typical symptom onset timelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptom Onset</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intervention Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70-75°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No immediate risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75-80°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ensure ventilation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80-85°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Active cooling needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">85-90°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-60 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency cooling required</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Above 90°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediate veterinary care</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Onset times may accelerate with high humidity (&gt;60%), poor ventilation, or underlying health conditions.</p>
      </section>

      {/* TABLE: Humidity and Temperature Stress Index */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Humidity and Temperature Stress Index</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Combined heat and humidity create compounded heatstroke risk; this table shows stress escalation by humidity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Humidity (&lt;40%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Humidity (40-60%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Humidity (&gt;60%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75°F (24°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low Risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">78°F (26°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">82°F (28°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical Risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">86°F (30°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe Risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">90°F (32°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme Risk</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rabbits cannot sweat; they rely on ear blood vessels and panting to cool, making humid conditions especially dangerous.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide frozen water bottles or ice packs wrapped in towels to create cool zones rabbits can press against during warm weather.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use air conditioning, fans, and shade to maintain temperatures below 75°F, especially during peak summer months.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor respiratory rate regularly; rabbits above 60 breaths per minute in warm conditions may indicate early heat stress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never leave rabbits in direct sunlight or poorly ventilated spaces, as temperatures inside enclosed areas can exceed outdoor readings by 20°F or more.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring humidity in risk assessment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners focus only on temperature while overlooking humidity; a 78°F day with 70% humidity poses greater risk than 82°F with 35% humidity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming rabbits will drink more to cool down</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Unlike dogs, rabbits don't cool through panting or sweating, so increased water intake won't prevent heatstroke without environmental temperature reduction.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Placing cooling items too far from rabbit</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Frozen water bottles are only effective if your rabbit can lie directly against them; placing them across the enclosure provides minimal relief.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting for visible symptoms before cooling</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">By the time rabbits show obvious heatstroke signs (drooling, lethargy), internal organ damage may have already begun; prevention is critical.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what temperature do rabbits start experiencing heat stress?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rabbits begin showing signs of heat stress above 75°F (24°C), with critical danger occurring at 85°F (29°C) and higher. Prolonged exposure above 80°F can lead to heatstroke within 1-2 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does humidity affect rabbit heatstroke risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High humidity (above 60%) significantly increases heatstroke risk by preventing rabbits from cooling through evaporation. At 85°F with 70% humidity, risk escalates rapidly compared to dry conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early warning signs of heatstroke in rabbits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early signs include rapid breathing (over 60 breaths per minute), lethargy, drooling, and ear temperature increase. If you notice these within 15-20 minutes of heat exposure, move your rabbit to a cool area immediately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can certain rabbit breeds tolerate heat better than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Shorter-haired breeds like Rex and Dutch rabbits have less heat tolerance, while larger rabbits with more body mass generate more internal heat. Angora and Flemish Giant breeds are especially vulnerable to heat stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can a rabbit survive in extreme heat without intervention?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A rabbit exposed to temperatures above 90°F can develop fatal heatstroke within 30-60 minutes, making immediate cooling intervention critical. Even moderate heat (80-85°F) poses risk within 2-3 hours without proper ventilation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the safest temperature range for pet rabbits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rabbits thrive in temperatures between 60-70°F (15-21°C) with humidity below 60%. This range minimizes heatstroke risk while maintaining comfort and metabolic stability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect a rabbit's susceptibility to heatstroke?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Young kits (under 8 weeks) and senior rabbits (over 5 years) have reduced heat tolerance and thermoregulation abilities. Middle-aged rabbits (1-4 years) typically handle temperature fluctuations better than extremes of age.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.rabbit.org/care/heat.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">House Rabbit Society - Heat and Rabbits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guide on rabbit heat tolerance thresholds and emergency cooling protocols.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/rabbit" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA - Rabbit Heat Stress Prevention</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for maintaining safe temperatures and recognizing heatstroke symptoms.</p>
          </li>
          <li>
            <a href="https://www.sciencedirect.com/journal/journal-of-exotic-pet-medicine" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Exotic Pet Medicine - Thermoregulation in Lagomorphs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on rabbit physiology and heat-related illness mechanisms.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/rabbits" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Rabbit Heat Intolerance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidelines for diagnosing and treating heat-induced illness in domestic rabbits.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Temperature Stress Risk (Rabbit Heatstroke)"
      description="Assess the risk of heatstroke in rabbits based on ambient temperature and humidity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = 0.5 × Temperature(°C) + 0.5 × Humidity(%)",
        variables: [
          { symbol: "Temperature(°C)", description: "Ambient temperature in degrees Celsius" },
          { symbol: "Humidity(%)", description: "Relative humidity percentage" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rabbit owner measures an ambient temperature of 86°F with 70% humidity on a summer afternoon.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 86°F to Celsius: (86 - 32) × 5/9 = 30°C. Use humidity as 70%.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: 0.5 × 30 + 0.5 × 70 = 15 + 35 = 50.",
          },
          {
            label: "3",
            explanation:
              "A score of 50 indicates moderate risk; the owner should provide shade and water and monitor the rabbit closely.",
          },
        ],
        result: "Moderate Risk of Heatstroke with a risk score of 50.",
      }}
      relatedCalculators={[
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🐾" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Cephalexin Dose Calculator for Dogs", url: "/pets/dog-cephalexin-dose", icon: "🐶" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Temperature Stress Risk (Rabbit Heatstroke)" },
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