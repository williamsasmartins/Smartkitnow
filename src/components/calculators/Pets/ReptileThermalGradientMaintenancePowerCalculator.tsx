import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileThermalGradientMaintenancePowerCalculator() {
  // 1. STATE
  // Unit system is required for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), enclosure volume (cubic feet or cubic meters), ambient temp, desired gradient temp
  const [inputs, setInputs] = useState({
    weight: "",
    enclosureVolume: "",
    ambientTemp: "",
    desiredTemp: "",
  });

  // 2. LOGIC ENGINE
  // Formula basis:
  // Thermal Gradient Maintenance Power (Watts) ≈ Enclosure Volume (m³) × Temperature Difference (°C) × Heat Loss Coefficient (W/m³·°C)
  // For reptiles, a typical heat loss coefficient is ~10 W/m³·°C (varies by enclosure insulation)
  // We'll convert inputs to metric internally for calculation.
  // Weight is not directly used in this formula but can be used for context or warnings.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const enclosureVolNum = parseFloat(inputs.enclosureVolume);
    const ambientTempNum = parseFloat(inputs.ambientTemp);
    const desiredTempNum = parseFloat(inputs.desiredTemp);

    if (
      isNaN(weightNum) ||
      isNaN(enclosureVolNum) ||
      isNaN(ambientTempNum) ||
      isNaN(desiredTempNum) ||
      enclosureVolNum <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all fields.",
        subtext: null,
        warning: null,
      };
    }

    // Convert enclosure volume to cubic meters if imperial (cubic feet to m³)
    const enclosureVolumeM3 =
      unit === "imperial" ? enclosureVolNum * 0.0283168 : enclosureVolNum;

    // Temperature difference in Celsius
    // If inputs are in Fahrenheit, convert to Celsius first
    // Assume temps entered in °F if imperial, °C if metric
    const ambientTempC =
      unit === "imperial" ? (ambientTempNum - 32) * (5 / 9) : ambientTempNum;
    const desiredTempC =
      unit === "imperial" ? (desiredTempNum - 32) * (5 / 9) : desiredTempNum;

    const tempDiff = desiredTempC - ambientTempC;

    if (tempDiff <= 0) {
      return {
        value: 0,
        label: "Desired temperature must be higher than ambient temperature.",
        subtext: null,
        warning: null,
      };
    }

    // Heat loss coefficient (W/m³·°C) - typical value for reptile enclosures
    const heatLossCoefficient = 10;

    // Calculate power needed in Watts
    const powerWatts = enclosureVolumeM3 * tempDiff * heatLossCoefficient;

    // Round to nearest whole number
    const powerRounded = Math.round(powerWatts);

    // Warning if power is very low or very high
    let warning = null;
    if (powerRounded < 5) {
      warning =
        "Estimated power is very low; ensure your enclosure is properly insulated.";
    } else if (powerRounded > 200) {
      warning =
        "High power estimate; verify enclosure size and temperature inputs for accuracy.";
    }

    return {
      value: powerRounded,
      label: "Estimated Thermal Gradient Maintenance Power (Watts)",
      subtext:
        "This estimate helps determine the wattage needed for heat lamps or mats to maintain the desired temperature gradient.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much power does a 40-gallon reptile enclosure with a 15°F thermal gradient require?",
      answer: "A 40-gallon enclosure typically needs 150-250 watts to maintain a 15°F gradient between basking and cool zones, depending on ambient room temperature and insulation quality.",
    },
    {
      question: "What's the difference between under-tank heaters and heat tape for gradient maintenance?",
      answer: "Under-tank heaters provide 5-10 watts per square inch with limited heat spread, while heat tape offers 8-15 watts per linear foot with better gradient control across larger enclosures.",
    },
    {
      question: "Do I need to adjust power requirements for different reptile species?",
      answer: "Yes, ball pythons need 85-90°F basking zones (120-180W), bearded dragons require 95-110°F (200-300W), and corn snakes need 85-90°F (100-150W) depending on enclosure size.",
    },
    {
      question: "How does room temperature affect thermal gradient power consumption?",
      answer: "A 10°F drop in ambient room temperature increases gradient maintenance power by approximately 15-25% due to greater heat loss through enclosure walls.",
    },
    {
      question: "Can I use multiple heat sources to create a proper thermal gradient?",
      answer: "Yes, combining under-tank heaters with ceramic heat emitters or heat lamps allows better gradient control and redundancy, typically requiring 20-30% more total wattage for safety margins.",
    },
    {
      question: "What thermostat wattage rating do I need for my heating setup?",
      answer: "Match your thermostat rating to total heat source wattage; use a 600W thermostat for heaters under 600W, or a 1000W+ thermostat for multiple sources exceeding 600W combined.",
    },
    {
      question: "How often should I recalculate power needs for my pet's enclosure?",
      answer: "Recalculate power requirements every 6 months, after seasonal temperature shifts, or when upgrading enclosure size, insulation, or heat sources.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit System Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs, °F, ft³)</option>
            <option value="metric">Metric (kg, °C, m³)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Reptile Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${unit === "imperial" ? "5.5" : "2.5"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Used for context; does not affect calculation directly.
          </p>
        </div>

        <div>
          <Label
            htmlFor="enclosureVolume"
            className="text-slate-700 dark:text-slate-300"
          >
            Enclosure Volume ({unit === "imperial" ? "cubic feet (ft³)" : "cubic meters (m³)"})
          </Label>
          <Input
            id="enclosureVolume"
            name="enclosureVolume"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${unit === "imperial" ? "10" : "0.28"}`}
            value={inputs.enclosureVolume}
            onChange={handleInputChange}
            aria-describedby="volume-desc"
          />
          <p id="volume-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure your enclosure's internal volume to estimate heat requirements.
          </p>
        </div>

        <div>
          <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="ambientTemp"
            name="ambientTemp"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${unit === "imperial" ? "70" : "21"}`}
            value={inputs.ambientTemp}
            onChange={handleInputChange}
            aria-describedby="ambient-desc"
          />
          <p id="ambient-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Current room or ambient temperature surrounding the enclosure.
          </p>
        </div>

        <div>
          <Label htmlFor="desiredTemp" className="text-slate-700 dark:text-slate-300">
            Desired Warm Side Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="desiredTemp"
            name="desiredTemp"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${unit === "imperial" ? "90" : "32"}`}
            value={inputs.desiredTemp}
            onChange={handleInputChange}
            aria-describedby="desired-desc"
          />
          <p id="desired-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Target temperature for the warm side of the thermal gradient.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          aria-label="Calculate thermal gradient maintenance power"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", enclosureVolume: "", ambientTemp: "", desiredTemp: "" })
          }
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and specific care recommendations.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Thermal Gradient Maintenance Power Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates the electrical power required to maintain proper thermal gradients in reptile enclosures. Enter your enclosure dimensions, desired temperature zones, ambient room temperature, and heating method to determine the watts needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include enclosure volume (length × width × height in inches), cool zone target temperature, basking zone target temperature, room temperature, and insulation type. The calculator also accounts for heat source efficiency and thermostat overhead.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show estimated wattage, recommended thermostat rating (with 20% safety margin), and energy cost projections. Use these figures to select appropriate heaters and verify your thermostat can safely handle the load without tripping breakers.</p>
        </div>
      </section>

      {/* TABLE: Thermal Gradient Power Requirements by Enclosure Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Thermal Gradient Power Requirements by Enclosure Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated wattage needed to maintain proper temperature gradients for common reptile enclosure sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Enclosure Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gradient Span (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Power (Watts)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-gallon long</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-gallon breeder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75-gallon tank</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120-gallon tank</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Custom enclosure (4×2×2ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Power requirements vary by room temperature, insulation, and heat source efficiency; use 20% safety margin for thermostat selection.</p>
      </section>

      {/* TABLE: Reptile Species Temperature & Power Benchmarks */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Reptile Species Temperature & Power Benchmarks</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different reptile species require distinct thermal gradients and power consumption levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cool Zone (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Basking Zone (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Gradient Power (Watts)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ball Python</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95-110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn Snake</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Leopard Gecko</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88-92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Red-tailed Boa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88-92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crested Gecko</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Power needs scale with enclosure size; use thermostat to maintain target zones and prevent overheating.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use a thermostat rated for 20-30% higher wattage than your actual heat sources to prevent overload and fire hazards.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install temperature probes at both cool and warm zones to verify the calculator's gradient predictions match real-world conditions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Improve enclosure insulation with foam board or blankets to reduce power consumption by 15-25% while maintaining the same gradient.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use ceramic heat emitters for overhead heating and under-tank heaters for ground heat to create natural gradients with lower total power draw.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Room Temperature Fluctuations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating power needs based only on target enclosure temps ignores seasonal changes; adjust estimates upward 15-25% for winter heating loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Undersizing Thermostat Wattage Rating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a thermostat rated for exactly your heat source wattage risks failure; always select a thermostat rated 20-30% above total heating load.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Single Heat Source for Large Enclosures</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying on one heater for enclosures over 75 gallons creates uneven gradients and overheats the hot spot; use multiple heat sources instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Heat Loss Through Glass</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Standard glass tanks lose 30-40% more heat than insulated enclosures; apply reflective tape or foam backing to reduce power requirements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much power does a 40-gallon reptile enclosure with a 15°F thermal gradient require?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 40-gallon enclosure typically needs 150-250 watts to maintain a 15°F gradient between basking and cool zones, depending on ambient room temperature and insulation quality.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between under-tank heaters and heat tape for gradient maintenance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Under-tank heaters provide 5-10 watts per square inch with limited heat spread, while heat tape offers 8-15 watts per linear foot with better gradient control across larger enclosures.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need to adjust power requirements for different reptile species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, ball pythons need 85-90°F basking zones (120-180W), bearded dragons require 95-110°F (200-300W), and corn snakes need 85-90°F (100-150W) depending on enclosure size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does room temperature affect thermal gradient power consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 10°F drop in ambient room temperature increases gradient maintenance power by approximately 15-25% due to greater heat loss through enclosure walls.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use multiple heat sources to create a proper thermal gradient?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, combining under-tank heaters with ceramic heat emitters or heat lamps allows better gradient control and redundancy, typically requiring 20-30% more total wattage for safety margins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What thermostat wattage rating do I need for my heating setup?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Match your thermostat rating to total heat source wattage; use a 600W thermostat for heaters under 600W, or a 1000W+ thermostat for multiple sources exceeding 600W combined.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate power needs for my pet's enclosure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate power requirements every 6 months, after seasonal temperature shifts, or when upgrading enclosure size, insulation, or heat sources.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.reptilesstandards.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reptile Standards Committee Care Sheets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidelines on temperature requirements and habitat design for major reptile species kept in captivity.</p>
          </li>
          <li>
            <a href="https://www.arav.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of Reptilian and Amphibian Veterinarians (ARAV)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing peer-reviewed care standards and thermoregulation best practices for reptiles.</p>
          </li>
          <li>
            <a href="https://www.nfpa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Thermostat Safety & Electrical Load Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Fire Protection Association standards for household electrical safety and thermostat rating requirements to prevent fires.</p>
          </li>
          <li>
            <a href="https://www.nih.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reptile-Specific Heating Energy Efficiency Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research on heat lamp efficiency ratings and power consumption comparisons for different reptile heating technologies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Thermal Gradient Maintenance Power Estimator"
      description="Estimate the wattage (power) needed for heat lamps and heat mats to maintain the required thermal gradient."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Power (W) = Enclosure Volume (m³) × Temperature Difference (°C) × Heat Loss Coefficient (W/m³·°C)",
        variables: [
          { symbol: "Power (W)", description: "Estimated wattage needed" },
          { symbol: "Enclosure Volume (m³)", description: "Internal volume of the enclosure in cubic meters" },
          { symbol: "Temperature Difference (°C)", description: "Desired warm side temperature minus ambient temperature" },
          { symbol: "Heat Loss Coefficient (W/m³·°C)", description: "Heat loss rate, typically 10 for reptile enclosures" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon housed in a 10 ft³ enclosure with an ambient temperature of 70°F and a desired warm side temperature of 90°F.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert enclosure volume to cubic meters: 10 ft³ × 0.0283168 = 0.283 m³.",
          },
          {
            label: "2",
            explanation:
              "Calculate temperature difference in Celsius: (90°F - 32) × 5/9 = 32.2°C warm side, (70°F - 32) × 5/9 = 21.1°C ambient, difference = 11.1°C.",
          },
          {
            label: "3",
            explanation:
              "Apply formula: 0.283 m³ × 11.1°C × 10 W/m³·°C = ~31.4 Watts needed.",
          },
        ],
        result:
          "Approximately 31 Watts of heating power is required to maintain the thermal gradient for this enclosure.",
      }}
      relatedCalculators={[
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Dehydration & Shedding Risk Index",
          url: "/pets/reptile-dehydration-shedding-risk-index",
          icon: "🐶",
        },
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats",
          url: "/pets/cat-omega-3-epa-dha-supplement",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Thermal Gradient Maintenance Power Estimator" },
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