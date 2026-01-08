import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BakedZitiCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Baked%20Ziti%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2040"
  );

  // --- DATA ---
  const title = "Baked Ziti";
  const description = "Tube pasta baked with tomato sauce, ricotta, and melted mozzarella.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ziti pasta", baseAmount: 500, unit: "g" },
    { name: "Ricotta cheese", baseAmount: 400, unit: "g" },
    { name: "Mozzarella cheese, shredded", baseAmount: 300, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 100, unit: "g" },
    { name: "Tomato sauce", baseAmount: 700, unit: "ml" },
    { name: "Ground beef", baseAmount: 400, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh basil leaves", baseAmount: 10, unit: "leaves" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Red pepper flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Water (for boiling pasta)", baseAmount: 4, unit: "liters" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "620",
    protein: "38g",
    carbs: "58g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I make baked ziti vegetarian?",
      answer:
        "Absolutely! To make a vegetarian baked ziti, simply omit the ground beef and substitute it with sautéed vegetables like mushrooms, zucchini, or bell peppers. You can also add plant-based meat alternatives for extra protein. The tomato sauce and cheeses will still provide rich flavor and texture.",
    },
    {
      question: "What type of pasta can I use if I don't have ziti?",
      answer:
        "If ziti is unavailable, you can use other tubular pasta shapes such as penne, rigatoni, or even macaroni. The key is to use pasta that holds sauce well and bakes nicely. Just ensure you cook the pasta al dente before assembling the dish to avoid overcooking during baking.",
    },
    {
      question: "How do I store and reheat leftover baked ziti?",
      answer:
        "Store leftover baked ziti in an airtight container in the refrigerator for up to 3-4 days. To reheat, cover it with foil and bake at 350°F (175°C) for about 20 minutes until heated through. Alternatively, microwave individual portions covered with a microwave-safe lid until warm.",
    },
    {
      question: "Can I prepare baked ziti ahead of time?",
      answer:
        "Yes, baked ziti can be assembled a day in advance and stored in the refrigerator, covered tightly with plastic wrap or foil. When ready to serve, bake it as directed, adding a few extra minutes if baking from cold. This makes it a great dish for entertaining or meal prep.",
    },
    {
      question: "What cheese combinations work best in baked ziti?",
      answer:
        "A classic baked ziti uses ricotta for creaminess, mozzarella for meltiness, and Parmesan for a sharp, nutty flavor. You can also experiment with provolone, fontina, or pecorino romano for different flavor profiles. Using a blend of cheeses ensures a rich and satisfying dish.",
    },
    {
      question: "How can I make the sauce richer and more flavorful?",
      answer:
        "To enrich the tomato sauce, start by sautéing onions and garlic in olive oil until fragrant. Adding a splash of red wine or a pinch of sugar can balance acidity. Simmer the sauce slowly to develop depth, and finish with fresh herbs like basil or oregano. For a meat sauce, browning the ground beef well adds savory richness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Baked Ziti"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Baked Ziti is a beloved Italian-American casserole that combines tender tube-shaped pasta with a rich tomato sauce, creamy ricotta cheese, and gooey melted mozzarella. This hearty dish is perfect for family dinners and gatherings, offering comforting flavors and a satisfying texture. The layers of pasta, cheese, and sauce meld beautifully when baked, creating a golden, bubbly top that is irresistible.
          </p>
          <p>
            Originating from Italian immigrant communities in the United States, baked ziti is a variation of traditional pasta al forno dishes found throughout Italy. The recipe showcases the Italian-American love for baked pasta casseroles, which became popular in the mid-20th century as a convenient and delicious way to feed large groups. Today, baked ziti remains a staple in Italian-American cuisine and is enjoyed worldwide for its simplicity and rich flavors.
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
              Prepare the Pasta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the ziti pasta and cook until al dente, about 8-10 minutes. Drain the pasta and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Meat Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat olive oil over medium heat. Sauté the chopped onion until translucent, about 5 minutes. Add minced garlic and cook for 1 minute. Add ground beef, season with salt, pepper, and red pepper flakes, and cook until browned. Stir in tomato sauce and fresh basil leaves. Simmer for 15 minutes to develop flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Dish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 375°F (190°C). In a large mixing bowl, combine the cooked pasta with half of the meat sauce and half of the ricotta cheese. Mix gently to combine. Spread half of this mixture into a greased baking dish. Layer half of the shredded mozzarella on top. Repeat with the remaining pasta mixture and mozzarella. Sprinkle grated Parmesan cheese evenly over the top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake to Perfection
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the baking dish with foil and bake for 25 minutes. Remove the foil and bake for an additional 15 minutes or until the cheese is bubbly and golden brown. Let the baked ziti rest for 5-10 minutes before serving.
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
              Garnish with extra fresh basil or parsley if desired. Serve warm with a side salad or garlic bread for a complete meal.
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
            Use freshly grated Parmesan cheese for the best flavor and melt quality.
          </li>
          <li>
            For a creamier texture, mix a beaten egg into the ricotta cheese before assembling.
          </li>
          <li>
            Let the baked ziti rest after baking to allow the sauce to thicken and the flavors to meld.
          </li>
          <li>
            If you prefer a spicier dish, add more red pepper flakes or a dash of hot sauce to the meat sauce.
          </li>
          <li>
            To save time, prepare the meat sauce a day ahead; flavors deepen after resting overnight.
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