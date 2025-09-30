import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MATH_SUBCATALOG, MiniCardLink } from "@/data/mathSubcatalog";
import SEOHead from "@/components/SEOHead";

export default function MathSubCategory() {
  const navigate = useNavigate();
  const { subcategory } = useParams<{ subcategory: string }>();

  const section = subcategory ? MATH_SUBCATALOG[subcategory] : undefined;
  const title = section?.title ?? "Math Subcategory";
  const description =
    section?.description ?? "Explore focused math tools and conversions.";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${title} · Smart Kit Now`}
        description={description}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
          { name: title, url: typeof window !== "undefined" ? window.location.href : "" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          url: typeof window !== "undefined" ? window.location.href : "",
          description,
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate("/math")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  {title}
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  {description}
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          {!section ? (
            <p className="text-center" style={{ color: "#747886" }}>
              Nothing here yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {section.items.map((it) => (
                <MiniCardLink key={it.slug} item={it} />
              ))}
            </div>
          )}
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
