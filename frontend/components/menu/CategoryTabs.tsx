"use client";

import * as React from "react";
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
  "vulcao": <Flame className="h-5 w-5" />,
  "bolo": <CakeSlice className="h-5 w-5" />,
  "salgado": <ChefHat className="h-5 w-5" />,
  "pudim": <CupSoda className="h-5 w-5" />,
  "cesta": <ShoppingBasket className="h-5 w-5" />,
  "congelado": <Snowflake className="h-5 w-5" />,
  "outros": <Utensils className="h-5 w-5" />,
  "sem-categoria": <Utensils className="h-5 w-5" />,
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
  const stripRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = React.useState(false);

  // Mantém a categoria ativa visível na faixa horizontal.
  React.useEffect(() => {
    const active = stripRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCategory]);

  // Sombra só quando a faixa está fixa (sentinela fora da área grudada).
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const STICK_TOP = 115;
    const onScroll = () => {
      const next = sentinel.getBoundingClientRect().bottom < STICK_TOP;
      setStuck((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const renderButton = (id: string, label: string, icon: React.ReactNode) => {
    const active = activeCategory === id;
    return (
      <button
        key={id}
        data-active={active}
        onClick={() => onCategoryChange(id)}
        className={`flex flex-col items-center gap-1.5 px-3 py-3 min-w-[92px] sm:min-w-[84px] transition-all duration-200 rounded-2xl border-2 snap-start ${
          active
            ? "bg-[var(--brand-900)] border-[var(--brand-900)] text-[var(--cream)] shadow-[0_10px_24px_-10px_rgba(43,21,20,0.6)]"
            : "bg-white/90 border-[var(--rose-200)] text-[var(--brand-700)] hover:border-[var(--brand-600)] hover:text-[var(--brand-800)] hover:shadow-sm"
        }`}
        aria-pressed={active}
      >
        <span className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${active ? "bg-white/15 text-[var(--cream)]" : "bg-[var(--rose-100)] text-[var(--brand-700)]"}`}>
          {icon}
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px" />
      <div className={`sticky top-[115px] z-30 bg-[var(--page-bg)] border-b transition-shadow duration-300 ${stuck ? "border-[var(--rose-200)] shadow-[0_12px_24px_-14px_rgba(75,40,32,0.35)]" : "border-transparent shadow-none"}`}>
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6">
        <div ref={stripRef} className="flex gap-3 overflow-x-auto pt-3 pb-4 scrollbar-hide snap-x">
        {renderButton("todos", "Todas", <LayoutGrid className="h-5 w-5" />)}
        {displayCategories.map((category) => (
          <React.Fragment key={category.id}>
            {renderButton(category.id, category.label, category.icon || getIcon(category.id))}
          </React.Fragment>
        ))}
        </div>
      </div>
      </div>
    </>
  );
}
