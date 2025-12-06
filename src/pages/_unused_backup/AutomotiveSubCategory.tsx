import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";

const AutomotiveSubCategory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subCategory } = (location.state as any) || {};

  // Se acessar direto a URL sem state, volta para /automotive
  useEffect(() => {
    if (!subCategory) navigate("/automotive", { replace: true });
  }, [subCategory, navigate]);

  if (!subCategory) return null;

  const handleCalculatorClick = (calculator: any) => {
    navigate(
      `/automotive/${subCategory.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}/${calculator.key}`,
      {
        state: {
          calculator: {
            ...calculator,
            category: "Automotive",
            description: `Calculate ${calculator.name
              .toLowerCase()
              .replace(" calculator", "")} for your vehicle.`,
            formula: "Calculation details will be shown here",
            sources: [
              { title: "Automotive Standards", url: "https://example.com" },
              { title: "Vehicle Manuals", url: "https://example.com" },
            ],
          },
          subCategory,
        },
      }
    );
  };

  const subSlug = subCategory.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subCategory.title} - Automotive Calculators | Smart Kit Now`}
        description={`Professional ${subCategory.title.toLowerCase()} for accurate vehicle performance and maintenance.`}
        keywords={[
          "automotive calculators",
          subCategory.title.toLowerCase(),
          "vehicle performance",
          "maintenance",
        ]}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Automotive Calculators", url: "https://www.smartkitnow.com/automotive" },
          {
            name: subCategory.title,
            url: `https://www.smartkitnow.com/automotive/${subSlug}`,
          },
        ]}
      />

      <Header />

      <main className="pt-20">
        <AdRailLayout>
          <section className="py-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/automotive")}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
            Back
              </button>
            </div>

            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                {subCategory.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Professional automotive calculators for accurate performance analysis and maintenance planning.
              </p>
            </div>

            {/* Calculators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subCategory.calculators.map((calculator: any, index: number) => (
                <Card
                  key={index}
                  className="group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover/card:text-primary transition-colors">
                      {calculator.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleCalculatorClick(calculator)}
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                    >
                      Use Calculator
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </AdRailLayout>
      </main>

      <Footer />
    </div>
  );
};

export default AutomotiveSubCategory;
