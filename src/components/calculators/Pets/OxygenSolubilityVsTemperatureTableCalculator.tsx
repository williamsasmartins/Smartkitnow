import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const oxygenSolubilityData = [
  { tempC: 0, solubilityMgL: 14.6 },
  { tempC: 5, solubilityMgL: 12.8 },
  { tempC: 10, solubilityMgL: 11.3 },
  { tempC: 15, solubilityMgL: 10.1 },
  { tempC: 20, solubilityMgL: 9.1 },
  { tempC: 25, solubilityMgL: 8.3 },
  { tempC: 30, solubilityMgL: 7.6 },
  { tempC: 35, solubilityMgL: 7.0 },
  { tempC: 40, solubilityMgL: 6.5 },
];

function interpolateSolubility(tempC: number) {
  // If temp out of range, clamp
  if (tempC <= oxygenSolubilityData[0].tempC) return oxygenSolubilityData[0].solubilityMgL;
  if (tempC >= oxygenSolubilityData[oxygenSolubilityData.length - 1].tempC)
    return oxygenSolubilityData[oxygenSolubilityData.length - 1].solubilityMgL;

  // Find two points to interpolate between
  for (let i = 0; i < oxygenSolubilityData.length - 1; i++) {
    const current = oxygenSolubilityData[i];
    const next = oxygenSolubilityData[i + 1];
    if (tempC >= current.tempC && tempC <= next.tempC) {
      const ratio = (tempC - current.tempC) / (next.tempC - current.tempC);
      return current.solubilityMgL + ratio * (next.solubilityMgL - current.solubilityMgL);
    }
  }
  return 0; // fallback
}

