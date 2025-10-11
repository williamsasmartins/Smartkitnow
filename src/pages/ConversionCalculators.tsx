// src/pages/ConversionCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function ConversionCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="conversion"
      description="Explore Popular Unit Converters, Cooking & Baking Converters, and Common Unit Converters."
      canonical="https://www.smartkitnow.com/conversion"
      titleOverride="Conversion Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
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
