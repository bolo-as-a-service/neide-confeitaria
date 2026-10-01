import type {
  BackendCategory,
  BackendProduct,
  BackendUser,
  BackendOrder,
  BackendOrderDTO,
  BackendLoginDTO,
  BackendRegisterDTO,
} from "./types";
import { mockApi } from "./mock-data";

/**
 * MOCK TEMPORÁRIO (remover quando o backend estabilizar): com
 * NEXT_PUBLIC_USE_MOCK=true, o `api` usa dados fixados em mock-data.ts.
 * Para remover: delete mock-data.ts + .env.local e reverta este bloco.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Erro tipado da API (issue #26): carrega status HTTP e erros de campo. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function parseFieldErrors(body: unknown): Record<string, string> | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const record = body as Record<string, unknown>;
  const candidate = record.fieldErrors ?? record.errors;
  if (typeof candidate === "object" && candidate !== null && !Array.isArray(candidate)) {
    const entries = Object.entries(candidate as Record<string, unknown>).filter(
      ([, v]) => typeof v === "string"
    ) as [string, string][];
    if (entries.length > 0) return Object.fromEntries(entries);
  }
  return undefined;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (typeof body === "object" && body !== null && typeof (body as Record<string, unknown>).error === "string"
        ? (body as Record<string, unknown>).error as string
        : undefined) ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, parseFieldErrors(body));
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const realApi = {
  // Auth
  login: (dto: BackendLoginDTO) =>
    request<BackendUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  register: (dto: BackendRegisterDTO) =>
    request<BackendUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  // Categories
  getCategories: () => request<BackendCategory[]>("/categories"),

  createCategory: (data: { name: string }) =>
    request<BackendCategory>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id: number, data: { name: string }) =>
    request<BackendCategory>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  // Products
  getProducts: (categoryId?: number) => {
    const params = categoryId ? `?categoryId=${categoryId}` : "";
    return request<BackendProduct[]>(`/products${params}`);
  },

  getProduct: (id: number) => request<BackendProduct>(`/products/${id}`),

  createProduct: (data: Partial<BackendProduct>) =>
    request<BackendProduct>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProduct: (id: number, data: Partial<BackendProduct>) =>
    request<BackendProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  toggleProduct: (id: number) =>
    request<BackendProduct>(`/products/${id}/toggle`, { method: "PATCH" }),

  deleteProduct: (id: number) =>
    request<void>(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (status?: string) => {
    const params = status ? `?status=${status}` : "";
    return request<BackendOrder[]>(`/orders${params}`);
  },

  getOrder: (id: number) => request<BackendOrder>(`/orders/${id}`),

  getOrdersByCustomer: (name: string) =>
    request<BackendOrder[]>(`/orders/customer/${encodeURIComponent(name)}`),

  createOrder: (dto: BackendOrderDTO) =>
    request<BackendOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  advanceOrder: (id: number) =>
    request<BackendOrder>(`/orders/${id}/advance`, { method: "PATCH" }),

  updateOrderStatus: (id: number, status: string) =>
    request<BackendOrder>(`/orders/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PATCH",
    }),

  // Images
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json() as Promise<{ url: string }>;
  },
};

export const api = USE_MOCK ? mockApi : realApi;
