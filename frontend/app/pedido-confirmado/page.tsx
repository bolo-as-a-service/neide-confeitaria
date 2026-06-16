"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
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

      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl border border-[var(--rose-200)] shadow-lg p-10 max-w-md w-full flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-display text-3xl font-bold text-[var(--brand-800)] mb-3"
          >
            PEDIDO FEITO!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-base text-[var(--muted)] leading-relaxed mb-8"
          >
            Seu pedido foi realizado com sucesso e já está sendo preparado com carinho.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Button
              onClick={() => router.push("/cardapio")}
              className="h-12 px-8 text-base font-semibold rounded-xl"
              size="lg"
            >
              Voltar ao início
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
