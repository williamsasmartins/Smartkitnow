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
      question: "Why is maintaining a thermal gradient important for reptiles?",
      answer:
        "Reptiles are ectothermic animals that rely on external heat sources to regulate their body temperature. Maintaining a thermal gradient within their enclosure allows them to thermoregulate effectively by moving between warmer and cooler areas. This gradient supports essential physiological processes such as digestion, immune function, and activity levels, promoting overall health and wellbeing.",
    },
    {
      question: "How does enclosure volume affect the power needed for heating?",
      answer:
        "The volume of the enclosure directly influences the amount of heat required to maintain a stable temperature gradient. Larger enclosures have more air volume and surface area, which increases heat loss to the environment. Therefore, more wattage is needed to compensate for this loss and sustain the desired temperatures, ensuring the reptile has access to appropriate thermal zones.",
    },
    {
      question: "Can I use this calculator for any reptile species?",
      answer:
        "This calculator provides a general estimate of heating power based on enclosure size and temperature difference, applicable to most reptiles. However, species-specific factors such as size, behavior, and preferred temperature ranges should be considered when selecting heat sources. Always consult species-specific care guidelines and a veterinarian for precise thermal requirements.",
    },
    {
      question: "Why does the calculator use a heat loss coefficient of 10 W/m³·°C?",
      answer:
        "The heat loss coefficient represents the rate of heat loss per cubic meter per degree Celsius difference and varies with enclosure insulation and materials. A value of 10 W/m³·°C is a commonly accepted average for typical reptile enclosures with moderate insulation. This coefficient helps estimate the wattage needed to overcome heat loss and maintain the desired thermal gradient effectively.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Thermal Gradient Maintenance Power Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Thermal gradient maintenance is a critical aspect of reptile husbandry, ensuring that reptiles can thermoregulate effectively within their enclosures. This estimator calculates the approximate wattage required from heat sources such as lamps or mats to maintain a stable temperature gradient between the warm and cool sides of the habitat. By considering enclosure volume and temperature differences, it provides a scientifically grounded estimate to optimize reptile comfort and health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The power estimation is based on the principle that heat loss from an enclosure is proportional to its volume and the temperature difference between inside and outside. This tool uses a standard heat loss coefficient to approximate the wattage needed to compensate for heat lost to the environment. Proper thermal gradients allow reptiles to regulate their body temperature, which is essential for metabolic processes, digestion, and immune function.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While this estimator provides a valuable baseline, individual reptile species and enclosure materials can affect heating requirements. Users should consider additional factors such as enclosure insulation, ambient room temperature fluctuations, and species-specific thermal preferences. Consulting with a veterinarian or reptile care specialist is recommended to tailor heating setups for optimal reptile welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate the power needed for maintaining a thermal gradient, input the reptile's weight, enclosure volume, ambient temperature, and desired warm side temperature. Select the appropriate unit system (imperial or metric) to match your measurements. The calculator will then compute the wattage required to sustain the temperature difference within the enclosure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your reptile's weight and enter it in pounds or kilograms.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate the internal volume of your enclosure in cubic feet or cubic meters and input this value.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the current ambient temperature surrounding the enclosure.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the desired temperature for the warm side of the thermal gradient.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the estimated wattage needed for heat sources.
          </li>
          <li>
            <strong>Step 6:</strong> Use the result to select appropriate heat lamps or mats, considering any warnings or recommendations.
          </li>
        </ul>
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-excellence/reptile-exotics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine - Reptile and Exotic Pet Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile physiology, husbandry, and clinical care, including thermal regulation principles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149291/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Heat Transfer and Thermal Regulation in Reptiles - NCBI PMC
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing heat transfer mechanisms and thermal gradient importance in reptile enclosures.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.reptilesmagazine.com/creating-thermal-gradients-for-reptiles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Creating Thermal Gradients for Reptiles - Reptiles Magazine
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide on establishing and maintaining thermal gradients in captive reptile habitats.
            </p>
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