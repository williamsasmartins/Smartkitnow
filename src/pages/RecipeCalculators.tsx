import { useNavigate } from "react-router-dom";
import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { recipeData } from "@/data/recipeData";
import { subcategoryIcon, categoryIcon } from "@/data/calculatorRegistry";

export default function RecipeCalculators() {
  const navigate = useNavigate();

  const recipeCategories = [
    {
      title: "Baby Foods",
      slug: "baby-foods",
      description: "Nutritious and safe recipes specially designed for babies and toddlers",
    },
    {
      title: "Health Foods",
      slug: "health-foods",
      description: "Wholesome recipes packed with nutrients for a healthy lifestyle",
    },
    {
      title: "Finger Foods",
      slug: "finger-foods",
      description: "Easy-to-eat recipes perfect for snacking and entertaining",
    },
    {
      title: "Gluten-Free",
      slug: "gluten-free",
      description: "Delicious gluten-free recipes for those with dietary restrictions",
    },
    {
      title: "Vegan",
      slug: "vegan",
      description: "Plant-based recipes that are both nutritious and flavorful",
    },
    {
      title: "International Foods",
      slug: "international-foods",
      description: "Explore flavors from around the world with these authentic recipes",
    },
    {
      title: "BBQ",
      slug: "bbq",
      description: "Smoky and grilled recipes perfect for outdoor cooking",
    },
    {
      title: "Desserts",
      slug: "desserts",
      description: "Sweet treats and desserts to satisfy your cravings",
    }
  ] as const;

  const handleSubCategoryClick = (categoryTitle: string, slug: string) => {
    navigate(`/recipes/${slug}`, {
      state: {
        subCategory: {
          title: categoryTitle,
          description: recipeCategories.find(cat => cat.title === categoryTitle)?.description,
          recipes: [] // Will be populated in the subcategory page
        }
      }
    });
  };

  const getRecipeCount = (title: string) => (recipeData as Record<string, any[]>)[title]?.length ?? 0;

  const description = "Discover delicious recipes from around the world. Whether you're cooking for your family, following a special diet, or exploring new cuisines, we have the perfect recipes for you.";

  const headerSlot = (
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
        <span className="text-4xl" aria-hidden="true">{categoryIcon('cooking')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipeCategories.map((category) => (
          <Card 
            key={category.title}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border"
            onClick={() => handleSubCategoryClick(category.title, category.slug)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full border">
                  <span className="text-2xl" aria-hidden="true">{subcategoryIcon(category.slug, 'cooking')}</span>
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
            <span className="text-3xl mx-auto mb-4 block" aria-hidden="true">{subcategoryIcon('health-foods', 'cooking')}</span>
            <h3 className="text-xl font-semibold mb-3">Nutrition-Focused</h3>
            <p className="text-muted-foreground">
              Every recipe includes detailed nutritional information to help you make informed choices.
            </p>
          </div>
          <div className="p-6">
            <span className="text-3xl mx-auto mb-4 block" aria-hidden="true">{subcategoryIcon('finger-foods', 'cooking')}</span>
            <h3 className="text-xl font-semibold mb-3">Easy to Follow</h3>
            <p className="text-muted-foreground">
              Step-by-step instructions with prep times and difficulty levels for cooks of all skill levels.
            </p>
          </div>
          <div className="p-6">
            <span className="text-3xl mx-auto mb-4 block" aria-hidden="true">{subcategoryIcon('international-foods', 'cooking')}</span>
            <h3 className="text-xl font-semibold mb-3">Diverse Cuisines</h3>
            <p className="text-muted-foreground">
              Explore flavors from around the world and discover new favorite dishes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const sections = [
    {
      heading: "Recipe Categories",
      items: recipeCategories.map((cat) => ({ title: cat.title, to: `/recipes/${cat.slug}` })),
    },
  ];
  return (
    <CategoryPageTemplate
      title="Recipe Collection"
      description={description}
      sections={sections}
      headerSlot={headerSlot}
      kind="recipes"
    />
  );
}