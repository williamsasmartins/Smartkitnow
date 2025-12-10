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
  const [weightKg, setWeightKg] = useState<number>(10);
  const [weightLbs, setWeightLbs] = useState<number>(22);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<
    | "neutered_adult"
    | "intact_adult"
    | "inactive/obese_prone"
    | "weight_loss"
    | "weight_gain"
    | "puppy_0-4m"
    | "puppy_4m-adult"
    | "pregnant"
    | "lactating"
  >("neutered_adult");

  // Ref for results scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Synchronize weight inputs
  const onWeightKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      setWeightKg(val);
      setWeightLbs(parseFloat((val * 2.20462).toFixed(2)));
      setWeightUnit("kg");
    } else {
      setWeightKg(0);
      setWeightLbs(0);
    }
  };

  const onWeightLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      setWeightLbs(val);
      setWeightKg(parseFloat((val / 2.20462).toFixed(2)));
      setWeightUnit("lbs");
    } else {
      setWeightLbs(0);
      setWeightKg(0);
    }
  };

  // Calculate Resting Energy Requirement (RER)
  // Formula: RER = 70 * (weight in kg) ^ 0.75
  const RER = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  // Calculate Maintenance Energy Requirement (MER) based on activity level
  // Multipliers from NRC and WSAVA guidelines
  const MERMultiplier = useMemo(() => {
    switch (activityLevel) {
      case "neutered_adult":
        return 1.6;
      case "intact_adult":
        return 1.8;
      case "inactive/obese_prone":
        return 1.2;
      case "weight_loss":
        return 1.0;
      case "weight_gain":
        return 1.8;
      case "puppy_0-4m":
        return 3.0;
      case "puppy_4m-adult":
        return 2.0;
      case "pregnant":
        return 3.0;
      case "lactating":
        return 4.0;
      default:
        return 1.6;
    }
  }, [activityLevel]);

  // Calculate MER
  const MER = useMemo(() => {
    return RER * MERMultiplier;
  }, [RER, MERMultiplier]);

  // Scroll to results on change
  useMemo(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [RER, MER]);

  // Table data for activity levels and multipliers
  const activityLevelsData = [
    {
      label: "Neutered Adult",
      value: "neutered_adult",
      multiplier: 1.6,
      description:
        "Typical adult dog that has been neutered or spayed, with normal activity.",
    },
    {
      label: "Intact Adult",
      value: "intact_adult",
      multiplier: 1.8,
      description:
        "Adult dog that is intact (not neutered/spayed), generally more active and higher energy needs.",
    },
    {
      label: "Inactive/Obese Prone",
      value: "inactive/obese_prone",
      multiplier: 1.2,
      description:
        "Dogs that are inactive or prone to obesity, requiring fewer calories to maintain weight.",
    },
    {
      label: "Weight Loss",
      value: "weight_loss",
      multiplier: 1.0,
      description:
        "Calorie intake recommended for dogs undergoing weight loss programs.",
    },
    {
      label: "Weight Gain",
      value: "weight_gain",
      multiplier: 1.8,
      description:
        "Increased calorie intake for dogs needing to gain weight or muscle mass.",
    },
    {
      label: "Puppy 0-4 months",
      value: "puppy_0-4m",
      multiplier: 3.0,
      description:
        "Rapidly growing puppies in the first 4 months of life with very high energy needs.",
    },
    {
      label: "Puppy 4 months to Adult",
      value: "puppy_4m-adult",
      multiplier: 2.0,
      description:
        "Growing puppies older than 4 months until they reach adult size.",
    },
    {
      label: "Pregnant",
      value: "pregnant",
      multiplier: 3.0,
      description:
        "Pregnant dogs, especially in the last trimester, require increased calories.",
    },
    {
      label: "Lactating",
      value: "lactating",
      multiplier: 4.0,
      description:
        "Lactating dogs producing milk for puppies have the highest energy requirements.",
    },
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: "Cat Calorie Needs Calculator",
      slug: "cat-calorie-needs",
      emoji: "🐱",
    },
    {
      title: "Dog Food Portion Calculator",
      slug: "dog-food-portion",
      emoji: "🍖",
    },
    {
      title: "Pet Weight Tracker",
      slug: "pet-weight-tracker",
      emoji: "⚖️",
    },
    {
      title: "Dog Hydration Needs Calculator",
      slug: "dog-hydration-needs",
      emoji: "💧",
    },
    {
      title: "Puppy Growth Chart",
      slug: "puppy-growth-chart",
      emoji: "🐾",
    },
    {
      title: "Dog Exercise Needs Calculator",
      slug: "dog-exercise-needs",
      emoji: "🏃‍♂️",
    },
  ];

  // On this page links
  const onThisPage = [
    { id: "how-to-use", label: "How to Use" },
    { id: "formula", label: "Formula" },
    { id: "example", label: "Example" },
    { id: "mistakes", label: "Common Mistakes" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "references", label: "References" },
  ];

  // FAQ questions and answers
  const faqData = [
    {
      question: "What is Resting Energy Requirement (RER)?",
      answer:
        "RER is the amount of energy (calories) a dog needs at rest to maintain basic bodily functions such as breathing, circulation, and cell metabolism.",
    },
    {
      question: "What is Maintenance Energy Requirement (MER)?",
      answer:
        "MER is the total daily energy requirement for a dog, including all activities such as exercise, growth, reproduction, and thermoregulation.",
    },
    {
      question: "Why do puppies need more calories than adult dogs?",
      answer:
        "Puppies are growing rapidly and require more energy to support tissue development, organ growth, and increased activity levels.",
    },
    {
      question: "How does neutering affect a dog's calorie needs?",
      answer:
        "Neutered dogs generally have lower energy requirements due to hormonal changes that reduce metabolism and activity levels.",
    },
    {
      question: "Can I use this calculator for cats?",
      answer:
        "No, this calculator is specifically designed for dogs. Cats have different metabolic rates and nutritional needs. Please use our Cat Calorie Needs Calculator for cats.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator uses widely accepted veterinary formulas and multipliers, but individual needs may vary based on breed, health, and lifestyle. Always consult your veterinarian for personalized advice.",
    },
    {
      question: "What if my dog is overweight or underweight?",
      answer:
        "Adjust the activity level to 'weight loss' or 'weight gain' to get calorie recommendations tailored for these goals. Consult your vet for a comprehensive weight management plan.",
    },
    {
      question: "Does this calculator consider the dog's breed?",
      answer:
        "Breed-specific metabolic differences are not directly accounted for in this calculator. Some breeds may have higher or lower energy needs.",
    },
    {
      question: "How often should I recalculate my dog's calorie needs?",
      answer:
        "Recalculate whenever your dog's weight, activity level, or physiological status changes, such as during growth, pregnancy, or changes in activity.",
    },
    {
      question: "Can I use this calculator for senior dogs?",
      answer:
        "Yes, but consider selecting 'inactive/obese prone' or adjusting activity level to reflect your senior dog's lifestyle and health status.",
    },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      icon={<Dog className="w-8 h-8 text-blue-600" />}
      onThisPage={onThisPage}
      formula={
        <>
          <p>
            <strong>Resting Energy Requirement (RER):</strong> RER = 70 × (Body Weight in kg)<sup>0.75</sup>
          </p>
          <p>
            <strong>Maintenance Energy Requirement (MER):</strong> MER = RER × Activity Multiplier
          </p>
          <p>
            The activity multiplier varies depending on the dog's life stage and activity level.
          </p>
        </>
      }
      example={
        <>
          <p>
            For example, a neutered adult dog weighing 10 kg has:
          </p>
          <ul>
            <li>RER = 70 × 10<sup>0.75</sup> ≈ 394 kcal/day</li>
            <li>MER = 394 × 1.6 = 630 kcal/day</li>
          </ul>
          <p>This means the dog requires approximately 630 calories per day to maintain its weight.</p>
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <section id="how-to-use" className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-sky-600" /> How to Use
        </h2>
        <p>
          This calculator helps you estimate your dog's daily calorie needs based on their weight and activity level.
          Enter your dog's weight in kilograms or pounds, then select the activity level that best matches your dog's lifestyle.
          The calculator will automatically compute the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER).
        </p>
        <p>
          Use the results to guide feeding amounts and ensure your dog maintains a healthy weight.
          Remember to adjust feeding based on your dog's response and consult your veterinarian for personalized advice.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Input your dog's current weight accurately.</li>
          <li>Select the correct activity level for your dog.</li>
          <li>Review the calculated RER and MER values.</li>
          <li>Use the MER value to determine daily calorie intake.</li>
          <li>Adjust feeding as needed based on your dog's condition.</li>
        </ul>
      </section>

      <section id="formula" className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-emerald-600" /> Formula
        </h2>
        <p>
          The fundamental formula used in this calculator is derived from veterinary nutrition research:
        </p>
        <blockquote className="border-l-4 border-sky-500 pl-4 italic my-6 text-lg">
          <strong>Resting Energy Requirement (RER):</strong> RER = 70 × (Body Weight in kg)<sup>0.75</sup>
        </blockquote>
        <p>
          This formula calculates the baseline energy a dog requires at rest to maintain vital functions.
          To estimate the total daily energy needs, we multiply RER by an activity factor (MER multiplier) that reflects the dog's lifestyle and physiological state.
        </p>
        <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-6 text-lg">
          <strong>Maintenance Energy Requirement (MER):</strong> MER = RER × Activity Multiplier
        </blockquote>
        <p>
          The activity multipliers used in this calculator are based on guidelines from the National Research Council (NRC) and the World Small Animal Veterinary Association (WSAVA).
          These multipliers vary depending on whether the dog is neutered, intact, growing, pregnant, lactating, or inactive.
        </p>
        <Table className="my-6">
          <TableHeader>
            <TableRow>
              <TableHead>Activity Level</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLevelsData.map(({ label, multiplier, value, description }) => (
              <TableRow key={value}>
                <TableCell>{label}</TableCell>
                <TableCell>{multiplier.toFixed(2)}</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section id="example" className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Dog className="w-6 h-6 text-blue-600" /> Example
        </h2>
        <p>
          Let's calculate the calorie needs for a neutered adult dog weighing 10 kg.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Calculate RER:
            <br />
            RER = 70 × 10<sup>0.75</sup> ≈ 394 kcal/day
          </li>
          <li>
            Select activity multiplier for neutered adult: 1.6
          </li>
          <li>
            Calculate MER:
            <br />
            MER = 394 × 1.6 = 630 kcal/day
          </li>
        </ol>
        <p>
          Therefore, this dog requires approximately 630 calories per day to maintain its current weight.
        </p>
      </section>

      <section id="mistakes" className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-red-600" /> Common Mistakes
        </h2>
        <p>
          When estimating your dog's calorie needs, avoid these common errors:
        </p>
        <ul className="list-disc list-inside space-y-3">
          <li>
            <strong>Using inaccurate weight:</strong> Always weigh your dog using a reliable scale. Guessing weight can lead to incorrect calorie calculations.
          </li>
          <li>
            <strong>Ignoring activity level:</strong> Selecting the wrong activity multiplier can overestimate or underestimate calorie needs.
          </li>
          <li>
            <strong>Not adjusting for life stage:</strong> Puppies, pregnant, and lactating dogs have different energy requirements than adult dogs.
          </li>
          <li>
            <strong>Feeding based solely on package instructions:</strong> Commercial pet food feeding guides are general and may not fit your dog's individual needs.
          </li>
          <li>
            <strong>Failing to monitor body condition:</strong> Regularly assess your dog's weight and body condition score to adjust feeding accordingly.
          </li>
          <li>
            <strong>Not consulting a veterinarian:</strong> Always seek professional advice for dogs with health issues or special dietary needs.
          </li>
        </ul>
      </section>

      <section id="faq" className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-pink-600" /> Frequently Asked Questions
        </h2>
        {faqData.map(({ question, answer }, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="mb-24">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-gray-700" /> References
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>
            National Research Council. <em>Nutrition Requirements of Dogs and Cats</em>. National Academies Press; 2006.
          </li>
          <li>
            Freeman LM, Michel KE. "Energy Requirements of Dogs and Cats." In: Hand MS, Thatcher CD, Remillard RL, Roudebush P, editors. <em>Small Animal Clinical Nutrition</em>. 5th ed. Mark Morris Institute; 2010.
          </li>
          <li>
            WSAVA Global Nutrition Committee. "Nutritional Assessment Guidelines." <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noreferrer" className="text-blue-600 underline">https://wsava.org/global-guidelines/global-nutrition-guidelines/</a>.
          </li>
          <li>
            Case LP, Daristotle L, Hayek MG, Raasch MF. <em>Canine and Feline Nutrition: A Resource for Companion Animal Professionals</em>. 3rd ed. Elsevier; 2011.
          </li>
          <li>
            Hand MS, Thatcher CD, Remillard RL, Roudebush P, editors. <em>Small Animal Clinical Nutrition</em>. 5th ed. Mark Morris Institute; 2010.
          </li>
          <li>
            German AJ. "The Growing Problem of Obesity in Dogs and Cats." <em>J Nutr</em>. 2006;136(7 Suppl):1940S-1946S.
          </li>
          <li>
            National Animal Supplement Council. "Feeding Guidelines and Energy Requirements." <a href="https://www.nasc.cc/" target="_blank" rel="noreferrer" className="text-blue-600 underline">https://www.nasc.cc/</a>.
          </li>
          <li>
            Laflamme DP. "Development and Validation of a Body Condition Score System for Dogs." <em>Canine Practice</em>. 1997;22(4):10-15.
          </li>
        </ol>
      </section>

      {/* Input Card */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-600" /> Enter Your Dog's Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div>
              <Label htmlFor="weightKg" className="mb-1 flex items-center gap-1">
                Weight (kg)
                <Scale className="w-4 h-4 text-emerald-600" />
              </Label>
              <Input
                id="weightKg"
                type="number"
                min={0}
                step={0.1}
                value={weightKg}
                onChange={onWeightKgChange}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-xs text-gray-500 mt-1">
                Enter weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="weightLbs" className="mb-1 flex items-center gap-1">
                Weight (lbs)
                <Scale className="w-4 h-4 text-emerald-600" />
              </Label>
              <Input
                id="weightLbs"
                type="number"
                min={0}
                step={0.1}
                value={weightLbs}
                onChange={onWeightLbsChange}
                aria-describedby="weightLbsHelp"
              />
              <p id="weightLbsHelp" className="text-xs text-gray-500 mt-1">
                Enter weight in pounds.
              </p>
            </div>
            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                Activity Level
                <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <select
                id="activityLevel"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
              >
                {activityLevelsData.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card
        ref={resultsRef}
        className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border-none"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Flame className="w-6 h-6" /> Your Dog's Calorie Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightKg > 0 ? (
            <>
              <p className="text-lg mb-4">
                Based on a weight of <strong>{weightKg.toFixed(2)} kg</strong> (
                {weightLbs.toFixed(2)} lbs) and activity level <strong>
                  {
                    activityLevelsData.find((a) => a.value === activityLevel)
                      ?.label
                  }
                </strong>, your dog's estimated daily energy needs are:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-sm text-gray-600 uppercase mb-2">Resting Energy Requirement (RER)</p>
                  <p className="text-4xl font-extrabold text-emerald-600">{RER.toFixed(0)} kcal/day</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-sm text-gray-600 uppercase mb-2">Maintenance Energy Requirement (MER)</p>
                  <p className="text-4xl font-extrabold text-sky-600">{MER.toFixed(0)} kcal/day</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Table className="inline-block w-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Weight (kg)</TableCell>
                      <TableCell>{weightKg.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Weight (lbs)</TableCell>
                      <TableCell>{weightLbs.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Activity Multiplier</TableCell>
                      <TableCell>{MERMultiplier.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </h3>
              <p className="text-gray-700">
                Use the <strong>MER</strong> value as a guideline for daily calorie intake.
                Adjust feeding amounts based on your dog's body condition and activity changes.
              </p>
            </>
          ) : (
            <p className="text-red-600 font-semibold">Please enter a valid weight to see results.</p>
          )}
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
};

export default DogIdealWeightTargetCaloriesCalculator;
