import React, { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSuggestionForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xanpypnb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const j = await res.json().catch(() => null);
        setError(j?.errors?.[0]?.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot anti-spam (oculto) */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
      {/* Assunto opcional que aparece no dashboard do Formspree */}
      <input type="hidden" name="_subject" value="New calculator suggestion" />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">Suggestion</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Tell us which calculator you’d like, or improvements to existing tools."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        {status === "success" && (
          <span className="text-sm text-emerald-600" aria-live="polite">Thanks! We received your suggestion.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600" aria-live="polite">{error}</span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        We’ll only use your email to follow up about this suggestion.
      </p>
    </form>
  );
}