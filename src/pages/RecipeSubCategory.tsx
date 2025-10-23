import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { recipeData } from "@/data/recipeData";

import { getCategoryIcon } from "@/lib/navigation";
// Removed Lucide icon; using category emoji via navigation

export default function RecipeSubCategory() {
  const navigate = useNavigate();

  const { categorySlug } = useParams();
  
  const categoryTitle = categorySlug?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  const recipes = recipeData[categoryTitle] || [];

  // Emoji para o header da subcategoria (usa ícone da categoria Recipes)
  const emoji = getCategoryIcon("recipes");

  const handleRecipeClick = (recipe: any) => {
    const slug = recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/recipe/${slug}`, { 
      state: { 
        recipe,
        category: categoryTitle
      }
    });
  };

  // Back button removido

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">

          {/* Back button removed as requested */}
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-sm text-[20px] leading-none select-none" aria-hidden="true">
                {emoji}
              </span>
              <h1 className="block text-[28px] md:text-[32px] font-bold tracking-[-0.01em]">{categoryTitle} Recipes</h1>
            </div>
            <div className="mt-2 text-sm skn-text-muted">{recipes.length} recipes</div>

            {/* Description paragraph removed as requested */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {recipe.name}
                  </CardTitle>
                  <span className="text-sm font-medium text-yellow-500">⭐ {recipe.rating}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <span className="mr-1">⏱️</span>
                    {recipe.prepTime}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <span className="mr-1">👥</span>
                    {recipe.servings}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {recipe.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Ingredients:</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {recipe.keyIngredients}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Nutrition Highlights:</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {recipe.nutrition}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => handleRecipeClick(recipe)}
                    className="w-full"
                  >
                    View Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <span className="h-16 w-16 text-[40px] leading-none mx-auto mb-4 select-none">👨‍🍳</span>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Recipes Found</h3>
            <p className="text-muted-foreground">
              We're working on adding recipes for this category. Check back soon!
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}