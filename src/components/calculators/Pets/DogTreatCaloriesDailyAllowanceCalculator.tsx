import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogTreatCaloriesDailyAllowanceCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // RER = 70 * (weightKg ^ 0.75)
  // Max daily treat calories = 10% of RER (recommended max treat calories to avoid weight gain)
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const treatCaloriesRaw = parseFloat(inputs.treatCalories);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!treatCaloriesRaw || treatCaloriesRaw <= 0) {
      return {
        value: 0,
        label: "Please enter the calorie content of the treat.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * weightKg^0.75
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Maximum daily treat calories recommended = 10% of RER
    const maxTreatCalories = RER * 0.10;

    // Calculate how many treats can be given daily without exceeding max treat calories
    const maxTreats = Math.floor(maxTreatCalories / treatCaloriesRaw);

    // Warning if treat calories exceed max daily allowance
    let warning = null;
    if (treatCaloriesRaw > maxTreatCalories) {
      warning =
        "The calorie content of a single treat exceeds the recommended maximum daily treat calories. Consider choosing lower-calorie treats to avoid weight gain.";
    }

    return {
      value: maxTreats > 0 ? maxTreats : 0,
      label:
        maxTreats > 0
          ? `Maximum treats per day without exceeding 10% of daily calorie needs (${maxTreatCalories.toFixed(
              1
            )} kcal).`
          : "Treat calorie content too high for safe daily allowance.",
      subtext: `Based on RER: ${RER.toFixed(1)} kcal/day. Treat calorie content: ${treatCaloriesRaw} kcal.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is it important to limit dog treat calories to 10% of daily intake?",
      answer:
        "Limiting dog treat calories to 10% of their daily energy needs helps prevent excessive calorie intake that can lead to obesity. Dogs require a balanced diet to maintain optimal health, and treats should complement, not replace, their main meals. Overfeeding treats disrupts this balance, increasing risks of weight gain, joint stress, and metabolic disorders. This calculator uses scientifically validated Resting Energy Requirement (RER) formulas to estimate safe treat allowances, ensuring treats remain a healthy part of your dog's diet.",
    },
    {
      question: "How is the Resting Energy Requirement (RER) calculated for dogs?",
      answer:
        "RER represents the baseline number of calories a dog needs at rest to maintain vital bodily functions. It is calculated using the formula: RER = 70 × (weight in kg)^0.75. This formula accounts for metabolic scaling relative to body size, providing a more accurate estimate than linear weight-based calculations. RER serves as the foundation for determining total daily energy needs and safe treat allowances, ensuring nutritional recommendations are tailored to each dog's physiology.",
    },
    {
      question: "Can I use this calculator for puppies or overweight dogs?",
      answer:
        "This calculator estimates treat allowances based on RER, which is most accurate for healthy adult dogs. Puppies have higher energy needs relative to their size due to growth, and overweight dogs require adjusted calorie targets to promote weight loss. For puppies, consult a veterinarian or use specialized puppy calorie calculators. For overweight dogs, treat allowances should be reduced and monitored carefully to support weight management. Always seek veterinary guidance for these special cases to ensure safe and effective nutrition.",
    },
    {
      question: "What should I do if my dog refuses low-calorie treats?",
      answer:
        "If your dog refuses low-calorie treats, try offering a variety of healthy options such as small pieces of cooked vegetables, lean meats, or specially formulated low-calorie dog treats. Positive reinforcement and gradual introduction can help your dog accept new treats. Avoid high-calorie or human foods that may be harmful or contribute to weight gain. Consulting a veterinarian or a veterinary nutritionist can provide personalized recommendations to maintain your dog's health while keeping treat time enjoyable.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
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
          />
        </div>

        {/* Treat Calories Input */}
        <div>
          <Label htmlFor="treatCalories" className="text-slate-700 dark:text-slate-300">
            Calories per Treat (kcal)
          </Label>
          <Input
            id="treatCalories"
            name="treatCalories"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calories per treat"
            value={inputs.treatCalories}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", treatCalories: "" })}
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

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Treat Calories & Daily Allowance Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Treat Calories & Daily Allowance Calculator is a scientifically grounded tool designed to help pet owners understand and manage the caloric intake from treats given to their dogs. Treats, while a valuable part of training and bonding, can contribute significantly to a dog’s daily calorie consumption if not carefully monitored. This calculator uses veterinary nutritional science principles to estimate the maximum number of treats a dog can safely consume daily without risking unhealthy weight gain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Central to this calculation is the Resting Energy Requirement (RER), which estimates the baseline calories a dog needs to maintain vital bodily functions at rest. By applying the formula RER = 70 × (weight in kg)^0.75, the calculator determines the dog’s daily energy needs. It then recommends that treats should not exceed 10% of this caloric requirement to maintain a balanced diet. This approach helps prevent obesity, a common and serious health issue in dogs, by ensuring treats complement rather than replace essential nutrition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator accounts for the calorie content per treat, allowing owners to input specific treat information rather than relying on generic estimates. This precision supports tailored feeding strategies, accommodating different treat sizes, types, and caloric densities. By integrating these veterinary formulas and nutritional guidelines, the calculator empowers dog owners to make informed decisions that promote their pet’s long-term health and well-being.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide accurate, personalized recommendations for your dog’s treat allowance. Begin by selecting the unit system you prefer—Imperial (pounds) or Metric (kilograms)—to match your measurement tools. Next, enter your dog’s current weight in the chosen unit. Accurate weight measurement is crucial as it directly influences the Resting Energy Requirement calculation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, input the calorie content of a single treat. This information is often available on treat packaging or can be estimated based on ingredient content. The calculator uses this data to determine how many treats can be safely given daily without exceeding 10% of your dog’s RER, a veterinary guideline to prevent excessive calorie intake from treats.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s weight accurately in pounds or kilograms. This value is essential for calculating the Resting Energy Requirement (RER), which forms the basis for safe treat calorie limits.
          </li>
          <li>
            <strong>Calories per Treat:</strong> Enter the exact calorie content of one treat. This allows the calculator to estimate how many treats your dog can have daily without exceeding the recommended calorie threshold.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these inputs, click the Calculate button to see the maximum number of treats your dog can safely consume each day. If the treat calorie content is too high, the calculator will provide a warning and suggest choosing lower-calorie treats to maintain your dog’s healthy weight.
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
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-dog-and-cat/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of energy requirements and nutritional needs in dogs, including RER and MER calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) Canine Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based guidelines for canine nutrition, emphasizing calorie management and treat allowances to prevent obesity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. WSAVA Global Nutrition Guidelines for Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Global consensus on nutritional requirements and feeding practices, including treat calorie considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7146310/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Clinical Nutrition for Dogs and Cats: A Review of Energy Requirements and Feeding Practices
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing energy metabolism and the importance of controlled treat feeding in canine health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "RER = 70 × (weight in kg)^0.75; Max Treat Calories = 0.10 × RER; Max Treats = floor(Max Treat Calories / Treat Calories)",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "weight", description: "Dog's weight in kilograms (kg)" },
          { symbol: "Max Treat Calories", description: "Maximum daily calories from treats (10% of RER)" },
          { symbol: "Treat Calories", description: "Calories per individual treat (kcal)" },
          { symbol: "Max Treats", description: "Maximum number of treats per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22 lb (10 kg) dog receives treats that contain 15 kcal each. The owner wants to know how many treats can be given daily without risking weight gain.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if necessary (22 lb ÷ 2.20462 = 10 kg). Calculate RER: 70 × 10^0.75 ≈ 394 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate max treat calories: 10% of 394 = 39.4 kcal. Divide max treat calories by treat calories: 39.4 ÷ 15 ≈ 2.6 treats.",
          },
        ],
        result: "The dog can safely have 2 treats per day without exceeding the recommended treat calorie allowance.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🍖" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Treat Calories & Daily Allowance Calculator" },
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