export default function OxygenSolubilityVsTemperatureTableCalculator() {
  // 1. STATE
  // Unit system is fixed to metric (°C) for temperature input, no unit switcher needed
  const [inputs, setInputs] = useState({
    temperature: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const temp = parseFloat(inputs.temperature);
    if (isNaN(temp)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid temperature in °C.",
      };
    }
    if (temp < 0 || temp > 40) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Temperature should be between 0°C and 40°C for accurate solubility values.",
      };
    }
    const solubility = interpolateSolubility(temp);
    return {
      value: solubility.toFixed(2),
      label: "Oxygen Solubility (mg/L)",
      subtext: `Maximum dissolved oxygen at ${temp.toFixed(1)}°C`,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does oxygen solubility decrease as water temperature increases?",
      answer: "Oxygen solubility is inversely related to temperature because warmer water molecules move faster, allowing dissolved oxygen to escape more easily into the air. At 0°C, water holds approximately 14.6 mg/L of oxygen, while at 30°C it holds only 7.5 mg/L.",
    },
    {
      question: "What oxygen levels do fish and aquatic pets need to survive?",
      answer: "Most freshwater fish require minimum dissolved oxygen levels of 5-6 mg/L to thrive, though some species like trout need 7-8 mg/L. Levels below 3 mg/L become critically dangerous for most aquatic life.",
    },
    {
      question: "How does salinity affect oxygen solubility in aquatic pet tanks?",
      answer: "Saltwater holds approximately 20% less dissolved oxygen than freshwater at the same temperature. At 20°C, saltwater contains about 8 mg/L compared to 9.2 mg/L in freshwater.",
    },
    {
      question: "What is the optimal water temperature for maintaining oxygen levels in aquariums?",
      answer: "Water temperatures between 18-24°C provide good oxygen retention for most freshwater pets while supporting beneficial bacteria growth. Avoid temperatures above 28°C where oxygen becomes critically depleted.",
    },
    {
      question: "How can I improve oxygen levels in warm water aquariums?",
      answer: "Use air pumps, increase surface agitation, add plants for photosynthetic oxygen production, perform frequent water changes, and consider chiller units to lower water temperature during hot months.",
    },
    {
      question: "Does altitude affect the oxygen solubility table readings?",
      answer: "Yes, higher altitudes have lower atmospheric pressure, reducing the maximum oxygen solubility by approximately 0.5% per 1,000 feet of elevation. Pets at high altitudes may need additional aeration.",
    },
    {
      question: "How quickly does oxygen depletion occur when aeration stops?",
      answer: "In a stagnant, fully stocked aquarium, dissolved oxygen can drop from 8 mg/L to dangerous levels (&lt;3 mg/L) within 4-6 hours depending on bioload and temperature.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Water Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            min={0}
            max={40}
            step={0.1}
            placeholder="Enter temperature in °C"
            value={inputs.temperature}
            onChange={(e) => setInputs({ temperature: e.target.value })}
            aria-describedby="temperatureHelp"
          />
          <p id="temperatureHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter temperature between 0°C and 40°C for accurate solubility.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra calculation needed, results update automatically
          }}
          aria-label="Calculate oxygen solubility"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ temperature: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Oxygen Solubility vs. Temperature Table</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners determine how much dissolved oxygen is available in their aquarium or water system based on water temperature. Understanding oxygen solubility is critical for maintaining healthy environments for fish, shrimp, and other aquatic pets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the table, locate your current water temperature in degrees Celsius on the left column, then read across to find the corresponding oxygen solubility in mg/L (milligrams per liter). You can also input specific temperatures to generate precise oxygen availability data for your setup.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Compare your calculated oxygen levels against your pet species' requirements shown in the second reference table. If oxygen falls below minimum thresholds, implement aeration improvements like air pumps, water changes, or temperature reduction to increase dissolved oxygen.</p>
        </div>
      </section>

      {/* TABLE: Dissolved Oxygen Solubility in Freshwater (mg/L) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dissolved Oxygen Solubility in Freshwater (mg/L)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how oxygen solubility decreases as freshwater temperature increases from freezing to 35°C.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dissolved Oxygen (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Saturation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adequate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adequate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on standard atmospheric pressure at sea level.</p>
      </section>

      {/* TABLE: Oxygen Requirements by Aquatic Pet Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Oxygen Requirements by Aquatic Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different pets require specific minimum dissolved oxygen levels to maintain health and prevent stress-related illness.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum DO (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Range (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Preference (°C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Goldfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bettas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-27</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corydoras Catfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Shrimp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Killifish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-24</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Sustained levels below minimum cause stress, disease, and potential mortality.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your aquarium's actual dissolved oxygen using an electronic meter, as the table provides theoretical maximums that may differ from real conditions due to bioload and organic debris.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform 25-30% water changes weekly to replenish dissolved oxygen and remove waste that depletes oxygen faster in established tanks.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run air pumps and filters 24/7, especially in warm water setups above 26°C where oxygen becomes critically limited without active aeration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add live aquatic plants like Ludwigia or Rotala to increase daytime oxygen production through photosynthesis, reducing reliance on mechanical aeration.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming maximum solubility equals actual dissolved oxygen</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The table shows theoretical maximum oxygen; your tank's actual dissolved oxygen is typically 10-30% lower due to organic matter consumption.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring temperature fluctuations throughout the day</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Water temperature rises during daytime and falls at night, causing oxygen levels to fluctuate significantly; calculate for peak afternoon temperatures.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Stocking tanks based on room temperature instead of actual water temperature</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ambient room temperature differs from tank water temperature, especially in heated aquariums; always measure water temperature directly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting nighttime oxygen depletion in planted tanks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Plants consume oxygen at night through respiration, dropping levels 1-2 mg/L below daytime readings even in heavily planted aquariums.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does oxygen solubility decrease as water temperature increases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Oxygen solubility is inversely related to temperature because warmer water molecules move faster, allowing dissolved oxygen to escape more easily into the air. At 0°C, water holds approximately 14.6 mg/L of oxygen, while at 30°C it holds only 7.5 mg/L.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What oxygen levels do fish and aquatic pets need to survive?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most freshwater fish require minimum dissolved oxygen levels of 5-6 mg/L to thrive, though some species like trout need 7-8 mg/L. Levels below 3 mg/L become critically dangerous for most aquatic life.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does salinity affect oxygen solubility in aquatic pet tanks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Saltwater holds approximately 20% less dissolved oxygen than freshwater at the same temperature. At 20°C, saltwater contains about 8 mg/L compared to 9.2 mg/L in freshwater.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the optimal water temperature for maintaining oxygen levels in aquariums?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Water temperatures between 18-24°C provide good oxygen retention for most freshwater pets while supporting beneficial bacteria growth. Avoid temperatures above 28°C where oxygen becomes critically depleted.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I improve oxygen levels in warm water aquariums?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use air pumps, increase surface agitation, add plants for photosynthetic oxygen production, perform frequent water changes, and consider chiller units to lower water temperature during hot months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does altitude affect the oxygen solubility table readings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, higher altitudes have lower atmospheric pressure, reducing the maximum oxygen solubility by approximately 0.5% per 1,000 feet of elevation. Pets at high altitudes may need additional aeration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly does oxygen depletion occur when aeration stops?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In a stagnant, fully stocked aquarium, dissolved oxygen can drop from 8 mg/L to dangerous levels (&lt;3 mg/L) within 4-6 hours depending on bioload and temperature.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.usgs.gov/faqs/what-dissolved-oxygen-concentration-water" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Henry's Law and Dissolved Gas Solubility</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USGS explains the scientific principles governing dissolved oxygen in water at varying temperatures.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/wqs-tech-assistance/aquatic-life-water-quality-criteria" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquatic Life Water Quality Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA guidelines establish minimum dissolved oxygen requirements for freshwater and saltwater aquatic life protection.</p>
          </li>
          <li>
            <a href="https://www.lenntech.com/aquatic/dissolved-oxygen.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dissolved Oxygen Solubility Tables</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lenntech provides comprehensive oxygen solubility data across temperature and salinity ranges for water quality management.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-parameters" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Water Parameters and Fish Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aquarium Co-op explains how dissolved oxygen and temperature parameters directly impact fish stress levels and disease susceptibility.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Oxygen Solubility vs. Temperature Table"
      description="Reference table showing how the maximum solubility of dissolved oxygen changes with water temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Oxygen Solubility (mg/L) ≈ interpolated value from standard temperature-solubility data",
        variables: [
          { symbol: "Temperature (°C)", description: "Water temperature affecting oxygen solubility" },
          { symbol: "Oxygen Solubility (mg/L)", description: "Maximum dissolved oxygen concentration" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A veterinarian needs to estimate the maximum dissolved oxygen in a freshwater tank at 18°C to ensure fish welfare.",
        steps: [
          { label: "1", explanation: "Input 18°C into the calculator's temperature field." },
          { label: "2", explanation: "Click 'Calculate' to obtain the oxygen solubility value." },
          { label: "3", explanation: "Use the result to assess if aeration is needed to maintain healthy oxygen levels." },
        ],
        result: "At 18°C, the estimated oxygen solubility is approximately 9.6 mg/L, guiding appropriate tank management.",
      }}
      relatedCalculators={[
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🐾" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Horse Hay Intake Calculator (per body weight %)", url: "/pets/horse-hay-intake-bodyweight-percent", icon: "🐎" },
        { title: "Cat BMI/Body Index (educational)", url: "/pets/cat-bmi-body-index-educational", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Oxygen Solubility vs. Temperature Table" },
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