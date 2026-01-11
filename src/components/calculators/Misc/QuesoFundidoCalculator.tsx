import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function QuesoFundidoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Queso%20Fundido%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7454"
  );

  // --- DATA ---
  const title = "Queso Fundido";
  const description = "Queijo derretido servido quente, geralmente com chorizo ou pimentas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chihuahua cheese (or Oaxaca cheese)", baseAmount: 500, unit: "g" },
    { name: "Chorizo, casing removed and crumbled", baseAmount: 150, unit: "g" },
    { name: "Poblano peppers, roasted, peeled, and diced", baseAmount: 2, unit: "pcs" },
    { name: "White onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "pcs" },
    { name: "Jalapeño pepper, finely chopped (optional)", baseAmount: 1, unit: "pc" },
    { name: "Olive oil", baseAmount: 1, unit: "tbsp" },
    { name: "Fresh cilantro, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh lime juice", baseAmount: 1, unit: "tbsp" },
    { name: "Corn tortillas, warmed (for serving)", baseAmount: 8, unit: "pcs" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "28g",
    carbs: "6g",
    fat: "35g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of cheese is best for Queso Fundido?",
      answer:
        "Traditionally, Chihuahua cheese or Oaxaca cheese is used for Queso Fundido due to their excellent melting properties and mild flavor. However, you can also use mozzarella or Monterey Jack as substitutes if these are unavailable.",
    },
    {
      question: "Can I make Queso Fundido vegetarian?",
      answer:
        "Absolutely! Simply omit the chorizo and add sautéed mushrooms, roasted poblano peppers, or other vegetables to maintain the rich, savory flavor. You can also add plant-based chorizo alternatives for a vegetarian-friendly version.",
    },
    {
      question: "How do I prevent the cheese from becoming oily or separating?",
      answer:
        "To avoid oil separation, use cheeses with good melting qualities and moderate fat content. Grate the cheese finely and melt it slowly over medium-low heat, stirring gently. Avoid overheating or cooking at high temperatures.",
    },
    {
      question: "What are traditional accompaniments for Queso Fundido?",
      answer:
        "Queso Fundido is traditionally served with warm corn tortillas or tortilla chips for dipping. It can also be accompanied by fresh salsa, guacamole, or pickled jalapeños to add brightness and contrast to the rich cheese.",
    },
    {
      question: "Can I prepare Queso Fundido ahead of time?",
      answer:
        "While Queso Fundido is best enjoyed fresh and hot, you can prepare the ingredients ahead of time and assemble just before serving. Reheat gently in a skillet or oven to restore the melted texture without overcooking.",
    },
    {
      question: "Is Queso Fundido gluten-free?",
      answer:
        "Yes, the cheese and chorizo mixture itself is naturally gluten-free. Just ensure that any tortillas or accompaniments you serve are also gluten-free, such as corn tortillas, to keep the dish safe for gluten-sensitive individuals.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Queso Fundido"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Queso Fundido is a beloved Mexican dish featuring melted cheese served
            hot, often combined with spicy chorizo or roasted peppers. This
            indulgent appetizer is perfect for sharing and is traditionally served
            bubbling in a cast-iron skillet alongside warm corn tortillas. The
            creamy, gooey texture and smoky, savory flavors make it a crowd-pleaser
            at any gathering.
          </p>
          <p>
            The origins of Queso Fundido trace back to northern Mexico, where
            melting cheeses like Chihuahua and Oaxaca are staples. The dish
            reflects the region's rich culinary heritage, blending indigenous
            ingredients with Spanish influences. Over time, it has become a
            popular appetizer across Mexico and beyond, celebrated for its simple
            yet deeply satisfying combination of melted cheese and flavorful
            toppings.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the casing from the chorizo and crumble it into small pieces.
              Roast the poblano peppers over an open flame or under a broiler until
              charred, then peel, deseed, and dice them. Finely chop the onion,
              garlic, and jalapeño if using.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Chorizo and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a skillet over medium heat. Add the chorizo and cook
              until browned and cooked through, about 5 minutes. Add the onion,
              garlic, jalapeño, and roasted poblano peppers, sautéing until the
              onion is translucent and fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Melt the Cheese
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat to medium-low and add the shredded cheese to the skillet,
              stirring gently to combine with the chorizo and vegetables. Continue
              cooking until the cheese is fully melted and bubbly, about 5 minutes.
              Season with salt and pepper to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh cilantro and a squeeze of lime juice for brightness.
              Serve immediately in the skillet or transfer to a warm serving dish.
              Accompany with warm corn tortillas for scooping and enjoy while hot.
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
            Use freshly shredded cheese rather than pre-shredded to ensure better
            melting and less oily separation.
          </li>
          <li>
            For extra smoky flavor, char the poblano peppers over an open flame and
            let them rest in a covered bowl to steam before peeling.
          </li>
          <li>
            If you don’t have chorizo, spicy Italian sausage or crumbled bacon can
            be good alternatives.
          </li>
          <li>
            Serve Queso Fundido immediately after melting to enjoy the perfect gooey
            texture.
          </li>
          <li>
            Warm your tortillas wrapped in a clean kitchen towel or in a tortilla
            warmer to keep them soft and pliable.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                {f.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {f.answer}
              </p>
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
              href="https://en.wikipedia.org/wiki/Queso_fundido"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Queso Fundido
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/queso-fundido-recipe-2342787"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Queso Fundido Recipe
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