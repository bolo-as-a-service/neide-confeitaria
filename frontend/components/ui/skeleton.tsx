import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("skeleton-shimmer rounded-xl", className)}
    />
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-[208px] sm:w-[228px] flex-shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--rose-200)] bg-white shadow-sm",
        className
      )}
    >
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="flex gap-4 overflow-hidden pb-2 lg:grid lg:grid-cols-2 xl:grid-cols-3"
      aria-label="Carregando produtos"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} className="lg:w-full" />
      ))}
    </div>
  );
}

/** Esqueleto da tabela de produtos do admin (shimmer). */
export function AdminProductTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" aria-label="Carregando produtos">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--rose-200)] bg-white px-4 py-3"
        >
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5 rounded-full" />
            <Skeleton className="h-3 w-3/5 rounded-full" />
          </div>
          <Skeleton className="hidden sm:block h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Esqueleto do kanban de pedidos do admin (shimmer). */
export function KanbanSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div
      className="flex gap-4 pb-4 overflow-x-auto"
      aria-label="Carregando pedidos"
    >
      {Array.from({ length: columns }).map((_, col) => (
        <div
          key={col}
          className="w-80 flex-shrink-0 rounded-[var(--radius-card)] border border-[var(--rose-200)] bg-white overflow-hidden"
        >
          <Skeleton className="h-[52px] rounded-none" />
          <div className="space-y-3 p-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--rose-200)] p-3 space-y-2"
              >
                <Skeleton className="h-4 w-1/3 rounded-full" />
                <Skeleton className="h-3 w-2/3 rounded-full" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
