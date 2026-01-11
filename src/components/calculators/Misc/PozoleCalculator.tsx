import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PozoleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pozole%20Pork%20or%20Chicken%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8509"
  );

  // --- DATA ---
  const title = "Pozole (Pork or Chicken)";
  const description = "Ensopado com hominy (milho) e carne, servido com guarnições frescas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork shoulder or chicken thighs (boneless, skinless)", baseAmount: 500, unit: "g" },
    { name: "Hominy (dried corn kernels, soaked or canned)", baseAmount: 250, unit: "g" },
    { name: "White onion (quartered)", baseAmount: 1, unit: "unit" },
    { name: "Garlic cloves", baseAmount: 4, unit: "units" },
    { name: "Dried ancho chiles (optional, for red pozole)", baseAmount: 3, unit: "units" },
    { name: "Dried guajillo chiles (optional, for red pozole)", baseAmount: 3, unit: "units" },
    { name: "Bay leaves", baseAmount: 2, unit: "units" },
    { name: "Oregano (preferably Mexican oregano)", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Water or chicken broth", baseAmount: 1500, unit: "ml" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "units" },
    { name: "Shredded cabbage or lettuce (for garnish)", baseAmount: 100, unit: "g" },
    { name: "Radishes (thinly sliced, for garnish)", baseAmount: 6, unit: "units" },
    { name: "Chopped fresh cilantro (for garnish)", baseAmount: 15, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = { calories: "450", protein: "35g", carbs: "40g", fat: "12g" };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is pozole and where does it come from?",
      answer:
        "Pozole is a traditional Mexican stew made with hominy (processed corn kernels) and meat, typically pork or chicken. It has deep roots in pre-Hispanic Mesoamerican culture, where it was originally prepared for special ceremonies. Today, it is a beloved comfort food enjoyed across Mexico, especially during celebrations and holidays.",
    },
    {
      question: "Can I make pozole vegetarian or vegan?",
      answer:
        "Yes! To make a vegetarian or vegan pozole, substitute the meat with hearty vegetables like mushrooms, jackfruit, or tofu, and use vegetable broth instead of meat-based stock. You can also add beans for extra protein. The hominy and traditional garnishes remain the same.",
    },
    {
      question: "What is hominy and where can I buy it?",
      answer:
        "Hominy is dried maize kernels treated with an alkali solution (nixtamalization) that makes them puff up and soft. It is a key ingredient in pozole. You can find canned or dried hominy in Latin American grocery stores, some supermarkets, or online. If using dried, soak and cook it thoroughly before adding to the stew.",
    },
    {
      question: "How do I make red pozole with chiles?",
      answer:
        "To make red pozole, rehydrate dried ancho and guajillo chiles by soaking them in hot water until soft. Then blend them with garlic and some broth to create a rich chile sauce. Add this sauce to the stew during cooking to infuse it with a smoky, mildly spicy flavor and vibrant red color.",
    },
    {
      question: "What are the traditional garnishes for pozole?",
      answer:
        "Traditional garnishes include shredded cabbage or lettuce, thinly sliced radishes, chopped onions, fresh cilantro, lime wedges, and dried oregano. Some also enjoy avocado slices, tostadas, or chili powder on the side. These fresh toppings add texture and brightness to the hearty stew.",
    },
    {
      question: "How long does pozole keep and can I freeze leftovers?",
      answer:
        "Pozole keeps well refrigerated for up to 3-4 days in an airtight container. It also freezes nicely for up to 3 months. When reheating, add a little water or broth if it has thickened. Garnishes should be added fresh when serving for the best texture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pozole (Pork or Chicken)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 2h
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Pozole is a hearty Mexican stew that brings together tender pork or chicken with hominy,
            a unique type of processed corn. This dish is celebrated for its rich flavors and
            comforting warmth, often enjoyed during festive occasions and family gatherings. The
            combination of slow-cooked meat, fragrant spices, and fresh garnishes creates a
            symphony of textures and tastes that is both satisfying and deeply rooted in Mexican
            culinary tradition.
          </p>
          <p>
            Originating from pre-Hispanic times, pozole was initially prepared as a ceremonial dish
            by indigenous peoples of Mexico. The nixtamalization process used to create hominy was
            a significant culinary advancement that enhanced the nutritional value of corn. Over
            centuries, pozole evolved into regional variations, including red, white, and green
            versions, each with distinct ingredients and flavors. Today, it remains a beloved
            staple, symbolizing Mexican heritage and hospitality.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the hominy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using dried hominy, soak it overnight and then cook it in fresh water until tender,
              about 1.5 to 2 hours. If using canned hominy, rinse and drain it well. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the meat and broth</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, add the pork shoulder or chicken thighs, quartered onion, garlic cloves,
              bay leaves, salt, and pepper. Cover with water or chicken broth and bring to a boil.
              Reduce heat and simmer gently for about 1.5 hours until the meat is tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the chile sauce (optional)</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For red pozole, remove stems and seeds from dried ancho and guajillo chiles. Soak them
              in hot water for 20 minutes until softened. Blend the chiles with some soaking water,
              garlic, and a pinch of salt until smooth. Strain if desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the cooked meat from the broth and shred it into bite-sized pieces. Add the
              hominy and chile sauce (if using) to the broth and simmer for 30 minutes to meld flavors.
              Return the shredded meat to the pot and heat through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve with garnishes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Ladle pozole into bowls and offer garnishes such as shredded cabbage, sliced radishes,
              chopped onion, fresh cilantro, and lime wedges. Enjoy with warm tortillas or tostadas.
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
            For a richer broth, brown the pork shoulder pieces before simmering to develop deeper
            flavor.
          </li>
          <li>
            Use Mexican oregano rather than Mediterranean oregano for an authentic herbal note.
          </li>
          <li>
            If you prefer a spicier pozole, add chopped jalapeños or serrano peppers to the garnishes.
          </li>
          <li>
            Leftover pozole tastes even better the next day as the flavors continue to meld.
          </li>
          <li>
            When shredding chicken, save the bones to make a flavorful broth for another use.
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
              href="https://en.wikipedia.org/wiki/Pozole"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pozole
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-mexican-pozole-recipe-2342807"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Pozole Recipe
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