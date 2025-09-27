import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, User, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSmartTipsCategoryBySlug } from '@/data/smartTipsData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const SmartTipsSubCategory: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const category = getSmartTipsCategoryBySlug(subcategory || '');
  
  const categoryInfo = location.state || {
    categoryTitle: category?.title || 'Smart Tips',
    categoryDescription: category?.description || '',
    categoryColor: category?.color || 'bg-blue-50',
    categoryIconColor: category?.iconColor || 'text-blue-600',
    categoryIcon: category?.icon || 'Home'
  };

  const handleTipClick = (tipSlug: string) => {
    navigate(`/smart-tip/${tipSlug}`, {
      state: {
        categorySlug: subcategory,
        categoryTitle: categoryInfo.categoryTitle,
        fromSubcategory: true
      }
    });
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/smart-tips');
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested smart tips category could not be found.</p>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Smart Tips
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className={`w-20 h-20 ${categoryInfo.categoryColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <div className={`h-10 w-10 ${categoryInfo.categoryIconColor}`}>
              {/* Icon would be rendered here based on categoryInfo.categoryIcon */}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">{categoryInfo.categoryTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {categoryInfo.categoryDescription}
          </p>
          <Badge variant="secondary" className="mt-4">
            {category.tips.length} Expert Tips
          </Badge>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {category.tips.map((tip, index) => (
            <Card
              key={tip.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
              onClick={() => handleTipClick(tip.slug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
                      {tip.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    Tip #{index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed mb-4">
                  {tip.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{tip.source.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Master {categoryInfo.categoryTitle} with Expert-Proven Strategies
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                This collection of {category.tips.length} expert tips for {categoryInfo.categoryTitle.toLowerCase()} 
                represents the best practices from leading authorities in the field. Each tip has been carefully selected 
                for its practical applicability and proven effectiveness.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">What You'll Learn</h3>
              <ul className="space-y-2 mb-4">
                <li><strong>Actionable Strategies:</strong> Step-by-step instructions for immediate implementation</li>
                <li><strong>Expert Insights:</strong> Why each tip works based on research and professional experience</li>
                <li><strong>Practical Application:</strong> Real-world examples and scenarios for maximum impact</li>
                <li><strong>Long-term Benefits:</strong> How these habits compound for lasting positive change</li>
              </ul>

              <p className="mb-4">
                Whether you're just starting your {categoryInfo.categoryTitle.toLowerCase()} journey or looking to 
                optimize your existing practices, these evidence-based tips provide a clear roadmap for success. 
                Click on any tip above to dive deeper into the methodology, implementation steps, and expert reasoning 
                behind each recommendation.
              </p>

              <div className="bg-muted/50 border-l-4 border-primary p-4 mt-6">
                <p className="text-sm">
                  <strong>Pro Tip:</strong> Start with 1-2 tips that resonate most with your current situation. 
                  Mastering a few practices thoroughly is more effective than trying to implement everything at once.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SmartTipsSubCategory;