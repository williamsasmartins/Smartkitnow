import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogBenadrylDiphenhydramineDoseCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Benadryl (Diphenhydramine) typical safe dose for dogs: 1 mg/kg to 2 mg/kg every 8-12 hours.
  // We'll calculate the dose range (min and max) based on weight.
  // Source: Veterinary pharmacology guidelines.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0)
      return {
        value: 0,
        label: "Enter valid weight to calculate dosage",
        subtext: null,
        warning: null,
      };

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Dose range in mg
    const doseMin = weightKg * 1; // 1 mg/kg minimum dose
    const doseMax = weightKg * 2; // 2 mg/kg maximum dose

    // Round to 2 decimals for clarity
    const doseMinRounded = Math.round(doseMin * 100) / 100;
    const doseMaxRounded = Math.round(doseMax * 100) / 100;

    // Warning if weight is very low or very high (e.g. <1kg or >90kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight below 1 kg is uncommon for dogs; please verify weight and consult a veterinarian before dosing.";
    } else if (weightKg > 90) {
      warning =
        "Weight above 90 kg is uncommon for dogs; dosing should be carefully confirmed with a veterinarian.";
    }

    return {
      value: `${doseMinRounded} mg - ${doseMaxRounded} mg`,
      label: `Recommended Benadryl dose range every 8-12 hours`,
      subtext:
        "Dose is calculated based on 1-2 mg of Diphenhydramine per kg of body weight. Always consult your veterinarian before administration.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is the Benadryl dose for dogs calculated per kilogram of body weight?",
      answer:
        "Calculating medication doses per kilogram of body weight ensures accuracy and safety in veterinary medicine. Dogs vary widely in size and metabolism, so a fixed dose could be harmful or ineffective. Using mg/kg allows the dose to be tailored to the individual dog's size, minimizing risks of overdose or underdose, and optimizing therapeutic effects.",
    },
    {
      question: "How often can I safely give Benadryl to my dog?",
      answer:
        "Benadryl (Diphenhydramine) is typically administered every 8 to 12 hours in dogs, depending on the condition and veterinary guidance. This interval allows the medication to maintain effective blood levels while minimizing side effects. Frequent dosing outside recommended intervals can increase risks of sedation, dry mouth, or other adverse effects, so always follow your vet’s instructions.",
    },
    {
      question: "Are there any risks or side effects associated with Benadryl in dogs?",
      answer:
        "While Benadryl is generally safe when dosed correctly, side effects can include drowsiness, dry mouth, urinary retention, and in rare cases, paradoxical excitation. Dogs with certain health conditions or those on other medications may be at higher risk. Always consult a veterinarian before administering Benadryl to ensure it is appropriate and safe for your dog’s specific health status.",
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer:
        "This calculator provides general dosing guidelines based on weight but does not replace veterinary advice. Puppies and senior dogs may have different sensitivities or health considerations affecting medication metabolism. It is crucial to consult a veterinarian before giving Benadryl to these age groups to ensure safe and effective dosing tailored to their unique needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your dog's current body weight accurately for best results.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dosing.
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
          Understanding Benadryl (Diphenhydramine) Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Benadryl, whose active ingredient is Diphenhydramine, is a widely used antihistamine in veterinary medicine. It is commonly administered to dogs to alleviate allergic reactions, motion sickness, and certain anxiety symptoms. However, because dogs vary significantly in size and metabolism, determining the correct dose is critical to ensure efficacy while avoiding toxicity. This calculator helps pet owners and veterinary professionals estimate a safe dose based on the dog’s body weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The dosing of Benadryl in dogs is typically expressed in milligrams per kilogram (mg/kg) of body weight, reflecting the pharmacokinetic principles that govern drug distribution and metabolism in animals. Using a weight-based dosing approach accounts for the individual variability among dogs, from tiny toy breeds to large working dogs. This calculator uses the standard veterinary dosing range of 1 to 2 mg/kg every 8 to 12 hours, which is supported by veterinary pharmacology literature and clinical practice guidelines.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that while Benadryl is generally safe when dosed correctly, it is not suitable for all dogs, especially those with certain medical conditions or those taking other medications. This tool is designed for educational purposes and to assist in preliminary dose estimation; it does not replace professional veterinary advice. Always consult your veterinarian before administering any medication to your pet.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to provide an estimated safe dose range of Benadryl (Diphenhydramine) for dogs based on their body weight. To use it effectively, follow these simple steps to ensure accurate input and interpretation of results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select the unit system:</strong> Choose between Imperial (pounds) or Metric (kilograms) depending on your preference or the units you have for your dog’s weight.
          </li>
          <li>
            <strong>Enter your dog’s weight:</strong> Input the current body weight of your dog accurately. This value is essential as the dose calculation is directly proportional to weight.
          </li>
          <li>
            <strong>Calculate the dose:</strong> Click the “Calculate” button to see the recommended dose range in milligrams. The calculator will display the minimum and maximum dose based on 1-2 mg/kg dosing guidelines.
          </li>
          <li>
            <strong>Review warnings and notes:</strong> Pay attention to any warnings about unusual weights or special considerations. Always verify the results with your veterinarian before administering medication.
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
              href="https://www.merckvetmanual.com/pharmacology/antihistamines/diphenhydramine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Diphenhydramine
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Diphenhydramine use, dosing, and safety in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/dogs/allergy-and-immune-mediated-diseases/benadryl-diphenhydramine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Washington State University - Benadryl (Diphenhydramine) for Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance on dosing and indications for Benadryl in canine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.plumbsveterinarydrugs.com/#!/monograph/0/diphenhydramine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Plumb’s Veterinary Drug Handbook - Diphenhydramine
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative drug monograph detailing pharmacology, dosing, and adverse effects.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.veterinarypartner.com/Content.plx?P=A&A=2796"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Veterinary Partner - Diphenhydramine Use in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Educational article on indications, dosing, and precautions for Benadryl in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Benadryl (Diphenhydramine) Dose Calculator for Dogs"
      description="Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for dogs based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Benadryl dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Recommended dose per kilogram (1 to 2 mg/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A dog weighs 30 lbs (approximately 13.6 kg). We want to calculate the safe Benadryl dose range.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.6 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate minimum dose: 13.6 kg × 1 mg/kg = 13.6 mg; Calculate maximum dose: 13.6 kg × 2 mg/kg = 27.2 mg",
          },
        ],
        result: "The recommended Benadryl dose range is 13.6 mg to 27.2 mg every 8-12 hours.",
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
        { id: "what-is", label: "Understanding Benadryl (Diphenhydramine) Dose Calculator for Dogs" },
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