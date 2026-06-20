"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { api } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().min(1, "Insira seu email ou telefone"),
  password: z.string().min(1, "Insira sua senha"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    setError("");
    try {
      const user = await api.login({ email: data.email, password: data.password });
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsPending(false);
    }
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

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

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
