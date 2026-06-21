import { useNavigate } from "react-router-dom";
import type { HomeCategory } from "@/data/home/homeCategories";

interface CategoryTileProps {
  category: HomeCategory;
}

// Map Tailwind text color → bg tint for icon badge
const COLOR_TO_BG: Record<string, string> = {
  "text-purple-600":  "bg-purple-100 dark:bg-purple-900/40",
  "text-green-600":   "bg-green-100 dark:bg-green-900/40",
  "text-red-600":     "bg-red-100 dark:bg-red-900/40",
  "text-amber-600":   "bg-amber-100 dark:bg-amber-900/40",
  "text-cyan-600":    "bg-cyan-100 dark:bg-cyan-900/40",
  "text-indigo-600":  "bg-indigo-100 dark:bg-indigo-900/40",
  "text-violet-600":  "bg-violet-100 dark:bg-violet-900/40",
  "text-yellow-500":  "bg-yellow-100 dark:bg-yellow-900/40",
  "text-slate-600":   "bg-slate-100 dark:bg-slate-800/60",
  "text-blue-500":    "bg-blue-100 dark:bg-blue-900/40",
  "text-blue-600":    "bg-blue-100 dark:bg-blue-900/40",
  "text-orange-500":  "bg-orange-100 dark:bg-orange-900/40",
  "text-pink-500":    "bg-pink-100 dark:bg-pink-900/40",
  "text-emerald-500": "bg-emerald-100 dark:bg-emerald-900/40",
  "text-indigo-500":  "bg-indigo-100 dark:bg-indigo-900/40",
  "text-yellow-600":  "bg-yellow-100 dark:bg-yellow-900/40",
};

export default function CategoryTile({ category }: CategoryTileProps): JSX.Element {
  const navigate = useNavigate();
  const Icon = category.icon;
  const iconBg = COLOR_TO_BG[category.color] ?? "bg-muted";

  return (
    <button
      onClick={() => navigate(category.path)}
      className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-background border border-border hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md hover:shadow-teal-500/8 hover:-translate-y-1 transition-all duration-200 active:scale-[0.97] text-center"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-5 h-5 ${category.color}`} aria-hidden />
      </div>
      <span className="text-xs font-semibold text-foreground leading-tight">
        {category.name}
      </span>
    </button>
  );
}
