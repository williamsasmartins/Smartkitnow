// src/App.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import GlowCardDemo from "@/pages/GlowCardDemo";
import HealthCalculators from "@/pages/HealthCalculators";
import ScienceCalculators from "@/pages/ScienceCalculators";
import TimeCalculators from "@/pages/TimeCalculators";

// Removido SpeedInsights em App, mantido apenas injeção em main.tsx para evitar conflitos em localhost

// Páginas principais
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cookies from "@/pages/Cookies";
import CookieSettings from "@/pages/CookieSettings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Páginas Smart Tips & TV
import SmartTips from "@/pages/SmartTips";
import SmartTipsSubCategory from "@/pages/SmartTipsSubCategory";
import SmartTipDetail from "@/pages/SmartTipDetail";
import TVCalculatorPage from "@/pages/TVCalculatorPage";
import RecipeCalculators from "@/pages/RecipeCalculators";
import RecipeSubCategory from "@/pages/RecipeSubCategory";
import RecipePage from "@/pages/RecipePage";
import DailyQuotesPage from "@/pages/DailyQuotesPage";
import EverydayLifeCalculators from "@/pages/EverydayLifeCalculators";
import SportsCalculators from "@/pages/SportsCalculators";
import FunnyCalculators from "@/pages/FunnyCalculators";
import ConstructionCalculators from "@/pages/ConstructionCalculators";
import ElectricalCalculators from "@/pages/ElectricalCalculators";
import AutomotiveCalculators from "@/pages/AutomotiveCalculators";

// Adicionar landing pages novas usando o template
import HealthCalculatorPage from "@/pages/HealthCalculatorPage";
import FinancialCalculatorPage from "@/pages/FinancialCalculatorPage";
import CookingCalculators from "@/pages/CookingCalculators";
import PetsCalculators from "@/pages/PetsCalculators";
import MathCalculators from "@/pages/MathCalculators";
import ConversionCalculators from "@/pages/ConversionCalculators";

// Categorias (raiz)
// (Removidos imports de páginas específicas; agora usamos CategoryIndex)

// Subcategorias
// (Removidos imports de subcategorias específicas; agora usamos CategorySubcategory)

// Páginas de hubs de conversão (se você as usa)
import PopularConvertersPage from "@/pages/PopularConvertersPage";
import CookingBakingConvertersPage from "@/pages/CookingBakingConvertersPage";
import CommonConvertersPage from "@/pages/CommonConvertersPage";

// Página genérica de calculadora
import CalculatorPage from "@/pages/CalculatorPage";
// Páginas genéricas baseadas em listas
import CategoryIndex from "@/pages/CategoryIndex";
import CategorySubcategory from "@/pages/CategorySubcategory";

// Conversor genérico (se você usa atalhos /conversion/:group/:slug)
import ConverterPage from "@/pages/ConverterPage";

// Redireciona rotas antigas /calculator/:slug -> formato curto
function LegacyCalcRedirect() {
  const { category, slug } = useParams();
  return <Navigate to={`/${category}/${slug}`} replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
              <Route path="/contact" element={<Contact />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Smart Tips hub */}
              <Route path="/smart-tips" element={<SmartTips />} />
              <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
              <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />

              {/* TV & Home Theater */}
              <Route path="/tv-video" element={<TVCalculatorPage />} />
              <Route path="/tv" element={<Navigate to="/tv-video" replace />} />

              {/* Recipes */}
              <Route path="/recipes" element={<RecipeCalculators />} />
              <Route path="/recipes/:categorySlug" element={<RecipeSubCategory />} />
              <Route path="/recipe/:recipeSlug" element={<RecipePage />} />

              {/* New category hubs */}
              <Route path="/daily-quotes" element={<DailyQuotesPage />} />
              <Route path="/everyday-life" element={<EverydayLifeCalculators />} />
              <Route path="/sports" element={<SportsCalculators />} />
              <Route path="/funny" element={<FunnyCalculators />} />
              <Route path="/construction" element={<ConstructionCalculators />} />
              <Route path="/electrical" element={<ElectricalCalculators />} />
              <Route path="/automotive" element={<AutomotiveCalculators />} />

              {/* Category landing pages with new template */}
              <Route path="/health" element={<HealthCalculators />} />
              <Route path="/financial" element={<FinancialCalculatorPage />} />
              <Route path="/cooking" element={<CookingCalculators />} />
              <Route path="/pets" element={<PetsCalculators />} />
              <Route path="/math" element={<MathCalculators />} />
              <Route path="/conversion" element={<ConversionCalculators />} />
              <Route path="/science" element={<ScienceCalculators />} />
              <Route path="/time" element={<TimeCalculators />} />

              {/* Categorias raiz */}
              <Route path="/:category" element={<CategoryIndex />} />


              {/* Subcategorias (todas as seções) */}
               <Route path="/:category/:slug" element={<CalculatorPage />} />
               {/* Nested calculators under subcategory */}
               <Route path="/:category/:subcategory/:calculator" element={<CalculatorPage />} />
               <Route path="/:category/:subcategory" element={<CategorySubcategory />} />




              {/* Hubs de conversão específicos (se estiverem criados) */}
              <Route path="/conversion/popular" element={<PopularConvertersPage />} />
              <Route path="/conversion/cooking-baking" element={<CookingBakingConvertersPage />} />
              <Route path="/conversion/common" element={<CommonConvertersPage />} />
              {/* Atalhos: /conversion/:group/:slug */}
              <Route path="/conversion/:group/:slug" element={<ConverterPage />} />


              {/* Atalhos diretos para slugs populares (sem categoria/subcategoria) */}
              <Route
                path="/convert-calories-to-kg"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/calories-to-kilograms"
                element={<Navigate to="/" replace />}
              />

              {/* Legado -> redireciona */}
              <Route
                path="/:category/:subcategory/calculator/:slug"
                element={<LegacyCalcRedirect />}
              />
              {/* Redirects legados/curtos — opcionais, mas ajudam muito */}
              <Route
                path="/pets/dogs/dog-chocolate-toxicity"
                element={<Navigate to="/pets/dogs/dog-chocolate-toxicity-calculator" replace />} 
              />
              <Route 
                path="/pets/dogs/dog-grape-raisin-exposure" 
                element={<Navigate to="/pets/dogs/dog-grape-raisin-exposure-risk" replace />} 
              />
              

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
