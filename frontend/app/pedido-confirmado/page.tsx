"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/menu/Header";
import { useCart } from "@/lib/cart-context";

export default function PedidoConfirmadoPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body flex flex-col">
      <Header cartCount={0} onCartClick={() => { }} />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-[var(--radius-hero)] border border-[var(--rose-200)] shadow-[0_28px_60px_-24px_rgba(75,40,32,0.45)] p-8 sm:p-10 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden"
        >
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[var(--brand-900)] texture-sprinkles" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 h-6 rotate-180 bg-[var(--brand-900)]" style={{ maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,64C240,110 480,20 720,55C960,90 1200,110 1440,60L1440,120L0,120Z'/%3E%3C/svg%3E\")", maskPosition: "top", maskSize: "100% 100%", WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,64C240,110 480,20 720,55C960,90 1200,110 1440,60L1440,120L0,120Z'/%3E%3C/svg%3E\")", WebkitMaskPosition: "top", WebkitMaskSize: "100% 100%" }} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
            className="relative mt-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
              <Check className="h-10 w-10 text-green-700" strokeWidth={3} />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="relative mt-5 font-script text-3xl text-[var(--brand-700)]"
          >
            oba, pedido feito!
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-display text-2xl font-bold text-[var(--brand-900)] mt-1 mb-3 tracking-tight"
          >
            Recebido com carinho
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-[32ch]"
          >
            Seu pedido já entrou na nossa fila de produção. Avisaremos quando estiver saindo do forno.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex w-full flex-col gap-2.5"
          >
            <Button
              onClick={() => router.push("/meus-pedidos")}
              className="h-12 w-full text-sm font-bold rounded-full"
              size="lg"
            >
              Acompanhar meu pedido
            </Button>
            <Button
              onClick={() => router.push("/cardapio")}
              variant="outline"
              className="h-12 w-full text-sm font-bold rounded-full border-[var(--rose-200)]"
              size="lg"
            >
              Voltar ao cardápio
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
