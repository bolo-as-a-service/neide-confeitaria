"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Power, Trash2, Search } from "lucide-react";
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
  onToggle?: (product: AdminProduct) => void;
}

const categoryTagStyles: Record<string, string> = {
  rose: "bg-[var(--rose-100)] text-[var(--brand-800)] border border-[var(--rose-200)]",
  red: "bg-red-100 text-red-700 border border-red-200",
  green: "bg-green-100 text-green-800 border border-green-200",
  amber: "bg-amber-100 text-amber-800 border border-amber-200",
};

export function AdminProductTable({
  products,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onEdit,
  onDelete,
  onToggle,
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar bolo, doce..."
            className="w-full h-11 pl-11 pr-4 rounded-full border border-[var(--rose-200)] bg-white text-sm text-[var(--ink)] placeholder:text-[var(--muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--brand-600)]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="h-11 px-4 rounded-full border border-[var(--rose-200)] bg-white text-sm font-medium text-[var(--ink)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
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
        <div className="hidden lg:grid grid-cols-[1fr_140px_100px_80px] gap-4 px-4 py-3 bg-[var(--brand-900)] text-[var(--cream)] rounded-2xl text-xs font-bold uppercase tracking-widest mb-2">
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="space-y-3 lg:space-y-2.5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="lg:grid grid-cols-[1fr_140px_100px_80px] gap-4 items-center px-4 py-3 bg-white rounded-2xl shadow-[0_6px_20px_-12px_rgba(75,40,32,0.3)] border border-[var(--rose-200)] card-lift"
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

              <div className="flex lg:hidden flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-dashed border-[var(--rose-200)]">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                    categoryTagStyles[product.categoryColor]
                  )}
                >
                  {product.category}
                </span>
                {product.available === false && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                    Pausado
                  </span>
                )}
                <span className="text-sm font-bold text-[var(--brand-800)]">
                  {formattedPrice(product.price)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onToggle?.(product)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    product.available === false
                      ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                  aria-label={product.available === false ? `Ativar ${product.name}` : `Pausar ${product.name}`}
                  title={product.available === false ? "Ativar no cardápio" : "Pausar no cardápio"}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit?.(product)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete?.(product)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                  aria-label={`Excluir ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              </div>

            <div className="hidden lg:block">
              <span className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                    categoryTagStyles[product.categoryColor]
                  )}
                >
                  {product.category}
                </span>
                {product.available === false && (
                  <span className="inline-block px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-600">
                    Pausado
                  </span>
                )}
              </span>
            </div>

              <div className="hidden lg:block">
                <span className="text-sm font-bold text-[var(--brand-800)]">
                  {formattedPrice(product.price)}
                </span>
              </div>

            <div className="hidden lg:flex items-center justify-center gap-2">
              <button
                onClick={() => onToggle?.(product)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  product.available === false
                    ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                )}
                aria-label={product.available === false ? `Ativar ${product.name}` : `Pausar ${product.name}`}
                title={product.available === false ? "Ativar no cardápio" : "Pausar no cardápio"}
              >
                <Power className="h-4 w-4" />
              </button>
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