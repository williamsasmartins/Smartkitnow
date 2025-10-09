// src/pages/CommonConvertersPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const links = [
  { label: "Speed Conversion",        to: "/conversion/speed/mph-to-kmh" },
  { label: "Temperature Conversion",  to: "/conversion/temperature/f-to-c" },
  { label: "Time Conversion",         to: "/conversion/time/sec-to-min" },
  { label: "Conversion Calculator",   to: "/conversion/popular" }, // hub completo
  { label: "Angle Conversion",        to: "/conversion/angle/deg-to-rad" },
  { label: "Area Conversion",         to: "/conversion/area/sqft-to-sqm" },
  { label: "Length Conversion",       to: "/conversion/length/in-to-cm" },
  { label: "Weight Conversion",       to: "/conversion/weight/lb-to-kg" },
  { label: "Pressure Conversion",     to: "/conversion/pressure/psi-to-kpa" },
  { label: "Volume Conversion",       to: "/conversion/volume/gal-to-l" },
];

export default function CommonConvertersPage() {
  const navigate = useNavigate();

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
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 40, height: 40, backgroundColor: "rgba(250,204,21,0.18)", color: "#ca8a04" }}
                  aria-hidden="true"
                >
                  <Star className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  Common Converters
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-2">
                {links.map((lnk) => (
                  <Link
                    key={lnk.to}
                    to={lnk.to}
                    className="text-sm underline underline-offset-2 hover:opacity-90"
                    style={{ color: "#5c82ee" }}
                  >
                    {lnk.label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
