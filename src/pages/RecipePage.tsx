import CategoryPageTemplate, { defaultPageMeta } from "@/components/layouts/CategoryPageTemplate";
import { RECIPES_TITLE, RECIPES_DESCRIPTION, RECIPES_SECTIONS } from "@/data/categories/recipes.data";

export const pageMeta = { ...defaultPageMeta, minContentScore: 3 };

export default function RecipePage() {
  return (
    <CategoryPageTemplate
      title={RECIPES_TITLE}
      description={RECIPES_DESCRIPTION}
      sections={RECIPES_SECTIONS}
    />
  );
}