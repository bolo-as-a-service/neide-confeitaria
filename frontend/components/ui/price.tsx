/** Formatação monetária padrão da loja (pt-BR, BRL). */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface PriceProps {
  value: number;
  className?: string;
}

/** Preço formatado em pt-BR — use em vez de repetir Intl.NumberFormat. */
export function Price({ value, className }: PriceProps) {
  return <span className={className}>{formatBRL(value)}</span>;
}
