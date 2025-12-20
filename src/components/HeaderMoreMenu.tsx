import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getCategoryIcon } from "@/lib/navigation";

interface HeaderMoreMenuProps {
  categories: { key: string; label: string; to: string }[];
  defaultOpen?: boolean;
}

export default function HeaderMoreMenu({ categories, defaultOpen = false }: HeaderMoreMenuProps) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-primary hover:text-primary transition-colors inline-flex items-center px-2">
          More
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="min-w-[220px] max-h-[60vh] overflow-auto flex flex-col gap-0 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-150 ease-out"
      >
        {categories.map((cat) => (
          <DropdownMenuItem key={cat.key} asChild>
            <Link to={cat.to} className="w-full block px-3 py-2 hover:bg-muted/60">
              <div className="inline-flex items-center gap-2">
                <span className="text-[16px]" aria-hidden>{getCategoryIcon(cat.key)}</span>
                <span>{cat.label}</span>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

