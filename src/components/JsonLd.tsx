import React from "react";
import { safeJsonLd } from "@/lib/utils";

type Props = { data: unknown };

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data as object) }}
    />
  );
}