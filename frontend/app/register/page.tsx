"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

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
import { api, ApiError } from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().trim().email("Insira um email válido"),
    phone: z.string().min(10, "Telefone inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    setError("");
    try {
      await api.register({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        // Espelha erros por campo do backend no formulário.
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          const name = field as keyof RegisterFormValues;
          if (name in form.getValues()) {
            form.setError(name, { message });
          }
        }
      }
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Erro ao criar conta"
      );
    } finally {
      setIsPending(false);
    }
  });

  if (isSuccess) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--page-bg)] px-4">
        <div className="animate-[popIn_0.6s_ease-out] text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-700)] shadow-lg shadow-[var(--brand-700)]/20">
            <Sparkles className="h-10 w-10 text-[var(--cream)]" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-[var(--brand-900)]">
            Conta criada!
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Bem-vinda à Neide Confeitaria
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--brand-700)] px-8 text-sm font-semibold text-[var(--cream)] shadow-sm transition hover:bg-[var(--brand-800)]"
            >
              Acessar minha conta
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--brand-600)] hover:underline"
            >
              ← Voltar para o cardápio
            </Link>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex min-h-dvh justify-center overflow-y-auto bg-[var(--page-bg)] px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--brand-900)]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--rose-200)]/40 blur-[140px]" />
      </div>

      <div className="z-10 m-auto w-full flex flex-col lg:flex-row items-stretch justify-center max-w-[90%] lg:max-w-[920px] bg-white rounded-[var(--radius-hero)] border border-[var(--rose-200)] shadow-[0_24px_60px_-24px_rgba(75,40,32,0.4)] overflow-hidden">
        <div className="text-center bg-[#31130c] texture-sprinkles p-8 lg:p-12 lg:w-[46%] flex flex-col justify-between relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--brand-700)]/40 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#8a3b35]/30 blur-2xl" />
          <div className="relative flex flex-col items-center justify-center mt-8 lg:mt-12">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cream)]/12 ring-1 ring-white/25 font-script text-3xl text-[var(--cream)]">N</span>
            <h1 className="font-script text-4xl lg:text-6xl leading-none text-[var(--page-bg)]">
              Neide
            </h1>
            <p className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.45em] text-[var(--rose-200)]">
              Confeitaria
            </p>
            <div className="mt-4 flex items-center gap-1.5" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#f1baad]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9efec]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c08d82]" />
            </div>
            <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-[var(--page-bg)]/90 animate-[fadeUp_0.7s_ease-out_0.2s_both]">
              Crie sua conta para acompanhar seus pedidos e preferências
            </p>
          </div>

          <div className="relative mt-8 text-center animate-[fadeUp_0.7s_ease-out_0.5s_both]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--rose-200)] underline-offset-4 hover:text-white hover:underline"
            >
              ← Voltar para o cardápio
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 lg:w-[54%]">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-[var(--brand-900)]">
              Criar conta
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Preencha os dados para se cadastrar
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="name"
                        placeholder="Seu nome"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="email"
                          placeholder="email@exemplo.com"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          autoComplete="tel"
                          placeholder="(11) 99999-9999"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Mínimo de 6 caracteres"
                          className="h-11 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--rose-100)] hover:text-[var(--ink)]"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Repita a senha"
                          className="h-11 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--rose-100)] hover:text-[var(--ink)]"
                          tabIndex={-1}
                          aria-label={
                            showConfirm ? "Esconder senha" : "Mostrar senha"
                          }
                        >
                          {showConfirm ? (
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

              <Button
                type="submit"
                disabled={isPending}
                className="relative h-12 w-full overflow-hidden rounded-full text-base"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--brand-700)] underline-offset-2 hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
