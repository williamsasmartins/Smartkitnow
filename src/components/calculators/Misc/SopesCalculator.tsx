import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SopesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sopes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5109"
  );

  // --- DATA ---
  const title = "Sopes";
  const description = "Base grossa de masa com “bordas”, coberta com feijão, carne e salsa.";

  // INGREDIENTS
  const ingredients = [
    { name: "Masa harina (corn flour)", baseAmount: 250, unit: "g" },
    { name: "Warm water", baseAmount: 180, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Vegetable oil (for frying)", baseAmount: 60, unit: "ml" },
    { name: "Refried black beans", baseAmount: 300, unit: "g" },
    { name: "Cooked shredded beef or chicken", baseAmount: 400, unit: "g" },
    { name: "Crumbled queso fresco", baseAmount: 150, unit: "g" },
    { name: "Chopped lettuce", baseAmount: 100, unit: "g" },
    { name: "Diced tomatoes", baseAmount: 120, unit: "g" },
    { name: "Sour cream (crema)", baseAmount: 100, unit: "ml" },
    { name: "Chopped white onion", baseAmount: 50, unit: "g" },
    { name: "Chopped fresh cilantro", baseAmount: 15, unit: "g" },
    { name: "Salsa roja or salsa verde", baseAmount: 100, unit: "ml" },
    { name: "Lime wedges (optional)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "25g",
    carbs: "40g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are sopes and where do they originate from?",
      answer:
        "Sopes are a traditional Mexican dish consisting of a thick, small round base made from masa harina (corn dough) with pinched edges, topped with various ingredients such as beans, meat, cheese, lettuce, and salsa. They originate from central Mexico and are a staple in Mexican street food culture.",
    },
    {
      question: "How do I make the masa dough for sopes?",
      answer:
        "To make masa dough, mix masa harina with warm water and salt until a soft, pliable dough forms. It should not be sticky or dry. Let it rest for 10-15 minutes before shaping. This dough is then shaped into thick discs with pinched edges to hold the toppings.",
    },
    {
      question: "Can I use other toppings besides meat and beans?",
      answer:
        "Absolutely! Sopes are versatile and can be topped with a variety of ingredients including grilled vegetables, chorizo, mushrooms, cheese varieties, avocado slices, or even eggs. Feel free to customize based on your preferences or dietary needs.",
    },
    {
      question: "What is the best way to cook sopes for optimal texture?",
      answer:
        "Traditionally, sopes are first cooked on a hot griddle or skillet until lightly firm, then fried briefly in oil to create a crispy exterior while keeping the inside soft. This dual cooking method ensures a perfect balance of texture that holds the toppings well.",
    },
    {
      question: "How should sopes be served and stored?",
      answer:
        "Serve sopes warm immediately after cooking topped with fresh ingredients. If storing, keep the masa bases separately wrapped in a damp cloth in the refrigerator for up to 2 days. Reheat on a skillet before adding toppings to maintain texture.",
    },
    {
      question: "Are sopes gluten-free?",
      answer:
        "Yes, sopes are naturally gluten-free as they are made from corn masa harina, which contains no wheat or gluten. However, always check the labels of store-bought masa harina to ensure no cross-contamination.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sopes"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Sopes are a beloved Mexican street food featuring a thick, hand-formed
            corn dough base with raised edges, designed to hold a variety of savory
            toppings. This dish combines the hearty texture of masa with fresh,
            vibrant ingredients like refried beans, shredded meat, cheese, and
            crisp vegetables, creating a delightful balance of flavors and textures.
          </p>
          <p>
            Originating from central Mexico, sopes have been enjoyed for centuries,
            evolving from indigenous culinary traditions. Their simplicity and
            versatility have made them a staple in Mexican households and street
            markets alike, celebrated for their comforting and satisfying qualities.
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
              Prepare the Masa Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine masa harina and salt. Gradually add warm
              water while mixing until a soft, pliable dough forms. Cover with a
              damp cloth and let rest for 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Sopes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions (about 60g each). Flatten each
              portion into a thick disc about 3-4 inches in diameter. Pinch the edges
              to create a raised border to hold toppings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Sopes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a griddle or skillet over medium-high heat. Cook each sope for 1-2
              minutes per side until lightly firm. Then, fry briefly in hot oil until
              golden and crispy on the outside. Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a layer of warm refried beans on each sope. Top with shredded
              meat, crumbled queso fresco, chopped lettuce, diced tomatoes, onions,
              cilantro, and a drizzle of sour cream and salsa.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve sopes warm with lime wedges on the side for an extra burst of
              freshness. Enjoy as a hearty snack or a satisfying meal.
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
            Use warm water when mixing the masa dough to help it hydrate properly
            and achieve the right consistency.
          </li>
          <li>
            Pinching the edges firmly is key to preventing toppings from spilling
            over during cooking and serving.
          </li>
          <li>
            Fry sopes briefly after griddling to get a crispy exterior while keeping
            the inside soft and tender.
          </li>
          <li>
            Customize toppings with seasonal vegetables or your favorite proteins
            for variety.
          </li>
          <li>
            Serve immediately after assembling to enjoy the contrast of textures and
            fresh flavors.
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
              href="https://en.wikipedia.org/wiki/Sopes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Sopes
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/sopes-recipe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Sopes Recipe
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