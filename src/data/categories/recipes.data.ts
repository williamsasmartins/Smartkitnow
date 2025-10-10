import { CategorySection } from "@/components/layouts/CategoryPageTemplate";
 
 export const RECIPES_TITLE = "Recipes"; 
 export const RECIPES_DESCRIPTION = 
   "Scalable, precise, and practical recipes. Adjust servings, convert units, and keep flavors consistent with clear, test-kitchen guidance."; 
 
 export const RECIPES_SECTIONS: CategorySection[] = [ 
   { 
     heading: "Popular Recipes", 
     items: [ 
       { title: "Basic Pizza Dough", to: "/recipes/pizza-dough" }, 
       { title: "Classic Pancakes", to: "/recipes/pancakes" }, 
       { title: "Homemade Bread", to: "/recipes/bread" }, 
       { title: "Roast Chicken", to: "/recipes/roast-chicken" }, 
       { title: "Chocolate Brownies", to: "/recipes/brownies" }, 
       { title: "Simple Pasta Sauce", to: "/recipes/pasta-sauce" }, 
     ], 
   }, 
   { 
     heading: "By Occasion", 
     items: [ 
       { title: "Quick Weeknight Dinners", to: "/recipes/weeknight" }, 
       { title: "Meal Prep Favorites", to: "/recipes/meal-prep" }, 
       { title: "Crowd-Pleasers", to: "/recipes/crowd" }, 
     ], 
   }, 
 ];