import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FriedRiceBallsAranciniCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Fried%20Rice%20Balls%20Arancini%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4612"
  );

  // --- DATA ---
  const title = "Fried Rice Balls (Arancini)";
  const description = "Deep-fried risotto balls filled with cheese, meat, or peas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Arborio Rice", baseAmount: 300, unit: "g" },
    { name: "Chicken or Vegetable Stock", baseAmount: 900, unit: "ml" },
    { name: "Butter", baseAmount: 30, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Parmesan Cheese, grated", baseAmount: 80, unit: "g" },
    { name: "Mozzarella Cheese, diced", baseAmount: 150, unit: "g" },
    { name: "Cooked Ground Beef or Sausage", baseAmount: 150, unit: "g" },
    { name: "Frozen Peas", baseAmount: 80, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "large" },
    { name: "All-purpose Flour", baseAmount: 100, unit: "g" },
    { name: "Breadcrumbs", baseAmount: 150, unit: "g" },
    { name: "Vegetable Oil for Frying", baseAmount: 1000, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "18g",
    carbs: "45g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for making Arancini?",
      answer:
        "Arborio rice is the best choice for Arancini because its high starch content creates a creamy risotto that binds well when forming the balls. Other short-grain rice varieties can be used, but Arborio yields the best texture.",
    },
    {
      question: "Can I prepare Arancini in advance and freeze them?",
      answer:
        "Yes, Arancini freeze very well. After shaping and breading the rice balls, place them on a baking sheet to freeze individually. Once frozen, transfer to a freezer bag. Fry them directly from frozen, adding a couple of extra minutes to the cooking time.",
    },
    {
      question: "What fillings can I use inside Arancini?",
      answer:
        "Traditional fillings include mozzarella cheese, ragù (meat sauce), peas, or a combination. You can also experiment with mushrooms, ham, spinach, or even vegan cheese alternatives depending on your preference.",
    },
    {
      question: "How do I ensure the Arancini are crispy and not greasy?",
      answer:
        "Use fresh vegetable oil heated to around 175°C (350°F) for frying. Fry in small batches to avoid lowering the oil temperature. Drain the fried balls on paper towels to remove excess oil. Proper breading with flour, egg wash, and breadcrumbs also helps achieve a crispy crust.",
    },
    {
      question: "Can I bake Arancini instead of frying them?",
      answer:
        "Yes, baking is a healthier alternative. Preheat your oven to 200°C (400°F), place the breaded Arancini on a baking sheet lined with parchment paper, and bake for 20-25 minutes or until golden and crispy, turning halfway through. The texture will be slightly different but still delicious.",
    },
    {
      question: "How do I make the risotto sticky enough to form balls?",
      answer:
        "Cook the risotto until it is creamy and slightly sticky, then let it cool completely, preferably overnight in the refrigerator. Chilling helps the rice firm up, making it easier to shape into balls without falling apart.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Fried Rice Balls (Arancini)"
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
            Arancini are a classic Italian street food originating from Sicily,
            consisting of deep-fried rice balls stuffed with a variety of savory
            fillings. Traditionally made with risotto rice, these golden spheres
            offer a delightful contrast between a crispy exterior and a creamy,
            flavorful interior. They are perfect as appetizers, snacks, or even a
            main course.
          </p>
          <p>
            This recipe guides you through making authentic Arancini with a rich
            filling of mozzarella, ground meat, and peas. The risotto base is
            cooked to creamy perfection, cooled to firm up, then shaped, breaded,
            and fried to a beautiful golden crisp. Adjust the fillings and
            seasonings to your taste for a personalized touch on this beloved
            Italian delicacy.
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
              Prepare the Risotto
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pan, melt butter over medium heat. Add the finely chopped
              onion and sauté until translucent. Add the Arborio rice and toast
              for 2 minutes. Gradually add warm stock, stirring frequently, until
              the rice is creamy and cooked al dente (about 18 minutes). Season
              with salt and pepper. Stir in grated Parmesan cheese. Spread the
              risotto on a tray and let it cool completely, preferably overnight in
              the fridge.
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
              In a skillet, cook the ground beef or sausage until browned. Add
              frozen peas and cook for another 2 minutes. Season with salt and
              pepper. Set aside to cool. Dice the mozzarella cheese into small
              cubes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Arancini
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              With damp hands, take a handful of cooled risotto and flatten it into
              your palm. Place a spoonful of the meat and pea mixture and a cube of
              mozzarella in the center. Carefully mold the rice around the filling,
              forming a ball about the size of a tennis ball. Repeat with the
              remaining ingredients.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bread the Balls
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Prepare three shallow bowls: one with flour, one with beaten eggs,
              and one with breadcrumbs. Roll each rice ball first in flour,
              shaking off excess, then dip into the egg wash, and finally coat
              thoroughly with breadcrumbs. Place on a tray ready for frying.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Arancini
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep fryer or heavy-bottomed pot to 175°C
              (350°F). Fry the rice balls in batches for 3-4 minutes or until
              golden brown and crispy. Remove with a slotted spoon and drain on
              paper towels. Serve hot.
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
            Use day-old risotto or refrigerate freshly made risotto overnight to
            ensure it is firm enough to shape without falling apart.
          </li>
          <li>
            For extra flavor, mix finely chopped fresh herbs like parsley or basil
            into the risotto or filling.
          </li>
          <li>
            Maintain the oil temperature consistently to avoid greasy Arancini.
            Use a thermometer for accuracy.
          </li>
          <li>
            Experiment with fillings such as béchamel sauce, mushrooms, or
            prosciutto for unique variations.
          </li>
          <li>
            If you prefer baking, brush the breaded balls lightly with olive oil
            before baking to enhance crispiness.
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