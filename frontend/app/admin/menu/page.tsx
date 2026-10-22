"use client";

import * as React from "react";
import { Cake, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { AdminProductTable, AdminProduct } from "@/components/admin/AdminProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { categoryColorForCategory } from "@/lib/utils";
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
      price: parseFloat(data.price.replace(",", ".")),
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-700)]" />
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Cake className="h-5 w-5 lg:h-6 lg:w-6 text-[var(--brand-700)]" />
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Menu de Produtos</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 lg:gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-[var(--cream)] px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Novo Produto
          </button>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Gerencie os produtos disponíveis no cardápio
        </p>
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
