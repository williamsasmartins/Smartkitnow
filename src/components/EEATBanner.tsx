import React from "react";

export default function EEATBanner({ niche = "health" }: { niche?: "health" | "finance" | "construction" | "cooking" | "pets" | string }) {
  const msgByNiche: Record<string, string> = {
    pets: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",
    health: "Content for general guidance only. For medical decisions, consult a licensed healthcare professional.",
    finance: "Content for general guidance only. For financial decisions, consult a licensed financial professional.",
    construction: "Content for general guidance only. Always follow local codes and consult a qualified professional.",
    cooking: "Content for general guidance only. Adjust for dietary needs and food safety best practices."
  };
  const text = msgByNiche[niche] || "Content for general guidance only. Consult a qualified professional for specific advice.";
  return (
    <div className="max-w-[560px] md:max-w-[864px] mt-4 rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
      <strong className="block text-foreground">Reviewed by the Smart Kit Now editorial team</strong>
      {text}
    </div>
  );
}