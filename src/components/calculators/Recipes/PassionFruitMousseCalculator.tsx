import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function PassionFruitMousseCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Passion%20Fruit%20Mousse%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1999"
  );

  // --- DATA ---
  const title = "Passion Fruit Mousse";
  const description = "Tart, creamy, and light tropical fruit dessert.";

  // INGREDIENTS
  const ingredients = [
    { name: "Passion Fruit Pulp", baseAmount: 250, unit: "g" },
    { name: "Heavy Cream", baseAmount: 200, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 100, unit: "g" },
    { name: "Gelatin Sheets", baseAmount: 4, unit: "sheets" },
    { name: "Water (for gelatin)", baseAmount: 60, unit: "ml" },
    { name: "Egg Whites", baseAmount: 3, unit: "large" },
    { name: "Lime Juice", baseAmount: 15, unit: "ml" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
    { name: "Powdered Sugar (for meringue)", baseAmount: 30, unit: "g" },
    { name: "Mint Leaves (for garnish)", baseAmount: 8, unit: "leaves" },
    { name: "Passion Fruit Seeds (for garnish)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "3g",
    carbs: "25g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use powdered gelatin instead of gelatin sheets?",
      answer:
        "Yes, you can substitute gelatin sheets with powdered gelatin. Use about 1 teaspoon of powdered gelatin for every 4 sheets. Sprinkle the powder over cold water (about 60 ml) and let it bloom for 5 minutes before gently heating to dissolve. Then incorporate it into the mousse mixture as you would with sheets.",
    },
    {
      question: "How do I ensure the mousse is light and airy?",
      answer:
        "The key to a light mousse is properly whipping the heavy cream to soft peaks and folding it gently into the passion fruit mixture. Also, beating the egg whites to stiff peaks and folding them in carefully helps incorporate air without deflating the mixture.",
    },
    {
      question: "Can I make this mousse vegan or dairy-free?",
      answer:
        "To make a vegan version, replace heavy cream with coconut cream or a plant-based whipping cream. Use agar-agar instead of gelatin as a setting agent. Note that texture and flavor may vary slightly from the traditional mousse.",
    },
    {
      question: "How long can I store the passion fruit mousse?",
      answer:
        "Store the mousse covered in the refrigerator for up to 3 days. The texture is best enjoyed fresh, but it will keep well chilled. Avoid freezing as it can alter the mousse’s delicate texture.",
    },
    {
      question: "What is the best way to serve passion fruit mousse?",
      answer:
        "Serve chilled in individual glasses or ramekins. Garnish with fresh passion fruit seeds and mint leaves for a fresh, vibrant presentation. Pair it with a crisp white wine or sparkling wine for an elegant dessert experience.",
    },
    {
      question: "Is it safe to use raw egg whites in this recipe?",
      answer:
        "Raw egg whites are used to create a light texture, but they carry a risk of salmonella. To reduce risk, use pasteurized egg whites or ensure eggs are fresh and from a trusted source. Alternatively, you can omit egg whites and rely on whipped cream and gelatin for texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Dessert",
    recipeCuisine: "Brazilian",
    keywords: "passion fruit mousse, mousse de maracuja, tropical dessert, brazilian mousse, light dessert, traditional recipe",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Dissolve softened gelatin sheets in warm water and set aside.",
      "Combine passion fruit pulp, sugar, lime juice, vanilla, and salt; fold in gelatin.",
      "Whip heavy cream to soft peaks and set aside.",
      "Beat egg whites with salt and powdered sugar to stiff, glossy peaks.",
      "Gently fold whipped cream and then the meringue into the passion fruit mixture.",
      "Spoon into glasses and refrigerate for at least 4 hours until set."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Passion Fruit Mousse"
          width="1280"
          height="720"
          className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1280&auto=format&fit=crop"
            )
          }
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 10m
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Utensils className="h-5 w-5 text-orange-500" /> Ingredients
            </span>
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border p-1 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
                aria-label="Increase servings"
              >
                +
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-base">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-base text-slate-700 dark:text-slate-200">
                    {getAmount(ing.baseAmount)} {ing.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Fat</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Passion Fruit Mousse is a delightful tropical dessert that balances the tartness of passion fruit with the creamy richness of whipped cream and the lightness of aerated egg whites. This mousse is perfect for warm weather or as a refreshing end to any meal, offering a vibrant flavor and a smooth, airy texture that melts in your mouth.
          </p>
          <p>
            Originating from tropical regions where passion fruit is abundant, this dessert has been embraced worldwide for its unique flavor profile and elegant presentation. The use of gelatin to set the mousse ensures a delicate firmness while maintaining its lightness. Traditionally served chilled and garnished with fresh passion fruit seeds and mint, it is a favorite in many fine dining establishments.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Gelatin</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the gelatin sheets in cold water for about 5 minutes until soft. Meanwhile, warm the 60 ml of water in a small saucepan over low heat. Squeeze excess water from the gelatin sheets and dissolve them in the warm water. Set aside to cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix Passion Fruit and Sugar</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine the passion fruit pulp, granulated sugar, lime juice, vanilla extract, and salt. Stir until the sugar dissolves completely. Gently fold the dissolved gelatin into this mixture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Whip the Cream</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a chilled bowl, whip the heavy cream to soft peaks. Be careful not to overwhip. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Meringue</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a clean bowl, beat the egg whites with a pinch of salt until soft peaks form. Gradually add powdered sugar and continue beating until stiff, glossy peaks form.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine All Components</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently fold the whipped cream into the passion fruit mixture until well combined. Then carefully fold in the meringue, preserving as much air as possible to keep the mousse light.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the mousse into serving glasses or ramekins. Refrigerate for at least 4 hours or until set. Garnish with fresh passion fruit seeds and mint leaves before serving.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-3 text-amber-900 dark:text-amber-100 text-base">
          <li>
            Use ripe, fresh passion fruits for the best flavor. If unavailable, passion fruit pulp from a trusted brand can be used.
          </li>
          <li>
            Chill your mixing bowls and beaters before whipping cream or egg whites to achieve better volume.
          </li>
          <li>
            When folding ingredients, use a gentle motion with a spatula to maintain the mousse’s airy texture.
          </li>
          <li>
            If you prefer a less sweet mousse, reduce the sugar slightly but balance with the tartness of passion fruit.
          </li>
          <li>
            For an elegant presentation, serve the mousse in clear glasses to showcase its vibrant color.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" /> References
        </h3>
        <ul className="space-y-3 text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://en.wikipedia.org/wiki/Passion_fruit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Passion Fruit
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bbcgoodfood.com/recipes/passion-fruit-mousse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              BBC Good Food: Passion Fruit Mousse Recipe
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={widget}
      editorial={editorial}
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}