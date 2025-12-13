import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogProteinFatIntakeGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    goal: "maintenance",
  });

  // Protein and fat intake recommendations by goal (g per kg body weight)
  // Source: NRC Nutrient Requirements of Dogs and Cats, AAFCO guidelines, and veterinary nutrition consensus
  const intakeGuidelines = {
    growth: { protein: 4.0, fat: 2.5 }, // Puppies and growing dogs need higher protein and fat
    maintenance: { protein: 2.0, fat: 1.0 }, // Adult maintenance
    weight_loss: { protein: 2.5, fat: 0.8 }, // Slightly higher protein to preserve lean mass
    performance: { protein: 3.0, fat: 2.0 }, // Working or athletic dogs require elevated protein and fat
    senior: { protein: 2.5, fat: 1.0 }, // Older dogs need moderate protein, controlled fat
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight and select a goal.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    const goal = inputs.goal;
    if (!intakeGuidelines[goal]) {
      return {
        value: 0,
        label: "Select a valid goal.",
        subtext: null,
        warning: null,
      };
    }

    const proteinPerKg = intakeGuidelines[goal].protein;
    const fatPerKg = intakeGuidelines[goal].fat;

    // Calculate total protein and fat intake in grams
    const proteinGrams = +(proteinPerKg * weightKg).toFixed(1);
    const fatGrams = +(fatPerKg * weightKg).toFixed(1);

    // Calculate calories from protein and fat
    // Protein = 4 kcal/g, Fat = 9 kcal/g
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const totalCalories = proteinCalories + fatCalories;

    return {
      value: 1,
      label: `For a dog weighing ${weightKg.toFixed(1)} kg (${unit === "imperial" ? weightRaw + " lbs" : weightRaw + " kg"}) with goal "${goal}", recommended daily intake is:`,
      subtext: `${proteinGrams} g protein and ${fatGrams} g fat, providing approximately ${totalCalories} kcal from these macronutrients.`,
      warning: null,
      proteinGrams,
      fatGrams,
      totalCalories,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is protein intake important for dogs with different goals?",
      answer:
        "Protein is essential for tissue repair, muscle maintenance, and overall health in dogs. Growing puppies require higher protein to support rapid development, while athletic dogs need increased protein to repair muscle damage from exercise. Senior dogs benefit from moderate protein to preserve lean mass and prevent sarcopenia. Adjusting protein intake based on the dog's life stage and activity ensures optimal health and longevity.",
    },
    {
      question: "How does fat intake affect a dog's energy and health?",
      answer:
        "Fat is a dense energy source, providing 9 kcal per gram, which is more than double protein or carbohydrates. Dogs with high energy demands, such as working or performance dogs, require elevated fat intake to meet caloric needs efficiently. However, excessive fat can lead to obesity and pancreatitis, so fat intake must be balanced according to the dog's goal, age, and health status to maintain optimal body condition and metabolic health.",
    },
    {
      question: "How is the protein and fat intake calculated based on dog weight?",
      answer:
        "Protein and fat intake recommendations are expressed in grams per kilogram of body weight to tailor nutrition precisely. This method accounts for metabolic differences between small and large dogs. The calculator multiplies the dog's weight in kilograms by goal-specific protein and fat grams per kilogram values, ensuring individualized dietary planning that supports growth, maintenance, weight loss, or performance needs effectively.",
    },
    {
      question: "Can this guide replace veterinary advice for dog nutrition?",
      answer:
        "While this guide provides scientifically grounded estimates for protein and fat intake, it is not a substitute for personalized veterinary advice. Individual dogs may have unique health conditions, allergies, or metabolic requirements that necessitate tailored nutrition plans. Always consult a veterinarian or veterinary nutritionist before making significant dietary changes to ensure your dog's specific needs are met safely and effectively.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function onGoalChange(value: string) {
    setInputs((prev) => ({ ...prev, goal: value }));
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
        <div className="flex flex-col">
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
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your dog's current body weight.
          </p>
        </div>

        {/* Goal Select */}
        <div className="flex flex-col">
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Select Goal
          </Label>
          <Select value={inputs.goal} onValueChange={onGoalChange}>
            <SelectTrigger id="goal" className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth (Puppy)</SelectItem>
              <SelectItem value="maintenance">Maintenance (Adult)</SelectItem>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="performance">Performance (Athletic)</SelectItem>
              <SelectItem value="senior">Senior (Older Dogs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            /* Trigger recalculation by updating state */
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", goal: "maintenance" })}
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
                Estimated Daily Protein & Fat Intake
              </p>
              <p className="text-lg font-semibold text-blue-900 dark:text-white mb-2">{results.label}</p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.proteinGrams} g Protein / {results.fatGrams} g Fat
              </p>
              <p className="text-md text-slate-600 dark:text-slate-300 mt-2 font-medium">
                ≈ {results.totalCalories} kcal from protein and fat combined
              </p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary planning.
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
          Understanding Dog Protein/Fat Intake Guide (by Goal)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Protein and fat are two fundamental macronutrients that play critical roles in canine health and nutrition. Protein provides the essential amino acids necessary for muscle development, tissue repair, immune function, and enzyme production. Fat serves as a dense energy source, supports absorption of fat-soluble vitamins, and contributes to healthy skin and coat. The optimal intake of these macronutrients varies significantly depending on a dog’s life stage, activity level, and health goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Puppies and growing dogs require higher protein and fat levels to support rapid growth and development, while adult maintenance diets focus on balanced intake to sustain health without excess calories. Dogs undergoing weight loss benefit from increased protein to preserve lean muscle mass during caloric restriction, and athletic or working dogs need elevated fat and protein to meet their heightened energy demands. Senior dogs often require moderate protein with controlled fat to maintain muscle and prevent obesity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This guide uses scientifically validated intake recommendations expressed as grams of protein and fat per kilogram of body weight, allowing for precise, individualized dietary planning. By tailoring macronutrient intake to specific goals, pet owners and veterinary professionals can optimize canine health, performance, and longevity through nutrition.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recommended daily protein and fat intake for your dog based on its current weight and specific health or lifestyle goals. To use it effectively, follow these steps carefully to ensure accurate and meaningful results that can guide dietary decisions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Input Dog Weight:</strong> Enter your dog’s current body weight in either pounds (imperial) or kilograms (metric). Accurate weight measurement is crucial as the calculations are weight-dependent.
          </li>
          <li>
            <strong>Select Goal:</strong> Choose the goal that best matches your dog’s current life stage or condition, such as growth (puppy), maintenance (adult), weight loss, performance (athletic), or senior. Each goal has tailored protein and fat intake recommendations.
          </li>
          <li>
            <strong>Calculate:</strong> Click the “Calculate” button to generate the recommended daily protein and fat intake in grams, along with the estimated caloric contribution from these macronutrients.
          </li>
          <li>
            <strong>Interpret Results:</strong> Use the output to guide feeding plans, ensuring your dog receives balanced nutrition aligned with its physiological needs and lifestyle.
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
              href="https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Research Council (NRC) - Nutrient Requirements of Dogs and Cats (2006)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines detailing nutrient requirements for dogs and cats, including protein and fat intake recommendations by life stage and activity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aafco.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of American Feed Control Officials (AAFCO) Dog Food Nutrient Profiles
            </a>
            <p className="text-slate-500 text-sm">
              Regulatory standards for pet food nutrient profiles, providing minimum and recommended protein and fat levels for different dog life stages.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-WSAVA-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. WSAVA Global Nutrition Guidelines (2019)
            </a>
            <p className="text-slate-500 text-sm">
              World Small Animal Veterinary Association guidelines emphasizing balanced nutrition and macronutrient requirements tailored to canine health goals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149733/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Case Study: Effects of Dietary Protein and Fat on Canine Health (PMC Article)
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed research analyzing the impact of varying protein and fat levels on dog metabolism, body composition, and performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Protein/Fat Intake Guide (by Goal)"
      description="Guide for setting optimal **protein and fat ratios** in your dog's diet, tailored for growth, maintenance, or athletic performance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Protein Intake (g) = Weight (kg) × Protein Requirement (g/kg)  \nFat Intake (g) = Weight (kg) × Fat Requirement (g/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          {
            symbol: "Protein Requirement (g/kg)",
            description: "Recommended grams of protein per kilogram of body weight based on dog's goal",
          },
          {
            symbol: "Fat Requirement (g/kg)",
            description: "Recommended grams of fat per kilogram of body weight based on dog's goal",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) adult dog with a maintenance goal requires protein and fat intake calculation.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply weight by maintenance protein and fat requirements: Protein = 9.07 × 2.0 = 18.1 g; Fat = 9.07 × 1.0 = 9.1 g.",
          },
        ],
        result:
          "The dog should consume approximately 18.1 grams of protein and 9.1 grams of fat daily to maintain optimal health.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Protein/Fat Intake Guide (by Goal)" },
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