"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryColor: "rose" | "red" | "green" | "amber";
  available?: boolean;
  ingredients?: string[];
}

interface AdminProductTableProps {
  products: AdminProduct[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onEdit?: (product: AdminProduct) => void;
  onDelete?: (product: AdminProduct) => void;
}

const categoryTagStyles: Record<string, string> = {
  rose: "bg-[var(--rose-100)] text-red-600",
  red: "bg-red-500 text-white",
  green: "bg-green-500 text-white",
  amber: "bg-amber-500 text-white",
};

export function AdminProductTable({
  products,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onEdit,
  onDelete,
}: AdminProductTableProps) {
  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const categories = React.useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, [products]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar Produto"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="hidden lg:grid grid-cols-[1fr_140px_100px_80px] gap-4 px-4 py-3 bg-gray-50 rounded-lg text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="space-y-3 lg:space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="lg:grid grid-cols-[1fr_140px_100px_80px] gap-4 items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--rose-50)] flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex lg:hidden items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                      categoryTagStyles[product.categoryColor]
                    )}
                  >
                    {product.category}
                  </span>
                  <span className="text-sm font-bold text-[var(--brand-800)]">
                    {formattedPrice(product.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                    aria-label={`Editar ${product.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(product)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                    aria-label={`Excluir ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:block">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                    categoryTagStyles[product.categoryColor]
                  )}
                >
                  {product.category}
                </span>
              </div>

              <div className="hidden lg:block">
                <span className="text-sm font-bold text-[var(--brand-800)]">
                  {formattedPrice(product.price)}
                </span>
              </div>

              <div className="hidden lg:flex items-center justify-center gap-2">
                <button
                  onClick={() => onEdit?.(product)}
                  className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete?.(product)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                  aria-label={`Excluir ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)] text-sm">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}