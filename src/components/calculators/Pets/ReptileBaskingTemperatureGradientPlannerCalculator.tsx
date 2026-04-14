import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileBaskingTemperatureGradientPlannerCalculator() {
  // 1. STATE
  // Unit system is not needed because inputs are temperature values (°F or °C) and gradient (°F or °C).
  // Default to imperial (°F) but allow metric toggle for temperature scale.
  const [tempUnit, setTempUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: Desired Basking Spot Temperature & Ambient Enclosure Temperature
  // Both temperatures are required to calculate the gradient.
  const [inputs, setInputs] = useState({
    baskingTemp: "",
    ambientTemp: "",
  });

  // 2. LOGIC ENGINE
  // Calculate temperature gradient = baskingTemp - ambientTemp
  // Validate inputs and ensure baskingTemp > ambientTemp for a proper gradient.
  const results = useMemo(() => {
    const basking = parseFloat(inputs.baskingTemp);
    const ambient = parseFloat(inputs.ambientTemp);

    if (isNaN(basking) || isNaN(ambient)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid numeric temperatures.",
      };
    }
    if (basking <= ambient) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Basking temperature must be higher than ambient temperature to create a proper gradient.",
      };
    }

    const gradient = basking - ambient;

    return {
      value: gradient.toFixed(1),
      label: `Temperature Gradient (${tempUnit === "imperial" ? "°F" : "°C"})`,
      subtext: `Basking Spot: ${basking.toFixed(1)}°${tempUnit === "imperial" ? "F" : "C"} - Ambient: ${ambient.toFixed(
        1
      )}°${tempUnit === "imperial" ? "F" : "C"}`,
      warning: null,
    };
  }, [inputs, tempUnit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What temperature range should my bearded dragon's basking spot be?",
      answer: "Bearded dragons require a basking spot of 95-110°F (35-43°C). The cooler side of the enclosure should be 75-85°F (24-29°C) to create a proper thermal gradient.",
    },
    {
      question: "How do I calculate the correct temperature gradient for my reptile?",
      answer: "This calculator measures the difference between your basking zone and cool zone temperatures. A typical gradient is 20-30°F (11-17°C) difference, allowing your pet to thermoregulate naturally.",
    },
    {
      question: "What species need the steepest temperature gradients?",
      answer: "Desert species like leopard geckos and corn snakes need gradients of 25-35°F (14-19°C), while tropical species like ball pythons prefer gentler 15-20°F (8-11°C) gradients.",
    },
    {
      question: "Can I use regular heat lamps for basking temperatures?",
      answer: "Yes, but use ceramic heat emitters or UVA/UVB basking bulbs rated for your enclosure size. Always monitor actual temperatures with a digital thermometer, not the bulb's stated wattage.",
    },
    {
      question: "How often should I check and adjust basking temperatures?",
      answer: "Check temperatures daily using an infrared thermometer or temperature gun. Seasonal changes, bulb aging, and thermostat drift can shift gradients by 5-10°F (3-6°C) monthly.",
    },
    {
      question: "What happens if my reptile's gradient is too shallow?",
      answer: "An insufficient gradient (&lt;15°F difference) prevents proper thermoregulation, leading to poor digestion, reduced activity, and compromised immune function in your pet.",
    },
    {
      question: "Do nocturnal reptiles need basking temperatures at night?",
      answer: "Most nocturnal species like ball pythons need daytime basking of 88-92°F (31-33°C) and a 10-15°F (6-8°C) drop at night, mimicking natural temperature cycles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Toggle temperature unit between imperial and metric
  function toggleTempUnit() {
    if (inputs.baskingTemp !== "" && inputs.ambientTemp !== "") {
      let basking = parseFloat(inputs.baskingTemp);
      let ambient = parseFloat(inputs.ambientTemp);
      if (!isNaN(basking) && !isNaN(ambient)) {
        if (tempUnit === "imperial") {
          // Convert °F to °C
          basking = ((basking - 32) * 5) / 9;
          ambient = ((ambient - 32) * 5) / 9;
        } else {
          // Convert °C to °F
          basking = (basking * 9) / 5 + 32;
          ambient = (ambient * 9) / 5 + 32;
        }
        setInputs({
          baskingTemp: basking.toFixed(1),
          ambientTemp: ambient.toFixed(1),
        });
      }
    }
    setTempUnit(tempUnit === "imperial" ? "metric" : "imperial");
  }

  const widget = (
    <div className="space-y-6">
      {/* Temperature Unit Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Temperature Unit</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTempUnit}
            className="w-[120px] h-9 font-semibold"
            aria-label="Toggle temperature unit"
          >
            {tempUnit === "imperial" ? "°F" : "°C"}
          </Button>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="baskingTemp" className="text-slate-700 dark:text-slate-300">
            Desired Basking Spot Temperature (°{tempUnit === "imperial" ? "F" : "C"})
          </Label>
          <Input
            id="baskingTemp"
            name="baskingTemp"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${tempUnit === "imperial" ? "95" : "35"}`}
            value={inputs.baskingTemp}
            onChange={handleInputChange}
            aria-describedby="baskingTempHelp"
          />
          <p id="baskingTempHelp" className="text-xs text-slate-400 mt-1">
            Enter the temperature of the basking spot your reptile needs.
          </p>
        </div>

        <div>
          <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
            Ambient Enclosure Temperature (°{tempUnit === "imperial" ? "F" : "C"})
          </Label>
          <Input
            id="ambientTemp"
            name="ambientTemp"
            type="text"
            inputMode="decimal"
            placeholder={`e.g. ${tempUnit === "imperial" ? "75" : "24"}`}
            value={inputs.ambientTemp}
            onChange={handleInputChange}
            aria-describedby="ambientTempHelp"
          />
          <p id="ambientTempHelp" className="text-xs text-slate-400 mt-1">
            Enter the general ambient temperature inside the enclosure.
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
          aria-label="Calculate temperature gradient"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ baskingTemp: "", ambientTemp: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Basking Temperature & Gradient Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you design and maintain optimal thermal gradients for your reptile's enclosure. It accounts for your pet's species, ambient room temperature, and equipment to recommend precise basking and cool zone temperatures.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your reptile species, current room temperature, heat lamp wattage, and distance from the basking surface. The calculator also factors in enclosure size and insulation to model realistic temperature distribution.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated basking and cool zone targets, then use an infrared thermometer or temperature gun to verify actual temperatures in your setup. Adjust lamp distance or wattage as needed to match recommendations and ensure your pet can thermoregulate safely.</p>
        </div>
      </section>

      {/* TABLE: Ideal Basking & Cool Zone Temperatures by Species */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Basking & Cool Zone Temperatures by Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for setting up proper thermal gradients for common pet reptiles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Basking Zone (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cool Zone (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gradient Difference (°F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95-110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn Snake</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ball Python</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88-92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Leopard Gecko</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88-92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Red-Eared Slider</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-78</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crested Gecko</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iguanas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All temperatures in Fahrenheit. Verify species-specific requirements with your herp veterinarian.</p>
      </section>

      {/* TABLE: Heat Lamp Wattage & Recommended Tank Coverage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heat Lamp Wattage & Recommended Tank Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Guidelines for selecting appropriate heat sources based on enclosure size and desired basking temperature.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lamp Wattage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Distance from Basking Spot</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Basking Temp Rise (°F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 Gallon (24x12x16)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40 Gallon Breeder (36x18x18)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 Gallon (48x24x20)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120 Gallon (48x24x24)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Custom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200W+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16+ inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual temperature rise depends on ambient room temperature and insulation. Always use a thermostat regulator.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use an infrared thermometer gun to measure actual basking surface temperature, not air temperature, for the most accurate gradient assessment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a thermostat or dimmer switch to regulate heat lamp output and prevent temperature fluctuations caused by bulb aging or room temperature changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create multiple basking zones at different distances from the heat source so your reptile can move to find their preferred thermal refuge.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Replace basking bulbs every 6-12 months even if they appear functional, as output degrades invisibly and can shift your gradient by 5-10°F (3-6°C).</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Room Temperature Fluctuations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for seasonal or daily ambient temperature changes can cause your gradient to shift 10-15°F (6-8°C), disrupting your reptile's thermoregulation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using a Single Heat Source for Large Enclosures</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">One lamp cannot create an even gradient in tanks &gt;75 gallons; use multiple lamps or ceramic heat panels to avoid hot spots and cold zones.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Placing the Cool Zone Next to Direct Sunlight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Windows and direct sunlight can unintentionally heat the cool zone by 10-20°F (6-11°C), eliminating your intended thermal gradient.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Monitor Temperature Daily</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Heat bulbs degrade, dimmers drift, and room conditions change—skipping daily checks means your reptile may experience unsafe temperatures for days undetected.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature range should my bearded dragon's basking spot be?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bearded dragons require a basking spot of 95-110°F (35-43°C). The cooler side of the enclosure should be 75-85°F (24-29°C) to create a proper thermal gradient.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct temperature gradient for my reptile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator measures the difference between your basking zone and cool zone temperatures. A typical gradient is 20-30°F (11-17°C) difference, allowing your pet to thermoregulate naturally.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What species need the steepest temperature gradients?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Desert species like leopard geckos and corn snakes need gradients of 25-35°F (14-19°C), while tropical species like ball pythons prefer gentler 15-20°F (8-11°C) gradients.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use regular heat lamps for basking temperatures?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but use ceramic heat emitters or UVA/UVB basking bulbs rated for your enclosure size. Always monitor actual temperatures with a digital thermometer, not the bulb's stated wattage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check and adjust basking temperatures?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check temperatures daily using an infrared thermometer or temperature gun. Seasonal changes, bulb aging, and thermostat drift can shift gradients by 5-10°F (3-6°C) monthly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my reptile's gradient is too shallow?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">An insufficient gradient (&lt;15°F difference) prevents proper thermoregulation, leading to poor digestion, reduced activity, and compromised immune function in your pet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do nocturnal reptiles need basking temperatures at night?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most nocturnal species like ball pythons need daytime basking of 88-92°F (31-33°C) and a 10-15°F (6-8°C) drop at night, mimicking natural temperature cycles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3116416/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Thermoregulation in Reptiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on how reptiles use thermal gradients for digestion, immune function, and metabolism.</p>
          </li>
          <li>
            <a href="https://www.reptilesmagazine.com/bearded-dragon-setup/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bearded Dragon Care Sheet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to bearded dragon temperature, lighting, and gradient requirements from Reptiles Magazine.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Guidelines for Reptile Husbandry</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Association of American Feed Control Officials standards for safe reptile environment parameters and temperature zones.</p>
          </li>
          <li>
            <a href="https://www.kingsnake.com/heating/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Optimal Temperature Gradients for Common Pet Snakes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed species-by-species breakdown of snake thermoregulation needs and safe gradient recommendations from Kingsnake.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basking Temperature & Gradient Planner"
      description="Plan the ideal basking spot temperature and the necessary temperature gradient for a reptile enclosure."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Temperature Gradient = Basking Spot Temperature − Ambient Temperature",
        variables: [
          { symbol: "Temperature Gradient", description: "Difference between basking spot and ambient enclosure temperatures" },
          { symbol: "Basking Spot Temperature", description: "Desired temperature at the basking area (°F or °C)" },
          { symbol: "Ambient Temperature", description: "Temperature of the cooler enclosure area (°F or °C)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon requires a basking spot temperature of 100°F and an ambient enclosure temperature of 80°F. The owner wants to ensure the enclosure has a proper temperature gradient.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the basking spot temperature as 100°F and the ambient temperature as 80°F into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the temperature gradient: 100°F − 80°F = 20°F, which is within the recommended range for bearded dragons.",
          },
          {
            label: "3",
            explanation:
              "Adjust heating elements in the enclosure to maintain this gradient, ensuring the reptile can thermoregulate effectively.",
          },
        ],
        result: "The calculated temperature gradient is 20°F, indicating a healthy thermal environment for the reptile.",
      }}
      relatedCalculators={[
        { title: "Horse Salt & Mineral Balance Checker", url: "/pets/horse-salt-mineral-balance-checker", icon: "🐎" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Ideal Weight & Target Calories for Cats", url: "/pets/cat-ideal-weight-target-calories", icon: "🐱" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Dog Grape/Raisin Exposure Risk Calculator", url: "/pets/dog-grape-raisin-exposure-risk", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Basking Temperature & Gradient Planner" },
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