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
    const weight = parseFloat(inputs.weight) || 0;
    const age = parseInt(inputs.age) || 0;
    const activityLevel = parseFloat(inputs.activityLevel) || 1;

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityLevel;

    const tableData = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      rer: rer.toFixed(2),
      mer: (mer * (i + 1)).toFixed(2),
    }));

    return {
      rer: rer.toFixed(2),
      mer: mer.toFixed(2),
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
        { id: "faq", label: "Frequently Asked Questions" }
      ]}
      formula={{
        formula: "RER = 70 * (Weight^0.75), MER = RER * Activity Level",
        variables: [
          { symbol: "Weight", description: "Dog's weight in kilograms" },
          { symbol: "Activity Level", description: "Multiplier based on dog's activity" }
        ],
        title: "RER and MER Formula"
      }}
      example={{
        title: "Example: Calculating RER and MER for a 20kg Dog",
        scenario: "Let's calculate the RER and MER for a 20kg dog with a moderate activity level.",
        steps: [
          { step: 1, description: "Calculate RER", calculation: "RER = 70 * (20^0.75) = 662 kcal" },
          { step: 2, description: "Calculate MER", calculation: "MER = RER * 1.6 = 1059 kcal" }
        ],
        result: "For a 20kg dog with moderate activity, the MER is 1059 kcal/day."
      }}
      relatedCalculators={[
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "🌡️" },
        { title: "Thermal Gradient Maintenance Power Estimator", url: "/pets/reptile-thermal-gradient-maintenance-power", icon: "🔋" },
        { title: "Oxygen Solubility vs. Temperature Table", url: "/pets/oxygen-solubility-vs-temperature-table", icon: "🌊" }
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
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 20"
                    value={inputs.weight}
                    onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                    className="h-12 text-lg pl-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="age" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Dog's Age (years)
                </Label>
                <div className="relative">
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 3"
                    value={inputs.age}
                    onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
                    className="h-12 text-lg pl-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="activityLevel" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Activity Level
                </Label>
                <div className="relative">
                  <Input
                    id="activityLevel"
                    type="number"
                    placeholder="e.g., 1.6"
                    value={inputs.activityLevel}
                    onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
                    className="h-12 text-lg pl-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                      {formatValue(results.mer, "calories")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Based on your dog's weight and activity level
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      🔄 Resting Energy Requirement (RER)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatValue(results.rer, "calories")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum calories needed at rest
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      📊 Maintenance Energy Requirement (MER)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatValue(results.mer, "calories")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Calories needed for daily activities
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
                          {showFullTable ? `Show First 12 Rows` : `Show All ${results.tableData.length} Rows`}
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
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">MER (kcal)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {(showFullTable ? results.tableData : results.tableData.slice(0, 12)).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.day}</td>
                              <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{row.mer}</td>
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
              Understanding your dog's calorie needs is crucial for maintaining their health and well-being. According to the American Kennel Club, the average calorie requirement varies significantly based on a dog's weight, age, and activity level. For instance, a 20kg dog with moderate activity requires around 1,000 to 1,200 calories per day. This ensures they have enough energy for daily activities without risking obesity, a common issue affecting over 50% of dogs in the United States.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Calculating the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) helps pet owners provide the right amount of food. For example, a dog that is more active will need a higher MER compared to a sedentary dog. These calculations can prevent overfeeding or underfeeding, both of which can lead to health issues.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              For more detailed insights, you can also explore our <a href="/pets/dog-caffeine-toxicity" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Dog Caffeine Toxicity Calculator</a> to understand how different substances affect your pet's health.
            </p>
          </section>

          <section id="factors">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              What Factors Affect Your Dog's Calorie Needs
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Dog's Weight
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Weight is a primary factor in determining calorie needs. Larger dogs naturally require more calories than smaller ones. For instance, a 5kg dog may need around 300-400 calories daily, while a 50kg dog might require between 1,800 and 2,000 calories. It's essential to adjust these numbers based on your dog's specific needs and consult with a veterinarian for personalized advice.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Age and Life Stage
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Puppies, adults, and senior dogs have different nutritional requirements. Puppies need more calories to support growth and development, while senior dogs may require fewer calories due to lower activity levels. According to the American Veterinary Medical Association, adjusting calorie intake based on life stage is crucial for preventing obesity and other health issues.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Activity Level
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Dogs with higher activity levels burn more calories and thus need more energy. For example, working dogs or those that participate in sports may require up to twice the calories of a sedentary dog. It's important to consider your dog's lifestyle when determining their calorie needs to ensure they maintain a healthy weight.
            </p>
          </section>

          <section id="types">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Types of Dog Diets
            </h2>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Commercial Dog Food
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Commercial dog foods are formulated to meet the nutritional needs of dogs at various life stages. They provide a balanced diet with the right mix of proteins, fats, and carbohydrates. Brands often offer specific formulas for puppies, adults, and seniors, making it easier for pet owners to select the right option for their dog.
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Homemade Diets
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Some owners prefer preparing homemade meals for their pets. While this can offer more control over ingredients, it's essential to ensure the diet is nutritionally balanced. Consulting with a veterinary nutritionist can help in designing a diet that meets all of your dog's needs. You can also use our <a href="/pets/dog-caffeine-toxicity" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Dog Caffeine Toxicity Calculator</a> to ensure dietary safety.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How do I know if my dog is getting the right amount of calories?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Monitoring your dog's weight and body condition is key. Regularly check if they are maintaining a healthy weight for their breed and size. If you notice weight gain or loss, adjust their calorie intake accordingly. Consult with your veterinarian for guidance tailored to your dog's needs.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Can I use human food to meet my dog's calorie needs?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  While some human foods are safe for dogs, not all are nutritionally balanced for them. Foods like lean meats, vegetables, and grains can be included, but it's crucial to ensure they meet your dog's nutritional needs. Avoid foods that are toxic to dogs, such as chocolate, grapes, and onions. For more details, see our <a href="/pets/dog-caffeine-toxicity" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Dog Caffeine Toxicity Calculator</a>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How often should I feed my dog?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Feeding frequency depends on your dog's age and health. Puppies typically require three to four meals per day, while adults can be fed once or twice daily. Senior dogs may benefit from smaller, more frequent meals to aid digestion. Adjust feeding schedules based on your dog's specific needs and consult with your veterinarian for personalized advice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  What should I do if my dog is gaining weight?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If your dog is gaining weight, first review their diet and exercise routine. Reduce calorie intake by adjusting portion sizes or switching to a lower-calorie food. Increase physical activity gradually to help them burn more calories. Consult your veterinarian for a comprehensive weight management plan tailored to your dog's needs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Are there specific calorie needs for different dog breeds?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Yes, different breeds have varying energy requirements. Larger breeds generally need more calories than smaller ones. However, individual needs can vary based on factors like metabolism and activity level. It's essential to tailor calorie intake to your dog's specific breed and lifestyle. For breed-specific advice, refer to resources like the American Kennel Club.
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