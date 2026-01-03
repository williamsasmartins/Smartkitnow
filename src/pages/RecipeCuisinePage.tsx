import React, { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import CountryFlag from "@/components/recipes/CountryFlag";
import { getCuisine } from "@/data/recipes/cuisines";

type Section = { title: string; items: string[] };

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function RecipeCuisinePage() {
  const { cuisine } = useParams<{ cuisine: string }>();
  const data = cuisine ? getCuisine(cuisine) : undefined;

  if (!data) return <Navigate to="/recipes" replace />;

  const italianSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Tomato and Basil Bruschetta",
        "Caprese Salad",
        "Italian Bread Salad (Panzanella)",
        "Antipasto Platter (Cured Meats, Cheese, Olives)",
        "Garlic and Herb Crostini",
        "Fried Rice Balls (Arancini)",
        "Stuffed Zucchini Blossoms",
        "Marinated Artichokes",
        "Baked Stuffed Mushrooms",
        "Prosciutto and Melon",
      ],
    },
    {
      title: "Soups",
      items: [
        "Minestrone Soup",
        "Tuscan Bread and Vegetable Soup (Ribollita)",
        "Pasta and Bean Soup (Pasta e Fagioli)",
        "Italian Wedding Soup",
        "Tomato and Bread Soup",
      ],
    },
    {
      title: "Salads",
      items: [
        "Caprese Salad",
        "Italian Bread Salad (Panzanella)",
        "Arugula and Parmesan Salad",
        "Chicory Salad with Anchovy-Garlic Dressing",
      ],
    },
    {
      title: "Pasta & Gnocchi",
      items: [
        "Spaghetti Carbonara",
        "Tagliatelle with Meat Ragù (Bolognese)",
        "Black Pepper and Pecorino Pasta (Cacio e Pepe)",
        "Pasta with Basil Pesto",
        "Garlic and Olive Oil Pasta (Aglio e Olio)",
        "Spaghetti with Tomato and Basil (Pomodoro)",
        "Spaghetti with Clams",
        "Lasagna",
        "Baked Ziti",
        "Stuffed Pasta Shells",
        "Potato Gnocchi with Tomato Sauce",
        "Ricotta Gnocchi",
        "Tortellini in Broth",
      ],
    },
    {
      title: "Risotto & Polenta",
      items: [
        "Saffron Risotto (Risotto alla Milanese)",
        "Mushroom Risotto",
        "Seafood Risotto",
        "Parmesan Risotto",
        "Creamy Polenta with Mushrooms",
        "Polenta with Meat Ragù",
      ],
    },
    {
      title: "Pizza, Calzones & Flatbreads",
      items: [
        "Neapolitan Pizza",
        "Margherita Pizza",
        "Marinara Pizza",
        "Four Cheese Pizza",
        "Prosciutto and Arugula Pizza",
        "Calzone",
        "Focaccia",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Chicken Cacciatore",
        "Chicken Saltimbocca",
        "Veal Cutlet Milanese",
        "Braised Veal Shanks (Osso Buco)",
        "Italian-Style Roast Pork (Porchetta)",
        "Tuscan Steak (Florentine-Style)",
        "Italian Meatballs in Tomato Sauce",
        "Eggplant Parmesan",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Shrimp Scampi",
        "Mussels in White Wine and Garlic",
        "Fried Calamari",
        "Seafood Stew (Tomato and Wine Base)",
      ],
    },
    {
      title: "Sides & Vegetables",
      items: [
        "Roasted Potatoes",
        "Garlic Sautéed Spinach",
        "Broccoli Rabe with Garlic and Chili",
        "Sweet and Sour Eggplant Relish (Caponata)",
        "Roasted Peppers with Olive Oil",
      ],
    },
    {
      title: "Breads & Savory Baking",
      items: ["Ciabatta", "Breadsticks (Grissini)", "Stuffed Flatbread (Piadina)"],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Tiramisu",
        "Panna Cotta",
        "Cannoli",
        "Gelato",
        "Affogato",
        "Biscotti",
        "Semifreddo",
        "Italian Ice (Granita)",
        "Sfogliatella",
        "Panettone",
      ],
    },
    {
      title: "Drinks & Coffee",
      items: ["Espresso", "Cappuccino", "Negroni", "Limoncello", "Aperitif Spritz"],
    },
  ];

  const titleToSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of data.recipes) map.set(r.title, r.slug);
    return map;
  }, [data.recipes]);

  const isItalian = data.key === "italian";
  const totalItalianLinks = italianSections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Coluna principal (header + lista + boxes) */}
          <div className="lg:col-span-9 pr-[15px]">
            <header className="py-6">
              <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                <Link to="/" className="hover:underline">Home</Link>
                <span> &gt; </span>
                <Link to="/recipes" className="hover:underline">Recipes</Link>
                <span> &gt; </span>
                <span>{data.name}</span>
              </nav>
              <div className="flex items-center gap-3">
                <CountryFlag code={data.countryCode} size={36} alt={`${data.name} flag`} />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">
                  {data.name} Recipes
                </h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  ({isItalian ? totalItalianLinks : data.recipes.length})
                </span>
              </div>
              {data.description && (
                <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-4xl">
                  {data.description}
                </p>
              )}
            </header>

            {/* Lista */}
            <section>
              {isItalian ? (
                <div className="space-y-10">
                  {italianSections.map((section) => (
                    <section key={section.title} className="space-y-3">
                      <h2 className="text-xl md:text-2xl font-semibold text-primary">{section.title}</h2>
                      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                        {(() => {
                          const mid = Math.ceil(section.items.length / 2);
                          const left = section.items.slice(0, mid);
                          const right = section.items.slice(mid);

                          const renderList = (items: string[]) => (
                            <ul className="list-disc ml-6 space-y-2.5">
                              {items.map((title) => {
                                const slug = titleToSlug.get(title) ?? slugify(title);
                                return (
                                  <li key={`${section.title}:${slug}`} className="leading-relaxed">
                                    <Link
                                      to={`/recipes/${data.key}/${slug}`}
                                      className="text-primary hover:underline text-[1.05rem] leading-7"
                                    >
                                      {title}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          );

                          return (
                            <>
                              {renderList(left)}
                              {renderList(right)}
                            </>
                          );
                        })()}
                      </div>
                    </section>
                  ))}
                </div>
              ) : data.recipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  We’re curating recipes for this cuisine. Check back soon.
                </p>
              ) : (
                <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                  {(() => {
                    const mid = Math.ceil(data.recipes.length / 2);
                    const left = data.recipes.slice(0, mid);
                    const right = data.recipes.slice(mid);

                    const renderList = (items: typeof data.recipes) => (
                      <ul className="list-disc ml-6 space-y-2.5">
                        {items.map((r) => (
                          <li key={r.slug} className="leading-relaxed">
                            <Link
                              to={`/recipes/${data.key}/${r.slug}`}
                              className="text-primary hover:underline text-[1.05rem] leading-7"
                            >
                              {r.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    );

                    return (
                      <>
                        {renderList(left)}
                        {renderList(right)}
                      </>
                    );
                  })()}
                </div>
              )}
            </section>

            {/* Boxes inferiores */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* Coluna do right rail */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
