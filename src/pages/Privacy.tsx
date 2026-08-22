// src/pages/Privacy.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";


export default function Privacy() {
  const navigate = useNavigate();
  const updated = "September 20, 2025";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Privacy Policy · SmartKitNow"
        description="Privacy Policy for SmartKitNow — how we collect, use, and protect your information."
        canonical="https://www.smartkitnow.com/privacy"
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
              <CardTitle>Advertising &amp; Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/90 space-y-4">
              <p>
                We use Google AdSense to serve advertisements on this site. Third-party
                vendors, including Google, use cookies to serve ads based on your prior
                visits to this and other websites.
              </p>
              <p>
                Google&rsquo;s use of advertising cookies (including the{" "}
                <strong>DoubleClick</strong> cookie) enables it and its partners to serve
                ads to you based on your visit to this site and/or other sites on the
                Internet. These cookies may be used for ad personalization, frequency
                capping, and measuring ad performance.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You may opt out of personalized advertising by visiting Google&rsquo;s{" "}
                  <a
                    className="underline"
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can opt out of a third-party vendor&rsquo;s use of cookies for
                  personalized advertising by visiting{" "}
                  <a
                    className="underline"
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aboutads.info
                  </a>
                  .
                </li>
                <li>
                  For more information on how Google uses data when you use our site, see{" "}
                  <a
                    className="underline"
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    How Google uses information from sites or apps that use its services
                  </a>
                  .
                </li>
              </ul>
              <p>
                On first visit we ask for your consent before non-essential (analytics and
                advertising) cookies are used. Until you consent, advertising and analytics
                storage are set to <em>denied</em> via Google Consent Mode. You can change
                your choice at any time on our{" "}
                <a className="underline" href="/cookie-settings">
                  Cookie Settings
                </a>{" "}
                page.
              </p>
              <p>
                We also use Google Analytics to understand how visitors use the site. It
                sets its own cookies and is governed by{" "}
                <a
                  className="underline"
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google&rsquo;s Privacy Policy
                </a>
                .
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
          
        </section>
      </main>

    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };
