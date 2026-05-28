import { useState } from "react";
import type { Product } from "../types";
import { getProductImageSrc } from "../product-image";

const SOURCE_LABELS: Record<string, string> = {
  bimmerworld: "BimmerWorld",
  ind: "IND",
  arm: "ARM",
  amazon: "Amazon",
  novaracing: "Nova Racing",
  turbobrothers: "Turbo Brothers",
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = getProductImageSrc(product);
  const showImage = Boolean(imageSrc) && !imgError;

  const priceLabel =
    product.price != null
      ? new Intl.NumberFormat(
          product.currency === "BRL" ? "pt-BR" : "en-US",
          {
            style: "currency",
            currency: product.currency || "USD",
          }
        ).format(product.price)
      : "Price on request";

  const handleClick = () => {
    window.open(product.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className="product-card"
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${product.title} — open on retailer site`}
    >
      <div className="product-card__image-wrap">
        {showImage ? (
          <img
            src={imageSrc!}
            alt={product.title}
            className="product-card__image"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-card__placeholder" aria-hidden>
            <span>BMW</span>
          </div>
        )}
        <span className={`product-card__badge product-card__badge--${product.source}`}>
          {SOURCE_LABELS[product.source] ?? product.source}
        </span>
      </div>
      <div className="product-card__body">
        <p className="product-card__model">{product.model}</p>
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__brand">{product.brand}</p>
        <p className="product-card__price">{priceLabel}</p>
        {product.inStock && (
          <span className="product-card__stock">In stock</span>
        )}
      </div>
    </article>
  );
}
