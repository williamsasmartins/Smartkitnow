import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GorditasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Gorditas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9179"
  );

  // --- DATA ---
  const title = "Gorditas";
  const description = "Bolso de massa de milho recheado, frito ou grelhado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Masa harina (corn flour)", baseAmount: 250, unit: "g" },
    { name: "Warm water", baseAmount: 180, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Baking powder", baseAmount: 3, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 200, unit: "ml" },
    { name: "Refried beans", baseAmount: 200, unit: "g" },
    { name: "Queso fresco (crumbled cheese)", baseAmount: 150, unit: "g" },
    { name: "Sour cream (crema)", baseAmount: 100, unit: "g" },
    { name: "Salsa roja", baseAmount: 120, unit: "ml" },
    { name: "Chopped onion", baseAmount: 80, unit: "g" },
    { name: "Chopped cilantro", baseAmount: 15, unit: "g" },
    { name: "Lime wedges", baseAmount: 2, unit: "pcs" },
    { name: "Cooked shredded chicken (optional)", baseAmount: 200, unit: "g" },
    { name: "Salt and pepper to taste", baseAmount: 0, unit: "" },
  ];

  const nutrition = {
    calories: "450",
    protein: "18g",
    carbs: "55g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    base === 0 ? "" : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are Gorditas and where do they originate from?",
      answer:
        "Gorditas are traditional Mexican stuffed corn dough pockets, typically made from masa harina. Originating from central Mexico, they are a popular street food and home-cooked dish, known for their versatility and rich fillings.",
    },
    {
      question: "Can Gorditas be baked instead of fried?",
      answer:
        "Yes, Gorditas can be baked for a healthier alternative. While frying gives them a crispy exterior, baking at 375°F (190°C) for about 15-20 minutes until golden can yield a deliciously soft yet slightly crisp texture.",
    },
    {
      question: "What fillings can I use for Gorditas?",
      answer:
        "Traditional fillings include refried beans, cheese, shredded meats like chicken or pork, and various salsas. You can also use vegetables, chorizo, or even sweet fillings depending on your preference.",
    },
    {
      question: "How do I prevent Gorditas from cracking when shaping?",
      answer:
        "Ensure the masa dough is well hydrated but not too sticky. Letting the dough rest for 10-15 minutes helps. Also, handle the dough gently and avoid overworking it to prevent cracks.",
    },
    {
      question: "Can I prepare Gorditas dough in advance?",
      answer:
        "Yes, you can prepare the masa dough a few hours ahead and keep it covered with a damp cloth to prevent drying. For longer storage, refrigerate the dough wrapped tightly and bring it back to room temperature before shaping.",
    },
    {
      question: "What is the best way to serve Gorditas?",
      answer:
        "Serve Gorditas warm, stuffed with your favorite fillings, topped with fresh salsa, chopped onions, cilantro, and a squeeze of lime. They pair wonderfully with Mexican crema and queso fresco for authentic flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Gorditas"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Gorditas are a beloved Mexican dish consisting of thick corn dough pockets stuffed with a variety of savory fillings. The name "gordita" means "little fat one" in Spanish, referring to their plump, stuffed shape. They are traditionally made using masa harina, a special corn flour, which is mixed with water and a pinch of salt to create a pliable dough. Gorditas can be fried or grilled, resulting in a crispy exterior and soft, warm interior that perfectly complements the fillings.
          </p>
          <p>
            Originating from central Mexico, Gorditas have a rich history as a staple street food and home-cooked meal. They showcase the versatility of corn in Mexican cuisine and reflect regional variations in fillings and preparation methods. Today, Gorditas are enjoyed worldwide, celebrated for their comforting texture and bold flavors.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the masa harina, salt, and baking powder. Gradually add warm water while mixing until a soft, pliable dough forms. Cover with a damp cloth and let rest for 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Gorditas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions and roll each into a ball. Flatten each ball into a thick disc about 1/4 inch thick using your hands or a tortilla press lined with plastic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Gorditas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a skillet over medium heat. Fry each gordita until golden brown and puffed, about 3-4 minutes per side. Remove and drain on paper towels. Alternatively, grill them on a hot griddle for a lighter version.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fill the Gorditas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a sharp knife, carefully slice open one side of each gordita to create a pocket. Stuff with warm refried beans, shredded chicken (if using), queso fresco, chopped onions, cilantro, and a drizzle of sour cream and salsa roja.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the gorditas warm with lime wedges on the side for squeezing. Enjoy as a hearty snack or a satisfying meal.
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
            Use warm water when mixing the masa dough to help it hydrate properly and become more pliable.
          </li>
          <li>
            Resting the dough covered prevents it from drying out and makes shaping easier.
          </li>
          <li>
            Fry gorditas in batches to avoid overcrowding the pan, ensuring even cooking and crispiness.
          </li>
          <li>
            For a smoky flavor, try grilling gorditas instead of frying.
          </li>
          <li>
            Customize fillings with seasonal vegetables or your favorite meats for variety.
          </li>
          <li>
            Serve immediately after stuffing to enjoy the contrast of crispy exterior and warm filling.
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
              href="https://en.wikipedia.org/wiki/Gordita"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Gordita
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-gorditas-recipe-2342806"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Gorditas Recipe
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