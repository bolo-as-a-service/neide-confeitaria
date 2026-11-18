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

export function SearchBar({ value, onChange, placeholder = "Buscar bolo, doce, salgado..." }: SearchBarProps) {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)] pointer-events-none" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar no cardápio"
          className="pl-11 pr-11 h-12 rounded-full border-[var(--rose-200)] bg-white/95 text-[var(--ink)] placeholder:text-[var(--muted)] shadow-[0_6px_20px_-10px_rgba(75,40,32,0.25)] focus:border-[var(--brand-600)] focus:ring-2 focus:ring-[var(--ring)] scroll-mt-64"
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