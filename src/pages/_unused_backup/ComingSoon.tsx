import { Construction, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CalculatorLink from "@/components/common/CalculatorLink";

type ComingSoonProps = {
  title?: string;
  backTo?: string;
};

export default function ComingSoon({
  title = "This calculator is coming soon",
  backTo = "/",
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center rounded-2xl border border-border/50 p-10 bg-card shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground mb-8">
            We’re finishing this tool. Check back soon — or explore our other calculators meanwhile.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <CalculatorLink to={backTo} className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go back
              </CalculatorLink>
            </Button>
            <Button asChild>
              <CalculatorLink to="/" className="inline-flex items-center gap-2">
                Explore calculators
              </CalculatorLink>
            </Button>
          </div>
        </div>
      </main>
      {/* AdSense policy: no footer banner ads on placeholder pages */}
      <Footer />
    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };
