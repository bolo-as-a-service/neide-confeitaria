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
import { api } from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().email("Insira um email válido"),
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
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsPending(false);
    }
  });

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--page-bg)] px-4">
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
              Crie sua conta para acompanhar seus pedidos e preferências
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
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
