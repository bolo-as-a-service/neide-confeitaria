import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CART_STORAGE_KEY,
  loadStoredCart,
  mergeAddItem,
  normalizeObservations,
  saveStoredCart,
  type CartItem,
} from "./cart-store";
import type { Product } from "@/components/menu/ProductCard";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "1",
    name: "Bolo de Cenoura",
    price: 39.9,
    image: "/bolo.webp",
    category: "caseiro",
    ...overrides,
  };
}

function memoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => void store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  };
}

describe("normalizeObservations", () => {
  it("trata undefined/null como vazio e aplica trim", () => {
    expect(normalizeObservations(undefined)).toBe("");
    expect(normalizeObservations(null)).toBe("");
    expect(normalizeObservations("  sem cobertura  ")).toBe("sem cobertura");
  });
});

describe("mergeAddItem (issue #19)", () => {
  it("cria nova linha quando não há item igual", () => {
    const result = mergeAddItem([], makeProduct(), 2, "sem cobertura");
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
    expect(result[0].observations).toBe("sem cobertura");
  });

  it("soma quantidade quando produto + observação são iguais", () => {
    const first = mergeAddItem([], makeProduct(), 1, "sem cobertura");
    const second = mergeAddItem(first, makeProduct(), 2, "  sem cobertura ");
    expect(second).toHaveLength(1);
    expect(second[0].quantity).toBe(3);
  });

  it("não sobrescreve: cria nova linha quando a observação difere", () => {
    const first = mergeAddItem([], makeProduct(), 1, "sem cobertura");
    const second = mergeAddItem(first, makeProduct(), 1, "com morango");
    expect(second).toHaveLength(2);
    expect(second[0].observations).toBe("sem cobertura");
    expect(second[0].quantity).toBe(1);
    expect(second[1].observations).toBe("com morango");
    expect(second.map((i) => i.id)).toHaveLength(new Set(second.map((i) => i.id)).size);
  });
});

describe("persistência localStorage (issue #19)", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });
  });

  it("salva e hidrata o carrinho (sobrevive ao F5)", () => {
    const items: CartItem[] = mergeAddItem([], makeProduct(), 2, "fatia generosa");
    saveStoredCart(items);
    const raw = globalThis.localStorage.getItem(CART_STORAGE_KEY);
    expect(raw).toContain("fatia generosa");
    expect(loadStoredCart()).toEqual(items);
  });

  it("retorna [] com JSON corrompido ou formato inesperado", () => {
    globalThis.localStorage.setItem(CART_STORAGE_KEY, "não-é-json{");
    expect(loadStoredCart()).toEqual([]);
    globalThis.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }));
    expect(loadStoredCart()).toEqual([]);
  });

  it("descarta linhas inválidas e normaliza as válidas", () => {
    globalThis.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        { id: "x", product: { id: "1", name: "Bolo", price: 10 }, quantity: 2.7, observations: "  ok " },
        { id: "bad", quantity: -1 },
        null,
      ])
    );
    const loaded = loadStoredCart();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].quantity).toBe(2);
    expect(loaded[0].observations).toBe("ok");
  });
});
