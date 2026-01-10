import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AffogatoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Affogato%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6614"
  );

  // --- DATA ---
  const title = "Affogato";
  const description = 'Vanilla gelato "drowned" in a shot of hot espresso. A simple yet indulgent Italian dessert that combines creamy sweetness with rich coffee flavor.';

  // INGREDIENTS
  const ingredients = [
    { name: "Vanilla gelato", baseAmount: 120, unit: "g" },
    { name: "Freshly brewed espresso", baseAmount: 60, unit: "ml" },
    { name: "Dark chocolate shavings (optional)", baseAmount: 5, unit: "g" },
    { name: "Amaretto liqueur (optional)", baseAmount: 15, unit: "ml" },
    { name: "Whipped cream (optional)", baseAmount: 30, unit: "g" },
    { name: "Sugar (optional, for espresso)", baseAmount: 5, unit: "g" },
    { name: "Coffee beans (for garnish)", baseAmount: 2, unit: "pcs" },
    { name: "Mint leaves (for garnish)", baseAmount: 2, unit: "leaves" },
    { name: "Sea salt flakes (optional)", baseAmount: 1, unit: "pinch" },
    { name: "Cocoa powder (optional, dusting)", baseAmount: 1, unit: "g" },
    { name: "Ice cubes (optional, for iced affogato)", baseAmount: 2, unit: "pcs" },
    { name: "Hazelnut syrup (optional)", baseAmount: 10, unit: "ml" },
    { name: "Caramel sauce (optional)", baseAmount: 10, unit: "ml" },
    { name: "Toasted almond flakes (optional)", baseAmount: 5, unit: "g" },
  ];

  // Nutrition per serving approx (1 serving = 1 affogato)
  const nutrition = {
    calories: "250",
    protein: "4g",
    carbs: "28g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is an affogato and where does it originate from?",
      answer:
        "An affogato is a classic Italian dessert that consists of a scoop of vanilla gelato or ice cream \"drowned\" with a shot of hot espresso. Originating from Italy, it combines the rich bitterness of coffee with the creamy sweetness of gelato, creating a delightful contrast of flavors and temperatures. It is traditionally served as a quick dessert or an afternoon treat.",
    },
    {
      question: "Can I use ice cream instead of gelato for affogato?",
      answer:
        "Yes, you can use high-quality vanilla ice cream as a substitute for gelato. While gelato tends to be denser and creamier with less fat, vanilla ice cream will still provide a delicious base for the affogato. For the most authentic experience, try to use a creamy, premium ice cream with a smooth texture.",
    },
    {
      question: "How do I make the perfect espresso for affogato?",
      answer:
        "The espresso should be freshly brewed, hot, and strong to balance the sweetness of the gelato. Use finely ground coffee beans and an espresso machine or stovetop moka pot to extract a rich, concentrated shot. Avoid over-extraction which can make the espresso bitter. Serve immediately over the gelato to enjoy the contrast of hot and cold.",
    },
    {
      question: "Are there variations of affogato I can try?",
      answer:
        "Absolutely! You can customize affogato by adding liqueurs such as amaretto, hazelnut, or coffee-flavored spirits for an adult twist. Toppings like chocolate shavings, caramel sauce, toasted nuts, or whipped cream can enhance texture and flavor. Some also enjoy iced affogato by adding ice cubes or using cold brew coffee instead of espresso.",
    },
    {
      question: "How should affogato be served and eaten?",
      answer:
        "Affogato is best served immediately after pouring the hot espresso over the gelato to enjoy the delightful mix of temperatures and textures. Use a spoon to savor the melting gelato combined with coffee, or sip it like a beverage. It’s a quick dessert, so it’s ideal to consume right away before the gelato fully melts.",
    },
    {
      question: "Can affogato be made vegan or dairy-free?",
      answer:
        "Yes, you can make a vegan or dairy-free affogato by using plant-based gelato or ice cream alternatives such as coconut, almond, or oat milk-based varieties. Ensure the espresso is brewed without dairy additives. This way, you can enjoy the classic flavors while accommodating dietary preferences.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Affogato"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Cook: 5m
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
            The affogato is a quintessential Italian dessert that perfectly balances simplicity and indulgence. Combining creamy vanilla gelato with a freshly brewed shot of hot espresso, it offers a delightful contrast of temperatures and flavors. This dessert is beloved worldwide for its ease of preparation and luxurious taste, making it a favorite choice for coffee lovers and dessert enthusiasts alike.
          </p>
          <p>
            Historically, the affogato emerged in Italy as a quick and satisfying treat, often enjoyed as a mid-afternoon pick-me-up or a light dessert after meals. The name "affogato" means "drowned" in Italian, referring to the gelato being submerged in espresso. Over time, it has evolved with various regional twists and creative additions, yet its core essence remains a celebration of quality ingredients and straightforward preparation.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Espresso</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Brew fresh, hot espresso using an espresso machine or moka pot. Aim for a strong, concentrated shot of about 60 ml per serving. If desired, sweeten the espresso lightly with sugar while hot.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Scoop the Gelato</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place one or two generous scoops of high-quality vanilla gelato into a chilled serving glass or bowl. Using chilled vessels helps slow melting.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Pour Espresso Over Gelato</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Immediately pour the hot espresso shot over the gelato, allowing it to melt slightly and create a creamy coffee sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Optional Toppings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Enhance your affogato with optional toppings such as chocolate shavings, toasted nuts, a drizzle of caramel or hazelnut syrup, or a dollop of whipped cream.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve your affogato immediately to enjoy the perfect balance of hot espresso and cold gelato before it melts completely.
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
            Use freshly ground coffee beans and brew espresso just before serving to maximize aroma and flavor.
          </li>
          <li>
            Chill your serving glasses in the freezer beforehand to slow down gelato melting.
          </li>
          <li>
            Experiment with flavored gelatos like hazelnut or chocolate for creative variations.
          </li>
          <li>
            For an adult version, add a splash of coffee liqueur such as amaretto or Kahlúa.
          </li>
          <li>
            If you prefer a less intense coffee flavor, use a ristretto shot or add a little milk to the espresso.
          </li>
          <li>
            Garnish with a few coffee beans or a sprig of fresh mint for an elegant presentation.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
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
