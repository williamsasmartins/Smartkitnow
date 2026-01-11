import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TaquitosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Taquitos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9119"
  );

  // --- DATA ---
  const title = "Taquitos";
  const description = "Tortilhas enroladas e fritas, recheadas (frango/carne) e crocantes.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn tortillas", baseAmount: 12, unit: "units" },
    { name: "Cooked shredded chicken", baseAmount: 500, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "unit" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili powder", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "units" },
    { name: "Sour cream (optional)", baseAmount: 100, unit: "g" },
    { name: "Shredded cheese (optional)", baseAmount: 100, unit: "g" },
    { name: "Salsa (for serving)", baseAmount: 150, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "28g",
    carbs: "30g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of tortillas are best for making taquitos?",
      answer:
        "Corn tortillas are traditionally used for taquitos because they hold up well during frying and provide an authentic flavor. You can warm them slightly before rolling to prevent cracking.",
    },
    {
      question: "Can I bake taquitos instead of frying them?",
      answer:
        "Yes, baking is a healthier alternative. Arrange the rolled taquitos on a baking sheet, lightly brush or spray with oil, and bake at 400°F (200°C) for about 20 minutes or until crispy, turning halfway through.",
    },
    {
      question: "What fillings can I use besides chicken?",
      answer:
        "Taquitos can be filled with a variety of ingredients such as shredded beef, pork, cheese, beans, or even vegetables for a vegetarian option. Season the filling well to enhance flavor.",
    },
    {
      question: "How do I prevent the taquitos from unrolling during frying?",
      answer:
        "Make sure to roll the tortillas tightly around the filling. You can secure them with toothpicks if needed. Also, frying seam-side down first helps seal them and prevents unrolling.",
    },
    {
      question: "What are some popular toppings or dips for taquitos?",
      answer:
        "Common toppings include shredded lettuce, diced tomatoes, sour cream, guacamole, and shredded cheese. Popular dips are salsa, pico de gallo, and creamy avocado sauce.",
    },
    {
      question: "How long can I store leftover taquitos?",
      answer:
        "Leftover taquitos can be refrigerated in an airtight container for up to 3 days. Reheat them in an oven or air fryer to maintain crispiness rather than microwaving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Taquitos"
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
            Taquitos, also known as rolled tacos or flautas, are a beloved Mexican
            street food featuring small corn tortillas tightly rolled around a savory
            filling, typically shredded chicken or beef, and then fried until
            irresistibly crispy. This dish offers a delightful combination of crunchy
            texture and rich, flavorful filling that makes it a favorite appetizer or
            snack worldwide.
          </p>
          <p>
            Originating from Mexican cuisine, taquitos have roots in traditional
            home cooking and street vendors, where they were crafted as a convenient
            and portable meal. Over time, they have gained international popularity,
            inspiring countless variations and adaptations while maintaining their
            authentic charm and satisfying crunch.
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
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet over medium heat, sauté the finely chopped onion and
              minced garlic until translucent and fragrant. Add the shredded chicken,
              ground cumin, chili powder, salt, and black pepper. Stir well and cook
              for 5 minutes to blend the flavors. Remove from heat and mix in chopped
              cilantro.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Warm the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas on a griddle or in the microwave wrapped in a
              damp cloth to make them pliable and prevent cracking when rolling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Roll the Taquitos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place about 2 tablespoons of the chicken filling near the edge of each
              tortilla and roll tightly. Secure with a toothpick if necessary to keep
              them from unrolling during frying.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Taquitos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep skillet or fryer to 180°C (350°F). Fry the
              taquitos seam-side down first for about 2-3 minutes until golden and
              crispy. Turn to fry all sides evenly. Remove and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve hot with lime wedges, salsa, sour cream, and shredded cheese on
              the side. Enjoy your crispy, flavorful taquitos as a delicious snack or
              appetizer.
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
            Warm tortillas wrapped in a damp towel before rolling to prevent cracking.
          </li>
          <li>
            Fry taquitos seam-side down first to seal the roll and avoid unrolling.
          </li>
          <li>
            Use a thermometer to maintain oil temperature for even, crispy frying.
          </li>
          <li>
            For a lighter version, bake taquitos brushed with oil at 400°F (200°C) until crisp.
          </li>
          <li>
            Customize fillings with cheese, beans, or vegetables for variety.
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
              href="https://en.wikipedia.org/wiki/Taquito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Taquito
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/taquitos-recipe-2342823"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Taquitos Recipe
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