"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Edit3, Trash2 } from "lucide-react";
import { Header } from "@/components/menu/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCart();
  const [deliveryOption, setDeliveryOption] = React.useState<"sim" | "nao">("sim");
  const [address, setAddress] = React.useState("");
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [observations, setObservations] = React.useState("");

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

  const formattedItemTotal = (price: number, quantity: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price * quantity);

  const handleFinalize = () => {
    router.push("/pedido-confirmado");
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body">
      <Header cartCount={cartCount} onCartClick={() => router.push("/carrinho")} />

      <main className="max-w-[1020px] mx-auto px-4 py-6 pb-12">
        <button
          onClick={() => router.push("/cardapio")}
          className="w-10 h-10 rounded-full bg-[var(--brand-700)] flex items-center justify-center text-white hover:bg-[var(--brand-800)] transition-colors mb-6"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          {/* ── Bloco: ITENS DO PEDIDO ── */}
          <div className="bg-white rounded-2xl border border-[var(--rose-200)] shadow-sm overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="font-display text-lg font-bold text-[var(--brand-800)] uppercase tracking-wide mb-5">
                ITENS DO PEDIDO
              </h2>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[var(--muted)]">Seu carrinho está vazio</p>
                  <button
                    onClick={() => router.push("/cardapio")}
                    className="mt-2 text-sm text-[var(--brand-700)] underline hover:text-[var(--brand-800)] transition-colors"
                  >
                    Adicionar produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="pb-5 last:pb-0 border-b border-[var(--rose-200)] last:border-b-0"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[var(--rose-50)] overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-base font-semibold text-[var(--ink)]">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-[var(--muted)] mt-0.5">
                                {item.quantity}x • {formattedItemTotal(item.product.price, 1)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                className="p-1.5 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                                aria-label="Editar item"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Remover item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {item.observations && (
                            <p className="text-xs text-[var(--muted)] mt-1.5">
                              <span className="font-medium">OBSERVAÇÕES </span>
                              {item.observations}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[var(--rose-200)] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 flex items-center justify-center text-[var(--brand-700)] hover:bg-[var(--rose-100)] disabled:opacity-50 transition-colors"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-10 text-center font-display text-sm font-bold text-[var(--ink)]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 flex items-center justify-center text-[var(--brand-700)] hover:bg-[var(--rose-100)] transition-colors"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-display text-lg font-bold text-[var(--brand-800)]">
                              {formattedItemTotal(item.product.price, item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="bg-[var(--rose-50)] px-6 py-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-[var(--brand-800)]">TOTAL :</span>
                <span className="font-display text-xl font-extrabold text-[var(--brand-800)]">
                  {formattedTotal}
                </span>
              </div>
            )}
          </div>

          {/* ── Bloco: DADOS DE ENTREGA E AGENDAMENTO ── */}
          <div className="bg-white rounded-2xl border border-[var(--rose-200)] shadow-sm p-6">
            <h2 className="font-display text-lg font-bold text-[var(--brand-800)] uppercase tracking-wide mb-6">
              DESEJA RECEBER O PEDIDO EM CASA?
            </h2>

            <div className="flex items-center gap-8 mb-6">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryOption === "nao"
                      ? "border-[var(--brand-700)]"
                      : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  onClick={() => setDeliveryOption("nao")}
                >
                  {deliveryOption === "nao" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-700)]" />
                  )}
                </div>
                <span className="text-sm text-[var(--ink)]">NÃO</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryOption === "sim"
                      ? "border-[var(--brand-700)]"
                      : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  onClick={() => setDeliveryOption("sim")}
                >
                  {deliveryOption === "sim" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-700)]" />
                  )}
                </div>
                <span className="text-sm text-[var(--ink)]">SIM</span>
              </label>
            </div>

            {deliveryOption === "sim" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      ENDEREÇO :
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Digite seu endereço"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      DATA e HORA :
                    </label>
                    <input
                      type="datetime-local"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      OBSERVAÇÕES GERAIS :
                    </label>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Ex: Deixar na portaria"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm resize-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-3">
                    MARQUE O ENDEREÇO DE ENTREGA
                  </h3>
                  <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-gray-300">
                    {address.trim() ? (
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                        className="w-full h-full"
                        allowFullScreen
                        loading="lazy"
                        title="Mapa do endereço de entrega"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#f5f0eb] text-sm text-[var(--muted)]">
                        Insira um endereço para ver o mapa
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      RETIRAR EM :
                    </label>
                    <p className="px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-[var(--rose-50)] text-[var(--ink)] text-sm">
                      Neide Confeitaria — Rua 7, Bragança Paulista
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      DATA e HORA :
                    </label>
                    <input
                      type="datetime-local"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      OBSERVAÇÕES GERAIS :
                    </label>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Ex: Quanto antes, melhor"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm resize-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-3">
                    LOCAL DE RETIRADA
                  </h3>
                  <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-gray-300">
                    <iframe
                      src="https://maps.google.com/maps?q=Neide+Confeitaria+Bragança+Paulista&output=embed"
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                      title="Mapa da confeitaria"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleFinalize}
                className="w-full max-w-md h-14 text-lg font-bold rounded-xl uppercase tracking-wide"
                size="lg"
              >
                FAZER PEDIDO
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
