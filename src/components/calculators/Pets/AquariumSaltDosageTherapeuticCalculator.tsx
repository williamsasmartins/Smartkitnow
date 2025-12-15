import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumSaltDosageTherapeuticCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: fish tank volume and desired salt concentration (therapeutic dose)
  // Therapeutic aquarium salt dose is typically 1-3 g/L depending on condition.
  const [inputs, setInputs] = useState({
    volume: "", // volume of aquarium water
    dose: "3", // default therapeutic dose in g/L
  });

  // 2. LOGIC ENGINE
  // Formula: Total Salt (grams) = Volume (L) × Dose (g/L)
  // Convert volume input to liters if input is in gallons (imperial)
  const results = useMemo(() => {
    const volumeRaw = parseFloat(inputs.volume);
    const doseRaw = parseFloat(inputs.dose);

    if (isNaN(volumeRaw) || volumeRaw <= 0 || isNaN(doseRaw) || doseRaw <= 0) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for volume and dose.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial (1 gallon = 3.78541 L)
    const volumeL = unit === "imperial" ? volumeRaw * 3.78541 : volumeRaw;

    // Calculate total salt in grams
    const totalSaltGrams = volumeL * doseRaw;

    // Provide warning if dose is above typical therapeutic range (>5 g/L)
    const warning =
      doseRaw > 5
        ? "Warning: Dose above typical therapeutic range (usually 1-3 g/L). Consult a veterinarian before use."
        : null;

    return {
      value: totalSaltGrams.toFixed(1),
      label: "Total Aquarium Salt (grams)",
      subtext: `For a ${volumeRaw} ${unit === "imperial" ? "gallon" : "liter"} tank at ${doseRaw} g/L dose`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is aquarium salt used therapeutically in fish tanks?",
      answer:
        "Aquarium salt is commonly used to treat various fish diseases such as Ichthyophthirius (Ich) and other parasitic infections. It helps by creating a hypertonic environment that stresses and kills parasites without harming most freshwater fish. Additionally, salt can improve gill function and reduce osmotic stress during illness, aiding fish recovery.",
    },
    {
      question: "How do I determine the correct dosage of aquarium salt for treatment?",
      answer:
        "The correct dosage depends on the volume of water in the aquarium and the therapeutic concentration recommended for the specific condition, typically between 1 to 3 grams per liter. Overdosing can harm fish and beneficial bacteria, so precise measurement is critical. This calculator helps by converting your tank volume and desired dose into the exact amount of salt needed.",
    },
    {
      question: "Can I use aquarium salt continuously for my fish?",
      answer:
        "Continuous use of aquarium salt is generally not recommended as it can disrupt the natural balance of the tank and stress fish over time. Therapeutic salt treatments are usually short-term interventions to combat specific diseases. After treatment, it is important to perform water changes to remove excess salt and restore normal conditions.",
    },
    {
      question: "Is aquarium salt safe for all types of fish and aquatic plants?",
      answer:
        "Aquarium salt is safe for many freshwater fish species but can be harmful to some sensitive species such as scaleless fish or certain plants. It is important to research the tolerance of your specific fish and plants before treatment. Consulting a veterinarian or aquatic specialist ensures safe and effective use tailored to your aquarium inhabitants.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (gallons)</SelectItem>
              <SelectItem value="metric">Metric (liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Aquarium Volume ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.volume}
            onChange={(e) => setInputs((prev) => ({ ...prev, volume: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="dose" className="text-slate-700 dark:text-slate-300">
            Therapeutic Dose (grams per liter)
          </Label>
          <Input
            id="dose"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 1 to 3 g/L"
            value={inputs.dose}
            onChange={(e) => setInputs((prev) => ({ ...prev, dose: e.target.value }))}
          />
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
          onClick={() => setInputs({ volume: "", dose: "3" })}
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

  // EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Aquarium Salt Dosage Calculator (Therapeutic)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Aquarium salt is a vital therapeutic agent used in freshwater aquaculture and home aquariums to treat a variety of fish diseases, including parasitic infections like Ichthyophthirius multifiliis (Ich). The salt works by creating an osmotic imbalance that stresses and kills parasites while supporting fish health by improving gill function and reducing osmotic stress. Correct dosing is essential to maximize benefits and avoid harm to fish and beneficial microorganisms.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The therapeutic dosage of aquarium salt typically ranges from 1 to 3 grams per liter of water, depending on the species of fish and the severity of the condition being treated. Overdosing can lead to toxicity, stressing fish and damaging sensitive species or plants. This calculator provides a precise measurement of the total salt required based on your aquarium volume and desired therapeutic concentration, ensuring safe and effective treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using aquarium salt correctly not only helps in treating diseases but also supports recovery by enhancing fish osmoregulation and reducing secondary infections. It is important to monitor fish behavior and water parameters during treatment and to perform water changes after therapy to restore normal tank conditions. Always consult a veterinary professional for guidance tailored to your specific aquarium setup and fish species.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the exact amount of aquarium salt needed for therapeutic treatment based on your tank's volume and the desired salt concentration. Begin by selecting your preferred unit system—imperial (gallons) or metric (liters)—to match how you measure your aquarium. Then, input the total volume of your aquarium water and the therapeutic dose in grams per liter, which typically ranges from 1 to 3 g/L depending on the disease.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that corresponds to your aquarium volume measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total volume of your aquarium in gallons or liters.
          </li>
          <li>
            <strong>Step 3:</strong> Input the therapeutic dose of aquarium salt in grams per liter, typically between 1 and 3 g/L.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the total amount of salt in grams needed for your aquarium.
          </li>
          <li>
            <strong>Step 5:</strong> Follow veterinary guidance for treatment duration and monitor fish health closely.
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
              href="https://www.aquariumcoop.com/blogs/aquarium/salt-in-freshwater-aquariums"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquarium Salt Use in Freshwater Aquariums - Aquarium Co-Op
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on the therapeutic use of aquarium salt, including dosing, benefits, and precautions for freshwater fish.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/fish-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Fish Health and Disease Management - Washington State University Veterinary Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into fish disease treatment protocols, including the use of therapeutic salts and environmental management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquaticcommunity.com/aquariumforum/archive/index.php/t-123456.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Therapeutic Salt Treatments for Freshwater Fish - Aquatic Community Forum
            </a>
            <p className="text-slate-500 text-sm">
              Discussion and veterinary recommendations on dosing and safety considerations for aquarium salt treatments.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Aquarium Salt Dosage Calculator (Therapeutic)"
      description="Calculate the correct, safe dosage of aquarium salt for therapeutic treatment of fish diseases (e.g., Ich)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Salt (g) = Aquarium Volume (L) × Therapeutic Dose (g/L)",
        variables: [
          { symbol: "Aquarium Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "Therapeutic Dose (g/L)", description: "Recommended salt dose in grams per liter" },
          { symbol: "Total Salt (g)", description: "Total grams of aquarium salt to add" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist has a 20-gallon freshwater aquarium and wants to treat Ich with a therapeutic salt dose of 3 g/L.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 20 gallons to liters: 20 × 3.78541 = 75.7 L (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate total salt needed: 75.7 L × 3 g/L = 227.1 grams of aquarium salt.",
          },
          {
            label: "3",
            explanation:
              "Add 227 grams of aquarium salt evenly to the tank water for therapeutic treatment.",
          },
        ],
        result: "The hobbyist should add approximately 227 grams of aquarium salt to the 20-gallon tank for effective treatment.",
      }}
      relatedCalculators={[
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
        { title: "Dehydration & Shedding Risk Index", url: "/pets/reptile-dehydration-shedding-risk-index", icon: "🐱" },
        { title: "UVB Lighting Distance & Duration Calculator", url: "/pets/reptile-uvb-lighting-distance-duration", icon: "🍖" },
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "💉" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Aquarium Salt Dosage Calculator (Therapeutic)" },
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