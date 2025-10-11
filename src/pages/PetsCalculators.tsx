// src/pages/PetsCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function PetsCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="pets"
      description="Pet care calculators: feeding, health, growth tracking, and training helpers with clear guidance."
      canonical="https://www.smartkitnow.com/pets"
      titleOverride="Pets Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Pets Calculators", url: "https://www.smartkitnow.com/pets" },
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
