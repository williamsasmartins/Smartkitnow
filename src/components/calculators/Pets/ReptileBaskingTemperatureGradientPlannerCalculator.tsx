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
      question: "Why is maintaining a temperature gradient important for reptiles?",
      answer:
        "Reptiles rely on external heat sources to regulate their body temperature, a process called thermoregulation. A proper temperature gradient allows them to move between warmer and cooler areas within their enclosure, enabling optimal physiological functioning. Without this gradient, reptiles can suffer from stress, poor digestion, and weakened immune responses.",
    },
    {
      question: "How do I determine the ideal basking temperature for my reptile?",
      answer:
        "The ideal basking temperature depends on the species, age, and health of your reptile. Researching species-specific temperature ranges from trusted veterinary or herpetological sources is essential. This calculator helps you plan the basking spot temperature and gradient based on those recommended values to create a safe and effective environment.",
    },
    {
      question: "Can I use Celsius and Fahrenheit interchangeably in this planner?",
      answer:
        "Yes, this planner supports both Celsius and Fahrenheit units for temperature inputs. However, it is important to be consistent with the unit system you choose to avoid calculation errors. Switching between units will update the labels and results accordingly, ensuring clarity and accuracy in your basking temperature planning.",
    },
    {
      question: "What risks are associated with incorrect basking temperatures?",
      answer:
        "Incorrect basking temperatures can lead to serious health issues such as metabolic bone disease, respiratory infections, and impaired digestion. Too low temperatures prevent proper digestion and immune function, while excessively high temperatures can cause burns or heat stress. Maintaining the correct basking temperature and gradient is critical for your reptile’s overall well-being.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Basking Temperature & Gradient Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Reptiles are ectothermic animals, meaning they depend on external heat sources to regulate their body temperature. The basking temperature is the warmest area within their enclosure where they can absorb heat to support essential physiological processes such as digestion, immune function, and metabolism. Equally important is the temperature gradient, which is the difference between the basking spot and the cooler ambient environment, allowing reptiles to thermoregulate by moving between zones.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A well-planned basking temperature and gradient ensure that reptiles can maintain optimal body temperatures without overheating or becoming too cold. This gradient mimics natural conditions where reptiles bask in sunlight and retreat to shaded areas as needed. Without an appropriate gradient, reptiles may experience stress, reduced appetite, and increased susceptibility to illness, making temperature planning critical for their health and welfare.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This planner helps reptile owners and veterinarians design an enclosure environment that meets species-specific thermal needs. By inputting desired basking and ambient temperatures, users can calculate the temperature gradient necessary to create a safe and effective habitat. This tool supports evidence-based husbandry practices that promote longevity and well-being in captive reptiles.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, first select the temperature unit system you prefer: Fahrenheit (°F) or Celsius (°C). Enter the desired basking spot temperature based on your reptile species’ recommended range, then input the ambient enclosure temperature. The calculator will compute the temperature gradient, which is the difference between these two values, indicating how much warmer the basking spot is compared to the rest of the enclosure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the temperature unit by clicking the toggle button (°F or °C).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the basking spot temperature your reptile requires, ensuring it is higher than the ambient temperature.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the ambient temperature inside the enclosure, representing the cooler area.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the temperature gradient, which helps you verify if the enclosure setup meets your reptile’s thermoregulatory needs.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust temperatures as needed to maintain a healthy gradient, typically between 10-20°F (5-10°C) depending on species.
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
              1. UC Davis Veterinary Medicine – Reptile & Exotic Pet Care
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile husbandry, including temperature requirements and enclosure setup guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/reptile-exotic-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) – Reptile and Amphibian Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based clinical guidelines for reptile care, including environmental temperature management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159444/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information (NCBI) – Thermoregulation in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing the physiological importance of temperature gradients in reptile health.
            </p>
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