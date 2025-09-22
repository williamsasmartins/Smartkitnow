import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Clock, CheckCircle, Lightbulb, TrendingUp, Share2, Bookmark, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getSmartTipBySlug, getSmartTipsCategoryBySlug } from '@/data/smartTipsData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const SmartTipDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const tip = getSmartTipBySlug(slug || '');
  const category = tip ? getSmartTipsCategoryBySlug(tip.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')) : null;
  
  console.log('SmartTipDetail Debug:', { slug, tip, category });
  
  const locationState = location.state || {};
  const categorySlug = locationState.categorySlug || category?.slug;
  const categoryTitle = locationState.categoryTitle || category?.title;

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    if (locationState.fromSubcategory && categorySlug) {
      navigate(`/smart-tips/${categorySlug}`, {
        state: {
          categoryTitle,
          categoryDescription: category?.description,
          categoryColor: category?.color,
          categoryIconColor: category?.iconColor,
          categoryIcon: category?.icon
        }
      });
    } else {
      navigate('/smart-tips');
    }
  };

  if (!tip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Tip Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested smart tip could not be found.</p>
            <Button onClick={() => navigate('/smart-tips')}>
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
        <nav className="mb-6">
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2 mb-6"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">{tip.category}</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                8 min read
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" />
                Expert Tip
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-primary mb-4 leading-tight">
              {tip.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {tip.description}
            </p>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Source: {tip.source}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Main Content */}
          <div className="space-y-8">
            {/* Why This Works Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Why This Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {tip.expandedContent.whyThisWorks}
                </p>
              </CardContent>
            </Card>

            {/* Step-by-Step Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Step-by-Step Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {tip.expandedContent.stepByStep.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Expert Insight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Expert Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-primary bg-muted/50 p-4 italic text-muted-foreground">
                  "{tip.expandedContent.expertInsight}"
                </blockquote>
              </CardContent>
            </Card>

            {/* Related Tips */}
            {tip.expandedContent.relatedTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Related Tips</CardTitle>
                  <CardDescription>
                    Enhance your success by exploring these complementary strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tip.expandedContent.relatedTips.map((relatedTip, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                        {relatedTip.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Implementation Success Tips */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Keys to Success</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Start small and build consistency before increasing complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Track your progress to maintain motivation and identify improvements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Be patient with yourself - meaningful change takes time to develop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Adapt the approach to fit your specific circumstances and lifestyle</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold text-primary mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              The best time to implement positive change is now. Choose one step from the guide above and 
              commit to practicing it for the next week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <CheckCircle className="h-5 w-5" />
                Mark as Implemented
              </Button>
              <Button variant="outline" size="lg" onClick={handleBackClick}>
                Explore More Tips
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default SmartTipDetail;