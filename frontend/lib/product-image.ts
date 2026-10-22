import { slugifyCategory } from "@/lib/utils";

/**
 * Resolução central de imagens de produto.
 *
 * Prioridade: foto enviada no cadastro (backend /images/* ou URL absoluta)
 * → foto da categoria (public/categories, Unsplash) → /bolo.webp.
 * Centralizar aqui evita os bugs de `${API_URL}/bolo.webp` que quebravam
 * previews (ex.: ProductForm somava o host da API em asset local).
 */

export const FALLBACK_IMAGE = "/bolo.webp";

/** Fotos por categoria (Unsplash, licença livre). Chave = slug canônico. */
const CATEGORY_IMAGES: Record<string, string> = {
  caseiro: "/categories/caseiro.jpg",
  diet: "/categories/diet.jpg",
  vulcao: "/categories/vulcao.jpg",
  bolo: "/categories/bolo.jpg",
  salgado: "/categories/salgado.jpg",
  pudim: "/categories/pudim.jpg",
  cesta: "/categories/cesta.jpg",
  congelado: "/categories/congelado.jpg",
  outros: "/categories/outros.jpg",
  "sem-categoria": "/categories/outros.jpg",
};

export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");
}

/** Foto da categoria a partir do nome (com fallback para "outros"). */
export function categoryImageSrc(categoryName?: string | null): string {
  const slug = slugifyCategory(categoryName);
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGES["outros"];
}

/** Hosts cujas imagens o next/image pode otimizar (mesmos do next.config). */
function allowedImageHosts(): Set<string> {
  const hosts = new Set<string>();
  try {
    hosts.add(new URL(getApiBase()).host);
  } catch {
    // base inválida: nenhum host absoluto permitido
  }
  return hosts;
}

/**
 * Resolve o imageUrl do backend para src final:
 * - /images/* → prefixa com a base da API;
 * - paths locais (/bolo.webp, /categories/*) → usa como está;
 * - http(s) do host da API → usa como está;
 * - http(s) de outro host, protocolo estranho ou inválido → undefined,
 *   para o chamador aplicar categoria/fallback (next/image rejeita host
 *   não listado no next.config e quebraria o card).
 * - vazio → undefined (chamador aplica categoria/fallback).
 */
export function resolveBackendImage(imageUrl?: string | null): string | undefined {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("/images/")) return `${getApiBase()}${imageUrl}`;
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) return imageUrl;
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  if (!allowedImageHosts().has(url.host)) return undefined;
  return imageUrl;
}

/** Imagem final do produto (backend → categoria → fallback). */
export function productImageSrc(product: {
  imageUrl?: string | null;
  category?: { name?: string } | string | null;
}): string {
  const resolved = resolveBackendImage(product.imageUrl);
  if (resolved) return resolved;
  const categoryName =
    typeof product.category === "string" ? product.category : product.category?.name;
  return categoryImageSrc(categoryName);
}

/**
 * O valor digitado/selecionado no editor deve ser persistido como imageUrl?
 * Só URLs de upload real (backend ou absoluta). Assets locais de fallback
 * (ex.: /bolo.webp) não são foto do produto — salvar vazio mantém o produto
 * sem imageUrl e a UI resolve categoria/fallback sozinha.
 */
export function isPersistableImageUrl(value?: string | null): boolean {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/images/")
  );
}
