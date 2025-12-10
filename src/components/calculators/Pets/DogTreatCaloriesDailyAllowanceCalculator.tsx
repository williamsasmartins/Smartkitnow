import { useState, useMemo, useRef, useEffect } from "react";
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
  const [activityLevel, setActivityLevel] = useState<
    | "neuteredAdult"
    | "intactAdult"
    | "inactive"
    | "weightLoss"
    | "weightGain"
    | "lightActivity"
    | "moderateActivity"
    | "active"
    | "workingDog"
    | "puppy0to4mo"
    | "puppy4to12mo"
  >("neuteredAdult");
  const [ageMonths, setAgeMonths] = useState(12);
  const [bodyConditionScore, setBodyConditionScore] = useState(5);

  // Refs for smooth scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Convert weight to kg if input is in lbs
  const weightKgConverted = useMemo(() => {
    if (weightUnit === "kg") return weightKg;
    return weightLbs / 2.20462;
  }, [weightKg, weightLbs, weightUnit]);

  // Convert weight to lbs if input is in kg
  const weightLbsConverted = useMemo(() => {
    if (weightUnit === "lbs") return weightLbs;
    return weightKg * 2.20462;
  }, [weightKg, weightLbs, weightUnit]);

  // RER calculation: Resting Energy Requirement
  // Formula: RER = 70 * (weight in kg)^0.75
  const rer = useMemo(() => {
    if (weightKgConverted <= 0) return 0;
    return 70 * Math.pow(weightKgConverted, 0.75);
  }, [weightKgConverted]);

  // MER multipliers based on activity level and life stage
  // Source: National Research Council, AAFCO, WSAVA guidelines
  const merMultiplier = useMemo(() => {
    switch (activityLevel) {
      case "neuteredAdult":
        return 1.6;
      case "intactAdult":
        return 1.8;
      case "inactive":
        return 1.2;
      case "weightLoss":
        return 1.0;
      case "weightGain":
        return 1.8;
      case "lightActivity":
        return 2.0;
      case "moderateActivity":
        return 3.0;
      case "active":
        return 4.0;
      case "workingDog":
        return 5.0;
      case "puppy0to4mo":
        return 3.0;
      case "puppy4to12mo":
        return 2.0;
      default:
        return 1.6;
    }
  }, [activityLevel]);

  // MER calculation: Maintenance Energy Requirement
  const mer = useMemo(() => {
    return rer * merMultiplier;
  }, [rer, merMultiplier]);

  // Ideal weight range based on body condition score (BCS)
  // BCS scale 1-9, ideal 4-5
  // Adjust ideal weight by +/-10% per BCS point away from 5
  const idealWeightRange = useMemo(() => {
    const idealWeight = weightKgConverted * Math.pow(1.1, 5 - bodyConditionScore);
    const lowerBound = idealWeight * 0.9;
    const upperBound = idealWeight * 1.1;
    return { lowerBound, upperBound, idealWeight };
  }, [weightKgConverted, bodyConditionScore]);

  // Calories to lose or gain weight safely (approx 10% deficit or surplus)
  const caloriesToLose = useMemo(() => {
    if (bodyConditionScore <= 4) return 0;
    return mer * 0.9;
  }, [mer, bodyConditionScore]);

  const caloriesToGain = useMemo(() => {
    if (bodyConditionScore >= 6) return 0;
    return mer * 1.1;
  }, [mer, bodyConditionScore]);

  // Smooth scroll to results when mer changes
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mer]);

  // OnThisPage links for editorial
  const onThisPage = [
    { id: "how-to-use", title: "How to Use" },
    { id: "formula", title: "Formula" },
    { id: "example", title: "Example" },
    { id: "mistakes", title: "Common Mistakes" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "References" },
  ];

  // Related calculators for sidebar or footer
  const relatedCalculators = [
    { title: "Cat Calorie Needs Calculator", slug: "cat-calorie-needs", emoji: "🐱" },
    { title: "Dog Food Portion Calculator", slug: "dog-food-portion", emoji: "🍖" },
    { title: "Pet Weight Tracker", slug: "pet-weight-tracker", emoji: "⚖️" },
    { title: "Dog Water Intake Calculator", slug: "dog-water-intake", emoji: "💧" },
    { title: "Puppy Growth Calculator", slug: "puppy-growth", emoji: "🐶" },
    { title: "Dog Exercise Needs Calculator", slug: "dog-exercise-needs", emoji: "🏃‍♂️" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      icon={<Dog className="mr-2 h-6 w-6 text-blue-600" />}
      onThisPage={onThisPage}
      formula="RER = 70 × (Body Weight in kg)^0.75; MER = RER × Activity Factor"
      example="For a 10 kg neutered adult dog, RER = 70 × 10^0.75 = 394 kcal/day; MER = 394 × 1.6 = 630 kcal/day"
      relatedCalculators={relatedCalculators}
    >
      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="text-green-600" />
            Dog Weight & Activity Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                <Scale />
                Weight
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
                    if (!isNaN(val)) {
                      if (weightUnit === "kg") setWeightKg(val);
                      else setWeightLbs(val);
                    }
                  }}
                  aria-describedby="weightHelp"
                />
                <select
                  aria-label="Weight Unit"
                  className="border border-gray-300 rounded px-2"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as "kg" | "lbs")}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              <p id="weightHelp" className="text-sm text-muted-foreground mt-1">
                Enter your dog's weight in kilograms or pounds.
              </p>
            </div>

            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                <Activity />
                Activity Level
              </Label>
              <select
                id="activityLevel"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
              >
                <option value="neuteredAdult">Neutered Adult (1.6× RER)</option>
                <option value="intactAdult">Intact Adult (1.8× RER)</option>
                <option value="inactive">Inactive (1.2× RER)</option>
                <option value="weightLoss">Weight Loss (1.0× RER)</option>
                <option value="weightGain">Weight Gain (1.8× RER)</option>
                <option value="lightActivity">Light Activity (2.0× RER)</option>
                <option value="moderateActivity">Moderate Activity (3.0× RER)</option>
                <option value="active">Active (4.0× RER)</option>
                <option value="workingDog">Working Dog (5.0× RER)</option>
                <option value="puppy0to4mo">Puppy 0-4 months (3.0× RER)</option>
                <option value="puppy4to12mo">Puppy 4-12 months (2.0× RER)</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                Select your dog's current activity level or life stage.
              </p>
            </div>

            <div>
              <Label htmlFor="bcs" className="mb-1 flex items-center gap-1">
                <HeartPulse />
                Body Condition Score (1-9)
              </Label>
              <Input
                id="bcs"
                type="number"
                min={1}
                max={9}
                step={1}
                value={bodyConditionScore}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= 9) setBodyConditionScore(val);
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your dog's body condition score (1 = very thin, 9 = obese).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card
        ref={resultsRef}
        className="mb-8 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-blue-600" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Resting Energy Requirement (RER):</strong>{" "}
              {rer.toFixed(0)} kcal/day
            </p>
            <p>
              <strong>Maintenance Energy Requirement (MER):</strong>{" "}
              {mer.toFixed(0)} kcal/day
            </p>
            <p>
              <strong>Ideal Weight Range (kg):</strong>{" "}
              {idealWeightRange.lowerBound.toFixed(1)} -{" "}
              {idealWeightRange.upperBound.toFixed(1)} kg (Ideal:{" "}
              {idealWeightRange.idealWeight.toFixed(1)} kg)
            </p>
            {caloriesToLose > 0 && (
              <p>
                <strong>Calories for Weight Loss:</strong> {caloriesToLose.toFixed(0)} kcal/day
              </p>
            )}
            {caloriesToGain > 0 && (
              <p>
                <strong>Calories for Weight Gain:</strong> {caloriesToGain.toFixed(0)} kcal/day
              </p>
            )}
          </div>

          {/* Detailed Table */}
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Weight (kg)</TableCell>
                <TableCell>{weightKgConverted.toFixed(2)}</TableCell>
                <TableCell>Converted from {weightUnit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weight (lbs)</TableCell>
                <TableCell>{weightLbsConverted.toFixed(2)}</TableCell>
                <TableCell>Converted from {weightUnit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Activity Level</TableCell>
                <TableCell>{activityLevel}</TableCell>
                <TableCell>Determines MER multiplier</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MER Multiplier</TableCell>
                <TableCell>{merMultiplier.toFixed(2)}</TableCell>
                <TableCell>Based on activity & life stage</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>RER (kcal/day)</TableCell>
                <TableCell>{rer.toFixed(0)}</TableCell>
                <TableCell>Resting Energy Requirement</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MER (kcal/day)</TableCell>
                <TableCell>{mer.toFixed(0)}</TableCell>
                <TableCell>Maintenance Energy Requirement</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Body Condition Score</TableCell>
                <TableCell>{bodyConditionScore}</TableCell>
                <TableCell>1 (thin) to 9 (obese)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ideal Weight (kg)</TableCell>
                <TableCell>{idealWeightRange.idealWeight.toFixed(2)}</TableCell>
                <TableCell>Adjusted by BCS</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ideal Weight Range (kg)</TableCell>
                <TableCell>
                  {idealWeightRange.lowerBound.toFixed(2)} -{" "}
                  {idealWeightRange.upperBound.toFixed(2)}
                </TableCell>
                <TableCell>±10% around ideal</TableCell>
              </TableRow>
              {caloriesToLose > 0 && (
                <TableRow>
                  <TableCell>Calories for Weight Loss</TableCell>
                  <TableCell>{caloriesToLose.toFixed(0)}</TableCell>
                  <TableCell>~10% calorie deficit</TableCell>
                </TableRow>
              )}
              {caloriesToGain > 0 && (
                <TableRow>
                  <TableCell>Calories for Weight Gain</TableCell>
                  <TableCell>{caloriesToGain.toFixed(0)}</TableCell>
                  <TableCell>~10% calorie surplus</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Editorial Section */}
      <article className="prose prose-slate max-w-none">
        <section id="how-to-use">
          <h2 className="flex items-center gap-2">
            <Info className="text-blue-600" />
            How to Use
          </h2>
          <p>
            This calculator helps you determine your dog’s daily calorie needs based on their weight, activity level, and body condition score. Enter your dog’s weight in kilograms or pounds, select their activity level or life stage, and provide their body condition score on a scale from 1 (very thin) to 9 (obese). The results will show the Resting Energy Requirement (RER), Maintenance Energy Requirement (MER), ideal weight range, and calorie recommendations for weight loss or gain if applicable.
          </p>
          <p>
            The calculator updates automatically as you adjust inputs—no need to press a calculate button. Use the detailed table for a clear breakdown of all parameters and their values.
          </p>
          <p>
            This tool is designed for adult dogs, puppies, and working dogs, providing tailored multipliers for different life stages and activity levels.
          </p>
          <p>
            Always consult your veterinarian before making significant changes to your dog’s diet or exercise routine.
          </p>
        </section>

        <section id="formula">
          <h2 className="flex items-center gap-2">
            <Scale className="text-green-600" />
            Formula
          </h2>
          <p>
            The core formula used in this calculator is the Resting Energy Requirement (RER), which estimates the calories a dog needs at rest to maintain basic physiological functions.
          </p>
          <p>
            <strong>RER = 70 × (Body Weight in kg)^0.75</strong>
          </p>
          <p>
            The Maintenance Energy Requirement (MER) accounts for activity, life stage, and other factors by multiplying the RER by an activity factor:
          </p>
          <p>
            <strong>MER = RER × Activity Factor</strong>
          </p>
          <p>
            Activity factors vary depending on whether the dog is neutered, intact, inactive, a puppy, or a working dog. These factors are derived from veterinary nutrition guidelines and scientific literature.
          </p>
          <p>
            The body condition score (BCS) helps estimate the ideal weight range by adjusting the current weight by approximately 10% per BCS point difference from the ideal score of 5.
          </p>
        </section>

        <section id="example">
          <h2 className="flex items-center gap-2">
            <Dog className="text-amber-600" />
            Example
          </h2>
          <p>
            Suppose you have a 10 kg neutered adult dog with a body condition score of 6 (slightly overweight). The calculator computes:
          </p>
          <ul>
            <li>
              <strong>RER:</strong> 70 × 10^0.75 ≈ 394 kcal/day
            </li>
            <li>
              <strong>MER:</strong> 394 × 1.6 = 630 kcal/day
            </li>
            <li>
              <strong>Ideal Weight Range:</strong> Adjusted for BCS 6, the ideal weight is approximately 10 × 1.1^(5-6) = 9.1 kg, with a range of 8.2 to 10.0 kg.
            </li>
            <li>
              <strong>Calories for Weight Loss:</strong> Since BCS is above 5, a 10% calorie deficit is recommended: 630 × 0.9 = 567 kcal/day.
            </li>
          </ul>
          <p>
            This example illustrates how the calculator helps tailor feeding recommendations to your dog’s specific needs.
          </p>
        </section>

        <section id="mistakes">
          <h2 className="flex items-center gap-2">
            <Flame className="text-red-600" />
            Common Mistakes
          </h2>
          <p>
            When using calorie calculators for dogs, several common mistakes can lead to inaccurate results or poor health outcomes:
          </p>
          <ol>
            <li>
              <strong>Incorrect Weight Input:</strong> Using an outdated or inaccurate weight can skew results. Always weigh your dog on a reliable scale.
            </li>
            <li>
              <strong>Ignoring Body Condition Score:</strong> Not accounting for your dog’s current body condition can result in overfeeding or underfeeding.
            </li>
            <li>
              <strong>Misclassifying Activity Level:</strong> Overestimating or underestimating your dog’s activity level leads to inappropriate calorie recommendations.
            </li>
            <li>
              <strong>Not Adjusting for Life Stage:</strong> Puppies and working dogs have different energy needs than adult pets.
            </li>
            <li>
              <strong>Failing to Monitor Changes:</strong> Calorie needs change with weight fluctuations, health status, and activity changes. Regular reassessment is essential.
            </li>
            <li>
              <strong>Using MER as a Fixed Value:</strong> MER is an estimate, not a guarantee. Individual metabolism and health conditions affect actual needs.
            </li>
          </ol>
          <p>
            Avoid these pitfalls by using this calculator as a guide, combined with veterinary advice and regular monitoring.
          </p>
        </section>

        <section id="faq">
          <h2 className="flex items-center gap-2">
            <BookOpen className="text-purple-600" />
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            <dt className="font-semibold">What is the difference between RER and MER?</dt>
            <dd>
              RER (Resting Energy Requirement) is the energy needed for basic bodily functions at rest. MER (Maintenance Energy Requirement) includes additional calories for activity, growth, and other factors.
            </dd>

            <dt className="font-semibold">How do I determine my dog’s body condition score?</dt>
            <dd>
              Body condition score is a visual and physical assessment of your dog’s fat coverage and muscle tone, typically rated on a 1-9 scale. Consult your veterinarian for an accurate assessment.
            </dd>

            <dt className="font-semibold">Can I use this calculator for puppies?</dt>
            <dd>
              Yes, select the appropriate puppy life stage (0-4 months or 4-12 months) in the activity level dropdown to get tailored calorie multipliers.
            </dd>

            <dt className="font-semibold">What if my dog is obese or underweight?</dt>
            <dd>
              The calculator provides calorie recommendations for weight loss or gain based on body condition score. Always consult your vet before starting a weight management plan.
            </dd>

            <dt className="font-semibold">Why does the calculator use weight in kilograms?</dt>
            <dd>
              Kilograms are the standard unit for scientific calculations. The calculator converts pounds to kilograms internally for accuracy.
            </dd>

            <dt className="font-semibold">How often should I recalculate my dog’s calorie needs?</dt>
            <dd>
              Recalculate whenever your dog’s weight, activity level, or health status changes significantly, typically every 3-6 months.
            </dd>

            <dt className="font-semibold">Are these calorie needs exact?</dt>
            <dd>
              No, these are estimates based on population averages. Individual dogs may require more or fewer calories.
            </dd>

            <dt className="font-semibold">Can I use this calculator for other pets?</dt>
            <dd>
              This calculator is specifically designed for dogs. For cats or other animals, use dedicated calculators.
            </dd>

            <dt className="font-semibold">What if my dog has a medical condition?</dt>
            <dd>
              Consult your veterinarian for tailored nutritional advice. This calculator does not replace professional guidance.
            </dd>

            <dt className="font-semibold">How do activity multipliers affect calorie needs?</dt>
            <dd>
              Activity multipliers adjust the RER to account for energy spent on exercise, growth, or work. Higher activity means higher calorie needs.
            </dd>
          </dl>
        </section>

        <section id="references">
          <h2 className="flex items-center gap-2">
            <BookOpen className="text-teal-600" />
            References
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              National Research Council. Nutrient Requirements of Dogs and Cats. The National Academies Press, 2006.
            </li>
            <li>
              Association of American Feed Control Officials (AAFCO). Official Publication, 2023.
            </li>
            <li>
              WSAVA Global Nutrition Committee. Nutritional Assessment Guidelines for Dogs and Cats. Journal of Small Animal Practice, 2011.
            </li>
            <li>
              Freeman, L.M., et al. Energy Requirements of Adult Dogs. Journal of Nutrition, 2013.
            </li>
            <li>
              Case, L.P., et al. Canine and Feline Nutrition: A Resource for Companion Animal Professionals. 3rd Edition, 2011.
            </li>
            <li>
              Hand, M.S., et al. Small Animal Clinical Nutrition. 5th Edition, 2010.
            </li>
            <li>
              Laflamme, D.P. Development and Validation of a Body Condition Score System for Dogs. Canine Practice, 1997.
            </li>
            <li>
              German, A.J. The Growing Problem of Obesity in Dogs and Cats. Journal of Nutrition, 2006.
            </li>
          </ul>
        </section>
      </article>
    </CalculatorVerticalLayout>
  );
};

export default DogTreatCaloriesDailyAllowanceCalculator;
