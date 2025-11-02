import { AlertCircle } from "lucide-react";

type DisclaimerKind = "financial" | "health" | "construction" | "generic";
type Locale = "en" | "pt" | "es";

type Props = {
  kind?: DisclaimerKind; // choose text preset
  title?: string; // optional custom title
  note?: string; // optional extra note
  locale?: Locale; // default 'en'
  className?: string;
};

const TEXTS: Record<Locale, Record<DisclaimerKind, { title: string; body: string }>> = {
  en: {
    financial: {
      title: "Important — Not Financial Advice",
      body:
        "This tool is for general information and educational purposes only and does not constitute financial, tax, or investment advice. Results are estimates and may not reflect your specific situation. Always consult a qualified professional before making decisions.",
    },
    health: {
      title: "Important — Not Medical Advice",
      body:
        "This tool is educational only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.",
    },
    construction: {
      title: "Important — Use at Your Own Risk",
      body:
        "This calculator provides estimates only. Site conditions, materials, and local codes vary. Verify results and consult a qualified professional before starting a project.",
    },
    generic: {
      title: "Important — Educational Only",
      body:
        "This tool is for educational purposes and provides no warranty. Validate results and consult a qualified professional for your specific situation.",
    },
  },
  pt: {
    financial: { title: "Importante — Não é aconselhamento financeiro", body: "…" },
    health: { title: "Importante — Não é aconselhamento médico", body: "…" },
    construction: { title: "Importante — Use por sua conta e risco", body: "…" },
    generic: { title: "Importante — Uso educacional", body: "…" },
  },
  es: {
    financial: { title: "Importante — No es asesoramiento financiero", body: "…" },
    health: { title: "Importante — No es consejo médico", body: "…" },
    construction: { title: "Importante — Úselo bajo su propio riesgo", body: "…" },
    generic: { title: "Importante — Solo educativo", body: "…" },
  },
};

export default function LegalDisclaimer({
  kind = "generic",
  title,
  note,
  locale = "en",
  className = "",
}: Props) {
  const pack = (TEXTS[locale] ?? TEXTS.en)[kind] ?? TEXTS.en.generic;
  const resolvedTitle = title ?? pack.title;
  const resolvedBody = pack.body;

  return (
    <div
      role="note"
      aria-label="Important disclaimer"
      className={`mt-8 rounded-2xl border border-gray-200 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/60 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{resolvedTitle}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{resolvedBody}</p>
          {note && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{note}</p>}
        </div>
      </div>
    </div>
  );
}