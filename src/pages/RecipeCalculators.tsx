import { useNavigate } from "react-router-dom";
import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Baby, Heart, Utensils, Leaf, Globe, Flame, Cookie } from "lucide-react";
import { recipeData } from "@/data/recipeData";

export default function RecipeCalculators() {
  const navigate = useNavigate();

  const recipeCategories = [
    {
      title: "Baby Foods",
      icon: Baby,
      description: "Nutritious and safe recipes specially designed for babies and toddlers",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
      iconColor: "text-pink-600"
    },
    {
      title: "Health Foods",
      icon: Heart,
      description: "Wholesome recipes packed with nutrients for a healthy lifestyle",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600"
    },
    {
      title: "Finger Foods",
      icon: Utensils,
      description: "Easy-to-eat recipes perfect for snacking and entertaining",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "Gluten-Free",
      icon: Leaf,
      description: "Delicious gluten-free recipes for those with dietary restrictions",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      title: "Vegan",
      icon: Leaf,
      description: "Plant-based recipes that are both nutritious and flavorful",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      iconColor: "text-emerald-600"
    },
    {
      title: "International Foods",
      icon: Globe,
      description: "Explore flavors from around the world with these authentic recipes",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      title: "BBQ",
      icon: Flame,
      description: "Smoky and grilled recipes perfect for outdoor cooking",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      title: "Desserts",
      icon: Cookie,
      description: "Sweet treats and desserts to satisfy your cravings",
      color: "bg-rose-50 hover:bg-rose-100 border-rose-200",
      iconColor: "text-rose-600"
    }
  ];

  const handleSubCategoryClick = (categoryTitle: string) => {
    const slug = categoryTitle.toLowerCase().replace(/\s+/g, '-');
    const category = recipeCategories.find(cat => cat.title === categoryTitle);
    navigate(`/recipes/${slug}`, { 
      state: { 
        subCategory: {
          title: categoryTitle,
          description: category?.description,
          recipes: [] // Will be populated in the subcategory page
        }
      }
    });
  };

  const getRecipeCount = (title: string) => (recipeData as Record<string, any[]>)[title]?.length ?? 0;

  const intro = (
    <div className="space-y-3">
      <p>
        Discover delicious recipes from around the world.
      </p>
      <p>
        Whether you're cooking for your family, following a special diet, or exploring new cuisines, we have the perfect recipes for you.
      </p>
    </div>
  );

  const recommendedFooter = (
    <div className="space-y-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="flex justify-center">
        <ChefHat className="h-16 w-16 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipeCategories.map((category) => (
          <Card 
            key={category.title}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border"
            onClick={() => handleSubCategoryClick(category.title)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-full ${category.color} border`}>
                  <category.icon className={`h-8 w-8 ${category.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {getRecipeCount(category.title)} Recipes Available
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEO Content Section */}
      <section className="mt-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Why Choose Our Recipe Collection?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Nutrition-Focused</h3>
            <p className="text-muted-foreground">
              Every recipe includes detailed nutritional information to help you make informed choices.
            </p>
          </div>
          <div className="p-6">
            <Utensils className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Easy to Follow</h3>
            <p className="text-muted-foreground">
              Step-by-step instructions with prep times and difficulty levels for cooks of all skill levels.
            </p>
          </div>
          <div className="p-6">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Diverse Cuisines</h3>
            <p className="text-muted-foreground">
              Explore flavors from around the world and discover new favorite dishes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CategoryPageTemplate
      title="Recipe Collection"
      intro={intro}
      sections={[]}
      showTopBanner={true}
      showRightRail={true}
      contentBackgroundColor="#0c1324"
      recommendedFooter={recommendedFooter}
    />
  );
}