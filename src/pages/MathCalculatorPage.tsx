// src/pages/MathCalculatorPage.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { useParams, useNavigate } from "react-router-dom";

import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { GPACalculator } from "@/components/calculators/GPACalculator";
import { FractionCalculator } from "@/components/calculators/FractionCalculator";
import { AreaCalculator } from "@/components/calculators/AreaCalculator";
import { SlopeCalculator } from "@/components/calculators/SlopeCalculator";

export default function MathCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  const getCalculatorComponent = () => {
    switch (calculator) {
      case "percentage":
        return <PercentageCalculator />;
      case "gpa":
        return <GPACalculator />;
      case "fraction-to-decimal":
        return <FractionCalculator />;
      case "area":
        return <AreaCalculator />;
      case "slope":
        return <SlopeCalculator />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 skn-title">Calculator Coming Soon</h2>
            <p className="text-muted-foreground mb-6 skn-sub">
              The {calculator?.replace(/-/g, " ")} calculator is under development.
            </p>
            <BackButton fallback="/math">Browse Other Calculators</BackButton>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back à esquerda (azul) */}
        <div className="mb-6 flex items-center justify-start">
          <BackButton fallback="/math">Back to Math Calculators</BackButton>
        </div>

        {/* Conteúdo da calculadora */}
        {getCalculatorComponent()}
      </main>

      <Footer />
    </div>
  );
}
