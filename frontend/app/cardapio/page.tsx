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
import { Product } from "@/components/menu/ProductCard";
import { useCart, CartItem } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { BackendCategory, BackendProduct } from "@/lib/types";

const CATEGORY_ICONS: Record<string, { label: string; icon: string }> = {
  "caseiro": { label: "Caseiro", icon: "CakeSlice" },
  "diet": { label: "Diet", icon: "Leaf" },
  "vulc\u00e3o": { label: "Vulc\u00e3o", icon: "Flame" },
  "bolo": { label: "Bolo", icon: "CakeSlice" },
  "salgado": { label: "Salgado", icon: "ChefHat" },
  "pudim": { label: "Pudim", icon: "CupSoda" },
  "cesta": { label: "Cesta", icon: "ShoppingBasket" },
  "congelado": { label: "Congelado", icon: "Snowflake" },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function mapProduct(p: BackendProduct): Product {
  const categoryName = p.category?.name?.toLowerCase().replace(/\s+/g, "-") || "outros";
  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    image: p.imageUrl ? `${API_BASE}${p.imageUrl}` : "/bolo.webp",
    category: categoryName,
    description: p.description,
    ingredients: p.ingredients,
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
  const { items, addItem, updateQuantity, removeItem } = useCart();

  React.useEffect(() => {
    async function load() {
      try {
        const [categories, products] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);
        setBackendCategories(categories);
        setBackendProducts(products);
      } catch (err) {
        console.error("Failed to load menu data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const frontendCategories = React.useMemo(() => {
    if (backendCategories.length > 0) {
      return backendCategories.map((cat) => {
        const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
        const preset = CATEGORY_ICONS[slug];
        return {
          id: slug,
          label: preset?.label || cat.name,
        };
      });
    }
    return Object.entries(CATEGORY_ICONS).map(([id, val]) => ({
      id,
      label: val.label,
    }));
  }, [backendCategories]);

  const productsByCategory = React.useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    const categories = frontendCategories.length > 0 ? frontendCategories : Object.entries(CATEGORY_ICONS).map(([id, val]) => ({ id, label: val.label }));
    categories.forEach((cat) => {
      grouped[cat.id] = [];
    });
    backendProducts.forEach((p) => {
      const categoryName = p.category?.name?.toLowerCase().replace(/\s+/g, "-") || "outros";
      if (grouped[categoryName]) {
        grouped[categoryName].push(mapProduct(p));
      } else {
        if (!grouped["outros"]) grouped["outros"] = [];
        grouped["outros"].push(mapProduct(p));
      }
    });
    return grouped;
  }, [backendProducts, frontendCategories]);

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
      <div className="min-h-screen bg-[var(--page-bg)] font-body flex items-center justify-center">
        <div className="text-[var(--brand-700)] text-lg font-display">Carregando cardápio...</div>
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

            {(activeCategory === "todos" ? frontendCategories : frontendCategories.filter((cat) => cat.id === activeCategory))
              .map((category) => {
                const products = productsByCategory[category.id] || [];
                if (products.length === 0) return null;
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
          </div>
        </div>

        <ShoppingCartSidebar
          items={items}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onEditItem={(item: CartItem) => setSelectedProduct(item.product)}
          onCheckout={handleCheckout}
        />
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
}
