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
  // Default to imperial units internally for user familiarity
  const [inputs, setInputs] = useState({
    uvbIntensity: "", // μW/cm² measured at a given distance
    recommendedIntensity: "", // μW/cm² target for species
    currentDistance: "", // inches or cm (based on internal assumption imperial)
    maxDuration: "", // hours per day (optional)
  });

  // 2. LOGIC ENGINE
  // The main calculation estimates the ideal distance based on inverse square law:
  // Intensity ∝ 1 / distance²
  // So, Distance = CurrentDistance * sqrt(CurrentIntensity / RecommendedIntensity)
  // Also, duration can be adjusted based on intensity to avoid overexposure.

  const results = useMemo(() => {
    const uvbIntensity = parseFloat(inputs.uvbIntensity);
    const recommendedIntensity = parseFloat(inputs.recommendedIntensity);
    const currentDistance = parseFloat(inputs.currentDistance);
    const maxDuration = parseFloat(inputs.maxDuration);

    if (
      isNaN(uvbIntensity) ||
      uvbIntensity <= 0 ||
      isNaN(recommendedIntensity) ||
      recommendedIntensity <= 0 ||
      isNaN(currentDistance) ||
      currentDistance <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for intensity and distance.",
      };
    }

    // Calculate ideal distance using inverse square law
    // Distance_new = Distance_current * sqrt(Intensity_current / Intensity_recommended)
    const idealDistance = currentDistance * Math.sqrt(uvbIntensity / recommendedIntensity);

    // Calculate recommended duration adjustment if maxDuration provided
    // If intensity is higher than recommended, reduce duration proportionally
    let recommendedDuration = maxDuration;
    let warning = null;
    if (!isNaN(maxDuration) && maxDuration > 0) {
      if (uvbIntensity > recommendedIntensity) {
        recommendedDuration = (recommendedIntensity / uvbIntensity) * maxDuration;
        warning =
          "UVB intensity is higher than recommended; reduce exposure duration accordingly to prevent overexposure.";
      } else {
        recommendedDuration = maxDuration;
      }
    }

    return {
      value: idealDistance.toFixed(2),
      label: `Ideal Distance (${idealDistance < 12 ? "inches" : "cm"})`,
      subtext:
        !isNaN(maxDuration) && maxDuration > 0
          ? `Recommended Exposure Duration: ${recommendedDuration.toFixed(2)} hours/day`
          : "Enter max exposure duration to get duration recommendation.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the distance of UVB lighting important for reptiles?",
      answer:
        "UVB lighting distance is critical because UVB intensity decreases exponentially as distance increases, following the inverse square law. If the light is too far, reptiles may not receive adequate UVB for Vitamin D3 synthesis, leading to metabolic bone disease. Conversely, too close can cause burns or eye damage, so precise distance ensures safe and effective exposure.",
    },
    {
      question: "How does UVB exposure duration affect reptile health?",
      answer:
        "Duration of UVB exposure must be balanced to provide sufficient Vitamin D3 synthesis without causing overexposure risks like skin damage or stress. Longer durations at low intensity may be safe, but high intensity requires shorter exposure times. This calculator helps adjust duration based on intensity to optimize reptile welfare.",
    },
    {
      question: "What is the inverse square law and how does it apply here?",
      answer:
        "The inverse square law states that UVB intensity decreases proportionally to the square of the distance from the source. This means doubling the distance reduces intensity to one-quarter. Understanding this helps calculate the ideal distance to achieve the recommended UVB intensity for reptiles safely.",
    },
    {
      question: "Can I use this calculator for all reptile species?",
      answer:
        "While this calculator provides general guidance, UVB requirements vary widely among reptile species depending on their natural habitat and behavior. Always consult species-specific veterinary references or a reptile specialist to determine the recommended UVB intensity and exposure duration for your pet. This tool complements but does not replace professional advice.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="uvbIntensity" className="text-slate-700 dark:text-slate-300">
            Measured UVB Intensity (μW/cm²)
          </Label>
          <Input
            id="uvbIntensity"
            name="uvbIntensity"
            type="text"
            placeholder="e.g. 100"
            value={inputs.uvbIntensity}
            onChange={onChange}
            aria-describedby="uvbIntensityHelp"
          />
          <p id="uvbIntensityHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the UVB intensity measured at your current lamp distance.
          </p>
        </div>

        <div>
          <Label htmlFor="recommendedIntensity" className="text-slate-700 dark:text-slate-300">
            Recommended UVB Intensity (μW/cm²)
          </Label>
          <Input
            id="recommendedIntensity"
            name="recommendedIntensity"
            type="text"
            placeholder="e.g. 75"
            value={inputs.recommendedIntensity}
            onChange={onChange}
            aria-describedby="recommendedIntensityHelp"
          />
          <p id="recommendedIntensityHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the target UVB intensity for your reptile species.
          </p>
        </div>

        <div>
          <Label htmlFor="currentDistance" className="text-slate-700 dark:text-slate-300">
            Current Lamp Distance (inches)
          </Label>
          <Input
            id="currentDistance"
            name="currentDistance"
            type="text"
            placeholder="e.g. 12"
            value={inputs.currentDistance}
            onChange={onChange}
            aria-describedby="currentDistanceHelp"
          />
          <p id="currentDistanceHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the distance from lamp to basking spot where intensity was measured.
          </p>
        </div>

        <div>
          <Label htmlFor="maxDuration" className="text-slate-700 dark:text-slate-300">
            Max Exposure Duration (hours/day, optional)
          </Label>
          <Input
            id="maxDuration"
            name="maxDuration"
            type="text"
            placeholder="e.g. 8"
            value={inputs.maxDuration}
            onChange={onChange}
            aria-describedby="maxDurationHelp"
          />
          <p id="maxDurationHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Optional: Enter maximum daily UVB exposure duration to get duration adjustment.
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
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ uvbIntensity: "", recommendedIntensity: "", currentDistance: "", maxDuration: "" })}
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
          Understanding UVB Lighting Distance & Duration Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          UVB lighting is essential for many reptiles to synthesize Vitamin D3, which is crucial for calcium metabolism and overall health. However, the intensity of UVB radiation diminishes rapidly with distance from the light source, governed by the inverse square law. This calculator helps reptile owners and veterinarians determine the optimal distance between the UVB lamp and the basking spot to ensure adequate exposure without risking under- or overexposure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the duration of UVB exposure plays a significant role in maintaining reptile health. Too little exposure can lead to deficiencies and metabolic bone disease, while excessive exposure may cause skin damage or stress. By inputting measured UVB intensity, recommended target intensity, and current lamp distance, this tool calculates the ideal distance and suggests appropriate exposure durations, promoting safe and effective husbandry practices.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to measure the UVB intensity at your reptile’s basking spot using a UVB meter. Then, enter this measured intensity, the recommended UVB intensity for your reptile species, and the current distance from the lamp to the basking spot. Optionally, include the maximum daily exposure duration you allow your reptile to receive.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the UVB intensity at the current basking distance using a UVB meter.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the measured intensity, recommended intensity for your reptile, and current lamp distance into the calculator.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, input the maximum daily exposure duration to receive a recommended adjusted duration.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the ideal lamp distance and suggested exposure duration to optimize UVB exposure safely.
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
              href="https://www.vetmed.ucdavis.edu/hospital/specialties/reptile-amphibian"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              1. UC Davis Veterinary Medicine: Reptile & Amphibian Specialty
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile husbandry, including UVB lighting recommendations and health management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.reptilesmagazine.com/uvb-lighting-for-reptiles/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Reptiles Magazine: UVB Lighting for Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Detailed article explaining UVB lighting principles, measurement, and best practices for reptile care.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466022/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              3. National Institutes of Health: UVB Exposure and Vitamin D3 Synthesis in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study on UVB exposure effects on reptile physiology and Vitamin D3 metabolism.
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
        formula: "Ideal Distance = Current Distance × √(Measured Intensity / Recommended Intensity)",
        variables: [
          { symbol: "Ideal Distance", description: "Optimal distance from UVB lamp to basking spot" },
          { symbol: "Current Distance", description: "Distance where intensity was measured" },
          { symbol: "Measured Intensity", description: "UVB intensity measured at current distance (μW/cm²)" },
          { symbol: "Recommended Intensity", description: "Target UVB intensity for species (μW/cm²)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon owner measures 100 μW/cm² UVB intensity at 12 inches from the lamp. The recommended intensity for the species is 75 μW/cm², and the owner allows 8 hours of daily UVB exposure.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate ideal distance: 12 × √(100 / 75) = 12 × 1.1547 ≈ 13.86 inches. This means the lamp should be moved to about 13.9 inches to achieve the recommended UVB intensity.",
          },
          {
            label: "2",
            explanation:
              "Adjust exposure duration since measured intensity is higher than recommended: 8 × (75 / 100) = 6 hours/day to avoid overexposure.",
          },
        ],
        result: "Ideal lamp distance is approximately 13.9 inches with a recommended exposure duration of 6 hours per day.",
      }}
      relatedCalculators={[
        { title: "Aquarium Salt Dosage Calculator (Therapeutic)", url: "/pets/aquarium-salt-dosage-therapeutic", icon: "🐾" },
        { title: "Fish Food Feeding Rate Calculator", url: "/pets/fish-food-feeding-rate", icon: "🐶" },
        { title: "Pond Volume & Liner Size Calculator", url: "/pets/pond-volume-liner-size", icon: "🐱" },
        { title: "Thermal Gradient Maintenance Power Estimator", url: "/pets/reptile-thermal-gradient-maintenance-power", icon: "🍖" },
        { title: "Electrolyte Powder Mixing Calculator", url: "/pets/horse-electrolyte-powder-mixing", icon: "💉" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "💧" },
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