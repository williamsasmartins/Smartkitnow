import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'
import { useRef } from 'react'
import CalculatorVerticalLayout from '../components/CalculatorVerticalLayout'
import Input from '../components/Input'
import Label from '../components/Label'
import Button from '../components/Button'
import Card from '../components/Card'
import Table from '../components/Table'
import IconBookOpen from '../icons/IconBookOpen'

const DogCalorieNeedsRerMerCalculator = () => {
  // Constants for MER multipliers by life stage and condition
  const MER_FACTORS = {
    neuteredAdult: 1.6,
    intactAdult: 1.8,
    inactiveObeseProne: 1.2,
    weightLoss: 1.0,
    weightGain: 1.5,
    puppy0to4months: 3.0,
    puppy4to12months: 2.0,
    pregnant: 3.0,
    lactating: 4.0,
  }

  // State variables for inputs
  const [weightKg, setWeightKg] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [unit, setUnit] = useState('kg')
  const [lifeStage, setLifeStage] = useState('neuteredAdult')
  const [activityLevel, setActivityLevel] = useState('normal')
  const [pregnant, setPregnant] = useState(false)
  const [lactating, setLactating] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)

  // Ref for scrolling to results
  const resultsRef = useRef(null)

  // Handlers for input changes
  const onWeightKgChange = (e) => {
    const val = e.target.value
    if (/^\d*\.?\d*$/.test(val)) {
      setWeightKg(val)
      if (val !== '') {
        setWeightLbs((parseFloat(val) * 2.20462).toFixed(2))
      } else {
        setWeightLbs('')
      }
      setUnit('kg')
    }
  }

  const onWeightLbsChange = (e) => {
    const val = e.target.value
    if (/^\d*\.?\d*$/.test(val)) {
      setWeightLbs(val)
      if (val !== '') {
        setWeightKg((parseFloat(val) / 2.20462).toFixed(2))
      } else {
        setWeightKg('')
      }
      setUnit('lbs')
    }
  }

  // Calculate RER (Resting Energy Requirement)
  const RER = useMemo(() => {
    const w = parseFloat(weightKg)
    if (isNaN(w) || w <= 0) return null
    return 70 * Math.pow(w, 0.75)
  }, [weightKg])

  // Calculate MER (Maintenance Energy Requirement) based on life stage and conditions
  const MER = useMemo(() => {
    if (!RER) return null
    let factor = 1.6 // default neutered adult

    switch (lifeStage) {
      case 'neuteredAdult':
        factor = MER_FACTORS.neuteredAdult
        break
      case 'intactAdult':
        factor = MER_FACTORS.intactAdult
        break
      case 'inactiveObeseProne':
        factor = MER_FACTORS.inactiveObeseProne
        break
      case 'weightLoss':
        factor = MER_FACTORS.weightLoss
        break
      case 'weightGain':
        factor = MER_FACTORS.weightGain
        break
      case 'puppy0to4months':
        factor = MER_FACTORS.puppy0to4months
        break
      case 'puppy4to12months':
        factor = MER_FACTORS.puppy4to12months
        break
      default:
        factor = MER_FACTORS.neuteredAdult
    }

    if (pregnant) {
      factor = MER_FACTORS.pregnant
    }
    if (lactating) {
      factor = MER_FACTORS.lactating
    }

    return RER * factor
  }, [RER, lifeStage, pregnant, lactating])

  // Scroll to results when calculated
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // On submit handler
  const onCalculateClick = (e) => {
    e.preventDefault()
    scrollToResults()
  }

  // Editorial content sections
  const editorialSections = [
    {
      id: 'introduction',
      title: 'Introduction to Dog Calorie Needs',
      content: (
        <>
          <p>
            Understanding your dog’s calorie needs is essential for maintaining optimal health, preventing obesity, and ensuring longevity. Dogs require a certain amount of energy daily to support their basic metabolic functions, physical activity, growth, and reproduction. This calculator helps you estimate your dog’s Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) based on their weight, life stage, and condition.
          </p>
          <p>
            The RER represents the energy needed for basic physiological functions at rest, while the MER accounts for additional energy expenditure due to activity, growth, pregnancy, or lactation. Feeding your dog according to these needs helps maintain a healthy weight and supports overall wellbeing.
          </p>
        </>
      ),
    },
    {
      id: 'how-to-use',
      title: 'How to Use This Calculator',
      content: (
        <>
          <p>
            To use this calculator, enter your dog’s weight in either kilograms or pounds. The calculator will automatically convert between units. Select your dog’s life stage from the dropdown menu, which includes options such as neutered adult, intact adult, puppy, and more. Indicate if your dog is pregnant or lactating by toggling the respective checkboxes.
          </p>
          <p>
            Once you input all the required information, click the “Calculate” button to see your dog’s estimated RER and MER. The results section will provide detailed calorie needs and explanations to help you understand the calculations.
          </p>
        </>
      ),
    },
    {
      id: 'resting-energy-requirement-rer',
      title: 'Resting Energy Requirement (RER) Explained',
      content: (
        <>
          <p>
            The Resting Energy Requirement (RER) is the amount of energy your dog needs to maintain basic physiological functions such as breathing, circulation, and cellular metabolism while at rest. It is calculated using the formula:
          </p>
          <p style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
            RER = 70 × (Body Weight in kg)^0.75
          </p>
          <p>
            This formula accounts for metabolic scaling and is widely accepted in veterinary nutrition. RER serves as the baseline energy requirement before factoring in activity and other life stage adjustments.
          </p>
        </>
      ),
    },
    {
      id: 'maintenance-energy-requirement-mer',
      title: 'Maintenance Energy Requirement (MER) and Life Stage Factors',
      content: (
        <>
          <p>
            The Maintenance Energy Requirement (MER) is the total daily energy your dog needs, including RER plus energy for activity, growth, reproduction, and other physiological states. MER is calculated by multiplying RER by a factor specific to your dog’s life stage and condition.
          </p>
          <p>
            Common MER factors include:
          </p>
          <ul>
            <li>Neutered adult dogs: 1.6 × RER</li>
            <li>Intact adult dogs: 1.8 × RER</li>
            <li>Inactive or obese-prone dogs: 1.2 × RER</li>
            <li>Weight loss: 1.0 × RER</li>
            <li>Weight gain: 1.5 × RER</li>
            <li>Puppies 0-4 months: 3.0 × RER</li>
            <li>Puppies 4-12 months: 2.0 × RER</li>
            <li>Pregnant dogs: 3.0 × RER</li>
            <li>Lactating dogs: 4.0 × RER</li>
          </ul>
          <p>
            Selecting the correct life stage and condition ensures accurate calorie recommendations.
          </p>
        </>
      ),
    },
    {
      id: 'feeding-guidelines',
      title: 'Feeding Guidelines and Practical Tips',
      content: (
        <>
          <p>
            Use the MER value as a baseline to determine how many calories your dog should consume daily. When selecting commercial dog food, check the calorie content per cup or serving and adjust the amount fed accordingly.
          </p>
          <p>
            Remember that individual dogs may vary in metabolism and activity, so monitor your dog’s weight and body condition regularly. Adjust feeding amounts as needed to maintain an ideal body condition score.
          </p>
          <p>
            Avoid overfeeding treats and table scraps, as these can quickly add excess calories and contribute to weight gain.
          </p>
        </>
      ),
    },
    {
      id: 'special-considerations',
      title: 'Special Considerations for Puppies, Pregnant, and Lactating Dogs',
      content: (
        <>
          <p>
            Puppies have higher energy needs to support rapid growth and development. Their MER can be up to three times their RER during the first four months of life. Pregnant and lactating dogs also require increased calories to support fetal growth and milk production.
          </p>
          <p>
            Consult your veterinarian for tailored feeding plans during these life stages to ensure your dog’s health and wellbeing.
          </p>
        </>
      ),
    },
    {
      id: 'monitoring-and-adjusting',
      title: 'Monitoring and Adjusting Your Dog’s Calorie Intake',
      content: (
        <>
          <p>
            Regularly weigh your dog and assess their body condition score to ensure they are maintaining a healthy weight. If your dog is gaining or losing weight unintentionally, adjust their calorie intake accordingly.
          </p>
          <p>
            Changes in activity level, health status, or life stage may require recalculating calorie needs. Use this calculator periodically to keep feeding recommendations up to date.
          </p>
        </>
      ),
    },
  ]

  // FAQ questions and answers
  const faqItems = [
    {
      question: 'What is the difference between RER and MER?',
      answer:
        'RER (Resting Energy Requirement) is the energy needed for basic bodily functions at rest, while MER (Maintenance Energy Requirement) includes additional energy for activity, growth, reproduction, and other factors.',
    },
    {
      question: 'Why do puppies need more calories than adult dogs?',
      answer:
        'Puppies require more calories to support rapid growth, development, and higher activity levels. Their MER can be up to three times their RER during early life stages.',
    },
    {
      question: 'How often should I recalculate my dog’s calorie needs?',
      answer:
        'Recalculate calorie needs whenever your dog’s weight, activity level, or life stage changes, or at least every 3-6 months to ensure accurate feeding.',
    },
    {
      question: 'Can I use this calculator for cats or other pets?',
      answer:
        'No, this calculator is specifically designed for dogs. Cats and other pets have different metabolic rates and nutritional requirements.',
    },
    {
      question: 'What if my dog is overweight or obese?',
      answer:
        'For overweight dogs, use the weight loss MER factor (1.0 × RER) and consult your veterinarian for a weight management plan.',
    },
    {
      question: 'How do I convert calories to cups of dog food?',
      answer:
        'Check the calorie content per cup on your dog food packaging and divide your dog’s daily calorie needs by that number to determine cups per day.',
    },
    {
      question: 'Is it safe to feed my dog less than the calculated MER?',
      answer:
        'Feeding less than MER may cause weight loss or nutritional deficiencies. Always consult your veterinarian before making significant changes.',
    },
    {
      question: 'Why does the calculator ask if my dog is pregnant or lactating?',
      answer:
        'Pregnancy and lactation significantly increase a dog’s energy needs to support fetal growth and milk production, requiring higher calorie intake.',
    },
    {
      question: 'Can I use this calculator for mixed-breed dogs?',
      answer:
        'Yes, the calculator is suitable for all dog breeds as it is based on metabolic weight rather than breed-specific factors.',
    },
    {
      question: 'What if my dog has a medical condition affecting metabolism?',
      answer:
        'Consult your veterinarian for personalized calorie recommendations, as some medical conditions may alter energy requirements.',
    },
  ]

  // References list
  const references = [
    {
      title: 'Nutrient Requirements of Dogs and Cats',
      author: 'National Research Council',
      year: 2006,
      url: 'https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats',
    },
    {
      title: 'Small Animal Clinical Nutrition',
      author: 'Michael S. Hand, et al.',
      year: 2010,
      url: 'https://www.wiley.com/en-us/Small+Animal+Clinical+Nutrition%2C+5th+Edition-p-9780813820185',
    },
    {
      title: 'Energy Requirements of Dogs',
      author: 'Case et al.',
      year: 2011,
      url: 'https://www.merckvetmanual.com/nutrition/energy-requirements-of-dogs',
    },
  ]

  // Table data for detailed results
  const resultsTableData = useMemo(() => {
    if (!RER || !MER) return []

    return [
      {
        key: 'weight',
        label: 'Body Weight',
        value: unit === 'kg' ? weightKg + ' kg' : weightLbs + ' lbs',
      },
      {
        key: 'rer',
        label: 'Resting Energy Requirement (RER)',
        value: RER.toFixed(2) + ' kcal/day',
      },
      {
        key: 'mer',
        label: 'Maintenance Energy Requirement (MER)',
        value: MER.toFixed(2) + ' kcal/day',
      },
      {
        key: 'lifeStage',
        label: 'Life Stage / Condition',
        value: (() => {
          switch (lifeStage) {
            case 'neuteredAdult':
              return 'Neutered Adult'
            case 'intactAdult':
              return 'Intact Adult'
            case 'inactiveObeseProne':
              return 'Inactive / Obese Prone'
            case 'weightLoss':
              return 'Weight Loss'
            case 'weightGain':
              return 'Weight Gain'
            case 'puppy0to4months':
              return 'Puppy (0-4 months)'
            case 'puppy4to12months':
              return 'Puppy (4-12 months)'
            default:
              return 'Neutered Adult'
          }
        })(),
      },
      {
        key: 'pregnant',
        label: 'Pregnant',
        value: pregnant ? 'Yes' : 'No',
      },
      {
        key: 'lactating',
        label: 'Lactating',
        value: lactating ? 'Yes' : 'No',
      },
    ]
  }, [RER, MER, weightKg, weightLbs, unit, lifeStage, pregnant, lactating])

  // Related calculators with emojis
  const relatedCalculators = [
    {
      title: 'Cat Calorie Needs Calculator 🐱',
      slug: 'cat-calorie-needs',
    },
    {
      title: 'Dog Food Portion Calculator 🍖',
      slug: 'dog-food-portion',
    },
    {
      title: 'Pet Weight Loss Calculator 🐾',
      slug: 'pet-weight-loss',
    },
    {
      title: 'Dog Body Condition Score Calculator 🐕',
      slug: 'dog-body-condition-score',
    },
  ]

  // OnThisPage links for editorial navigation
  const onThisPage = editorialSections.map((section) => ({
    id: section.id,
    title: section.title,
  }))

  // Formula section content
  const formula = (
    <>
      <p>
        The primary formulas used in this calculator are:
      </p>
      <ul>
        <li>
          <strong>Resting Energy Requirement (RER):</strong> 70 × (Body Weight in kg)<sup>0.75</sup>
        </li>
        <li>
          <strong>Maintenance Energy Requirement (MER):</strong> RER × Life Stage Factor
        </li>
      </ul>
      <p>
        Life stage factors vary based on neuter status, activity, growth, pregnancy, and lactation.
      </p>
    </>
  )

  // Example section content
  const example = (
    <>
      <p>
        For example, a neutered adult dog weighing 20 kg would have:
      </p>
      <ul>
        <li>RER = 70 × 20<sup>0.75</sup> ≈ 70 × 10.61 = 742.7 kcal/day</li>
        <li>MER = RER × 1.6 = 742.7 × 1.6 = 1188.3 kcal/day</li>
      </ul>
      <p>
        This means the dog requires approximately 1188 calories daily to maintain weight.
      </p>
    </>
  )

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      slug="dog-calorie-needs-rer-mer"
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
    >
      <form onSubmit={onCalculateClick} aria-label="Dog Calorie Needs Calculator Form">
        <Card>
          <Label htmlFor="weightKg">Weight (kilograms)</Label>
          <Input
            id="weightKg"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={weightKg}
            onChange={onWeightKgChange}
            aria-describedby="weightHelp"
            aria-invalid={weightKg !== '' && (isNaN(parseFloat(weightKg)) || parseFloat(weightKg) <= 0)}
            placeholder="e.g., 20.0"
          />
          <Label htmlFor="weightLbs" style={{ marginTop: '1rem' }}>
            Weight (pounds)
          </Label>
          <Input
            id="weightLbs"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={weightLbs}
            onChange={onWeightLbsChange}
            aria-describedby="weightHelp"
            aria-invalid={weightLbs !== '' && (isNaN(parseFloat(weightLbs)) || parseFloat(weightLbs) <= 0)}
            placeholder="e.g., 44.1"
          />
          <p id="weightHelp" style={{ fontSize: '0.875rem', color: '#666' }}>
            Enter weight in either kilograms or pounds. The other field will update automatically.
          </p>
        </Card>

        <Card style={{ marginTop: '1.5rem' }}>
          <Label htmlFor="lifeStage">Life Stage / Condition</Label>
          <select
            id="lifeStage"
            value={lifeStage}
            onChange={(e) => setLifeStage(e.target.value)}
            aria-describedby="lifeStageHelp"
          >
            <option value="neuteredAdult">Neutered Adult</option>
            <option value="intactAdult">Intact Adult</option>
            <option value="inactiveObeseProne">Inactive / Obese Prone</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="weightGain">Weight Gain</option>
            <option value="puppy0to4months">Puppy (0-4 months)</option>
            <option value="puppy4to12months">Puppy (4-12 months)</option>
          </select>
          <p id="lifeStageHelp" style={{ fontSize: '0.875rem', color: '#666' }}>
            Select the life stage or condition that best describes your dog.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Label htmlFor="pregnant">
              <input
                type="checkbox"
                id="pregnant"
                checked={pregnant}
                onChange={(e) => setPregnant(e.target.checked)}
                aria-describedby="pregnantHelp"
              />{' '}
              Pregnant
            </Label>
            <p id="pregnantHelp" style={{ fontSize: '0.75rem', color: '#666', marginLeft: '1.5rem' }}>
              Check if your dog is currently pregnant.
            </p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Label htmlFor="lactating">
              <input
                type="checkbox"
                id="lactating"
                checked={lactating}
                onChange={(e) => setLactating(e.target.checked)}
                aria-describedby="lactatingHelp"
              />{' '}
              Lactating
            </Label>
            <p id="lactatingHelp" style={{ fontSize: '0.75rem', color: '#666', marginLeft: '1.5rem' }}>
              Check if your dog is currently lactating.
            </p>
          </div>
        </Card>

        <Button type="submit" style={{ marginTop: '2rem' }} aria-label="Calculate Dog Calorie Needs">
          Calculate
        </Button>
      </form>

      <section ref={resultsRef} aria-live="polite" aria-atomic="true" style={{ marginTop: '3rem' }}>
        {RER && MER ? (
          <Card aria-label="Calculation Results">
            <h2>Calculation Results</h2>
            <Table
              columns={[
                { header: 'Parameter', accessor: 'label' },
                { header: 'Value', accessor: 'value' },
              ]}
              data={resultsTableData}
              keyField="key"
            />
            <p style={{ marginTop: '1rem' }}>
              Your dog’s estimated <strong>Resting Energy Requirement (RER)</strong> is{' '}
              <strong>{RER.toFixed(2)} kcal/day</strong>. This is the energy needed for basic bodily functions at rest.
            </p>
            <p>
              The estimated <strong>Maintenance Energy Requirement (MER)</strong> is{' '}
              <strong>{MER.toFixed(2)} kcal/day</strong>, which accounts for your dog’s activity level and life stage.
            </p>
            <p>
              Use these values as a guideline for daily calorie intake to maintain your dog’s health and weight.
            </p>
          </Card>
        ) : (
          <Card aria-label="No results available" style={{ opacity: 0.6 }}>
            <p>Please enter a valid weight to see calculation results.</p>
          </Card>
        )}
      </section>

      <section style={{ marginTop: '4rem' }} aria-label="Editorial Content">
        <h2>About This Calculator</h2>
        {editorialSections.map((section) => (
          <article key={section.id} id={section.id} style={{ marginBottom: '2rem' }}>
            <h3>{section.title}</h3>
            {section.content}
          </article>
        ))}
      </section>

      <section style={{ marginTop: '4rem' }} aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        {faqItems.map((faq, index) => (
          <details key={index} style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>{faq.question}</summary>
            <p style={{ marginTop: '0.5rem' }}>{faq.answer}</p>
          </details>
        ))}
      </section>

      <section style={{ marginTop: '4rem' }} aria-label="References">
        <h2>
          <IconBookOpen aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          References
        </h2>
        <ul>
          {references.map((ref, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                {ref.author} ({ref.year}). {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </CalculatorVerticalLayout>
  )
}

export default DogIdealWeightTargetCaloriesCalculator;
