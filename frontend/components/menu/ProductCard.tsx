"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  ingredients?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddClick: (product: Product) => void;
  onDetailClick?: (product: Product) => void;
}

export function ProductCard({ product, onAddClick, onDetailClick }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <article
      className={cn(
        "group relative flex-shrink-0 w-[200px] sm:w-[220px]",
        "bg-white rounded-2xl border border-[var(--rose-200)] shadow-sm",
        "overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1"
      )}
      onClick={() => onDetailClick?.(product)}
      style={{ cursor: onDetailClick ? "pointer" : "default" }}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--rose-50)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized={product.image.startsWith("http")}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-display text-sm font-semibold text-[var(--ink)] line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-extrabold text-[var(--brand-800)]">
            {formattedPrice}
          </span>
          <Button
            variant="default"
            size="sm"
            className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick(product);
            }}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar</span>
          </Button>
        </div>
      </div>
    </article>
  );
}