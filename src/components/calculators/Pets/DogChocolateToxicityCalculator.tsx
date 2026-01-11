import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog, Skull } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

const CHOCOLATE_TYPES = [
  { label: "White Chocolate", mgTheobrominePerGram: 0.1 },
  { label: "Milk Chocolate", mgTheobrominePerGram: 1.5 },
  { label: "Dark Chocolate", mgTheobrominePerGram: 5.0 },
  { label: "Baking Chocolate", mgTheobrominePerGram: 15.0 },
  { label: "Unsweetened Cocoa Powder", mgTheobrominePerGram: 12.0 },
];

export default function DogChocolateToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    chocolateType: CHOCOLATE_TYPES[1].label,
    chocolateAmount: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const chocolateAmountRaw = parseFloat(inputs.chocolateAmount);
    if (!weightRaw || weightRaw <= 0) return { value: 0, label: "Enter valid dog weight." };
    if (!chocolateAmountRaw || chocolateAmountRaw <= 0) return { value: 0, label: "Enter valid chocolate amount." };

    const weightKg = weightToKg(weightRaw, unit);

    // Find the theobromine concentration for selected chocolate type
    const chocolateTypeObj = CHOCOLATE_TYPES.find((c) => c.label === inputs.chocolateType);
    if (!chocolateTypeObj) return { value: 0, label: "Select a valid chocolate type." };

    // Total theobromine ingested (mg)
    // chocolateAmountRaw is in grams
    const totalTheobromineMg = chocolateAmountRaw * chocolateTypeObj.mgTheobrominePerGram;

    // Toxic dose thresholds (mg/kg)
    // Mild toxicity: ~20 mg/kg
    // Severe toxicity: ~40-60 mg/kg
    // Lethal dose: ~100-200 mg/kg (varies widely)
    // We'll use 20 mg/kg as mild, 40 mg/kg as moderate, 60 mg/kg as severe

    const doseMgPerKg = totalTheobromineMg / weightKg;
    const displayedDose = unit === "kg" ? doseMgPerKg : doseMgPerKg / LB_PER_KG;
    const doseUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";

    // Determine toxicity level and advice
    let toxicityLevel = "No significant toxicity expected.";
    let warning = null;

    if (doseMgPerKg >= 100) {
      toxicityLevel = "Potentially lethal toxicity.";
      warning = "Seek emergency veterinary care immediately. This dose can be fatal.";
    } else if (doseMgPerKg >= 60) {
      toxicityLevel = "Severe toxicity likely.";
      warning = "Immediate veterinary attention is strongly recommended.";
    } else if (doseMgPerKg >= 40) {
      toxicityLevel = "Moderate toxicity possible.";
      warning = "Contact your veterinarian promptly for advice.";
    } else if (doseMgPerKg >= 20) {
      toxicityLevel = "Mild toxicity possible.";
      warning = "Monitor your dog closely and consult your vet if symptoms develop.";
    }

    return {
      value: displayedDose.toFixed(1),
      label: `Theobromine dose: ${displayedDose.toFixed(1)} ${doseUnitLabel}`,
      subtext: toxicityLevel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is theobromine toxic to dogs but not humans?",
      answer:
        "Theobromine is metabolized much more slowly in dogs than in humans, leading to accumulation and toxic effects. Dogs lack the efficient enzymes to break down theobromine quickly, so even small amounts can cause symptoms. This difference in metabolism explains why chocolate is safe for humans but potentially dangerous for dogs, necessitating careful monitoring and prevention.",
    },
    {
      question: "How does the type of chocolate affect toxicity risk in dogs?",
      answer:
        "Different chocolates contain varying levels of theobromine, the toxic compound for dogs. Dark and baking chocolates have much higher concentrations than milk or white chocolate. Therefore, ingestion of smaller amounts of dark chocolate can be more dangerous than larger amounts of milk chocolate. Understanding chocolate type is crucial for accurate toxicity risk assessment and timely veterinary intervention.",
    },
    {
      question: "What symptoms indicate chocolate poisoning in dogs?",
      answer:
        "Symptoms typically appear within 6 to 12 hours and include vomiting, diarrhea, restlessness, increased heart rate, tremors, and seizures in severe cases. These signs result from theobromine’s stimulant effects on the central nervous and cardiovascular systems. Early recognition and veterinary care are essential to prevent progression to life-threatening complications.",
    },
    {
      question: "Can all dogs tolerate the same amount of theobromine?",
      answer:
        "No, tolerance varies based on size, age, health status, and individual sensitivity. Smaller dogs are at higher risk because the toxic dose is calculated per kilogram of body weight. Puppies, elderly dogs, and those with pre-existing conditions may also be more vulnerable. This variability underscores the importance of calculating toxicity risk individually rather than using generic guidelines.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dog Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        {/* Chocolate Type Select */}
        <div>
          <Label htmlFor="chocolateType" className="text-slate-700 dark:text-slate-300">
            Chocolate Type
          </Label>
          <Select
            value={inputs.chocolateType}
            onValueChange={(val) => handleInputChange("chocolateType", val)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHOCOLATE_TYPES.map((type) => (
                <SelectItem key={type.label} value={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chocolate Amount Input */}
        <div>
          <Label htmlFor="chocolateAmount" className="text-slate-700 dark:text-slate-300">
            Amount of Chocolate Consumed (grams)
          </Label>
          <Input
            id="chocolateAmount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter chocolate amount in grams"
            value={inputs.chocolateAmount}
            onChange={(e) => handleInputChange("chocolateAmount", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state change, no extra logic needed here
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", chocolateType: CHOCOLATE_TYPES[1].label, chocolateAmount: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
          Understanding Dog Chocolate Toxicity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Chocolate toxicity in dogs is primarily caused by theobromine, a bitter alkaloid found in cacao plants. Unlike humans, dogs metabolize theobromine very slowly, which allows it to accumulate in their system and cause toxic effects. The severity of poisoning depends on the amount ingested relative to the dog’s weight, as well as the type of chocolate consumed, since theobromine concentration varies widely among chocolate types.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the dose of theobromine ingested per kilogram of the dog’s body weight, which is the key metric veterinarians use to assess toxicity risk. By inputting the dog’s weight, the type of chocolate, and the amount consumed, the tool provides an evidence-based risk level and guidance on urgency for veterinary care. This approach helps pet owners make informed decisions quickly in emergency situations.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of chocolate poisoning in your dog, follow these steps carefully. First, select the unit system you prefer—imperial (pounds) or metric (kilograms)—to enter your dog’s weight. Next, choose the type of chocolate your dog has ingested from the dropdown menu, as different chocolates contain varying levels of theobromine. Finally, enter the amount of chocolate consumed in grams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s current weight accurately. This is essential because toxicity thresholds are calculated per kilogram of body weight.
          </li>
          <li>
            <strong>Chocolate Type:</strong> Select the exact type of chocolate ingested. Darker chocolates contain higher theobromine concentrations and pose greater risks.
          </li>
          <li>
            <strong>Chocolate Amount:</strong> Input the estimated amount of chocolate your dog ate, measured in grams. Even small amounts of baking or dark chocolate can be dangerous.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/chocolate"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              1. ASPCA Animal Poison Control Center - Chocolate Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on chocolate poisoning symptoms, toxic doses, and emergency treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/chocolate-toxicity/theobromine-and-caffeine-toxicity"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Merck Veterinary Manual - Theobromine and Caffeine Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Detailed veterinary review of the pharmacology, clinical signs, and treatment of theobromine poisoning in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151208/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              3. National Institutes of Health - Pharmacokinetics of Theobromine in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study analyzing the metabolism and toxicokinetics of theobromine in canine species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/chocolate-toxicity-in-dogs"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              4. VCA Hospitals - Chocolate Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical veterinary advice on recognizing chocolate poisoning and recommended emergency responses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Chocolate Toxicity Calculator"
      description="Calculate the risk and severity of **chocolate poisoning** in dogs based on weight, type of chocolate consumed, and amount."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (mg/kg) = (Amount of Chocolate Consumed in grams × Theobromine Concentration in mg/g) ÷ Dog's Weight in kg",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Theobromine dose per kilogram of dog's body weight" },
          { symbol: "Amount of Chocolate Consumed (g)", description: "Weight of chocolate ingested in grams" },
          { symbol: "Theobromine Concentration (mg/g)", description: "Theobromine content per gram of chocolate type" },
          { symbol: "Dog's Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) dog ate 50 grams of milk chocolate. Milk chocolate contains approximately 1.5 mg of theobromine per gram.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (10 lb ÷ 2.20462 = 4.54 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total theobromine ingested: 50 g × 1.5 mg/g = 75 mg.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose per kg: 75 mg ÷ 4.54 kg ≈ 16.5 mg/kg.",
          },
          {
            label: "Step 4",
            explanation:
              "Interpret dose: 16.5 mg/kg is below mild toxicity threshold (20 mg/kg), so no significant toxicity expected but monitor closely.",
          },
        ],
        result: "The dog ingested approximately 16.5 mg/kg of theobromine, which is below the mild toxicity threshold, but monitoring is advised.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Chocolate Toxicity Calculator" },
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
