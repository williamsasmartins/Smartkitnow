// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import BackToTopButton from "@/components/BackToTopButton";
import LegacyRedirect from "@/components/LegacyRedirects";
const FinancialCategory = lazy(() => import("@/pages/categories/FinancialCategory"));
const HealthCategory = lazy(() => import("@/pages/categories/HealthCategory"));
const CookingCategory = lazy(() => import("@/pages/categories/CookingCategory"));
const ConversionCategory = lazy(() => import("@/pages/categories/ConversionCategory"));
const MathCategory = lazy(() => import("@/pages/categories/MathCategory"));
const ScienceCategory = lazy(() => import("@/pages/categories/ScienceCategory"));
const TimeCategory = lazy(() => import("@/pages/categories/TimeCategory"));
const AutomotiveCategory = lazy(() => import("@/pages/categories/AutomotiveCategory"));
const PetsCategory = lazy(() => import("@/pages/categories/PetsCategory"));
const ConstructionCategory = lazy(() => import("@/pages/categories/ConstructionCategory"));
const ElectricalCategory = lazy(() => import("@/pages/categories/ElectricalCategory"));
const EverydayCategory = lazy(() => import("@/pages/categories/EverydayCategory"));
const SportsCategory = lazy(() => import("@/pages/categories/SportsCategory"));
const FunnyCategory = lazy(() => import("@/pages/categories/FunnyCategory"));
const VideoCategory = lazy(() => import("@/pages/categories/VideoCategory"));
const GamesCategory = lazy(() => import("@/pages/categories/GamesCategory"));
const GamePage = lazy(() => import("@/pages/GamePage"));

// Páginas principais
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const ContactSuggestionPage = lazy(() => import("@/pages/ContactSuggestionPage"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const CookieSettings = lazy(() => import("@/pages/CookieSettings"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Search = lazy(() => import("@/pages/Search"));

// Smart Tips & Recipes
const SmartTips = lazy(() => import("@/pages/SmartTips"));
const SmartTipsSubCategory = lazy(() => import("@/pages/SmartTipsSubCategory"));
const SmartTipDetail = lazy(() => import("@/pages/SmartTipDetail"));
const RecipesCategory = lazy(() => import("@/pages/categories/RecipesCategory"));
const DailyQuotesPage = lazy(() => import("@/pages/DailyQuotesPage"));
const DailyHoroscopeCalculator = lazy(
  () => import("@/components/calculators/DailyQuotes/DailyHoroscopeCalculator")
);
const CategoryIndex = lazy(() => import("@/pages/CategoryIndex"));
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));
const RecipeCuisinePage = lazy(() => import("@/pages/RecipeCuisinePage"));
const RecipeDetailPage = lazy(() => import("@/pages/RecipeDetailPage"));

import { REGISTRY, calcLink } from "@/data/calculatorRegistry";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full max-w-[1440px] mx-auto">
        <ScrollToTop />
        <AppErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen w-full bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                <span className="sr-only">Loading…</span>
              </div>
            }
          >
            <Routes>
              {/* Home & institucionais */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactSuggestionPage />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/search" element={<Search />} />

              {/* Smart Tips */}
              <Route path="/smart-tips" element={<SmartTips />} />
              <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
              <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />

              {/* Recipes */}
              <Route path="/recipes" element={<RecipesCategory />} />

              {/* ROTA DE CULINÁRIA (Listagem) - Pode manter se quiser a lista bonita */}
              <Route path="/recipes/:cuisine" element={<RecipeCuisinePage />} />

              <Route path="/recipes/:cuisine/:recipe" element={<RecipeDetailPage />} />

              {/* Daily Quotes */}
              <Route path="/daily-quotes" element={<DailyQuotesPage />} />
              <Route path="/daily-quotes/horoscopo" element={<DailyHoroscopeCalculator />} />
              <Route path="/horoscopo" element={<Navigate to="/daily-quotes/horoscopo" replace />} />

              {/* Explicit Calculator Routes from Registry */}
              {REGISTRY.map((entry) => (
                <Route
                  key={`${entry.category}-${entry.slug}`}
                  path={calcLink(entry)} // Use helper to generate correct path (flat/nested)
                  element={<CalculatorPage activeSlug={entry.slug} />}
                />
              ))}

              {/* Category-only index routes */}
              <Route path="/financial" element={<FinancialCategory />} />
              <Route path="/health" element={<HealthCategory />} />
              <Route path="/cooking" element={<CookingCategory />} />
              <Route path="/conversion" element={<ConversionCategory />} />
              <Route path="/math" element={<MathCategory />} />
              <Route path="/science" element={<ScienceCategory />} />
              <Route path="/time" element={<TimeCategory />} />
              <Route path="/pets" element={<PetsCategory />} />
              <Route path="/automotive" element={<AutomotiveCategory />} />
              <Route path="/construction" element={<ConstructionCategory />} />
              <Route path="/electrical" element={<ElectricalCategory />} />
              <Route path="/everyday" element={<EverydayCategory />} />
              <Route path="/sports" element={<SportsCategory />} />
              <Route path="/funny" element={<FunnyCategory />} />
              <Route path="/video" element={<VideoCategory />} />
              <Route path="/games" element={<GamesCategory />} />
              <Route path="/games/:slug" element={<GamePage />} />

              {/* Generic category index fallback if not explicitly matched above */}
              <Route path="/:category" element={<CategoryIndex />} />

              {/* Legacy Redirect for nested URLs (Redirects to flat /category/slug) */}
              <Route path="/:category/:subcategory/:slug" element={<LegacyRedirect />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </main>
      <Footer />
      <BackToTopButton />
      <CookieConsentBanner />
    </div>
  );
}
