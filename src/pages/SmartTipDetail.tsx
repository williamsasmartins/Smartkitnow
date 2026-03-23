import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, CheckCircle2, Share2, Compass, Award } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { getSmartTipBySlug, smartTipsCategories } from "@/data/smartTipsData";

export default function SmartTipDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) return <Navigate to="/smart-tips" replace />;

  const tip = getSmartTipBySlug(slug);

  if (!tip) return <Navigate to="/smart-tips" replace />;

  // Find category for back link and styling
  const category = smartTipsCategories.find(c => c.tips.some(t => t.slug === slug));

  if (!category) return <Navigate to="/smart-tips" replace />;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${tip.title} - Smart Kit Now`}
        description={tip.description}
        canonical={`https://www.smartkitnow.com/smart-tip/${tip.slug}`}
      />
      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-md text-white"
                  style={{ backgroundColor: "#3c83f6" }}
                  onClick={() => navigate(`/smart-tips/${category.slug}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {category.title}
                </button>
              </div>
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-400 leading-tight">
                {tip.title}
              </h1>
              <p className="text-lg max-w-3xl text-slate-600 dark:text-slate-300">
                {tip.description}
              </p>
            </div>
          }
        >
          <div className="space-y-8 mb-16">
            
            {/* Why This Works */}
            <Card className="p-6 border-l-4 border-l-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="h-6 w-6 text-blue-500" />
                Why This Works
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                {tip.expandedContent.whyThisWorks}
              </p>
            </Card>

            {/* Step-by-Step */}
            <Card className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-amber-500" />
                How to Do It
              </h2>
              <ul className="space-y-4">
                {tip.expandedContent.stepByStep.map((step, idx) => (
                  <li key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 pt-1 text-lg">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Expert Insight */}
            <Card className="p-6 border-t-4 border-t-purple-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-500" />
                Expert Insight
              </h2>
              <blockquote className="border-l-4 border-purple-200 dark:border-purple-900 pl-4 italic text-slate-600 dark:text-slate-400 text-lg py-2">
                "{tip.expandedContent.expertInsight}"
              </blockquote>
            </Card>

            {/* Source Tag */}
            {tip.source && (
              <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-4">
                <Share2 className="h-4 w-4" />
                Source / Inspired by: <span className="font-medium text-slate-700 dark:text-slate-300">{tip.source}</span>
              </div>
            )}
          </div>
        </AdRailLayout>
      </main>
    </div>
  );
}
