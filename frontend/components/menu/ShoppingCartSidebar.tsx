"use client";

import * as React from "react";
import Image from "next/image";
import { X, Trash2, Edit, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Product } from "./ProductCard";
import { CartItem } from "@/lib/cart-context";

export type { CartItem };

interface ShoppingCartSidebarProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEditItem: (item: CartItem) => void;
  onCheckout: () => void;
}

export function ShoppingCartSidebar({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onEditItem,
  onCheckout,
}: ShoppingCartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

  const formattedItemTotal = (price: number, quantity: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price * quantity);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50",
          "flex flex-col transition-transform duration-300",
          "lg:relative lg:shrink-0 lg:max-w-[380px] lg:shadow-lg lg:rounded-2xl lg:border lg:border-[var(--rose-200)]"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--rose-200)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-700)] flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-[var(--cream)]" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--ink)]">Carrinho</h2>
              <p className="text-xs text-[var(--muted)]">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--rose-100)] transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <ShoppingBag className="h-12 w-12 text-[var(--muted)] mb-4" />
              <p className="text-[var(--muted)]">Seu carrinho está vazio</p>
              <p className="text-xs text-[var(--muted)] mt-1">Adicione produtos para começar seu pedido</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--rose-50)] rounded-xl p-3 border border-[var(--rose-200)]"
                >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-semibold text-[var(--ink)] line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 rounded-full text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">
                        {formattedItemTotal(item.product.price, item.quantity)}
                      </p>
                      {item.observations && (
                        <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1 italic">
                          {item.observations}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[var(--rose-200)] rounded-lg overflow-hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 text-[var(--brand-700)] hover:bg-[var(--rose-100)] disabled:opacity-50"
                            aria-label="Diminuir quantidade"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-10 text-center font-display text-sm font-bold text-[var(--ink)]">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 text-[var(--brand-700)] hover:bg-[var(--rose-100)]"
                            aria-label="Aumentar quantidade"
                          >
                            <span className="text-lg leading-none">+</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditItem(item)}
                          className="h-8 px-3 gap-1.5 text-xs text-[var(--brand-700)] hover:bg-[var(--rose-100)]"
                          aria-label="Editar item"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-[var(--rose-200)] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Subtotal</span>
                  <span className="font-medium text-[var(--ink)]">{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Entrega</span>
                  <span className="font-medium text-[var(--ink)]">A calcular</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--brand-800)] border-t border-[var(--rose-200)] pt-3">
                  <span>TOTAL</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--rose-200)] bg-white/95 backdrop-blur-sm">
            <Button
              onClick={onCheckout}
              className="w-full h-12 text-lg font-semibold rounded-xl"
              size="lg"
              disabled={items.length === 0}
            >
              Finalizar pedido
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}