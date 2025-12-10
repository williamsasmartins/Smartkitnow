import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen } from "lucide-react";

const DogCalorieNeedsRerMerCalculator = () => {
  // State for inputs
  const [weightKg, setWeightKg] = useState(10);
  const [weightLbs, setWeightLbs] = useState(22);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<"neutered" | "intact" | "inactive" | "active" | "weightLoss" | "weightGain">("neutered");
  const [lifeStage, setLifeStage] = useState<"puppy" | "adult" | "senior">("adult");
  const [bodyConditionScore, setBodyConditionScore] = useState(5);
  const [specialCondition, setSpecialCondition] = useState<"none" | "pregnant" | "lactating">("none");

  // Refs for smooth scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Convert weight to kg if needed
  const weightKgMemo = useMemo(() => {
    if (weightUnit === "kg") return weightKg;
    return weightLbs / 2.20462;
  }, [weightKg, weightLbs, weightUnit]);

  // Convert weight to lbs if needed
  const weightLbsMemo = useMemo(() => {
    if (weightUnit === "lbs") return weightLbs;
    return weightKg * 2.20462;
  }, [weightKg, weightLbs, weightUnit]);

  // Calculate Resting Energy Requirement (RER)
  // Formula: RER = 70 * (weight in kg) ^ 0.75
  const rer = useMemo(() => {
    return 70 * Math.pow(weightKgMemo, 0.75);
  }, [weightKgMemo]);

  // Calculate Maintenance Energy Requirement (MER)
  // MER multipliers based on activity level and life stage
  const merMultiplier = useMemo(() => {
    if (lifeStage === "puppy") {
      // Puppies have different multipliers by age, simplified here
      return 3.0; // growing puppies
    }
    if (lifeStage === "senior") {
      return 1.4; // older dogs lower energy needs
    }
    // Adult dogs
    switch (activityLevel) {
      case "neutered":
        return 1.6;
      case "intact":
        return 1.8;
      case "inactive":
        return 1.2;
      case "active":
        return 2.0;
      case "weightLoss":
        return 1.0;
      case "weightGain":
        return 2.5;
      default:
        return 1.6;
    }
  }, [activityLevel, lifeStage]);

  // Adjust MER for special conditions
  const specialConditionMultiplier = useMemo(() => {
    switch (specialCondition) {
      case "pregnant":
        return 1.8;
      case "lactating":
        return 3.0;
      default:
        return 1.0;
    }
  }, [specialCondition]);

  // Final MER calculation
  const mer = useMemo(() => {
    return rer * merMultiplier * specialConditionMultiplier;
  }, [rer, merMultiplier, specialConditionMultiplier]);

  // Scroll to results when MER changes
  useMemo(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mer]);

  // Tables data for activity multipliers
  const activityMultipliers = [
    { level: "Neutered Adult", multiplier: 1.6, description: "Typical adult dog after neutering/spaying" },
    { level: "Intact Adult", multiplier: 1.8, description: "Adult dog not neutered or spayed" },
    { level: "Inactive/Obese Prone", multiplier: 1.2, description: "Less active or prone to obesity" },
    { level: "Active/Working Dog", multiplier: 2.0, description: "Highly active or working dogs" },
    { level: "Weight Loss", multiplier: 1.0, description: "Reduced calories for weight loss" },
    { level: "Weight Gain", multiplier: 2.5, description: "Increased calories for weight gain" },
  ];

  const lifeStageMultipliers = [
    { stage: "Puppy (up to 4 months)", multiplier: 3.0 },
    { stage: "Adult", multiplier: 1.6 },
    { stage: "Senior", multiplier: 1.4 },
  ];

  const specialConditionMultipliers = [
    { condition: "Pregnant", multiplier: 1.8 },
    { condition: "Lactating", multiplier: 3.0 },
    { condition: "None", multiplier: 1.0 },
  ];

  // onThisPage links
  const onThisPage = [
    { id: "how-to-use", label: "How to Use" },
    { id: "formula", label: "Formula" },
    { id: "example", label: "Example" },
    { id: "mistakes", label: "Common Mistakes" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "references", label: "References" },
  ];

  // Related calculators
  const relatedCalculators = [
    { slug: "cat-calorie-needs", label: "Cat Calorie Needs Calculator", emoji: "🐱" },
    { slug: "dog-weight-loss", label: "Dog Weight Loss Calculator", emoji: "⚖️" },
    { slug: "dog-food-portion", label: "Dog Food Portion Calculator", emoji: "🍖" },
    { slug: "puppy-growth-tracker", label: "Puppy Growth Tracker", emoji: "🐾" },
    { slug: "dog-water-intake", label: "Dog Water Intake Calculator", emoji: "💧" },
    { slug: "dog-ideal-weight", label: "Dog Ideal Weight Calculator", emoji: "📏" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      onThisPage={onThisPage}
      formula={
        <>
          <p>
            The Resting Energy Requirement (RER) is calculated using the formula: <code>RER = 70 × (Body Weight in kg)^0.75</code>.
            The Maintenance Energy Requirement (MER) is then calculated by multiplying the RER by an activity/life stage multiplier.
          </p>
        </>
      }
      example={
        <>
          <p>
            For example, a neutered adult dog weighing 10 kg would have an RER of approximately 394 kcal/day and a MER of about 630 kcal/day (using a multiplier of 1.6).
          </p>
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Calculator className="inline mr-2" /> Input Your Dog's Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                <Scale size={16} /> Weight
              </Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weightUnit === "kg" ? weightKg : weightLbs}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      if (weightUnit === "kg") setWeightKg(val);
                      else setWeightLbs(val);
                    }
                  }}
                  aria-describedby="weight-desc"
                />
                <select
                  aria-label="Weight unit"
                  className="border rounded px-2"
                  value={weightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value as "kg" | "lbs";
                    if (newUnit === weightUnit) return;
                    if (newUnit === "kg") {
                      setWeightKg(weightLbs / 2.20462);
                    } else {
                      setWeightLbs(weightKg * 2.20462);
                    }
                    setWeightUnit(newUnit);
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              <p id="weight-desc" className="text-sm text-muted-foreground mt-1">
                Enter your dog's current weight.
              </p>
            </div>

            <div>
              <Label htmlFor="lifeStage" className="mb-1 flex items-center gap-1">
                <Dog size={16} /> Life Stage
              </Label>
              <select
                id="lifeStage"
                className="w-full border rounded px-3 py-2"
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value as typeof lifeStage)}
              >
                <option value="puppy">Puppy</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                <Activity size={16} /> Activity Level
              </Label>
              <select
                id="activityLevel"
                className="w-full border rounded px-3 py-2"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
                disabled={lifeStage === "puppy" || lifeStage === "senior"}
              >
                <option value="neutered">Neutered Adult</option>
                <option value="intact">Intact Adult</option>
                <option value="inactive">Inactive/Obese Prone</option>
                <option value="active">Active/Working Dog</option>
                <option value="weightLoss">Weight Loss</option>
                <option value="weightGain">Weight Gain</option>
              </select>
              {lifeStage === "puppy" && (
                <p className="text-sm text-muted-foreground mt-1">Activity level is fixed for puppies.</p>
              )}
              {lifeStage === "senior" && (
                <p className="text-sm text-muted-foreground mt-1">Activity level is fixed for senior dogs.</p>
              )}
            </div>

            <div>
              <Label htmlFor="specialCondition" className="mb-1 flex items-center gap-1">
                <HeartPulse size={16} /> Special Condition
              </Label>
              <select
                id="specialCondition"
                className="w-full border rounded px-3 py-2"
                value={specialCondition}
                onChange={(e) => setSpecialCondition(e.target.value as typeof specialCondition)}
              >
                <option value="none">None</option>
                <option value="pregnant">Pregnant</option>
                <option value="lactating">Lactating</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        ref={resultsRef}
        className="mb-6 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10"
      >
        <CardHeader>
          <CardTitle>
            <Flame className="inline mr-2" /> Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg font-semibold">
            Based on the input data, your dog's estimated daily calorie needs are:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-4 rounded-lg bg-white/80 shadow">
              <h3 className="text-xl font-bold mb-2">Resting Energy Requirement (RER)</h3>
              <p className="text-3xl font-extrabold text-emerald-700">{rer.toFixed(0)} kcal/day</p>
              <p className="text-sm text-muted-foreground mt-1">Energy needed at rest</p>
            </div>
            <div className="p-4 rounded-lg bg-white/80 shadow">
              <h3 className="text-xl font-bold mb-2">Maintenance Energy Requirement (MER)</h3>
              <p className="text-3xl font-extrabold text-blue-700">{mer.toFixed(0)} kcal/day</p>
              <p className="text-sm text-muted-foreground mt-1">Energy needed for daily activity & life stage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <TableHeader className="flex items-center gap-2">
              <Activity size={20} /> Activity Level Multipliers
            </TableHeader>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Level</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityMultipliers.map(({ level, multiplier, description }) => (
                <TableRow key={level}>
                  <TableCell>{level}</TableCell>
                  <TableCell>{multiplier.toFixed(2)}</TableCell>
                  <TableCell>{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <TableHeader className="flex items-center gap-2">
              <Dog size={20} /> Life Stage Multipliers
            </TableHeader>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Life Stage</TableHead>
                <TableHead>Multiplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lifeStageMultipliers.map(({ stage, multiplier }) => (
                <TableRow key={stage}>
                  <TableCell>{stage}</TableCell>
                  <TableCell>{multiplier.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <TableHeader className="flex items-center gap-2">
              <HeartPulse size={20} /> Special Condition Multipliers
            </TableHeader>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>Multiplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialConditionMultipliers.map(({ condition, multiplier }) => (
                <TableRow key={condition}>
                  <TableCell>{condition}</TableCell>
                  <TableCell>{multiplier.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section id="how-to-use" className="mb-12 prose max-w-none">
        <h2>How to Use</h2>
        <p>
          This calculator helps you estimate the daily calorie needs of your dog based on their weight, life stage, activity level, and special conditions such as pregnancy or lactation. Enter your dog's weight in kilograms or pounds, select their life stage and activity level, and specify if they have any special conditions. The calculator will instantly provide the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER).
        </p>
        <p>
          The RER represents the energy needed for basic bodily functions at rest, while the MER accounts for additional energy expenditure due to activity, growth, reproduction, or other factors. Use these values to guide feeding amounts and ensure your dog maintains a healthy weight and energy balance.
        </p>
        <p>
          If you are unsure about your dog's activity level or life stage, consult your veterinarian for guidance. This calculator is a tool to assist you but does not replace professional advice.
        </p>
        <p>
          Remember to monitor your dog's weight and condition regularly and adjust feeding as needed.
        </p>
      </section>

      <section id="formula" className="mb-12 prose max-w-none">
        <h2>Formula</h2>
        <p>
          The foundational formula used in this calculator is the Resting Energy Requirement (RER), which estimates the calories required for a dog at rest to maintain vital functions:
        </p>
        <pre>
          <code>RER = 70 × (Body Weight in kg)^0.75</code>
        </pre>
        <p>
          This formula is widely accepted in veterinary nutrition and provides a baseline energy requirement.
        </p>
        <p>
          To estimate the Maintenance Energy Requirement (MER), which includes the energy needed for activity, growth, reproduction, and other factors, the RER is multiplied by a factor depending on the dog's life stage and activity level:
        </p>
        <pre>
          <code>MER = RER × Activity Multiplier × Special Condition Multiplier</code>
        </pre>
        <p>
          The activity multiplier varies from about 1.0 for weight loss to 3.0 for puppies or lactating females. This multiplier adjusts the baseline RER to reflect the dog's actual energy needs.
        </p>
        <p>
          These formulas are based on extensive research and guidelines from veterinary nutrition authorities.
        </p>
      </section>

      <section id="example" className="mb-12 prose max-w-none">
        <h2>Example</h2>
        <p>
          Let's consider a typical example: a neutered adult dog weighing 10 kg.
        </p>
        <p>
          First, calculate the RER:
        </p>
        <pre>
          <code>RER = 70 × (10)^0.75 ≈ 394 kcal/day</code>
        </pre>
        <p>
          Next, apply the activity multiplier for a neutered adult dog (1.6):
        </p>
        <pre>
          <code>MER = 394 × 1.6 = 630 kcal/day</code>
        </pre>
        <p>
          Therefore, this dog requires approximately 630 kilocalories per day to maintain its current weight and activity level.
        </p>
        <p>
          If the dog were pregnant, the special condition multiplier of 1.8 would apply:
        </p>
        <pre>
          <code>MER = 394 × 1.6 × 1.8 = 1136 kcal/day</code>
        </pre>
        <p>
          This increase reflects the additional energy demands of pregnancy.
        </p>
      </section>

      <section id="mistakes" className="mb-12 prose max-w-none">
        <h2>Common Mistakes</h2>
        <p>
          When calculating your dog's calorie needs, avoid these common mistakes:
        </p>
        <ul>
          <li>
            <strong>Using inaccurate weight:</strong> Weigh your dog regularly and use the current weight, not an estimate or ideal weight.
          </li>
          <li>
            <strong>Ignoring life stage:</strong> Puppies, seniors, and pregnant or lactating dogs have different energy needs.
          </li>
          <li>
            <strong>Misjudging activity level:</strong> Overestimating activity can lead to overfeeding and weight gain.
          </li>
          <li>
            <strong>Not adjusting for special conditions:</strong> Pregnancy and lactation significantly increase energy requirements.
          </li>
          <li>
            <strong>Feeding based solely on calorie counts:</strong> Quality of food, nutrient balance, and feeding frequency also matter.
          </li>
          <li>
            <strong>Failing to monitor weight and condition:</strong> Regularly check your dog's body condition score and adjust feeding accordingly.
          </li>
        </ul>
        <p>
          Consult your veterinarian if you are unsure about any aspect of your dog's nutrition.
        </p>
      </section>

      <section id="faq" className="mb-12 prose max-w-none">
        <h2>Frequently Asked Questions</h2>
        <dl>
          <dt>What is the difference between RER and MER?</dt>
          <dd>
            RER (Resting Energy Requirement) is the energy your dog needs at rest for vital functions. MER (Maintenance Energy Requirement) includes additional energy for activity, growth, reproduction, and other factors.
          </dd>

          <dt>Can I use this calculator for puppies?</dt>
          <dd>
            Yes, select the "Puppy" life stage. The calculator uses a higher multiplier to account for growth energy needs.
          </dd>

          <dt>How often should I recalculate my dog's calorie needs?</dt>
          <dd>
            Recalculate whenever your dog's weight, activity level, or life stage changes, or at least every 3-6 months.
          </dd>

          <dt>Why does my dog's MER seem high compared to feeding guidelines?</dt>
          <dd>
            MER is an estimate and individual needs vary. Feeding guidelines may differ based on food type and quality. Always monitor your dog's weight and condition.
          </dd>

          <dt>Does this calculator consider breed differences?</dt>
          <dd>
            No, breed-specific metabolism is not accounted for. Some breeds may have higher or lower energy needs.
          </dd>

          <dt>How do I convert calories to cups of food?</dt>
          <dd>
            Check the calorie content per cup on your dog food packaging, then divide the MER by that number to get cups per day.
          </dd>

          <dt>Is the calculator accurate for overweight dogs?</dt>
          <dd>
            For overweight dogs, use the ideal weight rather than current weight to calculate calorie needs for weight loss.
          </dd>

          <dt>Can I use this calculator for cats?</dt>
          <dd>
            No, cats have different energy requirements. Use a dedicated cat calorie needs calculator.
          </dd>

          <dt>What if my dog has a medical condition?</dt>
          <dd>
            Consult your veterinarian, as medical conditions can significantly affect energy needs.
          </dd>

          <dt>Why is the exponent 0.75 in the RER formula?</dt>
          <dd>
            The 0.75 power relates to metabolic scaling laws and reflects how metabolic rate changes with body size.
          </dd>
        </dl>
      </section>

      <section id="references" className="mb-12 prose max-w-none">
        <h2>
          <BookOpen className="inline mr-2" /> References
        </h2>
        <ol>
          <li>
            National Research Council. <em>Nutrition Requirements of Dogs and Cats</em>. National Academies Press, 2006.
          </li>
          <li>
            Freeman, L.M., et al. "Energy requirements of adult dogs." <em>Journal of Nutrition</em>, vol. 134, no. 6, 2004, pp. 1548S-1551S.
          </li>
          <li>
            National Research Council. <em>Energy Requirements of Dogs and Cats</em>. 2006.
          </li>
          <li>
            Case, L.P., et al. <em>Canine and Feline Nutrition: A Resource for Companion Animal Professionals</em>. 3rd ed., Elsevier, 2011.
          </li>
          <li>
            German, A.J. "The growing problem of obesity in dogs and cats." <em>Journal of Nutrition</em>, vol. 136, no. 7, 2006, pp. 1940S-1946S.
          </li>
          <li>
            National Research Council. <em>Guide for the Care and Use of Laboratory Animals</em>. 8th ed., National Academies Press, 2011.
          </li>
          <li>
            Laflamme, D.P. "Development and validation of a body condition score system for dogs." <em>Canine Practice</em>, vol. 22, 1997, pp. 10-15.
          </li>
          <li>
            National Research Council. <em>Energy Requirements of Dogs and Cats</em>. 2006.
          </li>
        </ol>
      </section>
    </CalculatorVerticalLayout>
  );
};

export default DogIdealWeightTargetCaloriesCalculator;
