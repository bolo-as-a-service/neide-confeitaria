"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Edit3, Trash2, AlertTriangle, Loader2, ShoppingBag, Bike, Store, Check, MoonStar } from "lucide-react";
import { Header } from "@/components/menu/Header";
import { Button } from "@/components/ui/button";
import { Price, formatBRL } from "@/components/ui/price";
import { FreeShippingProgress } from "@/components/menu/FreeShippingProgress";
import { useCart, CartItem } from "@/lib/cart-context";
import { ProductModal } from "@/components/menu/ProductModal";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  FREE_DELIVERY_THRESHOLD,
  deliveryFeeFor,
  firstCheckoutError,
  maskPhone,
  stripPhoneDigits,
  validateCheckout,
} from "@/lib/checkout";
import { DEFAULT_STORE_SETTINGS, loadStoreSettings } from "@/lib/store-settings";
import { productBlurPlaceholder } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, updateItem, clearCart } = useCart();

  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [deliveryOption, setDeliveryOption] = React.useState<"sim" | "nao">("sim");
  const [address, setAddress] = React.useState("");
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [observations, setObservations] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const formErrors = validateCheckout({
    customerName,
    customerPhone,
    delivery: deliveryOption === "sim",
    address,
    deliveryDateTime: deliveryDate,
  });
  const isFormValid = Object.keys(formErrors).length === 0;
  const wantsDelivery = deliveryOption === "sim";

  const [storeSettings, setStoreSettings] = React.useState(DEFAULT_STORE_SETTINGS);
  const storeOpen = storeSettings.isOpen;

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setStoreSettings(loadStoreSettings());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [editItem, setEditItem] = React.useState<CartItem | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<CartItem | null>(null);

  // O iframe do mapa só recarrega após 600ms sem digitar: evita um embed
  // (e um envio do endereço ao Google) a cada tecla.
  const [debouncedAddress, setDebouncedAddress] = React.useState(address);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedAddress(address), 600);
    return () => clearTimeout(timer);
  }, [address]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // Itens pausados no admin depois de adicionados não podem ser comprados.
  const unavailableItems = items.filter((item) => item.product.available === false);

  const freeShipping = total >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = deliveryFeeFor(total, wantsDelivery);
  const grandTotal = total + deliveryFee;

  const handleFinalize = async () => {
    setTriedSubmit(true);
    const firstError = firstCheckoutError({
      customerName,
      customerPhone,
      delivery: deliveryOption === "sim",
      address,
      deliveryDateTime: deliveryDate,
    });
    if (firstError) {
      toast.error(firstError);
      return;
    }
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    if (unavailableItems.length > 0) {
      toast.error("Remova os itens pausados do carrinho para continuar.");
      return;
    }
    if (!storeOpen) {
      toast.error(`Estamos fechados no momento — abrimos das ${storeSettings.openTime} às ${storeSettings.closeTime}.`);
      return;
    }

    setSubmitting(true);
    try {
      await api.createOrder({
        customerName: customerName.trim(),
        // Backend espera só dígitos; a máscara é só apresentação.
        phone: stripPhoneDigits(customerPhone),
        delivery: deliveryOption === "sim",
        address: deliveryOption === "sim" ? address : undefined,
        deliveryDateTime: deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
        observation: observations || undefined,
        items: items.map((item) => ({
          productId: Number(item.product.id),
          quantity: item.quantity,
          observation: item.observations || undefined,
        })),
      });
      clearCart();
      toast.success("Pedido enviado com sucesso!");
      router.push("/pedido-confirmado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = (itemId: string, quantity: number, observations: string) => {
    updateItem(itemId, quantity, observations);
  };

  return (
    <div className="min-h-dvh bg-[var(--page-bg)] font-body">
      <Header cartCount={cartCount} onCartClick={() => router.push("/carrinho")} />

      <main className="max-w-[1020px] mx-auto px-4 py-6 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/cardapio")}
            className="w-10 h-10 shrink-0 rounded-full bg-[var(--brand-900)] text-[var(--cream)] flex items-center justify-center hover:bg-[var(--brand-800)] hover:-translate-x-px transition-all shadow-sm"
            aria-label="Voltar ao cardápio"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--brand-900)] leading-tight">Seu pedido</h1>
            <p className="text-sm text-[var(--muted)]">Confira, preencha e receba com carinho</p>
          </div>
        </div>

        <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-bold" aria-label="Etapas do pedido">
          {["Sacola", "Dados e entrega", "Confirmação"].map((step, i) => {
            const active = i === (items.length === 0 ? 0 : 1);
            const done = i === 0 && items.length > 0;
            return (
              <li key={step} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${done ? "bg-green-600 border-green-600 text-white" : active ? "bg-[var(--brand-900)] border-[var(--brand-900)] text-[var(--cream)]" : "bg-white border-[var(--rose-200)] text-[var(--muted)]"}`}>
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={active || done ? "text-[var(--brand-900)]" : "text-[var(--muted)]"}>{step}</span>
                {i < 2 && <span className="mx-1 hidden h-px w-8 bg-[var(--rose-200)] min-[480px]:block sm:w-14" />}
              </li>
            );
          })}
        </ol>

        <div className="space-y-6">
          {unavailableItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
              <strong>Atenção:</strong> {unavailableItems.length === 1 ? "um item do seu carrinho foi pausado" : "alguns itens do seu carrinho foram pausados"} e {unavailableItems.length === 1 ? "precisa ser removido" : "precisam ser removidos"} antes de finalizar:{" "}
              {unavailableItems.map((i) => i.product.name).join(", ")}.
            </div>
          )}
          {!storeOpen && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--rose-200)] bg-[var(--brand-900)] texture-sprinkles text-[var(--cream)] px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <MoonStar className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">Nossa cozinha está descansando.</p>
                <p className="mt-0.5 text-[var(--rose-100)]/90">
                  Abrimos das {storeSettings.openTime} às {storeSettings.closeTime} — você pode montar o pedido, mas a finalização está pausada até lá.
                </p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--rose-200)] shadow-[0_10px_30px_-16px_rgba(75,40,32,0.3)] overflow-hidden card-lift">
            <div className="p-4 sm:p-6 sm:pb-4 pb-4">
              <h2 className="font-display text-lg font-bold text-[var(--brand-900)] uppercase tracking-wide mb-1 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[var(--brand-700)]" />
                Itens do pedido
              </h2>
              <p className="text-xs text-[var(--muted)] mb-5">{cartCount} {cartCount === 1 ? "doce" : "doces"} na sacola</p>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[var(--muted)]">Seu carrinho está vazio</p>
                  <button
                    onClick={() => router.push("/cardapio")}
                    className="mt-1 inline-flex min-h-10 items-center px-2 text-sm text-[var(--brand-700)] underline transition-colors hover:text-[var(--brand-800)]"
                  >
                    Adicionar produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="pb-5 last:pb-0 border-b border-dashed border-[var(--rose-200)] last:border-b-0"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[var(--rose-50)] overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            placeholder="blur"
                            blurDataURL={productBlurPlaceholder}
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-base font-semibold text-[var(--ink)]">
                                {item.product.name}
                                {item.product.available === false && (
                                  <span className="ml-2 align-middle inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600 uppercase">
                                    Pausado
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-[var(--muted)] mt-0.5">
                                {item.quantity}x • <Price value={item.product.price} />
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => setEditItem(item)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-blue-500 transition-colors hover:bg-blue-50"
                                aria-label="Editar item"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteItem(item)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50"
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

                          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-3">
                            <div className="flex items-center border border-[var(--rose-200)] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-9 w-9 flex items-center justify-center text-[var(--brand-700)] hover:bg-[var(--rose-100)] disabled:opacity-50 transition-colors"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-10 text-center font-display text-sm font-bold text-[var(--ink)]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-9 w-9 flex items-center justify-center text-[var(--brand-700)] hover:bg-[var(--rose-100)] transition-colors"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <Price
                              value={item.product.price * item.quantity}
                              className="font-display text-lg font-bold text-[var(--brand-800)]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <>
                {wantsDelivery && (
                  <div className="px-6 pt-5">
                    <FreeShippingProgress subtotal={total} />
                  </div>
                )}
                <div className="bg-[var(--brand-900)] texture-sprinkles px-6 py-5 space-y-1.5 text-[var(--cream)]">
                <div className="flex items-center justify-between text-sm text-[var(--rose-100)]">
                  <span>Subtotal</span>
                  <Price value={total} className="font-semibold text-white" />
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--rose-100)]">
                  <span>Entrega</span>
                  <span>
                    {!wantsDelivery
                      ? "Grátis (retirada)"
                      : freeShipping
                        ? "Grátis"
                        : formatBRL(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-3">
                  <span className="font-display text-base font-bold uppercase tracking-widest">Total</span>
                  <Price value={grandTotal} className="font-display text-2xl font-extrabold" />
                </div>
                {wantsDelivery && freeShipping && (
                  <p className="text-[11px] font-semibold text-green-300">
                    Frete grátis aplicado no seu pedido!
                  </p>
                )}
              </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <>
              <div className="bg-white rounded-2xl border border-[var(--rose-200)] shadow-sm p-4 sm:p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-[var(--brand-800)] uppercase tracking-wide">
                  SEUS DADOS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      NOME <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      autoComplete="name"
                      maxLength={120}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                      required
                    />
                    {triedSubmit && formErrors.customerName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.customerName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                      TELEFONE <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(maskPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      inputMode="tel"
                      autoComplete="tel"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                      required
                    />
                    {triedSubmit && formErrors.customerPhone && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[var(--radius-card-lg)] border border-[var(--rose-200)] shadow-[0_10px_30px_-16px_rgba(75,40,32,0.3)] p-4 sm:p-6">
                <h2 className="font-display text-lg font-bold text-[var(--brand-900)] uppercase tracking-wide mb-5">
                  Deseja receber em casa?
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Deseja receber o pedido em casa?">
                  {[
                    { value: "sim" as const, icon: Bike, title: "Entrega", desc: "Receber em casa" },
                    { value: "nao" as const, icon: Store, title: "Retirada", desc: "Buscar na loja" },
                  ].map((opt) => {
                    const selected = deliveryOption === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDeliveryOption(opt.value)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${selected ? "border-[var(--brand-700)] bg-[var(--rose-50)] shadow-sm" : "border-[var(--rose-200)] bg-white hover:border-[var(--ring)]"}`}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? "bg-[var(--brand-900)] text-[var(--cream)]" : "bg-[var(--rose-100)] text-[var(--brand-700)]"}`}>
                          <opt.icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-[var(--ink)]">{opt.title}</span>
                          <span className="block text-xs text-[var(--muted)]">{opt.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {deliveryOption === "sim" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-5">
                    <div>
                      <label htmlFor="checkout-address" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                        ENDEREÇO :
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Digite seu endereço"
                        autoComplete="street-address"
                        maxLength={200}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                      />
                        {triedSubmit && formErrors.address && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="checkout-datetime" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                          DATA e HORA :
                        </label>
                        <input
                          id="checkout-datetime"
                          type="datetime-local"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                        />
                        {triedSubmit && formErrors.deliveryDateTime && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.deliveryDateTime}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="checkout-notes" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                          OBSERVAÇÕES GERAIS :
                        </label>
                        <textarea
                          id="checkout-notes"
                          value={observations}
                          onChange={(e) => setObservations(e.target.value)}
                          placeholder="Ex: Deixar na portaria"
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm resize-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-3">
                        MARQUE O ENDEREÇO DE ENTREGA
                      </h3>
                      <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-gray-300">
                        {debouncedAddress.trim() ? (
                          <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedAddress)}&output=embed`}
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
                        <label htmlFor="checkout-datetime-pickup" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                          DATA e HORA :
                        </label>
                        <input
                          id="checkout-datetime-pickup"
                          type="datetime-local"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[var(--rose-200)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--brand-600)] focus:ring-1 focus:ring-[var(--brand-600)] text-sm transition-colors"
                        />
                        {triedSubmit && formErrors.deliveryDateTime && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.deliveryDateTime}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="checkout-notes-pickup" className="block text-sm font-semibold text-[var(--brand-800)] uppercase tracking-wide mb-1.5">
                          OBSERVAÇÕES GERAIS :
                        </label>
                        <textarea
                          id="checkout-notes-pickup"
                          value={observations}
                          onChange={(e) => setObservations(e.target.value)}
                          placeholder="Ex: Quanto antes, melhor"
                          rows={3}
                          maxLength={500}
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

                <div className="mt-6 flex flex-col items-center gap-2">
                  <Button
                    onClick={handleFinalize}
                    disabled={submitting || items.length === 0 || !isFormValid || unavailableItems.length > 0 || !storeOpen}
                    title={
                      items.length === 0
                        ? "Adicione itens ao carrinho"
                        : !storeOpen
                          ? `Estamos fechados — abrimos das ${storeSettings.openTime} às ${storeSettings.closeTime}`
                          : unavailableItems.length > 0
                            ? "Remova os itens pausados para continuar"
                            : !isFormValid
                              ? (firstCheckoutError({
                                  customerName,
                                  customerPhone,
                                  delivery: deliveryOption === "sim",
                                  address,
                                  deliveryDateTime: deliveryDate,
                                }) ?? "Preencha os dados corretamente")
                              : undefined
                    }
                    className="w-full max-w-md h-14 text-sm min-[360px]:text-base font-bold rounded-full uppercase tracking-wider min-[360px]:tracking-widest shadow-[0_12px_28px_-10px_rgba(116,49,45,0.7)] disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      `Fazer pedido • ${formatBRL(grandTotal)}`
                    )}
                  </Button>
                  {!storeOpen && items.length > 0 && (
                    <p className="text-xs text-[var(--muted)] text-center">
                      Finalização pausada — abrimos das {storeSettings.openTime} às {storeSettings.closeTime}.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <ProductModal
        product={editItem?.product ?? null}
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onAddToCart={() => {}}
        editItem={editItem}
        onSaveEdit={handleSaveEdit}
      />

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="max-w-sm p-6 text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--ink)]">
              Remover item
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirme se deseja remover este item do carrinho.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)] mb-6">
            Tem certeza que deseja remover <strong>{deleteItem?.product.name}</strong> do carrinho?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setDeleteItem(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteItem) removeItem(deleteItem.id);
                setDeleteItem(null);
              }}
            >
              Sim, remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
