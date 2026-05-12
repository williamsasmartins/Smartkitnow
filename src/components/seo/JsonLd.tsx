import React from "react";
import { safeJsonLd } from "@/lib/utils";

type JsonLdProps = { data: Record<string, unknown> };

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}