"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/menu/Header";
import { CategoryTabs, Category } from "@/components/menu/CategoryTabs";
import { SearchBar } from "@/components/menu/SearchBar";
import { ProductCategorySection } from "@/components/menu/ProductCategorySection";
import { ProductModal } from "@/components/menu/ProductModal";
import { ShoppingCartSidebar } from "@/components/menu/ShoppingCartSidebar";
import { Footer } from "@/components/menu/Footer";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Product } from "@/components/menu/ProductCard";
import { useCart, CartItem } from "@/lib/cart-context";
import { cn, normalizeSearchText, slugifyCategory } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-image";
import { api } from "@/lib/api";
import type { BackendCategory, BackendProduct } from "@/lib/types";

const CATEGORY_ICONS: Record<string, { label: string; icon: string }> = {
  "caseiro": { label: "Caseiro", icon: "CakeSlice" },
  "diet": { label: "Diet", icon: "Leaf" },
  "vulcao": { label: "Vulcão", icon: "Flame" },
  "bolo": { label: "Bolo", icon: "CakeSlice" },
  "salgado": { label: "Salgado", icon: "ChefHat" },
  "pudim": { label: "Pudim", icon: "CupSoda" },
  "cesta": { label: "Cesta", icon: "ShoppingBasket" },
  "congelado": { label: "Congelado", icon: "Snowflake" },
  "outros": { label: "Outros", icon: "Utensils" },
};

function mapProduct(p: BackendProduct): Product {
  const categoryName = slugifyCategory(p.category?.name);
  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    image: productImageSrc(p),
    category: categoryName,
    description: p.description,
    ingredients: p.ingredients,
    available: p.available,
  };
}

