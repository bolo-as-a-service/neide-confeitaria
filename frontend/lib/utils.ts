import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Slug canônico de categoria (issue #14).
 * Unifica a lógica antes duplicada em `app/cardapio/page.tsx`
 * (mapProduct, frontendCategories, productsByCategory).
 * Remove acentos (ex.: "Vulcão" -> "vulcao"), normaliza espaços e caixa.
 */
export function slugifyCategory(name?: string | null): string {
  if (!name) return "outros";
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "outros";
}

export type CategoryColor = "rose" | "red" | "green" | "amber";

const KNOWN_CATEGORY_COLORS: Record<string, CategoryColor> = {
  "caseiro": "rose",
  "diet": "green",
  "vulcao": "amber",
  "bolo": "rose",
  "salgado": "amber",
  "pudim": "rose",
  "cesta": "rose",
  "congelado": "rose",
  "outros": "amber",
  "sem-categoria": "amber",
};

/**
 * Cor determinística da tag de categoria (issue #14).
 * Cobre as 8 categorias reais do seeder + qualquer categoria futura
 * via hash estável do slug (antes: map hard-coded com chaves inexistentes
 * como "bolos-cobertura", que caía sempre no fallback).
 */
export function categoryColorForCategory(name?: string | null): CategoryColor {
  const slug = slugifyCategory(name);
  const known = KNOWN_CATEGORY_COLORS[slug];
  if (known) return known;
  const palette: CategoryColor[] = ["rose", "green", "amber", "red"];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}
