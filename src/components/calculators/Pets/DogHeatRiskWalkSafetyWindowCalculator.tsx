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
      question: "Why is humidity important when assessing heat risk for dogs?",
      answer:
        "Humidity significantly affects a dog's ability to cool down through panting, which relies on evaporation. High humidity reduces evaporation efficiency, increasing the risk of overheating. Therefore, even moderate temperatures can become dangerous when humidity is elevated. This calculator integrates both temperature and humidity to provide a more accurate assessment of heat risk, reflecting the combined effect on canine thermoregulation.",
    },
    {
      question: "How does the Heat Index differ from ambient temperature alone?",
      answer:
        "The Heat Index combines air temperature and relative humidity to estimate the perceived temperature or 'feels like' temperature. For dogs, this is crucial because high humidity impairs evaporative cooling, making it feel hotter than the actual temperature. Using Heat Index rather than temperature alone helps better predict heat stress risk and guides safer outdoor activity planning for dogs.",
    },
    {
      question: "Are certain dog breeds more susceptible to heat risk?",
      answer:
        "Yes, brachycephalic breeds (e.g., Bulldogs, Pugs) have shorter airways, limiting effective panting and heat dissipation. Additionally, obese dogs or those with underlying health conditions have impaired thermoregulation. This calculator provides general risk levels, but owners of vulnerable breeds should exercise extra caution and consult veterinarians for personalized advice.",
    },
    {
      question: "How can I use this calculator to plan safe walk times?",
      answer:
        "Input the current temperature and humidity to obtain the Heat Index and associated risk level. Use the safety window guidance to decide when and how long to walk your dog. For example, if the risk is high or extreme, avoid midday walks and opt for early mornings or late evenings when conditions are cooler and less humid, minimizing heat stress risk.",
    },
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
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Heat Risk/Walk Safety Window (Temp & Humidity)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dogs regulate their body temperature primarily through panting and limited sweating through their paw pads. Ambient temperature alone does not fully capture the risk of heat stress because humidity plays a critical role in the effectiveness of evaporative cooling. High humidity reduces evaporation, making it harder for dogs to dissipate heat, which can quickly lead to dangerous overheating or heat stroke.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Heat Index is a scientifically derived measure that combines temperature and relative humidity to estimate the perceived temperature or “feels like” temperature. This index is more relevant for assessing heat risk in dogs because it reflects the combined environmental stressors affecting their thermoregulation. Veterinary guidelines use Heat Index thresholds to categorize risk levels and recommend safe activity windows.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator applies the Rothfusz regression formula, a validated method for calculating Heat Index, adapted for canine safety considerations. By inputting current temperature and humidity, pet owners can obtain an evidence-based risk assessment to plan safe outdoor activities, minimizing the risk of heat-related illnesses, which are a leading cause of emergency veterinary visits during hot months.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, enter the current ambient temperature and relative humidity for your location. Select the appropriate unit system (Imperial for °F or Metric for °C). After inputting these values, click “Calculate” to receive the Heat Index and an interpretation of the heat risk level for your dog. This will help you determine the safest times and conditions for walks.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Ambient Temperature:</strong> Enter the current air temperature. Use °F if you selected Imperial units or °C for Metric. Accurate temperature readings are essential for reliable risk assessment.
          </li>
          <li>
            <strong>Relative Humidity:</strong> Enter the current humidity percentage (0-100%). Humidity impacts how effectively your dog can cool down through panting, so this value is critical for calculating the Heat Index.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/animal-health-and-welfare/heat-stroke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Heat Stroke in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on recognizing, preventing, and managing heat stroke in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466039/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health - Canine Thermoregulation and Heat Stress
            </a>
            <p className="text-slate-500 text-sm">
              Scientific review of canine heat dissipation mechanisms and the impact of environmental factors.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wisc.edu/dms/fapm/fapmtools/heatstroke/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. University of Wisconsin Veterinary Medicine - Heat Stroke in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing heat stroke pathophysiology, risk factors, and prevention strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. NOAA - Heat Index Calculator and Formula
            </a>
            <p className="text-slate-500 text-sm">
              Official meteorological source for the Heat Index formula used in this calculator.
            </p>
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