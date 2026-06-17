"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, Product } from "./ProductCard";

interface ProductCategorySectionProps {
  title: string;
  products: Product[];
  onAddClick: (product: Product) => void;
  onDetailClick?: (product: Product) => void;
}

export function ProductCategorySection({
  title,
  products,
  onAddClick,
  onDetailClick,
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
    <section className="px-4 pb-6" aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}>
      <h2 className="font-display text-xl font-bold text-[var(--brand-800)] mb-4">
        {title}
      </h2>
      <div className="relative">
        {canScrollLeft && (
          <>
            <div className="absolute -left-4 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[var(--page-bg)] to-transparent z-[5] pointer-events-none" />
            <button
              onClick={() => scrollBy("left")}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md border border-[var(--rose-200)] text-[var(--brand-700)] hover:bg-white hover:text-[var(--brand-800)] transition-all"
              aria-label="Produtos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div className="absolute -right-4 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[var(--page-bg)] to-transparent z-[5] pointer-events-none" />
            <button
              onClick={() => scrollBy("right")}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md border border-[var(--rose-200)] text-[var(--brand-700)] hover:bg-white hover:text-[var(--brand-800)] transition-all"
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddClick={onAddClick}
              onDetailClick={onDetailClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
