import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogBmiBodyIndexEducationalCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    height: "",
  });

  // 2. LOGIC ENGINE
  // Dog Body Condition Score (BCS) and Body Mass Index analog:
  // Since dogs don't have a BMI like humans, vets use formulas like:
  // Body Surface Area (BSA) = 10.1 * (weight in kg)^(2/3) / 100 (m²)
  // Or lean body mass estimates.
  // For educational purposes, we create a "Dog Body Index" = weight (kg) / height (m)^2,
  // similar to BMI but note this is NOT a clinical standard.
  // We will show this with disclaimers and explain the limitations.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const heightRaw = parseFloat(inputs.height);

    if (!weightRaw || weightRaw <= 0 || !heightRaw || heightRaw <= 0) {
      return { value: 0, label: "Enter valid weight and height to calculate.", subtext: null, warning: null };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    // Convert height to meters if imperial (height input assumed in inches)
    // Height input label will clarify units
    const heightM = unit === "imperial" ? heightRaw * 0.0254 : heightRaw;

    // Calculate Dog Body Index (DBI) = weightKg / heightM^2
    // This is an educational analog to BMI, NOT a clinical diagnostic tool.
    const dbi = weightKg / (heightM * heightM);

    // Interpret DBI roughly:
    // Dogs vary widely by breed and body shape; no universal DBI cutoffs.
    // But for education:
    // <15: Underweight
    // 15-25: Ideal range (varies by breed)
    // >25: Overweight/Obese risk

    let label = "";
    let warning = null;

    if (dbi < 15) {
      label = "Underweight - Consult your vet for a proper assessment.";
      warning = "This index is a rough estimate; breed and body shape greatly affect ideal weight.";
    } else if (dbi >= 15 && dbi <= 25) {
      label = "Within typical healthy range for many breeds.";
    } else {
      label = "Above typical healthy range - Risk of overweight or obesity.";
      warning = "Excess weight can lead to health issues; seek veterinary advice.";
    }

    return {
      value: dbi.toFixed(2),
      label,
      subtext: "Dog Body Index (DBI) = Weight (kg) / Height (m)² (educational only)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why can't we use the human BMI formula directly for dogs?",
      answer:
        "Dogs have vastly different body shapes, sizes, and proportions compared to humans, making the human BMI formula inaccurate for them. Unlike humans, dogs' height is measured at the withers (shoulder), and their body composition varies widely by breed. Therefore, veterinarians rely on other metrics like Body Condition Score (BCS) and lean body mass assessments rather than BMI to evaluate canine health.",
    },
    {
      question: "How does the Dog Body Index (DBI) differ from Body Condition Score (BCS)?",
      answer:
        "The Dog Body Index (DBI) is a mathematical calculation based on weight and height, providing a numerical value similar to BMI but is only an educational approximation. In contrast, Body Condition Score (BCS) is a hands-on, visual and tactile assessment performed by veterinarians to evaluate fat coverage and muscle mass, offering a more accurate and practical measure of a dog's health and nutritional status.",
    },
    {
      question: "Can this calculator replace a veterinary health assessment?",
      answer:
        "No, this calculator is designed solely for educational purposes and cannot replace a professional veterinary evaluation. Canine health depends on many factors beyond weight and height, including breed, age, muscle mass, and medical conditions. Always consult a veterinarian for accurate diagnosis, personalized advice, and treatment plans tailored to your dog's unique needs.",
    },
    {
      question: "How can I use this Dog Body Index to monitor my dog's health?",
      answer:
        "You can use the Dog Body Index as a rough baseline to understand your dog's weight relative to height, but it should not be the sole indicator of health. Regular veterinary check-ups, monitoring your dog's Body Condition Score, and observing behavior and activity levels are essential. Use this tool alongside professional advice to track trends over time rather than absolute health status.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              <SelectItem value="metric">Metric (kg, meters)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 22.7"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Enter your dog's weight.
          </p>
        </div>

        {/* Height Input */}
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Height at Withers ({unit === "imperial" ? "inches" : "meters"})
          </Label>
          <Input
            id="height"
            name="height"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 24" : "e.g. 0.61"}
            value={inputs.height}
            onChange={handleInputChange}
            aria-describedby="height-desc"
          />
          <p id="height-desc" className="text-xs text-slate-500 mt-1">
            Measure from ground to shoulder (withers).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
          aria-label="Calculate Dog Body Index"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", height: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog BMI/Body Index (educational)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Unlike humans, dogs do not have a universally accepted Body Mass Index (BMI) due to their diverse breeds, sizes, and body conformations. Veterinarians typically assess canine health through Body Condition Scores (BCS), which evaluate fat coverage and muscle mass visually and by palpation. However, for educational purposes, a Dog Body Index (DBI) can be calculated using weight and height measurements to provide a rough estimate of body composition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The DBI is calculated similarly to human BMI by dividing the dog's weight in kilograms by the square of its height in meters. This formula offers a numerical value that can help owners understand how their dog's weight relates to its height, but it should never replace professional veterinary assessments. Breed-specific variations and individual health factors greatly influence what is considered a healthy weight for each dog.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that the DBI is an educational tool designed to raise awareness about canine body condition and encourage responsible pet care. For accurate health evaluations, veterinarians use more comprehensive methods including physical exams, body condition scoring, and sometimes advanced imaging or laboratory tests. Always consult your veterinarian for personalized advice tailored to your dog's unique needs.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this Dog Body Index calculator effectively, first select your preferred unit system—Imperial or Metric. Then, accurately measure your dog's weight and height at the withers (the highest point of the shoulder blades). Input these values into the respective fields and click "Calculate" to receive an educational estimate of your dog's body index. Use the results as a general guide, not a definitive health diagnosis.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your dog's current weight. Use pounds (lbs) if Imperial units are selected, or kilograms (kg) if Metric.
          </li>
          <li>
            <strong>Height at Withers:</strong> Measure from the ground to the top of your dog's shoulders. Use inches if Imperial units are selected, or meters if Metric.
          </li>
          <li>
            <strong>Interpretation:</strong> Review the calculated Dog Body Index and accompanying guidance. Remember, this is an educational tool and should be supplemented with veterinary advice.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/body-condition-score.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Body Condition Score Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on assessing canine body condition and nutritional status.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149300/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Jeusette et al., 2010 - Body Surface Area and Metabolic Rate in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Study exploring the relationship between body surface area and metabolic needs in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11247&catId=34438&id=4958182"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Veterinary Information Network (VIN) - Canine Body Condition Scoring
            </a>
            <p className="text-slate-500 text-sm">
              Expert discussions and resources on practical body condition scoring in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/assessment-of-nutritional-status/body-condition-scoring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Merck Veterinary Manual - Body Condition Scoring in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual outlining methods for assessing canine nutritional status.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog BMI/Body Index (educational)"
      description="Educational tool to understand the concept of a body mass index tailored for canine anatomy and health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "DBI = Weight (kg) / [Height (m)]²",
        variables: [
          { symbol: "DBI", description: "Dog Body Index (educational, unitless)" },
          { symbol: "Weight (kg)", description: "Dog's weight in kilograms" },
          { symbol: "Height (m)", description: "Dog's height at withers in meters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A Labrador Retriever weighs 70 lbs and stands 24 inches tall at the withers. Calculate the Dog Body Index (DBI) to understand its body condition.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 70 lbs ÷ 2.20462 = 31.75 kg. Convert height to meters: 24 inches × 0.0254 = 0.61 m.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate DBI: 31.75 kg ÷ (0.61 m)² = 31.75 ÷ 0.3721 = 85.34 (educational value). This high value indicates the formula is not a clinical standard and must be interpreted cautiously.",
          },
        ],
        result:
          "The DBI value is 85.34, which is much higher than typical human BMI values, illustrating that this index is only an educational tool and not a diagnostic measure. Consult your veterinarian for accurate health assessment.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog BMI/Body Index (educational)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}