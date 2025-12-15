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
      question: "Which vegetables are safe for rabbits and guinea pigs?", 
      answer: "Safe staples include Romaine lettuce, green/red leaf lettuce, cilantro, parsley, and bell peppers (high Vitamin C for guinea pigs). Avoid iceberg lettuce (low nutrition) and limit high-calcium greens like spinach if your pet has sludge/stone issues." 
    },
    { 
      question: "Can I feed fruit to my small mammal?", 
      answer: "Yes, but sparingly. Fruits like apples (no seeds), berries, and bananas are high in sugar. For rabbits and guinea pigs, fruit should be a treat (max 1-2 tsp per day), not a meal, to prevent gut bacterial imbalance." 
    },
    { 
      question: "Why can't ferrets have vegetables?", 
      answer: "Ferrets are obligate carnivores with a short digestive tract designed for meat. They lack the cecum bacteria to digest plant fiber. Feeding veggies can cause life-threatening intestinal blockages or bladder stones." 
    },
    { 
      question: "How do I introduce fresh foods?", 
      answer: "Introduce one new vegetable at a time every 3 days. Watch for soft stools or diarrhea. If digestive upset occurs, stop the new food immediately and offer unlimited timothy hay." 
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
      <section id="what-is" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Safe Produce Portions</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Small mammals have sensitive digestive systems evolved for specific diets. <strong>Herbivores</strong> like rabbits, guinea pigs, and chinchillas require high-fiber diets dominated by hay. Fresh vegetables provide hydration and vitamins, but must be strictly portioned to prevent gastrointestinal stasis or bloating.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Fruits and root vegetables</strong> (like carrots) are high in sugar and starch. While tasty, they act like candy for small pets. Excessive sugar disrupts the delicate cecal flora, leading to gas, diarrhea, and potentially fatal enterotoxemia. This calculator uses veterinary weight-based formulas to determine safe daily limits.
         </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Select your pet's species, enter their current weight, and choose the type of fresh food you plan to feed.
         </p>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Leafy Greens:</strong> Includes romaine, kale, cilantro. Can be fed in larger amounts (daily staples).</li>
            <li><strong>Root Veg & Fruit:</strong> Includes carrots, apples, berries. These are "treats" and the calculator will drastically reduce the safe portion size to protect your pet's health.</li>
         </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
         <ul className="space-y-6">
            {faqs.map((item, i) => (
              <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
              </li>
            ))}
         </ul>
      </section>

      <section id="references" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
         <ul className="space-y-4">
           <li className="block">
             <a href="https://rabbit.org/care/food-diet/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               1. House Rabbit Society
             </a>
             <p className="text-slate-500 text-sm">Guidelines for suggested vegetables and fruits for a rabbit diet.</p>
           </li>
           <li className="block">
             <a href="https://www.guinealynx.info/diet.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               2. Guinea Lynx
             </a>
             <p className="text-slate-500 text-sm">Comprehensive medical and nutritional guide for guinea pigs.</p>
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
