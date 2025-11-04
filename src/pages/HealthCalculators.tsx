// src/pages/HealthCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function HealthCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="health"
      description="Plan, track, and understand your health with fast, transparent math. From BMI and body fat to BMR, TDEE, calories, macros, heart rate, VO₂ max, and hydration, each calculator uses clear formulas and sensible defaults to turn inputs into actionable insights. See how small changes in activity, diet, or sleep affect energy balance and long-term progress—without guesswork.\n\nExplore focused sections for Weight & Body Composition, Metabolism & Energy, Nutrition & Macros, Exercise & Performance, and Health Metrics. Learn as you calculate with plain-English explanations and examples, then adjust inputs to fit your goals on any device."
      canonical="https://www.smartkitnow.com/health"
      titleOverride="Health & Fitness Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Health & Fitness Calculators", url: "https://www.smartkitnow.com/health" },
      ]}
      marginTopClass="mt-[156px] md:mt-[176px]"
      showRightRail={true}
      showTopBanner={true}
      showBottomBanner={true}
      railsSticky={false}
      backTo="/"
    />
  );
}
