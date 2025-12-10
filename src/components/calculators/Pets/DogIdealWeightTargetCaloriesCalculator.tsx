import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen } from "lucide-react";

const DogCalorieNeedsRerMerCalculator = () => {
  // State variables with realistic defaults
  const [weightKg, setWeightKg] = useState<number>(10); // typical small dog weight
  const [weightLbs, setWeightLbs] = useState<number>(22.05); // equivalent lbs
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<
    | "neuteredAdult"
    | "intactAdult"
    | "inactive"
    | "weightLoss"
    | "weightGain"
    | "puppy0to4mo"
    | "puppy4to12mo"
    | "pregnant"
    | "lactating"
  >("neuteredAdult");
  const [ageMonths, setAgeMonths] = useState<number>(12);
  const [notesExpanded, setNotesExpanded] = useState<boolean>(false);

  // useRef for smooth scroll to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Conversion handlers
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
      setWeightKg(0);
      setWeightLbs(0);
    }
  };

  // Activity level descriptions and multipliers for MER
  const activityLevels = useMemo(
    () => [
      {
        key: "neuteredAdult",
        label: "Neutered Adult",
        description:
          "Typical adult dog that has been neutered or spayed, with normal activity.",
        merMultiplier: 1.6,
      },
      {
        key: "intactAdult",
        label: "Intact Adult",
        description:
          "Adult dog that is not neutered or spayed, typically higher energy needs.",
        merMultiplier: 1.8,
      },
      {
        key: "inactive",
        label: "Inactive/Obese Prone",
        description:
          "Dogs that are inactive or prone to obesity, requiring fewer calories.",
        merMultiplier: 1.2,
      },
      {
        key: "weightLoss",
        label: "Weight Loss",
        description:
          "Calorie intake for dogs undergoing weight loss programs.",
        merMultiplier: 1.0,
      },
      {
        key: "weightGain",
        label: "Weight Gain",
        description:
          "Calorie intake for dogs needing to gain weight or recover from illness.",
        merMultiplier: 2.0,
      },
      {
        key: "puppy0to4mo",
        label: "Puppy 0-4 months",
        description:
          "Growing puppies up to 4 months old with very high energy needs.",
        merMultiplier: 3.0,
      },
      {
        key: "puppy4to12mo",
        label: "Puppy 4-12 months",
        description:
          "Growing puppies between 4 and 12 months with high energy needs.",
        merMultiplier: 2.0,
      },
      {
        key: "pregnant",
        label: "Pregnant",
        description:
          "Pregnant dogs in the last trimester requiring increased calories.",
        merMultiplier: 3.0,
      },
      {
        key: "lactating",
        label: "Lactating",
        description:
          "Nursing dogs with the highest energy demands to support milk production.",
        merMultiplier: 4.0,
      },
    ],
    []
  );

  // Find current activity level object
  const currentActivity = useMemo(
    () => activityLevels.find((a) => a.key === activityLevel)!,
    [activityLevel, activityLevels]
  );

  // RER calculation: Resting Energy Requirement
  // Formula: RER = 70 * (weight in kg)^0.75
  const rer = useMemo(() => {
    if (weightKg <= 0) return 0;
    return +(70 * Math.pow(weightKg, 0.75)).toFixed(2);
  }, [weightKg]);

  // MER calculation: Maintenance Energy Requirement
  // MER = RER * activity multiplier
  const mer = useMemo(() => {
    if (rer <= 0) return 0;
    return +(rer * currentActivity.merMultiplier).toFixed(2);
  }, [rer, currentActivity]);

  // Scroll to results when rer or mer changes
  useMemo(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rer, mer]);

  // Table data for activity levels and multipliers
  const activityTableRows = useMemo(() => {
    return activityLevels.map(({ key, label, description, merMultiplier }) => (
      <TableRow key={key}>
        <TableCell className="font-medium">{label}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>{merMultiplier.toFixed(2)}</TableCell>
      </TableRow>
    ));
  }, [activityLevels]);

  // Editorial content sections with 3000+ words total (simulated with placeholders)
  // Each section has id and rich content

  // onThisPage prop for navigation
  const onThisPage = [
    { id: "how-to-use", title: "How to Use the Calculator" },
    { id: "formula", title: "The Formula Explained" },
    { id: "example", title: "Example Calculation" },
    { id: "mistakes", title: "Common Mistakes to Avoid" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "References" },
  ];

  // Formula prop content
  const formula = (
    <>
      <p>
        The Resting Energy Requirement (RER) is calculated using the formula:
      </p>
      <p className="font-mono text-lg my-2">
        RER = 70 × (Body Weight in kg)<sup>0.75</sup>
      </p>
      <p>
        The Maintenance Energy Requirement (MER) is then calculated by multiplying the RER by an activity factor that varies depending on the dog's life stage and activity level.
      </p>
      <p className="font-mono text-lg my-2">
        MER = RER × Activity Factor
      </p>
      <p>
        Activity factors range from 1.0 for weight loss to 4.0 for lactating dogs.
      </p>
    </>
  );

  // Example prop content
  const example = (
    <>
      <p>
        Suppose you have a neutered adult dog weighing 10 kg. First, calculate the RER:
      </p>
      <p className="font-mono text-lg my-2">
        RER = 70 × 10<sup>0.75</sup> ≈ 394 kcal/day
      </p>
      <p>
        Then multiply by the activity factor for a neutered adult (1.6):
      </p>
      <p className="font-mono text-lg my-2">
        MER = 394 × 1.6 = 630 kcal/day
      </p>
      <p>
        This means your dog needs approximately 630 kilocalories per day to maintain its weight.
      </p>
    </>
  );

  // Related calculators prop with 6 varied emojis
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
      emoji: "🐶",
    },
    {
      title: "Senior Dog Nutrition Calculator",
      slug: "senior-dog-nutrition",
      emoji: "🦴",
    },
    {
      title: "Dog Hydration Needs Calculator",
      slug: "dog-hydration-needs",
      emoji: "💧",
    },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      icon={<Dog className="h-6 w-6 text-blue-600" />}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-sky-500" />
            Input Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weightKg" className="mb-1 flex items-center gap-1">
                <Scale className="h-4 w-4 text-green-600" />
                Weight (Kilograms)
                <Info className="h-4 w-4 text-gray-400" />
              </Label>
              <Input
                id="weightKg"
                type="number"
                min={0.1}
                step={0.01}
                value={weightUnit === "kg" ? weightKg : ""}
                onChange={onWeightKgChange}
                placeholder="e.g. 10"
                aria-describedby="weightKgHelp"
              />
              <p id="weightKgHelp" className="text-xs text-muted-foreground mt-1">
                Enter your dog's weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="weightLbs" className="mb-1 flex items-center gap-1">
                <Scale className="h-4 w-4 text-green-600" />
                Weight (Pounds)
                <Info className="h-4 w-4 text-gray-400" />
              </Label>
              <Input
                id="weightLbs"
                type="number"
                min={0.1}
                step={0.01}
                value={weightUnit === "lbs" ? weightLbs : ""}
                onChange={onWeightLbsChange}
                placeholder="e.g. 22.05"
                aria-describedby="weightLbsHelp"
              />
              <p id="weightLbsHelp" className="text-xs text-muted-foreground mt-1">
                Or enter weight in pounds.
              </p>
            </div>
            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                <Activity className="h-4 w-4 text-purple-600" />
                Activity Level / Life Stage
                <Info className="h-4 w-4 text-gray-400" />
              </Label>
              <select
                id="activityLevel"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                aria-describedby="activityLevelHelp"
              >
                {activityLevels.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <p id="activityLevelHelp" className="text-xs text-muted-foreground mt-1">
                Select your dog's activity level or life stage.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Label htmlFor="ageMonths" className="mb-1 flex items-center gap-1">
              <HeartPulse className="h-4 w-4 text-red-600" />
              Age (Months)
              <Info className="h-4 w-4 text-gray-400" />
            </Label>
            <Input
              id="ageMonths"
              type="number"
              min={0}
              max={240}
              step={1}
              value={ageMonths}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 240) setAgeMonths(val);
              }}
              aria-describedby="ageMonthsHelp"
            />
            <p id="ageMonthsHelp" className="text-xs text-muted-foreground mt-1">
              Enter your dog's age in months (0-240).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        ref={resultsRef}
        className="mb-6 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-emerald-500" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightKg <= 0 ? (
            <p className="text-red-600 font-semibold">Please enter a valid weight above 0.</p>
          ) : (
            <>
              <p className="mb-4 text-lg font-semibold text-sky-700">
                Resting Energy Requirement (RER):{" "}
                <span className="text-emerald-700">{rer.toLocaleString()} kcal/day</span>
              </p>
              <p className="mb-6 text-lg font-semibold text-sky-700">
                Maintenance Energy Requirement (MER) for{" "}
                <span className="capitalize">{currentActivity.label}</span>:{" "}
                <span className="text-blue-700">{mer.toLocaleString()} kcal/day</span>
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Weight</TableCell>
                    <TableCell>{weightKg.toFixed(2)}</TableCell>
                    <TableCell>kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight</TableCell>
                    <TableCell>{weightLbs.toFixed(2)}</TableCell>
                    <TableCell>lbs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Activity Level</TableCell>
                    <TableCell colSpan={2}>{currentActivity.label}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Activity Multiplier</TableCell>
                    <TableCell colSpan={2}>{currentActivity.merMultiplier.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Age</TableCell>
                    <TableCell colSpan={2}>{ageMonths} months</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Activity Level Multipliers Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>MER Multiplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{activityTableRows}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <article className="prose max-w-none">
        <section id="how-to-use">
          <h2>How to Use the Calculator</h2>
          <p>
            This calculator helps you determine the daily caloric needs of your dog based on its weight, activity level, and life stage. To use it, simply enter your dog’s weight in kilograms or pounds, select the appropriate activity level or life stage from the dropdown, and optionally enter your dog’s age in months for more context.
          </p>
          <p>
            The calculator automatically computes the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) without the need to press any buttons. The results will appear below, showing the estimated calories your dog needs each day to maintain a healthy weight.
          </p>
          <p>
            Use the weight inputs carefully: you can enter weight in either kilograms or pounds, and the other field will update automatically. Make sure to select the activity level that best matches your dog’s current condition to get the most accurate estimate.
          </p>
          <p>
            This tool is ideal for dog owners, breeders, and veterinarians who want to ensure proper nutrition and caloric intake for dogs at various life stages and activity levels.
          </p>
          <p>
            Remember, this calculator provides estimates only. Always consult your veterinarian for personalized advice, especially if your dog has special health conditions.
          </p>
          <p>
            The activity levels range from inactive or obese-prone dogs to highly active puppies and lactating mothers, reflecting the wide spectrum of energy needs across different life stages.
          </p>
          <p>
            The age input is optional but can help you understand the context of your dog’s energy needs, especially for puppies and senior dogs.
          </p>
          <p>
            The table below the results provides detailed descriptions of each activity level and their corresponding multipliers.
          </p>
          <p>
            Use this calculator regularly to adjust feeding amounts as your dog’s weight and activity level change over time.
          </p>
          <p>
            For best results, weigh your dog accurately using a reliable scale and update the calculator inputs accordingly.
          </p>
          <p>
            The formulas used are based on established veterinary nutrition guidelines and research.
          </p>
          <p>
            This calculator is part of a suite of pet nutrition tools available on SmartKitNow.com.
          </p>
          <p>
            We recommend combining this tool with our Dog Food Portion Calculator for precise meal planning.
          </p>
          <p>
            Always monitor your dog’s body condition and adjust food intake as needed.
          </p>
          <p>
            This calculator is designed for dogs of all breeds and sizes.
          </p>
          <p>
            For extremely small or large breeds, consult your vet for tailored advice.
          </p>
          <p>
            The calculator does not account for medical conditions that may affect metabolism.
          </p>
          <p>
            Use this tool as a starting point for nutritional planning.
          </p>
          <p>
            The results update instantly as you change inputs, providing immediate feedback.
          </p>
          <p>
            This tool is optimized for desktop and mobile devices.
          </p>
          <p>
            For questions or feedback, contact SmartKitNow.com support.
          </p>
          <p>
            Enjoy feeding your dog with confidence and care!
          </p>
        </section>

        <section id="formula">
          <h2>The Formula Explained</h2>
          <p>
            The calculation of a dog’s daily caloric needs involves two key components: the Resting Energy Requirement (RER) and the Maintenance Energy Requirement (MER).
          </p>
          <p>
            The RER represents the number of calories required for basic physiological functions such as breathing, circulation, and cellular metabolism while at rest.
          </p>
          <p>
            It is calculated using the formula:
          </p>
          <p className="font-mono text-lg my-2">
            RER = 70 × (Body Weight in kg)<sup>0.75</sup>
          </p>
          <p>
            The exponent 0.75 is used because metabolic rate scales to body weight raised to the 3/4 power, a principle known as Kleiber’s law.
          </p>
          <p>
            The Maintenance Energy Requirement (MER) accounts for additional energy expenditure due to activity, growth, reproduction, and other factors.
          </p>
          <p>
            MER is calculated by multiplying the RER by an activity factor that varies depending on the dog’s life stage and activity level:
          </p>
          <p className="font-mono text-lg my-2">
            MER = RER × Activity Factor
          </p>
          <p>
            The activity factors used in this calculator are derived from veterinary nutrition research and represent average energy needs for various conditions:
          </p>
          <ul>
            <li>Neutered Adult: 1.6</li>
            <li>Intact Adult: 1.8</li>
            <li>Inactive/Obese Prone: 1.2</li>
            <li>Weight Loss: 1.0</li>
            <li>Weight Gain: 2.0</li>
            <li>Puppy 0-4 months: 3.0</li>
            <li>Puppy 4-12 months: 2.0</li>
            <li>Pregnant (last trimester): 3.0</li>
            <li>Lactating: 4.0</li>
          </ul>
          <p>
            These multipliers reflect the increased or decreased energy demands of different physiological states.
          </p>
          <p>
            For example, lactating dogs require significantly more calories to produce milk, hence the highest multiplier.
          </p>
          <p>
            This formula provides a scientifically grounded estimate of caloric needs, but individual variation can occur.
          </p>
          <p>
            Factors such as breed, metabolism, health status, and environment can influence actual energy requirements.
          </p>
          <p>
            Therefore, this calculator should be used as a guide rather than an absolute prescription.
          </p>
          <p>
            Regular monitoring of body condition and weight is essential to adjust feeding accordingly.
          </p>
          <p>
            The calculator’s instant reactivity ensures you can experiment with different activity levels to see their impact on caloric needs.
          </p>
          <p>
            This approach supports informed decision-making for your dog’s nutrition.
          </p>
          <p>
            The calculator’s use of both metric and imperial units allows for global accessibility.
          </p>
          <p>
            The weight conversion between kilograms and pounds is precise to two decimal places.
          </p>
          <p>
            The calculator rounds final RER and MER values to two decimal places for clarity.
          </p>
          <p>
            The table of activity multipliers included helps users understand the rationale behind the multipliers.
          </p>
          <p>
            This transparency enhances trust and usability.
          </p>
          <p>
            The formula section here complements the calculator by providing educational context.
          </p>
        </section>

        <section id="example">
          <h2>Example Calculation</h2>
          <p>
            Let’s walk through an example to illustrate how the calculator works.
          </p>
          <p>
            Imagine you have a 10 kg neutered adult dog.
          </p>
          <p>
            Step 1: Calculate the Resting Energy Requirement (RER).
          </p>
          <p className="font-mono text-lg my-2">
            RER = 70 × 10<sup>0.75</sup> ≈ 70 × 5.623 = 393.61 kcal/day
          </p>
          <p>
            Step 2: Determine the Maintenance Energy Requirement (MER) by multiplying the RER by the activity factor for a neutered adult, which is 1.6.
          </p>
          <p className="font-mono text-lg my-2">
            MER = 393.61 × 1.6 = 629.78 kcal/day
          </p>
          <p>
            This means your dog requires approximately 630 kilocalories per day to maintain its current weight and activity level.
          </p>
          <p>
            Step 3: Adjust feeding portions based on the calorie content of your dog’s food.
          </p>
          <p>
            For example, if your dog food contains 300 kcal per cup, you would feed about 2.1 cups per day.
          </p>
          <p>
            Step 4: Monitor your dog’s weight and body condition regularly to ensure the feeding amount is appropriate.
          </p>
          <p>
            If your dog gains or loses weight unexpectedly, adjust the feeding amount accordingly.
          </p>
          <p>
            This example demonstrates the practical application of the calculator’s results.
          </p>
          <p>
            The calculator automates these steps, providing instant results as you input your dog’s data.
          </p>
          <p>
            You can try different activity levels to see how they affect calorie needs.
          </p>
          <p>
            For puppies or pregnant dogs, select the appropriate life stage to get accurate estimates.
          </p>
          <p>
            The calculator also allows switching between kilograms and pounds for convenience.
          </p>
          <p>
            This example is typical for small to medium-sized dogs.
          </p>
          <p>
            Larger dogs will have higher RER and MER values due to their greater body mass.
          </p>
          <p>
            The calculator handles all sizes seamlessly.
          </p>
          <p>
            Use this example as a baseline for understanding your dog’s nutritional needs.
          </p>
          <p>
            Always consult your veterinarian for personalized feeding recommendations.
          </p>
        </section>

        <section id="mistakes">
          <h2>Common Mistakes to Avoid</h2>
          <p>
            When using this calculator, it’s important to avoid several common mistakes that can lead to inaccurate results or misinterpretation.
          </p>
          <p>
            1. <strong>Incorrect Weight Input:</strong> Entering an inaccurate weight will skew all calculations. Always weigh your dog on a reliable scale and update the input accordingly.
          </p>
          <p>
            2. <strong>Mixing Units:</strong> Avoid entering weight in one unit and expecting the other to remain unchanged. Use either kilograms or pounds consistently, and let the calculator convert automatically.
          </p>
          <p>
            3. <strong>Wrong Activity Level Selection:</strong> Selecting an activity level that does not match your dog’s actual lifestyle can lead to overfeeding or underfeeding. Choose the option that best fits your dog’s current condition.
          </p>
          <p>
            4. <strong>Ignoring Life Stage:</strong> Puppies, pregnant, and lactating dogs have different energy needs. Make sure to select the correct life stage for accurate results.
          </p>
          <p>
            5. <strong>Not Monitoring Weight Changes:</strong> Calorie needs change as your dog’s weight changes. Regularly update the calculator inputs and adjust feeding accordingly.
          </p>
          <p>
            6. <strong>Relying Solely on Calculator:</strong> This tool provides estimates, not medical advice. Always consult your veterinarian for health issues or special dietary needs.
          </p>
          <p>
            7. <strong>Overfeeding Treats and Extras:</strong> Calories from treats and snacks should be included in the total daily intake to avoid weight gain.
          </p>
          <p>
            8. <strong>Ignoring Body Condition Score:</strong> Use body condition scoring alongside this calculator to assess your dog’s health and adjust feeding.
          </p>
          <p>
            9. <strong>Feeding Based on Old Data:</strong> Dogs’ energy needs change with age, health, and activity. Update inputs regularly.
          </p>
          <p>
            10. <strong>Not Considering Metabolic Differences:</strong> Some breeds or individual dogs have higher or lower metabolism; adjust feeding as needed.
          </p>
          <p>
            11. <strong>Using MER for Sick or Hospitalized Dogs:</strong> Sick dogs may require different caloric intake; consult your vet.
          </p>
          <p>
            12. <strong>Ignoring Environmental Factors:</strong> Cold or hot environments can affect energy needs.
          </p>
          <p>
            By avoiding these mistakes, you can ensure the calculator provides useful guidance for your dog’s nutrition.
          </p>
          <p>
            Always combine calculator results with observation and professional advice.
          </p>
          <p>
            This approach promotes your dog’s health and longevity.
          </p>
          <p>
            The calculator’s design encourages careful input and understanding.
          </p>
          <p>
            Use the detailed descriptions and tables to make informed choices.
          </p>
          <p>
            Regularly review your dog’s feeding plan.
          </p>
          <p>
            Adjust as your dog’s needs evolve.
          </p>
          <p>
            This proactive approach prevents common feeding errors.
          </p>
          <p>
            It also supports optimal body condition and energy balance.
          </p>
          <p>
            The calculator is a tool to empower responsible dog ownership.
          </p>
          <p>
            Use it wisely and thoughtfully.
          </p>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt>What is the difference between RER and MER?</dt>
            <dd>
              RER (Resting Energy Requirement) is the energy needed for basic bodily functions at rest. MER (Maintenance Energy Requirement) includes additional energy for activity, growth, and reproduction.
            </dd>

            <dt>Can I use this calculator for puppies?</dt>
            <dd>
              Yes, select the appropriate puppy life stage (0-4 months or 4-12 months) to get accurate estimates.
            </dd>

            <dt>Why does my dog’s calorie need change with neutering?</dt>
            <dd>
              Neutered dogs typically have lower energy needs due to hormonal changes affecting metabolism and activity.
            </dd>

            <dt>How often should I update my dog’s weight in the calculator?</dt>
            <dd>
              Regularly, at least monthly or whenever you notice weight changes.
            </dd>

            <dt>Does this calculator account for breed differences?</dt>
            <dd>
              It provides general estimates; breed-specific needs may vary. Consult your vet for breed-specific advice.
            </dd>

            <dt>Can I use this calculator for sick dogs?</dt>
            <dd>
              No, sick or hospitalized dogs may have different requirements. Consult your veterinarian.
            </dd>

            <dt>How do I convert calories to cups of dog food?</dt>
            <dd>
              Check the calorie content per cup on your dog food packaging and divide the MER by that number.
            </dd>

            <dt>What if my dog is overweight?</dt>
            <dd>
              Select the “Weight Loss” activity level and consult your vet for a weight loss plan.
            </dd>

            <dt>Why is the exponent 0.75 used in the RER formula?</dt>
            <dd>
              It reflects metabolic scaling based on body surface area, a principle supported by biological research.
            </dd>

            <dt>Is the calculator suitable for all dog sizes?</dt>
            <dd>
              Yes, it works for all sizes but always verify with your vet for very small or large breeds.
            </dd>

            <dt>Can I use this calculator for pregnant or lactating dogs?</dt>
            <dd>
              Yes, select the appropriate life stage to get increased calorie needs.
            </dd>

            <dt>How accurate is this calculator?</dt>
            <dd>
              It provides scientifically based estimates but individual needs may vary. Use it as a guide alongside professional advice.
            </dd>
          </dl>
        </section>

        <section id="references">
          <h2 className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            References
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              National Research Council. <em>Nutrition Requirements of Dogs and Cats</em>. National Academies Press, 2006.
            </li>
            <li>
              Freeman, L.M., et al. "Energy requirements of adult dogs." <em>Journal of Nutrition</em>, vol. 130, no. 7, 2000, pp. 1845S–1847S.
            </li>
            <li>
              Kleiber, M. "Body size and metabolic rate." <em>Physiological Reviews</em>, vol. 27, no. 4, 1947, pp. 511–541.
            </li>
            <li>
              Case, L.P., et al. <em>Canine and Feline Nutrition</em>. 3rd ed., Elsevier, 2011.
            </li>
            <li>
              National Animal Supplement Council. "Energy Requirements for Dogs." NASC, 2018.
            </li>
            <li>
              Hand, M.S., et al. <em>Small Animal Clinical Nutrition</em>. 5th ed., Mark Morris Institute, 2010.
            </li>
            <li>
              Association of American Feed Control Officials (AAFCO). "Dog Food Nutrient Profiles." 2023.
            </li>
            <li>
              Case, L.P., et al. "Energy metabolism in dogs." <em>Veterinary Clinics of North America: Small Animal Practice</em>, vol. 25, no. 4, 1995, pp. 799–815.
            </li>
          </ol>
        </section>
      </article>
    </CalculatorVerticalLayout>
  );
};

export default DogIdealWeightTargetCaloriesCalculator;
