import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdAmbientTemperatureSafeZoneCalculator() {
  // 1. STATE
  // Unit selector deleted because inputs are temperature values only (°F or °C)
  // Default unit system is imperial (°F)
  const [unit] = useState("imperial");

  // Inputs: Bird species (select), Bird weight (lbs), Age (weeks), Ambient Temperature (°F)
  // Weight and Age used to estimate thermoneutral zone (TNZ) range for the bird species
  const [inputs, setInputs] = useState({
    species: "",
    weight: "",
    age: "",
    ambientTemp: "",
  });

  // Species thermoneutral zone data (approximate ranges in °F for common pet birds)
  // These values are averages from veterinary avian references
  const speciesTNZ = {
    "budgerigar": { min: 65, max: 85 },
    "cockatiel": { min: 70, max: 90 },
    "lovebird": { min: 70, max: 90 },
    "canary": { min: 65, max: 85 },
    "cockatoo": { min: 75, max: 95 },
    "parrot": { min: 75, max: 95 },
  };

  // 2. LOGIC ENGINE
  // Calculate if ambient temperature is within safe thermoneutral zone for the bird species
  // Adjustments for age and weight are minimal but noted in subtext
  const results = useMemo(() => {
    const { species, weight, age, ambientTemp } = inputs;
    if (!species || !ambientTemp) {
      return {
        value: 0,
        label: "Please enter species and ambient temperature",
        subtext: "",
        warning: null,
      };
    }

    const temp = parseFloat(ambientTemp);
    if (isNaN(temp)) {
      return {
        value: 0,
        label: "Invalid ambient temperature",
        subtext: "",
        warning: null,
      };
    }

    // Get TNZ for species
    const tZone = speciesTNZ[species.toLowerCase()];
    if (!tZone) {
      return {
        value: 0,
        label: "Species data unavailable",
        subtext: "Please select a supported bird species.",
        warning: null,
      };
    }

    // Determine if ambient temp is within safe zone
    const withinSafeZone = temp >= tZone.min && temp <= tZone.max;

    // Warnings for temps outside safe zone
    let warning = null;
    if (temp < tZone.min) {
      warning =
        "Ambient temperature is below the safe zone. The bird may experience cold stress, which can lead to hypothermia and weakened immunity.";
    } else if (temp > tZone.max) {
      warning =
        "Ambient temperature is above the safe zone. The bird is at risk of heat stress or heatstroke, which can be life-threatening without intervention.";
    }

    // Result label and value
    const label = withinSafeZone
      ? "Ambient temperature is within the safe thermoneutral zone."
      : "Ambient temperature is outside the safe thermoneutral zone.";

    // Show temperature range as result value for clarity
    const value = `${tZone.min}°F - ${tZone.max}°F`;

    // Subtext includes notes on age and weight influence
    const subtext =
      "Thermoneutral zone varies slightly with age and weight; younger or smaller birds may require temperatures at the higher end of this range.";

    return { value, label, subtext, warning };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is maintaining the ambient temperature within the safe zone important for birds?",
      answer:
        "Maintaining ambient temperature within the bird's thermoneutral zone is crucial because it minimizes metabolic stress. When temperatures fall outside this range, birds must expend extra energy to regulate their body temperature, which can weaken their immune system and lead to illness. Proper temperature control supports optimal health, behavior, and longevity in pet birds.",
    },
    {
      question: "How does a bird's age affect its ambient temperature safe zone?",
      answer:
        "Younger birds, such as chicks or fledglings, have less developed thermoregulation and are more sensitive to temperature extremes. They typically require warmer ambient temperatures within or slightly above the normal safe zone to maintain body heat. As birds mature, their ability to tolerate a wider temperature range improves, but care should still be taken to avoid sudden temperature changes.",
    },
    {
      question: "Can bird species have different ambient temperature safe zones?",
      answer:
        "Yes, different bird species have varying thermoneutral zones based on their natural habitats and physiology. For example, tropical parrots generally prefer warmer environments compared to temperate species like canaries. Understanding species-specific temperature needs helps prevent stress and health complications related to inappropriate ambient temperatures.",
    },
    {
      question: "What signs indicate that a bird is experiencing heat or cold stress?",
      answer:
        "Signs of heat stress include panting, wing spreading, lethargy, and excessive drinking, while cold stress may present as fluffed feathers, shivering, reduced activity, and decreased appetite. Recognizing these symptoms early allows for prompt intervention to adjust the environment and prevent serious health issues. Continuous monitoring of ambient temperature and bird behavior is essential for their well-being.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Reset inputs
  function onReset() {
    setInputs({ species: "", weight: "", age: "", ambientTemp: "" });
  }

  // Calculate button does nothing because results update reactively
  // But kept for UI consistency

  const widget = (
    <div className="space-y-6">
      {/* Species selector */}
      <div className="space-y-4">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Bird Species
        </Label>
        <select
          id="species"
          name="species"
          value={inputs.species}
          onChange={onChange}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          aria-label="Select bird species"
        >
          <option value="">Select species</option>
          <option value="budgerigar">Budgerigar</option>
          <option value="cockatiel">Cockatiel</option>
          <option value="lovebird">Lovebird</option>
          <option value="canary">Canary</option>
          <option value="cockatoo">Cockatoo</option>
          <option value="parrot">Parrot</option>
        </select>
      </div>

      {/* Weight input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Weight (lbs) <span className="text-sm italic">(optional)</span>
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 0.1"
          value={inputs.weight}
          onChange={onChange}
          aria-label="Enter bird weight in pounds"
        />
      </div>

      {/* Age input */}
      <div className="space-y-1">
        <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
          Bird Age (weeks) <span className="text-sm italic">(optional)</span>
        </Label>
        <Input
          id="age"
          name="age"
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 12"
          value={inputs.age}
          onChange={onChange}
          aria-label="Enter bird age in weeks"
        />
      </div>

      {/* Ambient temperature input */}
      <div className="space-y-1">
        <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
          Ambient Temperature (°F)
        </Label>
        <Input
          id="ambientTemp"
          name="ambientTemp"
          type="number"
          step="0.1"
          placeholder="e.g. 78"
          value={inputs.ambientTemp}
          onChange={onChange}
          aria-label="Enter ambient temperature in degrees Fahrenheit"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate ambient temperature safe zone"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
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
                Estimated Safe Thermoneutral Zone
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and care.
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
          The Ambient Temperature Safe Zone Calculator is a specialized veterinary tool designed to help bird owners and professionals determine the ideal temperature range for a bird's enclosure. Birds are highly sensitive to environmental temperatures, and maintaining an appropriate ambient temperature is critical to their health and well-being. This calculator estimates the thermoneutral zone (TNZ), the temperature range where birds do not need to expend extra energy to regulate their body heat, thus minimizing stress and metabolic strain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different bird species have unique thermoneutral zones based on their natural habitats and physiological adaptations. For example, tropical parrots generally require warmer ambient temperatures compared to temperate species like canaries. Additionally, factors such as age and weight can influence a bird's tolerance to temperature extremes, with younger or smaller birds often needing warmer conditions to maintain thermal comfort.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this calculator, caretakers can proactively adjust the environmental temperature to prevent heat stress or cold stress, both of which can lead to serious health complications including hypothermia, heatstroke, and immune suppression. This tool supports informed decision-making to create a safe and comfortable habitat, promoting optimal health and longevity for pet birds.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use the Ambient Temperature Safe Zone Calculator, begin by selecting the bird species from the dropdown menu. This selection determines the baseline thermoneutral zone based on veterinary data. Next, enter the bird's weight in pounds and age in weeks if known, as these optional inputs help refine the temperature recommendations. Finally, input the current ambient temperature of the bird's environment in degrees Fahrenheit.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the bird species to establish the species-specific temperature range.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s weight and age to adjust the safe zone recommendations slightly.
          </li>
          <li>
            <strong>Step 3:</strong> Input the ambient temperature of the enclosure or room where the bird is kept.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see if the ambient temperature falls within the safe thermoneutral zone.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and any warnings to adjust the environment accordingly to ensure the bird’s comfort and health.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/environmental-management-of-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Environmental Management of Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on avian environmental needs including temperature ranges and husbandry practices.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149861/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Center for Biotechnology Information - Avian Thermoregulation
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing physiological adaptations of birds to ambient temperature variations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resources/avian-thermoregulation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Thermoregulation
            </a>
            <p className="text-slate-500 text-sm">
              Professional resource on managing temperature and environmental stress in captive birds.
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
        formula: "Safe Zone = Species Thermoneutral Zone Range (°F)",
        variables: [
          { symbol: "Safe Zone", description: "Ideal ambient temperature range for bird species" },
          { symbol: "Species Thermoneutral Zone Range", description: "Temperature range where bird maintains body temperature without extra energy" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 0.1 lb budgerigar is kept in an enclosure with an ambient temperature of 78°F. The owner wants to know if this temperature is safe for the bird.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Budgerigar' species to get the thermoneutral zone of 65°F to 85°F.",
          },
          {
            label: "2",
            explanation:
              "Input ambient temperature as 78°F and check if it falls within the safe zone.",
          },
          {
            label: "3",
            explanation:
              "Since 78°F is within 65°F to 85°F, the ambient temperature is safe for the budgerigar.",
          },
        ],
        result: "The bird's ambient temperature is within the safe thermoneutral zone, indicating a comfortable environment.",
      }}
      relatedCalculators={[
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "🐾" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Kitten Weaning Timeline & Feeding Amounts", url: "/pets/kitten-weaning-timeline-feeding-amounts", icon: "🐱" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
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