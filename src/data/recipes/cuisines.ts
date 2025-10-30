// Cuisines canon + recipes por país (stubs iniciais)

export type RecipeItem = { title: string; slug: string; brief?: string };

export type Cuisine = {
  key: string; // "italian"
  name: string; // "Italian"
  flag: string; // "🇮🇹"
  description?: string; // SEO curto
  recipes: RecipeItem[];
};

export const CUISINES: Cuisine[] = [
  {
    key: "italian",
    name: "Italian",
    flag: "🇮🇹",
    description:
      "Classic Italian cooking: regional pasta, risotto, sauces, and slow-simmered flavors.",
    recipes: [
      { title: "Spaghetti Carbonara", slug: "spaghetti-carbonara" },
      { title: "Margherita Pizza", slug: "margherita-pizza" },
      { title: "Risotto alla Milanese", slug: "risotto-alla-milanese" },
      { title: "Osso Buco", slug: "osso-buco" },
      { title: "Lasagna Bolognese", slug: "lasagna-bolognese" },
      { title: "Tiramisu", slug: "tiramisu" },
      { title: "Gnocchi with Pesto", slug: "gnocchi-with-pesto" },
      { title: "Saltimbocca alla Romana", slug: "saltimbocca-alla-romana" },
      { title: "Caprese Salad", slug: "caprese-salad" },
      { title: "Sicilian Cannoli", slug: "sicilian-cannoli" },
    ],
  },
  {
    key: "mexican",
    name: "Mexican",
    flag: "🇲🇽",
    description:
      "Bold salsas, slow braises, masa-based staples, and vibrant street food classics.",
    recipes: [
      { title: "Tacos al Pastor", slug: "tacos-al-pastor" },
      { title: "Green Enchiladas", slug: "green-enchiladas" },
      { title: "Mole Poblano", slug: "mole-poblano" },
      { title: "Chiles en Nogada", slug: "chiles-en-nogada" },
      { title: "Guacamole", slug: "guacamole" },
      { title: "Red Pozole", slug: "red-pozole" },
      { title: "Oaxacan Tamales", slug: "oaxacan-tamales" },
      { title: "Shrimp Ceviche", slug: "shrimp-ceviche" },
      { title: "Squash Blossom Quesadillas", slug: "squash-blossom-quesadillas" },
      { title: "Neapolitan Flan", slug: "neapolitan-flan" },
    ],
  },
  {
    key: "french",
    name: "French",
    flag: "🇫🇷",
    description: "Bistro classics, slow sauces, rustic stews, and pastry roots.",
    recipes: [
      { title: "Coq au Vin", slug: "coq-au-vin" },
      { title: "Crêpes Suzette", slug: "crepes-suzette" },
      { title: "Beef Bourguignon", slug: "beef-bourguignon" },
      { title: "Ratatouille", slug: "ratatouille" },
      { title: "Escargots Bourguignonne", slug: "escargots-bourguignonne" },
      { title: "Croissant", slug: "croissant" },
      { title: "Crème Brûlée", slug: "creme-brulee" },
      { title: "Quiche Lorraine", slug: "quiche-lorraine" },
      { title: "Bouillabaisse", slug: "bouillabaisse" },
      { title: "Macarons", slug: "macarons" },
    ],
  },
  {
    key: "japanese",
    name: "Japanese",
    flag: "🇯🇵",
    description: "Izakaya and home-style fare, broths, rice bowls, and tempura.",
    recipes: [
      { title: "Maki Sushi", slug: "maki-sushi" },
      { title: "Tonkotsu Ramen", slug: "tonkotsu-ramen" },
      { title: "Tempura Udon", slug: "tempura-udon" },
      { title: "Chicken Teriyaki", slug: "chicken-teriyaki" },
      { title: "Onigiri", slug: "onigiri" },
      { title: "Takoyaki", slug: "takoyaki" },
      { title: "Okonomiyaki", slug: "okonomiyaki" },
      { title: "Sashimi", slug: "sashimi" },
      { title: "Mochi", slug: "mochi" },
      { title: "Yakitori", slug: "yakitori" },
    ],
  },
  {
    key: "chinese",
    name: "Chinese",
    flag: "🇨🇳",
    description: "Wok techniques, dim sum basics, and fragrant regional stir-fries.",
    recipes: [
      { title: "Kung Pao Chicken", slug: "kung-pao-chicken" },
      { title: "Mapo Tofu", slug: "mapo-tofu" },
      { title: "Peking Duck", slug: "peking-duck" },
      { title: "Dumplings (Jiaozi)", slug: "dumplings-jiaozi" },
      { title: "Chow Mein", slug: "chow-mein" },
      { title: "Sweet and Sour Pork", slug: "sweet-and-sour-pork" },
      { title: "Hot Pot", slug: "hot-pot" },
      { title: "Spring Rolls", slug: "spring-rolls" },
      { title: "Congee", slug: "congee" },
      { title: "Char Siu Bao", slug: "char-siu-bao" },
    ],
  },
  {
    key: "korean",
    name: "Korean",
    flag: "🇰🇷",
    description: "BBQ cuts, ferments, umami broths, and hot-stone rice bowls.",
    recipes: [
      { title: "Bibimbap", slug: "bibimbap" },
      { title: "Kimchi Stew", slug: "kimchi-stew" },
      { title: "Bulgogi", slug: "bulgogi" },
      { title: "Tteokbokki", slug: "tteokbokki" },
      { title: "Japchae", slug: "japchae" },
      { title: "Grilled Pork Belly (Samgyeopsal)", slug: "grilled-pork-belly-samgyeopsal" },
      { title: "Kimbap", slug: "kimbap" },
      { title: "Soft Tofu Stew (Sundubu Jjigae)", slug: "soft-tofu-stew-sundubu-jjigae" },
      { title: "Seafood Pancake (Haemul Pajeon)", slug: "seafood-pancake-haemul-pajeon" },
      { title: "Shaved Ice with Red Bean (Patbingsu)", slug: "shaved-ice-with-red-bean-patbingsu" },
    ],
  },
  {
    key: "indian",
    name: "Indian",
    flag: "🇮🇳",
    description: "Regional curries, masalas, tandoor breads, and dal staples.",
    recipes: [
      { title: "Butter Chicken", slug: "butter-chicken" },
      { title: "Paneer Tikka Masala", slug: "paneer-tikka-masala" },
      { title: "Biryani", slug: "biryani" },
      { title: "Chana Masala", slug: "chana-masala" },
      { title: "Palak Paneer", slug: "palak-paneer" },
      { title: "Samosa", slug: "samosa" },
      { title: "Naan", slug: "naan" },
      { title: "Dal Makhani", slug: "dal-makhani" },
      { title: "Aloo Gobi", slug: "aloo-gobi" },
      { title: "Gulab Jamun", slug: "gulab-jamun" },
    ],
  },
  {
    key: "thai",
    name: "Thai",
    flag: "🇹🇭",
    description: "Street-food curries, herb-lime aromatics, and noodle favorites.",
    recipes: [
      { title: "Pad Thai", slug: "pad-thai" },
      { title: "Tom Yum Goong", slug: "tom-yum-goong" },
      { title: "Green Curry", slug: "green-curry" },
      { title: "Som Tam (Papaya Salad)", slug: "som-tam-papaya-salad" },
      { title: "Massaman Curry", slug: "massaman-curry" },
      { title: "Mango Sticky Rice", slug: "mango-sticky-rice" },
      { title: "Tom Kha Gai", slug: "tom-kha-gai" },
      { title: "Pad See Ew", slug: "pad-see-ew" },
      { title: "Fresh Spring Rolls", slug: "fresh-spring-rolls" },
      { title: "Fried Rice (Khao Pad)", slug: "fried-rice-khao-pad" },
    ],
  },
  {
    key: "middle-eastern",
    name: "Middle Eastern",
    flag: "🇱🇧",
    description: "Meze spreads, grills, tahini, sumac, and warm spices.",
    recipes: [
      { title: "Hummus with Pita", slug: "hummus-with-pita" },
      { title: "Chicken Shawarma", slug: "chicken-shawarma" },
      { title: "Falafel", slug: "falafel" },
      { title: "Tabouleh", slug: "tabouleh" },
      { title: "Baba Ganoush", slug: "baba-ganoush" },
      { title: "Koobideh Kebab", slug: "koobideh-kebab" },
      { title: "Fattoush Salad", slug: "fattoush-salad" },
      { title: "Baklava", slug: "baklava" },
      { title: "Stuffed Grape Leaves (Dolma)", slug: "stuffed-grape-leaves-dolma" },
      { title: "Muhammara", slug: "muhammara" },
    ],
  },
  {
    key: "greek",
    name: "Greek",
    flag: "🇬🇷",
    description: "Mediterranean home classics, olive oil, herbs, and grills.",
    recipes: [
      { title: "Moussaka", slug: "moussaka" },
      { title: "Souvlaki", slug: "souvlaki" },
      { title: "Gyros", slug: "gyros" },
      { title: "Tzatziki", slug: "tzatziki" },
      { title: "Spanakopita", slug: "spanakopita" },
      { title: "Greek Village Salad", slug: "greek-village-salad" },
      { title: "Stuffed Grape Leaves (Dolmades)", slug: "stuffed-grape-leaves-dolmades" },
      { title: "Baklava", slug: "baklava" },
      { title: "Pastitsio", slug: "pastitsio" },
      { title: "Loukoumades", slug: "loukoumades" },
    ],
  },
  {
    key: "brazilian",
    name: "Brazilian",
    flag: "🇧🇷",
    description: "Hearty stews, grills, and regional staples across Brazil.",
    recipes: [
      { title: "Feijoada", slug: "feijoada" },
      { title: "Cheese Bread (Pão de Queijo)", slug: "cheese-bread-pao-de-queijo" },
      { title: "Fish Moqueca", slug: "fish-moqueca" },
      { title: "Brigadeiro", slug: "brigadeiro" },
      { title: "Acarajé", slug: "acaraje" },
      { title: "Coxinha", slug: "coxinha" },
      { title: "Toasted Cassava Flour (Farofa)", slug: "toasted-cassava-flour-farofa" },
      { title: "Vatapá", slug: "vatapa" },
      { title: "Street Market Pastel", slug: "street-market-pastel" },
      { title: "Quindim", slug: "quindim" },
    ],
  },
  {
    key: "portuguese",
    name: "Portuguese",
    flag: "🇵🇹",
    description: "Seafood-rich stews, rustic breads, and citrus-herb flavors.",
    recipes: [
      { title: "Codfish à Brás", slug: "codfish-a-bras" },
      { title: "Pastéis de Nata", slug: "pasteis-de-nata" },
      { title: "Kale Soup (Caldo Verde)", slug: "caldo-verde" },
      { title: "Francesinha", slug: "francesinha" },
      { title: "Seafood Rice", slug: "seafood-rice" },
      { title: "Pork Sandwich (Bifana)", slug: "pork-sandwich-bifana" },
      { title: "Portuguese Stew (Cozido à Portuguesa)", slug: "cozido-a-portuguesa" },
      { title: "Clams Bulhão Pato", slug: "clams-bulhao-pato" },
      { title: "Serra da Estrela Cheese", slug: "serra-da-estrela-cheese" },
      { title: "Berliner Doughnut (Bola de Berlim)", slug: "berliner-doughnut-bola-de-berlim" },
    ],
  },
];

export function listCuisines(): Cuisine[] {
  return CUISINES;
}

export function getCuisine(key: string): Cuisine | undefined {
  return CUISINES.find((c) => c.key === key);
}

export function getRecipe(cuisineKey: string, recipeSlug: string): RecipeItem | undefined {
  const c = getCuisine(cuisineKey);
  return c?.recipes.find((r) => r.slug === recipeSlug);
}