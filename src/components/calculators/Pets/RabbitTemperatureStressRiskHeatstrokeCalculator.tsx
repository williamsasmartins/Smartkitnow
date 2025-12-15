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
      question: "Why are rabbits particularly vulnerable to heatstroke?",
      answer:
        "Rabbits have a limited ability to sweat and primarily regulate their body temperature through their ears. In hot and humid conditions, this cooling mechanism becomes less effective, increasing their risk of overheating. Understanding this vulnerability helps owners take preventive measures to protect their pets during warm weather.",
    },
    {
      question: "How does humidity affect the risk of heatstroke in rabbits?",
      answer:
        "High humidity reduces the evaporation of moisture from a rabbit’s body, impairing its natural cooling process. When humidity is elevated, even moderate temperatures can become dangerous because the rabbit cannot dissipate heat efficiently. This is why both temperature and humidity must be considered together when assessing heatstroke risk.",
    },
    {
      question: "What are the early signs of heatstroke in rabbits?",
      answer:
        "Early signs include rapid breathing, lethargy, drooling, and weakness. Rabbits may also exhibit a lack of appetite and seek cooler areas. Recognizing these symptoms promptly is critical to prevent progression to severe heatstroke, which can be fatal without immediate veterinary intervention.",
    },
    {
      question: "How can I effectively prevent heatstroke in my rabbit during hot weather?",
      answer:
        "Prevention involves providing a cool, shaded environment with plenty of fresh water and good ventilation. Avoid exposing rabbits to direct sunlight and high humidity for extended periods. Additionally, using cooling mats or frozen water bottles wrapped in towels can help maintain a safe body temperature during heat waves.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Temperature Stress Risk (Rabbit Heatstroke)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Rabbits are highly susceptible to temperature stress due to their unique physiology and limited ability to dissipate heat. Unlike many mammals, rabbits do not sweat and rely heavily on their ears for thermoregulation. When ambient temperatures rise, especially combined with high humidity, their natural cooling mechanisms become overwhelmed, increasing the risk of heatstroke, a potentially fatal condition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heatstroke in rabbits occurs when their core body temperature exceeds safe limits, leading to cellular damage, organ failure, and in severe cases, death. Environmental factors such as temperature and humidity interact synergistically to elevate this risk, making it essential to assess both parameters together. This calculator estimates the risk level by combining these factors into a simple score, helping owners and veterinarians make informed decisions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and monitoring temperature stress risk is critical for rabbit welfare, especially in warmer climates or during heat waves. Early recognition and prevention can save lives by prompting timely interventions such as providing shade, hydration, and cooling measures. This tool empowers caretakers with actionable insights to protect their rabbits from heat-related illnesses.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the risk of heatstroke in rabbits based on two key environmental inputs: ambient temperature and relative humidity. Select your preferred unit system (Imperial or Metric) to enter the temperature, then input the current humidity percentage. The tool will compute a risk score and categorize the risk level to guide your preventive actions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system for temperature input (°F or °C) using the dropdown selector.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the current ambient temperature in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the relative humidity percentage (0-100%).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the estimated heatstroke risk score and category.
          </li>
          <li>
            <strong>Step 5:</strong> Follow any warnings or recommendations provided to protect your rabbit.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/heatstroke-in-rabbits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Heatstroke in Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of heatstroke pathophysiology, clinical signs, and treatment in rabbits.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7070511/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Center for Biotechnology Information (NCBI): Thermoregulation in Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study on rabbit thermoregulation mechanisms and environmental stress responses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/rabbit-heat-stress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell University College of Veterinary Medicine: Rabbit Heat Stress
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidelines for prevention and management of heat stress in domestic rabbits.
            </p>
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