"use client";

import * as React from "react";
import { Header } from "@/components/menu/Header";
import { CategoryTabs, CATEGORIES } from "@/components/menu/CategoryTabs";
import { SearchBar } from "@/components/menu/SearchBar";
import { ProductCategorySection } from "@/components/menu/ProductCategorySection";
import { ProductModal } from "@/components/menu/ProductModal";
import { ShoppingCartSidebar, CartItem } from "@/components/menu/ShoppingCartSidebar";
import { Product } from "@/components/menu/ProductCard";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Bolo de chocolate", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de chocolate cremoso c/ cobertura de chocolate / 18cm x 6cm, com recheio", ingredients: ["Ovo", "Leite", "Chocolate", "Trigo"] },
  { id: "2", name: "Bolo morango", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de morango fresquinho c/ cobertura de chocolate branco / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Morango", "Trigo"] },
  { id: "3", name: "Bolo coco", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de coco úmido c/ cobertura de leite condensado / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Coco", "Trigo"] },
  { id: "4", name: "Bolo de maracujá", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de maracujá azedinho c/ cobertura de chocolate / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Maracujá", "Trigo"] },
  { id: "5", name: "Bolo vulcão 1", price: 70, image: "/bolo.webp", category: "bolos-vulcao", description: "Bolo vulcão de chocolate c/ recheio cremoso / 20cm", ingredients: ["Ovo", "Leite", "Chocolate", "Trigo"] },
  { id: "20", name: "Bolo de chocolate", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de chocolate cremoso c/ cobertura de chocolate / 18cm x 6cm, com recheio", ingredients: ["Ovo", "Leite", "Chocolate", "Trigo"] },
  { id: "21", name: "Bolo morango", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de morango fresquinho c/ cobertura de chocolate branco / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Morango", "Trigo"] },
  { id: "22", name: "Bolo coco", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de coco úmido c/ cobertura de leite condensado / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Coco", "Trigo"] },
  { id: "23", name: "Bolo de maracujá", price: 70, image: "/bolo.webp", category: "bolos-cobertura", description: "Bolo de maracujá azedinho c/ cobertura de chocolate / 18cm x 6cm", ingredients: ["Ovo", "Leite", "Maracujá", "Trigo"] },
  { id: "24", name: "Bolo vulcão 1", price: 70, image: "/bolo.webp", category: "bolos-vulcao", description: "Bolo vulcão de chocolate c/ recheio cremoso / 20cm", ingredients: ["Ovo", "Leite", "Chocolate", "Trigo"] },
  { id: "25", name: "Bolo vulcão 2", price: 70, image: "/bolo.webp", category: "bolos-vulcao", description: "Bolo vulcão de doce de leite c/ recheio cremoso / 20cm", ingredients: ["Ovo", "Leite", "Doce de leite", "Trigo"] },
  { id: "7", name: "Bolo vulcão 3", price: 70, image: "/bolo.webp", category: "bolos-vulcao", description: "Bolo vulcão de nutella c/ recheio cremoso / 20cm", ingredients: ["Ovo", "Leite", "Nutella", "Trigo"] },
  { id: "8", name: "Bolo vulcão 4", price: 70, image: "/bolo.webp", category: "bolos-vulcao", description: "Bolo vulcão de brigadeiro c/ recheio cremoso / 20cm", ingredients: ["Ovo", "Leite", "Brigadeiro", "Trigo"] },
  { id: "9", name: "Mini Esfihas", price: 70, image: "/bolo.webp", category: "salgados", description: "Kit com 20 mini esfihas de carne / frango / queijo", ingredients: ["Trigo", "Carne", "Frango", "Queijo"] },
  { id: "10", name: "Mini Coxinhas", price: 70, image: "/bolo.webp", category: "salgados", description: "Kit com 20 mini coxinhas de frango c/ catupiry", ingredients: ["Trigo", "Frango", "Catupiry", "Batata"] },
  { id: "11", name: "Sortidos", price: 70, image: "/bolo.webp", category: "salgados", description: "Kit sortido c/ 30 salgadinhos variados (coxinha, risole, bolinha de queijo, enfihas)", ingredients: ["Trigo", "Carne", "Frango", "Queijo", "Presunto"] },
  { id: "12", name: "Bolo fit banana", price: 65, image: "/bolo.webp", category: "bolos-fit", description: "Bolo integral de banana sem açúcar / 18cm x 6cm", ingredients: ["Banana", "Aveia", "Ovo", "Canela"] },
  { id: "13", name: "Bolo fit cenoura", price: 65, image: "/bolo.webp", category: "bolos-fit", description: "Bolo integral de cenoura c/ cobertura de cacau 70% / 18cm x 6cm", ingredients: ["Cenoura", "Aveia", "Ovo", "Cacau"] },
  { id: "14", name: "Pudim de leite", price: 45, image: "/bolo.webp", category: "pudins", description: "Pudim de leite condensado tradicional / 500g", ingredients: ["Leite condensado", "Leite", "Ovo", "Açúcar"] },
  { id: "15", name: "Pudim de chocolate", price: 50, image: "/bolo.webp", category: "pudins", description: "Pudim de chocolate meio amargo / 500g", ingredients: ["Leite condensado", "Leite", "Ovo", "Chocolate"] },
  { id: "16", name: "Cesta café da manhã", price: 120, image: "/bolo.webp", category: "cestas", description: "Cesta c/ pães, bolos, frios, frutas, sucos e café / serve 4 pessoas", ingredients: ["Pães", "Bolos", "Frios", "Frutas", "Sucos"] },
  { id: "17", name: "Cesta aniversario", price: 180, image: "/bolo.webp", category: "cestas", description: "Cesta decorada c/ bolo, doces, salgados e bebidas / serve 10 pessoas", ingredients: ["Bolo", "Doces", "Salgados", "Bebidas"] },
  { id: "18", name: "Lasanha congelada", price: 55, image: "/bolo.webp", category: "congelados", description: "Lasanha de carne c/ molho bechamel / 800g", ingredients: ["Massa", "Carne", "Queijo", "Molho bechamel"] },
  { id: "19", name: "Empadão congelado", price: 50, image: "/bolo.webp", category: "congelados", description: "Empadão de frango c/ catupiry / 700g", ingredients: ["Massa", "Frango", "Catupiry", "Milho"] },
];

const CATEGORY_TITLES: Record<string, string> = {
  "bolos-cobertura": "Bolos c/ cobertura",
  "bolos-vulcao": "Bolos vulcão",
  "bolos-piscina": "Bolos piscina",
  "bolos-fit": "Bolos fit",
  "pudins": "Pudins",
  "cestas": "Cestas",
  "congelados": "Congelados",
  "salgados": "Salgados",
};

export default function CardapioPage() {
  const [activeCategory, setActiveCategory] = React.useState("bolos-cobertura");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const productsByCategory = React.useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    CATEGORIES.forEach((cat) => {
      grouped[cat.id] = MOCK_PRODUCTS.filter((p) => p.category === cat.id);
    });
    return grouped;
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: `${product.id}-${Date.now()}`, product, quantity: 1, observations: "" }];
    });
    if (isMobile) setCartOpen(true);
  };

  const handleAddToCartFromModal = (product: Product, quantity: number, observations: string) => {
    setCartItems((prev) => {
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
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleEditItem = (item: CartItem) => {
    setSelectedProduct(item.product);
  };

  const handleCheckout = () => {
    alert(`Finalizando pedido no valor de R$ ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2).replace(".", ",")}`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main className="flex flex-1">
        <div className="flex-1 lg:pr-4">
          <div className="max-w-[1020px] mx-auto px-4 pb-12">
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {CATEGORIES.map((category) => {
              const products = productsByCategory[category.id] || [];
              if (products.length === 0) return null;
              return (
                <ProductCategorySection
                  key={category.id}
                  title={CATEGORY_TITLES[category.id] || category.label}
                  products={products}
                  onAddClick={handleAddToCart}
                  onDetailClick={setSelectedProduct}
                />
              );
            })}
          </div>
        </div>

        <ShoppingCartSidebar
          items={cartItems}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onEditItem={handleEditItem}
          onCheckout={handleCheckout}
        />
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
}