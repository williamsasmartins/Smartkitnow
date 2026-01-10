import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PanettoneCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Panettone%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1612"
  );

  // --- DATA ---
  const title = "Panettone";
  const description = "Tall domed sweet bread studded with candied fruit and raisins.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Active dry yeast", baseAmount: 10, unit: "g" },
    { name: "Granulated sugar", baseAmount: 150, unit: "g" },
    { name: "Unsalted butter", baseAmount: 150, unit: "g" },
    { name: "Whole milk", baseAmount: 180, unit: "ml" },
    { name: "Egg yolks", baseAmount: 6, unit: "pcs" },
    { name: "Salt", baseAmount: 8, unit: "g" },
    { name: "Vanilla extract", baseAmount: 10, unit: "ml" },
    { name: "Candied orange peel", baseAmount: 100, unit: "g" },
    { name: "Raisins", baseAmount: 100, unit: "g" },
    { name: "Lemon zest", baseAmount: 5, unit: "g" },
    { name: "Orange zest", baseAmount: 5, unit: "g" },
  ];

  // Approximate nutrition per serving (4 servings base)
  const nutrition = {
    calories: "480",
    protein: "9g",
    carbs: "70g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Panettone different from other sweet breads?",
      answer:
        "Panettone is distinguished by its tall, domed shape and its unique airy, fluffy texture achieved through a long fermentation process. It is traditionally studded with candied fruits and raisins, giving it a distinctive sweet and citrusy flavor profile.",
    },
    {
      question: "Can I make Panettone without a stand mixer?",
      answer:
        "Yes, you can make Panettone by hand, but it requires significant kneading effort and time to develop the gluten structure properly. Using a stand mixer with a dough hook simplifies the process and ensures consistent results.",
    },
    {
      question: "How long should I proof the Panettone dough?",
      answer:
        "Panettone dough typically requires a long, slow fermentation. The first proof can take 2 to 3 hours at room temperature until doubled in size, followed by a second proof after shaping that can last 4 to 6 hours or overnight in the refrigerator for enhanced flavor and texture.",
    },
    {
      question: "What is the best way to store Panettone?",
      answer:
        "Store Panettone wrapped tightly in plastic wrap or in an airtight container at room temperature. It stays fresh for up to a week. For longer storage, you can freeze it wrapped well and thaw at room temperature before serving.",
    },
    {
      question: "Can I substitute candied fruits with other ingredients?",
      answer:
        "Absolutely! While traditional Panettone uses candied orange peel and raisins, you can substitute with dried cranberries, chopped dried apricots, chocolate chips, or nuts to customize the flavor to your liking.",
    },
    {
      question: "Is Panettone suitable for beginners?",
      answer:
        "Panettone is considered an advanced baking project due to its complex dough and long fermentation times. However, with patience and attention to detail, beginners can successfully make it by following a detailed recipe and instructions carefully.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Panettone"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 60m | Cook: 50m
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
            Panettone is a traditional Italian sweet bread known for its tall, domed shape and light,
            fluffy crumb. This festive bread is studded with candied orange peel, raisins, and lemon
            zest, offering a delightful balance of sweetness and citrus aroma. Perfect for holiday
            celebrations, Panettone is a labor of love that requires patience and careful fermentation
            to develop its signature texture and flavor.
          </p>
          <p>
            Originating from Milan, Panettone dates back to the Middle Ages and has become a beloved
            symbol of Italian Christmas traditions. Its preparation involves a rich dough enriched
            with butter, eggs, and sugar, which is slowly fermented to create a tender crumb. Over
            centuries, Panettone has evolved from a regional specialty to an internationally cherished
            delicacy, often enjoyed toasted with butter or paired with sweet wines.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Starter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dissolve the active dry yeast in warm milk (about 35°C/95°F) with a teaspoon of sugar.
              Let it activate for 10 minutes until frothy. Mix 100g of flour with the yeast mixture to
              form a loose dough. Cover and let it ferment for 1-2 hours until doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl or stand mixer, combine the remaining flour, sugar, salt, egg yolks,
              vanilla extract, lemon and orange zest. Add the starter and mix until combined. Gradually
              add softened butter and knead for 15-20 minutes until the dough is smooth, elastic, and
              slightly sticky.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">First Proof</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the dough to a lightly oiled bowl, cover with plastic wrap or a damp towel,
              and let it rise in a warm place for 2-3 hours or until doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Fruits and Shape</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently knead the dough to deflate it and fold in the candied orange peel and raisins
              evenly. Shape the dough into a ball and place it into a buttered Panettone mold or a
              tall round baking pan lined with parchment paper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Second Proof</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the mold loosely and let the dough rise again for 4-6 hours at room temperature,
              or refrigerate overnight for a slower proof that enhances flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). Brush the top of the dough with melted butter.
              Bake for 45-50 minutes until golden brown and a skewer inserted comes out clean. If the
              top browns too quickly, cover loosely with foil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cool and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the Panettone cool completely on a wire rack before slicing. For best texture,
              store wrapped and consume within a week. Enjoy plain, toasted, or with butter and
              jam.
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
            Use high-quality butter and fresh candied fruits for the best flavor and texture.
          </li>
          <li>
            Maintain a warm, draft-free environment for proofing to ensure optimal yeast activity.
          </li>
          <li>
            Do not rush the fermentation process; slow proofing develops deeper flavor and a lighter crumb.
          </li>
          <li>
            If you don’t have a Panettone mold, use a tall, straight-sided cake pan lined with parchment paper.
          </li>
          <li>
            For an extra moist crumb, brush the baked Panettone with melted butter immediately after baking.
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