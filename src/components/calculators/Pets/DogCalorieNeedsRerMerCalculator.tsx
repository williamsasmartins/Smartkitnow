import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Dog, Bone, Activity } from "lucide-react";

type LifeStage =
  | "puppy"
  | "adult"
  | "senior"
  | "neutered-adult"
  | "intact-adult"
  | "weight-loss"
  | "weight-gain"
  | "working-low"
  | "working-high";

interface CalorieResult {
  rer: number;
  mer: number;
  factor: number;
  label: string;
}

const formatNumber = (value: number) =>
  value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({
    weight: "10", // kg
    lifeStage: "adult" as LifeStage,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const results: CalorieResult = useMemo(() => {
    const weightKg = parseFloat(inputs.weight.replace(",", ".")) || 0;

    if (weightKg <= 0) {
      return {
        rer: 0,
        mer: 0,
        factor: 0,
        label: "",
      };
    }

    // RER = 70 × (weight_kg^0.75)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // MER factor by life stage / activity
    let factor = 1.6;
    let label = "Typical adult dog";

    switch (inputs.lifeStage) {
      case "puppy":
        factor = 3.0;
        label = "Growing puppy (under 12 months)";
        break;
      case "neutered-adult":
        factor = 1.6;
        label = "Neutered adult dog";
        break;
      case "intact-adult":
        factor = 1.8;
        label = "Intact adult dog";
        break;
      case "senior":
        factor = 1.4;
        label = "Senior dog (reduced activity)";
        break;
      case "weight-loss":
        factor = 1.0;
        label = "Weight loss program (under veterinary guidance)";
        break;
      case "weight-gain":
        factor = 1.2;
        label = "Weight gain / recovery";
        break;
      case "working-low":
        factor = 2.0;
        label = "Working / active dog (moderate activity)";
        break;
      case "working-high":
        factor = 3.0;
        label = "Working / performance dog (high activity)";
        break;
      default:
        factor = 1.6;
        label = "Typical adult dog";
    }

    const mer = rer * factor;

    return {
      rer,
      mer,
      factor,
      label,
    };
  }, [inputs.weight, inputs.lifeStage]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  const handleReset = () => {
    setInputs({
      weight: "",
      lifeStage: "adult",
    });
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Estimate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to understand how many calories they need per day."
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "RER & MER Formula" },
        { id: "factors", label: "Factors That Change Calorie Needs" },
        { id: "examples", label: "Worked Example" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}
      formula={{
        formula: "RER = 70 × (Weight_kg^0.75)\nMER = RER × Factor",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Weight_kg", description: "Dog's body weight in kilograms" },
          {
            symbol: "Factor",
            description: "Life stage / activity factor (e.g., 1.6 for neutered adult)",
          },
        ],
        title: "RER & MER Equations for Dogs",
      }}
      example={{
        title: "Example: 20 kg neutered adult dog",
        scenario:
          "You have a 20 kg neutered adult dog with normal activity. You want to estimate how many calories they should eat per day.",
        steps: [
          {
            step: 1,
            description: "Calculate the RER using body weight",
            calculation: "RER = 70 × (20^0.75) ≈ 70 × 8.9 ≈ 623 kcal/day",
          },
          {
            step: 2,
            description: "Choose the MER factor for life stage",
            calculation: "Neutered adult dog → Factor = 1.6",
          },
          {
            step: 3,
            description: "Calculate MER (daily calories)",
            calculation: "MER = 623 × 1.6 ≈ 997 kcal/day",
          },
          {
            step: 4,
            description: "Interpret the result",
            calculation:
              "This dog needs roughly 1,000 kcal per day from food and treats combined.",
          },
        ],
        result:
          "A typical 20 kg neutered adult dog needs about 1,000 kcal/day. Your vet can refine this based on body condition and health.",
      }}
      relatedCalculators={[
        {
          title: "🐕 Ideal Dog Weight Calculator",
          url: "/pets/ideal-dog-weight",
          icon: "🐕",
        },
        {
          title: "🍖 Dog Food Portion Size Calculator",
          url: "/pets/dog-food-portion-size",
          icon: "🍖",
        },
        {
          title: "📈 Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "📉",
        },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600" />
                Enter your dog's details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Dog&apos;s weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={inputs.weight}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, weight: e.target.value }))
                    }
                    className="h-12 text-lg"
                    placeholder="e.g. 10"
                  />
                </div>

                <div>
                  <Label htmlFor="lifeStage">Life stage / activity level</Label>
                  <select
                    id="lifeStage"
                    value={inputs.lifeStage}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        lifeStage: e.target.value as LifeStage,
                      }))
                    }
                    className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    <option value="puppy">Puppy (under 12 months)</option>
                    <option value="neutered-adult">Neutered adult</option>
                    <option value="intact-adult">Intact adult</option>
                    <option value="senior">Senior / low activity</option>
                    <option value="weight-loss">Weight loss program</option>
                    <option value="weight-gain">Weight gain / recovery</option>
                    <option value="working-low">Working dog (moderate)</option>
                    <option value="working-high">Working dog (high)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCalculate} className="flex-1 h-12 text-base">
                  <Activity className="mr-2 h-4 w-4" />
                  Calculate calorie needs
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 text-base"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.rer > 0 && (
            <div ref={resultsRef} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="col-span-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 border border-indigo-200 dark:border-indigo-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dog className="h-5 w-5 text-indigo-700" />
                      Daily calorie needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      Based on your dog&apos;s weight and life stage:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Resting Energy (RER)
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {formatNumber(results.rer)} kcal
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Maintenance (MER)
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {formatNumber(results.mer)} kcal
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Life stage factor
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          × {results.factor.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                      <strong>Profile:</strong> {results.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Always discuss diet changes with your veterinarian, especially for
                      puppies, seniors, or dogs with medical conditions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-8">
          <section id="how-to-use">
            <h2 className="text-3xl font-bold mb-4">
              How to use the Dog Calorie Needs (RER/MER) Calculator
            </h2>
            <p>
              This calculator is designed to give you a practical starting point for how
              many calories your dog should eat per day. It uses the same equations
              veterinarians rely on to estimate energy needs in the clinic.
            </p>
            <p>
              Start by entering your dog&apos;s current body weight in kilograms. If
              you only know the weight in pounds, you can divide by 2.2 to convert to
              kilograms. Then choose the life stage or activity level that best matches
              your dog – for example, neutered adult, puppy, senior, or working dog.
            </p>
            <p>
              When you click{" "}
              <strong className="font-semibold">“Calculate calorie needs”</strong>, the
              tool will show:
            </p>
            <ul>
              <li>The Resting Energy Requirement (RER) in kcal per day.</li>
              <li>
                The Maintenance Energy Requirement (MER), which is your dog&apos;s
                estimated daily calorie target.
              </li>
              <li>The factor used for your dog&apos;s life stage or activity level.</li>
            </ul>
            <p>
              Use this number as a guide when choosing food portions and treats. It is
              not a replacement for a full nutrition plan created by a veterinarian, but
              it helps you understand whether your dog is likely eating too much, too
              little, or roughly the right amount.
            </p>
          </section>

          <section id="factors">
            <h2 className="text-3xl font-bold mb-4">
              What changes your dog&apos;s daily calorie needs?
            </h2>
            <p>
              Two dogs with the same body weight can have very different energy needs.
              Age, neuter status, breed, metabolism, health conditions, and activity
              level all play a role in how much fuel their body burns each day.
            </p>
            <p>Some important examples:</p>
            <ul>
              <li>
                <strong>Puppies</strong> burn a lot of energy for growth and usually
                need 2–3× the RER.
              </li>
              <li>
                <strong>Neutered adult dogs</strong> typically need around 1.6× the RER.
              </li>
              <li>
                <strong>Intact adults</strong> often sit closer to 1.8× RER.
              </li>
              <li>
                <strong>Senior dogs</strong> may move less and can need fewer calories.
              </li>
              <li>
                <strong>Working and sporting dogs</strong> can need 2–5× RER depending
                on workload.
              </li>
            </ul>
            <p>
              Body condition score (BCS) is also crucial. If your dog is already
              overweight, your vet may recommend using a lower factor and targeting a
              “goal weight” instead of the current weight. If your dog is underweight or
              recovering from illness, the target may be higher.
            </p>
          </section>

          <section id="examples">
            <h2 className="text-3xl font-bold mb-4">
              Example: adjusting food portions using MER
            </h2>
            <p>
              Imagine your 20 kg neutered adult dog currently eats around 1,400 kcal per
              day between food and treats. Using the calculator, you see that a more
              typical maintenance energy requirement for this profile is closer to
              1,000–1,050 kcal/day.
            </p>
            <p>
              You could start by gradually reducing the total daily calories by 10–15%,
              monitor weight over a few weeks, and then adjust again in small steps.
              Sudden, aggressive reductions are not recommended unless your veterinarian
              is supervising a medical weight-loss plan.
            </p>
            <p>
              Always combine calorie control with appropriate exercise, enrichment, and
              regular weigh-ins. Tiny changes over months are much safer than trying to
              “fix” weight quickly in a few days.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-4">
              Frequently asked questions about dog calorie needs
            </h2>

            <h3 className="text-xl font-semibold mt-4 mb-2">
              Is this calculator a substitute for a vet visit?
            </h3>
            <p>
              No. This tool is an educational guide that uses standard veterinary
              formulas, but it cannot assess your dog&apos;s medical history, body
              condition, laboratory tests, or special dietary needs. Always work with
              your veterinarian before starting a weight-loss or weight-gain plan.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">
              Should I use the current weight or ideal weight?
            </h3>
            <p>
              For most healthy dogs, you can start with the current weight to estimate
              daily calories. For overweight dogs, many vets prefer using an{" "}
              <em>ideal body weight</em> instead. Your veterinarian can help you choose a
              safe target weight and BCS score.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">
              What if my dog has a medical condition?
            </h3>
            <p>
              Dogs with diabetes, kidney disease, heart disease, pancreatitis, or other
              medical issues often need very specific nutrition plans. In those cases,
              this calculator is only a rough reference. Follow the exact diet and
              calorie plan recommended by your vet.
            </p>
          </section>
        </div>
      }
    />
  );
}
