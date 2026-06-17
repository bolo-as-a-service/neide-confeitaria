"use client";

import * as React from "react";
import { Settings, MapPin, Phone, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminExtraPage() {
  const [storeName, setStoreName] = React.useState("Neide Confeitaria");
  const [address, setAddress] = React.useState("Bragança Paulista Rua 7");
  const [phone, setPhone] = React.useState("(11) 9 4022-8922");
  const [openTime, setOpenTime] = React.useState("08:00");
  const [closeTime, setCloseTime] = React.useState("20:00");
  const [isOpen, setIsOpen] = React.useState(true);

  const handleSave = () => {
    console.log({ storeName, address, phone, openTime, closeTime, isOpen });
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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