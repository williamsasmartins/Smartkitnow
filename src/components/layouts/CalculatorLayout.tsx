import React from "react";
export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>;
}
