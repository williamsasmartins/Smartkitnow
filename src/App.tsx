// src/App.tsx
import { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";

// Páginas principais
import Index from "@/pages/Index";
import Search from "@/pages/Search";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cookies from "@/pages/Cookies";
import CookieSettings from "@/pages/CookieSettings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Math
import MathCalculators from "@/pages/MathCalculators";
import MathSubCategory from "@/pages/MathSubCategory";
import MathComingSoon from "@/pages/MathComingSoon";
import EverydayMath from "@/pages/math/EverydayMath";
import PercentageCalculators from "@/pages/math/PercentageCalculators";
import FractionsCalculators from "@/pages/math/FractionsCalculators";

// Rota específica do Drywall (página wrapper que usa sua calculadora)
import DrywallAreaSheets from "@/pages/construction/wall-ceiling-calculators/DrywallAreaSheets";

// Categorias (raiz)
import FinancialCalculators from "@/pages/FinancialCalculators";
import HealthCalculators from "@/pages/HealthCalculators";
import CookingCalculators from "@/pages/CookingCalculators";
import ConversionCalculators from "@/pages/ConversionCalculators";
import ElectricalCalculators from "@/pages/ElectricalCalculators";
import ScienceCalculators from "@/pages/ScienceCalculators";
import TimeCalculators from "@/pages/TimeCalculators";
import TVCalculators from "@/pages/TVCalculators";
import PetsCalculators from "@/pages/PetsCalculators";
import AutomotiveCalculators from "@/pages/AutomotiveCalculators";
import ConstructionCalculators from "@/pages/ConstructionCalculators";

// Subcategorias (todas as seções)
import FinancialSubCategory from "@/pages/FinancialSubCategory";
import HealthSubCategory from "@/pages/HealthSubCategory";
import CookingSubCategory from "@/pages/CookingSubCategory";
import ConversionSubCategory from "@/pages/ConversionSubCategory";
import ElectricalSubCategory from "@/pages/ElectricalSubCategory";
import ScienceSubCategory from "@/pages/ScienceSubCategory";
import TimeSubCategory from "@/pages/TimeSubCategory";
import TVSubCategory from "@/pages/TVSubCategory";
import PetsSubCategory from "@/pages/PetsSubCategory";
import ConstructionSubCategory from "@/pages/ConstructionSubCategory";
import AutomotiveSubCategory from "@/pages/AutomotiveSubCategory";

// Hubs de conversão
import PopularConvertersPage from "@/pages/PopularConvertersPage";
import CookingBakingConvertersPage from "@/pages/CookingBakingConvertersPage";
import CommonConvertersPage from "@/pages/CommonConvertersPage";

// Página genérica de calculadora
import CalculatorPage from "@/pages/CalculatorPage";

// Conversor genérico
import ConverterPage from "@/pages/ConverterPage";

// Redireciona rotas antigas: /:category/:subcategory/calculator/:slug -> /:category/:subcategory/:slug
function LegacyCalcRedirect() {
  const { category, subcategory, slug } = useParams();
  return <Navigate to={`/${category}/${subcategory}/${slug}`} replace />;
}

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppErrorBoundary>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* Home & institucionais */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Página de busca */}
            <Route path="/search" element={<Search />} />

            {/* Categorias raiz */}
            <Route path="/construction" element={<ConstructionCalculators />} />
            <Route path="/financial" element={<FinancialCalculators />} />
            <Route path="/health" element={<HealthCalculators />} />
            <Route path="/cooking" element={<CookingCalculators />} />
            <Route path="/conversion" element={<ConversionCalculators />} />
            <Route path="/electrical" element={<ElectricalCalculators />} />
            <Route path="/science" element={<ScienceCalculators />} />
            <Route path="/time" element={<TimeCalculators />} />
            <Route path="/tv" element={<TVCalculators />} />
            <Route path="/pets" element={<PetsCalculators />} />
            <Route path="/automotive" element={<AutomotiveCalculators />} />
            <Route path="/math" element={<MathCalculators />} />

            {/* 🔧 Rota ESPECÍFICA (antes da genérica) */}
            <Route
              path="/construction/wall-ceiling-calculators/drywall-area-sheets"
              element={<DrywallAreaSheets />}
            />

            {/* Subcategorias */}
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/financial/:subcategory" element={<FinancialSubCategory />} />
            <Route path="/health/:subcategory" element={<HealthSubCategory />} />
            <Route path="/cooking/:subcategory" element={<CookingSubCategory />} />
            <Route path="/conversion/:subcategory" element={<ConversionSubCategory />} />
            <Route path="/electrical/:subcategory" element={<ElectricalSubCategory />} />
            <Route path="/science/:subcategory" element={<ScienceSubCategory />} />
            <Route path="/time/:subcategory" element={<TimeSubCategory />} />
            <Route path="/tv/:subcategory" element={<TVSubCategory />} />
            <Route path="/pets/:subcategory" element={<PetsSubCategory />} />
            <Route path="/automotive/:subcategory" element={<AutomotiveSubCategory />} />

            {/* Math – páginas específicas e fallback de subcategoria */}
            <Route path="/math/everyday-math" element={<EverydayMath />} />
            <Route path="/math/everyday-math/percentages" element={<PercentageCalculators />} />
            <Route path="/math/fractions" element={<FractionsCalculators />} />
            <Route path="/math/coming-soon" element={<MathComingSoon />} />
            <Route path="/math/:subcategory" element={<MathSubCategory />} />

            {/* Hubs de conversão específicos */}
            <Route path="/conversion/popular" element={<PopularConvertersPage />} />
            <Route path="/conversion/cooking-baking" element={<CookingBakingConvertersPage />} />
            <Route path="/conversion/common" element={<CommonConvertersPage />} />
            {/* Atalhos: /conversion/:group/:slug */}
            <Route path="/conversion/:group/:slug" element={<ConverterPage />} />

            {/* Calculadora — formato curto (genérico) */}
            <Route path="/:category/:subcategory/:slug" element={<CalculatorPage />} />

            {/* Legado -> redireciona */}
            <Route
              path="/:category/:subcategory/calculator/:slug"
              element={<LegacyCalcRedirect />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
