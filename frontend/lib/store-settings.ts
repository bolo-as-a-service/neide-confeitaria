import { maskPhone } from "@/lib/checkout";

/**
 * Dados da loja exibidos em AdminHeader, Footer e editados em /admin/extra.
 * Antes ficavam hard-coded em 3 lugares (e o "Salvar" do extra não fazia
 * nada além de console.log). Persiste em localStorage; sem backend.
 */
export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export const STORE_SETTINGS_KEY = "neide_store_settings";

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Neide Confeitaria",
  address: "Bragança Paulista Rua 7",
  phone: "(11) 9 4022-8922",
  openTime: "08:00",
  closeTime: "20:00",
  isOpen: true,
};

function asText(value: unknown, fallback: string, maxLength = 120): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || fallback;
}

function asTime(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return fallback;
  return value;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function loadStoreSettings(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_STORE_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORE_SETTINGS_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return DEFAULT_STORE_SETTINGS;
    }
    return {
      storeName: asText(parsed.storeName, DEFAULT_STORE_SETTINGS.storeName, 80),
      address: asText(parsed.address, DEFAULT_STORE_SETTINGS.address, 200),
      phone: maskPhone(asText(parsed.phone, DEFAULT_STORE_SETTINGS.phone, 20)),
      openTime: asTime(parsed.openTime, DEFAULT_STORE_SETTINGS.openTime),
      closeTime: asTime(parsed.closeTime, DEFAULT_STORE_SETTINGS.closeTime),
      isOpen: asBoolean(parsed.isOpen, DEFAULT_STORE_SETTINGS.isOpen),
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage indisponível: mantém em memória (estado local da página).
  }
}
