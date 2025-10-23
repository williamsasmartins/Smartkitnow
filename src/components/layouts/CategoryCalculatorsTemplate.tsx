import React from "react";
import CategoryPageTemplate, { type CategorySection } from "@/components/layouts/CategoryPageTemplate";

export type CategoryCalculatorsTemplateProps = {
  category: string;
  titleOverride?: string;
  description?: string;
  canonical?: string; // reservado para SEO; sem efeito funcional aqui
  backTo?: string;    // opcional: exibe link de retorno
  sections?: CategorySection[];
  minContentScore?: number;
};

const toKind = (category: string): string => {
  const c = category.toLowerCase();
  if (c.startsWith("smart")) return "tips";
  if (c.includes("quote")) return "quotes";
  if (c.includes("recipe")) return "recipes";
  return c; // usa diretamente quando já é uma chave conhecida
};

export default function CategoryCalculatorsTemplate({
  category,
  titleOverride,
  description,
  canonical,
  backTo,
  sections = [],
  minContentScore = 3,
}: CategoryCalculatorsTemplateProps) {
  const kind = toKind(category);

  const headerSlot = backTo ? (
    <div className="mt-2">
      <a href={backTo} className="text-[var(--skn-brand)] underline underline-offset-2 hover:decoration-2">
        ← Back
      </a>
    </div>
  ) : null;

  return (
    <CategoryPageTemplate
      title={titleOverride}
      description={description}
      sections={sections}
      headerSlot={headerSlot}
      minContentScore={minContentScore}
      kind={kind}
    />
  );
}