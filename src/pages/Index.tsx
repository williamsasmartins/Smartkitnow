import { Suspense, lazy, useState } from "react";
import { GlobalSearch } from "@/components/GlobalSearch";
import HomeSEO from "@/components/home/HomeSEO";
import HeroSection from "@/components/home/HeroSection";
import SpotlightCarousel from "@/components/home/SpotlightCarousel";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import { FEATURED_CALCULATORS } from "@/data/home/featuredCalculators";

const FeaturedCalculatorsSection = lazy(() => import("@/components/home/FeaturedCalculatorsSection"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const EmpowermentSection = lazy(() => import("@/components/home/EmpowermentSection"));
const CommitmentSection = lazy(() => import("@/components/home/CommitmentSection"));

const fallback = (label: string) => (
  <div className="h-96 flex items-center justify-center">{`Loading ${label}...`}</div>
);

const Index = () => {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-teal-100 selection:text-teal-900">
      <GlobalSearch open={openSearch} onOpenChange={setOpenSearch} />
      <HomeSEO />
      <main className="pt-16 sm:pt-28">
        <HeroSection onOpenSearch={() => setOpenSearch(true)} />

        <section className="container mx-auto px-4 py-8 md:py-10 cv-auto">
          <SpotlightCarousel />
          <CategoriesGrid />
        </section>

        <div id="featured-calculators">
          <Suspense fallback={fallback("Featured Calculators")}>
            <FeaturedCalculatorsSection
              title="Featured Calculators and More"
              featuredCalculators={FEATURED_CALCULATORS}
            />
          </Suspense>
        </div>

        <Suspense fallback={fallback("About Section")}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={fallback("Empowerment Section")}>
          <EmpowermentSection />
        </Suspense>

        <Suspense fallback={fallback("Commitment Section")}>
          <CommitmentSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
