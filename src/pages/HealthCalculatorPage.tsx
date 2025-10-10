import { useMemo } from "react";
import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { buildSectionsForCategory } from "@/data/categorySections";

const HealthCalculatorPage = () => {
  const sections = useMemo(
    () =>
      buildSectionsForCategory("health", {
        shortPaths: true,
        subcategoryIconMap: {
          "body-composition-calculators": "⚖️",
          "metabolism-calculators": "🔥",
          "nutrition-calculators": "🥗",
          "weight-loss-calculators": "📉",
          "general": "🩺",
        },
      }),
    []
  );

  const intro = (
    <div className="space-y-3">
      <p>
        Explore nossa coleção de calculadoras de saúde e fitness para avaliar composição corporal, metabolismo, necessidades calóricas e muito mais.
      </p>
      <p>
        Ferramentas como BMI, BMR e TDEE ajudam você a entender métricas essenciais do seu corpo, enquanto conversores e guias de nutrição apoiam decisões do dia a dia.
      </p>
    </div>
  );

  return (
    <CategoryPageTemplate
      title="Health & Fitness Calculators"
      intro={intro}
      sections={sections}
      showTopBanner={true}
      showRightRail={true}
      contentBackgroundColor="#0c1424"
    />
  );
};

export default HealthCalculatorPage;