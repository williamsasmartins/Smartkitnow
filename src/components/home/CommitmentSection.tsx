import { BookOpen, Star, Zap } from "lucide-react";

export default function CommitmentSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold skn-home-title mb-6">Our Commitment to Excellence</h2>
        <p className="text-lg text-muted-foreground mb-8">
          At Smart Kit Now, we're committed to providing you with the most accurate, reliable, and user-friendly
          calculators available online. We continuously update our tools based on user feedback and industry
          standards to ensure you always have access to the best calculation resources.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="skn-card p-6">
            <BookOpen className="h-8 w-8 mx-auto mb-3" style={{ color: '#34d399' }} />
            <h3 className="font-semibold skn-title mb-2">Continuous Improvement</h3>
            <p className="text-sm text-muted-foreground">We continually refine our tools based on user feedback and industry standards.</p>
          </div>
          <div className="skn-card p-6">
            <Star className="h-8 w-8 mx-auto mb-3" style={{ color: '#60a5fa' }} />
            <h3 className="font-semibold skn-title mb-2">Accuracy & Transparency</h3>
            <p className="text-sm text-muted-foreground">Clear formulas and explanations ensure reliable, verifiable results.</p>
          </div>
          <div className="skn-card p-6">
            <Zap className="h-8 w-8 mx-auto mb-3" style={{ color: '#f59e0b' }} />
            <h3 className="font-semibold skn-title mb-2">Performance & UX</h3>
            <p className="text-sm text-muted-foreground">Fast, accessible and delightful experience across devices.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
