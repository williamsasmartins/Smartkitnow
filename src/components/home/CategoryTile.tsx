import { useNavigate } from "react-router-dom";
import { getCategoryIcon } from "@/lib/navigation";
import type { HomeCategory } from "@/data/home/homeCategories";

interface CategoryTileProps {
  category: HomeCategory;
}

export default function CategoryTile({ category }: CategoryTileProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(category.path)}
      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-background border border-border hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md hover:shadow-teal-500/8 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] text-center"
    >
      <span className="text-2xl leading-none select-none" aria-hidden>
        {getCategoryIcon(category.key)}
      </span>
      <span className="text-xs font-semibold text-foreground leading-tight">
        {category.name}
      </span>
    </button>
  );
}
