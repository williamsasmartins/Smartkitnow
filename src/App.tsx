// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import BackToTopButton from "@/components/BackToTopButton";
const GlowCardDemo = lazy(() => import("@/pages/GlowCardDemo"));
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
const RecipeSubCategory = lazy(() => import("@/pages/RecipeSubCategory"));
const RecipesCategory = lazy(() => import("@/pages/categories/RecipesCategory"));
const DailyQuotesPage = lazy(() => import("@/pages/DailyQuotesPage"));
const CategoryIndex = lazy(() => import("@/pages/CategoryIndex"));
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));
const RecipeCuisinePage = lazy(() => import("@/pages/RecipeCuisinePage"));
const RecipeDetailPage = lazy(() => import("@/pages/RecipeDetailPage"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex-1">
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
              <Route path="/glow-demo" element={<GlowCardDemo />} />
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
              {/* More specific: cuisine recipe detail */}
              <Route path="/recipes/:cuisine/:recipe" element={<RecipeDetailPage />} />
              {/* Cuisine list page should precede the generic subcategory route to avoid conflicts */}
              <Route path="/recipes/:cuisine" element={<RecipeCuisinePage />} />
              <Route path="/recipes/:categorySlug" element={<RecipeSubCategory />} />

              {/* Daily Quotes */}
              <Route path="/daily-quotes" element={<DailyQuotesPage />} />

              {/* Financial dedicated route */}
              <Route path="/financial" element={<FinancialCategory />} />

              {/* Health dedicated route */}
              <Route path="/health" element={<HealthCategory />} />

              {/* Cooking dedicated route */}
              <Route path="/cooking" element={<CookingCategory />} />

              {/* Conversion dedicated route */}
              <Route path="/conversion" element={<ConversionCategory />} />

              {/* Math dedicated route */}
              <Route path="/math" element={<MathCategory />} />

              {/* Science dedicated route */}
              <Route path="/science" element={<ScienceCategory />} />

              {/* Time dedicated route */}
              <Route path="/time" element={<TimeCategory />} />

              {/* Pets dedicated route */}
              <Route path="/pets" element={<PetsCategory />} />

              {/* Automotive dedicated route */}
              <Route path="/automotive" element={<AutomotiveCategory />} />

              {/* Construction dedicated route */}
              <Route path="/construction" element={<ConstructionCategory />} />

              {/* Electrical dedicated route */}
              <Route path="/electrical" element={<ElectricalCategory />} />

              {/* Everyday dedicated route */}
              <Route path="/everyday" element={<EverydayCategory />} />

              {/* Sports dedicated route */}
              <Route path="/sports" element={<SportsCategory />} />

              {/* Funny dedicated route */}
              <Route path="/funny" element={<FunnyCategory />} />

              {/* Video dedicated route */}
              <Route path="/video" element={<VideoCategory />} />
              {/* Games dedicated route */}
              <Route path="/games" element={<GamesCategory />} />

              {/* Category index (generic) */}
              <Route path="/:category" element={<CategoryIndex />} />

              {/* Calculator detail (supports both with and without subcategory) */}
              <Route path="/:category/:subcategory/:slug" element={<CalculatorPage />} />
              <Route path="/:category/:slug" element={<CalculatorPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </div>
      <Footer />
      <BackToTopButton />
      <CookieConsentBanner />
    </div>
  );
}
