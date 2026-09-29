import type { Product } from "@/components/menu/ProductCard";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  observations: string;
}

export const CART_STORAGE_KEY = "neide_cart_v1";

/** Normaliza observação para comparação (trim; vazio vira ""). */
export function normalizeObservations(observations?: string | null): string {
  return (observations ?? "").trim();
}

function newCartItem(product: Product, quantity: number, observations: string): CartItem {
  const normalized = normalizeObservations(observations);
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  return {
    // Sufixo aleatório: dois adds do mesmo produto+observação no mesmo ms
    // não podem colidir.
    id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    product,
    quantity: safeQuantity,
    observations: normalized,
  };
}

/**
 * Adiciona item ao carrinho sem perder observações (issue #19).
 * - Mesmo produto + mesma observação (normalizada) → soma quantidade.
 * - Mesmo produto + observação diferente → cria nova linha (não sobrescreve).
 */
export function mergeAddItem(
  prev: CartItem[],
  product: Product,
  quantity: number = 1,
  observations: string = ""
): CartItem[] {
  const normalized = normalizeObservations(observations);
  const index = prev.findIndex(
    (item) =>
      item.product.id === product.id &&
      normalizeObservations(item.observations) === normalized
  );
  if (index === -1) {
    return [...prev, newCartItem(product, quantity, normalized)];
  }
  return prev.map((item, i) =>
    i === index ? { ...item, quantity: item.quantity + Math.max(1, Math.floor(quantity) || 1) } : item
  );
}

function isValidStoredItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || typeof item.quantity !== "number") return false;
  if (!Number.isFinite(item.quantity) || item.quantity <= 0) return false;
  const product = item.product as Record<string, unknown> | undefined;
  if (typeof product !== "object" || product === null) return false;
  if (typeof product.id !== "string" && typeof product.id !== "number") return false;
  if (typeof product.name !== "string" || typeof product.price !== "number") return false;
  return true;
}

/** Hidrata o carrinho do localStorage (valida e descarta entradas corruptas). */
export function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidStoredItem)
      .map((item) => ({
        ...item,
        quantity: Math.floor(item.quantity),
        observations: normalizeObservations(item.observations),
      }));
  } catch {
    return [];
  }
}

/** Persiste o carrinho no localStorage (falha silenciosa: ex. modo privado). */
export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota excedida ou storage indisponível: carrinho segue em memória.
  }
}
