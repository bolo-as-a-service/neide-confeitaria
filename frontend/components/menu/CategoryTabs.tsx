"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CakeSlice,
  LayoutGrid,
  Leaf,
  Utensils,
  ShoppingBasket,
  Snowflake,
  Flame,
  ChefHat,
  CupSoda,
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const DEFAULT_ICON = <Utensils className="h-5 w-5" />;

const ICON_MAP: Record<string, React.ReactNode> = {
  "caseiro": <CakeSlice className="h-5 w-5" />,
  "diet": <Leaf className="h-5 w-5" />,
  "vulc\u00e3o": <Flame className="h-5 w-5" />,
  "bolo": <CakeSlice className="h-5 w-5" />,
  "salgado": <ChefHat className="h-5 w-5" />,
  "pudim": <CupSoda className="h-5 w-5" />,
  "cesta": <ShoppingBasket className="h-5 w-5" />,
  "congelado": <Snowflake className="h-5 w-5" />,
};

function getIcon(id: string): React.ReactNode {
  return ICON_MAP[id] || DEFAULT_ICON;
}

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories?: Category[];
}

export function CategoryTabs({ activeCategory, onCategoryChange, categories }: CategoryTabsProps) {
  const displayCategories = categories && categories.length > 0 ? categories : [];

  const allButton = (
    <button
      key="todos"
      onClick={() => onCategoryChange("todos")}
      className={`flex flex-col items-center gap-1.5 px-3 py-3 min-w-[90px] sm:min-w-[80px] transition-all duration-200 rounded-2xl border-2 ${
        activeCategory === "todos"
          ? "bg-white border-[var(--brand-700)] text-[var(--brand-800)] shadow-md"
          : "bg-white/80 border-[var(--rose-200)] text-[var(--brand-700)] hover:border-[var(--brand-600)] hover:text-[var(--brand-800)] hover:shadow-sm"
      }`}
      aria-pressed={activeCategory === "todos"}
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--rose-100)] text-[var(--brand-700)]">
        <LayoutGrid className="h-5 w-5" />
      </span>
      <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
        Todas
      </span>
    </button>
  );

  return (
    <div className="px-4 pb-4">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {allButton}
        {displayCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-3 min-w-[90px] sm:min-w-[80px] transition-all duration-200",
              "rounded-2xl border-2",
              activeCategory === category.id
                ? "bg-white border-[var(--brand-700)] text-[var(--brand-800)] shadow-md"
                : "bg-white/80 border-[var(--rose-200)] text-[var(--brand-700)] hover:border-[var(--brand-600)] hover:text-[var(--brand-800)] hover:shadow-sm"
            )}
            aria-pressed={activeCategory === category.id}
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--rose-100)] text-[var(--brand-700)]">
              {category.icon || getIcon(category.id)}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
