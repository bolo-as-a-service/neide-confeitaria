import type {
  BackendCategory,
  BackendProduct,
  BackendUser,
  BackendOrder,
  BackendOrderDTO,
  BackendLoginDTO,
  BackendRegisterDTO,
  BackendAuthResponse,
} from "./types";
import { mockApi } from "./mock-data";

/**
 * MOCK SOMENTE EM DESENVOLVIMENTO: com NEXT_PUBLIC_USE_MOCK=true (e nunca em
 * produção — ver lib/mock-data.ts), o `api` usa dados fictícios locais.
 */
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" &&
  process.env.NODE_ENV !== "production";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

/** Timeout padrão das requisições (evita loading infinito em rede lenta). */
export const REQUEST_TIMEOUT_MS = 15_000;

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

/**
 * Token JWT da sessão (memória + storage conforme "lembrar de mim").
 * O papel do usuário NUNCA é lido daqui: a fonte de verdade é o
 * GET /auth/me (AuthContext), cujo papel vem do banco no servidor.
 */
const TOKEN_KEY = "neide_auth_token";

let memoryToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

/** Chamado pelo AuthContext para deslogar em 401. */
export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.localStorage.getItem(TOKEN_KEY) ??
      window.sessionStorage.getItem(TOKEN_KEY)
    );
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (memoryToken) return memoryToken;
  memoryToken = readStoredToken();
  return memoryToken;
}

/** `true` quando o token está no persistent storage ("lembrar de mim"). */
export function isAuthTokenPersistent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(TOKEN_KEY) !== null;
  } catch {
    return false;
  }
}

export function setAuthToken(token: string | null, remember: boolean) {
  memoryToken = token;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    if (token) {
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // Storage indisponível: segue só em memória.
  }
}

/** Normaliza as duas formas de resposta de auth para um contrato único. */
function normalizeAuthResponse(body: BackendAuthResponse | BackendUser): BackendAuthResponse {
  if (
    body !== null &&
    typeof body === "object" &&
    "user" in body &&
    (body as BackendAuthResponse).user !== null &&
    typeof (body as BackendAuthResponse).user === "object"
  ) {
    const wrapped = body as BackendAuthResponse;
    return { token: wrapped.token ?? null, user: wrapped.user };
  }
  return { token: null, user: body as BackendUser };
}

/** Mensagem de erro do backend (`error` no Flask/AppError, `message` noutros). */
function parseErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null) {
    const record = body as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
    // Erros padrão do Flask-JWT (inglês): traduz para pt-BR amigável.
    if (typeof record.msg === "string") return translateJwtMessage(record.msg);
  }
  return fallback;
}

/** Traduz mensagens padrão do Flask-JWT para pt-BR. */
function translateJwtMessage(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("missing authorization header")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (
    lower.includes("signature verification failed") ||
    lower.includes("invalid header") ||
    lower.includes("not enough segments") ||
    lower.includes("invalid token") ||
    lower.includes("failed to decode")
  ) {
    return "Sessão inválida. Faça login novamente.";
  }
  if (lower.includes("expired")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (lower.includes("fresh token")) {
    return "Sessão expirada. Faça login novamente.";
  }
  return "Sessão expirada. Faça login novamente.";
}

/** Fallback amigável quando o backend não traz mensagem (ex.: HTML do debug). */
function fallbackStatusMessage(status: number): string {
  if (status === 400) return "Dados inválidos. Confira os campos.";
  if (status === 401) return "Sessão expirada. Faça login novamente.";
  if (status === 403) return "Sem permissão para esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 409) return "Conflito: este registro já existe.";
  if (status === 422) return "Dados inválidos. Confira os campos.";
  if (status === 429) return "Muitas tentativas. Aguarde um pouco e tente de novo.";
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";
  return `HTTP ${status}`;
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
  options?: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  // Rotas de autenticação nunca devem derrubar a sessão ao falhar (ex.:
  // login com senha errada não pode disparar logout global).
  const isAuthRoute = path.startsWith("/auth/login") || path.startsWith("/auth/register");
  try {
    const token = getAuthToken();
    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers
        ? options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : Array.isArray(options.headers)
            ? Object.fromEntries(options.headers)
            : (options.headers as Record<string, string>)
        : {}),
    };
    if (token && !mergedHeaders["Authorization"]) {
      mergedHeaders["Authorization"] = `Bearer ${token}`;
    }
    const { headers: _ignored, ...restOptions } = options ?? {};
    void _ignored;
    const res = await fetch(`${BASE_URL}${path}`, {
      ...restOptions,
      headers: mergedHeaders,
      // Authorization acima é substituído se options trouxer headers próprios.
      signal: controller.signal,
    });
    if (res.status === 401) {
      if (!isAuthRoute) onUnauthorized?.();
      const body = await res.json().catch(() => null);
      throw new ApiError(401, parseErrorMessage(body, fallbackStatusMessage(401)), parseFieldErrors(body));
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new ApiError(res.status, parseErrorMessage(body, fallbackStatusMessage(res.status)), parseFieldErrors(body));
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, "Tempo de resposta esgotado. Tente novamente.");
    }
    if (err instanceof ApiError) throw err;
    if (err instanceof TypeError) {
      throw new ApiError(
        0,
        "Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando."
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

const realApi = {
  // Auth: aceita `{token, user}` (backend com JWT) ou o usuário puro
  // (backend legado sem token — ex.: Flask). Papel real vem de getMe.
  login: (dto: BackendLoginDTO) =>
    request<BackendAuthResponse | BackendUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }).then(normalizeAuthResponse),

  register: (dto: BackendRegisterDTO) =>
    request<BackendAuthResponse | BackendUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    }).then(normalizeAuthResponse),

  getMe: () => request<{ user: BackendUser }>("/auth/me"),

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

  /** Pedidos do usuário logado (vinculados pelo userId no servidor). */
  getMyOrders: () => request<BackendOrder[]>("/orders/mine"),

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
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      throw new ApiError(415, "Formato inválido. Envie JPG, PNG ou WebP.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new ApiError(413, "Imagem muito grande. Máximo 5MB.");
    }
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const headers: Record<string, string> = {};
      const token = getAuthToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/images/upload`, {
        method: "POST",
        body: formData,
        headers,
        signal: controller.signal,
      });
      if (res.status === 401) {
        onUnauthorized?.();
        const body = await res.json().catch(() => null);
        throw new ApiError(401, parseErrorMessage(body, fallbackStatusMessage(401)));
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(res.status, parseErrorMessage(body, "Erro ao fazer upload da imagem."));
      }
      return res.json() as Promise<{ url: string }>;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiError(0, "Tempo de resposta esgotado. Tente novamente.");
      }
      if (err instanceof ApiError) throw err;
      if (err instanceof TypeError) {
        throw new ApiError(
          0,
          "Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando."
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  },
};

export const api = USE_MOCK ? mockApi : realApi;
