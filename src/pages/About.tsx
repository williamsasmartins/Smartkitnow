// src/pages/About.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
  title="About Us · SmartKitNow"
  description="Learn about SmartKitNow — mission, values, and the team building accurate, fast calculators."
  canonical="https://www.smartkitnow.com/about"
  breadcrumbs={[
    { name: "Home", url: "https://www.smartkitnow.com/" },
    { name: "About Us", url: "https://www.smartkitnow.com/about" },
  ]}
  schema={{
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About SmartKitNow",
    url: "https://www.smartkitnow.com/about",
    description: "Learn about SmartKitNow — mission, values, and the team.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartkitnow.com/" },
        { "@type": "ListItem", position: 2, name: "About Us", item: "https://www.smartkitnow.com/about" }
      ]
    },
    isPartOf: { "@type": "WebSite", name: "SmartKitNow", url: "https://www.smartkitnow.com/" },
    publisher: {
      "@type": "Organization",
      name: "SmartKitNow",
      url: "https://www.smartkitnow.com/",
      logo: { "@type": "ImageObject", url: "https://www.smartkitnow.com/logo.png" }
    }
  }}
/>



      <main className="pt-20">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
          <div className="mb-2">
            <Button
              variant="default"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
              style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#5c82ee" }}>
              About Smart Kit Now
            </h1>
            <p className="text-lg" style={{ color: "#747886" }}>
              Smart Kit Now is your hub for fast, reliable, easy-to-use calculators.
            </p>
          </header>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                We help people make better decisions with clear, accurate tools for everyday tasks — from{" "}
                <strong>construction estimating</strong> and <strong>financial planning</strong> to{" "}
                <strong>health & fitness</strong> and <strong>unit conversions</strong>.
              </p>
              <p>
                Each calculator is designed for clarity: clean UI, sensible defaults, and formulas you can understand.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>What You’ll Find Here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <ul className="list-disc pl-5 space-y-2">
                <li>Accurate formulas with transparent explanations and examples.</li>
                <li>Responsive design that works great on mobile and desktop.</li>
                <li>Continuous improvements based on real user feedback.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Who We Serve</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Students, DIYers, contractors, small businesses, and anyone who wants quick, trustworthy results
                without the headache.
              </p>
            </CardContent>
          </Card>
        <section className="mt-10 space-y-3">
          <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
          <ShareThisCalculator />
        </section>
        </div>
      </main>

    </div>
  );
}
