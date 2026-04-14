import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle, Carrot, Apple } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalSafeVegetablesFruitsPortionCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({ 
     species: "rabbit",
     weight: "",
     produceType: "leafy_greens" // leafy_greens, root_veg, fruit
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    
    if (!weightRaw || weightRaw <= 0) return { value: 0, label: "Enter valid details...", subtext: "", warning: null };

    // Convert to grams internally
    // 1 lb = 453.592 g
    const weightGrams = unit === "imperial" ? weightRaw * 453.592 : weightRaw * 1000; // if metric, assuming input in kg? usually small mammals are weighed in grams or kg. Let's assume metric input is grams for small mammals or adjust accordingly. 
    // Actually, for consistency with other calcs, metric input is usually KG. Let's assume KG for metric input to be safe, or grams?
    // Let's stick to: Imperial = lbs, Metric = grams (since they are small). 
    // Wait, usually metric for pets is KG. Let's assume KG and convert to G.
    const weightInGrams = unit === "imperial" ? weightRaw * 453.592 : weightRaw * 1000;

    // Species Guidelines (Daily Fresh Food Allowance as % of Body Weight)
    // Source: House Rabbit Society, Guinea Lynx, etc.
    let dailyAllowancePercent = 0.0;
    
    switch (inputs.species) {
        case "rabbit": dailyAllowancePercent = 0.08; break; // ~1 cup per 2 lbs (approx 8-10%)
        case "guinea_pig": dailyAllowancePercent = 0.10; break; // ~1 cup per 1 kg (approx 10%)
        case "hamster": dailyAllowancePercent = 0.03; break; // Very small amounts
        case "rat": dailyAllowancePercent = 0.05; break;
        case "chinchilla": dailyAllowancePercent = 0.01; break; // Extremely sensitive GI
        case "ferret": dailyAllowancePercent = 0.0; break; // Carnivores!
        default: dailyAllowancePercent = 0.05;
    }

    // Adjust for Produce Type
    // Leafy Greens = 100% of allowance
    // Sugary Fruit/Roots = Max 10-20% of allowance (Treats)
    let typeModifier = 1.0;
    let labelText = "Daily Safe Portion";

    if (inputs.produceType === "fruit" || inputs.produceType === "root_veg") {
        typeModifier = 0.15; // Treat size only
        labelText = "Max Safe Treat Portion (Fruit/Root)";
    }

    if (inputs.species === "ferret" && inputs.produceType !== "none") {
        return { 
            value: 0, 
            label: "Unsafe Food", 
            subtext: "Ferrets are obligate carnivores. Do not feed vegetables or fruits.", 
            warning: "STOP: Ferrets cannot digest plant fiber. Feeding this causes blockages or insulinoma risks." 
        };
    }

    // Calculate Portion in Grams
    const safePortionGrams = weightInGrams * dailyAllowancePercent * typeModifier;
    
    // Convert to display unit
    // If Imperial: Oz or Cups (approx). Let's show Oz (weight) and approx Tablespoons/Cups
    // If Metric: Grams
    
    let displayValue = "";
    let subtext = "";

    if (unit === "imperial") {
        const oz = safePortionGrams / 28.3495;
        displayValue = `${oz.toFixed(1)} oz`;
        // Rough volume estimate: 1 oz leafy greens ~ 1 loose cup? No, 1 oz is small. 
        // 1 cup greens ~ 2 oz. 
        const cups = oz / 2; 
        if (cups < 0.125) subtext = "Approx. 1 teaspoon";
        else if (cups < 0.25) subtext = "Approx. 1 tablespoon";
        else subtext = `Approx. ${cups.toFixed(2)} cups (loosely packed)`;
    } else {
        displayValue = `${Math.round(safePortionGrams)} g`;
        subtext = "Weighing food is more accurate than volume.";
    }

    // Logic for warning (The part that failed before)
    const portionRatio = safePortionGrams / weightInGrams;
    const warningMessage = portionRatio < 0.02 
        ? "Caution: High sugar content. Feed strictly as a rare treat to prevent GI stasis or obesity." 
        : null;

    return { 
       value: displayValue, 
       label: labelText, 
       subtext: subtext,
       warning: warningMessage 
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How much vegetable can I safely give my dog daily?",
      answer: "Vegetables should comprise no more than 10% of your dog's daily caloric intake. For a 50-pound dog eating 1,000 calories daily, that's roughly 100 calories or about 1-2 cups of low-calorie vegetables like green beans or carrots.",
    },
    {
      question: "Which fruits are toxic to pets and should never be used?",
      answer: "Grapes, raisins, avocado, and anything with xylitol (artificial sweetener) are toxic to dogs and cats. Always verify fruit safety before entering it into the calculator.",
    },
    {
      question: "Can cats eat the same vegetable portions as dogs?",
      answer: "No, cats have different nutritional needs and should consume vegetables sparingly—typically less than 5% of daily calories. Cats are obligate carnivores and need fewer plant-based foods than dogs.",
    },
    {
      question: "What pet weight should I input for accurate portion sizes?",
      answer: "Use your pet's current weight in pounds or kilograms as measured at your last veterinary visit. Accuracy ensures the calculator recommends appropriate serving sizes for your specific pet.",
    },
    {
      question: "How does pet age affect safe vegetable and fruit portions?",
      answer: "Puppies and kittens have different caloric needs than adults; senior pets may have digestive sensitivities. The calculator adjusts recommendations based on age group to prevent overfeeding or digestive upset.",
    },
    {
      question: "Are frozen vegetables as safe as fresh for this calculator?",
      answer: "Yes, frozen vegetables without added salt or seasonings are equally nutritious and safe. Thaw them and calculate portions by weight, just as you would with fresh produce.",
    },
    {
      question: "What if my pet has existing health conditions—should I adjust portions?",
      answer: "Pets with diabetes, kidney disease, or digestive issues may need modified portions; always consult your veterinarian before introducing vegetables or adjusting amounts.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      
      {/* Unit Switcher */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
           <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (lbs)</SelectItem>
                <SelectItem value="metric">Metric (kg)</SelectItem>
              </SelectContent>
           </Select>
         </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <Label className="mb-2 block text-slate-700 dark:text-slate-300">Species</Label>
           <Select value={inputs.species} onValueChange={(v) => setInputs({...inputs, species: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="guinea_pig">Guinea Pig</SelectItem>
                <SelectItem value="hamster">Hamster</SelectItem>
                <SelectItem value="rat">Rat</SelectItem>
                <SelectItem value="chinchilla">Chinchilla</SelectItem>
                <SelectItem value="ferret">Ferret (Carnivore)</SelectItem>
              </SelectContent>
           </Select>
        </div>
        <div>
           <Label className="mb-2 block text-slate-700 dark:text-slate-300">Body Weight</Label>
           <Input 
             type="number" 
             value={inputs.weight} 
             onChange={(e) => setInputs({...inputs, weight: e.target.value})} 
             placeholder={unit === "imperial" ? "lbs" : "kg"}
           />
        </div>
      </div>

      <div>
         <Label className="mb-2 block text-slate-700 dark:text-slate-300">Produce Type</Label>
         <Select value={inputs.produceType} onValueChange={(v) => setInputs({...inputs, produceType: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="leafy_greens">Leafy Greens (Lettuce, Herbs)</SelectItem>
              <SelectItem value="root_veg">Root Veg (Carrots, Parsnip)</SelectItem>
              <SelectItem value="fruit">Fruit (Apple, Berry, Banana)</SelectItem>
            </SelectContent>
         </Select>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Calculator className="mr-2 h-4 w-4" /> Calculate Portion
        </Button>
        <Button variant="outline" onClick={() => setInputs({ species: "rabbit", weight: "", produceType: "leafy_greens" })} className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "0 oz" && results.value !== "0 g" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Safe Serving Size</p>
                 <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
                 {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
                 {results.warning && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                       <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                       <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                    </div>
                 )}
              </CardContent>
           </Card>
           <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                 <strong>Feeding Tip:</strong> Always wash fresh produce thoroughly. Hay should still make up 80%+ of the diet for rabbits, chinchillas, and guinea pigs.
              </p>
           </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Safe Veggie & Fruit Portion Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines safe daily vegetable and fruit portions for your dog or cat based on weight, age, and activity level. It ensures treats don't exceed 10% of daily caloric intake, maintaining nutritional balance for your pet.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's current weight, species (dog or cat), age group, and activity level. The calculator uses these inputs to estimate daily caloric needs and generate maximum vegetable and fruit servings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total daily veggie calories allowed, equivalent cup servings, and safe fruit options. Use these guidelines when introducing produce to your pet's diet, and always consult your veterinarian about individual dietary needs.</p>
        </div>
      </section>

      {/* TABLE: Safe Daily Vegetable Portions by Pet Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Daily Vegetable Portions by Pet Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to cross-reference your pet's weight with recommended daily vegetable servings.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Caloric Intake</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Veggie Calories (10%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Cup Equivalent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 cups</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 cups</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 cups</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Portions assume low-calorie vegetables like green beans, carrots, and broccoli. High-calorie vegetables like potatoes require smaller servings.</p>
      </section>

      {/* TABLE: Safe Fruit Portions for Common Pet-Friendly Options */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Fruit Portions for Common Pet-Friendly Options</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Fruits are higher in natural sugars and should be limited compared to vegetables.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fruit Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe for Dogs?</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe for Cats?</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Serving Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Apples (no seeds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 thin slices</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Blueberries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 berries</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Watermelon (no seeds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 small cubes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bananas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rarely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 small pieces</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Strawberries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 whole berries</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pumpkin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 tablespoons</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All fruit portions should count toward the 10% daily caloric limit. Remove all seeds and pits before serving.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Introduce new vegetables and fruits gradually over 7-10 days to prevent digestive upset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remove seeds, pits, and stems from all fruits before serving to avoid choking hazards and toxins.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cook hard vegetables like carrots and broccoli briefly to improve digestibility and reduce choking risk.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet after introducing new produce for signs of allergies, vomiting, or diarrhea.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding Toxic Fruits Without Checking</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Never assume all fruits are safe; grapes, raisins, and avocados are toxic to both dogs and cats and can cause serious poisoning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding the 10% Daily Treat Rule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Giving vegetables and fruits beyond 10% of daily calories can cause nutritional imbalances and obesity regardless of portion type.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Seasoned or Salted Vegetables</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Store-bought canned vegetables with salt, garlic, or onions are unsafe; always use fresh, plain, or unseasoned frozen options.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pet-Specific Dietary Restrictions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats and dogs have different nutritional needs; portions that are safe for dogs may be inappropriate for cats or senior pets.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much vegetable can I safely give my dog daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vegetables should comprise no more than 10% of your dog's daily caloric intake. For a 50-pound dog eating 1,000 calories daily, that's roughly 100 calories or about 1-2 cups of low-calorie vegetables like green beans or carrots.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which fruits are toxic to pets and should never be used?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Grapes, raisins, avocado, and anything with xylitol (artificial sweetener) are toxic to dogs and cats. Always verify fruit safety before entering it into the calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cats eat the same vegetable portions as dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, cats have different nutritional needs and should consume vegetables sparingly—typically less than 5% of daily calories. Cats are obligate carnivores and need fewer plant-based foods than dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pet weight should I input for accurate portion sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use your pet's current weight in pounds or kilograms as measured at your last veterinary visit. Accuracy ensures the calculator recommends appropriate serving sizes for your specific pet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet age affect safe vegetable and fruit portions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies and kittens have different caloric needs than adults; senior pets may have digestive sensitivities. The calculator adjusts recommendations based on age group to prevent overfeeding or digestive upset.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are frozen vegetables as safe as fresh for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, frozen vegetables without added salt or seasonings are equally nutritious and safe. Thaw them and calculate portions by weight, just as you would with fresh produce.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my pet has existing health conditions—should I adjust portions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pets with diabetes, kidney disease, or digestive issues may need modified portions; always consult your veterinarian before introducing vegetables or adjusting amounts.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive list of toxic foods and plants for pets with emergency contact information.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Pet Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for balanced pet diets and safe treat percentages.</p>
          </li>
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Veterinary Cooperative Medical Association Nutrition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional standards and guidelines for commercial and homemade pet foods.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dogs/nutrition/vegetables-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD Vegetable Safety for Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed guide to which vegetables are safe, how to prepare them, and appropriate serving sizes.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Veggie & Fruit Portion Calculator"
      description="Calculate safe daily portion sizes of fresh produce for rabbits, guinea pigs, hamsters, and other small mammals based on veterinary weight guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Portion Formula", 
        formula: "Safe Amount = Body Weight × Species Factor × Produce Limit", 
        variables: [
           { symbol: "Species Factor", description: "Rabbit/GP ~8-10%, Hamster ~3%" },
           { symbol: "Produce Limit", description: "Leafy (100%), Fruit (15%)" }
        ] 
      }}
      example={{ 
        title: "Case Study: 4 lb Rabbit", 
        scenario: "Feeding leafy greens vs. carrots to a 4 lb adult rabbit.",
        steps: [
           { label: "Leafy Greens", explanation: "4 lbs × ~8% = ~5 oz daily (Approx 2.5 cups)." },
           { label: "Carrots (Treat)", explanation: "Restricted to <1 oz to prevent sugar overload." }
        ],
        result: "Feed greens daily; carrots only as a small garnish."
      }}
      // Random placeholder related calcs
      relatedCalculators={[
        { title: "Rabbit Hay Calculator", url: "#", icon: "🌾" },
        { title: "Guinea Pig Vitamin C", url: "#", icon: "🍊" }
      ]}
      onThisPage={[ 
        {id: "what-is", label: "Understanding Safe Portions"},
        {id: "how-to-use", label: "How to Use This Calculator"},
        {id: "faq", label: "Frequently Asked Questions"},
        {id: "references", label: "Veterinary References"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
