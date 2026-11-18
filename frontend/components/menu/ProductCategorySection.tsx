"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, Product } from "./ProductCard";

interface ProductCategorySectionProps {
  title: string;
  sectionId?: string;
  products: Product[];
  onAddClick: (product: Product) => void;
  onDetailClick?: (product: Product) => void;
  /** Marca a primeira imagem como prioritária (LCP — só na 1ª seção). */
  eagerFirst?: boolean;
}

export function ProductCategorySection({
  title,
  sectionId,
  products,
  onAddClick,
  onDetailClick,
  eagerFirst = false,
}: ProductCategorySectionProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll, products.length]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section
      id={sectionId}
      className="px-4 pb-7 scroll-mt-64"
      aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-[1.35rem] font-bold text-[var(--brand-800)] leading-tight">
            {title}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-[3px] w-10 rounded-full bg-[var(--brand-700)]" />
            <span className="h-[3px] w-4 rounded-full bg-[var(--ring)]" />
            <span className="ml-1 text-xs font-semibold text-[var(--muted)]">
              {products.length} {products.length === 1 ? "item" : "itens"}
            </span>
          </div>
        </div>
      </div>
      {/* Mobile: carrossel horizontal */}
      <div className="relative lg:hidden">
        {canScrollLeft && (
          <>
            <div className="absolute -left-4 top-0 bottom-0 w-20 sm:w-28 bg-gradient-to-r from-[var(--page-bg)] via-[var(--page-bg)]/70 to-transparent z-[5] pointer-events-none" />
            <button
              onClick={() => scrollBy("left")}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-[0_8px_20px_-8px_rgba(43,21,20,0.5)] border border-[var(--rose-200)] text-[var(--brand-700)] hover:bg-[var(--brand-900)] hover:text-[var(--cream)] hover:border-[var(--brand-900)] transition-all"
              aria-label="Produtos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div className="absolute -right-4 top-0 bottom-0 w-20 sm:w-28 bg-gradient-to-l from-[var(--page-bg)] via-[var(--page-bg)]/70 to-transparent z-[5] pointer-events-none" />
            <button
              onClick={() => scrollBy("right")}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-[0_8px_20px_-8px_rgba(43,21,20,0.5)] border border-[var(--rose-200)] text-[var(--brand-700)] hover:bg-[var(--brand-900)] hover:text-[var(--cream)] hover:border-[var(--brand-900)] transition-all"
              aria-label="Próximos produtos"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-4 px-4"
          role="list"
          aria-label={`${title} - lista de produtos`}
        >
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddClick={onAddClick}
              onDetailClick={onDetailClick}
              priority={eagerFirst && idx === 0}
            />
          ))}
        </div>
      </div>
      {/* Desktop: grade responsiva (2 col. com sacola aberta, 3 em telas largas) */}
      <div
        className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4"
        role="list"
        aria-label={`${title} - grade de produtos`}
      >
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddClick={onAddClick}
            onDetailClick={onDetailClick}
            className="w-full sm:w-full"
            priority={eagerFirst && idx === 0}
          />
        ))}
      </div>
    </section>
  );
}
