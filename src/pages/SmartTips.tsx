import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Plane, DollarSign, Heart, Leaf, Laptop, Users, Briefcase, Brain, Shield, Wrench, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { smartTipsCategories } from '@/data/smartTipsData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const iconMap = {
  Home,
  Plane,
  DollarSign,
  Heart,
  Leaf,
  Laptop,
  Smartphone,
  Users,
  Briefcase,
  Brain,
  Shield,
  Wrench,
};

const SmartTips: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug: string) => {
    const category = smartTipsCategories.find(cat => cat.slug === categorySlug);
    navigate(`/smart-tips/${categorySlug}`, { 
      state: { 
        categoryTitle: category?.title,
        categoryDescription: category?.description,
        categoryColor: category?.color,
        categoryIconColor: category?.iconColor,
        categoryIcon: category?.icon
      } 
    });
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackClick}
            className="gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Smart Tips Collection</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover practical, expert-backed tips across all areas of life. From home organization to career development, 
            each category contains 10 carefully curated tips designed to improve your daily routine and long-term success.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {smartTipsCategories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            
            return (
              <Card
                key={category.slug}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${category.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-center leading-relaxed">
                    {category.description}
                  </CardDescription>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {category.tips.length} Tips
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Transform Your Life with Expert-Backed Smart Tips</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Our comprehensive Smart Tips collection brings together evidence-based advice from leading experts across 
                12 essential life categories. Each tip has been carefully researched and tested to provide maximum impact 
                with minimal effort.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Why These Tips Work</h3>
              <ul className="space-y-2 mb-4">
                <li><strong>Expert-Sourced:</strong> Every tip comes from recognized authorities and proven research</li>
                <li><strong>Actionable Steps:</strong> Clear, step-by-step instructions make implementation easy</li>
                <li><strong>Practical Focus:</strong> Designed for real-world application in busy lifestyles</li>
                <li><strong>Comprehensive Coverage:</strong> From health and finances to productivity and relationships</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Featured Categories</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-foreground">Personal Development</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Health & Wellness optimization</li>
                    <li>• Mental Health & Self-Care practices</li>
                    <li>• Career Development strategies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Practical Living</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Home Organization & Cleaning</li>
                    <li>• Personal Finance management</li>
                    <li>• DIY & Home Maintenance</li>
                  </ul>
                </div>
              </div>

              <p>
                Start exploring any category that interests you most, or browse systematically to create a comprehensive 
                improvement plan. Each tip includes the science behind why it works, making it easier to understand and 
                maintain new habits long-term.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SmartTips;