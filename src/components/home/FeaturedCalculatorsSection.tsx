import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { useNavigate } from "react-router-dom";

interface FeaturedCalculatorsSectionProps {
  featuredCalculators: any[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedCalculatorsSection({ featuredCalculators, title = "Featured Calculators", subtitle = "Essential calculation tools trusted by millions of professionals, students, and DIY enthusiasts worldwide" }: FeaturedCalculatorsSectionProps) {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 cv-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold skn-home-title mb-4">{title}</h3>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>

      {/* Featured Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCalculators.map((calc, index) => {
          const IconComponent = calc.icon;
          const onUse = () => {
            if (calc.path) {
              navigate(calc.path);
            }
          };
          return (
            <GlowCard key={index} className="skn-card group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 cursor-pointer" customSize glowColor={calc.name.includes('BMI') || calc.name.includes('BMR') ? 'red' : calc.name.includes('Loan') || calc.name.includes('Mortgage') ? 'green' : calc.name.includes('Unit') || calc.name.includes('Conversion') ? 'blue' : calc.name.includes('Recipe') ? 'purple' : 'blue'} onClick={onUse}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted/50 skn-icon-badge">
                    <IconComponent className="h-5 w-5" style={{ color: ['#ef4444','#f59e0b','#10b981','#06b6d4','#a855f7','#eab308','#0ea5e9','#14b8a6','#fb7185','#64748b'][index % 10] }} />
                  </div>
                  <div>
                    <CardTitle className="text-base skn-title">
                      {calc.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">{calc.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <Button onClick={onUse} variant="outline" className="w-full border-[#5c82ee] text-[#5c82ee] hover:bg-[#5c82ee] hover:text-white" aria-label={calc.ctaLabel ?? "Use Calculator"}>
                  {calc.ctaLabel ?? "Use Calculator"}
                </Button>
              </CardContent>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
