import React from "react";
import { Link } from "react-router-dom";
import ContactSuggestionForm from "@/components/forms/ContactSuggestionForm";
import SEOHead from "@/components/SEOHead";
import { CONTACT_EMAIL } from "@/config/contact";

export default function ContactSuggestionPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact Us · SmartKitNow"
        description="Reach the Smart Kit Now team by email at contact@smartkitnow.com — report a calculator error, suggest a new tool, or send a press or privacy request."
        canonical="https://www.smartkitnow.com/contact"
      />

      {/*
        No ad on this page: its only content is a heading and a suggestion form.
        AdSense policy prohibits Google-served ads on screens without publisher
        content, so the top banner was removed.
      */}
      <div className="h-16 md:h-20" aria-hidden />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">Contact Smart Kit Now</h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Request a new calculator or suggest improvements. We prioritize popular requests and
            respond by email if we need more details.
          </p>
        </header>

        <div className="mb-8 border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold">Email us directly</h2>
          <p className="mt-2 text-sm md:text-base">
            <a
              className="text-primary font-semibold underline break-all"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Smart Kit Now is an independent site publishing free online calculators. Every message
            goes to the same small team that builds and checks the tools.
          </p>
        </div>

        <div className="mb-8 border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold">What to write in about</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-sm md:text-base text-foreground/90">
            <li>
              <strong>Corrections.</strong> A calculator returning a number you believe is wrong.
              Please include the page URL, the exact inputs you entered, the result you got, and the
              result you expected. Reproducible math errors go to the front of the queue — see our{" "}
              <Link className="underline" to="/editorial-policy">
                editorial policy
              </Link>{" "}
              for how we verify and fix them.
            </li>
            <li>
              <strong>Suggestions.</strong> A calculator or feature we don&rsquo;t have yet. Tell us
              what you were trying to work out and we&rsquo;ll look at whether we can build it.
            </li>
            <li>
              <strong>Press and partnerships.</strong> Interview requests, citations of our tools,
              or advertising enquiries.
            </li>
            <li>
              <strong>Privacy requests.</strong> Access to, or deletion of, any personal data you
              have sent us. Details are in our{" "}
              <Link className="underline" to="/privacy">
                privacy policy
              </Link>
              .
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            We read everything and aim to reply within 2&ndash;3 business days; during busy periods
            it can take up to a week. If your message is a bug report, we may fix the calculator
            before we get around to answering — so it&rsquo;s worth re-checking the page.
          </p>
        </div>

        <div className="border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
          <ContactSuggestionForm />
        </div>
      </main>
    </div>
  );
}
