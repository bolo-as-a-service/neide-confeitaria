"use client";

import * as React from "react";
import { toast } from "sonner";
import { Product } from "@/components/menu/ProductCard";
import { formatBRL } from "@/components/ui/price";
import {
  CartItem,
  loadStoredCart,
  mergeAddItem,
  saveStoredCart,
} from "@/lib/cart-store";

export type { CartItem };

interface AddItemOptions {
  /** Não exibe o toast (ex.: mobile abre a sacola como feedback). */
  silent?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    observations?: string,
    opts?: AddItemOptions
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  updateItem: (itemId: string, quantity: number, observations: string) => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  // Espelho síncrono para o "Desfazer" do toast (snapshot anterior ao add).
  const itemsRef = React.useRef<CartItem[]>([]);

  // Hidrata do localStorage uma vez (fora do corpo síncrono do efeito).
  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = loadStoredCart();
      itemsRef.current = stored;
      setItems(stored);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persiste a cada mudança após a hidratação.
  React.useEffect(() => {
    if (!hydrated) return;
    itemsRef.current = items;
    saveStoredCart(items);
  }, [items, hydrated]);

   const addItem = React.useCallback((
     product: Product,
     quantity: number = 1,
     observations: string = "",
     opts?: AddItemOptions,
   ) => {
     const previous = itemsRef.current;
     const next = mergeAddItem(previous, product, quantity, observations);
     itemsRef.current = next;
     setItems(next);
     if (opts?.silent) return;
     const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
     toast.success("Adicionado à sacola", {
       description: (
         <span className="flex items-center gap-2.5">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img
             src={product.image}
             alt=""
             className="h-10 w-10 rounded-xl object-cover border border-[var(--rose-200)]"
           />
           <span>
             {safeQuantity}x {product.name} • {formatBRL(product.price * safeQuantity)}
           </span>
         </span>
       ),
       action: {
         label: "Desfazer",
         onClick: () => {
           itemsRef.current = previous;
           setItems(previous);
         },
       },
       duration: 4000,
     });
   }, []);

   const updateQuantity = React.useCallback((itemId: string, quantity: number) => {
     if (quantity <= 0) {
       setItems((prev) => prev.filter((item) => item.id !== itemId));
     } else {
       setItems((prev) =>
         prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
       );
     }
   }, []);

   const removeItem = React.useCallback((itemId: string) => {
     setItems((prev) => prev.filter((item) => item.id !== itemId));
   }, []);

    const clearCart = React.useCallback(() => setItems([]), []);

    const updateItem = React.useCallback((itemId: string, quantity: number, observations: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity, observations } : item
        )
      );
    }, []);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, updateItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
