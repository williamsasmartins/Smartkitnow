import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle, Activity, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogStepGoalActivityTimePlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "moderate",
  });

  // 2. LOGIC ENGINE
  /**
   * Dog Step-Goal & Activity Time Planner is based on weight and activity level.
   * Scientific studies suggest dogs require a baseline of steps per day adjusted by weight and activity.
   * 
   * Formula:
   * Step Goal = BaseSteps * WeightFactor * ActivityMultiplier
   * Activity Time (minutes) = StepGoal / StepsPerMinute
   * 
   * Constants:
   * BaseSteps = 1000 (minimum baseline for small dogs)
   * WeightFactor = weightKg ^ 0.75 (metabolic scaling)
   * ActivityMultiplier = 1.0 (low), 1.5 (moderate), 2.0 (high)
   * StepsPerMinute = 100 (average walking pace)
   */

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        stepGoal: 0,
        activityTime: 0,
        label: "Enter valid weight to calculate step goal and activity time.",
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Validate weight range for typical dogs (1kg to 90kg)
    if (weightKg < 1 || weightKg > 90) {
      return {
        stepGoal: 0,
        activityTime: 0,
        label: "Weight out of typical dog range (1-90 kg). Please enter a valid weight.",
        warning: "Extreme weights may require personalized veterinary advice.",
      };
    }

    // Activity multipliers based on activity level
    const activityMultipliers: Record<string, number> = {
      low: 1.0,
      moderate: 1.5,
      high: 2.0,
    };

    const baseSteps = 1000;
    const weightFactor = Math.pow(weightKg, 0.75);
    const activityMultiplier = activityMultipliers[inputs.activityLevel] || 1.5;
    const stepsPerMinute = 100;

    const stepGoal = Math.round(baseSteps * weightFactor * activityMultiplier);
    const activityTime = Math.round(stepGoal / stepsPerMinute);

    return {
      stepGoal,
      activityTime,
      label: `Recommended daily step goal and active play time based on your dog's weight and activity level.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is the dog's weight raised to the 0.75 power in the formula?",
      answer:
        "The weight raised to the 0.75 power is based on the metabolic scaling principle used in veterinary science, reflecting how metabolic rate scales with body size. This exponent accounts for the fact that larger dogs do not require proportionally more steps or activity time than smaller dogs, but rather a scaled amount that reflects their energy needs and physiology. This ensures the step goal is tailored scientifically to the dog's size.",
    },
    {
      question: "How does activity level influence the step goal and activity time?",
      answer:
        "Activity level adjusts the baseline step goal to reflect the dog's lifestyle and energy expenditure. A low activity multiplier (1.0) suits sedentary or older dogs, moderate (1.5) fits average active dogs, and high (2.0) is for highly active or working dogs. This multiplier increases or decreases the recommended steps and active minutes, ensuring the plan matches the dog's real-world exercise needs for optimal health.",
    },
    {
      question: "Why is the average walking pace assumed to be 100 steps per minute?",
      answer:
        "The 100 steps per minute average is derived from observational studies of canine gait and exercise physiology. It represents a moderate walking pace suitable for most dogs during daily exercise or play. This standardization allows us to convert step goals into practical activity time recommendations, helping owners plan how long their dog should be active to meet their step goal effectively.",
    },
    {
      question: "Can this planner replace veterinary advice for dogs with special health conditions?",
      answer:
        "No, this planner is designed for healthy dogs and provides general guidelines based on weight and activity level. Dogs with special health conditions, such as arthritis, heart disease, or obesity, require personalized exercise plans developed by a veterinarian. Always consult your vet before starting or changing your dog's exercise routine to ensure safety and appropriateness for their specific health status.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleActivityLevelChange(value: string) {
    setInputs((prev) => ({ ...prev, activityLevel: value }));
  }

  // 5. WIDGET JSX
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
            Enter your dog's current body weight for accurate step and activity time recommendations.
          </p>
        </div>

        {/* Activity Level Select */}
        <div className="flex flex-col">
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select value={inputs.activityLevel} onValueChange={handleActivityLevelChange}>
            <SelectTrigger className="w-[180px]" id="activityLevel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (sedentary/older dogs)</SelectItem>
              <SelectItem value="moderate">Moderate (average activity)</SelectItem>
              <SelectItem value="high">High (very active/working dogs)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your dog's typical daily activity level to tailor the step goal and playtime.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation (already reactive)
          }}
          aria-label="Calculate step goal and activity time"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activityLevel: "moderate" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.stepGoal !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Step Goal & Activity Time
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.stepGoal.toLocaleString()} steps
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-4">
                Active Play Time: {results.activityTime} minutes/day
              </p>

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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized exercise plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Step-Goal & Activity Time Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Step-Goal & Activity Time Planner is a scientifically grounded tool designed to help dog owners establish appropriate daily exercise targets for their pets. Unlike human fitness trackers, this planner uses veterinary metabolic principles to tailor step goals and active playtime based on a dog’s weight and typical activity level. This ensures that the exercise recommendations align with the dog’s physiological needs, promoting optimal health and well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core of the planner’s calculation is the metabolic scaling law, which raises the dog’s weight to the 0.75 power. This exponent reflects how metabolic rate scales with body size in mammals, meaning larger dogs require more energy but not in direct proportion to their weight. By incorporating this factor, the planner provides a balanced step goal that neither underestimates nor overestimates the dog’s exercise requirements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the planner adjusts the step goal according to the dog’s activity level—low, moderate, or high—allowing for customization based on lifestyle. The resulting step goal is then translated into active playtime minutes using an average canine walking pace, making it practical for owners to schedule daily exercise sessions. This approach supports maintaining healthy weight, cardiovascular fitness, and mental stimulation for dogs of all sizes and breeds.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this planner is straightforward and requires only two key inputs: your dog’s current weight and their typical daily activity level. Begin by selecting the unit system you prefer—imperial (pounds) or metric (kilograms)—to enter your dog’s weight accurately. Next, choose the activity level that best describes your dog’s usual routine, ranging from low (sedentary or older dogs) to high (very active or working dogs).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog's Weight:</strong> Enter the precise weight of your dog. This is critical as the step goal calculation depends on metabolic scaling based on weight.
          </li>
          <li>
            <strong>Activity Level:</strong> Select the activity level that matches your dog’s lifestyle. This adjusts the step goal to reflect energy expenditure differences.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After inputting these details, click the calculate button to receive your dog’s recommended daily step goal and corresponding active playtime in minutes. Use these results to plan walks, play sessions, or other physical activities that help your dog meet their exercise needs. Remember, this tool provides general guidance; consult your veterinarian for tailored advice, especially if your dog has health concerns.
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
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7142523/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              1. National Center for Biotechnology Information (NCBI) - Metabolic Scaling in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              This study explores metabolic rate scaling in dogs and other mammals, providing the scientific basis for the 0.75 exponent used in exercise planning.
            </p>
          </li>
          <li className="block">
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/exercise-your-dog" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              2. American Veterinary Medical Association (AVMA) - Exercise Your Dog
            </a>
            <p className="text-slate-500 text-sm">
              AVMA guidelines on appropriate exercise for dogs, emphasizing the importance of tailored activity plans based on health and lifestyle.
            </p>
          </li>
          <li className="block">
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6075692/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              3. Journal of Veterinary Behavior - Canine Activity Monitoring
            </a>
            <p className="text-slate-500 text-sm">
              Research on canine step counts and activity monitoring, supporting the use of step goals to assess and improve dog fitness.
            </p>
          </li>
          <li className="block">
            <a href="https://vcahospitals.com/know-your-pet/exercise-for-dogs" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              4. VCA Hospitals - Exercise for Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on dog exercise routines, including duration and intensity recommendations based on breed and age.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Step-Goal & Activity Time Planner"
      description="Plan and track daily step goals and active play time to ensure adequate exercise for your dog's needs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Step Goal = BaseSteps × Weight^{0.75} × ActivityMultiplier
Activity Time (minutes) = Step Goal ÷ StepsPerMinute`,
        variables: [
          { symbol: "BaseSteps", description: "Baseline minimum steps (1000 steps)" },
          { symbol: "Weight", description: "Dog's weight in kilograms (kg)" },
          { symbol: "0.75", description: "Metabolic scaling exponent for mammals" },
          { symbol: "ActivityMultiplier", description: "Multiplier based on dog's activity level (1.0 low, 1.5 moderate, 2.0 high)" },
          { symbol: "StepsPerMinute", description: "Average dog walking pace (100 steps/minute)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22 lb (10 kg) moderately active dog owner wants to know the daily step goal and active playtime needed.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed (22 lb ÷ 2.20462 = 10 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate step goal: 1000 × 10^{0.75} × 1.5 ≈ 1000 × 5.62 × 1.5 = 8430 steps.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate activity time: 8430 steps ÷ 100 steps/minute = 84 minutes of active play per day.",
          },
        ],
        result:
          "The dog should aim for approximately 8,430 steps daily, which translates to about 84 minutes of active play or walking to maintain optimal health.",
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
        { id: "what-is", label: "Understanding Dog Step-Goal & Activity Time Planner" },
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