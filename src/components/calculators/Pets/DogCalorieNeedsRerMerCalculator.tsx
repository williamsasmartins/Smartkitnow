import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp } from "lucide-react";

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({ weight: "", age: "", activityLevel: "" });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const age = parseInt(inputs.age, 10);
    const activityLevel = parseFloat(inputs.activityLevel);

    if (isNaN(weight) || isNaN(age) || isNaN(activityLevel)) {
      return null;
    }

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityLevel;
    const tableData = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      calories: rer + i * 10,
    }));

    return { rer, mer, tableData };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ weight: "", age: "", activityLevel: "" });
    setShowFullTable(false);
  };

  const formatWeight = (value: number) => `${value.toFixed(2)} kg`;
  const formatCalories = (value: number) => `${value.toFixed(0)} kcal`;

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "introduction", label: "Introduction/How to Calculate" },
        { id: "factors", label: "Key Factors" },
        { id: "types", label: "Types/Methods" },
        { id: "faq", label: "FAQ" }
      ]}
      formula={{
        formula: "RER = 70 * (Weight^0.75); MER = RER * Activity Level",
        variables: [
          { symbol: "Weight", description: "Dog's weight in kilograms" },
          { symbol: "Activity Level", description: "Multiplier based on activity" }
        ],
        title: "Calorie Needs Formula"
      }}
      example={{
        title: "Example: Calculating for a 20kg Active Dog",
        scenario: "Let's calculate the RER and MER for a 20kg dog with high activity.",
        steps: [
          { step: 1, description: "Calculate RER", calculation: "RER = 70 * (20^0.75)" },
          { step: 2, description: "Calculate MER with activity level 1.8", calculation: "MER = RER * 1.8" }
        ],
        result: "The daily calorie need is 1800 kcal"
      }}
      relatedCalculators={[
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "🐠" },
        { title: "Indoor/Outdoor Activity Calorie Adjuster", url: "/pets/cat-activity-calorie-adjuster", icon: "🐱" },
        { title: "Electrolyte & Vitamin C Water Mix Calculator", url: "/pets/bird-electrolyte-vitamin-c-water-mix", icon: "🐦" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Input Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="weight" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Dog's Weight (kg)
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 20"
                    value={inputs.weight}
                    onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                    className="h-12 text-lg pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="age" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Dog's Age (years)
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 5"
                    value={inputs.age}
                    onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
                    className="h-12 text-lg pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="activityLevel" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Activity Level (1.2 - 2.0)
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="activityLevel"
                    type="number"
                    placeholder="e.g., 1.8"
                    value={inputs.activityLevel}
                    onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
                    className="h-12 text-lg pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleCalculate} className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
            <Button onClick={handleReset} variant="outline" className="h-12 px-6 text-base font-semibold border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Reset
            </Button>
          </div>

          {results && results.rer > 0 && (
            <div ref={resultsRef} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 col-span-full shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                      🐾 Daily Calorie Needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCalories(results.mer)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Based on RER and activity level
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      🏋️ Weekly Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCalories(results.mer * 7)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total calories for the week
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      📅 Monthly Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCalories(results.mer * 30)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Estimated monthly calories
                    </p>
                  </CardContent>
                </Card>
              </div>

              {results.tableData && results.tableData.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center justify-between">
                      <span>📋 Feeding Schedule</span>
                      {results.tableData.length > 12 && (
                        <Button onClick={() => setShowFullTable(!showFullTable)} variant="outline" size="sm" className="text-xs">
                          {showFullTable ? `Show First 12 Days` : `Show All ${results.tableData.length} Days`}
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Day</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Calories</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {(showFullTable ? results.tableData : results.tableData.slice(0, 12)).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.day}</td>
                              <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{formatCalories(row.calories)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-8">
          <section id="introduction">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              How to Calculate Your Dog's Calorie Needs
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Understanding your dog's nutritional needs is crucial for maintaining its health and vitality. According to the American Kennel Club, proper nutrition is a cornerstone of good health, impacting everything from coat condition to energy levels and longevity. The Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) are two critical metrics that help determine the daily caloric intake needed for a dog to maintain its weight and support its activity level.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The RER is the amount of energy required by a dog at rest, while the MER accounts for additional energy needs based on activity. For instance, a 20kg dog with moderate activity might require around 1,400 kcal per day. These calculations are essential for creating a balanced diet that supports your dog's lifestyle, whether it's a high-energy working dog or a more sedentary companion.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              For more detailed calculations and adjustments based on specific activities, you can also explore our <a href="/pets/cat-activity-calorie-adjuster" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Indoor/Outdoor Activity Calorie Adjuster</a>.
            </p>
          </section>

          <section id="factors">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Key Factors Affecting Calorie Needs
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Dog's Weight
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              A dog's weight is a primary determinant of its caloric needs. Larger dogs require more calories than smaller ones, but the relationship isn't linear. For example, a 5kg dog may need around 300 kcal/day, while a 50kg dog might require 2,000 kcal/day. This is due to metabolic scaling, where larger animals have a lower metabolic rate per unit of body weight compared to smaller animals. Therefore, calculating RER involves raising the weight to the power of 0.75 rather than a direct proportion.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Activity Level
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The activity level significantly impacts the MER calculation. A working dog or one that participates in agility training will have a higher caloric requirement than a dog that spends most of its day indoors. Activity multipliers typically range from 1.2 for sedentary dogs to 2.0 for highly active ones. You can adjust these multipliers using our <a href="/pets/dog-alcohol-ethanol-exposure-risk" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Activity Calorie Adjuster</a>.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Age and Life Stage
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Puppies, adults, and senior dogs have different caloric needs. Puppies require more calories to support growth and development, often needing up to twice the RER of an adult dog of the same weight. Conversely, senior dogs may require fewer calories due to decreased activity levels and metabolic changes. It's crucial to adjust the MER based on life stage to prevent obesity or malnutrition.
            </p>
          </section>

          <section id="types">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Types of Caloric Needs Calculations
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Resting Energy Requirement (RER)
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The RER is calculated using the formula RER = 70 * (Weight^0.75). This formula accounts for the basal metabolic rate needed to maintain essential physiological functions at rest. It's a baseline for determining any dog's energy needs, regardless of activity level.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Maintenance Energy Requirement (MER)
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              MER builds upon the RER by incorporating the dog's activity level, life stage, and other factors. The formula is MER = RER * Activity Level. Adjusting the activity level allows for personalized caloric intake recommendations, ensuring each dog's diet supports its health and lifestyle.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How do I know my dog's activity level?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Determining your dog's activity level involves observing its daily routine. Dogs that have regular walks, playtime, or participate in sports like agility are considered active. In contrast, dogs that spend most of their time indoors with minimal exercise are sedentary. Adjust the activity level multiplier in the MER formula accordingly to reflect these differences. For more precise adjustments, our <a href="/pets/cat-activity-calorie-adjuster" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Activity Calorie Adjuster</a> can help.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Can I use this calculator for puppies?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Yes, this calculator can be used for puppies, but it's essential to adjust for their higher caloric needs. Puppies typically require up to twice the RER of an adult dog of the same weight. Ensure you're using the correct weight and consider consulting with a veterinarian to tailor the diet to your puppy's growth requirements. Puppies' diets should support their rapid growth and development stages.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  What if my dog is overweight or underweight?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If your dog is overweight, you may need to adjust its caloric intake to promote weight loss. Conversely, an underweight dog might require more calories. In both cases, it's advisable to work with a veterinarian to determine the appropriate adjustments. They can provide guidance based on your dog's specific health needs and monitor progress to ensure optimal health outcomes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How often should I recalculate my dog's caloric needs?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  It's recommended to recalculate your dog's caloric needs whenever there's a significant change in its weight, activity level, or life stage. Regular recalculations ensure that your dog's diet remains aligned with its current needs, supporting overall health and preventing issues like obesity or malnutrition. Consider using our <a href="/pets/dog-alcohol-ethanol-exposure-risk" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">related calculators</a> for more insights.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              References & Additional Resources
            </h2>
            <ul className="space-y-3">
              <li className="leading-relaxed">
                <a href="https://www.akc.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  American Kennel Club - Dog Care
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert guidance on dog breeds, health, and nutrition</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  AVMA - Veterinary Standards
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Veterinary Medical Association guidelines</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.aspca.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  ASPCA - Animal Welfare
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pet care and animal welfare information</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  PetMD - Pet Health
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Veterinarian-reviewed pet health information</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.vet.cornell.edu" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Cornell Vet - Veterinary Research
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Leading veterinary research and resources</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  WSAVA - Nutrition Standards
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Global veterinary nutrition guidelines</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  AAHA - Veterinary Excellence
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Animal Hospital Association standards</p>
              </li>
            </ul>
          </section>
        </div>
      }
    />
  );
}