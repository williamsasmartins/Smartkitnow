import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Dog, Activity, Info, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogTreatCaloriesDailyAllowanceCalculator() {
  // Inputs
  const [dogWeight, setDogWeight] = useState<string>("10");
  const [treatCalories, setTreatCalories] = useState<string>("50");
  const [dailyCalories, setDailyCalories] = useState<string>("400");

  // Validation flags
  const dogWeightNum = parseFloat(dogWeight);
  const treatCaloriesNum = parseFloat(treatCalories);
  const dailyCaloriesNum = parseFloat(dailyCalories);

  const dogWeightValid = !isNaN(dogWeightNum) && dogWeightNum > 0;
  const treatCaloriesValid = !isNaN(treatCaloriesNum) && treatCaloriesNum > 0;
  const dailyCaloriesValid = !isNaN(dailyCaloriesNum) && dailyCaloriesNum > 0;

  // Calculate maximum safe daily treat allowance (number of treats)
  // To prevent weight gain, treats should not exceed 10% of daily calories (common vet guideline)
  // maxTreatCalories = dailyCalories * 0.10
  // maxTreats = maxTreatCalories / treatCalories

  const maxTreatCalories = useMemo(() => {
    if (!dailyCaloriesValid) return 0;
    return dailyCaloriesNum * 0.1;
  }, [dailyCaloriesNum, dailyCaloriesValid]);

  const maxTreats = useMemo(() => {
    if (!treatCaloriesValid || maxTreatCalories === 0) return 0;
    return maxTreatCalories / treatCaloriesNum;
  }, [maxTreatCalories, treatCaloriesNum, treatCaloriesValid]);

  // Helper text for inputs
  const dogWeightHelper = "Enter your dog's weight in kilograms (kg).";
  const treatCaloriesHelper = "Enter calories per treat (kcal).";
  const dailyCaloriesHelper =
    "Enter your dog's estimated daily calorie needs (kcal). Consult your vet for accurate values.";

  // Reset inputs handler
  const handleReset = () => {
    setDogWeight("10");
    setTreatCalories("50");
    setDailyCalories("400");
  };

  // SEO structured data FAQPage
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why should I limit my dog's treat calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Limiting treat calories helps prevent weight gain and obesity, which can lead to health problems in dogs.",
        },
      },
      {
        "@type": "Question",
        name: "How do I estimate my dog's daily calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Daily calorie needs depend on your dog's weight, age, activity level, and health status. Consult your veterinarian for personalized advice.",
        },
      },
      {
        "@type": "Question",
        name: "Can I feed my dog treats every day?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, but treats should generally not exceed 10% of your dog's daily calorie intake to maintain a healthy weight.",
        },
      },
      {
        "@type": "Question",
        name: "What if my dog is overweight?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "If your dog is overweight, reduce treat calories and consult your veterinarian for a weight management plan.",
        },
      },
    ],
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain."
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      seo={{
        pageTitle: "Dog Treat Calories & Daily Allowance Calculator | SmartKitNow",
        metaDescription:
          "Use this calculator to determine the calorie content of your dog's treats and find the maximum safe daily treat allowance to help maintain a healthy weight.",
        keywords: [
          "dog treat calories",
          "dog daily treat allowance",
          "dog nutrition calculator",
          "dog calorie needs",
          "prevent dog weight gain",
          "dog treats calorie calculator",
        ],
        structuredData: faqStructuredData,
      }}
      widget={
        <Card>
          <CardHeader>
            <CardTitle>
              <Calculator className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Treat Calories & Allowance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-6"
              noValidate
            >
              <div>
                <Label htmlFor="dogWeight" className="mb-1">
                  Dog Weight (kg)
                </Label>
                <Input
                  id="dogWeight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={dogWeight}
                  onChange={(e) => setDogWeight(e.target.value)}
                  aria-describedby="dogWeightHelp"
                  placeholder="e.g. 10"
                  required
                />
                <p
                  id="dogWeightHelp"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {dogWeightHelper}
                </p>
                {!dogWeightValid && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid weight greater than zero.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="treatCalories" className="mb-1">
                  Calories per Treat (kcal)
                </Label>
                <Input
                  id="treatCalories"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={treatCalories}
                  onChange={(e) => setTreatCalories(e.target.value)}
                  aria-describedby="treatCaloriesHelp"
                  placeholder="e.g. 50"
                  required
                />
                <p
                  id="treatCaloriesHelp"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {treatCaloriesHelper}
                </p>
                {!treatCaloriesValid && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid calorie amount greater than zero.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dailyCalories" className="mb-1">
                  Estimated Daily Calorie Needs (kcal)
                </Label>
                <Input
                  id="dailyCalories"
                  type="number"
                  min={1}
                  step={1}
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(e.target.value)}
                  aria-describedby="dailyCaloriesHelp"
                  placeholder="e.g. 400"
                  required
                />
                <p
                  id="dailyCaloriesHelp"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {dailyCaloriesHelper}
                </p>
                {!dailyCaloriesValid && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid daily calorie need greater than zero.
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  aria-label="Reset inputs"
                >
                  Reset
                </Button>
              </div>
            </form>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Dog className="h-5 w-5 text-green-600 dark:text-green-400" />
                Results
              </h3>
              {!dogWeightValid ||
              !treatCaloriesValid ||
              !dailyCaloriesValid ? (
                <p className="text-gray-700 dark:text-gray-300">
                  Please enter valid inputs above to see results.
                </p>
              ) : (
                <>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Based on your inputs, the maximum safe daily treat calories
                    should not exceed{" "}
                    <strong>{maxTreatCalories.toFixed(1)} kcal</strong>, which is
                    10% of your dog's estimated daily calorie needs.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    This corresponds to approximately{" "}
                    <strong>{maxTreats.toFixed(1)}</strong>{" "}
                    {maxTreats.toFixed(1) === "1.0" ? "treat" : "treats"} per
                    day.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      }
      formula={{
        heading: "Key formulas",
        items: [
          {
            label: "Maximum Treat Calories",
            formula: "Max Treat Calories = Daily Calorie Needs × 10%",
            description:
              "Treat calories should not exceed 10% of your dog's total daily calorie intake to help prevent weight gain.",
          },
          {
            label: "Maximum Number of Treats",
            formula: "Max Treats = Max Treat Calories ÷ Calories per Treat",
            description:
              "Dividing the maximum treat calories by the calories per treat gives the maximum number of treats your dog can safely have each day.",
          },
        ],
      }}
      examples={{
        heading: "Worked examples",
        items: [
          {
            title: "Example 1: Small Dog",
            description:
              "A 10 kg dog with daily calorie needs of 400 kcal and treats containing 50 kcal each.",
            steps: [
              "Calculate 10% of daily calories: 400 × 0.10 = 40 kcal maximum from treats.",
              "Divide max treat calories by calories per treat: 40 ÷ 50 = 0.8 treats.",
              "Result: The dog should have no more than 0.8 treats per day to avoid weight gain.",
            ],
            resultSummary:
              "Limit treats to less than one per day, or adjust treat size accordingly.",
          },
          {
            title: "Example 2: Medium Dog",
            description:
              "A 20 kg dog with daily calorie needs of 700 kcal and treats containing 70 kcal each.",
            steps: [
              "Calculate 10% of daily calories: 700 × 0.10 = 70 kcal maximum from treats.",
              "Divide max treat calories by calories per treat: 70 ÷ 70 = 1 treat.",
              "Result: The dog can safely have up to 1 treat per day without risking weight gain.",
            ],
            resultSummary:
              "Keep treat intake at or below one treat daily for healthy weight maintenance.",
          },
        ],
      }}
      faqItems={[
        {
          question: "Why should I limit my dog's treat calories?",
          answer:
            "Limiting treat calories helps prevent weight gain and obesity, which can lead to health problems in dogs. Treats should be given in moderation as part of a balanced diet.",
        },
        {
          question: "How do I estimate my dog's daily calorie needs?",
          answer:
            "Daily calorie needs depend on your dog's weight, age, activity level, and health status. Consult your veterinarian for personalized advice or use a dog calorie needs calculator.",
        },
        {
          question: "Can I feed my dog treats every day?",
          answer:
            "Yes, but treats should generally not exceed 10% of your dog's daily calorie intake to maintain a healthy weight.",
        },
        {
          question: "What if my dog is overweight?",
          answer:
            "If your dog is overweight, reduce treat calories and consult your veterinarian for a weight management plan tailored to your dog's needs.",
        },
        {
          question: "Are all treats equal in calories?",
          answer:
            "No, treat calorie content varies widely depending on type and size. Always check the packaging or consult your vet to estimate calories accurately.",
        },
        {
          question: "Can I use this calculator for puppies or senior dogs?",
          answer:
            "This calculator provides general guidance. Puppies and senior dogs have different nutritional needs, so consult your veterinarian for specific recommendations.",
        },
      ]}
      references={[
        {
          title: "American Kennel Club: How Many Calories Does Your Dog Need?",
          href: "https://www.akc.org/expert-advice/nutrition/how-many-calories-does-your-dog-need/",
          description:
            "Detailed guidance on calculating your dog's daily calorie needs based on weight and activity level.",
          icon: BookOpen,
        },
        {
          title: "PetMD: Treats and Your Dog’s Diet",
          href: "https://www.petmd.com/dog/nutrition/evr_dg_treats_and_your_dogs_diet",
          description:
            "Explains the role of treats in a dog's diet and how to avoid overfeeding.",
          icon: Info,
        },
        {
          title: "WSAVA Global Nutrition Guidelines",
          href: "https://wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2020.pdf",
          description:
            "World Small Animal Veterinary Association's comprehensive nutrition guidelines for dogs and cats.",
          icon: BookOpen,
        },
      ]}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          href: "/pets/dog-calorie-needs-rer-mer",
          icon: Activity,
          category: "Pets – Dogs",
          description:
            "Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) for daily calorie needs.",
        },
        {
          title: "Dog Weight Loss Planner",
          href: "/pets/dog-weight-loss-planner",
          icon: Scale,
          category: "Pets – Dogs",
          description:
            "Plan a safe and effective weight loss program for your overweight dog with calorie targets and timelines.",
        },
        {
          title: "Dog Ideal Weight Target Calories Calculator",
          href: "/pets/dog-ideal-weight-target-calories",
          icon: HeartPulse,
          category: "Pets – Dogs",
          description:
            "Estimate the ideal daily calorie intake for your dog based on target weight and activity level.",
        },
      ]}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={true}
    >
      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          How this calculator works
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This calculator helps you determine the calorie content of your dog's
          treats and the maximum number of treats your dog can safely consume
          each day without risking weight gain. Maintaining a healthy weight is
          crucial for your dog's overall well-being and longevity.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          The key principle used here is that treats should not exceed 10% of
          your dog's total daily calorie intake. This guideline is widely
          recommended by veterinarians to prevent excess calorie consumption
          from treats.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          To use the calculator, enter your dog's weight, the calories per treat,
          and your dog's estimated daily calorie needs. The calculator then
          computes the maximum safe daily treat calories and the corresponding
          number of treats.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If you are unsure about your dog's daily calorie needs, consult your
          veterinarian or use a dog calorie needs calculator for a more
          accurate estimate.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Disclaimer
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This calculator is intended for educational purposes only and does not
          replace professional veterinary advice. Always consult a qualified
          veterinarian for personalized recommendations regarding your dog's
          nutrition and health.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          References & Additional Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://www.akc.org/expert-advice/nutrition/how-many-calories-does-your-dog-need/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Kennel Club: How Many Calories Does Your Dog Need?
              </a>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Detailed guidance on calculating your dog's daily calorie needs
                based on weight and activity level.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petmd.com/dog/nutrition/evr_dg_treats_and_your_dogs_diet"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                PetMD: Treats and Your Dog’s Diet
              </a>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Explains the role of treats in a dog's diet and how to avoid
                overfeeding.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2020.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                World Small Animal Veterinary Association's comprehensive
                nutrition guidelines for dogs and cats.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default DogTreatCaloriesDailyAllowanceCalculator;