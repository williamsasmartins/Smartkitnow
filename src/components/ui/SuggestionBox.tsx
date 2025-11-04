import * as React from "react";

type Suggestion = {
  name: string;
  email: string;
  message: string;
};

export default function SuggestionBox() {
  const [data, setData] = React.useState<Suggestion>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.name || !data.email || !data.message) return;
    setStatus("sending");
    try {
      // Endpoint local/futuro — ajuste quando seu backend estiver pronto
      await fetch("/api/send-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus("ok");
      setData({ name: "", email: "", message: "" });
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
      <h3 className="text-lg font-semibold text-[#5c82ee] mb-3">
        Send a suggestion
      </h3>
      <form className="grid gap-2" onSubmit={onSubmit}>
        <input
          required
          value={data.name}
          onChange={(e) => setData((s) => ({ ...s, name: e.target.value }))}
          placeholder="Your name"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#5c82ee]/40"
        />
        <input
          required
          type="email"
          value={data.email}
          onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
          placeholder="Email"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#5c82ee]/40"
        />
        <textarea
          required
          rows={4}
          value={data.message}
          onChange={(e) => setData((s) => ({ ...s, message: e.target.value }))}
          placeholder="Your suggestion..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#5c82ee]/40"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-4 py-2 rounded-xl bg-[#224691] hover:bg-[#1D4ED8] text-white disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send suggestion"}
          </button>
          {status === "ok" && (
            <span className="text-emerald-400 text-sm self-center">
              Thank you! We got your message.
            </span>
          )}
          {status === "err" && (
            <span className="text-red-400 text-sm self-center">
              Oops! Try again in a moment.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}