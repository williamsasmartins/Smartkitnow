import CategoryPageTemplate, { defaultPageMeta } from "@/components/layouts/CategoryPageTemplate";
import { HEALTH_TITLE, HEALTH_DESCRIPTION, HEALTH_SECTIONS } from "@/data/categories/health.data";

export const pageMeta = { ...defaultPageMeta, minContentScore: 3 };

export default function HealthCalculatorPage() {
  return (
    <CategoryPageTemplate
      title={HEALTH_TITLE}
      description={HEALTH_DESCRIPTION}
      sections={HEALTH_SECTIONS}
    />
  );
}