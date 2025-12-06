// src/pages/FinancialCalculators.tsx
import React from "react";
import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

export default function FinancialCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="financial"
      description="Money touches every decision we make—choosing a mortgage, planning a budget, comparing loans, estimating taxes, or deciding where to invest. Our Financial Calculators are built to turn uncertainty into clear, actionable numbers. Each tool uses transparent formulas, sensible defaults, and instant results so you can compare rates, project returns, model monthly payments, forecast long-term savings, and understand the real impact of interest, fees, and inflation. Whether you’re a business owner validating cash flow, a student learning finance, or simply planning for everyday life, you’ll get fast, accurate calculations you can trust and share.\n\nBrowse focused sections for Loan & Interest, Investment, Personal Finance, Tax & Income, Debt & Credit, and Currency & Inflation. Learn as you calculate with plain-English explanations and examples, then adjust inputs to see how small changes affect outcomes. Make confident money decisions—quickly, clearly, and with zero guesswork."
      canonical="https://www.smartkitnow.com/financial"
      titleOverride="Financial Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Financial Calculators", url: "https://www.smartkitnow.com/financial" },
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
