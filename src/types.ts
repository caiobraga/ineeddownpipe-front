export type ProductSource =
  | "amazon"
  | "bimmerworld"
  | "turner"
  | "ind"
  | "arm";

export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  url: string;
  source: ProductSource;
  model: string;
  partNumber?: string;
  inStock?: boolean;
  scrapedAt: string;
}

export interface FilterMeta {
  models: string[];
  brands: string[];
  sources: ProductSource[];
  priceRange: { min: number; max: number };
  total: number;
  catalogUpdatedAt?: string | null;
}

export interface ProductFilters {
  search: string;
  source: string;
  model: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}
