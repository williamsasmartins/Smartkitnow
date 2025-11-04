// src/components/calculators/WallpaperCalculator.tsx
import React from "react";

export default function WallpaperCalculator() {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Wallpaper Calculator</h1>
        <p className="text-muted-foreground">
          Estimate wallpaper rolls needed based on room size and pattern repeat.
        </p>
      </header>

      <section className="rounded-2xl border p-4 shadow-sm">
        <p className="text-muted-foreground">
          Placeholder screen. Soon you’ll be able to enter wall dimensions, roll size, and pattern repeat to get roll counts.
        </p>
      </section>
    </div>
  );
}
