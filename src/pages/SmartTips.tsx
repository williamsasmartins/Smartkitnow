import CategoryPageTemplate, { defaultPageMeta } from "@/components/layouts/CategoryPageTemplate";
import { SMART_TIPS_TITLE, SMART_TIPS_DESCRIPTION, SMART_TIPS_SECTIONS } from "@/data/categories/smartTips.data";

export const pageMeta = { ...defaultPageMeta, minContentScore: 3 };

export default function SmartTips() {
  return (
    <CategoryPageTemplate
      title={SMART_TIPS_TITLE}
      description={SMART_TIPS_DESCRIPTION}
      sections={SMART_TIPS_SECTIONS}
    />
  );
}