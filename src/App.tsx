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
import { REGISTRY, calcLink } from "@/data/calculatorRegistry";

// Lazy Imports - Categories
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

// Lazy Imports - Games
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const GamePlayerPage = lazy(() => import("@/pages/GamePlayerPage"));

// Lazy Imports - Main Pages
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const ContactSuggestionPage = lazy(() => import("@/pages/ContactSuggestionPage"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const CookieSettings = lazy(() => import("@/pages/CookieSettings"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Search = lazy(() => import("@/pages/Search"));

// Lazy Imports - Features
const SmartTips = lazy(() => import("@/pages/SmartTips"));
const SmartTipsSubCategory = lazy(() => import("@/pages/SmartTipsSubCategory"));
const SmartTipDetail = lazy(() => import("@/pages/SmartTipDetail"));

const DailyQuotesPage = lazy(() => import("@/pages/DailyQuotesPage"));
const DailyHoroscopeCalculator = lazy(() => import("@/components/calculators/DailyQuotes/DailyHoroscopeCalculator"));
const CategoryIndex = lazy(() => import("@/pages/CategoryIndex"));
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));


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
              {/* Home & Institutional */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactSuggestionPage />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/search" element={<Search />} />

              {/* Game Zone */}
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:slug" element={<GamePlayerPage />} />

              {/* Smart Tips */}
              <Route path="/smart-tips" element={<SmartTips />} />
              <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
              <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />



              {/* Daily Quotes */}
              <Route path="/daily-quotes" element={<DailyQuotesPage />} />
              <Route path="/daily-quotes/horoscopo" element={<DailyHoroscopeCalculator />} />
              <Route path="/daily-quotes/:category" element={<DailyQuotesPage />} />
              <Route path="/horoscopo" element={<Navigate to="/daily-quotes/horoscopo" replace />} />

              {/* Explicit Calculator Routes from Registry */}
              {REGISTRY.map((entry) => (
                <Route
                  key={`${entry.category}-${entry.slug}`}
                  path={calcLink(entry)}
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

              {/* Generic category index fallback */}
              <Route path="/:category" element={<CategoryIndex />} />

              {/* Decommissioned Routes */}
              <Route path="/recipes" element={<Navigate to="/" replace />} />
              <Route path="/recipes/*" element={<Navigate to="/" replace />} />

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
