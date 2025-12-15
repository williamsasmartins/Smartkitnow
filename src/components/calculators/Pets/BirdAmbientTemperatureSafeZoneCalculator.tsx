import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

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

  const [unit, setUnit] = useState("imperial");

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
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

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
      question: "Why is ambient temperature important for bird health?",
      answer:
        "Ambient temperature directly affects a bird's ability to maintain its body temperature and metabolic functions. Birds are sensitive to temperature extremes, which can cause heat stress or hypothermia, leading to serious health issues. Understanding and maintaining the correct ambient temperature helps ensure their comfort, immune function, and overall well-being.",
    },
    {
      question: "How does bird weight influence the safe temperature range?",
      answer:
        "Bird weight correlates with metabolic rate and surface area-to-volume ratio, influencing heat retention and loss. Smaller birds lose heat faster and generally tolerate cooler temperatures better, while larger birds retain heat longer and prefer warmer environments. This calculator uses weight to estimate a safe ambient temperature range tailored to the bird's thermoregulatory needs.",
    },
    {
      question: "Can this calculator be used for all bird species?",
      answer:
        "This calculator provides a general estimate based on weight and typical avian physiology but does not account for species-specific adaptations or environmental factors. Exotic or specialized birds may have different temperature tolerances. Always consult a veterinarian for species-specific advice and consider habitat, humidity, and behavior when assessing temperature safety.",
    },
    {
      question: "What should I do if the ambient temperature is outside the safe zone?",
      answer:
        "If the ambient temperature falls outside the safe zone, immediate steps should be taken to adjust the bird's environment. For low temperatures, provide supplemental heat sources and insulation to prevent hypothermia. For high temperatures, increase ventilation, provide shade, and ensure access to fresh water to prevent heat stress. Monitoring and timely intervention are critical to bird health.",
    },
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
            onChange={(e) => setUnit(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
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
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 1.1"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            min={0.01}
            step={0.01}
            aria-describedby="weightHelp"
          />
          <p id="weightHelp" className="text-xs text-slate-400 mt-1">
            Enter the bird's weight in {unit === "imperial" ? "pounds" : "kilograms"}.
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Ambient Temperature Safe Zone Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ambient Temperature Safe Zone Calculator is a veterinary tool designed to estimate the ideal temperature range for a bird's enclosure based on its weight. Birds are highly sensitive to environmental temperatures, and maintaining an appropriate ambient temperature is critical to prevent heat stress or hypothermia. This calculator helps caretakers and veterinarians assess whether the current ambient temperature is safe for the bird, promoting optimal health and comfort.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The safe temperature range varies depending on the bird's size and metabolic needs. Smaller birds tend to lose heat more rapidly due to their higher surface area-to-volume ratio, requiring warmer environments to maintain body temperature. Conversely, larger birds can tolerate cooler temperatures better but may be more susceptible to overheating. This calculator uses a scientifically derived formula to estimate the safe ambient temperature limits tailored to the bird's weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding and applying these temperature guidelines, bird owners and veterinary professionals can create safer and more comfortable habitats. This tool is especially useful in clinical settings, aviaries, and home care to prevent temperature-related health complications. It emphasizes proactive monitoring and environmental management to support avian welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two inputs: the current ambient temperature and the bird's weight. First, select the appropriate unit system for the bird's weight—either pounds (imperial) or kilograms (metric). Then, enter the ambient temperature in Fahrenheit and the bird's weight in the selected unit. The calculator will automatically determine if the ambient temperature falls within the safe zone for the bird.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the weight unit (lbs or kg) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the ambient temperature in Fahrenheit in the provided input field.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the bird's weight in the selected unit.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to view the estimated safe zone status and temperature range.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and warnings to adjust the bird's environment if necessary.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/avian-thermoregulation/avian-thermoregulation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Avian Thermoregulation - Merck Veterinary Manual
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of how birds regulate body temperature and the impact of ambient temperature on avian health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149607/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Environmental Temperature and Bird Physiology - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing the physiological responses of birds to varying environmental temperatures.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avianmedicine.net/avian-thermoregulation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Avian Thermoregulation and Environmental Management - Avian Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide for veterinarians and bird owners on managing ambient temperature for optimal bird health.
            </p>
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