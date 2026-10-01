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

/**
 * Placeholder blur para next/image (issue #30).
 * Shimmer SVG inline — evita layout shift enquanto a foto carrega,
 * sem depender de thumbnail gerado no backend.
 */
function shimmerSvg(w: number, h: number): string {
  return `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f6e8e4" offset="20%"/><stop stop-color="#efd9d3" offset="50%"/><stop stop-color="#f6e8e4" offset="70%"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#f6e8e4"/><rect id="r" width="${w}" height="${h}" fill="url(#g)"/></svg>`;
}

function toBase64(str: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(str).toString("base64");
  }
  return window.btoa(str);
}

export const productBlurPlaceholder = `data:image/svg+xml;base64,${toBase64(shimmerSvg(200, 200))}`;

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
