import { REGISTRY as calculatorRegistry, subcategoryIcon } from './calculatorRegistry';
 
 // Tipos esperados pelo CategoryPageTemplate
 export type CalculatorLink = { title: string; to: string };
 export type Section = { icon?: string; title: string; items: CalculatorLink[] };
 
 export type BuildSectionsOptions = {
   /**
    * Mapa opcional para mostrar um ícone/emoji por subcategoria.
    * Ex.: { 'bmi': '⚖️', 'body-measurements': '📏' }
    */
   subcategoryIconMap?: Record<string, string>;
   /**
    * Se quiser excluir algumas subcategorias específicas.
    */
   excludeSubcategories?: string[];
   /**
    * Alternar para slugs mais curtos: /health/<slug>
    * true => /<category>/<slug>
    * false => tenta montar com subcategoria: /<category>/<subcategory>/<slug>
    */
   shortPaths?: boolean;
   /**
    * Normaliza o "label" de subcategoria para título da seção.
    * Se não for fornecido, usa o próprio nome da subcategoria com capitalização simples.
    */
   subcategoryTitle?: (subcategoryKey: string) => string;
   /**
    * Filtra/ordena os itens de cada seção.
    * Por padrão, ordena alfabeticamente por title.
    */
   sortItems?: (a: CalculatorLink, b: CalculatorLink) => number;
   /**
    * Filtra/ordena as seções.
    * Por padrão, ordena alfabeticamente por title.
    */
   sortSections?: (a: Section, b: Section) => number;
 };
 
 /**
  * Constrói as sections para uma categoria usando o calculatorRegistry.
  * Retorna [{ icon?, title, items: [{title, to}, ...] }, ...]
  */
 export function buildSectionsForCategory(
   categoryKey: string,
   opts: BuildSectionsOptions = {}
 ): Section[] {
   const {
     subcategoryIconMap = {},
     excludeSubcategories = [],
     shortPaths = true,
     subcategoryTitle = defaultSubcategoryTitle,
     sortItems = defaultSortItems,
     sortSections = defaultSortSections,
   } = opts;
 
   // 1) Filtra pelo category
   const entries = (calculatorRegistry ?? []).filter(
     (e: any) => normalize(e.category) === normalize(categoryKey)
   );
 
   // 2) Agrupa por subcategory (com fallback "General")
   const groups: Record<string, CalculatorLink[]> = {};
   for (const e of entries) {
     const sub = e.subcategory ? String(e.subcategory) : 'general';
     if (excludeSubcategories.includes(normalize(sub))) continue;
 
     const to = shortPaths
       ? `/${normalize(categoryKey)}/${e.slug}`
       : `/${normalize(categoryKey)}/${normalize(sub)}/${e.slug}`;
 
     const item: CalculatorLink = {
       title: e.title ?? e.slug,
       to,
     };
     if (!groups[sub]) groups[sub] = [];
     groups[sub].push(item);
   }
 
   // 3) Monta sections e ordena
   const sections: Section[] = Object.entries(groups).map(([subKey, items]) => {
     const normalizedSubKey = normalize(subKey);
     const icon = subcategoryIconMap[normalizedSubKey] ?? subcategoryIcon(normalizedSubKey, normalize(categoryKey));
     const title = subcategoryTitle(subKey);
     const sortedItems = [...items].sort(sortItems);
     return { icon, title, items: sortedItems };
   });
 
   sections.sort(sortSections);
   return sections;
 }
 
 // ---------- Helpers padrão ----------
 
 function normalize(v?: string) {
   return String(v ?? '')
     .trim()
     .toLowerCase()
     .replace(/\s+/g, '-')
     .replace(/[^\w-]/g, '');
 }
 
 function defaultSubcategoryTitle(subKey: string): string {
   // Capitaliza “words-like”
   const clean = subKey.replace(/[-_]+/g, ' ').trim();
   if (!clean) return 'General';
   const cap = clean
     .split(' ')
     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
     .join(' ');
   return cap === 'General' ? 'General' : cap;
 }
 
 function defaultSortItems(a: CalculatorLink, b: CalculatorLink) {
   return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
 }
 
 function defaultSortSections(a: Section, b: Section) {
   return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
 }