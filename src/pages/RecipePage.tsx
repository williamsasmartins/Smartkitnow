import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, ChefHat, Star, Heart, Bookmark } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipe, category } = location.state || {};

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Recipe Not Found</h1>
            <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/recipes')}>
              Back to Recipes
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBackClick = () => {
    const categorySlug = category?.toLowerCase().replace(/\s+/g, '-');
    navigate(`/recipes/${categorySlug}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ingredients = recipe.keyIngredients.split(', ');
  const steps = recipe.preparationSummary.split(/(?<=\.)\s+(?=[A-Z])/);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted rounded-lg mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category} Recipes
          </button>
        </div>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-6">
            <ChefHat className="h-24 w-24 text-primary/60" />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {recipe.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{recipe.rating}</span>
                </div>
                <span>•</span>
                <span>{category}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-2" />
              {recipe.prepTime}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              Serves {recipe.servings}
            </Badge>
            <Badge className={`px-3 py-1 ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </Badge>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-primary mt-1 flex-shrink-0"></div>
                      <span className="text-sm">{ingredient.trim()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Nutrition Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recipe.nutrition}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{step.trim()}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Tips & Notes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Chef's Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Pro Tip:</strong> For best results, ensure all ingredients are at room temperature before starting.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      🌱 <strong>Storage:</strong> This recipe can be stored in the refrigerator for up to 3 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Source */}
        {recipe.source && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                Recipe source: <span className="font-medium">{recipe.source}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}