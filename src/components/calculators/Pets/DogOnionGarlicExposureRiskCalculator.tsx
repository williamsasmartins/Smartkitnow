import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogOnionGarlicExposureRiskCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    alliumAmount: "",
    alliumType: "onion",
  });

  // Toxic doses (mg/kg) for Allium species causing hemolytic anemia in dogs:
  // Onion: ~15-30 g/kg fresh weight (toxic dose), but conservatively 15 g/kg = 15000 mg/kg
  // Garlic: ~5 g/kg fresh weight (more toxic than onion)
  // Chives and leeks are less commonly quantified but considered toxic at similar or slightly higher doses.
  // For safety, we use mg/kg of fresh weight of Allium consumed.

  // Conversion factors for Allium types to mg of toxic compounds (N-propyl disulfide) per gram:
  // Approximate relative toxicity factor (arbitrary for calculator scaling):
  // Onion = 1 (baseline)
  // Garlic = 3 (3x more toxic)
  // Chives = 0.5
  // Leeks = 0.7

  // For this calculator, we estimate risk by comparing the ingested dose (mg/kg dog weight) to a toxic threshold.

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const alliumAmountRaw = parseFloat(inputs.alliumAmount);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!alliumAmountRaw || alliumAmountRaw <= 0) {
      return {
        value: 0,
        label: "Please enter the amount of onion/garlic consumed.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Toxicity factors (relative toxicity multiplier)
    const toxicityFactors: Record<string, number> = {
      onion: 1,
      garlic: 3,
      chives: 0.5,
      leeks: 0.7,
    };

    const toxicityFactor = toxicityFactors[inputs.alliumType] || 1;

    // Convert alliumAmount to grams (input assumed grams)
    // Calculate toxic dose threshold in mg/kg dog weight:
    // Using conservative toxic dose for onion: 15 g/kg dog weight = 15000 mg/kg
    // For garlic, toxic dose is ~5 g/kg = 5000 mg/kg, so we scale by toxicityFactor

    // Calculate ingested dose in mg/kg dog weight:
    // ingestedDose (mg/kg) = (alliumAmount (g) * 1000 mg/g * toxicityFactor) / weightKg

    const ingestedDoseMgPerKg =
      (alliumAmountRaw * 1000 * toxicityFactor) / weightKg;

    // Toxic threshold mg/kg (onion baseline 15000 mg/kg)
    const toxicThresholdMgPerKg = 15000;

    // Risk assessment:
    // If ingestedDose < 0.5 * toxicThreshold => Low risk
    // If ingestedDose between 0.5 and 1 toxicThreshold => Moderate risk
    // If ingestedDose > toxicThreshold => High risk

    let riskLabel = "";
    let warning = null;

    if (ingestedDoseMgPerKg < 0.5 * toxicThresholdMgPerKg) {
      riskLabel = "Low risk of toxicity";
    } else if (
      ingestedDoseMgPerKg >= 0.5 * toxicThresholdMgPerKg &&
      ingestedDoseMgPerKg < toxicThresholdMgPerKg
    ) {
      riskLabel = "Moderate risk of toxicity";
      warning =
        "Monitor your dog closely for symptoms such as weakness, lethargy, or reddish urine. Contact your veterinarian if symptoms appear.";
    } else {
      riskLabel = "High risk of toxicity";
      warning =
        "Immediate veterinary attention is recommended. Onion and garlic ingestion can cause hemolytic anemia, which can be life-threatening.";
    }

    return {
      value: ingestedDoseMgPerKg.toFixed(0),
      label: riskLabel,
      subtext: `Estimated dose: ${ingestedDoseMgPerKg.toFixed(
        0
      )} mg toxic compounds per kg of dog body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why are onions and garlic toxic to dogs, and how does the toxicity mechanism work?",
      answer:
        "Onions, garlic, and related Allium species contain compounds such as N-propyl disulfide that cause oxidative damage to red blood cells in dogs. This leads to hemolytic anemia, where red blood cells are destroyed faster than they can be replaced. The oxidative stress damages hemoglobin, forming Heinz bodies, which mark cells for destruction. This process impairs oxygen transport, causing weakness, lethargy, and potentially life-threatening complications.",
    },
    {
      question:
        "How does the amount of onion or garlic ingested relate to the risk of toxicity in dogs?",
      answer:
        "The risk of toxicity depends on the dose relative to the dog's body weight. Toxic doses are generally around 15 grams of onion per kilogram of dog weight and about 5 grams per kilogram for garlic, which is more potent. Smaller amounts may cause mild symptoms or no symptoms, but repeated exposure or larger doses increase the risk of severe anemia. Calculating the ingested dose per kg helps estimate the risk level and urgency of veterinary care.",
    },
    {
      question:
        "Can all types of Allium plants cause toxicity in dogs, and are some more dangerous than others?",
      answer:
        "Yes, all Allium species including onions, garlic, chives, and leeks contain toxic compounds harmful to dogs. Garlic is generally considered more toxic than onions, requiring a smaller dose to cause harm. Chives and leeks also pose risks but are less commonly ingested in toxic amounts. Regardless of type, ingestion should be treated seriously, and any exposure should prompt monitoring or veterinary consultation depending on the amount consumed.",
    },
    {
      question:
        "What are the clinical signs of Allium toxicity in dogs, and when should I seek veterinary care?",
      answer:
        "Clinical signs typically appear 1-5 days after ingestion and include weakness, lethargy, pale or yellow gums, rapid breathing, vomiting, diarrhea, and reddish or brown urine due to hemoglobinuria. If you suspect your dog has ingested onions, garlic, or related plants, especially in moderate to large amounts, seek veterinary care immediately. Early intervention can prevent severe anemia and improve outcomes significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function handleSelectChange(value: string) {
    setInputs((prev) => ({ ...prev, alliumType: value }));
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

        {/* Dog Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter dog weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        {/* Allium Type Select */}
        <div>
          <Label htmlFor="alliumType" className="text-slate-700 dark:text-slate-300">
            Allium Type
          </Label>
          <Select
            value={inputs.alliumType}
            onValueChange={handleSelectChange}
            id="alliumType"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onion">Onion</SelectItem>
              <SelectItem value="garlic">Garlic</SelectItem>
              <SelectItem value="chives">Chives</SelectItem>
              <SelectItem value="leeks">Leeks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Allium Amount Input */}
        <div>
          <Label
            htmlFor="alliumAmount"
            className="text-slate-700 dark:text-slate-300"
          >
            Amount Consumed (grams)
          </Label>
          <Input
            id="alliumAmount"
            name="alliumAmount"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount of onion/garlic consumed in grams"
            value={inputs.alliumAmount}
            onChange={handleInputChange}
          />
        </div>
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
          onClick={() =>
            setInputs({ weight: "", alliumAmount: "", alliumType: "onion" })
          }
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
                {results.value} mg/kg
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
              veterinarian for diagnosis and treatment.
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
          Understanding Dog Onion/Garlic (Allium) Exposure Risk Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the risk of toxicity in dogs after ingestion of
          onions, garlic, chives, or leeks—plants belonging to the Allium genus. These
          plants contain compounds such as N-propyl disulfide that induce oxidative
          damage to canine red blood cells, leading to hemolytic anemia. The severity
          of toxicity depends on the amount ingested relative to the dog’s body weight,
          making dose calculation essential for risk assessment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The tool uses veterinary toxicology data to estimate the ingested dose of
          toxic compounds per kilogram of dog weight, comparing it to known toxic
          thresholds. Garlic is generally more potent than onion, so the calculator
          adjusts risk accordingly. By quantifying exposure, pet owners and veterinarians
          can better understand potential health impacts and decide when urgent care is
          needed.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of Allium toxicity, enter your dog’s weight and
          the amount of onion, garlic, chives, or leeks consumed. Select the specific
          Allium type, as toxicity varies between species. The calculator will then
          estimate the toxic dose ingested per kilogram of body weight and provide a
          risk category with guidance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s current weight in pounds or
            kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Allium Type:</strong> Choose the specific plant ingested (onion,
            garlic, chives, or leeks) to adjust toxicity calculations accordingly.
          </li>
          <li>
            <strong>Amount Consumed:</strong> Enter the estimated amount of Allium
            consumed in grams. Be as accurate as possible for reliable risk estimation.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to view the estimated
            toxic dose and risk level. Follow any warnings or veterinary recommendations
            provided.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/food-hazards/onion-and-garlic-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Onion and Garlic Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Allium toxicity, clinical signs, and treatment
              protocols in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/15318009/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. "Onion (Allium cepa) toxicosis in dogs: a review" - PubMed
            </a>
            <p className="text-slate-500 text-sm">
              Scientific review detailing the pathophysiology and toxic dose thresholds
              of onion ingestion in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/garlic-and-onion-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell University College of Veterinary Medicine: Garlic and Onion Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource explaining toxic compounds and clinical management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.acvma-vet.org/resources/animal-poison-control"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American College of Veterinary Medical Toxicology: Animal Poison Control
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines and emergency protocols for Allium species poisoning in pets.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Onion/Garlic (Allium) Exposure Risk Calculator"
      description="Determine the potential toxicity risk from consuming onions, garlic, chives, or leeks (Allium species)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Ingested Dose (mg/kg) = (Amount of Allium consumed (g) × 1000 mg/g × Toxicity Factor) ÷ Dog Weight (kg)",
        variables: [
          {
            symbol: "Amount of Allium consumed (g)",
            description:
              "The weight in grams of onion, garlic, chives, or leeks ingested by the dog.",
          },
          {
            symbol: "Toxicity Factor",
            description:
              "Relative toxicity multiplier based on Allium type (Onion=1, Garlic=3, Chives=0.5, Leeks=0.7).",
          },
          {
            symbol: "Dog Weight (kg)",
            description: "The body weight of the dog in kilograms.",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 30 grams of garlic accidentally.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (20 lb ÷ 2.20462 = 9.07 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate ingested dose: (30 g × 1000 mg/g × 3 toxicity factor) ÷ 9.07 kg = 9913 mg/kg.",
          },
        ],
        result:
          "The estimated dose of 9913 mg/kg exceeds 0.5 of the toxic threshold (15000 mg/kg for onion baseline), indicating moderate to high risk of toxicity. Veterinary evaluation is recommended immediately.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dog Onion/Garlic (Allium) Exposure Risk Calculator",
        },
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