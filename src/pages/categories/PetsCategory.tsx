import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import RegistryCategorySection from "@/components/RegistryCategorySection";
import SuggestionBox from "@/components/SuggestionBox";

type Item = { name: string; slug: string };

// ===== AUTOGEN PLACEHOLDER START =====
const dogNutritionWeight: Item[] = [{ name: "Dog Calorie Needs (RER/MER) Calculator", slug: "dog-calorie-needs-rer-mer" }, { name: "Dog Weight Loss Planner", slug: "dog-weight-loss-planner" }, { name: "Dog Ideal Weight & Target Calories Calculator", slug: "dog-ideal-weight-target-calories" }, { name: "Dog Treat Calories & Daily Allowance Calculator", slug: "dog-treat-calories-daily-allowance" }, { name: "Puppy Calorie Needs by Age/Breed Size Calculator", slug: "puppy-calorie-needs-age-breed-size" }, { name: "Dog Protein/Fat Intake Guide (by Goal)", slug: "dog-protein-fat-intake-guide" }];
const dogHydration: Item[] = [{ name: "Dog Daily Water Intake Checker", slug: "dog-daily-water-intake-checker" }, { name: "Dehydration Risk Estimator (Weight & Symptoms Aware)", slug: "dog-dehydration-risk-estimator" }];
const dogToxicologyHazard: Item[] = [{ name: "Dog Chocolate Toxicity Calculator", slug: "dog-chocolate-toxicity" }, { name: "Dog Grape/Raisin Exposure Risk Calculator", slug: "dog-grape-raisin-exposure-risk" }, { name: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", slug: "dog-onion-garlic-exposure-risk" }, { name: "Dog Xylitol Exposure Risk Calculator", slug: "dog-xylitol-exposure-risk" }, { name: "Dog Caffeine Toxicity Calculator", slug: "dog-caffeine-toxicity" }, { name: "Dog Macadamia Nut Toxicity Calculator", slug: "dog-macadamia-nut-toxicity" }, { name: "Dog Alcohol/Ethanol Exposure Risk Calculator", slug: "dog-alcohol-ethanol-exposure-risk" }, { name: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", slug: "dog-human-medication-exposure-alert" }];
const dogMedicationDosing: Item[] = [{ name: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", slug: "dog-benadryl-diphenhydramine-dose" }, { name: "Cephalexin Dose Calculator for Dogs", slug: "dog-cephalexin-dose" }, { name: "Meloxicam/Metacam Dose Calculator for Dogs", slug: "dog-meloxicam-metacam-dose" }, { name: "Gabapentin Dose Calculator for Dogs", slug: "dog-gabapentin-dose" }, { name: "Prednisone/Prednisolone Dose Calculator for Dogs", slug: "dog-prednisone-prednisolone-dose" }, { name: "Tramadol Dose Calculator for Dogs", slug: "dog-tramadol-dose" }, { name: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", slug: "dog-omega-3-epa-dha-supplement" }];
const dogGrowthSizeMeasures: Item[] = [{ name: "Puppy Adult Size Predictor (Weight Curve)", slug: "puppy-adult-size-predictor-weight-curve" }, { name: "Dog Body Condition Score Helper (BCS → Target Plan)", slug: "dog-body-condition-score-bcs-target" }, { name: "Dog BMI/Body Index (educational)", slug: "dog-bmi-body-index-educational" }, { name: "Dog Crate Size Finder", slug: "dog-crate-size-finder" }, { name: "Dog Harness Size & Fit Guide", slug: "dog-harness-size-fit-guide" }];
const dogActivityFitness: Item[] = [{ name: "Dog Walking Calories Burned Calculator", slug: "dog-walking-calories-burned" }, { name: "Dog Step-Goal & Activity Time Planner", slug: "dog-step-goal-activity-time-planner" }, { name: "Heat Risk/Walk Safety Window (Temp & Humidity)", slug: "dog-heat-risk-walk-safety-window" }];
const dogAgeLongevity: Item[] = [{ name: "Dog Age in Human Years (Breed-Aware)", slug: "dog-age-human-years-breed-aware" }, { name: "Dog Life Expectancy Estimator (lifestyle factors)", slug: "dog-life-expectancy-estimator" }];
const dogReproduction: Item[] = [{ name: "Dog Pregnancy (Gestation) Due-Date Calculator", slug: "dog-pregnancy-gestation-due-date" }, { name: "Whelping Countdown & Stage Timeline", slug: "dog-whelping-countdown-stage-timeline" }];

