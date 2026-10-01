import { z } from "zod";

/**
 * Taxa fixa de entrega (issue #29).
 * INTERIM: tabela por bairro ou Distance Matrix deve vir do backend;
 * enquanto isso, valor único e explícito no resumo do pedido.
 */
export const DELIVERY_FEE = 7.9;

/** Remove tudo que não for dígito. */
export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Máscara (99) 99999-9999 (11 dígitos) ou (99) 9999-9999 (10 dígitos). */
export function maskPhone(value: string): string {
  const digits = stripPhoneDigits(value);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Informe seu nome"),
    customerPhone: z
      .string()
      .transform(stripPhoneDigits)
      .refine((d) => d.length === 10 || d.length === 11, {
        message: "Telefone inválido (10 ou 11 dígitos)",
      }),
    delivery: z.boolean(),
    address: z.string().trim(),
    deliveryDateTime: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.delivery && data.address.length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: "Endereço obrigatório para entrega",
      });
    }
    if (data.deliveryDateTime) {
      const dt = new Date(data.deliveryDateTime);
      if (Number.isNaN(dt.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryDateTime"],
          message: "Data/hora inválida",
        });
      } else if (dt.getTime() < Date.now() - 60_000) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryDateTime"],
          message: "Data/hora não pode ser no passado",
        });
      }
    }
  });

export type CheckoutForm = z.input<typeof checkoutSchema>;

export function validateCheckout(form: CheckoutForm): Record<string, string> {
  const result = checkoutSchema.safeParse(form);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export function firstCheckoutError(form: CheckoutForm): string | null {
  const errors = validateCheckout(form);
  return (
    errors.customerName ??
    errors.customerPhone ??
    errors.address ??
    errors.deliveryDateTime ??
    null
  );
}
