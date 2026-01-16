import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SidesWhiteRiceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/White%20Rice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3990"
  );

  // --- DATA ---
  const title = "White Rice";
  const description = "Brazilian-style garlic-scented long-grain white rice.";

  // INGREDIENTS
  const ingredients = [
    { name: "Long-grain white rice", baseAmount: 500, unit: "g" },
    { name: "Water", baseAmount: 750, unit: "ml" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "pcs" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Bay leaf", baseAmount: 1, unit: "pc" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "small" },
    { name: "Black peppercorns", baseAmount: 5, unit: "pcs" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Butter (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Lime wedge (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition facts per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "4.3g",
    carbs: "45g",
    fat: "2.5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for this recipe?",
      answer:
        "Long-grain white rice is ideal for this Brazilian-style garlic rice because it cooks up fluffy and separate, avoiding clumping. Avoid short-grain or sticky rice varieties as they tend to be more glutinous and less fluffy.",
    },
    {
      question: "Can I use broth instead of water for cooking the rice?",
      answer:
        "Yes, substituting water with chicken or vegetable broth adds extra depth and richness to the rice. Just use the same volume as water and adjust salt accordingly since broth can be salty.",
    },
    {
      question: "How do I prevent the rice from sticking or burning?",
      answer:
        "Rinsing the rice thoroughly before cooking removes excess starch, which helps prevent sticking. Also, sautéing the rice in oil before adding water coats the grains, further reducing stickiness. Use a heavy-bottomed pot and cook on low heat once boiling to avoid burning.",
    },
    {
      question: "Can I prepare this rice recipe ahead of time?",
      answer:
        "Yes, you can prepare the rice in advance and store it in an airtight container in the refrigerator for up to 3 days. Reheat gently with a splash of water to restore moisture and fluffiness.",
    },
    {
      question: "What are some good dishes to serve with this white rice?",
      answer:
        "This garlic-scented white rice pairs wonderfully with Brazilian feijoada, grilled meats, stews, and vegetable dishes. It also complements seafood and spicy dishes well, balancing flavors and textures.",
    },
    {
      question: "Is it possible to make this recipe vegan?",
      answer:
        "Absolutely! Simply omit the optional butter or substitute it with a plant-based margarine or oil. The recipe is naturally vegan-friendly otherwise.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="White Rice"
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
            This Brazilian-style white rice recipe elevates the humble grain by infusing it with the aromatic essence of garlic and subtle hints of bay leaf and black peppercorns. The rice is sautéed gently in vegetable oil with fresh garlic and onion before simmering in water, resulting in fluffy, fragrant grains that perfectly complement a wide variety of dishes.
          </p>
          <p>
            White rice has been a staple food across cultures for thousands of years, prized for its versatility and ability to absorb flavors. In Brazil, rice is often cooked with garlic and onions to add depth and aroma, reflecting the country’s rich culinary heritage influenced by indigenous, Portuguese, and African traditions. This recipe captures that essence, making it a perfect side for traditional Brazilian meals or any cuisine that benefits from a flavorful rice base.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rinse the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the rice in a fine-mesh sieve and rinse under cold running water until the water runs clear. This removes excess starch and prevents the rice from becoming sticky.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil in a medium pot over medium heat. Add the minced garlic and chopped onion, sautéing until fragrant and translucent, about 3-4 minutes. Be careful not to burn the garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the rinsed rice to the pot and stir well to coat each grain with the oil and aromatics. Cook for 2-3 minutes, stirring frequently, until the rice becomes slightly translucent.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Water and Seasonings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the water, add salt, bay leaf, and black peppercorns. Stir once to combine and bring to a boil over high heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer and Cook</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Reduce heat to low, cover the pot with a tight-fitting lid, and simmer for 10 minutes without lifting the lid. After 10 minutes, turn off the heat and let the rice rest, covered, for another 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fluff and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the bay leaf and peppercorns. Stir in the chopped parsley and optional butter for extra richness. Fluff the rice gently with a fork and serve with lime wedges on the side.
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
            Rinsing the rice multiple times until the water runs clear is key to achieving fluffy, separate grains.
          </li>
          <li>
            Toasting the rice in oil before adding water enhances its nutty flavor and improves texture.
          </li>
          <li>
            Avoid lifting the lid during cooking and resting times to trap steam and ensure even cooking.
          </li>
          <li>
            For a more aromatic touch, add a cinnamon stick or cloves along with the bay leaf.
          </li>
          <li>
            Use a heavy-bottomed pot to prevent hot spots and burning.
          </li>
          <li>
            Leftover rice can be transformed into delicious fried rice by stir-frying with vegetables and soy sauce.
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
              href="https://en.wikipedia.org/wiki/Rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Rice Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Rice Culinary and Cultural Significance
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-perfect-white-rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Perfect White Rice
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