"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CakeSlice,
  CircleDot,
  Leaf,
  Utensils,
  ShoppingBasket,
  Snowflake,
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  { id: "bolos-cobertura", label: "Bolos c/ cobertura", icon: <CakeSlice className="h-5 w-5" /> },
  { id: "bolos-vulcao", label: "Bolos vulcão", icon: <CircleDot className="h-5 w-5" /> },
  { id: "bolos-piscina", label: "Bolos piscina", icon: <Utensils className="h-5 w-5" /> },
  { id: "bolos-fit", label: "Bolos fit", icon: <Leaf className="h-5 w-5" /> },
  { id: "pudins", label: "Pudins", icon: <Utensils className="h-5 w-5" /> },
  { id: "cestas", label: "Cestas", icon: <ShoppingBasket className="h-5 w-5" /> },
  { id: "congelados", label: "Congelados", icon: <Snowflake className="h-5 w-5" /> },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="px-4 pb-4">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {CATEGORIES.map((category) => (
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
              {category.icon}
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