import React, { useState, useMemo, useRef } from 'react';
import { CalculatorVerticalLayout } from "@/components/templates/CalculatorVerticalLayout";
import { Input, Button, Table, Icon } from "@/components/ui";
import { HelpCircle, BookOpen, Dog, Cat, Scissors, Horse } from "lucide-react";

function DogCalorieNeedsRerMerCalculator() {
  const [weight, setWeight] = useState<number | string>('');
  const [age, setAge] = useState<number | string>('');
  const [activityLevel, setActivityLevel] = useState<string>('average');
  const [showFullTable, setShowFullTable] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const formatWeight = (value: number, unit: 'kg' | 'lbs') => {
    return unit === 'kg' ? `${value.toFixed(1)} kg` : `${(value * 2.20462).toFixed(1)} lbs`;
  };

  const formatVolume = (value: number, unit: 'cups' | 'ml') => {
    return unit === 'cups' ? `${value.toFixed(1)} cups` : `${(value * 236.588).toFixed(1)} ml`;
  };

  const calculateRER = (weight: number) => {
    return 70 * Math.pow(weight, 0.75);
  };

  const calculateMER = (rer: number, activityLevel: string) => {
    let factor = 1.6; // Default for average activity
    if (activityLevel === 'low') factor = 1.2;
    else if (activityLevel === 'high') factor = 2.0;
    return rer * factor;
  };

  const results = useMemo(() => {
    const parsedWeight = parseFloat(weight as string);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || isNaN(parseFloat(age as string))) return null;
    
    const rer = calculateRER(parsedWeight);
    const mer = calculateMER(rer, activityLevel);
    
    return {
      rer: rer.toFixed(2),
      mer: mer.toFixed(2),
      weeklyCalories: (mer * 7).toFixed(2),
      monthlyCalories: (mer * 30).toFixed(2),
    };
  }, [weight, age, activityLevel]);

  const handleCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setWeight('');
    setAge('');
    setActivityLevel('average');
    setShowFullTable(false);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      widget={
        <div className="p-6 bg-white dark:bg-slate-900 shadow-lg rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Dog's Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              icon={<Dog className="text-slate-400" />}
              placeholder="Enter weight (kg)"
            />
            <Input
              label="Dog's Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              icon={<Dog className="text-slate-400" />}
              placeholder="Enter age (years)"
            />
            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="low">Low</option>
                <option value="average">Average</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button onClick={handleCalculate} className="bg-blue-600 text-white hover:bg-blue-500">
              Calculate
            </Button>
            <Button onClick={handleReset} className="bg-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
              Reset
            </Button>
          </div>
          {results && (
            <div ref={resultsRef} className="mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {results.mer} calories/day
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    Maintenance Energy Requirement
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.weeklyCalories} calories/week
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    Weekly Total
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.monthlyCalories} calories/month
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    Monthly Total
                  </p>
                </div>
              </div>
            </div>
          )}
          {showFullTable && (
            <Table
              data={/* Some data here */}
              columns={/* Some columns here */}
              className="mt-4"
            />
          )}
        </div>
      }
      editorial={
        <div className="prose dark:prose-dark">
          <h2>Introduction</h2>
          <p>
            Understanding your dog's nutritional needs is crucial to ensuring their health and longevity. Just like humans, dogs require a balanced diet that provides the necessary energy and nutrients to support their daily activities and overall well-being. Whether you have a playful puppy or a more sedentary senior dog, knowing how many calories they need each day can help you make informed decisions about their diet.
          </p>
          <p>
            The Dog Calorie Needs (RER/MER) Calculator is a valuable tool that helps pet owners determine the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) for their dogs. The RER is the amount of energy required by the body to maintain basic physiological functions at rest, while the MER accounts for additional energy needs based on activity level, age, and other factors.
          </p>
          <p>
            By calculating these values, you can tailor your dog's diet to meet their specific energy requirements, preventing both underfeeding and overfeeding. This not only helps maintain a healthy weight but also supports their overall health, reducing the risk of obesity-related issues and ensuring they receive the nutrients they need to thrive.
          </p>
          <p>
            In this guide, we'll explore the formula used to calculate RER and MER, discuss the factors that influence your dog's calorie needs, and provide answers to frequently asked questions. Additionally, we'll offer references to trusted resources for further reading and information on related calculators to help you manage your pet's health and nutrition effectively.
          </p>

          <h2>Formula</h2>
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl">
            <p className="text-xl font-bold">Resting Energy Requirement (RER) Formula:</p>
            <p className="pl-8">
              <strong>RER = 70 × (Weight in kg<sup>0.75</sup>)</strong>
            </p>
            <p className="text-xl font-bold mt-4">Maintenance Energy Requirement (MER) Formula:</p>
            <p className="pl-8">
              <strong>MER = RER × Activity Factor</strong>
            </p>
            <p className="mt-4">
              The RER formula calculates the calories needed for basic metabolic functions at rest, based on the dog's weight. The MER formula then adjusts the RER by an activity factor, which varies depending on the dog's activity level. This provides a more accurate estimate of total daily calorie needs.
            </p>
          </div>

          <h2>Factors Affecting Calorie Needs</h2>
          <h3>Breed</h3>
          <p>
            Different breeds have varying energy requirements due to differences in size, metabolism, and activity levels. For instance, a small breed like a Chihuahua may have a higher metabolism and require more calories per pound than a larger breed like a Great Dane.
          </p>
          <h3>Age</h3>
          <p>
            Puppies and young dogs generally require more calories than adult dogs because they are growing and developing. Senior dogs, on the other hand, may need fewer calories due to a slower metabolism and decreased activity levels.
          </p>
          <h3>Activity Level</h3>
          <p>
            An active dog that regularly participates in vigorous activities such as running, agility training, or herding will need more calories than a dog with a more sedentary lifestyle. Adjusting the activity factor in the MER formula can help account for these differences.
          </p>
          <h3>Health Status</h3>
          <p>
            Dogs with certain health conditions may have altered energy needs. For example, a dog recovering from surgery or illness may require additional calories to support healing, while a dog with obesity may need a reduced-calorie diet to achieve a healthy weight.
          </p>
          <h3>Environmental Factors</h3>
          <p>
            The environment in which a dog lives can also impact their calorie needs. Dogs living in colder climates may require more energy to maintain body temperature, while those in warmer climates may need less.
          </p>

          <h2>Frequently Asked Questions</h2>
          <div className="faq-section">
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                What is the difference between RER and MER?
              </div>
              <p className="pl-8">
                RER, or Resting Energy Requirement, is the amount of energy a dog needs to maintain basic physiological functions at rest. MER, or Maintenance Energy Requirement, includes the RER plus additional energy needed for activity, growth, and other factors. MER provides a more comprehensive estimate of a dog's total daily calorie needs.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                How do I determine my dog's activity level?
              </div>
              <p className="pl-8">
                Activity level can be categorized as low, average, or high based on your dog's daily routine. A low activity level might involve short walks and minimal play, while a high activity level includes regular vigorous exercise. Consider your dog's typical behavior and adjust the activity factor accordingly in the MER calculation.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                Can I use this calculator for puppies?
              </div>
              <p className="pl-8">
                Yes, this calculator can be used for puppies, but keep in mind that their calorie needs are typically higher due to growth. Puppies may require more frequent feeding and a diet formulated for growth. Adjust the activity factor to reflect their energy levels and consult with a veterinarian for specific dietary recommendations.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                What should I do if my dog is overweight?
              </div>
              <p className="pl-8">
                If your dog is overweight, it's important to adjust their calorie intake to achieve a healthier weight. Use the calculator to determine a suitable MER and consider a diet plan with reduced calories. Regular exercise and consulting with a veterinarian can also help manage your dog's weight effectively.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                How often should I adjust my dog's calorie intake?
              </div>
              <p className="pl-8">
                It's advisable to reassess your dog's calorie needs periodically, especially if there are changes in weight, age, activity level, or health status. Regular check-ups with a veterinarian can provide guidance on adjusting calorie intake to maintain optimal health.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                Are there specific diets for different breeds?
              </div>
              <p className="pl-8">
                Some dog food brands offer breed-specific formulas that consider the unique nutritional needs of certain breeds. These diets may address specific health concerns or energy requirements. However, it's important to choose a high-quality diet that meets your individual dog's needs, regardless of breed.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                Can environmental factors affect my dog's calorie needs?
              </div>
              <p className="pl-8">
                Yes, environmental factors such as climate can impact a dog's energy requirements. Dogs in colder climates may need more calories to maintain body heat, while those in warmer areas may require less. Adjusting calorie intake based on environmental conditions can help maintain a healthy weight.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xl font-bold flex items-center">
                <HelpCircle className="mr-2" />
                How can I ensure my dog gets a balanced diet?
              </div>
              <p className="pl-8">
                A balanced diet for dogs includes the right proportions of protein, fats, carbohydrates, vitamins, and minerals. Choose a high-quality commercial dog food that meets AAFCO standards or consult with a veterinarian for a homemade diet plan. Regularly monitoring your dog's health and adjusting their diet as needed can ensure nutritional balance.
              </p>
            </div>
          </div>

          <h2>References</h2>
          <ul className="list-none">
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.akc.org" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  American Kennel Club - Dog Care
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Expert guidance on dog breeds, health, and nutrition.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  AVMA - Veterinary Standards
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  American Veterinary Medical Association guidelines.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.aspca.org" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  ASPCA - Animal Welfare
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Pet care and animal welfare information.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  PetMD - Pet Health
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Veterinarian-reviewed pet health information.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.vet.cornell.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  Cornell Vet - Veterinary Research
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Leading veterinary research and resources.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
              <div>
                <a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  WSAVA - Nutrition Standards
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Global veterinary nutrition guidelines.
                </p>
              </div>
            </li>
          </ul>
        </div>
      }
      onThisPage={[
        { id: 'introduction', title: 'Introduction' },
        { id: 'formula', title: 'Formula' },
        { id: 'factors', title: 'Factors Affecting Calorie Needs' },
        { id: 'faq', title: 'Frequently Asked Questions' },
        { id: 'references', title: 'References' }
      ]}
      formula={{
        variables: [
          { name: 'Weight', description: 'Weight of the dog in kilograms.' },
          { name: 'Activity Factor', description: 'Multiplier based on activity level.' }
        ],
        example: {
          steps: [
            'Calculate RER using the formula: RER = 70 × (Weight in kg^0.75).',
            'Determine the activity factor based on the dog’s activity level.',
            'Calculate MER: MER = RER × Activity Factor.'
          ]
        }
      }}
      relatedCalculators={[
        {
          title: "Seed-to-Pellet Conversion Planner",
          url: "/pets/bird-seed-to-pellet-conversion-planner",
          icon: "🐦"
        },
        {
          title: "Cat Harness Size & Fit Guide",
          url: "/pets/cat-harness-size-fit-guide",
          icon: "🐱"
        },
        {
          title: "Nail Trim Interval Planner (activity/surface based)",
          url: "/pets/cat-nail-trim-interval-planner",
          icon: "✂️"
        },
        {
          title: "Horse Body Condition Score Helper (Henneke 1–9)",
          url: "/pets/horse-body-condition-score-henneke",
          icon: "🐴"
        }
      ]}
    />
  );
}

export default DogCalorieNeedsRerMerCalculator;