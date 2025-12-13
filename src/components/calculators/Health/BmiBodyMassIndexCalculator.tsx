import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// ATOMIC IMPORTS
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertCircle, Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  const [unit, setUnit] = useState("metric");
  const [inputs, setInputs] = useState({ 
    age: "", 
    gender: "male",
    weight: "", 
    heightMetric: "", 
    heightFt: "", 
    heightIn: "",
  });

  // --- LOGIC ENGINE ---
  const results = useMemo(() => {
    const age = parseFloat(inputs.age);
    const weightRaw = parseFloat(inputs.weight);
    
    // Height Conversion
    let heightCm = 0;
    if (unit === "metric") {
       heightCm = parseFloat(inputs.heightMetric);
    } else {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       heightCm = ((ft * 12) + inch) * 2.54;
    }

    // Weight Conversion to Kg
    let weightKg = unit === "metric" ? weightRaw : weightRaw / 2.20462;

    // Validation
    if (!weightRaw || !heightCm || weightRaw <= 0 || heightCm <= 0) {
       return { value: 0, label: "Enter your details...", category: "" };
    }

    // BMI Calculation: kg / (m^2)
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiFinal = parseFloat(bmi.toFixed(1));

    // Determine Category
    let category = "";
    if (bmiFinal < 18.5) category = "Underweight";
    else if (bmiFinal < 25) category = "Normal weight";
    else if (bmiFinal < 30) category = "Overweight";
    else if (bmiFinal < 35) category = "Obesity Class I";
    else if (bmiFinal < 40) category = "Obesity Class II";
    else category = "Obesity Class III";

    return { 
      value: bmiFinal, 
      label: "BMI Score",
      category: category
    };
  }, [inputs, unit]);

  // --- CONTENT DATA ---
  const faqs = [
    { 
      question: "What is BMI?", 
      answer: "Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI = kg/m2 where kg is a person's weight in kilograms and m2 is their height in meters squared. It is used to screen for weight categories that may lead to health problems." 
    },
    { 
      question: "Is BMI accurate for athletes?", 
      answer: "Not always. Because BMI does not distinguish between weight from fat and weight from muscle, muscular athletes may have a high BMI that classifies them as overweight or obese, even though their body fat percentage is low." 
    },
    { 
      question: "What is a 'Normal' BMI?", 
      answer: "For most adults, a BMI between 18.5 and 24.9 is considered to be within the healthy or normal weight range. A BMI below 18.5 is considered underweight, and a BMI of 25.0 or higher is considered overweight." 
    },
    { 
      question: "Does age affect BMI interpretation?", 
      answer: "Standard BMI categories are used for adults 20 years and older. For children and teens, BMI is interpreted differently using percentiles based on age and sex (BMI-for-age) because the amount of body fat changes with age." 
    },
    { 
      question: "What are the health risks of high BMI?", 
      answer: "People who are overweight or obese are at increased risk for many diseases and health conditions, including high blood pressure, Type 2 diabetes, coronary heart disease, stroke, and osteoarthritis." 
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit & Gender Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Biological Sex</Label>
          <Select value={inputs.gender} onValueChange={(v) => setInputs({...inputs, gender: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Age & Weight Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Age</Label>
          <Input 
            type="number" 
            min="2" 
            max="120"
            value={inputs.age} 
            onChange={(e) => setInputs({...inputs, age: e.target.value})} 
            placeholder="Years" 
            aria-label="Age in years"
          />
        </div>
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Weight</Label>
          <Input 
            type="number" 
            min="1" 
            value={inputs.weight} 
            onChange={(e) => setInputs({...inputs, weight: e.target.value})} 
            placeholder={unit === "metric" ? "kg" : "lbs"} 
            aria-label={`Weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
          />
        </div>
      </div>

      {/* Height Row */}
      <div>
        <Label className="mb-2 block text-slate-700 dark:text-slate-300">Height</Label>
        {unit === "metric" ? (
          <Input 
            type="number" 
            min="1" 
            value={inputs.heightMetric} 
            onChange={(e) => setInputs({...inputs, heightMetric: e.target.value})} 
            placeholder="Centimeters" 
            aria-label="Height in centimeters"
          />
        ) : (
          <div className="flex gap-4">
            <Input 
              type="number" 
              min="0" 
              value={inputs.heightFt} 
              onChange={(e) => setInputs({...inputs, heightFt: e.target.value})} 
              placeholder="Feet" 
              aria-label="Height in feet"
            />
            <Input 
              type="number" 
              min="0" 
              max="11"
              value={inputs.heightIn} 
              onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} 
              placeholder="Inches" 
              aria-label="Height in inches"
            />
          </div>
        )}
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate BMI
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setInputs({age: "", weight: "", heightMetric: "", heightFt: "", heightIn: "", gender: "male"})} 
          className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" role="region" aria-live="polite" aria-atomic="true">
           <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 border-emerald-200 dark:border-teal-900 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-3 uppercase tracking-wider">{results.label}</p>
                 <p className="text-6xl font-extrabold text-emerald-900 dark:text-emerald-50 leading-none mb-2">{results.value}</p>
                 <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-emerald-800 dark:text-emerald-300 font-bold text-lg">{results.category}</p>
                 </div>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
              <p>This result is a screening tool, not a diagnosis. BMI does not account for muscle mass, bone density, or fat distribution. Consult a healthcare provider for a full assessment.</p>
           </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            To calculate your Body Mass Index (BMI), simply enter your weight and height. You can choose between Metric (kg/cm) or Imperial (lbs/feet) units. While age and gender are requested for context, the standard adult BMI calculation primarily relies on height and weight.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Once you click calculate, you will receive your BMI score along with a classification ranging from "Underweight" to "Obesity". Use this number as a starting point to understand your weight status, but remember it is a general indicator and not a direct measure of body fat or health.
         </p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            The Body Mass Index is calculated by dividing a person's weight in kilograms by the square of their height in meters. It is a widely used metric because it is non-invasive and easy to obtain.
         </p>
         <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg my-6 font-mono text-center">
            <p className="text-lg font-bold mb-2">Metric Formula</p>
            <p className="text-slate-600 dark:text-slate-400">BMI = weight (kg) / [height (m)]²</p>
         </div>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            For the imperial system (pounds and inches), the formula includes a conversion factor of 703: <strong>BMI = 703 × weight (lbs) / [height (in)]²</strong>. This calculator automatically handles the conversions for you regardless of which unit system you select.
         </p>
      </section>

      <section id="categories" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">BMI Categories</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">The standard weight status categories associated with BMI ranges for adults are:</p>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Below 18.5:</strong> Underweight</li>
            <li><strong>18.5 – 24.9:</strong> Normal weight</li>
            <li><strong>25.0 – 29.9:</strong> Overweight</li>
            <li><strong>30.0 and above:</strong> Obesity</li>
         </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Limitations of BMI</h2>
         <ul className="list-none space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-emerald-600 shrink-0" />
               <div>
                 <strong>Muscle Mass:</strong> Athletes and bodybuilders may have a BMI in the "overweight" or "obese" range because muscle weighs more than fat by volume. In these cases, BMI may not accurately reflect health risks.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-emerald-600 shrink-0" />
               <div>
                 <strong>Bone Density & Age:</strong> Older adults often lose muscle and bone density, which may lower their BMI even if they have excess body fat. Conversely, dense bones can slightly elevate BMI.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-emerald-600 shrink-0" />
               <div>
                 <strong>Fat Distribution:</strong> BMI does not indicate where fat is stored. Visceral fat (around the abdomen) poses greater health risks than subcutaneous fat, yet two people with the same BMI could have very different fat distributions.
               </div>
            </li>
         </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
         <ul className="space-y-6">
            {faqs.map((item, i) => (
              <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.answer}</p>
              </li>
            ))}
         </ul>
      </section>

      <section id="references" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & additional resources</h2>
         <ul className="space-y-3">
           <li className="mb-4">
             <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline block text-lg">
               World Health Organization: Obesity and Overweight
             </a>
             <p className="text-slate-500 text-sm">
               Global facts and data regarding obesity, its health consequences, and the definition of BMI standards.
             </p>
           </li>
           <li className="mb-4">
             <a href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline block text-lg">
               CDC: About Adult BMI
             </a>
             <p className="text-slate-500 text-sm">
               The Centers for Disease Control and Prevention provides a comprehensive guide on interpreting BMI and its limitations.
             </p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Quickly calculate your Body Mass Index (BMI) to screen for potential weight-related health issues. Input your height and weight to see if you fall into the underweight, healthy, overweight, or obese category based on World Health Organization guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Standard Formula", 
        formula: "BMI = weight (kg) / height (m)²", 
        variables: [
           { symbol: "weight", description: "Body weight in kilograms" },
           { symbol: "height", description: "Height in meters" }
        ] 
      }}
      example={{ 
        title: "Calculation Example", 
        scenario: "A person weighing 80 kg with a height of 1.80 meters.",
        steps: [
           { label: "Step 1", explanation: "Square the height: 1.80 × 1.80 = 3.24 m²" },
           { label: "Step 2", explanation: "Divide weight by squared height: 80 / 3.24 = 24.69" } 
        ],
        result: "The BMI is 24.7, which falls into the 'Normal weight' category."
      }}
      relatedCalculators={[
        {title:"TDEE — Total Daily Energy Expenditure Calculator",url:"/health/tdee-daily-energy-expenditure",icon:"🔥"},
        {title:"BMR — Basal Metabolic Rate",url:"/health/bmr-mifflin-st-jeor",icon:"⚖️"},
        {title:"Body Fat % (US Navy / 3-sites)",url:"/health/body-fat-us-navy-3-sites",icon:"❤️"},
        {title:"Ideal Weight Range",url:"/health/ideal-weight-range-hamwi-devine-miller",icon:"💧"},
        {title:"Waist-to-Height Ratio",url:"/health/waist-to-height-ratio",icon:"🥗"},
        {title:"Body Surface Area (BSA)",url:"/health/body-surface-area-bsa",icon:"😴"}
      ]}
      onThisPage={[ 
        {id: "how-to-use", label: "How to use this calculator"},
        {id: "formula", label: "The formula behind the math"},
        {id: "categories", label: "BMI Categories"},
        {id: "factors", label: "Limitations of BMI"},
        {id: "faq", label: "Frequently asked questions"},
        {id: "references", label: "References & resources"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
