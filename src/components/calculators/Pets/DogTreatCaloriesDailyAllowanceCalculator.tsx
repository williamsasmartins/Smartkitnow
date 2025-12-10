import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen } from "lucide-react";

const DogCalorieNeedsRerMerCalculator = () => {
  // States for inputs
  const [weightKg, setWeightKg] = useState(10); // realistic default weight in kg
  const [weightLbs, setWeightLbs] = useState(22); // corresponding lbs default
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<
    | "neuteredAdult"
    | "intactAdult"
    | "inactive/obeseProne"
    | "weightLoss"
    | "weightGain"
    | "active"
    | "workingDog"
    | "puppy0to4mo"
    | "puppy4to12mo"
  >("neuteredAdult");
  const [notesExpanded, setNotesExpanded] = useState(false);

  // Reference for smooth scroll to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Conversion constants
  const lbsToKg = 0.45359237;
  const kgToLbs = 2.20462262;

  // Sync weight inputs when unit changes or value changes
  const onWeightKgChange = (val: number) => {
    setWeightKg(val);
    setWeightLbs(parseFloat((val * kgToLbs).toFixed(2)));
    setWeightUnit("kg");
  };

  const onWeightLbsChange = (val: number) => {
    setWeightLbs(val);
    setWeightKg(parseFloat((val * lbsToKg).toFixed(2)));
    setWeightUnit("lbs");
  };

  // Calculate Resting Energy Requirement (RER)
  // RER = 70 * (weight in kg) ^ 0.75
  const rer = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  // Calculate Maintenance Energy Requirement (MER) based on activity level
  // Multipliers from NRC and AAFCO guidelines
  const merMultiplier = useMemo(() => {
    switch (activityLevel) {
      case "neuteredAdult":
        return 1.6;
      case "intactAdult":
        return 1.8;
      case "inactive/obeseProne":
        return 1.2;
      case "weightLoss":
        return 1.0;
      case "weightGain":
        return 1.4;
      case "active":
        return 2.0;
      case "workingDog":
        return 4.0;
      case "puppy0to4mo":
        return 3.0;
      case "puppy4to12mo":
        return 2.0;
      default:
        return 1.6;
    }
  }, [activityLevel]);

  // Calculate MER
  const mer = useMemo(() => {
    return rer * merMultiplier;
  }, [rer, merMultiplier]);

  // Scroll to results on calculation change
  useMemo(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rer, mer]);

  // Table data for activity levels explanation
  const activityLevelsData = [
    {
      key: "neuteredAdult",
      label: "Neutered Adult",
      description:
        "Typical adult dog that has been spayed or neutered, with normal activity levels.",
      multiplier: 1.6,
    },
    {
      key: "intactAdult",
      label: "Intact Adult",
      description:
        "Adult dog that has not been spayed or neutered, typically higher energy needs.",
      multiplier: 1.8,
    },
    {
      key: "inactive/obeseProne",
      label: "Inactive / Obese Prone",
      description:
        "Dogs that are less active or prone to obesity, requiring fewer calories.",
      multiplier: 1.2,
    },
    {
      key: "weightLoss",
      label: "Weight Loss",
      description:
        "Caloric needs for dogs undergoing a weight loss program.",
      multiplier: 1.0,
    },
    {
      key: "weightGain",
      label: "Weight Gain",
      description:
        "Dogs needing to gain weight, such as recovering from illness or underweight dogs.",
      multiplier: 1.4,
    },
    {
      key: "active",
      label: "Active",
      description:
        "Dogs with higher than average activity levels, such as frequent exercise or play.",
      multiplier: 2.0,
    },
    {
      key: "workingDog",
      label: "Working Dog",
      description:
        "Highly active dogs performing work or sports, requiring significantly more energy.",
      multiplier: 4.0,
    },
    {
      key: "puppy0to4mo",
      label: "Puppy 0-4 months",
      description:
        "Growing puppies in the first 4 months of life with very high energy needs.",
      multiplier: 3.0,
    },
    {
      key: "puppy4to12mo",
      label: "Puppy 4-12 months",
      description:
        "Older puppies between 4 and 12 months with moderately high energy needs.",
      multiplier: 2.0,
    },
  ];

  // Editorial content sections
  const editorialSections = [
    {
      id: "how-to-use",
      title: "How to Use This Calculator",
      icon: <Calculator className="inline mr-2" size={20} />,
      content: (
        <>
          <p>
            This Dog Calorie Needs (RER/MER) Calculator helps you estimate the daily caloric requirements for your dog based on their weight and activity level. It calculates the Resting Energy Requirement (RER), which is the baseline energy your dog needs at rest, and the Maintenance Energy Requirement (MER), which adjusts the RER based on your dog's lifestyle and activity.
          </p>
          <p>
            To use the calculator:
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li>Enter your dog's weight in kilograms or pounds. The other unit will update automatically.</li>
            <li>Select your dog's activity level from the dropdown menu. This includes options like neutered adult, intact adult, active, working dog, and puppy stages.</li>
            <li>The calculator will instantly display the RER and MER values below.</li>
            <li>Use these values to guide your dog's feeding plan, ensuring they receive the appropriate amount of calories for their health and lifestyle.</li>
          </ol>
          <p>
            Remember, these calculations provide estimates. Always consult your veterinarian for personalized advice tailored to your dog's specific needs.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "The Formula Behind the Calculator",
      icon: <BookOpen className="inline mr-2" size={20} />,
      content: (
        <>
          <p>
            The calculation of your dog's daily caloric needs is based on two key formulas:
          </p>
          <h3 className="mt-4 font-semibold">Resting Energy Requirement (RER)</h3>
          <p>
            RER represents the energy your dog needs at rest to maintain basic physiological functions such as breathing, circulation, and cellular metabolism.
          </p>
          <p className="italic font-mono text-sm bg-gray-100 p-3 rounded">
            RER = 70 × (Body Weight in kg)<sup>0.75</sup>
          </p>
          <p>
            This formula is widely accepted in veterinary nutrition and provides a baseline calorie requirement.
          </p>
          <h3 className="mt-4 font-semibold">Maintenance Energy Requirement (MER)</h3>
          <p>
            MER adjusts the RER based on your dog's activity level, life stage, and physiological status. It is calculated by multiplying the RER by an activity factor:
          </p>
          <p className="italic font-mono text-sm bg-gray-100 p-3 rounded">
            MER = RER × Activity Factor
          </p>
          <p>
            The activity factor varies depending on whether your dog is a neutered adult, intact adult, puppy, working dog, or other categories. This multiplier accounts for the extra energy expenditure beyond resting.
          </p>
          <p>
            The multipliers used in this calculator are derived from authoritative sources such as the National Research Council (NRC) and the Association of American Feed Control Officials (AAFCO).
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Example Calculation",
      icon: <Scale className="inline mr-2" size={20} />,
      content: (
        <>
          <p>
            Let's walk through an example to see how the calculator works:
          </p>
          <p>
            Suppose you have a 20 kg neutered adult dog.
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li>Calculate RER:
              <br />
              RER = 70 × (20)<sup>0.75</sup> ≈ 70 × 9.46 = 662 kcal/day
            </li>
            <li>Determine MER multiplier for neutered adult: 1.6</li>
            <li>Calculate MER:
              <br />
              MER = 662 × 1.6 = 1059 kcal/day
            </li>
          </ol>
          <p>
            So, your dog requires approximately 662 calories daily at rest, and about 1059 calories daily to maintain their weight with normal activity.
          </p>
          <p>
            This example demonstrates how the calculator provides quick and accurate estimates to help you manage your dog's nutrition.
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common Mistakes to Avoid",
      icon: <Info className="inline mr-2" size={20} />,
      content: (
        <>
          <p>
            When using calorie calculators for dogs, it's important to avoid some common pitfalls:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Using inaccurate weight:</strong> Always weigh your dog accurately using a reliable scale. Guessing or using outdated weights can lead to incorrect calorie estimates.</li>
            <li><strong>Ignoring activity level:</strong> Selecting the wrong activity multiplier can cause overfeeding or underfeeding. Be honest about your dog's lifestyle and energy expenditure.</li>
            <li><strong>Not adjusting for health conditions:</strong> Dogs with illnesses, metabolic disorders, or special needs may require different calorie intakes. Consult your vet for these cases.</li>
            <li><strong>Feeding based solely on calories:</strong> Quality of food, nutrient balance, and feeding schedule also matter. Calories are just one part of a healthy diet.</li>
            <li><strong>Not monitoring weight changes:</strong> Regularly track your dog's weight and body condition to adjust feeding amounts as needed.</li>
          </ul>
          <p>
            Avoiding these mistakes will help you use this calculator effectively and support your dog's health.
          </p>
        </>
      ),
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: <HeartPulse className="inline mr-2" size={20} />,
      content: (
        <>
          <p>
            Here are answers to some common questions about dog calorie needs:
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>What is the difference between RER and MER?</TableCell>
                <TableCell>RER is the energy needed at rest, while MER accounts for activity and lifestyle to maintain weight.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Can I use this calculator for puppies?</TableCell>
                <TableCell>Yes, select the appropriate puppy age category to get accurate multipliers.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Why do working dogs need so many calories?</TableCell>
                <TableCell>Working dogs expend much more energy, requiring up to 4 times their RER for maintenance.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>How often should I recalculate calorie needs?</TableCell>
                <TableCell>Recalculate whenever your dog's weight or activity level changes significantly.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Is it safe to feed exactly the MER calories?</TableCell>
                <TableCell>MER is an estimate; monitor your dog's weight and adjust feeding as needed.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Can I use this for cats?</TableCell>
                <TableCell>No, cats have different metabolic rates and nutritional needs. Use a dedicated cat calorie calculator.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>What if my dog is overweight?</TableCell>
                <TableCell>Use the 'Weight Loss' activity level multiplier and consult your vet for a weight management plan.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Does spaying/neutering affect calorie needs?</TableCell>
                <TableCell>Yes, neutered dogs generally have lower energy requirements than intact dogs.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      ),
    },
    {
      id: "references",
      title: "References",
      icon: <BookOpen className="inline mr-2" size={20} />,
      content: (
        <>
          <ul className="list-disc list-inside">
            <li>
              National Research Council. (2006). Nutrient Requirements of Dogs and Cats. The National Academies Press.
            </li>
            <li>
              Association of American Feed Control Officials (AAFCO). (2023). Official Publication.
            </li>
            <li>
              Freeman, L. M., et al. (2013). Energy requirements of adult dogs. Journal of Nutrition.
            </li>
            <li>
              Case, L. P., et al. (2011). Canine and Feline Nutrition: A Resource for Companion Animal Professionals.
            </li>
            <li>
              Hand, M. S., et al. (2010). Small Animal Clinical Nutrition.
            </li>
            <li>
              German, A. J. (2006). The Growing Problem of Obesity in Dogs and Cats. Journal of Nutrition.
            </li>
          </ul>
        </>
      ),
    },
  ];

  // On this page links for quick navigation
  const onThisPage = editorialSections.map(({ id, title }) => ({
    id,
    title,
  }));

  // Related calculators with varied emojis
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
      title: "Puppy Growth Chart",
      slug: "puppy-growth-chart",
      emoji: "🐾",
    },
    {
      title: "Dog Hydration Calculator",
      slug: "dog-hydration-calculator",
      emoji: "💧",
    },
    {
      title: "Senior Dog Nutrition Calculator",
      slug: "senior-dog-nutrition",
      emoji: "🦴",
    },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      icon={<Dog size={28} />}
      onThisPage={onThisPage}
      relatedCalculators={relatedCalculators}
    >
      {/* Inputs Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale size={24} />
            Enter Your Dog's Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="weightKg" className="mb-1 flex items-center gap-1">
              Weight (kg)
              <Info size={16} className="text-sky-500" />
            </Label>
            <Input
              id="weightKg"
              type="number"
              min={0.1}
              step={0.1}
              value={weightUnit === "kg" ? weightKg : ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) onWeightKgChange(val);
              }}
              placeholder="e.g., 10"
              aria-describedby="weightKgHelp"
            />
            <p id="weightKgHelp" className="text-xs text-muted-foreground mt-1">
              Enter weight in kilograms
            </p>
          </div>
          <div>
            <Label htmlFor="weightLbs" className="mb-1 flex items-center gap-1">
              Weight (lbs)
              <Info size={16} className="text-sky-500" />
            </Label>
            <Input
              id="weightLbs"
              type="number"
              min={0.1}
              step={0.1}
              value={weightUnit === "lbs" ? weightLbs : ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) onWeightLbsChange(val);
              }}
              placeholder="e.g., 22"
              aria-describedby="weightLbsHelp"
            />
            <p id="weightLbsHelp" className="text-xs text-muted-foreground mt-1">
              Enter weight in pounds
            </p>
          </div>
          <div>
            <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
              Activity Level
              <Activity size={16} className="text-sky-500" />
            </Label>
            <select
              id="activityLevel"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={activityLevel}
              onChange={(e) =>
                setActivityLevel(e.target.value as typeof activityLevel)
              }
              aria-describedby="activityLevelHelp"
            >
              {activityLevelsData.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p id="activityLevelHelp" className="text-xs text-muted-foreground mt-1">
              Select your dog's activity level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card
        ref={resultsRef}
        className="mb-12 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame size={24} />
            Your Dog's Caloric Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-lg font-semibold text-sky-700">Resting Energy Requirement (RER)</p>
              <p className="text-4xl font-extrabold text-emerald-700 mt-2">
                {rer.toFixed(0)} kcal/day
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Baseline calories needed at rest
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-sky-700">Maintenance Energy Requirement (MER)</p>
              <p className="text-4xl font-extrabold text-blue-700 mt-2">
                {mer.toFixed(0)} kcal/day
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Calories needed to maintain weight based on activity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table of Activity Levels */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet size={24} />
            Activity Levels and Multipliers
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Multiplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLevelsData.map(({ key, label, description, multiplier }) => (
                <TableRow key={key}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{multiplier.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Editorial Sections */}
      {editorialSections.map(({ id, title, icon, content }) => (
        <section key={id} id={id} className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-sky-700">
            {icon}
            {title}
          </h2>
          <div className="prose max-w-none text-gray-800">{content}</div>
        </section>
      ))}
    </CalculatorVerticalLayout>
  );
};

export default DogTreatCaloriesDailyAllowanceCalculator;
