import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Syringe } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function DogCephalexinDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "20", // default dosage mg/kg/day (typical range 20-30 mg/kg/day)
    frequencyPerDay: "2", // default frequency (BID)
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageMgPerKg = parseFloat(inputs.dosageMgPerKg);
    const frequencyPerDay = parseInt(inputs.frequencyPerDay);

    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid dog weight",
        subtext: null,
        warning: null,
      };
    }
    if (!dosageMgPerKg || dosageMgPerKg <= 0) {
      return {
        value: 0,
        label: "Enter valid dosage (mg/kg/day)",
        subtext: null,
        warning: null,
      };
    }
    if (!frequencyPerDay || frequencyPerDay <= 0) {
      return {
        value: 0,
        label: "Enter valid frequency per day",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Total daily dose in mg = weightKg * dosageMgPerKg
    const totalDailyDoseMg = weightKg * dosageMgPerKg;

    // Dose per administration = totalDailyDoseMg / frequencyPerDay
    const dosePerAdminMg = totalDailyDoseMg / frequencyPerDay;

    // Round to 2 decimals
    const dosePerAdminMgRounded = Math.round(dosePerAdminMg * 100) / 100;

    // Warning if dosage outside typical range (20-30 mg/kg/day)
    let warning = null;
    if (dosageMgPerKg < 20) {
      warning =
        "Dosage is below the commonly recommended range (20-30 mg/kg/day). Consult your veterinarian before proceeding.";
    } else if (dosageMgPerKg > 30) {
      warning =
        "Dosage exceeds the commonly recommended range (20-30 mg/kg/day). High doses may increase risk of side effects.";
    }

    return {
      value: dosePerAdminMgRounded,
      label: `Dose per administration (mg) given ${frequencyPerDay} times daily`,
      subtext: `Total daily dose: ${Math.round(totalDailyDoseMg * 100) / 100} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is Cephalexin dosage calculated based on mg/kg rather than a fixed dose?",
      answer:
        "Cephalexin dosage is calculated based on mg/kg to ensure the medication is tailored to the individual dog's body weight, providing an effective therapeutic level without overdosing. Dogs vary widely in size and metabolism, so a fixed dose could be ineffective or harmful. Weight-based dosing optimizes safety and efficacy by accounting for these physiological differences.",
    },
    {
      question: "How does the frequency of administration affect the effectiveness of Cephalexin in dogs?",
      answer:
        "The frequency of administration is crucial because Cephalexin has a relatively short half-life, requiring multiple doses per day to maintain effective blood levels. Administering the medication at recommended intervals ensures consistent antibacterial activity, preventing bacterial regrowth and resistance. Skipping doses or incorrect timing can reduce treatment success and prolong infection.",
    },
    {
      question: "Can Cephalexin dosage vary depending on the type or severity of infection?",
      answer:
        "Yes, Cephalexin dosage may vary depending on the infection's severity, location, and causative bacteria. Mild infections might require lower dosages or shorter courses, while severe or deep infections often need higher dosages and longer treatment durations. Veterinarians assess clinical signs and may adjust dosage accordingly to optimize outcomes and minimize resistance.",
    },
    {
      question: "What are the risks of incorrect Cephalexin dosing in dogs?",
      answer:
        "Incorrect dosing of Cephalexin can lead to treatment failure, antibiotic resistance, or adverse effects. Underdosing may not fully eradicate the infection, allowing bacteria to survive and develop resistance. Overdosing increases the risk of side effects such as gastrointestinal upset, allergic reactions, or kidney toxicity. Accurate dosing ensures safe and effective therapy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleFrequencyChange(value: string) {
    setInputs((prev) => ({ ...prev, frequencyPerDay: value }));
  }

  // Widget JSX
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
              setInputs((prev) => {
                const weightRaw = parseFloat(prev.weight);
                if (!Number.isFinite(weightRaw) || weightRaw <= 0) return prev;
                const nextWeight = convertWeight(weightRaw, unit, next);
                return { ...prev, weight: formatNumberForInput(nextWeight, 2) };
              });
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "lb" ? "e.g. 50" : "e.g. 22.7"}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        {/* Dosage Input */}
        <div>
          <Label htmlFor="dosageMgPerKg" className="text-slate-700 dark:text-slate-300">
            Dosage (mg/kg/day)
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="number"
            min={0}
            step="any"
            placeholder="Typical: 20-30"
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
          />
        </div>

        {/* Frequency Input */}
        <div>
          <Label htmlFor="frequencyPerDay" className="text-slate-700 dark:text-slate-300">
            Frequency (times per day)
          </Label>
          <Select value={inputs.frequencyPerDay} onValueChange={handleFrequencyChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Once daily (SID)</SelectItem>
              <SelectItem value="2">Twice daily (BID)</SelectItem>
              <SelectItem value="3">Three times daily (TID)</SelectItem>
              <SelectItem value="4">Four times daily (QID)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "20", frequencyPerDay: "2" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cephalexin Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cephalexin is a widely used antibiotic in veterinary medicine, particularly effective against bacterial infections in dogs. It belongs to the cephalosporin class of antibiotics, which work by disrupting bacterial cell wall synthesis, leading to bacterial death. Proper dosing is critical to ensure the medication is both effective and safe, minimizing the risk of resistance and adverse effects. This calculator helps veterinarians and pet owners determine the appropriate dose based on the dog’s body weight and treatment frequency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dosage of Cephalexin is typically calculated in milligrams per kilogram of body weight per day (mg/kg/day), reflecting the pharmacokinetic principles that drug metabolism and distribution vary with size. Additionally, the frequency of administration is important to maintain therapeutic drug levels in the bloodstream. This tool incorporates these principles to provide a precise dose per administration, tailored to the individual dog’s weight and prescribed dosing schedule.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this calculator ensures that the antibiotic is administered within the recommended therapeutic window, reducing the risk of underdosing, which can lead to treatment failure and bacterial resistance, or overdosing, which can cause toxicity. It is essential to follow veterinary guidance and consider this calculator as an educational aid rather than a substitute for professional advice.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate the Cephalexin dose for your dog, begin by selecting the unit system that corresponds to your measurement preference—Imperial (pounds) or Metric (kilograms). Enter your dog’s current body weight in the selected units. Next, input the prescribed dosage in milligrams per kilogram per day, typically ranging from 20 to 30 mg/kg/day, as recommended by veterinary guidelines. Finally, select the frequency of administration, which is how many times per day the medication should be given.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s accurate weight. For Imperial units, use pounds (lbs); for Metric, use kilograms (kg). This is critical as dosing is weight-dependent.
          </li>
          <li>
            <strong>Dosage (mg/kg/day):</strong> Input the total daily dosage prescribed by your veterinarian. The calculator will divide this dose across the number of administrations per day.
          </li>
          <li>
            <strong>Frequency:</strong> Choose how many times per day the medication will be administered (e.g., twice daily). The calculator will compute the dose per administration accordingly.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these details, click the “Calculate” button to receive the recommended dose per administration in milligrams. Always verify the results with your veterinarian before administering medication, and never adjust doses without professional guidance.
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
              href="https://www.plumbsveterinarydrugs.com/#!/monograph/cephalexin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Plumb's Veterinary Drug Handbook - Cephalexin Monograph
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive drug information including pharmacology, dosing, and safety for Cephalexin in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/antibacterial-drugs/cephalosporins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Cephalosporins
            </a>
            <p className="text-slate-500 text-sm">
              Overview of cephalosporin antibiotics, including Cephalexin, their uses, dosing, and resistance considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11353&id=4952147"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Veterinary Information Network (VIN) - Cephalexin Dosing Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Expert discussions and clinical guidelines on appropriate Cephalexin dosing for various canine infections.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/antimicrobial-use-guidelines/antimicrobial-use-guidelines-for-treatment-of-skin-infections-in-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Animal Hospital Association (AAHA) - Antimicrobial Use Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based guidelines for antimicrobial use in canine skin infections, including Cephalexin dosing recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cephalexin Dose Calculator for Dogs"
      description="Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in dogs based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose per administration (mg) = (Weight (kg) × Dosage (mg/kg/day)) ÷ Frequency (times/day)",
        variables: [
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg/day)", description: "Prescribed daily dosage in milligrams per kilogram" },
          { symbol: "Frequency (times/day)", description: "Number of doses administered per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 50 lb (22.7 kg) dog is prescribed Cephalexin at 25 mg/kg/day, to be given twice daily (BID). Calculate the dose per administration.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight to kilograms if necessary. Here, 50 lb ÷ 2.20462 = 22.7 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total daily dose: 22.7 kg × 25 mg/kg/day = 567.5 mg/day. Then divide by frequency: 567.5 mg ÷ 2 = 283.75 mg per dose.",
          },
        ],
        result: "The dog should receive approximately 284 mg of Cephalexin per dose, twice daily.",
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
        { id: "what-is", label: "Understanding Cephalexin Dose Calculator for Dogs" },
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
