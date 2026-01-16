import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CrispyFriedPastriesPastelCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Crispy%20Fried%20Pastries%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6198"
  );

  // --- DATA ---
  const title = "Crispy Fried Pastries";
  const description = "Deep-fried brittle crust pies with various savory fillings.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 300, unit: "g" },
    { name: "Cold water", baseAmount: 150, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Vegetable oil (for dough)", baseAmount: 30, unit: "ml" },
    { name: "Ground beef", baseAmount: 250, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "pcs" },
    { name: "Green olives, chopped", baseAmount: 50, unit: "g" },
    { name: "Hard-boiled eggs, chopped", baseAmount: 2, unit: "pcs" },
    { name: "Cumin powder", baseAmount: 1, unit: "tsp" },
    { name: "Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt (for filling)", baseAmount: 3, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 1000, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "18g",
    carbs: "40g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of dough is best for crispy fried pastries?",
      answer:
        "A simple dough made from all-purpose flour, cold water, salt, and a bit of oil works best. It should be firm enough to hold the filling but pliable enough to fold and seal without cracking. Resting the dough before rolling helps develop gluten for better texture.",
    },
    {
      question: "Can I use other fillings besides ground beef?",
      answer:
        "Absolutely! These pastries are versatile and can be filled with a variety of savory ingredients such as shredded chicken, cheese and spinach, mushrooms, or even sweet fillings like fruit preserves. Just ensure the filling is not too wet to avoid soggy pastries.",
    },
    {
      question: "How do I achieve the perfect crispy texture when frying?",
      answer:
        "Use oil heated to around 180°C (350°F) and fry the pastries in small batches to maintain oil temperature. Avoid overcrowding the pan. Fry until golden brown on both sides, then drain on paper towels to remove excess oil.",
    },
    {
      question: "Can I bake these pastries instead of frying?",
      answer:
        "Yes, baking is a healthier alternative. Brush the pastries with oil or egg wash and bake in a preheated oven at 200°C (400°F) for 20-25 minutes or until golden and crispy. The texture will be slightly different but still delicious.",
    },
    {
      question: "How should I store leftover crispy fried pastries?",
      answer:
        "Store them in an airtight container in the refrigerator for up to 2 days. To re-crisp, reheat in a hot oven or air fryer rather than a microwave to avoid sogginess.",
    },
    {
      question: "What dipping sauces pair well with crispy fried pastries?",
      answer:
        "These pastries pair wonderfully with spicy tomato salsa, chimichurri, garlic aioli, or a simple yogurt-based dip. Choose a sauce that complements your filling for the best flavor experience.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Crispy Fried Pastries"
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
            Crispy Fried Pastries, often known as "pastel" in many Latin American
            and Mediterranean cuisines, are delightful deep-fried treats featuring a
            brittle, golden crust encasing a variety of savory fillings. These
            pastries are beloved for their satisfying crunch and rich, flavorful
            interiors, making them perfect as appetizers, snacks, or even light
            meals.
          </p>
          <p>
            The origins of these pastries trace back to ancient culinary traditions
            where dough was filled with spiced meats, vegetables, or cheeses and
            fried to preserve and enhance flavors. Variations exist worldwide,
            including empanadas, samosas, and Italian panzerotti, each reflecting
            local tastes and ingredients. This recipe draws inspiration from the
            classic pastel, combining a tender yet crispy dough with a savory ground
            beef filling enriched with olives, eggs, and aromatic spices.
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
              Prepare the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the all-purpose flour and salt. Gradually add
              cold water and vegetable oil, mixing until a firm dough forms. Knead
              for about 5 minutes until smooth. Cover with a damp cloth and let rest
              for 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a tablespoon of oil in a skillet over medium heat. Sauté the chopped
              onion and garlic until translucent. Add ground beef, cumin, paprika,
              salt, and pepper. Cook until browned and cooked through. Remove from
              heat and stir in chopped olives and hard-boiled eggs. Let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Pastries
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions and roll each into a thin circle
              about 12 cm in diameter. Place a spoonful of filling on one half of each
              circle. Fold the dough over to form a half-moon shape and press edges
              firmly to seal. Crimp edges with a fork for extra security.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Pastries
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep pan to 180°C (350°F). Fry pastries in small
              batches until golden brown and crispy, about 3-4 minutes per side.
              Remove with a slotted spoon and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the crispy fried pastries warm with your favorite dipping sauce or
              a fresh salad. They make a perfect appetizer or snack for any occasion.
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
            Use cold water and rest the dough to ensure a tender yet crispy crust.
          </li>
          <li>
            Avoid overfilling the pastries to prevent bursting during frying.
          </li>
          <li>
            Maintain oil temperature by frying in small batches for even crispiness.
          </li>
          <li>
            For extra flavor, add finely chopped fresh herbs like parsley or cilantro
            to the filling.
          </li>
          <li>
            If you prefer baking, brush pastries with oil and bake until golden for a
            lighter version.
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
              href="https://en.wikipedia.org/wiki/Empanada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Empanada (Similar Pastry)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/fried-pastry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Fried Pastry Overview
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