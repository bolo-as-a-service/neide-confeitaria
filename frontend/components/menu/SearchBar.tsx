"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Encontre seu pedido..." }: SearchBarProps) {
  return (
    <div className="px-4 pb-4">
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-11 pr-11 h-11 rounded-xl border-[var(--rose-200)] bg-white/90 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand-600)] focus:ring-[var(--brand-600)]"
        />
        {value && (
          <Button
            type="button"
            onClick={() => onChange("")}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--brand-800)]"
            aria-label="Limpar pesquisa"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}