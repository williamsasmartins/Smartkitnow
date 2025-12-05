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

    if (isNaN(weight) || isNaN(age) || isNaN(activityLevel)) return null;

    const RER = 70 * Math.pow(weight, 0.75);
    const MER = RER * activityLevel;

    const tableData = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      calories: (MER * (1 + i * 0.01)).toFixed(2),
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
    switch (type) {
      case "calories":
        return `${value.toFixed(2)} kcal`;
      default:
        return value.toString();
    }
  };

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
          { symbol: "Activity Level", description: "Factor based on dog's activity" }
        ],
        title: "RER/MER Calculation Formula"
      }}
      example={{
        title: "Example: Calculate for a 20kg Active Dog",
        scenario: "Let's calculate the RER and MER for a 20kg dog with high activity level.",
        steps: [
          { step: 1, description: "Calculate RER", calculation: "RER = 70 * (20^0.75) = 662.4 kcal" },
          { step: 2, description: "Calculate MER", calculation: "MER = 662.4 * 1.8 = 1192.32 kcal" }
        ],
        result: "The daily calorie need is 1192.32 kcal."
      }}
      relatedCalculators={[
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Xylitol Exposure Risk for Cats (rare but educational)", url: "/pets/cat-xylitol-exposure-risk", icon: "🐾" },
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🐠" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={<div className="space-y-6">
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
                Activity Level
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

        {results && results.MER > 0 && (
          <div ref={resultsRef} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 col-span-full shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                    🐶 Daily Calorie Needs
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
                    💸 Weekly Calorie Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatValue(results.MER * 7, "calories")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total calories needed per week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                    📊 Monthly Calorie Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatValue(results.MER * 30, "calories")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Estimated monthly calorie intake
                  </p>
                </CardContent>
              </Card>
            </div>

            {results.tableData && results.tableData.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center justify-between">
                    <span>📋 Daily Calorie Schedule</span>
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
                          <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Calories (kcal)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {(showFullTable ? results.tableData : results.tableData.slice(0, 12)).map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.day}</td>
                            <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{row.calories}</td>
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
      </div>}
      editorial={<div className="space-y-8">
        <section id="introduction">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            How to Calculate Your Dog's Calorie Needs
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            Understanding your dog's calorie needs is crucial for maintaining their health and energy levels. According to the American Kennel Club, proper nutrition is essential for dogs of all breeds and sizes. The Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) are key metrics used by veterinarians to determine the appropriate daily caloric intake for dogs. By calculating these values, pet owners can ensure their dogs receive the right amount of food to support their lifestyle and health.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            The RER is calculated based on the dog's weight, while the MER takes into account the dog's activity level. For example, a sedentary dog will have a lower MER compared to an active dog of the same weight. This calculation helps in preventing overfeeding, which can lead to obesity, or underfeeding, which can result in malnutrition. It is important to adjust the calorie intake as your dog ages or if there are significant changes in their activity level.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            You can also explore our <a href="/pets/dog-protein-fat-intake-guide" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Dog Protein/Fat Intake Guide</a> to further optimize your dog's diet based on their specific goals and needs.
          </p>
        </section>

        <section id="factors">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            What Factors Affect Your Dog's Caloric Needs
          </h2>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Weight and Breed
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            The weight and breed of a dog play a significant role in determining its caloric needs. Larger breeds such as Great Danes require more calories than smaller breeds like Chihuahuas. According to the WSAVA, the RER is calculated using the formula: 70 * (Weight^0.75). This formula accounts for the metabolic rate differences between small and large breeds. For instance, a 5kg Chihuahua might need around 300 kcal/day, whereas a 50kg Great Dane could require up to 2000 kcal/day.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Activity Level
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            A dog's activity level is another critical factor. Active dogs, such as those participating in agility training or regular long walks, have higher caloric needs than those with a more sedentary lifestyle. The MER is calculated by multiplying the RER by an activity factor, which can range from 1.2 for inactive dogs to 2.0 or more for highly active dogs. For example, a 20kg dog with a high activity level might need 1200 kcal/day, compared to 800 kcal/day for a less active dog of the same weight.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Age and Health Status
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            Age and health status also influence a dog's calorie requirements. Puppies and young dogs need more calories to support growth and development, while senior dogs may require fewer calories due to a slower metabolism. Health conditions such as thyroid issues or diabetes can also impact caloric needs. It's essential to consult with a veterinarian to adjust your dog's diet based on their age and health status. For detailed guidance, refer to the <a href="/pets/cat-xylitol-exposure-risk" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Xylitol Exposure Risk for Cats</a> calculator for insights into dietary considerations.
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
            The Resting Energy Requirement (RER) represents the amount of energy a dog needs while at rest in a thermoneutral environment. It is the baseline for calculating a dog's total caloric needs and is determined primarily by the dog's weight. The RER is crucial for understanding the minimum caloric intake required to maintain basic physiological functions such as breathing, circulation, and digestion.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Maintenance Energy Requirement (MER)
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            The Maintenance Energy Requirement (MER) is an extension of the RER that includes additional calories needed for a dog's daily activities. This calculation considers factors such as exercise, growth, and reproduction. By multiplying the RER by an activity factor, pet owners can determine the total daily caloric intake necessary to maintain their dog's current weight and support their lifestyle. For more precise calculations, check out our <a href="/pets/breeding-tank-volume-planner" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Breeding Tank Volume Planner</a>.
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
                Determining your dog's activity level involves assessing their daily routine and exercise habits. Consider factors like the duration and intensity of walks, playtime, and any additional activities such as agility training. For instance, a dog that goes for a 30-minute walk twice a day and plays fetch regularly might have a moderate activity level. In contrast, a dog participating in daily agility training or long hikes may have a high activity level. Understanding your dog's activity level helps in accurately calculating their caloric needs, ensuring they receive the right amount of food to support their lifestyle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                What if my dog is overweight or underweight?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If your dog is overweight or underweight, it's important to adjust their caloric intake accordingly. For overweight dogs, reducing their caloric intake gradually can help them reach a healthier weight. This involves calculating the RER for their ideal weight and adjusting the MER based on their activity level. For underweight dogs, increasing their caloric intake is necessary to promote weight gain and overall health. Consult with a veterinarian to develop a tailored feeding plan that addresses your dog's specific needs. Regular monitoring and adjustments are key to achieving and maintaining a healthy weight.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                How often should I recalculate my dog's caloric needs?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                It's advisable to recalculate your dog's caloric needs whenever there are significant changes in their weight, age, or activity level. Puppies and young dogs should have their caloric needs reassessed every few months as they grow. Adult dogs may require recalculations annually or when there are changes in their lifestyle, such as increased exercise or a new health condition. Regular recalculations ensure that your dog receives the appropriate amount of food to maintain their health and energy levels. For more detailed guidance, refer to the <a href="/pets/dog-protein-fat-intake-guide" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Dog Protein/Fat Intake Guide</a>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Can I use human food to meet my dog's caloric needs?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                While some human foods are safe for dogs, it's crucial to ensure that they receive a balanced diet that meets their nutritional needs. Foods like lean meats, vegetables, and rice can be included in moderation, but they should not replace a complete and balanced dog food. Human foods should be free of harmful ingredients such as chocolate, onions, and xylitol. It's best to consult with a veterinarian before introducing new foods into your dog's diet. For more insights on safe food choices, explore our <a href="/pets/cat-xylitol-exposure-risk" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Xylitol Exposure Risk for Cats</a> calculator.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                How does age affect my dog's caloric needs?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Age significantly impacts a dog's caloric needs. Puppies require more calories to support growth and development, while adult dogs need calories to maintain their weight and energy levels. As dogs age, their metabolism slows down, reducing their caloric needs. Senior dogs may require fewer calories to prevent weight gain and associated health issues. It's essential to adjust your dog's diet as they age to ensure they receive the right amount of nutrients. For detailed age-specific dietary recommendations, consult with a veterinarian or refer to the <a href="/pets/breeding-tank-volume-planner" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Breeding Tank Volume Planner</a>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                What is the role of breed in determining caloric needs?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Breed plays a crucial role in determining a dog's caloric needs due to differences in size, metabolism, and activity levels. Larger breeds typically require more calories than smaller breeds. Additionally, certain breeds are more active and may have higher caloric needs. Understanding the specific needs of your dog's breed helps in tailoring their diet to support their health and lifestyle. For breed-specific dietary recommendations, consult resources such as the American Kennel Club or speak with a veterinarian. For more insights, explore our <a href="/pets/cat-protein-fat-intake-guide" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Cat Protein/Fat Intake Guide</a>.
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
                American Kennel Club (Dog Care)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert guidance on dog breeds, health, and nutrition.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                AVMA (Veterinary Standards)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Veterinary Medical Association guidelines.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.aspca.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                ASPCA (Animal Welfare)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pet care and animal welfare information.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                PetMD (Pet Health)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Veterinarian-reviewed pet health information.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.vet.cornell.edu" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Cornell Vet (Veterinary Research)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Leading veterinary research and resources.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                WSAVA (Nutrition Standards)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Global veterinary nutrition guidelines.</p>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                AAHA (Veterinary Excellence)
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">American Animal Hospital Association standards.</p>
            </li>
          </ul>
        </section>
      </div>}
    />
  );
}