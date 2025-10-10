import CategoryPageTemplate, { defaultPageMeta } from "@/components/layouts/CategoryPageTemplate";
import { TVVIDEO_TITLE, TVVIDEO_DESCRIPTION, TVVIDEO_SECTIONS } from "@/data/categories/tvVideo.data";

export const pageMeta = { ...defaultPageMeta, minContentScore: 3 };

export default function TVCalculatorPage() {
  return (
    <CategoryPageTemplate
      title={TVVIDEO_TITLE}
      description={TVVIDEO_DESCRIPTION}
      sections={TVVIDEO_SECTIONS}
    />
  );
}