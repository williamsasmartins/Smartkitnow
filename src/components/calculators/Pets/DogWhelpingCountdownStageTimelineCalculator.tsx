import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog, Cat, Syringe, Skull } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWhelpingCountdownStageTimelineCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    breedingDate: "",
    gestationLength: "63", // default average gestation length in days for dogs
    currentDate: "",
  });

  // Helper to parse date strings safely
  function parseDate(dateStr: string) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const breedingDate = parseDate(inputs.breedingDate);
    const currentDate = parseDate(inputs.currentDate);
    const gestationLength = parseFloat(inputs.gestationLength);

    if (!breedingDate || !currentDate || isNaN(gestationLength) || gestationLength <= 0) {
      return {
        value: 0,
        label: "Please enter valid dates and gestation length.",
        subtext: null,
        warning: null,
      };
    }

    // Calculate days since breeding
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceBreeding = Math.floor((currentDate.getTime() - breedingDate.getTime()) / msPerDay);

    if (daysSinceBreeding < 0) {
      return {
        value: 0,
        label: "Current date cannot be before breeding date.",
        subtext: null,
        warning: null,
      };
    }

    // Calculate days until whelping
    const daysUntilWhelping = gestationLength - daysSinceBreeding;

    if (daysUntilWhelping < 0) {
      return {
        value: 0,
        label: "Whelping date has likely passed. Monitor closely.",
        subtext: null,
        warning:
          "If whelping has not occurred, consult your veterinarian immediately as overdue pregnancies can be dangerous.",
      };
    }

    // Define whelping stages timeline (typical dog labor stages)
    // Stage 1: 6-12 hours (nesting, restlessness)
    // Stage 2: Delivery of puppies (minutes to hours)
    // Stage 3: Expulsion of placentas (after each puppy)
    // We provide estimated timeline based on days until whelping

    let stageMessage = "";
    if (daysUntilWhelping > 3) {
      stageMessage =
        "The bitch is in the late gestation period. Prepare whelping area and monitor for signs of labor onset within the next few days.";
    } else if (daysUntilWhelping <= 3 && daysUntilWhelping > 0) {
      stageMessage =
        "Whelping is imminent. Watch for nesting behavior, drop in body temperature, and other pre-labor signs. Stage 1 labor may begin soon.";
    } else if (daysUntilWhelping === 0) {
      stageMessage =
        "Expected whelping day. Labor may start anytime. Be ready to assist if necessary and monitor each stage carefully.";
    }

    return {
      value: daysUntilWhelping,
      label: "Days Until Estimated Whelping",
      subtext: stageMessage,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is it important to track the whelping countdown accurately?",
      answer:
        "Tracking the whelping countdown accurately is crucial because it allows breeders and veterinarians to anticipate labor and prepare accordingly. The gestation period in dogs typically lasts around 63 days but can vary by a few days depending on breed and individual factors. Knowing the expected whelping date helps ensure timely veterinary support if complications arise, improving outcomes for both the dam and puppies.",
    },
    {
      question: "How can I recognize the different stages of labor in my dog?",
      answer:
        "Recognizing labor stages helps in providing appropriate care. Stage 1 involves nesting behavior, restlessness, and a drop in body temperature lasting 6-12 hours. Stage 2 is active labor with delivery of puppies, which can last several hours depending on litter size. Stage 3 involves expulsion of placentas after each puppy. Monitoring these stages helps detect abnormalities and decide when veterinary intervention is necessary.",
    },
    {
      question: "What should I do if my dog goes past the expected whelping date?",
      answer:
        "If your dog surpasses the expected whelping date by more than 2 days without signs of labor, it is essential to consult a veterinarian immediately. Prolonged gestation can lead to fetal distress or complications such as uterine inertia. A vet may perform diagnostic tests like ultrasound or X-rays to assess fetal viability and decide on interventions such as induction or cesarean section to ensure the safety of both mother and puppies.",
    },
    {
      question: "How does breed size affect the whelping timeline and care?",
      answer:
        "Breed size influences gestation length and whelping care. Smaller breeds may have slightly shorter gestation periods and often require more intensive monitoring due to higher risks of dystocia. Larger breeds might have longer labor stages and increased risk of complications like uterine inertia. Understanding breed-specific norms helps tailor monitoring and intervention strategies, ensuring optimal maternal and neonatal health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300">
              Breeding Date
            </Label>
            <Input
              type="date"
              id="breedingDate"
              name="breedingDate"
              value={inputs.breedingDate}
              onChange={handleInputChange}
              placeholder="Select breeding date"
            />
          </div>
          <div>
            <Label htmlFor="currentDate" className="text-slate-700 dark:text-slate-300">
              Current Date
            </Label>
            <Input
              type="date"
              id="currentDate"
              name="currentDate"
              value={inputs.currentDate}
              onChange={handleInputChange}
              placeholder="Select current date"
            />
          </div>
          <div>
            <Label htmlFor="gestationLength" className="text-slate-700 dark:text-slate-300">
              Gestation Length (days)
            </Label>
            <Input
              type="number"
              id="gestationLength"
              name="gestationLength"
              min={55}
              max={70}
              step={0.1}
              value={inputs.gestationLength}
              onChange={handleInputChange}
              placeholder="Typical: 63 days"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ breedingDate: "", currentDate: "", gestationLength: "63" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
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
          Understanding Whelping Countdown & Stage Timeline
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The whelping countdown is an essential tool for breeders and veterinarians to monitor the progress of a pregnant dog
          (bitch) as she approaches labor. The gestation period in dogs typically lasts around 63 days from the date of breeding,
          although this can vary slightly depending on breed, litter size, and individual factors. Accurately tracking this timeline
          helps ensure timely preparation for delivery and early detection of any complications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the stages of whelping is equally important. Labor in dogs is divided into three stages: Stage 1 involves
          behavioral changes such as nesting and restlessness, lasting 6 to 12 hours. Stage 2 is the active delivery of puppies,
          which can take several hours depending on litter size. Stage 3 involves the expulsion of placentas after each puppy.
          Recognizing these stages allows caretakers to provide appropriate support and identify when veterinary intervention is needed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This component integrates scientific calculations with practical timelines to estimate the days remaining until whelping
          and provide guidance on the expected labor stages. By inputting breeding and current dates along with gestation length,
          users receive a dynamic countdown and educational context, empowering them to manage the whelping process confidently and
          safely.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this whelping countdown and stage timeline calculator, begin by entering the date when the dog was
          bred. This is the starting point for calculating the gestation period. Next, input the current date to determine how many
          days have elapsed since breeding. Finally, enter the expected gestation length in days, which typically defaults to 63 days
          but can be adjusted based on breed or veterinary advice.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Breeding Date:</strong> The exact date when mating occurred or artificial insemination was performed. This
            anchors the countdown.
          </li>
          <li>
            <strong>Current Date:</strong> The date on which you want to calculate the countdown. Usually, this is today’s date but
            can be any date during the pregnancy.
          </li>
          <li>
            <strong>Gestation Length:</strong> The total expected length of pregnancy in days. The average is 63 days, but this can
            vary slightly by breed or individual.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these details, click "Calculate" to see the estimated days remaining until whelping along with contextual
          information about the current stage of pregnancy and labor preparation. Use this information to monitor your dog closely
          and prepare the whelping area accordingly.
        </p>
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
              href="https://www.merckvetmanual.com/reproductive-system/physiology-of-reproduction-in-small-animals/gestation"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              1. Merck Veterinary Manual: Physiology of Reproduction in Small Animals - Gestation
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of canine gestation, labor stages, and clinical considerations for whelping management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&id=4954389"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Veterinary Information Network (VIN): Canine Parturition and Dystocia
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical guidelines on recognizing and managing normal and abnormal whelping in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151183/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              3. National Center for Biotechnology Information (NCBI): Canine Pregnancy and Parturition Physiology
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing hormonal regulation and physiological changes during canine pregnancy and labor.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/parturition-guidelines.pdf"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              4. American Animal Hospital Association (AAHA): Canine Parturition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for monitoring and managing whelping in clinical and breeding settings.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Whelping Countdown & Stage Timeline"
      description="Track the countdown to whelping (birth) and estimate the timeline for each stage of labor."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Days Until Whelping = Gestation Length (days) - (Current Date - Breeding Date) in days",
        variables: [
          { symbol: "Gestation Length", description: "Total expected length of pregnancy in days (typically ~63)" },
          { symbol: "Current Date", description: "Date on which calculation is performed" },
          { symbol: "Breeding Date", description: "Date when mating or insemination occurred" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeder mated a dog on March 1st. Today is March 25th, and the breeder wants to know how many days remain until whelping.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate days since breeding: March 25 - March 1 = 24 days elapsed.",
          },
          {
            label: "Step 2",
            explanation:
              "Subtract days elapsed from gestation length: 63 - 24 = 39 days remaining until expected whelping.",
          },
        ],
        result: "The breeder can expect whelping in approximately 39 days and should begin preparing the whelping area accordingly.",
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
        { id: "what-is", label: "Understanding Whelping Countdown & Stage Timeline" },
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