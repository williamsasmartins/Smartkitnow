// src/pages/CookingSubCategory.tsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { listByCategorySubcategory, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function titleCaseFromSlug(slug?: string) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const CookingSubCategory: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const items = listByCategorySubcategory("cooking", subcategory);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            {FRIENDLY_TITLES.cooking}
            {subcategory ? ` · ${titleCaseFromSlug(subcategory)}` : ""}
          </h1>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <Card key={it.slug} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{it.name}</h3>
                  {/* IMPORTANTE: usar SEMPRE o slug vindo do registry */}
                  <Link to={`/cooking/${subcategory ?? it.subcategory}/${it.slug}`}>
                    <Button size="sm">Open</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookingSubCategory;
