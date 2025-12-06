// src/pages/CookingCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function CookingCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="cooking"
      description="Cooking & baking calculators: timers, conversions, measurements, and recipe scaling with clear explanations."
      canonical="https://www.smartkitnow.com/cooking"
      titleOverride="Cooking & Baking Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Cooking & Baking Calculators", url: "https://www.smartkitnow.com/cooking" },
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
