import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogPregnancyGestationDueDateCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    breedingDate: "",
    breedingDateType: "first", // "first" or "last"
  });

  // 2. LOGIC ENGINE
  // Dog gestation length: average 63 days (range 58-68 days)
  // We calculate due date by adding 63 days to breeding date (first or last breeding)
  // If last breeding date is used, due date = last breeding date + 63 days
  // If first breeding date is used, due date = first breeding date + 63 days

  const results = useMemo(() => {
    if (!inputs.breedingDate) {
      return {
        value: "",
        label: "Enter a valid breeding date to calculate due date.",
        subtext: null,
        warning: null,
      };
    }

    const breedingDateObj = new Date(inputs.breedingDate);
    if (isNaN(breedingDateObj.getTime())) {
      return {
        value: "",
        label: "Invalid date format. Please enter a valid date.",
        subtext: null,
        warning: null,
      };
    }

    // Add 63 days to breeding date
    const gestationDays = 63;
    const dueDateObj = new Date(breedingDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + gestationDays);

    // Format due date as YYYY-MM-DD for display
    const dueDateStr = dueDateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      value: dueDateStr,
      label:
        inputs.breedingDateType === "first"
          ? "Estimated due date based on first breeding date."
          : "Estimated due date based on last breeding date.",
      subtext:
        "Note: Gestation length in dogs averages 63 days but can vary between 58 and 68 days. This estimate helps plan veterinary care and prepare for whelping.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is the gestation period in dogs considered to be approximately 63 days?",
      answer:
        "The gestation period in dogs is approximately 63 days from conception to birth, which is well-established through veterinary research and clinical observation. This period can vary slightly depending on the breed, litter size, and individual dog health. Understanding this timeframe helps veterinarians and breeders anticipate the whelping date and monitor the pregnancy for any complications.",
    },
    {
      question: "How does using the first versus last breeding date affect the due date calculation?",
      answer:
        "Using the first breeding date assumes conception occurred at the start of the breeding period, while using the last breeding date assumes conception occurred later. Since dogs can mate multiple times during estrus, the actual fertilization may happen at any point. Calculating from the last breeding date generally provides a more accurate due date, but both methods offer useful estimates for planning veterinary care.",
    },
    {
      question: "Can the gestation length vary among different dog breeds or sizes?",
      answer:
        "Yes, gestation length can vary slightly among breeds and sizes, though the average remains around 63 days. Smaller breeds may have slightly shorter gestations, while larger breeds might experience longer ones. However, these differences are usually within a few days. Monitoring the pregnant dog closely and consulting a veterinarian ensures timely intervention if labor is delayed or premature.",
    },
    {
      question: "Why is it important to accurately estimate the due date in pregnant dogs?",
      answer:
        "Accurately estimating the due date is crucial for preparing appropriate prenatal care, scheduling veterinary check-ups, and ensuring a safe whelping environment. It allows owners and vets to monitor fetal development, detect potential complications early, and plan for emergency interventions if necessary. Proper timing also helps in managing nutrition and exercise to support a healthy pregnancy and delivery.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, breedingDate: e.target.value }));
  }
  function handleBreedingDateTypeChange(value: string) {
    setInputs((prev) => ({ ...prev, breedingDateType: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher (not needed here but kept for consistency) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Breeding Date Type</Label>
          <Select value={inputs.breedingDateType} onValueChange={handleBreedingDateTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">First Breeding Date</SelectItem>
              <SelectItem value="last">Last Breeding Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300">
            Enter {inputs.breedingDateType === "first" ? "First" : "Last"} Breeding Date
          </Label>
          <Input
            id="breedingDate"
            type="date"
            value={inputs.breedingDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className="mt-1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ breedingDate: "", breedingDateType: "first" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
          Understanding Dog Pregnancy (Gestation) Due-Date Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dog pregnancy, also known as gestation, typically lasts about 63 days from conception to birth. This calculator estimates the expected due date by adding the average gestation length to the date of breeding. Since dogs can mate multiple times during their heat cycle, the calculator allows you to select whether you want to use the first or last breeding date to improve accuracy. Understanding the timing of gestation is essential for preparing for whelping and ensuring the health of both the mother and puppies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The gestation period can vary slightly between individual dogs and breeds, generally ranging from 58 to 68 days. Factors such as litter size, maternal health, and breed characteristics influence this variability. This tool provides a scientifically grounded estimate to help breeders and pet owners plan veterinary visits, nutritional adjustments, and birthing preparations. It is important to remember that this calculator provides an estimate and that veterinary consultation is necessary for precise monitoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this calculator, you gain a clearer understanding of your dog's pregnancy timeline, enabling timely interventions if complications arise. Early and accurate prediction of the due date supports better prenatal care, reduces stress for the dam, and improves the chances of a successful whelping. This tool is designed to complement veterinary advice and should not replace professional medical evaluation.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog's due date, follow these simple steps. First, determine whether you want to calculate based on the first or last breeding date during the heat cycle. This choice affects the precision of the estimate, with the last breeding date often providing a closer approximation to conception. Next, enter the selected breeding date using the date picker input. Once entered, click the calculate button to generate the estimated due date. The result will display the expected whelping day, along with contextual information about gestation length.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Breeding Date Type:</strong> Select whether you are entering the first or last breeding date to tailor the calculation to your dog's breeding history.
          </li>
          <li>
            <strong>Breeding Date:</strong> Input the exact date of the selected breeding event in the YYYY-MM-DD format using the date picker for accuracy.
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
              href="https://www.merckvetmanual.com/reproductive-system/pregnancy-in-dogs-and-cats/gestation-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Gestation in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of canine gestation, including length, physiology, and clinical considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/pregnancy-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell University College of Veterinary Medicine - Canine Pregnancy
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing canine pregnancy stages, care, and expected gestation length.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.acvs.org/small-animal/normal-pregnancy-in-the-dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American College of Veterinary Surgeons - Normal Pregnancy in the Dog
            </a>
            <p className="text-slate-500 text-sm">
              Expert insights into normal canine pregnancy, gestational timing, and clinical management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetstream.com/treat/felis-catus/reproductive-system/pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Vetstream - Canine Pregnancy and Parturition
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary reference covering canine reproductive physiology, pregnancy duration, and whelping.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Pregnancy (Gestation) Due-Date Calculator"
      description="Calculate the expected **due date** for a pregnant dog based on the date of first or last breeding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Due Date = Breeding Date + 63 days",
        variables: [
          { symbol: "Breeding Date", description: "Date of first or last breeding during estrus" },
          { symbol: "63 days", description: "Average gestation length in dogs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeder notes that the last breeding date of a female Labrador Retriever was March 1, 2024. They want to estimate the expected whelping date to prepare the whelping area and schedule veterinary check-ups.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Last Breeding Date' as the breeding date type since multiple matings occurred.",
          },
          {
            label: "Step 2",
            explanation: "Enter the date '2024-03-01' into the breeding date field and click Calculate.",
          },
        ],
        result: "The calculator estimates the due date as April 3, 2024, allowing the breeder to plan accordingly.",
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
        { id: "what-is", label: "Understanding Dog Pregnancy (Gestation) Due-Date Calculator" },
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