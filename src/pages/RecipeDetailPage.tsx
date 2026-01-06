import React, { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";
import { getCuisine, getRecipe } from "@/data/recipes/cuisines";
import SeoHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Printer, Timer, ChefHat } from "lucide-react";

export default function RecipeDetailPage() {
  const { cuisine, recipe } = useParams<{ cuisine: string; recipe: string }>();
  const c = cuisine ? getCuisine(cuisine) : undefined;
  const r = cuisine && recipe ? getRecipe(cuisine, recipe) : undefined;

  if (!c || !r) return <Navigate to="/recipes" replace />;

  const isBruschetta = c.key === "italian" && r.slug === "tomato-and-basil-bruschetta";

  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const LS_KEY = "skn:favorite_recipes";
  const favoriteId = `${c.key}:${r.slug}`;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setIsFavorite(parsed.includes(favoriteId));
    } catch {
      return;
    }
  }, [favoriteId]);

  function toggleFavorite() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const arr: string[] = Array.isArray(parsed) ? parsed : [];
      const next = new Set(arr);
      if (next.has(favoriteId)) next.delete(favoriteId);
      else next.add(favoriteId);
      const nextArr = Array.from(next);
      localStorage.setItem(LS_KEY, JSON.stringify(nextArr));
      setIsFavorite(next.has(favoriteId));
    } catch {
      return;
    }
  }

  const related = useMemo(() => {
    if (!isBruschetta) return [];
    const preferred = [
      "Caprese Salad",
      "Garlic and Herb Crostini",
      "Italian Bread Salad (Panzanella)",
      "Antipasto Platter (Cured Meats, Cheese, Olives)",
    ];
    const map = new Map(c.recipes.map((x) => [x.title, x]));
    return preferred.flatMap((t) => {
      const item = map.get(t);
      return item ? [item] : [];
    }).slice(0, 4);
  }, [c.recipes, isBruschetta]);

  const faqs = useMemo(() => {
    if (!isBruschetta) return [];
    return [
      {
        question: "Can I make bruschetta ahead of time?",
        answer:
          "You can prep the tomato mixture up to 4 hours ahead and keep it chilled. Toast the bread and assemble right before serving to keep it crisp.",
      },
      {
        question: "Is this bruschetta vegan?",
        answer:
          "Yes, if you skip cheese or use a plant-based topping. The classic tomato-and-basil version is naturally vegan.",
      },
      {
        question: "How do I make it gluten-free?",
        answer:
          "Use gluten-free baguette or crostini. Toast as usual and assemble right before serving.",
      },
      {
        question: "How should I store leftovers?",
        answer:
          "Store the tomato topping in an airtight container up to 24 hours. Keep bread separate and toast fresh for best texture.",
      },
    ];
  }, [isBruschetta]);

  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = useMemo(() => {
    if (!isBruschetta) return null;

    const image =
      "https://images.unsplash.com/photo-1622896784083-cc051313dbb6?auto=format&fit=crop&w=1600&q=80";

    return {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: "Bruschetta de Tomate e Manjericão",
      description:
        "Bruschetta italiana clássica com tomates maduros, manjericão fresco, azeite extra virgem e pão tostado — simples, aromática e perfeita como antipasto.",
      image,
      recipeYield: "6 porções (12 torradas pequenas)",
      prepTime: "PT15M",
      cookTime: "PT8M",
      totalTime: "PT23M",
      recipeCategory: "Starters & Small Plates",
      recipeCuisine: "Italian",
      keywords: ["bruschetta", "italian", "antipasto", "tomato", "basil"],
      recipeIngredient: [
        "1 baguete ou ciabatta (cerca de 250 g), em fatias de 1,5 cm",
        "450 g tomates maduros (preferência: San Marzano ou italiano), em cubos pequenos",
        "20 g manjericão fresco (folhas), rasgado à mão",
        "1–2 dentes de alho, cortados ao meio (para esfregar no pão)",
        "45 ml azeite extra virgem (3 colheres de sopa), mais para finalizar",
        "15 ml vinagre balsâmico (1 colher de sopa), opcional",
        "1 colher de chá de sal marinho fino (ajuste ao gosto)",
        "Pimenta-do-reino moída na hora",
      ],
      recipeInstructions: [
        {
          "@type": "HowToStep",
          name: "Preparar o forno e o pão",
          text: "Aqueça o forno a 220°C. Disponha as fatias de pão e toste 6–8 minutos, virando na metade, até dourar.",
        },
        {
          "@type": "HowToStep",
          name: "Preparar o topping de tomate",
          text: "Misture tomates, manjericão, azeite, sal, pimenta e (opcional) balsâmico. Deixe descansar 10 minutos para macerar.",
        },
        {
          "@type": "HowToStep",
          name: "Aromatizar o pão",
          text: "Esfregue levemente o alho no pão ainda morno. Regue com um fio de azeite.",
        },
        {
          "@type": "HowToStep",
          name: "Montar e servir",
          text: "Distribua o topping de tomate sobre as torradas e finalize com mais manjericão e azeite. Sirva imediatamente.",
        },
      ],
      nutrition: {
        "@type": "NutritionInformation",
        calories: "165 kcal",
        carbohydrateContent: "22 g",
        proteinContent: "4 g",
        fatContent: "7 g",
        fiberContent: "2.5 g",
        sodiumContent: "320 mg",
      },
    };
  }, [isBruschetta]);

  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        {isBruschetta ? (
          <>
            <SeoHead
              title="Bruschetta de Tomate e Manjericão"
              description="Bruschetta italiana clássica com tomates maduros, manjericão, azeite extra virgem e pão tostado — antipasto rápido, elegante e cheio de aroma."
              canonical={canonical}
              ogType="article"
              ogImage="https://images.unsplash.com/photo-1622896784083-cc051313dbb6?auto=format&fit=crop&w=1600&q=80"
            />

            <JsonLd data={[recipeJsonLd, faqJsonLd].filter(Boolean)} />

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-9 pr-[15px]">
                <header className="py-6">
                  <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                    <Link to="/" className="hover:underline">
                      Home
                    </Link>
                    <span> &gt; </span>
                    <Link to="/recipes" className="hover:underline">
                      Recipes
                    </Link>
                    <span> &gt; </span>
                    <Link to={`/recipes/${c.key}`} className="hover:underline">
                      {c.name}
                    </Link>
                    <span> &gt; </span>
                    <span>{r.title}</span>
                  </nav>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Italian</Badge>
                      <Badge variant="outline">Starters & Small Plates</Badge>
                      <Badge variant="outline">Vegetariana</Badge>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-primary">
                          Bruschetta de Tomate e Manjericão
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                          Pão tostado com tomate macerado no azeite, manjericão fresco e um toque de alho — técnica simples,
                          ingredientes excelentes e montagem no último minuto para manter crocância e perfume.
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                          <Printer className="h-4 w-4" />
                          Imprimir
                        </Button>
                        <Button
                          variant={isFavorite ? "default" : "outline"}
                          className="gap-2"
                          onClick={toggleFavorite}
                        >
                          <Heart className="h-4 w-4" />
                          {isFavorite ? "Salvo" : "Favoritar"}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Tempo e dificuldade
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                          <div className="flex justify-between gap-3">
                            <span>Preparo</span>
                            <span className="text-foreground font-medium">15 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Forno</span>
                            <span className="text-foreground font-medium">6–8 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Total</span>
                            <span className="text-foreground font-medium">23 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Dificuldade</span>
                            <span className="text-foreground font-medium">Fácil</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Rendimento</span>
                            <span className="text-foreground font-medium">6 porções</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2 overflow-hidden">
                        <div className="aspect-[16/9] w-full bg-muted">
                          <img
                            src="https://images.unsplash.com/photo-1622896784083-cc051313dbb6?auto=format&fit=crop&w=1600&q=80"
                            alt="Bruschetta de Tomate e Manjericão"
                            className="h-full w-full object-cover"
                            loading="eager"
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </header>

                <article className="space-y-10">
                  <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Ingredientes</h2>
                    <p className="text-muted-foreground">
                      A qualidade manda no resultado: use tomates bem maduros, azeite extra virgem de boa acidez e pão com boa
                      estrutura (miolo firme e casca crocante).
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Base (6 porções)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>1 baguete ou ciabatta (≈ 250 g), em fatias de 1,5 cm</li>
                            <li>450 g tomate maduro (San Marzano, italiano ou grape), em cubos pequenos</li>
                            <li>20 g manjericão fresco, rasgado à mão</li>
                            <li>45 ml azeite extra virgem (3 colheres de sopa), mais para finalizar</li>
                            <li>1–2 dentes de alho, cortados ao meio (para esfregar no pão)</li>
                            <li>Sal marinho fino e pimenta-do-reino na hora</li>
                            <li>15 ml balsâmico de boa qualidade, opcional</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Sazonalidade e alternativas</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-3">
                          <div>
                            <div className="font-medium text-foreground">Tomate fora de época</div>
                            <div>
                              Use tomate cereja bem doce, ou asse tomates em metades por 20–25 min a 200°C para concentrar
                              sabor.
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Pão</div>
                            <div>
                              Pode trocar por pão italiano, sourdough ou crostini prontos (toste rapidamente para reviver a
                              textura).
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Toque extra</div>
                            <div>
                              Finalize com raspas de limão siciliano, orégano fresco, ou uma pitada mínima de pimenta calabresa.
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Modo de Preparo</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Utensílios recomendados</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Assadeira larga, faca bem afiada, tigela, peneira (opcional para escorrer), pincel de cozinha
                          (opcional) e pinça/espátula.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Técnica profissional</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Salgue o tomate e deixe macerar 10 minutos. Se estiver muito aguado, escorra rapidamente para não
                          encharcar o pão.
                        </CardContent>
                      </Card>
                    </div>

                    <ol className="space-y-3">
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">1) Tostar o pão (6–8 min)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Forno a 220°C. Toste até dourar, virando na metade. Para bordas mais crocantes, pincele levemente com
                          azeite antes.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">2) Preparar o topping (10 min + 1 min)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Misture tomate, manjericão, azeite, sal, pimenta e (opcional) balsâmico. Descanse 10 minutos. Ajuste
                          o sal no final.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">3) Aromatizar e montar (2–3 min)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Esfregue o alho no pão morno. Monte a bruschetta só na hora de servir. Finalize com fio de azeite e
                          manjericão rasgado.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">4) Apresentação</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Sirva em travessa ampla, sem empilhar. Se quiser brilho e frescor, finalize com um toque de azeite
                          bem frutado.
                        </div>
                      </li>
                    </ol>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Informação Nutricional</h2>
                    <p className="text-sm text-muted-foreground">
                      Valores aproximados por porção (2 torradas pequenas), variando com tipo de pão e azeite.
                    </p>

                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nutriente</TableHead>
                              <TableHead className="text-right">Por porção</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Calorias</TableCell>
                              <TableCell className="text-right">165 kcal</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Carboidratos</TableCell>
                              <TableCell className="text-right">22 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Proteínas</TableCell>
                              <TableCell className="text-right">4 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Gorduras totais</TableCell>
                              <TableCell className="text-right">7 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Fibra</TableCell>
                              <TableCell className="text-right">2,5 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Açúcares</TableCell>
                              <TableCell className="text-right">3 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Sódio</TableCell>
                              <TableCell className="text-right">320 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Potássio</TableCell>
                              <TableCell className="text-right">280 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vitamina C</TableCell>
                              <TableCell className="text-right">12 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vitamina A</TableCell>
                              <TableCell className="text-right">55 µg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Cálcio</TableCell>
                              <TableCell className="text-right">40 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Ferro</TableCell>
                              <TableCell className="text-right">1,2 mg</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vegetariana</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Receita base é vegetariana. Para um toque clássico, finalize com lascas de parmesão.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vegana</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Mantenha sem queijos ou use “ricotta” vegetal. Prefira azeite frutado para compensar cremosidade.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Sem glúten</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Troque por pão sem glúten. Toste bem e monte na hora para evitar umidade.
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Dicas do Chef Michelin</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Técnicas para elevar o prato
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>
                            Escorra o tomate após maceração e use só um pouco do líquido para “pintar” o pão, mantendo crocância.
                          </div>
                          <div>
                            Para aroma extra, finalize com azeite infusionado com manjericão (30–60 min) e pimenta moída na hora.
                          </div>
                          <div>
                            Se quiser cremosidade, adicione uma camada fina de stracciatella ou burrata e depois o tomate.
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vinhos e harmonização</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>Brancos: Vermentino, Verdicchio ou Pinot Grigio (acidez para equilibrar tomate e azeite).</div>
                          <div>
                            Tintos leves: Chianti jovem ou Barbera (se tiver queijo ou presunto em variações).
                          </div>
                          <div>Sem álcool: água com gás e limão siciliano para limpar o paladar.</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Curiosidade histórica</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        “Bruschetta” vem do verbo italiano <span className="italic">bruscare</span>, “tostar sobre brasas”.
                        A tradição nasceu como forma de provar azeite novo com pão tostado e alho, especialmente em regiões do
                        centro da Itália.
                      </CardContent>
                    </Card>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Receitas Relacionadas</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {related.map((rr) => (
                        <Link key={rr.slug} to={`/recipes/${c.key}/${rr.slug}`} className="group">
                          <Card className="h-full transition-colors group-hover:border-primary/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{rr.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Veja a receita completa e variações no mesmo estilo italiano.
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {c.name} —{" "}
                      <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">
                        ver todas as receitas {c.name}
                      </Link>
                    </div>
                  </section>
                </article>

                <div className="mt-14 grid gap-6 md:grid-cols-2">
                  <ShareBox />
                  <SuggestBoxInline />
                </div>
              </div>

              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
                  <AdSidebarRight topOffset={0} />
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <header className="lg:col-span-9 py-6 pr-[15px]">
              <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <span> &gt; </span>
                <Link to="/recipes" className="hover:underline">
                  Recipes
                </Link>
                <span> &gt; </span>
                <Link to={`/recipes/${c.key}`} className="hover:underline">
                  {c.name}
                </Link>
                <span> &gt; </span>
                <span>{r.title}</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-semibold text-primary">{r.title}</h1>
              <p className="mt-2 text-sm">
                {c.name} —{" "}
                <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">
                  see all {c.name} recipes
                </Link>
              </p>
            </header>
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
                <AdSidebarRight topOffset={0} />
              </div>
            </aside>
            <div className="lg:col-span-9 pr-[15px]">
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ShareBox />
                <SuggestBoxInline />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
