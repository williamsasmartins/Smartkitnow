import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenTingaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Tinga%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1415"
  );

  // --- DATA ---
  const title = "Chicken Tinga";
  const description = "Frango desfiado em molho de tomate e chipotle, levemente defumado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast, shredded", baseAmount: 500, unit: "g" },
    { name: "Chipotle peppers in adobo sauce", baseAmount: 2, unit: "pcs" },
    { name: "Tomato sauce", baseAmount: 400, unit: "ml" },
    { name: "White onion, sliced", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Chicken broth", baseAmount: 250, unit: "ml" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaf", baseAmount: 1, unit: "pc" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh cilantro, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "35g",
    carbs: "10g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Chicken Tinga?",
      answer:
        "Chicken Tinga is a traditional Mexican dish featuring shredded chicken simmered in a smoky, spicy tomato and chipotle pepper sauce. It is commonly served in tacos, tostadas, or as a filling for various Mexican dishes.",
    },
    {
      question: "Can I use other types of chicken for this recipe?",
      answer:
        "Yes, you can use chicken thighs or a whole chicken cut into pieces. Thighs tend to be juicier and more flavorful, but breasts work well for a leaner option. Just ensure the chicken is cooked thoroughly before shredding.",
    },
    {
      question: "How spicy is Chicken Tinga?",
      answer:
        "The heat level depends on the amount and type of chipotle peppers used. Chipotle peppers are smoked jalapeños and have a moderate heat with a smoky flavor. You can adjust the number of peppers or remove seeds to control spiciness.",
    },
    {
      question: "Can I make Chicken Tinga ahead of time?",
      answer:
        "Absolutely! Chicken Tinga tastes even better the next day as the flavors meld together. Store it in an airtight container in the refrigerator for up to 3 days or freeze for longer storage.",
    },
    {
      question: "What are some serving suggestions for Chicken Tinga?",
      answer:
        "Chicken Tinga is versatile. Serve it in warm corn or flour tortillas with fresh toppings like avocado, cilantro, diced onions, and a squeeze of lime. It also works great over rice, in burritos, or as a topping for tostadas.",
    },
    {
      question: "Can I substitute chipotle peppers with something else?",
      answer:
        "If chipotle peppers are unavailable, you can substitute with smoked paprika and a bit of cayenne pepper to mimic the smoky heat. However, the authentic flavor comes from chipotle, so try to use them if possible.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Tinga"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
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
            Chicken Tinga is a vibrant and flavorful Mexican dish featuring tender shredded chicken simmered in a rich, smoky tomato and chipotle pepper sauce. This recipe balances smoky heat with savory spices, creating a comforting and versatile filling perfect for tacos, tostadas, or even rice bowls. The combination of fresh ingredients and slow simmering infuses the chicken with deep, complex flavors that are sure to delight your palate.
          </p>
          <p>
            Originating from Puebla, Mexico, Tinga has become a beloved staple across Mexican cuisine. Traditionally made with beef or pork, chicken versions have gained popularity for their lighter yet equally satisfying taste. The use of chipotle peppers—smoked and dried jalapeños—adds a distinctive smoky heat that defines the dish. Over time, Chicken Tinga has transcended borders, inspiring countless variations and adaptations worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chicken</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the chicken breasts in a pot and cover with water. Add a pinch of salt and bring to a boil. Reduce heat and simmer for 15-20 minutes until cooked through. Remove chicken and shred using two forks. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a large skillet over medium heat. Add sliced onions and sauté until translucent, about 5 minutes. Add minced garlic and cook for another minute until fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a blender, combine chipotle peppers, tomato sauce, chicken broth, oregano, cumin, salt, and pepper. Blend until smooth.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Tinga</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the blended sauce into the skillet with sautéed onions and garlic. Add the bay leaf and bring to a simmer. Cook for 10 minutes, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Chicken and Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shredded chicken to the sauce and stir well to coat. Simmer for another 5-10 minutes to allow flavors to meld. Remove bay leaf before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Garnish with chopped fresh cilantro and serve with lime wedges. Enjoy in warm tortillas or your preferred accompaniment.
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
            For a richer flavor, roast the chipotle peppers and tomatoes before blending.
          </li>
          <li>
            Use homemade chicken broth if possible for deeper taste.
          </li>
          <li>
            Adjust the number of chipotle peppers to control the heat level.
          </li>
          <li>
            Leftover Tinga freezes well; portion and freeze for quick meals.
          </li>
          <li>
            Serve with pickled red onions or crumbled queso fresco for authentic texture contrast.
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
              href="https://en.wikipedia.org/wiki/Tinga"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tinga (Mexican dish)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/chicken-tinga-recipe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Chicken Tinga Recipe
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
      jsonLd={faqJsonLd}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}