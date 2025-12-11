import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  const [inputs, setInputs] = useState({ weight: '', heightFeet: '', heightInches: '', heightCm: '' });
  const [unit, setUnit] = useState('imperial');

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    let height = 0;

    if (unit === 'imperial') {
      const heightFeet = parseFloat(inputs.heightFeet);
      const heightInches = parseFloat(inputs.heightInches);
      height = heightFeet * 12 + heightInches;
      return weight && height ? (703 * weight) / (height * height) : null;
    } else {
      height = parseFloat(inputs.heightCm) / 100;
      return weight && height ? weight / (height * height) : null;
    }
  }, [inputs, unit]);

  const bmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obesity";
  };

  const faqs = [ 
    { question: "What is BMI?", answer: "BMI is a measure of body fat based on height and weight." }, 
    { question: "How is BMI calculated?", answer: "BMI is calculated using weight and height." }, 
    { question: "What is a healthy BMI range?", answer: "A healthy BMI range is 18.5 to 24.9." },
    { question: "Can BMI be inaccurate?", answer: "Yes, BMI does not account for muscle mass." } 
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Calculator className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Unit</Label>
            <Button onClick={() => setUnit(unit === 'imperial' ? 'metric' : 'imperial')}>
              {unit === 'imperial' ? 'Switch to Metric' : 'Switch to Imperial'}
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</Label>
            <Input
              type="number"
              value={inputs.weight}
              onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            />
          </div>
          {unit === 'imperial' ? (
            <>
              <div className="space-y-2">
                <Label>Height (Feet)</Label>
                <Input
                  type="number"
                  value={inputs.heightFeet}
                  onChange={(e) => setInputs({ ...inputs, heightFeet: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (Inches)</Label>
                <Input
                  type="number"
                  value={inputs.heightInches}
                  onChange={(e) => setInputs({ ...inputs, heightInches: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={inputs.heightCm}
                onChange={(e) => setInputs({ ...inputs, heightCm: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" onClick={() => setInputs({ weight: '', heightFeet: '', heightInches: '', heightCm: '' })}>Reset</Button>
      </div>

      {results !== null && (
        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {results.toFixed(1)}
              </p>
              <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300">
                {bmiCategory(results)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your weight and height to calculate your BMI. Use the toggle to switch between imperial and metric units.
        </p>
      </section>
      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>
      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">CDC - About Adult BMI</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Information on BMI from the Centers for Disease Control and Prevention.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">WHO - Obesity and Overweight</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">World Health Organization's fact sheet on obesity and overweight.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">NHLBI - BMI Calculator</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">BMI calculator from the National Heart, Lung, and Blood Institute.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'how-to-use', label: 'How to Use This Calculator' },
        { id: 'formula', label: 'Formula Used' },
        { id: 'example', label: 'Example Calculation' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'references', label: 'References & Resources' }
      ]}
      formula={{ title: "Formula Used", formula: "BMI = weight (kg) / height (m)^2", variables: [] }}
      example={{ title: "Example Calculation", scenario: "A person weighing 70 kg and 1.75 m tall.", steps: ["Calculate height in meters squared: 1.75 * 1.75 = 3.0625", "Divide weight by height squared: 70 / 3.0625 = 22.86"], result: "22.86" }}
      relatedCalculators={[{"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"❤️"},{"title":"TDEE — Total Daily Energy Expenditure Calculator","url":"/health/tdee-daily-energy-expenditure","icon":"🧮"},{"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"🧍"},{"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},{"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🧍"},{"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧍"}]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}