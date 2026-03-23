import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, Home, Leaf, Wallet, Briefcase, BookOpen, Heart, Wrench, Monitor, Lightbulb, ChevronRight } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { getSmartTipsCategoryBySlug } from "@/data/smartTipsData";

const ICON_MAP: Record<string, React.ElementType> = {
  Home, Leaf, Wallet, Briefcase, BookOpen, Heart, Wrench, Monitor
};

export default function SmartTipsSubCategory() {
  const navigate = useNavigate();
  const { subcategory } = useParams();

  if (!subcategory) return <Navigate to="/smart-tips" replace />;

  const category = getSmartTipsCategoryBySlug(subcategory);

  if (!category) return <Navigate to="/smart-tips" replace />;

  const Icon = ICON_MAP[category.icon] || Lightbulb;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${category.title} Hacks & Tips - Smart Kit Now`}
        description={category.description}
        canonical={`https://www.smartkitnow.com/smart-tips/${category.slug}`}
      />
      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-md text-white"
                  style={{ backgroundColor: "#3c83f6" }}
                  onClick={() => navigate("/smart-tips")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Categories
                </button>
              </div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Icon className="h-8 w-8" />
                {category.title} Tips
              </h1>
              <p className="text-lg max-w-2xl text-slate-600 dark:text-slate-300">
                {category.tips.length > 0
                  ? `Browse our top ${category.tips.length} tips for ${category.title.toLowerCase()}.`
                  : category.description}
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 mb-16">
            {category.tips.map((tip) => (
              <Card
                key={tip.id}
                className="p-5 cursor-pointer hover:shadow-lg transition-all border-l-4 hover:border-l-indigo-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-4"
                style={{ borderLeftColor: category.iconColor ? undefined : "#6366f1" }}
                onClick={() => navigate(`/smart-tip/${tip.slug}`)}
              >
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${category.color || 'bg-indigo-100 dark:bg-indigo-900/40'}`}>
                  <Lightbulb className={`h-5 w-5 ${category.iconColor || 'text-indigo-600 dark:text-indigo-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {tip.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center mt-3">
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </Card>
            ))}
          </div>
        </AdRailLayout>
      </main>
    </div>
  );
}