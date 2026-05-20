import type { Product } from "./types";

const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? ""
  : "";

/** Turner images are served from our cache — CDN blocks direct browser loads. */
export function getProductImageSrc(product: Product): string | null {
  if (!product.imageUrl) return null;

  if (product.imageUrl.startsWith("/api/product-images/")) {
    return `${API_BASE}${product.imageUrl}`;
  }

  if (product.source === "turner") {
    return null;
  }

  return product.imageUrl;
}
