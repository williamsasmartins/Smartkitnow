import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Info, ChevronRight } from "lucide-react";

function DogWeightLossPlannerCalculator() {
  // 1. State
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [activityLevel, setActivityLevel] = useState("neutered_adult");
  const [lifeStage, setLifeStage] = useState("adult");
  const [isPregnant, setIsPregnant] = useState(false);
  const [isLactating, setIsLactating] = useState(false);

  // 2. Calculation
  // RER = 70 * (weight in kg)^0.75
  // MER = RER * factor (depends on activity/lifestage)
  // Factors (approximate):
  // - Neutered adult: 1.6
  // - Intact adult: 1.8
  // - Weight loss: 1.0
  // - Weight gain: 1.2 - 1.8 (use 1.4 average)
  // - Puppy (0-4 months): 3.0
  // - Puppy (4 months to adult): 2.0
  // - Pregnant: 3.0 (last trimester)
  // - Lactating: 4.0 (peak lactation)
  // Activity levels mapped to factors:
  // "neutered_adult": 1.6
  // "intact_adult": 1.8
  // "weight_loss": 1.0
  // "weight_gain": 1.4
  // "puppy_0_4": 3.0
  // "puppy_4_adult": 2.0
  // "pregnant": 3.0
  // "lactating": 4.0

  // Convert weight to kg if in lbs
  const weightKg = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    return weightUnit === "kg" ? w : w * 0.453592;
  }, [weight, weightUnit]);

  // Determine MER factor based on selections
  const merFactor = useMemo(() => {
    if (isLactating) return 4.0;
    if (isPregnant) return 3.0;
    if (lifeStage === "puppy_0_4") return 3.0;
    if (lifeStage === "puppy_4_adult") return 2.0;
    switch (activityLevel) {
      case "neutered_adult":
        return 1.6;
      case "intact_adult":
        return 1.8;
      case "weight_loss":
        return 1.0;
      case "weight_gain":
        return 1.4;
      default:
        return 1.6;
    }
  }, [activityLevel, lifeStage, isPregnant, isLactating]);

  // Calculate RER and MER
  const results = useMemo(() => {
    if (!weightKg) return null;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const mer = rer * merFactor;
    return {
      rer: rer,
      mer: mer,
    };
  }, [weightKg, merFactor]);

  // Reset pregnancy/lactation if lifeStage or activityLevel changes
  function onLifeStageChange(e) {
    const val = e.target.value;
    setLifeStage(val);
    setIsPregnant(false);
    setIsLactating(false);
    if (val === "adult") {
      setActivityLevel("neutered_adult");
    }
  }

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description={
        "Calculate your dog's " +
        "**Resting Energy Requirement (RER)** and " +
        "**Maintenance Energy Requirement (MER)** to determine daily calorie needs."
      }
      widget={
        <div className="space-y-6 max-w-md mx-auto">
          <Card className="p-6 space-y-4 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <Calculator className="text-blue-600" />
              <h3 className="text-lg font-semibold">Input Your Dog's Details</h3>
            </div>

            <div>
              <Label htmlFor="weight" className="mb-1 block font-medium">
                Weight
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-grow"
                  aria-describedby="weight-unit"
                />
                <select
                  id="weight-unit"
                  className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="life-stage" className="mb-1 block font-medium">
                Life Stage
              </Label>
              <select
                id="life-stage"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={lifeStage}
                onChange={onLifeStageChange}
              >
                <option value="adult">Adult Dog</option>
                <option value="puppy_0_4">Puppy (0-4 months)</option>
                <option value="puppy_4_adult">Puppy (4 months to adult)</option>
              </select>
            </div>

            {lifeStage === "adult" && (
              <div>
                <Label className="mb-1 block font-medium">Activity Level</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActivityLevel("neutered_adult")}
                    className={
                      "rounded-md px-3 py-1.5 text-sm font-medium border " +
                      (activityLevel === "neutered_adult"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100")
                    }
                  >
                    Neutered Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityLevel("intact_adult")}
                    className={
                      "rounded-md px-3 py-1.5 text-sm font-medium border " +
                      (activityLevel === "intact_adult"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100")
                    }
                  >
                    Intact Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityLevel("weight_loss")}
                    className={
                      "rounded-md px-3 py-1.5 text-sm font-medium border " +
                      (activityLevel === "weight_loss"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100")
                    }
                  >
                    Weight Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityLevel("weight_gain")}
                    className={
                      "rounded-md px-3 py-1.5 text-sm font-medium border " +
                      (activityLevel === "weight_gain"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100")
                    }
                  >
                    Weight Gain
                  </button>
                </div>
              </div>
            )}

            {lifeStage === "adult" && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Label className="block font-medium">Special Conditions</Label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPregnant}
                      onChange={(e) => {
                        setIsPregnant(e.target.checked);
                        if (e.target.checked) setIsLactating(false);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span>Pregnant (last trimester)</span>
                  </label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLactating}
                      onChange={(e) => {
                        setIsLactating(e.target.checked);
                        if (e.target.checked) setIsPregnant(false);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span>Lactating (peak)</span>
                  </label>
                </div>
              </div>
            )}

            {results && (
              <Card className="bg-blue-50 border-blue-300 p-4 mt-4 shadow-md">
                <div className="flex items-center space-x-3">
                  <Calculator className="text-blue-700" size={28} />
                  <h4 className="text-lg font-semibold text-blue-900">
                    Results
                  </h4>
                </div>
                <div className="mt-3 space-y-2 text-blue-900">
                  <p>
                    <strong>Resting Energy Requirement (RER): </strong>
                    {results.rer.toFixed(0)} kcal/day
                  </p>
                  <p>
                    <strong>Maintenance Energy Requirement (MER): </strong>
                    {results.mer.toFixed(0)} kcal/day
                  </p>
                  <p className="italic text-sm text-blue-800">
                    * MER is the estimated daily calorie need based on your dog's activity and life stage.
                  </p>
                </div>
              </Card>
            )}
          </Card>
        </div>
      }
      editorial={
        <div className="space-y-8 max-w-3xl mx-auto prose prose-blue">
          <section id="how-it-works">
            <h2>How It Works</h2>
            <p>
              This calculator estimates your dog's daily calorie needs by calculating two key values:
              <strong> Resting Energy Requirement (RER)</strong> and <strong>Maintenance Energy Requirement (MER)</strong>.
            </p>
            <p>
              <strong>Resting Energy Requirement (RER)</strong> represents the energy your dog needs at rest to maintain basic bodily functions such as breathing, circulation, and cellular metabolism. It is calculated using the formula:
            </p>
            <p className="font-mono text-lg text-gray-700">
              RER = 70 × (Body Weight in kg)<sup>0.75</sup>
            </p>
            <p>
              The exponent 0.75 reflects metabolic scaling in mammals, meaning larger dogs require more energy but not in direct proportion to their weight.
            </p>
            <p>
              <strong>Maintenance Energy Requirement (MER)</strong> adjusts the RER based on your dog's activity level, life stage, and physiological state. MER accounts for calories burned during exercise, growth, pregnancy, lactation, and other factors.
            </p>
            <p>
              MER is calculated by multiplying RER by a factor that varies depending on your dog's condition:
            </p>
            <ul>
              <li>Neutered adult dogs: 1.6 × RER</li>
              <li>Intact adult dogs: 1.8 × RER</li>
              <li>Puppies (0-4 months): 3.0 × RER</li>
              <li>Puppies (4 months to adult): 2.0 × RER</li>
              <li>Weight loss programs: 1.0 × RER</li>
              <li>Weight gain programs: 1.4 × RER</li>
              <li>Pregnant dogs (last trimester): 3.0 × RER</li>
              <li>Lactating dogs (peak): 4.0 × RER</li>
            </ul>
            <p>
              By entering your dog's weight, life stage, and activity level, this calculator applies these formulas to provide an accurate estimate of daily calorie needs.
            </p>
          </section>

          <section id="best-practices">
            <h2>Best Practices / Expert Advice</h2>
            <p>
              Proper nutrition is essential for your dog's health, energy, and longevity. Here are some expert tips to optimize your dog's calorie intake:
            </p>
            <ul>
              <li>
                <strong>Accurate Weight Measurement:</strong> Use a reliable scale to measure your dog's weight regularly. Weight fluctuations can indicate health issues or dietary imbalances.
              </li>
              <li>
                <strong>Adjust for Activity:</strong> Dogs with high activity levels or working dogs require more calories. Adjust MER accordingly.
              </li>
              <li>
                <strong>Monitor Body Condition:</strong> Use body condition scoring to assess if your dog is underweight, ideal, or overweight, and adjust calorie intake as needed.
              </li>
              <li>
                <strong>Special Life Stages:</strong> Puppies, pregnant, and lactating dogs have significantly higher calorie needs. Consult your veterinarian for tailored feeding plans.
              </li>
              <li>
                <strong>Gradual Changes:</strong> When changing calorie intake for weight loss or gain, do so gradually to avoid digestive upset.
              </li>
              <li>
                <strong>Quality Nutrition:</strong> Calories should come from balanced diets with appropriate protein, fat, vitamins, and minerals.
              </li>
              <li>
                <strong>Regular Vet Checkups:</strong> Regular veterinary visits help monitor your dog's health and nutritional status.
              </li>
            </ul>
          </section>

          <section id="faq">
            <h2>FAQ</h2>
            <dl>
              <dt>What is the difference between RER and MER?</dt>
              <dd>
                RER is the energy needed for basic bodily functions at rest, while MER includes additional calories needed for daily activities, growth, or reproduction.
              </dd>

              <dt>Why do puppies need more calories than adult dogs?</dt>
              <dd>
                Puppies are growing rapidly and have higher metabolic rates, so their calorie needs are significantly higher to support development.
              </dd>

              <dt>Can I use this calculator for all dog breeds?</dt>
              <dd>
                Yes, the formulas are based on metabolic principles applicable to all breeds, but individual needs may vary. Always monitor your dog's condition.
              </dd>

              <dt>How often should I recalculate my dog's calorie needs?</dt>
              <dd>
                Recalculate whenever your dog's weight, activity level, or life stage changes, or at least every 3-6 months.
              </dd>

              <dt>Does this calculator consider treats and snacks?</dt>
              <dd>
                No, treats and snacks add extra calories. Include them in your dog's total daily calorie budget to avoid overfeeding.
              </dd>
            </dl>
          </section>

          <section id="references">
            <h2>References</h2>
            <ul>
              <li>National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press.</li>
              <li>Veterinary Journals: Journal of Veterinary Internal Medicine, Journal of Animal Physiology and Animal Nutrition.</li>
              <li>WSAVA Global Nutrition Guidelines.</li>
              <li>Merck Veterinary Manual.</li>
              <li>American Animal Hospital Association (AAHA) Canine Life Stage Nutrition Guidelines.</li>
            </ul>
          </section>
        </div>
      }
      onThisPage={[
        { id: "how-it-works", label: "How It Works" },
        { id: "best-practices", label: "Best Practices" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      relatedCalculators={[
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🔗",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🔗",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🔗",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🔗",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🔗",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🔗",
        },
      ]}
      formula={{
        title: "Formula",
        formula:
          "RER = 70 × (Body Weight in kg)^0.75; MER = RER × Activity Factor",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement - calories needed at rest",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement - total daily calorie needs",
          },
          {
            symbol: "Body Weight",
            description: "Dog's weight in kilograms",
          },
          {
            symbol: "Activity Factor",
            description:
              "Multiplier based on life stage and activity (e.g., 1.6 for neutered adult)",
          },
        ],
      }}
      example={{
        title: "Example Scenario",
        scenario:
          "A 20 kg neutered adult dog with moderate activity level.",
        steps: [
          "Calculate RER: 70 × (20)^0.75 ≈ 70 × 9.45 = 661.5 kcal/day",
          "Apply MER factor for neutered adult: 1.6",
          "Calculate MER: 661.5 × 1.6 = 1058.4 kcal/day",
        ],
        result:
          "The dog requires approximately 1058 kcal per day to maintain weight and activity.",
      }}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default DogWeightLossPlannerCalculator;
