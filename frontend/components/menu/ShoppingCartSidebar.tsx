"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Edit, ShoppingBag, ChevronRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { FreeShippingProgress } from "@/components/menu/FreeShippingProgress";
import { CartItem } from "@/lib/cart-context";
import { Product } from "@/components/menu/ProductCard";

export type { CartItem };

interface ShoppingCartSidebarProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEditItem: (item: CartItem) => void;
  onCheckout: () => void;
  suggestions?: Product[];
  onQuickAdd?: (product: Product) => void;
}

export function ShoppingCartSidebar({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onEditItem,
  onCheckout,
  suggestions = [],
  onQuickAdd,
}: ShoppingCartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Trava o scroll da página atrás da sacola (só no mobile, onde ela é overlay).
  React.useEffect(() => {
    if (!isOpen) return;
    if (!window.matchMedia("(max-width: 1023.5px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[var(--brand-900)]/45 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.aside
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className={cn(
            "fixed inset-y-0 right-0 h-dvh w-full max-w-sm bg-[#fffdfc] shadow-2xl z-50",
            "flex flex-col",
            "lg:sticky lg:top-[124px] lg:h-[calc(100dvh-140px)] lg:shrink-0 lg:max-w-[380px] lg:shadow-[0_16px_40px_-16px_rgba(75,40,32,0.35)] lg:rounded-[var(--radius-card-lg)] lg:border lg:border-[var(--rose-200)] lg:overflow-hidden"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--rose-200)] bg-[var(--rose-50)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-900)] texture-sprinkles flex items-center justify-center shadow-sm">
                <ShoppingBag className="h-5 w-5 text-[var(--cream)]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--brand-900)] leading-tight">Sua sacola</h2>
                <p className="text-xs text-[var(--muted)]">{totalItems} {totalItems === 1 ? "doce" : "doces"} selecionados</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--rose-100)] hover:text-[var(--ink)]"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center px-6">
              <div className="w-20 h-20 rounded-full bg-[var(--rose-100)] flex items-center justify-center mb-4">
                <ShoppingBag className="h-9 w-9 text-[var(--brand-700)]" />
              </div>
              <p className="font-display text-lg font-bold text-[var(--brand-900)]">Sacola vazia</p>
              <p className="text-sm text-[var(--muted)] mt-1">Que tal um bolo quentinho para começar?</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-[var(--rose-200)] shadow-[0_4px_16px_-8px_rgba(75,40,32,0.2)] card-lift"
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
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">
                        <Price value={item.product.price * item.quantity} />
                      </p>
                      {item.observations && (
                        <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1 italic">
                          {item.observations}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[var(--rose-200)] rounded-full overflow-hidden bg-[var(--rose-50)]/60">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-9 w-9 text-[var(--brand-700)] hover:bg-[var(--rose-100)] disabled:opacity-50 rounded-full"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center font-display text-sm font-bold text-[var(--ink)]">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-9 w-9 text-[var(--brand-700)] hover:bg-[var(--rose-100)] rounded-full"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditItem(item)}
                          className="h-9 px-3 gap-1.5 text-xs text-[var(--brand-700)] hover:bg-[var(--rose-100)]"
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

              <FreeShippingProgress subtotal={total} />

              {suggestions.length > 0 && onQuickAdd && (
                <div className="rounded-2xl border border-dashed border-[var(--ring)] bg-white p-3">
                  <p className="font-script text-xl leading-none text-[var(--brand-700)]">
                    complete com...
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center gap-2.5"
                      >
                        <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-[var(--rose-50)] shrink-0">
                          <Image
                            src={s.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block truncate text-xs font-bold text-[var(--ink)]">
                            {s.name}
                          </span>
                          <Price
                            value={s.price}
                            className="block text-xs font-semibold text-[var(--brand-800)]"
                          />
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onQuickAdd(s)}
                          className="h-9 w-9 shrink-0 rounded-full px-0 text-xs font-bold"
                          aria-label={`Adicionar ${s.name} à sacola`}
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl bg-[var(--brand-900)] text-[var(--cream)] p-4 space-y-2 texture-sprinkles">
                <div className="flex justify-between text-sm text-[var(--rose-100)]">
                  <span>Subtotal</span>
                  <Price value={total} className="font-semibold text-white" />
                </div>
                <div className="flex justify-between text-sm text-[var(--rose-100)]">
                  <span>Entrega</span>
                  <span className="font-medium">no checkout</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-white/15 pt-2.5">
                  <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                  <Price value={total} className="font-display text-xl font-extrabold" />
                </div>
                <p className="text-[11px] text-[var(--rose-200)]/80">
                  Taxa de entrega calculada no checkout.
                </p>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--rose-200)] bg-white">
            <Button
              onClick={onCheckout}
              className="w-full h-12 text-[15px] font-bold rounded-full shadow-[0_10px_24px_-10px_rgba(116,49,45,0.7)]"
              size="lg"
              disabled={items.length === 0}
            >
              Finalizar pedido
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        </motion.aside>
      </>
    </AnimatePresence>
  );
}