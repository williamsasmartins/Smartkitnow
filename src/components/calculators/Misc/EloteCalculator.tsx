import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EloteCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mexican%20Street%20Corn%20Elote%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2887"
  );

  // --- DATA ---
  const title = "Mexican Street Corn (Elote)";
  const description = "Espiga de milho com maionese, queijo, limão e chili.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Corn on the Cob", baseAmount: 4, unit: "ears" },
    { name: "Mayonnaise", baseAmount: 0.5, unit: "cup" },
    { name: "Sour Cream", baseAmount: 0.25, unit: "cup" },
    { name: "Cotija Cheese, crumbled", baseAmount: 0.75, unit: "cup" },
    { name: "Lime Juice", baseAmount: 2, unit: "tbsp" },
    { name: "Chili Powder", baseAmount: 1, unit: "tsp" },
    { name: "Garlic Powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Cilantro, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Unsalted Butter", baseAmount: 2, unit: "tbsp" },
    { name: "Optional: Tajín Seasoning", baseAmount: 1, unit: "tsp" },
    { name: "Optional: Hot Sauce", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "7g",
    carbs: "30g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(2).replace(/\.00$/, "").replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Elote and where does it originate from?",
      answer:
        "Elote is a popular Mexican street food consisting of grilled corn on the cob slathered with a creamy, tangy, and spicy sauce, then topped with cheese and seasonings. It originated in Mexico and is commonly sold by street vendors, especially during festivals and fairs.",
    },
    {
      question: "Can I make Elote without grilling the corn?",
      answer:
        "Yes, while grilling imparts a smoky flavor and slight char that enhances the dish, you can boil or steam the corn if grilling isn't an option. The toppings will still provide the classic Elote taste.",
    },
    {
      question: "What cheese is traditionally used in Elote?",
      answer:
        "Cotija cheese is the traditional choice for Elote. It's a crumbly, salty Mexican cheese that adds a wonderful savory contrast to the creamy sauce. If unavailable, feta or Parmesan can be used as substitutes.",
    },
    {
      question: "How spicy is Elote and can I adjust the heat?",
      answer:
        "Elote typically has a mild to moderate heat level, mainly from chili powder or Tajín seasoning. You can easily adjust the spiciness by adding more or less chili powder or including hot sauce according to your preference.",
    },
    {
      question: "Is Elote suitable for vegetarians or vegans?",
      answer:
        "Traditional Elote contains dairy products like mayonnaise, sour cream, and cheese, making it vegetarian but not vegan. To make a vegan version, substitute dairy ingredients with plant-based alternatives such as vegan mayo, cashew cream, and vegan cheese.",
    },
    {
      question: "How do I store leftover Elote?",
      answer:
        "Elote is best enjoyed fresh, but leftovers can be stored in an airtight container in the refrigerator for up to 2 days. Reheat gently on a grill or stovetop to avoid drying out the corn and toppings.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mexican Street Corn (Elote)"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Mexican Street Corn, or Elote, is a beloved street food that captures the vibrant flavors of Mexico in a simple yet indulgent snack. Grilled corn on the cob is generously coated with a creamy mixture of mayonnaise and sour cream, then sprinkled with salty Cotija cheese, zesty lime juice, and a touch of chili powder for a perfect balance of smoky, tangy, and spicy notes. This recipe brings the authentic taste of Mexican street vendors right to your kitchen.
          </p>
          <p>
            The origins of Elote trace back to Mexico’s rich agricultural heritage, where corn has been a staple crop for thousands of years. Traditionally sold by street vendors, Elote has become a cultural icon, enjoyed at fairs, markets, and family gatherings. Its popularity has spread worldwide, inspiring countless variations and adaptations while maintaining its core deliciousness.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Corn</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Husk the corn and remove all silk threads. Rinse under cold water and pat dry. Preheat your grill to medium-high heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Grill the Corn</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Brush the corn with melted butter and place it on the grill. Cook for about 10 minutes, turning occasionally, until the kernels are tender and charred in spots.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, mix mayonnaise, sour cream, lime juice, garlic powder, chili powder, and salt until smooth and well combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Coat the Corn</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a brush or spoon, generously coat each ear of grilled corn with the sauce mixture, ensuring even coverage.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Toppings and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle crumbled Cotija cheese, chopped cilantro, and a dusting of chili powder or Tajín seasoning over the coated corn. Serve immediately with lime wedges and optional hot sauce on the side.
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
            For an extra smoky flavor, char the corn directly over open flames or use a cast iron skillet to grill indoors.
          </li>
          <li>
            If Cotija cheese is unavailable, try using a mix of feta and Parmesan for a similar salty, crumbly texture.
          </li>
          <li>
            To make the recipe vegan, substitute mayonnaise and sour cream with vegan alternatives and use a plant-based cheese or nutritional yeast.
          </li>
          <li>
            Serve Elote with lime wedges to add a fresh citrus brightness that balances the richness of the sauce.
          </li>
          <li>
            Leftover sauce can be used as a dip for chips or drizzled over roasted vegetables for a flavorful twist.
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
              href="https://en.wikipedia.org/wiki/Elote"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Elote
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-street-corn-elote-recipe-2342794"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Street Corn Recipe
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