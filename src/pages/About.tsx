// src/pages/About.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import { CONTACT_EMAIL } from "@/config/contact";


export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="About Us · SmartKitNow"
        description="Who we are, what Smart Kit Now's 731 free calculators cover, how the site is funded, and how to reach us."
        canonical="https://www.smartkitnow.com/about"
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
                Most calculator sites hand you a number and leave you to trust it. We would rather show the equation,
                walk through an example, and name the source it came from — so you can tell whether the answer applies
                to your situation before you act on it.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>What You’ll Find Here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Smart Kit Now currently hosts <strong>731 free calculators across 17 categories</strong> — financial,
                health, construction, electrical, automotive, cooking, math, science, conversion, pets, sports, time
                and date, video, marketing, everyday life, and more. The largest collections are pet care (162 tools),
                personal finance (76), automotive (55), video and creator tools (51), and sports and fitness (48).
              </p>
              <p>
                Alongside the tools we publish <strong>132 smart-tip guides</strong>, <strong>16 long-form
                articles</strong>, daily quotes and horoscopes, and <strong>73 browser games</strong> for when the
                math is done. Everything is free, works on mobile and desktop, and requires no account.
              </p>
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
              <p>
                In practice that means a homeowner pricing out a brick wall before calling a mason, a nurse
                double-checking a body surface area figure, a freelancer sizing a quarterly tax set-aside, a lifter
                estimating a one-rep max, and a dog owner working out a sensible daily portion. Different problems,
                same requirement: a number you can defend.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>What Makes Our Calculators Different</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                We build every tool around a published formula rather than an in-house approximation — Mifflin-St Jeor
                for basal metabolic rate, the US Navy circumference method for body fat, the standard amortization
                formula for loans, Brick Industry Association technical notes for brick and mortar quantities, and NEC
                tables for conductor and breaker sizing. The source is named on the page so you can check it.
              </p>
              <p>
                Of our calculator pages, <strong>511 print the formula itself</strong> with every variable defined and{" "}
                <strong>496 include a full worked example</strong> you can follow line by line. Results are
                independently recomputed against the published formula before a tool ships, and in both metric and
                imperial where both are offered. Our{" "}
                <Link className="underline" to="/editorial-policy">
                  Editorial Policy &amp; Methodology
                </Link>{" "}
                explains the sourcing, review, and correction process in full.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How the Site Is Funded</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Smart Kit Now is free and paid for by <strong>advertising</strong>. We say that plainly because you
                deserve to know who pays for what you are reading. Advertisers have no say in which calculators we
                build, which formulas we use, or what our results report, and ads are never presented as part of a
                calculator&rsquo;s output. Where a page carries a recommended-resources block, commercial entries are
                labelled as sponsored.
              </p>
              <p>
                Our results are informational estimates, not financial, medical, veterinary, legal, or engineering
                advice. For decisions that carry real consequences, check our figures with a qualified professional.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Found a calculator that returns the wrong number? Want a tool we don&rsquo;t have yet? Email us at{" "}
                <a className="underline font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>{" "}
                or use the{" "}
                <Link className="underline" to="/contact">
                  contact form
                </Link>
                . Corrections with the page URL and the inputs you used get looked at first — they are the fastest way
                to make the site better for everyone.
              </p>
            </CardContent>
          </Card>
        <section className="mt-10 space-y-3">
          <SiteFeedbackForm title="Questions or suggestions?" compact={true} />
          
        </section>
        </div>
      </main>

    </div>
  );
}
