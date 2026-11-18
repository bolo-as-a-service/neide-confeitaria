"use client";

import * as React from "react";
import { Cake, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { AdminProductTable, AdminProduct } from "@/components/admin/AdminProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import { AdminProductTableSkeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { categoryColorForCategory, parsePriceInput } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-image";
import type { BackendCategory, BackendProduct } from "@/lib/types";

function toAdminProduct(p: BackendProduct): AdminProduct {
  const catName = p.category?.name || "Sem categoria";
  return {
    id: String(p.id),
    name: p.name,
    description: p.description || "",
    price: p.price,
    image: productImageSrc(p),
    category: catName,
    categoryColor: categoryColorForCategory(catName),
    available: p.available,
    ingredients: p.ingredients,
  };
}

export default function AdminMenuPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [editProduct, setEditProduct] = React.useState<AdminProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<AdminProduct | null>(null);
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const loadProducts = React.useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getProducts();
      setProducts(data.map(toAdminProduct));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadProducts();
    });
    return () => {
      cancelled = true;
    };
  }, [loadProducts]);

  const handleEdit = (product: AdminProduct) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: AdminProduct) => {
    setDeleteProduct(product);
  };

  const handleToggle = async (product: AdminProduct) => {
    const next = !(product.available ?? true);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, available: next } : p))
    );
    try {
      const updated = await api.toggleProduct(Number(product.id));
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? toAdminProduct(updated) : p))
      );
      toast.success(next ? `"${product.name}" ativado no cardápio.` : `"${product.name}" pausado no cardápio.`);
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, available: product.available } : p))
      );
      toast.error(err instanceof Error ? err.message : "Erro ao alterar disponibilidade");
    }
  };

  const confirmDelete = async () => {
    if (!deleteProduct || deleting) return;
    setDeleting(true);
    try {
      await api.deleteProduct(Number(deleteProduct.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      toast.success(`"${deleteProduct.name}" excluído do cardápio.`);
      setDeleteProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir produto");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    category?: BackendCategory;
    price: string;
    ingredients: string[];
    image?: string;
  }) => {
    if (saving) return;
    const payload: Partial<BackendProduct> = {
      name: data.name,
      description: data.description,
      price: parsePriceInput(data.price),
      ingredients: data.ingredients,
      imageUrl: data.image,
    };
    if (data.category) {
      payload.category = data.category;
    }
    setSaving(true);
    try {
      if (editProduct) {
        const updated = await api.updateProduct(Number(editProduct.id), payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? toAdminProduct(updated) : p))
        );
        toast.success(`"${updated.name}" atualizado.`);
      } else {
        const created = await api.createProduct(payload);
        setProducts((prev) => [...prev, toAdminProduct(created)]);
        toast.success(`"${created.name}" criado no cardápio.`);
      }
      setShowForm(false);
      setEditProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 rounded-[var(--radius-card-lg)] bg-[var(--brand-900)] texture-sprinkles text-[var(--cream)] p-5 sm:p-6 shadow-[0_18px_40px_-20px_rgba(43,21,20,0.65)]">
          <div className="h-7 w-56 rounded-full bg-white/15 animate-pulse" />
          <div className="mt-2 h-4 w-72 max-w-full rounded-full bg-white/10 animate-pulse" />
        </div>
        <AdminProductTableSkeleton rows={6} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Cake className="h-5 w-5 lg:h-6 lg:w-6 text-[var(--brand-700)]" />
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Menu de Produtos</h1>
          </div>
        </div>
        <ErrorState message={loadError} onRetry={loadProducts} />
      </div>
    );
  }

  if (showForm) {
    return <ProductForm onBack={() => { setShowForm(false); setEditProduct(null); }} editProduct={editProduct} onSave={handleSave} saving={saving} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 rounded-[var(--radius-card-lg)] bg-[var(--brand-900)] texture-sprinkles text-[var(--cream)] p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_18px_40px_-20px_rgba(43,21,20,0.65)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Cake className="h-5 w-5 text-[var(--rose-200)]" />
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Menu de produtos</h1>
          </div>
          <p className="mt-1 text-sm text-[var(--rose-100)]/85">
            Gerencie os doces disponíveis no cardápio
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-[var(--cream)] hover:bg-white text-[var(--brand-900)] px-4 py-2.5 rounded-full text-xs lg:text-sm font-bold transition-all hover:-translate-y-px shadow whitespace-nowrap"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
          Novo produto
        </button>
      </div>

      <AdminProductTable
        products={products}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent className="max-w-sm p-6 text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--ink)]">
              Excluir produto
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirme se deseja excluir este produto do cardápio.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)] mb-6">
            Tem certeza que deseja remover <strong>{deleteProduct?.name}</strong> do cardápio?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setDeleteProduct(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
