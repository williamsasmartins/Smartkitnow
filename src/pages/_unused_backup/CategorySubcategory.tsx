import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
  subcategoryIcon,
  calcLink,
} from "@/data/calculatorRegistry";
import { PALETTE } from "@/components/theme/palette";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function CategorySubcategory() {
  const navigate = useNavigate();
  const { category = "", subcategory = "" } = useParams<{ category: string; subcategory: string }>();

  const title =
    SUBCATEGORY_TITLES[category]?.[subcategory] ??
    subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const fullTitle = `${title} — ${FRIENDLY_TITLES[category] || category.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}`;

  const calculators = listByCategorySubcategory(category, subcategory);

  return (
    <div className="min-h-screen">
      <main className="pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <Button
                  variant="default"
                  onClick={() => navigate(`/${category}`)}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2" style={{ color: PALETTE.brand.title }}>
                <span className="text-[26px] leading-none select-none" aria-hidden="true">{subcategoryIcon(subcategory, category)}</span>
                {fullTitle}
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: PALETTE.brand.text }}>
                Explore calculators in {title.toLowerCase()}.
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Card key={calc.slug} className="group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader className="flex flex-row items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, backgroundColor: "rgba(59,130,246,0.12)", color: "#3b82f6" }} aria-hidden="true">
                    {/* icon placeholder */}
                  </span>
                  <CardTitle className="text-lg font-semibold" style={{ color: "#000000" }}>
                    <CalculatorLink to={calcLink(calc)}>{calc.title}</CalculatorLink>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: "#747886" }}>
                    {calc.description || "Open calculator"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="mt-6 skn-typography text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
                <ShareThisCalculator />
              </div>
            </div>
          </section>
        </AdRailLayout>
      </main>
    </div>
  );
}
