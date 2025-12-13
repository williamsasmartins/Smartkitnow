import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogMeloxicamMetacamDoseCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "0.1", // default initial dose mg/kg
  });

  // 2. LOGIC ENGINE
  // Meloxicam dosing for dogs typically:
  // Initial dose: 0.1 mg/kg once daily (some protocols use 0.2 mg/kg first day)
  // Maintenance dose: 0.05 mg/kg once daily
  // This calculator will provide initial dose and maintenance dose based on weight.
  // User can adjust dose mg/kg if needed.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseMgPerKgRaw = parseFloat(inputs.doseMgPerKg);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter a valid dog weight to calculate dosage.",
        subtext: null,
        warning: null,
      };
    }
    if (!doseMgPerKgRaw || doseMgPerKgRaw <= 0) {
      return {
        value: 0,
        label: "Enter a valid dose (mg/kg) to calculate dosage.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate initial dose (mg)
    // Typical initial dose: 0.1 mg/kg (can be adjusted)
    const initialDoseMg = weightKg * doseMgPerKgRaw;

    // Calculate maintenance dose (mg)
    // Maintenance dose is usually half initial dose (0.05 mg/kg)
    const maintenanceDoseMg = weightKg * (doseMgPerKgRaw / 2);

    // Round to 2 decimals
    const initialDoseRounded = initialDoseMg.toFixed(2);
    const maintenanceDoseRounded = maintenanceDoseMg.toFixed(2);

    // Warning for max dose (max 0.2 mg/kg/day generally)
    let warning = null;
    if (doseMgPerKgRaw > 0.2) {
      warning =
        "Warning: The dose entered exceeds the commonly recommended maximum of 0.2 mg/kg/day. Consult your veterinarian before administering higher doses.";
    }

    return {
      value: initialDoseRounded,
      label: `Initial Dose: ${initialDoseRounded} mg once daily`,
      subtext: `Maintenance Dose: ${maintenanceDoseRounded} mg once daily`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is Meloxicam dosing based on mg/kg rather than a fixed dose?",
      answer:
        "Meloxicam dosing is calculated based on mg/kg to ensure safe and effective treatment tailored to each dog's size and metabolism. Dogs vary widely in weight, and a fixed dose could lead to underdosing smaller dogs or overdosing larger ones, increasing risks of side effects or therapeutic failure. Using mg/kg dosing optimizes efficacy while minimizing toxicity.",
    },
    {
      question: "What are the risks of incorrect Meloxicam dosing in dogs?",
      answer:
        "Incorrect Meloxicam dosing can cause serious adverse effects. Overdosing increases the risk of gastrointestinal ulcers, kidney damage, and liver toxicity, while underdosing may fail to control pain or inflammation effectively. Because Meloxicam is a non-steroidal anti-inflammatory drug (NSAID), precise dosing and veterinary supervision are essential to avoid complications.",
    },
    {
      question: "How does the dog's weight influence Meloxicam metabolism and dosing?",
      answer:
        "A dog's weight directly influences Meloxicam metabolism because drug clearance and distribution volumes scale with body mass. Larger dogs generally require higher total doses but similar mg/kg doses to achieve therapeutic blood levels. Weight-based dosing ensures that the drug concentration remains within a safe and effective range across different sizes and breeds.",
    },
    {
      question: "Can Meloxicam be used long-term in dogs, and how does dosing change?",
      answer:
        "Meloxicam can be used long-term for chronic pain or inflammation, but dosing typically shifts from an initial higher dose (e.g., 0.1 mg/kg) to a lower maintenance dose (e.g., 0.05 mg/kg) to reduce side effects. Long-term use requires regular veterinary monitoring of kidney and liver function, as well as gastrointestinal health, to ensure safety and adjust dosing as needed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Accurate weight ensures correct Meloxicam dosing.
          </p>
        </div>

        {/* Dose Input */}
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300 mb-1 block">
            Dose (mg/kg) - Initial Dose (Typical: 0.1)
          </Label>
          <Input
            id="doseMgPerKg"
            name="doseMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 0.1"
            value={inputs.doseMgPerKg}
            onChange={onInputChange}
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-500 mt-1">
            Adjust dose per veterinary recommendation. Max recommended is 0.2 mg/kg/day.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
          aria-label="Calculate Meloxicam Dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "0.1" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
                Estimated Meloxicam Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and tailored treatment.
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
          Understanding Meloxicam/Metacam Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Meloxicam, commonly marketed as Metacam, is a non-steroidal anti-inflammatory drug (NSAID) widely used in veterinary medicine to manage pain and inflammation in dogs. It is especially effective for conditions such as osteoarthritis, post-surgical pain, and soft tissue injuries. Because NSAIDs can have significant side effects, precise dosing based on the dog’s weight is critical to maximize benefits while minimizing risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This dose calculator is designed to provide an evidence-based estimate of the initial and maintenance doses of Meloxicam for dogs, using the standard mg/kg dosing approach. The calculator accounts for unit preferences (imperial or metric) and allows customization of the dose within safe veterinary guidelines. It is an educational tool intended to support informed discussions between pet owners and veterinarians.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the pharmacokinetics and pharmacodynamics of Meloxicam in dogs is essential. The drug’s metabolism and clearance depend on body weight and organ function, which is why dosing must be individualized. This calculator helps translate veterinary dosing protocols into practical, easy-to-understand numbers, promoting safe administration and improved therapeutic outcomes.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Meloxicam dose calculator is straightforward and requires only two inputs: the dog’s weight and the desired dose in mg/kg. First, select the unit system you prefer—imperial (pounds) or metric (kilograms). Then, enter the dog’s weight accurately, as this is the foundation for all calculations. Finally, input the dose per kilogram, which defaults to the typical initial dose of 0.1 mg/kg but can be adjusted based on veterinary advice.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter the dog’s current weight in the selected unit system. Accurate weight measurement is essential for safe dosing.
          </li>
          <li>
            <strong>Dose (mg/kg):</strong> Input the initial dose recommended by your veterinarian. The default is 0.1 mg/kg, but this can be adjusted if your vet prescribes a different dose.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click “Calculate” to see the estimated initial dose in milligrams, along with the recommended maintenance dose, which is typically half the initial dose. Always consult your veterinarian before administering Meloxicam, as individual health conditions and concurrent medications may affect dosing and safety.
        </p>
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3407853/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Papich MG. Saunders Handbook of Veterinary Drugs: Small and Large Animal. 4th Edition.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary pharmacology reference detailing NSAID dosing protocols including Meloxicam in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&id=4950409"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Information Network (VIN) - Meloxicam Use in Dogs.
            </a>
            <p className="text-slate-500 text-sm">
              Expert discussions and clinical guidelines on Meloxicam dosing, safety, and monitoring in canine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5572147/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Lees P, Toutain PL. Pharmacokinetics and pharmacodynamics of NSAIDs in dogs.
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study analyzing NSAID metabolism and dosing rationale in dogs, including Meloxicam.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/using-nonsteroidal-anti-inflammatory-drugs-nsaids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Veterinary Medical Association (AVMA) - NSAIDs for Pets.
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on the safe use of NSAIDs like Meloxicam in veterinary medicine.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meloxicam/Metacam Dose Calculator for Dogs"
      description="Calculate the safe initial and maintenance dosages for the NSAID **Meloxicam (Metacam)** for pain relief in dogs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Meloxicam dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Meloxicam dose per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog requires Meloxicam for osteoarthritis pain management. The veterinarian recommends an initial dose of 0.1 mg/kg.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight to kilograms if needed: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation: "Calculate initial dose: 13.6 kg × 0.1 mg/kg = 1.36 mg Meloxicam once daily.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate maintenance dose: 13.6 kg × 0.05 mg/kg = 0.68 mg Meloxicam once daily after initial treatment.",
          },
        ],
        result: "The dog should receive 1.36 mg Meloxicam once daily initially, followed by 0.68 mg once daily for maintenance.",
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
        { id: "what-is", label: "Understanding Meloxicam/Metacam Dose Calculator for Dogs" },
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