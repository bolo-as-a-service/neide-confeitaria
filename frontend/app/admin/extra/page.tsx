"use client";

import * as React from "react";
import { Settings, MapPin, Phone, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { maskPhone } from "@/lib/checkout";
import {
  DEFAULT_STORE_SETTINGS,
  loadStoreSettings,
  saveStoreSettings,
} from "@/lib/store-settings";

export default function AdminExtraPage() {
  const [storeName, setStoreName] = React.useState(DEFAULT_STORE_SETTINGS.storeName);
  const [address, setAddress] = React.useState(DEFAULT_STORE_SETTINGS.address);
  const [phone, setPhone] = React.useState(DEFAULT_STORE_SETTINGS.phone);
  const [openTime, setOpenTime] = React.useState(DEFAULT_STORE_SETTINGS.openTime);
  const [closeTime, setCloseTime] = React.useState(DEFAULT_STORE_SETTINGS.closeTime);
  const [isOpen, setIsOpen] = React.useState(DEFAULT_STORE_SETTINGS.isOpen);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const saved = loadStoreSettings();
      setStoreName(saved.storeName);
      setAddress(saved.address);
      setPhone(saved.phone);
      setOpenTime(saved.openTime);
      setCloseTime(saved.closeTime);
      setIsOpen(saved.isOpen);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = () => {
    saveStoreSettings({ storeName, address, phone, openTime, closeTime, isOpen });
    toast.success("Configurações salvas!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="h-5 w-5 lg:h-6 lg:w-6 text-[var(--brand-700)]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Extra</h1>
        </div>
        <p className="text-sm text-[var(--muted)] ml-9">
          Configure as informações da loja
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Store className="h-5 w-5 text-[var(--brand-700)]" />
          <h2 className="text-base font-semibold text-[var(--ink)]">Dados da Loja</h2>
        </div>

        <div>
          <Label htmlFor="storeName" className="mb-1.5 block">Nome da loja</Label>
          <Input
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="address" className="mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Endereço
              </span>
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Telefone
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              maxLength={15}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="openTime" className="mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Horário de abertura
              </span>
            </Label>
            <Input
              id="openTime"
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="closeTime" className="mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Horário de fechamento
              </span>
            </Label>
            <Input
              id="closeTime"
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block">Status da loja</Label>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
              isOpen
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-semibold">{isOpen ? "ABERTO" : "FECHADO"}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button onClick={handleSave}>
            Salvar configurações
          </Button>
        </div>
      </div>
    </div>
  );
}