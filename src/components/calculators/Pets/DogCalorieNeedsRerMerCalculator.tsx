import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Dog, TrendingUp } from "lucide-react";

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

    const RER = 70 * Math.pow(weight, 0.75);
    const MER = RER * activityLevel;

    const tableData = Array.from({ length: 30 }, (_, index) => ({
      day: index + 1,
      calories: MER * (index + 1),
    }));

    return {
      RER,
      MER,
      tableData,
    };
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

  const formatValue = (value: number, type: string) => {
    if (type === "calories") {
      return `${value.toFixed(2)} kcal`;
    }
    return value.toString();
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "introduction", label: "Introduction/How to Calculate" },
        { id: "factors", label: "Key Factors" },
        { id: "types", label: "Types/Methods" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}
      formula={{
        formula: "RER = 70 * Weight^0.75; MER = RER * Activity Level",
        variables: [
          { symbol: "Weight", description: "Dog's weight in kilograms" },
          { symbol: "Activity Level", description: "Activity multiplier based on dog's lifestyle" },
        ],
        title: "RER/MER Calculation Formula",
      }}
      example={{
        title: "Example: Calculating RER/MER for a 20kg Active Dog",
        scenario: "Let's calculate the RER and MER for a 20kg dog with an activity level of 1.6.",
        steps: [
          { step: 1, description: "Calculate RER", calculation: "RER = 70 * 20^0.75" },
          { step: 2, description: "Calculate MER", calculation: "MER = RER * 1.6" },
        ],
        result: "The RER is 662 kcal/day, and the MER is 1059.2 kcal/day.",
      }}
      relatedCalculators={[
        { title: "Horse Protein & Lysine Requirement Calculator", url: "/pets/horse-protein-lysine-requirement", icon: "🐴" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "pH Adjustment (Acid/Base Buffer) Calculator", url: "/pets/aquarium-ph-adjustment-buffer", icon: "🐠" },
        { title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)", url: "/pets/bird-toxic-foods-exposure-checker", icon: "🐦" },
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
                  <Dog className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  <Dog className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  Activity Level
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="activityLevel"
                    type="number"
                    placeholder="e.g., 1.6"
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

          {results && results.MER > 0 && (
            <div ref={resultsRef} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 col-span-full shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                      🐶 Daily Caloric Needs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {formatValue(results.MER, "calories")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Based on your dog's weight and activity level
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      📊 Resting Energy Requirement (RER)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatValue(results.RER, "calories")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum calories needed at rest
                    </p>
                  </CardContent>
                </Card>
              </div>

              {results.tableData && results.tableData.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center justify-between">
                      <span>📋 Daily Caloric Schedule</span>
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
                              <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{formatValue(row.calories, "calories")}</td>
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
              How to Calculate Dog Calorie Needs
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Understanding your dog's calorie needs is crucial for maintaining optimal health and weight. According to the American Kennel Club, over 50% of dogs in the United States are overweight, which can lead to serious health issues. By calculating your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER), you can tailor their diet to meet specific energy needs.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The RER is the amount of energy a dog needs at rest, while the MER takes into account their activity level. This calculation is essential for providing the right amount of food, avoiding overfeeding or underfeeding. For example, a 20kg active dog may require different calories compared to a sedentary dog of the same weight.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              You can also use our <a href="/pets/horse-protein-lysine-requirement" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Horse Protein & Lysine Requirement Calculator</a> to understand nutritional needs for other animals.
            </p>
          </section>

          <section id="factors">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              What Factors Affect Dog Calorie Needs
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Weight
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              A dog's weight is a primary factor in determining calorie needs. Larger dogs require more energy compared to smaller breeds. For instance, a 50kg dog will have a significantly higher RER than a 10kg dog. This difference is crucial for calculating the exact food portions needed to maintain a healthy weight.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Activity Level
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The activity level of a dog greatly influences its MER. Active dogs, such as those involved in agility training or regular outdoor activities, need more calories than sedentary pets. According to the AVMA, adjusting calorie intake based on activity can prevent obesity and promote overall well-being.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Age
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Age is another critical factor. Puppies require more calories for growth, while senior dogs may need fewer calories due to decreased activity and metabolism. It's important to adjust feeding practices as dogs age to ensure they receive appropriate nutrition.
            </p>
          </section>

          <section id="types">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Types of Dog Calorie Calculations
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Resting Energy Requirement (RER)
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The RER is calculated using the formula: RER = 70 * Weight^0.75. This value represents the baseline energy needs of a dog at rest. It's essential for determining the minimum caloric intake required to sustain basic physiological functions.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Maintenance Energy Requirement (MER)
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The MER accounts for the dog's lifestyle and is calculated by multiplying the RER by an activity factor. Active dogs have a higher MER, reflecting their increased energy expenditure. Adjusting the MER ensures that dogs receive the right amount of calories for their activity level.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How do I determine my dog's activity level?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Determining your dog's activity level involves assessing their daily routine and energy expenditure. Dogs that engage in regular physical activities, such as running, playing, or participating in dog sports, are considered active. In contrast, dogs that spend most of their time indoors with minimal physical exertion are sedentary. Understanding this distinction is crucial for accurately calculating their MER and providing appropriate nutrition.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Can I use this calculator for puppies?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Yes, this calculator can be used for puppies, but it's important to consider that puppies have different nutritional needs compared to adult dogs. They require more calories to support growth and development. Adjust the activity level to reflect their playful and energetic nature, and consult with a veterinarian for specific dietary recommendations tailored to your puppy's breed and age.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  What should I do if my dog is overweight?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If your dog is overweight, it's important to adjust their calorie intake and increase physical activity. Begin by calculating their MER based on their ideal weight rather than their current weight. Gradually reduce their calorie intake and incorporate regular exercise into their routine. Consulting with a veterinarian can provide additional guidance and help develop a safe and effective weight loss plan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How often should I adjust my dog's calorie intake?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  It's recommended to adjust your dog's calorie intake periodically, especially if there are changes in their weight, activity level, or overall health. Regularly monitoring your dog's weight and body condition can help determine when adjustments are needed. Additionally, life stage changes, such as transitioning from puppyhood to adulthood or entering senior years, may require recalculating their RER and MER.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Are there breed-specific considerations for calorie needs?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Yes, different dog breeds have unique metabolic rates and energy requirements. For example, smaller breeds often have higher metabolic rates and may require more calories per kilogram of body weight compared to larger breeds. It's important to consider breed-specific characteristics and consult breed standards, such as those from the AKC, when determining calorie needs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How can I ensure my dog receives a balanced diet?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Providing a balanced diet involves ensuring your dog receives the right proportions of proteins, fats, carbohydrates, vitamins, and minerals. Using a high-quality commercial dog food that meets AAFCO standards is a reliable way to provide balanced nutrition. For homemade diets, consulting with a veterinary nutritionist can help create a balanced meal plan tailored to your dog's specific needs.
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert guidance on dog breeds, health, and nutrition.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  AVMA - Veterinary Standards
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Veterinary Medical Association guidelines.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.aspca.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  ASPCA - Animal Welfare
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pet care and animal welfare information.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  PetMD - Pet Health
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Veterinarian-reviewed pet health information.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.vet.cornell.edu" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Cornell Vet - Veterinary Research
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Leading veterinary research and resources.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  WSAVA - Nutrition Standards
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Global veterinary nutrition guidelines.</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  AAHA - Veterinary Excellence
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Animal Hospital Association standards.</p>
              </li>
            </ul>
          </section>
        </div>
      }
    />
  );
}