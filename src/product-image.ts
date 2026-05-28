import type { Product } from "./types";

export function getProductImageSrc(product: Product): string | null {
  return product.imageUrl ?? null;
}
