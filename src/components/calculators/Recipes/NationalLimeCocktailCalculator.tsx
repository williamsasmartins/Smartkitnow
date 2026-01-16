import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NationalLimeCocktailCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/National%20Lime%20Cocktail%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=71"
  );

  // --- DATA ---
  const title = "National Lime Cocktail";
  const description = "A sophisticated take on the classic Cachaça and lime mix.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cachaça", baseAmount: 120, unit: "ml" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Simple Syrup", baseAmount: 20, unit: "ml" },
    { name: "Crushed Ice", baseAmount: 150, unit: "g" },
    { name: "Fresh Lime Wedges", baseAmount: 2, unit: "pieces" },
    { name: "Mint Leaves", baseAmount: 6, unit: "leaves" },
    { name: "Angostura Bitters", baseAmount: 2, unit: "dashes" },
    { name: "Club Soda", baseAmount: 60, unit: "ml" },
    { name: "Sugar for Rimming Glass", baseAmount: 1, unit: "tbsp" },
    { name: "Lime Zest (for garnish)", baseAmount: 1, unit: "tsp" },
    { name: "Ice Cubes", baseAmount: 4, unit: "pieces" },
    { name: "Cocktail Straw", baseAmount: 1, unit: "piece" },
  ];

  // Approximate nutrition per serving (4 servings base)
  const nutrition = {
    calories: "150",
    protein: "0g",
    carbs: "8g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the National Lime Cocktail?",
      answer:
        "The National Lime Cocktail is a refined and refreshing drink that highlights the vibrant flavors of fresh lime and cachaça, Brazil's iconic sugarcane spirit. It combines tartness, sweetness, and subtle bitterness to create a balanced and sophisticated cocktail experience.",
    },
    {
      question: "Can I substitute cachaça with another spirit?",
      answer:
        "While cachaça is traditional and imparts a unique grassy and fruity flavor, you can substitute it with white rum for a similar profile. However, the authentic taste of the National Lime Cocktail is best achieved with genuine cachaça.",
    },
    {
      question: "How do I make simple syrup at home?",
      answer:
        "Simple syrup is made by dissolving equal parts sugar and water over low heat until the sugar fully dissolves. Let it cool before using. It adds sweetness and smoothness to cocktails without the graininess of undissolved sugar.",
    },
    {
      question: "What is the purpose of rimming the glass with sugar?",
      answer:
        "Rimming the glass with sugar adds a sweet contrast to the tartness of the lime and enhances the overall drinking experience. It also adds a decorative touch that elevates the cocktail's presentation.",
    },
    {
      question: "Can I prepare this cocktail in advance?",
      answer:
        "You can pre-mix the cachaça, lime juice, and simple syrup and store it chilled for up to 24 hours. Add ice, club soda, and bitters just before serving to maintain freshness and carbonation.",
    },
    {
      question: "What glassware is best for serving the National Lime Cocktail?",
      answer:
        "A rocks glass or an old-fashioned glass is ideal for serving this cocktail. It accommodates the crushed ice and garnishes beautifully while allowing the aromas to be enjoyed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="National Lime Cocktail"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            The National Lime Cocktail is a vibrant and refreshing beverage that
            celebrates the bright, zesty flavors of fresh lime paired with the
            distinctive Brazilian spirit, cachaça. This cocktail balances tartness,
            sweetness, and subtle herbal notes, making it a perfect choice for warm
            weather or any occasion that calls for a sophisticated yet approachable
            drink.
          </p>
          <p>
            Originating from Brazil, cachaça is a distilled spirit made from fermented
            sugarcane juice, often compared to rum but with a unique grassy and fruity
            profile. The National Lime Cocktail draws inspiration from the classic
            Caipirinha but elevates it with additional ingredients like bitters and
            club soda to create a more complex and layered flavor experience.
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
              Prepare the Glass
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rub a lime wedge around the rim of a rocks glass, then dip the rim into
              sugar to coat it evenly. Set the glass aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Muddle Lime and Mint
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a cocktail shaker, add fresh lime wedges, mint leaves, and simple
              syrup. Gently muddle to release the lime juice and mint oils without
              tearing the leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Cachaça and Bitters
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the cachaça and add two dashes of Angostura bitters. Fill the
              shaker with crushed ice.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shake and Strain
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Shake vigorously for about 10 seconds until well chilled. Strain the
              mixture into the prepared glass filled with fresh crushed ice.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Top with Club Soda and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Top off the cocktail with club soda for a refreshing fizz. Garnish with
              a lime zest twist and a cocktail straw. Serve immediately.
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
            Use freshly squeezed lime juice for the brightest and most authentic
            flavor; bottled juice lacks the vibrant acidity.
          </li>
          <li>
            When muddling mint, press gently to release essential oils without
            bruising the leaves, which can cause bitterness.
          </li>
          <li>
            Adjust the sweetness by varying the amount of simple syrup to suit your
            taste preferences.
          </li>
          <li>
            For a smoky twist, try using a cachaça aged in wooden barrels instead of
            the unaged variety.
          </li>
          <li>
            Chill your glassware beforehand to keep the cocktail colder for longer.
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
              href="https://en.wikipedia.org/wiki/Cacha%C3%A7a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cachaça
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.liquor.com/recipes/caipirinha/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Liquor.com: Caipirinha Cocktail Guide
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.diffordsguide.com/cocktails/recipe/2022/national-lime-cocktail"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Difford's Guide: National Lime Cocktail Recipe
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