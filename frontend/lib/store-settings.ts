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

export function loadStoreSettings(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_STORE_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORE_SETTINGS_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...parsed,
      phone: maskPhone(String(parsed.phone ?? DEFAULT_STORE_SETTINGS.phone)),
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
