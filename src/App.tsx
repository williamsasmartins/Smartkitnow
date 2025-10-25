// src/App.tsx
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import GlowCardDemo from "@/pages/GlowCardDemo";
import FinancialCategory from "@/pages/categories/FinancialCategory";

// Páginas principais
import Index from "@/pages/Index";
import About from "@/pages/About";
import ContactSuggestionPage from "@/pages/ContactSuggestionPage";
import Cookies from "@/pages/Cookies";
import CookieSettings from "@/pages/CookieSettings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Smart Tips & Recipes
import SmartTips from "@/pages/SmartTips";
import SmartTipsSubCategory from "@/pages/SmartTipsSubCategory";
import SmartTipDetail from "@/pages/SmartTipDetail";
import RecipeSubCategory from "@/pages/RecipeSubCategory";
import RecipePage from "@/pages/RecipePage";
import DailyQuotesPage from "@/pages/DailyQuotesPage";
import CategoryIndex from "@/pages/CategoryIndex";
import CalculatorPage from "@/pages/CalculatorPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex-1">
        <ScrollToTop />
        <AppErrorBoundary>
          <Suspense
            fallback={
              <div className="fixed inset-0 flex items-center justify-center bg-background/80">
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

              {/* Smart Tips */}
              <Route path="/smart-tips" element={<SmartTips />} />
              <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
              <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />

              {/* Recipes */}
              <Route path="/recipes" element={<RecipePage />} />
              <Route path="/recipes/:categorySlug" element={<RecipeSubCategory />} />

              {/* Daily Quotes */}
              <Route path="/daily-quotes" element={<DailyQuotesPage />} />

              {/* Financial dedicated route */}
              <Route path="/financial" element={<FinancialCategory />} />

              {/* Category index (generic) */}
              <Route path=":category" element={<CategoryIndex />} />

              {/* Calculator detail (supports both with and without subcategory) */}
              <Route path=":category/:subcategory/:slug" element={<CalculatorPage />} />
              <Route path=":category/:slug" element={<CalculatorPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
