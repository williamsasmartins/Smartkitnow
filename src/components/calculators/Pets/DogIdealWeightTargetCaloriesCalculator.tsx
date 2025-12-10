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
  const [weightKg, setWeightKg] = useState(10); // realistic default: 10 kg dog
  const [weightLbs, setWeightLbs] = useState(22.05); // synced with kg
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<"neutered" | "intact" | "inactive" | "weightLoss" | "weightGain" | "puppy" | "workingDog">("neutered");
  const [ageMonths, setAgeMonths] = useState(12); // 1 year old default
  const [isPuppy, setIsPuppy] = useState(false);
  const [isPregnantOrLactating, setIsPregnantOrLactating] = useState(false);
  const [pregnancyStageWeeks, setPregnancyStageWeeks] = useState(0);
  const [lactationWeek, setLactationWeek] = useState(0);

  // Refs for smooth scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync weight units
  useEffect(() => {
    if (weightUnit === "kg") {
      setWeightLbs(parseFloat((weightKg * 2.20462).toFixed(2)));
    } else {
      setWeightKg(parseFloat((weightLbs / 2.20462).toFixed(2)));
    }
  }, [weightKg, weightLbs, weightUnit]);

  // Determine if puppy based on ageMonths
  useEffect(() => {
    setIsPuppy(ageMonths < 12);
  }, [ageMonths]);

  // Constants for activity multipliers based on NRC and AAFCO guidelines and common vet nutrition sources
  // RER = 70 * (weight_kg)^0.75
  // MER = RER * activity multiplier

  // Activity multipliers:
  // Neutered adult: 1.6
  // Intact adult: 1.8
  // Inactive/obese prone: 1.2-1.4 (use 1.2)
  // Weight loss: 1.0
  // Weight gain: 1.8
  // Puppy 0-4 months: 3.0
  // Puppy 4 months to adult: 2.0
  // Working dog: 2.0-5.0 (use 3.0 average)
  // Pregnancy 1st 42 days: 1.6
  // Pregnancy last 3 weeks: 3.0
  // Lactation: 4.0-8.0 (use 6.0 average)

  // Calculate RER
  const RER = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  // Calculate MER based on activity level and special conditions
  const MER = useMemo(() => {
    if (RER === 0) return 0;
    let multiplier = 1.6; // default neutered adult

    switch (activityLevel) {
      case "neutered":
        multiplier = 1.6;
        break;
      case "intact":
        multiplier = 1.8;
        break;
      case "inactive":
        multiplier = 1.2;
        break;
      case "weightLoss":
        multiplier = 1.0;
        break;
      case "weightGain":
        multiplier = 1.8;
        break;
      case "puppy":
        if (ageMonths <= 4) {
          multiplier = 3.0;
        } else {
          multiplier = 2.0;
        }
        break;
      case "workingDog":
        multiplier = 3.0;
        break;
      default:
        multiplier = 1.6;
    }

    // Adjust for pregnancy and lactation if applicable
    if (isPregnantOrLactating) {
      if (pregnancyStageWeeks > 0 && pregnancyStageWeeks <= 6) {
        multiplier = Math.max(multiplier, 1.6);
      } else if (pregnancyStageWeeks > 6) {
        multiplier = Math.max(multiplier, 3.0);
      }
      if (lactationWeek > 0) {
        // Lactation energy needs peak around week 3-4
        multiplier = Math.max(multiplier, 6.0);
      }
    }

    return RER * multiplier;
  }, [RER, activityLevel, ageMonths, isPregnantOrLactating, pregnancyStageWeeks, lactationWeek]);

  // Calories per day rounded
  const caloriesPerDay = useMemo(() => Math.round(MER), [MER]);

  // Smooth scroll to results when caloriesPerDay changes
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [caloriesPerDay]);

  // Table data for activity multipliers
  const activityMultipliersTable = [
    { activity: "Neutered Adult Dog", multiplier: 1.6, description: "Typical adult dog after spaying/neutering" },
    { activity: "Intact Adult Dog", multiplier: 1.8, description: "Adult dog not spayed/neutered" },
    { activity: "Inactive/Obese Prone Dog", multiplier: 1.2, description: "Less active or prone to obesity" },
    { activity: "Weight Loss", multiplier: 1.0, description: "Calorie intake for weight reduction" },
    { activity: "Weight Gain", multiplier: 1.8, description: "Increased calories for weight gain" },
    { activity: "Puppy 0-4 Months", multiplier: 3.0, description: "Rapid growth phase" },
    { activity: "Puppy 4 Months to Adult", multiplier: 2.0, description: "Slower growth phase" },
    { activity: "Working Dog", multiplier: 3.0, description: "High activity and energy expenditure" },
    { activity: "Pregnant Dog (1st 6 weeks)", multiplier: 1.6, description: "Early pregnancy energy needs" },
    { activity: "Pregnant Dog (Last 3 weeks)", multiplier: 3.0, description: "Late pregnancy energy needs" },
    { activity: "Lactating Dog", multiplier: 6.0, description: "Peak milk production energy needs" },
  ];

  // OnThisPage links for editorial
  const onThisPage = [
    { id: "how-to-use", title: "How to Use This Calculator" },
    { id: "formula", title: "Understanding the Formula" },
    { id: "example", title: "Example Calculation" },
    { id: "mistakes", title: "Common Mistakes to Avoid" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "References" },
  ];

  // Related calculators with emojis
  const relatedCalculators = [
    { title: "Cat Calorie Needs Calculator", slug: "cat-calorie-needs", emoji: "🐱" },
    { title: "Dog Food Portion Calculator", slug: "dog-food-portion", emoji: "🍖" },
    { title: "Pet Weight Tracker", slug: "pet-weight-tracker", emoji: "⚖️" },
    { title: "Dog Hydration Needs Calculator", slug: "dog-hydration-needs", emoji: "💧" },
    { title: "Puppy Growth Chart", slug: "puppy-growth-chart", emoji: "🐾" },
    { title: "Senior Dog Nutrition Calculator", slug: "senior-dog-nutrition", emoji: "🦴" },
  ];

  // FAQ questions and answers
  const faqItems = [
    {
      question: "What is RER and why is it important?",
      answer:
        "RER stands for Resting Energy Requirement, which is the amount of energy (calories) a dog needs at rest to maintain basic physiological functions such as breathing, circulation, and cellular metabolism. It forms the baseline for calculating total daily calorie needs.",
    },
    {
      question: "How does MER differ from RER?",
      answer:
        "MER stands for Maintenance Energy Requirement and accounts for a dog's activity level, growth, reproduction, and other factors. MER is calculated by multiplying RER by an activity multiplier to estimate total daily calorie needs.",
    },
    {
      question: "Why do puppies need more calories than adult dogs?",
      answer:
        "Puppies are growing rapidly and require more energy for development, tissue growth, and increased activity. Their MER multipliers are higher to reflect these increased energy demands.",
    },
    {
      question: "How do pregnancy and lactation affect calorie needs?",
      answer:
        "Pregnant and lactating dogs require significantly more calories to support fetal growth and milk production. Energy needs can increase up to 3 times during late pregnancy and up to 6 times during peak lactation.",
    },
    {
      question: "Can I use this calculator for all dog breeds?",
      answer:
        "Yes, this calculator is designed for all dog breeds. However, very large or very small breeds may have slightly different energy requirements. Always consult your veterinarian for breed-specific advice.",
    },
    {
      question: "What if my dog is overweight or underweight?",
      answer:
        "Adjust the activity level to 'weightLoss' or 'weightGain' to estimate calorie needs for weight management. Consult your veterinarian for a tailored feeding plan.",
    },
    {
      question: "Why is weight input important in kg or lbs?",
      answer:
        "Accurate weight measurement is crucial because calorie needs are calculated based on body weight. This calculator supports both kilograms and pounds for convenience.",
    },
    {
      question: "How often should I recalculate my dog's calorie needs?",
      answer:
        "Recalculate whenever your dog's weight, activity level, or life stage changes, such as growth, pregnancy, or changes in exercise routine.",
    },
    {
      question: "Does this calculator consider the dog's body condition score?",
      answer:
        "This calculator does not directly use body condition score but allows adjustments via activity level for weight loss or gain. For precise management, consult a veterinarian.",
    },
    {
      question: "Is this calculator suitable for senior dogs?",
      answer:
        "Yes, but senior dogs often have lower activity levels and different nutritional needs. Select the appropriate activity level or use the Senior Dog Nutrition Calculator for more tailored results.",
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
      formula={
        <>
          <p>
            The fundamental formula used in this calculator is the Resting Energy Requirement (RER), calculated as:
          </p>
          <pre className="bg-gray-100 p-4 rounded my-4 text-lg font-mono">
            RER = 70 × (Body Weight in kg)<sup>0.75</sup>
          </pre>
          <p>
            The Maintenance Energy Requirement (MER) is then calculated by multiplying RER by an activity multiplier, which varies based on the dog's life stage, activity, and physiological state:
          </p>
          <pre className="bg-gray-100 p-4 rounded my-4 text-lg font-mono">
            MER = RER × Activity Multiplier
          </pre>
          <p>
            Activity multipliers range from 1.0 for weight loss to up to 6.0 for lactating dogs.
          </p>
        </>
      }
      example={
        <>
          <p>
            Consider a 10 kg neutered adult dog with moderate activity:
          </p>
          <ul className="list-disc ml-6 my-4">
            <li>Calculate RER: 70 × 10<sup>0.75</sup> ≈ 394 kcal/day</li>
            <li>Activity multiplier for neutered adult: 1.6</li>
            <li>Calculate MER: 394 × 1.6 = 630 kcal/day</li>
          </ul>
          <p>
            This dog requires approximately 630 calories per day to maintain its weight.
          </p>
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <section id="how-to-use" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Calculator size={28} /> How to Use This Calculator
        </h2>
        <p>
          This calculator estimates the daily calorie needs of your dog based on its weight, activity level, and life stage. To use it effectively:
        </p>
        <ol className="list-decimal ml-6 my-4 space-y-2">
          <li>
            Enter your dog's current weight in kilograms or pounds. You can toggle between units, and the other field will update automatically.
          </li>
          <li>
            Select your dog's activity level from the dropdown. This includes options for neutered or intact adults, puppies, working dogs, and special conditions like pregnancy or lactation.
          </li>
          <li>
            If your dog is a puppy, input its age in months to refine the energy needs.
          </li>
          <li>
            For pregnant or lactating dogs, specify the stage of pregnancy or lactation to adjust calorie requirements accordingly.
          </li>
          <li>
            The calculator will instantly display your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) in calories per day.
          </li>
          <li>
            Review the detailed tables and editorial sections for more information on feeding guidelines and nutrition.
          </li>
        </ol>
        <p>
          Scroll down to the results section to see your dog's calorie needs and detailed breakdowns.
        </p>
      </section>

      <section id="formula" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Scale size={28} /> Understanding the Formula
        </h2>
        <p>
          The calculation of your dog's daily calorie needs is based on two key concepts: Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Resting Energy Requirement (RER)</h3>
        <p>
          RER represents the energy required for basic physiological functions while the dog is at rest in a thermoneutral environment. It is calculated using the formula:
        </p>
        <pre className="bg-gray-100 p-4 rounded my-4 text-lg font-mono">
          RER = 70 × (Weight in kg)<sup>0.75</sup>
        </pre>
        <p>
          This formula accounts for metabolic scaling, recognizing that larger animals have lower metabolic rates per unit of body weight.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Maintenance Energy Requirement (MER)</h3>
        <p>
          MER adjusts RER to account for the dog's activity level, growth, reproduction, and other physiological states. It is calculated by multiplying RER by an activity multiplier:
        </p>
        <pre className="bg-gray-100 p-4 rounded my-4 text-lg font-mono">
          MER = RER × Activity Multiplier
        </pre>
        <p>
          The activity multiplier varies widely:
        </p>
        <ul className="list-disc ml-6 my-4">
          <li>Neutered adult dogs: 1.6</li>
          <li>Intact adult dogs: 1.8</li>
          <li>Inactive or obese-prone dogs: 1.2</li>
          <li>Puppies (0-4 months): 3.0</li>
          <li>Puppies (4 months to adult): 2.0</li>
          <li>Working dogs: 3.0</li>
          <li>Pregnant dogs (early): 1.6</li>
          <li>Pregnant dogs (late): 3.0</li>
          <li>Lactating dogs: 6.0</li>
        </ul>
        <p>
          These multipliers are derived from veterinary nutrition guidelines and research studies.
        </p>
      </section>

      <section id="example" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Activity size={28} /> Example Calculation
        </h2>
        <p>
          Let's walk through an example to see how the calculator works.
        </p>
        <p>
          Suppose you have a 10 kg neutered adult dog with moderate activity.
        </p>
        <ol className="list-decimal ml-6 my-4 space-y-2">
          <li>
            Calculate RER:
            <pre className="bg-gray-100 p-2 rounded inline-block font-mono">
              70 × 10<sup>0.75</sup> ≈ 394 kcal/day
            </pre>
          </li>
          <li>
            Select the activity multiplier for a neutered adult dog: 1.6
          </li>
          <li>
            Calculate MER:
            <pre className="bg-gray-100 p-2 rounded inline-block font-mono">
              394 × 1.6 = 630 kcal/day
            </pre>
          </li>
          <li>
            The dog requires approximately 630 calories per day to maintain its weight.
          </li>
        </ol>
        <p>
          Adjust the activity level or weight to see how calorie needs change.
        </p>
      </section>

      <section id="mistakes" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Info size={28} /> Common Mistakes to Avoid
        </h2>
        <p>
          When calculating your dog's calorie needs, avoid these common pitfalls:
        </p>
        <ul className="list-disc ml-6 my-4 space-y-2">
          <li>
            <strong>Using inaccurate weight:</strong> Always weigh your dog using a reliable scale. Guessing weight can lead to incorrect calorie estimates.
          </li>
          <li>
            <strong>Ignoring life stage:</strong> Puppies, pregnant, and lactating dogs have significantly different energy requirements.
          </li>
          <li>
            <strong>Not adjusting for activity:</strong> Sedentary dogs need fewer calories than active or working dogs.
          </li>
          <li>
            <strong>Feeding based only on package instructions:</strong> Commercial dog food labels provide general guidelines that may not fit your dog's specific needs.
          </li>
          <li>
            <strong>Failing to monitor body condition:</strong> Regularly assess your dog's body condition score to adjust feeding amounts accordingly.
          </li>
          <li>
            <strong>Overfeeding treats and snacks:</strong> Treats can add significant calories and should be accounted for in total daily intake.
          </li>
          <li>
            <strong>Not consulting a veterinarian:</strong> Always consult your vet for personalized advice, especially if your dog has health conditions.
          </li>
        </ul>
      </section>

      <section id="faq" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <HeartPulse size={28} /> Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map(({ question, answer }, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-2">{question}</h3>
              <p className="text-gray-700">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="mb-16">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <BookOpen size={28} /> References
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            National Research Council. (2006). Nutrient Requirements of Dogs and Cats. The National Academies Press.
          </li>
          <li>
            Freeman, L. M., Michel, K. E., & Willoughby, K. (2011). Energy requirements of dogs and cats. Veterinary Clinics of North America: Small Animal Practice, 41(2), 293-308.
          </li>
          <li>
            Case, L. P., Daristotle, L., Hayek, M. G., & Raasch, M. F. (2011). Canine and Feline Nutrition: A Resource for Companion Animal Professionals. Elsevier Health Sciences.
          </li>
          <li>
            Association of American Feed Control Officials (AAFCO). (2023). Dog Food Nutrient Profiles.
          </li>
          <li>
            Hand, M. S., Thatcher, C. D., Remillard, R. L., Roudebush, P., & Novotny, B. J. (2010). Small Animal Clinical Nutrition. Mark Morris Institute.
          </li>
          <li>
            National Animal Supplement Council. (2020). Feeding Guidelines for Dogs and Cats.
          </li>
          <li>
            National Research Council. (1985). Nutrient Requirements of Dogs. National Academies Press.
          </li>
          <li>
            German, A. J. (2006). The growing problem of obesity in dogs and cats. The Journal of Nutrition, 136(7), 1940S-1946S.
          </li>
        </ul>
      </section>

      <Card
        ref={resultsRef}
        className="mb-16 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border-0 shadow-lg"
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Flame size={28} /> Results: Daily Calorie Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Scale size={20} /> Resting Energy Requirement (RER)
              </h3>
              <p className="text-lg font-mono bg-white/80 rounded p-3 shadow-inner">
                {RER.toFixed(2)} kcal/day
              </p>
              <p className="mt-2 text-gray-700">
                The energy your dog needs at rest for vital functions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Activity size={20} /> Maintenance Energy Requirement (MER)
              </h3>
              <p className="text-lg font-mono bg-white/80 rounded p-3 shadow-inner">
                {caloriesPerDay.toLocaleString()} kcal/day
              </p>
              <p className="mt-2 text-gray-700">
                The total daily calories your dog needs based on activity and life stage.
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TableHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity Level</TableHead>
                      <TableHead>Multiplier</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityMultipliersTable.map(({ activity, multiplier, description }, idx) => (
                      <TableRow key={idx} className={activity === activityLevel ? "bg-sky-100 font-semibold" : ""}>
                        <TableCell>{activity}</TableCell>
                        <TableCell>{multiplier.toFixed(1)}</TableCell>
                        <TableCell>{description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableHeader>
            </h3>
          </section>
        </CardContent>
      </Card>

      <form className="space-y-8 mb-24" aria-label="Dog Calorie Needs Input Form">
        <div>
          <Label htmlFor="weight" className="mb-2 block font-semibold flex items-center gap-2">
            <Scale size={20} /> Dog Weight
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="weightKg"
              type="number"
              min={0.1}
              step={0.1}
              value={weightUnit === "kg" ? weightKg : ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) {
                  setWeightKg(val);
                  setWeightUnit("kg");
                } else if (e.target.value === "") {
                  setWeightKg(0);
                }
              }}
              placeholder="Weight in kg"
              aria-label="Weight in kilograms"
              className="w-32"
            />
            <span>kg</span>
            <Input
              id="weightLbs"
              type="number"
              min={0.1}
              step={0.1}
              value={weightUnit === "lbs" ? weightLbs : ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) {
                  setWeightLbs(val);
                  setWeightUnit("lbs");
                } else if (e.target.value === "") {
                  setWeightLbs(0);
                }
              }}
              placeholder="Weight in lbs"
              aria-label="Weight in pounds"
              className="w-32"
            />
            <span>lbs</span>
          </div>
        </div>

        <div>
          <Label htmlFor="ageMonths" className="mb-2 block font-semibold flex items-center gap-2">
            <Dog size={20} /> Dog Age (Months)
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
              if (!isNaN(val) && val >= 0) {
                setAgeMonths(val);
              }
            }}
            aria-describedby="ageHelp"
          />
          <p id="ageHelp" className="text-sm text-gray-600 mt-1">
            Enter your dog's age in months. Puppies are &lt; 12 months.
          </p>
        </div>

        <div>
          <Label htmlFor="activityLevel" className="mb-2 block font-semibold flex items-center gap-2">
            <Activity size={20} /> Activity Level / Life Stage
          </Label>
          <select
            id="activityLevel"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as any)}
            className="w-full rounded border border-gray-300 p-2"
          >
            <option value="neutered">Neutered Adult Dog</option>
            <option value="intact">Intact Adult Dog</option>
            <option value="inactive">Inactive / Obese Prone Dog</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="weightGain">Weight Gain</option>
            <option value="puppy">Puppy</option>
            <option value="workingDog">Working Dog</option>
          </select>
        </div>

        {(activityLevel === "puppy" || isPuppy) && (
          <div>
            <Label htmlFor="puppyAge" className="mb-2 block font-semibold flex items-center gap-2">
              <Dog size={20} /> Puppy Age (Months)
            </Label>
            <Input
              id="puppyAge"
              type="number"
              min={0}
              max={12}
              step={1}
              value={ageMonths}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 12) {
                  setAgeMonths(val);
                }
              }}
            />
            <p className="text-sm text-gray-600 mt-1">
              Puppies younger than 12 months have higher calorie needs.
            </p>
          </div>
        )}

        <div>
          <Label className="mb-2 block font-semibold flex items-center gap-2">
            <Droplet size={20} /> Pregnancy / Lactation
          </Label>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="checkbox"
              id="pregnantOrLactating"
              checked={isPregnantOrLactating}
              onChange={(e) => setIsPregnantOrLactating(e.target.checked)}
              className="w-5 h-5"
            />
            <Label htmlFor="pregnantOrLactating" className="cursor-pointer">
              Pregnant or Lactating
            </Label>
          </div>
          {isPregnantOrLactating && (
            <>
              <div className="mb-4">
                <Label htmlFor="pregnancyStageWeeks" className="mb-2 block font-semibold flex items-center gap-2">
                  <Droplet size={16} /> Pregnancy Stage (Weeks)
                </Label>
                <Input
                  id="pregnancyStageWeeks"
                  type="number"
                  min={0}
                  max={9}
                  step={1}
                  value={pregnancyStageWeeks}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0 && val <= 9) {
                      setPregnancyStageWeeks(val);
                    }
                  }}
                  disabled={lactationWeek > 0}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter weeks of pregnancy (0-9). Leave 0 if lactating.
                </p>
              </div>
              <div>
                <Label htmlFor="lactationWeek" className="mb-2 block font-semibold flex items-center gap-2">
                  <Droplet size={16} /> Lactation Week
                </Label>
                <Input
                  id="lactationWeek"
                  type="number"
                  min={0}
                  max={8}
                  step={1}
                  value={lactationWeek}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0 && val <= 8) {
                      setLactationWeek(val);
                    }
                  }}
                  disabled={pregnancyStageWeeks > 0}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter week of lactation (0-8). Leave 0 if pregnant.
                </p>
              </div>
            </>
          )}
        </div>
      </form>
    </CalculatorVerticalLayout>
  );
};

export default DogIdealWeightTargetCaloriesCalculator;
