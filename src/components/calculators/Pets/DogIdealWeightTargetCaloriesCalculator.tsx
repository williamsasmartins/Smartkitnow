import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, HeartPulse, Dog, Cat, Apple, Flame, Droplet, BookOpen } from "lucide-react";

const DogCalorieNeedsRerMerCalculator = () => {
  // State variables for inputs
  const [weightKg, setWeightKg] = useState(10); // realistic default 10 kg dog
  const [weightLbs, setWeightLbs] = useState(22.05); // synced with kg
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" or "lbs"
  const [activityLevel, setActivityLevel] = useState("maintenance"); // options: maintenance, neutered, intact, active, working, weightLoss, weightGain
  const [ageMonths, setAgeMonths] = useState(24); // dog age in months
  const [isPuppy, setIsPuppy] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isLactating, setIsLactating] = useState(false);

  // Refs for smooth scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync weight units
  const onWeightKgChange = (val: number) => {
    setWeightKg(val);
    setWeightLbs(parseFloat((val * 2.20462).toFixed(2)));
  };
  const onWeightLbsChange = (val: number) => {
    setWeightLbs(val);
    setWeightKg(parseFloat((val / 2.20462).toFixed(2)));
  };

  // Determine if puppy based on age
  useMemo(() => {
    setIsPuppy(ageMonths < 12);
  }, [ageMonths]);

  // Constants for activity multipliers (MER multipliers)
  const activityMultipliers: Record<string, number> = {
    maintenance: 1.6,
    neutered: 1.6,
    intact: 1.8,
    active: 2.0,
    working: 5.0,
    weightLoss: 1.0,
    weightGain: 1.8,
    puppy: 3.0,
    pregnant: 3.0,
    lactating: 4.0,
  };

  // Calculate Resting Energy Requirement (RER)
  // RER = 70 * (weight in kg)^0.75
  const RER = useMemo(() => {
    const rer = 70 * Math.pow(weightKg, 0.75);
    return parseFloat(rer.toFixed(2));
  }, [weightKg]);

  // Calculate Maintenance Energy Requirement (MER)
  // MER = RER * activity multiplier
  const MER = useMemo(() => {
    let multiplier = activityMultipliers[activityLevel] || 1.6;
    if (isPuppy) multiplier = activityMultipliers["puppy"];
    if (isPregnant) multiplier = activityMultipliers["pregnant"];
    if (isLactating) multiplier = activityMultipliers["lactating"];
    const mer = RER * multiplier;
    return parseFloat(mer.toFixed(2));
  }, [RER, activityLevel, isPuppy, isPregnant, isLactating]);

  // Scroll to results on MER change
  useMemo(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [MER]);

  // Table data for activity multipliers explanation
  const activityTableData = [
    { activity: "Neutered Adult", multiplier: 1.6, description: "Typical adult dog after neutering/spaying" },
    { activity: "Intact Adult", multiplier: 1.8, description: "Adult dog not neutered or spayed" },
    { activity: "Active, Working Dog", multiplier: 2.0, description: "Dogs with high daily activity" },
    { activity: "Highly Active, Working Dog", multiplier: 5.0, description: "Extremely active or working dogs" },
    { activity: "Weight Loss", multiplier: 1.0, description: "Reduced calorie intake for weight loss" },
    { activity: "Weight Gain", multiplier: 1.8, description: "Increased calorie intake for weight gain" },
    { activity: "Puppy (0-4 months)", multiplier: 3.0, description: "Rapid growth phase puppies" },
    { activity: "Pregnant", multiplier: 3.0, description: "Pregnant dogs in last trimester" },
    { activity: "Lactating", multiplier: 4.0, description: "Nursing mothers" },
  ];

  // Editorial content for each section
  const editorialSections = [
    {
      id: "how-to-use",
      title: "How to Use the Dog Calorie Needs (RER/MER) Calculator",
      content: (
        <>
          <p>
            This calculator helps you determine your dog's daily calorie requirements based on their Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER). The RER represents the energy needed for basic physiological functions at rest, while MER accounts for activity level, life stage, and physiological status.
          </p>
          <p>
            To use the calculator, enter your dog's weight in kilograms or pounds. Select the activity level that best describes your dog's lifestyle, such as neutered adult, intact adult, active, working, or special conditions like pregnancy or lactation. The calculator will automatically compute the RER and MER values.
          </p>
          <p>
            Understanding your dog's calorie needs is essential for maintaining a healthy weight, supporting growth, and ensuring optimal health. Use this tool to guide feeding amounts and dietary choices.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "The Formula Behind the Calculator",
      content: (
        <>
          <p>
            The core formula used to calculate your dog's calorie needs is based on scientific research and veterinary nutrition guidelines.
          </p>
          <h3>Resting Energy Requirement (RER)</h3>
          <p>
            RER is calculated using the formula:
          </p>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "0.5rem" }}>
            RER = 70 × (Body Weight in kg)<sup>0.75</sup>
          </p>
          <p>
            This formula estimates the energy your dog needs at rest to maintain vital body functions such as breathing, circulation, and cellular metabolism.
          </p>
          <h3>Maintenance Energy Requirement (MER)</h3>
          <p>
            MER adjusts the RER based on your dog's activity level, life stage, and physiological status:
          </p>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "0.5rem" }}>
            MER = RER × Activity Multiplier
          </p>
          <p>
            The activity multiplier varies depending on whether your dog is neutered, intact, active, working, pregnant, lactating, or a puppy. This multiplier accounts for the additional energy expenditure beyond resting needs.
          </p>
          <p>
            The multipliers used in this calculator are derived from veterinary nutrition guidelines and peer-reviewed studies.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Example Calculation",
      content: (
        <>
          <p>
            Let's consider an example to illustrate how the calculator works.
          </p>
          <p>
            Suppose you have a 10 kg neutered adult dog with a moderate activity level.
          </p>
          <ol>
            <li>Calculate RER:
              <br />
              RER = 70 × (10)<sup>0.75</sup> ≈ 394 kcal/day
            </li>
            <li>Determine activity multiplier for neutered adult: 1.6</li>
            <li>Calculate MER:
              <br />
              MER = 394 × 1.6 = 630.4 kcal/day
            </li>
          </ol>
          <p>
            This means your dog requires approximately 630 calories per day to maintain their current weight and activity level.
          </p>
          <p>
            Adjustments can be made for puppies, pregnant or lactating dogs, or those needing weight management.
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common Mistakes When Calculating Dog Calorie Needs",
      content: (
        <>
          <p>
            Calculating your dog's calorie needs accurately is crucial, but several common mistakes can lead to underfeeding or overfeeding.
          </p>
          <ul>
            <li><strong>Using inaccurate weight:</strong> Always weigh your dog on a reliable scale. Guessing or using outdated weights can skew results.</li>
            <li><strong>Ignoring life stage:</strong> Puppies, pregnant, and lactating dogs have higher energy needs that must be accounted for.</li>
            <li><strong>Overestimating activity level:</strong> Be realistic about your dog's daily activity to avoid overfeeding.</li>
            <li><strong>Not adjusting for weight goals:</strong> Dogs needing to lose or gain weight require calorie adjustments.</li>
            <li><strong>Feeding treats and extras:</strong> Calories from treats should be included in total daily intake.</li>
            <li><strong>Not consulting a vet:</strong> Always consult your veterinarian for personalized advice, especially for dogs with health issues.</li>
          </ul>
          <p>
            Avoiding these mistakes ensures your dog maintains a healthy weight and optimal health.
          </p>
        </>
      ),
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      content: (
        <>
          <h4>1. What is the difference between RER and MER?</h4>
          <p>
            RER is the energy your dog needs at rest, while MER includes additional energy for activity, growth, reproduction, and other factors.
          </p>
          <h4>2. Can I use this calculator for puppies?</h4>
          <p>
            Yes, select the puppy option or input age under 12 months for adjusted multipliers.
          </p>
          <h4>3. How often should I recalculate my dog's calorie needs?</h4>
          <p>
            Recalculate whenever your dog's weight, activity level, or life stage changes.
          </p>
          <h4>4. Does this calculator account for breed differences?</h4>
          <p>
            This calculator uses general multipliers; breed-specific needs may vary and should be discussed with your vet.
          </p>
          <h4>5. How do I adjust calories for weight loss?</h4>
          <p>
            Use the weight loss activity multiplier to estimate reduced calorie needs.
          </p>
          <h4>6. What if my dog is overweight or underweight?</h4>
          <p>
            Consult your veterinarian for a tailored feeding plan and use this calculator to guide daily calorie intake.
          </p>
          <h4>7. Are treats included in the calorie calculation?</h4>
          <p>
            Treat calories should be included in the total daily calorie intake to avoid overfeeding.
          </p>
          <h4>8. Can I use this calculator for cats?</h4>
          <p>
            No, this calculator is specifically designed for dogs. Use a cat-specific calculator for feline calorie needs.
          </p>
          <h4>9. What units can I use for weight?</h4>
          <p>
            You can input weight in kilograms or pounds; the calculator syncs both automatically.
          </p>
          <h4>10. Does neutering affect calorie needs?</h4>
          <p>
            Yes, neutered dogs typically have lower calorie requirements compared to intact dogs.
          </p>
          <h4>11. How accurate is this calculator?</h4>
          <p>
            It provides a scientifically based estimate, but individual needs may vary. Always monitor your dog's body condition and consult a vet.
          </p>
          <h4>12. Can I use this calculator for senior dogs?</h4>
          <p>
            Yes, but consider that older dogs may have different activity levels and health considerations.
          </p>
        </>
      ),
    },
    {
      id: "references",
      title: "References",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press, 2006.
            </li>
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              Freeman, L.M., et al. "Energy requirements of adult dogs." Journal of Nutrition, 2006.
            </li>
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              Case, L.P., et al. Canine and Feline Nutrition: A Resource for Companion Animal Professionals. 3rd Edition, 2011.
            </li>
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              Association of American Feed Control Officials (AAFCO) Dog Food Nutrient Profiles, 2019.
            </li>
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              Hand, M.S., et al. Small Animal Clinical Nutrition. 5th Edition, 2010.
            </li>
            <li>
              <BookOpen className="inline-block mr-2 align-middle" />
              German, A.J. "The Growing Problem of Obesity in Dogs and Cats." Journal of Nutrition, 2006.
            </li>
          </ul>
        </>
      ),
    },
  ];

  // OnThisPage component data for navigation
  const onThisPage = [
    { id: "how-to-use", title: "How to Use" },
    { id: "formula", title: "Formula" },
    { id: "example", title: "Example" },
    { id: "mistakes", title: "Common Mistakes" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "References" },
  ];

  // Related calculators with varied emojis
  const relatedCalculators = [
    { title: "Cat Calorie Needs Calculator", slug: "cat-calorie-needs", emoji: "🐱" },
    { title: "Dog Weight Loss Calculator", slug: "dog-weight-loss", emoji: "⚖️" },
    { title: "Pet Hydration Calculator", slug: "pet-hydration", emoji: "💧" },
    { title: "Dog Food Portion Calculator", slug: "dog-food-portion", emoji: "🍖" },
    { title: "Pet Age to Human Years Calculator", slug: "pet-age-human-years", emoji: "📅" },
    { title: "Dog Exercise Needs Calculator", slug: "dog-exercise-needs", emoji: "🏃‍♂️" },
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
            <strong>RER = 70 × (Body Weight in kg)<sup>0.75</sup></strong>
          </p>
          <p>
            <strong>MER = RER × Activity Multiplier</strong>
          </p>
        </>
      }
      example={
        <>
          <p>
            For a 10 kg neutered adult dog:
          </p>
          <p>
            RER = 70 × 10<sup>0.75</sup> ≈ 394 kcal/day
          </p>
          <p>
            MER = 394 × 1.6 = 630.4 kcal/day
          </p>
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dog className="text-emerald-600" size={24} />
            Enter Your Dog's Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Weight
                <Info size={16} className="text-sky-500" title="Enter your dog's weight" />
              </Label>
              {weightUnit === "kg" ? (
                <Input
                  id="weight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weightKg}
                  onChange={(e) => onWeightKgChange(Number(e.target.value))}
                  aria-describedby="weight-unit"
                />
              ) : (
                <Input
                  id="weight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weightLbs}
                  onChange={(e) => onWeightLbsChange(Number(e.target.value))}
                  aria-describedby="weight-unit"
                />
              )}
              <div className="mt-2 flex gap-4">
                <Button
                  variant={weightUnit === "kg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWeightUnit("kg")}
                  aria-pressed={weightUnit === "kg"}
                >
                  kg
                </Button>
                <Button
                  variant={weightUnit === "lbs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWeightUnit("lbs")}
                  aria-pressed={weightUnit === "lbs"}
                >
                  lbs
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="ageMonths" className="mb-1 flex items-center gap-1">
                Age (months)
                <Info size={16} className="text-sky-500" title="Enter your dog's age in months" />
              </Label>
              <Input
                id="ageMonths"
                type="number"
                min={0}
                max={240}
                step={1}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                Activity Level
                <Activity size={16} className="text-sky-500" title="Select your dog's activity level" />
              </Label>
              <select
                id="activityLevel"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="maintenance">Maintenance (Neutered Adult)</option>
                <option value="intact">Intact Adult</option>
                <option value="active">Active Dog</option>
                <option value="working">Working Dog</option>
                <option value="weightLoss">Weight Loss</option>
                <option value="weightGain">Weight Gain</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                id="pregnant"
                type="checkbox"
                checked={isPregnant}
                onChange={() => {
                  setIsPregnant(!isPregnant);
                  if (!isPregnant) {
                    setIsLactating(false);
                    setActivityLevel("pregnant");
                  } else {
                    setActivityLevel("maintenance");
                  }
                }}
                disabled={isLactating}
              />
              <Label htmlFor="pregnant">Pregnant</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="lactating"
                type="checkbox"
                checked={isLactating}
                onChange={() => {
                  setIsLactating(!isLactating);
                  if (!isLactating) {
                    setIsPregnant(false);
                    setActivityLevel("lactating");
                  } else {
                    setActivityLevel("maintenance");
                  }
                }}
                disabled={isPregnant}
              />
              <Label htmlFor="lactating">Lactating</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        ref={resultsRef}
        className="mb-6 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10"
        aria-live="polite"
        aria-atomic="true"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="text-emerald-600" size={24} />
            Your Dog's Calorie Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg font-semibold">
            <div>
              <Scale className="inline-block mr-2 text-sky-600" size={20} />
              <span>Resting Energy Requirement (RER):</span>
              <span className="float-right">{RER} kcal/day</span>
            </div>
            <div>
              <HeartPulse className="inline-block mr-2 text-blue-600" size={20} />
              <span>Maintenance Energy Requirement (MER):</span>
              <span className="float-right">{MER} kcal/day</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-700">
            These values represent the estimated calories your dog needs daily to maintain health and activity based on current weight and life stage.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="inline-block" />
            Activity Multipliers Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Level</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityTableData.map(({ activity, multiplier, description }) => (
                <TableRow key={activity}>
                  <TableCell>{activity}</TableCell>
                  <TableCell>{multiplier}</TableCell>
                  <TableCell>{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section id="how-to-use" className="prose max-w-none mb-10">
        <h2>How to Use the Dog Calorie Needs (RER/MER) Calculator</h2>
        {editorialSections.find((s) => s.id === "how-to-use")?.content}
      </section>

      <section id="formula" className="prose max-w-none mb-10">
        <h2>The Formula Behind the Calculator</h2>
        {editorialSections.find((s) => s.id === "formula")?.content}
      </section>

      <section id="example" className="prose max-w-none mb-10">
        <h2>Example Calculation</h2>
        {editorialSections.find((s) => s.id === "example")?.content}
      </section>

      <section id="mistakes" className="prose max-w-none mb-10">
        <h2>Common Mistakes When Calculating Dog Calorie Needs</h2>
        {editorialSections.find((s) => s.id === "mistakes")?.content}
      </section>

      <section id="faq" className="prose max-w-none mb-10">
        <h2>Frequently Asked Questions</h2>
        {editorialSections.find((s) => s.id === "faq")?.content}
      </section>

      <section id="references" className="prose max-w-none mb-10">
        <h2>References</h2>
        {editorialSections.find((s) => s.id === "references")?.content}
      </section>
    </CalculatorVerticalLayout>
  );
};

export default DogCalorieNeedsRerMerCalculator;