import React from "react"
import { useState } from "react"
import { useMemo } from "react"
import { useRef } from "react"
import CalculatorVerticalLayout from "../components/CalculatorVerticalLayout"
import Input from "../components/Input"
import Label from "../components/Label"
import Button from "../components/Button"
import Card from "../components/Card"
import Table from "../components/Table"
import IconBookOpen from "../icons/IconBookOpen"

const DogCalorieNeedsRerMerCalculator = () => {
  // Constants for MER multipliers based on dog activity/life stage
  const MER_FACTORS = {
    inactive: 1.2,
    neutered: 1.6,
    intact: 1.8,
    active: 2.0,
    working: 5.0,
    weightLoss: 1.0,
    weightGain: 1.2,
    puppy0to4mo: 3.0,
    puppy4to12mo: 2.0,
    pregnant: 3.0,
    lactating: 4.0,
  }

  // State variables
  const [weightKg, setWeightKg] = useState("")
  const [weightLbs, setWeightLbs] = useState("")
  const [unit, setUnit] = useState("kg")
  const [activityLevel, setActivityLevel] = useState("neutered")
  const [ageMonths, setAgeMonths] = useState("")
  const [pregnant, setPregnant] = useState(false)
  const [lactating, setLactating] = useState(false)
  const [goal, setGoal] = useState("maintain")
  const [showResults, setShowResults] = useState(false)

  // Ref for smooth scroll to results
  const resultsRef = useRef(null)

  // Handlers for inputs
  const handleWeightKgChange = (e) => {
    const val = e.target.value
    if (/^\d*\.?\d*$/.test(val)) {
      setWeightKg(val)
      if (val !== "") {
        const lbs = parseFloat(val) * 2.20462
        setWeightLbs(lbs.toFixed(2))
      } else {
        setWeightLbs("")
      }
    }
  }

  const handleWeightLbsChange = (e) => {
    const val = e.target.value
    if (/^\d*\.?\d*$/.test(val)) {
      setWeightLbs(val)
      if (val !== "") {
        const kg = parseFloat(val) / 2.20462
        setWeightKg(kg.toFixed(2))
      } else {
        setWeightKg("")
      }
    }
  }

  const handleUnitChange = (e) => {
    const val = e.target.value
    setUnit(val)
  }

  const handleActivityLevelChange = (e) => {
    setActivityLevel(e.target.value)
  }

  const handleAgeMonthsChange = (e) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      setAgeMonths(val)
    }
  }

  const handlePregnantChange = (e) => {
    setPregnant(e.target.checked)
  }

  const handleLactatingChange = (e) => {
    setLactating(e.target.checked)
  }

  const handleGoalChange = (e) => {
    setGoal(e.target.value)
  }

  // Calculate Resting Energy Requirement (RER)
  // Formula: RER = 70 * (weight in kg) ^ 0.75
  const RER = useMemo(() => {
    const w = parseFloat(weightKg)
    if (isNaN(w) || w <= 0) return null
    return 70 * Math.pow(w, 0.75)
  }, [weightKg])

  // Calculate Maintenance Energy Requirement (MER)
  // MER = RER * activity factor depending on dog status
  const MER = useMemo(() => {
    if (!RER) return null
    let factor = 1.6 // default neutered adult
    if (pregnant) {
      factor = MER_FACTORS.pregnant
    } else if (lactating) {
      factor = MER_FACTORS.lactating
    } else if (ageMonths !== "") {
      const age = parseInt(ageMonths)
      if (age >= 0 && age < 4) {
        factor = MER_FACTORS.puppy0to4mo
      } else if (age >= 4 && age < 12) {
        factor = MER_FACTORS.puppy4to12mo
      } else {
        factor = MER_FACTORS[activityLevel] || 1.6
      }
    } else {
      factor = MER_FACTORS[activityLevel] || 1.6
    }

    // Adjust factor for weight goal
    if (goal === "weightLoss") {
      factor = MER_FACTORS.weightLoss
    } else if (goal === "weightGain") {
      factor = MER_FACTORS.weightGain
    }

    return RER * factor
  }, [RER, activityLevel, ageMonths, pregnant, lactating, goal])

  // Calories per day rounded
  const caloriesPerDay = useMemo(() => {
    if (!MER) return null
    return Math.round(MER)
  }, [MER])

  // Smooth scroll to results on calculate
  const onCalculate = () => {
    setShowResults(true)
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Editorial content sections
  const editorialSections = [
    {
      id: "introduction",
      title: "Introduction to Dog Calorie Needs",
      content:
        "Understanding your dog's calorie needs is essential for maintaining their health, weight, and overall well-being. Dogs require a certain amount of energy daily, measured in calories, to support their bodily functions, activity levels, and life stages. This calculator uses the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) formulas to estimate the calories your dog needs each day based on their weight, age, activity, and physiological status."
    },
    {
      id: "resting-energy-requirement-rer",
      title: "What is Resting Energy Requirement (RER)?",
      content:
        "The Resting Energy Requirement (RER) is the amount of energy (calories) a dog needs to maintain vital body functions such as breathing, circulation, and cellular metabolism while at rest. It does not include energy for physical activity, growth, reproduction, or recovery from illness. The RER is calculated using the formula: RER = 70 × (body weight in kg)^0.75. This formula accounts for metabolic scaling based on body size."
    },
    {
      id: "maintenance-energy-requirement-mer",
      title: "Understanding Maintenance Energy Requirement (MER)",
      content:
        "Maintenance Energy Requirement (MER) represents the total daily calories a dog needs to maintain their current weight and activity level. MER is calculated by multiplying the RER by a factor that varies depending on the dog's life stage, activity level, and physiological status. For example, a neutered adult dog typically has a MER factor of 1.6, while a working dog may have a factor as high as 5.0. Adjustments are also made for puppies, pregnant or lactating females, and dogs with weight management goals."
    },
    {
      id: "how-to-use-the-calculator",
      title: "How to Use This Calculator",
      content:
        "To use this calculator, enter your dog's weight in kilograms or pounds. Select the appropriate unit to ensure accurate conversion. Choose your dog's activity level or life stage from the provided options. If your dog is pregnant or lactating, check the corresponding boxes. Enter your dog's age in months if known, as this helps refine the calorie estimate for puppies. Finally, select your dog's weight goal, whether maintaining, losing, or gaining weight. Click 'Calculate' to see the estimated calorie needs."
    },
    {
      id: "interpreting-results",
      title: "Interpreting the Results",
      content:
        "The calculator provides two key values: the Resting Energy Requirement (RER) and the Maintenance Energy Requirement (MER). RER is the baseline calorie need at rest, while MER accounts for activity and physiological factors. Use the MER value to guide your dog's daily calorie intake. If your dog needs to lose or gain weight, adjust feeding accordingly while monitoring their progress. Always consult your veterinarian before making significant changes to your dog's diet."
    },
    {
      id: "feeding-tips-and-nutrition",
      title: "Feeding Tips and Nutritional Considerations",
      content:
        "Quality nutrition is vital for your dog's health. Choose dog food that meets AAFCO standards and is appropriate for your dog's life stage. Monitor your dog's body condition score regularly to ensure they are neither underweight nor overweight. Avoid overfeeding treats and table scraps, which can add unnecessary calories. Provide fresh water at all times and consider supplements only under veterinary guidance."
    },
    {
      id: "limitations-and-when-to-consult-a-vet",
      title: "Limitations of the Calculator and When to Consult a Veterinarian",
      content:
        "While this calculator provides a scientifically based estimate of your dog's calorie needs, individual variations exist. Factors such as breed, metabolism, health conditions, and environmental temperature can affect energy requirements. If your dog has special health concerns, is recovering from illness, or shows signs of weight problems, consult your veterinarian for personalized advice and diet planning."
    }
  ]

  // FAQ questions and answers
  const faqItems = [
    {
      question: "Frequently Asked Questions: What is the difference between RER and MER?",
      answer:
        "RER (Resting Energy Requirement) is the calories needed for basic bodily functions at rest. MER (Maintenance Energy Requirement) includes RER plus additional calories for activity, growth, reproduction, or other physiological states."
    },
    {
      question: "Frequently Asked Questions: How accurate is this calculator?",
      answer:
        "This calculator uses established scientific formulas and factors, but individual dogs may have different needs. Use the results as a guideline and monitor your dog's condition regularly."
    },
    {
      question: "Frequently Asked Questions: Can I use this calculator for puppies?",
      answer:
        "Yes. Enter your puppy's age in months to get a more accurate MER factor suitable for their growth stage."
    },
    {
      question: "Frequently Asked Questions: What if my dog is pregnant or lactating?",
      answer:
        "Check the pregnant or lactating boxes to adjust the MER factor accordingly, as these dogs require more calories."
    },
    {
      question: "Frequently Asked Questions: How do I convert pounds to kilograms?",
      answer:
        "1 pound equals approximately 0.453592 kilograms. This calculator automatically converts between units when you enter weight."
    },
    {
      question: "Frequently Asked Questions: Can I use this calculator for weight loss or gain?",
      answer:
        "Yes. Select the appropriate goal to adjust the MER factor for weight loss or gain recommendations."
    },
    {
      question: "Frequently Asked Questions: What if my dog is very active or a working dog?",
      answer:
        "Select the 'Active' or 'Working' activity level to use a higher MER factor reflecting increased energy needs."
    },
    {
      question: "Frequently Asked Questions: Should I feed exactly the calculated calories?",
      answer:
        "Use the calculated calories as a starting point. Adjust feeding amounts based on your dog's body condition, activity, and veterinary advice."
    },
    {
      question: "Frequently Asked Questions: How often should I recalculate my dog's calorie needs?",
      answer:
        "Recalculate whenever your dog's weight, activity level, or physiological status changes significantly."
    },
    {
      question: "Frequently Asked Questions: Can this calculator replace veterinary advice?",
      answer:
        "No. This tool is for informational purposes only. Always consult your veterinarian for personalized health and nutrition guidance."
    }
  ]

  // Related calculators with emojis
  const relatedCalculators = [
    { slug: "dog-weight-body-condition-score", title: "Dog Weight & Body Condition Score 🐕⚖️" },
    { slug: "dog-food-portion-size", title: "Dog Food Portion Size Calculator 🍖" },
    { slug: "cat-calorie-needs", title: "Cat Calorie Needs Calculator 🐈" },
    { slug: "dog-water-intake", title: "Dog Water Intake Calculator 💧" },
    { slug: "dog-ideal-weight", title: "Dog Ideal Weight Calculator 🏋️‍♂️" }
  ]

  // Formula section content
  const formulaContent = (
    <>
      <p>
        The primary formula used in this calculator is the Resting Energy Requirement (RER):
      </p>
      <p style={{ fontStyle: "italic", fontWeight: "bold", fontSize: "1.25rem" }}>
        RER = 70 × (Body Weight in kg)^0.75
      </p>
      <p>
        The Maintenance Energy Requirement (MER) is then calculated by multiplying the RER by a factor based on the dog's activity, life stage, or physiological status:
      </p>
      <ul>
        <li>Neutered adult: MER = RER × 1.6</li>
        <li>Intact adult: MER = RER × 1.8</li>
        <li>Inactive/obese prone: MER = RER × 1.2</li>
        <li>Active/working dog: MER = RER × 2.0 to 5.0</li>
        <li>Puppy 0-4 months: MER = RER × 3.0</li>
        <li>Puppy 4-12 months: MER = RER × 2.0</li>
        <li>Pregnant: MER = RER × 3.0</li>
        <li>Lactating: MER = RER × 4.0</li>
        <li>Weight loss goal: MER = RER × 1.0</li>
        <li>Weight gain goal: MER = RER × 1.2</li>
      </ul>
      <p>
        These factors are based on veterinary nutrition guidelines and scientific literature.
      </p>
    </>
  )

  // Detailed results table data
  const resultsTableData = useMemo(() => {
    if (!RER || !MER) return []
    return [
      {
        label: "Resting Energy Requirement (RER)",
        formula: "70 × (weight in kg)^0.75",
        value: RER.toFixed(2) + " kcal/day",
        description: "Calories needed at rest for vital functions."
      },
      {
        label: "Maintenance Energy Requirement (MER)",
        formula: "RER × activity factor",
        value: MER.toFixed(2) + " kcal/day",
        description: "Calories needed to maintain current weight and activity."
      },
      {
        label: "Activity Factor Used",
        formula: "-",
        value: (() => {
          if (pregnant) return "3.0 (Pregnant)"
          if (lactating) return "4.0 (Lactating)"
          if (ageMonths !== "") {
            const age = parseInt(ageMonths)
            if (age >= 0 && age < 4) return "3.0 (Puppy 0-4 months)"
            if (age >= 4 && age < 12) return "2.0 (Puppy 4-12 months)"
          }
          if (goal === "weightLoss") return "1.0 (Weight Loss)"
          if (goal === "weightGain") return "1.2 (Weight Gain)"
          return MER_FACTORS[activityLevel] ? MER_FACTORS[activityLevel].toFixed(1) + " (" + activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1) + ")" : "1.6 (Neutered Adult)"
        })(),
        description: "Factor used to adjust RER for activity and life stage."
      }
    ]
  }, [RER, MER, activityLevel, ageMonths, pregnant, lactating, goal])

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      onThisPage={[
        { id: "introduction", label: "Introduction" },
        { id: "resting-energy-requirement-rer", label: "Resting Energy Requirement (RER)" },
        { id: "maintenance-energy-requirement-mer", label: "Maintenance Energy Requirement (MER)" },
        { id: "how-to-use-the-calculator", label: "How to Use" },
        { id: "interpreting-results", label: "Interpreting Results" },
        { id: "feeding-tips-and-nutrition", label: "Feeding Tips" },
        { id: "limitations-and-when-to-consult-a-vet", label: "Limitations & Vet Advice" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={formulaContent}
      example={
        <>
          <h3>Example Calculation</h3>
          <p>
            Suppose you have a 20 kg neutered adult dog with moderate activity. The RER is calculated as:
          </p>
          <p style={{ fontWeight: "bold" }}>
            RER = 70 × 20^0.75 = 70 × 8.43 = 590 kcal/day
          </p>
          <p>
            The MER for a neutered adult dog is:
          </p>
          <p style={{ fontWeight: "bold" }}>
            MER = RER × 1.6 = 590 × 1.6 = 944 kcal/day
          </p>
          <p>
            So, your dog needs approximately 944 calories per day to maintain their weight.
          </p>
        </>
      }
      relatedCalculators={relatedCalculators}
    >
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onCalculate()
          }}
          aria-label="Dog Calorie Needs Calculator Form"
        >
          <Label htmlFor="weightInput">Dog Weight</Label>
          {unit === "kg" ? (
            <Input
              id="weightInput"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={weightKg}
              onChange={handleWeightKgChange}
              placeholder="Enter weight in kilograms"
              aria-describedby="weightHelp"
              required
            />
          ) : (
            <Input
              id="weightInput"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={weightLbs}
              onChange={handleWeightLbsChange}
              placeholder="Enter weight in pounds"
              aria-describedby="weightHelp"
              required
            />
          )}
          <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
            <Label htmlFor="unitSelect">Select Unit</Label>
            <select
              id="unitSelect"
              value={unit}
              onChange={handleUnitChange}
              aria-label="Select weight unit"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>

          <Label htmlFor="activityLevelSelect">Activity Level / Life Stage</Label>
          <select
            id="activityLevelSelect"
            value={activityLevel}
            onChange={handleActivityLevelChange}
            aria-label="Select activity level or life stage"
          >
            <option value="inactive">Inactive / Obese Prone</option>
            <option value="neutered">Neutered Adult</option>
            <option value="intact">Intact Adult</option>
            <option value="active">Active / Working Dog</option>
            <option value="working">Very Active / Working Dog</option>
          </select>

          <Label htmlFor="ageMonthsInput" style={{ marginTop: "1rem" }}>
            Age (months) - Optional for puppies
          </Label>
          <Input
            id="ageMonthsInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={ageMonths}
            onChange={handleAgeMonthsChange}
            placeholder="Enter age in months"
            aria-describedby="ageHelp"
          />

          <div style={{ marginTop: "1rem" }}>
            <input
              type="checkbox"
              id="pregnantCheckbox"
              checked={pregnant}
              onChange={handlePregnantChange}
              aria-describedby="pregnantHelp"
            />
            <Label htmlFor="pregnantCheckbox" style={{ display: "inline", marginLeft: "0.5rem" }}>
              Pregnant
            </Label>
          </div>

          <div>
            <input
              type="checkbox"
              id="lactatingCheckbox"
              checked={lactating}
              onChange={handleLactatingChange}
              aria-describedby="lactatingHelp"
            />
            <Label htmlFor="lactatingCheckbox" style={{ display: "inline", marginLeft: "0.5rem" }}>
              Lactating
            </Label>
          </div>

          <Label htmlFor="goalSelect" style={{ marginTop: "1rem" }}>
            Weight Goal
          </Label>
          <select
            id="goalSelect"
            value={goal}
            onChange={handleGoalChange}
            aria-label="Select weight goal"
          >
            <option value="maintain">Maintain Weight</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="weightGain">Weight Gain</option>
          </select>

          <Button type="submit" style={{ marginTop: "1.5rem" }}>
            Calculate
          </Button>
        </form>
      </Card>

      {showResults && (
        <section
          ref={resultsRef}
          aria-live="polite"
          aria-atomic="true"
          style={{ marginTop: "2rem" }}
        >
          <Card>
            <h2>Results</h2>
            {caloriesPerDay !== null ? (
              <>
                <p>
                  <strong>Resting Energy Requirement (RER):</strong> {RER.toFixed(2)} kcal/day
                </p>
                <p>
                  <strong>Maintenance Energy Requirement (MER):</strong> {MER.toFixed(2)} kcal/day
                </p>
                <p>
                  <strong>Recommended Daily Calories:</strong> {caloriesPerDay} kcal/day
                </p>

                <Table
                  columns={[
                    { header: "Parameter", accessor: "label" },
                    { header: "Formula / Factor", accessor: "formula" },
                    { header: "Value", accessor: "value" },
                    { header: "Description", accessor: "description" }
                  ]}
                  data={resultsTableData}
                  ariaLabel="Detailed calorie calculation results"
                />
              </>
            ) : (
              <p>Please enter a valid weight to see results.</p>
            )}
          </Card>
        </section>
      )}

      <section id="editorial" style={{ marginTop: "3rem" }}>
        {editorialSections.map((section) => (
          <article key={section.id} id={section.id} style={{ marginBottom: "2rem" }}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </article>
        ))}
      </section>

      <section id="faq" style={{ marginTop: "3rem" }}>
        <h2>Frequently Asked Questions</h2>
        {faqItems.map((item, index) => (
          <article key={index} style={{ marginBottom: "1.5rem" }}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section id="references" style={{ marginTop: "3rem" }}>
        <h2>
          <IconBookOpen aria-hidden="true" style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
          References
        </h2>
        <ul>
          <li>
            National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press, 2006.
          </li>
          <li>
            Freeman LM, Chandler ML, Hamper BA, Weeth LP. Current knowledge about the risks and benefits of raw meat–based diets for dogs and cats. J Am Vet Med Assoc. 2013.
          </li>
          <li>
            Case LP, Daristotle L, Hayek MG, Raasch MF. Canine and Feline Nutrition: A Resource for Companion Animal Professionals. 3rd Edition. Elsevier, 2011.
          </li>
          <li>
            Hand MS, Thatcher CD, Remillard RL, Roudebush P, Novotny BJ. Small Animal Clinical Nutrition. 5th Edition. Mark Morris Institute, 2010.
          </li>
          <li>
            National Animal Supplement Council. Canine Nutrition Guidelines. NASC, 2020.
          </li>
          <li>
            Jeusette I, Detilleux J, Greco D, et al. Effects of breed and age on body composition of dogs: a dual-energy X-ray absorptiometry study. J Anim Physiol Anim Nutr. 2010.
          </li>
          <li>
            German AJ. The growing problem of obesity in dogs and cats. J Nutr. 2006.
          </li>
          <li>
            Laflamme DP. Development and validation of a body condition score system for dogs. Canine Pract. 1997.
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  )
}

export default DogIdealWeightTargetCaloriesCalculator;
