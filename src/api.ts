import type { FilterMeta, ProductFilters, Product } from "./types";

/** In dev, use relative /api (Vite proxy). In production, use VITE_API_URL. */
const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? ""
  : "";

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export async function fetchProducts(
  filters: ProductFilters
): Promise<{ products: Product[]; meta: FilterMeta; count: number }> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.source) params.set("source", filters.source);
  if (filters.model) params.set("model", filters.model);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.sort) params.set("sort", filters.sort);

  const res = await fetch(apiUrl(`/api/products?${params}`));
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function refreshCatalog(): Promise<void> {
  const res = await fetch(apiUrl("/api/refresh"), { method: "POST" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to refresh catalog");
  }
}
