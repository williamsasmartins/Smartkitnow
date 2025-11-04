import React from "react";
import { BookOpen, Lightbulb, Quote } from "lucide-react";

export default function NewHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* Primary navigation */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav aria-label="Primary" className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-lg md:text-xl">SmartKit Essentials</span>
          </div>
          <ul className="flex items-center gap-4 md:gap-6 text-sm">
            <li>
              <a href="#recipes" className="hover:underline focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded px-1">
                Recipes
              </a>
            </li>
            <li>
              <a href="#smart-tips" className="hover:underline focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded px-1">
                Smart Tips
              </a>
            </li>
            <li>
              <a href="#daily-quotes" className="hover:underline focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded px-1">
                Daily Quotes
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="container mx-auto px-4 py-8 md:py-12">
        {/* Intro */}
        <section className="mb-8 md:mb-12" aria-labelledby="welcome-title">
          <h1 id="welcome-title" className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Explore curated content</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover recipes, smart life tips, and daily quotes in a clean, accessible layout. Use the menu or click a card to jump to any section.
          </p>
        </section>

        {/* Cards */}
        <section aria-labelledby="cards-title" className="mb-10">
          <h2 id="cards-title" className="sr-only">Content cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recipes card */}
            <a href="#recipes" className="group block focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded-lg">
              <div className="skn-card border rounded-lg p-6 h-full transition shadow-sm group-hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen aria-hidden className="h-6 w-6 text-teal-600" />
                  <h3 className="text-lg font-semibold">Recipes</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Delicious and healthy recipes with consistent layout and quick access.
                </p>
              </div>
            </a>

            {/* Smart Tips card */}
            <a href="#smart-tips" className="group block focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded-lg">
              <div className="skn-card border rounded-lg p-6 h-full transition shadow-sm group-hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb aria-hidden className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Smart Tips</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Practical guidance and life hacks with clear headings and structure.
                </p>
              </div>
            </a>

            {/* Daily Quotes card */}
            <a href="#daily-quotes" className="group block focus:outline-none focus:ring-2 ring-offset-2 ring-primary rounded-lg">
              <div className="skn-card border rounded-lg p-6 h-full transition shadow-sm group-hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Quote aria-hidden className="h-6 w-6 text-slate-600" />
                  <h3 className="text-lg font-semibold">Daily Quotes</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inspirational quotes presented with accessible markup and readable contrast.
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* Recipes section */}
        <section id="recipes" aria-labelledby="recipes-title" role="region" className="scroll-mt-24">
          <h2 id="recipes-title" className="text-xl md:text-2xl font-bold tracking-tight mb-4">Recipes</h2>
          <div className="skn-card border rounded-lg p-6">
            <p className="text-muted-foreground">
              Space for recipe content: list items, featured recipes, or filters can go here.
            </p>
          </div>
        </section>

        <div className="h-8" aria-hidden />

        {/* Smart Tips section */}
        <section id="smart-tips" aria-labelledby="tips-title" role="region" className="scroll-mt-24">
          <h2 id="tips-title" className="text-xl md:text-2xl font-bold tracking-tight mb-4">Smart Tips</h2>
          <div className="skn-card border rounded-lg p-6">
            <p className="text-muted-foreground">
              Space for smart tips content: categories, featured cards, or a list view.
            </p>
          </div>
        </section>

        <div className="h-8" aria-hidden />

        {/* Daily Quotes section */}
        <section id="daily-quotes" aria-labelledby="quotes-title" role="region" className="scroll-mt-24">
          <h2 id="quotes-title" className="text-xl md:text-2xl font-bold tracking-tight mb-4">Daily Quotes</h2>
          <div className="skn-card border rounded-lg p-6">
            <p className="text-muted-foreground">
              Space for daily quotes content: quote of the day, categories, or search.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-sm text-muted-foreground">
          <p>
            Built with accessibility and responsiveness in mind. Navigation links and cards provide two ways to access each section.
          </p>
        </div>
      </footer>
    </div>
  );
}