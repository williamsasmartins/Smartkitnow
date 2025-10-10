import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";
import { Button } from "@/components/ui/button";
import CalculatorLink from "@/components/common/CalculatorLink";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEOHead
        title="404 • Page not found"
        description="The page you tried to access does not exist or has been moved."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "404", url: location.pathname },
        ]}
      />
      <main className="text-center">
        <h1 className="mb-4 text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent" aria-live="polite">
          404
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found.</p>
        <Button variant="outline" asChild>
          <CalculatorLink to="/">Back to Home</CalculatorLink>
        </Button>
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SiteFeedbackForm title="Questions or suggestions?" />
          <ShareThisCalculator />
        </section>
      </main>
    </div>
  );
};

export default NotFound;
export const pageMeta = { allowAds: false, minContentScore: 1 };
