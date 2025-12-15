import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumSafeStockingDensityFishPerLitreCalculator() {
  // 1. STATE
  // Unit system is relevant because fish length input can be in cm or inches.
  const [unit, setUnit] = useState("imperial");

  // Inputs: number of fish, average fish length (cm or inches), tank volume (litres)
  const [inputs, setInputs] = useState({
    numberOfFish: "",
    avgFishLength: "",
    tankVolume: "",
  });

  // 2. LOGIC ENGINE
  // Formula for safe stocking density (Fish/cm per Litre):
  // Safe Stocking Density = (Number of Fish × Average Fish Length) / Tank Volume
  // This gives fish length per litre, which should not exceed recommended limits.
  // We'll calculate the stocking density and provide a warning if it exceeds 0.1 cm/Litre (a common conservative guideline).
  const results = useMemo(() => {
    const nFish = parseFloat(inputs.numberOfFish);
    let fishLength = parseFloat(inputs.avgFishLength);
    const volume = parseFloat(inputs.tankVolume);

    if (
      isNaN(nFish) ||
      isNaN(fishLength) ||
      isNaN(volume) ||
      nFish <= 0 ||
      fishLength <= 0 ||
      volume <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert fish length to cm if input is imperial (inches)
    if (unit === "imperial") {
      fishLength = fishLength * 2.54;
    }

    // Calculate stocking density (cm of fish per litre)
    const stockingDensity = (nFish * fishLength) / volume;

    // Round to 3 decimals for display
    const roundedDensity = Math.round(stockingDensity * 1000) / 1000;

    // Warning threshold (conservative): > 0.1 cm/Litre may cause stress and poor water quality
    const warning =
      roundedDensity > 0.1
        ? "Warning: Stocking density exceeds recommended safe limits, which can lead to stress, poor water quality, and increased disease risk."
        : null;

    return {
      value: roundedDensity,
      label: "Fish Length per Litre (cm/L)",
      subtext:
        "A value above 0.1 cm/L indicates potential overstocking. Maintain lower values for healthier aquatic environments.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is safe stocking density important for aquarium fish?",
      answer:
        "Safe stocking density is crucial to maintain optimal water quality and reduce stress among fish. Overstocking can lead to increased waste, depleted oxygen levels, and heightened disease susceptibility. By adhering to recommended stocking densities, aquarists ensure a healthier environment that promotes fish well-being and longevity.",
    },
    {
      question: "How does fish length affect the calculation of stocking density?",
      answer:
        "Fish length directly correlates with the space and resources each fish requires in an aquarium. Larger fish produce more waste and need more oxygen, so their length is used to estimate their environmental impact. Incorporating fish length into stocking density calculations helps create a balanced aquatic ecosystem tailored to the species’ size.",
    },
    {
      question: "Can I use this calculator for all types of fish species?",
      answer:
        "This calculator provides a general guideline based on fish length and tank volume, but species-specific behaviors and needs vary widely. Some fish are more territorial or produce more waste, requiring lower stocking densities. Always consider species-specific care requirements alongside this tool for best results.",
    },
    {
      question: "What should I do if my stocking density exceeds the recommended limit?",
      answer:
        "If your stocking density is too high, consider reducing the number of fish or upgrading to a larger tank to improve conditions. Increasing filtration and performing more frequent water changes can also help mitigate negative effects. Prioritizing fish health by maintaining safe stocking densities prevents stress and disease outbreaks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (inches)</SelectItem>
              <SelectItem value="metric">Metric (cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="numberOfFish" className="text-slate-700 dark:text-slate-300">
            Number of Fish
          </Label>
          <Input
            id="numberOfFish"
            name="numberOfFish"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={inputs.numberOfFish}
            onChange={handleInputChange}
            aria-describedby="numberOfFish-desc"
          />
          <p id="numberOfFish-desc" className="text-xs text-slate-400 mt-1">
            Enter the total number of fish in the aquarium.
          </p>
        </div>

        <div>
          <Label htmlFor="avgFishLength" className="text-slate-700 dark:text-slate-300">
            Average Fish Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="avgFishLength"
            name="avgFishLength"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 9"}
            value={inputs.avgFishLength}
            onChange={handleInputChange}
            aria-describedby="avgFishLength-desc"
          />
          <p id="avgFishLength-desc" className="text-xs text-slate-400 mt-1">
            Enter the average length of your fish.
          </p>
        </div>

        <div>
          <Label htmlFor="tankVolume" className="text-slate-700 dark:text-slate-300">
            Tank Volume (Litres)
          </Label>
          <Input
            id="tankVolume"
            name="tankVolume"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 100"
            value={inputs.tankVolume}
            onChange={handleInputChange}
            aria-describedby="tankVolume-desc"
          />
          <p id="tankVolume-desc" className="text-xs text-slate-400 mt-1">
            Enter the total volume of your aquarium in litres.
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
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numberOfFish: "", avgFishLength: "", tankVolume: "" })}
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
          Understanding Safe Stocking Density (Fish/cm per Litre)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Safe stocking density is a critical concept in aquarium management that refers to the optimal amount of fish length per litre of water. This metric helps aquarists avoid overcrowding, which can lead to poor water quality, increased stress, and susceptibility to diseases among fish. By calculating the total length of fish relative to the tank volume, hobbyists can maintain a balanced and healthy aquatic environment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Overstocking an aquarium disrupts the delicate ecosystem by increasing waste production and reducing oxygen availability, which negatively impacts fish health and behavior. Different species and sizes of fish have varying space and environmental needs, making it essential to consider average fish length in stocking calculations. This approach provides a more accurate and species-agnostic guideline compared to simply counting fish numbers.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining a safe stocking density not only promotes fish welfare but also simplifies tank maintenance by reducing the frequency of water changes and filtration strain. Aquarists should use this metric as a foundational guideline, complemented by species-specific knowledge and regular monitoring of water parameters. Ultimately, understanding and applying safe stocking density principles ensures a thriving and sustainable aquarium ecosystem.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the safe stocking density of your aquarium by calculating the total fish length per litre of tank water. To use it effectively, you will need to input the number of fish, the average length of your fish, and the total volume of your aquarium in litres. The calculator will then provide a value indicating whether your stocking density is within safe limits or if adjustments are necessary.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial for inches or Metric for centimeters) to match your fish length measurements.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total number of fish currently in your aquarium.
          </li>
          <li>
            <strong>Step 3:</strong> Input the average length of your fish according to the selected unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Provide the total volume of your aquarium in litres.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your stocking density and any warnings if the density exceeds recommended safe levels.
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
              href="https://www.aquaticcommunity.com/aquariumfish/safestockdensity.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Community - Safe Stocking Density Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              This resource provides detailed insights into calculating safe stocking densities for freshwater aquariums, emphasizing fish length and tank volume relationships.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-sciences/clinical-services/aquatic-animal-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine - Aquatic Animal Medicine
            </a>
            <p className="text-slate-500 text-sm">
              A veterinary perspective on aquatic animal health, including the importance of environmental factors such as stocking density in disease prevention and welfare.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fishvetgroup.com.au/fish-health-management/stocking-density"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Fish Vet Group - Stocking Density and Fish Health
            </a>
            <p className="text-slate-500 text-sm">
              This article discusses the impact of stocking density on fish health and growth, providing practical advice for aquarists and professionals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Stocking Density (Fish/cm per Litre)"
      description="Determine the safe number or length of fish that can be kept in a tank, preventing overstocking and stress."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Stocking Density = (Number of Fish × Average Fish Length) / Tank Volume",
        variables: [
          { symbol: "Number of Fish", description: "Total fish count in the aquarium" },
          { symbol: "Average Fish Length", description: "Mean length of fish in cm" },
          { symbol: "Tank Volume", description: "Total aquarium volume in litres" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarist has 15 fish with an average length of 5 cm in a 100-litre tank and wants to know if the stocking density is safe.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total fish length: 15 fish × 5 cm = 75 cm total fish length.",
          },
          {
            label: "2",
            explanation:
              "Divide total fish length by tank volume: 75 cm ÷ 100 litres = 0.75 cm/L.",
          },
          {
            label: "3",
            explanation:
              "Compare with recommended limit (0.1 cm/L). 0.75 cm/L exceeds safe stocking density, indicating overstocking.",
          },
        ],
        result:
          "The aquarist should reduce fish numbers or increase tank size to maintain a healthy environment.",
      }}
      relatedCalculators={[
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐶" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🍖" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Safe Stocking Density (Fish/cm per Litre)" },
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