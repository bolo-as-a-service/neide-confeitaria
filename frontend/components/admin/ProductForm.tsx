"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ClipboardList, CloudUpload, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { BackendCategory } from "@/lib/types";

import { AdminProduct } from "./AdminProductTable";

interface ProductFormProps {
  onBack: () => void;
  editProduct?: AdminProduct | null;
  onSave?: (data: {
    name: string;
    description: string;
    category?: BackendCategory;
    price: string;
    ingredients: string[];
    image?: string;
  }) => void;
}

export function ProductForm({ onBack, editProduct, onSave }: ProductFormProps) {
  const [name, setName] = React.useState(editProduct?.name ?? "");
  const [description, setDescription] = React.useState(editProduct?.description ?? "");
  const [categories, setCategories] = React.useState<BackendCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<BackendCategory | null>(null);
  const [price, setPrice] = React.useState(editProduct ? String(editProduct.price) : "");
  const [ingredients, setIngredients] = React.useState<string[]>(editProduct?.ingredients ?? []);
  const [newIngredient, setNewIngredient] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState(editProduct?.image ?? "");
  const [uploading, setUploading] = React.useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
      if (editProduct?.category) {
        const match = cats.find((c) => c.name === editProduct.category);
        if (match) setSelectedCategory(match);
      }
      setCategoriesLoaded(true);
    }).catch(() => setCategoriesLoaded(true));
  }, [editProduct]);

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setUploading(true);
    try {
      const result = await api.uploadImage(file);
      setImageUrl(result.url);
    } catch {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const descriptionLength = description.length;
  const maxDescriptionLength = 200;

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ name, description, category: selectedCategory ?? undefined, price, ingredients, image: imageUrl || undefined });
    } else {
      console.log({ name, description, category: selectedCategory, price, ingredients, image: imageUrl });
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[var(--ink)] hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-[var(--ink)]">{editProduct ? "Editar Produto" : "Novo Produto"}</h1>
              <p className="text-xs sm:text-sm text-[var(--muted)]">Preencha as informações do produto</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
            <Button
              variant="outline"
              className="border-[var(--brand-700)] text-[var(--brand-800)] text-xs sm:text-sm px-3 sm:px-4"
              onClick={onBack}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-white text-xs sm:text-sm px-3 sm:px-4"
              onClick={handleSave}
            >
              Salvar Produto
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-red-500" />
          <h2 className="text-base font-semibold text-[var(--ink)]">Informações Básicas</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-1.5 block">
                Nome do produto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex.: Bolo de Cenoura"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-1.5 block">
                Descrição
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Ex.: Bolo de cenoura 45x45 com cobertura de chocolate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, maxDescriptionLength))}
                  className="min-h-32 resize-none"
                />
                <span className="absolute bottom-3 right-3 text-xs text-[var(--muted)]">
                  {descriptionLength}/{maxDescriptionLength}
                </span>
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Imagem do produto</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[var(--rose-200)]">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imageUrl.startsWith("http") ? imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-[var(--rose-200)] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[var(--brand-600)] transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="h-10 w-10 text-[var(--brand-700)] mb-3 animate-spin" />
                  ) : (
                    <CloudUpload className="h-10 w-10 text-[var(--brand-700)] mb-3" />
                  )}
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {uploading ? "Enviando..." : "Clique para enviar uma imagem"}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">ou arraste e solte aqui</p>
                  <p className="text-xs text-[var(--muted)] mt-4">Formatos: JPG, PNG • Tamanho máx: 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="mb-1.5 block">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="category"
                  value={selectedCategory?.id ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const cat = categories.find((c) => c.id === id);
                    setSelectedCategory(cat ?? null);
                  }}
                  className="flex h-11 w-full rounded-lg border border-[var(--rose-200)] bg-white/90 px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] appearance-none"
                >
                  <option value="">{categoriesLoaded ? "Selecione a categoria" : "Carregando..."}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="price" className="mb-1.5 block">
                Preço <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">R$</span>
                <Input
                  id="price"
                  type="text"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Ingredientes</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-[var(--ink)]"
                    >
                      {ing}
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Adicionar ingrediente"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    className="flex-1"
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="w-10 h-10 rounded-full bg-[var(--rose-100)] text-[var(--brand-800)] hover:bg-[var(--rose-200)] flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
