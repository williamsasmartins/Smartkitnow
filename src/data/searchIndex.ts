// src/data/searchIndex.ts
export type SearchEntry = {
  key: string;            // identificador único
  name: string;           // nome exibido
  path: string;           // rota para navegar (precisa existir no App.tsx)
  category: string;       // ex.: construction, financial, health, math...
  aliases?: string[];     // sinônimos/atalhos
  keywords?: string[];    // termos auxiliares
};

/**
 * Mantenha aqui tudo o que você quer que apareça na busca global.
 * IMPORTANTE: garanta que o `path` exista nas suas rotas.
 */
export const SEARCH_INDEX: SearchEntry[] = [
  // 🔧 DRYWALL — caminho que você realmente usa no site
  {
    key: "drywall-area-sheets",
    name: "Drywall Area & Sheets Calculator",
    category: "construction",
    path: "/construction/wall-ceiling-calculators/drywall-area-sheets",
    aliases: ["drywall", "sheetrock", "plasterboard"],
    keywords: ["wall", "ceiling", "board", "area", "sheets", "dry"],
  },

  // Exemplos (adicione/remova conforme suas rotas reais)
  {
    key: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    path: "/financial/mortgage-and-home-loan-calculators/mortgage-calculator",
    aliases: ["home loan", "house payment"],
    keywords: ["amortization", "interest", "payment"],
  },
  {
    key: "percent-of",
    name: "Percent Of",
    category: "math",
    path: "/math/percentage-calculators/percent-of",
    aliases: ["percentage of total", "percent-of-number"],
    keywords: ["percent", "percentage", "of", "increase", "decrease"],
  },
  {
    key: "fraction-reducer",
    name: "Fraction Reducer",
    category: "math",
    path: "/math/fractions-calculators/fraction-reducer",
    aliases: ["simplify fraction"],
    keywords: ["fraction", "simplify", "reduce"],
  },
];
