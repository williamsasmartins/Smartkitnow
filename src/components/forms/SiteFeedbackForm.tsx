import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";

type Props = { title?: string; includeFile?: boolean; compact?: boolean; };

export default function SiteFeedbackForm({ title = "Questions or suggestions?", includeFile = false, compact = false }: Props) {
  const [state, handleSubmit] = useForm("xanpypnb");
  const [page, setPage] = useState<string>("");

  useEffect(() => { if (typeof window !== "undefined") setPage(window.location.pathname); }, []);

  if (state.succeeded) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h3 className="text-[#5c82ee] text-lg font-semibold mb-1">Thanks!</h3>
        <p className="text-[#747886] text-sm">We received your message and will get back to you soon.</p>
      </div>
    );
  }

  const field = "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-background px-3 py-2 text-sm";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
      <h3 className="text-[#5c82ee] text-lg font-semibold">{title}</h3>
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="page" value={page} />
      <input type="hidden" name="_subject" value="New message from Smart Kit Now" />
      <label className="block">
        <span className="block text-sm text-[#747886] mb-1">Email</span>
        <input id="email" name="email" type="email" required className={field} placeholder="you@example.com" />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </label>
      <label className="block">
        <span className="block text-sm text-[#747886] mb-1">Your name</span>
        <input id="name" name="name" type="text" className={field} placeholder="John Doe" />
      </label>
      <label className="block">
        <span className="block text-sm text-[#747886] mb-1">Message</span>
        <textarea id="message" name="message" required rows={compact ? 3 : 5} className={field} placeholder="How can we help?" />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </label>
      {includeFile && (
        <label className="block">
          <span className="block text-sm text-[#747886] mb-1">Attach a file (optional)</span>
          <input type="file" name="attachment" className="w-full text-sm" />
        </label>
      )}
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="consent" required className="h-4 w-4" />
        <span className="text-sm text-[#747886]">I agree to the processing of my data for contact purposes.</span>
      </label>
      <button type="submit" disabled={state.submitting} className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-[#224691] hover:bg-[#1D4ED8] text-white text-sm font-medium disabled:opacity-60">
        {state.submitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}