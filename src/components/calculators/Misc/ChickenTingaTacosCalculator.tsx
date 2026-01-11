import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenTingaTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Tinga%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9947"
  );

  // --- DATA ---
  const title = "Chicken Tinga Tacos";
  const description = "Tacos de frango desfiado em molho de tomate e chipotle.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast (boneless, skinless)", baseAmount: 500, unit: "g" },
    { name: "Chipotle peppers in adobo sauce", baseAmount: 2, unit: "pcs" },
    { name: "Canned tomatoes (diced)", baseAmount: 400, unit: "g" },
    { name: "White onion (medium, sliced)", baseAmount: 1, unit: "pc" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Chicken broth", baseAmount: 250, unit: "ml" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaf", baseAmount: 1, unit: "pc" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Corn tortillas", baseAmount: 8, unit: "pcs" },
    { name: "Fresh cilantro (chopped, for garnish)", baseAmount: 10, unit: "g" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "35g",
    carbs: "30g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Chicken Tinga?",
      answer:
        "Chicken Tinga is a traditional Mexican dish made with shredded chicken simmered in a smoky, spicy sauce made from chipotle peppers, tomatoes, and onions. It's commonly used as a flavorful filling for tacos, tostadas, and other Mexican dishes.",
    },
    {
      question: "Can I use other types of chicken for this recipe?",
      answer:
        "Yes, you can use chicken thighs or a whole chicken cut into pieces. Chicken thighs tend to be juicier and more flavorful, but chicken breast works well for a leaner option. Adjust cooking time accordingly to ensure the chicken is fully cooked and tender.",
    },
    {
      question: "How spicy is this recipe?",
      answer:
        "The heat level depends on the amount of chipotle peppers used. Chipotles are smoked jalapeños and have a moderate to high heat with a smoky flavor. You can reduce the number of chipotle peppers or remove the seeds to lower the spiciness.",
    },
    {
      question: "Can I prepare Chicken Tinga in advance?",
      answer:
        "Absolutely! Chicken Tinga tastes even better the next day as the flavors meld together. You can store it in an airtight container in the refrigerator for up to 3 days or freeze it for longer storage.",
    },
    {
      question: "What are some good toppings for Chicken Tinga Tacos?",
      answer:
        "Popular toppings include diced onions, fresh cilantro, crumbled queso fresco, sliced avocado, sour cream, and a squeeze of fresh lime juice. Feel free to customize with your favorite taco toppings.",
    },
    {
      question: "Can I make this recipe vegetarian?",
      answer:
        "Yes, you can substitute the chicken with jackfruit or mushrooms for a vegetarian version. Use the same sauce and cooking method to achieve a similar texture and flavor profile.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Tinga Tacos"
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
            Chicken Tinga Tacos are a vibrant and flavorful Mexican classic featuring tender shredded chicken simmered in a rich, smoky tomato and chipotle sauce. This dish perfectly balances heat, smokiness, and tang, making it a beloved choice for taco lovers worldwide. The combination of spices and slow-cooked chicken creates a comforting yet exciting meal that’s easy to prepare and perfect for any occasion.
          </p>
          <p>
            Originating from Puebla, Mexico, Tinga has deep roots in Mexican culinary tradition. Historically, it was a way to repurpose leftover meat by cooking it down with tomatoes, chipotle peppers, and spices to create a deliciously saucy filling. Over time, Chicken Tinga has evolved into a popular street food and home-cooked favorite, celebrated for its bold flavors and versatility.
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
              In a large pot, add chicken breasts and cover with water or chicken broth. Bring to a boil, then reduce heat and simmer for 15-20 minutes until cooked through. Remove chicken and shred using two forks. Reserve broth for later use.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Tinga Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet over medium heat. Add sliced onions and cook until translucent, about 5 minutes. Add minced garlic and cook for another minute. Stir in diced tomatoes, chipotle peppers, oregano, cumin, bay leaf, salt, and pepper. Simmer for 10 minutes, adding reserved chicken broth as needed to maintain a saucy consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Chicken and Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add shredded chicken to the skillet with the sauce. Stir well to coat the chicken evenly. Simmer for another 10 minutes to allow the flavors to meld and the chicken to absorb the smoky sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat corn tortillas on a dry skillet or griddle over medium heat for about 30 seconds per side until warm and pliable.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the chicken tinga onto warm tortillas. Garnish with chopped cilantro and a squeeze of fresh lime juice. Add optional toppings like diced onions, avocado slices, or queso fresco if desired. Serve immediately and enjoy!
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
            For a smoother sauce, blend the tomato and chipotle mixture before adding the shredded chicken.
          </li>
          <li>
            Use homemade chicken broth for richer flavor, or enhance store-bought broth with a bouillon cube.
          </li>
          <li>
            Toast the tortillas lightly on an open flame for a slight char and smoky aroma.
          </li>
          <li>
            Adjust chipotle peppers to control heat; remove seeds for milder flavor.
          </li>
          <li>
            Leftover chicken tinga can be used in quesadillas, burritos, or as a topping for nachos.
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
              Wikipedia: Tinga (Mexican cuisine)
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