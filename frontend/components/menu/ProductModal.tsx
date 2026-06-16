"use client";

import * as React from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingCart, ChefHat, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "./ProductCard";
import { CartItem } from "@/lib/cart-context";

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
      }).format(product.price * quantity)
    : "";

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleAddToCart = () => {
    if (product) {
      if (editItem && onSaveEdit) {
        onSaveEdit(editItem.id, quantity, observations);
      } else {
        onAddToCart(product, quantity, observations);
      }
      onClose();
    }
  };

  if (!product) return null;

  return (
      <DialogContent className="max-h-[90vh] p-0 overflow-hidden grid-rows-[auto_1fr]">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle className="font-display text-xl font-bold text-[var(--ink)]">
          {product.name}
        </DialogTitle>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <p className="text-sm text-[var(--muted)] line-clamp-2">{product.description}</p>
          <span className="font-display text-xl font-extrabold text-[var(--brand-800)] whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>
      </DialogHeader>
      <div className="p-6 pt-4 overflow-y-auto space-y-6">
        <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-[var(--rose-50)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
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

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide">
            <CirclePlus className="h-4 w-4" />
            OBSERVAÇÕES
          </div>
          <Textarea
            placeholder="Exemplo: Sem cobertura"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="min-h-[80px] resize-none border-[var(--rose-200)] bg-white/90 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand-600)] focus:ring-[var(--brand-600)] rounded-xl"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--rose-200)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--muted)]">Quantidade</span>
            <div className="flex items-center border border-[var(--rose-200)] rounded-xl overflow-hidden">
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
          className="w-full h-12 text-lg font-semibold rounded-xl"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {editItem ? "SALVAR" : "ADICIONAR AO CARRINHO"}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[var(--muted)]">
          <span className="font-medium">SUBTOTAL:</span>
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
