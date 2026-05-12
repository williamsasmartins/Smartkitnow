import { useMemo } from "react";

type FAQ = { question: string; answer: string };

export default function useFaqJsonLd(faqs?: FAQ[]) {
  return useMemo(() => {
    const valid = (faqs ?? []).filter(
      (f) => f?.question?.trim() && f?.answer?.trim()
    );
    if (!valid.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: valid.map((f) => ({
        "@type": "Question",
        name: f.question.trim(),
        acceptedAnswer: { "@type": "Answer", text: f.answer.trim() },
      })),
    };
  }, [faqs]);
}