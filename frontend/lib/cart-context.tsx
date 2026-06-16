"use client";

import * as React from "react";
import { Product } from "@/components/menu/ProductCard";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  observations: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, observations?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  updateItem: (itemId: string, quantity: number, observations: string) => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

   const addItem = React.useCallback((product: Product, quantity: number = 1, observations: string = "") => {
     setItems((prev) => {
       const existing = prev.find((item) => item.product.id === product.id);
       if (existing) {
         return prev.map((item) =>
           item.product.id === product.id
             ? { ...item, quantity: item.quantity + quantity, observations }
             : item
         );
       }
       return [...prev, { id: `${product.id}-${Date.now()}`, product, quantity, observations }];
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
