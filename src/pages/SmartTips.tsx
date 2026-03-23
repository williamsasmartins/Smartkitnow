import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Leaf, Wallet, Briefcase, BookOpen, Heart, Wrench, Monitor, Lightbulb } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { smartTipsCategories, SmartTipsCategory } from "@/data/smartTipsData";

const ICON_MAP: Record<string, React.ElementType> = {
  Home, Leaf, Wallet, Briefcase, BookOpen, Heart, Wrench, Monitor
};

export default function SmartTips() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Smart Tips & Life Hacks - Smart Kit Now"
        description="Discover practical tips, tricks, and life hacks to make your everyday life easier, organized, and more efficient."
        canonical="https://www.smartkitnow.com/smart-tips"
      />
      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-md text-white"
                  style={{ backgroundColor: "#3c83f6" }}
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Lightbulb className="h-8 w-8" />
                Smart Tips & Life Hacks
              </h1>
              <p className="text-lg max-w-2xl text-slate-600 dark:text-slate-300">
                Explore our collection of practical advice to organize your home, manage your finances, boost productivity, and improve your daily life.
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {smartTipsCategories.map((cat: SmartTipsCategory) => {
              const Icon = ICON_MAP[cat.icon] || Lightbulb;
              return (
                <Card
                  key={cat.slug}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 hover:border-l-indigo-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  style={{ borderLeftColor: cat.iconColor ? undefined : "#6366f1" }}
                  onClick={() => navigate(`/smart-tips/${cat.slug}`)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color || 'bg-indigo-100 dark:bg-indigo-900/40'}`}>
                    <Icon className={`h-6 w-6 ${cat.iconColor || 'text-indigo-600 dark:text-indigo-400'}`} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                    {cat.description}
                  </p>
                  <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {cat.tips.length} tips available &rarr;
                  </div>
                </Card>
              );
            })}
          </div>
        </AdRailLayout>
      </main>
    </div>
  );
}