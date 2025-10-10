import CategoryPageTemplate, { defaultPageMeta } from "@/components/layouts/CategoryPageTemplate";
import { FINANCIAL_TITLE, FINANCIAL_DESCRIPTION, FINANCIAL_SECTIONS } from "@/data/categories/financial.data";

export const pageMeta = { ...defaultPageMeta, minContentScore: 3 };

export default function FinancialCalculatorPage() {
  return (
    <CategoryPageTemplate
      title={FINANCIAL_TITLE}
      description={FINANCIAL_DESCRIPTION}
      sections={FINANCIAL_SECTIONS}
    />
  );
}