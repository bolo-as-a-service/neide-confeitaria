"use client";

import * as React from "react";
import Image from "next/image";
import { cn, productBlurPlaceholder } from "@/lib/utils";
import { FALLBACK_IMAGE, categoryImageSrc } from "@/lib/product-image";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  ingredients?: string[];
  available: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddClick: (product: Product) => void;
  onDetailClick?: (product: Product) => void;
  className?: string;
  /** Marca a imagem como prioritária (LCP — só o 1º card da página). */
  priority?: boolean;
}

export function ProductCard({ product, onAddClick, onDetailClick, className, priority = false }: ProductCardProps) {
  const [imgSrc, setImgSrc] = React.useState(product.image);

  return (
    <article
      className={cn(
        "group relative w-[208px] sm:w-[228px] flex-shrink-0",
        "bg-white rounded-[var(--radius-card)] border border-[var(--rose-200)] shadow-[0_4px_20px_-8px_rgba(75,40,32,0.18)]",
        "overflow-hidden transition-all duration-300",
        "hover:shadow-[0_16px_36px_-12px_rgba(75,40,32,0.32)] hover:-translate-y-1 hover:border-[var(--ring)]",
        onDetailClick && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className
      )}
      onClick={() => onDetailClick?.(product)}
      onKeyDown={(e) => {
        if (onDetailClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onDetailClick(product);
        }
      }}
      role={onDetailClick ? "button" : undefined}
      tabIndex={onDetailClick ? 0 : undefined}
      aria-label={onDetailClick ? `Ver detalhes de ${product.name}` : undefined}
      style={{ cursor: onDetailClick ? "pointer" : "default" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--rose-50)]">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          placeholder="blur"
          blurDataURL={productBlurPlaceholder}
          onError={() => {
            const categoryFallback = categoryImageSrc(product.category);
            if (imgSrc !== categoryFallback) {
              setImgSrc(categoryFallback);
            } else if (imgSrc !== FALLBACK_IMAGE) {
              setImgSrc(FALLBACK_IMAGE);
            }
          }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 208px, (max-width: 1024px) 228px, 320px"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-800)] shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="p-3.5 space-y-1.5">
        <h3 className="font-display text-[15px] font-semibold text-[var(--ink)] line-clamp-1 leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-[var(--muted)] line-clamp-1 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <Price
            value={product.price}
            className="font-display text-lg font-extrabold text-[var(--brand-800)] tracking-tight"
          />
          <Button
            variant="default"
            size="sm"
            className="h-9 px-3.5 gap-1.5 text-xs font-bold rounded-full shadow-[0_6px_16px_-8px_rgba(116,49,45,0.7)] hover:shadow-[0_10px_20px_-8px_rgba(116,49,45,0.8)] hover:-translate-y-px active:translate-y-0 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick(product);
            }}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            <span>Adicionar</span>
          </Button>
        </div>
      </div>
    </article>
  );
}