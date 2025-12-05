import { useState, useMemo, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Calculator, DollarSign, TrendingUp } from "lucide-react"
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout"

const DogCalorieNeedsRerMerCalculator = () => {
  const [inputs, setInputs] = useState({ weight: '', age: '', activityLevel: '' });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "weight":
        return `${value.toFixed(2)} kg`;
      case "calories":
        return `${value.toFixed(0)} kcal`;
      default:
        return value.toString();
    }
  };

  const handleCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setInputs({ weight: '', age: '', activityLevel: '' });
  };

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const activityLevel = parseFloat(inputs.activityLevel);
    let rer = 0;
    let mer = 0;

    if (!isNaN(weight) && weight > 0) {
      rer = 70 * Math.pow(weight, 0.75);
      mer = rer * activityLevel;
    }

    return {
      rer,
      mer,
      scheduleData: Array.from({ length: 30 }, (_, i) => ({
        period: `Day ${i + 1}`,
        value: mer
      }))
    };
  }, [inputs]);

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      widget={
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <Label htmlFor="weight">Dog's Weight (kg)</Label>
              <Input
                id="weight"
                icon={<Calculator />}
                placeholder="e.g., 10"
                value={inputs.weight}
                onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="activityLevel">Activity Level (Multiplier)</Label>
              <Input
                id="activityLevel"
                icon={<TrendingUp />}
                placeholder="e.g., 1.6"
                value={inputs.activityLevel}
                onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleCalculate} className="bg-blue-600 text-white">Calculate</Button>
            <Button onClick={handleReset} variant="outline">Reset</Button>
          </div>
          <div ref={resultsRef} className="mt-8 grid grid-cols-2 gap-4">
            <Card className="col-span-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8">
              <CardHeader>
                <CardTitle className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {formatValue(results.mer, "calories")} /day
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>RER</CardTitle>
              </CardHeader>
              <CardContent>
                {formatValue(results.rer, "calories")}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>MER</CardTitle>
              </CardHeader>
              <CardContent>
                {formatValue(results.mer, "calories")}
              </CardContent>
            </Card>
          </div>
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Feeding Schedule</span>
                  {results.scheduleData.length > 12 && (
                    <Button onClick={() => setShowFullTable(!showFullTable)} size="sm">
                      {showFullTable ? 'Show Less' : `Show All ${results.scheduleData.length}`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Calories</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.scheduleData.slice(0, showFullTable ? undefined : 12).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.period}</TableCell>
                        <TableCell>{formatValue(row.value, "calories")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      }
      editorial={
        <div>
          <section>
            <h2>Introduction</h2>
            <p>
              Understanding your dog's dietary needs is crucial for maintaining their health and vitality. The Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) are two key metrics that help pet owners determine the appropriate caloric intake for their dogs. RER represents the energy required for basic bodily functions at rest, while MER accounts for additional energy expenditure based on activity level, age, and other factors. This calculator provides an easy way to estimate these values, ensuring your dog receives the nutrition they need to thrive.
            </p>
          </section>
          <section>
            <h2>Formula</h2>
            <p>
              The formula for calculating the Resting Energy Requirement (RER) is as follows:
              <br />
              <strong>RER = 70 * (Weight in kg<sup>0.75</sup>)</strong>
              <br />
              This formula accounts for the metabolic needs of a dog at rest. To calculate the Maintenance Energy Requirement (MER), the RER is multiplied by an activity factor based on the dog's lifestyle:
              <br />
              <strong>MER = RER * Activity Level</strong>
            </p>
          </section>
          <section>
            <h2>Factors Affecting Caloric Needs</h2>
            <p>
              Several factors influence the caloric needs of dogs. These include:
              <ul>
                <li><strong>Weight:</strong> Heavier dogs require more calories to maintain their body weight.</li>
                <li><strong>Age:</strong> Puppies and young dogs have higher energy needs due to growth and development, while senior dogs may require fewer calories.</li>
                <li><strong>Activity Level:</strong> Active dogs that engage in regular exercise need more calories than sedentary dogs.</li>
                <li><strong>Breed:</strong> Certain breeds have unique metabolic rates that can affect their caloric requirements.</li>
              </ul>
            </p>
          </section>
          <section>
            <h2>FAQs</h2>
            <div>
              <strong>What is the difference between RER and MER?</strong>
              <p>
                RER, or Resting Energy Requirement, is the amount of energy a dog needs to maintain basic bodily functions while at rest. MER, or Maintenance Energy Requirement, includes additional energy for daily activities and varies based on the dog's activity level.
              </p>
            </div>
            <div>
              <strong>How do I determine my dog's activity level?</strong>
              <p>
                Activity level can be categorized as low, moderate, or high. Low activity includes minimal exercise, moderate includes regular walks and play, and high activity involves vigorous exercise. Use these categories to select an appropriate activity multiplier for the MER calculation.
              </p>
            </div>
            <div>
              <strong>Can this calculator be used for all dog breeds?</strong>
              <p>
                Yes, the calculator is designed for a wide range of dog breeds. However, specific breed characteristics, such as metabolism and typical activity levels, should be considered for more accurate results.
              </p>
            </div>
            <div>
              <strong>How often should I recalculate my dog's calorie needs?</strong>
              <p>
                It's advisable to recalculate your dog's calorie needs whenever there is a significant change in weight, activity level, or life stage, such as transitioning from puppy to adult or adult to senior.
              </p>
            </div>
            <div>
              <strong>Can I use human food to meet my dog's caloric needs?</strong>
              <p>
                While some human foods are safe for dogs, it's important to ensure they receive a balanced diet formulated for canine nutrition. Consult with a veterinarian to determine appropriate food choices.
              </p>
            </div>
            <div>
              <strong>What are the risks of overfeeding my dog?</strong>
              <p>
                Overfeeding can lead to obesity, which increases the risk of health issues such as diabetes, joint problems, and heart disease. It's important to monitor your dog's weight and adjust their diet accordingly.
              </p>
            </div>
            <div>
              <strong>How can I encourage my dog to maintain a healthy weight?</strong>
              <p>
                Regular exercise, portion control, and feeding a balanced diet are key strategies for maintaining a healthy weight. Engaging in activities like walking, playing fetch, and agility training can help keep your dog active.
              </p>
            </div>
            <div>
              <strong>Is it necessary to consult a vet for my dog's diet?</strong>
              <p>
                Consulting a veterinarian is recommended, especially for dogs with specific health conditions or dietary needs. A vet can provide personalized advice based on your dog's health status and nutritional requirements.
              </p>
            </div>
          </section>
          <section>
            <h2>References</h2>
            <ul>
              <li><a href="https://www.akc.org">American Kennel Club (Dog Care)</a> - Expert guidance on dog breeds, health, and nutrition.</li>
              <li><a href="https://www.avma.org">AVMA (Veterinary Standards)</a> - American Veterinary Medical Association guidelines.</li>
              <li><a href="https://www.aspca.org">ASPCA (Animal Welfare)</a> - Pet care and animal welfare information.</li>
              <li><a href="https://www.petmd.com">PetMD (Pet Health)</a> - Veterinarian-reviewed pet health information.</li>
              <li><a href="https://www.vet.cornell.edu">Cornell Vet (Veterinary Research)</a> - Leading veterinary research and resources.</li>
              <li><a href="https://www.wsava.org">WSAVA (Nutrition Standards)</a> - Global veterinary nutrition guidelines.</li>
            </ul>
          </section>
        </div>
      }
      onThisPage={[
        "Introduction",
        "Formula",
        "Factors Affecting Caloric Needs",
        "FAQs",
        "References"
      ]}
      formula={{
        formula: "RER = 70 * (Weight in kg^0.75); MER = RER * Activity Level",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement" },
          { symbol: "MER", description: "Maintenance Energy Requirement" },
          { symbol: "Weight", description: "Dog's weight in kilograms" },
          { symbol: "Activity Level", description: "Activity multiplier" }
        ]
      }}
      example={{
        steps: [
          "Determine the dog's weight in kilograms.",
          "Calculate RER using the formula: RER = 70 * (Weight in kg^0.75).",
          "Select an activity level multiplier based on the dog's lifestyle.",
          "Calculate MER using the formula: MER = RER * Activity Level.",
          "Use the MER to determine daily caloric needs."
        ]
      }}
      relatedCalculators={[
        {
          title: "Cat Onion/Garlic Toxicity Calculator",
          url: "/pets/cat-onion-garlic-toxicity",
          icon: "🐱"
        },
        {
          title: "Heater Wattage Requirement",
          url: "/pets/aquarium-heater-wattage-requirement",
          icon: "💡"
        },
        {
          title: "Shedding & Combing Time Planner",
          url: "/pets/cat-shedding-combing-time-planner",
          icon: "🪮"
        },
        {
          title: "Horse Selenium Toxicity Threshold (ppm)",
          url: "/pets/horse-selenium-toxicity-threshold",
          icon: "🐴"
        }
      ]}
    />
  );
};

export default DogCalorieNeedsRerMerCalculator;