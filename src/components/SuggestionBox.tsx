import { useState } from "react";

type Props = {
  className?: string;
  onSubmit?: (payload: { name: string; email: string; message: string }) => Promise<void> | void;
};

export default function SuggestionBox({ className = "", onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSend() {
    const payload = { name, email, message };
    try {
      if (onSubmit) await onSubmit(payload);
      setSent(true);
    } catch {
      // no-op for now
    }
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-gray-900/40 ${className}`}>
      <h3 className="text-lg font-semibold">Send a suggestion</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Missing a calculator? Suggest a new tool or an improvement and we’ll prioritize popular requests.
      </p>

      {sent ? (
        <p className="mt-4 text-sm text-emerald-500">Thanks! We’ve received your suggestion.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="sm:col-span-2 h-28 w-full rounded-md border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-950"
            placeholder="Tell us which calculator you’d like, or improvements to existing tools."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="sm:col-span-2">
            <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">We’ll only use your email to follow up about this suggestion.</p>
    </div>
  );
}