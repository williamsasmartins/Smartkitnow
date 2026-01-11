import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MargaritaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Margarita%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6173"
  );

  // --- DATA ---
  const title = "Margarita";
  const description = "Coquetel com tequila, limão e licor, servido com sal na borda.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tequila Blanco", baseAmount: 120, unit: "ml" },
    { name: "Triple Sec (Cointreau)", baseAmount: 60, unit: "ml" },
    { name: "Suco de Limão Fresco", baseAmount: 30, unit: "ml" },
    { name: "Xarope Simples (opcional)", baseAmount: 10, unit: "ml" },
    { name: "Sal para a borda do copo", baseAmount: 1, unit: "g" },
    { name: "Gelo", baseAmount: 100, unit: "g" },
    { name: "Rodela de Limão para decorar", baseAmount: 1, unit: "un" },
    { name: "Coqueteleira", baseAmount: 1, unit: "un" },
    { name: "Copo de Margarita (ou copo de cocktail)", baseAmount: 1, unit: "un" },
    { name: "Açúcar para borda (opcional)", baseAmount: 1, unit: "g" },
    { name: "Sal grosso (para borda, opcional)", baseAmount: 1, unit: "g" },
    { name: "Cubos de gelo para servir", baseAmount: 50, unit: "g" },
  ];

  // Nutrition facts (approximate for 1 serving)
  const nutrition = {
    calories: "168",
    protein: "0.1g",
    carbs: "7g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Qual é a origem do coquetel Margarita?",
      answer:
        "A Margarita é um coquetel clássico mexicano, criado possivelmente na década de 1930 ou 1940. Existem várias histórias sobre sua origem, mas a mais aceita é que foi inventada para agradar ao paladar americano, combinando tequila com limão e licor de laranja para suavizar o sabor forte da tequila.",
    },
    {
      question: "Posso usar outro tipo de tequila para preparar a Margarita?",
      answer:
        "Sim, embora a tequila blanco seja a mais tradicional para Margaritas devido ao seu sabor puro e fresco, você pode experimentar tequilas reposado ou añejo para uma variação mais suave e complexa. No entanto, isso altera o perfil clássico da bebida.",
    },
    {
      question: "Qual é a função do sal na borda do copo?",
      answer:
        "O sal na borda do copo realça os sabores do coquetel, criando um contraste com a acidez do limão e o dulçor do licor. Além disso, ajuda a equilibrar o sabor forte da tequila, proporcionando uma experiência gustativa mais harmoniosa.",
    },
    {
      question: "Como posso ajustar a doçura da Margarita?",
      answer:
        "Você pode adicionar xarope simples (açúcar dissolvido em água) para suavizar a acidez do limão e o sabor forte da tequila. Ajuste a quantidade conforme seu gosto pessoal, começando com pequenas quantidades para não adoçar demais.",
    },
    {
      question: "Qual é a melhor forma de servir uma Margarita?",
      answer:
        "A Margarita deve ser servida gelada, geralmente em um copo de Margarita ou copo de cocktail com a borda salgada. Use gelo na coqueteleira para resfriar bem a bebida e sirva com uma rodela de limão para decorar.",
    },
    {
      question: "Posso preparar Margaritas para um grupo maior?",
      answer:
        "Sim! Basta ajustar as quantidades dos ingredientes proporcionalmente ao número de porções desejadas. Nossa calculadora facilita esse ajuste para que você possa preparar a quantidade ideal para sua festa ou reunião.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Margarita"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Cook: 0m
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
            A Margarita is a refreshing and iconic cocktail that perfectly balances the boldness of tequila with the tartness of fresh lime juice and the sweetness of orange liqueur. Served chilled with a salted rim, it is a favorite for many cocktail enthusiasts worldwide.
          </p>
          <p>
            Originating from Mexico, the Margarita has become a symbol of vibrant culture and festive gatherings. Its simple yet elegant combination of ingredients has inspired countless variations, but the classic recipe remains a timeless favorite.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Glass</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rub a lime wedge around the rim of your Margarita glass. Dip the rim into a plate of salt to coat it evenly. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a cocktail shaker, combine tequila, triple sec, fresh lime juice, and simple syrup (if using). Fill the shaker with ice.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shake Well</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Shake vigorously for about 15 seconds until the mixture is well chilled.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Strain the cocktail into the prepared glass over fresh ice cubes. Garnish with a lime wheel or wedge.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Enjoy Responsibly</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sip and enjoy your perfectly balanced Margarita, savoring the harmony of flavors.
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
            Use fresh lime juice for the best flavor; bottled lime juice can alter the taste.
          </li>
          <li>
            Adjust the sweetness by varying the amount of simple syrup or omit it for a more tart drink.
          </li>
          <li>
            For a smoky twist, try using mezcal instead of tequila.
          </li>
          <li>
            Chill your glass in the freezer before serving to keep the cocktail colder longer.
          </li>
          <li>
            Experiment with flavored salts or sugars on the rim for a unique presentation.
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
              href="https://en.wikipedia.org/wiki/Margarita_(cocktail)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Margarita Cocktail
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.liquor.com/recipes/margarita/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Liquor.com: Margarita Recipe & History
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