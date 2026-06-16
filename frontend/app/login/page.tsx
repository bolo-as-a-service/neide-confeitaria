"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(1, "Insira seu email ou telefone"),
  password: z.string().min(1, "Insira sua senha"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const handleSubmit = form.handleSubmit(async () => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsPending(false);
  });

  return (
    <div className="flex min-h-screen flex-row items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--brand-900)]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--rose-200)]/40 blur-[140px]" />
      </div>

      <div className="z-10 w-full flex flex-col lg:flex-row items-stretch justify-center max-w-[90%] lg:max-w-[65%] bg-white/85 rounded-3xl border border-[var(--rose-200)] gap-3">
        <div className="text-center bg-[#31130c] p-8 lg:p-12 rounded-3xl lg:w-[50%] flex flex-col justify-between">
          <div className="flex flex-col items-center justify-center mt-12">
            <h1 className="font-script text-4xl lg:text-6xl leading-none text-[var(--page-bg)]">
              Neide
            </h1>
            <p className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.45em] text-[var(--page-bg)]">
              Confeitaria
            </p>
            <p className="mt-3 text-sm text-[var(--page-bg)] animate-[fadeUp_0.7s_ease-out_0.2s_both]">
              Acesse sua conta para acompanhar seus pedidos e preferências.
            </p>
          </div>

          <div className="mt-8 text-center animate-[fadeUp_0.7s_ease-out_0.5s_both]">
            <Link
              href="/"
              className="text-xs font-medium text-[var(--page-bg)] underline-offset-2 hover:text-[var(--page-bg)] hover:underline"
            >
              ← Voltar para o cardápio
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8 lg:w-[50%]">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-[var(--brand-900)]">
              Login
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Entre com suas credenciais para acessar seu pedido
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email ou telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        href="/recuperar-senha"
                        className="text-xs font-semibold text-[var(--brand-600)] underline-offset-2 hover:underline"
                      >
                        Esqueceu?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
                          tabIndex={-1}
                          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  {...form.register("remember")}
                  className="h-4 w-4 rounded border-[var(--rose-200)] text-[var(--brand-700)] accent-[var(--brand-700)]"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-xs font-medium text-[var(--muted)]"
                >
                  Lembrar de mim
                </label>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="relative h-12 w-full overflow-hidden rounded-full text-base"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>

          {/* <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--rose-200)]" />
            <span className="text-xs font-medium text-[var(--muted)]">ou</span>
            <div className="h-px flex-1 bg-[var(--rose-200)]" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-4 h-12 w-full rounded-full text-sm"
            disabled={isPending}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </Button> */}

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--brand-700)] underline-offset-2 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>


      </div>

    </div>
  );
}
