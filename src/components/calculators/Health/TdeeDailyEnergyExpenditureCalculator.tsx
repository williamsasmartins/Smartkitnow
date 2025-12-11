import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, User, Ruler, Flame, Check, BookOpen, HelpCircle } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TdeeDailyEnergyExpenditureCalculator() {
  // 1. STATE & LOGIC (Implement based on Logic Recipe)
  const [unit, setUnit] = useState("imperial"); 
  const [inputs, setInputs] = useState({ gender: '', age: '', height: '', weight: '', activityLevel: 1.2 }); 

  const results = useMemo(() => {
    const { gender, age, height, weight, activityLevel } = inputs;
    if (!gender || !age || !height || !weight || !activityLevel) return null;

    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    return bmr * activityLevel;
  }, [inputs, unit]);

  // 2. FAQ DATA (WRITE REAL CONTENT HERE - NO PLACEHOLDERS)
  const faqs = [
    { 
      question: "What is the difference between BMR and TDEE?", 
      answer: "BMR, or Basal Metabolic Rate, is the number of calories your body needs to maintain basic physiological functions at rest. TDEE, or Total Daily Energy Expenditure, includes BMR plus calories burned through physical activity and digestion." 
    },
    { 
      question: "How can I use TDEE for weight loss or gain?", 
      answer: "To lose weight, create a calorie deficit by consuming fewer calories than your TDEE. For weight gain, consume more calories than your TDEE to create a surplus. Adjust your intake based on your goals and monitor progress." 
    },
    { 
      question: "How accurate is this calculator?", 
      answer: "This calculator provides an estimation based on the Mifflin-St Jeor formula. While it offers a good baseline, individual variations can occur due to factors like metabolism and body composition." 
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 3. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <User className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Gender</Label>
            <Select onValueChange={(value) => setInputs(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Age</Label>
            <Input type="number" onChange={(e) => setInputs(prev => ({ ...prev, age: e.target.value }))} />
          </div>
          <div>
            <Label>Height (cm)</Label>
            <Input type="number" onChange={(e) => setInputs(prev => ({ ...prev, height: e.target.value }))} />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" onChange={(e) => setInputs(prev => ({ ...prev, weight: e.target.value }))} />
          </div>
          <div>
            <Label>Activity Level</Label>
            <Select onValueChange={(value) => setInputs(prev => ({ ...prev, activityLevel: parseFloat(value) }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Activity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                <SelectItem value="1.375">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                <SelectItem value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                <SelectItem value="1.725">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                <SelectItem value="1.9">Extra active (very hard exercise/physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({})}>Reset</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {results.toFixed(2)} Calories/Day
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 4. EDITORIAL (WRITE REAL SEO CONTENT HERE)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          <p>
            The Total Daily Energy Expenditure (TDEE) Calculator is a valuable tool for anyone looking to understand their daily caloric needs. TDEE represents the total number of calories you burn in a day, accounting for both your basal metabolic rate (BMR) and your physical activity. Knowing your TDEE can help you make informed decisions about your diet and exercise routine, whether your goal is to maintain, lose, or gain weight.
          </p>
          <p>
            To use the calculator, input your gender, age, height, weight, and activity level. The activity level ranges from sedentary to extra active, reflecting your daily physical activity. Once you provide these details, the calculator will estimate your TDEE using the Mifflin-St Jeor formula, adjusted for your activity level. This result gives you a baseline for how many calories you should consume daily to achieve your health goals.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Mifflin-St Jeor Equation: A New Predictive Equation for Resting Energy Expenditure in Healthy Individuals
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This study introduces the Mifflin-St Jeor equation, which is widely used for calculating BMR and subsequently TDEE.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Estimate your Total Daily Energy Expenditure (TDEE). Learn how many calories you need daily to maintain, lose, or gain weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'how-to-use', label: 'How to Use' },
        { id: 'formula', label: 'Formula' },
        { id: 'example', label: 'Example' },
        { id: 'faq', label: 'FAQ' },
        { id: 'references', label: 'References' }
      ]}
      formula={{ 
        title: "Formula Used", 
        formula: "BMR = 10*weight + 6.25*height - 5*age + s; TDEE = BMR * Activity Level", 
        variables: [
          { symbol: "weight", description: "Weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "s", description: "+5 for males, -161 for females" },
          { symbol: "Activity Level", description: "Multiplier based on physical activity" }
        ] 
      }}
      example={{ 
        title: "Example Calculation", 
        scenario: "A 30-year-old male, 180 cm tall, weighing 75 kg, with a moderately active lifestyle.", 
        steps: [
          { step: 1, description: "Calculate BMR", calculation: "BMR = 10*75 + 6.25*180 - 5*30 + 5 = 1755" },
          { step: 2, description: "Calculate TDEE", calculation: "TDEE = 1755 * 1.55 = 2715.25" }
        ], 
        result: "The estimated TDEE is 2715.25 Calories/Day." 
      }}
      relatedCalculators={[
        {"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},
        {"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},
        {"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"⚖️"},
        {"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},
        {"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🧮"},
        {"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧮"}
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}