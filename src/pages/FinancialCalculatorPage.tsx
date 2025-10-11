import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { FINANCIAL_TITLE, FINANCIAL_DESCRIPTION, FINANCIAL_SECTIONS } from "@/data/categories/financial.data";

export const pageMeta = { allowAds: true, minContentScore: 3 };

export default function FinancialCalculatorPage() {
  return (
    <CategoryPageTemplate
      kind="financial"
      title={FINANCIAL_TITLE || "Financial Calculators"}
      description={FINANCIAL_DESCRIPTION}
      sections={FINANCIAL_SECTIONS}
      minContentScore={3}
      /* não passe headerSlot aqui, para usar o header padrão do template */
    />
  );
}