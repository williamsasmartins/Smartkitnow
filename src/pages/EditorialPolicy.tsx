// src/pages/EditorialPolicy.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { CONTACT_EMAIL } from "@/config/contact";

export default function EditorialPolicy() {
  const navigate = useNavigate();
  const updated = "August 31, 2025";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Editorial Policy & Methodology · SmartKitNow"
        description="How Smart Kit Now sources, implements, and verifies the formulas behind its calculators — our review process, correction policy, and the limits of what these tools can tell you."
        canonical="https://www.smartkitnow.com/editorial-policy"
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
              Editorial Policy &amp; Methodology
            </h1>
            <p className="text-lg" style={{ color: "#747886" }}>
              How our calculators are built, checked, and corrected · Last updated: {updated}
            </p>
          </header>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Where our formulas come from</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Every calculator on Smart Kit Now starts from a published formula, not from an
                internal approximation. When a field already has an accepted standard, we implement
                that standard and name it on the page so you can check our work against the original
                source. A few concrete examples from the tools currently live on the site:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Health &amp; fitness.</strong> Basal metabolic rate uses the{" "}
                  <strong>Mifflin-St Jeor</strong> equation (1990) rather than the older
                  Harris-Benedict, because it was calibrated on a more representative population.
                  Body fat uses the <strong>US Navy circumference method</strong> (neck, abdomen,
                  and hip or chest). Body surface area offers Du Bois and Mosteller; one-rep-max
                  offers Epley and Brzycki; heart-rate zones offer Karvonen and Tanaka; ideal weight
                  shows Hamwi, Devine, and Miller side by side instead of quietly picking a winner.
                  Pregnancy dating follows <strong>Naegele&rsquo;s rule</strong>, and activity
                  burn uses MET values from the Compendium of Physical Activities.
                </li>
                <li>
                  <strong>Financial.</strong> Loan, mortgage, and amortization tools use the
                  standard fixed-payment amortization formula,{" "}
                  <em>M = P · i(1 + i)<sup>n</sup> / ((1 + i)<sup>n</sup> &minus; 1)</em>, with
                  compounding stated explicitly. Tax and mileage tools reference published IRS
                  figures for the relevant year.
                </li>
                <li>
                  <strong>Construction.</strong> Brick and mortar quantities follow the{" "}
                  <strong>Brick Industry Association&rsquo;s Technical Notes on Brick
                  Construction</strong>, including the waste allowances the notes recommend rather
                  than a round number we invented. Concrete and rebar tools reference ACI 318.
                </li>
                <li>
                  <strong>Electrical.</strong> Conductor sizing, ampacity, breaker selection, and
                  load calculations reference the National Electrical Code tables by number &mdash;
                  NEC 310.16 for ampacity, 240.6(A) for standard overcurrent device ratings, 220.12
                  for general lighting loads, 430.250 for motor full-load current &mdash; alongside
                  Ohm&rsquo;s law for the underlying arithmetic.
                </li>
                <li>
                  <strong>Conversion, science, pets, and cooking.</strong> Unit factors come from
                  NIST-published values; date and duration handling follows ISO 8601; pet feeding
                  and body-condition tools reference AAHA and WSAVA guidance; food and nutrient
                  figures come from USDA data.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How each calculator is verified before it ships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Implementing a formula correctly is a separate problem from choosing the right one,
                so no calculator goes live on the strength of its code alone. Before a tool is
                published, its results are <strong>recomputed independently</strong> &mdash; by hand
                or in a spreadsheet, straight from the published formula &mdash; and compared
                against what the page returns. We check at least a typical case and the boundary
                cases: zero, negative, and out-of-range inputs, and the point where a result changes
                category (a BMI crossing 25, an ampacity crossing to the next conductor size).
                Tools that accept both metric and imperial input are checked in both, because unit
                conversion is where most calculator errors actually live.
              </p>
              <p>
                We also publish the math instead of hiding it. Of the 732 calculator components in
                the codebase, <strong>511 display the underlying formula on the page</strong> with
                each variable defined, and <strong>496 include a step-by-step worked example</strong>{" "}
                you can follow to confirm the tool is doing what it claims. Bringing the remainder
                up to that standard is ongoing work, not a finished state, and it is the single
                largest item in our backlog.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Corrections &mdash; and how to report one</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                We get things wrong. When that happens we want to hear about it quickly, and a
                reproducible math error jumps the queue ahead of every feature we had planned.
              </p>
              <p>
                To report one, use our{" "}
                <Link className="underline" to="/contact">
                  contact page
                </Link>{" "}
                or email{" "}
                <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                . The most useful report includes the page URL, the exact inputs you entered, the
                result you got, and the result you expected &mdash; ideally with the source you are
                comparing against. We reproduce the issue, recompute from the original formula, and
                if the error is confirmed we fix it and audit every other calculator that shares the
                same math, since one bad conversion factor usually touches several tools. Where a
                correction changes the numbers a page previously returned, we say so on the page
                rather than editing it silently.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>What these tools are &mdash; and are not</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Every result on this site is an <strong>informational estimate</strong>. It is not
                financial, investment, tax, medical, veterinary, legal, or engineering advice, and
                it is not a substitute for a qualified professional who knows your situation.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Health formulas are population models with real error bars. Mifflin-St Jeor
                  carries roughly a &plusmn;10&ndash;20% standard error, and circumference-based
                  body fat estimates typically land within &plusmn;3&ndash;4%. Use them as a
                  starting point, not a diagnosis.
                </li>
                <li>
                  Financial results depend on assumptions we cannot verify &mdash; rates, fees,
                  taxes, and terms your lender may apply differently. Confirm any figure that
                  affects a real decision with the institution involved.
                </li>
                <li>
                  Construction and electrical estimates are quantity and sizing aids. Permitted
                  work must be designed and signed off against your local code by a licensed
                  professional; our numbers do not replace that review.
                </li>
                <li>
                  Pet tools are general guidance. Feeding amounts, weight targets, and anything
                  resembling a dose belong with your veterinarian.
                </li>
              </ul>
              <p>
                A disclaimer to this effect appears on every calculator page. It is there because we
                mean it, not to satisfy a checkbox.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How our written content is produced and reviewed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Alongside the calculators we publish 16 long-form blog articles, 132 practical
                smart-tip guides, and answered questions on nearly every calculator page. All of it
                is written in-house by the Smart Kit Now editorial team &mdash; the same people who
                build and check the tools &mdash; and credited as such on every post.
              </p>
              <p>
                Drafts are written by whoever implemented the relevant math, then reviewed by a
                second person against three tests: every factual claim traces to a named source,
                every number in a worked example recomputes correctly, and nothing in the piece
                gives advice we are not qualified to give. Where drafting tools assist with
                structure or phrasing, a person still recomputes every figure and verifies every
                citation before publication; nothing goes live unread. When a source is revised
                &mdash; a new IRS mileage rate, an updated NEC table, a revised feeding guideline
                &mdash; we update the affected pages rather than leaving stale figures in place.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Independence and how the site is funded</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                Smart Kit Now is free to use and paid for by advertising. Advertisers have no input
                into which calculators we build, which formulas we choose, or what our results say.
                Ads are served through an ad network and are never presented as part of a
                calculator&rsquo;s output. Where a page includes a recommended-resources block,
                commercial entries are marked as sponsored. If a commercial relationship ever
                conflicted with getting a number right, the number wins.
              </p>
              <p>
                You can read more about who we are on our{" "}
                <Link className="underline" to="/about">
                  About page
                </Link>
                , or reach us any time at{" "}
                <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };
