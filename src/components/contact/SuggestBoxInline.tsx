import React from "react";
import ContactSuggestionForm from "@/components/forms/ContactSuggestionForm";

export default function SuggestBoxInline() {
  return (
    <div className="border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" aria-hidden>💡</span>
        <h3 className="text-lg font-semibold text-primary">Send a suggestion</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Missing a calculator? Suggest a new tool or improvement and we’ll prioritize popular requests.
      </p>
      <ContactSuggestionForm />
    </div>
  );
}