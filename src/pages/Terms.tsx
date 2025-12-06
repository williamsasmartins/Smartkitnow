// src/pages/Terms.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";


export default function Terms() {
  const navigate = useNavigate();
  const updated = "September 20, 2025";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Terms of Use · SmartKitNow"
        description="Terms of Use for SmartKitNow — rules governing access and usage."
        canonical="https://www.smartkitnow.com/terms"
      />




      <main className="pt-48 sm:pt-20">
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
              Terms of Use
            </h1>
            <p className="text-lg" style={{ color: "#747886" }}>
              Last updated: {updated}
            </p>
          </header>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                By using Smart Kit Now, you agree to these Terms. If you do not agree, please stop using the site.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Use of Tools</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <ul className="list-disc pl-5 space-y-2">
                <li>Calculators are for informational and educational purposes only.</li>
                <li>
                  Results are not guaranteed. Always verify before financial, medical, or construction decisions.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                All content, design, and code on Smart Kit Now are the property of Smart Kit Now and cannot be reused without permission.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                Our site may link to external resources. We are not responsible for their content or practices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                Smart Kit Now is not liable for any losses or damages resulting from the use of our site.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Changes</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90">
              <p>
                We may update these Terms at any time. By continuing to use the site, you accept the revised Terms.
              </p>
            </CardContent>
          </Card>
        </div>
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SiteFeedbackForm title="Questions or suggestions?" />
          
        </section>
      </main>


    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };