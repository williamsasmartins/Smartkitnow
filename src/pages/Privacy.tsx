// src/pages/Privacy.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

export default function Privacy() {
  const navigate = useNavigate();
  const updated = "September 20, 2025";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
  title="Privacy Policy · SmartKitNow"
  description="Privacy Policy for SmartKitNow — how we collect, use, and protect your information."
  canonical="https://www.smartkitnow.com/privacy"
  breadcrumbs={[
    { name: "Home", url: "https://www.smartkitnow.com/" },
    { name: "Privacy Policy", url: "https://www.smartkitnow.com/privacy" },
  ]}
  schema={{
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy",
    url: "https://www.smartkitnow.com/privacy",
    description: "How SmartKitNow collects, uses, and protects information.",
    dateModified: "2025-09-20",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartkitnow.com/" },
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://www.smartkitnow.com/privacy" }
      ]
    },
    publisher: { "@type": "Organization", name: "SmartKitNow", url: "https://www.smartkitnow.com/" }
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
              Privacy Policy
            </h1>
            <p className="text-lg" style={{ color: "#747886" }}>
              Last updated: {updated}
            </p>
          </header>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                At <strong>Smart Kit Now</strong>, your privacy matters. This policy explains what we collect,
                how we use it, and your choices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <ul className="list-disc pl-5 space-y-2">
                <li>Usage data via Google Analytics (pages visited, device, location).</li>
                <li>Contact info only if you share it with us (email, form submissions).</li>
                <li>Cookies and similar technologies to remember preferences.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How We Use Information</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <ul className="list-disc pl-5 space-y-2">
                <li>To improve calculators and user experience.</li>
                <li>To monitor site performance.</li>
                <li>To respond to inquiries or feedback.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                We may use trusted providers like Google Analytics and Google AdSense. These have their own privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <ul className="list-disc pl-5 space-y-2">
                <li>You may disable cookies in your browser.</li>
                <li>You may request access or deletion of personal data.</li>
                <li>
                  Contact us at{" "}
                  <a className="underline" href="mailto:contact@smartkitnow.com">
                    contact@smartkitnow.com
                  </a>
                  .
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SiteFeedbackForm title="Questions or suggestions?" />
          <ShareThisCalculator />
        </section>
      </main>

    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };
