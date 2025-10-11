// src/pages/CommonConvertersPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";
import { categoryIcon } from "@/data/calculatorRegistry";

const links = [
  { title: "Speed Conversion",        to: "/conversion/speed/mph-to-kmh" },
  { title: "Temperature Conversion",  to: "/conversion/temperature/f-to-c" },
  { title: "Time Conversion",         to: "/conversion/time/sec-to-min" },
  { title: "Conversion Calculator",   to: "/conversion/popular" }, // hub completo
  { title: "Angle Conversion",        to: "/conversion/angle/deg-to-rad" },
  { title: "Area Conversion",         to: "/conversion/area/sqft-to-sqm" },
  { title: "Length Conversion",       to: "/conversion/length/in-to-cm" },
  { title: "Weight Conversion",       to: "/conversion/weight/lb-to-kg" },
  { title: "Pressure Conversion",     to: "/conversion/pressure/psi-to-kpa" },
  { title: "Volume Conversion",       to: "/conversion/volume/gal-to-l" },
];

export default function CommonConvertersPage() {
  const navigate = useNavigate();
  const convEmoji = categoryIcon("conversion");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Common Unit Converters · SmartKitNow"
        description="Quick access to the most common unit conversions."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
          { name: "Common Unit Converters", url: "https://www.smartkitnow.com/conversion/common" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Common Unit Converters",
          url: "https://www.smartkitnow.com/conversion/common",
          description: "Ten frequently-used conversion shortcuts.",
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
                  onClick={() => navigate("/conversion")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Common Unit Converters
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  Ten quick links to the most-used conversions.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto max-w-5xl">
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl text-xl"
                  style={{ width: 40, height: 40 }}
                  aria-hidden="true"
                >
                  {convEmoji}
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  Common Converters
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <CalculatorListBlue items={links.slice(0, Math.ceil(links.length / 2))} />
                  <CalculatorListBlue items={links.slice(Math.ceil(links.length / 2))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
