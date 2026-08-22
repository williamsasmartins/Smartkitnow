import React from "react";
import ContactSuggestionForm from "@/components/forms/ContactSuggestionForm";

export default function ContactSuggestionPage() {
  return (
    <div className="min-h-screen">
      {/*
        No ad on this page: its only content is a heading and a suggestion form.
        AdSense policy prohibits Google-served ads on screens without publisher
        content, so the top banner was removed.
      */}
      <div className="h-16 md:h-20" aria-hidden />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">Send a Suggestion</h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Request a new calculator or suggest improvements. We prioritize popular requests and
            respond by email if we need more details.
          </p>
        </header>

        <div className="border rounded-xl p-5 bg-card">
          <ContactSuggestionForm />
        </div>
      </main>
    </div>
  );
}