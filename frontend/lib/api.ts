import type {
  BackendCategory,
  BackendProduct,
  BackendUser,
  BackendOrder,
  BackendOrderDTO,
  BackendLoginDTO,
  BackendRegisterDTO,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
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
