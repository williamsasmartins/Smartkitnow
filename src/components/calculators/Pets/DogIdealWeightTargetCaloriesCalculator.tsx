import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dog, Activity, Scale, Info, BookOpen, AlertTriangle, Calculator as CalculatorIcon } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type ActivityLevel = "maintenance" | "weight-loss-gentle" | "weight-loss-aggressive";

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  maintenance: 1.6,
  "weight-loss-gentle": 1.2,
  "weight-loss-aggressive": 1.0,
};

export default function DogIdealWeightTargetCaloriesCalculator() {
  const [currentWeightKg, setCurrentWeightKg] = useState<string>("");
  const [targetWeightKg, setTargetWeightKg] = useState<string>("");
  const [weeksToGoal, setWeeksToGoal] = useState<string>("12");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("weight-loss-gentle");
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const parsed = useMemo(() => {
    const current = parseFloat(currentWeightKg.replace(",", "."));
    const target = parseFloat(targetWeightKg.replace(",", "."));
    const weeks = parseFloat(weeksToGoal.replace(",", "."));

    return {
      current: Number.isFinite(current) ? current : NaN,
      target: Number.isFinite(target) ? target : NaN,
      weeks: Number.isFinite(weeks) ? weeks : NaN,
    };
  }, [currentWeightKg, targetWeightKg, weeksToGoal]);

  const results = useMemo(() => {
    const { current, target, weeks } = parsed;

    if (!Number.isFinite(current) || !Number.isFinite(target) || current <= 0 || target <= 0) {
      return {
        valid: false,
        error: "Enter your dog's current and target weight in kilograms.",
      };
    }

    if (target >= current) {
      return {
        valid: false,
        error: "Target weight should be lower than current weight for a weight-loss plan.",
      };
    }

    if (!Number.isFinite(weeks) || weeks <= 0) {
      return {
        valid: false,
        error: "Enter how many weeks you want to use as a planning horizon.",
      };
    }

    // RER based on target weight (kg^0.75)
    const rer = 70 * Math.pow(target, 0.75);
    const factor = ACTIVITY_FACTORS[activityLevel];
    const dailyCalories = rer * factor;

    const totalLossKg = current - target;
    const weeklyLossKg = totalLossKg / weeks;
    const weeklyLossPercent = (weeklyLossKg / current) * 100;

    const isSafe =
      weeklyLossPercent > 0 &&
      weeklyLossPercent >= 0.5 &&
      weeklyLossPercent <= 2.0;

    const safetyNote =
      weeklyLossPercent <= 0
        ? "The target weight and weeks entered do not produce a meaningful weight-loss plan."
        : isSafe
        ? "The weekly weight-loss rate is within the commonly recommended 0.5–2% of body weight per week. Always confirm the plan with your veterinarian."
        : "The weekly weight-loss rate falls outside the commonly recommended 0.5–2% of body weight per week. Ask your veterinarian to adjust the plan.";

    return {
      valid: true,
      error: null as string | null,
      rer,
      dailyCalories,
      totalLossKg,
      weeklyLossKg,
      weeklyLossPercent,
      isSafe,
      safetyNote,
    };
  }, [parsed, activityLevel]);

  const formatNumber = (value: number, decimals = 0) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const formatCalories = (value: number) =>
    `${formatNumber(value, 0)} kcal/day`;

  const handleScrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ---------------------------------------------------------------------------
  // Editorial content
  // ---------------------------------------------------------------------------

  const formula = {
    heading: "Key formulas used",
    items: [
      {
        label: "Resting Energy Requirement (RER)",
        formula: "RER = 70 × (target weight in kg ^ 0.75)",
        description:
          "RER estimates how many calories a dog would burn at rest, based on metabolic body weight. Using the target weight keeps the plan focused on where you want your dog to be.",
      },
      {
        label: "Daily calorie target (MER for weight management)",
        formula: "Daily calories = RER × activity / weight-management factor",
        description:
          "For weight-loss plans, factors between 1.0 and 1.2 are often used. Higher factors are used for maintenance. Your veterinarian may adjust these factors based on your dog's age, body condition and health.",
      },
      {
        label: "Weekly weight-loss rate",
        formula:
          "Weekly loss (%) = ((current weight − target weight) ÷ weeks ÷ current weight) × 100",
        description:
          "Many veterinarians aim for 0.5–2% of body weight loss per week. Faster loss can be risky without close supervision.",
      },
    ],
  };

  const examples = {
    heading: "Example: Planning safe target calories",
    items: [
      {
        title: "Example 1 – Medium-size dog losing weight gradually",
        description:
          "A 25 kg dog should ideally weigh 20 kg. The guardian wants to plan over 20 weeks using a gentle weight-loss factor.",
        steps: [
          "Enter current weight = 25 kg.",
          "Enter target weight = 20 kg.",
          "Enter weeks to goal = 20.",
          "Choose activity level = Gentle weight loss (factor ≈ 1.2).",
          "The calculator estimates the RER using the target weight and multiplies it by 1.2 to get the daily calorie target.",
        ],
        resultSummary:
          "The plan produces a weekly loss of around 1% of body weight, which is considered a gradual and typically safer rate when supervised by a veterinarian.",
      },
      {
        title: "Example 2 – Plan that is too aggressive",
        description:
          "A 30 kg dog is set to reach 22 kg in just 8 weeks on an aggressive plan.",
        steps: [
          "Enter current weight = 30 kg.",
          "Enter target weight = 22 kg.",
          "Enter weeks to goal = 8.",
          "Choose activity level = Aggressive weight loss.",
          "The calculator checks the weekly weight-loss percentage.",
        ],
        resultSummary:
          "The estimated weekly loss is above 2% of body weight, so the calculator flags the plan as outside the usual safety range and suggests talking with your veterinarian.",
      },
    ],
  };

  const faqs = [
    {
      question: "Is this calorie target a substitute for veterinary advice?",
      answer:
        "No. This calculator is an educational tool only. It uses common veterinary formulas to estimate calorie needs, but it cannot account for your dog's full medical history. Always ask your veterinarian to confirm any weight-loss or weight-maintenance plan.",
    },
    {
      question: "Which weight should I use for the calculation?",
      answer:
        "For weight-loss planning, this tool uses your dog's target weight in the formulas. If you are maintaining a healthy dog, you can enter the current weight as the target.",
    },
    {
      question: "What is a safe rate of weight loss for dogs?",
      answer:
        "Many veterinarians aim for about 0.5–2% of body weight loss per week. The calculator checks whether your plan falls roughly in this range, but your vet may prefer a slower rate in some cases.",
    },
    {
      question: "Can I change the plan if my dog seems hungry?",
      answer:
        "If your dog seems constantly hungry, tired, or unwell, stop the weight-loss plan and contact your veterinarian. They can adjust calorie targets, food choice, or the timeline to keep things safe and comfortable.",
    },
    {
      question: "Does activity level outside walks matter?",
      answer:
        "Yes. Play, training sessions, and general lifestyle all affect energy needs. This calculator uses broad factors, so very active or very sedentary dogs may need adjustments by a professional.",
    },
    {
      question: "Can I use this calculator for puppies?",
      answer:
        "No. Growing puppies have very different nutritional needs, and weight-management formulas for adults do not apply. Always consult your veterinarian for puppy feeding plans.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const references = [
    {
      title: "World Small Animal Veterinary Association (WSAVA) – Global Nutrition Toolkit",
      href: "https://wsava.org/global-guidelines/global-nutrition-guidelines/",
      description:
        "Professional resources explaining how veterinarians approach calorie estimation, body-condition scoring, and long-term weight management for companion animals.",
      icon: BookOpen,
    },
    {
      title: "American College of Veterinary Nutrition – Pet Obesity Resources",
      href: "https://acvn.org/",
      description:
        "Educational material on obesity risks, safe weight-loss strategies, and why individualised plans are important for dogs and cats.",
      icon: Info,
    },
  ];

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      href: "/pets/dog-calorie-needs-rer-mer",
      icon: Dog,
      category: "Pets – Dogs",
      description: "Estimate daily calories for adult dogs using RER and MER factors.",
    },
    {
      title: "Dog Weight-Loss Planner",
      href: "/pets/dog-weight-loss-planner",
      icon: Activity,
      category: "Pets – Dogs",
      description: "Plan a weekly weight-loss schedule and track progress over time.",
    },
    {
      title: "Dog Ideal Weight Range Checker",
      href: "/pets/dog-ideal-weight-range",
      icon: Scale,
      category: "Pets – Dogs",
      description: "Compare your dog's weight with a typical range for their size and body condition.",
    },
    {
      title: "Dog Treat Calories Calculator",
      href: "/pets/dog-treat-calories",
      icon: CalculatorIcon,
      category: "Pets – Dogs",
      description: "Estimate how much of your dog's daily calories are coming from treats.",
    },
  ];

  const widget = (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Plan daily calories toward your dog's ideal weight
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your dog's current and target weight to estimate safe daily calories and weekly weight-loss rate.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentWeightKg">Current weight (kg)</Label>
            <Input
              id="currentWeightKg"
              inputMode="decimal"
              placeholder="e.g., 25"
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetWeightKg">Target weight (kg)</Label>
            <Input
              id="targetWeightKg"
              inputMode="decimal"
              placeholder="e.g., 20"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeksToGoal">Weeks to reach target</Label>
            <Input
              id="weeksToGoal"
              inputMode="decimal"
              placeholder="e.g., 12"
              value={weeksToGoal}
              onChange={(e) => setWeeksToGoal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Plan style</Label>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <Button
                type="button"
                variant={activityLevel === "weight-loss-gentle" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setActivityLevel("weight-loss-gentle")}
              >
                <Activity className="mr-2 h-4 w-4" />
                Gentle weight loss (factor ≈ 1.2)
              </Button>
              <Button
                type="button"
                variant={activityLevel === "weight-loss-aggressive" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setActivityLevel("weight-loss-aggressive")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                More aggressive plan (factor ≈ 1.0)
              </Button>
              <Button
                type="button"
                variant={activityLevel === "maintenance" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setActivityLevel("maintenance")}
              >
                <Dog className="mr-2 h-4 w-4" />
                Maintenance (keep current healthy weight)
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>
              This tool is for educational purposes only. Always confirm calorie targets with your veterinarian.
            </span>
          </div>
          <Button type="button" onClick={handleScrollToResults}>
            View results
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const resultsBlock = (
    <div ref={resultsRef} className="space-y-4">
      {!results.valid && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="mt-1 h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">We need a bit more information</p>
              <p className="text-sm text-destructive/90">{results.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {results.valid && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalculatorIcon className="h-5 w-5 text-blue-500" />
                Daily calorie target
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                {formatCalories(results.dailyCalories)}
              </p>
              <p className="text-sm text-muted-foreground">
                This is an estimate of how many calories per day your dog might need to move toward the target weight,
                based on the selected plan style. Your veterinarian may adjust this up or down.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scale className="h-5 w-5 text-emerald-500" />
                Weight-loss pace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                Total planned loss:{" "}
                <strong>{formatNumber(results.totalLossKg, 1)} kg</strong>
              </p>
              <p className="text-sm">
                Approximate weekly loss:{" "}
                <strong>
                  {formatNumber(results.weeklyLossKg, 2)} kg (
                  {formatNumber(results.weeklyLossPercent, 2)}% of current body weight per week)
                </strong>
              </p>
              <p className="text-sm text-muted-foreground">{results.safetyNote}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const disclaimer =
    "This calculator cannot replace a full veterinary examination. Always discuss calorie targets, weight-loss plans, and any changes in your dog's diet with a licensed veterinarian.";

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight Target Calories Calculator"
      description="Estimate daily calories and check whether your dog's weight-loss plan is within a commonly recommended weekly loss range, using target weight and basic veterinary formulas."
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      seo={{
        pageTitle: "Dog Ideal Weight Target Calories Calculator | Smart Kit Now",
        metaDescription:
          "Plan safe daily calories to help your dog reach an ideal weight using veterinary RER/MER formulas. Check if your target rate of weight loss is within a typical safe range.",
        keywords: [
          "dog weight loss calories",
          "dog ideal weight calculator",
          "dog target calories",
          "dog calorie needs",
          "pet weight management",
        ],
      }}
      jsonLd={faqJsonLd ?? undefined}
      widget={widget}
      results={resultsBlock}
      formula={formula}
      examples={examples}
      faqItems={faqs}
      references={references}
      relatedCalculators={relatedCalculators}
      disclaimer={disclaimer}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={false}
    />
  );
}
