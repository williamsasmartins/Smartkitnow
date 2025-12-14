import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileBaskingTemperatureGradientPlannerCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are temperature values in °F or °C (imperial default)
  const [inputs, setInputs] = useState({
    species: "",
    baskingTemp: "",
    ambientTemp: "",
  });

  // 2. LOGIC ENGINE
  // Calculate temperature gradient and validate inputs
  const results = useMemo(() => {
    const baskingTemp = parseFloat(inputs.baskingTemp);
    const ambientTemp = parseFloat(inputs.ambientTemp);

    if (
      isNaN(baskingTemp) ||
      isNaN(ambientTemp) ||
      baskingTemp <= ambientTemp ||
      baskingTemp < 70 ||
      ambientTemp < 50
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid temperatures. Basking temperature must be higher than ambient temperature. Typical ranges: Ambient ≥ 50°F, Basking ≥ 70°F.",
      };
    }

    const gradient = baskingTemp - ambientTemp;

    return {
      value: gradient.toFixed(1),
      label: "Temperature Gradient (°F)",
      subtext:
        "Difference between basking spot and ambient enclosure temperature.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is a temperature gradient important for reptiles?",
      answer:
        "Reptiles are ectothermic animals that rely on external heat sources to regulate their body temperature. A proper temperature gradient allows them to thermoregulate by moving between warmer basking spots and cooler areas within their enclosure. This gradient supports essential physiological processes such as digestion, immune function, and activity levels, promoting overall health and wellbeing.",
    },
    {
      question: "How do I determine the ideal basking temperature for my reptile?",
      answer:
        "The ideal basking temperature varies depending on the species, age, and health of the reptile. Researching species-specific husbandry guidelines or consulting a veterinarian can provide accurate temperature ranges. Providing a basking spot that mimics natural conditions ensures proper metabolism and prevents thermal stress or illness.",
    },
    {
      question: "What risks are associated with an improper temperature gradient?",
      answer:
        "An insufficient temperature gradient can prevent reptiles from effectively thermoregulating, leading to issues such as slowed digestion, weakened immune response, and behavioral stress. Conversely, excessively high basking temperatures can cause burns or overheating. Maintaining a balanced gradient is critical to avoid these health risks and ensure the reptile’s comfort.",
    },
    {
      question: "Can ambient temperature affect the basking spot temperature?",
      answer:
        "Yes, ambient temperature directly influences the basking spot temperature and the overall thermal environment of the enclosure. If ambient temperatures are too low, it may be difficult to achieve an adequate basking temperature without overheating the enclosure. Monitoring both temperatures helps maintain a safe and effective thermal gradient for your reptile.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setInputs({
      species: "",
      baskingTemp: "",
      ambientTemp: "",
    });
  }

  const widget = (
    <div className="space-y-6">
      {/* Species Input */}
      <div className="space-y-4">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Reptile Species (for reference)
        </Label>
        <Input
          id="species"
          name="species"
          type="text"
          placeholder="e.g., Bearded Dragon"
          value={inputs.species}
          onChange={handleInputChange}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Basking Temperature Input */}
      <div className="space-y-4">
        <Label
          htmlFor="baskingTemp"
          className="text-slate-700 dark:text-slate-300"
        >
          Desired Basking Temperature (°F)
        </Label>
        <Input
          id="baskingTemp"
          name="baskingTemp"
          type="number"
          min={70}
          max={150}
          step={0.1}
          placeholder="e.g., 105"
          value={inputs.baskingTemp}
          onChange={handleInputChange}
        />
      </div>

      {/* Ambient Temperature Input */}
      <div className="space-y-4">
        <Label
          htmlFor="ambientTemp"
          className="text-slate-700 dark:text-slate-300"
        >
          Ambient Enclosure Temperature (°F)
        </Label>
        <Input
          id="ambientTemp"
          name="ambientTemp"
          type="number"
          min={50}
          max={120}
          step={0.1}
          placeholder="e.g., 80"
          value={inputs.ambientTemp}
          onChange={handleInputChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for diagnosis and personalized husbandry advice.
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
          Reptiles depend heavily on their environment to regulate their body temperature because they are ectothermic animals. The basking temperature is the warmest spot in their enclosure where they can raise their body temperature to optimal levels for physiological functions such as digestion, immune response, and activity. Equally important is the temperature gradient, which is the difference between the basking spot and the cooler ambient temperature within the enclosure. This gradient allows reptiles to thermoregulate by moving between warmer and cooler areas as needed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Properly planning the basking temperature and gradient ensures that reptiles can maintain their ideal body temperature range, preventing thermal stress or illness. Without an adequate gradient, reptiles may be unable to cool down or warm up effectively, which can lead to health complications such as metabolic disorders or weakened immune systems. This planner helps reptile owners and veterinarians design enclosures that mimic natural thermal environments, promoting the animal’s welfare and longevity.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the temperature gradient between the basking spot and the ambient enclosure temperature for your reptile. Enter the species name for reference, then input the desired basking temperature and the ambient temperature inside the enclosure. The tool will calculate the difference, which is the temperature gradient essential for proper thermoregulation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your reptile species to keep track of the calculation context.
          </li>
          <li>
            <strong>Step 2:</strong> Input the desired basking temperature in degrees Fahrenheit (typically between 70°F and 150°F depending on species).
          </li>
          <li>
            <strong>Step 3:</strong> Input the ambient enclosure temperature in degrees Fahrenheit (usually between 50°F and 120°F).
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the temperature gradient, which should ideally be between 10°F and 30°F for most reptiles.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust your heating setup accordingly to maintain this gradient and ensure your reptile’s health.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-excellence/reptile-amphibian-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine - Reptile & Amphibian Service
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resources on reptile husbandry, including thermal
              requirements and environmental enrichment to promote health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/environmental-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Environmental Management for Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Detailed guidelines on temperature gradients, basking spots, and
              enclosure setup to optimize reptile health and welfare.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/reptile-care-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association - Reptile Care Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative recommendations on reptile husbandry practices,
              including temperature and humidity control for captive reptiles.
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
        formula: "Temperature Gradient = Basking Temperature − Ambient Temperature",
        variables: [
          { symbol: "Basking Temperature", description: "Temperature at the basking spot (°F)" },
          { symbol: "Ambient Temperature", description: "Temperature of the enclosure ambient area (°F)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon requires a basking temperature of 105°F and the ambient enclosure temperature is maintained at 80°F.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the basking temperature as 105°F and the ambient temperature as 80°F into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the temperature gradient by subtracting ambient from basking temperature: 105 − 80 = 25°F.",
          },
          {
            label: "3",
            explanation:
              "Confirm that the 25°F gradient falls within the recommended range for healthy thermoregulation.",
          },
        ],
        result:
          "The temperature gradient is 25°F, which is ideal for the bearded dragon to thermoregulate effectively within its enclosure.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "🐶",
        },
        {
          title: "Caffeine Toxicity Risk for Cats",
          url: "/pets/cat-caffeine-toxicity",
          icon: "🐱",
        },
        {
          title: "Meloxicam/Metacam Dose Calculator for Dogs",
          url: "/pets/dog-meloxicam-metacam-dose",
          icon: "🐶",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Cat Body Condition Score Helper (BCS → Target Plan)",
          url: "/pets/cat-body-condition-score-bcs-target",
          icon: "🐱",
        },
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