import React from "react";
import { PetCalcOmniTemplate, PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplateLeft";

const demoConfig: PetCalcOmniConfig = {
  slug: "demo-pets-omni-left",
  hero: { title: "Dog Xylitol Exposure — Demo (Left Anchor)", description: "Preview layout with top banner and right rail ads." },
  form: {
    initial: {},
    fields: [],
    compute: () => ({ metrics: {} }),
  },
  editorial: {
    howToUse: { title: "How to use", steps: ["Enter details", "Review results", "Follow guidance"] },
    howItWorks: { title: "How it works", intro: "This is a demo showing editorial content on the left and a sticky calculator on the right." },
    tables: [],
    faqs: [],
    sources: [],
  },
  eeat: { showAtBottomOnce: true, text: "Reviewed by veterinary team — demo banner." },
  ads: {
    top: (
      <div className="rounded-md bg-muted/30 h-10 flex items-center justify-center text-xs">
        Ad — Top Banner
      </div>
    ),
    right: (
      <div className="rounded-md bg-muted/30 h-[600px] w-full" />
    ),
  },
};

export default function PetsOmniLeftPreview() {
  return <PetCalcOmniTemplate config={demoConfig} stickyOffsetPx={88} />;
}