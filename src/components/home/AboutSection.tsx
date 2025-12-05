import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Lightbulb, Star, Dumbbell, Heart } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 cv-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold skn-home-title mb-4">About Smart Kit Now</h2>
          <p className="text-muted-foreground text-lg">
            Your trusted companion for accurate calculations and conversions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="skn-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 skn-title">
                <Calculator className="h-5 w-5 text-[var(--primary)]" style={{ color: '#10b981' }} />
                Precision & Reliability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every calculator on Smart Kit Now is built with precision in mind. Our formulas are extensively tested 
                and validated to ensure you get accurate results every time, whether you're planning a construction project, 
                managing finances, or converting units.
              </p>
            </CardContent>
          </Card>

          <Card className="skn-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 skn-title">
                <Lightbulb className="h-5 w-5 text-[var(--primary)]" style={{ color: '#f59e0b' }} />
                Easy to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe powerful tools should be simple to use. Our intuitive interface makes complex calculations 
                accessible to everyone, from professionals to DIY enthusiasts. No complicated software or downloads required.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-slate max-w-none">
          <h3 className="text-2xl font-semibold skn-title mb-4">Why Choose Smart Kit Now?</h3>
          <p className="text-muted-foreground mb-6">
            Smart Kit Now has become the go-to platform for millions of users worldwide who need reliable calculation tools. 
            Our comprehensive suite of calculators covers everything from basic math operations to specialized industry calculations, 
            making us your one-stop solution for all computational needs.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 skn-icon-badge">
                <Star className="h-6 w-6" style={{ color: "#eab308" }} />
              </div>
              <h4 className="font-semibold skn-title mb-2">Trusted by Millions</h4>
              <p className="text-sm text-muted-foreground">Over 5 million calculations performed monthly</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 skn-icon-badge">
                <Dumbbell className="h-6 w-6" style={{ color: "#f97316" }} />
              </div>
              <h4 className="font-semibold skn-title mb-2">Professional Grade</h4>
              <p className="text-sm text-muted-foreground">Used by engineers, contractors, and professionals</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 skn-icon-badge">
                <Heart className="h-6 w-6" style={{ color: "#ef4444" }} />
              </div>
              <h4 className="font-semibold skn-title mb-2">Always Free</h4>
              <p className="text-sm text-muted-foreground">No subscriptions, no hidden fees, completely free</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
