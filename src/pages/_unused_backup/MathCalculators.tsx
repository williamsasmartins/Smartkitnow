// src/pages/MathCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function MathCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="math"
      description="Explore hubs of math tools: percentages, fractions, everyday math, algebra, geometry and statistics."
      canonical="https://www.smartkitnow.com/math"
      titleOverride="Math & Algebra Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
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
