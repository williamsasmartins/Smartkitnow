import { useMemo } from "react";

type FAQ = { question: string; answer: string };

export default function useFaqJsonLd(faqs?: FAQ[]) {
  return useMemo(() => {
    if (!faqs || !faqs.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    };
  }, [faqs]);
}