"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShoppingCart, ChefHat, CirclePlus, Sparkles, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "./ProductCard";
import { CartItem } from "@/lib/cart-context";
import { productBlurPlaceholder } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/price";

/** Complementos opcionais somados ao preço unitário no carrinho. */
const COMPLEMENTS = [
  { id: "cobertura", label: "Cobertura extra", price: 6 },
  { id: "morango", label: "Morango fresco", price: 8 },
  { id: "embalagem", label: "Embalagem presente", price: 5 },
  { id: "vela", label: "Vela de aniversário", price: 3 },
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, observations: string) => void;
  editItem?: CartItem | null;
  onSaveEdit?: (itemId: string, quantity: number, observations: string) => void;
}

function ProductModalContent({
  product,
  onClose,
  onAddToCart,
  editItem,
  onSaveEdit,
}: Omit<ProductModalProps, "isOpen">) {
  const [quantity, setQuantity] = React.useState(editItem?.quantity ?? 1);
  const [observations, setObservations] = React.useState(editItem?.observations ?? "");
  const [extras, setExtras] = React.useState<string[]>([]);
  const [zoomed, setZoomed] = React.useState(false);
  const [zoomOrigin, setZoomOrigin] = React.useState("50% 50%");

  const isEditing = !!editItem;
  const extrasTotal = extras.reduce(
    (sum, id) => sum + (COMPLEMENTS.find((c) => c.id === id)?.price ?? 0),
    0
  );
  const unitPrice = product ? round2(product.price + (isEditing ? 0 : extrasTotal)) : 0;

  const formattedPrice = product
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(product.price)
    : "";

  const subtotal = product
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(unitPrice * quantity)
    : "";

  const toggleExtra = (id: string) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleAddToCart = () => {
    if (product) {
      if (editItem && onSaveEdit) {
        onSaveEdit(editItem.id, quantity, observations);
      } else {
        const extrasLabels = extras
          .map((id) => COMPLEMENTS.find((c) => c.id === id)?.label)
          .filter(Boolean) as string[];
        const combinedObservations = [
          observations.trim(),
          extrasLabels.length > 0 ? `Complementos: ${extrasLabels.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" • ");
        onAddToCart({ ...product, price: unitPrice }, quantity, combinedObservations);
      }
      onClose();
    }
  };

  if (!product) return null;

  return (
      <DialogContent className="max-h-[90vh] max-w-lg p-0 overflow-hidden grid-rows-[auto_1fr] rounded-[var(--radius-card-lg)]">
      <DialogHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
        <DialogTitle className="font-display text-[1.35rem] font-bold text-[var(--brand-900)] leading-tight pr-8">
          {product.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes de {product.name}: escolha a quantidade e observações.
        </DialogDescription>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">{product.description || "Feito artesanalmente com ingredientes selecionados."}</p>
          <span className="font-display text-xl font-extrabold text-[var(--brand-800)] whitespace-nowrap rounded-full bg-[var(--rose-100)] px-3.5 py-1.5">
            {formattedPrice}
          </span>
        </div>
      </DialogHeader>
      <div className="p-4 sm:p-6 pt-4 overflow-y-auto space-y-6">
        <div
          className={cn(
            "relative w-full h-[210px] rounded-2xl overflow-hidden bg-[var(--rose-50)] ring-1 ring-[var(--rose-200)]",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={() => setZoomed((v) => !v)}
          onMouseMove={handleZoomMove}
          role="button"
          tabIndex={0}
          aria-label={zoomed ? "Reduzir foto do produto" : "Ampliar foto do produto"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setZoomed((v) => !v);
            }
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            placeholder="blur"
            blurDataURL={productBlurPlaceholder}
            className="object-cover transition-transform duration-300"
            style={{
              transform: zoomed ? "scale(1.9)" : "scale(1)",
              transformOrigin: zoomOrigin,
            }}
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--brand-900)]/25 to-transparent" />
          {!zoomed && (
            <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
              <ZoomIn className="h-3 w-3" />
              Toque para ampliar
            </span>
          )}
        </div>

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide">
              <ChefHat className="h-4 w-4" />
              INGREDIENTES
            </div>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--rose-100)] text-[var(--brand-700)] border border-[var(--rose-200)]"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide">
              <Sparkles className="h-4 w-4" />
              Complementos
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMPLEMENTS.map((c) => {
                const selected = extras.includes(c.id);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => toggleExtra(c.id)}
                      aria-pressed={selected}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm transition-all",
                        selected
                          ? "border-[var(--brand-700)] bg-[var(--rose-50)] shadow-sm"
                          : "border-[var(--rose-200)] bg-white hover:border-[var(--ring)]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                            selected
                              ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                              : "border-[var(--rose-200)] bg-white text-transparent"
                          )}
                        >
                          <Check className="h-3 w-3" strokeWidth={4} />
                        </span>
                        <span className="font-semibold text-[var(--ink)]">{c.label}</span>
                      </span>
                      <Price
                        value={c.price}
                        className="text-xs font-bold text-[var(--brand-800)] whitespace-nowrap"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide">
            <CirclePlus className="h-4 w-4" />
            Observações
          </div>          <Textarea
            placeholder="Exemplo: Sem cobertura"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="min-h-[80px] resize-none border-[var(--rose-200)] bg-white/90 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand-600)] focus:ring-[var(--brand-600)] rounded-xl"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed border-[var(--rose-200)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--brand-800)]">Quantidade</span>
            <div className="flex items-center border border-[var(--rose-200)] rounded-full overflow-hidden bg-white">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                className="h-10 w-10 text-[var(--brand-700)] hover:bg-[var(--rose-100)]"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-display text-lg font-bold text-[var(--ink)]">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                className="h-10 w-10 text-[var(--brand-700)] hover:bg-[var(--rose-100)]"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full h-12 text-[15px] font-bold rounded-full shadow-[0_10px_24px_-10px_rgba(116,49,45,0.7)]"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {editItem ? "SALVAR ALTERAÇÕES" : `ADICIONAR • ${subtotal}`}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[var(--muted)]">
          <span className="text-xs font-semibold uppercase tracking-widest">Subtotal</span>
          <span className="font-display text-2xl font-extrabold text-[var(--brand-800)]">
            {subtotal}
          </span>
        </div>
      </div>
    </DialogContent>
  );
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, editItem, onSaveEdit }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {product && <ProductModalContent key={editItem?.id ?? product.id} product={product} onClose={onClose} onAddToCart={onAddToCart} editItem={editItem} onSaveEdit={onSaveEdit} />}
    </Dialog>
  );
}
