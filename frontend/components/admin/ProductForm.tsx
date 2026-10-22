"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ClipboardList, CloudUpload, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { parsePriceInput } from "@/lib/utils";
import { api } from "@/lib/api";
import { isPersistableImageUrl, resolveBackendImage } from "@/lib/product-image";
import type { BackendCategory } from "@/lib/types";

import { AdminProduct } from "./AdminProductTable";

interface ProductFormProps {
  onBack: () => void;
  editProduct?: AdminProduct | null;
  saving?: boolean;
  onSave?: (data: {
    name: string;
    description: string;
    category?: BackendCategory;
    price: string;
    ingredients: string[];
    image?: string;
  }) => void;
}

export function ProductForm({ onBack, editProduct, saving = false, onSave }: ProductFormProps) {
  const [name, setName] = React.useState(editProduct?.name ?? "");
  const [description, setDescription] = React.useState(editProduct?.description ?? "");
  const [categories, setCategories] = React.useState<BackendCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<BackendCategory | null>(null);
  const [price, setPrice] = React.useState(editProduct ? String(editProduct.price) : "");
  const [ingredients, setIngredients] = React.useState<string[]>(editProduct?.ingredients ?? []);
  const [newIngredient, setNewIngredient] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState(editProduct?.image ?? "");
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");
  const [categoriesLoaded, setCategoriesLoaded] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<{ name?: string; price?: string }>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
      if (editProduct?.category && editProduct.category !== "Sem categoria") {
        const match = cats.find((c) => c.name === editProduct.category);
        if (match) setSelectedCategory(match);
      } else {
        setSelectedCategory(null);
      }
      setCategoriesLoaded(true);
    }).catch(() => setCategoriesLoaded(true));
  }, [editProduct]);

  const handleImageUpload = async (file: File) => {
    setUploadError("");
    setUploading(true);
    try {
      const result = await api.uploadImage(file);
      setImageUrl(result.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao fazer upload da imagem.";
      setUploadError(message);
      toast.error(message);
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
    const value = newIngredient.trim().slice(0, 60);
    if (value && !ingredients.includes(value)) {
      setIngredients([...ingredients, value]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errors: { name?: string; price?: string } = {};
    if (name.trim().length < 2) {
      errors.name = "Informe o nome do produto (mín. 2 caracteres).";
    }
    const value = parsePriceInput(price);
    if (!Number.isFinite(value) || value <= 0) {
      errors.price = "Informe um preço válido maior que zero (ex.: 65,90).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (uploading) {
      toast.error("Aguarde o envio da imagem terminar.");
      return;
    }
    if (!validate()) return;
    if (onSave) {
      onSave({
        name: name.trim(),
        description,
        category: selectedCategory ?? undefined,
        price,
        ingredients,
        // Só persiste URL de upload real; fallback local não é foto do produto.
        image: isPersistableImageUrl(imageUrl) ? imageUrl : undefined,
      });
    } else {
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
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-white text-xs sm:text-sm px-3 sm:px-4"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Produto"
              )}
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
                maxLength={120}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
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
                      src={resolveBackendImage(imageUrl) ?? imageUrl}
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
                  <p className="text-xs text-[var(--muted)] mt-4">Formatos: JPG, PNG, WebP • Tamanho máx: 5MB</p>
                </div>
              )}
              {uploadError && (
                <p className="mt-2 text-xs text-red-600">{uploadError}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="mb-1.5 block">
                Categoria
              </Label>
              <div className="relative">
                <select
                  id="category"
                  value={selectedCategory?.id ?? "__none__"}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "__none__" || raw === "") {
                      setSelectedCategory(null);
                      return;
                    }
                    const id = Number(raw);
                    const cat = categories.find((c) => c.id === id);
                    setSelectedCategory(cat ?? null);
                  }}
                  className="flex h-11 w-full rounded-lg border border-[var(--rose-200)] bg-white/90 px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] appearance-none"
                >
                  <option value="__none__">{categoriesLoaded ? "Sem categoria (aparece em Outros)" : "Carregando..."}</option>
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
                  inputMode="decimal"
                  placeholder="0,00"
                  value={price}
                  maxLength={12}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
                  }}
                  className="pl-10"
                />
                {formErrors.price && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
                )}
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
