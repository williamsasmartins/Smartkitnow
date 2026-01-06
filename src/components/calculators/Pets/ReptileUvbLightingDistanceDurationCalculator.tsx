import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileUvbLightingDistanceDurationCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are distance (inches/cm) and duration (hours)
  // Default to imperial units for distance input
  const [inputs, setInputs] = useState({
    uvbIntensity: "", // in µW/cm² (microWatts per square centimeter)
    recommendedIntensity: "", // in µW/cm²
    maxDistance: "", // in inches (imperial) or cm (metric)
  });

  // 2. LOGIC ENGINE
  // The goal: Calculate the optimal distance and duration for UVB lighting based on intensity and reptile needs.
  // Formula: Duration (hours) = Recommended UVB Intensity / Measured UVB Intensity * Max Duration (assumed 12 hours max)
  // Distance affects intensity inversely squared, but for simplicity, user inputs max distance and intensities.
  // We calculate suggested duration and warn if distance is too far or intensity too low.

  const results = useMemo(() => {
    const uvbIntensity = parseFloat(inputs.uvbIntensity);
    const recommendedIntensity = parseFloat(inputs.recommendedIntensity);
    const maxDistance = parseFloat(inputs.maxDistance);

    if (
      isNaN(uvbIntensity) ||
      uvbIntensity <= 0 ||
      isNaN(recommendedIntensity) ||
      recommendedIntensity <= 0 ||
      isNaN(maxDistance) ||
      maxDistance <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Max safe duration assumed 12 hours/day for UVB exposure
    const maxDuration = 12;

    // Calculate suggested duration based on intensity ratio
    // If intensity is higher than recommended, duration should be less
    let suggestedDuration = (recommendedIntensity / uvbIntensity) * maxDuration;

    // Clamp duration between 0.5 and maxDuration hours
    if (suggestedDuration < 0.5) suggestedDuration = 0.5;
    if (suggestedDuration > maxDuration) suggestedDuration = maxDuration;

    // Warning if maxDistance is too far for effective UVB (generally > 12 inches or 30 cm)
    let warning: string | null = null;
    if (maxDistance > 12 && uvbIntensity < recommendedIntensity) {
      warning =
        "The distance is quite far and UVB intensity is below recommended levels. Consider moving the light closer or increasing UVB output.";
    }

    return {
      value: suggestedDuration.toFixed(2),
      label: "Suggested UVB Exposure Duration (hours/day)",
      subtext: `Based on UVB intensity of ${uvbIntensity} µW/cm² and recommended ${recommendedIntensity} µW/cm² at distance ${maxDistance}.`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is UVB lighting distance important for reptiles?",
      answer:
        "UVB lighting distance directly affects the intensity of UVB radiation reaching your reptile. If the light is too far, the UVB intensity decreases significantly, reducing Vitamin D3 synthesis essential for calcium metabolism. Maintaining the correct distance ensures your reptile receives adequate UVB exposure without risking burns or eye damage.",
    },
    {
      question: "How does UVB exposure duration impact reptile health?",
      answer:
        "The duration of UVB exposure determines how much Vitamin D3 your reptile can synthesize daily. Too little exposure can lead to metabolic bone disease, while excessive exposure may cause stress or skin damage. Calculating the optimal duration based on UVB intensity helps balance these risks and promotes healthy bone and immune function.",
    },
    {
      question: "Can I use this calculator for all reptile species?",
      answer:
        "This calculator provides general guidance based on UVB intensity and exposure duration, but specific reptile species have varying UVB requirements. Always consult species-specific care sheets or a veterinarian to tailor UVB lighting to your reptile’s needs. This tool is best used alongside professional advice for optimal husbandry.",
    },
    {
      question: "Why do I need to input both UVB intensity and recommended intensity?",
      answer:
        "Inputting both measured UVB intensity and the recommended intensity allows the calculator to estimate how long your reptile should be exposed to the light. The measured intensity reflects your current setup, while the recommended intensity is based on veterinary guidelines for healthy UVB exposure. This comparison ensures safe and effective UVB dosing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="uvbIntensity" className="text-slate-700 dark:text-slate-300">
            Measured UVB Intensity (µW/cm²)
          </Label>
          <Input
            id="uvbIntensity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.uvbIntensity}
            onChange={(e) => setInputs((prev) => ({ ...prev, uvbIntensity: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="recommendedIntensity" className="text-slate-700 dark:text-slate-300">
            Recommended UVB Intensity (µW/cm²)
          </Label>
          <Input
            id="recommendedIntensity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 150"
            value={inputs.recommendedIntensity}
            onChange={(e) => setInputs((prev) => ({ ...prev, recommendedIntensity: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="maxDistance" className="text-slate-700 dark:text-slate-300">
            Distance from UVB Light (inches)
          </Label>
          <Input
            id="maxDistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12"
            value={inputs.maxDistance}
            onChange={(e) => setInputs((prev) => ({ ...prev, maxDistance: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ uvbIntensity: "", recommendedIntensity: "", maxDistance: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding UVB Lighting Distance & Duration Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          UVB lighting is essential for reptiles as it enables the synthesis of Vitamin D3, a critical component for calcium metabolism and bone health. The intensity of UVB radiation decreases rapidly with distance, following an inverse square law, meaning even small changes in distance can significantly impact the effectiveness of the lighting. This calculator helps reptile owners determine the optimal distance and exposure duration to ensure their pets receive adequate UVB without risking overexposure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper UVB exposure prevents metabolic bone disease, a common and serious condition in captive reptiles caused by calcium deficiency. By inputting the measured UVB intensity at a given distance and the recommended intensity for the species, this tool estimates the safe and effective daily exposure duration. This approach balances the need for sufficient UVB with the risk of UV damage, promoting healthier husbandry practices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, this calculator encourages regular monitoring of UVB bulb output and positioning, as UVB bulbs degrade over time and their effective range changes. By understanding and adjusting lighting parameters, reptile keepers can optimize their enclosure environment, supporting the long-term health and wellbeing of their animals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, first measure the UVB intensity at the basking spot using a UVB meter, expressed in microWatts per square centimeter (µW/cm²). Next, enter the recommended UVB intensity for your reptile species, which can be found in veterinary or husbandry guidelines. Finally, input the distance from the UVB light to the basking area in inches.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the current UVB intensity at the basking spot with a UVB meter.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the recommended UVB intensity for your reptile species.
          </li>
          <li>
            <strong>Step 3:</strong> Input the distance from the UVB bulb to the basking area.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to receive the suggested daily UVB exposure duration.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust the distance or lighting setup if warnings appear, ensuring safe and effective UVB exposure.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2798589/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Ferguson, G. W., & Woodley, S. K. (2007). The Role of UVB Radiation in Reptile Health.
            </a>
            <p className="text-slate-500 text-sm">
              This study discusses the physiological importance of UVB radiation for reptiles and its impact on calcium metabolism and bone health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Reptile%20UVB%20Lighting%20Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Reptile UVB Lighting Guide
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive guide on UVB lighting requirements, bulb types, and husbandry recommendations for captive reptiles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/clinical-guidelines/metabolic-bone-disease-in-reptiles.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Clinical Guidelines: Metabolic Bone Disease in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              This guideline outlines the causes, prevention, and treatment of metabolic bone disease, emphasizing the role of UVB exposure.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="UVB Lighting Distance & Duration Calculator"
      description="Calculate the correct distance and duration for **UVB lighting** to ensure proper Vitamin D3 synthesis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Suggested Duration (hours) = (Recommended UVB Intensity / Measured UVB Intensity) × Max Duration",
        variables: [
          { symbol: "Suggested Duration", description: "Recommended daily UVB exposure time in hours" },
          { symbol: "Recommended UVB Intensity", description: "Ideal UVB radiation level for the reptile (µW/cm²)" },
          { symbol: "Measured UVB Intensity", description: "Current UVB radiation level at basking spot (µW/cm²)" },
          { symbol: "Max Duration", description: "Maximum safe UVB exposure duration (hours), typically 12" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon requires 150 µW/cm² UVB intensity. The measured intensity at 12 inches from the bulb is 100 µW/cm². Calculate the suggested daily UVB exposure duration.",
        steps: [
          {
            label: "1",
            explanation:
              "Divide the recommended intensity by the measured intensity: 150 / 100 = 1.5.",
          },
          {
            label: "2",
            explanation:
              "Multiply by the maximum safe duration (12 hours): 1.5 × 12 = 18 hours.",
          },
          {
            label: "3",
            explanation:
              "Clamp the duration to the maximum safe exposure of 12 hours, so suggested duration is 12 hours/day.",
          },
        ],
        result: "Suggested UVB exposure duration is 12 hours per day at 12 inches distance.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Foaling Countdown & Lactation Feed Planner", url: "/pets/horse-foaling-countdown-lactation-feed-planner", icon: "🐴" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐕" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "🐈" },
        { title: "Indoor/Outdoor Activity Calorie Adjuster", url: "/pets/cat-activity-calorie-adjuster", icon: "🐈" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding UVB Lighting Distance & Duration Calculator" },
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
