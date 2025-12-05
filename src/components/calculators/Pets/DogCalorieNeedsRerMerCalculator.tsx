import React, { useState, useMemo, useRef } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { Button, Input, Label } from 'components/ui';
import CalculatorVerticalLayout from 'layouts/CalculatorVerticalLayout';

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({ weight: '' });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    if (isNaN(weight) || weight <= 0) return null;

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * 1.6; // Assuming average activity level

    return { rer, mer };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleReset = () => {
    setInputs({ weight: '' });
  };

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "introduction", label: "Introduction" },
        { id: "faq", label: "Frequently Asked Questions" }
      ]}
      formula={{
        rer: "RER = 70 * (Weight in kg)^0.75",
        mer: "MER = RER * Activity Factor"
      }}
      example={{
        rer: "For a 10kg dog: RER = 70 * (10)^0.75 = 394.4 kcal/day",
        mer: "Assuming average activity: MER = 394.4 * 1.6 = 631.04 kcal/day"
      }}
      relatedCalculators={[
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "auto" },
        { title: "Dog Chocolate Toxicity Calculator", url: "/pets/dog-chocolate-toxicity", icon: "auto" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "auto" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "auto" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          {/* INPUT SECTION */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Input Details
              </h3>
            </div>
            
            {/* Input fields */}
            <div>
              <Label htmlFor="weight" className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">
                Dog's Weight (kg)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 10"
                  value={inputs.weight}
                  onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                  className="h-12 text-base pl-11 border-slate-300 dark:border-slate-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/30 rounded-xl transition-all duration-200"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-14 px-8 text-base font-bold border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
            >
              Reset
            </Button>
          </div>

          {/* RESULTS */}
          {results && results.rer > 0 && (
            <div ref={resultsRef} className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* HERO RESULT - GRADIENT */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 border-2 border-indigo-400 col-span-full shadow-2xl shadow-indigo-500/20 rounded-2xl p-8">
                  <p className="text-lg font-semibold text-indigo-100 mb-3">
                    💰 Main Result
                  </p>
                  <p className="text-5xl font-extrabold text-white tracking-tight">
                    {formatValue(results.rer)} kcal/day
                  </p>
                  <p className="text-sm text-indigo-100 mt-3">
                    Resting Energy Requirement (RER)
                  </p>
                </div>

                {/* SECONDARY RESULTS */}
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg rounded-xl p-6">
                  <p className="text-base font-bold text-slate-600 dark:text-slate-400 mb-3">
                    💸 Maintenance Energy Requirement (MER)
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {formatValue(results.mer)} kcal/day
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-10">
          <section id="introduction">
            <h2 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
              Introduction to Dog Calorie Needs
            </h2>
            <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              Understanding your dog's calorie needs is crucial for maintaining their health and well-being. The Resting Energy Requirement (RER) is the amount of energy required by your dog at rest, while the Maintenance Energy Requirement (MER) includes additional energy needed for daily activities. This calculator helps you determine these values based on your dog's weight, ensuring you provide the right amount of food for optimal health.
            </p>
          </section>

          <section id="faq">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  What is RER and why is it important?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  RER, or Resting Energy Requirement, is the amount of energy a dog needs to maintain basic bodily functions while at rest. It's crucial for calculating the baseline calorie needs of your dog, ensuring they receive enough energy for vital processes such as breathing, circulation, and cell production.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  How is MER different from RER?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  MER, or Maintenance Energy Requirement, includes the energy needed for additional activities beyond resting, such as walking, playing, and other daily activities. It provides a more comprehensive view of your dog's total daily energy needs, helping you adjust their diet to match their lifestyle.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  How can I ensure my dog maintains a healthy weight?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  To maintain a healthy weight, regularly monitor your dog's body condition and adjust their food intake based on their activity level and calorie needs. Consult with your veterinarian for personalized advice and consider using this calculator to help manage their diet effectively.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  What factors influence a dog's calorie needs?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Several factors influence a dog's calorie needs, including age, weight, breed, activity level, and overall health. Puppies and active dogs typically require more calories than older or less active dogs. Always consider these factors when determining your dog's diet.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Can I use this calculator for all dog breeds?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Yes, this calculator is designed to be used for all dog breeds. However, specific breeds may have unique dietary needs, so it's important to consult with a veterinarian for breed-specific advice, especially for dogs with special health conditions or dietary restrictions.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  How often should I recalculate my dog's calorie needs?
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  It's a good practice to recalculate your dog's calorie needs whenever there are significant changes in their weight, activity level, or health status. Regular assessments help ensure their diet remains appropriate for their current needs, promoting long-term health and vitality.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}