import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint, Scale, Utensils, Lightbulb, HelpCircle, BookOpen } from "lucide-react";

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({ weight: "", age: "", unit: "metric" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight) || 0;
    if (weight === 0) return null;

    // Calculate RER and MER
    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * 1.6; // Example factor for maintenance

    return { main: rer.toFixed(2), secondary: mer.toFixed(2), tableData: [] };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Age (years)</Label>
          <Input
            value={inputs.age}
            onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select
            value={inputs.unit}
            onValueChange={(unit) => setInputs({ ...inputs, unit })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleCalculate} className="w-full size-lg text-lg font-bold shadow-md">
        Calculate
      </Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-none text-white shadow-xl">
            <CardContent className="pt-8 text-center">
              <div className="text-lg text-blue-100 mb-2">Estimated RER (kcal/day)</div>
              <div className="text-5xl font-bold">{results.main}</div>
              <div className="text-lg text-blue-100 mt-4">Estimated MER (kcal/day)</div>
              <div className="text-5xl font-bold">{results.secondary}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Dog Calorie Needs (RER/MER) Calculator
        </h2>
        <p className="mb-6">
          Calculating the correct calorie intake for your dog is essential for maintaining optimal health and weight. The Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) are crucial metrics that help pet owners understand how much energy their dog needs daily. RER is the amount of energy required by a dog at rest, while MER accounts for additional energy needs due to activity and life stage.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-2">
            <Lightbulb className="h-5 w-5" /> Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Understanding your dog's calorie needs can prevent obesity and promote a long, healthy life. Regularly adjusting their diet based on activity levels and health changes is vital.
          </p>
        </div>
      </section>

      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">How It Works</h2>
        <p className="mb-6">
          The calculation of RER and MER involves the use of specific formulas that consider the dog's weight and life stage. The RER is calculated using the formula 70 * (weight in kg)^0.75. The MER is then derived from RER by applying a factor based on the dog's activity level and age.
        </p>
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl overflow-x-auto">
          RER = 70 * (Weight<sup>0.75</sup>)<br />
          MER = RER * Activity Factor
        </div>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              What is the difference between RER and MER?
            </h3>
            <p className="pl-8">
              RER is the energy requirement for a dog at rest in a thermoneutral environment, while MER includes additional energy needs for activities like walking, playing, and other daily activities.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              How often should I recalculate my dog's calorie needs?
            </h3>
            <p className="pl-8">
              It's advisable to recalculate your dog's calorie needs every few months or whenever there is a significant change in their weight, life stage, or activity level.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              Can this calculator be used for puppies?
            </h3>
            <p className="pl-8">
              Yes, but remember that puppies have different energy requirements. They typically require more calories per kg of body weight than adult dogs due to their growth needs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              How do I adjust the MER for a very active dog?
            </h3>
            <p className="pl-8">
              For very active dogs, you may need to increase the MER by using a higher activity factor. Consult with a veterinarian to determine the most appropriate factor for your dog's lifestyle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              Why is it important to use the correct unit of measurement?
            </h3>
            <p className="pl-8">
              Using the correct unit of measurement ensures accuracy in calculations. Incorrect units can lead to miscalculations and improper feeding amounts.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              What factors influence a dog's calorie needs?
            </h3>
            <p className="pl-8">
              Factors include age, weight, activity level, breed, and health status. Each of these can significantly alter a dog's energy requirements.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              What if my dog is underweight or overweight?
            </h3>
            <p className="pl-8">
              If your dog is underweight or overweight, consult with a veterinarian to adjust their diet and ensure their calorie intake is appropriate for achieving a healthy weight.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
              How can I ensure my dog's diet is balanced?
            </h3>
            <p className="pl-8">
              A balanced diet includes an appropriate mix of proteins, fats, carbohydrates, vitamins, and minerals. Consulting with a veterinarian or a pet nutritionist can help ensure your dog's diet is balanced.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="border-t pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5" />
            <a href="https://www.petmd.com/dog/nutrition/evr_dg_caloric_requirements_for_dogs" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
              PetMD: Caloric Requirements for Dogs
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5" />
            <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
              WSAVA Global Nutrition Guidelines
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** to determine daily calorie needs."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Overview" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "RER = 70 * (Weight^0.75), MER = RER * Activity Factor",
        variables: [
          { symbol: "Weight", description: "Weight of the dog in kg or lbs" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level" }
        ],
        title: "Formula"
      }}
      example={{
        title: "Example Calculation",
        steps: [
          "Determine the dog's weight: 20 kg",
          "Calculate RER: 70 * (20^0.75) = 662 kcal/day",
          "Assume an activity factor of 1.6 for a moderately active dog",
          "Calculate MER: 662 * 1.6 = 1059 kcal/day"
        ],
        result: "The dog's daily calorie need is approximately 1059 kcal."
      }}
      relatedCalculators={[
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "Calculator" },
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "Calculator" },
        { title: "Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)", url: "/pets/aquarium-volume-rectangular-cylindrical-bowfront", icon: "Calculator" },
        { title: "Ferret Protein/Fat Ratio Checker", url: "/pets/ferret-protein-fat-ratio-checker", icon: "Calculator" },
        { title: "Insulin Starter Reference (info-only)", url: "/pets/cat-insulin-starter-reference", icon: "Calculator" },
        { title: "Calcium Intake Limit (Bladder Stone Prevention)", url: "/pets/small-mammal-calcium-intake-limit", icon: "Calculator" }
      ]}
    />
  );
}