const catNutritionWeight: Item[] = [{ name: "Cat Calorie Needs (RER/MER) Calculator", slug: "cat-calorie-needs-rer-mer" }, { name: "Cat Weight Loss Planner", slug: "cat-weight-loss-planner" }, { name: "Ideal Weight & Target Calories for Cats", slug: "cat-ideal-weight-target-calories" }, { name: "Kitten Calorie Needs by Age/Size", slug: "kitten-calorie-needs-age-size" }, { name: "Senior Cat Nutrition & Calorie Adjuster", slug: "senior-cat-nutrition-calorie-adjuster" }, { name: "Cat Treat Calories & Daily Allowance", slug: "cat-treat-calories-daily-allowance" }, { name: "Protein/Fat Intake Guide for Cats (by Goal)", slug: "cat-protein-fat-intake-guide" }];
const catHydration: Item[] = [{ name: "Daily Water Intake Checker for Cats", slug: "cat-daily-water-intake-checker" }, { name: "Dehydration Risk Estimator (Symptoms + Intake)", slug: "cat-dehydration-risk-estimator" }];
const catToxicologyHazard: Item[] = [{ name: "Cat Chocolate Toxicity Calculator", slug: "cat-chocolate-toxicity" }, { name: "Cat Onion/Garlic Toxicity Calculator", slug: "cat-onion-garlic-toxicity" }, { name: "Cat Grape/Raisin Exposure Risk (educational)", slug: "cat-grape-raisin-exposure-risk" }, { name: "Xylitol Exposure Risk for Cats (rare but educational)", slug: "cat-xylitol-exposure-risk" }, { name: "Caffeine Toxicity Risk for Cats", slug: "cat-caffeine-toxicity" }, { name: "Essential Oils Exposure Risk (diffuser/dermal)", slug: "cat-essential-oils-exposure-risk" }, { name: "Lilies Poisoning Risk Guide (cats)", slug: "cat-lilies-poisoning-risk-guide" }, { name: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", slug: "cat-acetaminophen-ibuprofen-exposure-risk" }];
const catMedicationDosing: Item[] = [{ name: "Benadryl (Diphenhydramine) Dose Calculator for Cats", slug: "cat-benadryl-diphenhydramine-dose" }, { name: "Cephalexin Dose Calculator for Cats", slug: "cat-cephalexin-dose" }, { name: "Meloxicam Dose Calculator for Cats", slug: "cat-meloxicam-dose" }, { name: "Gabapentin Dose Calculator for Cats", slug: "cat-gabapentin-dose" }, { name: "Prednisolone Dose Calculator for Cats", slug: "cat-prednisolone-dose" }, { name: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", slug: "cat-omega-3-epa-dha-supplement" }, { name: "Insulin Starter Reference (info-only)", slug: "cat-insulin-starter-reference" }];
const catGrowthSizeMeasures: Item[] = [{ name: "Kitten Adult Weight Predictor", slug: "kitten-adult-weight-predictor" }, { name: "Cat Body Condition Score Helper (BCS → Target Plan)", slug: "cat-body-condition-score-bcs-target" }, { name: "Cat BMI/Body Index (educational)", slug: "cat-bmi-body-index-educational" }, { name: "Cat Carrier Size & Fit Guide", slug: "cat-carrier-size-fit-guide" }, { name: "Cat Harness Size & Fit Guide", slug: "cat-harness-size-fit-guide" }];
const catActivityLifestyle: Item[] = [{ name: "Indoor/Outdoor Activity Calorie Adjuster", slug: "cat-activity-calorie-adjuster" }, { name: "Play Session Planner (Feather/Chase Time Targets)", slug: "cat-play-session-planner" }, { name: "Resting vs. Active Hours Balance Tracker (owner input)", slug: "cat-resting-active-hours-balance-tracker" }];
const catAgeLongevity: Item[] = [{ name: "Cat Age in Human Years (Breed/Size Aware)", slug: "cat-age-human-years-breed-size-aware" }, { name: "Senior Cat Care Readiness Checklist (scored helper)", slug: "senior-cat-care-readiness-checklist" }, { name: "Life Expectancy Estimator (lifestyle factors; educational)", slug: "cat-life-expectancy-estimator" }];
const catUrinaryKidney: Item[] = [{ name: "Litter Box Output Tracker (Normal vs. Increased)", slug: "cat-litter-box-output-tracker" }, { name: "Fluid Intake vs. Urine Output Balance Checker", slug: "cat-fluid-intake-urine-output-balance" }, { name: "Phosphorus per Meal Estimator (diet label helper)", slug: "cat-phosphorus-per-meal-estimator" }];
const catReproduction: Item[] = [{ name: "Cat Pregnancy (Gestation) Due-Date Calculator", slug: "cat-pregnancy-gestation-due-date" }, { name: "Kitten Weaning Timeline & Feeding Amounts", slug: "kitten-weaning-timeline-feeding-amounts" }];
const catGroomingCare: Item[] = [{ name: "Shedding & Combing Time Planner", slug: "cat-shedding-combing-time-planner" }, { name: "Nail Trim Interval Planner (activity/surface based)", slug: "cat-nail-trim-interval-planner" }];
const catBehaviorEnvironment: Item[] = [{ name: "Multi-Cat Litter Box Count Calculator", slug: "multi-cat-litter-box-count-calculator" }, { name: "Environmental Enrichment Planner (per room)", slug: "cat-environmental-enrichment-planner" }, { name: "Stress Score & Playtime Offset Planner (owner input)", slug: "cat-stress-score-playtime-offset-planner" }];

const horseNutritionWeight: Item[] = [{ name: "Horse Calorie & Energy Requirement Calculator (DE / TDN)", slug: "horse-calorie-energy-requirement-de-tdn" }, { name: "Horse Weight Estimator (Heart Girth & Length)", slug: "horse-weight-estimator-girth-length" }, { name: "Horse Feeding Rate Calculator (Forage + Concentrate)", slug: "horse-feeding-rate-forage-concentrate" }, { name: "Horse Hay Intake Calculator (per body weight %)", slug: "horse-hay-intake-bodyweight-percent" }, { name: "Horse Protein & Lysine Requirement Calculator", slug: "horse-protein-lysine-requirement" }, { name: "Horse Electrolyte Need Estimator (Exercise & Heat)", slug: "horse-electrolyte-need-estimator" }, { name: "Horse Body Condition Score Helper (Henneke 1–9)", slug: "horse-body-condition-score-henneke" }];
const horseHydration: Item[] = [{ name: "Horse Water Intake by Temperature & Weight", slug: "horse-water-intake-temperature-weight" }, { name: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", slug: "horse-dehydration-risk-estimator" }];
const horseHealthToxicology: Item[] = [{ name: "Horse Colic Risk Assessment (Feeding & Management)", slug: "horse-colic-risk-assessment" }, { name: "Laminitis Risk Index (BCS + NSC intake)", slug: "horse-laminitis-risk-index" }, { name: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)", slug: "horse-toxic-plant-exposure-risk" }, { name: "Horse NSAID Overdose Risk (Phenylbutazone)", slug: "horse-nsaid-overdose-risk" }, { name: "Horse Selenium Toxicity Threshold (ppm)", slug: "horse-selenium-toxicity-threshold" }, { name: "Horse Salt & Mineral Balance Checker", slug: "horse-salt-mineral-balance-checker" }];
const horseMedicationSupplement: Item[] = [{ name: "Dewormer Dose Calculator (by Drug Class & Weight)", slug: "horse-dewormer-dose-calculator" }, { name: "Phenylbutazone / Flunixin Dose Calculator", slug: "horse-phenylbutazone-flunixin-dose" }, { name: "Electrolyte Powder Mixing Calculator", slug: "horse-electrolyte-powder-mixing" }, { name: "Omega-3 Supplement Planner (EPA/DHA per kg)", slug: "horse-omega-3-supplement-planner" }];
const horseReproduction: Item[] = [{ name: "Horse Gestation (Due Date) Calculator", slug: "horse-gestation-due-date" }, { name: "Foaling Countdown & Lactation Feed Planner", slug: "horse-foaling-countdown-lactation-feed-planner" }];

const birdNutritionWeight: Item[] = [{ name: "Daily Calorie Needs by Body Weight", slug: "bird-daily-calorie-needs-body-weight" }, { name: "Seed-to-Pellet Conversion Planner", slug: "bird-seed-to-pellet-conversion-planner" }, { name: "Hand-Feeding Formula Amount (Chicks)", slug: "bird-hand-feeding-formula-amount-chicks" }, { name: "Vitamin A Requirement Calculator", slug: "bird-vitamin-a-requirement" }, { name: "Calcium Supplement Dosage (Breeding Females)", slug: "bird-calcium-supplement-dosage-breeding-females" }, { name: "Weight Trend Tracker (Weekly Log)", slug: "bird-weight-trend-tracker-weekly" }];
const birdHealthToxicology: Item[] = [{ name: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)", slug: "bird-toxic-foods-exposure-checker" }, { name: "Heavy Metal (Lead/Zinc) Exposure Risk", slug: "bird-heavy-metal-exposure-risk" }, { name: "Feather Plucking & Stress Risk Index", slug: "bird-feather-plucking-stress-risk-index" }, { name: "Egg Binding Risk Estimator", slug: "bird-egg-binding-risk-estimator" }, { name: "Ambient Temperature Safe Zone Calculator", slug: "bird-ambient-temperature-safe-zone" }];
const birdHydration: Item[] = [{ name: "Daily Water Requirement per Weight", slug: "bird-daily-water-requirement-per-weight" }, { name: "Dehydration Signs Estimator", slug: "bird-dehydration-signs-estimator" }];
const birdMedication: Item[] = [{ name: "Antibiotic Dose Reference (mg/kg)", slug: "bird-antibiotic-dose-reference" }, { name: "Omega-3 Supplement Dose (for parrots)", slug: "bird-omega-3-supplement-dose-parrots" }, { name: "Electrolyte & Vitamin C Water Mix Calculator", slug: "bird-electrolyte-vitamin-c-water-mix" }];

const reptileNutritionEnvironment: Item[] = [{ name: "UVB Lighting Distance & Duration Calculator", slug: "reptile-uvb-lighting-distance-duration" }, { name: "Basking Temperature & Gradient Planner", slug: "reptile-basking-temperature-gradient-planner" }, { name: "Daily Feeding Ratio (by Species & Age)", slug: "reptile-daily-feeding-ratio-species-age" }, { name: "Calcium-to-Phosphorus Ratio Calculator", slug: "reptile-calcium-to-phosphorus-ratio" }, { name: "Vitamin D3 Requirement (Supplemental)", slug: "reptile-vitamin-d3-requirement" }, { name: "Feeder Insect Gut-Loading Ratio", slug: "reptile-feeder-insect-gut-loading-ratio" }];
const reptileHealth: Item[] = [{ name: "Dehydration & Shedding Risk Index", slug: "reptile-dehydration-shedding-risk-index" }, { name: "Metabolic Bone Disease Risk Estimator", slug: "reptile-metabolic-bone-disease-risk" }, { name: "Ideal Humidity Range Calculator", slug: "reptile-ideal-humidity-range" }, { name: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", slug: "reptile-growth-curve-python-bearded-dragon-gecko" }, { name: "Thermal Gradient Maintenance Power Estimator", slug: "reptile-thermal-gradient-maintenance-power" }];
const reptileMedication: Item[] = [{ name: "Dewormer & Antibiotic Dose Reference", slug: "reptile-dewormer-antibiotic-dose-reference" }, { name: "Calcium + D3 Supplement Calculator", slug: "reptile-calcium-d3-supplement" }, { name: "Fluid Replacement Volume Calculator", slug: "reptile-fluid-replacement-volume" }];

const fishAquariumVolumeStocking: Item[] = [{ name: "Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)", slug: "aquarium-volume-rectangular-cylindrical-bowfront" }, { name: "Safe Stocking Density (Fish/cm per Litre)", slug: "aquarium-safe-stocking-density-fish-per-litre" }, { name: "Filter Flow Rate Calculator", slug: "aquarium-filter-flow-rate" }, { name: "Water Change Volume Planner", slug: "aquarium-water-change-volume-planner" }, { name: "Heater Wattage Requirement", slug: "aquarium-heater-wattage-requirement" }, { name: "CO₂ Injection Rate Calculator (Planted Tank)", slug: "aquarium-co2-injection-rate-planted-tank" }];
const fishWaterChemistryNutrition: Item[] = [{ name: "pH Adjustment (Acid/Base Buffer) Calculator", slug: "aquarium-ph-adjustment-buffer" }, { name: "Ammonia-to-Nitrite Cycle Time Estimator", slug: "aquarium-ammonia-nitrite-cycle-time" }, { name: "Aquarium Salt Dosage Calculator (Therapeutic)", slug: "aquarium-salt-dosage-therapeutic" }, { name: "Nitrate Reduction Goal Planner (ppm → water change %)", slug: "aquarium-nitrate-reduction-goal-planner" }, { name: "Fish Food Feeding Rate Calculator", slug: "fish-food-feeding-rate" }, { name: "Oxygen Solubility vs. Temperature Table", slug: "oxygen-solubility-vs-temperature-table" }];
const fishPondBreeding: Item[] = [{ name: "Pond Volume & Liner Size Calculator", slug: "pond-volume-liner-size" }, { name: "Koi Feed Planner (Temp + Weight)", slug: "koi-feed-planner-temp-weight" }, { name: "Breeding Tank Volume Planner", slug: "breeding-tank-volume-planner" }];

const smallMammalNutritionWeight: Item[] = [{ name: "Daily Calorie Needs (Species Specific)", slug: "small-mammal-daily-calorie-needs" }, { name: "Weight Maintenance vs. Gain/Loss Planner", slug: "small-mammal-weight-maintenance-gain-loss-planner" }, { name: "Hay & Pellet Intake Calculator", slug: "small-mammal-hay-pellet-intake" }, { name: "Fiber & Protein Ratio Calculator", slug: "small-mammal-fiber-protein-ratio" }, { name: "Vitamin C Requirement (Guinea Pig)", slug: "guinea-pig-vitamin-c-requirement" }, { name: "Calcium Intake Limit (Bladder Stone Prevention)", slug: "small-mammal-calcium-intake-limit" }, { name: "Rabbit Treat Calories & Safe Portion", slug: "rabbit-treat-calories-safe-portion" }, { name: "Ferret Protein/Fat Ratio Checker", slug: "ferret-protein-fat-ratio-checker" }];
const smallMammalHealthToxicology: Item[] = [{ name: "Temperature Stress Risk (Rabbit Heatstroke)", slug: "rabbit-temperature-stress-risk-heatstroke" }, { name: "Dehydration Risk Checker", slug: "small-mammal-dehydration-risk-checker" }, { name: "Common Toxic Foods Reference", slug: "small-mammal-common-toxic-foods-reference" }, { name: "Safe Vegetables & Fruits Portion Calculator", slug: "small-mammal-safe-vegetables-fruits-portion" }, { name: "Parasite Treatment Dose Reference", slug: "small-mammal-parasite-treatment-dose-reference" }];
const smallMammalBehaviorCare: Item[] = [{ name: "Cage Size Requirement Calculator", slug: "small-mammal-cage-size-requirement" }, { name: "Exercise Time Planner (Run Time per Day)", slug: "small-mammal-exercise-time-planner" }, { name: "Bedding Replacement Frequency Estimator", slug: "small-mammal-bedding-replacement-frequency" }];

const TOTAL = dogNutritionWeight.length + dogHydration.length + dogToxicologyHazard.length + dogMedicationDosing.length + dogGrowthSizeMeasures.length + dogActivityFitness.length + dogAgeLongevity.length + dogReproduction.length +
  catNutritionWeight.length + catHydration.length + catToxicologyHazard.length + catMedicationDosing.length + catGrowthSizeMeasures.length + catActivityLifestyle.length + catAgeLongevity.length + catUrinaryKidney.length + catReproduction.length + catGroomingCare.length + catBehaviorEnvironment.length +
  horseNutritionWeight.length + horseHydration.length + horseHealthToxicology.length + horseMedicationSupplement.length + horseReproduction.length +
  birdNutritionWeight.length + birdHealthToxicology.length + birdHydration.length + birdMedication.length +
  reptileNutritionEnvironment.length + reptileHealth.length + reptileMedication.length +
  fishAquariumVolumeStocking.length + fishWaterChemistryNutrition.length + fishPondBreeding.length +
  smallMammalNutritionWeight.length + smallMammalHealthToxicology.length + smallMammalBehaviorCare.length;
// ===== AUTOGEN PLACEHOLDER END =====

export default function PetsCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🐾" size={38} className="text-primary" label="Pets" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Pets & Companion Animals Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Practical calculators for dogs, cats, horses, birds, reptiles, fish, and small mammals — covering nutrition and weight, hydration, toxicology and hazard intake, medication and dosing, growth and body measures, activity and environment, age and longevity, and reproduction.
                    </p>
                    <p>
                      Find species-aware tools for daily calorie needs, water intake, safe dosing, exposure risk assessment, growth planning, activity targets, environmental ranges, and breeding timelines.
                    </p>
                    <p>
                      Organized for clarity and quick decisions, with each section offering concise helpers aligned to everyday care and veterinary guidance.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    A hub of multi‑species calculators (dogs, cats, horses, birds, reptiles, fish, and small mammals) spanning nutrition, hydration, toxicology, dosing, growth, activity, age/longevity, reproduction, and environment.
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="🐶"
              title="Dogs — Nutrition & Weight"
              description="Calorie needs, weight targets, feeding plans and macronutrient guidance."
              items={dogNutritionWeight}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Hydration"
              description="Daily water intake and dehydration risk indicators by body weight and symptoms."
              items={dogHydration}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Toxicology & Hazard"
              description="Exposure risk helpers for chocolate, grapes/raisins, allium, xylitol, caffeine and more."
              items={dogToxicologyHazard}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Medication & Dosing"
              description="Reference doses for common medications and supplements. Educational, not a substitute for veterinary advice."
              items={dogMedicationDosing}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Growth & Body Measures"
              description="Puppy adult size predictor, body condition scoring, crate/harness sizing and indices."
              items={dogGrowthSizeMeasures}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Activity & Fitness"
              description="Calories burned on walks, step goals and safe temperature windows for exercise."
              items={dogActivityFitness}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Age & Longevity"
              description="Breed‑aware human‑years conversion and life expectancy estimator."
              items={dogAgeLongevity}
              base="/pets"
            />
            <Section
              emoji="🐶"
              title="Dogs — Reproduction"
              description="Gestation due date and whelping stage timeline planners."
              items={dogReproduction}
              base="/pets"
            />

            <Section
              emoji="🐱"
              title="Cats — Nutrition & Weight"
              description="Calorie needs, weight targets, kitten and senior adjustments, treat allowance and macros."
              items={catNutritionWeight}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Hydration"
              description="Daily water intake and dehydration risk based on intake and symptoms."
              items={catHydration}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Toxicology & Hazard"
              description="Risk guides for chocolate, allium, grapes/raisins, caffeine, essential oils and lilies."
              items={catToxicologyHazard}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Medication & Dosing"
              description="Reference doses for common medications and omega‑3 supplements. Educational, not veterinary advice."
              items={catMedicationDosing}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Growth & Size Measures"
              description="Kitten adult weight predictor, body condition scoring, carrier/harness sizing and indices."
              items={catGrowthSizeMeasures}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Activity & Lifestyle"
              description="Calorie adjustment by activity, play session planner and rest vs. active balance."
              items={catActivityLifestyle}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Age & Longevity"
              description="Human‑years conversion, senior care readiness checklist and life expectancy estimator."
              items={catAgeLongevity}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Urinary & Kidney"
              description="Litter box output tracking, intake vs. output balance and phosphorus per meal estimate."
              items={catUrinaryKidney}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Reproduction"
              description="Gestation due date and kitten weaning timeline with feeding amounts."
              items={catReproduction}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Grooming & Care"
              description="Shedding/combing time planning and nail trimming interval guidance."
              items={catGroomingCare}
              base="/pets"
            />
            <Section
              emoji="🐱"
              title="Cats — Behavior & Environment"
              description="Multi‑cat litter box counts, room enrichment planning and stress offset through play."
              items={catBehaviorEnvironment}
              base="/pets"
            />

            <Section
              emoji="🐴"
              title="Horses — Nutrition & Weight"
              description="Energy requirements (DE/TDN), feeding rates, hay intake, protein/lysine and electrolytes."
              items={horseNutritionWeight}
              base="/pets"
            />
            <Section
              emoji="🐴"
              title="Horses — Hydration"
              description="Water intake by temperature and weight; dehydration risk by quick checks."
              items={horseHydration}
              base="/pets"
            />
            <Section
              emoji="🐴"
              title="Horses — Health & Toxicology"
              description="Colic and laminitis risk indices; toxic plant exposure and mineral balance helpers."
              items={horseHealthToxicology}
              base="/pets"
            />
            <Section
              emoji="🐴"
              title="Horses — Medication & Supplement"
              description="Dewormer dosing, NSAID dosing, electrolyte mixing and omega‑3 planning."
              items={horseMedicationSupplement}
              base="/pets"
            />
            <Section
              emoji="🐴"
              title="Horses — Reproduction"
              description="Gestation due date and foaling countdown with lactation feed planning."
              items={horseReproduction}
              base="/pets"
            />

            <Section
              emoji="🕊️"
              title="Birds — Nutrition & Weight"
              description="Daily calories by weight, seed‑to‑pellet conversion, hand‑feeding, vitamin A and calcium."
              items={birdNutritionWeight}
              base="/pets"
            />
            <Section
              emoji="🕊️"
              title="Birds — Health & Toxicology"
              description="Toxic foods, heavy metal exposure, feather‑plucking stress, egg binding and temperature safety."
              items={birdHealthToxicology}
              base="/pets"
            />
            <Section
              emoji="🕊️"
              title="Birds — Hydration"
              description="Daily water requirement per weight and dehydration signs estimator."
              items={birdHydration}
              base="/pets"
            />
            <Section
              emoji="🕊️"
              title="Birds — Medication"
              description="Antibiotic dosing references, omega‑3 supplementation and electrolyte/vitamin C water mixes."
              items={birdMedication}
              base="/pets"
            />

            <Section
              emoji="🦎"
              title="Reptiles — Nutrition & Environment"
              description="UVB distance/duration, basking gradients, feeding ratios, Ca:P balance, D3 and gut‑loading."
              items={reptileNutritionEnvironment}
              base="/pets"
            />
            <Section
              emoji="🦎"
              title="Reptiles — Health"
              description="Dehydration and shedding risk, MBD risk, humidity ranges, growth curves and thermal power."
              items={reptileHealth}
              base="/pets"
            />
            <Section
              emoji="🦎"
              title="Reptiles — Medication"
              description="Dewormer/antibiotic dosing references, calcium + D3 supplements and fluid replacement volumes."
              items={reptileMedication}
              base="/pets"
            />

            <Section
              emoji="🐠"
              title="Fish & Aquatic — Volume & Stocking"
              description="Aquarium volume, safe stocking density, filter flow, water changes, heater wattage and CO₂ rate."
              items={fishAquariumVolumeStocking}
              base="/pets"
            />
            <Section
              emoji="🐠"
              title="Fish & Aquatic — Water Chemistry & Nutrition"
              description="pH buffer adjustment, cycle timing, therapeutic salt dosing, nitrate goals, feeding and oxygen."
              items={fishWaterChemistryNutrition}
              base="/pets"
            />
            <Section
              emoji="🐠"
              title="Fish & Aquatic — Pond & Breeding"
              description="Pond volumes and liners, koi feed planning and breeding tank volumes."
              items={fishPondBreeding}
              base="/pets"
            />

            <Section
              emoji="🐹"
              title="Small Mammals — Nutrition & Weight"
              description="Daily calories, weight plans, hay/pellet intake, fiber/protein, vitamin C and calcium limits."
              items={smallMammalNutritionWeight}
              base="/pets"
            />
            <Section
              emoji="🐹"
              title="Small Mammals — Health & Toxicology"
              description="Heat stress risk, dehydration checks, toxic foods reference, safe produce and parasite doses."
              items={smallMammalHealthToxicology}
              base="/pets"
            />
            <Section
              emoji="🐹"
              title="Small Mammals — Behavior & Care"
              description="Cage size requirements, daily exercise planning and bedding replacement frequency."
                         {/* All pets calculators from registry */}
            <RegistryCategorySection
              category="pets"
              title="More Pets Calculators"
              className="mt-10"
            />

             items={smallMammalBehaviorCare}
              base="/pets"
            />

            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({ emoji, title, description, items, base }: { emoji: string; title: string; description: string; items: Item[]; base: string }) {
  const [left, right] = splitTwoColumns(items);
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>
      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link to={`${base}/${it.slug}`} className="text-primary hover:underline text-base md:text-[1.05rem] font-medium">
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link to={`${base}/${it.slug}`} className="text-primary hover:underline text-base md:text-[1.05rem] font-medium">
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
