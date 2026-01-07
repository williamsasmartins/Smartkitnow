import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AntipastoPlatterCuredMeatsCheeseOlivesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Antipasto%20Platter%20Cured%20Meats%20Cheese%20Olives%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1759"
  );

  // --- DATA ---
  const title = "Antipasto Platter (Cured Meats, Cheese, Olives)";
  const description = "Assortment of cured meats, cheeses, olives, and marinated vegetables.";

  // INGREDIENTS
  const ingredients = [
    { name: "Prosciutto (thinly sliced)", baseAmount: 150, unit: "g" },
    { name: "Salami (sliced)", baseAmount: 150, unit: "g" },
    { name: "Coppa (cured pork shoulder)", baseAmount: 100, unit: "g" },
    { name: "Mozzarella balls (Bocconcini)", baseAmount: 120, unit: "g" },
    { name: "Aged Provolone cheese (cubed)", baseAmount: 100, unit: "g" },
    { name: "Parmesan cheese (shaved)", baseAmount: 80, unit: "g" },
    { name: "Mixed olives (Kalamata, Castelvetrano)", baseAmount: 150, unit: "g" },
    { name: "Marinated artichoke hearts", baseAmount: 100, unit: "g" },
    { name: "Roasted red peppers (sliced)", baseAmount: 80, unit: "g" },
    { name: "Pepperoncini peppers", baseAmount: 50, unit: "g" },
    { name: "Sun-dried tomatoes", baseAmount: 60, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 10, unit: "g" },
    { name: "Extra virgin olive oil (for drizzling)", baseAmount: 20, unit: "ml" },
    { name: "Freshly cracked black pepper", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "850",
    protein: "45g",
    carbs: "12g",
    fat: "65g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of cured meats are best for an antipasto platter?",
      answer:
        "Traditional Italian antipasto platters often feature a variety of cured meats such as prosciutto, salami, and coppa. These meats offer a balance of flavors and textures—prosciutto is delicate and salty, salami is spiced and firm, and coppa provides a rich, fatty profile. Selecting high-quality, thinly sliced meats enhances the overall experience.",
    },
    {
      question: "How should I store leftovers from the antipasto platter?",
      answer:
        "Leftover cured meats and cheeses should be tightly wrapped in parchment paper or stored in airtight containers and refrigerated. Olives and marinated vegetables can be kept in their brine or marinade in sealed containers. Consume leftovers within 2-3 days for optimal freshness and safety.",
    },
    {
      question: "Can I customize the antipasto platter for dietary restrictions?",
      answer:
        "Absolutely! For gluten-free options, ensure all ingredients are free from gluten-containing additives. For vegetarian versions, omit cured meats and add more cheeses, marinated vegetables, nuts, and fresh fruits. Vegan alternatives can include plant-based cheeses and marinated tofu or mushrooms.",
    },
    {
      question: "What wines pair well with an antipasto platter?",
      answer:
        "Light to medium-bodied red wines such as Chianti, Barbera, or Pinot Noir complement the salty, savory flavors of cured meats and cheeses. For white wine lovers, a crisp Sauvignon Blanc or a dry Prosecco can balance the richness and cleanse the palate.",
    },
    {
      question: "How far in advance can I prepare the antipasto platter?",
      answer:
        "You can prepare most components a day ahead, such as slicing meats and cheeses and marinating vegetables. Assemble the platter just before serving to maintain freshness and optimal presentation. Keep all ingredients refrigerated until serving time.",
    },
    {
      question: "What are some tips for plating an antipasto platter attractively?",
      answer:
        "Use a large wooden board or platter and arrange ingredients in groups or small piles to create visual interest. Vary colors, shapes, and textures—fold or roll meats, cube cheeses, and scatter olives and herbs. Add fresh basil or rosemary sprigs for a fragrant and colorful touch.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Antipasto Platter (Cured Meats, Cheese, Olives)"
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
            The Antipasto Platter is a classic Italian appetizer designed to awaken
            the palate with a vibrant assortment of cured meats, artisanal cheeses,
            briny olives, and marinated vegetables. This recipe celebrates the rich
            culinary heritage of Italy, combining bold flavors and diverse textures
            that complement each other beautifully.
          </p>
          <p>
            Perfect for entertaining or as a starter to a multi-course meal, this
            platter is highly customizable and easy to assemble. Whether you prefer
            a traditional selection or want to experiment with regional specialties,
            the antipasto platter offers endless possibilities to delight your guests.
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
              Prepare Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice cured meats thinly if not pre-sliced. Cube or shave cheeses as
              needed. Drain olives and marinated vegetables, reserving any marinade
              for drizzling if desired. Rinse fresh basil leaves and pat dry.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Arrange the Platter
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              On a large wooden board or serving platter, arrange the cured meats in
              small piles or folded shapes. Place cheeses in clusters, alternating
              textures and colors. Add olives and marinated vegetables in small bowls
              or scattered groups.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Scatter fresh basil leaves over the platter for color and aroma. Drizzle
              extra virgin olive oil lightly over cheeses and vegetables. Finish with
              a sprinkle of freshly cracked black pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the antipasto platter at room temperature alongside crusty bread
              or crackers. Encourage guests to mix and match flavors for a delightful
              tasting experience.
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
            Choose a variety of textures and flavors in your cured meats and cheeses
            to keep the platter interesting and balanced.
          </li>
          <li>
            Let cheeses and meats come to room temperature before serving to enhance
            their flavors and aromas.
          </li>
          <li>
            Use fresh herbs like basil or rosemary as garnish to add a pop of color
            and a fresh scent.
          </li>
          <li>
            Include a small bowl of honey or fig jam for a sweet contrast to the
            salty and savory items.
          </li>
          <li>
            For a more rustic look, fold or roll the meats instead of laying them
            flat.
          </li>
          <li>
            If you want to add nuts, toasted almonds or walnuts pair wonderfully with
            cheeses and meats.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
              rel="noopener noreferrer"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
              rel="noopener noreferrer"
            >
              Britannica: Culinary Reference
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