export default function CardapioPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = React.useState("todos");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cartOpen, setCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [backendCategories, setBackendCategories] = React.useState<BackendCategory[]>([]);
  const [backendProducts, setBackendProducts] = React.useState<BackendProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const { items, addItem, updateItem, updateQuantity, removeItem } = useCart();
  const [editItem, setEditItem] = React.useState<CartItem | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [categories, products] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setBackendCategories(categories);
      setBackendProducts(products);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erro ao carregar cardápio");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Produtos visíveis: esconde indisponíveis e aplica a busca (insensível
  // a acentos e caixa) sobre nome, descrição e ingredientes.
  const visibleProducts = React.useMemo(() => {
    const sellable = backendProducts.filter((p) => p.available);
    const q = normalizeSearchText(searchQuery.trim());
    if (!q) return sellable;
    const tokens = q.split(/\s+/).filter(Boolean);
    return sellable.filter((p) => {
      const haystack = normalizeSearchText(
        `${p.name} ${p.description ?? ""} ${(p.ingredients ?? []).join(" ")}`
      );
      return tokens.every((token) => haystack.includes(token));
    });
  }, [backendProducts, searchQuery]);

  const searching = searchQuery.trim().length > 0;

  // Agrupa os produtos visíveis: slugs conhecidos (backend + presets) vão
  // para a própria seção; qualquer categoria nova/não listada cai no
  // bucket "outros" — nenhum produto some do cardápio.
  const productsByCategory = React.useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    const knownSlugs = new Set<string>([
      ...backendCategories.map((cat) => slugifyCategory(cat.name)),
      ...Object.keys(CATEGORY_ICONS),
    ]);
    visibleProducts.forEach((p) => {
      const slug = slugifyCategory(p.category?.name);
      const bucket = knownSlugs.has(slug) ? slug : "outros";
      if (!grouped[bucket]) grouped[bucket] = [];
      grouped[bucket].push(mapProduct(p));
    });
    return grouped;
  }, [visibleProducts, backendCategories]);

  const frontendCategories = React.useMemo(() => {
    if (backendCategories.length > 0) {
      const mapped = backendCategories.map((cat) => {
        const slug = slugifyCategory(cat.name);
        const preset = CATEGORY_ICONS[slug];
        return {
          id: slug,
          label: preset?.label || cat.name,
        };
      });
      // Garante a seção "Outros" sempre que o bucket de fallback tem itens
      // (sem categoria, categoria nova ou não listada pelo backend).
      const hasFallback =
        (productsByCategory["outros"]?.length ?? 0) > 0;
      if (hasFallback && !mapped.some((c) => c.id === "outros")) {
        mapped.push({ id: "outros", label: CATEGORY_ICONS["outros"].label });
      }
      return mapped;
    }
    return Object.entries(CATEGORY_ICONS).map(([id, val]) => ({
      id,
      label: val.label,
    }));
  }, [backendCategories, productsByCategory]);

  const visibleCategoryIds = React.useMemo(
    () =>
      (activeCategory === "todos"
        ? frontendCategories
        : frontendCategories.filter((cat) => cat.id === activeCategory)
      ).filter((category) => (productsByCategory[category.id]?.length ?? 0) > 0),
    [frontendCategories, activeCategory, productsByCategory]
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
    if (isMobile) setCartOpen(true);
  };

  const handleAddToCartFromModal = (product: Product, quantity: number, observations: string) => {
    addItem(product, quantity, observations);
  };

  const handleCheckout = () => {
    router.push("/carrinho");
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] font-body">
        <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <main className="flex flex-1 w-full max-w-full lg:max-w-[85%] mx-auto">
          <div className="flex-1 min-w-0">
            <div className="max-w-[1020px] mx-auto px-4 sm:px-6 pb-12 pt-6 space-y-6">
              <div className="flex gap-3 overflow-hidden px-4 pb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[104px] min-w-[90px] rounded-2xl" />
                ))}
              </div>
              <Skeleton className="mx-4 h-12 rounded-full" />
              <ProductGridSkeleton count={8} />
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] font-body">
        <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <main className="max-w-[1020px] mx-auto px-4 sm:px-6 pb-12">
          <ErrorState
            title="Não foi possível carregar o cardápio"
            message={loadError}
            onRetry={load}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main className="flex flex-1 w-full max-w-full lg:max-w-[85%] mx-auto">
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-w-0",
          cartOpen ? "lg:max-w-[calc(100%-380px)] lg:px-4" : "lg:pr-4"
        )}>
          <div className="max-w-[1020px] mx-auto px-4 sm:px-6 pb-12">
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} categories={frontendCategories as Category[]} />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {visibleCategoryIds.map((category) => {
              const products = productsByCategory[category.id] || [];
              return (
                <ProductCategorySection
                  key={category.id}
                  title={category.label}
                  products={products}
                  onAddClick={handleAddToCart}
                  onDetailClick={setSelectedProduct}
                />
              );
            })}
            {visibleCategoryIds.length === 0 && (
              <div className="px-4 py-16 text-center">
                <p className="font-display text-lg font-bold text-[var(--brand-800)]">
                  Nenhum produto encontrado
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {searching
                    ? `Sem resultados para "${searchQuery.trim()}". Tente outro termo ou categoria.`
                    : "Ainda não há produtos nesta categoria."}
                </p>
                {searching && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("todos");
                    }}
                    className="mt-4 text-sm font-semibold text-[var(--brand-700)] underline underline-offset-2 hover:text-[var(--brand-800)]"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <ShoppingCartSidebar
          items={items}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
            onEditItem={(item: CartItem) => setEditItem(item)}
          onCheckout={handleCheckout}
        />
      </main>

      <Footer />

      <ProductModal
        product={editItem?.product ?? selectedProduct}
        isOpen={!!selectedProduct || !!editItem}
        onClose={() => {
          setSelectedProduct(null);
          setEditItem(null);
        }}
        onAddToCart={handleAddToCartFromModal}
        editItem={editItem}
        onSaveEdit={(itemId, quantity, observations) => {
          updateItem(itemId, quantity, observations);
          setEditItem(null);
        }}
      />
    </div>
  );
}
